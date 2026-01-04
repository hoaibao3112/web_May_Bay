import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class BaggageService {
  constructor(private prisma: PrismaService) {}

  // Thêm hành lý ký gửi
  async addBaggage(hanhKhachId: number, soKien: number, khoiLuong: number) {
    const hanhKhach = await this.prisma.hanhKhach.findUnique({
      where: { id: hanhKhachId },
      include: {
        donDatVe: {
          include: {
            hangVe: true,
          },
        },
      },
    });

    if (!hanhKhach) {
      throw new NotFoundException('Không tìm thấy hành khách');
    }

    // Định mức hành lý cơ bản: 20kg/hành khách
    const DEFINED_WEIGHT = 20;
    
    // Tính phí vượt định mức
    const extraWeight = Math.max(0, khoiLuong - DEFINED_WEIGHT);
    const extraFee = extraWeight * 50000; // 50k/kg vượt định mức

    // Tạo bản ghi hành lý
    const baggage = await this.prisma.hanhLy.create({
      data: {
        hanhKhachId: hanhKhachId,
        loai: 'KY_GUI',
        soKien: soKien,
        khoiLuong: khoiLuong,
        phiPhatSinh: extraFee,
      },
    });

    return {
      id: baggage.id,
      soKien,
      khoiLuong,
      dinhMuc: DEFINED_WEIGHT,
      vuotDinhMuc: extraWeight,
      phiPhatSinh: extraFee,
      tongPhi: extraFee,
    };
  }

  // Lấy thông tin hành lý của booking
  async getBookingBaggage(bookingId: number) {
    const hanhKhachs = await this.prisma.hanhKhach.findMany({
      where: { donDatVeId: bookingId },
      include: {
        hanhLy: true,
      },
    });

    const baggageList = hanhKhachs.flatMap((hk) =>
      hk.hanhLy.map((hl) => ({
        hanhLyId: hl.id,
        hanhKhachId: hk.id,
        hoTen: `${hk.ho} ${hk.ten}`,
        loai: hl.loai,
        soKien: hl.soKien,
        khoiLuong: hl.khoiLuong,
        phiPhatSinh: hl.phiPhatSinh,
      })),
    );

    const tongPhi = baggageList.reduce((sum, item) => sum + Number(item.phiPhatSinh || 0), 0);

    return {
      bookingId,
      danhSachHanhLy: baggageList,
      tongPhiHanhLy: tongPhi,
    };
  }

  // Tính phí hành lý
  async calculateBaggageFee(hangVeId: number, khoiLuong: number) {
    const hangVe = await this.prisma.hangVe.findUnique({
      where: { id: hangVeId },
    });

    if (!hangVe) {
      throw new NotFoundException('Không tìm thấy hạng vé');
    }

    const DEFINED_WEIGHT = 20; // Định mức cố định 20kg
    const extraWeight = Math.max(0, khoiLuong - DEFINED_WEIGHT);
    const fee = extraWeight * 50000;

    return {
      hangVe: hangVe.tenHang,
      dinhMucKg: DEFINED_WEIGHT,
      khoiLuongYeuCau: khoiLuong,
      vuotDinhMuc: extraWeight,
      donGia: 50000,
      phiPhatSinh: fee,
    };
  }

  // Xóa hành lý
  async removeBaggage(id: number) {
    try {
      await this.prisma.hanhLy.delete({
        where: { id },
      });
      return { message: 'Đã xóa hành lý' };
    } catch (error) {
      throw new NotFoundException('Không tìm thấy hành lý');
    }
  }

  // Lấy chính sách hành lý
  async getBaggagePolicy(hangVeId: number) {
    const hangVe = await this.prisma.hangVe.findUnique({
      where: { id: hangVeId },
      include: {
        khoangVe: true,
      },
    });

    if (!hangVe) {
      throw new NotFoundException('Không tìm thấy hạng vé');
    }

    // Chính sách hành lý cố định
    return {
      hangVe: hangVe.tenHang,
      khoangVe: hangVe.khoangVe.tenKhoang,
      hanhLyKyGui: 20, // 20kg hành lý ký gửi
      hanhLyXachTay: 7, // 7kg hành lý xách tay
      donGiaVuotDinhMuc: 50000,
      donVi: 'VND/kg',
      ghiChu: 'Áp dụng cho tất cả hạng vé',
    };
  }
}
