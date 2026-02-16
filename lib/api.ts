/**
 * API Client for Firebase Functions Backend
 * 
 * This replaces direct API calls to LLM providers with secure server-side proxying.
 * All API keys are kept on the server - never exposed to the client.
 */

// Firebase Functions base URL (update after deployment)
const FUNCTIONS_BASE_URL = process.env.NEXT_PUBLIC_FUNCTIONS_URL || 
  'https://us-central1-assigned-co-counsel.cloudfunctions.net';

export type LLMProvider = 'cerebras' | 'groq' | 'gemini' | 'mistral' | 'cohere' | 'together';

export interface Message {
  role: 'system' | 'user' | 'assistant';
  content: string;
}

export interface LLMResponse {
  content: string;
  provider: LLMProvider;
  model: string;
  latencyMs: number;
}

/**
 * Call LLM through secure server proxy
 */
export async function callLLM(
  provider: LLMProvider,
  messages: Message[],
  options?: { maxTokens?: number; temperature?: number }
): Promise<LLMResponse> {
  const response = await fetch(`${FUNCTIONS_BASE_URL}/llm`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ provider, messages, options }),
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.error || 'LLM request failed');
  }

  return response.json();
}

/**
 * Call LLM with fallback chain
 */
export async function callWithFallback(
  messages: Message[],
  preferredOrder: LLMProvider[] = ['cerebras', 'together', 'mistral', 'gemini']
): Promise<LLMResponse> {
  for (const provider of preferredOrder) {
    try {
      return await callLLM(provider, messages);
    } catch (error) {
      console.warn(`${provider} failed, trying next...`);
    }
  }
  throw new Error('All LLM providers failed');
}

/**
 * OAuth Token Exchange
 */
export async function exchangeOAuthToken(
  provider: 'google' | 'dropbox',
  code: string,
  redirectUri: string
): Promise<{
  access_token: string;
  refresh_token?: string;
  expires_in: number;
}> {
  const response = await fetch(`${FUNCTIONS_BASE_URL}/oauthExchange`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ provider, code, redirectUri }),
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.error || 'OAuth exchange failed');
  }

  return response.json();
}

/**
 * Refresh OAuth Token
 */
export async function refreshOAuthToken(
  provider: 'google' | 'dropbox',
  refreshToken: string
): Promise<{ access_token: string; expires_in: number }> {
  const response = await fetch(`${FUNCTIONS_BASE_URL}/oauthRefresh`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ provider, refreshToken }),
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.error || 'Token refresh failed');
  }

  return response.json();
}

/**
 * Search CourtListener
 */
export async function searchCourtListener(
  query: string,
  options?: { court?: string; type?: string }
): Promise<{
  count: number;
  results: Array<{
    id: number;
    caseName: string;
    citation: string;
    court: string;
    dateFiled: string;
    docketNumber: string;
    snippet: string;
  }>;
}> {
  const response = await fetch(`${FUNCTIONS_BASE_URL}/courtListener`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ query, ...options }),
  });

  if (!response.ok) {
    throw new Error('CourtListener search failed');
  }

  return response.json();
}

/**
 * Get NY Statute
 */
export async function getNYStatute(
  lawId: string,
  locationId: string
): Promise<{
  lawId: string;
  locationId: string;
  title: string;
  text: string;
}> {
  const response = await fetch(`${FUNCTIONS_BASE_URL}/nysenate`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ lawId, locationId }),
  });

  if (!response.ok) {
    throw new Error('NY Senate API failed');
  }

  return response.json();
}

/**
 * Track usage (for free tier monitoring)
 */
export async function trackUsage(
  userId: string,
  provider: string,
  tokensUsed: number,
  action: string
): Promise<void> {
  try {
    await fetch(`${FUNCTIONS_BASE_URL}/trackUsage`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ userId, provider, tokensUsed, action }),
    });
  } catch {
    // Silently fail - usage tracking is non-critical
  }
}

/**
 * Health check
 */
export async function healthCheck(): Promise<{
  status: string;
  timestamp: string;
  version: string;
  services: Record<string, boolean>;
}> {
  const response = await fetch(`${FUNCTIONS_BASE_URL}/health`);
  return response.json();
}
