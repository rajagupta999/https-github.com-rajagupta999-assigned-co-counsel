
"use client";

import { use, useEffect, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { wikiArticles, WikiArticle } from '@/lib/wikiContent';
import ReactMarkdown from 'react-markdown';

export default function WikiArticlePage({ params }: { params: Promise<{ slug: string }> }) {
    const router = useRouter();
    const resolvedParams = use(params);
    const [article, setArticle] = useState<WikiArticle | null>(null);

    useEffect(() => {
        const found = wikiArticles.find(a => a.slug === resolvedParams.slug);
        if (found) {
            setArticle(found);
        }
    }, [resolvedParams.slug]);

    if (!article) return (
        <div className="p-12 flex items-center justify-center">
            <div className="flex items-center gap-3 text-slate-400">
                <div className="w-5 h-5 border-2 border-slate-300 border-t-blue-500 rounded-full animate-spin"></div>
                <span className="text-sm font-medium">Loading article...</span>
            </div>
        </div>
    );

    return (
        <div className="h-[calc(100vh-56px)] overflow-y-auto bg-white">
            <div className="max-w-5xl mx-auto px-8 lg:px-12 py-12 animate-fade-in">

                {/* Breadcrumbs */}
                <div className="flex items-center text-sm text-slate-400 mb-8">
                    <Link href="/dashboard/wiki" className="hover:text-blue-600 transition-colors font-medium">Wiki</Link>
                    <svg className="mx-2" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ width: '14px', height: '14px' }}><polyline points="9 18 15 12 9 6"></polyline></svg>
                    <span className="text-slate-700 font-medium px-2 py-0.5 bg-slate-50 rounded-md text-xs">{article.category}</span>
                </div>

                {/* Title Header */}
                <div className="mb-12 pb-8 border-b border-slate-100">
                    <h1 className="text-3xl lg:text-4xl font-bold text-slate-900 mb-6 leading-tight tracking-tight">
                        {article.title}
                    </h1>

                    <div className="flex items-center gap-4 text-sm flex-wrap">
                        <span className="text-slate-400 flex items-center gap-2">
                            <span className="bg-slate-100 text-slate-600 px-2.5 py-1 rounded-md text-[11px] font-semibold uppercase tracking-wider">
                                Last Updated
                            </span>
                            <span className="text-slate-600 font-medium">{article.lastUpdated}</span>
                        </span>
                        <span className="bg-emerald-50 text-emerald-600 px-2.5 py-1 rounded-md text-[11px] font-semibold uppercase tracking-wider flex items-center gap-1.5">
                            <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" style={{ width: '10px', height: '10px' }}><polyline points="20 6 9 17 4 12"></polyline></svg>
                            Verified Source
                        </span>
                    </div>
                </div>

                <div className="flex flex-col lg:flex-row gap-12">
                    {/* Main Content */}
                    <article className="flex-1 markdown-prose text-slate-700 leading-loose text-[15px]">
                        <ReactMarkdown>{article.content}</ReactMarkdown>
                    </article>

                    {/* Sidebar */}
                    <aside className="w-full lg:w-72 space-y-6 flex-shrink-0">
                        {/* Citations Card */}
                        <div className="bg-slate-50 border border-slate-100 rounded-xl p-6 sticky top-8">
                            <h3 className="text-[11px] font-bold text-slate-400 uppercase tracking-widest mb-5">
                                Legal Citations
                            </h3>
                            <ul className="space-y-3">
                                {article.citations.map((cite, i) => (
                                    <li key={i} className="flex items-start gap-3 text-sm text-slate-600 group">
                                        <div className="w-5 h-5 flex-shrink-0 flex items-center justify-center bg-blue-50 rounded-md mt-0.5 group-hover:bg-blue-100 transition-colors">
                                            <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="#3b82f6" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" style={{ width: '10px', height: '10px' }}><path d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1"></path></svg>
                                        </div>
                                        <span className="hover:text-blue-600 cursor-pointer transition-colors text-[13px] leading-relaxed">
                                            {cite}
                                        </span>
                                    </li>
                                ))}
                            </ul>
                        </div>

                        {/* Co-Pilot Action */}
                        <div className="bg-gradient-to-br from-slate-800 to-slate-900 rounded-xl p-6 text-white">
                            <h3 className="font-semibold text-sm mb-2">Draft a Motion</h3>
                            <p className="text-slate-400 text-xs mb-5 leading-relaxed">
                                Use Co-Pilot to analyze this case law or draft a legal memo instantly.
                            </p>
                            <Link
                                href="/dashboard/copilot"
                                className="block w-full text-center bg-white text-slate-900 px-5 py-2.5 rounded-lg text-sm font-semibold hover:bg-slate-50 transition-all shadow-sm"
                            >
                                Open in Co-Pilot
                            </Link>
                        </div>
                    </aside>
                </div>
            </div>
        </div>
    );
}
