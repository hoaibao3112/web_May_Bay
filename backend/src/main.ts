import { NestFactory } from '@nestjs/core'
import { AppModule } from './app.module'
import { ValidationPipe } from '@nestjs/common'
import * as dotenv from 'dotenv'

async function bootstrap() {
  dotenv.config()
  const app = await NestFactory.create(AppModule)
  app.enableCors()
  app.useGlobalPipes(new ValidationPipe({
    whitelist: true,
    transform: true,
  }))
  const port = process.env.PORT || 5000
  await app.listen(port)
  console.log(`Listening on http://localhost:${port}`)
}
bootstrap()
