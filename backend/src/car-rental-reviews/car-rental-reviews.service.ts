import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateCarRentalReviewDto } from './dto/create-car-rental-review.dto';

@Injectable()
export class CarRentalReviewsService {
    constructor(private prisma: PrismaService) { }

    async createReview(createDto: CreateCarRentalReviewDto, userId: number) {
        // Verify company exists
        const company = await this.prisma.nhaCungCapXe.findUnique({
            where: { id: createDto.nhaCungCapId },
        });

        if (!company) {
            throw new NotFoundException('Không tìm thấy nhà cung cấp');
        }

        // If booking ID provided, verify it exists and belongs to user
        if (createDto.donThueXeId) {
            const booking = await this.prisma.donThueXe.findUnique({
                where: { id: createDto.donThueXeId },
            });

            if (!booking) {
                throw new NotFoundException('Không tìm thấy đơn đặt xe');
            }

            if (booking.nguoiDungId !== userId) {
                throw new BadRequestException('Bạn không có quyền đánh giá đơn này');
            }

            if (booking.trangThai !== 'HOAN_THANH') {
                throw new BadRequestException('Chỉ có thể đánh giá đơn đã hoàn thành');
            }

            // Check if already reviewed
            const existingReview = await this.prisma.danhGiaNhaCungCap.findFirst({
                where: {
                    nguoiDungId: userId,
                    donThueXeId: createDto.donThueXeId,
                },
            });

            if (existingReview) {
                throw new BadRequestException('Bạn đã đánh giá đơn này rồi');
            }
        }

        // Calculate average rating
        const diemTrungBinh =
            (createDto.diemXe +
                createDto.diemTaiXe +
                createDto.diemDungGio +
                createDto.diemSachSe +
                createDto.diemGiaCa) /
            5;

        // Create review
        const review = await this.prisma.danhGiaNhaCungCap.create({
            data: {
                nguoiDungId: userId,
                nhaCungCapId: createDto.nhaCungCapId,
                donThueXeId: createDto.donThueXeId,
                diemXe: createDto.diemXe,
                diemTaiXe: createDto.diemTaiXe,
                diemDungGio: createDto.diemDungGio,
                diemSachSe: createDto.diemSachSe,
                diemGiaCa: createDto.diemGiaCa,
                diemTrungBinh,
                binhLuan: createDto.binhLuan,
                hinhAnh: createDto.hinhAnh,
            },
            include: {
                nguoiDung: {
                    select: {
                        id: true,
                        hoTen: true,
                    },
                },
            },
        });

        // Update company average rating
        await this.updateCompanyRating(createDto.nhaCungCapId);

        return {
            success: true,
            message: 'Đánh giá thành công',
            data: review,
        };
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

    async getBookingReview(bookingId: number) {
        const review = await this.prisma.danhGiaNhaCungCap.findFirst({
            where: {
                donThueXeId: bookingId,
            },
            include: {
                nguoiDung: {
                    select: {
                        id: true,
                        hoTen: true,
                    },
                },
                nhaCungCap: {
                    select: {
                        id: true,
                        tenNhaCungCap: true,
                        logo: true,
                    },
                },
            },
        });

        return review;
    }

    private async updateCompanyRating(companyId: number) {
        const reviews = await this.prisma.danhGiaNhaCungCap.findMany({
            where: { nhaCungCapId: companyId },
            select: { diemTrungBinh: true },
        });

        if (reviews.length === 0) return;

        const totalRating = reviews.reduce(
            (sum, review) => sum + Number(review.diemTrungBinh),
            0,
        );
        const averageRating = totalRating / reviews.length;

        await this.prisma.nhaCungCapXe.update({
            where: { id: companyId },
            data: {
                danhGiaTrungBinh: Math.round(averageRating * 10) / 10,
                soDanhGia: reviews.length,
            },
        });
    }
}
