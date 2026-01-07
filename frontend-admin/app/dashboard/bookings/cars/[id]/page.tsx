'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { FiArrowLeft, FiUser, FiMapPin, FiClock, FiDollarSign, FiCheckCircle, FiXCircle, FiCar, FiEdit } from 'react-icons/fi';

export default function CarBookingDetailPage() {
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

            const response = await fetch(`${API_URL}/car-rental-bookings/${params.id}`, {
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

    const updateBookingStatus = async (newStatus: string, additionalData?: any) => {
        if (!confirm(`Bạn có chắc chắn muốn cập nhật trạng thái thành "${newStatus}"?`)) {
            return;
        }

        try {
            setUpdating(true);
            const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';
            const token = localStorage.getItem('adminToken');

            const response = await fetch(`${API_URL}/car-rental-bookings/${params.id}/status`, {
                method: 'PATCH',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    trangThai: newStatus,
                    ...additionalData
                }),
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
        if (!confirm('Bạn có chắc chắn muốn HỦY đơn thuê xe này? Hành động này không thể hoàn tác.')) {
            return;
        }

        try {
            setUpdating(true);
            const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';
            const token = localStorage.getItem('adminToken');

            const response = await fetch(`${API_URL}/car-rental-bookings/${params.id}`, {
                method: 'DELETE',
                headers: {
                    'Authorization': `Bearer ${token}`,
                },
            });

            if (!response.ok) {
                throw new Error('Failed to cancel booking');
            }

            alert('Đã hủy đơn thuê xe thành công!');
            fetchBookingDetail();
        } catch (error) {
            console.error('Error canceling booking:', error);
            alert('Không thể hủy đơn thuê xe');
        } finally {
            setUpdating(false);
        }
    };

    const assignDriver = () => {
        const driverName = prompt('Nhập tên tài xế:');
        if (!driverName) return;

        const driverPhone = prompt('Nhập số điện thoại tài xế:');
        if (!driverPhone) return;

        const licensePlate = prompt('Nhập biển số xe:');
        if (!licensePlate) return;

        updateBookingStatus('DANG_PHUC_VU', {
            tenTaiXe: driverName,
            soDienThoaiTaiXe: driverPhone,
            bienSoXe: licensePlate,
        });
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
                <div className="text-slate-400 mb-4">Không tìm thấy thông tin thuê xe</div>
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
                        <h1 className="text-3xl font-bold text-white">Chi tiết thuê xe</h1>
                        <p className="text-slate-400 mt-1">Mã đơn: {booking.maDonThue}</p>
                    </div>
                </div>
                <div>{getStatusBadge(booking.trangThai)}</div>
            </div>

            {/* Main Info Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Left Column - Rental Info */}
                <div className="lg:col-span-2 space-y-6">
                    {/* Car Info */}
                    <div className="bg-slate-900 border border-slate-800 rounded-xl p-6">
                        <h2 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
                            <FiCar className="w-5 h-5 text-blue-400" />
                            Thông tin xe
                        </h2>
                        {booking.xe && (
                            <div className="space-y-4">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div>
                                        <div className="text-sm text-slate-400 mb-1">Hãng xe</div>
                                        <div className="text-white font-medium">{booking.xe.nhaCungCap?.tenNhaCungCap || 'N/A'}</div>
                                    </div>
                                    <div>
                                        <div className="text-sm text-slate-400 mb-1">Loại xe</div>
                                        <div className="text-white font-medium">{booking.xe.tenXe}</div>
                                    </div>
                                    <div>
                                        <div className="text-sm text-slate-400 mb-1">Số chỗ</div>
                                        <div className="text-white font-medium">{booking.xe.soChoNgoi} chỗ</div>
                                    </div>
                                    <div>
                                        <div className="text-sm text-slate-400 mb-1">Truyền động</div>
                                        <div className="text-white font-medium">{booking.xe.loaiTruyenDong}</div>
                                    </div>
                                    <div>
                                        <div className="text-sm text-slate-400 mb-1">Nhiên liệu</div>
                                        <div className="text-white font-medium">{booking.xe.loaiNhienLieu}</div>
                                    </div>
                                    <div>
                                        <div className="text-sm text-slate-400 mb-1">Hành lý</div>
                                        <div className="text-white font-medium">{booking.xe.soHanhLy} túi</div>
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>

                    {/* Rental Period */}
                    <div className="bg-slate-900 border border-slate-800 rounded-xl p-6">
                        <h2 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
                            <FiClock className="w-5 h-5 text-blue-400" />
                            Thời gian thuê
                        </h2>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                                <div className="text-sm text-slate-400 mb-1">Nhận xe</div>
                                <div className="text-white font-medium">
                                    {new Date(booking.thoiGianNhan).toLocaleString('vi-VN')}
                                </div>
                                <div className="text-sm text-slate-400 mt-1">📍 {booking.diaDiemNhan}</div>
                            </div>
                            <div>
                                <div className="text-sm text-slate-400 mb-1">Trả xe</div>
                                <div className="text-white font-medium">
                                    {new Date(booking.thoiGianTra).toLocaleString('vi-VN')}
                                </div>
                                <div className="text-sm text-slate-400 mt-1">📍 {booking.diaDiemTra}</div>
                            </div>
                            <div>
                                <div className="text-sm text-slate-400 mb-1">Số ngày thuê</div>
                                <div className="text-white font-medium">{booking.soNgayThue} ngày</div>
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
                                <div className="text-white">{booking.nguoiDung?.hoTen || 'N/A'}</div>
                            </div>
                            <div>
                                <div className="text-sm text-slate-400 mb-1">Email</div>
                                <div className="text-white">{booking.nguoiDung?.email || booking.email}</div>
                            </div>
                            <div>
                                <div className="text-sm text-slate-400 mb-1">Số điện thoại</div>
                                <div className="text-white">{booking.soDienThoai}</div>
                            </div>
                        </div>
                    </div>

                    {/* Driver Info (if assigned) */}
                    {(booking.tenTaiXe || booking.soDienThoaiTaiXe || booking.bienSoXe) && (
                        <div className="bg-slate-900 border border-slate-800 rounded-xl p-6">
                            <h2 className="text-lg font-semibold text-white mb-4">Thông tin phục vụ</h2>
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                {booking.tenTaiXe && (
                                    <div>
                                        <div className="text-sm text-slate-400 mb-1">Tài xế</div>
                                        <div className="text-white">{booking.tenTaiXe}</div>
                                    </div>
                                )}
                                {booking.soDienThoaiTaiXe && (
                                    <div>
                                        <div className="text-sm text-slate-400 mb-1">SĐT tài xế</div>
                                        <div className="text-white">{booking.soDienThoaiTaiXe}</div>
                                    </div>
                                )}
                                {booking.bienSoXe && (
                                    <div>
                                        <div className="text-sm text-slate-400 mb-1">Biển số xe</div>
                                        <div className="text-white">{booking.bienSoXe}</div>
                                    </div>
                                )}
                            </div>
                        </div>
                    )}

                    {/* Additional Services */}
                    {booking.dichVuBoSung && booking.dichVuBoSung.length > 0 && (
                        <div className="bg-slate-900 border border-slate-800 rounded-xl p-6">
                            <h2 className="text-lg font-semibold text-white mb-4">Dịch vụ bổ sung</h2>
                            <div className="space-y-2">
                                {booking.dichVuBoSung.map((service: string, idx: number) => (
                                    <div key={idx} className="flex items-center gap-2 text-slate-300">
                                        <FiCheckCircle className="text-green-400" />
                                        <span>{service}</span>
                                    </div>
                                ))}
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
                            {booking.tienCoc && booking.tienCoc > 0 && (
                                <div className="flex justify-between">
                                    <span className="text-slate-400">Tiền cọc:</span>
                                    <span className="text-yellow-400">{formatCurrency(Number(booking.tienCoc))}</span>
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
                                onClick={() => updateBookingStatus('DA_XAC_NHAN')}
                                disabled={updating || booking.trangThai !== 'CHO_XAC_NHAN'}
                                className="w-full px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                            >
                                <FiCheckCircle />
                                Xác nhận đơn
                            </button>
                            <button
                                onClick={assignDriver}
                                disabled={updating || booking.trangThai === 'DA_HUY' || booking.trangThai === 'HOAN_THANH'}
                                className="w-full px-4 py-2 bg-purple-500 hover:bg-purple-600 text-white rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                            >
                                <FiCar />
                                Phân công tài xế
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
                                Hủy đơn
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
