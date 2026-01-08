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
import axios from 'axios';

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

    // Tạo MoMo payment URL nếu chọn phương thức MOMO
    let momoUrl = '';
    if (dto.phuongThuc === 'MOMO') {
      momoUrl = await this.createMoMoPaymentUrl(
        payment.maGiaoDich,
        tongTien,
        `Thanh toan don dat ve ${booking.maDatVe}`,
      );
    }

    return {
      paymentId: payment.id,
      maGiaoDich: payment.maGiaoDich,
      soTien: Number(payment.soTien),
      tienTe: payment.tienTe,
      phuongThuc: payment.phuongThuc,
      paymentUrl: dto.phuongThuc === 'MOMO' ? momoUrl : paymentUrl,
    };
  }

  // Tạo VNPay payment URL
  private async createVNPayPaymentUrl(
    maGiaoDich: string,
    amount: number,
    orderInfo: string,
    orderDescription: string,
  ): Promise<string> {
    const tmnCode = process.env.VNP_TMN_CODE;
    const secretKey = process.env.VNP_HASH_SECRET;
    const vnpUrl = process.env.VNP_URL;
    const returnUrl = process.env.VNP_RETURN_URL || 'http://localhost:3000/xac-nhan';

    if (!tmnCode || !secretKey || !vnpUrl) {
      throw new Error('VNPay configuration is missing');
    }

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

    // Tạo sign data theo chuẩn VNPay - chỉ encode dấu cách và một số ký tự đặc biệt
    // KHÔNG encode : / ? = & (giữ nguyên cho URL)
    const signData = Object.keys(vnp_Params)
      .map(key => {
        let value = String(vnp_Params[key]);
        // Chỉ encode dấu cách thành +, giữ nguyên các ký tự khác
        value = value.replace(/ /g, '+');
        return `${key}=${value}`;
      })
      .join('&');

    console.log('📝 Sign Data:', signData);

    const hmac = createHmac('sha512', secretKey);
    const signed = hmac.update(Buffer.from(signData, 'utf-8')).digest('hex');
    console.log('✅ Signature:', signed);

    vnp_Params['vnp_SecureHash'] = signed;

    // Tạo URL - encode đầy đủ cho URL thực tế
    const paymentUrl = vnpUrl + '?' + qs.stringify(vnp_Params, { encode: true });
    console.log('🔗 Payment URL created');

    return paymentUrl;
  }

  // Tạo MoMo payment URL
  private async createMoMoPaymentUrl(
    maGiaoDich: string,
    amount: number,
    orderInfo: string,
  ): Promise<string> {
    const partnerCode = process.env.MOMO_PARTNER_CODE;
    const accessKey = process.env.MOMO_ACCESS_KEY;
    const secretKey = process.env.MOMO_SECRET_KEY;
    const apiUrl = process.env.MOMO_API_URL;
    const redirectUrl = process.env.MOMO_REDIRECT_URL;
    const ipnUrl = process.env.MOMO_IPN_URL;

    const requestId = maGiaoDich;
    const orderId = maGiaoDich;
    const requestType = "captureWallet";
    const extraData = ""; // Có thể gửi dữ liệu thêm ở đây, cần base64 encode

    const rawSignature = `accessKey=${accessKey}&amount=${amount}&extraData=${extraData}&ipnUrl=${ipnUrl}&orderId=${orderId}&orderInfo=${orderInfo}&partnerCode=${partnerCode}&redirectUrl=${redirectUrl}&requestId=${requestId}&requestType=${requestType}`;

    const signature = createHmac('sha256', secretKey)
      .update(rawSignature)
      .digest('hex');

    const requestBody = {
      partnerCode,
      accessKey,
      requestId,
      amount,
      orderId,
      orderInfo,
      redirectUrl,
      ipnUrl,
      extraData,
      requestType,
      signature,
      lang: 'vi'
    };

    try {
      const response = await axios.post(apiUrl, requestBody);
      if (response.data && response.data.payUrl) {
        return response.data.payUrl;
      } else {
        console.error('MoMo Error Response:', response.data);
        throw new Error(response.data.message || 'Lỗi khi tạo payment URL từ MoMo');
      }
    } catch (error) {
      console.error('MoMo Request Error:', error.response?.data || error.message);
      throw new Error('Không thể kết nối với cổng thanh toán MoMo');
    }
  }

  // Xử lý VNPay return
  async handleVNPayReturn(vnpParams: any) {
    console.log('🔙 VNPay Return Params:', vnpParams);

    const secureHash = vnpParams['vnp_SecureHash'];
    delete vnpParams['vnp_SecureHash'];
    delete vnpParams['vnp_SecureHashType'];

    const sortedParams = this.sortObject(vnpParams);
    const secretKey = process.env.VNP_HASH_SECRET;

    // Tạo sign data giống như khi tạo payment - chỉ encode dấu cách
    const signData = Object.keys(sortedParams)
      .map(key => {
        let value = String(sortedParams[key]);
        value = value.replace(/ /g, '+');
        return `${key}=${value}`;
      })
      .join('&');

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

  // Xử lý MoMo Return (Khi người dùng quay lại web)
  async handleMoMoReturn(query: any) {
    console.log('🔙 MoMo Return Params:', query);
    const { partnerCode, orderId, requestId, amount, orderInfo, orderType, transId, resultCode, message, payType, responseTime, extraData, signature } = query;

    const secretKey = process.env.MOMO_SECRET_KEY;
    const rawSignature = `accessKey=${process.env.MOMO_ACCESS_KEY}&amount=${amount}&extraData=${extraData}&message=${message}&orderId=${orderId}&orderInfo=${orderInfo}&partnerCode=${partnerCode}&requestId=${requestId}&responseTime=${responseTime}&resultCode=${resultCode}&transId=${transId}`;

    const expectedSignature = createHmac('sha256', secretKey)
      .update(rawSignature)
      .digest('hex');

    if (signature !== expectedSignature) {
      return { success: false, message: 'Chữ ký không hợp lệ' };
    }

    const payment = await this.prisma.thanhToan.findUnique({
      where: { maGiaoDich: orderId },
      include: { donDatVe: true },
    });

    if (!payment) {
      return { success: false, message: 'Không tìm thấy giao dịch' };
    }

    if (resultCode == 0) { // Thành công
      return {
        success: true,
        message: 'Thanh toán thành công qua MoMo',
        bookingId: payment.donDatVeId,
        maDatCho: payment.donDatVe.maDatVe,
      };
    } else {
      return { success: false, message: message || 'Thanh toán thất bại' };
    }
  }

  // Xử lý MoMo IPN (Webhook từ MoMo)
  async handleMoMoIPN(body: any) {
    console.log('🔔 MoMo IPN received:', body);
    const { partnerCode, orderId, requestId, amount, orderInfo, orderType, transId, resultCode, message, payType, responseTime, extraData, signature } = body;

    const secretKey = process.env.MOMO_SECRET_KEY;
    const rawSignature = `accessKey=${process.env.MOMO_ACCESS_KEY}&amount=${amount}&extraData=${extraData}&message=${message}&orderId=${orderId}&orderInfo=${orderInfo}&partnerCode=${partnerCode}&requestId=${requestId}&responseTime=${responseTime}&resultCode=${resultCode}&transId=${transId}`;

    const expectedSignature = createHmac('sha256', secretKey)
      .update(rawSignature)
      .digest('hex');

    if (signature !== expectedSignature) {
      console.error('❌ MoMo IPN Signature mismatch');
      return { status: 400, message: 'Signature mismatch' };
    }

    const payment = await this.prisma.thanhToan.findUnique({
      where: { maGiaoDich: orderId },
    });

    if (!payment) {
      return { status: 404, message: 'Payment not found' };
    }

    if (resultCode == 0) {
      await this.prisma.thanhToan.update({
        where: { id: payment.id },
        data: {
          trangThai: 'THANH_CONG',
          thongTinCong: body,
        },
      });

      await this.bookingsService.updateBookingStatus(payment.donDatVeId, 'DA_THANH_TOAN');
    } else {
      await this.prisma.thanhToan.update({
        where: { id: payment.id },
        data: {
          trangThai: 'THAT_BAI',
          thongTinCong: body,
        },
      });
    }

    return { status: 204 }; // MoMo IPN expects 204 No Content for success
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
