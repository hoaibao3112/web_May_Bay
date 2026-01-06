import { Controller, Post, Get, Body, Query, Param, ParseIntPipe } from '@nestjs/common';
import { BusSearchService } from './bus-search.service';
import { SearchBusDto } from './dto/search-bus.dto';

@Controller('bus-search')
export class BusSearchController {
    constructor(private readonly busSearchService: BusSearchService) { }

    @Post()
    searchTrips(@Body() searchDto: SearchBusDto) {
        return this.busSearchService.searchTrips(searchDto);
    }

    @Get('popular-routes')
    getPopularRoutes(@Query('limit') limit?: number) {
        return this.busSearchService.getPopularRoutes(limit ? +limit : 10);
    }

    @Get('suggestions')
    suggestStations(@Query('q') query: string) {
        return this.busSearchService.suggestStations(query);
    }

    @Get(':id')
    getTripById(@Param('id', ParseIntPipe) id: number) {
        return this.busSearchService.getTripById(id);
    }
}
