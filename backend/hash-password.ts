import * as bcrypt from 'bcrypt';

async function hashPassword() {
    const password = 'Admin@123';
    const saltRounds = 10;

    const hashedPassword = await bcrypt.hash(password, saltRounds);
    console.log('\n=== Admin Account Info ===');
    console.log('Email: admin@example.com');
    console.log('Password: Admin@123');
    console.log('Hashed Password:', hashedPassword);
    console.log('\n=== SQL Insert Statement ===');
    console.log(`
INSERT INTO users (email, password, hoTen, soDienThoai, vaiTro, createdAt, updatedAt)
VALUES (
  'admin@example.com',
  '${hashedPassword}',
  'Administrator',
  '0909123456',
  'ADMIN',
  NOW(),
  NOW()
);
  `);
}

hashPassword();
