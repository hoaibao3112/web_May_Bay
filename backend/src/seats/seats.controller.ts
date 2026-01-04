import { Controller, Get, Post, Body, Param, Query } from '@nestjs/common';
import { SeatsService } from './seats.service';

@Controller('seats')
export class SeatsController {
  constructor(private seatsService: SeatsService) {}

  // Lấy sơ đồ ghế của chuyến bay
  @Get('map/:changBayId')
  async getSeatMap(@Param('changBayId') changBayId: string) {
    return this.seatsService.getSeatMap(+changBayId);
  }

  // Chọn ghế cho hành khách
  @Post('select')
  async selectSeat(@Body() body: { hanhKhachId: number; soGhe: string }) {
    return this.seatsService.selectSeat(body.hanhKhachId, body.soGhe);
  }

  // Lấy ghế đã chọn của booking
  @Get('booking/:bookingId')
  async getBookingSeats(@Param('bookingId') bookingId: string) {
    return this.seatsService.getBookingSeats(+bookingId);
  }

  // Hủy chọn ghế
  @Post('cancel')
  async cancelSeat(@Body() body: { hanhKhachId: number }) {
    return this.seatsService.cancelSeat(body.hanhKhachId);
  }

  // Kiểm tra ghế còn trống
  @Get('availability/:changBayId')
  async checkAvailability(@Param('changBayId') changBayId: string) {
    return this.seatsService.checkAvailability(+changBayId);
  }
}
