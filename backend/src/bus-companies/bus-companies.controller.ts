import {
    Controller,
    Get,
    Post,
    Body,
    Patch,
    Param,
    Delete,
    Query,
    ParseIntPipe,
} from '@nestjs/common';
import { BusCompaniesService } from './bus-companies.service';
import { CreateBusCompanyDto } from './dto/create-bus-company.dto';
import { UpdateBusCompanyDto } from './dto/update-bus-company.dto';

@Controller('bus-companies')
export class BusCompaniesController {
    constructor(private readonly busCompaniesService: BusCompaniesService) { }

    @Post()
    create(@Body() createDto: CreateBusCompanyDto) {
        return this.busCompaniesService.create(createDto);
    }

    @Get()
    findAll(
        @Query('trangThai') trangThai?: string,
        @Query('search') search?: string,
    ) {
        return this.busCompaniesService.findAll({ trangThai, search });
    }

    @Get(':id')
    findOne(@Param('id', ParseIntPipe) id: number) {
        return this.busCompaniesService.findOne(id);
    }

    @Patch(':id')
    update(
        @Param('id', ParseIntPipe) id: number,
        @Body() updateDto: UpdateBusCompanyDto,
    ) {
        return this.busCompaniesService.update(id, updateDto);
    }

    @Delete(':id')
    remove(@Param('id', ParseIntPipe) id: number) {
        return this.busCompaniesService.remove(id);
    }

    @Get(':id/reviews')
    getReviews(
        @Param('id', ParseIntPipe) id: number,
        @Query('page', ParseIntPipe) page: number = 1,
        @Query('limit', ParseIntPipe) limit: number = 10,
    ) {
        return this.busCompaniesService.getReviews(id, page, limit);
    }
}
