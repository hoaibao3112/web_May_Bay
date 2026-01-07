'use client';

import { useState, useEffect } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { FaCar, FaUsers, FaSuitcase, FaStar, FaSnowflake, FaWifi } from 'react-icons/fa';
import { MdLuggage } from 'react-icons/md';

interface CarRentalOption {
    id: number;
    nhaCungCap: {
        id: number;
        tenNhaCungCap: string;
        logo?: string;
        danhGiaTrungBinh: number;
        soDanhGia: number;
    };
    loaiXe: {
        id: number;
        tenLoaiXe: string;
        moTa?: string;
        soHanhKhach: number;
        soHanhLy: number;
        hinhAnh?: string;
        tienNghi?: any;
    };
    tuyenDuong?: {
        diemDi: string;
        diemDen: string;
        khoangCach?: number;
        thoiGianDuKien?: number;
    };
    giaTheoGio?: number;
    giaTheoNgay?: number;
    giaTheoTuyen?: number;
    donViTienTe: string;
    giamGia?: number;
    phuThu?: any;
    surcharges?: any;
    totalSurcharge?: number;
    finalPrice: number;
}

export default function CarRentalSearchResults() {
    const searchParams = useSearchParams();
    const router = useRouter();
    const [cars, setCars] = useState<CarRentalOption[]>([]);
    const [loading, setLoading] = useState(true);
    const [filters, setFilters] = useState({
        giaMin: '',
        giaMax: '',
        nhaCungCap: '',
        loaiXe: '',
        soHanhKhach: '',
    });

    const from = searchParams.get('from') || '';
    const to = searchParams.get('to') || '';
    const pickupDate = searchParams.get('pickupDate') || '';
    const pickupTime = searchParams.get('pickupTime') || '';
    const dropoffDate = searchParams.get('dropoffDate') || '';
    const dropoffTime = searchParams.get('dropoffTime') || '';
    const passengers = searchParams.get('passengers') || '2';
    const luggage = searchParams.get('luggage') || '2';

    useEffect(() => {
        searchCarRentals();
    }, [from, to, pickupDate]);

    const searchCarRentals = async () => {
        setLoading(true);
        try {
            const params = new URLSearchParams({
                diemDi: from,
                diemDen: to,
                ngayGioDon: `${pickupDate}T${pickupTime}`,
                soHanhKhach: passengers,
                soHanhLy: luggage,
            });

            const response = await fetch(`http://localhost:5000/car-rental-search?${params.toString()}`);

            if (response.ok) {
                const data = await response.json();
                setCars(data.data || []);
            }
        } catch (error) {
            console.error('Error searching car rentals:', error);
        } finally {
            setLoading(false);
        }
    };

    const formatPrice = (price: number) => {
        return new Intl.NumberFormat('vi-VN').format(price) + ' VNĐ';
    };

    const formatDateTime = (date: string, time: string) => {
        const d = new Date(date);
        return `${d.toLocaleDateString('vi-VN')} ${time}`;
    };

    const handleBooking = (carId: number) => {
        const params = new URLSearchParams({
            carId: carId.toString(),
            from,
            to,
            pickupDate,
            pickupTime,
            dropoffDate: dropoffDate || pickupDate,
            dropoffTime,
            passengers,
            luggage,
        });
        router.push(`/thuexe/dat-xe?${params.toString()}`);
    };

    const filteredCars = cars.filter(car => {
        if (filters.giaMin && car.finalPrice < parseFloat(filters.giaMin)) return false;
        if (filters.giaMax && car.finalPrice > parseFloat(filters.giaMax)) return false;
        if (filters.nhaCungCap && !car.nhaCungCap.tenNhaCungCap.toLowerCase().includes(filters.nhaCungCap.toLowerCase())) return false;
        if (filters.loaiXe && !car.loaiXe.tenLoaiXe.toLowerCase().includes(filters.loaiXe.toLowerCase())) return false;
        if (filters.soHanhKhach && car.loaiXe.soHanhKhach < parseInt(filters.soHanhKhach)) return false;
        return true;
    });

    return (
        <div className="min-h-screen bg-gray-50">
            {/* Header */}
            <div className="bg-gradient-to-r from-blue-600 to-blue-700 text-white py-6 shadow-md">
                <div className="container mx-auto px-4">
                    <div className="flex items-center justify-between">
                        <div>
                            <h1 className="text-2xl font-bold flex items-center gap-2">
                                <FaCar className="text-3xl" />
                                Thuê xe từ {from}
                            </h1>
                            <p className="text-blue-100 mt-1">
                                {formatDateTime(pickupDate, pickupTime)} • {passengers} hành khách • {luggage} hành lý
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

                            {/* Khoảng giá */}
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

                            {/* Số hành khách */}
                            <div className="mb-6">
                                <h3 className="font-semibold mb-3 text-gray-700">Số hành khách tối thiểu</h3>
                                <input
                                    type="number"
                                    placeholder="VD: 4"
                                    value={filters.soHanhKhach}
                                    onChange={(e) => setFilters({ ...filters, soHanhKhach: e.target.value })}
                                    className="w-full px-3 py-2 border rounded-lg text-sm"
                                />
                            </div>

                            {/* Loại xe */}
                            <div className="mb-6">
                                <h3 className="font-semibold mb-3 text-gray-700">Loại xe</h3>
                                <input
                                    type="text"
                                    placeholder="VD: Sedan, SUV, MPV..."
                                    value={filters.loaiXe}
                                    onChange={(e) => setFilters({ ...filters, loaiXe: e.target.value })}
                                    className="w-full px-3 py-2 border rounded-lg text-sm"
                                />
                            </div>

                            <button
                                onClick={() => setFilters({ giaMin: '', giaMax: '', nhaCungCap: '', loaiXe: '', soHanhKhach: '' })}
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
                                Tìm thấy <span className="font-bold text-blue-600">{filteredCars.length}</span> xe
                            </p>
                            <select className="px-4 py-2 border rounded-lg text-sm">
                                <option>Sắp xếp theo giá</option>
                                <option>Số chỗ ngồi</option>
                                <option>Đánh giá</option>
                            </select>
                        </div>

                        {loading ? (
                            <div className="text-center py-20">
                                <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
                                <p className="mt-4 text-gray-600">Đang tìm kiếm xe...</p>
                            </div>
                        ) : filteredCars.length === 0 ? (
                            <div className="bg-white rounded-xl shadow-md p-12 text-center">
                                <FaCar className="text-6xl text-gray-300 mx-auto mb-4" />
                                <h3 className="text-xl font-bold text-gray-800 mb-2">Không tìm thấy xe phù hợp</h3>
                                <p className="text-gray-600">Vui lòng thử thay đổi điều kiện tìm kiếm</p>
                            </div>
                        ) : (
                            <div className="space-y-4">
                                {filteredCars.map((car) => (
                                    <div key={car.id} className="bg-white rounded-xl shadow-md hover:shadow-lg transition overflow-hidden">
                                        <div className="p-6">
                                            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                                                {/* Car Image */}
                                                <div className="md:col-span-1">
                                                    <div className="w-full h-48 bg-gradient-to-br from-blue-100 to-blue-200 rounded-lg flex items-center justify-center overflow-hidden">
                                                        {car.loaiXe.hinhAnh ? (
                                                            <img
                                                                src={car.loaiXe.hinhAnh}
                                                                alt={car.loaiXe.tenLoaiXe}
                                                                className="w-full h-full object-cover"
                                                            />
                                                        ) : (
                                                            <FaCar className="text-6xl text-blue-400" />
                                                        )}
                                                    </div>
                                                </div>

                                                {/* Car Details */}
                                                <div className="md:col-span-2">
                                                    <div className="flex items-start justify-between mb-3">
                                                        <div>
                                                            <h3 className="font-bold text-xl text-gray-800">{car.loaiXe.tenLoaiXe}</h3>
                                                            <p className="text-sm text-gray-600">{car.nhaCungCap.tenNhaCungCap}</p>
                                                            <div className="flex items-center gap-1 mt-1">
                                                                <FaStar className="text-yellow-400 text-sm" />
                                                                <span className="text-sm font-semibold text-gray-700">
                                                                    {car.nhaCungCap.danhGiaTrungBinh || 0}
                                                                </span>
                                                                <span className="text-sm text-gray-500">
                                                                    ({car.nhaCungCap.soDanhGia || 0} đánh giá)
                                                                </span>
                                                            </div>
                                                        </div>
                                                        <div className="text-right">
                                                            <p className="text-2xl font-bold text-orange-600">{formatPrice(car.finalPrice)}</p>
                                                            <p className="text-sm text-gray-500">
                                                                {car.giaTheoGio && '/giờ'}
                                                                {car.giaTheoNgay && '/ngày'}
                                                                {car.giaTheoTuyen && '/chuyến'}
                                                            </p>
                                                            {car.giamGia && car.giamGia > 0 && (
                                                                <p className="text-sm text-green-600 font-semibold">
                                                                    Giảm {formatPrice(car.giamGia)}
                                                                </p>
                                                            )}
                                                        </div>
                                                    </div>

                                                    {/* Capacity */}
                                                    <div className="flex items-center gap-6 mb-4">
                                                        <div className="flex items-center gap-2 text-gray-700">
                                                            <FaUsers className="text-blue-500" />
                                                            <span className="text-sm">{car.loaiXe.soHanhKhach} hành khách</span>
                                                        </div>
                                                        <div className="flex items-center gap-2 text-gray-700">
                                                            <FaSuitcase className="text-blue-500" />
                                                            <span className="text-sm">{car.loaiXe.soHanhLy} hành lý</span>
                                                        </div>
                                                    </div>

                                                    {/* Amenities */}
                                                    {car.loaiXe.tienNghi && (
                                                        <div className="flex items-center gap-4 mb-4 pb-4 border-b">
                                                            {car.loaiXe.tienNghi.wifi && (
                                                                <div className="flex items-center gap-1 text-sm text-gray-600">
                                                                    <FaWifi className="text-blue-500" />
                                                                    <span>WiFi</span>
                                                                </div>
                                                            )}
                                                            {car.loaiXe.tienNghi.dieuHoa && (
                                                                <div className="flex items-center gap-1 text-sm text-gray-600">
                                                                    <FaSnowflake className="text-blue-500" />
                                                                    <span>Điều hòa</span>
                                                                </div>
                                                            )}
                                                        </div>
                                                    )}

                                                    {/* Route Info */}
                                                    {car.tuyenDuong && (
                                                        <div className="mb-4 text-sm text-gray-600">
                                                            <p>
                                                                <span className="font-semibold">Tuyến:</span> {car.tuyenDuong.diemDi} → {car.tuyenDuong.diemDen}
                                                            </p>
                                                            {car.tuyenDuong.khoangCach && (
                                                                <p>
                                                                    <span className="font-semibold">Khoảng cách:</span> {car.tuyenDuong.khoangCach} km
                                                                </p>
                                                            )}
                                                        </div>
                                                    )}

                                                    {/* Description */}
                                                    {car.loaiXe.moTa && (
                                                        <p className="text-sm text-gray-600 mb-4">{car.loaiXe.moTa}</p>
                                                    )}

                                                    <div className="flex items-center justify-between">
                                                        <button className="text-blue-600 font-semibold text-sm hover:underline">
                                                            Xem chi tiết
                                                        </button>
                                                        <button
                                                            onClick={() => handleBooking(car.id)}
                                                            className="bg-orange-500 text-white px-8 py-3 rounded-lg font-bold hover:bg-orange-600 transition shadow-md"
                                                        >
                                                            Đặt ngay
                                                        </button>
                                                    </div>
                                                </div>
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
