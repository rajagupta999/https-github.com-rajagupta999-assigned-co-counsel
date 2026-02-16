"use client";

import { usePracticeMode } from '@/context/PracticeModeContext';
import { prenupWorkflows } from '@/lib/workflowDefinitions';
import WorkflowWizardPage from '@/components/WorkflowWizard';
import Link from 'next/link';

// ─── Pro Se Prenup Guide ─────────────────────────────────────────────────────

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
        <p className="text-sm text-slate-600 mb-4">A prenuptial agreement is a legal contract between two people about to get married. It spells out what happens to money and property if the marriage ends.</p>
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
            </ul>
          </div>
          <div className="bg-red-50 rounded-xl p-4">
            <h3 className="font-semibold text-red-800 mb-2">❌ CANNOT Include</h3>
            <ul className="text-sm text-red-700 space-y-1.5">
              <li>• Child custody or child support</li>
              <li>• Anything illegal</li>
              <li>• Personal behavior requirements</li>
              <li>• Waiving right to an attorney in divorce</li>
              <li>• Anything unconscionable or wildly unfair</li>
            </ul>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-xl border border-slate-200 p-6">
        <h2 className="font-bold text-slate-800 mb-4">⚖️ Enforceability Requirements</h2>
        <div className="space-y-3">
          {[
            { req: 'In Writing', desc: 'Must be a written document — verbal agreements don\'t count.' },
            { req: 'Voluntary', desc: 'Both parties must sign willingly. No coercion or threats.' },
            { req: 'Full Disclosure', desc: 'Both parties must fully disclose all assets, debts, and income.' },
            { req: 'Independent Counsel', desc: 'Both parties should have their own lawyer.' },
            { req: 'Not Unconscionable', desc: 'The terms can\'t be wildly unfair to one party.' },
            { req: 'Signed Before Marriage', desc: 'Must be signed before the wedding.' },
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
        </ul>
      </div>

      <div className="border-t border-slate-200 pt-8">
        <WorkflowWizardPage
          title="Document Wizard"
          subtitle="Create your prenuptial documents step by step"
          icon="📄"
          iconGradient="from-pink-500 to-rose-600"
          workflows={prenupWorkflows}
          isProSe={true}
        />
      </div>

      <div className="text-center py-4">
        <Link href="/dashboard/copilot?workflow=prenup" className="inline-flex items-center gap-2 bg-pink-600 hover:bg-pink-700 text-white px-5 py-2.5 rounded-lg text-sm font-semibold transition-colors">
          🤖 Get AI Help With Pre-Nup Questions →
        </Link>
      </div>
    </div>
  );
}

// ─── Main Page ───────────────────────────────────────────────────────────────

export default function PrenupPage() {
  const { isProSe } = usePracticeMode();

  return (
    <div className="min-h-[calc(100vh-56px)] sm:min-h-[calc(100vh-64px)] bg-slate-50/50 p-4 sm:p-6 lg:p-8 xl:p-12 overflow-y-auto animate-fade-in">
      {isProSe ? (
        <ProSePrenupGuide />
      ) : (
        <WorkflowWizardPage
          title="Pre-Nuptial Workflows"
          subtitle="Guided document generation for prenuptial agreements"
          icon="💍"
          iconGradient="from-pink-500 to-rose-600"
          workflows={prenupWorkflows}
          isProSe={false}
        />
      )}
    </div>
  );
}
