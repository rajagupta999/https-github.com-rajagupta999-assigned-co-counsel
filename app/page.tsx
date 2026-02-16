'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';
import { getBrand, type Brand } from '@/lib/branding';

export default function Home() {
  const [brand, setBrand] = useState<Brand | null>(null);
  useEffect(() => { setBrand(getBrand()); }, []);
  if (!brand) return <div className="min-h-screen bg-[#07090f]" />;

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
            <Link href="#staff" className="text-[13px] text-gray-400 font-medium hover:text-white transition-colors">Your AI Staff</Link>
            <Link href="#hybrid" className="text-[13px] text-gray-400 font-medium hover:text-white transition-colors">Hybrid Practice</Link>
            <Link href="#features" className="text-[13px] text-gray-400 font-medium hover:text-white transition-colors">Features</Link>
            <Link href="#security" className="text-[13px] text-gray-400 font-medium hover:text-white transition-colors">Security</Link>
            <Link href="/dashboard/prose" className="text-[13px] text-gray-500 font-medium hover:text-gray-300 transition-colors">Self-Rep Help →</Link>
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
              <span className="text-[#D4AF37] text-xs font-semibold">Your Complete AI Legal Staff</span>
            </div>
            
            <h1 className="text-[2.75rem] sm:text-6xl md:text-[5rem] font-black text-white leading-[1.05] tracking-tight mb-7">
              Stop practicing solo.
              <br />
              <span className="bg-gradient-to-r from-[#D4AF37] via-[#e8c54a] to-[#D4AF37] bg-clip-text text-transparent">Hire your AI staff.</span>
            </h1>
            
            <p className="text-lg sm:text-xl text-gray-400 max-w-2xl mx-auto mb-4 leading-relaxed">
              Three AI agents that work like a real team — a virtual assistant, a research desk, and a paralegal — so you can focus on what only a lawyer can do: advocate.
            </p>
            <p className="text-sm text-gray-500 max-w-xl mx-auto mb-10">
              Built for assigned counsel and private practitioners. One platform for your entire practice.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12">
              <Link href="/dashboard" className="group bg-gradient-to-r from-[#D4AF37] to-[#c9a632] text-[#07090f] px-10 py-4 rounded-xl font-bold text-lg shadow-xl shadow-[#D4AF37]/20 hover:shadow-2xl hover:shadow-[#D4AF37]/30 hover:-translate-y-1 transition-all duration-300">
                Meet Your Team
                <span className="inline-block ml-2 group-hover:translate-x-1 transition-transform">→</span>
              </Link>
              <Link href="#staff" className="px-10 py-4 rounded-xl border border-white/15 text-white font-bold text-lg hover:bg-white/5 hover:border-white/25 transition-all duration-300">
                See How It Works
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

      {/* ═══════════════════ YOUR AI STAFF ═══════════════════ */}
      <section id="staff" className="py-20 sm:py-28 border-t border-white/5">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="max-w-3xl mx-auto text-center mb-16">
            <p className="text-[#D4AF37] text-sm font-semibold uppercase tracking-widest mb-4">Your AI Staff</p>
            <h2 className="text-3xl sm:text-4xl font-bold text-white mb-6 leading-tight">Three agents. One team. Your practice, transformed.</h2>
            <p className="text-gray-400 text-lg leading-relaxed">Big firms have associates, paralegals, and research librarians. Now you do too — powered by AI, available 24/7, and built for how lawyers actually work.</p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 max-w-6xl mx-auto">
            
            {/* Lex — The Doer */}
            <div className="bg-white/[0.03] border border-white/[0.06] rounded-2xl p-8 hover:bg-white/[0.05] hover:border-[#D4AF37]/20 transition-all group relative overflow-hidden">
              <div className="absolute top-0 right-0 w-32 h-32 bg-[#D4AF37]/[0.03] rounded-full blur-[60px] group-hover:bg-[#D4AF37]/[0.06] transition-all"></div>
              <div className="relative z-10">
                <div className="w-16 h-16 bg-gradient-to-br from-[#D4AF37] to-[#b8941f] rounded-2xl flex items-center justify-center shadow-lg shadow-[#D4AF37]/20 mb-6">
                  <span className="text-white font-black text-lg">Lex</span>
                </div>
                <div className="inline-flex items-center gap-2 px-3 py-1 bg-[#D4AF37]/10 border border-[#D4AF37]/20 rounded-full text-[#D4AF37] text-xs font-bold mb-4">THE DOER</div>
                <h3 className="text-xl font-bold text-white mb-3">Virtual Assistant</h3>
                <p className="text-gray-400 text-sm leading-relaxed mb-5">
                  Lex handles the logistics so you can focus on lawyering. Scheduling, client emails, deadline tracking, fee collection, court prep — the paralegal you always needed but could never afford.
                </p>
                <ul className="space-y-2">
                  {['Draft & send client emails', 'Calendar management & conflict detection', 'Chase outstanding fees & discovery', 'Court prep briefs for tomorrow', 'Case intake & prior history pulls', 'Voucher generation & time tracking'].map((item, i) => (
                    <li key={i} className="flex items-start gap-2 text-xs text-gray-500"><span className="text-[#D4AF37] mt-0.5 shrink-0">▸</span>{item}</li>
                  ))}
                </ul>
                <div className="mt-5 pt-4 border-t border-white/5">
                  <p className="text-[10px] text-gray-600 italic">&quot;Lex, email my client about the plea offer and prep me for tomorrow&apos;s hearing.&quot;</p>
                </div>
              </div>
            </div>

            {/* Research Desk — The Brain */}
            <div className="bg-white/[0.03] border border-white/[0.06] rounded-2xl p-8 hover:bg-white/[0.05] hover:border-blue-500/20 transition-all group relative overflow-hidden">
              <div className="absolute top-0 right-0 w-32 h-32 bg-blue-500/[0.03] rounded-full blur-[60px] group-hover:bg-blue-500/[0.06] transition-all"></div>
              <div className="relative z-10">
                <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-blue-700 rounded-2xl flex items-center justify-center shadow-lg shadow-blue-500/20 mb-6">
                  <span className="text-3xl">🔍</span>
                </div>
                <div className="inline-flex items-center gap-2 px-3 py-1 bg-blue-500/10 border border-blue-500/20 rounded-full text-blue-400 text-xs font-bold mb-4">THE BRAIN</div>
                <h3 className="text-xl font-bold text-white mb-3">Research Desk</h3>
                <p className="text-gray-400 text-sm leading-relaxed mb-5">
                  Community-curated legal truth, not AI hallucinations. 19+ databases searched simultaneously, grounded in a RAG pipeline that cites real authority. The legal research librarian who never sleeps.
                </p>
                <ul className="space-y-2">
                  {['19 databases in one search bar', 'Community-edited Legal Wiki (107+ entries)', 'RAG-grounded — every claim has a citation', 'CourtListener, Westlaw, Lexis, Bloomberg & more', 'AI summaries with source verification', 'Departmental filtering (1st–4th Dept)'].map((item, i) => (
                    <li key={i} className="flex items-start gap-2 text-xs text-gray-500"><span className="text-blue-400 mt-0.5 shrink-0">▸</span>{item}</li>
                  ))}
                </ul>
                <div className="mt-5 pt-4 border-t border-white/5">
                  <p className="text-[10px] text-gray-600 italic">&quot;What&apos;s the Dunaway standard for anonymous 911 calls in the Second Department?&quot;</p>
                </div>
              </div>
            </div>

            {/* Virtual Paralegal — The Drafter */}
            <div className="bg-white/[0.03] border border-white/[0.06] rounded-2xl p-8 hover:bg-white/[0.05] hover:border-purple-500/20 transition-all group relative overflow-hidden">
              <div className="absolute top-0 right-0 w-32 h-32 bg-purple-500/[0.03] rounded-full blur-[60px] group-hover:bg-purple-500/[0.06] transition-all"></div>
              <div className="relative z-10">
                <div className="w-16 h-16 bg-gradient-to-br from-purple-500 to-purple-700 rounded-2xl flex items-center justify-center shadow-lg shadow-purple-500/20 mb-6">
                  <span className="text-3xl">📝</span>
                </div>
                <div className="inline-flex items-center gap-2 px-3 py-1 bg-purple-500/10 border border-purple-500/20 rounded-full text-purple-400 text-xs font-bold mb-4">THE DRAFTER</div>
                <h3 className="text-xl font-bold text-white mb-3">Virtual Paralegal</h3>
                <p className="text-gray-400 text-sm leading-relaxed mb-5">
                  Writes motions, briefs, and memos using your research — not generic templates. Multi-agent analysis runs 8 AI perspectives on your draft, and a Red Team finds the weak arguments before the DA does.
                </p>
                <ul className="space-y-2">
                  {['Draft motions from your case file (RAG)', '8-agent analysis: defense, prosecution, judge...', 'Red Team catches weak arguments first', 'Citation Mode — every claim needs authority', 'Trial prep with AI witness simulation', 'Export directly to your case file'].map((item, i) => (
                    <li key={i} className="flex items-start gap-2 text-xs text-gray-500"><span className="text-purple-400 mt-0.5 shrink-0">▸</span>{item}</li>
                  ))}
                </ul>
                <div className="mt-5 pt-4 border-t border-white/5">
                  <p className="text-[10px] text-gray-600 italic">&quot;Draft a CPL 710.20 suppression motion using the arrest report I uploaded.&quot;</p>
                </div>
              </div>
            </div>
          </div>

          {/* How they work together */}
          <div className="max-w-4xl mx-auto mt-16">
            <div className="bg-white/[0.02] border border-white/[0.06] rounded-2xl p-8">
              <h3 className="text-white font-bold text-center mb-6 text-lg">They work together — like a real team.</h3>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
                <div className="text-center">
                  <div className="text-2xl mb-2">1️⃣</div>
                  <p className="text-white text-sm font-bold mb-1">Research Desk finds the law</p>
                  <p className="text-gray-500 text-xs">Searches 19 databases, pulls relevant authority, verifies citations.</p>
                </div>
                <div className="text-center">
                  <div className="text-2xl mb-2">2️⃣</div>
                  <p className="text-white text-sm font-bold mb-1">Virtual Paralegal drafts the motion</p>
                  <p className="text-gray-500 text-xs">Uses your research + case file to write a first draft. Red Team reviews it.</p>
                </div>
                <div className="text-center">
                  <div className="text-2xl mb-2">3️⃣</div>
                  <p className="text-white text-sm font-bold mb-1">Lex handles the rest</p>
                  <p className="text-gray-500 text-xs">Emails the client, calendars the deadline, tracks the hours. You just review and file.</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ═══════════════════ HYBRID PRACTICE ═══════════════════ */}
      <section id="hybrid" className="py-20 sm:py-28 border-t border-white/5 relative">
        <div className="absolute inset-0 bg-gradient-to-b from-[#D4AF37]/[0.02] via-transparent to-transparent"></div>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 relative z-10">
          <div className="max-w-3xl mx-auto text-center mb-16">
            <p className="text-[#D4AF37] text-sm font-semibold uppercase tracking-widest mb-4">The Hybrid Practice</p>
            <h2 className="text-3xl sm:text-4xl font-bold text-white mb-6 leading-tight">
              One dashboard for your public service
              <br />
              <span className="bg-gradient-to-r from-[#D4AF37] via-[#e8c54a] to-[#D4AF37] bg-clip-text text-transparent">and your private firm.</span>
            </h2>
            <p className="text-gray-400 text-lg leading-relaxed">
              Most attorneys don&apos;t just do assigned counsel work. You have private clients too. {brand.name} handles both — unified calendar, separate billing, one AI staff for your entire practice.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-5xl mx-auto">
            {/* Assigned Counsel Side */}
            <div className="bg-white/[0.03] border border-white/[0.06] rounded-2xl p-8 relative overflow-hidden">
              <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-blue-500 to-blue-600"></div>
              <div className="flex items-center gap-3 mb-5">
                <div className="w-10 h-10 bg-blue-500/20 rounded-xl flex items-center justify-center">
                  <span className="text-xl">⚖️</span>
                </div>
                <div>
                  <h3 className="text-white font-bold">Assigned Counsel (18-B)</h3>
                  <p className="text-blue-400 text-xs font-semibold">Public Service Practice</p>
                </div>
              </div>
              <ul className="space-y-3">
                {[
                  { icon: '📋', text: 'Panel assignment intake & case tracking' },
                  { icon: '💰', text: 'Compliant voucher generation' },
                  { icon: '📊', text: 'PSLF qualifying payment tracking' },
                  { icon: '⏱️', text: 'Court-rate time tracking ($158/hr felony)' },
                  { icon: '📜', text: 'NY-specific law: CPL, Penal Law, DRL, FCA' },
                  { icon: '🏛️', text: 'County & part-specific court rules' },
                ].map((item, i) => (
                  <li key={i} className="flex items-center gap-3 text-sm text-gray-400">
                    <span className="text-lg shrink-0">{item.icon}</span>
                    {item.text}
                  </li>
                ))}
              </ul>
            </div>

            {/* Private Practice Side */}
            <div className="bg-white/[0.03] border border-white/[0.06] rounded-2xl p-8 relative overflow-hidden">
              <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-[#D4AF37] to-[#e8c54a]"></div>
              <div className="flex items-center gap-3 mb-5">
                <div className="w-10 h-10 bg-[#D4AF37]/20 rounded-xl flex items-center justify-center">
                  <span className="text-xl">🏢</span>
                </div>
                <div>
                  <h3 className="text-white font-bold">Private Practice</h3>
                  <p className="text-[#D4AF37] text-xs font-semibold">Your Own Firm</p>
                </div>
              </div>
              <ul className="space-y-3">
                {[
                  { icon: '🧲', text: 'Client acquisition & intake pipeline' },
                  { icon: '💵', text: 'Custom billing rates & invoicing' },
                  { icon: '📈', text: 'Revenue tracking & practice analytics' },
                  { icon: '📧', text: 'Automated client communications' },
                  { icon: '📁', text: 'Full case management & file storage' },
                  { icon: '🎯', text: 'Marketing & online presence tools' },
                ].map((item, i) => (
                  <li key={i} className="flex items-center gap-3 text-sm text-gray-400">
                    <span className="text-lg shrink-0">{item.icon}</span>
                    {item.text}
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* Unified features */}
          <div className="max-w-5xl mx-auto mt-8">
            <div className="bg-gradient-to-r from-blue-500/[0.05] via-white/[0.03] to-[#D4AF37]/[0.05] border border-white/[0.06] rounded-2xl p-6">
              <h4 className="text-white font-bold text-center mb-4">Unified Across Both Practices</h4>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                {[
                  { icon: '📅', label: 'One Calendar', desc: 'All appearances, all deadlines' },
                  { icon: '🤖', label: 'One AI Staff', desc: 'Lex knows all your cases' },
                  { icon: '🔍', label: 'One Research Desk', desc: 'Search once, use everywhere' },
                  { icon: '💼', label: 'Separate Billing', desc: 'Vouchers + private invoices' },
                ].map((item, i) => (
                  <div key={i} className="text-center">
                    <span className="text-2xl block mb-1">{item.icon}</span>
                    <p className="text-white text-xs font-bold">{item.label}</p>
                    <p className="text-gray-500 text-[10px]">{item.desc}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ═══════════════════ CLIENT ACQUISITION ═══════════════════ */}
      <section className="py-20 sm:py-28 border-t border-white/5">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="max-w-3xl mx-auto text-center mb-16">
            <p className="text-[#D4AF37] text-sm font-semibold uppercase tracking-widest mb-4">Grow Your Private Practice</p>
            <h2 className="text-3xl sm:text-4xl font-bold text-white mb-6 leading-tight">Turn your reputation into revenue.</h2>
            <p className="text-gray-400 text-lg leading-relaxed">You&apos;re already a great lawyer. Now get the tools to market yourself, capture leads, and convert consultations into retained clients — without hiring a marketing team.</p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 max-w-5xl mx-auto">
            {[
              { icon: '🌐', title: 'Professional Profile', desc: 'A polished online presence that showcases your practice areas, experience, and results. SEO-optimized for local search.', tag: 'Visibility' },
              { icon: '📞', title: 'Lead Capture', desc: 'Intake forms, consultation scheduling, and automated follow-ups. Never miss a potential client because you were in court.', tag: 'Pipeline' },
              { icon: '⭐', title: 'Client Reviews', desc: 'Automated review requests after case resolution. Build social proof that drives referrals and search rankings.', tag: 'Reputation' },
              { icon: '📊', title: 'Practice Analytics', desc: 'Track revenue by practice area, conversion rates, and client acquisition costs. Make data-driven decisions about your firm.', tag: 'Insights' },
              { icon: '📧', title: 'Lex Handles Outreach', desc: 'Lex drafts follow-up emails, sends appointment reminders, and keeps prospective clients engaged while you focus on active cases.', tag: 'Automation' },
              { icon: '💳', title: 'Payment Processing', desc: 'Accept retainers and payments online. Trust-account compliant. Automatic receipts and ledger entries.', tag: 'Revenue' },
            ].map((f, i) => (
              <div key={i} className="bg-white/[0.03] border border-white/[0.06] rounded-xl p-6 hover:bg-white/[0.05] hover:border-white/[0.1] transition-all">
                <div className="flex items-center justify-between mb-3">
                  <span className="text-2xl">{f.icon}</span>
                  <span className="text-[9px] font-bold text-[#D4AF37] bg-[#D4AF37]/10 px-2 py-0.5 rounded-full border border-[#D4AF37]/20">{f.tag}</span>
                </div>
                <h4 className="text-white font-bold text-sm mb-2">{f.title}</h4>
                <p className="text-gray-500 text-xs leading-relaxed">{f.desc}</p>
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
              <p className="text-gray-400 text-lg max-w-2xl mx-auto">Assigned Co-Counsel isn&apos;t a generic legal tool with a NY label. The entire platform is built around the statutes, procedures, and courts you actually practice in.</p>
            </div>

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

            {/* NY Courts Coverage */}
            <div className="max-w-4xl mx-auto bg-white/[0.02] border border-white/[0.05] rounded-2xl p-6">
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

      {/* ═══════════════════ FEATURES GRID ═══════════════════ */}
      <section id="features" className="py-20 sm:py-28 border-t border-white/5">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="text-center mb-16">
            <p className="text-[#D4AF37] text-sm font-semibold uppercase tracking-widest mb-4">Platform Features</p>
            <h2 className="text-3xl sm:text-4xl font-bold text-white mb-4">Everything your staff uses to run your practice.</h2>
            <p className="text-gray-400 text-lg max-w-2xl mx-auto">Not a collection of half-finished tools. A complete practice management system with AI woven into every feature.</p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 max-w-5xl mx-auto">
            {[
              { icon: '📰', title: 'Legal Intelligence', desc: 'Live feeds from CourtListener, SCOTUSblog, NACDL, The Appeal. Personalized to your active cases.' },
              { icon: '📖', title: 'Legal Wiki (107+)', desc: 'Community-edited entries on criminal defense and family law. Bail reform, discovery, custody, sentencing, and practice tips.' },
              { icon: '📋', title: 'Mission Control', desc: 'Enterprise dashboard: interactive calendar, time tracker, file management, tasks, case overview — your whole practice.' },
              { icon: '💰', title: 'Voucher & Billing', desc: 'Track billable hours, generate compliant vouchers, create private invoices. Stop doing unpaid admin work.' },
              { icon: '🎓', title: 'PSLF Tracking', desc: 'Track progress toward student loan forgiveness. Automated payment counting for qualifying panel work.' },
              { icon: '🎙️', title: 'Voice Dictation', desc: 'Built into every text field. Research, draft, chat with Lex, and prep for trial — all by voice.' },
              { icon: '⚔️', title: 'Trial Prep', desc: 'Upload case docs. Practice cross-examination with an AI witness that stays in character. Get scored on technique.' },
              { icon: '⏱️', title: 'Time Tracker', desc: 'Start/pause/resume timer with descriptions. Auto-calculates daily and weekly totals. No more manual time sheets.' },
            ].map((f, i) => (
              <div key={i} className="bg-white/[0.03] border border-white/[0.06] rounded-xl p-5 hover:bg-white/[0.05] hover:border-white/[0.1] transition-all">
                <span className="text-xl block mb-2">{f.icon}</span>
                <h4 className="text-white font-bold text-sm mb-1.5">{f.title}</h4>
                <p className="text-gray-500 text-xs leading-relaxed">{f.desc}</p>
              </div>
            ))}
          </div>

          {/* By the numbers */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 max-w-4xl mx-auto mt-16">
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

      {/* ═══════════════════ SECURITY ═══════════════════ */}
      <section id="security" className="py-20 sm:py-28 border-t border-white/5">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="text-center mb-16">
            <p className="text-[#D4AF37] text-sm font-semibold uppercase tracking-widest mb-4">Trust & Security</p>
            <h2 className="text-3xl sm:text-4xl font-bold text-white mb-4">Your client&apos;s secrets stay secret.</h2>
            <p className="text-gray-400 text-lg max-w-2xl mx-auto">Built to meet the same security and compliance standards as the leading legal AI platforms trusted by Am Law 100 firms.</p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 max-w-5xl mx-auto">
            {[
              { icon: '🔒', title: 'Zero Data Retention', desc: 'Your queries are processed and immediately discarded. Nothing is stored on AI provider servers. Ever.' },
              { icon: '🚫', title: 'No Training on Your Data', desc: 'Your client information never trains any AI model. Contractually guaranteed by enterprise API agreements.' },
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

          <div className="text-center mt-8">
            <Link href="/dashboard/ai-policy" className="text-[#D4AF37] text-sm font-semibold hover:text-white transition-colors">
              Read our full AI Policy & Architecture documentation →
            </Link>
          </div>
        </div>
      </section>

      {/* ═══════════════════ FINAL CTA ═══════════════════ */}
      <section className="py-24 sm:py-32 relative overflow-hidden border-t border-white/5">
        <div className="absolute inset-0">
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[700px] bg-[#D4AF37]/[0.06] rounded-full blur-[180px]"></div>
        </div>
        
        <div className="max-w-4xl mx-auto px-4 sm:px-6 relative z-10 text-center">
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-black text-white mb-6 leading-tight">
            Stop practicing alone.
            <br />
            <span className="bg-gradient-to-r from-[#D4AF37] to-[#e8c54a] bg-clip-text text-transparent">Meet your AI staff.</span>
          </h2>
          <p className="text-lg text-gray-400 max-w-2xl mx-auto mb-10 leading-relaxed">
            A virtual assistant, a research desk, and a paralegal — working together so you can take on more cases, serve more clients, and build the practice you want.
          </p>
          <Link href="/dashboard" className="group inline-block bg-gradient-to-r from-[#D4AF37] to-[#c9a632] text-[#07090f] px-12 py-5 rounded-xl font-black text-xl shadow-2xl shadow-[#D4AF37]/25 hover:shadow-[#D4AF37]/40 hover:-translate-y-1 transition-all duration-300">
            Start Your Free Trial
            <span className="inline-block ml-2 group-hover:translate-x-1 transition-transform">→</span>
          </Link>
          <p className="mt-6 text-sm text-gray-500">No credit card. No lock-in. Free for assigned counsel attorneys.</p>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-white/5 py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="grid grid-cols-2 md:grid-cols-5 gap-8 mb-10">
            <div>
              <div className="flex items-center gap-2 mb-4">
                {brand.logoText === 'scales' ? (
                  <img src="/logo-icon.svg" alt={brand.name} className="w-7 h-7" />
                ) : (
                  <div className="w-7 h-7 bg-gradient-to-br from-[#D4AF37] to-[#b8941f] rounded-lg flex items-center justify-center">
                    <span className="text-white font-bold text-[10px]">{brand.logoText}</span>
                  </div>
                )}
                <span className="text-sm font-bold text-gray-300">{brand.name}</span>
              </div>
              <p className="text-xs text-gray-500 leading-relaxed">AI-powered legal tools for everyone — from pro se to private practice.</p>
            </div>
            <div>
              <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-3">Platform</p>
              <Link href="/" className="block text-sm text-gray-500 hover:text-white transition-colors mb-2">Home</Link>
              <Link href="/login" className="block text-sm text-gray-500 hover:text-white transition-colors mb-2">Login / Sign Up</Link>
              <Link href="/dashboard/ai-policy" className="block text-sm text-gray-500 hover:text-white transition-colors mb-2">AI Policy</Link>
              <Link href="/dashboard/wiki" className="block text-sm text-gray-500 hover:text-white transition-colors mb-2">Legal Wiki</Link>
            </div>
            <div>
              <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-3">For Individuals</p>
              <Link href="/prose" className="block text-sm text-gray-500 hover:text-white transition-colors mb-2">Self-Help / Pro Se</Link>
            </div>
            <div>
              <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-3">For Attorneys</p>
              <Link href="/privatepractice" className="block text-sm text-gray-500 hover:text-white transition-colors mb-2">Private Practice</Link>
              <Link href="/students" className="block text-sm text-gray-500 hover:text-white transition-colors mb-2">Law Students</Link>
            </div>
            <div>
              <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-3">For Organizations</p>
              <Link href="/lawschools" className="block text-sm text-gray-500 hover:text-white transition-colors mb-2">Law Schools</Link>
              <Link href="/government" className="block text-sm text-gray-500 hover:text-white transition-colors mb-2">Courts &amp; Government</Link>
            </div>
          </div>
          <div className="border-t border-white/5 pt-6 text-center">
            <p className="text-xs text-gray-600">&copy; 2026 {brand.name}. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </main>
  );
}
