'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { FiTag, FiPercent, FiDollarSign, FiUsers, FiPlus, FiSearch, FiFilter, FiEdit2, FiTrash2 } from 'react-icons/fi';

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
            return <span className="px-2 py-1 rounded-full text-xs font-medium bg-slate-500/10 text-slate-400">Tắt</span>;
        }
        if (now < start) {
            return <span className="px-2 py-1 rounded-full text-xs font-medium bg-blue-500/10 text-blue-400">Sắp diễn ra</span>;
        }
        if (now > end) {
            return <span className="px-2 py-1 rounded-full text-xs font-medium bg-red-500/10 text-red-400">Hết hạn</span>;
        }
        return <span className="px-2 py-1 rounded-full text-xs font-medium bg-green-500/10 text-green-400">Đang hoạt động</span>;
    };

    // Calculate total stats
    const totalActive = promotions.filter(p => {
        const now = new Date();
        return p.isActive && now >= new Date(p.ngayBatDau) && now <= new Date(p.ngayKetThuc);
    }).length;

    const totalUsage = promotions.reduce((sum, p) => sum + p.soLuotDaSuDung, 0);

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-screen">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
            </div>
        );
    }

    return (
        <div className="space-y-6">
            {/* Header */}
            <div>
                <h1 className="text-3xl font-bold text-white mb-2">Quản Lý Khuyến Mãi</h1>
                <p className="text-slate-400">Quản lý mã giảm giá và chương trình khuyến mãi</p>
            </div>

            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                <div className="bg-slate-900 border border-slate-800 rounded-xl p-6 hover:border-slate-700 transition-all duration-200">
                    <div className="flex items-center justify-between mb-4">
                        <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-blue-600 rounded-lg flex items-center justify-center">
                            <FiTag className="w-6 h-6 text-white" />
                        </div>
                    </div>
                    <div className="text-2xl font-bold text-white mb-1">{promotions.length}</div>
                    <div className="text-sm text-slate-400">Tổng mã</div>
                </div>

                <div className="bg-slate-900 border border-slate-800 rounded-xl p-6 hover:border-slate-700 transition-all duration-200">
                    <div className="flex items-center justify-between mb-4">
                        <div className="w-12 h-12 bg-gradient-to-br from-green-500 to-green-600 rounded-lg flex items-center justify-center">
                            <FiPercent className="w-6 h-6 text-white" />
                        </div>
                    </div>
                    <div className="text-2xl font-bold text-white mb-1">{totalActive}</div>
                    <div className="text-sm text-slate-400">Đang hoạt động</div>
                </div>

                <div className="bg-slate-900 border border-slate-800 rounded-xl p-6 hover:border-slate-700 transition-all duration-200">
                    <div className="flex items-center justify-between mb-4">
                        <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-purple-600 rounded-lg flex items-center justify-center">
                            <FiUsers className="w-6 h-6 text-white" />
                        </div>
                    </div>
                    <div className="text-2xl font-bold text-white mb-1">{totalUsage}</div>
                    <div className="text-sm text-slate-400">Lượt sử dụng</div>
                </div>

                <Link href="/dashboard/promotions/create" className="bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl p-6 hover:from-blue-600 hover:to-blue-700 transition-all duration-200 shadow-lg shadow-blue-500/30 flex items-center justify-center gap-2 text-white font-semibold">
                    <FiPlus className="w-5 h-5" />
                    <span>Tạo Mã Mới</span>
                </Link>
            </div>

            {/* Filters */}
            <div className="bg-slate-900 border border-slate-800 rounded-xl p-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {/* Search */}
                    <div className="relative">
                        <FiSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                        <input
                            type="text"
                            placeholder="Tìm theo mã hoặc tên..."
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                            className="w-full pl-10 pr-4 py-2 bg-slate-800 border border-slate-700 rounded-lg text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                    </div>

                    {/* Filter */}
                    <div className="relative">
                        <FiFilter className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                        <select
                            value={filter}
                            onChange={(e) => setFilter(e.target.value as any)}
                            className="w-full pl-10 pr-4 py-2 bg-slate-800 border border-slate-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                        >
                            <option value="all">Tất cả</option>
                            <option value="active">Đang hoạt động</option>
                            <option value="inactive">Không hoạt động</option>
                        </select>
                    </div>
                </div>
            </div>

            {/* Table */}
            <div className="bg-slate-900 border border-slate-800 rounded-xl overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full">
                        <thead className="bg-slate-800">
                            <tr>
                                <th className="px-6 py-4 text-left text-xs font-medium text-slate-400 uppercase">Mã</th>
                                <th className="px-6 py-4 text-left text-xs font-medium text-slate-400 uppercase">Tên</th>
                                <th className="px-6 py-4 text-left text-xs font-medium text-slate-400 uppercase">Loại</th>
                                <th className="px-6 py-4 text-left text-xs font-medium text-slate-400 uppercase">Giá trị</th>
                                <th className="px-6 py-4 text-left text-xs font-medium text-slate-400 uppercase">Sử dụng</th>
                                <th className="px-6 py-4 text-left text-xs font-medium text-slate-400 uppercase">Thời gian</th>
                                <th className="px-6 py-4 text-left text-xs font-medium text-slate-400 uppercase">Trạng thái</th>
                                <th className="px-6 py-4 text-right text-xs font-medium text-slate-400 uppercase">Hành động</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-800">
                            {promotions.map((promo) => (
                                <tr key={promo.id} className="hover:bg-slate-800/50 transition-colors">
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <span className="font-mono font-semibold text-blue-400">{promo.maKhuyenMai}</span>
                                    </td>
                                    <td className="px-6 py-4">
                                        <div className="text-sm font-medium text-white">{promo.tenKhuyenMai}</div>
                                        <div className="text-sm text-slate-400 truncate max-w-xs">{promo.moTa}</div>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        {promo.loaiGiam === 'PERCENT' ? (
                                            <span className="text-blue-400">Phần trăm</span>
                                        ) : (
                                            <span className="text-green-400">Cố định</span>
                                        )}
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        {promo.loaiGiam === 'PERCENT' ? (
                                            <div>
                                                <div className="font-semibold text-white">{promo.giaTriGiam}%</div>
                                                {promo.giamToiDa && (
                                                    <div className="text-xs text-slate-400">Max: {formatCurrency(promo.giamToiDa)}</div>
                                                )}
                                            </div>
                                        ) : (
                                            <div className="font-semibold text-white">{formatCurrency(promo.giaTriGiam)}</div>
                                        )}
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <div className="text-sm text-white">
                                            <span className="font-semibold">{promo.soLuotDaSuDung}</span>
                                            <span className="text-slate-400">/{promo.soLuotSuDung}</span>
                                        </div>
                                        <div className="w-full bg-slate-700 rounded-full h-1.5 mt-1">
                                            <div
                                                className="bg-blue-500 h-1.5 rounded-full transition-all"
                                                style={{ width: `${(promo.soLuotDaSuDung / promo.soLuotSuDung) * 100}%` }}
                                            ></div>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm">
                                        <div className="text-white">{formatDate(promo.ngayBatDau)}</div>
                                        <div className="text-slate-400">→ {formatDate(promo.ngayKetThuc)}</div>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        {getStatusBadge(promo)}
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-right">
                                        <div className="flex items-center justify-end gap-2">
                                            <Link
                                                href={`/dashboard/promotions/edit/${promo.id}`}
                                                className="p-2 text-blue-400 hover:bg-blue-500/10 rounded-lg transition-colors"
                                            >
                                                <FiEdit2 className="w-4 h-4" />
                                            </Link>
                                            <button
                                                onClick={() => handleDelete(promo.id)}
                                                className="p-2 text-red-400 hover:bg-red-500/10 rounded-lg transition-colors"
                                            >
                                                <FiTrash2 className="w-4 h-4" />
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>

                    {promotions.length === 0 && (
                        <div className="text-center py-12">
                            <p className="text-slate-500">Không tìm thấy khuyến mãi nào</p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
