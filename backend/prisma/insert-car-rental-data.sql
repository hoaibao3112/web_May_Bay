-- ============================
-- THÊM DỮ LIỆU MẪU CHO HỆ THỐNG CHO THUÊ XE
-- ============================

-- 1. Thêm Nhà cung cấp xe
INSERT INTO `nha_cung_cap_xe` (`maNhaCungCap`, `tenNhaCungCap`, `logo`, `soDienThoai`, `email`, `website`, `diaChi`, `moTa`, `danhGiaTrungBinh`, `soDanhGia`, `chinhSachHuy`, `chinhSachThanhToan`, `trangThai`) VALUES
('TRANSFERZ', 'Transferz', '/logos/transferz.png', '1900-1234', 'support@transferz.com', 'https://www.transferz.com', '123 Đường ABC, Quận 1, TP.HCM', 'Dịch vụ đưa đón sân bay hàng đầu Việt Nam với đội xe hiện đại và tài xế chuyên nghiệp', 9.2, 1247, 'Miễn phí hủy trong 24 giờ trước giờ đón. Phí hủy 50% nếu hủy trong vòng 12 giờ.', 'Thanh toán trực tuyến qua VNPAY, MoMo, ZaloPay hoặc thanh toán tiền mặt cho tài xế', 'HOAT_DONG'),
('GRAB', 'Grab Car', '/logos/grab.png', '1900-1515', 'support@grab.vn', 'https://www.grab.com/vn', '456 Đường XYZ, Quận 3, TP.HCM', 'Nền tảng gọi xe công nghệ số 1 Đông Nam Á', 8.8, 3521, 'Miễn phí hủy trong 5 phút sau khi đặt. Phí hủy 20.000đ sau thời gian này.', 'Thanh toán qua ví Grab, thẻ tín dụng hoặc tiền mặt', 'HOAT_DONG'),
('VIPTRANSFER', 'VIP Transfer', '/logos/viptransfer.png', '1900-6789', 'info@viptransfer.vn', 'https://www.viptransfer.vn', '789 Đường DEF, Quận 7, TP.HCM', 'Dịch vụ xe sang cao cấp, phục vụ khách hàng VIP và doanh nghiệp', 9.5, 856, 'Miễn phí hủy trong 48 giờ. Phí hủy 30% nếu hủy trong vòng 24 giờ.', 'Thanh toán trực tuyến hoặc chuyển khoản doanh nghiệp', 'HOAT_DONG');

-- 2. Thêm Loại xe
INSERT INTO `loai_xe_thue` (`maLoaiXe`, `tenLoaiXe`, `moTa`, `soHanhKhach`, `soHanhLy`, `hinhAnh`, `tienNghi`) VALUES
('SEDAN', 'Sedan (Standard)', 'Xe sedan 4 chỗ tiêu chuẩn, phù hợp cho cá nhân và gia đình nhỏ', 2, 3, '/cars/sedan.png', '["Điều hòa", "WiFi", "Nước uống", "Sạc điện thoại"]'),
('ECONOMY_SEDAN', 'Economy Sedan (Standard)', 'Xe sedan tiết kiệm, giá cả phải chăng', 2, 3, '/cars/economy-sedan.png', '["Điều hòa", "Nước uống"]'),
('MINIBUS', 'Minibus (Standard)', 'Xe 7-10 chỗ, phù hợp cho nhóm và gia đình lớn', 10, 14, '/cars/minibus.png', '["Điều hòa", "WiFi", "Nước uống", "Sạc điện thoại", "TV"]'),
('EXCLUSIVE_MINIVAN', 'Exclusive Minivan (Standard)', 'Xe minivan cao cấp với ghế da và tiện nghi sang trọng', 5, 5, '/cars/exclusive-minivan.png', '["Điều hòa", "WiFi", "Nước uống", "Sạc điện thoại", "Ghế massage", "Rèm che"]'),
('BUS', 'Bus (Standard)', 'Xe bus 16-29 chỗ, phù hợp cho đoàn du lịch', 14, 14, '/cars/bus.png', '["Điều hòa", "WiFi", "Nước uống", "Toilet", "Karaoke"]'),
('BUSINESS_SEDAN', 'Business Sedan (Standard)', 'Xe sedan hạng sang cho doanh nhân', 2, 3, '/cars/business-sedan.png', '["Điều hòa", "WiFi", "Nước uống", "Sạc điện thoại", "Báo", "Ghế da cao cấp"]'),
('SUV', 'SUV (Premium)', 'Xe SUV 7 chỗ cao cấp, rộng rãi và thoải mái', 6, 6, '/cars/suv.png', '["Điều hòa", "WiFi", "Nước uống", "Sạc điện thoại", "Cốp rộng"]'),
('LUXURY_SEDAN', 'Luxury Sedan (VIP)', 'Xe sedan hạng sang Mercedes, BMW, Audi', 3, 3, '/cars/luxury-sedan.png', '["Điều hòa", "WiFi", "Nước uống cao cấp", "Sạc điện thoại", "Ghế massage", "Hệ thống âm thanh cao cấp"]');

-- 3. Thêm Tuyến đường (giả sử ID sân bay: HAN=1, SGN=2, DAD=3)
INSERT INTO `tuyen_duong_thue_xe` (`maTuyen`, `diemDi`, `diemDen`, `diemDiId`, `khoangCach`, `thoiGianDuKien`, `moTa`, `trangThai`) VALUES
('HAN-HK', 'Sân bay Quốc tế Nội Bài (HAN)', 'Hồ Hoàn Kiếm', 1, 30.00, 45, 'Tuyến đưa đón từ sân bay Nội Bài về trung tâm Hà Nội', 'HOAT_DONG'),
('HAN-CG', 'Sân bay Quốc tế Nội Bài (HAN)', 'Cầu Giấy', 1, 25.00, 40, 'Tuyến đưa đón từ sân bay Nội Bài về quận Cầu Giấy', 'HOAT_DONG'),
('HAN-HD', 'Sân bay Quốc tế Nội Bài (HAN)', 'Hoàng Mai', 1, 35.00, 50, 'Tuyến đưa đón từ sân bay Nội Bài về quận Hoàng Mai', 'HOAT_DONG'),
('SGN-Q1', 'Sân bay Tân Sơn Nhất (SGN)', 'Quận 1', 2, 8.00, 20, 'Tuyến đưa đón từ sân bay Tân Sơn Nhất về Quận 1', 'HOAT_DONG'),
('SGN-Q7', 'Sân bay Tân Sơn Nhất (SGN)', 'Quận 7 - Phú Mỹ Hưng', 2, 15.00, 30, 'Tuyến đưa đón từ sân bay Tân Sơn Nhất về Quận 7', 'HOAT_DONG'),
('SGN-TD', 'Sân bay Tân Sơn Nhất (SGN)', 'Thủ Đức', 2, 20.00, 35, 'Tuyến đưa đón từ sân bay Tân Sơn Nhất về Thủ Đức', 'HOAT_DONG'),
('DAD-HC', 'Sân bay Quốc tế Đà Nẵng (DAD)', 'Hải Châu', 3, 5.00, 15, 'Tuyến đưa đón từ sân bay Đà Nẵng về quận Hải Châu', 'HOAT_DONG'),
('DAD-SB', 'Sân bay Quốc tế Đà Nẵng (DAD)', 'Sơn Trà - Bãi biển Mỹ Khê', 3, 7.00, 18, 'Tuyến đưa đón từ sân bay Đà Nẵng về bãi biển Mỹ Khê', 'HOAT_DONG'),
('DAD-HA', 'Sân bay Quốc tế Đà Nẵng (DAD)', 'Hội An', 3, 30.00, 40, 'Tuyến đưa đón từ sân bay Đà Nẵng về phố cổ Hội An', 'HOAT_DONG');

-- 4. Thêm Xe (giả sử ID nhà cung cấp: Transferz=1, Grab=2, VIP=3 và ID loại xe tương ứng)
INSERT INTO `xe_thue` (`nhaCungCapId`, `loaiXeId`, `bienSoXe`, `mauXe`, `namSanXuat`, `soHanhKhach`, `soHanhLy`, `hinhAnh`, `trangThai`) VALUES
-- Transferz
(1, 1, '30A-12345', 'Trắng', 2023, 2, 3, '["/cars/car1.jpg", "/cars/car2.jpg"]', 'SAN_SANG'),
(1, 1, '30A-12346', 'Đen', 2023, 2, 3, '["/cars/car1.jpg", "/cars/car2.jpg"]', 'SAN_SANG'),
(1, 2, '30A-12347', 'Bạc', 2022, 2, 3, '["/cars/car1.jpg", "/cars/car2.jpg"]', 'SAN_SANG'),
(1, 3, '30A-12348', 'Trắng', 2023, 10, 14, '["/cars/car1.jpg", "/cars/car2.jpg"]', 'SAN_SANG'),
(1, 3, '30A-12349', 'Xám', 2024, 10, 14, '["/cars/car1.jpg", "/cars/car2.jpg"]', 'SAN_SANG'),
(1, 5, '30A-12350', 'Trắng', 2023, 14, 14, '["/cars/car1.jpg", "/cars/car2.jpg"]', 'SAN_SANG'),
-- Grab
(2, 1, '51A-56789', 'Đen', 2022, 2, 3, '["/cars/car1.jpg", "/cars/car2.jpg"]', 'SAN_SANG'),
(2, 1, '51A-56790', 'Trắng', 2023, 2, 3, '["/cars/car1.jpg", "/cars/car2.jpg"]', 'SAN_SANG'),
(2, 7, '51A-56791', 'Đỏ', 2024, 6, 6, '["/cars/car1.jpg", "/cars/car2.jpg"]', 'SAN_SANG'),
(2, 7, '51A-56792', 'Xanh', 2023, 6, 6, '["/cars/car1.jpg", "/cars/car2.jpg"]', 'SAN_SANG'),
-- VIP Transfer
(3, 8, '51G-88888', 'Đen', 2024, 3, 3, '["/cars/car1.jpg", "/cars/car2.jpg"]', 'SAN_SANG'),
(3, 8, '51G-88889', 'Trắng', 2024, 3, 3, '["/cars/car1.jpg", "/cars/car2.jpg"]', 'SAN_SANG'),
(3, 6, '51G-88890', 'Xám', 2024, 2, 3, '["/cars/car1.jpg", "/cars/car2.jpg"]', 'SAN_SANG'),
(3, 4, '51G-88891', 'Đen', 2024, 5, 5, '["/cars/car1.jpg", "/cars/car2.jpg"]', 'SAN_SANG');

-- 5. Thêm Giá thuê xe
-- Transferz - Sedan (loaiXeId=1) cho tất cả tuyến
INSERT INTO `gia_thue_xe` (`nhaCungCapId`, `loaiXeId`, `tuyenDuongId`, `giaTheoGio`, `giaTheoNgay`, `giaTheoTuyen`, `donViTienTe`, `giamGia`, `phuThu`, `apDungTu`, `apDungDen`, `trangThai`) VALUES
(1, 1, 1, 210298, 1682384, 420596, 'VND', 0, '{"night": 50000, "airport": 30000, "holiday": 100000}', '2026-01-01', '2026-12-31', 'HOAT_DONG'),
(1, 1, 2, 175497, 1403976, 350994, 'VND', 0, '{"night": 50000, "airport": 30000, "holiday": 100000}', '2026-01-01', '2026-12-31', 'HOAT_DONG'),
(1, 1, 3, 245695, 1965560, 491390, 'VND', 0, '{"night": 50000, "airport": 30000, "holiday": 100000}', '2026-01-01', '2026-12-31', 'HOAT_DONG'),
(1, 1, 4, 112159, 897272, 224318, 'VND', 0, '{"night": 50000, "airport": 30000, "holiday": 100000}', '2026-01-01', '2026-12-31', 'HOAT_DONG'),
(1, 1, 5, 210298, 1682384, 420596, 'VND', 0, '{"night": 50000, "airport": 30000, "holiday": 100000}', '2026-01-01', '2026-12-31', 'HOAT_DONG'),
(1, 1, 6, 280397, 2243176, 560794, 'VND', 0, '{"night": 50000, "airport": 30000, "holiday": 100000}', '2026-01-01', '2026-12-31', 'HOAT_DONG'),
(1, 1, 7, 70099, 560792, 140198, 'VND', 0, '{"night": 50000, "airport": 30000, "holiday": 100000}', '2026-01-01', '2026-12-31', 'HOAT_DONG'),
(1, 1, 8, 98139, 785112, 196278, 'VND', 0, '{"night": 50000, "airport": 30000, "holiday": 100000}', '2026-01-01', '2026-12-31', 'HOAT_DONG'),
(1, 1, 9, 420596, 3364768, 841192, 'VND', 0, '{"night": 50000, "airport": 30000, "holiday": 100000}', '2026-01-01', '2026-12-31', 'HOAT_DONG');

-- Transferz - Economy Sedan (loaiXeId=2)
INSERT INTO `gia_thue_xe` (`nhaCungCapId`, `loaiXeId`, `tuyenDuongId`, `giaTheoGio`, `giaTheoNgay`, `giaTheoTuyen`, `donViTienTe`, `giamGia`, `phuThu`, `apDungTu`, `apDungDen`, `trangThai`) VALUES
(1, 2, 1, 240738, 1925904, 481476, 'VND', 0, '{"night": 50000, "airport": 30000, "holiday": 100000}', '2026-01-01', '2026-12-31', 'HOAT_DONG'),
(1, 2, 2, 200615, 1604920, 401230, 'VND', 0, '{"night": 50000, "airport": 30000, "holiday": 100000}', '2026-01-01', '2026-12-31', 'HOAT_DONG'),
(1, 2, 3, 280861, 2246888, 561722, 'VND', 0, '{"night": 50000, "airport": 30000, "holiday": 100000}', '2026-01-01', '2026-12-31', 'HOAT_DONG');

-- Transferz - Minibus (loaiXeId=3)
INSERT INTO `gia_thue_xe` (`nhaCungCapId`, `loaiXeId`, `tuyenDuongId`, `giaTheoGio`, `giaTheoNgay`, `giaTheoTuyen`, `donViTienTe`, `giamGia`, `phuThu`, `apDungTu`, `apDungDen`, `trangThai`) VALUES
(1, 3, 1, 362035, 2896280, 724069, 'VND', 0, '{"night": 50000, "airport": 30000, "holiday": 100000}', '2026-01-01', '2026-12-31', 'HOAT_DONG'),
(1, 3, 2, 301696, 2413568, 603391, 'VND', 0, '{"night": 50000, "airport": 30000, "holiday": 100000}', '2026-01-01', '2026-12-31', 'HOAT_DONG'),
(1, 3, 3, 422374, 3378992, 844747, 'VND', 0, '{"night": 50000, "airport": 30000, "holiday": 100000}', '2026-01-01', '2026-12-31', 'HOAT_DONG');

-- Transferz - Bus (loaiXeId=5)
INSERT INTO `gia_thue_xe` (`nhaCungCapId`, `loaiXeId`, `tuyenDuongId`, `giaTheoGio`, `giaTheoNgay`, `giaTheoTuyen`, `donViTienTe`, `giamGia`, `phuThu`, `apDungTu`, `apDungDen`, `trangThai`) VALUES
(1, 5, 1, 418897, 3351176, 837794, 'VND', 0, '{"night": 50000, "airport": 30000, "holiday": 100000}', '2026-01-01', '2026-12-31', 'HOAT_DONG'),
(1, 5, 4, 223572, 1788576, 447144, 'VND', 0, '{"night": 50000, "airport": 30000, "holiday": 100000}', '2026-01-01', '2026-12-31', 'HOAT_DONG');

-- Grab - Sedan (loaiXeId=1)
INSERT INTO `gia_thue_xe` (`nhaCungCapId`, `loaiXeId`, `tuyenDuongId`, `giaTheoGio`, `giaTheoNgay`, `giaTheoTuyen`, `donViTienTe`, `giamGia`, `phuThu`, `apDungTu`, `apDungDen`, `trangThai`) VALUES
(2, 1, 1, 190000, 1520000, 380000, 'VND', 0, '{"night": 50000, "airport": 30000, "holiday": 100000}', '2026-01-01', '2026-12-31', 'HOAT_DONG'),
(2, 1, 4, 101333, 810664, 202666, 'VND', 0, '{"night": 50000, "airport": 30000, "holiday": 100000}', '2026-01-01', '2026-12-31', 'HOAT_DONG'),
(2, 1, 7, 63333, 506664, 126666, 'VND', 0, '{"night": 50000, "airport": 30000, "holiday": 100000}', '2026-01-01', '2026-12-31', 'HOAT_DONG');

-- Grab - Economy Sedan (loaiXeId=2)
INSERT INTO `gia_thue_xe` (`nhaCungCapId`, `loaiXeId`, `tuyenDuongId`, `giaTheoGio`, `giaTheoNgay`, `giaTheoTuyen`, `donViTienTe`, `giamGia`, `phuThu`, `apDungTu`, `apDungDen`, `trangThai`) VALUES
(2, 2, 1, 175000, 1400000, 350000, 'VND', 0, '{"night": 50000, "airport": 30000, "holiday": 100000}', '2026-01-01', '2026-12-31', 'HOAT_DONG'),
(2, 2, 4, 93333, 746664, 186666, 'VND', 0, '{"night": 50000, "airport": 30000, "holiday": 100000}', '2026-01-01', '2026-12-31', 'HOAT_DONG');

-- Grab - SUV (loaiXeId=7)
INSERT INTO `gia_thue_xe` (`nhaCungCapId`, `loaiXeId`, `tuyenDuongId`, `giaTheoGio`, `giaTheoNgay`, `giaTheoTuyen`, `donViTienTe`, `giamGia`, `phuThu`, `apDungTu`, `apDungDen`, `trangThai`) VALUES
(2, 7, 1, 325000, 2600000, 650000, 'VND', 0, '{"night": 50000, "airport": 30000, "holiday": 100000}', '2026-01-01', '2026-12-31', 'HOAT_DONG'),
(2, 7, 4, 173333, 1386664, 346666, 'VND', 0, '{"night": 50000, "airport": 30000, "holiday": 100000}', '2026-01-01', '2026-12-31', 'HOAT_DONG');

-- VIP Transfer - Business Sedan (loaiXeId=6)
INSERT INTO `gia_thue_xe` (`nhaCungCapId`, `loaiXeId`, `tuyenDuongId`, `giaTheoGio`, `giaTheoNgay`, `giaTheoTuyen`, `donViTienTe`, `giamGia`, `phuThu`, `apDungTu`, `apDungDen`, `trangThai`) VALUES
(3, 6, 1, 600000, 4800000, 1200000, 'VND', 0, '{"night": 100000, "airport": 50000, "holiday": 200000}', '2026-01-01', '2026-12-31', 'HOAT_DONG'),
(3, 6, 4, 320000, 2560000, 640000, 'VND', 0, '{"night": 100000, "airport": 50000, "holiday": 200000}', '2026-01-01', '2026-12-31', 'HOAT_DONG'),
(3, 6, 7, 200000, 1600000, 400000, 'VND', 0, '{"night": 100000, "airport": 50000, "holiday": 200000}', '2026-01-01', '2026-12-31', 'HOAT_DONG');

-- VIP Transfer - Luxury Sedan (loaiXeId=8)
INSERT INTO `gia_thue_xe` (`nhaCungCapId`, `loaiXeId`, `tuyenDuongId`, `giaTheoGio`, `giaTheoNgay`, `giaTheoTuyen`, `donViTienTe`, `giamGia`, `phuThu`, `apDungTu`, `apDungDen`, `trangThai`) VALUES
(3, 8, 1, 900000, 7200000, 1800000, 'VND', 0, '{"night": 150000, "airport": 100000, "holiday": 300000}', '2026-01-01', '2026-12-31', 'HOAT_DONG'),
(3, 8, 4, 480000, 3840000, 960000, 'VND', 0, '{"night": 150000, "airport": 100000, "holiday": 300000}', '2026-01-01', '2026-12-31', 'HOAT_DONG'),
(3, 8, 7, 300000, 2400000, 600000, 'VND', 0, '{"night": 150000, "airport": 100000, "holiday": 300000}', '2026-01-01', '2026-12-31', 'HOAT_DONG');

-- VIP Transfer - Exclusive Minivan (loaiXeId=4)
INSERT INTO `gia_thue_xe` (`nhaCungCapId`, `loaiXeId`, `tuyenDuongId`, `giaTheoGio`, `giaTheoNgay`, `giaTheoTuyen`, `donViTienTe`, `giamGia`, `phuThu`, `apDungTu`, `apDungDen`, `trangThai`) VALUES
(3, 4, 1, 475000, 3800000, 950000, 'VND', 0, '{"night": 100000, "airport": 50000, "holiday": 200000}', '2026-01-01', '2026-12-31', 'HOAT_DONG'),
(3, 4, 4, 253333, 2026664, 506666, 'VND', 0, '{"night": 100000, "airport": 50000, "holiday": 200000}', '2026-01-01', '2026-12-31', 'HOAT_DONG');
