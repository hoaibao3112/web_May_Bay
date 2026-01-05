-- ====================================
-- THÊM DỮ LIỆU CHO CÁC BẢNG KHÁC
-- ====================================

-- ====================================
-- BƯỚC 1: THÊM KHUYẾN MÃI (10 khuyến mãi)
-- ====================================
INSERT INTO `khuyen_mai` (`maKhuyenMai`, `tenKhuyenMai`, `moTa`, `loaiGiamGia`, `giaTriGiamGia`, `giaTriGiamGiaToiDa`, `giaTriDonHangToiThieu`, `ngayBatDau`, `ngayKetThuc`, `soLuongMa`, `soLanSuDungToiDa`, `apDungCho`, `trangThai`, `createdAt`, `updatedAt`) VALUES
-- Mã giảm giá theo phần trăm
('FLIGHT50K', 'Giảm 50K cho chuyến bay đầu tiên', 'Áp dụng cho khách hàng mới đặt vé lần đầu', 'FIXED', 50000, NULL, 500000, '2026-01-01 00:00:00', '2026-03-31 23:59:59', 1000, 1, 'FIRST_BOOKING', 'ACTIVE', NOW(), NOW()),
('SAVE100K', 'Tiết kiệm 100K', 'Giảm 100K cho đơn từ 2 triệu', 'FIXED', 100000, NULL, 2000000, '2026-01-01 00:00:00', '2026-06-30 23:59:59', 500, 3, 'ALL', 'ACTIVE', NOW(), NOW()),
('PERCENT10', 'Giảm 10%', 'Giảm 10% tối đa 200K', 'PERCENT', 10, 200000, 1000000, '2026-01-01 00:00:00', '2026-12-31 23:59:59', 2000, 5, 'ALL', 'ACTIVE', NOW(), NOW()),
('VIP20', 'VIP giảm 20%', 'Dành cho khách VIP, giảm 20% tối đa 500K', 'PERCENT', 20, 500000, 3000000, '2026-01-01 00:00:00', '2026-12-31 23:59:59', 100, 10, 'VIP', 'ACTIVE', NOW(), NOW()),
('NEWYEAR2026', 'Tết 2026 giảm 15%', 'Ưu đãi đặc biệt dịp Tết Nguyên Đán', 'PERCENT', 15, 300000, 1500000, '2026-01-20 00:00:00', '2026-02-10 23:59:59', 1500, 2, 'ALL', 'ACTIVE', NOW(), NOW()),
('WEEKEND200K', 'Cuối tuần giảm 200K', 'Bay cuối tuần tiết kiệm hơn', 'FIXED', 200000, NULL, 2500000, '2026-01-01 00:00:00', '2026-12-31 23:59:59', 800, 4, 'ALL', 'ACTIVE', NOW(), NOW()),
('STUDENT50', 'Sinh viên giảm 50K', 'Ưu đãi cho sinh viên', 'FIXED', 50000, NULL, 500000, '2026-01-01 00:00:00', '2026-12-31 23:59:59', 3000, 10, 'STUDENT', 'ACTIVE', NOW(), NOW()),
('FAMILY500K', 'Gia đình giảm 500K', 'Đặt từ 4 vé trở lên', 'FIXED', 500000, NULL, 5000000, '2026-01-01 00:00:00', '2026-12-31 23:59:59', 200, 3, 'ALL', 'ACTIVE', NOW(), NOW()),
('FLASH30', 'Flash sale 30%', 'Giảm shock 30% (có hạn)', 'PERCENT', 30, 1000000, 3000000, '2026-01-15 00:00:00', '2026-01-20 23:59:59', 100, 1, 'ALL', 'ACTIVE', NOW(), NOW()),
('EARLYBIRD', 'Đặt sớm giảm 150K', 'Đặt trước 30 ngày giảm 150K', 'FIXED', 150000, NULL, 1500000, '2026-01-01 00:00:00', '2026-12-31 23:59:59', 1000, 5, 'ALL', 'ACTIVE', NOW(), NOW());

-- ====================================
-- BƯỚC 2: THÊM USERS (20 khách hàng + 3 admin)
-- ====================================
INSERT INTO `users` (`email`, `password`, `hoTen`, `soDienThoai`, `vaiTro`, `createdAt`, `updatedAt`, `googleId`) VALUES
-- Khách hàng
('nguyen.vana@gmail.com', '$2b$10$L1iPhZa.HGvU6nByDBlw6OAN/KuCCGF37HFaejtroluMsTcyfCpyS', 'Nguyễn Văn A', '0901234567', 'CUSTOMER', NOW(), NOW(), NULL),
('tran.thib@yahoo.com', '$2b$10$L1iPhZa.HGvU6nByDBlw6OAN/KuCCGF37HFaejtroluMsTcyfCpyS', 'Trần Thị B', '0902345678', 'CUSTOMER', NOW(), NOW(), NULL),
('le.vanc@hotmail.com', '$2b$10$L1iPhZa.HGvU6nByDBlw6OAN/KuCCGF37HFaejtroluMsTcyfCpyS', 'Lê Văn C', '0903456789', 'CUSTOMER', NOW(), NOW(), NULL),
('pham.thid@gmail.com', '$2b$10$L1iPhZa.HGvU6nByDBlw6OAN/KuCCGF37HFaejtroluMsTcyfCpyS', 'Phạm Thị D', '0904567890', 'CUSTOMER', NOW(), NOW(), NULL),
('hoang.vane@gmail.com', '$2b$10$L1iPhZa.HGvU6nByDBlw6OAN/KuCCGF37HFaejtroluMsTcyfCpyS', 'Hoàng Văn E', '0905678901', 'CUSTOMER', NOW(), NOW(), NULL),
('vo.thif@gmail.com', '$2b$10$L1iPhZa.HGvU6nByDBlw6OAN/KuCCGF37HFaejtroluMsTcyfCpyS', 'Võ Thị F', '0906789012', 'CUSTOMER', NOW(), NOW(), NULL),
('dang.vang@gmail.com', '$2b$10$L1iPhZa.HGvU6nByDBlw6OAN/KuCCGF37HFaejtroluMsTcyfCpyS', 'Đặng Văn G', '0907890123', 'CUSTOMER', NOW(), NOW(), NULL),
('do.thih@gmail.com', '$2b$10$L1iPhZa.HGvU6nByDBlw6OAN/KuCCGF37HFaejtroluMsTcyfCpyS', 'Đỗ Thị H', '0908901234', 'CUSTOMER', NOW(), NOW(), NULL),
('bui.vani@gmail.com', '$2b$10$L1iPhZa.HGvU6nByDBlw6OAN/KuCCGF37HFaejtroluMsTcyfCpyS', 'Bùi Văn I', '0909012345', 'CUSTOMER', NOW(), NOW(), NULL),
('ngo.thik@gmail.com', '$2b$10$L1iPhZa.HGvU6nByDBlw6OAN/KuCCGF37HFaejtroluMsTcyfCpyS', 'Ngô Thị K', '0910123456', 'CUSTOMER', NOW(), NOW(), NULL),
('duong.vanl@gmail.com', '$2b$10$L1iPhZa.HGvU6nByDBlw6OAN/KuCCGF37HFaejtroluMsTcyfCpyS', 'Dương Văn L', '0911234567', 'CUSTOMER', NOW(), NOW(), NULL),
('ly.thim@gmail.com', '$2b$10$L1iPhZa.HGvU6nByDBlw6OAN/KuCCGF37HFaejtroluMsTcyfCpyS', 'Lý Thị M', '0912345678', 'CUSTOMER', NOW(), NOW(), NULL),
('trinh.vann@gmail.com', '$2b$10$L1iPhZa.HGvU6nByDBlw6OAN/KuCCGF37HFaejtroluMsTcyfCpyS', 'Trịnh Văn N', '0913456789', 'CUSTOMER', NOW(), NOW(), NULL),
('mai.thio@gmail.com', '$2b$10$L1iPhZa.HGvU6nByDBlw6OAN/KuCCGF37HFaejtroluMsTcyfCpyS', 'Mai Thị O', '0914567890', 'CUSTOMER', NOW(), NOW(), NULL),
('ha.vanp@gmail.com', '$2b$10$L1iPhZa.HGvU6nByDBlw6OAN/KuCCGF37HFaejtroluMsTcyfCpyS', 'Hà Văn P', '0915678901', 'CUSTOMER', NOW(), NOW(), NULL),
('ton.thiq@gmail.com', '$2b$10$L1iPhZa.HGvU6nByDBlw6OAN/KuCCGF37HFaejtroluMsTcyfCpyS', 'Tôn Thị Q', '0916789012', 'CUSTOMER', NOW(), NOW(), NULL),
('thai.vanr@gmail.com', '$2b$10$L1iPhZa.HGvU6nByDBlw6OAN/KuCCGF37HFaejtroluMsTcyfCpyS', 'Thái Văn R', '0917890123', 'CUSTOMER', NOW(), NOW(), NULL),
('tong.this@gmail.com', '$2b$10$L1iPhZa.HGvU6nByDBlw6OAN/KuCCGF37HFaejtroluMsTcyfCpyS', 'Tống Thị S', '0918901234', 'CUSTOMER', NOW(), NOW(), NULL),
('tang.vant@gmail.com', '$2b$10$L1iPhZa.HGvU6nByDBlw6OAN/KuCCGF37HFaejtroluMsTcyfCpyS', 'Tăng Văn T', '0919012345', 'CUSTOMER', NOW(), NOW(), NULL),
('mac.thiu@gmail.com', '$2b$10$L1iPhZa.HGvU6nByDBlw6OAN/KuCCGF37HFaejtroluMsTcyfCpyS', 'Mạc Thị U', '0920123456', 'CUSTOMER', NOW(), NOW(), NULL),
-- Admin thêm
('support@flight.com', '$2b$10$L1iPhZa.HGvU6nByDBlw6OAN/KuCCGF37HFaejtroluMsTcyfCpyS', 'Support Team', '0909999888', 'ADMIN', NOW(), NOW(), NULL),
('manager@flight.com', '$2b$10$L1iPhZa.HGvU6nByDBlw6OAN/KuCCGF37HFaejtroluMsTcyfCpyS', 'Flight Manager', '0909999777', 'ADMIN', NOW(), NOW(), NULL);

-- ====================================
-- BƯỚC 3: THÊM THÔNG BÁO (15 thông báo)
-- ====================================
-- Lấy userId từ bảng users (giả sử user id 3-12 là khách hàng vừa tạo)
INSERT INTO `thong_bao` (`userId`, `tieuDe`, `noiDung`, `loai`, `daXem`, `createdAt`) VALUES
(3, 'Chào mừng đến với hệ thống', 'Cảm ơn bạn đã đăng ký. Nhận ngay mã giảm 50K cho lần đặt vé đầu tiên!', 'SYSTEM', 1, NOW()),
(3, 'Khuyến mãi đặc biệt', 'Flash sale 30% chỉ trong 5 ngày! Đừng bỏ lỡ.', 'PROMOTION', 0, NOW()),
(4, 'Xác nhận đặt vé thành công', 'Đơn hàng #001 của bạn đã được xác nhận. Vui lòng kiểm tra email.', 'BOOKING', 1, NOW()),
(4, 'Nhắc nhở check-in', 'Chuyến bay VN200 của bạn sẽ khởi hành sau 24 giờ. Hãy check-in sớm!', 'REMINDER', 0, NOW()),
(5, 'Thanh toán thành công', 'Thanh toán đơn hàng #002 đã hoàn tất. Tổng: 2.500.000 VND', 'PAYMENT', 1, NOW()),
(5, 'Ưu đãi cuối tuần', 'Giảm 200K cho các chuyến bay cuối tuần. Áp dụng mã WEEKEND200K', 'PROMOTION', 0, NOW()),
(6, 'Cập nhật lịch bay', 'Chuyến bay VJ205 đã thay đổi giờ khởi hành từ 14:00 thành 14:30', 'UPDATE', 1, NOW()),
(6, 'Điểm thưởng mới', 'Bạn vừa nhận được 500 điểm thưởng từ chuyến bay gần nhất!', 'SYSTEM', 0, NOW()),
(7, 'Khuyến mãi Tết 2026', 'Giảm 15% cho tất cả chuyến bay dịp Tết. Mã: NEWYEAR2026', 'PROMOTION', 0, NOW()),
(8, 'Yêu cầu đánh giá', 'Hãy đánh giá trải nghiệm của bạn với chuyến bay VN201', 'REVIEW', 0, NOW()),
(9, 'Hoàn vé thành công', 'Vé #TKT001 đã được hoàn thành công. Tiền sẽ về tài khoản trong 5-7 ngày.', 'REFUND', 1, NOW()),
(10, 'Sinh nhật vui vẻ', 'Chúc mừng sinh nhật! Nhận ngay voucher 100K', 'SYSTEM', 0, NOW()),
(11, 'Cảnh báo thời tiết', 'Chuyến bay DAD-HAN có thể bị delay do thời tiết xấu', 'WARNING', 1, NOW()),
(12, 'Hành lý ký gửi', 'Hành lý của bạn đã được gửi thành công. Mã: BG12345', 'BAGGAGE', 1, NOW()),
(3, 'Chương trình tri ân', 'Tích điểm nhận quà - Đặt 5 vé tặng 1 vé miễn phí!', 'PROMOTION', 0, NOW());

-- ====================================
-- BƯỚC 4: THÊM HÀNH KHÁCH MẪU (30 hành khách)
-- ====================================
INSERT INTO `hanh_khach` (`hoTen`, `ngaySinh`, `gioiTinh`, `quocTich`, `soCMND`, `soHoChieu`, `email`, `soDienThoai`, `createdAt`, `updatedAt`) VALUES
-- Người lớn
('Nguyễn Văn An', '1990-05-15', 'MALE', 'VNM', '001090012345', 'N1234567', 'vanan@gmail.com', '0901234567', NOW(), NOW()),
('Trần Thị Bình', '1985-08-20', 'FEMALE', 'VNM', '001085023456', 'N2345678', 'thibinh@gmail.com', '0902345678', NOW(), NOW()),
('Lê Văn Cường', '1992-03-10', 'MALE', 'VNM', '001092034567', 'N3456789', 'vancuong@gmail.com', '0903456789', NOW(), NOW()),
('Phạm Thị Dung', '1988-11-25', 'FEMALE', 'VNM', '001088045678', 'N4567890', 'thidung@gmail.com', '0904567890', NOW(), NOW()),
('Hoàng Văn Em', '1995-07-30', 'MALE', 'VNM', '001095056789', 'N5678901', 'vanem@gmail.com', '0905678901', NOW(), NOW()),
('Võ Thị Fương', '1987-12-05', 'FEMALE', 'VNM', '001087067890', 'N6789012', 'thifuong@gmail.com', '0906789012', NOW(), NOW()),
('Đặng Văn Giang', '1993-02-14', 'MALE', 'VNM', '001093078901', 'N7890123', 'vangiang@gmail.com', '0907890123', NOW(), NOW()),
('Đỗ Thị Hằng', '1991-09-08', 'FEMALE', 'VNM', '001091089012', 'N8901234', 'thihang@gmail.com', '0908901234', NOW(), NOW()),
('Bùi Văn Inh', '1989-04-22', 'MALE', 'VNM', '001089090123', 'N9012345', 'vaninh@gmail.com', '0909012345', NOW(), NOW()),
('Ngô Thị Kim', '1994-06-17', 'FEMALE', 'VNM', '001094001234', 'N0123456', 'thikim@gmail.com', '0910123456', NOW(), NOW()),
-- Trẻ em
('Nguyễn Minh Long', '2015-03-20', 'MALE', 'VNM', '001015012345', NULL, NULL, NULL, NOW(), NOW()),
('Trần Hà My', '2016-08-15', 'FEMALE', 'VNM', '001016023456', NULL, NULL, NULL, NOW(), NOW()),
('Lê Bảo Nam', '2017-05-10', 'MALE', 'VNM', '001017034567', NULL, NULL, NULL, NOW(), NOW()),
('Phạm Thu Ngân', '2018-12-25', 'FEMALE', 'VNM', '001018045678', NULL, NULL, NULL, NOW(), NOW()),
('Hoàng Minh Oanh', '2014-07-30', 'FEMALE', 'VNM', '001014056789', NULL, NULL, NULL, NOW(), NOW()),
-- Em bé
('Võ Quốc Phong', '2023-01-10', 'MALE', 'VNM', '001023067890', NULL, NULL, NULL, NOW(), NOW()),
('Đặng Thảo Quỳnh', '2024-06-05', 'FEMALE', 'VNM', '001024078901', NULL, NULL, NULL, NOW(), NOW()),
-- Thêm người lớn
('Dương Văn Rồng', '1986-10-12', 'MALE', 'VNM', '001086089012', 'N1122334', 'vanrong@gmail.com', '0911234567', NOW(), NOW()),
('Lý Thị Sang', '1990-01-28', 'FEMALE', 'VNM', '001090090123', 'N2233445', 'thisang@gmail.com', '0912345678', NOW(), NOW()),
('Trịnh Văn Tài', '1992-11-03', 'MALE', 'VNM', '001092001234', 'N3344556', 'vantai@gmail.com', '0913456789', NOW(), NOW()),
('Mai Thị Uyên', '1988-04-19', 'FEMALE', 'VNM', '001088012345', 'N4455667', 'thiuyen@gmail.com', '0914567890', NOW(), NOW()),
('Hà Văn Việt', '1995-09-07', 'MALE', 'VNM', '001095023456', 'N5566778', 'vanviet@gmail.com', '0915678901', NOW(), NOW()),
('Tôn Thị Xuân', '1987-02-21', 'FEMALE', 'VNM', '001087034567', 'N6677889', 'thixuan@gmail.com', '0916789012', NOW(), NOW()),
('Thái Văn Yên', '1993-07-16', 'MALE', 'VNM', '001093045678', 'N7788990', 'vanyen@gmail.com', '0917890123', NOW(), NOW()),
('Tống Thị Zơ', '1991-12-11', 'FEMALE', 'VNM', '001091056789', 'N8899001', 'thizo@gmail.com', '0918901234', NOW(), NOW()),
('Tăng Văn Ánh', '1989-05-26', 'MALE', 'VNM', '001089067890', 'N9900112', 'vananh@gmail.com', '0919012345', NOW(), NOW()),
('Mạc Thị Bảo', '1994-08-31', 'FEMALE', 'VNM', '001094078901', 'N0011223', 'thibao@gmail.com', '0920123456', NOW(), NOW()),
('Ông Văn Chiến', '1996-03-15', 'MALE', 'VNM', '001096089012', 'N1122334', 'vanchien@gmail.com', '0921234567', NOW(), NOW()),
('Ung Thị Diệp', '1990-11-20', 'FEMALE', 'VNM', '001090090123', 'N2233445', 'thidiep@gmail.com', '0922345678', NOW(), NOW()),
('Ứng Văn Đức', '1992-06-05', 'MALE', 'VNM', '001092001234', 'N3344556', 'vanduc@gmail.com', '0923456789', NOW(), NOW());

-- ====================================
-- BƯỚC 5: THÊM ĐƠN ĐẶT VÉ MẪU (20 đơn)
-- ====================================
-- Lấy tonChoId từ các chuyến bay có sẵn (giả sử ID 1085-1100 là các tồn chỗ HAN->SGN)
INSERT INTO `don_dat_ve` (`userId`, `tonChoId`, `maDatCho`, `soLuongVe`, `tongTien`, `trangThai`, `ngayDat`, `hanThanhToan`, `createdAt`, `updatedAt`) VALUES
-- Đơn đã thanh toán
(3, 1085, 'PNR001ABC', 2, 2600000, 'CONFIRMED', '2026-01-03 10:30:00', '2026-01-04 10:30:00', '2026-01-03 10:30:00', '2026-01-03 11:00:00'),
(4, 1086, 'PNR002DEF', 1, 1300000, 'CONFIRMED', '2026-01-03 14:20:00', '2026-01-04 14:20:00', '2026-01-03 14:20:00', '2026-01-03 14:45:00'),
(5, 1087, 'PNR003GHI', 3, 3900000, 'CONFIRMED', '2026-01-03 16:15:00', '2026-01-04 16:15:00', '2026-01-03 16:15:00', '2026-01-03 16:50:00'),
(6, 1088, 'PNR004JKL', 2, 2800000, 'CONFIRMED', '2026-01-03 09:45:00', '2026-01-04 09:45:00', '2026-01-03 09:45:00', '2026-01-03 10:10:00'),
(7, 1089, 'PNR005MNO', 1, 1500000, 'CONFIRMED', '2026-01-03 11:30:00', '2026-01-04 11:30:00', '2026-01-03 11:30:00', '2026-01-03 12:00:00'),
(8, 1090, 'PNR006PQR', 4, 5200000, 'CONFIRMED', '2026-01-03 13:00:00', '2026-01-04 13:00:00', '2026-01-03 13:00:00', '2026-01-03 13:45:00'),
(9, 1091, 'PNR007STU', 2, 2600000, 'CONFIRMED', '2026-01-03 15:20:00', '2026-01-04 15:20:00', '2026-01-03 15:20:00', '2026-01-03 15:55:00'),
(10, 1092, 'PNR008VWX', 1, 1400000, 'CONFIRMED', '2026-01-03 08:10:00', '2026-01-04 08:10:00', '2026-01-03 08:10:00', '2026-01-03 08:35:00'),
(11, 1093, 'PNR009YZA', 3, 4200000, 'CONFIRMED', '2026-01-03 17:40:00', '2026-01-04 17:40:00', '2026-01-03 17:40:00', '2026-01-03 18:20:00'),
(12, 1094, 'PNR010BCD', 2, 2800000, 'CONFIRMED', '2026-01-03 12:50:00', '2026-01-04 12:50:00', '2026-01-03 12:50:00', '2026-01-03 13:25:00'),
-- Đơn chờ thanh toán
(3, 1095, 'PNR011EFG', 1, 1300000, 'PENDING', '2026-01-04 10:00:00', '2026-01-05 10:00:00', '2026-01-04 10:00:00', '2026-01-04 10:00:00'),
(4, 1096, 'PNR012HIJ', 2, 2600000, 'PENDING', '2026-01-04 11:15:00', '2026-01-05 11:15:00', '2026-01-04 11:15:00', '2026-01-04 11:15:00'),
(5, 1097, 'PNR013KLM', 1, 1500000, 'PENDING', '2026-01-04 14:30:00', '2026-01-05 14:30:00', '2026-01-04 14:30:00', '2026-01-04 14:30:00'),
-- Đơn đã hủy
(6, 1098, 'PNR014NOP', 2, 2800000, 'CANCELLED', '2026-01-02 09:20:00', '2026-01-03 09:20:00', '2026-01-02 09:20:00', '2026-01-03 10:30:00'),
(7, 1099, 'PNR015QRS', 1, 1400000, 'CANCELLED', '2026-01-02 15:45:00', '2026-01-03 15:45:00', '2026-01-02 15:45:00', '2026-01-03 08:20:00'),
-- Đơn đã hoàn
(8, 1100, 'PNR016TUV', 3, 3900000, 'REFUNDED', '2026-01-01 11:00:00', '2026-01-02 11:00:00', '2026-01-01 11:00:00', '2026-01-04 09:15:00'),
-- Đơn thêm
(9, 1085, 'PNR017WXY', 2, 2600000, 'CONFIRMED', '2026-01-04 08:30:00', '2026-01-05 08:30:00', '2026-01-04 08:30:00', '2026-01-04 09:00:00'),
(10, 1086, 'PNR018ZAB', 1, 1300000, 'CONFIRMED', '2026-01-04 10:45:00', '2026-01-05 10:45:00', '2026-01-04 10:45:00', '2026-01-04 11:10:00'),
(11, 1087, 'PNR019CDE', 4, 5200000, 'PENDING', '2026-01-04 13:20:00', '2026-01-05 13:20:00', '2026-01-04 13:20:00', '2026-01-04 13:20:00'),
(12, 1088, 'PNR020FGH', 2, 2800000, 'CONFIRMED', '2026-01-04 16:00:00', '2026-01-05 16:00:00', '2026-01-04 16:00:00', '2026-01-04 16:35:00');

-- ====================================
-- BƯỚC 6: THÊM VÉ (cho các đơn đã xác nhận)
-- ====================================
-- Vé cho đơn 1 (2 vé)
INSERT INTO `ve` (`donDatVeId`, `hanhKhachId`, `soVe`, `trangThai`, `ngayXuat`, `createdAt`) VALUES
(1, 1, 'TKT001-1', 'HIEU_LUC', '2026-01-03 11:00:00', '2026-01-03 11:00:00'),
(1, 2, 'TKT001-2', 'HIEU_LUC', '2026-01-03 11:00:00', '2026-01-03 11:00:00'),
-- Vé cho đơn 2 (1 vé)
(2, 3, 'TKT002-1', 'HIEU_LUC', '2026-01-03 14:45:00', '2026-01-03 14:45:00'),
-- Vé cho đơn 3 (3 vé)
(3, 4, 'TKT003-1', 'HIEU_LUC', '2026-01-03 16:50:00', '2026-01-03 16:50:00'),
(3, 5, 'TKT003-2', 'HIEU_LUC', '2026-01-03 16:50:00', '2026-01-03 16:50:00'),
(3, 11, 'TKT003-3', 'HIEU_LUC', '2026-01-03 16:50:00', '2026-01-03 16:50:00'),
-- Vé cho đơn 4 (2 vé)
(4, 6, 'TKT004-1', 'HIEU_LUC', '2026-01-03 10:10:00', '2026-01-03 10:10:00'),
(4, 7, 'TKT004-2', 'HIEU_LUC', '2026-01-03 10:10:00', '2026-01-03 10:10:00'),
-- Vé cho đơn 5 (1 vé)
(5, 8, 'TKT005-1', 'HIEU_LUC', '2026-01-03 12:00:00', '2026-01-03 12:00:00'),
-- Vé cho đơn 6 (4 vé)
(6, 9, 'TKT006-1', 'HIEU_LUC', '2026-01-03 13:45:00', '2026-01-03 13:45:00'),
(6, 10, 'TKT006-2', 'HIEU_LUC', '2026-01-03 13:45:00', '2026-01-03 13:45:00'),
(6, 12, 'TKT006-3', 'HIEU_LUC', '2026-01-03 13:45:00', '2026-01-03 13:45:00'),
(6, 13, 'TKT006-4', 'HIEU_LUC', '2026-01-03 13:45:00', '2026-01-03 13:45:00'),
-- Vé cho đơn 7 (2 vé)
(7, 18, 'TKT007-1', 'HIEU_LUC', '2026-01-03 15:55:00', '2026-01-03 15:55:00'),
(7, 19, 'TKT007-2', 'HIEU_LUC', '2026-01-03 15:55:00', '2026-01-03 15:55:00'),
-- Vé cho đơn 8 (1 vé)
(8, 20, 'TKT008-1', 'HIEU_LUC', '2026-01-03 08:35:00', '2026-01-03 08:35:00'),
-- Vé cho đơn 9 (3 vé)
(9, 21, 'TKT009-1', 'HIEU_LUC', '2026-01-03 18:20:00', '2026-01-03 18:20:00'),
(9, 22, 'TKT009-2', 'HIEU_LUC', '2026-01-03 18:20:00', '2026-01-03 18:20:00'),
(9, 14, 'TKT009-3', 'HIEU_LUC', '2026-01-03 18:20:00', '2026-01-03 18:20:00'),
-- Vé cho đơn 10 (2 vé)
(10, 23, 'TKT010-1', 'HIEU_LUC', '2026-01-03 13:25:00', '2026-01-03 13:25:00'),
(10, 24, 'TKT010-2', 'HIEU_LUC', '2026-01-03 13:25:00', '2026-01-03 13:25:00'),
-- Vé cho đơn 17 (2 vé)
(17, 25, 'TKT017-1', 'HIEU_LUC', '2026-01-04 09:00:00', '2026-01-04 09:00:00'),
(17, 26, 'TKT017-2', 'HIEU_LUC', '2026-01-04 09:00:00', '2026-01-04 09:00:00'),
-- Vé cho đơn 18 (1 vé)
(18, 27, 'TKT018-1', 'HIEU_LUC', '2026-01-04 11:10:00', '2026-01-04 11:10:00'),
-- Vé cho đơn 20 (2 vé)
(20, 28, 'TKT020-1', 'HIEU_LUC', '2026-01-04 16:35:00', '2026-01-04 16:35:00'),
(20, 29, 'TKT020-2', 'HIEU_LUC', '2026-01-04 16:35:00', '2026-01-04 16:35:00');

-- ====================================
-- BƯỚC 7: THÊM THANH TOÁN (cho các đơn đã xác nhận)
-- ====================================
INSERT INTO `thanh_toan` (`donDatVeId`, `phuongThucThanhToan`, `soTien`, `trangThai`, `maGiaoDich`, `ngayThanhToan`, `createdAt`, `updatedAt`) VALUES
(1, 'VNPAY', 2600000, 'COMPLETED', 'VNP20260103001', '2026-01-03 11:00:00', '2026-01-03 11:00:00', '2026-01-03 11:00:00'),
(2, 'MOMO', 1300000, 'COMPLETED', 'MOMO20260103002', '2026-01-03 14:45:00', '2026-01-03 14:45:00', '2026-01-03 14:45:00'),
(3, 'CREDIT_CARD', 3900000, 'COMPLETED', 'CC20260103003', '2026-01-03 16:50:00', '2026-01-03 16:50:00', '2026-01-03 16:50:00'),
(4, 'BANK_TRANSFER', 2800000, 'COMPLETED', 'BT20260103004', '2026-01-03 10:10:00', '2026-01-03 10:10:00', '2026-01-03 10:10:00'),
(5, 'VNPAY', 1500000, 'COMPLETED', 'VNP20260103005', '2026-01-03 12:00:00', '2026-01-03 12:00:00', '2026-01-03 12:00:00'),
(6, 'MOMO', 5200000, 'COMPLETED', 'MOMO20260103006', '2026-01-03 13:45:00', '2026-01-03 13:45:00', '2026-01-03 13:45:00'),
(7, 'CREDIT_CARD', 2600000, 'COMPLETED', 'CC20260103007', '2026-01-03 15:55:00', '2026-01-03 15:55:00', '2026-01-03 15:55:00'),
(8, 'VNPAY', 1400000, 'COMPLETED', 'VNP20260103008', '2026-01-03 08:35:00', '2026-01-03 08:35:00', '2026-01-03 08:35:00'),
(9, 'BANK_TRANSFER', 4200000, 'COMPLETED', 'BT20260103009', '2026-01-03 18:20:00', '2026-01-03 18:20:00', '2026-01-03 18:20:00'),
(10, 'MOMO', 2800000, 'COMPLETED', 'MOMO20260103010', '2026-01-03 13:25:00', '2026-01-03 13:25:00', '2026-01-03 13:25:00'),
-- Thanh toán cho đơn mới
(17, 'VNPAY', 2600000, 'COMPLETED', 'VNP20260104017', '2026-01-04 09:00:00', '2026-01-04 09:00:00', '2026-01-04 09:00:00'),
(18, 'CREDIT_CARD', 1300000, 'COMPLETED', 'CC20260104018', '2026-01-04 11:10:00', '2026-01-04 11:10:00', '2026-01-04 11:10:00'),
(20, 'MOMO', 2800000, 'COMPLETED', 'MOMO20260104020', '2026-01-04 16:35:00', '2026-01-04 16:35:00', '2026-01-04 16:35:00'),
-- Thanh toán chờ xử lý
(11, 'VNPAY', 1300000, 'PENDING', 'VNP20260104011', NULL, '2026-01-04 10:00:00', '2026-01-04 10:00:00'),
(12, 'MOMO', 2600000, 'PENDING', 'MOMO20260104012', NULL, '2026-01-04 11:15:00', '2026-01-04 11:15:00'),
(13, 'CREDIT_CARD', 1500000, 'PENDING', 'CC20260104013', NULL, '2026-01-04 14:30:00', '2026-01-04 14:30:00');

-- ====================================
-- BƯỚC 8: THÊM GIAO DỊCH THANH TOÁN
-- ====================================
INSERT INTO `giao_dich_thanh_toan` (`thanhToanId`, `maGiaoDichNganHang`, `nganHang`, `soTien`, `trangThai`, `thongTinThem`, `createdAt`) VALUES
(1, 'VNP20260103001ABC', 'VNPAY', 2600000, 'SUCCESS', '{"transactionNo":"13456789","bankCode":"NCB","cardType":"ATM"}', '2026-01-03 11:00:00'),
(2, 'MOMO20260103002DEF', 'MOMO', 1300000, 'SUCCESS', '{"partnerCode":"MOMO","orderId":"MM1704268845"}', '2026-01-03 14:45:00'),
(3, 'CC20260103003GHI', 'VISA', 3900000, 'SUCCESS', '{"cardNumber":"****1234","authCode":"123456"}', '2026-01-03 16:50:00'),
(4, 'BT20260103004JKL', 'VIETCOMBANK', 2800000, 'SUCCESS', '{"accountNo":"1234567890","bankBranch":"HCM"}', '2026-01-03 10:10:00'),
(5, 'VNP20260103005MNO', 'VNPAY', 1500000, 'SUCCESS', '{"transactionNo":"23456780","bankCode":"BIDV"}', '2026-01-03 12:00:00'),
(6, 'MOMO20260103006PQR', 'MOMO', 5200000, 'SUCCESS', '{"partnerCode":"MOMO","orderId":"MM1704269225"}', '2026-01-03 13:45:00'),
(7, 'CC20260103007STU', 'MASTERCARD', 2600000, 'SUCCESS', '{"cardNumber":"****5678","authCode":"789012"}', '2026-01-03 15:55:00'),
(8, 'VNP20260103008VWX', 'VNPAY', 1400000, 'SUCCESS', '{"transactionNo":"34567801","bankCode":"TCB"}', '2026-01-03 08:35:00'),
(9, 'BT20260103009YZA', 'TECHCOMBANK', 4200000, 'SUCCESS', '{"accountNo":"0987654321","bankBranch":"HN"}', '2026-01-03 18:20:00'),
(10, 'MOMO20260103010BCD', 'MOMO', 2800000, 'SUCCESS', '{"partnerCode":"MOMO","orderId":"MM1704269605"}', '2026-01-03 13:25:00'),
(11, 'VNP20260104017EFG', 'VNPAY', 2600000, 'SUCCESS', '{"transactionNo":"45678912","bankCode":"VCB"}', '2026-01-04 09:00:00'),
(12, 'CC20260104018HIJ', 'VISA', 1300000, 'SUCCESS', '{"cardNumber":"****9012","authCode":"345678"}', '2026-01-04 11:10:00'),
(13, 'MOMO20260104020KLM', 'MOMO', 2800000, 'SUCCESS', '{"partnerCode":"MOMO","orderId":"MM1704359400"}', '2026-01-04 16:35:00');

-- ====================================
-- BƯỚC 9: THÊM HÀNH LÝ (cho một số vé)
-- ====================================
INSERT INTO `hanh_ly` (`veId`, `loaiHanhLy`, `trongLuong`, `gia`, `trangThai`, `ghiChu`, `createdAt`) VALUES
-- Hành lý cho vé đơn 1
(1, 'CHECKED', 23, 200000, 'REGISTERED', '1 vali lớn', NOW()),
(2, 'CHECKED', 20, 200000, 'REGISTERED', '1 vali trung', NOW()),
-- Hành lý cho vé đơn 3
(4, 'CHECKED', 25, 250000, 'REGISTERED', '1 vali lớn + 1 túi xách', NOW()),
(5, 'CHECKED', 18, 150000, 'REGISTERED', '1 vali nhỏ', NOW()),
(6, 'HAND', 7, 0, 'REGISTERED', 'Túi xách tay trẻ em', NOW()),
-- Hành lý cho vé đơn 4
(7, 'CHECKED', 30, 300000, 'REGISTERED', '1 vali lớn', NOW()),
(8, 'CHECKED', 22, 200000, 'REGISTERED', '1 vali trung', NOW()),
-- Hành lý cho vé đơn 6
(10, 'CHECKED', 20, 200000, 'REGISTERED', '1 vali trung', NOW()),
(11, 'CHECKED', 15, 150000, 'REGISTERED', '1 ba lô lớn', NOW()),
(12, 'HAND', 5, 0, 'REGISTERED', 'Túi xách tay trẻ em', NOW()),
(13, 'HAND', 6, 0, 'REGISTERED', 'Túi xách tay trẻ em', NOW()),
-- Hành lý cho vé đơn 9
(17, 'CHECKED', 28, 280000, 'REGISTERED', '1 vali + 1 túi', NOW()),
(18, 'CHECKED', 19, 150000, 'REGISTERED', '1 vali nhỏ', NOW()),
(19, 'HAND', 7, 0, 'REGISTERED', 'Ba lô trẻ em', NOW()),
-- Hành lý cho vé đơn 17
(21, 'CHECKED', 24, 240000, 'REGISTERED', '1 vali lớn', NOW()),
(22, 'CHECKED', 21, 200000, 'REGISTERED', '1 vali trung', NOW());

-- ====================================
-- BƯỚC 10: THÊM THÔNG TIN LIÊN HỆ (cho các đơn)
-- ====================================
INSERT INTO `thong_tin_lien_he` (`donDatVeId`, `hoTen`, `email`, `soDienThoai`, `diaChi`, `createdAt`) VALUES
(1, 'Nguyễn Văn An', 'vanan@gmail.com', '0901234567', '123 Nguyễn Huệ, Q1, TP.HCM', '2026-01-03 10:30:00'),
(2, 'Trần Thị Bình', 'thibinh@gmail.com', '0902345678', '456 Trần Hưng Đạo, Q5, TP.HCM', '2026-01-03 14:20:00'),
(3, 'Lê Văn Cường', 'vancuong@gmail.com', '0903456789', '789 Lê Lợi, Q1, TP.HCM', '2026-01-03 16:15:00'),
(4, 'Phạm Thị Dung', 'thidung@gmail.com', '0904567890', '321 Hai Bà Trưng, Q3, TP.HCM', '2026-01-03 09:45:00'),
(5, 'Hoàng Văn Em', 'vanem@gmail.com', '0905678901', '654 Nguyễn Thị Minh Khai, Q1, TP.HCM', '2026-01-03 11:30:00'),
(6, 'Võ Thị Fương', 'thifuong@gmail.com', '0906789012', '987 Pasteur, Q1, TP.HCM', '2026-01-03 13:00:00'),
(7, 'Đặng Văn Giang', 'vangiang@gmail.com', '0907890123', '159 Võ Văn Tần, Q3, TP.HCM', '2026-01-03 15:20:00'),
(8, 'Đỗ Thị Hằng', 'thihang@gmail.com', '0908901234', '753 Điện Biên Phủ, Q3, TP.HCM', '2026-01-03 08:10:00'),
(9, 'Bùi Văn Inh', 'vaninh@gmail.com', '0909012345', '852 Cách Mạng Tháng 8, Q10, TP.HCM', '2026-01-03 17:40:00'),
(10, 'Ngô Thị Kim', 'thikim@gmail.com', '0910123456', '147 Lý Thường Kiệt, Q10, TP.HCM', '2026-01-03 12:50:00'),
(11, 'Nguyễn Văn An', 'vanan@gmail.com', '0901234567', '123 Nguyễn Huệ, Q1, TP.HCM', '2026-01-04 10:00:00'),
(12, 'Trần Thị Bình', 'thibinh@gmail.com', '0902345678', '456 Trần Hưng Đạo, Q5, TP.HCM', '2026-01-04 11:15:00'),
(13, 'Lê Văn Cường', 'vancuong@gmail.com', '0903456789', '789 Lê Lợi, Q1, TP.HCM', '2026-01-04 14:30:00'),
(14, 'Phạm Thị Dung', 'thidung@gmail.com', '0904567890', '321 Hai Bà Trưng, Q3, TP.HCM', '2026-01-02 09:20:00'),
(15, 'Hoàng Văn Em', 'vanem@gmail.com', '0905678901', '654 Nguyễn Thị Minh Khai, Q1, TP.HCM', '2026-01-02 15:45:00'),
(16, 'Võ Thị Fương', 'thifuong@gmail.com', '0906789012', '987 Pasteur, Q1, TP.HCM', '2026-01-01 11:00:00'),
(17, 'Dương Văn Rồng', 'vanrong@gmail.com', '0911234567', '258 Ba Tháng Hai, Q10, TP.HCM', '2026-01-04 08:30:00'),
(18, 'Lý Thị Sang', 'thisang@gmail.com', '0912345678', '369 Hoàng Văn Thụ, Tân Bình, TP.HCM', '2026-01-04 10:45:00'),
(19, 'Trịnh Văn Tài', 'vantai@gmail.com', '0913456789', '741 Cộng Hòa, Tân Bình, TP.HCM', '2026-01-04 13:20:00'),
(20, 'Mai Thị Uyên', 'thiuyen@gmail.com', '0914567890', '963 Lạc Long Quân, Q11, TP.HCM', '2026-01-04 16:00:00');

-- ====================================
-- BƯỚC 11: THÊM ĐÁNH GIÁ (10 đánh giá)
-- ====================================
INSERT INTO `danh_gia` (`userId`, `chuyenBayId`, `diem`, `binhLuan`, `createdAt`) VALUES
(3, 24, 5, 'Chuyến bay rất tốt, nhân viên nhiệt tình. Máy bay đúng giờ!', '2026-01-03 20:00:00'),
(4, 25, 4, 'Dịch vụ ổn, đồ ăn ngon. Hành lý hơi chậm một chút.', '2026-01-03 21:30:00'),
(5, 26, 5, 'Tuyệt vời! Sẽ đặt lại lần sau. Ghế ngồi thoải mái.', '2026-01-03 22:15:00'),
(6, 27, 3, 'Bình thường, không có gì đặc biệt. Giá hơi cao.', '2026-01-03 18:45:00'),
(7, 28, 4, 'Khá tốt, check-in nhanh gọn. Cần cải thiện wifi trên máy bay.', '2026-01-03 19:30:00'),
(8, 29, 5, 'Hoàn hảo! Tiếp viên thân thiện, máy bay sạch sẽ.', '2026-01-03 17:20:00'),
(9, 30, 4, 'Hài lòng với chuyến bay. Đúng giờ, dịch vụ tốt.', '2026-01-04 08:00:00'),
(10, 31, 5, 'Rất đáng giá tiền! Sẽ giới thiệu cho bạn bè.', '2026-01-04 09:30:00'),
(11, 32, 3, 'Tạm ổn. Máy bay hơi ồn, nhưng giá cả hợp lý.', '2026-01-04 10:15:00'),
(12, 33, 4, 'Chuyến bay suôn sẻ. Hành lý được xử lý cẩn thận.', '2026-01-04 11:45:00');

-- ====================================
-- HOÀN THÀNH!
-- ====================================
-- Kiểm tra kết quả:
-- SELECT COUNT(*) FROM khuyen_mai;
-- SELECT COUNT(*) FROM users;
-- SELECT COUNT(*) FROM thong_bao;
-- SELECT COUNT(*) FROM hanh_khach;
-- SELECT COUNT(*) FROM don_dat_ve;
-- SELECT COUNT(*) FROM ve;
-- SELECT COUNT(*) FROM thanh_toan;
-- SELECT COUNT(*) FROM giao_dich_thanh_toan;
-- SELECT COUNT(*) FROM hanh_ly;
-- SELECT COUNT(*) FROM thong_tin_lien_he;
-- SELECT COUNT(*) FROM danh_gia;
