"use client";

import { useState, useEffect, useRef, useCallback } from 'react';
import DictationButton from '@/components/DictationButton';

interface Message {
  id: string;
  role: 'user' | 'assistant' | 'system';
  content: string;
  timestamp: number;
}

interface ParalegalWorkspace {
  name: string;
  preferences: Record<string, string>;
  frequentTopics: string[];
  lastActive: number;
}

const SYSTEM_PROMPT = `You are Lex, a virtual paralegal for 18B Lawyer — a platform built for 18-B (court-appointed) attorneys in New York.

Your expertise:
- New York Criminal Procedure Law (CPL), Penal Law, Family Court Act
- Criminal defense: arraignments, bail applications, plea negotiations, trial prep, sentencing
- Family law: custody, visitation, orders of protection, family offenses, PINS, juvenile delinquency
- 18-B panel procedures, voucher submissions, CLE requirements
- Motion drafting, legal research, case analysis, document review

Your personality:
- Professional but approachable — like a sharp paralegal who's been in the trenches
- Concise and practical — attorneys are busy, don't waste their time
- Proactive — suggest next steps, flag deadlines, anticipate issues
- You know NY courts inside and out — judges, courthouses, local rules

You can help with:
- Drafting motions, briefs, letters, and legal memoranda
- Researching case law and statutes
- Analyzing case strengths and weaknesses
- Preparing for court appearances and trials
- Managing deadlines and timelines
- Reviewing and summarizing documents
- Organizing case files and discovery
- Tracking billable hours for voucher submissions
- Client communication drafts
- Multi-perspective case analysis

Always cite relevant statutes and case law when applicable. If you're unsure about something, say so — never make up legal citations.`;

const QUICK_ACTIONS = [
  { label: '📝 Draft Motion', prompt: 'Help me draft a motion. What type of motion do you need?' },
  { label: '🔍 Research', prompt: 'I need to research case law. What legal issue are you looking into?' },
  { label: '📄 Summarize', prompt: 'I can summarize a document for you. Paste the text or describe what you need summarized.' },
  { label: '⏰ Deadlines', prompt: 'Let me help you track deadlines. What case and what deadlines are coming up?' },
  { label: '⚖️ Court Prep', prompt: 'Let\'s prepare for your court appearance. What type of proceeding and when is it?' },
];

const LLM_URL = 'https://us-central1-assigned-co-counsel.cloudfunctions.net/llm';
const USER_ID = 'default';

function getStoredMessages(): Message[] {
  if (typeof window === 'undefined') return [];
  try {
    const stored = localStorage.getItem(`acc_paralegal_history_${USER_ID}`);
    return stored ? JSON.parse(stored) : [];
  } catch { return []; }
}

function storeMessages(messages: Message[]) {
  if (typeof window === 'undefined') return;
  // Keep last 100 messages
  const trimmed = messages.slice(-100);
  localStorage.setItem(`acc_paralegal_history_${USER_ID}`, JSON.stringify(trimmed));
}

function getWorkspace(): ParalegalWorkspace {
  if (typeof window === 'undefined') return { name: '', preferences: {}, frequentTopics: [], lastActive: 0 };
  try {
    const stored = localStorage.getItem(`acc_paralegal_workspace_${USER_ID}`);
    return stored ? JSON.parse(stored) : { name: '', preferences: {}, frequentTopics: [], lastActive: 0 };
  } catch { return { name: '', preferences: {}, frequentTopics: [], lastActive: 0 }; }
}

function updateWorkspace(updates: Partial<ParalegalWorkspace>) {
  const current = getWorkspace();
  const updated = { ...current, ...updates, lastActive: Date.now() };
  localStorage.setItem(`acc_paralegal_workspace_${USER_ID}`, JSON.stringify(updated));
}

export default function ParalegalWidget() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [showQuickActions, setShowQuickActions] = useState(true);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);
  const [pulseCount, setPulseCount] = useState(0);

  useEffect(() => {
    setMessages(getStoredMessages());
    const wasOpen = localStorage.getItem('acc_paralegal_open');
    if (wasOpen === 'true') setIsOpen(true);

    const handleOpen = () => setIsOpen(true);
    window.addEventListener('open-paralegal', handleOpen);
    return () => window.removeEventListener('open-paralegal', handleOpen);
  }, []);

  useEffect(() => {
    if (messages.length > 0) setShowQuickActions(false);
  }, [messages]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isLoading]);

  useEffect(() => {
    localStorage.setItem('acc_paralegal_open', String(isOpen));
    if (isOpen && inputRef.current) {
      setTimeout(() => inputRef.current?.focus(), 300);
    }
  }, [isOpen]);

  // Gentle pulse every 30s if no messages yet
  useEffect(() => {
    if (messages.length === 0 && !isOpen) {
      const interval = setInterval(() => setPulseCount(c => c + 1), 30000);
      return () => clearInterval(interval);
    }
  }, [messages.length, isOpen]);

  const sendMessage = useCallback(async (text: string) => {
    if (!text.trim() || isLoading) return;

    const userMsg: Message = {
      id: `u_${Date.now()}`,
      role: 'user',
      content: text.trim(),
      timestamp: Date.now(),
    };

    const newMessages = [...messages, userMsg];
    setMessages(newMessages);
    storeMessages(newMessages);
    setInput('');
    setIsLoading(true);

    try {
      // Build conversation for LLM (last 20 messages for context)
      const contextMessages = newMessages.slice(-20).map(m => ({
        role: m.role === 'assistant' ? 'assistant' : 'user',
        content: m.content,
      }));

      const response = await fetch(LLM_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          messages: [
            { role: 'system', content: SYSTEM_PROMPT },
            ...contextMessages,
          ],
          provider: 'cerebras',
          task: 'paralegal',
          max_tokens: 2048,
          temperature: 0.7,
        }),
      });

      const data = await response.json();
      const aiContent = data.choices?.[0]?.message?.content || data.content || data.response || 'I apologize, I had trouble processing that. Could you try again?';

      const aiMsg: Message = {
        id: `a_${Date.now()}`,
        role: 'assistant',
        content: aiContent,
        timestamp: Date.now(),
      };

      const updated = [...newMessages, aiMsg];
      setMessages(updated);
      storeMessages(updated);
      updateWorkspace({});
    } catch (err) {
      const errMsg: Message = {
        id: `e_${Date.now()}`,
        role: 'assistant',
        content: 'I\'m having trouble connecting right now. Please try again in a moment.',
        timestamp: Date.now(),
      };
      const updated = [...newMessages, errMsg];
      setMessages(updated);
      storeMessages(updated);
    } finally {
      setIsLoading(false);
    }
  }, [messages, isLoading]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    sendMessage(input);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage(input);
    }
  };

  const clearHistory = () => {
    setMessages([]);
    storeMessages([]);
    setShowQuickActions(true);
  };

  const formatTime = (ts: number) => {
    return new Date(ts).toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' });
  };

  // Render markdown-lite (bold, code, lists)
  const renderContent = (text: string) => {
    return text.split('\n').map((line, i) => {
      let processed = line
        .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
        .replace(/`(.*?)`/g, '<code class="bg-white/10 px-1 rounded text-xs">$1</code>')
        .replace(/^- /, '• ')
        .replace(/^(\d+)\. /, '$1. ');
      return <p key={i} className={line === '' ? 'h-2' : ''} dangerouslySetInnerHTML={{ __html: processed }} />;
    });
  };

  return (
    <>
      {/* Floating Button */}
      {!isOpen && (
        <button
          onClick={() => setIsOpen(true)}
          className={`fixed bottom-6 right-6 z-50 w-14 h-14 rounded-full bg-gradient-to-br from-[#D4AF37] to-[#b8941f] text-white shadow-lg shadow-[#D4AF37]/30 hover:shadow-xl hover:shadow-[#D4AF37]/40 hover:scale-105 transition-all duration-300 flex items-center justify-center group ${pulseCount > 0 && messages.length === 0 ? 'animate-bounce' : ''}`}
          title="Chat with Lex, your Virtual Paralegal"
        >
          <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round">
            <path d="M12 2L2 7l10 5 10-5-10-5z" />
            <path d="M2 17l10 5 10-5" />
            <path d="M2 12l10 5 10-5" />
          </svg>
          {messages.length === 0 && (
            <span className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 rounded-full text-[10px] font-bold flex items-center justify-center animate-pulse">1</span>
          )}
        </button>
      )}

      {/* Chat Panel */}
      {isOpen && (
        <div className="fixed bottom-6 right-6 z-50 w-[400px] h-[560px] bg-[#0a1628] border border-white/10 rounded-2xl shadow-2xl shadow-black/50 flex flex-col overflow-hidden transition-all duration-300 animate-fade-in">
          {/* Header */}
          <div className="flex items-center justify-between px-4 py-3 bg-gradient-to-r from-[#0d2137] to-[#0a1628] border-b border-white/10">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-full bg-gradient-to-br from-[#D4AF37] to-[#b8941f] flex items-center justify-center text-white font-bold text-sm">
                L
              </div>
              <div>
                <div className="text-white font-semibold text-sm flex items-center gap-2">
                  Lex
                  <span className="w-2 h-2 rounded-full bg-green-400 animate-pulse"></span>
                </div>
                <div className="text-gray-400 text-xs">Virtual Paralegal · <span className="text-green-400">🔒 Privilege-Safe</span></div>
              </div>
            </div>
            <div className="flex items-center gap-1">
              <button
                onClick={clearHistory}
                className="p-1.5 text-gray-500 hover:text-gray-300 hover:bg-white/5 rounded-lg transition-colors"
                title="Clear conversation"
              >
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75">
                  <polyline points="3 6 5 6 21 6" /><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" />
                </svg>
              </button>
              <button
                onClick={() => { setIsOpen(false); localStorage.setItem('acc_paralegal_open', 'false'); }}
                className="p-2 text-gray-400 hover:text-white hover:bg-white/10 rounded-lg transition-colors"
                title="Close"
              >
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
                  <line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" />
                </svg>
              </button>
            </div>
          </div>

          {/* Messages */}
          <div className="flex-1 overflow-y-auto px-4 py-3 space-y-3 scrollbar-thin">
            {messages.length === 0 && showQuickActions && (
              <div className="space-y-4 pt-4">
                <div className="text-center">
                  <div className="w-16 h-16 mx-auto rounded-full bg-gradient-to-br from-[#D4AF37]/20 to-[#D4AF37]/5 border border-[#D4AF37]/30 flex items-center justify-center mb-3">
                    <span className="text-3xl">⚖️</span>
                  </div>
                  <h3 className="text-white font-semibold text-lg">Hey, I&apos;m Lex</h3>
                  <p className="text-gray-400 text-sm mt-1">Your virtual paralegal. How can I help?</p>
                </div>
                <div className="space-y-2">
                  {QUICK_ACTIONS.map((action, i) => (
                    <button
                      key={i}
                      onClick={() => sendMessage(action.prompt)}
                      className="w-full text-left px-3 py-2.5 bg-white/5 hover:bg-white/10 border border-white/10 rounded-lg text-sm text-gray-300 hover:text-white transition-all"
                    >
                      {action.label}
                    </button>
                  ))}
                </div>
                <a
                  href="/dashboard/agent"
                  className="block text-center text-xs text-[#D4AF37] hover:text-[#e8c54a] mt-2 transition-colors"
                >
                  See everything Lex can do →
                </a>
              </div>
            )}

            {messages.map((msg) => (
              <div key={msg.id} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                <div className={`max-w-[85%] ${
                  msg.role === 'user'
                    ? 'bg-[#D4AF37]/20 border border-[#D4AF37]/30 text-white'
                    : 'bg-white/5 border border-white/10 text-gray-200'
                } rounded-xl px-3 py-2.5 text-sm leading-relaxed`}>
                  <div className="space-y-1">{renderContent(msg.content)}</div>
                  <div className={`text-[10px] mt-1.5 ${msg.role === 'user' ? 'text-[#D4AF37]/60' : 'text-gray-500'}`}>
                    {formatTime(msg.timestamp)}
                  </div>
                </div>
              </div>
            ))}

            {isLoading && (
              <div className="flex justify-start">
                <div className="bg-white/5 border border-white/10 rounded-xl px-4 py-3">
                  <div className="flex gap-1.5">
                    <div className="w-2 h-2 bg-[#D4AF37] rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></div>
                    <div className="w-2 h-2 bg-[#D4AF37] rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></div>
                    <div className="w-2 h-2 bg-[#D4AF37] rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></div>
                  </div>
                </div>
              </div>
            )}

            <div ref={messagesEndRef} />
          </div>

          {/* Input */}
          <form onSubmit={handleSubmit} className="px-4 py-3 border-t border-white/10 bg-[#0d2137]/50">
            <div className="flex items-end gap-2">
              <div className="flex-1 relative">
                <textarea
                  ref={inputRef}
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyDown={handleKeyDown}
                  placeholder="Ask Lex anything..."
                  rows={1}
                  className="w-full bg-white/5 border border-white/10 rounded-xl px-3 py-2.5 text-sm text-white placeholder-gray-500 focus:outline-none focus:border-[#D4AF37]/50 focus:ring-1 focus:ring-[#D4AF37]/30 resize-none"
                  style={{ maxHeight: '120px' }}
                />
              </div>
              <DictationButton
                onTranscript={(text) => setInput(text)}
                size="sm"
              />
              <button
                type="submit"
                disabled={!input.trim() || isLoading}
                className="p-2.5 bg-[#D4AF37] hover:bg-[#e8c54a] disabled:opacity-30 disabled:hover:bg-[#D4AF37] rounded-xl text-white transition-colors"
              >
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <line x1="22" y1="2" x2="11" y2="13" /><polygon points="22 2 15 22 11 13 2 9 22 2" />
                </svg>
              </button>
            </div>
          </form>
        </div>
      )}
    </>
  );
}
