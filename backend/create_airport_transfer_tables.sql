-- SQL script to create airport transfer tables
-- Run this in your MySQL database: dat_ve_may_bay

-- 1. Create nha_cung_cap_dua_don table
CREATE TABLE IF NOT EXISTS `nha_cung_cap_dua_don` (
  `id` INT NOT NULL AUTO_INCREMENT,
  `maNhaCungCap` VARCHAR(20) NOT NULL UNIQUE,
  `tenNhaCungCap` VARCHAR(191) NOT NULL,
  `logo` VARCHAR(500),
  `soDienThoai` VARCHAR(20),
  `email` VARCHAR(191),
  `diaChi` TEXT,
  `moTa` TEXT,
  `trangThai` VARCHAR(20) NOT NULL DEFAULT 'active',
  `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
  `updatedAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3) ON UPDATE CURRENT_TIMESTAMP(3),
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 2. Create dich_vu_dua_don table
CREATE TABLE IF NOT EXISTS `dich_vu_dua_don` (
  `id` INT NOT NULL AUTO_INCREMENT,
  `nhaCungCapId` INT NOT NULL,
  `sanBayId` INT NOT NULL,
  `loaiXe` VARCHAR(100) NOT NULL,
  `soChoNgoi` INT NOT NULL,
  `giaTienMotChieu` DECIMAL(15,2) NOT NULL,
  `giaTienKhuHoi` DECIMAL(15,2),
  `moTa` TEXT,
  `tienIch` TEXT,
  `hinhAnh` TEXT,
  `trangThai` VARCHAR(20) NOT NULL DEFAULT 'active',
  `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
  `updatedAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3) ON UPDATE CURRENT_TIMESTAMP(3),
  PRIMARY KEY (`id`),
  FOREIGN KEY (`nhaCungCapId`) REFERENCES `nha_cung_cap_dua_don`(`id`) ON DELETE CASCADE,
  FOREIGN KEY (`sanBayId`) REFERENCES `san_bay`(`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 3. Create dat_dich_vu_dua_don table
CREATE TABLE IF NOT EXISTS `dat_dich_vu_dua_don` (
  `id` INT NOT NULL AUTO_INCREMENT,
  `dichVuId` INT NOT NULL,
  `userId` INT NOT NULL,
  `loaiDichVu` VARCHAR(20) NOT NULL,
  `ngayDon` DATETIME(3) NOT NULL,
  `diemDon` VARCHAR(191) NOT NULL,
  `diemTra` VARCHAR(191) NOT NULL,
  `soHanhKhach` INT NOT NULL,
  `ngayTra` DATETIME(3),
  `tenKhachHang` VARCHAR(191) NOT NULL,
  `soDienThoai` VARCHAR(20) NOT NULL,
  `email` VARCHAR(191) NOT NULL,
  `ghiChu` TEXT,
  `tongTien` DECIMAL(15,2) NOT NULL,
  `trangThaiThanhToan` VARCHAR(20) NOT NULL DEFAULT 'pending',
  `phuongThucThanhToan` VARCHAR(50),
  `trangThai` VARCHAR(20) NOT NULL DEFAULT 'pending',
  `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
  `updatedAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3) ON UPDATE CURRENT_TIMESTAMP(3),
  PRIMARY KEY (`id`),
  FOREIGN KEY (`dichVuId`) REFERENCES `dich_vu_dua_don`(`id`) ON DELETE CASCADE,
  FOREIGN KEY (`userId`) REFERENCES `users`(`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 4. Create thanh_toan_dua_don table
CREATE TABLE IF NOT EXISTS `thanh_toan_dua_don` (
  `id` INT NOT NULL AUTO_INCREMENT,
  `datDichVuId` INT NOT NULL,
  `soTien` DECIMAL(15,2) NOT NULL,
  `phuongThucThanhToan` VARCHAR(50) NOT NULL,
  `trangThai` VARCHAR(20) NOT NULL,
  `maGiaoDich` VARCHAR(100) UNIQUE,
  `maGiaoDichNganHang` VARCHAR(100),
  `nganHang` VARCHAR(50),
  `moTa` TEXT,
  `thoiGianThanhToan` DATETIME(3),
  `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
  `updatedAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3) ON UPDATE CURRENT_TIMESTAMP(3),
  PRIMARY KEY (`id`),
  FOREIGN KEY (`datDichVuId`) REFERENCES `dat_dich_vu_dua_don`(`id`) ON DELETE CASCADE,
  INDEX `idx_datDichVuId` (`datDichVuId`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 5. Insert sample data for testing
INSERT INTO `nha_cung_cap_dua_don` (`maNhaCungCap`, `tenNhaCungCap`, `logo`, `soDienThoai`, `email`, `diaChi`, `moTa`, `trangThai`) VALUES
('NCC001', 'VIP Transport', 'https://via.placeholder.com/200x100?text=VIP+Transport', '0901234567', 'contact@viptransport.vn', '123 Nguyễn Huệ, Q.1, TP.HCM', 'Dịch vụ đưa đón sân bay cao cấp', 'active');

INSERT INTO `dich_vu_dua_don` (`nhaCungCapId`, `sanBayId`, `loaiXe`, `soChoNgoi`, `giaTienMotChieu`, `giaTienKhuHoi`, `moTa`, `tienIch`, `hinhAnh`, `trangThai`) VALUES
(1, 1, 'Sedan 4 chỗ', 4, 250000, 450000, 'Toyota Camry hoặc tương đương, sang trọng', '["WiFi miễn phí","Nước uống","Điều hòa","Hành lý"]', '["https://via.placeholder.com/400x300?text=Sedan"]', 'active'),
(1, 1, 'SUV 7 chỗ', 7, 350000, 650000, 'Toyota Fortuner hoặc tương đương, rộng rãi thoải mái', '["WiFi miễn phí","Nước uống","Điều hòa","Hành lý lớn","Ghế trẻ em"]', '["https://via.placeholder.com/400x300?text=SUV"]', 'active'),
(1, 1, 'Van 16 chỗ', 16, 550000, 1000000, 'Toyota Hiace hoặc tương đương, phù hợp cho nhóm đông', '["WiFi miễn phí","Nước uống","Điều hòa","Hành lý rất lớn"]', '["https://via.placeholder.com/400x300?text=Van"]', 'active');
