'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { FiArrowLeft, FiUser, FiMapPin, FiClock, FiDollarSign, FiCheckCircle, FiXCircle, FiEdit } from 'react-icons/fi';

export default function FlightBookingDetailPage() {
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

            const response = await fetch(`${API_URL}/bookings/${params.id}`, {
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
            alert('Không thể tải thông tin đặt vé');
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

            const response = await fetch(`${API_URL}/bookings/${params.id}/status`, {
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
        if (!confirm('Bạn có chắc chắn muốn HỦY đơn đặt vé này? Hành động này không thể hoàn tác.')) {
            return;
        }

        try {
            setUpdating(true);
            const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';
            const token = localStorage.getItem('adminToken');

            const response = await fetch(`${API_URL}/bookings/${params.id}/huy`, {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${token}`,
                },
            });

            if (!response.ok) {
                throw new Error('Failed to cancel booking');
            }

            alert('Đã hủy đơn đặt vé thành công!');
            fetchBookingDetail();
        } catch (error) {
            console.error('Error canceling booking:', error);
            alert('Không thể hủy đơn đặt vé');
        } finally {
            setUpdating(false);
        }
    };

    const getStatusBadge = (status: string) => {
        const statusConfig: any = {
            TAO_MOI: { label: 'Tạo mới', class: 'bg-gray-500/10 text-gray-400' },
            GIU_CHO: { label: 'Giữ chỗ', class: 'bg-blue-500/10 text-blue-400' },
            CHO_THANH_TOAN: { label: 'Chờ thanh toán', class: 'bg-yellow-500/10 text-yellow-400' },
            DA_THANH_TOAN: { label: 'Đã thanh toán', class: 'bg-green-500/10 text-green-400' },
            DA_XUAT_VE: { label: 'Đã xuất vé', class: 'bg-green-500/10 text-green-400' },
            HUY: { label: 'Đã hủy', class: 'bg-red-500/10 text-red-400' },
            HET_HAN: { label: 'Hết hạn', class: 'bg-red-500/10 text-red-400' },
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
                <div className="text-slate-400 mb-4">Không tìm thấy thông tin đặt vé</div>
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
                        <h1 className="text-3xl font-bold text-white">Chi tiết đặt vé máy bay</h1>
                        <p className="text-slate-400 mt-1">Mã đặt vé: {booking.maDatVe}</p>
                    </div>
                </div>
                <div>{getStatusBadge(booking.trangThai)}</div>
            </div>

            {/* Main Info Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Left Column - Booking Info */}
                <div className="lg:col-span-2 space-y-6">
                    {/* Flight Info */}
                    <div className="bg-slate-900 border border-slate-800 rounded-xl p-6">
                        <h2 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
                            <FiMapPin className="w-5 h-5 text-blue-400" />
                            Thông tin chuyến bay
                        </h2>
                        {booking.changBay && (
                            <div className="space-y-4">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div>
                                        <div className="text-sm text-slate-400 mb-1">Hãng hàng không</div>
                                        <div className="text-white font-medium">{booking.changBay.chuyenBay?.hang?.tenHang || 'N/A'}</div>
                                    </div>
                                    <div>
                                        <div className="text-sm text-slate-400 mb-1">Số hiệu</div>
                                        <div className="text-white font-medium">{booking.changBay.chuyenBay?.soHieuChuyenBay || 'N/A'}</div>
                                    </div>
                                    <div>
                                        <div className="text-sm text-slate-400 mb-1">Từ</div>
                                        <div className="text-white font-medium">
                                            {booking.changBay.sanBayDi?.tenSanBay || 'N/A'} ({booking.changBay.sanBayDi?.maIata})
                                        </div>
                                    </div>
                                    <div>
                                        <div className="text-sm text-slate-400 mb-1">Đến</div>
                                        <div className="text-white font-medium">
                                            {booking.changBay.sanBayDen?.tenSanBay || 'N/A'} ({booking.changBay.sanBayDen?.maIata})
                                        </div>
                                    </div>
                                    <div>
                                        <div className="text-sm text-slate-400 mb-1">Giờ khởi hành</div>
                                        <div className="text-white font-medium">
                                            {new Date(booking.changBay.gioDi).toLocaleString('vi-VN')}
                                        </div>
                                    </div>
                                    <div>
                                        <div className="text-sm text-slate-400 mb-1">Giờ đến</div>
                                        <div className="text-white font-medium">
                                            {new Date(booking.changBay.gioDen).toLocaleString('vi-VN')}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>

                    {/* Passengers */}
                    <div className="bg-slate-900 border border-slate-800 rounded-xl p-6">
                        <h2 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
                            <FiUser className="w-5 h-5 text-blue-400" />
                            Hành khách ({booking.hanhKhach?.length || 0})
                        </h2>
                        <div className="space-y-3">
                            {booking.hanhKhach && booking.hanhKhach.length > 0 ? (
                                booking.hanhKhach.map((passenger: any, idx: number) => (
                                    <div key={idx} className="bg-slate-800 rounded-lg p-4">
                                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                            <div>
                                                <div className="text-sm text-slate-400">Họ tên</div>
                                                <div className="text-white font-medium">{passenger.ho} {passenger.ten}</div>
                                            </div>
                                            <div>
                                                <div className="text-sm text-slate-400">Loại</div>
                                                <div className="text-white">{passenger.loai}</div>
                                            </div>
                                            <div>
                                                <div className="text-sm text-slate-400">Số ghế</div>
                                                <div className="text-white">{passenger.soGhe || 'Chưa chọn'}</div>
                                            </div>
                                        </div>
                                    </div>
                                ))
                            ) : (
                                <div className="text-slate-400 text-center py-4">Chưa có thông tin hành khách</div>
                            )}
                        </div>
                    </div>

                    {/* Contact Info */}
                    {booking.thongTinLienHe && (
                        <div className="bg-slate-900 border border-slate-800 rounded-xl p-6">
                            <h2 className="text-lg font-semibold text-white mb-4">Thông tin liên hệ</h2>
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                <div>
                                    <div className="text-sm text-slate-400 mb-1">Họ tên</div>
                                    <div className="text-white">{booking.thongTinLienHe.hoTen}</div>
                                </div>
                                <div>
                                    <div className="text-sm text-slate-400 mb-1">Email</div>
                                    <div className="text-white">{booking.thongTinLienHe.email}</div>
                                </div>
                                <div>
                                    <div className="text-sm text-slate-400 mb-1">Số điện thoại</div>
                                    <div className="text-white">{booking.thongTinLienHe.soDienThoai}</div>
                                </div>
                            </div>
                        </div>
                    )}
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
                                <span className="text-slate-400">Tiền tệ:</span>
                                <span className="text-white">{booking.tienTe}</span>
                            </div>
                            {booking.giamGia > 0 && (
                                <div className="flex justify-between">
                                    <span className="text-slate-400">Giảm giá:</span>
                                    <span className="text-green-400">-{formatCurrency(Number(booking.giamGia))}</span>
                                </div>
                            )}
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
                                onClick={() => updateBookingStatus('DA_THANH_TOAN')}
                                disabled={updating || booking.trangThai === 'DA_THANH_TOAN'}
                                className="w-full px-4 py-2 bg-green-500 hover:bg-green-600 text-white rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                            >
                                <FiCheckCircle />
                                Xác nhận thanh toán
                            </button>
                            <button
                                onClick={() => updateBookingStatus('DA_XUAT_VE')}
                                disabled={updating || booking.trangThai === 'DA_XUAT_VE'}
                                className="w-full px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                            >
                                <FiEdit />
                                Xuất vé
                            </button>
                            <button
                                onClick={cancelBooking}
                                disabled={updating || booking.trangThai === 'HUY'}
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
