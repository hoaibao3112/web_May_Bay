'use client';

import { useState, useRef, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { usePathname } from 'next/navigation';
import UserDropdown from './UserDropdown';

export default function Header() {
  const [showSupportDropdown, setShowSupportDropdown] = useState(false);
  const [showMoreDropdown, setShowMoreDropdown] = useState(false);
  const pathname = usePathname();
  const supportRef = useRef<HTMLDivElement>(null);
  const moreRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (supportRef.current && !supportRef.current.contains(event.target as Node)) {
        setShowSupportDropdown(false);
      }
      if (moreRef.current && !moreRef.current.contains(event.target as Node)) {
        setShowMoreDropdown(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const isActive = (path: string) => {
    return pathname === path;
  };

  return (
    <header className="bg-white border-b border-primary-200 sticky top-0 z-50 shadow-md">
      {/* Top Bar */}
      <div className="border-b border-primary-100 bg-primary-50">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between h-14">
            {/* Logo */}
            <Link href="/" className="flex items-center gap-2">
              <div className="text-2xl font-bold text-primary-600">
                ✈️ BayNhanh
              </div>
            </Link>

            {/* Right Side Menu */}
            <div className="flex items-center gap-6">
              {/* Language/Currency */}
              <button className="flex items-center gap-1 text-sm font-medium text-secondary-700 hover:text-primary-600 transition-colors">
                🇻🇳 VND | VI
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </button>

              {/* Khuyến mãi */}
              <Link href="/khuyen-mai" className="flex items-center gap-2 text-sm font-medium text-secondary-700 hover:text-primary-600 transition-colors">
                🎁 Khuyến mãi
              </Link>

              {/* Hỗ trợ Dropdown */}
              <div className="relative" ref={supportRef}>
                <button
                  onClick={() => setShowSupportDropdown(!showSupportDropdown)}
                  className="flex items-center gap-1 text-sm font-medium text-secondary-700 hover:text-primary-600 transition-colors"
                >
                  Hỗ trợ
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </button>

                {showSupportDropdown && (
                  <div className="absolute right-0 mt-2 w-56 bg-white rounded-lg shadow-xl border border-primary-200 py-2">
                    <Link href="/ho-tro/trung-tam" className="block px-4 py-2 text-sm text-secondary-700 hover:bg-primary-50 transition-colors">
                      📚 Trung tâm trợ giúp
                    </Link>
                    <Link href="/ho-tro/lien-he" className="block px-4 py-2 text-sm text-secondary-700 hover:bg-primary-50 transition-colors">
                      📞 Liên hệ chúng tôi
                    </Link>
                    <Link href="/ho-tro/chinh-sach" className="block px-4 py-2 text-sm text-secondary-700 hover:bg-primary-50 transition-colors">
                      📋 Chính sách & Điều khoản
                    </Link>
                  </div>
                )}
              </div>

              {/* Hợp tác */}
              <Link href="/hop-tac" className="text-sm font-medium text-secondary-700 hover:text-primary-600 transition-colors">
                🤝 Hợp tác với chúng tôi
              </Link>

              {/* Đã Lưu */}
              <Link href="/da-luu" className="text-sm font-medium text-secondary-700 hover:text-primary-600 transition-colors">
                💾 Đã Lưu
              </Link>

              {/* Đặt chỗ của tôi */}
              <Link href="/dashboard/booking-history" className="text-sm font-medium text-secondary-700 hover:text-primary-600 transition-colors">
                📋 Đặt chỗ của tôi
              </Link>

              {/* User Dropdown */}
              <UserDropdown />
            </div>
          </div>
        </div>
      </div>

      {/* Main Navigation */}
      <div className="bg-white">
        <div className="container mx-auto px-4">
          <nav className="flex items-center gap-8 h-14">
            <Link
              href="/khachsan"
              className={`text-sm font-medium transition-colors ${isActive('/khachsan')
                ? 'text-primary-600 border-b-2 border-primary-600'
                : 'text-secondary-700 hover:text-primary-600'
                } h-full flex items-center`}
            >
              🏨 Khách sạn
            </Link>

            <Link
              href="/flights"
              className={`text-sm font-medium transition-colors ${isActive('/flights')
                ? 'text-primary-600 border-b-2 border-primary-600'
                : 'text-secondary-700 hover:text-primary-600'
                } h-full flex items-center`}
            >
              ✈️ Vé máy bay
            </Link>

            <Link
              href="/xekhach"
              className={`text-sm font-medium transition-colors ${isActive('/xekhach')
                ? 'text-primary-600 border-b-2 border-primary-600'
                : 'text-secondary-700 hover:text-primary-600'
                } h-full flex items-center`}
            >
              🚌 Vé xe khách
            </Link>

            <Link
              href="/duadon"
              className={`text-sm font-medium transition-colors ${isActive('/duadon')
                ? 'text-primary-600 border-b-2 border-primary-600'
                : 'text-secondary-700 hover:text-primary-600'
                } h-full flex items-center`}
            >
              🚖 Đưa đón sân bay
            </Link>

            <Link
              href="/cho-thue-xe"
              className={`text-sm font-medium transition-colors ${isActive('/cho-thue-xe')
                ? 'text-primary-600 border-b-2 border-primary-600'
                : 'text-secondary-700 hover:text-primary-600'
                } h-full flex items-center`}
            >
              🚗 Cho thuê xe
            </Link>

            <Link
              href="/hoat-dong"
              className={`text-sm font-medium transition-colors ${isActive('/hoat-dong')
                ? 'text-primary-600 border-b-2 border-primary-600'
                : 'text-secondary-700 hover:text-primary-600'
                } h-full flex items-center`}
            >
              🎡 Hoạt động & Vui chơi
            </Link>

            {/* More Dropdown */}
            <div className="relative h-full flex items-center" ref={moreRef}>
              <button
                onClick={() => setShowMoreDropdown(!showMoreDropdown)}
                className={`text-sm font-medium transition-colors flex items-center gap-1 ${showMoreDropdown
                  ? 'text-primary-600'
                  : 'text-secondary-700 hover:text-primary-600'
                  }`}
              >
                More
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </button>

              {showMoreDropdown && (
                <div className="absolute top-full left-0 mt-0 w-56 bg-white rounded-lg shadow-xl border border-primary-200 py-2">
                  <Link href="/tours" className="block px-4 py-2 text-sm text-secondary-700 hover:bg-primary-50 transition-colors">
                    🗺️ Tours du lịch
                  </Link>
                  <Link href="/visa" className="block px-4 py-2 text-sm text-secondary-700 hover:bg-primary-50 transition-colors">
                    📝 Dịch vụ Visa
                  </Link>
                  <Link href="/bao-hiem" className="block px-4 py-2 text-sm text-secondary-700 hover:bg-primary-50 transition-colors">
                    🛡️ Bảo hiểm du lịch
                  </Link>
                  <Link href="/sim-du-lich" className="block px-4 py-2 text-sm text-secondary-700 hover:bg-primary-50 transition-colors">
                    📱 SIM du lịch
                  </Link>
                </div>
              )}
            </div>
          </nav>
        </div>
      </div>
    </header>
  );
}
