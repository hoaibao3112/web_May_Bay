# Backend - Hệ thống Đặt vé máy bay

## Quick Start

### 1. Cài đặt MySQL và tạo database

**Option A - Tự động (Windows):**
```bash
create-database.bat
```

**Option B - Thủ công:**
```sql
mysql -u root -p
CREATE DATABASE flight_booking CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
EXIT;
```

### 2. Cài đặt và chạy

```bash
# Cài dependencies
npm install

# Generate Prisma Client
npm run prisma:generate

# Chạy migration (tạo bảng)
npm run prisma:migrate

# Seed dữ liệu mẫu
npm run seed

# Khởi động server
npm run start:dev
```

Server sẽ chạy tại: **http://localhost:3000**

## Scripts

- `npm run start:dev` - Chạy dev server với hot reload
- `npm run build` - Build production
- `npm run start` - Chạy production
- `npm run prisma:generate` - Generate Prisma Client
- `npm run prisma:migrate` - Chạy migration
- `npm run prisma:reset` - Reset database
- `npm run seed` - Seed dữ liệu mẫu

## Cấu hình (.env)

```env
DATABASE_URL="mysql://root:password@localhost:3306/flight_booking"
JWT_SECRET="your-jwt-secret-key"
PORT=3000
```

## API Endpoints

### Auth
- `POST /auth/register` - Đăng ký
- `POST /auth/login` - Đăng nhập
- `GET /auth/me` - Lấy thông tin user (JWT required)

### Catalog
- `GET /catalog/san-bay` - Danh sách sân bay
- `GET /catalog/hang-hang-khong` - Danh sách hãng hàng không
- `GET /catalog/quoc-gia` - Danh sách quốc gia

### Search
- `POST /search` - Tìm kiếm chuyến bay

### Bookings
- `POST /bookings` - Tạo booking
- `POST /bookings/:id/passengers` - Thêm hành khách
- `POST /bookings/:id/contact` - Thêm thông tin liên hệ
- `GET /bookings/:id` - Chi tiết booking
- `GET /bookings/tra-cuu?maDatVe=XXX&email=YYY` - Tra cứu booking

### Payments
- `POST /payments` - Tạo thanh toán
- `POST /payments/callback` - Callback từ gateway
- `GET /payments/status?maGiaoDich=XXX` - Trạng thái thanh toán

### Tickets
- `POST /tickets/issue` - Xuất vé
- `GET /tickets/:soVe` - Thông tin vé

## Tech Stack

- **Framework**: NestJS
- **Database**: MySQL + Prisma ORM
- **Auth**: JWT
- **Validation**: class-validator
- **Scheduler**: @nestjs/schedule (cronjobs)

## Dữ liệu mẫu

Sau khi chạy `npm run seed`:

**Admin account:**
- Email: admin@flight.com
- Password: admin123

**Sân bay:** SGN, HAN, DAD, BKK, SIN

**Hãng:** VN, VJ, QH

**Chuyến bay:** 3 chuyến SGN → HAN vào ngày mai

## Troubleshooting

### Lỗi kết nối MySQL
```bash
# Kiểm tra MySQL đang chạy
mysql --version
mysql -u root -p

# Kiểm tra port
netstat -an | findstr 3306
```

### Reset database
```bash
npm run prisma:reset
# Hoặc
npx prisma migrate reset --force
npm run seed
```
