-- =====================================================
-- THÊM BẢNG THANH TOÁN ĐƯA ĐÓN SÂN BAY
-- Add payment table for airport transfer service
-- =====================================================

-- Xóa bảng cũ nếu tồn tại
DROP TABLE IF EXISTS `thanh_toan_dua_don`;

-- Tạo bảng thanh toán đưa đón
CREATE TABLE `thanh_toan_dua_don` (
  `id` INT NOT NULL AUTO_INCREMENT,
  `datDichVuId` INT NOT NULL COMMENT 'ID booking từ bảng dat_dich_vu_dua_don',
  `soTien` DECIMAL(10,2) NOT NULL COMMENT 'Số tiền thanh toán',
  `phuongThucThanhToan` VARCHAR(50) NOT NULL COMMENT 'momo, vnpay, zalopay, banking, credit_card, cash',
  `trangThai` ENUM('pending', 'processing', 'completed', 'failed', 'refunded') DEFAULT 'pending',
  
  -- Thông tin giao dịch
  `maGiaoDich` VARCHAR(100) UNIQUE COMMENT 'Mã giao dịch hệ thống',
  `maGiaoDichNganHang` VARCHAR(100) COMMENT 'Mã giao dịch từ ngân hàng/cổng thanh toán',
  `nganHang` VARCHAR(100) COMMENT 'Tên ngân hàng',
  `nganHangMa` VARCHAR(50) COMMENT 'Mã ngân hàng (NCB, VCB, TCB...)',
  
  -- Chi tiết giao dịch
  `thongTinGiaoDich` JSON COMMENT 'Thông tin JSON chi tiết từ cổng thanh toán',
  `moTa` TEXT COMMENT 'Mô tả giao dịch',
  
  -- Thời gian
  `thoiGianThanhToan` DATETIME COMMENT 'Thời gian thanh toán thành công',
  `createdAt` DATETIME(3) DEFAULT CURRENT_TIMESTAMP(3),
  `updatedAt` DATETIME(3) DEFAULT CURRENT_TIMESTAMP(3) ON UPDATE CURRENT_TIMESTAMP(3),
  
  PRIMARY KEY (`id`),
  FOREIGN KEY (`datDichVuId`) REFERENCES `dat_dich_vu_dua_don`(`id`) ON DELETE CASCADE,
  
  INDEX `idx_payment_booking` (`datDichVuId`),
  INDEX `idx_payment_status` (`trangThai`),
  INDEX `idx_payment_method` (`phuongThucThanhToan`),
  INDEX `idx_transaction_code` (`maGiaoDich`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
COMMENT='Bảng thanh toán dịch vụ đưa đón sân bay';

-- =====================================================
-- THÊM DỮ LIỆU MẪU CHO CÁC BOOKING ĐÃ THANH TOÁN
-- =====================================================

-- Thanh toán cho booking ID 1 (Nguyễn Văn A - credit card)
INSERT INTO `thanh_toan_dua_don` (
  `datDichVuId`, `soTien`, `phuongThucThanhToan`, `trangThai`, 
  `maGiaoDich`, `maGiaoDichNganHang`, `nganHang`, `nganHangMa`,
  `thongTinGiaoDich`, `moTa`, `thoiGianThanhToan`
) VALUES
(1, 250000.00, 'credit_card', 'completed', 
 'CREDIT20260107001', 'TXN123456789', 'Visa', 'VISA',
 '{"cardType": "credit", "last4": "1234", "brand": "Visa", "bank": "Vietcombank"}',
 'Thanh toán thẻ tín dụng Visa', '2026-01-07 07:10:00'),

-- Thanh toán cho booking ID 2 (Nguyễn Văn A - bank transfer)
(2, 650000.00, 'bank_transfer', 'completed',
 'BANK20260107002', 'VCB987654321', 'Vietcombank', 'VCB',
 '{"transferType": "internet_banking", "accountNumber": "*****6789", "bank": "Vietcombank"}',
 'Chuyển khoản ngân hàng Vietcombank', '2026-01-07 07:11:00'),

-- Thanh toán cho booking ID 3 (Trần Thị B - credit card)
(3, 400000.00, 'credit_card', 'completed',
 'CREDIT20260107003', 'TXN223344556', 'Mastercard', 'MASTER',
 '{"cardType": "credit", "last4": "5678", "brand": "Mastercard", "bank": "Techcombank"}',
 'Thanh toán thẻ tín dụng Mastercard', '2026-01-07 07:12:00'),

-- Thanh toán cho booking ID 5 (Lê Văn C - MoMo)
(5, 280000.00, 'momo', 'completed',
 'MOMO20260107005', 'MOMO987654', 'MoMo', 'MOMO',
 '{"walletType": "momo", "phoneNumber": "0901234567", "transactionId": "MOMO987654"}',
 'Thanh toán qua ví MoMo', '2026-01-07 07:13:00'),

-- Thanh toán cho booking ID 6 (Lê Văn C - credit card)
(6, 850000.00, 'credit_card', 'completed',
 'CREDIT20260107006', 'TXN334455667', 'Visa', 'VISA',
 '{"cardType": "credit", "last4": "9012", "brand": "Visa", "bank": "ACB"}',
 'Thanh toán thẻ tín dụng Visa ACB', '2026-01-07 07:14:00'),

-- Thanh toán cho booking ID 7 (Nguyễn Văn A - ZaloPay)
(7, 180000.00, 'zalopay', 'completed',
 'ZALO20260107007', 'ZP123456789', 'ZaloPay', 'ZALOPAY',
 '{"walletType": "zalopay", "phoneNumber": "0912345678", "transactionId": "ZP123456789"}',
 'Thanh toán qua ví ZaloPay', '2026-01-07 07:15:00');

-- =====================================================
-- KẾT QUẢ
-- =====================================================
-- ✅ Đã tạo bảng thanh_toan_dua_don
-- ✅ Đã thêm 6 payment records mẫu
-- ✅ Liên kết với bảng dat_dich_vu_dua_don qua datDichVuId
-- =====================================================

SELECT 'Bảng thanh_toan_dua_don đã được tạo thành công!' AS result;
