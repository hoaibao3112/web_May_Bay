import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { SearchFlightDto } from './dto/search-flight.dto';
import { randomBytes } from 'crypto';

@Injectable()
export class SearchService {
  constructor(private prisma: PrismaService) { }

  async searchFlights(dto: SearchFlightDto) {
    const searchSessionId = randomBytes(16).toString('hex');

    // Parse ngày đi
    const ngayDi = new Date(dto.ngayDi);
    const ngayDiStart = new Date(ngayDi);
    ngayDiStart.setHours(0, 0, 0, 0);
    const ngayDiEnd = new Date(ngayDi);
    ngayDiEnd.setHours(23, 59, 59, 999);

    // Tìm chặng bay
    const changBays = await this.prisma.changBay.findMany({
      where: {
        sanBayDiId: dto.sanBayDiId,
        sanBayDenId: dto.sanBayDenId,
        gioDi: {
          gte: ngayDiStart,
          lte: ngayDiEnd,
        },
      },
      include: {
        chuyenBay: {
          include: {
            hang: true,
          },
        },
        sanBayDi: true,
        sanBayDen: true,
        giaVe: {
          where: {
            soLuongGheTrong: {
              gte: dto.nguoiLon + dto.treEm,
            },
          },
          include: {
            hangVe: true,
          },
        },
      },
      orderBy: {
        gioDi: 'asc',
      },
    });

    // Format kết quả
    const ketQua = changBays.map((chang) => {
      const giaCacLoai = chang.giaVe.map((giaVe) => {
        const tongGia = Number(giaVe.giaBan);

        return {
          giaVeId: giaVe.id,
          hangVe: giaVe.hangVe.maHang,
          tenHangVe: giaVe.hangVe.tenHang,
          khoangVe: giaVe.hangVe.maHang, // Use same as hangVe since khoangVe doesn't exist
          nhomGia: giaVe.hangVe.tenHang,
          nhomGiaId: giaVe.hangVeId,
          giaCoSo: Number(giaVe.giaBan),
          thue: 0, // Not in current schema
          phi: 0, // Not in current schema
          tongGia,
          soChoCon: giaVe.soLuongGheTrong,
          hanhLyKy: 20, // Default values since not in schema
          hanhLyXach: 7,
          choPhepDoi: true,
          choPhepHoan: false,
        };
      });

      return {
        changBayId: chang.id,
        chuyenBayId: chang.chuyenBayId,
        soHieuChuyenBay: chang.chuyenBay.soHieuChuyenBay,
        hang: {
          maIata: chang.chuyenBay.hang.maIata,
          tenHang: chang.chuyenBay.hang.tenHang,
          logo: chang.chuyenBay.hang.logo,
        },
        sanBayDi: {
          maIata: chang.sanBayDi.maIata,
          tenSanBay: chang.sanBayDi.tenSanBay,
          thanhPho: chang.sanBayDi.thanhPho,
        },
        sanBayDen: {
          maIata: chang.sanBayDen.maIata,
          tenSanBay: chang.sanBayDen.tenSanBay,
          thanhPho: chang.sanBayDen.thanhPho,
        },
        gioDi: chang.gioDi,
        gioDen: chang.gioDen,
        thoiGianBayPhut: chang.thoiGianBayPhut,
        giaVe: giaCacLoai,
      };
    });

    return {
      searchSessionId,
      loaiChuyen: dto.loaiChuyen,
      tongSoKetQua: ketQua.length,
      ketQua,
    };
  }

  // Tính giá chi tiết theo số lượng hành khách
  calculatePrice(giaCoSo: number, thue: number, phi: number, pax: { nguoiLon: number; treEm: number; soSinh: number }) {
    const giaCoSoTotal = giaCoSo * (pax.nguoiLon + pax.treEm * 0.75 + pax.soSinh * 0.1);
    const thueTotal = thue * (pax.nguoiLon + pax.treEm + pax.soSinh);
    const phiTotal = phi * (pax.nguoiLon + pax.treEm + pax.soSinh);

    return {
      giaCoSoTotal,
      thueTotal,
      phiTotal,
      tongCong: giaCoSoTotal + thueTotal + phiTotal,
    };
  }

  // Lấy thông tin chuyến bay theo ID
  async getFlightById(changBayId: number) {
    const changBay = await this.prisma.changBay.findUnique({
      where: { id: changBayId },
      include: {
        chuyenBay: {
          include: {
            hang: true,
          },
        },
        sanBayDi: true,
        sanBayDen: true,
      },
    });

    if (!changBay) {
      throw new Error('Không tìm thấy chuyến bay');
    }

    return {
      maChuyenBay: changBay.chuyenBay.soHieuChuyenBay,
      sanBayDi: {
        maIata: changBay.sanBayDi.maIata,
        tenSanBay: changBay.sanBayDi.tenSanBay,
        thanhPho: changBay.sanBayDi.thanhPho,
      },
      sanBayDen: {
        maIata: changBay.sanBayDen.maIata,
        tenSanBay: changBay.sanBayDen.tenSanBay,
        thanhPho: changBay.sanBayDen.thanhPho,
      },
      ngayKhoiHanh: changBay.gioDi,
      gioDi: changBay.gioDi.toTimeString().slice(0, 5),
      gioDen: changBay.gioDen.toTimeString().slice(0, 5),
    };
  }
}
