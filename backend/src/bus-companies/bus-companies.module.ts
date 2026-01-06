import { Module } from '@nestjs/common';
import { BusCompaniesService } from './bus-companies.service';
import { BusCompaniesController } from './bus-companies.controller';
import { PrismaModule } from '../prisma/prisma.module';

@Module({
    imports: [PrismaModule],
    controllers: [BusCompaniesController],
    providers: [BusCompaniesService],
    exports: [BusCompaniesService],
})
export class BusCompaniesModule { }
