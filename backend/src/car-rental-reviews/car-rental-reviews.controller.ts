import { Controller, Post, Get, Body, Param, ParseIntPipe, Query, Request } from '@nestjs/common';
import { CarRentalReviewsService } from './car-rental-reviews.service';
import { CreateCarRentalReviewDto } from './dto/create-car-rental-review.dto';

@Controller('car-rental-reviews')
export class CarRentalReviewsController {
    constructor(private readonly carRentalReviewsService: CarRentalReviewsService) { }

    @Post()
    createReview(
        @Body() createDto: CreateCarRentalReviewDto,
        @Request() req: any,
    ) {
        const userId = req.user?.id || 1; // Temporary fallback
        return this.carRentalReviewsService.createReview(createDto, userId);
    }

    @Get('company/:companyId')
    getCompanyReviews(
        @Param('companyId', ParseIntPipe) companyId: number,
        @Query('limit') limit?: number,
    ) {
        return this.carRentalReviewsService.getCompanyReviews(companyId, limit ? +limit : 20);
    }

    @Get('booking/:bookingId')
    getBookingReview(@Param('bookingId', ParseIntPipe) bookingId: number) {
        return this.carRentalReviewsService.getBookingReview(bookingId);
    }
}
