import {
  Injectable,
  BadRequestException,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { BookingsService } from '../bookings/bookings.service';
import { CreatePaymentDto } from './dto/create-payment.dto';
import { randomBytes } from 'crypto';

@Injectable()
export class PaymentsService {
  constructor(
    private prisma: PrismaService,
    private bookingsService: BookingsService,
  ) {}

  // Tạo thanh toán
  async createPayment(dto: CreatePaymentDto, userId?: number) {
    const booking = await this.prisma.donDatVe.findUnique({
      where: { id: dto.bookingId },
      include: {
        hanhKhach: true,
      },
    });

    if (!booking) {
      throw new NotFoundException('Không tìm thấy đơn đặt vé');
    }

    if (booking.trangThai !== 'GIU_CHO') {
      throw new BadRequestException('Đơn đặt vé không ở trạng thái cho phép thanh toán');
    }

    // Kiểm tra đã thêm hành khách chưa
    if (booking.hanhKhach.length === 0) {
      throw new BadRequestException('Vui lòng thêm thông tin hành khách trước khi thanh toán');
    }

    // Tính tổng tiền theo số hành khách
    const soHanhKhach = booking.hanhKhach.length;
    const tongTien = Number(booking.tongTien) * soHanhKhach;

    // Update tổng tiền booking
    await this.prisma.donDatVe.update({
      where: { id: booking.id },
      data: { tongTien },
    });

    // Tạo mã giao dịch
    const maGiaoDich = `TXN${Date.now()}${randomBytes(4).toString('hex').toUpperCase()}`;

    // Tạo payment
    const payment = await this.prisma.thanhToan.create({
      data: {
        donDatVeId: booking.id,
        nguoiDungId: userId,
        maGiaoDich,
        soTien: tongTien,
        tienTe: booking.tienTe,
        phuongThuc: dto.phuongThuc,
        trangThai: 'KHOI_TAO',
      },
    });

    // Cập nhật trạng thái booking
    await this.bookingsService.updateBookingStatus(booking.id, 'CHO_THANH_TOAN');

    // Mock payment URL (trong thực tế sẽ gọi API cổng thanh toán)
    const paymentUrl = this.generateMockPaymentUrl(payment.maGiaoDich, tongTien);

    return {
      paymentId: payment.id,
      maGiaoDich: payment.maGiaoDich,
      soTien: Number(payment.soTien),
      tienTe: payment.tienTe,
      phuongThuc: payment.phuongThuc,
      paymentUrl,
    };
  }

  // Callback thanh toán (webhook từ cổng thanh toán)
  async handlePaymentCallback(data: any) {
    const { maGiaoDich, status, signature } = data;

    // Trong thực tế phải verify signature
    // const isValidSignature = this.verifySignature(data, signature);
    // if (!isValidSignature) {
    //   throw new BadRequestException('Invalid signature');
    // }

    const payment = await this.prisma.thanhToan.findUnique({
      where: { maGiaoDich },
      include: { donDatVe: true },
    });

    if (!payment) {
      throw new NotFoundException('Không tìm thấy giao dịch');
    }

    if (status === 'SUCCESS') {
      // Cập nhật trạng thái thanh toán
      await this.prisma.thanhToan.update({
        where: { id: payment.id },
        data: {
          trangThai: 'THANH_CONG',
          thongTinCong: data,
        },
      });

      // Cập nhật trạng thái booking
      await this.bookingsService.updateBookingStatus(
        payment.donDatVeId,
        'DA_THANH_TOAN',
      );

      return { success: true, message: 'Thanh toán thành công' };
    } else {
      // Thanh toán thất bại
      await this.prisma.thanhToan.update({
        where: { id: payment.id },
        data: {
          trangThai: 'THAT_BAI',
          thongTinCong: data,
        },
      });

      return { success: false, message: 'Thanh toán thất bại' };
    }
  }

  // Mock payment URL
  private generateMockPaymentUrl(maGiaoDich: string, soTien: number): string {
    const baseUrl = process.env.PAYMENT_CALLBACK_URL || 'http://localhost:3000';
    return `${baseUrl}/payments/mock?maGiaoDich=${maGiaoDich}&soTien=${soTien}`;
  }

  // Lấy thông tin thanh toán
  async getPaymentByTransactionId(maGiaoDich: string) {
    const payment = await this.prisma.thanhToan.findUnique({
      where: { maGiaoDich },
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

    if (!payment) {
      throw new NotFoundException('Không tìm thấy giao dịch');
    }

    return payment;
  }
}
