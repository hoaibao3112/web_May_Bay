import { Controller, Post, Get, Body, Param, ParseIntPipe } from '@nestjs/common';
import { AirportTransferReviewsService } from './airport-transfer-reviews.service';
import { CreateAirportTransferReviewDto } from './dto/create-airport-transfer-review.dto';

@Controller('airport-transfer-reviews')
export class AirportTransferReviewsController {
    constructor(private readonly airportTransferReviewsService: AirportTransferReviewsService) { }

    @Post()
    createReview(@Body() createReviewDto: CreateAirportTransferReviewDto) {
        return this.airportTransferReviewsService.createReview(createReviewDto);
    }

    @Get('company/:companyId')
    getReviewsByCompanyId(@Param('companyId', ParseIntPipe) companyId: number) {
        return this.airportTransferReviewsService.getReviewsByCompanyId(companyId);
    }
}
