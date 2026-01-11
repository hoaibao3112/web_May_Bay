'use client';

import { useState, useEffect, useRef } from 'react';
import { Html5Qrcode } from 'html5-qrcode';

interface PassengerInfo {
    id: number;
    ho: string;
    ten: string;
    loai: string;
    daCheckin: boolean;
    thoiGianCheckin?: string;
}

interface BookingInfo {
    id: number;
    maDatVe: string;
    changBay: {
        chuyenBay: {
            soHieuChuyenBay: string;
            hang: {
                tenHang: string;
            };
        };
        sanBayDi: {
            tenSanBay: string;
            maIata: string;
        };
        sanBayDen: {
            tenSanBay: string;
            maIata: string;
        };
        gioDi: string;
    };
    hanhKhach: PassengerInfo[];
}

export default function CheckInPage() {
    const [scanning, setScanning] = useState(false);
    const [bookingInfo, setBookingInfo] = useState<BookingInfo | null>(null);
    const [selectedPassenger, setSelectedPassenger] = useState<PassengerInfo | null>(null);
    const [checkInResult, setCheckInResult] = useState<string | null>(null);
    const [error, setError] = useState<string | null>(null);
    const [manualPnr, setManualPnr] = useState('');
    const scannerRef = useRef<Html5Qrcode | null>(null);
    const [cameraPermission, setCameraPermission] = useState<'granted' | 'denied' | 'prompt'>('prompt');

    useEffect(() => {
        return () => {
            // Cleanup scanner on unmount
            if (scannerRef.current) {
                scannerRef.current.stop().catch(console.error);
            }
        };
    }, []);

    const startScanning = async () => {
        try {
            setError(null);
            setBookingInfo(null);
            setCheckInResult(null);

            const html5QrCode = new Html5Qrcode('qr-reader');
            scannerRef.current = html5QrCode;

            await html5QrCode.start(
                { facingMode: 'environment' },
                {
                    fps: 10,
                    qrbox: { width: 250, height: 250 },
                },
                onScanSuccess,
                onScanError
            );

            setScanning(true);
            setCameraPermission('granted');
        } catch (err: any) {
            console.error('Error starting scanner:', err);
            setError('Không thể khởi động camera. Vui lòng kiểm tra quyền truy cập camera.');
            setCameraPermission('denied');
        }
    };

    const stopScanning = async () => {
        if (scannerRef.current) {
            try {
                await scannerRef.current.stop();
                scannerRef.current = null;
                setScanning(false);
            } catch (err) {
                console.error('Error stopping scanner:', err);
            }
        }
    };

    const onScanSuccess = async (decodedText: string) => {
        console.log('QR Code scanned:', decodedText);

        // Stop scanning immediately
        await stopScanning();

        try {
            // Verify QR code with backend
            const response = await fetch('http://localhost:5000/qr-code/verify', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ qrData: decodedText }),
            });

            const data = await response.json();

            if (data.valid && data.booking) {
                setBookingInfo(data.booking);
                setError(null);
            } else {
                setError('Mã QR không hợp lệ hoặc đã hết hạn');
            }
        } catch (err) {
            console.error('Error verifying QR:', err);
            setError('Lỗi khi xác thực mã QR');
        }
    };

    const onScanError = (errorMessage: string) => {
        // Ignore frequent scan errors
        if (!errorMessage.includes('NotFoundException')) {
            console.log('Scan error:', errorMessage);
        }
    };

    const handleCheckIn = async (passengerId: number) => {
        try {
            const response = await fetch('http://localhost:5000/qr-code/check-in', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    hanhKhachId: passengerId,
                    nguoiCheckIn: 'Admin',
                }),
            });

            const data = await response.json();

            if (data.success) {
                setCheckInResult(`✅ Check-in thành công cho ${data.passenger.ho} ${data.passenger.ten}`);

                // Update booking info
                if (bookingInfo) {
                    const updatedPassengers = bookingInfo.hanhKhach.map(p =>
                        p.id === passengerId ? { ...p, daCheckin: true, thoiGianCheckin: data.checkInTime } : p
                    );
                    setBookingInfo({ ...bookingInfo, hanhKhach: updatedPassengers });
                }
            } else {
                setError(data.message || 'Lỗi khi check-in');
            }
        } catch (err) {
            console.error('Error checking in:', err);
            setError('Lỗi khi check-in hành khách');
        }
    };

    const handleManualSearch = async () => {
        if (!manualPnr.trim()) {
            setError('Vui lòng nhập mã đặt chỗ');
            return;
        }

        try {
            setError(null);
            const response = await fetch(`http://localhost:5000/bookings/pnr/${manualPnr}`);
            const data = await response.json();

            if (data) {
                setBookingInfo(data);
            } else {
                setError('Không tìm thấy đặt chỗ với mã: ' + manualPnr);
            }
        } catch (err) {
            console.error('Error searching booking:', err);
            setError('Lỗi khi tìm kiếm đặt chỗ');
        }
    };

    return (
        <div className="p-6">
            <div className="mb-6">
                <h1 className="text-3xl font-bold mb-2">🎫 Check-in QR Code</h1>
                <p className="text-gray-600">Quét mã QR từ thẻ lên máy bay của hành khách để check-in</p>
            </div>

            {/* Error Display */}
            {error && (
                <div className="bg-red-50 border-l-4 border-red-500 p-4 mb-6">
                    <div className="flex items-center">
                        <span className="text-2xl mr-3">❌</span>
                        <p className="text-red-700 font-medium">{error}</p>
                    </div>
                </div>
            )}

            {/* Success Display */}
            {checkInResult && (
                <div className="bg-green-50 border-l-4 border-green-500 p-4 mb-6">
                    <div className="flex items-center">
                        <span className="text-2xl mr-3">✅</span>
                        <p className="text-green-700 font-medium">{checkInResult}</p>
                    </div>
                </div>
            )}

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Scanner Section */}
                <div className="bg-white rounded-lg shadow-lg p-6">
                    <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
                        <span className="text-2xl">📹</span>
                        Quét mã QR
                    </h2>

                    <div className="mb-4">
                        <div
                            id="qr-reader"
                            className="border-2 border-gray-300 rounded-lg overflow-hidden bg-black"
                            style={{ width: '100%', minHeight: '400px' }}
                        ></div>
                    </div>

                    <div className="flex gap-3">
                        {!scanning ? (
                            <button
                                onClick={startScanning}
                                className="flex-1 bg-blue-600 text-white py-3 rounded-lg font-semibold hover:bg-blue-700 transition flex items-center justify-center gap-2"
                            >
                                <span className="text-xl">📷</span>
                                Bật Camera Quét QR
                            </button>
                        ) : (
                            <button
                                onClick={stopScanning}
                                className="flex-1 bg-red-600 text-white py-3 rounded-lg font-semibold hover:bg-red-700 transition flex items-center justify-center gap-2"
                            >
                                <span className="text-xl">⏹️</span>
                                Dừng Quét
                            </button>
                        )}
                    </div>

                    {/* Manual Search */}
                    <div className="mt-6 pt-6 border-t">
                        <h3 className="font-semibold mb-3">Hoặc nhập mã đặt chỗ thủ công:</h3>
                        <div className="flex gap-2">
                            <input
                                type="text"
                                value={manualPnr}
                                onChange={(e) => setManualPnr(e.target.value.toUpperCase())}
                                placeholder="Nhập mã PNR (VD: CV49I9)"
                                className="flex-1 border-2 border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:border-blue-500 text-gray-900 placeholder-gray-400 bg-white"
                                onKeyPress={(e) => e.key === 'Enter' && handleManualSearch()}
                            />
                            <button
                                onClick={handleManualSearch}
                                className="bg-gray-600 text-white px-6 py-2 rounded-lg font-semibold hover:bg-gray-700 transition"
                            >
                                Tìm
                            </button>
                        </div>
                    </div>
                </div>

                {/* Booking Info Section */}
                <div className="bg-white rounded-lg shadow-lg p-6">
                    <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
                        <span className="text-2xl">✈️</span>
                        Thông tin chuyến bay
                    </h2>

                    {!bookingInfo ? (
                        <div className="text-center py-12 text-gray-400">
                            <div className="text-6xl mb-4">🎫</div>
                            <p>Quét mã QR hoặc nhập mã đặt chỗ để hiển thị thông tin</p>
                        </div>
                    ) : (
                        <div className="space-y-4">
                            {/* Flight Info */}
                            <div className="bg-blue-50 rounded-lg p-4">
                                <div className="flex items-center justify-between mb-3">
                                    <div>
                                        <p className="text-sm text-gray-600">Mã đặt chỗ</p>
                                        <p className="text-2xl font-bold text-blue-600">{bookingInfo.maDatVe}</p>
                                    </div>
                                    <div className="text-right">
                                        <p className="text-sm text-gray-600">Chuyến bay</p>
                                        <p className="font-bold">{bookingInfo.changBay.chuyenBay.soHieuChuyenBay}</p>
                                        <p className="text-sm text-gray-600">{bookingInfo.changBay.chuyenBay.hang.tenHang}</p>
                                    </div>
                                </div>
                                <div className="flex items-center justify-between text-sm">
                                    <div>
                                        <p className="font-semibold">{bookingInfo.changBay.sanBayDi.maIata}</p>
                                        <p className="text-gray-600">{bookingInfo.changBay.sanBayDi.tenSanBay}</p>
                                    </div>
                                    <div className="text-2xl">✈️</div>
                                    <div className="text-right">
                                        <p className="font-semibold">{bookingInfo.changBay.sanBayDen.maIata}</p>
                                        <p className="text-gray-600">{bookingInfo.changBay.sanBayDen.tenSanBay}</p>
                                    </div>
                                </div>
                                <div className="mt-2 text-sm text-gray-600 text-center">
                                    {new Date(bookingInfo.changBay.gioDi).toLocaleString('vi-VN')}
                                </div>
                            </div>

                            {/* Passengers List */}
                            <div>
                                <h3 className="font-bold mb-3">Danh sách hành khách ({bookingInfo.hanhKhach.length})</h3>
                                <div className="space-y-2">
                                    {bookingInfo.hanhKhach.map((passenger) => (
                                        <div
                                            key={passenger.id}
                                            className={`border-2 rounded-lg p-4 ${passenger.daCheckin
                                                ? 'border-green-300 bg-green-50'
                                                : 'border-gray-300 bg-white'
                                                }`}
                                        >
                                            <div className="flex items-center justify-between">
                                                <div>
                                                    <p className="font-semibold text-lg">
                                                        {passenger.ho} {passenger.ten}
                                                    </p>
                                                    <p className="text-sm text-gray-600">{passenger.loai}</p>
                                                    {passenger.daCheckin && passenger.thoiGianCheckin && (
                                                        <p className="text-xs text-green-600 mt-1">
                                                            ✅ Đã check-in: {new Date(passenger.thoiGianCheckin).toLocaleString('vi-VN')}
                                                        </p>
                                                    )}
                                                </div>
                                                <div>
                                                    {passenger.daCheckin ? (
                                                        <span className="bg-green-500 text-white px-4 py-2 rounded-lg font-semibold">
                                                            ✓ Đã check-in
                                                        </span>
                                                    ) : (
                                                        <button
                                                            onClick={() => handleCheckIn(passenger.id)}
                                                            className="bg-blue-600 text-white px-6 py-2 rounded-lg font-semibold hover:bg-blue-700 transition"
                                                        >
                                                            Check-in
                                                        </button>
                                                    )}
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            {/* Reset Button */}
                            <button
                                onClick={() => {
                                    setBookingInfo(null);
                                    setCheckInResult(null);
                                    setError(null);
                                    setManualPnr('');
                                }}
                                className="w-full bg-gray-500 text-white py-2 rounded-lg hover:bg-gray-600 transition"
                            >
                                🔄 Quét mã mới
                            </button>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
