"use client";

import { useState } from 'react';
import Link from 'next/link';

interface PrepSession {
  id: string;
  caseName: string;
  clientName: string;
  status: 'draft' | 'sent' | 'in-progress' | 'completed';
  createdAt: string;
  completedAt?: string;
  questions: number;
  answered: number;
  link: string;
}

const MOCK_SESSIONS: PrepSession[] = [
  { id: 'prep-001', caseName: 'People v. Martinez', clientName: 'Carlos Martinez', status: 'completed', createdAt: '2025-02-10', completedAt: '2025-02-12', questions: 8, answered: 8, link: '/prep/prep-001' },
  { id: 'prep-002', caseName: 'People v. Chen', clientName: 'Wei Chen', status: 'in-progress', createdAt: '2025-02-14', questions: 8, answered: 3, link: '/prep/prep-002' },
  { id: 'prep-003', caseName: 'Matter of Davis', clientName: 'Angela Davis', status: 'sent', createdAt: '2025-02-15', questions: 6, answered: 0, link: '/prep/prep-003' },
];

const CASES = ['People v. Martinez', 'People v. Chen', 'Matter of Davis', 'Mitchell Estate', 'Park Estate'];

const STATUS_STYLES: Record<string, string> = {
  'draft': 'bg-slate-100 text-slate-600',
  'sent': 'bg-blue-100 text-blue-700',
  'in-progress': 'bg-amber-100 text-amber-700',
  'completed': 'bg-emerald-100 text-emerald-700',
};

export default function TrialPrepPage() {
  const [sessions, setSessions] = useState<PrepSession[]>(MOCK_SESSIONS);
  const [showCreate, setShowCreate] = useState(false);
  const [selectedSession, setSelectedSession] = useState<PrepSession | null>(null);
  const [newCase, setNewCase] = useState('');
  const [newClient, setNewClient] = useState('');
  const [copiedLink, setCopiedLink] = useState(false);

  const createSession = () => {
    if (!newCase || !newClient) return;
    const session: PrepSession = {
      id: `prep-${Date.now().toString(36)}`,
      caseName: newCase,
      clientName: newClient,
      status: 'draft',
      createdAt: new Date().toISOString().split('T')[0],
      questions: 8,
      answered: 0,
      link: `/prep/prep-${Date.now().toString(36)}`,
    };
    setSessions([session, ...sessions]);
    setShowCreate(false);
    setNewCase('');
    setNewClient('');
  };

  const copyLink = (link: string) => {
    navigator.clipboard.writeText(`https://assigned-co-counsel.web.app${link}`);
    setCopiedLink(true);
    setTimeout(() => setCopiedLink(false), 2000);
  };

  return (
    <div className="p-4 sm:p-6 lg:p-8 max-w-5xl mx-auto animate-fade-in">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Trial Prep</h1>
          <p className="text-slate-500 text-sm mt-1">Create AI-powered prep sessions your clients can complete on their own.</p>
        </div>
        <button onClick={() => setShowCreate(true)} className="inline-flex items-center gap-2 bg-slate-900 hover:bg-slate-800 text-white px-5 py-2.5 rounded-xl text-sm font-bold transition-colors shadow-sm">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>
          New Prep Session
        </button>
      </div>

      {/* How It Works */}
      <div className="bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-200 rounded-2xl p-6 mb-8">
        <h3 className="font-bold text-blue-900 mb-4">How It Works</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="flex gap-3">
            <div className="w-8 h-8 rounded-full bg-blue-600 text-white flex items-center justify-center font-bold text-sm flex-shrink-0">1</div>
            <div>
              <p className="font-bold text-sm text-blue-900">Create a Session</p>
              <p className="text-xs text-blue-700">Select the case and customize the prep questions.</p>
            </div>
          </div>
          <div className="flex gap-3">
            <div className="w-8 h-8 rounded-full bg-blue-600 text-white flex items-center justify-center font-bold text-sm flex-shrink-0">2</div>
            <div>
              <p className="font-bold text-sm text-blue-900">Share the Link</p>
              <p className="text-xs text-blue-700">Send a secure URL to your client. No login needed.</p>
            </div>
          </div>
          <div className="flex gap-3">
            <div className="w-8 h-8 rounded-full bg-blue-600 text-white flex items-center justify-center font-bold text-sm flex-shrink-0">3</div>
            <div>
              <p className="font-bold text-sm text-blue-900">Review Responses</p>
              <p className="text-xs text-blue-700">Read their answers and spot issues before trial.</p>
            </div>
          </div>
        </div>
      </div>

      {/* Sessions List */}
      <div className="bg-white border border-slate-200 rounded-2xl overflow-hidden shadow-sm">
        <div className="px-6 py-4 border-b border-slate-100">
          <h2 className="font-bold text-slate-800">Prep Sessions</h2>
        </div>
        <div className="divide-y divide-slate-100">
          {sessions.map(session => (
            <div key={session.id} className="px-6 py-4 hover:bg-slate-50 transition-colors">
              <div className="flex items-center justify-between mb-2">
                <div>
                  <h3 className="font-bold text-slate-900">{session.caseName}</h3>
                  <p className="text-xs text-slate-500">Client: {session.clientName} · Created {session.createdAt}</p>
                </div>
                <span className={`text-[10px] font-bold px-2.5 py-1 rounded-full uppercase ${STATUS_STYLES[session.status]}`}>
                  {session.status.replace('-', ' ')}
                </span>
              </div>

              {/* Progress Bar */}
              <div className="flex items-center gap-3 mb-3">
                <div className="flex-1 bg-slate-100 rounded-full h-2">
                  <div className="bg-blue-500 h-2 rounded-full transition-all" style={{ width: `${(session.answered / session.questions) * 100}%` }} />
                </div>
                <span className="text-xs text-slate-500 font-medium">{session.answered}/{session.questions}</span>
              </div>

              {/* Actions */}
              <div className="flex gap-2">
                <button onClick={() => copyLink(session.link)} className="px-3 py-1.5 bg-blue-50 hover:bg-blue-100 text-blue-700 text-xs font-bold rounded-lg transition-colors border border-blue-200">
                  {copiedLink ? '✅ Copied!' : '🔗 Copy Client Link'}
                </button>
                {session.status === 'completed' && (
                  <button onClick={() => setSelectedSession(session)} className="px-3 py-1.5 bg-emerald-50 hover:bg-emerald-100 text-emerald-700 text-xs font-bold rounded-lg transition-colors border border-emerald-200">
                    📋 Review Responses
                  </button>
                )}
                {session.status === 'draft' && (
                  <button className="px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold rounded-lg transition-colors">
                    ✏️ Edit Questions
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Create Session Modal */}
      {showCreate && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl w-full max-w-md p-6 shadow-2xl">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-lg font-bold text-slate-900">New Prep Session</h2>
              <button onClick={() => setShowCreate(false)} className="text-slate-400 hover:text-slate-600">✕</button>
            </div>
            <div className="space-y-4">
              <div>
                <label className="text-xs font-bold text-slate-600 block mb-1">Case / Matter</label>
                <select value={newCase} onChange={e => setNewCase(e.target.value)} className="w-full border border-slate-200 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500/20 focus:border-blue-300">
                  <option value="">Select a case...</option>
                  {CASES.map(c => <option key={c} value={c}>{c}</option>)}
                </select>
              </div>
              <div>
                <label className="text-xs font-bold text-slate-600 block mb-1">Client Name</label>
                <input type="text" value={newClient} onChange={e => setNewClient(e.target.value)} placeholder="e.g., John Doe" className="w-full border border-slate-200 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500/20 focus:border-blue-300" />
              </div>
              <button onClick={createSession} disabled={!newCase || !newClient} className="w-full py-3 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl disabled:opacity-50 transition-colors">
                Create & Generate Link
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Review Modal */}
      {selectedSession && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl w-full max-w-2xl p-6 shadow-2xl max-h-[80vh] overflow-y-auto">
            <div className="flex justify-between items-center mb-6">
              <div>
                <h2 className="text-lg font-bold text-slate-900">{selectedSession.caseName}</h2>
                <p className="text-xs text-slate-500">Client: {selectedSession.clientName} · Completed {selectedSession.completedAt}</p>
              </div>
              <button onClick={() => setSelectedSession(null)} className="text-slate-400 hover:text-slate-600">✕</button>
            </div>
            <div className="space-y-4">
              {[
                { q: 'Tell me what happened in your own words.', a: 'I was walking home from work around 11pm. Two officers approached me and asked for ID. I gave them my ID. They said I matched a description and searched me.' },
                { q: 'Were there any witnesses present?', a: 'My neighbor Mrs. Johnson was on her porch. She saw the whole thing. Also there might be camera footage from the bodega on the corner.' },
                { q: 'What do you remember about the time and location?', a: 'It was around 11:15pm on January 12th. Corner of Fulton and Nostrand in Brooklyn. I remember because I had just checked my phone.' },
                { q: 'Is there anything the other side might say that concerns you?', a: 'They might say I was acting suspicious but I was just walking home like I do every night. I work late shifts at the hospital.' },
                { q: 'Do you have any photos, documents, or evidence?', a: 'I have my work schedule showing I clocked out at 10:45pm. Also text messages to my wife saying I was on my way home.' },
              ].map((item, i) => (
                <div key={i} className="border border-slate-200 rounded-xl p-4">
                  <p className="text-xs font-bold text-slate-500 uppercase mb-2">Question {i + 1}</p>
                  <p className="text-sm font-semibold text-slate-800 mb-3">{item.q}</p>
                  <div className="bg-blue-50 rounded-lg p-3 border border-blue-100">
                    <p className="text-sm text-slate-700">{item.a}</p>
                  </div>
                </div>
              ))}
            </div>
            <div className="mt-6 flex gap-3">
              <button className="flex-1 py-2.5 bg-slate-900 text-white font-bold rounded-xl hover:bg-slate-800 transition-colors">Export as PDF</button>
              <button className="px-4 py-2.5 bg-emerald-50 text-emerald-700 font-bold rounded-xl hover:bg-emerald-100 border border-emerald-200 transition-colors">Add to Case RAG</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
