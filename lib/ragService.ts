/**
 * RAG (Retrieval Augmented Generation) Service
 * 
 * Provides semantic search and context retrieval for:
 * - Uploaded documents (discovery, pleadings, etc.)
 * - Case law and statutes
 * - Wiki/knowledge base entries
 * - Crowdsourced legal database
 * 
 * Uses free embedding APIs:
 * - Cohere Embed (free tier)
 * - Jina Embeddings (free tier)
 * - Sentence Transformers (local fallback)
 */

import { collection, doc, setDoc, getDocs, query, where, orderBy, limit } from 'firebase/firestore';
import { db } from './firebase';

export interface EmbeddingChunk {
  id: string;
  documentId: string;
  caseId?: string;
  content: string;
  embedding: number[];
  metadata: {
    source: 'document' | 'case_law' | 'statute' | 'wiki' | 'crowdsourced';
    title?: string;
    citation?: string;
    pageNumber?: number;
    chunkIndex: number;
    totalChunks: number;
    createdAt: string;
  };
}

export interface SearchResult {
  chunk: EmbeddingChunk;
  score: number;
  highlight?: string;
}

export interface RAGContext {
  query: string;
  results: SearchResult[];
  formattedContext: string;
}

// Embedding providers
type EmbeddingProvider = 'cohere' | 'jina' | 'local';

const EMBEDDING_DIMENSION = 1024;
const CHUNK_SIZE = 500; // tokens approx
const CHUNK_OVERLAP = 50;

/**
 * Generate embeddings using free APIs
 */
export async function generateEmbedding(
  text: string,
  provider: EmbeddingProvider = 'cohere'
): Promise<number[]> {
  switch (provider) {
    case 'cohere':
      return generateCohereEmbedding(text);
    case 'jina':
      return generateJinaEmbedding(text);
    case 'local':
    default:
      // Simple TF-IDF based local embedding as fallback
      return generateLocalEmbedding(text);
  }
}

async function generateCohereEmbedding(text: string): Promise<number[]> {
  const apiKey = process.env.NEXT_PUBLIC_COHERE_API_KEY;
  
  if (!apiKey) {
    console.warn('No Cohere API key, falling back to local embeddings');
    return generateLocalEmbedding(text);
  }

  try {
    const response = await fetch('https://api.cohere.ai/v1/embed', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        texts: [text],
        model: 'embed-english-v3.0',
        input_type: 'search_document',
      }),
    });

    const data = await response.json();
    return data.embeddings[0];
  } catch (error) {
    console.error('Cohere embedding failed:', error);
    return generateLocalEmbedding(text);
  }
}

async function generateJinaEmbedding(text: string): Promise<number[]> {
  const apiKey = process.env.NEXT_PUBLIC_JINA_API_KEY;
  
  if (!apiKey) {
    return generateLocalEmbedding(text);
  }

  try {
    const response = await fetch('https://api.jina.ai/v1/embeddings', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        input: [text],
        model: 'jina-embeddings-v2-base-en',
      }),
    });

    const data = await response.json();
    return data.data[0].embedding;
  } catch (error) {
    console.error('Jina embedding failed:', error);
    return generateLocalEmbedding(text);
  }
}

/**
 * Simple local embedding using TF-IDF-like approach
 * This is a fallback when no API is available
 */
function generateLocalEmbedding(text: string): number[] {
  // Create a simple hash-based embedding
  const words = text.toLowerCase().split(/\s+/);
  const embedding = new Array(EMBEDDING_DIMENSION).fill(0);
  
  // Legal-specific important terms get higher weights
  const legalTerms = new Set([
    'court', 'judge', 'defendant', 'plaintiff', 'motion', 'order',
    'statute', 'law', 'case', 'evidence', 'witness', 'testimony',
    'guilty', 'innocent', 'verdict', 'sentence', 'appeal', 'custody',
    'divorce', 'criminal', 'civil', 'hearing', 'trial', 'jury',
    'attorney', 'counsel', 'prosecution', 'defense', 'bail',
  ]);

  words.forEach((word, i) => {
    // Simple hash function to distribute words across embedding dimensions
    const hash = hashString(word);
    const index = Math.abs(hash) % EMBEDDING_DIMENSION;
    const weight = legalTerms.has(word) ? 2.0 : 1.0;
    embedding[index] += weight * (1 / Math.sqrt(i + 1)); // Position decay
  });

  // Normalize
  const magnitude = Math.sqrt(embedding.reduce((sum, val) => sum + val * val, 0));
  return embedding.map(val => magnitude > 0 ? val / magnitude : 0);
}

function hashString(str: string): number {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    const char = str.charCodeAt(i);
    hash = ((hash << 5) - hash) + char;
    hash = hash & hash;
  }
  return hash;
}

/**
 * Calculate cosine similarity between two embeddings
 */
export function cosineSimilarity(a: number[], b: number[]): number {
  if (a.length !== b.length) return 0;
  
  let dotProduct = 0;
  let normA = 0;
  let normB = 0;
  
  for (let i = 0; i < a.length; i++) {
    dotProduct += a[i] * b[i];
    normA += a[i] * a[i];
    normB += b[i] * b[i];
  }
  
  const magnitude = Math.sqrt(normA) * Math.sqrt(normB);
  return magnitude > 0 ? dotProduct / magnitude : 0;
}

/**
 * Split text into chunks for embedding
 */
export function chunkText(text: string, chunkSize = CHUNK_SIZE, overlap = CHUNK_OVERLAP): string[] {
  const words = text.split(/\s+/);
  const chunks: string[] = [];
  
  for (let i = 0; i < words.length; i += chunkSize - overlap) {
    const chunk = words.slice(i, i + chunkSize).join(' ');
    if (chunk.trim()) {
      chunks.push(chunk);
    }
  }
  
  return chunks;
}

/**
 * Index a document for RAG
 */
export async function indexDocument(
  documentId: string,
  content: string,
  metadata: Partial<EmbeddingChunk['metadata']>,
  caseId?: string
): Promise<EmbeddingChunk[]> {
  const chunks = chunkText(content);
  const embeddingChunks: EmbeddingChunk[] = [];

  for (let i = 0; i < chunks.length; i++) {
    const embedding = await generateEmbedding(chunks[i]);
    
    const chunk: EmbeddingChunk = {
      id: `${documentId}_chunk_${i}`,
      documentId,
      caseId,
      content: chunks[i],
      embedding,
      metadata: {
        source: metadata.source || 'document',
        title: metadata.title,
        citation: metadata.citation,
        chunkIndex: i,
        totalChunks: chunks.length,
        createdAt: new Date().toISOString(),
        ...metadata,
      },
    };

    embeddingChunks.push(chunk);

    // Store in Firestore (in production, use a vector database like Pinecone)
    try {
      await setDoc(doc(db, 'embeddings', chunk.id), {
        ...chunk,
        // Store embedding as array (Firestore supports this)
      });
    } catch (error) {
      console.error('Failed to store embedding:', error);
    }
  }

  return embeddingChunks;
}

/**
 * Search for relevant chunks
 */
export async function searchRAG(
  queryText: string,
  options: {
    caseId?: string;
    sources?: EmbeddingChunk['metadata']['source'][];
    topK?: number;
    minScore?: number;
  } = {}
): Promise<SearchResult[]> {
  const { caseId, sources, topK = 5, minScore = 0.3 } = options;

  // Generate query embedding
  const queryEmbedding = await generateEmbedding(queryText);

  // Get all embeddings (in production, use a vector database for efficient search)
  let embeddingsQuery = collection(db, 'embeddings');
  
  try {
    const snapshot = await getDocs(embeddingsQuery);
    const allChunks: EmbeddingChunk[] = [];

    snapshot.forEach(doc => {
      const data = doc.data() as EmbeddingChunk;
      
      // Filter by case if specified
      if (caseId && data.caseId !== caseId) return;
      
      // Filter by source if specified
      if (sources && !sources.includes(data.metadata.source)) return;
      
      allChunks.push(data);
    });

    // Calculate similarities
    const results: SearchResult[] = allChunks
      .map(chunk => ({
        chunk,
        score: cosineSimilarity(queryEmbedding, chunk.embedding),
      }))
      .filter(r => r.score >= minScore)
      .sort((a, b) => b.score - a.score)
      .slice(0, topK);

    return results;
  } catch (error) {
    console.error('RAG search failed:', error);
    return [];
  }
}

/**
 * Build RAG context for LLM prompt
 */
export async function buildRAGContext(
  query: string,
  options: {
    caseId?: string;
    sources?: EmbeddingChunk['metadata']['source'][];
    maxContextLength?: number;
  } = {}
): Promise<RAGContext> {
  const { maxContextLength = 4000 } = options;
  
  const results = await searchRAG(query, options);
  
  // Format context for injection into prompt
  let formattedContext = '';
  let currentLength = 0;

  for (const result of results) {
    const citation = result.chunk.metadata.citation 
      ? `[${result.chunk.metadata.citation}]` 
      : `[${result.chunk.metadata.source}: ${result.chunk.metadata.title || result.chunk.documentId}]`;
    
    const entry = `\n---\n${citation}\n${result.chunk.content}\n`;
    
    if (currentLength + entry.length > maxContextLength) break;
    
    formattedContext += entry;
    currentLength += entry.length;
  }

  return {
    query,
    results,
    formattedContext,
  };
}

/**
 * Index case law from legal databases
 */
export async function indexCaseLaw(
  caseData: {
    citation: string;
    title: string;
    text: string;
    court?: string;
    date?: string;
  }
): Promise<void> {
  await indexDocument(
    `case_${hashString(caseData.citation)}`,
    caseData.text,
    {
      source: 'case_law',
      title: caseData.title,
      citation: caseData.citation,
    }
  );
}

/**
 * Index statute
 */
export async function indexStatute(
  statuteData: {
    citation: string;
    title: string;
    text: string;
  }
): Promise<void> {
  await indexDocument(
    `statute_${hashString(statuteData.citation)}`,
    statuteData.text,
    {
      source: 'statute',
      title: statuteData.title,
      citation: statuteData.citation,
    }
  );
}

/**
 * Index wiki entry
 */
export async function indexWikiEntry(
  entryId: string,
  title: string,
  content: string
): Promise<void> {
  await indexDocument(
    `wiki_${entryId}`,
    content,
    {
      source: 'wiki',
      title,
    }
  );
}

/**
 * Get RAG-enhanced system prompt
 */
export function getRAGSystemPrompt(context: RAGContext): string {
  if (!context.formattedContext) {
    return '';
  }

  return `
RELEVANT CONTEXT FROM KNOWLEDGE BASE:
${context.formattedContext}

INSTRUCTIONS:
- Use the above context to inform your response
- Cite sources when referencing specific information from context
- If the context doesn't contain relevant information, say so
- Do not make up information not present in the context
`;
}

/**
 * Local in-memory vector store for development
 */
class InMemoryVectorStore {
  private vectors: Map<string, EmbeddingChunk> = new Map();

  add(chunk: EmbeddingChunk): void {
    this.vectors.set(chunk.id, chunk);
  }

  search(queryEmbedding: number[], topK: number = 5): SearchResult[] {
    const results: SearchResult[] = [];

    this.vectors.forEach(chunk => {
      const score = cosineSimilarity(queryEmbedding, chunk.embedding);
      results.push({ chunk, score });
    });

    return results
      .sort((a, b) => b.score - a.score)
      .slice(0, topK);
  }

  clear(): void {
    this.vectors.clear();
  }

  size(): number {
    return this.vectors.size;
  }
}

export const localVectorStore = new InMemoryVectorStore();

/**
 * Search documents - alias for searchRAG with document-specific defaults
 * Used by documentVault and caseContext
 */
export async function searchDocuments(
  query: string,
  options: {
    userId?: string;
    caseId?: string;
    limit?: number;
  } = {}
): Promise<Array<{
  text: string;
  score: number;
  documentId: string;
}>> {
  const results = await searchRAG(query, {
    caseId: options.caseId,
    topK: options.limit || 5,
    sources: ['document'],
  });

  return results.map(r => ({
    text: r.chunk.content,
    score: r.score,
    documentId: r.chunk.documentId,
  }));
}

/**
 * Index document - wrapper that returns chunk count
 * Used by documentVault
 */
export async function indexDocumentForRAG(
  doc: {
    id: string;
    caseId: string;
    userId: string;
    content: string;
    metadata: Record<string, string>;
  }
): Promise<number> {
  const chunks = await indexDocument(doc.id, doc.content, {
    source: 'document',
    title: doc.metadata.filename,
  }, doc.caseId);

  return chunks.length;
}
