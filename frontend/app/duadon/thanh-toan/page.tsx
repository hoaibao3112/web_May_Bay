'use client';

import { useState, useEffect } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { FaCar, FaClock, FaMapMarkerAlt, FaCreditCard, FaLock, FaCheckCircle } from 'react-icons/fa';
import { MdPayment, MdAccountBalance } from 'react-icons/md';

interface BookingDetail {
    id: number;
    loaiDichVu: string;
    ngayDon: string;
    diemDon: string;
    diemTra: string;
    tongTien: number;
    trangThaiThanhToan: string;
    nhaCungCap: {
        ten: string;
        logo: string;
    };
    sanBay: {
        ten: string;
        ma: string;
    };
    dichVu: {
        loaiXe: string;
        soChoNgoi: number;
    };
}

export default function AirportTransferPaymentPage() {
    const searchParams = useSearchParams();
    const router = useRouter();
    const bookingId = searchParams.get('bookingId');

    const [booking, setBooking] = useState<BookingDetail | null>(null);
    const [loading, setLoading] = useState(true);
    const [paymentMethod, setPaymentMethod] = useState('MOMO');
    const [processing, setProcessing] = useState(false);
    const [error, setError] = useState('');
    const [timeLeft, setTimeLeft] = useState(600); // 10 minutes

    useEffect(() => {
        if (bookingId) {
            fetchBookingDetail();
        }
    }, [bookingId]);

    useEffect(() => {
        if (timeLeft <= 0) {
            alert('Hết thời gian thanh toán! Vui lòng đặt lại.');
            router.push('/duadon');
            return;
        }
        const timer = setInterval(() => setTimeLeft(prev => prev - 1), 1000);
        return () => clearInterval(timer);
    }, [timeLeft, router]);

    const fetchBookingDetail = async () => {
        try {
            const res = await fetch(`http://localhost:5000/api/airport-transfer-bookings/${bookingId}`);
            if (res.ok) {
                const data = await res.json();
                setBooking(data);
            }
        } catch (error) {
            console.error('Error fetching booking:', error);
        } finally {
            setLoading(false);
        }
    };

    const handlePayment = async () => {
        if (!paymentMethod) {
            setError('Vui lòng chọn phương thức thanh toán');
            return;
        }

        setProcessing(true);
        setError('');

        try {
            // Call backend API to create payment URL
            const res = await fetch(`http://localhost:5000/api/airport-transfer-bookings/${bookingId}/create-payment`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    phuongThuc: paymentMethod,
                }),
            });

            if (!res.ok) {
                const errorData = await res.json();
                throw new Error(errorData.message || 'Không thể tạo URL thanh toán');
            }

            const result = await res.json();

            // Redirect to payment URL
            if (result.paymentUrl) {
                window.location.href = result.paymentUrl;
            } else {
                throw new Error('Không nhận được URL thanh toán');
            }
        } catch (error: any) {
            console.error('Payment error:', error);
            setError(error.message || 'Có lỗi xảy ra, vui lòng thử lại');
            setProcessing(false);
        }
    };

    const formatTime = (s: number) => {
        const m = Math.floor(s / 60);
        const sec = s % 60;
        return `${m}:${sec.toString().padStart(2, '0')}`;
    };

    const formatPrice = (p: number) => new Intl.NumberFormat('vi-VN').format(p) + ' VNĐ';

    if (loading || !booking) {
        return (
            <div className="min-h-screen bg-gray-50 flex items-center justify-center">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50 py-12">
            <div className="max-w-4xl mx-auto px-4 sm:px-6">
                {/* Progress */}
                <div className="flex items-center justify-center mb-8">
                    <div className="flex items-center gap-4">
                        <div className="flex flex-col items-center opacity-50">
                            <div className="w-10 h-10 bg-green-600 text-white rounded-full flex items-center justify-center font-bold shadow-lg">✓</div>
                            <span className="text-xs font-bold mt-2 text-green-600">Thông tin</span>
                        </div>
                        <div className="w-16 h-0.5 bg-blue-600 mt-[-20px]"></div>
                        <div className="flex flex-col items-center">
                            <div className="w-10 h-10 bg-blue-600 text-white rounded-full flex items-center justify-center font-bold shadow-lg shadow-blue-200">2</div>
                            <span className="text-xs font-bold mt-2 text-blue-600">Thanh toán</span>
                        </div>
                        <div className="w-16 h-0.5 bg-gray-100 mt-[-20px]"></div>
                        <div className="flex flex-col items-center opacity-40">
                            <div className="w-10 h-10 bg-gray-200 text-gray-600 rounded-full flex items-center justify-center font-bold">3</div>
                            <span className="text-xs font-bold mt-2 text-gray-500">Hoàn tất</span>
                        </div>
                    </div>
                </div>

                {/* Timer Header */}
                <div className="bg-gradient-to-r from-red-500 to-pink-600 rounded-3xl p-6 text-white mb-8 shadow-xl flex items-center justify-between">
                    <div>
                        <p className="text-white/80 text-sm font-bold uppercase tracking-wider mb-1">Hoàn tất thanh toán trong</p>
                        <p className="text-3xl font-black">{formatTime(timeLeft)}</p>
                    </div>
                    <FaClock className="text-5xl text-white/20" />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-5 gap-8">
                    {/* Payment Options */}
                    <div className="md:col-span-3 space-y-6">
                        <div className="bg-white rounded-3xl shadow-sm border border-gray-100 p-8">
                            <h2 className="text-2xl font-bold text-gray-900 mb-8 flex items-center gap-3">
                                <MdPayment className="text-blue-500" />
                                Phương thức thanh toán
                            </h2>

                            {error && (
                                <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-lg text-red-700">
                                    {error}
                                </div>
                            )}

                            <div className="space-y-3">
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
                                            <span className="text-xs bg-green-100 text-green-700 px-2 py-0.5 rounded-full">Sandbox API</span>
                                        </div>
                                        <div className="text-sm text-gray-600">Ví điện tử MoMo - Thanh toán thật qua API</div>
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
                                            <span className="text-xs bg-green-100 text-green-700 px-2 py-0.5 rounded-full">Free API</span>
                                        </div>
                                        <div className="text-sm text-gray-600">Chuyển khoản qua mã QR - API thật miễn phí</div>
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
                                            <span className="text-xs bg-green-100 text-green-700 px-2 py-0.5 rounded-full">Sandbox API</span>
                                        </div>
                                        <div className="text-sm text-gray-600">Ví điện tử quốc dân - Thanh toán thật qua API</div>
                                    </div>
                                </label>

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
                                        <div className="flex items-center gap-2">
                                            <span className="font-semibold text-gray-900">VNPay</span>
                                            <span className="text-xs bg-green-100 text-green-700 px-2 py-0.5 rounded-full">Sandbox API</span>
                                        </div>
                                        <div className="text-sm text-gray-600">Cổng thanh toán VNPAY - API thật</div>
                                    </div>
                                </label>
                            </div>
                        </div>

                        <div className="flex items-center gap-2 text-gray-400 text-xs justify-center">
                            <FaLock />
                            <span>Thanh toán an toàn với mã hóa SSL 256-bit</span>
                        </div>
                    </div>

                    {/* Order Summary */}
                    <div className="md:col-span-2 space-y-6">
                        <div className="bg-white rounded-3xl shadow-sm border border-gray-100 p-8">
                            <h2 className="text-xl font-bold text-gray-900 mb-6">Tóm tắt đơn hàng</h2>
                            <div className="space-y-4 mb-6">
                                <div className="flex justify-between items-center py-3 border-b border-gray-50">
                                    <span className="text-gray-500 text-sm">Mã đặt xe</span>
                                    <span className="font-bold text-gray-900">#DX-{booking.id.toString().padStart(6, '0')}</span>
                                </div>
                                <div className="space-y-1">
                                    <p className="text-xs text-gray-400 font-bold uppercase tracking-wider">Dịch vụ</p>
                                    <p className="text-sm font-bold text-gray-900">{booking.dichVu.loaiXe} {booking.dichVu.soChoNgoi} chỗ</p>
                                    <p className="text-xs text-gray-500">{booking.nhaCungCap.ten}</p>
                                </div>
                                <div className="pt-4 mt-4 border-t border-gray-100">
                                    <div className="flex justify-between items-center text-gray-500 text-sm mb-2">
                                        <span>Tổng cộng</span>
                                        <span className="font-bold text-gray-900">{formatPrice(booking.tongTien)}</span>
                                    </div>
                                    <div className="flex justify-between items-center">
                                        <span className="font-bold text-gray-900">Cần thanh toán</span>
                                        <span className="text-2xl font-black text-blue-600">{formatPrice(booking.tongTien)}</span>
                                    </div>
                                </div>
                            </div>

                            <button
                                onClick={handlePayment}
                                disabled={!paymentMethod || processing}
                                className={`w-full py-4 rounded-2xl font-black text-lg shadow-lg transition-all active:scale-95 ${!paymentMethod || processing ? 'bg-gray-200 text-gray-400 cursor-not-allowed shadow-none' : 'bg-orange-500 hover:bg-orange-600 text-white shadow-orange-200'}`}
                            >
                                {processing ? (
                                    <span className="flex items-center justify-center gap-2">
                                        <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                                        ĐANG XỬ LÝ...
                                    </span>
                                ) : (
                                    'THANH TOÁN NGAY'
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
