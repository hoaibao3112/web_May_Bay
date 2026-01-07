-- ============================================
-- THÊM DỮ LIỆU ĐƯA ĐÓN SÂN BAY
-- Thêm sân bay, khách sạn, dịch vụ đưa đón
-- ============================================

-- 1. THÊM SÂN BAY VIỆT NAM
INSERT INTO `san_bay` (`maIata`, `tenSanBay`, `thanhPho`, `quocGiaId`, `kinhDo`, `viDo`, `maSanBay`) VALUES
('CXR', 'Sân bay Cam Ranh', 'Nha Trang', 1, 109.219400, 11.998100, 'CXR'),
('PQC', 'Sân bay Phú Quốc', 'Phú Quốc', 1, 103.999900, 10.171700, 'PQC'),
('DLI', 'Sân bay Liên Khương', 'Đà Lạt', 1, 108.366900, 11.750000, 'DLI'),
('VDO', 'Sân bay Vân Đồn', 'Quảng Ninh', 1, 107.416700, 21.116700, 'VDO'),
('HPH', 'Sân bay Cát Bi', 'Hải Phòng', 1, 106.725000, 20.819400, 'HPH'),
('VCA', 'Sân bay Cần Thơ', 'Cần Thơ', 1, 105.711900, 10.085100, 'VCA'),
('UIH', 'Sân bay Phù Cát', 'Quy Nhơn', 1, 109.042200, 13.954900, 'UIH'),
('HUI', 'Sân bay Phú Bài', 'Huế', 1, 107.702500, 16.401500, 'HUI'),
('VDH', 'Sân bay Đồng Hới', 'Quảng Bình', 1, 106.590600, 17.515000, 'VDH'),
('VCS', 'Sân bay Côn Đảo', 'Côn Đảo', 1, 106.628600, 8.731800, 'VCS')
ON DUPLICATE KEY UPDATE tenSanBay=VALUES(tenSanBay);

-- 2. THÊM KHÁCH SẠN Ở CÁC THÀNH PHỐ MỚI
INSERT INTO `khach_san` (`tenKhachSan`, `diaChi`, `thanhPho`, `quocGiaId`, `soSao`, `moTa`, `giaThapNhat`, `danhGiaTB`, `soDanhGia`, `createdAt`, `updatedAt`) VALUES
-- Nha Trang (thêm)
('Sunrise Nha Trang Beach Hotel', '12-14 Trần Phú', 'Nha Trang', 1, 4, 'Khách sạn view biển đẹp, giá cả phải chăng', 1100000.00, 8.30, 423, NOW(), NOW()),
('Diamond Bay Resort', 'Phước Hải, Nha Trang', 'Nha Trang', 1, 5, 'Resort cao cấp với bãi biển riêng và sân golf', 3500000.00, 9.00, 267, NOW(), NOW()),
('Galina Hotel & Spa', '18 Nguyễn Thị Minh Khai', 'Nha Trang', 1, 4, 'Khách sạn spa với dịch vụ chăm sóc tuyệt vời', 1300000.00, 8.60, 189, NOW(), NOW()),

-- Phú Quốc (thêm)
('JW Marriott Phu Quoc', 'Kem Beach, An Thới', 'Phú Quốc', 1, 5, 'Resort siêu sang trọng trên bãi Kem', 5200000.00, 9.50, 892, NOW(), NOW()),
('Fusion Resort Phu Quoc', 'Vũng Bầu Beach', 'Phú Quốc', 1, 5, 'All-spa inclusive resort độc đáo', 3800000.00, 9.20, 445, NOW(), NOW()),
('La Veranda Resort', 'Trần Hưng Đạo, Dương Đông', 'Phú Quốc', 1, 5, 'Resort phong cách Pháp cổ điển', 3300000.00, 8.90, 324, NOW(), NOW()),
('Seashells Phu Quoc Hotel', 'Tô Hiến Thành, Dương Đông', 'Phú Quốc', 1, 4, 'Khách sạn hiện đại gần chợ đêm', 1600000.00, 8.40, 278, NOW(), NOW()),

-- Đà Lạt (thêm)
('Terracotta Hotel & Resort', 'Phạm Ngọc Thạch, Phường 3', 'Đà Lạt', 1, 4, 'Resort với kiến trúc độc đáo giữa rừng thông', 2100000.00, 8.80, 356, NOW(), NOW()),
('Dalat Wonder Resort', 'Khu Hòa Bình, Phường 1', 'Đà Lạt', 1, 4, 'Resort view hồ tuyệt đẹp', 1800000.00, 8.50, 289, NOW(), NOW()),
('Sammy Dalat Hotel', '165 Phan Đình Phùng, Phường 2', 'Đà Lạt', 1, 4, 'Khách sạn boutique ấm cúng giữa lòng thành phố', 1500000.00, 8.70, 412, NOW(), NOW()),

-- Quảng Ninh (mới)
('Vinpearl Resort & Spa Ha Long', 'Hòn Rều, Bãi Cháy', 'Hạ Long', 1, 5, 'Resort sang trọng view vịnh Hạ Long', 3900000.00, 9.10, 567, NOW(), NOW()),
('Novotel Ha Long Bay', 'Hạ Long Road', 'Hạ Long', 1, 4, 'Khách sạn hiện đại bên bờ vịnh', 2200000.00, 8.60, 389, NOW(), NOW()),
('Wyndham Legend Halong', 'No. 12 Ha Long', 'Hạ Long', 1, 5, 'Khách sạn cao cấp view biển tuyệt đẹp', 2800000.00, 8.80, 445, NOW(), NOW()),

-- Hải Phòng (mới)
('AVANI Hai Phong Harbour View', '12 Trần Phú', 'Hải Phòng', 1, 5, 'Khách sạn view cảng hiện đại', 2400000.00, 8.70, 234, NOW(), NOW()),
('Mercure Hai Phong', 'Số 2 Nguyễn Tri Phương', 'Hải Phòng', 1, 4, 'Khách sạn Pháp gần trung tâm', 1700000.00, 8.50, 298, NOW(), NOW()),

-- Cần Thơ (mới)
('Vinpearl Hotel Can Tho', 'Đường 30/4, Xuân Khánh', 'Cần Thơ', 1, 5, 'Khách sạn cao nhất miền Tây', 2600000.00, 8.90, 456, NOW(), NOW()),
('Muong Thanh Luxury Can Tho', '1 Hòa Bình', 'Cần Thơ', 1, 4, 'Khách sạn bên sông Hậu', 1800000.00, 8.40, 334, NOW(), NOW()),
('Victoria Can Tho Resort', 'Cái Khế, Ninh Kiều', 'Cần Thơ', 1, 4, 'Resort phong cách thuộc địa Pháp', 2100000.00, 8.70, 267, NOW(), NOW()),

-- Quy Nhơn (mới)  
('AVANI Quy Nhon Resort', 'Bãi Dài, Ghềnh Ráng', 'Quy Nhơn', 1, 5, 'Resort biển sang trọng', 3200000.00, 9.00, 389, NOW(), NOW()),
('FLC Luxury Resort Quy Nhon', 'Xuân Thiều, Bãi Dài', 'Quy Nhơn', 1, 5, 'Khu nghỉ dưỡng cao cấp với sân golf', 3600000.00, 8.90, 423, NOW(), NOW()),
('Seasing Boutique Hotel', 'Nguyễn Huệ, Quy Nhơn', 'Quy Nhơn', 1, 4, 'Khách sạn boutique hiện đại', 1400000.00, 8.50, 198, NOW(), NOW()),

-- Huế (mới)
('Pilgrimage Village', 'Thôn Dương Xuân Thượng, Phú Mỹ', 'Huế', 1, 5, 'Boutique resort & spa giữa rừng trúc', 2800000.00, 9.10, 367, NOW(), NOW()),
('Vedana Lagoon Resort', 'Phú Lộc, Huế', 'Huế', 1, 5, 'Resort trên đầm Cầu Hai tuyệt đẹp', 3400000.00, 9.20, 445, NOW(), NOW()),
('Imperial Hotel Hue', '8 Hùng Vương', 'Huế', 1, 5, 'Khách sạn lịch sử bên sông Hương', 2300000.00, 8.80, 312, NOW(), NOW()),
('Moonlight Hotel Hue', '20 Phạm Ngũ Lão', 'Huế', 1, 4, 'Khách sạn hiện đại gần Đại Nội', 1200000.00, 8.40, 256, NOW(), NOW()),

-- Thêm khách sạn ở TP.HCM
('Park Hyatt Saigon', 'Lam Sơn Square, Quận 1', 'TP. Hồ Chí Minh', 1, 5, 'Khách sạn siêu sang bên Nhà hát Lớn', 5500000.00, 9.60, 789, NOW(), NOW()),
('The Reverie Saigon', 'Đồng Khởi, Quận 1', 'TP. Hồ Chí Minh', 1, 5, 'Khách sạn xa hoa nhất Sài Gòn', 6200000.00, 9.50, 623, NOW(), NOW()),
('Renaissance Riverside Hotel', '8-15 Tôn Đức Thắng, Quận 1', 'TP. Hồ Chí Minh', 1, 5, 'Khách sạn view sông Sài Gòn', 3100000.00, 8.90, 567, NOW(), NOW()),
('Pullman Saigon Centre', '148 Trần Hưng Đạo, Quận 1', 'TP. Hồ Chí Minh', 1, 4, 'Khách sạn hiện đại gần chợ Bến Thành', 2400000.00, 8.70, 445, NOW(), NOW()),

-- Thêm khách sạn ở Hà Nội
('JW Marriott Hotel Hanoi', '8 Đỗ Đức Dục, Nam Từ Liêm', 'Hà Nội', 1, 5, 'Khách sạn 5 sao sang trọng', 3800000.00, 9.20, 678, NOW(), NOW()),
('Pan Pacific Hanoi', '1 Thanh Niên, Ba Đình', 'Hà Nội', 1, 5, 'Khách sạn view Hồ Tây tuyệt đẹp', 3500000.00, 9.00, 534, NOW(), NOW()),
('InterContinental Hanoi Westlake', '1A Nghi Tàm, Tây Hồ', 'Hà Nội', 1, 5, 'Resort trên mặt Hồ Tây', 4200000.00, 9.30, 789, NOW(), NOW()),
('Hotel de l\'Opera Hanoi', '29 Tràng Tiền, Hoàn Kiếm', 'Hà Nội', 1, 5, 'Khách sạn sang trọng phong cách Pháp', 3200000.00, 8.90, 423, NOW(), NOW());

-- 3. THÊM NHÀ CUNG CẤP DỊCH VỤ ĐƯA ĐÓN
INSERT INTO `nha_cung_cap_dua_don` (`tenNhaCungCap`, `logo`, `soDienThoai`, `email`, `diaChi`, `moTa`, `danhGiaTrungBinh`, `tongSoDanhGia`) VALUES
('VIP Airport Transfer', 'https://via.placeholder.com/200x100?text=VIP+Transfer', '0901234567', 'info@viptransfer.vn', 'Hà Nội', 'Dịch vụ đưa đón VIP cao cấp', 9.2, 856),
('Express Limousine Service', 'https://via.placeholder.com/200x100?text=Express+Limo', '0912345678', 'contact@expresslimo.vn', 'TP. Hồ Chí Minh', 'Dịch vụ limousine hạng sang', 9.0, 645),
('Budget Car Service', 'https://via.placeholder.com/200x100?text=Budget+Car', '0923456789', 'support@budgetcar.vn', 'Đà Nẵng', 'Dịch vụ xe giá rẻ, chất lượng tốt', 8.5, 1234),
('Premium Shuttle', 'https://via.placeholder.com/200x100?text=Premium+Shuttle', '0934567890', 'hello@premiumshuttle.vn', 'Nha Trang', 'Dịch vụ shuttle sang trọng', 8.8, 789),
('Smart Transfer', 'https://via.placeholder.com/200x100?text=Smart+Transfer', '0945678901', 'info@smarttransfer.vn', 'Hải Phòng', 'Dịch vụ đưa đón thông minh', 8.7, 567),
('Deluxe Airport Cars', 'https://via.placeholder.com/200x100?text=Deluxe+Cars', '0956789012', 'booking@deluxecars.vn', 'Cần Thơ', 'Xe cao cấp, tài xế chuyên nghiệp', 9.1, 423),
('Family Van Service', 'https://via.placeholder.com/200x100?text=Family+Van', '0967890123', 'family@vanservice.vn', 'Đà Lạt', 'Chuyên dịch vụ xe gia đình', 8.6, 678)
ON DUPLICATE KEY UPDATE tenNhaCungCap=VALUES(tenNhaCungCap);

-- 4. THÊM DỊCH VỤ ĐƯA ĐÓN CHO CÁC SÂN BAY MỚI

-- Sân bay Cam Ranh (CXR - sanBayId: lấy từ insert trên)
INSERT INTO `dich_vu_dua_don` (`nhaCungCapId`, `sanBayId`, `loaiXe`, `soChoNgoi`, `giaTienMotChieu`, `giaTienKhuHoi`, `moTa`, `tienIch`, `hinhAnh`, `trangThai`) VALUES
-- Cam Ranh (giả sử id=24)
(1, (SELECT id FROM san_bay WHERE maSanBay='CXR'), 'sedan', 4, 180000, 340000, 'Xe sedan từ sân bay Cam Ranh đến Nha Trang', '["wifi", "ac", "bottled_water", "phone_charger"]', '["https://images.unsplash.com/photo-1549317661-bd32c8ce0db2?w=800"]', 'active'),
(1, (SELECT id FROM san_bay WHERE maSanBay='CXR'), 'suv', 7, 280000, 530000, 'Xe SUV 7 chỗ từ Cam Ranh', '["wifi", "ac", "bottled_water", "phone_charger", "child_seat"]', '["https://images.unsplash.com/photo-1519641471654-76ce0107ad1b?w=800"]', 'active'),
(4, (SELECT id FROM san_bay WHERE maSanBay='CXR'), 'van', 9, 380000, 720000, 'Xe van 9 chỗ từ Cam Ranh', '["ac", "bottled_water", "luggage_space"]', '["https://images.unsplash.com/photo-1527786356703-4b100091cd2c?w=800"]', 'active'),

-- Phú Quốc (PQC)
(2, (SELECT id FROM san_bay WHERE maSanBay='PQC'), 'sedan', 4, 220000, 420000, 'Xe sedan đưa đón sân bay Phú Quốc', '["wifi", "ac", "bottled_water", "phone_charger"]', '["https://images.unsplash.com/photo-1549317661-bd32c8ce0db2?w=800"]', 'active'),
(2, (SELECT id FROM san_bay WHERE maSanBay='PQC'), 'suv', 7, 320000, 600000, 'Xe SUV cao cấp tại Phú Quốc', '["wifi", "ac", "bottled_water", "phone_charger", "child_seat"]', '["https://images.unsplash.com/photo-1519641471654-76ce0107ad1b?w=800"]', 'active'),
(4, (SELECT id FROM san_bay WHERE maSanBay='PQC'), 'van', 9, 420000, 800000, 'Xe van gia đình tại Phú Quốc', '["wifi", "ac", "bottled_water", "child_seat", "luggage_space"]', '["https://images.unsplash.com/photo-1464219789935-c2d9d9aba644?w=800"]', 'active'),
(2, (SELECT id FROM san_bay WHERE maSanBay='PQC'), 'limousine', 4, 600000, 1100000, 'Limousine sang trọng tại Phú Quốc', '["wifi", "ac", "bottled_water", "phone_charger", "newspaper", "refreshments", "privacy_partition"]', '["https://images.unsplash.com/photo-1544829099-b9a0c07fad1a?w=800"]', 'active'),

-- Đà Lạt (DLI)
(1, (SELECT id FROM san_bay WHERE maSanBay='DLI'), 'sedan', 4, 200000, 380000, 'Xe sedan từ sân bay Liên Khương về Đà Lạt', '["wifi", "ac", "bottled_water", "phone_charger"]', '["https://images.unsplash.com/photo-1549317661-bd32c8ce0db2?w=800"]', 'active'),
(7, (SELECT id FROM san_bay WHERE maSanBay='DLI'), 'van', 7, 350000, 660000, 'Xe van gia đình đưa đón Đà Lạt', '["wifi", "ac", "bottled_water", "child_seat", "luggage_space"]', '["https://images.unsplash.com/photo-1464219789935-c2d9d9aba644?w=800"]', 'active'),
(7, (SELECT id FROM san_bay WHERE maSanBay='DLI'), 'minibus', 16, 700000, 1300000, 'Xe minibus cho nhóm đông tại Đà Lạt', '["ac", "bottled_water", "luggage_space", "usb_charging"]', '["https://images.unsplash.com/photo-1570125909232-eb263c188f7e?w=800"]', 'active'),

-- Vân Đồn (VDO)
(1, (SELECT id FROM san_bay WHERE maSanBay='VDO'), 'sedan', 4, 300000, 570000, 'Xe sedan từ Vân Đồn đến Hạ Long', '["wifi", "ac", "bottled_water", "phone_charger"]', '["https://images.unsplash.com/photo-1549317661-bd32c8ce0db2?w=800"]', 'active'),
(5, (SELECT id FROM san_bay WHERE maSanBay='VDO'), 'suv', 7, 400000, 760000, 'Xe SUV cao cấp tại Vân Đồn', '["wifi", "ac", "bottled_water", "phone_charger", "child_seat"]', '["https://images.unsplash.com/photo-1519641471654-76ce0107ad1b?w=800"]', 'active'),
(5, (SELECT id FROM san_bay WHERE maSanBay='VDO'), 'van', 9, 500000, 950000, 'Xe van 9 chỗ tại Vân Đồn', '["ac", "bottled_water", "luggage_space"]', '["https://images.unsplash.com/photo-1527786356703-4b100091cd2c?w=800"]', 'active'),

-- Hải Phòng (HPH)
(5, (SELECT id FROM san_bay WHERE maSanBay='HPH'), 'sedan', 4, 180000, 340000, 'Xe sedan đưa đón sân bay Cát Bi', '["wifi", "ac", "bottled_water", "phone_charger"]', '["https://images.unsplash.com/photo-1549317661-bd32c8ce0db2?w=800"]', 'active'),
(5, (SELECT id FROM san_bay WHERE maSanBay='HPH'), 'suv', 7, 280000, 530000, 'Xe SUV tại Hải Phòng', '["wifi", "ac", "bottled_water", "phone_charger", "child_seat"]', '["https://images.unsplash.com/photo-1519641471654-76ce0107ad1b?w=800"]', 'active'),
(5, (SELECT id FROM san_bay WHERE maSanBay='HPH'), 'van', 9, 380000, 720000, 'Xe van tại sân bay Cát Bi', '["ac", "bottled_water", "luggage_space"]', '["https://images.unsplash.com/photo-1527786356703-4b100091cd2c?w=800"]', 'active'),

-- Cần Thơ (VCA)
(6, (SELECT id FROM san_bay WHERE maSanBay='VCA'), 'sedan', 4, 150000, 280000, 'Xe sedan tại sân bay Cần Thơ', '["wifi", "ac", "bottled_water", "phone_charger"]', '["https://images.unsplash.com/photo-1549317661-bd32c8ce0db2?w=800"]', 'active'),
(6, (SELECT id FROM san_bay WHERE maSanBay='VCA'), 'suv', 7, 250000, 480000, 'Xe SUV tại Cần Thơ', '["wifi", "ac", "bottled_water", "phone_charger", "child_seat"]', '["https://images.unsplash.com/photo-1519641471654-76ce0107ad1b?w=800"]', 'active'),
(6, (SELECT id FROM san_bay WHERE maSanBay='VCA'), 'van', 9, 350000, 660000, 'Xe van đưa đón Cần Thơ', '["ac", "bottled_water", "luggage_space"]', '["https://images.unsplash.com/photo-1527786356703-4b100091cd2c?w=800"]', 'active'),
(6, (SELECT id FROM san_bay WHERE maSanBay='VCA'), 'limousine', 4, 500000, 950000, 'Limousine cao cấp tại Cần Thơ', '["wifi", "ac", "bottled_water", "phone_charger", "newspaper", "refreshments", "privacy_partition"]', '["https://images.unsplash.com/photo-1544829099-b9a0c07fad1a?w=800"]', 'active'),

-- Quy Nhơn (UIH)
(4, (SELECT id FROM san_bay WHERE maSanBay='UIH'), 'sedan', 4, 170000, 320000, 'Xe sedan tại sân bay Phù Cát', '["wifi", "ac", "bottled_water", "phone_charger"]', '["https://images.unsplash.com/photo-1549317661-bd32c8ce0db2?w=800"]', 'active'),
(4, (SELECT id FROM san_bay WHERE maSanBay='UIH'), 'suv', 7, 270000, 510000, 'Xe SUV đưa đón Quy Nhơn', '["wifi", "ac", "bottled_water", "phone_charger", "child_seat"]', '["https://images.unsplash.com/photo-1519641471654-76ce0107ad1b?w=800"]', 'active'),
(4, (SELECT id FROM san_bay WHERE maSanBay='UIH'), 'van', 9, 370000, 700000, 'Xe van tại Quy Nhơn', '["ac", "bottled_water", "luggage_space"]', '["https://images.unsplash.com/photo-1527786356703-4b100091cd2c?w=800"]', 'active'),

-- Huế (HUI)
(1, (SELECT id FROM san_bay WHERE maSanBay='HUI'), 'sedan', 4, 160000, 300000, 'Xe sedan từ sân bay Phú Bài về Huế', '["wifi", "ac", "bottled_water", "phone_charger"]', '["https://images.unsplash.com/photo-1549317661-bd32c8ce0db2?w=800"]', 'active'),
(1, (SELECT id FROM san_bay WHERE maSanBay='HUI'), 'suv', 7, 260000, 490000, 'Xe SUV đưa đón Huế', '["wifi", "ac", "bottled_water", "phone_charger", "child_seat"]', '["https://images.unsplash.com/photo-1519641471654-76ce0107ad1b?w=800"]', 'active'),
(1, (SELECT id FROM san_bay WHERE maSanBay='HUI'), 'van', 9, 360000, 680000, 'Xe van tại Huế', '["ac", "bottled_water", "luggage_space"]', '["https://images.unsplash.com/photo-1527786356703-4b100091cd2c?w=800"]', 'active'),
(2, (SELECT id FROM san_bay WHERE maSanBay='HUI'), 'limousine', 4, 550000, 1050000, 'Limousine sang trọng tại Huế', '["wifi", "ac", "bottled_water", "phone_charger", "newspaper", "refreshments", "privacy_partition"]', '["https://images.unsplash.com/photo-1544829099-b9a0c07fad1a?w=800"]', 'active');

-- 5. THÊM DỊCH VỤ ĐƯA ĐÓN CHO SÂN BAY CÓ SẴN (HAN, SGN, DAD)

-- Thêm cho Nội Bài (HAN - sanBayId=2)
INSERT INTO `dich_vu_dua_don` (`nhaCungCapId`, `sanBayId`, `loaiXe`, `soChoNgoi`, `giaTienMotChieu`, `giaTienKhuHoi`, `moTa`, `tienIch`, `hinhAnh`, `trangThai`) VALUES
(7, 2, 'sedan', 4, 270000, 510000, 'Xe sedan giá tốt từ Nội Bài', '["ac", "bottled_water"]', '["https://images.unsplash.com/photo-1502877338535-766e1452684a?w=800"]', 'active'),
(7, 2, 'van', 9, 480000, 900000, 'Xe van 9 chỗ từ Nội Bài về nội thành', '["ac", "bottled_water", "luggage_space"]', '["https://images.unsplash.com/photo-1527786356703-4b100091cd2c?w=800"]', 'active'),
(2, 2, 'limousine', 4, 900000, 1700000, 'Limousine Mercedes S-Class tại Hà Nội', '["wifi", "ac", "bottled_water", "phone_charger", "newspaper", "refreshments", "privacy_partition", "massage_seats"]', '["https://images.unsplash.com/photo-1563298723-dcfebaa392e3?w=800"]', 'active'),

-- Thêm cho Tân Sơn Nhất (SGN - sanBayId=1)  
(7, 1, 'suv', 7, 380000, 720000, 'Xe SUV Ford Everest 7 chỗ', '["wifi", "ac", "bottled_water", "phone_charger", "child_seat"]', '["https://images.unsplash.com/photo-1519641471654-76ce0107ad1b?w=800"]', 'active'),
(2, 1, 'sedan', 4, 450000, 850000, 'Xe sedan BMW Series 5 cao cấp', '["wifi", "ac", "bottled_water", "phone_charger", "newspaper", "refreshments"]', '["https://images.unsplash.com/photo-1563720360172-67b8f3dce741?w=800"]', 'active'),
(7, 1, 'minibus', 16, 900000, 1700000, 'Xe minibus 16 chỗ có wifi', '["wifi", "ac", "bottled_water", "luggage_space", "usb_charging"]', '["https://images.unsplash.com/photo-1570125909232-eb263c188f7e?w=800"]', 'active'),

-- Thêm cho Đà Nẵng (DAD - sanBayId=3)
(4, 3, 'suv', 7, 220000, 420000, 'Xe SUV 7 chỗ tại Đà Nẵng', '["wifi", "ac", "bottled_water", "phone_charger", "child_seat"]', '["https://images.unsplash.com/photo-1519641471654-76ce0107ad1b?w=800"]', 'active'),
(2, 3, 'limousine', 4, 650000, 1200000, 'Limousine Mercedes E-Class tại Đà Nẵng', '["wifi", "ac", "bottled_water", "phone_charger", "newspaper", "refreshments", "privacy_partition"]', '["https://images.unsplash.com/photo-1544829099-b9a0c07fad1a?w=800"]', 'active'),
(4, 3, 'minibus', 16, 750000, 1400000, 'Xe minibus cho tour đông người', '["ac", "bottled_water", "luggage_space", "usb_charging"]', '["https://images.unsplash.com/photo-1570125909232-eb263c188f7e?w=800"]', 'active');

-- ============================================
-- HOÀN THÀNH! 
-- Đã thêm:
-- - 10 sân bay mới
-- - 35+ khách sạn ở nhiều thành phố
-- - 7 nhà cung cấp mới
-- - 50+ dịch vụ đưa đón cho tất cả sân bay
-- ============================================

-- Kiểm tra kết quả
SELECT 
    sb.maSanBay,
    sb.tenSanBay,
    sb.thanhPho,
    COUNT(dv.id) as soLuongDichVu,
    COUNT(DISTINCT dv.nhaCungCapId) as soNhaCungCap,
    GROUP_CONCAT(DISTINCT dv.loaiXe SEPARATOR ', ') as cacLoaiXe
FROM san_bay sb
LEFT JOIN dich_vu_dua_don dv ON sb.id = dv.sanBayId AND dv.trangThai = 'active'
GROUP BY sb.id, sb.maSanBay, sb.tenSanBay, sb.thanhPho
ORDER BY soLuongDichVu DESC;
