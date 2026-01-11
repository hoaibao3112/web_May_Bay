import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class FlightScheduleService {
    constructor(private prisma: PrismaService) { }

    /**
     * Get flight schedules with passenger count
     */
    async getFlightSchedules(filters: {
        startDate?: string;
        endDate?: string;
        search?: string;
    }) {
        const where: any = {};

        // Date range filter (using gioDi) - validate dates first
        if (filters.startDate || filters.endDate) {
            where.gioDi = {};
            if (filters.startDate) {
                const startDate = new Date(filters.startDate);
                if (!isNaN(startDate.getTime())) {
                    where.gioDi.gte = startDate;
                }
            }
            if (filters.endDate) {
                const endDate = new Date(filters.endDate);
                if (!isNaN(endDate.getTime())) {
                    where.gioDi.lte = endDate;
                }
            }
            // Remove gioDi filter if both dates are invalid
            if (Object.keys(where.gioDi).length === 0) {
                delete where.gioDi;
            }
        }

        // Search filter
        if (filters.search) {
            where.OR = [
                {
                    chuyenBay: {
                        soHieuChuyenBay: { contains: filters.search },
                    },
                },
                {
                    sanBayDi: {
                        tenSanBay: { contains: filters.search },
                    },
                },
                {
                    sanBayDen: {
                        tenSanBay: { contains: filters.search },
                    },
                },
            ];
        }

        const schedules = await this.prisma.changBay.findMany({
            where,
            include: {
                chuyenBay: {
                    include: {
                        hang: true,
                    },
                },
                sanBayDi: true,
                sanBayDen: true,
            },
            orderBy: {
                gioDi: 'desc',
            },
        });

        // Get passenger count and booking count for each flight
        const schedulesWithPassengers = await Promise.all(
            schedules.map(async (schedule) => {
                // Count total bookings
                const bookingCount = await this.prisma.donDatVe.count({
                    where: {
                        changBayId: schedule.id,
                    },
                });

                // Count total passengers
                const passengerCount = await this.prisma.hanhKhach.count({
                    where: {
                        donDatVe: {
                            changBayId: schedule.id,
                        },
                    },
                });

                return {
                    ...schedule,
                    soLuongDat: bookingCount,
                    soLuongHanhKhach: passengerCount,
                };
            })
        );

        return schedulesWithPassengers;
    }

    /**
     * Get all passengers for a specific flight
     */
    async getFlightPassengers(changBayId: number) {
        // Get flight info
        const flight = await this.prisma.changBay.findUnique({
            where: { id: changBayId },
            include: {
                chuyenBay: {
                    include: {
                        hang: true,
                    },
                },
                sanBayDi: true,
                sanBayDen: true,
            },
        });

        if (!flight) {
            throw new Error('Flight not found');
        }

        // Get all passengers for this flight
        const passengers = await this.prisma.hanhKhach.findMany({
            where: {
                donDatVe: {
                    changBayId: changBayId,
                },
            },
            include: {
                donDatVe: {
                    include: {
                        nguoiDung: true,
                    },
                },
            },
            orderBy: {
                createdAt: 'desc',
            },
        });

        return {
            flight,
            passengers,
            totalPassengers: passengers.length,
        };
    }

    /**
     * Get detailed passenger information
     */
    async getPassengerDetails(passengerId: number) {
        const passenger = await this.prisma.hanhKhach.findUnique({
            where: { id: passengerId },
            include: {
                donDatVe: {
                    include: {
                        nguoiDung: true,
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
                        thanhToan: true,
                    },
                },
                ve: true,
                hanhLy: true,
            },
        });

        if (!passenger) {
            throw new Error('Passenger not found');
        }

        return passenger;
    }
}
