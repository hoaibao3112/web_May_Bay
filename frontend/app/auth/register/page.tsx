'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

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
      const res = await fetch('http://localhost:3000/auth/register', {
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
                <span className="px-2 bg-white text-gray-500">Hoặc đăng ký với</span>
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
