import { Injectable, OnModuleInit, OnModuleDestroy } from '@nestjs/common'
import { PrismaClient } from '@prisma/client'

@Injectable()
export class PrismaService extends PrismaClient implements OnModuleInit, OnModuleDestroy {
  async onModuleInit() {
    try {
      await this.$connect()
    } catch (e) {
      // Don't crash app during local dev if DB is not available. Log and continue.
      // For production we want the app to fail fast, so you can rethrow or
      // check NODE_ENV before swallowing the error.
      // eslint-disable-next-line no-console
      console.warn('Prisma failed to connect on startup (continuing):', e.message || e)
    }
  }

  async onModuleDestroy() {
    await this.$disconnect()
  }
}
