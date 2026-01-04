'use client';

import { useEffect, useState } from 'react';
import axios from 'axios';
import Link from 'next/link';

interface Job {
    id: number;
    title: string;
    description: string;
    salaryRange: string;
    location: string;
    jobType: string;
    createdAt: string;
    recruiter?: {
        email: string;
    };
}

export default function JobsPage() {
    const [jobs, setJobs] = useState<Job[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchJobs = async () => {
            try {
                const res = await axios.get('http://localhost:5000/jobs');
                setJobs(res.data);
            } catch (error) {
                console.error('Failed to fetch jobs', error);
            } finally {
                setLoading(false);
            }
        };

        fetchJobs();
    }, []);

    return (
        <div className="min-h-screen bg-slate-50">
            {/* Hero Section */}
            <div className="relative bg-primary-900 text-white overflow-hidden">
                <div className="absolute inset-0">
                    <div className="absolute inset-0 bg-gradient-to-br from-primary-900 to-violet-900 opacity-90" />
                    <div className="absolute top-0 left-0 w-full h-full bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20" />
                </div>
                <div className="relative max-w-7xl mx-auto py-24 px-4 sm:px-6 lg:px-8 text-center">
                    <h1 className="text-4xl md:text-6xl font-extrabold tracking-tight mb-6 animate-fade-in">
                        Find Your <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-emerald-400">Next Chapter</span>
                    </h1>
                    <p className="mt-4 max-w-2xl mx-auto text-xl text-primary-100 animate-slide-up">
                        Discover opportunities at top companies leveraging AI to match your skills perfectly.
                    </p>

                    {/* Search Bar */}
                    <div className="mt-10 max-w-3xl mx-auto animate-slide-up" style={{ animationDelay: '0.2s' }}>
                        <div className="glass p-2 rounded-full flex items-center">
                            <div className="flex-1 px-4">
                                <input
                                    type="text"
                                    placeholder="Job title, keywords, or company"
                                    className="w-full bg-transparent border-none focus:ring-0 text-gray-800 placeholder-gray-500"
                                />
                            </div>
                            <div className="h-8 w-px bg-gray-300 mx-2"></div>
                            <div className="flex-1 px-4">
                                <input
                                    type="text"
                                    placeholder="Location or Remote"
                                    className="w-full bg-transparent border-none focus:ring-0 text-gray-800 placeholder-gray-500"
                                />
                            </div>
                            <button className="bg-primary-600 hover:bg-primary-700 text-white px-8 py-3 rounded-full font-semibold transition-all shadow-lg hover:shadow-primary-500/30">
                                Search
                            </button>
                        </div>
                    </div>
                </div>
            </div>

            {/* Job List */}
            <div className="max-w-7xl mx-auto py-16 px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between items-center mb-8">
                    <h2 className="text-2xl font-bold text-slate-800">Latest Opportunities</h2>
                    <span className="text-slate-500">{jobs.length} jobs found</span>
                </div>

                {loading ? (
                    <div className="grid gap-6 lg:grid-cols-3 md:grid-cols-2 sm:grid-cols-1">
                        {[1, 2, 3, 4, 5, 6].map((i) => (
                            <div key={i} className="bg-white rounded-xl p-6 shadow-sm animate-pulse h-64"></div>
                        ))}
                    </div>
                ) : (
                    <div className="grid gap-6 lg:grid-cols-3 md:grid-cols-2 sm:grid-cols-1">
                        {jobs.map((job, index) => (
                            <Link href={`/jobs/${job.id}`} key={job.id} className="group">
                                <div
                                    className="glass-card h-full rounded-2xl p-6 flex flex-col relative overflow-hidden group-hover:-translate-y-1 transition-transform duration-300"
                                    style={{ animationDelay: `${index * 0.1}s` }}
                                >
                                    <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
                                        <svg className="w-24 h-24 text-primary-600" fill="currentColor" viewBox="0 0 24 24">
                                            <path d="M20 6h-4V4c0-1.11-.89-2-2-2h-4c-1.11 0-2 .89-2 2v2H4c-1.11 0-1.99.89-1.99 2L2 19c0 1.11.89 2 2 2h16c1.11 0 2-.89 2-2V8c0-1.11-.89-2-2-2zm-6 0h-4V4h4v2z" />
                                        </svg>
                                    </div>

                                    <div className="flex items-start justify-between mb-4">
                                        <div className="w-12 h-12 rounded-lg bg-primary-50 flex items-center justify-center text-primary-600 font-bold text-xl">
                                            {job.title.charAt(0)}
                                        </div>
                                        <span className="px-3 py-1 text-xs font-semibold text-primary-700 bg-primary-50 rounded-full border border-primary-100">
                                            {job.jobType || 'Full-time'}
                                        </span>
                                    </div>

                                    <h3 className="text-xl font-bold text-slate-900 mb-2 group-hover:text-primary-600 transition-colors">
                                        {job.title}
                                    </h3>

                                    <p className="text-slate-500 text-sm mb-4 line-clamp-2 flex-1">
                                        {job.description}
                                    </p>

                                    <div className="space-y-2 pt-4 border-t border-slate-100">
                                        <div className="flex items-center text-sm text-slate-600">
                                            <svg className="w-4 h-4 mr-2 text-primary-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                                            </svg>
                                            {job.location || 'Remote'}
                                        </div>
                                        <div className="flex items-center text-sm text-slate-600">
                                            <svg className="w-4 h-4 mr-2 text-emerald-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                            </svg>
                                            {job.salaryRange || 'Competitive Salary'}
                                        </div>
                                    </div>
                                </div>
                            </Link>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}
