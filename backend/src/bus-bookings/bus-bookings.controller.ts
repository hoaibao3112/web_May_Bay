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
import { BusBookingsService } from './bus-bookings.service';
import { CreateBusBookingDto } from './dto/create-bus-booking.dto';
import { CreateBusPaymentDto, VerifyBusPaymentDto } from './dto/create-bus-payment.dto';
import { QrCodeService } from '../qr-code/qr-code.service';
import { JwtAuthGuard } from '../auth/jwt.guard';

@Controller('bus-bookings')
export class BusBookingsController {
    constructor(
        private readonly busBookingsService: BusBookingsService,
        private readonly qrCodeService: QrCodeService,
    ) { }

    @Post()
    @UseGuards(JwtAuthGuard) // ✅ FIXED: Added security guard
    createBooking(
        @Body() createDto: CreateBusBookingDto,
        @Request() req: any,
    ) {
        console.log('Received booking DTO:', JSON.stringify(createDto, null, 2));
        console.log('chuyenXeId type:', typeof createDto.chuyenXeId);
        console.log('chuyenXeId value:', createDto.chuyenXeId);
        
        // ✅ FIXED: Remove fallback || 1 and validate user
        if (!req.user?.id) {
            throw new UnauthorizedException('Vui lòng đăng nhập để đặt vé');
        }
        const userId = req.user.id;
        
        return this.busBookingsService.createBooking(createDto, userId);
    }

    @Get(':id')
    getBookingById(@Param('id', ParseIntPipe) id: number) {
        return this.busBookingsService.getBookingById(id);
    }

    @Get(':id/details')
    async getBookingDetails(@Param('id', ParseIntPipe) id: number) {
        const booking = await this.busBookingsService.getBookingById(id);
        const qrCode = await this.qrCodeService.generateBusQrCode(id);
        return {
            ...booking,
            qrCode,
        };
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
        
        return this.busBookingsService.cancelBooking(id, userId);
    }

    // Tạo thanh toán
    @Post('payment')
    @UseGuards(JwtAuthGuard) // ✅ FIXED: Added security guard
    createPayment(
        @Body() createPaymentDto: CreateBusPaymentDto,
        @Request() req: any,
    ) {
        // ✅ FIXED: Validate user, no fallback
        if (!req.user?.id) {
            throw new UnauthorizedException('Vui lòng đăng nhập để thanh toán');
        }
        const userId = req.user.id;
        
        return this.busBookingsService.createPayment(createPaymentDto, userId);
    }

    // Xác nhận thanh toán (callback từ payment gateway)
    @Post('payment/verify')
    verifyPayment(@Body() verifyDto: VerifyBusPaymentDto) {
        return this.busBookingsService.verifyPayment(verifyDto);
    }
}
