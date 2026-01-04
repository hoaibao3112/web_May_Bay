import { Module } from '@nestjs/common';
import { BaggageController } from './baggage.controller';
import { BaggageService } from './baggage.service';
import { PrismaModule } from '../prisma/prisma.module';

@Module({
  imports: [PrismaModule],
  controllers: [BaggageController],
  providers: [BaggageService],
  exports: [BaggageService],
})
export class BaggageModule {}
