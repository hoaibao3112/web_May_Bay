import { Injectable, BadRequestException, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class PromotionsService {
  constructor(private prisma: PrismaService) {}

  // Áp dụng mã khuyến mãi
  async applyPromotion(code: string, bookingId: number) {
    // Kiểm tra booking
    const booking = await this.prisma.donDatVe.findUnique({
      where: { id: bookingId },
    });

    if (!booking) {
      throw new NotFoundException('Không tìm thấy đơn đặt vé');
    }

    if (booking.trangThai !== 'CHO_THANH_TOAN') {
      throw new BadRequestException('Không thể áp dụng khuyến mãi cho đơn này');
    }

    // Kiểm tra mã khuyến mãi
    const promotion = await this.prisma.khuyenMai.findFirst({
      where: {
        maKhuyenMai: code,
        isActive: true,
        ngayBatDau: { lte: new Date() },
        ngayKetThuc: { gte: new Date() },
      },
    });

    if (!promotion) {
      throw new BadRequestException('Mã khuyến mãi không hợp lệ hoặc đã hết hạn');
    }

    // Kiểm tra số lượng đã dùng
    if (promotion.soLuotDaSuDung >= promotion.soLuotSuDung) {
      throw new BadRequestException('Mã khuyến mãi đã hết lượt sử dụng');
    }

    // Kiểm tra giá trị đơn hàng tối thiểu
    if (Number(booking.tongTien) < Number(promotion.giaTriDonToiThieu)) {
      throw new BadRequestException(
        `Đơn hàng phải có giá trị tối thiểu ${promotion.giaTriDonToiThieu.toLocaleString()}đ`,
      );
    }

    // Tính giảm giá
    let discountAmount = 0;
    if (promotion.loaiGiam === 'PERCENT') {
      discountAmount = (Number(booking.tongTien) * Number(promotion.giaTriGiam)) / 100;
      if (promotion.giamToiDa) {
        discountAmount = Math.min(discountAmount, Number(promotion.giamToiDa));
      }
    } else {
      discountAmount = Number(promotion.giaTriGiam);
    }

    const newTotal = Number(booking.tongTien) - discountAmount;

    // Cập nhật booking
    await this.prisma.donDatVe.update({
      where: { id: bookingId },
      data: {
        maKhuyenMai: code,
        giamGia: discountAmount,
        tongTien: newTotal,
      },
    });

    // Tăng số lượt sử dụng
    await this.prisma.khuyenMai.update({
      where: { id: promotion.id },
      data: {
        soLuotDaSuDung: { increment: 1 },
      },
    });

    return {
      message: 'Áp dụng mã khuyến mãi thành công',
      maKhuyenMai: code,
      tenKhuyenMai: promotion.tenKhuyenMai,
      giaGoc: booking.tongTien,
      giamGia: discountAmount,
      tongTienMoi: newTotal,
    };
  }

  // Kiểm tra mã khuyến mãi
  async validatePromotion(code: string) {
    const promotion = await this.prisma.khuyenMai.findFirst({
      where: {
        maKhuyenMai: code,
      },
    });

    if (!promotion) {
      return {
        valid: false,
        reason: 'Mã khuyến mãi không tồn tại',
      };
    }

    const now = new Date();

    if (!promotion.isActive) {
      return {
        valid: false,
        reason: 'Mã khuyến mãi không còn hoạt động',
      };
    }

    if (now < new Date(promotion.ngayBatDau)) {
      return {
        valid: false,
        reason: 'Mã khuyến mãi chưa bắt đầu',
      };
    }

    if (now > new Date(promotion.ngayKetThuc)) {
      return {
        valid: false,
        reason: 'Mã khuyến mãi đã hết hạn',
      };
    }

    if (promotion.soLuotDaSuDung >= promotion.soLuotSuDung) {
      return {
        valid: false,
        reason: 'Mã khuyến mãi đã hết lượt sử dụng',
      };
    }

    return {
      valid: true,
      promotion: {
        ma: promotion.maKhuyenMai,
        ten: promotion.tenKhuyenMai,
        moTa: promotion.moTa,
        loaiGiam: promotion.loaiGiam,
        giaTriGiam: promotion.giaTriGiam,
        giamToiDa: promotion.giamToiDa,
        giaTriDonToiThieu: promotion.giaTriDonToiThieu,
        ngayHetHan: promotion.ngayKetThuc,
      },
    };
  }

  // Lấy danh sách khuyến mãi đang hoạt động
  async getActivePromotions() {
    const promotions = await this.prisma.khuyenMai.findMany({
      where: {
        isActive: true,
        ngayBatDau: { lte: new Date() },
        ngayKetThuc: { gte: new Date() },
      },
      orderBy: {
        createdAt: 'desc',
      },
    });

    return promotions.map((p) => ({
      ma: p.maKhuyenMai,
      ten: p.tenKhuyenMai,
      moTa: p.moTa,
      loaiGiam: p.loaiGiam,
      giaTriGiam: p.giaTriGiam,
      giamToiDa: p.giamToiDa,
      giaTriDonToiThieu: p.giaTriDonToiThieu,
      conLai: p.soLuotSuDung - p.soLuotDaSuDung,
      ngayHetHan: p.ngayKetThuc,
    }));
  }

  // Lấy khuyến mãi cho user cụ thể
  async getPromotionsForUser(userId: number) {
    // Có thể filter theo điều kiện đặc biệt như: user mới, VIP, etc.
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
    });

    if (!user) {
      throw new NotFoundException('Không tìm thấy người dùng');
    }

    // Lấy tất cả khuyến mãi đang hoạt động
    const allPromotions = await this.getActivePromotions();

    // TODO: Filter theo điều kiện user (ví dụ: chỉ cho user mới, VIP, etc.)

    return allPromotions;
  }

  // Hủy áp dụng mã khuyến mãi
  async removePromotion(bookingId: number) {
    const booking = await this.prisma.donDatVe.findUnique({
      where: { id: bookingId },
    });

    if (!booking || !booking.maKhuyenMai) {
      throw new BadRequestException('Đơn đặt vé chưa áp dụng mã khuyến mãi');
    }

    const originalAmount = Number(booking.tongTien) + Number(booking.giamGia || 0);

    await this.prisma.donDatVe.update({
      where: { id: bookingId },
      data: {
        maKhuyenMai: null,
        giamGia: 0,
        tongTien: originalAmount,
      },
    });

    // Giảm số lượt đã sử dụng
    await this.prisma.khuyenMai.updateMany({
      where: {
        maKhuyenMai: booking.maKhuyenMai,
      },
      data: {
        soLuotDaSuDung: { decrement: 1 },
      },
    });

    return {
      message: 'Đã hủy mã khuyến mãi',
      tongTienMoi: originalAmount,
    };
  }
}
