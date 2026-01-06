import { Module } from '@nestjs/common';
import { CarRentalBookingsController } from './car-rental-bookings.controller';
import { CarRentalBookingsService } from './car-rental-bookings.service';
import { PrismaModule } from '../prisma/prisma.module';

@Module({
    imports: [PrismaModule],
    controllers: [CarRentalBookingsController],
    providers: [CarRentalBookingsService],
    exports: [CarRentalBookingsService],
})
export class CarRentalBookingsModule { }
