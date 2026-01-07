'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { FiSearch, FiFilter, FiPackage } from 'react-icons/fi';

export default function CarBookingsPage() {
    const router = useRouter();
    const [bookings, setBookings] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [statusFilter, setStatusFilter] = useState('ALL');
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 10;

    useEffect(() => {
        fetchCarBookings();
    }, []);

    const fetchCarBookings = async () => {
        try {
            setLoading(true);
            const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';
            const token = localStorage.getItem('adminToken');

            // For now using mock data - replace with real API call
            const mockData = [
                { id: 1, maDonThue: 'CAR00123', customer: 'Phạm Thị D', customerEmail: 'phamthid@example.com', car: 'Toyota Vios - 4 chỗ', tongTien: 1200000, trangThai: 'DA_XAC_NHAN', createdAt: '2026-01-06T16:45:00', soNgayThue: 2 },
                { id: 2, maDonThue: 'CAR00124', customer: 'Nguyễn Văn F', customerEmail: 'nguyenvanf@example.com', car: 'Honda City - 5 chỗ', tongTien: 1500000, trangThai: 'CHO_XAC_NHAN', createdAt: '2026-01-07T08:30:00', soNgayThue: 3 },
                { id: 3, maDonThue: 'CAR00125', customer: 'Trần Thị G', customerEmail: 'tranthig@example.com', car: 'Ford Ranger - 7 chỗ', tongTien: 2400000, trangThai: 'DANG_PHUC_VU', createdAt: '2026-01-05T14:20:00', soNgayThue: 4 },
                { id: 4, maDonThue: 'CAR00126', customer: 'Lê Văn H', customerEmail: 'levanh@example.com', car: 'Mazda 3 - 4 chỗ', tongTien: 1350000, trangThai: 'HOAN_THANH', createdAt: '2026-01-03T10:15:00', soNgayThue: 2 },
                { id: 5, maDonThue: 'CAR00127', customer: 'Hoàng Thị I', customerEmail: 'hoangthii@example.com', car: 'Hyundai Accent - 5 chỗ', tongTien: 1100000, trangThai: 'DA_HUY', createdAt: '2026-01-04T13:40:00', soNgayThue: 1 },
            ];

            setBookings(mockData);
        } catch (error) {
            console.error('Error fetching car bookings:', error);
        } finally {
            setLoading(false);
        }
    };

    const filteredBookings = bookings.filter(booking => {
        const matchesSearch = booking.maDonThue.toLowerCase().includes(searchTerm.toLowerCase()) ||
            booking.customer.toLowerCase().includes(searchTerm.toLowerCase()) ||
            booking.car.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesStatus = statusFilter === 'ALL' || booking.trangThai === statusFilter;
        return matchesSearch && matchesStatus;
    });

    const totalPages = Math.ceil(filteredBookings.length / itemsPerPage);
    const paginatedBookings = filteredBookings.slice(
        (currentPage - 1) * itemsPerPage,
        currentPage * itemsPerPage
    );

    const getStatusBadge = (status: string) => {
        const statusConfig: any = {
            CHO_XAC_NHAN: { label: 'Chờ xác nhận', class: 'bg-yellow-500/10 text-yellow-400' },
            DA_XAC_NHAN: { label: 'Đã xác nhận', class: 'bg-blue-500/10 text-blue-400' },
            DANG_PHUC_VU: { label: 'Đang phục vụ', class: 'bg-purple-500/10 text-purple-400' },
            HOAN_THANH: { label: 'Hoàn thành', class: 'bg-green-500/10 text-green-400' },
            DA_HUY: { label: 'Đã hủy', class: 'bg-red-500/10 text-red-400' },
        };
        const config = statusConfig[status] || { label: status, class: 'bg-slate-500/10 text-slate-400' };
        return (
            <span className={`px-2 py-1 rounded-full text-xs font-medium ${config.class}`}>
                {config.label}
            </span>
        );
    };

    const formatCurrency = (amount: number) => {
        return new Intl.NumberFormat('vi-VN', {
            style: 'currency',
            currency: 'VND'
        }).format(amount);
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
            {/* Header */}
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-bold text-white flex items-center gap-3">
                        <FiPackage className="text-blue-400" />
                        Quản lý thuê xe
                    </h1>
                    <p className="text-slate-400 mt-1">Tổng số: {bookings.length} đơn thuê</p>
                </div>
            </div>

            {/* Filters */}
            <div className="bg-slate-900 border border-slate-800 rounded-xl p-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="relative">
                        <FiSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                        <input
                            type="text"
                            placeholder="Tìm kiếm theo mã, tên khách hàng, loại xe..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="w-full pl-10 pr-4 py-2 bg-slate-800 border border-slate-700 rounded-lg text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                    </div>
                    <div className="relative">
                        <FiFilter className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                        <select
                            value={statusFilter}
                            onChange={(e) => setStatusFilter(e.target.value)}
                            className="w-full pl-10 pr-4 py-2 bg-slate-800 border border-slate-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                        >
                            <option value="ALL">Tất cả trạng thái</option>
                            <option value="CHO_XAC_NHAN">Chờ xác nhận</option>
                            <option value="DA_XAC_NHAN">Đã xác nhận</option>
                            <option value="DANG_PHUC_VU">Đang phục vụ</option>
                            <option value="HOAN_THANH">Hoàn thành</option>
                            <option value="DA_HUY">Đã hủy</option>
                        </select>
                    </div>
                </div>
            </div>

            {/* Table */}
            <div className="bg-slate-900 border border-slate-800 rounded-xl overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full">
                        <thead className="bg-slate-800">
                            <tr>
                                <th className="px-6 py-4 text-left text-xs font-medium text-slate-400 uppercase">Mã đơn</th>
                                <th className="px-6 py-4 text-left text-xs font-medium text-slate-400 uppercase">Khách hàng</th>
                                <th className="px-6 py-4 text-left text-xs font-medium text-slate-400 uppercase">Loại xe</th>
                                <th className="px-6 py-4 text-left text-xs font-medium text-slate-400 uppercase">Số ngày</th>
                                <th className="px-6 py-4 text-left text-xs font-medium text-slate-400 uppercase">Số tiền</th>
                                <th className="px-6 py-4 text-left text-xs font-medium text-slate-400 uppercase">Trạng thái</th>
                                <th className="px-6 py-4 text-left text-xs font-medium text-slate-400 uppercase">Ngày đặt</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-800">
                            {paginatedBookings.map((booking) => (
                                <tr
                                    key={booking.id}
                                    onClick={() => router.push(`/dashboard/bookings/cars/${booking.id}`)}
                                    className="hover:bg-slate-800/50 transition-colors cursor-pointer"
                                >
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <div className="text-sm font-medium text-white">{booking.maDonThue}</div>
                                    </td>
                                    <td className="px-6 py-4">
                                        <div className="text-sm font-medium text-white">{booking.customer}</div>
                                        <div className="text-xs text-slate-400">{booking.customerEmail}</div>
                                    </td>
                                    <td className="px-6 py-4">
                                        <div className="text-sm text-slate-300">{booking.car}</div>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <div className="text-sm text-slate-300">{booking.soNgayThue} ngày</div>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <div className="text-sm font-medium text-white">{formatCurrency(booking.tongTien)}</div>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        {getStatusBadge(booking.trangThai)}
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-300">
                                        {new Date(booking.createdAt).toLocaleString('vi-VN')}
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>

                {/* Pagination */}
                <div className="px-6 py-4 border-t border-slate-800 flex items-center justify-between">
                    <div className="text-sm text-slate-400">
                        Hiển thị {Math.min((currentPage - 1) * itemsPerPage + 1, filteredBookings.length)} - {Math.min(currentPage * itemsPerPage, filteredBookings.length)} trong tổng số {filteredBookings.length} đơn thuê
                    </div>
                    <div className="flex items-center gap-2">
                        <button
                            onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                            disabled={currentPage === 1}
                            className="px-3 py-1 bg-slate-800 border border-slate-700 rounded-lg text-sm text-slate-300 hover:bg-slate-700 disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            Trước
                        </button>
                        <span className="px-3 py-1 text-sm text-slate-300">
                            Trang {currentPage} / {totalPages}
                        </span>
                        <button
                            onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                            disabled={currentPage === totalPages}
                            className="px-3 py-1 bg-slate-800 border border-slate-700 rounded-lg text-sm text-slate-300 hover:bg-slate-700 disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            Sau
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}
