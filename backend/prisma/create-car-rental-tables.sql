-- ============================
-- TẠO CÁC BẢNG CHO HỆ THỐNG CHO THUÊ XE
-- ============================

-- 1. Bảng Nhà cung cấp xe (Car Rental Company)
CREATE TABLE IF NOT EXISTS `nha_cung_cap_xe` (
  `id` INT NOT NULL AUTO_INCREMENT,
  `maNhaCungCap` VARCHAR(20) NOT NULL,
  `tenNhaCungCap` VARCHAR(191) NOT NULL,
  `logo` VARCHAR(500) NULL,
  `soDienThoai` VARCHAR(20) NULL,
  `email` VARCHAR(191) NULL,
  `website` VARCHAR(255) NULL,
  `diaChi` TEXT NULL,
  `moTa` TEXT NULL,
  `danhGiaTrungBinh` DECIMAL(2, 1) NULL DEFAULT 0,
  `soDanhGia` INT NOT NULL DEFAULT 0,
  `chinhSachHuy` TEXT NULL,
  `chinhSachThanhToan` TEXT NULL,
  `trangThai` ENUM('HOAT_DONG', 'TAM_NGUNG', 'NGUNG_HOAT_DONG') NOT NULL DEFAULT 'HOAT_DONG',
  `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
  `updatedAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3) ON UPDATE CURRENT_TIMESTAMP(3),
  PRIMARY KEY (`id`),
  UNIQUE KEY `nha_cung_cap_xe_maNhaCungCap_key` (`maNhaCungCap`),
  KEY `nha_cung_cap_xe_trangThai_idx` (`trangThai`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 2. Bảng Loại xe thuê (Car Type)
CREATE TABLE IF NOT EXISTS `loai_xe_thue` (
  `id` INT NOT NULL AUTO_INCREMENT,
  `maLoaiXe` VARCHAR(20) NOT NULL,
  `tenLoaiXe` VARCHAR(100) NOT NULL,
  `moTa` TEXT NULL,
  `soHanhKhach` INT NOT NULL,
  `soHanhLy` INT NOT NULL,
  `hinhAnh` VARCHAR(500) NULL,
  `tienNghi` JSON NULL,
  `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
  `updatedAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3) ON UPDATE CURRENT_TIMESTAMP(3),
  PRIMARY KEY (`id`),
  UNIQUE KEY `loai_xe_thue_maLoaiXe_key` (`maLoaiXe`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 3. Bảng Xe thuê (Vehicle)
CREATE TABLE IF NOT EXISTS `xe_thue` (
  `id` INT NOT NULL AUTO_INCREMENT,
  `nhaCungCapId` INT NOT NULL,
  `loaiXeId` INT NOT NULL,
  `bienSoXe` VARCHAR(20) NOT NULL,
  `mauXe` VARCHAR(50) NULL,
  `namSanXuat` INT NULL,
  `soHanhKhach` INT NOT NULL,
  `soHanhLy` INT NOT NULL,
  `hinhAnh` TEXT NULL,
  `trangThai` ENUM('SAN_SANG', 'DANG_THUE', 'BAO_TRI', 'KHONG_KHA_DUNG') NOT NULL DEFAULT 'SAN_SANG',
  `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
  `updatedAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3) ON UPDATE CURRENT_TIMESTAMP(3),
  PRIMARY KEY (`id`),
  UNIQUE KEY `xe_thue_bienSoXe_key` (`bienSoXe`),
  KEY `xe_thue_nhaCungCapId_idx` (`nhaCungCapId`),
  KEY `xe_thue_loaiXeId_idx` (`loaiXeId`),
  KEY `xe_thue_trangThai_idx` (`trangThai`),
  CONSTRAINT `xe_thue_nhaCungCapId_fkey` FOREIGN KEY (`nhaCungCapId`) REFERENCES `nha_cung_cap_xe` (`id`) ON DELETE RESTRICT ON UPDATE CASCADE,
  CONSTRAINT `xe_thue_loaiXeId_fkey` FOREIGN KEY (`loaiXeId`) REFERENCES `loai_xe_thue` (`id`) ON DELETE RESTRICT ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 4. Bảng Tuyến đường thuê xe (Route)
CREATE TABLE IF NOT EXISTS `tuyen_duong_thue_xe` (
  `id` INT NOT NULL AUTO_INCREMENT,
  `maTuyen` VARCHAR(20) NOT NULL,
  `diemDi` VARCHAR(191) NOT NULL,
  `diemDen` VARCHAR(191) NOT NULL,
  `diemDiId` INT NULL,
  `khoangCach` DECIMAL(10, 2) NULL,
  `thoiGianDuKien` INT NULL,
  `moTa` TEXT NULL,
  `trangThai` ENUM('HOAT_DONG', 'TAM_NGUNG', 'NGUNG_HOAT_DONG') NOT NULL DEFAULT 'HOAT_DONG',
  `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
  `updatedAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3) ON UPDATE CURRENT_TIMESTAMP(3),
  PRIMARY KEY (`id`),
  UNIQUE KEY `tuyen_duong_thue_xe_maTuyen_key` (`maTuyen`),
  KEY `tuyen_duong_thue_xe_diemDiId_idx` (`diemDiId`),
  CONSTRAINT `tuyen_duong_thue_xe_diemDiId_fkey` FOREIGN KEY (`diemDiId`) REFERENCES `san_bay` (`id`) ON DELETE SET NULL ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 5. Bảng Giá thuê xe (Rental Price)
CREATE TABLE IF NOT EXISTS `gia_thue_xe` (
  `id` INT NOT NULL AUTO_INCREMENT,
  `nhaCungCapId` INT NOT NULL,
  `loaiXeId` INT NOT NULL,
  `tuyenDuongId` INT NULL,
  `giaTheoGio` DECIMAL(15, 2) NULL,
  `giaTheoNgay` DECIMAL(15, 2) NULL,
  `giaTheoTuyen` DECIMAL(15, 2) NULL,
  `donViTienTe` VARCHAR(3) NOT NULL DEFAULT 'VND',
  `giamGia` DECIMAL(15, 2) NULL DEFAULT 0,
  `phuThu` JSON NULL,
  `apDungTu` DATETIME(3) NULL,
  `apDungDen` DATETIME(3) NULL,
  `trangThai` ENUM('HOAT_DONG', 'HET_HAN', 'TAM_NGUNG') NOT NULL DEFAULT 'HOAT_DONG',
  `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
  `updatedAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3) ON UPDATE CURRENT_TIMESTAMP(3),
  PRIMARY KEY (`id`),
  UNIQUE KEY `gia_thue_xe_nhaCungCapId_loaiXeId_tuyenDuongId_key` (`nhaCungCapId`, `loaiXeId`, `tuyenDuongId`),
  KEY `gia_thue_xe_nhaCungCapId_loaiXeId_idx` (`nhaCungCapId`, `loaiXeId`),
  KEY `gia_thue_xe_tuyenDuongId_idx` (`tuyenDuongId`),
  CONSTRAINT `gia_thue_xe_nhaCungCapId_fkey` FOREIGN KEY (`nhaCungCapId`) REFERENCES `nha_cung_cap_xe` (`id`) ON DELETE RESTRICT ON UPDATE CASCADE,
  CONSTRAINT `gia_thue_xe_loaiXeId_fkey` FOREIGN KEY (`loaiXeId`) REFERENCES `loai_xe_thue` (`id`) ON DELETE RESTRICT ON UPDATE CASCADE,
  CONSTRAINT `gia_thue_xe_tuyenDuongId_fkey` FOREIGN KEY (`tuyenDuongId`) REFERENCES `tuyen_duong_thue_xe` (`id`) ON DELETE SET NULL ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 6. Bảng Đơn thuê xe (Car Rental Booking)
CREATE TABLE IF NOT EXISTS `don_thue_xe` (
  `id` INT NOT NULL AUTO_INCREMENT,
  `maDonThue` VARCHAR(20) NOT NULL,
  `nguoiDungId` INT NOT NULL,
  `nhaCungCapId` INT NOT NULL,
  `xeThueId` INT NULL,
  `loaiXeId` INT NOT NULL,
  `diemDon` VARCHAR(191) NOT NULL,
  `diaChiDon` TEXT NULL,
  `diemTra` VARCHAR(191) NOT NULL,
  `diaChiTra` TEXT NULL,
  `thoiGianDon` DATETIME(3) NOT NULL,
  `thoiGianTraDuKien` DATETIME(3) NULL,
  `soHanhKhach` INT NOT NULL,
  `soHanhLy` INT NOT NULL,
  `tenHanhKhach` VARCHAR(191) NOT NULL,
  `soDienThoai` VARCHAR(20) NOT NULL,
  `email` VARCHAR(191) NULL,
  `ghiChu` TEXT NULL,
  `soHieuChuyenBay` VARCHAR(20) NULL,
  `gioHaCanh` DATETIME(3) NULL,
  `giaThue` DECIMAL(15, 2) NOT NULL,
  `phuThu` DECIMAL(15, 2) NOT NULL DEFAULT 0,
  `giamGia` DECIMAL(15, 2) NOT NULL DEFAULT 0,
  `tongTien` DECIMAL(15, 2) NOT NULL,
  `donViTienTe` VARCHAR(3) NOT NULL DEFAULT 'VND',
  `trangThai` ENUM('CHO_XAC_NHAN', 'DA_XAC_NHAN', 'TAI_XE_DANG_DEN', 'DANG_PHUC_VU', 'HOAN_THANH', 'DA_HUY', 'KHONG_DEN') NOT NULL DEFAULT 'CHO_XAC_NHAN',
  `phuongThucThanhToan` VARCHAR(50) NULL,
  `tenTaiXe` VARCHAR(191) NULL,
  `soDienThoaiTaiXe` VARCHAR(20) NULL,
  `bienSoXe` VARCHAR(20) NULL,
  `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
  `updatedAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3) ON UPDATE CURRENT_TIMESTAMP(3),
  PRIMARY KEY (`id`),
  UNIQUE KEY `don_thue_xe_maDonThue_key` (`maDonThue`),
  KEY `don_thue_xe_nguoiDungId_idx` (`nguoiDungId`),
  KEY `don_thue_xe_nhaCungCapId_idx` (`nhaCungCapId`),
  KEY `don_thue_xe_thoiGianDon_idx` (`thoiGianDon`),
  KEY `don_thue_xe_trangThai_idx` (`trangThai`),
  CONSTRAINT `don_thue_xe_nguoiDungId_fkey` FOREIGN KEY (`nguoiDungId`) REFERENCES `users` (`id`) ON DELETE RESTRICT ON UPDATE CASCADE,
  CONSTRAINT `don_thue_xe_nhaCungCapId_fkey` FOREIGN KEY (`nhaCungCapId`) REFERENCES `nha_cung_cap_xe` (`id`) ON DELETE RESTRICT ON UPDATE CASCADE,
  CONSTRAINT `don_thue_xe_xeThueId_fkey` FOREIGN KEY (`xeThueId`) REFERENCES `xe_thue` (`id`) ON DELETE SET NULL ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 7. Bảng Thanh toán thuê xe (Car Rental Payment)
CREATE TABLE IF NOT EXISTS `thanh_toan_thue_xe` (
  `id` INT NOT NULL AUTO_INCREMENT,
  `donThueXeId` INT NOT NULL,
  `soTien` DECIMAL(15, 2) NOT NULL,
  `phuongThuc` VARCHAR(50) NOT NULL,
  `trangThai` ENUM('KHOI_TAO', 'CHO_XU_LY', 'THANH_CONG', 'THAT_BAI', 'DA_HOAN') NOT NULL DEFAULT 'KHOI_TAO',
  `maGiaoDich` VARCHAR(100) NULL,
  `thongTinGiaoDich` JSON NULL,
  `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
  `updatedAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3) ON UPDATE CURRENT_TIMESTAMP(3),
  PRIMARY KEY (`id`),
  UNIQUE KEY `thanh_toan_thue_xe_maGiaoDich_key` (`maGiaoDich`),
  KEY `thanh_toan_thue_xe_donThueXeId_idx` (`donThueXeId`),
  CONSTRAINT `thanh_toan_thue_xe_donThueXeId_fkey` FOREIGN KEY (`donThueXeId`) REFERENCES `don_thue_xe` (`id`) ON DELETE RESTRICT ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 8. Bảng Đánh giá nhà cung cấp (Car Rental Review)
CREATE TABLE IF NOT EXISTS `danh_gia_nha_cung_cap` (
  `id` INT NOT NULL AUTO_INCREMENT,
  `nguoiDungId` INT NOT NULL,
  `nhaCungCapId` INT NOT NULL,
  `donThueXeId` INT NULL,
  `diemXe` INT NOT NULL,
  `diemTaiXe` INT NOT NULL,
  `diemDungGio` INT NOT NULL,
  `diemSachSe` INT NOT NULL,
  `diemGiaCa` INT NOT NULL,
  `diemTrungBinh` DECIMAL(3, 2) NOT NULL,
  `binhLuan` TEXT NULL,
  `hinhAnh` TEXT NULL,
  `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
  PRIMARY KEY (`id`),
  KEY `danh_gia_nha_cung_cap_nguoiDungId_idx` (`nguoiDungId`),
  KEY `danh_gia_nha_cung_cap_nhaCungCapId_idx` (`nhaCungCapId`),
  CONSTRAINT `danh_gia_nha_cung_cap_nguoiDungId_fkey` FOREIGN KEY (`nguoiDungId`) REFERENCES `users` (`id`) ON DELETE RESTRICT ON UPDATE CASCADE,
  CONSTRAINT `danh_gia_nha_cung_cap_nhaCungCapId_fkey` FOREIGN KEY (`nhaCungCapId`) REFERENCES `nha_cung_cap_xe` (`id`) ON DELETE RESTRICT ON UPDATE CASCADE,
  CONSTRAINT `danh_gia_nha_cung_cap_donThueXeId_fkey` FOREIGN KEY (`donThueXeId`) REFERENCES `don_thue_xe` (`id`) ON DELETE SET NULL ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
