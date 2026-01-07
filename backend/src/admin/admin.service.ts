import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class AdminService {
    constructor(private prisma: PrismaService) { }

    async getDashboardStats() {
        // Get total users
        const totalUsers = await this.prisma.user.count();

        // Get total bookings across all types
        const [flightBookings, busBookings, carBookings, hotelBookings] = await Promise.all([
            this.prisma.donDatVe.count(),
            this.prisma.donDatVeXe.count(),
            this.prisma.donThueXe.count(),
            this.prisma.datPhong.count(),
        ]);

        const totalBookings = flightBookings + busBookings + carBookings + hotelBookings;

        // Get today's bookings
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        const tomorrow = new Date(today);
        tomorrow.setDate(tomorrow.getDate() + 1);

        const todayBookings = await Promise.all([
            this.prisma.donDatVe.count({
                where: {
                    createdAt: {
                        gte: today,
                        lt: tomorrow,
                    },
                },
            }),
            this.prisma.donDatVeXe.count({
                where: {
                    createdAt: {
                        gte: today,
                        lt: tomorrow,
                    },
                },
            }),
            this.prisma.donThueXe.count({
                where: {
                    createdAt: {
                        gte: today,
                        lt: tomorrow,
                    },
                },
            }),
            this.prisma.datPhong.count({
                where: {
                    createdAt: {
                        gte: today,
                        lt: tomorrow,
                    },
                },
            }),
        ]);

        const todayTotal = todayBookings.reduce((sum, count) => sum + count, 0);

        // Calculate total revenue (from completed/paid bookings)
        const [flightRevenue, busRevenue, carRevenue, hotelRevenue] = await Promise.all([
            this.prisma.donDatVe.aggregate({
                where: {
                    trangThai: 'DA_THANH_TOAN',
                },
                _sum: {
                    tongTien: true,
                },
            }),
            this.prisma.donDatVeXe.aggregate({
                where: {
                    trangThaiDat: 'DA_THANH_TOAN',
                },
                _sum: {
                    tongTien: true,
                },
            }),
            this.prisma.donThueXe.aggregate({
                where: {
                    trangThai: 'HOAN_THANH',
                },
                _sum: {
                    tongTien: true,
                },
            }),
            this.prisma.datPhong.aggregate({
                where: {
                    trangThai: 'DA_CHECKOUT',
                },
                _sum: {
                    tongTien: true,
                },
            }),
        ]);

        const totalRevenue =
            Number(flightRevenue._sum.tongTien || 0) +
            Number(busRevenue._sum.tongTien || 0) +
            Number(carRevenue._sum.tongTien || 0) +
            Number(hotelRevenue._sum.tongTien || 0);

        // Get recent bookings
        const recentFlightBookings = await this.prisma.donDatVe.findMany({
            take: 5,
            orderBy: { createdAt: 'desc' },
            include: {
                nguoiDung: {
                    select: {
                        hoTen: true,
                        email: true,
                    },
                },
                changBay: {
                    include: {
                        chuyenBay: {
                            include: {
                                hang: true,
                            },
                        },
                        sanBayDi: true,
                        sanBayDen: true,
                    },
                },
            },
        });

        const recentBookings = recentFlightBookings.map((booking) => ({
            id: booking.id,
            code: booking.maDatVe,
            type: 'flight',
            customer: booking.nguoiDung?.hoTen || 'Guest',
            customerEmail: booking.nguoiDung?.email || '',
            service: `${booking.changBay.chuyenBay.soHieuChuyenBay} ${booking.changBay.sanBayDi.maSanBay}-${booking.changBay.sanBayDen.maSanBay}`,
            amount: Number(booking.tongTien),
            status: booking.trangThai,
            date: booking.createdAt,
        }));

        return {
            totalUsers,
            totalBookings,
            todayBookings: todayTotal,
            totalRevenue,
            flightBookings,
            busBookings,
            carBookings,
            hotelBookings,
            recentBookings,
        };
    }

    async getRevenueStats(query: any) {
        // Get revenue by month for the last 6 months
        const sixMonthsAgo = new Date();
        sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 6);

        const flightRevenue = await this.prisma.donDatVe.groupBy({
            by: ['createdAt'],
            where: {
                trangThai: 'DA_THANH_TOAN',
                createdAt: {
                    gte: sixMonthsAgo,
                },
            },
            _sum: {
                tongTien: true,
            },
        });

        return {
            flightRevenue,
        };
    }

    async getBookingStats(query: any) {
        const thirtyDaysAgo = new Date();
        thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

        const bookingsByDay = await this.prisma.donDatVe.groupBy({
            by: ['createdAt'],
            where: {
                createdAt: {
                    gte: thirtyDaysAgo,
                },
            },
            _count: true,
        });

        return {
            bookingsByDay,
        };
    }

    async getRecentActivities(limit: number) {
        // Get recent bookings, users, payments
        const [recentBookings, recentUsers, recentPayments] = await Promise.all([
            this.prisma.donDatVe.findMany({
                take: limit,
                orderBy: { createdAt: 'desc' },
                include: {
                    nguoiDung: {
                        select: {
                            hoTen: true,
                        },
                    },
                },
            }),
            this.prisma.user.findMany({
                take: 5,
                orderBy: { createdAt: 'desc' },
            }),
            this.prisma.thanhToan.findMany({
                take: 5,
                orderBy: { createdAt: 'desc' },
                include: {
                    donDatVe: {
                        select: {
                            maDatVe: true,
                        },
                    },
                },
            }),
        ]);

        return {
            recentBookings: recentBookings.map((b) => ({
                type: 'booking',
                description: `${b.nguoiDung?.hoTen} đã đặt vé ${b.maDatVe}`,
                timestamp: b.createdAt,
            })),
            recentUsers: recentUsers.map((u) => ({
                type: 'user',
                description: `Người dùng mới: ${u.hoTen}`,
                timestamp: u.createdAt,
            })),
            recentPayments: recentPayments.map((p) => ({
                type: 'payment',
                description: `Thanh toán cho ${p.donDatVe.maDatVe}: ${p.soTien} VND`,
                timestamp: p.createdAt,
            })),
        };
    }
}
