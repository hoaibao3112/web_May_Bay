'use client';

import { useState, useEffect } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { FaCar, FaUsers, FaSuitcase, FaStar, FaSnowflake, FaWifi, FaPlaneDeparture } from 'react-icons/fa';
import { MdLuggage, MdTimer } from 'react-icons/md';
import Header from '../components/Header';

interface AirportTransferOption {
    id: number;
    loaiXe: string;
    soChoNgoi: number;
    giaTienMotChieu: number;
    giaTienKhuHoi: number | null;
    moTa: string;
    tienIch: string[];
    hinhAnh: string[];
    nhaCungCap: {
        ten: string;
        logo: string;
        danhGiaTrungBinh: number;
        tongSoDanhGia: number;
    };
    sanBay: {
        ten: string;
        ma: string;
        thanhPho: string;
    };
}

export default function AirportTransferSearchResults() {
    const searchParams = useSearchParams();
    const router = useRouter();
    const [services, setServices] = useState<AirportTransferOption[]>([]);
    const [loading, setLoading] = useState(true);
    const [filters, setFilters] = useState({
        giaMin: '',
        giaMax: '',
        nhaCungCap: '',
        loaiXe: '',
        soHanhKhach: '',
    });

    const pickupLocation = searchParams.get('pickupLocation') || '';
    const dropoffLocation = searchParams.get('dropoffLocation') || '';
    const date = searchParams.get('date') || '';
    const time = searchParams.get('time') || '';
    const passengers = searchParams.get('passengers') || '2';
    const luggage = searchParams.get('luggage') || '2';
    const airportIdParam = searchParams.get('airportId');

    useEffect(() => {
        searchAirportTransfers();
    }, [pickupLocation, date, passengers]);

    const searchAirportTransfers = async () => {
        setLoading(true);
        try {
            // Suggest airport from location string or use airportId from params
            const airportId = airportIdParam ? parseInt(airportIdParam) : await guessAirportId(pickupLocation);

            const params = new URLSearchParams({
                sanBayId: airportId.toString(),
                soHanhKhach: passengers,
            });

            const response = await fetch(`http://localhost:5000/airport-transfer-search?${params.toString()}`);

            if (response.ok) {
                const data = await response.json();
                setServices(data || []);
            }
        } catch (error) {
            console.error('Error searching airport transfers:', error);
        } finally {
            setLoading(false);
        }
    };

    const guessAirportId = async (query: string) => {
        try {
            const res = await fetch(`http://localhost:5000/airport-transfer-search/suggestions?q=${encodeURIComponent(query)}`);
            if (res.ok) {
                const suggestions = await res.json();
                if (suggestions.length > 0) return suggestions[0].id;
            }
        } catch (e) { }
        return 1; // Default to Noi Bai if not found
    };

    const formatPrice = (price: number) => {
        return new Intl.NumberFormat('vi-VN').format(price) + ' VNĐ';
    };

    const handleBooking = (serviceId: number) => {
        const params = new URLSearchParams({
            serviceId: serviceId.toString(),
            pickupLocation,
            dropoffLocation,
            date,
            time,
            passengers,
            luggage,
        });
        router.push(`/duadon/dat-xe?${params.toString()}`);
    };

    const filteredServices = services.filter(service => {
        if (filters.giaMin && service.giaTienMotChieu < parseFloat(filters.giaMin)) return false;
        if (filters.giaMax && service.giaTienMotChieu > parseFloat(filters.giaMax)) return false;
        if (filters.nhaCungCap && !service.nhaCungCap.ten.toLowerCase().includes(filters.nhaCungCap.toLowerCase())) return false;
        if (filters.loaiXe && !service.loaiXe.toLowerCase().includes(filters.loaiXe.toLowerCase())) return false;
        if (filters.soHanhKhach && service.soChoNgoi < parseInt(filters.soHanhKhach)) return false;
        return true;
    });

    return (
        <div className="min-h-screen bg-gray-50 pb-12">
            {/* Header / Banner */}
            <div className="bg-gradient-to-r from-blue-700 to-indigo-800 text-white py-8 shadow-lg">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                        <div>
                            <h1 className="text-3xl font-bold flex items-center gap-3">
                                <FaPlaneDeparture className="text-yellow-400" />
                                Đưa đón sân bay tại {pickupLocation}
                            </h1>
                            <div className="flex flex-wrap items-center gap-4 mt-2 text-blue-100">
                                <span className="flex items-center gap-1"><MdTimer /> {date} {time}</span>
                                <span className="flex items-center gap-1"><FaUsers /> {passengers} hành khách</span>
                                <span className="flex items-center gap-1"><MdLuggage /> {luggage} hành lý</span>
                            </div>
                        </div>
                        <button
                            onClick={() => router.push('/')}
                            className="bg-white/10 hover:bg-white/20 backdrop-blur-md border border-white/30 text-white px-6 py-2.5 rounded-xl font-semibold transition-all self-start md:self-center"
                        >
                            Thay đổi tìm kiếm
                        </button>
                    </div>
                </div>
            </div>

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
                    {/* Filters Sidebar */}
                    <div className="lg:col-span-1">
                        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 sticky top-24">
                            <h2 className="text-xl font-bold mb-6 text-gray-900 border-b pb-4">Bộ lọc tìm kiếm</h2>

                            {/* Price Range */}
                            <div className="mb-8">
                                <h3 className="text-sm font-bold text-gray-400 uppercase tracking-wider mb-4">Khoảng giá</h3>
                                <div className="space-y-3">
                                    <div className="relative">
                                        <input
                                            type="number"
                                            placeholder="Từ (VNĐ)"
                                            value={filters.giaMin}
                                            onChange={(e) => setFilters({ ...filters, giaMin: e.target.value })}
                                            className="w-full pl-4 pr-10 py-3 bg-gray-50 border-none rounded-xl text-sm focus:ring-2 focus:ring-blue-500"
                                        />
                                    </div>
                                    <div className="relative">
                                        <input
                                            type="number"
                                            placeholder="Đến (VNĐ)"
                                            value={filters.giaMax}
                                            onChange={(e) => setFilters({ ...filters, giaMax: e.target.value })}
                                            className="w-full pl-4 pr-10 py-3 bg-gray-50 border-none rounded-xl text-sm focus:ring-2 focus:ring-blue-500"
                                        />
                                    </div>
                                </div>
                            </div>

                            {/* Vehicle Type */}
                            <div className="mb-8">
                                <h3 className="text-sm font-bold text-gray-400 uppercase tracking-wider mb-4">Loại xe</h3>
                                <div className="grid grid-cols-2 gap-2">
                                    {['Sedan', 'SUV', 'MPV', 'Van'].map(type => (
                                        <button
                                            key={type}
                                            onClick={() => setFilters({ ...filters, loaiXe: filters.loaiXe === type ? '' : type })}
                                            className={`px-3 py-2 rounded-lg text-sm font-medium transition-all ${filters.loaiXe === type
                                                ? 'bg-blue-600 text-white'
                                                : 'bg-gray-50 text-gray-600 hover:bg-gray-100'
                                                }`}
                                        >
                                            {type}
                                        </button>
                                    ))}
                                </div>
                            </div>

                            <button
                                onClick={() => setFilters({ giaMin: '', giaMax: '', nhaCungCap: '', loaiXe: '', soHanhKhach: '' })}
                                className="w-full py-3 text-blue-600 font-bold hover:bg-blue-50 rounded-xl transition-all"
                            >
                                Đặt lại bộ lọc
                            </button>
                        </div>
                    </div>

                    {/* Results Content */}
                    <div className="lg:col-span-3">
                        <div className="mb-6 flex items-center justify-between">
                            <p className="text-gray-500 font-medium">
                                Hiển thị <span className="text-gray-900 font-bold">{filteredServices.length}</span> dịch vụ đưa đón
                            </p>
                            <div className="flex items-center gap-3">
                                <span className="text-sm text-gray-400">Sắp xếp:</span>
                                <select className="bg-white border-none rounded-lg text-sm font-bold text-gray-700 shadow-sm focus:ring-blue-500">
                                    <option>Giá thấp nhất</option>
                                    <option>Đánh giá cao nhất</option>
                                    <option>Phổ biến nhất</option>
                                </select>
                            </div>
                        </div>

                        {loading ? (
                            <div className="space-y-4">
                                {[1, 2, 3].map(i => (
                                    <div key={i} className="bg-white rounded-2xl p-6 h-64 animate-pulse shadow-sm"></div>
                                ))}
                            </div>
                        ) : filteredServices.length === 0 ? (
                            <div className="bg-white rounded-3xl shadow-xl p-16 text-center border border-gray-100 mt-8">
                                <div className="text-8xl mb-6">🚕</div>
                                <h3 className="text-2xl font-bold text-gray-800 mb-2">Chưa tìm thấy xe phù hợp</h3>
                                <p className="text-gray-600 max-w-md mx-auto">Chúng tôi chưa có dịch vụ tại khu vực này hoặc với tiêu chí bạn chọn. Vui lòng thử lại với thông số khác.</p>
                                <button
                                    onClick={() => router.push('/')}
                                    className="mt-8 px-8 py-3 bg-blue-600 text-white rounded-2xl font-bold hover:bg-blue-700 transition shadow-lg"
                                >
                                    Quay lại trang chủ
                                </button>
                            </div>
                        ) : (
                            <div className="space-y-6">
                                {filteredServices.map((service) => (
                                    <div key={service.id} className="group bg-white rounded-3xl shadow-sm hover:shadow-xl transition-all border border-gray-100 overflow-hidden flex flex-col md:flex-row">
                                        {/* Image Section */}
                                        <div className="md:w-1/3 relative bg-gray-100 p-4">
                                            <div className="aspect-[4/3] rounded-2xl overflow-hidden bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center">
                                                {service.hinhAnh && service.hinhAnh.length > 0 ? (
                                                    <img src={service.hinhAnh[0]} alt={service.loaiXe} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
                                                ) : (
                                                    <FaCar className="text-7xl text-blue-200" />
                                                )}
                                            </div>
                                            <div className="absolute top-6 left-6 bg-white/90 backdrop-blur px-3 py-1.5 rounded-full shadow-sm text-xs font-bold text-gray-700">
                                                {service.loaiXe}
                                            </div>
                                        </div>

                                        {/* Info Section */}
                                        <div className="md:w-2/3 p-6 flex flex-col justify-between">
                                            <div>
                                                <div className="flex justify-between items-start mb-4">
                                                    <div>
                                                        <h3 className="text-2xl font-bold text-gray-900 mb-1">{service.loaiXe} {service.soChoNgoi} chỗ</h3>
                                                        <div className="flex items-center gap-3">
                                                            <div className="flex items-center gap-2">
                                                                <img src={service.nhaCungCap.logo} alt="" className="w-6 h-6 rounded-full" />
                                                                <span className="text-sm font-semibold text-gray-600">{service.nhaCungCap.ten}</span>
                                                            </div>
                                                            <div className="h-4 w-px bg-gray-200"></div>
                                                            <div className="flex items-center gap-1">
                                                                <FaStar className="text-yellow-400 text-sm" />
                                                                <span className="text-sm font-bold text-gray-900">{service.nhaCungCap.danhGiaTrungBinh}</span>
                                                                <span className="text-xs text-gray-400">({service.nhaCungCap.tongSoDanhGia})</span>
                                                            </div>
                                                        </div>
                                                    </div>
                                                    <div className="text-right">
                                                        <div className="text-xs text-gray-400 uppercase font-bold tracking-wider mb-1">Giá từ</div>
                                                        <div className="text-2xl font-extrabold text-blue-600">{formatPrice(service.giaTienMotChieu)}</div>
                                                        <div className="text-xs text-green-600 font-bold bg-green-50 px-2 py-0.5 rounded-full inline-block mt-1">Giá trọn gói</div>
                                                    </div>
                                                </div>

                                                <div className="grid grid-cols-2 gap-y-3 mb-6">
                                                    <div className="flex items-center gap-2 text-gray-500 text-sm">
                                                        <FaUsers className="text-blue-500" />
                                                        <span>Tối đa {service.soChoNgoi} hành khách</span>
                                                    </div>
                                                    <div className="flex items-center gap-2 text-gray-500 text-sm">
                                                        <MdLuggage className="text-blue-500" />
                                                        <span>Theo quy định xe ({service.soChoNgoi} hành lý)</span>
                                                    </div>
                                                    {service.tienIch.map((item, idx) => (
                                                        <div key={idx} className="flex items-center gap-2 text-gray-500 text-sm">
                                                            {item.toLowerCase().includes('wifi') ? <FaWifi className="text-blue-500" /> : <FaSnowflake className="text-blue-500" />}
                                                            <span>{item}</span>
                                                        </div>
                                                    ))}
                                                </div>
                                            </div>

                                            <div className="flex items-center justify-between pt-6 border-t border-gray-50">
                                                <button className="text-blue-600 font-bold text-sm flex items-center gap-1 hover:gap-2 transition-all">
                                                    Chi tiết dịch vụ <span className="text-lg">›</span>
                                                </button>
                                                <button
                                                    onClick={() => handleBooking(service.id)}
                                                    className="bg-orange-500 hover:bg-orange-600 text-white px-10 py-3.5 rounded-2xl font-extrabold shadow-lg shadow-orange-200 transition-all active:scale-95"
                                                >
                                                    ĐẶT XE NGAY
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
