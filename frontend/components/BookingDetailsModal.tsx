'use client';

import { useState } from 'react';
import Image from 'next/image';

interface BookingDetailsModalProps {
    booking: any;
    type: 'flight' | 'hotel' | 'bus' | 'activity' | 'transfer';
    qrCode?: string;
    onClose: () => void;
}

export default function BookingDetailsModal({ booking, type, qrCode, onClose }: BookingDetailsModalProps) {
    const [printing, setPrinting] = useState(false);

    const handlePrint = () => {
        setPrinting(true);
        window.print();
        setTimeout(() => setPrinting(false), 500);
    };

    const handleDownloadQR = () => {
        if (!qrCode) return;
        const link = document.createElement('a');
        link.href = qrCode;
        link.download = `QR-${type.toUpperCase()}-${booking.id || booking.maDat}.png`;
        link.click();
    };

    const formatCurrency = (amount: number) => {
        return new Intl.NumberFormat('vi-VN', {
            style: 'currency',
            currency: 'VND',
        }).format(amount);
    };

    const formatDate = (dateStr: string) => {
        return new Date(dateStr).toLocaleDateString('vi-VN', {
            weekday: 'long',
            day: '2-digit',
            month: '2-digit',
            year: 'numeric',
        });
    };

    const formatTime = (dateStr: string) => {
        return new Date(dateStr).toLocaleTimeString('vi-VN', {
            hour: '2-digit',
            minute: '2-digit',
        });
    };

    const renderFlightDetails = () => (
        <div className="space-y-6">
            <div className="grid grid-cols-2 gap-4">
                <div>
                    <div className="text-sm text-gray-600">Mã đặt vé (PNR)</div>
                    <div className="text-xl font-bold text-blue-600">{booking.maDatVe}</div>
                </div>
                <div className="text-right">
                    <div className="text-sm text-gray-600">Trạng thái</div>
                    <div className="text-xl font-bold text-green-600">{booking.trangThai}</div>
                </div>
            </div>

            <div className="border-l-4 border-blue-500 pl-4">
                <div className="text-sm text-gray-600">Chuyến bay</div>
                <div className="font-semibold text-lg">{booking.changBay?.chuyenBay?.soHieuChuyenBay}</div>
                <div className="text-gray-700">
                    {booking.changBay?.sanBayDi?.tenSanBay} ({booking.changBay?.sanBayDi?.maIata})
                    → {booking.changBay?.sanBayDen?.tenSanBay} ({booking.changBay?.sanBayDen?.maIata})
                </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
                <div>
                    <div className="text-sm text-gray-600">Khởi hành</div>
                    <div className="font-semibold">{formatDate(booking.changBay?.gioDi)}</div>
                    <div className="text-lg font-bold text-blue-600">{formatTime(booking.changBay?.gioDi)}</div>
                </div>
                <div>
                    <div className="text-sm text-gray-600">Đến</div>
                    <div className="font-semibold">{formatDate(booking.changBay?.gioDen)}</div>
                    <div className="text-lg font-bold text-blue-600">{formatTime(booking.changBay?.gioDen)}</div>
                </div>
            </div>

            <div>
                <div className="text-sm text-gray-600 mb-2">Hành khách</div>
                {booking.hanhKhach?.map((hk: any, idx: number) => (
                    <div key={idx} className="flex justify-between items-center py-2 border-b">
                        <div>
                            <div className="font-semibold">{hk.ho} {hk.ten}</div>
                            <div className="text-sm text-gray-600">{hk.loai}</div>
                        </div>
                        <div className="text-sm text-gray-600">Ghế: {hk.soGhe || 'Chưa chọn'}</div>
                    </div>
                ))}
            </div>

            <div className="bg-gray-50 p-4 rounded-lg">
                <div className="flex justify-between items-center">
                    <span className="text-gray-700">Tổng tiền</span>
                    <span className="text-2xl font-bold text-green-600">{formatCurrency(booking.tongTien)}</span>
                </div>
            </div>
        </div>
    );

    const renderHotelDetails = () => (
        <div className="space-y-6">
            <div className="grid grid-cols-2 gap-4">
                <div>
                    <div className="text-sm text-gray-600">Mã đặt phòng</div>
                    <div className="text-xl font-bold text-purple-600">{booking.maDatPhong}</div>
                </div>
                <div className="text-right">
                    <div className="text-sm text-gray-600">Trạng thái</div>
                    <div className="text-xl font-bold text-green-600">{booking.trangThai}</div>
                </div>
            </div>

            <div className="border-l-4 border-purple-500 pl-4">
                <div className="text-sm text-gray-600">Khách sạn</div>
                <div className="font-semibold text-lg">{booking.khachSan?.tenKhachSan}</div>
                <div className="text-gray-700">{booking.khachSan?.diaChi}</div>
            </div>

            <div>
                <div className="text-sm text-gray-600">Phòng</div>
                <div className="font-semibold text-lg">{booking.phong?.tenPhong}</div>
                <div className="text-gray-600">{booking.phong?.loaiPhong}</div>
            </div>

            <div className="grid grid-cols-2 gap-4">
                <div>
                    <div className="text-sm text-gray-600">Nhận phòng</div>
                    <div className="font-semibold">{formatDate(booking.ngayNhanPhong)}</div>
                </div>
                <div>
                    <div className="text-sm text-gray-600">Trả phòng</div>
                    <div className="font-semibold">{formatDate(booking.ngayTraPhong)}</div>
                </div>
            </div>

            <div className="grid grid-cols-3 gap-4">
                <div>
                    <div className="text-sm text-gray-600">Số phòng</div>
                    <div className="font-semibold">{booking.soPhong}</div>
                </div>
                <div>
                    <div className="text-sm text-gray-600">Người lớn</div>
                    <div className="font-semibold">{booking.soNguoiLon}</div>
                </div>
                <div>
                    <div className="text-sm text-gray-600">Trẻ em</div>
                    <div className="font-semibold">{booking.soTreEm}</div>
                </div>
            </div>

            <div className="bg-gray-50 p-4 rounded-lg">
                <div className="flex justify-between items-center">
                    <span className="text-gray-700">Tổng tiền</span>
                    <span className="text-2xl font-bold text-green-600">{formatCurrency(booking.tongTien)}</span>
                </div>
            </div>
        </div>
    );

    const renderBusDetails = () => (
        <div className="space-y-6">
            <div className="grid grid-cols-2 gap-4">
                <div>
                    <div className="text-sm text-gray-600">Mã đơn đặt</div>
                    <div className="text-xl font-bold text-orange-600">{booking.maDonDat}</div>
                </div>
                <div className="text-right">
                    <div className="text-sm text-gray-600">Trạng thái</div>
                    <div className="text-xl font-bold text-green-600">{booking.trangThaiDat}</div>
                </div>
            </div>

            <div className="border-l-4 border-orange-500 pl-4">
                <div className="text-sm text-gray-600">Nhà xe</div>
                <div className="font-semibold text-lg">{booking.chuyenXe?.tuyenXe?.nhaXe?.tenNhaXe}</div>
            </div>

            <div>
                <div className="text-sm text-gray-600 mb-2">Hành trình</div>
                <div className="flex items-center gap-4">
                    <div className="flex-1">
                        <div className="font-semibold">{booking.chuyenXe?.tuyenXe?.benXeDi?.tenBenXe}</div>
                        <div className="text-sm text-gray-600">{booking.chuyenXe?.tuyenXe?.benXeDi?.thanhPho}</div>
                    </div>
                    <div className="text-2xl text-gray-400">→</div>
                    <div className="flex-1 text-right">
                        <div className="font-semibold">{booking.chuyenXe?.tuyenXe?.benXeDen?.tenBenXe}</div>
                        <div className="text-sm text-gray-600">{booking.chuyenXe?.tuyenXe?.benXeDen?.thanhPho}</div>
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
                <div>
                    <div className="text-sm text-gray-600">Giờ khởi hành</div>
                    <div className="font-semibold">{formatDate(booking.chuyenXe?.gioDi)}</div>
                    <div className="text-lg font-bold text-orange-600">{formatTime(booking.chuyenXe?.gioDi)}</div>
                </div>
                <div>
                    <div className="text-sm text-gray-600">Số ghế</div>
                    <div className="font-semibold text-lg">{booking.veXe?.map((v: any) => v.soGhe).join(', ')}</div>
                </div>
            </div>

            <div className="bg-gray-50 p-4 rounded-lg">
                <div className="flex justify-between items-center">
                    <span className="text-gray-700">Tổng tiền</span>
                    <span className="text-2xl font-bold text-green-600">{formatCurrency(booking.tongTien)}</span>
                </div>
            </div>
        </div>
    );

    const renderActivityDetails = () => (
        <div className="space-y-6">
            <div className="grid grid-cols-2 gap-4">
                <div>
                    <div className="text-sm text-gray-600">Mã đặt</div>
                    <div className="text-xl font-bold text-pink-600">{booking.maDat}</div>
                </div>
                <div className="text-right">
                    <div className="text-sm text-gray-600">Trạng thái</div>
                    <div className="text-xl font-bold text-green-600">{booking.trangThai}</div>
                </div>
            </div>

            <div className="border-l-4 border-pink-500 pl-4">
                <div className="text-sm text-gray-600">Hoạt động</div>
                <div className="font-semibold text-lg">{booking.hoatDong?.tenHoatDong}</div>
                <div className="text-gray-700">{booking.hoatDong?.diaDiem}</div>
            </div>

            <div>
                <div className="text-sm text-gray-600">Ngày thực hiện</div>
                <div className="font-semibold text-lg">{formatDate(booking.ngayThucHien)}</div>
            </div>

            <div className="grid grid-cols-2 gap-4">
                <div>
                    <div className="text-sm text-gray-600">Người lớn</div>
                    <div className="font-semibold text-lg">{booking.soNguoiLon}</div>
                </div>
                <div>
                    <div className="text-sm text-gray-600">Trẻ em</div>
                    <div className="font-semibold text-lg">{booking.soTreEm || 0}</div>
                </div>
            </div>

            <div className="bg-gray-50 p-4 rounded-lg">
                <div className="flex justify-between items-center">
                    <span className="text-gray-700">Tổng tiền</span>
                    <span className="text-2xl font-bold text-green-600">{formatCurrency(booking.tongTien)}</span>
                </div>
            </div>
        </div>
    );

    const renderTransferDetails = () => (
        <div className="space-y-6">
            <div className="grid grid-cols-2 gap-4">
                <div>
                    <div className="text-sm text-gray-600">Mã đặt xe</div>
                    <div className="text-xl font-bold text-indigo-600">DX-{String(booking.id).padStart(6, '0')}</div>
                </div>
                <div className="text-right">
                    <div className="text-sm text-gray-600">Trạng thái</div>
                    <div className="text-xl font-bold text-green-600">{booking.trangThai}</div>
                </div>
            </div>

            <div className="border-l-4 border-indigo-500 pl-4">
                <div className="text-sm text-gray-600">Dịch vụ</div>
                <div className="font-semibold text-lg">{booking.dichVu?.loaiXe} - {booking.dichVu?.soChoNgoi} chỗ</div>
                <div className="text-gray-700">{booking.nhaCungCap?.ten}</div>
            </div>

            <div>
                <div className="text-sm text-gray-600 mb-2">Hành trình</div>
                <div className="flex items-center gap-4">
                    <div className="flex-1 bg-blue-50 p-3 rounded-lg">
                        <div className="text-xs text-gray-600">Điểm đón</div>
                        <div className="font-semibold">{booking.diemDon}</div>
                    </div>
                    <div className="text-2xl text-gray-400">→</div>
                    <div className="flex-1 bg-orange-50 p-3 rounded-lg">
                        <div className="text-xs text-gray-600">Điểm trả</div>
                        <div className="font-semibold">{booking.diemTra}</div>
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
                <div>
                    <div className="text-sm text-gray-600">Ngày đón</div>
                    <div className="font-semibold">{formatDate(booking.ngayDon)}</div>
                </div>
                <div>
                    <div className="text-sm text-gray-600">Giờ đón</div>
                    <div className="font-semibold text-lg">{booking.gioDon}</div>
                </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
                <div>
                    <div className="text-sm text-gray-600">Số hành khách</div>
                    <div className="font-semibold text-lg">{booking.soHanhKhach}</div>
                </div>
                <div>
                    <div className="text-sm text-gray-600">Loại dịch vụ</div>
                    <div className="font-semibold">{booking.loaiDichVu === 'mot_chieu' ? 'Một chiều' : 'Khứ hồi'}</div>
                </div>
            </div>

            <div>
                <div className="text-sm text-gray-600">Thông tin liên hệ</div>
                <div className="bg-gray-50 p-3 rounded-lg space-y-1">
                    <div className="font-semibold">{booking.tenKhachHang}</div>
                    <div className="text-sm text-gray-600">{booking.soDienThoai}</div>
                    <div className="text-sm text-gray-600">{booking.email}</div>
                </div>
            </div>

            {booking.ghiChu && (
                <div>
                    <div className="text-sm text-gray-600">Ghi chú</div>
                    <div className="bg-yellow-50 p-3 rounded-lg text-sm">{booking.ghiChu}</div>
                </div>
            )}

            <div className="bg-gray-50 p-4 rounded-lg">
                <div className="flex justify-between items-center">
                    <span className="text-gray-700">Tổng tiền</span>
                    <span className="text-2xl font-bold text-green-600">{formatCurrency(booking.tongTien)}</span>
                </div>
            </div>
        </div>
    );

    const getTypeIcon = () => {
        switch (type) {
            case 'flight': return '✈️';
            case 'hotel': return '🏨';
            case 'bus': return '🚌';
            case 'activity': return '🎯';
            case 'transfer': return '🚗';
            default: return '📋';
        }
    };

    const getTypeName = () => {
        switch (type) {
            case 'flight': return 'Vé máy bay';
            case 'hotel': return 'Khách sạn';
            case 'bus': return 'Xe khách';
            case 'activity': return 'Hoạt động / Tour';
            case 'transfer': return 'Đưa đón sân bay';
            default: return 'Booking';
        }
    };

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-2xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-auto">
                {/* Header */}
                <div className="sticky top-0 bg-gradient-to-r from-blue-600 to-blue-800 text-white p-6 flex items-center justify-between rounded-t-2xl">
                    <div className="flex items-center gap-3">
                        <span className="text-4xl">{getTypeIcon()}</span>
                        <div>
                            <h2 className="text-2xl font-bold">{getTypeName()}</h2>
                            <p className="text-blue-100">Chi tiết đặt chỗ</p>
                        </div>
                    </div>
                    <button
                        onClick={onClose}
                        className="text-white hover:bg-white hover:bg-opacity-20 rounded-full p-2 transition"
                    >
                        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                        </svg>
                    </button>
                </div>

                {/* Content */}
                <div className="p-6 grid md:grid-cols-3 gap-6">
                    {/* Booking Details */}
                    <div className="md:col-span-2">
                        {type === 'flight' && renderFlightDetails()}
                        {type === 'hotel' && renderHotelDetails()}
                        {type === 'bus' && renderBusDetails()}
                        {type === 'activity' && renderActivityDetails()}
                        {type === 'transfer' && renderTransferDetails()}
                    </div>

                    {/* QR Code Section */}
                    {qrCode && (
                        <div className="space-y-4">
                            <div className="bg-gradient-to-br from-blue-50 to-purple-50 p-6 rounded-xl border-2 border-dashed border-blue-300">
                                <div className="text-center mb-4">
                                    <h3 className="font-bold text-lg text-gray-800">Mã QR Check-in</h3>
                                    <p className="text-sm text-gray-600">Quét mã để check-in nhanh</p>
                                </div>
                                <div className="bg-white p-4 rounded-lg shadow-sm">
                                    <img
                                        src={qrCode}
                                        alt="QR Code"
                                        className="w-full h-auto"
                                    />
                                </div>
                                <button
                                    onClick={handleDownloadQR}
                                    className="w-full mt-4 px-4 py-2 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700 transition flex items-center justify-center gap-2"
                                >
                                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                                    </svg>
                                    Tải mã QR
                                </button>
                            </div>

                            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                                <div className="flex gap-2">
                                    <span className="text-yellow-600">ℹ️</span>
                                    <div className="text-sm text-yellow-800">
                                        <p className="font-semibold mb-1">Lưu ý:</p>
                                        <ul className="list-disc list-inside space-y-1 text-xs">
                                            <li>Lưu mã QR này để check-in dễ dàng</li>
                                            <li>Đến sớm trước giờ khởi hành</li>
                                            <li>Mang theo giấy tờ tùy thân</li>
                                        </ul>
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}
                </div>

                {/* Footer Actions */}
                <div className="sticky bottom-0 bg-gray-50 p-6 flex gap-4 rounded-b-2xl border-t">
                    <button
                        onClick={handlePrint}
                        className="flex-1 px-6 py-3 bg-white border-2 border-blue-600 text-blue-600 rounded-lg font-semibold hover:bg-blue-50 transition flex items-center justify-center gap-2"
                    >
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4h6a2 2 0 002-2v-4a2 2 0 00-2-2H9a2 2 0 00-2 2v4a2 2 0 002 2zm8-12V5a2 2 0 00-2-2H9a2 2 0 00-2 2v4h10z" />
                        </svg>
                        In xác nhận
                    </button>
                    <button
                        onClick={onClose}
                        className="flex-1 px-6 py-3 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700 transition"
                    >
                        Đóng
                    </button>
                </div>
            </div>

            <style jsx global>{`
                @media print {
                    body * {
                        visibility: hidden;
                    }
                    .fixed {
                        position: relative !important;
                    }
                    .fixed, .fixed * {
                        visibility: visible;
                    }
                }
            `}</style>
        </div>
    );
}
