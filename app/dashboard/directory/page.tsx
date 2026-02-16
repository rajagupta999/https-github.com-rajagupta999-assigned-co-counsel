"use client";

import { useState, useMemo } from 'react';
import Link from 'next/link';

const mockAttorneys = [
  { id: 1, name: "Sarah Mitchell", initials: "SM", location: "Brooklyn, NY", areas: ["Criminal Defense", "Family Law", "Immigration"], contributions: 47, endorsements: 12, cases: 156, reputation: 94, available: true, joined: "2024-01", latestWiki: "Bail Reform Act — NY Practice Guide" },
  { id: 2, name: "David Chen", initials: "DC", location: "San Francisco, CA", areas: ["Immigration", "Civil Rights", "Employment"], contributions: 63, endorsements: 18, cases: 203, reputation: 97, available: true, joined: "2023-06", latestWiki: "USCIS Processing Time Tracker Template" },
  { id: 3, name: "Maria Rodriguez", initials: "MR", location: "Miami, FL", areas: ["Family Law", "Estate Planning", "Real Estate"], contributions: 31, endorsements: 9, cases: 89, reputation: 88, available: false, joined: "2024-05", latestWiki: "Florida Homestead Exemption Guide" },
  { id: 4, name: "James Thompson", initials: "JT", location: "Chicago, IL", areas: ["Criminal Defense", "DUI", "Drug Offenses"], contributions: 55, endorsements: 15, cases: 278, reputation: 96, available: true, joined: "2023-09", latestWiki: "Illinois Sentencing Guidelines Cheat Sheet" },
  { id: 5, name: "Priya Patel", initials: "PP", location: "Houston, TX", areas: ["Immigration", "Family Law", "Asylum"], contributions: 42, endorsements: 11, cases: 134, reputation: 91, available: true, joined: "2024-02", latestWiki: "Asylum Interview Preparation Checklist" },
  { id: 6, name: "Robert Kim", initials: "RK", location: "Los Angeles, CA", areas: ["Entertainment", "IP", "Contract Law"], contributions: 28, endorsements: 7, cases: 95, reputation: 85, available: false, joined: "2024-08", latestWiki: "Music Licensing Basics for Attorneys" },
  { id: 7, name: "Angela Washington", initials: "AW", location: "Atlanta, GA", areas: ["Criminal Defense", "Juvenile", "Civil Rights"], contributions: 38, endorsements: 14, cases: 167, reputation: 93, available: true, joined: "2024-01", latestWiki: "Juvenile Adjudication vs. Adult Prosecution" },
  { id: 8, name: "Michael O'Brien", initials: "MO", location: "Boston, MA", areas: ["Estate Planning", "Elder Law", "Probate"], contributions: 51, endorsements: 16, cases: 142, reputation: 95, available: true, joined: "2023-11", latestWiki: "Massachusetts Probate Court Filing Guide" },
];

const allAreas = Array.from(new Set(mockAttorneys.flatMap(a => a.areas))).sort();
const allStates = Array.from(new Set(mockAttorneys.map(a => a.location.split(", ")[1]))).sort();

const topContributors = [...mockAttorneys].sort((a, b) => b.contributions - a.contributions).slice(0, 3);

export default function DirectoryPage() {
  const [search, setSearch] = useState("");
  const [areaFilter, setAreaFilter] = useState("");
  const [stateFilter, setStateFilter] = useState("");
  const [referralsOnly, setReferralsOnly] = useState(false);
  const [topOnly, setTopOnly] = useState(false);
  const [sortBy, setSortBy] = useState<"reputation" | "contributions" | "newest">("reputation");

  const filtered = useMemo(() => {
    let results = mockAttorneys.filter(a => {
      const q = search.toLowerCase();
      if (q && !a.name.toLowerCase().includes(q) && !a.areas.some(ar => ar.toLowerCase().includes(q)) && !a.location.toLowerCase().includes(q)) return false;
      if (areaFilter && !a.areas.includes(areaFilter)) return false;
      if (stateFilter && !a.location.includes(stateFilter)) return false;
      if (referralsOnly && !a.available) return false;
      if (topOnly && a.contributions < 40) return false;
      return true;
    });
    results.sort((a, b) => {
      if (sortBy === "reputation") return b.reputation - a.reputation;
      if (sortBy === "contributions") return b.contributions - a.contributions;
      return b.joined > a.joined ? 1 : -1;
    });
    return results;
  }, [search, areaFilter, stateFilter, referralsOnly, topOnly, sortBy]);

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-white">Attorney Directory</h1>
        <p className="text-sm text-gray-400 mt-1">Find attorneys, send referrals, and connect with co-counsel</p>
      </div>

      {/* Featured: Top Contributors */}
      <div className="bg-navy-800 rounded-xl border border-navy-700 p-5">
        <h2 className="text-sm font-bold text-gold-500 mb-4">🏆 Top Contributors This Month</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {topContributors.map((a, i) => (
            <div key={a.id} className="flex items-start gap-3 bg-navy-900/50 rounded-lg p-3 border border-navy-700">
              <div className="relative">
                <div className="w-10 h-10 rounded-full bg-gold-500 flex items-center justify-center text-navy-900 text-sm font-bold">{a.initials}</div>
                <span className="absolute -top-1 -right-1 w-5 h-5 rounded-full bg-navy-800 border border-gold-500 text-gold-500 text-[10px] font-bold flex items-center justify-center">
                  {i + 1}
                </span>
              </div>
              <div className="min-w-0">
                <p className="text-sm font-semibold text-white truncate">{a.name}</p>
                <p className="text-[11px] text-gray-500">{a.contributions} contributions</p>
                <p className="text-[11px] text-gray-400 mt-1 truncate">Latest: {a.latestWiki}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Search & Filters */}
      <div className="bg-navy-800 rounded-xl border border-navy-700 p-4 space-y-3">
        <div className="relative">
          <svg className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>
          <input
            type="text"
            placeholder="Search by name, practice area, or location..."
            value={search}
            onChange={e => setSearch(e.target.value)}
            className="w-full bg-navy-900 border border-navy-700 rounded-lg pl-10 pr-4 py-2.5 text-sm text-gray-200 placeholder-gray-500 focus:ring-2 focus:ring-gold-500/30 focus:border-gold-500/50 outline-none"
          />
        </div>
        <div className="flex flex-wrap gap-3 items-center">
          <select value={areaFilter} onChange={e => setAreaFilter(e.target.value)} className="bg-navy-900 border border-navy-700 text-gray-300 text-xs rounded-lg px-3 py-2 outline-none focus:border-gold-500/50">
            <option value="">All Practice Areas</option>
            {allAreas.map(a => <option key={a} value={a}>{a}</option>)}
          </select>
          <select value={stateFilter} onChange={e => setStateFilter(e.target.value)} className="bg-navy-900 border border-navy-700 text-gray-300 text-xs rounded-lg px-3 py-2 outline-none focus:border-gold-500/50">
            <option value="">All States</option>
            {allStates.map(s => <option key={s} value={s}>{s}</option>)}
          </select>
          <label className="flex items-center gap-2 text-xs text-gray-400 cursor-pointer">
            <input type="checkbox" checked={referralsOnly} onChange={e => setReferralsOnly(e.target.checked)} className="rounded border-navy-600 bg-navy-900 text-gold-500 focus:ring-gold-500/30" />
            Available for Referrals
          </label>
          <label className="flex items-center gap-2 text-xs text-gray-400 cursor-pointer">
            <input type="checkbox" checked={topOnly} onChange={e => setTopOnly(e.target.checked)} className="rounded border-navy-600 bg-navy-900 text-gold-500 focus:ring-gold-500/30" />
            Top Contributors
          </label>
          <select value={sortBy} onChange={e => setSortBy(e.target.value as any)} className="bg-navy-900 border border-navy-700 text-gray-300 text-xs rounded-lg px-3 py-2 outline-none focus:border-gold-500/50 ml-auto">
            <option value="reputation">Sort: Reputation</option>
            <option value="contributions">Sort: Contributions</option>
            <option value="newest">Sort: Newest</option>
          </select>
        </div>
      </div>

      {/* Results */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {filtered.map(a => (
          <div key={a.id} className="bg-navy-800 rounded-xl border border-navy-700 p-5 hover:border-navy-600 transition-colors">
            <div className="flex items-start gap-4">
              <div className="w-12 h-12 rounded-full bg-gold-500/80 flex items-center justify-center text-navy-900 text-lg font-bold shrink-0">{a.initials}</div>
              <div className="flex-1 min-w-0">
                <div className="flex items-start justify-between">
                  <div>
                    <h3 className="text-sm font-bold text-white">{a.name}</h3>
                    <p className="text-[11px] text-gray-500 mt-0.5">{a.location}</p>
                  </div>
                  {a.available && (
                    <span className="px-2 py-0.5 bg-emerald-900/40 text-emerald-400 text-[10px] font-semibold rounded-full border border-emerald-800/50 shrink-0">Available</span>
                  )}
                </div>
                <div className="flex flex-wrap gap-1 mt-2">
                  {a.areas.slice(0, 3).map(ar => (
                    <span key={ar} className="px-2 py-0.5 bg-navy-700 text-gray-300 text-[10px] font-medium rounded-md">{ar}</span>
                  ))}
                </div>
                <div className="flex items-center gap-4 mt-3 text-[11px] text-gray-500">
                  <span>{a.contributions} contributions</span>
                  <span>{a.endorsements} endorsements</span>
                  <span>{a.cases} cases</span>
                </div>
                <div className="flex gap-2 mt-3">
                  <Link href="/dashboard/profile" className="px-3 py-1.5 bg-navy-700 text-gray-300 rounded-lg text-[11px] font-medium hover:bg-navy-600 transition-colors border border-navy-600">
                    View Profile
                  </Link>
                  <button className="px-3 py-1.5 bg-gold-500/10 text-gold-500 rounded-lg text-[11px] font-medium hover:bg-gold-500/20 transition-colors border border-gold-500/20">
                    Refer Case
                  </button>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
      {filtered.length === 0 && (
        <div className="text-center py-12 text-gray-500 text-sm">No attorneys match your filters.</div>
      )}
    </div>
  );
}
