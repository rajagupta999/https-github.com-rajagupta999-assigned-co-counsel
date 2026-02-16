"use client";

import { useState, useEffect, useCallback, useRef } from 'react';
import { useAppContext } from '@/context/AppContext';
import { useAuth } from '@/context/AuthContext';
import { usePracticeMode } from '@/context/PracticeModeContext';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

// ══════════════════════════════════════════════════════════════════
// SHARED: SPLIT VIEW SHELL (1/3 Feed | 2/3 Main)
// ══════════════════════════════════════════════════════════════════
function SplitView({ feed, main }: { feed: React.ReactNode; main: React.ReactNode }) {
  return (
    <div className="flex flex-col lg:flex-row gap-4 h-full">
      {/* Left Feed — 1/3 */}
      <aside className="w-full lg:w-1/3 space-y-3 lg:max-h-[calc(100vh-7rem)] lg:overflow-y-auto lg:pr-1 scrollbar-thin">
        {feed}
      </aside>
      {/* Right Main — 2/3 */}
      <main className="w-full lg:w-2/3 space-y-4 lg:max-h-[calc(100vh-7rem)] lg:overflow-y-auto lg:pr-1 scrollbar-thin">
        {main}
      </main>
    </div>
  );
}

// Shared feed card wrapper
function FeedCard({ title, icon, children, accent = 'slate', href }: { title: string; icon: string; children: React.ReactNode; accent?: string; href?: string }) {
  const accentMap: Record<string, string> = {
    slate: 'border-slate-200',
    blue: 'border-blue-200',
    emerald: 'border-emerald-200',
    red: 'border-red-200',
    amber: 'border-amber-200',
    purple: 'border-purple-200',
  };
  return (
    <div className={`bg-white border ${accentMap[accent] || accentMap.slate} rounded-xl shadow-sm`}>
      <div className="px-3 py-2.5 border-b border-slate-100 flex items-center justify-between">
        <h3 className="text-xs font-bold text-slate-700 flex items-center gap-1.5">
          <span>{icon}</span>{title}
        </h3>
        {href && <Link href={href} className="text-[10px] font-semibold text-blue-600 hover:text-blue-800">View →</Link>}
      </div>
      <div>{children}</div>
    </div>
  );
}

function FeedItem({ icon, text, sub, urgent }: { icon?: string; text: string; sub: string; urgent?: boolean }) {
  return (
    <div className="px-3 py-2.5 flex items-start gap-2.5 hover:bg-slate-50 transition-colors border-b border-slate-50 last:border-0">
      {urgent && <span className="mt-1 w-2 h-2 rounded-full bg-red-500 shrink-0 animate-pulse" />}
      {icon && !urgent && <span className="text-sm shrink-0">{icon}</span>}
      <div className="min-w-0">
        <p className="text-xs text-slate-700 leading-snug">{text}</p>
        <p className="text-[10px] text-slate-400 mt-0.5">{sub}</p>
      </div>
    </div>
  );
}

// ══════════════════════════════════════════════════════════════════
// PRO SE DASHBOARD (unchanged concept — not split view)
// ══════════════════════════════════════════════════════════════════
function ProSeDashboard() {
  const { cases } = useAppContext();
  const openCases = cases.filter(c => c.status === 'Open');
  const activeCaseName = openCases.length > 0 ? `${openCases[0].client} — ${openCases[0].charges}` : 'No active case';

  const steps = ['Filing', 'Served', 'Response', 'Discovery', 'Trial', 'Resolution'];
  const currentStep = 2;

  const [checklist, setChecklist] = useState([
    { id: 1, text: 'File your response by March 1st', done: false },
    { id: 2, text: 'Gather your evidence (photos, texts, emails)', done: false },
    { id: 3, text: 'Write down your side of the story', done: true },
    { id: 4, text: 'Prepare for your hearing on March 15th', done: false },
    { id: 5, text: 'Make copies of all documents (3 sets)', done: false },
  ]);

  const tips = [
    "💡 Tip: Always keep copies of everything you file with the court.",
    "💡 Tip: Arrive at court 30 minutes early and dress professionally.",
    "💡 Tip: You can ask the court clerk questions — they're there to help!",
    "💡 Tip: Write down what you want to say before your hearing.",
    "💡 Tip: If you don't understand something, it's okay to ask the judge to explain.",
  ];
  const tipOfDay = tips[new Date().getDate() % tips.length];

  const toggleCheck = (id: number) => {
    setChecklist(prev => prev.map(item => item.id === id ? { ...item, done: !item.done } : item));
  };

  return (
    <div className="p-4 sm:p-6 lg:p-8 max-w-4xl mx-auto space-y-6 animate-fade-in pb-10">
      <div>
        <h1 className="text-2xl font-bold text-amber-900">Welcome Back 👋</h1>
        <p className="text-sm text-amber-700 mt-1">Here&apos;s where things stand with your case. You&apos;re doing great!</p>
      </div>

      <div className="bg-gradient-to-br from-amber-50 to-orange-50 border-2 border-amber-200 rounded-2xl p-6 shadow-sm">
        <p className="text-xs font-semibold text-amber-600 uppercase tracking-wide mb-1">Your Active Case</p>
        <h2 className="text-lg font-bold text-amber-950 mb-6">{activeCaseName}</h2>
        <div className="flex items-center justify-between relative">
          <div className="absolute top-4 left-0 right-0 h-1 bg-amber-200 rounded-full" />
          <div className="absolute top-4 left-0 h-1 bg-amber-500 rounded-full transition-all duration-500" style={{ width: `${(currentStep / (steps.length - 1)) * 100}%` }} />
          {steps.map((step, i) => (
            <div key={step} className="relative flex flex-col items-center z-10">
              <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold border-2 transition-all ${
                i < currentStep ? 'bg-amber-500 border-amber-500 text-white' :
                i === currentStep ? 'bg-white border-amber-500 text-amber-700 ring-4 ring-amber-100' :
                'bg-white border-amber-200 text-amber-300'
              }`}>
                {i < currentStep ? '✓' : i + 1}
              </div>
              <span className={`text-[10px] mt-2 font-medium ${i <= currentStep ? 'text-amber-800' : 'text-amber-300'}`}>{step}</span>
            </div>
          ))}
        </div>
      </div>

      <div className="bg-white border border-amber-200 rounded-2xl p-5 shadow-sm">
        <h3 className="text-base font-bold text-amber-900 mb-4">📋 What to Do Next</h3>
        <div className="space-y-3">
          {checklist.map(item => (
            <label key={item.id} className="flex items-start gap-3 cursor-pointer group p-2 rounded-lg hover:bg-amber-50 transition-colors">
              <input type="checkbox" checked={item.done} onChange={() => toggleCheck(item.id)} className="mt-0.5 h-5 w-5 rounded-md border-amber-300 text-amber-600 focus:ring-amber-500/30" />
              <span className={`text-sm ${item.done ? 'text-amber-400 line-through' : 'text-amber-900 group-hover:text-amber-700'}`}>{item.text}</span>
            </label>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        <Link href="/dashboard/copilot" className="flex items-center gap-3 bg-amber-600 hover:bg-amber-700 text-white rounded-xl p-4 transition-colors shadow-sm">
          <span className="text-2xl">💬</span>
          <div><p className="font-bold text-sm">Talk to Legal Helper</p><p className="text-xs text-amber-100">Get answers in plain English</p></div>
        </Link>
        <Link href="/dashboard/research" className="flex items-center gap-3 bg-orange-100 hover:bg-orange-200 text-orange-900 rounded-xl p-4 transition-colors shadow-sm border border-orange-200">
          <span className="text-2xl">📝</span>
          <div><p className="font-bold text-sm">Find a Form</p><p className="text-xs text-orange-600">Court forms & templates</p></div>
        </Link>
        <Link href="/dashboard/court-schedules" className="flex items-center gap-3 bg-orange-100 hover:bg-orange-200 text-orange-900 rounded-xl p-4 transition-colors shadow-sm border border-orange-200">
          <span className="text-2xl">📅</span>
          <div><p className="font-bold text-sm">Check Court Dates</p><p className="text-xs text-orange-600">See upcoming hearings</p></div>
        </Link>
      </div>

      <div className="bg-amber-50 border border-amber-200 rounded-xl p-4">
        <p className="text-sm text-amber-800">{tipOfDay}</p>
      </div>
    </div>
  );
}

// ══════════════════════════════════════════════════════════════════
// ASSIGNED COUNSEL — SPLIT VIEW
// Feed: Voucher status, Court Part updates, Panel Admin alerts
// Main: Active Cases, Quick Actions (New Voucher), Daily Calendar
// ══════════════════════════════════════════════════════════════════
function AssignedCounselDashboard() {
  const { cases } = useAppContext();
  const { user } = useAuth();
  const openCases = cases.filter(c => c.status === 'Open');
  const firstName = user?.name.split(' ')[0] || 'Counselor';

  // --- FEED DATA ---
  const voucherUpdates = [
    { text: 'Voucher #V-2024-0341 approved — $1,850', sub: 'People v. Chen · Paid to direct deposit', icon: '✅' },
    { text: 'Voucher #V-2024-0355 pending review', sub: 'People v. Martinez · Submitted Feb 12', icon: '⏳' },
    { text: 'Voucher #V-2024-0360 needs correction', sub: 'Matter of Davis · Missing time entries for 2/8', icon: '⚠️', urgent: true },
    { text: 'Approaching fee cap — People v. Thompson', sub: '85% of misdemeanor cap ($4,400/$5,200)', icon: '📊', urgent: true },
  ];

  const courtPartUpdates = [
    { text: 'Part 32 — Calendar delayed 30 min', sub: 'Judge Williams running late · Updated 8:45 AM', icon: '🔔', urgent: true },
    { text: 'Part 15 — Conference rescheduled to 2:30 PM', sub: 'People v. Chen · Was 2:00 PM', icon: '📋' },
    { text: 'Part F — Now accepting walk-in conferences', sub: 'Family Court, Queens · Today only', icon: '🏛️' },
    { text: 'Part 71 — Trial ready, jury selection Feb 27', sub: 'People v. Thompson · No adjournments', icon: '⚖️' },
  ];

  const panelAlerts = [
    { text: 'CLE Requirement: 2 credits remaining', sub: 'Due Mar 15 · Ethics category', icon: '📚' },
    { text: 'Panel meeting: Feb 25, 6:00 PM', sub: 'Queens Bar Association · Mandatory attendance', icon: '📌', urgent: true },
    { text: 'New rate increase effective March 1', sub: 'In-court: $158/hr → $164/hr · Out-of-court: $114/hr → $119/hr', icon: '💵' },
    { text: 'Annual recertification due April 1', sub: 'Submit updated insurance + good standing cert', icon: '📄' },
  ];

  // --- MAIN DATA ---
  const activeCases = [
    { client: 'Martinez, Carlos', charges: 'Assault 2nd (Felony)', court: 'Supreme Court, Queens', next: 'Feb 18 · 9:30 AM', status: 'Motion pending', urgent: true },
    { client: 'Chen, Wei', charges: 'DWI', court: 'Criminal Court, Queens', next: 'Feb 20 · 2:00 PM', status: 'Plea negotiations', urgent: false },
    { client: 'Davis, Tamika', charges: 'Custody/Visitation', court: 'Family Court, Queens', next: 'Feb 24 · 10:00 AM', status: 'Hearing scheduled', urgent: false },
    { client: 'Thompson, James', charges: 'Burglary 3rd (Felony)', court: 'Supreme Court, Brooklyn', next: 'Feb 27 · 9:00 AM', status: 'Trial ready', urgent: true },
    { client: 'Jackson, Aisha', charges: 'Petit Larceny', court: 'Criminal Court, Bronx', next: 'Mar 3 · 11:00 AM', status: 'Plea offer extended', urgent: false },
  ];

  const todayCalendar = [
    { time: '9:00 AM', event: 'Client call — Thompson (trial prep)', type: 'call' },
    { time: '9:30 AM', event: 'People v. Martinez — Part 32 (Hearing)', type: 'court' },
    { time: '11:00 AM', event: 'Draft motion to suppress — Martinez', type: 'task' },
    { time: '1:00 PM', event: 'Lunch / Travel to Brooklyn', type: 'break' },
    { time: '2:30 PM', event: 'People v. Chen — Part 15 (Conference)', type: 'court' },
    { time: '4:00 PM', event: 'Voucher prep — Chen, Davis', type: 'admin' },
  ];

  const newAssignments = [
    { id: 'ASG-2024-0891', client: 'Rodriguez, Maria', charges: 'Petit Larceny', court: 'Criminal Court, Queens' },
    { id: 'ASG-2024-0894', client: 'Williams, Deshawn', charges: 'Assault 3rd', court: 'Criminal Court, Brooklyn' },
  ];

  const feed = (
    <>
      {/* Voucher Status */}
      <FeedCard title="Voucher Status" icon="💵" accent="emerald" href="/dashboard/vouchers">
        {voucherUpdates.map((v, i) => <FeedItem key={i} {...v} />)}
      </FeedCard>

      {/* Court Part Updates */}
      <FeedCard title="Court Part Updates" icon="🏛️" accent="blue" href="/dashboard/court-schedules">
        {courtPartUpdates.map((c, i) => <FeedItem key={i} {...c} />)}
      </FeedCard>

      {/* Panel Admin Alerts */}
      <FeedCard title="Panel Admin Alerts" icon="📋" accent="amber">
        {panelAlerts.map((a, i) => <FeedItem key={i} {...a} />)}
      </FeedCard>
    </>
  );

  const mainContent = (
    <>
      {/* Header + Quick Actions */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-bold text-slate-900">Practice Dashboard</h1>
          <p className="text-xs text-slate-500">{firstName} · {new Date().toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' })}</p>
        </div>
        <div className="flex gap-2">
          <Link href="/dashboard/vouchers" className="flex items-center gap-1.5 bg-emerald-600 hover:bg-emerald-700 text-white px-3 py-2 rounded-lg text-xs font-semibold transition-colors">
            💵 New Voucher
          </Link>
          <Link href="/dashboard/cases/new" className="flex items-center gap-1.5 bg-blue-700 hover:bg-blue-800 text-white px-3 py-2 rounded-lg text-xs font-semibold transition-colors">
            + Assignment
          </Link>
        </div>
      </div>

      {/* New Assignments Banner */}
      {newAssignments.length > 0 && (
        <div className="bg-amber-50 border border-amber-200 rounded-xl p-3">
          <p className="text-xs font-bold text-amber-800 mb-2">📥 {newAssignments.length} New Assignments Awaiting Acceptance</p>
          {newAssignments.map(a => (
            <div key={a.id} className="flex items-center justify-between py-2 border-t border-amber-100 first:border-0">
              <div>
                <p className="text-xs font-semibold text-slate-800">{a.client} — {a.charges}</p>
                <p className="text-[10px] text-slate-500">{a.court} · <span className="font-mono">{a.id}</span></p>
              </div>
              <div className="flex gap-1.5">
                <button className="px-2.5 py-1 bg-blue-600 hover:bg-blue-700 text-white text-[10px] font-semibold rounded-md transition-colors">Accept</button>
                <button className="px-2.5 py-1 bg-slate-100 hover:bg-slate-200 text-slate-600 text-[10px] font-semibold rounded-md transition-colors">Decline</button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Active Cases */}
      <div className="bg-white border border-slate-200 rounded-xl shadow-sm">
        <div className="px-4 py-3 border-b border-slate-100 flex items-center justify-between">
          <h3 className="text-sm font-bold text-slate-800">📂 Active Cases ({activeCases.length})</h3>
          <Link href="/dashboard/cases" className="text-[10px] font-semibold text-blue-600 hover:text-blue-800">All Cases →</Link>
        </div>
        <div className="divide-y divide-slate-50">
          {activeCases.map((c, i) => (
            <div key={i} className="px-4 py-3 flex items-center gap-3 hover:bg-slate-50 transition-colors">
              {c.urgent && <span className="w-2 h-2 rounded-full bg-red-500 shrink-0 animate-pulse" />}
              {!c.urgent && <span className="w-2 h-2 rounded-full bg-slate-300 shrink-0" />}
              <div className="flex-1 min-w-0">
                <p className="text-sm font-semibold text-slate-800 truncate">{c.client}</p>
                <p className="text-[10px] text-slate-500">{c.charges} · {c.court}</p>
              </div>
              <div className="text-right shrink-0">
                <p className="text-[10px] font-bold text-blue-700">{c.next}</p>
                <p className="text-[10px] text-slate-400">{c.status}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Daily Calendar */}
      <div className="bg-white border border-slate-200 rounded-xl shadow-sm">
        <div className="px-4 py-3 border-b border-slate-100 flex items-center justify-between">
          <h3 className="text-sm font-bold text-slate-800">📅 Today&apos;s Schedule</h3>
          <Link href="/dashboard/court-schedules" className="text-[10px] font-semibold text-blue-600 hover:text-blue-800">Full Calendar →</Link>
        </div>
        <div className="divide-y divide-slate-50">
          {todayCalendar.map((e, i) => (
            <div key={i} className="px-4 py-2.5 flex items-center gap-3 hover:bg-slate-50 transition-colors">
              <span className="text-[10px] font-mono font-bold text-slate-400 w-16 shrink-0">{e.time}</span>
              <span className={`w-1.5 h-1.5 rounded-full shrink-0 ${
                e.type === 'court' ? 'bg-red-500' : e.type === 'call' ? 'bg-blue-500' : e.type === 'task' ? 'bg-amber-500' : e.type === 'admin' ? 'bg-emerald-500' : 'bg-slate-300'
              }`} />
              <p className="text-xs text-slate-700">{e.event}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Quick Action Grid */}
      <div className="grid grid-cols-4 gap-2">
        <Link href="/dashboard/copilot" className="flex flex-col items-center gap-1 p-3 bg-blue-50 hover:bg-blue-100 text-blue-800 rounded-lg text-[10px] font-medium transition-colors text-center">
          <span className="text-lg">🤖</span>Co-Pilot
        </Link>
        <Link href="/dashboard/vouchers" className="flex flex-col items-center gap-1 p-3 bg-emerald-50 hover:bg-emerald-100 text-emerald-800 rounded-lg text-[10px] font-medium transition-colors text-center">
          <span className="text-lg">💵</span>Vouchers
        </Link>
        <Link href="/dashboard/research" className="flex flex-col items-center gap-1 p-3 bg-slate-50 hover:bg-slate-100 text-slate-700 rounded-lg text-[10px] font-medium transition-colors text-center">
          <span className="text-lg">🔍</span>Research
        </Link>
        <Link href="/dashboard/agent" className="flex flex-col items-center gap-1 p-3 bg-amber-50 hover:bg-amber-100 text-amber-800 rounded-lg text-[10px] font-medium transition-colors text-center">
          <span className="text-lg">⚖️</span>Ask Lex
        </Link>
      </div>
    </>
  );

  return (
    <div className="p-3 sm:p-4 lg:p-5 max-w-[1600px] mx-auto animate-fade-in pb-8">
      <SplitView feed={feed} main={mainContent} />
    </div>
  );
}

// ══════════════════════════════════════════════════════════════════
// PRIVATE PRACTICE — SPLIT VIEW
// Feed: New Leads (Intake), Client Messages, Trust Account alerts
// Main: Matter List, Billable Hours Tracker, Consultations
// ══════════════════════════════════════════════════════════════════
function PrivatePracticeDashboard() {
  const { user } = useAuth();
  const firstName = user?.name.split(' ')[0] || 'Counselor';

  // --- FEED DATA ---
  const newLeads = [
    { text: 'Jennifer Adams — Estate Planning inquiry', sub: 'Web form · 2 hours ago · $5K+ potential', icon: '🟢' },
    { text: 'Robert Kim — Contested divorce', sub: 'Referral from Lisa Chen · Yesterday', icon: '🟡' },
    { text: 'Maria Santos — Personal injury consultation', sub: 'Phone inquiry · Feb 13 · Awaiting callback', icon: '🟡' },
    { text: 'Tom Bradley — Business formation', sub: 'Web form · Feb 12 · Auto-responded', icon: '⚪' },
    { text: 'Angela Wright — Custody modification', sub: 'Walk-in · Feb 11 · Needs conflict check', icon: '🟡' },
  ];

  const clientMessages = [
    { text: 'Sarah Mitchell: "Signed the retainer, attached here"', sub: '2 hours ago · Has attachment', icon: '📎', urgent: true },
    { text: 'David Park: "Can we move consult to Thursday?"', sub: '4 hours ago · Needs reply', icon: '💬', urgent: true },
    { text: 'Lisa Chen: "Thank you for the invoice breakdown"', sub: 'Yesterday · No action needed', icon: '✅' },
    { text: 'Michael Torres: "Uploaded discovery docs to portal"', sub: 'Yesterday · 12 files added', icon: '📁' },
  ];

  const trustAlerts = [
    { text: 'Trust deposit received: $5,000 — Mitchell retainer', sub: 'IOLA Account · Cleared today', icon: '✅' },
    { text: 'Low balance warning: Torres matter', sub: 'Balance: $340 · Estimated need: $2,000+', icon: '⚠️', urgent: true },
    { text: 'Trust disbursement: $1,200 — Chen filing fees', sub: 'Processed Feb 13 · Receipt attached', icon: '📤' },
    { text: 'Monthly reconciliation due Feb 28', sub: '3 accounts · Last reconciled Jan 31', icon: '📊' },
  ];

  // --- MAIN DATA ---
  const matters = [
    { client: 'Sarah Mitchell', matter: 'Mitchell v. Mitchell — Divorce', area: 'Family', status: 'Retainer signed', billable: '$0', next: 'Initial consult Feb 19' },
    { client: 'David Park', matter: 'Park Estate Plan', area: 'Estate', status: 'Drafting', billable: '$2,800', next: 'Review meeting Feb 21' },
    { client: 'Lisa Chen', matter: 'Chen v. Apex Corp — Employment', area: 'Civil Lit', status: 'Discovery', billable: '$8,450', next: 'Deposition Mar 5' },
    { client: 'Michael Torres', matter: 'Torres — Mediation', area: 'Family', status: 'In mediation', billable: '$4,200', next: 'Session Feb 21' },
    { client: 'Jennifer Adams', matter: 'Adams Revocable Trust', area: 'Estate', status: 'Active', billable: '$1,650', next: 'Signing Feb 26' },
  ];

  const billableToday = { hours: 3.5, target: 6.5 };
  const billableWeek = { hours: 22.5, target: 32.5 };
  const billableMonth = { hours: 87, target: 140, revenue: '$18,450' };

  const consultations = [
    { time: '10:00 AM', client: 'Robert Kim', type: 'Initial — Divorce', location: 'Office', status: 'Confirmed' },
    { time: '2:00 PM', client: 'Maria Santos', type: 'Initial — Personal Injury', location: 'Video Call', status: 'Pending' },
    { time: 'Feb 19 · 11 AM', client: 'Sarah Mitchell', type: 'Follow-up — Retainer review', location: 'Office', status: 'Confirmed' },
    { time: 'Feb 21 · 3 PM', client: 'Angela Wright', type: 'Initial — Custody', location: 'Office', status: 'Tentative' },
  ];

  const feed = (
    <>
      <FeedCard title="New Leads" icon="📩" accent="purple" href="/dashboard/client-intake">
        {newLeads.map((l, i) => <FeedItem key={i} {...l} />)}
      </FeedCard>

      <FeedCard title="Client Messages" icon="💬" accent="blue" href="/dashboard/messages">
        {clientMessages.map((m, i) => <FeedItem key={i} {...m} />)}
      </FeedCard>

      <FeedCard title="Trust Account" icon="🏦" accent="emerald">
        {trustAlerts.map((t, i) => <FeedItem key={i} {...t} />)}
      </FeedCard>
    </>
  );

  const pctToday = Math.min(100, (billableToday.hours / billableToday.target) * 100);
  const pctWeek = Math.min(100, (billableWeek.hours / billableWeek.target) * 100);

  const mainContent = (
    <>
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-bold text-slate-900">Firm Dashboard</h1>
          <p className="text-xs text-slate-500">{firstName} · {new Date().toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' })}</p>
        </div>
        <div className="flex gap-2">
          <Link href="/dashboard/client-intake" className="flex items-center gap-1.5 bg-purple-700 hover:bg-purple-800 text-white px-3 py-2 rounded-lg text-xs font-semibold transition-colors">
            + New Client
          </Link>
        </div>
      </div>

      {/* Billable Hours Tracker */}
      <div className="bg-white border border-slate-200 rounded-xl shadow-sm p-4">
        <h3 className="text-sm font-bold text-slate-800 mb-3">⏱️ Billable Hours</h3>
        <div className="grid grid-cols-3 gap-4">
          <div>
            <div className="flex justify-between text-[10px] text-slate-500 mb-1">
              <span>Today</span>
              <span className="font-bold">{billableToday.hours}h / {billableToday.target}h</span>
            </div>
            <div className="w-full bg-slate-100 rounded-full h-3">
              <div className={`h-3 rounded-full transition-all duration-500 ${pctToday >= 80 ? 'bg-emerald-500' : pctToday >= 50 ? 'bg-amber-500' : 'bg-red-400'}`} style={{ width: `${pctToday}%` }} />
            </div>
          </div>
          <div>
            <div className="flex justify-between text-[10px] text-slate-500 mb-1">
              <span>This Week</span>
              <span className="font-bold">{billableWeek.hours}h / {billableWeek.target}h</span>
            </div>
            <div className="w-full bg-slate-100 rounded-full h-3">
              <div className={`h-3 rounded-full transition-all duration-500 ${pctWeek >= 80 ? 'bg-emerald-500' : pctWeek >= 50 ? 'bg-amber-500' : 'bg-red-400'}`} style={{ width: `${pctWeek}%` }} />
            </div>
          </div>
          <div className="text-center">
            <p className="text-xl font-bold text-emerald-700">{billableMonth.revenue}</p>
            <p className="text-[10px] text-slate-500">{billableMonth.hours}h / {billableMonth.target}h MTD</p>
          </div>
        </div>
      </div>

      {/* Matter List */}
      <div className="bg-white border border-slate-200 rounded-xl shadow-sm">
        <div className="px-4 py-3 border-b border-slate-100 flex items-center justify-between">
          <h3 className="text-sm font-bold text-slate-800">📂 Active Matters ({matters.length})</h3>
          <Link href="/dashboard/cases" className="text-[10px] font-semibold text-purple-600 hover:text-purple-800">All Matters →</Link>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-xs">
            <thead>
              <tr className="text-left text-[10px] text-slate-400 uppercase tracking-wider border-b border-slate-100">
                <th className="px-4 py-2">Client / Matter</th>
                <th className="px-3 py-2">Area</th>
                <th className="px-3 py-2">Billed</th>
                <th className="px-3 py-2">Next Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {matters.map((m, i) => (
                <tr key={i} className="hover:bg-slate-50 transition-colors">
                  <td className="px-4 py-3">
                    <p className="font-semibold text-slate-800">{m.client}</p>
                    <p className="text-[10px] text-slate-400">{m.matter}</p>
                  </td>
                  <td className="px-3 py-3">
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-purple-100 text-purple-700">{m.area}</span>
                  </td>
                  <td className="px-3 py-3 font-semibold text-slate-700">{m.billable}</td>
                  <td className="px-3 py-3 text-[10px] text-slate-500">{m.next}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Consultations */}
      <div className="bg-white border border-slate-200 rounded-xl shadow-sm">
        <div className="px-4 py-3 border-b border-slate-100">
          <h3 className="text-sm font-bold text-slate-800">🗓️ Upcoming Consultations</h3>
        </div>
        <div className="divide-y divide-slate-50">
          {consultations.map((c, i) => (
            <div key={i} className="px-4 py-3 flex items-center gap-3 hover:bg-slate-50 transition-colors">
              <span className="text-[10px] font-mono font-bold text-slate-400 w-20 shrink-0">{c.time}</span>
              <div className="flex-1 min-w-0">
                <p className="text-xs font-semibold text-slate-800">{c.client}</p>
                <p className="text-[10px] text-slate-500">{c.type} · {c.location}</p>
              </div>
              <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full shrink-0 ${
                c.status === 'Confirmed' ? 'bg-emerald-100 text-emerald-700' :
                c.status === 'Pending' ? 'bg-amber-100 text-amber-700' :
                'bg-slate-100 text-slate-500'
              }`}>{c.status}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-4 gap-2">
        <Link href="/dashboard/copilot" className="flex flex-col items-center gap-1 p-3 bg-purple-50 hover:bg-purple-100 text-purple-800 rounded-lg text-[10px] font-medium transition-colors text-center">
          <span className="text-lg">🤖</span>Practice AI
        </Link>
        <Link href="/dashboard/billing" className="flex flex-col items-center gap-1 p-3 bg-emerald-50 hover:bg-emerald-100 text-emerald-800 rounded-lg text-[10px] font-medium transition-colors text-center">
          <span className="text-lg">💰</span>Billing
        </Link>
        <Link href="/dashboard/research" className="flex flex-col items-center gap-1 p-3 bg-slate-50 hover:bg-slate-100 text-slate-700 rounded-lg text-[10px] font-medium transition-colors text-center">
          <span className="text-lg">🔍</span>Research
        </Link>
        <Link href="/dashboard/premium-ai" className="flex flex-col items-center gap-1 p-3 bg-amber-50 hover:bg-amber-100 text-amber-800 rounded-lg text-[10px] font-medium transition-colors text-center">
          <span className="text-lg">✨</span>Premium AI
        </Link>
      </div>
    </>
  );

  return (
    <div className="p-3 sm:p-4 lg:p-5 max-w-[1600px] mx-auto animate-fade-in pb-8">
      <SplitView feed={feed} main={mainContent} />
    </div>
  );
}

// ══════════════════════════════════════════════════════════════════
// COMBINED DASHBOARD — SPLIT VIEW (Merged Feed + Merged Main)
// ══════════════════════════════════════════════════════════════════
function CombinedDashboard() {
  const { cases } = useAppContext();
  const { user } = useAuth();
  const openCases = cases.filter(c => c.status === 'Open');
  const firstName = user?.name.split(' ')[0] || 'Counselor';

  // --- MERGED FEED ---
  const combinedFeed = [
    { text: 'Part 32 — Calendar delayed 30 min', sub: 'AC · Judge Williams · 8:45 AM', icon: '🔔', urgent: true },
    { text: 'Sarah Mitchell signed retainer agreement', sub: 'Private · Has attachment · 2 hours ago', icon: '📎', urgent: true },
    { text: 'Voucher #V-2024-0360 needs correction', sub: 'AC · Matter of Davis · Missing entries', icon: '⚠️', urgent: true },
    { text: 'Trust low balance: Torres matter ($340)', sub: 'Private · Estimated need: $2,000+', icon: '🏦', urgent: true },
  ];

  const feedUpdates = [
    { text: 'Voucher #V-2024-0341 approved — $1,850', sub: 'AC · People v. Chen', icon: '✅' },
    { text: 'David Park: "Move consult to Thursday?"', sub: 'Private · Needs reply', icon: '💬' },
    { text: 'Panel meeting: Feb 25, 6:00 PM', sub: 'AC · Queens Bar · Mandatory', icon: '📌' },
    { text: 'Jennifer Adams — Estate Planning inquiry', sub: 'Private · Web form · 2 hours ago', icon: '📩' },
    { text: 'New rate increase effective March 1', sub: 'AC · In-court: $158→$164/hr', icon: '💵' },
    { text: 'Trust deposit: $5,000 — Mitchell retainer', sub: 'Private · IOLA · Cleared today', icon: '✅' },
    { text: 'New assignment: Rodriguez — Petit Larceny', sub: 'AC · Criminal Court, Queens', icon: '📥' },
    { text: 'Robert Kim — Divorce referral from Lisa Chen', sub: 'Private · Yesterday', icon: '🟡' },
  ];

  // --- MERGED MAIN ---
  const unifiedCalendar = [
    { time: '9:00 AM', event: 'Client call — Thompson (trial prep)', source: 'AC', type: 'call' },
    { time: '9:30 AM', event: 'People v. Martinez — Part 32', source: 'AC', type: 'court' },
    { time: '10:00 AM', event: 'Robert Kim — Initial consult (Divorce)', source: 'Private', type: 'consult' },
    { time: '11:00 AM', event: 'Draft motion — Martinez', source: 'AC', type: 'task' },
    { time: '2:00 PM', event: 'Maria Santos — PI consult (Video)', source: 'Private', type: 'consult' },
    { time: '2:30 PM', event: 'People v. Chen — Part 15', source: 'AC', type: 'court' },
    { time: '4:00 PM', event: 'Voucher prep + Billing review', source: 'Both', type: 'admin' },
  ];

  const feed = (
    <>
      {/* Urgent / Action Required */}
      <FeedCard title="Action Required" icon="🚨" accent="red">
        {combinedFeed.map((f, i) => <FeedItem key={i} {...f} />)}
      </FeedCard>

      {/* Activity Stream */}
      <FeedCard title="Activity Feed" icon="📡" accent="slate">
        {feedUpdates.map((f, i) => <FeedItem key={i} {...f} />)}
      </FeedCard>
    </>
  );

  const mainContent = (
    <>
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-bold text-slate-900">Mission Control</h1>
          <p className="text-xs text-slate-500">Both practices · {new Date().toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' })}</p>
        </div>
        <Link href="/dashboard/cases/new" className="flex items-center gap-1.5 bg-slate-800 hover:bg-slate-900 text-white px-3 py-2 rounded-lg text-xs font-semibold transition-colors">
          + New Case
        </Link>
      </div>

      {/* Dual Summary Cards */}
      <div className="grid grid-cols-2 gap-3">
        <div className="bg-blue-50 border border-blue-200 rounded-xl p-4">
          <h3 className="text-[10px] font-bold text-blue-600 uppercase tracking-wider mb-2">⚖️ Assigned Counsel</h3>
          <div className="grid grid-cols-2 gap-2">
            <div className="text-center"><p className="text-lg font-bold text-blue-800">{openCases.length}</p><p className="text-[9px] text-blue-600">Cases</p></div>
            <div className="text-center"><p className="text-lg font-bold text-blue-800">$4,280</p><p className="text-[9px] text-blue-600">Pending</p></div>
          </div>
          <div className="flex gap-1.5 mt-3">
            <Link href="/dashboard/vouchers" className="flex-1 text-center py-1.5 bg-blue-600 hover:bg-blue-700 text-white text-[10px] font-semibold rounded-md transition-colors">Vouchers</Link>
            <Link href="/dashboard/court-schedules" className="flex-1 text-center py-1.5 bg-blue-100 hover:bg-blue-200 text-blue-800 text-[10px] font-semibold rounded-md transition-colors">Calendar</Link>
          </div>
        </div>
        <div className="bg-purple-50 border border-purple-200 rounded-xl p-4">
          <h3 className="text-[10px] font-bold text-purple-600 uppercase tracking-wider mb-2">🏛️ Private Practice</h3>
          <div className="grid grid-cols-2 gap-2">
            <div className="text-center"><p className="text-lg font-bold text-purple-800">23</p><p className="text-[9px] text-purple-600">Clients</p></div>
            <div className="text-center"><p className="text-lg font-bold text-purple-800">$18.4K</p><p className="text-[9px] text-purple-600">Revenue</p></div>
          </div>
          <div className="flex gap-1.5 mt-3">
            <Link href="/dashboard/billing" className="flex-1 text-center py-1.5 bg-purple-600 hover:bg-purple-700 text-white text-[10px] font-semibold rounded-md transition-colors">Billing</Link>
            <Link href="/dashboard/client-intake" className="flex-1 text-center py-1.5 bg-purple-100 hover:bg-purple-200 text-purple-800 text-[10px] font-semibold rounded-md transition-colors">Intake</Link>
          </div>
        </div>
      </div>

      {/* Unified Daily Calendar */}
      <div className="bg-white border border-slate-200 rounded-xl shadow-sm">
        <div className="px-4 py-3 border-b border-slate-100">
          <h3 className="text-sm font-bold text-slate-800">📅 Today&apos;s Schedule</h3>
        </div>
        <div className="divide-y divide-slate-50">
          {unifiedCalendar.map((e, i) => (
            <div key={i} className="px-4 py-2.5 flex items-center gap-3 hover:bg-slate-50 transition-colors">
              <span className="text-[10px] font-mono font-bold text-slate-400 w-16 shrink-0">{e.time}</span>
              <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded shrink-0 ${
                e.source === 'AC' ? 'bg-blue-100 text-blue-700' : e.source === 'Private' ? 'bg-purple-100 text-purple-700' : 'bg-slate-100 text-slate-600'
              }`}>{e.source}</span>
              <p className="text-xs text-slate-700">{e.event}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Combined Financials */}
      <div className="bg-white border border-slate-200 rounded-xl shadow-sm p-4">
        <h3 className="text-sm font-bold text-slate-800 mb-3">💰 Combined Financials (MTD)</h3>
        <div className="grid grid-cols-4 gap-3 text-center">
          <div><p className="text-lg font-bold text-blue-700">$8,170</p><p className="text-[9px] text-slate-500">AC Paid</p></div>
          <div><p className="text-lg font-bold text-purple-700">$15,480</p><p className="text-[9px] text-slate-500">Private Collected</p></div>
          <div><p className="text-lg font-bold text-emerald-700">$23,650</p><p className="text-[9px] text-slate-500">Total Revenue</p></div>
          <div><p className="text-lg font-bold text-amber-600">$11,600</p><p className="text-[9px] text-slate-500">Outstanding</p></div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-4 gap-2">
        <Link href="/dashboard/copilot" className="flex flex-col items-center gap-1 p-3 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg text-[10px] font-medium transition-colors text-center">
          <span className="text-lg">🤖</span>Co-Pilot
        </Link>
        <Link href="/dashboard/agent" className="flex flex-col items-center gap-1 p-3 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg text-[10px] font-medium transition-colors text-center">
          <span className="text-lg">⚖️</span>Ask Lex
        </Link>
        <Link href="/dashboard/research" className="flex flex-col items-center gap-1 p-3 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg text-[10px] font-medium transition-colors text-center">
          <span className="text-lg">🔍</span>Research
        </Link>
        <Link href="/dashboard/cases" className="flex flex-col items-center gap-1 p-3 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg text-[10px] font-medium transition-colors text-center">
          <span className="text-lg">📂</span>All Cases
        </Link>
      </div>
    </>
  );

  return (
    <div className="p-3 sm:p-4 lg:p-5 max-w-[1600px] mx-auto animate-fade-in pb-8">
      <SplitView feed={feed} main={mainContent} />
    </div>
  );
}

// ══════════════════════════════════════════════════════════════════
// MAIN EXPORT — Routes to correct dashboard
// ══════════════════════════════════════════════════════════════════
export default function DashboardPage() {
  const { mode } = usePracticeMode();

  if (mode === 'prose') return <ProSeDashboard />;
  if (mode === '18b') return <AssignedCounselDashboard />;
  if (mode === 'private') return <PrivatePracticeDashboard />;
  return <CombinedDashboard />;
}
