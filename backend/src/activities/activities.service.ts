import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { HoatDong } from './entities/hoat-dong.entity';
import { DanhMucHoatDong, TrangThaiDanhMuc } from './entities/danh-muc-hoat-dong.entity';
import { DatHoatDong } from './entities/dat-hoat-dong.entity';
import { SearchActivitiesDto } from './dto/search-activities.dto';
import { CreateActivityBookingDto } from './dto/create-activity-booking.dto';

@Injectable()
export class ActivitiesService {
    constructor(
        @InjectRepository(HoatDong)
        private hoatDongRepository: Repository<HoatDong>,
        @InjectRepository(DanhMucHoatDong)
        private danhMucRepository: Repository<DanhMucHoatDong>,
        @InjectRepository(DatHoatDong)
        private datHoatDongRepository: Repository<DatHoatDong>,
    ) { }

    // Get all categories
    async getDanhMuc() {
        return this.danhMucRepository.find({
            where: { trangThai: TrangThaiDanhMuc.HOAT_DONG },
            order: { thuTu: 'ASC' },
        });
    }

    // Search activities with filters
    async search(dto: SearchActivitiesDto) {
        const { thanhPho, danhMucId, ngay, timKiem, page = 1, limit = 12, sapXep } = dto;

        const queryBuilder = this.hoatDongRepository
            .createQueryBuilder('hd')
            .leftJoinAndSelect('hd.hinhAnh', 'hinh')
            .leftJoinAndSelect('hd.danhMuc', 'dm')
            .leftJoinAndSelect('hd.nhaCungCap', 'ncc')
            .leftJoinAndSelect('hd.bangGia', 'gia')
            .leftJoinAndSelect('hd.diemNoiBat', 'diem')
            .where('hd.trangThai = :trangThai', { trangThai: 'HOAT_DONG' });

        // Apply filters
        if (thanhPho) {
            queryBuilder.andWhere('hd.thanhPho = :thanhPho', { thanhPho });
        }

        if (danhMucId) {
            queryBuilder.andWhere('hd.danhMucId = :danhMucId', { danhMucId });
        }

        if (timKiem) {
            queryBuilder.andWhere(
                '(hd.tenHoatDong LIKE :timKiem OR hd.moTaNgan LIKE :timKiem OR hd.diaDiem LIKE :timKiem)',
                { timKiem: `%${timKiem}%` },
            );
        }

        // Sorting
        switch (sapXep) {
            case 'gia-tang':
                queryBuilder.orderBy('hd.giaTuMoiNguoi', 'ASC');
                break;
            case 'gia-giam':
                queryBuilder.orderBy('hd.giaTuMoiNguoi', 'DESC');
                break;
            case 'pho-bien':
                queryBuilder.orderBy('hd.soLuotDat', 'DESC');
                break;
            case 'danh-gia':
                queryBuilder.orderBy('hd.danhGiaTrungBinh', 'DESC');
                break;
            default:
                queryBuilder.orderBy('hd.soLuotDat', 'DESC');
        }

        // Pagination
        const total = await queryBuilder.getCount();
        const activities = await queryBuilder
            .skip((page - 1) * limit)
            .take(limit)
            .getMany();

        return {
            data: activities,
            meta: {
                page,
                limit,
                total,
                totalPages: Math.ceil(total / limit),
            },
        };
    }

    // Get activity details
    async getById(id: number) {
        const activity = await this.hoatDongRepository.findOne({
            where: { id },
            relations: [
                'hinhAnh',
                'bangGia',
                'lichTrinh',
                'diemNoiBat',
                'danhGia',
                'danhMuc',
                'nhaCungCap',
            ],
        });

        if (!activity) {
            throw new NotFoundException('Không tìm thấy hoạt động');
        }

        return activity;
    }

    // Get popular cities for activities
    async getThanhPhoPhoBien() {
        const result = await this.hoatDongRepository
            .createQueryBuilder('hd')
            .select('hd.thanhPho', 'thanhPho')
            .addSelect('COUNT(hd.id)', 'soLuong')
            .where('hd.trangThai = :trangThai', { trangThai: 'HOAT_DONG' })
            .groupBy('hd.thanhPho')
            .orderBy('soLuong', 'DESC')
            .limit(10)
            .getRawMany();

        return result;
    }

    // ==================== BOOKING METHODS ====================

    /**
   * Create activity booking
   */
    async createBooking(dto: CreateActivityBookingDto) {
        // Verify activity exists
        const activity = await this.hoatDongRepository.findOne({
            where: { id: dto.hoatDongId },
            relations: ['bangGia'],
        });

        if (!activity) {
            throw new NotFoundException('Hoạt động không tồn tại');
        }

        // Calculate total price
        const adultPrice = activity.bangGia?.find(p => p.loaiKhach === 'NGUOI_LON')?.gia || activity.giaTuMoiNguoi;
        const childPrice = activity.bangGia?.find(p => p.loaiKhach === 'TRE_EM')?.gia || activity.giaTuMoiNguoi * 0.7;
        const tongTien = (dto.soNguoiLon * adultPrice) + (dto.soTreEm * childPrice);

        // Generate unique booking code
        const maDat = `ACT${Date.now()}${Math.random().toString(36).substr(2, 6).toUpperCase()}`;

        // Create booking
        const booking = this.datHoatDongRepository.create({
            maDat,
            hoatDongId: dto.hoatDongId,
            hoTen: dto.hoTen,
            email: dto.email,
            soDienThoai: dto.soDienThoai,
            ngayThucHien: new Date(dto.ngayThucHien),
            soNguoiLon: dto.soNguoiLon,
            soTreEm: dto.soTreEm,
            tongTien,
            phuongThucThanhToan: dto.phuongThucThanhToan,
            ghiChu: dto.ghiChu,
            daThanhToan: false,
        });

        await this.datHoatDongRepository.save(booking);

        // Generate payment URL based on method
        let paymentUrl = '';
        const params = new URLSearchParams({
            amount: tongTien.toString(),
            orderInfo: `Dat tour ${activity.tenHoatDong}`,
            orderId: maDat,
        });

        if (dto.phuongThucThanhToan === 'MOMO') {
            paymentUrl = `/mock-momo?${params.toString()}`;
        } else if (dto.phuongThucThanhToan === 'VIETQR') {
            params.append('bankCode', 'VCB');
            params.append('accountNo', '1234567890');
            params.append('accountName', 'CONG TY DU LICH');
            paymentUrl = `/mock-vietqr?${params.toString()}`;
        } else if (dto.phuongThucThanhToan === 'ZALOPAY') {
            paymentUrl = `/mock-zalopay?${params.toString()}`;
        }

        return {
            id: booking.id,
            maDat: booking.maDat,
            tongTien: booking.tongTien,
            trangThai: booking.trangThai,
            daThanhToan: booking.daThanhToan,
            paymentUrl,
            hoatDong: {
                id: activity.id,
                tenHoatDong: activity.tenHoatDong,
            },
        };
    }

    /**
     * Get bookings by email
     */
    async getBookingsByEmail(email: string) {
        const bookings = await this.datHoatDongRepository.find({
            where: { email },
            relations: ['hoatDong', 'hoatDong.hinhAnh'],
            order: { created_at: 'DESC' },
        });

        return bookings;
    }

    /**
     * Get booking by order code
     */
    async getBookingByCode(maDat: string) {
        const booking = await this.datHoatDongRepository.findOne({
            where: { maDat },
            relations: ['hoatDong', 'hoatDong.hinhAnh', 'hoatDong.danhMuc'],
        });

        if (!booking) {
            throw new NotFoundException('Không tìm thấy đơn đặt chỗ');
        }

        return booking;
    }

    /**
     * Update booking payment status
     */
    async updateBookingPaymentStatus(maDat: string, daThanhToan: boolean) {
        const booking = await this.getBookingByCode(maDat);

        booking.daThanhToan = daThanhToan;
        if (daThanhToan) {
            booking.trangThai = 'DA_XAC_NHAN' as any;
        }
        await this.datHoatDongRepository.save(booking);

        // TODO: Send email confirmation here
        console.log(`✉️ Email sent to ${booking.email}: Booking ${maDat} - Paid: ${daThanhToan}`);

        return booking;
    }

    /**
     * Cancel booking
     */
    async cancelBooking(maDat: string) {
        const booking = await this.getBookingByCode(maDat);
        booking.trangThai = 'HUY' as any;
        await this.datHoatDongRepository.save(booking);
        return booking;
    }
}
