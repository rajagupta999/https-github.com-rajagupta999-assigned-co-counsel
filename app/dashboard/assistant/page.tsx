"use client";

import { useState, useRef, useEffect, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import { usePracticeMode } from '@/context/PracticeModeContext';
import { useAppContext } from '@/context/AppContext';
import { streamLLM, TaskType } from '@/lib/multiLLM';
import DictationButton from '@/components/DictationButton';

interface Message {
  id: string;
  role: 'user' | 'ai';
  content: string;
  timestamp: Date;
}

type AssistantMode = 'email' | 'schedule' | 'billing' | 'reminders' | 'general';

const MODES: { id: AssistantMode; label: string; icon: string; desc: string }[] = [
  { id: 'general', label: 'General', icon: '💼', desc: 'Any logistics task' },
  { id: 'email', label: 'Email & Messages', icon: '📧', desc: 'Draft client emails, court correspondence' },
  { id: 'schedule', label: 'Scheduling', icon: '📅', desc: 'Court dates, hearings, meetings' },
  { id: 'billing', label: 'Billing & Vouchers', icon: '💰', desc: 'Invoices, vouchers, expenses' },
  { id: 'reminders', label: 'Reminders & Tasks', icon: '🔔', desc: 'Follow-ups, deadlines, to-dos' },
];

const QUICK_ACTIONS = [
  { icon: '📧', label: 'Email client about court date', prompt: 'Draft an email to my client informing them about their upcoming court date. Include what they should bring and how to prepare.' },
  { icon: '📅', label: 'Schedule hearing for next week', prompt: 'Help me draft a request to schedule a hearing for next week. Include suggested dates and the type of hearing.' },
  { icon: '💰', label: 'Draft invoice / voucher', prompt: 'Help me prepare a voucher for my recent work. I will provide the case details and time entries.' },
  { icon: '🔔', label: 'Remind me to file', prompt: 'Set up a reminder for an upcoming filing deadline. What case and deadline should I track?' },
  { icon: '✉️', label: 'Letter to opposing counsel', prompt: 'Draft a professional letter to opposing counsel regarding our pending matter.' },
  { icon: '📋', label: 'Morning briefing', prompt: 'Give me a morning briefing template — what should I check every morning to stay on top of my cases?' },
];

const CAPABILITY_CARDS = [
  {
    icon: '💻',
    title: 'Connect Local Drive',
    desc: 'I can read your local case files without uploading them to the cloud.',
    action: 'How do I connect my local files?',
    badge: 'New',
  },
  {
    icon: '📢',
    title: 'Google Ads Integration',
    desc: 'Let AI set up and manage your Google Ads campaigns automatically.',
    action: 'Set up Google Ads for my practice',
    badge: 'Beta',
  },
];

function AssistantPageInner() {
  const { mode, isProSe } = usePracticeMode();
  const { currentCase } = useAppContext();

  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [assistantMode, setAssistantMode] = useState<AssistantMode>('general');
  const [showSetupFlow, setShowSetupFlow] = useState<'local-agent' | 'google-ads' | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const searchParams = useSearchParams();

  // Auto-open setup flow from URL params (e.g., ?action=local-agent)
  useEffect(() => {
    const action = searchParams.get('action');
    if (action === 'local-agent') setShowSetupFlow('local-agent');
    if (action === 'google-ads') setShowSetupFlow('google-ads');
  }, [searchParams]);

  useEffect(() => { messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' }); }, [messages]);

  const systemPrompt = `You are the Virtual Assistant — a logistics, communication, and scheduling assistant for a practicing attorney.
Your role: Help with emails, scheduling, invoicing, reminders, client communication, and administrative tasks.
Style: Efficient, professional, action-oriented. Provide ready-to-use drafts.
${currentCase ? `Current case: ${currentCase.client} - ${currentCase.charges}` : ''}
${assistantMode !== 'general' ? `Current focus: ${assistantMode}` : ''}

When drafting communications:
- Use professional but approachable tone
- Include all necessary details (dates, times, locations)
- Provide the draft ready to copy and send
- Flag anything the attorney needs to fill in with [BRACKETS]

Note: You are an AI assistant providing draft text. You cannot actually send emails, create calendar events, or access external systems. Clearly indicate when the attorney needs to take the actual action.`;

  const handleSend = async () => {
    if (!input.trim() || isLoading) return;
    const userMessage: Message = { id: `msg_${Date.now()}`, role: 'user', content: input.trim(), timestamp: new Date() };
    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setIsLoading(true);

    try {
      let content = '';
      await streamLLM('cerebras', [
        { role: 'system', content: systemPrompt },
        ...messages.slice(-10).map(m => ({ role: m.role === 'ai' ? 'assistant' as const : 'user' as const, content: m.content })),
        { role: 'user', content: userMessage.content },
      ], (chunk) => { content += chunk; }, { task: 'chat' as TaskType });
      setMessages(prev => [...prev, { id: `msg_${Date.now()}`, role: 'ai', content, timestamp: new Date() }]);
    } catch (error) {
      setMessages(prev => [...prev, { id: `msg_${Date.now()}`, role: 'ai', content: `Error: ${error instanceof Error ? error.message : 'Unknown error'}`, timestamp: new Date() }]);
    }
    setIsLoading(false);
  };

  return (
    <div className="h-[calc(100vh-64px)] flex flex-col">
      {/* Header */}
      <div className="bg-white border-b border-slate-200 px-4 py-3">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-emerald-500 to-emerald-700 flex items-center justify-center shadow-sm">
              <span className="text-xl">💼</span>
            </div>
            <div>
              <h1 className="text-lg font-bold text-slate-900">Virtual Assistant</h1>
              <p className="text-xs text-slate-500">Logistics, communication & scheduling</p>
            </div>
          </div>
          <span className="text-[9px] px-2 py-1 bg-amber-50 text-amber-600 border border-amber-200 rounded-full font-medium">Preview</span>
        </div>

        {/* Mode Selector */}
        <div className="flex items-center gap-2 overflow-x-auto pb-1">
          {MODES.map(m => (
            <button
              key={m.id}
              onClick={() => setAssistantMode(m.id)}
              className={`flex items-center gap-2 px-3 py-2 rounded-lg text-xs font-semibold whitespace-nowrap transition-colors ${
                assistantMode === m.id ? 'bg-emerald-600 text-white' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
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
            <div className="w-20 h-20 bg-gradient-to-br from-emerald-500 to-emerald-700 rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-lg">
              <span className="text-4xl">💼</span>
            </div>
            <h2 className="text-xl font-bold text-slate-800 mb-2">Your Virtual Assistant</h2>
            <p className="text-slate-500 max-w-md mx-auto mb-6">
              Handle logistics so you can focus on lawyering. Draft emails, schedule hearings, prepare invoices, and manage reminders.
            </p>

            {/* Coming Soon Banner */}
            <div className="max-w-lg mx-auto mb-6 p-4 bg-gradient-to-r from-emerald-50 to-teal-50 border border-emerald-200 rounded-xl">
              <p className="text-sm font-semibold text-emerald-800 mb-1">🚀 Coming Soon: Full Integration</p>
              <p className="text-xs text-emerald-600">
                Calendar sync, email sending, SMS reminders, and payment processing. For now, your assistant drafts everything — you copy and send.
              </p>
            </div>

            {/* Capabilities */}
            <div className="max-w-3xl mx-auto mb-8">
              <h3 className="text-sm font-semibold text-slate-600 mb-3">Capabilities</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {CAPABILITY_CARDS.map((card, i) => (
                  <button
                    key={i}
                    onClick={() => {
                      if (card.title === 'Connect Local Drive') setShowSetupFlow('local-agent');
                      else if (card.title === 'Google Ads Integration') setShowSetupFlow('google-ads');
                    }}
                    className="p-4 bg-gradient-to-br from-white to-slate-50 border border-slate-200 rounded-xl text-left hover:shadow-md hover:border-emerald-300 transition-all group"
                  >
                    <div className="flex items-start justify-between mb-2">
                      <span className="text-2xl">{card.icon}</span>
                      <span className="text-[9px] px-2 py-0.5 bg-emerald-50 text-emerald-600 border border-emerald-200 rounded-full font-bold uppercase">{card.badge}</span>
                    </div>
                    <h4 className="text-sm font-bold text-slate-800 mb-1 group-hover:text-emerald-700 transition-colors">{card.title}</h4>
                    <p className="text-xs text-slate-500">{card.desc}</p>
                  </button>
                ))}
              </div>
            </div>

            {/* Setup Flow Modal */}
            {showSetupFlow === 'local-agent' && (
              <div className="max-w-lg mx-auto mb-6 p-5 bg-white border-2 border-emerald-200 rounded-2xl shadow-lg text-left">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center">
                    <span className="text-xl">💻</span>
                  </div>
                  <div>
                    <h4 className="font-bold text-slate-800">Connect Local Drive</h4>
                    <p className="text-xs text-slate-500">Secure local file access</p>
                  </div>
                  <button onClick={() => setShowSetupFlow(null)} className="ml-auto text-slate-400 hover:text-slate-600">✕</button>
                </div>
                <div className="space-y-3 mb-4">
                  <div className="flex items-start gap-3 p-3 bg-slate-50 rounded-lg">
                    <span className="text-emerald-500 font-bold text-sm mt-0.5">1</span>
                    <p className="text-sm text-slate-600">Download the Local Agent script. It runs on your laptop and lets the assistant search your documents securely — nothing is uploaded to the cloud.</p>
                  </div>
                  <div className="flex items-start gap-3 p-3 bg-slate-50 rounded-lg">
                    <span className="text-emerald-500 font-bold text-sm mt-0.5">2</span>
                    <p className="text-sm text-slate-600">Unzip and run <code className="bg-slate-200 px-1.5 py-0.5 rounded text-xs">./start-agent.sh</code> in a terminal. It will connect automatically.</p>
                  </div>
                  <div className="flex items-start gap-3 p-3 bg-slate-50 rounded-lg">
                    <span className="text-emerald-500 font-bold text-sm mt-0.5">3</span>
                    <p className="text-sm text-slate-600">Ask the assistant to search your files — it will use the local agent to read them on your machine.</p>
                  </div>
                </div>
                <div className="flex gap-2">
                  <a
                    href="/sovereign-agent.zip"
                    download
                    className="flex-1 flex items-center justify-center gap-2 px-4 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl font-semibold text-sm transition-colors"
                  >
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4M7 10l5 5 5-5M12 15V3"/></svg>
                    Download sovereign-agent.zip
                  </a>
                  <button
                    onClick={() => {
                      setShowSetupFlow(null);
                      setInput('I have SSH access to my machine. Can you configure the local agent for me?');
                    }}
                    className="px-4 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl font-semibold text-sm transition-colors whitespace-nowrap"
                  >
                    🤖 Let AI Install It
                  </button>
                </div>
              </div>
            )}

            {showSetupFlow === 'google-ads' && (
              <div className="max-w-lg mx-auto mb-6 p-5 bg-white border-2 border-emerald-200 rounded-2xl shadow-lg text-left">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-yellow-400 to-red-500 flex items-center justify-center">
                    <span className="text-xl">📢</span>
                  </div>
                  <div>
                    <h4 className="font-bold text-slate-800">Google Ads Setup</h4>
                    <p className="text-xs text-slate-500">AI-managed ad campaigns</p>
                  </div>
                  <button onClick={() => setShowSetupFlow(null)} className="ml-auto text-slate-400 hover:text-slate-600">✕</button>
                </div>
                <p className="text-sm text-slate-600 mb-4">The assistant can guide you through connecting your Google Ads account, or configure it automatically if you grant access.</p>
                <div className="flex gap-2">
                  <button
                    onClick={() => {
                      setShowSetupFlow(null);
                      setInput('Walk me through setting up Google Ads for my law practice step by step.');
                    }}
                    className="flex-1 px-4 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl font-semibold text-sm transition-colors"
                  >
                    📋 Guide Me
                  </button>
                  <button
                    onClick={() => {
                      setShowSetupFlow(null);
                      setInput('I want you to set up Google Ads for me automatically. What access do you need?');
                    }}
                    className="flex-1 px-4 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl font-semibold text-sm transition-colors"
                  >
                    🤖 Let AI Install It
                  </button>
                </div>
              </div>
            )}

            {/* Quick Actions */}
            <div className="max-w-3xl mx-auto">
              <h3 className="text-sm font-semibold text-slate-600 mb-3">Quick Actions</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2">
                {QUICK_ACTIONS.map((a, i) => (
                  <button
                    key={i}
                    onClick={() => setInput(a.prompt)}
                    className="p-3 bg-white border border-slate-200 rounded-xl text-left hover:shadow-sm hover:border-emerald-300 transition-all"
                  >
                    <div className="flex items-center gap-2 mb-1">
                      <span>{a.icon}</span>
                      <span className="text-sm font-medium text-slate-700">{a.label}</span>
                    </div>
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}

        {messages.map((message) => (
          <div key={message.id} className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}>
            <div className={`max-w-[85%] rounded-2xl px-4 py-3 ${
              message.role === 'user' ? 'bg-emerald-600 text-white' : 'bg-white border border-slate-200'
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
            </div>
          </div>
        ))}

        {isLoading && (
          <div className="flex justify-start">
            <div className="bg-white border border-slate-200 rounded-2xl px-4 py-3">
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-emerald-500 rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></div>
                <div className="w-2 h-2 bg-emerald-500 rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></div>
                <div className="w-2 h-2 bg-emerald-500 rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></div>
                <span className="ml-2 text-sm text-slate-500">Working on it...</span>
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
            placeholder="Email client about court date, schedule a hearing, draft an invoice..."
            className="flex-1 px-4 py-3 border border-slate-200 rounded-xl resize-none focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-300"
            rows={2}
          />
          <DictationButton onTranscript={(text) => setInput(prev => prev ? prev + ' ' + text : text)} size="md" />
          <button
            onClick={handleSend}
            disabled={!input.trim() || isLoading}
            className="px-6 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl font-semibold disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
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
  );
}

export default function AssistantPage() {
  return (
    <Suspense fallback={<div className="flex items-center justify-center h-screen"><div className="animate-spin w-8 h-8 border-4 border-emerald-500 border-t-transparent rounded-full"></div></div>}>
      <AssistantPageInner />
    </Suspense>
  );
}
