import { Injectable, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateBusReviewDto } from './dto/create-bus-review.dto';

@Injectable()
export class BusReviewsService {
    constructor(private prisma: PrismaService) { }

    async create(dto: CreateBusReviewDto, userId: number) {
        if (dto.diemDanhGia < 1 || dto.diemDanhGia > 5) {
            throw new BadRequestException('Điểm đánh giá phải từ 1 đến 5');
        }

        const review = await this.prisma.danhGiaNhaXe.create({
            data: {
                nhaXeId: dto.nhaXeId,
                nguoiDungId: userId,
                chuyenXeId: dto.chuyenXeId,
                diemDanhGia: dto.diemDanhGia,
                nhanXet: dto.nhanXet,
            },
            include: {
                nguoiDung: {
                    select: {
                        hoTen: true,
                    },
                },
            },
        });

        // Cập nhật điểm trung bình của nhà xe
        await this.updateCompanyRating(dto.nhaXeId);

        return review;
    }

    async getCompanyReviews(nhaXeId: number, page: number = 1, limit: number = 10) {
        const skip = (page - 1) * limit;

        const [reviews, total] = await Promise.all([
            this.prisma.danhGiaNhaXe.findMany({
                where: { nhaXeId },
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
                where: { nhaXeId },
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

    async remove(id: number, userId: number) {
        const review = await this.prisma.danhGiaNhaXe.findUnique({
            where: { id },
        });

        if (!review) {
            throw new BadRequestException('Không tìm thấy đánh giá');
        }

        if (review.nguoiDungId !== userId) {
            throw new BadRequestException('Bạn không có quyền xóa đánh giá này');
        }

        await this.prisma.danhGiaNhaXe.delete({
            where: { id },
        });

        // Cập nhật lại điểm trung bình
        await this.updateCompanyRating(review.nhaXeId);

        return { message: 'Đã xóa đánh giá' };
    }

    private async updateCompanyRating(nhaXeId: number) {
        const result = await this.prisma.danhGiaNhaXe.aggregate({
            where: { nhaXeId },
            _avg: {
                diemDanhGia: true,
            },
        });

        const avgRating = result._avg.diemDanhGia || 0;

        await this.prisma.nhaXe.update({
            where: { id: nhaXeId },
            data: {
                danhGiaTrungBinh: avgRating,
            },
        });
    }
}
