import { Controller, Post, Get, Body, Query, Param, ParseIntPipe } from '@nestjs/common';
import { AirportTransferSearchService } from './airport-transfer-search.service';
import { SearchAirportTransferDto } from './dto/search-airport-transfer.dto';

@Controller('airport-transfer-search')
export class AirportTransferSearchController {
    constructor(private readonly airportTransferSearchService: AirportTransferSearchService) { }

    @Post()
    searchServices(@Body() searchDto: SearchAirportTransferDto) {
        return this.airportTransferSearchService.searchServices(searchDto);
    }

    @Get()
    searchServicesGet(
        @Query('sanBayId') sanBayId: string,
        @Query('ngayDon') ngayDon?: string,
        @Query('soHanhKhach') soHanhKhach?: string,
        @Query('loaiXe') loaiXe?: string,
        @Query('giaMin') giaMin?: string,
        @Query('giaMax') giaMax?: string,
    ) {
        const searchDto: SearchAirportTransferDto = {
            sanBayId: parseInt(sanBayId),
            ngayDon: ngayDon || new Date().toISOString().split('T')[0],
            soHanhKhach: soHanhKhach ? parseInt(soHanhKhach) : 1,
            loaiXe: loaiXe as any,
            giaMin: giaMin ? parseFloat(giaMin) : undefined,
            giaMax: giaMax ? parseFloat(giaMax) : undefined,
        };
        return this.airportTransferSearchService.searchServices(searchDto);
    }

    @Get('popular-airports')
    getPopularAirports(@Query('limit') limit?: number) {
        return this.airportTransferSearchService.getPopularAirports(limit ? +limit : 5);
    }

    @Get('suggestions')
    suggestAirports(@Query('q') query: string) {
        return this.airportTransferSearchService.suggestAirports(query);
    }

    @Get('suggest-destinations')
    suggestDestinations(@Query('q') query: string, @Query('city') city?: string) {
        return this.airportTransferSearchService.suggestDestinations(query, city);
    }

    @Get(':id')
    getServiceById(@Param('id', ParseIntPipe) id: number) {
        return this.airportTransferSearchService.getServiceById(id);
    }
}
