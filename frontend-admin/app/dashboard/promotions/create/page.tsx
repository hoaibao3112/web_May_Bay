'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { FiArrowLeft, FiSave, FiX } from 'react-icons/fi';

export default function CreatePromotionPage() {
    const router = useRouter();
    const [loading, setLoading] = useState(false);
    const [formData, setFormData] = useState({
        maKhuyenMai: '',
        tenKhuyenMai: '',
        moTa: '',
        loaiGiam: 'PERCENT',
        giaTriGiam: '',
        giamToiDa: '',
        giaTriDonToiThieu: '',
        soLuotSuDung: '',
        ngayBatDau: '',
        ngayKetThuc: '',
        isActive: true,
    });

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);

        try {
            const payload = {
                ...formData,
                giaTriGiam: Number(formData.giaTriGiam),
                giamToiDa: formData.giamToiDa ? Number(formData.giamToiDa) : null,
                giaTriDonToiThieu: Number(formData.giaTriDonToiThieu),
                soLuotSuDung: Number(formData.soLuotSuDung),
            };

            const res = await fetch('http://localhost:5000/promotions', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(payload),
            });

            if (!res.ok) throw new Error('Failed to create promotion');

            alert('Tạo mã khuyến mãi thành công!');
            router.push('/dashboard/promotions');
        } catch (error) {
            console.error('Error:', error);
            alert('Lỗi khi tạo khuyến mãi');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="space-y-6">
            {/* Header */}
            <div>
                <Link href="/dashboard/promotions" className="inline-flex items-center gap-2 text-blue-400 hover:text-blue-300 mb-4">
                    <FiArrowLeft /> Quay lại danh sách
                </Link>
                <h1 className="text-3xl font-bold text-white mb-2">Tạo Mã Khuyến Mãi Mới</h1>
                <p className="text-slate-400">Điền thông tin để tạo mã khuyến mãi mới</p>
            </div>

            {/* Form */}
            <form onSubmit={handleSubmit} className="bg-slate-900 border border-slate-800 rounded-xl p-8 space-y-6">
                {/* Mã khuyến mãi */}
                <div>
                    <label className="block text-sm font-medium text-slate-300 mb-2">
                        Mã khuyến mãi <span className="text-red-400">*</span>
                    </label>
                    <input
                        type="text"
                        required
                        value={formData.maKhuyenMai}
                        onChange={(e) => setFormData({ ...formData, maKhuyenMai: e.target.value.toUpperCase() })}
                        placeholder="VD: SUMMER30"
                        className="w-full px-4 py-2 bg-slate-800 border border-slate-700 rounded-lg text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500 font-mono"
                    />
                    <p className="text-xs text-slate-500 mt-1">Mã duy nhất, viết HOA, không dấu</p>
                </div>

                {/* Tên khuyến mãi */}
                <div>
                    <label className="block text-sm font-medium text-slate-300 mb-2">
                        Tên khuyến mãi <span className="text-red-400">*</span>
                    </label>
                    <input
                        type="text"
                        required
                        value={formData.tenKhuyenMai}
                        onChange={(e) => setFormData({ ...formData, tenKhuyenMai: e.target.value })}
                        placeholder="VD: Giảm 30% Mùa Hè"
                        className="w-full px-4 py-2 bg-slate-800 border border-slate-700 rounded-lg text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                </div>

                {/* Mô tả */}
                <div>
                    <label className="block text-sm font-medium text-slate-300 mb-2">Mô tả</label>
                    <textarea
                        value={formData.moTa}
                        onChange={(e) => setFormData({ ...formData, moTa: e.target.value })}
                        placeholder="Mô tả chi tiết về khuyến mãi..."
                        rows={3}
                        className="w-full px-4 py-2 bg-slate-800 border border-slate-700 rounded-lg text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                </div>

                {/* Loại giảm */}
                <div>
                    <label className="block text-sm font-medium text-slate-300 mb-2">
                        Loại giảm giá <span className="text-red-400">*</span>
                    </label>
                    <select
                        value={formData.loaiGiam}
                        onChange={(e) => setFormData({ ...formData, loaiGiam: e.target.value })}
                        className="w-full px-4 py-2 bg-slate-800 border border-slate-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                        <option value="PERCENT">Phần trăm (%)</option>
                        <option value="FIXED">Cố định (VNĐ)</option>
                    </select>
                </div>

                {/* Giá trị giảm & Giảm tối đa */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                        <label className="block text-sm font-medium text-slate-300 mb-2">
                            Giá trị giảm <span className="text-red-400">*</span>
                        </label>
                        <input
                            type="number"
                            required
                            value={formData.giaTriGiam}
                            onChange={(e) => setFormData({ ...formData, giaTriGiam: e.target.value })}
                            placeholder={formData.loaiGiam === 'PERCENT' ? '30' : '100000'}
                            className="w-full px-4 py-2 bg-slate-800 border border-slate-700 rounded-lg text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                        <p className="text-xs text-slate-500 mt-1">
                            {formData.loaiGiam === 'PERCENT' ? 'VD: 30 (30%)' : 'VD: 100000 (100K VNĐ)'}
                        </p>
                    </div>

                    {formData.loaiGiam === 'PERCENT' && (
                        <div>
                            <label className="block text-sm font-medium text-slate-300 mb-2">Giảm tối đa (VNĐ)</label>
                            <input
                                type="number"
                                value={formData.giamToiDa}
                                onChange={(e) => setFormData({ ...formData, giamToiDa: e.target.value })}
                                placeholder="500000"
                                className="w-full px-4 py-2 bg-slate-800 border border-slate-700 rounded-lg text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
                            />
                            <p className="text-xs text-slate-500 mt-1">Để trống nếu không giới hạn</p>
                        </div>
                    )}
                </div>

                {/* Giá trị đơn tối thiểu & Số lượt */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                        <label className="block text-sm font-medium text-slate-300 mb-2">
                            Đơn tối thiểu (VNĐ) <span className="text-red-400">*</span>
                        </label>
                        <input
                            type="number"
                            required
                            value={formData.giaTriDonToiThieu}
                            onChange={(e) => setFormData({ ...formData, giaTriDonToiThieu: e.target.value })}
                            placeholder="1000000"
                            className="w-full px-4 py-2 bg-slate-800 border border-slate-700 rounded-lg text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-slate-300 mb-2">
                            Số lượt sử dụng <span className="text-red-400">*</span>
                        </label>
                        <input
                            type="number"
                            required
                            value={formData.soLuotSuDung}
                            onChange={(e) => setFormData({ ...formData, soLuotSuDung: e.target.value })}
                            placeholder="100"
                            className="w-full px-4 py-2 bg-slate-800 border border-slate-700 rounded-lg text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                    </div>
                </div>

                {/* Thời gian */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                        <label className="block text-sm font-medium text-slate-300 mb-2">
                            Ngày bắt đầu <span className="text-red-400">*</span>
                        </label>
                        <input
                            type="date"
                            required
                            value={formData.ngayBatDau}
                            onChange={(e) => setFormData({ ...formData, ngayBatDau: e.target.value })}
                            className="w-full px-4 py-2 bg-slate-800 border border-slate-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-slate-300 mb-2">
                            Ngày kết thúc <span className="text-red-400">*</span>
                        </label>
                        <input
                            type="date"
                            required
                            value={formData.ngayKetThuc}
                            onChange={(e) => setFormData({ ...formData, ngayKetThuc: e.target.value })}
                            className="w-full px-4 py-2 bg-slate-800 border border-slate-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                    </div>
                </div>

                {/* Active */}
                <div className="flex items-center gap-2">
                    <input
                        type="checkbox"
                        id="isActive"
                        checked={formData.isActive}
                        onChange={(e) => setFormData({ ...formData, isActive: e.target.checked })}
                        className="w-4 h-4 text-blue-500 bg-slate-800 border-slate-700 rounded focus:ring-2 focus:ring-blue-500"
                    />
                    <label htmlFor="isActive" className="text-sm text-slate-300">Kích hoạt ngay</label>
                </div>

                {/* Buttons */}
                <div className="flex gap-4 pt-6 border-t border-slate-800">
                    <button
                        type="submit"
                        disabled={loading}
                        className="flex-1 px-6 py-3 bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-lg font-semibold hover:from-blue-600 hover:to-blue-700 transition disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 shadow-lg shadow-blue-500/30"
                    >
                        <FiSave className="w-5 h-5" />
                        {loading ? 'Đang tạo...' : 'Tạo Khuyến Mãi'}
                    </button>
                    <Link
                        href="/dashboard/promotions"
                        className="flex-1 px-6 py-3 bg-slate-800 border border-slate-700 text-slate-300 rounded-lg font-semibold hover:bg-slate-700 transition text-center flex items-center justify-center gap-2"
                    >
                        <FiX className="w-5 h-5" />
                        Hủy
                    </Link>
                </div>
            </form>
        </div>
    );
}
