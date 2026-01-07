import { Module } from '@nestjs/common';
import { AirportTransferCompaniesController } from './airport-transfer-companies.controller';
import { AirportTransferCompaniesService } from './airport-transfer-companies.service';
import { PrismaModule } from '../prisma/prisma.module';

@Module({
    imports: [PrismaModule],
    controllers: [AirportTransferCompaniesController],
    providers: [AirportTransferCompaniesService],
    exports: [AirportTransferCompaniesService],
})
export class AirportTransferCompaniesModule { }
