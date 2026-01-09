'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

export default function ActivityConfirmationPage() {
    const router = useRouter();

    useEffect(() => {
        // Check if payment was successful
        const bookingData = localStorage.getItem('activityBookingConfirm');
        if (!bookingData) {
            router.push('/hoat-dong');
        }
    }, []);

    const formatCurrency = (amount: number) => {
        return new Intl.NumberFormat('vi-VN', {
            style: 'currency',
            currency: 'VND',
        }).format(amount);
    };

    const bookingData = JSON.parse(localStorage.getItem('activityBookingConfirm') || '{}');

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
                <h1 className="text-3xl font-bold text-gray-900 mb-2">Đặt tour thành công!</h1>
                <p className="text-gray-600 mb-8">
                    Cảm ơn bạn đã đặt tour. Chúng tôi đã gửi email xác nhận đến <strong>{bookingData.email}</strong>
                </p>

                {/* Booking Details */}
                <div className="bg-gray-50 rounded-lg p-6 mb-6 text-left">
                    <h2 className="font-bold text-lg mb-4">Chi tiết đặt tour</h2>
                    <div className="space-y-3">
                        <div className="flex justify-between">
                            <span className="text-gray-600">Mã đơn:</span>
                            <span className="font-semibold">{bookingData.orderId}</span>
                        </div>
                        <div className="flex justify-between">
                            <span className="text-gray-600">Tour:</span>
                            <span className="font-semibold">{bookingData.tenHoatDong}</span>
                        </div>
                        <div className="flex justify-between">
                            <span className="text-gray-600">Ngày:</span>
                            <span className="font-semibold">
                                {bookingData.ngayThucHien && new Date(bookingData.ngayThucHien).toLocaleDateString('vi-VN')}
                            </span>
                        </div>
                        <div className="flex justify-between">
                            <span className="text-gray-600">Số người:</span>
                            <span className="font-semibold">
                                {bookingData.soNguoiLon} người lớn
                                {bookingData.soTreEm > 0 && `, ${bookingData.soTreEm} trẻ em`}
                            </span>
                        </div>
                        <div className="flex justify-between pt-3 border-t">
                            <span className="text-gray-900 font-bold">Tổng tiền:</span>
                            <span className="text-pink-600 font-bold text-xl">
                                {formatCurrency(bookingData.tongTien || 0)}
                            </span>
                        </div>
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
                        href="/hoat-dong"
                        className="flex-1 px-6 py-3 bg-gradient-to-r from-pink-500 to-rose-500 text-white rounded-lg font-semibold hover:from-pink-600 hover:to-rose-600 transition"
                    >
                        Khám phá thêm
                    </Link>
                </div>

                {/* Note */}
                <p className="text-sm text-gray-500 mt-6">
                    💡 Bạn sẽ nhận được email xác nhận trong vòng 24 giờ. Vui lòng kiểm tra hộp thư spam nếu không thấy email.
                </p>
            </div>
        </div>
    );
}
