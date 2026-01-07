import { Module } from '@nestjs/common';
import { AirportTransferSearchController } from './airport-transfer-search.controller';
import { AirportTransferSearchService } from './airport-transfer-search.service';
import { PrismaModule } from '../prisma/prisma.module';

@Module({
    imports: [PrismaModule],
    controllers: [AirportTransferSearchController],
    providers: [AirportTransferSearchService],
    exports: [AirportTransferSearchService],
})
export class AirportTransferSearchModule { }
