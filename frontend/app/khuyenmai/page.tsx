'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';

interface Promotion {
    id: number;
    maKhuyenMai: string;
    tenKhuyenMai: string;
    moTa: string;
    loaiGiam: 'PERCENT' | 'FIXED';
    giaTriGiam: number;
    giamToiDa?: number;
    giaTriDonToiThieu: number;
    soLuotSuDung: number;
    soLuotDaSuDung: number;
    ngayBatDau: string;
    ngayKetThuc: string;
    isActive: boolean;
}

export default function PromotionsPage() {
    const [promotions, setPromotions] = useState<Promotion[]>([]);
    const [filteredPromotions, setFilteredPromotions] = useState<Promotion[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchQuery, setSearchQuery] = useState('');
    const [filterType, setFilterType] = useState<'ALL' | 'PERCENT' | 'FIXED'>('ALL');
    const [sortBy, setSortBy] = useState<'discount' | 'expiry'>('discount');
    const [copiedCode, setCopiedCode] = useState<string | null>(null);

    useEffect(() => {
        fetchPromotions();
    }, []);

    useEffect(() => {
        filterAndSortPromotions();
    }, [promotions, searchQuery, filterType, sortBy]);

    const fetchPromotions = async () => {
        try {
            const response = await fetch('http://localhost:5000/promotions/active/list');
            const data = await response.json();
            setPromotions(data);
            setLoading(false);
        } catch (error) {
            console.error('Error fetching promotions:', error);
            setLoading(false);
        }
    };

    const filterAndSortPromotions = () => {
        let filtered = [...promotions];

        // Filter by search query
        if (searchQuery) {
            filtered = filtered.filter(
                (promo) =>
                    promo.tenKhuyenMai.toLowerCase().includes(searchQuery.toLowerCase()) ||
                    promo.maKhuyenMai.toLowerCase().includes(searchQuery.toLowerCase()) ||
                    promo.moTa?.toLowerCase().includes(searchQuery.toLowerCase())
            );
        }

        // Filter by type
        if (filterType !== 'ALL') {
            filtered = filtered.filter((promo) => promo.loaiGiam === filterType);
        }

        // Sort
        filtered.sort((a, b) => {
            if (sortBy === 'discount') {
                return b.giaTriGiam - a.giaTriGiam;
            } else {
                return new Date(a.ngayKetThuc).getTime() - new Date(b.ngayKetThuc).getTime();
            }
        });

        setFilteredPromotions(filtered);
    };

    const copyToClipboard = (code: string) => {
        navigator.clipboard.writeText(code);
        setCopiedCode(code);
        setTimeout(() => setCopiedCode(null), 2000);
    };

    const formatDate = (dateString: string) => {
        return new Date(dateString).toLocaleDateString('vi-VN', {
            day: '2-digit',
            month: '2-digit',
            year: 'numeric',
        });
    };

    const formatCurrency = (amount: number) => {
        return new Intl.NumberFormat('vi-VN', {
            style: 'currency',
            currency: 'VND',
        }).format(amount);
    };

    const getDaysUntilExpiry = (endDate: string) => {
        const now = new Date();
        const end = new Date(endDate);
        const diff = Math.ceil((end.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));
        return diff;
    };

    const getGradientClass = (index: number) => {
        const gradients = [
            'from-pink-500 via-rose-500 to-red-500',
            'from-blue-500 via-indigo-500 to-purple-500',
            'from-emerald-500 via-teal-500 to-cyan-500',
            'from-amber-500 via-orange-500 to-red-500',
            'from-violet-500 via-purple-500 to-fuchsia-500',
            'from-lime-500 via-green-500 to-emerald-500',
        ];
        return gradients[index % gradients.length];
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
            {/* Hero Section */}
            <div className="bg-gradient-to-r from-pink-600 via-purple-600 to-indigo-600 text-white py-20">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="text-center">
                        <h1 className="text-5xl md:text-6xl font-bold mb-4 animate-fade-in">
                            🎁 Khuyến Mãi Đặc Biệt
                        </h1>
                        <p className="text-xl md:text-2xl text-white/90 mb-8">
                            Tận hưởng những ưu đãi tuyệt vời cho chuyến đi của bạn
                        </p>
                        <Link
                            href="/"
                            className="inline-flex items-center gap-2 px-6 py-3 bg-white text-purple-600 rounded-full font-semibold hover:bg-opacity-90 transition-all hover:scale-105"
                        >
                            ← Quay lại trang chủ
                        </Link>
                    </div>
                </div>
            </div>

            {/* Filters and Search */}
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                <div className="bg-white rounded-2xl shadow-lg p-6 mb-8">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        {/* Search */}
                        <div className="md:col-span-1">
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                🔍 Tìm kiếm
                            </label>
                            <input
                                type="text"
                                placeholder="Tìm mã hoặc tên khuyến mãi..."
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none transition-all"
                            />
                        </div>

                        {/* Filter by Type */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                🏷️ Loại giảm giá
                            </label>
                            <select
                                value={filterType}
                                onChange={(e) => setFilterType(e.target.value as any)}
                                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none transition-all"
                            >
                                <option value="ALL">Tất cả</option>
                                <option value="PERCENT">Giảm theo phần trăm</option>
                                <option value="FIXED">Giảm cố định</option>
                            </select>
                        </div>

                        {/* Sort */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                📊 Sắp xếp theo
                            </label>
                            <select
                                value={sortBy}
                                onChange={(e) => setSortBy(e.target.value as any)}
                                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none transition-all"
                            >
                                <option value="discount">Giá trị giảm</option>
                                <option value="expiry">Ngày hết hạn</option>
                            </select>
                        </div>
                    </div>
                </div>

                {/* Stats */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                    <div className="bg-gradient-to-br from-pink-500 to-rose-500 text-white rounded-xl p-6 shadow-lg">
                        <div className="text-3xl font-bold mb-2">{promotions.length}</div>
                        <div className="text-white/90">Khuyến mãi đang hoạt động</div>
                    </div>
                    <div className="bg-gradient-to-br from-blue-500 to-indigo-500 text-white rounded-xl p-6 shadow-lg">
                        <div className="text-3xl font-bold mb-2">
                            {promotions.filter((p) => p.loaiGiam === 'PERCENT').length}
                        </div>
                        <div className="text-white/90">Giảm theo phần trăm</div>
                    </div>
                    <div className="bg-gradient-to-br from-purple-500 to-fuchsia-500 text-white rounded-xl p-6 shadow-lg">
                        <div className="text-3xl font-bold mb-2">
                            {promotions.filter((p) => p.loaiGiam === 'FIXED').length}
                        </div>
                        <div className="text-white/90">Giảm giá cố định</div>
                    </div>
                </div>

                {/* Promotions Grid */}
                {loading ? (
                    <div className="text-center py-20">
                        <div className="inline-block animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-purple-600"></div>
                        <p className="mt-4 text-gray-600 text-lg">Đang tải khuyến mãi...</p>
                    </div>
                ) : filteredPromotions.length === 0 ? (
                    <div className="text-center py-20">
                        <div className="text-6xl mb-4">😕</div>
                        <p className="text-xl text-gray-600">Không tìm thấy khuyến mãi phù hợp</p>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {filteredPromotions.map((promo, index) => {
                            const daysLeft = getDaysUntilExpiry(promo.ngayKetThuc);
                            const usagePercent = Math.round((promo.soLuotDaSuDung / promo.soLuotSuDung) * 100);

                            return (
                                <div
                                    key={promo.id}
                                    className="group bg-white rounded-2xl shadow-lg overflow-hidden hover:shadow-2xl transition-all duration-300 hover:-translate-y-2"
                                >
                                    {/* Gradient Header */}
                                    <div className={`bg-gradient-to-r ${getGradientClass(index)} p-6 text-white relative overflow-hidden`}>
                                        <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -mr-16 -mt-16"></div>
                                        <div className="absolute bottom-0 left-0 w-24 h-24 bg-white/10 rounded-full -ml-12 -mb-12"></div>

                                        <div className="relative z-10">
                                            <div className="flex items-start justify-between mb-3">
                                                <div className="flex-1">
                                                    <div className="text-sm font-medium text-white/80 mb-1">
                                                        {promo.loaiGiam === 'PERCENT' ? '📊 Giảm phần trăm' : '💰 Giảm cố định'}
                                                    </div>
                                                    <div className="text-3xl font-bold">
                                                        {promo.loaiGiam === 'PERCENT'
                                                            ? `${promo.giaTriGiam}%`
                                                            : formatCurrency(promo.giaTriGiam)}
                                                    </div>
                                                </div>
                                                {daysLeft <= 7 && (
                                                    <div className="bg-yellow-400 text-yellow-900 text-xs font-bold px-3 py-1 rounded-full">
                                                        ⏰ {daysLeft} ngày
                                                    </div>
                                                )}
                                            </div>

                                            {promo.loaiGiam === 'PERCENT' && promo.giamToiDa && (
                                                <div className="text-sm text-white/90">
                                                    Tối đa: {formatCurrency(promo.giamToiDa)}
                                                </div>
                                            )}
                                        </div>
                                    </div>

                                    {/* Content */}
                                    <div className="p-6">
                                        <h3 className="text-xl font-bold text-gray-900 mb-2 group-hover:text-purple-600 transition-colors">
                                            {promo.tenKhuyenMai}
                                        </h3>

                                        <p className="text-gray-600 text-sm mb-4 line-clamp-2">
                                            {promo.moTa || 'Áp dụng cho các đơn hàng đủ điều kiện'}
                                        </p>

                                        {/* Promo Code */}
                                        <div className="mb-4">
                                            <div className="flex items-center gap-2 bg-gradient-to-r from-purple-50 to-pink-50 rounded-lg p-3 border-2 border-dashed border-purple-300">
                                                <span className="text-xs text-gray-600 font-medium">MÃ:</span>
                                                <code className="flex-1 text-lg font-bold text-purple-600">
                                                    {promo.maKhuyenMai}
                                                </code>
                                                <button
                                                    onClick={() => copyToClipboard(promo.maKhuyenMai)}
                                                    className="px-3 py-1 bg-purple-600 text-white text-sm rounded-lg hover:bg-purple-700 transition-colors"
                                                >
                                                    {copiedCode === promo.maKhuyenMai ? '✓ Đã sao' : '📋 Sao'}
                                                </button>
                                            </div>
                                        </div>

                                        {/* Details */}
                                        <div className="space-y-2 mb-4">
                                            <div className="flex items-center justify-between text-sm">
                                                <span className="text-gray-600">Đơn tối thiểu:</span>
                                                <span className="font-semibold text-gray-900">
                                                    {formatCurrency(promo.giaTriDonToiThieu)}
                                                </span>
                                            </div>
                                            <div className="flex items-center justify-between text-sm">
                                                <span className="text-gray-600">Hiệu lực:</span>
                                                <span className="font-semibold text-gray-900">
                                                    {formatDate(promo.ngayBatDau)} - {formatDate(promo.ngayKetThuc)}
                                                </span>
                                            </div>
                                        </div>

                                        {/* Usage Progress */}
                                        <div className="mb-4">
                                            <div className="flex items-center justify-between text-xs text-gray-600 mb-1">
                                                <span>Đã sử dụng: {promo.soLuotDaSuDung}/{promo.soLuotSuDung}</span>
                                                <span>{usagePercent}%</span>
                                            </div>
                                            <div className="w-full bg-gray-200 rounded-full h-2 overflow-hidden">
                                                <div
                                                    className="bg-gradient-to-r from-purple-500 to-pink-500 h-2 rounded-full transition-all duration-500"
                                                    style={{ width: `${usagePercent}%` }}
                                                ></div>
                                            </div>
                                        </div>

                                        {/* Action Button */}
                                        <Link
                                            href="/"
                                            className="block w-full text-center px-4 py-3 bg-gradient-to-r from-purple-600 to-pink-600 text-white font-semibold rounded-lg hover:from-purple-700 hover:to-pink-700 transition-all transform hover:scale-105"
                                        >
                                            Đặt vé ngay 🎫
                                        </Link>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                )}
            </div>

            {/* Floating Toast for Copy */}
            {copiedCode && (
                <div className="fixed bottom-8 right-8 bg-gradient-to-r from-green-500 to-emerald-500 text-white px-6 py-4 rounded-lg shadow-2xl animate-bounce">
                    <div className="flex items-center gap-3">
                        <span className="text-2xl">✓</span>
                        <div>
                            <div className="font-bold">Đã sao chép!</div>
                            <div className="text-sm text-white/90">Mã: {copiedCode}</div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
