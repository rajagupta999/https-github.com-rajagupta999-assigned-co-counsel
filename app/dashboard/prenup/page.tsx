"use client";

import { usePracticeMode } from '@/context/PracticeModeContext';
import Link from 'next/link';

function ProSePrenupGuide() {
  return (
    <div className="max-w-4xl mx-auto space-y-8">
      <div className="flex items-start gap-3 mb-6">
        <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-pink-500 to-rose-600 flex items-center justify-center shadow-sm flex-shrink-0">
          <span className="text-white text-lg">💍</span>
        </div>
        <div>
          <h1 className="text-xl sm:text-2xl font-bold text-slate-900">Pre-Nuptial Agreement Guide</h1>
          <p className="text-sm text-slate-500">Everything you need to know about prenups in plain English</p>
        </div>
      </div>

      <div className="bg-white rounded-xl border border-slate-200 p-6">
        <h2 className="font-bold text-slate-800 mb-4">📚 What Is a Prenup?</h2>
        <p className="text-sm text-slate-600 mb-4">A prenuptial agreement (prenup) is a legal contract between two people who are about to get married. It spells out what happens to money and property if the marriage ends in divorce or death.</p>
        <div className="bg-blue-50 rounded-lg p-4">
          <h3 className="font-semibold text-blue-800 text-sm mb-2">A prenup is NOT about expecting divorce. It&apos;s about:</h3>
          <ul className="text-sm text-blue-700 space-y-1.5">
            <li>✓ Having honest money conversations before marriage</li>
            <li>✓ Protecting assets you bring into the marriage</li>
            <li>✓ Protecting a business you own or may inherit</li>
            <li>✓ Keeping debt separate (student loans, credit cards)</li>
            <li>✓ Clarity and peace of mind for both parties</li>
          </ul>
        </div>
      </div>

      <div className="bg-white rounded-xl border border-slate-200 p-6">
        <h2 className="font-bold text-slate-800 mb-4">🤔 Do You Need a Prenup?</h2>
        <p className="text-sm text-slate-600 mb-3">Consider a prenup if any of these apply:</p>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
          {['You own a business or professional practice', 'You have significant savings or investments', 'You own real estate', 'You expect a large inheritance', 'One partner has significantly more debt', 'Either partner has children from a prior relationship', 'You have a family business to protect', 'There\'s a large income disparity'].map(reason => (
            <div key={reason} className="flex items-center gap-2 px-3 py-2 bg-slate-50 rounded-lg text-sm text-slate-700">
              <span className="text-pink-500 flex-shrink-0">→</span> {reason}
            </div>
          ))}
        </div>
      </div>

      <div className="bg-white rounded-xl border border-slate-200 p-6">
        <h2 className="font-bold text-slate-800 mb-4">📋 What a Prenup Covers</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="bg-green-50 rounded-xl p-4">
            <h3 className="font-semibold text-green-800 mb-2">✅ CAN Include</h3>
            <ul className="text-sm text-green-700 space-y-1.5">
              <li>• Division of property and assets</li>
              <li>• Spousal support (alimony) terms</li>
              <li>• Debt responsibility</li>
              <li>• Business ownership protection</li>
              <li>• Inheritance rights</li>
              <li>• Financial responsibilities during marriage</li>
            </ul>
          </div>
          <div className="bg-red-50 rounded-xl p-4">
            <h3 className="font-semibold text-red-800 mb-2">❌ CANNOT Include</h3>
            <ul className="text-sm text-red-700 space-y-1.5">
              <li>• Child custody or child support</li>
              <li>• Anything illegal</li>
              <li>• Personal behavior requirements</li>
              <li>• Waiving right to an attorney in divorce</li>
              <li>• Incentivizing divorce</li>
              <li>• Anything unconscionable or wildly unfair</li>
            </ul>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-xl border border-slate-200 p-6">
        <h2 className="font-bold text-slate-800 mb-4">⚖️ Enforceability Requirements</h2>
        <p className="text-sm text-slate-600 mb-3">For a prenup to hold up in court, it generally must meet these requirements:</p>
        <div className="space-y-3">
          {[
            { req: 'In Writing', desc: 'Must be a written document — verbal agreements don\'t count.' },
            { req: 'Voluntary', desc: 'Both parties must sign willingly. No coercion, pressure, or threats.' },
            { req: 'Full Disclosure', desc: 'Both parties must fully disclose all assets, debts, and income. Hiding assets = unenforceable.' },
            { req: 'Independent Counsel', desc: 'Both parties should have their own lawyer. Some states require it.' },
            { req: 'Not Unconscionable', desc: 'The terms can\'t be wildly unfair to one party.' },
            { req: 'Signed Before Marriage', desc: 'Must be signed before the wedding — not on the wedding day (too much pressure).' },
            { req: 'Proper Execution', desc: 'Signed, witnessed, and notarized according to state law.' },
          ].map(({ req, desc }) => (
            <div key={req} className="flex gap-3 items-start">
              <span className="text-pink-500 font-bold mt-0.5">•</span>
              <div>
                <span className="font-semibold text-slate-800 text-sm">{req}:</span>
                <span className="text-sm text-slate-600 ml-1">{desc}</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="bg-red-50 border border-red-200 rounded-xl p-5">
        <h2 className="font-bold text-red-800 mb-3">🚩 Red Flags</h2>
        <ul className="text-sm text-red-700 space-y-1.5">
          <li>🚩 Your partner presents the prenup days before the wedding</li>
          <li>🚩 Your partner says you don&apos;t need your own lawyer</li>
          <li>🚩 One party doesn&apos;t fully disclose their finances</li>
          <li>🚩 The terms leave one party with nothing in a divorce</li>
          <li>🚩 You feel pressured or rushed to sign</li>
          <li>🚩 The agreement is presented as &quot;take it or the wedding is off&quot;</li>
        </ul>
      </div>

      <div className="text-center py-4">
        <Link href="/dashboard/copilot?workflow=prenup" className="inline-flex items-center gap-2 bg-pink-600 hover:bg-pink-700 text-white px-5 py-2.5 rounded-lg text-sm font-semibold transition-colors">🤖 Get AI Help With Pre-Nup Questions →</Link>
      </div>
    </div>
  );
}

function AssignedPrenupMessage() {
  const { setMode } = usePracticeMode();
  return (
    <div className="max-w-2xl mx-auto text-center py-16">
      <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-pink-500 to-rose-600 flex items-center justify-center shadow-sm mx-auto mb-6">
        <span className="text-white text-3xl">💍</span>
      </div>
      <h1 className="text-xl font-bold text-slate-900 mb-3">Pre-Nuptial Agreements</h1>
      <p className="text-slate-500 mb-6">Pre-nuptial agreements are typically private practice work and are not part of the assigned counsel panel. Switch to Private Practice mode for full prenup tools.</p>
      <button onClick={() => setMode('private')} className="inline-flex items-center gap-2 bg-purple-600 hover:bg-purple-700 text-white px-5 py-2.5 rounded-lg text-sm font-semibold transition-colors">Switch to Private Practice →</button>
    </div>
  );
}

function PrivatePrenupPractice() {
  return (
    <div className="max-w-6xl mx-auto space-y-6">
      <div className="flex items-start gap-3 mb-6">
        <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-pink-500 to-rose-600 flex items-center justify-center shadow-sm flex-shrink-0">
          <span className="text-white text-lg">💼</span>
        </div>
        <div>
          <h1 className="text-xl sm:text-2xl font-bold text-slate-900">Pre-Nuptial Practice</h1>
          <p className="text-sm text-slate-500">Client intake and drafting workflow for prenuptial agreements</p>
        </div>
      </div>

      <div className="bg-white rounded-xl border border-slate-200 p-6">
        <h2 className="font-bold text-slate-800 mb-4">📋 Client Intake (Both Parties&apos; Assets)</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {['Party 1 (Your Client)', 'Party 2 (Other Party)'].map(party => (
            <div key={party} className="bg-slate-50 rounded-xl p-4">
              <h3 className="font-semibold text-slate-700 mb-3 text-sm">{party}</h3>
              <div className="space-y-1.5">
                {['Full legal name & contact', 'Employment & annual income', 'Real property owned', 'Bank & investment accounts', 'Retirement accounts (401k, IRA, pension)', 'Business interests / ownership', 'Expected inheritances', 'Outstanding debts (student loans, mortgage, credit)', 'Prior marriages / children'].map(item => (
                  <div key={item} className="flex items-center gap-2 text-xs text-slate-600">
                    <span className="w-1.5 h-1.5 bg-pink-400 rounded-full flex-shrink-0" /> {item}
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="bg-white rounded-xl border border-slate-200 p-6">
        <h2 className="font-bold text-slate-800 mb-4">✅ Enforceability Checklist</h2>
        <div className="space-y-1.5">
          {[
            'Conflict check completed (both parties — dual representation NOT recommended)',
            'Both parties have independent counsel',
            'Full financial disclosure schedules prepared & exchanged',
            'Adequate time before wedding (recommend 30+ days minimum)',
            'No evidence of duress, coercion, or undue influence',
            'Terms are not unconscionable',
            'Agreement is in writing',
            'Proper execution (signatures, witnesses, notarization per state law)',
            'Engagement letter specifying scope and fees',
          ].map(item => (
            <label key={item} className="flex items-center gap-2 px-3 py-2 hover:bg-slate-50 rounded-lg cursor-pointer">
              <input type="checkbox" className="rounded border-slate-300 text-pink-600 focus:ring-pink-500" />
              <span className="text-sm text-slate-700">{item}</span>
            </label>
          ))}
        </div>
      </div>

      <div className="bg-white rounded-xl border border-slate-200 p-6">
        <h2 className="font-bold text-slate-800 mb-4">📝 Drafting Workflow</h2>
        <div className="flex flex-wrap gap-2 mb-4">
          {['Intake', 'Disclosure', 'Draft Terms', 'Negotiate', 'Revise', 'Independent Review', 'Execute'].map((stage, i) => (
            <div key={stage} className="flex items-center gap-2">
              <div className="px-3 py-1.5 bg-pink-50 text-pink-700 rounded-lg text-xs font-semibold">{stage}</div>
              {i < 6 && <span className="text-slate-300">→</span>}
            </div>
          ))}
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {[
            { section: 'Recitals', desc: 'Identify parties, contemplated marriage, purpose of agreement' },
            { section: 'Definitions', desc: 'Separate property, marital property, income, appreciation' },
            { section: 'Property Schedules', desc: 'Schedule A (Party 1 assets), Schedule B (Party 2 assets), Schedule C (Joint)' },
            { section: 'Property Division', desc: 'Separate property stays separate, rules for commingling, appreciation' },
            { section: 'Spousal Support', desc: 'Waiver, limitation, formula-based, or escalating schedule' },
            { section: 'Death Provisions', desc: 'Elective share waiver, life insurance requirements, estate rights' },
          ].map(({ section, desc }) => (
            <div key={section} className="bg-slate-50 rounded-lg p-3">
              <p className="text-sm font-semibold text-slate-800">{section}</p>
              <p className="text-xs text-slate-500 mt-0.5">{desc}</p>
            </div>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <div className="bg-white rounded-xl border border-slate-200 p-5">
          <h3 className="font-bold text-slate-800 mb-3">📊 Negotiation Tracking</h3>
          <div className="space-y-2">
            {[
              { issue: 'Property Division', status: 'Pending' },
              { issue: 'Spousal Support', status: 'Pending' },
              { issue: 'Business Interests', status: 'Pending' },
              { issue: 'Death Provisions', status: 'Pending' },
              { issue: 'Sunset Clause', status: 'Pending' },
              { issue: 'Infidelity Clause', status: 'Pending' },
            ].map(({ issue, status }) => (
              <div key={issue} className="flex justify-between items-center px-3 py-2 bg-slate-50 rounded-lg">
                <span className="text-sm text-slate-700">{issue}</span>
                <span className="text-xs font-semibold px-2 py-0.5 rounded bg-amber-100 text-amber-700">{status}</span>
              </div>
            ))}
          </div>
        </div>
        <div className="bg-white rounded-xl border border-slate-200 p-5">
          <h3 className="font-bold text-slate-800 mb-3">⏳ Sunset Clause Options</h3>
          <p className="text-sm text-slate-500 mb-3">A sunset clause makes the prenup expire or modify after a certain time:</p>
          <div className="space-y-2">
            {[
              { option: 'Full Sunset', desc: 'Entire prenup expires after X years of marriage (e.g., 10 years)' },
              { option: 'Partial Sunset', desc: 'Some provisions expire (e.g., alimony waiver) while others remain' },
              { option: 'Escalating', desc: 'Benefits increase over time (e.g., spousal support increases by year)' },
              { option: 'No Sunset', desc: 'Agreement remains in effect for the duration of the marriage' },
            ].map(({ option, desc }) => (
              <div key={option} className="bg-slate-50 rounded-lg p-3">
                <p className="text-sm font-semibold text-slate-800">{option}</p>
                <p className="text-xs text-slate-500 mt-0.5">{desc}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="bg-white rounded-xl border border-slate-200 p-5">
        <h3 className="font-bold text-slate-800 mb-3">✍️ Execution Requirements</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {[
            { req: 'NY (DRL § 236B(3))', desc: 'Must be in writing, subscribed by parties, acknowledged like a deed' },
            { req: 'Timing', desc: 'Sign at least 30 days before wedding (best practice, not legal minimum)' },
            { req: 'Witnesses', desc: 'Notarization required; witnesses recommended but not always mandated' },
            { req: 'Independent Counsel', desc: 'Strongly recommended for both parties; some courts require it' },
          ].map(({ req, desc }) => (
            <div key={req} className="bg-slate-50 rounded-lg p-3">
              <p className="text-sm font-semibold text-slate-800">{req}</p>
              <p className="text-xs text-slate-500 mt-0.5">{desc}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default function PrenupPage() {
  const { mode, isProSe } = usePracticeMode();

  const renderContent = () => {
    if (isProSe) return <ProSePrenupGuide />;
    if (mode === '18b') return <AssignedPrenupMessage />;
    if (mode === 'private') return <PrivatePrenupPractice />;
    return <PrivatePrenupPractice />;
  };

  return (
    <div className="min-h-[calc(100vh-56px)] sm:min-h-[calc(100vh-64px)] bg-slate-50/50 p-4 sm:p-6 lg:p-8 xl:p-12 overflow-y-auto animate-fade-in">
      {renderContent()}
    </div>
  );
}
