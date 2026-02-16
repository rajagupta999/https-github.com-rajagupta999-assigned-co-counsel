"use client";

import { useState, useCallback, useRef, useEffect } from 'react';
import { useSearchParams } from 'next/navigation';
import { usePracticeMode } from '@/context/PracticeModeContext';
import { useAppContext } from '@/context/AppContext';
import { callLLM, streamLLM, LLMProvider, TaskType } from '@/lib/multiLLM';
import { buildRAGContext, RAGContext } from '@/lib/ragService';
import { searchAllLegalDatabases, CaseLawResult, StatuteResult } from '@/lib/legalDatabases';
import { runMultiAgentAnalysis, runRedTeamAnalysis, getAgentPersonas, AgentRole, MultiAgentReport } from '@/lib/multiAgentAnalysis';
import DictationButton from '@/components/DictationButton';
import SearchPanel from './SearchPanel';

// ══════════════════════════════════════════════════════════════════
// Tab: Search Database  |  Chat with AI
// ══════════════════════════════════════════════════════════════════

type Tab = 'search' | 'chat';
type AnalysisMode = 'standard' | 'citation' | 'multi-agent' | 'red-team' | 'research';

interface Message {
  id: string;
  role: 'user' | 'ai' | 'system';
  content: string;
  timestamp: Date;
  citations?: string[];
  ragContext?: RAGContext;
  multiAgentReport?: MultiAgentReport;
}

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

export default function ResearchPage() {
  const [activeTab, setActiveTab] = useState<Tab>('search');
  const { mode, isProSe } = usePracticeMode();
  const { currentCase } = useAppContext();

  // Chat state
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [analysisMode, setAnalysisMode] = useState<AnalysisMode>('standard');
  const [selectedAgents, setSelectedAgents] = useState<AgentRole[]>(['prosecutor', 'defense', 'judge', 'analyst']);
  const [useRAG, setUseRAG] = useState(true);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => { messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' }); }, [messages]);

  const systemPrompt = isProSe
    ? `You are a friendly, patient legal helper for someone representing themselves in court (pro se). Use SIMPLE, everyday language. NO legal jargon. Be warm, encouraging, and supportive.`
    : `You are Research Desk AI, a legal research assistant for attorneys.
Focus on: case law research, statute lookup, legal analysis, citation checking.
${currentCase ? `Current case: ${currentCase.client} - ${currentCase.charges}` : ''}
Be thorough, cite authority, and provide actionable analysis.`;

  const analysisModes = isProSe
    ? [
        { id: 'standard', name: 'Ask a Question', icon: '💬', description: 'Get help in plain English' },
        { id: 'research', name: 'Find Information', icon: '🔍', description: 'Search legal resources' },
      ]
    : [
        { id: 'standard', name: 'Standard', icon: '💬', description: 'Quick AI assistance' },
        { id: 'citation', name: 'Citation Mode', icon: '📚', description: 'With legal citations' },
        { id: 'multi-agent', name: 'Multi-Agent', icon: '👥', description: 'Multiple perspectives' },
        { id: 'red-team', name: 'Red Team', icon: '⚔️', description: 'Adversarial analysis' },
        { id: 'research', name: 'Research', icon: '🔍', description: 'Search legal databases' },
      ];

  const suggestions = [
    { label: 'Find cases on suppression of evidence', prompt: 'Find cases on suppression of evidence based on warrantless search in New York.' },
    { label: 'What is CPL 30.30?', prompt: 'Explain CPL 30.30 speedy trial rules and how to calculate chargeable time.' },
    { label: 'Shepardize a case', prompt: 'Help me check the current status and treatment of a case citation.' },
    { label: 'Statute lookup', prompt: 'Look up the relevant statute for my legal issue.' },
  ];

  const handleSend = async () => {
    if (!input.trim() || isLoading) return;
    const userMessage: Message = { id: `msg_${Date.now()}`, role: 'user', content: input.trim(), timestamp: new Date() };
    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setIsLoading(true);

    try {
      let response: Message;
      switch (analysisMode) {
        case 'multi-agent': response = await handleMultiAgent(userMessage.content); break;
        case 'red-team': response = await handleRedTeam(userMessage.content); break;
        case 'research': response = await handleResearch(userMessage.content); break;
        case 'citation': response = await handleCitation(userMessage.content); break;
        default: response = await handleStandard(userMessage.content);
      }
      setMessages(prev => [...prev, response]);
    } catch (error) {
      setMessages(prev => [...prev, { id: `msg_${Date.now()}`, role: 'ai', content: `Error: ${error instanceof Error ? error.message : 'Unknown error'}`, timestamp: new Date() }]);
    }
    setIsLoading(false);
  };

  const handleStandard = async (query: string): Promise<Message> => {
    let ragContext: RAGContext | undefined;
    if (useRAG) ragContext = await buildRAGContext(query, { caseId: currentCase?.id });
    const prompt = `${systemPrompt}\n${ragContext?.formattedContext ? `\nRELEVANT CONTEXT:\n${ragContext.formattedContext}\n` : ''}`;
    let content = '';
    await streamLLM('cerebras', [
      { role: 'system', content: prompt },
      ...messages.filter(m => m.role !== 'system').slice(-10).map(m => ({ role: m.role === 'ai' ? 'assistant' as const : 'user' as const, content: m.content })),
      { role: 'user', content: query },
    ], (chunk) => { content += chunk; }, { task: 'chat' as TaskType });
    return { id: `msg_${Date.now()}`, role: 'ai', content, timestamp: new Date(), ragContext };
  };

  const handleCitation = async (query: string): Promise<Message> => {
    const ragContext = await buildRAGContext(query, { caseId: currentCase?.id });
    let content = '';
    await streamLLM('cerebras', [
      { role: 'system', content: `You are in CITATION MODE. You MUST cite legal authority for EVERY legal claim.\n${ragContext?.formattedContext ? `SOURCES:\n${ragContext.formattedContext}` : ''}\nNEVER fabricate citations.` },
      { role: 'user', content: query },
    ], (chunk) => { content += chunk; }, { task: 'citation' as TaskType });
    const citations: string[] = [];
    let match;
    const re = /\[([^\]]+)\]/g;
    while ((match = re.exec(content)) !== null) citations.push(match[1]);
    return { id: `msg_${Date.now()}`, role: 'ai', content, timestamp: new Date(), citations: [...new Set(citations)], ragContext };
  };

  const handleMultiAgent = async (query: string): Promise<Message> => {
    const caseContext = currentCase ? `Case: ${currentCase.client}\nCharges: ${currentCase.charges}\nCounty: ${currentCase.county}` : undefined;
    const report = await runMultiAgentAnalysis(query, selectedAgents, { caseId: currentCase?.id, caseContext, useRAG, parallel: true });
    const personas = getAgentPersonas();
    let content = `## 👥 Multi-Agent Analysis\n\n**Query:** "${report.query}"\n\n`;
    for (const a of report.analyses) {
      const p = personas.find(p => p.role === a.role);
      content += `---\n\n### ${p?.icon || '👤'} ${a.agentName}\n*${p?.description || a.role}*\n\n${a.analysis}\n\n`;
    }
    content += `---\n\n## 🎯 Synthesis\n\n${report.synthesis}\n\n`;
    if (report.actionItems.length > 0) { content += `### Recommended Actions\n`; report.actionItems.forEach((item, i) => { content += `${i + 1}. ${item}\n`; }); }
    return { id: `msg_${Date.now()}`, role: 'ai', content, timestamp: new Date(), multiAgentReport: report };
  };

  const handleRedTeam = async (query: string): Promise<Message> => {
    const caseContext = currentCase ? `Case: ${currentCase.client}\nCharges: ${currentCase.charges}\nCounty: ${currentCase.county}` : undefined;
    const report = await runRedTeamAnalysis(query, caseContext);
    const content = `## 🔴 RED TEAM ANALYSIS\n\n${report.analyses.map(a => `### ${getAgentPersonas().find(p => p.role === a.role)?.icon || '👤'} ${a.agentName}\n${a.analysis}`).join('\n\n---\n\n')}\n\n## 🎯 Synthesis\n\n${report.synthesis}\n\n### Action Items\n${report.actionItems.map((item, i) => `${i + 1}. ${item}`).join('\n')}`;
    return { id: `msg_${Date.now()}`, role: 'ai', content, timestamp: new Date(), multiAgentReport: report };
  };

  const handleResearch = async (query: string): Promise<Message> => {
    const results = await searchAllLegalDatabases(query);
    const content = `## 🔍 Legal Research Results\n\n**Query:** "${query}"\n\n### 📜 Statutes (${results.statutes.length})\n${results.statutes.slice(0, 5).map(s => `- **${s.citation}**: ${s.title}`).join('\n') || 'None found'}\n\n### ⚖️ Cases (${results.cases.length})\n${results.cases.slice(0, 5).map(c => `- **${c.name}** (${c.court}, ${c.date})\n  ${c.citation}`).join('\n') || 'None found'}`;
    return { id: `msg_${Date.now()}`, role: 'ai', content, timestamp: new Date() };
  };

  const toggleAgent = (role: AgentRole) => {
    setSelectedAgents(prev => prev.includes(role) ? prev.filter(r => r !== role) : [...prev, role]);
  };

  return (
    <div className="h-[calc(100vh-64px)] flex flex-col">
      {/* Tab Bar */}
      <div className="bg-white border-b border-slate-200 px-2 sm:px-4 pt-2 sm:pt-3">
        <div className="flex items-center gap-1 overflow-x-auto">
          <button
            onClick={() => setActiveTab('search')}
            className={`px-5 py-2.5 text-sm font-semibold rounded-t-lg border-b-2 transition-colors ${
              activeTab === 'search'
                ? 'border-navy-600 text-navy-800 bg-slate-50'
                : 'border-transparent text-slate-500 hover:text-slate-700'
            }`}
          >
            🔍 Search Database
          </button>
          <button
            onClick={() => setActiveTab('chat')}
            className={`px-5 py-2.5 text-sm font-semibold rounded-t-lg border-b-2 transition-colors ${
              activeTab === 'chat'
                ? 'border-navy-600 text-navy-800 bg-slate-50'
                : 'border-transparent text-slate-500 hover:text-slate-700'
            }`}
          >
            💬 Chat with AI
          </button>
        </div>
      </div>

      {/* Tab Content */}
      {activeTab === 'search' ? (
        <SearchPanel />
      ) : (
        <div className="flex-1 flex flex-col">
          {/* Analysis Mode Selector */}
          <div className="px-4 py-3 border-b border-slate-200 bg-white">
            <div className="flex items-center gap-2 overflow-x-auto pb-1">
              {analysisModes.map(m => (
                <button
                  key={m.id}
                  onClick={() => setAnalysisMode(m.id as AnalysisMode)}
                  className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-semibold whitespace-nowrap transition-colors ${
                    analysisMode === m.id ? 'bg-navy-900 text-white' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                  }`}
                >
                  <span>{m.icon}</span>
                  {m.name}
                </button>
              ))}
              {!isProSe && (
                <div className="ml-auto flex items-center gap-2">
                  <label className="flex items-center gap-2 text-sm text-slate-600">
                    <input type="checkbox" checked={useRAG} onChange={(e) => setUseRAG(e.target.checked)} className="rounded border-slate-300" />
                    RAG
                  </label>
                </div>
              )}
            </div>
            {analysisMode === 'multi-agent' && (
              <div className="mt-3 flex flex-wrap gap-2">
                {getAgentPersonas().map(persona => (
                  <button
                    key={persona.role}
                    onClick={() => toggleAgent(persona.role)}
                    className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold border transition-colors ${
                      selectedAgents.includes(persona.role) ? AGENT_COLORS[persona.role] : 'bg-white text-slate-400 border-slate-200'
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
              <div className="text-center py-12">
                <div className="w-20 h-20 bg-gradient-to-br from-navy-500 to-navy-700 rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-lg">
                  <span className="text-4xl">🧠</span>
                </div>
                <h2 className="text-xl font-bold text-slate-800 mb-2">Research Desk AI</h2>
                <p className="text-slate-500 max-w-md mx-auto mb-8">Case law search, statute lookup, legal Q&A — all powered by AI with RAG grounding.</p>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 max-w-2xl mx-auto">
                  {suggestions.map((s, i) => (
                    <button key={i} onClick={() => setInput(s.prompt)} className="p-4 bg-white border border-slate-200 rounded-xl text-left hover:shadow-sm transition-all">
                      <span className="text-sm font-medium text-slate-700">{s.label}</span>
                    </button>
                  ))}
                </div>
              </div>
            )}

            {messages.map((message) => (
              <div key={message.id} className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                <div className={`max-w-[85%] rounded-2xl px-4 py-3 ${
                  message.role === 'user' ? 'bg-navy-900 text-white' : 'bg-white border border-slate-200'
                }`}>
                  {message.role === 'ai' ? (
                    <div className="prose prose-sm max-w-none text-slate-700">
                      {message.content.split('\n').map((line, i) => {
                        if (line.startsWith('## ')) return <h2 key={i} className="text-lg font-bold text-slate-900 mt-4 mb-2">{line.replace('## ', '')}</h2>;
                        if (line.startsWith('### ')) return <h3 key={i} className="text-base font-semibold text-slate-800 mt-3 mb-1">{line.replace('### ', '')}</h3>;
                        if (line.startsWith('- ')) return <li key={i} className="ml-4">{line.replace('- ', '')}</li>;
                        if (line.startsWith('---')) return <hr key={i} className="my-4 border-slate-200" />;
                        if (line.trim() === '') return <br key={i} />;
                        return <p key={i} className="my-1">{line}</p>;
                      })}
                    </div>
                  ) : (
                    <p className="whitespace-pre-wrap">{message.content}</p>
                  )}
                  {message.citations && message.citations.length > 0 && (
                    <div className="mt-3 pt-3 border-t border-slate-100">
                      <p className="text-xs font-semibold text-slate-500 mb-2">Citations:</p>
                      <div className="flex flex-wrap gap-1.5">
                        {message.citations.map((c, i) => (
                          <span key={i} className="text-xs bg-navy-50 text-navy-800 px-2 py-1 rounded font-medium">{c}</span>
                        ))}
                      </div>
                    </div>
                  )}
                  {message.ragContext && message.ragContext.results.length > 0 && (
                    <div className="mt-2 text-xs text-slate-400">📚 Used {message.ragContext.results.length} knowledge sources</div>
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
                       analysisMode === 'research' ? 'Searching legal databases...' : 'Thinking...'}
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
                onKeyDown={(e) => { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); handleSend(); } }}
                placeholder="Ask a legal question, search case law, or research a statute..."
                className="flex-1 px-4 py-3 border border-slate-200 rounded-xl resize-none focus:outline-none focus:ring-2 focus:ring-navy-500/20 focus:border-navy-300"
                rows={2}
              />
              <DictationButton onTranscript={(text) => setInput(prev => prev ? prev + ' ' + text : text)} size="md" />
              <button
                onClick={handleSend}
                disabled={!input.trim() || isLoading}
                className="px-6 bg-navy-900 hover:bg-navy-800 text-white rounded-xl font-semibold disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                {isLoading ? (
                  <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                ) : (
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M22 2L11 13M22 2l-7 20-4-9-9-4 20-7z"/></svg>
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
      )}
    </div>
  );
}
