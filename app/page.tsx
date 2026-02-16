'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';
import { getBrand, type Brand } from '@/lib/branding';

export default function Home() {
  const [brand, setBrand] = useState<Brand | null>(null);
  useEffect(() => { setBrand(getBrand()); }, []);
  if (!brand) return <div className="min-h-screen bg-[#07090f]" />; // flash prevention

  return (
    <main className="min-h-screen flex flex-col font-sans text-gray-900 bg-[#07090f]">

      {/* Navigation */}
      <nav className="sticky top-0 z-50 bg-[#07090f]/90 backdrop-blur-xl border-b border-white/5">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 h-16 sm:h-20 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2.5">
            {brand.logoText === 'scales' ? (
              <img src="/logo-icon.svg" alt={brand.name} className="w-9 h-9" />
            ) : (
              <div className="w-9 h-9 bg-gradient-to-br from-[#D4AF37] to-[#b8941f] rounded-xl flex items-center justify-center shadow-lg shadow-[#D4AF37]/20">
                <span className="text-white font-black text-sm">{brand.logoText}</span>
              </div>
            )}
            <div className="hidden sm:block">
              <span className="text-lg font-bold text-white tracking-tight">{brand.name}</span>
            </div>
          </Link>
          <div className="hidden lg:flex items-center gap-8">
            <Link href="#problem" className="text-[13px] text-gray-400 font-medium hover:text-white transition-colors">Why {brand.name}</Link>
            <Link href="#features" className="text-[13px] text-gray-400 font-medium hover:text-white transition-colors">Features</Link>
            <Link href="#ai" className="text-[13px] text-gray-400 font-medium hover:text-white transition-colors">AI Engine</Link>
            <Link href="#security" className="text-[13px] text-gray-400 font-medium hover:text-white transition-colors">Security</Link>
            <Link href="#lex" className="text-[13px] text-gray-400 font-medium hover:text-white transition-colors">Meet Lex</Link>
          </div>
          <div className="flex items-center gap-3">
            <Link href="/login" className="text-sm text-gray-400 font-medium hover:text-white transition-colors hidden sm:block">Log In</Link>
            <Link href="/dashboard" className="bg-gradient-to-r from-[#D4AF37] to-[#c9a632] text-[#07090f] px-5 py-2.5 rounded-xl font-bold text-sm hover:shadow-lg hover:shadow-[#D4AF37]/30 hover:-translate-y-0.5 transition-all duration-300">
              Start Free Trial
            </Link>
          </div>
        </div>
      </nav>

      {/* ═══════════════════ HERO ═══════════════════ */}
      <section className="relative pt-20 sm:pt-28 md:pt-36 pb-16 sm:pb-24 overflow-hidden">
        <div className="absolute inset-0">
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[800px] bg-[#D4AF37]/[0.04] rounded-full blur-[150px]"></div>
          <div className="absolute bottom-0 right-0 w-[400px] h-[400px] bg-blue-500/[0.03] rounded-full blur-[100px]"></div>
        </div>
        
        <div className="max-w-7xl mx-auto px-4 sm:px-6 relative z-10">
          <div className="text-center max-w-4xl mx-auto">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/[0.04] border border-white/[0.08] mb-8">
              <span className="w-2 h-2 bg-emerald-400 rounded-full animate-pulse"></span>
              <span className="text-[#D4AF37] text-xs font-semibold">{brand.badgeText}</span>
            </div>
            
            <h1 className="text-[2.75rem] sm:text-6xl md:text-[5rem] font-black text-white leading-[1.05] tracking-tight mb-7">
              {brand.heroHeadline.split('\n').map((line, i, arr) => (
                <span key={i}>{i === 1 ? <span className="bg-gradient-to-r from-[#D4AF37] via-[#e8c54a] to-[#D4AF37] bg-clip-text text-transparent">{line}</span> : line}{i < arr.length - 1 && <br/>}</span>
              ))}
            </h1>
            
            <p className="text-lg sm:text-xl text-gray-400 max-w-2xl mx-auto mb-4 leading-relaxed">{brand.heroSub}</p>
            <p className="text-sm text-gray-500 max-w-xl mx-auto mb-10">{brand.heroDetail}</p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12">
              <Link href="/dashboard" className="group bg-gradient-to-r from-[#D4AF37] to-[#c9a632] text-[#07090f] px-10 py-4 rounded-xl font-bold text-lg shadow-xl shadow-[#D4AF37]/20 hover:shadow-2xl hover:shadow-[#D4AF37]/30 hover:-translate-y-1 transition-all duration-300">
                Start Your Free Trial
                <span className="inline-block ml-2 group-hover:translate-x-1 transition-transform">→</span>
              </Link>
              <Link href="/dashboard/ai-policy" className="px-10 py-4 rounded-xl border border-white/15 text-white font-bold text-lg hover:bg-white/5 hover:border-white/25 transition-all duration-300">
                See the Architecture
              </Link>
            </div>

            {/* Trust row */}
            <div className="flex flex-wrap justify-center gap-x-6 gap-y-2 text-[13px] text-gray-500">
              <span className="flex items-center gap-1.5"><span className="text-emerald-400">✓</span> No credit card required</span>
              <span className="flex items-center gap-1.5"><span className="text-emerald-400">✓</span> Privilege-safe architecture</span>
              <span className="flex items-center gap-1.5"><span className="text-emerald-400">✓</span> Zero data retention</span>
              <span className="flex items-center gap-1.5"><span className="text-emerald-400">✓</span> ABA & NYSBA compliant</span>
            </div>
          </div>
        </div>
      </section>

      {/* ═══════════════════ THE PROBLEM ═══════════════════ */}
      <section id="problem" className="py-20 sm:py-28 border-t border-white/5">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="max-w-3xl mx-auto text-center mb-16">
            <p className="text-red-400 text-sm font-semibold uppercase tracking-widest mb-4">The Problem</p>
            <h2 className="text-3xl sm:text-4xl font-bold text-white mb-6 leading-tight">{brand.problemTitle}</h2>
            <p className="text-gray-400 text-lg leading-relaxed">{brand.problemDesc}</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-5xl mx-auto">
            {brand.painCards.map((p, i) => (
              <div key={i} className="bg-red-500/[0.04] border border-red-500/10 rounded-2xl p-6 hover:bg-red-500/[0.06] transition-all">
                <span className="text-3xl block mb-3">{p.icon}</span>
                <div className="text-red-400 text-xs font-bold uppercase tracking-wider mb-2">{p.stat}</div>
                <h3 className="text-white font-bold mb-2">{p.pain}</h3>
                <p className="text-gray-500 text-sm leading-relaxed">{p.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ═══════════════════ THE SOLUTION ═══════════════════ */}
      <section className="py-20 sm:py-28 relative">
        <div className="absolute inset-0 bg-gradient-to-b from-[#D4AF37]/[0.02] via-transparent to-transparent"></div>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 relative z-10">
          <div className="max-w-3xl mx-auto text-center mb-16">
            <p className="text-[#D4AF37] text-sm font-semibold uppercase tracking-widest mb-4">The Solution</p>
            <h2 className="text-3xl sm:text-4xl font-bold text-white mb-6 leading-tight">{brand.solutionTitle}</h2>
            <p className="text-gray-400 text-lg leading-relaxed">{brand.solutionDesc}</p>
          </div>

          {/* By the numbers */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 max-w-4xl mx-auto mb-16">
            {[
              { num: '19+', label: 'Legal Databases', sub: 'One search bar' },
              { num: '3', label: 'AI Models', sub: 'Auto-routed by task' },
              { num: '48', label: 'Paralegal Actions', sub: 'From Lex, your AI assistant' },
              { num: '107+', label: 'Wiki Entries', sub: 'Community-edited' },
            ].map((s, i) => (
              <div key={i} className="bg-white/[0.03] border border-white/[0.06] rounded-2xl p-5 text-center">
                <p className="text-3xl font-black text-[#D4AF37]">{s.num}</p>
                <p className="text-white text-sm font-semibold mt-1">{s.label}</p>
                <p className="text-gray-600 text-xs mt-0.5">{s.sub}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ═══════════════════ NY-SPECIFIC SECTION (18blawyer.xyz only) ═══════════════════ */}
      {brand.isNY && (
        <section className="py-20 sm:py-28 border-t border-white/5 relative">
          <div className="absolute inset-0 bg-gradient-to-b from-blue-500/[0.02] via-transparent to-transparent"></div>
          <div className="max-w-7xl mx-auto px-4 sm:px-6 relative z-10">
            <div className="text-center mb-16">
              <p className="text-[#D4AF37] text-sm font-semibold uppercase tracking-widest mb-4">Built for New York</p>
              <h2 className="text-3xl sm:text-4xl font-bold text-white mb-4">Every statute. Every court. Every borough.</h2>
              <p className="text-gray-400 text-lg max-w-2xl mx-auto">18B Lawyer isn&apos;t a generic legal tool with a NY label. The entire platform is built around the statutes, procedures, and courts you actually practice in.</p>
            </div>

            {/* NY Law Coverage */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 max-w-5xl mx-auto mb-12">
              {[
                { icon: '⚖️', title: 'NY Penal Law', desc: 'Full coverage of Article 120 (Assault), 125 (Homicide), 130 (Sex Offenses), 140 (Burglary), 155 (Larceny), 160 (Robbery), 220/221 (Drug Offenses), and every other article.', tag: 'Criminal' },
                { icon: '📜', title: 'Criminal Procedure Law', desc: 'CPL 30.30 speedy trial, CPL 170/180 (arraignment), CPL 245 (discovery reform), CPL 510 (bail reform), CPL 710 (suppression), CPL 730 (mental health), and Article 440 (post-conviction).', tag: 'Procedure' },
                { icon: '👨‍👩‍👧', title: 'Family Court Act', desc: 'Article 10 (abuse/neglect), Article 3 (juvenile delinquency), custody and visitation, orders of protection, PINS proceedings, and family offense petitions.', tag: 'Family' },
                { icon: '💍', title: 'Domestic Relations Law', desc: 'DRL 170 (grounds for divorce), DRL 236B (equitable distribution), maintenance calculations, child support standards, and prenuptial agreements.', tag: 'Family' },
                { icon: '🚗', title: 'Vehicle & Traffic Law', desc: 'VTL 1192 (DWI/DWAI), aggravated DWI, Leandra\'s Law, license suspension/revocation, DMV hearings, and conditional licenses.', tag: 'Traffic' },
                { icon: '🏛️', title: 'NY Court System', desc: 'Criminal Court, Supreme Court, Family Court, County Court, Appellate Division (1st-4th Dept), Court of Appeals — procedures and local rules for each.', tag: 'Courts' },
              ].map((law, i) => (
                <div key={i} className="bg-white/[0.03] border border-white/[0.06] rounded-xl p-5 hover:bg-white/[0.05] transition-all">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-xl">{law.icon}</span>
                    <span className="text-[9px] font-bold text-[#D4AF37] bg-[#D4AF37]/10 px-2 py-0.5 rounded-full border border-[#D4AF37]/20">{law.tag}</span>
                  </div>
                  <h4 className="text-white font-bold text-sm mb-1.5">{law.title}</h4>
                  <p className="text-gray-500 text-xs leading-relaxed">{law.desc}</p>
                </div>
              ))}
            </div>

            {/* NY-specific features */}
            <div className="max-w-4xl mx-auto">
              <h3 className="text-white font-bold text-center mb-6">New York Practice Tools</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {[
                  { icon: '🔍', title: 'Departmental Search', desc: 'Search case law filtered by Appellate Division department. Find controlling authority in your department — 1st, 2nd, 3rd, or 4th — instantly.', detail: 'Because a 2nd Dept ruling doesn\'t help you in the 4th.' },
                  { icon: '📊', title: 'Bail & Discovery Calculators', desc: 'CPL 510 bail reform analysis — instantly check if your client\'s charge is qualifying. CPL 245 discovery compliance tracker with automatic deadline calculation.', detail: 'Know your client\'s bail status before the arraignment.' },
                  { icon: '📋', title: 'NY Sentencing Guide', desc: 'Penal Law sentencing charts, predicate felony analysis, persistent felony offender status, YO eligibility, and SORA risk level assessment.', detail: 'From A-I felonies to violations — every possible sentence.' },
                  { icon: '🗺️', title: 'County-Specific Rules', desc: 'Local court rules, part assignments, judge preferences, and practice tips for every county. Contributed by the 18-B community.', detail: 'What works in Kings County might not work in Nassau.' },
                  { icon: '🛡️', title: 'Immigration Consequences', desc: 'Padilla v. Kentucky compliance. Automatic flagging of charges with immigration consequences — aggravated felonies, crimes involving moral turpitude, deportable offenses.', detail: 'Because a plea to a 221.10 might cost your client their green card.' },
                  { icon: '📞', title: 'NY Legal Aid Resources', desc: 'Quick access to Legal Aid Society hotlines, Assigned Counsel offices, NYSDA resources, ILS standards, and CLE requirements for panel attorneys.', detail: 'Every resource a NY panel attorney needs, in one place.' },
                ].map((f, i) => (
                  <div key={i} className="bg-white/[0.03] border border-white/[0.06] rounded-xl p-5 hover:bg-white/[0.05] transition-all">
                    <div className="flex items-center gap-2 mb-2">
                      <span className="text-lg">{f.icon}</span>
                      <h4 className="text-white font-bold text-sm">{f.title}</h4>
                    </div>
                    <p className="text-gray-400 text-xs leading-relaxed mb-2">{f.desc}</p>
                    <p className="text-gray-600 text-[10px] italic">{f.detail}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* NY Courts Coverage */}
            <div className="max-w-4xl mx-auto mt-12 bg-white/[0.02] border border-white/[0.05] rounded-2xl p-6">
              <h3 className="text-white font-bold text-center mb-4">We Cover Every Court You Practice In</h3>
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-3">
                {[
                  'Manhattan Criminal', 'Brooklyn Criminal', 'Bronx Criminal', 'Queens Criminal', 'Staten Island Criminal',
                  'NY Supreme Court', 'Kings Supreme', 'Bronx Supreme', 'Queens Supreme', 'Nassau County',
                  'Suffolk County', 'Westchester County', 'Rockland County', 'Orange County', 'Family Court (all)',
                ].map((court, i) => (
                  <div key={i} className="bg-white/[0.03] rounded-lg px-3 py-2 text-center">
                    <span className="text-[10px] text-gray-400 font-medium">{court}</span>
                  </div>
                ))}
              </div>
              <p className="text-center text-gray-600 text-[10px] mt-3">+ every other county and city court across New York State</p>
            </div>
          </div>
        </section>
      )}

      {/* ═══════════════════ FEATURES (Detailed) ═══════════════════ */}
      <section id="features" className="py-20 sm:py-28 border-t border-white/5">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="text-center mb-16">
            <p className="text-[#D4AF37] text-sm font-semibold uppercase tracking-widest mb-4">Features</p>
            <h2 className="text-3xl sm:text-4xl font-bold text-white mb-4">Everything. In one platform.</h2>
            <p className="text-gray-400 text-lg max-w-2xl mx-auto">{brand.isNY ? 'A complete practice management system built for New York criminal defense and family law — with AI woven into every feature.' : 'Not a collection of half-finished tools. A complete practice management system with AI woven into every feature.'}</p>
          </div>

          {/* Feature deep-dives — alternating layout */}
          <div className="space-y-16 max-w-5xl mx-auto">
            
            {/* 1. Research Desk */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
              <div>
                <div className="inline-flex items-center gap-2 px-3 py-1 bg-blue-500/10 border border-blue-500/20 rounded-full text-blue-400 text-xs font-bold mb-4">🔍 RESEARCH DESK</div>
                <h3 className="text-2xl font-bold text-white mb-3">19 legal databases. One search.</h3>
                <p className="text-gray-400 mb-4 leading-relaxed">Stop opening 6 tabs. Search CourtListener, Westlaw, LexisNexis, Bloomberg Law, RECAP, Google Scholar, Justia, and 12 more databases from a single search bar. Get AI-generated summaries of your results instantly.</p>
                <ul className="space-y-2">
                  {['CourtListener, Google Scholar, RECAP, Justia (free — always on)', 'Westlaw, LexisNexis, Bloomberg Law (connect your subscription)', '12 more: HeinOnline, Fastcase, vLex, JSTOR, Oxford, Cambridge, ProQuest...', 'AI summaries via multi-model engine — not generic ChatGPT'].map((item, i) => (
                    <li key={i} className="flex items-start gap-2 text-sm text-gray-500"><span className="text-[#D4AF37] mt-0.5 shrink-0">▸</span>{item}</li>
                  ))}
                </ul>
              </div>
              <div className="bg-white/[0.03] border border-white/[0.06] rounded-2xl p-6">
                <div className="bg-white/[0.05] rounded-xl p-4 mb-3">
                  <div className="flex items-center gap-2 mb-3">
                    <div className="flex-1 bg-white/10 rounded-lg px-3 py-2 text-sm text-gray-400">Search: &quot;Mapp v. Ohio suppression standard 2nd dept&quot;</div>
                    <div className="px-3 py-2 bg-[#D4AF37] rounded-lg text-[10px] font-bold text-[#07090f]">Search</div>
                  </div>
                  <div className="flex flex-wrap gap-1.5">
                    {['CourtListener', 'Scholar', 'RECAP', 'Westlaw', 'Lexis+', 'Bloomberg'].map((s, i) => (
                      <span key={i} className={`text-[10px] px-2 py-0.5 rounded-full font-medium ${i < 4 ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/20' : 'bg-blue-500/20 text-blue-400 border border-blue-500/20'}`}>{s} {i < 4 ? '✓' : '🔗'}</span>
                    ))}
                  </div>
                </div>
                <div className="space-y-2">
                  {['People v. De Bour — 4 levels of police-citizen encounters...', 'Mapp v. Ohio, 367 U.S. 643 — Exclusionary rule applies...', 'People v. Cantor — Stop-and-frisk standards in NY...'].map((r, i) => (
                    <div key={i} className="bg-white/[0.03] rounded-lg px-3 py-2">
                      <p className="text-xs text-gray-300 font-medium">{r}</p>
                      <p className="text-[10px] text-gray-600 mt-0.5">CourtListener • Relevance: 94%</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* 2. Virtual Paralegal Lex */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
              <div className="order-2 lg:order-1 bg-white/[0.03] border border-white/[0.06] rounded-2xl p-6">
                <div className="flex items-center gap-2 mb-4 pb-3 border-b border-white/10">
                  <div className="w-8 h-8 bg-gradient-to-br from-[#D4AF37] to-[#b8941f] rounded-lg flex items-center justify-center text-white text-xs font-bold">Lex</div>
                  <div><p className="text-white text-sm font-bold">Lex — Virtual Paralegal</p><p className="text-[10px] text-gray-500">🔒 Privilege-Safe • Online</p></div>
                </div>
                <div className="space-y-3">
                  <div className="bg-white/[0.03] rounded-xl px-3 py-2 max-w-[85%]">
                    <p className="text-xs text-gray-300">Lex, email my client Maria Rodriguez about the plea offer and prep me for tomorrow&apos;s hearing.</p>
                  </div>
                  <div className="bg-[#D4AF37]/10 rounded-xl px-3 py-2 max-w-[90%] ml-auto border border-[#D4AF37]/20">
                    <p className="text-xs text-gray-300">Done. Here&apos;s what I did:</p>
                    <div className="mt-1.5 space-y-1">
                      <p className="text-[10px] text-gray-400">✅ <strong className="text-white">Emailed Maria</strong> — summarized the plea offer (ACD w/ 6 months community service), next steps, and your recommendation. Draft attached for your review.</p>
                      <p className="text-[10px] text-gray-400">✅ <strong className="text-white">Tomorrow&apos;s prep</strong> — Your 9:30 is a Huntley hearing in Part 23. I pulled the officer&apos;s prior testimony from the last suppression hearing and flagged 3 inconsistencies.</p>
                      <p className="text-[10px] text-gray-400">⚠️ <strong className="text-white">Heads up</strong> — Discovery deadline on the Johnson case is Friday. DA hasn&apos;t responded to your 245 demand yet.</p>
                    </div>
                  </div>
                  <div className="flex gap-1.5 flex-wrap">
                    {['Email Client', 'Court Prep', 'Chase Discovery', 'Draft Motion', 'Track Fees'].map((a, i) => (
                      <span key={i} className="text-[10px] px-2 py-1 rounded-lg bg-white/5 border border-white/10 text-gray-400 font-medium">{a}</span>
                    ))}
                  </div>
                </div>
              </div>
              <div className="order-1 lg:order-2">
                <div className="inline-flex items-center gap-2 px-3 py-1 bg-[#D4AF37]/10 border border-[#D4AF37]/20 rounded-full text-[#D4AF37] text-xs font-bold mb-4">⚖️ VIRTUAL PARALEGAL</div>
                <h3 className="text-2xl font-bold text-white mb-3">Meet Lex. Not a chatbot — a teammate.</h3>
                <p className="text-gray-400 mb-4 leading-relaxed">Lex doesn&apos;t just answer questions. Lex <em className="text-white">does things</em>. Draft and send client emails. File follow-ups with the court. Chase down outstanding fees. Prep you for tomorrow&apos;s calendar. 48 capabilities across 8 practice areas — the paralegal you always needed but could never afford.</p>
                
                {/* Agentic workflow highlights */}
                <div className="grid grid-cols-2 gap-2 mb-4">
                  {[
                    { icon: '📧', label: 'Email Clients', desc: 'Draft and send updates, plea offers, scheduling' },
                    { icon: '🏛️', label: 'Court Filing', desc: 'Prepare filings, track deadlines, calendar sync' },
                    { icon: '📞', label: 'Follow-ups', desc: 'Chase witness statements, collect documents' },
                    { icon: '💰', label: 'Collections', desc: 'Track outstanding fees, send payment reminders' },
                    { icon: '📋', label: 'Case Intake', desc: 'Process new assignments, pull prior history' },
                    { icon: '📅', label: 'Calendar Mgmt', desc: 'Prep briefs for tomorrow, flag conflicts' },
                  ].map((w, i) => (
                    <div key={i} className="bg-white/[0.03] border border-white/[0.06] rounded-lg px-3 py-2">
                      <div className="flex items-center gap-1.5 mb-0.5">
                        <span className="text-sm">{w.icon}</span>
                        <span className="text-white text-xs font-bold">{w.label}</span>
                      </div>
                      <p className="text-gray-500 text-[10px] leading-tight">{w.desc}</p>
                    </div>
                  ))}
                </div>

                <ul className="space-y-2">
                  {['Draft motions, briefs, letters — and email them to clients', 'Research case law with sourced citations — no hallucination', 'Manage court deadlines, schedule appearances, flag conflicts', 'Follow up on discovery, witness statements, and documents', 'Track fees, send collection reminders, generate vouchers', 'Remembers your cases, preferences, and workflow per session'].map((item, i) => (
                    <li key={i} className="flex items-start gap-2 text-sm text-gray-500"><span className="text-[#D4AF37] mt-0.5 shrink-0">▸</span>{item}</li>
                  ))}
                </ul>
              </div>
            </div>

            {/* 3. Trial Prep */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
              <div>
                <div className="inline-flex items-center gap-2 px-3 py-1 bg-red-500/10 border border-red-500/20 rounded-full text-red-400 text-xs font-bold mb-4">⚔️ TRIAL & DEPOSITION PREP</div>
                <h3 className="text-2xl font-bold text-white mb-3">Practice your examination before the courtroom.</h3>
                <p className="text-gray-400 mb-4 leading-relaxed">Upload your case documents, and our AI becomes the witness. Practice cross-examination, direct examination, and deposition questioning with an AI that responds based on your actual case file — using RAG to stay in character with real evidence.</p>
                <ul className="space-y-2">
                  {['Three modes: Cross-Examination, Direct, and Deposition', 'Upload case files as RAG context — AI stays in character', 'Real-time scoring on technique, relevance, and strategy', 'Voice dictation — practice like you\'re in court', 'Session history tracks your improvement over time'].map((item, i) => (
                    <li key={i} className="flex items-start gap-2 text-sm text-gray-500"><span className="text-[#D4AF37] mt-0.5 shrink-0">▸</span>{item}</li>
                  ))}
                </ul>
              </div>
              <div className="bg-white/[0.03] border border-white/[0.06] rounded-2xl p-6">
                <div className="flex items-center gap-2 mb-4 pb-3 border-b border-white/10">
                  <span className="text-lg">⚔️</span>
                  <p className="text-white text-sm font-bold">Cross-Examination Mode</p>
                  <span className="text-[10px] px-2 py-0.5 bg-red-500/20 text-red-400 rounded-full font-bold ml-auto">LIVE</span>
                </div>
                <div className="space-y-2 mb-4">
                  <div className="bg-blue-500/10 rounded-lg px-3 py-2">
                    <p className="text-[10px] text-blue-400 font-bold mb-0.5">YOU (Attorney)</p>
                    <p className="text-xs text-gray-300">&quot;Officer, you testified that you observed the defendant for 30 seconds before approaching. Can you tell us what lighting conditions were present?&quot;</p>
                  </div>
                  <div className="bg-red-500/10 rounded-lg px-3 py-2">
                    <p className="text-[10px] text-red-400 font-bold mb-0.5">AI WITNESS (Based on police report)</p>
                    <p className="text-xs text-gray-300">&quot;It was nighttime, but there were streetlights in the area.&quot;</p>
                  </div>
                </div>
                <div className="bg-emerald-500/10 border border-emerald-500/20 rounded-lg px-3 py-2">
                  <p className="text-[10px] text-emerald-400 font-bold mb-0.5">📊 Technique Score: 87/100</p>
                  <p className="text-[10px] text-gray-500">Good foundation-setting question. Consider following up on the distance and obstructions to challenge identification.</p>
                </div>
              </div>
            </div>

            {/* 4. Co-Pilot */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
              <div className="order-2 lg:order-1 bg-white/[0.03] border border-white/[0.06] rounded-2xl p-6">
                <div className="text-xs text-gray-500 mb-3 font-mono">Co-Pilot AI → Citation Mode + Multi-Agent Analysis</div>
                <div className="space-y-2">
                  <div className="bg-white/[0.03] rounded-lg px-3 py-2">
                    <p className="text-xs text-gray-300 font-medium">🔴 Defense Attorney</p>
                    <p className="text-[10px] text-gray-500">The search was unconstitutional under De Bour Level 3...</p>
                  </div>
                  <div className="bg-white/[0.03] rounded-lg px-3 py-2">
                    <p className="text-xs text-gray-300 font-medium">🔵 Prosecutor</p>
                    <p className="text-[10px] text-gray-500">The officer had reasonable suspicion based on the radio call...</p>
                  </div>
                  <div className="bg-white/[0.03] rounded-lg px-3 py-2">
                    <p className="text-xs text-gray-300 font-medium">⚖️ Judge</p>
                    <p className="text-[10px] text-gray-500">The temporal gap between the call and the stop is troubling...</p>
                  </div>
                  <div className="bg-red-500/10 border border-red-500/20 rounded-lg px-3 py-2">
                    <p className="text-xs text-red-400 font-medium">🎯 Red Team</p>
                    <p className="text-[10px] text-gray-500">Weakness: no testimony on whether defendant matched the radio description...</p>
                  </div>
                </div>
              </div>
              <div className="order-1 lg:order-2">
                <div className="inline-flex items-center gap-2 px-3 py-1 bg-purple-500/10 border border-purple-500/20 rounded-full text-purple-400 text-xs font-bold mb-4">🤖 CO-PILOT AI</div>
                <h3 className="text-2xl font-bold text-white mb-3">8 AI perspectives on every legal issue.</h3>
                <p className="text-gray-400 mb-4 leading-relaxed">Don&apos;t just get one AI opinion. Multi-Agent Analysis runs 8 independent AI perspectives — defense attorney, prosecutor, judge, appellate specialist, constitutional scholar, procedural expert, red team, and strategist — on the same issue simultaneously.</p>
                <ul className="space-y-2">
                  {['Citation Mode: every claim requires legal authority', 'Red Team: adversarial AI finds your weak arguments first', 'Voice dictation: talk through your case naturally', 'Multi-model routing: fast model for chat, deep reasoning for analysis', 'Export drafts directly to your case file'].map((item, i) => (
                    <li key={i} className="flex items-start gap-2 text-sm text-gray-500"><span className="text-[#D4AF37] mt-0.5 shrink-0">▸</span>{item}</li>
                  ))}
                </ul>
              </div>
            </div>
          </div>

          {/* More features grid */}
          <div className="mt-20">
            <h3 className="text-xl font-bold text-white text-center mb-8">And that&apos;s not all.</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 max-w-5xl mx-auto">
              {[
                { icon: '📰', title: 'Legal Intelligence', desc: 'Live feeds from CourtListener, SCOTUSblog, NACDL, The Appeal, and more. Personalized to your active cases.' },
                { icon: '📖', title: 'Legal Wiki (107+)', desc: brand.isNY ? 'Community-edited entries covering NY Penal Law, CPL, DRL, Family Court Act, bail reform (CPL 510), discovery (CPL 245), Raise the Age, and more.' : 'Community-edited entries on criminal defense and family law. Bail reform, discovery, custody, sentencing guidelines, and practice tips.' },
                { icon: '📋', title: 'Mission Control', desc: 'Enterprise dashboard: interactive calendar, time tracker, file management, tasks, case overview — your whole practice.' },
                { icon: '💰', title: 'Voucher & Billing', desc: 'Track billable hours, generate compliant vouchers, monitor PSLF progress. Stop doing unpaid admin work.' },
                { icon: '🎓', title: 'PSLF Tracking', desc: 'Track progress toward student loan forgiveness. Automated payment counting for qualifying 18-B panel work.' },
                { icon: '🎙️', title: 'Voice Dictation', desc: 'Built into every text field. Research, draft, chat with Lex, and prep for trial — all by voice.' },
                { icon: '🗄️', title: 'Database Manager', desc: 'Connect your Westlaw, Lexis, Bloomberg subscriptions. Manage connected databases from your dashboard.' },
                { icon: '⏱️', title: 'Time Tracker', desc: 'Start/pause/resume timer with descriptions. Auto-calculates daily and weekly totals. No more manual time sheets.' },
              ].map((f, i) => (
                <div key={i} className="bg-white/[0.03] border border-white/[0.06] rounded-xl p-5 hover:bg-white/[0.05] hover:border-white/[0.1] transition-all">
                  <span className="text-xl block mb-2">{f.icon}</span>
                  <h4 className="text-white font-bold text-sm mb-1.5">{f.title}</h4>
                  <p className="text-gray-500 text-xs leading-relaxed">{f.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ═══════════════════ AI ENGINE ═══════════════════ */}
      <section id="ai" className="py-20 sm:py-28 border-t border-white/5 relative">
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-blue-500/[0.015] to-transparent"></div>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 relative z-10">
          <div className="text-center mb-16">
            <p className="text-[#D4AF37] text-sm font-semibold uppercase tracking-widest mb-4">AI Architecture</p>
            <h2 className="text-3xl sm:text-4xl font-bold text-white mb-4">Not a chatbot wrapper. An AI engine.</h2>
            <p className="text-gray-400 text-lg max-w-2xl mx-auto">Retrieval-Augmented Generation (RAG) grounds every answer in real legal authority. Three specialized models route automatically based on what you&apos;re doing.</p>
          </div>

          {/* RAG Pipeline */}
          <div className="max-w-4xl mx-auto mb-16">
            <h3 className="text-white font-bold text-center mb-6">6-Step RAG Pipeline</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {[
                { step: '1', title: 'Ingest', desc: 'Case files chunked into ~500-token segments with context-preserving overlap', icon: '📄' },
                { step: '2', title: 'Embed', desc: 'Legal-domain vectors (1024-dim). "Motion to suppress" ↔ "Mapp hearing"', icon: '🔢' },
                { step: '3', title: 'Index', desc: '6 knowledge sources: your docs, 19+ databases, statutes, wiki, tips, live search', icon: '📚' },
                { step: '4', title: 'Retrieve', desc: 'Cosine similarity finds the most relevant legal authority for your question', icon: '🎯' },
                { step: '5', title: 'Ground', desc: 'Retrieved sources injected into prompt. AI cites your documents, can\'t fabricate', icon: '💉' },
                { step: '6', title: 'Verify', desc: '8-agent cross-check + citation validation + red team adversarial review', icon: '✅' },
              ].map((s, i) => (
                <div key={i} className="bg-white/[0.03] border border-white/[0.06] rounded-xl p-5 relative overflow-hidden group hover:bg-white/[0.05] transition-all">
                  <div className="text-[#D4AF37]/10 text-5xl font-black absolute -top-2 -right-1 group-hover:text-[#D4AF37]/20 transition-colors">{s.step}</div>
                  <span className="text-xl block mb-2">{s.icon}</span>
                  <h4 className="text-white font-bold text-sm mb-1">{s.title}</h4>
                  <p className="text-gray-500 text-xs leading-relaxed">{s.desc}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Model routing */}
          <div className="max-w-4xl mx-auto">
            <h3 className="text-white font-bold text-center mb-6">Intelligent Model Routing</h3>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              {[
                { name: 'Fast Inference', speed: '~2,100 tok/s', tasks: 'Chat, Drafting, Quick Answers', icon: '⚡', color: 'from-yellow-500/10 to-yellow-600/5 border-yellow-500/20', desc: 'Sub-second responses for everyday legal questions and draft generation' },
                { name: 'Deep Reasoning', speed: '~2,600 tok/s', tasks: 'Research, Analysis, Citations', icon: '🧠', color: 'from-purple-500/10 to-purple-600/5 border-purple-500/20', desc: 'Extended chain-of-thought reasoning for complex legal analysis' },
                { name: 'Max Comprehension', speed: '~3,000 tok/s', tasks: 'Summaries, Document Synthesis', icon: '📊', color: 'from-blue-500/10 to-blue-600/5 border-blue-500/20', desc: 'Highest comprehension for analyzing long documents and case files' },
              ].map((m, i) => (
                <div key={i} className={`bg-gradient-to-br ${m.color} border rounded-xl p-6 text-center`}>
                  <span className="text-3xl block mb-2">{m.icon}</span>
                  <h4 className="text-white font-bold">{m.name}</h4>
                  <p className="text-[#D4AF37] text-xs font-mono mt-1 mb-2">{m.speed}</p>
                  <p className="text-gray-500 text-[11px] mb-2">{m.desc}</p>
                  <p className="text-gray-600 text-[10px] font-semibold uppercase tracking-wider">{m.tasks}</p>
                </div>
              ))}
            </div>
            <p className="text-center text-gray-600 text-xs mt-4">The right model is selected automatically. You never have to think about it.</p>
          </div>
        </div>
      </section>

      {/* ═══════════════════ SECURITY ═══════════════════ */}
      <section id="security" className="py-20 sm:py-28 border-t border-white/5">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="text-center mb-16">
            <p className="text-[#D4AF37] text-sm font-semibold uppercase tracking-widest mb-4">Trust & Security</p>
            <h2 className="text-3xl sm:text-4xl font-bold text-white mb-4">Your client&apos;s secrets stay secret.</h2>
            <p className="text-gray-400 text-lg max-w-2xl mx-auto">Built to meet the same security and compliance standards as the leading legal AI platforms trusted by Am Law 100 firms.</p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 max-w-5xl mx-auto mb-8">
            {[
              { icon: '🔒', title: 'Zero Data Retention', desc: 'Your queries are processed and immediately discarded. Nothing is stored on AI provider servers. Ever.' },
              { icon: '🚫', title: 'No Training on Your Data', desc: 'Your client information never trains or improves any AI model. Contractually guaranteed by enterprise API agreements.' },
              { icon: '🛡️', title: 'Privilege-Safe Architecture', desc: 'Designed under the Kovel doctrine and ABA Formal Opinion 477R. AI operates as an agent of counsel.' },
              { icon: '📜', title: 'Full Regulatory Compliance', desc: 'NY Rules 1.1, 1.6, 5.3. ABA Model Rules. NYSBA Ethics Opinion 1228. We don\'t just comply — we exceed.' },
            ].map((s, i) => (
              <div key={i} className="bg-white/[0.03] border border-white/[0.06] rounded-xl p-5">
                <span className="text-2xl block mb-3">{s.icon}</span>
                <h4 className="text-white font-bold text-sm mb-2">{s.title}</h4>
                <p className="text-gray-500 text-xs leading-relaxed">{s.desc}</p>
              </div>
            ))}
          </div>

          {/* Comparison */}
          <div className="max-w-3xl mx-auto bg-white/[0.02] border border-white/[0.06] rounded-2xl overflow-hidden">
            <div className="px-6 py-4 border-b border-white/[0.06]">
              <h3 className="text-white font-bold">How we compare to enterprise legal AI</h3>
              <p className="text-gray-500 text-xs">Same protections. Fraction of the cost.</p>
            </div>
            <div className="divide-y divide-white/[0.04]">
              {[
                { feature: 'Enterprise API (no public ChatGPT)', us: true, them: true },
                { feature: 'Zero data retention', us: true, them: true },
                { feature: 'No training on client data', us: true, them: true },
                { feature: 'RAG-grounded responses', us: true, them: true },
                { feature: 'Multi-model routing', us: true, them: true },
                { feature: 'Citation verification', us: true, them: true },
                { feature: 'ABA/NYSBA compliance', us: true, them: true },
                { feature: 'Criminal defense focus', us: true, them: false },
                { feature: 'Family law tools', us: true, them: false },
                { feature: 'Built for 18-B panels', us: true, them: false },
                { feature: 'Free tier available', us: true, them: false },
              ].map((row, i) => (
                <div key={i} className="flex items-center px-6 py-3">
                  <span className="flex-1 text-sm text-gray-400">{row.feature}</span>
                  <span className="w-20 text-center text-sm">{row.us ? '✅' : '—'}</span>
                  <span className="w-20 text-center text-sm">{row.them ? '✅' : '—'}</span>
                </div>
              ))}
              <div className="flex items-center px-6 py-3 bg-[#D4AF37]/[0.03]">
                <span className="flex-1 text-sm font-bold text-white">Price per seat</span>
                <span className="w-20 text-center text-sm font-bold text-[#D4AF37]">Free</span>
                <span className="w-20 text-center text-sm font-bold text-gray-500">$2,000+</span>
              </div>
            </div>
            <div className="flex px-6 py-2 border-t border-white/[0.04]">
              <span className="flex-1"></span>
              <span className="w-20 text-center text-[10px] text-gray-500 font-bold">{brand.name}</span>
              <span className="w-20 text-center text-[10px] text-gray-500 font-bold">Enterprise AI</span>
            </div>
          </div>

          <div className="text-center mt-8">
            <Link href="/dashboard/ai-policy" className="text-[#D4AF37] text-sm font-semibold hover:text-white transition-colors">
              Read our full AI Policy & Architecture documentation →
            </Link>
          </div>
        </div>
      </section>

      {/* ═══════════════════ DAY IN THE LIFE ═══════════════════ */}
      <section id="lex" className="py-20 sm:py-28 border-t border-white/5 relative">
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-[#D4AF37]/[0.01] to-transparent"></div>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 relative z-10">
          <div className="text-center mb-16">
            <p className="text-[#D4AF37] text-sm font-semibold uppercase tracking-widest mb-4">{brand.dayTitle}</p>
            <h2 className="text-3xl sm:text-4xl font-bold text-white mb-4">From arraignment to disposition.</h2>
            <p className="text-gray-400 text-lg max-w-2xl mx-auto">{brand.dayDesc}</p>
          </div>

          <div className="max-w-3xl mx-auto">
            {brand.daySteps.map((item, i) => (
              <div key={i} className="flex gap-5 items-start mb-6 group">
                <div className="w-16 shrink-0 text-right pt-1">
                  <span className="text-xs font-mono font-bold text-[#D4AF37]">{item.time}</span>
                </div>
                <div className="w-px bg-white/10 shrink-0 self-stretch relative">
                  <div className="absolute top-1.5 left-1/2 -translate-x-1/2 w-3 h-3 rounded-full bg-[#D4AF37]/20 border-2 border-[#D4AF37]/40 group-hover:bg-[#D4AF37]/40 transition-colors"></div>
                </div>
                <div className="flex-1 bg-white/[0.02] border border-white/[0.05] rounded-xl p-4 hover:bg-white/[0.04] hover:border-white/[0.1] transition-all">
                  <div className="flex items-center gap-2 mb-1">
                    <span>{item.icon}</span>
                    <h4 className="text-white font-bold text-sm">{item.title}</h4>
                  </div>
                  <p className="text-gray-500 text-xs leading-relaxed">{item.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ═══════════════════ FINAL CTA ═══════════════════ */}
      <section className="py-24 sm:py-32 relative overflow-hidden border-t border-white/5">
        <div className="absolute inset-0">
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[700px] bg-[#D4AF37]/[0.06] rounded-full blur-[180px]"></div>
        </div>
        
        <div className="max-w-4xl mx-auto px-4 sm:px-6 relative z-10 text-center">
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-black text-white mb-6 leading-tight whitespace-pre-line">
            {brand.ctaFinal.split('\n').map((line, i, arr) => (
              <span key={i}>{i === arr.length - 1 ? <span className="bg-gradient-to-r from-[#D4AF37] to-[#e8c54a] bg-clip-text text-transparent">{line}</span> : line}{i < arr.length - 1 && <br/>}</span>
            ))}
          </h2>
          <p className="text-lg text-gray-400 max-w-2xl mx-auto mb-10 leading-relaxed">{brand.ctaSubtext}</p>
          <Link href="/dashboard" className="group inline-block bg-gradient-to-r from-[#D4AF37] to-[#c9a632] text-[#07090f] px-12 py-5 rounded-xl font-black text-xl shadow-2xl shadow-[#D4AF37]/25 hover:shadow-[#D4AF37]/40 hover:-translate-y-1 transition-all duration-300">
            Start Your Free Trial
            <span className="inline-block ml-2 group-hover:translate-x-1 transition-transform">→</span>
          </Link>
          <p className="mt-6 text-sm text-gray-500">No credit card. No lock-in. Just better tools for better defense.</p>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-white/5 py-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="flex flex-col md:flex-row items-center justify-between gap-6">
            <div className="flex items-center gap-3">
              {brand.logoText === 'scales' ? (
                <img src="/logo-icon.svg" alt={brand.name} className="w-8 h-8" />
              ) : (
                <div className="w-8 h-8 bg-gradient-to-br from-[#D4AF37] to-[#b8941f] rounded-xl flex items-center justify-center">
                  <span className="text-white font-bold text-xs">{brand.logoText}</span>
                </div>
              )}
              <span className="text-sm font-semibold text-gray-400">{brand.name}</span>
            </div>
            <div className="flex flex-wrap justify-center gap-6 text-sm text-gray-500">
              <Link href="/dashboard/ai-policy" className="hover:text-white transition-colors">AI Policy</Link>
              <Link href="/dashboard/agent" className="hover:text-white transition-colors">Virtual Paralegal</Link>
              <Link href="/dashboard/wiki" className="hover:text-white transition-colors">Legal Wiki</Link>
              <Link href="/dashboard/research" className="hover:text-white transition-colors">Research</Link>
              <Link href="/login" className="hover:text-white transition-colors">Log In</Link>
            </div>
            <p className="text-xs text-gray-600">&copy; 2026 {brand.name}. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </main>
  );
}
