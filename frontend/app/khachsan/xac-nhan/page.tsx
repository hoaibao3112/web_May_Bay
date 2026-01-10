'use client';

import { useEffect, useState, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';

function HotelConfirmationContent() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const [booking, setBooking] = useState<any>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        // Load booking from localStorage
        const data = localStorage.getItem('hotelBookingConfirm');
        if (data) {
            setBooking(JSON.parse(data));
        } else {
            router.push('/khachsan');
        }
        setLoading(false);
    }, []);

    const formatCurrency = (amount: number) => {
        return new Intl.NumberFormat('vi-VN', {
            style: 'currency',
            currency: 'VND',
        }).format(amount);
    };

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="inline-block h-12 w-12 animate-spin rounded-full border-4 border-solid border-blue-500 border-r-transparent"></div>
            </div>
        );
    }

    if (!booking) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="text-center">
                    <h1 className="text-2xl font-bold mb-4">Không tìm thấy thông tin đặt phòng</h1>
                    <Link href="/khachsan" className="text-blue-600 hover:underline">
                        Quay lại trang khách sạn
                    </Link>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
            <div className="max-w-2xl w-full bg-white rounded-lg shadow-lg p-8 text-center">
                {/* Success Icon */}
                <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
                    <svg className="w-12 h-12 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                    </svg>
                </div>

                {/* Success Message */}
                <h1 className="text-3xl font-bold text-gray-900 mb-2">Đặt phòng thành công!</h1>
                <p className="text-gray-600 mb-2">
                    Cảm ơn <strong>{booking.hoTen}</strong> đã đặt phòng
                </p>
                <p className="text-sm text-gray-500 mb-8">
                    Xác nhận đã được gửi đến <strong>{booking.email}</strong>
                </p>

                {/* Booking Details */}
                <div className="bg-gray-50 rounded-lg p-6 mb-6 text-left">
                    <h2 className="font-bold text-lg mb-4 text-center">Chi tiết đặt phòng</h2>
                    <div className="space-y-3">
                        <div className="flex justify-between border-b pb-2">
                            <span className="text-gray-600">Mã đơn:</span>
                            <span className="font-semibold text-blue-600">{booking.orderId}</span>
                        </div>
                        <div className="flex justify-between border-b pb-2">
                            <span className="text-gray-600">Khách sạn:</span>
                            <span className="font-semibold">{booking.tenKhachSan}</span>
                        </div>
                        <div className="flex justify-between border-b pb-2">
                            <span className="text-gray-600">Loại phòng:</span>
                            <span className="font-semibold">{booking.tenPhong}</span>
                        </div>
                        <div className="flex justify-between border-b pb-2">
                            <span className="text-gray-600">Nhận phòng:</span>
                            <span className="font-semibold">
                                {new Date(booking.ngayNhanPhong).toLocaleDateString('vi-VN')}
                            </span>
                        </div>
                        <div className="flex justify-between border-b pb-2">
                            <span className="text-gray-600">Trả phòng:</span>
                            <span className="font-semibold">
                                {new Date(booking.ngayTraPhong).toLocaleDateString('vi-VN')}
                            </span>
                        </div>
                        <div className="flex justify-between border-b pb-2">
                            <span className="text-gray-600">Số đêm:</span>
                            <span className="font-semibold">{booking.soDem} đêm</span>
                        </div>
                        <div className="flex justify-between border-b pb-2">
                            <span className="text-gray-600">Số khách:</span>
                            <span className="font-semibold">{booking.soNguoi} người - {booking.soPhong} phòng</span>
                        </div>
                        <div className="flex justify-between border-b pb-2">
                            <span className="text-gray-600">Thanh toán qua:</span>
                            <span className="font-semibold">{booking.phuongThucThanhToan}</span>
                        </div>
                        <div className="flex justify-between pt-3 border-t-2">
                            <span className="text-gray-900 font-bold text-lg">Tổng tiền:</span>
                            <span className="text-blue-600 font-bold text-xl">
                                {formatCurrency(booking.tongTien)}
                            </span>
                        </div>
                    </div>
                </div>

                {/* Contact Info */}
                <div className="bg-blue-50 rounded-lg p-4 mb-6 text-sm text-left">
                    <div className="font-semibold mb-2">📧 Thông tin liên hệ</div>
                    <div className="space-y-1 text-gray-700">
                        <div><strong>Email:</strong> {booking.email}</div>
                        <div><strong>Số điện thoại:</strong> {booking.soDienThoai}</div>
                        {booking.ghiChu && <div><strong>Yêu cầu đặc biệt:</strong> {booking.ghiChu}</div>}
                    </div>
                </div>

                {/* Actions */}
                <div className="flex gap-4">
                    <Link
                        href="/"
                        className="flex-1 px-6 py-3 border border-gray-300 rounded-lg font-semibold hover:bg-gray-50 transition"
                    >
                        Về trang chủ
                    </Link>
                    <Link
                        href="/khachsan"
                        className="flex-1 px-6 py-3 bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-lg font-semibold hover:from-blue-600 hover:to-blue-700 transition"
                    >
                        Tìm khách sạn khác
                    </Link>
                </div>

                {/* Note */}
                <p className="text-sm text-gray-500 mt-6">
                    💡 Vui lòng kiểm tra email để xem chi tiết đặt phòng. Nếu có thắc mắc, liên hệ hotline: <strong>1900-xxxx</strong>
                </p>
            </div>
        </div>
    );
}

export default function HotelConfirmationPage() {
    return (
        <Suspense fallback={
            <div className="min-h-screen flex items-center justify-center">
                <div className="inline-block h-12 w-12 animate-spin rounded-full border-4 border-solid border-blue-500 border-r-transparent"></div>
            </div>
        }>
            <HotelConfirmationContent />
        </Suspense>
    );
}
