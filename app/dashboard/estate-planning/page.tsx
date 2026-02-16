"use client";

import { usePracticeMode } from '@/context/PracticeModeContext';
import { estatePlanningWorkflows } from '@/lib/workflowDefinitions';
import WorkflowWizardPage from '@/components/WorkflowWizard';
import Link from 'next/link';

// ─── Pro Se Estate Planning Guide ────────────────────────────────────────────

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
            </ul>
            <p className="text-xs text-purple-600 mt-3 font-medium">Best for: Larger estates, privacy, real property in multiple states</p>
          </div>
        </div>
      </div>

      <div className="bg-amber-50 border border-amber-200 rounded-xl p-5">
        <h2 className="font-bold text-amber-800 mb-3">⏰ When Do You Need Estate Planning?</h2>
        <p className="text-sm text-amber-700 mb-3">Everyone over 18 should have at least a basic estate plan. It&apos;s especially important if you:</p>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
          {['Have children (need to name a guardian)', 'Own a home or real estate', 'Have retirement accounts or investments', 'Have a spouse or partner', 'Own a business', 'Have specific wishes about end-of-life care'].map(reason => (
            <div key={reason} className="flex items-center gap-2 text-sm text-amber-700"><span className="text-amber-500">→</span> {reason}</div>
          ))}
        </div>
      </div>

      <div className="bg-white rounded-xl border border-slate-200 p-6">
        <h2 className="font-bold text-slate-800 mb-4">✅ Simple Will Checklist</h2>
        <div className="space-y-2">
          {['List all your assets (bank accounts, property, vehicles, investments)', 'Decide who gets what (beneficiaries)', 'Choose an executor', 'Name a guardian for minor children (if applicable)', 'Consider a backup executor and guardian', 'Sign with 2 witnesses present', 'Get it notarized', 'Store safely and tell your executor where it is'].map(item => (
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
          <p className="text-sm text-slate-600 mb-3">A POA lets someone make decisions for you if you can&apos;t.</p>
          <div className="space-y-2">
            {[{ t: 'Financial POA', d: 'Manages your money, pays bills, handles property' }, { t: 'Durable POA', d: 'Stays in effect if you become incapacitated' }, { t: 'Springing POA', d: 'Only activates when a specific event happens' }].map(({ t, d }) => (
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
        </div>
      </div>

      <div className="border-t border-slate-200 pt-8">
        <WorkflowWizardPage
          title="Document Wizard"
          subtitle="Create your estate planning documents step by step"
          icon="📄"
          iconGradient="from-emerald-500 to-teal-600"
          workflows={estatePlanningWorkflows}
          isProSe={true}
        />
      </div>

      <div className="text-center py-4">
        <Link href="/dashboard/copilot?workflow=estate" className="inline-flex items-center gap-2 bg-emerald-600 hover:bg-emerald-700 text-white px-5 py-2.5 rounded-lg text-sm font-semibold transition-colors">
          🤖 Get AI Help With Estate Planning →
        </Link>
      </div>
    </div>
  );
}

// ─── Main Page ───────────────────────────────────────────────────────────────

export default function EstatePlanningPage() {
  const { isProSe } = usePracticeMode();

  return (
    <div className="min-h-[calc(100vh-56px)] sm:min-h-[calc(100vh-64px)] bg-slate-50/50 p-4 sm:p-6 lg:p-8 xl:p-12 overflow-y-auto animate-fade-in">
      {isProSe ? (
        <ProSeEstateGuide />
      ) : (
        <WorkflowWizardPage
          title="Estate Planning Workflows"
          subtitle="Guided document generation for estate planning matters"
          icon="📜"
          iconGradient="from-emerald-500 to-teal-600"
          workflows={estatePlanningWorkflows}
          isProSe={false}
        />
      )}
    </div>
  );
}
