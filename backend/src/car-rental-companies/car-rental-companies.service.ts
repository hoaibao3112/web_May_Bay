import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class CarRentalCompaniesService {
    constructor(private prisma: PrismaService) { }

    async getAllCompanies(filters?: { trangThai?: string }) {
        const whereClause: any = {};

        if (filters?.trangThai) {
            whereClause.trangThai = filters.trangThai;
        } else {
            whereClause.trangThai = 'HOAT_DONG';
        }

        const companies = await this.prisma.nhaCungCapXe.findMany({
            where: whereClause,
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
                trangThai: true,
            },
            orderBy: {
                danhGiaTrungBinh: 'desc',
            },
        });

        return companies;
    }

    async getCompanyById(id: number) {
        const company = await this.prisma.nhaCungCapXe.findUnique({
            where: { id },
            include: {
                xeThue: {
                    include: {
                        loaiXe: true,
                    },
                    where: {
                        trangThai: 'SAN_SANG',
                    },
                },
                giaThueXe: {
                    include: {
                        loaiXe: true,
                        tuyenDuong: true,
                    },
                    where: {
                        trangThai: 'HOAT_DONG',
                    },
                },
                danhGiaNhaCungCap: {
                    include: {
                        nguoiDung: {
                            select: {
                                id: true,
                                hoTen: true,
                            },
                        },
                    },
                    orderBy: {
                        createdAt: 'desc',
                    },
                    take: 10,
                },
            },
        });

        if (!company) {
            throw new NotFoundException('Không tìm thấy nhà cung cấp');
        }

        return company;
    }

    async getCompanyVehicles(companyId: number) {
        const vehicles = await this.prisma.xeThue.findMany({
            where: {
                nhaCungCapId: companyId,
            },
            include: {
                loaiXe: true,
                nhaCungCap: {
                    select: {
                        id: true,
                        tenNhaCungCap: true,
                        logo: true,
                    },
                },
            },
            orderBy: {
                createdAt: 'desc',
            },
        });

        return vehicles;
    }

    async getCompanyReviews(companyId: number, limit: number = 20) {
        const reviews = await this.prisma.danhGiaNhaCungCap.findMany({
            where: {
                nhaCungCapId: companyId,
            },
            include: {
                nguoiDung: {
                    select: {
                        id: true,
                        hoTen: true,
                    },
                },
                donThueXe: {
                    select: {
                        id: true,
                        maDonThue: true,
                        thoiGianDon: true,
                    },
                },
            },
            orderBy: {
                createdAt: 'desc',
            },
            take: limit,
        });

        return reviews;
    }
}
