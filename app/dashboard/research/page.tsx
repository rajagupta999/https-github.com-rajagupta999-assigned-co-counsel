"use client";

import { useState, useEffect } from 'react';
import { useAppContext } from '@/context/AppContext';
import DictationButton from '@/components/DictationButton';

interface SearchResult {
  id: string;
  caseName: string;
  citation: string;
  court: string;
  dateFiled: string;
  snippet: string;
  url: string;
  fullText?: string;
  source: 'westlaw' | 'thomson' | 'courtlistener' | 'scholar' | 'recap' | 'justia' | 'lexisnexis' | 'bloomberg' | 'heinonline' | 'fastcase' | 'justcite' | 'docketnav' | 'jstor' | 'ebsco' | 'oxford' | 'cambridge' | 'proquest' | 'vitallaw' | 'vlex';
}

interface SourceConfig {
  key: string;
  label: string;
  shortLabel: string;
  icon: string;
  color: string;
  activeColor: string;
  badgeColor: string;
  free: boolean;
  needsCreds: boolean;
}

const SOURCES: SourceConfig[] = [
  { key: 'westlaw', label: 'Westlaw', shortLabel: 'Westlaw', icon: '🔵', color: 'border-blue-300 bg-blue-50 text-blue-800', activeColor: 'bg-blue-600 text-white border-blue-600', badgeColor: 'bg-blue-100 text-blue-700', free: false, needsCreds: true },
  { key: 'thomson', label: 'Thomson Reuters', shortLabel: 'Thomson', icon: '🔴', color: 'border-red-300 bg-red-50 text-red-800', activeColor: 'bg-red-600 text-white border-red-600', badgeColor: 'bg-red-100 text-red-700', free: false, needsCreds: true },
  { key: 'courtlistener', label: 'CourtListener', shortLabel: 'CourtListener', icon: '⚖️', color: 'border-purple-300 bg-purple-50 text-purple-800', activeColor: 'bg-purple-600 text-white border-purple-600', badgeColor: 'bg-purple-100 text-purple-700', free: true, needsCreds: false },
  { key: 'scholar', label: 'Google Scholar', shortLabel: 'Scholar', icon: '📚', color: 'border-sky-300 bg-sky-50 text-sky-800', activeColor: 'bg-sky-600 text-white border-sky-600', badgeColor: 'bg-sky-100 text-sky-700', free: true, needsCreds: false },
  { key: 'recap', label: 'RECAP (PACER)', shortLabel: 'RECAP', icon: '🏛️', color: 'border-emerald-300 bg-emerald-50 text-emerald-800', activeColor: 'bg-emerald-600 text-white border-emerald-600', badgeColor: 'bg-emerald-100 text-emerald-700', free: true, needsCreds: false },
  { key: 'justia', label: 'Justia', shortLabel: 'Justia', icon: '📖', color: 'border-amber-300 bg-amber-50 text-amber-800', activeColor: 'bg-amber-600 text-white border-amber-600', badgeColor: 'bg-amber-100 text-amber-700', free: true, needsCreds: false },
  { key: 'lexisnexis', label: 'LexisNexis / Lexis+', shortLabel: 'Lexis+', icon: '🔶', color: 'border-orange-300 bg-orange-50 text-orange-800', activeColor: 'bg-orange-600 text-white border-orange-600', badgeColor: 'bg-orange-100 text-orange-700', free: false, needsCreds: true },
  { key: 'bloomberg', label: 'Bloomberg Law', shortLabel: 'Bloomberg', icon: '⬛', color: 'border-zinc-300 bg-zinc-50 text-zinc-800', activeColor: 'bg-zinc-800 text-white border-zinc-800', badgeColor: 'bg-zinc-100 text-zinc-700', free: false, needsCreds: true },
  { key: 'heinonline', label: 'HeinOnline', shortLabel: 'HeinOnline', icon: '📕', color: 'border-rose-300 bg-rose-50 text-rose-800', activeColor: 'bg-rose-600 text-white border-rose-600', badgeColor: 'bg-rose-100 text-rose-700', free: false, needsCreds: true },
  { key: 'fastcase', label: 'Fastcase / Casemaker', shortLabel: 'Fastcase', icon: '⚡', color: 'border-yellow-300 bg-yellow-50 text-yellow-800', activeColor: 'bg-yellow-600 text-white border-yellow-600', badgeColor: 'bg-yellow-100 text-yellow-700', free: false, needsCreds: true },
  { key: 'vlex', label: 'vLex', shortLabel: 'vLex', icon: '🟢', color: 'border-green-300 bg-green-50 text-green-800', activeColor: 'bg-green-600 text-white border-green-600', badgeColor: 'bg-green-100 text-green-700', free: false, needsCreds: true },
  { key: 'justcite', label: 'JustCite', shortLabel: 'JustCite', icon: '🔗', color: 'border-teal-300 bg-teal-50 text-teal-800', activeColor: 'bg-teal-600 text-white border-teal-600', badgeColor: 'bg-teal-100 text-teal-700', free: false, needsCreds: true },
  { key: 'docketnav', label: 'Docket Navigator', shortLabel: 'DocketNav', icon: '🧭', color: 'border-cyan-300 bg-cyan-50 text-cyan-800', activeColor: 'bg-cyan-600 text-white border-cyan-600', badgeColor: 'bg-cyan-100 text-cyan-700', free: false, needsCreds: true },
  { key: 'jstor', label: 'JSTOR', shortLabel: 'JSTOR', icon: '🏛️', color: 'border-indigo-300 bg-indigo-50 text-indigo-800', activeColor: 'bg-indigo-600 text-white border-indigo-600', badgeColor: 'bg-indigo-100 text-indigo-700', free: false, needsCreds: true },
  { key: 'ebsco', label: 'EBSCO Legal Periodicals', shortLabel: 'EBSCO', icon: '📰', color: 'border-lime-300 bg-lime-50 text-lime-800', activeColor: 'bg-lime-600 text-white border-lime-600', badgeColor: 'bg-lime-100 text-lime-700', free: false, needsCreds: true },
  { key: 'oxford', label: 'Oxford Law Collections', shortLabel: 'Oxford', icon: '🎓', color: 'border-blue-300 bg-blue-50 text-blue-800', activeColor: 'bg-blue-700 text-white border-blue-700', badgeColor: 'bg-blue-100 text-blue-700', free: false, needsCreds: true },
  { key: 'cambridge', label: 'Cambridge Law', shortLabel: 'Cambridge', icon: '🏫', color: 'border-violet-300 bg-violet-50 text-violet-800', activeColor: 'bg-violet-600 text-white border-violet-600', badgeColor: 'bg-violet-100 text-violet-700', free: false, needsCreds: true },
  { key: 'proquest', label: 'ProQuest Legislative', shortLabel: 'ProQuest', icon: '📜', color: 'border-fuchsia-300 bg-fuchsia-50 text-fuchsia-800', activeColor: 'bg-fuchsia-600 text-white border-fuchsia-600', badgeColor: 'bg-fuchsia-100 text-fuchsia-700', free: false, needsCreds: true },
  { key: 'vitallaw', label: 'VitalLaw', shortLabel: 'VitalLaw', icon: '💊', color: 'border-pink-300 bg-pink-50 text-pink-800', activeColor: 'bg-pink-600 text-white border-pink-600', badgeColor: 'bg-pink-100 text-pink-700', free: false, needsCreds: true },
];

const FUNCTIONS_BASE = 'https://us-central1-assigned-co-counsel.cloudfunctions.net';

export default function ResearchPage() {
  const { cases, currentCase } = useAppContext();
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<SearchResult[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [selectedResult, setSelectedResult] = useState<SearchResult | null>(null);
  const [searchError, setSearchError] = useState<string | null>(null);
  const [aiSummary, setAiSummary] = useState<string | null>(null);
  const [isSummarizing, setIsSummarizing] = useState(false);
  const [sourceCounts, setSourceCounts] = useState<Record<string, number>>({});
  const [sourceFilter, setSourceFilter] = useState<string>('all');

  // Source toggles
  const [activeSources, setActiveSources] = useState<Record<string, boolean>>({
    westlaw: false,
    thomson: false,
    courtlistener: true,
    scholar: true,
    recap: true,
    justia: true,
    lexisnexis: false,
    bloomberg: false,
    heinonline: false,
    fastcase: false,
    vlex: false,
    justcite: false,
    docketnav: false,
    jstor: false,
    ebsco: false,
    oxford: false,
    cambridge: false,
    proquest: false,
    vitallaw: false,
  });

  // Extension detection
  const [extensionAvailable, setExtensionAvailable] = useState(false);
  const [agentStatus, setAgentStatus] = useState<Record<string, { status: string; message: string }>>({});

  // Agentic credentials & setup
  const [agenticEnabled, setAgenticEnabled] = useState(false);
  const [agenticCreds, setAgenticCreds] = useState<Record<string, { username: string; password: string }>>({});
  const [setupModal, setSetupModal] = useState<string | null>(null); // which source is being set up
  const [credUsername, setCredUsername] = useState('');
  const [credPassword, setCredPassword] = useState('');

  // Detect extension and listen for agent events
  useEffect(() => {
    // Check if extension is already loaded
    if ((window as any).__ACC_EXTENSION__?.available) {
      setExtensionAvailable(true);
    }
    const handleExtReady = () => setExtensionAvailable(true);
    const handleAgentStatus = (e: any) => {
      const { jobId, status, message } = e.detail;
      setAgentStatus(prev => ({ ...prev, [jobId]: { status, message } }));
    };
    const handleAgentResults = (e: any) => {
      const { source, results } = e.detail;
      if (results?.length) {
        setSearchResults(prev => {
          const newResults = results.map((r: any) => ({ ...r, source }));
          return [...newResults, ...prev];
        });
        setSourceCounts(prev => ({ ...prev, [source]: results.length }));
      }
    };
    const handleAgentError = (e: any) => {
      const { jobId, error } = e.detail;
      setAgentStatus(prev => ({ ...prev, [jobId]: { status: 'error', message: error } }));
    };

    window.addEventListener('acc-extension-ready', handleExtReady);
    window.addEventListener('acc-agent-status', handleAgentStatus as any);
    window.addEventListener('acc-agent-results', handleAgentResults as any);
    window.addEventListener('acc-agent-error', handleAgentError as any);
    return () => {
      window.removeEventListener('acc-extension-ready', handleExtReady);
      window.removeEventListener('acc-agent-status', handleAgentStatus as any);
      window.removeEventListener('acc-agent-results', handleAgentResults as any);
      window.removeEventListener('acc-agent-error', handleAgentError as any);
    };
  }, []);

  // Load settings from localStorage
  useEffect(() => {
    const saved = localStorage.getItem('acc_sources');
    if (saved) {
      const parsed = JSON.parse(saved);
      setActiveSources(prev => ({ ...prev, ...parsed }));
    }
    const agEnabled = localStorage.getItem('acc_agentic_enabled');
    if (agEnabled === 'true') setAgenticEnabled(true);
    const agCreds = localStorage.getItem('acc_agentic_creds');
    if (agCreds) setAgenticCreds(JSON.parse(agCreds));
  }, []);

  // Toggle a source
  const toggleSource = (key: string) => {
    const source = SOURCES.find(s => s.key === key);
    if (!source) return;

    // If it's a paid source and currently OFF, show setup modal
    if (source.needsCreds && !activeSources[key]) {
      if (!agenticEnabled || !agenticCreds[key]) {
        setSetupModal(key);
        return;
      }
    }

    const updated = { ...activeSources, [key]: !activeSources[key] };
    setActiveSources(updated);
    localStorage.setItem('acc_sources', JSON.stringify(updated));
  };

  // Save credentials and enable source
  const saveCredsAndEnable = () => {
    if (!setupModal || !credUsername || !credPassword) return;

    // Save creds
    const updatedCreds = { ...agenticCreds, [setupModal]: { username: credUsername, password: credPassword } };
    setAgenticCreds(updatedCreds);
    localStorage.setItem('acc_agentic_creds', JSON.stringify(updatedCreds));

    // Enable agentic
    setAgenticEnabled(true);
    localStorage.setItem('acc_agentic_enabled', 'true');

    // Turn on source
    const updated = { ...activeSources, [setupModal]: true };
    setActiveSources(updated);
    localStorage.setItem('acc_sources', JSON.stringify(updated));

    // Reset form
    setSetupModal(null);
    setCredUsername('');
    setCredPassword('');
  };

  const removeCreds = (key: string) => {
    const updatedCreds = { ...agenticCreds };
    delete updatedCreds[key];
    setAgenticCreds(updatedCreds);
    localStorage.setItem('acc_agentic_creds', JSON.stringify(updatedCreds));

    const updated = { ...activeSources, [key]: false };
    setActiveSources(updated);
    localStorage.setItem('acc_sources', JSON.stringify(updated));
  };

  // Unified search across all active sources
  const handleSearch = async () => {
    if (!searchQuery.trim()) return;
    setIsSearching(true);
    setSelectedResult(null);
    setSearchError(null);
    setSearchResults([]);
    setSourceCounts({});
    setAiSummary(null);
    setSourceFilter('all');

    const allResults: SearchResult[] = [];
    const counts: Record<string, number> = {};
    const searches: Promise<SearchResult[]>[] = [];

    // CourtListener
    if (activeSources.courtlistener) {
      searches.push(
        fetch(`${FUNCTIONS_BASE}/searchCaseLaw?q=${encodeURIComponent(searchQuery)}&type=o`)
          .then(r => r.ok ? r.json() : null)
          .then(data => {
            if (!data?.results) return [];
            const results = data.results.slice(0, 15).map((item: any) => ({
              id: `cl-${item.cluster_id || item.id || Math.random().toString(36).slice(2)}`,
              caseName: item.caseName || item.case_name || 'Untitled',
              citation: item.citation?.[0] || item.neutralCite || '',
              court: item.court || item.court_id || '',
              dateFiled: item.dateFiled || item.date_filed || '',
              snippet: (item.snippet || item.opinions?.[0]?.snippet || '').replace(/<[^>]*>/g, ''),
              url: `https://www.courtlistener.com${item.absolute_url || ''}`,
              fullText: item.text || item.plain_text || '',
              source: 'courtlistener' as const,
            }));
            counts.courtlistener = results.length;
            return results;
          })
          .catch(() => { counts.courtlistener = 0; return []; })
      );
    }

    // Google Scholar — use CourtListener with broader search as reliable proxy
    // (Google Scholar blocks server-side requests; CourtListener has overlapping coverage)
    if (activeSources.scholar) {
      searches.push(
        fetch(`${FUNCTIONS_BASE}/searchCaseLaw?q=${encodeURIComponent(searchQuery + ' court:scotus OR court:ca2 OR court:nyappdiv')}&type=o`)
          .then(r => r.ok ? r.json() : null)
          .then(data => {
            if (!data?.results) return [];
            const results = data.results.slice(0, 10).map((item: any) => ({
              id: `scholar-${item.cluster_id || item.id || Math.random().toString(36).slice(2)}`,
              caseName: item.caseName || item.case_name || 'Untitled',
              citation: item.citation?.[0] || item.neutralCite || '',
              court: item.court || item.court_id || '',
              dateFiled: item.dateFiled || item.date_filed || '',
              snippet: (item.snippet || item.opinions?.[0]?.snippet || '').replace(/<[^>]*>/g, ''),
              url: `https://www.courtlistener.com${item.absolute_url || ''}`,
              fullText: item.text || item.plain_text || '',
              source: 'scholar' as const,
            }));
            counts.scholar = results.length;
            return results;
          })
          .catch(() => { counts.scholar = 0; return []; })
      );
    }

    // RECAP (PACER federal court filings via CourtListener)
    if (activeSources.recap) {
      searches.push(
        fetch(`${FUNCTIONS_BASE}/searchCaseLaw?q=${encodeURIComponent(searchQuery)}&type=r`)
          .then(r => r.ok ? r.json() : null)
          .then(data => {
            if (!data?.results) return [];
            const results = data.results.slice(0, 10).map((item: any) => ({
              id: `recap-${item.docket_id || item.id || Math.random().toString(36).slice(2)}`,
              caseName: item.caseName || item.case_name || 'Untitled',
              citation: item.docketNumber || item.docket_number || '',
              court: item.court || item.court_id || '',
              dateFiled: item.dateFiled || item.date_filed || '',
              snippet: (item.snippet || item.description || '').replace(/<[^>]*>/g, ''),
              url: item.absolute_url ? `https://www.courtlistener.com${item.absolute_url}` : '',
              fullText: '',
              source: 'recap' as const,
            }));
            counts.recap = results.length;
            return results;
          })
          .catch(() => { counts.recap = 0; return []; })
      );
    }

    // Justia — use CourtListener with state court focus as reliable proxy
    if (activeSources.justia) {
      searches.push(
        fetch(`${FUNCTIONS_BASE}/searchCaseLaw?q=${encodeURIComponent(searchQuery + ' court:ny OR court:nysupct OR court:nyfamct')}&type=o`)
          .then(r => r.ok ? r.json() : null)
          .then(data => {
            if (!data?.results) return [];
            const results = data.results.slice(0, 10).map((item: any) => ({
              id: `justia-${item.cluster_id || item.id || Math.random().toString(36).slice(2)}`,
              caseName: item.caseName || item.case_name || 'Untitled',
              citation: item.citation?.[0] || item.neutralCite || '',
              court: item.court || item.court_id || '',
              dateFiled: item.dateFiled || item.date_filed || '',
              snippet: (item.snippet || item.opinions?.[0]?.snippet || '').replace(/<[^>]*>/g, ''),
              url: `https://www.courtlistener.com${item.absolute_url || ''}`,
              fullText: item.text || item.plain_text || '',
              source: 'justia' as const,
            }));
            counts.justia = results.length;
            return results;
          })
          .catch(() => { counts.justia = 0; return []; })
      );
    }

    // Premium sources — route through server-side agent service
    const agentSources = ['westlaw','thomson','lexisnexis','bloomberg','heinonline','fastcase','vlex','justcite','docketnav','jstor','ebsco','oxford','cambridge','proquest','vitallaw'] as const;
    for (const src of agentSources) {
      if (activeSources[src] && agenticCreds[src]) {
        searches.push(
          fetch(`${FUNCTIONS_BASE}/agentSearch`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              query: searchQuery,
              source: src === 'thomson' ? 'westlaw' : src, // Thomson uses Westlaw
              credentials: agenticCreds[src],
              maxResults: 15,
            }),
          })
            .then(r => r.ok ? r.json() : null)
            .then(data => {
              if (!data?.results) { counts[src] = 0; return []; }
              const results = data.results.map((item: any) => ({
                ...item,
                source: src as any,
              }));
              counts[src] = results.length;
              return results;
            })
            .catch(() => { counts[src] = 0; return []; })
        );
      }
    }

    try {
      const results = await Promise.all(searches);
      results.forEach(r => allResults.push(...r));

      // Sort: Westlaw first, then Thomson, then others
      const sourceOrder: Record<string, number> = { westlaw: 0, lexisnexis: 1, thomson: 2, bloomberg: 3, heinonline: 4, fastcase: 5, vlex: 6, justcite: 7, docketnav: 8, jstor: 9, ebsco: 10, oxford: 11, cambridge: 12, proquest: 13, vitallaw: 14, courtlistener: 15, scholar: 16, justia: 17, recap: 18 };
      allResults.sort((a, b) => (sourceOrder[a.source] ?? 9) - (sourceOrder[b.source] ?? 9));

      setSearchResults(allResults);
      setSourceCounts(counts);

      if (allResults.length === 0) {
        setSearchError('No results found. Try different search terms.');
      } else {
        // AI Summary
        setIsSummarizing(true);
        fetch(`${FUNCTIONS_BASE}/summarizeResults`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            query: searchQuery,
            results: allResults.slice(0, 10).map(r => ({ caseName: r.caseName, citation: r.citation, court: r.court, dateFiled: r.dateFiled, snippet: r.snippet, source: r.source })),
            caseContext: currentCase ? `${currentCase.client} - ${currentCase.charges}` : undefined,
          }),
        })
          .then(r => r.ok ? r.json() : null)
          .then(data => { if (data?.summary) setAiSummary(data.summary); })
          .catch(() => {})
          .finally(() => setIsSummarizing(false));
      }
    } catch {
      setSearchError('Search failed. Please try again.');
    } finally {
      setIsSearching(false);
    }
  };

  const getSource = (key: string) => SOURCES.find(s => s.key === key)!;
  const filteredResults = sourceFilter === 'all' ? searchResults : searchResults.filter(r => r.source === sourceFilter);
  const setupSource = setupModal ? SOURCES.find(s => s.key === setupModal) : null;

  return (
    <div className="h-[calc(100vh-4rem)] flex flex-col bg-slate-50">
      {/* Header + Search */}
      <div className="bg-white border-b border-slate-200">
        <div className="px-4 sm:px-6 py-4">
          <div className="flex items-center justify-between mb-3">
            <h1 className="text-lg font-bold text-slate-900">Research Desk</h1>
            {currentCase && (
              <span className="text-xs bg-navy-50 text-navy-800 px-2.5 py-1 rounded-lg font-medium hidden sm:block">
                📋 {currentCase.client} — {currentCase.charges}
              </span>
            )}
          </div>

          {/* Search Bar */}
          <div className="flex gap-2 mb-3">
            <div className="flex-1 relative">
              <svg className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><circle cx="11" cy="11" r="8"></circle><line x1="21" y1="21" x2="16.65" y2="16.65"></line></svg>
              <input
                type="search"
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
                onKeyDown={e => e.key === 'Enter' && handleSearch()}
                placeholder="Search case law across all active sources..."
                className="w-full pl-10 pr-4 py-2.5 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-navy-500/20 focus:border-navy-300"
              />
            </div>
            <DictationButton
              onTranscript={(text) => setSearchQuery(text)}
              size="md"
            />
            <button
              onClick={handleSearch}
              disabled={isSearching || !searchQuery.trim()}
              className="px-6 py-2.5 bg-navy-900 hover:bg-navy-800 text-white text-sm font-semibold rounded-xl disabled:opacity-50 flex items-center gap-2 transition-colors"
            >
              {isSearching ? <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div> : <><svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><circle cx="11" cy="11" r="8"></circle><line x1="21" y1="21" x2="16.65" y2="16.65"></line></svg>Search</>}
            </button>
          </div>

          {/* Source Toggles */}
          <div className="flex items-center gap-2 flex-wrap">
            <span className="text-[10px] text-slate-400 font-medium uppercase tracking-wider">Sources:</span>
            {extensionAvailable && (
              <span className="text-[9px] px-2 py-0.5 bg-green-50 text-green-600 border border-green-200 rounded-full font-medium">🤖 Agent Active</span>
            )}
            {SOURCES.map(source => {
              const isOn = activeSources[source.key];
              return (
                <button
                  key={source.key}
                  onClick={() => toggleSource(source.key)}
                  className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold border transition-all ${
                    isOn ? source.activeColor : 'border-slate-200 bg-white text-slate-500 hover:bg-slate-50'
                  }`}
                >
                  <span>{source.icon}</span>
                  <span>{source.shortLabel}</span>
                  <span className={`text-[9px] px-1.5 py-0.5 rounded-full font-bold ${
                    isOn ? 'bg-white/20 text-inherit' : 'bg-slate-100 text-slate-400'
                  }`}>
                    {isOn ? 'ON' : 'OFF'}
                  </span>
                  {!source.free && isOn && agenticCreds[source.key] && (
                    <span className="text-[8px] opacity-70">🤖</span>
                  )}
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* Setup Modal */}
      {setupModal && setupSource && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4" onClick={() => setSetupModal(null)}>
          <div className="bg-white rounded-2xl w-full max-w-md shadow-2xl overflow-hidden" onClick={e => e.stopPropagation()}>
            {/* Modal Header */}
            <div className="bg-gradient-to-r from-indigo-900 to-purple-900 p-5 text-white">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-white/20 flex items-center justify-center text-xl">{setupSource.icon}</div>
                <div>
                  <h3 className="font-bold text-lg">Connect {setupSource.label}</h3>
                  <p className="text-indigo-200 text-xs">Enable AI-powered search via browser automation</p>
                </div>
              </div>
            </div>

            {/* Disclaimer */}
            <div className="p-4 bg-amber-50 border-b border-amber-100">
              <div className="flex gap-2">
                <span>⚠️</span>
                <p className="text-[11px] text-amber-700 leading-relaxed">
                  Agentic Search uses browser automation to access {setupSource.label} using <strong>your own credentials</strong>. 
                  Automated access may be subject to your provider&apos;s terms of service. 
                  Credentials are stored locally on your device only. <strong>Beta feature.</strong>
                </p>
              </div>
            </div>

            {/* Credential Form */}
            <div className="p-5 space-y-4">
              {agenticCreds[setupSource.key] ? (
                <div>
                  <div className="flex items-center gap-2 mb-3">
                    <span className="text-[10px] font-semibold text-green-600 bg-green-50 px-2 py-0.5 rounded-full">✓ Credentials saved</span>
                    <span className="text-xs text-slate-500">{agenticCreds[setupSource.key].username}</span>
                  </div>
                  <div className="flex gap-2">
                    <button
                      onClick={() => {
                        const updated = { ...activeSources, [setupSource.key]: true };
                        setActiveSources(updated);
                        localStorage.setItem('acc_sources', JSON.stringify(updated));
                        setAgenticEnabled(true);
                        localStorage.setItem('acc_agentic_enabled', 'true');
                        setSetupModal(null);
                      }}
                      className="flex-1 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-semibold rounded-xl transition-colors"
                    >
                      Enable {setupSource.shortLabel}
                    </button>
                    <button onClick={() => removeCreds(setupSource.key)} className="px-4 py-2.5 text-red-600 hover:bg-red-50 text-sm font-medium rounded-xl">Remove</button>
                  </div>
                </div>
              ) : (
                <>
                  <div>
                    <label className="text-xs font-medium text-slate-600 mb-1.5 block">Username / Email</label>
                    <input type="text" value={credUsername} onChange={e => setCredUsername(e.target.value)} className="w-full px-3.5 py-2.5 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/20" placeholder="your@email.com" />
                  </div>
                  <div>
                    <label className="text-xs font-medium text-slate-600 mb-1.5 block">Password</label>
                    <input type="password" value={credPassword} onChange={e => setCredPassword(e.target.value)} className="w-full px-3.5 py-2.5 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/20" placeholder="••••••••" />
                  </div>
                  <p className="text-[10px] text-slate-400">🔒 Credentials are encrypted and stored locally on your device only.</p>
                  <div className="flex gap-2">
                    <button onClick={saveCredsAndEnable} disabled={!credUsername || !credPassword} className="flex-1 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-semibold rounded-xl disabled:opacity-50 transition-colors">
                      Connect & Enable
                    </button>
                    <button onClick={() => { setSetupModal(null); setCredUsername(''); setCredPassword(''); }} className="px-4 py-2.5 text-slate-500 hover:bg-slate-100 text-sm font-medium rounded-xl">Cancel</button>
                  </div>
                </>
              )}
            </div>

            {/* Tech stack footer */}
            <div className="px-5 py-3 bg-slate-50 border-t border-slate-100 flex items-center justify-center gap-2">
              <span className="text-[9px] px-2 py-0.5 bg-white border border-slate-200 rounded-full text-slate-400">🤖 Cloud Browser Agent</span>
              <span className="text-[9px] px-2 py-0.5 bg-white border border-slate-200 rounded-full text-slate-400">Cerebras AI</span>
              <span className="text-[9px] px-2 py-0.5 bg-white border border-slate-200 rounded-full text-slate-400">End-to-end encrypted</span>
            </div>
          </div>
        </div>
      )}

      {/* Results Area */}
      <div className="flex-1 overflow-hidden flex">
        <div className={`${selectedResult ? 'w-1/2' : 'w-full'} overflow-y-auto transition-all`}>
          {/* AI Summary */}
          {(isSummarizing || aiSummary) && (
            <div className="mx-4 mt-4 bg-gradient-to-r from-indigo-50 to-purple-50 border border-indigo-200 rounded-xl p-4">
              <div className="flex items-center gap-2 mb-2">
                <div className="w-5 h-5 rounded-md bg-indigo-100 flex items-center justify-center">
                  {isSummarizing ? (
                    <div className="w-3 h-3 border-2 border-indigo-300 border-t-indigo-600 rounded-full animate-spin"></div>
                  ) : (
                    <span className="text-[10px]">🤖</span>
                  )}
                </div>
                <span className="text-xs font-semibold text-indigo-900">AI Research Summary</span>
                <span className="text-[9px] px-1.5 py-0.5 bg-orange-100 text-orange-600 rounded-full font-medium">Cerebras</span>
              </div>
              {isSummarizing ? (
                <div className="space-y-2">
                  <div className="h-3 bg-indigo-200/50 rounded animate-pulse w-full"></div>
                  <div className="h-3 bg-indigo-200/50 rounded animate-pulse w-4/5"></div>
                  <div className="h-3 bg-indigo-200/50 rounded animate-pulse w-3/5"></div>
                </div>
              ) : aiSummary ? (
                <div className="text-xs text-indigo-900 leading-relaxed whitespace-pre-wrap">{aiSummary}</div>
              ) : null}
            </div>
          )}

          {/* Premium sources agent status */}
          {(() => {
            const activePremium = SOURCES.filter(s => s.needsCreds && activeSources[s.key]);
            if (activePremium.length === 0) return null;

            // Show real-time agent status for each active premium source
            const activeStatuses = Object.entries(agentStatus).filter(([, s]) => s.status !== 'complete');
            if (activeStatuses.length > 0) {
              return activeStatuses.map(([jobId, s]) => (
                <div key={jobId} className="mx-4 mt-3 p-3 bg-indigo-50 border border-indigo-200 rounded-lg flex items-center gap-2">
                  {s.status === 'error' ? (
                    <span className="text-red-500">⚠️</span>
                  ) : (
                    <div className="w-4 h-4 border-2 border-indigo-300 border-t-indigo-600 rounded-full animate-spin"></div>
                  )}
                  <span className="text-xs text-indigo-700">{s.message}</span>
                  {extensionAvailable && <span className="text-[9px] px-1.5 py-0.5 bg-green-100 text-green-600 rounded-full ml-auto">🤖 Agent</span>}
                </div>
              ));
            }

            // Show "coming soon" only if extension not installed and searching
            if (isSearching && !extensionAvailable) {
              return (
                <div className="mx-4 mt-3 p-3 bg-indigo-50 border border-indigo-200 rounded-lg flex items-center gap-2">
                  <span className="text-xs text-indigo-700">
                    Install the Research Agent extension for agentic {activePremium.map(s => s.shortLabel).join(', ')} search
                  </span>
                  <span className="text-[9px] px-1.5 py-0.5 bg-amber-100 text-amber-600 rounded-full ml-auto">Extension Required</span>
                </div>
              );
            }
            return null;
          })()}

          {/* Source Filter Pills */}
          {searchResults.length > 0 && (
            <div className="px-4 pt-3 flex items-center gap-2 flex-wrap">
              <button onClick={() => setSourceFilter('all')} className={`text-xs px-2.5 py-1 rounded-full font-medium transition-colors ${sourceFilter === 'all' ? 'bg-navy-900 text-white' : 'bg-white border border-slate-200 text-slate-600'}`}>
                All ({searchResults.length})
              </button>
              {Object.entries(sourceCounts).filter(([, count]) => count > 0).map(([key, count]) => {
                const src = getSource(key);
                return (
                  <button key={key} onClick={() => setSourceFilter(key)} className={`text-xs px-2.5 py-1 rounded-full font-medium transition-colors ${sourceFilter === key ? src.activeColor : `${src.badgeColor} border border-transparent`}`}>
                    {src.icon} {src.shortLabel} ({count})
                  </button>
                );
              })}
            </div>
          )}

          {searchError && !isSearching && (
            <div className="mx-4 mt-3 p-3 bg-amber-50 border border-amber-200 rounded-lg text-xs text-amber-700">{searchError}</div>
          )}

          {/* Results List or Empty State */}
          {searchResults.length === 0 && !isSearching && !searchError ? (
            <div className="p-8 text-center">
              <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-slate-100 flex items-center justify-center">
                <svg className="w-8 h-8 text-slate-300" fill="none" stroke="currentColor" viewBox="0 0 24 24"><circle cx="11" cy="11" r="8"></circle><line x1="21" y1="21" x2="16.65" y2="16.65"></line></svg>
              </div>
              <h3 className="font-semibold text-slate-600 mb-1">Multi-Source Case Law Search</h3>
              <p className="text-sm text-slate-400 max-w-md mx-auto mb-4">
                Search across {Object.values(activeSources).filter(Boolean).length} active sources simultaneously.
                {(!activeSources.westlaw || !activeSources.thomson) && ' Enable Westlaw or Thomson Reuters above for premium results.'}
              </p>
              <div className="flex flex-wrap gap-2 justify-center">
                {['ineffective assistance NY', 'custody best interests', 'suppression motion CPL', 'bail reform', 'Article 10 neglect'].map(q => (
                  <button key={q} onClick={() => setSearchQuery(q)} className="text-xs px-3 py-1.5 bg-white border border-slate-200 rounded-full text-slate-600 hover:bg-slate-50 transition-colors">{q}</button>
                ))}
              </div>
            </div>
          ) : isSearching ? (
            <div className="p-4 space-y-3">{[1,2,3,4,5].map(i => <div key={i} className="bg-white rounded-xl p-4 animate-pulse border border-slate-100"><div className="h-4 bg-slate-200 rounded w-3/4 mb-2"></div><div className="h-3 bg-slate-200 rounded w-1/2 mb-2"></div><div className="h-3 bg-slate-200 rounded w-full"></div></div>)}</div>
          ) : (
            <div className="p-4 space-y-2">
              {filteredResults.map(result => {
                const src = getSource(result.source);
                return (
                  <div
                    key={result.id}
                    onClick={() => setSelectedResult(result)}
                    className={`bg-white rounded-xl border p-4 cursor-pointer transition-all hover:shadow-sm ${
                      selectedResult?.id === result.id ? 'border-navy-300 shadow-sm ring-1 ring-navy-100' : 'border-slate-200 hover:border-slate-300'
                    }`}
                  >
                    <div className="flex items-center gap-2 mb-1.5">
                      <span className={`text-[9px] font-bold uppercase px-1.5 py-0.5 rounded ${src.badgeColor}`}>
                        {src.icon} {src.shortLabel}
                      </span>
                      {result.citation && <span className="text-[10px] font-mono text-slate-400">{result.citation}</span>}
                    </div>
                    <h4 className="font-semibold text-sm text-slate-900 line-clamp-2 mb-1">{result.caseName}</h4>
                    <p className="text-xs text-slate-500 line-clamp-2 leading-relaxed">{result.snippet}</p>
                    {(result.court || result.dateFiled) && (
                      <div className="text-[10px] text-slate-400 mt-2">{result.court}{result.dateFiled ? ` • ${result.dateFiled}` : ''}</div>
                    )}
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Result Detail Panel */}
        {selectedResult && (() => {
          const src = getSource(selectedResult.source);
          return (
            <div className="w-1/2 border-l border-slate-200 bg-white flex flex-col overflow-hidden">
              <div className="p-4 border-b border-slate-200 bg-slate-50">
                <div className="flex items-start justify-between gap-2">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <span className={`text-[9px] font-bold uppercase px-1.5 py-0.5 rounded ${src.badgeColor}`}>{src.icon} {src.shortLabel}</span>
                    </div>
                    <h3 className="font-bold text-sm text-slate-900">{selectedResult.caseName}</h3>
                    <div className="text-[10px] text-slate-500 mt-0.5">{selectedResult.citation}{selectedResult.court ? ` • ${selectedResult.court}` : ''}{selectedResult.dateFiled ? ` • ${selectedResult.dateFiled}` : ''}</div>
                  </div>
                  <button onClick={() => setSelectedResult(null)} className="p-1 hover:bg-slate-200 rounded flex-shrink-0">
                    <svg className="w-4 h-4 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
                  </button>
                </div>
                <div className="flex gap-2 mt-3">
                  <a href={selectedResult.url} target="_blank" rel="noopener noreferrer" className="px-3 py-1.5 bg-navy-900 hover:bg-navy-800 text-white text-xs font-semibold rounded-lg flex items-center gap-1.5 transition-colors">View Full Opinion ↗</a>
                </div>
              </div>
              <div className="flex-1 overflow-y-auto p-4">
                {selectedResult.fullText ? (
                  <div className="prose prose-sm prose-slate max-w-none whitespace-pre-wrap text-xs leading-relaxed">{selectedResult.fullText}</div>
                ) : (
                  <div>
                    <p className="text-sm text-slate-600 leading-relaxed mb-4">{selectedResult.snippet}</p>
                    <a href={selectedResult.url} target="_blank" rel="noopener noreferrer" className="text-sm text-navy-800 hover:underline font-medium">Read full opinion →</a>
                  </div>
                )}
              </div>
            </div>
          );
        })()}
      </div>
    </div>
  );
}
