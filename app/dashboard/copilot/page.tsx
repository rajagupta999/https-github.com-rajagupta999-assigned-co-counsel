"use client";

import { useState, useCallback, useRef, useEffect } from 'react';
import { useSearchParams } from 'next/navigation';
import { callLLM, streamLLM, getAvailableProviders, LLMProvider, TaskType } from '@/lib/multiLLM';
import DictationButton from '@/components/DictationButton';
import { buildRAGContext, RAGContext } from '@/lib/ragService';
import { runMultiAgentAnalysis, runRedTeamAnalysis, getAgentPersonas, AgentRole, MultiAgentReport, AgentAnalysis } from '@/lib/multiAgentAnalysis';
import { searchAllLegalDatabases, CaseLawResult, StatuteResult, parseCitation } from '@/lib/legalDatabases';
import { useAppContext } from '@/context/AppContext';

interface Message {
  id: string;
  role: 'user' | 'ai' | 'system';
  content: string;
  timestamp: Date;
  citations?: string[];
  ragContext?: RAGContext;
  multiAgentReport?: MultiAgentReport;
}

type AnalysisMode = 'standard' | 'citation' | 'multi-agent' | 'red-team' | 'research';

const ANALYSIS_MODES = [
  { id: 'standard', name: 'Standard', icon: '💬', description: 'Quick AI assistance' },
  { id: 'citation', name: 'Citation Mode', icon: '📚', description: 'Requires legal citations' },
  { id: 'multi-agent', name: 'Multi-Agent', icon: '👥', description: 'Multiple perspectives' },
  { id: 'red-team', name: 'Red Team', icon: '⚔️', description: 'Adversarial analysis' },
  { id: 'research', name: 'Research', icon: '🔍', description: 'Search legal databases' },
];

const AGENT_COLORS: Record<AgentRole, string> = {
  prosecutor: 'bg-red-100 text-red-800 border-red-200',
  defense: 'bg-blue-100 text-blue-800 border-blue-200',
  judge: 'bg-purple-100 text-purple-800 border-purple-200',
  jury_analyst: 'bg-green-100 text-green-800 border-green-200',
  appellate: 'bg-orange-100 text-orange-800 border-orange-200',
  scholar: 'bg-indigo-100 text-indigo-800 border-indigo-200',
  scribe: 'bg-gray-100 text-gray-800 border-gray-200',
  analyst: 'bg-teal-100 text-teal-800 border-teal-200',
};

export default function CopilotPage() {
  const searchParams = useSearchParams();
  const workflowId = searchParams.get('workflow');
  const { currentCase } = useAppContext();

  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [analysisMode, setAnalysisMode] = useState<AnalysisMode>('standard');
  const [selectedAgents, setSelectedAgents] = useState<AgentRole[]>(['prosecutor', 'defense', 'judge', 'analyst']);
  const [useRAG, setUseRAG] = useState(true);
  const [showResearchResults, setShowResearchResults] = useState(false);
  const [researchResults, setResearchResults] = useState<{ cases: CaseLawResult[]; statutes: StatuteResult[] }>({ cases: [], statutes: [] });
  
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // Load workflow prompt if specified
  useEffect(() => {
    if (workflowId) {
      const workflowPrompts: Record<string, string> = {
        'intake': 'Help me conduct a client intake for a new divorce case. Walk me through the key information I need to gather.',
        'filing': 'I need to prepare the initial filings for a divorce case. What documents do I need?',
        'discovery': 'Help me prepare discovery demands for a divorce case with disputed assets.',
        'custody': 'Assist me in preparing a custody arrangement proposal based on the best interests factors.',
        'settlement': 'Help me draft settlement negotiation points for this divorce case.',
        'trial': 'Help me prepare for trial in this divorce case. What should I focus on?',
      };
      
      if (workflowPrompts[workflowId]) {
        setInput(workflowPrompts[workflowId]);
      }
    }
  }, [workflowId]);

  const handleSend = async () => {
    if (!input.trim() || isLoading) return;

    const userMessage: Message = {
      id: `msg_${Date.now()}`,
      role: 'user',
      content: input.trim(),
      timestamp: new Date(),
    };

    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setIsLoading(true);

    try {
      let response: Message;

      switch (analysisMode) {
        case 'multi-agent':
          response = await handleMultiAgentAnalysis(userMessage.content);
          break;
        case 'red-team':
          response = await handleRedTeamAnalysis(userMessage.content);
          break;
        case 'research':
          response = await handleResearchMode(userMessage.content);
          break;
        case 'citation':
          response = await handleCitationMode(userMessage.content);
          break;
        default:
          response = await handleStandardMode(userMessage.content);
      }

      setMessages(prev => [...prev, response]);
    } catch (error) {
      console.error('Error:', error);
      setMessages(prev => [...prev, {
        id: `msg_${Date.now()}`,
        role: 'ai',
        content: `Error: ${error instanceof Error ? error.message : 'Unknown error occurred'}`,
        timestamp: new Date(),
      }]);
    }

    setIsLoading(false);
  };

  const handleStandardMode = async (query: string): Promise<Message> => {
    let ragContext: RAGContext | undefined;
    
    if (useRAG) {
      ragContext = await buildRAGContext(query, { caseId: currentCase?.id });
    }

    const systemPrompt = `You are 18B Lawyer AI, a legal assistant for 18B panel attorneys in NYC.
You help with criminal defense, family court (custody), and matrimonial (divorce) matters.

${ragContext?.formattedContext ? `RELEVANT CONTEXT:\n${ragContext.formattedContext}\n\n` : ''}
${currentCase ? `CURRENT CASE: ${currentCase.client} - ${currentCase.charges}\n\n` : ''}

Provide helpful, accurate legal guidance. Be concise but thorough.`;

    let content = '';
    
    await streamLLM('cerebras', [
      { role: 'system', content: systemPrompt },
      ...messages.filter(m => m.role !== 'system').slice(-10).map(m => ({
        role: m.role === 'ai' ? 'assistant' as const : 'user' as const,
        content: m.content,
      })),
      { role: 'user', content: query },
    ], (chunk) => {
      content += chunk;
    }, { task: 'chat' as TaskType });

    return {
      id: `msg_${Date.now()}`,
      role: 'ai',
      content,
      timestamp: new Date(),
      ragContext,
    };
  };

  const handleCitationMode = async (query: string): Promise<Message> => {
    const ragContext = await buildRAGContext(query, { caseId: currentCase?.id });

    const systemPrompt = `You are 18B Lawyer AI operating in CITATION MODE.

CRITICAL REQUIREMENT: You MUST cite legal authority for EVERY legal claim.

Citation formats:
- NY Statutes: [CPL § 710.20] or [DRL § 236(B)(5)]
- Cases: [People v. De Bour, 40 N.Y.2d 210 (1976)]
- Federal: [18 U.S.C. § 1001]

${ragContext?.formattedContext ? `AVAILABLE SOURCES:\n${ragContext.formattedContext}\n\n` : ''}

If you cannot find supporting authority, explicitly state:
"⚠️ I cannot locate specific authority for this proposition."

NEVER fabricate citations. If uncertain, acknowledge it.`;

    let content = '';
    
    await streamLLM('cerebras', [
      { role: 'system', content: systemPrompt },
      { role: 'user', content: query },
    ], (chunk) => {
      content += chunk;
    }, { task: 'citation' as TaskType });

    // Extract citations from response
    const citationRegex = /\[([^\]]+)\]/g;
    const citations: string[] = [];
    let match;
    while ((match = citationRegex.exec(content)) !== null) {
      citations.push(match[1]);
    }

    return {
      id: `msg_${Date.now()}`,
      role: 'ai',
      content,
      timestamp: new Date(),
      citations: [...new Set(citations)],
      ragContext,
    };
  };

  const handleMultiAgentAnalysis = async (query: string): Promise<Message> => {
    const caseContext = currentCase 
      ? `Case: ${currentCase.client}\nCharges: ${currentCase.charges}\nCounty: ${currentCase.county}`
      : undefined;

    const report = await runMultiAgentAnalysis(query, selectedAgents, {
      caseId: currentCase?.id,
      caseContext,
      useRAG,
      parallel: true,
    });

    // Format the response
    const formattedContent = formatMultiAgentReport(report);

    return {
      id: `msg_${Date.now()}`,
      role: 'ai',
      content: formattedContent,
      timestamp: new Date(),
      multiAgentReport: report,
    };
  };

  const handleRedTeamAnalysis = async (query: string): Promise<Message> => {
    const caseContext = currentCase
      ? `Case: ${currentCase.client}\nCharges: ${currentCase.charges}\nCounty: ${currentCase.county}`
      : undefined;

    const report = await runRedTeamAnalysis(query, caseContext);

    const formattedContent = `## 🔴 RED TEAM ANALYSIS

**Your defense strategy has been stress-tested from adversarial perspectives.**

${report.analyses.map(a => `
### ${getAgentPersonas().find(p => p.role === a.role)?.icon || '👤'} ${a.agentName}
${a.analysis}
`).join('\n---\n')}

## 🎯 Synthesis & Recommendations

${report.synthesis}

### Action Items
${report.actionItems.map((item, i) => `${i + 1}. ${item}`).join('\n')}
`;

    return {
      id: `msg_${Date.now()}`,
      role: 'ai',
      content: formattedContent,
      timestamp: new Date(),
      multiAgentReport: report,
    };
  };

  const handleResearchMode = async (query: string): Promise<Message> => {
    // Search legal databases
    const results = await searchAllLegalDatabases(query);
    setResearchResults(results);
    setShowResearchResults(true);

    const formattedContent = `## 🔍 Legal Research Results

**Query:** "${query}"

### 📜 Statutes Found (${results.statutes.length})
${results.statutes.slice(0, 5).map(s => `- **${s.citation}**: ${s.title}`).join('\n') || 'No statutes found'}

### ⚖️ Case Law Found (${results.cases.length})
${results.cases.slice(0, 5).map(c => `- **${c.name}** (${c.court}, ${c.date})\n  ${c.citation}`).join('\n') || 'No cases found'}

${results.cases.length > 5 || results.statutes.length > 5 ? '\n*See full results in the Research Panel →*' : ''}

---

Would you like me to analyze any of these sources in detail?`;

    return {
      id: `msg_${Date.now()}`,
      role: 'ai',
      content: formattedContent,
      timestamp: new Date(),
    };
  };

  const formatMultiAgentReport = (report: MultiAgentReport): string => {
    const personas = getAgentPersonas();
    
    let content = `## 👥 Multi-Agent Analysis\n\n`;
    content += `**Query:** "${report.query}"\n\n`;

    for (const analysis of report.analyses) {
      const persona = personas.find(p => p.role === analysis.role);
      content += `---\n\n### ${persona?.icon || '👤'} ${analysis.agentName}\n`;
      content += `*${persona?.description || analysis.role}*\n\n`;
      content += analysis.analysis;
      content += '\n\n';
    }

    content += `---\n\n## 🎯 Synthesis\n\n${report.synthesis}\n\n`;
    
    if (report.actionItems.length > 0) {
      content += `### Recommended Actions\n`;
      report.actionItems.forEach((item, i) => {
        content += `${i + 1}. ${item}\n`;
      });
    }

    return content;
  };

  const toggleAgent = (role: AgentRole) => {
    setSelectedAgents(prev => 
      prev.includes(role) 
        ? prev.filter(r => r !== role)
        : [...prev, role]
    );
  };

  return (
    <div className="flex h-[calc(100vh-64px)]">
      {/* Main Chat Area */}
      <div className="flex-1 flex flex-col">
        {/* Mode Selector */}
        <div className="px-4 py-3 border-b border-slate-200 bg-white">
          <div className="flex items-center gap-2 overflow-x-auto pb-1">
            {ANALYSIS_MODES.map(mode => (
              <button
                key={mode.id}
                onClick={() => setAnalysisMode(mode.id as AnalysisMode)}
                className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-semibold whitespace-nowrap transition-colors ${
                  analysisMode === mode.id
                    ? 'bg-navy-900 text-white'
                    : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                }`}
              >
                <span>{mode.icon}</span>
                {mode.name}
              </button>
            ))}
            
            <div className="ml-auto flex items-center gap-2">
              <label className="flex items-center gap-2 text-sm text-slate-600">
                <input
                  type="checkbox"
                  checked={useRAG}
                  onChange={(e) => setUseRAG(e.target.checked)}
                  className="rounded border-slate-300"
                />
                RAG
              </label>
            </div>
          </div>
          
          {/* Agent Selection for Multi-Agent Mode */}
          {analysisMode === 'multi-agent' && (
            <div className="mt-3 flex flex-wrap gap-2">
              {getAgentPersonas().map(persona => (
                <button
                  key={persona.role}
                  onClick={() => toggleAgent(persona.role)}
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold border transition-colors ${
                    selectedAgents.includes(persona.role)
                      ? AGENT_COLORS[persona.role]
                      : 'bg-white text-slate-400 border-slate-200'
                  }`}
                >
                  <span>{persona.icon}</span>
                  {persona.name.split(',')[0]}
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Messages */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          {messages.length === 0 && (
            <div className="text-center py-16">
              <div className="w-20 h-20 bg-gradient-to-br from-navy-500 to-navy-700 rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-lg">
                <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="1.5">
                  <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5"/>
                </svg>
              </div>
              <h2 className="text-xl font-bold text-slate-800 mb-2">Co-Counsel AI</h2>
              <p className="text-slate-500 max-w-md mx-auto">
                {analysisMode === 'multi-agent' 
                  ? 'Get analysis from multiple legal perspectives simultaneously.'
                  : analysisMode === 'red-team'
                  ? 'Stress-test your defense strategy with adversarial analysis.'
                  : analysisMode === 'research'
                  ? 'Search NY statutes, case law, and legal databases.'
                  : analysisMode === 'citation'
                  ? 'Get responses with mandatory legal citations.'
                  : 'Your AI legal assistant for criminal, custody, and divorce matters.'}
              </p>
              
              <div className="mt-8 grid grid-cols-2 md:grid-cols-4 gap-3 max-w-2xl mx-auto">
                {[
                  { label: 'Draft a motion', prompt: 'Help me draft a motion to suppress evidence based on a warrantless search.' },
                  { label: 'Analyze custody factors', prompt: 'What are the best interests factors for custody under DRL 240?' },
                  { label: 'Voucher question', prompt: 'How should I itemize research time to avoid block billing issues?' },
                  { label: 'Case strategy', prompt: 'What are the strongest defenses for a DWI case with a .09 BAC?' },
                ].map((suggestion, i) => (
                  <button
                    key={i}
                    onClick={() => setInput(suggestion.prompt)}
                    className="p-3 bg-white border border-slate-200 rounded-xl text-left hover:border-navy-300 hover:shadow-sm transition-all"
                  >
                    <span className="text-sm font-medium text-slate-700">{suggestion.label}</span>
                  </button>
                ))}
              </div>
            </div>
          )}

          {messages.map((message) => (
            <div
              key={message.id}
              className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
            >
              <div
                className={`max-w-[85%] rounded-2xl px-4 py-3 ${
                  message.role === 'user'
                    ? 'bg-navy-900 text-white'
                    : 'bg-white border border-slate-200'
                }`}
              >
                {message.role === 'ai' && (
                  <div className="prose prose-sm max-w-none text-slate-700">
                    {message.content.split('\n').map((line, i) => {
                      if (line.startsWith('## ')) {
                        return <h2 key={i} className="text-lg font-bold text-slate-900 mt-4 mb-2">{line.replace('## ', '')}</h2>;
                      }
                      if (line.startsWith('### ')) {
                        return <h3 key={i} className="text-base font-semibold text-slate-800 mt-3 mb-1">{line.replace('### ', '')}</h3>;
                      }
                      if (line.startsWith('- ')) {
                        return <li key={i} className="ml-4">{line.replace('- ', '')}</li>;
                      }
                      if (line.startsWith('---')) {
                        return <hr key={i} className="my-4 border-slate-200" />;
                      }
                      if (line.trim() === '') {
                        return <br key={i} />;
                      }
                      return <p key={i} className="my-1">{line}</p>;
                    })}
                  </div>
                )}
                {message.role === 'user' && (
                  <p className="whitespace-pre-wrap">{message.content}</p>
                )}
                
                {/* Citations */}
                {message.citations && message.citations.length > 0 && (
                  <div className="mt-3 pt-3 border-t border-slate-100">
                    <p className="text-xs font-semibold text-slate-500 mb-2">Citations Referenced:</p>
                    <div className="flex flex-wrap gap-1.5">
                      {message.citations.map((citation, i) => (
                        <span key={i} className="text-xs bg-navy-50 text-navy-800 px-2 py-1 rounded font-medium">
                          {citation}
                        </span>
                      ))}
                    </div>
                  </div>
                )}

                {/* RAG Context Indicator */}
                {message.ragContext && message.ragContext.results.length > 0 && (
                  <div className="mt-2 text-xs text-slate-400">
                    📚 Used {message.ragContext.results.length} knowledge sources
                  </div>
                )}
              </div>
            </div>
          ))}

          {isLoading && (
            <div className="flex justify-start">
              <div className="bg-white border border-slate-200 rounded-2xl px-4 py-3">
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-navy-500 rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></div>
                  <div className="w-2 h-2 bg-navy-500 rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></div>
                  <div className="w-2 h-2 bg-navy-500 rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></div>
                  <span className="ml-2 text-sm text-slate-500">
                    {analysisMode === 'multi-agent' ? 'Consulting multiple agents...' : 
                     analysisMode === 'red-team' ? 'Running adversarial analysis...' :
                     analysisMode === 'research' ? 'Searching legal databases...' :
                     'Thinking...'}
                  </span>
                </div>
              </div>
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>

        {/* Input */}
        <div className="p-4 border-t border-slate-200 bg-white">
          <div className="flex gap-3">
            <textarea
              ref={inputRef}
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter' && !e.shiftKey) {
                  e.preventDefault();
                  handleSend();
                }
              }}
              placeholder={
                analysisMode === 'red-team' 
                  ? 'Describe your defense strategy to stress-test...'
                  : analysisMode === 'research'
                  ? 'Search for cases, statutes, or legal concepts...'
                  : 'Ask a legal question...'
              }
              className="flex-1 px-4 py-3 border border-slate-200 rounded-xl resize-none focus:outline-none focus:ring-2 focus:ring-navy-500/20 focus:border-navy-300"
              rows={2}
            />
            <DictationButton
              onTranscript={(text) => setInput(prev => prev ? prev + ' ' + text : text)}
              size="md"
            />
            <button
              onClick={handleSend}
              disabled={!input.trim() || isLoading}
              className="px-6 bg-navy-900 hover:bg-navy-800 text-white rounded-xl font-semibold disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              {isLoading ? (
                <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              ) : (
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M22 2L11 13M22 2l-7 20-4-9-9-4 20-7z"/>
                </svg>
              )}
            </button>
          </div>
          <p className="text-xs text-slate-400 mt-2">
            {analysisMode === 'multi-agent' && `Using ${selectedAgents.length} agents`}
            {analysisMode === 'citation' && '📚 Citation mode: All claims must be supported'}
            {analysisMode === 'red-team' && '⚔️ Red team: Adversarial stress testing'}
          </p>
        </div>
      </div>

      {/* Research Results Sidebar */}
      {showResearchResults && (
        <div className="w-80 border-l border-slate-200 bg-white overflow-y-auto">
          <div className="p-4 border-b border-slate-200 flex items-center justify-between">
            <h3 className="font-semibold text-slate-800">Research Results</h3>
            <button
              onClick={() => setShowResearchResults(false)}
              className="text-slate-400 hover:text-slate-600"
            >
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M18 6L6 18M6 6l12 12"/>
              </svg>
            </button>
          </div>
          
          <div className="p-4 space-y-4">
            {researchResults.statutes.length > 0 && (
              <div>
                <h4 className="text-xs font-bold text-slate-500 uppercase mb-2">Statutes</h4>
                {researchResults.statutes.map((statute, i) => (
                  <div key={i} className="p-3 bg-slate-50 rounded-lg mb-2">
                    <p className="font-semibold text-sm text-slate-800">{statute.citation}</p>
                    <p className="text-xs text-slate-500 line-clamp-2 mt-1">{statute.title}</p>
                  </div>
                ))}
              </div>
            )}

            {researchResults.cases.length > 0 && (
              <div>
                <h4 className="text-xs font-bold text-slate-500 uppercase mb-2">Cases</h4>
                {researchResults.cases.map((caseResult, i) => (
                  <div key={i} className="p-3 bg-slate-50 rounded-lg mb-2">
                    <p className="font-semibold text-sm text-slate-800">{caseResult.name}</p>
                    <p className="text-xs text-slate-500">{caseResult.citation}</p>
                    <p className="text-xs text-slate-400 mt-1">{caseResult.court} • {caseResult.date}</p>
                  </div>
                ))}
              </div>
            )}

            {researchResults.cases.length === 0 && researchResults.statutes.length === 0 && (
              <p className="text-sm text-slate-500 text-center py-8">No results found</p>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
