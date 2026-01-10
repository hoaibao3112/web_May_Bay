'use client';

import { useState, useEffect, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';

interface BookingDetails {
  id: number;
  maDatCho: string;
  trangThai: string;
  tongTien: number;
  changBay: {
    chuyenBay: {
      soHieu: string;
      hang: {
        tenHang: string;
        maHang: string;
      };
    };
    sanBayDi: {
      maIata: string;
      tenSanBay: string;
      thanhPho: string;
    };
    sanBayDen: {
      maIata: string;
      tenSanBay: string;
      thanhPho: string;
    };
    ngayKhoiHanh: string;
    gioKhoiHanh: string;
    gioDen: string;
  };
  hanhKhach: Array<{
    ho: string;
    ten: string;
    ve?: {
      soVe: string;
    }[];
  }>;
  thongTinLienHe: {
    email: string;
    soDienThoai: string;
  };
}

function XacNhanContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [booking, setBooking] = useState<BookingDetails | null>(null);
  const [loading, setLoading] = useState(true);

  const maDatCho = searchParams.get('maDatCho');

  useEffect(() => {
    if (maDatCho) {
      fetchBooking();
    }
  }, [maDatCho]);

  const fetchBooking = async () => {
    try {
      const res = await fetch(`http://localhost:5000/bookings/pnr/${maDatCho}`);
      const data = await res.json();
      setBooking(data);
    } catch (error) {
      console.error('Lỗi:', error);
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
      <nav className="bg-white shadow-sm">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="text-2xl">✈️</span>
              <span className="text-xl font-bold text-blue-600">BayNhanh</span>
            </div>
            <button
              onClick={() => router.push('/')}
              className="text-blue-600 hover:text-blue-700 font-medium"
            >
              Về trang chủ
            </button>
          </div>
        </div>
      </nav>

      <div className="container mx-auto px-4 py-12">
        {/* Success Message */}
        <div className="max-w-4xl mx-auto">
          <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
            {/* Success Header */}
            <div className="bg-gradient-to-r from-green-500 to-green-600 text-white p-8 text-center">
              <div className="text-7xl mb-4 animate-bounce">✅</div>
              <h1 className="text-3xl font-bold mb-2">Đặt chỗ thành công!</h1>
              <p className="text-lg">
                Cảm ơn bạn đã tin tưởng sử dụng dịch vụ của BayNhanh. Vé điện tử đã được gửi đến email của bạn.
              </p>
            </div>

            {/* Booking Info */}
            <div className="p-8">
              {/* PNR Code */}
              <div className="bg-blue-50 border-2 border-blue-500 rounded-lg p-6 mb-6">
                <p className="text-sm text-gray-600 mb-2">Mã đặt chỗ của bạn (PNR)</p>
                <div className="flex items-center justify-between">
                  <p className="text-4xl font-bold text-blue-600">{booking.maDatCho}</p>
                  <button
                    onClick={() => {
                      navigator.clipboard.writeText(booking.maDatCho);
                      alert('Đã sao chép mã đặt chỗ');
                    }}
                    className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 text-sm"
                  >
                    📋 Sao chép
                  </button>
                </div>
                <p className="text-sm text-gray-600 mt-2">
                  Vui lòng giữ mã này để tra cứu và quản lý đặt chỗ
                </p>
              </div>

              {/* Flight Details */}
              <div className="mb-6">
                <h2 className="text-xl font-bold mb-4">Chi tiết chuyến bay</h2>
                <div className="bg-gray-50 rounded-lg p-6">
                  <div className="flex items-center justify-between mb-6">
                    <div>
                      <div className="w-12 h-12 bg-blue-600 rounded-full flex items-center justify-center text-white text-2xl mb-2">
                        ✈️
                      </div>
                      <p className="font-bold">{booking.changBay.chuyenBay.hang.tenHang}</p>
                      <p className="text-sm text-gray-600">{booking.changBay.chuyenBay.soHieu}</p>
                    </div>
                    <div className="text-right">
                      <p className="text-sm text-gray-600">Ngày bay</p>
                      <p className="font-semibold">
                        {new Date(booking.changBay.ngayKhoiHanh).toLocaleDateString('vi-VN', {
                          weekday: 'long',
                          year: 'numeric',
                          month: 'long',
                          day: 'numeric',
                        })}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center">
                    <div className="flex-1">
                      <p className="text-3xl font-bold">{booking.changBay.gioKhoiHanh}</p>
                      <p className="font-semibold mt-1">{booking.changBay.sanBayDi.maIata}</p>
                      <p className="text-sm text-gray-600">{booking.changBay.sanBayDi.tenSanBay}</p>
                      <p className="text-sm text-gray-600">{booking.changBay.sanBayDi.thanhPho}</p>
                    </div>

                    <div className="flex-1 px-6">
                      <div className="relative">
                        <div className="border-t-2 border-blue-500 border-dashed"></div>
                        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-white px-2">
                          <span className="text-3xl">✈️</span>
                        </div>
                      </div>
                      <p className="text-center text-sm text-gray-600 mt-2">Bay thẳng</p>
                    </div>

                    <div className="flex-1 text-right">
                      <p className="text-3xl font-bold">{booking.changBay.gioDen}</p>
                      <p className="font-semibold mt-1">{booking.changBay.sanBayDen.maIata}</p>
                      <p className="text-sm text-gray-600">{booking.changBay.sanBayDen.tenSanBay}</p>
                      <p className="text-sm text-gray-600">{booking.changBay.sanBayDen.thanhPho}</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Passengers */}
              <div className="mb-6">
                <h2 className="text-xl font-bold mb-4">Thông tin hành khách</h2>
                <div className="bg-gray-50 rounded-lg overflow-hidden">
                  <table className="w-full">
                    <thead className="bg-gray-200">
                      <tr>
                        <th className="text-left p-4">Hành khách</th>
                        <th className="text-left p-4">Số vé điện tử</th>
                      </tr>
                    </thead>
                    <tbody>
                      {booking.hanhKhach.map((passenger, index) => (
                        <tr key={index} className="border-t">
                          <td className="p-4">
                            <p className="font-semibold">
                              {index + 1}. {passenger.ho} {passenger.ten}
                            </p>
                          </td>
                          <td className="p-4">
                            <p className="font-mono text-blue-600">
                              {passenger.ve?.[0]?.soVe || 'Đang xử lý...'}
                            </p>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>

              {/* Contact Info */}
              <div className="mb-6">
                <h2 className="text-xl font-bold mb-4">Thông tin liên hệ</h2>
                <div className="bg-gray-50 rounded-lg p-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <p className="text-sm text-gray-600">Email</p>
                      <p className="font-semibold">{booking.thongTinLienHe.email}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-600">Số điện thoại</p>
                      <p className="font-semibold">{booking.thongTinLienHe.soDienThoai}</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Payment Summary */}
              <div className="bg-gray-50 rounded-lg p-6 mb-6">
                <h3 className="font-bold mb-4">Tóm tắt thanh toán</h3>
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Tổng tiền đã thanh toán</span>
                    <span className="font-bold text-blue-600 text-xl">
                      {formatCurrency(booking.tongTien)}
                    </span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Trạng thái</span>
                    <span className="bg-green-100 text-green-700 px-3 py-1 rounded-full font-medium">
                      ✓ Đã thanh toán
                    </span>
                  </div>
                </div>
              </div>

              {/* Important Notes */}
              <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-6">
                <div className="flex items-start gap-3">
                  <span className="text-2xl">⚠️</span>
                  <div className="text-sm">
                    <p className="font-medium text-yellow-900 mb-2">Lưu ý quan trọng:</p>
                    <ul className="space-y-1 text-yellow-700">
                      <li>• Vui lòng có mặt tại sân bay trước giờ bay ít nhất 2 tiếng</li>
                      <li>• Mang theo giấy tờ tùy thân/hộ chiếu hợp lệ</li>
                      <li>• Kiểm tra kỹ hành lý xách tay và ký gửi theo quy định</li>
                      <li>• Liên hệ hotline 1900-xxxx nếu cần hỗ trợ</li>
                    </ul>
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <button
                  onClick={() => window.print()}
                  className="bg-gray-600 text-white py-3 rounded-lg font-semibold hover:bg-gray-700 transition"
                >
                  🖨️ In vé
                </button>
                <button
                  onClick={() => router.push('/dashboard/booking-history')}
                  className="bg-blue-600 text-white py-3 rounded-lg font-semibold hover:bg-blue-700 transition"
                >
                  📋 Quản lý đặt chỗ
                </button>
                <button
                  onClick={() => router.push('/')}
                  className="bg-green-600 text-white py-3 rounded-lg font-semibold hover:bg-green-700 transition"
                >
                  ✈️ Đặt vé mới
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function XacNhanPage() {
  return (
    <Suspense fallback={<div className="min-h-screen flex items-center justify-center">
      <div className="text-center">
        <div className="inline-block animate-spin text-6xl mb-4">✈️</div>
        <p className="text-gray-600">Đang tải...</p>
      </div>
    </div>}>
      <XacNhanContent />
    </Suspense>
  );
}
