import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class AnalyticsService {
    constructor(private prisma: PrismaService) { }

    async getAnalytics() {
        // Get overview metrics
        const overview = await this.getOverviewMetrics();

        // Get revenue by service type
        const revenueByService = await this.getRevenueByService();

        // Get booking statistics
        const bookingStats = await this.getBookingStatistics();

        // Get revenue trends (last 30 days)
        const revenueTrends = await this.getRevenueTrends();

        // Get recent activity
        const recentActivity = await this.getRecentActivity();

        return {
            overview,
            revenueByService,
            bookingStats,
            revenueTrends,
            recentActivity,
        };
    }

    private async getOverviewMetrics() {
        // Total users
        const totalUsers = await this.prisma.user.count();

        // Total bookings - using direct Prisma count
        const flightBookings = await this.prisma.donDatVe.count();
        const busBookings = await this.prisma.donDatVeXe.count();
        const carBookings = await this.prisma.donThueXe.count();

        // Transfer bookings using raw SQL
        const transferResult: any[] = await this.prisma.$queryRaw`
      SELECT COUNT(*) as count FROM dat_dich_vu_dua_don
    `;
        const transferBookings = Number(transferResult[0]?.count || 0);

        const totalBookings = flightBookings + busBookings + carBookings + transferBookings;

        // Total revenue
        const flightRevenue = await this.prisma.donDatVe.aggregate({ _sum: { tongTien: true } });
        const busRevenue = await this.prisma.donDatVeXe.aggregate({ _sum: { tongTien: true } });
        const carRevenue = await this.prisma.donThueXe.aggregate({ _sum: { tongTien: true } });

        const transferRevResult: any[] = await this.prisma.$queryRaw`
      SELECT SUM(tongTien) as total FROM dat_dich_vu_dua_don
    `;
        const transferRev = Number(transferRevResult[0]?.total || 0);

        const totalRevenue =
            Number(flightRevenue._sum.tongTien || 0) +
            Number(busRevenue._sum.tongTien || 0) +
            Number(carRevenue._sum.tongTien || 0) +
            transferRev;

        const avgBookingValue = totalBookings > 0 ? totalRevenue / totalBookings : 0;

        return {
            totalUsers,
            totalBookings,
            totalRevenue,
            avgBookingValue,
        };
    }

    private async getRevenueByService() {
        const flightRevenue = await this.prisma.donDatVe.aggregate({ _sum: { tongTien: true } });
        const busRevenue = await this.prisma.donDatVeXe.aggregate({ _sum: { tongTien: true } });
        const carRevenue = await this.prisma.donThueXe.aggregate({ _sum: { tongTien: true } });

        const transferResult: any[] = await this.prisma.$queryRaw`
      SELECT SUM(tongTien) as total FROM dat_dich_vu_dua_don
    `;
        const transferRev = Number(transferResult[0]?.total || 0);

        return [
            { service: 'Vé máy bay', revenue: Number(flightRevenue._sum.tongTien || 0) },
            { service: 'Vé xe khách', revenue: Number(busRevenue._sum.tongTien || 0) },
            { service: 'Thuê xe', revenue: Number(carRevenue._sum.tongTien || 0) },
            { service: 'Đưa đón sân bay', revenue: transferRev },
        ];
    }

    private async getBookingStatistics() {
        const flightBookings = await this.prisma.donDatVe.count();
        const busBookings = await this.prisma.donDatVeXe.count();
        const carBookings = await this.prisma.donThueXe.count();

        const transferResult: any[] = await this.prisma.$queryRaw`
      SELECT COUNT(*) as count FROM dat_dich_vu_dua_don
    `;
        const transferBookings = Number(transferResult[0]?.count || 0);

        return [
            { service: 'Vé máy bay', count: flightBookings },
            { service: 'Vé xe khách', count: busBookings },
            { service: 'Thuê xe', count: carBookings },
            { service: 'Đưa đón sân bay', count: transferBookings },
        ];
    }

    private async getRevenueTrends() {
        const thirtyDaysAgo = new Date();
        thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

        // Get daily revenue for each service type
        const flights = await this.prisma.$queryRaw`
      SELECT DATE(createdAt) as date, SUM(tongTien) as revenue
      FROM don_dat_ve
      WHERE createdAt >= ${thirtyDaysAgo}
      GROUP BY DATE(createdAt)
      ORDER BY date ASC
    `;

        const buses = await this.prisma.$queryRaw`
      SELECT DATE(createdAt) as date, SUM(tongTien) as revenue
      FROM don_dat_ve_xe
      WHERE createdAt >= ${thirtyDaysAgo}
      GROUP BY DATE(createdAt)
      ORDER BY date ASC
    `;

        const cars = await this.prisma.$queryRaw`
      SELECT DATE(createdAt) as date, SUM(tongTien) as revenue
      FROM don_thue_xe
      WHERE createdAt >= ${thirtyDaysAgo}
      GROUP BY DATE(createdAt)
      ORDER BY date ASC
    `;

        const transfers = await this.prisma.$queryRaw`
      SELECT DATE(createdAt) as date, SUM(tongTien) as revenue
      FROM dat_dich_vu_dua_don
      WHERE createdAt >= ${thirtyDaysAgo}
      GROUP BY DATE(createdAt)
      ORDER BY date ASC
    `;

        // Merge and format
        const revenueMap = new Map();

        const addToMap = (data: any[], service: string) => {
            data.forEach((item: any) => {
                const dateStr = item.date.toISOString().split('T')[0];
                if (!revenueMap.has(dateStr)) {
                    revenueMap.set(dateStr, { date: dateStr, total: 0 });
                }
                const entry = revenueMap.get(dateStr);
                entry.total += Number(item.revenue || 0);
                entry[service] = Number(item.revenue || 0);
            });
        };

        addToMap(flights as any[], 'flights');
        addToMap(buses as any[], 'buses');
        addToMap(cars as any[], 'cars');
        addToMap(transfers as any[], 'transfers');

        return Array.from(revenueMap.values()).sort((a, b) =>
            a.date.localeCompare(b.date)
        );
    }

    private async getRecentActivity() {
        const recentBookings = await this.prisma.$queryRaw`
      SELECT 'Flight' as type, CAST(maDatVe AS CHAR) COLLATE utf8mb4_unicode_ci as code, tongTien as amount, createdAt
      FROM don_dat_ve
      UNION ALL
      SELECT 'Bus' as type, CAST(maDonDat AS CHAR) COLLATE utf8mb4_unicode_ci as code, tongTien as amount, createdAt
      FROM don_dat_ve_xe
      UNION ALL
      SELECT 'Car' as type, CAST(maDonThue AS CHAR) COLLATE utf8mb4_unicode_ci as code, tongTien as amount, createdAt
      FROM don_thue_xe
      UNION ALL
      SELECT 'Transfer' as type, CAST(id AS CHAR) COLLATE utf8mb4_unicode_ci as code, tongTien as amount, createdAt
      FROM dat_dich_vu_dua_don
      ORDER BY createdAt DESC
      LIMIT 10
    `;

        return recentBookings;
    }
}
