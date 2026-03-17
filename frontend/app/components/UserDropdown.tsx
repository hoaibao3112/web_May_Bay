'use client';

import { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

interface User {
  id: number;
  hoTen: string;
  email: string;
  soDienThoai?: string;
  diemThuong?: number;
}

export default function UserDropdown() {
  const [isOpen, setIsOpen] = useState(false);
  const [user, setUser] = useState<User | null>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const router = useRouter();

  useEffect(() => {
    // Load user from localStorage
    const loadUser = () => {
      const userData = localStorage.getItem('user');
      if (userData) {
        try {
          setUser(JSON.parse(userData));
        } catch (error) {
          console.error('Error parsing user data:', error);
        }
      } else {
        setUser(null);
      }
    };

    loadUser();

    // Listen for storage changes (works across tabs)
    window.addEventListener('storage', loadUser);

    // Listen for custom event (works in same tab)
    window.addEventListener('userLogin', loadUser);

    return () => {
      window.removeEventListener('storage', loadUser);
      window.removeEventListener('userLogin', loadUser);
    };
  }, []);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('user');
    localStorage.removeItem('token');
    setUser(null);
    setIsOpen(false);
    router.push('/');
    window.location.reload();
  };

  if (!user) {
    return (
      <div className="flex items-center gap-3">
        <Link
          href="/auth/login"
          className="text-secondary-700 hover:text-primary-600 font-medium transition-colors"
        >
          Đăng nhập
        </Link>
        <Link
          href="/auth/register"
          className="px-5 py-2 bg-primary-600 text-white rounded-lg font-medium hover:bg-primary-700 transition-colors"
        >
          Đăng ký
        </Link>
      </div>
    );
  }

  const getInitials = (name?: string) => {
    if (!name || typeof name !== 'string') {
      return 'U';
    }
    const parts = name.trim().split(' ');
    if (parts.length >= 2) {
      return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
    }
    return name.substring(0, 2).toUpperCase();
  };

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 px-3 py-2 hover:bg-primary-50 rounded-lg transition-colors"
      >
        <div className="w-10 h-10 bg-primary-600 rounded-full flex items-center justify-center text-white font-semibold">
          {getInitials(user?.hoTen)}
        </div>
        <div className="text-left hidden md:block">
          <div className="font-medium text-secondary-900">{user?.hoTen}</div>
          <div className="text-xs text-secondary-500 flex items-center gap-1">
            <span className="text-primary-500">⭐</span> {user?.diemThuong || 0} Điểm
          </div>
        </div>
        <svg
          className={`w-4 h-4 text-secondary-600 transition-transform ${isOpen ? 'rotate-180' : ''}`}
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-2 w-72 bg-white rounded-lg shadow-xl border border-primary-200 py-2 z-50">
          {/* User Info Header */}
          <div className="px-4 py-3 border-b border-primary-100">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-primary-600 rounded-full flex items-center justify-center text-white font-semibold text-lg">
                {getInitials(user?.hoTen)}
              </div>
              <div>
                <div className="font-semibold text-secondary-900">{user?.hoTen}</div>
                <div className="text-sm text-secondary-500">{user?.email}</div>
              </div>
            </div>
            <div className="mt-2 px-3 py-2 bg-primary-50 rounded-lg border border-primary-200">
              <div className="flex items-center justify-between">
                <span className="text-sm text-secondary-700">Bạn là thành viên</span>
                <span className="text-sm font-semibold text-primary-600">Bronze Priority</span>
              </div>
            </div>
          </div>

          {/* Menu Items */}
          <div className="py-2">
            <Link
              href="/user/points"
              className="flex items-center gap-3 px-4 py-3 hover:bg-primary-50 transition-colors"
              onClick={() => setIsOpen(false)}
            >
              <span className="text-xl">⚪</span>
              <span className="text-secondary-700">{user?.diemThuong || 0} Điểm</span>
            </Link>

            <Link
              href="/user/profile"
              className="flex items-center gap-3 px-4 py-3 hover:bg-primary-50 transition-colors"
              onClick={() => setIsOpen(false)}
            >
              <span className="text-xl">👤</span>
              <span className="text-secondary-700">Chỉnh sửa hồ sơ</span>
            </Link>

            <Link
              href="/user/cards"
              className="flex items-center gap-3 px-4 py-3 hover:bg-primary-50 transition-colors"
              onClick={() => setIsOpen(false)}
            >
              <span className="text-xl">💳</span>
              <span className="text-secondary-700">Thẻ của tôi</span>
            </Link>

            <Link
              href="/user/transactions"
              className="flex items-center gap-3 px-4 py-3 hover:bg-primary-50 transition-colors"
              onClick={() => setIsOpen(false)}
            >
              <span className="text-xl">📋</span>
              <span className="text-secondary-700">Danh sách giao dịch</span>
            </Link>

            <Link
              href="/dashboard/booking-history"
              className="flex items-center gap-3 px-4 py-3 hover:bg-primary-50 transition-colors"
              onClick={() => setIsOpen(false)}
            >
              <span className="text-xl">📋</span>
              <span className="text-secondary-700">Đặt chỗ của tôi</span>
            </Link>

            <Link
              href="/user/refunds"
              className="flex items-center gap-3 px-4 py-3 hover:bg-primary-50 transition-colors"
              onClick={() => setIsOpen(false)}
            >
              <span className="text-xl">💰</span>
              <div className="flex items-center gap-2">
                <span className="text-secondary-700">Hoàn tiền</span>
                <span className="px-2 py-0.5 bg-amber-400 text-xs font-bold rounded">New!</span>
              </div>
            </Link>

            <Link
              href="/user/flight-alerts"
              className="flex items-center gap-3 px-4 py-3 hover:bg-primary-50 transition-colors"
              onClick={() => setIsOpen(false)}
            >
              <span className="text-xl">🔔</span>
              <span className="text-secondary-700">Thông báo giá vé máy bay</span>
            </Link>

            <Link
              href="/user/saved-travelers"
              className="flex items-center gap-3 px-4 py-3 hover:bg-primary-50 transition-colors"
              onClick={() => setIsOpen(false)}
            >
              <span className="text-xl">👥</span>
              <span className="text-secondary-700">Thông tin hành khách đã lưu</span>
            </Link>

            <Link
              href="/user/promotions"
              className="flex items-center gap-3 px-4 py-3 hover:bg-primary-50 transition-colors"
              onClick={() => setIsOpen(false)}
            >
              <span className="text-xl">✉️</span>
              <span className="text-secondary-700">Khuyến mãi</span>
            </Link>
          </div>

          {/* Logout */}
          <div className="border-t border-primary-100 pt-2">
            <button
              onClick={handleLogout}
              className="flex items-center gap-3 px-4 py-3 w-full hover:bg-red-50 transition-colors text-left"
            >
              <span className="text-xl">🚪</span>
              <span className="text-red-500 font-medium">Đăng xuất</span>
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
