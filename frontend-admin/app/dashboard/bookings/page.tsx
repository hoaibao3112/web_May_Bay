'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { FiSearch, FiFilter, FiEye, FiX, FiCheck } from 'react-icons/fi';
import { getFlightBookings, getBusBookings, getCarBookings, getTransferBookings } from '@/lib/api';

export default function BookingsPage() {
    const router = useRouter();
    const [bookings, setBookings] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [activeTab, setActiveTab] = useState('all');
    const [searchTerm, setSearchTerm] = useState('');
    const [statusFilter, setStatusFilter] = useState('ALL');
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 10;

    useEffect(() => {
        fetchBookings();
    }, [activeTab]);

    const fetchBookings = async () => {
        try {
            setLoading(true);
            let response;

            // Mock data for now
            const mockFlightBookings = [
                { id: 1, code: 'FL001234', type: 'flight', customer: 'Nguyễn Văn A', customerEmail: 'nguyenvana@example.com', service: 'VN123 SGN-HAN', amount: 4500000, status: 'DA_THANH_TOAN', date: '2026-01-07T10:30:00' },
                { id: 2, code: 'FL001235', type: 'flight', customer: 'Trần Thị B', customerEmail: 'tranthib@example.com', service: 'VJ456 HAN-DAD', amount: 2800000, status: 'CHO_THANH_TOAN', date: '2026-01-06T14:20:00' },
            ];

            const mockBusBookings = [
                { id: 3, code: 'BUS00567', type: 'bus', customer: 'Lê Văn C', customerEmail: 'levanc@example.com', service: 'Phương Trang SGN-Đà Lạt', amount: 350000, status: 'DA_THANH_TOAN', date: '2026-01-07T08:00:00' },
            ];

            const mockCarBookings = [
                { id: 4, code: 'CAR00123', type: 'car', customer: 'Phạm Thị D', customerEmail: 'phamthid@example.com', service: 'Toyota Vios - 4 chỗ', amount: 1200000, status: 'DA_XAC_NHAN', date: '2026-01-06T16:45:00' },
            ];

            const mockTransferBookings = [
                { id: 5, code: 'TRF00089', type: 'transfer', customer: 'Hoàng Văn E', customerEmail: 'hoangvane@example.com', service: 'Airport Transfer TSN-Q1', amount: 450000, status: 'DANG_PHUC_VU', date: '2026-01-07T12:10:00' },
            ];

            if (activeTab === 'all') {
                setBookings([...mockFlightBookings, ...mockBusBookings, ...mockCarBookings, ...mockTransferBookings]);
            } else if (activeTab === 'flights') {
                setBookings(mockFlightBookings);
            } else if (activeTab === 'buses') {
                setBookings(mockBusBookings);
            } else if (activeTab === 'cars') {
                setBookings(mockCarBookings);
            } else if (activeTab === 'transfers') {
                setBookings(mockTransferBookings);
            }
        } catch (error) {
            console.error('Error fetching bookings:', error);
        } finally {
            setLoading(false);
        }
    };

    const filteredBookings = bookings.filter(booking => {
        const matchesSearch = booking.code.toLowerCase().includes(searchTerm.toLowerCase()) ||
            booking.customer.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesStatus = statusFilter === 'ALL' || booking.status === statusFilter;
        return matchesSearch && matchesStatus;
    });

    const totalPages = Math.ceil(filteredBookings.length / itemsPerPage);
    const paginatedBookings = filteredBookings.slice(
        (currentPage - 1) * itemsPerPage,
        currentPage * itemsPerPage
    );

    const getStatusBadge = (status: string) => {
        const statusConfig: any = {
            DA_THANH_TOAN: { label: 'Đã thanh toán', class: 'bg-green-500/10 text-green-400' },
            CHO_THANH_TOAN: { label: 'Chờ thanh toán', class: 'bg-yellow-500/10 text-yellow-400' },
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

    const getTypeLabel = (type: string) => {
        const types: any = {
            flight: { label: 'Máy bay', icon: '✈️' },
            bus: { label: 'Xe khách', icon: '🚌' },
            car: { label: 'Thuê xe', icon: '🚗' },
            transfer: { label: 'Đưa đón', icon: '🚕' },
            hotel: { label: 'Khách sạn', icon: '🏨' },
        };
        return types[type] || { label: type, icon: '📦' };
    };

    const formatCurrency = (amount: number) => {
        return new Intl.NumberFormat('vi-VN', {
            style: 'currency',
            currency: 'VND'
        }).format(amount);
    };

    const tabs = [
        { key: 'all', label: 'Tất cả', count: bookings.length },
        { key: 'flights', label: 'Máy bay', count: bookings.filter(b => b.type === 'flight').length },
        { key: 'buses', label: 'Xe khách', count: bookings.filter(b => b.type === 'bus').length },
        { key: 'cars', label: 'Thuê xe', count: bookings.filter(b => b.type === 'car').length },
        { key: 'transfers', label: 'Đưa đón', count: bookings.filter(b => b.type === 'transfer').length },
    ];

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
                <h1 className="text-3xl font-bold text-white mb-2">Quản lý đặt chỗ</h1>
                <p className="text-slate-400">Tổng số: {bookings.length} đặt chỗ</p>
            </div>

            {/* Tabs */}
            <div className="bg-slate-900 border border-slate-800 rounded-xl p-2 flex flex-wrap gap-2">
                {tabs.map(tab => (
                    <button
                        key={tab.key}
                        onClick={() => {
                            setActiveTab(tab.key);
                            setCurrentPage(1);
                        }}
                        className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${activeTab === tab.key
                            ? 'bg-blue-500 text-white shadow-lg shadow-blue-500/30'
                            : 'text-slate-400 hover:text-white hover:bg-slate-800'
                            }`}
                    >
                        {tab.label}
                        <span className={`ml-2 px-2 py-0.5 rounded-full text-xs ${activeTab === tab.key ? 'bg-white/20' : 'bg-slate-800'
                            }`}>
                            {tab.count}
                        </span>
                    </button>
                ))}
            </div>

            {/* Filters */}
            <div className="bg-slate-900 border border-slate-800 rounded-xl p-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {/* Search */}
                    <div className="relative">
                        <FiSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                        <input
                            type="text"
                            placeholder="Tìm kiếm theo mã đơn hoặc tên khách hàng..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="w-full pl-10 pr-4 py-2 bg-slate-800 border border-slate-700 rounded-lg text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                    </div>

                    {/* Status Filter */}
                    <div className="relative">
                        <FiFilter className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                        <select
                            value={statusFilter}
                            onChange={(e) => setStatusFilter(e.target.value)}
                            className="w-full pl-10 pr-4 py-2 bg-slate-800 border border-slate-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                        >
                            <option value="ALL">Tất cả trạng thái</option>
                            <option value="DA_THANH_TOAN">Đã thanh toán</option>
                            <option value="CHO_THANH_TOAN">Chờ thanh toán</option>
                            <option value="DA_XAC_NHAN">Đã xác nhận</option>
                            <option value="DANG_PHUC_VU">Đang phục vụ</option>
                            <option value="HOAN_THANH">Hoàn thành</option>
                            <option value="DA_HUY">Đã hủy</option>
                        </select>
                    </div>
                </div>
            </div>

            {/* Bookings Table */}
            <div className="bg-slate-900 border border-slate-800 rounded-xl overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full">
                        <thead className="bg-slate-800">
                            <tr>
                                <th className="px-6 py-4 text-left text-xs font-medium text-slate-400 uppercase tracking-wider">
                                    Mã đơn
                                </th>
                                <th className="px-6 py-4 text-left text-xs font-medium text-slate-400 uppercase tracking-wider">
                                    Loại
                                </th>
                                <th className="px-6 py-4 text-left text-xs font-medium text-slate-400 uppercase tracking-wider">
                                    Khách hàng
                                </th>
                                <th className="px-6 py-4 text-left text-xs font-medium text-slate-400 uppercase tracking-wider">
                                    Dịch vụ
                                </th>
                                <th className="px-6 py-4 text-left text-xs font-medium text-slate-400 uppercase tracking-wider">
                                    Số tiền
                                </th>
                                <th className="px-6 py-4 text-left text-xs font-medium text-slate-400 uppercase tracking-wider">
                                    Trạng thái
                                </th>
                                <th className="px-6 py-4 text-left text-xs font-medium text-slate-400 uppercase tracking-wider">
                                    Ngày đặt
                                </th>
                                <th className="px-6 py-4 text-right text-xs font-medium text-slate-400 uppercase tracking-wider">
                                    Hành động
                                </th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-800">
                            {paginatedBookings.map((booking) => {
                                const typeInfo = getTypeLabel(booking.type);
                                const detailUrl = booking.type === 'flight'
                                    ? `/dashboard/bookings/flights/${booking.id}`
                                    : booking.type === 'car'
                                        ? `/dashboard/bookings/cars/${booking.id}`
                                        : '#';

                                return (
                                    <tr
                                        key={booking.id}
                                        onClick={() => detailUrl !== '#' && router.push(detailUrl)}
                                        className="hover:bg-slate-800/50 transition-colors cursor-pointer"
                                    >
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <div className="text-sm font-medium text-white">{booking.code}</div>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <div className="flex items-center gap-2">
                                                <span>{typeInfo.icon}</span>
                                                <span className="text-sm text-slate-300">{typeInfo.label}</span>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4">
                                            <div className="text-sm font-medium text-white">{booking.customer}</div>
                                            <div className="text-xs text-slate-400">{booking.customerEmail}</div>
                                        </td>
                                        <td className="px-6 py-4">
                                            <div className="text-sm text-slate-300 max-w-xs truncate">{booking.service}</div>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <div className="text-sm font-medium text-white">{formatCurrency(booking.amount)}</div>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            {getStatusBadge(booking.status)}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-300">
                                            {new Date(booking.date).toLocaleString('vi-VN')}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-right text-sm">
                                            <button
                                                className="p-2 text-blue-400 hover:bg-blue-500/10 rounded-lg transition-colors"
                                                title="Xem chi tiết"
                                            >
                                                <FiEye className="w-4 h-4" />
                                            </button>
                                        </td>
                                    </tr>
                                );
                            })}
                        </tbody>
                    </table>
                </div>

                {/* Pagination */}
                <div className="px-6 py-4 border-t border-slate-800 flex items-center justify-between">
                    <div className="text-sm text-slate-400">
                        Hiển thị {Math.min((currentPage - 1) * itemsPerPage + 1, filteredBookings.length)} - {Math.min(currentPage * itemsPerPage, filteredBookings.length)} trong tổng số {filteredBookings.length} đặt chỗ
                    </div>
                    <div className="flex items-center gap-2">
                        <button
                            onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                            disabled={currentPage === 1}
                            className="px-3 py-1 bg-slate-800 border border-slate-700 rounded-lg text-sm text-slate-300 hover:bg-slate-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                        >
                            Trước
                        </button>
                        <span className="px-3 py-1 text-sm text-slate-300">
                            Trang {currentPage} / {totalPages}
                        </span>
                        <button
                            onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                            disabled={currentPage === totalPages}
                            className="px-3 py-1 bg-slate-800 border border-slate-700 rounded-lg text-sm text-slate-300 hover:bg-slate-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                        >
                            Sau
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}
