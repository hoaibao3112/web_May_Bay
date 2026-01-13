'use client';

import { useState } from 'react';

export default function ContactPage() {
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        phone: '',
        subject: '',
        message: '',
    });

    const [errors, setErrors] = useState<Record<string, string>>({});
    const [isSubmitting, setIsSubmitting] = useState(false);

    const validateForm = () => {
        const newErrors: Record<string, string> = {};

        if (!formData.name.trim()) {
            newErrors.name = 'Vui lòng nhập họ và tên';
        }

        if (!formData.email.trim()) {
            newErrors.email = 'Vui lòng nhập email';
        } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
            newErrors.email = 'Email không hợp lệ';
        }

        if (!formData.phone.trim()) {
            newErrors.phone = 'Vui lòng nhập số điện thoại';
        } else if (!/^[0-9]{10,11}$/.test(formData.phone.replace(/\s/g, ''))) {
            newErrors.phone = 'Số điện thoại không hợp lệ';
        }

        if (!formData.subject.trim()) {
            newErrors.subject = 'Vui lòng nhập chủ đề';
        }

        if (!formData.message.trim()) {
            newErrors.message = 'Vui lòng nhập nội dung tin nhắn';
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!validateForm()) {
            return;
        }

        setIsSubmitting(true);

        // Simulate API call
        setTimeout(() => {
            console.log('Form submitted:', formData);
            alert('Cảm ơn bạn đã liên hệ! Chúng tôi sẽ phản hồi trong thời gian sớm nhất.');
            setFormData({
                name: '',
                email: '',
                phone: '',
                subject: '',
                message: '',
            });
            setIsSubmitting(false);
        }, 1000);
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
        // Clear error when user starts typing
        if (errors[name]) {
            setErrors((prev) => ({ ...prev, [name]: '' }));
        }
    };

    const contactInfo = [
        {
            icon: '📧',
            title: 'Email',
            items: [
                { label: 'Hỗ trợ khách hàng', value: 'support@baynhanh.vn' },
                { label: 'Hợp tác kinh doanh', value: 'business@baynhanh.vn' },
            ],
            gradient: 'from-blue-400 to-cyan-400',
        },
        {
            icon: '📞',
            title: 'Điện thoại',
            items: [
                { label: 'Hotline', value: '1900 xxxx' },
                { label: 'Hỗ trợ 24/7', value: '028 xxxx xxxx' },
            ],
            gradient: 'from-green-400 to-emerald-400',
        },
        {
            icon: '🕐',
            title: 'Giờ làm việc',
            items: [
                { label: 'Thứ 2 - Thứ 6', value: '8:00 - 18:00' },
                { label: 'Thứ 7 - CN', value: '8:00 - 17:00' },
            ],
            gradient: 'from-purple-400 to-pink-400',
        },
    ];

    const supportChannels = [
        {
            icon: '💬',
            title: 'Live Chat',
            description: 'Trò chuyện trực tiếp với đội ngũ hỗ trợ',
            action: 'Bắt đầu chat',
            gradient: 'from-blue-500 to-cyan-500',
        },
        {
            icon: '📧',
            title: 'Email Support',
            description: 'Gửi email và nhận phản hồi trong 24h',
            action: 'Gửi email',
            gradient: 'from-purple-500 to-pink-500',
        },
        {
            icon: '📱',
            title: 'Mạng xã hội',
            description: 'Kết nối qua Facebook, Zalo, Instagram',
            action: 'Theo dõi',
            gradient: 'from-orange-500 to-red-500',
        },
        {
            icon: '❓',
            title: 'Trung tâm trợ giúp',
            description: 'Tìm câu trả lời cho các câu hỏi thường gặp',
            action: 'Xem FAQs',
            gradient: 'from-green-500 to-teal-500',
        },
    ];

    const offices = [
        {
            city: 'TP. Hồ Chí Minh',
            address: '123 Đường ABC, Quận 1, TP.HCM',
            icon: '🏢',
        },
        {
            city: 'Hà Nội',
            address: '456 Đường XYZ, Quận Hoàn Kiếm, Hà Nội',
            icon: '🏢',
        },
        {
            city: 'Đà Nẵng',
            address: '789 Đường DEF, Quận Hải Châu, Đà Nẵng',
            icon: '🏢',
        },
    ];

    return (
        <div className="min-h-screen bg-gray-50">
            {/* Hero Section */}
            <section className="relative bg-gradient-to-br from-blue-600 to-purple-600 py-20">
                <div className="absolute inset-0 bg-black/10" />
                <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
                    <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">
                        Liên hệ với chúng tôi
                    </h1>
                    <p className="text-xl text-white/90 max-w-2xl mx-auto">
                        Chúng tôi luôn sẵn sàng hỗ trợ bạn. Hãy liên hệ với chúng tôi qua các kênh dưới đây.
                    </p>
                </div>
            </section>

            {/* Contact Form & Info */}
            <section className="py-16 -mt-8">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                        {/* Contact Form */}
                        <div className="lg:col-span-2">
                            <div className="bg-white rounded-2xl shadow-xl p-8">
                                <div className="mb-8">
                                    <h2 className="text-3xl font-bold text-gray-900 mb-2">
                                        Gửi tin nhắn cho chúng tôi
                                    </h2>
                                    <p className="text-gray-600">
                                        Điền thông tin vào form bên dưới và chúng tôi sẽ phản hồi sớm nhất có thể.
                                    </p>
                                </div>

                                <form onSubmit={handleSubmit} className="space-y-6">
                                    {/* Name */}
                                    <div>
                                        <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-2">
                                            Họ và tên <span className="text-red-500">*</span>
                                        </label>
                                        <input
                                            type="text"
                                            id="name"
                                            name="name"
                                            value={formData.name}
                                            onChange={handleChange}
                                            className={`w-full px-4 py-3 border ${errors.name ? 'border-red-500' : 'border-gray-300'
                                                } rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all`}
                                            placeholder="Nguyễn Văn A"
                                        />
                                        {errors.name && <p className="mt-1 text-sm text-red-500">{errors.name}</p>}
                                    </div>

                                    {/* Email & Phone */}
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                        <div>
                                            <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                                                Email <span className="text-red-500">*</span>
                                            </label>
                                            <input
                                                type="email"
                                                id="email"
                                                name="email"
                                                value={formData.email}
                                                onChange={handleChange}
                                                className={`w-full px-4 py-3 border ${errors.email ? 'border-red-500' : 'border-gray-300'
                                                    } rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all`}
                                                placeholder="email@example.com"
                                            />
                                            {errors.email && <p className="mt-1 text-sm text-red-500">{errors.email}</p>}
                                        </div>

                                        <div>
                                            <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-2">
                                                Số điện thoại <span className="text-red-500">*</span>
                                            </label>
                                            <input
                                                type="tel"
                                                id="phone"
                                                name="phone"
                                                value={formData.phone}
                                                onChange={handleChange}
                                                className={`w-full px-4 py-3 border ${errors.phone ? 'border-red-500' : 'border-gray-300'
                                                    } rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all`}
                                                placeholder="0912345678"
                                            />
                                            {errors.phone && <p className="mt-1 text-sm text-red-500">{errors.phone}</p>}
                                        </div>
                                    </div>

                                    {/* Subject */}
                                    <div>
                                        <label htmlFor="subject" className="block text-sm font-medium text-gray-700 mb-2">
                                            Chủ đề <span className="text-red-500">*</span>
                                        </label>
                                        <input
                                            type="text"
                                            id="subject"
                                            name="subject"
                                            value={formData.subject}
                                            onChange={handleChange}
                                            className={`w-full px-4 py-3 border ${errors.subject ? 'border-red-500' : 'border-gray-300'
                                                } rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all`}
                                            placeholder="Vấn đề cần hỗ trợ"
                                        />
                                        {errors.subject && <p className="mt-1 text-sm text-red-500">{errors.subject}</p>}
                                    </div>

                                    {/* Message */}
                                    <div>
                                        <label htmlFor="message" className="block text-sm font-medium text-gray-700 mb-2">
                                            Nội dung tin nhắn <span className="text-red-500">*</span>
                                        </label>
                                        <textarea
                                            id="message"
                                            name="message"
                                            value={formData.message}
                                            onChange={handleChange}
                                            rows={6}
                                            className={`w-full px-4 py-3 border ${errors.message ? 'border-red-500' : 'border-gray-300'
                                                } rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all resize-none`}
                                            placeholder="Mô tả chi tiết vấn đề của bạn..."
                                        />
                                        {errors.message && <p className="mt-1 text-sm text-red-500">{errors.message}</p>}
                                    </div>

                                    {/* Submit Button */}
                                    <button
                                        type="submit"
                                        disabled={isSubmitting}
                                        className="w-full px-8 py-4 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-lg font-semibold text-lg hover:from-blue-700 hover:to-purple-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-lg hover:shadow-xl"
                                    >
                                        {isSubmitting ? 'Đang gửi...' : 'Gửi tin nhắn'}
                                    </button>
                                </form>
                            </div>
                        </div>

                        {/* Contact Information */}
                        <div className="space-y-6">
                            {contactInfo.map((info, index) => (
                                <div
                                    key={index}
                                    className="bg-white rounded-xl shadow-md p-6 hover:shadow-lg transition-shadow"
                                >
                                    <div className="flex items-center gap-3 mb-4">
                                        <div className={`w-12 h-12 rounded-lg bg-gradient-to-br ${info.gradient} opacity-20 flex items-center justify-center text-2xl`}>
                                            {info.icon}
                                        </div>
                                        <h3 className="text-xl font-bold text-gray-900">{info.title}</h3>
                                    </div>
                                    <div className="space-y-2">
                                        {info.items.map((item, idx) => (
                                            <div key={idx}>
                                                <p className="text-sm text-gray-500">{item.label}</p>
                                                <p className="text-gray-900 font-medium">{item.value}</p>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </section>

            {/* Support Channels */}
            <section className="py-16 bg-white">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="text-center mb-12">
                        <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
                            Các kênh hỗ trợ
                        </h2>
                        <p className="text-gray-600 text-lg max-w-2xl mx-auto">
                            Chọn kênh hỗ trợ phù hợp nhất với nhu cầu của bạn
                        </p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                        {supportChannels.map((channel, index) => (
                            <div
                                key={index}
                                className="group bg-white rounded-xl border-2 border-gray-200 p-6 hover:border-blue-500 hover:shadow-xl transition-all cursor-pointer"
                            >
                                <div className="text-center">
                                    <div className={`w-16 h-16 mx-auto mb-4 rounded-full bg-gradient-to-br ${channel.gradient} opacity-20 flex items-center justify-center text-3xl group-hover:opacity-30 transition-opacity`}>
                                        {channel.icon}
                                    </div>
                                    <h3 className="text-xl font-bold text-gray-900 mb-2">
                                        {channel.title}
                                    </h3>
                                    <p className="text-gray-600 mb-4 min-h-[48px]">
                                        {channel.description}
                                    </p>
                                    <button className={`w-full px-4 py-2 bg-gradient-to-r ${channel.gradient} text-white rounded-lg font-medium hover:shadow-lg transition-all`}>
                                        {channel.action}
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Office Locations */}
            <section className="py-16 bg-gray-50">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="text-center mb-12">
                        <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
                            Văn phòng của chúng tôi
                        </h2>
                        <p className="text-gray-600 text-lg">
                            Ghé thăm chúng tôi tại các văn phòng trên toàn quốc
                        </p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                        {offices.map((office, index) => (
                            <div
                                key={index}
                                className="bg-white rounded-xl shadow-md p-8 hover:shadow-xl transition-shadow text-center"
                            >
                                <div className="text-5xl mb-4">{office.icon}</div>
                                <h3 className="text-2xl font-bold text-gray-900 mb-3">
                                    {office.city}
                                </h3>
                                <p className="text-gray-600">{office.address}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>
        </div>
    );
}
