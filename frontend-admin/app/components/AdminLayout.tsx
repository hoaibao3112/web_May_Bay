'use client';

import { ReactNode } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
    FiHome, FiUsers, FiPackage, FiDollarSign, FiSettings,
    FiCalendar, FiStar, FiTag, FiCreditCard, FiTruck,
    FiMapPin, FiShield, FiLogOut, FiMenu, FiX
} from 'react-icons/fi';
import { useState } from 'react';

interface AdminLayoutProps {
    children: ReactNode;
}

export default function AdminLayout({ children }: AdminLayoutProps) {
    const pathname = usePathname();
    const [sidebarOpen, setSidebarOpen] = useState(false);
    const [user, setUser] = useState<any>(null);

    // Get user from localStorage
    useState(() => {
        if (typeof window !== 'undefined') {
            const userStr = localStorage.getItem('adminUser');
            if (userStr) {
                setUser(JSON.parse(userStr));
            }
        }
    });

    const handleLogout = () => {
        localStorage.removeItem('adminToken');
        localStorage.removeItem('adminUser');
        window.location.href = '/login';
    };

    const navigation = [
        {
            title: 'Tổng quan',
            items: [
                { name: 'Dashboard', href: '/dashboard', icon: FiHome },
                { name: 'Thống kê', href: '/dashboard/analytics', icon: FiCalendar },
            ]
        },
        {
            title: 'Quản lý đặt chỗ',
            items: [
                { name: 'Tất cả đặt chỗ', href: '/dashboard/bookings', icon: FiPackage },
                { name: 'Vé máy bay', href: '/dashboard/bookings/flights', icon: FiMapPin },
                { name: 'Vé xe khách', href: '/dashboard/bookings/buses', icon: FiTruck },
                { name: 'Thuê xe', href: '/dashboard/bookings/cars', icon: FiTruck },
                { name: 'Đưa đón sân bay', href: '/dashboard/bookings/transfers', icon: FiMapPin },
                { name: 'Khách sạn', href: '/dashboard/bookings/hotels', icon: FiHome },
            ]
        },
        {
            title: 'Quản lý dịch vụ',
            items: [
                { name: 'Hãng hàng không', href: '/dashboard/airlines', icon: FiMapPin },
                { name: 'Nhà xe', href: '/dashboard/bus-companies', icon: FiTruck },
                { name: 'Công ty thuê xe', href: '/dashboard/car-companies', icon: FiTruck },
                { name: 'Khách sạn', href: '/dashboard/hotels', icon: FiHome },
            ]
        },
        {
            title: 'Người dùng & Thanh toán',
            items: [
                { name: 'Người dùng', href: '/dashboard/users', icon: FiUsers },
                { name: 'Thanh toán', href: '/dashboard/payments', icon: FiCreditCard },
                { name: 'Khuyến mãi', href: '/dashboard/promotions', icon: FiTag },
            ]
        },
        {
            title: 'Khác',
            items: [
                { name: 'Đánh giá', href: '/dashboard/reviews', icon: FiStar },
                { name: 'Cài đặt', href: '/dashboard/settings', icon: FiSettings },
            ]
        },
    ];

    const NavItem = ({ item }: { item: any }) => {
        const isActive = pathname === item.href || pathname.startsWith(item.href + '/');
        const Icon = item.icon;

        return (
            <Link
                href={item.href}
                className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-200 ${isActive
                    ? 'bg-blue-500 text-white shadow-lg shadow-blue-500/30'
                    : 'text-slate-400 hover:bg-slate-800 hover:text-white'
                    }`}
                onClick={() => setSidebarOpen(false)}
            >
                <Icon className="w-5 h-5" />
                <span className="text-sm font-medium">{item.name}</span>
            </Link>
        );
    };

    return (
        <div className="min-h-screen bg-slate-950">
            {/* Sidebar */}
            <aside
                className={`fixed top-0 left-0 z-40 w-72 h-screen bg-slate-900 border-r border-slate-800 transition-transform duration-300 ${sidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
                    }`}
            >
                {/* Logo */}
                <div className="flex items-center justify-between h-16 px-6 border-b border-slate-800">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-blue-600 rounded-lg flex items-center justify-center shadow-lg shadow-blue-500/30">
                            <span className="text-xl">✈️</span>
                        </div>
                        <div>
                            <div className="text-sm font-bold text-white">Admin Panel</div>
                            <div className="text-xs text-slate-500">Quản trị hệ thống</div>
                        </div>
                    </div>
                    <button
                        onClick={() => setSidebarOpen(false)}
                        className="lg:hidden text-slate-400 hover:text-white"
                    >
                        <FiX className="w-6 h-6" />
                    </button>
                </div>

                {/* Navigation */}
                <nav className="flex-1 overflow-y-auto p-4 space-y-6">
                    {navigation.map((section, idx) => (
                        <div key={idx}>
                            <div className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2 px-4">
                                {section.title}
                            </div>
                            <div className="space-y-1">
                                {section.items.map((item) => (
                                    <NavItem key={item.href} item={item} />
                                ))}
                            </div>
                        </div>
                    ))}
                </nav>

                {/* User Profile */}
                <div className="p-4 border-t border-slate-800">
                    <div className="flex items-center gap-3 mb-3">
                        <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-blue-600 rounded-full flex items-center justify-center text-white font-semibold">
                            {user?.hoTen?.charAt(0) || 'A'}
                        </div>
                        <div className="flex-1">
                            <div className="text-sm font-medium text-white">{user?.hoTen || 'Admin'}</div>
                            <div className="text-xs text-slate-500">{user?.email || ''}</div>
                        </div>
                    </div>
                    <button
                        onClick={handleLogout}
                        className="flex items-center gap-2 w-full px-4 py-2 text-sm text-slate-400 hover:text-white hover:bg-slate-800 rounded-lg transition-colors"
                    >
                        <FiLogOut className="w-4 h-4" />
                        Đăng xuất
                    </button>
                </div>
            </aside>

            {/* Mobile overlay */}
            {sidebarOpen && (
                <div
                    className="fixed inset-0 z-30 bg-black/50 lg:hidden"
                    onClick={() => setSidebarOpen(false)}
                />
            )}

            {/* Main Content */}
            <div className="lg:ml-72">
                {/* Topbar */}
                <header className="sticky top-0 z-20 h-16 bg-slate-900 border-b border-slate-800 flex items-center justify-between px-6">
                    <button
                        onClick={() => setSidebarOpen(true)}
                        className="lg:hidden text-slate-400 hover:text-white"
                    >
                        <FiMenu className="w-6 h-6" />
                    </button>

                    <div className="flex items-center gap-4 ml-auto">
                        <div className="text-sm text-slate-400">
                            {new Date().toLocaleDateString('vi-VN', {
                                weekday: 'long',
                                year: 'numeric',
                                month: 'long',
                                day: 'numeric'
                            })}
                        </div>
                    </div>
                </header>

                {/* Page Content */}
                <main className="p-6">
                    {children}
                </main>
            </div>
        </div>
    );
}
