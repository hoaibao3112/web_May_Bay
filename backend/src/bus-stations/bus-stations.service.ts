import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class BusStationsService {
    constructor(private prisma: PrismaService) { }

    async findAll(filters?: { thanhPho?: string; khuVuc?: string; search?: string }) {
        const where: any = {};

        if (filters?.thanhPho) {
            where.thanhPho = { contains: filters.thanhPho };
        }

        if (filters?.khuVuc) {
            where.khuVuc = filters.khuVuc;
        }

        if (filters?.search) {
            where.OR = [
                { tenBenXe: { contains: filters.search } },
                { thanhPho: { contains: filters.search } },
            ];
        }

        return this.prisma.benXe.findMany({
            where,
            orderBy: { tenBenXe: 'asc' },
        });
    }

    async findOne(id: number) {
        const station = await this.prisma.benXe.findUnique({
            where: { id },
        });

        if (!station) {
            throw new NotFoundException(`Không tìm thấy bến xe với ID ${id}`);
        }

        return station;
    }

    async searchByCity(city: string) {
        return this.prisma.benXe.findMany({
            where: {
                thanhPho: { contains: city },
                trangThai: 'HOAT_DONG',
            },
            select: {
                id: true,
                maBenXe: true,
                tenBenXe: true,
                thanhPho: true,
                diaChi: true,
            },
        });
    }
}
