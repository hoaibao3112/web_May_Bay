'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';

export default function HomePage() {
  const [airports, setAirports] = useState<any[]>([]);
  const [fromAirport, setFromAirport] = useState('');
  const [toAirport, setToAirport] = useState('');
  const [departDate, setDepartDate] = useState('');
  const [returnDate, setReturnDate] = useState('');
  const [tripType, setTripType] = useState<'roundtrip' | 'oneway'>('roundtrip');
  const [adults, setAdults] = useState(1);
  const [children, setChildren] = useState(0);
  const [activeTab, setActiveTab] = useState('flights');

  useEffect(() => {
    fetch('http://localhost:5000/catalog/san-bay')
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

  // Service tabs data
  const serviceTabs = [
    { id: 'flights', name: 'Vé máy bay', icon: '✈️' },
    { id: 'hotels', name: 'Khách sạn', icon: '🏨' },
    { id: 'trains', name: 'Xe khách', icon: '🚌' },
    { id: 'cars', name: 'Thuê xe', icon: '🚗' },
    { id: 'activities', name: 'Hoạt động', icon: '🎯' },
  ];

  // Destinations data
  const destinations = [
    { 
      name: 'Phú Quốc', 
      image: '🏝️',
      description: 'Đảo ngọc thiên đường',
      price: 'Từ 2.100.000đ'
    },
    { 
      name: 'Đà Nẵng', 
      image: '🌉',
      description: 'Thành phố đáng sống',
      price: 'Từ 1.500.000đ'
    },
    { 
      name: 'Nha Trang', 
      image: '🏖️',
      description: 'Bãi biển tuyệt đẹp',
      price: 'Từ 1.800.000đ'
    },
    { 
      name: 'Đà Lạt', 
      image: '🌲',
      description: 'Thành phố ngàn hoa',
      price: 'Từ 1.400.000đ'
    },
  ];

  // Travel inspirations
  const travelCards = [
    {
      title: 'Ưu đãi đặc biệt',
      subtitle: 'Giảm đến 30%',
      icon: '🎁',
      color: 'from-pink-500 to-rose-500'
    },
    {
      title: 'Bay quốc tế',
      subtitle: 'Khám phá thế giới',
      icon: '🌍',
      color: 'from-blue-500 to-cyan-500'
    },
    {
      title: 'Combo tiết kiệm',
      subtitle: 'Máy bay + Khách sạn',
      icon: '📦',
      color: 'from-purple-500 to-indigo-500'
    },
    {
      title: 'Trải nghiệm VIP',
      subtitle: 'Hạng thương gia',
      icon: '👑',
      color: 'from-amber-500 to-orange-500'
    },
  ];

  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <header className="bg-white shadow-sm sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-2">
              <span className="text-2xl">✈️</span>
              <span className="text-xl font-bold text-blue-600">BayNhanh</span>
            </div>
            <nav className="hidden md:flex items-center space-x-6">
              <Link href="/tim-chuyen" className="text-gray-700 hover:text-blue-600 font-medium">
                Vé máy bay
              </Link>
              <Link href="/quan-ly-dat-cho" className="text-gray-700 hover:text-blue-600 font-medium">
                Quản lý đặt chỗ
              </Link>
              <Link href="/auth/login" className="text-gray-700 hover:text-blue-600 font-medium">
                Đăng nhập
              </Link>
              <Link href="/auth/register" className="px-5 py-2 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700">
                Đăng ký
              </Link>
            </nav>
          </div>
        </div>
      </header>

      {/* Hero Section with Background Image */}
      <section className="relative h-[500px] overflow-hidden">
        {/* Background Image */}
        <div className="absolute inset-0">
          <Image
            src="/images/AnhNen/Backgroud.jpg"
            alt="Background"
            fill
            className="object-cover"
            priority
          />
          <div className="absolute inset-0 bg-gradient-to-r from-black/50 to-black/30"></div>
        </div>

        {/* Content */}
        <div className="relative h-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="pt-12">
            <h1 className="text-4xl md:text-5xl font-bold text-white mb-2">
              Bay đến mọi nơi
            </h1>
            <p className="text-xl text-white/90 mb-8">
              Tìm kiếm và đặt vé máy bay giá tốt nhất
            </p>

            {/* Service Tabs */}
            <div className="flex flex-wrap gap-3 mb-6">
              {serviceTabs.map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`px-5 py-2.5 rounded-lg font-medium transition-all ${
                    activeTab === tab.id
                      ? 'bg-white text-blue-600 shadow-lg'
                      : 'bg-white/20 text-white hover:bg-white/30 backdrop-blur-sm'
                  }`}
                >
                  <span className="mr-2">{tab.icon}</span>
                  {tab.name}
                </button>
              ))}
            </div>

            {/* Search Card */}
            <div className="bg-white rounded-2xl shadow-2xl p-6 max-w-5xl">
              {/* Trip Type Buttons */}
              <div className="flex gap-3 mb-5">
                <button
                  onClick={() => setTripType('roundtrip')}
                  className={`px-5 py-2 rounded-lg font-medium transition-all ${
                    tripType === 'roundtrip'
                      ? 'bg-blue-100 text-blue-600'
                      : 'text-gray-600 hover:bg-gray-100'
                  }`}
                >
                  ↔️ Khứ hồi
                </button>
                <button
                  onClick={() => setTripType('oneway')}
                  className={`px-5 py-2 rounded-lg font-medium transition-all ${
                    tripType === 'oneway'
                      ? 'bg-blue-100 text-blue-600'
                      : 'text-gray-600 hover:bg-gray-100'
                  }`}
                >
                  → Một chiều
                </button>
              </div>

              {/* Search Form Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                {/* From Airport */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Từ
                  </label>
                  <select
                    value={fromAirport}
                    onChange={(e) => setFromAirport(e.target.value)}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
                  >
                    <option value="">Chọn điểm đi</option>
                    {airports.map((airport) => (
                      <option key={airport.id} value={airport.maSanBay}>
                        {airport.tenSanBay} ({airport.maSanBay})
                      </option>
                    ))}
                  </select>
                </div>

                {/* To Airport */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Đến
                  </label>
                  <select
                    value={toAirport}
                    onChange={(e) => setToAirport(e.target.value)}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
                  >
                    <option value="">Chọn điểm đến</option>
                    {airports.map((airport) => (
                      <option key={airport.id} value={airport.maSanBay}>
                        {airport.tenSanBay} ({airport.maSanBay})
                      </option>
                    ))}
                  </select>
                </div>

                {/* Depart Date */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Ngày đi
                  </label>
                  <input
                    type="date"
                    value={departDate}
                    onChange={(e) => setDepartDate(e.target.value)}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
                  />
                </div>

                {/* Return Date */}
                {tripType === 'roundtrip' && (
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Ngày về
                    </label>
                    <input
                      type="date"
                      value={returnDate}
                      onChange={(e) => setReturnDate(e.target.value)}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
                    />
                  </div>
                )}
              </div>

              {/* Passengers and Search Button */}
              <div className="flex flex-wrap gap-4 mt-4">
                <div className="flex gap-4 flex-1">
                  <div className="flex-1 min-w-[120px]">
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Người lớn
                    </label>
                    <input
                      type="number"
                      min="1"
                      max="9"
                      value={adults}
                      onChange={(e) => setAdults(parseInt(e.target.value))}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
                    />
                  </div>
                  <div className="flex-1 min-w-[120px]">
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Trẻ em
                    </label>
                    <input
                      type="number"
                      min="0"
                      max="9"
                      value={children}
                      onChange={(e) => setChildren(parseInt(e.target.value))}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
                    />
                  </div>
                </div>
                
                <button
                  onClick={handleSearch}
                  disabled={!fromAirport || !toAirport || !departDate}
                  className="px-10 py-3 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 self-end"
                >
                  🔍 Tìm chuyến bay
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>


      {/* Travel Inspiration Cards Section */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-gray-900 mb-2">Nâng tầm chuyến đi</h2>
          <p className="text-gray-600 mb-8">Khám phá những trải nghiệm tuyệt vời</p>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {travelCards.map((card, idx) => (
              <div
                key={idx}
                className={`group relative overflow-hidden rounded-xl p-6 text-white cursor-pointer transition-transform hover:scale-105 bg-gradient-to-br ${card.color}`}
              >
                <div className="text-5xl mb-4">{card.icon}</div>
                <h3 className="text-xl font-bold mb-1">{card.title}</h3>
                <p className="text-white/90">{card.subtitle}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Popular Destinations Section */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-gray-900 mb-2">Cảm hứng du lịch</h2>
          <p className="text-gray-600 mb-8">Những điểm đến được yêu thích nhất</p>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {destinations.map((dest, idx) => (
              <div
                key={idx}
                className="group bg-white rounded-xl overflow-hidden shadow-md hover:shadow-xl transition-all cursor-pointer"
              >
                <div className="h-48 bg-gradient-to-br from-blue-400 to-cyan-400 flex items-center justify-center text-6xl">
                  {dest.image}
                </div>
                <div className="p-5">
                  <h3 className="text-xl font-bold text-gray-900 mb-1">{dest.name}</h3>
                  <p className="text-gray-600 text-sm mb-3">{dest.description}</p>
                  <div className="flex items-center justify-between">
                    <span className="text-blue-600 font-semibold">{dest.price}</span>
                    <span className="text-gray-400 group-hover:text-blue-600 transition-colors">→</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Benefits Section */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-gray-900 mb-12 text-center">
            Tại sao chọn BayNhanh?
          </h2>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            <div className="text-center">
              <div className="text-5xl mb-4">💰</div>
              <h3 className="text-lg font-bold text-gray-900 mb-2">Giá tốt nhất</h3>
              <p className="text-gray-600">So sánh giá từ nhiều hãng bay</p>
            </div>
            <div className="text-center">
              <div className="text-5xl mb-4">⚡</div>
              <h3 className="text-lg font-bold text-gray-900 mb-2">Đặt vé nhanh</h3>
              <p className="text-gray-600">Chỉ 3 phút hoàn tất</p>
            </div>
            <div className="text-center">
              <div className="text-5xl mb-4">🔒</div>
              <h3 className="text-lg font-bold text-gray-900 mb-2">An toàn bảo mật</h3>
              <p className="text-gray-600">Thanh toán được mã hóa</p>
            </div>
            <div className="text-center">
              <div className="text-5xl mb-4">🎫</div>
              <h3 className="text-lg font-bold text-gray-900 mb-2">Vé điện tử</h3>
              <p className="text-gray-600">Nhận vé ngay lập tức</p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-gradient-to-r from-blue-600 to-blue-700">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-4xl font-bold text-white mb-4">
            Sẵn sàng khám phá thế giới?
          </h2>
          <p className="text-xl text-blue-100 mb-8">
            Đăng ký ngay để nhận ưu đãi độc quyền và giảm giá đến 30%
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/auth/register"
              className="px-8 py-3 bg-white text-blue-600 rounded-lg font-semibold hover:bg-blue-50 transition-all"
            >
              Đăng ký miễn phí
            </Link>
            <Link
              href="/tim-chuyen"
              className="px-8 py-3 bg-blue-500 text-white rounded-lg font-semibold hover:bg-blue-400 transition-all"
            >
              Tìm chuyến bay ngay
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
                <span className="text-2xl">✈️</span>
                <span className="text-xl font-bold">BayNhanh</span>
              </div>
              <p className="text-gray-400">
                Nền tảng đặt vé máy bay trực tuyến hàng đầu Việt Nam
              </p>
            </div>
            <div>
              <h4 className="font-bold mb-4">Về chúng tôi</h4>
              <ul className="space-y-2 text-gray-400">
                <li><a href="#" className="hover:text-white transition-colors">Giới thiệu</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Tuyển dụng</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Blog</a></li>
              </ul>
            </div>
            <div>
              <h4 className="font-bold mb-4">Hỗ trợ</h4>
              <ul className="space-y-2 text-gray-400">
                <li><a href="#" className="hover:text-white transition-colors">Trung tâm trợ giúp</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Điều khoản</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Chính sách</a></li>
              </ul>
            </div>
            <div>
              <h4 className="font-bold mb-4">Liên hệ</h4>
              <ul className="space-y-2 text-gray-400">
                <li>📞 1900 1234</li>
                <li>📧 support@baynhanh.vn</li>
                <li>📍 TP. Hồ Chí Minh</li>
              </ul>
            </div>
          </div>
          <div className="border-t border-gray-800 pt-8 text-center text-gray-400">
            <p>&copy; 2026 BayNhanh. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
