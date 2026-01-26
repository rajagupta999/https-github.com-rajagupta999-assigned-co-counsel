
"use client";

import { useState } from 'react';
import Link from 'next/link';
import { wikiArticles } from '@/lib/wikiContent';

export default function WikiPage() {
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedCategory, setSelectedCategory] = useState<string>('All');

    const categories = ['All', 'Family Law', 'Criminal Defense', 'Divorce & Matrimonial'];

    const filteredArticles = wikiArticles.filter(article => {
        const matchesSearch = article.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
            article.summary.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesCategory = selectedCategory === 'All' || article.category === selectedCategory;
        return matchesSearch && matchesCategory;
    });

    const categoryColors: Record<string, string> = {
        'Family Law': 'bg-violet-50 text-violet-700',
        'Criminal Defense': 'bg-red-50 text-red-700',
        'Divorce & Matrimonial': 'bg-blue-50 text-blue-700',
    };

    return (
        <div className="p-8 lg:p-12 max-w-6xl mx-auto animate-fade-in h-[calc(100vh-56px)] flex flex-col">
            {/* Header */}
            <div className="mb-8">
                <div className="flex items-center gap-3 mb-1">
                    <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-indigo-500 to-blue-600 flex items-center justify-center shadow-sm shadow-indigo-500/20">
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" style={{ width: '20px', height: '20px' }}>
                            <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"></path>
                            <path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z"></path>
                        </svg>
                    </div>
                    <div>
                        <h1 className="text-2xl font-bold text-slate-900 tracking-tight">Legal Knowledge Base</h1>
                        <p className="text-slate-400 text-sm">Curated NY statutes, case law, and procedural guides.</p>
                    </div>
                </div>
            </div>

            {/* Search & Filter */}
            <div className="flex flex-col md:flex-row gap-4 mb-8">
                <div className="relative flex-1 max-w-xl">
                    <svg className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ width: '16px', height: '16px' }}>
                        <circle cx="11" cy="11" r="8"></circle><line x1="21" y1="21" x2="16.65" y2="16.65"></line>
                    </svg>
                    <input
                        type="text"
                        placeholder="Search library..."
                        className="w-full pl-10 pr-4 py-2.5 bg-white border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-100 focus:border-blue-400 outline-none transition-all text-sm placeholder:text-slate-400"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                </div>

                <div className="flex gap-2 overflow-x-auto pb-1">
                    {categories.map(cat => (
                        <button
                            key={cat}
                            onClick={() => setSelectedCategory(cat)}
                            className={`px-4 py-2.5 whitespace-nowrap rounded-lg text-[13px] font-semibold transition-all ${selectedCategory === cat
                                    ? 'bg-slate-900 text-white shadow-sm'
                                    : 'bg-white text-slate-500 border border-slate-200 hover:border-slate-300 hover:text-slate-700'
                                }`}
                        >
                            {cat}
                        </button>
                    ))}
                </div>
            </div>

            {/* Content Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 overflow-y-auto pb-12 flex-1">
                {filteredArticles.map(article => (
                    <Link key={article.id} href={`/dashboard/wiki/${article.slug}`} className="group block h-full">
                        <div className="h-full bg-white border border-slate-200/80 rounded-xl p-6 hover:shadow-lg hover:border-blue-200 transition-all duration-200 relative overflow-hidden flex flex-col">
                            <div className="absolute top-0 left-0 w-1 h-full bg-transparent group-hover:bg-blue-500 transition-colors"></div>

                            <div className="flex items-center justify-between mb-4">
                                <span className={`text-[10px] uppercase tracking-wider font-bold px-2 py-1 rounded-md ${categoryColors[article.category] || 'bg-slate-50 text-slate-600'}`}>
                                    {article.category}
                                </span>
                                <span className="text-[11px] text-slate-400 font-medium">{article.lastUpdated}</span>
                            </div>

                            <h2 className="text-base font-semibold text-slate-800 mb-3 group-hover:text-blue-600 transition-colors leading-snug">
                                {article.title}
                            </h2>

                            <p className="text-sm text-slate-400 leading-relaxed mb-5 line-clamp-2 flex-1">
                                {article.summary}
                            </p>

                            <div className="flex flex-wrap gap-1.5 mt-auto">
                                {article.citations.slice(0, 2).map((cite, i) => (
                                    <span key={i} className="inline-flex items-center text-[10px] text-slate-500 bg-slate-50 px-2 py-1 rounded-md border border-slate-100 font-medium">
                                        <svg className="mr-1 text-slate-400" width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" style={{ width: '10px', height: '10px' }}><path d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"></path></svg>
                                        {cite}
                                    </span>
                                ))}
                            </div>
                        </div>
                    </Link>
                ))}
            </div>

            {filteredArticles.length === 0 && (
                <div className="text-center py-20">
                    <div className="w-14 h-14 mx-auto mb-4 rounded-full bg-slate-50 flex items-center justify-center">
                        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#cbd5e1" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" style={{ width: '24px', height: '24px' }}><circle cx="11" cy="11" r="8"></circle><line x1="21" y1="21" x2="16.65" y2="16.65"></line></svg>
                    </div>
                    <h3 className="text-slate-700 font-semibold text-lg">No articles found</h3>
                    <p className="text-slate-400 mt-1 text-sm">Try adjusting your search terms or category filter.</p>
                </div>
            )}
        </div>
    );
}
