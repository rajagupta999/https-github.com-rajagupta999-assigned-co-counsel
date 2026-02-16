"use client";

import { useState, useEffect } from 'react';
import Link from 'next/link';

// ── Feature Categories ──────────────────────────────────────────────────
const CATEGORIES = [
  {
    title: '📅 Scheduling & Calendar',
    color: 'from-blue-500/20 to-blue-600/10 border-blue-500/30',
    features: [
      { icon: '📅', title: 'Court Calendar Management', desc: 'Automatically track every court date across all your cases. Lex knows when you\'re in Criminal Court vs Family Court and blocks your calendar accordingly.' },
      { icon: '👤', title: 'Client Meeting Scheduling', desc: 'Schedule jail visits, office consultations, and phone calls. Lex sends reminders to you AND drafts appointment confirmations for clients.' },
      { icon: '🏛️', title: 'Court Appointment Follow-ups', desc: 'After every court appearance, Lex logs what happened, when the next date is, and what needs to be done before then. No more Post-it notes.' },
      { icon: '⏰', title: 'Deadline Watchdog', desc: 'CPL 30.30 speedy trial calculations, motion filing deadlines, discovery response dates, appeal timelines — Lex tracks them all and alerts you before they\'re due.' },
      { icon: '🔔', title: 'Morning Briefing', desc: 'Start each day with a summary: today\'s court appearances, pending deadlines, client calls to return, motions to file. Everything in one glance.' },
      { icon: '📆', title: 'Conflict Checking', desc: 'Before accepting a new case, Lex checks your calendar for scheduling conflicts and your existing caseload for potential conflicts of interest.' },
    ],
  },
  {
    title: '📝 Drafting & Documents',
    color: 'from-amber-500/20 to-amber-600/10 border-amber-500/30',
    features: [
      { icon: '📝', title: 'Motion Drafting', desc: 'Motions to suppress (Mapp/Huntley/Wade/Dunaway), dismiss (CPL 30.30/170.30), bail applications, orders to show cause — all with proper citations and court-specific formatting.' },
      { icon: '📑', title: 'Bail Applications', desc: 'Generate bail applications with case-specific factors under the 2020 bail reform statutes. Include client ties to community, employment, and supervised release plans.' },
      { icon: '✉️', title: 'Client Letters', desc: 'Plea offer explanations, case status updates, court date reminders, retainer agreements — professional letters drafted in your voice.' },
      { icon: '📋', title: 'Discovery Demands', desc: 'Comprehensive CPL 245 discovery demands tailored to your case type. Automatic Brady/Rosario material requests.' },
      { icon: '📄', title: 'Sentencing Memoranda', desc: 'Compelling sentencing memos with mitigating factors, character references, program completion certificates, and alternative sentencing proposals.' },
      { icon: '🗒️', title: 'Court Notes & Orders', desc: 'During or after court, dictate what happened and Lex turns it into structured notes with action items.' },
    ],
  },
  {
    title: '🔍 Research & Intelligence',
    color: 'from-purple-500/20 to-purple-600/10 border-purple-500/30',
    features: [
      { icon: '🔍', title: 'Case Law Research', desc: 'Search 19+ legal databases including CourtListener, Westlaw, LexisNexis. Get AI-powered summaries highlighting how precedent applies to YOUR case.' },
      { icon: '📊', title: 'Case Strength Analysis', desc: 'Upload the accusatory instrument and discovery — Lex analyzes strengths, weaknesses, and viable defenses from prosecutor, defense, and judge perspectives.' },
      { icon: '👮', title: 'Officer History Lookup', desc: 'Research arresting officers\' disciplinary history, prior testimony patterns, and Giglio material. Know who you\'re cross-examining.' },
      { icon: '⚖️', title: 'Judge Intelligence', desc: 'How does this judge typically rule on suppression hearings? What\'s their sentencing pattern? Lex pulls data to help you strategize.' },
      { icon: '📰', title: 'Legal News Alerts', desc: 'New appellate decisions, legislative changes, CLE opportunities — curated for criminal defense and family law practitioners.' },
      { icon: '🧮', title: 'Sentencing Calculations', desc: 'Calculate potential sentences, mandatory minimums, post-release supervision, good time credits, and merit time eligibility.' },
    ],
  },
  {
    title: '📞 Client & Communication',
    color: 'from-green-500/20 to-green-600/10 border-green-500/30',
    features: [
      { icon: '📞', title: 'Client Call Management', desc: 'Log client calls with notes, set follow-up reminders, and draft callback summaries. Handle the constant jail calls efficiently.' },
      { icon: '👨‍👩‍👧', title: 'Family Communication', desc: 'Draft appropriate communications to client\'s family members. Explain proceedings without violating privilege.' },
      { icon: '🤝', title: 'DA Correspondence', desc: 'Draft plea negotiation letters, discovery follow-ups, and adjournment requests to the District Attorney\'s office.' },
      { icon: '📧', title: 'Court Clerk Communications', desc: 'Draft emails and letters to court clerks for scheduling, filing, and administrative matters.' },
      { icon: '🌐', title: 'Interpreter Coordination', desc: 'Identify language needs, request interpreters, and prepare multilingual client communications.' },
      { icon: '📱', title: 'Automated Check-ins', desc: 'Schedule periodic client check-ins — court date reminders, compliance follow-ups, and status updates.' },
    ],
  },
  {
    title: '💰 Billing & Practice Management',
    color: 'from-emerald-500/20 to-emerald-600/10 border-emerald-500/30',
    features: [
      { icon: '💰', title: 'Voucher Generation', desc: 'Track every minute spent on every case. Lex generates 18-B vouchers formatted exactly how your county requires.' },
      { icon: '⏱️', title: 'Time Tracking', desc: 'Start the timer when you pick up the phone, stop when you hang up. Lex logs it to the right case automatically.' },
      { icon: '📊', title: 'Caseload Dashboard', desc: 'See all active cases at a glance — upcoming dates, pending tasks, and revenue per case. Know where your time is going.' },
      { icon: '🧾', title: 'Expense Tracking', desc: 'Log expert witness fees, investigation costs, transcript fees, and travel. Everything ready for reimbursement.' },
      { icon: '📈', title: 'Practice Analytics', desc: 'Monthly breakdowns: cases handled, win rate, average disposition time, revenue, most common charges. Data-driven practice management.' },
      { icon: '🏦', title: 'Payment Follow-up', desc: 'Track submitted vouchers, flag overdue payments, and generate follow-up requests to the Assigned Counsel office.' },
    ],
  },
  {
    title: '🎯 Trial & Court Prep',
    color: 'from-red-500/20 to-red-600/10 border-red-500/30',
    features: [
      { icon: '⚔️', title: 'Cross-Examination Prep', desc: 'Practice cross-examining witnesses with an AI that plays the hostile witness. Get scored and coached on technique.' },
      { icon: '🎯', title: 'Direct Examination', desc: 'Rehearse direct examination of your client or defense witnesses. Lex ensures you cover every necessary element.' },
      { icon: '📝', title: 'Opening & Closing Statements', desc: 'Draft compelling opening statements and closing arguments tailored to your theory of the case.' },
      { icon: '🗂️', title: 'Exhibit Preparation', desc: 'Organize trial exhibits, prepare exhibit lists, and ensure proper foundation for each piece of evidence.' },
      { icon: '👥', title: 'Jury Selection Assistance', desc: 'Prepare voir dire questions, identify favorable juror profiles, and track strikes during selection.' },
      { icon: '📋', title: 'Hearing Checklists', desc: 'Pre-hearing checklists for Huntley, Mapp, Wade, Dunaway, and other suppression hearings. Never miss an issue.' },
    ],
  },
  {
    title: '🧠 AI-Powered Intelligence',
    color: 'from-indigo-500/20 to-indigo-600/10 border-indigo-500/30',
    features: [
      { icon: '🧠', title: 'Learns Your Practice', desc: 'Lex remembers your writing style, favorite statutes, common arguments, and preferred formatting. Gets better every time you use it.' },
      { icon: '👥', title: 'Multi-Agent Analysis', desc: 'Simulate a full courtroom: prosecutor, defense, judge, and jury analyst all weigh in on your case strategy.' },
      { icon: '🔴', title: 'Red Team Your Case', desc: 'Lex plays devil\'s advocate — what would the strongest prosecutor do? Find the holes before the DA does.' },
      { icon: '🎤', title: 'Voice Commands', desc: 'Walking to court? Dictate instructions to Lex. "Draft a bail app for Jones, arraignment tomorrow morning, charged with PL 160.10."' },
      { icon: '🔄', title: 'Case Pattern Recognition', desc: 'Lex identifies patterns across your cases — recurring issues, successful strategies, and areas for improvement.' },
      { icon: '📱', title: 'Always Available', desc: '3 AM before trial? Weekend client crisis? Lex is ready 24/7. No overtime, no complaints, no sick days.' },
    ],
  },
  {
    title: '🏛️ Family Court Specific',
    color: 'from-pink-500/20 to-pink-600/10 border-pink-500/30',
    features: [
      { icon: '👨‍👩‍👧', title: 'Custody Analysis', desc: 'Analyze best interests factors under DRL §240. Document strengths and weaknesses for custody/visitation arguments.' },
      { icon: '🛡️', title: 'Order of Protection', desc: 'Draft OP petitions and responses. Track expiration dates, modification requests, and compliance.' },
      { icon: '📋', title: 'PINS & JD Cases', desc: 'Navigate PINS diversion, JD proceedings, and dispositional alternatives. Track probation contacts and program compliance.' },
      { icon: '👶', title: 'Child Support Calculations', desc: 'Run CSSA calculations, prepare financial disclosure affidavits, and draft modification petitions.' },
      { icon: '🏠', title: 'Permanency Planning', desc: 'Track permanency hearing dates, prepare reports, and draft foster care review submissions.' },
      { icon: '📞', title: 'ACS/CPS Coordination', desc: 'Draft responses to ACS investigations, prepare for 1028 hearings, and coordinate with caseworkers.' },
    ],
  },
];

const USE_CASES = [
  { scenario: '"Schedule a client visit at Rikers for Thursday afternoon and send him a letter about the plea offer"', category: 'Scheduling' },
  { scenario: '"I just got assigned People v. Martinez — run the complaint, check the arresting officer, and tell me what I\'m working with"', category: 'Case Intake' },
  { scenario: '"Draft a CPL 30.30 motion — they\'ve been adjourning this for 8 months and I count at least 120 chargeable days"', category: 'Motion Drafting' },
  { scenario: '"What\'s my calendar look like next week? Any deadlines I should worry about?"', category: 'Calendar' },
  { scenario: '"Prep me for the Huntley hearing tomorrow — the cop says my client made a statement at the precinct"', category: 'Court Prep' },
  { scenario: '"Generate my vouchers for last month — I need to submit them by Friday"', category: 'Billing' },
  { scenario: '"Find Second Department cases where identification testimony was suppressed due to suggestive lineup procedures"', category: 'Research' },
  { scenario: '"Red-team my trial strategy for the robbery case — what would a good ADA do to destroy my defense?"', category: 'Analysis' },
  { scenario: '"Draft a letter to Judge Thompson requesting an adjournment — my client needs to complete the program first"', category: 'Communications' },
  { scenario: '"Calculate the CSSA child support obligation — father earns $85K, mother earns $42K, two children"', category: 'Family Law' },
  { scenario: '"My client just called from the jail — log the call and remind me to follow up on the alibi witness Thursday"', category: 'Client Mgmt' },
  { scenario: '"Give me a morning briefing — what do I have today and what\'s urgent?"', category: 'Daily Briefing' },
];

const STEPS = [
  { num: '1', title: 'Click the Gold Button', desc: 'Look for the ⚖️ button in the bottom-right corner of any page. That\'s Lex — always ready.' },
  { num: '2', title: 'Ask or Speak', desc: 'Type your request or hit the mic button and just talk. Lex understands legal context — speak naturally.' },
  { num: '3', title: 'Get Results Instantly', desc: 'Lex delivers drafts, research, analysis, schedules, and more. Copy, edit, and use in your practice.' },
];

const PAIN_POINTS = [
  { problem: 'Missed court dates and deadlines', solution: 'Lex tracks every date and alerts you proactively' },
  { problem: 'Hours spent drafting routine motions', solution: 'Lex drafts them in seconds with proper citations' },
  { problem: 'Jail calls you can\'t return fast enough', solution: 'Lex logs calls and drafts follow-up letters' },
  { problem: 'Vouchers submitted late or incomplete', solution: 'Automatic time tracking and voucher generation' },
  { problem: 'Unprepared for hearings due to overload', solution: 'Lex preps hearing checklists and key arguments' },
  { problem: 'No time for legal research', solution: 'AI-powered search across 19+ databases in seconds' },
  { problem: 'Disorganized case files', solution: 'Structured case organization with smart tagging' },
  { problem: 'Difficulty communicating with non-English clients', solution: 'Multilingual letter drafting and interpreter coordination' },
];

export default function AgentPage() {
  const [activeUseCase, setActiveUseCase] = useState(0);
  const [expandedCategory, setExpandedCategory] = useState<number | null>(null);

  useEffect(() => {
    const interval = setInterval(() => {
      setActiveUseCase(c => (c + 1) % USE_CASES.length);
    }, 3500);
    return () => clearInterval(interval);
  }, []);

  const openWidget = () => {
    localStorage.setItem('acc_paralegal_open', 'true');
    window.dispatchEvent(new CustomEvent('open-paralegal'));
  };

  const totalFeatures = CATEGORIES.reduce((sum, c) => sum + c.features.length, 0);

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#0a1628] to-[#0d2137]">
      <div className="max-w-6xl mx-auto px-6 py-8">

        {/* Hero */}
        <div className="text-center mb-16 pt-4">
          <div className="w-24 h-24 mx-auto rounded-full bg-gradient-to-br from-[#D4AF37] to-[#b8941f] flex items-center justify-center mb-6 shadow-lg shadow-[#D4AF37]/20">
            <span className="text-5xl">⚖️</span>
          </div>
          <h1 className="text-4xl font-bold text-white mb-4">
            Meet <span className="text-[#D4AF37]">Lex</span>, Your Virtual Paralegal
          </h1>
          <p className="text-gray-400 text-lg max-w-3xl mx-auto leading-relaxed">
            An AI-powered paralegal built specifically for 18-B court-appointed attorneys. 
            Lex handles your calendar, drafts your motions, tracks your deadlines, manages client communications, 
            prepares you for court, and generates your vouchers — so you can focus on what matters: your clients.
          </p>
          <div className="flex items-center justify-center gap-4 mt-8 flex-wrap">
            <button
              onClick={openWidget}
              className="px-6 py-3 bg-gradient-to-r from-[#D4AF37] to-[#b8941f] text-white font-semibold rounded-xl hover:shadow-lg hover:shadow-[#D4AF37]/30 transition-all hover:scale-105"
            >
              💬 Chat with Lex Now
            </button>
            <Link
              href="/dashboard/ai-policy"
              className="px-6 py-3 bg-green-500/10 border border-green-500/20 text-green-300 font-medium rounded-xl hover:bg-green-500/20 hover:text-green-200 transition-all"
            >
              🔒 AI Policy & Privilege →
            </Link>
            <Link
              href="/dashboard/copilot"
              className="px-6 py-3 bg-white/5 border border-white/10 text-gray-300 font-medium rounded-xl hover:bg-white/10 hover:text-white transition-all"
            >
              Full Co-Pilot AI →
            </Link>
          </div>
          <div className="flex items-center justify-center gap-6 mt-6 text-sm text-gray-500">
            <span className="flex items-center gap-1.5"><span className="text-[#D4AF37] font-bold">{totalFeatures}</span> capabilities</span>
            <span className="flex items-center gap-1.5"><span className="text-[#D4AF37] font-bold">8</span> categories</span>
            <span className="flex items-center gap-1.5"><span className="text-[#D4AF37] font-bold">24/7</span> availability</span>
          </div>
        </div>

        {/* Pain Points → Solutions */}
        <div className="mb-16">
          <h2 className="text-2xl font-bold text-white mb-2 text-center">The 18-B Struggle Is Real</h2>
          <p className="text-gray-400 text-center mb-8">Every problem below costs you time, money, or both. Lex fixes them.</p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3 max-w-4xl mx-auto">
            {PAIN_POINTS.map((p, i) => (
              <div key={i} className="flex items-start gap-3 bg-white/5 border border-white/10 rounded-xl p-4 hover:bg-white/[0.07] transition-all">
                <div className="mt-0.5">
                  <span className="text-red-400 text-sm">✗</span>
                </div>
                <div className="flex-1">
                  <div className="text-gray-300 text-sm line-through decoration-red-400/50">{p.problem}</div>
                  <div className="text-[#D4AF37] text-sm mt-1 font-medium">✓ {p.solution}</div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Live Use Case Carousel */}
        <div className="mb-16">
          <div className="bg-white/5 border border-white/10 rounded-2xl p-6 max-w-3xl mx-auto">
            <div className="text-xs text-gray-500 uppercase tracking-wider mb-3 font-medium">Try saying...</div>
            <div className="min-h-[60px] flex items-center">
              <div className="flex-1">
                <p className="text-white text-lg font-medium italic">{USE_CASES[activeUseCase].scenario}</p>
                <span className="inline-block mt-2 text-xs bg-[#D4AF37]/20 text-[#D4AF37] px-2 py-0.5 rounded-full">
                  {USE_CASES[activeUseCase].category}
                </span>
              </div>
            </div>
            <div className="flex gap-1.5 mt-4 flex-wrap">
              {USE_CASES.map((_, i) => (
                <button
                  key={i}
                  onClick={() => setActiveUseCase(i)}
                  className={`h-1 rounded-full transition-all duration-300 ${
                    i === activeUseCase ? 'w-8 bg-[#D4AF37]' : 'w-2 bg-white/20 hover:bg-white/30'
                  }`}
                />
              ))}
            </div>
          </div>
        </div>

        {/* Feature Categories */}
        <div className="mb-16">
          <h2 className="text-2xl font-bold text-white mb-2 text-center">Everything Lex Can Do</h2>
          <p className="text-gray-400 text-center mb-8">{totalFeatures} capabilities across {CATEGORIES.length} categories — and growing</p>
          
          <div className="space-y-4">
            {CATEGORIES.map((cat, ci) => (
              <div key={ci} className={`bg-gradient-to-r ${cat.color} border rounded-xl overflow-hidden transition-all`}>
                <button
                  onClick={() => setExpandedCategory(expandedCategory === ci ? null : ci)}
                  className="w-full flex items-center justify-between px-5 py-4 text-left"
                >
                  <div className="flex items-center gap-3">
                    <h3 className="text-white font-semibold text-lg">{cat.title}</h3>
                    <span className="text-xs bg-white/10 text-gray-300 px-2 py-0.5 rounded-full">{cat.features.length} features</span>
                  </div>
                  <svg
                    width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"
                    className={`text-gray-400 transition-transform duration-300 ${expandedCategory === ci ? 'rotate-180' : ''}`}
                  >
                    <polyline points="6 9 12 15 18 9" />
                  </svg>
                </button>
                
                {expandedCategory === ci && (
                  <div className="px-5 pb-5">
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                      {cat.features.map((f, fi) => (
                        <div key={fi} className="bg-black/20 rounded-lg p-3 hover:bg-black/30 transition-colors">
                          <div className="flex items-start gap-2">
                            <span className="text-lg">{f.icon}</span>
                            <div>
                              <h4 className="text-white font-medium text-sm">{f.title}</h4>
                              <p className="text-gray-400 text-xs mt-1 leading-relaxed">{f.desc}</p>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* A Day in the Life */}
        <div className="mb-16">
          <h2 className="text-2xl font-bold text-white mb-2 text-center">A Day with Lex</h2>
          <p className="text-gray-400 text-center mb-8">Here&apos;s what your typical day looks like with a virtual paralegal</p>
          <div className="max-w-3xl mx-auto space-y-4">
            {[
              { time: '7:30 AM', event: '☀️ Morning Briefing', detail: '"Good morning. You have 3 court appearances today. The Martinez motion deadline is tomorrow — I\'ve drafted it, ready for review. Two client calls to return."' },
              { time: '8:45 AM', event: '🏛️ Arraignment Part', detail: 'Walking to court, you dictate: "Pull up the complaint for People v. Davis." Lex reads it back, flags the CPL 30.30 issue, and suggests a bail argument.' },
              { time: '10:30 AM', event: '📞 Client Calls', detail: 'Between cases, you return 4 jail calls. After each, you tell Lex what was discussed. Lex logs it, sets follow-ups, and drafts a letter to one client\'s mother.' },
              { time: '1:00 PM', event: '📝 Motion Work', detail: '"Lex, update the Martinez suppression motion — add the Second Department case we discussed." Done in 30 seconds.' },
              { time: '3:00 PM', event: '⚖️ Hearing Prep', detail: 'Tomorrow\'s Huntley hearing: Lex walks you through the cross-examination of the detective, flags inconsistencies in the DD5s, and generates your exhibit list.' },
              { time: '5:30 PM', event: '💰 Vouchers', detail: '"Generate my vouchers for the week." Lex compiles all tracked time across 12 cases into properly formatted 18-B vouchers.' },
              { time: '11:00 PM', event: '🌙 Late Night Prep', detail: 'Can\'t sleep before trial? "Lex, red-team my opening statement." Get a prosecutor\'s perspective on your theory of the case.' },
            ].map((item, i) => (
              <div key={i} className="flex gap-4 bg-white/5 border border-white/10 rounded-xl p-4 hover:bg-white/[0.07] transition-all">
                <div className="text-xs text-[#D4AF37] font-mono w-16 pt-1 shrink-0">{item.time}</div>
                <div>
                  <div className="text-white font-medium text-sm">{item.event}</div>
                  <div className="text-gray-400 text-sm mt-1 italic">{item.detail}</div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* How It Works */}
        <div className="mb-16">
          <h2 className="text-2xl font-bold text-white mb-8 text-center">Getting Started</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-4xl mx-auto">
            {STEPS.map((step, i) => (
              <div key={i} className="text-center">
                <div className="w-12 h-12 mx-auto rounded-full bg-[#D4AF37]/20 border border-[#D4AF37]/30 flex items-center justify-center text-[#D4AF37] font-bold text-lg mb-4">
                  {step.num}
                </div>
                <h3 className="text-white font-semibold mb-2">{step.title}</h3>
                <p className="text-gray-400 text-sm">{step.desc}</p>
              </div>
            ))}
          </div>
        </div>

        {/* RAG Architecture */}
        <div className="mb-16">
          <h2 className="text-2xl font-bold text-white mb-2 text-center">🧠 How Lex Thinks</h2>
          <p className="text-gray-400 text-center mb-8">Enterprise-grade RAG architecture that grounds every answer in real legal authority</p>

          {/* Pipeline Visual */}
          <div className="max-w-4xl mx-auto bg-white/5 border border-white/10 rounded-2xl p-6 mb-6">
            <h3 className="text-white font-semibold mb-4">Retrieval-Augmented Generation (RAG) Pipeline</h3>
            <p className="text-gray-400 text-sm mb-5">
              Unlike basic ChatGPT which relies solely on its training data (and often hallucinates), Lex uses a 
              multi-stage RAG pipeline that retrieves real legal authority before generating any response.
            </p>
            <div className="space-y-3">
              {[
                { num: '1', icon: '📄', title: 'Document Ingestion', desc: 'Your case files, discovery, pleadings, and evidence are chunked into ~500-token semantic segments with 50-token overlap to preserve context across boundaries. Each chunk is tagged with source, document type, and case ID.' },
                { num: '2', icon: '🔢', title: 'Vector Embedding (1024-dim)', desc: 'Each chunk is converted into a high-dimensional vector using legal-domain-optimized embeddings. Legal terms (motion, statute, evidence, court, defendant) receive enhanced weighting — so "motion to suppress" matches "Mapp hearing" semantically, not just by keywords.' },
                { num: '3', icon: '📚', title: 'Multi-Source Knowledge Base', desc: 'Lex draws from 6 distinct knowledge sources simultaneously: your uploaded documents, case law (CourtListener + 19 databases), NY statutes (Penal Law, CPL, DRL, FCA), our 107+ entry Legal Wiki, crowdsourced practice tips, and live real-time research results.' },
                { num: '4', icon: '🎯', title: 'Semantic Search & Retrieval', desc: 'Your question is embedded into the same vector space and compared against all indexed chunks using cosine similarity. The top-5 most relevant chunks are retrieved (minimum relevance threshold: 0.3), filtered by case and source type. This is why Lex finds relevant authority even when you don\'t use the exact legal terminology.' },
                { num: '5', icon: '💉', title: 'Context-Augmented Prompting', desc: 'Retrieved chunks are injected directly into the AI prompt as grounding context with explicit instructions: cite your sources, reference specific documents, and if the context doesn\'t contain the answer, say so — never fabricate.' },
                { num: '6', icon: '✅', title: 'Citation Verification & Cross-Check', desc: 'In Citation Mode, every legal claim requires a citation. Our citation parser validates formats against standard patterns. Multi-Agent mode runs 8 independent AI perspectives on the same issue — inconsistencies and unsupported claims surface immediately.' },
              ].map((step, i) => (
                <div key={i} className="flex items-start gap-3 bg-white/5 rounded-xl p-3">
                  <div className="w-7 h-7 rounded-full bg-[#D4AF37]/20 border border-[#D4AF37]/30 flex items-center justify-center text-[#D4AF37] font-bold text-xs shrink-0 mt-0.5">
                    {step.num}
                  </div>
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <span>{step.icon}</span>
                      <h4 className="text-white font-semibold text-sm">{step.title}</h4>
                    </div>
                    <p className="text-gray-400 text-xs leading-relaxed">{step.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Knowledge Sources Grid */}
          <div className="max-w-4xl mx-auto mb-6">
            <h3 className="text-white font-semibold mb-3 text-center">6 Knowledge Sources, Searched Simultaneously</h3>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
              {[
                { icon: '📄', name: 'Your Documents', desc: 'Discovery, pleadings, evidence, police reports, medical records — everything you upload', color: 'from-blue-500/20 to-blue-600/10 border-blue-500/30' },
                { icon: '⚖️', name: 'Case Law (19+ DBs)', desc: 'CourtListener, Westlaw, LexisNexis, Bloomberg, and 15 more legal databases', color: 'from-purple-500/20 to-purple-600/10 border-purple-500/30' },
                { icon: '📜', name: 'NY Statutes', desc: 'Penal Law, CPL, DRL, Family Court Act, Vehicle & Traffic Law — full text indexed', color: 'from-amber-500/20 to-amber-600/10 border-amber-500/30' },
                { icon: '📖', name: 'Legal Wiki (107+)', desc: 'Community-edited entries on procedures, defenses, standards, and practice tips', color: 'from-green-500/20 to-green-600/10 border-green-500/30' },
                { icon: '👥', name: 'Crowdsourced Intel', desc: 'Practice tips, local court rules, judge preferences from the 18-B community', color: 'from-pink-500/20 to-pink-600/10 border-pink-500/30' },
                { icon: '🔍', name: 'Live Research', desc: 'Real-time searches across legal databases triggered by your specific question', color: 'from-indigo-500/20 to-indigo-600/10 border-indigo-500/30' },
              ].map((src, i) => (
                <div key={i} className={`bg-gradient-to-br ${src.color} border rounded-xl p-4`}>
                  <div className="text-2xl mb-2">{src.icon}</div>
                  <h4 className="text-white font-semibold text-sm mb-1">{src.name}</h4>
                  <p className="text-gray-400 text-xs leading-relaxed">{src.desc}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Anti-Hallucination */}
          <div className="max-w-4xl mx-auto">
            <h3 className="text-white font-semibold mb-3 text-center">5 Layers of Anti-Hallucination Protection</h3>
            <div className="grid grid-cols-1 md:grid-cols-5 gap-2">
              {[
                { icon: '🎯', label: 'RAG Grounding', desc: 'Answers anchored to retrieved documents' },
                { icon: '📚', label: 'Citation Mode', desc: 'Every claim requires legal authority' },
                { icon: '👥', label: '8-Agent Cross-Check', desc: 'Multiple AI perspectives catch errors' },
                { icon: '⚔️', label: 'Red Team Analysis', desc: 'Adversarial AI finds weak arguments' },
                { icon: '🔍', label: 'Source Attribution', desc: 'Every fact traced to its origin' },
              ].map((layer, i) => (
                <div key={i} className="bg-white/5 border border-white/10 rounded-xl p-3 text-center">
                  <div className="text-xl mb-1">{layer.icon}</div>
                  <div className="text-white font-medium text-xs mb-0.5">{layer.label}</div>
                  <div className="text-gray-500 text-[10px] leading-tight">{layer.desc}</div>
                </div>
              ))}
            </div>
          </div>

          <div className="text-center mt-6">
            <Link href="/dashboard/ai-policy" className="text-sm text-[#D4AF37] hover:text-[#e8c54a] font-medium transition-colors">
              Read the full technical deep-dive on our AI Policy page →
            </Link>
          </div>
        </div>

        {/* Privacy & Privilege Protection */}
        <div className="mb-16">
          <h2 className="text-2xl font-bold text-white mb-2 text-center">🔒 Attorney-Client Privilege Protected</h2>
          <p className="text-gray-400 text-center mb-8">Enterprise-grade enterprise architecture — your client data never trains AI models</p>
          
          <div className="max-w-4xl mx-auto space-y-4">
            {/* Architecture Overview */}
            <div className="bg-gradient-to-r from-green-500/10 to-green-600/5 border border-green-500/20 rounded-xl p-6">
              <h3 className="text-white font-semibold text-lg mb-3 flex items-center gap-2">
                <span className="w-8 h-8 rounded-full bg-green-500/20 flex items-center justify-center text-green-400 text-sm">1</span>
                Private, Isolated Processing
              </h3>
              <p className="text-gray-300 text-sm leading-relaxed">
                Unlike public ChatGPT, 18B Lawyer uses <strong className="text-white">enterprise API endpoints</strong> from Cerebras and Groq. 
                Your data is processed in isolated environments — never mixed with other customers&apos; data. 
                The AI model processes your request, returns the answer, and the interaction is immediately purged from the provider&apos;s inference servers.
              </p>
            </div>

            <div className="bg-gradient-to-r from-blue-500/10 to-blue-600/5 border border-blue-500/20 rounded-xl p-6">
              <h3 className="text-white font-semibold text-lg mb-3 flex items-center gap-2">
                <span className="w-8 h-8 rounded-full bg-blue-500/20 flex items-center justify-center text-blue-400 text-sm">2</span>
                Zero Training on Your Data
              </h3>
              <p className="text-gray-300 text-sm leading-relaxed">
                <strong className="text-white">Your client&apos;s secrets will never be learned by the AI.</strong> All providers used by 18B Lawyer 
                contractually guarantee that API inputs and outputs are <strong className="text-white">never used to train</strong> their foundational models. 
                We use pre-trained, frozen models that do not &quot;learn&quot; from your case files. Your data goes in, the answer comes out, and nothing is retained.
              </p>
            </div>

            <div className="bg-gradient-to-r from-purple-500/10 to-purple-600/5 border border-purple-500/20 rounded-xl p-6">
              <h3 className="text-white font-semibold text-lg mb-3 flex items-center gap-2">
                <span className="w-8 h-8 rounded-full bg-purple-500/20 flex items-center justify-center text-purple-400 text-sm">3</span>
                The &quot;Agent&quot; Exception — Privilege Intact
              </h3>
              <p className="text-gray-300 text-sm leading-relaxed">
                Attorney-client privilege has a well-established exception for <strong className="text-white">agents of the lawyer</strong> — paralegals, 
                translators, forensic accountants, and technology vendors. 18B Lawyer operates as your agent, bound by strict confidentiality. 
                This is the same legal framework that allows firms to use cloud email, document management systems, and e-discovery platforms 
                without waiving privilege. The vendor is contractually barred from using your data for any purpose beyond processing your request.
              </p>
            </div>

            <div className="bg-gradient-to-r from-amber-500/10 to-amber-600/5 border border-amber-500/20 rounded-xl p-6">
              <h3 className="text-white font-semibold text-lg mb-3 flex items-center gap-2">
                <span className="w-8 h-8 rounded-full bg-amber-500/20 flex items-center justify-center text-amber-400 text-sm">4</span>
                Zero Data Retention — Pass-Through Only
              </h3>
              <p className="text-gray-300 text-sm leading-relaxed">
                18B Lawyer operates as a <strong className="text-white">pass-through processor</strong>. Your prompt is sent to the AI model, 
                the response is generated, and the data is immediately deleted from the inference server. No chat logs are retained on the AI provider&apos;s side. 
                Conversation history is stored <strong className="text-white">only on your local device</strong> (in your browser&apos;s localStorage) — 
                never on our servers.
              </p>
            </div>
          </div>

          {/* Comparison Table */}
          <div className="max-w-4xl mx-auto mt-8">
            <div className="bg-white/5 border border-white/10 rounded-xl overflow-hidden">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-white/10">
                    <th className="text-left text-gray-400 font-medium px-4 py-3">Feature</th>
                    <th className="text-center text-red-400 font-medium px-4 py-3">Public ChatGPT</th>
                    <th className="text-center text-green-400 font-medium px-4 py-3">18B Lawyer</th>
                  </tr>
                </thead>
                <tbody className="text-gray-300">
                  <tr className="border-b border-white/5">
                    <td className="px-4 py-2.5">API Endpoint</td>
                    <td className="px-4 py-2.5 text-center text-red-300">Public, shared</td>
                    <td className="px-4 py-2.5 text-center text-green-300">Enterprise, isolated</td>
                  </tr>
                  <tr className="border-b border-white/5">
                    <td className="px-4 py-2.5">Model Training</td>
                    <td className="px-4 py-2.5 text-center text-red-300">Trains on your data</td>
                    <td className="px-4 py-2.5 text-center text-green-300">Never trains on data</td>
                  </tr>
                  <tr className="border-b border-white/5">
                    <td className="px-4 py-2.5">Data Retention</td>
                    <td className="px-4 py-2.5 text-center text-red-300">Retains chat history</td>
                    <td className="px-4 py-2.5 text-center text-green-300">Zero retention (pass-through)</td>
                  </tr>
                  <tr className="border-b border-white/5">
                    <td className="px-4 py-2.5">Staff Access</td>
                    <td className="px-4 py-2.5 text-center text-red-300">May be reviewed</td>
                    <td className="px-4 py-2.5 text-center text-green-300">No human access</td>
                  </tr>
                  <tr className="border-b border-white/5">
                    <td className="px-4 py-2.5">Data Storage</td>
                    <td className="px-4 py-2.5 text-center text-red-300">Cloud servers</td>
                    <td className="px-4 py-2.5 text-center text-green-300">Your device only (localStorage)</td>
                  </tr>
                  <tr>
                    <td className="px-4 py-2.5 font-medium text-white">Privilege Risk</td>
                    <td className="px-4 py-2.5 text-center"><span className="bg-red-500/20 text-red-300 px-2 py-0.5 rounded-full text-xs font-medium">HIGH</span></td>
                    <td className="px-4 py-2.5 text-center"><span className="bg-green-500/20 text-green-300 px-2 py-0.5 rounded-full text-xs font-medium">PROTECTED</span></td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* Your Workspace */}
        <WorkspaceSection />

        {/* CTA */}
        <div className="text-center py-12">
          <div className="bg-gradient-to-r from-[#D4AF37]/10 to-transparent border border-[#D4AF37]/20 rounded-2xl p-8 max-w-2xl mx-auto">
            <h2 className="text-2xl font-bold text-white mb-3">Stop drowning in paperwork.</h2>
            <p className="text-gray-400 mb-6">The average 18-B attorney spends 40% of their time on administrative tasks. Lex gives you that time back — for your clients, your practice, and your life.</p>
            <button
              onClick={openWidget}
              className="px-8 py-3 bg-gradient-to-r from-[#D4AF37] to-[#b8941f] text-white font-semibold rounded-xl hover:shadow-lg hover:shadow-[#D4AF37]/30 transition-all hover:scale-105"
            >
              ⚖️ Start Working with Lex
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

function WorkspaceSection() {
  const [messageCount, setMessageCount] = useState(0);
  const [lastActive, setLastActive] = useState<string>('—');

  useEffect(() => {
    try {
      const hist = localStorage.getItem('acc_paralegal_history_default');
      if (hist) setMessageCount(JSON.parse(hist).length);
      const ws = localStorage.getItem('acc_paralegal_workspace_default');
      if (ws) {
        const parsed = JSON.parse(ws);
        if (parsed.lastActive) setLastActive(new Date(parsed.lastActive).toLocaleDateString());
      }
    } catch {}
  }, []);

  return (
    <div className="mb-16">
      <h2 className="text-2xl font-bold text-white mb-2 text-center">Your Workspace</h2>
      <p className="text-gray-400 text-center mb-8">Lex maintains a personal workspace just for you — it gets smarter over time</p>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 max-w-4xl mx-auto">
        <div className="bg-white/5 border border-white/10 rounded-xl p-5 text-center">
          <div className="text-3xl font-bold text-[#D4AF37]">{messageCount}</div>
          <div className="text-gray-400 text-sm mt-1">Messages Exchanged</div>
        </div>
        <div className="bg-white/5 border border-white/10 rounded-xl p-5 text-center">
          <div className="text-3xl font-bold text-[#D4AF37]">{lastActive}</div>
          <div className="text-gray-400 text-sm mt-1">Last Active</div>
        </div>
        <div className="bg-white/5 border border-white/10 rounded-xl p-5 text-center">
          <div className="text-3xl font-bold text-[#D4AF37]">∞</div>
          <div className="text-gray-400 text-sm mt-1">Memory Capacity</div>
        </div>
      </div>
    </div>
  );
}
