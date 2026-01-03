'use client';

import { useState, useEffect, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';

interface Booking {
  id: number;
  maDatCho: string;
  trangThai: string;
  tongTien: number;
  thoiGianHetHan: string;
  changBay: {
    chuyenBay: {
      soHieu: string;
      hangHangKhong: {
        tenHang: string;
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
    ngayKhoiHanh: string;
    gioKhoiHanh: string;
  };
  hanhKhach: any[];
}

function ThanhToanContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [booking, setBooking] = useState<Booking | null>(null);
  const [loading, setLoading] = useState(true);
  const [processing, setProcessing] = useState(false);
  const [timeLeft, setTimeLeft] = useState(900); // 15 minutes in seconds
  const [paymentMethod, setPaymentMethod] = useState('THE_QUOC_TE');

  const bookingId = searchParams.get('bookingId');
  const maDatCho = searchParams.get('maDatCho');

  useEffect(() => {
    if (bookingId) {
      fetchBooking();
    }
  }, [bookingId]);

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          alert('Hết thời gian giữ chỗ. Đặt chỗ của bạn đã bị hủy.');
          router.push('/');
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  const fetchBooking = async () => {
    try {
      const res = await fetch(`http://localhost:3000/bookings/${bookingId}`);
      const data = await res.json();
      setBooking(data);
    } catch (error) {
      console.error('Lỗi:', error);
    } finally {
      setLoading(false);
    }
  };

  const handlePayment = async () => {
    setProcessing(true);

    try {
      // Create payment
      const paymentRes = await fetch('http://localhost:3000/payments', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          donDatVeId: bookingId,
          phuongThucThanhToan: paymentMethod,
        }),
      });

      if (!paymentRes.ok) {
        throw new Error('Thanh toán thất bại');
      }

      const payment = await paymentRes.json();

      // Mock payment callback (success)
      const callbackRes = await fetch('http://localhost:3000/payments/callback', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          maGiaoDich: payment.maGiaoDich,
          trangThai: 'THANH_CONG',
        }),
      });

      if (!callbackRes.ok) {
        throw new Error('Xác nhận thanh toán thất bại');
      }

      // Issue ticket
      const ticketRes = await fetch('http://localhost:3000/tickets/issue', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          donDatVeId: bookingId,
        }),
      });

      if (!ticketRes.ok) {
        throw new Error('Xuất vé thất bại');
      }

      // Redirect to success page
      router.push(`/xac-nhan?maDatCho=${maDatCho}`);
    } catch (error) {
      console.error('Lỗi:', error);
      alert('Thanh toán thất bại, vui lòng thử lại');
      setProcessing(false);
    }
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND',
    }).format(amount);
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="inline-block animate-spin text-6xl mb-4">⏳</div>
          <p className="text-gray-600">Đang tải thông tin đặt chỗ...</p>
        </div>
      </div>
    );
  }

  if (!booking) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="text-6xl mb-4">❌</div>
          <h2 className="text-2xl font-bold mb-2">Không tìm thấy đặt chỗ</h2>
          <button
            onClick={() => router.push('/')}
            className="mt-4 bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700"
          >
            Về trang chủ
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <nav className="bg-white shadow-sm sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="text-2xl">✈️</span>
              <span className="text-xl font-bold text-blue-600">BayNhanh</span>
            </div>
            <div className="flex items-center gap-4">
              <div className="text-sm text-gray-600">Bước 4/4: Thanh toán</div>
              <div className={`text-xl font-bold ${timeLeft < 300 ? 'text-red-600 animate-pulse' : 'text-blue-600'}`}>
                ⏱️ {formatTime(timeLeft)}
              </div>
            </div>
          </div>
        </div>
      </nav>

      <div className="container mx-auto px-4 py-8">
        {/* Timer Warning */}
        {timeLeft < 300 && (
          <div className="mb-6 bg-red-50 border-2 border-red-500 rounded-lg p-4 animate-pulse">
            <div className="flex items-center gap-3">
              <span className="text-3xl">⚠️</span>
              <div>
                <p className="font-bold text-red-900">Còn {formatTime(timeLeft)} để hoàn tất thanh toán!</p>
                <p className="text-sm text-red-700">
                  Sau thời gian này, đặt chỗ của bạn sẽ tự động bị hủy
                </p>
              </div>
            </div>
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Payment Methods */}
          <div className="lg:col-span-2 space-y-6">
            <h2 className="text-2xl font-bold">Thanh toán an toàn</h2>

            <div className="bg-white rounded-lg shadow-sm p-6">
              <h3 className="font-bold text-lg mb-4">Phương thức thanh toán</h3>

              <div className="space-y-3">
                <label className={`block border-2 rounded-lg p-4 cursor-pointer transition ${
                  paymentMethod === 'THE_QUOC_TE' ? 'border-blue-500 bg-blue-50' : 'border-gray-200 hover:border-blue-300'
                }`}>
                  <div className="flex items-center gap-4">
                    <input
                      type="radio"
                      name="payment"
                      value="THE_QUOC_TE"
                      checked={paymentMethod === 'THE_QUOC_TE'}
                      onChange={(e) => setPaymentMethod(e.target.value)}
                      className="w-5 h-5 text-blue-600"
                    />
                    <div className="flex-1">
                      <div className="flex items-center gap-3">
                        <span className="text-3xl">💳</span>
                        <div>
                          <p className="font-semibold">Thẻ quốc tế</p>
                          <p className="text-sm text-gray-600">Visa, Mastercard, JCB, AMEX</p>
                        </div>
                      </div>
                    </div>
                  </div>

                  {paymentMethod === 'THE_QUOC_TE' && (
                    <div className="mt-4 pt-4 border-t space-y-3">
                      <input
                        type="text"
                        placeholder="Số thẻ (16 chữ số)"
                        className="w-full border rounded-lg px-4 py-2"
                      />
                      <div className="grid grid-cols-2 gap-3">
                        <input
                          type="text"
                          placeholder="MM/YY"
                          className="border rounded-lg px-4 py-2"
                        />
                        <input
                          type="text"
                          placeholder="CVV/CVC"
                          className="border rounded-lg px-4 py-2"
                        />
                      </div>
                      <input
                        type="text"
                        placeholder="Tên trên thẻ"
                        className="w-full border rounded-lg px-4 py-2"
                      />
                    </div>
                  )}
                </label>

                <label className={`block border-2 rounded-lg p-4 cursor-pointer transition ${
                  paymentMethod === 'THE_ATM' ? 'border-blue-500 bg-blue-50' : 'border-gray-200 hover:border-blue-300'
                }`}>
                  <div className="flex items-center gap-4">
                    <input
                      type="radio"
                      name="payment"
                      value="THE_ATM"
                      checked={paymentMethod === 'THE_ATM'}
                      onChange={(e) => setPaymentMethod(e.target.value)}
                      className="w-5 h-5 text-blue-600"
                    />
                    <div className="flex-1">
                      <div className="flex items-center gap-3">
                        <span className="text-3xl">🏦</span>
                        <div>
                          <p className="font-semibold">Thẻ ATM/Internet Banking</p>
                          <p className="text-sm text-gray-600">Các ngân hàng Việt Nam</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </label>

                <label className={`block border-2 rounded-lg p-4 cursor-pointer transition ${
                  paymentMethod === 'VI_DIEN_TU' ? 'border-blue-500 bg-blue-50' : 'border-gray-200 hover:border-blue-300'
                }`}>
                  <div className="flex items-center gap-4">
                    <input
                      type="radio"
                      name="payment"
                      value="VI_DIEN_TU"
                      checked={paymentMethod === 'VI_DIEN_TU'}
                      onChange={(e) => setPaymentMethod(e.target.value)}
                      className="w-5 h-5 text-blue-600"
                    />
                    <div className="flex-1">
                      <div className="flex items-center gap-3">
                        <span className="text-3xl">📱</span>
                        <div>
                          <p className="font-semibold">Ví điện tử</p>
                          <p className="text-sm text-gray-600">MoMo, ZaloPay, ViettelPay</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </label>
              </div>
            </div>

            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <div className="flex items-start gap-3">
                <span className="text-2xl">🔒</span>
                <div className="text-sm">
                  <p className="font-medium text-blue-900 mb-2">Thanh toán an toàn & bảo mật</p>
                  <ul className="space-y-1 text-blue-700">
                    <li>• Thông tin thẻ được mã hóa SSL 256-bit</li>
                    <li>• Tuân thủ chuẩn bảo mật PCI DSS</li>
                    <li>• Không lưu trữ thông tin thẻ của bạn</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>

          {/* Booking Summary */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-lg shadow-sm p-6 sticky top-24">
              <h3 className="font-bold text-lg mb-4">Chi tiết đặt chỗ</h3>

              <div className="space-y-4 mb-6">
                <div className="bg-green-50 border border-green-200 rounded-lg p-3">
                  <p className="text-sm text-gray-600">Mã đặt chỗ (PNR)</p>
                  <p className="text-2xl font-bold text-green-600">{booking.maDatCho}</p>
                </div>

                <div>
                  <p className="text-sm text-gray-600">Chuyến bay</p>
                  <p className="font-semibold">{booking.changBay.chuyenBay.soHieu}</p>
                  <p className="text-sm text-gray-500">{booking.changBay.chuyenBay.hangHangKhong.tenHang}</p>
                </div>

                <div>
                  <p className="text-sm text-gray-600">Hành trình</p>
                  <p className="font-semibold">
                    {booking.changBay.sanBayDi.maIata} → {booking.changBay.sanBayDen.maIata}
                  </p>
                  <p className="text-sm">
                    {new Date(booking.changBay.ngayKhoiHanh).toLocaleDateString('vi-VN')} • {booking.changBay.gioKhoiHanh}
                  </p>
                </div>

                <div>
                  <p className="text-sm text-gray-600">Hành khách</p>
                  <p className="font-semibold">{booking.hanhKhach.length} người</p>
                </div>
              </div>

              <div className="border-t pt-4 mb-6">
                <div className="flex justify-between mb-2">
                  <span className="text-gray-600">Giá vé</span>
                  <span className="font-semibold">{formatCurrency(booking.tongTien - 300000)}</span>
                </div>
                <div className="flex justify-between mb-2">
                  <span className="text-gray-600">Thuế & phí</span>
                  <span className="font-semibold">300.000₫</span>
                </div>
                <div className="border-t pt-2 flex justify-between text-xl font-bold">
                  <span>Tổng cộng</span>
                  <span className="text-blue-600">{formatCurrency(booking.tongTien)}</span>
                </div>
              </div>

              <button
                onClick={handlePayment}
                disabled={processing}
                className="w-full bg-blue-600 text-white py-4 rounded-lg font-semibold text-lg hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition mb-3 flex items-center justify-center gap-2"
              >
                {processing ? (
                  <>
                    <span className="animate-spin">⏳</span>
                    Đang xử lý...
                  </>
                ) : (
                  <>
                    🔒 Thanh toán {formatCurrency(booking.tongTien)}
                  </>
                )}
              </button>

              <p className="text-xs text-center text-gray-500">
                Bằng việc nhấn thanh toán, bạn đồng ý với{' '}
                <a href="#" className="text-blue-600 underline">Điều khoản dịch vụ</a>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function ThanhToanPage() {
  return (
    <Suspense fallback={<div className="min-h-screen flex items-center justify-center">
      <div className="text-center">
        <div className="inline-block animate-spin text-6xl mb-4">✈️</div>
        <p className="text-gray-600">Đang tải...</p>
      </div>
    </div>}>
      <ThanhToanContent />
    </Suspense>
  );
}
