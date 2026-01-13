'use client';

import { useState, useEffect } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { FaBus, FaClock, FaMapMarkerAlt, FaCheckCircle } from 'react-icons/fa';

interface BookingDetail {
    id: number;
    maDonDat: string;
    tongTien: number;
    soLuongGhe: number;
    trangThaiDat: string;
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
            };
            benXeDen: {
                tenBenXe: string;
                thanhPho: string;
            };
        };
        xe: {
            loaiXe: {
                tenLoaiXe: string;
            };
        };
    };
    veXe: Array<{
        hoTenHanhKhach: string;
        soGhe: string;
        giaVe: number;
    }>;
}

export default function BusPaymentPage() {
    const searchParams = useSearchParams();
    const router = useRouter();
    const bookingId = searchParams.get('bookingId');

    const [booking, setBooking] = useState<BookingDetail | null>(null);
    const [loading, setLoading] = useState(true);
    const [paymentMethod, setPaymentMethod] = useState('');
    const [processing, setProcessing] = useState(false);
    const [timeLeft, setTimeLeft] = useState(900); // 15 phút = 900 giây

    useEffect(() => {
        if (bookingId) {
            fetchBookingDetail();
        }
    }, [bookingId]);

    // Countdown timer
    useEffect(() => {
        if (timeLeft <= 0) {
            alert('Hết thời gian thanh toán! Vui lòng đặt vé lại.');
            router.push('/xekhach');
            return;
        }

        const timer = setInterval(() => {
            setTimeLeft((prev) => prev - 1);
        }, 1000);

        return () => clearInterval(timer);
    }, [timeLeft, router]);

    const fetchBookingDetail = async () => {
        try {
            const res = await fetch(`http://localhost:5000/api/bus-bookings/${bookingId}`);
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

    const handlePayment = async () => {
        if (!paymentMethod) {
            alert('Vui lòng chọn phương thức thanh toán');
            return;
        }

        if (!bookingId || !booking) {
            alert('Không tìm thấy thông tin đặt vé');
            router.push('/xekhach');
            return;
        }

        setProcessing(true);

        try {
            const token = localStorage.getItem('token');
            const headers: any = {
                'Content-Type': 'application/json',
            };

            if (token) {
                headers['Authorization'] = `Bearer ${token}`;
            }

            // Create payment
            const paymentRes = await fetch('http://localhost:5000/api/bus-bookings/payment', {
                method: 'POST',
                headers,
                body: JSON.stringify({
                    bookingId: parseInt(bookingId),
                    phuongThuc: paymentMethod,
                }),
            });

            if (!paymentRes.ok) {
                const errorData = await paymentRes.json();
                throw new Error(errorData.message || 'Thanh toán thất bại');
            }

            const payment = await paymentRes.json();

            // Redirect to payment URL
            if (payment.paymentUrl) {
                window.location.href = payment.paymentUrl;
            } else {
                throw new Error('Không nhận được URL thanh toán');
            }
        } catch (error: any) {
            console.error('Payment error:', error);
            alert(error.message || 'Có lỗi xảy ra khi thanh toán');
            setProcessing(false);
        }
    };

    const formatTime = (seconds: number) => {
        const mins = Math.floor(seconds / 60);
        const secs = seconds % 60;
        return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
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
        <div className="min-h-screen bg-gray-50 py-8">
            <div className="max-w-4xl mx-auto px-4">
                {/* Countdown Timer */}
                <div className="bg-gradient-to-r from-orange-500 to-red-500 text-white rounded-lg p-4 mb-6 shadow-lg">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-sm opacity-90">Đang giữ vé cho bạn</p>
                            <p className="text-2xl font-bold">{formatTime(timeLeft)}</p>
                        </div>
                        <FaClock className="text-4xl opacity-75" />
                    </div>
                </div>

                {/* Trip Summary */}
                <div className="bg-white rounded-xl shadow-md p-6 mb-6">
                    <h2 className="text-xl font-bold text-gray-800 mb-4 flex items-center gap-2">
                        <FaBus className="text-blue-600" />
                        Tóm tắt vé xe khách
                    </h2>

                    <div className="space-y-4">
                        {/* Company Info */}
                        <div className="flex items-center gap-3 pb-4 border-b">
                            {booking.chuyenXe.tuyenXe.nhaXe.logo ? (
                                <img
                                    src={booking.chuyenXe.tuyenXe.nhaXe.logo}
                                    alt={booking.chuyenXe.tuyenXe.nhaXe.tenNhaXe}
                                    className="w-16 h-16 object-contain rounded"
                                />
                            ) : (
                                <div className="w-16 h-16 bg-blue-100 rounded flex items-center justify-center">
                                    <FaBus className="text-blue-600 text-2xl" />
                                </div>
                            )}
                            <div>
                                <p className="font-bold text-lg">{booking.chuyenXe.tuyenXe.nhaXe.tenNhaXe}</p>
                                <p className="text-gray-600">{booking.chuyenXe.xe.loaiXe.tenLoaiXe}</p>
                            </div>
                        </div>

                        {/* Route Info */}
                        <div className="grid grid-cols-3 gap-4 items-center py-4">
                            <div>
                                <p className="text-2xl font-bold text-blue-600">{new Date(booking.chuyenXe.gioDi).toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' })}</p>
                                <p className="font-semibold">{booking.chuyenXe.tuyenXe.benXeDi.thanhPho}</p>
                                <p className="text-sm text-gray-600">{booking.chuyenXe.tuyenXe.benXeDi.tenBenXe}</p>
                            </div>

                            <div className="text-center">
                                <FaMapMarkerAlt className="text-gray-400 text-2xl mx-auto mb-2" />
                                <p className="text-xs text-gray-500">
                                    {new Date(booking.chuyenXe.gioDi).toLocaleDateString('vi-VN')}
                                </p>
                            </div>

                            <div className="text-right">
                                <p className="text-2xl font-bold text-blue-600">{new Date(booking.chuyenXe.gioDen).toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' })}</p>
                                <p className="font-semibold">{booking.chuyenXe.tuyenXe.benXeDen.thanhPho}</p>
                                <p className="text-sm text-gray-600">{booking.chuyenXe.tuyenXe.benXeDen.tenBenXe}</p>
                            </div>
                        </div>

                        {/* Passengers */}
                        <div className="border-t pt-4">
                            <p className="font-semibold mb-2">Hành khách ({booking.veXe.length})</p>
                            <div className="space-y-2">
                                {booking.veXe.map((ticket, index) => (
                                    <div key={index} className="flex justify-between items-center bg-gray-50 p-3 rounded">
                                        <span>{ticket.hoTenHanhKhach}</span>
                                        <span className="text-blue-600 font-semibold">Ghế {ticket.soGhe}</span>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Booking Code */}
                        <div className="bg-blue-50 p-4 rounded-lg">
                            <p className="text-sm text-gray-600">Mã đơn đặt</p>
                            <p className="text-2xl font-bold text-blue-600">{booking.maDonDat}</p>
                        </div>
                    </div>
                </div>

                {/* Payment Methods */}
                <div className="bg-white rounded-xl shadow-md p-6 mb-6">
                    <h2 className="text-xl font-bold text-gray-800 mb-4">Phương thức thanh toán</h2>

                    <div className="space-y-3">
                        {/* VNPay */}
                        <label className={`flex items-center gap-4 p-4 border-2 rounded-lg cursor-pointer hover:bg-gray-50 transition ${paymentMethod === 'VNPAY' ? 'border-blue-600 bg-blue-50' : 'border-gray-200'}`}>
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
                                    <p className="font-semibold">VNPay</p>
                                    <span className="text-xs bg-gray-200 text-gray-600 px-2 py-0.5 rounded-full">Sắp có</span>
                                </div>
                                <p className="text-sm text-gray-600">Ví điện tử VNPay - An toàn & nhanh chóng</p>
                            </div>
                        </label>

                        {/* MoMo */}
                        <label className={`flex items-center gap-4 p-4 border-2 rounded-lg cursor-pointer hover:bg-gray-50 transition ${paymentMethod === 'MOMO' ? 'border-pink-600 bg-pink-50' : 'border-gray-200'}`}>
                            <input
                                type="radio"
                                name="payment"
                                value="MOMO"
                                checked={paymentMethod === 'MOMO'}
                                onChange={(e) => setPaymentMethod(e.target.value)}
                                className="w-5 h-5 text-pink-600"
                            />
                            <div className="flex-1">
                                <p className="font-semibold">MoMo</p>
                                <p className="text-sm text-gray-600">Ví điện tử MoMo - Nhanh chóng & tiện lợi</p>
                            </div>
                            <img src="https://salt.tikicdn.com/ts/upload/75/1e/46/7e7c2c98fa0db93676bf9eb94a0e5a3b.png" alt="Momo" className="h-8" />
                        </label>

                        {/* VietQR */}
                        <label className={`flex items-center gap-4 p-4 border-2 rounded-lg cursor-pointer hover:bg-gray-50 transition ${paymentMethod === 'VIETQR' ? 'border-blue-600 bg-blue-50' : 'border-gray-200'}`}>
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
                                    <p className="font-semibold">VietQR</p>
                                    <span className="text-xs bg-green-100 text-green-700 px-2 py-0.5 rounded-full">Miễn phí</span>
                                </div>
                                <p className="text-sm text-gray-600">Chuyển khoản qua mã QR - Nhanh & an toàn</p>
                            </div>
                            <img src="https://salt.tikicdn.com/ts/upload/92/b2/28/1b93b59b8c7389a9e21c1c447c64b61f.png" alt="VietQR" className="h-8" />
                        </label>

                        {/* ZaloPay */}
                        <label className={`flex items-center gap-4 p-4 border-2 rounded-lg cursor-pointer hover:bg-gray-50 transition ${paymentMethod === 'ZALOPAY' ? 'border-blue-600 bg-blue-50' : 'border-gray-200'}`}>
                            <input
                                type="radio"
                                name="payment"
                                value="ZALOPAY"
                                checked={paymentMethod === 'ZALOPAY'}
                                onChange={(e) => setPaymentMethod(e.target.value)}
                                className="w-5 h-5 text-blue-600"
                            />
                            <div className="flex-1">
                                <p className="font-semibold">ZaloPay</p>
                                <p className="text-sm text-gray-600">Ví điện tử quốc dân - An toàn & tiện lợi</p>
                            </div>
                            <img src="https://salt.tikicdn.com/ts/upload/c3/d6/a8/23c5b1c36b1fd06b64010c3ea8cc44c8.png" alt="ZaloPay" className="h-8" />
                        </label>
                    </div>
                </div>

                {/* Total and Payment Button */}
                <div className="bg-white rounded-xl shadow-md p-6">
                    <div className="flex justify-between items-center mb-4 pb-4 border-b">
                        <span className="text-lg font-semibold text-gray-600">Tổng giá tiền</span>
                        <span className="text-2xl font-bold text-blue-600">{formatPrice(booking.tongTien)}</span>
                    </div>

                    <button
                        onClick={handlePayment}
                        disabled={!paymentMethod || processing}
                        className={`w-full py-4 rounded-lg font-semibold text-lg transition ${!paymentMethod || processing
                            ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                            : 'bg-gradient-to-r from-orange-500 to-red-500 text-white hover:from-orange-600 hover:to-red-600'
                            }`}
                    >
                        {processing ? 'Đang xử lý...' : 'Thanh toán & Hiển thị mã QR'}
                    </button>

                    <p className="text-xs text-center text-gray-500 mt-4">
                        Bằng cách nhấp vào nút trên, bạn đã đọc và đồng ý với{' '}
                        <a href="#" className="text-blue-600 hover:underline">Điều khoản & Điều kiện</a> và{' '}
                        <a href="#" className="text-blue-600 hover:underline">Chính sách quyền riêng tư</a>
                    </p>
                </div>

                {/* Earn Points Info */}
                <div className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-xl p-6 mt-6">
                    <div className="flex items-start gap-4">
                        <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center shadow">
                            <span className="text-2xl">🎁</span>
                        </div>
                        <div>
                            <p className="font-semibold text-gray-800 mb-1">Kiếm 140-280 Sasa Priority Points</p>
                            <p className="text-sm text-gray-600">
                                Đăng nhập để sử dụng điểm tích lũy từ đặt chỗ trước
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
