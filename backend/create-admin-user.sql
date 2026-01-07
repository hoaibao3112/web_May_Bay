-- =====================================================
-- TẠO TÀI KHOẢN ADMIN
-- =====================================================
-- Email: admin@example.com
-- Password: Admin@123
-- Role: ADMIN
-- =====================================================

-- Insert admin user
INSERT INTO users (email, password, hoTen, soDienThoai, vaiTro, createdAt, updatedAt)
VALUES (
  'admin@example.com',
  '$2b$10$YourBcryptHashedPasswordHere.ABCDEFGHIJKLMNOPQRSTUVWXYZ',
  'Administrator',
  '0909123456',
  'ADMIN',
  NOW(),
  NOW()
)
ON DUPLICATE KEY UPDATE
  hoTen = 'Administrator',
  vaiTro = 'ADMIN';

-- Verify account created
SELECT 
  id, 
  email, 
  hoTen, 
  soDienThoai,
  vaiTro, 
  createdAt 
FROM users 
WHERE email = 'admin@example.com';

-- =====================================================
-- ALTERNATIVE: Update existing user to ADMIN role
-- =====================================================
-- If you already have a user, just update their role:
-- UPDATE users SET vaiTro = 'ADMIN' WHERE email = 'your-email@example.com';
