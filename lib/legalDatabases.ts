/**
 * Legal Database Integration
 * 
 * Free/Open legal research sources:
 * - CourtListener (case law)
 * - NY Legislature (NY statutes)
 * - Google Scholar Cases
 * - Cornell LII (federal law)
 * - RECAP Archive (federal court records)
 * - NY eCourts (NY court records)
 * 
 * User-authenticated sources (via browser agent):
 * - Westlaw (user's subscription)
 * - LexisNexis (user's subscription)
 * - Fastcase (often free via bar association)
 */

import { indexCaseLaw, indexStatute } from './ragService';

export interface CaseLawResult {
  id: string;
  name: string;
  citation: string;
  court: string;
  date: string;
  docketNumber?: string;
  summary?: string;
  fullText?: string;
  url: string;
  source: 'courtlistener' | 'google_scholar' | 'westlaw' | 'lexis' | 'crowdsourced';
}

export interface StatuteResult {
  id: string;
  citation: string;
  title: string;
  text: string;
  effectiveDate?: string;
  url: string;
  source: 'ny_legislature' | 'cornell_lii' | 'westlaw' | 'crowdsourced';
}

export interface SearchOptions {
  jurisdiction?: string;
  dateFrom?: string;
  dateTo?: string;
  court?: string;
  maxResults?: number;
}

// ============================================
// COURTLISTENER API (FREE)
// ============================================

const COURTLISTENER_API = 'https://www.courtlistener.com/api/rest/v3';
const COURTLISTENER_TOKEN = process.env.NEXT_PUBLIC_COURTLISTENER_TOKEN;

/**
 * Search case law via CourtListener
 */
export async function searchCourtListener(
  query: string,
  options: SearchOptions = {}
): Promise<CaseLawResult[]> {
  const { jurisdiction = 'ny', maxResults = 20 } = options;

  const params = new URLSearchParams({
    q: query,
    court: jurisdiction === 'ny' ? 'nyappdiv,nyappterm,nysupct,nyfamct' : '',
    order_by: 'score desc',
    page_size: maxResults.toString(),
  });

  try {
    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
    };
    
    if (COURTLISTENER_TOKEN) {
      headers['Authorization'] = `Token ${COURTLISTENER_TOKEN}`;
    }

    const response = await fetch(`${COURTLISTENER_API}/search/?${params}`, { headers });
    
    if (!response.ok) {
      console.error('CourtListener search failed:', response.status);
      return [];
    }

    const data = await response.json();

    return data.results.map((result: any) => ({
      id: result.id,
      name: result.caseName,
      citation: result.citation?.[0] || `${result.court} ${result.dateFiled}`,
      court: result.court,
      date: result.dateFiled,
      docketNumber: result.docketNumber,
      summary: result.snippet,
      url: `https://www.courtlistener.com${result.absolute_url}`,
      source: 'courtlistener' as const,
    }));
  } catch (error) {
    console.error('CourtListener error:', error);
    return [];
  }
}

/**
 * Get full opinion text from CourtListener
 */
export async function getCourtListenerOpinion(opinionId: string): Promise<string | null> {
  try {
    const headers: Record<string, string> = {};
    if (COURTLISTENER_TOKEN) {
      headers['Authorization'] = `Token ${COURTLISTENER_TOKEN}`;
    }

    const response = await fetch(`${COURTLISTENER_API}/opinions/${opinionId}/`, { headers });
    
    if (!response.ok) return null;

    const data = await response.json();
    return data.plain_text || data.html_with_citations || null;
  } catch (error) {
    console.error('Failed to get opinion:', error);
    return null;
  }
}

// ============================================
// NY LEGISLATURE (FREE)
// ============================================

const NY_LAWS_BASE = 'https://legislation.nysenate.gov/api/3';
const NY_LAWS_TOKEN = process.env.NEXT_PUBLIC_NY_SENATE_API_KEY;

/**
 * Search NY Statutes
 */
export async function searchNYStatutes(
  query: string,
  lawId?: string // e.g., 'CPL', 'PEN', 'DRL', 'FCA'
): Promise<StatuteResult[]> {
  try {
    const params = new URLSearchParams({
      term: query,
      limit: '20',
    });

    if (NY_LAWS_TOKEN) {
      params.append('key', NY_LAWS_TOKEN);
    }

    const response = await fetch(`${NY_LAWS_BASE}/laws/search?${params}`);
    
    if (!response.ok) {
      console.error('NY Legislature search failed:', response.status);
      return [];
    }

    const data = await response.json();

    return (data.result?.items || []).map((item: any) => ({
      id: item.locationId,
      citation: `${item.lawId} § ${item.locationId}`,
      title: item.title,
      text: item.text || '',
      url: `https://www.nysenate.gov/legislation/laws/${item.lawId}/${item.locationId}`,
      source: 'ny_legislature' as const,
    }));
  } catch (error) {
    console.error('NY Legislature error:', error);
    return [];
  }
}

/**
 * Get specific NY statute section
 */
export async function getNYStatuteSection(
  lawId: string, // e.g., 'CPL', 'PEN', 'DRL'
  sectionId: string // e.g., '710.20'
): Promise<StatuteResult | null> {
  try {
    const params = new URLSearchParams();
    if (NY_LAWS_TOKEN) {
      params.append('key', NY_LAWS_TOKEN);
    }

    const response = await fetch(
      `${NY_LAWS_BASE}/laws/${lawId}/${sectionId}?${params}`
    );
    
    if (!response.ok) return null;

    const data = await response.json();
    const result = data.result;

    return {
      id: result.locationId,
      citation: `${lawId} § ${sectionId}`,
      title: result.title,
      text: result.text,
      effectiveDate: result.effectiveDate,
      url: `https://www.nysenate.gov/legislation/laws/${lawId}/${sectionId}`,
      source: 'ny_legislature',
    };
  } catch (error) {
    console.error('Failed to get statute:', error);
    return null;
  }
}

// ============================================
// GOOGLE SCHOLAR CASES (FREE)
// ============================================

/**
 * Search Google Scholar for case law
 * Note: This uses web scraping as Google Scholar doesn't have an official API
 */
export async function searchGoogleScholar(
  query: string,
  options: SearchOptions = {}
): Promise<CaseLawResult[]> {
  // Google Scholar doesn't have a public API, so we return empty
  // In production, you'd use a scraping service or proxy
  console.warn('Google Scholar API not available - use CourtListener instead');
  return [];
}

// ============================================
// CORNELL LII (FREE)
// ============================================

const CORNELL_LII_BASE = 'https://www.law.cornell.edu';

/**
 * Get federal statute from Cornell LII
 */
export async function getCornellStatute(
  title: string,
  section: string
): Promise<StatuteResult | null> {
  // Cornell LII doesn't have a formal API, but we can construct URLs
  const url = `${CORNELL_LII_BASE}/uscode/text/${title}/${section}`;
  
  return {
    id: `usc_${title}_${section}`,
    citation: `${title} U.S.C. § ${section}`,
    title: `Title ${title}, Section ${section}`,
    text: `See full text at ${url}`,
    url,
    source: 'cornell_lii',
  };
}

// ============================================
// NY SPECIFIC DATABASES
// ============================================

/**
 * Common NY law lookup shortcuts
 */
export const NY_LAW_CODES = {
  CPL: 'Criminal Procedure Law',
  PEN: 'Penal Law',
  DRL: 'Domestic Relations Law',
  FCA: 'Family Court Act',
  VTL: 'Vehicle and Traffic Law',
  CPLR: 'Civil Practice Law and Rules',
  GOL: 'General Obligations Law',
  SSL: 'Social Services Law',
  MHL: 'Mental Hygiene Law',
  EDN: 'Education Law',
  EXC: 'Executive Law',
  JUD: 'Judiciary Law',
};

/**
 * Quick lookup for common NY statute sections
 */
export async function quickStatuteLookup(shorthand: string): Promise<StatuteResult | null> {
  // Parse shorthand like "CPL 710.20" or "DRL § 236"
  const match = shorthand.match(/^(\w+)\s*§?\s*([\d.]+)/);
  if (!match) return null;

  const [, lawId, section] = match;
  return getNYStatuteSection(lawId.toUpperCase(), section);
}

// ============================================
// CROWDSOURCED DATABASE
// ============================================

import { collection, doc, setDoc, getDocs, query, where, serverTimestamp } from 'firebase/firestore';
import { db } from './firebase';

/**
 * Add case to crowdsourced database
 */
export async function addToCrowdsourcedDB(
  type: 'case' | 'statute',
  data: CaseLawResult | StatuteResult,
  contributorId?: string
): Promise<void> {
  try {
    const collectionName = type === 'case' ? 'crowdsourced_cases' : 'crowdsourced_statutes';
    
    await setDoc(doc(db, collectionName, data.id), {
      ...data,
      source: 'crowdsourced',
      contributedAt: serverTimestamp(),
      contributorId,
      verified: false,
    });

    // Also index for RAG
    if (type === 'case' && 'fullText' in data && data.fullText) {
      await indexCaseLaw({
        citation: data.citation,
        title: data.name,
        text: data.fullText,
        court: data.court,
        date: data.date,
      });
    } else if (type === 'statute' && 'title' in data) {
      const s = data as StatuteResult;
      await indexStatute({
        citation: s.citation,
        title: s.title,
        text: s.text,
      });
    }
  } catch (error) {
    console.error('Failed to add to crowdsourced DB:', error);
  }
}

/**
 * Search crowdsourced database
 */
export async function searchCrowdsourcedDB(
  searchQuery: string,
  type: 'case' | 'statute'
): Promise<(CaseLawResult | StatuteResult)[]> {
  try {
    const collectionName = type === 'case' ? 'crowdsourced_cases' : 'crowdsourced_statutes';
    const snapshot = await getDocs(collection(db, collectionName));
    
    const results: any[] = [];
    snapshot.forEach(doc => {
      const data = doc.data();
      // Simple text search
      const searchableText = JSON.stringify(data).toLowerCase();
      if (searchableText.includes(searchQuery.toLowerCase())) {
        results.push({ id: doc.id, ...data });
      }
    });

    return results;
  } catch (error) {
    console.error('Crowdsourced search failed:', error);
    return [];
  }
}

// ============================================
// UNIFIED SEARCH
// ============================================

/**
 * Search all available legal databases
 */
export async function searchAllLegalDatabases(
  query: string,
  type: 'cases' | 'statutes' | 'all' = 'all',
  options: SearchOptions = {}
): Promise<{
  cases: CaseLawResult[];
  statutes: StatuteResult[];
}> {
  const results = {
    cases: [] as CaseLawResult[],
    statutes: [] as StatuteResult[],
  };

  if (type === 'cases' || type === 'all') {
    // Search cases from all sources in parallel
    const [courtlistener, crowdsourcedCases] = await Promise.all([
      searchCourtListener(query, options),
      searchCrowdsourcedDB(query, 'case'),
    ]);

    results.cases = [
      ...courtlistener,
      ...(crowdsourcedCases as CaseLawResult[]),
    ];
  }

  if (type === 'statutes' || type === 'all') {
    // Search statutes
    const [nyStatutes, crowdsourcedStatutes] = await Promise.all([
      searchNYStatutes(query),
      searchCrowdsourcedDB(query, 'statute'),
    ]);

    results.statutes = [
      ...nyStatutes,
      ...(crowdsourcedStatutes as StatuteResult[]),
    ];
  }

  return results;
}

// ============================================
// WESTLAW/LEXIS BROWSER AGENT
// ============================================

/**
 * Interface for browser-based legal research (Westlaw, Lexis)
 * This would work with a browser automation tool to access user's subscription
 */
export interface BrowserResearchRequest {
  provider: 'westlaw' | 'lexis' | 'fastcase';
  query: string;
  searchType: 'cases' | 'statutes' | 'secondary';
  jurisdiction?: string;
}

export interface BrowserResearchSession {
  sessionId: string;
  provider: string;
  status: 'authenticating' | 'searching' | 'complete' | 'error';
  results?: (CaseLawResult | StatuteResult)[];
  error?: string;
}

/**
 * Initiate browser-based research session
 * This opens a popup for user to authenticate with their Westlaw/Lexis account
 */
export function initiateBrowserResearch(
  request: BrowserResearchRequest
): string {
  const sessionId = `research_${Date.now()}`;
  
  // Store request in session storage
  sessionStorage.setItem(sessionId, JSON.stringify({
    ...request,
    status: 'pending',
    createdAt: new Date().toISOString(),
  }));

  // Open popup for authentication
  // In production, this would open a controlled browser window
  // that the user can use to log into their Westlaw/Lexis account
  const popupUrl = `/research-agent?session=${sessionId}&provider=${request.provider}`;
  
  window.open(
    popupUrl,
    'research_agent',
    'width=1200,height=800,left=100,top=100'
  );

  return sessionId;
}

/**
 * Check status of browser research session
 */
export function getBrowserResearchStatus(sessionId: string): BrowserResearchSession | null {
  const stored = sessionStorage.getItem(sessionId);
  if (!stored) return null;
  
  try {
    return JSON.parse(stored);
  } catch {
    return null;
  }
}

/**
 * Store results from browser research agent
 */
export async function storeBrowserResearchResults(
  sessionId: string,
  results: (CaseLawResult | StatuteResult)[]
): Promise<void> {
  // Update session storage
  const session = getBrowserResearchStatus(sessionId);
  if (session) {
    sessionStorage.setItem(sessionId, JSON.stringify({
      ...session,
      status: 'complete',
      results,
    }));
  }

  // Add to crowdsourced database for global benefit
  for (const result of results) {
    const type = 'court' in result ? 'case' : 'statute';
    await addToCrowdsourcedDB(type, result);
  }
}

// ============================================
// CITATION PARSER
// ============================================

/**
 * Parse legal citation and determine type
 */
export function parseCitation(citation: string): {
  type: 'case' | 'statute' | 'unknown';
  parsed: Record<string, string>;
} {
  // NY Statute pattern: "CPL § 710.20" or "Penal Law § 125.25"
  const nyStatuteMatch = citation.match(/^(\w+)\s*(?:Law)?\s*§\s*([\d.]+)/i);
  if (nyStatuteMatch) {
    return {
      type: 'statute',
      parsed: { lawId: nyStatuteMatch[1].toUpperCase(), section: nyStatuteMatch[2] },
    };
  }

  // Federal statute pattern: "18 U.S.C. § 1001"
  const uscMatch = citation.match(/(\d+)\s*U\.?S\.?C\.?\s*§?\s*([\d.]+)/i);
  if (uscMatch) {
    return {
      type: 'statute',
      parsed: { title: uscMatch[1], section: uscMatch[2], jurisdiction: 'federal' },
    };
  }

  // Case citation pattern: "People v. Smith, 123 N.Y.2d 456 (2020)"
  const caseMatch = citation.match(/(.+?)\s*v\.?\s*(.+?),\s*(\d+)\s+(.+?)\s+(\d+)/i);
  if (caseMatch) {
    return {
      type: 'case',
      parsed: {
        plaintiff: caseMatch[1].trim(),
        defendant: caseMatch[2].trim(),
        volume: caseMatch[3],
        reporter: caseMatch[4].trim(),
        page: caseMatch[5],
      },
    };
  }

  return { type: 'unknown', parsed: {} };
}

/**
 * Auto-lookup citation
 */
export async function lookupCitation(
  citation: string
): Promise<CaseLawResult | StatuteResult | null> {
  const { type, parsed } = parseCitation(citation);

  if (type === 'statute' && parsed.lawId) {
    return getNYStatuteSection(parsed.lawId, parsed.section);
  }

  if (type === 'case') {
    const results = await searchCourtListener(
      `${parsed.plaintiff} v ${parsed.defendant}`,
      { maxResults: 5 }
    );
    return results[0] || null;
  }

  return null;
}
