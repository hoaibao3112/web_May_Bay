import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { TrangThaiDonDatVe } from '@prisma/client';

@Injectable()
export class StatisticsService {
  constructor(private prisma: PrismaService) {}

  // Thống kê tổng quan
  async getOverview(startDate?: string, endDate?: string) {
    const whereCondition: any = {
      trangThai: 'DA_THANH_TOAN',
    };

    if (startDate && endDate) {
      whereCondition.createdAt = {
        gte: new Date(startDate),
        lte: new Date(endDate),
      };
    }

    const [totalBookings, totalRevenue, totalPassengers, canceledBookings] = await Promise.all([
      this.prisma.donDatVe.count({ where: whereCondition }),
      this.prisma.donDatVe.aggregate({
        where: whereCondition,
        _sum: { tongTien: true },
      }),
      this.prisma.hanhKhach.count({
        where: { donDatVe: whereCondition },
      }),
      this.prisma.donDatVe.count({
        where: { trangThai: TrangThaiDonDatVe.HUY },
      }),
    ]);

    return {
      tongSoDonDatVe: totalBookings,
      tongDoanhThu: totalRevenue._sum.tongTien || 0,
      tongSoHanhKhach: totalPassengers,
      soDonBiHuy: canceledBookings,
    };
  }

  // Thống kê doanh thu theo thời gian
  async getRevenue(startDate: string, endDate: string, groupBy: 'day' | 'month' | 'year') {
    const bookings = await this.prisma.donDatVe.findMany({
      where: {
        trangThai: 'DA_THANH_TOAN',
        createdAt: {
          gte: new Date(startDate),
          lte: new Date(endDate),
        },
      },
      select: {
        createdAt: true,
        tongTien: true,
      },
    });

    // Group by time period
    const revenueMap = new Map<string, number>();
    
    bookings.forEach((booking) => {
      const date = new Date(booking.createdAt);
      let key: string;

      if (groupBy === 'day') {
        key = date.toISOString().split('T')[0];
      } else if (groupBy === 'month') {
        key = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;
      } else {
        key = String(date.getFullYear());
      }

      const currentRevenue = revenueMap.get(key) || 0;
      revenueMap.set(key, currentRevenue + Number(booking.tongTien));
    });

    return Array.from(revenueMap.entries()).map(([period, revenue]) => ({
      period,
      revenue,
    }));
  }

  // Thống kê hạng vé phổ biến
  async getPopularClasses() {
    const stats = await this.prisma.donDatVe.groupBy({
      by: ['hangVeId'],
      where: {
        trangThai: 'DA_THANH_TOAN',
      },
      _count: true,
      _sum: {
        tongTien: true,
      },
    });

    const result = await Promise.all(
      stats.map(async (stat) => {
        const hangVe = await this.prisma.hangVe.findUnique({
          where: { id: stat.hangVeId },
          include: { khoangVe: true },
        });

        return {
          hangVeId: stat.hangVeId,
          tenHangVe: hangVe?.tenHang,
          khoangVe: hangVe?.khoangVe.tenKhoang,
          soLuongDat: stat._count,
          tongDoanhThu: stat._sum.tongTien || 0,
        };
      }),
    );

    return result.sort((a, b) => b.soLuongDat - a.soLuongDat);
  }

  // Thống kê tuyến bay phổ biến
  async getPopularRoutes(limit: number) {
    const stats = await this.prisma.donDatVe.groupBy({
      by: ['changBayId'],
      where: {
        trangThai: 'DA_THANH_TOAN',
      },
      _count: true,
      _sum: {
        tongTien: true,
      },
    });

    const result = await Promise.all(
      stats.map(async (stat) => {
        const changBay = await this.prisma.changBay.findUnique({
          where: { id: stat.changBayId },
          include: {
            chuyenBay: {
              include: { hang: true },
            },
            sanBayDi: {
              include: { quocGia: true },
            },
            sanBayDen: {
              include: { quocGia: true },
            },
          },
        });

        return {
          changBayId: stat.changBayId,
          soHieuChuyenBay: changBay?.chuyenBay.soHieuChuyenBay,
          hangHangKhong: changBay?.chuyenBay.hang.tenHang,
          tuyen: `${changBay?.sanBayDi.maIata} → ${changBay?.sanBayDen.maIata}`,
          diemDi: changBay?.sanBayDi.tenSanBay,
          diemDen: changBay?.sanBayDen.tenSanBay,
          soLuongDat: stat._count,
          tongDoanhThu: stat._sum.tongTien || 0,
        };
      }),
    );

    return result.sort((a, b) => b.soLuongDat - a.soLuongDat).slice(0, limit);
  }

  // Thống kê hãng hàng không
  async getAirlineStats() {
    const bookings = await this.prisma.donDatVe.findMany({
      where: {
        trangThai: 'DA_THANH_TOAN',
      },
      include: {
        changBay: {
          include: {
            chuyenBay: {
              include: { hang: true },
            },
          },
        },
      },
    });

    const airlineMap = new Map<number, { name: string; code: string; count: number; revenue: number }>();

    bookings.forEach((booking) => {
      const hang = booking.changBay.chuyenBay.hang;
      const current = airlineMap.get(hang.id) || {
        name: hang.tenHang,
        code: hang.maIata,
        count: 0,
        revenue: 0,
      };

      current.count += 1;
      current.revenue += Number(booking.tongTien);
      airlineMap.set(hang.id, current);
    });

    return Array.from(airlineMap.values()).sort((a, b) => b.count - a.count);
  }

  // Thống kê theo thành phố
  async getCityStats() {
    const bookings = await this.prisma.donDatVe.findMany({
      where: {
        trangThai: 'DA_THANH_TOAN',
      },
      include: {
        changBay: {
          include: {
            sanBayDi: true,
            sanBayDen: true,
          },
        },
      },
    });

    const cityMap = new Map<string, { count: number; revenue: number }>();

    bookings.forEach((booking) => {
      const diemDi = booking.changBay.sanBayDi.thanhPho;
      const diemDen = booking.changBay.sanBayDen.thanhPho;

      // Count departures
      const currentDi = cityMap.get(diemDi) || { count: 0, revenue: 0 };
      currentDi.count += 1;
      currentDi.revenue += Number(booking.tongTien) / 2;
      cityMap.set(diemDi, currentDi);

      // Count arrivals
      const currentDen = cityMap.get(diemDen) || { count: 0, revenue: 0 };
      currentDen.count += 1;
      currentDen.revenue += Number(booking.tongTien) / 2;
      cityMap.set(diemDen, currentDen);
    });

    return Array.from(cityMap.entries())
      .map(([city, stats]) => ({
        thanhPho: city,
        soChuyenBay: stats.count,
        doanhThu: stats.revenue,
      }))
      .sort((a, b) => b.soChuyenBay - a.soChuyenBay);
  }
}
