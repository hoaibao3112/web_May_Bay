import { Controller, Get, Param, ParseIntPipe, Query } from '@nestjs/common';
import { CarRentalCompaniesService } from './car-rental-companies.service';

@Controller('car-rental-companies')
export class CarRentalCompaniesController {
    constructor(private readonly carRentalCompaniesService: CarRentalCompaniesService) { }

    @Get()
    getAllCompanies(@Query('trangThai') trangThai?: string) {
        return this.carRentalCompaniesService.getAllCompanies({ trangThai });
    }

    @Get(':id')
    getCompanyById(@Param('id', ParseIntPipe) id: number) {
        return this.carRentalCompaniesService.getCompanyById(id);
    }

    @Get(':id/vehicles')
    getCompanyVehicles(@Param('id', ParseIntPipe) id: number) {
        return this.carRentalCompaniesService.getCompanyVehicles(id);
    }

    @Get(':id/reviews')
    getCompanyReviews(
        @Param('id', ParseIntPipe) id: number,
        @Query('limit') limit?: number,
    ) {
        return this.carRentalCompaniesService.getCompanyReviews(id, limit ? +limit : 20);
    }
}
