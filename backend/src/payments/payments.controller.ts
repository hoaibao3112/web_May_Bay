import {
  Controller,
  Post,
  Get,
  Body,
  Query,
  UseGuards,
  Request,
  Res,
  Req,
} from '@nestjs/common';
import { PaymentsService } from './payments.service';
import { CreatePaymentDto } from './dto/create-payment.dto';
import { JwtAuthGuard } from '../auth/jwt.guard';
import { Response } from 'express';

@Controller('payments')
export class PaymentsController {
  constructor(private paymentsService: PaymentsService) { }

  // Tạo thanh toán
  @Post()
  async createPayment(@Body() dto: CreatePaymentDto, @Request() req?) {
    const userId = req?.user?.id;
    return this.paymentsService.createPayment(dto, userId);
  }

  // VNPay return URL
  @Get('vnpay-return')
  async vnpayReturn(@Query() query: any, @Res() res: Response) {
    const result = await this.paymentsService.handleVNPayReturn(query);

    if (result.success) {
      // Redirect về trang xác nhận đặt vé thành công
      return res.redirect(
        `${process.env.CLIENT_CUSTOMER_URL || 'http://localhost:3000'}/xac-nhan?bookingId=${result.bookingId}&maDatCho=${result.maDatCho}&success=true`
      );
    } else {
      // Redirect về trang thanh toán thất bại
      return res.redirect(
        `${process.env.CLIENT_CUSTOMER_URL || 'http://localhost:3000'}/thanh-toan?error=${encodeURIComponent(result.message)}`
      );
    }
  }

  // VNPay IPN (Instant Payment Notification)
  @Get('vnpay-ipn')
  async vnpayIPN(@Query() query: any) {
    const result = await this.paymentsService.handleVNPayReturn(query);

    if (result.success) {
      return { RspCode: '00', Message: 'Success' };
    } else {
      return { RspCode: '99', Message: result.message };
    }
  }

  // Callback từ cổng thanh toán
  @Post('callback')
  async handleCallback(@Body() data: any) {
    return this.paymentsService.handlePaymentCallback(data);
  }

  // Kiểm tra trạng thái thanh toán
  @Get('status')
  async getPaymentStatus(@Query('maGiaoDich') maGiaoDich: string) {
    return this.paymentsService.getPaymentByTransactionId(maGiaoDich);
  }

  // MoMo return URL
  @Get('momo-return')
  async momoReturn(@Query() query: any, @Res() res: Response) {
    const result = await this.paymentsService.handleMoMoReturn(query);

    if (result.success) {
      return res.redirect(
        `${process.env.CLIENT_CUSTOMER_URL || 'http://localhost:3000'}/xac-nhan?bookingId=${result.bookingId}&maDatCho=${result.maDatCho}&success=true`
      );
    } else {
      return res.redirect(
        `${process.env.CLIENT_CUSTOMER_URL || 'http://localhost:3000'}/thanh-toan?error=${encodeURIComponent(result.message)}`
      );
    }
  }

  // MoMo IPN (Instant Payment Notification)
  @Post('momo-ipn')
  async momoIPN(@Body() body: any, @Res() res: Response) {
    const result = await this.paymentsService.handleMoMoIPN(body);
    return res.status(result.status).send(result.message);
  }
}
