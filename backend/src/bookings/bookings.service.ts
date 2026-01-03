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
  constructor(private prisma: PrismaService) {}

  // Tạo đơn đặt vé và giữ chỗ
  async createBooking(dto: CreateBookingDto, userId?: number) {
    // Kiểm tra tồn chỗ
    const tonCho = await this.prisma.tonCho.findFirst({
      where: {
        changBayId: dto.changBayId,
        hangVeId: dto.hangVeId,
        nhomGiaId: dto.nhomGiaId,
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
        nhomGia: true,
      },
    });

    if (!tonCho || tonCho.soChoCon < 1) {
      throw new BadRequestException('Không còn chỗ trống cho chuyến bay này');
    }

    // Tính tổng tiền (tạm tính cho 1 người)
    const tongTien = Number(tonCho.giaCoSo) + Number(tonCho.thue) + Number(tonCho.phi);

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
        nhomGiaId: dto.nhomGiaId,
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

    // Giảm số chỗ còn lại (tạm giữ)
    await this.prisma.tonCho.update({
      where: { id: tonCho.id },
      data: { soChoCon: tonCho.soChoCon - 1 },
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

    return booking;
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
