import { NestFactory } from '@nestjs/core'
import { AppModule } from './app.module'
import { ValidationPipe } from '@nestjs/common'
import * as dotenv from 'dotenv'

async function bootstrap() {
  dotenv.config()
  const app = await NestFactory.create(AppModule)
  app.setGlobalPrefix('api') // Add global prefix for all routes

  // Cấu hình CORS cho cả dev và production
  const allowedOrigins = [
    'http://localhost:3000',
    'http://localhost:3001',
    'http://localhost:5500',
    'http://localhost:5501',
    process.env.CLIENT_ADMIN_URL,
    process.env.CLIENT_CUSTOMER_URL,
  ].filter(Boolean) // loại bỏ undefined/null

  app.enableCors({
    origin: (origin, callback) => {
      // Cho phép request không có origin (Postman, mobile, server-to-server)
      if (!origin) return callback(null, true)
      // Cho phép tất cả domain *.vercel.app
      if (origin.endsWith('.vercel.app')) return callback(null, true)
      // Cho phép các origin đã liệt kê
      if (allowedOrigins.includes(origin)) return callback(null, true)
      callback(new Error(`CORS blocked: ${origin}`))
    },
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
  })

  app.useGlobalPipes(new ValidationPipe({
    whitelist: true,
    transform: true,
  }))

  const port = process.env.PORT || 5000
  await app.listen(port, '0.0.0.0') // Listen on all network interfaces
  console.log(`Application is running on: http://0.0.0.0:${port}`)
  console.log(`Environment: ${process.env.NODE_ENV || 'development'}`)
}
bootstrap()
