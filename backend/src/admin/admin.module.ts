import { Module } from '@nestjs/common';
import { AdminController } from './admin.controller';
import { AdminService } from './admin.service';
import { AnalyticsService } from './analytics.service';
import { BusCompaniesController } from './bus-companies.controller';
import { PrismaModule } from '../prisma/prisma.module';

@Module({
    imports: [PrismaModule],
    controllers: [AdminController, BusCompaniesController],
    providers: [AdminService, AnalyticsService],
})
export class AdminModule { }
