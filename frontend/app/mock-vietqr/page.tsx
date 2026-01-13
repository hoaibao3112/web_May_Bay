'use client';

import { useEffect, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Image from 'next/image';

export default function MockVietQRPage() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const [countdown, setCountdown] = useState(300); // 5 minutes
    const [status, setStatus] = useState<'pending' | 'success' | 'cancelled'>('pending');
    const [redirectCountdown, setRedirectCountdown] = useState(3);

    const amount = searchParams.get('amount');
    const orderId = searchParams.get('orderId');
    const orderInfo = searchParams.get('orderInfo');
    const bankCode = searchParams.get('bankCode') || 'VCB';
    const accountNo = searchParams.get('accountNo') || '1234567890';
    const accountName = searchParams.get('accountName') || 'TRAN HOAI BAO';

    // QR Code generation using VietQR API
    const qrCodeUrl = `https://img.vietqr.io/image/${bankCode}-${accountNo}-compact.png?amount=${amount}&addInfo=${encodeURIComponent(orderInfo || '')}&accountName=${encodeURIComponent(accountName)}`;

    useEffect(() => {
        if (status === 'pending') {
            const timer = setInterval(() => {
                setCountdown(prev => {
                    if (prev <= 1) {
                        clearInterval(timer);
                        setStatus('cancelled');
                        return 0;
                    }
                    return prev - 1;
                });
            }, 1000);
            return () => clearInterval(timer);
        }
    }, [status]);

    useEffect(() => {
        if (status === 'success') {
            const timer = setInterval(() => {
                setRedirectCountdown(prev => {
                    if (prev <= 1) {
                        clearInterval(timer);
                        window.location.href = `http://localhost:5000/api/payments/vietqr-return?orderId=${orderId}&resultCode=0&message=Successful`;
                        return 0;
                    }
                    return prev - 1;
                });
            }, 1000);
            return () => clearInterval(timer);
        } else if (status === 'cancelled') {
            const timer = setInterval(() => {
                setRedirectCountdown(prev => {
                    if (prev <= 1) {
                        clearInterval(timer);
                        window.location.href = `http://localhost:5000/api/payments/vietqr-return?orderId=${orderId}&resultCode=1&message=Cancelled`;
                        return 0;
                    }
                    return prev - 1;
                });
            }, 1000);
            return () => clearInterval(timer);
        }
    }, [status, orderId]);

    const handleConfirm = () => {
        setStatus('success');
    };

    const handleCancel = () => {
        setStatus('cancelled');
    };

    const formatTime = (seconds: number) => {
        const mins = Math.floor(seconds / 60);
        const secs = seconds % 60;
        return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
    };

    const formatCurrency = (amount: string) => {
        return new Intl.NumberFormat('vi-VN', {
            style: 'currency',
            currency: 'VND',
        }).format(Number(amount));
    };

    // Success Screen
    if (status === 'success') {
        return (
            <div className="min-h-screen bg-gradient-to-br from-blue-500 to-green-600 flex items-center justify-center p-4">
                <div className="bg-white rounded-2xl shadow-2xl p-8 max-w-md w-full text-center">
                    <div className="mb-6">
                        <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4 animate-bounce">
                            <svg className="w-12 h-12 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                            </svg>
                        </div>
                        <h2 className="text-2xl font-bold text-gray-800 mb-2">Đã xác nhận thanh toán!</h2>
                        <p className="text-gray-600">Giao dịch đang được xử lý</p>
                    </div>

                    <div className="bg-green-50 rounded-lg p-4 mb-6">
                        <p className="text-sm text-gray-600 mb-1">Số tiền</p>
                        <p className="text-2xl font-bold text-green-600">{formatCurrency(amount || '0')}</p>
                    </div>

                    <p className="text-gray-500 text-sm">
                        Chuyển hướng sau {redirectCountdown} giây...
                    </p>
                </div>
            </div>
        );
    }

    // Cancelled Screen
    if (status === 'cancelled') {
        return (
            <div className="min-h-screen bg-gradient-to-br from-gray-500 to-gray-700 flex items-center justify-center p-4">
                <div className="bg-white rounded-2xl shadow-2xl p-8 max-w-md w-full text-center">
                    <div className="mb-6">
                        <div className="w-20 h-20 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
                            <svg className="w-12 h-12 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                            </svg>
                        </div>
                        <h2 className="text-2xl font-bold text-gray-800 mb-2">Đã hủy giao dịch</h2>
                        <p className="text-gray-600">Bạn đã hủy thanh toán</p>
                    </div>

                    <p className="text-gray-500 text-sm">
                        Chuyển hướng sau {redirectCountdown} giây...
                    </p>
                </div>
            </div>
        );
    }

    // Main Payment Screen
    return (
        <div className="min-h-screen bg-gradient-to-br from-blue-500 to-cyan-600 flex items-center justify-center p-4">
            <div className="bg-white rounded-2xl shadow-2xl p-8 max-w-2xl w-full">
                {/* Header */}
                <div className="text-center mb-6">
                    <div className="flex items-center justify-center gap-3 mb-4">
                        <div className="text-4xl">🏦</div>
                        <h1 className="text-3xl font-bold text-gray-800">VietQR</h1>
                    </div>
                    <p className="text-gray-600">Quét mã QR để thanh toán</p>
                </div>

                {/* Timer Warning */}
                <div className={`mb-6 p-4 rounded-lg ${countdown < 60 ? 'bg-red-50 border-2 border-red-300 animate-pulse' : 'bg-blue-50 border border-blue-200'}`}>
                    <div className="flex items-center justify-between">
                        <span className={`font-semibold ${countdown < 60 ? 'text-red-700' : 'text-blue-700'}`}>
                            ⏱️ Thời gian còn lại:
                        </span>
                        <span className={`text-2xl font-bold ${countdown < 60 ? 'text-red-600' : 'text-blue-600'}`}>
                            {formatTime(countdown)}
                        </span>
                    </div>
                </div>

                <div className="grid md:grid-cols-2 gap-6">
                    {/* QR Code */}
                    <div className="flex flex-col items-center">
                        <div className="bg-white p-4 rounded-xl shadow-lg border-4 border-blue-500 mb-4">
                            <img
                                src={qrCodeUrl}
                                alt="VietQR Code"
                                className="w-64 h-64 object-contain"
                                onError={(e) => {
                                    // Fallback if QR fails to load
                                    e.currentTarget.src = 'data:image/svg+xml,' + encodeURIComponent(`
                    <svg width="256" height="256" xmlns="http://www.w3.org/2000/svg">
                      <rect width="256" height="256" fill="#f0f0f0"/>
                      <text x="128" y="128" text-anchor="middle" font-size="16" fill="#666">QR Code Demo</text>
                    </svg>
                  `);
                                }}
                            />
                        </div>
                        <p className="text-sm text-gray-500 text-center">
                            Mở app ngân hàng và quét mã QR
                        </p>
                    </div>

                    {/* Payment Info */}
                    <div className="space-y-4">
                        <div className="bg-gradient-to-r from-blue-50 to-cyan-50 rounded-lg p-4">
                            <h3 className="font-bold text-gray-800 mb-3">Thông tin chuyển khoản</h3>

                            <div className="space-y-3">
                                <div>
                                    <p className="text-xs text-gray-500">Ngân hàng</p>
                                    <p className="font-semibold text-gray-800">{bankCode === 'VCB' ? 'Vietcombank' : bankCode}</p>
                                </div>

                                <div>
                                    <p className="text-xs text-gray-500">Số tài khoản</p>
                                    <p className="font-semibold text-gray-800 font-mono">{accountNo}</p>
                                </div>

                                <div>
                                    <p className="text-xs text-gray-500">Tên tài khoản</p>
                                    <p className="font-semibold text-gray-800">{accountName}</p>
                                </div>

                                <div className="pt-3 border-t border-blue-200">
                                    <p className="text-xs text-gray-500">Số tiền</p>
                                    <p className="text-2xl font-bold text-blue-600">{formatCurrency(amount || '0')}</p>
                                </div>

                                <div>
                                    <p className="text-xs text-gray-500">Nội dung</p>
                                    <p className="font-semibold text-gray-800 text-sm break-all">{orderInfo}</p>
                                </div>

                                <div>
                                    <p className="text-xs text-gray-500">Mã giao dịch</p>
                                    <p className="font-mono text-xs text-gray-600">{orderId}</p>
                                </div>
                            </div>
                        </div>

                        {/* Demo Warning */}
                        <div className="bg-yellow-50 border-l-4 border-yellow-400 p-3">
                            <p className="text-xs text-yellow-800">
                                <span className="font-semibold">💡 Demo:</span> QR code được tạo từ VietQR API. Click "Đã chuyển khoản" để giả lập thanh toán thành công.
                            </p>
                        </div>
                    </div>
                </div>

                {/* Action Buttons */}
                <div className="mt-6 space-y-3">
                    <button
                        onClick={handleConfirm}
                        className="w-full bg-gradient-to-r from-blue-500 to-cyan-600 text-white py-4 rounded-xl font-semibold text-lg hover:from-blue-600 hover:to-cyan-700 transition shadow-lg hover:shadow-xl"
                    >
                        ✓ Đã chuyển khoản
                    </button>

                    <button
                        onClick={handleCancel}
                        className="w-full bg-white border-2 border-gray-300 text-gray-700 py-4 rounded-xl font-semibold hover:bg-gray-50 transition"
                    >
                        Hủy giao dịch
                    </button>
                </div>

                {/* Instructions */}
                <div className="mt-6 bg-gray-50 rounded-lg p-4">
                    <h4 className="font-semibold text-gray-800 mb-2">📱 Hướng dẫn thanh toán:</h4>
                    <ol className="text-sm text-gray-600 space-y-1 list-decimal list-inside">
                        <li>Mở app ngân hàng của bạn</li>
                        <li>Chọn chức năng "Quét QR" hoặc "Chuyển khoản QR"</li>
                        <li>Quét mã QR phía trên</li>
                        <li>Xác nhận thông tin và hoàn tất thanh toán</li>
                        <li>Quay lại trang này và click "Đã chuyển khoản"</li>
                    </ol>
                </div>
            </div>
        </div>
    );
}
