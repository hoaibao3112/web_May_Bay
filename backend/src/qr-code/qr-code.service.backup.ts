import {
    Injectable,
    NotFoundException,
    BadRequestException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import * as QRCode from 'qrcode';
import { QrCodeDataInterface } from './dto/qr-code.dto';
import { randomBytes } from 'crypto';

@Injectable()
export class QrCodeService {
    constructor(private prisma: PrismaService) { }

    private readonly FRONTEND_URL = process.env.FRONTEND_URL || 'http://localhost:3000';

    /**
     * Generate secure random token
     */
    private generateSecureToken(): string {
        return randomBytes(32).toString('hex'); // 64 characters
    }

    /**
     * Store verification token in database
     */
    private async storeVerificationToken(
        token: string,
        bookingType: string,
        bookingId: number,
        expiresInDays: number = 365 // 1 year default
    ) {
        const expiresAt = new Date();
        expiresAt.setDate(expiresAt.getDate() + expiresInDays);

        await this.prisma.qrVerificationToken.create({
            data: {
                token,
                bookingType: bookingType as any,
                bookingId,
                expiresAt,
            },
        });
    }

    /**
     * Generate QR code for a flight booking
     */
    async generateQrCode(bookingId: number): Promise<string> {
        // Verify booking exists
        const booking = await this.prisma.donDatVe.findUnique({
            where: { id: bookingId },
        });

        if (!booking) {
            throw new NotFoundException('KhÃ´ng tÃ¬m tháº¥y Ä‘Æ¡n Ä‘áº·t vÃ©');
        }

        // Generate secure token
        const token = this.generateSecureToken();

        // Store token
        await this.storeVerificationToken(token, 'FLIGHT', bookingId);

        // Create verification URL
        const verifyUrl = `${this.FRONTEND_URL}/verify/${token}`;

        // Generate QR code with URL
        const qrCodeDataUrl = await QRCode.toDataURL(verifyUrl, {
            errorCorrectionLevel: 'H',
            width: 300,
            margin: 2,
        });

        return qrCodeDataUrl;
    }

    /**
     * Verify token and fetch booking details based on type
     */
    async verifyToken(token: string) {
        // Find the token in database
        const tokenRecord = await this.prisma.qrVerificationToken.findUnique({
            where: { token },
        });

        if (!tokenRecord) {
            throw new NotFoundException('MÃ£ QR khÃ´ng há»£p lá»‡ hoáº·c Ä‘Ã£ háº¿t háº¡n');
        }

        // Check if expired
        if (tokenRecord.expiresAt && tokenRecord.expiresAt < new Date()) {
            throw new BadRequestException('MÃ£ QR Ä‘Ã£ háº¿t háº¡n');
        }

        // Fetch booking details based on type
        let bookingDetails: any;
        const { bookingType, bookingId } = tokenRecord;

        switch (bookingType) {
            case 'FLIGHT':
                bookingDetails = await this.prisma.donDatVe.findUnique({
                    where: { id: bookingId },
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
                break;

            case 'HOTEL':
                bookingDetails = await this.prisma.datPhong.findUnique({
                    where: { id: bookingId },
                    include: {
                        khachSan: true,
                        phong: true,
                        user: {
                            select: {
                                id: true,
                                hoTen: true,
                                email: true,
                                soDienThoai: true,
                            },
                        },
                    },
                });
                break;

            case 'BUS':
                bookingDetails = await this.prisma.donDatVeXe.findUnique({
                    where: { id: bookingId },
                    include: {
                        chuyenXe: {
                            include: {
                                tuyenXe: {
                                    include: {
                                        benXeDi: true,
                                        benXeDen: true,
                                        nhaXe: true,
                                    },
                                },
                                xe: true,
                            },
                        },
                        nguoiDung: {
                            select: {
                                id: true,
                                hoTen: true,
                                email: true,
                                soDienThoai: true,
                            },
                        },
                        veXe: true,
                    },
                });
                break;

            // TODO: Implement when car rental model is added to schema
            // case 'CAR':
            //     bookingDetails = await this.prisma.donThueXe.findUnique({
            //         where: { id: bookingId },
            //         include: {
            //             xe: {
            //                 include: {
            //                     nhaCungCap: true,
            //                 },
            //             },
            //             nguoiDung: {
            //                 select: {
            //                     id: true,
            //                     hoTen: true,
            //                     email: true,
            //                     soDienThoai: true,
            //                 },
            //             },
            //         },
            //     });
            //     break;

            // TODO: Implement when airport transfer model is added to schema
            // case 'TRANSFER':
            //     bookingDetails = await this.prisma.donDatDuaDon.findUnique({
            //         where: { id: bookingId },
            //         include: {
            //             dichVu: {
            //                 include: {
            //                     sanBay: true,
            //                     nhaCungCap: true,
            //                 },
            //             },
            //         },
            //     });
            //     break;

            default:
                throw new BadRequestException('Loáº¡i booking khÃ´ng há»£p lá»‡');
        }

        if (!bookingDetails) {
            throw new NotFoundException('KhÃ´ng tÃ¬m tháº¥y thÃ´ng tin Ä‘áº·t chá»—');
        }

        return {
            success: true,
            bookingType,
            booking: bookingDetails,
            verifiedAt: new Date().toISOString(),
        };
    }

    /**
     * Verify QR code data and return booking details (legacy for JSON-based QR)
     */
    async verifyQrCode(qrData: string) {
        try {
            const parsedData: QrCodeDataInterface = JSON.parse(qrData);

            // Validate structure
            if (!parsedData.bookingId || !parsedData.maDatVe) {
                throw new BadRequestException('MÃ£ QR khÃ´ng há»£p lá»‡');
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
                throw new NotFoundException('KhÃ´ng tÃ¬m tháº¥y Ä‘Æ¡n Ä‘áº·t vÃ© tá»« mÃ£ QR');
            }

            // Verify PNR matches
            if (booking.maDatVe !== parsedData.maDatVe) {
                throw new BadRequestException('MÃ£ Ä‘áº·t vÃ© khÃ´ng khá»›p');
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
            throw new BadRequestException('KhÃ´ng thá»ƒ Ä‘á»c mÃ£ QR: ' + error.message);
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
            throw new NotFoundException('KhÃ´ng tÃ¬m tháº¥y hÃ nh khÃ¡ch');
        }

        // Check if already checked in
        if (passenger.daCheckin) {
            throw new BadRequestException(
                `HÃ nh khÃ¡ch ${passenger.ho} ${passenger.ten} Ä‘Ã£ check-in lÃºc ${passenger.thoiGianCheckin?.toLocaleString('vi-VN')}`
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
            message: `Check-in thÃ nh cÃ´ng cho ${updatedPassenger.ho} ${updatedPassenger.ten}`,
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

    /**
     * Generate QR code for a hotel booking
     */
    async generateHotelQrCode(bookingId: number): Promise<string> {
        // Verify booking exists
        const booking = await this.prisma.datPhong.findUnique({
            where: { id: bookingId },
        });

        if (!booking) {
            throw new NotFoundException('KhÃ´ng tÃ¬m tháº¥y Ä‘Æ¡n Ä‘áº·t phÃ²ng');
        }

        // Generate secure token
        const token = this.generateSecureToken();

        // Store token
        await this.storeVerificationToken(token, 'HOTEL', bookingId);

        // Create verification URL
        const verifyUrl = `${this.FRONTEND_URL}/verify/${token}`;

        // Generate QR code with URL
        const qrCodeDataUrl = await QRCode.toDataURL(verifyUrl, {
            errorCorrectionLevel: 'H',
            width: 300,
            margin: 2,
        });

        return qrCodeDataUrl;
    }

    /**
     * Generate QR code for a bus booking
     */
    async generateBusQrCode(bookingId: number): Promise<string> {
        // Verify booking exists
        const booking = await this.prisma.donDatVeXe.findUnique({
            where: { id: bookingId },
        });

        if (!booking) {
            throw new NotFoundException('KhÃ´ng tÃ¬m tháº¥y Ä‘Æ¡n Ä‘áº·t xe');
        }

        // Generate secure token
        const token = this.generateSecureToken();

        // Store token
        await this.storeVerificationToken(token, 'BUS', bookingId);

        // Create verification URL
        const verifyUrl = `${this.FRONTEND_URL}/verify/${token}`;

        // Generate QR code with URL
        const qrCodeDataUrl = await QRCode.toDataURL(verifyUrl, {
            errorCorrectionLevel: 'H',
            width: 300,
            margin: 2,
        });

        return qrCodeDataUrl;
    }

    /**
     * Generate QR code for an activity booking
     * TODO: Uncomment when activity booking schema is available
     */
    // async generateActivityQrCode(bookingId: number): Promise<string> {
    //     const booking = await this.prisma.datHoatDong.findUnique({
    //         where: { maDat: bookingId },
    //         include: {
    //             hoatDong: {
    //                 select: {
    //                     id: true,
    //                     tenHoatDong: true,
    //                     diaDiem: true,
    //                 },
    //             },
    //         },
    //     });

    //     if (!booking) {
    //         throw new NotFoundException('KhÃ´ng tÃ¬m tháº¥y Ä‘Æ¡n Ä‘áº·t hoáº¡t Ä‘á»™ng');
    //     }

    //     const qrData = {
    //         type: 'ACTIVITY',
    //         bookingId: booking.maDat,
    //         hoatDong: {
    //             ten: booking.hoatDong.tenHoatDong,
    //             diaDiem: booking.hoatDong.diaDiem,
    //         },
    //         thongTinLienHe: {
    //             hoTen: booking.hoTen,
    //             email: booking.email,
    //             soDienThoai: booking.soDienThoai,
    //         },
    //         ngayThucHien: booking.ngayThucHien.toISOString(),
    //         soNguoiLon: booking.soNguoiLon,
    //         soTreEm: booking.soTreEm,
    //         tongTien: Number(booking.tongTien),
    //         generatedAt: new Date().toISOString(),
    //     };

    //     const qrCodeDataUrl = await QRCode.toDataURL(JSON.stringify(qrData), {
    //         errorCorrectionLevel: 'H',
    //         width: 300,
    //         margin: 2,
    //     });

    //     return qrCodeDataUrl;
    // }
}

