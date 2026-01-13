import { Module } from '@nestjs/common';
import { HotelBookingsController } from './hotel-bookings.controller';
import { HotelBookingsService } from './hotel-bookings.service';
import { PrismaModule } from '../prisma/prisma.module';
import { PaymentsModule } from '../payments/payments.module';

@Module({
    imports: [PrismaModule, PaymentsModule],
    controllers: [HotelBookingsController],
    providers: [HotelBookingsService],
    exports: [HotelBookingsService],
})
export class HotelBookingsModule { }
