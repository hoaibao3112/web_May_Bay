import { Module } from '@nestjs/common';
import { BusStationsService } from './bus-stations.service';
import { BusStationsController } from './bus-stations.controller';
import { PrismaModule } from '../prisma/prisma.module';

@Module({
    imports: [PrismaModule],
    controllers: [BusStationsController],
    providers: [BusStationsService],
    exports: [BusStationsService],
})
export class BusStationsModule { }
