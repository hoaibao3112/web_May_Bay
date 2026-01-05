import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class HotelsService {
  constructor(private prisma: PrismaService) {}

  // Tìm kiếm khách sạn
  async searchHotels(query: {
    thanhPho?: string;
    ngayNhanPhong?: string;
    ngayTraPhong?: string;
    soNguoi?: number;
    soPhong?: number;
    soSao?: number;
    giaMin?: number;
    giaMax?: number;
  }) {
    const where: any = {};

    if (query.thanhPho) {
      where.thanhPho = { contains: query.thanhPho };
    }

    if (query.soSao) {
      where.soSao = { gte: query.soSao };
    }

    if (query.giaMin || query.giaMax) {
      where.giaThapNhat = {};
      if (query.giaMin) where.giaThapNhat.gte = query.giaMin;
      if (query.giaMax) where.giaThapNhat.lte = query.giaMax;
    }

    const khachSans = await this.prisma.khachSan.findMany({
      where,
      include: {
        quocGia: true,
        phong: {
          where: {
            soPhongTrong: { gt: 0 },
            ...(query.soNguoi && { soKhach: { gte: query.soNguoi } }),
          },
          take: 5,
        },
        danhGiaKS: {
          select: {
            diemTrungBinh: true,
          },
          take: 10,
        },
      },
      orderBy: {
        danhGiaTB: 'desc',
      },
    });

    return khachSans.map((ks) => {
      const avgRating =
        ks.danhGiaKS.length > 0
          ? ks.danhGiaKS.reduce((sum, dg) => sum + Number(dg.diemTrungBinh), 0) / ks.danhGiaKS.length
          : null;

      return {
        ...ks,
        danhGiaTrungBinh: avgRating,
        soDanhGia: ks.danhGiaKS.length,
        giaThapNhat: ks.phong[0]?.giaTheoNgay || ks.giaThapNhat,
      };
    });
  }

  // Lấy chi tiết khách sạn
  async getHotelById(id: number) {
    return this.prisma.khachSan.findUnique({
      where: { id },
      include: {
        quocGia: true,
        gallery: {
          orderBy: {
            thuTu: 'asc',
          },
        },
        phong: {
          where: {
            soPhongTrong: { gt: 0 },
          },
        },
        danhGiaKS: {
          include: {
            user: {
              select: {
                hoTen: true,
                email: true,
              },
            },
          },
          orderBy: {
            createdAt: 'desc',
          },
          take: 20,
        },
      },
    });
  }

  // Lấy tất cả khách sạn
  async getAllHotels() {
    return this.prisma.khachSan.findMany({
      include: {
        quocGia: true,
        _count: {
          select: {
            phong: true,
            danhGiaKS: true,
          },
        },
      },
      orderBy: {
        createdAt: 'desc',
      },
    });
  }

  // Tạo khách sạn mới (Admin)
  async createHotel(data: any) {
    return this.prisma.khachSan.create({
      data: {
        ...data,
        giaThapNhat: data.giaThapNhat ? Number(data.giaThapNhat) : null,
      },
      include: {
        quocGia: true,
      },
    });
  }

  // Cập nhật khách sạn (Admin)
  async updateHotel(id: number, data: any) {
    return this.prisma.khachSan.update({
      where: { id },
      data: {
        ...data,
        giaThapNhat: data.giaThapNhat ? Number(data.giaThapNhat) : undefined,
      },
    });
  }

  // Xóa khách sạn (Admin)
  async deleteHotel(id: number) {
    return this.prisma.khachSan.delete({
      where: { id },
    });
  }

  // Lấy danh sách phòng của khách sạn
  async getRoomsByHotelId(khachSanId: number) {
    return this.prisma.phongKhachSan.findMany({
      where: { khachSanId },
      orderBy: {
        giaTheoNgay: 'asc',
      },
    });
  }

  // Tạo phòng mới
  async createRoom(data: any) {
    return this.prisma.phongKhachSan.create({
      data: {
        ...data,
        giaTheoNgay: Number(data.giaTheoNgay),
      },
    });
  }

  // Đặt phòng
  async createBooking(data: {
    userId: number;
    khachSanId: number;
    phongId: number;
    ngayNhanPhong: string;
    ngayTraPhong: string;
    soPhong: number;
    soNguoiLon: number;
    soTreEm: number;
    tongTien: number;
    ghiChu?: string;
  }) {
    const maDatPhong = `HTL${Date.now()}`;

    return this.prisma.datPhong.create({
      data: {
        maDatPhong,
        userId: data.userId,
        khachSanId: data.khachSanId,
        phongId: data.phongId,
        ngayNhanPhong: new Date(data.ngayNhanPhong),
        ngayTraPhong: new Date(data.ngayTraPhong),
        soPhong: data.soPhong,
        soNguoiLon: data.soNguoiLon,
        soTreEm: data.soTreEm,
        tongTien: Number(data.tongTien),
        ghiChu: data.ghiChu,
      },
      include: {
        khachSan: true,
        phong: true,
      },
    });
  }

  // Lấy booking theo user
  async getBookingsByUserId(userId: number) {
    return this.prisma.datPhong.findMany({
      where: { userId },
      include: {
        khachSan: true,
        phong: true,
      },
      orderBy: {
        createdAt: 'desc',
      },
    });
  }

  // Tạo đánh giá khách sạn
  async createReview(data: {
    userId: number;
    khachSanId: number;
    diemSachSe: number;
    diemTienNghi: number;
    diemViTri: number;
    diemDichVu: number;
    diemGiaCa: number;
    binhLuan?: string;
    hinhAnh?: string;
  }) {
    const diemTrungBinh =
      (data.diemSachSe + data.diemTienNghi + data.diemViTri + data.diemDichVu + data.diemGiaCa) / 5;

    const review = await this.prisma.danhGiaKhachSan.create({
      data: {
        ...data,
        diemTrungBinh: Number(diemTrungBinh.toFixed(2)),
      },
    });

    // Cập nhật điểm trung bình của khách sạn
    const allReviews = await this.prisma.danhGiaKhachSan.findMany({
      where: { khachSanId: data.khachSanId },
    });

    const avgRating =
      allReviews.reduce((sum, r) => sum + Number(r.diemTrungBinh), 0) / allReviews.length;

    await this.prisma.khachSan.update({
      where: { id: data.khachSanId },
      data: {
        danhGiaTB: Number(avgRating.toFixed(2)),
      },
    });

    return review;
  }
}
