import {
  Injectable,
  BadRequestException,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateBookingDto } from './dto/create-booking.dto';
import { AddPassengerDto } from './dto/add-passenger.dto';
import { AddContactDto } from './dto/add-contact.dto';
import { Cron, CronExpression } from '@nestjs/schedule';
import { randomBytes } from 'crypto';

@Injectable()
export class BookingsService {
  constructor(private prisma: PrismaService) { }

  // Tạo đơn đặt vé và giữ chỗ
  async createBooking(dto: CreateBookingDto, userId?: number) {
    console.log('Creating booking with:', {
      changBayId: dto.changBayId,
      hangVeId: dto.hangVeId,
      changBayIdType: typeof dto.changBayId,
      hangVeIdType: typeof dto.hangVeId,
    });

    // Debug: Kiểm tra tất cả GiaVe cho changBayId này
    const allGiaVeForChangBay = await this.prisma.giaVe.findMany({
      where: { changBayId: dto.changBayId },
      select: {
        id: true,
        changBayId: true,
        hangVeId: true,
        giaBan: true,
        soLuongGheTrong: true,
      },
    });
    console.log('All GiaVe for changBayId', dto.changBayId, ':', allGiaVeForChangBay);

    // Tìm giá vé theo changBayId và hangVeId
    const giaVe = await this.prisma.giaVe.findFirst({
      where: {
        changBayId: dto.changBayId,
        hangVeId: dto.hangVeId,
      },
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
        hangVe: true,
      },
    });

    console.log('Found giaVe:', giaVe ? {
      id: giaVe.id,
      soLuongGheTrong: giaVe.soLuongGheTrong,
      changBayId: giaVe.changBayId,
      hangVeId: giaVe.hangVeId,
    } : null);

    if (!giaVe || giaVe.soLuongGheTrong < 1) {
      throw new BadRequestException('Không còn chỗ trống cho chuyến bay này');
    }

    // Tính tổng tiền (tạm tính cho 1 người)
    const tongTien = Number(giaVe.giaBan);

    // Tạo mã đặt vé
    const maDatVe = this.generatePNR();

    // Thời hạn giữ chỗ: 15 phút
    const hetHanGiuCho = new Date(Date.now() + 15 * 60 * 1000);

    // Tạo booking
    const booking = await this.prisma.donDatVe.create({
      data: {
        maDatVe,
        nguoiDungId: userId,
        changBayId: dto.changBayId,
        hangVeId: dto.hangVeId,
        trangThai: 'GIU_CHO',
        tongTien,
        tienTe: 'VND',
        hetHanGiuCho,
        searchSessionId: dto.searchSessionId,
      },
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
        hangVe: true,
      },
    });

    // Thêm thông tin liên hệ nếu có
    if (dto.thongTinLienHe) {
      await this.prisma.thongTinLienHe.create({
        data: {
          donDatVeId: booking.id,
          hoTen: dto.thongTinLienHe.email.split('@')[0], // Tạm dùng email làm tên
          email: dto.thongTinLienHe.email,
          soDienThoai: dto.thongTinLienHe.soDienThoai,
        },
      });
    }

    // Thêm hành khách nếu có
    if (dto.hanhKhach && dto.hanhKhach.length > 0) {
      await Promise.all(
        dto.hanhKhach.map((hk) =>
          this.prisma.hanhKhach.create({
            data: {
              donDatVeId: booking.id,
              loai: hk.loai as any,
              ho: hk.ho,
              ten: hk.ten,
              gioiTinh: hk.gioiTinh,
              ngaySinh: new Date(hk.ngaySinh),
              quocTich: hk.quocTich,
            },
          })
        )
      );
    }

    // Giảm số chỗ còn lại (tạm giữ)
    await this.prisma.giaVe.update({
      where: { id: giaVe.id },
      data: { soLuongGheTrong: giaVe.soLuongGheTrong - 1 },
    });

    return booking;
  }

  // Thêm hành khách
  async addPassenger(bookingId: number, dto: AddPassengerDto) {
    const booking = await this.prisma.donDatVe.findUnique({
      where: { id: bookingId },
    });

    if (!booking) {
      throw new NotFoundException('Không tìm thấy đơn đặt vé');
    }

    if (booking.trangThai !== 'GIU_CHO') {
      throw new BadRequestException('Không thể thêm hành khách cho đơn đặt vé này');
    }

    const passenger = await this.prisma.hanhKhach.create({
      data: {
        donDatVeId: bookingId,
        loai: dto.loai,
        ho: dto.ho.toUpperCase(),
        ten: dto.ten.toUpperCase(),
        gioiTinh: dto.gioiTinh,
        ngaySinh: new Date(dto.ngaySinh),
        soCccd: dto.soCccd,
        soHoChieu: dto.soHoChieu,
        ngayHetHan: dto.ngayHetHan ? new Date(dto.ngayHetHan) : null,
        quocTich: dto.quocTich,
      },
    });

    return passenger;
  }

  // Thêm thông tin liên hệ
  async addContact(bookingId: number, dto: AddContactDto) {
    const booking = await this.prisma.donDatVe.findUnique({
      where: { id: bookingId },
    });

    if (!booking) {
      throw new NotFoundException('Không tìm thấy đơn đặt vé');
    }

    const contact = await this.prisma.thongTinLienHe.upsert({
      where: { donDatVeId: bookingId },
      update: dto,
      create: {
        donDatVeId: bookingId,
        ...dto,
      },
    });

    return contact;
  }

  // Lấy thông tin booking
  async getBookingById(id: number) {
    try {
      const booking = await this.prisma.donDatVe.findUnique({
        where: { id },
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
          hangVe: true,
          hanhKhach: true,
          thongTinLienHe: true,
          thanhToan: true,
          ve: {
            include: {
              hanhKhach: true,
            },
          },
        },
      });

      if (!booking) {
        throw new NotFoundException('Không tìm thấy đơn đặt vé');
      }

      console.log('Booking found:', {
        id: booking.id,
        hasChangBay: !!booking.changBay,
        hasChuyenBay: !!booking.changBay?.chuyenBay,
      });

      // Transform changBay to include formatted date/time fields
      if (booking.changBay && booking.changBay.chuyenBay) {
        const transformedBooking = {
          ...booking,
          changBay: {
            ...booking.changBay,
            chuyenBay: {
              ...booking.changBay.chuyenBay,
              soHieu: booking.changBay.chuyenBay.soHieuChuyenBay,
            },
            ngayKhoiHanh: booking.changBay.gioDi.toISOString().split('T')[0],
            gioKhoiHanh: booking.changBay.gioDi.toTimeString().slice(0, 5),
            gioDen: booking.changBay.gioDen.toTimeString().slice(0, 5),
          },
        };
        return transformedBooking;
      }

      return booking;
    } catch (error) {
      // Xử lý lỗi Prisma khi hanhKhach null
      if (error.message && error.message.includes('Field hanhKhach is required')) {
        // Query lại nhưng không include hanhKhach
        const booking = await this.prisma.donDatVe.findUnique({
          where: { id },
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
            hangVe: true,
            thongTinLienHe: true,
            thanhToan: true,
          },
        });

        if (!booking) {
          throw new NotFoundException('Không tìm thấy đơn đặt vé');
        }

        // Thêm hanhKhach rỗng
        const bookingWithEmptyPassengers = {
          ...booking,
          hanhKhach: [],
          ve: [],
        };

        // Transform changBay
        if (bookingWithEmptyPassengers.changBay && bookingWithEmptyPassengers.changBay.chuyenBay) {
          return {
            ...bookingWithEmptyPassengers,
            changBay: {
              ...bookingWithEmptyPassengers.changBay,
              chuyenBay: {
                ...bookingWithEmptyPassengers.changBay.chuyenBay,
                soHieu: bookingWithEmptyPassengers.changBay.chuyenBay.soHieuChuyenBay,
              },
              ngayKhoiHanh: bookingWithEmptyPassengers.changBay.gioDi.toISOString().split('T')[0],
              gioKhoiHanh: bookingWithEmptyPassengers.changBay.gioDi.toTimeString().slice(0, 5),
              gioDen: bookingWithEmptyPassengers.changBay.gioDen.toTimeString().slice(0, 5),
            },
          };
        }

        return bookingWithEmptyPassengers;
      }

      throw error;
    }
  }

  // Tra cứu booking theo PNR
  async getBookingByPnr(maDatVe: string) {
    const booking = await this.prisma.donDatVe.findFirst({
      where: { maDatVe },
      include: {
        changBay: {
          include: {
            chuyenBay: {
              include: { hang: true },
            },
            sanBayDi: {
              include: { quocGia: true },
            },
            sanBayDen: {
              include: { quocGia: true },
            },
          },
        },
        hangVe: true,
        hanhKhach: {
          include: {
            ve: true,
          },
        },
        thongTinLienHe: true,
        thanhToan: true,
      },
    });

    if (!booking) {
      throw new NotFoundException('Không tìm thấy đơn đặt vé với mã: ' + maDatVe);
    }

    // Transform changBay to include formatted date/time fields
    if (booking.changBay && booking.changBay.chuyenBay) {
      const transformedBooking = {
        ...booking,
        changBay: {
          ...booking.changBay,
          chuyenBay: {
            ...booking.changBay.chuyenBay,
            soHieu: booking.changBay.chuyenBay.soHieuChuyenBay,
          },
          ngayKhoiHanh: booking.changBay.gioDi.toISOString().split('T')[0],
          gioKhoiHanh: booking.changBay.gioDi.toTimeString().slice(0, 5),
          gioDen: booking.changBay.gioDen.toTimeString().slice(0, 5),
        },
      };
      return transformedBooking;
    }

    return booking;
  }

  // Tra cứu booking bằng mã và email
  async findBooking(maDatVe: string, email: string) {
    const booking = await this.prisma.donDatVe.findFirst({
      where: {
        maDatVe,
        thongTinLienHe: {
          email,
        },
      },
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
        hangVe: true,
        hanhKhach: true,
        thongTinLienHe: true,
        thanhToan: true,
        ve: {
          include: {
            hanhKhach: true,
          },
        },
      },
    });

    if (!booking) {
      throw new NotFoundException('Không tìm thấy đơn đặt vé');
    }

    // Transform changBay to include formatted date/time fields
    if (booking.changBay && booking.changBay.chuyenBay) {
      const transformedBooking = {
        ...booking,
        changBay: {
          ...booking.changBay,
          chuyenBay: {
            ...booking.changBay.chuyenBay,
            soHieu: booking.changBay.chuyenBay.soHieuChuyenBay,
          },
          ngayKhoiHanh: booking.changBay.gioDi.toISOString().split('T')[0],
          gioKhoiHanh: booking.changBay.gioDi.toTimeString().slice(0, 5),
          gioDen: booking.changBay.gioDen.toTimeString().slice(0, 5),
        },
      };
      return transformedBooking;
    }

    return booking;
  }

  // Cập nhật trạng thái booking
  async updateBookingStatus(id: number, trangThai: string) {
    return this.prisma.donDatVe.update({
      where: { id },
      data: { trangThai: trangThai as any },
    });
  }

  // Hủy booking
  async cancelBooking(id: number) {
    const booking = await this.prisma.donDatVe.findUnique({
      where: { id },
      include: {
        changBay: true,
        hangVe: true,
      },
    });

    if (!booking) {
      throw new NotFoundException('Không tìm thấy đơn đặt vé');
    }

    if (booking.trangThai === 'DA_XUAT_VE') {
      throw new BadRequestException('Không thể hủy vé đã xuất');
    }

    // Trả lại chỗ
    const tonCho = await this.prisma.tonCho.findFirst({
      where: {
        changBayId: booking.changBayId,
        hangVeId: booking.hangVeId,
        nhomGiaId: booking.nhomGiaId,
      },
    });

    if (tonCho) {
      await this.prisma.tonCho.update({
        where: { id: tonCho.id },
        data: { soChoCon: tonCho.soChoCon + 1 },
      });
    }

    return this.prisma.donDatVe.update({
      where: { id },
      data: { trangThai: 'HUY' },
    });
  }

  // Cron job: tự động hết hạn các booking quá thời gian giữ chỗ
  @Cron(CronExpression.EVERY_MINUTE)
  async handleExpiredBookings() {
    const now = new Date();

    const expiredBookings = await this.prisma.donDatVe.findMany({
      where: {
        trangThai: 'GIU_CHO',
        hetHanGiuCho: {
          lte: now,
        },
      },
      include: {
        changBay: true,
      },
    });

    for (const booking of expiredBookings) {
      console.log(`⏰ Booking ${booking.maDatVe} đã hết hạn giữ chỗ`);

      // Trả lại chỗ
      const tonCho = await this.prisma.tonCho.findFirst({
        where: {
          changBayId: booking.changBayId,
          hangVeId: booking.hangVeId,
          nhomGiaId: booking.nhomGiaId,
        },
      });

      if (tonCho) {
        await this.prisma.tonCho.update({
          where: { id: tonCho.id },
          data: { soChoCon: tonCho.soChoCon + 1 },
        });
      }

      // Cập nhật trạng thái
      await this.prisma.donDatVe.update({
        where: { id: booking.id },
        data: { trangThai: 'HET_HAN' },
      });
    }
  }

  // Generate mã PNR
  private generatePNR(): string {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
    let pnr = '';
    const bytes = randomBytes(6);
    for (let i = 0; i < 6; i++) {
      pnr += chars[bytes[i] % chars.length];
    }
    return pnr;
  }

  // Lấy danh sách booking của user
  async getUserBookings(userId: number) {
    return this.prisma.donDatVe.findMany({
      where: { nguoiDungId: userId },
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
        hangVe: true,
        hanhKhach: true,
        ve: true,
      },
      orderBy: {
        createdAt: 'desc',
      },
    });
  }
}
