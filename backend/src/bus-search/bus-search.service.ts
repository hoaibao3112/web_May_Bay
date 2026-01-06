import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { SearchBusDto } from './dto/search-bus.dto';

@Injectable()
export class BusSearchService {
    constructor(private prisma: PrismaService) { }

    async searchTrips(searchDto: SearchBusDto) {
        const { ngayDi, benXeDiId, benXeDenId, thanhPhoDi, thanhPhoDen, soKhach, loaiXe, nhaXeId, giaMin, giaMax } = searchDto;

        const where: any = {
            trangThai: {
                in: ['SAP_KHOI_HANH', 'DANG_CHAY'],
            },
        };

        // Parse date - only if provided
        if (ngayDi) {
            const startDate = new Date(ngayDi);
            
            // Validate date
            if (isNaN(startDate.getTime())) {
                throw new Error('Ngày đi không hợp lệ');
            }
            
            startDate.setHours(0, 0, 0, 0);
            const endDate = new Date(ngayDi);
            endDate.setHours(23, 59, 59, 999);
            
            where.gioDi = {
                gte: startDate,
                lte: endDate,
            };
        }

        // Filter by seats available
        if (soKhach) {
            where.soGheTrong = {
                gte: soKhach,
            };
        }

        // Filter by price
        if (giaMin || giaMax) {
            where.giaVe = {};
            if (giaMin) where.giaVe.gte = giaMin;
            if (giaMax) where.giaVe.lte = giaMax;
        }

        // Filter by route
        where.tuyenXe = {};

        if (benXeDiId) {
            where.tuyenXe.benXeDiId = benXeDiId;
        }

        if (benXeDenId) {
            where.tuyenXe.benXeDenId = benXeDenId;
        }

        if (thanhPhoDi) {
            where.tuyenXe.benXeDi = {
                thanhPho: { contains: thanhPhoDi },
            };
        }

        if (thanhPhoDen) {
            where.tuyenXe.benXeDen = {
                thanhPho: { contains: thanhPhoDen },
            };
        }

        // Filter by bus company
        if (nhaXeId) {
            where.tuyenXe = {
                ...where.tuyenXe,
                nhaXeId,
            };
        }

        // Filter by bus type
        if (loaiXe) {
            where.xe = {
                loaiXe: {
                    tenLoaiXe: { contains: loaiXe },
                },
            };
        }

        const trips = await this.prisma.chuyenXe.findMany({
            where,
            include: {
                tuyenXe: {
                    include: {
                        benXeDi: true,
                        benXeDen: true,
                        nhaXe: true,
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
            orderBy: [
                { gioDi: 'asc' },
                { giaVe: 'asc' },
            ],
        });

        return trips.map(trip => ({
            id: trip.id,
            maChuyenXe: trip.maChuyenXe,
            nhaXe: trip.tuyenXe.nhaXe,
            benXeDi: trip.tuyenXe.benXeDi,
            benXeDen: trip.tuyenXe.benXeDen,
            gioDi: trip.gioDi,
            gioDen: trip.gioDen,
            giaVe: trip.giaVe,
            soGheTrong: trip.soGheTrong,
            loaiXe: trip.xe.loaiXe,
            tienNghi: trip.xe.loaiXe.tienNghi,
            diemDung: trip.diemDung,
            khoangCach: trip.tuyenXe.khoangCach,
            thoiGianChay: trip.tuyenXe.thoiGianChayDuKien,
        }));
    }

    async getPopularRoutes(limit: number = 10) {
        const routes = await this.prisma.tuyenXe.findMany({
            where: {
                trangThai: 'HOAT_DONG',
            },
            include: {
                benXeDi: true,
                benXeDen: true,
                nhaXe: true,
                _count: {
                    select: {
                        chuyenXe: true,
                    },
                },
            },
            orderBy: {
                chuyenXe: {
                    _count: 'desc',
                },
            },
            take: limit,
        });

        return routes;
    }

    async suggestStations(query: string) {
        return this.prisma.benXe.findMany({
            where: {
                OR: [
                    { tenBenXe: { contains: query } },
                    { thanhPho: { contains: query } },
                ],
                trangThai: 'HOAT_DONG',
            },
            select: {
                id: true,
                maBenXe: true,
                tenBenXe: true,
                thanhPho: true,
            },
            take: 10,
        });
    }

    async getTripById(id: number) {
        const trip = await this.prisma.chuyenXe.findUnique({
            where: { id },
            include: {
                tuyenXe: {
                    include: {
                        benXeDi: true,
                        benXeDen: true,
                        nhaXe: true,
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
        });

        if (!trip) {
            throw new Error('Không tìm thấy chuyến xe');
        }

        return {
            id: trip.id,
            maChuyenXe: trip.maChuyenXe,
            nhaXe: trip.tuyenXe.nhaXe,
            benXeDi: trip.tuyenXe.benXeDi,
            benXeDen: trip.tuyenXe.benXeDen,
            gioDi: trip.gioDi,
            gioDen: trip.gioDen,
            giaVe: trip.giaVe,
            soGheTrong: trip.soGheTrong,
            loaiXe: trip.xe.loaiXe,
            tienNghi: trip.xe.loaiXe.tienNghi,
            diemDung: trip.diemDung,
            khoangCach: trip.tuyenXe.khoangCach,
            thoiGianChay: trip.tuyenXe.thoiGianChayDuKien,
        };
    }
}
