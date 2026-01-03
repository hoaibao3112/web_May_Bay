import { Controller, Get, Post, Body } from '@nestjs/common';
import { PrismaService } from './prisma/prisma.service';

@Controller('test-db')
export class TestDbController {
  constructor(private prisma: PrismaService) {}

  // Test đọc dữ liệu
  @Get('users')
  async getUsers() {
    const users = await this.prisma.user.findMany({
      select: { id: true, email: true, hoTen: true, vaiTro: true }
    });
    return {
      message: 'Đọc từ MySQL database',
      count: users.length,
      users
    };
  }

  // Test thêm dữ liệu mới
  @Post('create-test-user')
  async createTestUser(@Body() body: { email: string; name: string }) {
    const newUser = await this.prisma.user.create({
      data: {
        email: body.email,
        password: 'test123',
        hoTen: body.name,
        vaiTro: 'CUSTOMER'
      }
    });
    
    return {
      message: '✅ ĐÃ THÊM VÀO MYSQL DATABASE',
      user: newUser,
      note: 'Kiểm tra MySQL Workbench hoặc phpMyAdmin để xem dữ liệu mới'
    };
  }

  // Test đếm số đơn đặt vé
  @Get('bookings-count')
  async getBookingsCount() {
    const total = await this.prisma.donDatVe.count();
    const byStatus = await this.prisma.donDatVe.groupBy({
      by: ['trangThai'],
      _count: true
    });
    
    return {
      message: 'Thống kê từ MySQL database',
      totalBookings: total,
      byStatus
    };
  }

  // Test cập nhật dữ liệu
  @Post('update-test/:id')
  async updateUser(@Body() body: { id: number; name: string }) {
    const updated = await this.prisma.user.update({
      where: { id: body.id },
      data: { hoTen: body.name }
    });
    
    return {
      message: '✅ ĐÃ CẬP NHẬT TRONG MYSQL DATABASE',
      updated
    };
  }
}
