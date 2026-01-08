'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { FiSearch, FiFilter, FiNavigation } from 'react-icons/fi';

export default function TransferBookingsPage() {
    const router = useRouter();
    const [bookings, setBookings] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [statusFilter, setStatusFilter] = useState('ALL');
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 10;

    useEffect(() => {
        fetchTransferBookings();
    }, []);

    const fetchTransferBookings = async () => {
        try {
            setLoading(true);
            const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';
            const token = localStorage.getItem('adminToken');

            // Mock data - replace with real API call when ready
            const mockData = [
                { id: 1, maDonDat: 'TRF00123', customer: 'Nguyễn Văn A', customerEmail: 'nguyenvana@example.com', route: 'Sân bay Tân Sơn Nhất - Quận 1', provider: 'Mai Linh Transfer', loaiDichVu: 'mot_chieu', tongTien: 250000, trangThai: 'confirmed', createdAt: '2026-01-07T06:00:00', soHanhKhach: 2 },
                { id: 2, maDonDat: 'TRF00124', customer: 'Trần Thị B', customerEmail: 'tranthib@example.com', route: 'Sân bay Nội Bài - Ba Đình', provider: 'Grab Connect', loaiDichVu: 'khu_hoi', tongTien: 480000, trangThai: 'pending', createdAt: '2026-01-07T07:30:00', soHanhKhach: 4 },
                { id: 3, maDonDat: 'TRF00125', customer: 'Lê Văn C', customerEmail: 'levanc@example.com', route: 'Sân bay Đà Nẵng - Hội An', provider: 'Danang Transfer', loaiDichVu: 'mot_chieu', tongTien: 350000, trangThai: 'confirmed', createdAt: '2026-01-06T14:15:00', soHanhKhach: 3 },
                { id: 4, maDonDat: 'TRF00126', customer: 'Phạm Thị D', customerEmail: 'phamthid@example.com', route: 'Sân bay Phú Quốc - Trung tâm', provider: 'PQ Transfer', loaiDichVu: 'mot_chieu', tongTien: 180000, trangThai: 'completed', createdAt: '2026-01-05T11:20:00', soHanhKhach: 2 },
                { id: 5, maDonDat: 'TRF00127', customer: 'Hoàng Văn E', customerEmail: 'hoangvane@example.com', route: 'Sân bay Tân Sơn Nhất - Thủ Đức', provider: 'Mai Linh Transfer', loaiDichVu: 'mot_chieu', tongTien: 220000, trangThai: 'cancelled', createdAt: '2026-01-04T09:45:00', soHanhKhach: 1 },
            ];

            setBookings(mockData);
        } catch (error) {
            console.error('Error fetching transfer bookings:', error);
        } finally {
            setLoading(false);
        }
    };

    const filteredBookings = bookings.filter(booking => {
        const matchesSearch = booking.maDonDat.toLowerCase().includes(searchTerm.toLowerCase()) ||
            booking.customer.toLowerCase().includes(searchTerm.toLowerCase()) ||
            booking.route.toLowerCase().includes(searchTerm.toLowerCase()) ||
            booking.provider.toLowerCase().includes(searchTerm.toLowerCase());
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
            pending: { label: 'Chờ xác nhận', class: 'bg-yellow-500/10 text-yellow-400' },
            confirmed: { label: 'Đã xác nhận', class: 'bg-blue-500/10 text-blue-400' },
            completed: { label: 'Hoàn thành', class: 'bg-green-500/10 text-green-400' },
            cancelled: { label: 'Đã hủy', class: 'bg-red-500/10 text-red-400' },
        };
        const config = statusConfig[status] || { label: status, class: 'bg-slate-500/10 text-slate-400' };
        return (
            <span className={`px-2 py-1 rounded-full text-xs font-medium ${config.class}`}>
                {config.label}
            </span>
        );
    };

    const getServiceTypeLabel = (type: string) => {
        return type === 'khu_hoi' ? 'Khứ hồi' : 'Một chiều';
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
                        <FiNavigation className="text-blue-400" />
                        Quản lý dịch vụ đưa đón
                    </h1>
                    <p className="text-slate-400 mt-1">Tổng số: {bookings.length} đặt xe</p>
                </div>
            </div>

            {/* Filters */}
            <div className="bg-slate-900 border border-slate-800 rounded-xl p-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="relative">
                        <FiSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                        <input
                            type="text"
                            placeholder="Tìm kiếm theo mã, khách hàng, tuyến đường, nhà cung cấp..."
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
                            <option value="pending">Chờ xác nhận</option>
                            <option value="confirmed">Đã xác nhận</option>
                            <option value="completed">Hoàn thành</option>
                            <option value="cancelled">Đã hủy</option>
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
                                <th className="px-6 py-4 text-left text-xs font-medium text-slate-400 uppercase">Nhà cung cấp</th>
                                <th className="px-6 py-4 text-left text-xs font-medium text-slate-400 uppercase">Tuyến đường</th>
                                <th className="px-6 py-4 text-left text-xs font-medium text-slate-400 uppercase">Loại DV</th>
                                <th className="px-6 py-4 text-left text-xs font-medium text-slate-400 uppercase">SL khách</th>
                                <th className="px-6 py-4 text-left text-xs font-medium text-slate-400 uppercase">Số tiền</th>
                                <th className="px-6 py-4 text-left text-xs font-medium text-slate-400 uppercase">Trạng thái</th>
                                <th className="px-6 py-4 text-left text-xs font-medium text-slate-400 uppercase">Ngày đặt</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-800">
                            {paginatedBookings.map((booking) => (
                                <tr
                                    key={booking.id}
                                    onClick={() => router.push(`/dashboard/bookings/transfers/${booking.id}`)}
                                    className="hover:bg-slate-800/50 transition-colors cursor-pointer"
                                >
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <div className="text-sm font-medium text-white">{booking.maDonDat}</div>
                                    </td>
                                    <td className="px-6 py-4">
                                        <div className="text-sm font-medium text-white">{booking.customer}</div>
                                        <div className="text-xs text-slate-400">{booking.customerEmail}</div>
                                    </td>
                                    <td className="px-6 py-4">
                                        <div className="text-sm text-slate-300">{booking.provider}</div>
                                    </td>
                                    <td className="px-6 py-4">
                                        <div className="text-sm text-slate-300">{booking.route}</div>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <div className="text-sm text-slate-300">{getServiceTypeLabel(booking.loaiDichVu)}</div>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <div className="text-sm text-slate-300">{booking.soHanhKhach} người</div>
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
                        Hiển thị {Math.min((currentPage - 1) * itemsPerPage + 1, filteredBookings.length)} - {Math.min(currentPage * itemsPerPage, filteredBookings.length)} trong tổng số {filteredBookings.length} đặt xe
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
