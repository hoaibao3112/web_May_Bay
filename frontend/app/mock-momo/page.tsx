'use client';

import { useEffect, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';

export default function MockMoMoPage() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const [countdown, setCountdown] = useState(3);
    const [status, setStatus] = useState<'login' | 'pending' | 'success' | 'cancelled'>('login');
    const [pin, setPin] = useState('');

    const amount = searchParams.get('amount');
    const orderId = searchParams.get('orderId');
    const orderInfo = searchParams.get('orderInfo');

    useEffect(() => {
        if (status === 'success') {
            const timer = setInterval(() => {
                setCountdown(prev => {
                    if (prev <= 1) {
                        clearInterval(timer);
                        // Redirect to success page
                        window.location.href = `http://localhost:5000/payments/momo-return?orderId=${orderId}&resultCode=0&message=Successful`;
                        return 0;
                    }
                    return prev - 1;
                });
            }, 1000);
            return () => clearInterval(timer);
        } else if (status === 'cancelled') {
            const timer = setInterval(() => {
                setCountdown(prev => {
                    if (prev <= 1) {
                        clearInterval(timer);
                        // Redirect to failure page
                        window.location.href = `http://localhost:5000/payments/momo-return?orderId=${orderId}&resultCode=1006&message=Transaction cancelled by user`;
                        return 0;
                    }
                    return prev - 1;
                });
            }, 1000);
            return () => clearInterval(timer);
        }
    }, [status, orderId]);

    const handlePinChange = (value: string) => {
        if (value.length <= 6 && /^\d*$/.test(value)) {
            setPin(value);
        }
    };

    const handleLogin = () => {
        // Accept any 6-digit PIN for demo
        if (pin.length === 6) {
            setStatus('pending');
        }
    };

    const handleConfirm = () => {
        setStatus('success');
    };

    const handleCancel = () => {
        setStatus('cancelled');
    };

    const formatCurrency = (amount: string) => {
        return new Intl.NumberFormat('vi-VN', {
            style: 'currency',
            currency: 'VND',
        }).format(Number(amount));
    };

    if (status === 'success') {
        return (
            <div className="min-h-screen bg-gradient-to-br from-pink-500 to-purple-600 flex items-center justify-center p-4">
                <div className="bg-white rounded-2xl shadow-2xl p-8 max-w-md w-full text-center">
                    <div className="mb-6">
                        <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4 animate-bounce">
                            <svg className="w-12 h-12 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                            </svg>
                        </div>
                        <h2 className="text-2xl font-bold text-gray-800 mb-2">Thanh toán thành công!</h2>
                        <p className="text-gray-600">Giao dịch đã được xử lý thành công</p>
                    </div>

                    <div className="bg-pink-50 rounded-lg p-4 mb-6">
                        <p className="text-sm text-gray-600 mb-1">Số tiền</p>
                        <p className="text-2xl font-bold text-pink-600">{formatCurrency(amount || '0')}</p>
                    </div>

                    <p className="text-gray-500 text-sm">
                        Chuyển hướng sau {countdown} giây...
                    </p>
                </div>
            </div>
        );
    }

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
                        Chuyển hướng sau {countdown} giây...
                    </p>
                </div>
            </div>
        );
    }

    // Login/PIN Entry Screen
    if (status === 'login') {
        return (
            <div className="min-h-screen bg-gradient-to-br from-pink-500 to-purple-600 flex items-center justify-center p-4">
                <div className="bg-white rounded-2xl shadow-2xl p-8 max-w-md w-full">
                    {/* Header */}
                    <div className="text-center mb-8">
                        <img
                            src="https://upload.wikimedia.org/wikipedia/vi/f/fe/MoMo_Logo.png"
                            alt="MoMo"
                            className="h-16 w-16 mx-auto mb-4 rounded-xl"
                        />
                        <h1 className="text-2xl font-bold text-gray-800">Ví MoMo</h1>
                        <p className="text-gray-600 text-sm mt-2">Nhập mã PIN để tiếp tục</p>
                    </div>

                    {/* User Info */}
                    <div className="bg-gray-50 rounded-lg p-4 mb-6">
                        <div className="flex items-center gap-3">
                            <div className="w-12 h-12 bg-pink-500 rounded-full flex items-center justify-center text-white font-bold">
                                HB
                            </div>
                            <div>
                                <p className="font-semibold text-gray-800">Demo User</p>
                                <p className="text-sm text-gray-600">0123 456 789</p>
                            </div>
                        </div>
                    </div>

                    {/* Payment Amount Preview */}
                    <div className="bg-pink-50 rounded-lg p-4 mb-6 text-center">
                        <p className="text-sm text-gray-600 mb-1">Số tiền giao dịch</p>
                        <p className="text-2xl font-bold text-pink-600">{formatCurrency(amount || '0')}</p>
                    </div>

                    {/* PIN Input */}
                    <div className="mb-6">
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            Mã PIN (6 chữ số)
                        </label>
                        <input
                            type="password"
                            inputMode="numeric"
                            maxLength={6}
                            value={pin}
                            onChange={(e) => handlePinChange(e.target.value)}
                            placeholder="••••••"
                            className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg text-center text-2xl tracking-widest focus:border-pink-500 focus:outline-none"
                        />
                        <p className="text-xs text-gray-500 mt-2 text-center">
                            💡 Demo: Nhập bất kỳ 6 số nào (VD: 123456)
                        </p>
                    </div>

                    {/* Login Button */}
                    <button
                        onClick={handleLogin}
                        disabled={pin.length !== 6}
                        className="w-full bg-gradient-to-r from-pink-500 to-purple-600 text-white py-4 rounded-xl font-semibold text-lg hover:from-pink-600 hover:to-purple-700 transition shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        {pin.length === 6 ? '✓ Xác nhận' : `Nhập PIN (${pin.length}/6)`}
                    </button>

                    {/* Quick PIN Buttons for Demo */}
                    <div className="mt-4 flex gap-2">
                        <button
                            onClick={() => setPin('123456')}
                            className="flex-1 bg-gray-100 text-gray-700 py-2 px-3 rounded-lg text-sm hover:bg-gray-200 transition"
                        >
                            Quick Fill
                        </button>
                        <button
                            onClick={() => setPin('')}
                            className="flex-1 bg-gray-100 text-gray-700 py-2 px-3 rounded-lg text-sm hover:bg-gray-200 transition"
                        >
                            Clear
                        </button>
                    </div>

                    {/* Demo Note */}
                    <div className="mt-6 bg-yellow-50 border-l-4 border-yellow-400 p-3">
                        <p className="text-xs text-yellow-800">
                            <span className="font-semibold">💡 Chế độ Demo:</span> Đây là màn hình giả lập. Mọi mã PIN đều được chấp nhận.
                        </p>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-pink-500 to-purple-600 flex items-center justify-center p-4">
            <div className="bg-white rounded-2xl shadow-2xl p-8 max-w-md w-full">
                {/* Header */}
                <div className="text-center mb-8">
                    <img
                        src="https://upload.wikimedia.org/wikipedia/vi/f/fe/MoMo_Logo.png"
                        alt="MoMo"
                        className="h-16 w-16 mx-auto mb-4 rounded-xl"
                    />
                    <h1 className="text-2xl font-bold text-gray-800">Ví MoMo</h1>
                    <p className="text-gray-600 text-sm mt-2">Xác nhận thanh toán</p>
                </div>

                {/* Payment Info */}
                <div className="bg-gradient-to-r from-pink-50 to-purple-50 rounded-xl p-6 mb-6">
                    <div className="flex justify-between items-start mb-4">
                        <div>
                            <p className="text-sm text-gray-600">Thông tin đơn hàng</p>
                            <p className="font-semibold text-gray-800 mt-1">{orderInfo || 'Thanh toán đơn hàng'}</p>
                        </div>
                    </div>

                    <div className="border-t border-pink-200 pt-4 mt-4">
                        <p className="text-sm text-gray-600 mb-2">Số tiền thanh toán</p>
                        <p className="text-3xl font-bold text-pink-600">{formatCurrency(amount || '0')}</p>
                    </div>

                    <div className="mt-4 pt-4 border-t border-pink-200">
                        <p className="text-xs text-gray-500">Mã giao dịch: {orderId}</p>
                    </div>
                </div>

                {/* Mock User Info */}
                <div className="bg-gray-50 rounded-lg p-4 mb-6">
                    <div className="flex items-center gap-3">
                        <div className="w-12 h-12 bg-pink-500 rounded-full flex items-center justify-center text-white font-bold">
                            HB
                        </div>
                        <div>
                            <p className="font-semibold text-gray-800">Demo User</p>
                            <p className="text-sm text-gray-600">0123 456 789</p>
                            <p className="text-xs text-green-600 mt-1">✓ Số dư khả dụng</p>
                        </div>
                    </div>
                </div>

                {/* Warning */}
                <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4 mb-6">
                    <p className="text-sm text-yellow-800">
                        <span className="font-semibold">💡 Chế độ Demo:</span> Đây là trang giả lập MoMo cho mục đích demo đồ án. Không có giao dịch thật nào được thực hiện.
                    </p>
                </div>

                {/* Action Buttons */}
                <div className="space-y-3">
                    <button
                        onClick={handleConfirm}
                        className="w-full bg-gradient-to-r from-pink-500 to-purple-600 text-white py-4 rounded-xl font-semibold text-lg hover:from-pink-600 hover:to-purple-700 transition shadow-lg hover:shadow-xl"
                    >
                        ✓ Xác nhận thanh toán
                    </button>

                    <button
                        onClick={handleCancel}
                        className="w-full bg-white border-2 border-gray-300 text-gray-700 py-4 rounded-xl font-semibold hover:bg-gray-50 transition"
                    >
                        Hủy giao dịch
                    </button>
                </div>

                {/* Footer */}
                <p className="text-center text-xs text-gray-500 mt-6">
                    Giao dịch được bảo mật bởi MoMo Wallet
                </p>
            </div>
        </div>
    );
}
