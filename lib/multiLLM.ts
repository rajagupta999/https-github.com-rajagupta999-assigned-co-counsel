/**
 * Multi-LLM Service
 * Orchestrates multiple free/cheap LLM providers for cost-effective AI
 * 
 * Providers:
 * - GROQ (Llama 3.3 70B) - Fast, free tier
 * - Kimia AI - Free tier available
 * - Google Gemini - Free tier
 * - Mistral - Free tier
 * - Cohere - Free tier
 * - Together AI - Free credits
 * - Cerebras - Fast inference
 */

export type LLMProvider = 
  | 'groq' 
  | 'kimia' 
  | 'gemini' 
  | 'mistral' 
  | 'cohere' 
  | 'together'
  | 'cerebras';

export type TaskType = 'chat' | 'draft' | 'research' | 'analysis' | 'citation' | 'summarize' | 'red-team' | 'paralegal';

export interface LLMConfig {
  provider: LLMProvider;
  model: string;
  apiKey?: string;
  baseUrl?: string;
  maxTokens?: number;
  temperature?: number;
  task?: TaskType;
}

export interface LLMResponse {
  content: string;
  provider: LLMProvider;
  model: string;
  tokensUsed?: number;
  latencyMs: number;
}

export interface Message {
  role: 'system' | 'user' | 'assistant';
  content: string;
}

// Provider configurations
const PROVIDERS: Record<LLMProvider, LLMConfig> = {
  groq: {
    provider: 'cerebras',
    model: 'llama-3.3-70b-versatile',
    baseUrl: 'https://api.groq.com/openai/v1/chat/completions',
    maxTokens: 4096,
    temperature: 0.7,
  },
  kimia: {
    provider: 'kimia',
    model: 'kimia-v1',
    baseUrl: 'https://api.kimia.ai/v1/chat/completions',
    maxTokens: 4096,
    temperature: 0.7,
  },
  gemini: {
    provider: 'gemini',
    model: 'gemini-1.5-flash',
    baseUrl: 'https://generativelanguage.googleapis.com/v1beta/models',
    maxTokens: 4096,
    temperature: 0.7,
  },
  mistral: {
    provider: 'mistral',
    model: 'mistral-small-latest',
    baseUrl: 'https://api.mistral.ai/v1/chat/completions',
    maxTokens: 4096,
    temperature: 0.7,
  },
  cohere: {
    provider: 'cohere',
    model: 'command-r',
    baseUrl: 'https://api.cohere.ai/v1/chat',
    maxTokens: 4096,
    temperature: 0.7,
  },
  together: {
    provider: 'together',
    model: 'meta-llama/Llama-3.3-70B-Instruct-Turbo',
    baseUrl: 'https://api.together.xyz/v1/chat/completions',
    maxTokens: 4096,
    temperature: 0.7,
  },
  cerebras: {
    provider: 'cerebras',
    model: 'llama-3.3-70b',
    baseUrl: 'https://api.cerebras.ai/v1/chat/completions',
    maxTokens: 4096,
    temperature: 0.7,
  },
};

// API Keys from environment
// IMPORTANT: For production, use Firebase Functions proxy (lib/api.ts)
// These client-side keys are ONLY for development/testing
// All AI calls route through the Firebase Function proxy (privilege-safe, zero-retention)
// Direct API keys are only used if explicitly set as NEXT_PUBLIC_ env vars
const API_KEYS: Partial<Record<LLMProvider, string>> = {
  cerebras: 'USE_PROXY',
  groq: 'USE_PROXY',
  kimia: process.env.NEXT_PUBLIC_KIMIA_API_KEY || 'USE_PROXY',
  gemini: process.env.NEXT_PUBLIC_GEMINI_API_KEY || 'USE_PROXY',
  mistral: process.env.NEXT_PUBLIC_MISTRAL_API_KEY || 'USE_PROXY',
  cohere: process.env.NEXT_PUBLIC_COHERE_API_KEY || 'USE_PROXY',
  together: process.env.NEXT_PUBLIC_TOGETHER_API_KEY || 'USE_PROXY',
};

/**
 * Call a specific LLM provider
 */
export async function callLLM(
  provider: LLMProvider,
  messages: Message[],
  options?: Partial<LLMConfig>
): Promise<LLMResponse> {
  const config = { ...PROVIDERS[provider], ...options };
  const apiKey = options?.apiKey || API_KEYS[provider];
  
  if (!apiKey) {
    throw new Error(`No API key configured for ${provider}`);
  }

  const startTime = Date.now();

  try {
    let content: string;

    // Route through Firebase Function proxy when no direct API key
    if (apiKey === 'USE_PROXY') {
      const proxyUrl = 'https://us-central1-assigned-co-counsel.cloudfunctions.net/llm';
      const proxyRes = await fetch(proxyUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ provider, messages, task: config.task || options?.task, options: { model: config.model, temperature: config.temperature, maxTokens: config.maxTokens } }),
      });
      if (!proxyRes.ok) {
        const err = await proxyRes.json().catch(() => ({}));
        throw new Error(err.error || `Proxy error: ${proxyRes.status}`);
      }
      const proxyData = await proxyRes.json();
      content = proxyData.content || '';
    } else {
      let response: Response;

      switch (provider) {
        case 'gemini':
          response = await callGemini(messages, config, apiKey);
          const geminiData = await response.json();
          content = geminiData.candidates?.[0]?.content?.parts?.[0]?.text || '';
          break;

        case 'cohere':
          response = await callCohere(messages, config, apiKey);
          const cohereData = await response.json();
          content = cohereData.text || '';
          break;

        default:
          // OpenAI-compatible API (GROQ, Mistral, Together, Cerebras, Kimia)
          response = await callOpenAICompatible(messages, config, apiKey);
          const data = await response.json();
          content = data.choices?.[0]?.message?.content || '';
      }
    }

    return {
      content,
      provider,
      model: config.model,
      latencyMs: Date.now() - startTime,
    };
  } catch (error) {
    console.error(`Error calling ${provider}:`, error);
    throw error;
  }
}

async function callOpenAICompatible(
  messages: Message[],
  config: LLMConfig,
  apiKey: string
): Promise<Response> {
  return fetch(config.baseUrl!, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${apiKey}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      model: config.model,
      messages,
      max_tokens: config.maxTokens,
      temperature: config.temperature,
    }),
  });
}

async function callGemini(
  messages: Message[],
  config: LLMConfig,
  apiKey: string
): Promise<Response> {
  // Convert messages to Gemini format
  const contents = messages
    .filter(m => m.role !== 'system')
    .map(m => ({
      role: m.role === 'assistant' ? 'model' : 'user',
      parts: [{ text: m.content }],
    }));

  const systemInstruction = messages.find(m => m.role === 'system')?.content;

  return fetch(`${config.baseUrl}/${config.model}:generateContent?key=${apiKey}`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      contents,
      systemInstruction: systemInstruction ? { parts: [{ text: systemInstruction }] } : undefined,
      generationConfig: {
        maxOutputTokens: config.maxTokens,
        temperature: config.temperature,
      },
    }),
  });
}

async function callCohere(
  messages: Message[],
  config: LLMConfig,
  apiKey: string
): Promise<Response> {
  const chatHistory = messages
    .filter(m => m.role !== 'system')
    .slice(0, -1)
    .map(m => ({
      role: m.role === 'assistant' ? 'CHATBOT' : 'USER',
      message: m.content,
    }));

  const lastMessage = messages[messages.length - 1];
  const preamble = messages.find(m => m.role === 'system')?.content;

  return fetch(config.baseUrl!, {
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
      max_tokens: config.maxTokens,
      temperature: config.temperature,
    }),
  });
}

/**
 * Call multiple LLMs in parallel and return all responses
 */
export async function callMultipleLLMs(
  providers: LLMProvider[],
  messages: Message[]
): Promise<LLMResponse[]> {
  const availableProviders = providers.filter(p => API_KEYS[p]);
  
  const results = await Promise.allSettled(
    availableProviders.map(provider => callLLM(provider, messages))
  );

  return results
    .filter((r): r is PromiseFulfilledResult<LLMResponse> => r.status === 'fulfilled')
    .map(r => r.value);
}

/**
 * Call LLM with fallback chain
 */
export async function callWithFallback(
  messages: Message[],
  preferredOrder: LLMProvider[] = ['cerebras', 'together', 'mistral', 'gemini']
): Promise<LLMResponse> {
  for (const provider of preferredOrder) {
    if (!API_KEYS[provider]) continue;
    
    try {
      return await callLLM(provider, messages);
    } catch (error) {
      console.warn(`${provider} failed, trying next...`);
    }
  }
  
  throw new Error('All LLM providers failed');
}

/**
 * Stream response from LLM
 */
export async function streamLLM(
  provider: LLMProvider,
  messages: Message[],
  onChunk: (chunk: string) => void,
  options?: Partial<LLMConfig>
): Promise<string> {
  const config = { ...PROVIDERS[provider], ...options };
  const apiKey = options?.apiKey || API_KEYS[provider];

  if (!apiKey) {
    throw new Error(`No API key configured for ${provider}`);
  }

  // Route through Firebase Function proxy when no direct API key
  if (apiKey === 'USE_PROXY') {
    const response = await callLLM(provider, messages, options);
    onChunk(response.content);
    return response.content;
  }

  // Only OpenAI-compatible APIs support streaming easily
  if (!['groq', 'together', 'mistral', 'cerebras', 'kimia'].includes(provider)) {
    const response = await callLLM(provider, messages, options);
    onChunk(response.content);
    return response.content;
  }

  const response = await fetch(config.baseUrl!, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${apiKey}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      model: config.model,
      messages,
      max_tokens: config.maxTokens,
      temperature: config.temperature,
      stream: true,
    }),
  });

  if (!response.ok || !response.body) {
    throw new Error(`Stream failed: ${response.status}`);
  }

  const reader = response.body.getReader();
  const decoder = new TextDecoder();
  let fullContent = '';

  while (true) {
    const { done, value } = await reader.read();
    if (done) break;

    const chunk = decoder.decode(value);
    const lines = chunk.split('\n').filter(line => line.trim() !== '');

    for (const line of lines) {
      if (line.startsWith('data: ')) {
        const data = line.slice(6);
        if (data === '[DONE]') continue;

        try {
          const parsed = JSON.parse(data);
          const content = parsed.choices?.[0]?.delta?.content || '';
          if (content) {
            fullContent += content;
            onChunk(content);
          }
        } catch {
          // Skip malformed JSON
        }
      }
    }
  }

  return fullContent;
}

/**
 * Get available providers (those with API keys configured)
 */
export function getAvailableProviders(): LLMProvider[] {
  return Object.entries(API_KEYS)
    .filter(([_, key]) => !!key)
    .map(([provider]) => provider as LLMProvider);
}

/**
 * Estimate cost for a request (all our providers have free tiers)
 */
export function estimateCost(provider: LLMProvider, tokens: number): number {
  // All providers we use have generous free tiers
  // This is for tracking/budgeting purposes
  const costs: Record<LLMProvider, number> = {
    groq: 0,        // Free
    kimia: 0,       // Free
    gemini: 0,      // Free tier
    mistral: 0.001, // Very cheap
    cohere: 0,      // Free tier
    together: 0,    // Free credits
    cerebras: 0,    // Free tier
  };
  
  return costs[provider] * (tokens / 1000);
}
