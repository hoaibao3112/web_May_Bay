import { Controller, Post, Get, Body, Param, Query } from '@nestjs/common';
import { CheckinService } from './checkin.service';

@Controller('checkin')
export class CheckinController {
  constructor(private checkinService: CheckinService) {}

  // Check-in online cho hành khách
  @Post('online')
  async checkinOnline(@Body() body: { hanhKhachId: number; soGhe?: string }) {
    return this.checkinService.checkinOnline(body.hanhKhachId, body.soGhe);
  }

  // Lấy thẻ lên máy bay (boarding pass)
  @Get('boarding-pass/:hanhKhachId')
  async getBoardingPass(@Param('hanhKhachId') hanhKhachId: string) {
    return this.checkinService.getBoardingPass(+hanhKhachId);
  }

  // Kiểm tra tình trạng check-in của booking
  @Get('status/:bookingId')
  async getCheckinStatus(@Param('bookingId') bookingId: string) {
    return this.checkinService.getCheckinStatus(+bookingId);
  }

  // Hủy check-in
  @Post('cancel')
  async cancelCheckin(@Body() body: { hanhKhachId: number }) {
    return this.checkinService.cancelCheckin(body.hanhKhachId);
  }

  // Kiểm tra điều kiện check-in
  @Get('eligible/:bookingId')
  async checkEligibility(@Param('bookingId') bookingId: string) {
    return this.checkinService.checkEligibility(+bookingId);
  }
}
