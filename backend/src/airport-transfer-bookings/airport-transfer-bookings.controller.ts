import { Controller, Post, Get, Patch, Body, Param, ParseIntPipe, Query } from '@nestjs/common';
import { AirportTransferBookingsService } from './airport-transfer-bookings.service';
import { CreateAirportTransferBookingDto } from './dto/create-airport-transfer-booking.dto';
import { CreateAirportTransferPaymentDto } from './dto/create-airport-transfer-payment.dto';
import { PaymentsService } from '../payments/payments.service';

@Controller('airport-transfer-bookings')
export class AirportTransferBookingsController {
    constructor(
        private readonly airportTransferBookingsService: AirportTransferBookingsService,
        private readonly paymentsService: PaymentsService,
    ) { }

    @Post()
    createBooking(@Body() createBookingDto: CreateAirportTransferBookingDto) {
        // DEBUG: Log the received DTO
        console.log('🎯 Controller received DTO:', createBookingDto);
        console.log('🎯 dichVuId from DTO:', createBookingDto.dichVuId);
        return this.airportTransferBookingsService.createBooking(createBookingDto);
    }

    @Get(':id')
    getBookingById(@Param('id', ParseIntPipe) id: number) {
        return this.airportTransferBookingsService.getBookingById(id);
    }

    @Get('user/:userId')
    getBookingsByUserId(@Param('userId', ParseIntPipe) userId: number) {
        return this.airportTransferBookingsService.getBookingsByUserId(userId);
    }

    @Patch(':id/status')
    updateBookingStatus(
        @Param('id', ParseIntPipe) id: number,
        @Body() body: { trangThai: string },
    ) {
        return this.airportTransferBookingsService.updateBookingStatus(id, body.trangThai);
    }

    @Patch(':id/cancel')
    cancelBooking(
        @Param('id', ParseIntPipe) id: number,
        @Query('userId', ParseIntPipe) userId: number,
    ) {
        return this.airportTransferBookingsService.cancelBooking(id, userId);
    }

    // Real Payment API Integration (VNPay, MoMo, ZaloPay, VietQR)
    @Post(':bookingId/create-payment')
    async createPaymentUrl(
        @Param('bookingId', ParseIntPipe) bookingId: number,
        @Body() body: { phuongThuc: 'VNPAY' | 'MOMO' | 'ZALOPAY' | 'VIETQR' },
    ) {
        // Get booking details
        const booking = await this.airportTransferBookingsService.getBookingById(bookingId);

        if (!booking) {
            throw new Error('Không tìm thấy đặt chỗ');
        }

        const maGiaoDich = `TRANSFER${Date.now()}${bookingId}`;
        const orderInfo = `Thanh toán dịch vụ đưa đón sân bay - ${booking.loaiXe}`;

        let paymentUrl: string;

        switch (body.phuongThuc) {
            case 'VNPAY':
                paymentUrl = await this.paymentsService.createVNPayPaymentUrl(
                    maGiaoDich,
                    booking.tongTien,
                    orderInfo,
                    `Đưa đón từ ${booking.diemDon} đến ${booking.diemTra}`,
                );
                break;

            case 'MOMO':
                paymentUrl = await this.paymentsService.createMoMoPaymentUrl(
                    maGiaoDich,
                    booking.tongTien,
                    orderInfo,
                );
                break;

            case 'ZALOPAY':
                paymentUrl = await this.paymentsService.createZaloPayPaymentUrl(
                    maGiaoDich,
                    booking.tongTien,
                    orderInfo,
                );
                break;

            case 'VIETQR':
                paymentUrl = await this.paymentsService.createVietQRPaymentUrl(
                    maGiaoDich,
                    booking.tongTien,
                    orderInfo,
                );
                break;

            default:
                throw new Error('Phương thức thanh toán không hợp lệ');
        }

        // Update booking with transaction code
        await this.airportTransferBookingsService.updateBookingPaymentMethod(
            bookingId,
            body.phuongThuc,
            maGiaoDich,
        );

        return {
            success: true,
            paymentUrl,
            maGiaoDich,
            message: 'Tạo URL thanh toán thành công',
        };
    }

    @Post('payment')
    processPayment(@Body() paymentDto: CreateAirportTransferPaymentDto) {
        return this.airportTransferBookingsService.processPayment(paymentDto);
    }

    @Get(':bookingId/payments')
    getPaymentsByBookingId(@Param('bookingId', ParseIntPipe) bookingId: number) {
        return this.airportTransferBookingsService.getPaymentsByBookingId(bookingId);
    }
}
