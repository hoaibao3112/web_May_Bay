import { Controller, Post, Get, Body, Param, Query, UseGuards, Request } from '@nestjs/common';
import { NotificationsService } from './notifications.service';
import { JwtAuthGuard } from '../auth/jwt.guard';

@Controller('notifications')
export class NotificationsController {
  constructor(private notificationsService: NotificationsService) {}

  // Gửi thông báo về chuyến bay (delay, hủy, thay đổi cổng)
  @Post('flight-update')
  async sendFlightUpdate(
    @Body()
    body: {
      changBayId: number;
      loaiThongBao: 'DELAY' | 'CANCELLED' | 'GATE_CHANGE' | 'ON_TIME';
      noiDung: string;
      gioMoi?: Date;
      congMoi?: string;
    },
  ) {
    return this.notificationsService.sendFlightUpdate(
      body.changBayId,
      body.loaiThongBao,
      body.noiDung,
      body.gioMoi,
      body.congMoi,
    );
  }

  // Lấy thông báo của user
  @UseGuards(JwtAuthGuard)
  @Get('my-notifications')
  async getUserNotifications(@Request() req, @Query('page') page: number = 1) {
    return this.notificationsService.getUserNotifications(req.user.id, page);
  }

  // Đánh dấu đã đọc
  @UseGuards(JwtAuthGuard)
  @Post('mark-read/:notificationId')
  async markAsRead(@Param('notificationId') notificationId: string) {
    return this.notificationsService.markAsRead(+notificationId);
  }

  // Đánh dấu tất cả đã đọc
  @UseGuards(JwtAuthGuard)
  @Post('mark-all-read')
  async markAllAsRead(@Request() req) {
    return this.notificationsService.markAllAsRead(req.user.id);
  }

  // Lấy số thông báo chưa đọc
  @UseGuards(JwtAuthGuard)
  @Get('unread-count')
  async getUnreadCount(@Request() req) {
    return this.notificationsService.getUnreadCount(req.user.id);
  }

  // Lấy thông báo theo booking
  @Get('booking/:bookingId')
  async getBookingNotifications(@Param('bookingId') bookingId: string) {
    return this.notificationsService.getBookingNotifications(+bookingId);
  }
}
