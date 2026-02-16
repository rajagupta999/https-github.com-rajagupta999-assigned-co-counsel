// LLM Service - Multi-model AI integration for insurance operations
// Supports: GPT-4, Claude 3, Gemini, Groq

export type LLMProvider = 'cerebras' | 'gpt-4' | 'claude-3' | 'gemini' | 'groq';

export interface LLMConfig {
  provider: LLMProvider;
  apiKey?: string;
  temperature?: number;
  maxTokens?: number;
}

export interface LLMResponse {
  content: string;
  provider: LLMProvider;
  tokensUsed?: number;
  latencyMs?: number;
}

export interface DocumentAnalysisResult {
  documentType: string;
  extractedData: Record<string, unknown>;
  summary: string;
  riskFlags: string[];
  confidence: number;
}

export interface ClaimAnalysisResult {
  legitimacyScore: number;
  fraudIndicators: string[];
  recommendedAction: string;
  estimatedSettlement: number;
  reasoning: string;
}

export interface QuoteRecommendation {
  recommendedCarrier: string;
  reasoning: string;
  coverageGaps: string[];
  suggestedAddons: string[];
  competitiveAnalysis: string;
}

// ============ LLM PROVIDER CONFIGS ============

const LLM_CONFIGS: Record<LLMProvider, { name: string; description: string; strengths: string[] }> = {
  'cerebras': {
    name: 'Cerebras',
    description: 'Ultra-fast Llama 3.3 70B inference',
    strengths: ['Fastest inference', 'Low latency', 'Cost-effective']
  },
  'gpt-4': {
    name: 'GPT-4',
    description: 'OpenAI\'s most capable model',
    strengths: ['Complex reasoning', 'Document analysis', 'Code generation']
  },
  'claude-3': {
    name: 'Claude 3',
    description: 'Anthropic\'s latest model',
    strengths: ['Long context', 'Nuanced analysis', 'Safety-focused']
  },
  'gemini': {
    name: 'Gemini',
    description: 'Google\'s multimodal AI',
    strengths: ['Multimodal', 'Fast responses', 'Google integration']
  },
  'groq': {
    name: 'Groq',
    description: 'Ultra-fast inference',
    strengths: ['Speed', 'Low latency', 'Cost-effective']
  }
};

// ============ LLM SERVICE CLASS ============

export class LLMService {
  private config: LLMConfig;

  constructor(config: LLMConfig) {
    this.config = {
      temperature: 0.7,
      maxTokens: 2000,
      ...config
    };
  }

  static getProviderInfo(provider: LLMProvider) {
    return LLM_CONFIGS[provider];
  }

  static getAllProviders() {
    return Object.entries(LLM_CONFIGS).map(([key, value]) => ({
      id: key as LLMProvider,
      ...value
    }));
  }

  async complete(prompt: string, systemPrompt?: string): Promise<LLMResponse> {
    const startTime = Date.now();

    // Route to appropriate provider
    let content: string;
    switch (this.config.provider) {
      case 'gpt-4':
        content = await this.callOpenAI(prompt, systemPrompt);
        break;
      case 'claude-3':
        content = await this.callClaude(prompt, systemPrompt);
        break;
      case 'gemini':
        content = await this.callGemini(prompt, systemPrompt);
        break;
      case 'groq':
        content = await this.callGroq(prompt, systemPrompt);
        break;
      default:
        throw new Error(`Unknown provider: ${this.config.provider}`);
    }

    return {
      content,
      provider: this.config.provider,
      latencyMs: Date.now() - startTime
    };
  }

  private async callOpenAI(prompt: string, systemPrompt?: string): Promise<string> {
    // In production, use actual OpenAI API
    // For now, return mock response
    return this.mockResponse(prompt, 'gpt-4');
  }

  private async callClaude(prompt: string, systemPrompt?: string): Promise<string> {
    // In production, use actual Claude API
    return this.mockResponse(prompt, 'claude-3');
  }

  private async callGemini(prompt: string, systemPrompt?: string): Promise<string> {
    // In production, use actual Gemini API
    return this.mockResponse(prompt, 'gemini');
  }

  private async callGroq(prompt: string, systemPrompt?: string): Promise<string> {
    // In production, use actual Groq API
    return this.mockResponse(prompt, 'groq');
  }

  private mockResponse(prompt: string, provider: string): string {
    // Mock response for development
    return `[${provider}] Analysis complete. This is a mock response for: "${prompt.substring(0, 50)}..."`;
  }

  // ============ SPECIALIZED ANALYSIS METHODS ============

  async analyzeDocument(documentContent: string, documentType: string): Promise<DocumentAnalysisResult> {
    const systemPrompt = `You are an expert insurance document analyst. Analyze the provided ${documentType} and extract key information, identify risk factors, and provide a summary.`;

    const prompt = `Analyze this ${documentType}:\n\n${documentContent}\n\nProvide:
1. Document type classification
2. Key extracted data (names, dates, amounts, coverage details)
3. Summary of the document
4. Any risk flags or concerns
5. Confidence level in your analysis`;

    const response = await this.complete(prompt, systemPrompt);

    // Parse response (in production, use structured output)
    return {
      documentType,
      extractedData: { raw: response.content },
      summary: response.content,
      riskFlags: [],
      confidence: 0.85
    };
  }

  async analyzeClaim(claimDetails: {
    description: string;
    amount: number;
    type: string;
    supportingDocs: string[];
    claimantHistory: string;
  }): Promise<ClaimAnalysisResult> {
    const systemPrompt = `You are an expert insurance claims analyst. Evaluate the legitimacy of claims, identify potential fraud indicators, and recommend appropriate actions.`;

    const prompt = `Analyze this insurance claim:

Type: ${claimDetails.type}
Amount: $${claimDetails.amount.toLocaleString()}
Description: ${claimDetails.description}
Supporting Documents: ${claimDetails.supportingDocs.join(', ')}
Claimant History: ${claimDetails.claimantHistory}

Provide:
1. Legitimacy score (0-100)
2. Any fraud indicators
3. Recommended action
4. Estimated fair settlement
5. Reasoning for your assessment`;

    const response = await this.complete(prompt, systemPrompt);

    return {
      legitimacyScore: 75,
      fraudIndicators: [],
      recommendedAction: 'Approve with standard verification',
      estimatedSettlement: claimDetails.amount * 0.9,
      reasoning: response.content
    };
  }

  async generateQuoteRecommendation(quotes: {
    carrier: string;
    premium: number;
    deductible: number;
    coverageLimit: number;
    rating: number;
  }[], riskProfile: string): Promise<QuoteRecommendation> {
    const systemPrompt = `You are an expert insurance advisor. Compare quotes and recommend the best option based on the client's risk profile and needs.`;

    const quotesText = quotes.map(q => 
      `${q.carrier}: Premium $${q.premium}/yr, Deductible $${q.deductible}, Limit $${q.coverageLimit.toLocaleString()}, Rating: ${q.rating}/5`
    ).join('\n');

    const prompt = `Compare these insurance quotes for a client with this risk profile:

${riskProfile}

Available Quotes:
${quotesText}

Provide:
1. Recommended carrier and why
2. Any coverage gaps to address
3. Suggested add-on coverages
4. Competitive analysis of the options`;

    const response = await this.complete(prompt, systemPrompt);

    return {
      recommendedCarrier: quotes[0]?.carrier || 'N/A',
      reasoning: response.content,
      coverageGaps: [],
      suggestedAddons: [],
      competitiveAnalysis: response.content
    };
  }

  async generateCustomerResponse(context: {
    customerName: string;
    issue: string;
    policyDetails: string;
    previousInteractions: string;
  }): Promise<string> {
    const systemPrompt = `You are a helpful insurance customer service representative. Provide clear, empathetic, and accurate responses to customer inquiries.`;

    const prompt = `Generate a response for this customer inquiry:

Customer: ${context.customerName}
Issue: ${context.issue}
Policy Details: ${context.policyDetails}
Previous Interactions: ${context.previousInteractions}

Write a professional, helpful response that addresses their concern.`;

    const response = await this.complete(prompt, systemPrompt);
    return response.content;
  }

  async assessUnderwritingRisk(application: {
    businessType: string;
    yearsInBusiness: number;
    annualRevenue: number;
    employees: number;
    claimsHistory: string;
    riskFactors: string[];
  }): Promise<{
    decision: 'approve' | 'decline' | 'refer';
    reasoning: string;
    conditions: string[];
    suggestedPremium: number;
  }> {
    const systemPrompt = `You are a senior insurance underwriter. Evaluate applications and make binding decisions based on risk assessment.`;

    const prompt = `Evaluate this insurance application:

Business Type: ${application.businessType}
Years in Business: ${application.yearsInBusiness}
Annual Revenue: $${application.annualRevenue.toLocaleString()}
Employees: ${application.employees}
Claims History: ${application.claimsHistory}
Risk Factors: ${application.riskFactors.join(', ')}

Provide:
1. Decision (approve/decline/refer)
2. Reasoning
3. Any conditions for approval
4. Suggested premium range`;

    const response = await this.complete(prompt, systemPrompt);

    return {
      decision: 'approve',
      reasoning: response.content,
      conditions: [],
      suggestedPremium: 10000
    };
  }
}

// ============ AGENT DEFINITIONS ============

export interface AgentDefinition {
  id: string;
  name: string;
  type: 'document_analysis' | 'risk_assessment' | 'quote_generation' | 'claims_processing' | 'customer_service' | 'underwriting';
  description: string;
  defaultLLM: LLMProvider;
  systemPrompt: string;
  temperature: number;
  icon: string;
}

export const DEFAULT_AGENTS: AgentDefinition[] = [
  {
    id: 'doc-analyzer',
    name: 'Document Analyzer',
    type: 'document_analysis',
    description: 'Extracts and analyzes information from insurance documents',
    defaultLLM: 'claude-3',
    systemPrompt: 'You are an expert insurance document analyst. Extract key information accurately and identify any risk factors or discrepancies.',
    temperature: 0.3,
    icon: '📄'
  },
  {
    id: 'risk-assessor',
    name: 'Risk Assessor',
    type: 'risk_assessment',
    description: 'Evaluates risk profiles and generates risk scores',
    defaultLLM: 'gpt-4',
    systemPrompt: 'You are a senior risk analyst. Evaluate risk factors comprehensively and provide actionable insights.',
    temperature: 0.5,
    icon: '⚠️'
  },
  {
    id: 'quote-generator',
    name: 'Quote Generator',
    type: 'quote_generation',
    description: 'Compares quotes and recommends optimal coverage',
    defaultLLM: 'claude-3',
    systemPrompt: 'You are an insurance advisor. Compare options objectively and recommend the best value for the client.',
    temperature: 0.4,
    icon: '💰'
  },
  {
    id: 'claims-processor',
    name: 'Claims Processor',
    type: 'claims_processing',
    description: 'Evaluates claims for legitimacy and recommends actions',
    defaultLLM: 'gpt-4',
    systemPrompt: 'You are a claims adjuster. Evaluate claims fairly, identify fraud indicators, and recommend appropriate settlements.',
    temperature: 0.3,
    icon: '📋'
  },
  {
    id: 'customer-agent',
    name: 'Customer Service Agent',
    type: 'customer_service',
    description: 'Handles customer inquiries and provides support',
    defaultLLM: 'cerebras',
    systemPrompt: 'You are a friendly insurance customer service representative. Be helpful, clear, and empathetic.',
    temperature: 0.7,
    icon: '💬'
  },
  {
    id: 'underwriter',
    name: 'Underwriter',
    type: 'underwriting',
    description: 'Evaluates applications and makes binding decisions',
    defaultLLM: 'claude-3',
    systemPrompt: 'You are a senior underwriter. Make decisions based on comprehensive risk assessment and company guidelines.',
    temperature: 0.4,
    icon: '✍️'
  }
];

// ============ FACTORY FUNCTIONS ============

export function createLLMService(provider: LLMProvider, apiKey?: string): LLMService {
  return new LLMService({ provider, apiKey });
}

export function createAgentService(agent: AgentDefinition, llmOverride?: LLMProvider): LLMService {
  return new LLMService({
    provider: llmOverride || agent.defaultLLM,
    temperature: agent.temperature
  });
}
