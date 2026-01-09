import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, Like, In } from 'typeorm';
import { HoatDong } from './entities/hoat-dong.entity';
import { DanhMucHoatDong, TrangThaiDanhMuc } from './entities/danh-muc-hoat-dong.entity';
import { SearchActivitiesDto } from './dto/search-activities.dto';
import { CreateBookingDto } from './dto/create-booking.dto';

@Injectable()
export class ActivitiesService {
    constructor(
        @InjectRepository(HoatDong)
        private hoatDongRepo: Repository<HoatDong>,
        @InjectRepository(DanhMucHoatDong)
        private danhMucRepo: Repository<DanhMucHoatDong>,
    ) { }

    // Get all categories
    async getDanhMuc() {
        return this.danhMucRepo.find({
            where: { trangThai: TrangThaiDanhMuc.HOAT_DONG },
            order: { thuTu: 'ASC' },
        });
    }

    // Search activities with filters
    async search(dto: SearchActivitiesDto) {
        const { thanhPho, danhMucId, ngay, timKiem, page = 1, limit = 12, sapXep } = dto;

        const queryBuilder = this.hoatDongRepo
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
        const activity = await this.hoatDongRepo.findOne({
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
        const result = await this.hoatDongRepo
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

    // Create booking (simplified - will integrate with payments later)
    async createBooking(dto: CreateBookingDto, userId?: number) {
        const activity = await this.getById(dto.hoatDongId);

        // Calculate total price
        const priceAdult = activity.bangGia.find(g => g.loaiKhach === 'NGUOI_LON');
        const priceChild = activity.bangGia.find(g => g.loaiKhach === 'TRE_EM');

        const totalAdult = dto.soNguoiLon * (priceAdult?.gia || activity.giaTuMoiNguoi);
        const totalChild = dto.soTreEm * (priceChild?.gia || activity.giaTuMoiNguoi * 0.7);
        const tongTien = totalAdult + totalChild;

        const maDat = `ACT${Date.now()}`;

        // TODO: Save to dat_hoat_dong table
        // For now, return booking info
        return {
            maDat,
            hoatDong: activity,
            ...dto,
            tongTien,
            message: 'Đặt hoạt động thành công! Vui lòng thanh toán để hoàn tất.',
        };
    }
}
