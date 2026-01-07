'use client';

import { useEffect, useState } from 'react';
import { FiSearch, FiEdit2, FiTrash2, FiPlus } from 'react-icons/fi';

export default function AirlinesPage() {
    const [airlines, setAirlines] = useState<any[]>([]);
    const [loading, setLoading] = useState(false);
    const [searchTerm, setSearchTerm] = useState('');

    useEffect(() => {
        // Mock data
        setAirlines([
            { id: 1, maIata: 'VN', tenHang: 'Vietnam Airlines', logo: null, createdAt: '2025-01-01' },
            { id: 2, maIata: 'VJ', tenHang: 'VietJet Air', logo: null, createdAt: '2025-01-01' },
            { id: 3, maIata: 'QH', tenHang: 'Bamboo Airways', logo: null, createdAt: '2025-01-01' },
            { id: 4, maIata: 'BL', tenHang: 'Pacific Airlines', logo: null, createdAt: '2025-01-01' },
        ]);
    }, []);

    const filteredAirlines = airlines.filter(airline =>
        airline.tenHang.toLowerCase().includes(searchTerm.toLowerCase()) ||
        airline.maIata.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-bold text-white mb-2">Quản lý hãng hàng không</h1>
                    <p className="text-slate-400">Tổng số: {airlines.length} hãng</p>
                </div>
                <button className="px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-lg flex items-center gap-2 transition-colors">
                    <FiPlus />
                    Thêm hãng hàng không
                </button>
            </div>

            {/* Search */}
            <div className="bg-slate-900 border border-slate-800 rounded-xl p-6">
                <div className="relative">
                    <FiSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                    <input
                        type="text"
                        placeholder="Tìm kiếm theo tên hoặc mã IATA..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="w-full pl-10 pr-4 py-2 bg-slate-800 border border-slate-700 rounded-lg text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                </div>
            </div>

            {/* Airlines Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {filteredAirlines.map((airline) => (
                    <div
                        key={airline.id}
                        className="bg-slate-900 border border-slate-800 rounded-xl p-6 hover:border-slate-700 transition-all hover:shadow-xl hover:shadow-slate-900/50"
                    >
                        <div className="flex items-start justify-between mb-4">
                            <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-blue-600 rounded-lg flex items-center justify-center text-2xl font-bold text-white">
                                {airline.maIata}
                            </div>
                            <div className="flex gap-2">
                                <button className="p-2 text-blue-400 hover:bg-blue-500/10 rounded-lg transition-colors">
                                    <FiEdit2 className="w-4 h-4" />
                                </button>
                                <button className="p-2 text-red-400 hover:bg-red-500/10 rounded-lg transition-colors">
                                    <FiTrash2 className="w-4 h-4" />
                                </button>
                            </div>
                        </div>
                        <h3 className="text-lg font-semibold text-white mb-2">{airline.tenHang}</h3>
                        <p className="text-sm text-slate-400">Mã IATA: {airline.maIata}</p>
                    </div>
                ))}
            </div>
        </div>
    );
}
