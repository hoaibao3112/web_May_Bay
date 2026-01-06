import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateCarRentalBookingDto } from './dto/create-car-rental-booking.dto';
import { CreateCarRentalPaymentDto, VerifyCarRentalPaymentDto } from './dto/create-car-rental-payment.dto';

@Injectable()
export class CarRentalBookingsService {
    constructor(private prisma: PrismaService) { }

    async createBooking(createDto: CreateCarRentalBookingDto, userId: number) {
        // Generate unique booking code
        const maDonThue = await this.generateBookingCode();

        // Verify car type availability
        const loaiXe = await this.prisma.loaiXeThue.findUnique({
            where: { id: createDto.loaiXeId },
        });

        if (!loaiXe) {
            throw new NotFoundException('Loại xe không tồn tại');
        }

        // Check capacity
        if (createDto.soHanhKhach > loaiXe.soHanhKhach) {
            throw new BadRequestException(
                `Loại xe này chỉ chứa tối đa ${loaiXe.soHanhKhach} hành khách`,
            );
        }

        if (createDto.soHanhLy > loaiXe.soHanhLy) {
            throw new BadRequestException(
                `Loại xe này chỉ chứa tối đa ${loaiXe.soHanhLy} hành lý`,
            );
        }

        // Create booking
        const booking = await this.prisma.donThueXe.create({
            data: {
                maDonThue,
                nguoiDungId: userId,
                nhaCungCapId: createDto.nhaCungCapId,
                xeThueId: createDto.xeThueId,
                loaiXeId: createDto.loaiXeId,
                diemDon: createDto.diemDon,
                diaChiDon: createDto.diaChiDon,
                diemTra: createDto.diemTra,
                diaChiTra: createDto.diaChiTra,
                thoiGianDon: new Date(createDto.thoiGianDon),
                thoiGianTraDuKien: createDto.thoiGianTraDuKien
                    ? new Date(createDto.thoiGianTraDuKien)
                    : null,
                soHanhKhach: createDto.soHanhKhach,
                soHanhLy: createDto.soHanhLy,
                tenHanhKhach: createDto.tenHanhKhach,
                soDienThoai: createDto.soDienThoai,
                email: createDto.email,
                ghiChu: createDto.ghiChu,
                soHieuChuyenBay: createDto.soHieuChuyenBay,
                gioHaCanh: createDto.gioHaCanh ? new Date(createDto.gioHaCanh) : null,
                giaThue: createDto.giaThue,
                phuThu: createDto.phuThu || 0,
                giamGia: createDto.giamGia || 0,
                tongTien: createDto.tongTien,
                phuongThucThanhToan: createDto.phuongThucThanhToan,
                trangThai: 'CHO_XAC_NHAN',
            },
            include: {
                nhaCungCap: {
                    select: {
                        id: true,
                        tenNhaCungCap: true,
                        logo: true,
                        soDienThoai: true,
                        email: true,
                    },
                },
                xeThue: true,
                nguoiDung: {
                    select: {
                        id: true,
                        email: true,
                        hoTen: true,
                    },
                },
            },
        });

        return {
            success: true,
            message: 'Đặt xe thành công',
            data: booking,
        };
    }

    async getBookingById(id: number) {
        const booking = await this.prisma.donThueXe.findUnique({
            where: { id },
            include: {
                nhaCungCap: true,
                xeThue: {
                    include: {
                        loaiXe: true,
                    },
                },
                nguoiDung: {
                    select: {
                        id: true,
                        email: true,
                        hoTen: true,
                        soDienThoai: true,
                    },
                },
                thanhToanThueXe: true,
            },
        });

        if (!booking) {
            throw new NotFoundException('Không tìm thấy đơn đặt xe');
        }

        return booking;
    }

    async getBookingByCode(maDonThue: string) {
        const booking = await this.prisma.donThueXe.findUnique({
            where: { maDonThue },
            include: {
                nhaCungCap: true,
                xeThue: {
                    include: {
                        loaiXe: true,
                    },
                },
                nguoiDung: {
                    select: {
                        id: true,
                        email: true,
                        hoTen: true,
                        soDienThoai: true,
                    },
                },
                thanhToanThueXe: true,
            },
        });

        if (!booking) {
            throw new NotFoundException('Không tìm thấy đơn đặt xe');
        }

        return booking;
    }

    async getUserBookings(userId: number) {
        const bookings = await this.prisma.donThueXe.findMany({
            where: { nguoiDungId: userId },
            include: {
                nhaCungCap: {
                    select: {
                        id: true,
                        tenNhaCungCap: true,
                        logo: true,
                    },
                },
                xeThue: {
                    include: {
                        loaiXe: true,
                    },
                },
                thanhToanThueXe: true,
            },
            orderBy: {
                createdAt: 'desc',
            },
        });

        return bookings;
    }

    async updateBookingStatus(
        id: number,
        trangThai: string,
        additionalData?: any,
    ) {
        const booking = await this.prisma.donThueXe.findUnique({
            where: { id },
        });

        if (!booking) {
            throw new NotFoundException('Không tìm thấy đơn đặt xe');
        }

        const updateData: any = { trangThai };

        // Add driver info if status is DA_XAC_NHAN
        if (trangThai === 'DA_XAC_NHAN' && additionalData) {
            if (additionalData.tenTaiXe) updateData.tenTaiXe = additionalData.tenTaiXe;
            if (additionalData.soDienThoaiTaiXe)
                updateData.soDienThoaiTaiXe = additionalData.soDienThoaiTaiXe;
            if (additionalData.bienSoXe) updateData.bienSoXe = additionalData.bienSoXe;
        }

        const updatedBooking = await this.prisma.donThueXe.update({
            where: { id },
            data: updateData,
            include: {
                nhaCungCap: true,
                xeThue: {
                    include: {
                        loaiXe: true,
                    },
                },
            },
        });

        return {
            success: true,
            message: 'Cập nhật trạng thái thành công',
            data: updatedBooking,
        };
    }

    async cancelBooking(id: number, userId: number) {
        const booking = await this.prisma.donThueXe.findUnique({
            where: { id },
        });

        if (!booking) {
            throw new NotFoundException('Không tìm thấy đơn đặt xe');
        }

        if (booking.nguoiDungId !== userId) {
            throw new BadRequestException('Bạn không có quyền hủy đơn này');
        }

        if (booking.trangThai === 'DA_HUY') {
            throw new BadRequestException('Đơn đặt xe đã được hủy trước đó');
        }

        if (booking.trangThai === 'HOAN_THANH') {
            throw new BadRequestException('Không thể hủy đơn đã hoàn thành');
        }

        const updatedBooking = await this.prisma.donThueXe.update({
            where: { id },
            data: { trangThai: 'DA_HUY' },
        });

        return {
            success: true,
            message: 'Hủy đơn đặt xe thành công',
            data: updatedBooking,
        };
    }

    async createPayment(createPaymentDto: CreateCarRentalPaymentDto, userId?: number) {
        const booking = await this.prisma.donThueXe.findUnique({
            where: { id: createPaymentDto.donThueXeId },
        });

        if (!booking) {
            throw new NotFoundException('Không tìm thấy đơn đặt xe');
        }

        // Generate transaction code
        const maGiaoDich = `PAY${Date.now()}${Math.floor(Math.random() * 1000)}`;

        const payment = await this.prisma.thanhToanThueXe.create({
            data: {
                donThueXeId: createPaymentDto.donThueXeId,
                soTien: createPaymentDto.soTien,
                phuongThuc: createPaymentDto.phuongThuc,
                maGiaoDich,
                trangThai: 'KHOI_TAO',
            },
        });

        // In real implementation, integrate with payment gateway here
        // For now, return mock payment URL
        return {
            success: true,
            message: 'Tạo thanh toán thành công',
            data: {
                payment,
                paymentUrl: `https://payment-gateway.example.com/pay?code=${maGiaoDich}`,
            },
        };
    }

    async verifyPayment(verifyDto: VerifyCarRentalPaymentDto) {
        const payment = await this.prisma.thanhToanThueXe.findUnique({
            where: { maGiaoDich: verifyDto.maGiaoDich },
            include: {
                donThueXe: true,
            },
        });

        if (!payment) {
            throw new NotFoundException('Không tìm thấy giao dịch');
        }

        const trangThai = verifyDto.trangThai === 'THANH_CONG' ? 'THANH_CONG' : 'THAT_BAI';

        const updatedPayment = await this.prisma.thanhToanThueXe.update({
            where: { id: payment.id },
            data: {
                trangThai,
                thongTinGiaoDich: verifyDto.thongTinGiaoDich,
            },
        });

        // Update booking status if payment successful
        if (trangThai === 'THANH_CONG') {
            await this.prisma.donThueXe.update({
                where: { id: payment.donThueXeId },
                data: { trangThai: 'DA_XAC_NHAN' },
            });
        }

        return {
            success: true,
            message: 'Xác nhận thanh toán thành công',
            data: updatedPayment,
        };
    }

    private async generateBookingCode(): Promise<string> {
        const prefix = 'CR';
        const date = new Date();
        const dateStr = date.toISOString().slice(0, 10).replace(/-/g, '');
        const random = Math.floor(Math.random() * 100000)
            .toString()
            .padStart(5, '0');
        return `${prefix}${dateStr}${random}`;
    }
}
