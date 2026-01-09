'use client';

import { useState, useEffect } from 'react';
import { useSearchParams } from 'next/navigation';
import Link from 'next/link';

interface Activity {
    id: number;
    maHoatDong: string;
    tenHoatDong: string;
    moTaNgan: string;
    diaDiem: string;
    thanhPho: string;
    giaTuMoiNguoi: number;
    danhGiaTrungBinh: number;
    soLuotDanhGia: number;
    thoiGianDienRa: string;
    hinhAnh: any[];
    danhMuc: any;
}

export default function ActivitiesPage() {
    const searchParams = useSearchParams();
    const [activities, setActivities] = useState<Activity[]>([]);
    const [categories, setCategories] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    // Filters
    const [selectedCity, setSelectedCity] = useState(searchParams.get('thanhPho') || '');
    const [selectedCategory, setSelectedCategory] = useState(searchParams.get('danhMucId') || '');
    const [priceRange, setPriceRange] = useState<[number, number]>([0, 5000000]);
    const [minRating, setMinRating] = useState(0);
    const [sortBy, setSortBy] = useState('pho-bien');

    // Pagination
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);

    const cities = ['Hồ Chí Minh', 'Hà Nội', 'Đà Nẵng', 'Nha Trang', 'Phú Quốc', 'Đà Lạt'];

    useEffect(() => {
        fetchCategories();
    }, []);

    useEffect(() => {
        fetchActivities();
    }, [selectedCity, selectedCategory, sortBy, currentPage]);

    const fetchCategories = async () => {
        try {
            const res = await fetch('http://localhost:5000/activities/categories');
            const data = await res.json();
            setCategories(data);
        } catch (error) {
            console.error('Error fetching categories:', error);
        }
    };

    const fetchActivities = async () => {
        setLoading(true);
        try {
            const params = new URLSearchParams();
            if (selectedCity) params.append('thanhPho', selectedCity);
            if (selectedCategory) params.append('danhMucId', selectedCategory);
            params.append('sapXep', sortBy);
            params.append('page', currentPage.toString());
            params.append('limit', '12');

            const res = await fetch(`http://localhost:5000/activities/search?${params}`);
            const data = await res.json();

            setActivities(data.data || []);
            setTotalPages(data.meta?.totalPages || 1);
        } catch (error) {
            console.error('Error fetching activities:', error);
        } finally {
            setLoading(false);
        }
    };

    const formatPrice = (price: number) => {
        return new Intl.NumberFormat('vi-VN', {
            style: 'currency',
            currency: 'VND',
        }).format(price);
    };

    return (
        <div className="min-h-screen bg-gray-50">
            {/* Header */}
            <div className="bg-gradient-to-r from-pink-500 to-rose-500 text-white py-12">
                <div className="container mx-auto px-4">
                    <h1 className="text-4xl font-bold mb-2">Hoạt động & Vui chơi</h1>
                    <p className="text-white/90">Khám phá những trải nghiệm tuyệt vời</p>
                </div>
            </div>

            <div className="container mx-auto px-4 py-8">
                <div className="flex gap-6">
                    {/* Sidebar Filters */}
                    <div className="w-64 flex-shrink-0">
                        <div className="bg-white rounded-lg shadow-sm p-6 sticky top-4">
                            <h3 className="font-bold text-lg mb-4 flex items-center gap-2">
                                <span>🔍</span> Bộ lọc tìm kiếm
                            </h3>

                            {/* City Filter */}
                            <div className="mb-6">
                                <label className="font-semibold text-sm text-gray-700 mb-2 block">
                                    📍 Điểm đến
                                </label>
                                <select
                                    value={selectedCity}
                                    onChange={(e) => setSelectedCity(e.target.value)}
                                    className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-transparent"
                                >
                                    <option value="">Tất cả địa điểm</option>
                                    {cities.map(city => (
                                        <option key={city} value={city}>{city}</option>
                                    ))}
                                </select>
                            </div>

                            {/* Category Filter */}
                            <div className="mb-6">
                                <label className="font-semibold text-sm text-gray-700 mb-2 block">
                                    🎯 Danh mục
                                </label>
                                <div className="space-y-2">
                                    <label className="flex items-center gap-2 cursor-pointer">
                                        <input
                                            type="radio"
                                            name="category"
                                            value=""
                                            checked={selectedCategory === ''}
                                            onChange={(e) => setSelectedCategory(e.target.value)}
                                            className="text-pink-500 focus:ring-pink-500"
                                        />
                                        <span className="text-sm">Tất cả</span>
                                    </label>
                                    {categories.map(cat => (
                                        <label key={cat.id} className="flex items-center gap-2 cursor-pointer">
                                            <input
                                                type="radio"
                                                name="category"
                                                value={cat.id.toString()}
                                                checked={selectedCategory === cat.id.toString()}
                                                onChange={(e) => setSelectedCategory(e.target.value)}
                                                className="text-pink-500 focus:ring-pink-500"
                                            />
                                            <span className="text-sm">{cat.icon} {cat.tenDanhMuc}</span>
                                        </label>
                                    ))}
                                </div>
                            </div>

                            {/* Rating Filter */}
                            <div className="mb-6">
                                <label className="font-semibold text-sm text-gray-700 mb-2 block">
                                    ⭐ Đánh giá
                                </label>
                                {[4, 3, 2, 1].map(rating => (
                                    <label key={rating} className="flex items-center gap-2 cursor-pointer mb-2">
                                        <input
                                            type="radio"
                                            name="rating"
                                            value={rating}
                                            checked={minRating === rating}
                                            onChange={() => setMinRating(rating)}
                                            className="text-pink-500"
                                        />
                                        <span className="text-sm">
                                            {'⭐'.repeat(rating)} trở lên
                                        </span>
                                    </label>
                                ))}
                            </div>

                            <button
                                onClick={() => {
                                    setSelectedCity('');
                                    setSelectedCategory('');
                                    setMinRating(0);
                                }}
                                className="w-full px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 text-sm font-medium"
                            >
                                Xóa bộ lọc
                            </button>
                        </div>
                    </div>

                    {/* Main Content */}
                    <div className="flex-1">
                        {/* Sort & Results Count */}
                        <div className="flex justify-between items-center mb-6">
                            <p className="text-gray-600">
                                Tìm thấy <span className="font-semibold text-gray-900">{activities.length}</span> hoạt động
                            </p>
                            <select
                                value={sortBy}
                                onChange={(e) => setSortBy(e.target.value)}
                                className="px-4 py-2 border rounded-lg focus:ring-2 focus:ring-pink-500"
                            >
                                <option value="pho-bien">Phổ biến nhất</option>
                                <option value="gia-tang">Giá tăng dần</option>
                                <option value="gia-giam">Giá giảm dần</option>
                                <option value="danh-gia">Đánh giá cao</option>
                            </select>
                        </div>

                        {/* Activities Grid */}
                        {loading ? (
                            <div className="text-center py-12">
                                <div className="inline-block h-12 w-12 animate-spin rounded-full border-4 border-solid border-pink-500 border-r-transparent"></div>
                                <p className="mt-4 text-gray-600">Đang tải...</p>
                            </div>
                        ) : (
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                                {activities.map(activity => (
                                    <Link
                                        key={activity.id}
                                        href={`/hoat-dong/${activity.id}`}
                                        className="bg-white rounded-lg shadow-sm hover:shadow-lg transition overflow-hidden group"
                                    >
                                        {/* Image */}
                                        <div className="relative h-48 overflow-hidden">
                                            <img
                                                src={activity.hinhAnh?.[0]?.urlHinhAnh || 'https://via.placeholder.com/400x300?text=No+Image'}
                                                alt={activity.tenHoatDong}
                                                className="w-full h-full object-cover group-hover:scale-110 transition duration-300"
                                            />
                                            {activity.danhMuc && (
                                                <div className="absolute top-3 left-3 bg-white px-3 py-1 rounded-full text-sm font-medium shadow-sm">
                                                    {activity.danhMuc.icon} {activity.danhMuc.tenDanhMuc}
                                                </div>
                                            )}
                                        </div>

                                        {/* Content */}
                                        <div className="p-4">
                                            <h3 className="font-semibold text-lg mb-2 line-clamp-2 group-hover:text-pink-600 transition">
                                                {activity.tenHoatDong}
                                            </h3>

                                            <div className="flex items-center gap-2 text-sm text-gray-600 mb-2">
                                                <span>📍 {activity.diaDiem}</span>
                                            </div>

                                            <p className="text-sm text-gray-600 mb-3 line-clamp-2">
                                                {activity.moTaNgan}
                                            </p>

                                            <div className="flex items-center gap-2 mb-3">
                                                <div className="flex items-center gap-1">
                                                    <span className="text-yellow-400">⭐</span>
                                                    <span className="font-semibold">{activity.danhGiaTrungBinh || 0}</span>
                                                </div>
                                                <span className="text-gray-400">•</span>
                                                <span className="text-sm text-gray-600">
                                                    {activity.soLuotDanhGia} đánh giá
                                                </span>
                                            </div>

                                            <div className="flex items-center justify-between pt-3 border-t">
                                                <div>
                                                    <p className="text-xs text-gray-500">Từ</p>
                                                    <p className="text-lg font-bold text-pink-600">
                                                        {formatPrice(activity.giaTuMoiNguoi)}
                                                    </p>
                                                </div>
                                                <div className="text-xs text-gray-500">
                                                    ⏱️ {activity.thoiGianDienRa}
                                                </div>
                                            </div>
                                        </div>
                                    </Link>
                                ))}
                            </div>
                        )}

                        {/* Pagination */}
                        {totalPages > 1 && (
                            <div className="flex justify-center gap-2 mt-8">
                                <button
                                    onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                                    disabled={currentPage === 1}
                                    className="px-4 py-2 border rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
                                >
                                    Trước
                                </button>
                                {Array.from({ length: totalPages }, (_, i) => i + 1).map(page => (
                                    <button
                                        key={page}
                                        onClick={() => setCurrentPage(page)}
                                        className={`px-4 py-2 rounded-lg ${currentPage === page
                                                ? 'bg-pink-500 text-white'
                                                : 'border hover:bg-gray-50'
                                            }`}
                                    >
                                        {page}
                                    </button>
                                ))}
                                <button
                                    onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                                    disabled={currentPage === totalPages}
                                    className="px-4 py-2 border rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
                                >
                                    Sau
                                </button>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}
