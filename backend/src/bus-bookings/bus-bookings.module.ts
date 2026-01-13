import { Module } from '@nestjs/common';
import { BusBookingsService } from './bus-bookings.service';
import { BusBookingsController } from './bus-bookings.controller';
import { PrismaModule } from '../prisma/prisma.module';
import { PaymentsModule } from '../payments/payments.module';
import { QrCodeModule } from '../qr-code/qr-code.module';

@Module({
    imports: [PrismaModule, PaymentsModule, QrCodeModule],
    controllers: [BusBookingsController],
    providers: [BusBookingsService],
    exports: [BusBookingsService],
})
export class BusBookingsModule { }
