'use client';

import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';

interface UserSidebarProps {
  userName: string;
  userPoints?: number;
}

export default function UserSidebar({ userName, userPoints = 0 }: UserSidebarProps) {
  const pathname = usePathname();
  const router = useRouter();

  const getInitials = (name: string) => {
    const parts = name.split(' ');
    if (parts.length >= 2) {
      return parts[0][0] + parts[parts.length - 1][0];
    }
    return name.substring(0, 2);
  };

  const handleLogout = () => {
    localStorage.removeItem('user');
    localStorage.removeItem('token');
    router.push('/');
    window.location.reload();
  };

  const menuItems = [
    { href: '/user/points', icon: '⚪', label: `${userPoints} Điểm` },
    { href: '/user/cards', icon: '💳', label: 'Thẻ của tôi' },
    { href: '/quan-ly-dat-cho', icon: '📋', label: 'Đặt chỗ của tôi' },
    { href: '/user/transactions', icon: '📋', label: 'Danh sách giao dịch' },
    { href: '/user/refunds', icon: '💰', label: 'Refunds' },
    { href: '/user/flight-alerts', icon: '🔔', label: 'Thông báo giá vé máy bay' },
    { href: '/user/saved-travelers', icon: '👥', label: 'Thông tin hành khách đã lưu' },
    { href: '/user/notifications', icon: '✉️', label: 'Cài đặt thông báo' },
    { href: '/user/profile', icon: '⚙️', label: 'Tài khoản' },
  ];

  return (
    <div className="bg-white rounded-lg shadow-sm overflow-hidden">
      {/* User Header */}
      <div className="p-6 bg-gradient-to-r from-amber-500 to-amber-600">
        <div className="flex items-center gap-3 mb-3">
          <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center text-amber-600 font-bold text-lg">
            {getInitials(userName)}
          </div>
          <div className="text-white">
            <div className="font-semibold">{userName}</div>
            <div className="text-sm opacity-90">Google</div>
          </div>
        </div>
        <div className="bg-white/20 backdrop-blur-sm rounded-lg px-3 py-2 flex items-center gap-2">
          <span className="text-white text-sm">🥉</span>
          <span className="text-white text-sm font-medium">Bạn là thành viên Bronze Priority</span>
          <span className="ml-auto text-white">›</span>
        </div>
      </div>

      {/* Menu Items */}
      <div className="py-2">
        {menuItems.map((item) => (
          <Link
            key={item.href}
            href={item.href}
            className={`flex items-center gap-3 px-6 py-3 transition-colors ${
              pathname === item.href
                ? 'bg-blue-50 text-blue-600 border-l-4 border-blue-600'
                : 'text-gray-700 hover:bg-gray-50'
            }`}
          >
            <span className="text-xl">{item.icon}</span>
            <span className={pathname === item.href ? 'font-medium' : ''}>{item.label}</span>
          </Link>
        ))}
      </div>

      {/* Logout */}
      <div className="border-t border-gray-100">
        <button
          onClick={handleLogout}
          className="flex items-center gap-3 px-6 py-3 w-full text-left text-gray-700 hover:bg-gray-50 transition-colors"
        >
          <span className="text-xl">🔴</span>
          <span>Đăng xuất</span>
        </button>
      </div>
    </div>
  );
}
