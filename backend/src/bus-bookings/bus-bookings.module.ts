import { Module } from '@nestjs/common';
import { BusBookingsService } from './bus-bookings.service';
import { BusBookingsController } from './bus-bookings.controller';
import { PrismaModule } from '../prisma/prisma.module';
import { PaymentsModule } from '../payments/payments.module';

@Module({
    imports: [PrismaModule, PaymentsModule],
    controllers: [BusBookingsController],
    providers: [BusBookingsService],
    exports: [BusBookingsService],
})
export class BusBookingsModule { }
