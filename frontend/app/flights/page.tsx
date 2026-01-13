'use client';

import { useState } from 'react';

export default function FlightSearchPage() {
  const [airports, setAirports] = useState<any[]>([]);
  const [searchResult, setSearchResult] = useState<any>(null);
  const [loading, setLoading] = useState(false);

  const [searchForm, setSearchForm] = useState({
    sanBayDiId: '',
    sanBayDenId: '',
    ngayDi: '',
    loaiChuyen: 'ONE_WAY',
    nguoiLon: 1,
    treEm: 0,
    soSinh: 0,
  });

  // Lấy danh sách sân bay
  const fetchAirports = async () => {
    try {
      const res = await fetch('http://localhost:5000/api/catalog/san-bay');
      const data = await res.json();
      setAirports(data);
    } catch (error) {
      console.error('Error fetching airports:', error);
    }
  };

  // Tìm kiếm chuyến bay
  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const res = await fetch('http://localhost:5000/api/search', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...searchForm,
          sanBayDiId: parseInt(searchForm.sanBayDiId),
          sanBayDenId: parseInt(searchForm.sanBayDenId),
        }),
      });

      const data = await res.json();
      setSearchResult(data);
    } catch (error) {
      console.error('Error searching flights:', error);
      alert('Lỗi tìm kiếm chuyến bay');
    } finally {
      setLoading(false);
    }
  };

  // Đặt vé
  const handleBook = async (changBayId: number, hangVeId: number, giaVe: any) => {
    try {
      // 1. Tạo booking
      const bookingRes = await fetch('http://localhost:5000/api/bookings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          searchSessionId: searchResult.searchSessionId,
          changBayId,
          hangVeId,
          nhomGiaId: giaVe.nhomGiaId,
        }),
      });

      const booking = await bookingRes.json();
      
      if (booking.id) {
        alert(`Đặt chỗ thành công! Mã đặt vé: ${booking.maDatVe}\nVui lòng thanh toán trong 15 phút.`);
        
        // Chuyển sang trang booking detail (TODO)
        console.log('Booking created:', booking);
      }
    } catch (error) {
      console.error('Error booking:', error);
      alert('Lỗi đặt vé');
    }
  };

  return (
    <div className="container mx-auto p-4 max-w-6xl">
      <h1 className="text-3xl font-bold mb-6">🛫 Đặt vé máy bay</h1>

      {/* Form tìm kiếm */}
      <div className="bg-white rounded-lg shadow-md p-6 mb-6">
        <h2 className="text-xl font-semibold mb-4">Tìm chuyến bay</h2>
        
        <button 
          onClick={fetchAirports}
          className="mb-4 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
        >
          Tải danh sách sân bay
        </button>

        <form onSubmit={handleSearch} className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block mb-2 font-medium">Từ:</label>
            <select
              value={searchForm.sanBayDiId}
              onChange={(e) => setSearchForm({ ...searchForm, sanBayDiId: e.target.value })}
              className="w-full border rounded px-3 py-2"
              required
            >
              <option value="">Chọn sân bay đi</option>
              {airports.map((airport) => (
                <option key={airport.id} value={airport.id}>
                  {airport.maIata} - {airport.tenSanBay} ({airport.thanhPho})
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block mb-2 font-medium">Đến:</label>
            <select
              value={searchForm.sanBayDenId}
              onChange={(e) => setSearchForm({ ...searchForm, sanBayDenId: e.target.value })}
              className="w-full border rounded px-3 py-2"
              required
            >
              <option value="">Chọn sân bay đến</option>
              {airports.map((airport) => (
                <option key={airport.id} value={airport.id}>
                  {airport.maIata} - {airport.tenSanBay} ({airport.thanhPho})
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block mb-2 font-medium">Ngày đi:</label>
            <input
              type="date"
              value={searchForm.ngayDi}
              onChange={(e) => setSearchForm({ ...searchForm, ngayDi: e.target.value })}
              className="w-full border rounded px-3 py-2"
              required
              min={new Date().toISOString().split('T')[0]}
            />
          </div>

          <div>
            <label className="block mb-2 font-medium">Số hành khách:</label>
            <div className="flex gap-2">
              <input
                type="number"
                min="1"
                max="9"
                value={searchForm.nguoiLon}
                onChange={(e) => setSearchForm({ ...searchForm, nguoiLon: parseInt(e.target.value) })}
                className="w-1/3 border rounded px-3 py-2"
                placeholder="Người lớn"
              />
              <input
                type="number"
                min="0"
                max="9"
                value={searchForm.treEm}
                onChange={(e) => setSearchForm({ ...searchForm, treEm: parseInt(e.target.value) })}
                className="w-1/3 border rounded px-3 py-2"
                placeholder="Trẻ em"
              />
              <input
                type="number"
                min="0"
                max="9"
                value={searchForm.soSinh}
                onChange={(e) => setSearchForm({ ...searchForm, soSinh: parseInt(e.target.value) })}
                className="w-1/3 border rounded px-3 py-2"
                placeholder="Sơ sinh"
              />
            </div>
          </div>

          <div className="md:col-span-2">
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-blue-600 text-white py-3 rounded-lg font-semibold hover:bg-blue-700 disabled:bg-gray-400"
            >
              {loading ? 'Đang tìm kiếm...' : 'Tìm chuyến bay'}
            </button>
          </div>
        </form>
      </div>

      {/* Kết quả tìm kiếm */}
      {searchResult && (
        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-xl font-semibold mb-4">
            Tìm thấy {searchResult.tongSoKetQua} chuyến bay
          </h2>

          <div className="space-y-4">
            {searchResult.ketQua.map((flight: any) => (
              <div key={flight.changBayId} className="border rounded-lg p-4">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-4">
                    <img
                      src={flight.hang.logo || '/plane-icon.png'}
                      alt={flight.hang.tenHang}
                      className="w-12 h-12 object-contain"
                    />
                    <div>
                      <p className="font-bold">{flight.hang.tenHang}</p>
                      <p className="text-sm text-gray-600">{flight.soHieuChuyenBay}</p>
                    </div>
                  </div>

                  <div className="text-center">
                    <p className="font-bold text-lg">
                      {new Date(flight.gioDi).toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' })}
                    </p>
                    <p className="text-sm text-gray-600">{flight.sanBayDi.maIata}</p>
                  </div>

                  <div className="text-center">
                    <p className="text-sm text-gray-600">{flight.thoiGianBayPhut} phút</p>
                    <div className="w-24 h-0.5 bg-gray-300 my-2"></div>
                  </div>

                  <div className="text-center">
                    <p className="font-bold text-lg">
                      {new Date(flight.gioDen).toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' })}
                    </p>
                    <p className="text-sm text-gray-600">{flight.sanBayDen.maIata}</p>
                  </div>
                </div>

                <div className="border-t pt-4">
                  <p className="font-medium mb-2">Chọn hạng vé:</p>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                    {flight.giaVe.map((giaVe: any, idx: number) => (
                      <div key={idx} className="border rounded p-3 hover:border-blue-500">
                        <div className="flex justify-between items-center mb-2">
                          <p className="font-semibold">{giaVe.nhomGia}</p>
                          <p className="text-lg font-bold text-blue-600">
                            {giaVe.tongGia.toLocaleString('vi-VN')} đ
                          </p>
                        </div>
                        <p className="text-xs text-gray-600 mb-2">
                          ✓ Hành lý: {giaVe.hanhLyKy}kg ký gửi, {giaVe.hanhLyXach}kg xách tay
                        </p>
                        <p className="text-xs text-gray-600 mb-3">
                          {giaVe.choPhepDoi ? '✓' : '✗'} Đổi vé | {giaVe.choPhepHoan ? '✓' : '✗'} Hoàn vé
                        </p>
                        <button
                          onClick={() => handleBook(flight.changBayId, flight.giaVe[0].tonChoId, giaVe)}
                          className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700"
                          disabled={giaVe.soChoCon === 0}
                        >
                          {giaVe.soChoCon > 0 ? 'Đặt vé' : 'Hết chỗ'}
                        </button>
                        <p className="text-xs text-center text-gray-500 mt-1">
                          Còn {giaVe.soChoCon} chỗ
                        </p>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
