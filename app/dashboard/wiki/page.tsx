"use client";

import { useState } from 'react';
import Link from 'next/link';
import { wikiArticles } from '@/lib/wikiContent';

export default function WikiPage() {
    const [search, setSearch] = useState('');
    const [category, setCategory] = useState('All');
    const categories = ['All', 'Family Law', 'Criminal Defense', 'Divorce & Matrimonial'];
    const filtered = wikiArticles.filter(a => {
        const matchSearch = a.title.toLowerCase().includes(search.toLowerCase()) || a.summary.toLowerCase().includes(search.toLowerCase());
        const matchCat = category === 'All' || a.category === category;
        return matchSearch && matchCat;
    });

    return (
        <div style={{ padding: '2rem', maxWidth: '1100px' }}>
            <h1 style={{ fontSize: '24px', fontWeight: 700, color: '#0f172a', marginBottom: '0.25rem' }}>Legal Wiki</h1>
            <p style={{ fontSize: '14px', color: '#64748b', marginBottom: '1.5rem' }}>NY statutes, case law, and procedural guides.</p>
            <div style={{ display: 'flex', gap: '1rem', marginBottom: '1.5rem', flexWrap: 'wrap' }}>
                <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search articles..." style={{ flex: 1, minWidth: '200px', padding: '0.5rem 0.875rem', border: '1px solid #e2e8f0', borderRadius: '8px', fontSize: '13px', outline: 'none' }} />
                <div style={{ display: 'flex', gap: '0.375rem' }}>
                    {categories.map(c => (
                        <button key={c} onClick={() => setCategory(c)} style={{ padding: '0.5rem 0.875rem', borderRadius: '8px', fontSize: '12px', fontWeight: 600, border: '1px solid', borderColor: category === c ? '#2563eb' : '#e2e8f0', background: category === c ? '#2563eb' : '#fff', color: category === c ? '#fff' : '#64748b', cursor: 'pointer' }}>{c}</button>
                    ))}
                </div>
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '1rem' }}>
                {filtered.map(article => (
                    <Link key={article.id} href={`/dashboard/wiki/${article.slug}`} style={{ display: 'block' }}>
                        <div style={{ background: '#fff', border: '1px solid #e2e8f0', borderRadius: '12px', padding: '1.25rem', cursor: 'pointer' }}>
                            <div style={{ fontSize: '11px', fontWeight: 600, color: '#2563eb', textTransform: 'uppercase', marginBottom: '0.5rem' }}>{article.category}</div>
                            <h3 style={{ fontSize: '15px', fontWeight: 600, color: '#0f172a', marginBottom: '0.5rem' }}>{article.title}</h3>
                            <p style={{ fontSize: '13px', color: '#64748b', lineHeight: 1.6 }}>{article.summary}</p>
                            <div style={{ marginTop: '0.75rem', fontSize: '11px', color: '#94a3b8' }}>Updated {article.lastUpdated}</div>
                        </div>
                    </Link>
                ))}
            </div>
            {filtered.length === 0 && <div style={{ textAlign: 'center', padding: '3rem', color: '#94a3b8', fontSize: '14px' }}>No articles found.</div>}
        </div>
    );
}
