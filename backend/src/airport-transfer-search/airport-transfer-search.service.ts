import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { SearchAirportTransferDto } from './dto/search-airport-transfer.dto';

@Injectable()
export class AirportTransferSearchService {
    constructor(private prisma: PrismaService) { }

    async searchServices(searchDto: SearchAirportTransferDto) {
        const { sanBayId, ngayDon, soHanhKhach, loaiXe, giaMin, giaMax, nhaCungCapId, loaiDichVu } = searchDto;

        // Build WHERE conditions dynamically
        let whereConditions = 'WHERE dv.trangThai = \'active\' AND dv.sanBayId = ' + sanBayId;
        
        if (loaiXe) {
            whereConditions += ` AND dv.loaiXe = '${loaiXe}'`;
        }
        
        if (soHanhKhach) {
            whereConditions += ` AND dv.soChoNgoi >= ${soHanhKhach}`;
        }
        
        if (nhaCungCapId) {
            whereConditions += ` AND dv.nhaCungCapId = ${nhaCungCapId}`;
        }
        
        if (giaMin) {
            const priceField = loaiDichVu === 'khu_hoi' ? 'giaTienKhuHoi' : 'giaTienMotChieu';
            whereConditions += ` AND dv.${priceField} >= ${giaMin}`;
        }
        
        if (giaMax) {
            const priceField = loaiDichVu === 'khu_hoi' ? 'giaTienKhuHoi' : 'giaTienMotChieu';
            whereConditions += ` AND dv.${priceField} <= ${giaMax}`;
        }

        const services: any[] = await this.prisma.$queryRawUnsafe(`
            SELECT 
                dv.*,
                ncc.tenNhaCungCap,
                ncc.logo,
                ncc.soDienThoai,
                ncc.danhGiaTrungBinh,
                ncc.tongSoDanhGia,
                sb.tenSanBay,
                sb.maSanBay,
                sb.thanhPho as thanhPhoSanBay
            FROM dich_vu_dua_don dv
            JOIN nha_cung_cap_dua_don ncc ON dv.nhaCungCapId = ncc.id
            JOIN san_bay sb ON dv.sanBayId = sb.id
            ${whereConditions}
            ORDER BY ncc.danhGiaTrungBinh DESC, dv.giaTienMotChieu ASC
        `);

        return services.map((service: any) => ({
            id: service.id,
            nhaCungCap: {
                id: service.nhaCungCapId,
                ten: service.tenNhaCungCap,
                logo: service.logo,
                soDienThoai: service.soDienThoai,
                danhGiaTrungBinh: parseFloat(service.danhGiaTrungBinh),
                tongSoDanhGia: service.tongSoDanhGia,
            },
            sanBay: {
                id: service.sanBayId,
                ten: service.tenSanBay,
                ma: service.maSanBay,
                thanhPho: service.thanhPhoSanBay,
            },
            loaiXe: service.loaiXe,
            soChoNgoi: service.soChoNgoi,
            giaTienMotChieu: parseFloat(service.giaTienMotChieu),
            giaTienKhuHoi: service.giaTienKhuHoi ? parseFloat(service.giaTienKhuHoi) : null,
            moTa: service.moTa,
            tienIch: service.tienIch ? JSON.parse(service.tienIch) : [],
            hinhAnh: service.hinhAnh ? JSON.parse(service.hinhAnh) : [],
        }));
    }

    async getServiceById(id: number) {
        const service: any = await this.prisma.$queryRaw`
            SELECT 
                dv.*,
                ncc.tenNhaCungCap,
                ncc.logo,
                ncc.soDienThoai,
                ncc.email,
                ncc.diaChi,
                ncc.moTa as moTaNhaCungCap,
                ncc.danhGiaTrungBinh,
                ncc.tongSoDanhGia,
                sb.tenSanBay,
                sb.maSanBay,
                sb.thanhPho as thanhPhoSanBay
            FROM dich_vu_dua_don dv
            JOIN nha_cung_cap_dua_don ncc ON dv.nhaCungCapId = ncc.id
            JOIN san_bay sb ON dv.sanBayId = sb.id
            WHERE dv.id = ${id}
        `;

        if (!service || service.length === 0) {
            throw new Error('Không tìm thấy dịch vụ');
        }

        const result = service[0];

        return {
            id: result.id,
            nhaCungCap: {
                id: result.nhaCungCapId,
                ten: result.tenNhaCungCap,
                logo: result.logo,
                soDienThoai: result.soDienThoai,
                email: result.email,
                diaChi: result.diaChi,
                moTa: result.moTaNhaCungCap,
                danhGiaTrungBinh: parseFloat(result.danhGiaTrungBinh),
                tongSoDanhGia: result.tongSoDanhGia,
            },
            sanBay: {
                id: result.sanBayId,
                ten: result.tenSanBay,
                ma: result.maSanBay,
                thanhPho: result.thanhPhoSanBay,
            },
            loaiXe: result.loaiXe,
            soChoNgoi: result.soChoNgoi,
            giaTienMotChieu: parseFloat(result.giaTienMotChieu),
            giaTienKhuHoi: result.giaTienKhuHoi ? parseFloat(result.giaTienKhuHoi) : null,
            moTa: result.moTa,
            tienIch: result.tienIch ? JSON.parse(result.tienIch) : [],
            hinhAnh: result.hinhAnh ? JSON.parse(result.hinhAnh) : [],
        };
    }

    async getPopularAirports(limit: number = 5) {
        const airports: any = await this.prisma.$queryRaw`
            SELECT 
                sb.*,
                COUNT(DISTINCT dv.id) as soLuongDichVu,
                COUNT(DISTINCT dv.nhaCungCapId) as soLuongNhaCungCap
            FROM san_bay sb
            LEFT JOIN dich_vu_dua_don dv ON sb.id = dv.sanBayId AND dv.trangThai = 'active'
            GROUP BY sb.id
            HAVING soLuongDichVu > 0
            ORDER BY soLuongDichVu DESC
            LIMIT ${limit}
        `;

        return airports;
    }

    async suggestAirports(query: string) {
        const airports: any = await this.prisma.$queryRaw`
            SELECT id, maSanBay, tenSanBay, thanhPho
            FROM san_bay
            WHERE tenSanBay LIKE ${`%${query}%`}
                OR thanhPho LIKE ${`%${query}%`}
                OR maSanBay LIKE ${`%${query}%`}
            LIMIT 10
        `;

        return airports;
    }

    async suggestDestinations(query: string, city?: string) {
        // Search in Hotels and Rental Routes
        const hotels: any[] = city
            ? await this.prisma.$queryRaw`
                SELECT id, tenKhachSan as name, 'hotel' as type, thanhPho as city
                FROM khach_san
                WHERE (tenKhachSan LIKE ${`%${query}%`} OR diaChi LIKE ${`%${query}%`})
                    AND (thanhPho LIKE ${`%${city}%`})
                LIMIT 5
            `
            : await this.prisma.$queryRaw`
                SELECT id, tenKhachSan as name, 'hotel' as type, thanhPho as city
                FROM khach_san
                WHERE (tenKhachSan LIKE ${`%${query}%`} OR diaChi LIKE ${`%${query}%`})
                LIMIT 5
            `;

        const rentalPoints: any[] = await this.prisma.$queryRaw`
            SELECT id, diemDen as name, 'area' as type, COALESCE(diemDen, '') as city
            FROM tuyen_duong_thue_xe
            WHERE (diemDen LIKE ${`%${query}%`} OR diemDi LIKE ${`%${query}%`})
            LIMIT 5
        `;

        const combined = [
            ...hotels.map(h => ({ ...h })),
            ...rentalPoints.map(r => ({ ...r }))
        ];

        // Add typical districts if a city is provided
        if (city) {
            const cityName = city.toLowerCase();
            let districts: any[] = [];

            if (cityName.includes('hồ chí minh') || cityName.includes('hcm') || cityName.includes('sài gòn')) {
                districts = [
                    { id: 1001, name: 'Quận 1, TP. Hồ Chí Minh', type: 'district', city: 'TP. Hồ Chí Minh' },
                    { id: 1002, name: 'Quận 3, TP. Hồ Chí Minh', type: 'district', city: 'TP. Hồ Chí Minh' },
                    { id: 1003, name: 'Quận 7, TP. Hồ Chí Minh', type: 'district', city: 'TP. Hồ Chí Minh' },
                    { id: 1004, name: 'Thành phố Thủ Đức, TP. Hồ Chí Minh', type: 'district', city: 'TP. Hồ Chí Minh' },
                    { id: 1005, name: 'Quận Tân Bình, TP. Hồ Chí Minh', type: 'district', city: 'TP. Hồ Chí Minh' },
                    { id: 1006, name: 'Quận Phú Nhuận, TP. Hồ Chí Minh', type: 'district', city: 'TP. Hồ Chí Minh' },
                    { id: 1007, name: 'Quận Bình Thạnh, TP. Hồ Chí Minh', type: 'district', city: 'TP. Hồ Chí Minh' },
                    { id: 1008, name: 'Quận 5, TP. Hồ Chí Minh', type: 'district', city: 'TP. Hồ Chí Minh' },
                ];
            } else if (cityName.includes('hà nội') || cityName.includes('han')) {
                districts = [
                    { id: 2001, name: 'Quận Hoàn Kiếm, Hà Nội', type: 'district', city: 'Hà Nội' },
                    { id: 2002, name: 'Quận Ba Đình, Hà Nội', type: 'district', city: 'Hà Nội' },
                    { id: 2003, name: 'Quận Tây Hồ, Hà Nội', type: 'district', city: 'Hà Nội' },
                    { id: 2004, name: 'Quận Cầu Giấy, Hà Nội', type: 'district', city: 'Hà Nội' },
                    { id: 2005, name: 'Quận Đống Đa, Hà Nội', type: 'district', city: 'Hà Nội' },
                    { id: 2006, name: 'Quận Hai Bà Trưng, Hà Nội', type: 'district', city: 'Hà Nội' },
                    { id: 2007, name: 'Quận Nam Từ Liêm, Hà Nội', type: 'district', city: 'Hà Nội' },
                ];
            } else if (cityName.includes('đà nẵng') || cityName.includes('dad')) {
                districts = [
                    { id: 3001, name: 'Quận Hải Châu, Đà Nẵng', type: 'district', city: 'Đà Nẵng' },
                    { id: 3002, name: 'Quận Thanh Khê, Đà Nẵng', type: 'district', city: 'Đà Nẵng' },
                    { id: 3003, name: 'Quận Sơn Trà, Đà Nẵng', type: 'district', city: 'Đà Nẵng' },
                    { id: 3004, name: 'Quận Ngũ Hành Sơn, Đà Nẵng', type: 'district', city: 'Đà Nẵng' },
                    { id: 3005, name: 'Quận Liên Chiểu, Đà Nẵng', type: 'district', city: 'Đà Nẵng' },
                ];
            }

            // Filter districts by query if exists
            const filteredDistricts = query
                ? districts.filter(d => d.name.toLowerCase().includes(query.toLowerCase()))
                : districts;

            combined.push(...filteredDistricts);
        }

        if (combined.length === 0 && !city) {
            // Fallback for demo if no real data matches
            return [
                { id: 101, name: 'Quận Hoàn Kiếm, Hà Nội', type: 'district', city: 'Hà Nội' },
                { id: 102, name: 'Quận 1, TP. Hồ Chí Minh', type: 'district', city: 'TP. Hồ Chí Minh' },
                { id: 103, name: 'Quận Hải Châu, Đà Nẵng', type: 'district', city: 'Đà Nẵng' },
            ].filter(d => d.name.toLowerCase().includes(query.toLowerCase()));
        }

        return combined.slice(0, 10);
    }
}
