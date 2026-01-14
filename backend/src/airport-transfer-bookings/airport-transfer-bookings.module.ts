import { Module } from '@nestjs/common';
import { AirportTransferBookingsController } from './airport-transfer-bookings.controller';
import { AirportTransferBookingsService } from './airport-transfer-bookings.service';
import { PrismaModule } from '../prisma/prisma.module';
import { QrCodeModule } from '../qr-code/qr-code.module';
import { PaymentsModule } from '../payments/payments.module';

@Module({
    imports: [PrismaModule, QrCodeModule, PaymentsModule],
    controllers: [AirportTransferBookingsController],
    providers: [AirportTransferBookingsService],
    exports: [AirportTransferBookingsService],
})
export class AirportTransferBookingsModule { }
