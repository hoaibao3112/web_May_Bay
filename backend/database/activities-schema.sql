-- =============================================
-- ACTIVITIES/TOURS MODULE - DATABASE SCHEMA
-- =============================================

-- 1. Danh mục hoạt động
CREATE TABLE IF NOT EXISTS danh_muc_hoat_dong (
    id INT AUTO_INCREMENT PRIMARY KEY,
    tenDanhMuc VARCHAR(100) NOT NULL,
    moTa TEXT,
    icon VARCHAR(50),
    thuTu INT DEFAULT 0,
    trangThai ENUM('HOAT_DONG', 'TAM_NGUNG') DEFAULT 'HOAT_DONG',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 2. Nhà cung cấp hoạt động
CREATE TABLE IF NOT EXISTS nha_cung_cap_hoat_dong (
    id INT AUTO_INCREMENT PRIMARY KEY,
    maNhaCungCap VARCHAR(50) UNIQUE NOT NULL,
    tenNhaCungCap VARCHAR(200) NOT NULL,
    logo TEXT,
    soDienThoai VARCHAR(20),
    email VARCHAR(100),
    diaChi TEXT,
    website VARCHAR(255),
    danhGiaTrungBinh DECIMAL(2,1) DEFAULT 0,
    soLuotDanhGia INT DEFAULT 0,
    trangThai ENUM('HOAT_DONG', 'TAM_NGUNG') DEFAULT 'HOAT_DONG',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 3. Hoạt động/Tours
CREATE TABLE IF NOT EXISTS hoat_dong (
    id INT AUTO_INCREMENT PRIMARY KEY,
    maHoatDong VARCHAR(50) UNIQUE NOT NULL,
    tenHoatDong VARCHAR(255) NOT NULL,
    moTaNgan TEXT,
    moTaChiTiet TEXT,
    danhMucId INT NOT NULL,
    nhaCungCapId INT NOT NULL,
    diaDiem VARCHAR(255),
    thanhPho VARCHAR(100),
    quocGia VARCHAR(100) DEFAULT 'Vietnam',
    thoiGianDienRa VARCHAR(100), -- VD: "3 giờ", "Cả ngày", "2 ngày 1 đêm"
    soLuongToiDa INT DEFAULT 20,
    doTuoiToiThieu INT DEFAULT 0,
    baoGomAnUong BOOLEAN DEFAULT FALSE,
    baoGomDuaDon BOOLEAN DEFAULT FALSE,
    huongDanVien BOOLEAN DEFAULT TRUE,
    giaTuMoiNguoi DECIMAL(10,2) NOT NULL,
    tienTe VARCHAR(3) DEFAULT 'VND',
    danhGiaTrungBinh DECIMAL(2,1) DEFAULT 0,
    soLuotDanhGia INT DEFAULT 0,
    soLuotDat INT DEFAULT 0,
    trangThai ENUM('HOAT_DONG', 'TAM_NGUNG', 'HET_HANG') DEFAULT 'HOAT_DONG',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (danhMucId) REFERENCES danh_muc_hoat_dong(id),
    FOREIGN KEY (nhaCungCapId) REFERENCES nha_cung_cap_hoat_dong(id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 4. Hình ảnh hoạt động
CREATE TABLE IF NOT EXISTS hinh_anh_hoat_dong (
    id INT AUTO_INCREMENT PRIMARY KEY,
    hoatDongId INT NOT NULL,
    urlHinhAnh TEXT NOT NULL,
    laTrangBia BOOLEAN DEFAULT FALSE,
    moTa VARCHAR(255),
    thuTu INT DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (hoatDongId) REFERENCES hoat_dong(id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 5. Loại giá (người lớn, trẻ em, v.v.)
CREATE TABLE IF NOT EXISTS gia_hoat_dong (
    id INT AUTO_INCREMENT PRIMARY KEY,
    hoatDongId INT NOT NULL,
    loaiKhach ENUM('NGUOI_LON', 'TRE_EM', 'SINH_VIEN', 'NGUOI_CAO_TUOI') NOT NULL,
    gia DECIMAL(10,2) NOT NULL,
    moTa VARCHAR(255),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (hoatDongId) REFERENCES hoat_dong(id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 6. Lịch hoạt động
CREATE TABLE IF NOT EXISTS lich_hoat_dong (
    id INT AUTO_INCREMENT PRIMARY KEY,
    hoatDongId INT NOT NULL,
    ngay DATE NOT NULL,
    gioKhoiHanh TIME NOT NULL,
    soChoToiDa INT DEFAULT 20,
    soChoConLai INT,
    trangThai ENUM('HOAT_DONG', 'DAY', 'HUY') DEFAULT 'HOAT_DONG',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (hoatDongId) REFERENCES hoat_dong(id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 7. Đặt hoạt động
CREATE TABLE IF NOT EXISTS dat_hoat_dong (
    id INT AUTO_INCREMENT PRIMARY KEY,
    maDat VARCHAR(50) UNIQUE NOT NULL,
    nguoiDungId INT NULL,  -- NULLABLE - không bắt buộc phải có user
    hoatDongId INT NOT NULL,
    lichHoatDongId INT,
    ngayThucHien DATE NOT NULL,
    soNguoiLon INT DEFAULT 1,
    soTreEm INT DEFAULT 0,
    tongTien DECIMAL(10,2) NOT NULL,
    tienTe VARCHAR(3) DEFAULT 'VND',
    hoTen VARCHAR(100) NOT NULL,
    email VARCHAR(100) NOT NULL,
    soDienThoai VARCHAR(20) NOT NULL,
    ghiChu TEXT,
    trangThai ENUM('CHO_XAC_NHAN', 'DA_XAC_NHAN', 'HOAN_THANH', 'HUY', 'HOAN_TIEN') DEFAULT 'CHO_XAC_NHAN',
    phuongThucThanhToan VARCHAR(50),
    daThanhToan BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    -- REMOVED nguoi_dung FK constraint - will add later if needed
    FOREIGN KEY (hoatDongId) REFERENCES hoat_dong(id),
    FOREIGN KEY (lichHoatDongId) REFERENCES lich_hoat_dong(id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 8. Đánh giá hoạt động
CREATE TABLE IF NOT EXISTS danh_gia_hoat_dong (
    id INT AUTO_INCREMENT PRIMARY KEY,
    hoatDongId INT NOT NULL,
    nguoiDungId INT NULL,  -- NULLABLE
    datHoatDongId INT,
    diem INT CHECK (diem >= 1 AND diem <= 5),
    nhanXet TEXT,
    hinhAnh TEXT,
    phanHoi TEXT,
    thoiGianPhanHoi TIMESTAMP NULL,
    trangThai ENUM('CHO_DUYET', 'DA_DUYET', 'TU_CHOI') DEFAULT 'CHO_DUYET',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (hoatDongId) REFERENCES hoat_dong(id) ON DELETE CASCADE,
    -- REMOVED nguoi_dung FK constraint
    FOREIGN KEY (datHoatDongId) REFERENCES dat_hoat_dong(id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 9. Điểm nổi bật của hoạt động
CREATE TABLE IF NOT EXISTS diem_noi_bat_hoat_dong (
    id INT AUTO_INCREMENT PRIMARY KEY,
    hoatDongId INT NOT NULL,
    noiDung VARCHAR(255) NOT NULL,
    icon VARCHAR(50),
    thuTu INT DEFAULT 0,
    FOREIGN KEY (hoatDongId) REFERENCES hoat_dong(id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Indexes for better performance
CREATE INDEX idx_hoat_dong_danh_muc ON hoat_dong(danhMucId);
CREATE INDEX idx_hoat_dong_thanh_pho ON hoat_dong(thanhPho);
CREATE INDEX idx_hoat_dong_trang_thai ON hoat_dong(trangThai);
CREATE INDEX idx_lich_hoat_dong_ngay ON lich_hoat_dong(ngay);
CREATE INDEX idx_dat_hoat_dong_trang_thai ON dat_hoat_dong(trangThai);
CREATE INDEX idx_danh_gia_hoat_dong ON danh_gia_hoat_dong(hoatDongId);
