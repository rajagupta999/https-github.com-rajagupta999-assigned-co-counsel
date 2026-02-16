"use client";

import { useState, useEffect, useCallback, useRef } from 'react';
import { useAppContext } from '@/context/AppContext';
import { useAuth } from '@/context/AuthContext';
import { mockStats, mockTasks } from '@/lib/mockData';
import { getActiveEntry, startTimer, pauseTimer, resumeTimer, stopTimer, calcRunningDuration, formatDuration, getTimeLog, getTodayTotal, getWeekTotal, formatHoursMinutes, TimeEntry } from '@/lib/timeTracker';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

// ── Calendar Helper ──────────────────────────────────────────────
function getCalendarDays(year: number, month: number) {
  const firstDay = new Date(year, month, 1).getDay();
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const days: (number | null)[] = [];
  for (let i = 0; i < firstDay; i++) days.push(null);
  for (let i = 1; i <= daysInMonth; i++) days.push(i);
  return days;
}

interface CalendarEvent {
  id: string;
  title: string;
  date: string; // YYYY-MM-DD
  time: string;
  color: string;
  type: 'court' | 'meeting' | 'deadline' | 'call' | 'other';
  caseId?: string;
}

function getStoredEvents(): CalendarEvent[] {
  if (typeof window === 'undefined') return [];
  try {
    const stored = localStorage.getItem('acc_calendar_events');
    return stored ? JSON.parse(stored) : [];
  } catch { return []; }
}

function storeEvents(events: CalendarEvent[]) {
  localStorage.setItem('acc_calendar_events', JSON.stringify(events));
}

// ── Notes Storage ────────────────────────────────────────────────
function getStoredNotes(): string {
  if (typeof window === 'undefined') return '';
  return localStorage.getItem('acc_dashboard_notes') || '';
}

// All premium legal databases
const ALL_DATABASES = [
  { key: 'westlaw', name: 'Westlaw', icon: '🔵', color: 'from-blue-600 to-blue-800', badge: 'bg-blue-100 text-blue-700', url: 'https://1.next.westlaw.com' },
  { key: 'lexisnexis', name: 'Lexis+', icon: '🔶', color: 'from-orange-500 to-orange-700', badge: 'bg-orange-100 text-orange-700', url: 'https://plus.lexis.com' },
  { key: 'bloomberg', name: 'Bloomberg Law', icon: '⬛', color: 'from-zinc-700 to-zinc-900', badge: 'bg-zinc-100 text-zinc-700', url: 'https://www.bloomberglaw.com' },
  { key: 'thomson', name: 'Thomson Reuters', icon: '🔴', color: 'from-red-600 to-red-800', badge: 'bg-red-100 text-red-700', url: 'https://www.thomsonreuters.com' },
  { key: 'heinonline', name: 'HeinOnline', icon: '📕', color: 'from-rose-600 to-rose-800', badge: 'bg-rose-100 text-rose-700', url: 'https://heinonline.org' },
  { key: 'fastcase', name: 'Fastcase', icon: '⚡', color: 'from-yellow-500 to-yellow-700', badge: 'bg-yellow-100 text-yellow-700', url: 'https://www.fastcase.com' },
  { key: 'vlex', name: 'vLex', icon: '🟢', color: 'from-green-600 to-green-800', badge: 'bg-green-100 text-green-700', url: 'https://vlex.com' },
  { key: 'justcite', name: 'JustCite', icon: '🔗', color: 'from-teal-600 to-teal-800', badge: 'bg-teal-100 text-teal-700', url: 'https://www.justcite.com' },
  { key: 'docketnav', name: 'Docket Navigator', icon: '🧭', color: 'from-cyan-600 to-cyan-800', badge: 'bg-cyan-100 text-cyan-700', url: 'https://www.docketnavigator.com' },
  { key: 'jstor', name: 'JSTOR', icon: '🏛️', color: 'from-indigo-600 to-indigo-800', badge: 'bg-indigo-100 text-indigo-700', url: 'https://www.jstor.org' },
  { key: 'ebsco', name: 'EBSCO Legal', icon: '📰', color: 'from-lime-600 to-lime-800', badge: 'bg-lime-100 text-lime-700', url: 'https://www.ebsco.com' },
  { key: 'oxford', name: 'Oxford Law', icon: '🎓', color: 'from-blue-700 to-blue-900', badge: 'bg-blue-100 text-blue-700', url: 'https://academic.oup.com' },
  { key: 'cambridge', name: 'Cambridge Law', icon: '🏫', color: 'from-violet-600 to-violet-800', badge: 'bg-violet-100 text-violet-700', url: 'https://www.cambridge.org' },
  { key: 'proquest', name: 'ProQuest', icon: '📜', color: 'from-fuchsia-600 to-fuchsia-800', badge: 'bg-fuchsia-100 text-fuchsia-700', url: 'https://www.proquest.com' },
  { key: 'vitallaw', name: 'VitalLaw', icon: '💊', color: 'from-pink-600 to-pink-800', badge: 'bg-pink-100 text-pink-700', url: 'https://www.vitallaw.com' },
];

const RESEARCH_SOURCES = [
  { name: 'CourtListener', color: 'text-blue-600', icon: '⚖️' },
  { name: 'Google Scholar', color: 'text-red-600', icon: '📚' },
  { name: 'Fastcase', color: 'text-green-600', icon: '📗' },
  { name: 'RECAP Archive', color: 'text-purple-600', icon: '🗂️' },
  { name: 'NY Courts', color: 'text-orange-600', icon: '🏛️' },
];

const EVENT_TYPES = [
  { value: 'court', label: 'Court Hearing', color: 'bg-red-500' },
  { value: 'meeting', label: 'Meeting', color: 'bg-blue-500' },
  { value: 'deadline', label: 'Deadline', color: 'bg-amber-500' },
  { value: 'call', label: 'Phone Call', color: 'bg-emerald-500' },
  { value: 'other', label: 'Other', color: 'bg-purple-500' },
];

// ── Widget Wrapper ───────────────────────────────────────────────
function Widget({ title, icon, children, className = '', headerExtra }: {
  title: string; icon: string; children: React.ReactNode; className?: string;
  headerExtra?: React.ReactNode;
}) {
  const [collapsed, setCollapsed] = useState(false);
  return (
    <div className={`bg-white rounded-lg border border-slate-200 shadow-sm overflow-hidden flex flex-col ${className}`}>
      <div className="flex items-center justify-between px-3 py-2 bg-gradient-to-r from-slate-50 to-white border-b border-slate-100 min-h-[40px]">
        <div className="flex items-center gap-2 min-w-0">
          <span className="text-sm">{icon}</span>
          <h3 className="text-xs font-bold text-slate-700 uppercase tracking-wide truncate">{title}</h3>
        </div>
        <div className="flex items-center gap-1 shrink-0">
          {headerExtra}
          <button onClick={() => setCollapsed(!collapsed)} className="w-5 h-5 flex items-center justify-center text-slate-400 hover:text-slate-600 rounded">
            <svg className={`w-3 h-3 transition-transform ${collapsed ? '-rotate-90' : ''}`} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2"><path d="M19 9l-7 7-7-7" /></svg>
          </button>
        </div>
      </div>
      {!collapsed && <div className="flex-1 overflow-auto">{children}</div>}
    </div>
  );
}

// ── Main Dashboard ───────────────────────────────────────────────
export default function DashboardPage() {
  const { cases } = useAppContext();
  const { user } = useAuth();
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState('');
  const [activeTab, setActiveTab] = useState('Case Law');
  const [msgTab, setMsgTab] = useState<'chat' | 'notes'>('chat');
  const [noteText, setNoteText] = useState('');

  // Calendar state
  const [calEvents, setCalEvents] = useState<CalendarEvent[]>([]);
  const [calMonth, setCalMonth] = useState(new Date().getMonth());
  const [calYear, setCalYear] = useState(new Date().getFullYear());
  const [selectedDay, setSelectedDay] = useState<number | null>(null);
  const [showAddEvent, setShowAddEvent] = useState(false);
  const [newEvent, setNewEvent] = useState({ title: '', time: '09:00', type: 'court' as CalendarEvent['type'] });

  // File upload
  const [uploadedFiles, setUploadedFiles] = useState<{ name: string; size: string; date: string }[]>([]);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // My Databases
  const [pinnedDbs, setPinnedDbs] = useState<string[]>([]);
  const [showDbPicker, setShowDbPicker] = useState(false);
  const [dbSearch, setDbSearch] = useState('');
  const [dbQuickSearch, setDbQuickSearch] = useState<Record<string, string>>({});

  // Messages from Lex
  const [lexMessages, setLexMessages] = useState<{ sender: string; text: string; time: string }[]>([]);

  // Load from localStorage
  useEffect(() => {
    setCalEvents(getStoredEvents());
    setNoteText(getStoredNotes());

    // Load uploaded files list
    try {
      const files = localStorage.getItem('acc_uploaded_files');
      if (files) setUploadedFiles(JSON.parse(files));
    } catch {}

    // Load pinned databases
    const saved = localStorage.getItem('acc_pinned_databases');
    if (saved) setPinnedDbs(JSON.parse(saved));
    const creds = localStorage.getItem('acc_agentic_creds');
    if (creds) {
      const parsed = JSON.parse(creds);
      const connectedKeys = Object.keys(parsed);
      if (connectedKeys.length > 0) {
        setPinnedDbs(prev => {
          const merged = [...new Set([...prev, ...connectedKeys])];
          localStorage.setItem('acc_pinned_databases', JSON.stringify(merged));
          return merged;
        });
      }
    }

    // Load recent Lex messages
    try {
      const hist = localStorage.getItem('acc_paralegal_history_default');
      if (hist) {
        const msgs = JSON.parse(hist).slice(-4).map((m: any) => ({
          sender: m.role === 'user' ? 'You' : 'Lex',
          text: m.content.substring(0, 120) + (m.content.length > 120 ? '...' : ''),
          time: new Date(m.timestamp).toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' }),
        }));
        setLexMessages(msgs);
      }
    } catch {}
  }, []);

  // Save notes on change
  useEffect(() => {
    if (noteText !== undefined) localStorage.setItem('acc_dashboard_notes', noteText);
  }, [noteText]);

  const togglePinDb = (key: string) => {
    setPinnedDbs(prev => {
      const updated = prev.includes(key) ? prev.filter(k => k !== key) : [...prev, key];
      localStorage.setItem('acc_pinned_databases', JSON.stringify(updated));
      return updated;
    });
  };

  // Calendar helpers
  const calDays = getCalendarDays(calYear, calMonth);
  const monthName = new Date(calYear, calMonth).toLocaleString('default', { month: 'long', year: 'numeric' });
  const getEventsForDay = (day: number) => {
    const dateStr = `${calYear}-${String(calMonth + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
    return calEvents.filter(e => e.date === dateStr);
  };

  const addCalendarEvent = () => {
    if (!newEvent.title.trim() || selectedDay === null) return;
    const dateStr = `${calYear}-${String(calMonth + 1).padStart(2, '0')}-${String(selectedDay).padStart(2, '0')}`;
    const eventType = EVENT_TYPES.find(t => t.value === newEvent.type) || EVENT_TYPES[0];
    const event: CalendarEvent = {
      id: `evt_${Date.now()}`,
      title: newEvent.title.trim(),
      date: dateStr,
      time: newEvent.time,
      color: eventType.color,
      type: newEvent.type,
    };
    const updated = [...calEvents, event];
    setCalEvents(updated);
    storeEvents(updated);
    setNewEvent({ title: '', time: '09:00', type: 'court' });
    setShowAddEvent(false);
  };

  const deleteCalendarEvent = (id: string) => {
    const updated = calEvents.filter(e => e.id !== id);
    setCalEvents(updated);
    storeEvents(updated);
  };

  // File upload handler
  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files) return;
    const newFiles = Array.from(files).map(f => ({
      name: f.name,
      size: f.size < 1024 ? `${f.size} B` : f.size < 1048576 ? `${(f.size / 1024).toFixed(1)} KB` : `${(f.size / 1048576).toFixed(1)} MB`,
      date: new Date().toLocaleDateString(),
    }));
    const updated = [...newFiles, ...uploadedFiles].slice(0, 20);
    setUploadedFiles(updated);
    localStorage.setItem('acc_uploaded_files', JSON.stringify(updated));
    e.target.value = '';
  };

  // Search handler
  const handleSearch = () => {
    if (!searchQuery.trim()) return;
    router.push(`/dashboard/research?q=${encodeURIComponent(searchQuery)}`);
  };

  // Timer state
  const [timerEntry, setTimerEntry] = useState<TimeEntry | null>(null);
  const [timerDisplay, setTimerDisplay] = useState('00:00:00');
  const [timerDesc, setTimerDesc] = useState('');
  const [showTimeLog, setShowTimeLog] = useState(false);
  const [timeLog, setTimeLog] = useState<TimeEntry[]>([]);

  useEffect(() => {
    const active = getActiveEntry();
    if (active) setTimerEntry(active);
    setTimeLog(getTimeLog());
  }, []);

  useEffect(() => {
    if (!timerEntry || timerEntry.status === 'stopped') return;
    const tick = () => {
      const active = getActiveEntry();
      if (active) setTimerDisplay(formatDuration(calcRunningDuration(active)));
    };
    tick();
    const interval = setInterval(tick, 1000);
    return () => clearInterval(interval);
  }, [timerEntry]);

  const handleStartTimer = useCallback(() => {
    const desc = timerDesc.trim() || 'General work';
    const entry = startTimer(desc);
    setTimerEntry(entry);
    setTimerDesc('');
  }, [timerDesc]);
  const handlePauseTimer = useCallback(() => { const e = pauseTimer(); setTimerEntry(e ? { ...e } : null); }, []);
  const handleResumeTimer = useCallback(() => { const e = resumeTimer(); setTimerEntry(e ? { ...e } : null); }, []);
  const handleStopTimer = useCallback(() => { stopTimer(); setTimerEntry(null); setTimerDisplay('00:00:00'); setTimeLog(getTimeLog()); }, []);

  const openCases = cases.filter(c => c.status === 'Open');
  const now = new Date();
  const firstName = user?.name.split(' ')[0] || 'Counselor';
  const searchTabs = ['Case Law', 'Statutes', 'Regulations', 'Briefs', 'Journals', 'Forms'];

  // Upcoming events (next 7 days)
  const upcomingEvents = calEvents
    .filter(e => { const d = new Date(e.date); const diff = (d.getTime() - now.getTime()) / 86400000; return diff >= 0 && diff <= 7; })
    .sort((a, b) => a.date.localeCompare(b.date));

  return (
    <div className="p-3 sm:p-4 lg:p-5 max-w-[1600px] mx-auto space-y-3 animate-fade-in pb-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-lg font-bold text-slate-900">Mission Control</h1>
          <p className="text-xs text-slate-400">Welcome back, {firstName}</p>
        </div>
        <Link href="/dashboard/cases/new" className="flex items-center gap-1.5 bg-navy-900 hover:bg-navy-800 text-white px-3 py-2 rounded-lg text-xs font-semibold transition-colors">
          <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5"><line x1="12" y1="5" x2="12" y2="19" /><line x1="5" y1="12" x2="19" y2="12" /></svg>
          New Case
        </Link>
      </div>

      {/* Universal Search — functional */}
      <div className="bg-white rounded-lg border border-slate-200 shadow-sm p-3">
        <div className="flex gap-2 mb-2">
          <div className="flex-1 relative">
            <svg className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2"><circle cx="11" cy="11" r="8" /><line x1="21" y1="21" x2="16.65" y2="16.65" /></svg>
            <input
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && handleSearch()}
              placeholder="Search cases, statutes, case law — press Enter or click Search..."
              className="w-full pl-9 pr-4 py-2 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-navy-500/20"
            />
          </div>
          <button onClick={handleSearch} className="px-4 py-2 bg-navy-900 hover:bg-navy-800 text-white text-xs font-semibold rounded-lg flex items-center gap-1.5 transition-colors">
            <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2"><circle cx="11" cy="11" r="8" /><line x1="21" y1="21" x2="16.65" y2="16.65" /></svg>
            Search
          </button>
        </div>
        <div className="flex gap-1 overflow-x-auto">
          {searchTabs.map(tab => (
            <button key={tab} onClick={() => { setActiveTab(tab); router.push(`/dashboard/research?tab=${encodeURIComponent(tab)}`); }}
              className={`px-3 py-1 text-[11px] font-medium rounded-md whitespace-nowrap transition-colors ${activeTab === tab ? 'bg-navy-900 text-white' : 'bg-slate-50 text-slate-500 hover:bg-slate-100'}`}
            >{tab}</button>
          ))}
        </div>
      </div>

      {/* Upcoming Events Banner */}
      {upcomingEvents.length > 0 && (
        <div className="bg-amber-50 border border-amber-200 rounded-lg px-3 py-2 flex items-center gap-3 overflow-x-auto">
          <span className="text-xs font-bold text-amber-700 shrink-0">📅 Upcoming:</span>
          {upcomingEvents.slice(0, 3).map(e => (
            <span key={e.id} className="text-xs text-amber-600 whitespace-nowrap">
              <span className={`inline-block w-2 h-2 rounded-full ${e.color} mr-1`}></span>
              {e.title} ({new Date(e.date + 'T12:00').toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' })} {e.time})
            </span>
          ))}
        </div>
      )}

      {/* Main Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-3">

        {/* === COLUMN 1 === */}
        <div className="space-y-3">
          {/* File Upload — functional */}
          <Widget title="File Upload" icon="📁">
            <div className="p-3 space-y-2">
              <input ref={fileInputRef} type="file" multiple accept=".pdf,.doc,.docx,.txt,.csv,.xlsx" className="hidden" onChange={handleFileUpload} />
              <button onClick={() => fileInputRef.current?.click()} className="w-full py-2 bg-navy-900 hover:bg-navy-800 text-white text-xs font-semibold rounded-lg transition-colors flex items-center justify-center gap-1.5">
                <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2"><path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4M17 8l-5-5-5 5M12 3v12" /></svg>
                Upload Documents
              </button>
              {uploadedFiles.length === 0 ? (
                <p className="text-xs text-slate-400 text-center py-2">No files uploaded yet</p>
              ) : (
                <div className="space-y-1 max-h-[120px] overflow-auto">
                  {uploadedFiles.map((f, i) => (
                    <div key={i} className="flex items-center justify-between px-2 py-1.5 rounded hover:bg-slate-50 text-xs">
                      <div className="flex items-center gap-2 min-w-0">
                        <span>📄</span><span className="truncate text-slate-600">{f.name}</span>
                      </div>
                      <span className="text-[10px] text-slate-400 shrink-0 ml-2">{f.size}</span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </Widget>

          {/* Cases Overview */}
          <Widget title="Cases Overview" icon="👥" headerExtra={<Link href="/dashboard/cases" className="text-[10px] text-navy-700 hover:text-navy-900 font-semibold">All Cases</Link>}>
            <div className="divide-y divide-slate-50">
              {openCases.slice(0, 5).map(c => (
                <Link key={c.id} href={`/dashboard/cases/${c.id}`} className="flex items-center justify-between px-3 py-2 hover:bg-slate-50 transition-colors">
                  <span className="text-xs text-slate-700 font-medium truncate mr-2">{c.client}</span>
                  <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded ${c.status === 'Open' ? 'bg-emerald-100 text-emerald-700' : 'bg-amber-100 text-amber-700'}`}>{c.status}</span>
                </Link>
              ))}
              {openCases.length === 0 && <p className="p-3 text-xs text-slate-400 text-center">No active cases</p>}
            </div>
          </Widget>

          {/* Billing & Hours */}
          <Widget title="Billing & Hours" icon="💰">
            <div className="p-3 space-y-3">
              <div className="flex items-center gap-2">
                <svg className="w-4 h-4 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="10" /><polyline points="12 6 12 12 16 14" /></svg>
                <span className="text-xs text-slate-500">Today:</span>
                <span className="text-sm font-bold text-slate-800">{formatHoursMinutes(getTodayTotal())}</span>
                <span className="text-xs text-slate-400">|</span>
                <span className="text-xs text-slate-500">Week:</span>
                <span className="text-sm font-bold text-slate-800">{formatHoursMinutes(getWeekTotal())}</span>
              </div>
              <div className="flex items-center gap-2">
                <svg className="w-4 h-4 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2"><path d="M4 2v20l2-1 2 1 2-1 2 1 2-1 2 1 2-1 2 1V2l-2 1-2-1-2 1-2-1-2 1-2-1-2 1-2-1z" /></svg>
                <span className="text-xs text-slate-500">Pending Vouchers:</span>
                <span className="text-sm font-bold text-amber-600">{mockStats.pendingVouchers}</span>
              </div>
              <Link href="/dashboard/vouchers" className="block w-full py-2 bg-navy-900 hover:bg-navy-800 text-white text-xs font-semibold rounded-lg transition-colors text-center">
                Submit Voucher
              </Link>
            </div>
          </Widget>
        </div>

        {/* === COLUMN 2 === */}
        <div className="space-y-3">
          {/* Calendar — fully functional */}
          <Widget title={monthName} icon="📅"
            headerExtra={
              <div className="flex items-center gap-1">
                <button onClick={() => { if (calMonth === 0) { setCalMonth(11); setCalYear(y => y - 1); } else setCalMonth(m => m - 1); }} className="w-5 h-5 flex items-center justify-center text-slate-400 hover:text-slate-600 rounded text-xs">←</button>
                <button onClick={() => { setCalMonth(now.getMonth()); setCalYear(now.getFullYear()); }} className="text-[9px] text-navy-700 hover:text-navy-900 font-semibold">Today</button>
                <button onClick={() => { if (calMonth === 11) { setCalMonth(0); setCalYear(y => y + 1); } else setCalMonth(m => m + 1); }} className="w-5 h-5 flex items-center justify-center text-slate-400 hover:text-slate-600 rounded text-xs">→</button>
              </div>
            }
          >
            <div className="p-2">
              <div className="grid grid-cols-7 gap-0 text-center mb-1">
                {['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'].map(d => (
                  <div key={d} className="text-[9px] font-bold text-slate-400 py-1">{d}</div>
                ))}
              </div>
              <div className="grid grid-cols-7 gap-0">
                {calDays.map((day, i) => {
                  const events = day ? getEventsForDay(day) : [];
                  const isToday = day === now.getDate() && calMonth === now.getMonth() && calYear === now.getFullYear();
                  const isSelected = day === selectedDay;
                  return (
                    <div key={i}
                      onClick={() => { if (day) { setSelectedDay(day === selectedDay ? null : day); setShowAddEvent(false); } }}
                      className={`relative py-1 text-center min-h-[28px] ${day ? 'cursor-pointer hover:bg-slate-50 rounded' : ''} ${isSelected ? 'bg-navy-50 ring-1 ring-navy-300 rounded' : ''}`}
                    >
                      {day && (
                        <>
                          <span className={`text-[10px] ${isToday ? 'bg-navy-900 text-white w-5 h-5 rounded-full inline-flex items-center justify-center font-bold' : 'text-slate-600'}`}>{day}</span>
                          {events.slice(0, 2).map((ev, j) => (
                            <div key={j} className={`${ev.color} text-white text-[7px] rounded px-0.5 mt-0.5 truncate leading-tight`} title={`${ev.title} ${ev.time}`}>
                              {ev.title.split(' ').slice(0, 2).join(' ')}
                            </div>
                          ))}
                          {events.length > 2 && <div className="text-[7px] text-slate-400">+{events.length - 2}</div>}
                        </>
                      )}
                    </div>
                  );
                })}
              </div>

              {/* Selected day detail */}
              {selectedDay !== null && (
                <div className="mt-2 border-t border-slate-100 pt-2">
                  <div className="flex items-center justify-between mb-1.5">
                    <span className="text-xs font-bold text-slate-700">
                      {new Date(calYear, calMonth, selectedDay).toLocaleDateString('en-US', { weekday: 'long', month: 'short', day: 'numeric' })}
                    </span>
                    <button onClick={() => setShowAddEvent(!showAddEvent)} className="text-[10px] font-semibold text-navy-700 hover:text-navy-900">
                      {showAddEvent ? 'Cancel' : '+ Add'}
                    </button>
                  </div>

                  {showAddEvent && (
                    <div className="space-y-1.5 mb-2 bg-slate-50 rounded-lg p-2">
                      <input value={newEvent.title} onChange={e => setNewEvent(p => ({ ...p, title: e.target.value }))} placeholder="Event title..." className="w-full text-xs border border-slate-200 rounded px-2 py-1.5 focus:outline-none focus:ring-1 focus:ring-navy-500/20" onKeyDown={e => e.key === 'Enter' && addCalendarEvent()} />
                      <div className="flex gap-1.5">
                        <input type="time" value={newEvent.time} onChange={e => setNewEvent(p => ({ ...p, time: e.target.value }))} className="flex-1 text-xs border border-slate-200 rounded px-2 py-1.5" />
                        <select value={newEvent.type} onChange={e => setNewEvent(p => ({ ...p, type: e.target.value as CalendarEvent['type'] }))} className="flex-1 text-xs border border-slate-200 rounded px-2 py-1.5">
                          {EVENT_TYPES.map(t => <option key={t.value} value={t.value}>{t.label}</option>)}
                        </select>
                      </div>
                      <button onClick={addCalendarEvent} className="w-full py-1.5 bg-navy-900 hover:bg-navy-800 text-white text-[10px] font-bold rounded transition-colors">Add Event</button>
                    </div>
                  )}

                  {getEventsForDay(selectedDay).length === 0 && !showAddEvent && (
                    <p className="text-[10px] text-slate-400">No events this day</p>
                  )}
                  {getEventsForDay(selectedDay).map(ev => (
                    <div key={ev.id} className="flex items-center justify-between py-1">
                      <div className="flex items-center gap-1.5 min-w-0">
                        <span className={`w-2 h-2 rounded-full ${ev.color} shrink-0`}></span>
                        <span className="text-[10px] text-slate-700 font-medium truncate">{ev.title}</span>
                        <span className="text-[9px] text-slate-400 shrink-0">{ev.time}</span>
                      </div>
                      <button onClick={() => deleteCalendarEvent(ev.id)} className="text-slate-300 hover:text-red-400 ml-1 shrink-0">
                        <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2"><path d="M6 18L18 6M6 6l12 12" /></svg>
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </Widget>

          {/* Case Details */}
          <Widget title="Case Details" icon="👤">
            {openCases.length > 0 ? (
              <div className="p-3 space-y-2.5">
                <div>
                  <p className="text-xs font-bold text-slate-800">{openCases[0].client}</p>
                  <p className="text-[10px] text-slate-400 font-mono">{openCases[0].id}</p>
                </div>
                <div className="space-y-1.5">
                  {[
                    ['Status', openCases[0].status, 'text-emerald-600'],
                    ['Next Hearing', openCases[0].nextCourtDate, 'text-slate-700'],
                    ['Charges', openCases[0].charges, 'text-slate-700'],
                    ['County', openCases[0].county, 'text-slate-700'],
                  ].map(([label, value, color]) => (
                    <div key={label} className="flex gap-2">
                      <span className="text-[10px] text-slate-400 w-20 shrink-0">{label}:</span>
                      <span className={`text-[10px] font-medium ${color}`}>{value}</span>
                    </div>
                  ))}
                </div>
                <Link href={`/dashboard/cases/${openCases[0].id}`} className="block text-center py-1.5 bg-navy-900 hover:bg-navy-800 text-white text-[10px] font-semibold rounded-lg transition-colors mt-1">
                  Open Case
                </Link>
              </div>
            ) : (
              <p className="p-3 text-xs text-slate-400 text-center">No active cases</p>
            )}
          </Widget>

          {/* Court Prep Checklist */}
          <Widget title="Court Prep Checklist" icon="✅" headerExtra={<Link href="/dashboard/trial-prep" className="text-[10px] text-navy-700 hover:text-navy-900 font-semibold">Trial Prep →</Link>}>
            <div className="p-3 space-y-2">
              {['Prepare Deposition Questions', 'Submit Discovery Requests', 'Review Expert Report', 'Call Client for Update', 'File Motion to Suppress'].map((item, i) => (
                <label key={i} className="flex items-center gap-2 cursor-pointer group">
                  <input type="checkbox" defaultChecked={i < 2} className="h-3.5 w-3.5 rounded border-slate-300 text-navy-800 focus:ring-navy-500/30" />
                  <span className={`text-xs ${i < 2 ? 'text-slate-400 line-through' : 'text-slate-700 group-hover:text-navy-800'}`}>{item}</span>
                </label>
              ))}
            </div>
          </Widget>
        </div>

        {/* === COLUMN 3 === */}
        <div className="space-y-3">
          {/* Quick Actions — prominent */}
          <Widget title="Quick Actions" icon="⚡">
            <div className="p-2 grid grid-cols-2 gap-1.5">
              <Link href="/dashboard/copilot" className="flex flex-col items-center gap-1 px-2 py-2.5 bg-navy-900 hover:bg-navy-800 text-white rounded-lg text-[10px] font-medium transition-colors text-center">
                <span className="text-lg">🤖</span>Co-Pilot AI
              </Link>
              <Link href="/dashboard/agent" className="flex flex-col items-center gap-1 px-2 py-2.5 bg-gradient-to-br from-[#D4AF37] to-[#b8941f] hover:opacity-90 text-white rounded-lg text-[10px] font-medium transition-colors text-center">
                <span className="text-lg">⚖️</span>Ask Lex
              </Link>
              <Link href="/dashboard/research" className="flex flex-col items-center gap-1 px-2 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg text-[10px] font-medium transition-colors text-center">
                <span className="text-lg">🔍</span>Research
              </Link>
              <Link href="/dashboard/trial-prep" className="flex flex-col items-center gap-1 px-2 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg text-[10px] font-medium transition-colors text-center">
                <span className="text-lg">⚔️</span>Trial Prep
              </Link>
              <Link href="/dashboard/wiki" className="flex flex-col items-center gap-1 px-2 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg text-[10px] font-medium transition-colors text-center">
                <span className="text-lg">📖</span>Wiki
              </Link>
              <Link href="/dashboard/intel" className="flex flex-col items-center gap-1 px-2 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg text-[10px] font-medium transition-colors text-center">
                <span className="text-lg">📰</span>Legal Intel
              </Link>
            </div>
          </Widget>

          {/* PSLF Progress */}
          <Widget title="PSLF Progress" icon="🎓">
            <div className="p-3 space-y-2">
              <div className="flex items-end justify-between">
                <span className="text-2xl font-bold text-slate-900">{mockStats.pslfProgress}%</span>
                <span className="text-[10px] text-slate-400">98/120 payments</span>
              </div>
              <div className="w-full bg-slate-100 rounded-full h-2 overflow-hidden">
                <div className="bg-gradient-to-r from-navy-800 to-gold-500 h-2 rounded-full" style={{ width: `${mockStats.pslfProgress}%` }} />
              </div>
              <Link href="/dashboard/pslf" className="text-[10px] text-navy-700 hover:text-navy-900 font-semibold">View Details →</Link>
            </div>
          </Widget>

          {/* Tasks & Reminders */}
          <Widget title="Tasks & Reminders" icon="📌">
            <div className="divide-y divide-slate-50">
              {mockTasks.map(task => (
                <label key={task.id} className="flex items-center gap-2 px-3 py-2 cursor-pointer hover:bg-slate-50 transition-colors">
                  <input type="checkbox" className="h-3.5 w-3.5 rounded border-slate-300 text-navy-800 focus:ring-navy-500/30" />
                  <div className="min-w-0 flex-1">
                    <p className="text-xs text-slate-700 font-medium truncate">{task.title}</p>
                    <div className="flex items-center gap-1.5 mt-0.5">
                      <span className="text-[9px] text-slate-400 font-mono">{task.caseId}</span>
                      {task.urgent && <span className="text-[8px] font-bold text-red-600 bg-red-50 px-1 rounded">URGENT</span>}
                    </div>
                  </div>
                </label>
              ))}
            </div>
          </Widget>

          {/* Research Sources */}
          <Widget title="Research Sources" icon="🔬">
            <div className="divide-y divide-slate-50">
              {RESEARCH_SOURCES.map(s => (
                <Link key={s.name} href="/dashboard/research" className="flex items-center gap-2 px-3 py-2 hover:bg-slate-50 transition-colors">
                  <span className="text-sm">{s.icon}</span>
                  <span className={`text-xs font-semibold ${s.color}`}>{s.name}</span>
                </Link>
              ))}
            </div>
          </Widget>
        </div>

        {/* === COLUMN 4 === */}
        <div className="space-y-3">
          {/* My Legal Databases */}
          <Widget title="My Databases" icon="🗄️"
            headerExtra={
              <button onClick={() => setShowDbPicker(!showDbPicker)} className="text-[10px] text-navy-700 hover:text-navy-900 font-semibold">
                {showDbPicker ? 'Done' : '+ Add'}
              </button>
            }
          >
            {showDbPicker ? (
              <div className="p-2 space-y-2">
                <input value={dbSearch} onChange={e => setDbSearch(e.target.value)} placeholder="Search databases..." className="w-full text-xs border border-slate-200 rounded-lg px-2.5 py-1.5 focus:outline-none focus:ring-2 focus:ring-navy-500/20" />
                <div className="max-h-[250px] overflow-auto space-y-1">
                  {ALL_DATABASES.filter(db => !dbSearch || db.name.toLowerCase().includes(dbSearch.toLowerCase())).map(db => {
                    const isPinned = pinnedDbs.includes(db.key);
                    return (
                      <button key={db.key} onClick={() => togglePinDb(db.key)} className={`w-full flex items-center gap-2 px-2.5 py-2 rounded-lg text-xs transition-all ${isPinned ? 'bg-navy-50 border border-navy-200' : 'bg-white border border-slate-100 hover:bg-slate-50'}`}>
                        <span className="text-sm">{db.icon}</span>
                        <span className={`font-medium flex-1 text-left ${isPinned ? 'text-navy-800' : 'text-slate-600'}`}>{db.name}</span>
                        {isPinned ? <span className="text-[9px] font-bold text-navy-600 bg-navy-100 px-1.5 py-0.5 rounded-full">✓ Added</span> : <span className="text-[9px] font-bold text-slate-400 bg-slate-100 px-1.5 py-0.5 rounded-full">+ Add</span>}
                      </button>
                    );
                  })}
                </div>
              </div>
            ) : pinnedDbs.length === 0 ? (
              <div className="p-4 text-center">
                <p className="text-xs text-slate-400 mb-2">No databases added yet</p>
                <button onClick={() => setShowDbPicker(true)} className="text-[10px] font-semibold text-navy-700 hover:text-navy-900">+ Add your subscriptions</button>
              </div>
            ) : (
              <div className="divide-y divide-slate-50">
                {pinnedDbs.map(key => {
                  const db = ALL_DATABASES.find(d => d.key === key);
                  if (!db) return null;
                  const hasCreds = typeof window !== 'undefined' && (() => { try { const c = localStorage.getItem('acc_agentic_creds'); return c ? !!JSON.parse(c)[key] : false; } catch { return false; } })();
                  return (
                    <div key={key} className="px-3 py-2.5">
                      <div className="flex items-center gap-2 mb-1.5">
                        <div className={`w-7 h-7 rounded-lg bg-gradient-to-br ${db.color} flex items-center justify-center text-white text-sm shadow-sm`}>{db.icon}</div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-1.5">
                            <span className="text-xs font-bold text-slate-800">{db.name}</span>
                            {hasCreds ? <span className="text-[8px] font-bold text-emerald-600 bg-emerald-50 px-1 py-0.5 rounded">Connected</span> : <span className="text-[8px] font-bold text-amber-600 bg-amber-50 px-1 py-0.5 rounded">Not linked</span>}
                          </div>
                        </div>
                        <button onClick={() => togglePinDb(key)} className="text-slate-300 hover:text-red-400 transition-colors p-0.5" title="Remove">
                          <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2"><path d="M6 18L18 6M6 6l12 12" /></svg>
                        </button>
                      </div>
                      <div className="flex gap-1">
                        <input value={dbQuickSearch[key] || ''} onChange={e => setDbQuickSearch(prev => ({ ...prev, [key]: e.target.value }))} onKeyDown={e => { if (e.key === 'Enter' && dbQuickSearch[key]?.trim()) router.push(`/dashboard/research?q=${encodeURIComponent(dbQuickSearch[key])}&source=${key}`); }} placeholder={`Search ${db.name}...`} className="flex-1 text-[10px] border border-slate-150 rounded px-2 py-1 focus:outline-none focus:ring-1 focus:ring-navy-500/20" />
                        <Link href={hasCreds ? `/dashboard/research?source=${key}` : '/dashboard/research'} className="px-2 py-1 bg-slate-100 hover:bg-slate-200 text-slate-500 text-[10px] font-medium rounded transition-colors">Go</Link>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </Widget>

          {/* Time Tracker */}
          <Widget title="Time Tracker" icon="⏱️" headerExtra={<button onClick={() => setShowTimeLog(!showTimeLog)} className="text-[10px] text-navy-700 hover:text-navy-900 font-semibold">{showTimeLog ? 'Timer' : 'Log'}</button>}>
            {showTimeLog ? (
              <div className="divide-y divide-slate-50 max-h-[250px] overflow-auto">
                <div className="px-3 py-2 bg-slate-50 flex justify-between text-[10px] text-slate-500 font-semibold">
                  <span>Today: {formatHoursMinutes(getTodayTotal())}</span>
                  <span>Week: {formatHoursMinutes(getWeekTotal())}</span>
                </div>
                {timeLog.length === 0 ? <p className="p-3 text-xs text-slate-400 text-center">No time entries yet</p> : timeLog.slice(0, 20).map(entry => (
                  <div key={entry.id} className="px-3 py-2">
                    <div className="flex justify-between items-start">
                      <span className="text-xs font-medium text-slate-700 truncate mr-2">{entry.description}</span>
                      <span className="text-[10px] font-mono font-bold text-slate-600 shrink-0">{formatHoursMinutes(entry.durationMs)}</span>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="p-3 space-y-2">
                <div className="text-center">
                  <span className={`text-2xl font-mono font-bold ${timerEntry?.status === 'running' ? 'text-emerald-600' : timerEntry?.status === 'paused' ? 'text-amber-500 animate-pulse' : 'text-slate-800'}`}>{timerDisplay}</span>
                  {timerEntry?.status === 'paused' && <p className="text-[9px] text-amber-500 font-semibold mt-0.5">PAUSED</p>}
                </div>
                {!timerEntry && <input value={timerDesc} onChange={e => setTimerDesc(e.target.value)} onKeyDown={e => e.key === 'Enter' && handleStartTimer()} placeholder="What are you working on?" className="w-full text-xs border border-slate-200 rounded-lg px-2.5 py-1.5 focus:outline-none focus:ring-2 focus:ring-navy-500/20" />}
                {timerEntry?.description && <p className="text-[10px] text-slate-500 text-center truncate">{timerEntry.description}</p>}
                <div className="grid grid-cols-3 gap-1.5">
                  {!timerEntry ? (
                    <button onClick={handleStartTimer} className="col-span-3 py-1.5 bg-emerald-500 hover:bg-emerald-600 text-white text-[10px] font-bold rounded transition-colors">Start</button>
                  ) : timerEntry.status === 'running' ? (
                    <><button onClick={handlePauseTimer} className="col-span-2 py-1.5 bg-amber-500 hover:bg-amber-600 text-white text-[10px] font-bold rounded transition-colors">Pause</button><button onClick={handleStopTimer} className="py-1.5 bg-red-500 hover:bg-red-600 text-white text-[10px] font-bold rounded transition-colors">Stop</button></>
                  ) : timerEntry.status === 'paused' ? (
                    <><button onClick={handleResumeTimer} className="col-span-2 py-1.5 bg-emerald-500 hover:bg-emerald-600 text-white text-[10px] font-bold rounded transition-colors">Resume</button><button onClick={handleStopTimer} className="py-1.5 bg-red-500 hover:bg-red-600 text-white text-[10px] font-bold rounded transition-colors">Stop</button></>
                  ) : null}
                </div>
              </div>
            )}
          </Widget>

          {/* Messaging & Notes */}
          <Widget title="Messages & Notes" icon="💬">
            <div>
              <div className="flex border-b border-slate-100">
                <button onClick={() => setMsgTab('chat')} className={`flex-1 py-1.5 text-[10px] font-bold transition-colors ${msgTab === 'chat' ? 'text-navy-800 border-b-2 border-navy-800' : 'text-slate-400 hover:text-slate-600'}`}>Lex Chat</button>
                <button onClick={() => setMsgTab('notes')} className={`flex-1 py-1.5 text-[10px] font-bold transition-colors ${msgTab === 'notes' ? 'text-navy-800 border-b-2 border-navy-800' : 'text-slate-400 hover:text-slate-600'}`}>Notes</button>
              </div>
              {msgTab === 'chat' ? (
                <div className="p-2 space-y-2 max-h-[150px] overflow-auto">
                  {lexMessages.length === 0 ? (
                    <div className="text-center py-3">
                      <p className="text-xs text-slate-400 mb-1">No conversations yet</p>
                      <button onClick={() => { localStorage.setItem('acc_paralegal_open', 'true'); window.dispatchEvent(new CustomEvent('open-paralegal')); }} className="text-[10px] font-semibold text-navy-700 hover:text-navy-900">Chat with Lex →</button>
                    </div>
                  ) : lexMessages.map((m, i) => (
                    <div key={i} className="text-[11px]">
                      <span className={`font-bold ${m.sender === 'Lex' ? 'text-[#D4AF37]' : 'text-slate-700'}`}>{m.sender}: </span>
                      <span className="text-slate-500">{m.text}</span>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="p-2">
                  <textarea value={noteText} onChange={e => setNoteText(e.target.value)} placeholder="Quick notes — auto-saved..." rows={4} className="w-full text-xs border border-slate-200 rounded-lg p-2 focus:outline-none focus:ring-2 focus:ring-navy-500/20 resize-none" />
                </div>
              )}
            </div>
          </Widget>
        </div>
      </div>
    </div>
  );
}
