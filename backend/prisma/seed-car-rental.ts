import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
    console.log('🚗 Bắt đầu seed dữ liệu cho hệ thống cho thuê xe...\n');

    // ============================
    // 1. TẠO NHÀ CUNG CẤP XE
    // ============================
    console.log('📦 Tạo nhà cung cấp xe...');

    const transferz = await prisma.nhaCungCapXe.upsert({
        where: { maNhaCungCap: 'TRANSFERZ' },
        update: {},
        create: {
            maNhaCungCap: 'TRANSFERZ',
            tenNhaCungCap: 'Transferz',
            logo: '/logos/transferz.png',
            soDienThoai: '1900-1234',
            email: 'support@transferz.com',
            website: 'https://www.transferz.com',
            diaChi: '123 Đường ABC, Quận 1, TP.HCM',
            moTa: 'Dịch vụ đưa đón sân bay hàng đầu Việt Nam với đội xe hiện đại và tài xế chuyên nghiệp',
            danhGiaTrungBinh: 9.2,
            soDanhGia: 1247,
            chinhSachHuy: 'Miễn phí hủy trong 24 giờ trước giờ đón. Phí hủy 50% nếu hủy trong vòng 12 giờ.',
            chinhSachThanhToan: 'Thanh toán trực tuyến qua VNPAY, MoMo, ZaloPay hoặc thanh toán tiền mặt cho tài xế',
            trangThai: 'HOAT_DONG',
        },
    });

    const grab = await prisma.nhaCungCapXe.upsert({
        where: { maNhaCungCap: 'GRAB' },
        update: {},
        create: {
            maNhaCungCap: 'GRAB',
            tenNhaCungCap: 'Grab Car',
            logo: '/logos/grab.png',
            soDienThoai: '1900-1515',
            email: 'support@grab.vn',
            website: 'https://www.grab.com/vn',
            diaChi: '456 Đường XYZ, Quận 3, TP.HCM',
            moTa: 'Nền tảng gọi xe công nghệ số 1 Đông Nam Á',
            danhGiaTrungBinh: 8.8,
            soDanhGia: 3521,
            chinhSachHuy: 'Miễn phí hủy trong 5 phút sau khi đặt. Phí hủy 20.000đ sau thời gian này.',
            chinhSachThanhToan: 'Thanh toán qua ví Grab, thẻ tín dụng hoặc tiền mặt',
            trangThai: 'HOAT_DONG',
        },
    });

    const vipTransfer = await prisma.nhaCungCapXe.upsert({
        where: { maNhaCungCap: 'VIPTRANSFER' },
        update: {},
        create: {
            maNhaCungCap: 'VIPTRANSFER',
            tenNhaCungCap: 'VIP Transfer',
            logo: '/logos/viptransfer.png',
            soDienThoai: '1900-6789',
            email: 'info@viptransfer.vn',
            website: 'https://www.viptransfer.vn',
            diaChi: '789 Đường DEF, Quận 7, TP.HCM',
            moTa: 'Dịch vụ xe sang cao cấp, phục vụ khách hàng VIP và doanh nghiệp',
            danhGiaTrungBinh: 9.5,
            soDanhGia: 856,
            chinhSachHuy: 'Miễn phí hủy trong 48 giờ. Phí hủy 30% nếu hủy trong vòng 24 giờ.',
            chinhSachThanhToan: 'Thanh toán trực tuyến hoặc chuyển khoản doanh nghiệp',
            trangThai: 'HOAT_DONG',
        },
    });

    console.log(`✅ Đã tạo ${3} nhà cung cấp xe\n`);

    // ============================
    // 2. TẠO LOẠI XE
    // ============================
    console.log('🚙 Tạo loại xe...');

    const sedan = await prisma.loaiXeThue.upsert({
        where: { maLoaiXe: 'SEDAN' },
        update: {},
        create: {
            maLoaiXe: 'SEDAN',
            tenLoaiXe: 'Sedan (Standard)',
            moTa: 'Xe sedan 4 chỗ tiêu chuẩn, phù hợp cho cá nhân và gia đình nhỏ',
            soHanhKhach: 2,
            soHanhLy: 3,
            hinhAnh: '/cars/sedan.png',
            tienNghi: JSON.stringify(['Điều hòa', 'WiFi', 'Nước uống', 'Sạc điện thoại']),
        },
    });

    const economySedan = await prisma.loaiXeThue.upsert({
        where: { maLoaiXe: 'ECONOMY_SEDAN' },
        update: {},
        create: {
            maLoaiXe: 'ECONOMY_SEDAN',
            tenLoaiXe: 'Economy Sedan (Standard)',
            moTa: 'Xe sedan tiết kiệm, giá cả phải chăng',
            soHanhKhach: 2,
            soHanhLy: 3,
            hinhAnh: '/cars/economy-sedan.png',
            tienNghi: JSON.stringify(['Điều hòa', 'Nước uống']),
        },
    });

    const minibus = await prisma.loaiXeThue.upsert({
        where: { maLoaiXe: 'MINIBUS' },
        update: {},
        create: {
            maLoaiXe: 'MINIBUS',
            tenLoaiXe: 'Minibus (Standard)',
            moTa: 'Xe 7-10 chỗ, phù hợp cho nhóm và gia đình lớn',
            soHanhKhach: 10,
            soHanhLy: 14,
            hinhAnh: '/cars/minibus.png',
            tienNghi: JSON.stringify(['Điều hòa', 'WiFi', 'Nước uống', 'Sạc điện thoại', 'TV']),
        },
    });

    const exclusiveMinivan = await prisma.loaiXeThue.upsert({
        where: { maLoaiXe: 'EXCLUSIVE_MINIVAN' },
        update: {},
        create: {
            maLoaiXe: 'EXCLUSIVE_MINIVAN',
            tenLoaiXe: 'Exclusive Minivan (Standard)',
            moTa: 'Xe minivan cao cấp với ghế da và tiện nghi sang trọng',
            soHanhKhach: 5,
            soHanhLy: 5,
            hinhAnh: '/cars/exclusive-minivan.png',
            tienNghi: JSON.stringify(['Điều hòa', 'WiFi', 'Nước uống', 'Sạc điện thoại', 'Ghế massage', 'Rèm che']),
        },
    });

    const bus = await prisma.loaiXeThue.upsert({
        where: { maLoaiXe: 'BUS' },
        update: {},
        create: {
            maLoaiXe: 'BUS',
            tenLoaiXe: 'Bus (Standard)',
            moTa: 'Xe bus 16-29 chỗ, phù hợp cho đoàn du lịch',
            soHanhKhach: 14,
            soHanhLy: 14,
            hinhAnh: '/cars/bus.png',
            tienNghi: JSON.stringify(['Điều hòa', 'WiFi', 'Nước uống', 'Toilet', 'Karaoke']),
        },
    });

    const businessSedan = await prisma.loaiXeThue.upsert({
        where: { maLoaiXe: 'BUSINESS_SEDAN' },
        update: {},
        create: {
            maLoaiXe: 'BUSINESS_SEDAN',
            tenLoaiXe: 'Business Sedan (Standard)',
            moTa: 'Xe sedan hạng sang cho doanh nhân',
            soHanhKhach: 2,
            soHanhLy: 3,
            hinhAnh: '/cars/business-sedan.png',
            tienNghi: JSON.stringify(['Điều hòa', 'WiFi', 'Nước uống', 'Sạc điện thoại', 'Báo', 'Ghế da cao cấp']),
        },
    });

    const suv = await prisma.loaiXeThue.upsert({
        where: { maLoaiXe: 'SUV' },
        update: {},
        create: {
            maLoaiXe: 'SUV',
            tenLoaiXe: 'SUV (Premium)',
            moTa: 'Xe SUV 7 chỗ cao cấp, rộng rãi và thoải mái',
            soHanhKhach: 6,
            soHanhLy: 6,
            hinhAnh: '/cars/suv.png',
            tienNghi: JSON.stringify(['Điều hòa', 'WiFi', 'Nước uống', 'Sạc điện thoại', 'Cốp rộng']),
        },
    });

    const luxurySedan = await prisma.loaiXeThue.upsert({
        where: { maLoaiXe: 'LUXURY_SEDAN' },
        update: {},
        create: {
            maLoaiXe: 'LUXURY_SEDAN',
            tenLoaiXe: 'Luxury Sedan (VIP)',
            moTa: 'Xe sedan hạng sang Mercedes, BMW, Audi',
            soHanhKhach: 3,
            soHanhLy: 3,
            hinhAnh: '/cars/luxury-sedan.png',
            tienNghi: JSON.stringify(['Điều hòa', 'WiFi', 'Nước uống cao cấp', 'Sạc điện thoại', 'Ghế massage', 'Hệ thống âm thanh cao cấp']),
        },
    });

    console.log(`✅ Đã tạo ${8} loại xe\n`);

    // ============================
    // 3. TẠO TUYẾN ĐƯỜNG
    // ============================
    console.log('🛣️ Tạo tuyến đường...');

    // Lấy ID sân bay
    const hanoi = await prisma.sanBay.findUnique({ where: { maIata: 'HAN' } });
    const hochiminh = await prisma.sanBay.findUnique({ where: { maIata: 'SGN' } });
    const danang = await prisma.sanBay.findUnique({ where: { maIata: 'DAD' } });

    const routes = [
        // Hà Nội
        {
            maTuyen: 'HAN-HK',
            diemDi: 'Sân bay Quốc tế Nội Bài (HAN)',
            diemDen: 'Hồ Hoàn Kiếm',
            diemDiId: hanoi?.id,
            khoangCach: 30,
            thoiGianDuKien: 45,
            moTa: 'Tuyến đưa đón từ sân bay Nội Bài về trung tâm Hà Nội',
            trangThai: 'HOAT_DONG',
        },
        {
            maTuyen: 'HAN-CG',
            diemDi: 'Sân bay Quốc tế Nội Bài (HAN)',
            diemDen: 'Cầu Giấy',
            diemDiId: hanoi?.id,
            khoangCach: 25,
            thoiGianDuKien: 40,
            moTa: 'Tuyến đưa đón từ sân bay Nội Bài về quận Cầu Giấy',
            trangThai: 'HOAT_DONG',
        },
        {
            maTuyen: 'HAN-HD',
            diemDi: 'Sân bay Quốc tế Nội Bài (HAN)',
            diemDen: 'Hoàng Mai',
            diemDiId: hanoi?.id,
            khoangCach: 35,
            thoiGianDuKien: 50,
            moTa: 'Tuyến đưa đón từ sân bay Nội Bài về quận Hoàng Mai',
            trangThai: 'HOAT_DONG',
        },
        // TP.HCM
        {
            maTuyen: 'SGN-Q1',
            diemDi: 'Sân bay Tân Sơn Nhất (SGN)',
            diemDen: 'Quận 1',
            diemDiId: hochiminh?.id,
            khoangCach: 8,
            thoiGianDuKien: 20,
            moTa: 'Tuyến đưa đón từ sân bay Tân Sơn Nhất về Quận 1',
            trangThai: 'HOAT_DONG',
        },
        {
            maTuyen: 'SGN-Q7',
            diemDi: 'Sân bay Tân Sơn Nhất (SGN)',
            diemDen: 'Quận 7 - Phú Mỹ Hưng',
            diemDiId: hochiminh?.id,
            khoangCach: 15,
            thoiGianDuKien: 30,
            moTa: 'Tuyến đưa đón từ sân bay Tân Sơn Nhất về Quận 7',
            trangThai: 'HOAT_DONG',
        },
        {
            maTuyen: 'SGN-TD',
            diemDi: 'Sân bay Tân Sơn Nhất (SGN)',
            diemDen: 'Thủ Đức',
            diemDiId: hochiminh?.id,
            khoangCach: 20,
            thoiGianDuKien: 35,
            moTa: 'Tuyến đưa đón từ sân bay Tân Sơn Nhất về Thủ Đức',
            trangThai: 'HOAT_DONG',
        },
        // Đà Nẵng
        {
            maTuyen: 'DAD-HC',
            diemDi: 'Sân bay Quốc tế Đà Nẵng (DAD)',
            diemDen: 'Hải Châu',
            diemDiId: danang?.id,
            khoangCach: 5,
            thoiGianDuKien: 15,
            moTa: 'Tuyến đưa đón từ sân bay Đà Nẵng về quận Hải Châu',
            trangThai: 'HOAT_DONG',
        },
        {
            maTuyen: 'DAD-SB',
            diemDi: 'Sân bay Quốc tế Đà Nẵng (DAD)',
            diemDen: 'Sơn Trà - Bãi biển Mỹ Khê',
            diemDiId: danang?.id,
            khoangCach: 7,
            thoiGianDuKien: 18,
            moTa: 'Tuyến đưa đón từ sân bay Đà Nẵng về bãi biển Mỹ Khê',
            trangThai: 'HOAT_DONG',
        },
        {
            maTuyen: 'DAD-HA',
            diemDi: 'Sân bay Quốc tế Đà Nẵng (DAD)',
            diemDen: 'Hội An',
            diemDiId: danang?.id,
            khoangCach: 30,
            thoiGianDuKien: 40,
            moTa: 'Tuyến đưa đón từ sân bay Đà Nẵng về phố cổ Hội An',
            trangThai: 'HOAT_DONG',
        },
    ];

    for (const route of routes) {
        await prisma.tuyenDuongThueXe.upsert({
            where: { maTuyen: route.maTuyen },
            update: {},
            create: route,
        });
    }

    console.log(`✅ Đã tạo ${routes.length} tuyến đường\n`);

    // ============================
    // 4. TẠO GIÁ THUÊ XE
    // ============================
    console.log('💰 Tạo giá thuê xe...');

    const tuyenDuongs = await prisma.tuyenDuongThueXe.findMany();
    let priceCount = 0;

    // Giá cho từng nhà cung cấp và loại xe
    const priceMatrix = [
        // Transferz
        { ncc: transferz, loaiXe: sedan, giaTheoTuyen: 420596 },
        { ncc: transferz, loaiXe: economySedan, giaTheoTuyen: 481476 },
        { ncc: transferz, loaiXe: minibus, giaTheoTuyen: 724069 },
        { ncc: transferz, loaiXe: exclusiveMinivan, giaTheoTuyen: 804109 },
        { ncc: transferz, loaiXe: bus, giaTheoTuyen: 837794 },
        { ncc: transferz, loaiXe: businessSedan, giaTheoTuyen: 1115825 },
        // Grab
        { ncc: grab, loaiXe: sedan, giaTheoTuyen: 380000 },
        { ncc: grab, loaiXe: economySedan, giaTheoTuyen: 350000 },
        { ncc: grab, loaiXe: suv, giaTheoTuyen: 650000 },
        // VIP Transfer
        { ncc: vipTransfer, loaiXe: businessSedan, giaTheoTuyen: 1200000 },
        { ncc: vipTransfer, loaiXe: luxurySedan, giaTheoTuyen: 1800000 },
        { ncc: vipTransfer, loaiXe: exclusiveMinivan, giaTheoTuyen: 950000 },
    ];

    for (const tuyen of tuyenDuongs) {
        for (const price of priceMatrix) {
            // Điều chỉnh giá theo khoảng cách
            const basePrice = price.giaTheoTuyen;
            const adjustedPrice = tuyen.khoangCach
                ? basePrice * (Number(tuyen.khoangCach) / 30) // Base là 30km
                : basePrice;

            await prisma.giaThueXe.upsert({
                where: {
                    nhaCungCapId_loaiXeId_tuyenDuongId: {
                        nhaCungCapId: price.ncc.id,
                        loaiXeId: price.loaiXe.id,
                        tuyenDuongId: tuyen.id,
                    },
                },
                update: {},
                create: {
                    nhaCungCapId: price.ncc.id,
                    loaiXeId: price.loaiXe.id,
                    tuyenDuongId: tuyen.id,
                    giaTheoTuyen: Math.round(adjustedPrice),
                    giaTheoGio: Math.round(adjustedPrice / 2), // Giá theo giờ = 50% giá tuyến
                    giaTheoNgay: Math.round(adjustedPrice * 8), // Giá theo ngày = 8x giá tuyến
                    donViTienTe: 'VND',
                    giamGia: 0,
                    phuThu: JSON.stringify({
                        night: 50000, // Phụ thu đêm (22h-5h)
                        airport: 30000, // Phụ thu sân bay
                        holiday: 100000, // Phụ thu ngày lễ
                    }),
                    apDungTu: new Date('2026-01-01'),
                    apDungDen: new Date('2026-12-31'),
                    trangThai: 'HOAT_DONG',
                },
            });
            priceCount++;
        }
    }

    console.log(`✅ Đã tạo ${priceCount} mức giá\n`);

    // ============================
    // 5. TẠO XE
    // ============================
    console.log('🚗 Tạo xe...');

    const vehicles = [
        // Transferz
        { ncc: transferz, loaiXe: sedan, bienSo: '30A-12345', mau: 'Trắng', nam: 2023, hk: 2, hl: 3 },
        { ncc: transferz, loaiXe: sedan, bienSo: '30A-12346', mau: 'Đen', nam: 2023, hk: 2, hl: 3 },
        { ncc: transferz, loaiXe: economySedan, bienSo: '30A-12347', mau: 'Bạc', nam: 2022, hk: 2, hl: 3 },
        { ncc: transferz, loaiXe: minibus, bienSo: '30A-12348', mau: 'Trắng', nam: 2023, hk: 10, hl: 14 },
        { ncc: transferz, loaiXe: minibus, bienSo: '30A-12349', mau: 'Xám', nam: 2024, hk: 10, hl: 14 },
        { ncc: transferz, loaiXe: bus, bienSo: '30A-12350', mau: 'Trắng', nam: 2023, hk: 14, hl: 14 },
        // Grab
        { ncc: grab, loaiXe: sedan, bienSo: '51A-56789', mau: 'Đen', nam: 2022, hk: 2, hl: 3 },
        { ncc: grab, loaiXe: sedan, bienSo: '51A-56790', mau: 'Trắng', nam: 2023, hk: 2, hl: 3 },
        { ncc: grab, loaiXe: suv, bienSo: '51A-56791', mau: 'Đỏ', nam: 2024, hk: 6, hl: 6 },
        { ncc: grab, loaiXe: suv, bienSo: '51A-56792', mau: 'Xanh', nam: 2023, hk: 6, hl: 6 },
        // VIP Transfer
        { ncc: vipTransfer, loaiXe: luxurySedan, bienSo: '51G-88888', mau: 'Đen', nam: 2024, hk: 3, hl: 3 },
        { ncc: vipTransfer, loaiXe: luxurySedan, bienSo: '51G-88889', mau: 'Trắng', nam: 2024, hk: 3, hl: 3 },
        { ncc: vipTransfer, loaiXe: businessSedan, bienSo: '51G-88890', mau: 'Xám', nam: 2024, hk: 2, hl: 3 },
        { ncc: vipTransfer, loaiXe: exclusiveMinivan, bienSo: '51G-88891', mau: 'Đen', nam: 2024, hk: 5, hl: 5 },
    ];

    for (const v of vehicles) {
        await prisma.xeThue.upsert({
            where: { bienSoXe: v.bienSo },
            update: {},
            create: {
                nhaCungCapId: v.ncc.id,
                loaiXeId: v.loaiXe.id,
                bienSoXe: v.bienSo,
                mauXe: v.mau,
                namSanXuat: v.nam,
                soHanhKhach: v.hk,
                soHanhLy: v.hl,
                hinhAnh: JSON.stringify(['/cars/car1.jpg', '/cars/car2.jpg']),
                trangThai: 'SAN_SANG',
            },
        });
    }

    console.log(`✅ Đã tạo ${vehicles.length} xe\n`);

    console.log('🎉 Hoàn thành seed dữ liệu cho hệ thống cho thuê xe!\n');
    console.log('📊 Tổng kết:');
    console.log(`   - Nhà cung cấp: 3`);
    console.log(`   - Loại xe: 8`);
    console.log(`   - Tuyến đường: ${routes.length}`);
    console.log(`   - Mức giá: ${priceCount}`);
    console.log(`   - Xe: ${vehicles.length}`);
}

main()
    .catch((e) => {
        console.error('❌ Lỗi khi seed dữ liệu:', e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
