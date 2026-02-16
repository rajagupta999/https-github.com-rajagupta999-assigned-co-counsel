// Legal Intelligence API integrations
// Fetches real content from CourtListener, RSS feeds, and other sources
// Personalizes based on user's active cases

export interface FeedItem {
  id: string;
  title: string;
  source: string;
  sourceIcon: string;
  date: string;
  url: string;
  category: string;
  type: 'article' | 'podcast' | 'video' | 'journal' | 'caselaw';
  description?: string;
  duration?: string;
  content?: string; // Full content when available
  court?: string;
  citation?: string;
  relevanceScore?: number; // How relevant to user's cases
  matchedTopics?: string[]; // Which case topics matched
}

export interface UserCase {
  id: string;
  charges: string;
  county?: string;
}

// Extract search topics from user's cases
export function extractTopicsFromCases(cases: UserCase[]): string[] {
  const topicMap: Record<string, string[]> = {
    // Criminal charges -> search terms
    'burglary': ['burglary', 'breaking and entering', 'unlawful entry', 'penal law 140'],
    'assault': ['assault', 'battery', 'physical injury', 'penal law 120'],
    'robbery': ['robbery', 'forcible stealing', 'penal law 160'],
    'theft': ['theft', 'larceny', 'grand larceny', 'petit larceny', 'penal law 155'],
    'drug': ['drug', 'controlled substance', 'possession', 'narcotics', 'penal law 220'],
    'dui': ['DUI', 'DWI', 'driving while intoxicated', 'vehicle traffic law 1192'],
    'dwi': ['DUI', 'DWI', 'driving while intoxicated', 'vehicle traffic law 1192'],
    'weapon': ['weapon', 'firearm', 'gun', 'penal law 265'],
    'murder': ['murder', 'homicide', 'manslaughter', 'penal law 125'],
    'sex': ['sex offense', 'sexual assault', 'rape', 'penal law 130'],
    
    // Family law charges -> search terms
    'family offense': ['family offense', 'order of protection', 'domestic violence', 'family court act'],
    'custody': ['custody', 'visitation', 'parenting time', 'best interests'],
    'neglect': ['neglect', 'abuse', 'article 10', 'child protective', 'ACS'],
    'support': ['child support', 'spousal support', 'maintenance'],
    'divorce': ['divorce', 'matrimonial', 'equitable distribution', 'DRL'],
    'guardianship': ['guardianship', 'article 17', 'kinship'],
    'adoption': ['adoption', 'termination of parental rights', 'TPR'],
    'juvenile': ['juvenile', 'JD', 'PINS', 'family court'],
    'paternity': ['paternity', 'filiation', 'DNA', 'family court act 522'],
  };

  const topics = new Set<string>();
  
  cases.forEach(c => {
    const chargesLower = c.charges.toLowerCase();
    
    // Check each topic mapping
    Object.entries(topicMap).forEach(([key, searchTerms]) => {
      if (chargesLower.includes(key)) {
        searchTerms.forEach(term => topics.add(term));
      }
    });
    
    // Also add the raw charges as a search term
    topics.add(c.charges);
  });

  // If no specific topics found, default to general criminal/family
  if (topics.size === 0) {
    return ['criminal defense', 'family court', 'custody', 'public defender'];
  }

  return Array.from(topics);
}

// CourtListener API - Free case law database
const COURTLISTENER_API = 'https://www.courtlistener.com/api/rest/v4';

export async function fetchCourtListenerCases(
  query: string = 'criminal OR family',
  userTopics: string[] = []
): Promise<FeedItem[]> {
  try {
    // Search for recent NY criminal and family law opinions
    const response = await fetch(
      `${COURTLISTENER_API}/search/?q=${encodeURIComponent(query)}&type=o&order_by=dateFiled+desc`,
      {
        headers: {
          'Accept': 'application/json',
        },
      }
    );
    
    if (!response.ok) {
      console.error('CourtListener API error:', response.status);
      return [];
    }
    
    const data = await response.json();
    
    return (data.results || []).slice(0, 15).map((item: any, idx: number) => {
      const title = item.caseName || item.case_name || 'Untitled Case';
      const text = (item.text || item.plain_text || '').toLowerCase();
      const titleLower = title.toLowerCase();
      
      // Calculate relevance to user's topics
      const matchedTopics: string[] = [];
      userTopics.forEach(topic => {
        if (titleLower.includes(topic.toLowerCase()) || text.slice(0, 2000).includes(topic.toLowerCase())) {
          matchedTopics.push(topic);
        }
      });
      
      return {
        id: `cl-${item.cluster_id || item.id || idx}-${Date.now()}`,
        title,
        source: 'CourtListener',
        sourceIcon: '⚖️',
        date: formatDate(item.dateFiled || item.date_filed),
        url: `https://www.courtlistener.com${item.absolute_url || `/opinion/${item.id}/`}`,
        category: categorizeCase(item),
        type: 'caselaw' as const,
        description: item.snippet || truncate(item.text, 200),
        court: item.court || item.court_id,
        citation: item.citation?.[0] || item.neutral_cite,
        content: item.text || item.plain_text,
        relevanceScore: matchedTopics.length,
        matchedTopics,
      };
    });
  } catch (error) {
    console.error('Error fetching from CourtListener:', error);
    return [];
  }
}

// Fetch opinion detail from CourtListener
export async function fetchOpinionDetail(opinionId: string): Promise<any> {
  try {
    const response = await fetch(
      `${COURTLISTENER_API}/opinions/${opinionId}/?format=json`
    );
    
    if (!response.ok) return null;
    
    return await response.json();
  } catch (error) {
    console.error('Error fetching opinion detail:', error);
    return null;
  }
}

// RSS Feed Parser using rss2json API (free tier)
const RSS2JSON_API = 'https://api.rss2json.com/v1/api.json';

export async function fetchRSSFeed(
  feedUrl: string, 
  source: string, 
  category: string, 
  type: FeedItem['type'],
  userTopics: string[] = []
): Promise<FeedItem[]> {
  try {
    const response = await fetch(
      `${RSS2JSON_API}?rss_url=${encodeURIComponent(feedUrl)}`
    );
    
    if (!response.ok) {
      console.error('RSS fetch error for', source);
      return [];
    }
    
    const data = await response.json();
    
    if (data.status !== 'ok') {
      console.error('RSS parse error:', data.message);
      return [];
    }
    
    return (data.items || []).slice(0, 8).map((item: any, idx: number) => {
      const title = item.title || '';
      const description = stripHtml(item.description || '');
      const content = item.content || item.description || '';
      const textToSearch = `${title} ${description} ${content}`.toLowerCase();
      
      // Calculate relevance to user's topics
      const matchedTopics: string[] = [];
      userTopics.forEach(topic => {
        if (textToSearch.includes(topic.toLowerCase())) {
          matchedTopics.push(topic);
        }
      });
      
      return {
        id: `${source.toLowerCase().replace(/\s/g, '-')}-${idx}`,
        title,
        source,
        sourceIcon: getSourceIcon(type),
        date: formatDate(item.pubDate),
        url: item.link,
        category,
        type,
        description: description.slice(0, 250),
        content,
        duration: item.enclosure?.duration ? formatDuration(item.enclosure.duration) : undefined,
        relevanceScore: matchedTopics.length,
        matchedTopics,
      };
    });
  } catch (error) {
    console.error('Error fetching RSS:', error);
    return [];
  }
}

// Fetch all legal intel feeds, personalized to user's cases
export async function fetchAllLegalIntel(userCases: UserCase[] = []): Promise<{
  caselaw: FeedItem[];
  news: FeedItem[];
  podcasts: FeedItem[];
  topics: string[];
}> {
  // Extract topics from user's cases
  const topics = extractTopicsFromCases(userCases);
  
  // Build search query from topics (take top 5 for API query)
  const searchQuery = topics.slice(0, 5).join(' OR ') || 'criminal defense OR family court';
  
  const [caselaw, marshallProject, theAppeal, criminalPodcast] = await Promise.all([
    // Case Law - personalized search
    fetchCourtListenerCases(searchQuery, topics),
    
    // News RSS Feeds
    fetchRSSFeed(
      'https://www.themarshallproject.org/rss/full',
      'The Marshall Project',
      'Criminal Justice',
      'article',
      topics
    ),
    fetchRSSFeed(
      'https://theappeal.org/feed/',
      'The Appeal',
      'Criminal Reform',
      'article',
      topics
    ),
    
    // Podcasts RSS
    fetchRSSFeed(
      'https://feeds.megaphone.fm/criminal',
      'Criminal',
      'Criminal Justice',
      'podcast',
      topics
    ),
  ]);
  
  return {
    caselaw,
    news: [...marshallProject, ...theAppeal],
    podcasts: criminalPodcast,
    topics, // Return the topics so UI can show what we're tracking
  };
}

// Sort feed items by relevance score (highest first), then by date
export function sortByRelevance(items: FeedItem[]): FeedItem[] {
  return [...items].sort((a, b) => {
    // First sort by relevance score (higher is better)
    const scoreA = a.relevanceScore || 0;
    const scoreB = b.relevanceScore || 0;
    if (scoreB !== scoreA) return scoreB - scoreA;
    
    // Then by date (newer is better) - simple string comparison works for our date format
    return 0; // Keep original order if same relevance
  });
}

// Helper functions
function formatDate(dateStr: string): string {
  if (!dateStr) return 'Recently';
  
  const date = new Date(dateStr);
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));
  
  if (diffDays === 0) return 'Today';
  if (diffDays === 1) return 'Yesterday';
  if (diffDays < 7) return `${diffDays} days ago`;
  if (diffDays < 30) return `${Math.floor(diffDays / 7)} weeks ago`;
  
  return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
}

function categorizeCase(item: any): string {
  const text = (item.caseName || item.case_name || '').toLowerCase() + ' ' + (item.text || '').toLowerCase().slice(0, 500);
  
  if (text.includes('custody') || text.includes('visitation')) return 'Family - Custody';
  if (text.includes('neglect') || text.includes('abuse') || text.includes('article 10')) return 'Family - Child Welfare';
  if (text.includes('divorce') || text.includes('matrimonial')) return 'Family - Divorce';
  if (text.includes('criminal') || text.includes('defendant') || text.includes('conviction')) return 'Criminal Defense';
  if (text.includes('suppression') || text.includes('fourth amendment')) return 'Criminal - 4th Amendment';
  if (text.includes('ineffective') || text.includes('counsel')) return 'Criminal - IAC';
  if (text.includes('bail') || text.includes('detention')) return 'Criminal - Bail';
  if (text.includes('sentencing')) return 'Criminal - Sentencing';
  
  return 'Legal';
}

function getSourceIcon(type: FeedItem['type']): string {
  switch (type) {
    case 'caselaw': return '⚖️';
    case 'article': return '📰';
    case 'podcast': return '🎙️';
    case 'video': return '📺';
    case 'journal': return '📚';
    default: return '📄';
  }
}

function stripHtml(html: string): string {
  return html?.replace(/<[^>]*>/g, '').replace(/&nbsp;/g, ' ').replace(/&amp;/g, '&') || '';
}

function truncate(text: string, length: number): string {
  if (!text) return '';
  const clean = stripHtml(text);
  return clean.length > length ? clean.slice(0, length) + '...' : clean;
}

function formatDuration(seconds: number | string): string {
  const secs = typeof seconds === 'string' ? parseInt(seconds) : seconds;
  const mins = Math.floor(secs / 60);
  return `${mins} min`;
}
