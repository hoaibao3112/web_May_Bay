import { Module } from '@nestjs/common';
import { CarRentalBookingsController } from './car-rental-bookings.controller';
import { CarRentalBookingsService } from './car-rental-bookings.service';
import { PrismaModule } from '../prisma/prisma.module';
import { QrCodeModule } from '../qr-code/qr-code.module';

@Module({
    imports: [PrismaModule, QrCodeModule],
    controllers: [CarRentalBookingsController],
    providers: [CarRentalBookingsService],
    exports: [CarRentalBookingsService],
})
export class CarRentalBookingsModule { }
