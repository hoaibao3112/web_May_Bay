'use client';

import { useState, useEffect, useRef, Suspense } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import UserDropdown from '../components/UserDropdown';
import LocationAutocomplete from '../components/LocationAutocomplete';

interface Hotel {
  id: number;
  tenKhachSan: string;
  diaChi: string;
  thanhPho: string;
  soSao: number;
  moTa: string;
  hinhAnh: string | null;
  giaThapNhat: number;
  danhGiaTB: number | null;
  quocGia: {
    tenQuocGia: string;
  };
  phong: any[];
  soDanhGia?: number;
}

function KhachSanContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const [hotels, setHotels] = useState<Hotel[]>([]);
  const [loading, setLoading] = useState(true);
  const [city, setCity] = useState(searchParams.get('thanhPho') || 'Đà Nẵng');
  const [checkIn, setCheckIn] = useState(searchParams.get('ngayNhanPhong') || '');
  const [checkOut, setCheckOut] = useState(searchParams.get('ngayTraPhong') || '');
  const [adults, setAdults] = useState(parseInt(searchParams.get('soNguoi') || '2'));
  const [children, setChildren] = useState(0);
  const [rooms, setRooms] = useState(parseInt(searchParams.get('soPhong') || '1'));
  const [showGuestPicker, setShowGuestPicker] = useState(false);
  const guestPickerRef = useRef<HTMLDivElement>(null);

  // Filters
  const [priceRange, setPriceRange] = useState([0, 24000000]);
  const [starFilter, setStarFilter] = useState<number[]>([]);
  const [sortBy, setSortBy] = useState('popular');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('list');

  useEffect(() => {
    // Set default dates
    if (!checkIn) {
      const tomorrow = new Date();
      tomorrow.setDate(tomorrow.getDate() + 1);
      setCheckIn(tomorrow.toISOString().split('T')[0]);
    }
    if (!checkOut) {
      const dayAfter = new Date();
      dayAfter.setDate(dayAfter.getDate() + 3);
      setCheckOut(dayAfter.toISOString().split('T')[0]);
    }
  }, []);

  // Load hotels on initial mount and when URL params change
  useEffect(() => {
    const urlCity = searchParams.get('thanhPho');
    const urlCheckIn = searchParams.get('ngayNhanPhong');
    const urlCheckOut = searchParams.get('ngayTraPhong');
    const urlAdults = searchParams.get('soNguoi');
    const urlRooms = searchParams.get('soPhong');

    // Update state from URL
    if (urlCity && urlCity !== city) setCity(urlCity);
    if (urlCheckIn && urlCheckIn !== checkIn) setCheckIn(urlCheckIn);
    if (urlCheckOut && urlCheckOut !== checkOut) setCheckOut(urlCheckOut);
    if (urlAdults && parseInt(urlAdults) !== adults) setAdults(parseInt(urlAdults));
    if (urlRooms && parseInt(urlRooms) !== rooms) setRooms(parseInt(urlRooms));

    // Fetch hotels
    loadHotels();
  }, [searchParams]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (guestPickerRef.current && !guestPickerRef.current.contains(event.target as Node)) {
        setShowGuestPicker(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const loadHotels = async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams({
        thanhPho: city,
        ...(checkIn && { ngayNhanPhong: checkIn }),
        ...(checkOut && { ngayTraPhong: checkOut }),
        soNguoi: adults.toString(),
        soPhong: rooms.toString(),
      });

      const res = await fetch(`http://localhost:5000/hotels/search?${params}`);
      if (!res.ok) {
        console.error('API returned status:', res.status);
        setHotels([]);
        return;
      }
      const data = await res.json();
      // Ensure data is array
      setHotels(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error('Lỗi tìm khách sạn:', error);
      setHotels([]);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = () => {
    // Update URL with new search parameters
    const params = new URLSearchParams({
      thanhPho: city,
      ...(checkIn && { ngayNhanPhong: checkIn }),
      ...(checkOut && { ngayTraPhong: checkOut }),
      soNguoi: adults.toString(),
      soPhong: rooms.toString(),
    });
    router.push(`/khachsan?${params.toString()}`);
  };

  const calculateNights = () => {
    if (!checkIn || !checkOut) return 0;
    const start = new Date(checkIn);
    const end = new Date(checkOut);
    return Math.ceil((end.getTime() - start.getTime()) / (1000 * 60 * 60 * 24));
  };

  const formatDate = (dateStr: string) => {
    if (!dateStr) return '';
    const date = new Date(dateStr);
    return date.toLocaleDateString('vi-VN', { day: '2-digit', month: '2-digit', year: 'numeric' });
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND',
    }).format(amount);
  };

  const filteredHotels = Array.isArray(hotels) ? hotels.filter(hotel => {
    const price = Number(hotel.giaThapNhat) || Number(hotel.phong[0]?.giaTheoNgay) || 0;
    if (price < priceRange[0] || price > priceRange[1]) return false;
    if (starFilter.length > 0 && !starFilter.includes(hotel.soSao)) return false;
    return true;
  }) : [];

  const nights = calculateNights();

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <Link href="/" className="flex items-center space-x-2">
              <span className="text-2xl">✈️</span>
              <span className="text-xl font-bold text-blue-600">BayNhanh</span>
            </Link>
            <nav className="hidden md:flex items-center space-x-6">
              <Link href="/" className="text-gray-700 hover:text-blue-600">Vé máy bay</Link>
              <Link href="/khachsan" className="text-blue-600 font-semibold border-b-2 border-blue-600">Khách sạn</Link>
              <UserDropdown />
            </nav>
          </div>
        </div>
      </header>

      {/* Search Bar */}
      <div className="bg-blue-600 py-6">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-white rounded-xl shadow-lg p-4">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              {/* Location */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">📍 Địa điểm</label>
                <LocationAutocomplete
                  value={city}
                  onChange={setCity}
                  placeholder="Nhập thành phố"
                />
              </div>

              {/* Check-in/Check-out */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">📅 Ngày nhận - trả phòng</label>
                <div className="flex gap-2">
                  <input
                    type="date"
                    value={checkIn}
                    onChange={(e) => setCheckIn(e.target.value)}
                    className="flex-1 px-3 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none text-sm"
                  />
                  <input
                    type="date"
                    value={checkOut}
                    onChange={(e) => setCheckOut(e.target.value)}
                    className="flex-1 px-3 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none text-sm"
                  />
                </div>
                {nights > 0 && <p className="text-xs text-gray-500 mt-1">Thời gian: {nights} Đêm</p>}
              </div>

              {/* Guests & Rooms */}
              <div className="relative" ref={guestPickerRef}>
                <label className="block text-sm font-medium text-gray-700 mb-1">👥 Khách & Phòng</label>
                <button
                  onClick={() => setShowGuestPicker(!showGuestPicker)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg text-left bg-white hover:border-blue-500 focus:ring-2 focus:ring-blue-500 outline-none"
                >
                  {adults} người lớn, {children} Trẻ em, {rooms} phòng
                </button>
                
                {showGuestPicker && (
                  <div className="absolute top-full mt-2 w-full bg-white border border-gray-200 rounded-lg shadow-xl z-50 p-4">
                    <div className="space-y-4">
                      <div className="flex justify-between items-center">
                        <span className="text-sm font-medium">Người lớn</span>
                        <div className="flex items-center gap-3">
                          <button
                            onClick={() => setAdults(Math.max(1, adults - 1))}
                            className="w-8 h-8 rounded-full border border-gray-300 hover:border-blue-500"
                          >−</button>
                          <span className="w-8 text-center">{adults}</span>
                          <button
                            onClick={() => setAdults(adults + 1)}
                            className="w-8 h-8 rounded-full border border-gray-300 hover:border-blue-500"
                          >+</button>
                        </div>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-sm font-medium">Trẻ em</span>
                        <div className="flex items-center gap-3">
                          <button
                            onClick={() => setChildren(Math.max(0, children - 1))}
                            className="w-8 h-8 rounded-full border border-gray-300 hover:border-blue-500"
                          >−</button>
                          <span className="w-8 text-center">{children}</span>
                          <button
                            onClick={() => setChildren(children + 1)}
                            className="w-8 h-8 rounded-full border border-gray-300 hover:border-blue-500"
                          >+</button>
                        </div>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-sm font-medium">Số phòng</span>
                        <div className="flex items-center gap-3">
                          <button
                            onClick={() => setRooms(Math.max(1, rooms - 1))}
                            className="w-8 h-8 rounded-full border border-gray-300 hover:border-blue-500"
                          >−</button>
                          <span className="w-8 text-center">{rooms}</span>
                          <button
                            onClick={() => setRooms(rooms + 1)}
                            className="w-8 h-8 rounded-full border border-gray-300 hover:border-blue-500"
                          >+</button>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </div>

              {/* Search Button */}
              <div className="flex items-end">
                <button
                  onClick={handleSearch}
                  className="w-full px-6 py-3 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700 transition-colors"
                >
                  🔍 Tìm khách sạn
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="flex gap-6">
          {/* Sidebar Filters */}
          <aside className="w-64 flex-shrink-0">
            <div className="bg-white rounded-lg shadow-sm p-4 sticky top-24">
              {/* Price Range */}
              <div className="mb-6">
                <h3 className="font-semibold mb-3">Khoảng giá</h3>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm">{formatCurrency(priceRange[0])}</span>
                  <span className="text-sm">{formatCurrency(priceRange[1])}</span>
                </div>
                <input
                  type="range"
                  min="0"
                  max="24000000"
                  step="100000"
                  value={priceRange[1]}
                  onChange={(e) => setPriceRange([0, parseInt(e.target.value)])}
                  className="w-full"
                />
              </div>

              {/* Star Filter */}
              <div className="mb-6">
                <h3 className="font-semibold mb-3">Hạng sao</h3>
                {[5, 4, 3].map(star => (
                  <label key={star} className="flex items-center mb-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={starFilter.includes(star)}
                      onChange={(e) => {
                        if (e.target.checked) {
                          setStarFilter([...starFilter, star]);
                        } else {
                          setStarFilter(starFilter.filter(s => s !== star));
                        }
                      }}
                      className="mr-2"
                    />
                    <span className="text-sm">{'⭐'.repeat(star)} {star} sao</span>
                  </label>
                ))}
              </div>

              {/* Popular Filters */}
              <div>
                <h3 className="font-semibold mb-3">Lọc phổ biến</h3>
                <label className="flex items-center mb-2 cursor-pointer">
                  <input type="checkbox" className="mr-2" />
                  <span className="text-sm">🔥 Sale cuối năm</span>
                </label>
                <label className="flex items-center mb-2 cursor-pointer">
                  <input type="checkbox" className="mr-2" />
                  <span className="text-sm">💰 Cam kết giá tốt</span>
                </label>
                <label className="flex items-center mb-2 cursor-pointer">
                  <input type="checkbox" className="mr-2" />
                  <span className="text-sm">⭐ 8+ Ấn tượng</span>
                </label>
              </div>
            </div>
          </aside>

          {/* Hotel List */}
          <main className="flex-1">
            {/* Header */}
            <div className="bg-white rounded-lg shadow-sm p-4 mb-4">
              <div className="flex items-center justify-between">
                <div>
                  <h1 className="text-2xl font-bold text-gray-900">{city}</h1>
                  <p className="text-gray-600">{filteredHotels.length} nơi lưu trú được tìm thấy</p>
                </div>
                <div className="flex items-center gap-4">
                  <select
                    value={sortBy}
                    onChange={(e) => setSortBy(e.target.value)}
                    className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                  >
                    <option value="popular">Độ phổ biến</option>
                    <option value="price_asc">Giá: Thấp đến cao</option>
                    <option value="price_desc">Giá: Cao đến thấp</option>
                    <option value="rating">Đánh giá cao nhất</option>
                  </select>
                  <div className="flex gap-2">
                    <button
                      onClick={() => setViewMode('list')}
                      className={`p-2 rounded ${viewMode === 'list' ? 'bg-blue-100 text-blue-600' : 'bg-gray-100'}`}
                    >
                      ☰
                    </button>
                    <button
                      onClick={() => setViewMode('grid')}
                      className={`p-2 rounded ${viewMode === 'grid' ? 'bg-blue-100 text-blue-600' : 'bg-gray-100'}`}
                    >
                      ▦
                    </button>
                  </div>
                </div>
              </div>
            </div>

            {/* Loading */}
            {loading && (
              <div className="text-center py-12">
                <div className="inline-block animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-600"></div>
                <p className="mt-4 text-gray-600">Đang tìm kiếm khách sạn...</p>
              </div>
            )}

            {/* Hotel Cards */}
            {!loading && filteredHotels.length === 0 && (
              <div className="text-center py-12 bg-white rounded-lg">
                <p className="text-gray-600">Không tìm thấy khách sạn phù hợp</p>
              </div>
            )}

            <div className="space-y-4">
              {filteredHotels.map(hotel => {
                const price = Number(hotel.giaThapNhat) || Number(hotel.phong[0]?.giaTheoNgay) || 0;
                const totalPrice = price * (nights || 1);
                const oldPrice = price * 1.25;
                const rating = Number(hotel.danhGiaTB) || 8.5;
                const reviewCount = hotel.soDanhGia || Math.floor(Math.random() * 1000) + 100;

                return (
                  <div key={hotel.id} className="bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow overflow-hidden">
                    <div className="flex gap-4 p-4">
                      {/* Image */}
                      <div className="relative w-64 h-48 flex-shrink-0">
                        <img
                          src={hotel.hinhAnh || 'https://images.unsplash.com/photo-1566073771259-6a8506099945?w=400'}
                          alt={hotel.tenKhachSan}
                          className="w-full h-full object-cover rounded-lg"
                        />
                        {rating >= 9.0 && (
                          <div className="absolute top-2 right-2 bg-blue-500 text-white px-3 py-1 rounded-full text-xs font-semibold">
                            Sale Cuối năm
                          </div>
                        )}
                      </div>

                      {/* Info */}
                      <div className="flex-1 flex flex-col justify-between">
                        <div>
                          <div className="flex items-start justify-between mb-2">
                            <div>
                              <Link 
                                href={`/khachsan/${hotel.id}?ngayNhanPhong=${checkIn}&ngayTraPhong=${checkOut}&soNguoi=${adults}&soPhong=${rooms}`}
                                className="text-xl font-semibold text-gray-900 hover:text-blue-600 cursor-pointer"
                              >
                                {hotel.tenKhachSan}
                              </Link>
                              <div className="flex items-center gap-2 mt-1">
                                <span className="px-2 py-1 bg-blue-100 text-blue-700 text-xs font-medium rounded">
                                  🏨 Khách sạn
                                </span>
                                <span className="text-yellow-500">
                                  {'⭐'.repeat(hotel.soSao)}
                                </span>
                              </div>
                            </div>
                            <div className="text-right">
                              <div className="flex items-center gap-2 mb-1">
                                <span className="text-2xl font-bold text-blue-600">{rating.toFixed(1)}/10</span>
                                <span className="text-sm font-semibold text-gray-700">Rất tốt</span>
                              </div>
                              <p className="text-xs text-gray-500">({reviewCount} đánh giá)</p>
                            </div>
                          </div>
                          
                          <p className="text-sm text-gray-600 mb-2">📍 {hotel.diaChi}</p>
                          <p className="text-sm text-gray-700 line-clamp-2">{hotel.moTa}</p>
                        </div>

                        <div className="flex items-end justify-between mt-4">
                          <div className="text-sm text-gray-600">
                            <p>Quầy bar</p>
                          </div>
                          <div className="text-right">
                            {rating >= 9.0 && (
                              <div className="text-xs line-through text-gray-400 mb-1">
                                {formatCurrency(oldPrice)}
                              </div>
                            )}
                            <div className="text-3xl font-bold text-red-600 mb-1">
                              {formatCurrency(price)}
                            </div>
                            <p className="text-xs text-gray-600 mb-2">
                              Tổng {formatCurrency(totalPrice)} cho {nights || 1} phòng
                            </p>
                            {rating >= 9.0 && (
                              <p className="text-xs text-gray-500 mb-2">Bao gồm thuế và phí</p>
                            )}
                            <Link
                              href={`/khachsan/${hotel.id}?ngayNhanPhong=${checkIn}&ngayTraPhong=${checkOut}&soNguoi=${adults}&soPhong=${rooms}`}
                              className="block w-full text-center px-6 py-3 bg-orange-500 text-white rounded-lg font-semibold hover:bg-orange-600 transition-colors"
                            >
                              Chọn phòng
                            </Link>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </main>
        </div>
      </div>
    </div>
  );
}

export default function KhachSanPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-600"></div>
      </div>
    }>
      <KhachSanContent />
    </Suspense>
  );
}
