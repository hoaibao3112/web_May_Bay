import {
  Controller,
  Get,
  Post,
  Put,
  Body,
  Param,
  Query,
  UseGuards,
  Request,
} from '@nestjs/common';
import { BookingsService } from './bookings.service';
import { CreateBookingDto } from './dto/create-booking.dto';
import { AddPassengerDto } from './dto/add-passenger.dto';
import { AddContactDto } from './dto/add-contact.dto';
import { JwtAuthGuard } from '../auth/jwt.guard';

@Controller('bookings')
export class BookingsController {
  constructor(private bookingsService: BookingsService) {}

  // Tạo booking mới
  @Post()
  async createBooking(@Body() dto: CreateBookingDto, @Request() req?) {
    const userId = req?.user?.id;
    return this.bookingsService.createBooking(dto, userId);
  }

  // Thêm hành khách vào booking
  @Post(':id/passengers')
  async addPassenger(
    @Param('id') id: string,
    @Body() dto: AddPassengerDto,
  ) {
    return this.bookingsService.addPassenger(+id, dto);
  }

  // Thêm thông tin liên hệ
  @Post(':id/contact')
  async addContact(
    @Param('id') id: string,
    @Body() dto: AddContactDto,
  ) {
    return this.bookingsService.addContact(+id, dto);
  }

  // Lấy thông tin booking
  @Get(':id')
  async getBooking(@Param('id') id: string) {
    return this.bookingsService.getBookingById(+id);
  }

  // Tra cứu booking theo PNR
  @Get('pnr/:maDatVe')
  async getBookingByPnr(@Param('maDatVe') maDatVe: string) {
    return this.bookingsService.getBookingByPnr(maDatVe);
  }

  // Tra cứu booking
  @Get('tra-cuu')
  async findBooking(
    @Query('maDatVe') maDatVe: string,
    @Query('email') email: string,
  ) {
    return this.bookingsService.findBooking(maDatVe, email);
  }

  // Hủy booking
  @Post(':id/huy')
  async cancelBooking(@Param('id') id: string) {
    return this.bookingsService.cancelBooking(+id);
  }

  // Lấy danh sách booking của user
  @UseGuards(JwtAuthGuard)
  @Get('user/my-bookings')
  async getUserBookings(@Request() req) {
    return this.bookingsService.getUserBookings(req.user.id);
  }
}
