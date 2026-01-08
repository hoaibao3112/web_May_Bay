-- Add Facebook OAuth field to users table
-- Note: avatar column already exists, only adding facebookId
ALTER TABLE `users` 
  ADD COLUMN `facebookId` VARCHAR(191) UNIQUE AFTER `googleId`;
