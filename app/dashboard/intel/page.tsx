"use client";

import { useState, useEffect } from 'react';
import { fetchCourtListenerCases, fetchRSSFeed, extractTopicsFromCases, sortByRelevance, type FeedItem } from '@/lib/legalIntel';
import { useAppContext } from '@/context/AppContext';

interface BarAssociation {
  id: string;
  name: string;
  abbreviation: string;
  url: string;
  memberPortal: string;
  connected: boolean;
}

const barAssociations: BarAssociation[] = [
  {
    id: '1',
    name: 'New York State Bar Association',
    abbreviation: 'NYSBA',
    url: 'https://nysba.org',
    memberPortal: 'https://nysba.org/member-portal',
    connected: false,
  },
  {
    id: '2',
    name: 'NYC Bar - Criminal Justice Section',
    abbreviation: 'NYC Bar',
    url: 'https://nycbar.org/member-and-career-services/committees/criminal-justice-operations-committee',
    memberPortal: 'https://nycbar.org/members',
    connected: false,
  },
  {
    id: '3',
    name: 'National Association for Public Defense',
    abbreviation: 'NAPD',
    url: 'https://publicdefenders.us',
    memberPortal: 'https://publicdefenders.us/members',
    connected: false,
  },
  {
    id: '4',
    name: 'National Association of Criminal Defense Lawyers',
    abbreviation: 'NACDL',
    url: 'https://nacdl.org',
    memberPortal: 'https://nacdl.org/membership',
    connected: false,
  },
  {
    id: '5',
    name: 'NY Family Law American Inn of Court',
    abbreviation: 'FLAIC',
    url: 'https://home.innsofcourt.org',
    memberPortal: 'https://home.innsofcourt.org',
    connected: false,
  },
  {
    id: '6',
    name: 'American Academy of Matrimonial Lawyers - NY',
    abbreviation: 'AAML-NY',
    url: 'https://aaml.org',
    memberPortal: 'https://aaml.org/membership',
    connected: false,
  },
];

const newsOutlets = [
  { name: 'The Marshall Project', icon: '⚖️', url: 'https://themarshallproject.org', category: 'Criminal Justice' },
  { name: 'The Appeal', icon: '📰', url: 'https://theappeal.org', category: 'Criminal Reform' },
  { name: 'Injustice Watch', icon: '🔍', url: 'https://injusticewatch.org', category: 'Courts & Justice' },
  { name: 'The Crime Report', icon: '📋', url: 'https://thecrimereport.org', category: 'Criminal Justice Policy' },
  { name: 'NY Law Journal', icon: '📜', url: 'https://nylj.com', category: 'NY Legal News' },
  { name: 'Law360 - Criminal', icon: '⚡', url: 'https://law360.com/criminal', category: 'Criminal Law' },
];

// Podcasts removed

const lawJournals = [
  { name: 'Criminal Law Bulletin', url: '#', focus: 'Criminal Practice' },
  { name: 'Family Court Review', url: 'https://onlinelibrary.wiley.com/journal/17441617', focus: 'Family Law' },
  { name: 'Journal of Criminal Law', url: '#', focus: 'Criminal Law' },
  { name: 'Champion Magazine (NACDL)', url: 'https://nacdl.org/champion', focus: 'Criminal Defense' },
  { name: 'Family Law Quarterly (ABA)', url: 'https://americanbar.org/groups/family_law', focus: 'Family Law' },
  { name: 'NY Law Journal', url: 'https://nylj.com', focus: 'NY Practice' },
];

export default function LegalIntelPage() {
  const { cases } = useAppContext();
  const [activeTab, setActiveTab] = useState<'feed' | 'sources' | 'bars'>('feed');
  const [feedFilter, setFeedFilter] = useState<string>('all');
  const [connectedBars, setConnectedBars] = useState<Set<string>>(new Set());
  const [selectedItem, setSelectedItem] = useState<FeedItem | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [feedData, setFeedData] = useState<FeedItem[]>([]);
  const [trackedTopics, setTrackedTopics] = useState<string[]>([]);
  const [error, setError] = useState<string | null>(null);

  // Extract topics from user's cases
  const userTopics = extractTopicsFromCases(
    cases.map(c => ({ id: c.id, charges: c.charges, county: c.county }))
  );

  // Fetch real data on mount and when cases change
  useEffect(() => {
    async function loadData() {
      setIsLoading(true);
      setError(null);
      
      try {
        // Build personalized search query
        const searchQuery = userTopics.slice(0, 5).join(' OR ') || 'criminal defense OR family court';
        
        const [caselaw, theAppeal, scotusBlog, nacdl, sentencing, aclu, aboveLaw] = await Promise.all([
          fetchCourtListenerCases(searchQuery, userTopics),
          fetchRSSFeed(
            'https://theappeal.org/feed/',
            'The Appeal',
            'Criminal Reform',
            'article',
            userTopics
          ),
          fetchRSSFeed(
            'https://feeds.feedburner.com/scotusblog/pFXs',
            'SCOTUSblog',
            'Supreme Court',
            'article',
            userTopics
          ),
          fetchRSSFeed(
            'https://www.nacdl.org/rss/',
            'NACDL',
            'Criminal Defense',
            'article',
            userTopics
          ),
          fetchRSSFeed(
            'https://www.sentencingproject.org/feed/',
            'Sentencing Project',
            'Sentencing Reform',
            'article',
            userTopics
          ),
          fetchRSSFeed(
            'https://www.aclu.org/feed',
            'ACLU',
            'Civil Liberties',
            'article',
            userTopics
          ),
          fetchRSSFeed(
            'https://abovethelaw.com/feed/',
            'Above the Law',
            'Legal News',
            'article',
            userTopics
          ),
        ]);
        
        // Combine and sort by relevance
        const allItems = sortByRelevance([...caselaw, ...theAppeal, ...scotusBlog, ...nacdl, ...sentencing, ...aclu, ...aboveLaw]);
        setFeedData(allItems);
        setTrackedTopics(userTopics);
      } catch (err) {
        console.error('Error loading intel:', err);
        setError('Some feeds could not be loaded. Showing available content.');
      } finally {
        setIsLoading(false);
      }
    }
    
    loadData();
  }, [cases.length]); // Re-fetch when cases change

  const filteredFeed = feedFilter === 'all' 
    ? feedData 
    : feedData.filter(item => item.type === feedFilter);

  const handleConnectBar = (barId: string) => {
    setConnectedBars(prev => {
      const next = new Set(prev);
      if (next.has(barId)) {
        next.delete(barId);
      } else {
        next.add(barId);
      }
      return next;
    });
  };

  const getTypeIcon = (type: FeedItem['type']) => {
    switch (type) {
      case 'caselaw': return '⚖️';
      case 'article': return '📰';
      case 'podcast': return '🎙️';
      case 'video': return '📺';
      case 'journal': return '📚';
      default: return '📄';
    }
  };

  const getTypeBadgeColor = (type: FeedItem['type']) => {
    switch (type) {
      case 'caselaw': return 'bg-purple-100 text-purple-700';
      case 'article': return 'bg-blue-100 text-blue-700';
      case 'podcast': return 'bg-orange-100 text-orange-700';
      case 'video': return 'bg-red-100 text-red-700';
      case 'journal': return 'bg-emerald-100 text-emerald-700';
      default: return 'bg-slate-100 text-slate-700';
    }
  };

  return (
    <div className="p-4 sm:p-6 lg:p-8 max-w-[1400px] mx-auto space-y-6 sm:space-y-8 animate-fade-in pb-12">
      
      {/* Content Viewer Modal */}
      {selectedItem && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4" onClick={() => setSelectedItem(null)}>
          <div 
            className="bg-white rounded-2xl max-w-4xl w-full max-h-[90vh] overflow-hidden shadow-2xl"
            onClick={e => e.stopPropagation()}
          >
            {/* Modal Header */}
            <div className="p-4 sm:p-6 border-b border-slate-200 bg-slate-50">
              <div className="flex items-start justify-between gap-4">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-2">
                    <span className={`text-[10px] font-semibold uppercase px-2 py-0.5 rounded ${getTypeBadgeColor(selectedItem.type)}`}>
                      {selectedItem.type}
                    </span>
                    <span className="text-xs text-slate-400">{selectedItem.category}</span>
                    {selectedItem.citation && (
                      <span className="text-xs font-mono text-slate-500">{selectedItem.citation}</span>
                    )}
                  </div>
                  <h2 className="text-lg sm:text-xl font-bold text-slate-900 leading-tight">{selectedItem.title}</h2>
                  <div className="flex items-center gap-2 mt-2 text-sm text-slate-500">
                    <span>{selectedItem.sourceIcon} {selectedItem.source}</span>
                    <span>•</span>
                    <span>{selectedItem.date}</span>
                    {selectedItem.court && (
                      <>
                        <span>•</span>
                        <span>{selectedItem.court}</span>
                      </>
                    )}
                  </div>
                </div>
                <button 
                  onClick={() => setSelectedItem(null)}
                  className="p-2 hover:bg-slate-200 rounded-lg transition-colors"
                >
                  <svg className="w-5 h-5 text-slate-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
            </div>
            
            {/* Modal Content */}
            <div className="p-4 sm:p-6 overflow-y-auto max-h-[60vh]">
              {selectedItem.content ? (
                <div 
                  className="prose prose-slate max-w-none prose-headings:text-slate-900 prose-p:text-slate-600 prose-a:text-blue-600"
                  dangerouslySetInnerHTML={{ __html: selectedItem.content }}
                />
              ) : selectedItem.description ? (
                <p className="text-slate-600 leading-relaxed">{selectedItem.description}</p>
              ) : (
                <p className="text-slate-400 italic">Full content not available. Click below to view on source website.</p>
              )}
            </div>
            
            {/* Modal Footer */}
            <div className="p-4 sm:p-6 border-t border-slate-200 bg-slate-50 flex items-center justify-between gap-4">
              <div className="flex items-center gap-2">
                <button className="px-4 py-2 bg-slate-100 hover:bg-slate-200 rounded-lg text-sm font-medium text-slate-700 transition-colors flex items-center gap-2">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z" />
                  </svg>
                  Save to Case
                </button>
                <button className="px-4 py-2 bg-slate-100 hover:bg-slate-200 rounded-lg text-sm font-medium text-slate-700 transition-colors flex items-center gap-2">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z" />
                  </svg>
                  Share
                </button>
              </div>
              <a
                href={selectedItem.url}
                target="_blank"
                rel="noopener noreferrer"
                className="px-4 py-2 bg-navy-900 hover:bg-navy-800 text-white rounded-lg text-sm font-semibold transition-colors flex items-center gap-2"
              >
                View on {selectedItem.source}
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                </svg>
              </a>
            </div>
          </div>
        </div>
      )}

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold text-slate-900 tracking-tight">Legal Intelligence</h1>
          <p className="text-slate-400 text-sm mt-1">Personalized for your {cases.length} active case{cases.length !== 1 ? 's' : ''}</p>
        </div>
        <div className="flex items-center gap-2">
          <button 
            onClick={() => {
              setIsLoading(true);
              setFeedData([]);
              // Trigger re-fetch
              window.location.reload();
            }}
            className="inline-flex items-center gap-2 bg-white border border-slate-200 hover:bg-slate-50 text-slate-700 px-4 py-2 rounded-lg text-sm font-medium transition-colors"
          >
            <svg className={`w-4 h-4 ${isLoading ? 'animate-spin' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
            </svg>
            Refresh
          </button>
        </div>
      </div>

      {/* Tracking Topics Banner */}
      {trackedTopics.length > 0 && cases.length > 0 && (
        <div className="bg-gradient-to-r from-purple-50 to-indigo-50 border border-purple-100 rounded-xl p-4">
          <div className="flex items-start gap-3">
            <div className="w-8 h-8 rounded-lg bg-purple-100 flex items-center justify-center flex-shrink-0">
              <svg className="w-4 h-4 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
              </svg>
            </div>
            <div className="flex-1">
              <h3 className="font-semibold text-purple-900 text-sm">Personalized for Your Cases</h3>
              <p className="text-purple-700 text-xs mt-0.5 mb-2">
                Tracking topics based on: {cases.slice(0, 3).map(c => c.charges).join(', ')}{cases.length > 3 ? ` +${cases.length - 3} more` : ''}
              </p>
              <div className="flex flex-wrap gap-1.5">
                {trackedTopics.slice(0, 8).map(topic => (
                  <span 
                    key={topic} 
                    className="px-2 py-0.5 bg-white/80 border border-purple-200 rounded text-xs text-purple-700"
                  >
                    {topic}
                  </span>
                ))}
                {trackedTopics.length > 8 && (
                  <span className="px-2 py-0.5 bg-purple-100 rounded text-xs text-purple-600">
                    +{trackedTopics.length - 8} more
                  </span>
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Error Banner */}
      {error && (
        <div className="bg-amber-50 border border-amber-200 rounded-lg p-3 text-sm text-amber-700 flex items-center gap-2">
          <svg className="w-4 h-4 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
          </svg>
          {error}
        </div>
      )}

      {/* Tab Navigation */}
      <div className="flex gap-1 p-1 bg-slate-100 rounded-lg w-fit">
        <button 
          onClick={() => setActiveTab('feed')}
          className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${activeTab === 'feed' ? 'bg-white shadow-sm text-slate-900' : 'text-slate-600 hover:text-slate-900'}`}
        >
          📡 Live Feed {feedData.length > 0 && <span className="ml-1 text-xs text-slate-400">({feedData.length})</span>}
        </button>
        <button 
          onClick={() => setActiveTab('sources')}
          className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${activeTab === 'sources' ? 'bg-white shadow-sm text-slate-900' : 'text-slate-600 hover:text-slate-900'}`}
        >
          🔗 Sources
        </button>
        <button 
          onClick={() => setActiveTab('bars')}
          className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${activeTab === 'bars' ? 'bg-white shadow-sm text-slate-900' : 'text-slate-600 hover:text-slate-900'}`}
        >
          🏛️ Bar Associations
        </button>
      </div>

      {/* Feed Tab */}
      {activeTab === 'feed' && (
        <div className="space-y-6">
          {/* Filter Pills */}
          <div className="flex flex-wrap gap-2">
            {[
              { value: 'all', label: 'All Updates' },
              { value: 'caselaw', label: '⚖️ Case Law' },
              { value: 'article', label: '📰 News' },
              /* podcast filter removed */
            ].map(filter => (
              <button
                key={filter.value}
                onClick={() => setFeedFilter(filter.value)}
                className={`px-3 py-1.5 rounded-full text-sm font-medium transition-colors ${
                  feedFilter === filter.value 
                    ? 'bg-navy-900 text-white' 
                    : 'bg-white border border-slate-200 text-slate-600 hover:bg-slate-50'
                }`}
              >
                {filter.label}
              </button>
            ))}
          </div>

          {/* Loading State */}
          {isLoading && (
            <div className="space-y-4">
              {[1, 2, 3, 4, 5].map(i => (
                <div key={i} className="bg-white rounded-xl border border-slate-200/80 p-5 animate-pulse">
                  <div className="flex items-start gap-4">
                    <div className="w-8 h-8 bg-slate-200 rounded"></div>
                    <div className="flex-1 space-y-3">
                      <div className="h-4 bg-slate-200 rounded w-1/4"></div>
                      <div className="h-5 bg-slate-200 rounded w-3/4"></div>
                      <div className="h-4 bg-slate-200 rounded w-full"></div>
                      <div className="h-3 bg-slate-200 rounded w-1/3"></div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Feed Items */}
          {!isLoading && (
            <div className="space-y-4">
              {filteredFeed.length === 0 ? (
                <div className="bg-white rounded-xl border border-slate-200/80 p-12 text-center">
                  <div className="w-12 h-12 mx-auto mb-4 rounded-full bg-slate-100 flex items-center justify-center">
                    <svg className="w-6 h-6 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9a2 2 0 00-2-2h-2m-4-3H9M7 16h6M7 8h6v4H7V8z" />
                    </svg>
                  </div>
                  <p className="text-slate-500">No items found. Try adjusting your filters or refresh.</p>
                </div>
              ) : (
                filteredFeed.map(item => (
                  <button 
                    key={item.id}
                    onClick={() => setSelectedItem(item)}
                    className={`block w-full text-left rounded-xl border p-4 sm:p-5 hover:shadow-md transition-all duration-200 group ${
                      item.relevanceScore != null && item.relevanceScore > 0 
                        ? 'bg-gradient-to-r from-white to-purple-50/50 border-purple-200 hover:border-purple-300' 
                        : 'bg-white border-slate-200/80 hover:border-slate-300'
                    }`}
                  >
                    <div className="flex items-start gap-4">
                      <div className="text-2xl">{getTypeIcon(item.type)}</div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 flex-wrap mb-1">
                          {item.relevanceScore != null && item.relevanceScore > 0 && (
                            <span className="text-[10px] font-semibold uppercase px-2 py-0.5 rounded bg-purple-100 text-purple-700 flex items-center gap-1">
                              <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                                <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                              </svg>
                              Relevant
                            </span>
                          )}
                          <span className={`text-[10px] font-semibold uppercase px-2 py-0.5 rounded ${getTypeBadgeColor(item.type)}`}>
                            {item.type}
                          </span>
                          <span className="text-xs text-slate-400">{item.category}</span>
                          {item.duration && (
                            <span className="text-xs text-slate-400">• {item.duration}</span>
                          )}
                          {item.citation && (
                            <span className="text-xs font-mono text-slate-400">• {item.citation}</span>
                          )}
                        </div>
                        <h3 className="font-semibold text-slate-900 group-hover:text-navy-800 transition-colors line-clamp-2">
                          {item.title}
                        </h3>
                        {item.description && (
                          <p className="text-sm text-slate-500 mt-1 line-clamp-2">{item.description}</p>
                        )}
                        <div className="flex items-center gap-2 mt-2 text-xs text-slate-400">
                          <span>{item.sourceIcon} {item.source}</span>
                          <span>•</span>
                          <span>{item.date}</span>
                          {item.court && (
                            <>
                              <span>•</span>
                              <span>{item.court}</span>
                            </>
                          )}
                        </div>
                        {/* Show matched topics */}
                        {item.matchedTopics && item.matchedTopics.length > 0 && (
                          <div className="flex items-center gap-1.5 mt-2">
                            <span className="text-[10px] text-purple-500">Matches:</span>
                            {item.matchedTopics.slice(0, 3).map(topic => (
                              <span key={topic} className="text-[10px] px-1.5 py-0.5 bg-purple-50 text-purple-600 rounded">
                                {topic}
                              </span>
                            ))}
                            {item.matchedTopics.length > 3 && (
                              <span className="text-[10px] text-purple-400">+{item.matchedTopics.length - 3}</span>
                            )}
                          </div>
                        )}
                      </div>
                      <div className="flex-shrink-0 opacity-0 group-hover:opacity-100 transition-opacity">
                        <span className="text-xs font-medium text-navy-800 bg-navy-50 px-2 py-1 rounded">
                          Read →
                        </span>
                      </div>
                    </div>
                  </button>
                ))
              )}
            </div>
          )}
        </div>
      )}

      {/* Sources Tab */}
      {activeTab === 'sources' && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* News Outlets */}
          <div className="bg-white rounded-xl border border-slate-200/80 p-5">
            <h3 className="font-semibold text-slate-900 mb-4 flex items-center gap-2">
              <span className="text-xl">📰</span> News Outlets
            </h3>
            <div className="space-y-3">
              {newsOutlets.map(outlet => (
                <a 
                  key={outlet.name}
                  href={outlet.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-between p-3 rounded-lg hover:bg-slate-50 transition-colors group"
                >
                  <div className="flex items-center gap-3">
                    <span className="text-lg">{outlet.icon}</span>
                    <div>
                      <p className="font-medium text-slate-900 text-sm">{outlet.name}</p>
                      <p className="text-xs text-slate-400">{outlet.category}</p>
                    </div>
                  </div>
                  <svg className="w-4 h-4 text-slate-300 group-hover:text-slate-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                  </svg>
                </a>
              ))}
            </div>
          </div>

          {/* Podcasts section removed */}

          {/* Law Journals */}
          <div className="bg-white rounded-xl border border-slate-200/80 p-5">
            <h3 className="font-semibold text-slate-900 mb-4 flex items-center gap-2">
              <span className="text-xl">📚</span> Law Journals
            </h3>
            <div className="space-y-3">
              {lawJournals.map(journal => (
                <a 
                  key={journal.name}
                  href={journal.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-between p-3 rounded-lg hover:bg-slate-50 transition-colors group"
                >
                  <div className="flex items-center gap-3">
                    <span className="text-lg">📖</span>
                    <div>
                      <p className="font-medium text-slate-900 text-sm">{journal.name}</p>
                      <p className="text-xs text-slate-400">{journal.focus}</p>
                    </div>
                  </div>
                  <svg className="w-4 h-4 text-slate-300 group-hover:text-slate-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                  </svg>
                </a>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Bar Associations Tab */}
      {activeTab === 'bars' && (
        <div className="space-y-6">
          <div className="bg-gradient-to-r from-navy-900 to-navy-800 rounded-xl p-6 text-white">
            <h3 className="font-semibold text-lg mb-2">Connect Your Bar Memberships</h3>
            <p className="text-navy-200 text-sm">Link your bar association accounts to access member resources, CLE credits, and professional updates directly in your feed.</p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {barAssociations.map(bar => (
              <div 
                key={bar.id}
                className="bg-white rounded-xl border border-slate-200/80 p-5 hover:shadow-md transition-all"
              >
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <h4 className="font-semibold text-slate-900">{bar.abbreviation}</h4>
                    <p className="text-xs text-slate-500 mt-0.5">{bar.name}</p>
                  </div>
                  <div className={`w-3 h-3 rounded-full ${connectedBars.has(bar.id) ? 'bg-emerald-500' : 'bg-slate-200'}`} />
                </div>
                
                <div className="space-y-2">
                  <a 
                    href={bar.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-2 text-sm text-slate-600 hover:text-navy-800"
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9a9 9 0 01-9-9m9 9c1.657 0 3-4.03 3-9s-1.343-9-3-9m0 18c-1.657 0-3-4.03-3-9s1.343-9 3-9m-9 9a9 9 0 019-9" />
                    </svg>
                    Visit Website
                  </a>
                  <a 
                    href={bar.memberPortal}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-2 text-sm text-slate-600 hover:text-navy-800"
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                    </svg>
                    Member Portal
                  </a>
                </div>

                <button
                  onClick={() => handleConnectBar(bar.id)}
                  className={`w-full mt-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                    connectedBars.has(bar.id)
                      ? 'bg-emerald-50 text-emerald-700 hover:bg-emerald-100'
                      : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                  }`}
                >
                  {connectedBars.has(bar.id) ? '✓ Connected' : 'Connect Account'}
                </button>
              </div>
            ))}
          </div>

          {/* Add Custom Bar */}
          <div className="bg-slate-50 rounded-xl border-2 border-dashed border-slate-200 p-6 text-center">
            <div className="w-12 h-12 rounded-full bg-slate-100 flex items-center justify-center mx-auto mb-3">
              <svg className="w-6 h-6 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
              </svg>
            </div>
            <h4 className="font-medium text-slate-700 mb-1">Add Another Bar Association</h4>
            <p className="text-sm text-slate-500 mb-3">Connect to any state or specialty bar</p>
            <button className="px-4 py-2 bg-white border border-slate-200 rounded-lg text-sm font-medium text-slate-700 hover:bg-slate-50 transition-colors">
              Add Bar Association
            </button>
          </div>
        </div>
      )}

      {/* Quick Links Footer */}
      <div className="bg-slate-50 rounded-xl p-5 mt-8">
        <h3 className="font-semibold text-slate-700 text-sm mb-3">Quick Research - Criminal & Family</h3>
        <div className="flex flex-wrap gap-2">
          {[
            { name: 'NY eCourts (WebCrims)', url: 'https://iapps.courts.state.ny.us/webcivil' },
            { name: 'CourtListener', url: 'https://courtlistener.com' },
            { name: 'NY Penal Law', url: 'https://ypdcrime.com/penal.law' },
            { name: 'NY CPL', url: 'https://ypdcrime.com/cpl' },
            { name: 'NY Family Court Act', url: 'https://codes.findlaw.com/ny/family-court-act' },
            { name: 'NY DRL (Divorce)', url: 'https://codes.findlaw.com/ny/domestic-relations-law' },
            { name: 'Innocence Project', url: 'https://innocenceproject.org' },
            { name: 'DOCCS Lookup', url: 'https://nysdoccslookup.doccs.ny.gov' },
          ].map(link => (
            <a
              key={link.name}
              href={link.url}
              target="_blank"
              rel="noopener noreferrer"
              className="px-3 py-1.5 bg-white border border-slate-200 rounded-lg text-sm text-slate-600 hover:bg-slate-100 hover:text-slate-900 transition-colors"
            >
              {link.name} ↗
            </a>
          ))}
        </div>
      </div>
    </div>
  );
}
