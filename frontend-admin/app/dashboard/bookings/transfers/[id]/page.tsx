'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { FiArrowLeft, FiUser, FiMapPin, FiClock, FiCheckCircle, FiXCircle, FiEdit } from 'react-icons/fi';

export default function TransferBookingDetailPage() {
    const params = useParams();
    const router = useRouter();
    const [booking, setBooking] = useState<any>(null);
    const [loading, setLoading] = useState(true);
    const [updating, setUpdating] = useState(false);

    useEffect(() => {
        if (params.id) {
            fetchBookingDetail();
        }
    }, [params.id]);

    const fetchBookingDetail = async () => {
        try {
            setLoading(true);
            const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';
            const token = localStorage.getItem('adminToken');

            const response = await fetch(`${API_URL}/airport-transfer-bookings/${params.id}`, {
                headers: {
                    'Authorization': `Bearer ${token}`,
                },
            });

            if (!response.ok) {
                throw new Error('Failed to fetch booking');
            }

            const data = await response.json();
            setBooking(data);
        } catch (error) {
            console.error('Error fetching booking:', error);
            alert('Không thể tải thông tin đặt xe');
        } finally {
            setLoading(false);
        }
    };

    const updateBookingStatus = async (newStatus: string) => {
        if (!confirm(`Bạn có chắc chắn muốn cập nhật trạng thái thành "${newStatus}"?`)) {
            return;
        }

        try {
            setUpdating(true);
            const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';
            const token = localStorage.getItem('adminToken');

            const response = await fetch(`${API_URL}/airport-transfer-bookings/${params.id}/status`, {
                method: 'PATCH',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ trangThai: newStatus }),
            });

            if (!response.ok) {
                throw new Error('Failed to update status');
            }

            alert('Đã cập nhật trạng thái thành công!');
            fetchBookingDetail();
        } catch (error) {
            console.error('Error updating status:', error);
            alert('Không thể cập nhật trạng thái');
        } finally {
            setUpdating(false);
        }
    };

    const getStatusBadge = (status: string) => {
        const statusConfig: any = {
            pending: { label: 'Chờ xác nhận', class: 'bg-yellow-500/10 text-yellow-400' },
            confirmed: { label: 'Đã xác nhận', class: 'bg-blue-500/10 text-blue-400' },
            completed: { label: 'Hoàn thành', class: 'bg-green-500/10 text-green-400' },
            cancelled: { label: 'Đã hủy', class: 'bg-red-500/10 text-red-400' },
        };
        const config = statusConfig[status] || { label: status, class: 'bg-slate-500/10 text-slate-400' };
        return (
            <span className={`px-3 py-1 rounded-full text-sm font-medium ${config.class}`}>
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

    if (!booking) {
        return (
            <div className="flex flex-col items-center justify-center min-h-screen">
                <div className="text-slate-400 mb-4">Không tìm thấy thông tin đặt xe</div>
                <button
                    onClick={() => router.back()}
                    className="px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-lg transition-colors"
                >
                    Quay lại
                </button>
            </div>
        );
    }

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                    <button
                        onClick={() => router.back()}
                        className="p-2 hover:bg-slate-800 rounded-lg transition-colors"
                    >
                        <FiArrowLeft className="w-6 h-6 text-slate-400" />
                    </button>
                    <div>
                        <h1 className="text-3xl font-bold text-white">Chi tiết dịch vụ đưa đón</h1>
                        <p className="text-slate-400 mt-1">Đơn đặt xe #{booking.id}</p>
                    </div>
                </div>
                <div>{getStatusBadge(booking.trangThai)}</div>
            </div>

            {/* Main Info Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Left Column - Service Info */}
                <div className="lg:col-span-2 space-y-6">
                    {/* Service Details */}
                    <div className="bg-slate-900 border border-slate-800 rounded-xl p-6">
                        <h2 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
                            <FiMapPin className="w-5 h-5 text-blue-400" />
                            Thông tin dịch vụ
                        </h2>
                        <div className="space-y-4">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div>
                                    <div className="text-sm text-slate-400 mb-1">Nhà cung cấp</div>
                                    <div className="text-white font-medium">{booking.nhaCungCap?.ten || 'N/A'}</div>
                                </div>
                                <div>
                                    <div className="text-sm text-slate-400 mb-1">Loại dịch vụ</div>
                                    <div className="text-white font-medium">
                                        {booking.loaiDichVu === 'khu_hoi' ? 'Khứ hồi' : 'Một chiều'}
                                    </div>
                                </div>
                                <div>
                                    <div className="text-sm text-slate-400 mb-1">Loại xe</div>
                                    <div className="text-white font-medium">{booking.dichVu?.loaiXe || 'N/A'}</div>
                                </div>
                                <div>
                                    <div className="text-sm text-slate-400 mb-1">Số chỗ</div>
                                    <div className="text-white font-medium">{booking.dichVu?.soChoNgoi || 'N/A'} chỗ</div>
                                </div>
                                {booking.sanBay && (
                                    <div className="md:col-span-2">
                                        <div className="text-sm text-slate-400 mb-1">Sân bay</div>
                                        <div className="text-white font-medium">
                                            {booking.sanBay.ten} ({booking.sanBay.ma}) - {booking.sanBay.thanhPho}
                                        </div>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>

                    {/* Pickup/Dropoff Info */}
                    <div className="bg-slate-900 border border-slate-800 rounded-xl p-6">
                        <h2 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
                            <FiClock className="w-5 h-5 text-blue-400" />
                            Thông tin đón/trả
                        </h2>
                        <div className="space-y-4">
                            {/* Pickup */}
                            <div className="bg-slate-800 rounded-lg p-4">
                                <div className="text-sm text-blue-400 mb-2">📍 Điểm đón</div>
                                <div className="text-white font-medium mb-2">{booking.diemDon}</div>
                                <div className="text-sm text-slate-400">
                                    {new Date(booking.ngayDon).toLocaleString('vi-VN')}
                                </div>
                            </div>

                            {/* Dropoff */}
                            <div className="bg-slate-800 rounded-lg p-4">
                                <div className="text-sm text-green-400 mb-2">📍 Điểm trả</div>
                                <div className="text-white font-medium mb-2">{booking.diemTra}</div>
                                {booking.ngayTra && (
                                    <div className="text-sm text-slate-400">
                                        {new Date(booking.ngayTra).toLocaleString('vi-VN')}
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>

                    {/* Customer Info */}
                    <div className="bg-slate-900 border border-slate-800 rounded-xl p-6">
                        <h2 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
                            <FiUser className="w-5 h-5 text-blue-400" />
                            Thông tin khách hàng
                        </h2>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                            <div>
                                <div className="text-sm text-slate-400 mb-1">Họ tên</div>
                                <div className="text-white">{booking.tenKhachHang}</div>
                            </div>
                            <div>
                                <div className="text-sm text-slate-400 mb-1">Email</div>
                                <div className="text-white">{booking.email}</div>
                            </div>
                            <div>
                                <div className="text-sm text-slate-400 mb-1">Số điện thoại</div>
                                <div className="text-white">{booking.soDienThoai}</div>
                            </div>
                            <div className="md:col-span-3">
                                <div className="text-sm text-slate-400 mb-1">Số hành khách</div>
                                <div className="text-white">{booking.soHanhKhach} người</div>
                            </div>
                            {booking.ghiChu && (
                                <div className="md:col-span-3">
                                    <div className="text-sm text-slate-400 mb-1">Ghi chú</div>
                                    <div className="text-white bg-slate-800 rounded-lg p-3">{booking.ghiChu}</div>
                                </div>
                            )}
                        </div>
                    </div>
                </div>

                {/* Right Column - Actions & Summary */}
                <div className="space-y-6">
                    {/* Summary */}
                    <div className="bg-slate-900 border border-slate-800 rounded-xl p-6">
                        <h2 className="text-lg font-semibold text-white mb-4">Tổng quan</h2>
                        <div className="space-y-4">
                            <div className="flex justify-between">
                                <span className="text-slate-400">Tổng tiền:</span>
                                <span className="text-white font-bold text-lg">{formatCurrency(Number(booking.tongTien))}</span>
                            </div>
                            {booking.phuongThucThanhToan && (
                                <div className="flex justify-between">
                                    <span className="text-slate-400">Thanh toán:</span>
                                    <span className="text-white">{booking.phuongThucThanhToan}</span>
                                </div>
                            )}
                            <div className="flex justify-between">
                                <span className="text-slate-400">TT thanh toán:</span>
                                <span className={`font-medium ${booking.trangThaiThanhToan === 'paid' ? 'text-green-400' : 'text-yellow-400'}`}>
                                    {booking.trangThaiThanhToan === 'paid' ? 'Đã thanh toán' : 'Chưa thanh toán'}
                                </span>
                            </div>
                            <div className="flex justify-between">
                                <span className="text-slate-400">Ngày đặt:</span>
                                <span className="text-white">{new Date(booking.createdAt).toLocaleDateString('vi-VN')}</span>
                            </div>
                        </div>
                    </div>

                    {/* Actions */}
                    <div className="bg-slate-900 border border-slate-800 rounded-xl p-6">
                        <h2 className="text-lg font-semibold text-white mb-4">Hành động</h2>
                        <div className="space-y-3">
                            <button
                                onClick={() => updateBookingStatus('confirmed')}
                                disabled={updating || booking.trangThai === 'confirmed' || booking.trangThai === 'completed'}
                                className="w-full px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                            >
                                <FiEdit />
                                Xác nhận đơn
                            </button>
                            <button
                                onClick={() => updateBookingStatus('completed')}
                                disabled={updating || booking.trangThai === 'completed'}
                                className="w-full px-4 py-2 bg-green-500 hover:bg-green-600 text-white rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                            >
                                <FiCheckCircle />
                                Hoàn thành
                            </button>
                            <button
                                onClick={() => updateBookingStatus('cancelled')}
                                disabled={updating || booking.trangThai === 'cancelled'}
                                className="w-full px-4 py-2 bg-red-500 hover:bg-red-600 text-white rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                            >
                                <FiXCircle />
                                Hủy đơn
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
