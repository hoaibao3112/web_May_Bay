import { Module } from '@nestjs/common';
import { BusReviewsService } from './bus-reviews.service';
import { BusReviewsController } from './bus-reviews.controller';
import { PrismaModule } from '../prisma/prisma.module';

@Module({
    imports: [PrismaModule],
    controllers: [BusReviewsController],
    providers: [BusReviewsService],
    exports: [BusReviewsService],
})
export class BusReviewsModule { }
