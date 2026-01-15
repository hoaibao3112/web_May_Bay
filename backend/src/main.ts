import { NestFactory } from '@nestjs/core'
import { AppModule } from './app.module'
import { ValidationPipe } from '@nestjs/common'
import * as dotenv from 'dotenv'

async function bootstrap() {
  dotenv.config()
  const app = await NestFactory.create(AppModule)
  app.setGlobalPrefix('api') // Add global prefix for all routes
  app.enableCors()
  app.useGlobalPipes(new ValidationPipe({
    whitelist: true,
    transform: true,
  }))
  const port = process.env.PORT || 5000
  await app.listen(port, '0.0.0.0') // Listen on all network interfaces
  console.log(`Listening on http://0.0.0.0:${port}`)
  console.log(`Network access: http://192.168.1.2:${port}`)
}
bootstrap()
