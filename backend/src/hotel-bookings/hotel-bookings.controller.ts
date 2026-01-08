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
import { CreateHotelBookingDto } from './dto/create-hotel-booking.dto';

@Controller('hotel-bookings')
export class HotelBookingsController {
    constructor(private readonly hotelBookingsService: HotelBookingsService) { }

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

    @Delete(':id')
    cancelBooking(
        @Param('id', ParseIntPipe) id: number,
        @Request() req: any,
    ) {
        const userId = req.user?.id || 1;
        return this.hotelBookingsService.cancelBooking(id, userId);
    }
}
