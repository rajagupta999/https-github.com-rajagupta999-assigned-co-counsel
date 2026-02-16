"use client";

import { useState, useEffect } from 'react';
import Link from 'next/link';

// ── Court Data ───────────────────────────────────────────────────
interface Court {
  id: string;
  name: string;
  category: string;
  borough?: string;
  address: string;
  phone: string;
  hours: string;
}

const COURTS: Court[] = [
  // NYC Criminal Courts
  { id: 'man-crim', name: 'Manhattan Criminal Court', category: 'NYC Criminal', borough: 'Manhattan', address: '100 Centre St, New York, NY 10013', phone: '(646) 386-4000', hours: '9:00 AM – 5:00 PM' },
  { id: 'bkn-crim', name: 'Brooklyn Criminal Court', category: 'NYC Criminal', borough: 'Brooklyn', address: '120 Schermerhorn St, Brooklyn, NY 11201', phone: '(347) 404-9400', hours: '9:00 AM – 5:00 PM' },
  { id: 'brx-crim', name: 'Bronx Criminal Court', category: 'NYC Criminal', borough: 'Bronx', address: '215 E 161st St, Bronx, NY 10451', phone: '(718) 618-2460', hours: '9:00 AM – 5:00 PM' },
  { id: 'qns-crim', name: 'Queens Criminal Court', category: 'NYC Criminal', borough: 'Queens', address: '125-01 Queens Blvd, Kew Gardens, NY 11415', phone: '(718) 298-0500', hours: '9:00 AM – 5:00 PM' },
  { id: 'si-crim', name: 'Staten Island Criminal Court', category: 'NYC Criminal', borough: 'Staten Island', address: '26 Central Ave, Staten Island, NY 10301', phone: '(718) 675-8500', hours: '9:00 AM – 5:00 PM' },
  // NYC Family Courts
  { id: 'man-fam', name: 'Manhattan Family Court', category: 'NYC Family', borough: 'Manhattan', address: '60 Lafayette St, New York, NY 10013', phone: '(646) 386-5200', hours: '9:00 AM – 5:00 PM' },
  { id: 'bkn-fam', name: 'Brooklyn Family Court', category: 'NYC Family', borough: 'Brooklyn', address: '330 Jay St, Brooklyn, NY 11201', phone: '(347) 401-9600', hours: '9:00 AM – 5:00 PM' },
  { id: 'brx-fam', name: 'Bronx Family Court', category: 'NYC Family', borough: 'Bronx', address: '900 Sheridan Ave, Bronx, NY 10451', phone: '(718) 618-2098', hours: '9:00 AM – 5:00 PM' },
  { id: 'qns-fam', name: 'Queens Family Court', category: 'NYC Family', borough: 'Queens', address: '151-20 Jamaica Ave, Jamaica, NY 11432', phone: '(718) 298-0197', hours: '9:00 AM – 5:00 PM' },
  { id: 'si-fam', name: 'Staten Island Family Court', category: 'NYC Family', borough: 'Staten Island', address: '100 Richmond Terrace, Staten Island, NY 10301', phone: '(718) 675-8800', hours: '9:00 AM – 5:00 PM' },
  // NYC Supreme Courts
  { id: 'ny-sup', name: 'NY County Supreme Court', category: 'Supreme Court', borough: 'Manhattan', address: '60 Centre St, New York, NY 10007', phone: '(646) 386-3600', hours: '9:00 AM – 5:00 PM' },
  { id: 'kings-sup', name: 'Kings County Supreme Court', category: 'Supreme Court', borough: 'Brooklyn', address: '360 Adams St, Brooklyn, NY 11201', phone: '(347) 296-1076', hours: '9:00 AM – 5:00 PM' },
  { id: 'brx-sup', name: 'Bronx County Supreme Court', category: 'Supreme Court', borough: 'Bronx', address: '851 Grand Concourse, Bronx, NY 10451', phone: '(718) 618-1300', hours: '9:00 AM – 5:00 PM' },
  { id: 'qns-sup', name: 'Queens County Supreme Court', category: 'Supreme Court', borough: 'Queens', address: '88-11 Sutphin Blvd, Jamaica, NY 11435', phone: '(718) 298-1000', hours: '9:00 AM – 5:00 PM' },
  { id: 'rich-sup', name: 'Richmond County Supreme Court', category: 'Supreme Court', borough: 'Staten Island', address: '18 Richmond Terrace, Staten Island, NY 10301', phone: '(718) 675-8700', hours: '9:00 AM – 5:00 PM' },
  // Suburban County Courts
  { id: 'nassau', name: 'Nassau County Court', category: 'County Court', address: '262 Old Country Rd, Mineola, NY 11501', phone: '(516) 493-3700', hours: '9:00 AM – 5:00 PM' },
  { id: 'suffolk', name: 'Suffolk County Court', category: 'County Court', address: '1 Court St, Riverhead, NY 11901', phone: '(631) 852-2333', hours: '9:00 AM – 5:00 PM' },
  { id: 'westchester', name: 'Westchester County Court', category: 'County Court', address: '111 Dr Martin Luther King Jr Blvd, White Plains, NY 10601', phone: '(914) 824-5300', hours: '9:00 AM – 5:00 PM' },
  { id: 'rockland', name: 'Rockland County Court', category: 'County Court', address: '1 South Main St, New City, NY 10956', phone: '(845) 483-8310', hours: '9:00 AM – 5:00 PM' },
  { id: 'orange', name: 'Orange County Court', category: 'County Court', address: '285 Main St, Goshen, NY 10924', phone: '(845) 291-3100', hours: '9:00 AM – 5:00 PM' },
  { id: 'dutchess', name: 'Dutchess County Court', category: 'County Court', address: '10 Market St, Poughkeepsie, NY 12601', phone: '(845) 431-1742', hours: '9:00 AM – 5:00 PM' },
  { id: 'putnam', name: 'Putnam County Court', category: 'County Court', address: '20 County Center, Carmel, NY 10512', phone: '(845) 208-7830', hours: '9:00 AM – 5:00 PM' },
  { id: 'erie', name: 'Erie County Court', category: 'County Court', address: '25 Delaware Ave, Buffalo, NY 14202', phone: '(716) 845-9301', hours: '9:00 AM – 5:00 PM' },
  { id: 'albany', name: 'Albany County Court', category: 'County Court', address: '6 Lodge St, Albany, NY 12207', phone: '(518) 285-8777', hours: '9:00 AM – 5:00 PM' },
  { id: 'monroe', name: 'Monroe County Court', category: 'County Court', address: '99 Exchange Blvd, Rochester, NY 14614', phone: '(585) 371-3758', hours: '9:00 AM – 5:00 PM' },
  // Appellate
  { id: 'ad1', name: 'Appellate Division, 1st Dept', category: 'Appellate', address: '27 Madison Ave, New York, NY 10010', phone: '(212) 340-0400', hours: '9:00 AM – 5:00 PM' },
  { id: 'ad2', name: 'Appellate Division, 2nd Dept', category: 'Appellate', address: '45 Monroe Pl, Brooklyn, NY 11201', phone: '(718) 722-6300', hours: '9:00 AM – 5:00 PM' },
  { id: 'ad3', name: 'Appellate Division, 3rd Dept', category: 'Appellate', address: '1 Robert S. Taft Ave, Albany, NY 12223', phone: '(518) 471-4777', hours: '9:00 AM – 5:00 PM' },
  { id: 'ad4', name: 'Appellate Division, 4th Dept', category: 'Appellate', address: '50 East Ave, Rochester, NY 14604', phone: '(585) 530-3100', hours: '9:00 AM – 5:00 PM' },
  { id: 'coa', name: 'NY Court of Appeals', category: 'Appellate', address: '20 Eagle St, Albany, NY 12207', phone: '(518) 455-7700', hours: '9:00 AM – 5:00 PM' },
  // Nassau/Suffolk Family
  { id: 'nassau-fam', name: 'Nassau County Family Court', category: 'Suburban Family', address: '1200 Old Country Rd, Westbury, NY 11590', phone: '(516) 493-4000', hours: '9:00 AM – 5:00 PM' },
  { id: 'suffolk-fam', name: 'Suffolk County Family Court', category: 'Suburban Family', address: '400 Carleton Ave, Central Islip, NY 11722', phone: '(631) 853-4375', hours: '9:00 AM – 5:00 PM' },
  { id: 'westchester-fam', name: 'Westchester County Family Court', category: 'Suburban Family', address: '131 Warburton Ave, Yonkers, NY 10701', phone: '(914) 824-5500', hours: '9:00 AM – 5:00 PM' },
];

const CATEGORIES = ['NYC Criminal', 'NYC Family', 'Supreme Court', 'County Court', 'Appellate', 'Suburban Family'];

interface CourtHoliday {
  date: string; // YYYY-MM-DD
  name: string;
  observed?: string;
}

const HOLIDAYS_2026: CourtHoliday[] = [
  { date: '2026-01-01', name: "New Year's Day" },
  { date: '2026-01-19', name: 'Martin Luther King Jr. Day' },
  { date: '2026-02-12', name: "Lincoln's Birthday" },
  { date: '2026-02-16', name: "Presidents' Day" },
  { date: '2026-05-25', name: 'Memorial Day' },
  { date: '2026-06-19', name: 'Juneteenth' },
  { date: '2026-07-03', name: 'Independence Day', observed: 'Observed (July 4 is Saturday)' },
  { date: '2026-09-07', name: 'Labor Day' },
  { date: '2026-10-12', name: 'Columbus Day' },
  { date: '2026-11-03', name: 'Election Day' },
  { date: '2026-11-11', name: 'Veterans Day' },
  { date: '2026-11-26', name: 'Thanksgiving Day' },
  { date: '2026-12-25', name: 'Christmas Day' },
];

function getCourtStatus(court: Court): { status: 'open' | 'closed' | 'holiday'; label: string; color: string } {
  const now = new Date();
  const todayStr = now.toISOString().split('T')[0];
  const day = now.getDay();
  const holiday = HOLIDAYS_2026.find(h => h.date === todayStr);

  if (holiday) return { status: 'holiday', label: `Holiday — ${holiday.name}`, color: 'bg-amber-500' };
  if (day === 0 || day === 6) return { status: 'closed', label: 'Closed — Weekend', color: 'bg-red-500' };
  const hour = now.getHours();
  if (hour >= 9 && hour < 17) return { status: 'open', label: 'Open', color: 'bg-emerald-500' };
  return { status: 'closed', label: 'Closed — After Hours', color: 'bg-slate-500' };
}

function getNextHoliday(): CourtHoliday | null {
  const now = new Date();
  const todayStr = now.toISOString().split('T')[0];
  return HOLIDAYS_2026.find(h => h.date >= todayStr) || null;
}

function getUpcomingHolidays(count: number): CourtHoliday[] {
  const now = new Date();
  const todayStr = now.toISOString().split('T')[0];
  return HOLIDAYS_2026.filter(h => h.date >= todayStr).slice(0, count);
}

function formatDate(dateStr: string): string {
  const d = new Date(dateStr + 'T12:00:00');
  return d.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' });
}

function daysUntil(dateStr: string): number {
  const now = new Date();
  now.setHours(0, 0, 0, 0);
  const target = new Date(dateStr + 'T12:00:00');
  return Math.ceil((target.getTime() - now.getTime()) / 86400000);
}

// ── Main Page ────────────────────────────────────────────────────
export default function CourtSchedulesPage() {
  const [myCourts, setMyCourts] = useState<string[]>([]);
  const [showPicker, setShowPicker] = useState(false);
  const [pickerCategory, setPickerCategory] = useState<string>('NYC Criminal');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCourt, setSelectedCourt] = useState<Court | null>(null);
  const [showAllHolidays, setShowAllHolidays] = useState(false);

  useEffect(() => {
    try {
      const saved = localStorage.getItem('acc_my_courts');
      if (saved) setMyCourts(JSON.parse(saved));
    } catch {}
  }, []);

  const saveCourts = (courts: string[]) => {
    setMyCourts(courts);
    localStorage.setItem('acc_my_courts', JSON.stringify(courts));
  };

  const toggleCourt = (id: string) => {
    saveCourts(myCourts.includes(id) ? myCourts.filter(c => c !== id) : [...myCourts, id]);
  };

  const myCourtData = COURTS.filter(c => myCourts.includes(c.id));
  const nextHoliday = getNextHoliday();
  const upcomingHolidays = getUpcomingHolidays(showAllHolidays ? 13 : 5);

  const filteredCourts = searchQuery
    ? COURTS.filter(c => c.name.toLowerCase().includes(searchQuery.toLowerCase()) || c.category.toLowerCase().includes(searchQuery.toLowerCase()) || (c.borough && c.borough.toLowerCase().includes(searchQuery.toLowerCase())))
    : COURTS.filter(c => c.category === pickerCategory);

  return (
    <div className="p-4 lg:p-6 max-w-7xl mx-auto space-y-6 pb-24">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-bold text-slate-900 flex items-center gap-2">🏛️ Court Schedules</h1>
          <p className="text-sm text-slate-500">NYS court status, hours, closures & holidays</p>
        </div>
        <div className="flex gap-2">
          <a href="https://www.nycourts.gov" target="_blank" rel="noopener noreferrer" className="text-xs bg-slate-100 hover:bg-slate-200 text-slate-600 px-3 py-2 rounded-lg font-medium transition-colors">
            NYCourts.gov ↗
          </a>
          <a href="https://iapps.courts.state.ny.us/webcivil/FCASMain" target="_blank" rel="noopener noreferrer" className="text-xs bg-slate-100 hover:bg-slate-200 text-slate-600 px-3 py-2 rounded-lg font-medium transition-colors">
            eCourts ↗
          </a>
        </div>
      </div>

      {/* Next Holiday Alert */}
      {nextHoliday && daysUntil(nextHoliday.date) <= 14 && (
        <div className="bg-amber-50 border border-amber-200 rounded-xl px-4 py-3 flex items-center gap-3">
          <span className="text-xl">⚠️</span>
          <div>
            <p className="text-sm font-bold text-amber-800">
              Upcoming Court Closure: {nextHoliday.name}
            </p>
            <p className="text-xs text-amber-600">
              {formatDate(nextHoliday.date)} — All NYS courts will be closed.
              {nextHoliday.observed && ` ${nextHoliday.observed}.`}
              {' '}({daysUntil(nextHoliday.date) === 0 ? 'Today' : `${daysUntil(nextHoliday.date)} day${daysUntil(nextHoliday.date) > 1 ? 's' : ''} away`})
            </p>
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* ── LEFT: My Courts + Court Details ── */}
        <div className="lg:col-span-2 space-y-6">
          {/* My Courts */}
          <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
            <div className="flex items-center justify-between px-4 py-3 border-b border-slate-100 bg-gradient-to-r from-slate-50 to-white">
              <h2 className="text-sm font-bold text-slate-700 flex items-center gap-2">
                ⭐ My Courts
                <span className="text-[10px] bg-navy-100 text-navy-700 px-1.5 py-0.5 rounded-full font-bold">{myCourts.length}</span>
              </h2>
              <button onClick={() => setShowPicker(!showPicker)} className="text-xs font-semibold text-navy-700 hover:text-navy-900 transition-colors">
                {showPicker ? 'Done' : '+ Add Courts'}
              </button>
            </div>

            {showPicker ? (
              <div className="p-4 space-y-3">
                <input value={searchQuery} onChange={e => setSearchQuery(e.target.value)} placeholder="Search courts..." className="w-full text-sm border border-slate-200 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-navy-500/20" />
                {!searchQuery && (
                  <div className="flex gap-1.5 flex-wrap">
                    {CATEGORIES.map(cat => (
                      <button key={cat} onClick={() => setPickerCategory(cat)} className={`text-[11px] px-3 py-1.5 rounded-lg font-medium transition-colors ${pickerCategory === cat ? 'bg-navy-900 text-white' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'}`}>{cat}</button>
                    ))}
                  </div>
                )}
                <div className="max-h-[300px] overflow-auto space-y-1">
                  {filteredCourts.map(court => {
                    const isSelected = myCourts.includes(court.id);
                    return (
                      <button key={court.id} onClick={() => toggleCourt(court.id)} className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-left transition-all ${isSelected ? 'bg-navy-50 border border-navy-200' : 'bg-white border border-slate-100 hover:bg-slate-50'}`}>
                        <span className={`w-5 h-5 rounded flex items-center justify-center text-xs font-bold border ${isSelected ? 'bg-navy-900 text-white border-navy-900' : 'bg-white text-slate-300 border-slate-300'}`}>
                          {isSelected ? '✓' : ''}
                        </span>
                        <div className="min-w-0 flex-1">
                          <p className={`text-xs font-semibold ${isSelected ? 'text-navy-800' : 'text-slate-700'}`}>{court.name}</p>
                          <p className="text-[10px] text-slate-400">{court.address}</p>
                        </div>
                        <span className="text-[9px] font-bold text-slate-400 bg-slate-50 px-1.5 py-0.5 rounded shrink-0">{court.category}</span>
                      </button>
                    );
                  })}
                </div>
              </div>
            ) : myCourtData.length === 0 ? (
              <div className="p-8 text-center">
                <span className="text-4xl block mb-3">🏛️</span>
                <p className="text-sm text-slate-500 mb-2">No courts selected yet</p>
                <p className="text-xs text-slate-400 mb-4">Choose the courts you practice in to see their status, hours, and closure alerts.</p>
                <button onClick={() => setShowPicker(true)} className="bg-navy-900 hover:bg-navy-800 text-white text-xs font-bold px-4 py-2 rounded-lg transition-colors">+ Add Your Courts</button>
              </div>
            ) : (
              <div className="divide-y divide-slate-50">
                {myCourtData.map(court => {
                  const status = getCourtStatus(court);
                  return (
                    <button key={court.id} onClick={() => setSelectedCourt(selectedCourt?.id === court.id ? null : court)} className="w-full flex items-center gap-3 px-4 py-3 hover:bg-slate-50 transition-colors text-left">
                      <div className={`w-2.5 h-2.5 rounded-full ${status.color} shrink-0`}></div>
                      <div className="flex-1 min-w-0">
                        <p className="text-xs font-bold text-slate-800 truncate">{court.name}</p>
                        <p className="text-[10px] text-slate-400">{court.hours}</p>
                      </div>
                      <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${status.status === 'open' ? 'bg-emerald-100 text-emerald-700' : status.status === 'holiday' ? 'bg-amber-100 text-amber-700' : 'bg-slate-100 text-slate-500'}`}>
                        {status.label}
                      </span>
                    </button>
                  );
                })}
              </div>
            )}
          </div>

          {/* Selected Court Detail */}
          {selectedCourt && (
            <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-5">
              <div className="flex items-start justify-between mb-4">
                <div>
                  <h3 className="text-base font-bold text-slate-900">{selectedCourt.name}</h3>
                  <p className="text-xs text-slate-400 mt-0.5">{selectedCourt.category}{selectedCourt.borough ? ` • ${selectedCourt.borough}` : ''}</p>
                </div>
                <button onClick={() => setSelectedCourt(null)} className="text-slate-300 hover:text-slate-500 p-1">
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2"><path d="M6 18L18 6M6 6l12 12" /></svg>
                </button>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="bg-slate-50 rounded-lg p-3">
                  <p className="text-[10px] text-slate-400 font-bold uppercase mb-1">📍 Address</p>
                  <p className="text-xs text-slate-700">{selectedCourt.address}</p>
                  <a href={`https://maps.google.com/?q=${encodeURIComponent(selectedCourt.address)}`} target="_blank" rel="noopener noreferrer" className="text-[10px] text-navy-700 font-semibold mt-1 inline-block hover:text-navy-900">Open in Maps ↗</a>
                </div>
                <div className="bg-slate-50 rounded-lg p-3">
                  <p className="text-[10px] text-slate-400 font-bold uppercase mb-1">📞 Phone</p>
                  <p className="text-xs text-slate-700">{selectedCourt.phone}</p>
                  <a href={`tel:${selectedCourt.phone.replace(/[^0-9]/g, '')}`} className="text-[10px] text-navy-700 font-semibold mt-1 inline-block hover:text-navy-900">Call ↗</a>
                </div>
                <div className="bg-slate-50 rounded-lg p-3">
                  <p className="text-[10px] text-slate-400 font-bold uppercase mb-1">🕐 Hours</p>
                  <p className="text-xs text-slate-700">{selectedCourt.hours}</p>
                  <p className="text-[10px] text-slate-400 mt-1">Mon – Fri (excl. holidays)</p>
                </div>
              </div>
              <div className="mt-4 flex gap-2">
                <a href="https://www.nycourts.gov" target="_blank" rel="noopener noreferrer" className="text-xs bg-navy-900 hover:bg-navy-800 text-white px-3 py-2 rounded-lg font-semibold transition-colors">Check Live Status ↗</a>
                <a href="https://iapps.courts.state.ny.us/webcivil/FCASMain" target="_blank" rel="noopener noreferrer" className="text-xs bg-slate-100 hover:bg-slate-200 text-slate-600 px-3 py-2 rounded-lg font-semibold transition-colors">eCourts Case Search ↗</a>
              </div>
            </div>
          )}

          {/* All Courts Browse */}
          <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
            <div className="px-4 py-3 border-b border-slate-100 bg-gradient-to-r from-slate-50 to-white">
              <h2 className="text-sm font-bold text-slate-700">📋 All NYS Courts</h2>
            </div>
            <div className="p-3">
              <div className="flex gap-1.5 flex-wrap mb-3">
                {CATEGORIES.map(cat => (
                  <button key={cat} onClick={() => { setPickerCategory(cat); setSearchQuery(''); }} className={`text-[11px] px-3 py-1.5 rounded-lg font-medium transition-colors ${pickerCategory === cat && !searchQuery ? 'bg-navy-900 text-white' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'}`}>{cat} ({COURTS.filter(c => c.category === cat).length})</button>
                ))}
              </div>
              <div className="max-h-[400px] overflow-auto divide-y divide-slate-50">
                {COURTS.filter(c => searchQuery ? c.name.toLowerCase().includes(searchQuery.toLowerCase()) : c.category === pickerCategory).map(court => {
                  const status = getCourtStatus(court);
                  const isFollowed = myCourts.includes(court.id);
                  return (
                    <div key={court.id} className="flex items-center gap-3 px-3 py-2.5 hover:bg-slate-50 transition-colors">
                      <div className={`w-2 h-2 rounded-full ${status.color} shrink-0`}></div>
                      <div className="flex-1 min-w-0 cursor-pointer" onClick={() => setSelectedCourt(court)}>
                        <p className="text-xs font-semibold text-slate-800 truncate">{court.name}</p>
                        <p className="text-[10px] text-slate-400 truncate">{court.address}</p>
                      </div>
                      <button onClick={() => toggleCourt(court.id)} className={`text-[10px] font-bold px-2 py-1 rounded-lg transition-colors shrink-0 ${isFollowed ? 'bg-navy-100 text-navy-700' : 'bg-slate-50 text-slate-400 hover:bg-slate-100'}`}>
                        {isFollowed ? '★ Following' : '+ Follow'}
                      </button>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </div>

        {/* ── RIGHT: Holidays & Quick Info ── */}
        <div className="space-y-6">
          {/* 2026 Court Holiday Calendar */}
          <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
            <div className="px-4 py-3 border-b border-slate-100 bg-gradient-to-r from-amber-50 to-white">
              <h2 className="text-sm font-bold text-slate-700">📅 2026 Court Holidays</h2>
              <p className="text-[10px] text-slate-400">All NYS courts closed</p>
            </div>
            <div className="divide-y divide-slate-50">
              {upcomingHolidays.map((h, i) => {
                const days = daysUntil(h.date);
                const isPast = days < 0;
                return (
                  <div key={i} className={`flex items-center justify-between px-4 py-2.5 ${isPast ? 'opacity-40' : ''}`}>
                    <div>
                      <p className="text-xs font-semibold text-slate-800">{h.name}</p>
                      <p className="text-[10px] text-slate-400">{formatDate(h.date)}{h.observed ? ` • ${h.observed}` : ''}</p>
                    </div>
                    {days === 0 ? (
                      <span className="text-[10px] font-bold text-red-600 bg-red-50 px-2 py-0.5 rounded-full">TODAY</span>
                    ) : days > 0 ? (
                      <span className="text-[10px] font-bold text-slate-400">{days}d</span>
                    ) : null}
                  </div>
                );
              })}
            </div>
            <div className="px-4 py-2 border-t border-slate-100">
              <button onClick={() => setShowAllHolidays(!showAllHolidays)} className="text-[10px] font-semibold text-navy-700 hover:text-navy-900 transition-colors">
                {showAllHolidays ? 'Show fewer' : `Show all ${HOLIDAYS_2026.length} holidays`}
              </button>
            </div>
          </div>

          {/* Quick Links */}
          <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
            <div className="px-4 py-3 border-b border-slate-100 bg-gradient-to-r from-slate-50 to-white">
              <h2 className="text-sm font-bold text-slate-700">🔗 Quick Links</h2>
            </div>
            <div className="p-3 space-y-1.5">
              {[
                { name: 'NYS Courts Official', url: 'https://www.nycourts.gov', icon: '🏛️' },
                { name: 'eCourts Case Search', url: 'https://iapps.courts.state.ny.us/webcivil/FCASMain', icon: '🔍' },
                { name: 'NYSCEF E-Filing', url: 'https://iapps.courts.state.ny.us/nyscef/HomePage', icon: '📄' },
                { name: 'WebCrims (Criminal)', url: 'https://iapps.courts.state.ny.us/webcrim_html/Login.html', icon: '⚖️' },
                { name: 'Attorney Registration', url: 'https://iapps.courts.state.ny.us/attorneyservices', icon: '📋' },
                { name: 'Court Closures & Alerts', url: 'https://www.nycourts.gov/notice-to-the-bar.shtml', icon: '⚠️' },
                { name: 'OCA Court Directory', url: 'https://www.nycourts.gov/courts/', icon: '📖' },
                { name: 'NYS ILS Standards', url: 'https://www.ils.ny.gov/', icon: '🛡️' },
              ].map((link, i) => (
                <a key={i} href={link.url} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2.5 px-3 py-2 rounded-lg hover:bg-slate-50 transition-colors group">
                  <span className="text-sm">{link.icon}</span>
                  <span className="text-xs font-medium text-slate-700 group-hover:text-navy-800">{link.name}</span>
                  <span className="text-[10px] text-slate-300 ml-auto">↗</span>
                </a>
              ))}
            </div>
          </div>

          {/* Status Legend */}
          <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-4">
            <h3 className="text-xs font-bold text-slate-700 mb-2">Status Legend</h3>
            <div className="space-y-1.5">
              {[
                { color: 'bg-emerald-500', label: 'Open', desc: 'Court is currently in session' },
                { color: 'bg-amber-500', label: 'Holiday', desc: 'Closed for court holiday' },
                { color: 'bg-red-500', label: 'Closed', desc: 'Closed (weekend)' },
                { color: 'bg-slate-500', label: 'After Hours', desc: 'Closed for the day' },
              ].map((s, i) => (
                <div key={i} className="flex items-center gap-2">
                  <div className={`w-2.5 h-2.5 rounded-full ${s.color}`}></div>
                  <span className="text-[11px] text-slate-700 font-medium">{s.label}</span>
                  <span className="text-[10px] text-slate-400">— {s.desc}</span>
                </div>
              ))}
            </div>
            <p className="text-[10px] text-slate-400 mt-3">For real-time closures (weather, emergencies), check <a href="https://www.nycourts.gov/notice-to-the-bar.shtml" target="_blank" rel="noopener noreferrer" className="text-navy-700 font-semibold hover:text-navy-900">nycourts.gov alerts</a>.</p>
          </div>
        </div>
      </div>
    </div>
  );
}
