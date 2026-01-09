'use client';

import { useState, useEffect, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';

function MockZaloPayContent() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const [processing, setProcessing] = useState(false);
    const [pin, setPin] = useState('');
    const [showPinScreen, setShowPinScreen] = useState(true);

    const amount = searchParams.get('amount') || '0';
    const orderInfo = searchParams.get('orderInfo') || 'Thanh toán đơn hàng';
    const orderId = searchParams.get('orderId') || '';

    const formatCurrency = (amount: string) => {
        return new Intl.NumberFormat('vi-VN', {
            style: 'currency',
            currency: 'VND',
        }).format(parseInt(amount));
    };

    const handlePinChange = (value: string) => {
        if (value.length <= 6) {
            setPin(value);
            if (value.length === 6) {
                setTimeout(() => handleLogin(), 500);
            }
        }
    };

    const handleLogin = () => {
        setShowPinScreen(false);
    };

    const handlePayment = (action: 'success' | 'cancel') => {
        setProcessing(true);

        setTimeout(() => {
            if (action === 'success') {
                // Redirect to confirmation page
                router.push('/hoat-dong/xac-nhan?status=success');
            } else {
                router.push('/hoat-dong/dat-tour?status=cancelled');
            }
        }, 1500);
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-blue-500 via-blue-600 to-indigo-700 flex items-center justify-center p-4">
            <div className="max-w-md w-full">
                {showPinScreen ? (
                    /* PIN Entry Screen */
                    <div className="bg-white rounded-3xl shadow-2xl overflow-hidden">
                        {/* Header */}
                        <div className="bg-gradient-to-r from-blue-600 to-indigo-600 p-6 text-center">
                            <div className="w-20 h-20 bg-white rounded-full mx-auto mb-4 flex items-center justify-center">
                                <svg className="w-12 h-12 text-blue-600" fill="currentColor" viewBox="0 0 24 24">
                                    <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8zm-1-13h2v6h-2zm0 8h2v2h-2z" />
                                </svg>
                            </div>
                            <h1 className="text-2xl font-bold text-white">ZaloPay</h1>
                            <p className="text-blue-100 text-sm mt-1">Ví điện tử quốc dân</p>
                        </div>

                        {/* PIN Input */}
                        <div className="p-8">
                            <h2 className="text-xl font-bold text-gray-800 mb-2 text-center">Xác thực thanh toán</h2>
                            <p className="text-gray-600 text-sm mb-6 text-center">
                                Nhập mã PIN ZaloPay của bạn
                            </p>

                            {/* PIN Display */}
                            <div className="flex justify-center gap-3 mb-8">
                                {[0, 1, 2, 3, 4, 5].map((i) => (
                                    <div
                                        key={i}
                                        className={`w-12 h-12 rounded-xl border-2 flex items-center justify-center text-2xl font-bold transition ${pin.length > i
                                                ? 'border-blue-600 bg-blue-50 text-blue-600'
                                                : 'border-gray-300 bg-gray-50 text-gray-400'
                                            }`}
                                    >
                                        {pin.length > i ? '●' : ''}
                                    </div>
                                ))}
                            </div>

                            {/* PIN Input Field */}
                            <input
                                type="number"
                                value={pin}
                                onChange={(e) => handlePinChange(e.target.value)}
                                placeholder="Nhập 6 số PIN"
                                maxLength={6}
                                className="w-full px-4 py-3 border-2 border-gray-300 rounded-xl text-center text-lg font-semibold focus:border-blue-600 focus:ring-2 focus:ring-blue-200 outline-none mb-4"
                                autoFocus
                            />

                            {/* Quick Fill Buttons */}
                            <div className="grid grid-cols-3 gap-2 mb-6">
                                <button
                                    onClick={() => handlePinChange('123456')}
                                    className="px-4 py-2 bg-blue-100 text-blue-700 rounded-lg text-sm font-medium hover:bg-blue-200 transition"
                                >
                                    123456
                                </button>
                                <button
                                    onClick={() => handlePinChange('111111')}
                                    className="px-4 py-2 bg-blue-100 text-blue-700 rounded-lg text-sm font-medium hover:bg-blue-200 transition"
                                >
                                    111111
                                </button>
                                <button
                                    onClick={() => setPin('')}
                                    className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg text-sm font-medium hover:bg-gray-300 transition"
                                >
                                    Xóa
                                </button>
                            </div>

                            {/* Demo Note */}
                            <div className="bg-amber-50 border border-amber-200 rounded-xl p-4">
                                <p className="text-amber-800 text-sm">
                                    <strong>💡 Demo Mode:</strong> Nhập bất kỳ 6 số nào để tiếp tục
                                </p>
                            </div>
                        </div>
                    </div>
                ) : (
                    /* Payment Confirmation Screen */
                    <div className="bg-white rounded-3xl shadow-2xl overflow-hidden">
                        {/* Header */}
                        <div className="bg-gradient-to-r from-blue-600 to-indigo-600 p-6">
                            <div className="flex items-center justify-between text-white">
                                <div className="flex items-center gap-3">
                                    <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center">
                                        <svg className="w-7 h-7 text-blue-600" fill="currentColor" viewBox="0 0 24 24">
                                            <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8z" />
                                        </svg>
                                    </div>
                                    <div>
                                        <div className="font-bold">ZaloPay</div>
                                        <div className="text-xs text-blue-100">Xác nhận thanh toán</div>
                                    </div>
                                </div>
                                <button
                                    onClick={() => !processing && handlePayment('cancel')}
                                    className="text-white hover:bg-white/20 rounded-full p-2 transition"
                                    disabled={processing}
                                >
                                    ✕
                                </button>
                            </div>
                        </div>

                        {/* Payment Details */}
                        <div className="p-6">
                            {/* Merchant Info */}
                            <div className="flex items-center gap-4 mb-6 pb-6 border-b">
                                <div className="w-16 h-16 bg-gradient-to-br from-pink-500 to-rose-500 rounded-2xl flex items-center justify-center text-white text-2xl font-bold shadow-lg">
                                    DL
                                </div>
                                <div className="flex-1">
                                    <div className="font-bold text-gray-900">Công ty Du lịch</div>
                                    <div className="text-sm text-gray-600">{orderInfo}</div>
                                </div>
                            </div>

                            {/* Amount */}
                            <div className="text-center mb-8">
                                <div className="text-sm text-gray-600 mb-1">Số tiền thanh toán</div>
                                <div className="text-4xl font-bold text-blue-600 mb-1">
                                    {formatCurrency(amount)}
                                </div>
                                <div className="text-xs text-gray-500">Mã đơn hàng: {orderId}</div>
                            </div>

                            {/* Payment Source */}
                            <div className="bg-gray-50 rounded-2xl p-4 mb-6">
                                <div className="flex items-center justify-between mb-3">
                                    <span className="text-sm text-gray-600">Nguồn tiền</span>
                                    <button className="text-blue-600 text-sm font-medium">Thay đổi</button>
                                </div>
                                <div className="flex items-center gap-3">
                                    <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-xl flex items-center justify-center text-white font-bold">
                                        Z
                                    </div>
                                    <div className="flex-1">
                                        <div className="font-semibold text-gray-900">Ví ZaloPay</div>
                                        <div className="text-sm text-gray-600">Số dư: ₫9,999,999</div>
                                    </div>
                                    <svg className="w-5 h-5 text-green-500" fill="currentColor" viewBox="0 0 20 20">
                                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" />
                                    </svg>
                                </div>
                            </div>

                            {/* Action Buttons */}
                            <div className="space-y-3">
                                <button
                                    onClick={() => handlePayment('success')}
                                    disabled={processing}
                                    className="w-full py-4 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-2xl font-bold text-lg hover:from-blue-700 hover:to-indigo-700 transition shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
                                >
                                    {processing ? (
                                        <span className="flex items-center justify-center gap-2">
                                            <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                                            Đang xử lý...
                                        </span>
                                    ) : (
                                        <>✓ Xác nhận thanh toán</>
                                    )}
                                </button>

                                <button
                                    onClick={() => handlePayment('cancel')}
                                    disabled={processing}
                                    className="w-full py-4 border-2 border-gray-300 text-gray-700 rounded-2xl font-semibold hover:bg-gray-50 transition disabled:opacity-50"
                                >
                                    Hủy giao dịch
                                </button>
                            </div>

                            {/* Security Note */}
                            <div className="mt-6 flex items-start gap-2 text-xs text-gray-500">
                                <svg className="w-4 h-4 text-green-500 flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                                    <path fillRule="evenodd" d="M2.166 4.999A11.954 11.954 0 0010 1.944 11.954 11.954 0 0017.834 5c.11.65.166 1.32.166 2.001 0 5.225-3.34 9.67-8 11.317C5.34 16.67 2 12.225 2 7c0-.682.057-1.35.166-2.001zm11.541 3.708a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" />
                                </svg>
                                <span>Giao dịch được bảo mật bởi công nghệ mã hóa SSL 256-bit</span>
                            </div>
                        </div>

                        {/* Demo Badge */}
                        <div className="bg-gradient-to-r from-amber-400 to-orange-400 p-3 text-center">
                            <span className="text-sm font-bold text-white">🎭 DEMO MODE - Đây là trang thanh toán mô phỏng</span>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}

export default function MockZaloPayPage() {
    return (
        <Suspense fallback={<div className="min-h-screen flex items-center justify-center">Loading...</div>}>
            <MockZaloPayContent />
        </Suspense>
    );
}
