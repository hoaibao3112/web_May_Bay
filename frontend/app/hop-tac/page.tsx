'use client';

import Image from 'next/image';
import Link from 'next/link';

export default function PartnershipPage() {
    const expandMarketCards = [
        {
            title: 'Hotels',
            description: 'Hotel Chains, Hotels, Resorts, etc.',
            icon: '🏨',
            gradient: 'from-blue-400 to-cyan-400',
        },
        {
            title: 'Holiday Days',
            description: 'Villas, Apartments, Homestays, etc.',
            icon: '🏖️',
            gradient: 'from-orange-400 to-pink-400',
        },
        {
            title: 'SpaTreats',
            description: 'Packages, Hotels & Spas, Tour, etc.',
            icon: '💆',
            gradient: 'from-purple-400 to-pink-400',
        },
        {
            title: 'Grand Transport',
            description: 'Car Rental, Shuttle, Taxi, Tour, etc.',
            icon: '🚗',
            gradient: 'from-green-400 to-teal-400',
        },
    ];

    const empowerBusinessCards = [
        {
            title: 'Corporates',
            description: 'Manage business travel, track spending, and more.',
            icon: '💼',
            gradient: 'from-indigo-400 to-blue-400',
        },
        {
            title: 'Gift Voucher',
            description: 'Boost your sales with gift vouchers.',
            icon: '🎁',
            gradient: 'from-pink-400 to-rose-400',
        },
        {
            title: 'Loyalty Points',
            description: 'Make your points more attractive to your customers.',
            icon: '⭐',
            gradient: 'from-yellow-400 to-orange-400',
        },
        {
            title: 'Partner Network',
            description: 'Earn with OTA business and increase your revenue.',
            icon: '🤝',
            gradient: 'from-cyan-400 to-blue-400',
        },
    ];

    const reachAudienceCards = [
        {
            title: 'Advertise with Us',
            description: 'Enjoy ad trends from various demographics.',
            icon: '📱',
            gradient: 'from-violet-400 to-purple-400',
        },
        {
            title: 'Pricing Centers',
            description: 'Strategize your pricing and visibility easily.',
            icon: '💰',
            gradient: 'from-emerald-400 to-green-400',
        },
    ];

    const stats = [
        {
            number: '50mio+',
            text: 'app downloads worldwide, elevating E-commerce digitally to our clients.',
            bg: '/images/partnership/stat1.jpg',
        },
        {
            number: '75k+',
            text: 'suppliers from various industries, from the hospitality, health, etc.',
            bg: '/images/partnership/stat2.jpg',
        },
        {
            number: '14+',
            text: 'countries ranging from best flight tickets to air routes.',
            bg: '/images/partnership/stat3.jpg',
        },
        {
            number: '8',
            text: 'APAC countries where we do our business.',
            bg: '/images/partnership/stat4.jpg',
        },
    ];

    return (
        <div className="min-h-screen bg-white">
            {/* Hero Section */}
            <section className="relative bg-gradient-to-br from-blue-50 to-white py-20 overflow-hidden">
                {/* Decorative Dot Pattern */}
                <div className="absolute right-0 top-0 w-1/2 h-full opacity-20">
                    <div className="grid grid-cols-12 gap-3 h-full p-8">
                        {[...Array(120)].map((_, i) => (
                            <div
                                key={i}
                                className="w-3 h-3 rounded-full bg-blue-300"
                                style={{
                                    opacity: Math.random() * 0.5 + 0.1,
                                }}
                            />
                        ))}
                    </div>
                </div>

                <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="max-w-2xl">
                        <h1 className="text-5xl md:text-6xl font-bold text-gray-900 mb-6 leading-tight">
                            Partner with
                            <br />
                            Southeast Asia's
                            <br />
                            Leading Travel
                            <br />
                            Platform
                        </h1>
                        <p className="text-xl text-blue-600 mb-4">
                            With more than <span className="font-semibold">50 million monthly active users in Asia-Pacific</span> and
                            growing, elevate it on how to support your business growth.
                        </p>
                        <p className="text-lg text-gray-600">
                            Choose the partnership that best suits your needs from the
                            various options below.
                        </p>
                    </div>
                </div>
            </section>

            {/* Expand Your Market Section */}
            <section className="py-20 bg-white">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="mb-12">
                        <div className="flex items-center gap-3 mb-4">
                            <div className="w-1 h-8 bg-blue-600" />
                            <h2 className="text-3xl md:text-4xl font-bold text-gray-900">
                                Expand Your Market
                            </h2>
                        </div>
                        <p className="text-gray-600 text-lg">
                            Negotiate your business to our app & gain more customers.
                        </p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                        {expandMarketCards.map((card, index) => (
                            <div
                                key={index}
                                className="group bg-white rounded-xl overflow-hidden shadow-md hover:shadow-2xl transition-all duration-300 cursor-pointer"
                            >
                                <div className="relative h-48 overflow-hidden">
                                    <div className={`absolute inset-0 bg-gradient-to-br ${card.gradient} opacity-20 group-hover:opacity-30 transition-opacity duration-300`} />
                                    <div className="relative w-full h-full flex items-center justify-center">
                                        <span className="text-7xl drop-shadow-lg">{card.icon}</span>
                                    </div>
                                </div>
                                <div className="p-6">
                                    <div className="flex items-center gap-3 mb-2">
                                        <div className={`w-10 h-10 rounded-lg bg-gradient-to-br ${card.gradient} opacity-20 flex items-center justify-center text-xl`}>
                                            {card.icon}
                                        </div>
                                        <h3 className="text-xl font-bold text-gray-900">
                                            {card.title}
                                        </h3>
                                    </div>
                                    <p className="text-gray-600">{card.description}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Empower Your Business Section */}
            <section className="py-20 bg-gray-50">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="mb-12">
                        <div className="flex items-center gap-3 mb-4">
                            <div className="w-1 h-8 bg-blue-600" />
                            <h2 className="text-3xl md:text-4xl font-bold text-gray-900">
                                Empower Your Business
                            </h2>
                        </div>
                        <p className="text-gray-600 text-lg">
                            Create essential benefits exclusively for your company.
                        </p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                        {empowerBusinessCards.map((card, index) => (
                            <div
                                key={index}
                                className="group bg-white rounded-xl overflow-hidden shadow-md hover:shadow-2xl transition-all duration-300 cursor-pointer"
                            >
                                <div className="relative h-48 overflow-hidden">
                                    <div className={`absolute inset-0 bg-gradient-to-br ${card.gradient} opacity-20 group-hover:opacity-30 transition-opacity duration-300`} />
                                    <div className="relative w-full h-full flex items-center justify-center">
                                        <span className="text-7xl drop-shadow-lg">{card.icon}</span>
                                    </div>
                                </div>
                                <div className="p-6">
                                    <div className="flex items-center gap-3 mb-2">
                                        <div className={`w-10 h-10 rounded-lg bg-gradient-to-br ${card.gradient} opacity-20 flex items-center justify-center text-xl`}>
                                            {card.icon}
                                        </div>
                                        <h3 className="text-xl font-bold text-gray-900">
                                            {card.title}
                                        </h3>
                                    </div>
                                    <p className="text-gray-600">{card.description}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Reach Wider Audience Section */}
            <section className="py-20 bg-white">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="mb-12">
                        <div className="flex items-center gap-3 mb-4">
                            <div className="w-1 h-8 bg-blue-600" />
                            <h2 className="text-3xl md:text-4xl font-bold text-gray-900">
                                Reach Wider Audience
                            </h2>
                        </div>
                        <p className="text-gray-600 text-lg">
                            Engage with new audiences via our app, special programs, & more.
                        </p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                        {reachAudienceCards.map((card, index) => (
                            <div
                                key={index}
                                className="group bg-white rounded-xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-300 cursor-pointer"
                            >
                                <div className="relative h-64 overflow-hidden">
                                    <div className={`absolute inset-0 bg-gradient-to-br ${card.gradient} opacity-20 group-hover:opacity-30 transition-opacity duration-300`} />
                                    <div className="relative w-full h-full flex items-center justify-center">
                                        <span className="text-8xl drop-shadow-lg">{card.icon}</span>
                                    </div>
                                </div>
                                <div className="p-8">
                                    <div className="flex items-center gap-3 mb-3">
                                        <div className={`w-12 h-12 rounded-lg bg-gradient-to-br ${card.gradient} opacity-20 flex items-center justify-center text-2xl`}>
                                            {card.icon}
                                        </div>
                                        <h3 className="text-2xl font-bold text-gray-900">
                                            {card.title}
                                        </h3>
                                    </div>
                                    <p className="text-gray-600 text-lg">{card.description}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Why You Should Collaborate Section */}
            <section className="py-20 bg-gray-50">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="mb-12">
                        <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
                            Why You Should
                            <br />
                            Collaborate with Us
                        </h2>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {stats.map((stat, index) => (
                            <div
                                key={index}
                                className="relative h-64 rounded-2xl overflow-hidden group cursor-pointer"
                            >
                                {/* Background with overlay */}
                                <div className="absolute inset-0 bg-gradient-to-br from-blue-600 to-purple-600 opacity-90" />
                                <div className="absolute inset-0 bg-black/30 group-hover:bg-black/20 transition-all duration-300" />

                                {/* Content */}
                                <div className="relative h-full flex flex-col justify-center p-8 text-white">
                                    <h3 className="text-5xl md:text-6xl font-bold mb-4">
                                        {stat.number}
                                    </h3>
                                    <p className="text-lg md:text-xl leading-relaxed">
                                        {stat.text}
                                    </p>
                                </div>

                                {/* Hover effect */}
                                <div className="absolute inset-0 border-4 border-white/0 group-hover:border-white/30 rounded-2xl transition-all duration-300" />
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Our Achievements Section */}
            <section className="py-20 bg-white">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="mb-12">
                        <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
                            Our Achievements
                        </h2>
                        <div className="w-16 h-1 bg-blue-600" />
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                        <div className="bg-gradient-to-br from-blue-50 to-white p-8 rounded-xl border border-blue-100">
                            <div className="text-5xl mb-4">🏆</div>
                            <h3 className="text-2xl font-bold text-gray-900 mb-3">
                                Industry Leader
                            </h3>
                            <p className="text-gray-600">
                                Recognized as Southeast Asia's leading online travel platform
                                with millions of satisfied customers.
                            </p>
                        </div>

                        <div className="bg-gradient-to-br from-purple-50 to-white p-8 rounded-xl border border-purple-100">
                            <div className="text-5xl mb-4">🌟</div>
                            <h3 className="text-2xl font-bold text-gray-900 mb-3">
                                Award Winning
                            </h3>
                            <p className="text-gray-600">
                                Multiple awards for innovation, customer service, and best
                                travel technology platform.
                            </p>
                        </div>

                        <div className="bg-gradient-to-br from-green-50 to-white p-8 rounded-xl border border-green-100">
                            <div className="text-5xl mb-4">🚀</div>
                            <h3 className="text-2xl font-bold text-gray-900 mb-3">
                                Rapid Growth
                            </h3>
                            <p className="text-gray-600">
                                Consistently growing user base and expanding to new markets
                                across Asia-Pacific region.
                            </p>
                        </div>
                    </div>
                </div>
            </section>

            {/* CTA Section */}
            <section className="py-20 bg-gradient-to-r from-blue-600 to-purple-600">
                <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
                    <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">
                        Ready to Partner with Us?
                    </h2>
                    <p className="text-xl text-white/90 mb-8">
                        Join thousands of partners who have grown their business with our platform.
                    </p>
                    <div className="flex flex-col sm:flex-row gap-4 justify-center">
                        <button className="px-8 py-4 bg-white text-blue-600 rounded-lg font-semibold text-lg hover:bg-gray-100 transition-all shadow-lg hover:shadow-xl">
                            Get Started
                        </button>
                        <button className="px-8 py-4 bg-transparent border-2 border-white text-white rounded-lg font-semibold text-lg hover:bg-white/10 transition-all">
                            Learn More
                        </button>
                    </div>
                </div>
            </section>
        </div>
    );
}
