import { PrismaClient } from '@prisma/client';
import * as bcrypt from 'bcrypt';

const prisma = new PrismaClient();

async function createAdminUser() {
    try {
        // Hash password
        const password = 'Admin@123';
        const hashedPassword = await bcrypt.hash(password, 10);

        // Create admin user
        const admin = await prisma.user.create({
            data: {
                email: 'admin@example.com',
                password: hashedPassword,
                hoTen: 'Administrator',
                soDienThoai: '0909123456',
                vaiTro: 'ADMIN',
            },
        });

        console.log('✅ Admin user created successfully!');
        console.log('\n=== Login Credentials ===');
        console.log('Email:', admin.email);
        console.log('Password: Admin@123');
        console.log('Role:', admin.vaiTro);
        console.log('\n🔗 Login at: http://localhost:5500');

    } catch (error: any) {
        if (error.code === 'P2002') {
            console.log('⚠️  User already exists. Updating to ADMIN role...');

            // Update existing user to ADMIN
            const updated = await prisma.user.update({
                where: { email: 'admin@example.com' },
                data: {
                    vaiTro: 'ADMIN',
                    hoTen: 'Administrator',
                },
            });

            console.log('✅ User updated to ADMIN!');
            console.log('\n=== Login Credentials ===');
            console.log('Email:', updated.email);
            console.log('Password: (your existing password or Admin@123 if created new)');
            console.log('Role:', updated.vaiTro);
            console.log('\n🔗 Login at: http://localhost:5500');
        } else {
            console.error('❌ Error creating admin user:', error.message);
        }
    } finally {
        await prisma.$disconnect();
    }
}

createAdminUser();
