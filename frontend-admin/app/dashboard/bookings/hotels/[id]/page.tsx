'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { FiArrowLeft, FiUser, FiMapPin, FiClock, FiCheckCircle, FiXCircle, FiEdit, FiHome } from 'react-icons/fi';

export default function HotelBookingDetailPage() {
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

            const response = await fetch(`${API_URL}/hotel-bookings/${params.id}`, {
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
            alert('Không thể tải thông tin đặt phòng');
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

            const response = await fetch(`${API_URL}/hotel-bookings/${params.id}/status`, {
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

    const cancelBooking = async () => {
        if (!confirm('Bạn có chắc chắn muốn HỦY đặt phòng này? Hành động này không thể hoàn tác.')) {
            return;
        }

        try {
            setUpdating(true);
            const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';
            const token = localStorage.getItem('adminToken');

            const response = await fetch(`${API_URL}/hotel-bookings/${params.id}`, {
                method: 'DELETE',
                headers: {
                    'Authorization': `Bearer ${token}`,
                },
            });

            if (!response.ok) {
                throw new Error('Failed to cancel booking');
            }

            alert('Đã hủy đặt phòng thành công!');
            fetchBookingDetail();
        } catch (error) {
            console.error('Error canceling booking:', error);
            alert('Không thể hủy đặt phòng');
        } finally {
            setUpdating(false);
        }
    };

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
                <div className="text-slate-400 mb-4">Không tìm thấy thông tin đặt phòng</div>
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
                        <h1 className="text-3xl font-bold text-white">Chi tiết đặt phòng khách sạn</h1>
                        <p className="text-slate-400 mt-1">Mã đặt phòng: {booking.maDatPhong}</p>
                    </div>
                </div>
                <div>{getStatusBadge(booking.trangThai)}</div>
            </div>

            {/* Main Info Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Left Column - Booking Info */}
                <div className="lg:col-span-2 space-y-6">
                    {/* Hotel Info */}
                    <div className="bg-slate-900 border border-slate-800 rounded-xl p-6">
                        <h2 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
                            <FiHome className="w-5 h-5 text-blue-400" />
                            Thông tin khách sạn
                        </h2>
                        {booking.khachSan && (
                            <div className="space-y-4">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div>
                                        <div className="text-sm text-slate-400 mb-1">Tên khách sạn</div>
                                        <div className="text-white font-medium">{booking.khachSan.ten}</div>
                                    </div>
                                    <div>
                                        <div className="text-sm text-slate-400 mb-1">Địa chỉ</div>
                                        <div className="text-white">{booking.khachSan.diaChi}</div>
                                    </div>
                                    <div>
                                        <div className="text-sm text-slate-400 mb-1">Thành phố</div>
                                        <div className="text-white">{booking.khachSan.thanhPho}</div>
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>

                    {/* Room Details */}
                    <div className="bg-slate-900 border border-slate-800 rounded-xl p-6">
                        <h2 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
                            <FiMapPin className="w-5 h-5 text-blue-400" />
                            Thông tin phòng
                        </h2>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            {booking.phong && (
                                <div>
                                    <div className="text-sm text-slate-400 mb-1">Loại phòng</div>
                                    <div className="text-white font-medium">{booking.phong.loaiPhong}</div>
                                </div>
                            )}
                            <div>
                                <div className="text-sm text-slate-400 mb-1">Số lượng phòng</div>
                                <div className="text-white font-medium">{booking.soLuongPhong} phòng</div>
                            </div>
                            {booking.phong && (
                                <div>
                                    <div className="text-sm text-slate-400 mb-1">Số giường</div>
                                    <div className="text-white">{booking.phong.soGiuong}</div>
                                </div>
                            )}
                            <div>
                                <div className="text-sm text-slate-400 mb-1">Số khách</div>
                                <div className="text-white">{booking.soNguoiLon} người lớn, {booking.soTreEm} trẻ em</div>
                            </div>
                        </div>
                    </div>

                    {/* Check-in/out */}
                    <div className="bg-slate-900 border border-slate-800 rounded-xl p-6">
                        <h2 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
                            <FiClock className="w-5 h-5 text-blue-400" />
                            Thời gian lưu trú
                        </h2>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                            <div>
                                <div className="text-sm text-slate-400 mb-1">Ngày nhận phòng</div>
                                <div className="text-white font-medium">
                                    {new Date(booking.ngayNhanPhong).toLocaleDateString('vi-VN')}
                                </div>
                            </div>
                            <div>
                                <div className="text-sm text-slate-400 mb-1">Ngày trả phòng</div>
                                <div className="text-white font-medium">
                                    {new Date(booking.ngayTraPhong).toLocaleDateString('vi-VN')}
                                </div>
                            </div>
                            <div>
                                <div className="text-sm text-slate-400 mb-1">Số đêm</div>
                                <div className="text-white font-medium">{booking.soNgay} đêm</div>
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
                            {booking.yeuCauDacBiet && (
                                <div className="md:col-span-3">
                                    <div className="text-sm text-slate-400 mb-1">Yêu cầu đặc biệt</div>
                                    <div className="text-white bg-slate-800 rounded-lg p-3">{booking.yeuCauDacBiet}</div>
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
                            <div className="flex justify-between">
                                <span className="text-slate-400">TT thanh toán:</span>
                                <span className={`font-medium ${booking.trangThaiThanhToan === 'DA_THANH_TOAN' ? 'text-green-400' : 'text-yellow-400'}`}>
                                    {booking.trangThaiThanhToan === 'DA_THANH_TOAN' ? 'Đã thanh toán' : 'Chưa thanh toán'}
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
                                onClick={() => updateBookingStatus('DA_XAC_NHAN')}
                                disabled={updating || booking.trangThai === 'DA_XAC_NHAN' || booking.trangThai === 'DANG_PHUC_VU' || booking.trangThai === 'HOAN_THANH'}
                                className="w-full px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                            >
                                <FiEdit />
                                Xác nhận đặt phòng
                            </button>
                            <button
                                onClick={() => updateBookingStatus('DANG_PHUC_VU')}
                                disabled={updating || booking.trangThai === 'DANG_PHUC_VU' || booking.trangThai === 'HOAN_THANH'}
                                className="w-full px-4 py-2 bg-purple-500 hover:bg-purple-600 text-white rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                            >
                                <FiCheckCircle />
                                Đang phục vụ
                            </button>
                            <button
                                onClick={() => updateBookingStatus('HOAN_THANH')}
                                disabled={updating || booking.trangThai === 'HOAN_THANH'}
                                className="w-full px-4 py-2 bg-green-500 hover:bg-green-600 text-white rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                            >
                                <FiCheckCircle />
                                Hoàn thành
                            </button>
                            <button
                                onClick={cancelBooking}
                                disabled={updating || booking.trangThai === 'DA_HUY'}
                                className="w-full px-4 py-2 bg-red-500 hover:bg-red-600 text-white rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                            >
                                <FiXCircle />
                                Hủy đặt phòng
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
