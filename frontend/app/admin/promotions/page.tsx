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
    giamToiDa: number | null;
    giaTriDonToiThieu: number;
    soLuotSuDung: number;
    soLuotDaSuDung: number;
    ngayBatDau: string;
    ngayKetThuc: string;
    isActive: boolean;
    createdAt: string;
}

export default function AdminPromotionsPage() {
    const [promotions, setPromotions] = useState<Promotion[]>([]);
    const [loading, setLoading] = useState(true);
    const [filter, setFilter] = useState<'all' | 'active' | 'inactive'>('all');
    const [search, setSearch] = useState('');

    useEffect(() => {
        fetchPromotions();
    }, [filter, search]);

    const fetchPromotions = async () => {
        try {
            let url = 'http://localhost:5000/promotions';
            const params = new URLSearchParams();

            if (filter === 'active') params.append('isActive', 'true');
            if (filter === 'inactive') params.append('isActive', 'false');
            if (search) params.append('search', search);

            if (params.toString()) url += `?${params.toString()}`;

            const res = await fetch(url);
            const data = await res.json();
            setPromotions(data);
        } catch (error) {
            console.error('Error fetching promotions:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async (id: number) => {
        if (!confirm('Bạn có chắc muốn xóa mã khuyến mãi này?')) return;

        try {
            await fetch(`http://localhost:5000/promotions/${id}`, {
                method: 'DELETE',
            });
            fetchPromotions();
        } catch (error) {
            console.error('Error deleting promotion:', error);
            alert('Lỗi khi xóa khuyến mãi');
        }
    };

    const formatCurrency = (amount: number) => {
        return new Intl.NumberFormat('vi-VN', {
            style: 'currency',
            currency: 'VND',
        }).format(amount);
    };

    const formatDate = (dateString: string) => {
        return new Date(dateString).toLocaleDateString('vi-VN');
    };

    const getStatusBadge = (promo: Promotion) => {
        const now = new Date();
        const start = new Date(promo.ngayBatDau);
        const end = new Date(promo.ngayKetThuc);

        if (!promo.isActive) {
            return <span className="px-2 py-1 text-xs rounded bg-gray-200 text-gray-700">Tắt</span>;
        }
        if (now < start) {
            return <span className="px-2 py-1 text-xs rounded bg-blue-100 text-blue-700">Sắp diễn ra</span>;
        }
        if (now > end) {
            return <span className="px-2 py-1 text-xs rounded bg-red-100 text-red-700">Hết hạn</span>;
        }
        return <span className="px-2 py-1 text-xs rounded bg-green-100 text-green-700">Đang hoạt động</span>;
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-screen">
                <div className="animate-spin h-12 w-12 border-4 border-orange-500 border-t-transparent rounded-full"></div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50 p-8">
            <div className="max-w-7xl mx-auto">
                {/* Header */}
                <div className="flex justify-between items-center mb-8">
                    <div>
                        <h1 className="text-3xl font-bold text-gray-900">Quản Lý Khuyến Mãi</h1>
                        <p className="text-gray-600 mt-1">Quản lý mã giảm giá và chương trình khuyến mãi</p>
                    </div>
                    <Link
                        href="/admin/promotions/create"
                        className="px-6 py-3 bg-orange-500 text-white rounded-lg font-semibold hover:bg-orange-600 transition"
                    >
                        + Tạo Mã Mới
                    </Link>
                </div>

                {/* Filters */}
                <div className="bg-white rounded-lg shadow p-6 mb-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {/* Search */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">Tìm kiếm</label>
                            <input
                                type="text"
                                placeholder="Tìm theo mã hoặc tên..."
                                value={search}
                                onChange={(e) => setSearch(e.target.value)}
                                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                            />
                        </div>

                        {/* Filter Status */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">Trạng thái</label>
                            <select
                                value={filter}
                                onChange={(e) => setFilter(e.target.value as any)}
                                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                            >
                                <option value="all">Tất cả</option>
                                <option value="active">Đang hoạt động</option>
                                <option value="inactive">Không hoạt động</option>
                            </select>
                        </div>
                    </div>
                </div>

                {/* Table */}
                <div className="bg-white rounded-lg shadow overflow-hidden">
                    <div className="overflow-x-auto">
                        <table className="w-full">
                            <thead className="bg-gray-50 border-b">
                                <tr>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Mã</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Tên</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Loại</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Giá trị</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Sử dụng</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Thời gian</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Trạng thái</th>
                                    <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">Hành động</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-200">
                                {promotions.map((promo) => (
                                    <tr key={promo.id} className="hover:bg-gray-50">
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <span className="font-mono font-semibold text-orange-600">{promo.maKhuyenMai}</span>
                                        </td>
                                        <td className="px-6 py-4">
                                            <div className="text-sm font-medium text-gray-900">{promo.tenKhuyenMai}</div>
                                            <div className="text-sm text-gray-500">{promo.moTa}</div>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            {promo.loaiGiam === 'PERCENT' ? (
                                                <span className="text-blue-600">Phần trăm</span>
                                            ) : (
                                                <span className="text-green-600">Cố định</span>
                                            )}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            {promo.loaiGiam === 'PERCENT' ? (
                                                <div>
                                                    <div className="font-semibold">{promo.giaTriGiam}%</div>
                                                    {promo.giamToiDa && (
                                                        <div className="text-xs text-gray-500">Max: {formatCurrency(promo.giamToiDa)}</div>
                                                    )}
                                                </div>
                                            ) : (
                                                <div className="font-semibold">{formatCurrency(promo.giaTriGiam)}</div>
                                            )}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <div className="text-sm">
                                                <span className="font-semibold">{promo.soLuotDaSuDung}</span>
                                                <span className="text-gray-500">/{promo.soLuotSuDung}</span>
                                            </div>
                                            <div className="w-full bg-gray-200 rounded-full h-1.5 mt-1">
                                                <div
                                                    className="bg-orange-500 h-1.5 rounded-full"
                                                    style={{ width: `${(promo.soLuotDaSuDung / promo.soLuotSuDung) * 100}%` }}
                                                ></div>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm">
                                            <div>{formatDate(promo.ngayBatDau)}</div>
                                            <div className="text-gray-500">→ {formatDate(promo.ngayKetThuc)}</div>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            {getStatusBadge(promo)}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                            <Link
                                                href={`/admin/promotions/edit/${promo.id}`}
                                                className="text-orange-600 hover:text-orange-900 mr-4"
                                            >
                                                Sửa
                                            </Link>
                                            <button
                                                onClick={() => handleDelete(promo.id)}
                                                className="text-red-600 hover:text-red-900"
                                            >
                                                Xóa
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>

                        {promotions.length === 0 && (
                            <div className="text-center py-12">
                                <p className="text-gray-500">Không tìm thấy khuyến mãi nào</p>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}
