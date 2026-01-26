
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

    return (
        <div className="p-12 max-w-6xl mx-auto animate-fade-in h-[calc(100vh-64px)] flex flex-col">
            {/* Header */}
            <div className="mb-12 text-center">
                <h1 className="text-4xl font-light text-gray-900 tracking-tight mb-3">Legal Knowledge Base</h1>
                <p className="text-gray-500 text-lg">Curated NY statutes, case law, and procedural guides.</p>
            </div>

            {/* Search & Filter */}
            <div className="flex flex-col md:flex-row gap-6 mb-12 justify-center">
                <div className="relative flex-1 max-w-xl">
                    <input
                        type="text"
                        placeholder="Search library..."
                        className="w-full pl-12 pr-4 py-3.5 bg-white border border-gray-200 rounded-2xl focus:ring-2 focus:ring-blue-100 focus:border-blue-500 outline-none transition-all shadow-sm text-gray-700"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                    <svg className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path>
                    </svg>
                </div>

                <div className="flex gap-3 overflow-x-auto pb-2 scrollbar-hide">
                    {categories.map(cat => (
                        <button
                            key={cat}
                            onClick={() => setSelectedCategory(cat)}
                            className={`px-5 py-3.5 whitespace-nowrap rounded-xl text-sm font-medium transition-all ${selectedCategory === cat
                                    ? 'bg-gray-900 text-white shadow-md'
                                    : 'bg-white text-gray-600 border border-gray-200 hover:border-gray-300 hover:bg-gray-50'
                                }`}
                        >
                            {cat}
                        </button>
                    ))}
                </div>
            </div>

            {/* Content Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 overflow-y-auto pb-20 px-2">
                {filteredArticles.map(article => (
                    <Link key={article.id} href={`/dashboard/wiki/${article.slug}`} className="group block h-full">
                        <div className="h-full bg-white border border-gray-100 rounded-2xl p-8 hover:shadow-lg hover:border-blue-100 transition-all duration-300 relative overflow-hidden">
                            <div className="absolute top-0 left-0 w-1 h-full bg-transparent group-hover:bg-blue-500 transition-colors"></div>

                            <div className="flex items-center justify-between mb-6">
                                <span className={`text-[10px] uppercase tracking-widest font-bold px-2 py-1 rounded-md ${article.category === 'Family Law' ? 'bg-purple-50 text-purple-700' :
                                        article.category === 'Criminal Defense' ? 'bg-red-50 text-red-700' :
                                            'bg-blue-50 text-blue-700'
                                    }`}>
                                    {article.category}
                                </span>
                                <span className="text-xs text-gray-400 font-medium">{article.lastUpdated}</span>
                            </div>

                            <h2 className="text-xl font-medium text-gray-900 mb-4 group-hover:text-blue-700 transition-colors leading-snug">
                                {article.title}
                            </h2>

                            <p className="text-sm text-gray-500 leading-relaxed mb-8 line-clamp-3">
                                {article.summary}
                            </p>

                            <div className="flex flex-wrap gap-2 mt-auto">
                                {article.citations.slice(0, 2).map((cite, i) => (
                                    <span key={i} className="inline-flex items-center text-[11px] text-gray-500 bg-gray-50 px-2.5 py-1.5 rounded-md border border-gray-100">
                                        <svg className="w-3 h-3 mr-1.5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"></path></svg>
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
                    <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-gray-50 mb-6">
                        <svg className="w-8 h-8 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path></svg>
                    </div>
                    <h3 className="text-gray-900 font-medium text-lg">No articles found</h3>
                    <p className="text-gray-500 mt-2">Try adjusting your search terms or category filter.</p>
                </div>
            )}
        </div>
    );
}
