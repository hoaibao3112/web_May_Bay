'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';

export default function HomePage() {
  const [airports, setAirports] = useState<any[]>([]);
  const [fromAirport, setFromAirport] = useState('');
  const [toAirport, setToAirport] = useState('');
  const [departDate, setDepartDate] = useState('');
  const [returnDate, setReturnDate] = useState('');
  const [tripType, setTripType] = useState<'roundtrip' | 'oneway'>('roundtrip');
  const [adults, setAdults] = useState(1);
  const [children, setChildren] = useState(0);

  useEffect(() => {
    fetch('http://localhost:3000/catalog/san-bay')
      .then(res => res.json())
      .then(data => setAirports(data))
      .catch(err => console.error('Error loading airports:', err));

    // Set default date to tomorrow
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    setDepartDate(tomorrow.toISOString().split('T')[0]);

    const nextWeek = new Date();
    nextWeek.setDate(nextWeek.getDate() + 8);
    setReturnDate(nextWeek.toISOString().split('T')[0]);
  }, []);

  const handleSearch = () => {
    const params = new URLSearchParams({
      from: fromAirport,
      to: toAirport,
      departDate,
      ...(tripType === 'roundtrip' && { returnDate }),
      adults: adults.toString(),
      children: children.toString(),
      tripType
    });
    window.location.href = `/ket-qua?${params.toString()}`;
  };

  const popularDestinations = [
    { city: 'Hà Nội', code: 'HAN', image: '🏛️', price: '1.200.000đ' },
    { city: 'Đà Nẵng', code: 'DAD', image: '🌉', price: '1.500.000đ' },
    { city: 'Phú Quốc', code: 'PQC', image: '🏝️', price: '2.100.000đ' },
    { city: 'Nha Trang', code: 'CXR', image: '🏖️', price: '1.800.000đ' },
    { city: 'Đà Lạt', code: 'DLI', image: '🌲', price: '1.400.000đ' },
    { city: 'Cần Thơ', code: 'VCA', image: '🌾', price: '1.100.000đ' }
  ];

  const features = [
    {
      icon: '💰',
      title: 'Giá Tốt Nhất',
      desc: 'So sánh giá từ nhiều hãng bay để tìm ưu đãi tốt nhất'
    },
    {
      icon: '⚡',
      title: 'Đặt Vé Nhanh Chóng',
      desc: 'Chỉ 3 phút để hoàn tất đặt vé bay của bạn'
    },
    {
      icon: '🔒',
      title: 'Thanh Toán An Toàn',
      desc: 'Bảo mật tuyệt đối với nhiều phương thức thanh toán'
    },
    {
      icon: '🎫',
      title: 'Vé Điện Tử',
      desc: 'Nhận vé ngay sau khi thanh toán thành công'
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white">
      {/* Header */}
      <header className="bg-white/80 backdrop-blur-md border-b border-blue-100 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex justify-between items-center">
            <div className="flex items-center space-x-2">
              <span className="text-3xl">✈️</span>
              <span className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-cyan-500 bg-clip-text text-transparent">
                FlyBooking
              </span>
            </div>
            <nav className="hidden md:flex items-center space-x-8">
              <Link href="/tim-chuyen" className="text-gray-700 hover:text-blue-600 font-medium transition-colors">
                Tìm chuyến bay
              </Link>
              <Link href="/quan-ly-dat-cho" className="text-gray-700 hover:text-blue-600 font-medium transition-colors">
                Quản lý đặt chỗ
              </Link>
              <Link href="/auth/login" className="text-gray-700 hover:text-blue-600 font-medium transition-colors">
                Đăng nhập
              </Link>
              <Link href="/auth/register" className="px-6 py-2.5 bg-gradient-to-r from-blue-600 to-cyan-500 text-white rounded-full font-semibold hover:shadow-lg hover:scale-105 transition-all">
                Đăng ký
              </Link>
            </nav>
          </div>
        </div>
      </header>

      {/* Hero Section with Search */}
      <section className="relative pt-20 pb-32 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-blue-600 via-blue-500 to-cyan-400 opacity-10"></div>
        <div className="absolute top-20 left-10 w-72 h-72 bg-blue-400 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob"></div>
        <div className="absolute top-40 right-10 w-72 h-72 bg-cyan-400 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob animation-delay-2000"></div>
        <div className="absolute bottom-20 left-1/2 w-72 h-72 bg-purple-400 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob animation-delay-4000"></div>

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h1 className="text-5xl md:text-7xl font-bold text-gray-900 mb-6 leading-tight">
              Bay Đến Đích Đến<br />
              <span className="bg-gradient-to-r from-blue-600 to-cyan-500 bg-clip-text text-transparent">
                Yêu Thích Của Bạn
              </span>
            </h1>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Khám phá hàng nghìn chuyến bay với giá tốt nhất. Đặt vé dễ dàng, bay thoải mái!
            </p>
          </div>

          {/* Search Form */}
          <div className="max-w-5xl mx-auto bg-white rounded-3xl shadow-2xl p-8">
            <div className="flex gap-4 mb-6">
              <button
                onClick={() => setTripType('roundtrip')}
                className={`px-6 py-3 rounded-xl font-semibold transition-all ${
                  tripType === 'roundtrip'
                    ? 'bg-blue-600 text-white shadow-lg'
                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                }`}
              >
                Khứ hồi
              </button>
              <button
                onClick={() => setTripType('oneway')}
                className={`px-6 py-3 rounded-xl font-semibold transition-all ${
                  tripType === 'oneway'
                    ? 'bg-blue-600 text-white shadow-lg'
                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                }`}
              >
                Một chiều
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
              <div className="lg:col-span-1">
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Điểm đi
                </label>
                <select
                  value={fromAirport}
                  onChange={(e) => setFromAirport(e.target.value)}
                  className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all outline-none"
                >
                  <option value="">Chọn sân bay đi</option>
                  {airports.map((airport) => (
                    <option key={airport.id} value={airport.maSanBay}>
                      {airport.tenSanBay} ({airport.maSanBay})
                    </option>
                  ))}
                </select>
              </div>

              <div className="lg:col-span-1">
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Điểm đến
                </label>
                <select
                  value={toAirport}
                  onChange={(e) => setToAirport(e.target.value)}
                  className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all outline-none"
                >
                  <option value="">Chọn sân bay đến</option>
                  {airports.map((airport) => (
                    <option key={airport.id} value={airport.maSanBay}>
                      {airport.tenSanBay} ({airport.maSanBay})
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Ngày đi
                </label>
                <input
                  type="date"
                  value={departDate}
                  onChange={(e) => setDepartDate(e.target.value)}
                  className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all outline-none"
                />
              </div>

              {tripType === 'roundtrip' && (
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Ngày về
                  </label>
                  <input
                    type="date"
                    value={returnDate}
                    onChange={(e) => setReturnDate(e.target.value)}
                    className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all outline-none"
                  />
                </div>
              )}
            </div>

            <div className="flex flex-wrap gap-4 items-end">
              <div className="flex-1 min-w-[150px]">
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Người lớn
                </label>
                <input
                  type="number"
                  min="1"
                  max="9"
                  value={adults}
                  onChange={(e) => setAdults(parseInt(e.target.value))}
                  className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all outline-none"
                />
              </div>

              <div className="flex-1 min-w-[150px]">
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Trẻ em
                </label>
                <input
                  type="number"
                  min="0"
                  max="9"
                  value={children}
                  onChange={(e) => setChildren(parseInt(e.target.value))}
                  className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all outline-none"
                />
              </div>

              <button
                onClick={handleSearch}
                disabled={!fromAirport || !toAirport || !departDate}
                className="flex-1 min-w-[200px] px-8 py-3 bg-gradient-to-r from-blue-600 to-cyan-500 text-white rounded-xl font-bold text-lg hover:shadow-xl hover:scale-105 transition-all disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100"
              >
                🔍 Tìm chuyến bay
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">Tại Sao Chọn Chúng Tôi?</h2>
            <p className="text-xl text-gray-600">Trải nghiệm đặt vé máy bay tuyệt vời nhất</p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, idx) => (
              <div
                key={idx}
                className="group p-8 bg-gradient-to-br from-blue-50 to-cyan-50 rounded-2xl hover:shadow-2xl transition-all duration-300 hover:-translate-y-2"
              >
                <div className="text-5xl mb-4 group-hover:scale-110 transition-transform">
                  {feature.icon}
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-3">{feature.title}</h3>
                <p className="text-gray-600">{feature.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Popular Destinations */}
      <section className="py-20 bg-gradient-to-b from-blue-50 to-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">Điểm Đến Phổ Biến</h2>
            <p className="text-xl text-gray-600">Khám phá những địa điểm tuyệt vời tại Việt Nam</p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {popularDestinations.map((dest, idx) => (
              <div
                key={idx}
                className="group relative overflow-hidden rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 cursor-pointer"
              >
                <div className="absolute inset-0 bg-gradient-to-br from-blue-600/90 to-cyan-500/90 group-hover:from-blue-600/80 group-hover:to-cyan-500/80 transition-all"></div>
                <div className="relative p-8 text-white">
                  <div className="text-6xl mb-4 group-hover:scale-110 transition-transform">
                    {dest.image}
                  </div>
                  <h3 className="text-3xl font-bold mb-2">{dest.city}</h3>
                  <p className="text-blue-100 text-lg mb-4">{dest.code}</p>
                  <div className="flex justify-between items-center pt-4 border-t border-white/20">
                    <span className="text-sm">Từ</span>
                    <span className="text-2xl font-bold">{dest.price}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-r from-blue-600 to-cyan-500">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
            Sẵn Sàng Bay Cùng Chúng Tôi?
          </h2>
          <p className="text-xl text-blue-100 mb-10">
            Đăng ký ngay để nhận ưu đãi độc quyền và giảm giá lên đến 30%!
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/auth/register"
              className="px-10 py-4 bg-white text-blue-600 rounded-full font-bold text-lg hover:bg-blue-50 hover:shadow-2xl hover:scale-105 transition-all"
            >
              Đăng Ký Miễn Phí
            </Link>
            <Link
              href="/tim-chuyen"
              className="px-10 py-4 bg-blue-700 text-white rounded-full font-bold text-lg hover:bg-blue-800 hover:shadow-2xl hover:scale-105 transition-all"
            >
              Tìm Chuyến Bay
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-4 gap-8 mb-8">
            <div>
              <div className="flex items-center space-x-2 mb-4">
                <span className="text-3xl">✈️</span>
                <span className="text-2xl font-bold">FlyBooking</span>
              </div>
              <p className="text-gray-400">
                Nền tảng đặt vé máy bay trực tuyến hàng đầu Việt Nam
              </p>
            </div>
            <div>
              <h4 className="font-bold mb-4">Về Chúng Tôi</h4>
              <ul className="space-y-2 text-gray-400">
                <li><a href="#" className="hover:text-white transition-colors">Giới thiệu</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Điều khoản</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Chính sách</a></li>
              </ul>
            </div>
            <div>
              <h4 className="font-bold mb-4">Hỗ Trợ</h4>
              <ul className="space-y-2 text-gray-400">
                <li><a href="#" className="hover:text-white transition-colors">Trung tâm trợ giúp</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Liên hệ</a></li>
                <li><a href="#" className="hover:text-white transition-colors">FAQ</a></li>
              </ul>
            </div>
            <div>
              <h4 className="font-bold mb-4">Liên Hệ</h4>
              <ul className="space-y-2 text-gray-400">
                <li>📞 1900 1234</li>
                <li>📧 support@flybooking.vn</li>
                <li>📍 TP. Hồ Chí Minh</li>
              </ul>
            </div>
          </div>
          <div className="border-t border-gray-800 pt-8 text-center text-gray-400">
            <p>&copy; 2026 FlyBooking. All rights reserved.</p>
          </div>
        </div>
      </footer>

      <style jsx>{`
        @keyframes blob {
          0%, 100% { transform: translate(0, 0) scale(1); }
          25% { transform: translate(20px, -50px) scale(1.1); }
          50% { transform: translate(-20px, 20px) scale(0.9); }
          75% { transform: translate(50px, 50px) scale(1.05); }
        }
        .animate-blob {
          animation: blob 10s infinite;
        }
        .animation-delay-2000 {
          animation-delay: 2s;
        }
        .animation-delay-4000 {
          animation-delay: 4s;
        }
      `}</style>
    </div>
  );
}
