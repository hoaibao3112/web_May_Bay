'use client';

import { useState, useEffect } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { FaCheckCircle, FaCar, FaClock, FaMapMarkerAlt, FaDownload, FaHome } from 'react-icons/fa';
import confetti from 'canvas-confetti';

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
}

export default function AirportTransferConfirmationPage() {
    const searchParams = useSearchParams();
    const router = useRouter();
    const bookingId = searchParams.get('bookingId');
    const [booking, setBooking] = useState<BookingDetail | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (bookingId) {
            fetchBookingDetail();
            // Trigger confetti
            confetti({
                particleCount: 150,
                spread: 70,
                origin: { y: 0.6 },
                colors: ['#2563eb', '#f59e0b', '#10b981']
            });
        }
    }, [bookingId]);

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

    const formatPrice = (p: number) => new Intl.NumberFormat('vi-VN').format(p) + ' VNĐ';

    if (loading || !booking) {
        return (
            <div className="min-h-screen bg-gray-50 flex items-center justify-center">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50 py-20">
            <div className="max-w-2xl mx-auto px-4">
                <div className="bg-white rounded-[40px] shadow-2xl shadow-blue-100/50 overflow-hidden text-center p-12 relative border border-gray-50">
                    <div className="mb-8 flex justify-center">
                        <div className="w-24 h-24 bg-green-100 rounded-full flex items-center justify-center animate-bounce">
                            <FaCheckCircle className="text-5xl text-green-500" />
                        </div>
                    </div>

                    <h1 className="text-4xl font-black text-gray-900 mb-2">Thanh toán thành công!</h1>
                    <p className="text-gray-500 mb-10 font-medium">Đơn đặt xe của bạn đã được xác nhận và tài xế sẽ liên hệ trước giờ đón 30 phút.</p>

                    <div className="bg-blue-50/50 rounded-3xl p-8 mb-10 text-left border border-blue-100/50">
                        <div className="flex items-center gap-4 mb-8">
                            <img src={booking.nhaCungCap.logo} alt="" className="w-14 h-14 rounded-2xl bg-white p-2 border shadow-sm" />
                            <div>
                                <p className="text-xs text-gray-400 font-bold uppercase tracking-widest">Mã đặt xe</p>
                                <p className="text-xl font-black text-blue-600">#DX-{booking.id.toString().padStart(6, '0')}</p>
                            </div>
                        </div>

                        <div className="space-y-6">
                            <div className="flex gap-4">
                                <div className="p-2 bg-blue-100 rounded-xl"><FaMapMarkerAlt className="text-blue-500" /></div>
                                <div>
                                    <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest leading-none mb-1">Điểm đón</p>
                                    <p className="text-sm font-bold text-gray-900">{booking.diemDon}</p>
                                </div>
                            </div>
                            <div className="flex gap-4">
                                <div className="p-2 bg-orange-100 rounded-xl"><FaMapMarkerAlt className="text-orange-500" /></div>
                                <div>
                                    <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest leading-none mb-1">Điểm đến</p>
                                    <p className="text-sm font-bold text-gray-900">{booking.diemTra}</p>
                                </div>
                            </div>
                            <div className="flex gap-4">
                                <div className="p-2 bg-indigo-100 rounded-xl"><FaClock className="text-indigo-500" /></div>
                                <div>
                                    <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest leading-none mb-1">Thời gian đón</p>
                                    <p className="text-sm font-bold text-gray-900">{new Date(booking.ngayDon).toLocaleString('vi-VN')}</p>
                                </div>
                            </div>
                        </div>

                        <div className="mt-8 pt-8 border-t border-blue-100 flex justify-between items-center">
                            <span className="font-bold text-gray-900">Tổng thanh toán</span>
                            <span className="text-2xl font-black text-blue-600">{formatPrice(booking.tongTien)}</span>
                        </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <button className="flex items-center justify-center gap-2 bg-gray-100 hover:bg-gray-200 text-gray-700 py-4 rounded-2xl font-bold transition-all">
                            <FaDownload /> Tải hóa đơn
                        </button>
                        <button
                            onClick={() => router.push('/')}
                            className="flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 text-white py-4 rounded-2xl font-bold shadow-lg shadow-blue-200 transition-all"
                        >
                            <FaHome /> Về trang chủ
                        </button>
                    </div>
                </div>

                <p className="text-center mt-8 text-gray-400 text-sm">Cảm ơn bạn đã tin dùng dịch vụ của BayNhanh!</p>
            </div>
        </div>
    );
}
