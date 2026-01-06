import { Module } from '@nestjs/common';
import { CarRentalCompaniesController } from './car-rental-companies.controller';
import { CarRentalCompaniesService } from './car-rental-companies.service';
import { PrismaModule } from '../prisma/prisma.module';

@Module({
    imports: [PrismaModule],
    controllers: [CarRentalCompaniesController],
    providers: [CarRentalCompaniesService],
    exports: [CarRentalCompaniesService],
})
export class CarRentalCompaniesModule { }
