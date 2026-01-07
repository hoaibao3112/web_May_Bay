# Admin Panel Frontend

Admin dashboard riêng biệt cho hệ thống quản lý đặt vé và dịch vụ.

## 🚀 Tính năng

### Đã hoàn thành
- ✅ **Đăng nhập**: Xác thực admin với role-based access (ADMIN, OPERATOR)
- ✅ **Dashboard**: Thống kê tổng quan với số liệu và biểu đồ
- ✅ **Quản lý người dùng**: Tìm kiếm, lọc, thay đổi vai trò, xóa người dùng
- ✅ **Quản lý đặt chỗ**: Xem tất cả bookings (máy bay, xe khách, thuê xe, đưa đón)
- ✅ **Quản lý hãng hàng không**: CRUD operations cho airlines
- ✅ **Layout responsive**: Sidebar navigation, mobile-friendly
- ✅ **Dark theme**: Giao diện tối hiện đại và chuyên nghiệp

### Đang phát triển
- 🔨 Quản lý chi tiết từng loại booking
- 🔨 Quản lý nhà xe, công ty thuê xe, khách sạn
- 🔨 Quản lý thanh toán và giao dịch
- 🔨 Quản lý khuyến mãi
- 🔨 Quản lý đánh giá
- 🔨 Cài đặt hệ thống
- 🔨 Upload ảnh/logo
- 🔨 Export báo cáo

## 📋 Yêu cầu

- Node.js 18+ 
- npm hoặc yarn
- Backend API chạy ở `http://localhost:5000`

## 🛠️ Cài đặt

1. **Cài đặt dependencies**:
```bash
cd frontend-admin
npm install
```

2. **Tạo file `.env.local`** (copy từ `.env.example`):
```bash
cp .env.example .env.local
```

Nội dung file `.env.local`:
```
NEXT_PUBLIC_API_URL=http://localhost:5000
```

3. **Chạy development server**:
```bash
npm run dev
```

Admin panel sẽ chạy tại: `http://localhost:5500`

## 🔐 Đăng nhập

Để đăng nhập vào admin panel, bạn cần tài khoản với role `ADMIN` hoặc `OPERATOR`.

### Tạo tài khoản admin (nếu chưa có):

Chạy query SQL trong database:
```sql
-- Tạo user với role ADMIN
INSERT INTO users (email, password, hoTen, vaiTro, createdAt, updatedAt)
VALUES (
  'admin@example.com', 
  '$2b$10$YourHashedPasswordHere',  -- Cần hash password với bcrypt
  'Admin User',
  'ADMIN',
  NOW(),
  NOW()
);
```

Hoặc sử dụng backend API để register và sau đó update role trong database.

### Demo Credentials:
- Email: `admin@example.com`
- Password: `Admin@123` (nếu đã setup)

## 📂 Cấu trúc thư mục

```
frontend-admin/
├── app/
│   ├── components/          # Shared components
│   │   └── AdminLayout.tsx  # Main admin layout
│   ├── dashboard/          # Dashboard routes
│   │   ├── page.tsx        # Dashboard main page
│   │   ├── users/          # User management
│   │   ├── bookings/       # Booking management  
│   │   ├── airlines/       # Airlines management
│   │   └── ...            # Other management pages
│   ├── login/             # Login page
│   ├── globals.css        # Global styles
│   └── layout.tsx         # Root layout
├── lib/
│   └── api.ts            # API service layer
├── .env.example          # Environment variables template
└── package.json
```

## 🎨 Tech Stack

- **Framework**: Next.js 14 (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **Icons**: React Icons (Feather Icons)
- **HTTP Client**: Axios
- **State**: React Hooks

## 📱 Responsive Design

Admin panel hoàn toàn responsive:
- **Desktop**: Full sidebar, multi-column layouts
- **Tablet**: Compact sidebar, optimized tables
- **Mobile**: Hamburger menu, stacked layouts

## 🔗 API Integration

Tất cả API calls được centralized trong `lib/api.ts`:

```typescript
import { getUsers, updateUserRole, deleteUser } from '@/lib/api';

// Sử dụng
const users = await getUsers();
await updateUserRole(userId, 'ADMIN');
```

API tự động thêm JWT token vào headers và handle unauthorized errors.

## 🚧 Development Notes

### Mock Data
Một số api endpoints có thể chưa có trong backend, hiện tại đang dùng mock data. Cần tích hợp với backend APIs thực tế:
- Dashboard statistics
- Booking details by type
- Upload functionality

### Environment Variables
- `NEXT_PUBLIC_API_URL`: Backend API base URL (default: http://localhost:5000)

### Build for Production
```bash
npm run build
npm start
```

## 📝 TODO

- [ ] Hoàn thiện tất cả CRUD operations
- [ ] Tích hợp real-time notifications
- [ ] Upload images/logos
- [ ] Export reports (PDF, Excel)
- [ ] Advanced analytics với charts
- [ ] Bulk operations
- [ ] Activity logs
- [ ] Email notifications
- [ ] Dark/Light theme toggle

## 🐛 Troubleshooting

### Không kết nối được backend
- Kiểm tra backend đang chạy tại `http://localhost:5000`
- Kiểm tra CORS đã được enable trong backend
- Kiểm tra `.env.local` có đúng API URL

### Không đăng nhập được
- Kiểm tra user có role ADMIN hoặc OPERATOR
- Kiểm tra JWT secret khớp giữa frontend và backend
- Xem console logs để debug

### Lỗi 401 Unauthorized
- Token hết hạn, đăng nhập lại
- Kiểm tra backend JWT configuration

## 📧 Support

Nếu gặp vấn đề, vui lòng kiểm tra:
1. Backend logs
2. Browser console
3. Network tab trong DevTools

---

**Version**: 1.0.0  
**Last Updated**: 2026-01-07
