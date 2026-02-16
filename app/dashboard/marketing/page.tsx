"use client";

import { useState } from 'react';
import Link from 'next/link';

// ══════════════════════════════════════════════════════════════════
// DATA
// ══════════════════════════════════════════════════════════════════
const CAMPAIGNS = [
    { id: 1, name: 'Divorce Lead Gen', channel: 'Google Ads', status: 'Active', budget: '$50/day', leads: 12, costPerLead: '$42' },
    { id: 2, name: 'Estate Planning Local', channel: 'Facebook', status: 'Paused', budget: '$30/day', leads: 5, costPerLead: '$28' },
    { id: 3, name: 'DWI Defense', channel: 'LSAs', status: 'Active', budget: '$100/day', leads: 8, costPerLead: '$85' },
];

const REVIEWS = [
    { id: 1, client: 'Sarah M.', rating: 5, source: 'Google', text: 'Raja was amazing. Handled my custody case with such care.', date: '2 days ago' },
    { id: 2, client: 'Mike T.', rating: 5, source: 'Avvo', text: 'Best criminal defense lawyer in the county. Got my charges dropped.', date: '1 week ago' },
];

const ADS_SCRIPTS = [
    {
        id: 'quality-guard',
        name: 'Lead Quality Guard',
        desc: 'Automatically pauses keywords that have a high bounce rate or low conversion, saving you money on junk clicks.',
        code: `function main() {
  // CONFIGURATION
  var BOUNCE_RATE_THRESHOLD = 80; // Pause if bounce rate > 80%
  var MIN_CLICKS = 20; // Only check keywords with at least 20 clicks

  var keywords = AdWordsApp.keywords()
    .withCondition("Status = ENABLED")
    .withCondition("Clicks > " + MIN_CLICKS)
    .withCondition("BounceRate > " + (BOUNCE_RATE_THRESHOLD/100))
    .forDateRange("LAST_30_DAYS")
    .get();

  while (keywords.hasNext()) {
    var keyword = keywords.next();
    keyword.pause();
    Logger.log("Paused keyword: " + keyword.getText() + " (Bounce Rate: " + (keyword.getStatsFor("LAST_30_DAYS").getBounceRate() * 100).toFixed(1) + "%)");
  }
}`
    },
    {
        id: 'budget-commander',
        name: 'Budget Commander',
        desc: 'Ensures your daily spend never exceeds your limit. Checks every hour and pauses campaigns if they hit the cap.',
        code: `function main() {
  var MAX_DAILY_SPEND = 50.00; // Your strict daily limit

  var campaigns = AdWordsApp.campaigns()
    .withCondition("Status = ENABLED")
    .withCondition("Cost > " + MAX_DAILY_SPEND)
    .forDateRange("TODAY")
    .get();

  while (campaigns.hasNext()) {
    var campaign = campaigns.next();
    campaign.pause();
    Logger.log("Paused campaign due to budget cap: " + campaign.getName());
    MailApp.sendEmail("raja@assignedcocounsel.com", "Campaign Paused: " + campaign.getName(), "Daily budget limit reached.");
  }
}`
    },
    {
        id: 'competitor-watch',
        name: 'Competitor Watch',
        desc: 'Alerts you if the Cost Per Click (CPC) spikes on your main keywords, indicating a new competitor has entered the market.',
        code: `function main() {
  var CPC_SPIKE_THRESHOLD = 1.5; // Alert if CPC increases by 50% vs last week

  var keywords = AdWordsApp.keywords()
    .withCondition("Status = ENABLED")
    .withCondition("Clicks > 10")
    .forDateRange("LAST_7_DAYS")
    .get();

  while (keywords.hasNext()) {
    var kw = keywords.next();
    var currentCpc = kw.getStatsFor("LAST_7_DAYS").getAverageCpc();
    var lastWeekCpc = kw.getStatsFor("LAST_WEEK").getAverageCpc();

    if (currentCpc > (lastWeekCpc * CPC_SPIKE_THRESHOLD)) {
       Logger.log("CPC Spike detected for: " + kw.getText());
       // In real deployment, send email alert
    }
  }
}`
    },
    {
        id: 'weekly-report',
        name: 'Weekly Executive Report',
        desc: 'Generates a PDF summary of your leads, spend, and top performing ads and emails it to you every Monday morning.',
        code: `function main() {
  // This script gathers stats and emails a formatted table
  var stats = AdWordsApp.account().getStatsFor("LAST_WEEK");
  var subject = "Weekly Marketing Report: " + AdWordsApp.account().getName();
  var body = "Spend: $" + stats.getCost() + "\\n" +
             "Clicks: " + stats.getClicks() + "\\n" +
             "Conversions: " + stats.getConversions() + "\\n" +
             "CPA: $" + (stats.getCost() / stats.getConversions()).toFixed(2);
  
  MailApp.sendEmail("raja@assignedcocounsel.com", subject, body);
}`
    }
];

// ══════════════════════════════════════════════════════════════════
// COMPONENTS
// ══════════════════════════════════════════════════════════════════

function ScriptCard({ script, onCopy, onAgent }: { script: typeof ADS_SCRIPTS[0], onCopy: (code: string) => void, onAgent: () => void }) {
    return (
        <div className="bg-white rounded-xl border border-slate-200 p-6 hover:shadow-md transition-shadow">
            <div className="flex justify-between items-start mb-4">
                <div className="w-12 h-12 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center text-xl">📜</div>
                <span className="bg-slate-100 text-slate-600 text-[10px] font-bold px-2 py-1 rounded-full uppercase">JS</span>
            </div>
            <h3 className="text-lg font-bold text-slate-900 mb-2">{script.name}</h3>
            <p className="text-sm text-slate-500 mb-6 h-10 line-clamp-2">{script.desc}</p>
            
            <div className="flex flex-col gap-2">
                <button 
                    onClick={() => onCopy(script.code)}
                    className="w-full flex items-center justify-center gap-2 py-2.5 bg-slate-900 hover:bg-slate-800 text-white rounded-lg text-sm font-semibold transition-colors"
                >
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="9" y="9" width="13" height="13" rx="2" ry="2"/><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"/></svg>
                    Copy Script
                </button>
                <button 
                    onClick={onAgent}
                    className="w-full flex items-center justify-center gap-2 py-2.5 border border-purple-200 bg-purple-50 hover:bg-purple-100 text-purple-700 rounded-lg text-sm font-semibold transition-colors"
                >
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="10"/><path d="M12 16v-4"/><path d="M12 8h.01"/></svg>
                    Let AI Install It
                </button>
            </div>
        </div>
    );
}

// ══════════════════════════════════════════════════════════════════
// PAGE
// ══════════════════════════════════════════════════════════════════
export default function MarketingPage() {
    const [tab, setTab] = useState<'dashboard' | 'platforms' | 'scripts'>('dashboard');
    const [showCopyToast, setShowCopyToast] = useState(false);

    const AD_PLATFORMS = [
        { name: 'Google Ads', icon: '🔍', color: 'from-blue-500 to-blue-700', desc: 'Search ads, Local Services Ads, Display campaigns. Best for "lawyer near me" searches.', status: 'Connect', features: ['Search Campaigns', 'Local Services Ads', 'Automation Scripts', 'Weekly Reports'] },
        { name: 'Facebook & Instagram', icon: '📘', color: 'from-indigo-500 to-purple-600', desc: 'Targeted social ads based on demographics, interests, and life events (divorce, DUI, etc).', status: 'Connect', features: ['Lead Gen Forms', 'Retargeting', 'Lookalike Audiences', 'Story Ads'] },
        { name: 'LinkedIn', icon: '💼', color: 'from-sky-600 to-sky-800', desc: 'Professional networking ads. Best for estate planning, corporate law, and B2B referrals.', status: 'Connect', features: ['Sponsored Content', 'InMail Campaigns', 'Professional Targeting', 'Company Pages'] },
        { name: 'TikTok', icon: '🎵', color: 'from-pink-500 to-rose-600', desc: 'Short-form video ads reaching younger demographics. Great for brand awareness and viral reach.', status: 'Connect', features: ['In-Feed Ads', 'Spark Ads', 'Lead Gen', 'Branded Effects'] },
    ];

    const handleCopy = (code: string) => {
        navigator.clipboard.writeText(code);
        setShowCopyToast(true);
        setTimeout(() => setShowCopyToast(false), 2000);
    };

    const handleAgent = () => {
        window.location.href = '/dashboard/assistant?action=google-ads';
    };

    return (
        <div className="p-4 sm:p-6 lg:p-8 max-w-[1400px] mx-auto animate-fade-in relative">
            
            {/* Header */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
                <div>
                    <h1 className="text-xl sm:text-2xl font-bold text-slate-900 tracking-tight">Client Acquisition</h1>
                    <p className="text-slate-400 text-sm mt-1">Manage campaigns, reputation, and automation.</p>
                </div>
                
                {/* Tabs */}
                <div className="flex p-1 bg-slate-100 rounded-lg self-start sm:self-auto">
                    <button 
                        onClick={() => setTab('dashboard')}
                        className={`px-4 py-2 text-sm font-semibold rounded-md transition-all ${tab === 'dashboard' ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}
                    >
                        Dashboard
                    </button>
                    <button 
                        onClick={() => setTab('platforms')}
                        className={`px-4 py-2 text-sm font-semibold rounded-md transition-all ${tab === 'platforms' ? 'bg-white text-blue-700 shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}
                    >
                        🔌 Platforms
                    </button>
                    <button 
                        onClick={() => setTab('scripts')}
                        className={`px-4 py-2 text-sm font-semibold rounded-md transition-all ${tab === 'scripts' ? 'bg-white text-purple-700 shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}
                    >
                        ⚡ Scripts
                    </button>
                </div>
            </div>

            {/* TAB: DASHBOARD */}
            {tab === 'dashboard' && (
                <div className="space-y-8">
                    {/* Stats Row */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                        <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm">
                            <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-1">New Leads (30d)</p>
                            <p className="text-2xl font-bold text-slate-900">28</p>
                            <div className="flex items-center gap-1 mt-2 text-xs font-medium text-emerald-600"><span>+15% vs last month</span></div>
                        </div>
                        <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm">
                            <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-1">Avg Cost / Lead</p>
                            <p className="text-2xl font-bold text-slate-900">$54.00</p>
                            <div className="flex items-center gap-1 mt-2 text-xs font-medium text-emerald-600"><span>-5% efficiency gain</span></div>
                        </div>
                        <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm">
                            <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-1">Consultation Rate</p>
                            <p className="text-2xl font-bold text-slate-900">42%</p>
                            <p className="text-xs text-slate-400 mt-2">12 consultations scheduled</p>
                        </div>
                        <div className="bg-purple-50 p-5 rounded-xl border border-purple-100 shadow-sm">
                            <p className="text-xs font-semibold text-purple-600 uppercase tracking-wider mb-1">Est. ROI</p>
                            <p className="text-2xl font-bold text-purple-900">4.5x</p>
                            <p className="text-xs text-purple-600/80 mt-2">$4.50 revenue per $1 spend</p>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                        {/* Active Campaigns */}
                        <div className="lg:col-span-2 bg-white border border-slate-200 rounded-xl overflow-hidden shadow-sm">
                            <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between">
                                <h2 className="font-semibold text-slate-800">Active Campaigns</h2>
                                <div className="flex gap-2">
                                    <span className="px-2 py-1 bg-slate-100 text-slate-600 text-xs rounded-md font-medium">Google Ads</span>
                                    <span className="px-2 py-1 bg-slate-100 text-slate-600 text-xs rounded-md font-medium">Meta</span>
                                </div>
                            </div>
                            <table className="w-full text-sm text-left">
                                <thead className="bg-slate-50/50 text-slate-500 font-medium border-b border-slate-100">
                                    <tr>
                                        <th className="px-6 py-3">Campaign</th>
                                        <th className="px-6 py-3">Channel</th>
                                        <th className="px-6 py-3">Budget</th>
                                        <th className="px-6 py-3">Leads</th>
                                        <th className="px-6 py-3">Status</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-slate-100">
                                    {CAMPAIGNS.map((c) => (
                                        <tr key={c.id} className="hover:bg-slate-50/50 transition-colors">
                                            <td className="px-6 py-3 font-medium text-slate-900">{c.name}</td>
                                            <td className="px-6 py-3 text-slate-500">{c.channel}</td>
                                            <td className="px-6 py-3 text-slate-500">{c.budget}</td>
                                            <td className="px-6 py-3 text-slate-900 font-medium">{c.leads}</td>
                                            <td className="px-6 py-3">
                                                <span className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-medium ${c.status === 'Active' ? 'bg-emerald-50 text-emerald-700' : 'bg-slate-100 text-slate-600'}`}>{c.status}</span>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>

                        {/* Reputation */}
                        <div className="flex flex-col gap-6">
                            <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm flex-1">
                                <h3 className="font-bold text-slate-900 mb-4 flex items-center justify-between">
                                    Reputation <span className="text-xs font-normal text-slate-500">4.9/5.0 Avg</span>
                                </h3>
                                <div className="space-y-4">
                                    {REVIEWS.map((r) => (
                                        <div key={r.id} className="p-3 bg-slate-50 rounded-lg border border-slate-100">
                                            <div className="flex justify-between items-start mb-1">
                                                <span className="text-xs font-bold text-slate-700">{r.client}</span>
                                                <div className="flex text-amber-400 text-xs">{'★'.repeat(r.rating)}</div>
                                            </div>
                                            <p className="text-xs text-slate-600 italic mb-2">&quot;{r.text}&quot;</p>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* TAB: PLATFORMS */}
            {tab === 'platforms' && (
                <div className="space-y-6">
                    <div className="bg-blue-50 border border-blue-200 rounded-xl p-6">
                        <h2 className="text-lg font-bold text-blue-900 mb-2">Connect Your Advertising Platforms</h2>
                        <p className="text-sm text-blue-700">Link your ad accounts to manage campaigns, track leads, and automate reporting — all from one dashboard.</p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {AD_PLATFORMS.map((platform) => (
                            <div key={platform.name} className="bg-white border border-slate-200 rounded-2xl overflow-hidden hover:shadow-lg transition-shadow">
                                <div className={`bg-gradient-to-r ${platform.color} p-5 text-white`}>
                                    <div className="flex items-center gap-3 mb-2">
                                        <span className="text-3xl">{platform.icon}</span>
                                        <h3 className="text-lg font-bold">{platform.name}</h3>
                                    </div>
                                    <p className="text-sm text-white/80">{platform.desc}</p>
                                </div>
                                <div className="p-5">
                                    <h4 className="text-xs font-bold text-slate-500 uppercase tracking-wide mb-3">Features</h4>
                                    <div className="grid grid-cols-2 gap-2 mb-5">
                                        {platform.features.map(f => (
                                            <div key={f} className="flex items-center gap-2 text-xs text-slate-600">
                                                <svg className="w-3 h-3 text-emerald-500 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="3"><path d="M5 13l4 4L19 7"/></svg>
                                                {f}
                                            </div>
                                        ))}
                                    </div>
                                    <div className="flex gap-2">
                                        <button className="flex-1 py-2.5 bg-slate-900 hover:bg-slate-800 text-white text-sm font-bold rounded-xl transition-colors">
                                            Connect Account
                                        </button>
                                        {platform.name === 'Google Ads' && (
                                            <button onClick={() => setTab('scripts')} className="px-4 py-2.5 bg-purple-50 hover:bg-purple-100 text-purple-700 text-sm font-bold rounded-xl transition-colors border border-purple-200">
                                                ⚡ Scripts
                                            </button>
                                        )}
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            )}

            {/* TAB: SCRIPTS */}
            {tab === 'scripts' && (
                <div className="space-y-6">
                    <div className="mb-4 text-right">
                        <Link href="/dashboard/marketing/scripts" className="text-sm font-semibold text-purple-600 hover:text-purple-700">
                            Open Full Scripts Library →
                        </Link>
                    </div>
                    <div className="bg-blue-50 border border-blue-200 rounded-xl p-6 flex flex-col md:flex-row items-center gap-6">
                        <div className="flex-1">
                            <h2 className="text-lg font-bold text-blue-900 mb-2">Google Ads Automation Scripts</h2>
                            <p className="text-sm text-blue-700 mb-4">
                                Don&apos;t waste time manually checking your ads. These "Set and Forget" scripts will automatically pause bad keywords, protect your budget, and email you reports.
                            </p>
                            <a href="https://ads.google.com/aw/bulk/scripts" target="_blank" className="text-xs font-bold text-blue-600 hover:text-blue-800 underline">
                                Open Google Ads Scripts Dashboard →
                            </a>
                        </div>
                        <div className="shrink-0 bg-white p-4 rounded-lg border border-blue-100 shadow-sm text-center">
                            <p className="text-xs font-bold text-slate-500 uppercase tracking-wide mb-1">Scripts Active</p>
                            <p className="text-3xl font-bold text-emerald-500">0</p>
                            <p className="text-[10px] text-slate-400">Install a script below</p>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                        {ADS_SCRIPTS.map(script => (
                            <ScriptCard key={script.id} script={script} onCopy={handleCopy} onAgent={handleAgent} />
                        ))}
                    </div>

                    {/* How To Guide */}
                    <div className="bg-slate-900 rounded-xl p-8 text-white mt-8">
                        <h3 className="font-bold text-lg mb-6">How to Install Manually (30 Seconds)</h3>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                            <div>
                                <div className="w-8 h-8 rounded-full bg-blue-500 flex items-center justify-center font-bold mb-3">1</div>
                                <h4 className="font-bold text-sm mb-2">Copy the Script</h4>
                                <p className="text-xs text-slate-400">Click the "Copy Script" button on any of the cards above to grab the code.</p>
                            </div>
                            <div>
                                <div className="w-8 h-8 rounded-full bg-blue-500 flex items-center justify-center font-bold mb-3">2</div>
                                <h4 className="font-bold text-sm mb-2">Open Google Ads</h4>
                                <p className="text-xs text-slate-400">Go to <strong>Tools & Settings &gt; Bulk Actions &gt; Scripts</strong>. Click the big blue plus (+) button.</p>
                            </div>
                            <div>
                                <div className="w-8 h-8 rounded-full bg-blue-500 flex items-center justify-center font-bold mb-3">3</div>
                                <h4 className="font-bold text-sm mb-2">Paste & Run</h4>
                                <p className="text-xs text-slate-400">Delete any example code, paste your script, name it, and click <strong>Run</strong> (or Schedule it).</p>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* Toast Notification */}
            {showCopyToast && (
                <div className="absolute top-4 right-4 bg-slate-900 text-white px-4 py-2 rounded-lg shadow-lg text-sm font-semibold animate-in fade-in slide-in-from-top-2">
                    ✅ Script copied to clipboard!
                </div>
            )}
        </div>
    );
}
