import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { SearchFlightDto } from './dto/search-flight.dto';
import { randomBytes } from 'crypto';

@Injectable()
export class SearchService {
  constructor(private prisma: PrismaService) {}

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
        tonCho: {
          where: {
            soChoCon: {
              gte: dto.nguoiLon + dto.treEm,
            },
          },
          include: {
            hangVe: {
              include: {
                khoangVe: true,
              },
            },
            nhomGia: true,
          },
        },
      },
      orderBy: {
        gioDi: 'asc',
      },
    });

    // Format kết quả
    const ketQua = changBays.map((chang) => {
      const giaCacLoai = chang.tonCho.map((ton) => {
        const tongGia = Number(ton.giaCoSo) + Number(ton.thue) + Number(ton.phi);

        return {
          tonChoId: ton.id,
          hangVe: ton.hangVe.maHang,
          tenHangVe: ton.hangVe.tenHang,
          khoangVe: ton.hangVe.khoangVe.maKhoang,
          nhomGia: ton.nhomGia?.tenNhom || 'Standard',
          nhomGiaId: ton.nhomGiaId,
          giaCoSo: Number(ton.giaCoSo),
          thue: Number(ton.thue),
          phi: Number(ton.phi),
          tongGia,
          soChoCon: ton.soChoCon,
          hanhLyKy: ton.nhomGia?.hanhLyKy || 0,
          hanhLyXach: ton.nhomGia?.hanhLyXach || 7,
          choPhepDoi: ton.nhomGia?.choPhepDoi || false,
          choPhepHoan: ton.nhomGia?.choPhepHoan || false,
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
}
