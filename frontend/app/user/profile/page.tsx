'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import UserDropdown from '../../components/UserDropdown';
import UserSidebar from '../../components/UserSidebar';

interface User {
  id: number;
  hoTen: string;
  email: string;
  soDienThoai?: string;
  ngaySinh?: string;
  gioiTinh?: string;
  diaChi?: string;
}

export default function ProfilePage() {
  const [user, setUser] = useState<User | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    hoTen: '',
    email: '',
    soDienThoai: '',
    ngaySinh: '',
    gioiTinh: 'Nam',
    diaChi: '',
  });
  const router = useRouter();

  useEffect(() => {
    const userData = localStorage.getItem('user');
    if (!userData) {
      router.push('/auth/login');
      return;
    }
    
    try {
      const parsedUser = JSON.parse(userData);
      setUser(parsedUser);
      setFormData({
        hoTen: parsedUser.hoTen || '',
        email: parsedUser.email || '',
        soDienThoai: parsedUser.soDienThoai || '',
        ngaySinh: parsedUser.ngaySinh || '',
        gioiTinh: parsedUser.gioiTinh || 'Nam',
        diaChi: parsedUser.diaChi || '',
      });
    } catch (error) {
      console.error('Error parsing user data:', error);
      router.push('/auth/login');
    }
  }, [router]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      // Update localStorage
      const updatedUser = { ...user, ...formData };
      localStorage.setItem('user', JSON.stringify(updatedUser));
      setUser(updatedUser);
      setIsEditing(false);
      alert('Cập nhật thông tin thành công!');
    } catch (error) {
      console.error('Error updating profile:', error);
      alert('Có lỗi xảy ra. Vui lòng thử lại!');
    }
  };

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <Link href="/" className="flex items-center space-x-2">
              <span className="text-2xl">✈️</span>
              <span className="text-xl font-bold text-blue-600">BayNhanh</span>
            </Link>
            <nav className="hidden md:flex items-center space-x-6">
              <Link href="/" className="text-gray-700 hover:text-blue-600">Vé máy bay</Link>
              <Link href="/khachsan" className="text-gray-700 hover:text-blue-600">Khách sạn</Link>
              <UserDropdown />
            </nav>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Sidebar */}
          <div className="lg:col-span-1">
            <UserSidebar userName={user.hoTen} userPoints={user.diemThuong} />
          </div>

          {/* Main Content */}
          <div className="lg:col-span-3">
            <div className="bg-white rounded-lg shadow-sm">
              {/* Tabs */}
              <div className="border-b border-gray-200">
                <nav className="flex">
                  <button className="px-6 py-4 text-sm font-medium text-blue-600 border-b-2 border-blue-600">
                    Thông tin tài khoản
                  </button>
                  <button className="px-6 py-4 text-sm font-medium text-gray-500 hover:text-gray-700">
                    Mật khẩu & Bảo mật
                  </button>
                </nav>
              </div>

              {/* Form Section */}
              <div className="p-6">
                <h2 className="text-xl font-bold text-gray-900 mb-6">Dữ liệu cá nhân</h2>
                <h2 className="text-xl font-bold text-gray-900 mb-6">Dữ liệu cá nhân</h2>

                <form onSubmit={handleSubmit}>
                  <div className="space-y-6">
                    {/* Tên đầy đủ */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Tên đầy đủ
                      </label>
                      <input
                        type="text"
                        value={formData.hoTen}
                        onChange={(e) => setFormData({ ...formData, hoTen: e.target.value })}
                        disabled={!isEditing}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none disabled:bg-gray-50 disabled:text-gray-600"
                        placeholder="Nhập tên đầy đủ"
                      />
                      <p className="mt-1 text-xs text-gray-500">
                        Tên trong hộ sơ được rút ngắn từ họ tên của bạn.
                      </p>
                    </div>

              {/* Email */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Email
                </label>
                <div className="mb-2">
                  <div className="flex items-center justify-between p-3 border border-gray-300 rounded-lg bg-gray-50">
                    <div>
                      <div className="font-medium text-gray-900">1. {formData.email}</div>
                    </div>
                    <span className="text-xs text-green-600 font-medium">Nối nhận thông báo</span>
                  </div>
                </div>
                <button
                  type="button"
                  className="flex items-center gap-2 text-blue-600 hover:text-blue-700 font-medium text-sm"
                >
                  <span>+</span> Thêm email
                </button>
                <p className="mt-1 text-xs text-gray-500">
                  Chỉ có thể sử dụng tối đa 3 email
                </p>
              </div>

              {/* Giới tính & Ngày sinh */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Giới tính
                  </label>
                  <select
                    value={formData.gioiTinh}
                    onChange={(e) => setFormData({ ...formData, gioiTinh: e.target.value })}
                    disabled={!isEditing}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none disabled:bg-gray-50 disabled:text-gray-600"
                  >
                    <option value="Nam">Nam</option>
                    <option value="Nữ">Nữ</option>
                    <option value="Khác">Khác</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Ngày
                  </label>
                  <select
                    value={formData.ngaySinh ? new Date(formData.ngaySinh).getDate() : ''}
                    onChange={(e) => {
                      const date = formData.ngaySinh ? new Date(formData.ngaySinh) : new Date();
                      date.setDate(parseInt(e.target.value));
                      setFormData({ ...formData, ngaySinh: date.toISOString().split('T')[0] });
                    }}
                    disabled={!isEditing}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none disabled:bg-gray-50"
                  >
                    <option value="">Ngày</option>
                    {Array.from({ length: 31 }, (_, i) => i + 1).map(day => (
                      <option key={day} value={day}>{day}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Tháng
                  </label>
                  <select
                    value={formData.ngaySinh ? new Date(formData.ngaySinh).getMonth() + 1 : ''}
                    onChange={(e) => {
                      const date = formData.ngaySinh ? new Date(formData.ngaySinh) : new Date();
                      date.setMonth(parseInt(e.target.value) - 1);
                      setFormData({ ...formData, ngaySinh: date.toISOString().split('T')[0] });
                    }}
                    disabled={!isEditing}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none disabled:bg-gray-50"
                  >
                    <option value="">Tháng</option>
                    {['Tháng Một', 'Tháng Hai', 'Tháng Ba', 'Tháng Tư', 'Tháng Năm', 'Tháng Sáu',
                      'Tháng Bảy', 'Tháng Tám', 'Tháng Chín', 'Tháng Mười', 'Tháng Mười Một', 'Tháng Mười Hai'].map((month, idx) => (
                      <option key={idx + 1} value={idx + 1}>{month}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Năm sinh
                  </label>
                  <select
                    value={formData.ngaySinh ? new Date(formData.ngaySinh).getFullYear() : ''}
                    onChange={(e) => {
                      const date = formData.ngaySinh ? new Date(formData.ngaySinh) : new Date();
                      date.setFullYear(parseInt(e.target.value));
                      setFormData({ ...formData, ngaySinh: date.toISOString().split('T')[0] });
                    }}
                    disabled={!isEditing}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none disabled:bg-gray-50"
                  >
                    <option value="">Năm</option>
                    {Array.from({ length: 100 }, (_, i) => 2024 - i).map(year => (
                      <option key={year} value={year}>{year}</option>
                    ))}
                  </select>
                </div>
                <div></div>
              </div>

              {/* Số điện thoại */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Số điện thoại
                </label>
                <input
                  type="tel"
                  value={formData.soDienThoai}
                  onChange={(e) => setFormData({ ...formData, soDienThoai: e.target.value })}
                  disabled={!isEditing}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none disabled:bg-gray-50 disabled:text-gray-600"
                  placeholder="Nhập số điện thoại"
                />
              </div>

              {/* Địa chỉ */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Thành phố cư trú
                </label>
                <input
                  type="text"
                  value={formData.diaChi}
                  onChange={(e) => setFormData({ ...formData, diaChi: e.target.value })}
                  disabled={!isEditing}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none disabled:bg-gray-50 disabled:text-gray-600"
                  placeholder="Thành phố cư trú"
                />
              </div>
            </div>

            {/* Action Buttons */}
            {isEditing && (
              <div className="flex gap-3 mt-8">
                <button
                  type="button"
                  onClick={() => setIsEditing(false)}
                  className="flex-1 px-6 py-3 border border-gray-300 text-gray-700 rounded-lg font-semibold hover:bg-gray-50"
                >
                  Có lẻ để sau
                </button>
                <button
                  type="submit"
                  className="flex-1 px-6 py-3 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700"
                >
                  Lưu
                </button>
              </div>
            )}
          </form>
        </div>
      </div>
    </div>
  );
}
