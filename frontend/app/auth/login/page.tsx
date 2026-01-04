'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { GoogleLogin, CredentialResponse } from '@react-oauth/google';

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
      const res = await fetch('http://localhost:5000/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      if (!res.ok) {
        throw new Error('Đăng nhập thất bại');
      }

      const data = await res.json();
      localStorage.setItem('token', data.accessToken);
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

  const handleGoogleSuccess = async (credentialResponse: CredentialResponse) => {
    try {
      setLoading(true);
      const res = await fetch('http://localhost:5000/auth/google', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ idToken: credentialResponse.credential }),
      });

      if (!res.ok) {
        throw new Error('Đăng nhập Google thất bại');
      }

      const data = await res.json();
      localStorage.setItem('token', data.accessToken);
      localStorage.setItem('user', JSON.stringify(data.user));

      alert('Đăng nhập Google thành công!');
      router.push('/');
    } catch (error) {
      console.error('Lỗi:', error);
      alert('Đăng nhập Google thất bại');
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleError = () => {
    alert('Đăng nhập Google thất bại');
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
                <span className="px-2 bg-white text-gray-500">Các lựa chọn khác</span>
              </div>
            </div>

            <div className="mt-6 grid grid-cols-2 gap-4">
              <div className="flex justify-center">
                <GoogleLogin
                  onSuccess={handleGoogleSuccess}
                  onError={handleGoogleError}
                  theme="outline"
                  size="large"
                  text="signin_with"
                  shape="rectangular"
                />
              </div>
              <button 
                type="button"
                onClick={() => alert('Chức năng đăng nhập Facebook đang được phát triển')}
                className="border-2 border-gray-200 rounded-xl py-3.5 hover:bg-gray-50 hover:border-gray-300 transition flex items-center justify-center gap-3 shadow-sm"
              >
                <svg className="w-5 h-5" fill="#1877F2" viewBox="0 0 24 24">
                  <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
                </svg>
                <span className="font-medium text-gray-700">Facebook</span>
              </button>
            </div>

            <div className="mt-6 text-center text-sm text-gray-500">
              <p>Giá thấp hơn và nhiều phần thưởng đang chờ bạn. Mở khóa ưu đãi bằng cách đăng nhập!</p>
            </div>

            <div className="mt-4 text-center">
              <p className="text-sm text-gray-600">
                Bằng cách tiếp tục, bạn đồng ý với{' '}
                <a href="#" className="text-blue-600 hover:underline">Điều khoản</a>
                {' '}và{' '}
                <a href="#" className="text-blue-600 hover:underline">Điều kiện</a>
                {' '}này và bạn đã được thông báo về{' '}
                <a href="#" className="text-blue-600 hover:underline">Chính sách bảo vệ dữ liệu</a>
                {' '}của chúng tôi.
              </p>
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
