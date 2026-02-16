"use client";

import { useState } from 'react';

interface ReputationExplainerProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function ReputationExplainer({ isOpen, onClose }: ReputationExplainerProps) {
  const [activeSection, setActiveSection] = useState<string>('points');

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4" onClick={onClose}>
      <div className="bg-white rounded-2xl w-full max-w-2xl shadow-2xl overflow-hidden max-h-[90vh] flex flex-col" onClick={e => e.stopPropagation()}>
        {/* Header */}
        <div className="bg-gradient-to-r from-amber-600 to-orange-600 p-5 text-white flex-shrink-0">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-white/20 flex items-center justify-center text-xl">🏆</div>
              <div>
                <h3 className="font-bold text-lg">How Your Reputation Score Works</h3>
                <p className="text-amber-100 text-xs">Build credibility. Get discovered. Help the community.</p>
              </div>
            </div>
            <button onClick={onClose} className="p-1.5 hover:bg-white/20 rounded-lg transition-colors">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
            </button>
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="flex border-b border-slate-200 bg-slate-50 px-4 flex-shrink-0">
          {[
            { id: 'points', label: 'Points & Tiers', icon: '⭐' },
            { id: 'how', label: 'How It Works', icon: '🔄' },
            { id: 'trust', label: 'Trust & Weighting', icon: '🔒' },
            { id: 'profile', label: 'Your Profile', icon: '👤' },
          ].map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveSection(tab.id)}
              className={`px-4 py-2.5 text-xs font-semibold border-b-2 transition-colors ${
                activeSection === tab.id
                  ? 'border-amber-500 text-amber-700 bg-white'
                  : 'border-transparent text-slate-500 hover:text-slate-700'
              }`}
            >
              {tab.icon} {tab.label}
            </button>
          ))}
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-5">
          {activeSection === 'points' && (
            <div className="space-y-5">
              {/* Points Table */}
              <div>
                <h4 className="text-sm font-bold text-slate-900 mb-3">Contribution Types & Points</h4>
                <div className="bg-slate-50 rounded-xl border border-slate-200 overflow-hidden">
                  <table className="w-full text-xs">
                    <thead>
                      <tr className="bg-slate-100">
                        <th className="text-left px-4 py-2.5 font-semibold text-slate-600">Action</th>
                        <th className="text-right px-4 py-2.5 font-semibold text-slate-600">Points</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                      {[
                        { action: 'Add a wiki entry', points: '+10', color: 'text-green-600' },
                        { action: 'Entry gets upvoted', points: '+2 per vote', color: 'text-green-600' },
                        { action: 'Entry cited by another attorney', points: '+5 per citation', color: 'text-green-600' },
                        { action: 'Peer endorsement received', points: '+15', color: 'text-green-600' },
                        { action: 'Entry flagged as inaccurate', points: '-5', color: 'text-red-500' },
                        { action: 'Correction accepted', points: '+8', color: 'text-green-600' },
                      ].map((row, i) => (
                        <tr key={i} className="bg-white">
                          <td className="px-4 py-2.5 text-slate-700">{row.action}</td>
                          <td className={`px-4 py-2.5 text-right font-bold ${row.color}`}>{row.points}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>

              {/* Tiers */}
              <div>
                <h4 className="text-sm font-bold text-slate-900 mb-3">Credibility Tiers</h4>
                <div className="space-y-2">
                  {[
                    { icon: '🥉', name: 'Contributor', range: '0–50 pts', desc: 'New member, entries reviewed by senior contributors', color: 'border-orange-200 bg-orange-50' },
                    { icon: '🥈', name: 'Trusted', range: '51–200 pts', desc: 'Entries published immediately, can endorse others', color: 'border-slate-300 bg-slate-50' },
                    { icon: '🥇', name: 'Expert', range: '201–500 pts', desc: 'Featured in directory, priority in search, can review new entries', color: 'border-yellow-300 bg-yellow-50' },
                    { icon: '💎', name: 'Authority', range: '500+ pts', desc: 'Top contributor badge, entries weighted higher in AI responses, leaderboard featured', color: 'border-purple-300 bg-purple-50' },
                  ].map((tier, i) => (
                    <div key={i} className={`flex items-start gap-3 p-3 rounded-xl border ${tier.color}`}>
                      <span className="text-lg">{tier.icon}</span>
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="text-xs font-bold text-slate-900">{tier.name}</span>
                          <span className="text-[10px] font-mono text-slate-500">{tier.range}</span>
                        </div>
                        <p className="text-[11px] text-slate-600 mt-0.5">{tier.desc}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {activeSection === 'how' && (
            <div className="space-y-5">
              <div>
                <h4 className="text-sm font-bold text-slate-900 mb-3">How It&apos;s Similar to Other Platforms</h4>
                <div className="space-y-2">
                  {[
                    { platform: 'Stack Overflow', desc: 'Quality answers rise to the top — reputation reflects expertise', icon: '📊' },
                    { platform: 'Reddit Karma', desc: 'Community validates contributions through upvotes and endorsements', icon: '⬆️' },
                    { platform: 'Google PageRank', desc: 'Entries cited by trusted attorneys rank higher in results', icon: '🔗' },
                  ].map((item, i) => (
                    <div key={i} className="flex items-start gap-3 p-3 bg-blue-50 border border-blue-100 rounded-xl">
                      <span className="text-lg">{item.icon}</span>
                      <div>
                        <span className="text-xs font-bold text-slate-900">Like {item.platform}</span>
                        <p className="text-[11px] text-slate-600 mt-0.5">{item.desc}</p>
                      </div>
                    </div>
                  ))}
                  <div className="flex items-start gap-3 p-3 bg-amber-50 border border-amber-200 rounded-xl">
                    <span className="text-lg">⚖️</span>
                    <div>
                      <span className="text-xs font-bold text-amber-900">Unlike Social Media</span>
                      <p className="text-[11px] text-amber-800 mt-0.5">This is about <strong>LEGAL ACCURACY</strong>, not popularity. Quality and correctness matter most.</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeSection === 'trust' && (
            <div className="space-y-4">
              <h4 className="text-sm font-bold text-slate-900 mb-3">Trust Weighting System</h4>
              <div className="space-y-2">
                {[
                  { icon: '✅', text: 'Attorney-verified entries carry more weight than anonymous contributions' },
                  { icon: '🔐', text: 'Bar number verification → higher base credibility' },
                  { icon: '🎯', text: 'Entries in your stated practice areas → weighted higher' },
                  { icon: '🔗', text: 'Cross-citations from multiple attorneys → highest trust score' },
                  { icon: '🤖', text: 'The AI uses these trust scores to prioritize which wiki entries to cite in responses' },
                ].map((item, i) => (
                  <div key={i} className="flex items-start gap-3 p-3 bg-slate-50 border border-slate-200 rounded-xl">
                    <span className="text-sm">{item.icon}</span>
                    <p className="text-xs text-slate-700">{item.text}</p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeSection === 'profile' && (
            <div className="space-y-4">
              <h4 className="text-sm font-bold text-slate-900 mb-3">Your Profile Impact</h4>
              <div className="space-y-2">
                {[
                  { icon: '👁️', text: 'Your reputation score is visible on your attorney profile' },
                  { icon: '📈', text: 'Higher reputation → more visibility in the directory' },
                  { icon: '⭐', text: 'Top contributors get featured monthly' },
                  { icon: '💼', text: 'Reputation carries over — it\'s your professional asset on the platform' },
                ].map((item, i) => (
                  <div key={i} className="flex items-start gap-3 p-3 bg-slate-50 border border-slate-200 rounded-xl">
                    <span className="text-sm">{item.icon}</span>
                    <p className="text-xs text-slate-700">{item.text}</p>
                  </div>
                ))}
              </div>
              <div className="mt-4 p-4 bg-gradient-to-r from-amber-50 to-orange-50 border border-amber-200 rounded-xl text-center">
                <p className="text-xs font-semibold text-amber-800">Start contributing today to build your reputation!</p>
                <p className="text-[10px] text-amber-600 mt-1">Every wiki entry, every citation, every endorsement counts.</p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
