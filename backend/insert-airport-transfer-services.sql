-- Sample data for Airport Transfer Services
-- Run this script to add sample airport transfer services to your database

-- First, let's add some airport transfer providers
INSERT INTO nha_cung_cap_dua_don (tenNhaCungCap, logo, soDienThoai, email, diaChi, moTa, danhGiaTrungBinh, tongSoDanhGia, trangThai)
VALUES
('VIP Transfer', 'https://placehold.co/200x200/0066FF/FFFFFF/png?text=VIP', '0901234567', 'contact@viptransfer.vn', '123 Đường ABC, Quận 1, TP.HCM', 'Dịch vụ đưa đón sân bay hạng sang', 4.8, 1250, 'active'),
('Green Taxi', 'https://placehold.co/200x200/00AA00/FFFFFF/png?text=GREEN', '0912345678', 'info@greentaxi.vn', '456 Đường XYZ, Quận 3, TP.HCM', 'Dịch vụ taxi sân bay thân thiện môi trường', 4.6, 890, 'active'),
('Premium Car', 'https://placehold.co/200x200/FF6600/FFFFFF/png?text=PREMIUM', '0923456789', 'booking@premiumcar.vn', '789 Đường DEF, Ba Đình, Hà Nội', 'Dịch vụ xe hạng sang cao cấp', 4.9, 1580, 'active'),
('Airport Express', 'https://placehold.co/200x200/9933FF/FFFFFF/png?text=EXPRESS', '0934567890', 'support@airportexpress.vn', '321 Đường GHI, Cầu Giấy, Hà Nội', 'Dịch vụ đưa đón nhanh chóng, tiện lợi', 4.5, 675, 'active'),
('Comfort Ride', 'https://placehold.co/200x200/FF0099/FFFFFF/png?text=COMFORT', '0945678901', 'hello@comfortride.vn', '654 Đường JKL, Hải Châu, Đà Nẵng', 'Dịch vụ xe thoải mái, giá cả hợp lý', 4.7, 920, 'active');

-- Thêm các dịch vụ đưa đón sân bay
-- Sử dụng các nhà cung cấp đã có trong database
-- ID sân bay: Tân Sơn Nhất (SGN) = 1, Nội Bài (HAN) = 2, Đà Nẵng (DAD) = 3

INSERT INTO dich_vu_dua_don (nhaCungCapId, sanBayId, loaiXe, soChoNgoi, giaTienMotChieu, giaTienKhuHoi, moTa, tienIch, hinhAnh, trangThai)
VALUES
-- Sân bay Tân Sơn Nhất (SGN) - ID = 1
-- Airport Shuttle Express (nhaCungCapId=1)
(1, 1, 'Sedan 4 chỗ', 4, 250000, 450000, 'Xe sedan cao cấp, lái xe chuyên nghiệp, phục vụ 24/7', '["Điều hòa", "WiFi miễn phí", "Nước uống", "Báo chí"]', '["https://images.unsplash.com/photo-1549317661-bd32c8ce0db2?w=600"]', 'active'),
(1, 1, 'SUV 7 chỗ', 7, 400000, 750000, 'Xe SUV rộng rãi, thích hợp gia đình, hành lý nhiều', '["Điều hòa", "WiFi miễn phí", "Nước uống", "Ghế trẻ em"]', '["https://images.unsplash.com/photo-1519641471654-76ce0107ad1b?w=600"]', 'active'),

-- VIP Transfer Service (nhaCungCapId=2)
(2, 1, 'Limousine 9 chỗ', 9, 600000, 1100000, 'Limousine hạng sang, ghế massage, phục vụ VIP', '["Điều hòa", "WiFi miễn phí", "Nước uống", "Ghế massage", "Màn hình giải trí"]', '["https://images.unsplash.com/photo-1555652772-406487ba79c3?w=600"]', 'active'),
(2, 1, 'Mercedes S-Class', 4, 800000, 1500000, 'Mercedes-Benz S-Class cao cấp nhất, dành cho doanh nhân', '["Điều hòa", "WiFi miễn phí", "Nước uống cao cấp", "Báo chí quốc tế", "Ghế massage"]', '["https://images.unsplash.com/photo-1618843479313-40f8afb4b4d8?w=600"]', 'active'),

-- Budget Airport Ride (nhaCungCapId=3)
(3, 1, 'Sedan 4 chỗ', 4, 200000, 380000, 'Taxi sân bay tiêu chuẩn, giá cả hợp lý', '["Điều hòa", "Nước uống"]', '["https://images.unsplash.com/photo-1552519507-cf6f80785d50?w=600"]', 'active'),
(3, 1, 'MPV 7 chỗ', 7, 350000, 650000, 'Xe MPV thoải mái cho nhóm và gia đình', '["Điều hòa", "WiFi miễn phí", "Nước uống"]', '["https://images.unsplash.com/photo-1563720360172-67b8f3dce741?w=600"]', 'active'),

-- Sân bay Nội Bài (HAN) - ID = 2
-- Luxury Limousine (nhaCungCapId=4)
(4, 2, 'Limousine 9 chỗ', 9, 550000, 1050000, 'Limousine sang trọng tại Nội Bài', '["Điều hòa", "WiFi miễn phí", "Nước uống", "Ghế massage"]', '["https://images.unsplash.com/photo-1544620347-c4fd4a3d5957?w=600"]', 'active'),

-- Family Van Service (nhaCungCapId=5)
(5, 2, 'Van 16 chỗ', 16, 800000, 1500000, 'Van lớn cho nhóm đông người', '["Điều hòa", "WiFi miễn phí", "Nước uống"]', '["https://images.unsplash.com/photo-1527786356703-4b100091cd2c?w=600"]', 'active'),
(5, 2, 'SUV 7 chỗ', 7, 500000, 950000, 'SUV rộng rãi, phù hợp gia đình đông người', '["Điều hòa", "WiFi miễn phí", "Nước uống", "Ghế trẻ em"]', '["https://images.unsplash.com/photo-1609521263047-f8f205293f24?w=600"]', 'active'),

-- Green Eco Transfer (nhaCungCapId=6)
(6, 2, 'Sedan 4 chỗ', 4, 250000, 480000, 'Dịch vụ xe xanh, thân thiện môi trường', '["Điều hòa", "WiFi miễn phí"]', '["https://images.unsplash.com/photo-1580414155485-1859d356ffda?w=600"]', 'active'),

-- Sân bay Đà Nẵng (DAD) - ID = 3
-- Airport Transfer (nhaCungCapId=7)
(7, 3, 'Sedan 4 chỗ', 4, 180000, 340000, 'Dịch vụ đưa đón tại Đà Nẵng, giá tốt', '["Điều hòa", "Nước uống"]', '["https://images.unsplash.com/photo-1590362891991-f776e747a588?w=600"]', 'active'),
(7, 3, 'SUV 7 chỗ', 7, 320000, 600000, 'SUV thoải mái cho chuyến du lịch Đà Nẵng', '["Điều hòa", "WiFi miễn phí", "Nước uống"]', '["https://images.unsplash.com/photo-1606664515524-ed2f786a0bd6?w=600"]', 'active');
