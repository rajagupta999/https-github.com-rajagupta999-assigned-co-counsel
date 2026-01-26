
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
        } else {
            // Handle 404 or redirect
        }
    }, [resolvedParams.slug]);

    if (!article) return <div className="p-10 text-gray-400">Loading article...</div>;

    return (
        <div className="h-[calc(100vh-64px)] overflow-y-auto bg-white">
            <div className="max-w-5xl mx-auto px-12 py-16 animate-fade-in">

                {/* Breadcrumbs */}
                <div className="flex items-center text-sm text-gray-500 mb-10">
                    <Link href="/dashboard/wiki" className="hover:text-blue-600 transition-colors">Wiki</Link>
                    <span className="mx-3 text-gray-300">/</span>
                    <span className="text-gray-900 font-medium px-2 py-1 bg-gray-50 rounded-md">{article.category}</span>
                </div>

                {/* Title Header */}
                <div className="mb-16 pb-10 border-b border-gray-100">
                    <h1 className="text-5xl font-light text-gray-900 mb-8 leading-tight tracking-tight">
                        {article.title}
                    </h1>

                    <div className="flex items-center gap-8 text-sm">
                        <div className="flex items-center gap-3 text-gray-500">
                            <span className="bg-gray-100 text-gray-600 px-3 py-1 rounded text-xs font-medium uppercase tracking-wider">
                                Last Updated
                            </span>
                            <span className="text-gray-700">{article.lastUpdated}</span>
                        </div>
                        <div className="flex items-center gap-2">
                            <span className="bg-blue-50 text-blue-600 px-3 py-1 rounded text-xs font-medium uppercase tracking-wider flex items-center gap-2">
                                <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path></svg>
                                Verified Source
                            </span>
                        </div>
                    </div>
                </div>

                <div className="flex flex-col lg:flex-row gap-20">
                    {/* Main Content */}
                    <article className="flex-1 markdown-prose text-gray-800 leading-loose text-lg">
                        <ReactMarkdown>{article.content}</ReactMarkdown>
                    </article>

                    {/* Sidebar / Context */}
                    <aside className="w-full lg:w-80 space-y-10">
                        {/* Citations Card */}
                        <div className="bg-gray-50 border border-gray-100 rounded-2xl p-8 sticky top-8">
                            <h3 className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-6">
                                Legal Citations
                            </h3>
                            <ul className="space-y-5">
                                {article.citations.map((cite, i) => (
                                    <li key={i} className="flex items-start gap-4 text-sm text-gray-600 group">
                                        <div className="w-6 h-6 flex-shrink-0 flex items-center justify-center bg-blue-100/50 rounded-full mt-0.5 group-hover:bg-blue-100 transition-colors">
                                            <svg className="w-3 h-3 text-blue-600" style={{ width: '12px', height: '12px' }} fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1"></path></svg>
                                        </div>
                                        <span className="hover:text-blue-600 cursor-pointer transition-colors border-b border-transparent hover:border-blue-200 leading-relaxed">
                                            {cite}
                                        </span>
                                    </li>
                                ))}
                            </ul>
                        </div>

                        {/* Co-Pilot Action */}
                        <div className="bg-gradient-to-br from-blue-600 to-blue-700 rounded-2xl p-8 text-white shadow-xl shadow-blue-200">
                            <h3 className="font-medium text-lg mb-3">Draft a Motion</h3>
                            <p className="text-blue-100 text-sm mb-6 leading-relaxed">
                                Use Co-Pilot to analyze this case law or draft a legal memo instantly.
                            </p>
                            <Link
                                href="/dashboard/copilot"
                                className="block w-full text-center bg-white text-blue-700 px-6 py-3 rounded-xl text-sm font-semibold hover:bg-blue-50 transition-all transform hover:-translate-y-0.5 shadow-sm"
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
