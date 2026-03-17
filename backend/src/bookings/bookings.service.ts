import {
  Injectable,
  BadRequestException,
  NotFoundException,
  Logger,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateBookingDto } from './dto/create-booking.dto';
import { AddPassengerDto } from './dto/add-passenger.dto';
import { AddContactDto } from './dto/add-contact.dto';
import { Cron, CronExpression } from '@nestjs/schedule';
import { randomBytes } from 'crypto';
import { ERROR_MESSAGES } from '../common/constants/error-messages';
import { BOOKING_CONSTANTS } from '../common/constants/booking-constants';

@Injectable()
export class BookingsService {
  private readonly logger = new Logger(BookingsService.name);

  // Thời gian giữ chỗ (phút)
  private readonly HOLD_TIME_MINUTES = BOOKING_CONSTANTS.HOLD_TIME_MINUTES;

  constructor(private prisma: PrismaService) { }

  /**
   * Tạo đơn đặt vé (Single Responsibility: chỉ orchestrate)
   */
  async createBooking(dto: CreateBookingDto, userId?: number) {
    // 1. Lấy và validate giá vé
    const giaVe = await this.getAndValidatePrice(dto);

    // 2. Tạo booking
    const booking = await this.createBookingRecord(dto, giaVe, userId);

    // 3. Thêm thông tin liên hệ nếu có
    if (dto.thongTinLienHe) {
      await this.createOrUpdateContactInfo(booking.id, dto.thongTinLienHe);
    }

    // 4. Thêm hành khách nếu có
    if (dto.hanhKhach && dto.hanhKhach.length > 0) {
      await this.createPassengers(booking.id, dto.hanhKhach);
    }

    // 5. Giảm số chỗ còn lại
    await this.decrementAvailableSeats(giaVe.id);

    return booking;
  }

  /**
   * Lấy giá vé và validate số chỗ trống
   */
  private async getAndValidatePrice(
    dto: CreateBookingDto,
  ) {
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

    if (!giaVe || giaVe.soLuongGheTrong < 1) {
      throw new BadRequestException(ERROR_MESSAGES.NO_AVAILABLE_SEATS);
    }

    return giaVe;
  }

  /**
   * Tạo record booking trong database
   */
  private async createBookingRecord(
    dto: CreateBookingDto,
    giaVe: any,
    userId?: number,
  ) {
    const maDatVe = this.generatePNR();
    const hetHanGiuCho = new Date(
      Date.now() + this.HOLD_TIME_MINUTES * 60 * 1000,
    );

    return this.prisma.donDatVe.create({
      data: {
        maDatVe,
        nguoiDungId: userId,
        changBayId: dto.changBayId,
        hangVeId: dto.hangVeId,
        trangThai: BOOKING_CONSTANTS.STATUS.HOLDING,
        tongTien: Number(giaVe.giaBan),
        tienTe: BOOKING_CONSTANTS.DEFAULT_CURRENCY,
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
  }

  /**
   * Tạo hoặc cập nhật thông tin liên hệ
   */
  private async createOrUpdateContactInfo(
    bookingId: number,
    thongTinLienHe: any,
  ) {
    return this.prisma.thongTinLienHe.upsert({
      where: { donDatVeId: bookingId },
      update: thongTinLienHe,
      create: {
        donDatVeId: bookingId,
        hoTen: thongTinLienHe.email.split('@')[0],
        ...thongTinLienHe,
      },
    });
  }

  /**
   * Tạo danh sách hành khách
   */
  private async createPassengers(
    bookingId: number,
    hanhKhachList: any[],
  ) {
    return Promise.all(
      hanhKhachList.map((hk) =>
        this.prisma.hanhKhach.create({
          data: {
            donDatVeId: bookingId,
            loai: hk.loai,
            ho: hk.ho.toUpperCase(),
            ten: hk.ten.toUpperCase(),
            gioiTinh: hk.gioiTinh,
            ngaySinh: new Date(hk.ngaySinh),
            quocTich: hk.quocTich,
          },
        }),
      ),
    );
  }

  /**
   * Giảm số chỗ trống
   */
  private async decrementAvailableSeats(giaVeId: number) {
    return this.prisma.giaVe.update({
      where: { id: giaVeId },
      data: {
        soLuongGheTrong: {
          decrement: 1,
        },
      },
    });
  }

  /**
   * Thêm hành khách vào booking
   */
  async addPassenger(bookingId: number, dto: AddPassengerDto) {
    const booking = await this.prisma.donDatVe.findUnique({
      where: { id: bookingId },
    });

    if (!booking) {
      throw new NotFoundException(ERROR_MESSAGES.BOOKING_NOT_FOUND);
    }

    if (booking.trangThai !== BOOKING_CONSTANTS.STATUS.HOLDING) {
      throw new BadRequestException(ERROR_MESSAGES.INVALID_BOOKING_STATUS);
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

  /**
   * Thêm hoặc cập nhật thông tin liên hệ booking
   */
  async addContact(bookingId: number, dto: AddContactDto) {
    const booking = await this.prisma.donDatVe.findUnique({
      where: { id: bookingId },
    });

    if (!booking) {
      throw new NotFoundException(ERROR_MESSAGES.BOOKING_NOT_FOUND);
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

  // Lấy danh sách booking của user (bao gồm cả booking guest có email trùng)
  async getUserBookings(userId: number) {
    // Lấy thông tin user để lấy email
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
      select: { email: true },
    });

    if (!user) {
      throw new BadRequestException('Người dùng không tồn tại');
    }

    // Lấy bookings theo userId HOẶC theo email trong thông tin liên hệ
    return this.prisma.donDatVe.findMany({
      where: {
        OR: [
          { nguoiDungId: userId },
          {
            thongTinLienHe: {
              email: user.email,
            },
          },
        ],
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
        ve: true,
        thongTinLienHe: true,
      },
      orderBy: {
        createdAt: 'desc',
      },
    });
  }
}
