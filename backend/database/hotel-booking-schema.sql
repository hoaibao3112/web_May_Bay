-- ================================================
-- HOTEL BOOKING SCHEMA
-- Table: dat_khach_san (Hotel Bookings)
-- ================================================

CREATE TABLE IF NOT EXISTS dat_khach_san (
  id INT PRIMARY KEY AUTO_INCREMENT,
  ma_dat VARCHAR(50) UNIQUE NOT NULL COMMENT 'Mã đặt phòng duy nhất (HOTEL{timestamp})',
  
  -- Hotel & Room Info
  khach_san_id INT NOT NULL COMMENT 'ID khách sạn',
  phong_id INT NOT NULL COMMENT 'ID phòng',
  
  -- Customer Info
  ho_ten VARCHAR(255) NOT NULL COMMENT 'Họ tên người đặt',
  email VARCHAR(255) NOT NULL COMMENT 'Email liên hệ',
  so_dien_thoai VARCHAR(20) NOT NULL COMMENT 'Số điện thoại',
  
  -- Booking Details
  ngay_nhan_phong DATE NOT NULL COMMENT 'Ngày nhận phòng',
  ngay_tra_phong DATE NOT NULL COMMENT 'Ngày trả phòng', 
  so_dem INT NOT NULL COMMENT 'Số đêm lưu trú',
  so_nguoi INT NOT NULL DEFAULT 2 COMMENT 'Số khách',
  so_phong INT NOT NULL DEFAULT 1 COMMENT 'Số phòng đặt',
  
  -- Payment
  tong_tien DECIMAL(12, 2) NOT NULL COMMENT 'Tổng tiền (bao gồm thuế)',
  phuong_thuc_thanh_toan ENUM('MOMO', 'VIETQR', 'ZALOPAY', 'VNPAY') COMMENT 'Phương thức thanh toán',
  da_thanh_toan BOOLEAN DEFAULT FALSE COMMENT 'Trạng thái thanh toán',
  trang_thai ENUM('CHO_XAC_NHAN', 'DA_XAC_NHAN', 'HOAN_THANH', 'HUY', 'HOAN_TIEN') DEFAULT 'CHO_XAC_NHAN' COMMENT 'Trạng thái đơn',
  
  -- Metadata
  ghi_chu TEXT COMMENT 'Yêu cầu đặc biệt từ khách',
  nguoi_dung_id INT NULL COMMENT 'ID người dùng (nếu đã login)',
  
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  
  -- Foreign Keys
  FOREIGN KEY (khach_san_id) REFERENCES khach_san(id) ON DELETE RESTRICT,
  FOREIGN KEY (phong_id) REFERENCES phong(id) ON DELETE RESTRICT,
  
  -- Indexes
  INDEX idx_email (email),
  INDEX idx_ma_dat (ma_dat),
  INDEX idx_trang_thai (trang_thai),
  INDEX idx_da_thanh_toan (da_thanh_toan),
  INDEX idx_ngay_nhan_phong (ngay_nhan_phong),
  INDEX idx_created_at (created_at)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci 
COMMENT='Lưu trữ thông tin đặt phòng khách sạn';

-- Sample data for testing
INSERT INTO dat_khach_san (
  ma_dat, khach_san_id, phong_id, ho_ten, email, so_dien_thoai,
  ngay_nhan_phong, ngay_tra_phong, so_dem, so_nguoi, so_phong,
  tong_tien, phuong_thuc_thanh_toan, da_thanh_toan, trang_thai, ghi_chu
) VALUES
('HOTEL20260109001', 1, 1, 'Nguyễn Văn A', 'nguyenvana@email.com', '0912345678',
 '2026-01-20', '2026-01-22', 2, 2, 1, 2200000, 'MOMO', TRUE, 'DA_XAC_NHAN', 'Phòng tầng cao'),
('HOTEL20260109002', 2, 3, 'Trần Thị B', 'tranthib@email.com', '0987654321',
 '2026-01-25', '2026-01-28', 3, 4, 2, 6600000, 'VIETQR', TRUE, 'DA_XAC_NHAN', NULL),
('HOTEL20260109003', 1, 2, 'Lê Văn C', 'levanc@email.com', '0909123456',
 '2026-02-01', '2026-02-03', 2, 2, 1, 3300000, 'ZALOPAY', FALSE, 'CHO_XAC_NHAN', 'Giường đôi');
