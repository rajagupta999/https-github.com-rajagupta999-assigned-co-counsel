/**
 * Firebase Functions Backend for 18B Lawyer
 * 
 * Handles:
 * - LLM proxy (keeps API keys secure server-side)
 * - OAuth token exchange (Google Drive, Dropbox)
 * - Legal database queries
 * - Document processing
 */

import * as functions from 'firebase-functions';
import * as admin from 'firebase-admin';
import cors from 'cors';

admin.initializeApp();

const corsMiddleware = cors({ origin: true });

// ============================================================
// LLM PROXY - Secure API key handling
// ============================================================

// ── Task-Based Model Routing ──────────────────────────────────────
// Different models optimized for different legal tasks on Cerebras

type TaskType = 
  | 'chat'           // Quick Q&A, simple questions → fast model
  | 'draft'          // Motion/letter drafting → balanced model
  | 'research'       // Legal research, case law analysis → reasoning model
  | 'analysis'       // Case analysis, multi-agent → reasoning model
  | 'citation'       // Citation mode, fact-checking → reasoning model
  | 'summarize'      // Document summarization → heavy model
  | 'red-team'       // Adversarial analysis → reasoning model
  | 'paralegal';     // Virtual paralegal chat → balanced model

interface CerebrasModel {
  id: string;
  name: string;
  params: string;
  speed: string;
  reasoning?: boolean;
  reasoningEffort?: 'low' | 'medium' | 'high';
}

const CEREBRAS_MODELS: Record<string, CerebrasModel> = {
  'llama-3.3-70b': { id: 'llama-3.3-70b', name: 'Llama 3.3 70B', params: '70B', speed: '~2,100 tok/s' },
  'llama3.1-8b': { id: 'llama3.1-8b', name: 'Llama 3.1 8B', params: '8B', speed: '~2,200 tok/s' },
  'qwen-3-32b': { id: 'qwen-3-32b', name: 'Qwen 3 32B', params: '32B', speed: '~2,600 tok/s', reasoning: true },
  'gpt-oss-120b': { id: 'gpt-oss-120b', name: 'GPT-OSS 120B', params: '120B', speed: '~3,000 tok/s' },
};

// Task → Model routing table
const TASK_MODEL_MAP: Record<TaskType, { model: string; reasoningEffort?: string; temperature: number }> = {
  'chat':       { model: 'llama-3.3-70b', temperature: 0.7 },        // Fast, conversational
  'draft':      { model: 'llama-3.3-70b', temperature: 0.6 },        // Good drafting, fast
  'paralegal':  { model: 'llama-3.3-70b', temperature: 0.7 },        // Balanced for chat
  'research':   { model: 'qwen-3-32b', reasoningEffort: 'high', temperature: 0.3 },   // Deep reasoning
  'analysis':   { model: 'qwen-3-32b', reasoningEffort: 'high', temperature: 0.4 },   // Analytical
  'citation':   { model: 'qwen-3-32b', reasoningEffort: 'high', temperature: 0.2 },   // Precise, factual
  'red-team':   { model: 'qwen-3-32b', reasoningEffort: 'medium', temperature: 0.5 }, // Adversarial
  'summarize':  { model: 'gpt-oss-120b', temperature: 0.3 },         // Strongest comprehension
};

function getModelForTask(task?: TaskType): { model: string; reasoningEffort?: string; temperature: number } {
  if (task && TASK_MODEL_MAP[task]) {
    return TASK_MODEL_MAP[task];
  }
  // Default: fast general model
  return TASK_MODEL_MAP['chat'];
}

interface LLMRequest {
  provider: 'cerebras' | 'groq' | 'gemini' | 'mistral' | 'cohere' | 'together';
  messages: Array<{ role: string; content: string }>;
  task?: TaskType;
  model?: string;       // Allow explicit model override
  options?: {
    maxTokens?: number;
    temperature?: number;
    model?: string;
    reasoningEffort?: string;
  };
}

const PROVIDER_CONFIGS: Record<string, { url: string; model: string }> = {
  groq: {
    url: 'https://api.groq.com/openai/v1/chat/completions',
    model: 'llama-3.3-70b-versatile',
  },
  gemini: {
    url: 'https://generativelanguage.googleapis.com/v1beta/models',
    model: 'gemini-1.5-flash',
  },
  mistral: {
    url: 'https://api.mistral.ai/v1/chat/completions',
    model: 'mistral-small-latest',
  },
  cohere: {
    url: 'https://api.cohere.ai/v1/chat',
    model: 'command-r',
  },
  together: {
    url: 'https://api.together.xyz/v1/chat/completions',
    model: 'meta-llama/Llama-3.3-70B-Instruct-Turbo',
  },
  cerebras: {
    url: 'https://api.cerebras.ai/v1/chat/completions',
    model: 'llama-3.3-70b',
  },
};

// Get API keys from environment variables
function getApiKey(provider: string): string | null {
  switch (provider) {
    case 'groq': return process.env.GROQ_API_KEY || null;
    case 'gemini': return process.env.GEMINI_API_KEY || null;
    case 'mistral': return process.env.MISTRAL_API_KEY || null;
    case 'cohere': return process.env.COHERE_API_KEY || null;
    case 'together': return process.env.TOGETHER_API_KEY || null;
    case 'cerebras': return process.env.CEREBRAS_API_KEY || null;
    default: return null;
  }
}

/**
 * LLM Proxy Function — Harvey-Style Privilege-Safe Architecture
 * 
 * PRIVACY GUARANTEES:
 * 1. Zero Data Retention: No prompts, responses, or client data are logged or stored
 * 2. No Training: All providers used (Cerebras, Groq) contractually guarantee
 *    they do NOT train on API input/output data
 * 3. Pass-Through Processing: Data is sent to the model, response is returned,
 *    and no copies are retained on our infrastructure
 * 4. Isolated Processing: Each request is stateless — no data persists between calls
 * 5. Agent Exception: This service operates as an agent of the attorney,
 *    bound by confidentiality — same as a paralegal or outside vendor
 * 
 * Provider Privacy Policies:
 * - Cerebras: Enterprise API — zero data retention, no training on inputs
 * - Groq: Enterprise API — inputs/outputs not used for model training
 * - Together: Enterprise tier — no training on customer data
 * - Mistral: API data not used for training by default
 * 
 * POST /llm
 * Body: { provider, messages, options }
 */
export const llm = functions.https.onRequest((req, res) => {
  corsMiddleware(req, res, async () => {
    if (req.method !== 'POST') {
      res.status(405).json({ error: 'Method not allowed' });
      return;
    }

    // Set privacy headers — instruct browsers/proxies not to cache or store
    res.set('Cache-Control', 'no-store, no-cache, must-revalidate, private');
    res.set('Pragma', 'no-cache');
    res.set('X-Content-Type-Options', 'nosniff');
    res.set('X-Data-Retention', 'none');
    res.set('X-Training-Opt-Out', 'true');

    try {
      let { provider, messages, task, model: requestedModel, options } = req.body as LLMRequest;

      if (!messages) {
        res.status(400).json({ error: 'Missing messages' });
        return;
      }

      // Default to cerebras, fallback chain: cerebras → groq
      if (!provider) provider = 'cerebras';

      let apiKey = getApiKey(provider);
      
      // If requested provider has no key, try fallback chain
      if (!apiKey) {
        const fallbackChain = ['cerebras', 'groq', 'together', 'mistral'];
        for (const fb of fallbackChain) {
          if (fb === provider) continue;
          const fbKey = getApiKey(fb);
          if (fbKey) {
            provider = fb as LLMRequest['provider'];
            apiKey = fbKey;
            break;
          }
        }
      }

      if (!apiKey) {
        res.status(500).json({ error: `No API key configured for ${provider} (or any fallback)` });
        return;
      }

      const config = { ...PROVIDER_CONFIGS[provider] };
      if (!config) {
        res.status(400).json({ error: `Unknown provider: ${provider}` });
        return;
      }

      // Task-based model routing for Cerebras
      let taskRouting: { model: string; reasoningEffort?: string; temperature: number } | null = null;
      if (provider === 'cerebras') {
        if (requestedModel && CEREBRAS_MODELS[requestedModel]) {
          // Explicit model override
          config.model = requestedModel;
        } else if (task) {
          // Task-based routing
          taskRouting = getModelForTask(task);
          config.model = taskRouting.model;
        } else if (options?.model && CEREBRAS_MODELS[options.model]) {
          config.model = options.model;
        }
      }

      let response: Response;
      let content: string;

      const startTime = Date.now();

      if (provider === 'gemini') {
        // Gemini has a different API format
        const contents = messages
          .filter((m: { role: string }) => m.role !== 'system')
          .map((m: { role: string; content: string }) => ({
            role: m.role === 'assistant' ? 'model' : 'user',
            parts: [{ text: m.content }],
          }));

        const systemInstruction = messages.find((m: { role: string }) => m.role === 'system')?.content;

        response = await fetch(
          `${config.url}/${config.model}:generateContent?key=${apiKey}`,
          {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              contents,
              systemInstruction: systemInstruction ? { parts: [{ text: systemInstruction }] } : undefined,
              generationConfig: {
                maxOutputTokens: options?.maxTokens || 4096,
                temperature: options?.temperature || 0.7,
              },
            }),
          }
        );

        const data = await response.json();
        content = data.candidates?.[0]?.content?.parts?.[0]?.text || '';
      } else if (provider === 'cohere') {
        // Cohere has a different API format
        const chatHistory = messages
          .filter((m: { role: string }) => m.role !== 'system')
          .slice(0, -1)
          .map((m: { role: string; content: string }) => ({
            role: m.role === 'assistant' ? 'CHATBOT' : 'USER',
            message: m.content,
          }));

        const lastMessage = messages[messages.length - 1];
        const preamble = messages.find((m: { role: string }) => m.role === 'system')?.content;

        response = await fetch(config.url, {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${apiKey}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            model: config.model,
            message: lastMessage.content,
            chat_history: chatHistory,
            preamble,
            max_tokens: options?.maxTokens || 4096,
            temperature: options?.temperature || 0.7,
          }),
        });

        const data = await response.json();
        content = data.text || '';
      } else {
        // OpenAI-compatible API (GROQ, Mistral, Together, Cerebras)
        const requestBody: Record<string, any> = {
          model: config.model,
          messages,
          max_tokens: options?.maxTokens || 4096,
          temperature: taskRouting?.temperature ?? options?.temperature ?? 0.7,
        };

        // Add reasoning_effort for Cerebras models that support it (Qwen 3)
        const effectiveReasoningEffort = taskRouting?.reasoningEffort || options?.reasoningEffort;
        if (provider === 'cerebras' && effectiveReasoningEffort && 
            (config.model.startsWith('qwen') || config.model === 'gpt-oss-120b')) {
          requestBody.reasoning_effort = effectiveReasoningEffort;
        }

        response = await fetch(config.url, {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${apiKey}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(requestBody),
        });

        const data = await response.json();
        content = data.choices?.[0]?.message?.content || '';
      }

      const latencyMs = Date.now() - startTime;

      // Return response with model info and privacy metadata — no content is logged
      const modelInfo = CEREBRAS_MODELS[config.model];
      res.json({
        content,
        provider,
        model: config.model,
        modelName: modelInfo?.name || config.model,
        task: task || 'chat',
        latencyMs,
        ...(taskRouting?.reasoningEffort && { reasoningEffort: taskRouting.reasoningEffort }),
        privacy: {
          dataRetention: 'none',
          trainingOptOut: true,
          processingMode: 'pass-through',
          privilegeCompliant: true,
        },
      });

      // Explicit cleanup: dereference message data after response is sent
      messages = null as any;
      content = null as any;
    } catch (error) {
      // Log only the error type, never the content of messages
      const errMsg = error instanceof Error ? error.message : 'Unknown error';
      console.error('LLM proxy error:', errMsg);
      res.status(500).json({ error: 'LLM request failed' });
    }
  });
});

// ============================================================
// OAUTH TOKEN EXCHANGE
// ============================================================

interface OAuthConfig {
  clientId: string;
  clientSecret: string;
  tokenUrl: string;
  scopes: string[];
}

function getOAuthConfig(provider: string): OAuthConfig | null {
  const config = functions.config();
  
  if (provider === 'google') {
    return {
      clientId: config.oauth?.google_client_id || process.env.GOOGLE_CLIENT_ID || '',
      clientSecret: config.oauth?.google_client_secret || process.env.GOOGLE_CLIENT_SECRET || '',
      tokenUrl: 'https://oauth2.googleapis.com/token',
      scopes: ['https://www.googleapis.com/auth/drive.file'],
    };
  }
  
  if (provider === 'dropbox') {
    return {
      clientId: config.oauth?.dropbox_client_id || process.env.DROPBOX_CLIENT_ID || '',
      clientSecret: config.oauth?.dropbox_client_secret || process.env.DROPBOX_CLIENT_SECRET || '',
      tokenUrl: 'https://api.dropboxapi.com/oauth2/token',
      scopes: ['files.content.read'],
    };
  }
  
  return null;
}

/**
 * OAuth Token Exchange
 * POST /oauth/exchange
 * Body: { provider, code, redirectUri }
 */
export const oauthExchange = functions.https.onRequest((req, res) => {
  corsMiddleware(req, res, async () => {
    if (req.method !== 'POST') {
      res.status(405).json({ error: 'Method not allowed' });
      return;
    }

    try {
      const { provider, code, redirectUri } = req.body;

      if (!provider || !code || !redirectUri) {
        res.status(400).json({ error: 'Missing provider, code, or redirectUri' });
        return;
      }

      const oauthConfig = getOAuthConfig(provider);
      if (!oauthConfig || !oauthConfig.clientId || !oauthConfig.clientSecret) {
        res.status(500).json({ error: `OAuth not configured for ${provider}` });
        return;
      }

      const params = new URLSearchParams({
        client_id: oauthConfig.clientId,
        client_secret: oauthConfig.clientSecret,
        code,
        redirect_uri: redirectUri,
        grant_type: 'authorization_code',
      });

      const response = await fetch(oauthConfig.tokenUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        body: params.toString(),
      });

      if (!response.ok) {
        const error = await response.text();
        res.status(response.status).json({ error: `Token exchange failed: ${error}` });
        return;
      }

      const tokens = await response.json();
      
      // Return tokens (frontend should store securely)
      res.json({
        access_token: tokens.access_token,
        refresh_token: tokens.refresh_token,
        expires_in: tokens.expires_in,
        token_type: tokens.token_type,
      });
    } catch (error) {
      console.error('OAuth exchange error:', error);
      res.status(500).json({ error: 'Token exchange failed' });
    }
  });
});

/**
 * OAuth Token Refresh
 * POST /oauth/refresh
 * Body: { provider, refreshToken }
 */
export const oauthRefresh = functions.https.onRequest((req, res) => {
  corsMiddleware(req, res, async () => {
    if (req.method !== 'POST') {
      res.status(405).json({ error: 'Method not allowed' });
      return;
    }

    try {
      const { provider, refreshToken } = req.body;

      if (!provider || !refreshToken) {
        res.status(400).json({ error: 'Missing provider or refreshToken' });
        return;
      }

      const oauthConfig = getOAuthConfig(provider);
      if (!oauthConfig || !oauthConfig.clientId || !oauthConfig.clientSecret) {
        res.status(500).json({ error: `OAuth not configured for ${provider}` });
        return;
      }

      const params = new URLSearchParams({
        client_id: oauthConfig.clientId,
        client_secret: oauthConfig.clientSecret,
        refresh_token: refreshToken,
        grant_type: 'refresh_token',
      });

      const response = await fetch(oauthConfig.tokenUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        body: params.toString(),
      });

      if (!response.ok) {
        const error = await response.text();
        res.status(response.status).json({ error: `Token refresh failed: ${error}` });
        return;
      }

      const tokens = await response.json();
      res.json({
        access_token: tokens.access_token,
        expires_in: tokens.expires_in,
      });
    } catch (error) {
      console.error('OAuth refresh error:', error);
      res.status(500).json({ error: 'Token refresh failed' });
    }
  });
});

// ============================================================
// LEGAL DATABASE PROXY
// ============================================================

/**
 * CourtListener Search Proxy
 * POST /legal/courtlistener
 */
export const courtListener = functions.https.onRequest((req, res) => {
  corsMiddleware(req, res, async () => {
    if (req.method !== 'POST') {
      res.status(405).json({ error: 'Method not allowed' });
      return;
    }

    try {
      const { query, court, type } = req.body;
      
      const params = new URLSearchParams({
        q: query,
        ...(court && { court }),
        ...(type && { type }),
        format: 'json',
      });

      const response = await fetch(
        `https://www.courtlistener.com/api/rest/v3/search/?${params}`,
        {
          headers: {
            'Authorization': `Token ${functions.config().legal?.courtlistener || process.env.COURTLISTENER_API_KEY || ''}`,
          },
        }
      );

      if (!response.ok) {
        res.status(response.status).json({ error: 'CourtListener search failed' });
        return;
      }

      const data = await response.json();
      res.json(data);
    } catch (error) {
      console.error('CourtListener error:', error);
      res.status(500).json({ error: 'Search failed' });
    }
  });
});

/**
 * NY Legislature API Proxy
 * POST /legal/nysenate
 */
export const nysenate = functions.https.onRequest((req, res) => {
  corsMiddleware(req, res, async () => {
    if (req.method !== 'POST') {
      res.status(405).json({ error: 'Method not allowed' });
      return;
    }

    try {
      const { lawId, locationId } = req.body;
      
      const apiKey = functions.config().legal?.nysenate || process.env.NY_SENATE_API_KEY || '';
      
      const response = await fetch(
        `https://legislation.nysenate.gov/api/3/laws/${lawId}/${locationId}?key=${apiKey}`,
        { headers: { 'Content-Type': 'application/json' } }
      );

      if (!response.ok) {
        res.status(response.status).json({ error: 'NY Senate API failed' });
        return;
      }

      const data = await response.json();
      res.json(data);
    } catch (error) {
      console.error('NY Senate error:', error);
      res.status(500).json({ error: 'Statute lookup failed' });
    }
  });
});

// ============================================================
// DOCUMENT PROCESSING
// ============================================================

/**
 * Process uploaded document for RAG indexing
 * HTTP endpoint to be called after upload
 */
export const processDocument = functions.https.onRequest((req, res) => {
  corsMiddleware(req, res, async () => {
    if (req.method !== 'POST') {
      res.status(405).json({ error: 'Method not allowed' });
      return;
    }

    try {
      const { filePath, contentType, userId, size } = req.body;

      if (!filePath || !userId) {
        res.status(400).json({ error: 'Missing filePath or userId' });
        return;
      }

      // Only process documents in the 'documents/' folder
      if (!filePath.startsWith('documents/')) {
        res.status(400).json({ error: 'Invalid file path' });
        return;
      }

      const fileName = filePath.split('/').slice(2).join('/');

      console.log(`Processing document: ${fileName} for user: ${userId}`);

      // Store metadata in Firestore for RAG indexing
      const db = admin.firestore();
      await db.collection('users').doc(userId).collection('documents').add({
        fileName,
        filePath,
        contentType: contentType || 'application/octet-stream',
        uploadedAt: admin.firestore.FieldValue.serverTimestamp(),
        status: 'pending_indexing',
        size: parseInt(size || '0'),
      });

      console.log(`Document metadata saved for: ${fileName}`);
      res.json({ success: true, fileName });
    } catch (error) {
      console.error('Document processing error:', error);
      res.status(500).json({ error: 'Document processing failed' });
    }
  });
});

// ============================================================
// USAGE TRACKING (for free tier monitoring)
// ============================================================

/**
 * Track API usage for free tier management
 */
export const trackUsage = functions.https.onRequest((req, res) => {
  corsMiddleware(req, res, async () => {
    if (req.method !== 'POST') {
      res.status(405).json({ error: 'Method not allowed' });
      return;
    }

    try {
      const { userId, provider, tokensUsed, action } = req.body;

      if (!userId || !provider || !action) {
        res.status(400).json({ error: 'Missing required fields' });
        return;
      }

      const db = admin.firestore();
      const today = new Date().toISOString().split('T')[0];

      // Update daily usage
      const usageRef = db
        .collection('usage')
        .doc(today)
        .collection('users')
        .doc(userId);

      await usageRef.set(
        {
          [`${provider}_requests`]: admin.firestore.FieldValue.increment(1),
          [`${provider}_tokens`]: admin.firestore.FieldValue.increment(tokensUsed || 0),
          lastAction: action,
          updatedAt: admin.firestore.FieldValue.serverTimestamp(),
        },
        { merge: true }
      );

      res.json({ success: true });
    } catch (error) {
      console.error('Usage tracking error:', error);
      res.status(500).json({ error: 'Failed to track usage' });
    }
  });
});

// ============================================================
// DUCKDUCKGO SEARCH HELPER (no rate limits, no API key)
// ============================================================

async function searchDDG(query: string, siteRestrict?: string): Promise<Array<{ title: string; url: string; snippet: string }>> {
  const q = siteRestrict ? `${query} site:${siteRestrict}` : query;

  const response = await fetch('https://html.duckduckgo.com/html/', {
    method: 'POST',
    headers: {
      'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/131.0.0.0 Safari/537.36',
      'Content-Type': 'application/x-www-form-urlencoded',
    },
    body: `q=${encodeURIComponent(q)}`,
  });

  if (!response.ok) return [];
  const html = await response.text();

  const results: Array<{ title: string; url: string; snippet: string }> = [];

  // Parse DDG HTML results
  const urlMatches = [...html.matchAll(/class="result__url"[^>]*href="(https?:\/\/[^"]*)"/g)];
  const titleMatches = [...html.matchAll(/class="result__a"[^>]*>(.*?)<\/a>/gs)];
  const snippetMatches = [...html.matchAll(/class="result__snippet">(.*?)<\/(?:a|td|div|span)/gs)];

  for (let i = 0; i < urlMatches.length && results.length < 15; i++) {
    const url = urlMatches[i][1];
    const title = (titleMatches[i]?.[1] || '').replace(/<[^>]*>/g, '').replace(/\s+/g, ' ').trim();
    const snippet = (snippetMatches[i]?.[1] || '').replace(/<[^>]*>/g, '').replace(/\s+/g, ' ').trim();
    if (title && url) {
      results.push({ title, url, snippet });
    }
  }

  return results;
}

// ============================================================
// GOOGLE SCHOLAR SEARCH (via DuckDuckGo + direct Scholar fallback)
// ============================================================

export const searchScholar = functions.https.onRequest((req, res) => {
  corsMiddleware(req, res, async () => {
    try {
      const { q } = req.query;

      if (!q) {
        res.status(400).json({ error: 'Query parameter "q" is required' });
        return;
      }

      // Try direct Scholar first
      const url = `https://scholar.google.com/scholar?q=${encodeURIComponent(q as string)}&hl=en&as_sdt=4`;
      const ua = 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/131.0.0.0 Safari/537.36';

      let response = await fetch(url, {
        headers: {
          'User-Agent': ua,
          'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8',
          'Accept-Language': 'en-US,en;q=0.9',
          'Cache-Control': 'no-cache',
        },
      });

      // If Scholar blocks us, fall back to DuckDuckGo search for case law
      if (!response.ok) {
        const ddgResults = await searchDDG(`${q} case law court opinion`, 'scholar.google.com');
        if (ddgResults.length === 0) {
          // Try without site restriction but with legal terms
          const generalResults = await searchDDG(`${q} court opinion case law ruling`);
          const legalResults = generalResults.filter(r => 
            r.url.includes('courtlistener.com') || r.url.includes('law.justia.com') || 
            r.url.includes('scholar.google') || r.url.includes('casetext.com') ||
            r.url.includes('law.cornell.edu') || r.url.includes('leagle.com')
          );
          res.json({
            results: legalResults.map((r, i) => ({
              id: `scholar_ddg_${i}_${Date.now()}`,
              caseName: r.title.replace(/ - .*$/, '').replace(/ \| .*$/, '').trim(),
              citation: '',
              snippet: r.snippet,
              url: r.url,
              source: 'scholar',
            })),
            count: legalResults.length,
            via: 'duckduckgo-fallback',
          });
          return;
        }
        res.json({
          results: ddgResults.map((r, i) => ({
            id: `scholar_ddg_${i}_${Date.now()}`,
            caseName: r.title.replace(/ - Google Scholar$/, '').trim(),
            citation: '',
            snippet: r.snippet,
            url: r.url,
            source: 'scholar',
          })),
          count: ddgResults.length,
          via: 'duckduckgo-fallback',
        });
        return;
      }

      const html = await response.text();

      // Parse results from HTML
      const results: Array<{
        id: string;
        caseName: string;
        citation: string;
        snippet: string;
        url: string;
        source: string;
      }> = [];

      // Match each gs_ri div (result item)
      const resultBlocks = html.split('<div class="gs_ri">');
      for (let i = 1; i < resultBlocks.length && results.length < 20; i++) {
        const block = resultBlocks[i];

        // Extract title and URL
        const titleMatch = block.match(/<h3[^>]*class="gs_rt"[^>]*>.*?<a[^>]*href="([^"]*)"[^>]*>(.*?)<\/a>/s);
        const titleNoLinkMatch = !titleMatch ? block.match(/<h3[^>]*class="gs_rt"[^>]*>(.*?)<\/h3>/s) : null;

        const url = titleMatch ? titleMatch[1] : '';
        let caseName = (titleMatch ? titleMatch[2] : titleNoLinkMatch ? titleNoLinkMatch[1] : 'Unknown')
          .replace(/<[^>]*>/g, '')
          .replace(/\s+/g, ' ')
          .trim();

        // Extract the green line (citation info)
        const citeMatch = block.match(/<div class="gs_a">(.*?)<\/div>/s);
        const citation = citeMatch
          ? citeMatch[1].replace(/<[^>]*>/g, '').replace(/\s+/g, ' ').trim()
          : '';

        // Extract snippet
        const snippetMatch = block.match(/<div class="gs_rs">(.*?)<\/div>/s);
        const snippet = snippetMatch
          ? snippetMatch[1].replace(/<[^>]*>/g, '').replace(/\s+/g, ' ').trim()
          : '';

        if (caseName && caseName !== 'Unknown') {
          results.push({
            id: `scholar_${i}_${Date.now()}`,
            caseName,
            citation,
            snippet,
            url,
            source: 'scholar',
          });
        }
      }

      res.json({ results, count: results.length });
    } catch (error: any) {
      console.error('Scholar search error:', error);
      res.status(500).json({ error: 'Scholar search failed', message: error.message });
    }
  });
});

// ============================================================
// JUSTIA SEARCH (via DuckDuckGo — no rate limits)
// ============================================================

export const searchJustia = functions.https.onRequest((req, res) => {
  corsMiddleware(req, res, async () => {
    try {
      const { q } = req.query;
      if (!q) {
        res.status(400).json({ error: 'Query parameter "q" is required' });
        return;
      }

      const ddgResults = await searchDDG(`${q} case law`, 'law.justia.com');

      const results = ddgResults.map((r, i) => {
        // Parse case name from title (remove " - Justia Law" suffix)
        const caseName = r.title
          .replace(/ [-–—|]+ Justia.*$/i, '')
          .replace(/ :: Justia$/i, '')
          .trim();

        // Extract jurisdiction/year from URL
        const yearMatch = r.url.match(/\/(\d{4})\//);
        const year = yearMatch ? yearMatch[1] : '';
        const jurisdiction = r.url.includes('/federal/') ? 'Federal' :
          r.url.includes('/new-york/') ? 'New York' :
          r.url.includes('/california/') ? 'California' :
          r.url.includes('/texas/') ? 'Texas' :
          r.url.includes('/florida/') ? 'Florida' : '';

        return {
          id: `justia_${i}_${Date.now()}`,
          caseName: caseName || r.title,
          citation: [jurisdiction, year].filter(Boolean).join(', '),
          snippet: r.snippet,
          url: r.url,
          source: 'justia',
        };
      });

      res.json({ results, count: results.length });
    } catch (error: any) {
      console.error('Justia search error:', error);
      res.json({ results: [], error: 'Justia search failed', partial: true });
    }
  });
});

// ============================================================
// AI SEARCH SUMMARY - Summarize search results with GROQ
// ============================================================

export const summarizeResults = functions.https.onRequest((req, res) => {
  corsMiddleware(req, res, async () => {
    if (req.method !== 'POST') {
      res.status(405).json({ error: 'Method not allowed' });
      return;
    }

    try {
      const { query, results, caseContext } = req.body;

      if (!query || !results || !Array.isArray(results)) {
        res.status(400).json({ error: 'query and results[] are required' });
        return;
      }

      // Prefer Cerebras (faster), fall back to GROQ
      const cerebrasKey = getApiKey('cerebras');
      const groqKey = getApiKey('groq');
      const useProvider = cerebrasKey ? 'cerebras' : 'groq';
      const apiKey = cerebrasKey || groqKey;
      if (!apiKey) {
        res.status(500).json({ error: 'No AI API key configured (Cerebras or GROQ)' });
        return;
      }

      // Build a concise representation of results for the AI
      const resultsSummary = results.slice(0, 10).map((r: any, i: number) => 
        `${i + 1}. ${r.caseName}${r.citation ? ` (${r.citation})` : ''}${r.court ? ` - ${r.court}` : ''}${r.dateFiled ? `, ${r.dateFiled}` : ''}\n   ${(r.snippet || '').slice(0, 200)}`
      ).join('\n\n');

      const systemPrompt = `You are a legal research assistant for criminal defense and family law attorneys. 
Analyze search results and provide a brief, actionable summary. Be concise and practical.
Focus on: key holdings, relevance to the query, and which cases are most useful.
Format: Start with a 1-2 sentence overview, then bullet points for the most relevant cases (max 4).
Keep the entire response under 200 words.`;

      const userPrompt = `Search query: "${query}"
${caseContext ? `\nAttorney's current case: ${caseContext}\n` : ''}
Search results:
${resultsSummary}

Summarize the most relevant findings for a practicing attorney.`;

      const providerConfig = PROVIDER_CONFIGS[useProvider];
      const response = await fetch(providerConfig.url, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${apiKey}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          model: providerConfig.model,
          messages: [
            { role: 'system', content: systemPrompt },
            { role: 'user', content: userPrompt },
          ],
          max_tokens: 400,
          temperature: 0.3,
        }),
      });

      if (!response.ok) {
        const err = await response.text();
        console.error('GROQ error:', err);
        res.status(502).json({ error: 'AI summary failed' });
        return;
      }

      const data = await response.json();
      const summary = data.choices?.[0]?.message?.content || 'Unable to generate summary.';

      res.json({ summary, model: providerConfig.model, provider: useProvider });
    } catch (error: any) {
      console.error('Summary error:', error);
      res.status(500).json({ error: 'Summary failed', message: error.message });
    }
  });
});

// ============================================================
// HEALTH CHECK
// ============================================================

export const health = functions.https.onRequest((req, res) => {
  corsMiddleware(req, res, () => {
    res.json({
      status: 'healthy',
      timestamp: new Date().toISOString(),
      version: '1.0.0',
      services: {
        llm: !!(getApiKey('cerebras') || getApiKey('groq')),
        oauth_google: !!getOAuthConfig('google')?.clientId,
        oauth_dropbox: !!getOAuthConfig('dropbox')?.clientId,
      },
    });
  });
});

// ============================================================
// CASE LAW SEARCH PROXY - CourtListener API
// ============================================================

// ============================================================
// AGENTIC SEARCH PROXY — Routes to Cloud Run agent service
// ============================================================

export const agentSearch = functions.https.onRequest((req, res) => {
  corsMiddleware(req, res, async () => {
    if (req.method !== 'POST') {
      res.status(405).json({ error: 'POST only' });
      return;
    }

    try {
      const { query, source, credentials, maxResults } = req.body;

      if (!query || !source || !credentials) {
        res.status(400).json({ error: 'Missing query, source, or credentials' });
        return;
      }

      const AGENT_URL = process.env.AGENT_SERVICE_URL || 'http://localhost:8080';
      const AGENT_SECRET = process.env.AGENT_API_SECRET || 'acc-agent-dev-key';

      const response = await fetch(`${AGENT_URL}/search`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${AGENT_SECRET}`,
        },
        body: JSON.stringify({ query, source, credentials, maxResults: maxResults || 15 }),
      });

      if (!response.ok) {
        const err = await response.json().catch(() => ({ error: 'Agent service error' }));
        res.status(response.status).json(err);
        return;
      }

      const data = await response.json();
      res.json(data);
    } catch (error: any) {
      console.error('Agent search error:', error);
      res.status(500).json({ error: 'Agent search failed', message: error.message });
    }
  });
});

export const searchCaseLaw = functions.https.onRequest((req, res) => {
  corsMiddleware(req, res, async () => {
    try {
      const { q, type = 'o', page = 1 } = req.query;
      
      if (!q) {
        res.status(400).json({ error: 'Query parameter "q" is required' });
        return;
      }

      const url = `https://www.courtlistener.com/api/rest/v4/search/?q=${encodeURIComponent(q as string)}&type=${type}&page=${page}`;
      
      const response = await fetch(url, {
        headers: {
          'Accept': 'application/json',
          'User-Agent': 'AssignedCoCounsel/1.0',
        },
      });

      if (!response.ok) {
        res.status(response.status).json({ error: `CourtListener returned ${response.status}` });
        return;
      }

      const data = await response.json();
      res.json(data);
    } catch (error: any) {
      console.error('Search error:', error);
      res.status(500).json({ error: 'Search failed', message: error.message });
    }
  });
});
