# 🚀 Hướng dẫn Setup hệ thống Đặt vé máy bay

## Bước 1: Cài đặt MySQL

### Windows:
1. Tải MySQL từ: https://dev.mysql.com/downloads/installer/
2. Cài đặt MySQL Server 8.0+
3. Trong quá trình cài đặt, đặt root password (ví dụ: `password`)

### Khởi động MySQL:
```bash
# Kiểm tra MySQL đã chạy chưa
mysql --version

# Đăng nhập MySQL
mysql -u root -p
```

### Tạo database:
```sql
CREATE DATABASE flight_booking CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
EXIT;
```

## Bước 2: Setup Backend

```bash
cd backend

# Cài dependencies
npm install

# Cấu hình .env
# Đã có sẵn trong .env, cập nhật password MySQL nếu cần:
# DATABASE_URL="mysql://root:password@localhost:3306/flight_booking"

# Generate Prisma Client
npm run prisma:generate

# Chạy migration (tạo các bảng)
npm run prisma:migrate

# Seed dữ liệu mẫu
npm run seed

# Khởi động server
npm run start:dev
```

Backend sẽ chạy tại: http://localhost:3000

## Bước 3: Setup Frontend

```bash
cd frontend

# Cài dependencies
npm install

# Chạy dev server
npm run dev
```

Frontend sẽ chạy tại: http://localhost:3001

## Bước 4: Test hệ thống

### 1. Mở trình duyệt
Truy cập: http://localhost:3001

### 2. Test API trực tiếp

#### Lấy danh sách sân bay:
```bash
curl http://localhost:3000/catalog/san-bay
```

#### Đăng ký tài khoản:
```bash
curl -X POST http://localhost:3000/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@example.com",
    "password": "123456",
    "hoTen": "Test User",
    "soDienThoai": "0909123456"
  }'
```

#### Tìm kiếm chuyến bay:
```bash
curl -X POST http://localhost:3000/search \
  -H "Content-Type: application/json" \
  -d '{
    "sanBayDiId": 1,
    "sanBayDenId": 2,
    "ngayDi": "2026-01-10",
    "loaiChuyen": "ONE_WAY",
    "nguoiLon": 1,
    "treEm": 0,
    "soSinh": 0
  }'
```

## Dữ liệu mẫu đã được seed:

### Admin:
- Email: admin@flight.com
- Password: admin123

### Sân bay:
- SGN - Tân Sơn Nhất (TP.HCM)
- HAN - Nội Bài (Hà Nội)
- DAD - Đà Nẵng
- BKK - Bangkok
- SIN - Singapore

### Hãng hàng không:
- VN - Vietnam Airlines
- VJ - VietJet Air
- QH - Bamboo Airways

### Chuyến bay mẫu:
- VN210: SGN → HAN (Ngày mai 8:00)
- VJ130: SGN → HAN (Ngày mai 10:00)
- QH1201: SGN → HAN (Ngày mai 12:00)

## Troubleshooting

### Lỗi kết nối MySQL:
```bash
# Kiểm tra MySQL đang chạy
mysql -u root -p

# Nếu không kết nối được, kiểm tra port
netstat -an | findstr 3306
```

### Lỗi Prisma:
```bash
# Xóa và tạo lại
npm run prisma:reset

# Hoặc
npx prisma migrate reset
npx prisma generate
npm run seed
```

### Port đã được sử dụng:
```bash
# Backend (port 3000)
# Thay đổi PORT trong backend/.env

# Frontend (port 3001)
# Next.js tự động chọn port khác nếu 3001 bị chiếm
```

## Luồng test đầy đủ:

1. ✅ Đăng ký tài khoản
2. ✅ Đăng nhập
3. ✅ Tìm chuyến bay
4. ✅ Chọn chuyến và tạo booking
5. ✅ Thêm thông tin hành khách
6. ✅ Thêm thông tin liên hệ
7. ✅ Thanh toán (mock)
8. ✅ Callback thanh toán thành công
9. ✅ Xuất vé
10. ✅ Tra cứu vé

## Cấu trúc dự án:

```
backend/
├── prisma/
│   ├── schema.prisma       # Database schema
│   ├── seed-flight.ts      # Seed data
│   └── migrations/         # Migration files
├── src/
│   ├── auth/              # Authentication
│   ├── catalog/           # Airports, Airlines
│   ├── search/            # Flight search
│   ├── bookings/          # Booking management
│   ├── payments/          # Payment gateway
│   ├── tickets/           # Ticket issuance
│   └── common/
│       └── enums/         # Enums
└── .env                   # Environment config

frontend/
├── app/
│   ├── flights/page.tsx   # Flight search UI
│   ├── page.tsx           # Landing page
│   └── layout.tsx         # Layout
└── lib/
    └── api.ts             # API client
```

## API Documentation:
Xem chi tiết trong file: `README_FLIGHT.md`

## Video hướng dẫn:
(TODO: Tạo video demo)
