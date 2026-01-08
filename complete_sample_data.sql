-- ===================================================================
-- COMPLETE SAMPLE DATA FOR ADMIN BOOKING TESTING
-- Includes all master data + sample bookings
-- ===================================================================

-- Clean up existing test data (optional - comment out if you want to keep existing data)
-- DELETE FROM dat_ve WHERE id <= 10;
-- DELETE FROM dat_thue_xe WHERE id <= 10;
-- DELETE FROM dat_dich_vu_dua_don WHERE id <= 10;
-- DELETE FROM dat_xe_khach WHERE id <= 10;

-- ===================================================================
-- STEP 1: ENSURE USER EXISTS
-- ===================================================================
INSERT IGNORE INTO nguoi_dung (id, email, matKhau, hoTen, soDienThoai, role, createdAt, updatedAt)
VALUES (1, 'test@example.com', '$2b$10$abcdefghijklmnopqrstuvwxyz1234567890', 'Test User', '0901234567', 'USER', NOW(), NOW());

-- ===================================================================
-- STEP 2: BUS BOOKING DATA
-- ===================================================================

-- Insert bus company if not exists
INSERT IGNORE INTO nha_xe (id, tenNhaXe, logo, soDienThoai, email, diaChi, moTa, danhGia, createdAt, updatedAt)
VALUES (1, 'Phương Trang', '/logos/phuong-trang.png', '19006772', 'info@phuongtrang.com', 'TP.HCM', 'Nhà xe uy tín', 4.5, NOW(), NOW());

-- Insert bus route
INSERT IGNORE INTO chuyen_xe (id, nhaXeId, diemDi, diemDen, gioKhoiHanh, gioKetThuc, loaiXe, gia, soGheTrong, trangThai, createdAt, updatedAt)
VALUES (1, 1, 'TP.HCM', 'Đà Lạt', '2026-01-10 08:00:00', '2026-01-10 14:00:00', 'Giường nằm', 300000, 30, 'ACTIVE', NOW(), NOW());

-- Insert bus booking
INSERT INTO dat_xe_khach (id, maDonDat, chuyenXeId, userId, soDienThoai, tongTien, trangThaiDat, createdAt, updatedAt)
VALUES (1, 'BUS00001', 1, 1, '0901234567', 600000, 'DA_THANH_TOAN', NOW(), NOW());

-- Insert seat details
INSERT INTO chi_tiet_ghe_xe_khach (datXeKhachId, soGhe, giaGhe)
VALUES 
    (1, 'A1', 300000),
    (1, 'A2', 300000);

-- ===================================================================
-- STEP 3: AIRPORT TRANSFER BOOKING DATA
-- ===================================================================

-- Insert transfer company
INSERT IGNORE INTO nha_cung_cap_dua_don (id, tenNhaCungCap, logo, soDienThoai, email, diaChi, moTa, danhGia, trangThai, createdAt, updatedAt)
VALUES (1, 'Mai Linh Transfer', '/logos/mai-linh.png', '0901234567', 'transfer@mailinh.com', 'TP.HCM', 'Dịch vụ đưa đón sân bay', 4.3, 'ACTIVE', NOW(), NOW());

-- Insert airport
INSERT IGNORE INTO san_bay (id, maSanBay, maIata, maIcao, tenSanBay, thanhPho, quocGia, createdAt, updatedAt)
VALUES (1, 'SGN', 'SGN', 'VVTS', 'Sân bay Tân Sơn Nhất', 'TP.HCM', 'Vietnam', NOW(), NOW());

-- Insert transfer service
INSERT IGNORE INTO dich_vu_dua_don (id, nhaCungCapId, sanBayId, loaiXe, soChoNgoi, giaTienMotChieu, giaTienKhuHoi, moTa, trangThai, createdAt, updatedAt)
VALUES (1, 1, 1, '4 chỗ', 4, 250000, 450000, 'Xe 4 chỗ đưa đón sân bay', 'ACTIVE', NOW(), NOW());

-- Insert transfer booking
INSERT INTO dat_dich_vu_dua_don (id, dichVuId, userId, loaiDichVu, ngayDon, diemDon, diemTra, soHanhKhach, tenKhachHang, soDienThoai, email, tongTien, trangThaiThanhToan, trangThai, createdAt, updatedAt)
VALUES (1, 1, 1, 'mot_chieu', DATE_ADD(NOW(), INTERVAL 2 DAY), 'Sân bay Tân Sơn Nhất', '123 Nguyễn Huệ, Q1, TP.HCM', 2, 'Nguyễn Văn A', '0901234567', 'nguyenvana@example.com', 250000, 'pending', 'pending', NOW(), NOW());

-- ===================================================================
-- STEP 4: CAR RENTAL BOOKING DATA
-- ===================================================================

-- Insert car rental company
INSERT IGNORE INTO nha_cung_cap_xe (id, tenNhaCungCap, logo, soDienThoai, email, diaChi, moTa, danhGia, createdAt, updatedAt)
VALUES (1, 'Viet Car Rental', '/logos/viet-car.png', '19001234', 'info@vietcar.com', 'TP.HCM', 'Công ty cho thuê xe uy tín', 4.6, NOW(), NOW());

-- Insert rental car
INSERT IGNORE INTO xe_thue (id, nhaCungCapId, tenXe, loaiXe, hangXe, soChoNgoi, loaiTruyenDong, loaiNhienLieu, soHanhLy, giaTien, moTa, hinhAnh, trangThai, createdAt, updatedAt)
VALUES (1, 1, 'Toyota Vios', 'Sedan', 'Toyota', 5, 'Automatic', 'Xăng', 2, 600000, 'Xe sedan 5 chỗ tự động', '/cars/vios.jpg', 'AVAILABLE', NOW(), NOW());

-- Insert car rental booking
INSERT INTO dat_thue_xe (id, maDonThue, xeId, userId, thoiGianNhan, thoiGianTra, diaDiemNhan, diaDiemTra, soNgayThue, tongTien, soDienThoai, email, trangThai, trangThaiThanhToan, createdAt, updatedAt)
VALUES (1, 'CAR00001', 1, 1, DATE_ADD(NOW(), INTERVAL 3 DAY), DATE_ADD(NOW(), INTERVAL 6 DAY), 'Sân bay Tân Sơn Nhất', 'Sân bay Tân Sơn Nhất', 3, 1800000, '0901234567', 'nguyenvana@example.com', 'CHO_XAC_NHAN', 'CHUA_THANH_TOAN', NOW(), NOW());

-- ===================================================================
-- STEP 5: FLIGHT BOOKING DATA
-- ===================================================================

-- Insert airline
INSERT IGNORE INTO hang_hang_khong (id, maHang, tenHang, logo, quocGia, createdAt, updatedAt)
VALUES (1, 'VN', 'Vietnam Airlines', '/logos/vn.png', 'Vietnam', NOW(), NOW());

-- Insert airports for flight
INSERT IGNORE INTO san_bay (id, maSanBay, maIata, maIcao, tenSanBay, thanhPho, quocGia, createdAt, updatedAt)
VALUES 
    (2, 'HAN', 'HAN', 'VVNB', 'Sân bay Nội Bài', 'Hà Nội', 'Vietnam', NOW(), NOW())
ON DUPLICATE KEY UPDATE id=id;

-- Insert flight  
INSERT IGNORE INTO chuyen_bay (id, hangId, soHieuChuyenBay, sanBayDiId, sanBayDenId, gioKhoiHanh, gioDen, trangThai, createdAt, updatedAt)
VALUES (1, 1, 'VN123', 1, 2, DATE_ADD(NOW(), INTERVAL 5 DAY), DATE_ADD(DATE_ADD(NOW(), INTERVAL 5 DAY), INTERVAL 2 HOUR), 'ACTIVE', NOW(), NOW());

-- Insert flight leg
INSERT IGNORE INTO chang_bay (id, chuyenBayId, sanBayDiId, sanBayDenId, gioDi, gioDen, hangVe, giaVe, soGheTrong, trangThai, createdAt, updatedAt)
VALUES (1, 1, 1, 2, DATE_ADD(NOW(), INTERVAL 5 DAY), DATE_ADD(DATE_ADD(NOW(), INTERVAL 5 DAY), INTERVAL 2 HOUR), 'ECONOMY', 2500000, 50, 'AVAILABLE', NOW(), NOW());

-- Insert flight booking
INSERT INTO dat_ve (id, maDatVe, userId, changBayId, tongTien, tienTe, trangThai, createdAt, updatedAt)
VALUES (1, 'FL00001', 1, 1, 2500000, 'VND', 'CHO_THANH_TOAN', NOW(), NOW());

-- Insert passenger
INSERT INTO hanh_khach (datVeId, ho, ten, loai, soGhe)
VALUES (1, 'Nguyen Van', 'A', 'NGUOI_LON', NULL);

-- Insert contact info
INSERT INTO thong_tin_lien_he (datVeId, hoTen, email, soDienThoai)
VALUES (1, 'Nguyen Van A', 'nguyenvana@example.com', '0901234567');

-- ===================================================================
-- VERIFICATION
-- ===================================================================
SELECT 'Sample data inserted successfully!' as status;
SELECT 
    (SELECT COUNT(*) FROM dat_xe_khach WHERE id = 1) as bus_inserted,
    (SELECT COUNT(*) FROM dat_dich_vu_dua_don WHERE id = 1) as transfer_inserted,
    (SELECT COUNT(*) FROM dat_thue_xe WHERE id = 1) as car_inserted,
    (SELECT COUNT(*) FROM dat_ve WHERE id = 1) as flight_inserted;
