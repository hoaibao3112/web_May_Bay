import { Controller, Post, Get, Patch, Body, Param, ParseIntPipe, Query } from '@nestjs/common';
import { AirportTransferBookingsService } from './airport-transfer-bookings.service';
import { CreateAirportTransferBookingDto } from './dto/create-airport-transfer-booking.dto';
import { CreateAirportTransferPaymentDto } from './dto/create-airport-transfer-payment.dto';

@Controller('airport-transfer-bookings')
export class AirportTransferBookingsController {
    constructor(private readonly airportTransferBookingsService: AirportTransferBookingsService) { }

    @Post()
    createBooking(@Body() createBookingDto: CreateAirportTransferBookingDto) {
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

    @Patch(':id/cancel')
    cancelBooking(
        @Param('id', ParseIntPipe) id: number,
        @Query('userId', ParseIntPipe) userId: number,
    ) {
        return this.airportTransferBookingsService.cancelBooking(id, userId);
    }

    @Post('payment')
    processPayment(@Body() paymentDto: CreateAirportTransferPaymentDto) {
        return this.airportTransferBookingsService.processPayment(paymentDto);
    }
}
