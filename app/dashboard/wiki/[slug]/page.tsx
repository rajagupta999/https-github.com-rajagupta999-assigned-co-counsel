
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
            <div className="max-w-4xl mx-auto px-8 py-12 animate-fade-in">

                {/* Breadcrumbs */}
                <div className="flex items-center text-sm text-gray-500 mb-8">
                    <Link href="/dashboard/wiki" className="hover:text-blue-600 transition-colors">Wiki</Link>
                    <span className="mx-2">/</span>
                    <span className="text-gray-900 font-medium">{article.category}</span>
                </div>

                {/* Title Header */}
                <div className="mb-10 pb-8 border-b border-gray-100">
                    <h1 className="text-4xl font-light text-gray-900 mb-6 leading-tight">
                        {article.title}
                    </h1>

                    <div className="flex items-center gap-6 text-sm">
                        <div className="flex items-center gap-2 text-gray-500">
                            <span className="bg-gray-100 text-gray-600 px-2 py-0.5 rounded text-xs font-medium uppercase tracking-wide">
                                Last Updated
                            </span>
                            {article.lastUpdated}
                        </div>
                        <div className="flex items-center gap-2">
                            <span className="bg-blue-50 text-blue-600 px-2 py-0.5 rounded text-xs font-medium uppercase tracking-wide">
                                Verified
                            </span>
                        </div>
                    </div>
                </div>

                <div className="flex flex-col lg:flex-row gap-12">
                    {/* Main Content */}
                    <article className="flex-1 markdown-prose text-gray-800 leading-relaxed">
                        <ReactMarkdown>{article.content}</ReactMarkdown>
                    </article>

                    {/* Sidebar / Context */}
                    <aside className="w-full lg:w-72 space-y-8">
                        {/* Citations Card */}
                        <div className="bg-gray-50 border border-gray-100 rounded-xl p-6">
                            <h3 className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-4">
                                Legal Citations
                            </h3>
                            <ul className="space-y-3">
                                {article.citations.map((cite, i) => (
                                    <li key={i} className="flex items-start gap-2 text-sm text-gray-600">
                                        <svg className="w-4 h-4 mt-0.5 text-blue-400 shrink-0" style={{ width: '16px', height: '16px' }} width="16" height="16" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1"></path></svg>
                                        <span className="hover:text-blue-600 cursor-pointer transition-colors border-b border-transparent hover:border-blue-200">
                                            {cite}
                                        </span>
                                    </li>
                                ))}
                            </ul>
                        </div>

                        {/* Co-Pilot Action */}
                        <div className="bg-blue-600 rounded-xl p-6 text-white shadow-lg shadow-blue-200">
                            <h3 className="font-medium mb-2">Need to apply this?</h3>
                            <p className="text-blue-100 text-sm mb-4">
                                Use Co-Pilot to draft a motion or memo based on this case law.
                            </p>
                            <Link
                                href="/dashboard/copilot"
                                className="block w-full text-center bg-white text-blue-600 px-4 py-2 rounded-lg text-sm font-medium hover:bg-blue-50 transition-colors"
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
