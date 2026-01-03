import {
  Controller,
  Post,
  Get,
  Body,
  Query,
  UseGuards,
  Request,
} from '@nestjs/common';
import { PaymentsService } from './payments.service';
import { CreatePaymentDto } from './dto/create-payment.dto';
import { JwtAuthGuard } from '../auth/jwt.guard';

@Controller('payments')
export class PaymentsController {
  constructor(private paymentsService: PaymentsService) {}

  // Tạo thanh toán
  @Post()
  async createPayment(@Body() dto: CreatePaymentDto, @Request() req?) {
    const userId = req?.user?.id;
    return this.paymentsService.createPayment(dto, userId);
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

  // Mock payment page (để test)
  @Get('mock')
  mockPaymentPage(@Query() query: any) {
    return {
      message: 'Mock Payment Gateway',
      maGiaoDich: query.maGiaoDich,
      soTien: query.soTien,
      instructions: 'POST to /payments/callback với { maGiaoDich, status: "SUCCESS", signature: "mock" }',
    };
  }
}
