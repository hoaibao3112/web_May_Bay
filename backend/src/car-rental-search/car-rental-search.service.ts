import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { SearchCarRentalDto } from './dto/search-car-rental.dto';

@Injectable()
export class CarRentalSearchService {
    constructor(private prisma: PrismaService) { }

    async searchCarRentals(searchDto: SearchCarRentalDto) {
        const {
            diemDiId,
            diemDi,
            diemDen,
            tuyenDuongId,
            ngayGioDon,
            soHanhKhach,
            soHanhLy,
            loaiXeId,
            nhaCungCapId,
            giaMin,
            giaMax,
        } = searchDto;

        // Build where clause for filtering
        const whereClause: any = {
            trangThai: 'HOAT_DONG',
        };

        if (tuyenDuongId) {
            whereClause.tuyenDuongId = tuyenDuongId;
        }

        if (nhaCungCapId) {
            whereClause.nhaCungCapId = nhaCungCapId;
        }

        if (loaiXeId) {
            whereClause.loaiXeId = loaiXeId;
        }

        // Price range filter
        if (giaMin !== undefined || giaMax !== undefined) {
            whereClause.giaTheoTuyen = {};
            if (giaMin !== undefined) {
                whereClause.giaTheoTuyen.gte = giaMin;
            }
            if (giaMax !== undefined) {
                whereClause.giaTheoTuyen.lte = giaMax;
            }
        }

        // Search for available rental options
        const rentalOptions = await this.prisma.giaThueXe.findMany({
            where: whereClause,
            include: {
                nhaCungCap: {
                    select: {
                        id: true,
                        maNhaCungCap: true,
                        tenNhaCungCap: true,
                        logo: true,
                        danhGiaTrungBinh: true,
                        soDanhGia: true,
                        chinhSachHuy: true,
                        chinhSachThanhToan: true,
                    },
                },
                loaiXe: {
                    select: {
                        id: true,
                        maLoaiXe: true,
                        tenLoaiXe: true,
                        moTa: true,
                        soHanhKhach: true,
                        soHanhLy: true,
                        hinhAnh: true,
                        tienNghi: true,
                    },
                },
                tuyenDuong: {
                    select: {
                        id: true,
                        maTuyen: true,
                        diemDi: true,
                        diemDen: true,
                        khoangCach: true,
                        thoiGianDuKien: true,
                        moTa: true,
                    },
                },
            },
        });

        // Filter by passenger and luggage capacity
        let filteredOptions = rentalOptions;
        if (soHanhKhach) {
            filteredOptions = filteredOptions.filter(
                (option) => option.loaiXe.soHanhKhach >= soHanhKhach,
            );
        }
        if (soHanhLy) {
            filteredOptions = filteredOptions.filter(
                (option) => option.loaiXe.soHanhLy >= soHanhLy,
            );
        }

        // Calculate final price with surcharges
        const pickupDate = new Date(ngayGioDon);
        const results = filteredOptions.map((option) => {
            const surcharges = this.calculateSurcharges(
                option.phuThu as any,
                pickupDate,
            );

            const basePrice: number = Number(option.giaTheoTuyen) || 0;
            const totalSurcharge: number = (Object.values(surcharges) as any[]).reduce(
                (sum: number, val) => sum + Number(val),
                0,
            );
            const discount: number = Number(option.giamGia) || 0;
            const finalPrice: number = basePrice + totalSurcharge - discount;

            return {
                id: option.id,
                nhaCungCap: option.nhaCungCap,
                loaiXe: option.loaiXe,
                tuyenDuong: option.tuyenDuong,
                giaTheoGio: option.giaTheoGio,
                giaTheoNgay: option.giaTheoNgay,
                giaTheoTuyen: option.giaTheoTuyen,
                donViTienTe: option.donViTienTe,
                giamGia: option.giamGia,
                phuThu: option.phuThu,
                surcharges,
                totalSurcharge,
                finalPrice,
                apDungTu: option.apDungTu,
                apDungDen: option.apDungDen,
            };
        });

        // Sort by price
        results.sort((a, b) => a.finalPrice - b.finalPrice);

        return {
            total: results.length,
            data: results,
        };
    }

    private calculateSurcharges(phuThu: any, pickupDate: Date): any {
        const surcharges: any = {};

        if (!phuThu) return surcharges;

        // Night surcharge (10 PM - 6 AM)
        const hour = pickupDate.getHours();
        if ((hour >= 22 || hour < 6) && phuThu.night) {
            surcharges.night = Number(phuThu.night);
        }

        // Airport surcharge
        if (phuThu.airport) {
            surcharges.airport = Number(phuThu.airport);
        }

        // Holiday surcharge (simplified - check if weekend)
        const dayOfWeek = pickupDate.getDay();
        if ((dayOfWeek === 0 || dayOfWeek === 6) && phuThu.holiday) {
            surcharges.holiday = Number(phuThu.holiday);
        }

        return surcharges;
    }

    async getPopularRoutes(limit: number = 10) {
        const routes = await this.prisma.tuyenDuongThueXe.findMany({
            where: {
                trangThai: 'HOAT_DONG',
            },
            take: limit,
            orderBy: {
                id: 'asc',
            },
        });

        return routes;
    }

    async getCarRentalCompanies() {
        const companies = await this.prisma.nhaCungCapXe.findMany({
            where: {
                trangThai: 'HOAT_DONG',
            },
            select: {
                id: true,
                maNhaCungCap: true,
                tenNhaCungCap: true,
                logo: true,
                danhGiaTrungBinh: true,
                soDanhGia: true,
            },
            orderBy: {
                danhGiaTrungBinh: 'desc',
            },
        });

        return companies;
    }

    async getCarTypes() {
        const carTypes = await this.prisma.loaiXeThue.findMany({
            select: {
                id: true,
                maLoaiXe: true,
                tenLoaiXe: true,
                moTa: true,
                soHanhKhach: true,
                soHanhLy: true,
                hinhAnh: true,
                tienNghi: true,
            },
            orderBy: {
                soHanhKhach: 'asc',
            },
        });

        return carTypes;
    }

    async getRentalOptionById(id: number) {
        const option = await this.prisma.giaThueXe.findUnique({
            where: { id },
            include: {
                nhaCungCap: {
                    select: {
                        id: true,
                        maNhaCungCap: true,
                        tenNhaCungCap: true,
                        logo: true,
                        soDienThoai: true,
                        email: true,
                        website: true,
                        diaChi: true,
                        moTa: true,
                        danhGiaTrungBinh: true,
                        soDanhGia: true,
                        chinhSachHuy: true,
                        chinhSachThanhToan: true,
                    },
                },
                loaiXe: true,
                tuyenDuong: true,
            },
        });

        if (!option) {
            throw new Error('Rental option not found');
        }

        return option;
    }
}
