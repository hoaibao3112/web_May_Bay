import { Controller, Get, Param, ParseIntPipe } from '@nestjs/common';
import { AirportTransferCompaniesService } from './airport-transfer-companies.service';

@Controller('airport-transfer-companies')
export class AirportTransferCompaniesController {
    constructor(private readonly airportTransferCompaniesService: AirportTransferCompaniesService) { }

    @Get()
    getAllCompanies() {
        return this.airportTransferCompaniesService.getAllCompanies();
    }

    @Get(':id')
    getCompanyById(@Param('id', ParseIntPipe) id: number) {
        return this.airportTransferCompaniesService.getCompanyById(id);
    }
}
