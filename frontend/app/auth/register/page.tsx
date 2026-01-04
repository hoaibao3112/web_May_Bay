'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { GoogleLogin, CredentialResponse } from '@react-oauth/google';

export default function RegisterPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    email: '',
    matKhau: '',
    xacNhanMatKhau: '',
    hoTen: '',
    soDienThoai: '',
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (formData.matKhau !== formData.xacNhanMatKhau) {
      alert('Mật khẩu xác nhận không khớp');
      return;
    }

    if (formData.matKhau.length < 6) {
      alert('Mật khẩu phải có ít nhất 6 ký tự');
      return;
    }

    setLoading(true);

    try {
      const res = await fetch('http://localhost:5000/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: formData.email,
          matKhau: formData.matKhau,
          hoTen: formData.hoTen,
          soDienThoai: formData.soDienThoai,
        }),
      });

      if (!res.ok) {
        const error = await res.json();
        throw new Error(error.message || 'Đăng ký thất bại');
      }

      alert('Đăng ký thành công! Vui lòng đăng nhập.');
      router.push('/auth/login');
    } catch (error: any) {
      console.error('Lỗi:', error);
      alert(error.message || 'Email hoặc số điện thoại đã tồn tại');
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
        throw new Error('Đăng ký Google thất bại');
      }

      const data = await res.json();
      localStorage.setItem('token', data.accessToken);
      localStorage.setItem('user', JSON.stringify(data.user));

      alert('Đăng ký Google thành công!');
      router.push('/');
    } catch (error) {
      console.error('Lỗi:', error);
      alert('Đăng ký Google thất bại');
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleError = () => {
    alert('Đăng ký Google thất bại');
  };

  return (
    <div className="min-h-screen flex">
      {/* Left Side - Image/Info */}
      <div className="hidden lg:flex flex-1 bg-gradient-to-br from-blue-600 to-blue-800 text-white p-12 flex-col justify-center">
        <div className="mb-8">
          <span className="text-6xl mb-4 block">✈️</span>
          <h2 className="text-4xl font-bold mb-4">
            Chuyến bay của bạn, sự chọn lựa của chúng tôi
          </h2>
          <p className="text-xl">
            Đăng ký để trải nghiệm đặt vé dễ dàng và nhận được những ưu đãi tốt nhất
          </p>
        </div>
        <div className="space-y-4">
          <div className="flex items-center gap-3">
            <span className="text-2xl">✓</span>
            <p className="text-lg">Giá vé tốt nhất được đảm bảo</p>
          </div>
          <div className="flex items-center gap-3">
            <span className="text-2xl">✓</span>
            <p className="text-lg">Đổi/hủy vé linh hoạt</p>
          </div>
          <div className="flex items-center gap-3">
            <span className="text-2xl">✓</span>
            <p className="text-lg">Hỗ trợ 24/7</p>
          </div>
          <div className="flex items-center gap-3">
            <span className="text-2xl">✓</span>
            <p className="text-lg">Tích lũy điểm thưởng</p>
          </div>
        </div>
      </div>

      {/* Right Side - Form */}
      <div className="flex-1 flex items-center justify-center p-8 bg-white">
        <div className="max-w-md w-full">
          <div className="mb-8">
            <div className="flex items-center gap-2 mb-6 lg:hidden">
              <span className="text-3xl">✈️</span>
              <span className="text-2xl font-bold text-blue-600">BayNhanh</span>
            </div>
            <h1 className="text-3xl font-bold mb-2">Tạo tài khoản mới</h1>
            <p className="text-gray-600">
              Điền thông tin bên dưới để đăng ký tài khoản và bắt đầu đặt vé
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Họ và tên <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                value={formData.hoTen}
                onChange={(e) => setFormData({ ...formData, hoTen: e.target.value })}
                placeholder="Nguyễn Văn A"
                className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                required
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Email <span className="text-red-500">*</span>
                </label>
                <input
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  placeholder="email@example.com"
                  className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Số điện thoại <span className="text-red-500">*</span>
                </label>
                <input
                  type="tel"
                  value={formData.soDienThoai}
                  onChange={(e) => setFormData({ ...formData, soDienThoai: e.target.value })}
                  placeholder="0901234567"
                  className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  required
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Mật khẩu <span className="text-red-500">*</span>
              </label>
              <input
                type="password"
                value={formData.matKhau}
                onChange={(e) => setFormData({ ...formData, matKhau: e.target.value })}
                placeholder="••••••••"
                className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                required
                minLength={6}
              />
              <p className="text-xs text-gray-500 mt-1">Tối thiểu 6 ký tự</p>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Xác nhận mật khẩu <span className="text-red-500">*</span>
              </label>
              <input
                type="password"
                value={formData.xacNhanMatKhau}
                onChange={(e) => setFormData({ ...formData, xacNhanMatKhau: e.target.value })}
                placeholder="••••••••"
                className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                required
              />
            </div>

            <div className="flex items-start gap-2">
              <input
                type="checkbox"
                id="terms"
                className="mt-1 w-4 h-4 text-blue-600"
                required
              />
              <label htmlFor="terms" className="text-sm text-gray-600">
                Tôi đồng ý với{' '}
                <a href="#" className="text-blue-600 hover:underline">Điều khoản dịch vụ</a>
                {' '}và{' '}
                <a href="#" className="text-blue-600 hover:underline">Chính sách bảo mật</a>
              </label>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-blue-600 text-white py-3 rounded-lg font-semibold hover:bg-blue-700 disabled:bg-gray-400 transition"
            >
              {loading ? 'Đang đăng ký...' : 'Đăng ký'}
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
                  text="signup_with"
                  shape="rectangular"
                />
              </div>
              <button 
                type="button"
                onClick={() => alert('Chức năng đăng ký Facebook đang được phát triển')}
                className="border-2 border-gray-200 rounded-xl py-3.5 hover:bg-gray-50 hover:border-gray-300 transition flex items-center justify-center gap-3 shadow-sm"
              >
                <svg className="w-5 h-5" fill="#1877F2" viewBox="0 0 24 24">
                  <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
                </svg>
                <span className="font-medium text-gray-700">Facebook</span>
              </button>
            </div>

            <div className="mt-6 text-center text-sm text-gray-500">
              <p>Giá thấp hơn và nhiều phần thưởng đang chờ bạn. Mở khóa ưu đãi bằng cách đăng ký!</p>
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
            Đã có tài khoản?{' '}
            <a href="/auth/login" className="text-blue-600 font-medium hover:underline">
              Đăng nhập ngay
            </a>
          </p>
        </div>
      </div>
    </div>
  );
}
