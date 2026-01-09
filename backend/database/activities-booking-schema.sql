-- =============================================
-- ACTIVITY BOOKINGS TABLE
-- Run this after activities-schema.sql
-- =============================================

CREATE TABLE IF NOT EXISTS dat_hoat_dong (
  id INT PRIMARY KEY AUTO_INCREMENT,
  ma_dat_cho VARCHAR(50) UNIQUE NOT NULL COMMENT 'Mã đặt chỗ duy nhất',
  hoat_dong_id INT NOT NULL COMMENT 'ID hoạt động',
  
  -- Thông tin khách hàng
  ho_ten VARCHAR(255) NOT NULL COMMENT 'Họ tên người đặt',
  email VARCHAR(255) NOT NULL COMMENT 'Email liên hệ',
  so_dien_thoai VARCHAR(20) NOT NULL COMMENT 'Số điện thoại',
  
  -- Chi tiết booking
  ngay_thuc_hien DATE NOT NULL COMMENT 'Ngày thực hiện hoạt động',
  so_nguoi_lon INT NOT NULL DEFAULT 1 COMMENT 'Số người lớn',
  so_tre_em INT NOT NULL DEFAULT 0 COMMENT 'Số trẻ em',
  
  -- Thanh toán
  tong_tien DECIMAL(12, 2) NOT NULL COMMENT 'Tổng tiền',
  phuong_thuc_thanh_toan ENUM('MOMO', 'VIETQR', 'ZALOPAY', 'VNPAY') COMMENT 'Phương thức thanh toán',
  trang_thai_thanh_toan ENUM('CHO_THANH_TOAN', 'DA_THANH_TOAN', 'THAT_BAI', 'HUY') DEFAULT 'CHO_THANH_TOAN' COMMENT 'Trạng thái thanh toán',
  
  -- Metadata
  ghi_chu TEXT COMMENT 'Ghi chú từ khách hàng',
  nguoi_dung_id INT NULL COMMENT 'ID người dùng (nếu đã login)',
  
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  
  -- Foreign Keys
  FOREIGN KEY (hoat_dong_id) REFERENCES hoat_dong(id) ON DELETE RESTRICT,
  
  -- Indexes
  INDEX idx_email (email),
  INDEX idx_ma_dat_cho (ma_dat_cho),
  INDEX idx_trang_thai (trang_thai_thanh_toan),
  INDEX idx_ngay_thuc_hien (ngay_thuc_hien),
  INDEX idx_created_at (created_at)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- =============================================
-- SAMPLE DATA (Optional for testing)
-- =============================================

INSERT INTO dat_hoat_dong (
  ma_dat_cho, hoat_dong_id, ho_ten, email, so_dien_thoai,
  ngay_thuc_hien, so_nguoi_lon, so_tre_em, tong_tien,
  phuong_thuc_thanh_toan, trang_thai_thanh_toan, ghi_chu
) VALUES
('ACT20260109001', 11, 'Nguyễn Văn A', 'nguyenvana@email.com', '0912345678', 
 '2026-01-20', 2, 1, 300000, 'MOMO', 'DA_THANH_TOAN', 'Vui lòng đón tại khách sạn'),
('ACT20260109002', 13, 'Trần Thị B', 'tranthib@email.com', '0987654321',
 '2026-01-22', 4, 0, 3800000, 'VIETQR', 'DA_THANH_TOAN', NULL),
('ACT20260109003', 16, 'Lê Văn C', 'levanc@email.com', '0909123456',
 '2026-01-25', 2, 2, 3000000, 'ZALOPAY', 'CHO_THANH_TOAN', 'Gọi trước 30 phút');
