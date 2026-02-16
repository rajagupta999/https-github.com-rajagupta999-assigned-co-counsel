/**
 * RAG Processor for Trial & Deposition Prep
 * 
 * Handles:
 * - Document chunking and indexing
 * - Topic summary generation
 * - Master index management
 * - Smart query routing to relevant summaries
 * - Vulnerability tracking across sessions
 */

const FUNCTIONS_BASE = 'https://us-central1-assigned-co-counsel.cloudfunctions.net';

// ============================================================
// TYPES
// ============================================================

export interface RagDocument {
  id: string;
  name: string;
  text: string;
  size: number;
  chunks: DocumentChunk[];
  addedAt: number;
}

export interface DocumentChunk {
  id: string;
  docId: string;
  docName: string;
  text: string;
  index: number;
  totalChunks: number;
  keywords: string[];
}

export interface TopicSummary {
  id: string;
  topic: string;
  label: string;
  content: string;
  keywords: string[];
  sourceDocNames: string[];
  builtAt: number;
  lineCount: number;
}

export interface MasterIndex {
  caseId: string;
  caseName: string;
  totalDocs: number;
  totalChunks: number;
  totalChars: number;
  topics: TopicSummary[];
  queryRoutes: { keywords: string[]; topicIds: string[] }[];
  builtAt: number;
  staleAfter: number; // timestamp after which summaries should be rebuilt
}

export interface Vulnerability {
  id: string;
  topic: string;
  question: string;
  badAnswer: string;
  feedback: string;
  score: number;
  suggestedAnswer?: string;
  sessionId: string;
  timestamp: number;
  resolved: boolean;
}

export interface PrepStats {
  totalSessions: number;
  totalAnswers: number;
  averageScore: number;
  bestScore: number;
  worstScore: number;
  letterGrade: string;
  vulnerabilities: Vulnerability[];
  topicScores: Record<string, { avg: number; count: number }>;
  improvementTrend: number[]; // last 10 session averages
}

// ============================================================
// DOCUMENT PROCESSING
// ============================================================

const CHUNK_SIZE = 2000; // chars per chunk
const CHUNK_OVERLAP = 200; // overlap between chunks

/**
 * Process raw document text into indexed chunks
 */
export function processDocument(doc: { id: string; name: string; text: string; size: number }): RagDocument {
  const chunks = chunkText(doc.text, doc.id, doc.name);
  return {
    ...doc,
    chunks,
    addedAt: Date.now(),
  };
}

function chunkText(text: string, docId: string, docName: string): DocumentChunk[] {
  const chunks: DocumentChunk[] = [];
  const cleanText = text.replace(/\s+/g, ' ').trim();
  
  // Try to split on paragraph boundaries first
  const paragraphs = cleanText.split(/\n\n+|\r\n\r\n+/);
  let currentChunk = '';
  let chunkIndex = 0;

  for (const para of paragraphs) {
    if ((currentChunk + '\n\n' + para).length > CHUNK_SIZE && currentChunk.length > 0) {
      chunks.push(createChunk(currentChunk, docId, docName, chunkIndex));
      // Keep overlap from end of current chunk
      currentChunk = currentChunk.slice(-CHUNK_OVERLAP) + '\n\n' + para;
      chunkIndex++;
    } else {
      currentChunk = currentChunk ? currentChunk + '\n\n' + para : para;
    }
  }

  // Last chunk
  if (currentChunk.trim()) {
    chunks.push(createChunk(currentChunk, docId, docName, chunkIndex));
    chunkIndex++;
  }

  // If no paragraph breaks, fall back to character-based chunking
  if (chunks.length === 0 && cleanText.length > 0) {
    for (let i = 0; i < cleanText.length; i += CHUNK_SIZE - CHUNK_OVERLAP) {
      chunks.push(createChunk(
        cleanText.slice(i, i + CHUNK_SIZE),
        docId, docName, chunkIndex
      ));
      chunkIndex++;
    }
  }

  // Set totalChunks on all
  chunks.forEach(c => c.totalChunks = chunks.length);

  return chunks;
}

function createChunk(text: string, docId: string, docName: string, index: number): DocumentChunk {
  return {
    id: `${docId}-chunk-${index}`,
    docId,
    docName,
    text: text.trim(),
    index,
    totalChunks: 0, // set later
    keywords: extractKeywords(text),
  };
}

/**
 * Extract keywords from text for basic matching
 */
function extractKeywords(text: string): string[] {
  const legalTerms = new Set([
    'motion', 'hearing', 'deposition', 'testimony', 'evidence', 'exhibit',
    'witness', 'cross-examination', 'direct', 'objection', 'sustain', 'overrule',
    'custody', 'parenting', 'visitation', 'support', 'alimony', 'maintenance',
    'assets', 'equitable', 'distribution', 'marital', 'separate', 'property',
    'abuse', 'neglect', 'protective', 'restraining', 'order',
    'felony', 'misdemeanor', 'indictment', 'arraignment', 'plea', 'sentence',
    'suppress', 'miranda', 'search', 'seizure', 'warrant', 'probable cause',
    'bail', 'remand', 'discovery', 'brady', 'rosario', 'sandoval',
    'expert', 'opinion', 'report', 'evaluation', 'assessment',
    'plaintiff', 'defendant', 'petitioner', 'respondent', 'complainant',
    'certif', 'affidavit', 'declaration', 'stipulation',
    'court', 'judge', 'jury', 'trial', 'appeal', 'verdict',
    'statute', 'regulation', 'precedent', 'ruling', 'decision',
  ]);

  const words = text.toLowerCase().replace(/[^a-z\s]/g, '').split(/\s+/);
  const found = new Set<string>();
  
  words.forEach(w => {
    if (w.length > 3 && legalTerms.has(w)) found.add(w);
  });

  // Also extract named entities (capitalized phrases)
  const namePattern = /\b[A-Z][a-z]+(?:\s+[A-Z][a-z]+)+\b/g;
  let match;
  while ((match = namePattern.exec(text)) !== null) {
    if (match[0].length > 5) found.add(match[0].toLowerCase());
  }

  return Array.from(found);
}

// ============================================================
// TOPIC SUMMARY GENERATION
// ============================================================

/**
 * Auto-detect topics from documents and generate summaries
 */
export async function generateTopicSummaries(
  documents: RagDocument[],
  caseName: string,
  caseType: 'criminal' | 'family' | 'general'
): Promise<TopicSummary[]> {
  const allText = documents.map(d => `--- ${d.name} ---\n${d.text.slice(0, 10000)}`).join('\n\n');
  
  // Step 1: Ask AI to identify key topics
  const topicPrompt = `You are analyzing case documents for "${caseName}" (${caseType} case).

DOCUMENTS:
${allText.slice(0, 30000)}

Identify the 5-8 most important topics/issues from these documents. For each topic, provide:
1. A short ID (e.g., CUSTODY, EVIDENCE, WITNESSES)
2. A human-readable label
3. Keywords that would match this topic
4. A comprehensive summary of everything relevant to this topic from the documents

Format your response as JSON array:
[
  {
    "id": "TOPIC_ID",
    "label": "Human Label",
    "keywords": ["word1", "word2"],
    "summary": "Detailed summary covering all relevant facts, dates, names, and issues..."
  }
]

Be thorough — these summaries will be used to prepare for testimony. Include specific names, dates, amounts, and facts.`;

  try {
    const response = await fetch(`${FUNCTIONS_BASE}/llm`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        provider: 'cerebras',
        messages: [{ role: 'user', content: topicPrompt }],
        options: { maxTokens: 4000, temperature: 0.3 },
      }),
    });

    if (!response.ok) return [];

    const data = await response.json();
    const content = data.content || data.choices?.[0]?.message?.content || '';

    // Parse JSON from response
    const jsonMatch = content.match(/\[[\s\S]*\]/);
    if (!jsonMatch) return [];

    const topics = JSON.parse(jsonMatch[0]);
    
    return topics.map((t: any, i: number) => ({
      id: `topic-${t.id || i}`,
      topic: t.id || `TOPIC_${i}`,
      label: t.label || `Topic ${i + 1}`,
      content: t.summary || '',
      keywords: t.keywords || [],
      sourceDocNames: documents.map(d => d.name),
      builtAt: Date.now(),
      lineCount: (t.summary || '').split('\n').length,
    }));
  } catch (err) {
    console.error('Failed to generate topic summaries:', err);
    return [];
  }
}

// ============================================================
// MASTER INDEX
// ============================================================

/**
 * Build master index from processed documents and topic summaries
 */
export function buildMasterIndex(
  caseId: string,
  caseName: string,
  documents: RagDocument[],
  topics: TopicSummary[]
): MasterIndex {
  // Build query routes from topic keywords
  const queryRoutes = topics.map(t => ({
    keywords: t.keywords,
    topicIds: [t.id],
  }));

  return {
    caseId,
    caseName,
    totalDocs: documents.length,
    totalChunks: documents.reduce((sum, d) => sum + d.chunks.length, 0),
    totalChars: documents.reduce((sum, d) => sum + d.text.length, 0),
    topics,
    queryRoutes,
    builtAt: Date.now(),
    staleAfter: Date.now() + 7 * 24 * 60 * 60 * 1000, // 7 days
  };
}

/**
 * Route a query to relevant topic summaries
 */
export function routeQuery(query: string, index: MasterIndex): TopicSummary[] {
  const queryLower = query.toLowerCase();
  const queryWords = queryLower.split(/\s+/);
  
  // Score each topic by keyword overlap
  const scored = index.topics.map(topic => {
    let score = 0;
    
    // Direct keyword match
    for (const kw of topic.keywords) {
      if (queryLower.includes(kw.toLowerCase())) score += 3;
    }
    
    // Word overlap with topic content
    for (const word of queryWords) {
      if (word.length > 3 && topic.content.toLowerCase().includes(word)) score += 1;
    }
    
    // Topic label match
    if (queryLower.includes(topic.label.toLowerCase())) score += 5;
    
    return { topic, score };
  });

  // Return top 2-3 most relevant topics
  return scored
    .filter(s => s.score > 0)
    .sort((a, b) => b.score - a.score)
    .slice(0, 3)
    .map(s => s.topic);
}

/**
 * Get relevant document chunks for a query
 */
export function searchChunks(query: string, documents: RagDocument[], maxChunks = 5): DocumentChunk[] {
  const queryLower = query.toLowerCase();
  const queryWords = queryLower.split(/\s+/).filter(w => w.length > 3);
  
  const scored = documents.flatMap(d => d.chunks).map(chunk => {
    let score = 0;
    const chunkLower = chunk.text.toLowerCase();
    
    for (const word of queryWords) {
      const count = (chunkLower.match(new RegExp(word, 'g')) || []).length;
      score += count;
    }
    
    // Bonus for keyword matches
    for (const kw of chunk.keywords) {
      if (queryLower.includes(kw)) score += 2;
    }
    
    return { chunk, score };
  });

  return scored
    .filter(s => s.score > 0)
    .sort((a, b) => b.score - a.score)
    .slice(0, maxChunks)
    .map(s => s.chunk);
}

// ============================================================
// VULNERABILITY TRACKING
// ============================================================

const VULN_STORAGE_KEY = 'acc_prep_vulnerabilities';

export function getVulnerabilities(caseId?: string): Vulnerability[] {
  try {
    const saved = localStorage.getItem(VULN_STORAGE_KEY);
    if (!saved) return [];
    const all: Vulnerability[] = JSON.parse(saved);
    return caseId ? all.filter(v => v.id.includes(caseId)) : all;
  } catch { return []; }
}

export function addVulnerability(vuln: Vulnerability): void {
  const all = getVulnerabilities();
  all.push(vuln);
  localStorage.setItem(VULN_STORAGE_KEY, JSON.stringify(all.slice(-200)));
}

export function resolveVulnerability(id: string): void {
  const all = getVulnerabilities();
  const updated = all.map(v => v.id === id ? { ...v, resolved: true } : v);
  localStorage.setItem(VULN_STORAGE_KEY, JSON.stringify(updated));
}

// ============================================================
// STATS & GRADING
// ============================================================

export function calculateLetterGrade(score: number): string {
  if (score >= 9.5) return 'A+';
  if (score >= 9.0) return 'A';
  if (score >= 8.5) return 'A-';
  if (score >= 8.0) return 'B+';
  if (score >= 7.0) return 'B';
  if (score >= 6.5) return 'B-';
  if (score >= 6.0) return 'C+';
  if (score >= 5.0) return 'C';
  if (score >= 4.0) return 'C-';
  if (score >= 3.0) return 'D';
  return 'F';
}

export function getGradeColor(grade: string): string {
  if (grade.startsWith('A')) return 'text-emerald-700 bg-emerald-50';
  if (grade.startsWith('B')) return 'text-blue-700 bg-blue-50';
  if (grade.startsWith('C')) return 'text-amber-700 bg-amber-50';
  return 'text-red-700 bg-red-50';
}

/**
 * Build comprehensive prep stats from session history
 */
export function buildPrepStats(sessions: any[]): PrepStats {
  const allScores: number[] = [];
  const vulnerabilities: Vulnerability[] = getVulnerabilities();
  const topicScores: Record<string, { avg: number; count: number; total: number }> = {};
  const sessionAverages: number[] = [];

  for (const session of sessions) {
    const scores = session.messages
      ?.filter((m: any) => m.score)
      .map((m: any) => m.score) || [];
    
    allScores.push(...scores);
    
    if (scores.length > 0) {
      sessionAverages.push(scores.reduce((a: number, b: number) => a + b, 0) / scores.length);
    }
  }

  const avg = allScores.length > 0 ? allScores.reduce((a, b) => a + b, 0) / allScores.length : 0;

  return {
    totalSessions: sessions.length,
    totalAnswers: allScores.length,
    averageScore: Math.round(avg * 10) / 10,
    bestScore: allScores.length > 0 ? Math.max(...allScores) : 0,
    worstScore: allScores.length > 0 ? Math.min(...allScores) : 0,
    letterGrade: calculateLetterGrade(avg),
    vulnerabilities,
    topicScores: Object.fromEntries(
      Object.entries(topicScores).map(([k, v]) => [k, { avg: v.total / v.count, count: v.count }])
    ),
    improvementTrend: sessionAverages.slice(-10),
  };
}

// ============================================================
// STORAGE
// ============================================================

const INDEX_STORAGE_KEY = 'acc_rag_master_index';
const DOCS_STORAGE_KEY = 'acc_rag_documents';

export function saveMasterIndex(index: MasterIndex): void {
  localStorage.setItem(`${INDEX_STORAGE_KEY}_${index.caseId}`, JSON.stringify(index));
}

export function loadMasterIndex(caseId: string): MasterIndex | null {
  try {
    const saved = localStorage.getItem(`${INDEX_STORAGE_KEY}_${caseId}`);
    return saved ? JSON.parse(saved) : null;
  } catch { return null; }
}

export function saveProcessedDocs(caseId: string, docs: RagDocument[]): void {
  // Save metadata only (not full text) to localStorage; full text stays in memory
  const meta = docs.map(d => ({
    id: d.id, name: d.name, size: d.size, addedAt: d.addedAt,
    chunkCount: d.chunks.length, charCount: d.text.length,
  }));
  localStorage.setItem(`${DOCS_STORAGE_KEY}_${caseId}`, JSON.stringify(meta));
}
