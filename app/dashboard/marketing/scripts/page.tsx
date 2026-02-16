"use client";

import { useState } from 'react';
import Link from 'next/link';

const SCRIPTS = [
    {
        id: 'lead-quality-guard',
        name: 'Lead Quality Guard',
        emoji: '🛡️',
        description: 'Automatically pauses keywords with low CTR or high bounce rate so you stop wasting money on bad clicks.',
        color: 'from-red-500 to-orange-500',
        badge: 'Popular',
        code: `// Lead Quality Guard — Assigned Co-Counsel
// Pauses keywords with CTR < 2% and > 100 impressions
function main() {
  var MIN_CTR = 0.02;
  var MIN_IMPRESSIONS = 100;
  
  var keywords = AdsApp.keywords()
    .withCondition("Status = ENABLED")
    .withCondition("Impressions > " + MIN_IMPRESSIONS)
    .forDateRange("LAST_30_DAYS")
    .get();
  
  while (keywords.hasNext()) {
    var kw = keywords.next();
    var stats = kw.getStatsFor("LAST_30_DAYS");
    var ctr = stats.getCtr();
    
    if (ctr < MIN_CTR) {
      kw.pause();
      Logger.log("Paused: " + kw.getText() + " (CTR: " + (ctr * 100).toFixed(2) + "%)");
    }
  }
}`,
        guide: [
            'Go to ads.google.com and sign in',
            'Click "Tools & Settings" (wrench icon) in the top menu',
            'Under "Bulk Actions", click "Scripts"',
            'Click the big blue "+" button to create a new script',
            'Name it "Lead Quality Guard"',
            'Delete any existing code and paste the copied code',
            'Click "Preview" to test (no changes are made)',
            'Click "Run" when you\'re happy, or set a schedule (daily recommended)',
        ],
    },
    {
        id: 'budget-commander',
        name: 'Budget Commander',
        emoji: '💰',
        description: 'Ensures your daily spend never exceeds your set limit. Pauses campaigns if spend gets too high.',
        color: 'from-emerald-500 to-teal-500',
        badge: 'Essential',
        code: `// Budget Commander — Assigned Co-Counsel
// Pauses campaigns if daily spend exceeds MAX_DAILY_SPEND
var MAX_DAILY_SPEND = 150; // Change this to your budget

function main() {
  var campaigns = AdsApp.campaigns()
    .withCondition("Status = ENABLED")
    .get();
  
  while (campaigns.hasNext()) {
    var campaign = campaigns.next();
    var stats = campaign.getStatsFor("TODAY");
    var cost = stats.getCost();
    
    if (cost > MAX_DAILY_SPEND) {
      campaign.pause();
      Logger.log("PAUSED: " + campaign.getName() + " — spent $" + cost.toFixed(2));
      
      // Send email alert
      MailApp.sendEmail({
        to: "your-email@example.com",
        subject: "⚠️ Budget Commander: Campaign paused",
        body: campaign.getName() + " was paused. Spent $" + cost.toFixed(2) + " (limit: $" + MAX_DAILY_SPEND + ")"
      });
    }
  }
}`,
        guide: [
            'Go to ads.google.com and sign in',
            'Click "Tools & Settings" (wrench icon) in the top menu',
            'Under "Bulk Actions", click "Scripts"',
            'Click "+" to create a new script',
            'Name it "Budget Commander"',
            'Paste the code and change MAX_DAILY_SPEND to your budget',
            'Change the email address to yours',
            'Set schedule to run every hour for best protection',
        ],
    },
    {
        id: 'competitor-watch',
        name: 'Competitor Watch',
        emoji: '🔍',
        description: 'Alerts you when CPC suddenly spikes — a sign that a competitor just entered your market.',
        color: 'from-blue-500 to-indigo-500',
        badge: 'Smart',
        code: `// Competitor Watch — Assigned Co-Counsel
// Alerts when average CPC spikes compared to last week
var CPC_SPIKE_THRESHOLD = 1.3; // 30% increase triggers alert
var ALERT_EMAIL = "your-email@example.com";

function main() {
  var campaignIterator = AdsApp.campaigns()
    .withCondition("Status = ENABLED")
    .get();
  
  var alerts = [];
  
  while (campaignIterator.hasNext()) {
    var campaign = campaignIterator.next();
    var thisWeek = campaign.getStatsFor("THIS_WEEK_SUN_TODAY");
    var lastWeek = campaign.getStatsFor("LAST_WEEK");
    
    var currentCpc = thisWeek.getAverageCpc();
    var previousCpc = lastWeek.getAverageCpc();
    
    if (previousCpc > 0 && currentCpc > previousCpc * CPC_SPIKE_THRESHOLD) {
      alerts.push(
        campaign.getName() + ": CPC jumped from $" + 
        previousCpc.toFixed(2) + " to $" + currentCpc.toFixed(2) +
        " (+" + ((currentCpc / previousCpc - 1) * 100).toFixed(0) + "%)"
      );
    }
  }
  
  if (alerts.length > 0) {
    MailApp.sendEmail({
      to: ALERT_EMAIL,
      subject: "🔍 Competitor Watch: CPC Spike Detected!",
      body: "The following campaigns saw CPC spikes:\\n\\n" + alerts.join("\\n")
    });
    Logger.log("Alerts sent: " + alerts.length);
  } else {
    Logger.log("No CPC spikes detected. All clear.");
  }
}`,
        guide: [
            'Go to ads.google.com and sign in',
            'Click "Tools & Settings" → "Scripts"',
            'Click "+" to create a new script',
            'Name it "Competitor Watch"',
            'Paste the code and update your email address',
            'Adjust the threshold if needed (1.3 = 30% spike)',
            'Set to run daily (morning recommended)',
            'You\'ll get an email only when spikes are detected',
        ],
    },
    {
        id: 'weekly-report',
        name: 'Weekly Report',
        emoji: '📊',
        description: 'Emails you a clean summary every Monday with spend, leads, CTR, and top keywords.',
        color: 'from-purple-500 to-pink-500',
        badge: 'Must Have',
        code: `// Weekly Report — Assigned Co-Counsel
// Sends a weekly performance summary email every Monday
var REPORT_EMAIL = "your-email@example.com";

function main() {
  var account = AdsApp.currentAccount();
  var stats = account.getStatsFor("LAST_7_DAYS");
  
  var report = [];
  report.push("📊 WEEKLY GOOGLE ADS REPORT");
  report.push("Account: " + account.getName());
  report.push("Period: Last 7 Days");
  report.push("─".repeat(40));
  report.push("");
  report.push("💵 Total Spend:    $" + stats.getCost().toFixed(2));
  report.push("👁️ Impressions:    " + stats.getImpressions().toLocaleString());
  report.push("👆 Clicks:         " + stats.getClicks().toLocaleString());
  report.push("📈 CTR:            " + (stats.getCtr() * 100).toFixed(2) + "%");
  report.push("💰 Avg CPC:        $" + stats.getAverageCpc().toFixed(2));
  report.push("🎯 Conversions:    " + stats.getConversions());
  report.push("📉 Cost/Conv:      $" + (stats.getConversions() > 0 ? (stats.getCost() / stats.getConversions()).toFixed(2) : "N/A"));
  report.push("");
  report.push("─".repeat(40));
  report.push("TOP 5 KEYWORDS BY CLICKS:");
  report.push("");
  
  var keywords = AdsApp.keywords()
    .withCondition("Status = ENABLED")
    .orderBy("Clicks DESC")
    .withLimit(5)
    .forDateRange("LAST_7_DAYS")
    .get();
  
  var i = 1;
  while (keywords.hasNext()) {
    var kw = keywords.next();
    var kwStats = kw.getStatsFor("LAST_7_DAYS");
    report.push(i + ". " + kw.getText() + " — " + kwStats.getClicks() + " clicks, $" + kwStats.getCost().toFixed(2));
    i++;
  }
  
  MailApp.sendEmail({
    to: REPORT_EMAIL,
    subject: "📊 Weekly Google Ads Report — " + account.getName(),
    body: report.join("\\n")
  });
  
  Logger.log("Weekly report sent to " + REPORT_EMAIL);
}`,
        guide: [
            'Go to ads.google.com and sign in',
            'Click "Tools & Settings" → "Scripts"',
            'Click "+" to create a new script',
            'Name it "Weekly Report"',
            'Paste the code and update your email address',
            'Click "Preview" to see a sample report in the logs',
            'Set schedule to run weekly on Monday mornings',
            'You\'ll get a clean summary in your inbox every week',
        ],
    },
];

export default function ScriptsPage() {
    const [copiedId, setCopiedId] = useState<string | null>(null);
    const [guideOpen, setGuideOpen] = useState<string | null>(null);
    const [launchingId, setLaunchingId] = useState<string | null>(null);

    const copyCode = (id: string, code: string) => {
        navigator.clipboard.writeText(code);
        setCopiedId(id);
        setTimeout(() => setCopiedId(null), 2000);
    };

    const mockLaunch = (id: string) => {
        setLaunchingId(id);
        setTimeout(() => setLaunchingId(null), 3000);
    };

    return (
        <div className="p-4 sm:p-6 lg:p-8 max-w-[1400px] mx-auto animate-fade-in">
            {/* Header */}
            <div className="mb-8">
                <Link href="/dashboard/marketing" className="text-sm text-purple-600 hover:text-purple-700 font-medium mb-3 inline-flex items-center gap-1">
                    ← Back to Marketing
                </Link>
                <h1 className="text-xl sm:text-2xl font-bold text-slate-900 tracking-tight mt-2">Google Ads Scripts</h1>
                <p className="text-slate-400 text-sm mt-1">One-click automation scripts. Copy → Paste → Run. That's it.</p>
            </div>

            {/* How it works banner */}
            <div className="bg-gradient-to-r from-purple-50 to-indigo-50 border border-purple-100 rounded-xl p-5 mb-8">
                <h3 className="font-bold text-purple-900 text-sm mb-3">How It Works — 3 Steps</h3>
                <div className="flex flex-col sm:flex-row gap-4">
                    {[
                        { step: '1', label: 'Copy', desc: 'Click "Copy Code" on any script below', icon: '📋' },
                        { step: '2', label: 'Paste', desc: 'Open Google Ads → Scripts → New → Paste', icon: '📝' },
                        { step: '3', label: 'Run', desc: 'Click Preview, then Run or Schedule', icon: '🚀' },
                    ].map((s) => (
                        <div key={s.step} className="flex-1 flex items-start gap-3">
                            <span className="text-2xl">{s.icon}</span>
                            <div>
                                <p className="font-bold text-purple-900 text-sm">{s.label}</p>
                                <p className="text-xs text-purple-700/70">{s.desc}</p>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {/* Script Cards */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {SCRIPTS.map((script) => (
                    <div key={script.id} className="bg-white border border-slate-200 rounded-xl shadow-sm overflow-hidden hover:shadow-md transition-shadow">
                        {/* Card Header */}
                        <div className={`bg-gradient-to-r ${script.color} px-6 py-4 flex items-center justify-between`}>
                            <div className="flex items-center gap-3">
                                <span className="text-3xl">{script.emoji}</span>
                                <div>
                                    <h3 className="font-bold text-white text-lg">{script.name}</h3>
                                    <span className="inline-block px-2 py-0.5 bg-white/20 text-white text-[10px] font-bold rounded-full uppercase tracking-wider">{script.badge}</span>
                                </div>
                            </div>
                        </div>

                        {/* Card Body */}
                        <div className="p-6">
                            <p className="text-sm text-slate-600 mb-5">{script.description}</p>

                            {/* Action Buttons */}
                            <div className="flex flex-wrap gap-2">
                                <button
                                    onClick={() => copyCode(script.id, script.code)}
                                    className={`flex-1 min-w-[100px] inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg text-sm font-semibold transition-all ${
                                        copiedId === script.id
                                            ? 'bg-emerald-100 text-emerald-700 border border-emerald-200'
                                            : 'bg-slate-900 text-white hover:bg-slate-800'
                                    }`}
                                >
                                    {copiedId === script.id ? (
                                        <>
                                            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><polyline points="20 6 9 17 4 12" /></svg>
                                            Copied!
                                        </>
                                    ) : (
                                        <>
                                            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="9" y="9" width="13" height="13" rx="2" ry="2" /><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1" /></svg>
                                            Copy Code
                                        </>
                                    )}
                                </button>

                                <button
                                    onClick={() => setGuideOpen(guideOpen === script.id ? null : script.id)}
                                    className="flex-1 min-w-[100px] inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg text-sm font-semibold border border-slate-200 text-slate-700 hover:bg-slate-50 transition-all"
                                >
                                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="10" /><path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3" /><line x1="12" y1="17" x2="12.01" y2="17" /></svg>
                                    Guide
                                </button>

                                <button
                                    onClick={() => mockLaunch(script.id)}
                                    className={`flex-1 min-w-[100px] inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg text-sm font-semibold transition-all ${
                                        launchingId === script.id
                                            ? 'bg-purple-100 text-purple-700 border border-purple-200'
                                            : 'bg-purple-600 text-white hover:bg-purple-700'
                                    }`}
                                >
                                    {launchingId === script.id ? (
                                        <>
                                            <svg className="animate-spin" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M21 12a9 9 0 1 1-6.219-8.56" /></svg>
                                            Installing...
                                        </>
                                    ) : (
                                        <>
                                            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z" /></svg>
                                            Launch Agent
                                        </>
                                    )}
                                </button>
                            </div>
                        </div>

                        {/* Guide Panel (expandable) */}
                        {guideOpen === script.id && (
                            <div className="border-t border-slate-100 bg-slate-50 px-6 py-5 animate-fade-in">
                                <h4 className="font-bold text-slate-900 text-sm mb-3 flex items-center gap-2">
                                    📍 Where to Paste in Google Ads
                                </h4>
                                <ol className="space-y-2">
                                    {script.guide.map((step, i) => (
                                        <li key={i} className="flex items-start gap-3">
                                            <span className="flex-shrink-0 w-6 h-6 bg-purple-100 text-purple-700 rounded-full flex items-center justify-center text-xs font-bold">{i + 1}</span>
                                            <span className="text-sm text-slate-600 pt-0.5">{step}</span>
                                        </li>
                                    ))}
                                </ol>
                            </div>
                        )}
                    </div>
                ))}
            </div>

            {/* Bottom CTA */}
            <div className="mt-8 bg-gradient-to-r from-slate-900 to-slate-800 rounded-xl p-6 text-center">
                <h3 className="text-white font-bold text-lg mb-2">Need a Custom Script?</h3>
                <p className="text-slate-400 text-sm mb-4">Tell us what you want automated and we'll generate the script for you.</p>
                <button className="bg-purple-600 hover:bg-purple-700 text-white px-6 py-2.5 rounded-lg text-sm font-semibold transition-all hover:shadow-lg">
                    Request Custom Script
                </button>
            </div>
        </div>
    );
}
