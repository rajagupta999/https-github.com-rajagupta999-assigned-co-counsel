"use client";

import { use, useEffect, useState } from 'react';
import Link from 'next/link';
import { wikiArticles, WikiArticle } from '@/lib/wikiContent';
import ReactMarkdown from 'react-markdown';

export default function WikiArticlePage({ params }: { params: Promise<{ slug: string }> }) {
    const resolvedParams = use(params);
    const [article, setArticle] = useState<WikiArticle | null>(null);

    useEffect(() => {
        const found = wikiArticles.find(a => a.slug === resolvedParams.slug);
        if (found) setArticle(found);
    }, [resolvedParams.slug]);

    if (!article) return <div style={{ padding: '3rem', textAlign: 'center', color: '#94a3b8' }}>Loading...</div>;

    return (
        <div style={{ padding: '2rem', maxWidth: '900px' }}>
            <Link href="/dashboard/wiki" style={{ fontSize: '13px', color: '#2563eb', fontWeight: 600 }}>← Back to Wiki</Link>
            <div style={{ marginTop: '1.5rem', marginBottom: '1.5rem' }}>
                <div style={{ fontSize: '11px', fontWeight: 600, color: '#2563eb', textTransform: 'uppercase', marginBottom: '0.5rem' }}>{article.category}</div>
                <h1 style={{ fontSize: '28px', fontWeight: 700, color: '#0f172a', lineHeight: 1.3 }}>{article.title}</h1>
                <div style={{ fontSize: '12px', color: '#94a3b8', marginTop: '0.5rem' }}>Updated {article.lastUpdated}</div>
            </div>
            <div style={{ display: 'flex', gap: '2rem' }}>
                <div style={{ flex: 1 }} className="prose">
                    <ReactMarkdown>{article.content}</ReactMarkdown>
                </div>
                <div style={{ width: '220px', flexShrink: 0 }}>
                    <div style={{ background: '#f8fafc', border: '1px solid #e2e8f0', borderRadius: '12px', padding: '1.25rem', position: 'sticky', top: '1rem' }}>
                        <div style={{ fontSize: '11px', fontWeight: 700, color: '#94a3b8', textTransform: 'uppercase', marginBottom: '0.75rem' }}>Citations</div>
                        {article.citations.map((cite, i) => (
                            <div key={i} style={{ fontSize: '12px', color: '#475569', marginBottom: '0.5rem', lineHeight: 1.5 }}>{cite}</div>
                        ))}
                        <Link href="/dashboard/copilot" style={{ display: 'block', marginTop: '1rem', padding: '0.5rem', background: '#2563eb', color: 'white', borderRadius: '8px', fontSize: '12px', fontWeight: 600, textAlign: 'center' }}>Open in Co-Pilot</Link>
                    </div>
                </div>
            </div>
        </div>
    );
}
