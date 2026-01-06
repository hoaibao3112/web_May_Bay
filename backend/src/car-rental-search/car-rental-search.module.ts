import { Module } from '@nestjs/common';
import { CarRentalSearchController } from './car-rental-search.controller';
import { CarRentalSearchService } from './car-rental-search.service';
import { PrismaModule } from '../prisma/prisma.module';

@Module({
    imports: [PrismaModule],
    controllers: [CarRentalSearchController],
    providers: [CarRentalSearchService],
    exports: [CarRentalSearchService],
})
export class CarRentalSearchModule { }
