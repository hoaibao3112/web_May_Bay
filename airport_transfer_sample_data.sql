-- =====================================================
-- AIRPORT TRANSFER SERVICE DATABASE
-- Dữ liệu mẫu cho chức năng Đưa đón sân bay
-- =====================================================

-- =====================================================
-- 1. NHÀ CUNG CẤP DỊCH VỤ ĐƯA ĐÓN
-- =====================================================

DROP TABLE IF EXISTS `danh_gia_dua_don`;
DROP TABLE IF EXISTS `dat_dich_vu_dua_don`;
DROP TABLE IF EXISTS `dich_vu_dua_don`;
DROP TABLE IF EXISTS `nha_cung_cap_dua_don`;

CREATE TABLE `nha_cung_cap_dua_don` (
  `id` INT AUTO_INCREMENT PRIMARY KEY,
  `tenNhaCungCap` VARCHAR(255) NOT NULL,
  `logo` VARCHAR(500),
  `soDienThoai` VARCHAR(20),
  `email` VARCHAR(255),
  `diaChi` TEXT,
  `moTa` TEXT,
  `danhGiaTrungBinh` DECIMAL(2,1) DEFAULT 0,
  `tongSoDanhGia` INT DEFAULT 0,
  `createdAt` DATETIME(3) DEFAULT CURRENT_TIMESTAMP(3),
  `updatedAt` DATETIME(3) DEFAULT CURRENT_TIMESTAMP(3) ON UPDATE CURRENT_TIMESTAMP(3)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Dữ liệu mẫu nhà cung cấp
INSERT INTO `nha_cung_cap_dua_don` 
(`tenNhaCungCap`, `logo`, `soDienThoai`, `email`, `diaChi`, `moTa`, `danhGiaTrungBinh`, `tongSoDanhGia`) 
VALUES
('Airport Shuttle Express', 'https://via.placeholder.com/150/0066cc/ffffff?text=ASE', '1900-1234', 'info@airportshuttle.vn', 'Số 123 Trường Chinh, Hà Nội', 'Dịch vụ đưa đón sân bay chuyên nghiệp, xe mới, tài xế giàu kinh nghiệm', 4.8, 1250),
('VIP Transfer Service', 'https://via.placeholder.com/150/ff6600/ffffff?text=VIP', '1900-5678', 'contact@viptransfer.vn', 'Số 456 Nguyễn Trãi, TP.HCM', 'Dịch vụ đưa đón cao cấp với đội xe sang trọng', 4.9, 890),
('Budget Airport Ride', 'https://via.placeholder.com/150/00cc66/ffffff?text=BAR', '1900-9012', 'support@budgetride.vn', 'Số 789 Lê Lợi, Đà Nẵng', 'Dịch vụ đưa đón giá rẻ, tiết kiệm cho mọi người', 4.5, 2100),
('Luxury Limousine', 'https://via.placeholder.com/150/cc0066/ffffff?text=LL', '1900-3456', 'booking@luxurylimo.vn', 'Số 321 Hai Bà Trưng, Hà Nội', 'Dịch vụ limousine sang trọng, phục vụ khách VIP', 5.0, 450),
('Family Van Service', 'https://via.placeholder.com/150/6600cc/ffffff?text=FVS', '1900-7890', 'hello@familyvan.vn', 'Số 654 Điện Biên Phủ, TP.HCM', 'Chuyên xe van gia đình, phù hợp cho nhóm đông người', 4.7, 780),
('Green Eco Transfer', 'https://via.placeholder.com/150/009933/ffffff?text=GET', '1900-2468', 'eco@greentransfer.vn', 'Số 987 Lý Thường Kiệt, Hà Nội', 'Dịch vụ xe điện thân thiện môi trường', 4.6, 320);

-- =====================================================
-- 2. DỊCH VỤ ĐƯA ĐÓN
-- =====================================================

CREATE TABLE `dich_vu_dua_don` (
  `id` INT AUTO_INCREMENT PRIMARY KEY,
  `nhaCungCapId` INT NOT NULL,
  `sanBayId` INT NOT NULL,
  `loaiXe` ENUM('sedan', 'suv', 'van', 'minibus', 'limousine') NOT NULL,
  `soChoNgoi` INT NOT NULL,
  `giaTienMotChieu` DECIMAL(10,2) NOT NULL,
  `giaTienKhuHoi` DECIMAL(10,2),
  `moTa` TEXT,
  `tienIch` JSON,
  `hinhAnh` JSON,
  `trangThai` ENUM('active', 'inactive') DEFAULT 'active',
  `createdAt` DATETIME(3) DEFAULT CURRENT_TIMESTAMP(3),
  `updatedAt` DATETIME(3) DEFAULT CURRENT_TIMESTAMP(3) ON UPDATE CURRENT_TIMESTAMP(3),
  FOREIGN KEY (`nhaCungCapId`) REFERENCES `nha_cung_cap_dua_don`(`id`) ON DELETE CASCADE,
  FOREIGN KEY (`sanBayId`) REFERENCES `san_bay`(`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Dữ liệu mẫu dịch vụ đưa đón
-- Sân bay Nội Bài (id=1)
INSERT INTO `dich_vu_dua_don` 
(`nhaCungCapId`, `sanBayId`, `loaiXe`, `soChoNgoi`, `giaTienMotChieu`, `giaTienKhuHoi`, `moTa`, `tienIch`, `hinhAnh`, `trangThai`) 
VALUES
-- Airport Shuttle Express - Nội Bài
(1, 1, 'sedan', 4, 250000, 450000, 'Xe sedan 4 chỗ thoải mái, phù hợp cho cá nhân và gia đình nhỏ', 
 '["wifi", "ac", "bottled_water", "phone_charger"]', 
 '["https://images.unsplash.com/photo-1549317661-bd32c8ce0db2?w=800", "https://images.unsplash.com/photo-1552519507-da3b142c6e3d?w=800"]', 
 'active'),
(1, 1, 'suv', 7, 350000, 650000, 'Xe SUV 7 chỗ rộng rãi, hành lý nhiều', 
 '["wifi", "ac", "bottled_water", "phone_charger", "child_seat"]', 
 '["https://images.unsplash.com/photo-1519641471654-76ce0107ad1b?w=800"]', 
 'active'),

-- VIP Transfer Service - Nội Bài
(2, 1, 'sedan', 4, 400000, 750000, 'Xe sedan cao cấp Mercedes E-Class, dịch vụ VIP', 
 '["wifi", "ac", "bottled_water", "phone_charger", "newspaper", "refreshments"]', 
 '["https://images.unsplash.com/photo-1563720360172-67b8f3dce741?w=800"]', 
 'active'),
(2, 1, 'limousine', 4, 800000, 1500000, 'Limousine sang trọng, phục vụ khách VIP và doanh nhân', 
 '["wifi", "ac", "bottled_water", "phone_charger", "newspaper", "refreshments", "privacy_partition"]', 
 '["https://images.unsplash.com/photo-1544829099-b9a0c07fad1a?w=800"]', 
 'active'),

-- Budget Airport Ride - Nội Bài
(3, 1, 'sedan', 4, 200000, 380000, 'Xe sedan giá rẻ, tiết kiệm chi phí', 
 '["ac", "bottled_water"]', 
 '["https://images.unsplash.com/photo-1502877338535-766e1452684a?w=800"]', 
 'active'),
(3, 1, 'van', 9, 450000, 850000, 'Xe van 9 chỗ, phù hợp cho nhóm đông', 
 '["ac", "bottled_water", "luggage_space"]', 
 '["https://images.unsplash.com/photo-1527786356703-4b100091cd2c?w=800"]', 
 'active'),

-- Luxury Limousine - Nội Bài
(4, 1, 'limousine', 4, 1200000, 2200000, 'Limousine hạng sang Maybach, trải nghiệm đẳng cấp', 
 '["wifi", "ac", "bottled_water", "phone_charger", "newspaper", "refreshments", "privacy_partition", "massage_seats", "entertainment_system"]', 
 '["https://images.unsplash.com/photo-1563298723-dcfebaa392e3?w=800"]', 
 'active'),

-- Family Van Service - Nội Bài
(5, 1, 'van', 7, 380000, 720000, 'Xe van gia đình 7 chỗ, rộng rãi thoải mái', 
 '["wifi", "ac", "bottled_water", "child_seat", "luggage_space"]', 
 '["https://images.unsplash.com/photo-1464219789935-c2d9d9aba644?w=800"]', 
 'active'),
(5, 1, 'minibus', 16, 800000, 1500000, 'Xe minibus 16 chỗ cho nhóm lớn', 
 '["ac", "bottled_water", "luggage_space", "usb_charging"]', 
 '["https://images.unsplash.com/photo-1570125909232-eb263c188f7e?w=800"]', 
 'active'),

-- Green Eco Transfer - Nội Bài
(6, 1, 'sedan', 4, 280000, 530000, 'Xe điện Tesla Model 3, thân thiện môi trường', 
 '["wifi", "ac", "bottled_water", "phone_charger", "eco_friendly"]', 
 '["https://images.unsplash.com/photo-1560958089-b8a1929cea89?w=800"]', 
 'active'),

-- Sân bay Tân Sơn Nhất (id=2)
(1, 2, 'sedan', 4, 280000, 520000, 'Xe sedan 4 chỗ thoải mái từ/đến Tân Sơn Nhất', 
 '["wifi", "ac", "bottled_water", "phone_charger"]', 
 '["https://images.unsplash.com/photo-1549317661-bd32c8ce0db2?w=800"]', 
 'active'),
(1, 2, 'suv', 7, 380000, 720000, 'Xe SUV 7 chỗ rộng rãi', 
 '["wifi", "ac", "bottled_water", "phone_charger", "child_seat"]', 
 '["https://images.unsplash.com/photo-1519641471654-76ce0107ad1b?w=800"]', 
 'active'),

(2, 2, 'sedan', 4, 450000, 850000, 'Xe sedan cao cấp Mercedes từ/đến Tân Sơn Nhất', 
 '["wifi", "ac", "bottled_water", "phone_charger", "newspaper", "refreshments"]', 
 '["https://images.unsplash.com/photo-1563720360172-67b8f3dce741?w=800"]', 
 'active'),

(3, 2, 'sedan', 4, 220000, 420000, 'Xe sedan giá rẻ từ/đến Tân Sơn Nhất', 
 '["ac", "bottled_water"]', 
 '["https://images.unsplash.com/photo-1502877338535-766e1452684a?w=800"]', 
 'active'),
(3, 2, 'van', 9, 500000, 950000, 'Xe van 9 chỗ', 
 '["ac", "bottled_water", "luggage_space"]', 
 '["https://images.unsplash.com/photo-1527786356703-4b100091cd2c?w=800"]', 
 'active'),

(5, 2, 'van', 7, 420000, 800000, 'Xe van gia đình 7 chỗ từ/đến Tân Sơn Nhất', 
 '["wifi", "ac", "bottled_water", "child_seat", "luggage_space"]', 
 '["https://images.unsplash.com/photo-1464219789935-c2d9d9aba644?w=800"]', 
 'active'),

-- Sân bay Đà Nẵng (id=3)
(1, 3, 'sedan', 4, 180000, 340000, 'Xe sedan 4 chỗ từ/đến sân bay Đà Nẵng', 
 '["wifi", "ac", "bottled_water", "phone_charger"]', 
 '["https://images.unsplash.com/photo-1549317661-bd32c8ce0db2?w=800"]', 
 'active'),

(3, 3, 'sedan', 4, 150000, 280000, 'Xe sedan giá rẻ từ/đến Đà Nẵng', 
 '["ac", "bottled_water"]', 
 '["https://images.unsplash.com/photo-1502877338535-766e1452684a?w=800"]', 
 'active'),
(3, 3, 'van', 9, 350000, 660000, 'Xe van 9 chỗ từ/đến Đà Nẵng', 
 '["ac", "bottled_water", "luggage_space"]', 
 '["https://images.unsplash.com/photo-1527786356703-4b100091cd2c?w=800"]', 
 'active'),

(5, 3, 'van', 7, 280000, 530000, 'Xe van gia đình 7 chỗ từ/đến Đà Nẵng', 
 '["wifi", "ac", "bottled_water", "child_seat", "luggage_space"]', 
 '["https://images.unsplash.com/photo-1464219789935-c2d9d9aba644?w=800"]', 
 'active');

-- =====================================================
-- 3. ĐẶT DỊCH VỤ ĐƯA ĐÓN
-- =====================================================

CREATE TABLE `dat_dich_vu_dua_don` (
  `id` INT AUTO_INCREMENT PRIMARY KEY,
  `dichVuId` INT NOT NULL,
  `userId` INT NOT NULL,
  `loaiDichVu` ENUM('mot_chieu', 'khu_hoi') NOT NULL,
  
  -- Thông tin chuyến đi
  `ngayDon` DATETIME NOT NULL,
  `diemDon` VARCHAR(500) NOT NULL,
  `diemTra` VARCHAR(500) NOT NULL,
  `soHanhKhach` INT NOT NULL,
  
  -- Chuyến về (nếu khứ hồi)
  `ngayTra` DATETIME,
  
  -- Thông tin liên hệ
  `tenKhachHang` VARCHAR(255) NOT NULL,
  `soDienThoai` VARCHAR(20) NOT NULL,
  `email` VARCHAR(255),
  `ghiChu` TEXT,
  
  -- Thanh toán
  `tongTien` DECIMAL(10,2) NOT NULL,
  `trangThaiThanhToan` ENUM('pending', 'paid', 'refunded') DEFAULT 'pending',
  `phuongThucThanhToan` VARCHAR(50),
  
  -- Trạng thái
  `trangThai` ENUM('pending', 'confirmed', 'completed', 'cancelled') DEFAULT 'pending',
  
  `createdAt` DATETIME(3) DEFAULT CURRENT_TIMESTAMP(3),
  `updatedAt` DATETIME(3) DEFAULT CURRENT_TIMESTAMP(3) ON UPDATE CURRENT_TIMESTAMP(3),
  FOREIGN KEY (`dichVuId`) REFERENCES `dich_vu_dua_don`(`id`) ON DELETE CASCADE,
  FOREIGN KEY (`userId`) REFERENCES `users`(`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Dữ liệu mẫu đặt dịch vụ (giả sử có user id 1, 2, 3)
INSERT INTO `dat_dich_vu_dua_don` 
(`dichVuId`, `userId`, `loaiDichVu`, `ngayDon`, `diemDon`, `diemTra`, `soHanhKhach`, `ngayTra`, 
 `tenKhachHang`, `soDienThoai`, `email`, `ghiChu`, `tongTien`, `trangThaiThanhToan`, `phuongThucThanhToan`, `trangThai`) 
VALUES
-- Đặt chỗ một chiều
(1, 1, 'mot_chieu', '2026-01-10 08:00:00', 'Số 123 Hoàn Kiếm, Hà Nội', 'Sân bay Quốc tế Nội Bài', 2, NULL,
 'Nguyễn Văn A', '0912345678', 'nguyenvana@email.com', 'Vui lòng đợi ở cổng chính', 250000, 'paid', 'credit_card', 'confirmed'),

-- Đặt chỗ khứ hồi
(2, 1, 'khu_hoi', '2026-01-12 14:00:00', 'Khách sạn Hilton Hanoi Opera', 'Sân bay Quốc tế Nội Bài', 4, '2026-01-15 10:00:00',
 'Nguyễn Văn A', '0912345678', 'nguyenvana@email.com', 'Có 2 vali lớn', 650000, 'paid', 'bank_transfer', 'confirmed'),

(3, 2, 'mot_chieu', '2026-01-08 06:30:00', 'Số 456 Cầu Giấy, Hà Nội', 'Sân bay Quốc tế Nội Bài', 1, NULL,
 'Trần Thị B', '0987654321', 'tranthib@email.com', NULL, 400000, 'paid', 'credit_card', 'completed'),

(5, 2, 'khu_hoi', '2026-01-20 09:00:00', 'Số 789 Ba Đình, Hà Nội', 'Sân bay Quốc tế Nội Bài', 2, '2026-01-25 16:00:00',
 'Trần Thị B', '0987654321', 'tranthib@email.com', 'Chuyến bay sáng sớm', 380000, 'pending', NULL, 'pending'),

(11, 3, 'mot_chieu', '2026-01-11 15:30:00', 'Số 321 Quận 1, TP.HCM', 'Sân bay Tân Sơn Nhất', 3, NULL,
 'Lê Văn C', '0901234567', 'levanc@email.com', 'Cần xe rộng rãi', 280000, 'paid', 'momo', 'confirmed'),

(13, 3, 'khu_hoi', '2026-01-18 11:00:00', 'Khách sạn Rex Saigon', 'Sân bay Tân Sơn Nhất', 2, '2026-01-22 14:00:00',
 'Lê Văn C', '0901234567', 'levanc@email.com', NULL, 850000, 'paid', 'credit_card', 'confirmed'),

(17, 1, 'mot_chieu', '2026-01-09 07:00:00', 'Số 111 Hải Châu, Đà Nẵng', 'Sân bay Đà Nẵng', 2, NULL,
 'Nguyễn Văn A', '0912345678', 'nguyenvana@email.com', 'Đón sớm', 180000, 'paid', 'zalopay', 'completed'),

(19, 2, 'khu_hoi', '2026-01-16 13:00:00', 'Resort Furama Đà Nẵng', 'Sân bay Đà Nẵng', 4, '2026-01-19 10:00:00',
 'Trần Thị B', '0987654321', 'tranthib@email.com', 'Có trẻ em 2 tuổi', 280000, 'pending', NULL, 'pending');

-- =====================================================
-- 4. ĐÁNH GIÁ DỊCH VỤ
-- =====================================================

CREATE TABLE `danh_gia_dua_don` (
  `id` INT AUTO_INCREMENT PRIMARY KEY,
  `datDichVuId` INT NOT NULL,
  `userId` INT NOT NULL,
  `nhaCungCapId` INT NOT NULL,
  `danhGia` INT NOT NULL CHECK (`danhGia` >= 1 AND `danhGia` <= 5),
  `binhLuan` TEXT,
  `createdAt` DATETIME(3) DEFAULT CURRENT_TIMESTAMP(3),
  `updatedAt` DATETIME(3) DEFAULT CURRENT_TIMESTAMP(3) ON UPDATE CURRENT_TIMESTAMP(3),
  FOREIGN KEY (`datDichVuId`) REFERENCES `dat_dich_vu_dua_don`(`id`) ON DELETE CASCADE,
  FOREIGN KEY (`userId`) REFERENCES `users`(`id`) ON DELETE CASCADE,
  FOREIGN KEY (`nhaCungCapId`) REFERENCES `nha_cung_cap_dua_don`(`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Dữ liệu mẫu đánh giá
INSERT INTO `danh_gia_dua_don` 
(`datDichVuId`, `userId`, `nhaCungCapId`, `danhGia`, `binhLuan`) 
VALUES
(1, 1, 1, 5, 'Dịch vụ tuyệt vời! Tài xế đúng giờ, lái xe an toàn, xe sạch sẽ. Sẽ sử dụng lại.'),
(2, 1, 1, 5, 'Rất hài lòng với dịch vụ. Xe rộng rãi, thoải mái. Giá cả hợp lý.'),
(3, 2, 2, 5, 'Dịch vụ VIP đẳng cấp. Xe sang trọng, tài xế chuyên nghiệp. Đáng đồng tiền.'),
(5, 3, 1, 4, 'Dịch vụ tốt, xe đúng giờ. Tuy nhiên xe hơi cũ một chút.'),
(6, 3, 2, 5, 'Tuyệt vời! Xe Mercedes rất sang trọng, tài xế lịch sự. Highly recommended!'),
(7, 1, 1, 5, 'Đón đúng giờ, lái xe an toàn. Giá cả phải chăng. 5 sao!');

-- =====================================================
-- CẬP NHẬT ĐÁNH GIÁ TRUNG BÌNH CHO NHÀ CUNG CẤP
-- =====================================================

UPDATE `nha_cung_cap_dua_don` ncc
SET 
  `danhGiaTrungBinh` = (
    SELECT AVG(`danhGia`) 
    FROM `danh_gia_dua_don` 
    WHERE `nhaCungCapId` = ncc.`id`
  ),
  `tongSoDanhGia` = (
    SELECT COUNT(*) 
    FROM `danh_gia_dua_don` 
    WHERE `nhaCungCapId` = ncc.`id`
  )
WHERE ncc.`id` IN (SELECT DISTINCT `nhaCungCapId` FROM `danh_gia_dua_don`);

-- =====================================================
-- KIỂM TRA DỮ LIỆU
-- =====================================================

SELECT 'Tổng số nhà cung cấp:' as Info, COUNT(*) as Count FROM `nha_cung_cap_dua_don`
UNION ALL
SELECT 'Tổng số dịch vụ:', COUNT(*) FROM `dich_vu_dua_don`
UNION ALL
SELECT 'Tổng số đặt chỗ:', COUNT(*) FROM `dat_dich_vu_dua_don`
UNION ALL
SELECT 'Tổng số đánh giá:', COUNT(*) FROM `danh_gia_dua_don`;

-- Hiển thị một số dịch vụ mẫu
SELECT 
  dv.id,
  ncc.tenNhaCungCap,
  sb.tenSanBay,
  dv.loaiXe,
  dv.soChoNgoi,
  dv.giaTienMotChieu,
  dv.giaTienKhuHoi,
  ncc.danhGiaTrungBinh
FROM `dich_vu_dua_don` dv
JOIN `nha_cung_cap_dua_don` ncc ON dv.nhaCungCapId = ncc.id
JOIN `san_bay` sb ON dv.sanBayId = sb.id
LIMIT 10;
