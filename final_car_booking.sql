-- ===================================================================
-- FINAL FIX: Using correct ENUM values
-- ===================================================================

-- Insert user
INSERT IGNORE INTO users (id, email, password, hoTen, soDienThoai, vaiTro, createdAt, updatedAt)
VALUES (1, 'test@example.com', '$2b$10$abcdefghijklmnopqrstuvwxyz1234567890', 'Test User', '0901234567', 'CUSTOMER', NOW(), NOW());

-- Check existing cars
SELECT 'Checking existing cars...' as status;
SELECT id, nhaCungCapId, loaiXeId, bienSoXe FROM xe_thue LIMIT 3;

-- Insert car with correct ENUM: SAN_SANG (not AVAILABLE)
INSERT INTO xe_thue (id, nhaCungCapId, loaiXeId, bienSoXe, mauXe, namSanXuat, soHanhKhach, soHanhLy, trangThai, createdAt, updatedAt)
VALUES (1, 1, 1, '51A-12345', 'Trắng', 2023, 4, 2, 'SAN_SANG', NOW(), NOW())
ON DUPLICATE KEY UPDATE trangThai = 'SAN_SANG';

-- Insert car rental booking
INSERT INTO don_thue_xe (
    id, maDonThue, nguoiDungId, nhaCungCapId, xeThueId, loaiXeId,
    diemDon, diaChiDon, diemTra, diaChiTra,
    thoiGianDon, thoiGianTraDuKien,
    soHanhKhach, soHanhLy,
    tenHanhKhach, soDienThoai, email,
    giaThue, phuThu, giamGia, tongTien,
    trangThai,
    createdAt, updatedAt
) VALUES (
    1, 'CAR00001', 1, 1, 1, 1,
    'Sân bay Tân Sơn Nhất', '123 Trường Sơn, Q.Tân Bình, TP.HCM',
    'Sân bay Tân Sơn Nhất', '123 Trường Sơn, Q.Tân Bình, TP.HCM',
    DATE_ADD(NOW(), INTERVAL 3 DAY),
    DATE_ADD(NOW(), INTERVAL 6 DAY),
    3, 3,
    'Nguyễn Văn A', '0901234567', 'nguyenvana@example.com',
    600000, 0, 0, 1800000,
    'CHO_XAC_NHAN',
    NOW(), NOW()
)
ON DUPLICATE KEY UPDATE 
    tongTien = VALUES(tongTien),
    trangThai = VALUES(trangThai);

-- Verify booking
SELECT 'SUCCESS - Car booking created!' as status;
SELECT id, maDonThue, tenHanhKhach, tongTien, trangThai FROM don_thue_xe WHERE id = 1;
