import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateAirportTransferReviewDto } from './dto/create-airport-transfer-review.dto';

@Injectable()
export class AirportTransferReviewsService {
    constructor(private prisma: PrismaService) { }

    async createReview(createReviewDto: CreateAirportTransferReviewDto) {
        const { datDichVuId, userId, nhaCungCapId, danhGia, binhLuan } = createReviewDto;

        // Validate rating
        if (danhGia < 1 || danhGia > 5) {
            throw new Error('Đánh giá phải từ 1 đến 5 sao');
        }

        // Check if booking exists and belongs to user
        const booking: any = await this.prisma.$queryRaw`
            SELECT * FROM dat_dich_vu_dua_don 
            WHERE id = ${datDichVuId} AND userId = ${userId}
        `;

        if (!booking || booking.length === 0) {
            throw new Error('Không tìm thấy đặt chỗ');
        }

        // Check if already reviewed
        const existingReview: any = await this.prisma.$queryRaw`
            SELECT * FROM danh_gia_dua_don 
            WHERE datDichVuId = ${datDichVuId} AND userId = ${userId}
        `;

        if (existingReview && existingReview.length > 0) {
            throw new Error('Bạn đã đánh giá chuyến đi này rồi');
        }

        // Create review
        await this.prisma.$queryRaw`
            INSERT INTO danh_gia_dua_don (
                datDichVuId, userId, nhaCungCapId, danhGia, binhLuan, createdAt, updatedAt
            ) VALUES (
                ${datDichVuId}, ${userId}, ${nhaCungCapId}, ${danhGia}, ${binhLuan}, NOW(), NOW()
            )
        `;

        // Update company average rating
        await this.updateCompanyRating(nhaCungCapId);

        return { message: 'Đánh giá thành công' };
    }

    async getReviewsByCompanyId(nhaCungCapId: number) {
        const reviews: any = await this.prisma.$queryRaw`
            SELECT 
                dg.*,
                u.hoTen as tenNguoiDung,
                u.anhDaiDien
            FROM danh_gia_dua_don dg
            LEFT JOIN users u ON dg.userId = u.id
            WHERE dg.nhaCungCapId = ${nhaCungCapId}
            ORDER BY dg.createdAt DESC
        `;

        return reviews.map((review: any) => ({
            id: review.id,
            nguoiDung: {
                ten: review.tenNguoiDung,
                anhDaiDien: review.anhDaiDien,
            },
            danhGia: review.danhGia,
            binhLuan: review.binhLuan,
            createdAt: review.createdAt,
        }));
    }

    private async updateCompanyRating(nhaCungCapId: number) {
        await this.prisma.$queryRaw`
            UPDATE nha_cung_cap_dua_don
            SET 
                danhGiaTrungBinh = (
                    SELECT AVG(danhGia) 
                    FROM danh_gia_dua_don 
                    WHERE nhaCungCapId = ${nhaCungCapId}
                ),
                tongSoDanhGia = (
                    SELECT COUNT(*) 
                    FROM danh_gia_dua_don 
                    WHERE nhaCungCapId = ${nhaCungCapId}
                ),
                updatedAt = NOW()
            WHERE id = ${nhaCungCapId}
        `;
    }
}
