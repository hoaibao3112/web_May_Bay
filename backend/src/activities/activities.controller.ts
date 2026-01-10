import { Controller, Get, Post, Body, Param, Query, ParseIntPipe, Patch } from '@nestjs/common';
import { ActivitiesService } from './activities.service';
import { SearchActivitiesDto } from './dto/search-activities.dto';
import { CreateBookingDto } from './dto/create-booking.dto';

@Controller('activities')
export class ActivitiesController {
    constructor(private readonly activitiesService: ActivitiesService) { }

    // Get all categories
    @Get('categories')
    async getCategories() {
        return this.activitiesService.getDanhMuc();
    }

    // Get popular cities
    @Get('cities')
    async getCities() {
        return this.activitiesService.getThanhPhoPhoBien();
    }

    // Search activities
    @Get('search')
    async search(@Query() dto: SearchActivitiesDto) {
        return this.activitiesService.search(dto);
    }

    // Get activity by ID
    @Get(':id')
    getById(@Param('id') id: string) {
        return this.activitiesService.getById(+id);
    }

    // ==================== BOOKING ENDPOINTS ====================

    @Post('bookings')
    createBooking(@Body() dto: any) {
        return this.activitiesService.createBooking(dto);
    }

    @Get('bookings/my-orders')
    getMyOrders(@Query('email') email: string) {
        if (!email) {
            throw new Error('Email is required');
        }
        return this.activitiesService.getBookingsByEmail(email);
    }

    @Get('bookings/:maDat')
    getBookingByCode(@Param('maDat') maDat: string) {
        return this.activitiesService.getBookingByCode(maDat);
    }

    @Patch('bookings/:maDat/payment-success')
    markPaymentSuccess(@Param('maDat') maDat: string) {
        return this.activitiesService.updateBookingPaymentStatus(maDat, true);
    }

    @Patch('bookings/:maDat/cancel')
    cancelBooking(@Param('maDat') maDat: string) {
        return this.activitiesService.cancelBooking(maDat);
    }
}
