import {
    Controller,
    Get,
    Post,
    Body,
    Patch,
    Param,
    Delete,
    ParseIntPipe,
    Request,
    UseGuards,
    UnauthorizedException,
} from '@nestjs/common';
import { CarRentalBookingsService } from './car-rental-bookings.service';
import { CreateCarRentalBookingDto } from './dto/create-car-rental-booking.dto';
import { CreateCarRentalPaymentDto, VerifyCarRentalPaymentDto } from './dto/create-car-rental-payment.dto';
import { JwtAuthGuard } from '../auth/jwt.guard';

@Controller('car-rental-bookings')
export class CarRentalBookingsController {
    constructor(private readonly carRentalBookingsService: CarRentalBookingsService) { }

    @Post()
    @UseGuards(JwtAuthGuard) // ✅ FIXED: Added security guard
    createBooking(
        @Body() createDto: CreateCarRentalBookingDto,
        @Request() req: any,
    ) {
        // ✅ FIXED: Remove fallback || 1 and validate user
        if (!req.user?.id) {
            throw new UnauthorizedException('Vui lòng đăng nhập để thuê xe');
        }
        const userId = req.user.id;
        
        return this.carRentalBookingsService.createBooking(createDto, userId);
    }

    @Get(':id')
    getBookingById(@Param('id', ParseIntPipe) id: number) {
        return this.carRentalBookingsService.getBookingById(id);
    }

    @Get('code/:maDonThue')
    getBookingByCode(@Param('maDonThue') maDonThue: string) {
        return this.carRentalBookingsService.getBookingByCode(maDonThue);
    }

    @Get('user/:userId')
    getUserBookings(@Param('userId', ParseIntPipe) userId: number) {
        return this.carRentalBookingsService.getUserBookings(userId);
    }

    @Patch(':id/status')
    updateBookingStatus(
        @Param('id', ParseIntPipe) id: number,
        @Body() body: { trangThai: string; tenTaiXe?: string; soDienThoaiTaiXe?: string; bienSoXe?: string },
    ) {
        return this.carRentalBookingsService.updateBookingStatus(
            id,
            body.trangThai,
            body,
        );
    }

    @Delete(':id')
    @UseGuards(JwtAuthGuard) // ✅ FIXED: Added security guard
    cancelBooking(
        @Param('id', ParseIntPipe) id: number,
        @Request() req: any,
    ) {
        // ✅ FIXED: Remove fallback || 1 and validate user
        if (!req.user?.id) {
            throw new UnauthorizedException('Vui lòng đăng nhập để hủy đặt vé');
        }
        const userId = req.user.id;
        
        return this.carRentalBookingsService.cancelBooking(id, userId);
    }

    @Post('payment')
    @UseGuards(JwtAuthGuard) // ✅ FIXED: Added security guard
    createPayment(
        @Body() createPaymentDto: CreateCarRentalPaymentDto,
        @Request() req: any,
    ) {
        // ✅ FIXED: Validate user, no fallback
        if (!req.user?.id) {
            throw new UnauthorizedException('Vui lòng đăng nhập để thanh toán');
        }
        const userId = req.user.id;
        
        return this.carRentalBookingsService.createPayment(createPaymentDto, userId);
    }

    @Post('payment/verify')
    verifyPayment(@Body() verifyDto: VerifyCarRentalPaymentDto) {
        return this.carRentalBookingsService.verifyPayment(verifyDto);
    }
}
