-- Migration: Add missing fields to hotel schema
-- Date: 2026-01-05

USE dat_ve_may_bay;

-- Add new columns to khach_san table
ALTER TABLE khach_san 
ADD COLUMN IF NOT EXISTS soDanhGia INT DEFAULT 0 COMMENT 'Số lượng đánh giá',
ADD COLUMN IF NOT EXISTS gioCheckin VARCHAR(10) DEFAULT '14:00' COMMENT 'Giờ nhận phòng',
ADD COLUMN IF NOT EXISTS gioCheckout VARCHAR(10) DEFAULT '12:00' COMMENT 'Giờ trả phòng',
ADD COLUMN IF NOT EXISTS chinhSachHuy TEXT COMMENT 'Chính sách hủy phòng',
ADD COLUMN IF NOT EXISTS khoangCachSanBay DECIMAL(5,2) COMMENT 'Khoảng cách đến sân bay (km)',
ADD COLUMN IF NOT EXISTS khoangCachTT DECIMAL(5,2) COMMENT 'Khoảng cách đến trung tâm (km)',
ADD COLUMN IF NOT EXISTS diaDiemGanDay TEXT COMMENT 'JSON: Các địa điểm gần đây';

-- Create table for hotel image gallery
CREATE TABLE IF NOT EXISTS hinh_anh_khach_san (
  id INT NOT NULL AUTO_INCREMENT,
  khachSanId INT NOT NULL,
  urlHinhAnh VARCHAR(500) NOT NULL,
  moTa VARCHAR(255) DEFAULT NULL COMMENT 'Caption cho ảnh',
  thuTu INT DEFAULT 0 COMMENT 'Thứ tự hiển thị',
  createdAt DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
  PRIMARY KEY (id),
  KEY idx_khachSanId (khachSanId),
  CONSTRAINT fk_hinh_anh_khach_san FOREIGN KEY (khachSanId) 
    REFERENCES khach_san(id) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Update existing hotels with sample data
UPDATE khach_san SET 
  soDanhGia = FLOOR(RAND() * 900) + 100,  -- Random 100-1000 reviews
  gioCheckin = '14:00',
  gioCheckout = '12:00',
  chinhSachHuy = 'Miễn phí hủy trước 24 giờ. Sau đó phí hủy 50% tổng giá trị đặt phòng.',
  khoangCachSanBay = ROUND(RAND() * 10 + 2, 1),  -- 2-12 km
  khoangCachTT = ROUND(RAND() * 5 + 0.5, 1),     -- 0.5-5.5 km
  diaDiemGanDay = JSON_ARRAY(
    JSON_OBJECT('ten', 'Sân bay quốc tế', 'khoangCach', ROUND(RAND() * 10 + 2, 1)),
    JSON_OBJECT('ten', 'Trung tâm thành phố', 'khoangCach', ROUND(RAND() * 5 + 0.5, 1)),
    JSON_OBJECT('ten', 'Cầu Rồng', 'khoangCach', ROUND(RAND() * 3 + 1, 1)),
    JSON_OBJECT('ten', 'Bảo tàng Hồ Chí Minh', 'khoangCach', ROUND(RAND() * 4 + 1, 1))
  )
WHERE id > 0;

-- Insert sample gallery images for existing hotels
INSERT INTO hinh_anh_khach_san (khachSanId, urlHinhAnh, moTa, thuTu) 
SELECT 
  id,
  CONCAT('https://images.unsplash.com/photo-', 
    CASE FLOOR(RAND() * 5)
      WHEN 0 THEN '1566073771259-6a8506099945?w=800' -- Hotel exterior
      WHEN 1 THEN '1582719478250-c89cae4dc85b?w=800' -- Hotel room
      WHEN 2 THEN '1590381105924-c72589b9ef3f?w=800' -- Hotel lobby
      WHEN 3 THEN '1584132967334-10e028bd0c56?w=800' -- Hotel restaurant
      ELSE '1542314831-068cd1dbfeeb?w=800' -- Hotel pool
    END
  ),
  CASE FLOOR(RAND() * 5)
    WHEN 0 THEN 'Mặt tiền khách sạn'
    WHEN 1 THEN 'Phòng nghỉ cao cấp'
    WHEN 2 THEN 'Sảnh đón tiếp'
    WHEN 3 THEN 'Nhà hàng sang trọng'
    ELSE 'Hồ bơi và khu vui chơi'
  END,
  0
FROM khach_san
WHERE id <= 20;

-- Add 3 more images for each hotel
INSERT INTO hinh_anh_khach_san (khachSanId, urlHinhAnh, moTa, thuTu)
SELECT 
  ks.id,
  'https://images.unsplash.com/photo-1590381105924-c72589b9ef3f?w=800',
  'Sảnh khách sạn',
  1
FROM khach_san ks
WHERE ks.id <= 20;

INSERT INTO hinh_anh_khach_san (khachSanId, urlHinhAnh, moTa, thuTu)
SELECT 
  ks.id,
  'https://images.unsplash.com/photo-1584132967334-10e028bd0c56?w=800',
  'Khu vực ăn uống',
  2
FROM khach_san ks
WHERE ks.id <= 20;

INSERT INTO hinh_anh_khach_san (khachSanId, urlHinhAnh, moTa, thuTu)
SELECT 
  ks.id,
  'https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?w=800',
  'View từ phòng',
  3
FROM khach_san ks
WHERE ks.id <= 20;

-- Show results
SELECT 
  ks.tenKhachSan,
  ks.soDanhGia,
  ks.gioCheckin,
  ks.gioCheckout,
  ks.khoangCachSanBay,
  ks.khoangCachTT,
  COUNT(ha.id) as soLuongAnh
FROM khach_san ks
LEFT JOIN hinh_anh_khach_san ha ON ks.id = ha.khachSanId
WHERE ks.id <= 5
GROUP BY ks.id;

-- Commit changes
COMMIT;
