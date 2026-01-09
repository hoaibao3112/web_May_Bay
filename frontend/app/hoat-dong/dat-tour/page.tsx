'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function ActivityBookingPage() {
    const router = useRouter();
    const [bookingData, setBookingData] = useState<any>(null);
    const [loading, setLoading] = useState(true);
    const [processing, setProcessing] = useState(false);
    const [timeLeft, setTimeLeft] = useState(900); // 15 minutes
    const [paymentMethod, setPaymentMethod] = useState('VNPAY');
    const [error, setError] = useState('');

    // Customer info
    const [hoTen, setHoTen] = useState('');
    const [email, setEmail] = useState('');
    const [soDienThoai, setSoDienThoai] = useState('');
    const [ghiChu, setGhiChu] = useState('');

    useEffect(() => {
        // Load booking data from localStorage
        const data = localStorage.getItem('activityBooking');
        if (data) {
            setBookingData(JSON.parse(data));
        } else {
            router.push('/hoat-dong');
        }
        setLoading(false);
    }, []);

    useEffect(() => {
        // Countdown timer
        const timer = setInterval(() => {
            setTimeLeft((prev) => {
                if (prev <= 1) {
                    clearInterval(timer);
                    alert('Hết thời gian giữ chỗ!');
                    router.push('/hoat-dong');
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
        // Validate form
        if (!hoTen || !email || !soDienThoai) {
            setError('Vui lòng điền đầy đủ thông tin liên hệ');
            return;
        }

        setProcessing(true);
        setError('');

        try {
            // 1. Create booking
            const bookingRes = await fetch('http://localhost:5000/activities/bookings', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    hoatDongId: bookingData.hoatDongId,
                    ngayThucHien: bookingData.ngayThucHien,
                    soNguoiLon: bookingData.soNguoiLon,
                    soTreEm: bookingData.soTreEm,
                    hoTen,
                    email,
                    soDienThoai,
                    ghiChu,
                }),
            });

            if (!bookingRes.ok) {
                throw new Error('Không thể tạo đặt chỗ');
            }

            const booking = await bookingRes.json();

            // 2. Create payment
            const paymentRes = await fetch('http://localhost:5000/payments', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    bookingId: 0, // Activities don't have bookingId yet, use orderId
                    phuongThuc: paymentMethod,
                    soTien: bookingData.tongTien,
                    thongTinDonHang: `Đặt tour: ${bookingData.tenHoatDong}`,
                }),
            });

            if (!paymentRes.ok) {
                throw new Error('Không thể tạo thanh toán');
            }

            const payment = await paymentRes.json();

            // 3. Redirect to payment gateway
            if (payment.paymentUrl) {
                window.location.href = payment.paymentUrl;
            } else {
                throw new Error('Không nhận được URL thanh toán');
            }
        } catch (error: any) {
            console.error('Error:', error);
            setError(error.message || 'Có lỗi xảy ra, vui lòng thử lại');
            setProcessing(false);
        }
    };

    if (loading || !bookingData) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="inline-block h-12 w-12 animate-spin rounded-full border-4 border-solid border-pink-500 border-r-transparent"></div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50">
            {/* Header */}
            <div className="bg-white border-b">
                <div className="container mx-auto px-4 py-4">
                    <div className="flex items-center justify-between">
                        <h1 className="text-2xl font-bold text-gray-900">Đặt tour & Thanh toán</h1>
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
                        {/* Tour Info */}
                        <div className="bg-white rounded-lg shadow-sm p-6">
                            <h2 className="text-xl font-bold text-gray-900 mb-4">Thông tin tour</h2>
                            <div className="space-y-3">
                                <div>
                                    <div className="font-semibold text-gray-900 text-lg">{bookingData.tenHoatDong}</div>
                                    <div className="text-gray-600 text-sm mt-1">
                                        📅 {new Date(bookingData.ngayThucHien).toLocaleDateString('vi-VN')}
                                    </div>
                                </div>
                                <div className="flex gap-4 text-sm text-gray-600">
                                    <span>👥 {bookingData.soNguoiLon} người lớn</span>
                                    {bookingData.soTreEm > 0 && <span>👶 {bookingData.soTreEm} trẻ em</span>}
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
                                        className="w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-transparent"
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
                                        className="w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-transparent"
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
                                        className="w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-transparent"
                                        required
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        Ghi chú (tùy chọn)
                                    </label>
                                    <textarea
                                        value={ghiChu}
                                        onChange={(e) => setGhiChu(e.target.value)}
                                        rows={3}
                                        placeholder="Yêu cầu đặc biệt..."
                                        className="w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-transparent"
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
                                    style={{ borderColor: paymentMethod === 'VNPAY' ? '#0088cc' : '#e5e7eb' }}
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
                                        <div className="font-semibold text-gray-900">VNPay</div>
                                        <div className="text-sm text-gray-600">Thanh toán qua VNPay - Hỗ trợ nhiều ngân hàng</div>
                                    </div>
                                    <img src="/vnpay-logo.png" alt="VNPay" className="h-8" onError={(e) => e.currentTarget.style.display = 'none'} />
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
                                            <span className="text-xs bg-orange-100 text-orange-700 px-2 py-0.5 rounded-full">Demo</span>
                                        </div>
                                        <div className="text-sm text-gray-600">Ví điện tử MoMo - Nhanh chóng & tiện lợi</div>
                                    </div>
                                </label>

                                {/* VietQR */}
                                <label className="flex items-center gap-4 p-4 border-2 rounded-lg cursor-pointer hover:bg-gray-50 transition"
                                    style={{ borderColor: paymentMethod === 'VIETQR' ? '#0088cc' : '#e5e7eb' }}
                                >
                                    <input
                                        type="radio"
                                        name="payment"
                                        value="VIETQR"
                                        checked={paymentMethod === 'VIETQR'}
                                        onChange={(e) => setPaymentMethod(e.target.value)}
                                        className="w-5 h-5 text-blue-600"
                                    />
                                    <div className="flex-1">
                                        <div className="flex items-center gap-2">
                                            <span className="font-semibold text-gray-900">VietQR</span>
                                            <span className="text-xs bg-green-100 text-green-700 px-2 py-0.5 rounded-full">Miễn phí</span>
                                        </div>
                                        <div className="text-sm text-gray-600">Chuyển khoản qua mã QR - Nhanh & an toàn</div>
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
                                    <span>{bookingData.soNguoiLon} × Người lớn</span>
                                    <span>{formatCurrency(bookingData.tongTien / (bookingData.soNguoiLon + bookingData.soTreEm * 0.7) * bookingData.soNguoiLon)}</span>
                                </div>
                                {bookingData.soTreEm > 0 && (
                                    <div className="flex justify-between text-gray-600">
                                        <span>{bookingData.soTreEm} × Trẻ em</span>
                                        <span>{formatCurrency(bookingData.tongTien / (bookingData.soNguoiLon + bookingData.soTreEm * 0.7) * bookingData.soTreEm * 0.7)}</span>
                                    </div>
                                )}
                            </div>

                            <div className="flex justify-between text-xl font-bold text-gray-900 mb-6">
                                <span>Tổng cộng</span>
                                <span className="text-pink-600">{formatCurrency(bookingData.tongTien)}</span>
                            </div>

                            <button
                                onClick={handlePayment}
                                disabled={processing || !hoTen || !email || !soDienThoai}
                                className="w-full py-4 bg-gradient-to-r from-pink-500 to-rose-500 text-white rounded-lg font-bold text-lg hover:from-pink-600 hover:to-rose-600 disabled:opacity-50 disabled:cursor-not-allowed transition shadow-lg"
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
                                        <li>✓ Hoàn tiền nếu có sự cố</li>
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
