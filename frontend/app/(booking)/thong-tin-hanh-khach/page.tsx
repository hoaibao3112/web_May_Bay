'use client';

import { useState, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';

interface Passenger {
  loai: 'NGUOI_LON' | 'TRE_EM' | 'SO_SINH';
  ho: string;
  ten: string;
  ngaySinh: string;
  gioiTinh: string;
  quocTich: string;
}

function ThongTinHanhKhachContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [loading, setLoading] = useState(false);

  const seats = searchParams.get('seats')?.split(',') || [];
  const nguoiLon = parseInt(searchParams.get('nguoiLon') || '1');
  const treEm = parseInt(searchParams.get('treEm') || '0');

  const [passengers, setPassengers] = useState<Passenger[]>(
    Array.from({ length: nguoiLon + treEm }, (_, i) => ({
      loai: i < nguoiLon ? 'NGUOI_LON' : 'TRE_EM',
      ho: '',
      ten: '',
      ngaySinh: '',
      gioiTinh: 'NAM',
      quocTich: 'VN',
    }))
  );

  const [contactInfo, setContactInfo] = useState({
    email: '',
    soDienThoai: '',
  });

  const handlePassengerChange = (index: number, field: keyof Passenger, value: string) => {
    const newPassengers = [...passengers];
    newPassengers[index] = { ...newPassengers[index], [field]: value };
    setPassengers(newPassengers);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      // Validate
      for (const passenger of passengers) {
        if (!passenger.ho || !passenger.ten || !passenger.ngaySinh) {
          alert('Vui lòng điền đầy đủ thông tin hành khách');
          setLoading(false);
          return;
        }
      }

      if (!contactInfo.email || !contactInfo.soDienThoai) {
        alert('Vui lòng điền đầy đủ thông tin liên hệ');
        setLoading(false);
        return;
      }

      // Create booking
      const bookingData = {
        changBayId: parseInt(searchParams.get('changBayId') || '0'),
        hangVeId: parseInt(searchParams.get('hangVeId') || '0'),
        hanhKhach: passengers,
        thongTinLienHe: contactInfo,
      };

      const token = localStorage.getItem('token');
      const headers: any = {
        'Content-Type': 'application/json',
      };
      
      if (token) {
        headers['Authorization'] = `Bearer ${token}`;
      }

      const res = await fetch('http://localhost:3000/bookings', {
        method: 'POST',
        headers,
        body: JSON.stringify(bookingData),
      });

      if (!res.ok) {
        throw new Error('Đặt chỗ thất bại');
      }

      const booking = await res.json();

      // Redirect to payment
      router.push(`/thanh-toan?bookingId=${booking.id}&maDatCho=${booking.maDatCho}`);
    } catch (error) {
      console.error('Lỗi:', error);
      alert('Có lỗi xảy ra, vui lòng thử lại');
      setLoading(false);
    }
  };

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
            <div className="text-sm text-gray-600">
              Bước 3/4: Thông tin hành khách
            </div>
          </div>
        </div>
      </nav>

      <div className="container mx-auto px-4 py-8">
        {/* Progress Bar */}
        <div className="mb-8">
          <div className="flex items-center justify-between max-w-2xl mx-auto">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 bg-green-500 text-white rounded-full flex items-center justify-center font-bold">✓</div>
              <span className="text-sm font-medium text-green-600">Chọn chuyến bay</span>
            </div>
            <div className="flex-1 h-1 bg-green-500 mx-2"></div>
            
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 bg-green-500 text-white rounded-full flex items-center justify-center font-bold">✓</div>
              <span className="text-sm font-medium text-green-600">Chọn ghế</span>
            </div>
            <div className="flex-1 h-1 bg-green-500 mx-2"></div>
            
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 bg-blue-600 text-white rounded-full flex items-center justify-center font-bold">3</div>
              <span className="text-sm font-medium text-blue-600">Thông tin</span>
            </div>
            <div className="flex-1 h-1 bg-gray-300 mx-2"></div>
            
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 bg-gray-300 text-gray-600 rounded-full flex items-center justify-center font-bold">4</div>
              <span className="text-sm font-medium text-gray-600">Thanh toán</span>
            </div>
          </div>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Passenger Forms */}
            <div className="lg:col-span-2 space-y-6">
              <h2 className="text-2xl font-bold">Thông tin hành khách</h2>

              {passengers.map((passenger, index) => (
                <div key={index} className="bg-white rounded-lg shadow-sm p-6">
                  <div className="flex items-center gap-3 mb-6">
                    <div className="w-10 h-10 bg-blue-600 text-white rounded-full flex items-center justify-center font-bold">
                      {index + 1}
                    </div>
                    <div>
                      <h3 className="font-bold text-lg">
                        {passenger.loai === 'NGUOI_LON' ? 'Người lớn' : 'Trẻ em'} {index + 1}
                      </h3>
                      <p className="text-sm text-gray-600">Ghế: {seats[index]}</p>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Họ và tên đệm <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="text"
                        value={passenger.ho}
                        onChange={(e) => handlePassengerChange(index, 'ho', e.target.value.toUpperCase())}
                        placeholder="VD: NGUYEN VAN"
                        className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:ring-2 focus:ring-blue-500 focus:border-transparent uppercase"
                        required
                      />
                      <p className="text-xs text-gray-500 mt-1">Theo hộ chiếu (không dấu)</p>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Tên <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="text"
                        value={passenger.ten}
                        onChange={(e) => handlePassengerChange(index, 'ten', e.target.value.toUpperCase())}
                        placeholder="VD: AN"
                        className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:ring-2 focus:ring-blue-500 focus:border-transparent uppercase"
                        required
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Ngày sinh <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="date"
                        value={passenger.ngaySinh}
                        onChange={(e) => handlePassengerChange(index, 'ngaySinh', e.target.value)}
                        max={passenger.loai === 'NGUOI_LON' 
                          ? new Date(new Date().setFullYear(new Date().getFullYear() - 12)).toISOString().split('T')[0]
                          : new Date(new Date().setFullYear(new Date().getFullYear() - 2)).toISOString().split('T')[0]
                        }
                        className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        required
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Giới tính <span className="text-red-500">*</span>
                      </label>
                      <div className="flex gap-4">
                        <label className="flex items-center gap-2 cursor-pointer">
                          <input
                            type="radio"
                            value="NAM"
                            checked={passenger.gioiTinh === 'NAM'}
                            onChange={(e) => handlePassengerChange(index, 'gioiTinh', e.target.value)}
                            className="w-4 h-4 text-blue-600"
                          />
                          <span>Nam</span>
                        </label>
                        <label className="flex items-center gap-2 cursor-pointer">
                          <input
                            type="radio"
                            value="NU"
                            checked={passenger.gioiTinh === 'NU'}
                            onChange={(e) => handlePassengerChange(index, 'gioiTinh', e.target.value)}
                            className="w-4 h-4 text-blue-600"
                          />
                          <span>Nữ</span>
                        </label>
                      </div>
                    </div>

                    <div className="md:col-span-2">
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Quốc t적 <span className="text-red-500">*</span>
                      </label>
                      <select
                        value={passenger.quocTich}
                        onChange={(e) => handlePassengerChange(index, 'quocTich', e.target.value)}
                        className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      >
                        <option value="VN">Việt Nam</option>
                        <option value="US">Hoa Kỳ</option>
                        <option value="GB">Vương quốc Anh</option>
                        <option value="FR">Pháp</option>
                        <option value="DE">Đức</option>
                        <option value="JP">Nhật Bản</option>
                        <option value="KR">Hàn Quốc</option>
                        <option value="CN">Trung Quốc</option>
                        <option value="TH">Thái Lan</option>
                        <option value="SG">Singapore</option>
                      </select>
                    </div>
                  </div>
                </div>
              ))}

              {/* Contact Information */}
              <div className="bg-white rounded-lg shadow-sm p-6">
                <h3 className="font-bold text-lg mb-6 flex items-center gap-2">
                  <span className="text-2xl">📧</span>
                  Thông tin liên hệ
                </h3>

                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Email <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="email"
                      value={contactInfo.email}
                      onChange={(e) => setContactInfo({ ...contactInfo, email: e.target.value })}
                      placeholder="email@example.com"
                      className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      required
                    />
                    <p className="text-xs text-gray-500 mt-1">
                      Vé điện tử sẽ được gửi đến địa chỉ email này
                    </p>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Số điện thoại <span className="text-red-500">*</span>
                    </label>
                    <div className="flex gap-2">
                      <select className="border border-gray-300 rounded-lg px-3 py-3 bg-white">
                        <option value="+84">+84</option>
                        <option value="+1">+1</option>
                        <option value="+44">+44</option>
                      </select>
                      <input
                        type="tel"
                        value={contactInfo.soDienThoai}
                        onChange={(e) => setContactInfo({ ...contactInfo, soDienThoai: e.target.value })}
                        placeholder="901234567"
                        className="flex-1 border border-gray-300 rounded-lg px-4 py-3 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        required
                      />
                    </div>
                  </div>
                </div>
              </div>

              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                <div className="flex items-start gap-3">
                  <span className="text-2xl">ℹ️</span>
                  <div className="text-sm">
                    <p className="font-medium text-blue-900 mb-2">Lưu ý quan trọng:</p>
                    <ul className="space-y-1 text-blue-700">
                      <li>• Tên hành khách phải trùng khớp với giấy tờ tùy thân/hộ chiếu</li>
                      <li>• Viết tên không dấu, in hoa theo chuẩn ICAO</li>
                      <li>• Kiểm tra kỹ thông tin trước khi thanh toán</li>
                      <li>• Sau khi đặt vé, thay đổi tên có thể bị phí phạt</li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>

            {/* Booking Summary */}
            <div className="lg:col-span-1">
              <div className="bg-white rounded-lg shadow-sm p-6 sticky top-24">
                <h3 className="font-bold text-lg mb-4">Tóm tắt đặt chỗ</h3>

                <div className="space-y-4 mb-6">
                  <div>
                    <p className="text-sm text-gray-600">Chuyến bay</p>
                    <p className="font-semibold">VN123</p>
                  </div>

                  <div>
                    <p className="text-sm text-gray-600">Hành trình</p>
                    <p className="font-semibold">
                      {searchParams.get('sanBayDiId')} → {searchParams.get('sanBayDenId')}
                    </p>
                    <p className="text-sm">{searchParams.get('ngayDi')}</p>
                  </div>

                  <div>
                    <p className="text-sm text-gray-600 mb-2">Ghế đã chọn</p>
                    <div className="flex flex-wrap gap-2">
                      {seats.map(seat => (
                        <span key={seat} className="bg-green-100 text-green-700 px-3 py-1 rounded-full text-sm font-medium">
                          {seat}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>

                <div className="border-t pt-4 mb-6 space-y-2">
                  <div className="flex justify-between">
                    <span className="text-gray-600">
                      Người lớn x {nguoiLon}
                    </span>
                    <span className="font-semibold">
                      {new Intl.NumberFormat('vi-VN', {
                        style: 'currency',
                        currency: 'VND',
                      }).format(parseInt(searchParams.get('giaBan') || '0') * nguoiLon)}
                    </span>
                  </div>
                  {treEm > 0 && (
                    <div className="flex justify-between">
                      <span className="text-gray-600">
                        Trẻ em x {treEm}
                      </span>
                      <span className="font-semibold">
                        {new Intl.NumberFormat('vi-VN', {
                          style: 'currency',
                          currency: 'VND',
                        }).format(parseInt(searchParams.get('giaBan') || '0') * 0.75 * treEm)}
                      </span>
                    </div>
                  )}
                  <div className="flex justify-between">
                    <span className="text-gray-600">Thuế & phí</span>
                    <span className="font-semibold">300.000₫</span>
                  </div>
                  <div className="border-t pt-2 flex justify-between text-lg font-bold">
                    <span>Tổng cộng</span>
                    <span className="text-blue-600">
                      {new Intl.NumberFormat('vi-VN', {
                        style: 'currency',
                        currency: 'VND',
                      }).format(
                        parseInt(searchParams.get('giaBan') || '0') * nguoiLon +
                        parseInt(searchParams.get('giaBan') || '0') * 0.75 * treEm +
                        300000
                      )}
                    </span>
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full bg-blue-600 text-white py-3 rounded-lg font-semibold hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition mb-3"
                >
                  {loading ? 'Đang xử lý...' : 'Tiếp tục thanh toán →'}
                </button>

                <button
                  type="button"
                  onClick={() => router.back()}
                  className="w-full bg-white border-2 border-gray-300 text-gray-700 py-3 rounded-lg font-semibold hover:bg-gray-50 transition"
                >
                  ← Quay lại
                </button>
              </div>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}

export default function ThongTinHanhKhachPage() {
  return (
    <Suspense fallback={<div className="min-h-screen flex items-center justify-center">
      <div className="text-center">
        <div className="inline-block animate-spin text-6xl mb-4">✈️</div>
        <p className="text-gray-600">Đang tải...</p>
      </div>
    </div>}>
      <ThongTinHanhKhachContent />
    </Suspense>
  );
}
