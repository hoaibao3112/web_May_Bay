'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';

interface Activity {
    id: number;
    maHoatDong: string;
    tenHoatDong: string;
    moTaNgan: string;
    moTaChiTiet: string;
    diaDiem: string;
    thanhPho: string;
    thoiGianDienRa: string;
    giaTuMoiNguoi: number;
    baoGomAnUong: boolean;
    baoGomDuaDon: boolean;
    huongDanVien: boolean;
    danhGiaTrungBinh: number;
    soLuotDanhGia: number;
    soLuotDat: number;
    hinhAnh: any[];
    bangGia: any[];
    lichTrinh: any[];
    diemNoiBat: any[];
    danhGia: any[];
    danhMuc: any;
    nhaCungCap: any;
}

export default function ActivityDetailPage() {
    const params = useParams();
    const router = useRouter();
    const [activity, setActivity] = useState<Activity | null>(null);
    const [loading, setLoading] = useState(true);
    const [selectedImageIndex, setSelectedImageIndex] = useState(0);
    const [selectedDate, setSelectedDate] = useState('');
    const [selectedSchedule, setSelectedSchedule] = useState<any>(null);
    const [adults, setAdults] = useState(2);
    const [children, setChildren] = useState(0);

    useEffect(() => {
        fetchActivityDetail();
    }, [params.id]);

    const fetchActivityDetail = async () => {
        try {
            const res = await fetch(`http://localhost:5000/activities/${params.id}`);
            if (!res.ok) throw new Error('Activity not found');
            const data = await res.json();
            setActivity(data);

            // Set default date to tomorrow
            const tomorrow = new Date();
            tomorrow.setDate(tomorrow.getDate() + 1);
            setSelectedDate(tomorrow.toISOString().split('T')[0]);
        } catch (error) {
            console.error('Error fetching activity:', error);
        } finally {
            setLoading(false);
        }
    };

    const formatPrice = (price: number) => {
        return new Intl.NumberFormat('vi-VN', {
            style: 'currency',
            currency: 'VND',
        }).format(price);
    };

    const calculateTotal = () => {
        if (!activity) return 0;

        const adultPrice = activity.bangGia?.find(p => p.loaiKhach === 'NGUOI_LON')?.gia || activity.giaTuMoiNguoi;
        const childPrice = activity.bangGia?.find(p => p.loaiKhach === 'TRE_EM')?.gia || activity.giaTuMoiNguoi * 0.7;

        return (adults * adultPrice) + (children * childPrice);
    };

    const handleBooking = () => {
        if (!activity) return;

        const bookingData = {
            hoatDongId: activity.id,
            tenHoatDong: activity.tenHoatDong,
            ngayThucHien: selectedDate,
            soNguoiLon: adults,
            soTreEm: children,
            tongTien: calculateTotal(),
        };

        // Store booking data and redirect to booking page
        localStorage.setItem('activityBooking', JSON.stringify(bookingData));
        router.push('/hoat-dong/dat-tour');
    };

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="text-center">
                    <div className="inline-block h-12 w-12 animate-spin rounded-full border-4 border-solid border-pink-500 border-r-transparent"></div>
                    <p className="mt-4 text-gray-600">Đang tải...</p>
                </div>
            </div>
        );
    }

    if (!activity) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="text-center">
                    <h1 className="text-2xl font-bold text-gray-900 mb-2">Không tìm thấy hoạt động</h1>
                    <Link href="/hoat-dong" className="text-pink-600 hover:underline">
                        ← Quay lại danh sách
                    </Link>
                </div>
            </div>
        );
    }

    const images = activity.hinhAnh || [];
    const currentImage = images[selectedImageIndex] || { urlHinhAnh: 'https://via.placeholder.com/800x600?text=No+Image' };

    return (
        <div className="min-h-screen bg-gray-50">
            {/* Breadcrumb */}
            <div className="bg-white border-b">
                <div className="container mx-auto px-4 py-3">
                    <div className="flex items-center gap-2 text-sm">
                        <Link href="/" className="text-gray-600 hover:text-pink-600">Trang chủ</Link>
                        <span className="text-gray-400">/</span>
                        <Link href="/hoat-dong" className="text-gray-600 hover:text-pink-600">Hoạt động & Vui chơi</Link>
                        <span className="text-gray-400">/</span>
                        <span className="text-gray-900 font-medium">{activity.tenHoatDong}</span>
                    </div>
                </div>
            </div>

            <div className="container mx-auto px-4 py-8">
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* Left Column - Images & Details */}
                    <div className="lg:col-span-2">
                        {/* Image Gallery */}
                        <div className="bg-white rounded-lg shadow-sm overflow-hidden mb-6">
                            {/* Main Image */}
                            <div className="relative h-96 bg-gray-200">
                                <img
                                    src={currentImage.urlHinhAnh}
                                    alt={activity.tenHoatDong}
                                    className="w-full h-full object-cover"
                                />

                                {/* Navigation Arrows */}
                                {images.length > 1 && (
                                    <>
                                        <button
                                            onClick={() => setSelectedImageIndex((selectedImageIndex - 1 + images.length) % images.length)}
                                            className="absolute left-4 top-1/2 -translate-y-1/2 bg-white/90 hover:bg-white rounded-full p-3 shadow-lg"
                                        >
                                            ←
                                        </button>
                                        <button
                                            onClick={() => setSelectedImageIndex((selectedImageIndex + 1) % images.length)}
                                            className="absolute right-4 top-1/2 -translate-y-1/2 bg-white/90 hover:bg-white rounded-full p-3 shadow-lg"
                                        >
                                            →
                                        </button>
                                    </>
                                )}

                                {/* Image Counter */}
                                <div className="absolute bottom-4 right-4 bg-black/60 text-white px-3 py-1 rounded-full text-sm">
                                    {selectedImageIndex + 1} / {images.length}
                                </div>
                            </div>

                            {/* Thumbnail Gallery */}
                            {images.length > 1 && (
                                <div className="flex gap-2 p-4 overflow-x-auto">
                                    {images.map((img: any, idx: number) => (
                                        <button
                                            key={idx}
                                            onClick={() => setSelectedImageIndex(idx)}
                                            className={`flex-shrink-0 w-20 h-20 rounded-lg overflow-hidden border-2 transition ${idx === selectedImageIndex ? 'border-pink-500' : 'border-gray-200'
                                                }`}
                                        >
                                            <img src={img.urlHinhAnh} alt={`Thumbnail ${idx + 1}`} className="w-full h-full object-cover" />
                                        </button>
                                    ))}
                                </div>
                            )}
                        </div>

                        {/* Activity Info */}
                        <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
                            <div className="flex items-start justify-between mb-4">
                                <div>
                                    <div className="flex items-center gap-2 mb-2">
                                        {activity.danhMuc && (
                                            <span className="bg-pink-100 text-pink-700 px-3 py-1 rounded-full text-sm font-medium">
                                                {activity.danhMuc.icon} {activity.danhMuc.tenDanhMuc}
                                            </span>
                                        )}
                                    </div>
                                    <h1 className="text-3xl font-bold text-gray-900 mb-2">{activity.tenHoatDong}</h1>
                                    <div className="flex items-center gap-4 text-gray-600">
                                        <div className="flex items-center gap-1">
                                            <span className="text-yellow-400">⭐</span>
                                            <span className="font-semibold">{activity.danhGiaTrungBinh || 0}</span>
                                            <span>({activity.soLuotDanhGia} đánh giá)</span>
                                        </div>
                                        <span>•</span>
                                        <span>📍 {activity.diaDiem}, {activity.thanhPho}</span>
                                    </div>
                                </div>
                            </div>

                            <p className="text-gray-700 text-lg mb-4">{activity.moTaNgan}</p>
                            <p className="text-gray-600 leading-relaxed">{activity.moTaChiTiet}</p>
                        </div>

                        {/* Highlights */}
                        {activity.diemNoiBat && activity.diemNoiBat.length > 0 && (
                            <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
                                <h2 className="text-2xl font-bold text-gray-900 mb-4">✨ Điểm nổi bật</h2>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                                    {activity.diemNoiBat.map((highlight: any) => (
                                        <div key={highlight.id} className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                                            <span className="text-2xl">{highlight.icon || '✓'}</span>
                                            <span className="text-gray-700">{highlight.noiDung}</span>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}

                        {/* Includes */}
                        <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
                            <h2 className="text-2xl font-bold text-gray-900 mb-4">📋 Bao gồm</h2>
                            <div className="space-y-2">
                                <div className="flex items-center gap-2">
                                    <span className={activity.baoGomDuaDon ? 'text-green-600' : 'text-gray-400'}>
                                        {activity.baoGomDuaDon ? '✓' : '✗'}
                                    </span>
                                    <span className={activity.baoGomDuaDon ? 'text-gray-900' : 'text-gray-500'}>
                                        Đưa đón tận nơi
                                    </span>
                                </div>
                                <div className="flex items-center gap-2">
                                    <span className={activity.baoGomAnUong ? 'text-green-600' : 'text-gray-400'}>
                                        {activity.baoGomAnUong ? '✓' : '✗'}
                                    </span>
                                    <span className={activity.baoGomAnUong ? 'text-gray-900' : 'text-gray-500'}>
                                        Bữa ăn
                                    </span>
                                </div>
                                <div className="flex items-center gap-2">
                                    <span className={activity.huongDanVien ? 'text-green-600' : 'text-gray-400'}>
                                        {activity.huongDanVien ? '✓' : '✗'}
                                    </span>
                                    <span className={activity.huongDanVien ? 'text-gray-900' : 'text-gray-500'}>
                                        Hướng dẫn viên
                                    </span>
                                </div>
                                <div className="flex items-center gap-2">
                                    <span className="text-green-600">✓</span>
                                    <span className="text-gray-900">Thời gian: {activity.thoiGianDienRa}</span>
                                </div>
                            </div>
                        </div>

                        {/* Reviews */}
                        {activity.danhGia && activity.danhGia.length > 0 && (
                            <div className="bg-white rounded-lg shadow-sm p-6">
                                <h2 className="text-2xl font-bold text-gray-900 mb-4">💬 Đánh giá từ khách hàng</h2>
                                <div className="space-y-4">
                                    {activity.danhGia.slice(0, 5).map((review: any) => (
                                        <div key={review.id} className="border-b pb-4 last:border-0">
                                            <div className="flex items-center gap-2 mb-2">
                                                <div className="flex">
                                                    {Array.from({ length: review.diem }).map((_, i) => (
                                                        <span key={i} className="text-yellow-400">⭐</span>
                                                    ))}
                                                </div>
                                                <span className="text-gray-500 text-sm">
                                                    {new Date(review.created_at).toLocaleDateString('vi-VN')}
                                                </span>
                                            </div>
                                            <p className="text-gray-700">{review.nhanXet}</p>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}
                    </div>

                    {/* Right Column - Booking Card */}
                    <div className="lg:col-span-1">
                        <div className="bg-white rounded-lg shadow-lg p-6 sticky top-4">
                            <div className="mb-6">
                                <div className="text-sm text-gray-600 mb-1">Giá từ</div>
                                <div className="text-3xl font-bold text-pink-600">
                                    {formatPrice(activity.giaTuMoiNguoi)}
                                    <span className="text-base font-normal text-gray-600">/người</span>
                                </div>
                            </div>

                            {/* Date Selection */}
                            <div className="mb-4">
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    📅 Chọn ngày
                                </label>
                                <input
                                    type="date"
                                    value={selectedDate}
                                    onChange={(e) => setSelectedDate(e.target.value)}
                                    min={new Date().toISOString().split('T')[0]}
                                    className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-pink-500"
                                />
                            </div>

                            {/* Guests Selection */}
                            <div className="grid grid-cols-2 gap-4 mb-6">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        Người lớn
                                    </label>
                                    <input
                                        type="number"
                                        min="1"
                                        max="20"
                                        value={adults}
                                        onChange={(e) => setAdults(parseInt(e.target.value))}
                                        className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-pink-500"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        Trẻ em
                                    </label>
                                    <input
                                        type="number"
                                        min="0"
                                        max="20"
                                        value={children}
                                        onChange={(e) => setChildren(parseInt(e.target.value))}
                                        className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-pink-500"
                                    />
                                </div>
                            </div>

                            {/* Price Breakdown */}
                            <div className="border-t pt-4 mb-6">
                                <div className="flex justify-between text-gray-600 mb-2">
                                    <span>{adults} người lớn</span>
                                    <span>{formatPrice(adults * (activity.bangGia?.find(p => p.loaiKhach === 'NGUOI_LON')?.gia || activity.giaTuMoiNguoi))}</span>
                                </div>
                                {children > 0 && (
                                    <div className="flex justify-between text-gray-600 mb-2">
                                        <span>{children} trẻ em</span>
                                        <span>{formatPrice(children * (activity.bangGia?.find(p => p.loaiKhach === 'TRE_EM')?.gia || activity.giaTuMoiNguoi * 0.7))}</span>
                                    </div>
                                )}
                                <div className="flex justify-between font-bold text-lg text-gray-900 mt-3 pt-3 border-t">
                                    <span>Tổng cộng</span>
                                    <span className="text-pink-600">{formatPrice(calculateTotal())}</span>
                                </div>
                            </div>

                            {/* Booking Button */}
                            <button
                                onClick={handleBooking}
                                className="w-full py-3 bg-gradient-to-r from-pink-500 to-rose-500 text-white rounded-lg font-semibold hover:from-pink-600 hover:to-rose-600 transition shadow-lg"
                            >
                                Đặt ngay
                            </button>

                            {/* Contact */}
                            {activity.nhaCungCap && (
                                <div className="mt-6 pt-6 border-t">
                                    <div className="text-sm text-gray-600 mb-2">Được cung cấp bởi</div>
                                    <div className="font-semibold text-gray-900">{activity.nhaCungCap.tenNhaCungCap}</div>
                                    {activity.nhaCungCap.soDienThoai && (
                                        <div className="text-sm text-gray-600 mt-1">
                                            📞 {activity.nhaCungCap.soDienThoai}
                                        </div>
                                    )}
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
