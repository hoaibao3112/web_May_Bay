-- =============================================
-- Script thêm GIÁ VÉ cho TẤT CẢ chặng bay
-- Sử dụng stored procedure để generate nhanh
-- =============================================

USE dat_ve_may_bay;

-- Xóa procedure cũ nếu có
DROP PROCEDURE IF EXISTS generate_all_ticket_prices;

DELIMITER $$

CREATE PROCEDURE generate_all_ticket_prices()
BEGIN
    DECLARE flight_leg_id INT DEFAULT 1;
    DECLARE max_flight_leg INT;
    DECLARE eco_price INT;
    DECLARE bus_price INT;
    DECLARE first_price INT;
    DECLARE eco_available INT;
    DECLARE bus_available INT;
    DECLARE first_available INT;
    
    -- Get max flight leg ID
    SELECT MAX(id) INTO max_flight_leg FROM chang_bay;
    
    -- Loop through all flight legs
    WHILE flight_leg_id <= max_flight_leg DO
        -- Calculate varied prices based on flight leg ID
        SET eco_price = 1000000 + ((flight_leg_id * 13) MOD 500000);
        SET bus_price = eco_price + 1200000 + ((flight_leg_id * 5) MOD 400000);
        SET first_price = bus_price + 2000000 + ((flight_leg_id * 3) MOD 500000);
        
        -- Calculate available seats
        SET eco_available = 150 - ((flight_leg_id * 11) MOD 70);
        SET bus_available = 30 - ((flight_leg_id * 7) MOD 15);
        SET first_available = 12 - ((flight_leg_id * 5) MOD 8);
        
        -- Insert 3 fare classes for this flight leg
        INSERT INTO gia_ve (changBayId, hangVeId, giaBan, soLuongGhe, soLuongGheTrong, createdAt, updatedAt)
        VALUES 
            (flight_leg_id, 1, eco_price, 150, eco_available, NOW(), NOW()),
            (flight_leg_id, 2, bus_price, 30, bus_available, NOW(), NOW()),
            (flight_leg_id, 3, first_price, 12, first_available, NOW(), NOW());
        
        SET flight_leg_id = flight_leg_id + 1;
    END WHILE;
    
    SELECT CONCAT('Đã thêm ', max_flight_leg * 3, ' giá vé (', max_flight_leg, ' chặng x 3 hạng vé) thành công!') as message;
END$$

DELIMITER ;

-- Chạy procedure
CALL generate_all_ticket_prices();

-- Xóa procedure sau khi chạy xong
DROP PROCEDURE IF EXISTS generate_all_ticket_prices;

-- Kiểm tra kết quả
SELECT COUNT(*) as total_gia_ve FROM gia_ve;
SELECT 'Sample prices:' as info;
SELECT * FROM gia_ve LIMIT 20;
