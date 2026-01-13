import {
    Controller,
    Get,
    Post,
    Body,
    Param,
    ParseIntPipe,
    HttpCode,
    HttpStatus,
} from '@nestjs/common';
import { QrCodeService } from './qr-code.service';
import { VerifyQrCodeDto, CheckInDto } from './dto/qr-code.dto';

@Controller('qr-code')
export class QrCodeController {
    constructor(private readonly qrCodeService: QrCodeService) { }

    /**
     * Generate QR code for a booking
     * GET /api/qr-code/booking/:bookingId
     */
    @Get('booking/:bookingId')
    async generateQrCode(@Param('bookingId', ParseIntPipe) bookingId: number) {
        const qrCodeDataUrl = await this.qrCodeService.generateQrCode(bookingId);
        return {
            success: true,
            bookingId,
            qrCode: qrCodeDataUrl,
        };
    }

    /**
     * Verify QR code token and return booking details
     * GET /api/qr-code/verify/:token
     */
    @Get('verify/:token')
    async verifyToken(@Param('token') token: string) {
        const result = await this.qrCodeService.verifyToken(token);
        return result;
    }

    /**
     * Verify QR code data (legacy - for JSON-based QR codes)
     * POST /api/qr-code/verify
     */
    @Post('verify')
    @HttpCode(HttpStatus.OK)
    async verifyQrCode(@Body() dto: VerifyQrCodeDto) {
        const result = await this.qrCodeService.verifyQrCode(dto.qrData);
        return result;
    }

    /**
     * Check-in passenger using QR code
     * POST /api/qr-code/check-in
     */
    @Post('check-in')
    @HttpCode(HttpStatus.OK)
    async checkInPassenger(@Body() dto: CheckInDto) {
        const result = await this.qrCodeService.checkInPassenger(
            dto.hanhKhachId,
            dto.nguoiCheckIn
        );
        return result;
    }

    /**
     * Get check-in statistics for a flight
     * GET /api/qr-code/flight/:changBayId/stats
     */
    @Get('flight/:changBayId/stats')
    async getFlightCheckInStats(
        @Param('changBayId', ParseIntPipe) changBayId: number
    ) {
        const stats = await this.qrCodeService.getFlightCheckInStats(changBayId);
        return {
            success: true,
            stats,
        };
    }
}
