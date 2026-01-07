import { Controller, Get, Query, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from '../auth/jwt.guard';
import { RolesGuard } from '../auth/roles.guard';
import { Roles } from '../auth/roles.decorator';
import { AdminService } from './admin.service';

@Controller('admin')
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles('ADMIN', 'OPERATOR')
export class AdminController {
    constructor(private readonly adminService: AdminService) { }

    @Get('stats')
    async getDashboardStats() {
        return this.adminService.getDashboardStats();
    }

    @Get('stats/revenue')
    async getRevenueStats(@Query() query: any) {
        return this.adminService.getRevenueStats(query);
    }

    @Get('stats/bookings')
    async getBookingStats(@Query() query: any) {
        return this.adminService.getBookingStats(query);
    }

    @Get('recent-activities')
    async getRecentActivities(@Query('limit') limit: number = 10) {
        return this.adminService.getRecentActivities(limit);
    }
}
