import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateHotelBookingDto } from './dto/create-hotel-booking.dto';

@Injectable()
export class HotelBookingsService {
    constructor(private prisma: PrismaService) { }

    async createBooking(createDto: CreateHotelBookingDto, userId: number) {
        console.log('📥 Received booking DTO:', JSON.stringify(createDto, null, 2));
        console.log('👤 User ID:', userId);

        const {
            khachSanId, phongId, ngayNhanPhong, ngayTraPhong,
            soLuongPhong, soNguoiLon, soTreEm,
            tenKhachHang, email, soDienThoai, yeuCauDacBiet
        } = createDto;

        console.log('🔍 Extracted values:', {
            khachSanId,
            phongId,
            ngayNhanPhong,
            ngayTraPhong,
        });

        // Calculate number of nights
        const checkIn = new Date(ngayNhanPhong);
        const checkOut = new Date(ngayTraPhong);
        const soNgay = Math.ceil((checkOut.getTime() - checkIn.getTime()) / (1000 * 60 * 60 * 24));

        // Get room price from database
        const phong = await this.prisma.phongKhachSan.findUnique({
            where: { id: phongId },
            include: { khachSan: true },
        });

        if (!phong) {
            throw new Error('Phòng không tồn tại');
        }

        const giaPhong = Number(phong.giaTheoNgay);
        const tongTien = giaPhong * soNgay * soLuongPhong;

        // Generate booking code
        const maDatPhong = `HTL${Date.now()}${userId}`;

        // Create booking in database
        const booking = await this.prisma.datPhong.create({
            data: {
                maDatPhong,
                userId,
                khachSanId,
                phongId,
                ngayNhanPhong: checkIn,
                ngayTraPhong: checkOut,
                soPhong: soLuongPhong,
                soNguoiLon,
                soTreEm,
                tongTien,
                trangThai: 'CHO_XAC_NHAN',
                ghiChu: yeuCauDacBiet,
            },
            include: {
                khachSan: true,
                phong: true,
            },
        });

        return booking;
    }

    async getBookingById(id: number) {
        const booking = await this.prisma.datPhong.findUnique({
            where: { id },
            include: {
                khachSan: {
                    include: {
                        gallery: true,
                    },
                },
                phong: true,
                user: {
                    select: {
                        id: true,
                        email: true,
                        hoTen: true,
                        soDienThoai: true,
                    },
                },
                thanhToanDP: true,
            },
        });

        if (!booking) {
            throw new Error('Không tìm thấy đơn đặt phòng');
        }

        return booking;
    }

    async getUserBookings(userId: number) {
        return this.prisma.datPhong.findMany({
            where: { userId },
            include: {
                khachSan: true,
                phong: true,
                thanhToanDP: true,
            },
            orderBy: {
                createdAt: 'desc',
            },
        });
    }

    async updateBookingStatus(id: number, trangThai: string) {
        const validStatuses = ['CHO_XAC_NHAN', 'DA_XAC_NHAN', 'DANG_LUU_TRU', 'DA_CHECKOUT', 'DA_HUY', 'KHONG_DEN'];
        if (!validStatuses.includes(trangThai)) {
            throw new Error('Trạng thái không hợp lệ');
        }

        return this.prisma.datPhong.update({
            where: { id },
            data: { trangThai: trangThai as any },
            include: {
                khachSan: true,
                phong: true,
            },
        });
    }

    async cancelBooking(id: number, userId: number) {
        // Verify booking belongs to user
        const booking = await this.prisma.datPhong.findFirst({
            where: { id, userId },
        });

        if (!booking) {
            throw new Error('Không tìm thấy đơn đặt phòng hoặc bạn không có quyền hủy');
        }

        return this.prisma.datPhong.update({
            where: { id },
            data: { trangThai: 'DA_HUY' },
        });
    }
}
