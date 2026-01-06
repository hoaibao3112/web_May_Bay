import { Controller, Post, Get, Body, Query, Param, ParseIntPipe } from '@nestjs/common';
import { CarRentalSearchService } from './car-rental-search.service';
import { SearchCarRentalDto } from './dto/search-car-rental.dto';

@Controller('car-rental-search')
export class CarRentalSearchController {
    constructor(private readonly carRentalSearchService: CarRentalSearchService) { }

    @Post()
    searchCarRentals(@Body() searchDto: SearchCarRentalDto) {
        return this.carRentalSearchService.searchCarRentals(searchDto);
    }

    @Get('routes')
    getPopularRoutes(@Query('limit') limit?: number) {
        return this.carRentalSearchService.getPopularRoutes(limit ? +limit : 10);
    }

    @Get('companies')
    getCarRentalCompanies() {
        return this.carRentalSearchService.getCarRentalCompanies();
    }

    @Get('car-types')
    getCarTypes() {
        return this.carRentalSearchService.getCarTypes();
    }

    @Get(':id')
    getRentalOptionById(@Param('id', ParseIntPipe) id: number) {
        return this.carRentalSearchService.getRentalOptionById(id);
    }
}
