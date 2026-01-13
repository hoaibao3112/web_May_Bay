-- ================================================
-- CREATE AIRPORT TRANSFER TABLES
-- ================================================

-- 1. Create Airport Transfer Provider Table
CREATE TABLE IF NOT EXISTS `nha_cung_cap_dua_don` (
  `id` INT NOT NULL AUTO_INCREMENT,
  `maNhaCungCap` VARCHAR(20) NOT NULL,
  `tenNhaCungCap` VARCHAR(191) NOT NULL,
  `logo` VARCHAR(500) NULL,
  `soDienThoai` VARCHAR(20) NULL,
  `email` VARCHAR(191) NULL,
  `diaChi` TEXT NULL,
  `moTa` TEXT NULL,
  `danhGiaTrungBinh` DECIMAL(2, 1) NULL DEFAULT 0,
  `tongSoDanhGia` INT NOT NULL DEFAULT 0,
  `trangThai` VARCHAR(20) NOT NULL DEFAULT 'active',
  `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
  `updatedAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3) ON UPDATE CURRENT_TIMESTAMP(3),
  PRIMARY KEY (`id`),
  UNIQUE INDEX `nha_cung_cap_dua_don_maNhaCungCap_key` (`maNhaCungCap`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 2. Create Airport Transfer Service Table
CREATE TABLE IF NOT EXISTS `dich_vu_dua_don` (
  `id` INT NOT NULL AUTO_INCREMENT,
  `nhaCungCapId` INT NOT NULL,
  `sanBayId` INT NOT NULL,
  `loaiXe` VARCHAR(50) NOT NULL,
  `soChoNgoi` INT NOT NULL,
  `giaTienMotChieu` DECIMAL(15, 2) NOT NULL,
  `giaTienKhuHoi` DECIMAL(15, 2) NULL,
  `moTa` TEXT NULL,
  `tienIch` TEXT NULL,
  `hinhAnh` TEXT NULL,
  `trangThai` VARCHAR(20) NOT NULL DEFAULT 'active',
  `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
  `updatedAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3) ON UPDATE CURRENT_TIMESTAMP(3),
  PRIMARY KEY (`id`),
  INDEX `dich_vu_dua_don_nhaCungCapId_idx` (`nhaCungCapId`),
  INDEX `dich_vu_dua_don_sanBayId_idx` (`sanBayId`),
  CONSTRAINT `dich_vu_dua_don_nhaCungCapId_fkey` 
    FOREIGN KEY (`nhaCungCapId`) REFERENCES `nha_cung_cap_dua_don` (`id`) ON DELETE RESTRICT ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ================================================
-- INSERT SAMPLE DATA
-- ================================================

-- Insert Airport Transfer Providers
INSERT INTO `nha_cung_cap_dua_don` 
  (`maNhaCungCap`, `tenNhaCungCap`, `logo`, `soDienThoai`, `email`, `diaChi`, `moTa`, `danhGiaTrungBinh`, `tongSoDanhGia`, `trangThai`)
VALUES
  ('VIP_TRANS', 'VIP Airport Transfer', 'https://via.placeholder.com/200x100?text=VIP+Transfer', '0901234567', 'contact@viptransfer.vn', 'TP. Hồ Chí Minh', 'Dịch vụ đưa đón sân bay VIP với đội xe sang trọng', 4.8, 1240, 'active'),
  ('SKYLINE', 'Skyline Limousine', 'https://via.placeholder.com/200x100?text=Skyline', '0912345678', 'info@skyline.vn', 'Hà Nội', 'Dịch vụ limousine cao cấp đưa đón sân bay', 4.7, 890, 'active'),
  ('GOLDEN_CAR', 'Golden Car Service', 'https://via.placeholder.com/200x100?text=Golden+Car', '0923456789', 'booking@goldencar.vn', 'Đà Nẵng', 'Xe đưa đón sân bay uy tín, giá cả phải chăng', 4.6, 560, 'active'),
  ('PREMIUM_SHUTTLE', 'Premium Shuttle', 'https://via.placeholder.com/200x100?text=Premium', '0934567890', 'service@premiumshuttle.vn', 'TP. Hồ Chí Minh', 'Dịch vụ shuttle bus và xe riêng đưa đón sân bay', 4.5, 320, 'active');

-- Insert Airport Transfer Services for Tan Son Nhat Airport (SGN - id: 1)
INSERT INTO `dich_vu_dua_don` 
  (`nhaCungCapId`, `sanBayId`, `loaiXe`, `soChoNgoi`, `giaTienMotChieu`, `giaTienKhuHoi`, `moTa`, `tienIch`, `hinhAnh`, `trangThai`)
VALUES
  -- VIP Transfer services for SGN
  (1, 1, 'Sedan 4 chỗ', 4, 250000, 450000, 'Toyota Camry hoặc tương đương, tài xế chuyên nghiệp', '["WiFi miễn phí","Nước uống","Điều hòa","Hành lý lớn"]', '["https://via.placeholder.com/400x300?text=Sedan"]', 'active'),
  (1, 1, 'SUV 7 chỗ', 7, 350000, 650000, 'Toyota Fortuner hoặc tương đương, rộng rãi thoải mái', '["WiFi miễn phí","Nước uống","Điều hòa","Hành lý lớn","Ghế trẻ em"]', '["https://via.placeholder.com/400x300?text=SUV"]', 'active'),
  (1, 1, 'Limousine 9 chỗ', 9, 500000, 900000, 'Mercedes Sprinter cao cấp, ghế massage, giải trí', '["WiFi miễn phí","Nước uống","Điều hòa","Hành lý lớn","Ghế massage","TV","Tạp chí"]', '["https://via.placeholder.com/400x300?text=Limousine"]', 'active'),
  
  -- Premium Shuttle services for SGN
  (4, 1, 'Sedan 4 chỗ', 4, 220000, 400000, 'Honda Accord hoặc tương đương', '["Nước uống","Điều hòa","Hành lý trung bình"]', '["https://via.placeholder.com/400x300?text=Sedan"]', 'active'),
  (4, 1, 'Van 16 chỗ', 16, 180000, 320000, 'Shuttle bus chia sẻ, giá rẻ', '["Điều hòa","WiFi","Hành lý"]', '["https://via.placeholder.com/400x300?text=Van"]', 'active');

-- Insert Airport Transfer Services for Noi Bai Airport (HAN - id: 2)
INSERT INTO `dich_vu_dua_don` 
  (`nhaCungCapId`, `sanBayId`, `loaiXe`, `soChoNgoi`, `giaTienMotChieu`, `giaTienKhuHoi`, `moTa`, `tienIch`, `hinhAnh`, `trangThai`)
VALUES
  -- Skyline services for HAN
  (2, 2, 'Sedan 4 chỗ', 4, 280000, 500000, 'Toyota Camry, dịch vụ đưa đón tận nơi', '["WiFi miễn phí","Nước uống","Điều hòa","Hành lý lớn"]', '["https://via.placeholder.com/400x300?text=Sedan"]', 'active'),
  (2, 2, 'SUV 7 chỗ', 7, 380000, 700000, 'Ford Everest hoặc tương đương', '["WiFi miễn phí","Nước uống","Điều hòa","Hành lý lớn","Ghế trẻ em"]', '["https://via.placeholder.com/400x300?text=SUV"]', 'active'),
  (2, 2, 'Limousine 9 chỗ', 9, 550000, 1000000, 'Mercedes Sprinter VIP, ghế da cao cấp', '["WiFi miễn phí","Nước uống","Điều hòa","Hành lý lớn","Ghế massage","TV","Báo chí"]', '["https://via.placeholder.com/400x300?text=Limousine"]', 'active');

-- Insert Airport Transfer Services for Da Nang Airport (DAD - id: 3)
INSERT INTO `dich_vu_dua_don` 
  (`nhaCungCapId`, `sanBayId`, `loaiXe`, `soChoNgoi`, `giaTienMotChieu`, `giaTienKhuHoi`, `moTa`, `tienIch`, `hinhAnh`, `trangThai`)
VALUES
  -- Golden Car services for DAD
  (3, 3, 'Sedan 4 chỗ', 4, 180000, 320000, 'Toyota Vios hoặc tương đương', '["Nước uống","Điều hòa","Hành lý"]', '["https://via.placeholder.com/400x300?text=Sedan"]', 'active'),
  (3, 3, 'SUV 7 chỗ', 7, 250000, 450000, 'Mitsubishi Xpander hoặc tương đương', '["Nước uống","Điều hòa","Hành lý lớn","Ghế trẻ em"]', '["https://via.placeholder.com/400x300?text=SUV"]', 'active'),
  (3, 3, 'Van 9 chỗ', 9, 350000, 650000, 'Ford Transit, phù hợp cho gia đình, nhóm bạn', '["WiFi","Nước uống","Điều hòa","Hành lý lớn"]', '["https://via.placeholder.com/400x300?text=Van"]', 'active');

-- Success message
SELECT 'Airport transfer tables created and sample data inserted successfully!' AS Message;
