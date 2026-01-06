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
} from '@nestjs/common';
import { BusBookingsService } from './bus-bookings.service';
import { CreateBusBookingDto } from './dto/create-bus-booking.dto';
import { CreateBusPaymentDto, VerifyBusPaymentDto } from './dto/create-bus-payment.dto';

@Controller('bus-bookings')
export class BusBookingsController {
    constructor(private readonly busBookingsService: BusBookingsService) { }

    @Post()
    createBooking(
        @Body() createDto: CreateBusBookingDto,
        @Request() req: any,
    ) {
        console.log('Received booking DTO:', JSON.stringify(createDto, null, 2));
        console.log('chuyenXeId type:', typeof createDto.chuyenXeId);
        console.log('chuyenXeId value:', createDto.chuyenXeId);
        const userId = req.user?.id || 1; // Temporary fallback
        return this.busBookingsService.createBooking(createDto, userId);
    }

    @Get(':id')
    getBookingById(@Param('id', ParseIntPipe) id: number) {
        return this.busBookingsService.getBookingById(id);
    }

    @Get('code/:maDonDat')
    getBookingByCode(@Param('maDonDat') maDonDat: string) {
        return this.busBookingsService.getBookingByCode(maDonDat);
    }

    @Get('user/:userId')
    getUserBookings(@Param('userId', ParseIntPipe) userId: number) {
        return this.busBookingsService.getUserBookings(userId);
    }

    @Patch(':id/status')
    updateBookingStatus(
        @Param('id', ParseIntPipe) id: number,
        @Body() body: { trangThaiDat: string; phuongThucThanhToan?: string },
    ) {
        return this.busBookingsService.updateBookingStatus(
            id,
            body.trangThaiDat,
            body.phuongThucThanhToan,
        );
    }

    @Delete(':id')
    cancelBooking(
        @Param('id', ParseIntPipe) id: number,
        @Request() req: any,
    ) {
        const userId = req.user?.id || 1; // Temporary fallback
        return this.busBookingsService.cancelBooking(id, userId);
    }

    // Tạo thanh toán
    @Post('payment')
    createPayment(
        @Body() createPaymentDto: CreateBusPaymentDto,
        @Request() req: any,
    ) {
        const userId = req.user?.id;
        return this.busBookingsService.createPayment(createPaymentDto, userId);
    }

    // Xác nhận thanh toán (callback từ payment gateway)
    @Post('payment/verify')
    verifyPayment(@Body() verifyDto: VerifyBusPaymentDto) {
        return this.busBookingsService.verifyPayment(verifyDto);
    }
}
