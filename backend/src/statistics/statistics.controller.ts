import { Controller, Get, Query, UseGuards } from '@nestjs/common';
import { StatisticsService } from './statistics.service';
import { JwtAuthGuard } from '../auth/jwt.guard';

@Controller('statistics')
export class StatisticsController {
  constructor(private statisticsService: StatisticsService) {}

  // Thống kê tổng quan
  @Get('overview')
  async getOverview(
    @Query('startDate') startDate?: string,
    @Query('endDate') endDate?: string,
  ) {
    return this.statisticsService.getOverview(startDate, endDate);
  }

  // Thống kê doanh thu theo thời gian
  @Get('revenue')
  async getRevenue(
    @Query('startDate') startDate: string,
    @Query('endDate') endDate: string,
    @Query('groupBy') groupBy: 'day' | 'month' | 'year' = 'day',
  ) {
    return this.statisticsService.getRevenue(startDate, endDate, groupBy);
  }

  // Thống kê hạng vé phổ biến
  @Get('popular-classes')
  async getPopularClasses() {
    return this.statisticsService.getPopularClasses();
  }

  // Thống kê tuyến bay phổ biến
  @Get('popular-routes')
  async getPopularRoutes(@Query('limit') limit: number = 10) {
    return this.statisticsService.getPopularRoutes(limit);
  }

  // Thống kê hãng hàng không
  @Get('airlines')
  async getAirlineStats() {
    return this.statisticsService.getAirlineStats();
  }

  // Thống kê theo thành phố
  @Get('cities')
  async getCityStats() {
    return this.statisticsService.getCityStats();
  }
}
