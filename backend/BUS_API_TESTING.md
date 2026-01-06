# Bus Booking API Testing Guide

## Base URL
```
http://localhost:5000
```

## 🔍 1. Tìm kiếm chuyến xe

### Tìm chuyến từ Sài Gòn đến Nha Trang
```http
POST http://localhost:5000/bus-search
Content-Type: application/json

{
  "thanhPhoDi": "TP.HCM",
  "thanhPhoDen": "Nha Trang",
  "ngayDi": "2026-01-07",
  "soKhach": 2
}
```

### Tìm chuyến theo bến xe cụ thể
```http
POST http://localhost:5000/bus-search
Content-Type: application/json

{
  "benXeDiId": 1,
  "benXeDenId": 8,
  "ngayDi": "2026-01-07",
  "giaMin": 100000,
  "giaMax": 300000
}
```

### Lấy tuyến phổ biến
```http
GET http://localhost:5000/bus-search/popular-routes?limit=10
```

### Gợi ý bến xe
```http
GET http://localhost:5000/bus-search/suggestions?q=Sài Gòn
```

---

## 🏢 2. Nhà xe (Bus Companies)

### Lấy danh sách nhà xe
```http
GET http://localhost:5000/bus-companies
```

### Lấy nhà xe đang hoạt động
```http
GET http://localhost:5000/bus-companies?trangThai=HOAT_DONG
```

### Tìm kiếm nhà xe
```http
GET http://localhost:5000/bus-companies?search=FUTA
```

### Lấy thông tin nhà xe cụ thể
```http
GET http://localhost:5000/bus-companies/1
```

### Lấy đánh giá của nhà xe
```http
GET http://localhost:5000/bus-companies/1/reviews?page=1&limit=10
```

---

## 🚏 3. Bến xe (Bus Stations)

### Lấy tất cả bến xe
```http
GET http://localhost:5000/bus-stations
```

### Tìm bến xe theo thành phố
```http
GET http://localhost:5000/bus-stations?thanhPho=TP.HCM
```

### Tìm kiếm bến xe
```http
GET http://localhost:5000/bus-stations/search?city=Hà Nội
```

### Lấy thông tin bến xe
```http
GET http://localhost:5000/bus-stations/1
```

---

## 🎫 4. Đặt vé (Bookings)

### Tạo đơn đặt vé
```http
POST http://localhost:5000/bus-bookings
Content-Type: application/json

{
  "chuyenXeId": 1,
  "soLuongGhe": 2,
  "danhSachGhe": ["A1", "A2"],
  "hanhKhach": [
    {
      "hoTenHanhKhach": "Nguyễn Văn A",
      "soDienThoai": "0901234567",
      "email": "nguyenvana@gmail.com",
      "soGhe": "A1"
    },
    {
      "hoTenHanhKhach": "Trần Thị B",
      "soDienThoai": "0901234568",
      "email": "tranthib@gmail.com",
      "soGhe": "A2"
    }
  ],
  "ghiChu": "Cần ghế gần cửa"
}
```

### Lấy thông tin đơn đặt vé
```http
GET http://localhost:5000/bus-bookings/1
```

### Tra cứu đơn đặt vé theo mã
```http
GET http://localhost:5000/bus-bookings/code/BUS123ABC
```

### Lấy đơn đặt vé của user
```http
GET http://localhost:5000/bus-bookings/user/1
```

### Cập nhật trạng thái đơn đặt vé (sau khi thanh toán)
```http
PATCH http://localhost:5000/bus-bookings/1/status
Content-Type: application/json

{
  "trangThaiDat": "DA_THANH_TOAN",
  "phuongThucThanhToan": "VNPAY"
}
```

### Hủy đơn đặt vé
```http
DELETE http://localhost:5000/bus-bookings/1
```

---

## ⭐ 5. Đánh giá (Reviews)

### Gửi đánh giá
```http
POST http://localhost:5000/bus-reviews
Content-Type: application/json

{
  "nhaXeId": 1,
  "chuyenXeId": 1,
  "diemDanhGia": 5,
  "nhanXet": "Xe rất sạch sẽ, tài xế lái xe an toàn. Sẽ ủng hộ lần sau!"
}
```

### Lấy đánh giá của nhà xe
```http
GET http://localhost:5000/bus-reviews/company/1?page=1&limit=10
```

### Xóa đánh giá
```http
DELETE http://localhost:5000/bus-reviews/1
```

---

## 📋 Test Flow Hoàn Chỉnh

### Bước 1: Tìm chuyến xe
```bash
POST /bus-search
{
  "thanhPhoDi": "TP.HCM",
  "thanhPhoDen": "Nha Trang",
  "ngayDi": "2026-01-07",
  "soKhach": 2
}
```

### Bước 2: Chọn chuyến và đặt vé
Lấy `chuyenXeId` từ kết quả tìm kiếm, sau đó:
```bash
POST /bus-bookings
{
  "chuyenXeId": 1,
  "soLuongGhe": 2,
  "danhSachGhe": ["A1", "A2"],
  "hanhKhach": [...]
}
```

### Bước 3: Lấy mã đặt vé
Từ response, lấy `maDonDat` (ví dụ: "BUS123ABC")

### Bước 4: Thanh toán (giả lập)
```bash
PATCH /bus-bookings/1/status
{
  "trangThaiDat": "DA_THANH_TOAN",
  "phuongThucThanhToan": "VNPAY"
}
```

### Bước 5: Tra cứu vé
```bash
GET /bus-bookings/code/BUS123ABC
```

### Bước 6: Đánh giá sau chuyến đi
```bash
POST /bus-reviews
{
  "nhaXeId": 1,
  "diemDanhGia": 5,
  "nhanXet": "Tuyệt vời!"
}
```

---

## 🛠️ Testing với Thunder Client / Postman

1. Import các request trên vào Thunder Client hoặc Postman
2. Tạo environment với biến `baseUrl = http://localhost:5000`
3. Test từng endpoint theo thứ tự
4. Kiểm tra response và database

---

## ✅ Expected Results

### Search Response
```json
[
  {
    "id": 1,
    "maChuyenXe": "CX00101",
    "nhaXe": {
      "tenNhaXe": "Phương Trang - FUTA Bus Lines",
      "danhGiaTrungBinh": 4.5
    },
    "benXeDi": {
      "tenBenXe": "Bến xe Miền Đông",
      "thanhPho": "TP.HCM"
    },
    "benXeDen": {
      "tenBenXe": "Bến xe Nha Trang",
      "thanhPho": "Nha Trang"
    },
    "gioDi": "2026-01-07T06:00:00.000Z",
    "gioDen": "2026-01-07T15:00:00.000Z",
    "giaVe": 250000,
    "soGheTrong": 35,
    "loaiXe": {
      "tenLoaiXe": "Giường nằm 40 chỗ",
      "tienNghi": {
        "wifi": true,
        "dieuHoa": true,
        "toilet": true
      }
    }
  }
]
```

### Booking Response
```json
{
  "id": 1,
  "maDonDat": "BUSABC123",
  "tongTien": 500000,
  "trangThaiDat": "CHO_THANH_TOAN",
  "veXe": [
    {
      "soVe": "VX1704537600001234",
      "hoTenHanhKhach": "Nguyễn Văn A",
      "soGhe": "A1",
      "giaVe": 250000
    },
    {
      "soVe": "VX1704537600005678",
      "hoTenHanhKhach": "Trần Thị B",
      "soGhe": "A2",
      "giaVe": 250000
    }
  ]
}
```

---

## 🚨 Common Issues

### Port đã được sử dụng
```bash
# Dừng server cũ hoặc thay đổi port trong .env
PORT=5001
```

### Prisma client chưa có models
```bash
npx prisma generate
```

### Database chưa có dữ liệu
```bash
# Import file bus_sample_data.sql
mysql -u root -p database_name < bus_sample_data.sql
```
