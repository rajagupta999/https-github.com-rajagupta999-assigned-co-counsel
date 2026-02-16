"use client";

import { usePracticeMode } from '@/context/PracticeModeContext';
import { criminalWorkflows } from '@/lib/workflowDefinitions';
import WorkflowWizardPage from '@/components/WorkflowWizard';
import Link from 'next/link';

// ─── Pro Se Criminal Defense Guide ───────────────────────────────────────────

function ProSeCriminalGuide() {
  return (
    <div className="max-w-4xl mx-auto space-y-8">
      <div className="flex items-start gap-3 mb-6">
        <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-red-500 to-orange-600 flex items-center justify-center shadow-sm flex-shrink-0">
          <span className="text-white text-lg">⚖️</span>
        </div>
        <div>
          <h1 className="text-xl sm:text-2xl font-bold text-slate-900">Criminal Defense Guide</h1>
          <p className="text-sm text-slate-500">Know your rights and understand the criminal justice process</p>
        </div>
      </div>

      <div className="bg-red-50 border border-red-200 rounded-xl p-5">
        <h2 className="font-bold text-red-800 mb-3">🛡️ Know Your Rights</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {[
            { right: 'Right to Remain Silent', desc: 'You do NOT have to answer police questions. Say: "I invoke my right to remain silent."' },
            { right: 'Right to an Attorney', desc: 'You have the right to a lawyer. If you can\'t afford one, the court must provide one for free.' },
            { right: 'Right Against Unreasonable Search', desc: 'Police generally need a warrant to search your home. You can say: "I do not consent to a search."' },
            { right: 'Right to a Speedy Trial', desc: 'The government must bring you to trial within a reasonable time.' },
            { right: 'Right to Confront Witnesses', desc: 'You can cross-examine anyone who testifies against you.' },
            { right: 'Presumption of Innocence', desc: 'You are innocent until proven guilty beyond a reasonable doubt.' },
          ].map(({ right, desc }) => (
            <div key={right} className="bg-white rounded-lg p-3">
              <h3 className="font-semibold text-red-800 text-sm">{right}</h3>
              <p className="text-xs text-red-700 mt-1">{desc}</p>
            </div>
          ))}
        </div>
      </div>

      <div className="bg-white rounded-xl border border-slate-200 p-6">
        <h2 className="font-bold text-slate-800 mb-4">🏛️ What Happens Step by Step</h2>
        <div className="space-y-5">
          {[
            { step: 1, title: 'Arrest', desc: 'You\'re taken into custody. Stay calm. Don\'t resist. Don\'t answer questions without a lawyer.' },
            { step: 2, title: 'Arraignment', desc: 'Usually within 24 hours. The judge reads the charges, you enter a plea (usually "not guilty"), bail is discussed.' },
            { step: 3, title: 'Bail', desc: 'The judge decides: release on recognizance (ROR), set bail, or remand.' },
            { step: 4, title: 'Discovery', desc: 'The prosecution must share their evidence with you.' },
            { step: 5, title: 'Pre-Trial Motions', desc: 'Motions to suppress evidence, dismiss charges, or get other relief.' },
            { step: 6, title: 'Plea Bargaining', desc: 'The DA may offer a deal. You NEVER have to accept a plea.' },
            { step: 7, title: 'Trial', desc: 'If no plea deal, your case goes to trial.' },
            { step: 8, title: 'Sentencing', desc: 'If found guilty, the judge determines your sentence.' },
          ].map(({ step, title, desc }) => (
            <div key={step} className="flex gap-4">
              <div className="w-8 h-8 rounded-full bg-red-100 flex items-center justify-center text-red-700 text-sm font-bold flex-shrink-0">{step}</div>
              <div>
                <h3 className="font-semibold text-slate-800">{title}</h3>
                <p className="text-sm text-slate-600 mt-0.5">{desc}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="bg-white rounded-xl border border-slate-200 p-6">
        <h2 className="font-bold text-slate-800 mb-4">🤔 Plea Options Explained</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {[
            { plea: 'Not Guilty', desc: 'You deny the charges. The case proceeds to trial.', color: 'bg-green-50 text-green-800 border-green-200' },
            { plea: 'Guilty', desc: 'You admit to the charges. You proceed directly to sentencing.', color: 'bg-red-50 text-red-800 border-red-200' },
            { plea: 'No Contest', desc: 'You don\'t admit guilt but accept punishment.', color: 'bg-amber-50 text-amber-800 border-amber-200' },
          ].map(({ plea, desc, color }) => (
            <div key={plea} className={`${color} border rounded-xl p-4`}>
              <h3 className="font-bold text-sm mb-2">{plea}</h3>
              <p className="text-xs">{desc}</p>
            </div>
          ))}
        </div>
      </div>

      <div className="border-t border-slate-200 pt-8">
        <WorkflowWizardPage
          title="Document Wizard"
          subtitle="Create your legal documents step by step"
          icon="📄"
          iconGradient="from-red-500 to-orange-600"
          workflows={criminalWorkflows}
          isProSe={true}
        />
      </div>

      <div className="text-center py-4">
        <Link href="/dashboard/copilot?workflow=criminal" className="inline-flex items-center gap-2 bg-red-600 hover:bg-red-700 text-white px-5 py-2.5 rounded-lg text-sm font-semibold transition-colors">
          🤖 Get AI Help With Your Case →
        </Link>
      </div>
    </div>
  );
}

// ─── Main Page ───────────────────────────────────────────────────────────────

export default function CriminalPage() {
  const { isProSe } = usePracticeMode();

  return (
    <div className="min-h-[calc(100vh-56px)] sm:min-h-[calc(100vh-64px)] bg-slate-50/50 p-4 sm:p-6 lg:p-8 xl:p-12 overflow-y-auto animate-fade-in">
      {isProSe ? (
        <ProSeCriminalGuide />
      ) : (
        <WorkflowWizardPage
          title="Criminal Defense Workflows"
          subtitle="Guided document generation for criminal defense matters"
          icon="⚖️"
          iconGradient="from-red-500 to-orange-600"
          workflows={criminalWorkflows}
          isProSe={false}
        />
      )}
    </div>
  );
}
