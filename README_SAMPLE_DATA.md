# Hướng dẫn chạy sample data cho admin panel

## Bước 1: Insert sample data vào database

Mở MySQL Workbench hoặc command line và chạy file:
```sql
source C:\Users\PC\Desktop\Web_CV\sample_admin_bookings.sql
```

Hoặc copy nội dung file `sample_admin_bookings.sql` và paste vào MySQL Workbench rồi Execute.

## Bước 2: Test các trang

Sau khi insert data, truy cập các URLs sau:

### Bus Booking
http://localhost:5500/dashboard/bookings/buses/1

### Airport Transfer
http://localhost:5500/dashboard/bookings/transfers/1

### Car Rental
http://localhost:5500/dashboard/bookings/cars/1

### Flight
http://localhost:5500/dashboard/bookings/flights/1

## Lưu ý

Sample data sử dụng:
- User ID = 1 (Admin user)
- Các ID khác (chuyenXeId, dichVuId, xeId, changBayId) = 1

**Nếu bạn chưa có data trong các bảng này, cần insert trước:**
- `chuyen_xe` (cho bus)
- `dich_vu_dua_don` (cho transfer)
- `xe_thue` (cho car)
- `chang_bay` (cho flight)

Hoặc thay đổi các ID trong script để match với data hiện có trong database.
