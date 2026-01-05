import { Controller, Post, Body, Get, Param } from '@nestjs/common';
import { SearchService } from './search.service';
import { SearchFlightDto } from './dto/search-flight.dto';

@Controller('search')
export class SearchController {
  constructor(private searchService: SearchService) {}

  @Post()
  async searchFlights(@Body() dto: SearchFlightDto) {
    return this.searchService.searchFlights(dto);
  }

  @Get('chuyen-bay/:id')
  async getFlightById(@Param('id') id: string) {
    return this.searchService.getFlightById(parseInt(id));
  }
}
