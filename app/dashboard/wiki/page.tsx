'use client';

import { useState, useEffect, useCallback, useRef } from 'react';
import Link from 'next/link';
import { WikiEntry, WIKI_CATEGORIES } from '@/lib/wikiData';
import DictationButton from '@/components/DictationButton';
import { getWikiEntries, saveWikiEntry, searchWikiEntries, exportWikiJSON, importWikiJSON, resetWikiToDefaults } from '@/lib/wikiStore';
import { indexWikiEntry } from '@/lib/ragService';

const FUNCTIONS_BASE = 'https://us-central1-assigned-co-counsel.cloudfunctions.net';

export default function WikiPage() {
  const [entries, setEntries] = useState<WikiEntry[]>([]);
  const [activeCategory, setActiveCategory] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [isCreating, setIsCreating] = useState(false);
  const [isImporting, setIsImporting] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const [courtListenerQuery, setCourtListenerQuery] = useState('');
  const [clResults, setCLResults] = useState<any[]>([]);
  const [clLoading, setCLLoading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [newEntry, setNewEntry] = useState({
    title: '', content: '', category: 'Statutes' as WikiEntry['category'],
  });

  useEffect(() => {
    setEntries(getWikiEntries());
  }, []);

  const filtered = searchWikiEntries(searchQuery, activeCategory);

  const handleCreate = async () => {
    if (!newEntry.title || !newEntry.content) return;
    const slug = newEntry.title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '').slice(0, 80);
    const entry: WikiEntry = {
      id: `wiki_${Date.now()}`,
      slug,
      title: newEntry.title,
      content: newEntry.content,
      category: newEntry.category,
      lastEditedBy: 'You',
      editHistory: [{ author: 'You', timestamp: new Date().toISOString(), summary: 'Created entry' }],
      citations: [],
      relatedEntries: [],
      isVerified: false,
      createdAt: new Date().toISOString().split('T')[0],
      updatedAt: new Date().toISOString().split('T')[0],
    };
    saveWikiEntry(entry);
    setEntries(getWikiEntries());

    // Index for RAG (fire and forget)
    try {
      await indexWikiEntry(entry.id, entry.title, entry.content);
    } catch (err) {
      console.warn('RAG indexing failed (local storage still saved):', err);
    }

    setNewEntry({ title: '', content: '', category: 'Statutes' });
    setIsCreating(false);
  };

  const handleCourtListenerSearch = async () => {
    if (!courtListenerQuery.trim()) return;
    setCLLoading(true);
    try {
      const res = await fetch(`${FUNCTIONS_BASE}/searchCaseLaw`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ query: courtListenerQuery, pageSize: 10 }),
      });
      const data = await res.json();
      setCLResults(data.results || []);
    } catch (err) {
      console.error('CourtListener search failed:', err);
      setCLResults([]);
    }
    setCLLoading(false);
  };

  const handleImportFromCL = async (result: any) => {
    const title = result.caseName || result.case_name || 'Imported Case';
    const slug = title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '').slice(0, 80);
    const content = `# ${title}\n\n**Citation**: ${result.citation || result.citations?.[0] || 'N/A'}\n**Court**: ${result.court || result.court_name || 'N/A'}\n**Date**: ${result.dateFiled || result.date_filed || 'N/A'}\n\n## Opinion\n${result.snippet || result.text || result.plain_text || 'Full text not available. Use CourtListener to view the full opinion.'}\n\n---\n*Imported from CourtListener*`;
    const entry: WikiEntry = {
      id: `cl_${Date.now()}`,
      slug,
      title,
      content,
      category: 'Cases',
      lastEditedBy: 'CourtListener Import',
      editHistory: [{ author: 'CourtListener Import', timestamp: new Date().toISOString(), summary: 'Imported from CourtListener' }],
      citations: result.citation ? [result.citation] : [],
      relatedEntries: [],
      isVerified: false,
      createdAt: new Date().toISOString().split('T')[0],
      updatedAt: new Date().toISOString().split('T')[0],
    };
    saveWikiEntry(entry);
    setEntries(getWikiEntries());
    
    // Index for RAG
    try {
      await indexWikiEntry(entry.id, entry.title, entry.content);
    } catch (err) {
      console.warn('RAG indexing failed (local storage still saved):', err);
    }

    setIsImporting(false);
    setCLResults([]);
    setCourtListenerQuery('');
  };

  const handleExport = () => {
    const json = exportWikiJSON();
    const blob = new Blob([json], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url; a.download = `legal-wiki-backup-${new Date().toISOString().split('T')[0]}.json`;
    a.click(); URL.revokeObjectURL(url);
  };

  const handleImportFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (ev) => {
      try {
        importWikiJSON(ev.target?.result as string);
        setEntries(getWikiEntries());
        setShowSettings(false);
      } catch { alert('Invalid JSON file'); }
    };
    reader.readAsText(file);
  };

  const handleReset = () => {
    if (confirm('Reset wiki to defaults? This will remove all custom entries.')) {
      resetWikiToDefaults();
      setEntries(getWikiEntries());
      setShowSettings(false);
    }
  };

  const catIcon = (cat: string) => WIKI_CATEGORIES.find(c => c.id === cat)?.icon || '📝';
  const catName = (cat: string) => WIKI_CATEGORIES.find(c => c.id === cat)?.name || cat;

  return (
    <div className="p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto animate-fade-in">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold text-slate-900 tracking-tight">Legal Wiki</h1>
          <p className="text-slate-400 text-sm mt-1">{entries.length} entries — statutes, cases, procedures & strategies</p>
        </div>
        <div className="flex gap-2 flex-wrap">
          <button onClick={() => setShowSettings(!showSettings)} className="inline-flex items-center gap-1.5 bg-white border border-slate-200 text-slate-600 px-3 py-2 rounded-lg text-sm hover:bg-slate-50" title="Settings">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.65 1.65 0 00.33 1.82l.06.06a2 2 0 01-2.83 2.83l-.06-.06a1.65 1.65 0 00-1.82-.33 1.65 1.65 0 00-1 1.51V21a2 2 0 01-4 0v-.09A1.65 1.65 0 009 19.4a1.65 1.65 0 00-1.82.33l-.06.06a2 2 0 01-2.83-2.83l.06-.06A1.65 1.65 0 004.68 15a1.65 1.65 0 00-1.51-1H3a2 2 0 010-4h.09A1.65 1.65 0 004.6 9a1.65 1.65 0 00-.33-1.82l-.06-.06a2 2 0 012.83-2.83l.06.06A1.65 1.65 0 009 4.68a1.65 1.65 0 001-1.51V3a2 2 0 014 0v.09a1.65 1.65 0 001 1.51 1.65 1.65 0 001.82-.33l.06-.06a2 2 0 012.83 2.83l-.06.06A1.65 1.65 0 0019.4 9a1.65 1.65 0 001.51 1H21a2 2 0 010 4h-.09a1.65 1.65 0 00-1.51 1z"/></svg>
          </button>
          <button onClick={() => setIsImporting(true)} className="inline-flex items-center gap-2 bg-white border border-slate-200 text-slate-700 px-4 py-2 rounded-lg text-sm font-semibold hover:bg-slate-50">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="11" cy="11" r="8"/><path d="M21 21l-4.35-4.35"/></svg>
            Import from CourtListener
          </button>
          <button onClick={() => setIsCreating(true)} className="inline-flex items-center gap-2 bg-navy-900 hover:bg-navy-800 text-white px-4 py-2 rounded-lg text-sm font-semibold">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>
            New Entry
          </button>
        </div>
      </div>

      {/* Settings dropdown */}
      {showSettings && (
        <div className="mb-6 bg-white border border-slate-200 rounded-xl p-4 space-y-3">
          <h3 className="font-semibold text-sm text-slate-700">Wiki Settings</h3>
          <div className="flex gap-2 flex-wrap">
            <button onClick={handleExport} className="px-3 py-1.5 bg-slate-100 text-slate-700 rounded-lg text-sm hover:bg-slate-200">Export JSON Backup</button>
            <button onClick={() => fileInputRef.current?.click()} className="px-3 py-1.5 bg-slate-100 text-slate-700 rounded-lg text-sm hover:bg-slate-200">Import JSON Backup</button>
            <button onClick={handleReset} className="px-3 py-1.5 bg-red-50 text-red-700 rounded-lg text-sm hover:bg-red-100">Reset to Defaults</button>
          </div>
          <input ref={fileInputRef} type="file" accept=".json" onChange={handleImportFile} className="hidden" />
        </div>
      )}

      {/* Search */}
      <div className="mb-6">
        <div className="relative flex gap-2">
          <div className="flex-1 relative">
            <svg className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="11" cy="11" r="8"/><path d="M21 21l-4.35-4.35"/></svg>
            <input type="text" value={searchQuery} onChange={e => setSearchQuery(e.target.value)} placeholder="Search all wiki entries..." className="w-full pl-10 pr-4 py-3 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-navy-500/20 focus:border-navy-300" />
          </div>
          <DictationButton onTranscript={(text) => setSearchQuery(text)} size="md" />
        </div>
      </div>

      {/* Categories */}
      <div className="flex gap-2 mb-6 overflow-x-auto pb-2">
        <button onClick={() => setActiveCategory('all')} className={`px-4 py-2 rounded-lg text-sm font-semibold whitespace-nowrap ${activeCategory === 'all' ? 'bg-navy-900 text-white' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'}`}>
          All ({entries.length})
        </button>
        {WIKI_CATEGORIES.map(cat => {
          const count = entries.filter(e => e.category === cat.id).length;
          return (
            <button key={cat.id} onClick={() => setActiveCategory(cat.id)} className={`px-4 py-2 rounded-lg text-sm font-semibold whitespace-nowrap flex items-center gap-2 ${activeCategory === cat.id ? 'bg-navy-900 text-white' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'}`}>
              <span>{cat.icon}</span> {cat.name} ({count})
            </button>
          );
        })}
      </div>

      {/* Entries Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filtered.map(entry => (
          <Link key={entry.id} href={`/dashboard/wiki/${entry.slug}`} className="bg-white border border-slate-200 rounded-xl p-5 hover:shadow-lg hover:border-navy-200 transition-all block">
            <div className="flex items-start justify-between mb-3">
              <span className="text-2xl">{catIcon(entry.category)}</span>
              <div className="flex items-center gap-1.5">
                {entry.isVerified && (
                  <span className="text-[10px] bg-emerald-100 text-emerald-700 px-2 py-0.5 rounded-full font-semibold flex items-center gap-1">
                    <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3"><polyline points="20 6 9 17 4 12"/></svg>
                    Verified
                  </span>
                )}
                {!entry.isVerified && (
                  <span className="text-[10px] bg-amber-100 text-amber-700 px-2 py-0.5 rounded-full font-semibold">Community</span>
                )}
              </div>
            </div>
            <h3 className="font-semibold text-slate-800 mb-2 line-clamp-2 text-sm">{entry.title}</h3>
            <p className="text-xs text-slate-500 line-clamp-3">{entry.content.replace(/[#*`\[\]|>-]/g, '').slice(0, 200)}</p>
            <div className="mt-4 flex items-center justify-between text-xs text-slate-400">
              <span>{entry.updatedAt}</span>
              <div className="flex items-center gap-2">
                {entry.citations.length > 0 && (
                  <span className="bg-slate-100 px-2 py-0.5 rounded">{entry.citations.length} citations</span>
                )}
                <span className="bg-slate-100 px-2 py-0.5 rounded">{catName(entry.category)}</span>
              </div>
            </div>
          </Link>
        ))}
      </div>

      {filtered.length === 0 && (
        <div className="text-center py-16">
          <div className="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#94a3b8" strokeWidth="1.5"><path d="M4 19.5A2.5 2.5 0 016.5 17H20"/><path d="M6.5 2H20v20H6.5A2.5 2.5 0 014 19.5v-15A2.5 2.5 0 016.5 2z"/></svg>
          </div>
          <p className="text-slate-500 font-medium">No entries found</p>
          <p className="text-sm text-slate-400 mt-1">Try a different search or category</p>
        </div>
      )}

      {/* Create Entry Modal */}
      {isCreating && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4" onClick={e => { if (e.target === e.currentTarget) setIsCreating(false); }}>
          <div className="bg-white rounded-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b border-slate-100">
              <h2 className="text-xl font-bold text-slate-900">New Wiki Entry</h2>
              <p className="text-sm text-slate-400 mt-1">Add knowledge for all attorneys to use</p>
            </div>
            <div className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-2">Title</label>
                <input type="text" value={newEntry.title} onChange={e => setNewEntry({ ...newEntry, title: e.target.value })} placeholder="e.g., CPL § 710.20 — Motion to Suppress" className="w-full px-4 py-3 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-navy-500/20" />
              </div>
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-2">Category</label>
                <select value={newEntry.category} onChange={e => setNewEntry({ ...newEntry, category: e.target.value as WikiEntry['category'] })} className="w-full px-4 py-3 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-navy-500/20">
                  {WIKI_CATEGORIES.map(cat => <option key={cat.id} value={cat.id}>{cat.icon} {cat.name}</option>)}
                </select>
              </div>
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-2">Content (Markdown supported)</label>
                <div className="relative">
                  <textarea value={newEntry.content} onChange={e => setNewEntry({ ...newEntry, content: e.target.value })} placeholder="Enter legal content, case summaries, strategies..." rows={12} className="w-full px-4 py-3 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-navy-500/20 font-mono text-sm" />
                  <div className="absolute bottom-3 right-3">
                    <DictationButton onTranscript={(text) => setNewEntry(prev => ({ ...prev, content: prev.content ? prev.content + ' ' + text : text }))} size="sm" />
                  </div>
                </div>
              </div>
            </div>
            <div className="p-6 border-t border-slate-100 flex justify-end gap-3">
              <button onClick={() => setIsCreating(false)} className="px-4 py-2 text-slate-600 hover:text-slate-800">Cancel</button>
              <button onClick={handleCreate} disabled={!newEntry.title || !newEntry.content} className="px-6 py-2 bg-navy-900 text-white rounded-lg font-semibold disabled:opacity-50">Create Entry</button>
            </div>
          </div>
        </div>
      )}

      {/* CourtListener Import Modal */}
      {isImporting && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4" onClick={e => { if (e.target === e.currentTarget) { setIsImporting(false); setCLResults([]); } }}>
          <div className="bg-white rounded-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b border-slate-100">
              <h2 className="text-xl font-bold text-slate-900">Import from CourtListener</h2>
              <p className="text-sm text-slate-400 mt-1">Search and import case law directly into the wiki</p>
            </div>
            <div className="p-6 space-y-4">
              <div className="flex gap-2">
                <input type="text" value={courtListenerQuery} onChange={e => setCourtListenerQuery(e.target.value)} onKeyDown={e => e.key === 'Enter' && handleCourtListenerSearch()} placeholder="Search case law (e.g., People v. De Bour)" className="flex-1 px-4 py-3 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-navy-500/20" />
                <button onClick={handleCourtListenerSearch} disabled={clLoading || !courtListenerQuery.trim()} className="px-6 py-3 bg-navy-900 text-white rounded-lg font-semibold disabled:opacity-50 flex items-center gap-2">
                  {clLoading ? <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" /> : <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="11" cy="11" r="8"/><path d="M21 21l-4.35-4.35"/></svg>}
                  Search
                </button>
              </div>
              {clResults.length > 0 && (
                <div className="space-y-3">
                  <h3 className="font-semibold text-slate-700 text-sm">Results ({clResults.length})</h3>
                  {clResults.map((r, i) => (
                    <div key={i} className="border border-slate-200 rounded-lg p-4">
                      <div className="flex items-start justify-between gap-3 mb-2">
                        <h4 className="font-semibold text-slate-800 text-sm">{r.caseName || r.case_name || 'Unknown Case'}</h4>
                        <button onClick={() => handleImportFromCL(r)} className="text-xs bg-navy-100 text-navy-800 px-3 py-1 rounded-lg font-semibold hover:bg-navy-200 whitespace-nowrap">Import</button>
                      </div>
                      <p className="text-xs text-slate-500">{r.court || r.court_name} — {r.dateFiled || r.date_filed}</p>
                      {r.snippet && <p className="text-xs text-slate-600 mt-2 line-clamp-3">{r.snippet}</p>}
                    </div>
                  ))}
                </div>
              )}
              {clResults.length === 0 && !clLoading && courtListenerQuery && (
                <p className="text-center text-slate-400 text-sm py-8">No results found. Try a different search.</p>
              )}
            </div>
            <div className="p-6 border-t border-slate-100 flex justify-end">
              <button onClick={() => { setIsImporting(false); setCLResults([]); }} className="px-4 py-2 text-slate-600 hover:text-slate-800">Close</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
