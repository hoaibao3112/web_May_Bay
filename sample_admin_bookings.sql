-- Sample data for testing admin booking management pages
-- Insert sample bus booking
INSERT INTO dat_xe_khach (
    id, maDonDat, chuyenXeId, userId, 
    soDienThoai, tongTien, trangThaiDat, 
    createdAt, updatedAt
) VALUES (
    1, 'BUS00001', 1, 1,
    '0901234567', 350000, 'DA_THANH_TOAN',
    NOW(), NOW()
);

-- Insert seat details for bus booking
INSERT INTO chi_tiet_ghe_xe_khach (datXeKhachId, soGhe, giaGhe)
VALUES 
    (1, 'A1', 175000),
    (1, 'A2', 175000);

-- Sample airport transfer booking
INSERT INTO dat_dich_vu_dua_don (
    id, dichVuId, userId, loaiDichVu,
    ngayDon, diemDon, diemTra, soHanhKhach,
    tenKhachHang, soDienThoai, email,
    tongTien, trangThaiThanhToan, trangThai,
    createdAt, updatedAt
) VALUES (
    1, 1, 1, 'mot_chieu',
    DATE_ADD(NOW(), INTERVAL 1 DAY), 
    'Sân bay Tân Sơn Nhất', 
    'Quận 1, TP.HCM', 
    2,
    'Nguyễn Văn A', 
    '0901234567', 
    'nguyenvana@example.com',
    250000, 'pending', 'pending',
    NOW(), NOW()
);

-- Sample car rental booking  
INSERT INTO dat_thue_xe (
    id, maDonThue, xeId, userId,
    thoiGianNhan, thoiGianTra, 
    diaDiemNhan, diaDiemTra,
    soNgayThue, tongTien,
    soDienThoai, email,
    trangThai, trangThaiThanhToan,
    createdAt, updatedAt
) VALUES (
    1, 'CAR00001', 1, 1,
    DATE_ADD(NOW(), INTERVAL 2 DAY),
    DATE_ADD(NOW(), INTERVAL 5 DAY),
    'Sân bay Tân Sơn Nhất',
    'Sân bay Tân Sơn Nhất',
    3, 1200000,
    '0901234567',
    'nguyenvana@example.com',
    'CHO_XAC_NHAN', 'CHUA_THANH_TOAN',
    NOW(), NOW()
);

-- Sample flight booking
INSERT INTO dat_ve (
    id, maDatVe, userId, changBayId,
    tongTien, tienTe, trangThai,
    createdAt, updatedAt
) VALUES (
    1, 'FL00001', 1, 1,
    4500000, 'VND', 'CHO_THANH_TOAN',
    NOW(), NOW()
);

-- Sample passenger for flight
INSERT INTO hanh_khach (
    datVeId, ho, ten, loai, soGhe
) VALUES (
    1, 'Nguyen Van', 'A', 'NGUOI_LON', '12A'
);

-- Sample contact info for flight
INSERT INTO thong_tin_lien_he (
    datVeId, hoTen, email, soDienThoai
) VALUES (
    1, 'Nguyen Van A', 'nguyenvana@example.com', '0901234567'
);

SELECT 'Sample data inserted successfully!' as message;
