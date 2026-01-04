import { Controller, Post, Get, Body, Param, Query, UseGuards, Request } from '@nestjs/common';
import { ReviewsService } from './reviews.service';
import { JwtAuthGuard } from '../auth/jwt.guard';

@Controller('reviews')
export class ReviewsController {
  constructor(private reviewsService: ReviewsService) {}

  // Tạo đánh giá cho hãng hàng không
  @UseGuards(JwtAuthGuard)
  @Post('airline')
  async createAirlineReview(
    @Body() body: { hangId: number; soSao: number; binhLuan?: string; hinhAnh?: string[] },
    @Request() req,
  ) {
    return this.reviewsService.createAirlineReview(
      req.user.id,
      body.hangId,
      body.soSao,
      body.binhLuan,
      body.hinhAnh,
    );
  }

  // Lấy đánh giá của hãng hàng không
  @Get('airline/:hangId')
  async getAirlineReviews(
    @Param('hangId') hangId: string,
    @Query('page') page: number = 1,
    @Query('limit') limit: number = 10,
  ) {
    return this.reviewsService.getAirlineReviews(+hangId, page, limit);
  }

  // Lấy rating trung bình của hãng
  @Get('airline/:hangId/rating')
  async getAirlineRating(@Param('hangId') hangId: string) {
    return this.reviewsService.getAirlineRating(+hangId);
  }

  // Lấy đánh giá của user
  @UseGuards(JwtAuthGuard)
  @Get('my-reviews')
  async getUserReviews(@Request() req) {
    return this.reviewsService.getUserReviews(req.user.id);
  }

  // Xóa đánh giá (chỉ người tạo mới xóa được)
  @UseGuards(JwtAuthGuard)
  @Post('delete/:reviewId')
  async deleteReview(@Param('reviewId') reviewId: string, @Request() req) {
    return this.reviewsService.deleteReview(+reviewId, req.user.id);
  }
}
