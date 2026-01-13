'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

interface BookingSearch {
  maDatCho: string;
  email: string;
}

export default function QuanLyDatChoPage() {
  const router = useRouter();
  const [searchForm, setSearchForm] = useState<BookingSearch>({
    maDatCho: '',
    email: '',
  });
  const [loading, setLoading] = useState(false);
  const [booking, setBooking] = useState<any>(null);
  const [error, setError] = useState('');

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setBooking(null);

    try {
      const res = await fetch(`http://localhost:5000/api/bookings/pnr/${searchForm.maDatCho}`);

      if (!res.ok) {
        throw new Error('Không tìm thấy đặt chỗ');
      }

      const data = await res.json();

      // Verify email matches
      if (data.thongTinLienHe.email.toLowerCase() !== searchForm.email.toLowerCase()) {
        throw new Error('Email không khớp với đặt chỗ');
      }

      setBooking(data);
    } catch (err: any) {
      setError(err.message || 'Có lỗi xảy ra');
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

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'DA_XUAT_VE':
        return 'bg-green-100 text-green-700';
      case 'DA_THANH_TOAN':
        return 'bg-blue-100 text-blue-700';
      case 'CHO_THANH_TOAN':
        return 'bg-yellow-100 text-yellow-700';
      case 'DA_HUY':
        return 'bg-red-100 text-red-700';
      default:
        return 'bg-gray-100 text-gray-700';
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'DA_XUAT_VE':
        return 'Đã xuất vé';
      case 'DA_THANH_TOAN':
        return 'Đã thanh toán';
      case 'CHO_THANH_TOAN':
        return 'Chờ thanh toán';
      case 'DA_HUY':
        return 'Đã hủy';
      case 'HET_HAN':
        return 'Hết hạn';
      default:
        return status;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <nav className="bg-white shadow-sm">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 cursor-pointer" onClick={() => router.push('/')}>
              <span className="text-2xl">✈️</span>
              <span className="text-xl font-bold text-blue-600">BayNhanh</span>
            </div>
            <div className="flex items-center gap-6">
              <a href="/" className="text-gray-600 hover:text-blue-600">Trang chủ</a>
              <a href="/auth/login" className="text-blue-600 font-medium">Đăng nhập</a>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <div className="bg-gradient-to-r from-blue-600 to-blue-800 text-white py-12">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-4xl font-bold mb-2">Quản lý đặt chỗ của tôi</h1>
          <p className="text-lg">
            Xem lại lịch trình, thay đổi chuyến bay hoặc hủy đặt chỗ nhanh chóng
          </p>
        </div>
      </div>

      <div className="container mx-auto px-4 py-12">
        <div className="max-w-2xl mx-auto">
          {/* Search Form */}
          <div className="bg-white rounded-lg shadow-lg p-8 mb-8">
            <h2 className="text-2xl font-bold mb-6 text-center">Tra cứu đặt chỗ</h2>

            <form onSubmit={handleSearch} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Mã đặt chỗ (PNR) <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={searchForm.maDatCho}
                  onChange={(e) => setSearchForm({ ...searchForm, maDatCho: e.target.value.toUpperCase() })}
                  placeholder="VD: VN-8X92B"
                  className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:ring-2 focus:ring-blue-500 focus:border-transparent uppercase font-mono"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Email liên hệ <span className="text-red-500">*</span>
                </label>
                <input
                  type="email"
                  value={searchForm.email}
                  onChange={(e) => setSearchForm({ ...searchForm, email: e.target.value })}
                  placeholder="email@example.com"
                  className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  required
                />
                <p className="text-xs text-gray-500 mt-1">
                  Nhập email bạn đã dùng khi đặt vé
                </p>
              </div>

              {error && (
                <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                  <p className="text-red-700 text-sm">❌ {error}</p>
                </div>
              )}

              <button
                type="submit"
                disabled={loading}
                className="w-full bg-blue-600 text-white py-3 rounded-lg font-semibold hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition"
              >
                {loading ? '🔍 Đang tìm kiếm...' : '🔍 Tìm đặt chỗ'}
              </button>
            </form>
          </div>

          {/* Booking Details */}
          {booking && (
            <div className="bg-white rounded-lg shadow-lg p-8">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold">Chi tiết đặt chỗ</h2>
                <span className={`px-4 py-2 rounded-full font-semibold ${getStatusColor(booking.trangThai)}`}>
                  {getStatusText(booking.trangThai)}
                </span>
              </div>

              {/* PNR Code */}
              <div className="bg-blue-50 border-2 border-blue-500 rounded-lg p-4 mb-6">
                <p className="text-sm text-gray-600">Mã đặt chỗ (PNR)</p>
                <p className="text-3xl font-bold text-blue-600">{booking.maDatCho}</p>
              </div>

              {/* Flight Info */}
              <div className="mb-6">
                <h3 className="font-bold text-lg mb-3">Thông tin chuyến bay</h3>
                <div className="bg-gray-50 rounded-lg p-4">
                  <div className="flex items-center justify-between mb-4">
                    <div>
                      <p className="font-bold">{booking.changBay.chuyenBay.hang.tenHang}</p>
                      <p className="text-sm text-gray-600">{booking.changBay.chuyenBay.soHieu}</p>
                    </div>
                    <div className="text-right">
                      <p className="text-sm text-gray-600">Ngày bay</p>
                      <p className="font-semibold">
                        {new Date(booking.changBay.ngayKhoiHanh).toLocaleDateString('vi-VN')}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center">
                    <div className="flex-1">
                      <p className="text-2xl font-bold">{booking.changBay.gioKhoiHanh}</p>
                      <p className="font-semibold">{booking.changBay.sanBayDi.maIata}</p>
                      <p className="text-sm text-gray-600">{booking.changBay.sanBayDi.thanhPho}</p>
                    </div>

                    <div className="flex-1 px-4">
                      <div className="border-t-2 border-gray-300 border-dashed relative">
                        <span className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-white px-2">
                          ✈️
                        </span>
                      </div>
                    </div>

                    <div className="flex-1 text-right">
                      <p className="text-2xl font-bold">{booking.changBay.gioDen}</p>
                      <p className="font-semibold">{booking.changBay.sanBayDen.maIata}</p>
                      <p className="text-sm text-gray-600">{booking.changBay.sanBayDen.thanhPho}</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Passengers */}
              <div className="mb-6">
                <h3 className="font-bold text-lg mb-3">Hành khách</h3>
                <div className="bg-gray-50 rounded-lg p-4 space-y-2">
                  {booking.hanhKhach.map((passenger: any, index: number) => (
                    <div key={index} className="flex items-center justify-between">
                      <span>
                        {index + 1}. {passenger.ho} {passenger.ten}
                      </span>
                      {passenger.ve?.[0]?.soVe && (
                        <span className="text-sm text-gray-600 font-mono">
                          Vé: {passenger.ve[0].soVe}
                        </span>
                      )}
                    </div>
                  ))}
                </div>
              </div>

              {/* Payment Info */}
              <div className="mb-6">
                <h3 className="font-bold text-lg mb-3">Thông tin thanh toán</h3>
                <div className="bg-gray-50 rounded-lg p-4">
                  <div className="flex justify-between mb-2">
                    <span className="text-gray-600">Tổng tiền</span>
                    <span className="font-bold text-xl text-blue-600">
                      {formatCurrency(booking.tongTien)}
                    </span>
                  </div>
                </div>
              </div>

              {/* Actions */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {booking.trangThai === 'DA_XUAT_VE' && (
                  <>
                    <button
                      onClick={() => window.print()}
                      className="bg-gray-600 text-white py-3 rounded-lg font-semibold hover:bg-gray-700 transition"
                    >
                      🖨️ In vé
                    </button>
                    <button
                      onClick={() => alert('Tính năng đang phát triển')}
                      className="bg-blue-600 text-white py-3 rounded-lg font-semibold hover:bg-blue-700 transition"
                    >
                      📧 Gửi lại email
                    </button>
                  </>
                )}
                {booking.trangThai === 'CHO_THANH_TOAN' && (
                  <button
                    onClick={() => router.push(`/thanh-toan?bookingId=${booking.id}&maDatCho=${booking.maDatCho}`)}
                    className="md:col-span-2 bg-green-600 text-white py-3 rounded-lg font-semibold hover:bg-green-700 transition"
                  >
                    💳 Tiếp tục thanh toán
                  </button>
                )}
              </div>
            </div>
          )}

          {/* Help Section */}
          {!booking && (
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
              <h3 className="font-bold text-lg mb-3">💡 Cần trợ giúp?</h3>
              <ul className="space-y-2 text-sm text-gray-700">
                <li>• Mã đặt chỗ (PNR) gồm 6-7 ký tự, được gửi qua email sau khi đặt vé</li>
                <li>• Nếu không tìm thấy email, kiểm tra hộp thư spam/rác</li>
                <li>• Liên hệ hotline: <strong>1900-xxxx</strong> (8:00 - 22:00 hàng ngày)</li>
                <li>• Email hỗ trợ: <strong>support@baynhanh.vn</strong></li>
              </ul>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
