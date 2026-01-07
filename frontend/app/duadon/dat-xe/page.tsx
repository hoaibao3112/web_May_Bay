'use client';

import { useState, useEffect } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { FaCar, FaClock, FaMapMarkerAlt, FaUser, FaPhone, FaEnvelope, FaShieldAlt } from 'react-icons/fa';
import { MdLuggage } from 'react-icons/md';

interface ServiceDetail {
    id: number;
    loaiXe: string;
    soChoNgoi: number;
    giaTienMotChieu: number;
    giaTienKhuHoi: number | null;
    nhaCungCap: {
        ten: string;
        logo: string;
    };
    sanBay: {
        ten: string;
        ma: string;
    };
}

export default function AirportTransferBookingPage() {
    const searchParams = useSearchParams();
    const router = useRouter();
    const serviceId = searchParams.get('serviceId');
    const pickupLocation = searchParams.get('pickupLocation') || '';
    const dropoffLocation = searchParams.get('dropoffLocation') || '';
    const date = searchParams.get('date') || '';
    const time = searchParams.get('time') || '';
    const passengersCount = searchParams.get('passengers') || '1';

    const [service, setService] = useState<ServiceDetail | null>(null);
    const [loading, setLoading] = useState(true);

    // Form state
    const [contactInfo, setContactInfo] = useState({
        hoTen: '',
        soDienThoai: '',
        email: '',
        ghiChu: '',
    });

    useEffect(() => {
        if (serviceId) {
            fetchServiceDetails();
        }
    }, [serviceId]);

    // Load user info from localStorage
    useEffect(() => {
        const userData = localStorage.getItem('user');
        if (userData) {
            try {
                const user = JSON.parse(userData);
                setContactInfo(prev => ({
                    ...prev,
                    hoTen: user.hoTen || '',
                    soDienThoai: user.soDienThoai || '',
                    email: user.email || '',
                }));
            } catch (error) {
                console.error('Error parsing user data:', error);
            }
        }
    }, []);

    const fetchServiceDetails = async () => {
        setLoading(true);
        try {
            const response = await fetch(`http://localhost:5000/airport-transfer-search/${serviceId}`);
            if (response.ok) {
                const data = await response.json();
                setService(data);
            }
        } catch (error) {
            console.error('Error fetching service details:', error);
        } finally {
            setLoading(false);
        }
    };

    const formatPrice = (price: number) => {
        return new Intl.NumberFormat('vi-VN').format(price) + ' VNĐ';
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!contactInfo.hoTen || !contactInfo.soDienThoai || !contactInfo.email) {
            alert('Vui lòng điền đầy đủ thông tin liên hệ');
            return;
        }

        setLoading(true);

        try {
            const token = localStorage.getItem('accessToken');
            const user = JSON.parse(localStorage.getItem('user') || '{}');

            const bookingData = {
                dichVuId: parseInt(serviceId!),
                userId: user.id || 1, // Fallback for dev
                loaiDichVu: 'mot_chieu',
                ngayDon: date,
                gioDon: time,
                diemDon: pickupLocation,
                diemTra: dropoffLocation,
                soHanhKhach: parseInt(passengersCount),
                tenKhachHang: contactInfo.hoTen,
                soDienThoai: contactInfo.soDienThoai,
                email: contactInfo.email,
                ghiChu: contactInfo.ghiChu,
            };

            // DEBUG: Xem data đang gửi lên
            console.log('🔍 SERVICE ID FROM URL:', serviceId);
            console.log('🔍 BOOKING DATA:', bookingData);
            console.log('🔍 dichVuId (parsed):', bookingData.dichVuId);

            const res = await fetch('http://localhost:5000/airport-transfer-bookings', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`,
                },
                body: JSON.stringify(bookingData),
            });

            if (!res.ok) {
                const error = await res.json();
                throw new Error(error.message || 'Không thể tạo đơn đặt xe');
            }

            const booking = await res.json();
            router.push(`/duadon/thanh-toan?bookingId=${booking.id}`);
        } catch (error: any) {
            console.error('Booking error:', error);
            alert(error.message || 'Có lỗi xảy ra khi đặt xe');
        } finally {
            setLoading(false);
        }
    };

    if (loading && !service) {
        return (
            <div className="min-h-screen bg-gray-50 flex items-center justify-center">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
            </div>
        );
    }

    if (!service) {
        return (
            <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
                <div className="text-center bg-white p-8 rounded-3xl shadow-xl max-w-sm">
                    <p className="text-gray-600 mb-6">Không tìm thấy thông tin dịch vụ</p>
                    <button onClick={() => router.back()} className="w-full bg-blue-600 text-white py-3 rounded-xl font-bold">Quay lại</button>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50 py-12">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                {/* Progress */}
                <div className="flex items-center justify-center mb-12">
                    <div className="flex items-center gap-4">
                        <div className="flex flex-col items-center">
                            <div className="w-10 h-10 bg-blue-600 text-white rounded-full flex items-center justify-center font-bold shadow-lg shadow-blue-200">1</div>
                            <span className="text-xs font-bold mt-2 text-blue-600">Thông tin</span>
                        </div>
                        <div className="w-16 h-0.5 bg-blue-100 mt-[-20px]"></div>
                        <div className="flex flex-col items-center opacity-40">
                            <div className="w-10 h-10 bg-gray-200 text-gray-600 rounded-full flex items-center justify-center font-bold">2</div>
                            <span className="text-xs font-bold mt-2 text-gray-500">Thanh toán</span>
                        </div>
                        <div className="w-16 h-0.5 bg-gray-100 mt-[-20px]"></div>
                        <div className="flex flex-col items-center opacity-40">
                            <div className="w-10 h-10 bg-gray-200 text-gray-600 rounded-full flex items-center justify-center font-bold">3</div>
                            <span className="text-xs font-bold mt-2 text-gray-500">Hoàn tất</span>
                        </div>
                    </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* Form */}
                    <div className="lg:col-span-2 space-y-6">
                        <div className="bg-white rounded-3xl shadow-sm border border-gray-100 p-8">
                            <h2 className="text-2xl font-bold text-gray-900 mb-8 flex items-center gap-3">
                                <FaUser className="text-blue-500" />
                                Thông tin liên hệ
                            </h2>
                            <form className="space-y-6">
                                <div className="grid md:grid-cols-2 gap-6">
                                    <div>
                                        <label className="block text-sm font-bold text-gray-700 mb-2">Họ và tên*</label>
                                        <input
                                            type="text"
                                            value={contactInfo.hoTen}
                                            onChange={(e) => setContactInfo({ ...contactInfo, hoTen: e.target.value })}
                                            className="w-full px-4 py-3.5 bg-gray-50 border-none rounded-2xl focus:ring-2 focus:ring-blue-500 transition-all"
                                            placeholder="Nhập họ tên người đi"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-bold text-gray-700 mb-2">Số điện thoại*</label>
                                        <input
                                            type="tel"
                                            value={contactInfo.soDienThoai}
                                            onChange={(e) => setContactInfo({ ...contactInfo, soDienThoai: e.target.value })}
                                            className="w-full px-4 py-3.5 bg-gray-50 border-none rounded-2xl focus:ring-2 focus:ring-blue-500 transition-all"
                                            placeholder="Nhập số điện thoại"
                                        />
                                    </div>
                                </div>
                                <div>
                                    <label className="block text-sm font-bold text-gray-700 mb-2">Email xác nhận*</label>
                                    <input
                                        type="email"
                                        value={contactInfo.email}
                                        onChange={(e) => setContactInfo({ ...contactInfo, email: e.target.value })}
                                        className="w-full px-4 py-3.5 bg-gray-50 border-none rounded-2xl focus:ring-2 focus:ring-blue-500 transition-all"
                                        placeholder="Để nhận thông tin đơn hàng"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-bold text-gray-700 mb-2">Ghi chú (Tùy chọn)</label>
                                    <textarea
                                        value={contactInfo.ghiChu}
                                        onChange={(e) => setContactInfo({ ...contactInfo, ghiChu: e.target.value })}
                                        className="w-full px-4 py-3.5 bg-gray-50 border-none rounded-2xl focus:ring-2 focus:ring-blue-500 transition-all h-32 resize-none"
                                        placeholder="Ví dụ: Mang theo nôi em bé, đi cổng số mấy..."
                                    ></textarea>
                                </div>
                            </form>
                        </div>

                        <div className="bg-blue-600 rounded-3xl p-8 text-white shadow-xl shadow-blue-200">
                            <div className="flex items-start gap-4">
                                <div className="p-3 bg-white/20 rounded-2xl backdrop-blur-sm">
                                    <FaShieldAlt className="text-2xl" />
                                </div>
                                <div>
                                    <h3 className="text-xl font-bold mb-2">An tâm tuyệt đối</h3>
                                    <p className="text-blue-100 text-sm leading-relaxed">Dịch vụ của chúng tôi cam kết đúng giờ, tài xế chuyên nghiệp và giá trọn gói không phát sinh. Bảo hiểm hành khách được bao gồm trong mỗi chuyến đi.</p>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Summary */}
                    <div className="lg:col-span-1">
                        <div className="bg-white rounded-3xl shadow-sm border border-gray-100 p-8 sticky top-24">
                            <h2 className="text-xl font-bold text-gray-900 mb-6">Chi tiết đặt xe</h2>

                            <div className="flex items-center gap-4 mb-6 pb-6 border-b border-gray-50">
                                <img src={service.nhaCungCap.logo} alt="" className="w-12 h-12 rounded-xl object-contain border" />
                                <div>
                                    <p className="font-bold text-gray-900">{service.nhaCungCap.ten}</p>
                                    <p className="text-sm text-gray-500">{service.loaiXe} {service.soChoNgoi} chỗ</p>
                                </div>
                            </div>

                            <div className="space-y-6 mb-8">
                                <div className="flex gap-4">
                                    <div className="mt-1"><FaMapMarkerAlt className="text-blue-500" /></div>
                                    <div>
                                        <p className="text-xs text-gray-400 font-bold uppercase tracking-wider">Điểm đón</p>
                                        <p className="text-sm font-bold text-gray-900">{pickupLocation}</p>
                                    </div>
                                </div>
                                <div className="flex gap-4">
                                    <div className="mt-1"><FaMapMarkerAlt className="text-orange-500" /></div>
                                    <div>
                                        <p className="text-xs text-gray-400 font-bold uppercase tracking-wider">Điểm đến</p>
                                        <p className="text-sm font-bold text-gray-900">{dropoffLocation}</p>
                                    </div>
                                </div>
                                <div className="flex gap-4">
                                    <div className="mt-1"><FaClock className="text-indigo-500" /></div>
                                    <div>
                                        <p className="text-xs text-gray-400 font-bold uppercase tracking-wider">Thời gian</p>
                                        <p className="text-sm font-bold text-gray-900">{date} lúc {time}</p>
                                    </div>
                                </div>
                            </div>

                            <div className="bg-gray-50 rounded-2xl p-6 mb-8">
                                <div className="flex justify-between items-center mb-2">
                                    <span className="text-sm text-gray-500">Giá dịch vụ</span>
                                    <span className="font-bold text-gray-900">{formatPrice(service.giaTienMotChieu)}</span>
                                </div>
                                <div className="flex justify-between items-center mb-4">
                                    <span className="text-sm text-gray-500">Phí sân bay & Cầu đường</span>
                                    <span className="text-sm font-bold text-green-600">Đã bao gồm</span>
                                </div>
                                <div className="pt-4 border-t border-gray-200 flex justify-between items-center">
                                    <span className="font-bold text-gray-900">Tổng cộng</span>
                                    <span className="text-2xl font-extrabold text-blue-600">{formatPrice(service.giaTienMotChieu)}</span>
                                </div>
                            </div>

                            <button
                                onClick={handleSubmit}
                                className="w-full bg-orange-500 hover:bg-orange-600 text-white py-4 rounded-2xl font-extrabold shadow-lg shadow-orange-200 transition-all active:scale-95"
                            >
                                TIẾP TỤC ĐẾN THANH TOÁN
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
