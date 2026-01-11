'use client';

import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import { FiArrowLeft, FiUser, FiMapPin, FiCreditCard, FiSend, FiCheckCircle } from 'react-icons/fi';

export default function PassengerDetailPage() {
    const params = useParams();
    const id = params.id as string;

    const [passenger, setPassenger] = useState<any>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchPassenger();
    }, []);

    const fetchPassenger = async () => {
        try {
            const res = await fetch(`http://localhost:5000/admin/flights-schedule/passengers/${id}`);
            const data = await res.json();
            setPassenger(data);
        } catch (error) {
            console.error('Error:', error);
        } finally {
            setLoading(false);
        }
    };

    const formatCurrency = (amount: number) => {
        return new Intl.NumberFormat('vi-VN', {
            style: 'currency',
            currency: 'VND',
        }).format(amount);
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-screen">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
            </div>
        );
    }

    if (!passenger) {
        return <div className="text-white">Không tìm thấy hành khách</div>;
    }

    const flight = passenger.donDatVe.changBay;

    return (
        <div className="space-y-6">
            {/* Header */}
            <div>
                <Link href={`/dashboard/flights-schedule/${flight.id}`} className="inline-flex items-center gap-2 text-blue-400 hover:text-blue-300 mb-4">
                    <FiArrowLeft /> Quay lại danh sách hành khách
                </Link>
                <h1 className="text-3xl font-bold text-white mb-2">Chi Tiết Hành Khách</h1>
                <p className="text-slate-400">Thông tin chi tiết của hành khách</p>
            </div>

            {/* Passenger Info */}
            <div className="bg-slate-900 border border-slate-800 rounded-xl p-8">
                <div className="flex items-center gap-4 mb-6">
                    <div className="w-20 h-20 bg-gradient-to-br from-blue-500 to-blue-600 rounded-full flex items-center justify-center text-white text-3xl font-bold">
                        {passenger.ho.charAt(0)}{passenger.ten.charAt(0)}
                    </div>
                    <div>
                        <h2 className="text-2xl font-bold text-white">{passenger.ho} {passenger.ten}</h2>
                        <div className="text-slate-400">
                            {passenger.loai === 'NGUOI_LON' ? 'Người lớn' :
                                passenger.loai === 'TRE_EM' ? 'Trẻ em' : 'Sơ sinh'}
                        </div>
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                        <div className="text-xs text-slate-500 mb-1">Giới tính</div>
                        <div className="text-white">{passenger.gioiTinh === 'NAM' ? 'Nam' : 'Nữ'}</div>
                    </div>

                    <div>
                        <div className="text-xs text-slate-500 mb-1">Ngày sinh</div>
                        <div className="text-white">{new Date(passenger.ngaySinh).toLocaleDateString('vi-VN')}</div>
                    </div>

                    {passenger.soCccd && (
                        <div>
                            <div className="text-xs text-slate-500 mb-1">Số CCCD</div>
                            <div className="text-white font-mono">{passenger.soCccd}</div>
                        </div>
                    )}

                    {passenger.soHoChieu && (
                        <div>
                            <div className="text-xs text-slate-500 mb-1">Số hộ chiếu</div>
                            <div className="text-white font-mono">{passenger.soHoChieu}</div>
                        </div>
                    )}

                    {passenger.quocTich && (
                        <div>
                            <div className="text-xs text-slate-500 mb-1">Quốc tịch</div>
                            <div className="text-white">{passenger.quocTich}</div>
                        </div>
                    )}

                    {passenger.soGhe && (
                        <div>
                            <div className="text-xs text-slate-500 mb-1">Số ghế</div>
                            <div className="text-white font-mono text-lg font-bold">{passenger.soGhe}</div>
                        </div>
                    )}
                </div>

                {/* Check-in Status */}
                {passenger.daCheckin && (
                    <div className="mt-6 p-4 bg-green-500/10 border border-green-500/30 rounded-lg">
                        <div className="flex items-center gap-2 text-green-400">
                            <FiCheckCircle className="w-5 h-5" />
                            <span className="font-semibold">Đã check-in</span>
                        </div>
                        <div className="text-sm text-slate-400 mt-1">
                            {new Date(passenger.thoiGianCheckin).toLocaleString('vi-VN')}
                        </div>
                        {passenger.maBoardingPass && (
                            <div className="text-sm text-white mt-2">
                                Boarding Pass: <span className="font-mono">{passenger.maBoardingPass}</span>
                            </div>
                        )}
                    </div>
                )}
            </div>

            {/* Flight Info */}
            <div className="bg-slate-900 border border-slate-800 rounded-xl p-6">
                <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
                    <FiSend className="text-blue-400" />
                    Thông tin chuyến bay
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                        <div className="text-xs text-slate-500 mb-1">Số hiệu</div>
                        <div className="text-xl font-bold text-blue-400">{flight.chuyenBay.soHieuChuyenBay}</div>
                    </div>

                    <div>
                        <div className="text-xs text-slate-500 mb-1">Hãng hàng không</div>
                        <div className="text-white">{flight.chuyenBay.hang.tenHang}</div>
                    </div>

                    <div>
                        <div className="text-xs text-slate-500 mb-1">Khởi hành</div>
                        <div className="text-white">{flight.sanBayDi.tenSanBay}</div>
                        <div className="text-sm text-slate-400">
                            {new Date(flight.gioDi).toLocaleString('vi-VN')}
                        </div>
                    </div>

                    <div>
                        <div className="text-xs text-slate-500 mb-1">Đến nơi</div>
                        <div className="text-white">{flight.sanBayDen.tenSanBay}</div>
                        <div className="text-sm text-slate-400">
                            {new Date(flight.gioDen).toLocaleString('vi-VN')}
                        </div>
                    </div>
                </div>
            </div>

            {/* Booking Info */}
            <div className="bg-slate-900 border border-slate-800 rounded-xl p-6">
                <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
                    <FiCreditCard className="text-blue-400" />
                    Thông tin đặt vé
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                        <div className="text-xs text-slate-500 mb-1">Mã đặt vé</div>
                        <div className="text-white font-mono">{passenger.donDatVe.maDatVe}</div>
                    </div>

                    <div>
                        <div className="text-xs text-slate-500 mb-1">Tổng tiền</div>
                        <div className="text-white font-semibold">{formatCurrency(passenger.donDatVe.tongTien)}</div>
                    </div>

                    <div>
                        <div className="text-xs text-slate-500 mb-1">Người đặt</div>
                        <div className="text-white">{passenger.donDatVe.nguoiDung.hoTen}</div>
                        <div className="text-sm text-slate-400">{passenger.donDatVe.nguoiDung.email}</div>
                    </div>

                    <div>
                        <div className="text-xs text-slate-500 mb-1">Thời gian đặt</div>
                        <div className="text-white">{new Date(passenger.donDatVe.createdAt).toLocaleString('vi-VN')}</div>
                    </div>
                </div>
            </div>

            {/* Luggage Info */}
            {passenger.hanhLy && passenger.hanhLy.length > 0 && (
                <div className="bg-slate-900 border border-slate-800 rounded-xl p-6">
                    <h3 className="text-lg font-semibold text-white mb-4">Hành lý</h3>
                    <div className="space-y-2">
                        {passenger.hanhLy.map((item: any, idx: number) => (
                            <div key={idx} className="flex justify-between text-sm">
                                <span className="text-slate-300">{item.loaiHanhLy}</span>
                                <span className="text-white">{item.soKy} kg</span>
                            </div>
                        ))}
                    </div>
                </div>
            )}

            {/* Ticket Info */}
            {passenger.ve && passenger.ve.length > 0 && (
                <div className="bg-slate-900 border border-slate-800 rounded-xl p-6">
                    <h3 className="text-lg font-semibold text-white mb-4">Vé điện tử</h3>
                    <div className="space-y-3">
                        {passenger.ve.map((ticket: any, idx: number) => (
                            <div key={idx} className="p-4 bg-slate-800 rounded-lg">
                                <div className="flex justify-between">
                                    <div>
                                        <div className="text-xs text-slate-500">Mã vé</div>
                                        <div className="text-white font-mono">{ticket.maVe}</div>
                                    </div>
                                    <div className="text-right">
                                        <div className="text-xs text-slate-500">Trạng thái</div>
                                        <div className="text-green-400">Đã xuất</div>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
}
