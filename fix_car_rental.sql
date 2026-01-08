-- ===================================================================
-- FIXED SAMPLE DATA - MATCHING PRISMA SCHEMA
-- ===================================================================

-- Insert user
INSERT IGNORE INTO nguoi_dung (id, email, matKhau, hoTen, soDienThoai, role, createdAt, updatedAt)
VALUES (1, 'test@example.com', '$2b$10$abcdefghijklmnopqrstuvwxyz1234567890', 'Test User', '0901234567', 'USER', NOW(), NOW());

-- ===================================================================
-- CAR RENTAL BOOKING - USING CORRECT TABLE NAMES
-- ===================================================================

-- Insert car rental company
INSERT IGNORE INTO nha_cung_cap_xe (id, tenNhaCungCap, logo, soDienThoai, email, diaChi, moTa, danhGia, createdAt, updatedAt)
VALUES (1, 'Viet Car Rental', '/logos/viet-car.png', '19001234', 'info@vietcar.com', 'TP.HCM', 'Công ty cho thuê xe uy tín', 4.6, NOW(), NOW());

-- Insert car type
INSERT IGNORE INTO loai _xe_thue (id, nhaCungCapId, tenLoaiXe, moTa, soHanhKhach, soHanhLy, giaTien, hinhAnh, trangThai, createdAt, updatedAt)
VALUES (1, 1, 'Sedan 4 chỗ', 'Xe sedan tự động, tiện nghi', 4, 2, 600000, '/cars/sedan.jpg', 'ACTIVE', NOW(), NOW());

-- Insert specific rental car
INSERT IGNORE INTO xe_thue (id, nhaCungCapId, loaiXeId, bienSoXe, mauXe, namSanXuat, trangThai, createdAt, updatedAt)
VALUES (1, 1, 1, '51A-12345', 'Trắng', 2022, 'AVAILABLE', NOW(), NOW());

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
    'Sân bay Tân Sơn Nhất', '123 Trường Sơn, Q.Tân Bình',
    'Sân bay Tân Sơn Nhất', '123 Trường Sơn, Q.Tân Bình',
    DATE_ADD(NOW(), INTERVAL 3 DAY),
    DATE_ADD(NOW(), INTERVAL 6 DAY),
    4, 2,
    'Nguyễn Văn A', '0901234567', 'nguyenvana@example.com',
    600000, 0, 0, 1800000,
    'CHO_XAC_NHAN',
    NOW(), NOW()
);

SELECT 'Car rental booking inserted!' as status;
SELECT * FROM don_thue_xe WHERE id = 1;
