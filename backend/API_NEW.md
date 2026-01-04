# 🆕 API Mới - Hệ thống Đặt vé máy bay

Tài liệu này mô tả các API mới được thêm vào để hoàn thiện nghiệp vụ đặt vé máy bay.

## 📊 Statistics API - Thống kê & Báo cáo

### 1. Thống kê tổng quan
```http
GET /statistics/overview?startDate=2026-01-01&endDate=2026-12-31
```
**Response:**
```json
{
  "tongSoDonDatVe": 150,
  "tongDoanhThu": 180000000,
  "tongSoHanhKhach": 250,
  "soDonBiHuy": 10
}
```

### 2. Thống kê doanh thu theo thời gian
```http
GET /statistics/revenue?startDate=2026-01-01&endDate=2026-01-31&groupBy=day
```
**Response:**
```json
[
  { "period": "2026-01-01", "revenue": 5000000 },
  { "period": "2026-01-02", "revenue": 7500000 }
]
```

### 3. Hạng vé phổ biến
```http
GET /statistics/popular-classes
```

### 4. Tuyến bay phổ biến
```http
GET /statistics/popular-routes?limit=10
```

### 5. Thống kê hãng hàng không
```http
GET /statistics/airlines
```

### 6. Thống kê theo thành phố
```http
GET /statistics/cities
```

---

## 💺 Seats API - Quản lý chỗ ngồi

### 1. Lấy sơ đồ ghế
```http
GET /seats/map/:changBayId
```
**Response:**
```json
{
  "changBayId": 1,
  "soHieuChuyenBay": "VN123",
  "seatMap": [
    [
      { "number": "1A", "available": true, "type": "business" },
      { "number": "1B", "available": false, "type": "business" }
    ]
  ]
}
```

### 2. Chọn ghế
```http
POST /seats/select
Content-Type: application/json

{
  "hanhKhachId": 1,
  "soGhe": "12A"
}
```

### 3. Lấy ghế đã chọn của booking
```http
GET /seats/booking/:bookingId
```

### 4. Hủy chọn ghế
```http
POST /seats/cancel
Content-Type: application/json

{
  "hanhKhachId": 1
}
```

### 5. Kiểm tra ghế còn trống
```http
GET /seats/availability/:changBayId
```

---

## ✈️ Check-in API - Check-in trực tuyến

### 1. Check-in online
```http
POST /checkin/online
Content-Type: application/json

{
  "hanhKhachId": 1,
  "soGhe": "12A"
}
```
**Response:**
```json
{
  "message": "Check-in thành công",
  "hanhKhachId": 1,
  "maBoardingPass": "BP3A7F9E2D1C4B",
  "soGhe": "12A",
  "gioDi": "2026-02-01T08:00:00Z"
}
```

### 2. Lấy thẻ lên máy bay (Boarding Pass)
```http
GET /checkin/boarding-pass/:hanhKhachId
```
**Response:**
```json
{
  "maBoardingPass": "BP3A7F9E2D1C4B",
  "hoTen": "Nguyễn Văn A",
  "soVe": "738-1234567890",
  "soGhe": "12A",
  "chuyenBay": {
    "soHieu": "VN123",
    "hangHangKhong": "Vietnam Airlines"
  },
  "sanBayDi": { "ma": "SGN", "ten": "Tân Sơn Nhất" },
  "sanBayDen": { "ma": "HAN", "ten": "Nội Bài" },
  "gioDi": "2026-02-01T08:00:00Z",
  "qrCode": "https://baynhanh.vn/checkin/BP3A7F9E2D1C4B"
}
```

### 3. Kiểm tra tình trạng check-in
```http
GET /checkin/status/:bookingId
```

### 4. Hủy check-in
```http
POST /checkin/cancel
Content-Type: application/json

{
  "hanhKhachId": 1
}
```

### 5. Kiểm tra điều kiện check-in
```http
GET /checkin/eligible/:bookingId
```

---

## 🧳 Baggage API - Quản lý hành lý

### 1. Thêm hành lý ký gửi
```http
POST /baggage/add
Content-Type: application/json

{
  "hanhKhachId": 1,
  "soKien": 2,
  "khoiLuong": 30
}
```
**Response:**
```json
{
  "id": 1,
  "soKien": 2,
  "khoiLuong": 30,
  "dinhMuc": 20,
  "vuotDinhMuc": 10,
  "phiPhatSinh": 500000,
  "tongPhi": 500000
}
```

### 2. Lấy hành lý của booking
```http
GET /baggage/booking/:bookingId
```

### 3. Tính phí hành lý
```http
POST /baggage/calculate-fee
Content-Type: application/json

{
  "hangVeId": 1,
  "khoiLuong": 35
}
```

### 4. Xóa hành lý
```http
DELETE /baggage/:id
```

### 5. Lấy chính sách hành lý
```http
GET /baggage/policy/:hangVeId
```
**Response:**
```json
{
  "hangVe": "Phổ thông tiêu chuẩn",
  "khoangVe": "Phổ thông",
  "hanhLyKyGui": 20,
  "hanhLyXachTay": 7,
  "donGiaVuotDinhMuc": 50000,
  "donVi": "VND/kg"
}
```

---

## 🎁 Promotions API - Khuyến mãi & Coupon

### 1. Áp dụng mã khuyến mãi
```http
POST /promotions/apply
Content-Type: application/json

{
  "code": "SALE2026",
  "bookingId": 1
}
```
**Response:**
```json
{
  "message": "Áp dụng mã khuyến mãi thành công",
  "maKhuyenMai": "SALE2026",
  "tenKhuyenMai": "Giảm 20% tất cả vé",
  "giaGoc": 2000000,
  "giamGia": 400000,
  "tongTienMoi": 1600000
}
```

### 2. Kiểm tra mã khuyến mãi hợp lệ
```http
GET /promotions/validate/:code
```

### 3. Lấy danh sách khuyến mãi đang hoạt động
```http
GET /promotions/active
```
**Response:**
```json
[
  {
    "ma": "SALE2026",
    "ten": "Giảm 20% tất cả vé",
    "moTa": "Áp dụng cho tất cả các chuyến bay",
    "loaiGiam": "PERCENT",
    "giaTriGiam": 20,
    "giamToiDa": 500000,
    "giaTriDonToiThieu": 1000000,
    "conLai": 85,
    "ngayHetHan": "2026-02-28"
  }
]
```

### 4. Lấy khuyến mãi cho user
```http
GET /promotions/for-user/:userId
```
*Yêu cầu: JWT Token*

### 5. Hủy áp dụng mã khuyến mãi
```http
POST /promotions/remove
Content-Type: application/json

{
  "bookingId": 1
}
```

---

## ⭐ Reviews API - Đánh giá & Review

### 1. Tạo đánh giá hãng hàng không
```http
POST /reviews/airline
Authorization: Bearer <token>
Content-Type: application/json

{
  "hangId": 1,
  "soSao": 5,
  "binhLuan": "Dịch vụ tuyệt vời, rất hài lòng!",
  "hinhAnh": ["image1.jpg", "image2.jpg"]
}
```
*Yêu cầu: Phải đã bay với hãng này*

### 2. Lấy đánh giá của hãng
```http
GET /reviews/airline/:hangId?page=1&limit=10
```
**Response:**
```json
{
  "hangId": 1,
  "page": 1,
  "total": 150,
  "reviews": [
    {
      "id": 1,
      "nguoiDung": "Nguyễn Văn A",
      "soSao": 5,
      "binhLuan": "Dịch vụ tuyệt vời!",
      "ngayTao": "2026-01-15"
    }
  ]
}
```

### 3. Lấy rating trung bình
```http
GET /reviews/airline/:hangId/rating
```
**Response:**
```json
{
  "hangId": 1,
  "tongSoDanhGia": 150,
  "diemTrungBinh": 4.6,
  "phanBo": {
    "5": 85,
    "4": 45,
    "3": 15,
    "2": 3,
    "1": 2
  }
}
```

### 4. Lấy đánh giá của user
```http
GET /reviews/my-reviews
Authorization: Bearer <token>
```

### 5. Xóa đánh giá
```http
POST /reviews/delete/:reviewId
Authorization: Bearer <token>
```

---

## 🔔 Notifications API - Thông báo chuyến bay

### 1. Gửi thông báo cập nhật chuyến bay
```http
POST /notifications/flight-update
Content-Type: application/json

{
  "changBayId": 1,
  "loaiThongBao": "DELAY",
  "noiDung": "Chuyến bay bị hoãn 2 giờ do thời tiết",
  "gioMoi": "2026-02-01T10:00:00Z"
}
```
**Loại thông báo:** `DELAY` | `CANCELLED` | `GATE_CHANGE` | `ON_TIME`

### 2. Lấy thông báo của user
```http
GET /notifications/my-notifications?page=1
Authorization: Bearer <token>
```

### 3. Đánh dấu đã đọc
```http
POST /notifications/mark-read/:notificationId
Authorization: Bearer <token>
```

### 4. Đánh dấu tất cả đã đọc
```http
POST /notifications/mark-all-read
Authorization: Bearer <token>
```

### 5. Lấy số thông báo chưa đọc
```http
GET /notifications/unread-count
Authorization: Bearer <token>
```
**Response:**
```json
{
  "unreadCount": 5
}
```

### 6. Lấy thông báo theo booking
```http
GET /notifications/booking/:bookingId
```

---

## 📝 Tổng kết

### API đã thêm:
✅ **Statistics** - 6 endpoints (thống kê doanh thu, hạng vé, tuyến bay, hãng, thành phố)  
✅ **Seats** - 5 endpoints (sơ đồ ghế, chọn/hủy ghế, kiểm tra trống)  
✅ **Check-in** - 5 endpoints (check-in online, boarding pass, hủy check-in)  
✅ **Baggage** - 5 endpoints (thêm hành lý, tính phí, chính sách)  
✅ **Promotions** - 5 endpoints (áp dụng coupon, kiểm tra, danh sách)  
✅ **Reviews** - 5 endpoints (tạo/xem đánh giá, rating, xóa)  
✅ **Notifications** - 6 endpoints (gửi thông báo, đọc, đếm chưa đọc)  

**Tổng cộng: 37 API endpoints mới**

### Nghiệp vụ đã cover:
- ✅ Thống kê & báo cáo doanh thu
- ✅ Quản lý chỗ ngồi máy bay
- ✅ Check-in trực tuyến
- ✅ Quản lý hành lý ký gửi
- ✅ Hệ thống khuyến mãi/coupon
- ✅ Đánh giá hãng hàng không
- ✅ Thông báo delay/hủy chuyến bay

### Chạy backend:
```bash
cd backend
npm install
npm start
```

Server sẽ chạy tại: `http://localhost:5000`

### Test API:
Sử dụng Postman hoặc Thunder Client với base URL: `http://localhost:5000`

---

📅 **Ngày tạo:** 04/01/2026  
👨‍💻 **Tạo bởi:** GitHub Copilot
