'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function LoginPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    email: '',
    matKhau: '',
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const res = await fetch('http://localhost:3000/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      if (!res.ok) {
        throw new Error('Đăng nhập thất bại');
      }

      const data = await res.json();
      localStorage.setItem('token', data.access_token);
      localStorage.setItem('user', JSON.stringify(data.user));

      alert('Đăng nhập thành công!');
      router.push('/');
    } catch (error) {
      console.error('Lỗi:', error);
      alert('Email hoặc mật khẩu không đúng');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex">
      {/* Left Side - Form */}
      <div className="flex-1 flex items-center justify-center p-8 bg-white">
        <div className="max-w-md w-full">
          <div className="mb-8">
            <div className="flex items-center gap-2 mb-6">
              <span className="text-3xl">✈️</span>
              <span className="text-2xl font-bold text-blue-600">BayNhanh</span>
            </div>
            <h1 className="text-3xl font-bold mb-2">Chào mừng trở lại!</h1>
            <p className="text-gray-600">
              Đăng nhập để quản lý đặt chỗ và nhận ưu đãi độc quyền
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Email hoặc Số điện thoại
              </label>
              <input
                type="text"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                placeholder="nhap@email.com"
                className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Mật khẩu
              </label>
              <input
                type="password"
                value={formData.matKhau}
                onChange={(e) => setFormData({ ...formData, matKhau: e.target.value })}
                placeholder="••••••••"
                className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                required
              />
              <a href="#" className="text-sm text-blue-600 hover:underline mt-1 inline-block">
                Quên mật khẩu?
              </a>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-blue-600 text-white py-3 rounded-lg font-semibold hover:bg-blue-700 disabled:bg-gray-400 transition"
            >
              {loading ? 'Đang đăng nhập...' : 'Đăng nhập'}
            </button>
          </form>

          <div className="mt-6">
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-300"></div>
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-2 bg-white text-gray-500">Hoặc tiếp tục với</span>
              </div>
            </div>

            <div className="mt-6 grid grid-cols-2 gap-3">
              <button className="border-2 border-gray-300 rounded-lg py-3 hover:bg-gray-50 transition flex items-center justify-center gap-2">
                <span>🔵</span>
                <span className="font-medium">Google</span>
              </button>
              <button className="border-2 border-gray-300 rounded-lg py-3 hover:bg-gray-50 transition flex items-center justify-center gap-2">
                <span>📘</span>
                <span className="font-medium">Facebook</span>
              </button>
            </div>
          </div>

          <p className="mt-8 text-center text-gray-600">
            Chưa có tài khoản?{' '}
            <a href="/auth/register" className="text-blue-600 font-medium hover:underline">
              Đăng ký ngay
            </a>
          </p>
        </div>
      </div>

      {/* Right Side - Image/Info */}
      <div className="hidden lg:flex flex-1 bg-gradient-to-br from-blue-600 to-blue-800 text-white p-12 flex-col justify-center">
        <h2 className="text-4xl font-bold mb-6">
          Bắt đầu hành trình của bạn ngay hôm nay.
        </h2>
        <p className="text-xl mb-8">
          Tham gia cùng hàng triệu khách hàng. Đặt vé máy bay, quản lý chuyến đi và nhận ưu đãi đặc biệt.
        </p>
        <div className="space-y-4">
          <div className="flex items-start gap-3">
            <span className="text-3xl">5M+</span>
            <div>
              <p className="font-bold text-lg">Khách hàng tin dùng</p>
              <p className="text-blue-100">Hàng triệu lượt đặt vé mỗi năm</p>
            </div>
          </div>
          <div className="flex items-start gap-3">
            <span className="text-3xl">150+</span>
            <div>
              <p className="font-bold text-lg">Điểm đến</p>
              <p className="text-blue-100">Kết nối bạn đến mọi nơi</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
