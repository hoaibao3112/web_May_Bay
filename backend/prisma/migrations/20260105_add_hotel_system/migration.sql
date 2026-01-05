-- CreateTable
CREATE TABLE `khach_san` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `tenKhachSan` VARCHAR(191) NOT NULL,
    `diaChi` VARCHAR(191) NOT NULL,
    `thanhPho` VARCHAR(191) NOT NULL,
    `quocGiaId` INTEGER NOT NULL,
    `soSao` INTEGER NOT NULL DEFAULT 0,
    `moTa` TEXT NULL,
    `hinhAnh` VARCHAR(191) NULL,
    `dienThoai` VARCHAR(191) NULL,
    `email` VARCHAR(191) NULL,
    `website` VARCHAR(191) NULL,
    `tienNghi` TEXT NULL,
    `giaThapNhat` DECIMAL(15, 2) NULL,
    `danhGiaTB` DECIMAL(3, 2) NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `phong_khach_san` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `khachSanId` INTEGER NOT NULL,
    `tenPhong` VARCHAR(191) NOT NULL,
    `loaiPhong` VARCHAR(191) NOT NULL,
    `dienTich` INTEGER NULL,
    `soKhach` INTEGER NOT NULL DEFAULT 2,
    `soGiuong` INTEGER NOT NULL DEFAULT 1,
    `loaiGiuong` VARCHAR(191) NULL,
    `giaTheoNgay` DECIMAL(15, 2) NOT NULL,
    `hinhAnh` TEXT NULL,
    `tienNghi` TEXT NULL,
    `moTa` TEXT NULL,
    `tongSoPhong` INTEGER NOT NULL DEFAULT 1,
    `soPhongTrong` INTEGER NOT NULL DEFAULT 1,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `dat_phong` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `maDatPhong` VARCHAR(191) NOT NULL,
    `userId` INTEGER NOT NULL,
    `khachSanId` INTEGER NOT NULL,
    `phongId` INTEGER NOT NULL,
    `ngayNhanPhong` DATETIME(3) NOT NULL,
    `ngayTraPhong` DATETIME(3) NOT NULL,
    `soPhong` INTEGER NOT NULL DEFAULT 1,
    `soNguoiLon` INTEGER NOT NULL DEFAULT 2,
    `soTreEm` INTEGER NOT NULL DEFAULT 0,
    `tongTien` DECIMAL(15, 2) NOT NULL,
    `trangThai` ENUM('CHO_XAC_NHAN', 'DA_XAC_NHAN', 'DANG_LUU_TRU', 'DA_CHECKOUT', 'DA_HUY', 'KHONG_DEN') NOT NULL DEFAULT 'CHO_XAC_NHAN',
    `ghiChu` TEXT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    UNIQUE INDEX `dat_phong_maDatPhong_key`(`maDatPhong`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `thanh_toan_dat_phong` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `datPhongId` INTEGER NOT NULL,
    `soTien` DECIMAL(15, 2) NOT NULL,
    `phuongThuc` VARCHAR(191) NOT NULL,
    `trangThai` ENUM('KHOI_TAO', 'CHO_XU_LY', 'THANH_CONG', 'THAT_BAI', 'DA_HOAN') NOT NULL DEFAULT 'KHOI_TAO',
    `maGiaoDich` VARCHAR(191) NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    UNIQUE INDEX `thanh_toan_dat_phong_maGiaoDich_key`(`maGiaoDich`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `danh_gia_khach_san` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `userId` INTEGER NOT NULL,
    `khachSanId` INTEGER NOT NULL,
    `diemSachSe` INTEGER NOT NULL,
    `diemTienNghi` INTEGER NOT NULL,
    `diemViTri` INTEGER NOT NULL,
    `diemDichVu` INTEGER NOT NULL,
    `diemGiaCa` INTEGER NOT NULL,
    `diemTrungBinh` DECIMAL(3, 2) NOT NULL,
    `binhLuan` TEXT NULL,
    `hinhAnh` TEXT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `khach_san` ADD CONSTRAINT `khach_san_quocGiaId_fkey` FOREIGN KEY (`quocGiaId`) REFERENCES `quoc_gia`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `phong_khach_san` ADD CONSTRAINT `phong_khach_san_khachSanId_fkey` FOREIGN KEY (`khachSanId`) REFERENCES `khach_san`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `dat_phong` ADD CONSTRAINT `dat_phong_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `users`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `dat_phong` ADD CONSTRAINT `dat_phong_khachSanId_fkey` FOREIGN KEY (`khachSanId`) REFERENCES `khach_san`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `dat_phong` ADD CONSTRAINT `dat_phong_phongId_fkey` FOREIGN KEY (`phongId`) REFERENCES `phong_khach_san`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `thanh_toan_dat_phong` ADD CONSTRAINT `thanh_toan_dat_phong_datPhongId_fkey` FOREIGN KEY (`datPhongId`) REFERENCES `dat_phong`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `danh_gia_khach_san` ADD CONSTRAINT `danh_gia_khach_san_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `users`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `danh_gia_khach_san` ADD CONSTRAINT `danh_gia_khach_san_khachSanId_fkey` FOREIGN KEY (`khachSanId`) REFERENCES `khach_san`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
