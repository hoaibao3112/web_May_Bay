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
    const [paymentMethod, setPaymentMethod] = useState('');
    const [processing, setProcessing] = useState(false);
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
            const res = await fetch(`http://localhost:5000/airport-transfer-bookings/${bookingId}`);
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
        if (!paymentMethod) return;
        setProcessing(true);
        try {
            const res = await fetch('http://localhost:5000/airport-transfer-bookings/payment', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    bookingId: parseInt(bookingId!),
                    phuongThucThanhToan: paymentMethod,
                    soTien: booking?.tongTien
                }),
            });

            if (res.ok) {
                router.push(`/duadon/xac-nhan?bookingId=${bookingId}`);
            } else {
                throw new Error('Payment failed');
            }
        } catch (error) {
            alert('Thanh toán thất bại, vui lòng thử lại');
        } finally {
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

                            <div className="space-y-4">
                                {[
                                    { id: 'visa', name: 'Thẻ Quốc tế (Visa, Master, JCB)', icon: <FaCreditCard className="text-blue-500" /> },
                                    { id: 'atm', name: 'Thẻ ATM Nội địa / Internet Banking', icon: <MdAccountBalance className="text-indigo-500" /> },
                                    { id: 'momo', name: 'Ví MoMo', icon: <span className="w-6 h-6 bg-pink-500 rounded-md flex items-center justify-center text-[10px] text-white font-bold">M</span> },
                                    { id: 'vnpay', name: 'VNPAY-QR', icon: <span className="w-6 h-6 bg-blue-700 rounded-md flex items-center justify-center text-[10px] text-white font-bold">V</span> }
                                ].map(method => (
                                    <label key={method.id} className={`flex items-center gap-4 p-5 rounded-2xl border-2 transition-all cursor-pointer ${paymentMethod === method.id ? 'border-blue-500 bg-blue-50/50' : 'border-gray-50 hover:border-gray-100'}`}>
                                        <input
                                            type="radio"
                                            name="payment"
                                            value={method.id}
                                            onChange={(e) => setPaymentMethod(e.target.value)}
                                            className="w-5 h-5 text-blue-600 focus:ring-blue-500"
                                        />
                                        <div className="text-xl">{method.icon}</div>
                                        <span className="font-bold text-gray-700">{method.name}</span>
                                        {paymentMethod === method.id && <FaCheckCircle className="ml-auto text-blue-500" />}
                                    </label>
                                ))}
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
                                className={`w-full py-4 rounded-2xl font-black text-lg shadow-lg transition-all active:scale-95 ${!paymentMethod || processing ? 'bg-gray-200 text-gray-400 cursor-not-allowed shadow-none' : 'bg-blue-600 hover:bg-blue-700 text-white shadow-blue-200'}`}
                            >
                                {processing ? 'ĐANG XỬ LÝ...' : 'THANH TOÁN NGAY'}
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
