import {
    Injectable,
    NotFoundException,
    BadRequestException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import * as QRCode from 'qrcode';
import { QrCodeDataInterface } from './dto/qr-code.dto';

@Injectable()
export class QrCodeService {
    constructor(private prisma: PrismaService) { }

    /**
     * Generate QR code for a booking
     */
    async generateQrCode(bookingId: number): Promise<string> {
        // Fetch booking details
        const booking = await this.prisma.donDatVe.findUnique({
            where: { id: bookingId },
            include: {
                changBay: {
                    include: {
                        chuyenBay: true,
                        sanBayDi: true,
                        sanBayDen: true,
                    },
                },
                hanhKhach: {
                    select: {
                        id: true,
                        ho: true,
                        ten: true,
                        loai: true,
                    },
                },
            },
        });

        if (!booking) {
            throw new NotFoundException('Không tìm thấy đơn đặt vé');
        }

        // Create QR data structure
        const qrData: QrCodeDataInterface = {
            bookingId: booking.id,
            maDatVe: booking.maDatVe,
            hanhKhach: booking.hanhKhach,
            changBay: {
                soHieuChuyenBay: booking.changBay.chuyenBay.soHieuChuyenBay,
                sanBayDi: booking.changBay.sanBayDi.tenSanBay,
                sanBayDen: booking.changBay.sanBayDen.tenSanBay,
                gioDi: booking.changBay.gioDi.toISOString(),
                gioDen: booking.changBay.gioDen.toISOString(),
            },
            generatedAt: new Date().toISOString(),
        };

        // Generate QR code as data URL (base64)
        const qrCodeDataUrl = await QRCode.toDataURL(JSON.stringify(qrData), {
            errorCorrectionLevel: 'H',
            width: 300,
            margin: 2,
        });

        return qrCodeDataUrl;
    }

    /**
     * Verify QR code data and return booking details
     */
    async verifyQrCode(qrData: string) {
        try {
            const parsedData: QrCodeDataInterface = JSON.parse(qrData);

            // Validate structure
            if (!parsedData.bookingId || !parsedData.maDatVe) {
                throw new BadRequestException('Mã QR không hợp lệ');
            }

            // Fetch current booking data
            const booking = await this.prisma.donDatVe.findUnique({
                where: { id: parsedData.bookingId },
                include: {
                    changBay: {
                        include: {
                            chuyenBay: {
                                include: { hang: true },
                            },
                            sanBayDi: true,
                            sanBayDen: true,
                        },
                    },
                    hanhKhach: true,
                    thongTinLienHe: true,
                },
            });

            if (!booking) {
                throw new NotFoundException('Không tìm thấy đơn đặt vé từ mã QR');
            }

            // Verify PNR matches
            if (booking.maDatVe !== parsedData.maDatVe) {
                throw new BadRequestException('Mã đặt vé không khớp');
            }

            return {
                valid: true,
                booking,
                qrGeneratedAt: parsedData.generatedAt,
            };
        } catch (error) {
            if (error instanceof NotFoundException || error instanceof BadRequestException) {
                throw error;
            }
            throw new BadRequestException('Không thể đọc mã QR: ' + error.message);
        }
    }

    /**
     * Check-in a passenger using QR code
     */
    async checkInPassenger(hanhKhachId: number, nguoiCheckIn?: string) {
        const passenger = await this.prisma.hanhKhach.findUnique({
            where: { id: hanhKhachId },
            include: {
                donDatVe: {
                    include: {
                        changBay: {
                            include: {
                                chuyenBay: true,
                                sanBayDi: true,
                                sanBayDen: true,
                            },
                        },
                    },
                },
            },
        });

        if (!passenger) {
            throw new NotFoundException('Không tìm thấy hành khách');
        }

        // Check if already checked in
        if (passenger.daCheckin) {
            throw new BadRequestException(
                `Hành khách ${passenger.ho} ${passenger.ten} đã check-in lúc ${passenger.thoiGianCheckin?.toLocaleString('vi-VN')}`
            );
        }

        // Generate boarding pass code
        const boardingPass = this.generateBoardingPassCode(
            passenger.donDatVe.maDatVe,
            passenger.id
        );

        // Update passenger check-in status
        const updatedPassenger = await this.prisma.hanhKhach.update({
            where: { id: hanhKhachId },
            data: {
                daCheckin: true,
                thoiGianCheckin: new Date(),
                maBoardingPass: boardingPass,
            },
            include: {
                donDatVe: {
                    include: {
                        changBay: {
                            include: {
                                chuyenBay: {
                                    include: { hang: true },
                                },
                                sanBayDi: true,
                                sanBayDen: true,
                            },
                        },
                    },
                },
            },
        });

        return {
            success: true,
            message: `Check-in thành công cho ${updatedPassenger.ho} ${updatedPassenger.ten}`,
            passenger: updatedPassenger,
            boardingPass,
            checkInTime: updatedPassenger.thoiGianCheckin,
        };
    }

    /**
     * Generate boarding pass code
     */
    private generateBoardingPassCode(maDatVe: string, passengerId: number): string {
        const timestamp = Date.now().toString(36).toUpperCase();
        return `BP-${maDatVe}-${passengerId}-${timestamp}`;
    }

    /**
     * Get check-in statistics for a flight
     */
    async getFlightCheckInStats(changBayId: number) {
        const bookings = await this.prisma.donDatVe.findMany({
            where: { changBayId },
            include: {
                hanhKhach: true,
            },
        });

        const totalPassengers = bookings.reduce(
            (sum, booking) => sum + booking.hanhKhach.length,
            0
        );

        const checkedInPassengers = bookings.reduce(
            (sum, booking) =>
                sum + booking.hanhKhach.filter((p) => p.daCheckin).length,
            0
        );

        return {
            changBayId,
            totalPassengers,
            checkedInPassengers,
            notCheckedIn: totalPassengers - checkedInPassengers,
            checkInRate: totalPassengers > 0
                ? ((checkedInPassengers / totalPassengers) * 100).toFixed(2) + '%'
                : '0%',
        };
    }
}
