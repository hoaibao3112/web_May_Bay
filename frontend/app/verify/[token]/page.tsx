'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import Image from 'next/image';

interface BookingData {
    bookingType: 'FLIGHT' | 'HOTEL' | 'BUS' | 'CAR' | 'TRANSFER';
    booking: any;
    verifiedAt: string;
}

export default function VerifyBookingPage() {
    const params = useParams();
    const token = params.token as string;
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [data, setData] = useState<BookingData | null>(null);

    useEffect(() => {
        if (token) {
            fetchBookingDetails();
        }
    }, [token]);

    const fetchBookingDetails = async () => {
        try {
            const apiUrl = `${process.env.NEXT_PUBLIC_API_URL}/qr-code/verify/${token}`;
            console.log('🔍 Calling API:', apiUrl);
            
            const response = await fetch(apiUrl);
            console.log('📥 Response status:', response.status);

            if (!response.ok) {
                const errorText = await response.text();
                console.error('❌ Error response:', errorText);
                throw new Error('Không thể xác thực mã QR');
            }

            const result = await response.json();
            console.log('✅ Success data:', result);
            setData(result);
        } catch (err: any) {
            console.error('❌ Fetch error:', err);
            setError(err.message || 'Có lỗi xảy ra');
        } finally {
            setLoading(false);
        }
    };

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100">
                <div className="text-center">
                    <div className="inline-block animate-spin rounded-full h-16 w-16 border-b-4 border-blue-600 mb-4"></div>
                    <p className="text-gray-600 text-lg">Đang xác thực...</p>
                </div>
            </div>
        );
    }

    if (error || !data) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-red-50 to-pink-100 px-4">
                <div className="max-w-md w-full bg-white rounded-2xl shadow-2xl p-8 text-center">
                    <div className="w-20 h-20 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
                        <svg className="w-10 h-10 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                        </svg>
                    </div>
                    <h1 className="text-2xl font-bold text-gray-900 mb-2">Xác thực thất bại</h1>
                    <p className="text-gray-600 mb-6">{error}</p>
                    <a
                        href="/"
                        className="inline-block bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition"
                    >
                        Về trang chủ
                    </a>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 py-12 px-4">
            <div className="max-w-3xl mx-auto">
                {/* Success Header */}
                <div className="bg-white rounded-2xl shadow-xl p-8 mb-6 text-center">
                    <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4 animate-bounce">
                        <svg className="w-10 h-10 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                        </svg>
                    </div>
                    <h1 className="text-3xl font-bold text-gray-900 mb-2">✅ Xác thực thành công!</h1>
                    <p className="text-gray-600">Thông tin đặt chỗ của bạn</p>
                </div>

                {/* Booking Details */}
                {data.bookingType === 'FLIGHT' && <FlightBooking booking={data.booking} />}
                {data.bookingType === 'HOTEL' && <HotelBooking booking={data.booking} />}
                {data.bookingType === 'BUS' && <BusBooking booking={data.booking} />}

                {/* Footer */}
                <div className="text-center mt-8">
                    <a
                        href="/"
                        className="inline-block bg-blue-600 text-white px-8 py-3 rounded-lg hover:bg-blue-700 transition shadow-lg"
                    >
                        Về trang chủ
                    </a>
                </div>
            </div>
        </div>
    );
}

// Flight Booking Component
function FlightBooking({ booking }: { booking: any }) {
    const formatDate = (date: string) => {
        return new Date(date).toLocaleDateString('vi-VN', {
            weekday: 'short',
            year: 'numeric',
            month: 'short',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit',
        });
    };

    return (
        <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
            <div className="bg-gradient-to-r from-blue-600 to-indigo-600 p-6 text-white">
                <div className="flex items-center gap-3 mb-2">
                    <svg className="w-8 h-8" fill="currentColor" viewBox="0 0 20 20">
                        <path d="M10.894 2.553a1 1 0 00-1.788 0l-7 14a1 1 0 001.169 1.409l5-1.429A1 1 0 009 15.571V11a1 1 0 112 0v4.571a1 1 0 00.725.962l5 1.428a1 1 0 001.17-1.408l-7-14z" />
                    </svg>
                    <h2 className="text-2xl font-bold">Chuyến bay</h2>
                </div>
                <p className="text-blue-100">{booking.changBay.chuyenBay.hang.tenHang} - {booking.changBay.chuyenBay.soHieuChuyenBay}</p>
            </div>

            <div className="p-6 space-y-6">
                {/* Flight Route */}
                <div className="flex items-center justify-between">
                    <div className="flex-1">
                        <p className="text-sm text-gray-500">Điểm đi</p>
                        <p className="text-xl font-bold text-gray-900">{booking.changBay.sanBayDi.maIata}</p>
                        <p className="text-sm text-gray-600">{booking.changBay.sanBayDi.tenSanBay}</p>
                        <p className="text-sm text-blue-600 font-semibold mt-1">{formatDate(booking.changBay.gioDi)}</p>
                    </div>
                    <div className="px-4">
                        <svg className="w-12 h-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                        </svg>
                    </div>
                    <div className="flex-1 text-right">
                        <p className="text-sm text-gray-500">Điểm đến</p>
                        <p className="text-xl font-bold text-gray-900">{booking.changBay.sanBayDen.maIata}</p>
                        <p className="text-sm text-gray-600">{booking.changBay.sanBayDen.tenSanBay}</p>
                        <p className="text-sm text-blue-600 font-semibold mt-1">{formatDate(booking.changBay.gioDen)}</p>
                    </div>
                </div>

                <div className="border-t pt-4">
                    <div className="grid grid-cols-2 gap-4">
                        <InfoRow icon="📋" label="Mã đặt vé" value={booking.maDatVe} />
                        <InfoRow icon="💺" label="Hạng vé" value={booking.hangVe.tenHang} />
                        <InfoRow icon="💰" label="Tổng tiền" value={Number(booking.tongTien).toLocaleString('vi-VN')} />
                        <InfoRow icon="📊" label="Trạng thái" value={booking.trangThai} />
                    </div>
                </div>

                {/* Passengers */}
                <div className="border-t pt-4">
                    <h3 className="font-bold text-gray-900 mb-3 flex items-center gap-2">
                        <span>👥</span> Hành khách ({booking.hanhKhach.length})
                    </h3>
                    <div className="space-y-2">
                        {booking.hanhKhach.map((passenger: any, index: number) => (
                            <div key={index} className="bg-gray-50 rounded-lg p-3">
                                <p className="font-semibold text-gray-900">{passenger.ho} {passenger.ten}</p>
                                <p className="text-sm text-gray-600">{passenger.loai}</p>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Contact Info */}
                {booking.thongTinLienHe && (
                    <div className="border-t pt-4">
                        <h3 className="font-bold text-gray-900 mb-3">📞 Thông tin liên hệ</h3>
                        <div className="bg-blue-50 rounded-lg p-4 space-y-2">
                            <InfoRow label="Họ tên" value={booking.thongTinLienHe.hoTen} />
                            <InfoRow label="Email" value={booking.thongTinLienHe.email} />
                            <InfoRow label="Số điện thoại" value={booking.thongTinLienHe.soDienThoai} />
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}

// Hotel Booking Component
function HotelBooking({ booking }: { booking: any }) {
    const formatDate = (date: string) => {
        return new Date(date).toLocaleDateString('vi-VN', {
            weekday: 'short',
            day: 'numeric',
            month: 'short',
            year: 'numeric',
        });
    };

    const nights = Math.ceil(
        (new Date(booking.ngayTraPhong).getTime() - new Date(booking.ngayNhanPhong).getTime()) / (1000 * 60 * 60 * 24)
    );

    return (
        <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
            <div className="bg-gradient-to-r from-purple-600 to-pink-600 p-6 text-white">
                <div className="flex items-center gap-3 mb-2">
                    <svg className="w-8 h-8" fill="currentColor" viewBox="0 0 20 20">
                        <path d="M10.707 2.293a1 1 0 00-1.414 0l-7 7a1 1 0 001.414 1.414L4 10.414V17a1 1 0 001 1h2a1 1 0 001-1v-2a1 1 0 011-1h2a1 1 0 011 1v2a1 1 0 001 1h2a1 1 0 001-1v-6.586l.293.293a1 1 0 001.414-1.414l-7-7z" />
                    </svg>
                    <h2 className="text-2xl font-bold">Đặt phòng khách sạn</h2>
                </div>
                <p className="text-purple-100">{booking.khachSan.tenKhachSan}</p>
            </div>

            <div className="p-6 space-y-6">
                <div>
                    <h3 className="text-xl font-bold text-gray-900 mb-2">{booking.khachSan.tenKhachSan}</h3>
                    <p className="text-gray-600">📍 {booking.khachSan.diaChi}, {booking.khachSan.thanhPho}</p>
                    {booking.khachSan.soSao > 0 && (
                        <p className="text-yellow-500 mt-1">{'⭐'.repeat(booking.khachSan.soSao)}</p>
                    )}
                </div>

                <div className="bg-purple-50 rounded-lg p-4">
                    <h4 className="font-bold text-gray-900 mb-2">🛏️ {booking.phong.tenPhong} - {booking.phong.loaiPhong}</h4>
                    <div className="grid grid-cols-2 gap-3 text-sm">
                        <InfoRow label="Check-in" value={formatDate(booking.ngayNhanPhong)} />
                        <InfoRow label="Check-out" value={formatDate(booking.ngayTraPhong)} />
                        <InfoRow label="Số đêm" value={`${nights} đêm`} />
                        <InfoRow label="Số phòng" value={booking.soPhong} />
                    </div>
                </div>

                <div className="grid grid-cols-2 gap-4 border-t pt-4">
                    <InfoRow icon="📋" label="Mã đặt phòng" value={booking.maDatPhong} />
                    <InfoRow icon="👥" label="Khách" value={`${booking.soNguoiLon} người lớn, ${booking.soTreEm} trẻ em`} />
                    <InfoRow icon="💰" label="Tổng tiền" value={`${Number(booking.tongTien).toLocaleString('vi-VN')} VNĐ`} />
                    <InfoRow icon="📊" label="Trạng thái" value={booking.trangThai} />
                </div>

                {booking.user && (
                    <div className="border-t pt-4">
                        <h3 className="font-bold text-gray-900 mb-3">👤 Thông tin khách hàng</h3>
                        <div className="bg-blue-50 rounded-lg p-4 space-y-2">
                            <InfoRow label="Họ tên" value={booking.user.hoTen} />
                            <InfoRow label="Email" value={booking.user.email} />
                            {booking.user.soDienThoai && <InfoRow label="Số điện thoại" value={booking.user.soDienThoai} />}
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}

// Bus Booking Component
function BusBooking({ booking }: { booking: any }) {
    const formatTime = (date: string) => {
        return new Date(date).toLocaleTimeString('vi-VN', {
            hour: '2-digit',
            minute: '2-digit',
        });
    };

    const formatDate = (date: string) => {
        return new Date(date).toLocaleDateString('vi-VN', {
            day: '2-digit',
            month: '2-digit',
            year: 'numeric',
        });
    };

    return (
        <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
            <div className="bg-gradient-to-r from-green-600 to-teal-600 p-6 text-white">
                <div className="flex items-center gap-3 mb-2">
                    <svg className="w-8 h-8" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M12.395 2.553a1 1 0 00-1.45-.385c-.345.23-.614.558-.822.88-.214.33-.403.713-.57 1.116-.334.804-.614 1.768-.84 2.734a31.365 31.365 0 00-.613 3.58 2.64 2.64 0 01-.945-1.067c-.328-.68-.398-1.534-.398-2.654A1 1 0 005.05 6.05 6.981 6.981 0 003 11a7 7 0 1011.95-4.95c-.592-.591-.98-.985-1.348-1.467-.363-.476-.724-1.063-1.207-2.03zM12.12 15.12A3 3 0 017 13s.879.5 2.5.5c0-1 .5-4 1.25-4.5.5 1 .786 1.293 1.371 1.879A2.99 2.99 0 0113 13a2.99 2.99 0 01-.879 2.121z" clipRule="evenodd" />
                    </svg>
                    <h2 className="text-2xl font-bold">Vé xe khách</h2>
                </div>
                <p className="text-green-100">{booking.chuyenXe.tuyenXe.nhaXe.tenNhaXe}</p>
            </div>

            <div className="p-6 space-y-6">
                {/* Route */}
                <div className="flex items-center justify-between">
                    <div className="flex-1">
                        <p className="text-sm text-gray-500">Điểm đi</p>
                        <p className="text-lg font-bold text-gray-900">{booking.chuyenXe.tuyenXe.benXeDi.tenBenXe}</p>
                        <p className="text-sm text-gray-600">{booking.chuyenXe.tuyenXe.benXeDi.thanhPho}</p>
                        <p className="text-sm text-green-600 font-semibold mt-1">
                            {formatTime(booking.chuyenXe.gioDi)} - {formatDate(booking.chuyenXe.gioDi)}
                        </p>
                    </div>
                    <div className="px-4">
                        <svg className="w-10 h-10 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                        </svg>
                    </div>
                    <div className="flex-1 text-right">
                        <p className="text-sm text-gray-500">Điểm đến</p>
                        <p className="text-lg font-bold text-gray-900">{booking.chuyenXe.tuyenXe.benXeDen.tenBenXe}</p>
                        <p className="text-sm text-gray-600">{booking.chuyenXe.tuyenXe.benXeDen.thanhPho}</p>
                        <p className="text-sm text-green-600 font-semibold mt-1">
                            {formatTime(booking.chuyenXe.gioDen)} - {formatDate(booking.chuyenXe.gioDen)}
                        </p>
                    </div>
                </div>

                <div className="bg-green-50 rounded-lg p-4">
                    <div className="grid grid-cols-2 gap-4 text-sm">
                        <InfoRow label="Biển số xe" value={booking.chuyenXe.xe.bienSoXe} />
                        <InfoRow label="Số ghế" value={booking.veXe.map((v: any) => v.soGhe).join(', ')} />
                    </div>
                </div>

                <div className="grid grid-cols-2 gap-4 border-t pt-4">
                    <InfoRow icon="📋" label="Mã đơn đặt" value={booking.maDonDat} />
                    <InfoRow icon="💺" label="Số lượng ghế" value={booking.soLuongGhe} />
                    <InfoRow icon="💰" label="Tổng tiền" value={`${Number(booking.tongTien).toLocaleString('vi-VN')} VNĐ`} />
                    <InfoRow icon="📊" label="Trạng thái" value={booking.trangThai} />
                </div>

                {booking.nguoiDung && (
                    <div className="border-t pt-4">
                        <h3 className="font-bold text-gray-900 mb-3">👤 Thông tin khách hàng</h3>
                        <div className="bg-blue-50 rounded-lg p-4 space-y-2">
                            <InfoRow label="Họ tên" value={booking.nguoiDung.hoTen} />
                            <InfoRow label="Email" value={booking.nguoiDung.email} />
                            <InfoRow label="Số điện thoại" value={booking.nguoiDung.soDienThoai} />
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}

// Helper Component
function InfoRow({ icon, label, value }: { icon?: string; label: string; value: string | number }) {
    return (
        <div>
            <p className="text-sm text-gray-500">{icon && <span className="mr-1">{icon}</span>}{label}</p>
            <p className="font-semibold text-gray-900">{value}</p>
        </div>
    );
}
