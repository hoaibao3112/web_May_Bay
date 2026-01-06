import { Module } from '@nestjs/common';
import { BusSearchService } from './bus-search.service';
import { BusSearchController } from './bus-search.controller';
import { PrismaModule } from '../prisma/prisma.module';

@Module({
    imports: [PrismaModule],
    controllers: [BusSearchController],
    providers: [BusSearchService],
    exports: [BusSearchService],
})
export class BusSearchModule { }
