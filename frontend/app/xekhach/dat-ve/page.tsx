'use client';

import { useState, useEffect } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { FaBus, FaClock, FaMapMarkerAlt, FaUser, FaPhone, FaEnvelope } from 'react-icons/fa';

interface TripDetail {
    id: number;
    maChuyenXe: string;
    nhaXe: {
        tenNhaXe: string;
        logo?: string;
    };
    benXeDi: {
        tenBenXe: string;
        thanhPho: string;
        diaChi: string;
    };
    benXeDen: {
        tenBenXe: string;
        thanhPho: string;
        diaChi: string;
    };
    gioDi: string;
    gioDen: string;
    giaVe: number;
    loaiXe: {
        tenLoaiXe: string;
        soGhe: number;
    };
}

export default function BusBookingPage() {
    const searchParams = useSearchParams();
    const router = useRouter();
    const tripId = searchParams.get('tripId');

    const [trip, setTrip] = useState<TripDetail | null>(null);
    const [loading, setLoading] = useState(true);

    // Form state
    const [contactInfo, setContactInfo] = useState({
        hoTen: '',
        soDienThoai: '',
        email: '',
    });

    const [passengers, setPassengers] = useState([{
        id: 1,
        hoTen: '',
        gioiTinh: 'Ông',
    }]);

    const [insurance, setInsurance] = useState(false);
    const [flexibleTicket, setFlexibleTicket] = useState(false);

    useEffect(() => {
        if (tripId) {
            fetchTripDetails();
        }
    }, [tripId]);

    // Load user info from localStorage
    useEffect(() => {
        const userData = localStorage.getItem('user');
        if (userData) {
            try {
                const user = JSON.parse(userData);
                setContactInfo({
                    hoTen: user.hoTen || '',
                    soDienThoai: user.soDienThoai || '',
                    email: user.email || '',
                });
                // Set first passenger as contact person
                setPassengers([{
                    id: 1,
                    hoTen: user.hoTen || '',
                    gioiTinh: 'Ông',
                }]);
            } catch (error) {
                console.error('Error parsing user data:', error);
            }
        }
    }, []);

    const fetchTripDetails = async () => {
        setLoading(true);
        try {
            // Fetch trip details from API
            const response = await fetch(`http://localhost:5000/bus-search/${tripId}`);
            if (response.ok) {
                const data = await response.json();
                setTrip(data);
            }
        } catch (error) {
            console.error('Error fetching trip details:', error);
        } finally {
            setLoading(false);
        }
    };

    const formatTime = (dateString: string) => {
        const date = new Date(dateString);
        return date.toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' });
    };

    const formatDate = (dateString: string) => {
        const date = new Date(dateString);
        return date.toLocaleDateString('vi-VN', {
            weekday: 'short',
            day: '2-digit',
            month: '2-digit',
            year: 'numeric'
        });
    };

    const formatPrice = (price: number) => {
        return new Intl.NumberFormat('vi-VN').format(price) + ' VNĐ';
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        // Validate form
        if (!contactInfo.hoTen || !contactInfo.soDienThoai || !contactInfo.email) {
            alert('Vui lòng điền đầy đủ thông tin liên hệ');
            return;
        }

        if (passengers.some(p => !p.hoTen)) {
            alert('Vui lòng điền đầy đủ thông tin hành khách');
            return;
        }

        // Validate tripId exists and is valid
        if (!tripId) {
            alert('Không tìm thấy thông tin chuyến xe. Vui lòng chọn lại chuyến xe.');
            router.push('/xekhach');
            return;
        }

        const parsedTripId = parseInt(tripId);
        if (isNaN(parsedTripId) || parsedTripId <= 0) {
            alert('Mã chuyến xe không hợp lệ. Vui lòng chọn lại chuyến xe.');
            router.push('/xekhach');
            return;
        }

        setLoading(true);

        try {
            // Tạo booking
            const token = localStorage.getItem('accessToken');

            const bookingData = {
                chuyenXeId: parsedTripId,
                soLuongGhe: passengers.length,
                danhSachGhe: passengers.map((p, idx) => `A${idx + 1}`),
                hanhKhach: passengers.map((p, idx) => ({
                    hoTenHanhKhach: p.hoTen,
                    soDienThoai: contactInfo.soDienThoai,
                    email: contactInfo.email,
                    soGhe: `A${idx + 1}`,
                })),
                ghiChu: '',
            };

            console.log('Sending booking data:', bookingData);

            const res = await fetch('http://localhost:5000/bus-bookings', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`,
                },
                body: JSON.stringify(bookingData),
            });

            if (!res.ok) {
                const error = await res.json();
                throw new Error(error.message || 'Không thể tạo đơn đặt vé');
            }

            const booking = await res.json();

            // Navigate to payment page with booking ID
            router.push(`/xekhach/thanh-toan?bookingId=${booking.id}`);
        } catch (error: any) {
            console.error('Booking error:', error);
            alert(error.message || 'Có lỗi xảy ra khi đặt vé');
        } finally {
            setLoading(false);
        }
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-gray-50 flex items-center justify-center">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
                    <p className="text-gray-600">Đang tải thông tin chuyến xe...</p>
                </div>
            </div>
        );
    }

    if (!trip) {
        return (
            <div className="min-h-screen bg-gray-50 flex items-center justify-center">
                <div className="text-center">
                    <p className="text-gray-600">Không tìm thấy thông tin chuyến xe</p>
                    <button
                        onClick={() => router.back()}
                        className="mt-4 text-blue-600 hover:underline"
                    >
                        Quay lại
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50 py-8">
            <div className="container mx-auto px-4 max-w-7xl">
                {/* Progress Steps */}
                <div className="mb-8">
                    <div className="flex items-center justify-center">
                        <div className="flex items-center">
                            <div className="flex items-center">
                                <div className="w-10 h-10 bg-blue-600 text-white rounded-full flex items-center justify-center font-bold">
                                    1
                                </div>
                                <span className="ml-2 font-semibold text-blue-600">Đặt</span>
                            </div>
                            <div className="w-16 h-px bg-gray-300 mx-4"></div>
                            <div className="flex items-center opacity-50">
                                <div className="w-10 h-10 bg-gray-300 text-gray-600 rounded-full flex items-center justify-center font-bold">
                                    2
                                </div>
                                <span className="ml-2 text-gray-600">Xem lại</span>
                            </div>
                            <div className="w-16 h-px bg-gray-300 mx-4"></div>
                            <div className="flex items-center opacity-50">
                                <div className="w-10 h-10 bg-gray-300 text-gray-600 rounded-full flex items-center justify-center font-bold">
                                    3
                                </div>
                                <span className="ml-2 text-gray-600">Thanh toán</span>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    {/* Left Column - Forms */}
                    <div className="lg:col-span-2 space-y-6">
                        {/* Contact Information */}
                        <div className="bg-white rounded-xl shadow-md p-6">
                            <h2 className="text-xl font-bold text-gray-800 mb-4">Thông tin liên hệ</h2>
                            <div className="space-y-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        Danh xưng*
                                    </label>
                                    <select className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none">
                                        <option>Ông</option>
                                        <option>Bà</option>
                                    </select>
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        Họ tên*
                                    </label>
                                    <input
                                        type="text"
                                        value={contactInfo.hoTen}
                                        onChange={(e) => setContactInfo({ ...contactInfo, hoTen: e.target.value })}
                                        placeholder="hoai"
                                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        Điện thoại di động*
                                    </label>
                                    <div className="flex gap-2">
                                        <select className="w-24 px-2 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none">
                                            <option>🇻🇳 +84</option>
                                        </select>
                                        <input
                                            type="tel"
                                            value={contactInfo.soDienThoai}
                                            onChange={(e) => setContactInfo({ ...contactInfo, soDienThoai: e.target.value })}
                                            placeholder="37654322"
                                            className="flex-1 px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                                        />
                                    </div>
                                    <p className="text-xs text-gray-500 mt-1">
                                        VD: +84 962345678 (Trang số 0 cuối số điện thoại là 09 sẽ được xóa để gửi xác nhận SMS)
                                    </p>
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        Email*
                                    </label>
                                    <input
                                        type="email"
                                        value={contactInfo.email}
                                        onChange={(e) => setContactInfo({ ...contactInfo, email: e.target.value })}
                                        placeholder="side@gmail.com"
                                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                                    />
                                    <p className="text-xs text-blue-600 mt-1">
                                        VD: email@example.com
                                    </p>
                                </div>
                            </div>
                        </div>

                        {/* Passenger Information */}
                        <div className="bg-white rounded-xl shadow-md p-6">
                            <h2 className="text-xl font-bold text-gray-800 mb-4">Thông tin hành khách</h2>
                            <p className="text-sm text-gray-600 mb-4">
                                Người lớn 1 <span className="text-blue-600 cursor-pointer hover:underline">Lưu</span>
                            </p>

                            {passengers.map((passenger, index) => (
                                <div key={passenger.id} className="space-y-4">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">
                                            Danh xưng*
                                        </label>
                                        <select
                                            value={passenger.gioiTinh}
                                            onChange={(e) => {
                                                const newPassengers = [...passengers];
                                                newPassengers[index].gioiTinh = e.target.value;
                                                setPassengers(newPassengers);
                                            }}
                                            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                                        >
                                            <option>Ông</option>
                                            <option>Bà</option>
                                        </select>
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">
                                            Họ tên*
                                        </label>
                                        <input
                                            type="text"
                                            value={passenger.hoTen}
                                            onChange={(e) => {
                                                const newPassengers = [...passengers];
                                                newPassengers[index].hoTen = e.target.value;
                                                setPassengers(newPassengers);
                                            }}
                                            placeholder="hoai"
                                            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                                        />
                                        <p className="text-xs text-gray-500 mt-1">
                                            Người Việt viêu nhập họ tên: <span className="text-blue-600">Trần đôn</span> • <span className="text-blue-600">Tên chính</span> • <span className="text-blue-600">Họ</span> • <span className="text-blue-600">Người nước ngoài: nhập Tên</span> • <span className="text-blue-600">Họ, Tên đệm</span>
                                        </p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Right Column - Trip Summary */}
                    <div className="lg:col-span-1">
                        <div className="bg-white rounded-xl shadow-md p-6 sticky top-4">
                            <h2 className="text-lg font-bold text-gray-800 mb-4">Đặt chỗ của tôi</h2>

                            {/* Trip Info */}
                            <div className="mb-6 pb-6 border-b">
                                <div className="flex items-center gap-3 mb-4">
                                    <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                                        <FaBus className="text-2xl text-green-600" />
                                    </div>
                                    <div>
                                        <p className="font-bold text-gray-800">{trip.nhaXe.tenNhaXe}</p>
                                        <p className="text-sm text-gray-600">{trip.loaiXe.tenLoaiXe}</p>
                                    </div>
                                </div>

                                <div className="space-y-3">
                                    <div>
                                        <p className="text-xs text-gray-500 mb-1">Thứ 3, 5 tháng 1 2026</p>
                                        <div className="flex items-center gap-2">
                                            <FaClock className="text-gray-400" />
                                            <div>
                                                <p className="font-bold text-gray-800">{formatTime(trip.gioDi)}</p>
                                                <p className="text-sm text-gray-600">{trip.benXeDi.tenBenXe}</p>
                                                <p className="text-xs text-gray-500">{trip.benXeDi.diaChi}</p>
                                            </div>
                                        </div>
                                        <p className="text-xs text-gray-500 mt-1">Yêu cầu</p>
                                    </div>

                                    <div className="flex items-center gap-2">
                                        <FaMapMarkerAlt className="text-gray-400" />
                                        <div>
                                            <p className="font-bold text-gray-800">{formatTime(trip.gioDen)}</p>
                                            <p className="text-sm text-gray-600">{trip.benXeDen.tenBenXe}</p>
                                            <p className="text-xs text-gray-500">{trip.benXeDen.diaChi}</p>
                                        </div>
                                    </div>
                                </div>

                                <button className="text-blue-600 text-sm font-semibold mt-3 hover:underline">
                                    Chi tiết
                                </button>
                            </div>

                            {/* Optional Services */}
                            <div className="space-y-4 mb-6 pb-6 border-b">
                                <div>
                                    <p className="font-bold text-gray-800 mb-2">Không đổi lịch</p>
                                    <p className="text-sm text-gray-600 mb-2">
                                        Không thể lịch vé. Bạn sẽ nhận hoàn tiền toàn bộ (trừ phí bảo chuyển thuộc về đối tác), thay đồi tiền đã nhận Traveloka.
                                    </p>
                                    <button className="text-blue-600 text-sm font-semibold hover:underline">
                                        Thông tin
                                    </button>
                                </div>

                                <div>
                                    <div className="flex items-start gap-2">
                                        <input
                                            type="checkbox"
                                            checked={insurance}
                                            onChange={(e) => setInsurance(e.target.checked)}
                                            className="mt-1"
                                        />
                                        <div className="flex-1">
                                            <p className="font-bold text-gray-800">Có thể hoàn trả</p>
                                            <p className="text-sm text-gray-600">
                                                Có thể vé và yêu cầu hoàn tiền, thay bạn tích vào ô việc Traveloka.
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Price Summary */}
                            <div className="space-y-3">
                                <div className="flex justify-between text-gray-600">
                                    <span>Giá vé</span>
                                    <span>{formatPrice(parseFloat(trip.giaVe.toString()))}</span>
                                </div>
                                {insurance && (
                                    <div className="flex justify-between text-gray-600">
                                        <span>Bảo hiểm</span>
                                        <span>50,000 VNĐ</span>
                                    </div>
                                )}
                                <div className="flex justify-between text-xl font-bold text-gray-800 pt-3 border-t">
                                    <span>Tổng cộng</span>
                                    <span className="text-orange-600">
                                        {formatPrice(parseFloat(trip.giaVe.toString()) + (insurance ? 50000 : 0))}
                                    </span>
                                </div>
                            </div>

                            <button
                                onClick={handleSubmit}
                                className="w-full bg-blue-600 text-white py-4 rounded-lg font-bold text-lg hover:bg-blue-700 transition mt-6"
                            >
                                Tiếp tục
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
