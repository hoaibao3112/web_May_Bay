'use client';

import { useState, useEffect, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';

function HotelBookingContent() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const [loading, setLoading] = useState(true);
    const [processing, setProcessing] = useState(false);
    const [error, setError] = useState('');
    const [timeLeft, setTimeLeft] = useState(900); // 15 minutes

    // Booking data from URL/localStorage
    const [bookingData, setBookingData] = useState<any>(null);
    const [paymentMethod, setPaymentMethod] = useState('VNPAY');

    // Customer info
    const [hoTen, setHoTen] = useState('');
    const [email, setEmail] = useState('');
    const [soDienThoai, setSoDienThoai] = useState('');
    const [ghiChu, setGhiChu] = useState('');

    useEffect(() => {
        // Load booking data from localStorage
        const data = localStorage.getItem('hotelBooking');
        if (data) {
            setBookingData(JSON.parse(data));
        } else {
            router.push('/khachsan');
        }
        setLoading(false);
    }, []);

    useEffect(() => {
        // Countdown timer
        const timer = setInterval(() => {
            setTimeLeft((prev) => {
                if (prev <= 1) {
                    clearInterval(timer);
                    alert('Hết thời gian giữ phòng!');
                    router.push('/khachsan');
                    return 0;
                }
                return prev - 1;
            });
        }, 1000);

        return () => clearInterval(timer);
    }, []);

    const formatTime = (seconds: number) => {
        const mins = Math.floor(seconds / 60);
        const secs = seconds % 60;
        return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
    };

    const formatCurrency = (amount: number) => {
        return new Intl.NumberFormat('vi-VN', {
            style: 'currency',
            currency: 'VND',
        }).format(amount);
    };

    const handlePayment = async () => {
        if (!hoTen || !email || !soDienThoai) {
            setError('Vui lòng điền đầy đủ thông tin liên hệ');
            return;
        }

        setProcessing(true);
        setError('');

        try {
            // Get user token if logged in
            const token = localStorage.getItem('token') || localStorage.getItem('accessToken');
            const headers: any = {
                'Content-Type': 'application/json',
            };
            if (token) {
                headers['Authorization'] = `Bearer ${token}`;
            }

            // Step 1: Create booking in database
            const bookingPayload = {
                khachSanId: bookingData.khachSanId,
                phongId: bookingData.phongId,
                ngayNhanPhong: bookingData.ngayNhanPhong,
                ngayTraPhong: bookingData.ngayTraPhong,
                soLuongPhong: bookingData.soPhong,
                soNguoiLon: bookingData.soNguoi,
                soTreEm: 0,
                tenKhachHang: hoTen,
                email,
                soDienThoai,
                yeuCauDacBiet: ghiChu,
            };

            console.log('📤 Sending booking payload:', bookingPayload);
            console.log('📦 Raw bookingData:', bookingData);

            const bookingRes = await fetch('http://localhost:5000/api/hotel-bookings', {
                method: 'POST',
                headers,
                body: JSON.stringify(bookingPayload),
            });

            if (!bookingRes.ok) {
                throw new Error('Không thể tạo đơn đặt phòng');
            }

            const booking = await bookingRes.json();
            console.log('✅ Booking created:', booking);

            // Step 2: Create payment
            const paymentRes = await fetch(`http://localhost:5000/api/hotel-bookings/${booking.id}/payment`, {
                method: 'POST',
                headers,
                body: JSON.stringify({
                    phuongThuc: paymentMethod,
                }),
            });

            if (!paymentRes.ok) {
                throw new Error('Không thể tạo thanh toán');
            }

            const paymentData = await paymentRes.json();
            console.log('✅ Payment created:', paymentData);

            // Step 3: Redirect to payment gateway
            window.location.href = paymentData.paymentUrl;
        } catch (error: any) {
            console.error('Error:', error);
            setError(error.message || 'Có lỗi xảy ra, vui lòng thử lại');
            setProcessing(false);
        }
    };

    if (loading || !bookingData) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="inline-block h-12 w-12 animate-spin rounded-full border-4 border-solid border-blue-500 border-r-transparent"></div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50">
            {/* Header */}
            <div className="bg-white border-b">
                <div className="container mx-auto px-4 py-4">
                    <div className="flex items-center justify-between">
                        <h1 className="text-2xl font-bold text-gray-900">Đặt phòng & Thanh toán</h1>
                        <div className="flex items-center gap-3">
                            <span className="text-gray-600">Thời gian còn lại:</span>
                            <div className={`text-2xl font-bold ${timeLeft < 300 ? 'text-red-600' : 'text-green-600'}`}>
                                {formatTime(timeLeft)}
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <div className="container mx-auto px-4 py-8">
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    {/* Left Column - Form */}
                    <div className="lg:col-span-2 space-y-6">
                        {/* Hotel Info */}
                        <div className="bg-white rounded-lg shadow-sm p-6">
                            <h2 className="text-xl font-bold text-gray-900 mb-4">Thông tin đặt phòng</h2>
                            <div className="space-y-3">
                                <div>
                                    <div className="font-semibold text-gray-900 text-lg">{bookingData.tenKhachSan}</div>
                                    <div className="text-gray-600 text-sm mt-1">
                                        📍 {bookingData.diaChi}
                                    </div>
                                </div>
                                <div className="grid grid-cols-2 gap-4 text-sm">
                                    <div>
                                        <div className="text-gray-600">Nhận phòng</div>
                                        <div className="font-semibold">{new Date(bookingData.ngayNhanPhong).toLocaleDateString('vi-VN')}</div>
                                    </div>
                                    <div>
                                        <div className="text-gray-600">Trả phòng</div>
                                        <div className="font-semibold">{new Date(bookingData.ngayTraPhong).toLocaleDateString('vi-VN')}</div>
                                    </div>
                                </div>
                                <div className="flex gap-4 text-sm text-gray-600">
                                    <span>👥 {bookingData.soNguoi} khách</span>
                                    <span>🏠 {bookingData.soPhong} phòng</span>
                                    <span>🌙 {bookingData.soDem} đêm</span>
                                </div>
                                <div className="border-t pt-3">
                                    <div className="font-semibold text-gray-900">{bookingData.tenPhong}</div>
                                    <div className="text-sm text-gray-600">{bookingData.loaiPhong}</div>
                                </div>
                            </div>
                        </div>

                        {/* Customer Info */}
                        <div className="bg-white rounded-lg shadow-sm p-6">
                            <h2 className="text-xl font-bold text-gray-900 mb-4">Thông tin liên hệ</h2>
                            <div className="space-y-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        Họ và tên <span className="text-red-500">*</span>
                                    </label>
                                    <input
                                        type="text"
                                        value={hoTen}
                                        onChange={(e) => setHoTen(e.target.value)}
                                        placeholder="Nguyễn Văn A"
                                        className="w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                        required
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        Email <span className="text-red-500">*</span>
                                    </label>
                                    <input
                                        type="email"
                                        value={email}
                                        onChange={(e) => setEmail(e.target.value)}
                                        placeholder="example@email.com"
                                        className="w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                        required
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        Số điện thoại <span className="text-red-500">*</span>
                                    </label>
                                    <input
                                        type="tel"
                                        value={soDienThoai}
                                        onChange={(e) => setSoDienThoai(e.target.value)}
                                        placeholder="0912345678"
                                        className="w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                        required
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        Yêu cầu đặc biệt (tùy chọn)
                                    </label>
                                    <textarea
                                        value={ghiChu}
                                        onChange={(e) => setGhiChu(e.target.value)}
                                        rows={3}
                                        placeholder="VD: Phòng tầng cao, giường đôi..."
                                        className="w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                    />
                                </div>
                            </div>
                        </div>

                        {/* Payment Methods */}
                        <div className="bg-white rounded-lg shadow-sm p-6">
                            <h2 className="text-xl font-bold text-gray-900 mb-4">Phương thức thanh toán</h2>

                            {error && (
                                <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-lg text-red-700">
                                    {error}
                                </div>
                            )}

                            <div className="space-y-3">
                                {/* VNPay */}
                                <label className="flex items-center gap-4 p-4 border-2 rounded-lg cursor-pointer hover:bg-gray-50 transition"
                                    style={{ borderColor: paymentMethod === 'VNPAY' ? '#0066cc' : '#e5e7eb' }}
                                >
                                    <input
                                        type="radio"
                                        name="payment"
                                        value="VNPAY"
                                        checked={paymentMethod === 'VNPAY'}
                                        onChange={(e) => setPaymentMethod(e.target.value)}
                                        className="w-5 h-5 text-blue-600"
                                    />
                                    <div className="flex-1">
                                        <div className="flex items-center gap-2">
                                            <span className="font-semibold text-gray-900">VNPay</span>
                                        </div>
                                        <div className="text-sm text-gray-600">Cổng thanh toán VNPay - An toàn & nhanh chóng</div>
                                    </div>
                                </label>

                                {/* ZaloPay */}
                                <label className="flex items-center gap-4 p-4 border-2 rounded-lg cursor-pointer hover:bg-gray-50 transition"
                                    style={{ borderColor: paymentMethod === 'ZALOPAY' ? '#0088cc' : '#e5e7eb' }}
                                >
                                    <input
                                        type="radio"
                                        name="payment"
                                        value="ZALOPAY"
                                        checked={paymentMethod === 'ZALOPAY'}
                                        onChange={(e) => setPaymentMethod(e.target.value)}
                                        className="w-5 h-5 text-blue-600"
                                    />
                                    <div className="flex-1">
                                        <div className="flex items-center gap-2">
                                            <span className="font-semibold text-gray-900">ZaloPay</span>
                                        </div>
                                        <div className="text-sm text-gray-600">Ví điện tử quốc dân - An toàn & tiện lợi</div>
                                    </div>
                                </label>

                                {/* MoMo */}
                                <label className="flex items-center gap-4 p-4 border-2 rounded-lg cursor-pointer hover:bg-gray-50 transition"
                                    style={{ borderColor: paymentMethod === 'MOMO' ? '#a50064' : '#e5e7eb' }}
                                >
                                    <input
                                        type="radio"
                                        name="payment"
                                        value="MOMO"
                                        checked={paymentMethod === 'MOMO'}
                                        onChange={(e) => setPaymentMethod(e.target.value)}
                                        className="w-5 h-5 text-pink-600"
                                    />
                                    <div className="flex-1">
                                        <div className="flex items-center gap-2">
                                            <span className="font-semibold text-gray-900">MoMo</span>
                                        </div>
                                        <div className="text-sm text-gray-600">Ví điện tử MoMo - Nhanh chóng & tiện lợi</div>
                                    </div>
                                </label>
                            </div>
                        </div>
                    </div>

                    {/* Right Column - Summary */}
                    <div className="lg:col-span-1">
                        <div className="bg-white rounded-lg shadow-lg p-6 sticky top-4">
                            <h2 className="text-xl font-bold text-gray-900 mb-4">Chi tiết thanh toán</h2>

                            <div className="space-y-3 mb-4 pb-4 border-b">
                                <div className="flex justify-between text-gray-600">
                                    <span>{bookingData.giaPhong && formatCurrency(bookingData.giaPhong)} x {bookingData.soDem} đêm</span>
                                    <span>{formatCurrency(bookingData.giaPhong * bookingData.soDem)}</span>
                                </div>
                                <div className="flex justify-between text-gray-600">
                                    <span>Thuế & phí dịch vụ</span>
                                    <span>{formatCurrency(bookingData.giaPhong * bookingData.soDem * 0.1)}</span>
                                </div>
                            </div>

                            <div className="flex justify-between text-xl font-bold text-gray-900 mb-6">
                                <span>Tổng cộng</span>
                                <span className="text-blue-600">{formatCurrency(bookingData.tongTien)}</span>
                            </div>

                            <button
                                onClick={handlePayment}
                                disabled={processing || !hoTen || !email || !soDienThoai}
                                className="w-full py-4 bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-lg font-bold text-lg hover:from-blue-600 hover:to-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition shadow-lg"
                            >
                                {processing ? (
                                    <span className="flex items-center justify-center gap-2">
                                        <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                                        Đang xử lý...
                                    </span>
                                ) : (
                                    `Thanh toán ${formatCurrency(bookingData.tongTien)}`
                                )}
                            </button>

                            <div className="mt-4 p-4 bg-blue-50 rounded-lg">
                                <div className="text-sm text-gray-700">
                                    <div className="font-semibold mb-2">🔒 Thanh toán an toàn</div>
                                    <ul className="space-y-1 text-xs">
                                        <li>✓ Mã hóa SSL 128-bit</li>
                                        <li>✓ Bảo mật thông tin thanh toán</li>
                                        <li>✓ Hoàn tiền theo chính sách</li>
                                    </ul>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default function HotelBookingPage() {
    return (
        <Suspense fallback={
            <div className="min-h-screen flex items-center justify-center">
                <div className="inline-block h-12 w-12 animate-spin rounded-full border-4 border-solid border-blue-500 border-r-transparent"></div>
            </div>
        }>
            <HotelBookingContent />
        </Suspense>
    );
}
