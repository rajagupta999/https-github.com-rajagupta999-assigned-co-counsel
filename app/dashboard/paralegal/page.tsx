"use client";

import { useState, useRef, useEffect } from 'react';
import { usePracticeMode } from '@/context/PracticeModeContext';
import { useAppContext } from '@/context/AppContext';
import { streamLLM, TaskType } from '@/lib/multiLLM';
import { buildRAGContext, RAGContext } from '@/lib/ragService';
import DictationButton from '@/components/DictationButton';

interface Message {
  id: string;
  role: 'user' | 'ai';
  content: string;
  timestamp: Date;
  ragContext?: RAGContext;
}

type DraftingMode = 'motion' | 'discovery' | 'letter' | 'memo' | 'contract' | 'general';

const DRAFTING_MODES: { id: DraftingMode; label: string; icon: string; desc: string }[] = [
  { id: 'motion', label: 'Draft Motion', icon: '📝', desc: 'Motions to suppress, dismiss, bail applications' },
  { id: 'discovery', label: 'Discovery', icon: '📋', desc: 'Summarize depositions, review discovery' },
  { id: 'letter', label: 'Letters', icon: '✉️', desc: 'Client letters, court correspondence' },
  { id: 'memo', label: 'Memos', icon: '📄', desc: 'Sentencing memos, legal memoranda' },
  { id: 'contract', label: 'Contracts', icon: '📑', desc: 'Review, compare, or draft contracts' },
  { id: 'general', label: 'General', icon: '⚖️', desc: 'Any other legal drafting task' },
];

const TEMPLATES: { mode: DraftingMode; label: string; prompt: string }[] = [
  { mode: 'motion', label: 'Motion to Suppress (Mapp)', prompt: 'Draft a motion to suppress physical evidence based on a warrantless search. Include CPL 710.20 framework and relevant case law.' },
  { mode: 'motion', label: 'Motion to Suppress (Huntley)', prompt: 'Draft a motion to suppress a statement obtained in violation of Miranda rights. Include CPL 710.20 framework.' },
  { mode: 'motion', label: 'Motion to Dismiss (CPL 30.30)', prompt: 'Draft a motion to dismiss for violation of speedy trial rights under CPL 30.30. I will provide the adjournment history.' },
  { mode: 'motion', label: 'Bail Application', prompt: 'Draft a bail application under the 2020 bail reform statutes with factors for release under supervision.' },
  { mode: 'discovery', label: 'Summarize Deposition', prompt: 'I will provide deposition transcript text. Please summarize the key testimony, admissions, and inconsistencies.' },
  { mode: 'discovery', label: 'CPL 245 Discovery Demand', prompt: 'Draft a comprehensive CPL 245 discovery demand including Brady and Rosario material requests.' },
  { mode: 'letter', label: 'Plea Offer Letter to Client', prompt: 'Draft a letter to my client explaining a plea offer, the potential outcomes of accepting vs. going to trial.' },
  { mode: 'letter', label: 'Adjournment Request', prompt: 'Draft a letter to the court requesting an adjournment.' },
  { mode: 'memo', label: 'Sentencing Memorandum', prompt: 'Draft a sentencing memorandum with mitigating factors. I will provide the case details.' },
  { mode: 'contract', label: 'Review Contract', prompt: 'I will paste a contract. Please review it and flag any problematic clauses, missing protections, or areas of concern.' },
];

export default function ParalegalPage() {
  const { mode, isProSe } = usePracticeMode();
  const { currentCase } = useAppContext();

  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [draftingMode, setDraftingMode] = useState<DraftingMode>('general');
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => { messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' }); }, [messages]);

  const systemPrompt = `You are the Virtual Paralegal — a substantive legal drafting assistant.
Your role: Draft motions, summarize discovery, review contracts, prepare exhibits, write legal correspondence.
Style: Professional, thorough, properly formatted legal documents with citations.
${currentCase ? `Current case: ${currentCase.client} - ${currentCase.charges} (${currentCase.county})` : ''}
${draftingMode !== 'general' ? `Current drafting mode: ${draftingMode}` : ''}

When drafting:
- Use proper legal formatting (captions, headings, numbered paragraphs)
- Cite relevant statutes and case law
- Include standard legal boilerplate where appropriate
- Flag areas where the attorney needs to insert case-specific facts`;

  const handleSend = async () => {
    if (!input.trim() || isLoading) return;
    const userMessage: Message = { id: `msg_${Date.now()}`, role: 'user', content: input.trim(), timestamp: new Date() };
    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setIsLoading(true);

    try {
      const ragContext = await buildRAGContext(input, { caseId: currentCase?.id });
      const prompt = `${systemPrompt}\n${ragContext?.formattedContext ? `\nRELEVANT CONTEXT:\n${ragContext.formattedContext}\n` : ''}`;
      let content = '';
      await streamLLM('cerebras', [
        { role: 'system', content: prompt },
        ...messages.slice(-10).map(m => ({ role: m.role === 'ai' ? 'assistant' as const : 'user' as const, content: m.content })),
        { role: 'user', content: userMessage.content },
      ], (chunk) => { content += chunk; }, { task: 'chat' as TaskType });
      setMessages(prev => [...prev, { id: `msg_${Date.now()}`, role: 'ai', content, timestamp: new Date(), ragContext }]);
    } catch (error) {
      setMessages(prev => [...prev, { id: `msg_${Date.now()}`, role: 'ai', content: `Error: ${error instanceof Error ? error.message : 'Unknown error'}`, timestamp: new Date() }]);
    }
    setIsLoading(false);
  };

  const filteredTemplates = TEMPLATES.filter(t => t.mode === draftingMode || draftingMode === 'general');

  return (
    <div className="h-[calc(100vh-64px)] flex flex-col">
      {/* Header */}
      <div className="bg-white border-b border-slate-200 px-4 py-3">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#D4AF37] to-[#b8941f] flex items-center justify-center shadow-sm">
              <span className="text-xl">⚖️</span>
            </div>
            <div>
              <h1 className="text-lg font-bold text-slate-900">Virtual Paralegal</h1>
              <p className="text-xs text-slate-500">Substantive legal drafting & document work</p>
            </div>
          </div>
          {currentCase && (
            <span className="text-xs bg-navy-50 text-navy-800 px-2.5 py-1 rounded-lg font-medium hidden sm:block">
              📋 {currentCase.client}
            </span>
          )}
        </div>

        {/* Drafting Mode Selector */}
        <div className="flex items-center gap-2 overflow-x-auto pb-1">
          {DRAFTING_MODES.map(m => (
            <button
              key={m.id}
              onClick={() => setDraftingMode(m.id)}
              className={`flex items-center gap-2 px-3 py-2 rounded-lg text-xs font-semibold whitespace-nowrap transition-colors ${
                draftingMode === m.id ? 'bg-[#D4AF37] text-white' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              <span>{m.icon}</span>
              {m.label}
            </button>
          ))}
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.length === 0 && (
          <div className="text-center py-8">
            <div className="w-20 h-20 bg-gradient-to-br from-[#D4AF37] to-[#b8941f] rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-lg">
              <span className="text-4xl">⚖️</span>
            </div>
            <h2 className="text-xl font-bold text-slate-800 mb-2">Your Virtual Paralegal</h2>
            <p className="text-slate-500 max-w-md mx-auto mb-6">
              Draft motions, summarize discovery, review contracts, prepare exhibits — all with proper legal formatting and citations.
            </p>

            {/* Templates */}
            <div className="max-w-3xl mx-auto">
              <h3 className="text-sm font-semibold text-slate-600 mb-3">Quick Templates</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                {filteredTemplates.slice(0, 6).map((t, i) => (
                  <button
                    key={i}
                    onClick={() => setInput(t.prompt)}
                    className="p-3 bg-white border border-slate-200 rounded-xl text-left hover:shadow-sm hover:border-[#D4AF37]/30 transition-all"
                  >
                    <span className="text-sm font-medium text-slate-700">{t.label}</span>
                    <p className="text-xs text-slate-400 mt-1 line-clamp-1">{t.prompt}</p>
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}

        {messages.map((message) => (
          <div key={message.id} className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}>
            <div className={`max-w-[85%] rounded-2xl px-4 py-3 ${
              message.role === 'user' ? 'bg-[#D4AF37] text-white' : 'bg-white border border-slate-200'
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
                <div className="w-2 h-2 bg-[#D4AF37] rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></div>
                <div className="w-2 h-2 bg-[#D4AF37] rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></div>
                <div className="w-2 h-2 bg-[#D4AF37] rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></div>
                <span className="ml-2 text-sm text-slate-500">Drafting...</span>
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
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); handleSend(); } }}
            placeholder="Describe what you need drafted, paste a document for review, or select a template above..."
            className="flex-1 px-4 py-3 border border-slate-200 rounded-xl resize-none focus:outline-none focus:ring-2 focus:ring-[#D4AF37]/20 focus:border-[#D4AF37]/50"
            rows={3}
          />
          <div className="flex flex-col gap-2">
            <DictationButton onTranscript={(text) => setInput(prev => prev ? prev + ' ' + text : text)} size="md" />
            <button
              onClick={handleSend}
              disabled={!input.trim() || isLoading}
              className="px-6 py-3 bg-[#D4AF37] hover:bg-[#b8941f] text-white rounded-xl font-semibold disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              {isLoading ? (
                <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              ) : (
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M22 2L11 13M22 2l-7 20-4-9-9-4 20-7z"/></svg>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
