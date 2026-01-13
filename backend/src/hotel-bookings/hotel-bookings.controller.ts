import {
    Controller,
    Get,
    Post,
    Patch,
    Delete,
    Body,
    Param,
    ParseIntPipe,
    Request,
} from '@nestjs/common';
import { HotelBookingsService } from './hotel-bookings.service';
import { PaymentsService } from '../payments/payments.service';
import { CreateHotelBookingDto } from './dto/create-hotel-booking.dto';
import { QrCodeService } from '../qr-code/qr-code.service';

@Controller('hotel-bookings')
export class HotelBookingsController {
    constructor(
        private readonly hotelBookingsService: HotelBookingsService,
        private readonly paymentsService: PaymentsService,
        private readonly qrCodeService: QrCodeService,
    ) { }

    @Post()
    createBooking(
        @Body() createDto: CreateHotelBookingDto,
        @Request() req: any,
    ) {
        const userId = req.user?.id || 1; // Temporary fallback
        return this.hotelBookingsService.createBooking(createDto, userId);
    }

    @Get(':id')
    getBookingById(@Param('id', ParseIntPipe) id: number) {
        return this.hotelBookingsService.getBookingById(id);
    }

    @Get(':id/details')
    async getBookingDetails(@Param('id', ParseIntPipe) id: number) {
        const booking = await this.hotelBookingsService.getBookingById(id);
        const qrCode = await this.qrCodeService.generateHotelQrCode(id);
        return {
            ...booking,
            qrCode,
        };
    }

    @Get('user/:userId')
    getUserBookings(@Param('userId', ParseIntPipe) userId: number) {
        return this.hotelBookingsService.getUserBookings(userId);
    }

    @Patch(':id/status')
    updateBookingStatus(
        @Param('id', ParseIntPipe) id: number,
        @Body() body: { trangThai: string },
    ) {
        return this.hotelBookingsService.updateBookingStatus(id, body.trangThai);
    }

    @Post(':id/payment')
    async createPayment(
        @Param('id', ParseIntPipe) bookingId: number,
        @Body() body: { phuongThuc: string },
    ) {
        // Get booking info
        const booking = await this.hotelBookingsService.getBookingById(bookingId);

        if (!booking) {
            throw new Error('Không tìm thấy đơn đặt phòng');
        }

        // Generate transaction ID
        const maGiaoDich = `HOTELPM${Date.now()}${Math.random().toString(36).substr(2, 6).toUpperCase()}`;
        const orderInfo = `Thanh toan dat phong ${booking.maDatPhong}`;
        const orderDescription = `Booking ${booking.khachSan.tenKhachSan} - ${booking.phong.tenPhong}`;

        let paymentUrl = '';

        // Create payment based on method
        if (body.phuongThuc === 'VNPAY') {
            paymentUrl = await this.paymentsService.createVNPayPaymentUrl(
                maGiaoDich,
                Number(booking.tongTien),
                orderInfo,
                orderDescription,
            );
        } else if (body.phuongThuc === 'ZALOPAY') {
            paymentUrl = await this.paymentsService.createZaloPayPaymentUrl(
                maGiaoDich,
                Number(booking.tongTien),
                orderInfo,
            );
        } else if (body.phuongThuc === 'MOMO') {
            paymentUrl = await this.paymentsService.createMoMoPaymentUrl(
                maGiaoDich,
                Number(booking.tongTien),
                orderInfo,
            );
        } else {
            throw new Error('Phương thức thanh toán không hợp lệ');
        }

        // Create payment record
        await this.paymentsService['prisma'].thanhToanDatPhong.create({
            data: {
                datPhongId: bookingId,
                soTien: booking.tongTien,
                phuongThuc: body.phuongThuc,
                trangThai: 'KHOI_TAO',
                maGiaoDich,
            },
        });

        return {
            paymentUrl,
            maGiaoDich,
            bookingId,
        };
    }

    @Delete(':id')
    cancelBooking(
        @Param('id', ParseIntPipe) id: number,
        @Request() req: any,
    ) {
        const userId = req.user?.id || 1;
        return this.hotelBookingsService.cancelBooking(id, userId);
    }
}
