'use client';

import { useState, useEffect, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import UserDropdown from '../../components/UserDropdown';

interface Airport {
  id: number;
  maSanBay: string;
  tenSanBay: string;
  thanhPho: string;
}

interface Flight {
  changBayId: number;
  chuyenBayId: number;
  soHieuChuyenBay: string;
  hang: {
    maIata: string;
    tenHang: string;
    logo?: string;
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
  gioDi: string;
  gioDen: string;
  thoiGianBayPhut: number;
  giaVe: {
    giaVeId: number;
    hangVe: string;
    tenHangVe: string;
    nhomGia: string;
    nhomGiaId: number;
    giaCoSo: number;
    tongGia: number;
    soChoCon: number;
  }[];
}

function KetQuaContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [flights, setFlights] = useState<Flight[]>([]);
  const [loading, setLoading] = useState(true);
  const [sortBy, setSortBy] = useState('GIA_THAP');
  const [selectedAirlines, setSelectedAirlines] = useState<string[]>([]);
  const [priceRange, setPriceRange] = useState([0, 10000000]);
  const [airports, setAirports] = useState<Airport[]>([]);
  const [showSearchForm, setShowSearchForm] = useState(false);
  const [searchInfo, setSearchInfo] = useState({
    sanBayDi: '',
    sanBayDen: '',
    ngayDi: '',
    nguoiLon: 1,
    treEm: 0,
  });
  const [searchForm, setSearchForm] = useState({
    loaiChuyen: 'MOT_CHIEU',
    sanBayDiId: '',
    sanBayDenId: '',
    ngayDi: '',
    ngayVe: '',
    nguoiLon: 1,
    treEm: 0,
    soSinh: 0,
    hangVe: 'ECONOMY',
  });

  useEffect(() => {
    loadAirports();
  }, []);

  useEffect(() => {
    // Initialize search form from URL params
    const sanBayDiId = searchParams.get('sanBayDiId') || '';
    const sanBayDenId = searchParams.get('sanBayDenId') || '';
    const ngayDi = searchParams.get('ngayDi') || '';
    const nguoiLon = parseInt(searchParams.get('nguoiLon') || '1');
    const treEm = parseInt(searchParams.get('treEm') || '0');
    const soSinh = parseInt(searchParams.get('soSinh') || '0');
    
    setSearchForm({
      loaiChuyen: 'MOT_CHIEU',
      sanBayDiId,
      sanBayDenId,
      ngayDi,
      ngayVe: '',
      nguoiLon,
      treEm,
      soSinh,
      hangVe: 'ECONOMY',
    });
    
    // Tìm kiếm lại khi URL thay đổi
    if (sanBayDiId && sanBayDenId && ngayDi) {
      searchFlights();
    }
  }, [searchParams]);

  const loadAirports = async () => {
    try {
      const res = await fetch('http://localhost:5000/api/catalog/san-bay');
      const data = await res.json();
      setAirports(data);
    } catch (error) {
      console.error('Error loading airports:', error);
    }
  };

  const searchFlights = async () => {
    setLoading(true);
    try {
      const sanBayDiId = searchParams.get('sanBayDiId');
      const sanBayDenId = searchParams.get('sanBayDenId');
      const ngayDi = searchParams.get('ngayDi');
      const nguoiLon = parseInt(searchParams.get('nguoiLon') || '1');
      const treEm = parseInt(searchParams.get('treEm') || '0');

      console.log('Search params:', { sanBayDiId, sanBayDenId, ngayDi, nguoiLon, treEm });

      if (!sanBayDiId || !sanBayDenId || !ngayDi) {
        console.error('Missing required search parameters');
        setLoading(false);
        return;
      }

      // Store search info for display
      setSearchInfo({
        sanBayDi: sanBayDiId,
        sanBayDen: sanBayDenId,
        ngayDi: ngayDi,
        nguoiLon,
        treEm,
      });

      const requestBody = {
        sanBayDiId: parseInt(sanBayDiId),
        sanBayDenId: parseInt(sanBayDenId),
        ngayDi,
        loaiChuyen: 'ONE_WAY',
        nguoiLon,
        treEm,
        soSinh: 0,
      };

      console.log('Request body:', requestBody);

      const res = await fetch('http://localhost:5000/api/search', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(requestBody),
      });

      console.log('Response status:', res.status);

      if (!res.ok) {
        const errorText = await res.text();
        console.error('API Error:', errorText);
        throw new Error('Search failed');
      }

      const data = await res.json();
      console.log('Search results:', data);
      console.log('Number of flights:', data.ketQua?.length || 0);
      setFlights(data.ketQua || []);
    } catch (error) {
      console.error('Lỗi tìm kiếm:', error);
      setFlights([]);
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

  const formatDuration = (minutes: number) => {
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    return `${hours}g ${mins}ph`;
  };
  const handleNewSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    const params = new URLSearchParams({
      sanBayDiId: searchForm.sanBayDiId,
      sanBayDenId: searchForm.sanBayDenId,
      ngayDi: searchForm.ngayDi,
      loaiChuyen: searchForm.loaiChuyen,
      nguoiLon: searchForm.nguoiLon.toString(),
      treEm: searchForm.treEm.toString(),
      soSinh: searchForm.soSinh.toString(),
    });
    router.push(`/ket-qua?${params.toString()}`);
    setShowSearchForm(false);
  };
  const filteredFlights = Array.isArray(flights) ? flights
    .filter(flight => {
      if (selectedAirlines.length > 0 && !selectedAirlines.includes(flight.hang?.maIata || '')) {
        return false;
      }
      const prices = flight.giaVe?.map(g => g.tongGia) || [];
      if (prices.length === 0) return false;
      const minPrice = Math.min(...prices);
      return minPrice >= priceRange[0] && minPrice <= priceRange[1];
    })
    .sort((a, b) => {
      const pricesA = a.giaVe?.map(g => g.tongGia) || [0];
      const pricesB = b.giaVe?.map(g => g.tongGia) || [0];
      const minPriceA = Math.min(...pricesA);
      const minPriceB = Math.min(...pricesB);

      if (sortBy === 'GIA_THAP') return minPriceA - minPriceB;
      if (sortBy === 'GIA_CAO') return minPriceB - minPriceA;
      if (sortBy === 'GIO_BAY') return new Date(a.gioDi).getTime() - new Date(b.gioDi).getTime();
      return 0;
    }) : [];

  const airlines = Array.isArray(flights) && flights.length > 0
    ? Array.from(new Set(flights.map(f => f.hang?.maIata).filter(Boolean)))
    : [];

  const handleSelectFlight = (changBayId: number, hangVeId: number, giaBan: number) => {
    // Validate parameters before converting to string
    if (!changBayId || !hangVeId) {
      console.error('Invalid flight selection: missing changBayId or hangVeId');
      return;
    }
    
    console.log('Selecting flight:', { changBayId, hangVeId, giaBan });
    
    const params = new URLSearchParams();
    params.set('changBayId', changBayId.toString());
    params.set('hangVeId', hangVeId.toString());
    params.set('giaBan', giaBan.toString());
    params.set('nguoiLon', searchParams.get('nguoiLon') || '1');
    params.set('treEm', searchParams.get('treEm') || '0');
    router.push(`/thong-tin-hanh-khach?${params.toString()}`);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {/* Search Summary - Chuyến Bay Của Bạn */}
        <div className="bg-gradient-to-r from-blue-500 to-cyan-500 rounded-xl shadow-lg p-6 mb-6 text-white">
          <div className="flex items-center justify-between flex-wrap gap-4">
            <div>
              <p className="text-sm opacity-90 mb-2">Chuyến bay của bạn</p>
              <div className="flex items-center gap-4 text-lg md:text-xl font-bold">
                <div className="text-center">
                  <p>{flights.length > 0 ? flights[0].sanBayDi.thanhPho : searchInfo.sanBayDi}</p>
                  <p className="text-sm font-normal opacity-90">
                    ({flights.length > 0 ? flights[0].sanBayDi.maIata : searchInfo.sanBayDi})
                  </p>
                </div>
                <span className="text-2xl">→</span>
                <div className="text-center">
                  <p>{flights.length > 0 ? flights[0].sanBayDen.thanhPho : searchInfo.sanBayDen}</p>
                  <p className="text-sm font-normal opacity-90">
                    ({flights.length > 0 ? flights[0].sanBayDen.maIata : searchInfo.sanBayDen})
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-6 mt-3 text-sm opacity-90">
                <span>📅 {new Date(searchInfo.ngayDi).toLocaleDateString('vi-VN', {
                  weekday: 'short',
                  day: '2-digit',
                  month: '2-digit',
                  year: 'numeric'
                })}</span>
                <span>|</span>
                <span>
                  {searchInfo.nguoiLon} hành khách
                  {searchInfo.treEm > 0 && ` (${searchInfo.treEm} trẻ em)`}
                </span>
                <span>|</span>
                <span>Phổ thông</span>
              </div>
            </div>
            <button
              onClick={() => setShowSearchForm(!showSearchForm)}
              className="bg-white text-blue-600 px-6 py-3 rounded-lg hover:bg-gray-50 font-semibold shadow-md transition flex items-center gap-2"
            >
              <span>🔍</span>
              <span>Đổi tìm kiếm</span>
            </button>
          </div>
        </div>

        {/* Search Form Modal/Expandable */}
        {showSearchForm && (
          <div className="bg-white rounded-xl shadow-xl p-8 mb-6 max-w-5xl mx-auto">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold text-gray-800">🔍 Tìm chuyến bay mới</h2>
              <button
                onClick={() => setShowSearchForm(false)}
                className="text-gray-500 hover:text-gray-700 text-2xl"
              >
                ✕
              </button>
            </div>

            <div className="flex gap-4 mb-6">
              <button
                onClick={() => setSearchForm({ ...searchForm, loaiChuyen: 'MOT_CHIEU' })}
                className={`px-6 py-2 rounded-lg font-medium ${
                  searchForm.loaiChuyen === 'MOT_CHIEU'
                    ? 'bg-blue-600 text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                Một chiều
              </button>
              <button
                onClick={() => setSearchForm({ ...searchForm, loaiChuyen: 'KHU_HOI' })}
                className={`px-6 py-2 rounded-lg font-medium ${
                  searchForm.loaiChuyen === 'KHU_HOI'
                    ? 'bg-blue-600 text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                Khứ hồi
              </button>
              <button
                onClick={() => setSearchForm({ ...searchForm, loaiChuyen: 'NHIEU_THANH_PHO' })}
                className={`px-6 py-2 rounded-lg font-medium ${
                  searchForm.loaiChuyen === 'NHIEU_THANH_PHO'
                    ? 'bg-blue-600 text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                Nhiều thành phố
              </button>
            </div>

            <form onSubmit={handleNewSearch} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Từ */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    📍 Từ
                  </label>
                  <select
                    value={searchForm.sanBayDiId}
                    onChange={(e) => setSearchForm({ ...searchForm, sanBayDiId: e.target.value })}
                    className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    required
                  >
                    <option value="">Chọn điểm đi</option>
                    {airports.map((airport) => (
                      <option key={airport.id} value={airport.id}>
                        {airport.maIata} - {airport.tenSanBay} ({airport.thanhPho})
                      </option>
                    ))}
                  </select>
                </div>

                {/* Đến */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    📍 Đến
                  </label>
                  <select
                    value={searchForm.sanBayDenId}
                    onChange={(e) => setSearchForm({ ...searchForm, sanBayDenId: e.target.value })}
                    className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    required
                  >
                    <option value="">Chọn điểm đến</option>
                    {airports.map((airport) => (
                      <option key={airport.id} value={airport.id}>
                        {airport.maIata} - {airport.tenSanBay} ({airport.thanhPho})
                      </option>
                    ))}
                  </select>
                </div>

                {/* Ngày đi */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    📅 Ngày đi
                  </label>
                  <input
                    type="date"
                    value={searchForm.ngayDi}
                    onChange={(e) => setSearchForm({ ...searchForm, ngayDi: e.target.value })}
                    min={new Date().toISOString().split('T')[0]}
                    className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    required
                  />
                </div>

                {/* Ngày về */}
                {searchForm.loaiChuyen === 'KHU_HOI' && (
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      📅 Ngày về
                    </label>
                    <input
                      type="date"
                      value={searchForm.ngayVe}
                      onChange={(e) => setSearchForm({ ...searchForm, ngayVe: e.target.value })}
                      min={searchForm.ngayDi || new Date().toISOString().split('T')[0]}
                      className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>
                )}

                {/* Hạng vé */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    💺 Hạng vé
                  </label>
                  <select
                    value={searchForm.hangVe}
                    onChange={(e) => setSearchForm({ ...searchForm, hangVe: e.target.value })}
                    className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    <option value="ECONOMY">Phổ thông</option>
                    <option value="BUSINESS">Thương gia</option>
                    <option value="FIRST">Hạng nhất</option>
                  </select>
                </div>
              </div>

              {/* Hành khách */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    👤 Người lớn
                  </label>
                  <input
                    type="number"
                    min="1"
                    max="9"
                    value={searchForm.nguoiLon}
                    onChange={(e) => setSearchForm({ ...searchForm, nguoiLon: parseInt(e.target.value) })}
                    className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                  <p className="text-xs text-gray-500 mt-1">12 tuổi trở lên</p>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    👦 Trẻ em
                  </label>
                  <input
                    type="number"
                    min="0"
                    max="9"
                    value={searchForm.treEm}
                    onChange={(e) => setSearchForm({ ...searchForm, treEm: parseInt(e.target.value) })}
                    className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                  <p className="text-xs text-gray-500 mt-1">2-11 tuổi</p>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    👶 Sơ sinh
                  </label>
                  <input
                    type="number"
                    min="0"
                    max="9"
                    value={searchForm.soSinh}
                    onChange={(e) => setSearchForm({ ...searchForm, soSinh: parseInt(e.target.value) })}
                    className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                  <p className="text-xs text-gray-500 mt-1">Dưới 2 tuổi</p>
                </div>
              </div>

              <button
                type="submit"
                className="w-full bg-gradient-to-r from-blue-600 to-blue-700 text-white py-4 rounded-lg font-semibold text-lg hover:from-blue-700 hover:to-blue-800 transition shadow-lg flex items-center justify-center gap-2"
              >
                <span>🔍</span>
                <span>Tìm chuyến bay</span>
              </button>
            </form>
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Filters Sidebar */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-lg shadow-sm p-6 sticky top-24">
              <h3 className="font-bold text-lg mb-4">🎛️ Bộ lọc</h3>

              {/* Sort */}
              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Sắp xếp theo
                </label>
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2"
                >
                  <option value="GIA_THAP">Giá thấp nhất</option>
                  <option value="GIA_CAO">Giá cao nhất</option>
                  <option value="GIO_BAY">Giờ bay sớm nhất</option>
                </select>
              </div>

              {/* Airline Filter */}
              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Hãng hàng không
                </label>
                <div className="space-y-2">
                  {airlines.map(airline => (
                    <label key={airline} className="flex items-center gap-2">
                      <input
                        type="checkbox"
                        checked={selectedAirlines.includes(airline)}
                        onChange={(e) => {
                          if (e.target.checked) {
                            setSelectedAirlines([...selectedAirlines, airline]);
                          } else {
                            setSelectedAirlines(selectedAirlines.filter(a => a !== airline));
                          }
                        }}
                        className="w-4 h-4 text-blue-600 rounded"
                      />
                      <span className="text-sm">{airline}</span>
                    </label>
                  ))}
                </div>
              </div>

              {/* Price Range */}
              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Khoảng giá
                </label>
                <div className="space-y-2">
                  <input
                    type="range"
                    min="0"
                    max="10000000"
                    step="100000"
                    value={priceRange[1]}
                    onChange={(e) => setPriceRange([0, parseInt(e.target.value)])}
                    className="w-full"
                  />
                  <div className="flex justify-between text-sm text-gray-600">
                    <span>0₫</span>
                    <span>{formatCurrency(priceRange[1])}</span>
                  </div>
                </div>
              </div>

              <button
                onClick={() => {
                  setSelectedAirlines([]);
                  setPriceRange([0, 10000000]);
                  setSortBy('GIA_THAP');
                }}
                className="w-full text-blue-600 hover:text-blue-700 text-sm font-medium"
              >
                🔄 Đặt lại bộ lọc
              </button>
            </div>
          </div>

          {/* Flight Results */}
          <div className="lg:col-span-3">
            {loading ? (
              <div className="text-center py-20">
                <div className="inline-block animate-spin text-6xl mb-4">✈️</div>
                <p className="text-gray-600 text-lg">Đang tìm kiếm chuyến bay phù hợp...</p>
              </div>
            ) : filteredFlights.length === 0 ? (
              <div className="bg-white rounded-lg shadow-sm p-12 text-center">
                <div className="text-6xl mb-4">😔</div>
                <h3 className="text-xl font-bold mb-2">Không tìm thấy chuyến bay</h3>
                <p className="text-gray-600 mb-6">
                  Vui lòng thử thay đổi tiêu chí tìm kiếm hoặc ngày bay
                </p>
                <button
                  onClick={() => router.push('/')}
                  className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700"
                >
                  Tìm kiếm lại
                </button>
              </div>
            ) : (
              <>
                <div className="mb-4 text-gray-600">
                  Tìm thấy <span className="font-bold text-blue-600">{filteredFlights.length}</span> chuyến bay
                </div>

                <div className="space-y-4">
                  {filteredFlights.map((flight) => (
                    <div key={flight.changBayId} className="bg-white rounded-lg shadow-sm hover:shadow-md transition overflow-hidden">
                      {/* Flight Header */}
                      <div className="p-6 border-b">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-4">
                            <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center text-2xl">
                              ✈️
                            </div>
                            <div>
                              <p className="font-bold text-lg">{flight.hang?.tenHang || 'Airline'}</p>
                              <p className="text-sm text-gray-600">{flight.soHieuChuyenBay}</p>
                            </div>
                          </div>
                          <div className="text-right">
                            <p className="text-sm text-gray-600">Thời gian bay</p>
                            <p className="font-semibold">{formatDuration(flight.thoiGianBayPhut)}</p>
                          </div>
                        </div>

                        {/* Flight Timeline */}
                        <div className="mt-6 flex items-center">
                          <div className="flex-1">
                            <p className="text-3xl font-bold">{new Date(flight.gioDi).toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' })}</p>
                            <p className="text-gray-600 mt-1">{flight.sanBayDi.maIata}</p>
                            <p className="text-sm text-gray-500">{flight.sanBayDi.thanhPho}</p>
                          </div>

                          <div className="flex-1 px-4">
                            <div className="relative">
                              <div className="border-t-2 border-gray-300 border-dashed"></div>
                              <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-white px-2">
                                <span className="text-2xl">✈️</span>
                              </div>
                            </div>
                            <p className="text-center text-sm text-gray-600 mt-2">
                              Bay thẳng
                            </p>
                          </div>

                          <div className="flex-1 text-right">
                            <p className="text-3xl font-bold">{new Date(flight.gioDen).toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' })}</p>
                            <p className="text-gray-600 mt-1">{flight.sanBayDen.maIata}</p>
                            <p className="text-sm text-gray-500">{flight.sanBayDen.thanhPho}</p>
                          </div>
                        </div>
                      </div>

                      {/* Fare Options */}
                      <div className="p-6">
                        <p className="font-semibold mb-4">Chọn hạng vé:</p>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                          {flight.giaVe.map((fare) => (
                            <div
                              key={fare.giaVeId}
                              className="border-2 border-gray-200 rounded-lg p-4 hover:border-blue-500 transition cursor-pointer group"
                            >
                              <div className="flex justify-between items-start mb-3">
                                <div>
                                  <p className="font-bold text-lg">{fare.tenHangVe}</p>
                                  <p className="text-sm text-gray-600">{fare.nhomGia}</p>
                                </div>
                                {fare.soChoCon < 5 && (
                                  <span className="bg-red-100 text-red-600 text-xs px-2 py-1 rounded">
                                    Còn {fare.soChoCon} chỗ
                                  </span>
                                )}
                              </div>

                              <div className="space-y-2 mb-4 text-sm">
                                <div className="flex items-center gap-2 text-gray-600">
                                  <span>✓</span>
                                  <span>Hành lý xách tay 7kg</span>
                                </div>
                                <div className="flex items-center gap-2 text-gray-600">
                                  <span>✓</span>
                                  <span>
                                    {fare.tenHangVe?.includes('Eco') || fare.nhomGia?.includes('Eco') ? 'Hành lý ký gửi 20kg' : 'Hành lý ký gửi 30kg'}
                                  </span>
                                </div>
                                {fare.nhomGia?.includes('Flex') && (
                                  <div className="flex items-center gap-2 text-green-600">
                                    <span>✓</span>
                                    <span>Đổi vé miễn phí</span>
                                  </div>
                                )}
                              </div>

                              <div className="border-t pt-3">
                                {(fare.giaCoSo || 0) > (fare.tongGia || 0) && (
                                  <p className="text-sm text-gray-500 line-through">
                                    {formatCurrency(fare.giaCoSo || 0)}
                                  </p>
                                )}
                                <p className="text-2xl font-bold text-blue-600 mb-3">
                                  {formatCurrency(fare.tongGia || 0)}
                                </p>

                                <button
                                  onClick={() => handleSelectFlight(flight.changBayId, fare.nhomGiaId, fare.tongGia || 0)}
                                  className="w-full bg-blue-600 text-white py-3 rounded-lg font-semibold hover:bg-blue-700 group-hover:bg-blue-700 transition"
                                  disabled={fare.soChoCon === 0 || !flight.changBayId || !fare.nhomGiaId}
                                >
                                  {fare.soChoCon === 0 ? 'Hết chỗ' : 'Chọn'}
                                </button>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default function KetQuaPage() {
  return (
    <Suspense fallback={<div className="min-h-screen flex items-center justify-center">
      <div className="text-center">
        <div className="inline-block animate-spin text-6xl mb-4">✈️</div>
        <p className="text-gray-600">Đang tải...</p>
      </div>
    </div>}>
      <KetQuaContent />
    </Suspense>
  );
}
