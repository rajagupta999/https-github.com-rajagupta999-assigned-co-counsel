"use client";

import { useState, useRef } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';

// ---------- Mock Data ----------
const CLIENT_DATA: Record<string, {
  name: string; caseName: string; caseStatus: string; nextDate: string; prepId: string; prepStatus: string;
  proSeEnabled: boolean;
  invoices: { id: string; desc: string; amount: number; due: string; paid: boolean }[];
  documents: { name: string; category: string; date: string; status: string }[];
  messages: { from: string; text: string; time: string; channel: string }[];
  events: { title: string; date: string; type: string }[];
  retainerBalance: number; trustBalance: number;
  recommendations: { text: string; tier: 'prose' | '18b' | 'private' }[];
}> = {
  'client-martinez': {
    name: 'Carlos Martinez', caseName: 'People v. Martinez', caseStatus: 'Pre-Trial', nextDate: '2026-03-15',
    prepId: 'martinez-prep', prepStatus: 'In Progress', proSeEnabled: true,
    invoices: [
      { id: 'INV-001', desc: 'Court appearance 2/10', amount: 0, due: '2026-02-28', paid: true },
      { id: 'INV-002', desc: 'Motion drafting', amount: 750, due: '2026-03-15', paid: false },
    ],
    documents: [
      { name: 'Government ID', category: 'Identity Documents', date: '2026-01-15', status: 'Reviewed' },
      { name: 'Police Report', category: 'Case Documents', date: '2026-01-20', status: 'Reviewed' },
      { name: 'Pay Stubs', category: 'Financial Records', date: '2026-02-01', status: 'Pending Review' },
    ],
    messages: [
      { from: 'Attorney', text: 'Your next court date is March 15. Please review the documents I shared.', time: '2026-02-14 10:30 AM', channel: 'Portal Chat' },
      { from: 'You', text: 'Thank you. I uploaded my pay stubs.', time: '2026-02-14 2:15 PM', channel: 'Portal Chat' },
      { from: 'Attorney', text: 'Got them, will review today.', time: '2026-02-14 3:00 PM', channel: 'Portal Chat' },
    ],
    events: [
      { title: 'Court Appearance — Part 32', date: '2026-03-15', type: 'court' },
      { title: 'Motion Filing Deadline', date: '2026-03-10', type: 'deadline' },
      { title: 'Attorney Meeting', date: '2026-03-01', type: 'meeting' },
    ],
    retainerBalance: 2500, trustBalance: 1200,
    recommendations: [
      { text: 'File your Financial Disclosure yourself (Pro Se) — Save ~$500', tier: 'prose' },
      { text: 'Custody hearing — Use Assigned Counsel (state-funded)', tier: '18b' },
      { text: 'Equitable Distribution — Private representation recommended', tier: 'private' },
    ],
  },
  'client-chen': {
    name: 'Wei Chen', caseName: 'People v. Chen', caseStatus: 'Discovery', nextDate: '2026-04-02',
    prepId: 'chen-prep', prepStatus: 'Not Started', proSeEnabled: true,
    invoices: [{ id: 'INV-010', desc: 'Initial consultation', amount: 500, due: '2026-03-01', paid: false }],
    documents: [{ name: 'Passport Copy', category: 'Identity Documents', date: '2026-02-10', status: 'Pending Review' }],
    messages: [{ from: 'Attorney', text: 'Welcome to the portal! Please upload your documents at your earliest convenience.', time: '2026-02-12 9:00 AM', channel: 'Email' }],
    events: [{ title: 'Discovery Conference', date: '2026-04-02', type: 'court' }],
    retainerBalance: 5000, trustBalance: 0,
    recommendations: [
      { text: 'File your own Answer to the Complaint (Pro Se) — Save ~$300', tier: 'prose' },
      { text: 'Discovery phase — Assigned Counsel handles this', tier: '18b' },
    ],
  },
  'client-davis': {
    name: 'Angela Davis', caseName: 'Matter of Davis', caseStatus: 'Active', nextDate: '2026-03-22',
    prepId: 'davis-prep', prepStatus: 'Completed', proSeEnabled: true,
    invoices: [
      { id: 'INV-020', desc: 'Filing fees', amount: 350, due: '2026-02-15', paid: true },
      { id: 'INV-021', desc: 'Document preparation', amount: 1200, due: '2026-03-01', paid: false },
    ],
    documents: [
      { name: 'Birth Certificate', category: 'Identity Documents', date: '2026-01-10', status: 'Reviewed' },
      { name: 'Financial Affidavit', category: 'Financial Records', date: '2026-02-05', status: 'Action Needed' },
    ],
    messages: [
      { from: 'Attorney', text: 'Please update the financial affidavit with your 2025 tax info.', time: '2026-02-13 11:00 AM', channel: 'SMS' },
    ],
    events: [
      { title: 'Hearing — Family Court', date: '2026-03-22', type: 'court' },
      { title: 'Document Submission Deadline', date: '2026-03-15', type: 'deadline' },
    ],
    retainerBalance: 3000, trustBalance: 2800,
    recommendations: [
      { text: 'Update Financial Affidavit yourself (Pro Se) — Save ~$400', tier: 'prose' },
      { text: 'Family Court hearing — Assigned Counsel representation', tier: '18b' },
      { text: 'Asset valuation — Private specialist recommended', tier: 'private' },
    ],
  },
};

const DEMO = CLIENT_DATA['client-martinez'];

type Tab = 'overview' | 'documents' | 'messages' | 'billing' | 'calendar' | 'prep' | 'selfhelp';

const BASE_TABS: { key: Tab; label: string; icon: string }[] = [
  { key: 'overview', label: 'Overview', icon: '🏠' },
  { key: 'documents', label: 'Documents', icon: '📄' },
  { key: 'messages', label: 'Messages', icon: '💬' },
  { key: 'billing', label: 'Billing', icon: '💳' },
  { key: 'calendar', label: 'Calendar', icon: '📅' },
  { key: 'prep', label: 'Trial Prep', icon: '⚖️' },
];
const SELFHELP_TAB = { key: 'selfhelp' as Tab, label: 'Self-Help Tools', icon: '🛠️' };
const TABS = [...BASE_TABS, SELFHELP_TAB];

const TEMPLATES = [
  { name: 'Custody Petition', desc: 'Fill-in-the-blank petition for custody modification', category: 'Family' },
  { name: 'Motion to Adjourn', desc: 'Request to reschedule a court date', category: 'General' },
  { name: 'Financial Disclosure', desc: 'Statement of net worth and income', category: 'Financial' },
  { name: 'Order to Show Cause', desc: 'Emergency motion template', category: 'General' },
  { name: 'Parenting Plan', desc: 'Proposed custody and visitation schedule', category: 'Family' },
];

const COURT_GUIDES = [
  { title: 'How to File a Motion', steps: 5, time: '15 min read' },
  { title: 'What to Expect at Your First Court Date', steps: 8, time: '10 min read' },
  { title: 'How to Respond to Discovery Requests', steps: 6, time: '20 min read' },
  { title: 'Understanding Your Rights at Arraignment', steps: 4, time: '8 min read' },
];

const TIER_INFO = [
  { emoji: '🟢', label: 'Pro Se (Free)', desc: 'Handle it yourself with our AI tools', color: 'bg-green-50 border-green-200 text-green-800' },
  { emoji: '🔵', label: 'Assigned Counsel (State-Funded)', desc: 'Your attorney is appointed by the court', color: 'bg-blue-50 border-blue-200 text-blue-800' },
  { emoji: '🟣', label: 'Private (Paid)', desc: 'Specialized representation for complex matters', color: 'bg-purple-50 border-purple-200 text-purple-800' },
];

const TIER_BADGE: Record<string, { label: string; class: string }> = {
  prose: { label: 'Pro Se (Free)', class: 'bg-green-100 text-green-700' },
  '18b': { label: 'Assigned (State-Funded)', class: 'bg-blue-100 text-blue-700' },
  private: { label: 'Private ($$$)', class: 'bg-purple-100 text-purple-700' },
};

const TIER_ICON: Record<string, string> = { prose: '✅', '18b': '⚖️', private: '💼' };

const STATUS_COLORS: Record<string, string> = {
  'Pending Review': 'bg-yellow-100 text-yellow-800',
  'Reviewed': 'bg-green-100 text-green-800',
  'Action Needed': 'bg-red-100 text-red-800',
};

const CATEGORIES = ['Identity Documents', 'Case Documents', 'Financial Records', 'Other'];

// ---------- Login Overlay ----------
function LoginOverlay({ onLogin }: { onLogin: () => void }) {
  return (
    <div className="fixed inset-0 bg-navy-900/95 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-2xl p-8 w-full max-w-md">
        <div className="text-center mb-8">
          <div className="text-3xl mb-2">⚖️</div>
          <h1 className="text-xl font-bold text-gray-900">Assigned Co-Counsel</h1>
          <p className="text-sm text-gray-500 mt-1">Client Portal — Secure Access</p>
        </div>
        <form onSubmit={e => { e.preventDefault(); onLogin(); }} className="space-y-4">
          <div>
            <label className="block text-xs font-medium text-gray-700 mb-1">Email</label>
            <input type="email" defaultValue="client@example.com" className="w-full px-3 py-2.5 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent" />
          </div>
          <div>
            <label className="block text-xs font-medium text-gray-700 mb-1">Password</label>
            <input type="password" defaultValue="demo123" className="w-full px-3 py-2.5 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent" />
          </div>
          <button type="submit" className="w-full py-2.5 bg-blue-600 text-white rounded-lg text-sm font-semibold hover:bg-blue-700 transition-colors">Sign In</button>
          <button type="button" onClick={onLogin} className="w-full py-2.5 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors flex items-center justify-center gap-2">
            <svg width="18" height="18" viewBox="0 0 24 24"><path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 0 1-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z" fill="#4285F4"/><path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/><path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/><path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/></svg>
            Sign in with Google
          </button>
        </form>
        <p className="text-center text-xs text-gray-400 mt-6">For demo, any credentials work</p>
      </div>
    </div>
  );
}

// ---------- Main Portal ----------
export default function ClientPortal() {
  const params = useParams();
  const id = params?.id as string;
  const data = CLIENT_DATA[id] || DEMO;
  
  const [loggedIn, setLoggedIn] = useState(false);
  const [tab, setTab] = useState<Tab>('overview');
  const [dragOver, setDragOver] = useState(false);
  const [msgInput, setMsgInput] = useState('');
  const [msgChannel, setMsgChannel] = useState('Portal Chat');
  const [localMessages, setLocalMessages] = useState(data.messages);
  const [helpQuery, setHelpQuery] = useState('');
  const [helpMessages, setHelpMessages] = useState<{ from: string; text: string }[]>([]);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const outstandingTotal = data.invoices.filter(i => !i.paid).reduce((s, i) => s + i.amount, 0);
  const tabs = data.proSeEnabled ? [...BASE_TABS, SELFHELP_TAB] : BASE_TABS;

  if (!loggedIn) return <LoginOverlay onLogin={() => setLoggedIn(true)} />;

  const sendMessage = () => {
    if (!msgInput.trim()) return;
    setLocalMessages(prev => [...prev, { from: 'You', text: msgInput, time: new Date().toLocaleString(), channel: msgChannel }]);
    setMsgInput('');
  };

  const calLink = (event: { title: string; date: string }) => {
    const d = event.date.replace(/-/g, '');
    return `https://calendar.google.com/calendar/render?action=TEMPLATE&text=${encodeURIComponent(event.title)}&dates=${d}/${d}`;
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b border-gray-200 sticky top-0 z-30">
        <div className="max-w-6xl mx-auto px-4 h-14 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="text-lg">⚖️</span>
            <span className="font-bold text-gray-900 text-sm">Assigned Co-Counsel</span>
          </div>
          <div className="flex items-center gap-3">
            <span className="text-sm text-gray-600 hidden sm:block">{data.name}</span>
            <button onClick={() => setLoggedIn(false)} className="text-xs text-gray-500 hover:text-red-600 transition-colors">Logout</button>
          </div>
        </div>
        {/* Tabs */}
        <div className="max-w-6xl mx-auto px-4 overflow-x-auto">
          <div className="flex gap-1 min-w-max">
            {tabs.map(t => (
              <button key={t.key} onClick={() => setTab(t.key)}
                className={`px-3 py-2.5 text-xs font-medium border-b-2 transition-colors whitespace-nowrap ${tab === t.key ? 'border-blue-600 text-blue-600' : 'border-transparent text-gray-500 hover:text-gray-700'}`}>
                <span className="mr-1">{t.icon}</span>{t.label}
              </button>
            ))}
          </div>
        </div>
      </header>

      <main className="max-w-6xl mx-auto p-4 sm:p-6">
        {/* ---------- OVERVIEW ---------- */}
        {tab === 'overview' && (
          <div className="space-y-6">
            <h1 className="text-2xl font-bold text-gray-900">Welcome, {data.name.split(' ')[0]} 👋</h1>
            
            {/* Case Summary */}
            <div className="grid sm:grid-cols-3 gap-4">
              <div className="bg-white rounded-xl p-5 border border-gray-200 shadow-sm">
                <p className="text-xs text-gray-500 font-medium mb-1">Case</p>
                <p className="font-semibold text-gray-900">{data.caseName}</p>
              </div>
              <div className="bg-white rounded-xl p-5 border border-gray-200 shadow-sm">
                <p className="text-xs text-gray-500 font-medium mb-1">Status</p>
                <p className="font-semibold text-gray-900">{data.caseStatus}</p>
              </div>
              <div className="bg-white rounded-xl p-5 border border-gray-200 shadow-sm">
                <p className="text-xs text-gray-500 font-medium mb-1">Next Date</p>
                <p className="font-semibold text-gray-900">{new Date(data.nextDate).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}</p>
              </div>
            </div>

            {/* Alerts */}
            {outstandingTotal > 0 && (
              <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 flex items-center justify-between">
                <div>
                  <p className="text-sm font-semibold text-amber-800">Outstanding Balance: ${outstandingTotal.toLocaleString()}</p>
                  <p className="text-xs text-amber-600">You have {data.invoices.filter(i => !i.paid).length} unpaid invoice(s)</p>
                </div>
                <button onClick={() => setTab('billing')} className="px-3 py-1.5 bg-amber-600 text-white text-xs font-semibold rounded-lg hover:bg-amber-700">Pay Now</button>
              </div>
            )}

            {/* Recent Messages */}
            <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-5">
              <div className="flex items-center justify-between mb-3">
                <h2 className="font-semibold text-gray-900 text-sm">Recent Messages</h2>
                <button onClick={() => setTab('messages')} className="text-xs text-blue-600 hover:underline">View All</button>
              </div>
              {data.messages.slice(-2).map((m, i) => (
                <div key={i} className="flex items-start gap-3 py-2 border-t border-gray-100 first:border-0">
                  <div className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold text-white ${m.from === 'You' ? 'bg-blue-500' : 'bg-gray-700'}`}>{m.from[0]}</div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm text-gray-800 truncate">{m.text}</p>
                    <p className="text-[10px] text-gray-400">{m.time}</p>
                  </div>
                </div>
              ))}
            </div>

            {/* Quick Actions */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              {[
                { label: 'Upload Document', icon: '📤', action: () => setTab('documents') },
                { label: 'Send Message', icon: '✉️', action: () => setTab('messages') },
                { label: 'View Calendar', icon: '📅', action: () => setTab('calendar') },
                { label: 'Trial Prep', icon: '⚖️', action: () => setTab('prep') },
              ].map((a, i) => (
                <button key={i} onClick={a.action} className="bg-white border border-gray-200 rounded-xl p-4 text-center hover:border-blue-300 hover:shadow-sm transition-all">
                  <span className="text-2xl block mb-1">{a.icon}</span>
                  <span className="text-xs font-medium text-gray-700">{a.label}</span>
                </button>
              ))}
            </div>
          </div>
        )}

        {/* ---------- DOCUMENTS ---------- */}
        {tab === 'documents' && (
          <div className="space-y-6">
            <h2 className="text-xl font-bold text-gray-900">Documents</h2>
            
            {/* Upload Zone */}
            <div
              onDragOver={e => { e.preventDefault(); setDragOver(true); }}
              onDragLeave={() => setDragOver(false)}
              onDrop={e => { e.preventDefault(); setDragOver(false); }}
              className={`border-2 border-dashed rounded-xl p-8 text-center transition-colors ${dragOver ? 'border-blue-500 bg-blue-50' : 'border-gray-300 bg-white'}`}
            >
              <input type="file" ref={fileInputRef} className="hidden" multiple />
              <p className="text-3xl mb-2">📁</p>
              <p className="text-sm text-gray-600 mb-2">Drag & drop files here</p>
              <button onClick={() => fileInputRef.current?.click()} className="px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-lg hover:bg-blue-700">Browse Files</button>
            </div>

            {/* Intake Status */}
            <div className="bg-white rounded-xl border border-gray-200 p-4">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-semibold text-gray-900">Intake Form Completion</span>
                <span className="text-xs font-bold text-blue-600">75%</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2"><div className="bg-blue-600 h-2 rounded-full" style={{ width: '75%' }} /></div>
            </div>

            {/* Documents by Category */}
            {CATEGORIES.map(cat => {
              const docs = data.documents.filter(d => d.category === cat);
              if (!docs.length) return null;
              return (
                <div key={cat}>
                  <h3 className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">{cat}</h3>
                  <div className="bg-white rounded-xl border border-gray-200 divide-y divide-gray-100">
                    {docs.map((d, i) => (
                      <div key={i} className="flex items-center justify-between p-4">
                        <div>
                          <p className="text-sm font-medium text-gray-900">{d.name}</p>
                          <p className="text-xs text-gray-400">{d.date}</p>
                        </div>
                        <span className={`text-[10px] font-semibold px-2 py-1 rounded-full ${STATUS_COLORS[d.status] || 'bg-gray-100 text-gray-600'}`}>{d.status}</span>
                      </div>
                    ))}
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* ---------- MESSAGES ---------- */}
        {tab === 'messages' && (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-bold text-gray-900">Messages</h2>
              <select value={msgChannel} onChange={e => setMsgChannel(e.target.value)} className="text-xs border border-gray-300 rounded-lg px-2 py-1.5">
                {['Portal Chat', 'SMS', 'Email', 'iMessage', 'WhatsApp'].map(ch => <option key={ch}>{ch}</option>)}
              </select>
            </div>

            <div className="bg-white rounded-xl border border-gray-200 p-4 min-h-[400px] flex flex-col">
              <div className="flex-1 space-y-3 overflow-y-auto mb-4">
                {localMessages.map((m, i) => (
                  <div key={i} className={`flex ${m.from === 'You' ? 'justify-end' : 'justify-start'}`}>
                    <div className={`max-w-[75%] rounded-2xl px-4 py-2.5 ${m.from === 'You' ? 'bg-blue-600 text-white' : 'bg-gray-100 text-gray-800'}`}>
                      <p className="text-sm">{m.text}</p>
                      <p className={`text-[10px] mt-1 ${m.from === 'You' ? 'text-blue-200' : 'text-gray-400'}`}>{m.time} · {m.channel}</p>
                    </div>
                  </div>
                ))}
              </div>
              <div className="border-t border-gray-200 pt-3">
                <p className="text-[10px] text-gray-400 mb-2">Your attorney typically responds within 24 hours</p>
                <div className="flex gap-2">
                  <input value={msgInput} onChange={e => setMsgInput(e.target.value)} onKeyDown={e => e.key === 'Enter' && sendMessage()}
                    placeholder="Type a message..." className="flex-1 px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent" />
                  <button onClick={sendMessage} className="px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-lg hover:bg-blue-700">Send</button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ---------- BILLING ---------- */}
        {tab === 'billing' && (
          <div className="space-y-6">
            <h2 className="text-xl font-bold text-gray-900">Billing & Payments</h2>

            {/* Summary Cards */}
            <div className="grid sm:grid-cols-3 gap-4">
              <div className="bg-white rounded-xl p-5 border border-gray-200 shadow-sm">
                <p className="text-xs text-gray-500 mb-1">Outstanding</p>
                <p className="text-2xl font-bold text-red-600">${outstandingTotal.toLocaleString()}</p>
              </div>
              <div className="bg-white rounded-xl p-5 border border-gray-200 shadow-sm">
                <p className="text-xs text-gray-500 mb-1">Retainer Balance</p>
                <p className="text-2xl font-bold text-gray-900">${data.retainerBalance.toLocaleString()}</p>
              </div>
              <div className="bg-white rounded-xl p-5 border border-gray-200 shadow-sm">
                <p className="text-xs text-gray-500 mb-1">Trust Account</p>
                <p className="text-2xl font-bold text-gray-900">${data.trustBalance.toLocaleString()}</p>
              </div>
            </div>

            {/* Invoices */}
            <div className="bg-white rounded-xl border border-gray-200">
              <div className="p-4 border-b border-gray-100"><h3 className="font-semibold text-sm text-gray-900">Invoices</h3></div>
              {data.invoices.map(inv => (
                <div key={inv.id} className="flex items-center justify-between p-4 border-b border-gray-50 last:border-0">
                  <div>
                    <p className="text-sm font-medium text-gray-900">{inv.desc}</p>
                    <p className="text-xs text-gray-400">{inv.id} · Due {inv.due}</p>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className={`text-sm font-bold ${inv.paid ? 'text-green-600' : 'text-red-600'}`}>${inv.amount.toLocaleString()}</span>
                    {inv.paid ? (
                      <span className="text-[10px] font-semibold bg-green-100 text-green-700 px-2 py-1 rounded-full">Paid</span>
                    ) : (
                      <button className="text-xs font-semibold bg-blue-600 text-white px-3 py-1.5 rounded-lg hover:bg-blue-700">Pay Now</button>
                    )}
                  </div>
                </div>
              ))}
            </div>

            {/* Payment Methods */}
            <div className="bg-white rounded-xl border border-gray-200 p-4">
              <h3 className="font-semibold text-sm text-gray-900 mb-3">Payment Methods</h3>
              <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                <span className="text-lg">💳</span>
                <div className="flex-1">
                  <p className="text-sm font-medium text-gray-800">Visa ending in 4242</p>
                  <p className="text-xs text-gray-400">Expires 12/27</p>
                </div>
                <span className="text-[10px] font-semibold bg-blue-100 text-blue-700 px-2 py-0.5 rounded">Default</span>
              </div>
              <button className="mt-3 text-xs text-blue-600 font-medium hover:underline">+ Add Payment Method</button>
            </div>
          </div>
        )}

        {/* ---------- CALENDAR ---------- */}
        {tab === 'calendar' && (
          <div className="space-y-6">
            <h2 className="text-xl font-bold text-gray-900">Case Calendar</h2>
            
            {/* Timeline */}
            <div className="bg-white rounded-xl border border-gray-200 p-5">
              <div className="space-y-0">
                {data.events.sort((a, b) => a.date.localeCompare(b.date)).map((ev, i) => (
                  <div key={i} className="flex gap-4 pb-6 last:pb-0 relative">
                    {i < data.events.length - 1 && <div className="absolute left-[11px] top-6 w-0.5 h-full bg-gray-200" />}
                    <div className={`w-6 h-6 rounded-full flex-shrink-0 flex items-center justify-center text-white text-[10px] z-10 ${ev.type === 'court' ? 'bg-red-500' : ev.type === 'deadline' ? 'bg-amber-500' : 'bg-blue-500'}`}>
                      {ev.type === 'court' ? '⚖' : ev.type === 'deadline' ? '!' : '📅'}
                    </div>
                    <div className="flex-1">
                      <p className="text-sm font-semibold text-gray-900">{ev.title}</p>
                      <p className="text-xs text-gray-500">{new Date(ev.date).toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric', year: 'numeric' })}</p>
                      <a href={calLink(ev)} target="_blank" rel="noopener noreferrer" className="text-[10px] text-blue-600 hover:underline mt-1 inline-block">
                        + Add to Google Calendar
                      </a>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* ---------- SELF-HELP TOOLS ---------- */}
        {tab === 'selfhelp' && data.proSeEnabled && (
          <div className="space-y-6">
            {/* Cost Optimizer Banner */}
            <div className="bg-gradient-to-r from-green-50 to-emerald-50 border border-green-200 rounded-xl p-5">
              <div className="flex items-start gap-3">
                <span className="text-2xl">💡</span>
                <div>
                  <h2 className="font-bold text-green-900">Save on Legal Costs</h2>
                  <p className="text-sm text-green-700 mt-1">Your attorney has identified some tasks you may be able to handle yourself to save costs. These tools are free to use.</p>
                </div>
              </div>
            </div>

            {/* Attorney Recommendations */}
            {data.recommendations?.length > 0 && (
              <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-5">
                <h3 className="font-bold text-gray-900 mb-4 flex items-center gap-2">💡 Your Attorney Recommends</h3>
                <div className="space-y-3">
                  {data.recommendations.map((rec, i) => (
                    <div key={i} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                      <div className="flex items-center gap-3">
                        <span className="text-lg">{TIER_ICON[rec.tier]}</span>
                        <p className="text-sm text-gray-800">{rec.text}</p>
                      </div>
                      <span className={`text-[10px] font-semibold px-2.5 py-1 rounded-full whitespace-nowrap ${TIER_BADGE[rec.tier].class}`}>{TIER_BADGE[rec.tier].label}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* AI Legal Helper */}
            <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-5">
              <h3 className="font-bold text-gray-900 mb-1">🤖 AI Legal Helper</h3>
              <p className="text-xs text-gray-500 mb-4">Ask questions in plain English — no legal jargon needed</p>
              <div className="bg-gray-50 rounded-xl p-4 min-h-[200px] flex flex-col">
                <div className="flex-1 space-y-3 mb-4">
                  {helpMessages.length === 0 && (
                    <div className="text-center py-8">
                      <p className="text-3xl mb-2">👋</p>
                      <p className="text-sm text-gray-500">Hi! I can help answer basic legal questions.</p>
                      <p className="text-xs text-gray-400 mt-1">Try: &quot;What documents do I need for custody?&quot;</p>
                    </div>
                  )}
                  {helpMessages.map((m, i) => (
                    <div key={i} className={`flex ${m.from === 'You' ? 'justify-end' : 'justify-start'}`}>
                      <div className={`max-w-[80%] rounded-2xl px-4 py-2.5 text-sm ${m.from === 'You' ? 'bg-green-600 text-white' : 'bg-white border border-gray-200 text-gray-800'}`}>
                        {m.text}
                      </div>
                    </div>
                  ))}
                </div>
                <div className="flex gap-2">
                  <input value={helpQuery} onChange={e => setHelpQuery(e.target.value)}
                    onKeyDown={e => {
                      if (e.key === 'Enter' && helpQuery.trim()) {
                        setHelpMessages(prev => [...prev, { from: 'You', text: helpQuery }, { from: 'AI', text: 'That\'s a great question! Based on your case type, I\'d recommend starting by gathering all relevant documents. Your attorney can provide specific guidance during your next meeting. Would you like me to explain anything else?' }]);
                        setHelpQuery('');
                      }
                    }}
                    placeholder="Ask a question..." className="flex-1 px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-green-500 focus:border-transparent" />
                  <button onClick={() => {
                    if (!helpQuery.trim()) return;
                    setHelpMessages(prev => [...prev, { from: 'You', text: helpQuery }, { from: 'AI', text: 'That\'s a great question! Based on your case type, I\'d recommend starting by gathering all relevant documents. Your attorney can provide specific guidance during your next meeting. Would you like me to explain anything else?' }]);
                    setHelpQuery('');
                  }} className="px-4 py-2 bg-green-600 text-white text-sm font-medium rounded-lg hover:bg-green-700">Ask</button>
                </div>
              </div>
              <p className="text-[10px] text-gray-400 mt-2">⚠️ This is general information, not legal advice. Always confirm with your attorney.</p>
            </div>

            {/* Document Templates */}
            <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-5">
              <h3 className="font-bold text-gray-900 mb-1">📝 Document Templates</h3>
              <p className="text-xs text-gray-500 mb-4">Fill-in-the-blank forms you can complete yourself</p>
              <div className="grid sm:grid-cols-2 gap-3">
                {TEMPLATES.map((t, i) => (
                  <div key={i} className="border border-gray-200 rounded-lg p-4 hover:border-green-300 hover:shadow-sm transition-all cursor-pointer">
                    <div className="flex items-start justify-between">
                      <div>
                        <p className="text-sm font-semibold text-gray-900">{t.name}</p>
                        <p className="text-xs text-gray-500 mt-0.5">{t.desc}</p>
                      </div>
                      <span className="text-[9px] font-semibold bg-gray-100 text-gray-500 px-2 py-0.5 rounded">{t.category}</span>
                    </div>
                    <button className="mt-3 text-xs font-semibold text-green-600 hover:underline">Open Template →</button>
                  </div>
                ))}
              </div>
            </div>

            {/* Court Guides */}
            <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-5">
              <h3 className="font-bold text-gray-900 mb-1">📚 Court Guides</h3>
              <p className="text-xs text-gray-500 mb-4">Step-by-step instructions for common filings</p>
              <div className="space-y-2">
                {COURT_GUIDES.map((g, i) => (
                  <div key={i} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors cursor-pointer">
                    <div>
                      <p className="text-sm font-medium text-gray-900">{g.title}</p>
                      <p className="text-xs text-gray-400">{g.steps} steps · {g.time}</p>
                    </div>
                    <span className="text-gray-400">→</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Service Tier Explainer */}
            <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-5">
              <h3 className="font-bold text-gray-900 mb-4">Understanding Your Options</h3>
              <div className="grid sm:grid-cols-3 gap-3">
                {TIER_INFO.map((t, i) => (
                  <div key={i} className={`border rounded-xl p-4 text-center ${t.color}`}>
                    <span className="text-2xl block mb-2">{t.emoji}</span>
                    <p className="text-sm font-bold">{t.label}</p>
                    <p className="text-xs mt-1 opacity-80">{t.desc}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* ---------- TRIAL PREP ---------- */}
        {tab === 'prep' && (
          <div className="space-y-6">
            <h2 className="text-xl font-bold text-gray-900">Trial Preparation</h2>
            <div className="bg-white rounded-xl border border-gray-200 p-6 text-center">
              <span className="text-5xl block mb-4">⚖️</span>
              <h3 className="text-lg font-bold text-gray-900 mb-2">Trial Prep Chatbot</h3>
              <p className="text-sm text-gray-500 mb-1">Status: <span className={`font-semibold ${data.prepStatus === 'Completed' ? 'text-green-600' : data.prepStatus === 'In Progress' ? 'text-blue-600' : 'text-gray-500'}`}>{data.prepStatus}</span></p>
              <p className="text-xs text-gray-400 mb-6">Practice answering questions your attorney may ask in preparation for trial.</p>
              <Link href={`/prep/${data.prepId}`} className="inline-block px-6 py-3 bg-blue-600 text-white font-semibold rounded-xl hover:bg-blue-700 transition-colors">
                {data.prepStatus === 'Not Started' ? 'Start Preparation' : data.prepStatus === 'Completed' ? 'Review Preparation' : 'Continue Preparation'}
              </Link>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
