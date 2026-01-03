-- CreateTable
CREATE TABLE `users` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `email` VARCHAR(191) NOT NULL,
    `password` VARCHAR(191) NOT NULL,
    `hoTen` VARCHAR(191) NOT NULL,
    `soDienThoai` VARCHAR(191) NULL,
    `vaiTro` ENUM('CUSTOMER', 'ADMIN', 'OPERATOR') NOT NULL DEFAULT 'CUSTOMER',
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    UNIQUE INDEX `users_email_key`(`email`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `quoc_gia` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `maQuocGia` VARCHAR(3) NOT NULL,
    `tenQuocGia` VARCHAR(191) NOT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    UNIQUE INDEX `quoc_gia_maQuocGia_key`(`maQuocGia`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `tien_te` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `maTienTe` VARCHAR(3) NOT NULL,
    `tenTienTe` VARCHAR(191) NOT NULL,
    `tyGia` DECIMAL(15, 4) NOT NULL DEFAULT 1.0,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    UNIQUE INDEX `tien_te_maTienTe_key`(`maTienTe`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `san_bay` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `maIata` VARCHAR(3) NOT NULL,
    `tenSanBay` VARCHAR(191) NOT NULL,
    `thanhPho` VARCHAR(191) NOT NULL,
    `quocGiaId` INTEGER NOT NULL,
    `kinhDo` DECIMAL(10, 6) NULL,
    `viDo` DECIMAL(10, 6) NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    UNIQUE INDEX `san_bay_maIata_key`(`maIata`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `hang_hang_khong` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `maIata` VARCHAR(2) NOT NULL,
    `tenHang` VARCHAR(191) NOT NULL,
    `logo` VARCHAR(191) NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    UNIQUE INDEX `hang_hang_khong_maIata_key`(`maIata`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `chuyen_bay` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `hangId` INTEGER NOT NULL,
    `soHieuChuyenBay` VARCHAR(191) NOT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `chang_bay` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `chuyenBayId` INTEGER NOT NULL,
    `thuTuChang` INTEGER NOT NULL,
    `sanBayDiId` INTEGER NOT NULL,
    `sanBayDenId` INTEGER NOT NULL,
    `gioDi` DATETIME(3) NOT NULL,
    `gioDen` DATETIME(3) NOT NULL,
    `thoiGianBayPhut` INTEGER NOT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `khoang_ve` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `maKhoang` VARCHAR(191) NOT NULL,
    `tenKhoang` VARCHAR(191) NOT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    UNIQUE INDEX `khoang_ve_maKhoang_key`(`maKhoang`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `hang_ve` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `khoangVeId` INTEGER NOT NULL,
    `maHang` VARCHAR(191) NOT NULL,
    `tenHang` VARCHAR(191) NOT NULL,
    `moTa` VARCHAR(191) NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    UNIQUE INDEX `hang_ve_maHang_key`(`maHang`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `nhom_gia_ve` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `tenNhom` VARCHAR(191) NOT NULL,
    `hangVeId` INTEGER NULL,
    `hanhLyKy` INTEGER NOT NULL DEFAULT 0,
    `hanhLyXach` INTEGER NOT NULL DEFAULT 7,
    `choPhepDoi` BOOLEAN NOT NULL DEFAULT false,
    `choPhepHoan` BOOLEAN NOT NULL DEFAULT false,
    `phiDoi` DECIMAL(15, 2) NOT NULL DEFAULT 0,
    `phiHoan` DECIMAL(15, 2) NOT NULL DEFAULT 0,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `ton_cho` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `changBayId` INTEGER NOT NULL,
    `hangVeId` INTEGER NOT NULL,
    `nhomGiaId` INTEGER NULL,
    `tongSoCho` INTEGER NOT NULL,
    `soChoCon` INTEGER NOT NULL,
    `giaCoSo` DECIMAL(15, 2) NOT NULL,
    `thue` DECIMAL(15, 2) NOT NULL DEFAULT 0,
    `phi` DECIMAL(15, 2) NOT NULL DEFAULT 0,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    UNIQUE INDEX `ton_cho_changBayId_hangVeId_nhomGiaId_key`(`changBayId`, `hangVeId`, `nhomGiaId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `don_dat_ve` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `maDatVe` VARCHAR(191) NOT NULL,
    `nguoiDungId` INTEGER NULL,
    `changBayId` INTEGER NOT NULL,
    `hangVeId` INTEGER NOT NULL,
    `nhomGiaId` INTEGER NULL,
    `trangThai` ENUM('TAO_MOI', 'GIU_CHO', 'HET_HAN', 'CHO_THANH_TOAN', 'DA_THANH_TOAN', 'DANG_XUAT_VE', 'DA_XUAT_VE', 'HUY', 'CHO_HOAN_TIEN', 'DA_HOAN_TIEN', 'THAT_BAI') NOT NULL DEFAULT 'TAO_MOI',
    `tongTien` DECIMAL(15, 2) NOT NULL,
    `tienTe` VARCHAR(3) NOT NULL DEFAULT 'VND',
    `hetHanGiuCho` DATETIME(3) NULL,
    `searchSessionId` VARCHAR(191) NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    UNIQUE INDEX `don_dat_ve_maDatVe_key`(`maDatVe`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `hanh_khach` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `donDatVeId` INTEGER NOT NULL,
    `loai` ENUM('NGUOI_LON', 'TRE_EM', 'SO_SINH') NOT NULL,
    `ho` VARCHAR(191) NOT NULL,
    `ten` VARCHAR(191) NOT NULL,
    `gioiTinh` VARCHAR(191) NOT NULL,
    `ngaySinh` DATETIME(3) NOT NULL,
    `soCccd` VARCHAR(191) NULL,
    `soHoChieu` VARCHAR(191) NULL,
    `ngayHetHan` DATETIME(3) NULL,
    `quocTich` VARCHAR(191) NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `thong_tin_lien_he` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `donDatVeId` INTEGER NOT NULL,
    `hoTen` VARCHAR(191) NOT NULL,
    `email` VARCHAR(191) NOT NULL,
    `soDienThoai` VARCHAR(191) NOT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    UNIQUE INDEX `thong_tin_lien_he_donDatVeId_key`(`donDatVeId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `thanh_toan` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `donDatVeId` INTEGER NOT NULL,
    `nguoiDungId` INTEGER NULL,
    `maGiaoDich` VARCHAR(191) NOT NULL,
    `soTien` DECIMAL(15, 2) NOT NULL,
    `tienTe` VARCHAR(3) NOT NULL DEFAULT 'VND',
    `phuongThuc` VARCHAR(191) NOT NULL,
    `trangThai` ENUM('KHOI_TAO', 'CHO_XU_LY', 'THANH_CONG', 'THAT_BAI', 'DA_HOAN') NOT NULL DEFAULT 'KHOI_TAO',
    `thongTinCong` JSON NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    UNIQUE INDEX `thanh_toan_maGiaoDich_key`(`maGiaoDich`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `ve` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `donDatVeId` INTEGER NOT NULL,
    `hanhKhachId` INTEGER NOT NULL,
    `soVe` VARCHAR(191) NOT NULL,
    `trangThai` ENUM('HIEU_LUC', 'DA_SU_DUNG', 'DA_HUY', 'DA_HOAN') NOT NULL DEFAULT 'HIEU_LUC',
    `ngayXuat` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    UNIQUE INDEX `ve_soVe_key`(`soVe`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `san_bay` ADD CONSTRAINT `san_bay_quocGiaId_fkey` FOREIGN KEY (`quocGiaId`) REFERENCES `quoc_gia`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `chuyen_bay` ADD CONSTRAINT `chuyen_bay_hangId_fkey` FOREIGN KEY (`hangId`) REFERENCES `hang_hang_khong`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `chang_bay` ADD CONSTRAINT `chang_bay_chuyenBayId_fkey` FOREIGN KEY (`chuyenBayId`) REFERENCES `chuyen_bay`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `chang_bay` ADD CONSTRAINT `chang_bay_sanBayDiId_fkey` FOREIGN KEY (`sanBayDiId`) REFERENCES `san_bay`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `chang_bay` ADD CONSTRAINT `chang_bay_sanBayDenId_fkey` FOREIGN KEY (`sanBayDenId`) REFERENCES `san_bay`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `hang_ve` ADD CONSTRAINT `hang_ve_khoangVeId_fkey` FOREIGN KEY (`khoangVeId`) REFERENCES `khoang_ve`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `ton_cho` ADD CONSTRAINT `ton_cho_changBayId_fkey` FOREIGN KEY (`changBayId`) REFERENCES `chang_bay`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `ton_cho` ADD CONSTRAINT `ton_cho_hangVeId_fkey` FOREIGN KEY (`hangVeId`) REFERENCES `hang_ve`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `ton_cho` ADD CONSTRAINT `ton_cho_nhomGiaId_fkey` FOREIGN KEY (`nhomGiaId`) REFERENCES `nhom_gia_ve`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `don_dat_ve` ADD CONSTRAINT `don_dat_ve_nguoiDungId_fkey` FOREIGN KEY (`nguoiDungId`) REFERENCES `users`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `don_dat_ve` ADD CONSTRAINT `don_dat_ve_changBayId_fkey` FOREIGN KEY (`changBayId`) REFERENCES `chang_bay`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `don_dat_ve` ADD CONSTRAINT `don_dat_ve_hangVeId_fkey` FOREIGN KEY (`hangVeId`) REFERENCES `hang_ve`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `hanh_khach` ADD CONSTRAINT `hanh_khach_donDatVeId_fkey` FOREIGN KEY (`donDatVeId`) REFERENCES `don_dat_ve`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `thong_tin_lien_he` ADD CONSTRAINT `thong_tin_lien_he_donDatVeId_fkey` FOREIGN KEY (`donDatVeId`) REFERENCES `don_dat_ve`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `thanh_toan` ADD CONSTRAINT `thanh_toan_donDatVeId_fkey` FOREIGN KEY (`donDatVeId`) REFERENCES `don_dat_ve`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `thanh_toan` ADD CONSTRAINT `thanh_toan_nguoiDungId_fkey` FOREIGN KEY (`nguoiDungId`) REFERENCES `users`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `ve` ADD CONSTRAINT `ve_donDatVeId_fkey` FOREIGN KEY (`donDatVeId`) REFERENCES `don_dat_ve`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `ve` ADD CONSTRAINT `ve_hanhKhachId_fkey` FOREIGN KEY (`hanhKhachId`) REFERENCES `hanh_khach`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
