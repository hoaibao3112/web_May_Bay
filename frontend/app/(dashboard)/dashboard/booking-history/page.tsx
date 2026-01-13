'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import BookingDetailsModal from '../../../../components/BookingDetailsModal';

interface Booking {
    id: number | string;
    type: 'flight' | 'hotel' | 'bus' | 'activity';
    status: string;
    date: string;
    total: number;
    details: any;
}

export default function BookingHistoryPage() {
    const router = useRouter();
    const [activeTab, setActiveTab] = useState('all');
    const [loading, setLoading] = useState(true);
    const [bookings, setBookings] = useState<Booking[]>([]);
    const [user, setUser] = useState<any>(null);
    const [selectedBooking, setSelectedBooking] = useState<any>(null);
    const [showModal, setShowModal] = useState(false);
    const [loadingDetails, setLoadingDetails] = useState(false);

    useEffect(() => {
        // Check multiple possible keys for user data (prioritize the actual keys used by login)
        const token = localStorage.getItem('token') || localStorage.getItem('accessToken');
        const userInfo = localStorage.getItem('user') || localStorage.getItem('userInfo');

        if (!token || !userInfo) {
            router.push('/auth/login');
            return;
        }

        setUser(JSON.parse(userInfo));
        fetchAllBookings();
    }, []);

    const fetchAllBookings = async () => {
        setLoading(true);
        try {
            const token = localStorage.getItem('token') || localStorage.getItem('accessToken');
            const userInfoStr = localStorage.getItem('user') || localStorage.getItem('userInfo');

            if (!token || !userInfoStr) {
                console.error('❌ Missing authentication data');
                router.push('/auth/login');
                return;
            }

            const userInfo = JSON.parse(userInfoStr);
            const email = userInfo?.email;

            if (!email) {
                console.error('❌ User email not found in userInfo');
                router.push('/auth/login');
                return;
            }

            console.log('🔍 Fetching bookings for email:', email);
            console.log('🔑 Token:', token?.substring(0, 20) + '...');

            // Fetch all booking types
            const [activityRes, busRes, flightRes, hotelRes] = await Promise.all([
                fetch(`http://localhost:5000/activities/bookings/my-orders?email=${email}`, {
                    headers: { 'Authorization': `Bearer ${token}` }
                }),
                fetch('http://localhost:5000/bus-bookings/my-bookings', {
                    headers: { 'Authorization': `Bearer ${token}` }
                }),
                fetch('http://localhost:5000/bookings/user/my-bookings', {
                    headers: { 'Authorization': `Bearer ${token}` }
                }),
                fetch('http://localhost:5000/hotel-bookings/user/1', {
                    headers: { 'Authorization': `Bearer ${token}` }
                }),
            ]);

            console.log('📊 Activity response status:', activityRes.status);
            console.log('🚌 Bus response status:', busRes.status);
            console.log('✈️ Flight response status:', flightRes.status);
            console.log('🏨 Hotel response status:', hotelRes.status);

            const activities = activityRes.ok ? await activityRes.json() : [];
            const buses = busRes.ok ? await busRes.json() : [];
            const flights = flightRes.ok ? await flightRes.json() : [];
            const hotels = hotelRes.ok ? await hotelRes.json() : [];

            console.log('✅ Activities fetched:', activities);
            console.log('✅ Buses fetched:', buses);
            console.log('✅ Flights fetched:', flights);
            console.log('✅ Hotels fetched:', hotels);

            // Transform to unified format
            const allBookings: Booking[] = [
                ...activities.map((a: any) => ({
                    id: a.maDat,
                    type: 'activity' as const,
                    status: a.trangThai,
                    date: a.ngayThucHien,
                    total: a.tongTien,
                    details: a,
                })),
                ...buses.map((b: any) => ({
                    id: b.id,
                    type: 'bus' as const,
                    status: b.trangThaiDat,
                    date: b.chuyenXe?.gioDi,
                    total: b.tongTien,
                    details: b,
                })),
                ...flights.map((f: any) => ({
                    id: f.id,
                    type: 'flight' as const,
                    status: f.trangThai,
                    date: f.changBay?.gioKhoiHanh,
                    total: f.tongTien,
                    details: f,
                })),
                ...hotels.map((h: any) => ({
                    id: h.id,
                    type: 'hotel' as const,
                    status: h.trangThai,
                    date: h.ngayNhanPhong,
                    total: h.tongTien,
                    details: h,
                })),
            ];

            console.log('📦 Total bookings:', allBookings.length);

            // Sort by date descending
            allBookings.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
            setBookings(allBookings);
        } catch (error) {
            console.error('❌ Error fetching bookings:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleViewDetails = async (booking: Booking) => {
        setLoadingDetails(true);
        try {
            const token = localStorage.getItem('token') || localStorage.getItem('accessToken');
            let endpoint = '';

            switch (booking.type) {
                case 'flight':
                    endpoint = `http://localhost:5000/bookings/${booking.id}/details`;
                    break;
                case 'hotel':
                    endpoint = `http://localhost:5000/hotel-bookings/${booking.id}/details`;
                    break;
                case 'bus':
                    endpoint = `http://localhost:5000/bus-bookings/${booking.id}/details`;
                    break;
                case 'activity':
                    endpoint = `http://localhost:5000/activities/bookings/${booking.id}/details`;
                    break;
                default:
                    console.error('Unknown booking type:', booking.type);
                    return;
            }

            const response = await fetch(endpoint, {
                headers: { 'Authorization': `Bearer ${token}` }
            });

            if (response.ok) {
                const detailsWithQR = await response.json();
                setSelectedBooking({ ...detailsWithQR, type: booking.type });
                setShowModal(true);
            } else {
                console.error('Failed to fetch booking details');
                alert('Không thể tải chi tiết đặt chỗ');
            }
        } catch (error) {
            console.error('Error fetching booking details:', error);
            alert('Đã xảy ra lỗi khi tải chi tiết');
        } finally {
            setLoadingDetails(false);
        }
    };

    const formatCurrency = (amount: number) => {
        return new Intl.NumberFormat('vi-VN', {
            style: 'currency',
            currency: 'VND',
        }).format(amount);
    };

    const formatDate = (dateStr: string) => {
        return new Date(dateStr).toLocaleDateString('vi-VN', {
            day: '2-digit',
            month: '2-digit',
            year: 'numeric',
        });
    };

    const getStatusColor = (status: string) => {
        switch (status) {
            case 'DA_XAC_NHAN':
            case 'HOAN_THANH':
            case 'DA_THANH_TOAN':
                return 'bg-green-100 text-green-800';
            case 'CHO_XAC_NHAN':
            case 'GIU_CHO':
                return 'bg-yellow-100 text-yellow-800';
            case 'HUY':
                return 'bg-red-100 text-red-800';
            default:
                return 'bg-gray-100 text-gray-800';
        }
    };

    const getStatusText = (status: string) => {
        const statusMap: Record<string, string> = {
            'CHO_XAC_NHAN': 'Chờ xác nhận',
            'DA_XAC_NHAN': 'Đã xác nhận',
            'HOAN_THANH': 'Hoàn thành',
            'HUY': 'Đã hủy',
            'GIU_CHO': 'Giữ chỗ',
            'DA_THANH_TOAN': 'Đã thanh toán',
        };
        return statusMap[status] || status;
    };

    const getTypeIcon = (type: string) => {
        switch (type) {
            case 'flight':
                return '✈️';
            case 'hotel':
                return '🏨';
            case 'bus':
                return '🚌';
            case 'activity':
                return '🎯';
            default:
                return '📋';
        }
    };

    const getTypeName = (type: string) => {
        switch (type) {
            case 'flight':
                return 'Vé máy bay';
            case 'hotel':
                return 'Khách sạn';
            case 'bus':
                return 'Xe khách';
            case 'activity':
                return 'Tour / Hoạt động';
            default:
                return 'Khác';
        }
    };

    const filteredBookings = bookings.filter(b => {
        if (activeTab === 'all') return true;
        return b.type === activeTab;
    });

    const stats = {
        total: bookings.length,
        flights: bookings.filter(b => b.type === 'flight').length,
        hotels: bookings.filter(b => b.type === 'hotel').length,
        buses: bookings.filter(b => b.type === 'bus').length,
        activities: bookings.filter(b => b.type === 'activity').length,
        totalSpent: bookings.reduce((sum, b) => sum + b.total, 0),
    };

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="inline-block h-12 w-12 animate-spin rounded-full border-4 border-solid border-blue-500 border-r-transparent"></div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50">
            {/* Header */}
            <div className="bg-gradient-to-r from-blue-600 to-blue-800 text-white py-8">
                <div className="container mx-auto px-4">
                    <h1 className="text-3xl font-bold mb-2">Lịch sử đặt chỗ</h1>
                    <p className="text-blue-100">Quản lý tất cả vé đã mua của bạn</p>
                </div>
            </div>

            <div className="container mx-auto px-4 py-8">
                {/* Stats Cards */}
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
                    <div className="bg-white rounded-lg shadow-sm p-6">
                        <div className="text-gray-600 text-sm mb-1">Tổng đơn</div>
                        <div className="text-3xl font-bold text-gray-900">{stats.total}</div>
                    </div>
                    <div className="bg-white rounded-lg shadow-sm p-6">
                        <div className="text-gray-600 text-sm mb-1">✈️ Vé máy bay</div>
                        <div className="text-3xl font-bold text-blue-600">{stats.flights}</div>
                    </div>
                    <div className="bg-white rounded-lg shadow-sm p-6">
                        <div className="text-gray-600 text-sm mb-1">🏨 Khách sạn</div>
                        <div className="text-3xl font-bold text-purple-600">{stats.hotels}</div>
                    </div>
                    <div className="bg-white rounded-lg shadow-sm p-6">
                        <div className="text-gray-600 text-sm mb-1">Tổng chi tiêu</div>
                        <div className="text-2xl font-bold text-green-600">{formatCurrency(stats.totalSpent)}</div>
                    </div>
                </div>

                {/* Tabs */}
                <div className="bg-white rounded-lg shadow-sm mb-6">
                    <div className="border-b overflow-x-auto">
                        <div className="flex">
                            <button
                                onClick={() => setActiveTab('all')}
                                className={`px-6 py-4 font-semibold border-b-2 transition ${activeTab === 'all'
                                    ? 'border-blue-600 text-blue-600'
                                    : 'border-transparent text-gray-600 hover:text-gray-900'
                                    }`}
                            >
                                📋 Tất cả ({stats.total})
                            </button>
                            <button
                                onClick={() => setActiveTab('flight')}
                                className={`px-6 py-4 font-semibold border-b-2 transition ${activeTab === 'flight'
                                    ? 'border-blue-600 text-blue-600'
                                    : 'border-transparent text-gray-600 hover:text-gray-900'
                                    }`}
                            >
                                ✈️ Vé máy bay ({stats.flights})
                            </button>
                            <button
                                onClick={() => setActiveTab('hotel')}
                                className={`px-6 py-4 font-semibold border-b-2 transition ${activeTab === 'hotel'
                                    ? 'border-blue-600 text-blue-600'
                                    : 'border-transparent text-gray-600 hover:text-gray-900'
                                    }`}
                            >
                                🏨 Khách sạn ({stats.hotels})
                            </button>
                            <button
                                onClick={() => setActiveTab('bus')}
                                className={`px-6 py-4 font-semibold border-b-2 transition ${activeTab === 'bus'
                                    ? 'border-blue-600 text-blue-600'
                                    : 'border-transparent text-gray-600 hover:text-gray-900'
                                    }`}
                            >
                                🚌 Xe khách ({stats.buses})
                            </button>
                            <button
                                onClick={() => setActiveTab('activity')}
                                className={`px-6 py-4 font-semibold border-b-2 transition ${activeTab === 'activity'
                                    ? 'border-blue-600 text-blue-600'
                                    : 'border-transparent text-gray-600 hover:text-gray-900'
                                    }`}
                            >
                                🎯 Tour ({stats.activities})
                            </button>
                        </div>
                    </div>
                </div>

                {/* Booking List */}
                {filteredBookings.length === 0 ? (
                    <div className="bg-white rounded-lg shadow-sm p-12 text-center">
                        <div className="text-6xl mb-4">📭</div>
                        <h3 className="text-xl font-semibold text-gray-900 mb-2">Chưa có đơn đặt chỗ</h3>
                        <p className="text-gray-600 mb-6">Bạn chưa có đơn đặt chỗ nào trong danh mục này</p>
                        <Link
                            href="/"
                            className="inline-block px-6 py-3 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700 transition"
                        >
                            Đặt vé ngay
                        </Link>
                    </div>
                ) : (
                    <div className="space-y-4">
                        {filteredBookings.map((booking) => (
                            <div key={`${booking.type}-${booking.id}`} className="bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow">
                                <div className="p-6">
                                    <div className="flex items-start justify-between mb-4">
                                        <div className="flex items-center gap-3">
                                            <div className="text-3xl">{getTypeIcon(booking.type)}</div>
                                            <div>
                                                <div className="font-semibold text-gray-900 text-lg">{getTypeName(booking.type)}</div>
                                                <div className="text-sm text-gray-600">Mã đơn: {booking.id}</div>
                                            </div>
                                        </div>
                                        <span className={`px-3 py-1 rounded-full text-sm font-semibold ${getStatusColor(booking.status)}`}>
                                            {getStatusText(booking.status)}
                                        </span>
                                    </div>

                                    {/* Booking Details */}
                                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                                        <div>
                                            <div className="text-sm text-gray-600">Ngày</div>
                                            <div className="font-semibold">{formatDate(booking.date)}</div>
                                        </div>
                                        <div>
                                            <div className="text-sm text-gray-600">Tổng tiền</div>
                                            <div className="font-semibold text-blue-600">{formatCurrency(booking.total)}</div>
                                        </div>
                                        {booking.type === 'activity' && (
                                            <div>
                                                <div className="text-sm text-gray-600">Tour</div>
                                                <div className="font-semibold">{booking.details.hoatDong?.tenHoatDong}</div>
                                            </div>
                                        )}
                                        {booking.type === 'bus' && (
                                            <div>
                                                <div className="text-sm text-gray-600">Hành trình</div>
                                                <div className="font-semibold">
                                                    {booking.details.chuyenXe?.tuyenXe?.benXeDi?.thanhPho} → {booking.details.chuyenXe?.tuyenXe?.benXeDen?.thanhPho}
                                                </div>
                                            </div>
                                        )}
                                        {booking.type === 'flight' && (
                                            <div>
                                                <div className="text-sm text-gray-600">Chuyến bay</div>
                                                <div className="font-semibold">
                                                    {booking.details.changBay?.sanBayDi?.tenSanBay} → {booking.details.changBay?.sanBayDen?.tenSanBay}
                                                </div>
                                            </div>
                                        )}
                                    </div>

                                    {/* Actions */}
                                    <div className="flex gap-3 pt-4 border-t">
                                        <button
                                            onClick={() => handleViewDetails(booking)}
                                            disabled={loadingDetails}
                                            className="px-4 py-2 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700 transition disabled:opacity-50 disabled:cursor-not-allowed"
                                        >
                                            {loadingDetails ? 'Đang tải...' : 'Xem chi tiết'}
                                        </button>
                                        {(booking.status === 'CHO_XAC_NHAN' || booking.status === 'GIU_CHO') && (
                                            <button className="px-4 py-2 border border-red-600 text-red-600 rounded-lg font-semibold hover:bg-red-50 transition">
                                                Hủy đơn
                                            </button>
                                        )}
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>

            {/* Booking Details Modal */}
            {showModal && selectedBooking && (
                <BookingDetailsModal
                    booking={selectedBooking}
                    type={selectedBooking.type}
                    qrCode={selectedBooking.qrCode}
                    onClose={() => {
                        setShowModal(false);
                        setSelectedBooking(null);
                    }}
                />
            )}
        </div>
    );
}
