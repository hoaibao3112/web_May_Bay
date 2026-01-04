import { Injectable, BadRequestException, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { randomBytes } from 'crypto';

@Injectable()
export class CheckinService {
  constructor(private prisma: PrismaService) {}

  // Check-in online
  async checkinOnline(hanhKhachId: number, soGhe?: string) {
    const hanhKhach = await this.prisma.hanhKhach.findUnique({
      where: { id: hanhKhachId },
      include: {
        donDatVe: {
          include: {
            changBay: {
              include: {
                chuyenBay: {
                  include: { hang: true },
                },
                sanBayDi: true,
                sanBayDen: true,
              },
            },
          },
        },
      },
    });

    if (!hanhKhach) {
      throw new NotFoundException('Không tìm thấy hành khách');
    }

    // Kiểm tra booking đã thanh toán chưa
    if (hanhKhach.donDatVe.trangThai !== 'DA_THANH_TOAN') {
      throw new BadRequestException('Đơn đặt vé chưa được thanh toán');
    }

    // Kiểm tra đã check-in chưa
    if (hanhKhach.daCheckin) {
      throw new BadRequestException('Hành khách đã check-in rồi');
    }

    // Kiểm tra thời gian check-in (24 giờ trước giờ bay - 1 giờ trước giờ bay)
    const gioDi = new Date(hanhKhach.donDatVe.changBay.gioDi);
    const now = new Date();
    const hoursUntilDeparture = (gioDi.getTime() - now.getTime()) / (1000 * 60 * 60);

    if (hoursUntilDeparture > 24) {
      throw new BadRequestException('Chưa đến thời gian check-in (24 giờ trước giờ bay)');
    }

    if (hoursUntilDeparture < 1) {
      throw new BadRequestException('Đã hết thời gian check-in (1 giờ trước giờ bay)');
    }

    // Cập nhật check-in
    const maBoardingPass = this.generateBoardingPassNumber();

    const updated = await this.prisma.hanhKhach.update({
      where: { id: hanhKhachId },
      data: {
        daCheckin: true,
        thoiGianCheckin: new Date(),
        maBoardingPass: maBoardingPass,
        ...(soGhe && { soGhe: soGhe }),
      },
    });

    return {
      message: 'Check-in thành công',
      hanhKhachId,
      maBoardingPass,
      soGhe: updated.soGhe,
      gioDi: gioDi,
    };
  }

  // Lấy thẻ lên máy bay
  async getBoardingPass(hanhKhachId: number) {
    const hanhKhach = await this.prisma.hanhKhach.findUnique({
      where: { id: hanhKhachId },
      include: {
        donDatVe: {
          include: {
            changBay: {
              include: {
                chuyenBay: {
                  include: { hang: true },
                },
                sanBayDi: true,
                sanBayDen: true,
              },
            },
            hangVe: {
              include: { khoangVe: true },
            },
          },
        },
        ve: true,
      },
    });

    if (!hanhKhach) {
      throw new NotFoundException('Không tìm thấy hành khách');
    }

    if (!hanhKhach.daCheckin) {
      throw new BadRequestException('Hành khách chưa check-in');
    }

    const changBay = hanhKhach.donDatVe.changBay;

    return {
      maBoardingPass: hanhKhach.maBoardingPass,
      hoTen: `${hanhKhach.ho} ${hanhKhach.ten}`,
      soVe: hanhKhach.ve?.[0]?.soVe,
      soGhe: hanhKhach.soGhe,
      khoangVe: hanhKhach.donDatVe.hangVe.khoangVe.tenKhoang,
      chuyenBay: {
        soHieu: changBay.chuyenBay.soHieuChuyenBay,
        hangHangKhong: changBay.chuyenBay.hang.tenHang,
      },
      sanBayDi: {
        ma: changBay.sanBayDi.maSanBay,
        ten: changBay.sanBayDi.tenSanBay,
      },
      sanBayDen: {
        ma: changBay.sanBayDen.maSanBay,
        ten: changBay.sanBayDen.tenSanBay,
      },
      gioDi: changBay.gioDi,
      gioDen: changBay.gioDen,
      gioCheckin: hanhKhach.thoiGianCheckin,
      qrCode: this.generateQRCode(hanhKhach.maBoardingPass),
    };
  }

  // Kiểm tra tình trạng check-in
  async getCheckinStatus(bookingId: number) {
    const hanhKhachs = await this.prisma.hanhKhach.findMany({
      where: { donDatVeId: bookingId },
      select: {
        id: true,
        ho: true,
        ten: true,
        daCheckin: true,
        thoiGianCheckin: true,
        soGhe: true,
        maBoardingPass: true,
      },
    });

    const totalPassengers = hanhKhachs.length;
    const checkedInCount = hanhKhachs.filter((h) => h.daCheckin).length;

    return {
      bookingId,
      tongSoHanhKhach: totalPassengers,
      daDaCheckin: checkedInCount,
      chuaCheckin: totalPassengers - checkedInCount,
      hanhKhach: hanhKhachs,
    };
  }

  // Hủy check-in
  async cancelCheckin(hanhKhachId: number) {
    const hanhKhach = await this.prisma.hanhKhach.findUnique({
      where: { id: hanhKhachId },
      include: {
        donDatVe: {
          include: {
            changBay: true,
          },
        },
      },
    });

    if (!hanhKhach || !hanhKhach.daCheckin) {
      throw new BadRequestException('Hành khách chưa check-in');
    }

    // Kiểm tra thời gian (chỉ hủy được trước 2 giờ giờ bay)
    const gioDi = new Date(hanhKhach.donDatVe.changBay.gioDi);
    const now = new Date();
    const hoursUntilDeparture = (gioDi.getTime() - now.getTime()) / (1000 * 60 * 60);

    if (hoursUntilDeparture < 2) {
      throw new BadRequestException('Không thể hủy check-in khi còn dưới 2 giờ trước giờ bay');
    }

    await this.prisma.hanhKhach.update({
      where: { id: hanhKhachId },
      data: {
        daCheckin: false,
        thoiGianCheckin: null,
        maBoardingPass: null,
      },
    });

    return { message: 'Đã hủy check-in thành công' };
  }

  // Kiểm tra điều kiện check-in
  async checkEligibility(bookingId: number) {
    const booking = await this.prisma.donDatVe.findUnique({
      where: { id: bookingId },
      include: {
        changBay: true,
        hanhKhach: true,
      },
    });

    if (!booking) {
      throw new NotFoundException('Không tìm thấy đặt chỗ');
    }

    const gioDi = new Date(booking.changBay.gioDi);
    const now = new Date();
    const hoursUntilDeparture = (gioDi.getTime() - now.getTime()) / (1000 * 60 * 60);

    const eligible = booking.trangThai === 'DA_THANH_TOAN' && hoursUntilDeparture <= 24 && hoursUntilDeparture >= 1;

    return {
      eligible,
      trangThaiDatCho: booking.trangThai,
      gioDi: gioDi,
      gioConLai: Math.max(0, hoursUntilDeparture),
      lyDo: !eligible
        ? booking.trangThai !== 'DA_THANH_TOAN'
          ? 'Đơn đặt vé chưa thanh toán'
          : hoursUntilDeparture > 24
          ? 'Chưa đến thời gian check-in'
          : 'Đã hết thời gian check-in'
        : null,
      tongSoHanhKhach: booking.hanhKhach.length,
      daCheckin: booking.hanhKhach.filter((h) => h.daCheckin).length,
    };
  }

  // Generate mã boarding pass
  private generateBoardingPassNumber(): string {
    return 'BP' + randomBytes(6).toString('hex').toUpperCase();
  }

  // Generate QR code (URL hoặc data string)
  private generateQRCode(maBoardingPass: string): string {
    // Trong thực tế, sẽ sử dụng thư viện như qrcode để generate
    return `https://baynhanh.vn/checkin/${maBoardingPass}`;
  }
}
