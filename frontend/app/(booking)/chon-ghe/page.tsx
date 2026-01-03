'use client';

import { useState, useEffect, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';

interface SeatMap {
  hang: string;
  cot: number;
  trangThai: 'TRONG' | 'DA_DAT' | 'KHONG_SU_DUNG';
}

function ChonGheContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [seatMap, setSeatMap] = useState<SeatMap[][]>([]);
  const [selectedSeats, setSelectedSeats] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);

  const totalPassengers = 
    parseInt(searchParams.get('nguoiLon') || '1') +
    parseInt(searchParams.get('treEm') || '0');

  useEffect(() => {
    generateSeatMap();
  }, []);

  const generateSeatMap = () => {
    // Tạo sơ đồ ghế mẫu - 30 hàng x 6 ghế (A-F)
    const rows = 30;
    const cols = 6;
    const colLabels = ['A', 'B', 'C', 'D', 'E', 'F'];
    
    const seats: SeatMap[][] = [];
    
    for (let row = 1; row <= rows; row++) {
      const rowSeats: SeatMap[] = [];
      for (let col = 0; col < cols; col++) {
        // Random đặt một số ghế đã được đặt
        const isOccupied = Math.random() < 0.3;
        rowSeats.push({
          hang: `${row}${colLabels[col]}`,
          cot: col,
          trangThai: isOccupied ? 'DA_DAT' : 'TRONG',
        });
      }
      seats.push(rowSeats);
    }
    
    setSeatMap(seats);
    setLoading(false);
  };

  const handleSeatClick = (seatLabel: string, status: string) => {
    if (status === 'DA_DAT') return;
    
    if (selectedSeats.includes(seatLabel)) {
      setSelectedSeats(selectedSeats.filter(s => s !== seatLabel));
    } else {
      if (selectedSeats.length < totalPassengers) {
        setSelectedSeats([...selectedSeats, seatLabel]);
      } else {
        alert(`Bạn chỉ có thể chọn ${totalPassengers} ghế`);
      }
    }
  };

  const handleContinue = () => {
    if (selectedSeats.length !== totalPassengers) {
      alert(`Vui lòng chọn đủ ${totalPassengers} ghế`);
      return;
    }

    const params = new URLSearchParams(searchParams.toString());
    params.set('seats', selectedSeats.join(','));
    router.push(`/thong-tin-hanh-khach?${params.toString()}`);
  };

  const getSeatColor = (seat: SeatMap, seatLabel: string) => {
    if (seat.trangThai === 'DA_DAT') return 'bg-gray-300 cursor-not-allowed';
    if (selectedSeats.includes(seatLabel)) return 'bg-green-500 text-white';
    return 'bg-blue-100 hover:bg-blue-200 cursor-pointer';
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
              Bước 2/4: Chọn ghế ngồi
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
              <div className="w-8 h-8 bg-blue-600 text-white rounded-full flex items-center justify-center font-bold">2</div>
              <span className="text-sm font-medium text-blue-600">Chọn ghế</span>
            </div>
            <div className="flex-1 h-1 bg-gray-300 mx-2"></div>
            
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 bg-gray-300 text-gray-600 rounded-full flex items-center justify-center font-bold">3</div>
              <span className="text-sm font-medium text-gray-600">Thông tin</span>
            </div>
            <div className="flex-1 h-1 bg-gray-300 mx-2"></div>
            
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 bg-gray-300 text-gray-600 rounded-full flex items-center justify-center font-bold">4</div>
              <span className="text-sm font-medium text-gray-600">Thanh toán</span>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Seat Map */}
          <div className="lg:col-span-3">
            <div className="bg-white rounded-lg shadow-sm p-6">
              <h2 className="text-2xl font-bold mb-4">Chọn ghế ngồi của bạn</h2>
              <p className="text-gray-600 mb-6">
                Vui lòng chọn {totalPassengers} ghế cho chuyến bay của bạn
              </p>

              {/* Legend */}
              <div className="flex items-center gap-6 mb-6 pb-6 border-b">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 bg-blue-100 border-2 border-gray-300 rounded"></div>
                  <span className="text-sm">Ghế trống</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 bg-green-500 border-2 border-gray-300 rounded"></div>
                  <span className="text-sm">Ghế đã chọn</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 bg-gray-300 border-2 border-gray-300 rounded"></div>
                  <span className="text-sm">Ghế đã được đặt</span>
                </div>
              </div>

              {loading ? (
                <div className="text-center py-12">
                  <div className="inline-block animate-spin text-4xl mb-4">⏳</div>
                  <p className="text-gray-600">Đang tải sơ đồ ghế...</p>
                </div>
              ) : (
                <div className="overflow-x-auto">
                  {/* Plane Front */}
                  <div className="text-center mb-4">
                    <div className="inline-block bg-gray-200 rounded-t-full px-12 py-2">
                      <span className="text-2xl">✈️</span>
                      <p className="text-xs text-gray-600">Phía trước máy bay</p>
                    </div>
                  </div>

                  {/* Seat Grid */}
                  <div className="max-w-md mx-auto">
                    {seatMap.map((row, rowIndex) => (
                      <div key={rowIndex} className="flex items-center gap-2 mb-2">
                        <span className="text-xs text-gray-500 w-6 text-right">{rowIndex + 1}</span>
                        
                        <div className="flex gap-1">
                          {row.slice(0, 3).map((seat, colIndex) => (
                            <button
                              key={`${rowIndex}-${colIndex}`}
                              onClick={() => handleSeatClick(seat.hang, seat.trangThai)}
                              disabled={seat.trangThai === 'DA_DAT'}
                              className={`w-10 h-10 rounded text-xs font-bold border-2 border-gray-300 transition ${getSeatColor(seat, seat.hang)}`}
                              title={seat.hang}
                            >
                              {seat.hang}
                            </button>
                          ))}
                        </div>
                        
                        {/* Aisle */}
                        <div className="w-6"></div>
                        
                        <div className="flex gap-1">
                          {row.slice(3, 6).map((seat, colIndex) => (
                            <button
                              key={`${rowIndex}-${colIndex + 3}`}
                              onClick={() => handleSeatClick(seat.hang, seat.trangThai)}
                              disabled={seat.trangThai === 'DA_DAT'}
                              className={`w-10 h-10 rounded text-xs font-bold border-2 border-gray-300 transition ${getSeatColor(seat, seat.hang)}`}
                              title={seat.hang}
                            >
                              {seat.hang}
                            </button>
                          ))}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
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
                  <p className="text-sm text-gray-600">Hành khách</p>
                  <p className="font-semibold">
                    {searchParams.get('nguoiLon')} người lớn
                    {parseInt(searchParams.get('treEm') || '0') > 0 && 
                      `, ${searchParams.get('treEm')} trẻ em`}
                  </p>
                </div>

                <div className="border-t pt-4">
                  <p className="text-sm text-gray-600 mb-2">Ghế đã chọn</p>
                  {selectedSeats.length === 0 ? (
                    <p className="text-gray-400 text-sm italic">Chưa chọn ghế</p>
                  ) : (
                    <div className="flex flex-wrap gap-2">
                      {selectedSeats.map(seat => (
                        <span key={seat} className="bg-green-100 text-green-700 px-3 py-1 rounded-full text-sm font-medium">
                          {seat}
                        </span>
                      ))}
                    </div>
                  )}
                  <p className="text-sm text-gray-500 mt-2">
                    {selectedSeats.length}/{totalPassengers} ghế
                  </p>
                </div>
              </div>

              <div className="border-t pt-4 mb-6">
                <div className="flex justify-between mb-2">
                  <span className="text-gray-600">Giá vé</span>
                  <span className="font-semibold">
                    {new Intl.NumberFormat('vi-VN', {
                      style: 'currency',
                      currency: 'VND',
                    }).format(parseInt(searchParams.get('giaBan') || '0') * totalPassengers)}
                  </span>
                </div>
                <div className="flex justify-between text-lg font-bold">
                  <span>Tổng cộng</span>
                  <span className="text-blue-600">
                    {new Intl.NumberFormat('vi-VN', {
                      style: 'currency',
                      currency: 'VND',
                    }).format(parseInt(searchParams.get('giaBan') || '0') * totalPassengers)}
                  </span>
                </div>
              </div>

              <button
                onClick={handleContinue}
                disabled={selectedSeats.length !== totalPassengers}
                className="w-full bg-blue-600 text-white py-3 rounded-lg font-semibold hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition"
              >
                Tiếp tục →
              </button>

              <button
                onClick={() => router.back()}
                className="w-full mt-3 bg-white border-2 border-gray-300 text-gray-700 py-3 rounded-lg font-semibold hover:bg-gray-50 transition"
              >
                ← Quay lại
              </button>

              <div className="mt-6 p-4 bg-blue-50 rounded-lg">
                <div className="flex items-start gap-2">
                  <span className="text-xl">💡</span>
                  <div className="text-sm">
                    <p className="font-medium text-blue-900 mb-1">Mẹo chọn ghế</p>
                    <p className="text-blue-700">
                      Ghế cạnh cửa sổ: A, F<br />
                      Ghế lối đi: C, D<br />
                      Ghế hàng thoát hiểm: Thêm chỗ để chân
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function ChonGhePage() {
  return (
    <Suspense fallback={<div className="min-h-screen flex items-center justify-center">
      <div className="text-center">
        <div className="inline-block animate-spin text-6xl mb-4">✈️</div>
        <p className="text-gray-600">Đang tải...</p>
      </div>
    </div>}>
      <ChonGheContent />
    </Suspense>
  );
}
