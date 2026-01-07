-- Add trangThai column to nha_cung_cap_dua_don table
ALTER TABLE `nha_cung_cap_dua_don` 
ADD COLUMN `trangThai` ENUM('active', 'inactive') DEFAULT 'active' AFTER `tongSoDanhGia`;

-- Disable safe update mode temporarily
SET SQL_SAFE_UPDATES = 0;

-- Update existing records to have 'active' status
UPDATE `nha_cung_cap_dua_don` SET `trangThai` = 'active' WHERE `trangThai` IS NULL;

-- Re-enable safe update mode
SET SQL_SAFE_UPDATES = 1;
