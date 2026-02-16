"use client";

import Link from 'next/link';

const criminalSteps = [
  {
    id: 'arraignment',
    order: 1,
    title: 'Arraignment Preparation',
    description: 'Prepare bail application, gather client info, review charges',
    icon: '⚖️',
    tasks: ['Bail memo', 'Client interview', 'Charge analysis', 'Criminal history review'],
  },
  {
    id: 'discovery',
    order: 2,
    title: 'Discovery & CPL 245',
    description: 'Track automatic disclosure, file demands, review evidence',
    icon: '📁',
    tasks: ['CPL 245 checklist', 'Demand letters', 'Discovery tracking', 'Evidence review'],
  },
  {
    id: 'investigation',
    order: 3,
    title: 'Case Investigation',
    description: 'Investigate facts, interview witnesses, gather evidence',
    icon: '🔍',
    tasks: ['Witness interviews', 'Scene investigation', 'Expert consultation', 'Evidence gathering'],
  },
  {
    id: 'motions',
    order: 4,
    title: 'Pre-Trial Motions',
    description: 'File suppression motions, Huntley/Mapp/Wade hearings',
    icon: '📜',
    tasks: ['Motion to suppress', 'Huntley motion', 'Mapp motion', 'Wade motion'],
  },
  {
    id: 'plea',
    order: 5,
    title: 'Plea Negotiation',
    description: 'Evaluate offers, advise client, negotiate with DA',
    icon: '🤝',
    tasks: ['Offer analysis', 'Sentencing exposure', 'Immigration consequences', 'Client counseling'],
  },
  {
    id: 'trial',
    order: 6,
    title: 'Trial Preparation',
    description: 'Prepare witnesses, exhibits, opening/closing arguments',
    icon: '👨‍⚖️',
    tasks: ['Witness prep', 'Exhibit list', 'Cross-examination', 'Jury instructions'],
  },
  {
    id: 'sentencing',
    order: 7,
    title: 'Sentencing',
    description: 'Prepare sentencing memo, gather mitigation evidence',
    icon: '📋',
    tasks: ['Sentencing memo', 'Character letters', 'Mitigation evidence', 'Alternative sentencing'],
  },
  {
    id: 'appeal',
    order: 8,
    title: 'Post-Conviction',
    description: 'Appeal, 440 motions, habeas corpus',
    icon: '📤',
    tasks: ['Notice of appeal', 'CPL 440 motion', 'Record review', 'Brief writing'],
  },
];

export default function CriminalWorkflowPage() {
  return (
    <div className="min-h-[calc(100vh-56px)] sm:min-h-[calc(100vh-64px)] bg-slate-50/50 p-4 sm:p-6 lg:p-8 xl:p-12 overflow-y-auto animate-fade-in">
      <div className="max-w-6xl mx-auto">
        <div className="mb-6 sm:mb-10">
          <div className="flex items-start sm:items-center gap-3 mb-4">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-red-500 to-orange-600 flex items-center justify-center shadow-sm shadow-red-500/20 flex-shrink-0">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="12" cy="12" r="10"/>
                <path d="M12 6v6l4 2"/>
              </svg>
            </div>
            <div>
              <h1 className="text-xl sm:text-2xl font-bold text-slate-900 tracking-tight">Criminal Defense Workflow</h1>
              <p className="text-sm text-slate-400">Step-by-step guidance from arraignment to appeal</p>
            </div>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-8">
          {[
            { label: 'CPL 245 Checklist', href: '/dashboard/copilot?workflow=cpl245', icon: '✅' },
            { label: 'Suppression Motion', href: '/dashboard/copilot?workflow=suppression', icon: '📝' },
            { label: 'Bail Application', href: '/dashboard/copilot?workflow=bail', icon: '🔓' },
            { label: 'Plea Calculator', href: '/dashboard/copilot?workflow=plea', icon: '📊' },
          ].map((action, i) => (
            <Link
              key={i}
              href={action.href}
              className="flex items-center gap-3 p-4 bg-white border border-slate-200 rounded-xl hover:border-navy-300 hover:shadow-sm transition-all"
            >
              <span className="text-2xl">{action.icon}</span>
              <span className="text-sm font-semibold text-slate-700">{action.label}</span>
            </Link>
          ))}
        </div>

        {/* Workflow Steps */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-5">
          {criminalSteps.map((step) => (
            <Link
              key={step.id}
              href={`/dashboard/copilot?workflow=criminal_${step.id}`}
              className="group block"
            >
              <div className="h-full bg-white border border-slate-200/80 rounded-xl p-4 sm:p-5 hover:shadow-lg hover:border-red-200 transition-all duration-200 relative overflow-hidden">
                <div className="flex items-center justify-between mb-3">
                  <div className="w-8 h-8 rounded-lg bg-red-50 flex items-center justify-center text-red-800 text-sm font-bold group-hover:bg-red-600 group-hover:text-white transition-colors">
                    {step.order}
                  </div>
                  <span className="text-2xl">{step.icon}</span>
                </div>

                <h3 className="text-sm sm:text-base font-semibold text-slate-800 mb-2 group-hover:text-red-800 transition-colors leading-snug">
                  {step.title}
                </h3>

                <p className="text-xs sm:text-sm text-slate-400 leading-relaxed mb-4">
                  {step.description}
                </p>

                <div className="space-y-1.5">
                  {step.tasks.slice(0, 3).map((task, i) => (
                    <div key={i} className="flex items-center gap-2 text-xs text-slate-500">
                      <span className="w-1 h-1 bg-slate-300 rounded-full"/>
                      {task}
                    </div>
                  ))}
                  {step.tasks.length > 3 && (
                    <div className="text-xs text-slate-400">
                      +{step.tasks.length - 3} more
                    </div>
                  )}
                </div>

                <div className="mt-4 pt-3 border-t border-slate-100">
                  <span className="text-[10px] sm:text-[11px] font-bold text-red-700 uppercase tracking-wider flex items-center gap-1">
                    Start Workflow
                    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="group-hover:translate-x-1 transition-transform"><path d="M5 12h14M12 5l7 7-7 7"/></svg>
                  </span>
                </div>
              </div>
            </Link>
          ))}
        </div>

        {/* Key Resources */}
        <div className="mt-8 bg-white rounded-xl border border-slate-200 p-6">
          <h3 className="font-semibold text-slate-800 mb-4">Key Criminal Law Resources</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {[
              { statute: 'CPL Article 245', title: 'Discovery Requirements' },
              { statute: 'CPL § 710.20', title: 'Motion to Suppress' },
              { statute: 'CPL § 30.30', title: 'Speedy Trial' },
              { statute: 'People v. De Bour', title: 'Street Encounters' },
            ].map((resource, i) => (
              <Link
                key={i}
                href={`/dashboard/wiki?search=${encodeURIComponent(resource.statute)}`}
                className="p-4 bg-slate-50 rounded-lg hover:bg-slate-100 transition-colors"
              >
                <p className="font-semibold text-sm text-slate-800">{resource.statute}</p>
                <p className="text-xs text-slate-500 mt-1">{resource.title}</p>
              </Link>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
