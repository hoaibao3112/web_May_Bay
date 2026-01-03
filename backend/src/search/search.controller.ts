import { Controller, Post, Body } from '@nestjs/common';
import { SearchService } from './search.service';
import { SearchFlightDto } from './dto/search-flight.dto';

@Controller('search')
export class SearchController {
  constructor(private searchService: SearchService) {}

  @Post()
  async searchFlights(@Body() dto: SearchFlightDto) {
    return this.searchService.searchFlights(dto);
  }
}
