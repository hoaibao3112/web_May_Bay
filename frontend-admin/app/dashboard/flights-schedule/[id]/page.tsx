'use client';

import { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import Link from 'next/link';
import { FiArrowLeft, FiSend, FiUser, FiMail, FiPhone, FiMapPin } from 'react-icons/fi';

interface Passenger {
    id: number;
    loai: string;
    ho: string;
    ten: string;
    gioiTinh: string;
    ngaySinh: string;
    soCccd: string | null;
    soHoChieu: string | null;
    quocTich: string | null;
    soGhe: string | null;
    daCheckin: boolean;
    donDatVe: {
        maDatVe: string;
        tongTien: number;
        nguoiDung: {
            hoTen: string;
            email: string;
            soDienThoai: string | null;
        };
    };
}

export default function FlightPassengersPage() {
    const router = useRouter();
    const params = useParams();
    const id = params.id as string;

    const [data, setData] = useState<any>(null);
    const [loading, setLoading] = useState(true);
    const [search, setSearch] = useState('');

    useEffect(() => {
        fetchPassengers();
    }, []);

    const fetchPassengers = async () => {
        try {
            const res = await fetch(`http://localhost:5000/admin/flights-schedule/${id}/passengers`);
            const result = await res.json();
            setData(result);
        } catch (error) {
            console.error('Error:', error);
        } finally {
            setLoading(false);
        }
    };

    const filteredPassengers = data?.passengers?.filter((p: Passenger) =>
        search === '' ||
        `${p.ho} ${p.ten}`.toLowerCase().includes(search.toLowerCase()) ||
        p.donDatVe.maDatVe.toLowerCase().includes(search.toLowerCase())
    ) || [];

    const formatCurrency = (amount: number) => {
        return new Intl.NumberFormat('vi-VN', {
            style: 'currency',
            currency: 'VND',
        }).format(amount);
    };

    const getPassengerTypeBadge = (type: string) => {
        const config: any = {
            NGUOI_LON: { label: 'Người lớn', class: 'bg-blue-500/10 text-blue-400' },
            TRE_EM: { label: 'Trẻ em', class: 'bg-green-500/10 text-green-400' },
            SO_SINH: { label: 'Sơ sinh', class: 'bg-purple-500/10 text-purple-400' },
        };
        const c = config[type] || { label: type, class: 'bg-slate-500/10 text-slate-400' };
        return <span className={`px-2 py-1 rounded-full text-xs font-medium ${c.class}`}>{c.label}</span>;
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-screen">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
            </div>
        );
    }

    if (!data) {
        return <div className="text-white">Không tìm thấy chuyến bay</div>;
    }

    const flight = data.flight;

    return (
        <div className="space-y-6">
            {/* Header */}
            <div>
                <Link href="/dashboard/flights-schedule" className="inline-flex items-center gap-2 text-blue-400 hover:text-blue-300 mb-4">
                    <FiArrowLeft /> Quay lại danh sách chuyến bay
                </Link>
                <h1 className="text-3xl font-bold text-white mb-2">Danh Sách Hành Khách</h1>
                <p className="text-slate-400">Tổng số: {data.totalPassengers} hành khách</p>
            </div>

            {/* Flight Info */}
            <div className="bg-slate-900 border border-slate-800 rounded-xl p-6">
                <div className="flex items-center justify-between">
                    <div>
                        <div className="text-2xl font-bold text-blue-400 mb-2">
                            {flight.chuyenBay.soHieuChuyenBay}
                        </div>
                        <div className="text-lg text-white">
                            {flight.sanBayDi.maIata} → {flight.sanBayDen.maIata}
                        </div>
                        <div className="text-sm text-slate-400 mt-1">
                            {new Date(flight.gioDi).toLocaleString('vi-VN')} - {flight.chuyenBay.hang.tenHang}
                        </div>
                    </div>
                    <div className="text-right">
                        <div className="text-3xl font-bold text-white">{data.totalPassengers}</div>
                        <div className="text-sm text-slate-400">Hành khách</div>
                    </div>
                </div>
            </div>

            {/* Search */}
            <div className="bg-slate-900 border border-slate-800 rounded-xl p-4">
                <input
                    type="text"
                    placeholder="Tìm theo tên hành khách hoặc mã đặt vé..."
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    className="w-full px-4 py-2 bg-slate-800 border border-slate-700 rounded-lg text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
            </div>

            {/* Passengers Table */}
            <div className="bg-slate-900 border border-slate-800 rounded-xl overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full">
                        <thead className="bg-slate-800">
                            <tr>
                                <th className="px-6 py-4 text-left text-xs font-medium text-slate-400 uppercase">Hành khách</th>
                                <th className="px-6 py-4 text-left text-xs font-medium text-slate-400 uppercase">Loại</th>
                                <th className="px-6 py-4 text-left text-xs font-medium text-slate-400 uppercase">Mã đặt vé</th>
                                <th className="px-6 py-4 text-left text-xs font-medium text-slate-400 uppercase">Người đặt</th>
                                <th className="px-6 py-4 text-left text-xs font-medium text-slate-400 uppercase">Ghế</th>
                                <th className="px-6 py-4 text-left text-xs font-medium text-slate-400 uppercase">Check-in</th>
                                <th className="px-6 py-4 text-left text-xs font-medium text-slate-400 uppercase">Hành động</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-800">
                            {filteredPassengers.map((passenger: Passenger) => (
                                <tr key={passenger.id} className="hover:bg-slate-800/50 transition-colors">
                                    <td className="px-6 py-4">
                                        <div className="text-sm font-medium text-white">
                                            {passenger.ho} {passenger.ten}
                                        </div>
                                        <div className="text-xs text-slate-400">
                                            {passenger.gioiTinh === 'NAM' ? 'Nam' : 'Nữ'} - {new Date(passenger.ngaySinh).toLocaleDateString('vi-VN')}
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        {getPassengerTypeBadge(passenger.loai)}
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <div className="font-mono text-sm text-slate-300">{passenger.donDatVe.maDatVe}</div>
                                        <div className="text-xs text-slate-500">{formatCurrency(passenger.donDatVe.tongTien)}</div>
                                    </td>
                                    <td className="px-6 py-4">
                                        <div className="text-sm text-white">{passenger.donDatVe.nguoiDung.hoTen}</div>
                                        <div className="text-xs text-slate-400">{passenger.donDatVe.nguoiDung.email}</div>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <div className="text-sm text-white">{passenger.soGhe || '-'}</div>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        {passenger.daCheckin ? (
                                            <span className="px-2 py-1 rounded-full text-xs font-medium bg-green-500/10 text-green-400">
                                                ✓ Đã check-in
                                            </span>
                                        ) : (
                                            <span className="px-2 py-1 rounded-full text-xs font-medium bg-slate-500/10 text-slate-400">
                                                Chưa
                                            </span>
                                        )}
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <button
                                            onClick={() => router.push(`/dashboard/passengers/${passenger.id}`)}
                                            className="text-blue-400 hover:text-blue-300 text-sm font-medium"
                                        >
                                            Xem chi tiết
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>

                    {filteredPassengers.length === 0 && (
                        <div className="text-center py-12">
                            <p className="text-slate-500">Không tìm thấy hành khách nào</p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
