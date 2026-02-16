"use client";

import { useState, useEffect, useRef } from 'react';
import { useParams } from 'next/navigation';

interface PrepQuestion {
  id: number;
  text: string;
}

const PREP_QUESTIONS: PrepQuestion[] = [
  { id: 1, text: "Tell me what happened in your own words." },
  { id: 2, text: "Were there any witnesses? If so, who?" },
  { id: 3, text: "What do you remember about the time and location?" },
  { id: 4, text: "Is there anything you think the other side might say?" },
  { id: 5, text: "Do you have any documents or photos related to this?" },
];

const MOCK_SESSIONS: Record<string, { caseName: string; lawyerName: string; instructions: string }> = {
  'prep-abc123': { caseName: 'Smith Custody Matter', lawyerName: 'Rachel Adams, Esq.', instructions: 'Please answer honestly and in your own words.' },
  'prep-def456': { caseName: 'Johnson v. Metro Transit', lawyerName: 'David Chen, Esq.', instructions: 'Take your time with each question.' },
  'prep-ghi789': { caseName: 'People v. Williams', lawyerName: 'Rachel Adams, Esq.', instructions: 'Focus on what you personally saw and heard.' },
};

export default function ClientPrepPage() {
  const params = useParams();
  const id = params.id as string;
  const session = MOCK_SESSIONS[id];

  const [currentQ, setCurrentQ] = useState(0);
  const [answers, setAnswers] = useState<string[]>(PREP_QUESTIONS.map(() => ''));
  const [input, setInput] = useState('');
  const [chatHistory, setChatHistory] = useState<{ role: 'ai' | 'client'; text: string }[]>([]);
  const [submitted, setSubmitted] = useState(false);
  const [started, setStarted] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [chatHistory]);

  if (!session) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4">
        <div className="bg-white rounded-2xl shadow-lg p-8 max-w-md text-center">
          <div className="text-4xl mb-4">🔒</div>
          <h1 className="text-xl font-bold text-slate-900 mb-2">Session Not Found</h1>
          <p className="text-sm text-slate-500">This preparation link may have expired or is invalid. Please contact your attorney for a new link.</p>
        </div>
      </div>
    );
  }

  if (submitted) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4">
        <div className="bg-white rounded-2xl shadow-lg p-8 max-w-md text-center">
          <div className="text-5xl mb-4">✅</div>
          <h1 className="text-xl font-bold text-slate-900 mb-2">Thank You!</h1>
          <p className="text-sm text-slate-500 mb-4">
            Your responses have been securely submitted to {session.lawyerName}. They will review your answers before your next meeting.
          </p>
          <p className="text-xs text-slate-400">You can close this page now.</p>
        </div>
      </div>
    );
  }

  const progress = started ? ((currentQ) / PREP_QUESTIONS.length) * 100 : 0;
  const allAnswered = currentQ >= PREP_QUESTIONS.length;

  const handleSend = () => {
    if (!input.trim()) return;
    const answer = input.trim();
    setInput('');

    setChatHistory(prev => [...prev, { role: 'client', text: answer }]);

    const newAnswers = [...answers];
    newAnswers[currentQ] = answer;
    setAnswers(newAnswers);

    const nextQ = currentQ + 1;
    setCurrentQ(nextQ);

    if (nextQ < PREP_QUESTIONS.length) {
      setTimeout(() => {
        setChatHistory(prev => [...prev, { role: 'ai', text: PREP_QUESTIONS[nextQ].text }]);
      }, 800);
    }
  };

  const handleStart = () => {
    setStarted(true);
    setChatHistory([{ role: 'ai', text: PREP_QUESTIONS[0].text }]);
  };

  const handleSubmit = () => {
    console.log('Submitting answers:', { sessionId: id, answers });
    setSubmitted(true);
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col">
      {/* Header */}
      <header className="bg-white border-b border-slate-200 px-4 py-4 shrink-0">
        <div className="max-w-2xl mx-auto">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-blue-600 rounded-xl flex items-center justify-center">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z"/>
                <polyline points="14 2 14 8 20 8"/>
              </svg>
            </div>
            <div>
              <h1 className="text-base font-bold text-slate-900">Trial Preparation Session</h1>
              <p className="text-xs text-slate-500">{session.caseName} — Prepared by {session.lawyerName}</p>
            </div>
          </div>
          {started && (
            <div className="mt-3">
              <div className="flex items-center justify-between mb-1">
                <span className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider">Progress</span>
                <span className="text-[10px] font-bold text-slate-500">
                  {Math.min(currentQ, PREP_QUESTIONS.length)} of {PREP_QUESTIONS.length} questions
                </span>
              </div>
              <div className="h-2 bg-slate-100 rounded-full overflow-hidden">
                <div
                  className="h-full bg-blue-600 rounded-full transition-all duration-500 ease-out"
                  style={{ width: `${progress}%` }}
                />
              </div>
            </div>
          )}
        </div>
      </header>

      {/* Chat area */}
      <div className="flex-1 overflow-y-auto">
        <div className="max-w-2xl mx-auto px-4 py-6 space-y-4">
          {!started ? (
            <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6 text-center">
              <div className="text-4xl mb-4">👋</div>
              <h2 className="text-lg font-bold text-slate-900 mb-2">Welcome</h2>
              <p className="text-sm text-slate-600 mb-2">
                Your attorney has prepared a few questions to help get ready for your case. This should take about 5-10 minutes.
              </p>
              {session.instructions && (
                <p className="text-xs text-blue-600 bg-blue-50 rounded-lg px-4 py-2 mb-4 inline-block">
                  💬 {session.instructions}
                </p>
              )}
              <div className="text-xs text-slate-400 mb-4 space-y-1">
                <p>• Your responses are confidential and only shared with your attorney</p>
                <p>• Take your time — there are no right or wrong answers</p>
                <p>• Answer honestly and in your own words</p>
              </div>
              <button
                onClick={handleStart}
                className="px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-xl text-sm transition-colors"
              >
                Begin Preparation
              </button>
            </div>
          ) : (
            <>
              {chatHistory.map((msg, i) => (
                <div key={i} className={`flex ${msg.role === 'client' ? 'justify-end' : 'justify-start'}`}>
                  <div className={`max-w-[85%] rounded-2xl px-4 py-3 ${
                    msg.role === 'client'
                      ? 'bg-blue-600 text-white'
                      : 'bg-white border border-slate-200 text-slate-800 shadow-sm'
                  }`}>
                    {msg.role === 'ai' && (
                      <div className="text-[10px] font-bold text-blue-600 mb-1">Legal Assistant</div>
                    )}
                    <p className="text-sm leading-relaxed whitespace-pre-wrap">{msg.text}</p>
                  </div>
                </div>
              ))}

              {allAnswered && (
                <div className="flex justify-center pt-4">
                  <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6 text-center max-w-md">
                    <div className="text-3xl mb-3">🎉</div>
                    <h3 className="text-base font-bold text-slate-900 mb-2">All Done!</h3>
                    <p className="text-sm text-slate-500 mb-4">
                      Thank you for taking the time to answer these questions. Click below to securely send your responses to {session.lawyerName}.
                    </p>
                    <button
                      onClick={handleSubmit}
                      className="px-6 py-3 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-xl text-sm transition-colors"
                    >
                      ✅ Submit to Your Attorney
                    </button>
                  </div>
                </div>
              )}
              <div ref={messagesEndRef} />
            </>
          )}
        </div>
      </div>

      {/* Input area */}
      {started && !allAnswered && (
        <div className="bg-white border-t border-slate-200 px-4 py-3 shrink-0">
          <div className="max-w-2xl mx-auto flex gap-2">
            <textarea
              value={input}
              onChange={e => setInput(e.target.value)}
              onKeyDown={e => {
                if (e.key === 'Enter' && !e.shiftKey) {
                  e.preventDefault();
                  handleSend();
                }
              }}
              placeholder="Type your answer here..."
              rows={2}
              className="flex-1 px-4 py-2.5 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 resize-none"
            />
            <button
              onClick={handleSend}
              disabled={!input.trim()}
              className="px-5 py-2 bg-blue-600 hover:bg-blue-700 text-white text-sm font-semibold rounded-xl disabled:opacity-50 transition-colors self-end"
            >
              Send
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
