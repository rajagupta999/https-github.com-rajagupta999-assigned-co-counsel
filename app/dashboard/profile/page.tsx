"use client";

import { useState } from 'react';

const mockProfile = {
  name: "Sarah Mitchell",
  barNumber: "NY-2018-04521",
  jurisdictions: ["New York", "New Jersey", "Connecticut"],
  practiceAreas: ["Criminal Defense", "Family Law", "Immigration"],
  location: "Brooklyn, NY",
  availableForReferrals: true,
  bio: "Experienced assigned counsel attorney with a passion for criminal defense and family law. Former public defender with the Legal Aid Society. I believe every person deserves zealous representation regardless of their ability to pay. Active contributor to the legal community through mentorship, wiki contributions, and pro bono work.",
  stats: {
    wikiContributions: 47,
    peerEndorsements: 12,
    casesHandled: 156,
    yearsOnPlatform: 2,
    reputationScore: 94,
  },
};

const mockWikiEntries = [
  { title: "Bail Reform Act — NY Practice Guide", date: "Feb 10, 2026", upvotes: 34 },
  { title: "Suppression Motions: Fourth Amendment Checklist", date: "Jan 28, 2026", upvotes: 51 },
  { title: "Family Court Custody Factors — 2nd Dept", date: "Jan 15, 2026", upvotes: 28 },
  { title: "Immigration Consequences of Criminal Pleas", date: "Dec 20, 2025", upvotes: 42 },
  { title: "Assigned Counsel Voucher Best Practices", date: "Dec 5, 2025", upvotes: 19 },
];

const endorsements = [
  { area: "Criminal Defense", count: 8 },
  { area: "Family Law", count: 3 },
  { area: "Immigration", count: 1 },
];

export default function ProfilePage() {
  const [available, setAvailable] = useState(mockProfile.availableForReferrals);

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Profile Header */}
      <div className="bg-navy-800 rounded-xl border border-navy-700 p-6">
        <div className="flex flex-col sm:flex-row gap-5">
          <div className="w-20 h-20 rounded-full bg-gold-500 flex items-center justify-center text-navy-900 text-3xl font-bold shrink-0">
            SM
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-3">
              <div>
                <h1 className="text-xl font-bold text-white">{mockProfile.name}</h1>
                <p className="text-sm text-gray-400 mt-0.5">Bar #{mockProfile.barNumber}</p>
                <p className="text-sm text-gray-400 flex items-center gap-1 mt-1">
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0118 0z"/><circle cx="12" cy="10" r="3"/></svg>
                  {mockProfile.location}
                </p>
              </div>
              <button className="px-4 py-2 bg-navy-700 text-gray-300 rounded-lg text-sm font-medium hover:bg-navy-600 transition-colors border border-navy-600 self-start">
                Edit Profile
              </button>
            </div>

            <div className="flex flex-wrap gap-1.5 mt-3">
              {mockProfile.jurisdictions.map(j => (
                <span key={j} className="px-2 py-0.5 bg-blue-900/40 text-blue-300 text-[11px] font-medium rounded-md border border-blue-800/50">{j}</span>
              ))}
            </div>
            <div className="flex flex-wrap gap-1.5 mt-2">
              {mockProfile.practiceAreas.map(a => (
                <span key={a} className="px-2.5 py-1 bg-gold-500/10 text-gold-500 text-xs font-semibold rounded-full border border-gold-500/20">{a}</span>
              ))}
            </div>

            <div className="flex items-center gap-3 mt-4">
              <button
                onClick={() => setAvailable(!available)}
                className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${available ? 'bg-emerald-600' : 'bg-navy-600'}`}
              >
                <span className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${available ? 'translate-x-6' : 'translate-x-1'}`} />
              </button>
              <span className={`text-sm font-medium ${available ? 'text-emerald-400' : 'text-gray-500'}`}>
                {available ? 'Available for Referrals' : 'Not Available'}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
        {[
          { label: "Wiki Contributions", value: mockProfile.stats.wikiContributions, icon: "📝" },
          { label: "Peer Endorsements", value: mockProfile.stats.peerEndorsements, icon: "🤝" },
          { label: "Cases Handled", value: mockProfile.stats.casesHandled, icon: "📁" },
          { label: "Years on Platform", value: mockProfile.stats.yearsOnPlatform, icon: "⏳" },
          { label: "Reputation Score", value: `${mockProfile.stats.reputationScore}/100`, icon: "⭐" },
        ].map(s => (
          <div key={s.label} className="bg-navy-800 rounded-xl border border-navy-700 p-4 text-center">
            <div className="text-lg mb-1">{s.icon}</div>
            <div className="text-xl font-bold text-white">{s.value}</div>
            <div className="text-[11px] text-gray-500 mt-1">{s.label}</div>
          </div>
        ))}
      </div>

      {/* About */}
      <div className="bg-navy-800 rounded-xl border border-navy-700 p-6">
        <h2 className="text-sm font-bold text-white mb-3">About</h2>
        <p className="text-sm text-gray-400 leading-relaxed">{mockProfile.bio}</p>
      </div>

      {/* Practice Areas & Endorsements */}
      <div className="bg-navy-800 rounded-xl border border-navy-700 p-6">
        <h2 className="text-sm font-bold text-white mb-4">Practice Areas & Expertise</h2>
        <div className="space-y-3">
          {endorsements.map(e => (
            <div key={e.area} className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <span className="px-3 py-1.5 bg-gold-500/10 text-gold-500 text-sm font-semibold rounded-lg border border-gold-500/20">{e.area}</span>
              </div>
              <span className="text-xs text-gray-500">Endorsed by {e.count} attorney{e.count !== 1 ? 's' : ''}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Wiki Contributions */}
      <div className="bg-navy-800 rounded-xl border border-navy-700 p-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-sm font-bold text-white">Wiki Contributions</h2>
          <button className="text-xs text-gold-500 hover:text-gold-400 font-medium">View All →</button>
        </div>
        <div className="space-y-3">
          {mockWikiEntries.map(entry => (
            <div key={entry.title} className="flex items-center justify-between py-2 border-b border-navy-700 last:border-0">
              <div>
                <p className="text-sm text-gray-200 font-medium">{entry.title}</p>
                <p className="text-[11px] text-gray-500 mt-0.5">{entry.date}</p>
              </div>
              <div className="flex items-center gap-1 text-gray-500 text-xs shrink-0 ml-3">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M12 19V5M5 12l7-7 7 7"/></svg>
                {entry.upvotes}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Contact / Referral */}
      <div className="bg-navy-800 rounded-xl border border-navy-700 p-6">
        <h2 className="text-sm font-bold text-white mb-4">Connect</h2>
        <div className="flex flex-wrap gap-3">
          <button className="px-5 py-2.5 bg-gold-500 text-navy-900 rounded-lg text-sm font-bold hover:bg-gold-400 transition-colors">
            Send Referral
          </button>
          <button className="px-5 py-2.5 bg-blue-600 text-white rounded-lg text-sm font-bold hover:bg-blue-500 transition-colors">
            Request Co-Counsel
          </button>
          <button className="px-5 py-2.5 bg-navy-700 text-gray-300 rounded-lg text-sm font-bold hover:bg-navy-600 transition-colors border border-navy-600">
            Connect
          </button>
        </div>
      </div>
    </div>
  );
}
