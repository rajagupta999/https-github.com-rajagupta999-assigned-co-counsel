"use client";

import Link from 'next/link';

const custodySteps = [
  {
    id: 'intake',
    order: 1,
    title: 'Client Intake & Assessment',
    description: 'Gather family information, assess custody goals, identify issues',
    icon: '📋',
    tasks: ['Family history', 'Custody goals', 'DV screening', 'Child information'],
  },
  {
    id: 'petition',
    order: 2,
    title: 'Petition Drafting',
    description: 'Draft custody petition, modification, or visitation request',
    icon: '📝',
    tasks: ['Petition form', 'Statement of facts', 'Relief requested', 'Service planning'],
  },
  {
    id: 'temporary',
    order: 3,
    title: 'Temporary Orders',
    description: 'Emergency custody, temporary visitation, pendente lite relief',
    icon: '⚡',
    tasks: ['Emergency petition', 'Temporary custody', 'Visitation schedule', 'Support orders'],
  },
  {
    id: 'discovery',
    order: 4,
    title: 'Discovery & Investigation',
    description: 'Gather evidence, investigate opposing party, prepare records',
    icon: '🔍',
    tasks: ['Document requests', 'Interrogatories', 'Subpoenas', 'Background checks'],
  },
  {
    id: 'forensic',
    order: 5,
    title: 'Forensic Evaluation',
    description: 'Prepare for and respond to court-ordered evaluations',
    icon: '🧠',
    tasks: ['Evaluator prep', 'Client coaching', 'Report review', 'Expert challenge'],
  },
  {
    id: 'afc',
    order: 6,
    title: 'AFC Coordination',
    description: 'Work with Attorney for the Child, Lincoln hearings',
    icon: '👧',
    tasks: ['AFC communication', 'Lincoln hearing prep', 'Child interview', 'Best interests'],
  },
  {
    id: 'trial',
    order: 7,
    title: 'Trial Preparation',
    description: 'Witness prep, exhibits, examination outlines',
    icon: '⚖️',
    tasks: ['Witness list', 'Exhibit organization', 'Direct examination', 'Cross-examination'],
  },
  {
    id: 'modification',
    order: 8,
    title: 'Modification & Enforcement',
    description: 'Modify existing orders, enforce compliance',
    icon: '🔄',
    tasks: ['Change in circumstances', 'Modification petition', 'Contempt motion', 'Enforcement'],
  },
];

export default function CustodyWorkflowPage() {
  return (
    <div className="min-h-[calc(100vh-56px)] sm:min-h-[calc(100vh-64px)] bg-slate-50/50 p-4 sm:p-6 lg:p-8 xl:p-12 overflow-y-auto animate-fade-in">
      <div className="max-w-6xl mx-auto">
        <div className="mb-6 sm:mb-10">
          <div className="flex items-start sm:items-center gap-3 mb-4">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-500 to-cyan-600 flex items-center justify-center shadow-sm shadow-blue-500/20 flex-shrink-0">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round">
                <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/>
                <circle cx="9" cy="7" r="4"/>
                <path d="M23 21v-2a4 4 0 0 0-3-3.87"/>
                <path d="M16 3.13a4 4 0 0 1 0 7.75"/>
              </svg>
            </div>
            <div>
              <h1 className="text-xl sm:text-2xl font-bold text-slate-900 tracking-tight">Custody & Family Court Workflow</h1>
              <p className="text-sm text-slate-400">Guide for custody, visitation, and family matters</p>
            </div>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-8">
          {[
            { label: 'Best Interests Factors', href: '/dashboard/copilot?workflow=best_interests', icon: '📊' },
            { label: 'Parenting Schedule', href: '/dashboard/copilot?workflow=parenting_schedule', icon: '📅' },
            { label: 'Forensic Response', href: '/dashboard/copilot?workflow=forensic', icon: '🧠' },
            { label: 'Child Support Calc', href: '/dashboard/copilot?workflow=child_support', icon: '💰' },
          ].map((action, i) => (
            <Link
              key={i}
              href={action.href}
              className="flex items-center gap-3 p-4 bg-white border border-slate-200 rounded-xl hover:border-blue-300 hover:shadow-sm transition-all"
            >
              <span className="text-2xl">{action.icon}</span>
              <span className="text-sm font-semibold text-slate-700">{action.label}</span>
            </Link>
          ))}
        </div>

        {/* Workflow Steps */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-5">
          {custodySteps.map((step) => (
            <Link
              key={step.id}
              href={`/dashboard/copilot?workflow=custody_${step.id}`}
              className="group block"
            >
              <div className="h-full bg-white border border-slate-200/80 rounded-xl p-4 sm:p-5 hover:shadow-lg hover:border-blue-200 transition-all duration-200 relative overflow-hidden">
                <div className="flex items-center justify-between mb-3">
                  <div className="w-8 h-8 rounded-lg bg-blue-50 flex items-center justify-center text-blue-800 text-sm font-bold group-hover:bg-blue-600 group-hover:text-white transition-colors">
                    {step.order}
                  </div>
                  <span className="text-2xl">{step.icon}</span>
                </div>

                <h3 className="text-sm sm:text-base font-semibold text-slate-800 mb-2 group-hover:text-blue-800 transition-colors leading-snug">
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
                  <span className="text-[10px] sm:text-[11px] font-bold text-blue-700 uppercase tracking-wider flex items-center gap-1">
                    Start Workflow
                    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="group-hover:translate-x-1 transition-transform"><path d="M5 12h14M12 5l7 7-7 7"/></svg>
                  </span>
                </div>
              </div>
            </Link>
          ))}
        </div>

        {/* Best Interests Factors Quick Reference */}
        <div className="mt-8 bg-white rounded-xl border border-slate-200 p-6">
          <h3 className="font-semibold text-slate-800 mb-4">DRL § 240 Best Interests Factors</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
            {[
              'Quality of home environment',
              'Parenting skills and abilities',
              'Mental and physical health',
              'Work schedules and child care',
              'Child\'s preference (if mature)',
              'Domestic violence history',
              'Substance abuse issues',
              'Willingness to foster other parent relationship',
              'Stability and continuity',
              'Sibling relationships',
              'Educational needs',
              'Special needs accommodations',
            ].map((factor, i) => (
              <div key={i} className="flex items-start gap-2 p-3 bg-slate-50 rounded-lg">
                <span className="text-blue-500 mt-0.5">✓</span>
                <span className="text-sm text-slate-700">{factor}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Key Resources */}
        <div className="mt-6 bg-white rounded-xl border border-slate-200 p-6">
          <h3 className="font-semibold text-slate-800 mb-4">Key Family Court Resources</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {[
              { statute: 'DRL § 240', title: 'Custody Standards' },
              { statute: 'FCA Article 6', title: 'Custody Proceedings' },
              { statute: 'Tropea v. Tropea', title: 'Relocation Standard' },
              { statute: 'Eschbach v. Eschbach', title: 'Best Interests' },
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
