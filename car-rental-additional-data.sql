-- ============================
-- THÊM DỮ LIỆU MẪU BỔ SUNG CHO HỆ THỐNG CHO THUÊ XE
-- ============================

-- XÓA DỮ LIỆU CŨ NẾU ĐÃ TỒN TẠI (tuỳ chọn - bỏ comment nếu muốn reset)
-- DELETE FROM `nha_cung_cap_xe` WHERE `maNhaCungCap` IN ('BEXPRESS', 'LUXCAR', 'MAILINHTAXI', 'VINATRANSFER', 'GOLDENTOUR', 'SKYLINK');

-- 1. Thêm Nhà cung cấp xe (tiếp tục) - Sử dụng INSERT IGNORE để bỏ qua nếu đã tồn tại
INSERT IGNORE INTO `nha_cung_cap_xe` (`maNhaCungCap`, `tenNhaCungCap`, `logo`, `soDienThoai`, `email`, `website`, `diaChi`, `moTa`, `danhGiaTrungBinh`, `soDanhGia`, `chinhSachHuy`, `chinhSachThanhToan`, `trangThai`) VALUES
('BEXPRESS', 'B Express', '/logos/bexpress.png', '1900-8888', 'booking@bexpress.vn', 'https://www.bexpress.vn', '321 Đường GHI, Quận Tân Bình, TP.HCM', 'Dịch vụ xe khách đưa đón sân bay giá rẻ, chất lượng cao', 8.5, 2156, 'Miễn phí hủy trong 12 giờ trước giờ đón. Phí hủy 30% nếu hủy trong vòng 6 giờ.', 'Thanh toán trực tuyến qua VNPAY, MoMo hoặc tiền mặt', 'HOAT_DONG'),
('LUXCAR', 'LuxCar Vietnam', '/logos/luxcar.png', '1900-7777', 'info@luxcar.vn', 'https://www.luxcar.vn', '88 Đường JKL, Quận 1, TP.HCM', 'Dịch vụ thuê xe cao cấp với đội ngũ tài xế chuyên nghiệp, xe sang trọng', 9.3, 1523, 'Miễn phí hủy trong 36 giờ. Phí hủy 40% nếu hủy trong vòng 24 giờ.', 'Thanh toán trực tuyến, chuyển khoản hoặc tiền mặt', 'HOAT_DONG'),
('MAILINHTAXI', 'Mai Linh Taxi', '/logos/mailinh.png', '1900-6666', 'support@mailinh.vn', 'https://www.mailinh.vn', '555 Đường MNO, Quận 10, TP.HCM', 'Hãng taxi truyền thống uy tín với mạng lưới rộng khắp cả nước', 8.7, 4832, 'Miễn phí hủy trong 10 phút sau khi đặt. Phí hủy 25.000đ sau thời gian này.', 'Thanh toán tiền mặt hoặc thẻ', 'HOAT_DONG'),
('VINATRANSFER', 'Vina Transfer', '/logos/vinatransfer.png', '1900-5555', 'contact@vinatransfer.vn', 'https://www.vinatransfer.vn', '777 Đường PQR, Quận Hải Châu, Đà Nẵng', 'Dịch vụ đưa đón sân bay và du lịch tại miền Trung', 8.9, 987, 'Miễn phí hủy trong 24 giờ. Phí hủy 50% nếu hủy trong vòng 12 giờ.', 'Thanh toán online hoặc tiền mặt', 'HOAT_DONG'),
('GOLDENTOUR', 'Golden Tour', '/logos/goldentour.png', '1900-4444', 'booking@goldentour.vn', 'https://www.goldentour.vn', '999 Đường STU, Ba Đình, Hà Nội', 'Công ty du lịch với dịch vụ cho thuê xe chuyên nghiệp tại Hà Nội', 9.0, 1678, 'Miễn phí hủy trong 48 giờ. Phí hủy 25% trong vòng 24 giờ.', 'Thanh toán chuyển khoản hoặc tiền mặt', 'HOAT_DONG'),
('SKYLINK', 'SkyLink Transfer', '/logos/skylink.png', '1900-3333', 'hello@skylink.vn', 'https://www.skylink.vn', '246 Đường VWX, Cầu Giấy, Hà Nội', 'Chuyên đưa đón sân bay nhanh chóng, an toàn với giá cả hợp lý', 8.6, 2341, 'Miễn phí hủy trong 18 giờ. Phí hủy 35% trong vòng 12 giờ.', 'Thanh toán online qua VNPAY, MoMo, ZaloPay', 'HOAT_DONG');

-- 2. Thêm Loại xe (tiếp tục) - Sử dụng INSERT IGNORE để bỏ qua nếu đã tồn tại
INSERT IGNORE INTO `loai_xe_thue` (`maLoaiXe`, `tenLoaiXe`, `moTa`, `soHanhKhach`, `soHanhLy`, `hinhAnh`, `tienNghi`) VALUES
('ELECTRIC_SEDAN', 'Electric Sedan (Eco)', 'Xe sedan điện thân thiện môi trường', 3, 3, '/cars/electric-sedan.png', '["Điều hòa", "WiFi", "Nước uống", "Sạc điện thoại", "Cổng sạc USB-C"]'),
('MPV', 'MPV (Standard)', 'Xe gia đình 7 chỗ đa dụng', 6, 5, '/cars/mpv.png', '["Điều hòa", "WiFi", "Nước uống", "Sạc điện thoại", "Cửa sổ trời"]'),
('LUXURY_MPV', 'Luxury MPV (VIP)', 'Xe MPV cao cấp Alphard, Carnival', 6, 6, '/cars/luxury-mpv.png', '["Điều hòa", "WiFi", "Nước uống cao cấp", "Sạc điện thoại", "Ghế massage", "Rèm che", "TV", "Tủ lạnh"]'),
('LIMOUSINE', 'Limousine (VIP)', 'Xe limousine 9-16 chỗ hạng sang', 9, 9, '/cars/limousine.png', '["Điều hòa", "WiFi", "Nước uống", "Ghế massage", "Rèm che", "TV", "Karaoke", "Tủ lạnh"]'),
('PICKUP_TRUCK', 'Pickup Truck', 'Xe bán tải chở hàng và hành khách', 4, 10, '/cars/pickup.png', '["Điều hòa", "Nước uống", "Thùng xe rộng"]'),
('VAN_CARGO', 'Van Cargo', 'Xe tải van chở hàng hóa', 2, 20, '/cars/van-cargo.png', '["Điều hòa", "Thùng xe lớn", "Dây buộc hàng"]');

-- 3. Thêm Tuyến đường (bổ sung thêm nhiều tuyến) - Sử dụng INSERT IGNORE để bỏ qua nếu đã tồn tại
-- Hà Nội - Các tuyến nội thành và vùng lân cận
INSERT IGNORE INTO `tuyen_duong_thue_xe` (`maTuyen`, `diemDi`, `diemDen`, `diemDiId`, `khoangCach`, `thoiGianDuKien`, `moTa`, `trangThai`) VALUES
('HAN-LK', 'Sân bay Quốc tế Nội Bài (HAN)', 'Long Biên', 1, 28.00, 42, 'Tuyến đưa đón từ sân bay Nội Bài về quận Long Biên', 'HOAT_DONG'),
('HAN-TX', 'Sân bay Quốc tế Nội Bài (HAN)', 'Thanh Xuân', 1, 32.00, 47, 'Tuyến đưa đón từ sân bay Nội Bài về quận Thanh Xuân', 'HOAT_DONG'),
('HAN-DD', 'Sân bay Quốc tế Nội Bài (HAN)', 'Đống Đa', 1, 31.00, 46, 'Tuyến đưa đón từ sân bay Nội Bài về quận Đống Đa', 'HOAT_DONG'),
('HAN-HBT', 'Sân bay Quốc tế Nội Bài (HAN)', 'Hai Bà Trưng', 1, 33.00, 48, 'Tuyến đưa đón từ sân bay Nội Bài về quận Hai Bà Trưng', 'HOAT_DONG'),
('HAN-NL', 'Sân bay Quốc tế Nội Bài (HAN)', 'Ninh Bình', 1, 95.00, 120, 'Tuyến đưa đón từ sân bay Nội Bài đến Ninh Bình', 'HOAT_DONG'),
('HAN-HL', 'Sân bay Quốc tế Nội Bài (HAN)', 'Hạ Long', 1, 150.00, 180, 'Tuyến đưa đón từ sân bay Nội Bài đến vịnh Hạ Long', 'HOAT_DONG'),
('HAN-SPA', 'Sân bay Quốc tế Nội Bài (HAN)', 'Sapa', 1, 320.00, 360, 'Tuyến đưa đón từ sân bay Nội Bài đến Sapa', 'HOAT_DONG'),

-- TP.HCM - Các tuyến nội thành và vùng lân cận  
('SGN-Q3', 'Sân bay Tân Sơn Nhất (SGN)', 'Quận 3', 2, 6.00, 18, 'Tuyến đưa đón từ sân bay Tân Sơn Nhất về Quận 3', 'HOAT_DONG'),
('SGN-BT', 'Sân bay Tân Sơn Nhất (SGN)', 'Bình Thạnh', 2, 10.00, 25, 'Tuyến đưa đón từ sân bay Tân Sơn Nhất về Bình Thạnh', 'HOAT_DONG'),
('SGN-PN', 'Sân bay Tân Sơn Nhất (SGN)', 'Phú Nhuận', 2, 5.00, 15, 'Tuyến đưa đón từ sân bay Tân Sơn Nhất về Phú Nhuận', 'HOAT_DONG'),
('SGN-TB', 'Sân bay Tân Sơn Nhất (SGN)', 'Tân Bình', 2, 3.00, 12, 'Tuyến đưa đón từ sân bay Tân Sơn Nhất về Tân Bình', 'HOAT_DONG'),
('SGN-Q2', 'Sân bay Tân Sơn Nhất (SGN)', 'Quận 2 (Thủ Thiêm)', 2, 18.00, 32, 'Tuyến đưa đón từ sân bay Tân Sơn Nhất về Quận 2', 'HOAT_DONG'),
('SGN-VT', 'Sân bay Tân Sơn Nhất (SGN)', 'Vũng Tàu', 2, 125.00, 150, 'Tuyến đưa đón từ sân bay Tân Sơn Nhất đến Vũng Tàu', 'HOAT_DONG'),
('SGN-MT', 'Sân bay Tân Sơn Nhất (SGN)', 'Mũi Né', 2, 220.00, 240, 'Tuyến đưa đón từ sân bay Tân Sơn Nhất đến Mũi Né', 'HOAT_DONG'),
('SGN-DL', 'Sân bay Tân Sơn Nhất (SGN)', 'Đà Lạt', 2, 305.00, 360, 'Tuyến đưa đón từ sân bay Tân Sơn Nhất đến Đà Lạt', 'HOAT_DONG'),

-- Đà Nẵng - Các tuyến bổ sung
('DAD-NG', 'Sân bay Quốc tế Đà Nẵng (DAD)', 'Ngũ Hành Sơn', 3, 8.00, 20, 'Tuyến đưa đón từ sân bay Đà Nẵng đến Ngũ Hành Sơn', 'HOAT_DONG'),
('DAD-LC', 'Sân bay Quốc tế Đà Nẵng (DAD)', 'Liên Chiểu', 3, 6.00, 16, 'Tuyến đưa đón từ sân bay Đà Nẵng về Liên Chiểu', 'HOAT_DONG'),
('DAD-BA', 'Sân bay Quốc tế Đà Nẵng (DAD)', 'Bà Nà Hills', 3, 40.00, 55, 'Tuyến đưa đón từ sân bay Đà Nẵng đến Bà Nà Hills', 'HOAT_DONG'),
('DAD-HUE', 'Sân bay Quốc tế Đà Nẵng (DAD)', 'Huế', 3, 105.00, 135, 'Tuyến đưa đón từ sân bay Đà Nẵng đến Huế', 'HOAT_DONG'),
('DAD-QN', 'Sân bay Quốc tế Đà Nẵng (DAD)', 'Quảng Ngãi', 3, 125.00, 150, 'Tuyến đưa đón từ sân bay Đà Nẵng đến Quảng Ngãi', 'HOAT_DONG');

-- 4. Thêm nhiều xe hơn cho các nhà cung cấp - Sử dụng INSERT IGNORE để bỏ qua nếu đã tồn tại
INSERT IGNORE INTO `xe_thue` (`nhaCungCapId`, `loaiXeId`, `bienSoXe`, `mauXe`, `namSanXuat`, `soHanhKhach`, `soHanhLy`, `hinhAnh`, `trangThai`) VALUES
-- B Express (ID=4)
(4, 1, '29A-11111', 'Trắng', 2023, 2, 3, '["/cars/car1.jpg"]', 'SAN_SANG'),
(4, 1, '29A-11112', 'Đen', 2024, 2, 3, '["/cars/car1.jpg"]', 'SAN_SANG'),
(4, 2, '29A-11113', 'Xám', 2022, 2, 3, '["/cars/car1.jpg"]', 'SAN_SANG'),
(4, 2, '29A-11114', 'Bạc', 2023, 2, 3, '["/cars/car1.jpg"]', 'SAN_SANG'),
(4, 3, '29A-11115', 'Trắng', 2024, 10, 14, '["/cars/car1.jpg"]', 'SAN_SANG'),
(4, 3, '29A-11116', 'Xanh', 2023, 10, 14, '["/cars/car1.jpg"]', 'SAN_SANG'),
(4, 10, '29A-11117', 'Trắng', 2024, 3, 3, '["/cars/car1.jpg"]', 'SAN_SANG'),
(4, 10, '29A-11118', 'Xanh', 2024, 3, 3, '["/cars/car1.jpg"]', 'SAN_SANG'),

-- LuxCar (ID=5)
(5, 8, '51B-77777', 'Đen', 2024, 3, 3, '["/cars/car1.jpg"]', 'SAN_SANG'),
(5, 8, '51B-77778', 'Trắng', 2024, 3, 3, '["/cars/car1.jpg"]', 'SAN_SANG'),
(5, 8, '51B-77779', 'Xám', 2024, 3, 3, '["/cars/car1.jpg"]', 'SAN_SANG'),
(5, 11, '51B-77780', 'Đen', 2024, 6, 6, '["/cars/car1.jpg"]', 'SAN_SANG'),
(5, 11, '51B-77781', 'Trắng', 2024, 6, 6, '["/cars/car1.jpg"]', 'SAN_SANG'),
(5, 12, '51B-77782', 'Trắng', 2024, 9, 9, '["/cars/car1.jpg"]', 'SAN_SANG'),
(5, 12, '51B-77783', 'Đen', 2024, 9, 9, '["/cars/car1.jpg"]', 'SAN_SANG'),

-- Mai Linh (ID=6)
(6, 1, '51C-66666', 'Xanh Mai Linh', 2023, 2, 3, '["/cars/car1.jpg"]', 'SAN_SANG'),
(6, 1, '51C-66667', 'Xanh Mai Linh', 2023, 2, 3, '["/cars/car1.jpg"]', 'SAN_SANG'),
(6, 1, '51C-66668', 'Xanh Mai Linh', 2022, 2, 3, '["/cars/car1.jpg"]', 'SAN_SANG'),
(6, 1, '51C-66669', 'Xanh Mai Linh', 2024, 2, 3, '["/cars/car1.jpg"]', 'SAN_SANG'),
(6, 2, '51C-66670', 'Xanh Mai Linh', 2023, 2, 3, '["/cars/car1.jpg"]', 'SAN_SANG'),
(6, 2, '51C-66671', 'Xanh Mai Linh', 2023, 2, 3, '["/cars/car1.jpg"]', 'SAN_SANG'),
(6, 7, '51C-66672', 'Xanh Mai Linh', 2024, 6, 6, '["/cars/car1.jpg"]', 'SAN_SANG'),
(6, 7, '51C-66673', 'Xanh Mai Linh', 2024, 6, 6, '["/cars/car1.jpg"]', 'SAN_SANG'),

-- Vina Transfer (ID=7)
(7, 1, '43A-55555', 'Trắng', 2023, 2, 3, '["/cars/car1.jpg"]', 'SAN_SANG'),
(7, 1, '43A-55556', 'Đen', 2024, 2, 3, '["/cars/car1.jpg"]', 'SAN_SANG'),
(7, 2, '43A-55557', 'Bạc', 2023, 2, 3, '["/cars/car1.jpg"]', 'SAN_SANG'),
(7, 3, '43A-55558', 'Trắng', 2024, 10, 14, '["/cars/car1.jpg"]', 'SAN_SANG'),
(7, 3, '43A-55559', 'Xám', 2023, 10, 14, '["/cars/car1.jpg"]', 'SAN_SANG'),
(7, 7, '43A-55560', 'Đen', 2024, 6, 6, '["/cars/car1.jpg"]', 'SAN_SANG'),
(7, 10, '43A-55561', 'Xanh', 2024, 3, 3, '["/cars/car1.jpg"]', 'SAN_SANG'),

-- Golden Tour (ID=8)
(8, 3, '30B-44444', 'Trắng', 2024, 10, 14, '["/cars/car1.jpg"]', 'SAN_SANG'),
(8, 3, '30B-44445', 'Xám', 2023, 10, 14, '["/cars/car1.jpg"]', 'SAN_SANG'),
(8, 5, '30B-44446', 'Trắng', 2024, 14, 14, '["/cars/car1.jpg"]', 'SAN_SANG'),
(8, 5, '30B-44447', 'Xanh', 2024, 14, 14, '["/cars/car1.jpg"]', 'SAN_SANG'),
(8, 10, '30B-44448', 'Trắng', 2024, 3, 3, '["/cars/car1.jpg"]', 'SAN_SANG'),
(8, 11, '30B-44449', 'Đen', 2024, 6, 6, '["/cars/car1.jpg"]', 'SAN_SANG'),
(8, 12, '30B-44450', 'Trắng', 2024, 9, 9, '["/cars/car1.jpg"]', 'SAN_SANG'),

-- SkyLink (ID=9)
(9, 1, '30C-33333', 'Trắng', 2023, 2, 3, '["/cars/car1.jpg"]', 'SAN_SANG'),
(9, 1, '30C-33334', 'Đen', 2024, 2, 3, '["/cars/car1.jpg"]', 'SAN_SANG'),
(9, 2, '30C-33335', 'Xám', 2023, 2, 3, '["/cars/car1.jpg"]', 'SAN_SANG'),
(9, 2, '30C-33336', 'Bạc', 2024, 2, 3, '["/cars/car1.jpg"]', 'SAN_SANG'),
(9, 3, '30C-33337', 'Trắng', 2024, 10, 14, '["/cars/car1.jpg"]', 'SAN_SANG'),
(9, 7, '30C-33338', 'Đen', 2024, 6, 6, '["/cars/car1.jpg"]', 'SAN_SANG'),
(9, 10, '30C-33339', 'Xanh', 2024, 3, 3, '["/cars/car1.jpg"]', 'SAN_SANG');

-- 5. Thêm Giá thuê xe cho các nhà cung cấp mới - Sử dụng INSERT IGNORE để bỏ qua nếu đã tồn tại
-- B Express - Sedan các tuyến Hà Nội
INSERT IGNORE INTO `gia_thue_xe` (`nhaCungCapId`, `loaiXeId`, `tuyenDuongId`, `giaTheoGio`, `giaTheoNgay`, `giaTheoTuyen`, `donViTienTe`, `giamGia`, `phuThu`, `apDungTu`, `apDungDen`, `trangThai`) VALUES
(4, 1, 1, 180000, 1440000, 360000, 'VND', 5, '{"night": 40000, "airport": 20000, "holiday": 80000}', '2026-01-01', '2026-12-31', 'HOAT_DONG'),
(4, 1, 2, 150000, 1200000, 300000, 'VND', 5, '{"night": 40000, "airport": 20000, "holiday": 80000}', '2026-01-01', '2026-12-31', 'HOAT_DONG'),
(4, 1, 10, 196000, 1568000, 392000, 'VND', 5, '{"night": 40000, "airport": 20000, "holiday": 80000}', '2026-01-01', '2026-12-31', 'HOAT_DONG'),
(4, 1, 11, 224000, 1792000, 448000, 'VND', 5, '{"night": 40000, "airport": 20000, "holiday": 80000}', '2026-01-01', '2026-12-31', 'HOAT_DONG'),
(4, 1, 12, 217333, 1738664, 434666, 'VND', 5, '{"night": 40000, "airport": 20000, "holiday": 80000}', '2026-01-01', '2026-12-31', 'HOAT_DONG'),
(4, 1, 13, 231333, 1850664, 462666, 'VND', 5, '{"night": 40000, "airport": 20000, "holiday": 80000}', '2026-01-01', '2026-12-31', 'HOAT_DONG'),

-- B Express - Economy Sedan
(4, 2, 1, 165000, 1320000, 330000, 'VND', 8, '{"night": 40000, "airport": 20000, "holiday": 80000}', '2026-01-01', '2026-12-31', 'HOAT_DONG'),
(4, 2, 2, 137500, 1100000, 275000, 'VND', 8, '{"night": 40000, "airport": 20000, "holiday": 80000}', '2026-01-01', '2026-12-31', 'HOAT_DONG'),
(4, 2, 4, 88000, 704000, 176000, 'VND', 8, '{"night": 40000, "airport": 20000, "holiday": 80000}', '2026-01-01', '2026-12-31', 'HOAT_DONG'),

-- B Express - Minibus
(4, 3, 1, 310000, 2480000, 620000, 'VND', 5, '{"night": 50000, "airport": 30000, "holiday": 100000}', '2026-01-01', '2026-12-31', 'HOAT_DONG'),
(4, 3, 4, 165333, 1322664, 330666, 'VND', 5, '{"night": 50000, "airport": 30000, "holiday": 100000}', '2026-01-01', '2026-12-31', 'HOAT_DONG'),

-- B Express - Electric Sedan
(4, 10, 1, 195000, 1560000, 390000, 'VND', 10, '{"night": 40000, "airport": 20000, "holiday": 80000}', '2026-01-01', '2026-12-31', 'HOAT_DONG'),
(4, 10, 2, 162500, 1300000, 325000, 'VND', 10, '{"night": 40000, "airport": 20000, "holiday": 80000}', '2026-01-01', '2026-12-31', 'HOAT_DONG');

-- LuxCar - Luxury Sedan
INSERT IGNORE INTO `gia_thue_xe` (`nhaCungCapId`, `loaiXeId`, `tuyenDuongId`, `giaTheoGio`, `giaTheoNgay`, `giaTheoTuyen`, `donViTienTe`, `giamGia`, `phuThu`, `apDungTu`, `apDungDen`, `trangThai`) VALUES
(5, 8, 1, 850000, 6800000, 1700000, 'VND', 0, '{"night": 150000, "airport": 100000, "holiday": 300000}', '2026-01-01', '2026-12-31', 'HOAT_DONG'),
(5, 8, 2, 708333, 5666664, 1416666, 'VND', 0, '{"night": 150000, "airport": 100000, "holiday": 300000}', '2026-01-01', '2026-12-31', 'HOAT_DONG'),
(5, 8, 4, 453333, 3626664, 906666, 'VND', 0, '{"night": 150000, "airport": 100000, "holiday": 300000}', '2026-01-01', '2026-12-31', 'HOAT_DONG'),
(5, 8, 7, 283333, 2266664, 566666, 'VND', 0, '{"night": 150000, "airport": 100000, "holiday": 300000}', '2026-01-01', '2026-12-31', 'HOAT_DONG'),

-- LuxCar - Luxury MPV
(5, 11, 1, 700000, 5600000, 1400000, 'VND', 0, '{"night": 120000, "airport": 80000, "holiday": 250000}', '2026-01-01', '2026-12-31', 'HOAT_DONG'),
(5, 11, 4, 373333, 2986664, 746666, 'VND', 0, '{"night": 120000, "airport": 80000, "holiday": 250000}', '2026-01-01', '2026-12-31', 'HOAT_DONG'),
(5, 11, 7, 233333, 1866664, 466666, 'VND', 0, '{"night": 120000, "airport": 80000, "holiday": 250000}', '2026-01-01', '2026-12-31', 'HOAT_DONG'),

-- LuxCar - Limousine
(5, 12, 1, 850000, 6800000, 1700000, 'VND', 0, '{"night": 150000, "airport": 100000, "holiday": 300000}', '2026-01-01', '2026-12-31', 'HOAT_DONG'),
(5, 12, 4, 453333, 3626664, 906666, 'VND', 0, '{"night": 150000, "airport": 100000, "holiday": 300000}', '2026-01-01', '2026-12-31', 'HOAT_DONG');

-- Mai Linh - Sedan TP.HCM
INSERT IGNORE INTO `gia_thue_xe` (`nhaCungCapId`, `loaiXeId`, `tuyenDuongId`, `giaTheoGio`, `giaTheoNgay`, `giaTheoTuyen`, `donViTienTe`, `giamGia`, `phuThu`, `apDungTu`, `apDungDen`, `trangThai`) VALUES
(6, 1, 4, 105000, 840000, 210000, 'VND', 0, '{"night": 50000, "airport": 30000, "holiday": 100000}', '2026-01-01', '2026-12-31', 'HOAT_DONG'),
(6, 1, 5, 196875, 1575000, 393750, 'VND', 0, '{"night": 50000, "airport": 30000, "holiday": 100000}', '2026-01-01', '2026-12-31', 'HOAT_DONG'),
(6, 1, 18, 78750, 630000, 157500, 'VND', 0, '{"night": 50000, "airport": 30000, "holiday": 100000}', '2026-01-01', '2026-12-31', 'HOAT_DONG'),
(6, 1, 19, 131250, 1050000, 262500, 'VND', 0, '{"night": 50000, "airport": 30000, "holiday": 100000}', '2026-01-01', '2026-12-31', 'HOAT_DONG'),
(6, 1, 20, 65625, 525000, 131250, 'VND', 0, '{"night": 50000, "airport": 30000, "holiday": 100000}', '2026-01-01', '2026-12-31', 'HOAT_DONG'),

-- Mai Linh - Economy Sedan
(6, 2, 4, 96667, 773336, 193334, 'VND', 0, '{"night": 50000, "airport": 30000, "holiday": 100000}', '2026-01-01', '2026-12-31', 'HOAT_DONG'),
(6, 2, 5, 181250, 1450000, 362500, 'VND', 0, '{"night": 50000, "airport": 30000, "holiday": 100000}', '2026-01-01', '2026-12-31', 'HOAT_DONG'),

-- Mai Linh - SUV
(6, 7, 4, 170667, 1365336, 341334, 'VND', 0, '{"night": 50000, "airport": 30000, "holiday": 100000}', '2026-01-01', '2026-12-31', 'HOAT_DONG'),
(6, 7, 5, 319688, 2557504, 639376, 'VND', 0, '{"night": 50000, "airport": 30000, "holiday": 100000}', '2026-01-01', '2026-12-31', 'HOAT_DONG');

-- Vina Transfer - Đà Nẵng
INSERT IGNORE INTO `gia_thue_xe` (`nhaCungCapId`, `loaiXeId`, `tuyenDuongId`, `giaTheoGio`, `giaTheoNgay`, `giaTheoTuyen`, `donViTienTe`, `giamGia`, `phuThu`, `apDungTu`, `apDungDen`, `trangThai`) VALUES
(7, 1, 7, 66667, 533336, 133334, 'VND', 5, '{"night": 40000, "airport": 20000, "holiday": 80000}', '2026-01-01', '2026-12-31', 'HOAT_DONG'),
(7, 1, 8, 93333, 746664, 186666, 'VND', 5, '{"night": 40000, "airport": 20000, "holiday": 80000}', '2026-01-01', '2026-12-31', 'HOAT_DONG'),
(7, 1, 9, 400000, 3200000, 800000, 'VND', 5, '{"night": 40000, "airport": 20000, "holiday": 80000}', '2026-01-01', '2026-12-31', 'HOAT_DONG'),
(7, 1, 23, 106667, 853336, 213334, 'VND', 5, '{"night": 40000, "airport": 20000, "holiday": 80000}', '2026-01-01', '2026-12-31', 'HOAT_DONG'),

-- Vina Transfer - Minibus
(7, 3, 7, 116667, 933336, 233334, 'VND', 5, '{"night": 50000, "airport": 30000, "holiday": 100000}', '2026-01-01', '2026-12-31', 'HOAT_DONG'),
(7, 3, 9, 700000, 5600000, 1400000, 'VND', 5, '{"night": 50000, "airport": 30000, "holiday": 100000}', '2026-01-01', '2026-12-31', 'HOAT_DONG');

-- Golden Tour - Hà Nội
INSERT IGNORE INTO `gia_thue_xe` (`nhaCungCapId`, `loaiXeId`, `tuyenDuongId`, `giaTheoGio`, `giaTheoNgay`, `giaTheoTuyen`, `donViTienTe`, `giamGia`, `phuThu`, `apDungTu`, `apDungDen`, `trangThai`) VALUES
(8, 3, 1, 340000, 2720000, 680000, 'VND', 0, '{"night": 50000, "airport": 30000, "holiday": 100000}', '2026-01-01', '2026-12-31', 'HOAT_DONG'),
(8, 3, 14, 633333, 5066664, 1266666, 'VND', 0, '{"night": 50000, "airport": 30000, "holiday": 100000}', '2026-01-01', '2026-12-31', 'HOAT_DONG'),
(8, 3, 15, 1000000, 8000000, 2000000, 'VND', 0, '{"night": 50000, "airport": 30000, "holiday": 100000}', '2026-01-01', '2026-12-31', 'HOAT_DONG'),

-- Golden Tour - Bus
(8, 5, 1, 400000, 3200000, 800000, 'VND', 0, '{"night": 80000, "airport": 50000, "holiday": 150000}', '2026-01-01', '2026-12-31', 'HOAT_DONG'),
(8, 5, 14, 633333, 5066664, 1266666, 'VND', 0, '{"night": 80000, "airport": 50000, "holiday": 150000}', '2026-01-01', '2026-12-31', 'HOAT_DONG'),
(8, 5, 15, 1000000, 8000000, 2000000, 'VND', 0, '{"night": 80000, "airport": 50000, "holiday": 150000}', '2026-01-01', '2026-12-31', 'HOAT_DONG'),
(8, 5, 16, 2133333, 17066664, 4266666, 'VND', 0, '{"night": 80000, "airport": 50000, "holiday": 150000}', '2026-01-01', '2026-12-31', 'HOAT_DONG');

-- SkyLink - Hà Nội
INSERT IGNORE INTO `gia_thue_xe` (`nhaCungCapId`, `loaiXeId`, `tuyenDuongId`, `giaTheoGio`, `giaTheoNgay`, `giaTheoTuyen`, `donViTienTe`, `giamGia`, `phuThu`, `apDungTu`, `apDungDen`, `trangThai`) VALUES
(9, 1, 1, 195000, 1560000, 390000, 'VND', 3, '{"night": 40000, "airport": 20000, "holiday": 80000}', '2026-01-01', '2026-12-31', 'HOAT_DONG'),
(9, 1, 2, 162500, 1300000, 325000, 'VND', 3, '{"night": 40000, "airport": 20000, "holiday": 80000}', '2026-01-01', '2026-12-31', 'HOAT_DONG'),
(9, 1, 10, 186667, 1493336, 373334, 'VND', 3, '{"night": 40000, "airport": 20000, "holiday": 80000}', '2026-01-01', '2026-12-31', 'HOAT_DONG'),

-- SkyLink - Economy
(9, 2, 1, 178750, 1430000, 357500, 'VND', 5, '{"night": 40000, "airport": 20000, "holiday": 80000}', '2026-01-01', '2026-12-31', 'HOAT_DONG'),
(9, 2, 2, 148958, 1191664, 297916, 'VND', 5, '{"night": 40000, "airport": 20000, "holiday": 80000}', '2026-01-01', '2026-12-31', 'HOAT_DONG'),

-- SkyLink - Minibus
(9, 3, 1, 330000, 2640000, 660000, 'VND', 3, '{"night": 50000, "airport": 30000, "holiday": 100000}', '2026-01-01', '2026-12-31', 'HOAT_DONG'),
(9, 3, 14, 633333, 5066664, 1266666, 'VND', 3, '{"night": 50000, "airport": 30000, "holiday": 100000}', '2026-01-01', '2026-12-31', 'HOAT_DONG');

-- 6. Thêm một số đơn đặt xe mẫu (giả sử có user ID = 1) - Sử dụng INSERT IGNORE để bỏ qua nếu đã tồn tại
-- Note: Table name is don_thue_xe in Prisma schema, and column names need to match
INSERT IGNORE INTO `don_thue_xe` (`nguoiDungId`, `nhaCungCapId`, `xeThueId`, `loaiXeId`, `maDonThue`, `thoiGianDon`, `diemDon`, `diemTra`, `soHanhKhach`, `soHanhLy`, `tenHanhKhach`, `soDienThoai`, `email`, `giaThue`, `phuThu`, `giamGia`, `tongTien`, `phuongThucThanhToan`, `trangThai`, `ghiChu`) VALUES
(1, 1, 1, 1, 'CR2026010600001', '2026-01-15 14:00:00', 'Nhà ga T2, Sân bay Nội Bài', 'Khách sạn Hilton Hanoi Opera, Hồ Hoàn Kiếm', 2, 2, 'Nguyễn Văn A', '0901234567', 'nguyenvana@email.com', 360000, 60596, 0, 420596, 'CHUYEN_KHOAN', 'CHO_XAC_NHAN', 'Đón lúc 14h chiều, có trẻ em 5 tuổi'),
(1, 2, 7, 1, 'CR2026010600002', '2026-01-20 08:30:00', 'Nhà ga T2, Sân bay Tân Sơn Nhất', 'Bitexco Financial Tower, Quận 1', 1, 1, 'Trần Thị B', '0912345678', 'tranthib@email.com', 200000, 24318, 0, 224318, 'THE_TIN_DUNG', 'DA_XAC_NHAN', 'Cần xe sạch sẽ'),
(1, 3, 11, 7, 'CR2026010600003', '2026-02-05 10:00:00', 'Nhà ga Quốc tế, Sân bay Đà Nẵng', 'Vinpearl Resort, Bãi biển Non Nước', 3, 4, 'Lê Văn C', '0923456789', 'levanc@email.com', 500000, 66666, 0, 566666, 'VIET_QR', 'HOAN_THANH', NULL);

-- 7. Thêm đánh giá mẫu - Sử dụng INSERT IGNORE để bỏ qua nếu đã tồn tại
INSERT IGNORE INTO `danh_gia_nha_cung_cap` (`nguoiDungId`, `nhaCungCapId`, `donThueXeId`, `diemXe`, `diemTaiXe`, `diemDungGio`, `diemSachSe`, `diemGiaCa`, `diemTrungBinh`, `binhLuan`, `hinhAnh`) VALUES
(1, 3, 3, 5, 5, 5, 5, 5, 5.00, 'Dịch vụ tuyệt vời! Xe rất sạch sẽ, tài xế lịch sự và đúng giờ. Tôi rất hài lòng với chuyến đi này.', '["review1.jpg", "review2.jpg"]');

-- ============================
-- KẾT THÚC DỮ LIỆU MẪU BỔ SUNG
-- ============================
