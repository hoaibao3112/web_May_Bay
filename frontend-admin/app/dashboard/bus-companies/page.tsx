'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { FiSearch, FiPlus, FiEdit2, FiTrash2, FiTruck, FiMapPin, FiStar } from 'react-icons/fi';

interface BusCompany {
    id: number;
    maNhaXe: string;
    tenNhaXe: string;
    logo: string | null;
    soDienThoai: string | null;
    email: string | null;
    diaChi: string | null;
    danhGiaTrungBinh: number;
    trangThai: string;
    _count: {
        xe: number;
        tuyenXe: number;
    };
}

export default function BusCompaniesPage() {
    const router = useRouter();
    const [companies, setCompanies] = useState<BusCompany[]>([]);
    const [loading, setLoading] = useState(true);
    const [search, setSearch] = useState('');

    useEffect(() => {
        fetchCompanies();
    }, [search]);

    const fetchCompanies = async () => {
        try {
            setLoading(true);
            const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';
            const token = localStorage.getItem('adminToken');

            const url = search
                ? `${API_URL}/admin/bus-companies?search=${encodeURIComponent(search)}`
                : `${API_URL}/admin/bus-companies`;

            const response = await fetch(url, {
                headers: {
                    'Authorization': `Bearer ${token}`,
                },
            });

            if (!response.ok) {
                throw new Error('Failed to fetch companies');
            }

            const data = await response.json();
            setCompanies(data);
        } catch (error) {
            console.error('Error fetching companies:', error);
            alert('Không thể tải danh sách nhà xe');
        } finally {
            setLoading(false);
        }
    };

    const getStatusBadge = (status: string) => {
        const config: any = {
            HOAT_DONG: { label: 'Hoạt động', class: 'bg-green-500/10 text-green-400' },
            TAM_NGUNG: { label: 'Tạm ngừng', class: 'bg-yellow-500/10 text-yellow-400' },
            NGUNG_HOAT_DONG: { label: 'Ngừng hoạt động', class: 'bg-red-500/10 text-red-400' },
        };
        const item = config[status] || { label: status, class: 'bg-slate-500/10 text-slate-400' };
        return (
            <span className={`px-2 py-1 rounded text-xs font-medium ${item.class}`}>
                {item.label}
            </span>
        );
    };

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
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-bold text-white">Quản lý nhà xe</h1>
                    <p className="text-slate-400 mt-1">Danh sách các nhà xe đối tác</p>
                </div>
                <button
                    onClick={() => router.push('/dashboard/bus-companies/new')}
                    className="px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-lg transition-colors flex items-center gap-2"
                >
                    <FiPlus /> Thêm nhà xe
                </button>
            </div>

            {/* Search */}
            <div className="bg-slate-900 border border-slate-800 rounded-xl p-4">
                <div className="relative">
                    <FiSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400" />
                    <input
                        type="text"
                        placeholder="Tìm kiếm theo tên, số điện thoại, email..."
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        className="w-full pl-10 pr-4 py-2 bg-slate-800 border border-slate-700 rounded-lg text-white placeholder-slate-500 focus:outline-none focus:border-blue-500"
                    />
                </div>
            </div>

            {/* Companies Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {companies.map((company) => (
                    <div
                        key={company.id}
                        className="bg-slate-900 border border-slate-800 rounded-xl p-6 hover:border-blue-500 transition-colors cursor-pointer"
                        onClick={() => router.push(`/dashboard/bus-companies/${company.id}`)}
                    >
                        {/* Logo & Name */}
                        <div className="flex items-start gap-4 mb-4">
                            {company.logo ? (
                                <img
                                    src={company.logo}
                                    alt={company.tenNhaXe}
                                    className="w-16 h-16 rounded-lg object-cover"
                                />
                            ) : (
                                <div className="w-16 h-16 bg-slate-800 rounded-lg flex items-center justify-center">
                                    <FiTruck className="w-8 h-8 text-slate-600" />
                                </div>
                            )}
                            <div className="flex-1">
                                <h3 className="text-lg font-semibold text-white mb-1">{company.tenNhaXe}</h3>
                                <p className="text-sm text-slate-400">{company.maNhaXe}</p>
                            </div>
                            {getStatusBadge(company.trangThai)}
                        </div>

                        {/* Contact Info */}
                        <div className="space-y-2 mb-4">
                            {company.soDienThoai && (
                                <div className="text-sm text-slate-400">📞 {company.soDienThoai}</div>
                            )}
                            {company.email && (
                                <div className="text-sm text-slate-400">✉️ {company.email}</div>
                            )}
                            {company.diaChi && (
                                <div className="text-sm text-slate-400 flex items-start gap-1">
                                    <FiMapPin className="w-4 h-4 mt-0.5 flex-shrink-0" />
                                    <span className="line-clamp-1">{company.diaChi}</span>
                                </div>
                            )}
                        </div>

                        {/* Stats */}
                        <div className="grid grid-cols-3 gap-4 pt-4 border-t border-slate-800">
                            <div>
                                <div className="text-2xl font-bold text-white">{company._count.xe}</div>
                                <div className="text-xs text-slate-400">Xe</div>
                            </div>
                            <div>
                                <div className="text-2xl font-bold text-white">{company._count.tuyenXe}</div>
                                <div className="text-xs text-slate-400">Tuyến</div>
                            </div>
                            <div>
                                <div className="flex items-center gap-1">
                                    <FiStar className="w-4 h-4 text-yellow-400 fill-yellow-400" />
                                    <span className="text-lg font-bold text-white">
                                        {Number(company.danhGiaTrungBinh).toFixed(1)}
                                    </span>
                                </div>
                                <div className="text-xs text-slate-400">Đánh giá</div>
                            </div>
                        </div>

                        {/* Actions */}
                        <div className="flex gap-2 mt-4 pt-4 border-t border-slate-800">
                            <button
                                onClick={(e) => {
                                    e.stopPropagation();
                                    router.push(`/dashboard/bus-companies/${company.id}/edit`);
                                }}
                                className="flex-1 px-3 py-2 bg-blue-500/10 hover:bg-blue-500/20 text-blue-400 rounded-lg transition-colors flex items-center justify-center gap-2"
                            >
                                <FiEdit2 className="w-4 h-4" /> Sửa
                            </button>
                            <button
                                onClick={(e) => {
                                    e.stopPropagation();
                                    if (confirm(`Xóa nhà xe ${company.tenNhaXe}?`)) {
                                        // Delete logic here
                                    }
                                }}
                                className="flex-1 px-3 py-2 bg-red-500/10 hover:bg-red-500/20 text-red-400 rounded-lg transition-colors flex items-center justify-center gap-2"
                            >
                                <FiTrash2 className="w-4 h-4" /> Xóa
                            </button>
                        </div>
                    </div>
                ))}
            </div>

            {/* Empty State */}
            {companies.length === 0 && (
                <div className="text-center py-12">
                    <FiTruck className="w-16 h-16 text-slate-600 mx-auto mb-4" />
                    <p className="text-slate-400">
                        {search ? 'Không tìm thấy nhà xe nào' : 'Chưa có nhà xe nào'}
                    </p>
                </div>
            )}
        </div>
    );
}
