'use client';

import { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import Link from 'next/link';
import { FiArrowLeft, FiSave, FiX } from 'react-icons/fi';

export default function EditPromotionPage() {
    const router = useRouter();
    const params = useParams();
    const id = params.id as string;

    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
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

    useEffect(() => {
        fetchPromotion();
    }, []);

    const fetchPromotion = async () => {
        try {
            const res = await fetch(`http://localhost:5000/promotions/${id}`);
            const data = await res.json();

            setFormData({
                maKhuyenMai: data.maKhuyenMai,
                tenKhuyenMai: data.tenKhuyenMai,
                moTa: data.moTa || '',
                loaiGiam: data.loaiGiam,
                giaTriGiam: data.giaTriGiam.toString(),
                giamToiDa: data.giamToiDa ? data.giamToiDa.toString() : '',
                giaTriDonToiThieu: data.giaTriDonToiThieu.toString(),
                soLuotSuDung: data.soLuotSuDung.toString(),
                ngayBatDau: data.ngayBatDau.split('T')[0],
                ngayKetThuc: data.ngayKetThuc.split('T')[0],
                isActive: data.isActive,
            });
        } catch (error) {
            console.error('Error:', error);
            alert('Lỗi khi tải thông tin khuyến mãi');
        } finally {
            setLoading(false);
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setSaving(true);

        try {
            const payload = {
                ...formData,
                giaTriGiam: Number(formData.giaTriGiam),
                giamToiDa: formData.giamToiDa ? Number(formData.giamToiDa) : null,
                giaTriDonToiThieu: Number(formData.giaTriDonToiThieu),
                soLuotSuDung: Number(formData.soLuotSuDung),
            };

            const res = await fetch(`http://localhost:5000/promotions/${id}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(payload),
            });

            if (!res.ok) throw new Error('Failed to update promotion');

            alert('Cập nhật khuyến mãi thành công!');
            router.push('/dashboard/promotions');
        } catch (error) {
            console.error('Error:', error);
            alert('Lỗi khi cập nhật khuyến mãi');
        } finally {
            setSaving(false);
        }
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-screen">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
            </div>
        );
    }

    return (
        <div className="space-y-6">
            {/* Header */}
            <div>
                <Link href="/dashboard/promotions" className="inline-flex items-center gap-2 text-blue-400 hover:text-blue-300 mb-4">
                    <FiArrowLeft /> Quay lại danh sách
                </Link>
                <h1 className="text-3xl font-bold text-white mb-2">Chỉnh Sửa Khuyến Mãi</h1>
                <p className="text-slate-400">Cập nhật thông tin mã khuyến mãi</p>
            </div>

            {/* Form */}
            <form onSubmit={handleSubmit} className="bg-slate-900 border border-slate-800 rounded-xl p-8 space-y-6">
                <div>
                    <label className="block text-sm font-medium text-slate-300 mb-2">Mã khuyến mãi</label>
                    <input
                        type="text"
                        disabled
                        value={formData.maKhuyenMai}
                        className="w-full px-4 py-2 bg-slate-800/50 border border-slate-700 rounded-lg text-slate-400 font-mono cursor-not-allowed"
                    />
                    <p className="text-xs text-slate-500 mt-1">Không thể thay đổi mã</p>
                </div>

                <div>
                    <label className="block text-sm font-medium text-slate-300 mb-2">
                        Tên khuyến mãi <span className="text-red-400">*</span>
                    </label>
                    <input
                        type="text"
                        required
                        value={formData.tenKhuyenMai}
                        onChange={(e) => setFormData({ ...formData, tenKhuyenMai: e.target.value })}
                        className="w-full px-4 py-2 bg-slate-800 border border-slate-700 rounded-lg text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                </div>

                <div>
                    <label className="block text-sm font-medium text-slate-300 mb-2">Mô tả</label>
                    <textarea
                        value={formData.moTa}
                        onChange={(e) => setFormData({ ...formData, moTa: e.target.value })}
                        rows={3}
                        className="w-full px-4 py-2 bg-slate-800 border border-slate-700 rounded-lg text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                </div>

                <div>
                    <label className="block text-sm font-medium text-slate-300 mb-2">Loại giảm giá</label>
                    <select
                        disabled
                        value={formData.loaiGiam}
                        className="w-full px-4 py-2 bg-slate-800/50 border border-slate-700 rounded-lg text-slate-400 cursor-not-allowed"
                    >
                        <option value="PERCENT">Phần trăm (%)</option>
                        <option value="FIXED">Cố định (VNĐ)</option>
                    </select>
                    <p className="text-xs text-slate-500 mt-1">Không thể thay đổi loại</p>
                </div>

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
                            className="w-full px-4 py-2 bg-slate-800 border border-slate-700 rounded-lg text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                    </div>

                    {formData.loaiGiam === 'PERCENT' && (
                        <div>
                            <label className="block text-sm font-medium text-slate-300 mb-2">Giảm tối đa (VNĐ)</label>
                            <input
                                type="number"
                                value={formData.giamToiDa}
                                onChange={(e) => setFormData({ ...formData, giamToiDa: e.target.value })}
                                className="w-full px-4 py-2 bg-slate-800 border border-slate-700 rounded-lg text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
                            />
                        </div>
                    )}
                </div>

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
                            className="w-full px-4 py-2 bg-slate-800 border border-slate-700 rounded-lg text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                    </div>
                </div>

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

                <div className="flex items-center gap-2">
                    <input
                        type="checkbox"
                        id="isActive"
                        checked={formData.isActive}
                        onChange={(e) => setFormData({ ...formData, isActive: e.target.checked })}
                        className="w-4 h-4 text-blue-500 bg-slate-800 border-slate-700 rounded focus:ring-2 focus:ring-blue-500"
                    />
                    <label htmlFor="isActive" className="text-sm text-slate-300">Kích hoạt</label>
                </div>

                <div className="flex gap-4 pt-6 border-t border-slate-800">
                    <button
                        type="submit"
                        disabled={saving}
                        className="flex-1 px-6 py-3 bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-lg font-semibold hover:from-blue-600 hover:to-blue-700 transition disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 shadow-lg shadow-blue-500/30"
                    >
                        <FiSave className="w-5 h-5" />
                        {saving ? 'Đang lưu...' : 'Lưu Thay Đổi'}
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
