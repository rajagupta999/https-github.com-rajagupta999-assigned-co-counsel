"use client";

import { usePracticeMode } from '@/context/PracticeModeContext';
import { divorceWorkflows } from '@/lib/workflowDefinitions';
import WorkflowWizardPage from '@/components/WorkflowWizard';
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

      <div className="bg-white rounded-xl border border-slate-200 p-5">
        <h3 className="font-bold text-slate-800 mb-3">📄 Document Templates You&apos;ll Need</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
          {['Summons with Notice', 'Verified Complaint', 'Affidavit of Service', 'Statement of Net Worth', 'Affidavit of Defendant', 'Settlement Agreement', 'Findings of Fact & Conclusions of Law', 'Judgment of Divorce', 'Child Support Worksheet', 'Parenting Plan'].map(doc => (
            <Link key={doc} href={`/dashboard/copilot?workflow=divorce_template&doc=${encodeURIComponent(doc)}`}
              className="flex items-center gap-2 px-3 py-2.5 bg-slate-50 rounded-lg hover:bg-rose-50 hover:text-rose-700 transition-colors text-sm text-slate-700">
              <span className="text-slate-400">📄</span> {doc}
            </Link>
          ))}
        </div>
      </div>

      {/* Pro Se Workflow Wizard */}
      <div className="border-t border-slate-200 pt-8">
        <WorkflowWizardPage
          title="Document Wizard"
          subtitle="Create your divorce documents step by step"
          icon="📄"
          iconGradient="from-rose-500 to-pink-600"
          workflows={divorceWorkflows}
          isProSe={true}
        />
      </div>

      <div className="text-center py-4">
        <Link href="/dashboard/copilot?workflow=divorce" className="inline-flex items-center gap-2 bg-rose-600 hover:bg-rose-700 text-white px-5 py-2.5 rounded-lg text-sm font-semibold transition-colors">
          🤖 Get AI Help With Your Divorce →
        </Link>
      </div>
    </div>
  );
}

// ─── Main Page ───────────────────────────────────────────────────────────────

export default function DivorcePage() {
  const { isProSe } = usePracticeMode();

  return (
    <div className="min-h-[calc(100vh-56px)] sm:min-h-[calc(100vh-64px)] bg-slate-50/50 p-4 sm:p-6 lg:p-8 xl:p-12 overflow-y-auto animate-fade-in">
      {isProSe ? (
        <ProSeDivorceGuide />
      ) : (
        <WorkflowWizardPage
          title="Divorce Workflows"
          subtitle="Guided document generation for matrimonial matters"
          icon="💔"
          iconGradient="from-rose-500 to-pink-600"
          workflows={divorceWorkflows}
          isProSe={false}
        />
      )}
    </div>
  );
}
