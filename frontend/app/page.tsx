'use client';

import { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import LocationAutocomplete from './components/LocationAutocomplete';
import AirportAutocomplete from './components/AirportAutocomplete';

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

  // Car rental search state
  const [carPickupLocation, setCarPickupLocation] = useState('');
  const [carDropoffLocation, setCarDropoffLocation] = useState('');
  const [carPickupDate, setCarPickupDate] = useState('');
  const [carPickupTime, setCarPickupTime] = useState('00:00');
  const [carDropoffDate, setCarDropoffDate] = useState('');
  const [carDropoffTime, setCarDropoffTime] = useState('00:00');
  const [carPassengers, setCarPassengers] = useState(2);
  const [carLuggage, setCarLuggage] = useState(2);

  // Airport transfer search state
  const [atPickupLocation, setAtPickupLocation] = useState('');
  const [atDropoffLocation, setAtDropoffLocation] = useState('');
  const [atAirportId, setAtAirportId] = useState<number | null>(null);
  const [atCity, setAtCity] = useState('');
  const [atDate, setAtDate] = useState('');
  const [atTime, setAtTime] = useState('00:00');
  const [atPassengers, setAtPassengers] = useState(2);
  const [atLuggage, setAtLuggage] = useState(2);

  useEffect(() => {
    // Load airports
    fetch('http://localhost:5000/api/catalog/san-bay')
      .then(res => res.json())
      .then(data => setAirports(data))
      .catch(err => console.error('Error loading airports:', err));

    // Load airlines
    fetch('http://localhost:5000/api/catalog/hang-hang-khong')
      .then(res => res.json())
      .then(data => setAirlines(data))
      .catch(err => console.error('Error loading airlines:', err));

    // Load popular routes
    fetch('http://localhost:5000/api/statistics/popular-routes?limit=4')
      .then(res => res.json())
      .then(data => setPopularRoutes(Array.isArray(data) ? data : []))
      .catch(err => console.error('Error loading popular routes:', err));

    // Load cities for hotels
    fetch('http://localhost:5000/api/catalog/thanh-pho-vn')
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
    setCarPickupDate(tomorrowStr);
    setAtDate(tomorrowStr);

    const nextWeek = new Date();
    nextWeek.setDate(nextWeek.getDate() + 8);
    const nextWeekStr = nextWeek.toISOString().split('T')[0];
    setReturnDate(nextWeekStr);
    setHotelCheckout(nextWeekStr);
    setCarDropoffDate(nextWeekStr);
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
        const response = await fetch(`http://localhost:5000/api/bus-search/suggestions?q=${encodeURIComponent(value)}`);
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

  const handleCarRentalSearch = () => {
    if (!carPickupLocation || !carPickupDate || !carPickupTime) {
      alert('Vui lòng điền đầy đủ thông tin điểm đón và thời gian');
      return;
    }

    // Navigate to car rental search results page
    const params = new URLSearchParams({
      from: carPickupLocation,
      to: carDropoffLocation || carPickupLocation,
      pickupDate: carPickupDate,
      pickupTime: carPickupTime,
      dropoffDate: carDropoffDate || carPickupDate,
      dropoffTime: carDropoffTime,
      passengers: carPassengers.toString(),
      luggage: carLuggage.toString(),
    });
    window.location.href = `/cho-thue-xe?${params.toString()}`;
  };

  const handleAirportTransferSearch = () => {
    if (!atPickupLocation || !atDate || !atTime) {
      alert('Vui lòng điền đầy đủ thông tin điểm đón và thời gian');
      return;
    }

    if (!atDropoffLocation) {
      alert('Vui lòng điền thông tin điểm đến');
      return;
    }

    // Navigate to airport transfer results page
    const params = new URLSearchParams({
      pickupLocation: atPickupLocation,
      dropoffLocation: atDropoffLocation,
      date: atDate,
      time: atTime,
      passengers: atPassengers.toString(),
      luggage: atLuggage.toString(),
    });
    if (atAirportId) params.append('airportId', atAirportId.toString());
    window.location.href = `/duadon?${params.toString()}`;
  };

  // Service tabs data
  const serviceTabs = [
    { id: 'flights', name: 'Vé máy bay', icon: '✈️' },
    { id: 'hotels', name: 'Khách sạn', icon: '🏨' },
    { id: 'buses', name: 'Vé xe khách', icon: '🚌' },
    { id: 'airport-transfer', name: 'Đưa đón sân bay', icon: '🚗' },
    { id: 'car-rental', name: 'Cho thuê xe', icon: '🚙' },
    { id: 'activities', name: 'Hoạt động & Vui chơi', icon: '⚡' },
  ];

  // Destinations data from API
  const destinations = (Array.isArray(popularRoutes) ? popularRoutes : []).map((route: any) => ({
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
      icon: '✨',
      color: 'from-pink-500 to-rose-500'
    },
    {
      title: 'Bay quốc tế',
      subtitle: 'Khám phá thế giới',
      icon: '🌍',
      color: 'from-primary-500 to-cyan-500'
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
      {/* Hero Section with Background Image - REDESIGNED */}
      <section className="relative min-h-screen overflow-hidden bg-gradient-to-b from-primary-600 via-primary-500 to-primary-700">
        {/* Background Image with Overlay */}
        <div className="absolute inset-0">
          <Image
            src="/images/AnhNen/Backgroud.jpg"
            alt="Background"
            fill
            className="object-cover"
            priority
          />
          <div className="absolute inset-0 bg-gradient-to-b from-primary-900/70 via-primary-800/60 to-primary-900/75"></div>
        </div>

        {/* Content */}
        <div className="relative h-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-20 pb-32">
          {/* Title */}
          <div className="text-center mb-12">
            <h1 className="text-5xl md:text-6xl font-bold text-white mb-4 drop-shadow-lg">
              App du lịch hàng đầu, một chạm đi bất cứ đâu
            </h1>
            <p className="text-xl text-primary-100 drop-shadow-md">
              Đặt chuyến bay, khách sạn, xe cộ nhanh chóng và tiện lợi
            </p>
          </div>

          {/* Service Tabs */}
          <div className="flex flex-wrap justify-center gap-3 mb-10">
            {serviceTabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`px-6 py-3 rounded-full font-medium transition-all flex items-center gap-2 backdrop-blur-sm ${activeTab === tab.id
                  ? 'bg-white text-primary-600 shadow-2xl scale-105'
                  : 'bg-white/20 text-white hover:bg-white/30 border border-white/40'
                  }`}
              >
                <span className="text-xl">{tab.icon}</span>
                <span>{tab.name}</span>
              </button>
            ))}
          </div>

          {/* Compact Search Card */}
          <div className="max-w-5xl mx-auto">
            <div className="bg-white rounded-3xl shadow-2xl p-8 backdrop-blur-sm">
              {/* Flight Search */}
              {activeTab === 'flights' && (
                <div>
                  {/* Trip Type Buttons */}
                  <div className="flex gap-4 mb-6">
                    <button
                      onClick={() => setTripType('roundtrip')}
                      className={`px-6 py-2 rounded-lg font-medium transition-all ${tripType === 'roundtrip'
                        ? 'bg-primary-100 text-primary-600 border-2 border-primary-300'
                        : 'text-secondary-600 hover:bg-primary-50 border-2 border-transparent'
                        }`}
                    >
                      ↔️ Khứ hồi
                    </button>
                    <button
                      onClick={() => setTripType('oneway')}
                      className={`px-6 py-2 rounded-lg font-medium transition-all ${tripType === 'oneway'
                        ? 'bg-primary-100 text-primary-600 border-2 border-primary-300'
                        : 'text-secondary-600 hover:bg-primary-50 border-2 border-transparent'
                        }`}
                    >
                      → Một chiều
                    </button>
                  </div>

                  {/* Search Form Grid */}
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                    {/* From Airport */}
                    <div>
                      <label className="block text-sm font-semibold text-secondary-700 mb-2">
                        Từ
                      </label>
                      <select
                        value={fromAirport}
                        onChange={(e) => setFromAirport(e.target.value)}
                        className="input-primary w-full"
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
                      <label className="block text-sm font-semibold text-secondary-700 mb-2">
                        Đến
                      </label>
                      <select
                        value={toAirport}
                        onChange={(e) => setToAirport(e.target.value)}
                        className="input-primary w-full"
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
                      <label className="block text-sm font-semibold text-secondary-700 mb-2">
                        Ngày đi
                      </label>
                      <input
                        type="date"
                        value={departDate}
                        onChange={(e) => setDepartDate(e.target.value)}
                        className="input-primary w-full"
                      />
                    </div>

                    {/* Return Date */}
                    {tripType === 'roundtrip' && (
                      <div>
                        <label className="block text-sm font-semibold text-secondary-700 mb-2">
                          Ngày về
                        </label>
                        <input
                          type="date"
                          value={returnDate}
                          onChange={(e) => setReturnDate(e.target.value)}
                          className="input-primary w-full"
                        />
                      </div>
                    )}
                  </div>

                  {/* Passengers and Search Button */}
                  <div className="flex flex-wrap gap-4 mt-6">
                    <div className="flex gap-4 flex-1">
                      <div className="flex-1 min-w-[120px]">
                        <label className="block text-sm font-semibold text-secondary-700 mb-2">
                          Người lớn
                        </label>
                        <input
                          type="number"
                          min="1"
                          max="9"
                          value={adults}
                          onChange={(e) => setAdults(parseInt(e.target.value))}
                          className="input-primary w-full"
                        />
                      </div>
                      <div className="flex-1 min-w-[120px]">
                        <label className="block text-sm font-semibold text-secondary-700 mb-2">
                          Trẻ em
                        </label>
                        <input
                          type="number"
                          min="0"
                          max="9"
                          value={children}
                          onChange={(e) => setChildren(parseInt(e.target.value))}
                          className="input-primary w-full"
                        />
                      </div>
                    </div>

                    <button
                      onClick={handleSearch}
                      disabled={!fromAirport || !toAirport || !departDate}
                      className="btn-primary self-end disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 transition-all"
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
                      <label className="block text-sm font-semibold text-secondary-700 mb-2">
                        Thành phố, địa điểm hoặc tên khách sạn:
                      </label>
                      <div className="relative">
                        <div className="absolute left-3 top-1/2 transform -translate-y-1/2 text-primary-500">
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
                          className="input-primary w-full pl-10"
                        />
                      </div>

                      {/* Dropdown với thiết kế giống Booking.com */}
                      {showCityDropdown && (
                        <div className="absolute z-50 w-full mt-1 bg-white border border-primary-200 rounded-lg shadow-2xl max-h-96 overflow-y-auto">
                          {/* Nút "Gần tôi" */}
                          <button
                            type="button"
                            onClick={() => {
                              alert('Tính năng định vị đang phát triển');
                            }}
                            className="w-full px-4 py-3 text-left hover:bg-primary-50 transition-colors border-b flex items-center gap-3"
                          >
                            <svg className="w-5 h-5 text-primary-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                            </svg>
                            <span className="text-primary-600 font-medium">Gần tôi</span>
                          </button>

                          {/* Tiếp tục tìm kiếm - Recent searches */}
                          {recentSearches.length > 0 && hotelCity.length === 0 && (
                            <div className="border-b">
                              <div className="px-4 py-2 flex items-center justify-between">
                                <h3 className="font-semibold text-secondary-900">Tiếp tục tìm kiếm</h3>
                                <button
                                  onClick={() => {
                                    setRecentSearches([]);
                                    localStorage.removeItem('recentHotelSearches');
                                  }}
                                  className="text-primary-600 text-sm hover:underline"
                                >
                                  Xóa
                                </button>
                              </div>
                              {recentSearches.map((search, idx) => (
                                <button
                                  key={idx}
                                  type="button"
                                  onClick={() => handleCitySelect(search)}
                                  className="w-full px-4 py-2 text-left hover:bg-primary-50 transition-colors flex items-center gap-3"
                                >
                                  <svg className="w-4 h-4 text-secondary-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                                  </svg>
                                  <span className="text-secondary-700">{search}</span>
                                </button>
                              ))}
                            </div>
                          )}

                          {/* Điểm đến phổ biến */}
                          {hotelCity.length === 0 && popularCities.length > 0 && (
                            <div>
                              <div className="px-4 py-3">
                                <h3 className="font-semibold text-secondary-900">Điểm đến phổ biến</h3>
                              </div>
                              {popularCities.map((city) => (
                                <button
                                  key={city.code}
                                  type="button"
                                  onClick={() => handleCitySelect(city.name)}
                                  className="w-full px-4 py-3 text-left hover:bg-primary-50 transition-colors group"
                                >
                                  <div className="flex items-start justify-between">
                                    <div className="flex-1">
                                      <div className="font-semibold text-secondary-900 group-hover:text-primary-700">
                                        {city.name}
                                      </div>
                                      <div className="text-sm text-secondary-500">
                                        Thành phố {city.name}, Việt Nam
                                      </div>
                                    </div>
                                    <div className="text-right">
                                      <div className="text-primary-600 text-sm font-medium">
                                        {city.code === 'DAD' ? 'Vùng' : 'Thành Phố'}
                                      </div>
                                      <div className="text-xs text-secondary-500">
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
                                  className="w-full px-4 py-3 text-left hover:bg-primary-50 transition-colors group"
                                >
                                  <div className="flex items-center gap-3">
                                    <svg className="w-4 h-4 text-secondary-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                            </svg>
                                    <div className="flex-1">
                                      <div className="font-medium text-secondary-900 group-hover:text-primary-700">
                                        {city.name}
                                      </div>
                                      <div className="text-sm text-secondary-500">
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
                            <div className="px-4 py-8 text-center text-secondary-500">
                              Không tìm thấy kết quả cho "{hotelCity}"
                            </div>
                          )}
                        </div>
                      )}
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-secondary-700 mb-2">
                        Ngày nhận phòng
                      </label>
                      <input
                        type="date"
                        value={hotelCheckin}
                        onChange={(e) => setHotelCheckin(e.target.value)}
                        className="w-full px-4 py-3 border border-primary-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-secondary-700 mb-2">
                        Ngày trả phòng
                      </label>
                      <input
                        type="date"
                        value={hotelCheckout}
                        onChange={(e) => setHotelCheckout(e.target.value)}
                        className="w-full px-4 py-3 border border-primary-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none"
                      />
                    </div>
                  </div>

                  <div className="flex flex-wrap gap-4 mt-4">
                    <div className="flex gap-4 flex-1">
                      <div className="flex-1 min-w-[120px]">
                        <label className="block text-sm font-medium text-secondary-700 mb-2">
                          Số khách
                        </label>
                        <input
                          type="number"
                          min="1"
                          max="20"
                          value={hotelGuests}
                          onChange={(e) => setHotelGuests(parseInt(e.target.value))}
                          className="w-full px-4 py-3 border border-primary-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none"
                        />
                      </div>
                      <div className="flex-1 min-w-[120px]">
                        <label className="block text-sm font-medium text-secondary-700 mb-2">
                          Số phòng
                        </label>
                        <input
                          type="number"
                          min="1"
                          max="10"
                          value={hotelRooms}
                          onChange={(e) => setHotelRooms(parseInt(e.target.value))}
                          className="w-full px-4 py-3 border border-primary-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none"
                        />
                      </div>
                    </div>

                    <button
                      onClick={handleHotelSearch}
                      disabled={!hotelCity || !hotelCheckin || !hotelCheckout}
                      className="px-10 py-3 bg-primary-600 text-white rounded-lg font-semibold hover:bg-primary-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 self-end transition-all"
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
                      <label className="block text-sm font-medium text-secondary-700 mb-2">
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
                      <label className="block text-sm font-medium text-secondary-700 mb-2">
                        🚩 Đến
                      </label>
                      <LocationAutocomplete
                        value={busTo}
                        onChange={(value) => setBusTo(value)}
                        placeholder="hà nội"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-secondary-700 mb-2">
                        Ngày khởi hành
                      </label>
                      <input
                        type="date"
                        value={busDate}
                        onChange={(e) => setBusDate(e.target.value)}
                        className="w-full px-4 py-3 border border-primary-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none"
                      />
                    </div>
                  </div>

                  <div className="flex flex-wrap gap-4 mt-4">
                    <div className="flex-1 min-w-[120px]">
                      <label className="block text-sm font-medium text-secondary-700 mb-2">
                        Số hành khách
                      </label>
                      <input
                        type="number"
                        min="1"
                        max="20"
                        value={busPassengers}
                        onChange={(e) => setBusPassengers(parseInt(e.target.value))}
                        className="w-full px-4 py-3 border border-primary-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none"
                      />
                    </div>

                    <button
                      onClick={handleBusSearch}

                      disabled={!busFrom || !busTo || !busDate}
                      className="px-10 py-3 bg-primary-600 text-white rounded-lg font-semibold hover:bg-primary-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 self-end transition-all"
                    >
                      🔍 Tìm xe khách
                    </button>
                  </div>
                </div>
              )}

              {/* Car Rental Search */}
              {activeTab === 'car-rental' && (
                <div>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                    {/* Pickup Location */}
                    <div>
                      <label className="block text-sm font-medium text-secondary-700 mb-2">
                        🚗 Từ sân bay, địa chỉ, tòa nhà
                      </label>
                      <LocationAutocomplete
                        value={carPickupLocation}
                        onChange={(value) => setCarPickupLocation(value)}
                        placeholder="Sân bay quốc tế Nội Bài (HAN)"
                      />
                    </div>

                    {/* Dropoff Location */}
                    <div>
                      <label className="block text-sm font-medium text-secondary-700 mb-2">
                        📍 Đến khu vực, địa chỉ, tòa nhà
                      </label>
                      <LocationAutocomplete
                        value={carDropoffLocation}
                        onChange={(value) => setCarDropoffLocation(value)}
                        placeholder="Hồ Hoàn Kiếm"
                      />
                    </div>

                    {/* Pickup Date */}
                    <div>
                      <label className="block text-sm font-medium text-secondary-700 mb-2">
                        Ngày đón
                      </label>
                      <input
                        type="date"
                        value={carPickupDate}
                        onChange={(e) => setCarPickupDate(e.target.value)}
                        className="w-full px-4 py-3 border border-primary-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none"
                      />
                    </div>

                    {/* Pickup Time */}
                    <div>
                      <label className="block text-sm font-medium text-secondary-700 mb-2">
                        Giờ đón
                      </label>
                      <input
                        type="time"
                        value={carPickupTime}
                        onChange={(e) => setCarPickupTime(e.target.value)}
                        className="w-full px-4 py-3 border border-primary-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none"
                      />
                    </div>
                  </div>

                  {/* Second Row */}
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mt-4">
                    {/* Dropoff Date */}
                    <div>
                      <label className="block text-sm font-medium text-secondary-700 mb-2">
                        Ngày trả (Tùy chọn)
                      </label>
                      <input
                        type="date"
                        value={carDropoffDate}
                        onChange={(e) => setCarDropoffDate(e.target.value)}
                        className="w-full px-4 py-3 border border-primary-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none"
                      />
                    </div>

                    {/* Dropoff Time */}
                    <div>
                      <label className="block text-sm font-medium text-secondary-700 mb-2">
                        Giờ trả dự kiến
                      </label>
                      <input
                        type="time"
                        value={carDropoffTime}
                        onChange={(e) => setCarDropoffTime(e.target.value)}
                        className="w-full px-4 py-3 border border-primary-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none"
                      />
                    </div>

                    {/* Passengers */}
                    <div>
                      <label className="block text-sm font-medium text-secondary-700 mb-2">
                        Số hành khách
                      </label>
                      <input
                        type="number"
                        min="1"
                        max="20"
                        value={carPassengers}
                        onChange={(e) => setCarPassengers(parseInt(e.target.value))}
                        className="w-full px-4 py-3 border border-primary-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none"
                      />
                    </div>

                    {/* Luggage */}
                    <div>
                      <label className="block text-sm font-medium text-secondary-700 mb-2">
                        Số hành lý
                      </label>
                      <input
                        type="number"
                        min="0"
                        max="20"
                        value={carLuggage}
                        onChange={(e) => setCarLuggage(parseInt(e.target.value))}
                        className="w-full px-4 py-3 border border-primary-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none"
                      />
                    </div>
                  </div>

                  {/* Search Button */}
                  <div className="flex justify-end mt-4">
                    <button
                      onClick={handleCarRentalSearch}
                      disabled={!carPickupLocation || !carPickupDate || !carPickupTime}
                      className="px-10 py-3 bg-primary-600 text-white rounded-lg font-semibold hover:bg-primary-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 transition-all"
                    >
                      🔍 Tìm xe
                    </button>
                  </div>
                </div>
              )}

              {/* Airport Transfer Search */}
              {activeTab === 'airport-transfer' && (
                <div>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                    {/* Pickup Location */}
                    <div>
                      <label className="block text-sm font-medium text-secondary-700 mb-2">
                        🚗 Từ sân bay, địa chỉ, tòa nhà
                      </label>
                      <AirportAutocomplete
                        value={atPickupLocation}
                        onChange={(value, id, city) => {
                          setAtPickupLocation(value);
                          if (id) setAtAirportId(id);
                          if (city) setAtCity(city);
                        }}
                        placeholder="Sân bay quốc tế Nội Bài (HAN)"
                      />
                    </div>

                    {/* Dropoff Location */}
                    <div>
                      <label className="block text-sm font-medium text-secondary-700 mb-2">
                        📍 Đến khu vực, địa chỉ, tòa nhà*
                      </label>
                      <LocationAutocomplete
                        value={atDropoffLocation}
                        onChange={(value) => setAtDropoffLocation(value)}
                        placeholder="Hồ Hoàn Kiếm"
                        city={atCity}
                      />
                    </div>

                    {/* Pickup Date */}
                    <div>
                      <label className="block text-sm font-medium text-secondary-700 mb-2">
                        Ngày đón
                      </label>
                      <input
                        type="date"
                        value={atDate}
                        onChange={(e) => setAtDate(e.target.value)}
                        className="w-full px-4 py-3 border border-primary-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none"
                      />
                    </div>

                    {/* Pickup Time */}
                    <div>
                      <label className="block text-sm font-medium text-secondary-700 mb-2">
                        Giờ đón
                      </label>
                      <input
                        type="time"
                        value={atTime}
                        onChange={(e) => setAtTime(e.target.value)}
                        className="w-full px-4 py-3 border border-primary-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none"
                      />
                    </div>
                  </div>

                  {/* Second Row */}
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mt-4">
                    {/* Passengers */}
                    <div>
                      <label className="block text-sm font-medium text-secondary-700 mb-2">
                        Số hành khách
                      </label>
                      <input
                        type="number"
                        min="1"
                        max="20"
                        value={atPassengers}
                        onChange={(e) => setAtPassengers(parseInt(e.target.value))}
                        className="w-full px-4 py-3 border border-primary-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none"
                      />
                    </div>

                    {/* Luggage */}
                    <div>
                      <label className="block text-sm font-medium text-secondary-700 mb-2">
                        Số hành lý
                      </label>
                      <input
                        type="number"
                        min="0"
                        max="20"
                        value={atLuggage}
                        onChange={(e) => setAtLuggage(parseInt(e.target.value))}
                        className="w-full px-4 py-3 border border-primary-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none"
                      />
                    </div>
                  </div>

                  {/* Search Button */}
                  <div className="flex justify-end mt-4">
                    <button
                      onClick={handleAirportTransferSearch}
                      disabled={!atPickupLocation || !atDropoffLocation || !atDate || !atTime}
                      className="px-10 py-3 bg-primary-600 text-white rounded-lg font-semibold hover:bg-primary-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 transition-all"
                    >
                      🔍 Tìm xe
                    </button>
                  </div>
                </div>
              )}

              {/* Activities Search */}
              {activeTab === 'activities' && (
                <div>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    {/* City Selection */}
                    <div>
                      <label className="block text-sm font-medium text-secondary-700 mb-2">
                        📍 Điểm đến
                      </label>
                      <select
                        value={hotelCity}
                        onChange={(e) => setHotelCity(e.target.value)}
                        className="w-full px-4 py-3 border border-primary-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-transparent outline-none"
                      >
                        <option value="">Tất cả địa điểm</option>
                        <option value="Hồ Chí Minh">Hồ Chí Minh</option>
                        <option value="Hà Nội">Hà Nội</option>
                        <option value="Đà Nẵng">Đà Nẵng</option>
                        <option value="Nha Trang">Nha Trang</option>
                        <option value="Phú Quốc">Phú Quốc</option>
                        <option value="Đà Lạt">Đà Lạt</option>
                      </select>
                    </div>

                    {/* Date */}
                    <div>
                      <label className="block text-sm font-medium text-secondary-700 mb-2">
                        📅 Ngày tham gia
                      </label>
                      <input
                        type="date"
                        value={departDate}
                        onChange={(e) => setDepartDate(e.target.value)}
                        className="w-full px-4 py-3 border border-primary-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-transparent outline-none"
                      />
                    </div>

                    {/* Number of people */}
                    <div>
                      <label className="block text-sm font-medium text-secondary-700 mb-2">
                        👥 Số người
                      </label>
                      <input
                        type="number"
                        min="1"
                        max="20"
                        value={adults}
                        onChange={(e) => setAdults(parseInt(e.target.value))}
                        className="w-full px-4 py-3 border border-primary-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-transparent outline-none"
                      />
                    </div>
                  </div>

                  {/* Search Button */}
                  <div className="flex justify-end mt-6">
                    <button
                      onClick={() => {
                        const params = new URLSearchParams();
                        if (hotelCity) params.append('thanhPho', hotelCity);
                        if (departDate) params.append('ngay', departDate);
                        window.location.href = `/hoat-dong?${params.toString()}`;
                      }}
                      className="px-10 py-3 bg-gradient-to-r from-pink-500 to-rose-500 text-white rounded-lg font-semibold hover:from-pink-600 hover:to-rose-600 flex items-center justify-center gap-2 transition-all shadow-lg"
                    >
                      🔍 Tìm hoạt động
                    </button>
                  </div>

                  {/* Quick Categories */}
                  <div className="mt-6 pt-6 border-t">
                    <h3 className="font-semibold text-secondary-900 mb-4">Hoặc chọn một danh mục để khám phá:</h3>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                      <Link
                        href="/hoat-dong?danhMucId=1"
                        className="flex items-center gap-3 p-4 bg-gradient-to-br from-primary-50 to-primary-100 rounded-xl hover:shadow-md transition group"
                      >
                        <svg className="w-8 h-8 text-primary-600" fill="currentColor" viewBox="0 0 24 24">
                          <path d="M19 13h-6v6h-2v-6H5v-2h6V5h2v6h6v2z" />
                        </svg>
                        <span className="font-medium text-secondary-900 group-hover:text-primary-700">Điểm tham quan</span>
                      </Link>
                      <Link
                        href="/hoat-dong?danhMucId=2"
                        className="flex items-center gap-3 p-4 bg-gradient-to-br from-green-50 to-green-100 rounded-xl hover:shadow-md transition group"
                      >
                        <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 20l-5.447-2.724A1 1 0 003 16.382V5.618a1 1 0 011.553-.894L9 7.711" />
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 20l5.447-2.724A1 1 0 0021 16.382V5.618a1 1 0 00-1.553-.894L15 7.711" />
                        </svg>
                        <span className="font-medium text-secondary-900 group-hover:text-green-600">Tour</span>
                      </Link>
                      <Link
                        href="/hoat-dong?danhMucId=3"
                        className="flex items-center gap-3 p-4 bg-gradient-to-br from-purple-50 to-purple-100 rounded-xl hover:shadow-md transition group"
                      >
                        <svg className="w-8 h-8 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 10h-2m2 0h2m-2 0V8m0 2v2m-6 0h2m-2 0H8m2 0V8m0 2v2m8-4H8a2 2 0 00-2 2v8a2 2 0 002 2h8a2 2 0 002-2v-8a2 2 0 00-2-2z" />
                        </svg>
                        <span className="font-medium text-secondary-900 group-hover:text-purple-600">Spa & Thư giãn</span>
                      </Link>
                      <Link
                        href="/hoat-dong?danhMucId=4"
                        className="flex items-center gap-3 p-4 bg-gradient-to-br from-orange-50 to-orange-100 rounded-xl hover:shadow-md transition group"
                      >
                        <svg className="w-8 h-8 text-orange-600" fill="currentColor" viewBox="0 0 24 24">
                          <path d="M13 10V3L4 14h7v7l9-11h-7z" />
                        </svg>
                        <span className="font-medium text-secondary-900 group-hover:text-orange-600">Thể thao</span>
                      </Link>
                    </div>
                  </div>
                </div>
              )}

              {/* Other services */}
              {!['flights', 'hotels', 'buses', 'car-rental', 'airport-transfer', 'activities'].includes(activeTab) && (
                <div className="text-center py-12">
                  <div className="inline-flex items-center justify-center w-20 h-20 bg-primary-100 rounded-full mb-4">
                    <svg className="w-10 h-10 text-primary-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
                    </svg>
                  </div>
                  <h3 className="text-xl font-bold text-secondary-900 mb-2">
                    Tính năng đang được phát triển
                  </h3>
                  <p className="text-secondary-600">
                    Chúng tôi đang nỗ lực hoàn thiện tính năng này. Vui lòng quay lại sau!
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* Promotions Section - NEW */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-end justify-between mb-12">
            <div>
              <h2 className="text-4xl font-bold text-secondary-900 mb-2">Khuyến mãi đặc biệt</h2>
              <p className="text-lg text-secondary-600">Tiết kiệm ngay với các ưu đãi hấp dẫn</p>
            </div>
            <Link
              href="/khuyenmai"
              className="px-6 py-3 bg-primary-600 text-white rounded-lg font-semibold hover:bg-primary-700 transition-all shadow-md hover:shadow-lg"
            >
              Xem tất cả
            </Link>
          </div>

          <div className="grid md:grid-cols-3 gap-6">
            {/* Promo Card 1 */}
            <div className="group relative bg-white rounded-2xl shadow-md hover:shadow-xl transition-all overflow-hidden border border-primary-100">
              <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-primary-100 to-primary-50 rounded-full -mr-16 -mt-16"></div>
              <div className="relative p-8">
                <div className="inline-flex items-center justify-center w-12 h-12 bg-primary-100 rounded-lg mb-4">
                  <span className="text-xl">₫</span>
                </div>
                <h3 className="text-2xl font-bold text-secondary-900 mb-2">Giảm 500K</h3>
                <p className="text-secondary-600 text-sm mb-4">Cho đơn hàng từ 2 triệu</p>
                <Link href="/khuyenmai" className="inline-flex items-center gap-2 text-primary-600 font-semibold hover:text-primary-700">
                  Tìm hiểu thêm
                </Link>
              </div>
            </div>

            {/* Promo Card 2 */}
            <div className="group relative bg-white rounded-2xl shadow-md hover:shadow-xl transition-all overflow-hidden border border-primary-100">
              <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-primary-100 to-primary-50 rounded-full -mr-16 -mt-16"></div>
              <div className="relative p-8">
                <div className="inline-flex items-center justify-center w-12 h-12 bg-primary-100 rounded-lg mb-4">
                  <span className="text-xl">%</span>
                </div>
                <h3 className="text-2xl font-bold text-secondary-900 mb-2">Giảm 30%</h3>
                <p className="text-secondary-600 text-sm mb-4">Tối đa 1 triệu đồng</p>
                <Link href="/khuyenmai" className="inline-flex items-center gap-2 text-primary-600 font-semibold hover:text-primary-700">
                  Tìm hiểu thêm
                </Link>
              </div>
            </div>

            {/* Promo Card 3 */}
            <div className="group relative bg-white rounded-2xl shadow-md hover:shadow-xl transition-all overflow-hidden border border-primary-100">
              <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-primary-100 to-primary-50 rounded-full -mr-16 -mt-16"></div>
              <div className="relative p-8">
                <div className="inline-flex items-center justify-center w-12 h-12 bg-primary-100 rounded-lg mb-4">
                  <span className="text-xl">+</span>
                </div>
                <h3 className="text-2xl font-bold text-secondary-900 mb-2">Combo Tiết kiệm</h3>
                <p className="text-secondary-600 text-sm mb-4">Giảm 25% khi đặt combo</p>
                <Link href="/khuyenmai" className="inline-flex items-center gap-2 text-primary-600 font-semibold hover:text-primary-700">
                  Tìm hiểu thêm
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>


      {/* Popular Destinations Section */}
      <section className="py-20 bg-primary-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-4xl font-bold text-secondary-900 mb-3">Điểm đến phổ biến</h2>
          <p className="text-lg text-secondary-600 mb-12">Những tuyến bay được yêu thích nhất</p>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {destinations.length > 0 ? destinations.map((dest, idx) => (
              <div
                key={idx}
                className="group bg-white rounded-xl overflow-hidden shadow-md hover:shadow-xl transition-all cursor-pointer border border-primary-100"
                onClick={() => {
                  setFromAirport(dest.from);
                  setToAirport(dest.to);
                  window.scrollTo({ top: 0, behavior: 'smooth' });
                }}
              >
                <div className="h-32 bg-gradient-to-br from-primary-400 to-primary-600 flex items-center justify-center text-5xl group-hover:scale-110 transition-transform">
                  {dest.image}
                </div>
                <div className="p-5">
                  <h3 className="text-lg font-bold text-secondary-900 mb-1">{dest.name}</h3>
                  <p className="text-secondary-600 text-sm mb-3">{dest.description}</p>
                  <div className="flex items-center justify-between">
                    <span className="text-primary-600 font-semibold text-sm">{dest.price}</span>
                    <span className="text-secondary-400 group-hover:text-primary-600 transition-colors">→</span>
                  </div>
                </div>
              </div>
            )) : (
              <div className="col-span-4 text-center py-8 text-secondary-500">
                Đang tải điểm đến phổ biến...
              </div>
            )}
          </div>
        </div>
      </section>

      {/* Why Choose Us Section */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-4xl font-bold text-secondary-900 mb-3 text-center">
            Tại sao chọn BayNhanh?
          </h2>
          <p className="text-lg text-secondary-600 mb-16 text-center">
            Trải nghiệm đặt vé du lịch tốt nhất
          </p>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            <div className="text-center">
              <div className="inline-flex items-center justify-center w-16 h-16 bg-primary-100 rounded-full mb-6">
                <svg className="w-8 h-8 text-primary-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <h3 className="text-lg font-bold text-secondary-900 mb-2">Giá tốt nhất</h3>
              <p className="text-secondary-600">So sánh giá từ nhiều hãng bay</p>
            </div>

            <div className="text-center">
              <div className="inline-flex items-center justify-center w-16 h-16 bg-primary-100 rounded-full mb-6">
                <svg className="w-8 h-8 text-primary-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
              </div>
              <h3 className="text-lg font-bold text-secondary-900 mb-2">Đặt vé nhanh</h3>
              <p className="text-secondary-600">Chỉ 3 phút hoàn tất</p>
            </div>

            <div className="text-center">
              <div className="inline-flex items-center justify-center w-16 h-16 bg-primary-100 rounded-full mb-6">
                <svg className="w-8 h-8 text-primary-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                </svg>
              </div>
              <h3 className="text-lg font-bold text-secondary-900 mb-2">An toàn bảo mật</h3>
              <p className="text-secondary-600">Thanh toán được mã hóa</p>
            </div>

            <div className="text-center">
              <div className="inline-flex items-center justify-center w-16 h-16 bg-primary-100 rounded-full mb-6">
                <svg className="w-8 h-8 text-primary-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18.364 5.636l-3.536 3.536m0 5.656l3.536 3.536M9.172 9.172L5.636 5.636m3.536 9.192l-3.536 3.536M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-5.657-4.343a9 9 0 10-12.728 12.728" />
                </svg>
              </div>
              <h3 className="text-lg font-bold text-secondary-900 mb-2">Hỗ trợ 24/7</h3>
              <p className="text-secondary-600">Giúp đỡ bất cứ lúc nào</p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-gradient-to-r from-primary-600 to-primary-700">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-4xl font-bold text-white mb-4">
            Sẵn sàng khám phá thế giới?
          </h2>
          <p className="text-xl text-primary-100 mb-8">
            Đăng ký ngay để nhận ưu đãi độc quyền và giảm giá đến 30%
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/auth/register"
              className="px-8 py-3 bg-white text-primary-600 rounded-lg font-semibold hover:bg-primary-50 transition-all"
            >
              Đăng ký miễn phí
            </Link>
            <Link
              href="/tim-chuyen"
              className="px-8 py-3 bg-white text-primary-600 rounded-lg font-semibold hover:bg-primary-50 transition-all"
            >
              Tìm chuyến bay ngay
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-primary-900 text-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-4 gap-12 mb-12">
            <div>
              <div className="flex items-center space-x-3 mb-6">
                <div className="w-10 h-10 bg-primary-500 rounded-lg flex items-center justify-center">
                  <svg className="w-6 h-6 text-white" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M10.894 2.553a1 1 0 00-.788 0l-7 3.5a1 1 0 001.079 1.79L3 6.211V15a2 2 0 002 2h8a2 2 0 002-2V6.211l.013-.008a1 1 0 001.079-1.79l-7-3.5z"></path>
                  </svg>
                </div>
                <span className="text-2xl font-bold">BayNhanh</span>
              </div>
              <p className="text-primary-300 leading-relaxed">
                Nền tảng đặt vé máy bay trực tuyến hàng đầu Việt Nam. Tìm, so sánh và đặt vé dễ dàng.
              </p>
            </div>
            <div>
              <h4 className="font-bold text-white mb-4">Công ty</h4>
              <ul className="space-y-3 text-primary-300">
                <li><a href="#" className="hover:text-white transition-colors">Về chúng tôi</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Tuyển dụng</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Blog</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Báo chí</a></li>
              </ul>
            </div>
            <div>
              <h4 className="font-bold text-white mb-4">Hỗ trợ</h4>
              <ul className="space-y-3 text-primary-300">
                <li><a href="#" className="hover:text-white transition-colors">Trung tâm trợ giúp</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Điều khoản sử dụng</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Chính sách bảo mật</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Liên hệ chúng tôi</a></li>
              </ul>
            </div>
            <div>
              <h4 className="font-bold text-white mb-4">Liên hệ</h4>
              <ul className="space-y-3 text-primary-300">
                <li className="flex items-center gap-2">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                  </svg>
                  <span>support@baynhanh.vn</span>
                </li>
                <li className="flex items-center gap-2">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                  </svg>
                  <span>1900 1234</span>
                </li>
              </ul>
            </div>
          </div>
          <div className="border-t border-primary-800 pt-8 text-center text-primary-300">
            <p>&copy; 2026 BayNhanh. Tất cả quyền được bảo lưu.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}


