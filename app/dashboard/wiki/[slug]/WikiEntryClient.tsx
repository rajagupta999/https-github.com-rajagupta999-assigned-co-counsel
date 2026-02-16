'use client';

import { useState, useEffect, useMemo } from 'react';
import Link from 'next/link';
import { WikiEntry, WIKI_CATEGORIES } from '@/lib/wikiData';
import { getWikiEntry, saveWikiEntry, getWikiEntries } from '@/lib/wikiStore';

const FUNCTIONS_BASE = 'https://us-central1-assigned-co-counsel.cloudfunctions.net';

/* Simple markdown renderer */
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
      if (cells.every(c => /^[\s-:]+$/.test(c))) return '';
      return '<tr>' + cells.map(c => `<td class="border border-slate-200 px-3 py-2 text-sm">${c.trim()}</td>`).join('') + '</tr>';
    });
}

/* Mock RAG analysis of a document */
function generateMockChunks(content: string) {
  const words = content.split(/\s+/);
  const chunkSize = 120;
  const chunks: { text: string; index: number; tokens: number; embedding_preview: string }[] = [];
  for (let i = 0; i < words.length; i += chunkSize) {
    const slice = words.slice(i, i + chunkSize);
    chunks.push({
      text: slice.join(' ').slice(0, 300),
      index: chunks.length,
      tokens: slice.length,
      embedding_preview: `[${(Math.random() * 0.5 - 0.25).toFixed(4)}, ${(Math.random() * 0.5 - 0.25).toFixed(4)}, ${(Math.random() * 0.5 - 0.25).toFixed(4)}, ... 1024 dims]`,
    });
  }
  return chunks;
}

function extractKeyConcepts(content: string): string[] {
  const legalTerms = ['motion', 'suppress', 'evidence', 'hearing', 'defendant', 'prosecution', 'burden', 'probable cause',
    'reasonable suspicion', 'custody', 'Miranda', 'waiver', 'arraignment', 'indictment', 'verdict', 'sentence',
    'felony', 'misdemeanor', 'plea', 'bail', 'discovery', 'speedy trial', 'preclusion', 'dismissal',
    'physical injury', 'serious physical injury', 'deadly weapon', 'justification', 'self-defense',
    'domestic violence', 'best interests', 'equitable distribution', 'maintenance', 'child support',
    'ineffective assistance', 'post-conviction', 'vacate', 'appeal', 'due process', 'equal protection',
    'Fourth Amendment', 'Fifth Amendment', 'Sixth Amendment', 'search and seizure', 'stop and frisk'];
  const lower = content.toLowerCase();
  return legalTerms.filter(t => lower.includes(t)).slice(0, 12);
}

function determineWorkflows(entry: WikiEntry): string[] {
  const workflows: string[] = [];
  const c = (entry.title + ' ' + entry.content).toLowerCase();
  if (c.includes('criminal') || c.includes('cpl') || c.includes('penal') || c.includes('felony') || c.includes('misdemeanor')) workflows.push('Criminal Defense');
  if (c.includes('suppress') || c.includes('motion') || c.includes('hearing')) workflows.push('Pretrial Motions');
  if (c.includes('custody') || c.includes('divorce') || c.includes('drl') || c.includes('family')) workflows.push('Family Law');
  if (c.includes('discovery') || c.includes('245')) workflows.push('Discovery Compliance');
  if (c.includes('bail') || c.includes('arraignment')) workflows.push('Arraignment');
  if (c.includes('trial') || c.includes('jury') || c.includes('verdict')) workflows.push('Trial Preparation');
  if (workflows.length === 0) workflows.push('General Research');
  return workflows.slice(0, 3);
}

export default function WikiEntryClient({ slug }: { slug: string }) {
  const [entry, setEntry] = useState<WikiEntry | null>(null);
  const [activeView, setActiveView] = useState<'text' | 'rag'>('text');
  const [isEditing, setIsEditing] = useState(false);
  const [editContent, setEditContent] = useState('');
  const [editTitle, setEditTitle] = useState('');
  const [editSummary, setEditSummary] = useState('');
  const [showHistory, setShowHistory] = useState(false);
  const [fetchingCL, setFetchingCL] = useState(false);
  const [relatedEntries, setRelatedEntries] = useState<WikiEntry[]>([]);
  const [expandedChunk, setExpandedChunk] = useState<number | null>(null);

  useEffect(() => {
    if (!slug) return;
    const found = getWikiEntry(slug);
    if (found) {
      setEntry(found);
      setEditContent(found.content);
      setEditTitle(found.title);
      const all = getWikiEntries();
      setRelatedEntries(all.filter(e => found.relatedEntries.includes(e.slug)));
    }
  }, [slug]);

  const mockChunks = useMemo(() => entry ? generateMockChunks(entry.content) : [], [entry]);
  const keyConcepts = useMemo(() => entry ? extractKeyConcepts(entry.content) : [], [entry]);
  const workflows = useMemo(() => entry ? determineWorkflows(entry) : [], [entry]);

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
          ...entry, content: entry.content + extra,
          updatedAt: new Date().toISOString().split('T')[0], lastEditedBy: 'CourtListener Fetch',
          editHistory: [{ author: 'CourtListener Fetch', timestamp: new Date().toISOString(), summary: 'Fetched latest from CourtListener' }, ...entry.editHistory],
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
        <Link href="/dashboard/wiki" className="text-navy-700 font-semibold mt-4 inline-block hover:underline">← Back to Knowledge Base</Link>
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
          <Link href="/dashboard/wiki" className="hover:text-cyan-700 transition-colors font-medium">Knowledge Base</Link>
          <svg className="mx-2" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><polyline points="9 18 15 12 9 6" /></svg>
          <span className="text-slate-700 font-medium px-2 py-0.5 bg-slate-50 rounded-md text-xs">{catName}</span>
        </div>

        {/* Grounding Badge */}
        <div className="mb-4 bg-gradient-to-r from-cyan-50 to-emerald-50 border border-cyan-200 rounded-xl p-3 flex items-center gap-3 flex-wrap">
          <span className="w-2 h-2 bg-cyan-500 rounded-full animate-pulse flex-shrink-0" />
          <span className="text-xs text-cyan-800 font-medium">
            This document is currently used to ground answers for{' '}
            {workflows.map((w, i) => (
              <span key={w}>
                <span className="font-bold text-cyan-900">[{w}]</span>
                {i < workflows.length - 1 ? ', ' : ''}
              </span>
            ))}
            {' '}workflows.
          </span>
          <span className="text-[10px] bg-cyan-100 text-cyan-600 px-2 py-0.5 rounded-full font-mono ml-auto">RAG ACTIVE</span>
        </div>

        {/* Title Header */}
        <div className="mb-6 sm:mb-8 pb-6 sm:pb-8 border-b border-slate-100">
          {!isEditing ? (
            <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-slate-900 mb-4 sm:mb-6 leading-tight tracking-tight">{entry.title}</h1>
          ) : (
            <input type="text" value={editTitle} onChange={e => setEditTitle(e.target.value)} className="text-2xl sm:text-3xl font-bold text-slate-900 mb-4 w-full border-b-2 border-cyan-400 focus:outline-none pb-2" />
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

        {/* View Toggle: Text / RAG */}
        <div className="flex gap-1 mb-6 bg-slate-100 rounded-lg p-1 w-fit">
          <button onClick={() => setActiveView('text')} className={`px-4 py-2 rounded-md text-sm font-semibold transition-all ${activeView === 'text' ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}>
            📄 Text View
          </button>
          <button onClick={() => setActiveView('rag')} className={`px-4 py-2 rounded-md text-sm font-semibold transition-all flex items-center gap-1.5 ${activeView === 'rag' ? 'bg-slate-900 text-cyan-400 shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}>
            🧬 RAG View
            <span className="text-[9px] bg-cyan-500/20 text-cyan-500 px-1.5 py-0.5 rounded-full font-mono">AI</span>
          </button>
        </div>

        <div className="flex flex-col lg:flex-row gap-8 lg:gap-12">
          {/* Main Content */}
          <article className="flex-1 order-2 lg:order-1">
            {activeView === 'text' ? (
              /* === TEXT VIEW === */
              <>
                {!isEditing ? (
                  <div className="prose-slate text-slate-700 leading-loose text-sm sm:text-[15px]" dangerouslySetInnerHTML={{ __html: renderMarkdown(entry.content) }} />
                ) : (
                  <div className="space-y-4">
                    <textarea value={editContent} onChange={e => setEditContent(e.target.value)} rows={30} className="w-full px-4 py-3 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-cyan-500/20 font-mono text-sm leading-relaxed" />
                    <div>
                      <label className="block text-sm font-semibold text-slate-700 mb-1">Edit Summary</label>
                      <input type="text" value={editSummary} onChange={e => setEditSummary(e.target.value)} placeholder="Briefly describe your changes..." className="w-full px-4 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-cyan-500/20 text-sm" />
                    </div>
                    <div className="flex gap-3">
                      <button onClick={handleSave} className="px-6 py-2 bg-gradient-to-r from-cyan-600 to-emerald-600 text-white rounded-lg font-semibold text-sm shadow-lg shadow-cyan-500/20">Save Changes</button>
                      <button onClick={() => { setIsEditing(false); setEditContent(entry.content); setEditTitle(entry.title); }} className="px-4 py-2 text-slate-600 hover:text-slate-800 text-sm">Cancel</button>
                    </div>
                  </div>
                )}
              </>
            ) : (
              /* === RAG VIEW === */
              <div className="space-y-6">
                {/* RAG Stats */}
                <div className="grid grid-cols-3 gap-3">
                  <div className="bg-slate-900 rounded-xl p-4 text-center">
                    <div className="text-2xl font-bold font-mono text-cyan-400">{mockChunks.length}</div>
                    <div className="text-[11px] text-slate-400 uppercase tracking-wider mt-1">Chunks</div>
                  </div>
                  <div className="bg-slate-900 rounded-xl p-4 text-center">
                    <div className="text-2xl font-bold font-mono text-emerald-400">1024</div>
                    <div className="text-[11px] text-slate-400 uppercase tracking-wider mt-1">Dimensions</div>
                  </div>
                  <div className="bg-slate-900 rounded-xl p-4 text-center">
                    <div className="text-2xl font-bold font-mono text-amber-400">{entry.content.split(/\s+/).length}</div>
                    <div className="text-[11px] text-slate-400 uppercase tracking-wider mt-1">Tokens</div>
                  </div>
                </div>

                {/* Key Concepts */}
                <div className="bg-slate-50 border border-slate-200 rounded-xl p-4">
                  <h3 className="text-[11px] font-bold text-slate-400 uppercase tracking-widest mb-3">Key Concepts (Extracted)</h3>
                  <div className="flex flex-wrap gap-2">
                    {keyConcepts.map((concept, i) => (
                      <span key={i} className="bg-cyan-50 text-cyan-700 px-2.5 py-1 rounded-lg text-xs font-medium border border-cyan-200">
                        {concept}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Document Chunks */}
                <div>
                  <h3 className="text-[11px] font-bold text-slate-400 uppercase tracking-widest mb-3">Document Chunks</h3>
                  <div className="space-y-2">
                    {mockChunks.map((chunk, i) => (
                      <div key={i}
                        className={`border rounded-xl overflow-hidden transition-all cursor-pointer ${expandedChunk === i ? 'border-cyan-300 bg-cyan-50/50' : 'border-slate-200 bg-white hover:border-slate-300'}`}
                        onClick={() => setExpandedChunk(expandedChunk === i ? null : i)}
                      >
                        <div className="p-3 flex items-center gap-3">
                          <span className="w-8 h-8 bg-slate-900 text-cyan-400 rounded-lg flex items-center justify-center text-xs font-mono font-bold flex-shrink-0">
                            {String(i).padStart(2, '0')}
                          </span>
                          <div className="flex-1 min-w-0">
                            <p className="text-xs text-slate-600 truncate">{chunk.text.slice(0, 120)}...</p>
                          </div>
                          <span className="text-[10px] font-mono text-slate-400 flex-shrink-0">{chunk.tokens} tok</span>
                          <svg className={`w-4 h-4 text-slate-400 transition-transform flex-shrink-0 ${expandedChunk === i ? 'rotate-180' : ''}`} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="6 9 12 15 18 9"/></svg>
                        </div>
                        {expandedChunk === i && (
                          <div className="px-3 pb-3 border-t border-slate-100 pt-3 space-y-3">
                            <div>
                              <span className="text-[10px] font-mono text-slate-400 uppercase tracking-wider">Full Text</span>
                              <p className="text-xs text-slate-700 mt-1 leading-relaxed bg-white p-2 rounded-lg border border-slate-100">{chunk.text}</p>
                            </div>
                            <div>
                              <span className="text-[10px] font-mono text-slate-400 uppercase tracking-wider">Embedding Vector</span>
                              <p className="text-xs font-mono text-cyan-600 mt-1 bg-slate-900 text-cyan-400 p-2 rounded-lg">{chunk.embedding_preview}</p>
                            </div>
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                </div>

                {/* Community Notes */}
                <div className="bg-amber-50 border border-amber-200 rounded-xl p-4">
                  <h3 className="text-[11px] font-bold text-amber-600 uppercase tracking-widest mb-3 flex items-center gap-1.5">
                    💬 Community Notes
                  </h3>
                  <div className="space-y-2 text-xs text-amber-800">
                    {entry.category === 'Statutes' && (
                      <>
                        <p className="bg-white/60 rounded-lg p-2 border border-amber-100">&quot;Judge Martinez in Brooklyn Criminal Court requires strict adherence to timing requirements under this statute. Do not expect extensions without extraordinary circumstances.&quot; — <em>Anonymous, Kings County</em></p>
                        <p className="bg-white/60 rounded-lg p-2 border border-amber-100">&quot;Always cross-reference with CPL 245 discovery obligations when filing under this section.&quot; — <em>Verified Attorney, Manhattan</em></p>
                      </>
                    )}
                    {entry.category === 'Cases' && (
                      <>
                        <p className="bg-white/60 rounded-lg p-2 border border-amber-100">&quot;This case is frequently cited by judges in Kings and Bronx County. Have the four-tier framework memorized for suppression hearings.&quot; — <em>Anonymous, Bronx County</em></p>
                        <p className="bg-white/60 rounded-lg p-2 border border-amber-100">&quot;Recent appellate decisions have been narrowing the scope. Check 2024 case law before relying solely on this.&quot; — <em>Verified Attorney, Queens</em></p>
                      </>
                    )}
                    {entry.category !== 'Statutes' && entry.category !== 'Cases' && (
                      <p className="bg-white/60 rounded-lg p-2 border border-amber-100">&quot;This entry is regularly referenced in practice. Confirm details with current court rules.&quot; — <em>Community</em></p>
                    )}
                  </div>
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
                      <div className="w-2 h-2 bg-cyan-500 rounded-full mt-1.5 flex-shrink-0" />
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
            <div className="bg-gradient-to-br from-slate-800 to-slate-900 rounded-xl p-4 sm:p-6 text-white space-y-3">
              <h3 className="font-semibold text-sm flex items-center gap-2">
                Actions
                <span className="text-[9px] bg-cyan-500/20 text-cyan-400 px-1.5 py-0.5 rounded-full font-mono">v2</span>
              </h3>
              {!isEditing && (
                <button onClick={() => { setIsEditing(true); setActiveView('text'); }} className="w-full bg-gradient-to-r from-cyan-500 to-emerald-500 text-white px-4 py-2.5 rounded-lg text-sm font-semibold hover:from-cyan-400 hover:to-emerald-400 transition-all shadow-lg shadow-cyan-500/20">
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

            {/* RAG Info */}
            <div className="bg-slate-900 rounded-xl p-4 sm:p-6">
              <h3 className="text-[11px] font-bold text-slate-400 uppercase tracking-widest mb-3">RAG Status</h3>
              <div className="space-y-2">
                <div className="flex items-center justify-between text-xs">
                  <span className="text-slate-400">Indexed</span>
                  <span className="text-emerald-400 font-mono flex items-center gap-1"><span className="w-1.5 h-1.5 bg-emerald-400 rounded-full" /> Yes</span>
                </div>
                <div className="flex items-center justify-between text-xs">
                  <span className="text-slate-400">Chunks</span>
                  <span className="text-cyan-400 font-mono">{mockChunks.length}</span>
                </div>
                <div className="flex items-center justify-between text-xs">
                  <span className="text-slate-400">Embedding Model</span>
                  <span className="text-slate-300 font-mono text-[10px]">embed-v3.0</span>
                </div>
                <div className="flex items-center justify-between text-xs">
                  <span className="text-slate-400">Last Indexed</span>
                  <span className="text-slate-300 font-mono text-[10px]">{entry.updatedAt}</span>
                </div>
              </div>
            </div>

            {/* Citations */}
            {entry.citations.length > 0 && (
              <div className="bg-slate-50 border border-slate-100 rounded-xl p-4 sm:p-6">
                <h3 className="text-[11px] font-bold text-slate-400 uppercase tracking-widest mb-4">Legal Citations</h3>
                <ul className="space-y-2">
                  {entry.citations.map((cite, i) => (
                    <li key={i} className="flex items-start gap-2 text-sm text-slate-600">
                      <div className="w-5 h-5 flex-shrink-0 flex items-center justify-center bg-cyan-50 rounded-md mt-0.5">
                        <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="#0891b2" strokeWidth="2.5"><path d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" /></svg>
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
                      <Link href={`/dashboard/wiki/${re.slug}`} className="text-xs sm:text-[13px] text-cyan-700 hover:text-cyan-900 font-medium hover:underline">
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
