import { Module } from '@nestjs/common';
import { CarRentalReviewsController } from './car-rental-reviews.controller';
import { CarRentalReviewsService } from './car-rental-reviews.service';
import { PrismaModule } from '../prisma/prisma.module';

@Module({
    imports: [PrismaModule],
    controllers: [CarRentalReviewsController],
    providers: [CarRentalReviewsService],
    exports: [CarRentalReviewsService],
})
export class CarRentalReviewsModule { }
