import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateBusCompanyDto } from './dto/create-bus-company.dto';
import { UpdateBusCompanyDto } from './dto/update-bus-company.dto';

@Injectable()
export class BusCompaniesService {
    constructor(private prisma: PrismaService) { }

    async create(createDto: CreateBusCompanyDto) {
        return this.prisma.nhaXe.create({
            data: createDto,
        });
    }

    async findAll(filters?: { trangThai?: string; search?: string }) {
        const where: any = {};

        if (filters?.trangThai) {
            where.trangThai = filters.trangThai;
        }

        if (filters?.search) {
            where.OR = [
                { tenNhaXe: { contains: filters.search } },
                { maNhaXe: { contains: filters.search } },
            ];
        }

        return this.prisma.nhaXe.findMany({
            where,
            include: {
                _count: {
                    select: {
                        tuyenXe: true,
                        danhGiaNhaXe: true,
                    },
                },
            },
            orderBy: { danhGiaTrungBinh: 'desc' },
        });
    }

    async findOne(id: number) {
        const company = await this.prisma.nhaXe.findUnique({
            where: { id },
            include: {
                tuyenXe: {
                    include: {
                        benXeDi: true,
                        benXeDen: true,
                    },
                },
                danhGiaNhaXe: {
                    take: 10,
                    orderBy: { createdAt: 'desc' },
                    include: {
                        nguoiDung: {
                            select: {
                                hoTen: true,
                            },
                        },
                    },
                },
                _count: {
                    select: {
                        xe: true,
                        tuyenXe: true,
                    },
                },
            },
        });

        if (!company) {
            throw new NotFoundException(`Không tìm thấy nhà xe với ID ${id}`);
        }

        return company;
    }

    async update(id: number, updateDto: UpdateBusCompanyDto) {
        await this.findOne(id); // Check if exists

        return this.prisma.nhaXe.update({
            where: { id },
            data: updateDto,
        });
    }

    async remove(id: number) {
        await this.findOne(id); // Check if exists

        return this.prisma.nhaXe.delete({
            where: { id },
        });
    }

    async getReviews(id: number, page: number = 1, limit: number = 10) {
        await this.findOne(id); // Check if exists

        const skip = (page - 1) * limit;

        const [reviews, total] = await Promise.all([
            this.prisma.danhGiaNhaXe.findMany({
                where: { nhaXeId: id },
                include: {
                    nguoiDung: {
                        select: {
                            hoTen: true,
                        },
                    },
                },
                orderBy: { createdAt: 'desc' },
                skip,
                take: limit,
            }),
            this.prisma.danhGiaNhaXe.count({
                where: { nhaXeId: id },
            }),
        ]);

        return {
            data: reviews,
            meta: {
                total,
                page,
                limit,
                totalPages: Math.ceil(total / limit),
            },
        };
    }
}
