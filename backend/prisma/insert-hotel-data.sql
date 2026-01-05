-- =============================================
-- THÊM CÁC BẢNG KHÁCH SẠN VÀO DATABASE
-- =============================================

-- Bảng Khách Sạn
CREATE TABLE IF NOT EXISTS `khach_san` (
    `id` INT NOT NULL AUTO_INCREMENT,
    `tenKhachSan` VARCHAR(191) NOT NULL,
    `diaChi` VARCHAR(191) NOT NULL,
    `thanhPho` VARCHAR(191) NOT NULL,
    `quocGiaId` INT NOT NULL,
    `soSao` INT NOT NULL DEFAULT 0,
    `moTa` TEXT NULL,
    `hinhAnh` VARCHAR(191) NULL,
    `dienThoai` VARCHAR(191) NULL,
    `email` VARCHAR(191) NULL,
    `website` VARCHAR(191) NULL,
    `tienNghi` TEXT NULL,
    `giaThapNhat` DECIMAL(15, 2) NULL,
    `danhGiaTB` DECIMAL(3, 2) NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3) ON UPDATE CURRENT_TIMESTAMP(3),
    PRIMARY KEY (`id`),
    KEY `khach_san_quocGiaId_fkey` (`quocGiaId`),
    CONSTRAINT `khach_san_quocGiaId_fkey` FOREIGN KEY (`quocGiaId`) REFERENCES `quoc_gia` (`id`) ON DELETE RESTRICT ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Bảng Phòng Khách Sạn
CREATE TABLE IF NOT EXISTS `phong_khach_san` (
    `id` INT NOT NULL AUTO_INCREMENT,
    `khachSanId` INT NOT NULL,
    `tenPhong` VARCHAR(191) NOT NULL,
    `loaiPhong` VARCHAR(191) NOT NULL,
    `dienTich` INT NULL,
    `soKhach` INT NOT NULL DEFAULT 2,
    `soGiuong` INT NOT NULL DEFAULT 1,
    `loaiGiuong` VARCHAR(191) NULL,
    `giaTheoNgay` DECIMAL(15, 2) NOT NULL,
    `hinhAnh` TEXT NULL,
    `tienNghi` TEXT NULL,
    `moTa` TEXT NULL,
    `tongSoPhong` INT NOT NULL DEFAULT 1,
    `soPhongTrong` INT NOT NULL DEFAULT 1,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3) ON UPDATE CURRENT_TIMESTAMP(3),
    PRIMARY KEY (`id`),
    KEY `phong_khach_san_khachSanId_fkey` (`khachSanId`),
    CONSTRAINT `phong_khach_san_khachSanId_fkey` FOREIGN KEY (`khachSanId`) REFERENCES `khach_san` (`id`) ON DELETE RESTRICT ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Bảng Đặt Phòng
CREATE TABLE IF NOT EXISTS `dat_phong` (
    `id` INT NOT NULL AUTO_INCREMENT,
    `maDatPhong` VARCHAR(191) NOT NULL,
    `userId` INT NOT NULL,
    `khachSanId` INT NOT NULL,
    `phongId` INT NOT NULL,
    `ngayNhanPhong` DATETIME(3) NOT NULL,
    `ngayTraPhong` DATETIME(3) NOT NULL,
    `soPhong` INT NOT NULL DEFAULT 1,
    `soNguoiLon` INT NOT NULL DEFAULT 2,
    `soTreEm` INT NOT NULL DEFAULT 0,
    `tongTien` DECIMAL(15, 2) NOT NULL,
    `trangThai` ENUM('CHO_XAC_NHAN', 'DA_XAC_NHAN', 'DANG_LUU_TRU', 'DA_CHECKOUT', 'DA_HUY', 'KHONG_DEN') NOT NULL DEFAULT 'CHO_XAC_NHAN',
    `ghiChu` TEXT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3) ON UPDATE CURRENT_TIMESTAMP(3),
    PRIMARY KEY (`id`),
    UNIQUE KEY `dat_phong_maDatPhong_key` (`maDatPhong`),
    KEY `dat_phong_userId_fkey` (`userId`),
    KEY `dat_phong_khachSanId_fkey` (`khachSanId`),
    KEY `dat_phong_phongId_fkey` (`phongId`),
    CONSTRAINT `dat_phong_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `users` (`id`) ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT `dat_phong_khachSanId_fkey` FOREIGN KEY (`khachSanId`) REFERENCES `khach_san` (`id`) ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT `dat_phong_phongId_fkey` FOREIGN KEY (`phongId`) REFERENCES `phong_khach_san` (`id`) ON DELETE RESTRICT ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Bảng Thanh Toán Đặt Phòng
CREATE TABLE IF NOT EXISTS `thanh_toan_dat_phong` (
    `id` INT NOT NULL AUTO_INCREMENT,
    `datPhongId` INT NOT NULL,
    `soTien` DECIMAL(15, 2) NOT NULL,
    `phuongThuc` VARCHAR(191) NOT NULL,
    `trangThai` ENUM('KHOI_TAO', 'CHO_XU_LY', 'THANH_CONG', 'THAT_BAI', 'DA_HOAN') NOT NULL DEFAULT 'KHOI_TAO',
    `maGiaoDich` VARCHAR(191) NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3) ON UPDATE CURRENT_TIMESTAMP(3),
    PRIMARY KEY (`id`),
    UNIQUE KEY `thanh_toan_dat_phong_maGiaoDich_key` (`maGiaoDich`),
    KEY `thanh_toan_dat_phong_datPhongId_fkey` (`datPhongId`),
    CONSTRAINT `thanh_toan_dat_phong_datPhongId_fkey` FOREIGN KEY (`datPhongId`) REFERENCES `dat_phong` (`id`) ON DELETE RESTRICT ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Bảng Đánh Giá Khách Sạn
CREATE TABLE IF NOT EXISTS `danh_gia_khach_san` (
    `id` INT NOT NULL AUTO_INCREMENT,
    `userId` INT NOT NULL,
    `khachSanId` INT NOT NULL,
    `diemSachSe` INT NOT NULL,
    `diemTienNghi` INT NOT NULL,
    `diemViTri` INT NOT NULL,
    `diemDichVu` INT NOT NULL,
    `diemGiaCa` INT NOT NULL,
    `diemTrungBinh` DECIMAL(3, 2) NOT NULL,
    `binhLuan` TEXT NULL,
    `hinhAnh` TEXT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    PRIMARY KEY (`id`),
    KEY `danh_gia_khach_san_userId_fkey` (`userId`),
    KEY `danh_gia_khach_san_khachSanId_fkey` (`khachSanId`),
    CONSTRAINT `danh_gia_khach_san_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `users` (`id`) ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT `danh_gia_khach_san_khachSanId_fkey` FOREIGN KEY (`khachSanId`) REFERENCES `khach_san` (`id`) ON DELETE RESTRICT ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- =============================================
-- INSERT DỮ LIỆU MẪU KHÁCH SẠN
-- =============================================

-- Khách sạn Việt Nam
INSERT INTO `khach_san` (`tenKhachSan`, `diaChi`, `thanhPho`, `quocGiaId`, `soSao`, `moTa`, `giaThapNhat`, `danhGiaTB`) VALUES
('Vinpearl Landmark 81', '720A Điện Biên Phủ, Bình Thạnh', 'TP. Hồ Chí Minh', 1, 5, 'Khách sạn sang trọng 5 sao với tầm nhìn toàn cảnh thành phố từ tòa nhà cao nhất Việt Nam', 3500000, 9.2),
('Hotel Nikko Saigon', '235 Nguyễn Văn Cừ, Quận 1', 'TP. Hồ Chí Minh', 1, 5, 'Khách sạn Nhật Bản cao cấp tại trung tâm Sài Gòn', 2800000, 9.0),
('Rex Hotel Saigon', '141 Nguyễn Huệ, Quận 1', 'TP. Hồ Chí Minh', 1, 5, 'Khách sạn lịch sử với kiến trúc cổ điển', 2500000, 8.8),
('Liberty Central Saigon', '179 Lê Thánh Tôn, Quận 1', 'TP. Hồ Chí Minh', 1, 4, 'Khách sạn boutique hiện đại gần Nhà hát Thành phố', 1800000, 8.5),
('Silverland Jolie Hotel', '4D Thi Sách, Quận 1', 'TP. Hồ Chí Minh', 1, 4, 'Khách sạn thân thiện với giá tốt', 1200000, 8.3),

('Sofitel Legend Metropole', '15 Ngô Quyền, Hoàn Kiếm', 'Hà Nội', 1, 5, 'Khách sạn lịch sử sang trọng nhất Hà Nội', 4500000, 9.5),
('Lotte Hotel Hanoi', '54 Liễu Giai, Ba Đình', 'Hà Nội', 1, 5, 'Khách sạn Hàn Quốc cao cấp với view hồ Tây', 3200000, 9.1),
('Melia Hanoi', '44B Lý Thường Kiệt, Hoàn Kiếm', 'Hà Nội', 1, 5, 'Khách sạn Tây Ban Nha hiện đại', 2600000, 8.9),
('La Siesta Classic', '94 Mã Mây, Hoàn Kiếm', 'Hà Nội', 1, 4, 'Khách sạn boutique ở phố cổ Hà Nội', 1500000, 8.7),

('Muong Thanh Luxury', 'Võ Nguyên Giáp, Sơn Trà', 'Đà Nẵng', 1, 4, 'Resort biển với nhiều tiện ích', 2200000, 8.4),
('InterContinental Danang', 'Bán đảo Sơn Trà', 'Đà Nẵng', 1, 5, 'Resort sang trọng trên bán đảo Sơn Trà', 4000000, 9.3),
('Novotel Danang Premier', 'Bạch Đằng, Hải Châu', 'Đà Nẵng', 1, 5, 'Khách sạn bên sông Hàn', 2800000, 8.8),
('Haian Beach Hotel', 'Võ Nguyên Giáp, Ngũ Hành Sơn', 'Đà Nẵng', 1, 4, 'Khách sạn gần bãi biển Mỹ Khê', 1600000, 8.5),

('Vinpearl Resort Nha Trang', 'Đảo Hòn Tre', 'Nha Trang', 1, 5, 'Resort biển đẳng cấp 5 sao', 3800000, 9.2),
('Sheraton Nha Trang', '26–28 Trần Phú', 'Nha Trang', 1, 5, 'Khách sạn Mỹ bên bờ biển', 3000000, 8.9),
('Havana Hotel', '38 Trần Phú', 'Nha Trang', 1, 4, 'Khách sạn view biển giá tốt', 1400000, 8.4),

('Vinpearl Resort Phu Quoc', 'Bãi Dài, Gành Dầu', 'Phú Quốc', 1, 5, 'Resort sang trọng trên đảo ngọc', 4200000, 9.4),
('InterContinental Phu Quoc', 'Bãi Trường, Dương Đông', 'Phú Quốc', 1, 5, 'Resort biển cao cấp', 3600000, 9.1),
('Salinda Resort', 'Cửa Lấp, Dương Đông', 'Phú Quốc', 1, 5, 'Resort yên tĩnh với bãi biển riêng', 2900000, 8.8),

('Ana Mandara Dalat', 'Lê Lai, Phường 5', 'Đà Lạt', 1, 5, 'Resort villa sang trọng giữa rừng thông', 3400000, 9.0),
('Dalat Palace Hotel', '2 Trần Phú, Phường 3', 'Đà Lạt', 1, 5, 'Khách sạn lịch sử cổ điển', 2700000, 8.9);

-- INSERT PHÒNG MẪU (20 phòng cho mỗi khách sạn đầu tiên)
INSERT INTO `phong_khach_san` (`khachSanId`, `tenPhong`, `loaiPhong`, `dienTich`, `soKhach`, `soGiuong`, `loaiGiuong`, `giaTheoNgay`, `tongSoPhong`, `soPhongTrong`, `moTa`) VALUES
-- Vinpearl Landmark 81
(1, 'Deluxe Room', 'Deluxe', 35, 2, 1, 'King', 3500000, 50, 45, 'Phòng sang trọng với view thành phố'),
(1, 'Executive Suite', 'Suite', 65, 3, 2, 'King + Twin', 5500000, 30, 28, 'Suite rộng rãi với phòng khách riêng'),
(1, 'Presidential Suite', 'Suite', 120, 4, 3, 'King + Queen + Twin', 12000000, 5, 5, 'Căn hộ siêu sang trên tầng cao nhất'),

-- Hotel Nikko Saigon
(2, 'Superior Room', 'Superior', 32, 2, 1, 'Queen', 2800000, 80, 75, 'Phòng tiêu chuẩn Nhật Bản'),
(2, 'Deluxe Room', 'Deluxe', 38, 2, 1, 'King', 3300000, 60, 55, 'Phòng cao cấp với ban công'),
(2, 'Junior Suite', 'Suite', 55, 3, 2, 'King + Single', 4800000, 20, 18, 'Suite nhỏ phong cách Nhật'),

-- Rex Hotel
(3, 'Classic Room', 'Standard', 28, 2, 1, 'Queen', 2500000, 100, 90, 'Phòng cổ điển'),
(3, 'Superior Room', 'Superior', 32, 2, 1, 'King', 2900000, 70, 65, 'Phòng rộng hơn'),
(3, 'Deluxe Suite', 'Suite', 60, 3, 2, 'King + Twin', 4500000, 15, 12, 'Suite sang trọng'),

-- Đà Nẵng
(10, 'Standard Room', 'Standard', 30, 2, 1, 'Queen', 2200000, 60, 55, 'Phòng tiêu chuẩn view thành phố'),
(11, 'Ocean View Room', 'Deluxe', 45, 2, 1, 'King', 4000000, 40, 35, 'Phòng view biển tuyệt đẹp'),
(11, 'Beach Villa', 'Villa', 80, 4, 2, 'King + Queen', 8000000, 10, 8, 'Villa riêng bên bãi biển'),

-- Nha Trang
(14, 'Garden View Room', 'Standard', 32, 2, 1, 'Queen', 3800000, 50, 45, 'Phòng view vườn'),
(14, 'Sea View Room', 'Deluxe', 40, 2, 1, 'King', 4500000, 60, 52, 'Phòng view biển'),
(15, 'Deluxe Ocean View', 'Deluxe', 42, 2, 1, 'King', 3000000, 45, 40, 'Phòng Sheraton view biển'),

-- Phú Quốc
(17, 'Garden Villa', 'Villa', 70, 3, 2, 'King + Twin', 4200000, 30, 25, 'Villa có vườn riêng'),
(17, 'Beach Villa', 'Villa', 90, 4, 2, 'King + Queen', 6000000, 20, 18, 'Villa bên bãi biển'),
(18, 'Ocean Suite', 'Suite', 65, 3, 2, 'King + Single', 3600000, 25, 22, 'Suite view biển'),

-- Đà Lạt
(20, 'Valley View Room', 'Standard', 30, 2, 1, 'Queen', 2700000, 40, 35, 'Phòng view thung lũng'),
(20, 'Premium Suite', 'Suite', 55, 3, 2, 'King + Twin', 4200000, 15, 13, 'Suite sang trọng');

-- INSERT ĐÁNH GIÁ MẪU
INSERT INTO `danh_gia_khach_san` (`userId`, `khachSanId`, `diemSachSe`, `diemTienNghi`, `diemViTri`, `diemDichVu`, `diemGiaCa`, `diemTrungBinh`, `binhLuan`) VALUES
(1, 1, 10, 9, 10, 9, 8, 9.20, 'Khách sạn tuyệt vời! View đẹp, phòng sạch sẽ, nhân viên thân thiện'),
(1, 6, 10, 10, 10, 10, 9, 9.80, 'Khách sạn lịch sử đẳng cấp nhất Hà Nội. Đáng đồng tiền bát gạo!'),
(1, 11, 10, 9, 9, 10, 8, 9.20, 'Resort sang trọng, bãi biển riêng tuyệt đẹp'),
(1, 14, 9, 9, 10, 9, 9, 9.20, 'Vinpearl Nha Trang luôn là lựa chọn tốt'),
(1, 17, 10, 10, 9, 10, 8, 9.40, 'Phú Quốc tuyệt vời với Vinpearl Resort!');

