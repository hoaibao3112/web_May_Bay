import { Module } from '@nestjs/common';
import { AdminController } from './admin.controller';
import { AdminService } from './admin.service';
import { AnalyticsService } from './analytics.service';
import { BusCompaniesController } from './bus-companies.controller';
import { FlightScheduleController } from './flight-schedule.controller';
import { FlightScheduleService } from './flight-schedule.service';
import { PrismaModule } from '../prisma/prisma.module';

@Module({
    imports: [PrismaModule],
    controllers: [AdminController, BusCompaniesController, FlightScheduleController],
    providers: [AdminService, AnalyticsService, FlightScheduleService],
})
export class AdminModule { }
