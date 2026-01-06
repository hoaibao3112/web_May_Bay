'use client';

import { useState, useEffect } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { FaBus, FaCheckCircle, FaMapMarkerAlt, FaPrint, FaEnvelope } from 'react-icons/fa';

interface BookingDetail {
    id: number;
    maDonDat: string;
    tongTien: number;
    soLuongGhe: number;
    trangThaiDat: string;
    phuongThucThanhToan?: string;
    chuyenXe: {
        maChuyenXe: string;
        gioDi: string;
        gioDen: string;
        giaVe: number;
        tuyenXe: {
            nhaXe: {
                tenNhaXe: string;
                logo?: string;
            };
            benXeDi: {
                tenBenXe: string;
                thanhPho: string;
                diaChi: string;
            };
            benXeDen: {
                tenBenXe: string;
                thanhPho: string;
                diaChi: string;
            };
        };
        xe: {
            loaiXe: {
                tenLoaiXe: string;
            };
        };
    };
    veXe: Array<{
        soVe: string;
        hoTenHanhKhach: string;
        soGhe: string;
        giaVe: number;
    }>;
}

export default function BusConfirmationPage() {
    const searchParams = useSearchParams();
    const router = useRouter();
    const bookingId = searchParams.get('bookingId');

    const [booking, setBooking] = useState<BookingDetail | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (bookingId) {
            fetchBookingDetail();
        }
    }, [bookingId]);

    const fetchBookingDetail = async () => {
        try {
            const res = await fetch(`http://localhost:5000/bus-bookings/${bookingId}`);
            if (!res.ok) throw new Error('Không thể tải thông tin đặt vé');

            const data = await res.json();
            setBooking(data);
        } catch (error) {
            console.error('Error fetching booking:', error);
            alert('Không thể tải thông tin đặt vé');
        } finally {
            setLoading(false);
        }
    };

    const handlePrint = () => {
        window.print();
    };

    const handleSendEmail = async () => {
        alert('Email xác nhận sẽ được gửi đến địa chỉ email của bạn');
    };

    const formatPrice = (price: number) => {
        return new Intl.NumberFormat('vi-VN').format(price) + ' VNĐ';
    };

    const formatDateTime = (dateString: string) => {
        const date = new Date(dateString);
        return date.toLocaleString('vi-VN', {
            hour: '2-digit',
            minute: '2-digit',
            day: '2-digit',
            month: '2-digit',
            year: 'numeric',
        });
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-gray-50 flex items-center justify-center">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
            </div>
        );
    }

    if (!booking) {
        return (
            <div className="min-h-screen bg-gray-50 flex items-center justify-center">
                <div className="text-center">
                    <p className="text-gray-600 mb-4">Không tìm thấy thông tin đặt vé</p>
                    <button
                        onClick={() => router.push('/xekhach')}
                        className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700"
                    >
                        Quay lại trang chủ
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50 py-3">
            <div className="max-w-7xl mx-auto px-3">
                {/* Success Banner - Compact */}
                <div className="bg-gradient-to-r from-green-500 to-emerald-600 text-white rounded-lg p-3 mb-3 shadow-lg">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                            <div className="w-10 h-10 bg-white rounded-full flex items-center justify-center">
                                <FaCheckCircle className="text-green-500 text-2xl" />
                            </div>
                            <div>
                                <h1 className="text-lg font-bold">Thanh toán thành công!</h1>
                                <p className="text-xs text-green-100">Đặt vé đã được xác nhận</p>
                            </div>
                        </div>
                        <div className="bg-white bg-opacity-20 rounded-lg px-3 py-2 backdrop-blur-sm">
                            <p className="text-xs opacity-90">Mã đơn</p>
                            <p className="text-xl font-bold tracking-wider">{booking.maDonDat}</p>
                        </div>
                    </div>
                </div>

                {/* 2 Column Layout */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-3">
                    {/* Left Column */}
                    <div className="space-y-3">
                        {/* Trip Details */}
                        <div className="bg-white rounded-lg shadow-md p-3">
                            <h2 className="text-base font-bold text-gray-800 mb-2 flex items-center gap-2">
                                <FaBus className="text-blue-600 text-sm" />
                                Chi tiết chuyến xe
                            </h2>

                            {/* Company */}
                            <div className="flex items-center gap-2 pb-2 border-b mb-2">
                                {booking.chuyenXe.tuyenXe.nhaXe.logo ? (
                                    <img
                                        src={booking.chuyenXe.tuyenXe.nhaXe.logo}
                                        alt={booking.chuyenXe.tuyenXe.nhaXe.tenNhaXe}
                                        className="w-10 h-10 object-contain rounded"
                                    />
                                ) : (
                                    <div className="w-10 h-10 bg-blue-100 rounded flex items-center justify-center">
                                        <FaBus className="text-blue-600 text-lg" />
                                    </div>
                                )}
                                <div>
                                    <p className="font-bold text-sm">{booking.chuyenXe.tuyenXe.nhaXe.tenNhaXe}</p>
                                    <p className="text-xs text-gray-600">{booking.chuyenXe.xe.loaiXe.tenLoaiXe}</p>
                                </div>
                            </div>

                            {/* Route - Horizontal */}
                            <div className="grid grid-cols-2 gap-2">
                                {/* Departure */}
                                <div className="border-r pr-2">
                                    <p className="text-xs text-gray-500">Điểm đi</p>
                                    <p className="text-lg font-bold text-blue-600">
                                        {new Date(booking.chuyenXe.gioDi).toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' })}
                                    </p>
                                    <p className="font-semibold text-sm">{booking.chuyenXe.tuyenXe.benXeDi.tenBenXe}</p>
                                    <p className="text-xs text-gray-600">{booking.chuyenXe.tuyenXe.benXeDi.thanhPho}</p>
                                    <p className="text-xs text-gray-500 mt-0.5">
                                        {new Date(booking.chuyenXe.gioDi).toLocaleDateString('vi-VN', {
                                            day: '2-digit',
                                            month: '2-digit',
                                            year: 'numeric'
                                        })}
                                    </p>
                                </div>

                                {/* Arrival */}
                                <div className="pl-2">
                                    <p className="text-xs text-gray-500">Điểm đến</p>
                                    <p className="text-lg font-bold text-red-600">
                                        {new Date(booking.chuyenXe.gioDen).toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' })}
                                    </p>
                                    <p className="font-semibold text-sm">{booking.chuyenXe.tuyenXe.benXeDen.tenBenXe}</p>
                                    <p className="text-xs text-gray-600">{booking.chuyenXe.tuyenXe.benXeDen.thanhPho}</p>
                                    <p className="text-xs text-gray-500 mt-0.5">
                                        {new Date(booking.chuyenXe.gioDen).toLocaleDateString('vi-VN', {
                                            day: '2-digit',
                                            month: '2-digit',
                                            year: 'numeric'
                                        })}
                                    </p>
                                </div>
                            </div>
                        </div>

                        {/* Passengers - Compact */}
                        <div className="bg-white rounded-lg shadow-md p-3">
                            <h2 className="text-base font-bold text-gray-800 mb-2">Hành khách ({booking.veXe.length})</h2>
                            <div className="space-y-1.5">
                                {booking.veXe.map((ticket, index) => (
                                    <div key={index} className="flex justify-between items-center p-2 bg-gray-50 rounded text-xs">
                                        <div className="flex-1">
                                            <p className="font-semibold">{ticket.hoTenHanhKhach}</p>
                                            <p className="text-gray-600">Vé: {ticket.soVe}</p>
                                        </div>
                                        <div className="text-right">
                                            <p className="text-blue-600 font-bold">Ghế {ticket.soGhe}</p>
                                            <p className="text-gray-600">{formatPrice(ticket.giaVe)}</p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>

                    {/* Right Column */}
                    <div className="space-y-3">
                        {/* Payment Info */}
                        <div className="bg-white rounded-lg shadow-md p-3">
                            <h2 className="text-base font-bold text-gray-800 mb-2">Thanh toán</h2>
                            <div className="space-y-1.5">
                                <div className="flex justify-between py-1.5 border-b text-xs">
                                    <span className="text-gray-600">Phương thức</span>
                                    <span className="font-semibold">{booking.phuongThucThanhToan || 'Chuyển khoản'}</span>
                                </div>
                                <div className="flex justify-between py-1.5 border-b text-xs">
                                    <span className="text-gray-600">Trạng thái</span>
                                    <span className="text-green-600 font-semibold">✓ Đã thanh toán</span>
                                </div>
                                <div className="flex justify-between py-2 bg-blue-50 px-2 rounded-lg">
                                    <span className="text-sm font-semibold">Tổng tiền</span>
                                    <span className="text-lg font-bold text-blue-600">{formatPrice(booking.tongTien)}</span>
                                </div>
                            </div>
                        </div>

                        {/* Important Notes - Compact */}
                        <div className="bg-yellow-50 border-l-4 border-yellow-400 p-2.5 rounded-r-lg">
                            <h3 className="font-bold text-xs text-yellow-800 mb-1">📌 Lưu ý</h3>
                            <ul className="text-xs text-yellow-700 space-y-0.5">
                                <li>• Có mặt trước 15 phút</li>
                                <li>• Xuất trình mã đơn khi lên xe</li>
                                <li>• Liên hệ nhà xe nếu cần hỗ trợ</li>
                            </ul>
                        </div>

                        {/* Action Buttons */}
                        <div className="grid grid-cols-2 gap-2">
                            <button
                                onClick={handlePrint}
                                className="bg-white border-2 border-blue-600 text-blue-600 py-2 rounded-lg font-semibold hover:bg-blue-50 transition flex items-center justify-center gap-1.5 text-xs"
                            >
                                <FaPrint /> In vé
                            </button>
                            <button
                                onClick={handleSendEmail}
                                className="bg-white border-2 border-blue-600 text-blue-600 py-2 rounded-lg font-semibold hover:bg-blue-50 transition flex items-center justify-center gap-1.5 text-xs"
                            >
                                <FaEnvelope /> Gửi email
                            </button>
                        </div>

                        {/* Back Button */}
                        <button
                            onClick={() => router.push('/xekhach')}
                            className="w-full bg-blue-600 text-white py-2 rounded-lg font-semibold hover:bg-blue-700 transition text-sm"
                        >
                            Quay lại trang chủ
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}
