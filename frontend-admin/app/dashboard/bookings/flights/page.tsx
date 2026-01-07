'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { FiSearch, FiFilter, FiSend } from 'react-icons/fi';

export default function FlightBookingsPage() {
    const router = useRouter();
    const [bookings, setBookings] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [statusFilter, setStatusFilter] = useState('ALL');
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 10;

    useEffect(() => {
        fetchFlightBookings();
    }, []);

    const fetchFlightBookings = async () => {
        try {
            setLoading(true);
            const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';
            const token = localStorage.getItem('adminToken');

            // For now using mock data - replace with real API call
            const mockData = [
                { id: 1, maDatVe: 'FL001234', customer: 'Nguyễn Văn A', customerEmail: 'nguyenvana@example.com', flight: 'VN123 SGN-HAN', tongTien: 4500000, trangThai: 'DA_THANH_TOAN', createdAt: '2026-01-07T10:30:00' },
                { id: 2, maDatVe: 'FL001235', customer: 'Trần Thị B', customerEmail: 'tranthib@example.com', flight: 'VJ456 HAN-DAD', tongTien: 2800000, trangThai: 'CHO_THANH_TOAN', createdAt: '2026-01-06T14:20:00' },
                { id: 3, maDatVe: 'FL001236', customer: 'Lê Văn C', customerEmail: 'levanc@example.com', flight: 'VN789 SGN-PQC', tongTien: 3200000, trangThai: 'DA_XUAT_VE', createdAt: '2026-01-06T09:15:00' },
                { id: 4, maDatVe: 'FL001237', customer: 'Phạm Thị D', customerEmail: 'phamthid@example.com', flight: 'BL101 HAN-SGN', tongTien: 3500000, trangThai: 'GIU_CHO', createdAt: '2026-01-05T16:45:00' },
                { id: 5, maDatVe: 'FL001238', customer: 'Hoàng Văn E', customerEmail: 'hoangvane@example.com', flight: 'QH202 SGN-CXR', tongTien: 2100000, trangThai: 'HUY', createdAt: '2026-01-05T11:20:00' },
            ];

            setBookings(mockData);
        } catch (error) {
            console.error('Error fetching flight bookings:', error);
        } finally {
            setLoading(false);
        }
    };

    const filteredBookings = bookings.filter(booking => {
        const matchesSearch = booking.maDatVe.toLowerCase().includes(searchTerm.toLowerCase()) ||
            booking.customer.toLowerCase().includes(searchTerm.toLowerCase()) ||
            booking.flight.toLowerCase().includes(searchTerm.toLowerCase());
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
            TAO_MOI: { label: 'Tạo mới', class: 'bg-gray-500/10 text-gray-400' },
            GIU_CHO: { label: 'Giữ chỗ', class: 'bg-blue-500/10 text-blue-400' },
            CHO_THANH_TOAN: { label: 'Chờ thanh toán', class: 'bg-yellow-500/10 text-yellow-400' },
            DA_THANH_TOAN: { label: 'Đã thanh toán', class: 'bg-green-500/10 text-green-400' },
            DA_XUAT_VE: { label: 'Đã xuất vé', class: 'bg-green-500/10 text-green-400' },
            HUY: { label: 'Đã hủy', class: 'bg-red-500/10 text-red-400' },
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
                        <FiSend className="text-blue-400" />
                        Quản lý đặt vé máy bay
                    </h1>
                    <p className="text-slate-400 mt-1">Tổng số: {bookings.length} đặt vé</p>
                </div>
            </div>

            {/* Filters */}
            <div className="bg-slate-900 border border-slate-800 rounded-xl p-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="relative">
                        <FiSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                        <input
                            type="text"
                            placeholder="Tìm kiếm theo mã, tên khách hàng, chuyến bay..."
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
                            <option value="TAO_MOI">Tạo mới</option>
                            <option value="GIU_CHO">Giữ chỗ</option>
                            <option value="CHO_THANH_TOAN">Chờ thanh toán</option>
                            <option value="DA_THANH_TOAN">Đã thanh toán</option>
                            <option value="DA_XUAT_VE">Đã xuất vé</option>
                            <option value="HUY">Đã hủy</option>
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
                                <th className="px-6 py-4 text-left text-xs font-medium text-slate-400 uppercase">Mã đặt vé</th>
                                <th className="px-6 py-4 text-left text-xs font-medium text-slate-400 uppercase">Khách hàng</th>
                                <th className="px-6 py-4 text-left text-xs font-medium text-slate-400 uppercase">Chuyến bay</th>
                                <th className="px-6 py-4 text-left text-xs font-medium text-slate-400 uppercase">Số tiền</th>
                                <th className="px-6 py-4 text-left text-xs font-medium text-slate-400 uppercase">Trạng thái</th>
                                <th className="px-6 py-4 text-left text-xs font-medium text-slate-400 uppercase">Ngày đặt</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-800">
                            {paginatedBookings.map((booking) => (
                                <tr
                                    key={booking.id}
                                    onClick={() => router.push(`/dashboard/bookings/flights/${booking.id}`)}
                                    className="hover:bg-slate-800/50 transition-colors cursor-pointer"
                                >
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <div className="text-sm font-medium text-white">{booking.maDatVe}</div>
                                    </td>
                                    <td className="px-6 py-4">
                                        <div className="text-sm font-medium text-white">{booking.customer}</div>
                                        <div className="text-xs text-slate-400">{booking.customerEmail}</div>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <div className="text-sm text-slate-300">{booking.flight}</div>
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
                        Hiển thị {Math.min((currentPage - 1) * itemsPerPage + 1, filteredBookings.length)} - {Math.min(currentPage * itemsPerPage, filteredBookings.length)} trong tổng số {filteredBookings.length} đặt vé
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
