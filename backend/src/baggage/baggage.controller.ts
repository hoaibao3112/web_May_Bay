import { Controller, Post, Get, Body, Param, Delete } from '@nestjs/common';
import { BaggageService } from './baggage.service';

@Controller('baggage')
export class BaggageController {
  constructor(private baggageService: BaggageService) {}

  // Thêm hành lý ký gửi cho hành khách
  @Post('add')
  async addBaggage(@Body() body: { hanhKhachId: number; soKien: number; khoiLuong: number }) {
    return this.baggageService.addBaggage(body.hanhKhachId, body.soKien, body.khoiLuong);
  }

  // Lấy thông tin hành lý của booking
  @Get('booking/:bookingId')
  async getBookingBaggage(@Param('bookingId') bookingId: string) {
    return this.baggageService.getBookingBaggage(+bookingId);
  }

  // Tính phí hành lý vượt định mức
  @Post('calculate-fee')
  async calculateBaggageFee(
    @Body() body: { hangVeId: number; khoiLuong: number },
  ) {
    return this.baggageService.calculateBaggageFee(body.hangVeId, body.khoiLuong);
  }

  // Xóa hành lý
  @Delete(':id')
  async removeBaggage(@Param('id') id: string) {
    return this.baggageService.removeBaggage(+id);
  }

  // Lấy chính sách hành lý theo hạng vé
  @Get('policy/:hangVeId')
  async getBaggagePolicy(@Param('hangVeId') hangVeId: string) {
    return this.baggageService.getBaggagePolicy(+hangVeId);
  }
}
