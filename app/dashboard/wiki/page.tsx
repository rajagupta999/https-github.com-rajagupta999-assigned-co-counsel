
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
        <div className="p-8 max-w-[1600px] mx-auto animate-fade-in h-[calc(100vh-64px)] flex flex-col">
            {/* Header */}
            <div className="mb-8">
                <h1 className="text-3xl font-light text-gray-900">Legal Knowledge Base</h1>
                <p className="text-gray-500 mt-2">Curated NY statutes, case law, and procedural guides for Assigned Counsel.</p>
            </div>

            {/* Search & Filter */}
            <div className="flex flex-col md:flex-row gap-4 mb-8">
                <div className="relative flex-1 max-w-2xl">
                    <input
                        type="text"
                        placeholder="Search case law, statutes, or keywords..."
                        className="w-full pl-12 pr-4 py-3 bg-white border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none transition-all shadow-sm"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                    <svg className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path>
                    </svg>
                </div>

                <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide">
                    {categories.map(cat => (
                        <button
                            key={cat}
                            onClick={() => setSelectedCategory(cat)}
                            className={`px-4 py-2 whitespace-nowrap rounded-full text-sm font-medium transition-colors border ${selectedCategory === cat
                                    ? 'bg-gray-900 text-white border-gray-900'
                                    : 'bg-white text-gray-600 border-gray-200 hover:bg-gray-50'
                                }`}
                        >
                            {cat}
                        </button>
                    ))}
                </div>
            </div>

            {/* Content Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 overflow-y-auto pb-20">
                {filteredArticles.map(article => (
                    <Link key={article.id} href={`/dashboard/wiki/${article.slug}`} className="group block">
                        <div className="h-full bg-white border border-gray-200 rounded-2xl p-6 hover:shadow-md transition-all duration-200 group-hover:border-blue-200">
                            <div className="flex items-center justify-between mb-4">
                                <span className={`text-[10px] uppercase tracking-wider font-semibold px-2 py-1 rounded-sm ${article.category === 'Family Law' ? 'bg-purple-50 text-purple-700' :
                                        article.category === 'Criminal Defense' ? 'bg-red-50 text-red-700' :
                                            'bg-blue-50 text-blue-700'
                                    }`}>
                                    {article.category}
                                </span>
                                <span className="text-xs text-gray-400">Upd. {article.lastUpdated}</span>
                            </div>

                            <h2 className="text-lg font-medium text-gray-900 mb-3 group-hover:text-blue-600 transition-colors">
                                {article.title}
                            </h2>

                            <p className="text-sm text-gray-500 leading-relaxed mb-6 line-clamp-3">
                                {article.summary}
                            </p>

                            <div className="flex flex-wrap gap-2 mt-auto">
                                {article.citations.slice(0, 2).map((cite, i) => (
                                    <span key={i} className="inline-flex items-center text-[10px] text-gray-500 bg-gray-50 px-2 py-1 rounded border border-gray-100">
                                        <svg className="w-3 h-3 mr-1 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"></path></svg>
                                        {cite}
                                    </span>
                                ))}
                                {article.citations.length > 2 && (
                                    <span className="text-[10px] text-gray-400 pt-1">+{article.citations.length - 2} more</span>
                                )}
                            </div>
                        </div>
                    </Link>
                ))}
            </div>

            {filteredArticles.length === 0 && (
                <div className="text-center py-20">
                    <div className="inline-block p-4 rounded-full bg-gray-50 mb-4">
                        <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
                    </div>
                    <h3 className="text-gray-900 font-medium">No articles found</h3>
                    <p className="text-gray-500 text-sm mt-1">Try adjusting your search terms or category filter.</p>
                </div>
            )}
        </div>
    );
}
