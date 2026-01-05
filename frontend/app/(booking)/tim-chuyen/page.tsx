'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';

interface Airport {
  id: number;
  maIata: string;
  tenSanBay: string;
  thanhPho: string;
}

export default function TimChuyenBayPage() {
  const router = useRouter();
  const [airports, setAirports] = useState<Airport[]>([]);
  const [loading, setLoading] = useState(false);
  const [loadingAirports, setLoadingAirports] = useState(true);

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
    fetchAirports();
  }, []);

  const fetchAirports = async () => {
    setLoadingAirports(true);
    try {
      const apiUrl = 'http://localhost:5000/catalog/san-bay';
      console.log('Fetching airports from:', apiUrl);
      
      const res = await fetch(apiUrl, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });
      
      console.log('Response status:', res.status);
      console.log('Response headers:', res.headers);
      console.log('Response URL:', res.url);
      
      if (!res.ok) {
        const text = await res.text();
        console.error('Response text:', text.substring(0, 200));
        throw new Error(`HTTP error! status: ${res.status}`);
      }
      
      const data = await res.json();
      console.log('Airports loaded:', data);
      console.log('Number of airports:', data.length);
      
      if (Array.isArray(data) && data.length > 0) {
        setAirports(data);
      } else {
        console.error('Invalid airports data:', data);
        alert('Dữ liệu sân bay không hợp lệ');
      }
    } catch (error: any) {
      console.error('Lỗi tải sân bay:', error);
      console.error('Error details:', error.message);
      alert(`Không thể tải danh sách sân bay.\nLỗi: ${error.message}\n\nVui lòng kiểm tra:\n1. Backend đang chạy ở localhost:5000\n2. Mở Console (F12) để xem chi tiết`);
    } finally {
      setLoadingAirports(false);
    }
  };

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
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
    } catch (error) {
      console.error('Lỗi:', error);
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white">
      {/* Header */}
      <nav className="bg-white shadow-sm">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="text-2xl">✈️</span>
              <span className="text-xl font-bold text-blue-600">BayNhanh</span>
            </div>
            <div className="flex items-center gap-6">
              <a href="/quan-ly-dat-cho" className="text-gray-600 hover:text-blue-600">Quản lý đặt chỗ</a>
              <a href="/lien-he" className="text-gray-600 hover:text-blue-600">Liên hệ</a>
              <a href="/auth/login" className="text-blue-600 font-medium">Đăng nhập</a>
              <a href="/auth/register" className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700">
                Đăng ký
              </a>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <div className="relative bg-gradient-to-r from-blue-600 to-blue-800 text-white py-20">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute inset-0 bg-[url('/plane-pattern.svg')] bg-repeat"></div>
        </div>
        <div className="relative container mx-auto px-4 text-center">
          <h1 className="text-5xl font-bold mb-4">Khám phá thế giới cùng nhau</h1>
          <p className="text-xl mb-8">Tìm và đặt các chuyến bay giá tốt trên toàn thế giới. Bắt đầu hành trình của bạn ngay hôm nay.</p>
        </div>
      </div>

      {/* Search Form */}
      <div className="container mx-auto px-4 -mt-10">
        <div className="bg-white rounded-2xl shadow-xl p-8 max-w-5xl mx-auto">
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

          <form onSubmit={handleSearch} className="space-y-4">
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
                  disabled={loadingAirports}
                >
                  <option value="">
                    {loadingAirports ? 'Đang tải...' : airports.length === 0 ? 'Không có dữ liệu sân bay' : 'Chọn điểm đi'}
                  </option>
                  {airports.map((airport) => (
                    <option key={airport.id} value={airport.id}>
                      {airport.maIata} - {airport.tenSanBay} ({airport.thanhPho})
                    </option>
                  ))}
                </select>
                {!loadingAirports && airports.length === 0 && (
                  <p className="text-xs text-red-500 mt-1">
                    Không thể tải danh sách sân bay. Vui lòng refresh trang.
                  </p>
                )}
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
                  disabled={loadingAirports}
                >
                  <option value="">
                    {loadingAirports ? 'Đang tải...' : airports.length === 0 ? 'Không có dữ liệu sân bay' : 'Chọn điểm đến'}
                  </option>
                  {airports.map((airport) => (
                    <option key={airport.id} value={airport.id}>
                      {airport.maIata} - {airport.tenSanBay} ({airport.thanhPho})
                    </option>
                  ))}
                </select>
                {!loadingAirports && airports.length === 0 && (
                  <p className="text-xs text-red-500 mt-1">
                    Không thể tải danh sách sân bay. Vui lòng refresh trang.
                  </p>
                )}
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
            </div>

            {/* Hành khách */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
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
                </select>
              </div>
            </div>

            {/* Search Button */}
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-blue-600 text-white py-4 rounded-lg font-semibold text-lg hover:bg-blue-700 disabled:bg-gray-400 transition flex items-center justify-center gap-2"
            >
              {loading ? (
                <>
                  <span className="animate-spin">⏳</span>
                  Đang tìm kiếm...
                </>
              ) : (
                <>
                  🔍 Tìm chuyến bay
                </>
              )}
            </button>
          </form>
        </div>
      </div>

      {/* Trending Destinations */}
      <div className="container mx-auto px-4 py-16">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h2 className="text-3xl font-bold text-gray-900">Điểm đến được ưa chuộng</h2>
            <p className="text-gray-600 mt-2">Các địa điểm du lịch phổ biến nhất từ Việt Nam</p>
          </div>
          <a href="/diem-den" className="text-blue-600 font-medium hover:underline">
            Xem tất cả →
          </a>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Đà Nẵng */}
          <div className="group relative overflow-hidden rounded-2xl shadow-lg hover:shadow-2xl transition">
            <div className="absolute top-4 left-4 bg-red-500 text-white px-3 py-1 rounded-full text-sm font-medium z-10">
              Giảm 25%
            </div>
            <img
              src="https://images.unsplash.com/photo-1583417319070-4a69db38a482?w=500"
              alt="Đà Nẵng"
              className="w-full h-64 object-cover group-hover:scale-110 transition duration-500"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent"></div>
            <div className="absolute bottom-0 left-0 right-0 p-6 text-white">
              <h3 className="text-2xl font-bold mb-2">Đà Nẵng</h3>
              <div className="flex items-center justify-between">
                <div className="text-sm">
                  <p className="text-gray-300">✈️ TP.HCM - Đà Nẵng</p>
                  <p className="text-gray-300">📅 Khởi hành - Ngày về</p>
                </div>
                <div className="text-right">
                  <p className="text-sm text-gray-300 line-through">1.200.000₫</p>
                  <p className="text-2xl font-bold">900.000₫</p>
                </div>
              </div>
            </div>
          </div>

          {/* Bangkok */}
          <div className="group relative overflow-hidden rounded-2xl shadow-lg hover:shadow-2xl transition">
            <img
              src="https://images.unsplash.com/photo-1563492065599-3520f775eeed?w=500"
              alt="Bangkok"
              className="w-full h-64 object-cover group-hover:scale-110 transition duration-500"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent"></div>
            <div className="absolute bottom-0 left-0 right-0 p-6 text-white">
              <h3 className="text-2xl font-bold mb-2">Bangkok</h3>
              <div className="flex items-center justify-between">
                <div className="text-sm">
                  <p className="text-gray-300">✈️ Hà Nội - Bangkok</p>
                  <p className="text-gray-300">📅 Khởi hành - Ngày về</p>
                </div>
                <div className="text-right">
                  <p className="text-2xl font-bold">2.500.000₫</p>
                </div>
              </div>
            </div>
          </div>

          {/* Singapore */}
          <div className="group relative overflow-hidden rounded-2xl shadow-lg hover:shadow-2xl transition">
            <img
              src="https://images.unsplash.com/photo-1525625293386-3f8f99389edd?w=500"
              alt="Singapore"
              className="w-full h-64 object-cover group-hover:scale-110 transition duration-500"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent"></div>
            <div className="absolute bottom-0 left-0 right-0 p-6 text-white">
              <h3 className="text-2xl font-bold mb-2">Singapore</h3>
              <div className="flex items-center justify-between">
                <div className="text-sm">
                  <p className="text-gray-300">✈️ TP.HCM - Singapore</p>
                  <p className="text-gray-300">📅 Khởi hành - Ngày về</p>
                </div>
                <div className="text-right">
                  <p className="text-2xl font-bold">3.200.000₫</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Features */}
      <div className="bg-gray-50 py-16">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-white rounded-xl p-8 text-center shadow-sm hover:shadow-md transition">
              <div className="text-5xl mb-4">🔒</div>
              <h3 className="text-xl font-bold mb-2">Đặt chỗ an toàn</h3>
              <p className="text-gray-600">
                Chúng tôi sử dụng mã hóa SSL để bảo vệ thông tin của bạn
              </p>
            </div>

            <div className="bg-white rounded-xl p-8 text-center shadow-sm hover:shadow-md transition">
              <div className="text-5xl mb-4">💬</div>
              <h3 className="text-xl font-bold mb-2">Hỗ trợ 24/7</h3>
              <p className="text-gray-600">
                Đội ngũ hỗ trợ khách hàng luôn sẵn sàng giúp đỡ bạn mọi lúc
              </p>
            </div>

            <div className="bg-white rounded-xl p-8 text-center shadow-sm hover:shadow-md transition">
              <div className="text-5xl mb-4">💰</div>
              <h3 className="text-xl font-bold mb-2">Giá tốt nhất</h3>
              <p className="text-gray-600">
                Đảm bảo giá thấp nhất trên thị trường với nhiều ưu đãi hấp dẫn
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div>
              <div className="flex items-center gap-2 mb-4">
                <span className="text-2xl">✈️</span>
                <span className="text-xl font-bold">BayNhanh</span>
              </div>
              <p className="text-gray-400">
                Nền tảng đặt vé máy bay trực tuyến hàng đầu Việt Nam
              </p>
            </div>

            <div>
              <h4 className="font-bold mb-4">Công ty</h4>
              <ul className="space-y-2 text-gray-400">
                <li><a href="#" className="hover:text-white">Về chúng tôi</a></li>
                <li><a href="#" className="hover:text-white">Nghề nghiệp</a></li>
                <li><a href="#" className="hover:text-white">Báo chí</a></li>
              </ul>
            </div>

            <div>
              <h4 className="font-bold mb-4">Hỗ trợ</h4>
              <ul className="space-y-2 text-gray-400">
                <li><a href="#" className="hover:text-white">Trung tâm trợ giúp</a></li>
                <li><a href="#" className="hover:text-white">Điều khoản dịch vụ</a></li>
                <li><a href="#" className="hover:text-white">Chính sách bảo mật</a></li>
              </ul>
            </div>

            <div>
              <h4 className="font-bold mb-4">Làm việc với chúng tôi</h4>
              <ul className="space-y-2 text-gray-400">
                <li><a href="#" className="hover:text-white">Đối tác</a></li>
                <li><a href="#" className="hover:text-white">Chương trình liên kết</a></li>
                <li><a href="#" className="hover:text-white">Quảng cáo</a></li>
              </ul>
            </div>
          </div>

          <div className="border-t border-gray-800 mt-8 pt-8 text-center text-gray-400">
            <p>© 2026 BayNhanh.vn - Bản quyền thuộc về chúng tôi</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
