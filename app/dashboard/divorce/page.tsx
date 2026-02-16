"use client";

import { usePracticeMode } from '@/context/PracticeModeContext';
import { divorceSteps } from '@/lib/divorceContent';
import Link from 'next/link';

// ─── Pro Se Divorce Guide ────────────────────────────────────────────────────

function ProSeDivorceGuide() {
  return (
    <div className="max-w-4xl mx-auto space-y-8">
      <div className="flex items-start gap-3 mb-6">
        <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-rose-500 to-pink-600 flex items-center justify-center shadow-sm flex-shrink-0">
          <span className="text-white text-lg">💔</span>
        </div>
        <div>
          <h1 className="text-xl sm:text-2xl font-bold text-slate-900">Divorce Guide</h1>
          <p className="text-sm text-slate-500">A plain-English walkthrough for representing yourself in a divorce</p>
        </div>
      </div>

      {/* Do I Need a Lawyer? */}
      <div className="bg-amber-50 border border-amber-200 rounded-xl p-5">
        <h2 className="font-bold text-amber-800 mb-2">🤔 Do I Need a Lawyer?</h2>
        <p className="text-sm text-amber-700 mb-3">You may be able to handle your own divorce if:</p>
        <ul className="text-sm text-amber-700 space-y-1.5">
          <li className="flex items-start gap-2"><span className="text-green-600 mt-0.5">✓</span> You and your spouse agree on everything (uncontested)</li>
          <li className="flex items-start gap-2"><span className="text-green-600 mt-0.5">✓</span> There are no children or custody disputes</li>
          <li className="flex items-start gap-2"><span className="text-green-600 mt-0.5">✓</span> There are no significant assets or debts to divide</li>
          <li className="flex items-start gap-2"><span className="text-green-600 mt-0.5">✓</span> There is no domestic violence</li>
        </ul>
        <p className="text-sm text-amber-700 mt-3 font-medium">Consider a lawyer if: your spouse has one, there&apos;s a business/pension/real estate, or there are abuse concerns.</p>
      </div>

      {/* Step-by-Step */}
      <div className="bg-white rounded-xl border border-slate-200 p-6">
        <h2 className="font-bold text-slate-800 mb-4">📋 Step-by-Step Divorce Process</h2>
        <div className="space-y-6">
          {[
            { step: 1, title: 'Determine Grounds for Divorce', desc: 'New York allows "no-fault" divorce (irretrievable breakdown for 6+ months). You can also file on fault grounds: cruel & inhuman treatment, abandonment (1+ year), imprisonment (3+ years), or adultery. No-fault is simplest.', tip: 'Most people choose no-fault — it\'s faster and you don\'t have to prove anything.' },
            { step: 2, title: 'Gather Your Documents', desc: 'Collect: marriage certificate, tax returns (3 years), bank/investment statements, property deeds, vehicle titles, retirement account statements, pay stubs, debts/credit card statements.', tip: 'Make copies of everything. Keep originals in a safe place your spouse can\'t access.' },
            { step: 3, title: 'File the Summons & Complaint', desc: 'Go to the County Clerk\'s office in the county where you live. File a Summons with Notice or Summons and Complaint. Filing fee is approximately $210 (may be waived if you qualify).', tip: 'Ask the clerk for a fee waiver form (Index Number Fee Waiver) if you can\'t afford the filing fee.' },
            { step: 4, title: 'Serve Your Spouse', desc: 'Your spouse must be formally served within 120 days. You CANNOT serve papers yourself. Use a process server, sheriff, or any person over 18 who isn\'t a party to the case.', tip: 'Keep the Affidavit of Service — you\'ll need to file it with the court.' },
            { step: 5, title: 'Wait for Response', desc: 'Your spouse has 20 days to respond (if served in person) or 30 days (if served by mail). If they don\'t respond, you can request a default judgment.', tip: 'If your spouse files an Answer, the divorce becomes "contested" and takes longer.' },
            { step: 6, title: 'Financial Disclosure', desc: 'Both sides must exchange a Statement of Net Worth listing all income, expenses, assets, and debts. This is required even in uncontested cases.', tip: 'Be thorough and honest. Hiding assets can result in penalties.' },
            { step: 7, title: 'Discovery (Contested Only)', desc: 'If contested, you exchange documents, answer interrogatories (written questions), and may take depositions. This can take 6-12 months.', tip: 'Keep everything organized in folders by topic: finances, property, children.' },
            { step: 8, title: 'Negotiation & Settlement', desc: 'Most divorces settle without trial. You and your spouse (or lawyers) negotiate division of assets, support, and custody. A signed Settlement Agreement becomes part of the Judgment.', tip: 'Consider mediation — it\'s cheaper and faster than fighting in court.' },
            { step: 9, title: 'Trial (If No Settlement)', desc: 'A judge hears both sides and decides all issues. You\'ll need to present evidence, call witnesses, and make arguments. Trials can take 1-5 days.', tip: 'If you\'re going to trial pro se, consider at least a consultation with a lawyer to prepare.' },
            { step: 10, title: 'Judgment of Divorce', desc: 'The judge signs the Judgment of Divorce. File it with the County Clerk. You\'re officially divorced when it\'s signed.', tip: 'Get certified copies — you\'ll need them to change your name, update accounts, etc.' },
          ].map(({ step, title, desc, tip }) => (
            <div key={step} className="flex gap-4">
              <div className="w-8 h-8 rounded-full bg-rose-100 flex items-center justify-center text-rose-700 text-sm font-bold flex-shrink-0 mt-0.5">{step}</div>
              <div className="flex-1">
                <h3 className="font-semibold text-slate-800 mb-1">{title}</h3>
                <p className="text-sm text-slate-600 mb-2">{desc}</p>
                <div className="bg-blue-50 rounded-lg px-3 py-2">
                  <p className="text-xs text-blue-700"><strong>💡 Tip:</strong> {tip}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Timeline & Costs */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="bg-white rounded-xl border border-slate-200 p-5">
          <h3 className="font-bold text-slate-800 mb-3">⏱️ Timeline Expectations</h3>
          <div className="space-y-2 text-sm">
            <div className="flex justify-between"><span className="text-slate-600">Uncontested (no kids)</span><span className="font-medium text-slate-800">3-6 months</span></div>
            <div className="flex justify-between"><span className="text-slate-600">Uncontested (with kids)</span><span className="font-medium text-slate-800">4-9 months</span></div>
            <div className="flex justify-between"><span className="text-slate-600">Contested</span><span className="font-medium text-slate-800">1-3 years</span></div>
            <div className="flex justify-between"><span className="text-slate-600">With trial</span><span className="font-medium text-slate-800">2-4 years</span></div>
          </div>
        </div>
        <div className="bg-white rounded-xl border border-slate-200 p-5">
          <h3 className="font-bold text-slate-800 mb-3">💰 Cost Breakdown (Pro Se)</h3>
          <div className="space-y-2 text-sm">
            <div className="flex justify-between"><span className="text-slate-600">Index Number / Filing Fee</span><span className="font-medium text-slate-800">$210</span></div>
            <div className="flex justify-between"><span className="text-slate-600">Process Server</span><span className="font-medium text-slate-800">$50-$100</span></div>
            <div className="flex justify-between"><span className="text-slate-600">Note of Issue</span><span className="font-medium text-slate-800">$30</span></div>
            <div className="flex justify-between"><span className="text-slate-600">Certified Copies</span><span className="font-medium text-slate-800">$10-$20</span></div>
            <div className="flex justify-between border-t border-slate-100 pt-2 mt-2"><span className="font-semibold text-slate-700">Total (approx.)</span><span className="font-bold text-slate-800">$300-$360</span></div>
          </div>
        </div>
      </div>

      {/* Document Templates */}
      <div className="bg-white rounded-xl border border-slate-200 p-5">
        <h3 className="font-bold text-slate-800 mb-3">📄 Document Templates You&apos;ll Need</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
          {[
            'Summons with Notice', 'Verified Complaint', 'Affidavit of Service', 'Statement of Net Worth',
            'Affidavit of Defendant', 'Settlement Agreement', 'Findings of Fact & Conclusions of Law',
            'Judgment of Divorce', 'Child Support Worksheet', 'Parenting Plan',
          ].map(doc => (
            <Link key={doc} href={`/dashboard/copilot?workflow=divorce_template&doc=${encodeURIComponent(doc)}`}
              className="flex items-center gap-2 px-3 py-2.5 bg-slate-50 rounded-lg hover:bg-rose-50 hover:text-rose-700 transition-colors text-sm text-slate-700">
              <span className="text-slate-400">📄</span> {doc}
            </Link>
          ))}
        </div>
      </div>

      <div className="text-center py-4">
        <Link href="/dashboard/copilot?workflow=divorce" className="inline-flex items-center gap-2 bg-rose-600 hover:bg-rose-700 text-white px-5 py-2.5 rounded-lg text-sm font-semibold transition-colors">
          🤖 Get AI Help With Your Divorce →
        </Link>
      </div>
    </div>
  );
}

// ─── Assigned Counsel Divorce Workflow ────────────────────────────────────────

function AssignedDivorceWorkflow() {
  return (
    <div className="max-w-6xl mx-auto">
      <div className="mb-6 sm:mb-10">
        <div className="flex items-start sm:items-center gap-3 mb-4">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-rose-500 to-pink-600 flex items-center justify-center shadow-sm flex-shrink-0">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" style={{ width: '20px', height: '20px' }}>
              <path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z"></path>
            </svg>
          </div>
          <div>
            <h1 className="text-xl sm:text-2xl font-bold text-slate-900 tracking-tight">Divorce Workflow</h1>
            <p className="text-sm text-slate-400">Case pipeline for assigned matrimonial matters</p>
          </div>
        </div>
      </div>

      {/* Case Pipeline */}
      <div className="bg-white rounded-xl border border-slate-200 p-5 mb-6">
        <h3 className="font-semibold text-slate-800 mb-4">Case Pipeline</h3>
        <div className="flex flex-wrap gap-2">
          {['Intake', 'Filing', 'Service', 'Discovery', 'Disclosure', 'Negotiation', 'Trial', 'Judgment'].map((stage, i) => (
            <div key={stage} className="flex items-center gap-2">
              <div className="px-3 py-1.5 bg-rose-50 text-rose-700 rounded-lg text-xs font-semibold">{stage}</div>
              {i < 7 && <span className="text-slate-300">→</span>}
            </div>
          ))}
        </div>
      </div>

      {/* Workflow Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-5">
        {divorceSteps.map((step) => (
          <Link key={step.id} href={`/dashboard/copilot?workflow=${step.id}`} className="group block">
            <div className="h-full bg-white border border-slate-200/80 rounded-xl p-4 sm:p-6 hover:shadow-lg hover:border-navy-200 transition-all duration-200">
              <div className="flex items-center justify-between mb-3 sm:mb-4">
                <div className="w-8 h-8 rounded-lg bg-navy-50 flex items-center justify-center text-navy-800 text-sm font-bold group-hover:bg-navy-800 group-hover:text-white transition-colors">
                  {step.order}
                </div>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#94a3b8" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ width: '16px', height: '16px' }} className="opacity-0 group-hover:opacity-100 group-hover:translate-x-1 transition-all">
                  <path d="M5 12h14M12 5l7 7-7 7"></path>
                </svg>
              </div>
              <h3 className="text-sm sm:text-base font-semibold text-slate-800 mb-2 group-hover:text-navy-800 transition-colors leading-snug">{step.title}</h3>
              <p className="text-xs sm:text-sm text-slate-400 leading-relaxed line-clamp-2">{step.description}</p>
              <div className="mt-3 sm:mt-4 pt-3 sm:pt-4 border-t border-slate-100">
                <span className="text-[10px] sm:text-[11px] font-bold text-navy-800 uppercase tracking-wider flex items-center gap-1">
                  Launch Task
                  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" style={{ width: '12px', height: '12px' }} className="group-hover:translate-x-1 transition-transform"><path d="M5 12h14M12 5l7 7-7 7"></path></svg>
                </span>
              </div>
            </div>
          </Link>
        ))}
      </div>

      {/* Statutory References & Checklists */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 mt-8">
        <div className="bg-white rounded-xl border border-slate-200 p-5">
          <h3 className="font-semibold text-slate-800 mb-3">📖 Key Statutory References</h3>
          <div className="space-y-2">
            {[
              { ref: 'DRL § 170', title: 'Grounds for Divorce' },
              { ref: 'DRL § 236(B)', title: 'Equitable Distribution' },
              { ref: 'DRL § 240', title: 'Custody & Support' },
              { ref: 'DRL § 243', title: 'Counsel Fees' },
              { ref: 'DRL § 253', title: 'Removal of Barriers to Remarriage' },
              { ref: '22 NYCRR § 202.16', title: 'Matrimonial Rules' },
            ].map(s => (
              <Link key={s.ref} href={`/dashboard/wiki?search=${encodeURIComponent(s.ref)}`}
                className="flex justify-between items-center px-3 py-2 bg-slate-50 rounded-lg hover:bg-slate-100 transition-colors">
                <span className="text-sm font-medium text-slate-800">{s.ref}</span>
                <span className="text-xs text-slate-500">{s.title}</span>
              </Link>
            ))}
          </div>
        </div>
        <div className="bg-white rounded-xl border border-slate-200 p-5">
          <h3 className="font-semibold text-slate-800 mb-3">✅ Financial Disclosure Checklist</h3>
          <div className="space-y-1.5">
            {[
              'Statement of Net Worth filed & served',
              'Tax returns (3 years) exchanged',
              'W-2s / 1099s produced',
              'Bank statements (all accounts, 3 years)',
              'Retirement account statements (QDRO analysis)',
              'Real property appraisals ordered',
              'Business valuation (if applicable)',
              'Credit card statements produced',
              'Life insurance policies disclosed',
              'Forensic accountant retained (if needed)',
            ].map((item, i) => (
              <label key={i} className="flex items-center gap-2 px-3 py-1.5 hover:bg-slate-50 rounded-lg cursor-pointer">
                <input type="checkbox" className="rounded border-slate-300 text-rose-600 focus:ring-rose-500" />
                <span className="text-sm text-slate-700">{item}</span>
              </label>
            ))}
          </div>
        </div>
      </div>

      {/* Motion Templates & Links */}
      <div className="mt-6 bg-white rounded-xl border border-slate-200 p-5">
        <h3 className="font-semibold text-slate-800 mb-3">📝 Motion Templates</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2">
          {[
            'Motion for Pendente Lite Relief', 'Motion for Temporary Custody', 'Motion for Exclusive Occupancy',
            'Motion for Counsel Fees (DRL § 237)', 'Motion to Compel Discovery', 'Motion for Protective Order',
            'Motion for Contempt', 'Motion to Set Aside Settlement', 'QDRO Preparation',
          ].map(motion => (
            <Link key={motion} href={`/dashboard/copilot?workflow=divorce_motion&motion=${encodeURIComponent(motion)}`}
              className="flex items-center gap-2 px-3 py-2.5 bg-slate-50 rounded-lg hover:bg-rose-50 hover:text-rose-700 transition-colors text-sm text-slate-700">
              <span>📝</span> {motion}
            </Link>
          ))}
        </div>
      </div>

      <div className="mt-4 text-center">
        <Link href="https://www.nycourts.gov/divorce/child_support_standards.shtml" target="_blank"
          className="inline-flex items-center gap-2 text-sm text-blue-600 hover:text-blue-700 font-medium">
          🔗 NYS Child Support Calculator (External) →
        </Link>
      </div>
    </div>
  );
}

// ─── Private Practice Divorce ────────────────────────────────────────────────

function PrivateDivorcePractice() {
  return (
    <div className="max-w-6xl mx-auto space-y-6">
      <div className="flex items-start gap-3 mb-6">
        <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-rose-500 to-pink-600 flex items-center justify-center shadow-sm flex-shrink-0">
          <span className="text-white text-lg">💼</span>
        </div>
        <div>
          <h1 className="text-xl sm:text-2xl font-bold text-slate-900">Divorce Practice</h1>
          <p className="text-sm text-slate-500">Client management tools for private matrimonial practice</p>
        </div>
      </div>

      {/* Client Intake Questionnaire */}
      <div className="bg-white rounded-xl border border-slate-200 p-6">
        <h2 className="font-bold text-slate-800 mb-4">📋 Client Intake Questionnaire</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {[
            { section: 'Personal Info', items: ['Full legal names (both parties)', 'DOB & SSN', 'Date & place of marriage', 'Date of separation', 'Prior marriages/divorces'] },
            { section: 'Children', items: ['Names & DOBs of children', 'Current custody arrangement', 'Special needs/medical issues', 'School information', 'Childcare arrangements'] },
            { section: 'Financial', items: ['Employment (both parties)', 'Annual income & bonuses', 'Real property owned', 'Retirement accounts (401k, pension)', 'Business interests'] },
            { section: 'Issues', items: ['Grounds for divorce', 'Domestic violence history', 'Substance abuse concerns', 'Pending criminal matters', 'Immigration status issues'] },
          ].map(({ section, items }) => (
            <div key={section} className="bg-slate-50 rounded-xl p-4">
              <h3 className="font-semibold text-slate-700 mb-2 text-sm">{section}</h3>
              <div className="space-y-1.5">
                {items.map(item => (
                  <div key={item} className="flex items-center gap-2 text-xs text-slate-600">
                    <span className="w-1.5 h-1.5 bg-rose-400 rounded-full flex-shrink-0" /> {item}
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
        <div className="mt-4">
          <Link href="/dashboard/copilot?workflow=divorce_intake" className="inline-flex items-center gap-2 bg-rose-600 hover:bg-rose-700 text-white px-4 py-2 rounded-lg text-xs font-semibold transition-colors">
            Generate Full Intake Form →
          </Link>
        </div>
      </div>

      {/* Engagement & Billing */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <div className="bg-white rounded-xl border border-slate-200 p-5">
          <h3 className="font-bold text-slate-800 mb-3">📝 Engagement Letter Template</h3>
          <div className="space-y-2 text-sm text-slate-600">
            <p>Standard engagement letter sections:</p>
            <ul className="space-y-1.5 ml-4">
              {['Scope of representation', 'Fee structure & retainer amount', 'Billing rates & increments', 'Costs & disbursements', 'Client obligations', 'Termination provisions', 'Conflict disclosure', 'Communication protocol'].map(item => (
                <li key={item} className="flex items-center gap-2"><span className="text-rose-500">•</span> {item}</li>
              ))}
            </ul>
          </div>
          <Link href="/dashboard/copilot?workflow=divorce_engagement" className="mt-3 inline-flex items-center gap-1 text-xs text-rose-600 font-semibold hover:text-rose-700">
            Generate Engagement Letter →
          </Link>
        </div>

        <div className="bg-white rounded-xl border border-slate-200 p-5">
          <h3 className="font-bold text-slate-800 mb-3">💰 Retainer & Billing Milestones</h3>
          <div className="space-y-2">
            {[
              { milestone: 'Initial Retainer', amount: '$5,000 - $15,000', note: 'Varies by complexity' },
              { milestone: 'Filing & Service', amount: '$1,500 - $3,000', note: 'Includes court fees' },
              { milestone: 'Discovery Phase', amount: '$3,000 - $10,000', note: 'Document production' },
              { milestone: 'Depositions', amount: '$2,000 - $5,000/depo', note: 'Reporter fees extra' },
              { milestone: 'Settlement Negotiation', amount: '$2,000 - $5,000', note: 'Conference prep' },
              { milestone: 'Trial Preparation', amount: '$5,000 - $15,000', note: 'Expert fees extra' },
              { milestone: 'Trial (per day)', amount: '$3,000 - $7,500', note: 'Testimony & argument' },
            ].map(({ milestone, amount, note }) => (
              <div key={milestone} className="flex items-center justify-between px-3 py-2 bg-slate-50 rounded-lg">
                <div>
                  <span className="text-sm font-medium text-slate-800">{milestone}</span>
                  <span className="text-xs text-slate-400 ml-2">({note})</span>
                </div>
                <span className="text-sm font-semibold text-emerald-700">{amount}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Asset Discovery & Expert Referrals */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <div className="bg-white rounded-xl border border-slate-200 p-5">
          <h3 className="font-bold text-slate-800 mb-3">🔍 Asset Discovery Checklist</h3>
          <div className="space-y-1.5">
            {[
              'Subpoena employer payroll records', 'Real property title searches', 'Bank account discovery (3 years)',
              'Brokerage & investment statements', 'Business tax returns & financials', 'Pension & retirement valuations',
              'Life insurance policies (CSV)', 'Vehicle registrations & valuations', 'Art, jewelry, collectible appraisals',
              'Cryptocurrency wallet discovery', 'Stock option analysis', 'Trust & inheritance documentation',
            ].map(item => (
              <label key={item} className="flex items-center gap-2 px-3 py-1.5 hover:bg-slate-50 rounded-lg cursor-pointer">
                <input type="checkbox" className="rounded border-slate-300 text-rose-600 focus:ring-rose-500" />
                <span className="text-sm text-slate-700">{item}</span>
              </label>
            ))}
          </div>
        </div>

        <div className="bg-white rounded-xl border border-slate-200 p-5">
          <h3 className="font-bold text-slate-800 mb-3">👥 Expert Referral Contacts</h3>
          <div className="space-y-3">
            {[
              { role: 'Forensic Accountant', purpose: 'Hidden asset tracing, business valuations, lifestyle analysis' },
              { role: 'Real Estate Appraiser', purpose: 'Property valuations for equitable distribution' },
              { role: 'Actuary / Pension Valuator', purpose: 'QDRO preparation, pension present-value calculations' },
              { role: 'Child Psychologist', purpose: 'Custody evaluations, therapeutic supervised visitation' },
              { role: 'Vocational Expert', purpose: 'Imputed income analysis for maintenance calculations' },
              { role: 'Financial Planner (CDFA)', purpose: 'Post-divorce financial planning, settlement modeling' },
            ].map(({ role, purpose }) => (
              <div key={role} className="bg-slate-50 rounded-lg p-3">
                <p className="text-sm font-semibold text-slate-800">{role}</p>
                <p className="text-xs text-slate-500 mt-0.5">{purpose}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Client Communication Templates */}
      <div className="bg-white rounded-xl border border-slate-200 p-5">
        <h3 className="font-bold text-slate-800 mb-3">✉️ Client Communication Templates</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2">
          {[
            'Initial Consultation Follow-up', 'Retainer Replenishment Request', 'Discovery Status Update',
            'Settlement Offer Summary', 'Court Date Reminder', 'Case Status Update',
            'Invoice Cover Letter', 'Closing / Disengagement Letter', 'Post-Judgment Follow-up',
          ].map(template => (
            <Link key={template} href={`/dashboard/copilot?workflow=divorce_comm&template=${encodeURIComponent(template)}`}
              className="flex items-center gap-2 px-3 py-2.5 bg-slate-50 rounded-lg hover:bg-rose-50 hover:text-rose-700 transition-colors text-sm text-slate-700">
              <span>✉️</span> {template}
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}

// ─── Main Page ───────────────────────────────────────────────────────────────

export default function DivorcePage() {
  const { mode, isProSe } = usePracticeMode();

  const renderContent = () => {
    if (isProSe) return <ProSeDivorceGuide />;
    if (mode === '18b') return <AssignedDivorceWorkflow />;
    if (mode === 'private') return <PrivateDivorcePractice />;
    // Combined: show workflow + practice tools
    return (
      <div className="space-y-12">
        <AssignedDivorceWorkflow />
        <div className="border-t border-slate-200 pt-8">
          <h2 className="text-lg font-bold text-slate-800 mb-4">Private Practice Tools</h2>
          <PrivateDivorcePractice />
        </div>
      </div>
    );
  };

  return (
    <div className="min-h-[calc(100vh-56px)] sm:min-h-[calc(100vh-64px)] bg-slate-50/50 p-4 sm:p-6 lg:p-8 xl:p-12 overflow-y-auto animate-fade-in">
      {renderContent()}
    </div>
  );
}
