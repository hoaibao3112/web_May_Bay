import { Module } from '@nestjs/common';
import { AirportTransferReviewsController } from './airport-transfer-reviews.controller';
import { AirportTransferReviewsService } from './airport-transfer-reviews.service';
import { PrismaModule } from '../prisma/prisma.module';

@Module({
    imports: [PrismaModule],
    controllers: [AirportTransferReviewsController],
    providers: [AirportTransferReviewsService],
    exports: [AirportTransferReviewsService],
})
export class AirportTransferReviewsModule { }
