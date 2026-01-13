'use client';

import { useEffect, useState, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';

function ConfirmationContent() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const [booking, setBooking] = useState<any>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const maDat = searchParams.get('maDat') || localStorage.getItem('lastBookingCode');

        if (maDat) {
            fetchBooking(maDat);
        } else {
            router.push('/hoat-dong');
        }
    }, [searchParams]);

    const fetchBooking = async (maDat: string) => {
        try {
            const res = await fetch(`http://localhost:5000/api/activities/bookings/${maDat}`);
            if (!res.ok) throw new Error('Booking not found');
            const data = await res.json();
            setBooking(data);
        } catch (error) {
            console.error('Error:', error);
            router.push('/hoat-dong');
        } finally {
            setLoading(false);
        }
    };

    const formatCurrency = (amount: number) => {
        return new Intl.NumberFormat('vi-VN', {
            style: 'currency',
            currency: 'VND',
        }).format(amount);
    };

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="inline-block h-12 w-12 animate-spin rounded-full border-4 border-solid border-pink-500 border-r-transparent"></div>
            </div>
        );
    }

    if (!booking) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="text-center">
                    <h1 className="text-2xl font-bold mb-4">Không tìm thấy đơn đặt chỗ</h1>
                    <Link href="/hoat-dong" className="text-pink-600 hover:underline">
                        Quay lại trang hoạt động
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
                <h1 className="text-3xl font-bold text-gray-900 mb-2">Đặt tour thành công!</h1>
                <p className="text-gray-600 mb-2">
                    Cảm ơn <strong>{booking.hoTen}</strong> đã đặt tour
                </p>
                <p className="text-sm text-gray-500 mb-8">
                    Xác nhận đã được gửi đến <strong>{booking.email}</strong>
                </p>

                {/* Booking Details */}
                <div className="bg-gray-50 rounded-lg p-6 mb-6 text-left">
                    <h2 className="font-bold text-lg mb-4 text-center">Chi tiết đặt tour</h2>
                    <div className="space-y-3">
                        <div className="flex justify-between border-b pb-2">
                            <span className="text-gray-600">Mã đơn:</span>
                            <span className="font-semibold text-pink-600">{booking.maDat}</span>
                        </div>
                        <div className="flex justify-between border-b pb-2">
                            <span className="text-gray-600">Tour:</span>
                            <span className="font-semibold">{booking.hoatDong?.tenHoatDong}</span>
                        </div>
                        <div className="flex justify-between border-b pb-2">
                            <span className="text-gray-600">Ngày:</span>
                            <span className="font-semibold">
                                {new Date(booking.ngayThucHien).toLocaleDateString('vi-VN')}
                            </span>
                        </div>
                        <div className="flex justify-between border-b pb-2">
                            <span className="text-gray-600">Số người:</span>
                            <span className="font-semibold">
                                {booking.soNguoiLon} người lớn
                                {booking.soTreEm > 0 && `, ${booking.soTreEm} trẻ em`}
                            </span>
                        </div>
                        <div className="flex justify-between border-b pb-2">
                            <span className="text-gray-600">Trạng thái:</span>
                            <span className={`font-semibold ${booking.daThanhToan ? 'text-green-600' : 'text-orange-600'}`}>
                                {booking.daThanhToan ? '✓ Đã thanh toán' : '⏳ Chờ thanh toán'}
                            </span>
                        </div>
                        <div className="flex justify-between pt-3 border-t-2">
                            <span className="text-gray-900 font-bold text-lg">Tổng tiền:</span>
                            <span className="text-pink-600 font-bold text-xl">
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
                        {booking.ghiChu && <div><strong>Ghi chú:</strong> {booking.ghiChu}</div>}
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
                    💡 Vui lòng kiểm tra email để xem chi tiết đặt tour. Nếu có thắc mắc, liên hệ hotline: <strong>1900-xxxx</strong>
                </p>
            </div>
        </div>
    );
}

export default function ActivityConfirmationPage() {
    return (
        <Suspense fallback={
            <div className="min-h-screen flex items-center justify-center">
                <div className="inline-block h-12 w-12 animate-spin rounded-full border-4 border-solid border-pink-500 border-r-transparent"></div>
            </div>
        }>
            <ConfirmationContent />
        </Suspense>
    );
}
