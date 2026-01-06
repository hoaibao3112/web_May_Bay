import { Module } from '@nestjs/common';
import { BusBookingsService } from './bus-bookings.service';
import { BusBookingsController } from './bus-bookings.controller';
import { PrismaModule } from '../prisma/prisma.module';

@Module({
    imports: [PrismaModule],
    controllers: [BusBookingsController],
    providers: [BusBookingsService],
    exports: [BusBookingsService],
})
export class BusBookingsModule { }
