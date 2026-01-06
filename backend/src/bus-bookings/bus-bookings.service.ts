import { Injectable, BadRequestException, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateBusBookingDto } from './dto/create-bus-booking.dto';
import { randomBytes } from 'crypto';

@Injectable()
export class BusBookingsService {
    constructor(private prisma: PrismaService) { }

    async createBooking(dto: CreateBusBookingDto, userId: number) {
        // Kiểm tra chuyến xe
        const trip = await this.prisma.chuyenXe.findUnique({
            where: { id: dto.chuyenXeId },
            include: {
                tuyenXe: {
                    include: {
                        nhaXe: true,
                        benXeDi: true,
                        benXeDen: true,
                    },
                },
                xe: {
                    include: {
                        loaiXe: true,
                    },
                },
            },
        });

        if (!trip) {
            throw new NotFoundException('Không tìm thấy chuyến xe');
        }

        if (trip.soGheTrong < dto.soLuongGhe) {
            throw new BadRequestException('Không đủ ghế trống');
        }

        // Kiểm tra ghế đã được đặt chưa
        const existingTickets = await this.prisma.veXe.findMany({
            where: {
                donDatVeXe: {
                    chuyenXeId: dto.chuyenXeId,
                    trangThaiDat: {
                        in: ['CHO_THANH_TOAN', 'DA_THANH_TOAN'],
                    },
                },
                soGhe: {
                    in: dto.danhSachGhe,
                },
            },
        });

        if (existingTickets.length > 0) {
            const bookedSeats = existingTickets.map(t => t.soGhe).join(', ');
            throw new BadRequestException(`Ghế ${bookedSeats} đã được đặt`);
        }

        // Tính tổng tiền
        const tongTien = Number(trip.giaVe) * dto.soLuongGhe;

        // Tạo mã đơn đặt
        const maDonDat = this.generateBookingCode();

        // Tạo đơn đặt vé
        const booking = await this.prisma.donDatVeXe.create({
            data: {
                maDonDat,
                nguoiDungId: userId,
                chuyenXeId: dto.chuyenXeId,
                soLuongGhe: dto.soLuongGhe,
                tongTien,
                trangThaiDat: 'CHO_THANH_TOAN',
                ghiChu: dto.ghiChu,
            },
        });

        // Tạo vé cho từng hành khách
        const tickets = await Promise.all(
            dto.hanhKhach.map((passenger) =>
                this.prisma.veXe.create({
                    data: {
                        donDatVeXeId: booking.id,
                        soVe: this.generateTicketNumber(),
                        hoTenHanhKhach: passenger.hoTenHanhKhach,
                        soDienThoai: passenger.soDienThoai,
                        email: passenger.email,
                        soGhe: passenger.soGhe,
                        giaVe: trip.giaVe,
                        trangThai: 'HIEU_LUC',
                    },
                })
            )
        );

        // Giảm số ghế trống
        await this.prisma.chuyenXe.update({
            where: { id: dto.chuyenXeId },
            data: {
                soGheTrong: trip.soGheTrong - dto.soLuongGhe,
            },
        });

        return {
            ...booking,
            veXe: tickets,
            chuyenXe: trip,
        };
    }

    async getBookingById(id: number) {
        const booking = await this.prisma.donDatVeXe.findUnique({
            where: { id },
            include: {
                chuyenXe: {
                    include: {
                        tuyenXe: {
                            include: {
                                nhaXe: true,
                                benXeDi: true,
                                benXeDen: true,
                            },
                        },
                        xe: {
                            include: {
                                loaiXe: true,
                            },
                        },
                    },
                },
                veXe: true,
                nguoiDung: {
                    select: {
                        hoTen: true,
                        email: true,
                        soDienThoai: true,
                    },
                },
            },
        });

        if (!booking) {
            throw new NotFoundException('Không tìm thấy đơn đặt vé');
        }

        return booking;
    }

    async getBookingByCode(maDonDat: string) {
        const booking = await this.prisma.donDatVeXe.findUnique({
            where: { maDonDat },
            include: {
                chuyenXe: {
                    include: {
                        tuyenXe: {
                            include: {
                                nhaXe: true,
                                benXeDi: true,
                                benXeDen: true,
                            },
                        },
                        xe: {
                            include: {
                                loaiXe: true,
                            },
                        },
                        diemDung: {
                            orderBy: { thuTu: 'asc' },
                        },
                    },
                },
                veXe: true,
            },
        });

        if (!booking) {
            throw new NotFoundException('Không tìm thấy đơn đặt vé');
        }

        return booking;
    }

    async getUserBookings(userId: number) {
        return this.prisma.donDatVeXe.findMany({
            where: { nguoiDungId: userId },
            include: {
                chuyenXe: {
                    include: {
                        tuyenXe: {
                            include: {
                                nhaXe: true,
                                benXeDi: true,
                                benXeDen: true,
                            },
                        },
                    },
                },
                veXe: true,
            },
            orderBy: { createdAt: 'desc' },
        });
    }

    async updateBookingStatus(id: number, trangThaiDat: string, phuongThucThanhToan?: string) {
        return this.prisma.donDatVeXe.update({
            where: { id },
            data: {
                trangThaiDat: trangThaiDat as any,
                phuongThucThanhToan,
            },
        });
    }

    async cancelBooking(id: number, userId: number) {
        const booking = await this.prisma.donDatVeXe.findUnique({
            where: { id },
            include: {
                chuyenXe: true,
            },
        });

        if (!booking) {
            throw new NotFoundException('Không tìm thấy đơn đặt vé');
        }

        if (booking.nguoiDungId !== userId) {
            throw new BadRequestException('Bạn không có quyền hủy đơn đặt vé này');
        }

        if (booking.trangThaiDat === 'DA_HUY') {
            throw new BadRequestException('Đơn đặt vé đã bị hủy');
        }

        // Trả lại ghế
        await this.prisma.chuyenXe.update({
            where: { id: booking.chuyenXeId },
            data: {
                soGheTrong: booking.chuyenXe.soGheTrong + booking.soLuongGhe,
            },
        });

        // Cập nhật trạng thái vé
        await this.prisma.veXe.updateMany({
            where: { donDatVeXeId: id },
            data: { trangThai: 'DA_HUY' },
        });

        return this.prisma.donDatVeXe.update({
            where: { id },
            data: { trangThaiDat: 'DA_HUY' },
        });
    }

    private generateBookingCode(): string {
        const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
        let code = 'BUS';
        const bytes = randomBytes(6);
        for (let i = 0; i < 6; i++) {
            code += chars[bytes[i] % chars.length];
        }
        return code;
    }

    private generateTicketNumber(): string {
        const timestamp = Date.now().toString();
        const random = Math.floor(Math.random() * 10000).toString().padStart(4, '0');
        return `VX${timestamp}${random}`;
    }
}
