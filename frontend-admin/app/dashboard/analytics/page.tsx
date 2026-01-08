'use client';

import { useEffect, useState } from 'react';
import {
    AreaChart,
    Area,
    PieChart,
    Pie,
    Cell,
    ResponsiveContainer,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    Legend,
} from 'recharts';
import { FiDollarSign, FiShoppingBag, FiUsers, FiTrendingUp } from 'react-icons/fi';

interface AnalyticsData {
    overview: {
        totalRevenue: number;
        totalBookings: number;
        totalUsers: number;
        avgBookingValue: number;
    };
    revenueByService: Array<{ service: string; revenue: number }>;
    bookingStats: Array<{ service: string; count: number }>;
    revenueTrends: Array<{ date: string; total: number }>;
    recentActivity: Array<{ type: string; code: string; amount: number; createdAt: string }>;
}

const COLORS = ['#3b82f6', '#10b981', '#f59e0b', '#8b5cf6', '#ef4444'];

export default function AnalyticsPage() {
    const [data, setData] = useState<AnalyticsData | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchAnalytics();
    }, []);

    const fetchAnalytics = async () => {
        try {
            setLoading(true);
            const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';
            const token = localStorage.getItem('adminToken');

            const response = await fetch(`${API_URL}/admin/analytics`, {
                headers: {
                    'Authorization': `Bearer ${token}`,
                },
            });

            if (!response.ok) {
                throw new Error('Failed to fetch analytics');
            }

            const result = await response.json();
            setData(result);
        } catch (error) {
            console.error('Error fetching analytics:', error);
            alert('Không thể tải dữ liệu thống kê');
        } finally {
            setLoading(false);
        }
    };

    const formatCurrency = (amount: number) => {
        return new Intl.NumberFormat('vi-VN', {
            style: 'currency',
            currency: 'VND',
        }).format(amount);
    };

    const formatNumber = (num: number) => {
        return new Intl.NumberFormat('vi-VN').format(num);
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-screen">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
            </div>
        );
    }

    if (!data) {
        return (
            <div className="flex items-center justify-center min-h-screen">
                <div className="text-slate-400">Không có dữ liệu thống kê</div>
            </div>
        );
    }

    return (
        <div className="space-y-6">
            {/* Header */}
            <div>
                <h1 className="text-3xl font-bold text-white">Thống kê & Phân tích</h1>
                <p className="text-slate-400 mt-1">Tổng quan và báo cáo kinh doanh</p>
            </div>

            {/* Overview Metrics */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {/* Total Revenue */}
                <div className="bg-slate-900 border border-slate-800 rounded-xl p-6">
                    <div className="flex items-center justify-between mb-4">
                        <div className="p-3 bg-blue-500/10 rounded-lg">
                            <FiDollarSign className="w-6 h-6 text-blue-400" />
                        </div>
                    </div>
                    <div className="text-2xl font-bold text-white mb-1">
                        {formatCurrency(data.overview.totalRevenue)}
                    </div>
                    <div className="text-sm text-slate-400">Tổng doanh thu</div>
                </div>

                {/* Total Bookings */}
                <div className="bg-slate-900 border border-slate-800 rounded-xl p-6">
                    <div className="flex items-center justify-between mb-4">
                        <div className="p-3 bg-green-500/10 rounded-lg">
                            <FiShoppingBag className="w-6 h-6 text-green-400" />
                        </div>
                    </div>
                    <div className="text-2xl font-bold text-white mb-1">
                        {formatNumber(data.overview.totalBookings)}
                    </div>
                    <div className="text-sm text-slate-400">Tổng đơn đặt</div>
                </div>

                {/* Total Users */}
                <div className="bg-slate-900 border border-slate-800 rounded-xl p-6">
                    <div className="flex items-center justify-between mb-4">
                        <div className="p-3 bg-purple-500/10 rounded-lg">
                            <FiUsers className="w-6 h-6 text-purple-400" />
                        </div>
                    </div>
                    <div className="text-2xl font-bold text-white mb-1">
                        {formatNumber(data.overview.totalUsers)}
                    </div>
                    <div className="text-sm text-slate-400">Người dùng</div>
                </div>

                {/* Avg Booking Value */}
                <div className="bg-slate-900 border border-slate-800 rounded-xl p-6">
                    <div className="flex items-center justify-between mb-4">
                        <div className="p-3 bg-orange-500/10 rounded-lg">
                            <FiTrendingUp className="w-6 h-6 text-orange-400" />
                        </div>
                    </div>
                    <div className="text-2xl font-bold text-white mb-1">
                        {formatCurrency(data.overview.avgBookingValue)}
                    </div>
                    <div className="text-sm text-slate-400">Giá trị TB/đơn</div>
                </div>
            </div>

            {/* Charts Row */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Revenue Trends */}
                <div className="bg-slate-900 border border-slate-800 rounded-xl p-6">
                    <h2 className="text-lg font-semibold text-white mb-4">Doanh thu 30 ngày qua</h2>
                    <ResponsiveContainer width="100%" height={300}>
                        <AreaChart data={data.revenueTrends}>
                            <defs>
                                <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                                    <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.3} />
                                    <stop offset="95%" stopColor="#3b82f6" stopOpacity={0} />
                                </linearGradient>
                            </defs>
                            <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
                            <XAxis dataKey="date" stroke="#94a3b8" tick={{ fill: '#94a3b8' }} />
                            <YAxis stroke="#94a3b8" tick={{ fill: '#94a3b8' }} />
                            <Tooltip
                                contentStyle={{
                                    backgroundColor: '#1e293b',
                                    border: '1px solid #334155',
                                    borderRadius: '8px',
                                }}
                                labelStyle={{ color: '#cbd5e1' }}
                            />
                            <Area
                                type="monotone"
                                dataKey="total"
                                stroke="#3b82f6"
                                fillOpacity={1}
                                fill="url(#colorRevenue)"
                            />
                        </AreaChart>
                    </ResponsiveContainer>
                </div>

                {/* Revenue by Service */}
                <div className="bg-slate-900 border border-slate-800 rounded-xl p-6">
                    <h2 className="text-lg font-semibold text-white mb-4">Doanh thu theo dịch vụ</h2>
                    <ResponsiveContainer width="100%" height={300}>
                        <PieChart>
                            <Pie
                                data={data.revenueByService}
                                cx="50%"
                                cy="50%"
                                labelLine={false}
                                label={({ service, percent }) => `${service}: ${(percent * 100).toFixed(0)}%`}
                                outerRadius={100}
                                fill="#8884d8"
                                dataKey="revenue"
                            >
                                {data.revenueByService.map((entry, index) => (
                                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                ))}
                            </Pie>
                            <Tooltip
                                contentStyle={{
                                    backgroundColor: '#1e293b',
                                    border: '1px solid #334155',
                                    borderRadius: '8px',
                                }}
                                formatter={(value: number) => formatCurrency(value)}
                            />
                        </PieChart>
                    </ResponsiveContainer>
                </div>
            </div>

            {/* Booking Statistics Table */}
            <div className="bg-slate-900 border border-slate-800 rounded-xl p-6">
                <h2 className="text-lg font-semibold text-white mb-4">Thống kê đặt chỗ</h2>
                <div className="overflow-x-auto">
                    <table className="w-full">
                        <thead>
                            <tr className="border-b border-slate-800">
                                <th className="text-left py-3 px-4 text-slate-400 font-medium">Dịch vụ</th>
                                <th className="text-right py-3 px-4 text-slate-400 font-medium">Số đơn</th>
                                <th className="text-right py-3 px-4 text-slate-400 font-medium">Doanh thu</th>
                            </tr>
                        </thead>
                        <tbody>
                            {data.bookingStats.map((stat, index) => {
                                const revenue = data.revenueByService.find(r => r.service === stat.service);
                                return (
                                    <tr key={index} className="border-b border-slate-800/50">
                                        <td className="py-3 px-4 text-white">{stat.service}</td>
                                        <td className="py-3 px-4 text-right text-white">{formatNumber(stat.count)}</td>
                                        <td className="py-3 px-4 text-right text-white">
                                            {formatCurrency(revenue?.revenue || 0)}
                                        </td>
                                    </tr>
                                );
                            })}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Recent Activity */}
            <div className="bg-slate-900 border border-slate-800 rounded-xl p-6">
                <h2 className="text-lg font-semibold text-white mb-4">Hoạt động gần đây</h2>
                <div className="space-y-3">
                    {data.recentActivity.map((activity: any, index) => (
                        <div key={index} className="flex items-center justify-between p-3 bg-slate-800 rounded-lg">
                            <div className="flex items-center gap-3">
                                <div className={`px-2 py-1 rounded text-xs font-medium ${activity.type === 'Flight' ? 'bg-blue-500/10 text-blue-400' :
                                        activity.type === 'Bus' ? 'bg-green-500/10 text-green-400' :
                                            activity.type === 'Car' ? 'bg-purple-500/10 text-purple-400' :
                                                'bg-orange-500/10 text-orange-400'
                                    }`}>
                                    {activity.type}
                                </div>
                                <div>
                                    <div className="text-white font-medium">{activity.code}</div>
                                    <div className="text-sm text-slate-400">
                                        {new Date(activity.createdAt).toLocaleString('vi-VN')}
                                    </div>
                                </div>
                            </div>
                            <div className="text-white font-semibold">{formatCurrency(Number(activity.amount))}</div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}
