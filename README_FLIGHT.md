# 🛫 Hệ thống Đặt vé máy bay

## 📋 Tổng quan

Hệ thống đặt vé máy bay hoàn chỉnh với các chức năng:
- ✅ Tìm kiếm chuyến bay (nội địa/quốc tế)
- ✅ Giữ chỗ tự động hết hạn sau 15 phút
- ✅ Quản lý hành khách
- ✅ Thanh toán (mock gateway)
- ✅ Xuất vé điện tử
- ✅ Tra cứu đặt vé

## 🚀 Cài đặt Backend

### 1. Cài đặt dependencies

```bash
cd backend
npm install
```

### 2. Cấu hình database MySQL

Tạo database MySQL:
```sql
CREATE DATABASE flight_booking CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
```

Cập nhật `.env`:
```env
DATABASE_URL="mysql://root:password@localhost:3306/flight_booking"
```

### 3. Chạy migration và seed data

```bash
npm run prisma:generate
npm run prisma:migrate
npm run seed
```

### 4. Chạy server

```bash
npm run start:dev
```

Server sẽ chạy tại: `http://localhost:3000`

## 📚 API Endpoints

### 🔐 Authentication

#### Register
```http
POST /auth/register
Content-Type: application/json

{
  "email": "user@example.com",
  "password": "123456",
  "hoTen": "Nguyen Van A",
  "soDienThoai": "0909123456"
}
```

#### Login
```http
POST /auth/login
Content-Type: application/json

{
  "email": "user@example.com",
  "password": "123456"
}
```

Response:
```json
{
  "accessToken": "jwt_token...",
  "user": {
    "id": 1,
    "email": "user@example.com",
    "hoTen": "Nguyen Van A",
    "vaiTro": "CUSTOMER"
  }
}
```

### 🗺️ Catalog (Danh mục)

#### Lấy danh sách sân bay
```http
GET /catalog/san-bay
GET /catalog/san-bay?q=SGN
```

#### Lấy danh sách hãng hàng không
```http
GET /catalog/hang-hang-khong
```

#### Lấy danh sách quốc gia
```http
GET /catalog/quoc-gia
```

### 🔍 Tìm kiếm chuyến bay

```http
POST /search
Content-Type: application/json

{
  "sanBayDiId": 1,
  "sanBayDenId": 2,
  "ngayDi": "2026-01-10",
  "loaiChuyen": "ONE_WAY",
  "nguoiLon": 1,
  "treEm": 0,
  "soSinh": 0,
  "khoang": "ECONOMY"
}
```

Response:
```json
{
  "searchSessionId": "abc123...",
  "loaiChuyen": "ONE_WAY",
  "tongSoKetQua": 3,
  "ketQua": [
    {
      "changBayId": 1,
      "soHieuChuyenBay": "VN210",
      "hang": {
        "maIata": "VN",
        "tenHang": "Vietnam Airlines"
      },
      "sanBayDi": {
        "maIata": "SGN",
        "tenSanBay": "Sân bay Tân Sơn Nhất"
      },
      "sanBayDen": {
        "maIata": "HAN",
        "tenSanBay": "Sân bay Nội Bài"
      },
      "gioDi": "2026-01-10T08:00:00Z",
      "gioDen": "2026-01-10T10:00:00Z",
      "giaVe": [
        {
          "hangVe": "Y",
          "nhomGia": "Eco Saver",
          "tongGia": 1700000,
          "soChoCon": 150
        }
      ]
    }
  ]
}
```

### ✈️ Đặt vé

#### 1. Tạo booking (giữ chỗ)
```http
POST /bookings
Content-Type: application/json

{
  "searchSessionId": "abc123",
  "changBayId": 1,
  "hangVeId": 1,
  "nhomGiaId": 1
}
```

Response:
```json
{
  "id": 1,
  "maDatVe": "ABC123",
  "trangThai": "GIU_CHO",
  "hetHanGiuCho": "2026-01-10T08:15:00Z",
  "tongTien": 1700000
}
```

#### 2. Thêm hành khách
```http
POST /bookings/1/passengers
Content-Type: application/json

{
  "loai": "NGUOI_LON",
  "ho": "NGUYEN",
  "ten": "VAN A",
  "gioiTinh": "NAM",
  "ngaySinh": "1990-01-01",
  "soCccd": "012345678900"
}
```

#### 3. Thêm thông tin liên hệ
```http
POST /bookings/1/contact
Content-Type: application/json

{
  "hoTen": "Nguyen Van A",
  "email": "user@example.com",
  "soDienThoai": "0909123456"
}
```

#### 4. Tra cứu booking
```http
GET /bookings/tra-cuu?maDatVe=ABC123&email=user@example.com
```

### 💳 Thanh toán

#### 1. Tạo thanh toán
```http
POST /payments
Content-Type: application/json

{
  "bookingId": 1,
  "phuongThuc": "QR"
}
```

Response:
```json
{
  "paymentId": 1,
  "maGiaoDich": "TXN1234567890",
  "soTien": 1700000,
  "paymentUrl": "http://localhost:3000/payments/mock?maGiaoDich=TXN1234567890"
}
```

#### 2. Mock callback thanh toán (để test)
```http
POST /payments/callback
Content-Type: application/json

{
  "maGiaoDich": "TXN1234567890",
  "status": "SUCCESS",
  "signature": "mock"
}
```

### 🎫 Xuất vé

```http
POST /tickets/issue
Content-Type: application/json

{
  "bookingId": 1
}
```

Response:
```json
{
  "bookingId": 1,
  "maDatVe": "ABC123",
  "tickets": [
    {
      "id": 1,
      "soVe": "7381234567890",
      "trangThai": "HIEU_LUC"
    }
  ],
  "message": "Xuất vé thành công"
}
```

## 📊 Trạng thái đơn đặt vé

- `TAO_MOI` - Mới tạo
- `GIU_CHO` - Đang giữ chỗ (15 phút)
- `HET_HAN` - Hết hạn giữ chỗ
- `CHO_THANH_TOAN` - Chờ thanh toán
- `DA_THANH_TOAN` - Đã thanh toán thành công
- `DANG_XUAT_VE` - Đang xuất vé
- `DA_XUAT_VE` - Đã xuất vé thành công
- `HUY` - Đã hủy

## ⏰ Tự động hết hạn

Hệ thống có cronjob chạy mỗi phút để:
- Kiểm tra các booking ở trạng thái `GIU_CHO` đã quá 15 phút
- Tự động chuyển sang `HET_HAN`
- Trả lại chỗ vào inventory

## 🧪 Test Flow hoàn chỉnh

1. **Đăng ký/Đăng nhập**
2. **Tìm kiếm chuyến bay** - POST /search
3. **Tạo booking** - POST /bookings (→ GIU_CHO)
4. **Thêm hành khách** - POST /bookings/:id/passengers
5. **Thêm liên hệ** - POST /bookings/:id/contact
6. **Thanh toán** - POST /payments (→ CHO_THANH_TOAN)
7. **Callback payment** - POST /payments/callback (→ DA_THANH_TOAN)
8. **Xuất vé** - POST /tickets/issue (→ DA_XUAT_VE)
9. **Tra cứu** - GET /bookings/tra-cuu

## 📝 Database Schema

### Bảng chính:
- `users` - Người dùng
- `san_bay` - Sân bay
- `hang_hang_khong` - Hãng hàng không
- `chuyen_bay` - Chuyến bay
- `chang_bay` - Chặng bay
- `ton_cho` - Tồn chỗ và giá
- `don_dat_ve` - Đơn đặt vé (PNR)
- `hanh_khach` - Hành khách
- `thanh_toan` - Thanh toán
- `ve` - Vé điện tử

## 🎯 Tính năng nâng cao (TODO)

- [ ] Multi-city booking
- [ ] Round-trip với 2 chặng
- [ ] Chọn chỗ ngồi
- [ ] Add-ons (hành lý, suất ăn)
- [ ] Email notification
- [ ] PDF ticket generation
- [ ] Admin dashboard
- [ ] Báo cáo doanh thu
- [ ] Hoàn/đổi vé theo rule

## 👨‍💻 Tech Stack

- **Backend**: NestJS + TypeScript
- **Database**: MySQL + Prisma ORM
- **Auth**: JWT
- **Validation**: class-validator
- **Scheduler**: @nestjs/schedule (cron jobs)

## 📞 Support

Email: support@flightbooking.com
