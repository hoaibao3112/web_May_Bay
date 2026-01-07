import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class AirportTransferCompaniesService {
    constructor(private prisma: PrismaService) { }

    async getAllCompanies() {
        const companies: any = await this.prisma.$queryRaw`
            SELECT 
                ncc.*,
                COUNT(DISTINCT dv.id) as soLuongDichVu
            FROM nha_cung_cap_dua_don ncc
            LEFT JOIN dich_vu_dua_don dv ON ncc.id = dv.nhaCungCapId AND dv.trangThai = 'active'
            GROUP BY ncc.id
            ORDER BY ncc.danhGiaTrungBinh DESC, ncc.tongSoDanhGia DESC
        `;

        return companies.map((company: any) => ({
            id: company.id,
            tenNhaCungCap: company.tenNhaCungCap,
            logo: company.logo,
            soDienThoai: company.soDienThoai,
            email: company.email,
            diaChi: company.diaChi,
            moTa: company.moTa,
            danhGiaTrungBinh: parseFloat(company.danhGiaTrungBinh),
            tongSoDanhGia: company.tongSoDanhGia,
            soLuongDichVu: company.soLuongDichVu,
        }));
    }

    async getCompanyById(id: number) {
        const company: any = await this.prisma.$queryRaw`
            SELECT 
                ncc.*,
                COUNT(DISTINCT dv.id) as soLuongDichVu
            FROM nha_cung_cap_dua_don ncc
            LEFT JOIN dich_vu_dua_don dv ON ncc.id = dv.nhaCungCapId AND dv.trangThai = 'active'
            WHERE ncc.id = ${id}
            GROUP BY ncc.id
        `;

        if (!company || company.length === 0) {
            throw new Error('Không tìm thấy nhà cung cấp');
        }

        const result = company[0];

        // Get services
        const services: any = await this.prisma.$queryRaw`
            SELECT 
                dv.*,
                sb.tenSanBay,
                sb.maSanBay,
                sb.thanhPho
            FROM dich_vu_dua_don dv
            JOIN san_bay sb ON dv.sanBayId = sb.id
            WHERE dv.nhaCungCapId = ${id} AND dv.trangThai = 'active'
            ORDER BY dv.giaTienMotChieu ASC
        `;

        return {
            id: result.id,
            tenNhaCungCap: result.tenNhaCungCap,
            logo: result.logo,
            soDienThoai: result.soDienThoai,
            email: result.email,
            diaChi: result.diaChi,
            moTa: result.moTa,
            danhGiaTrungBinh: parseFloat(result.danhGiaTrungBinh),
            tongSoDanhGia: result.tongSoDanhGia,
            soLuongDichVu: result.soLuongDichVu,
            dichVu: services.map((service: any) => ({
                id: service.id,
                sanBay: {
                    ten: service.tenSanBay,
                    ma: service.maSanBay,
                    thanhPho: service.thanhPho,
                },
                loaiXe: service.loaiXe,
                soChoNgoi: service.soChoNgoi,
                giaTienMotChieu: parseFloat(service.giaTienMotChieu),
                giaTienKhuHoi: service.giaTienKhuHoi ? parseFloat(service.giaTienKhuHoi) : null,
                moTa: service.moTa,
                tienIch: service.tienIch ? JSON.parse(service.tienIch) : [],
                hinhAnh: service.hinhAnh ? JSON.parse(service.hinhAnh) : [],
            })),
        };
    }
}
