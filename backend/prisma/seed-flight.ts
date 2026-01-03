import { PrismaClient } from '@prisma/client';
import * as bcrypt from 'bcrypt';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Seeding database...');

  // 1. Tạo Admin user
  const hashedPassword = await bcrypt.hash('admin123', 10);
  const admin = await prisma.user.upsert({
    where: { email: 'admin@flight.com' },
    update: {},
    create: {
      email: 'admin@flight.com',
      password: hashedPassword,
      hoTen: 'Admin System',
      soDienThoai: '0909123456',
      vaiTro: 'ADMIN',
    },
  });
  console.log('✅ Created admin:', admin.email);

  // 2. Quốc gia
  const vietnam = await prisma.quocGia.upsert({
    where: { maQuocGia: 'VNM' },
    update: {},
    create: { maQuocGia: 'VNM', tenQuocGia: 'Việt Nam' },
  });

  const thailand = await prisma.quocGia.upsert({
    where: { maQuocGia: 'THA' },
    update: {},
    create: { maQuocGia: 'THA', tenQuocGia: 'Thái Lan' },
  });

  const singapore = await prisma.quocGia.upsert({
    where: { maQuocGia: 'SGP' },
    update: {},
    create: { maQuocGia: 'SGP', tenQuocGia: 'Singapore' },
  });

  console.log('✅ Created countries');

  // 3. Tiền tệ
  await prisma.tienTe.upsert({
    where: { maTienTe: 'VND' },
    update: {},
    create: { maTienTe: 'VND', tenTienTe: 'Việt Nam Đồng', tyGia: 1 },
  });

  await prisma.tienTe.upsert({
    where: { maTienTe: 'USD' },
    update: {},
    create: { maTienTe: 'USD', tenTienTe: 'US Dollar', tyGia: 25000 },
  });

  console.log('✅ Created currencies');

  // 4. Sân bay
  const sgn = await prisma.sanBay.upsert({
    where: { maIata: 'SGN' },
    update: {},
    create: {
      maIata: 'SGN',
      tenSanBay: 'Sân bay Tân Sơn Nhất',
      thanhPho: 'Hồ Chí Minh',
      quocGiaId: vietnam.id,
      kinhDo: 106.6517,
      viDo: 10.8231,
    },
  });

  const han = await prisma.sanBay.upsert({
    where: { maIata: 'HAN' },
    update: {},
    create: {
      maIata: 'HAN',
      tenSanBay: 'Sân bay Nội Bài',
      thanhPho: 'Hà Nội',
      quocGiaId: vietnam.id,
      kinhDo: 105.8019,
      viDo: 21.2212,
    },
  });

  const dad = await prisma.sanBay.upsert({
    where: { maIata: 'DAD' },
    update: {},
    create: {
      maIata: 'DAD',
      tenSanBay: 'Sân bay Đà Nẵng',
      thanhPho: 'Đà Nẵng',
      quocGiaId: vietnam.id,
      kinhDo: 108.1991,
      viDo: 16.0544,
    },
  });

  const bkk = await prisma.sanBay.upsert({
    where: { maIata: 'BKK' },
    update: {},
    create: {
      maIata: 'BKK',
      tenSanBay: 'Sân bay Suvarnabhumi',
      thanhPho: 'Bangkok',
      quocGiaId: thailand.id,
      kinhDo: 100.7501,
      viDo: 13.6900,
    },
  });

  const sin = await prisma.sanBay.upsert({
    where: { maIata: 'SIN' },
    update: {},
    create: {
      maIata: 'SIN',
      tenSanBay: 'Sân bay Changi',
      thanhPho: 'Singapore',
      quocGiaId: singapore.id,
      kinhDo: 103.9894,
      viDo: 1.3644,
    },
  });

  console.log('✅ Created airports');

  // 5. Hãng hàng không
  const vietnamAirlines = await prisma.hangHangKhong.upsert({
    where: { maIata: 'VN' },
    update: {},
    create: {
      maIata: 'VN',
      tenHang: 'Vietnam Airlines',
      logo: 'https://logo.clearbit.com/vietnamairlines.com',
    },
  });

  const vietjetAir = await prisma.hangHangKhong.upsert({
    where: { maIata: 'VJ' },
    update: {},
    create: {
      maIata: 'VJ',
      tenHang: 'VietJet Air',
      logo: 'https://logo.clearbit.com/vietjetair.com',
    },
  });

  const bamboo = await prisma.hangHangKhong.upsert({
    where: { maIata: 'QH' },
    update: {},
    create: {
      maIata: 'QH',
      tenHang: 'Bamboo Airways',
      logo: 'https://logo.clearbit.com/bambooairways.com',
    },
  });

  console.log('✅ Created airlines');

  // 6. Khoang vé
  const economy = await prisma.khoangVe.upsert({
    where: { maKhoang: 'ECONOMY' },
    update: {},
    create: { maKhoang: 'ECONOMY', tenKhoang: 'Phổ thông' },
  });

  const business = await prisma.khoangVe.upsert({
    where: { maKhoang: 'BUSINESS' },
    update: {},
    create: { maKhoang: 'BUSINESS', tenKhoang: 'Thương gia' },
  });

  console.log('✅ Created cabin classes');

  // 7. Hạng vé
  const hangY = await prisma.hangVe.upsert({
    where: { maHang: 'Y' },
    update: {},
    create: {
      maHang: 'Y',
      tenHang: 'Economy (Y)',
      moTa: 'Hạng phổ thông tiêu chuẩn',
      khoangVeId: economy.id,
    },
  });

  const hangM = await prisma.hangVe.upsert({
    where: { maHang: 'M' },
    update: {},
    create: {
      maHang: 'M',
      tenHang: 'Economy (M)',
      moTa: 'Hạng phổ thông đặc biệt',
      khoangVeId: economy.id,
    },
  });

  const hangJ = await prisma.hangVe.upsert({
    where: { maHang: 'J' },
    update: {},
    create: {
      maHang: 'J',
      tenHang: 'Business (J)',
      moTa: 'Hạng thương gia',
      khoangVeId: business.id,
    },
  });

  console.log('✅ Created fare classes');

  // 8. Nhóm giá vé
  const ecoSaver = await prisma.nhomGiaVe.create({
    data: {
      tenNhom: 'Eco Saver',
      hanhLyKy: 0,
      hanhLyXach: 7,
      choPhepDoi: false,
      choPhepHoan: false,
      phiDoi: 0,
      phiHoan: 0,
    },
  });

  const ecoFlex = await prisma.nhomGiaVe.create({
    data: {
      tenNhom: 'Eco Flex',
      hanhLyKy: 20,
      hanhLyXach: 7,
      choPhepDoi: true,
      choPhepHoan: false,
      phiDoi: 500000,
      phiHoan: 0,
    },
  });

  const bizFlex = await prisma.nhomGiaVe.create({
    data: {
      tenNhom: 'Business Flex',
      hanhLyKy: 30,
      hanhLyXach: 10,
      choPhepDoi: true,
      choPhepHoan: true,
      phiDoi: 0,
      phiHoan: 0,
    },
  });

  console.log('✅ Created fare families');

  // 9. Chuyến bay mẫu
  const vn210 = await prisma.chuyenBay.create({
    data: {
      hangId: vietnamAirlines.id,
      soHieuChuyenBay: 'VN210',
    },
  });

  const vj130 = await prisma.chuyenBay.create({
    data: {
      hangId: vietjetAir.id,
      soHieuChuyenBay: 'VJ130',
    },
  });

  const qh1201 = await prisma.chuyenBay.create({
    data: {
      hangId: bamboo.id,
      soHieuChuyenBay: 'QH1201',
    },
  });

  console.log('✅ Created flights');

  // 10. Chặng bay mẫu (SGN -> HAN)
  const tomorrow = new Date();
  tomorrow.setDate(tomorrow.getDate() + 1);
  tomorrow.setHours(8, 0, 0, 0);

  const changVN210 = await prisma.changBay.create({
    data: {
      chuyenBayId: vn210.id,
      thuTuChang: 1,
      sanBayDiId: sgn.id,
      sanBayDenId: han.id,
      gioDi: tomorrow,
      gioDen: new Date(tomorrow.getTime() + 2 * 60 * 60 * 1000),
      thoiGianBayPhut: 120,
    },
  });

  const changVJ130 = await prisma.changBay.create({
    data: {
      chuyenBayId: vj130.id,
      thuTuChang: 1,
      sanBayDiId: sgn.id,
      sanBayDenId: han.id,
      gioDi: new Date(tomorrow.getTime() + 2 * 60 * 60 * 1000),
      gioDen: new Date(tomorrow.getTime() + 4 * 60 * 60 * 1000),
      thoiGianBayPhut: 120,
    },
  });

  const changQH1201 = await prisma.changBay.create({
    data: {
      chuyenBayId: qh1201.id,
      thuTuChang: 1,
      sanBayDiId: sgn.id,
      sanBayDenId: han.id,
      gioDi: new Date(tomorrow.getTime() + 4 * 60 * 60 * 1000),
      gioDen: new Date(tomorrow.getTime() + 6 * 60 * 60 * 1000),
      thoiGianBayPhut: 120,
    },
  });

  console.log('✅ Created segments');

  // 11. Tồn chỗ
  await prisma.tonCho.create({
    data: {
      changBayId: changVN210.id,
      hangVeId: hangY.id,
      nhomGiaId: ecoSaver.id,
      tongSoCho: 150,
      soChoCon: 150,
      giaCoSo: 1500000,
      thue: 150000,
      phi: 50000,
    },
  });

  await prisma.tonCho.create({
    data: {
      changBayId: changVN210.id,
      hangVeId: hangY.id,
      nhomGiaId: ecoFlex.id,
      tongSoCho: 50,
      soChoCon: 50,
      giaCoSo: 2000000,
      thue: 200000,
      phi: 50000,
    },
  });

  await prisma.tonCho.create({
    data: {
      changBayId: changVJ130.id,
      hangVeId: hangY.id,
      nhomGiaId: ecoSaver.id,
      tongSoCho: 180,
      soChoCon: 180,
      giaCoSo: 1200000,
      thue: 120000,
      phi: 40000,
    },
  });

  await prisma.tonCho.create({
    data: {
      changBayId: changQH1201.id,
      hangVeId: hangY.id,
      nhomGiaId: ecoFlex.id,
      tongSoCho: 120,
      soChoCon: 120,
      giaCoSo: 1800000,
      thue: 180000,
      phi: 50000,
    },
  });

  console.log('✅ Created inventory');

  console.log('✅ Seeding completed successfully!');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
