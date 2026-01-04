import { Controller, Post, Get, Body, Param, Query } from '@nestjs/common';
import { PromotionsService } from './promotions.service';

@Controller('promotions')
export class PromotionsController {
  constructor(private promotionsService: PromotionsService) {}

  // Áp dụng mã khuyến mãi
  @Post('apply')
  async applyPromotion(@Body() body: { code: string; bookingId: number }) {
    return this.promotionsService.applyPromotion(body.code, body.bookingId);
  }

  // Kiểm tra mã khuyến mãi hợp lệ
  @Get('validate/:code')
  async validatePromotion(@Param('code') code: string) {
    return this.promotionsService.validatePromotion(code);
  }

  // Lấy danh sách khuyến mãi đang hoạt động
  @Get('active')
  async getActivePromotions() {
    return this.promotionsService.getActivePromotions();
  }

  // Lấy khuyến mãi theo user (nếu có điều kiện đặc biệt)
  @Get('for-user/:userId')
  async getPromotionsForUser(@Param('userId') userId: string) {
    return this.promotionsService.getPromotionsForUser(+userId);
  }

  // Hủy áp dụng mã khuyến mãi
  @Post('remove')
  async removePromotion(@Body() body: { bookingId: number }) {
    return this.promotionsService.removePromotion(body.bookingId);
  }
}
