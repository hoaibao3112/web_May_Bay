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

    // Tạo VietQR payment URL nếu chọn phương thức VIETQR
    let vietqrUrl = '';
    if (dto.phuongThuc === 'VIETQR') {
      vietqrUrl = await this.createVietQRPaymentUrl(
        payment.maGiaoDich,
        tongTien,
        `Thanh toan don dat ve ${booking.maDatVe}`,
      );
    }

    // Tạo ZaloPay payment URL nếu chọn phương thức ZALOPAY
    let zalopayUrl = '';
    if (dto.phuongThuc === 'ZALOPAY') {
      zalopayUrl = await this.createZaloPayPaymentUrl(
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
      paymentUrl: dto.phuongThuc === 'MOMO' ? momoUrl :
        dto.phuongThuc === 'VIETQR' ? vietqrUrl :
          dto.phuongThuc === 'ZALOPAY' ? zalopayUrl :
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

  // Tạo MoMo payment URL - Real Implementation
  private async createMoMoPaymentUrl(
    maGiaoDich: string,
    amount: number,
    orderInfo: string,
  ): Promise<string> {
    const partnerCode = process.env.MOMO_PARTNER_CODE || 'MOMO';
    const accessKey = process.env.MOMO_ACCESS_KEY || 'F8BBA842ECF85';
    const secretKey = process.env.MOMO_SECRET_KEY || 'K951B6PE1waDMi640xX08PD3vg6EkVlz';
    const apiUrl = process.env.MOMO_API_URL || 'https://test-payment.momo.vn/v2/gateway/api/create';
    const redirectUrl = process.env.MOMO_REDIRECT_URL || `${process.env.API_URL || 'http://localhost:5000'}/api/payments/momo-return`;
    const ipnUrl = process.env.MOMO_IPN_URL || `${process.env.API_URL || 'http://localhost:5000'}/api/payments/momo-ipn`;

    if (!partnerCode || !accessKey || !secretKey || !apiUrl) {
      throw new Error('MoMo configuration is missing');
    }

    console.log('🔐 MoMo Config:', {
      partnerCode,
      accessKey,
      secretKey: secretKey?.substring(0, 10) + '...',
      apiUrl,
      redirectUrl,
      ipnUrl
    });

    const requestId = maGiaoDich;
    const orderId = maGiaoDich;
    const requestType = 'payWithMethod'; // Flexible payment method
    const extraData = '';
    const autoCapture = true;
    const lang = 'vi';

    // Create raw signature according to MoMo spec
    // IMPORTANT: Order of parameters must match exactly
    const rawSignature =
      `accessKey=${accessKey}` +
      `&amount=${amount}` +
      `&extraData=${extraData}` +
      `&ipnUrl=${ipnUrl}` +
      `&orderId=${orderId}` +
      `&orderInfo=${orderInfo}` +
      `&partnerCode=${partnerCode}` +
      `&redirectUrl=${redirectUrl}` +
      `&requestId=${requestId}` +
      `&requestType=${requestType}`;

    console.log('📝 MoMo Raw Signature:', rawSignature);

    // Generate HMAC SHA256 signature
    const signature = createHmac('sha256', secretKey)
      .update(rawSignature)
      .digest('hex');

    console.log('✅ MoMo Signature:', signature);

    // Prepare request body
    const requestBody = {
      partnerCode,
      partnerName: 'Test',
      storeId: 'MomoTestStore',
      requestId,
      amount,
      orderId,
      orderInfo,
      redirectUrl,
      ipnUrl,
      lang,
      requestType,
      autoCapture,
      extraData,
      signature
    };

    console.log('📤 Sending request to MoMo API...');

    try {
      const response = await axios.post(apiUrl, requestBody, {
        headers: {
          'Content-Type': 'application/json',
        }
      });

      console.log('📥 MoMo Response:', response.data);

      if (response.data && response.data.payUrl) {
        console.log('✅ MoMo Payment URL created successfully');
        return response.data.payUrl;
      } else if (response.data && response.data.resultCode !== 0) {
        console.error('❌ MoMo Error:', response.data);
        throw new Error(response.data.message || `MoMo error: ${response.data.resultCode}`);
      } else {
        console.error('❌ Unexpected MoMo Response:', response.data);
        throw new Error('Lỗi khi tạo payment URL từ MoMo');
      }
    } catch (error) {
      if (error.response) {
        console.error('❌ MoMo API Error Response:', error.response.data);
        throw new Error(error.response.data?.message || 'Không thể kết nối với cổng thanh toán MoMo');
      } else {
        console.error('❌ MoMo Request Error:', error.message);
        throw new Error('Không thể kết nối với cổng thanh toán MoMo');
      }
    }
  }

  // Tạo ZaloPay payment URL - Real Implementation
  private async createZaloPayPaymentUrl(
    maGiaoDich: string,
    amount: number,
    orderInfo: string,
  ): Promise<string> {
    const appId = process.env.ZALOPAY_APP_ID || '2554';
    const key1 = process.env.ZALOPAY_KEY1 || 'sdngKKJmqEMzvh5QQcdD2A9XBSKUNaYn';
    const endpoint = process.env.ZALOPAY_ENDPOINT || 'https://sb-openapi.zalopay.vn/v2/create';
    const redirectUrl = process.env.ZALOPAY_REDIRECT_URL || `${process.env.API_URL || 'http://localhost:5000'}/api/payments/zalopay-return`;

    console.log('🔐 ZaloPay Config:', {
      appId,
      key1: key1?.substring(0, 10) + '...',
      endpoint,
      redirectUrl
    });

    const embedData = {
      redirecturl: redirectUrl,
    };

    const items = [];
    const transID = Date.now();
    const app_trans_id = `${moment().format('YYMMDD')}_${transID}`;

    const order = {
      app_id: parseInt(appId),
      app_trans_id,
      app_user: 'user_' + maGiaoDich,
      app_time: Date.now(),
      amount,
      item: JSON.stringify(items),
      embed_data: JSON.stringify(embedData),
      description: orderInfo,
      bank_code: '',
    };

    // Create MAC signature according to ZaloPay spec
    // Format: app_id|app_trans_id|app_user|amount|app_time|embed_data|item
    const data = `${order.app_id}|${order.app_trans_id}|${order.app_user}|${order.amount}|${order.app_time}|${order.embed_data}|${order.item}`;
    const mac = createHmac('sha256', key1).update(data).digest('hex');

    console.log('📝 ZaloPay MAC Data:', data);
    console.log('✅ ZaloPay MAC:', mac);

    const requestBody = { ...order, mac };

    console.log('📤 Sending request to ZaloPay API...');

    try {
      const response = await axios.post(endpoint, requestBody, {
        headers: {
          'Content-Type': 'application/json',
        }
      });

      console.log('📥 ZaloPay Response:', response.data);

      if (response.data && response.data.return_code === 1) {
        console.log('✅ ZaloPay Payment URL created successfully');
        return response.data.order_url;
      } else {
        console.error('❌ ZaloPay Error:', response.data);
        throw new Error(response.data.return_message || 'Lỗi khi tạo payment URL từ ZaloPay');
      }
    } catch (error) {
      if (error.response) {
        console.error('❌ ZaloPay API Error Response:', error.response.data);
        throw new Error(error.response.data?.return_message || 'Không thể kết nối với cổng thanh toán ZaloPay');
      } else {
        console.error('❌ ZaloPay Request Error:', error.message);
        throw new Error('Không thể kết nối với cổng thanh toán ZaloPay');
      }
    }
  }

  // Tạo VietQR payment URL (Mock for Demo)
  private async createVietQRPaymentUrl(
    maGiaoDich: string,
    amount: number,
    orderInfo: string,
  ): Promise<string> {
    // FOR DEMO/SCHOOL PROJECT: Use mock VietQR payment page

    console.log('🏦 Using Mock VietQR Payment for Demo');
    console.log('Order ID:', maGiaoDich);
    console.log('Amount:', amount);
    console.log('Order Info:', orderInfo);

    // Mock bank account info for VietQR demo
    const bankCode = 'VCB'; // Vietcombank
    const accountNo = '1234567890';
    const accountName = 'TRAN HOAI BAO';

    // Redirect to our mock VietQR payment page
    const mockVietQRUrl = `${process.env.CLIENT_CUSTOMER_URL || 'http://localhost:3000'}/mock-vietqr?orderId=${maGiaoDich}&amount=${amount}&orderInfo=${encodeURIComponent(orderInfo)}&bankCode=${bankCode}&accountNo=${accountNo}&accountName=${encodeURIComponent(accountName)}`;

    console.log('✅ Mock VietQR URL created:', mockVietQRUrl);

    return mockVietQRUrl;

    /* REAL VIETQR IMPLEMENTATION (For future reference):
    
    VietQR API: https://api.vietqr.io/v2/generate
    You can use the free tier to generate real QR codes
    
    const vietQRData = {
      accountNo: '1234567890',
      accountName: 'TRAN HOAI BAO',
      acqId: '970436', // Vietcombank bin
      amount: amount,
      addInfo: orderInfo,
      format: 'text', // or 'compact'
      template: 'compact' // or 'compact2', 'qr_only', 'print'
    };

    const response = await axios.post('https://api.vietqr.io/v2/generate', vietQRData);
    return response.data.data.qrDataURL; // Returns base64 QR code image
    */
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
    const {
      partnerCode,
      orderId,
      requestId,
      amount,
      orderInfo,
      orderType,
      transId,
      resultCode,
      message,
      payType,
      responseTime,
      extraData,
      signature
    } = query;

    const secretKey = process.env.MOMO_SECRET_KEY || 'K951B6PE1waDMi640xX08PD3vg6EkVlz';
    const accessKey = process.env.MOMO_ACCESS_KEY || 'F8BBA842ECF85';

    // Build raw signature according to MoMo spec for return URL
    const rawSignature =
      `accessKey=${accessKey}` +
      `&amount=${amount}` +
      `&extraData=${extraData}` +
      `&message=${message}` +
      `&orderId=${orderId}` +
      `&orderInfo=${orderInfo}` +
      `&orderType=${orderType}` +
      `&partnerCode=${partnerCode}` +
      `&requestId=${requestId}` +
      `&responseTime=${responseTime}` +
      `&resultCode=${resultCode}` +
      `&transId=${transId}`;

    console.log('📝 Return Raw Signature:', rawSignature);

    const expectedSignature = createHmac('sha256', secretKey)
      .update(rawSignature)
      .digest('hex');

    console.log('🔐 Expected Signature:', expectedSignature);
    console.log('🔑 Received Signature:', signature);
    console.log('✅ Match:', signature === expectedSignature);

    if (signature !== expectedSignature) {
      console.error('❌ MoMo signature mismatch');
      return { success: false, message: 'Chữ ký không hợp lệ' };
    }

    const payment = await this.prisma.thanhToan.findUnique({
      where: { maGiaoDich: orderId },
      include: { donDatVe: true },
    });

    if (!payment) {
      console.error('❌ Payment not found:', orderId);
      return { success: false, message: 'Không tìm thấy giao dịch' };
    }

    if (resultCode == 0) {
      // Thanh toán thành công
      console.log('✅ Payment successful, updating database...');

      await this.prisma.thanhToan.update({
        where: { id: payment.id },
        data: {
          trangThai: 'THANH_CONG',
          thongTinCong: query,
        },
      });

      await this.bookingsService.updateBookingStatus(
        payment.donDatVeId,
        'DA_THANH_TOAN',
      );

      return {
        success: true,
        message: 'Thanh toán thành công qua MoMo',
        bookingId: payment.donDatVeId,
        maDatCho: payment.donDatVe.maDatVe,
      };
    } else {
      // Thanh toán thất bại
      console.log('❌ Payment failed with code:', resultCode);

      await this.prisma.thanhToan.update({
        where: { id: payment.id },
        data: {
          trangThai: 'THAT_BAI',
          thongTinCong: query,
        },
      });

      return {
        success: false,
        message: message || 'Thanh toán thất bại',
        code: resultCode
      };
    }
  }

  // Xử lý MoMo IPN (Webhook từ MoMo)
  async handleMoMoIPN(body: any) {
    console.log('🔔 MoMo IPN received:', body);
    const {
      partnerCode,
      orderId,
      requestId,
      amount,
      orderInfo,
      orderType,
      transId,
      resultCode,
      message,
      payType,
      responseTime,
      extraData,
      signature
    } = body;

    const secretKey = process.env.MOMO_SECRET_KEY || 'K951B6PE1waDMi640xX08PD3vg6EkVlz';
    const accessKey = process.env.MOMO_ACCESS_KEY || 'F8BBA842ECF85';

    // Build raw signature according to MoMo spec for IPN
    const rawSignature =
      `accessKey=${accessKey}` +
      `&amount=${amount}` +
      `&extraData=${extraData}` +
      `&message=${message}` +
      `&orderId=${orderId}` +
      `&orderInfo=${orderInfo}` +
      `&orderType=${orderType}` +
      `&partnerCode=${partnerCode}` +
      `&requestId=${requestId}` +
      `&responseTime=${responseTime}` +
      `&resultCode=${resultCode}` +
      `&transId=${transId}`;

    console.log('📝 IPN Raw Signature:', rawSignature);

    const expectedSignature = createHmac('sha256', secretKey)
      .update(rawSignature)
      .digest('hex');

    console.log('🔐 Expected Signature:', expectedSignature);
    console.log('🔑 Received Signature:', signature);

    if (signature !== expectedSignature) {
      console.error('❌ MoMo IPN Signature mismatch');
      return { status: 400, message: 'Signature mismatch' };
    }

    const payment = await this.prisma.thanhToan.findUnique({
      where: { maGiaoDich: orderId },
    });

    if (!payment) {
      console.error('❌ Payment not found:', orderId);
      return { status: 404, message: 'Payment not found' };
    }

    if (resultCode == 0) {
      console.log('✅ IPN: Payment successful, updating database...');

      await this.prisma.thanhToan.update({
        where: { id: payment.id },
        data: {
          trangThai: 'THANH_CONG',
          thongTinCong: body,
        },
      });

      await this.bookingsService.updateBookingStatus(payment.donDatVeId, 'DA_THANH_TOAN');
    } else {
      console.log('❌ IPN: Payment failed with code:', resultCode);

      await this.prisma.thanhToan.update({
        where: { id: payment.id },
        data: {
          trangThai: 'THAT_BAI',
          thongTinCong: body,
        },
      });
    }

    console.log('✅ IPN processed successfully');
    return { status: 204, message: 'Success' }; // MoMo IPN expects 204 No Content for success
  }

  // Xử lý ZaloPay Return (Khi người dùng quay lại web)
  async handleZaloPayReturn(query: any) {
    console.log('🔙 ZaloPay Return Params:', query);

    const { appid, apptransid, status, amount, checksum } = query;
    const key2 = process.env.ZALOPAY_KEY2 || 'trMrHtvjo6myautxDUiAcYsVtaeQ8nhf';

    // Verify checksum with KEY2
    const checksumData = `${appid}|${apptransid}|${status}`;
    const expectedChecksum = createHmac('sha256', key2)
      .update(checksumData)
      .digest('hex');

    console.log('📝 ZaloPay Checksum Data:', checksumData);
    console.log('🔐 Expected Checksum:', expectedChecksum);
    console.log('🔑 Received Checksum:', checksum);

    if (checksum !== expectedChecksum) {
      console.error('❌ ZaloPay checksum mismatch');
      return { success: false, message: 'Chữ ký không hợp lệ' };
    }

    // Extract transaction ID from apptransid (format: YYMMDD_transID)
    const maGiaoDich = apptransid;

    const payment = await this.prisma.thanhToan.findUnique({
      where: { maGiaoDich },
      include: { donDatVe: true },
    });

    if (!payment) {
      console.error('❌ Payment not found:', maGiaoDich);
      return { success: false, message: 'Không tìm thấy giao dịch' };
    }

    if (status == 1) {
      // Thanh toán thành công
      console.log('✅ ZaloPay payment successful, updating database...');

      await this.prisma.thanhToan.update({
        where: { id: payment.id },
        data: {
          trangThai: 'THANH_CONG',
          thongTinCong: query,
        },
      });

      await this.bookingsService.updateBookingStatus(
        payment.donDatVeId,
        'DA_THANH_TOAN',
      );

      return {
        success: true,
        message: 'Thanh toán thành công qua ZaloPay',
        bookingId: payment.donDatVeId,
        maDatCho: payment.donDatVe.maDatVe,
      };
    } else {
      // Thanh toán thất bại
      console.log('❌ ZaloPay payment failed with status:', status);

      await this.prisma.thanhToan.update({
        where: { id: payment.id },
        data: {
          trangThai: 'THAT_BAI',
          thongTinCong: query,
        },
      });

      return {
        success: false,
        message: 'Thanh toán thất bại',
        code: status
      };
    }
  }

  // Xử lý ZaloPay IPN (Webhook từ ZaloPay)
  async handleZaloPayIPN(body: any) {
    console.log('🔔 ZaloPay IPN received:', body);

    const { data: dataStr, mac: receivedMac } = body;
    const key2 = process.env.ZALOPAY_KEY2 || 'trMrHtvjo6myautxDUiAcYsVtaeQ8nhf';

    // Verify MAC with KEY2
    const expectedMac = createHmac('sha256', key2)
      .update(dataStr)
      .digest('hex');

    console.log('🔐 Expected MAC:', expectedMac);
    console.log('🔑 Received MAC:', receivedMac);

    if (receivedMac !== expectedMac) {
      console.error('❌ ZaloPay IPN MAC mismatch');
      return { return_code: -1, return_message: 'mac not equal' };
    }

    try {
      const data = JSON.parse(dataStr);
      const { app_trans_id, zp_trans_id, amount, status } = data;

      const payment = await this.prisma.thanhToan.findUnique({
        where: { maGiaoDich: app_trans_id },
      });

      if (!payment) {
        console.error('❌ Payment not found:', app_trans_id);
        return { return_code: 2, return_message: 'Payment not found' };
      }

      if (status == 1) {
        console.log('✅ IPN: ZaloPay payment successful, updating database...');

        await this.prisma.thanhToan.update({
          where: { id: payment.id },
          data: {
            trangThai: 'THANH_CONG',
            thongTinCong: data,
          },
        });

        await this.bookingsService.updateBookingStatus(
          payment.donDatVeId,
          'DA_THANH_TOAN',
        );
      } else {
        console.log('❌ IPN: ZaloPay payment failed');

        await this.prisma.thanhToan.update({
          where: { id: payment.id },
          data: {
            trangThai: 'THAT_BAI',
            thongTinCong: data,
          },
        });
      }

      console.log('✅ IPN processed successfully');
      return { return_code: 1, return_message: 'success' };
    } catch (error) {
      console.error('❌ Error processing ZaloPay IPN:', error);
      return { return_code: 0, return_message: error.message };
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
