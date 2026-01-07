'use client';

import { useEffect, useState } from 'react';
import {
    FiUsers, FiPackage, FiDollarSign, FiTrendingUp,
    FiCalendar, FiMapPin, FiTruck, FiHome
} from 'react-icons/fi';
import { getDashboardStats } from '@/lib/api';

export default function DashboardPage() {
    const [stats, setStats] = useState<any>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchStats();
    }, []);

    const fetchStats = async () => {
        try {
            // Mock data for now - replace with real API call
            setStats({
                totalUsers: 1247,
                totalBookings: 3856,
                totalRevenue: 12458900000,
                todayBookings: 127,
                flightBookings: 1520,
                busBookings: 842,
                carBookings: 645,
                hotelBookings: 849,
                recentBookings: [
                    { id: 1, code: 'FL001234', type: 'flight', customer: 'Nguyễn Văn A', amount: 4500000, status: 'completed', date: '2026-01-07' },
                    { id: 2, code: 'BUS00567', type: 'bus', customer: 'Trần Thị B', amount: 350000, status: 'pending', date: '2026-01-07' },
                    { id: 3, code: 'CAR00123', type: 'car', customer: 'Lê Văn C', amount: 1200000, status: 'completed', date: '2026-01-06' },
                    { id: 4, code: 'HTL00891', type: 'hotel', customer: 'Phạm Thị D', amount: 2800000, status: 'confirmed', date: '2026-01-06' },
                    { id: 5, code: 'FL001235', type: 'flight', customer: 'Hoàng Văn E', amount: 5600000, status: 'completed', date: '2026-01-06' },
                ]
            });
        } catch (error) {
            console.error('Error fetching stats:', error);
        } finally {
            setLoading(false);
        }
    };

    const formatCurrency = (amount: number) => {
        return new Intl.NumberFormat('vi-VN', {
            style: 'currency',
            currency: 'VND'
        }).format(amount);
    };

    const statCards = [
        {
            title: 'Tổng người dùng',
            value: stats?.totalUsers || 0,
            icon: FiUsers,
            color: 'blue',
            trend: '+12%',
            trendUp: true
        },
        {
            title: 'Tổng đặt chỗ',
            value: stats?.totalBookings || 0,
            icon: FiPackage,
            color: 'green',
            trend: '+8.5%',
            trendUp: true
        },
        {
            title: 'Doanh thu',
            value: formatCurrency(stats?.totalRevenue || 0),
            icon: FiDollarSign,
            color: 'purple',
            trend: '+15.3%',
            trendUp: true
        },
        {
            title: 'Đặt chỗ hôm nay',
            value: stats?.todayBookings || 0,
            icon: FiTrendingUp,
            color: 'orange',
            trend: '+5',
            trendUp: true
        },
    ];

    const bookingsByType = [
        { type: 'Vé máy bay', count: stats?.flightBookings || 0, icon: FiMapPin, color: 'bg-blue-500' },
        { type: 'Vé xe khách', count: stats?.busBookings || 0, icon: FiTruck, color: 'bg-green-500' },
        { type: 'Thuê xe', count: stats?.carBookings || 0, icon: FiTruck, color: 'bg-purple-500' },
        { type: 'Khách sạn', count: stats?.hotelBookings || 0, icon: FiHome, color: 'bg-orange-500' },
    ];

    const getStatusBadge = (status: string) => {
        const statusConfig: any = {
            completed: { label: 'Hoàn thành', class: 'bg-green-500/10 text-green-400' },
            pending: { label: 'Chờ xử lý', class: 'bg-yellow-500/10 text-yellow-400' },
            confirmed: { label: 'Đã xác nhận', class: 'bg-blue-500/10 text-blue-400' },
            cancelled: { label: 'Đã hủy', class: 'bg-red-500/10 text-red-400' },
        };
        const config = statusConfig[status] || statusConfig.pending;
        return (
            <span className={`px-2 py-1 rounded-full text-xs font-medium ${config.class}`}>
                {config.label}
            </span>
        );
    };

    const getTypeLabel = (type: string) => {
        const types: any = {
            flight: 'Máy bay',
            bus: 'Xe khách',
            car: 'Thuê xe',
            hotel: 'Khách sạn',
            transfer: 'Đưa đón'
        };
        return types[type] || type;
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-screen">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
            </div>
        );
    }

    return (
        <div className="space-y-6">
            {/* Page Header */}
            <div>
                <h1 className="text-3xl font-bold text-white mb-2">Dashboard</h1>
                <p className="text-slate-400">Tổng quan hệ thống quản lý</p>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {statCards.map((stat, idx) => {
                    const Icon = stat.icon;
                    const colorClasses: any = {
                        blue: 'from-blue-500 to-blue-600',
                        green: 'from-green-500 to-green-600',
                        purple: 'from-purple-500 to-purple-600',
                        orange: 'from-orange-500 to-orange-600',
                    };

                    return (
                        <div
                            key={idx}
                            className="bg-slate-900 border border-slate-800 rounded-xl p-6 hover:border-slate-700 transition-all duration-200 hover:shadow-xl hover:shadow-slate-900/50"
                        >
                            <div className="flex items-center justify-between mb-4">
                                <div className={`w-12 h-12 bg-gradient-to-br ${colorClasses[stat.color]} rounded-lg flex items-center justify-center shadow-lg`}>
                                    <Icon className="w-6 h-6 text-white" />
                                </div>
                                <span className={`text-sm font-medium ${stat.trendUp ? 'text-green-400' : 'text-red-400'}`}>
                                    {stat.trend}
                                </span>
                            </div>
                            <div className="text-2xl font-bold text-white mb-1">
                                {typeof stat.value === 'number' ? stat.value.toLocaleString() : stat.value}
                            </div>
                            <div className="text-sm text-slate-400">{stat.title}</div>
                        </div>
                    );
                })}
            </div>

            {/* Booking Types & Recent Bookings */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Booking by Type */}
                <div className="bg-slate-900 border border-slate-800 rounded-xl p-6">
                    <h2 className="text-lg font-semibold text-white mb-4">Đặt chỗ theo loại</h2>
                    <div className="space-y-4">
                        {bookingsByType.map((item, idx) => {
                            const Icon = item.icon;
                            return (
                                <div key={idx} className="flex items-center justify-between">
                                    <div className="flex items-center gap-3">
                                        <div className={`w-10 h-10 ${item.color} rounded-lg flex items-center justify-center`}>
                                            <Icon className="w-5 h-5 text-white" />
                                        </div>
                                        <span className="text-sm text-slate-300">{item.type}</span>
                                    </div>
                                    <span className="text-lg font-bold text-white">{item.count.toLocaleString()}</span>
                                </div>
                            );
                        })}
                    </div>
                </div>

                {/* Recent Bookings */}
                <div className="lg:col-span-2 bg-slate-900 border border-slate-800 rounded-xl p-6">
                    <div className="flex items-center justify-between mb-4">
                        <h2 className="text-lg font-semibold text-white">Đặt chỗ gần đây</h2>
                        <a href="/dashboard/bookings" className="text-sm text-blue-400 hover:text-blue-300">
                            Xem tất cả →
                        </a>
                    </div>
                    <div className="overflow-x-auto">
                        <table className="w-full">
                            <thead>
                                <tr className="text-left border-b border-slate-800">
                                    <th className="pb-3 text-xs font-medium text-slate-400 uppercase">Mã đơn</th>
                                    <th className="pb-3 text-xs font-medium text-slate-400 uppercase">Loại</th>
                                    <th className="pb-3 text-xs font-medium text-slate-400 uppercase">Khách hàng</th>
                                    <th className="pb-3 text-xs font-medium text-slate-400 uppercase text-right">Số tiền</th>
                                    <th className="pb-3 text-xs font-medium text-slate-400 uppercase">Trạng thái</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-800">
                                {stats?.recentBookings?.map((booking: any) => (
                                    <tr key={booking.id} className="hover:bg-slate-800/50">
                                        <td className="py-3 text-sm text-white font-medium">{booking.code}</td>
                                        <td className="py-3 text-sm text-slate-300">{getTypeLabel(booking.type)}</td>
                                        <td className="py-3 text-sm text-slate-300">{booking.customer}</td>
                                        <td className="py-3 text-sm text-white text-right font-medium">
                                            {formatCurrency(booking.amount)}
                                        </td>
                                        <td className="py-3">{getStatusBadge(booking.status)}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </div>
    );
}
