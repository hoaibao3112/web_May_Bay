import { Module } from '@nestjs/common';
import { AirportTransferBookingsController } from './airport-transfer-bookings.controller';
import { AirportTransferBookingsService } from './airport-transfer-bookings.service';
import { PrismaModule } from '../prisma/prisma.module';
import { QrCodeModule } from '../qr-code/qr-code.module';

@Module({
    imports: [PrismaModule, QrCodeModule],
    controllers: [AirportTransferBookingsController],
    providers: [AirportTransferBookingsService],
    exports: [AirportTransferBookingsService],
})
export class AirportTransferBookingsModule { }
