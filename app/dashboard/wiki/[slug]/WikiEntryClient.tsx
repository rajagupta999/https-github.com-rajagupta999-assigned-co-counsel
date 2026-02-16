'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { WikiEntry, WIKI_CATEGORIES } from '@/lib/wikiData';
import { getWikiEntry, saveWikiEntry, getWikiEntries } from '@/lib/wikiStore';

const FUNCTIONS_BASE = 'https://us-central1-assigned-co-counsel.cloudfunctions.net';

/* Simple markdown renderer — no dependency needed */
function renderMarkdown(md: string): string {
  return md
    .replace(/^### (.+)$/gm, '<h3 class="text-lg font-bold text-slate-800 mt-6 mb-2">$1</h3>')
    .replace(/^## (.+)$/gm, '<h2 class="text-xl font-bold text-slate-800 mt-8 mb-3">$1</h2>')
    .replace(/^# (.+)$/gm, '<h1 class="text-2xl font-bold text-slate-900 mt-4 mb-4">$1</h1>')
    .replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>')
    .replace(/\*(.+?)\*/g, '<em>$1</em>')
    .replace(/`(.+?)`/g, '<code class="bg-slate-100 px-1.5 py-0.5 rounded text-sm font-mono text-navy-800">$1</code>')
    .replace(/^- \[ \] (.+)$/gm, '<div class="flex items-start gap-2 my-1"><input type="checkbox" disabled class="mt-1" /><span>$1</span></div>')
    .replace(/^- \[x\] (.+)$/gm, '<div class="flex items-start gap-2 my-1"><input type="checkbox" checked disabled class="mt-1" /><span>$1</span></div>')
    .replace(/^- (.+)$/gm, '<li class="ml-4 list-disc text-slate-700 my-0.5">$1</li>')
    .replace(/^(\d+)\. (.+)$/gm, '<li class="ml-4 list-decimal text-slate-700 my-0.5">$2</li>')
    .replace(/^> (.+)$/gm, '<blockquote class="border-l-4 border-navy-200 pl-4 italic text-slate-600 my-3">$1</blockquote>')
    .replace(/^---$/gm, '<hr class="my-6 border-slate-200" />')
    .replace(/\n\n/g, '</p><p class="my-2 text-slate-700 leading-relaxed">')
    .replace(/\|(.+)\|/g, (match) => {
      const cells = match.split('|').filter(c => c.trim());
      if (cells.every(c => /^[\s-:]+$/.test(c))) return ''; // separator row
      const tag = match.includes('---') ? 'td' : 'td';
      return '<tr>' + cells.map(c => `<${tag} class="border border-slate-200 px-3 py-2 text-sm">${c.trim()}</${tag}>`).join('') + '</tr>';
    });
}

export default function WikiEntryClient({ slug }: { slug: string }) {
  const [entry, setEntry] = useState<WikiEntry | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [editContent, setEditContent] = useState('');
  const [editTitle, setEditTitle] = useState('');
  const [editSummary, setEditSummary] = useState('');
  const [showHistory, setShowHistory] = useState(false);
  const [fetchingCL, setFetchingCL] = useState(false);
  const [relatedEntries, setRelatedEntries] = useState<WikiEntry[]>([]);

  useEffect(() => {
    if (!slug) return;
    const found = getWikiEntry(slug);
    if (found) {
      setEntry(found);
      setEditContent(found.content);
      setEditTitle(found.title);
      // Load related entries
      const all = getWikiEntries();
      const related = all.filter(e => found.relatedEntries.includes(e.slug));
      setRelatedEntries(related);
    }
  }, [slug]);

  const handleSave = () => {
    if (!entry || !editContent.trim()) return;
    const updated: WikiEntry = {
      ...entry,
      title: editTitle || entry.title,
      content: editContent,
      updatedAt: new Date().toISOString().split('T')[0],
      lastEditedBy: 'You',
      editHistory: [
        { author: 'You', timestamp: new Date().toISOString(), summary: editSummary || 'Edited entry' },
        ...entry.editHistory,
      ],
    };
    saveWikiEntry(updated);
    setEntry(updated);
    setIsEditing(false);
    setEditSummary('');
  };

  const handleFetchFromCL = async () => {
    if (!entry) return;
    setFetchingCL(true);
    try {
      const searchTerm = entry.title.replace(/§|—|–|-/g, ' ').replace(/\s+/g, ' ').trim();
      const res = await fetch(`${FUNCTIONS_BASE}/searchCaseLaw`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ query: searchTerm, pageSize: 3 }),
      });
      const data = await res.json();
      if (data.results && data.results.length > 0) {
        const r = data.results[0];
        const extra = `\n\n---\n## CourtListener Update (${new Date().toISOString().split('T')[0]})\n**Case**: ${r.caseName || r.case_name || 'N/A'}\n**Court**: ${r.court || r.court_name || 'N/A'}\n**Date Filed**: ${r.dateFiled || r.date_filed || 'N/A'}\n\n${r.snippet || ''}`;
        const updated: WikiEntry = {
          ...entry,
          content: entry.content + extra,
          updatedAt: new Date().toISOString().split('T')[0],
          lastEditedBy: 'CourtListener Fetch',
          editHistory: [
            { author: 'CourtListener Fetch', timestamp: new Date().toISOString(), summary: 'Fetched latest from CourtListener' },
            ...entry.editHistory,
          ],
        };
        saveWikiEntry(updated);
        setEntry(updated);
        setEditContent(updated.content);
      } else {
        alert('No results found on CourtListener for this entry.');
      }
    } catch (err) {
      console.error('CourtListener fetch failed:', err);
      alert('Failed to fetch from CourtListener.');
    }
    setFetchingCL(false);
  };

  if (!entry) {
    return (
      <div className="p-8 text-center">
        <p className="text-slate-500">Entry not found.</p>
        <Link href="/dashboard/wiki" className="text-navy-700 font-semibold mt-4 inline-block hover:underline">← Back to Wiki</Link>
      </div>
    );
  }

  const catIcon = WIKI_CATEGORIES.find(c => c.id === entry.category)?.icon || '📝';
  const catName = WIKI_CATEGORIES.find(c => c.id === entry.category)?.name || entry.category;

  return (
    <div className="min-h-[calc(100vh-56px)] sm:min-h-[calc(100vh-64px)] overflow-y-auto bg-white">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-12 py-6 sm:py-12 animate-fade-in">
        {/* Breadcrumbs */}
        <div className="flex items-center text-sm text-slate-400 mb-6 sm:mb-8">
          <Link href="/dashboard/wiki" className="hover:text-navy-800 transition-colors font-medium">Wiki</Link>
          <svg className="mx-2" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="9 18 15 12 9 6" /></svg>
          <span className="text-slate-700 font-medium px-2 py-0.5 bg-slate-50 rounded-md text-xs">{catName}</span>
        </div>

        {/* Title Header */}
        <div className="mb-8 sm:mb-12 pb-6 sm:pb-8 border-b border-slate-100">
          {!isEditing ? (
            <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-slate-900 mb-4 sm:mb-6 leading-tight tracking-tight">{entry.title}</h1>
          ) : (
            <input type="text" value={editTitle} onChange={e => setEditTitle(e.target.value)} className="text-2xl sm:text-3xl font-bold text-slate-900 mb-4 w-full border-b-2 border-navy-300 focus:outline-none pb-2" />
          )}
          <div className="flex items-center gap-2 sm:gap-4 text-sm flex-wrap">
            <span className="text-slate-400 flex items-center gap-2">
              <span className="bg-slate-100 text-slate-600 px-2.5 py-1 rounded-md text-[11px] font-semibold uppercase tracking-wider">Updated</span>
              <span className="text-slate-600 font-medium text-xs sm:text-sm">{entry.updatedAt}</span>
            </span>
            <span className="text-slate-400 flex items-center gap-2">
              <span className="bg-slate-100 text-slate-600 px-2.5 py-1 rounded-md text-[11px] font-semibold uppercase tracking-wider">By</span>
              <span className="text-slate-600 font-medium text-xs sm:text-sm">{entry.lastEditedBy}</span>
            </span>
            {entry.isVerified ? (
              <span className="bg-emerald-50 text-emerald-600 px-2.5 py-1 rounded-md text-[11px] font-semibold uppercase tracking-wider flex items-center gap-1.5">
                <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3"><polyline points="20 6 9 17 4 12" /></svg>
                Verified
              </span>
            ) : (
              <span className="bg-amber-50 text-amber-600 px-2.5 py-1 rounded-md text-[11px] font-semibold uppercase tracking-wider">Community</span>
            )}
          </div>
        </div>

        <div className="flex flex-col lg:flex-row gap-8 lg:gap-12">
          {/* Main Content */}
          <article className="flex-1 order-2 lg:order-1">
            {!isEditing ? (
              <div className="prose-slate text-slate-700 leading-loose text-sm sm:text-[15px]" dangerouslySetInnerHTML={{ __html: renderMarkdown(entry.content) }} />
            ) : (
              <div className="space-y-4">
                <textarea value={editContent} onChange={e => setEditContent(e.target.value)} rows={30} className="w-full px-4 py-3 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-navy-500/20 font-mono text-sm leading-relaxed" />
                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-1">Edit Summary</label>
                  <input type="text" value={editSummary} onChange={e => setEditSummary(e.target.value)} placeholder="Briefly describe your changes..." className="w-full px-4 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-navy-500/20 text-sm" />
                </div>
                <div className="flex gap-3">
                  <button onClick={handleSave} className="px-6 py-2 bg-navy-900 text-white rounded-lg font-semibold text-sm">Save Changes</button>
                  <button onClick={() => { setIsEditing(false); setEditContent(entry.content); setEditTitle(entry.title); }} className="px-4 py-2 text-slate-600 hover:text-slate-800 text-sm">Cancel</button>
                </div>
              </div>
            )}

            {/* Edit History */}
            {showHistory && (
              <div className="mt-8 border-t border-slate-100 pt-6">
                <h3 className="font-semibold text-slate-800 mb-4">Edit History</h3>
                <div className="space-y-3">
                  {entry.editHistory.map((h, i) => (
                    <div key={i} className="flex items-start gap-3 text-sm">
                      <div className="w-2 h-2 bg-navy-400 rounded-full mt-1.5 flex-shrink-0" />
                      <div>
                        <span className="font-medium text-slate-700">{h.author}</span>
                        <span className="text-slate-400 mx-2">—</span>
                        <span className="text-slate-500">{h.summary}</span>
                        <p className="text-xs text-slate-400 mt-0.5">{new Date(h.timestamp).toLocaleString()}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </article>

          {/* Sidebar */}
          <aside className="w-full lg:w-72 space-y-4 sm:space-y-6 flex-shrink-0 order-1 lg:order-2">
            {/* Actions */}
            <div className="bg-gradient-to-br from-navy-800 to-navy-900 rounded-xl p-4 sm:p-6 text-white space-y-3">
              <h3 className="font-semibold text-sm">Actions</h3>
              {!isEditing && (
                <button onClick={() => setIsEditing(true)} className="w-full bg-gold-500 text-navy-900 px-4 py-2.5 rounded-lg text-sm font-semibold hover:bg-gold-400 transition-all">
                  ✏️ Edit Entry
                </button>
              )}
              <button onClick={handleFetchFromCL} disabled={fetchingCL} className="w-full bg-white/10 text-white px-4 py-2.5 rounded-lg text-sm font-semibold hover:bg-white/20 transition-all disabled:opacity-50 flex items-center justify-center gap-2">
                {fetchingCL ? <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" /> : '🔄'} Fetch from CourtListener
              </button>
              <button onClick={() => setShowHistory(!showHistory)} className="w-full bg-white/10 text-white px-4 py-2.5 rounded-lg text-sm font-semibold hover:bg-white/20 transition-all">
                📜 {showHistory ? 'Hide' : 'Show'} Edit History ({entry.editHistory.length})
              </button>
              <Link href="/dashboard/copilot" className="block w-full text-center bg-white/10 text-white px-4 py-2.5 rounded-lg text-sm font-semibold hover:bg-white/20 transition-all">
                🤖 Open in Co-Pilot
              </Link>
            </div>

            {/* Citations */}
            {entry.citations.length > 0 && (
              <div className="bg-slate-50 border border-slate-100 rounded-xl p-4 sm:p-6">
                <h3 className="text-[11px] font-bold text-slate-400 uppercase tracking-widest mb-4">Legal Citations</h3>
                <ul className="space-y-2">
                  {entry.citations.map((cite, i) => (
                    <li key={i} className="flex items-start gap-2 text-sm text-slate-600">
                      <div className="w-5 h-5 flex-shrink-0 flex items-center justify-center bg-navy-50 rounded-md mt-0.5">
                        <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="#1e3a5f" strokeWidth="2.5"><path d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" /></svg>
                      </div>
                      <span className="text-xs sm:text-[13px] leading-relaxed">{cite}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {/* Related Entries */}
            {relatedEntries.length > 0 && (
              <div className="bg-slate-50 border border-slate-100 rounded-xl p-4 sm:p-6">
                <h3 className="text-[11px] font-bold text-slate-400 uppercase tracking-widest mb-4">Related Entries</h3>
                <ul className="space-y-2">
                  {relatedEntries.map((re, i) => (
                    <li key={i}>
                      <Link href={`/dashboard/wiki/${re.slug}`} className="text-xs sm:text-[13px] text-navy-700 hover:text-navy-900 font-medium hover:underline">
                        {WIKI_CATEGORIES.find(c => c.id === re.category)?.icon} {re.title}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </aside>
        </div>
      </div>
    </div>
  );
}
