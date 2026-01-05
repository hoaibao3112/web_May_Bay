import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Body,
  Param,
  Query,
  UseGuards,
} from '@nestjs/common';
import { CatalogService } from './catalog.service';
import { JwtAuthGuard } from '../auth/jwt.guard';

@Controller('catalog')
export class CatalogController {
  constructor(private catalogService: CatalogService) {}

  // ===== QUỐC GIA =====
  @Get('quoc-gia')
  getAllCountries() {
    return this.catalogService.getAllCountries();
  }

  @UseGuards(JwtAuthGuard)
  @Post('quoc-gia')
  createCountry(@Body() body: { maQuocGia: string; tenQuocGia: string }) {
    return this.catalogService.createCountry(body);
  }

  @UseGuards(JwtAuthGuard)
  @Put('quoc-gia/:id')
  updateCountry(@Param('id') id: string, @Body() body: { tenQuocGia?: string }) {
    return this.catalogService.updateCountry(+id, body);
  }

  @UseGuards(JwtAuthGuard)
  @Delete('quoc-gia/:id')
  deleteCountry(@Param('id') id: string) {
    return this.catalogService.deleteCountry(+id);
  }

  // ===== THÀNH PHỐ =====
  @Get('thanh-pho')
  getAllCities(@Query('q') query?: string) {
    return this.catalogService.getCities(query);
  }

  @Get('thanh-pho-vn')
  getVietnamCities(@Query('q') query?: string) {
    return this.catalogService.getVietnamCities(query);
  }

  @Get('thanh-pho-quoc-te')
  getInternationalCities(@Query('q') query?: string) {
    return this.catalogService.getInternationalCities(query);
  }

  // ===== SÂN BAY =====
  @Get('san-bay')
  getAllAirports(@Query('q') query?: string) {
    if (query) {
      return this.catalogService.searchAirports(query);
    }
    return this.catalogService.getAllAirports();
  }

  @Get('san-bay/:maIata')
  getAirportByIata(@Param('maIata') maIata: string) {
    return this.catalogService.getAirportByIata(maIata);
  }

  @UseGuards(JwtAuthGuard)
  @Post('san-bay')
  createAirport(@Body() body: any) {
    return this.catalogService.createAirport(body);
  }

  @UseGuards(JwtAuthGuard)
  @Put('san-bay/:id')
  updateAirport(@Param('id') id: string, @Body() body: any) {
    return this.catalogService.updateAirport(+id, body);
  }

  @UseGuards(JwtAuthGuard)
  @Delete('san-bay/:id')
  deleteAirport(@Param('id') id: string) {
    return this.catalogService.deleteAirport(+id);
  }

  // ===== HÃNG HÀNG KHÔNG =====
  @Get('hang-hang-khong')
  getAllAirlines() {
    return this.catalogService.getAllAirlines();
  }

  @Get('hang-hang-khong/:maIata')
  getAirlineByCode(@Param('maIata') maIata: string) {
    return this.catalogService.getAirlineByCode(maIata);
  }

  @UseGuards(JwtAuthGuard)
  @Post('hang-hang-khong')
  createAirline(@Body() body: { maIata: string; tenHang: string; logo?: string }) {
    return this.catalogService.createAirline(body);
  }

  @UseGuards(JwtAuthGuard)
  @Put('hang-hang-khong/:id')
  updateAirline(@Param('id') id: string, @Body() body: { tenHang?: string; logo?: string }) {
    return this.catalogService.updateAirline(+id, body);
  }

  @UseGuards(JwtAuthGuard)
  @Delete('hang-hang-khong/:id')
  deleteAirline(@Param('id') id: string) {
    return this.catalogService.deleteAirline(+id);
  }

  // ===== TIỀN TỆ =====
  @Get('tien-te')
  getAllCurrencies() {
    return this.catalogService.getAllCurrencies();
  }

  @UseGuards(JwtAuthGuard)
  @Post('tien-te')
  createCurrency(@Body() body: { maTienTe: string; tenTienTe: string; tyGia: number }) {
    return this.catalogService.createCurrency(body);
  }
}
