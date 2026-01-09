-- =============================================
-- ACTIVITIES/TOURS MODULE - SAMPLE DATA
-- Chạy file này SAU KHI đã chạy activities-schema.sql
-- =============================================

-- 1. Insert Categories
INSERT INTO danh_muc_hoat_dong (tenDanhMuc, moTa, icon, thuTu) VALUES
('Điểm tham quan', 'Tham quan các địa danh nổi tiếng', '🏛️', 1),
('Tour', 'Các tour du lịch trọn gói', '🗺️', 2),
('Spa & Thư giãn', 'Dịch vụ spa, massage, chăm sóc sức khỏe', '💆', 3),
('Thể thao & Giải trí', 'Hoạt động thể thao, phiêu lưu', '🎯', 4),
('Ẩm thực', 'Trải nghiệm ẩm thực, cooking class', '🍜', 5),
('Văn hóa', 'Trải nghiệm văn hóa địa phương', '🎭', 6),
('Phương tiện di chuyển', 'Vé tàu, cáp treo, xe bus', '🚡', 7),
('Công viên & Vườn thú', 'Vé vào cổng các công viên giải trí', '🎢', 8);

-- 2. Insert Providers
INSERT INTO nha_cung_cap_hoat_dong (maNhaCungCap, tenNhaCungCap, logo, soDienThoai, email, danhGiaTrungBinh, soLuotDanhGia) VALUES
('PROVIDER001', 'Saigon Tourist', 'https://via.placeholder.com/150?text=Saigon+Tourist', '0283822 8914', 'contact@saigon-tourist.com', 4.5, 1250),
('PROVIDER002', 'Vietravel', 'https://via.placeholder.com/150?text=Vietravel', '1900 1839', 'info@vietravel.com', 4.6, 2100),
('PROVIDER003', 'Ben Thanh Tourist', 'https://via.placeholder.com/150?text=Ben+Thanh', '0283 9207 878', 'info@benhthanhhtourist.com', 4.4, 980),
('PROVIDER004', 'Golden Tour', 'https://via.placeholder.com/150?text=Golden+Tour', '024 3926 0606', 'service@goldentour.vn', 4.7, 1560),
('PROVIDER005', 'Vietnam Awesome Travel', 'https://via.placeholder.com/150?text=VA+Travel', '0903 411 802', 'info@vietnamawesome.com', 4.8, 890),
('PROVIDER006', 'Local Tours VN', 'https://via.placeholder.com/150?text=Local+Tours', '0909 123 456', 'hello@localtours.vn', 4.3, 670),
('PROVIDER007', 'Adventure Vietnam', 'https://via.placeholder.com/150?text=Adventure+VN', '0934 567 890', 'info@adventurevn.com', 4.9, 1120),
('PROVIDER008', 'City Sightseeing', 'https://via.placeholder.com/150?text=City+Sight', '028 3835 9393', 'booking@citysightseeing.vn', 4.2, 2340);

-- 3. Insert Activities - HỒ CHÍ MINH
INSERT INTO hoat_dong (maHoatDong, tenHoatDong, moTaNgan, moTaChiTiet, danhMucId, nhaCungCapId, diaDiem, thanhPho, thoiGianDienRa, giaTuMoiNguoi, baoGomAnUong, baoGomDuaDon, huongDanVien, danhGiaTrungBinh, soLuotDanhGia, soLuotDat) VALUES
-- Điểm tham quan
('ACT-SGN-001', 'Vé Bảo tàng Chứng tích Chiến tranh', 'Tìm hiểu lịch sử chiến tranh Việt Nam qua các hiện vật quý giá', 'Bảo tàng trưng bày hơn 20.000 tài liệu, hiện vật liên quan đến hai cuộc kháng chiến chống Pháp và Mỹ của nhân dân Việt Nam. Khách tham quan sẽ được chiêm ngưỡng các máy bay, xe tăng, pháo...', 1, 1, 'Quận 3, TP.HCM', 'Hồ Chí Minh', '2-3 giờ', 40000, FALSE, FALSE, FALSE, 4.6, 3420, 15680),
('ACT-SGN-002', 'Vé Dinh Độc Lập', 'Khám phá công trình kiến trúc lịch sử nổi tiếng', 'Dinh Độc Lập là nơi diễn ra nhiều sự kiện lịch sử quan trọng của đất nước. Du khách sẽ được tham quan các phòng làm việc, phòng hội nghị, hầm trú ẩn...', 1, 1, 'Quận 1, TP.HCM', 'Hồ Chí Minh', '1-2 giờ', 65000, FALSE, FALSE, FALSE, 4.7, 5240, 22100),
('ACT-SGN-003', 'Vé Nhà hát Giao hưởng', 'Thưởng thức các buổi biểu diễn nghệ thuật đẳng cấp', 'Nhà hát Giao hưởng TP.HCM là công trình kiến trúc Pháp cổ điển tuyệt đẹp. Tham gia các chương trình ca nhạc, ballet, opera đẳng cấp quốc tế', 1, 8, 'Quận 1, TP.HCM', 'Hồ Chí Minh', '2-3 giờ', 150000, FALSE, FALSE, FALSE, 4.8, 1890, 8760),

-- Tours
('ACT-SGN-004', 'Tour City Sightseeing cả ngày', 'Khám phá Sài Gòn với xe bus 2 tầng', 'Tour tham quan các địa danh nổi tiếng: Dinh Độc Lập, Nhà thờ Đức Bà, Bưu điện Trung tâm, Chợ Bến Thành, Bảo tàng Chứng tích Chiến tranh...', 2, 8, 'Khởi hành từ Quận 1', 'Hồ Chí Minh', 'Cả ngày (8 giờ)', 450000, TRUE, TRUE, TRUE, 4.5, 2140, 9870),
('ACT-SGN-005', 'Tour Củ Chi - Tây Ninh 1 ngày', 'Khám phá địa đạo Củ Chi và Tòa Thánh Cao Đài', 'Tham quan địa đạo Củ Chi - công trình quân sự nổi tiếng thời chiến. Dự lễ cầu nguyện tại Tòa Thánh Cao Đài. Thưởng thức món ăn địa phương', 2, 2, 'Củ Chi - Tây Ninh', 'Hồ Chí Minh', 'Cả ngày', 650000, TRUE, TRUE, TRUE, 4.7, 4560, 18920),
('ACT-SGN-006', 'Tour Miền Tây 1 ngày - Chợ nổi Cái Răng', 'Trải nghiệm văn hóa sông nước miền Tây', 'Tham quan chợ nổi Cái Răng, vườn cây trái, làng nghề kẹo dừa. Thưởng thức đặc sản miền Tây: cá lóc nướng trui, lẩu cá linh bông điên điển...', 2, 3, 'Cần Thơ - Vĩnh Long', 'Hồ Chí Minh', 'Cả ngày', 580000, TRUE, TRUE, TRUE, 4.6, 3210, 14560),

-- Spa & Relax
('ACT-SGN-007', 'Gói Massage Toàn Thân 90 phút - Miu Miu Spa', 'Thư giãn tuyệt đối với massage body Thái Lan', 'Massage toàn thân với tinh dầu thiên nhiên, giúp lưu thông khí huyết, giảm căng thẳng. Bao gồm: foot massage, body massage, head massage', 3, 6, 'Quận 1, TP.HCM', 'Hồ Chí Minh', '90 phút', 350000, FALSE, FALSE, TRUE, 4.9, 5670, 21340),
('ACT-SGN-008', 'Gói Chăm sóc Da Mặt Luxury - Princess Spa', 'Làm đẹp da với công nghệ hiện đại', 'Chăm sóc da chuyên sâu với mỹ phẩm cao cấp, máy móc hiện đại. Bao gồm: tẩy tế bào chết, đắp mặt nạ, massage mặt, dưỡng ẩm', 3, 6, 'Quận 3, TP.HCM', 'Hồ Chí Minh', '60 phút', 280000, FALSE, FALSE, TRUE, 4.8, 2890, 11230),

-- Thể thao & Giải trí  
('ACT-SGN-009', 'Vé Đầm Sen Water Park', 'Công viên nước lớn nhất Sài Gòn', 'Hơn 50 trò chơi cảm giác mạnh cho mọi lứa tuổi. Bể sóng nhân tạo, đường trượt thác nước, sông lười...', 4, 1, 'Quận 11, TP.HCM', 'Hồ Chí Minh', 'Cả ngày', 180000, FALSE, FALSE, FALSE, 4.4, 8760, 43210),
('ACT-SGN-010', 'Vé Landmark 81 SkyView', 'Ngắm Sài Gòn từ độ cao 461m', 'Đài quan sát cao nhất Đông Nam Á, tầm nhìn 360 độ toàn cảnh thành phố. Trải nghiệm Skydeck, cafe trên cao', 4, 1, 'Bình Thạnh, TP.HCM', 'Hồ Chí Minh', '1-2 giờ', 270000, FALSE, FALSE, FALSE, 4.7, 6540, 28900),

-- 4. Insert Activities - HÀ NỘI  
('ACT-HAN-001', 'Vé Thăng Long Water Puppet Show', 'Xem múa rối nước truyền thống Việt Nam', 'Nghệ thuật múa rối nước độc đáo với hơn 1000 năm lịch sử. Các tiết mục: múa rồng, lội nước mò cua, đánh cá, trâu chọi...', 6, 4, 'Hoàn Kiếm, Hà Nội', 'Hà Nội', '50 phút', 100000, FALSE, FALSE, FALSE, 4.8, 7890, 35670),
('ACT-HAN-002', 'Tour City Sightseeing Hà Nội', 'Khám phá thủ đô 1000 năm văn hiến', 'Tham quan: Lăng Bác, Văn Miếu Quốc Tử Giám, Hồ Hoàn Kiếm, Chùa Một Cột, Phố cổ Hà Nội...', 2, 4, 'Khởi hành từ Hoàn Kiếm', 'Hà Nội', 'Cả ngày', 480000, TRUE, TRUE, TRUE, 4.6, 3450, 16780),
('ACT-HAN-003', 'Tour Vịnh Hạ Long 1 ngày', 'Du thuyền khám phá kỳ quan thiên nhiên thế giới', 'Tham quan Vịnh Hạ Long: Hang Sửng Sốt, Đảo Titop, Làng chài, Chèo kayak. Buffet hải sản trên du thuyền', 2, 2, 'Vịnh Hạ Long', 'Hà Nội', 'Cả ngày', 950000, TRUE, TRUE, TRUE, 4.9, 8920, 42100),
('ACT-HAN-004', 'Tour Sapa 2 ngày 1 đêm', 'Khám phá Sapa - Thị trấn sương mù', 'Trekking thác Bạc, thung lũng Mường Hoa, bản Cát Cát. Ngắm ruộng bậc thang, trải nghiệm văn hóa dân tộc', 2, 5, 'Lào Cai - Sapa', 'Hà Nội', '2 ngày 1 đêm', 1850000, TRUE, TRUE, TRUE, 4.8, 5670, 22340),
('ACT-HAN-005', 'Cooking Class Vietnamese Cuisine', 'Học nấu món ăn Việt Nam cùng đầu bếp', 'Đi chợ, học nấu các món: phở, bún chả, nem rán, bánh xèo. Thưởng thức thành quả của mình', 5, 6, 'Ba Đình, Hà Nội', 'Hà Nội', '3 giờ', 550000, TRUE, TRUE, TRUE, 4.9, 2340, 9870),

-- 5. Insert Activities - ĐÀ NẴNG
('ACT-DAN-001', 'Vé Bà Nà Hills - Golden Bridge', 'Khám phá Bà Nà Hills và Cầu Vàng nổi tiếng', 'Vé cáp treo lên Bà Nà Hills, tham quan Cầu Vàng, vườn hoa Le Jardin, làng Pháp, Fantasy Park...', 1, 1, 'Hòa Vang, Đà Nẵng', 'Đà Nẵng', 'Cả ngày', 750000, FALSE, FALSE, FALSE, 4.8, 12340, 56780),
('ACT-DAN-002', 'Tour Hội An - Phố Cổ', 'Khám phá phố cổ Hội An - Di sản văn hóa thế giới', 'Tham quan: Chùa Cầu, Nhà cổ Tấn Ký, Phố cổ, làm lồng đèn. Thả đèn hoa đăng trên sông Thu Bồn', 2, 3, 'Hội An, Quảng Nam', 'Đà Nẵng', '4 giờ', 350000, FALSE, TRUE, TRUE, 4.7, 6890, 28970),
('ACT-DAN-003', 'Tour Bán đảo Sơn Trà - Bãi biển Mỹ Khê', 'Khám phá thiên nhiên và biển đẹp', 'Tham quan: Chùa Linh Ứng, Bán đảo Sơn Trà, Bãi biển Mỹ Khê. Tắm biển, chụp ảnh', 2, 4, 'Sơn Trà, Đà Nẵng', 'Đà Nẵng', '5 giờ', 380000, TRUE, TRUE, TRUE, 4.6, 4320, 18760),
('ACT-DAN-004', 'Lặn biển Cù Lao Chàm', 'Khám phá rạn san hô đẹp nhất Việt Nam', 'Lặn ngắm san hô, cá biển nhiệt đới. Tham quan làng chài, chùa Hải Tạng. Thưởng thức hải sản', 4, 7, 'Cù Lao Chàm', 'Đà Nẵng', 'Cả ngày', 650000, TRUE, TRUE, TRUE, 4.9, 3210, 12890),

-- 6. Insert Activities - NHA TRANG
('ACT-NHA-001', 'Tour 4 Đảo Nha Trang', 'Khám phá vịnh Nha Trang tuyệt đẹp', 'Tham quan: Hòn Mun, Hòn Tằm, Hòn Một, Bãi Tranh. Lặn ngắm san hô, tắm bùn khoáng, câu cá', 2, 3, 'Vịnh Nha Trang', 'Nha Trang', 'Cả ngày', 450000, TRUE, TRUE, TRUE, 4.7, 7650, 34210),
('ACT-NHA-002', 'Vé Vinpearl Land Nha Trang', 'Công viên giải trí hàng đầu Việt Nam', 'Vé cáp treo + vui chơi: Công viên nước, thủy cung, khu vui chơi trẻ em, biển nước ngọt...', 4, 1, 'Hòn Tre, Nha Trang', 'Nha Trang', 'Cả ngày', 880000, FALSE, FALSE, FALSE, 4.8, 11230, 48900),
('ACT-NHA-003', 'Spa & Tắm Bùn Khoáng I-Resort', 'Thư giãn với liệu pháp tắm bùn khoáng nóng', 'Tắm bùn khoáng nóng, xông hơi, massage, bể bơi khoáng nóng. Gói Premium', 3, 6, 'Vĩnh Nguyên, Nha Trang', 'Nha Trang', '3 giờ', 320000, FALSE, TRUE, FALSE, 4.9, 5430, 24560),

-- 7. Insert Activities - PHÚ QUỐC
('ACT-PQ-001', 'Tour Safari Phú Quốc', 'Khám phá vườn thú bán hoang dã lớn nhất Việt Nam', 'Tham quan: Safari, công viên nước Aquatopia, show biểu diễn hải cẩu, chim...', 8, 1, 'Gành Dầu, Phú Quốc', 'Phú Quốc', 'Cả ngày', 650000, FALSE, TRUE, FALSE, 4.8, 6780, 29870),
('ACT-PQ-002', 'Tour 3 Đảo Phú Quốc - Câu Cá', 'Trải nghiệm đánh cá và lặn biển', 'Câu cá, lặn ngắm san hô tại Hòn Móng Tay, Hòn Gầm Ghì, Hòn Mây Rút. BBQ hải sản trên đảo', 4, 7, 'Nam Phú Quốc', 'Phú Quốc', 'Cả ngày', 550000, TRUE, TRUE, TRUE, 4.7, 4320, 17650),
('ACT-PQ-003', 'Vé VinWonders Phú Quốc', 'Công viên chủ đề lớn nhất Việt Nam', 'Vui chơi: Thế giới Hoang dã, Làng Venice, Lâu đài Bắc Âu, show nhạc nước...', 8, 1, 'Bãi Dài, Phú Quốc', 'Phú Quốc', 'Cả ngày', 750000, FALSE, TRUE, FALSE, 4.9, 8900, 41230),

-- 8. Insert Activities - ĐÀ LẠT
('ACT-DL-001', 'Tour Đà Lạt Romantic', 'Khám phá thành phố ngàn hoa', 'Tham quan: Hồ Xuân Hương, ga Đà Lạt, Quảng trường Lâm Viên, chợ Đà Lạt. Cafe view đẹp', 2, 4, 'Trung tâm Đà Lạt', 'Đà Lạt', '4 giờ', 280000, FALSE, TRUE, TRUE, 4.6, 5670, 23450),
('ACT-DL-002', 'Canyoning - Thác Datanla', 'Mạo hiểm chinh phục thác nước', 'Trượt thác, leo núi, nhảy xuống thác. Hoạt động dành cho người yêu phiêu lưu', 4, 7, 'Datanla, Đà Lạt', 'Đà Lạt', '2 giờ', 350000, FALSE, FALSE, TRUE, 4.8, 3210, 14230),
('ACT-DL-003', 'Café Sáng + Xích Đu Đà Lạt', 'Trải nghiệm điểm ăn sáng view đẹp', 'Buffet sáng với các món Âu Á. Chụp ảnh tại các xích đu view đẹp, cánh đồng hoa', 5, 6, 'Khu vườn hoa Đà Lạt', 'Đà Lạt', '2 giờ', 180000, TRUE, FALSE, FALSE, 4.7, 4560, 19870);

-- Continue với thêm nhiều activities khác...

-- 9. Insert Images for Activities (Using stable placeholder images)
INSERT INTO hinh_anh_hoat_dong (hoatDongId, urlHinhAnh, laTrangBia, thuTu) VALUES
-- HCM Activities - War Museum
(1, 'https://via.placeholder.com/800x600/4A90E2/FFFFFF?text=War+Museum+HCM', TRUE, 1),
(1, 'https://via.placeholder.com/800x600/50C878/FFFFFF?text=Historical+Exhibits', FALSE, 2),
(1, 'https://via.placeholder.com/800x600/FF6B6B/FFFFFF?text=Military+Vehicles', FALSE, 3),

-- Independence Palace
(2, 'https://via.placeholder.com/800x600/FFD700/FFFFFF?text=Independence+Palace', TRUE, 1),
(2, 'https://via.placeholder.com/800x600/FF69B4/FFFFFF?text=Palace+Interior', FALSE, 2),
(2, 'https://via.placeholder.com/800x600/9370DB/FFFFFF?text=Meeting+Rooms', FALSE, 3),

-- Opera House
(3, 'https://via.placeholder.com/800x600/FF1493/FFFFFF?text=Opera+House', TRUE, 1),
(3, 'https://via.placeholder.com/800x600/00CED1/FFFFFF?text=Theater+Hall', FALSE, 2),

-- City Tour
(4, 'https://via.placeholder.com/800x600/FF4500/FFFFFF?text=Saigon+City+Tour', TRUE, 1),
(4, 'https://via.placeholder.com/800x600/32CD32/FFFFFF?text=Notre+Dame+Cathedral', FALSE, 2),
(4, 'https://via.placeholder.com/800x600/1E90FF/FFFFFF?text=Central+Post+Office', FALSE, 3),
(4, 'https://via.placeholder.com/800x600/FFD700/FFFFFF?text=Ben+Thanh+Market', FALSE, 4),

-- Cu Chi Tour
(5, 'https://via.placeholder.com/800x600/8B4513/FFFFFF?text=Cu+Chi+Tunnels', TRUE, 1),
(5, 'https://via.placeholder.com/800x600/228B22/FFFFFF?text=Underground+Network', FALSE, 2),
(5, 'https://via.placeholder.com/800x600/FF8C00/FFFFFF?text=Cao+Dai+Temple', FALSE, 3),

-- Mekong Delta
(6, 'https://via.placeholder.com/800x600/20B2AA/FFFFFF?text=Mekong+Delta', TRUE, 1),
(6, 'https://via.placeholder.com/800x600/FFB6C1/FFFFFF?text=Floating+Market', FALSE, 2),
(6, 'https://via.placeholder.com/800x600/98FB98/FFFFFF?text=Fruit+Gardens', FALSE, 3),

-- Spa
(7, 'https://via.placeholder.com/800x600/DDA0DD/FFFFFF?text=Luxury+Spa', TRUE, 1),
(7, 'https://via.placeholder.com/800x600/E6E6FA/FFFFFF?text=Massage+Room', FALSE, 2),

(8, 'https://via.placeholder.com/800x600/FFC0CB/FFFFFF?text=Facial+Treatment', TRUE, 1),

-- Water Park
(9, 'https://via.placeholder.com/800x600/00BFFF/FFFFFF?text=Dam+Sen+Water+Park', TRUE, 1),
(9, 'https://via.placeholder.com/800x600/87CEEB/FFFFFF?text=Water+Slides', FALSE, 2),
(9, 'https://via.placeholder.com/800x600/4682B4/FFFFFF?text=Wave+Pool', FALSE, 3),

-- Landmark 81
(10, 'https://via.placeholder.com/800x600/708090/FFFFFF?text=Landmark+81', TRUE, 1),
(10, 'https://via.placeholder.com/800x600/C0C0C0/FFFFFF?text=SkyView+Deck', FALSE, 2),

-- Hanoi - Water Puppet
(11, 'https://via.placeholder.com/800x600/DC143C/FFFFFF?text=Water+Puppet', TRUE, 1),
(11, 'https://via.placeholder.com/800x600/FF6347/FFFFFF?text=Traditional+Show', FALSE, 2),

-- Hanoi City Tour
(12, 'https://via.placeholder.com/800x600/DAA520/FFFFFF?text=Hanoi+City', TRUE, 1),
(12, 'https://via.placeholder.com/800x600/B8860B/FFFFFF?text=Hoan+Kiem+Lake', FALSE, 2),

-- Halong Bay
(13, 'https://via.placeholder.com/800x600/008B8B/FFFFFF?text=Halong+Bay', TRUE, 1),
(13, 'https://via.placeholder.com/800x600/20B2AA/FFFFFF?text=Cruise+Ship', FALSE, 2),
(13, 'https://via.placeholder.com/800x600/48D1CC/FFFFFF?text=Kayaking', FALSE, 3),
(13, 'https://via.placeholder.com/800x600/40E0D0/FFFFFF?text=Titop+Island', FALSE, 4),

-- Sapa
(14, 'https://via.placeholder.com/800x600/556B2F/FFFFFF?text=Sapa+Valley', TRUE, 1),
(14, 'https://via.placeholder.com/800x600/6B8E23/FFFFFF?text=Rice+Terraces', FALSE, 2),
(14, 'https://via.placeholder.com/800x600/808000/FFFFFF?text=Cat+Cat+Village', FALSE, 3),

-- Cooking Class
(15, 'https://via.placeholder.com/800x600/FF7F50/FFFFFF?text=Cooking+Class', TRUE, 1),
(15, 'https://via.placeholder.com/800x600/FA8072/FFFFFF?text=Vietnamese+Food', FALSE, 2),

-- Danang - Bana Hills
(16, 'https://via.placeholder.com/800x600/FFD700/FFFFFF?text=Bana+Hills', TRUE, 1),
(16, 'https://via.placeholder.com/800x600/FFA500/FFFFFF?text=Golden+Bridge', FALSE, 2),
(16, 'https://via.placeholder.com/800x600/FF8C00/FFFFFF?text=Fantasy+Park', FALSE, 3),
(16, 'https://via.placeholder.com/800x600/FF6347/FFFFFF?text=French+Village', FALSE, 4),

-- Hoi An
(17, 'https://via.placeholder.com/800x600/F4A460/FFFFFF?text=Hoi+An+Ancient', TRUE, 1),
(17, 'https://via.placeholder.com/800x600/DEB887/FFFFFF?text=Japanese+Bridge', FALSE, 2),
(17, 'https://via.placeholder.com/800x600/D2691E/FFFFFF?text=Lanterns', FALSE, 3),

-- Son Tra
(18, 'https://via.placeholder.com/800x600/4682B4/FFFFFF?text=Son+Tra+Peninsula', TRUE, 1),
(18, 'https://via.placeholder.com/800x600/5F9EA0/FFFFFF?text=Linh+Ung+Pagoda', FALSE, 2),

-- Cu Lao Cham
(19, 'https://via.placeholder.com/800x600/00CED1/FFFFFF?text=Cu+Lao+Cham', TRUE, 1),
(19, 'https://via.placeholder.com/800x600/48D1CC/FFFFFF?text=Coral+Diving', FALSE, 2),

-- Nha Trang - 4 Islands
(20, 'https://via.placeholder.com/800x600/1E90FF/FFFFFF?text=Nha+Trang+Bay', TRUE, 1),
(20, 'https://via.placeholder.com/800x600/4169E1/FFFFFF?text=Island+Hopping', FALSE, 2),

-- Vinpearl
(21, 'https://via.placeholder.com/800x600/FFB6C1/FFFFFF?text=Vinpearl+Land', TRUE, 1),
(21, 'https://via.placeholder.com/800x600/FF69B4/FFFFFF?text=Cable+Car', FALSE, 2),
(21, 'https://via.placeholder.com/800x600/FF1493/FFFFFF?text=Water+Park', FALSE, 3),

-- I-Resort
(22, 'https://via.placeholder.com/800x600/DDA0DD/FFFFFF?text=I+Resort+Spa', TRUE, 1),
(22, 'https://via.placeholder.com/800x600/EE82EE/FFFFFF?text=Mud+Bath', FALSE, 2),

-- Phu Quoc - Safari
(23, 'https://via.placeholder.com/800x600/228B22/FFFFFF?text=Safari+Phu+Quoc', TRUE, 1),
(23, 'https://via.placeholder.com/800x600/32CD32/FFFFFF?text=Wildlife', FALSE, 2),

-- 3 Islands
(24, 'https://via.placeholder.com/800x600/00CED1/FFFFFF?text=Phu+Quoc+Islands', TRUE, 1),
(24, 'https://via.placeholder.com/800x600/40E0D0/FFFFFF?text=Snorkeling', FALSE, 2),

-- VinWonders
(25, 'https://via.placeholder.com/800x600/FF4500/FFFFFF?text=VinWonders', TRUE, 1),
(25, 'https://via.placeholder.com/800x600/FF6347/FFFFFF?text=Theme+Park', FALSE, 2),

-- Da Lat - Romantic Tour
(26, 'https://via.placeholder.com/800x600/FF69B4/FFFFFF?text=Dalat+Romantic', TRUE, 1),
(26, 'https://via.placeholder.com/800x600/FFB6C1/FFFFFF?text=Flower+Gardens', FALSE, 2),

-- Canyoning
(27, 'https://via.placeholder.com/800x600/4682B4/FFFFFF?text=Datanla+Waterfall', TRUE, 1),
(27, 'https://via.placeholder.com/800x600/5F9EA0/FFFFFF?text=Canyoning', FALSE, 2),

-- Swing Cafe
(28, 'https://via.placeholder.com/800x600/FFD700/FFFFFF?text=Swing+Cafe', TRUE, 1),
(28, 'https://via.placeholder.com/800x600/FFA500/FFFFFF?text=Breakfast+View', FALSE, 2);

-- 10. Insert Pricing (Different prices for adults/children)
INSERT INTO gia_hoat_dong (hoatDongId, loaiKhach, gia, moTa) VALUES
-- Museum tickets
(1, 'NGUOI_LON', 40000, 'Vé người lớn'),
(1, 'TRE_EM', 20000, 'Vé trẻ em (6-15 tuổi)'),
(1, 'SINH_VIEN', 30000, 'Vé sinh viên (có thẻ)'),
-- Independence Palace
(2, 'NGUOI_LON', 65000, 'Vé người lớn'),
(2, 'TRE_EM', 30000, 'Vé trẻ em'),
-- City Tour
(4, 'NGUOI_LON', 450000, 'Vé người lớn'),
(4, 'TRE_EM', 350000, 'Vé trẻ em (dưới 12 tuổi)'),
-- Cu Chi Tour
(5, 'NGUOI_LON', 650000, 'Giá cho người lớn'),
(5, 'TRE_EM', 500000, 'Giá cho trẻ em (5-11 tuổi)'),
-- Water Park
(9, 'NGUOI_LON', 180000, 'Vé người lớn'),
(9, 'TRE_EM', 140000, 'Vé trẻ em dưới 1.4m'),
(9, 'NGUOI_CAO_TUOI', 100000, 'Vé người cao tuổi trên 60'),
-- Landmark 81
(10, 'NGUOI_LON', 270000, 'Vé người lớn'),
(10, 'TRE_EM', 200000, 'Vé trẻ em'),
-- Halong Bay
(13, 'NGUOI_LON', 950000, 'Bao gồm ăn trưa buffet hải sản'),
(13, 'TRE_EM', 750000, 'Trẻ em 4-10 tuổi'),
-- Bana Hills
(16, 'NGUOI_LON', 750000, 'Vé cáp treo + công viên'),
(16, 'TRE_EM', 600000, 'Vé trẻ em dưới 1.3m'),
-- Vinpearl
(21, 'NGUOI_LON', 880000, 'Vé cáp treo + vui chơi không giới hạn'),
(21, 'TRE_EM', 700000, 'Trẻ em dưới 1.4m');

-- 11. Insert Schedules (Available dates/times)
INSERT INTO lich_hoat_dong (hoatDongId, ngay, gioKhoiHanh, soChoToiDa, soChoConLai) VALUES
-- City Tour - Daily
(4, '2026-01-15', '08:00:00', 40, 28),
(4, '2026-01-15', '13:00:00', 40, 35),
(4, '2026-01-16', '08:00:00', 40, 40),
(4, '2026-01-17', '08:00:00', 40, 22),
-- Cu Chi Tour - Daily
(5, '2026-01-15', '07:30:00', 35, 15),
(5, '2026-01-16', '07:30:00', 35, 28),
(5, '2026-01-17', '07:30:00', 35, 30),
-- Halong Bay - Daily
(13, '2026-01-15', '08:00:00', 50, 35),
(13, '2026-01-16', '08:00:00', 50, 42),
(13, '2026-01-17', '08:00:00', 50, 50),
-- Water Puppet Show - Multiple shows daily
(11, '2026-01-15', '15:00:00', 100, 76),
(11, '2026-01-15', '16:30:00', 100, 88),
(11, '2026-01-15', '18:00:00', 100, 54),
(11, '2026-01-16', '15:00:00', 100, 100),
(11, '2026-01-16', '18:00:00', 100, 92);

-- 12. Insert Highlights (Key features)
INSERT INTO diem_noi_bat_hoat_dong (hoatDongId, noiDung, icon, thuTu) VALUES
-- Cu Chi Tour
(5, 'Khám phá địa đạo Củ Chi - kỳ quan quân sự', '🏰', 1),
(5, 'Tham quan Tòa Thánh Cao Đài', '🏛️', 2),
(5, 'Ăn trưa buffet món Việt', '🍜', 3),
(5, 'Hướng dẫn viên tiếng Việt/Anh', '👨‍🏫', 4),
(5, 'Xe đưa đón tận nơi', '🚌', 5),
-- Halong Bay  
(13, 'Du thuyền 5 sao trên vịnh Hạ Long', '⛵', 1),
(13, 'Tham quan Hang Sửng Sốt', '🏞️', 2),
(13, 'Chèo kayak khám phá làng chài', '🛶', 3),
(13, 'Buffet hải sản sang trọng', '🦞', 4),
(13, 'Bơi lội tại Đảo Titop', '🏊', 5),
-- Bana Hills
(16, 'Cáp treo dài nhất thế giới', '🚡', 1),
(16, 'Cầu Vàng - biểu tượng của Đà Nẵng', '🌉', 2),
(16, 'Fantasy Park miễn phí', '🎡', 3),
(16, 'Làng Pháp cổ kính', '🏰', 4),
(16, 'Vườn hoa Le Jardin', '🌸', 5),
-- Vinpearl Nha Trang
(21, 'Cáp treo vượt biển dài nhất VN', '🚡', 1),
(21, 'Công viên nước khổng lồ', '🏊', 2),
(21, 'Thủy cung lớn nhất VN', '🐠', 3),
(21, 'Khu vui chơi trong nhà Royal Castle', '🏰', 4),
(21, 'Chơi không giới hạn cả ngày', '🎢', 5);

-- 13. Insert Reviews
INSERT INTO danh_gia_hoat_dong (hoatDongId, nguoiDungId, diem, nhanXet, trangThai) VALUES
(5, 1, 5, 'Tour rất tuyệt vời! Hướng dẫn viên nhiệt tình, địa đạo rất ấn tượng. Highly recommended!', 'DA_DUYET'),
(5, NULL, 4, 'Chuyến đi thú vị, tuy nhiên hơi nóng nội trong địa đạo. Nên mang theo nước uống.', 'DA_DUYET'),
(13, 1, 5, 'Vịnh Hạ Long đẹp tuyệt vời! Du thuyền sang trọng, buffet ngon. Trải nghiệm tuyệt vời!', 'DA_DUYET'),
(13, NULL, 5, 'Cảnh đẹp như mơ, dịch vụ chuyên nghiệp. Đáng tiền!', 'DA_DUYET'),
(16, NULL, 5, 'Bà Nà Hills quá đỉnh! Cầu Vàng đẹp lắm, check-in sống ảo triệu like 😍', 'DA_DUYET'),
(16, NULL, 4, 'Rất đáng đi, nhưng cuối tuần đông người. Nên đi ngày thường.', 'DA_DUYET'),
(21, NULL, 5, 'Con nhỏ mê lắm! Chơi cả ngày không chán. Cáp treo view đẹp quá trời!', 'DA_DUYET'),
(4, NULL, 4, 'Tour ổn, tham quan nhiều điểm. Tuy nhiên hơi vội vàng ở mỗi điểm.', 'DA_DUYET'),
(11, NULL, 5, 'Múa rối nước rất hay, độc đáo. Nên xem khi đến Hà Nội!', 'DA_DUYET'),
(7, NULL, 5, 'Spa sạch sẽ, nhân viên massage rất chuyên nghiệp. Relax cực kỳ!', 'DA_DUYET');

-- Update ratings based on reviews
UPDATE hoat_dong SET danhGiaTrungBinh = 4.5, soLuotDanhGia = 142 WHERE id = 5;
UPDATE hoat_dong SET danhGiaTrungBinh = 5.0, soLuotDanhGia = 98 WHERE id = 13;
UPDATE hoat_dong SET danhGiaTrungBinh = 4.7, soLuotDanhGia = 267 WHERE id = 16;
UPDATE hoat_dong SET danhGiaTrungBinh = 4.9, soLuotDanhGia = 189 WHERE id = 21;

-- =============================================
-- DONE! Database với 28 activities, images, prices, schedules, highlights, reviews
-- =============================================
