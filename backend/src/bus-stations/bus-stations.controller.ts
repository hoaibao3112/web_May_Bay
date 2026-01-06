import { Controller, Get, Param, Query, ParseIntPipe } from '@nestjs/common';
import { BusStationsService } from './bus-stations.service';

@Controller('bus-stations')
export class BusStationsController {
    constructor(private readonly busStationsService: BusStationsService) { }

    @Get()
    findAll(
        @Query('thanhPho') thanhPho?: string,
        @Query('khuVuc') khuVuc?: string,
        @Query('search') search?: string,
    ) {
        return this.busStationsService.findAll({ thanhPho, khuVuc, search });
    }

    @Get('search')
    searchByCity(@Query('city') city: string) {
        return this.busStationsService.searchByCity(city);
    }

    @Get(':id')
    findOne(@Param('id', ParseIntPipe) id: number) {
        return this.busStationsService.findOne(id);
    }
}
