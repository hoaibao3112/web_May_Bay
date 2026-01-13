import { Module } from '@nestjs/common';
import { HotelBookingsController } from './hotel-bookings.controller';
import { HotelBookingsService } from './hotel-bookings.service';
import { PrismaModule } from '../prisma/prisma.module';
import { PaymentsModule } from '../payments/payments.module';
import { QrCodeModule } from '../qr-code/qr-code.module';

@Module({
    imports: [PrismaModule, PaymentsModule, QrCodeModule],
    controllers: [HotelBookingsController],
    providers: [HotelBookingsService],
    exports: [HotelBookingsService],
})
export class HotelBookingsModule { }
