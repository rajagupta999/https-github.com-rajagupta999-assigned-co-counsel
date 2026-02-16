"use client";

import { usePracticeMode } from '@/context/PracticeModeContext';
import { custodyWorkflows } from '@/lib/workflowDefinitions';
import WorkflowWizardPage from '@/components/WorkflowWizard';
import Link from 'next/link';

// ─── Pro Se Custody Guide ────────────────────────────────────────────────────

function ProSeCustodyGuide() {
  return (
    <div className="max-w-4xl mx-auto space-y-8">
      <div className="flex items-start gap-3 mb-6">
        <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-500 to-cyan-600 flex items-center justify-center shadow-sm flex-shrink-0">
          <span className="text-white text-lg">👨‍👩‍👧</span>
        </div>
        <div>
          <h1 className="text-xl sm:text-2xl font-bold text-slate-900">Custody Guide</h1>
          <p className="text-sm text-slate-500">Understanding custody, visitation, and what the court looks for</p>
        </div>
      </div>

      <div className="bg-white rounded-xl border border-slate-200 p-6">
        <h2 className="font-bold text-slate-800 mb-4">📚 Types of Custody Explained</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {[
            { type: 'Legal Custody', desc: 'The right to make major decisions about your child — education, healthcare, religion. Can be sole (one parent decides) or joint (both decide together).', icon: '⚖️' },
            { type: 'Physical Custody', desc: 'Where the child actually lives day-to-day. The parent with physical custody has the child most of the time. The other parent usually gets visitation.', icon: '🏠' },
            { type: 'Sole Custody', desc: 'One parent has both legal and physical custody. The other parent may still get visitation. Usually only when one parent is unfit or dangerous.', icon: '👤' },
            { type: 'Joint Custody', desc: 'Both parents share decision-making (legal) and/or time (physical). Requires parents who can communicate and cooperate. Most common arrangement.', icon: '🤝' },
          ].map(({ type, desc, icon }) => (
            <div key={type} className="bg-blue-50 rounded-xl p-4">
              <div className="flex items-center gap-2 mb-2">
                <span className="text-xl">{icon}</span>
                <h3 className="font-semibold text-blue-800">{type}</h3>
              </div>
              <p className="text-sm text-blue-700">{desc}</p>
            </div>
          ))}
        </div>
      </div>

      <div className="bg-white rounded-xl border border-slate-200 p-6">
        <h2 className="font-bold text-slate-800 mb-4">📋 How to File for Custody</h2>
        <div className="space-y-4">
          {[
            { step: 1, title: 'Determine the Right Court', desc: 'Family Court handles custody if you\'re not married or not filing for divorce. Supreme Court handles custody within a divorce. File in the county where the child lives.' },
            { step: 2, title: 'File a Petition', desc: 'Get a Custody Petition form from the Family Court Clerk. Fill it out completely — include both parents\' info and what you\'re asking for.' },
            { step: 3, title: 'Serve the Other Parent', desc: 'The other parent must be served with the petition. The court will give you instructions. They have a right to respond and appear in court.' },
            { step: 4, title: 'Attend Court Dates', desc: 'You\'ll likely have multiple court appearances. Dress professionally, be on time, bring all documents. The judge may order mediation first.' },
            { step: 5, title: 'Possible Forensic Evaluation', desc: 'The judge may appoint a forensic evaluator to interview both parents and the children. Cooperate fully — their report matters a lot.' },
            { step: 6, title: 'Trial or Settlement', desc: 'Most cases settle with the judge\'s guidance. If not, you\'ll have a hearing where both sides present evidence.' },
          ].map(({ step, title, desc }) => (
            <div key={step} className="flex gap-4">
              <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center text-blue-700 text-sm font-bold flex-shrink-0">{step}</div>
              <div>
                <h3 className="font-semibold text-slate-800">{title}</h3>
                <p className="text-sm text-slate-600 mt-0.5">{desc}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="bg-white rounded-xl border border-slate-200 p-6">
        <h2 className="font-bold text-slate-800 mb-2">🏛️ What Judges Look For (Best Interest Factors)</h2>
        <p className="text-sm text-slate-500 mb-4">The judge&apos;s #1 question is: &quot;What arrangement is best for the child?&quot;</p>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
          {[
            { factor: 'Stability', desc: 'Which parent provides a more stable home environment?' },
            { factor: 'Parenting Ability', desc: 'Who handles day-to-day parenting better?' },
            { factor: 'Child\'s Preference', desc: 'Older children may express a preference (usually 12+)' },
            { factor: 'Parental Cooperation', desc: 'Which parent facilitates relationship with the other parent?' },
            { factor: 'Work Schedule', desc: 'Can the parent provide adequate supervision and care?' },
            { factor: 'Domestic Violence', desc: 'Any history of abuse is a major factor against custody' },
          ].map(({ factor, desc }) => (
            <div key={factor} className="flex items-start gap-2 p-3 bg-slate-50 rounded-lg">
              <span className="text-blue-500 mt-0.5 flex-shrink-0">✓</span>
              <div>
                <span className="text-sm font-medium text-slate-800">{factor}</span>
                <p className="text-xs text-slate-500">{desc}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="border-t border-slate-200 pt-8">
        <WorkflowWizardPage
          title="Document Wizard"
          subtitle="Create your custody documents step by step"
          icon="📄"
          iconGradient="from-blue-500 to-cyan-600"
          workflows={custodyWorkflows}
          isProSe={true}
        />
      </div>

      <div className="text-center py-4">
        <Link href="/dashboard/copilot?workflow=custody" className="inline-flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-5 py-2.5 rounded-lg text-sm font-semibold transition-colors">
          🤖 Get AI Help With Custody →
        </Link>
      </div>
    </div>
  );
}

// ─── Main Page ───────────────────────────────────────────────────────────────

export default function CustodyPage() {
  const { isProSe } = usePracticeMode();

  return (
    <div className="min-h-[calc(100vh-56px)] sm:min-h-[calc(100vh-64px)] bg-slate-50/50 p-4 sm:p-6 lg:p-8 xl:p-12 overflow-y-auto animate-fade-in">
      {isProSe ? (
        <ProSeCustodyGuide />
      ) : (
        <WorkflowWizardPage
          title="Custody Workflows"
          subtitle="Guided document generation for custody & visitation matters"
          icon="👨‍👩‍👧"
          iconGradient="from-blue-500 to-cyan-600"
          workflows={custodyWorkflows}
          isProSe={false}
        />
      )}
    </div>
  );
}
