"use client";

import { usePracticeMode } from '@/context/PracticeModeContext';
import Link from 'next/link';

function ProSeEstateGuide() {
  return (
    <div className="max-w-4xl mx-auto space-y-8">
      <div className="flex items-start gap-3 mb-6">
        <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-emerald-500 to-teal-600 flex items-center justify-center shadow-sm flex-shrink-0">
          <span className="text-white text-lg">📜</span>
        </div>
        <div>
          <h1 className="text-xl sm:text-2xl font-bold text-slate-900">Estate Planning Guide</h1>
          <p className="text-sm text-slate-500">Understand wills, trusts, and protecting your family&apos;s future</p>
        </div>
      </div>

      <div className="bg-white rounded-xl border border-slate-200 p-6">
        <h2 className="font-bold text-slate-800 mb-4">📚 Will vs. Trust: What&apos;s the Difference?</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="bg-blue-50 rounded-xl p-5">
            <h3 className="font-bold text-blue-800 mb-3">📝 Last Will &amp; Testament</h3>
            <ul className="space-y-2 text-sm text-blue-700">
              <li>✓ Says who gets what when you die</li>
              <li>✓ Names a guardian for minor children</li>
              <li>✓ Names an executor to handle your estate</li>
              <li>✓ Simple and affordable to create</li>
              <li>⚠ Goes through probate (court process)</li>
              <li>⚠ Becomes public record</li>
              <li>⚠ Only takes effect after death</li>
            </ul>
            <p className="text-xs text-blue-600 mt-3 font-medium">Best for: Simple estates, young families, modest assets</p>
          </div>
          <div className="bg-purple-50 rounded-xl p-5">
            <h3 className="font-bold text-purple-800 mb-3">🏛️ Living Trust</h3>
            <ul className="space-y-2 text-sm text-purple-700">
              <li>✓ Avoids probate entirely</li>
              <li>✓ Stays private (not public record)</li>
              <li>✓ Works while you&apos;re alive AND after death</li>
              <li>✓ Can manage assets if you become incapacitated</li>
              <li>⚠ More expensive to set up</li>
              <li>⚠ Must transfer assets into the trust</li>
              <li>⚠ Requires ongoing management</li>
            </ul>
            <p className="text-xs text-purple-600 mt-3 font-medium">Best for: Larger estates, privacy concerns, real property in multiple states</p>
          </div>
        </div>
      </div>

      <div className="bg-amber-50 border border-amber-200 rounded-xl p-5">
        <h2 className="font-bold text-amber-800 mb-3">⏰ When Do You Need Estate Planning?</h2>
        <p className="text-sm text-amber-700 mb-3">Everyone over 18 should have at least a basic estate plan. It&apos;s especially important if you:</p>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
          {['Have children (need to name a guardian)', 'Own a home or real estate', 'Have retirement accounts or investments', 'Have a spouse or partner', 'Own a business', 'Have aging parents you may care for', 'Want to avoid probate', 'Have specific wishes about end-of-life care'].map(reason => (
            <div key={reason} className="flex items-center gap-2 text-sm text-amber-700"><span className="text-amber-500">→</span> {reason}</div>
          ))}
        </div>
      </div>

      <div className="bg-white rounded-xl border border-slate-200 p-6">
        <h2 className="font-bold text-slate-800 mb-4">✅ Simple Will Checklist</h2>
        <div className="space-y-2">
          {['List all your assets (bank accounts, property, vehicles, investments)', 'Decide who gets what (beneficiaries)', 'Choose an executor (the person who carries out your wishes)', 'Name a guardian for minor children (if applicable)', 'Consider a backup executor and guardian', 'Decide about specific items (jewelry, heirlooms, etc.)', 'Think about digital assets (email, social media, crypto)', 'Sign with 2 witnesses present (required in most states)', 'Get it notarized (required or recommended in most states)', 'Store safely and tell your executor where it is'].map(item => (
            <label key={item} className="flex items-center gap-3 px-3 py-2 hover:bg-slate-50 rounded-lg cursor-pointer">
              <input type="checkbox" className="rounded border-slate-300 text-emerald-600 focus:ring-emerald-500" />
              <span className="text-sm text-slate-700">{item}</span>
            </label>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="bg-white rounded-xl border border-slate-200 p-5">
          <h3 className="font-bold text-slate-800 mb-3">📋 Power of Attorney</h3>
          <p className="text-sm text-slate-600 mb-3">A Power of Attorney (POA) lets someone make decisions for you if you can&apos;t.</p>
          <div className="space-y-2">
            {[{ t: 'Financial POA', d: 'Manages your money, pays bills, handles property' }, { t: 'Durable POA', d: 'Stays in effect even if you become mentally incapacitated' }, { t: 'Springing POA', d: 'Only activates when a specific event happens (like incapacity)' }].map(({ t, d }) => (
              <div key={t} className="bg-slate-50 rounded-lg p-3"><h4 className="text-sm font-semibold text-slate-800">{t}</h4><p className="text-xs text-slate-500">{d}</p></div>
            ))}
          </div>
        </div>
        <div className="bg-white rounded-xl border border-slate-200 p-5">
          <h3 className="font-bold text-slate-800 mb-3">🏥 Healthcare Proxy</h3>
          <p className="text-sm text-slate-600 mb-3">Names someone to make medical decisions if you can&apos;t communicate.</p>
          <ul className="space-y-1 ml-4 text-sm text-slate-600">
            <li>• Treatment decisions (surgery, medication)</li>
            <li>• End-of-life decisions (life support)</li>
            <li>• Organ donation preferences</li>
            <li>• Choosing doctors and hospitals</li>
          </ul>
          <p className="text-xs text-slate-500 mt-3">💡 Also consider a Living Will for your specific end-of-life wishes.</p>
        </div>
      </div>

      <div className="bg-emerald-50 border border-emerald-200 rounded-xl p-5">
        <h2 className="font-bold text-emerald-800 mb-2">👨‍⚖️ When to Hire a Lawyer</h2>
        <ul className="text-sm text-emerald-700 space-y-1.5">
          <li>• Your estate is worth more than $500,000</li>
          <li>• You own real estate in multiple states</li>
          <li>• You have a blended family (stepchildren)</li>
          <li>• You want to set up a trust</li>
          <li>• You have a special needs family member</li>
          <li>• You own a business</li>
          <li>• You want to minimize estate taxes</li>
        </ul>
      </div>

      <div className="text-center py-4">
        <Link href="/dashboard/copilot?workflow=estate" className="inline-flex items-center gap-2 bg-emerald-600 hover:bg-emerald-700 text-white px-5 py-2.5 rounded-lg text-sm font-semibold transition-colors">🤖 Get AI Help With Estate Planning →</Link>
      </div>
    </div>
  );
}

function AssignedEstateMessage() {
  const { setMode } = usePracticeMode();
  return (
    <div className="max-w-2xl mx-auto text-center py-16">
      <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-emerald-500 to-teal-600 flex items-center justify-center shadow-sm mx-auto mb-6">
        <span className="text-white text-3xl">📜</span>
      </div>
      <h1 className="text-xl font-bold text-slate-900 mb-3">Estate Planning</h1>
      <p className="text-slate-500 mb-6">Estate planning is typically private practice work and is not part of the assigned counsel panel. Switch to Private Practice mode for full estate planning tools.</p>
      <button onClick={() => setMode('private')} className="inline-flex items-center gap-2 bg-purple-600 hover:bg-purple-700 text-white px-5 py-2.5 rounded-lg text-sm font-semibold transition-colors">Switch to Private Practice →</button>
    </div>
  );
}

function PrivateEstatePractice() {
  return (
    <div className="max-w-6xl mx-auto space-y-6">
      <div className="flex items-start gap-3 mb-6">
        <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-emerald-500 to-teal-600 flex items-center justify-center shadow-sm flex-shrink-0">
          <span className="text-white text-lg">💼</span>
        </div>
        <div>
          <h1 className="text-xl sm:text-2xl font-bold text-slate-900">Estate Planning Practice</h1>
          <p className="text-sm text-slate-500">Complete estate planning workflow for private practice</p>
        </div>
      </div>

      <div className="bg-white rounded-xl border border-slate-200 p-6">
        <h2 className="font-bold text-slate-800 mb-4">📝 Will Drafting Workflow</h2>
        <div className="flex flex-wrap gap-2 mb-4">
          {['Client Intake', 'Asset Inventory', 'Beneficiary Designation', 'Fiduciary Selection', 'Drafting', 'Review', 'Execution', 'Filing'].map((stage, i) => (
            <div key={stage} className="flex items-center gap-2">
              <div className="px-3 py-1.5 bg-emerald-50 text-emerald-700 rounded-lg text-xs font-semibold">{stage}</div>
              {i < 7 && <span className="text-slate-300">→</span>}
            </div>
          ))}
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
          {[{ task: 'Simple Will', desc: 'Individual, straightforward distribution' }, { task: 'Pour-Over Will', desc: 'Directs assets into existing trust' }, { task: 'Joint/Mirror Wills', desc: 'Coordinated spouse wills' }, { task: 'Codicil', desc: 'Amendment to existing will' }].map(({ task, desc }) => (
            <Link key={task} href={`/dashboard/copilot?workflow=estate_will`} className="p-3 bg-slate-50 rounded-lg hover:bg-emerald-50 transition-colors">
              <p className="text-sm font-semibold text-slate-800">{task}</p>
              <p className="text-xs text-slate-500 mt-0.5">{desc}</p>
            </Link>
          ))}
        </div>
      </div>

      <div className="bg-white rounded-xl border border-slate-200 p-6">
        <h2 className="font-bold text-slate-800 mb-4">🏛️ Trust Creation Pipeline</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {[
            { type: 'Revocable Living Trust', desc: 'Grantor retains control. Avoids probate. Amendable during lifetime.', features: ['Probate avoidance', 'Privacy', 'Incapacity planning', 'Flexible'] },
            { type: 'Irrevocable Trust', desc: 'Assets removed from estate. Superior asset protection. Estate tax reduction.', features: ['Asset protection', 'Tax reduction', 'Medicaid planning', 'Creditor shield'] },
            { type: 'Special Needs Trust', desc: 'Supplemental benefits for disabled beneficiaries. Preserves SSI/Medicaid.', features: ['SSI preservation', 'Medicaid eligibility', 'Quality of life', 'Third-party or self-settled'] },
          ].map(({ type, desc, features }) => (
            <div key={type} className="bg-emerald-50 rounded-xl p-4">
              <h3 className="font-bold text-emerald-800 text-sm mb-2">{type}</h3>
              <p className="text-xs text-emerald-700 mb-3">{desc}</p>
              {features.map(f => (<div key={f} className="flex items-center gap-2 text-xs text-emerald-700"><span className="text-emerald-500">✓</span> {f}</div>))}
            </div>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <div className="bg-white rounded-xl border border-slate-200 p-5">
          <h3 className="font-bold text-slate-800 mb-3">💰 Estate Tax Planning</h3>
          <div className="bg-slate-50 rounded-lg p-3 mb-3">
            <p className="font-semibold text-slate-800 text-sm">2025 Federal Exemption: $13.61M/person</p>
            <p className="text-xs text-slate-500">$27.22M for married couples (portability)</p>
          </div>
          <div className="bg-amber-50 rounded-lg p-3 mb-3">
            <p className="font-semibold text-amber-800 text-sm">⚠️ Sunset Alert: 2026</p>
            <p className="text-xs text-amber-600">Exemption drops to ~$7M unless Congress acts</p>
          </div>
          <h4 className="font-semibold text-slate-700 text-sm mb-2">Tax Reduction Strategies:</h4>
          <ul className="space-y-1 ml-4 text-xs text-slate-600">
            <li>• Annual gift exclusion ($18,000/person/year)</li>
            <li>• Irrevocable Life Insurance Trust (ILIT)</li>
            <li>• Grantor Retained Annuity Trust (GRAT)</li>
            <li>• Charitable Remainder Trust (CRT)</li>
            <li>• Family Limited Partnership (FLP)</li>
          </ul>
        </div>
        <div className="bg-white rounded-xl border border-slate-200 p-5">
          <h3 className="font-bold text-slate-800 mb-3">📋 Client Asset Inventory</h3>
          <div className="space-y-1.5">
            {['Real property (deeds, mortgages)', 'Bank accounts (all institutions)', 'Investment/brokerage accounts', 'Retirement accounts (401k, IRA, pension)', 'Life insurance policies (face value & CSV)', 'Business interests (LLC, corp, partnership)', 'Vehicles, boats, recreational', 'Art, jewelry, collectibles', 'Cryptocurrency & digital assets', 'Outstanding debts & liabilities'].map(item => (
              <label key={item} className="flex items-center gap-2 px-3 py-1.5 hover:bg-slate-50 rounded-lg cursor-pointer">
                <input type="checkbox" className="rounded border-slate-300 text-emerald-600 focus:ring-emerald-500" />
                <span className="text-sm text-slate-700">{item}</span>
              </label>
            ))}
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <div className="bg-white rounded-xl border border-slate-200 p-5">
          <h3 className="font-bold text-slate-800 mb-3">✍️ Document Execution Checklist</h3>
          <div className="space-y-1.5">
            {['Will: 2 witnesses + notary (self-proving affidavit)', 'Trust: Grantor signature + notary', 'Power of Attorney: Notary + witnesses', 'Healthcare Proxy: 2 witnesses (NOT your agent)', 'Living Will: Notary recommended', 'Deed transfers: Notary + county recording', 'Beneficiary change forms submitted', 'Trust funding: All assets retitled'].map(item => (
              <label key={item} className="flex items-center gap-2 px-3 py-1.5 hover:bg-slate-50 rounded-lg cursor-pointer">
                <input type="checkbox" className="rounded border-slate-300 text-emerald-600 focus:ring-emerald-500" />
                <span className="text-sm text-slate-700">{item}</span>
              </label>
            ))}
          </div>
        </div>
        <div className="bg-white rounded-xl border border-slate-200 p-5">
          <h3 className="font-bold text-slate-800 mb-3">📅 Annual Review Triggers</h3>
          <div className="space-y-2">
            {[
              { event: 'Marriage / Divorce', urgency: 'Immediate' },
              { event: 'Birth / Adoption of Child', urgency: 'Immediate' },
              { event: 'Death of Beneficiary/Fiduciary', urgency: 'Immediate' },
              { event: 'Significant Asset Change (±$100K)', urgency: '30 days' },
              { event: 'Move to New State', urgency: '60 days' },
              { event: 'Tax Law Changes', urgency: '90 days' },
              { event: 'Routine Annual Review', urgency: 'Annual' },
            ].map(({ event, urgency }) => (
              <div key={event} className="flex justify-between px-3 py-2 bg-slate-50 rounded-lg">
                <span className="text-sm text-slate-700">{event}</span>
                <span className={`text-xs font-semibold px-2 py-0.5 rounded ${urgency === 'Immediate' ? 'bg-red-100 text-red-700' : urgency === 'Annual' ? 'bg-blue-100 text-blue-700' : 'bg-amber-100 text-amber-700'}`}>{urgency}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

export default function EstatePlanningPage() {
  const { mode, isProSe } = usePracticeMode();

  const renderContent = () => {
    if (isProSe) return <ProSeEstateGuide />;
    if (mode === '18b') return <AssignedEstateMessage />;
    if (mode === 'private') return <PrivateEstatePractice />;
    return <PrivateEstatePractice />;
  };

  return (
    <div className="min-h-[calc(100vh-56px)] sm:min-h-[calc(100vh-64px)] bg-slate-50/50 p-4 sm:p-6 lg:p-8 xl:p-12 overflow-y-auto animate-fade-in">
      {renderContent()}
    </div>
  );
}
