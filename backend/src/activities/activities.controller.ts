import { Controller, Get, Post, Body, Param, Query, ParseIntPipe } from '@nestjs/common';
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
    async getById(@Param('id', ParseIntPipe) id: number) {
        return this.activitiesService.getById(id);
    }

    // Create booking
    @Post('bookings')
    async createBooking(@Body() dto: CreateBookingDto) {
        return this.activitiesService.createBooking(dto);
    }
}
