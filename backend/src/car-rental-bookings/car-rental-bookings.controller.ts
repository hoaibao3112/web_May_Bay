import {
    Controller,
    Get,
    Post,
    Body,
    Patch,
    Param,
    Delete,
    ParseIntPipe,
    Request,
} from '@nestjs/common';
import { CarRentalBookingsService } from './car-rental-bookings.service';
import { CreateCarRentalBookingDto } from './dto/create-car-rental-booking.dto';
import { CreateCarRentalPaymentDto, VerifyCarRentalPaymentDto } from './dto/create-car-rental-payment.dto';

@Controller('car-rental-bookings')
export class CarRentalBookingsController {
    constructor(private readonly carRentalBookingsService: CarRentalBookingsService) { }

    @Post()
    createBooking(
        @Body() createDto: CreateCarRentalBookingDto,
        @Request() req: any,
    ) {
        const userId = req.user?.id || 1; // Temporary fallback
        return this.carRentalBookingsService.createBooking(createDto, userId);
    }

    @Get(':id')
    getBookingById(@Param('id', ParseIntPipe) id: number) {
        return this.carRentalBookingsService.getBookingById(id);
    }

    @Get('code/:maDonThue')
    getBookingByCode(@Param('maDonThue') maDonThue: string) {
        return this.carRentalBookingsService.getBookingByCode(maDonThue);
    }

    @Get('user/:userId')
    getUserBookings(@Param('userId', ParseIntPipe) userId: number) {
        return this.carRentalBookingsService.getUserBookings(userId);
    }

    @Patch(':id/status')
    updateBookingStatus(
        @Param('id', ParseIntPipe) id: number,
        @Body() body: { trangThai: string; tenTaiXe?: string; soDienThoaiTaiXe?: string; bienSoXe?: string },
    ) {
        return this.carRentalBookingsService.updateBookingStatus(
            id,
            body.trangThai,
            body,
        );
    }

    @Delete(':id')
    cancelBooking(
        @Param('id', ParseIntPipe) id: number,
        @Request() req: any,
    ) {
        const userId = req.user?.id || 1; // Temporary fallback
        return this.carRentalBookingsService.cancelBooking(id, userId);
    }

    @Post('payment')
    createPayment(
        @Body() createPaymentDto: CreateCarRentalPaymentDto,
        @Request() req: any,
    ) {
        const userId = req.user?.id;
        return this.carRentalBookingsService.createPayment(createPaymentDto, userId);
    }

    @Post('payment/verify')
    verifyPayment(@Body() verifyDto: VerifyCarRentalPaymentDto) {
        return this.carRentalBookingsService.verifyPayment(verifyDto);
    }
}
