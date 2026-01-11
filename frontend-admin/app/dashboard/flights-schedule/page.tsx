'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { FiSend, FiSearch, FiCalendar, FiUsers, FiClock } from 'react-icons/fi';

interface FlightSchedule {
    id: number;
    chuyenBay: {
        soHieuChuyenBay: string;
        hang: {
            tenHang: string;
            logo: string | null;
        };
    };
    sanBayDi: {
        maIata: string;
        tenSanBay: string;
    };
    sanBayDen: {
        maIata: string;
        tenSanBay: string;
    };
    gioDi: string;
    gioDen: string;
    thoiGianBayPhut: number;
    soLuongDat: number;
    soLuongHanhKhach: number;
}

export default function FlightsSchedulePage() {
    const router = useRouter();
    const [flights, setFlights] = useState<FlightSchedule[]>([]);
    const [loading, setLoading] = useState(true);
    const [search, setSearch] = useState('');
    const [startDate, setStartDate] = useState('');
    const [endDate, setEndDate] = useState('');

    useEffect(() => {
        fetchFlights();
    }, [startDate, endDate]);

    const fetchFlights = async () => {
        try {
            setLoading(true);
            let url = 'http://localhost:5000/admin/flights-schedule?';
            if (startDate) url += `startDate=${startDate}&`;
            if (endDate) url += `endDate=${endDate}&`;
            if (search) url += `search=${search}`;

            const res = await fetch(url);
            const data = await res.json();
            setFlights(data);
        } catch (error) {
            console.error('Error:', error);
        } finally {
            setLoading(false);
        }
    };

    const formatDateTime = (dateStr: string) => {
        return new Date(dateStr).toLocaleString('vi-VN', {
            day: '2-digit',
            month: '2-digit',
            year: 'numeric',
            hour: '2-digit',
            minute: '2-digit',
        });
    };

    const formatTime = (dateStr: string) => {
        return new Date(dateStr).toLocaleTimeString('vi-VN', {
            hour: '2-digit',
            minute: '2-digit',
        });
    };

    const filteredFlights = flights.filter(flight =>
        search === '' ||
        flight.chuyenBay.soHieuChuyenBay.toLowerCase().includes(search.toLowerCase()) ||
        flight.sanBayDi.tenSanBay.toLowerCase().includes(search.toLowerCase()) ||
        flight.sanBayDen.tenSanBay.toLowerCase().includes(search.toLowerCase())
    );

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
                <h1 className="text-3xl font-bold text-white mb-2 flex items-center gap-3">
                    <FiSend className="text-blue-400" />
                    Danh Sách Chuyến Bay
                </h1>
                <p className="text-slate-400">Xem danh sách chuyến bay và hành khách</p>
            </div>

            {/* Filters */}
            <div className="bg-slate-900 border border-slate-800 rounded-xl p-6">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    {/* Search */}
                    <div className="relative">
                        <FiSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                        <input
                            type="text"
                            placeholder="Tìm số hiệu, sân bay..."
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                            onKeyPress={(e) => e.key === 'Enter' && fetchFlights()}
                            className="w-full pl-10 pr-4 py-2 bg-slate-800 border border-slate-700 rounded-lg text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                    </div>

                    {/* Start Date */}
                    <div className="relative">
                        <FiCalendar className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                        <input
                            type="date"
                            value={startDate}
                            onChange={(e) => setStartDate(e.target.value)}
                            className="w-full pl-10 pr-4 py-2 bg-slate-800 border border-slate-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                    </div>

                    {/* End Date */}
                    <div className="relative">
                        <FiCalendar className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                        <input
                            type="date"
                            value={endDate}
                            onChange={(e) => setEndDate(e.target.value)}
                            className="w-full pl-10 pr-4 py-2 bg-slate-800 border border-slate-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                    </div>
                </div>
            </div>

            {/* Flights List */}
            <div className="grid grid-cols-1 gap-4">
                {filteredFlights.map((flight) => (
                    <div
                        key={flight.id}
                        onClick={() => router.push(`/dashboard/flights-schedule/${flight.id}`)}
                        className="bg-slate-900 border border-slate-800 rounded-xl p-6 hover:border-blue-500/50 transition-all cursor-pointer"
                    >
                        <div className="flex items-center justify-between">
                            {/* Flight Info */}
                            <div className="flex-1">
                                <div className="flex items-center gap-4 mb-4">
                                    <div className="text-2xl font-bold text-blue-400">
                                        {flight.chuyenBay.soHieuChuyenBay}
                                    </div>
                                    <div className="text-sm text-slate-400">
                                        {flight.chuyenBay.hang.tenHang}
                                    </div>
                                </div>

                                <div className="grid grid-cols-3 gap-6">
                                    {/* Departure */}
                                    <div>
                                        <div className="text-xs text-slate-500 mb-1">Khởi hành</div>
                                        <div className="text-3xl font-bold text-white">{formatTime(flight.gioDi)}</div>
                                        <div className="text-sm text-slate-300 mt-1">
                                            {flight.sanBayDi.maIata} - {flight.sanBayDi.tenSanBay}
                                        </div>
                                        <div className="text-xs text-slate-500">
                                            {new Date(flight.gioDi).toLocaleDateString('vi-VN')}
                                        </div>
                                    </div>

                                    {/* Duration */}
                                    <div className="flex flex-col items-center justify-center">
                                        <div className="flex items-center gap-2 text-slate-400">
                                            <div className="h-px w-12 bg-slate-600"></div>
                                            <FiSend className="text-blue-400" />
                                            <div className="h-px w-12 bg-slate-600"></div>
                                        </div>
                                        <div className="text-xs text-slate-500 mt-2 flex items-center gap-1">
                                            <FiClock className="w-3 h-3" />
                                            {Math.floor(flight.thoiGianBayPhut / 60)}h {flight.thoiGianBayPhut % 60}m
                                        </div>
                                    </div>

                                    {/* Arrival */}
                                    <div>
                                        <div className="text-xs text-slate-500 mb-1">Đến nơi</div>
                                        <div className="text-3xl font-bold text-white">{formatTime(flight.gioDen)}</div>
                                        <div className="text-sm text-slate-300 mt-1">
                                            {flight.sanBayDen.maIata} - {flight.sanBayDen.tenSanBay}
                                        </div>
                                        <div className="text-xs text-slate-500">
                                            {new Date(flight.gioDen).toLocaleDateString('vi-VN')}
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Stats */}
                            <div className="flex flex-col items-end gap-3 ml-6">
                                <div className="bg-blue-500/10 px-4 py-2 rounded-lg">
                                    <div className="flex items-center gap-2 text-blue-400">
                                        <FiUsers className="w-5 h-5" />
                                        <span className="text-2xl font-bold">{flight.soLuongHanhKhach}</span>
                                    </div>
                                    <div className="text-xs text-slate-400 mt-1">Hành khách</div>
                                </div>
                                <div className="text-sm text-slate-400">
                                    {flight.soLuongDat} đơn đặt vé
                                </div>
                            </div>
                        </div>
                    </div>
                ))}

                {filteredFlights.length === 0 && (
                    <div className="text-center py-12 bg-slate-900 border border-slate-800 rounded-xl">
                        <p className="text-slate-500">Không tìm thấy chuyến bay nào</p>
                    </div>
                )}
            </div>
        </div>
    );
}
