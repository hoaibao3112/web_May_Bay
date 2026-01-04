import {
  Injectable,
  NotFoundException,
  BadRequestException,
  ForbiddenException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class ReviewsService {
  constructor(private prisma: PrismaService) {}

  // Tạo đánh giá hãng hàng không
  async createAirlineReview(
    userId: number,
    hangId: number,
    soSao: number,
    binhLuan?: string,
    hinhAnh?: string[],
  ) {
    // Validate số sao
    if (soSao < 1 || soSao > 5) {
      throw new BadRequestException('Số sao phải từ 1 đến 5');
    }

    // Kiểm tra hãng hàng không tồn tại
    const airline = await this.prisma.hangHangKhong.findUnique({
      where: { id: hangId },
    });

    if (!airline) {
      throw new NotFoundException('Không tìm thấy hãng hàng không');
    }

    // Kiểm tra user đã từng bay với hãng này chưa
    const hasFlown = await this.prisma.donDatVe.findFirst({
      where: {
        nguoiDungId: userId,
        trangThai: 'DA_THANH_TOAN',
        changBay: {
          chuyenBay: {
            hangId: hangId,
          },
        },
      },
    });

    if (!hasFlown) {
      throw new BadRequestException(
        'Bạn chỉ có thể đánh giá hãng hàng không sau khi đã sử dụng dịch vụ',
      );
    }

    // Tạo đánh giá
    const review = await this.prisma.danhGia.create({
      data: {
        nguoiDungId: userId,
        hangId: hangId,
        soSao: soSao,
        binhLuan: binhLuan,
        hinhAnh: hinhAnh || [],
      },
    });

    return {
      message: 'Đánh giá thành công',
      reviewId: review.id,
    };
  }

  // Lấy đánh giá của hãng
  async getAirlineReviews(hangId: number, page: number, limit: number) {
    const skip = (page - 1) * limit;

    const [reviews, total] = await Promise.all([
      this.prisma.danhGia.findMany({
        where: { hangId: hangId },
        include: {
          nguoiDung: {
            select: {
              id: true,
              hoTen: true,
              email: true,
            },
          },
        },
        orderBy: {
          createdAt: 'desc',
        },
        skip,
        take: limit,
      }),
      this.prisma.danhGia.count({
        where: { hangId: hangId },
      }),
    ]);

    return {
      hangId,
      page,
      limit,
      total,
      totalPages: Math.ceil(total / limit),
      reviews: reviews.map((r) => ({
        id: r.id,
        nguoiDung: r.nguoiDung.hoTen,
        soSao: r.soSao,
        binhLuan: r.binhLuan,
        hinhAnh: r.hinhAnh,
        ngayTao: r.createdAt,
      })),
    };
  }

  // Lấy rating trung bình
  async getAirlineRating(hangId: number) {
    const reviews = await this.prisma.danhGia.findMany({
      where: { hangId: hangId },
      select: { soSao: true },
    });

    if (reviews.length === 0) {
      return {
        hangId,
        tongSoDanhGia: 0,
        diemTrungBinh: 0,
        phanBo: { 5: 0, 4: 0, 3: 0, 2: 0, 1: 0 },
      };
    }

    const total = reviews.reduce((sum, r) => sum + r.soSao, 0);
    const average = total / reviews.length;

    // Phân bố sao
    const distribution = { 5: 0, 4: 0, 3: 0, 2: 0, 1: 0 };
    reviews.forEach((r) => {
      distribution[r.soSao as keyof typeof distribution]++;
    });

    return {
      hangId,
      tongSoDanhGia: reviews.length,
      diemTrungBinh: Math.round(average * 10) / 10,
      phanBo: distribution,
    };
  }

  // Lấy đánh giá của user
  async getUserReviews(userId: number) {
    const reviews = await this.prisma.danhGia.findMany({
      where: { nguoiDungId: userId },
      include: {
        hang: {
          select: {
            tenHang: true,
            maIata: true,
          },
        },
      },
      orderBy: {
        createdAt: 'desc',
      },
    });

    return reviews.map((r) => ({
      id: r.id,
      hangHangKhong: r.hang?.tenHang,
      maHang: r.hang?.maIata,
      soSao: r.soSao,
      binhLuan: r.binhLuan,
      hinhAnh: r.hinhAnh,
      ngayTao: r.createdAt,
    }));
  }

  // Xóa đánh giá
  async deleteReview(reviewId: number, userId: number) {
    const review = await this.prisma.danhGia.findUnique({
      where: { id: reviewId },
    });

    if (!review) {
      throw new NotFoundException('Không tìm thấy đánh giá');
    }

    if (review.nguoiDungId !== userId) {
      throw new ForbiddenException('Bạn không có quyền xóa đánh giá này');
    }

    await this.prisma.danhGia.delete({
      where: { id: reviewId },
    });

    return { message: 'Đã xóa đánh giá' };
  }
}
