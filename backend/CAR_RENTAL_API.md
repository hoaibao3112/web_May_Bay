# Car Rental API Documentation

## Base URL
```
http://localhost:3000
```

## Modules

### 1. Car Rental Search

#### Search Car Rentals
**POST** `/car-rental-search`

Search for available car rental options based on criteria.

**Request Body:**
```json
{
  "diemDiId": 1,
  "diemDi": "Sân bay Nội Bài",
  "diemDen": "Hồ Hoàn Kiếm",
  "tuyenDuongId": 1,
  "ngayGioDon": "2026-01-15T14:00:00Z",
  "soHanhKhach": 2,
  "soHanhLy": 2,
  "loaiXeId": 1,
  "nhaCungCapId": 1,
  "giaMin": 100000,
  "giaMax": 500000
}
```

**Response:**
```json
{
  "total": 10,
  "data": [
    {
      "id": 1,
      "nhaCungCap": {
        "id": 1,
        "tenNhaCungCap": "ABC Transfer",
        "logo": "/logos/abc.png",
        "danhGiaTrungBinh": 4.5,
        "soDanhGia": 120
      },
      "loaiXe": {
        "id": 1,
        "tenLoaiXe": "Sedan (Standard)",
        "soHanhKhach": 4,
        "soHanhLy": 3
      },
      "tuyenDuong": {
        "diemDi": "Sân bay Nội Bài",
        "diemDen": "Hồ Hoàn Kiếm",
        "khoangCach": 30
      },
      "giaTheoTuyen": 400000,
      "surcharges": {
        "night": 40000,
        "airport": 20000
      },
      "finalPrice": 460000
    }
  ]
}
```

#### Get Popular Routes
**GET** `/car-rental-search/routes?limit=10`

Get list of popular car rental routes.

#### Get Companies
**GET** `/car-rental-search/companies`

Get list of all active car rental companies.

#### Get Car Types
**GET** `/car-rental-search/car-types`

Get list of available car types.

#### Get Rental Option Details
**GET** `/car-rental-search/:id`

Get detailed information about a specific rental option.

---

### 2. Car Rental Bookings

#### Create Booking
**POST** `/car-rental-bookings`

Create a new car rental booking.

**Request Body:**
```json
{
  "nhaCungCapId": 1,
  "xeThueId": 5,
  "loaiXeId": 1,
  "giaThueXeId": 1,
  "diemDon": "Nhà ga T2, Sân bay Nội Bài",
  "diaChiDon": "Phú Minh, Sóc Sơn, Hà Nội",
  "diemTra": "Khách sạn Hilton Hanoi Opera",
  "diaChiTra": "1 Lê Thánh Tông, Hoàn Kiếm, Hà Nội",
  "thoiGianDon": "2026-01-15T14:00:00Z",
  "thoiGianTraDuKien": "2026-01-15T15:00:00Z",
  "soHanhKhach": 2,
  "soHanhLy": 2,
  "tenHanhKhach": "Nguyễn Văn A",
  "soDienThoai": "0901234567",
  "email": "nguyenvana@email.com",
  "ghiChu": "Đón lúc 14h chiều, có trẻ em 5 tuổi",
  "soHieuChuyenBay": "VN123",
  "gioHaCanh": "2026-01-15T13:30:00Z",
  "giaThue": 360000,
  "phuThu": 60000,
  "giamGia": 0,
  "tongTien": 420000,
  "phuongThucThanhToan": "CHUYEN_KHOAN"
}
```

**Response:**
```json
{
  "success": true,
  "message": "Đặt xe thành công",
  "data": {
    "id": 1,
    "maDonThue": "CR2026011500001",
    "trangThai": "CHO_XAC_NHAN",
    "tongTien": 420000,
    "nhaCungCap": {
      "tenNhaCungCap": "ABC Transfer"
    }
  }
}
```

#### Get Booking by ID
**GET** `/car-rental-bookings/:id`

Get booking details by ID.

#### Get Booking by Code
**GET** `/car-rental-bookings/code/:maDonThue`

Get booking details by booking code.

#### Get User Bookings
**GET** `/car-rental-bookings/user/:userId`

Get all bookings for a specific user.

#### Update Booking Status
**PATCH** `/car-rental-bookings/:id/status`

Update booking status and optionally add driver information.

**Request Body:**
```json
{
  "trangThai": "DA_XAC_NHAN",
  "tenTaiXe": "Trần Văn B",
  "soDienThoaiTaiXe": "0912345678",
  "bienSoXe": "29A-12345"
}
```

**Status Values:**
- `CHO_XAC_NHAN` - Waiting for confirmation
- `DA_XAC_NHAN` - Confirmed
- `TAI_XE_DANG_DEN` - Driver is on the way
- `DANG_PHUC_VU` - Service in progress
- `HOAN_THANH` - Completed
- `DA_HUY` - Cancelled
- `KHONG_DEN` - No-show

#### Cancel Booking
**DELETE** `/car-rental-bookings/:id`

Cancel a booking.

#### Create Payment
**POST** `/car-rental-bookings/payment`

Create a payment for a booking.

**Request Body:**
```json
{
  "donThueXeId": 1,
  "soTien": 420000,
  "phuongThuc": "VNPAY",
  "returnUrl": "http://localhost:3000/payment/return"
}
```

#### Verify Payment
**POST** `/car-rental-bookings/payment/verify`

Verify payment callback from payment gateway.

**Request Body:**
```json
{
  "maGiaoDich": "PAY1705392000123",
  "trangThai": "THANH_CONG",
  "thongTinGiaoDich": {}
}
```

---

### 3. Car Rental Companies

#### Get All Companies
**GET** `/car-rental-companies?trangThai=HOAT_DONG`

Get list of all car rental companies.

#### Get Company Details
**GET** `/car-rental-companies/:id`

Get detailed information about a company including vehicles, pricing, and reviews.

#### Get Company Vehicles
**GET** `/car-rental-companies/:id/vehicles`

Get all vehicles belonging to a company.

#### Get Company Reviews
**GET** `/car-rental-companies/:id/reviews?limit=20`

Get reviews for a specific company.

---

### 4. Car Rental Reviews

#### Create Review
**POST** `/car-rental-reviews`

Create a review for a completed booking.

**Request Body:**
```json
{
  "nhaCungCapId": 1,
  "donThueXeId": 3,
  "diemXe": 5,
  "diemTaiXe": 5,
  "diemDungGio": 5,
  "diemSachSe": 5,
  "diemGiaCa": 5,
  "binhLuan": "Dịch vụ tuyệt vời! Xe rất sạch sẽ, tài xế lịch sự và đúng giờ.",
  "hinhAnh": "[\"review1.jpg\", \"review2.jpg\"]"
}
```

**Response:**
```json
{
  "success": true,
  "message": "Đánh giá thành công",
  "data": {
    "id": 1,
    "diemTrungBinh": 5.0,
    "binhLuan": "Dịch vụ tuyệt vời!",
    "nguoiDung": {
      "hoTen": "Nguyễn Văn A"
    }
  }
}
```

#### Get Company Reviews
**GET** `/car-rental-reviews/company/:companyId?limit=20`

Get all reviews for a company.

#### Get Booking Review
**GET** `/car-rental-reviews/booking/:bookingId`

Get review for a specific booking.

---

## Error Responses

All endpoints may return the following error responses:

**400 Bad Request**
```json
{
  "statusCode": 400,
  "message": "Validation error message",
  "error": "Bad Request"
}
```

**404 Not Found**
```json
{
  "statusCode": 404,
  "message": "Resource not found",
  "error": "Not Found"
}
```

**500 Internal Server Error**
```json
{
  "statusCode": 500,
  "message": "Internal server error",
  "error": "Internal Server Error"
}
```

---

## Testing

### Using cURL

**Search for car rentals:**
```bash
curl -X POST http://localhost:3000/car-rental-search \
  -H "Content-Type: application/json" \
  -d '{
    "ngayGioDon": "2026-01-15T14:00:00Z",
    "soHanhKhach": 2,
    "soHanhLy": 2
  }'
```

**Create a booking:**
```bash
curl -X POST http://localhost:3000/car-rental-bookings \
  -H "Content-Type: application/json" \
  -d '{
    "nhaCungCapId": 1,
    "loaiXeId": 1,
    "diemDon": "Sân bay Nội Bài",
    "diemTra": "Hồ Hoàn Kiếm",
    "thoiGianDon": "2026-01-15T14:00:00Z",
    "soHanhKhach": 2,
    "soHanhLy": 2,
    "tenHanhKhach": "Nguyễn Văn A",
    "soDienThoai": "0901234567",
    "giaThue": 360000,
    "tongTien": 420000
  }'
```

### Using Postman

Import the endpoints above into Postman and test each one individually.
