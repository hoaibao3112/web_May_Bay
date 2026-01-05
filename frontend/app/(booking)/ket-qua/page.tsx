'use client';

import { useState, useEffect, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';

interface Flight {
  changBayId: number;
  chuyenBayId: number;
  soHieu: string;
  hangHangKhong: {
    maHang: string;
    tenHang: string;
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
  thoiGianBay: number;
  giaVe: {
    hangVeId: number;
    tenHang: string;
    giaGoc: number;
    giaBan: number;
    soChoCon: number;
    nhomGia: string;
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

  useEffect(() => {
    searchFlights();
  }, []);

  const searchFlights = async () => {
    setLoading(true);
    try {
      const sanBayDiId = searchParams.get('sanBayDiId');
      const sanBayDenId = searchParams.get('sanBayDenId');
      const ngayDi = searchParams.get('ngayDi');
      const nguoiLon = parseInt(searchParams.get('nguoiLon') || '1');
      const treEm = parseInt(searchParams.get('treEm') || '0');

      if (!sanBayDiId || !sanBayDenId || !ngayDi) {
        console.error('Missing required search parameters');
        setLoading(false);
        return;
      }

      const res = await fetch('http://localhost:5000/search', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          sanBayDiId: parseInt(sanBayDiId),
          sanBayDenId: parseInt(sanBayDenId),
          ngayDi,
          loaiChuyen: 'ONE_WAY',
          nguoiLon,
          treEm,
          soSinh: 0,
        }),
      });

      if (!res.ok) {
        throw new Error('Search failed');
      }

      const data = await res.json();
      console.log('Search results:', data);
      setFlights(data.chuyenBay || data || []);
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

  const filteredFlights = flights
    .filter(flight => {
      if (selectedAirlines.length > 0 && !selectedAirlines.includes(flight.hangHangKhong.maHang)) {
        return false;
      }
      const minPrice = Math.min(...flight.giaVe.map(g => g.giaBan));
      return minPrice >= priceRange[0] && minPrice <= priceRange[1];
    })
    .sort((a, b) => {
      const minPriceA = Math.min(...a.giaVe.map(g => g.giaBan));
      const minPriceB = Math.min(...b.giaVe.map(g => g.giaBan));
      
      if (sortBy === 'GIA_THAP') return minPriceA - minPriceB;
      if (sortBy === 'GIA_CAO') return minPriceB - minPriceA;
      if (sortBy === 'GIO_BAY') return a.gioKhoiHanh.localeCompare(b.gioKhoiHanh);
      return 0;
    });

  const airlines = Array.from(new Set(flights.map(f => f.hangHangKhong.maHang)));

  const handleSelectFlight = (changBayId: number, hangVeId: number, giaBan: number) => {
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
      {/* Header */}
      <nav className="bg-white shadow-sm sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 cursor-pointer" onClick={() => router.push('/')}>
              <span className="text-2xl">✈️</span>
              <span className="text-xl font-bold text-blue-600">BayNhanh</span>
            </div>
            <div className="flex items-center gap-6">
              <a href="/quan-ly-dat-cho" className="text-gray-600 hover:text-blue-600">Quản lý đặt chỗ</a>
              <a href="/auth/login" className="text-blue-600 font-medium">Đăng nhập</a>
            </div>
          </div>
        </div>
      </nav>

      <div className="container mx-auto px-4 py-6">
        {/* Search Summary */}
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
          <div className="flex items-center justify-between flex-wrap gap-4">
            <div className="flex items-center gap-6">
              <div>
                <p className="text-sm text-gray-600">Hành trình</p>
                <p className="font-semibold text-lg">
                  {searchParams.get('sanBayDiId')} → {searchParams.get('sanBayDenId')}
                </p>
              </div>
              <div>
                <p className="text-sm text-gray-600">Ngày bay</p>
                <p className="font-semibold">📅 {searchParams.get('ngayDi')}</p>
              </div>
              <div>
                <p className="text-sm text-gray-600">Hành khách</p>
                <p className="font-semibold">
                  👤 {searchParams.get('nguoiLon')} người lớn
                  {parseInt(searchParams.get('treEm') || '0') > 0 && `, ${searchParams.get('treEm')} trẻ em`}
                </p>
              </div>
            </div>
            <button
              onClick={() => router.push('/')}
              className="bg-white border border-blue-300 text-blue-600 px-6 py-2 rounded-lg hover:bg-blue-50 font-medium"
            >
              🔄 Thay đổi tìm kiếm
            </button>
          </div>
        </div>

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
                              <p className="font-bold text-lg">{flight.hangHangKhong.tenHang}</p>
                              <p className="text-sm text-gray-600">{flight.soHieu}</p>
                            </div>
                          </div>
                          <div className="text-right">
                            <p className="text-sm text-gray-600">Thời gian bay</p>
                            <p className="font-semibold">{formatDuration(flight.thoiGianBay)}</p>
                          </div>
                        </div>

                        {/* Flight Timeline */}
                        <div className="mt-6 flex items-center">
                          <div className="flex-1">
                            <p className="text-3xl font-bold">{flight.gioKhoiHanh}</p>
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
                            <p className="text-3xl font-bold">{flight.gioDen}</p>
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
                              key={fare.hangVeId}
                              className="border-2 border-gray-200 rounded-lg p-4 hover:border-blue-500 transition cursor-pointer group"
                            >
                              <div className="flex justify-between items-start mb-3">
                                <div>
                                  <p className="font-bold text-lg">{fare.tenHang}</p>
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
                                    {fare.tenHang.includes('Eco') ? 'Hành lý ký gửi 20kg' : 'Hành lý ký gửi 30kg'}
                                  </span>
                                </div>
                                {fare.nhomGia.includes('Flex') && (
                                  <div className="flex items-center gap-2 text-green-600">
                                    <span>✓</span>
                                    <span>Đổi vé miễn phí</span>
                                  </div>
                                )}
                              </div>

                              <div className="border-t pt-3">
                                {fare.giaGoc > fare.giaBan && (
                                  <p className="text-sm text-gray-500 line-through">
                                    {formatCurrency(fare.giaGoc)}
                                  </p>
                                )}
                                <p className="text-2xl font-bold text-blue-600 mb-3">
                                  {formatCurrency(fare.giaBan)}
                                </p>

                                <button
                                  onClick={() => handleSelectFlight(flight.changBayId, fare.hangVeId, fare.giaBan)}
                                  className="w-full bg-blue-600 text-white py-3 rounded-lg font-semibold hover:bg-blue-700 group-hover:bg-blue-700 transition"
                                  disabled={fare.soChoCon === 0}
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
