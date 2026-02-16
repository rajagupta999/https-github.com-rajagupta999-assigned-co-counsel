"use client";

import { useState, useRef, useEffect } from 'react';
import Link from 'next/link';

// Mock Data for Live Updates
const LIVE_UPDATES = [
    { 
        id: 1, type: 'case', title: 'People v. Smith (2024)', 
        summary: 'Court of Appeals clarifies "diligent efforts" requirement for discovery compliance under CPL 245.20.', 
        date: '2 hrs ago', tag: 'Criminal',
        content: `The Court of Appeals has issued a significant ruling in People v. Smith, addressing the "diligent efforts" requirement under CPL 245.20. 
        
        The Court held that the prosecution must demonstrate active steps to obtain discoverable material from law enforcement agencies. Passive reliance on police paperwork is no longer sufficient.
        
        Key Holdings:
        1. Prosecutors have an affirmative duty to inquire about existence of bodycam footage.
        2. "Good faith" is not a defense if no inquiry was made.
        3. COC (Certificate of Compliance) can be deemed illusory if these steps are skipped.
        
        Defense Counsel Takeaway:
        Immediately file supplemental discovery demands asking for the specific steps taken to ascertain the existence of police disciplinary records and bodycam metadata.`
    },
    { id: 2, type: 'legislation', title: 'Clean Slate Act Enacted', summary: 'Governor signs legislation automatically sealing certain criminal records after waiting period.', date: '1 day ago', tag: 'Legislation',
        content: `The Clean Slate Act has been signed into law. This legislation automates the sealing of conviction records for individuals who have completed their sentence and remained crime-free for a specified period.

        Eligibility:
        - Misdemeanors: 3 years after sentencing/release.
        - Felonies: 8 years after sentencing/release.
        
        Exclusions:
        - Sex offenses
        - Class A felonies (non-drug)
        
        This process is automatic and requires no motion practice, but counsel should advise clients to verify sealing has occurred after the effective date.`
    },
    { id: 3, type: 'practice', title: 'OCA Memo: Virtual Appearances', summary: 'Updated guidance on virtual appearances for arraignments in town/village courts.', date: '3 days ago', tag: 'Practice' },
    { id: 4, type: 'case', title: 'Matter of R.G. (Family Ct)', summary: 'Appellate Division rules on neglect findings based solely on marijuana use.', date: '4 days ago', tag: 'Family' },
    { id: 5, type: 'legislation', title: 'Bail Reform Tweaks proposed', summary: 'Legislature considering expanding qualifying offenses for bail.', date: '1 week ago', tag: 'Legislation' },
    { id: 6, type: 'practice', title: 'Voucher Rate Increase', summary: 'Reminder: New rates effective for all work performed after Jan 1, 2024.', date: '1 week ago', tag: 'Admin' },
];

const WIKI_CATEGORIES = [
    { title: 'Criminal Procedure', count: 142, icon: '⚖️' },
    { title: 'Penal Law', count: 89, icon: 'gavel' },
    { title: 'Family Court Act', count: 64, icon: 'family' },
    { title: 'Evidence', count: 45, icon: 'search' },
    { title: 'VTL (Traffic)', count: 32, icon: 'car' },
    { title: 'CPL 30.30 Calculator', count: 1, icon: 'calculator', highlight: true },
];

const COMPARISON_DATA = [
    { label: 'Legal Database', harvey: 'Curated by full-time legal staff ($200k+/yr each)', ours: 'Community-curated by practicing attorneys' },
    { label: 'Cost', harvey: '$5,000+/month per seat', ours: 'Free' },
    { label: 'RAG Grounding', harvey: 'Proprietary legal corpus feeds into every AI response', ours: 'Same architecture — Wiki entries become RAG context' },
    { label: 'Hallucination Prevention', harvey: 'Legal truth layer validates AI outputs against verified law', ours: 'Same — community-verified entries are the truth layer' },
    { label: 'Updates', harvey: 'Legal team monitors new cases/statutes', ours: 'Community flags changes in real-time from the field' },
    { label: 'Coverage', harvey: 'Broad but generic', ours: 'Deep local expertise from attorneys who practice in YOUR courts' },
    { label: 'Who Benefits', harvey: 'BigLaw firms with $100k+ tech budgets', ours: 'Solo practitioners, assigned counsel, pro se users' },
];

const HOW_IT_WORKS = [
    { step: 1, title: 'Attorneys Contribute', desc: 'When you add a wiki entry — a statute, case summary, or practice tip — it becomes part of our legal knowledge base.', icon: '✍️' },
    { step: 2, title: 'AI Learns From It', desc: 'Every wiki entry is indexed and embedded. When anyone asks a legal question, the AI searches this knowledge base FIRST before answering.', icon: '🧠' },
    { step: 3, title: 'No Hallucinations', desc: "The AI cites actual wiki entries in its responses. If it can't find verified law to support an answer, it says so — instead of making something up.", icon: '🛡️' },
    { step: 4, title: 'Community Validates', desc: 'Attorneys upvote, flag, and update entries. The more attorneys contribute, the smarter and more accurate the AI becomes for everyone.', icon: '✅' },
];

const WHY_CONTRIBUTE = [
    { text: 'Every entry you add makes the AI smarter for the entire community', icon: '🚀' },
    { text: "Your local court knowledge is invaluable — big firms don't have it", icon: '🏛️' },
    { text: 'Build your reputation — your profile shows contributions, expertise areas, and peer endorsements', icon: '⭐' },
    { text: 'Get discovered by other attorneys for referrals, partnerships, and co-counsel opportunities', icon: '🔗' },
    { text: 'Help pro se users get accurate information — serve the community while building your name', icon: '🤝' },
    { text: 'Top contributors get featured on the platform — like a legal thought leader board', icon: '🏆' },
];

export default function LegalWikiPage() {
    const [activeTab, setActiveTab] = useState<'news' | 'wiki'>('wiki');
    const [selectedNewsItem, setSelectedNewsItem] = useState<typeof LIVE_UPDATES[0] | null>(null);
    const [showExplainer, setShowExplainer] = useState(() => {
        if (typeof window !== 'undefined') {
            return !localStorage.getItem('acc_wiki_explainer_seen');
        }
        return true;
    });
    const wikiRef = useRef<HTMLDivElement>(null);

    const scrollToWiki = () => {
        wikiRef.current?.scrollIntoView({ behavior: 'smooth' });
    };

    return (
        <div className="flex flex-col min-h-screen bg-slate-50">
            
            {/* ===== WHY CONTRIBUTE TOGGLE ===== */}
            {!showExplainer && (
                <div className="bg-gradient-to-r from-blue-50 to-indigo-50 border-b border-blue-200 px-6 py-3 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <span className="text-lg">📚</span>
                        <span className="text-sm font-semibold text-blue-900">Why contribute to the Legal Wiki?</span>
                        <span className="text-xs text-blue-600">See how it helps the community & builds your reputation</span>
                    </div>
                    <button onClick={() => setShowExplainer(true)} className="px-4 py-1.5 bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold rounded-full transition-colors">
                        Learn More ↓
                    </button>
                </div>
            )}

            {showExplainer && (
            <div className="relative">
                <div className="sticky top-0 z-20 bg-white/90 backdrop-blur border-b border-slate-200 px-6 py-2 flex items-center justify-between">
                    <span className="text-sm font-bold text-slate-700">📚 Why Contribute to the Legal Wiki?</span>
                    <button onClick={() => { setShowExplainer(false); localStorage.setItem('acc_wiki_explainer_seen', 'true'); }} className="px-3 py-1 bg-slate-100 hover:bg-slate-200 text-slate-600 text-xs font-bold rounded-full transition-colors">
                        ✕ Close
                    </button>
                </div>

            {/* ===== HERO BANNER ===== */}
            <section className="relative bg-gradient-to-br from-slate-900 via-blue-900 to-indigo-900 text-white overflow-hidden">
                <div className="absolute inset-0 opacity-10">
                    <div className="absolute top-10 left-10 w-72 h-72 bg-blue-400 rounded-full blur-3xl"></div>
                    <div className="absolute bottom-10 right-10 w-96 h-96 bg-indigo-400 rounded-full blur-3xl"></div>
                </div>
                <div className="relative max-w-5xl mx-auto px-6 py-16 text-center">
                    <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 border border-white/20 text-sm mb-6">
                        <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
                        Community-Powered Legal AI
                    </div>
                    <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight mb-4">
                        Community-Powered Legal Intelligence
                    </h1>
                    <p className="text-lg md:text-xl text-blue-200 max-w-3xl mx-auto leading-relaxed">
                        The same AI grounding technology used by $5,000/month enterprise legal AI — built by our community of attorneys, for free.
                    </p>
                </div>
            </section>

            {/* ===== STATS BAR ===== */}
            <section className="bg-white border-b border-slate-200 shadow-sm">
                <div className="max-w-5xl mx-auto px-6 py-5">
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
                        {[
                            { value: '2,847', label: 'Wiki Entries' },
                            { value: '342', label: 'Contributing Attorneys' },
                            { value: '12', label: 'Practice Areas' },
                            { value: '98.7%', label: 'Accuracy Score' },
                        ].map((stat) => (
                            <div key={stat.label}>
                                <div className="text-2xl font-extrabold text-slate-900">{stat.value}</div>
                                <div className="text-xs font-medium text-slate-500 uppercase tracking-wide">{stat.label}</div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* ===== HARVEY COMPARISON ===== */}
            <section className="py-14 px-6">
                <div className="max-w-5xl mx-auto">
                    <div className="text-center mb-10">
                        <h2 className="text-2xl md:text-3xl font-extrabold text-slate-900 mb-2">How Harvey Does It vs. How We Do It</h2>
                        <p className="text-slate-500 max-w-2xl mx-auto">Enterprise legal AI costs thousands per month. We built the same architecture — powered by the community.</p>
                    </div>
                    <div className="rounded-2xl border border-slate-200 overflow-hidden shadow-lg bg-white">
                        {/* Table Header */}
                        <div className="grid grid-cols-3 text-sm font-bold border-b border-slate-200">
                            <div className="p-4 bg-slate-50 text-slate-500"></div>
                            <div className="p-4 bg-slate-100 text-slate-600 text-center">Harvey (Enterprise)</div>
                            <div className="p-4 bg-gradient-to-r from-blue-600 to-indigo-600 text-white text-center">Assigned Co-Counsel</div>
                        </div>
                        {/* Rows */}
                        {COMPARISON_DATA.map((row, i) => (
                            <div key={row.label} className={`grid grid-cols-3 text-sm ${i < COMPARISON_DATA.length - 1 ? 'border-b border-slate-100' : ''}`}>
                                <div className="p-4 font-semibold text-slate-800 bg-slate-50">{row.label}</div>
                                <div className="p-4 text-slate-500 text-center">{row.harvey}</div>
                                <div className="p-4 text-slate-900 font-medium text-center bg-blue-50/50">{row.ours}</div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* ===== HOW IT WORKS ===== */}
            <section className="py-14 px-6 bg-white border-y border-slate-200">
                <div className="max-w-5xl mx-auto">
                    <div className="text-center mb-10">
                        <h2 className="text-2xl md:text-3xl font-extrabold text-slate-900 mb-2">How It Works</h2>
                        <p className="text-slate-500">No CS degree required. Here&apos;s how your contributions power the AI.</p>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                        {HOW_IT_WORKS.map((item) => (
                            <div key={item.step} className="relative p-6 rounded-xl border border-slate-200 bg-slate-50 hover:shadow-md transition-shadow">
                                <div className="absolute -top-3 -left-3 w-8 h-8 rounded-full bg-blue-600 text-white text-sm font-bold flex items-center justify-center shadow">
                                    {item.step}
                                </div>
                                <div className="text-3xl mb-3">{item.icon}</div>
                                <h3 className="font-bold text-slate-900 mb-2">{item.title}</h3>
                                <p className="text-sm text-slate-600 leading-relaxed">{item.desc}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* ===== WHY CONTRIBUTE CTA ===== */}
            <section className="py-14 px-6">
                <div className="max-w-4xl mx-auto text-center">
                    <h2 className="text-2xl md:text-3xl font-extrabold text-slate-900 mb-8">Why Contribute?</h2>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-8">
                        {WHY_CONTRIBUTE.map((item) => (
                            <div key={item.text} className="flex items-start gap-3 p-4 rounded-xl bg-white border border-slate-200 text-left">
                                <span className="text-2xl flex-shrink-0">{item.icon}</span>
                                <p className="text-sm text-slate-700 font-medium leading-relaxed">{item.text}</p>
                            </div>
                        ))}
                    </div>
                    <button 
                        onClick={scrollToWiki}
                        className="inline-flex items-center gap-2 px-8 py-3 bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-bold rounded-xl shadow-lg hover:shadow-xl hover:from-blue-700 hover:to-indigo-700 transition-all text-lg"
                    >
                        Add Your First Entry
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><line x1="12" y1="5" x2="12" y2="19"/><polyline points="19 12 12 19 5 12"/></svg>
                    </button>
                </div>
            </section>

            </div>
            )}

            {/* ===== EXISTING WIKI CONTENT ===== */}
            <div ref={wikiRef} className="flex flex-1 overflow-hidden border-t border-slate-200" style={{ minHeight: 'calc(100vh - 64px)' }}>
                
                {/* LEFT COLUMN: Newsfeed */}
                <div className={`flex flex-col border-r border-slate-200 bg-white transition-all duration-300 ease-in-out ${selectedNewsItem ? 'w-2/3 shadow-2xl z-10' : 'w-1/3'}`}>
                    <div className="p-4 border-b border-slate-200 bg-slate-50 flex items-center justify-between sticky top-0 z-10">
                        <div>
                            <h2 className="font-bold text-slate-800 flex items-center gap-2">
                                <span className="w-2 h-2 rounded-full bg-red-500 animate-pulse"></span>
                                Live Legal Updates
                            </h2>
                            <p className="text-xs text-slate-500">Real-time case law &amp; alerts</p>
                        </div>
                        {selectedNewsItem && (
                            <button onClick={() => setSelectedNewsItem(null)} className="text-xs font-medium text-slate-500 hover:text-slate-800 flex items-center gap-1 bg-white border border-slate-200 px-2 py-1 rounded">
                                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="15 18 9 12 15 6"/></svg>
                                Back to List
                            </button>
                        )}
                    </div>

                    <div className="flex-1 overflow-y-auto">
                        {selectedNewsItem ? (
                            <div className="p-6 animate-in fade-in slide-in-from-left-4 duration-300">
                                <span className={`inline-block px-2 py-1 rounded text-xs font-medium mb-3 ${selectedNewsItem.tag === 'Criminal' ? 'bg-red-100 text-red-700' : selectedNewsItem.tag === 'Legislation' ? 'bg-purple-100 text-purple-700' : 'bg-blue-100 text-blue-700'}`}>
                                    {selectedNewsItem.tag}
                                </span>
                                <h1 className="text-2xl font-bold text-slate-900 mb-2">{selectedNewsItem.title}</h1>
                                <div className="flex items-center gap-3 text-sm text-slate-500 mb-6">
                                    <span>{selectedNewsItem.date}</span>
                                    <span>•</span>
                                    <span>Source: NY Law Journal</span>
                                </div>
                                <div className="prose prose-slate max-w-none text-slate-800">
                                    <p className="lead text-lg font-medium text-slate-600 mb-4">{selectedNewsItem.summary}</p>
                                    <div className="whitespace-pre-line">{selectedNewsItem.content || "Full content for this article would appear here..."}</div>
                                </div>
                                <div className="mt-8 pt-6 border-t border-slate-100 flex gap-3">
                                    <button className="px-4 py-2 bg-slate-800 text-white rounded-lg text-sm font-medium hover:bg-slate-700 transition-colors">Download Opinion (PDF)</button>
                                    <button className="px-4 py-2 bg-white border border-slate-200 text-slate-700 rounded-lg text-sm font-medium hover:bg-slate-50 transition-colors">Save to Case File</button>
                                </div>
                            </div>
                        ) : (
                            <div className="divide-y divide-slate-100">
                                {LIVE_UPDATES.map((item) => (
                                    <div key={item.id} onClick={() => setSelectedNewsItem(item)} className="p-4 hover:bg-slate-50 cursor-pointer transition-colors group">
                                        <div className="flex justify-between items-start mb-1">
                                            <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded ${item.tag === 'Criminal' ? 'bg-red-50 text-red-600' : item.tag === 'Legislation' ? 'bg-purple-50 text-purple-600' : 'bg-blue-50 text-blue-600'}`}>
                                                {item.tag}
                                            </span>
                                            <span className="text-[10px] text-slate-400 group-hover:text-slate-600">{item.date}</span>
                                        </div>
                                        <h3 className="text-sm font-bold text-slate-900 mb-1 group-hover:text-blue-600 transition-colors">{item.title}</h3>
                                        <p className="text-xs text-slate-500 line-clamp-2">{item.summary}</p>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                </div>

                {/* RIGHT COLUMN: Wiki & RAG Search */}
                <div className={`flex-1 flex flex-col bg-slate-50 transition-all duration-300 ease-in-out ${selectedNewsItem ? 'w-1/3 opacity-50 pointer-events-none' : 'w-2/3 opacity-100'}`}>
                    <div className="p-6 md:p-8 bg-white border-b border-slate-200 shadow-sm">
                        <div className="max-w-2xl mx-auto text-center">
                            <h1 className="text-2xl font-bold text-slate-900 mb-2">Legal Knowledge Base</h1>
                            <p className="text-slate-500 text-sm mb-6">Search statutes, case law, and community practice notes.</p>
                            <div className="relative group">
                                <input type="text" placeholder="Search e.g. 'CPL 30.30' or 'felony sentencing'..." className="w-full pl-12 pr-4 py-3 rounded-xl border border-slate-200 shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all text-slate-900" />
                                <div className="absolute left-4 top-3.5 text-slate-400 group-focus-within:text-blue-500 transition-colors">
                                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>
                                </div>
                                <div className="absolute right-3 top-2">
                                    <span className="inline-flex items-center px-2 py-1 rounded text-[10px] font-bold bg-blue-100 text-blue-700 uppercase tracking-wide">RAG Active</span>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="flex-1 overflow-y-auto p-6 md:p-8">
                        <div className="max-w-4xl mx-auto">
                            <div className="flex items-center justify-between mb-4">
                                <h3 className="font-bold text-slate-800">Browse by Topic</h3>
                                <button className="text-xs font-medium text-blue-600 hover:underline">+ Contribute Article</button>
                            </div>
                            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                                {WIKI_CATEGORIES.map((cat) => (
                                    <div key={cat.title} className={`p-4 rounded-xl border transition-all cursor-pointer hover:shadow-md ${cat.highlight ? 'bg-gradient-to-br from-blue-600 to-indigo-700 text-white border-transparent' : 'bg-white border-slate-200 hover:border-blue-300'}`}>
                                        <div className="flex items-center justify-between mb-2">
                                            <span className="text-2xl">{cat.icon}</span>
                                            <span className={`text-xs font-bold px-2 py-1 rounded-full ${cat.highlight ? 'bg-white/20 text-white' : 'bg-slate-100 text-slate-600'}`}>{cat.count}</span>
                                        </div>
                                        <h4 className={`font-bold ${cat.highlight ? 'text-white' : 'text-slate-900'}`}>{cat.title}</h4>
                                        <p className={`text-xs mt-1 ${cat.highlight ? 'text-blue-100' : 'text-slate-500'}`}>Last updated today</p>
                                    </div>
                                ))}
                            </div>

                            <div className="mt-8">
                                <h3 className="font-bold text-slate-800 mb-3">Community Contributions</h3>
                                <div className="bg-white rounded-xl border border-slate-200 overflow-hidden">
                                    {[1,2,3].map((i) => (
                                        <div key={i} className="p-4 border-b border-slate-100 last:border-0 hover:bg-slate-50 transition-colors flex items-center justify-between">
                                            <div className="flex items-center gap-3">
                                                <div className="w-8 h-8 rounded-full bg-slate-200 flex items-center justify-center text-xs font-bold text-slate-600">JD</div>
                                                <div>
                                                    <p className="text-sm font-medium text-slate-900">Updated <span className="text-blue-600">Motion to Suppress (DWI)</span></p>
                                                    <p className="text-xs text-slate-500">John D. • 2 hours ago</p>
                                                </div>
                                            </div>
                                            <span className="text-xs font-medium text-emerald-600">+12 lines</span>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
