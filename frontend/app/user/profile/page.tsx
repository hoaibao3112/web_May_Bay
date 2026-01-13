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
  diemThuong?: number;
}

export default function ProfilePage() {
  const [user, setUser] = useState<User | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [activeTab, setActiveTab] = useState<'info' | 'security'>('info');
  const [formData, setFormData] = useState({
    hoTen: '',
    email: '',
    soDienThoai: '',
    ngaySinh: '',
    gioiTinh: 'Nam',
    diaChi: '',
  });

  // Security tab states
  const [passwordData, setPasswordData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
    otp: '',
  });
  const [otpSent, setOtpSent] = useState(false);
  const [otpTimer, setOtpTimer] = useState(0);
  const [passwordStrength, setPasswordStrength] = useState('');

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

  // OTP timer countdown
  useEffect(() => {
    if (otpTimer > 0) {
      const interval = setInterval(() => {
        setOtpTimer((prev) => prev - 1);
      }, 1000);
      return () => clearInterval(interval);
    } else if (otpTimer === 0 && otpSent) {
      setOtpSent(false);
    }
  }, [otpTimer, otpSent]);

  // Password strength calculation
  useEffect(() => {
    const password = passwordData.newPassword;
    if (!password) {
      setPasswordStrength('');
      return;
    }

    let strength = 0;
    if (password.length >= 8) strength++;
    if (password.length >= 12) strength++;
    if (/[a-z]/.test(password)) strength++;
    if (/[A-Z]/.test(password)) strength++;
    if (/\d/.test(password)) strength++;
    if (/[^a-zA-Z\d]/.test(password)) strength++;

    if (strength <= 2) setPasswordStrength('weak');
    else if (strength <= 4) setPasswordStrength('medium');
    else setPasswordStrength('strong');
  }, [passwordData.newPassword]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      // Update localStorage
      const updatedUser: User = {
        ...user,
        ...formData,
        id: user!.id,
        email: user!.email
      };
      localStorage.setItem('user', JSON.stringify(updatedUser));
      setUser(updatedUser);
      setIsEditing(false);
      alert('Cập nhật thông tin thành công!');
    } catch (error) {
      console.error('Error updating profile:', error);
      alert('Có lỗi xảy ra. Vui lòng thử lại!');
    }
  };

  const handleRequestOTP = async () => {
    try {
      const token = localStorage.getItem('accessToken');
      const response = await fetch('http://localhost:5000/api/auth/request-password-otp', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || 'Không thể gửi OTP');
      }

      setOtpSent(true);
      setOtpTimer(300); // 5 minutes
      alert('Mã OTP đã được gửi đến email của bạn!');
    } catch (error: any) {
      alert(error.message || 'Có lỗi xảy ra khi gửi OTP');
    }
  };

  const handleChangePassword = async (e: React.FormEvent) => {
    e.preventDefault();

    // Validation
    if (passwordData.newPassword !== passwordData.confirmPassword) {
      alert('Mật khẩu mới không khớp!');
      return;
    }

    if (passwordData.newPassword.length < 8) {
      alert('Mật khẩu mới phải có ít nhất 8 ký tự!');
      return;
    }

    if (!/(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/.test(passwordData.newPassword)) {
      alert('Mật khẩu phải chứa ít nhất 1 chữ hoa, 1 chữ thường và 1 số!');
      return;
    }

    if (!otpSent || !passwordData.otp) {
      alert('Vui lòng nhập mã OTP!');
      return;
    }

    try {
      const token = localStorage.getItem('accessToken');
      const response = await fetch('http://localhost:5000/api/auth/change-password', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          currentPassword: passwordData.currentPassword,
          newPassword: passwordData.newPassword,
          otp: passwordData.otp,
        }),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || 'Không thể đổi mật khẩu');
      }

      alert('Đổi mật khẩu thành công!');
      setPasswordData({
        currentPassword: '',
        newPassword: '',
        confirmPassword: '',
        otp: '',
      });
      setOtpSent(false);
      setOtpTimer(0);
    } catch (error: any) {
      alert(error.message || 'Có lỗi xảy ra khi đổi mật khẩu');
    }
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
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
                  <button
                    onClick={() => setActiveTab('info')}
                    className={`px-6 py-4 text-sm font-medium ${activeTab === 'info'
                      ? 'text-blue-600 border-b-2 border-blue-600'
                      : 'text-gray-500 hover:text-gray-700'
                      }`}
                  >
                    Thông tin tài khoản
                  </button>
                  <button
                    onClick={() => setActiveTab('security')}
                    className={`px-6 py-4 text-sm font-medium ${activeTab === 'security'
                      ? 'text-blue-600 border-b-2 border-blue-600'
                      : 'text-gray-500 hover:text-gray-700'
                      }`}
                  >
                    Mật khẩu & Bảo mật
                  </button>
                </nav>
              </div>

              {/* Form Section */}
              {activeTab === 'info' && (
                <div className="p-6">
                  <div className="flex justify-between items-center mb-6">
                    <h2 className="text-xl font-bold text-gray-900">Dữ liệu cá nhân</h2>
                    {!isEditing && (
                      <button
                        onClick={() => setIsEditing(true)}
                        className="px-4 py-2 text-blue-600 hover:text-blue-700 font-medium text-sm border border-blue-600 rounded-lg hover:bg-blue-50"
                      >
                        ✏️ Chỉnh sửa
                      </button>
                    )}
                  </div>

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
              )}

              {/* Security Tab */}
              {activeTab === 'security' && (
                <div className="p-6">
                  <h2 className="text-xl font-bold text-gray-900 mb-6">Đổi Mật Khẩu</h2>

                  <form onSubmit={handleChangePassword}>
                    <div className="space-y-6 max-w-2xl">
                      {/* Current Password */}
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Mật khẩu hiện tại
                        </label>
                        <input
                          type="password"
                          value={passwordData.currentPassword}
                          onChange={(e) => setPasswordData({ ...passwordData, currentPassword: e.target.value })}
                          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
                          placeholder="Nhập mật khẩu hiện tại"
                          required
                        />
                      </div>

                      {/* New Password */}
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Mật khẩu mới
                        </label>
                        <input
                          type="password"
                          value={passwordData.newPassword}
                          onChange={(e) => setPasswordData({ ...passwordData, newPassword: e.target.value })}
                          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
                          placeholder="Nhập mật khẩu mới (ít nhất 8 ký tự)"
                          required
                          minLength={8}
                        />

                        {/* Password Strength Indicator */}
                        {passwordData.newPassword && (
                          <div className="mt-2">
                            <div className="flex items-center gap-2 mb-1">
                              <div className="flex-1 h-2 bg-gray-200 rounded-full overflow-hidden">
                                <div
                                  className={`h-full transition-all ${passwordStrength === 'weak'
                                    ? 'w-1/3 bg-red-500'
                                    : passwordStrength === 'medium'
                                      ? 'w-2/3 bg-yellow-500'
                                      : 'w-full bg-green-500'
                                    }`}
                                />
                              </div>
                              <span
                                className={`text-xs font-medium ${passwordStrength === 'weak'
                                  ? 'text-red-600'
                                  : passwordStrength === 'medium'
                                    ? 'text-yellow-600'
                                    : 'text-green-600'
                                  }`}
                              >
                                {passwordStrength === 'weak'
                                  ? 'Yếu'
                                  : passwordStrength === 'medium'
                                    ? 'Trung bình'
                                    : 'Mạnh'}
                              </span>
                            </div>
                            <p className="text-xs text-gray-500">
                              Mật khẩu phải chứa ít nhất 1 chữ hoa, 1 chữ thường và 1 số
                            </p>
                          </div>
                        )}
                      </div>

                      {/* Confirm Password */}
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Xác nhận mật khẩu mới
                        </label>
                        <input
                          type="password"
                          value={passwordData.confirmPassword}
                          onChange={(e) => setPasswordData({ ...passwordData, confirmPassword: e.target.value })}
                          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
                          placeholder="Nhập lại mật khẩu mới"
                          required
                        />
                        {passwordData.confirmPassword && passwordData.newPassword !== passwordData.confirmPassword && (
                          <p className="mt-1 text-sm text-red-600">Mật khẩu không khớp</p>
                        )}
                      </div>

                      {/* Request OTP Button */}
                      <div>
                        <button
                          type="button"
                          onClick={handleRequestOTP}
                          disabled={otpSent && otpTimer > 0}
                          className="px-6 py-3 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed"
                        >
                          {otpSent && otpTimer > 0
                            ? `Gửi lại sau ${formatTime(otpTimer)}`
                            : otpSent
                              ? 'Gửi lại mã OTP'
                              : '📧 Gửi mã OTP qua Email'}
                        </button>
                        {otpSent && (
                          <p className="mt-2 text-sm text-green-600">
                            ✅ Mã OTP đã được gửi đến email của bạn. Vui lòng kiểm tra hộp thư!
                          </p>
                        )}
                      </div>

                      {/* OTP Input */}
                      {otpSent && (
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            Mã OTP (6 chữ số)
                          </label>
                          <input
                            type="text"
                            value={passwordData.otp}
                            onChange={(e) => {
                              const value = e.target.value.replace(/\D/g, '').slice(0, 6);
                              setPasswordData({ ...passwordData, otp: value });
                            }}
                            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none text-center text-2xl tracking-widest font-mono"
                            placeholder="000000"
                            maxLength={6}
                            required
                          />
                          <p className="mt-1 text-xs text-gray-500">
                            ⏱️ Mã OTP có hiệu lực trong {formatTime(otpTimer)}
                          </p>
                        </div>
                      )}

                      {/* Submit Button */}
                      <div className="pt-4">
                        <button
                          type="submit"
                          className="w-full px-6 py-3 bg-green-600 text-white rounded-lg font-semibold hover:bg-green-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors"
                          disabled={!otpSent || !passwordData.otp || passwordData.otp.length !== 6}
                        >
                          🔐 Đổi Mật Khẩu
                        </button>
                      </div>

                      {/* Security Notice */}
                      <div className="bg-blue-50 border-l-4 border-blue-500 p-4 rounded">
                        <div className="flex">
                          <div className="flex-shrink-0">
                            <span className="text-blue-500 text-xl">ℹ️</span>
                          </div>
                          <div className="ml-3">
                            <p className="text-sm text-blue-700">
                              <strong>Lưu ý bảo mật:</strong> Không chia sẻ mã OTP với bất kỳ ai.
                              BayNhanh sẽ không bao giờ yêu cầu mã OTP của bạn qua điện thoại hoặc email.
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </form>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
