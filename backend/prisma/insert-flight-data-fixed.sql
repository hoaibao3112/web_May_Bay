-- ====================================
-- HƯỚNG DẪN: Chạy từng bước, đợi thành công mới chạy bước tiếp theo
-- ====================================

-- ====================================
-- BƯỚC 1: XÓA DỮ LIỆU CŨ (NẾU CẦN)
-- ====================================
-- DELETE FROM `ton_cho` WHERE `changBayId` >= 6;
-- DELETE FROM `chang_bay` WHERE `id` >= 6;
-- DELETE FROM `chuyen_bay` WHERE `id` >= 24;

-- ====================================
-- BƯỚC 2: THÊM 30 CHUYẾN BAY MỚI
-- ====================================
INSERT INTO `chuyen_bay` (`hangId`, `soHieuChuyenBay`, `createdAt`, `updatedAt`) VALUES
-- Vietnam Airlines (10 chuyến)
(1, 'VN200', NOW(), NOW()),
(1, 'VN201', NOW(), NOW()),
(1, 'VN202', NOW(), NOW()),
(1, 'VN203', NOW(), NOW()),
(1, 'VN204', NOW(), NOW()),
(1, 'VN205', NOW(), NOW()),
(1, 'VN206', NOW(), NOW()),
(1, 'VN207', NOW(), NOW()),
(1, 'VN208', NOW(), NOW()),
(1, 'VN209', NOW(), NOW()),

-- Vietjet Air (10 chuyến)
(2, 'VJ200', NOW(), NOW()),
(2, 'VJ201', NOW(), NOW()),
(2, 'VJ202', NOW(), NOW()),
(2, 'VJ203', NOW(), NOW()),
(2, 'VJ204', NOW(), NOW()),
(2, 'VJ205', NOW(), NOW()),
(2, 'VJ206', NOW(), NOW()),
(2, 'VJ207', NOW(), NOW()),
(2, 'VJ208', NOW(), NOW()),
(2, 'VJ209', NOW(), NOW()),

-- Bamboo Airways (10 chuyến)
(3, 'QH200', NOW(), NOW()),
(3, 'QH201', NOW(), NOW()),
(3, 'QH202', NOW(), NOW()),
(3, 'QH203', NOW(), NOW()),
(3, 'QH204', NOW(), NOW()),
(3, 'QH205', NOW(), NOW()),
(3, 'QH206', NOW(), NOW()),
(3, 'QH207', NOW(), NOW()),
(3, 'QH208', NOW(), NOW()),
(3, 'QH209', NOW(), NOW());

-- ====================================
-- BƯỚC 3: THÊM 60 CHẶNG BAY (các ID sẽ tự động tạo)
-- ====================================
INSERT INTO `chang_bay` (`chuyenBayId`, `thuTuChang`, `sanBayDiId`, `sanBayDenId`, `gioDi`, `gioDen`, `thoiGianBayPhut`, `createdAt`, `updatedAt`) 
SELECT cb.id, 1, 1, 2, '2026-01-15 05:00:00', '2026-01-15 07:15:00', 135, NOW(), NOW() FROM `chuyen_bay` cb WHERE cb.soHieuChuyenBay = 'VN200'
UNION ALL SELECT cb.id, 1, 1, 2, '2026-01-15 06:30:00', '2026-01-15 08:45:00', 135, NOW(), NOW() FROM `chuyen_bay` cb WHERE cb.soHieuChuyenBay = 'VN201'
UNION ALL SELECT cb.id, 1, 1, 2, '2026-01-15 08:00:00', '2026-01-15 10:15:00', 135, NOW(), NOW() FROM `chuyen_bay` cb WHERE cb.soHieuChuyenBay = 'VN202'
UNION ALL SELECT cb.id, 1, 1, 2, '2026-01-15 09:30:00', '2026-01-15 11:45:00', 135, NOW(), NOW() FROM `chuyen_bay` cb WHERE cb.soHieuChuyenBay = 'VN203'
UNION ALL SELECT cb.id, 1, 1, 2, '2026-01-15 11:00:00', '2026-01-15 13:15:00', 135, NOW(), NOW() FROM `chuyen_bay` cb WHERE cb.soHieuChuyenBay = 'VN204'
UNION ALL SELECT cb.id, 1, 1, 2, '2026-01-15 12:30:00', '2026-01-15 14:45:00', 135, NOW(), NOW() FROM `chuyen_bay` cb WHERE cb.soHieuChuyenBay = 'VN205'
UNION ALL SELECT cb.id, 1, 1, 2, '2026-01-15 14:00:00', '2026-01-15 16:15:00', 135, NOW(), NOW() FROM `chuyen_bay` cb WHERE cb.soHieuChuyenBay = 'VN206'
UNION ALL SELECT cb.id, 1, 1, 2, '2026-01-15 15:30:00', '2026-01-15 17:45:00', 135, NOW(), NOW() FROM `chuyen_bay` cb WHERE cb.soHieuChuyenBay = 'VN207'
UNION ALL SELECT cb.id, 1, 1, 2, '2026-01-15 17:00:00', '2026-01-15 19:15:00', 135, NOW(), NOW() FROM `chuyen_bay` cb WHERE cb.soHieuChuyenBay = 'VN208'
UNION ALL SELECT cb.id, 1, 1, 2, '2026-01-15 18:30:00', '2026-01-15 20:45:00', 135, NOW(), NOW() FROM `chuyen_bay` cb WHERE cb.soHieuChuyenBay = 'VN209'
UNION ALL SELECT cb.id, 1, 1, 2, '2026-01-15 20:00:00', '2026-01-15 22:15:00', 135, NOW(), NOW() FROM `chuyen_bay` cb WHERE cb.soHieuChuyenBay = 'VJ200'
UNION ALL SELECT cb.id, 1, 1, 2, '2026-01-15 21:30:00', '2026-01-15 23:45:00', 135, NOW(), NOW() FROM `chuyen_bay` cb WHERE cb.soHieuChuyenBay = 'VJ201'
UNION ALL SELECT cb.id, 1, 1, 2, '2026-01-16 05:30:00', '2026-01-16 07:45:00', 135, NOW(), NOW() FROM `chuyen_bay` cb WHERE cb.soHieuChuyenBay = 'VJ202'
UNION ALL SELECT cb.id, 1, 1, 2, '2026-01-16 10:00:00', '2026-01-16 12:15:00', 135, NOW(), NOW() FROM `chuyen_bay` cb WHERE cb.soHieuChuyenBay = 'VJ203'
UNION ALL SELECT cb.id, 1, 1, 2, '2026-01-16 16:00:00', '2026-01-16 18:15:00', 135, NOW(), NOW() FROM `chuyen_bay` cb WHERE cb.soHieuChuyenBay = 'VJ204'
-- SGN -> HAN (15 chuyến)
UNION ALL SELECT cb.id, 1, 2, 1, '2026-01-15 05:30:00', '2026-01-15 07:45:00', 135, NOW(), NOW() FROM `chuyen_bay` cb WHERE cb.soHieuChuyenBay = 'VJ205'
UNION ALL SELECT cb.id, 1, 2, 1, '2026-01-15 07:00:00', '2026-01-15 09:15:00', 135, NOW(), NOW() FROM `chuyen_bay` cb WHERE cb.soHieuChuyenBay = 'VJ206'
UNION ALL SELECT cb.id, 1, 2, 1, '2026-01-15 08:30:00', '2026-01-15 10:45:00', 135, NOW(), NOW() FROM `chuyen_bay` cb WHERE cb.soHieuChuyenBay = 'VJ207'
UNION ALL SELECT cb.id, 1, 2, 1, '2026-01-15 10:00:00', '2026-01-15 12:15:00', 135, NOW(), NOW() FROM `chuyen_bay` cb WHERE cb.soHieuChuyenBay = 'VJ208'
UNION ALL SELECT cb.id, 1, 2, 1, '2026-01-15 11:30:00', '2026-01-15 13:45:00', 135, NOW(), NOW() FROM `chuyen_bay` cb WHERE cb.soHieuChuyenBay = 'VJ209'
UNION ALL SELECT cb.id, 1, 2, 1, '2026-01-15 13:00:00', '2026-01-15 15:15:00', 135, NOW(), NOW() FROM `chuyen_bay` cb WHERE cb.soHieuChuyenBay = 'QH200'
UNION ALL SELECT cb.id, 1, 2, 1, '2026-01-15 14:30:00', '2026-01-15 16:45:00', 135, NOW(), NOW() FROM `chuyen_bay` cb WHERE cb.soHieuChuyenBay = 'QH201'
UNION ALL SELECT cb.id, 1, 2, 1, '2026-01-15 16:00:00', '2026-01-15 18:15:00', 135, NOW(), NOW() FROM `chuyen_bay` cb WHERE cb.soHieuChuyenBay = 'QH202'
UNION ALL SELECT cb.id, 1, 2, 1, '2026-01-15 17:30:00', '2026-01-15 19:45:00', 135, NOW(), NOW() FROM `chuyen_bay` cb WHERE cb.soHieuChuyenBay = 'QH203'
UNION ALL SELECT cb.id, 1, 2, 1, '2026-01-15 19:00:00', '2026-01-15 21:15:00', 135, NOW(), NOW() FROM `chuyen_bay` cb WHERE cb.soHieuChuyenBay = 'QH204'
UNION ALL SELECT cb.id, 1, 2, 1, '2026-01-15 20:30:00', '2026-01-15 22:45:00', 135, NOW(), NOW() FROM `chuyen_bay` cb WHERE cb.soHieuChuyenBay = 'QH205'
UNION ALL SELECT cb.id, 1, 2, 1, '2026-01-15 22:00:00', '2026-01-16 00:15:00', 135, NOW(), NOW() FROM `chuyen_bay` cb WHERE cb.soHieuChuyenBay = 'QH206'
UNION ALL SELECT cb.id, 1, 2, 1, '2026-01-16 06:00:00', '2026-01-16 08:15:00', 135, NOW(), NOW() FROM `chuyen_bay` cb WHERE cb.soHieuChuyenBay = 'QH207'
UNION ALL SELECT cb.id, 1, 2, 1, '2026-01-16 12:00:00', '2026-01-16 14:15:00', 135, NOW(), NOW() FROM `chuyen_bay` cb WHERE cb.soHieuChuyenBay = 'QH208'
UNION ALL SELECT cb.id, 1, 2, 1, '2026-01-16 18:00:00', '2026-01-16 20:15:00', 135, NOW(), NOW() FROM `chuyen_bay` cb WHERE cb.soHieuChuyenBay = 'QH209'
-- HAN -> DAD (10 chuyến) - Tái sử dụng chuyến bay VN200-VN209
UNION ALL SELECT cb.id, 2, 1, 3, '2026-01-17 06:00:00', '2026-01-17 07:20:00', 80, NOW(), NOW() FROM `chuyen_bay` cb WHERE cb.soHieuChuyenBay = 'VN200'
UNION ALL SELECT cb.id, 2, 1, 3, '2026-01-17 08:00:00', '2026-01-17 09:20:00', 80, NOW(), NOW() FROM `chuyen_bay` cb WHERE cb.soHieuChuyenBay = 'VN201'
UNION ALL SELECT cb.id, 2, 1, 3, '2026-01-17 10:00:00', '2026-01-17 11:20:00', 80, NOW(), NOW() FROM `chuyen_bay` cb WHERE cb.soHieuChuyenBay = 'VN202'
UNION ALL SELECT cb.id, 2, 1, 3, '2026-01-17 12:00:00', '2026-01-17 13:20:00', 80, NOW(), NOW() FROM `chuyen_bay` cb WHERE cb.soHieuChuyenBay = 'VN203'
UNION ALL SELECT cb.id, 2, 1, 3, '2026-01-17 14:00:00', '2026-01-17 15:20:00', 80, NOW(), NOW() FROM `chuyen_bay` cb WHERE cb.soHieuChuyenBay = 'VN204'
UNION ALL SELECT cb.id, 2, 1, 3, '2026-01-17 16:00:00', '2026-01-17 17:20:00', 80, NOW(), NOW() FROM `chuyen_bay` cb WHERE cb.soHieuChuyenBay = 'VN205'
UNION ALL SELECT cb.id, 2, 1, 3, '2026-01-17 18:00:00', '2026-01-17 19:20:00', 80, NOW(), NOW() FROM `chuyen_bay` cb WHERE cb.soHieuChuyenBay = 'VN206'
UNION ALL SELECT cb.id, 2, 1, 3, '2026-01-17 20:00:00', '2026-01-17 21:20:00', 80, NOW(), NOW() FROM `chuyen_bay` cb WHERE cb.soHieuChuyenBay = 'VN207'
UNION ALL SELECT cb.id, 2, 1, 3, '2026-01-18 07:00:00', '2026-01-18 08:20:00', 80, NOW(), NOW() FROM `chuyen_bay` cb WHERE cb.soHieuChuyenBay = 'VN208'
UNION ALL SELECT cb.id, 2, 1, 3, '2026-01-18 15:00:00', '2026-01-18 16:20:00', 80, NOW(), NOW() FROM `chuyen_bay` cb WHERE cb.soHieuChuyenBay = 'VN209'
-- DAD -> HAN (10 chuyến) - Tái sử dụng VJ200-VJ209
UNION ALL SELECT cb.id, 2, 3, 1, '2026-01-17 07:45:00', '2026-01-17 09:05:00', 80, NOW(), NOW() FROM `chuyen_bay` cb WHERE cb.soHieuChuyenBay = 'VJ200'
UNION ALL SELECT cb.id, 2, 3, 1, '2026-01-17 09:45:00', '2026-01-17 11:05:00', 80, NOW(), NOW() FROM `chuyen_bay` cb WHERE cb.soHieuChuyenBay = 'VJ201'
UNION ALL SELECT cb.id, 2, 3, 1, '2026-01-17 11:45:00', '2026-01-17 13:05:00', 80, NOW(), NOW() FROM `chuyen_bay` cb WHERE cb.soHieuChuyenBay = 'VJ202'
UNION ALL SELECT cb.id, 2, 3, 1, '2026-01-17 13:45:00', '2026-01-17 15:05:00', 80, NOW(), NOW() FROM `chuyen_bay` cb WHERE cb.soHieuChuyenBay = 'VJ203'
UNION ALL SELECT cb.id, 2, 3, 1, '2026-01-17 15:45:00', '2026-01-17 17:05:00', 80, NOW(), NOW() FROM `chuyen_bay` cb WHERE cb.soHieuChuyenBay = 'VJ204'
UNION ALL SELECT cb.id, 2, 3, 1, '2026-01-17 17:45:00', '2026-01-17 19:05:00', 80, NOW(), NOW() FROM `chuyen_bay` cb WHERE cb.soHieuChuyenBay = 'VJ205'
UNION ALL SELECT cb.id, 2, 3, 1, '2026-01-17 19:45:00', '2026-01-17 21:05:00', 80, NOW(), NOW() FROM `chuyen_bay` cb WHERE cb.soHieuChuyenBay = 'VJ206'
UNION ALL SELECT cb.id, 2, 3, 1, '2026-01-17 21:45:00', '2026-01-17 23:05:00', 80, NOW(), NOW() FROM `chuyen_bay` cb WHERE cb.soHieuChuyenBay = 'VJ207'
UNION ALL SELECT cb.id, 2, 3, 1, '2026-01-18 08:45:00', '2026-01-18 10:05:00', 80, NOW(), NOW() FROM `chuyen_bay` cb WHERE cb.soHieuChuyenBay = 'VJ208'
UNION ALL SELECT cb.id, 2, 3, 1, '2026-01-18 16:45:00', '2026-01-18 18:05:00', 80, NOW(), NOW() FROM `chuyen_bay` cb WHERE cb.soHieuChuyenBay = 'VJ209'
-- SGN -> DAD (10 chuyến) - Tái sử dụng QH200-QH209
UNION ALL SELECT cb.id, 2, 2, 3, '2026-01-19 05:45:00', '2026-01-19 07:05:00', 80, NOW(), NOW() FROM `chuyen_bay` cb WHERE cb.soHieuChuyenBay = 'QH200'
UNION ALL SELECT cb.id, 2, 2, 3, '2026-01-19 07:15:00', '2026-01-19 08:35:00', 80, NOW(), NOW() FROM `chuyen_bay` cb WHERE cb.soHieuChuyenBay = 'QH201'
UNION ALL SELECT cb.id, 2, 2, 3, '2026-01-19 09:15:00', '2026-01-19 10:35:00', 80, NOW(), NOW() FROM `chuyen_bay` cb WHERE cb.soHieuChuyenBay = 'QH202'
UNION ALL SELECT cb.id, 2, 2, 3, '2026-01-19 11:15:00', '2026-01-19 12:35:00', 80, NOW(), NOW() FROM `chuyen_bay` cb WHERE cb.soHieuChuyenBay = 'QH203'
UNION ALL SELECT cb.id, 2, 2, 3, '2026-01-19 13:15:00', '2026-01-19 14:35:00', 80, NOW(), NOW() FROM `chuyen_bay` cb WHERE cb.soHieuChuyenBay = 'QH204'
UNION ALL SELECT cb.id, 2, 2, 3, '2026-01-19 15:15:00', '2026-01-19 16:35:00', 80, NOW(), NOW() FROM `chuyen_bay` cb WHERE cb.soHieuChuyenBay = 'QH205'
UNION ALL SELECT cb.id, 2, 2, 3, '2026-01-19 17:15:00', '2026-01-19 18:35:00', 80, NOW(), NOW() FROM `chuyen_bay` cb WHERE cb.soHieuChuyenBay = 'QH206'
UNION ALL SELECT cb.id, 2, 2, 3, '2026-01-19 19:15:00', '2026-01-19 20:35:00', 80, NOW(), NOW() FROM `chuyen_bay` cb WHERE cb.soHieuChuyenBay = 'QH207'
UNION ALL SELECT cb.id, 2, 2, 3, '2026-01-19 21:15:00', '2026-01-19 22:35:00', 80, NOW(), NOW() FROM `chuyen_bay` cb WHERE cb.soHieuChuyenBay = 'QH208'
UNION ALL SELECT cb.id, 2, 2, 3, '2026-01-20 06:00:00', '2026-01-20 07:20:00', 80, NOW(), NOW() FROM `chuyen_bay` cb WHERE cb.soHieuChuyenBay = 'QH209';

-- ====================================
-- BƯỚC 4: THÊM TỒN CHỖ (sử dụng ID thực tế từ chang_bay)
-- ====================================
-- HAN -> SGN (15 chuyến đầu)
INSERT INTO `ton_cho` (`changBayId`, `hangVeId`, `nhomGiaId`, `tongSoCho`, `soChoCon`, `giaCoSo`, `thue`, `phi`, `createdAt`, `updatedAt`)
SELECT cb.id, 1, 1, 180, 170, 1100000.00, 110000.00, 50000.00, NOW(), NOW()
FROM `chang_bay` cb 
INNER JOIN `chuyen_bay` chuyen ON cb.chuyenBayId = chuyen.id
WHERE chuyen.soHieuChuyenBay IN ('VN200', 'VN201', 'VN202', 'VN203', 'VN204', 'VN205', 'VN206', 'VN207', 'VN208', 'VN209', 'VJ200', 'VJ201', 'VJ202', 'VJ203', 'VJ204')
  AND cb.sanBayDiId = 1 AND cb.sanBayDenId = 2 AND cb.thuTuChang = 1;

-- Thêm hạng vé thứ 2
INSERT INTO `ton_cho` (`changBayId`, `hangVeId`, `nhomGiaId`, `tongSoCho`, `soChoCon`, `giaCoSo`, `thue`, `phi`, `createdAt`, `updatedAt`)
SELECT cb.id, 1, 2, 180, 165, 1300000.00, 130000.00, 50000.00, NOW(), NOW()
FROM `chang_bay` cb 
INNER JOIN `chuyen_bay` chuyen ON cb.chuyenBayId = chuyen.id
WHERE chuyen.soHieuChuyenBay IN ('VN200', 'VN201', 'VN202', 'VN203', 'VN204', 'VN205', 'VN206', 'VN207', 'VN208', 'VN209', 'VJ200', 'VJ201', 'VJ202', 'VJ203', 'VJ204')
  AND cb.sanBayDiId = 1 AND cb.sanBayDenId = 2 AND cb.thuTuChang = 1;

-- Thêm hạng vé thứ 3
INSERT INTO `ton_cho` (`changBayId`, `hangVeId`, `nhomGiaId`, `tongSoCho`, `soChoCon`, `giaCoSo`, `thue`, `phi`, `createdAt`, `updatedAt`)
SELECT cb.id, 1, 3, 180, 160, 1500000.00, 150000.00, 50000.00, NOW(), NOW()
FROM `chang_bay` cb 
INNER JOIN `chuyen_bay` chuyen ON cb.chuyenBayId = chuyen.id
WHERE chuyen.soHieuChuyenBay IN ('VN200', 'VN201', 'VN202', 'VN203', 'VN204', 'VN205', 'VN206', 'VN207', 'VN208', 'VN209', 'VJ200', 'VJ201', 'VJ202', 'VJ203', 'VJ204')
  AND cb.sanBayDiId = 1 AND cb.sanBayDenId = 2 AND cb.thuTuChang = 1;

-- SGN -> HAN (15 chuyến)
INSERT INTO `ton_cho` (`changBayId`, `hangVeId`, `nhomGiaId`, `tongSoCho`, `soChoCon`, `giaCoSo`, `thue`, `phi`, `createdAt`, `updatedAt`)
SELECT cb.id, 1, 1, 180, 168, 1150000.00, 115000.00, 50000.00, NOW(), NOW()
FROM `chang_bay` cb 
INNER JOIN `chuyen_bay` chuyen ON cb.chuyenBayId = chuyen.id
WHERE chuyen.soHieuChuyenBay IN ('VJ205', 'VJ206', 'VJ207', 'VJ208', 'VJ209', 'QH200', 'QH201', 'QH202', 'QH203', 'QH204', 'QH205', 'QH206', 'QH207', 'QH208', 'QH209')
  AND cb.sanBayDiId = 2 AND cb.sanBayDenId = 1 AND cb.thuTuChang = 1;

INSERT INTO `ton_cho` (`changBayId`, `hangVeId`, `nhomGiaId`, `tongSoCho`, `soChoCon`, `giaCoSo`, `thue`, `phi`, `createdAt`, `updatedAt`)
SELECT cb.id, 1, 2, 180, 163, 1350000.00, 135000.00, 50000.00, NOW(), NOW()
FROM `chang_bay` cb 
INNER JOIN `chuyen_bay` chuyen ON cb.chuyenBayId = chuyen.id
WHERE chuyen.soHieuChuyenBay IN ('VJ205', 'VJ206', 'VJ207', 'VJ208', 'VJ209', 'QH200', 'QH201', 'QH202', 'QH203', 'QH204', 'QH205', 'QH206', 'QH207', 'QH208', 'QH209')
  AND cb.sanBayDiId = 2 AND cb.sanBayDenId = 1 AND cb.thuTuChang = 1;

-- HAN -> DAD (10 chuyến - chặng 2)
INSERT INTO `ton_cho` (`changBayId`, `hangVeId`, `nhomGiaId`, `tongSoCho`, `soChoCon`, `giaCoSo`, `thue`, `phi`, `createdAt`, `updatedAt`)
SELECT cb.id, 1, 1, 160, 155, 850000.00, 85000.00, 40000.00, NOW(), NOW()
FROM `chang_bay` cb 
INNER JOIN `chuyen_bay` chuyen ON cb.chuyenBayId = chuyen.id
WHERE chuyen.soHieuChuyenBay IN ('VN200', 'VN201', 'VN202', 'VN203', 'VN204', 'VN205', 'VN206', 'VN207', 'VN208', 'VN209')
  AND cb.sanBayDiId = 1 AND cb.sanBayDenId = 3 AND cb.thuTuChang = 2;

INSERT INTO `ton_cho` (`changBayId`, `hangVeId`, `nhomGiaId`, `tongSoCho`, `soChoCon`, `giaCoSo`, `thue`, `phi`, `createdAt`, `updatedAt`)
SELECT cb.id, 1, 2, 160, 150, 1000000.00, 100000.00, 40000.00, NOW(), NOW()
FROM `chang_bay` cb 
INNER JOIN `chuyen_bay` chuyen ON cb.chuyenBayId = chuyen.id
WHERE chuyen.soHieuChuyenBay IN ('VN200', 'VN201', 'VN202', 'VN203', 'VN204', 'VN205', 'VN206', 'VN207', 'VN208', 'VN209')
  AND cb.sanBayDiId = 1 AND cb.sanBayDenId = 3 AND cb.thuTuChang = 2;

-- DAD -> HAN (10 chuyến - chặng 2)
INSERT INTO `ton_cho` (`changBayId`, `hangVeId`, `nhomGiaId`, `tongSoCho`, `soChoCon`, `giaCoSo`, `thue`, `phi`, `createdAt`, `updatedAt`)
SELECT cb.id, 1, 1, 160, 152, 850000.00, 85000.00, 40000.00, NOW(), NOW()
FROM `chang_bay` cb 
INNER JOIN `chuyen_bay` chuyen ON cb.chuyenBayId = chuyen.id
WHERE chuyen.soHieuChuyenBay IN ('VJ200', 'VJ201', 'VJ202', 'VJ203', 'VJ204', 'VJ205', 'VJ206', 'VJ207', 'VJ208', 'VJ209')
  AND cb.sanBayDiId = 3 AND cb.sanBayDenId = 1 AND cb.thuTuChang = 2;

INSERT INTO `ton_cho` (`changBayId`, `hangVeId`, `nhomGiaId`, `tongSoCho`, `soChoCon`, `giaCoSo`, `thue`, `phi`, `createdAt`, `updatedAt`)
SELECT cb.id, 1, 2, 160, 147, 1000000.00, 100000.00, 40000.00, NOW(), NOW()
FROM `chang_bay` cb 
INNER JOIN `chuyen_bay` chuyen ON cb.chuyenBayId = chuyen.id
WHERE chuyen.soHieuChuyenBay IN ('VJ200', 'VJ201', 'VJ202', 'VJ203', 'VJ204', 'VJ205', 'VJ206', 'VJ207', 'VJ208', 'VJ209')
  AND cb.sanBayDiId = 3 AND cb.sanBayDenId = 1 AND cb.thuTuChang = 2;

-- SGN -> DAD (10 chuyến - chặng 2)
INSERT INTO `ton_cho` (`changBayId`, `hangVeId`, `nhomGiaId`, `tongSoCho`, `soChoCon`, `giaCoSo`, `thue`, `phi`, `createdAt`, `updatedAt`)
SELECT cb.id, 1, 1, 160, 154, 800000.00, 80000.00, 40000.00, NOW(), NOW()
FROM `chang_bay` cb 
INNER JOIN `chuyen_bay` chuyen ON cb.chuyenBayId = chuyen.id
WHERE chuyen.soHieuChuyenBay IN ('QH200', 'QH201', 'QH202', 'QH203', 'QH204', 'QH205', 'QH206', 'QH207', 'QH208', 'QH209')
  AND cb.sanBayDiId = 2 AND cb.sanBayDenId = 3 AND cb.thuTuChang = 2;

INSERT INTO `ton_cho` (`changBayId`, `hangVeId`, `nhomGiaId`, `tongSoCho`, `soChoCon`, `giaCoSo`, `thue`, `phi`, `createdAt`, `updatedAt`)
SELECT cb.id, 1, 2, 160, 149, 950000.00, 95000.00, 40000.00, NOW(), NOW()
FROM `chang_bay` cb 
INNER JOIN `chuyen_bay` chuyen ON cb.chuyenBayId = chuyen.id
WHERE chuyen.soHieuChuyenBay IN ('QH200', 'QH201', 'QH202', 'QH203', 'QH204', 'QH205', 'QH206', 'QH207', 'QH208', 'QH209')
  AND cb.sanBayDiId = 2 AND cb.sanBayDenId = 3 AND cb.thuTuChang = 2;

-- ====================================
-- HOÀN THÀNH! Kiểm tra kết quả
-- ====================================
-- SELECT COUNT(*) as total_flights FROM chuyen_bay;
-- SELECT COUNT(*) as total_routes FROM chang_bay;
-- SELECT COUNT(*) as total_inventory FROM ton_cho;
