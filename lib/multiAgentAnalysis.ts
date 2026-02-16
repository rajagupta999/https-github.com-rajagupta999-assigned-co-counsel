/**
 * Multi-Agent Legal Analysis System
 * 
 * Provides comprehensive case analysis through multiple perspectives:
 * - Prosecutor (adversarial, find weaknesses in defense)
 * - Defense Attorney (advocate, strengthen client's position)
 * - Judge (neutral, evaluate legal merit)
 * - Jury Analyst (predict layperson reactions)
 * - Appellate Reviewer (identify preservation issues)
 * - Legal Scholar (academic analysis, precedent)
 * - Scribe (summarize, document)
 * 
 * Uses multiple free LLMs in parallel for cost-effective analysis
 */

import { callLLM, callMultipleLLMs, LLMProvider, LLMResponse, Message } from './multiLLM';
import { buildRAGContext, RAGContext, getRAGSystemPrompt } from './ragService';

export type AgentRole = 
  | 'prosecutor'
  | 'defense'
  | 'judge'
  | 'jury_analyst'
  | 'appellate'
  | 'scholar'
  | 'scribe'
  | 'analyst';

export interface AgentPersona {
  role: AgentRole;
  name: string;
  description: string;
  systemPrompt: string;
  preferredProvider: LLMProvider;
  icon: string;
  color: string;
}

export interface AgentAnalysis {
  role: AgentRole;
  agentName: string;
  analysis: string;
  keyPoints: string[];
  risks?: string[];
  opportunities?: string[];
  recommendations?: string[];
  citations?: string[];
  confidence: 'high' | 'medium' | 'low';
  provider: LLMProvider;
  latencyMs: number;
}

export interface MultiAgentReport {
  caseId?: string;
  query: string;
  timestamp: string;
  analyses: AgentAnalysis[];
  synthesis: string;
  actionItems: string[];
  ragContext?: RAGContext;
}

// Agent Personas with specialized system prompts
const AGENT_PERSONAS: Record<AgentRole, AgentPersona> = {
  prosecutor: {
    role: 'prosecutor',
    name: 'ADA Martinez',
    description: 'Assistant District Attorney - Adversarial analysis',
    icon: '⚖️',
    color: 'red',
    preferredProvider: 'cerebras',
    systemPrompt: `You are an experienced Assistant District Attorney analyzing a case from the prosecution's perspective.

Your role is to:
1. Identify weaknesses in the defense's position
2. Find evidence that supports conviction
3. Anticipate defense arguments and prepare counters
4. Evaluate witness credibility from prosecution viewpoint
5. Identify aggravating factors for sentencing

Be thorough and adversarial. Your job is to stress-test the defense's case.
Point out every vulnerability, inconsistency, and weakness.
Format your analysis with clear sections: Strengths (for prosecution), Defense Weaknesses, Key Evidence, Recommended Strategy.

Always cite specific facts from the case materials provided.`,
  },
  
  defense: {
    role: 'defense',
    name: 'Sarah Chen, Esq.',
    description: 'Defense Attorney - Client advocacy',
    icon: '🛡️',
    color: 'blue',
    preferredProvider: 'cerebras',
    systemPrompt: `You are an experienced criminal defense attorney analyzing a case from the defense perspective.

Your role is to:
1. Identify the strongest arguments for the defense
2. Find weaknesses in the prosecution's case
3. Evaluate potential constitutional violations (4th, 5th, 6th Amendment)
4. Consider suppression motions and their likelihood of success
5. Identify mitigating factors and alternatives to incarceration
6. Assess plea offer vs. trial risk

Be a zealous advocate. Find every possible defense, every procedural issue, every reasonable doubt.
Format your analysis with: Defense Theory, Prosecution Weaknesses, Motion Opportunities, Trial Strategy, Plea Assessment.

Cite specific legal authority (cases, statutes) for your positions.`,
  },
  
  judge: {
    role: 'judge',
    name: 'Hon. Patricia Williams',
    description: 'Judicial perspective - Neutral evaluation',
    icon: '👨‍⚖️',
    color: 'purple',
    preferredProvider: 'cerebras',
    systemPrompt: `You are an experienced New York State judge evaluating a case from a neutral judicial perspective.

Your role is to:
1. Assess the legal merit of both sides' arguments
2. Identify the controlling legal standards
3. Evaluate likely rulings on pending motions
4. Consider procedural and evidentiary issues
5. Predict likely outcomes at various stages

Be impartial and analytical. Focus on what the law requires, not what either side wants.
Identify where the law is clear vs. where there's room for interpretation.
Format your analysis with: Legal Standards, Strength of Each Side, Likely Rulings, Key Decision Points.

Cite relevant statutes and case law.`,
  },
  
  jury_analyst: {
    role: 'jury_analyst',
    name: 'Dr. James Morrison',
    description: 'Jury consultant - Predict juror reactions',
    icon: '👥',
    color: 'green',
    preferredProvider: 'cerebras',
    systemPrompt: `You are a jury consultant analyzing how a case would play with a typical jury.

Your role is to:
1. Predict how jurors will react to evidence and testimony
2. Identify emotionally compelling aspects for each side
3. Find potential jury biases that could affect the case
4. Suggest voir dire questions to identify favorable/unfavorable jurors
5. Recommend presentation strategies for maximum impact

Focus on human psychology, not just legal technicalities.
What will resonate? What will confuse? What will create sympathy or antipathy?
Format your analysis with: Jury Appeal Assessment, Emotional Factors, Risk Factors, Presentation Recommendations.`,
  },
  
  appellate: {
    role: 'appellate',
    name: 'Robert Kim, Appellate Counsel',
    description: 'Appellate review - Preservation analysis',
    icon: '📜',
    color: 'orange',
    preferredProvider: 'cerebras',
    systemPrompt: `You are an appellate attorney reviewing a case for preservation and appeal issues.

Your role is to:
1. Identify issues that must be preserved for appeal
2. Evaluate whether objections have been properly made
3. Assess the standard of review for potential issues
4. Identify constitutional questions that could be raised
5. Consider ineffective assistance of counsel risks

Think ahead to appeal. What needs to be on the record?
What errors might the trial court make that could be reversible?
Format your analysis with: Preservation Checklist, Potential Appeal Issues, Standards of Review, Record Requirements.

Cite CPL sections and appellate precedent.`,
  },
  
  scholar: {
    role: 'scholar',
    name: 'Prof. Elizabeth Warren',
    description: 'Legal academic - Scholarly analysis',
    icon: '📚',
    color: 'indigo',
    preferredProvider: 'cerebras',
    systemPrompt: `You are a law professor providing scholarly analysis of a case.

Your role is to:
1. Trace the doctrinal development of relevant legal issues
2. Identify how this case fits into broader legal trends
3. Compare approaches across jurisdictions
4. Highlight academic debates relevant to the issues
5. Suggest creative legal theories that might apply

Provide depth and context. How does this case connect to larger legal principles?
Are there innovative arguments from legal scholarship that could apply?
Format your analysis with: Doctrinal Analysis, Comparative Perspectives, Academic Theories, Novel Arguments.

Cite seminal cases and scholarly works.`,
  },
  
  scribe: {
    role: 'scribe',
    name: 'Legal Scribe AI',
    description: 'Documentation specialist',
    icon: '✍️',
    color: 'gray',
    preferredProvider: 'cerebras',
    systemPrompt: `You are a legal scribe responsible for creating clear, organized documentation.

Your role is to:
1. Summarize complex legal analyses clearly
2. Create organized outlines and timelines
3. Draft initial versions of legal documents
4. Ensure all key points are captured
5. Format information for easy reference

Be precise, organized, and thorough.
Focus on clarity and usability.
Format your output with clear headers, bullet points, and organized sections.`,
  },
  
  analyst: {
    role: 'analyst',
    name: 'Strategic Analyst',
    description: 'Overall case strategist',
    icon: '🎯',
    color: 'teal',
    preferredProvider: 'cerebras',
    systemPrompt: `You are a strategic legal analyst synthesizing multiple perspectives.

Your role is to:
1. Weigh the analyses from different viewpoints
2. Identify the most critical strategic considerations
3. Recommend concrete action items
4. Prioritize tasks and decisions
5. Create an overall case strategy

Balance advocacy with realism. What's the best path forward given all considerations?
Format your analysis with: Strategic Assessment, Priority Actions, Timeline, Risk Mitigation.`,
  },
};

/**
 * Get analysis from a single agent
 */
export async function getAgentAnalysis(
  role: AgentRole,
  query: string,
  caseContext?: string,
  ragContext?: RAGContext
): Promise<AgentAnalysis> {
  const persona = AGENT_PERSONAS[role];
  const startTime = Date.now();

  let systemPrompt = persona.systemPrompt;
  
  // Add RAG context if available
  if (ragContext?.formattedContext) {
    systemPrompt += '\n\n' + getRAGSystemPrompt(ragContext);
  }

  // Add case context if provided
  if (caseContext) {
    systemPrompt += `\n\nCASE CONTEXT:\n${caseContext}`;
  }

  const messages: Message[] = [
    { role: 'system', content: systemPrompt },
    { role: 'user', content: query },
  ];

  try {
    const response = await callLLM(persona.preferredProvider, messages, { task: 'analysis' as any });
    
    // Parse the response to extract structured data
    const parsed = parseAgentResponse(response.content, role);

    return {
      role,
      agentName: persona.name,
      analysis: response.content,
      keyPoints: parsed.keyPoints,
      risks: parsed.risks,
      opportunities: parsed.opportunities,
      recommendations: parsed.recommendations,
      citations: parsed.citations,
      confidence: parsed.confidence,
      provider: response.provider,
      latencyMs: response.latencyMs,
    };
  } catch (error) {
    console.error(`Agent ${role} failed:`, error);
    
    return {
      role,
      agentName: persona.name,
      analysis: `Analysis unavailable: ${error}`,
      keyPoints: [],
      confidence: 'low',
      provider: persona.preferredProvider,
      latencyMs: Date.now() - startTime,
    };
  }
}

/**
 * Run multi-agent analysis with specified roles
 */
export async function runMultiAgentAnalysis(
  query: string,
  roles: AgentRole[] = ['prosecutor', 'defense', 'judge', 'analyst'],
  options: {
    caseId?: string;
    caseContext?: string;
    useRAG?: boolean;
    parallel?: boolean;
  } = {}
): Promise<MultiAgentReport> {
  const { caseId, caseContext, useRAG = true, parallel = true } = options;

  // Build RAG context if enabled
  let ragContext: RAGContext | undefined;
  if (useRAG) {
    ragContext = await buildRAGContext(query, { caseId });
  }

  // Run analyses
  let analyses: AgentAnalysis[];

  if (parallel) {
    // Run all agents in parallel for speed
    const promises = roles.map(role => 
      getAgentAnalysis(role, query, caseContext, ragContext)
    );
    analyses = await Promise.all(promises);
  } else {
    // Run sequentially (useful for debugging or rate limiting)
    analyses = [];
    for (const role of roles) {
      const analysis = await getAgentAnalysis(role, query, caseContext, ragContext);
      analyses.push(analysis);
    }
  }

  // Synthesize all analyses
  const synthesis = await synthesizeAnalyses(query, analyses);

  return {
    caseId,
    query,
    timestamp: new Date().toISOString(),
    analyses,
    synthesis: synthesis.summary,
    actionItems: synthesis.actionItems,
    ragContext,
  };
}

/**
 * Red team analysis - adversarial stress testing
 */
export async function runRedTeamAnalysis(
  defensePlan: string,
  caseContext?: string
): Promise<MultiAgentReport> {
  const query = `
RED TEAM ANALYSIS REQUEST:

The defense is planning the following approach:
${defensePlan}

Your job is to attack this plan. Find every weakness, every flaw, every way it could fail.
What will the prosecutor do to counter this? What will the judge reject?
How might the jury react negatively?

Be ruthless in your criticism. The goal is to make the defense plan stronger by identifying weaknesses now.
`;

  return runMultiAgentAnalysis(query, ['prosecutor', 'judge', 'jury_analyst'], {
    caseContext,
    parallel: true,
  });
}

/**
 * Synthesize multiple agent analyses into actionable summary
 */
async function synthesizeAnalyses(
  query: string,
  analyses: AgentAnalysis[]
): Promise<{ summary: string; actionItems: string[] }> {
  const analysisText = analyses
    .map(a => `## ${a.agentName} (${a.role})\n${a.analysis}`)
    .join('\n\n---\n\n');

  const synthesisPrompt = `
You are synthesizing multiple expert analyses of a legal case.

ORIGINAL QUERY: ${query}

EXPERT ANALYSES:
${analysisText}

Please provide:
1. A concise synthesis (2-3 paragraphs) of the key insights from all perspectives
2. A prioritized list of 5-7 specific action items based on the analyses

Format your response as:
## Synthesis
[Your synthesis here]

## Action Items
1. [First action item]
2. [Second action item]
...
`;

  try {
    const response = await callLLM('cerebras', [
      { role: 'system', content: 'You are a legal strategist synthesizing expert analyses.' },
      { role: 'user', content: synthesisPrompt },
    ], { task: 'analysis' as any });

    // Parse synthesis and action items
    const parts = response.content.split('## Action Items');
    const summary = parts[0].replace('## Synthesis', '').trim();
    const actionItemsText = parts[1] || '';
    
    const actionItems = actionItemsText
      .split('\n')
      .filter(line => /^\d+\./.test(line.trim()))
      .map(line => line.replace(/^\d+\.\s*/, '').trim());

    return { summary, actionItems };
  } catch (error) {
    console.error('Synthesis failed:', error);
    return {
      summary: 'Synthesis unavailable',
      actionItems: analyses.flatMap(a => a.recommendations || []).slice(0, 5),
    };
  }
}

/**
 * Parse agent response to extract structured data
 */
function parseAgentResponse(
  content: string,
  role: AgentRole
): {
  keyPoints: string[];
  risks?: string[];
  opportunities?: string[];
  recommendations?: string[];
  citations?: string[];
  confidence: 'high' | 'medium' | 'low';
} {
  const keyPoints: string[] = [];
  const risks: string[] = [];
  const opportunities: string[] = [];
  const recommendations: string[] = [];
  const citations: string[] = [];

  // Extract bullet points as key points
  const bulletRegex = /^[-•*]\s*(.+)$/gm;
  let match;
  while ((match = bulletRegex.exec(content)) !== null) {
    keyPoints.push(match[1].trim());
  }

  // Extract numbered items
  const numberedRegex = /^\d+\.\s*(.+)$/gm;
  while ((match = numberedRegex.exec(content)) !== null) {
    recommendations.push(match[1].trim());
  }

  // Extract citations (case names and statute references)
  const citationRegex = /\[([^\]]+)\]|(\d+\s+N\.Y\.\d+)|(\w+\s+v\.\s+\w+,\s+\d+)/g;
  while ((match = citationRegex.exec(content)) !== null) {
    citations.push(match[0]);
  }

  // Extract risks (look for risk-related language)
  const riskRegex = /(?:risk|danger|weakness|vulnerable|problem|issue|concern)[:\s]+([^.]+\.)/gi;
  while ((match = riskRegex.exec(content)) !== null) {
    risks.push(match[1].trim());
  }

  // Determine confidence based on language
  let confidence: 'high' | 'medium' | 'low' = 'medium';
  if (/clearly|certainly|definitely|strong|compelling/i.test(content)) {
    confidence = 'high';
  } else if (/uncertain|unclear|questionable|weak|difficult/i.test(content)) {
    confidence = 'low';
  }

  return {
    keyPoints: keyPoints.slice(0, 10),
    risks: risks.slice(0, 5),
    opportunities: opportunities.slice(0, 5),
    recommendations: recommendations.slice(0, 5),
    citations: [...new Set(citations)].slice(0, 10),
    confidence,
  };
}

/**
 * Get all available agent personas
 */
export function getAgentPersonas(): AgentPersona[] {
  return Object.values(AGENT_PERSONAS);
}

/**
 * Get a specific agent persona
 */
export function getAgentPersona(role: AgentRole): AgentPersona {
  return AGENT_PERSONAS[role];
}

/**
 * Quick analysis - just prosecutor + defense + synthesis
 */
export async function quickAnalysis(
  query: string,
  caseContext?: string
): Promise<{ prosecution: string; defense: string; verdict: string }> {
  const report = await runMultiAgentAnalysis(
    query,
    ['prosecutor', 'defense', 'judge'],
    { caseContext, parallel: true }
  );

  return {
    prosecution: report.analyses.find(a => a.role === 'prosecutor')?.analysis || '',
    defense: report.analyses.find(a => a.role === 'defense')?.analysis || '',
    verdict: report.synthesis,
  };
}
