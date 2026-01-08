-- ===================================================================
-- SCRIPT KIỂM TRA DATABASE CHO ADMIN BOOKING MANAGEMENT
-- ===================================================================

SELECT '============================================' as '';
SELECT 'CHECKING BOOKING TABLES' as '';
SELECT '============================================' as '';

-- 1. Check Bus Bookings
SELECT '--- 1. BUS BOOKINGS ---' as '';
SELECT COUNT(*) as total_bus_bookings FROM dat_xe_khach;
SELECT id, maDonDat, trangThaiDat, tongTien, createdAt 
FROM dat_xe_khach 
ORDER BY id DESC LIMIT 5;

-- 2. Check Airport Transfer Bookings
SELECT '--- 2. AIRPORT TRANSFER BOOKINGS ---' as '';
SELECT COUNT(*) as total_transfer_bookings FROM dat_dich_vu_dua_don;
SELECT id, loaiDichVu, trangThai, tongTien, createdAt 
FROM dat_dich_vu_dua_don 
ORDER BY id DESC LIMIT 5;

-- 3. Check Car Rental Bookings
SELECT '--- 3. CAR RENTAL BOOKINGS ---' as '';
SELECT COUNT(*) as total_car_bookings FROM dat_thue_xe;
SELECT id, maDonThue, trangThai, tongTien, createdAt 
FROM dat_thue_xe 
ORDER BY id DESC LIMIT 5;

-- 4. Check Flight Bookings
SELECT '--- 4. FLIGHT BOOKINGS ---' as '';
SELECT COUNT(*) as total_flight_bookings FROM dat_ve;
SELECT id, maDatVe, trangThai, tongTien, createdAt 
FROM dat_ve 
ORDER BY id DESC LIMIT 5;

SELECT '============================================' as '';
SELECT 'CHECKING REQUIRED MASTER DATA' as '';
SELECT '============================================' as '';

-- 5. Check Bus Routes/Trips
SELECT '--- 5. BUS ROUTES (chuyen_xe) ---' as '';
SELECT COUNT(*) as total_bus_routes FROM chuyen_xe;
SELECT id, diemDi, diemDen, gioKhoiHanh, loaiXe 
FROM chuyen_xe 
ORDER BY id DESC LIMIT 5;

-- 6. Check Transfer Services
SELECT '--- 6. TRANSFER SERVICES (dich_vu_dua_don) ---' as '';
SELECT COUNT(*) as total_transfer_services FROM dich_vu_dua_don;
SELECT id, loaiXe, soChoNgoi, giaTienMotChieu 
FROM dich_vu_dua_don 
ORDER BY id DESC LIMIT 5;

-- 7. Check Rental Cars
SELECT '--- 7. RENTAL CARS (xe_thue) ---' as '';
SELECT COUNT(*) as total_rental_cars FROM xe_thue;
SELECT id, tenXe, soChoNgoi, giaTien 
FROM xe_thue 
ORDER BY id DESC LIMIT 5;

-- 8. Check Flights/Legs
SELECT '--- 8. FLIGHT LEGS (chang_bay) ---' as '';
SELECT COUNT(*) as total_flight_legs FROM chang_bay;
SELECT id, gioDi, gioDen 
FROM chang_bay 
ORDER BY id DESC LIMIT 5;

SELECT '============================================' as '';
SELECT 'CHECKING RELATED TABLES' as '';
SELECT '============================================' as '';

-- 9. Check Bus Companies
SELECT '--- 9. BUS COMPANIES (nha_xe) ---' as '';
SELECT COUNT(*) as total_bus_companies FROM nha_xe;
SELECT id, tenNhaXe FROM nha_xe ORDER BY id DESC LIMIT 5;

-- 10. Check Transfer Companies
SELECT '--- 10. TRANSFER COMPANIES (nha_cung_cap_dua_don) ---' as '';
SELECT COUNT(*) as total_transfer_companies FROM nha_cung_cap_dua_don;
SELECT id, tenNhaCungCap FROM nha_cung_cap_dua_don ORDER BY id DESC LIMIT 5;

-- 11. Check Car Rental Companies
SELECT '--- 11. CAR RENTAL COMPANIES (nha_cung_cap_xe) ---' as '';
SELECT COUNT(*) as total_car_companies FROM nha_cung_cap_xe;
SELECT id, tenNhaCungCap FROM nha_cung_cap_xe ORDER BY id DESC LIMIT 5;

-- 12. Check Airlines
SELECT '--- 12. AIRLINES (hang_hang_khong) ---' as '';
SELECT COUNT(*) as total_airlines FROM hang_hang_khong;
SELECT id, tenHang, maHang FROM hang_hang_khong ORDER BY id DESC LIMIT 5;

-- 13. Check Airports
SELECT '--- 13. AIRPORTS (san_bay) ---' as '';
SELECT COUNT(*) as total_airports FROM san_bay;
SELECT id, tenSanBay, maIata FROM san_bay ORDER BY id DESC LIMIT 5;

-- 14. Check Users
SELECT '--- 14. USERS (nguoi_dung) ---' as '';
SELECT COUNT(*) as total_users FROM nguoi_dung;
SELECT id, email, role FROM nguoi_dung ORDER BY id DESC LIMIT 5;

SELECT '============================================' as '';
SELECT 'SUMMARY' as '';
SELECT '============================================' as '';

SELECT 
    (SELECT COUNT(*) FROM dat_xe_khach) as bus_bookings,
    (SELECT COUNT(*) FROM dat_dich_vu_dua_don) as transfer_bookings,
    (SELECT COUNT(*) FROM dat_thue_xe) as car_bookings,
    (SELECT COUNT(*) FROM dat_ve) as flight_bookings,
    (SELECT COUNT(*) FROM chuyen_xe) as bus_routes,
    (SELECT COUNT(*) FROM dich_vu_dua_don) as transfer_services,
    (SELECT COUNT(*) FROM xe_thue) as rental_cars,
    (SELECT COUNT(*) FROM chang_bay) as flight_legs;

SELECT 'Check complete!' as status;
