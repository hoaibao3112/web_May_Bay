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
  Request,
} from '@nestjs/common';
import { HotelsService } from './hotels.service';
import { JwtAuthGuard } from '../auth/jwt.guard';

@Controller('hotels')
export class HotelsController {
  constructor(private hotelsService: HotelsService) {}

  // Tìm kiếm khách sạn
  @Get('search')
  searchHotels(
    @Query('thanhPho') thanhPho?: string,
    @Query('ngayNhanPhong') ngayNhanPhong?: string,
    @Query('ngayTraPhong') ngayTraPhong?: string,
    @Query('soNguoi') soNguoi?: string,
    @Query('soPhong') soPhong?: string,
    @Query('soSao') soSao?: string,
    @Query('giaMin') giaMin?: string,
    @Query('giaMax') giaMax?: string,
  ) {
    return this.hotelsService.searchHotels({
      thanhPho,
      ngayNhanPhong,
      ngayTraPhong,
      soNguoi: soNguoi ? parseInt(soNguoi) : undefined,
      soPhong: soPhong ? parseInt(soPhong) : undefined,
      soSao: soSao ? parseInt(soSao) : undefined,
      giaMin: giaMin ? parseFloat(giaMin) : undefined,
      giaMax: giaMax ? parseFloat(giaMax) : undefined,
    });
  }

  // Lấy tất cả khách sạn
  @Get()
  getAllHotels() {
    return this.hotelsService.getAllHotels();
  }

  // Lấy chi tiết khách sạn
  @Get(':id')
  getHotelById(@Param('id') id: string) {
    return this.hotelsService.getHotelById(parseInt(id));
  }

  // Tạo khách sạn mới (Admin)
  @UseGuards(JwtAuthGuard)
  @Post()
  createHotel(@Body() body: any) {
    return this.hotelsService.createHotel(body);
  }

  // Cập nhật khách sạn (Admin)
  @UseGuards(JwtAuthGuard)
  @Put(':id')
  updateHotel(@Param('id') id: string, @Body() body: any) {
    return this.hotelsService.updateHotel(parseInt(id), body);
  }

  // Xóa khách sạn (Admin)
  @UseGuards(JwtAuthGuard)
  @Delete(':id')
  deleteHotel(@Param('id') id: string) {
    return this.hotelsService.deleteHotel(parseInt(id));
  }

  // Lấy danh sách phòng của khách sạn
  @Get(':id/rooms')
  getRoomsByHotelId(@Param('id') id: string) {
    return this.hotelsService.getRoomsByHotelId(parseInt(id));
  }

  // Tạo phòng mới (Admin)
  @UseGuards(JwtAuthGuard)
  @Post('rooms')
  createRoom(@Body() body: any) {
    return this.hotelsService.createRoom(body);
  }

  // Đặt phòng
  @UseGuards(JwtAuthGuard)
  @Post('bookings')
  createBooking(@Request() req, @Body() body: any) {
    return this.hotelsService.createBooking({
      userId: req.user.id,
      ...body,
    });
  }

  // Lấy booking của user
  @UseGuards(JwtAuthGuard)
  @Get('bookings/my-bookings')
  getMyBookings(@Request() req) {
    return this.hotelsService.getBookingsByUserId(req.user.id);
  }

  // Đánh giá khách sạn
  @UseGuards(JwtAuthGuard)
  @Post(':id/reviews')
  createReview(@Request() req, @Param('id') id: string, @Body() body: any) {
    return this.hotelsService.createReview({
      userId: req.user.id,
      khachSanId: parseInt(id),
      ...body,
    });
  }
}
