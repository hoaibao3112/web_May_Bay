'use client';

import { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import LocationAutocomplete from './components/LocationAutocomplete';

export default function HomePage() {
  const cityInputRef = useRef<HTMLDivElement>(null);
  const [airports, setAirports] = useState<any[]>([]);
  const [airlines, setAirlines] = useState<any[]>([]);
  const [popularRoutes, setPopularRoutes] = useState<any[]>([]);
  const [cities, setCities] = useState<any[]>([]);
  const [filteredCities, setFilteredCities] = useState<any[]>([]);
  const [showCityDropdown, setShowCityDropdown] = useState(false);
  const [popularCities, setPopularCities] = useState<any[]>([]);
  const [recentSearches, setRecentSearches] = useState<string[]>([]);
  const [fromAirport, setFromAirport] = useState('');
  const [toAirport, setToAirport] = useState('');
  const [departDate, setDepartDate] = useState('');
  const [returnDate, setReturnDate] = useState('');
  const [tripType, setTripType] = useState<'roundtrip' | 'oneway'>('roundtrip');
  const [adults, setAdults] = useState(1);
  const [children, setChildren] = useState(0);
  const [activeTab, setActiveTab] = useState('flights');

  // Hotel search state
  const [hotelCity, setHotelCity] = useState('');
  const [hotelCheckin, setHotelCheckin] = useState('');
  const [hotelCheckout, setHotelCheckout] = useState('');
  const [hotelGuests, setHotelGuests] = useState(2);
  const [hotelRooms, setHotelRooms] = useState(1);

  // Bus search state
  const [busFrom, setBusFrom] = useState('');
  const [busTo, setBusTo] = useState('');
  const [busDate, setBusDate] = useState('');
  const [busPassengers, setBusPassengers] = useState(1);
  const [busStationSuggestions, setBusStationSuggestions] = useState<any[]>([]);
  const [showBusFromDropdown, setShowBusFromDropdown] = useState(false);
  const [showBusToDropdown, setShowBusToDropdown] = useState(false);
  const [popularBusCities] = useState([
    'TP.HCM',
    'Hà Nội',
    'Đà Nẵng',
    'Nha Trang',
    'Đà Lạt',
    'Cần Thơ',
    'Vũng Tàu',
    'Huế',
  ]);

  useEffect(() => {
    // Load airports
    fetch('http://localhost:5000/catalog/san-bay')
      .then(res => res.json())
      .then(data => setAirports(data))
      .catch(err => console.error('Error loading airports:', err));

    // Load airlines
    fetch('http://localhost:5000/catalog/hang-hang-khong')
      .then(res => res.json())
      .then(data => setAirlines(data))
      .catch(err => console.error('Error loading airlines:', err));

    // Load popular routes
    fetch('http://localhost:5000/statistics/popular-routes?limit=4')
      .then(res => res.json())
      .then(data => setPopularRoutes(data))
      .catch(err => console.error('Error loading popular routes:', err));

    // Load cities for hotels
    fetch('http://localhost:5000/catalog/thanh-pho-vn')
      .then(res => res.json())
      .then(data => {
        console.log('Cities loaded:', data);
        // Ensure data is array
        if (Array.isArray(data)) {
          setCities(data);
        } else {
          console.error('Cities data is not an array:', data);
          setCities([]);
        }
        // Set popular cities (top 10)
        const popular = [
          { name: 'Đà Nẵng', code: 'DAD', hotels: 2211 },
          { name: 'Hà Nội', code: 'HAN', hotels: 3542 },
          { name: 'Hồ Chí Minh', code: 'SGN', hotels: 4123 },
          { name: 'Đà Lạt', code: 'DLI', hotels: 1763 },
          { name: 'Vũng Tàu', code: 'VTG', hotels: 986 },
          { name: 'Nha Trang', code: 'CXR', hotels: 1456 },
          { name: 'Phú Quốc', code: 'PQC', hotels: 892 },
          { name: 'Huế', code: 'HUI', hotels: 654 },
        ];
        setPopularCities(popular);
      })
      .catch(err => {
        console.error('Error loading cities:', err);
        setCities([]);
      });

    // Load recent searches from localStorage
    const recent = localStorage.getItem('recentHotelSearches');
    if (recent) {
      setRecentSearches(JSON.parse(recent));
    }

    // Set default date to tomorrow
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    const tomorrowStr = tomorrow.toISOString().split('T')[0];
    setDepartDate(tomorrowStr);
    setHotelCheckin(tomorrowStr);
    setBusDate(tomorrowStr);

    const nextWeek = new Date();
    nextWeek.setDate(nextWeek.getDate() + 8);
    const nextWeekStr = nextWeek.toISOString().split('T')[0];
    setReturnDate(nextWeekStr);
    setHotelCheckout(nextWeekStr);
  }, []);

  // Click outside to close dropdown
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (cityInputRef.current && !cityInputRef.current.contains(event.target as Node)) {
        setShowCityDropdown(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const handleSearch = () => {
    if (!fromAirport || !toAirport || !departDate) {
      alert('Vui lòng điền đầy đủ thông tin tìm kiếm');
      return;
    }

    const params = new URLSearchParams({
      sanBayDiId: fromAirport,
      sanBayDenId: toAirport,
      ngayDi: departDate,
      nguoiLon: adults.toString(),
      treEm: children.toString(),
      loaiVe: tripType,
      ...(tripType === 'roundtrip' && returnDate && { ngayVe: returnDate }),
    });
    window.location.href = `/ket-qua?${params.toString()}`;
  };

  const handleHotelSearch = () => {
    if (!hotelCity || !hotelCheckin || !hotelCheckout) {
      alert('Vui lòng điền đầy đủ thông tin tìm kiếm khách sạn');
      return;
    }

    // Save to recent searches
    const recent = [hotelCity, ...recentSearches.filter(s => s !== hotelCity)].slice(0, 5);
    setRecentSearches(recent);
    localStorage.setItem('recentHotelSearches', JSON.stringify(recent));

    // Navigate to hotel search page with parameters
    const params = new URLSearchParams({
      thanhPho: hotelCity,
      ngayNhanPhong: hotelCheckin,
      ngayTraPhong: hotelCheckout,
      soNguoi: hotelGuests.toString(),
      soPhong: hotelRooms.toString(),
    });
    window.location.href = `/khachsan?${params.toString()}`;
  };

  const handleCitySelect = (cityName: string) => {
    setHotelCity(cityName);
    setShowCityDropdown(false);
  };

  const handleCityInputChange = (value: string) => {
    setHotelCity(value);
    if (value.length > 0) {
      // Check if cities is an array
      if (Array.isArray(cities) && cities.length > 0) {
        const filtered = cities.filter((city: any) =>
          city.name.toLowerCase().includes(value.toLowerCase()) ||
          city.code.toLowerCase().includes(value.toLowerCase())
        );
        setFilteredCities(filtered);
        setShowCityDropdown(true);
      } else {
        // If cities not loaded yet, show popular cities
        const filtered = popularCities.filter((city: any) =>
          city.name.toLowerCase().includes(value.toLowerCase()) ||
          city.code.toLowerCase().includes(value.toLowerCase())
        );
        setFilteredCities(filtered);
        setShowCityDropdown(true);
      }
    } else {
      setFilteredCities([]);
      setShowCityDropdown(true); // Show popular cities when empty
    }
  };

  const handleBusStationInput = async (value: string, type: 'from' | 'to') => {
    if (type === 'from') {
      setBusFrom(value);
    } else {
      setBusTo(value);
    }

    if (value.length > 1) {
      try {
        const response = await fetch(`http://localhost:5000/bus-search/suggestions?q=${encodeURIComponent(value)}`);
        if (response.ok) {
          const data = await response.json();
          setBusStationSuggestions(data);
        }
      } catch (error) {
        console.error('Error fetching bus station suggestions:', error);
        setBusStationSuggestions([]);
      }
    } else {
      setBusStationSuggestions([]);
    }
  };

  const handleBusSearch = () => {
    if (!busFrom || !busTo || !busDate) {
      alert('Vui lòng điền đầy đủ thông tin tìm kiếm xe khách');
      return;
    }

    // Navigate to bus search results page
    const params = new URLSearchParams({
      from: busFrom,
      to: busTo,
      date: busDate,
      passengers: busPassengers.toString(),
    });
    window.location.href = `/xekhach?${params.toString()}`;
  };

  // Service tabs data
  const serviceTabs = [
    { id: 'flights', name: 'Vé máy bay', icon: '✈️' },
    { id: 'hotels', name: 'Khách sạn', icon: '🏨' },
    { id: 'buses', name: 'Vé xe khách', icon: '🚌' },
    { id: 'airport-transfer', name: 'Đưa đón sân bay', icon: '🚗' },
    { id: 'car-rental', name: 'Cho thuê xe', icon: '🚙' },
    { id: 'activities', name: 'Hoạt động & Vui chơi', icon: '🎯' },
  ];

  // Destinations data from API
  const destinations = popularRoutes.map((route: any) => ({
    name: route.thanhPhoDen || route.sanBayDen,
    image: '🏝️',
    description: `${route.soLuongDat || 0} chuyến bay`,
    price: route.giaTrungBinh ? `Từ ${new Intl.NumberFormat('vi-VN').format(route.giaTrungBinh)}đ` : 'Liên hệ',
    from: route.sanBayDi,
    to: route.sanBayDen,
  }));

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
      {/* Hero Section with Background Image */}
      <section className="relative h-[600px] overflow-hidden">
        {/* Background Image */}
        <div className="absolute inset-0">
          <Image
            src="/images/AnhNen/Backgroud.jpg"
            alt="Background"
            fill
            className="object-cover"
            priority
          />
          <div className="absolute inset-0 bg-gradient-to-r from-black/60 to-black/40"></div>
        </div>

        {/* Content */}
        <div className="relative h-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="pt-16">
            <h1 className="text-4xl md:text-5xl font-bold text-white mb-3">
              App du lịch hàng đầu, một chạm đi bất cứ đâu
            </h1>

            {/* Service Tabs */}
            <div className="flex flex-wrap gap-2 mb-8">
              {serviceTabs.map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`px-6 py-3 rounded-full font-medium transition-all flex items-center gap-2 ${activeTab === tab.id
                    ? 'bg-white text-gray-900 shadow-lg'
                    : 'bg-white/20 text-white hover:bg-white/30 backdrop-blur-sm border border-white/30'
                    }`}
                >
                  <span className="text-xl">{tab.icon}</span>
                  <span>{tab.name}</span>
                </button>
              ))}
            </div>

            {/* Search Card */}
            <div className="bg-white rounded-2xl shadow-2xl p-6 max-w-5xl">
              {/* Flight Search */}
              {activeTab === 'flights' && (
                <div>
                  {/* Trip Type Buttons */}
                  <div className="flex gap-3 mb-5">
                    <button
                      onClick={() => setTripType('roundtrip')}
                      className={`px-5 py-2 rounded-lg font-medium transition-all ${tripType === 'roundtrip'
                        ? 'bg-blue-100 text-blue-600'
                        : 'text-gray-600 hover:bg-gray-100'
                        }`}
                    >
                      ↔️ Khứ hồi
                    </button>
                    <button
                      onClick={() => setTripType('oneway')}
                      className={`px-5 py-2 rounded-lg font-medium transition-all ${tripType === 'oneway'
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
                          <option key={airport.id} value={airport.id}>
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
                          <option key={airport.id} value={airport.id}>
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
                      className="px-10 py-3 bg-orange-500 text-white rounded-lg font-semibold hover:bg-orange-600 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 self-end transition-all"
                    >
                      🔍 Tìm chuyến bay
                    </button>
                  </div>
                </div>
              )}

              {/* Hotel Search */}
              {activeTab === 'hotels' && (
                <div>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                    <div ref={cityInputRef} className="lg:col-span-2 relative">
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Thành phố, địa điểm hoặc tên khách sạn:
                      </label>
                      <div className="relative">
                        <div className="absolute left-3 top-1/2 transform -translate-y-1/2 text-blue-500">
                          📍
                        </div>
                        <input
                          type="text"
                          value={hotelCity}
                          onChange={(e) => handleCityInputChange(e.target.value)}
                          onFocus={() => {
                            if (hotelCity.length === 0 || filteredCities.length > 0) {
                              setShowCityDropdown(true);
                            }
                          }}
                          placeholder="thành phố, khách sạn, điểm đến"
                          className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
                        />
                      </div>

                      {/* Dropdown với thiết kế giống Booking.com */}
                      {showCityDropdown && (
                        <div className="absolute z-50 w-full mt-1 bg-white border border-gray-200 rounded-lg shadow-2xl max-h-96 overflow-y-auto">
                          {/* Nút "Gần tôi" */}
                          <button
                            type="button"
                            onClick={() => {
                              alert('Tính năng định vị đang phát triển');
                            }}
                            className="w-full px-4 py-3 text-left hover:bg-gray-50 transition-colors border-b flex items-center gap-3"
                          >
                            <span className="text-blue-500 text-xl">🎯</span>
                            <span className="text-blue-600 font-medium">Gần tôi</span>
                          </button>

                          {/* Tiếp tục tìm kiếm - Recent searches */}
                          {recentSearches.length > 0 && hotelCity.length === 0 && (
                            <div className="border-b">
                              <div className="px-4 py-2 flex items-center justify-between">
                                <h3 className="font-semibold text-gray-900">Tiếp tục tìm kiếm</h3>
                                <button
                                  onClick={() => {
                                    setRecentSearches([]);
                                    localStorage.removeItem('recentHotelSearches');
                                  }}
                                  className="text-blue-600 text-sm hover:underline"
                                >
                                  Xóa
                                </button>
                              </div>
                              {recentSearches.map((search, idx) => (
                                <button
                                  key={idx}
                                  type="button"
                                  onClick={() => handleCitySelect(search)}
                                  className="w-full px-4 py-2 text-left hover:bg-gray-50 transition-colors flex items-center gap-3"
                                >
                                  <span className="text-gray-400">🔍</span>
                                  <span className="text-gray-700">{search}</span>
                                </button>
                              ))}
                            </div>
                          )}

                          {/* Điểm đến phổ biến */}
                          {hotelCity.length === 0 && popularCities.length > 0 && (
                            <div>
                              <div className="px-4 py-3">
                                <h3 className="font-semibold text-gray-900">Điểm đến phổ biến</h3>
                              </div>
                              {popularCities.map((city) => (
                                <button
                                  key={city.code}
                                  type="button"
                                  onClick={() => handleCitySelect(city.name)}
                                  className="w-full px-4 py-3 text-left hover:bg-blue-50 transition-colors group"
                                >
                                  <div className="flex items-start justify-between">
                                    <div className="flex-1">
                                      <div className="font-semibold text-gray-900 group-hover:text-blue-600">
                                        {city.name}
                                      </div>
                                      <div className="text-sm text-gray-500">
                                        Thành phố {city.name}, Việt Nam
                                      </div>
                                    </div>
                                    <div className="text-right">
                                      <div className="text-blue-600 text-sm font-medium">
                                        {city.code === 'DAD' ? 'Vùng' : 'Thành Phố'}
                                      </div>
                                      <div className="text-xs text-gray-500">
                                        {city.hotels?.toLocaleString()} khách sạn
                                      </div>
                                    </div>
                                  </div>
                                </button>
                              ))}
                            </div>
                          )}

                          {/* Kết quả tìm kiếm */}
                          {hotelCity.length > 0 && filteredCities.length > 0 && (
                            <div>
                              {filteredCities.slice(0, 10).map((city: any) => (
                                <button
                                  key={city.id}
                                  type="button"
                                  onClick={() => handleCitySelect(city.name)}
                                  className="w-full px-4 py-3 text-left hover:bg-blue-50 transition-colors group"
                                >
                                  <div className="flex items-center gap-3">
                                    <span className="text-gray-400">📍</span>
                                    <div className="flex-1">
                                      <div className="font-medium text-gray-900 group-hover:text-blue-600">
                                        {city.name}
                                      </div>
                                      <div className="text-sm text-gray-500">
                                        {city.code}
                                      </div>
                                    </div>
                                  </div>
                                </button>
                              ))}
                            </div>
                          )}

                          {/* No results */}
                          {hotelCity.length > 0 && filteredCities.length === 0 && (
                            <div className="px-4 py-8 text-center text-gray-500">
                              Không tìm thấy kết quả cho "{hotelCity}"
                            </div>
                          )}
                        </div>
                      )}
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Ngày nhận phòng
                      </label>
                      <input
                        type="date"
                        value={hotelCheckin}
                        onChange={(e) => setHotelCheckin(e.target.value)}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Ngày trả phòng
                      </label>
                      <input
                        type="date"
                        value={hotelCheckout}
                        onChange={(e) => setHotelCheckout(e.target.value)}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
                      />
                    </div>
                  </div>

                  <div className="flex flex-wrap gap-4 mt-4">
                    <div className="flex gap-4 flex-1">
                      <div className="flex-1 min-w-[120px]">
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Số khách
                        </label>
                        <input
                          type="number"
                          min="1"
                          max="20"
                          value={hotelGuests}
                          onChange={(e) => setHotelGuests(parseInt(e.target.value))}
                          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
                        />
                      </div>
                      <div className="flex-1 min-w-[120px]">
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Số phòng
                        </label>
                        <input
                          type="number"
                          min="1"
                          max="10"
                          value={hotelRooms}
                          onChange={(e) => setHotelRooms(parseInt(e.target.value))}
                          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
                        />
                      </div>
                    </div>

                    <button
                      onClick={handleHotelSearch}
                      disabled={!hotelCity || !hotelCheckin || !hotelCheckout}
                      className="px-10 py-3 bg-orange-500 text-white rounded-lg font-semibold hover:bg-orange-600 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 self-end transition-all"
                    >
                      🔍 Tìm khách sạn
                    </button>
                  </div>
                </div>
              )}

              {/* Bus Search */}
              {activeTab === 'buses' && (
                <div>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {/* From Station with Autocomplete */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        🚌 Từ
                      </label>
                      <LocationAutocomplete
                        value={busFrom}
                        onChange={(value) => setBusFrom(value)}
                        placeholder="hồ chí minh"
                      />
                    </div>

                    {/* To Station with Autocomplete */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        🚩 Đến
                      </label>
                      <LocationAutocomplete
                        value={busTo}
                        onChange={(value) => setBusTo(value)}
                        placeholder="hà nội"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Ngày khởi hành
                      </label>
                      <input
                        type="date"
                        value={busDate}
                        onChange={(e) => setBusDate(e.target.value)}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
                      />
                    </div>
                  </div>

                  <div className="flex flex-wrap gap-4 mt-4">
                    <div className="flex-1 min-w-[120px]">
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Số hành khách
                      </label>
                      <input
                        type="number"
                        min="1"
                        max="20"
                        value={busPassengers}
                        onChange={(e) => setBusPassengers(parseInt(e.target.value))}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
                      />
                    </div>

                    <button
                      onClick={handleBusSearch}

                      disabled={!busFrom || !busTo || !busDate}
                      className="px-10 py-3 bg-orange-500 text-white rounded-lg font-semibold hover:bg-orange-600 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 self-end transition-all"
                    >
                      🔍 Tìm xe khách
                    </button>
                  </div>
                </div>
              )}

              {/* Other services */}
              {!['flights', 'hotels', 'buses'].includes(activeTab) && (
                <div className="text-center py-12">
                  <div className="text-6xl mb-4">🚧</div>
                  <h3 className="text-xl font-bold text-gray-900 mb-2">
                    Tính năng đang được phát triển
                  </h3>
                  <p className="text-gray-600">
                    Chúng tôi đang nỗ lực hoàn thiện tính năng này. Vui lòng quay lại sau!
                  </p>
                </div>
              )}
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
          <h2 className="text-3xl font-bold text-gray-900 mb-2">Điểm đến phổ biến</h2>
          <p className="text-gray-600 mb-8">Những tuyến bay được đặt nhiều nhất</p>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {destinations.length > 0 ? destinations.map((dest, idx) => (
              <div
                key={idx}
                className="group bg-white rounded-xl overflow-hidden shadow-md hover:shadow-xl transition-all cursor-pointer"
                onClick={() => {
                  setFromAirport(dest.from);
                  setToAirport(dest.to);
                  window.scrollTo({ top: 0, behavior: 'smooth' });
                }}
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
            )) : (
              <div className="col-span-4 text-center py-8 text-gray-500">
                Đang tải điểm đến phổ biến...
              </div>
            )}
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
