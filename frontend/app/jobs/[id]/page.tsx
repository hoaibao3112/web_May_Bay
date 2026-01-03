'use client';

import { useEffect, useState } from 'react';
import axios from 'axios';
import { useParams } from 'next/navigation';
import Link from 'next/link';

interface Job {
    id: number;
    title: string;
    description: string;
    requirements: string;
    salaryRange: string;
    location: string;
    jobType: string;
    createdAt: string;
    recruiter?: {
        email: string;
    };
}

export default function JobDetailPage() {
    const params = useParams();
    const [job, setJob] = useState<Job | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchJob = async () => {
            if (!params.id) return;
            try {
                const res = await axios.get(`http://localhost:3000/jobs/${params.id}`);
                setJob(res.data);
            } catch (error) {
                console.error('Failed to fetch job', error);
            } finally {
                setLoading(false);
            }
        };

        fetchJob();
    }, [params.id]);

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-slate-50">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
            </div>
        );
    }

    if (!job) return <div>Job not found</div>;

    return (
        <div className="min-h-screen bg-slate-50 pb-20">
            {/* Header */}
            <div className="bg-white border-b border-slate-200 sticky top-0 z-10 shadow-sm">
                <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex justify-between items-center">
                    <Link href="/jobs" className="text-slate-500 hover:text-primary-600 font-medium flex items-center">
                        <svg className="w-5 h-5 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                        </svg>
                        Back to Jobs
                    </Link>
                    <div className="flex items-center space-x-4">
                        <button className="text-slate-500 hover:text-slate-900 font-medium">Share</button>
                        <button className="bg-primary-600 text-white px-6 py-2 rounded-full font-bold hover:bg-primary-700 transition-all shadow-lg shadow-primary-500/30">
                            Apply Now
                        </button>
                    </div>
                </div>
            </div>

            {/* Content */}
            <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* Main Info */}
                    <div className="lg:col-span-2 space-y-8">
                        <div className="bg-white rounded-2xl p-8 shadow-sm border border-slate-100">
                            <div className="flex items-center justify-between mb-6">
                                <h1 className="text-3xl font-bold text-slate-900">{job.title}</h1>
                                <span className="px-4 py-1.5 bg-primary-50 text-primary-700 rounded-full text-sm font-semibold">
                                    {job.jobType}
                                </span>
                            </div>

                            <div className="flex flex-wrap gap-6 text-slate-600 mb-8">
                                <div className="flex items-center">
                                    <svg className="w-5 h-5 mr-2 text-primary-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                                    </svg>
                                    {job.location}
                                </div>
                                <div className="flex items-center">
                                    <svg className="w-5 h-5 mr-2 text-emerald-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                    </svg>
                                    {job.salaryRange}
                                </div>
                                <div className="flex items-center">
                                    <svg className="w-5 h-5 mr-2 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                                    </svg>
                                    Posted {new Date(job.createdAt).toLocaleDateString()}
                                </div>
                            </div>

                            <div className="prose prose-slate max-w-none">
                                <h3 className="text-xl font-bold text-slate-900 mb-4">About the Role</h3>
                                <p className="whitespace-pre-line text-slate-600 leading-relaxed mb-8">
                                    {job.description}
                                </p>

                                {job.requirements && (
                                    <>
                                        <h3 className="text-xl font-bold text-slate-900 mb-4">Requirements</h3>
                                        <p className="whitespace-pre-line text-slate-600 leading-relaxed">
                                            {job.requirements}
                                        </p>
                                    </>
                                )}
                            </div>
                        </div>
                    </div>

                    {/* Sidebar */}
                    <div className="space-y-6">
                        <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-100">
                            <h3 className="text-lg font-bold text-slate-900 mb-4">Recruiter Info</h3>
                            <div className="flex items-center mb-4">
                                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-primary-500 to-violet-500 flex items-center justify-center text-white font-bold">
                                    {job.recruiter?.email?.charAt(0).toUpperCase() || 'H'}
                                </div>
                                <div className="ml-3">
                                    <p className="text-sm font-medium text-slate-900">Hiring Manager</p>
                                    <p className="text-xs text-slate-500">{job.recruiter?.email || 'Contact via Platform'}</p>
                                </div>
                            </div>
                            <button className="w-full border border-slate-200 text-slate-700 py-2 rounded-lg font-medium hover:bg-slate-50 transition-colors">
                                Send Message
                            </button>
                        </div>

                        <div className="bg-gradient-to-br from-primary-900 to-violet-900 rounded-2xl p-6 text-white shadow-lg">
                            <h3 className="text-lg font-bold mb-2">AI Resume Check</h3>
                            <p className="text-primary-100 text-sm mb-4">
                                See how well your CV matches this job description before applying.
                            </p>
                            <button className="w-full bg-white/10 backdrop-blur-sm border border-white/20 text-white py-2 rounded-lg font-medium hover:bg-white/20 transition-colors">
                                Check Match Score
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
