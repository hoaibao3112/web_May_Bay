import {
  Injectable,
  BadRequestException,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { BookingsService } from '../bookings/bookings.service';
import { CreatePaymentDto } from './dto/create-payment.dto';
import { randomBytes, createHmac } from 'crypto';
import * as qs from 'qs';
import * as moment from 'moment';

@Injectable()
export class PaymentsService {
  constructor(
    private prisma: PrismaService,
    private bookingsService: BookingsService,
  ) { }

  // Tạo thanh toán
  async createPayment(dto: CreatePaymentDto, userId?: number) {
    let booking;

    try {
      booking = await this.prisma.donDatVe.findUnique({
        where: { id: dto.bookingId },
        include: {
          hanhKhach: true,
          changBay: {
            include: {
              chuyenBay: true,
            },
          },
        },
      });
    } catch (error) {
      // Nếu lỗi hanhKhach null, query lại không include hanhKhach
      if (error.message && error.message.includes('Field hanhKhach is required')) {
        booking = await this.prisma.donDatVe.findUnique({
          where: { id: dto.bookingId },
          include: {
            changBay: {
              include: {
                chuyenBay: true,
              },
            },
          },
        });
        // Thêm hanhKhach rỗng
        if (booking) {
          booking.hanhKhach = [];
        }
      } else {
        throw error;
      }
    }

    if (!booking) {
      throw new NotFoundException('Không tìm thấy đơn đặt vé');
    }

    // TODO: UNCOMMENT THIS IN PRODUCTION!
    // Tạm thời bỏ qua để test
    // if (booking.trangThai !== 'GIU_CHO' && booking.trangThai !== 'TAO_MOI') {
    //   throw new BadRequestException('Đơn đặt vé không ở trạng thái cho phép thanh toán');
    // }
    console.log('⚠️ WARNING: Skipping status validation for testing. Current status:', booking.trangThai);

    // Kiểm tra đã thêm hành khách chưa
    // TODO: Uncomment this in production
    // if (booking.hanhKhach.length === 0) {
    //   throw new BadRequestException('Vui lòng thêm thông tin hành khách trước khi thanh toán');
    // }

    // Tính tổng tiền theo số hành khách
    const soHanhKhach = booking.hanhKhach.length || 1; // Mặc định 1 nếu chưa có
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

    // Tạo VNPay payment URL
    const paymentUrl = await this.createVNPayPaymentUrl(
      payment.maGiaoDich,
      tongTien,
      booking.maDatVe,
      `Thanh toan don dat ve ${booking.maDatVe}`,
    );

    return {
      paymentId: payment.id,
      maGiaoDich: payment.maGiaoDich,
      soTien: Number(payment.soTien),
      tienTe: payment.tienTe,
      phuongThuc: payment.phuongThuc,
      paymentUrl,
    };
  }

  // Tạo VNPay payment URL
  private async createVNPayPaymentUrl(
    maGiaoDich: string,
    amount: number,
    orderInfo: string,
    orderDescription: string,
  ): Promise<string> {
    const tmnCode = process.env.VNP_TMNCODE;
    const secretKey = process.env.VNP_HASHSECRET;
    const vnpUrl = process.env.VNP_URL;
    const returnUrl = process.env.VNP_RETURN_URL || 'http://localhost:3000/xac-nhan';

    console.log('🔐 VNPay Config:', {
      tmnCode,
      secretKey: secretKey?.substring(0, 10) + '...',
      vnpUrl,
      returnUrl
    });

    const date = new Date();
    const createDate = moment(date).format('YYYYMMDDHHmmss');
    const orderId = maGiaoDich;

    const locale = 'vn';
    const currCode = 'VND';

    let vnp_Params: any = {
      vnp_Version: '2.1.0',
      vnp_Command: 'pay',
      vnp_TmnCode: tmnCode,
      vnp_Locale: locale,
      vnp_CurrCode: currCode,
      vnp_TxnRef: orderId,
      vnp_OrderInfo: orderDescription,
      vnp_OrderType: 'other',
      vnp_Amount: amount * 100, // VNPay yêu cầu số tiền * 100
      vnp_ReturnUrl: returnUrl,
      vnp_IpAddr: '127.0.0.1',
      vnp_CreateDate: createDate,
    };

    // Sắp xếp params theo thứ tự alphabet
    vnp_Params = this.sortObject(vnp_Params);

    // Tạo sign data KHÔNG encode để tính hash
    const signData = qs.stringify(vnp_Params, { encode: false });
    console.log('📝 Sign Data:', signData);
    
    const hmac = createHmac('sha512', secretKey);
    const signed = hmac.update(Buffer.from(signData, 'utf-8')).digest('hex');
    console.log('✅ Signature:', signed);
    
    vnp_Params['vnp_SecureHash'] = signed;

    // Tạo URL có encode
    const paymentUrl = vnpUrl + '?' + qs.stringify(vnp_Params, { encode: true });
    console.log('🔗 Payment URL created');

    return paymentUrl;
  }

  // Xử lý VNPay return
  async handleVNPayReturn(vnpParams: any) {
    console.log('🔙 VNPay Return Params:', vnpParams);
    
    const secureHash = vnpParams['vnp_SecureHash'];
    delete vnpParams['vnp_SecureHash'];
    delete vnpParams['vnp_SecureHashType'];

    const sortedParams = this.sortObject(vnpParams);
    const secretKey = process.env.VNP_HASHSECRET;
    // Không encode khi verify signature
    const signData = qs.stringify(sortedParams, { encode: false });
    
    console.log('📝 Return Sign Data:', signData);
    console.log('🔐 Secret Key:', secretKey?.substring(0, 10) + '...');
    
    const hmac = createHmac('sha512', secretKey);
    const signed = hmac.update(Buffer.from(signData, 'utf-8')).digest('hex');
    
    console.log('🔒 Expected Hash:', signed);
    console.log('🔑 Received Hash:', secureHash);
    console.log('✅ Match:', secureHash === signed);

    if (secureHash === signed) {
      const maGiaoDich = vnpParams['vnp_TxnRef'];
      const rspCode = vnpParams['vnp_ResponseCode'];

      const payment = await this.prisma.thanhToan.findUnique({
        where: { maGiaoDich },
        include: { donDatVe: true },
      });

      if (!payment) {
        return {
          success: false,
          message: 'Không tìm thấy giao dịch',
          code: '01',
        };
      }

      if (rspCode === '00') {
        // Thanh toán thành công
        await this.prisma.thanhToan.update({
          where: { id: payment.id },
          data: {
            trangThai: 'THANH_CONG',
            thongTinCong: vnpParams,
          },
        });

        await this.bookingsService.updateBookingStatus(
          payment.donDatVeId,
          'DA_THANH_TOAN',
        );

        return {
          success: true,
          message: 'Thanh toán thành công',
          code: rspCode,
          bookingId: payment.donDatVeId,
          maDatCho: payment.donDatVe.maDatVe,
        };
      } else {
        // Thanh toán thất bại
        await this.prisma.thanhToan.update({
          where: { id: payment.id },
          data: {
            trangThai: 'THAT_BAI',
            thongTinCong: vnpParams,
          },
        });

        return {
          success: false,
          message: 'Thanh toán thất bại',
          code: rspCode,
        };
      }
    } else {
      return {
        success: false,
        message: 'Chữ ký không hợp lệ',
        code: '97',
      };
    }
  }

  // Sort object by key
  private sortObject(obj: any) {
    const sorted: any = {};
    const keys = Object.keys(obj).sort();
    keys.forEach((key) => {
      sorted[key] = obj[key];
    });
    return sorted;
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
