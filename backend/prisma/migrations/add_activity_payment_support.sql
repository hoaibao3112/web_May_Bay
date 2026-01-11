-- Migration: Add Activity Payment Support to thanh_toan table
-- Created: 2026-01-11

-- Add datHoatDongId column to support activity bookings
ALTER TABLE `thanh_toan` 
  ADD COLUMN `datHoatDongId` INT NULL AFTER `donDatVeId`;

-- Add foreign key constraint
ALTER TABLE `thanh_toan`
  ADD CONSTRAINT `thanh_toan_datHoatDongId_fkey` 
  FOREIGN KEY (`datHoatDongId`) 
  REFERENCES `dat_hoat_dong`(`id`) 
  ON DELETE CASCADE;

-- Add index for performance
CREATE INDEX `idx_thanh_toan_datHoatDongId` ON `thanh_toan`(`datHoatDongId`);

-- Make donDatVeId nullable (optional)
ALTER TABLE `thanh_toan` 
  MODIFY COLUMN `donDatVeId` INT NULL;
