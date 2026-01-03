# Nếu chưa cài MySQL, dùng SQLite để test nhanh

## Thay đổi trong .env:

```env
DATABASE_URL="file:./dev.db"
```

## Thay đổi trong prisma/schema.prisma:

```prisma
datasource db {
  provider = "sqlite"  // Thay vì mysql
  url      = env("DATABASE_URL")
}
```

## Sau đó chạy:

```bash
npx prisma generate
npx prisma migrate dev --name init
npm run seed
npm run start:dev
```

**Lưu ý:** SQLite không hỗ trợ một số tính năng như JSON, Decimal nên có thể có lỗi. MySQL vẫn là lựa chọn tốt nhất.
