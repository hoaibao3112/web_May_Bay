-- =====================================================
-- Sample Data for Bus Booking System
-- =====================================================

-- 1. Insert data into nha_xe (Bus Companies)
INSERT INTO `nha_xe` (`maNhaXe`, `tenNhaXe`, `logo`, `soDienThoai`, `email`, `diaChi`, `moTa`, `danhGiaTrungBinh`, `trangThai`, `updatedAt`) VALUES
('NX001', 'Phương Trang - FUTA Bus Lines', 'https://futabus.vn/images/logo.png', '02838386852', 'hotro@futa.vn', '272 Đường 3 Tháng 2, Phường 12, Quận 10, TP.HCM', 'Công ty vận tải hành khách hàng đầu Việt Nam với hơn 60 năm kinh nghiệm', 4.5, 'HOAT_DONG', NOW()),
('NX002', 'Xe Khách Thành Bưởi', 'https://thanhbuoi.vn/logo.png', '02838386888', 'info@thanhbuoi.vn', '395 Điện Biên Phủ, Phường 4, Quận 3, TP.HCM', 'Nhà xe uy tín với mạng lưới tuyến đường rộng khắp', 4.3, 'HOAT_DONG', NOW()),
('NX003', 'Mai Linh Express', 'https://mailinexpress.vn/logo.png', '1900545445', 'support@mailinexpress.vn', '18 Lý Thường Kiệt, Phường Bến Thành, Quận 1, TP.HCM', 'Dịch vụ xe khách cao cấp của tập đoàn Mai Linh', 4.4, 'HOAT_DONG', NOW()),
('NX004', 'Xe Kumho Samco', 'https://kumhosamco.vn/logo.png', '02838386868', 'cskh@kumhosamco.vn', 'Bến xe Miền Đông, Quận Bình Thạnh, TP.HCM', 'Liên doanh Việt - Hàn chuyên tuyến cao cấp', 4.6, 'HOAT_DONG', NOW()),
('NX005', 'Xe Phương Nam', 'https://phuongnam.vn/logo.png', '02838386789', 'contact@phuongnam.vn', '272 Đường 3 Tháng 2, Phường 12, Quận 10, TP.HCM', 'Nhà xe lâu đời phục vụ tuyến Nam Bộ', 4.2, 'HOAT_DONG', NOW()),
('NX006', 'Xe Hoàng Long', 'https://hoanglong.vn/logo.png', '1900232329', 'info@hoanglong.vn', '18 Nguyễn Hoàng, Phường Mỹ Đình 2, Quận Nam Từ Liêm, Hà Nội', 'Nhà xe chuyên tuyến Hà Nội - Hải Phòng - Quảng Ninh', 4.5, 'HOAT_DONG', NOW()),
('NX007', 'Xe Hà Lan', 'https://halan.vn/logo.png', '02438386999', 'booking@halan.vn', 'Bến xe Giáp Bát, Quận Hoàng Mai, Hà Nội', 'Phục vụ các tuyến từ Hà Nội đi các tỉnh miền Bắc', 4.1, 'HOAT_DONG', NOW()),
('NX008', 'Xe Thế Phương', 'https://thephuong.vn/logo.png', '02838386777', 'hotline@thephuong.vn', 'Bến xe Miền Tây, Quận Bình Tân, TP.HCM', 'Chuyên tuyến Sài Gòn - Đồng bằng sông Cửu Long', 4.0, 'HOAT_DONG', NOW()),
('NX009', 'Xe Hải Vân', 'https://haivan.vn/logo.png', '02363836888', 'support@haivan.vn', '123 Hùng Vương, Quận Hải Châu, Đà Nẵng', 'Nhà xe uy tín tại miền Trung', 4.3, 'HOAT_DONG', NOW()),
('NX010', 'Xe Quốc Tuấn', 'https://quoctuan.vn/logo.png', '02838386666', 'info@quoctuan.vn', 'Bến xe Miền Đông, Quận Bình Thạnh, TP.HCM', 'Phục vụ tuyến Sài Gòn - Nha Trang - Đà Lạt', 4.4, 'HOAT_DONG', NOW());

-- 2. Insert data into ben_xe (Bus Stations)
INSERT INTO `ben_xe` (`maBenXe`, `tenBenXe`, `thanhPho`, `diaChi`, `khuVuc`, `soDienThoai`, `viDo`, `kinhDo`, `trangThai`, `updatedAt`) VALUES
('BX001', 'Bến xe Miền Đông', 'TP.HCM', '292 Đinh Bộ Lĩnh, Phường 26, Quận Bình Thạnh', 'Miền Nam', '02838386888', 10.8142, 106.7106, 'HOAT_DONG', NOW()),
('BX002', 'Bến xe Miền Tây', 'TP.HCM', 'Đường Kinh Dương Vương, Phường An Lạc, Quận Bình Tân', 'Miền Nam', '02838386999', 10.7387, 106.6078, 'HOAT_DONG', NOW()),
('BX003', 'Bến xe Miền Đông Mới', 'TP.HCM', 'Đường Quốc lộ 1A, Phường Tân Phú, Quận 9', 'Miền Nam', '02838386777', 10.8456, 106.8234, 'HOAT_DONG', NOW()),
('BX004', 'Bến xe Giáp Bát', 'Hà Nội', 'Đường Giải Phóng, Phường Giáp Bát, Quận Hoàng Mai', 'Miền Bắc', '02438386888', 20.9967, 105.8345, 'HOAT_DONG', NOW()),
('BX005', 'Bến xe Mỹ Đình', 'Hà Nội', 'Đường Phạm Hùng, Phường Mỹ Đình 2, Quận Nam Từ Liêm', 'Miền Bắc', '02438386999', 21.0285, 105.7801, 'HOAT_DONG', NOW()),
('BX006', 'Bến xe Nước Ngầm', 'Hà Nội', 'Đường Nguyễn Văn Linh, Phường Gia Thụy, Quận Long Biên', 'Miền Bắc', '02438386777', 21.0453, 105.8667, 'HOAT_DONG', NOW()),
('BX007', 'Bến xe Đà Nẵng', 'Đà Nẵng', '201 Tôn Đức Thắng, Quận Liên Chiểu', 'Miền Trung', '02363836888', 16.0544, 108.1770, 'HOAT_DONG', NOW()),
('BX008', 'Bến xe Nha Trang', 'Nha Trang', '23 Tháng 10, Phường Phước Long, TP Nha Trang', 'Miền Trung', '02583836888', 12.2388, 109.1967, 'HOAT_DONG', NOW()),
('BX009', 'Bến xe Đà Lạt', 'Đà Lạt', '1 Tô Hiến Thành, Phường 3, TP Đà Lạt', 'Miền Trung', '02633836888', 11.9404, 108.4583, 'HOAT_DONG', NOW()),
('BX010', 'Bến xe Cần Thơ', 'Cần Thơ', 'Đường Nguyễn Văn Linh, Phường An Khánh, Quận Ninh Kiều', 'Miền Nam', '02923836888', 10.0452, 105.7469, 'HOAT_DONG', NOW()),
('BX011', 'Bến xe Vũng Tàu', 'Vũng Tàu', '192 Nam Kỳ Khởi Nghĩa, Phường 7, TP Vũng Tàu', 'Miền Nam', '02543836888', 10.3460, 107.0843, 'HOAT_DONG', NOW()),
('BX012', 'Bến xe Huế', 'Huế', 'Đường An Dương Vương, Phường An Cựu, TP Huế', 'Miền Trung', '02343836888', 16.4637, 107.5909, 'HOAT_DONG', NOW()),
('BX013', 'Bến xe Hải Phòng', 'Hải Phòng', 'Đường Lê Thánh Tông, Quận Ngô Quyền', 'Miền Bắc', '02253836888', 20.8449, 106.6881, 'HOAT_DONG', NOW()),
('BX014', 'Bến xe Quy Nhơn', 'Quy Nhơn', 'Đường Tây Sơn, Phường Trần Phú, TP Quy Nhơn', 'Miền Trung', '02563836888', 13.7830, 109.2196, 'HOAT_DONG', NOW()),
('BX015', 'Bến xe Phan Thiết', 'Phan Thiết', 'Đường Trần Hưng Đạo, Phường Phú Thủy, TP Phan Thiết', 'Miền Nam', '02523836888', 10.9280, 108.1020, 'HOAT_DONG', NOW());

-- 3. Insert data into loai_xe (Bus Types)
INSERT INTO `loai_xe` (`maLoaiXe`, `tenLoaiXe`, `moTa`, `soGhe`, `soTang`, `tienNghi`, `updatedAt`) VALUES
('LX001', 'Ghế ngồi 45 chỗ', 'Xe giường nằm cao cấp 2 tầng', 45, 2, '{"wifi": true, "dieuHoa": true, "nuocUong": true, "toilet": false, "tivi": true, "socSac": true}', NOW()),
('LX002', 'Giường nằm 40 chỗ', 'Xe giường nằm 2 tầng tiện nghi', 40, 2, '{"wifi": true, "dieuHoa": true, "nuocUong": true, "toilet": true, "tivi": true, "socSac": true, "chanGa": true}', NOW()),
('LX003', 'Limousine 24 chỗ', 'Xe limousine cao cấp ghế massage', 24, 1, '{"wifi": true, "dieuHoa": true, "nuocUong": true, "toilet": true, "tivi": true, "socSac": true, "gheMassage": true, "chanGa": true}', NOW()),
('LX004', 'Limousine 34 chỗ', 'Xe limousine giường nằm 2 tầng', 34, 2, '{"wifi": true, "dieuHoa": true, "nuocUong": true, "toilet": true, "tivi": true, "socSac": true, "gheMassage": true}', NOW()),
('LX005', 'Ghế ngồi 29 chỗ', 'Xe ghế ngồi cao cấp 1 tầng', 29, 1, '{"wifi": true, "dieuHoa": true, "nuocUong": true, "toilet": false, "tivi": true, "socSac": true}', NOW()),
('LX006', 'Giường nằm 36 chỗ', 'Xe giường nằm VIP 2 tầng', 36, 2, '{"wifi": true, "dieuHoa": true, "nuocUong": true, "toilet": true, "tivi": true, "socSac": true, "chanGa": true, "denDoc": true}', NOW()),
('LX007', 'Limousine 16 chỗ', 'Xe limousine VIP ghế da cao cấp', 16, 1, '{"wifi": true, "dieuHoa": true, "nuocUong": true, "toilet": true, "tivi": true, "socSac": true, "gheMassage": true, "amThanh": true}', NOW()),
('LX008', 'Ghế ngồi 40 chỗ', 'Xe ghế ngồi tiêu chuẩn 2 tầng', 40, 2, '{"wifi": true, "dieuHoa": true, "nuocUong": true, "toilet": false, "tivi": false, "socSac": true}', NOW());

-- 4. Insert data into xe (Buses)
INSERT INTO `xe` (`nhaXeId`, `loaiXeId`, `bienSoXe`, `soGhe`, `namSanXuat`, `mauXe`, `trangThai`, `updatedAt`) VALUES
(1, 2, '51B-12345', 40, 2022, 'Trắng', 'SAN_SANG', NOW()),
(1, 3, '51B-12346', 24, 2023, 'Đen', 'SAN_SANG', NOW()),
(1, 4, '51B-12347', 34, 2023, 'Bạc', 'SAN_SANG', NOW()),
(2, 1, '51B-22345', 45, 2021, 'Xanh', 'SAN_SANG', NOW()),
(2, 2, '51B-22346', 40, 2022, 'Trắng', 'SAN_SANG', NOW()),
(2, 5, '51B-22347', 29, 2020, 'Đỏ', 'SAN_SANG', NOW()),
(3, 3, '51B-32345', 24, 2023, 'Đen', 'SAN_SANG', NOW()),
(3, 6, '51B-32346', 36, 2023, 'Trắng', 'SAN_SANG', NOW()),
(4, 4, '51B-42345', 34, 2023, 'Bạc', 'SAN_SANG', NOW()),
(4, 7, '51B-42346', 16, 2024, 'Đen', 'SAN_SANG', NOW()),
(5, 1, '51B-52345', 45, 2021, 'Xanh', 'SAN_SANG', NOW()),
(5, 2, '51B-52346', 40, 2022, 'Trắng', 'SAN_SANG', NOW()),
(6, 2, '29B-62345', 40, 2022, 'Trắng', 'SAN_SANG', NOW()),
(6, 5, '29B-62346', 29, 2021, 'Xanh', 'SAN_SANG', NOW()),
(7, 1, '29B-72345', 45, 2020, 'Đỏ', 'SAN_SANG', NOW()),
(7, 8, '29B-72346', 40, 2021, 'Trắng', 'SAN_SANG', NOW()),
(8, 2, '51B-82345', 40, 2022, 'Trắng', 'SAN_SANG', NOW()),
(8, 5, '51B-82346', 29, 2021, 'Xanh', 'SAN_SANG', NOW()),
(9, 3, '43B-92345', 24, 2023, 'Đen', 'SAN_SANG', NOW()),
(9, 6, '43B-92346', 36, 2023, 'Trắng', 'SAN_SANG', NOW()),
(10, 2, '51B-10345', 40, 2022, 'Trắng', 'SAN_SANG', NOW()),
(10, 4, '51B-10346', 34, 2023, 'Bạc', 'SAN_SANG', NOW());

-- 5. Insert data into tuyen_xe (Bus Routes)
INSERT INTO `tuyen_xe` (`maTuyen`, `nhaXeId`, `benXeDiId`, `benXeDenId`, `khoangCach`, `thoiGianChayDuKien`, `moTa`, `trangThai`, `updatedAt`) VALUES
('TX001', 1, 1, 8, 450, 540, 'Tuyến Sài Gòn - Nha Trang cao tốc', 'HOAT_DONG', NOW()),
('TX002', 1, 1, 9, 308, 420, 'Tuyến Sài Gòn - Đà Lạt', 'HOAT_DONG', NOW()),
('TX003', 2, 1, 7, 964, 900, 'Tuyến Sài Gòn - Đà Nẵng', 'HOAT_DONG', NOW()),
('TX004', 3, 1, 11, 125, 150, 'Tuyến Sài Gòn - Vũng Tàu', 'HOAT_DONG', NOW()),
('TX005', 4, 4, 13, 120, 150, 'Tuyến Hà Nội - Hải Phòng', 'HOAT_DONG', NOW()),
('TX006', 5, 1, 10, 169, 240, 'Tuyến Sài Gòn - Cần Thơ', 'HOAT_DONG', NOW()),
('TX007', 6, 4, 7, 764, 780, 'Tuyến Hà Nội - Đà Nẵng', 'HOAT_DONG', NOW()),
('TX008', 7, 4, 12, 654, 720, 'Tuyến Hà Nội - Huế', 'HOAT_DONG', NOW()),
('TX009', 8, 2, 10, 169, 240, 'Tuyến Sài Gòn - Cần Thơ (Miền Tây)', 'HOAT_DONG', NOW()),
('TX010', 9, 7, 8, 541, 600, 'Tuyến Đà Nẵng - Nha Trang', 'HOAT_DONG', NOW()),
('TX011', 10, 1, 15, 200, 270, 'Tuyến Sài Gòn - Phan Thiết', 'HOAT_DONG', NOW()),
('TX012', 1, 8, 9, 142, 180, 'Tuyến Nha Trang - Đà Lạt', 'HOAT_DONG', NOW()),
('TX013', 2, 7, 12, 108, 150, 'Tuyến Đà Nẵng - Huế', 'HOAT_DONG', NOW()),
('TX014', 3, 1, 14, 638, 720, 'Tuyến Sài Gòn - Quy Nhơn', 'HOAT_DONG', NOW()),
('TX015', 4, 4, 6, 15, 45, 'Tuyến nội thành Hà Nội', 'HOAT_DONG', NOW());

-- 6. Insert data into chuyen_xe (Bus Trips)
INSERT INTO `chuyen_xe` (`maChuyenXe`, `tuyenXeId`, `xeId`, `gioDi`, `gioDen`, `giaVe`, `soGheTrong`, `trangThai`, `ghiChu`, `updatedAt`) VALUES
-- Tuyến Sài Gòn - Nha Trang
('CX00101', 1, 1, '2026-01-07 06:00:00', '2026-01-07 15:00:00', 250000, 35, 'SAP_KHOI_HANH', 'Xe chạy cao tốc', NOW()),
('CX00102', 1, 1, '2026-01-07 08:00:00', '2026-01-07 17:00:00', 250000, 38, 'SAP_KHOI_HANH', NULL, NOW()),
('CX00103', 1, 1, '2026-01-07 20:00:00', '2026-01-08 05:00:00', 280000, 40, 'SAP_KHOI_HANH', 'Xe giường nằm đêm', NOW()),
-- Tuyến Sài Gòn - Đà Lạt
('CX00201', 2, 2, '2026-01-07 07:00:00', '2026-01-07 14:00:00', 180000, 20, 'SAP_KHOI_HANH', 'Limousine cao cấp', NOW()),
('CX00202', 2, 2, '2026-01-07 13:00:00', '2026-01-07 20:00:00', 180000, 22, 'SAP_KHOI_HANH', NULL, NOW()),
('CX00203', 2, 3, '2026-01-07 22:00:00', '2026-01-08 05:00:00', 200000, 30, 'SAP_KHOI_HANH', 'Xe đêm', NOW()),
-- Tuyến Sài Gòn - Đà Nẵng
('CX00301', 3, 4, '2026-01-07 05:00:00', '2026-01-07 20:00:00', 450000, 40, 'SAP_KHOI_HANH', 'Xe chạy xuyên đêm', NOW()),
('CX00302', 3, 5, '2026-01-07 17:00:00', '2026-01-08 08:00:00', 480000, 38, 'SAP_KHOI_HANH', 'Giường nằm VIP', NOW()),
-- Tuyến Sài Gòn - Vũng Tàu
('CX00401', 4, 7, '2026-01-07 06:00:00', '2026-01-07 08:30:00', 120000, 18, 'SAP_KHOI_HANH', 'Limousine', NOW()),
('CX00402', 4, 7, '2026-01-07 08:00:00', '2026-01-07 10:30:00', 120000, 20, 'SAP_KHOI_HANH', NULL, NOW()),
('CX00403', 4, 7, '2026-01-07 10:00:00', '2026-01-07 12:30:00', 120000, 22, 'SAP_KHOI_HANH', NULL, NOW()),
('CX00404', 4, 7, '2026-01-07 14:00:00', '2026-01-07 16:30:00', 120000, 24, 'SAP_KHOI_HANH', NULL, NOW()),
-- Tuyến Hà Nội - Hải Phòng
('CX00501', 5, 9, '2026-01-07 06:00:00', '2026-01-07 08:30:00', 100000, 30, 'SAP_KHOI_HANH', NULL, NOW()),
('CX00502', 5, 9, '2026-01-07 09:00:00', '2026-01-07 11:30:00', 100000, 32, 'SAP_KHOI_HANH', NULL, NOW()),
('CX00503', 5, 9, '2026-01-07 15:00:00', '2026-01-07 17:30:00', 100000, 34, 'SAP_KHOI_HANH', NULL, NOW()),
-- Tuyến Sài Gòn - Cần Thơ
('CX00601', 6, 11, '2026-01-07 06:00:00', '2026-01-07 10:00:00', 150000, 40, 'SAP_KHOI_HANH', NULL, NOW()),
('CX00602', 6, 12, '2026-01-07 08:00:00', '2026-01-07 12:00:00', 150000, 38, 'SAP_KHOI_HANH', NULL, NOW()),
('CX00603', 6, 11, '2026-01-07 14:00:00', '2026-01-07 18:00:00', 150000, 42, 'SAP_KHOI_HANH', NULL, NOW()),
-- Tuyến Hà Nội - Đà Nẵng
('CX00701', 7, 13, '2026-01-07 05:00:00', '2026-01-07 18:00:00', 400000, 35, 'SAP_KHOI_HANH', 'Xe cao tốc', NOW()),
('CX00702', 7, 13, '2026-01-07 20:00:00', '2026-01-08 09:00:00', 420000, 38, 'SAP_KHOI_HANH', 'Xe đêm', NOW()),
-- Tuyến Hà Nội - Huế
('CX00801', 8, 15, '2026-01-07 06:00:00', '2026-01-07 18:00:00', 350000, 40, 'SAP_KHOI_HANH', NULL, NOW()),
('CX00802', 8, 16, '2026-01-07 21:00:00', '2026-01-08 09:00:00', 380000, 38, 'SAP_KHOI_HANH', 'Giường nằm đêm', NOW()),
-- Tuyến Đà Nẵng - Nha Trang
('CX01001', 10, 19, '2026-01-07 07:00:00', '2026-01-07 17:00:00', 300000, 20, 'SAP_KHOI_HANH', 'Limousine', NOW()),
('CX01002', 10, 20, '2026-01-07 20:00:00', '2026-01-08 06:00:00', 320000, 32, 'SAP_KHOI_HANH', 'Xe đêm', NOW()),
-- Tuyến Sài Gòn - Phan Thiết
('CX01101', 11, 21, '2026-01-07 06:00:00', '2026-01-07 10:30:00', 130000, 35, 'SAP_KHOI_HANH', NULL, NOW()),
('CX01102', 11, 21, '2026-01-07 08:00:00', '2026-01-07 12:30:00', 130000, 38, 'SAP_KHOI_HANH', NULL, NOW()),
('CX01103', 11, 22, '2026-01-07 14:00:00', '2026-01-07 18:30:00', 150000, 30, 'SAP_KHOI_HANH', 'Limousine', NOW());

-- 7. Insert data into diem_dung (Bus Stops)
INSERT INTO `diem_dung` (`chuyenXeId`, `thuTu`, `tenDiemDung`, `diaChi`, `gioDen`, `gioDi`, `thoiGianDung`, `createdAt`) VALUES
-- Chuyến CX00101 (Sài Gòn - Nha Trang)
(1, 1, 'Bến xe Miền Đông', '292 Đinh Bộ Lĩnh, Bình Thạnh, TP.HCM', '2026-01-07 06:00:00', '2026-01-07 06:00:00', 0, NOW()),
(1, 2, 'Trạm dừng chân Phan Thiết', 'Quốc lộ 1A, Phan Thiết', '2026-01-07 09:30:00', '2026-01-07 09:45:00', 15, NOW()),
(1, 3, 'Trạm dừng Cam Ranh', 'Quốc lộ 1A, Cam Ranh, Khánh Hòa', '2026-01-07 13:00:00', '2026-01-07 13:15:00', 15, NOW()),
(1, 4, 'Bến xe Nha Trang', '23 Tháng 10, Nha Trang', '2026-01-07 15:00:00', '2026-01-07 15:00:00', 0, NOW()),
-- Chuyến CX00201 (Sài Gòn - Đà Lạt)
(4, 1, 'Bến xe Miền Đông', '292 Đinh Bộ Lĩnh, Bình Thạnh, TP.HCM', '2026-01-07 07:00:00', '2026-01-07 07:00:00', 0, NOW()),
(4, 2, 'Trạm dừng Dầu Giây', 'Quốc lộ 20, Dầu Giây, Đồng Nai', '2026-01-07 08:30:00', '2026-01-07 08:45:00', 15, NOW()),
(4, 3, 'Trạm dừng Bảo Lộc', 'Quốc lộ 20, Bảo Lộc, Lâm Đồng', '2026-01-07 11:00:00', '2026-01-07 11:20:00', 20, NOW()),
(4, 4, 'Bến xe Đà Lạt', '1 Tô Hiến Thành, Đà Lạt', '2026-01-07 14:00:00', '2026-01-07 14:00:00', 0, NOW()),
-- Chuyến CX00301 (Sài Gòn - Đà Nẵng)
(7, 1, 'Bến xe Miền Đông', '292 Đinh Bộ Lĩnh, Bình Thạnh, TP.HCM', '2026-01-07 05:00:00', '2026-01-07 05:00:00', 0, NOW()),
(7, 2, 'Trạm dừng Nha Trang', 'Quốc lộ 1A, Nha Trang', '2026-01-07 10:00:00', '2026-01-07 10:30:00', 30, NOW()),
(7, 3, 'Trạm dừng Quy Nhơn', 'Quốc lộ 1A, Quy Nhơn', '2026-01-07 14:00:00', '2026-01-07 14:30:00', 30, NOW()),
(7, 4, 'Bến xe Đà Nẵng', '201 Tôn Đức Thắng, Đà Nẵng', '2026-01-07 20:00:00', '2026-01-07 20:00:00', 0, NOW()),
-- Chuyến CX00701 (Hà Nội - Đà Nẵng)
(19, 1, 'Bến xe Giáp Bát', 'Đường Giải Phóng, Hà Nội', '2026-01-07 05:00:00', '2026-01-07 05:00:00', 0, NOW()),
(19, 2, 'Trạm dừng Vinh', 'Quốc lộ 1A, Vinh, Nghệ An', '2026-01-07 09:00:00', '2026-01-07 09:30:00', 30, NOW()),
(19, 3, 'Trạm dừng Huế', 'Quốc lộ 1A, Huế', '2026-01-07 13:00:00', '2026-01-07 13:30:00', 30, NOW()),
(19, 4, 'Bến xe Đà Nẵng', '201 Tôn Đức Thắng, Đà Nẵng', '2026-01-07 18:00:00', '2026-01-07 18:00:00', 0, NOW());

-- 8. Insert data into ghe_xe (Bus Seats)
-- Xe 1 (40 chỗ giường nằm 2 tầng)
INSERT INTO `ghe_xe` (`xeId`, `soGhe`, `tang`, `loaiGhe`, `viTri`, `trangThai`, `createdAt`) VALUES
-- Tầng 1 (20 ghế)
(1, 'A1', 1, 'GIUONG_NAM', '{"row": 1, "col": 1}', 'HOAT_DONG', NOW()),
(1, 'A2', 1, 'GIUONG_NAM', '{"row": 1, "col": 2}', 'HOAT_DONG', NOW()),
(1, 'A3', 1, 'GIUONG_NAM', '{"row": 2, "col": 1}', 'HOAT_DONG', NOW()),
(1, 'A4', 1, 'GIUONG_NAM', '{"row": 2, "col": 2}', 'HOAT_DONG', NOW()),
(1, 'A5', 1, 'GIUONG_NAM', '{"row": 3, "col": 1}', 'HOAT_DONG', NOW()),
(1, 'A6', 1, 'GIUONG_NAM', '{"row": 3, "col": 2}', 'HOAT_DONG', NOW()),
(1, 'A7', 1, 'GIUONG_NAM', '{"row": 4, "col": 1}', 'HOAT_DONG', NOW()),
(1, 'A8', 1, 'GIUONG_NAM', '{"row": 4, "col": 2}', 'HOAT_DONG', NOW()),
(1, 'A9', 1, 'GIUONG_NAM', '{"row": 5, "col": 1}', 'HOAT_DONG', NOW()),
(1, 'A10', 1, 'GIUONG_NAM', '{"row": 5, "col": 2}', 'HOAT_DONG', NOW()),
(1, 'A11', 1, 'GIUONG_NAM', '{"row": 6, "col": 1}', 'HOAT_DONG', NOW()),
(1, 'A12', 1, 'GIUONG_NAM', '{"row": 6, "col": 2}', 'HOAT_DONG', NOW()),
(1, 'A13', 1, 'GIUONG_NAM', '{"row": 7, "col": 1}', 'HOAT_DONG', NOW()),
(1, 'A14', 1, 'GIUONG_NAM', '{"row": 7, "col": 2}', 'HOAT_DONG', NOW()),
(1, 'A15', 1, 'GIUONG_NAM', '{"row": 8, "col": 1}', 'HOAT_DONG', NOW()),
(1, 'A16', 1, 'GIUONG_NAM', '{"row": 8, "col": 2}', 'HOAT_DONG', NOW()),
(1, 'A17', 1, 'GIUONG_NAM', '{"row": 9, "col": 1}', 'HOAT_DONG', NOW()),
(1, 'A18', 1, 'GIUONG_NAM', '{"row": 9, "col": 2}', 'HOAT_DONG', NOW()),
(1, 'A19', 1, 'GIUONG_NAM', '{"row": 10, "col": 1}', 'HOAT_DONG', NOW()),
(1, 'A20', 1, 'GIUONG_NAM', '{"row": 10, "col": 2}', 'HOAT_DONG', NOW()),
-- Tầng 2 (20 ghế)
(1, 'B1', 2, 'GIUONG_NAM', '{"row": 1, "col": 1}', 'HOAT_DONG', NOW()),
(1, 'B2', 2, 'GIUONG_NAM', '{"row": 1, "col": 2}', 'HOAT_DONG', NOW()),
(1, 'B3', 2, 'GIUONG_NAM', '{"row": 2, "col": 1}', 'HOAT_DONG', NOW()),
(1, 'B4', 2, 'GIUONG_NAM', '{"row": 2, "col": 2}', 'HOAT_DONG', NOW()),
(1, 'B5', 2, 'GIUONG_NAM', '{"row": 3, "col": 1}', 'HOAT_DONG', NOW()),
(1, 'B6', 2, 'GIUONG_NAM', '{"row": 3, "col": 2}', 'HOAT_DONG', NOW()),
(1, 'B7', 2, 'GIUONG_NAM', '{"row": 4, "col": 1}', 'HOAT_DONG', NOW()),
(1, 'B8', 2, 'GIUONG_NAM', '{"row": 4, "col": 2}', 'HOAT_DONG', NOW()),
(1, 'B9', 2, 'GIUONG_NAM', '{"row": 5, "col": 1}', 'HOAT_DONG', NOW()),
(1, 'B10', 2, 'GIUONG_NAM', '{"row": 5, "col": 2}', 'HOAT_DONG', NOW()),
(1, 'B11', 2, 'GIUONG_NAM', '{"row": 6, "col": 1}', 'HOAT_DONG', NOW()),
(1, 'B12', 2, 'GIUONG_NAM', '{"row": 6, "col": 2}', 'HOAT_DONG', NOW()),
(1, 'B13', 2, 'GIUONG_NAM', '{"row": 7, "col": 1}', 'HOAT_DONG', NOW()),
(1, 'B14', 2, 'GIUONG_NAM', '{"row": 7, "col": 2}', 'HOAT_DONG', NOW()),
(1, 'B15', 2, 'GIUONG_NAM', '{"row": 8, "col": 1}', 'HOAT_DONG', NOW()),
(1, 'B16', 2, 'GIUONG_NAM', '{"row": 8, "col": 2}', 'HOAT_DONG', NOW()),
(1, 'B17', 2, 'GIUONG_NAM', '{"row": 9, "col": 1}', 'HOAT_DONG', NOW()),
(1, 'B18', 2, 'GIUONG_NAM', '{"row": 9, "col": 2}', 'HOAT_DONG', NOW()),
(1, 'B19', 2, 'GIUONG_NAM', '{"row": 10, "col": 1}', 'HOAT_DONG', NOW()),
(1, 'B20', 2, 'GIUONG_NAM', '{"row": 10, "col": 2}', 'HOAT_DONG', NOW());

-- Xe 2 (24 chỗ limousine)
INSERT INTO `ghe_xe` (`xeId`, `soGhe`, `tang`, `loaiGhe`, `viTri`, `trangThai`, `createdAt`) VALUES
(2, '1A', 1, 'VIP', '{"row": 1, "col": 1}', 'HOAT_DONG', NOW()),
(2, '1B', 1, 'VIP', '{"row": 1, "col": 2}', 'HOAT_DONG', NOW()),
(2, '1C', 1, 'VIP', '{"row": 1, "col": 3}', 'HOAT_DONG', NOW()),
(2, '2A', 1, 'VIP', '{"row": 2, "col": 1}', 'HOAT_DONG', NOW()),
(2, '2B', 1, 'VIP', '{"row": 2, "col": 2}', 'HOAT_DONG', NOW()),
(2, '2C', 1, 'VIP', '{"row": 2, "col": 3}', 'HOAT_DONG', NOW()),
(2, '3A', 1, 'VIP', '{"row": 3, "col": 1}', 'HOAT_DONG', NOW()),
(2, '3B', 1, 'VIP', '{"row": 3, "col": 2}', 'HOAT_DONG', NOW()),
(2, '3C', 1, 'VIP', '{"row": 3, "col": 3}', 'HOAT_DONG', NOW()),
(2, '4A', 1, 'VIP', '{"row": 4, "col": 1}', 'HOAT_DONG', NOW()),
(2, '4B', 1, 'VIP', '{"row": 4, "col": 2}', 'HOAT_DONG', NOW()),
(2, '4C', 1, 'VIP', '{"row": 4, "col": 3}', 'HOAT_DONG', NOW()),
(2, '5A', 1, 'VIP', '{"row": 5, "col": 1}', 'HOAT_DONG', NOW()),
(2, '5B', 1, 'VIP', '{"row": 5, "col": 2}', 'HOAT_DONG', NOW()),
(2, '5C', 1, 'VIP', '{"row": 5, "col": 3}', 'HOAT_DONG', NOW()),
(2, '6A', 1, 'VIP', '{"row": 6, "col": 1}', 'HOAT_DONG', NOW()),
(2, '6B', 1, 'VIP', '{"row": 6, "col": 2}', 'HOAT_DONG', NOW()),
(2, '6C', 1, 'VIP', '{"row": 6, "col": 3}', 'HOAT_DONG', NOW()),
(2, '7A', 1, 'VIP', '{"row": 7, "col": 1}', 'HOAT_DONG', NOW()),
(2, '7B', 1, 'VIP', '{"row": 7, "col": 2}', 'HOAT_DONG', NOW()),
(2, '7C', 1, 'VIP', '{"row": 7, "col": 3}', 'HOAT_DONG', NOW()),
(2, '8A', 1, 'VIP', '{"row": 8, "col": 1}', 'HOAT_DONG', NOW()),
(2, '8B', 1, 'VIP', '{"row": 8, "col": 2}', 'HOAT_DONG', NOW()),
(2, '8C', 1, 'VIP', '{"row": 8, "col": 3}', 'HOAT_DONG', NOW());

-- 9. Insert data into don_dat_ve_xe (Bus Ticket Bookings) - Assuming users table exists
INSERT INTO `don_dat_ve_xe` (`maDonDat`, `nguoiDungId`, `chuyenXeId`, `soLuongGhe`, `tongTien`, `trangThaiDat`, `phuongThucThanhToan`, `ghiChu`, `updatedAt`) VALUES
('DDX001', 1, 1, 2, 500000, 'DA_THANH_TOAN', 'MOMO', 'Đặt cho gia đình', NOW()),
('DDX002', 2, 1, 1, 250000, 'DA_THANH_TOAN', 'VNPAY', NULL, NOW()),
('DDX003', 3, 4, 2, 360000, 'DA_THANH_TOAN', 'ZALOPAY', 'Đặt ghế VIP', NOW()),
('DDX004', 4, 9, 4, 480000, 'DA_THANH_TOAN', 'MOMO', 'Đi du lịch gia đình', NOW()),
('DDX005', 5, 13, 1, 120000, 'DA_THANH_TOAN', 'VNPAY', NULL, NOW()),
('DDX006', 6, 16, 2, 300000, 'CHO_THANH_TOAN', 'CHUYEN_KHOAN', 'Chờ xác nhận', NOW()),
('DDX007', 7, 19, 3, 450000, 'DA_THANH_TOAN', 'MOMO', NULL, NOW()),
('DDX008', 8, 22, 1, 100000, 'DA_THANH_TOAN', 'VNPAY', NULL, NOW()),
('DDX009', 9, 25, 2, 600000, 'DA_THANH_TOAN', 'ZALOPAY', 'Limousine cao cấp', NOW()),
('DDX010', 10, 4, 1, 180000, 'DA_HUY', 'VNPAY', 'Khách hủy vé', NOW());

-- 10. Insert data into ve_xe (Bus Tickets)
INSERT INTO `ve_xe` (`donDatVeXeId`, `soVe`, `hoTenHanhKhach`, `soDienThoai`, `email`, `soGhe`, `giaVe`, `trangThai`, `ngayXuat`, `createdAt`) VALUES
-- Đơn DDX001 (2 vé)
(1, 'VX0001', 'Nguyễn Văn A', '0901234567', 'nguyenvana@gmail.com', 'A1', 250000, 'HIEU_LUC', NOW(), NOW()),
(1, 'VX0002', 'Trần Thị B', '0901234568', 'tranthib@gmail.com', 'A2', 250000, 'HIEU_LUC', NOW(), NOW()),
-- Đơn DDX002 (1 vé)
(2, 'VX0003', 'Lê Văn C', '0901234569', 'levanc@gmail.com', 'A3', 250000, 'HIEU_LUC', NOW(), NOW()),
-- Đơn DDX003 (2 vé)
(3, 'VX0004', 'Phạm Thị D', '0901234570', 'phamthid@gmail.com', '1A', 180000, 'HIEU_LUC', NOW(), NOW()),
(3, 'VX0005', 'Hoàng Văn E', '0901234571', 'hoangvane@gmail.com', '1B', 180000, 'HIEU_LUC', NOW(), NOW()),
-- Đơn DDX004 (4 vé)
(4, 'VX0006', 'Vũ Thị F', '0901234572', 'vuthif@gmail.com', '1A', 120000, 'HIEU_LUC', NOW(), NOW()),
(4, 'VX0007', 'Đỗ Văn G', '0901234573', 'dovang@gmail.com', '1B', 120000, 'HIEU_LUC', NOW(), NOW()),
(4, 'VX0008', 'Bùi Thị H', '0901234574', 'buithih@gmail.com', '1C', 120000, 'HIEU_LUC', NOW(), NOW()),
(4, 'VX0009', 'Đinh Văn I', '0901234575', 'dinhvani@gmail.com', '2A', 120000, 'HIEU_LUC', NOW(), NOW()),
-- Đơn DDX005 (1 vé)
(5, 'VX0010', 'Ngô Thị K', '0901234576', 'ngothik@gmail.com', 'A5', 100000, 'HIEU_LUC', NOW(), NOW()),
-- Đơn DDX006 (2 vé)
(6, 'VX0011', 'Trương Văn L', '0901234577', 'truongvanl@gmail.com', 'A6', 150000, 'HIEU_LUC', NOW(), NOW()),
(6, 'VX0012', 'Phan Thị M', '0901234578', 'phanthim@gmail.com', 'A7', 150000, 'HIEU_LUC', NOW(), NOW()),
-- Đơn DDX007 (3 vé)
(7, 'VX0013', 'Lý Văn N', '0901234579', 'lyvann@gmail.com', 'A8', 150000, 'HIEU_LUC', NOW(), NOW()),
(7, 'VX0014', 'Võ Thị O', '0901234580', 'vothio@gmail.com', 'A9', 150000, 'HIEU_LUC', NOW(), NOW()),
(7, 'VX0015', 'Dương Văn P', '0901234581', 'duongvanp@gmail.com', 'A10', 150000, 'HIEU_LUC', NOW(), NOW()),
-- Đơn DDX008 (1 vé)
(8, 'VX0016', 'Hồ Thị Q', '0901234582', 'hothiq@gmail.com', 'A11', 100000, 'HIEU_LUC', NOW(), NOW()),
-- Đơn DDX009 (2 vé)
(9, 'VX0017', 'Cao Văn R', '0901234583', 'caovanr@gmail.com', '1A', 300000, 'HIEU_LUC', NOW(), NOW()),
(9, 'VX0018', 'Tạ Thị S', '0901234584', 'tathis@gmail.com', '1B', 300000, 'HIEU_LUC', NOW(), NOW()),
-- Đơn DDX010 (1 vé - đã hủy)
(10, 'VX0019', 'Lâm Văn T', '0901234585', 'lamvant@gmail.com', '2A', 180000, 'DA_HUY', NOW(), NOW());

-- 11. Insert data into danh_gia_nha_xe (Bus Company Reviews)
INSERT INTO `danh_gia_nha_xe` (`nhaXeId`, `nguoiDungId`, `chuyenXeId`, `diemDanhGia`, `nhanXet`, `createdAt`) VALUES
(1, 1, 1, 5, 'Xe rất sạch sẽ, tài xế lái xe an toàn. Sẽ ủng hộ lần sau!', NOW()),
(1, 2, 1, 4, 'Xe đúng giờ, nhân viên nhiệt tình. Ghế ngồi hơi cứng một chút.', NOW()),
(1, 3, 2, 5, 'Dịch vụ tuyệt vời, xe limousine sang trọng. Rất hài lòng!', NOW()),
(2, 4, 7, 4, 'Xe chạy êm, có wifi tốc độ cao. Giá cả hợp lý.', NOW()),
(2, 5, 7, 3, 'Xe khá ổn nhưng điều hòa hơi yếu. Cần cải thiện.', NOW()),
(3, 6, 9, 5, 'Limousine cao cấp, ghế massage rất thoải mái. Đáng tiền!', NOW()),
(3, 7, 9, 5, 'Phục vụ chu đáo, xe sạch sẽ. Sẽ giới thiệu cho bạn bè.', NOW()),
(4, 8, 13, 4, 'Xe đẹp, chạy đúng lịch trình. Nhân viên thân thiện.', NOW()),
(5, 9, 16, 4, 'Giá tốt, xe thoải mái. Có nước uống miễn phí.', NOW()),
(6, 10, 19, 5, 'Tuyến Hà Nội - Đà Nẵng rất tiện. Xe mới, sạch sẽ.', NOW()),
(1, 11, 3, 5, 'Xe giường nằm đêm rất thoải mái, ngủ ngon.', NOW()),
(2, 12, 8, 4, 'Tài xế lái xe cẩn thận, đúng giờ. Hài lòng!', NOW()),
(3, 13, 10, 5, 'Dịch vụ 5 sao, xe limousine đẳng cấp!', NOW()),
(4, 14, 14, 4, 'Xe sạch, ghế ngồi êm. Wifi hơi chậm.', NOW()),
(5, 15, 17, 5, 'Rất hài lòng với chất lượng dịch vụ. Sẽ quay lại!', NOW()),
(7, 16, 21, 4, 'Xe tốt, giá hợp lý. Nhân viên nhiệt tình.', NOW()),
(8, 17, 16, 3, 'Xe ổn nhưng khởi hành trễ 15 phút. Cần cải thiện.', NOW()),
(9, 18, 23, 5, 'Xe limousine sang trọng, phục vụ tận tình!', NOW()),
(10, 19, 25, 4, 'Tuyến Sài Gòn - Phan Thiết rất tiện, xe đẹp.', NOW()),
(1, 20, 2, 5, 'Hoàn hảo! Xe mới, sạch sẽ, nhân viên thân thiện.', NOW());

-- =====================================================
-- End of Sample Data
-- =====================================================
