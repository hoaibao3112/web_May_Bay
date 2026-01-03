import {
  Injectable,
  BadRequestException,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { BookingsService } from '../bookings/bookings.service';

@Injectable()
export class TicketsService {
  constructor(
    private prisma: PrismaService,
    private bookingsService: BookingsService,
  ) {}

  // Xuất vé điện tử
  async issueTicket(bookingId: number) {
    const booking = await this.prisma.donDatVe.findUnique({
      where: { id: bookingId },
      include: {
        hanhKhach: true,
        thanhToan: true,
      },
    });

    if (!booking) {
      throw new NotFoundException('Không tìm thấy đơn đặt vé');
    }

    if (booking.trangThai !== 'DA_THANH_TOAN') {
      throw new BadRequestException('Chỉ có thể xuất vé cho đơn đã thanh toán');
    }

    // Kiểm tra đã thanh toán thành công
    const hasSuccessPayment = booking.thanhToan.some(
      (p) => p.trangThai === 'THANH_CONG',
    );

    if (!hasSuccessPayment) {
      throw new BadRequestException('Chưa có thanh toán thành công');
    }

    // Cập nhật trạng thái booking
    await this.bookingsService.updateBookingStatus(bookingId, 'DANG_XUAT_VE');

    // Tạo vé cho từng hành khách
    const tickets = [];
    for (const passenger of booking.hanhKhach) {
      const soVe = this.generateTicketNumber();

      const ticket = await this.prisma.ve.create({
        data: {
          donDatVeId: bookingId,
          hanhKhachId: passenger.id,
          soVe,
          trangThai: 'HIEU_LUC',
        },
      });

      tickets.push(ticket);
    }

    // Cập nhật trạng thái booking thành đã xuất vé
    await this.bookingsService.updateBookingStatus(bookingId, 'DA_XUAT_VE');

    return {
      bookingId,
      maDatVe: booking.maDatVe,
      tickets,
      message: 'Xuất vé thành công',
    };
  }

  // Lấy thông tin vé
  async getTicketByNumber(soVe: string) {
    const ticket = await this.prisma.ve.findUnique({
      where: { soVe },
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
            hangVe: true,
          },
        },
        hanhKhach: true,
      },
    });

    if (!ticket) {
      throw new NotFoundException('Không tìm thấy vé');
    }

    return ticket;
  }

  // Generate số vé (ticket number) theo chuẩn IATA: 738-1234567890 (3 chữ số airline code + 10 chữ số)
  private generateTicketNumber(): string {
    const airlineCode = '738'; // Mock airline code
    const serialNumber = Math.floor(Math.random() * 10000000000)
      .toString()
      .padStart(10, '0');
    return `${airlineCode}${serialNumber}`;
  }

  // Lấy tất cả vé của booking
  async getTicketsByBooking(bookingId: number) {
    return this.prisma.ve.findMany({
      where: { donDatVeId: bookingId },
      include: {
        hanhKhach: true,
      },
    });
  }
}
