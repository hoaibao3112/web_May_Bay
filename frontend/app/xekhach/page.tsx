'use client';

import { useState, useEffect } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { FaBus, FaClock, FaMapMarkerAlt, FaStar, FaWifi, FaSnowflake, FaToilet } from 'react-icons/fa';
import { MdAirlineSeatReclineExtra } from 'react-icons/md';

interface BusTrip {
    id: number;
    maChuyenXe: string;
    nhaXe: {
        id: number;
        tenNhaXe: string;
        logo?: string;
        danhGiaTrungBinh: number;
    };
    benXeDi: {
        tenBenXe: string;
        thanhPho: string;
    };
    benXeDen: {
        tenBenXe: string;
        thanhPho: string;
    };
    gioDi: string;
    gioDen: string;
    giaVe: number;
    soGheTrong: number;
    loaiXe: {
        tenLoaiXe: string;
        soGhe: number;
        tienNghi?: any;
    };
    khoangCach?: number;
    thoiGianChay?: number;
    diemDung?: any[];
}

export default function BusSearchResults() {
    const searchParams = useSearchParams();
    const router = useRouter();
    const [trips, setTrips] = useState<BusTrip[]>([]);
    const [loading, setLoading] = useState(true);
    const [filters, setFilters] = useState({
        gioKhoiHanh: '',
        giaMin: '',
        giaMax: '',
        hangXe: '',
        loaiXe: '',
    });

    const from = searchParams.get('from') || '';
    const to = searchParams.get('to') || '';
    const date = searchParams.get('date') || '';
    const passengers = searchParams.get('passengers') || '1';

    useEffect(() => {
        searchBusTrips();
    }, [from, to, date]);

    const searchBusTrips = async () => {
        setLoading(true);
        try {
            const response = await fetch('http://localhost:5000/bus-search', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    thanhPhoDi: from,
                    thanhPhoDen: to,
                    ngayDi: date,
                    soKhach: parseInt(passengers),
                }),
            });

            if (response.ok) {
                const data = await response.json();
                setTrips(data);
            }
        } catch (error) {
            console.error('Error searching bus trips:', error);
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
        return date.toLocaleDateString('vi-VN', { day: '2-digit', month: '2-digit' });
    };

    const formatPrice = (price: number) => {
        return new Intl.NumberFormat('vi-VN').format(price) + ' VNĐ';
    };

    const calculateDuration = (start: string, end: string) => {
        const startTime = new Date(start);
        const endTime = new Date(end);
        const diff = endTime.getTime() - startTime.getTime();
        const hours = Math.floor(diff / (1000 * 60 * 60));
        const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
        return `${hours}h${minutes > 0 ? minutes + 'm' : ''}`;
    };

    const handleBooking = (tripId: number) => {
        router.push(`/xekhach/dat-ve?tripId=${tripId}`);
    };

    const filteredTrips = trips.filter(trip => {
        if (filters.gioKhoiHanh) {
            const hour = new Date(trip.gioDi).getHours();
            if (filters.gioKhoiHanh === 'morning' && (hour < 6 || hour >= 12)) return false;
            if (filters.gioKhoiHanh === 'afternoon' && (hour < 12 || hour >= 18)) return false;
            if (filters.gioKhoiHanh === 'evening' && (hour < 18 || hour >= 24)) return false;
        }
        if (filters.giaMin && parseFloat(trip.giaVe.toString()) < parseFloat(filters.giaMin)) return false;
        if (filters.giaMax && parseFloat(trip.giaVe.toString()) > parseFloat(filters.giaMax)) return false;
        if (filters.hangXe && !trip.nhaXe.tenNhaXe.toLowerCase().includes(filters.hangXe.toLowerCase())) return false;
        if (filters.loaiXe && !trip.loaiXe.tenLoaiXe.toLowerCase().includes(filters.loaiXe.toLowerCase())) return false;
        return true;
    });

    return (
        <div className="min-h-screen bg-gray-50">
            {/* Header */}
            <div className="bg-blue-600 text-white py-6 shadow-md">
                <div className="container mx-auto px-4">
                    <div className="flex items-center justify-between">
                        <div>
                            <h1 className="text-2xl font-bold flex items-center gap-2">
                                <FaBus className="text-3xl" />
                                {from} → {to}
                            </h1>
                            <p className="text-blue-100 mt-1">
                                {formatDate(date)} • {passengers} hành khách
                            </p>
                        </div>
                        <button
                            onClick={() => router.push('/')}
                            className="bg-white text-blue-600 px-6 py-2 rounded-lg font-semibold hover:bg-blue-50 transition"
                        >
                            Thay đổi tìm kiếm
                        </button>
                    </div>
                </div>
            </div>

            <div className="container mx-auto px-4 py-8">
                <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
                    {/* Sidebar Filters */}
                    <div className="lg:col-span-1">
                        <div className="bg-white rounded-xl shadow-md p-6 sticky top-4">
                            <h2 className="text-lg font-bold mb-4 text-gray-800">Bộ lọc</h2>

                            {/* Giờ khởi hành */}
                            <div className="mb-6">
                                <h3 className="font-semibold mb-3 text-gray-700">Giờ khởi hành</h3>
                                <div className="space-y-2">
                                    {[
                                        { value: '', label: 'Tất cả' },
                                        { value: 'morning', label: 'Sáng (6h - 12h)' },
                                        { value: 'afternoon', label: 'Chiều (12h - 18h)' },
                                        { value: 'evening', label: 'Tối (18h - 24h)' },
                                    ].map((option) => (
                                        <label key={option.value} className="flex items-center cursor-pointer">
                                            <input
                                                type="radio"
                                                name="gioKhoiHanh"
                                                value={option.value}
                                                checked={filters.gioKhoiHanh === option.value}
                                                onChange={(e) => setFilters({ ...filters, gioKhoiHanh: e.target.value })}
                                                className="mr-2"
                                            />
                                            <span className="text-sm text-gray-600">{option.label}</span>
                                        </label>
                                    ))}
                                </div>
                            </div>

                            {/* Giá vé */}
                            <div className="mb-6">
                                <h3 className="font-semibold mb-3 text-gray-700">Khoảng giá</h3>
                                <div className="space-y-2">
                                    <input
                                        type="number"
                                        placeholder="Giá tối thiểu"
                                        value={filters.giaMin}
                                        onChange={(e) => setFilters({ ...filters, giaMin: e.target.value })}
                                        className="w-full px-3 py-2 border rounded-lg text-sm"
                                    />
                                    <input
                                        type="number"
                                        placeholder="Giá tối đa"
                                        value={filters.giaMax}
                                        onChange={(e) => setFilters({ ...filters, giaMax: e.target.value })}
                                        className="w-full px-3 py-2 border rounded-lg text-sm"
                                    />
                                </div>
                            </div>

                            {/* Loại xe */}
                            <div className="mb-6">
                                <h3 className="font-semibold mb-3 text-gray-700">Loại xe</h3>
                                <input
                                    type="text"
                                    placeholder="VD: Limousine, Giường nằm..."
                                    value={filters.loaiXe}
                                    onChange={(e) => setFilters({ ...filters, loaiXe: e.target.value })}
                                    className="w-full px-3 py-2 border rounded-lg text-sm"
                                />
                            </div>

                            <button
                                onClick={() => setFilters({ gioKhoiHanh: '', giaMin: '', giaMax: '', hangXe: '', loaiXe: '' })}
                                className="w-full bg-gray-200 text-gray-700 py-2 rounded-lg hover:bg-gray-300 transition text-sm font-semibold"
                            >
                                Xóa bộ lọc
                            </button>
                        </div>
                    </div>

                    {/* Results */}
                    <div className="lg:col-span-3">
                        <div className="mb-4 flex items-center justify-between">
                            <p className="text-gray-600">
                                Tìm thấy <span className="font-bold text-blue-600">{filteredTrips.length}</span> chuyến xe
                            </p>
                            <select className="px-4 py-2 border rounded-lg text-sm">
                                <option>Sắp xếp theo giá</option>
                                <option>Giờ khởi hành</option>
                                <option>Đánh giá</option>
                            </select>
                        </div>

                        {loading ? (
                            <div className="text-center py-20">
                                <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
                                <p className="mt-4 text-gray-600">Đang tìm kiếm chuyến xe...</p>
                            </div>
                        ) : filteredTrips.length === 0 ? (
                            <div className="bg-white rounded-xl shadow-md p-12 text-center">
                                <FaBus className="text-6xl text-gray-300 mx-auto mb-4" />
                                <h3 className="text-xl font-bold text-gray-800 mb-2">Không tìm thấy chuyến xe</h3>
                                <p className="text-gray-600">Vui lòng thử thay đổi điều kiện tìm kiếm</p>
                            </div>
                        ) : (
                            <div className="space-y-4">
                                {filteredTrips.map((trip) => (
                                    <div key={trip.id} className="bg-white rounded-xl shadow-md hover:shadow-lg transition overflow-hidden">
                                        <div className="p-6">
                                            <div className="flex items-start justify-between mb-4">
                                                <div className="flex items-center gap-4">
                                                    <div className="w-16 h-16 bg-blue-100 rounded-lg flex items-center justify-center">
                                                        <FaBus className="text-3xl text-blue-600" />
                                                    </div>
                                                    <div>
                                                        <h3 className="font-bold text-lg text-gray-800">{trip.nhaXe.tenNhaXe}</h3>
                                                        <p className="text-sm text-gray-600">{trip.loaiXe.tenLoaiXe}</p>
                                                        <div className="flex items-center gap-1 mt-1">
                                                            <FaStar className="text-yellow-400 text-sm" />
                                                            <span className="text-sm font-semibold text-gray-700">
                                                                {trip.nhaXe.danhGiaTrungBinh || 0}
                                                            </span>
                                                        </div>
                                                    </div>
                                                </div>
                                                <div className="text-right">
                                                    <p className="text-2xl font-bold text-orange-600">{formatPrice(parseFloat(trip.giaVe.toString()))}</p>
                                                    <p className="text-sm text-gray-500">/khách</p>
                                                </div>
                                            </div>

                                            <div className="flex items-center justify-between mb-4">
                                                <div className="flex-1">
                                                    <p className="text-2xl font-bold text-gray-800">{formatTime(trip.gioDi)}</p>
                                                    <p className="text-sm text-gray-600">{formatDate(trip.gioDi)}</p>
                                                    <p className="text-sm text-gray-500 mt-1">{trip.benXeDi.tenBenXe}</p>
                                                </div>

                                                <div className="flex-1 flex flex-col items-center px-4">
                                                    <p className="text-sm text-gray-500 mb-1">{calculateDuration(trip.gioDi, trip.gioDen)}</p>
                                                    <div className="w-full h-px bg-gray-300 relative">
                                                        <FaBus className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-blue-600 bg-white px-1" />
                                                    </div>
                                                    {trip.khoangCach && (
                                                        <p className="text-xs text-gray-400 mt-1">{trip.khoangCach} km</p>
                                                    )}
                                                </div>

                                                <div className="flex-1 text-right">
                                                    <p className="text-2xl font-bold text-gray-800">{formatTime(trip.gioDen)}</p>
                                                    <p className="text-sm text-gray-600">{formatDate(trip.gioDen)}</p>
                                                    <p className="text-sm text-gray-500 mt-1">{trip.benXeDen.tenBenXe}</p>
                                                </div>
                                            </div>

                                            {/* Amenities */}
                                            {trip.loaiXe.tienNghi && (
                                                <div className="flex items-center gap-4 mb-4 pb-4 border-b">
                                                    {trip.loaiXe.tienNghi.wifi && (
                                                        <div className="flex items-center gap-1 text-sm text-gray-600">
                                                            <FaWifi className="text-blue-500" />
                                                            <span>WiFi</span>
                                                        </div>
                                                    )}
                                                    {trip.loaiXe.tienNghi.dieuHoa && (
                                                        <div className="flex items-center gap-1 text-sm text-gray-600">
                                                            <FaSnowflake className="text-blue-500" />
                                                            <span>Điều hòa</span>
                                                        </div>
                                                    )}
                                                    {trip.loaiXe.tienNghi.toilet && (
                                                        <div className="flex items-center gap-1 text-sm text-gray-600">
                                                            <FaToilet className="text-blue-500" />
                                                            <span>Toilet</span>
                                                        </div>
                                                    )}
                                                    <div className="flex items-center gap-1 text-sm text-gray-600">
                                                        <MdAirlineSeatReclineExtra className="text-blue-500" />
                                                        <span>{trip.soGheTrong} ghế trống</span>
                                                    </div>
                                                </div>
                                            )}

                                            <div className="flex items-center justify-between">
                                                <button className="text-blue-600 font-semibold text-sm hover:underline">
                                                    Xem chi tiết
                                                </button>
                                                <button
                                                    onClick={() => handleBooking(trip.id)}
                                                    className="bg-orange-500 text-white px-8 py-3 rounded-lg font-bold hover:bg-orange-600 transition shadow-md"
                                                >
                                                    Đặt ngay
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}
