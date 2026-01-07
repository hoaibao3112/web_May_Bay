-- Sample data for Car Rental System
-- Run this after creating the car rental tables

-- Insert sample car rental companies (Nhà cung cấp xe)
INSERT INTO `nha_cung_cap_xe` (`maNhaCungCap`, `tenNhaCungCap`, `logo`, `soDienThoai`, `email`, `website`, `diaChi`, `moTa`, `danhGiaTrungBinh`, `soDanhGia`, `chinhSachHuy`, `chinhSachThanhToan`, `trangThai`) VALUES
('5G', '5G Transfer', 'https://example.com/5g-logo.png', '0901234567', 'contact@5gtransfer.vn', 'https://5gtransfer.vn', 'Hà Nội', 'Dịch vụ đưa đón sân bay cao cấp', 4.8, 1247, 'Miễn phí hủy trước 24h', 'Thanh toán khi nhận xe', 'HOAT_DONG'),
('TUKCAR', 'Tuk Car', 'https://example.com/tukcar-logo.png', '0912345678', 'info@tukcar.vn', 'https://tukcar.vn', 'TP.HCM', 'Dịch vụ thuê xe tự lái uy tín', 4.5, 892, 'Phí hủy 20% sau 12h', 'Thanh toán trực tuyến', 'HOAT_DONG'),
('TRANSFERZ', 'Transferz.vn', 'https://example.com/transferz-logo.png', '0923456789', 'support@transferz.vn', 'https://transferz.vn', 'Đà Nẵng', 'Chuyên đưa đón sân bay và thuê xe theo tuyến', 4.7, 654, 'Miễn phí hủy trước 6h', 'Thanh toán linh hoạt', 'HOAT_DONG'),
('SYDCAR', 'Syd Car Rental', 'https://example.com/sydcar-logo.png', '0934567890', 'hello@sydcar.vn', 'https://sydcar.vn', 'Hà Nội', 'Cho thuê xe cao cấp', 4.9, 423, 'Miễn phí hủy trước 48h', 'Thanh toán khi nhận xe', 'HOAT_DONG');

-- Insert car types (Loại xe thuê)
INSERT INTO `loai_xe_thue` (`maLoaiXe`, `tenLoaiXe`, `moTa`, `soHanhKhach`, `soHanhLy`, `hinhAnh`, `tienNghi`) VALUES
('ECONOMY_SEDAN', 'Sedan (Standard)', 'Xe sedan tiêu chuẩn, phù hợp cho gia đình nhỏ', 4, 2, 'https://example.com/sedan.jpg', '{"wifi": true, "dieuHoa": true, "bluetooth": true}'),
('PREMIUM_SEDAN', 'Sedan (Tiêu chuẩn)', 'Xe sedan cao cấp, thoải mái', 4, 3, 'https://example.com/premium-sedan.jpg', '{"wifi": true, "dieuHoa": true, "bluetooth": true, "gheDa": true}'),
('MPV_7SEAT', 'MPV 4 Seater (Standard)', 'Xe MPV 7 chỗ, rộng rãi', 7, 4, 'https://example.com/mpv.jpg', '{"wifi": true, "dieuHoa": true, "bluetooth": true, "usb": true}'),
('SUV_7SEAT', 'SUV 4 Seater (Standard)', 'Xe SUV 7 chỗ, mạnh mẽ', 7, 5, 'https://example.com/suv.jpg', '{"wifi": true, "dieuHoa": true, "bluetooth": true, "camera360": true}'),
('MINIBUS_16SEAT', 'Minibus 16 Seater', 'Xe 16 chỗ cho nhóm lớn', 16, 10, 'https://example.com/minibus.jpg', '{"wifi": true, "dieuHoa": true, "tivi": true}');

-- Insert sample vehicles (Xe thuê)
INSERT INTO `xe_thue` (`nhaCungCapId`, `loaiXeId`, `bienSoXe`, `mauXe`, `namSanXuat`, `soHanhKhach`, `soHanhLy`, `hinhAnh`, `trangThai`) VALUES
(1, 1, '30A-12345', 'Trắng', 2022, 4, 2, 'https://example.com/car1.jpg', 'SAN_SANG'),
(1, 2, '30A-23456', 'Đen', 2023, 4, 3, 'https://example.com/car2.jpg', 'SAN_SANG'),
(2, 3, '51G-34567', 'Bạc', 2022, 7, 4, 'https://example.com/car3.jpg', 'SAN_SANG'),
(2, 4, '51G-45678', 'Xám', 2023, 7, 5, 'https://example.com/car4.jpg', 'SAN_SANG'),
(3, 1, '43A-56789', 'Trắng', 2021, 4, 2, 'https://example.com/car5.jpg', 'SAN_SANG'),
(3, 5, '43A-67890', 'Trắng', 2022, 16, 10, 'https://example.com/car6.jpg', 'SAN_SANG'),
(4, 2, '30B-11111', 'Đen', 2024, 4, 3, 'https://example.com/car7.jpg', 'SAN_SANG'),
(4, 3, '30B-22222', 'Xanh', 2023, 7, 4, 'https://example.com/car8.jpg', 'SAN_SANG');

-- Insert routes (Tuyến đường thuê xe)
INSERT INTO `tuyen_duong_thue_xe` (`maTuyen`, `diemDi`, `diemDen`, `diemDiId`, `khoangCach`, `thoiGianDuKien`, `moTa`, `trangThai`) VALUES
('HAN-HN', 'Sân bay quốc tế Nội Bài (HAN)', 'Hồ Hoàn Kiếm', 2, 35.5, 45, 'Đưa đón từ sân bay Nội Bài về trung tâm Hà Nội', 'HOAT_DONG'),
('HAN-HL', 'Sân bay quốc tế Nội Bài (HAN)', 'Hạ Long', 2, 165.0, 180, 'Đưa đón từ sân bay Nội Bài đến Hạ Long', 'HOAT_DONG'),
('SGN-Q1', 'Sân bay quốc tế Tân Sơn Nhất (SGN)', 'Quận 1', 1, 8.5, 25, 'Đưa đón từ sân bay Tân Sơn Nhất về trung tâm TP.HCM', 'HOAT_DONG'),
('SGN-VT', 'Sân bay quốc tế Tân Sơn Nhất (SGN)', 'Vũng Tàu', 1, 125.0, 150, 'Đưa đón từ sân bay Tân Sơn Nhất đến Vũng Tàu', 'HOAT_DONG'),
('DAD-HO', 'Sân bay quốc tế Đà Nẵng (DAD)', 'Hội An', 3, 30.0, 40, 'Đưa đón từ sân bay Đà Nẵng đến Hội An', 'HOAT_DONG'),
('DAD-HU', 'Sân bay quốc tế Đà Nẵng (DAD)', 'Huế', 3, 95.0, 120, 'Đưa đón từ sân bay Đà Nẵng đến Huế', 'HOAT_DONG');

-- Insert pricing (Giá thuê xe)
INSERT INTO `gia_thue_xe` (`nhaCungCapId`, `loaiXeId`, `tuyenDuongId`, `giaTheoGio`, `giaTheoNgay`, `giaTheoTuyen`, `donViTienTe`, `giamGia`, `phuThu`, `apDungTu`, `apDungDen`, `trangThai`) VALUES
-- 5G Transfer - Nội Bài routes
(1, 1, 1, NULL, NULL, 279400, 'VND', 0, '{"night": 50000, "airport": 0, "holiday": 30000}', '2026-01-01', '2026-12-31', 'HOAT_DONG'),
(1, 2, 1, NULL, NULL, 316923, 'VND', 0, '{"night": 50000, "airport": 0, "holiday": 30000}', '2026-01-01', '2026-12-31', 'HOAT_DONG'),
(1, 3, 1, NULL, NULL, 325120, 'VND', 0, '{"night": 50000, "airport": 0, "holiday": 30000}', '2026-01-01', '2026-12-31', 'HOAT_DONG'),
(1, 4, 1, NULL, NULL, 325120, 'VND', 0, '{"night": 50000, "airport": 0, "holiday": 30000}', '2026-01-01', '2026-12-31', 'HOAT_DONG'),
(1, 1, 2, NULL, NULL, 1200000, 'VND', 50000, '{"night": 100000, "airport": 0, "holiday": 80000}', '2026-01-01', '2026-12-31', 'HOAT_DONG'),
(1, 3, 2, NULL, NULL, 1500000, 'VND', 100000, '{"night": 100000, "airport": 0, "holiday": 80000}', '2026-01-01', '2026-12-31', 'HOAT_DONG'),

-- Tuk Car - Tân Sơn Nhất routes
(2, 1, 3, NULL, NULL, 180000, 'VND', 0, '{"night": 40000, "airport": 0, "holiday": 25000}', '2026-01-01', '2026-12-31', 'HOAT_DONG'),
(2, 2, 3, NULL, NULL, 220000, 'VND', 0, '{"night": 40000, "airport": 0, "holiday": 25000}', '2026-01-01', '2026-12-31', 'HOAT_DONG'),
(2, 3, 3, NULL, NULL, 280000, 'VND', 0, '{"night": 40000, "airport": 0, "holiday": 25000}', '2026-01-01', '2026-12-31', 'HOAT_DONG'),
(2, 4, 3, NULL, NULL, 320000, 'VND', 0, '{"night": 40000, "airport": 0, "holiday": 25000}', '2026-01-01', '2026-12-31', 'HOAT_DONG'),
(2, 3, 4, NULL, NULL, 1100000, 'VND', 80000, '{"night": 80000, "airport": 0, "holiday": 60000}', '2026-01-01', '2026-12-31', 'HOAT_DONG'),
(2, 4, 4, NULL, NULL, 1300000, 'VND', 100000, '{"night": 80000, "airport": 0, "holiday": 60000}', '2026-01-01', '2026-12-31', 'HOAT_DONG'),

-- Transferz - Đà Nẵng routes
(3, 1, 5, NULL, NULL, 250000, 'VND', 0, '{"night": 40000, "airport": 0, "holiday": 30000}', '2026-01-01', '2026-12-31', 'HOAT_DONG'),
(3, 2, 5, NULL, NULL, 300000, 'VND', 0, '{"night": 40000, "airport": 0, "holiday": 30000}', '2026-01-01', '2026-12-31', 'HOAT_DONG'),
(3, 3, 5, NULL, NULL, 350000, 'VND', 0, '{"night": 40000, "airport": 0, "holiday": 30000}', '2026-01-01', '2026-12-31', 'HOAT_DONG'),
(3, 1, 6, NULL, NULL, 800000, 'VND', 50000, '{"night": 60000, "airport": 0, "holiday": 50000}', '2026-01-01', '2026-12-31', 'HOAT_DONG'),
(3, 5, 6, NULL, NULL, 1500000, 'VND', 100000, '{"night": 100000, "airport": 0, "holiday": 80000}', '2026-01-01', '2026-12-31', 'HOAT_DONG'),

-- Syd Car - Premium options
(4, 2, 1, NULL, NULL, 400324, 'VND', 0, '{"night": 60000, "airport": 0, "holiday": 40000}', '2026-01-01', '2026-12-31', 'HOAT_DONG'),
(4, 3, 1, NULL, NULL, 412870, 'VND', 0, '{"night": 60000, "airport": 0, "holiday": 40000}', '2026-01-01', '2026-12-31', 'HOAT_DONG'),
(4, 2, 3, NULL, NULL, 360852, 'VND', 0, '{"night": 50000, "airport": 0, "holiday": 35000}', '2026-01-01', '2026-12-31', 'HOAT_DONG'),
(4, 3, 3, NULL, NULL, 400324, 'VND', 0, '{"night": 50000, "airport": 0, "holiday": 35000}', '2026-01-01', '2026-12-31', 'HOAT_DONG');

-- Add some hourly and daily rates for flexible rentals
INSERT INTO `gia_thue_xe` (`nhaCungCapId`, `loaiXeId`, `tuyenDuongId`, `giaTheoGio`, `giaTheoNgay`, `giaTheoTuyen`, `donViTienTe`, `giamGia`, `phuThu`, `apDungTu`, `apDungDen`, `trangThai`) VALUES
(1, 1, NULL, 150000, 1200000, NULL, 'VND', 0, '{"night": 30000, "holiday": 50000}', '2026-01-01', '2026-12-31', 'HOAT_DONG'),
(1, 2, NULL, 200000, 1600000, NULL, 'VND', 0, '{"night": 40000, "holiday": 60000}', '2026-01-01', '2026-12-31', 'HOAT_DONG'),
(2, 3, NULL, 250000, 2000000, NULL, 'VND', 0, '{"night": 50000, "holiday": 80000}', '2026-01-01', '2026-12-31', 'HOAT_DONG'),
(2, 4, NULL, 300000, 2400000, NULL, 'VND', 0, '{"night": 60000, "holiday": 100000}', '2026-01-01', '2026-12-31', 'HOAT_DONG'),
(3, 1, NULL, 140000, 1100000, NULL, 'VND', 0, '{"night": 30000, "holiday": 50000}', '2026-01-01', '2026-12-31', 'HOAT_DONG'),
(4, 2, NULL, 220000, 1800000, NULL, 'VND', 0, '{"night": 50000, "holiday": 70000}', '2026-01-01', '2026-12-31', 'HOAT_DONG');

COMMIT;
