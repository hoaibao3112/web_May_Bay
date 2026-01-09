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

    @Get('bookings/:maDatCho')
    getBookingByCode(@Param('maDatCho') maDatCho: string) {
        return this.activitiesService.getBookingByCode(maDatCho);
    }

    @Patch('bookings/:maDatCho/payment-success')
    markPaymentSuccess(@Param('maDatCho') maDatCho: string) {
        return this.activitiesService.updateBookingPaymentStatus(
            maDatCho,
            'DA_THANH_TOAN' as any,
        );
    }

    @Patch('bookings/:maDatCho/cancel')
    cancelBooking(@Param('maDatCho') maDatCho: string) {
        return this.activitiesService.cancelBooking(maDatCho);
    }
}
