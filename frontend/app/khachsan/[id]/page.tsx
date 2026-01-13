'use client';

import { useState, useEffect } from 'react';
import { useParams, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import UserDropdown from '../../components/UserDropdown';

interface Hotel {
  id: number;
  tenKhachSan: string;
  diaChi: string;
  thanhPho: string;
  soSao: number;
  moTa: string;
  hinhAnh: string | null;
  dienThoai: string | null;
  email: string | null;
  website: string | null;
  tienNghi: string | null;
  giaThapNhat: number;
  danhGiaTB: number | null;
  soDanhGia: number;
  gioCheckin: string;
  gioCheckout: string;
  chinhSachHuy: string | null;
  khoangCachSanBay: number | null;
  khoangCachTT: number | null;
  diaDiemGanDay: string | null;
  quocGia: {
    tenQuocGia: string;
  };
  gallery: Array<{
    id: number;
    urlHinhAnh: string;
    moTa: string | null;
  }>;
  phong: Array<{
    id: number;
    tenPhong: string;
    loaiPhong: string;
    dienTich: number | null;
    soKhach: number;
    soGiuong: number;
    loaiGiuong: string | null;
    giaTheoNgay: number;
    hinhAnh: string | null;
    tienNghi: string | null;
    moTa: string | null;
    soPhongTrong: number;
  }>;
}

export default function HotelDetailPage() {
  const params = useParams();
  const searchParams = useSearchParams();
  const [hotel, setHotel] = useState<Hotel | null>(null);
  const [loading, setLoading] = useState(true);
  const [selectedImage, setSelectedImage] = useState(0);
  const [showAllImages, setShowAllImages] = useState(false);

  const checkIn = searchParams.get('ngayNhanPhong') || '';
  const checkOut = searchParams.get('ngayTraPhong') || '';
  const adults = parseInt(searchParams.get('soNguoi') || '2');
  const rooms = parseInt(searchParams.get('soPhong') || '1');

  useEffect(() => {
    loadHotel();
  }, [params.id]);

  const loadHotel = async () => {
    setLoading(true);
    try {
      const res = await fetch(`http://localhost:5000/api/hotels/${params.id}`);
      if (!res.ok) {
        console.error('API returned status:', res.status);
        return;
      }
      const data = await res.json();
      setHotel(data);
    } catch (error) {
      console.error('Lỗi tải khách sạn:', error);
    } finally {
      setLoading(false);
    }
  };

  const calculateNights = () => {
    if (!checkIn || !checkOut) return 1;
    const start = new Date(checkIn);
    const end = new Date(checkOut);
    return Math.max(1, Math.ceil((end.getTime() - start.getTime()) / (1000 * 60 * 60 * 24)));
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND',
    }).format(amount);
  };

  const formatDate = (dateStr: string) => {
    if (!dateStr) return '';
    const date = new Date(dateStr);
    return date.toLocaleDateString('vi-VN', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    });
  };

  const getDayOfWeek = (dateStr: string) => {
    if (!dateStr) return '';
    const date = new Date(dateStr);
    const days = ['Chủ nhật', 'Thứ 2', 'Thứ 3', 'Thứ 4', 'Thứ 5', 'Thứ 6', 'Thứ 7'];
    return days[date.getDay()];
  };

  const parseAmenities = (amenitiesJson: string | null) => {
    if (!amenitiesJson) return [];
    try {
      return JSON.parse(amenitiesJson);
    } catch {
      return [];
    }
  };

  const parseNearbyPlaces = (placesJson: string | null) => {
    if (!placesJson) return [];
    try {
      return JSON.parse(placesJson);
    } catch {
      return [];
    }
  };

  const nights = calculateNights();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (!hotel) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-gray-600">Không tìm thấy khách sạn</p>
      </div>
    );
  }

  const allImages = [
    hotel.hinhAnh,
    ...(hotel.gallery?.map(g => g.urlHinhAnh) || [])
  ].filter(Boolean);

  const amenities = parseAmenities(hotel.tienNghi);
  const nearbyPlaces = parseNearbyPlaces(hotel.diaDiemGanDay);

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
              <Link href="/khachsan" className="text-blue-600 font-semibold">Khách sạn</Link>
              <UserDropdown />
            </nav>
          </div>
        </div>
      </header>

      {/* Breadcrumb */}
      <div className="bg-white border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3">
          <div className="flex items-center text-sm text-gray-600 space-x-2">
            <Link href="/khachsan" className="hover:text-blue-600">Khách sạn</Link>
            <span>/</span>
            <Link href={`/khachsan?thanhPho=${hotel.thanhPho}`} className="hover:text-blue-600">
              {hotel.thanhPho}
            </Link>
            <span>/</span>
            <span className="text-gray-900 font-medium truncate">{hotel.tenKhachSan}</span>
          </div>
        </div>
      </div>

      {/* Image Gallery */}
      <div className="bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="grid grid-cols-4 gap-2 h-96">
            {/* Main Image */}
            <div className="col-span-2 row-span-2 relative rounded-lg overflow-hidden cursor-pointer group"
              onClick={() => setShowAllImages(true)}>
              <img
                src={allImages[0] || 'https://images.unsplash.com/photo-1566073771259-6a8506099945?w=800'}
                alt={hotel.tenKhachSan}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
              />
            </div>

            {/* Side Images */}
            {allImages.slice(1, 5).map((img, idx) => (
              <div key={idx}
                className="relative rounded-lg overflow-hidden cursor-pointer group"
                onClick={() => setShowAllImages(true)}>
                <img
                  src={img}
                  alt={`${hotel.tenKhachSan} ${idx + 2}`}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                />
                {idx === 3 && allImages.length > 5 && (
                  <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
                    <span className="text-white font-semibold">+{allImages.length - 5} ảnh</span>
                  </div>
                )}
              </div>
            ))}
          </div>

          <button
            onClick={() => setShowAllImages(true)}
            className="mt-4 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50"
          >
            📷 Xem tất cả hình ảnh
          </button>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left Column - Hotel Info */}
          <div className="lg:col-span-2 space-y-6">
            {/* Hotel Header */}
            <div className="bg-white rounded-lg shadow-sm p-6">
              <div className="flex items-start justify-between mb-4">
                <div>
                  <h1 className="text-3xl font-bold text-gray-900 mb-2">{hotel.tenKhachSan}</h1>
                  <div className="flex items-center gap-3">
                    <span className="px-3 py-1 bg-blue-100 text-blue-700 text-sm font-medium rounded">
                      🏨 Khách sạn
                    </span>
                    <span className="text-yellow-500 text-lg">
                      {'⭐'.repeat(hotel.soSao)}
                    </span>
                  </div>
                </div>
                <div className="text-right">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-3xl font-bold text-blue-600">
                      {Number(hotel.danhGiaTB || 8.5).toFixed(1)}/10
                    </span>
                    <span className="text-sm font-semibold text-gray-700">Rất tốt</span>
                  </div>
                  <p className="text-sm text-gray-500">({hotel.soDanhGia} đánh giá)</p>
                </div>
              </div>

              <p className="text-gray-700 mb-2">📍 {hotel.diaChi}</p>
              <p className="text-gray-600">{hotel.moTa}</p>
            </div>

            {/* Amenities */}
            <div className="bg-white rounded-lg shadow-sm p-6">
              <h2 className="text-xl font-bold mb-4">Tiện ích khách sạn</h2>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                {amenities.map((amenity: string, idx: number) => (
                  <div key={idx} className="flex items-center gap-2">
                    <span className="text-green-600">✓</span>
                    <span className="text-gray-700">{amenity}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Nearby Places */}
            {nearbyPlaces.length > 0 && (
              <div className="bg-white rounded-lg shadow-sm p-6">
                <h2 className="text-xl font-bold mb-4">Địa điểm gần đây</h2>
                <div className="space-y-3">
                  {nearbyPlaces.map((place: any, idx: number) => (
                    <div key={idx} className="flex items-center justify-between">
                      <span className="text-gray-700">📍 {place.ten}</span>
                      <span className="text-gray-500">{place.khoangCach} km</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Available Rooms */}
            <div className="bg-white rounded-lg shadow-sm p-6">
              <h2 className="text-xl font-bold mb-4">Những phòng còn trống tại Khách sạn {hotel.tenKhachSan}</h2>

              <div className="space-y-4">
                {hotel.phong.map((room) => (
                  <div key={room.id} className="border rounded-lg p-4 hover:shadow-md transition-shadow">
                    <div className="flex gap-4">
                      {/* Room Image */}
                      <div className="w-32 h-32 flex-shrink-0">
                        <img
                          src={room.hinhAnh || 'https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?w=400'}
                          alt={room.tenPhong}
                          className="w-full h-full object-cover rounded-lg"
                        />
                      </div>

                      {/* Room Info */}
                      <div className="flex-1">
                        <h3 className="font-bold text-lg mb-2">{room.tenPhong}</h3>
                        <div className="grid grid-cols-2 gap-2 text-sm text-gray-600 mb-3">
                          <div>📐 {room.dienTich}m²</div>
                          <div>👥 {room.soKhach} khách</div>
                          <div>🛏️ {room.soGiuong} giường {room.loaiGiuong}</div>
                          <div>🚪 {room.soPhongTrong} phòng trống</div>
                        </div>
                        {room.tienNghi && (
                          <div className="flex flex-wrap gap-2">
                            {parseAmenities(room.tienNghi).slice(0, 3).map((amenity: string, idx: number) => (
                              <span key={idx} className="text-xs bg-gray-100 px-2 py-1 rounded">
                                {amenity}
                              </span>
                            ))}
                          </div>
                        )}
                      </div>

                      {/* Price & Booking */}
                      <div className="text-right flex flex-col justify-between">
                        <div>
                          <div className="text-2xl font-bold text-red-600 mb-1">
                            {formatCurrency(Number(room.giaTheoNgay))}
                          </div>
                          <p className="text-xs text-gray-500">Giá/đêm</p>
                        </div>
                        <button
                          onClick={() => {
                            // Save booking data to localStorage
                            const bookingData = {
                              khachSanId: hotel.id,
                              tenKhachSan: hotel.tenKhachSan,
                              diaChi: hotel.diaChi,
                              phongId: room.id,
                              tenPhong: room.tenPhong,
                              loaiPhong: room.loaiPhong,
                              ngayNhanPhong: checkIn,
                              ngayTraPhong: checkOut,
                              soNguoi: adults,
                              soPhong: rooms,
                              soDem: nights,
                              giaPhong: Number(room.giaTheoNgay),
                              tongTien: Number(room.giaTheoNgay) * nights * 1.1, // Include tax
                            };
                            localStorage.setItem('hotelBooking', JSON.stringify(bookingData));
                            // Redirect to booking page
                            window.location.href = '/khachsan/booking';
                          }}
                          className="px-6 py-2 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700 transition-colors"
                        >
                          Chọn
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Right Column - Booking Card */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-lg shadow-lg p-6 sticky top-20">
              <h3 className="text-xl font-bold mb-4">Thông tin đặt phòng</h3>

              <div className="space-y-4 mb-6">
                <div className="border-b pb-3">
                  <div className="text-sm text-gray-600 mb-1">Nhận phòng</div>
                  <div className="font-semibold">{getDayOfWeek(checkIn)}, {formatDate(checkIn)}</div>
                  <div className="text-sm text-gray-500">Từ {hotel.gioCheckin}</div>
                </div>

                <div className="border-b pb-3">
                  <div className="text-sm text-gray-600 mb-1">Trả phòng</div>
                  <div className="font-semibold">{getDayOfWeek(checkOut)}, {formatDate(checkOut)}</div>
                  <div className="text-sm text-gray-500">Đến {hotel.gioCheckout}</div>
                </div>

                <div className="border-b pb-3">
                  <div className="text-sm text-gray-600 mb-1">Số đêm</div>
                  <div className="font-semibold">{nights} đêm</div>
                </div>

                <div className="border-b pb-3">
                  <div className="text-sm text-gray-600 mb-1">Số khách & phòng</div>
                  <div className="font-semibold">{adults} người lớn, {rooms} phòng</div>
                </div>
              </div>

              <div className="bg-blue-50 rounded-lg p-4 mb-4">
                <div className="flex justify-between items-center mb-2">
                  <span className="text-gray-700">Giá từ</span>
                  <span className="text-2xl font-bold text-blue-600">
                    {formatCurrency(Number(hotel.giaThapNhat))}
                  </span>
                </div>
                <div className="text-right text-sm text-gray-600">
                  Tổng {formatCurrency(Number(hotel.giaThapNhat) * nights)} cho {nights} đêm
                </div>
              </div>

              <Link
                href={`/khachsan?thanhPho=${hotel.thanhPho}&ngayNhanPhong=${checkIn}&ngayTraPhong=${checkOut}&soNguoi=${adults}&soPhong=${rooms}`}
                className="block w-full text-center px-6 py-3 bg-gray-200 text-gray-700 rounded-lg font-semibold hover:bg-gray-300 transition-colors"
              >
                ← Quay lại tìm kiếm
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Image Gallery Modal */}
      {showAllImages && (
        <div className="fixed inset-0 bg-black z-50 flex items-center justify-center">
          <button
            onClick={() => setShowAllImages(false)}
            className="absolute top-4 right-4 text-white text-3xl hover:text-gray-300"
          >
            ✕
          </button>
          <div className="relative w-full max-w-5xl px-4">
            <img
              src={allImages[selectedImage]}
              alt="Gallery"
              className="w-full h-auto max-h-[80vh] object-contain"
            />
            <div className="flex items-center justify-center mt-4 gap-2">
              <button
                onClick={() => setSelectedImage((selectedImage - 1 + allImages.length) % allImages.length)}
                className="px-4 py-2 bg-white rounded-lg"
              >
                ←
              </button>
              <span className="text-white">
                {selectedImage + 1} / {allImages.length}
              </span>
              <button
                onClick={() => setSelectedImage((selectedImage + 1) % allImages.length)}
                className="px-4 py-2 bg-white rounded-lg"
              >
                →
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
