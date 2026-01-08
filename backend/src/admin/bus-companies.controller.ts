import { Controller, Get, Post, Put, Delete, Body, Param, UseGuards, Query } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { JwtAuthGuard } from '../auth/jwt.guard';
import { RolesGuard } from '../auth/roles.guard';
import { Roles } from '../auth/roles.decorator';

@Controller('admin/bus-companies')
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles('ADMIN', 'OPERATOR')
export class BusCompaniesController {
    constructor(private prisma: PrismaService) { }

    @Get()
    async getAllCompanies(@Query('search') search?: string) {
        const where = search
            ? {
                OR: [
                    { tenNhaXe: { contains: search } },
                    { soDienThoai: { contains: search } },
                    { email: { contains: search } },
                ],
            }
            : {};

        const companies = await this.prisma.nhaXe.findMany({
            where,
            include: {
                _count: {
                    select: {
                        xe: true,
                        tuyenXe: true,
                    },
                },
            },
            orderBy: { createdAt: 'desc' },
        });

        return companies;
    }

    @Get(':id')
    async getCompany(@Param('id') id: string) {
        const company = await this.prisma.nhaXe.findUnique({
            where: { id: parseInt(id) },
            include: {
                xe: {
                    select: {
                        id: true,
                        bienSoXe: true,
                        loaiXe: true,
                        soGhe: true,
                        trangThai: true,
                    },
                },
                tuyenXe: {
                    select: {
                        id: true,
                        maTuyen: true,
                        benXeDi: { select: { tenBenXe: true } },
                        benXeDen: { select: { tenBenXe: true } },
                        trangThai: true,
                    },
                },
                danhGiaNhaXe: {
                    take: 10,
                    orderBy: { createdAt: 'desc' },
                },
            },
        });

        if (!company) {
            throw new Error('Không tìm thấy nhà xe');
        }

        return company;
    }

    @Post()
    async createCompany(@Body() data: any) {
        // Generate unique company code
        const maNhaXe = `NX${Date.now().toString().slice(-6)}${Math.floor(Math.random() * 100).toString().padStart(2, '0')}`;

        const company = await this.prisma.nhaXe.create({
            data: {
                maNhaXe,
                tenNhaXe: data.tenNhaXe,
                logo: data.logo,
                soDienThoai: data.soDienThoai,
                email: data.email,
                diaChi: data.diaChi,
                moTa: data.moTa,
                danhGiaTrungBinh: data.danhGiaTrungBinh || 0,
            },
        });

        return {
            success: true,
            message: 'Tạo nhà xe thành công',
            data: company,
        };
    }

    @Put(':id')
    async updateCompany(@Param('id') id: string, @Body() data: any) {
        const company = await this.prisma.nhaXe.update({
            where: { id: parseInt(id) },
            data: {
                tenNhaXe: data.tenNhaXe,
                logo: data.logo,
                soDienThoai: data.soDienThoai,
                email: data.email,
                diaChi: data.diaChi,
                moTa: data.moTa,
                danhGiaTrungBinh: data.danhGiaTrungBinh,
            },
        });

        return {
            success: true,
            message: 'Cập nhật nhà xe thành công',
            data: company,
        };
    }

    @Delete(':id')
    async deleteCompany(@Param('id') id: string) {
        // Check if company has active routes or buses
        const company = await this.prisma.nhaXe.findUnique({
            where: { id: parseInt(id) },
            include: {
                _count: {
                    select: { xe: true, tuyenXe: true },
                },
            },
        });

        if (company._count.xe > 0 || company._count.tuyenXe > 0) {
            throw new Error('Không thể xóa nhà xe đang có xe hoặc tuyến đường hoạt động');
        }

        await this.prisma.nhaXe.delete({
            where: { id: parseInt(id) },
        });

        return {
            success: true,
            message: 'Xóa nhà xe thành công',
        };
    }

    @Get(':id/stats')
    async getCompanyStats(@Param('id') id: string) {
        const stats = await this.prisma.$queryRaw`
      SELECT 
        COUNT(DISTINCT tv.id) as totalBookings,
        SUM(tv.tongTien) as totalRevenue,
        AVG(dg.diemSo) as avgRating
      FROM nha_xe nx
      LEFT JOIN chuyen_xe cx ON cx.tuyenXeId IN (SELECT id FROM tuyen_xe WHERE nhaXeId = nx.id)
      LEFT JOIN don_dat_ve_xe tv ON tv.chuyenXeId = cx.id
      LEFT JOIN danh_gia_nha_xe dg ON dg.nhaXeId = nx.id
      WHERE nx.id = ${parseInt(id)}
      GROUP BY nx.id
    `;

        return stats[0] || { totalBookings: 0, totalRevenue: 0, avgRating: 0 };
    }
}
