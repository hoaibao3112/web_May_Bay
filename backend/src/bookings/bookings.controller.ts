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
  Logger,
  BadRequestException,
} from '@nestjs/common';
import { BookingsService } from './bookings.service';
import { CreateBookingDto } from './dto/create-booking.dto';
import { AddPassengerDto } from './dto/add-passenger.dto';
import { AddContactDto } from './dto/add-contact.dto';
import { JwtAuthGuard } from '../auth/jwt.guard';
import { QrCodeService } from '../qr-code/qr-code.service';

@Controller('bookings')
export class BookingsController {
  private readonly logger = new Logger(BookingsController.name);

  constructor(
    private bookingsService: BookingsService,
    private qrCodeService: QrCodeService,
  ) { }

  // Tạo booking mới (có thể đăng nhập hoặc không)
  @Post()
  async createBooking(@Body() dto: CreateBookingDto, @Request() req?) {
    try {
      const userId = req?.user?.id;
      
      if (process.env.NODE_ENV === 'development') {
        this.logger.debug(`Creating booking`, {
          changBayId: dto.changBayId,
          hangVeId: dto.hangVeId,
          passengerCount: dto.hanhKhach?.length || 0,
        });
      }

      return await this.bookingsService.createBooking(dto, userId);
    } catch (error) {
      this.logger.error('Error creating booking:', error.message);
      throw new BadRequestException(
        error.message || 'Không thể tạo đơn đặt vé',
      );
    }
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

  // Lấy thông tin booking với QR code
  @Get(':id/details')
  async getBookingDetails(@Param('id') id: string) {
    const booking = await this.bookingsService.getBookingById(+id);
    const qrCode = await this.qrCodeService.generateQrCode(+id);
    return {
      ...booking,
      qrCode,
    };
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
