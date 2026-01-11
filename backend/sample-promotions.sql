-- Sample Promotion Data
-- Run this to create test promotion codes

INSERT INTO khuyen_mai (
  maKhuyenMai, 
  tenKhuyenMai, 
  moTa, 
  loaiGiam, 
  giaTriGiam, 
  giamToiDa, 
  giaTriDonToiThieu, 
  soLuotSuDung, 
  soLuotDaSuDung, 
  ngayBatDau, 
  ngayKetThuc, 
  isActive,
  createdAt,
  updatedAt
) VALUES
-- 30% Off Summer Sale
('SUMMER30', 'Giảm 30% Mùa Hè', 'Giảm 30% cho tất cả các vé, tối đa 500K', 
 'PERCENT', 30.00, 500000.00, 1000000.00, 100, 0,
 '2026-06-01 00:00:00', '2026-08-31 23:59:59', 1, NOW(), NOW()),

-- Flash Sale 100K
('FLASH100K', 'Flash Sale 100K', 'Giảm ngay 100,000 VNĐ cho đơn từ 500K', 
 'FIXED', 100000.00, NULL, 500000.00, 50, 0,
 '2026-01-11 00:00:00', '2026-01-31 23:59:59', 1, NOW(), NOW()),

-- Welcome New User
('WELCOME50', 'Chào Mừng Thành Viên Mới', 'Giảm 50K cho đơn hàng đầu tiên',
 'FIXED', 50000.00, NULL, 0.00, 1000, 0,
 '2026-01-01 00:00:00', '2026-12-31 23:59:59', 1, NOW(), NOW()),

-- Tet Holiday 40%
('TET2026', 'Tết Nguyên Đán 2026', 'Giảm 40% dịp Tết, tối đa 1 triệu',
 'PERCENT', 40.00, 1000000.00, 2000000.00, 200, 0,
 '2026-01-20 00:00:00', '2026-02-10 23:59:59', 1, NOW(), NOW()),

-- Weekend Deal
('WEEKEND20', 'Cuối Tuần Vui Vẻ', 'Giảm 20% cho booking cuối tuần',
 'PERCENT', 20.00, 300000.00, 800000.00, 150, 0,
 '2026-01-11 00:00:00', '2026-12-31 23:59:59', 1, NOW(), NOW());

-- Check inserted data
SELECT * FROM khuyen_mai ORDER BY createdAt DESC;
