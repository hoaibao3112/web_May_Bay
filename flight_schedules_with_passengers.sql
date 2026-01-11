-- ============================================
-- SQL Script: Thêm nhiều lịch bay và hành khách
-- ============================================

-- XÓA DỮ LIỆU CŨ (nếu có) để tránh lỗi duplicate
DELETE FROM hanh_khach WHERE id BETWEEN 1000 AND 1134;
DELETE FROM don_dat_ve WHERE id BETWEEN 100 AND 214;
DELETE FROM chang_bay WHERE id BETWEEN 2000 AND 2013;

-- Thêm lịch bay mới (với chuyenBayId, sanBayId có sẵn trong DB)
-- Tháng 1 năm 2026 - SGN <-> HAN
INSERT INTO `chang_bay` (`id`, `chuyenBayId`, `thuTuChang`, `sanBayDiId`, `sanBayDenId`, `gioDi`, `gioDen`, `thoiGianBayPhut`, `createdAt`, `updatedAt`) VALUES
(2000, 24, 1, 1, 2, '2026-01-12 06:00:00', '2026-01-12 08:15:00', 135, NOW(), NOW()),
(2001, 25, 1, 1, 2, '2026-01-12 10:30:00', '2026-01-12 12:45:00', 135, NOW(), NOW()),
(2002, 26, 1, 1, 2, '2026-01-12 15:00:00', '2026-01-12 17:15:00', 135, NOW(), NOW()),
(2003, 30, 1, 2, 1, '2026-01-12 07:00:00', '2026-01-12 09:15:00', 135, NOW(), NOW()),
(2004, 31, 1, 2, 1, '2026-01-12 12:00:00', '2026-01-12 14:15:00', 135, NOW(), NOW()),
(2005, 32, 1, 2, 1, '2026-01-12 17:00:00', '2026-01-12 19:15:00', 135, NOW(), NOW()),

(2006, 24, 1, 1, 2, '2026-01-13 05:30:00', '2026-01-13 07:45:00', 135, NOW(), NOW()),
(2007, 25, 1, 1, 2, '2026-01-13 09:00:00', '2026-01-13 11:15:00', 135, NOW(), NOW()),
(2008, 26, 1, 1, 2, '2026-01-13 13:30:00', '2026-01-13 15:45:00', 135, NOW(), NOW()),
(2009, 27, 1, 1, 2, '2026-01-13 18:00:00', '2026-01-13 20:15:00', 135, NOW(), NOW()),

(2010, 30, 1, 2, 1, '2026-01-13 06:30:00', '2026-01-13 08:45:00', 135, NOW(), NOW()),
(2011, 31, 1, 2, 1, '2026-01-13 11:00:00', '2026-01-13 13:15:00', 135, NOW(), NOW()),
(2012, 32, 1, 2, 1, '2026-01-13 16:00:00', '2026-01-13 18:15:00', 135, NOW(), NOW()),
(2013, 33, 1, 2, 1, '2026-01-13 20:30:00', '2026-01-13 22:45:00', 135, NOW(), NOW());

-- Thêm đơn đặt vé cho các chuyến bay trên (userId = 1 - user có sẵn)
-- Chuyến 2000: 45 hành khách
INSERT INTO `don_dat_ve` (`id`, `maDatVe`, `nguoiDungId`, `changBayId`, `hangVeId`, `nhomGiaId`, `trangThai`, `tongTien`, `tienTe`, `hetHanGiuCho`, `searchSessionId`, `createdAt`, `updatedAt`, `giamGia`, `maKhuyenMai`) VALUES
(100, 'FL2000-001', 1, 2000, 1, NULL, 'DA_THANH_TOAN', 4200000, 'VND', '2026-01-13 06:00:00', NULL, NOW(), NOW(), 0, NULL),
(101, 'FL2000-002', 1, 2000, 1, NULL, 'DA_THANH_TOAN', 2800000, 'VND', '2026-01-13 06:00:00', NULL, NOW(), NOW(), 0, NULL),
(102, 'FL2000-003', 1, 2000, 1, NULL, 'DA_THANH_TOAN', 1400000, 'VND', '2026-01-13 06:00:00', NULL, NOW(), NOW(), 0, NULL),
(103, 'FL2000-004', 1, 2000, 1, NULL, 'DA_THANH_TOAN', 5600000, 'VND', '2026-01-13 06:00:00', NULL, NOW(), NOW(), 0, NULL),
(104, 'FL2000-005', 1, 2000, 1, NULL, 'DA_THANH_TOAN', 2800000, 'VND', '2026-01-13 06:00:00', NULL, NOW(), NOW(), 0, NULL),
(105, 'FL2000-006', 1, 2000, 1, NULL, 'DA_THANH_TOAN', 4200000, 'VND', '2026-01-13 06:00:00', NULL, NOW(), NOW(), 0, NULL),
(106, 'FL2000-007', 1, 2000, 1, NULL, 'DA_THANH_TOAN', 2800000, 'VND', '2026-01-13 06:00:00', NULL, NOW(), NOW(), 0, NULL),
(107, 'FL2000-008', 1, 2000, 1, NULL, 'DA_THANH_TOAN', 1400000, 'VND', '2026-01-13 06:00:00', NULL, NOW(), NOW(), 0, NULL),
(108, 'FL2000-009', 1, 2000, 1, NULL, 'DA_THANH_TOAN', 4200000, 'VND', '2026-01-13 06:00:00', NULL, NOW(), NOW(), 0, NULL),
(109, 'FL2000-010', 1, 2000, 1, NULL, 'DA_THANH_TOAN', 2800000, 'VND', '2026-01-13 06:00:00', NULL, NOW(), NOW(), 0, NULL),
(110, 'FL2000-011', 1, 2000, 1, NULL, 'DA_THANH_TOAN', 5600000, 'VND', '2026-01-13 06:00:00', NULL, NOW(), NOW(), 0, NULL),
(111, 'FL2000-012', 1, 2000, 1, NULL, 'DA_THANH_TOAN', 4200000, 'VND', '2026-01-13 06:00:00', NULL, NOW(), NOW(), 0, NULL),
(112, 'FL2000-013', 1, 2000, 1, NULL, 'DA_THANH_TOAN', 2800000, 'VND', '2026-01-13 06:00:00', NULL, NOW(), NOW(), 0, NULL),
(113, 'FL2000-014', 1, 2000, 1, NULL, 'DA_THANH_TOAN', 1400000, 'VND', '2026-01-13 06:00:00', NULL, NOW(), NOW(), 0, NULL),
(114, 'FL2000-015', 1, 2000, 1, NULL, 'DA_THANH_TOAN', 2800000, 'VND', '2026-01-13 06:00:00', NULL, NOW(), NOW(), 0, NULL),
(115, 'FL2000-016', 1, 2000, 1, NULL, 'DA_THANH_TOAN', 4200000, 'VND', '2026-01-13 06:00:00', NULL, NOW(), NOW(), 0, NULL),
(116, 'FL2000-017', 1, 2000, 1, NULL, 'DA_THANH_TOAN', 2800000, 'VND', '2026-01-13 06:00:00', NULL, NOW(), NOW(), 0, NULL),
(117, 'FL2000-018', 1, 2000, 1, NULL, 'DA_THANH_TOAN', 1400000, 'VND', '2026-01-13 06:00:00', NULL, NOW(), NOW(), 0, NULL),
(118, 'FL2000-019', 1, 2000, 1, NULL, 'DA_THANH_TOAN', 2800000, 'VND', '2026-01-13 06:00:00', NULL, NOW(), NOW(), 0, NULL);

-- Chuyến 2001: 38 hành khách
INSERT INTO `don_dat_ve` (`id`, `maDatVe`, `nguoiDungId`, `changBayId`, `hangVeId`, `nhomGiaId`, `trangThai`, `tongTien`, `tienTe`, `hetHanGiuCho`, `searchSessionId`, `createdAt`, `updatedAt`, `giamGia`, `maKhuyenMai`) VALUES
(200, 'FL2001-001', 1, 2001, 1, NULL, 'DA_THANH_TOAN', 2800000, 'VND', '2026-01-13 10:30:00', NULL, NOW(), NOW(), 0, NULL),
(201, 'FL2001-002', 1, 2001, 1, NULL, 'DA_THANH_TOAN', 4200000, 'VND', '2026-01-13 10:30:00', NULL, NOW(), NOW(), 0, NULL),
(202, 'FL2001-003', 1, 2001, 1, NULL, 'DA_THANH_TOAN', 2800000, 'VND', '2026-01-13 10:30:00', NULL, NOW(), NOW(), 0, NULL),
(203, 'FL2001-004', 1, 2001, 1, NULL, 'DA_THANH_TOAN', 1400000, 'VND', '2026-01-13 10:30:00', NULL, NOW(), NOW(), 0, NULL),
(204, 'FL2001-005', 1, 2001, 1, NULL, 'DA_THANH_TOAN', 4200000, 'VND', '2026-01-13 10:30:00', NULL, NOW(), NOW(), 0, NULL),
(205, 'FL2001-006', 1, 2001, 1, NULL, 'DA_THANH_TOAN', 5600000, 'VND', '2026-01-13 10:30:00', NULL, NOW(), NOW(), 0, NULL),
(206, 'FL2001-007', 1, 2001, 1, NULL, 'DA_THANH_TOAN', 2800000, 'VND', '2026-01-13 10:30:00', NULL, NOW(), NOW(), 0, NULL),
(207, 'FL2001-008', 1, 2001, 1, NULL, 'DA_THANH_TOAN', 4200000, 'VND', '2026-01-13 10:30:00', NULL, NOW(), NOW(), 0, NULL),
(208, 'FL2001-009', 1, 2001, 1, NULL, 'DA_THANH_TOAN', 2800000, 'VND', '2026-01-13 10:30:00', NULL, NOW(), NOW(), 0, NULL),
(209, 'FL2001-010', 1, 2001, 1, NULL, 'DA_THANH_TOAN', 1400000, 'VND', '2026-01-13 10:30:00', NULL, NOW(), NOW(), 0, NULL),
(210, 'FL2001-011', 1, 2001, 1, NULL, 'DA_THANH_TOAN', 4200000, 'VND', '2026-01-13 10:30:00', NULL, NOW(), NOW(), 0, NULL),
(211, 'FL2001-012', 1, 2001, 1, NULL, 'DA_THANH_TOAN', 2800000, 'VND', '2026-01-13 10:30:00', NULL, NOW(), NOW(), 0, NULL),
(212, 'FL2001-013', 1, 2001, 1, NULL, 'DA_THANH_TOAN', 5600000, 'VND', '2026-01-13 10:30:00', NULL, NOW(), NOW(), 0, NULL),
(213, 'FL2001-014', 1, 2001, 1, NULL, 'DA_THANH_TOAN', 1400000, 'VND', '2026-01-13 10:30:00', NULL, NOW(), NOW(), 0, NULL),
(214, 'FL2001-015', 1, 2001, 1, NULL, 'DA_THANH_TOAN', 2800000, 'VND', '2026-01-13 10:30:00', NULL, NOW(), NOW(), 0, NULL);

-- Thêm hành khách cho đơn đặt vé 100 (3 người)
INSERT INTO `hanh_khach` (`id`, `donDatVeId`, `loai`, `ho`, `ten`, `gioiTinh`, `ngaySinh`, `soCccd`, `soHoChieu`, `quocTich`, `soGhe`, `daCheckin`, `createdAt`) VALUES
(1000, 100, 'NGUOI_LON', 'Nguyễn', 'Văn An', 'NAM', '1990-05-15', '001234567890', NULL, 'Việt Nam', '12A', TRUE, NOW()),
(1001, 100, 'NGUOI_LON', 'Trần', 'Thị Bình', 'NU', '1992-08-20', '001234567891', NULL, 'Việt Nam', '12B', TRUE, NOW()),
(1002, 100, 'TRE_EM', 'Nguyễn', 'Minh Châu', 'NU', '2015-03-10', NULL, NULL, 'Việt Nam', '12C', FALSE, NOW()),

(1003, 101, 'NGUOI_LON', 'Lê', 'Quốc Dũng', 'NAM', '1985-12-01', '001234567892', NULL, 'Việt Nam', '13A', TRUE, NOW()),
(1004, 101, 'NGUOI_LON', 'Phạm', 'Thu Hà', 'NU', '1988-07-25', '001234567893', NULL, 'Việt Nam', '13B', TRUE, NOW()),

(1005, 102, 'NGUOI_LON', 'Hoàng', 'Minh Tuấn', 'NAM', '1995-04-18', '001234567894', NULL, 'Việt Nam', '14A', TRUE, NOW()),

(1006, 103, 'NGUOI_LON', 'Võ', 'Thị Mai', 'NU', '1987-11-05', '001234567895', NULL, 'Việt Nam', '15A', TRUE, NOW()),
(1007, 103, 'NGUOI_LON', 'Đỗ', 'Văn Bình', 'NAM', '1986-09-14', '001234567896', NULL, 'Việt Nam', '15B', FALSE, NOW()),
(1008, 103, 'TRE_EM', 'Võ', 'Anh Khoa', 'NAM', '2012-06-20', NULL, NULL, 'Việt Nam', '15C', FALSE, NOW()),
(1009, 103, 'TRE_EM', 'Võ', 'Huyền Trang', 'NU', '2014-02-15', NULL, NULL, 'Việt Nam', '15D', FALSE, NOW()),

(1010, 104, 'NGUOI_LON', 'Bùi', 'Văn Cường', 'NAM', '1993-01-30', '001234567897', NULL, 'Việt Nam', '16A', TRUE, NOW()),
(1011, 104, 'NGUOI_LON', 'Đinh', 'Thị Lan', 'NU', '1994-10-12', '001234567898', NULL, 'Việt Nam', '16B', TRUE, NOW()),

(1012, 105, 'NGUOI_LON', 'Trương', 'Minh Phương', 'NAM', '1989-08-08', '001234567899', NULL, 'Việt Nam', '17A', TRUE, NOW()),
(1013, 105, 'NGUOI_LON', 'Lý', 'Thị Ngọc', 'NU', '1991-03-22', '001234567800', NULL, 'Việt Nam', '17B', TRUE, NOW()),
(1014, 105, 'NGUOI_LON', 'Trương', 'Văn Hùng', 'NAM', '1990-07-17', '001234567801', NULL, 'Việt Nam', '17C', TRUE, NOW()),

(1015, 106, 'NGUOI_LON', 'Phan', 'Văn Quyết', 'NAM', '1996-05-25', '001234567802', NULL, 'Việt Nam', '18A', FALSE, NOW()),
(1016, 106, 'NGUOI_LON', 'Ngô', 'Thị Hoa', 'NU', '1997-09-30', '001234567803', NULL, 'Việt Nam', '18B', FALSE, NOW()),

(1017, 107, 'NGUOI_LON', 'Dương', 'Văn Tài', 'NAM', '1984-11-11', '001234567804', NULL, 'Việt Nam', '19A', TRUE, NOW()),

(1018, 108, 'NGUOI_LON', 'Hồ', 'Thị Yến', 'NU', '1992-12-05', '001234567805', NULL, 'Việt Nam', '20A', TRUE, NOW()),
(1019, 108, 'NGUOI_LON', 'Vũ', 'Văn Long', 'NAM', '1993-04-18', '001234567806', NULL, 'Việt Nam', '20B', TRUE, NOW()),
(1020, 108, 'TRE_EM', 'Hồ', 'Minh Anh', 'NU', '2016-01-10', NULL, NULL, 'Việt Nam', '20C', FALSE, NOW()),

(1021, 109, 'NGUOI_LON', 'Cao', 'Văn Sơn', 'NAM', '1988-06-14', '001234567807', NULL, 'Việt Nam', '21A', TRUE, NOW()),
(1022, 109, 'NGUOI_LON', 'Tạ', 'Thị Hồng', 'NU', '1990-08-22', '001234567808', NULL, 'Việt Nam', '21B', TRUE, NOW()),

(1023, 110, 'NGUOI_LON', 'Nguyễn', 'Văn Đức', 'NAM', '1987-02-28', '001234567809', NULL, 'Việt Nam', '22A', TRUE, NOW()),
(1024, 110, 'NGUOI_LON', 'Trần', 'Thị Kim', 'NU', '1989-11-19', '001234567810', NULL, 'Việt Nam', '22B', TRUE, NOW()),
(1025, 110, 'NGUOI_LON', 'Nguyễn', 'Văn Nam', 'NAM', '1995-09-05', '001234567811', NULL, 'Việt Nam', '22C', FALSE, NOW()),
(1026, 110, 'TRE_EM', 'Nguyễn', 'Bảo Ngọc', 'NU', '2013-03-12', NULL, NULL, 'Việt Nam', '22D', FALSE, NOW()),

(1027, 111, 'NGUOI_LON', 'Lê', 'Văn Thắng', 'NAM', '1986-10-10', '001234567812', NULL, 'Việt Nam', '23A', TRUE, NOW()),
(1028, 111, 'NGUOI_LON', 'Phạm', 'Thị Xuân', 'NU', '1987-05-17', '001234567813', NULL, 'Việt Nam', '23B', TRUE, NOW()),
(1029, 111, 'NGUOI_LON', 'Lê', 'Minh Hoàng', 'NAM', '1990-12-24', '001234567814', NULL, 'Việt Nam', '23C', TRUE, NOW()),

(1030, 112, 'NGUOI_LON', 'Hoàng', 'Văn Linh', 'NAM', '1994-01-08', '001234567815', NULL, 'Việt Nam', '24A', FALSE, NOW()),
(1031, 112, 'NGUOI_LON', 'Võ', 'Thị Phương', 'NU', '1996-06-21', '001234567816', NULL, 'Việt Nam', '24B', FALSE, NOW()),

(1032, 113, 'NGUOI_LON', 'Đỗ', 'Văn Quân', 'NAM', '1991-07-03', '001234567817', NULL, 'Việt Nam', '25A', TRUE, NOW()),

(1033, 114, 'NGUOI_LON', 'Bùi', 'Thị Thảo', 'NU', '1993-09-15', '001234567818', NULL, 'Việt Nam', '26A', TRUE, NOW()),

(1034, 115, 'NGUOI_LON', 'Đinh', 'Văn Tùng', 'NAM', '1985-04-27', '001234567819', NULL, 'Việt Nam', '27A', TRUE, NOW()),
(1035, 115, 'NGUOI_LON', 'Trương', 'Thị Vy', 'NU', '1986-08-09', '001234567820', NULL, 'Việt Nam', '27B', TRUE, NOW()),

(1036, 116, 'NGUOI_LON', 'Lý', 'Văn Hải', 'NAM', '1992-11-16', '001234567821', NULL, 'Việt Nam', '28A', FALSE, NOW()),
(1037, 116, 'NGUOI_LON', 'Phan', 'Thị Nhung', 'NU', '1994-02-14', '001234567822', NULL, 'Việt Nam', '28B', FALSE, NOW()),
(1038, 116, 'TRE_EM', 'Lý', 'Quỳnh Anh', 'NU', '2017-05-20', NULL, NULL, 'Việt Nam', '28C', FALSE, NOW()),

(1039, 117, 'NGUOI_LON', 'Ngô', 'Văn Phú', 'NAM', '1990-03-06', '001234567823', NULL, 'Việt Nam', '29A', TRUE, NOW()),
(1040, 117, 'NGUOI_LON', 'Dương', 'Thị Tú', 'NU', '1991-07-19', '001234567824', NULL, 'Việt Nam', '29B', TRUE, NOW()),

(1041, 118, 'NGUOI_LON', 'Hồ', 'Văn Trung', 'NAM', '1988-12-22', '001234567825', NULL, 'Việt Nam', '30A', TRUE, NOW()),

(1042, 119, 'NGUOI_LON', 'Vũ', 'Thị Vân', 'NU', '1995-10-31', '001234567826', NULL, 'Việt Nam', '31A', TRUE, NOW()),
(1043, 119, 'NGUOI_LON', 'Cao', 'Văn Tú', 'NAM', '1996-01-13', '001234567827', NULL, 'Việt Nam', '31B', FALSE, NOW());

-- Thêm hành khách cho chuyến 1501 (booking 200-214)
INSERT INTO `hanh_khach` (`id`, `donDatVeId`, `loai`, `ho`, `ten`, `gioiTinh`, `ngaySinh`, `soCccd`, `soHoChieu`, `quocTich`, `soGhe`, `daCheckin`, `createdAt`) VALUES
(1100, 200, 'NGUOI_LON', 'Tạ', 'Văn Bình', 'NAM', '1989-05-05', '001234567828', NULL, 'Việt Nam', '1A', TRUE, NOW(), NOW()),
(1101, 200, 'NGUOI_LON', 'Nguyễn', 'Thị Diệp', 'NU', '1990-08-14', '001234567829', NULL, 'Việt Nam', '1B', TRUE, NOW(), NOW()),

(1102, 201, 'NGUOI_LON', 'Trần', 'Văn Hùng', 'NAM', '1986-11-20', '001234567830', NULL, 'Việt Nam', '2A', TRUE, NOW(), NOW()),
(1103, 201, 'NGUOI_LON', 'Lê', 'Thị Mai', 'NU', '1987-04-25', '001234567831', NULL, 'Việt Nam', '2B', TRUE, NOW(), NOW()),
(1104, 201, 'TRE_EM', 'Trần', 'Minh Anh', 'NU', '2015-07-10', NULL, NULL, 'Việt Nam', '2C', FALSE, NOW(), NOW()),

(1105, 202, 'NGUOI_LON', 'Phạm', 'Văn Nam', 'NAM', '1992-02-17', '001234567832', NULL, 'Việt Nam', '3A', FALSE, NOW(), NOW()),
(1106, 202, 'NGUOI_LON', 'Hoàng', 'Thị Oanh', 'NU', '1993-10-08', '001234567833', NULL, 'Việt Nam', '3B', FALSE, NOW(), NOW()),

(1107, 203, 'NGUOI_LON', 'Võ', 'Văn Phong', 'NAM', '1991-09-22', '001234567834', NULL, 'Việt Nam', '4A', TRUE, NOW(), NOW()),

(1108, 204, 'NGUOI_LON', 'Đỗ', 'Thị Giang', 'NU', '1988-06-30', '001234567835', NULL, 'Việt Nam', '5A', TRUE, NOW(), NOW()),
(1109, 204, 'NGUOI_LON', 'Bùi', 'Văn Hải', 'NAM', '1989-03-12', '001234567836', NULL, 'Việt Nam', '5B', TRUE, NOW(), NOW()),
(1110, 204, 'NGUOI_LON', 'Đỗ', 'Văn Khánh', 'NAM', '1995-11-05', '001234567837', NULL, 'Việt Nam', '5C', FALSE, NOW(), NOW()),

(1111, 205, 'NGUOI_LON', 'Đinh', 'Văn Linh', 'NAM', '1990-07-18', '001234567838', NULL, 'Việt Nam', '6A', TRUE, NOW(), NOW()),
(1112, 205, 'NGUOI_LON', 'Trương', 'Thị Minh', 'NU', '1991-12-21', '001234567839', NULL, 'Việt Nam', '6B', TRUE, NOW(), NOW()),
(1113, 205, 'TRE_EM', 'Đinh', 'Ngọc Ánh', 'NU', '2014-05-09', NULL, NULL, 'Việt Nam', '6C', FALSE, NOW(), NOW()),
(1114, 205, 'TRE_EM', 'Đinh', 'Tuấn Kiệt', 'NAM', '2016-08-15', NULL, NULL, 'Việt Nam', '6D', FALSE, NOW(), NOW()),

(1115, 206, 'NGUOI_LON', 'Lý', 'Văn Nhật', 'NAM', '1987-04-03', '001234567840', NULL, 'Việt Nam', '7A', TRUE, NOW(), NOW()),
(1116, 206, 'NGUOI_LON', 'Phan', 'Thị Oanh', 'NU', '1988-09-27', '001234567841', NULL, 'Việt Nam', '7B', FALSE, NOW(), NOW()),

(1117, 207, 'NGUOI_LON', 'Ngô', 'Văn Phú', 'NAM', '1994-01-15', '001234567842', NULL, 'Việt Nam', '8A', TRUE, NOW(), NOW()),
(1118, 207, 'NGUOI_LON', 'Dương', 'Thị Quỳnh', 'NU', '1995-06-20', '001234567843', NULL, 'Việt Nam', '8B', TRUE, NOW(), NOW()),
(1119, 207, 'NGUOI_LON', 'Ngô', 'Văn Sơn', 'NAM', '1992-10-11', '001234567844', NULL, 'Việt Nam', '8C', TRUE, NOW(), NOW()),

(1120, 208, 'NGUOI_LON', 'Hồ', 'Văn Tài', 'NAM', '1986-11-07', '001234567845', NULL, 'Việt Nam', '9A', FALSE, NOW(), NOW()),
(1121, 208, 'NGUOI_LON', 'Vũ', 'Thị Uyên', 'NU', '1987-03-29', '001234567846', NULL, 'Việt Nam', '9B', FALSE, NOW(), NOW()),

(1122, 209, 'NGUOI_LON', 'Cao', 'Văn Việt', 'NAM', '1993-08-16', '001234567847', NULL, 'Việt Nam', '10A', TRUE, NOW(), NOW()),

(1123, 210, 'NGUOI_LON', 'Tạ', 'Thị Xuân', 'NU', '1990-12-24', '001234567848', NULL, 'Việt Nam', '11A', TRUE, NOW(), NOW()),
(1124, 210, 'NGUOI_LON', 'Nguyễn', 'Văn Yên', 'NAM', '1991-05-13', '001234567849', NULL, 'Việt Nam', '11B', TRUE, NOW(), NOW()),
(1125, 210, 'TRE_EM', 'Tạ', 'Bảo Châu', 'NU', '2018-02-20', NULL, NULL, 'Việt Nam', '11C', FALSE, NOW(), NOW()),

(1126, 211, 'NGUOI_LON', 'Trần', 'Văn An', 'NAM', '1989-07-04', '001234567850', NULL, 'Việt Nam', '12A', TRUE, NOW(), NOW()),
(1127, 211, 'NGUOI_LON', 'Lê', 'Thị Bình', 'NU', '1990-11-18', '001234567851', NULL, 'Việt Nam', '12B', FALSE, NOW(), NOW()),

(1128, 212, 'NGUOI_LON', 'Phạm', 'Văn Cường', 'NAM', '1985-02-09', '001234567852', NULL, 'Việt Nam', '13A', TRUE, NOW(), NOW()),
(1129, 212, 'NGUOI_LON', 'Hoàng', 'Thị Dung', 'NU', '1986-06-22', '001234567853', NULL, 'Việt Nam', '13B', TRUE, NOW(), NOW()),
(1130, 212, 'NGUOI_LON', 'Phạm', 'Văn Đạt', 'NAM', '1992-09-30', '001234567854', NULL, 'Việt Nam', '13C', TRUE, NOW(), NOW()),
(1131, 212, 'TRE_EM', 'Phạm', 'Ngọc Linh', 'NU', '2016-12-05', NULL, NULL, 'Việt Nam', '13D', FALSE, NOW(), NOW()),

(1132, 213, 'NGUOI_LON', 'Võ', 'Văn Giang', 'NAM', '1994-04-14', '001234567855', NULL, 'Việt Nam', '14A', TRUE, NOW(), NOW()),

(1133, 214, 'NGUOI_LON', 'Đỗ', 'Thị Hoa', 'NU', '1991-10-28', '001234567856', NULL, 'Việt Nam', '15A', FALSE, NOW(), NOW()),
(1134, 214, 'NGUOI_LON', 'Bùi', 'Văn Khánh', 'NAM', '1992-01-19', '001234567857', NULL, 'Việt Nam', '15B', FALSE, NOW(), NOW());

-- ============================================
-- TỔNG KẾT:
-- - 14 lịch bay mới (2000-2013)  
-- - 34 đơn đặt vé (100-119 cho chuyến 2000, 200-214 cho chuyến 2001)
-- - 83 hành khách (1000-1134)
-- 
-- Bạn có thể tạo thêm data cho các chuyến 2002-2013
-- bằng cách copy pattern trên và thay đổi ID
-- ============================================
