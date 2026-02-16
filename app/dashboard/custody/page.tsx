"use client";

import { usePracticeMode } from '@/context/PracticeModeContext';
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

      {/* Types of Custody */}
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

      {/* How to File */}
      <div className="bg-white rounded-xl border border-slate-200 p-6">
        <h2 className="font-bold text-slate-800 mb-4">📋 How to File for Custody</h2>
        <div className="space-y-4">
          {[
            { step: 1, title: 'Determine the Right Court', desc: 'Family Court handles custody if you\'re not married or not filing for divorce. Supreme Court handles custody within a divorce. File in the county where the child lives.' },
            { step: 2, title: 'File a Petition', desc: 'Get a Custody Petition form from the Family Court Clerk. Fill it out completely — include both parents\' info and what you\'re asking for (sole/joint custody, visitation schedule).' },
            { step: 3, title: 'Serve the Other Parent', desc: 'The other parent must be served with the petition. The court will give you instructions. They have a right to respond and appear in court.' },
            { step: 4, title: 'Attend Court Dates', desc: 'You\'ll likely have multiple court appearances. Dress professionally, be on time, bring all documents. The judge may order mediation first.' },
            { step: 5, title: 'Possible Forensic Evaluation', desc: 'The judge may appoint a forensic evaluator (psychologist) to interview both parents and the children. Cooperate fully — their report matters a lot.' },
            { step: 6, title: 'Trial or Settlement', desc: 'Most cases settle with the judge\'s guidance. If not, you\'ll have a hearing where both sides present evidence. The judge decides based on the child\'s best interests.' },
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

      {/* Best Interest Factors */}
      <div className="bg-white rounded-xl border border-slate-200 p-6">
        <h2 className="font-bold text-slate-800 mb-2">🏛️ What Judges Look For (Best Interest Factors)</h2>
        <p className="text-sm text-slate-500 mb-4">The judge&apos;s #1 question is: &quot;What arrangement is best for the child?&quot; Here&apos;s what they consider:</p>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
          {[
            { factor: 'Stability', desc: 'Which parent provides a more stable home environment?' },
            { factor: 'Parenting Ability', desc: 'Who handles day-to-day parenting better?' },
            { factor: 'Child\'s Preference', desc: 'Older children may express a preference (usually 12+)' },
            { factor: 'Parental Cooperation', desc: 'Which parent is more willing to facilitate a relationship with the other parent?' },
            { factor: 'Work Schedule', desc: 'Can the parent provide adequate supervision and care?' },
            { factor: 'Health', desc: 'Mental and physical health of both parents' },
            { factor: 'Domestic Violence', desc: 'Any history of abuse is a major factor against custody' },
            { factor: 'Substance Abuse', desc: 'Drug or alcohol problems seriously hurt custody chances' },
            { factor: 'Siblings', desc: 'Courts prefer to keep siblings together' },
            { factor: 'Continuity', desc: 'Courts avoid disrupting a child\'s established routine' },
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

      {/* Visitation Schedules */}
      <div className="bg-white rounded-xl border border-slate-200 p-6">
        <h2 className="font-bold text-slate-800 mb-4">📅 Common Visitation Schedules</h2>
        <div className="space-y-3">
          {[
            { name: 'Standard', desc: 'Every other weekend (Fri 6pm - Sun 6pm) + one weekday evening + alternating holidays + 2-4 weeks summer' },
            { name: 'Extended', desc: 'Every other weekend (Fri - Mon) + one overnight during the week + split holidays + 4-6 weeks summer' },
            { name: '50/50 Week-on/Week-off', desc: 'Child spends one full week with each parent, alternating. Works best when parents live close and child is school-age.' },
            { name: '50/50 (2-2-3)', desc: 'Mon-Tue with Parent A, Wed-Thu with Parent B, Fri-Sun alternating. More transitions but more frequent contact with both parents.' },
            { name: 'Supervised', desc: 'Visits only at an approved agency with a supervisor present. For situations involving safety concerns.' },
          ].map(({ name, desc }) => (
            <div key={name} className="bg-slate-50 rounded-lg p-4">
              <h3 className="font-semibold text-slate-800 text-sm">{name}</h3>
              <p className="text-xs text-slate-600 mt-1">{desc}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Mediation */}
      <div className="bg-emerald-50 border border-emerald-200 rounded-xl p-5">
        <h2 className="font-bold text-emerald-800 mb-2">🕊️ Consider Mediation</h2>
        <p className="text-sm text-emerald-700 mb-3">Mediation is when a neutral third party helps you and the other parent reach an agreement. It&apos;s:</p>
        <div className="grid grid-cols-2 gap-2">
          {['Cheaper than court', 'Faster than litigation', 'Less stressful for kids', 'More control over outcome', 'Confidential', 'Often court-required'].map(benefit => (
            <div key={benefit} className="flex items-center gap-2 text-sm text-emerald-700">
              <span className="text-emerald-500">✓</span> {benefit}
            </div>
          ))}
        </div>
        <p className="text-xs text-emerald-600 mt-3">Note: Mediation is NOT recommended if there&apos;s a history of domestic violence or power imbalance.</p>
      </div>

      <div className="text-center py-4">
        <Link href="/dashboard/copilot?workflow=custody" className="inline-flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-5 py-2.5 rounded-lg text-sm font-semibold transition-colors">
          🤖 Get AI Help With Custody →
        </Link>
      </div>
    </div>
  );
}

// ─── Assigned Counsel Custody Workflow ────────────────────────────────────────

function AssignedCustodyWorkflow() {
  const custodySteps = [
    { id: 'intake', order: 1, title: 'Client Intake & Assessment', description: 'Gather family information, assess custody goals, identify issues', icon: '📋', tasks: ['Family history', 'Custody goals', 'DV screening', 'Child information'] },
    { id: 'petition', order: 2, title: 'Petition Drafting', description: 'Draft custody petition, modification, or visitation request', icon: '📝', tasks: ['Petition form', 'Statement of facts', 'Relief requested', 'Service planning'] },
    { id: 'temporary', order: 3, title: 'Temporary Orders', description: 'Emergency custody, temporary visitation, pendente lite relief', icon: '⚡', tasks: ['Emergency petition', 'Temporary custody', 'Visitation schedule', 'Support orders'] },
    { id: 'discovery', order: 4, title: 'Discovery & Investigation', description: 'Gather evidence, investigate opposing party, prepare records', icon: '🔍', tasks: ['Document requests', 'Interrogatories', 'Subpoenas', 'Background checks'] },
    { id: 'forensic', order: 5, title: 'Forensic Evaluation', description: 'Prepare for and respond to court-ordered evaluations', icon: '🧠', tasks: ['Evaluator prep', 'Client coaching', 'Report review', 'Expert challenge'] },
    { id: 'afc', order: 6, title: 'AFC / GAL Coordination', description: 'Work with Attorney for the Child, Lincoln hearings', icon: '👧', tasks: ['AFC communication', 'Lincoln hearing prep', 'Child interview', 'Best interests'] },
    { id: 'trial', order: 7, title: 'Trial Preparation', description: 'Witness prep, exhibits, examination outlines', icon: '⚖️', tasks: ['Witness list', 'Exhibit organization', 'Direct examination', 'Cross-examination'] },
    { id: 'modification', order: 8, title: 'Modification & Enforcement', description: 'Modify existing orders, enforce compliance', icon: '🔄', tasks: ['Change in circumstances', 'Modification petition', 'Contempt motion', 'Enforcement'] },
  ];

  return (
    <div className="max-w-6xl mx-auto">
      <div className="mb-6 sm:mb-10">
        <div className="flex items-start sm:items-center gap-3 mb-4">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-500 to-cyan-600 flex items-center justify-center shadow-sm flex-shrink-0">
            <span className="text-white text-lg">👨‍👩‍👧</span>
          </div>
          <div>
            <h1 className="text-xl sm:text-2xl font-bold text-slate-900 tracking-tight">Custody Workflow</h1>
            <p className="text-sm text-slate-400">Assigned counsel tools for custody & family court matters</p>
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-8">
        {[
          { label: 'Best Interests Analysis', href: '/dashboard/copilot?workflow=best_interests', icon: '📊' },
          { label: 'Parenting Schedule', href: '/dashboard/copilot?workflow=parenting_schedule', icon: '📅' },
          { label: 'Forensic Response', href: '/dashboard/copilot?workflow=forensic', icon: '🧠' },
          { label: 'Child Support Calc', href: '/dashboard/copilot?workflow=child_support', icon: '💰' },
        ].map((action, i) => (
          <Link key={i} href={action.href} className="flex items-center gap-3 p-4 bg-white border border-slate-200 rounded-xl hover:border-blue-300 hover:shadow-sm transition-all">
            <span className="text-2xl">{action.icon}</span>
            <span className="text-sm font-semibold text-slate-700">{action.label}</span>
          </Link>
        ))}
      </div>

      {/* Best Interest Analysis Tool */}
      <div className="bg-white rounded-xl border border-slate-200 p-5 mb-6">
        <h3 className="font-semibold text-slate-800 mb-3">📊 Best Interest Factor Analysis</h3>
        <p className="text-sm text-slate-500 mb-4">Rate each factor for your client to build a best-interest argument:</p>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
          {[
            'Quality of home environment', 'Parenting skills and abilities', 'Mental and physical health',
            'Work schedules and child care', 'Child\'s preference (if mature)', 'Domestic violence history',
            'Substance abuse issues', 'Willingness to foster relationship', 'Stability and continuity',
            'Sibling relationships', 'Educational needs', 'Special needs accommodations',
          ].map((factor, i) => (
            <div key={i} className="flex items-start gap-2 p-3 bg-slate-50 rounded-lg">
              <span className="text-blue-500 mt-0.5">✓</span>
              <span className="text-sm text-slate-700">{factor}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Workflow Steps */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-5">
        {custodySteps.map((step) => (
          <Link key={step.id} href={`/dashboard/copilot?workflow=custody_${step.id}`} className="group block">
            <div className="h-full bg-white border border-slate-200/80 rounded-xl p-4 sm:p-5 hover:shadow-lg hover:border-blue-200 transition-all duration-200">
              <div className="flex items-center justify-between mb-3">
                <div className="w-8 h-8 rounded-lg bg-blue-50 flex items-center justify-center text-blue-800 text-sm font-bold group-hover:bg-blue-600 group-hover:text-white transition-colors">{step.order}</div>
                <span className="text-2xl">{step.icon}</span>
              </div>
              <h3 className="text-sm sm:text-base font-semibold text-slate-800 mb-2 group-hover:text-blue-800 transition-colors">{step.title}</h3>
              <p className="text-xs sm:text-sm text-slate-400 leading-relaxed mb-4">{step.description}</p>
              <div className="space-y-1.5">
                {step.tasks.map((task, i) => (
                  <div key={i} className="flex items-center gap-2 text-xs text-slate-500">
                    <span className="w-1 h-1 bg-slate-300 rounded-full" /> {task}
                  </div>
                ))}
              </div>
              <div className="mt-4 pt-3 border-t border-slate-100">
                <span className="text-[10px] sm:text-[11px] font-bold text-blue-700 uppercase tracking-wider flex items-center gap-1">
                  Start Workflow →
                </span>
              </div>
            </div>
          </Link>
        ))}
      </div>

      {/* CPS/ACS & Court Compliance Tracking */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 mt-8">
        <div className="bg-white rounded-xl border border-slate-200 p-5">
          <h3 className="font-semibold text-slate-800 mb-3">🏥 CPS/ACS Involvement Tracker</h3>
          <div className="space-y-1.5">
            {[
              'ACS investigation status', 'Indicated / unfounded findings', 'Service plan compliance',
              'Supervised visit logs', 'Drug test results tracking', 'Therapy attendance records',
              'Parent education completion', 'Home visit reports',
            ].map(item => (
              <label key={item} className="flex items-center gap-2 px-3 py-1.5 hover:bg-slate-50 rounded-lg cursor-pointer">
                <input type="checkbox" className="rounded border-slate-300 text-blue-600 focus:ring-blue-500" />
                <span className="text-sm text-slate-700">{item}</span>
              </label>
            ))}
          </div>
        </div>
        <div className="bg-white rounded-xl border border-slate-200 p-5">
          <h3 className="font-semibold text-slate-800 mb-3">📋 Court Order Compliance</h3>
          <div className="space-y-1.5">
            {[
              'Visitation schedule followed', 'Child support payments current', 'Drug/alcohol testing compliance',
              'Anger management program', 'Supervised visitation provider arranged', 'School records exchanged',
              'Medical records shared', 'Parenting coordinator appointed',
            ].map(item => (
              <label key={item} className="flex items-center gap-2 px-3 py-1.5 hover:bg-slate-50 rounded-lg cursor-pointer">
                <input type="checkbox" className="rounded border-slate-300 text-blue-600 focus:ring-blue-500" />
                <span className="text-sm text-slate-700">{item}</span>
              </label>
            ))}
          </div>
        </div>
      </div>

      {/* Key Resources */}
      <div className="mt-6 bg-white rounded-xl border border-slate-200 p-5">
        <h3 className="font-semibold text-slate-800 mb-4">Key Family Court Resources</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {[
            { statute: 'DRL § 240', title: 'Custody Standards' },
            { statute: 'FCA Article 6', title: 'Custody Proceedings' },
            { statute: 'Tropea v. Tropea', title: 'Relocation Standard' },
            { statute: 'Eschbach v. Eschbach', title: 'Best Interests' },
          ].map((resource, i) => (
            <Link key={i} href={`/dashboard/wiki?search=${encodeURIComponent(resource.statute)}`}
              className="p-4 bg-slate-50 rounded-lg hover:bg-slate-100 transition-colors">
              <p className="font-semibold text-sm text-slate-800">{resource.statute}</p>
              <p className="text-xs text-slate-500 mt-1">{resource.title}</p>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}

// ─── Private Practice Custody ────────────────────────────────────────────────

function PrivateCustodyPractice() {
  return (
    <div className="max-w-6xl mx-auto space-y-6">
      <div className="flex items-start gap-3 mb-6">
        <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-500 to-cyan-600 flex items-center justify-center shadow-sm flex-shrink-0">
          <span className="text-white text-lg">💼</span>
        </div>
        <div>
          <h1 className="text-xl sm:text-2xl font-bold text-slate-900">Custody Practice</h1>
          <p className="text-sm text-slate-500">Private practice management for custody matters</p>
        </div>
      </div>

      {/* Client Intake */}
      <div className="bg-white rounded-xl border border-slate-200 p-6">
        <h2 className="font-bold text-slate-800 mb-4">📋 Custody Client Intake</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {[
            { section: 'Client & Children', items: ['Client full name & contact', 'Other parent info', 'Children (names, DOBs, schools)', 'Current living arrangement', 'Existing court orders'] },
            { section: 'Custody Goals', items: ['Desired custody arrangement', 'Current visitation schedule', 'Concerns about other parent', 'Relocation plans', 'Special needs of children'] },
            { section: 'History', items: ['DV / Order of Protection', 'CPS/ACS investigations', 'Criminal history (both parents)', 'Substance abuse issues', 'Mental health history'] },
            { section: 'Financial', items: ['Both parents\' income', 'Childcare expenses', 'Medical/dental insurance', 'Extracurricular costs', 'Child support status'] },
          ].map(({ section, items }) => (
            <div key={section} className="bg-slate-50 rounded-xl p-4">
              <h3 className="font-semibold text-slate-700 mb-2 text-sm">{section}</h3>
              <div className="space-y-1.5">
                {items.map(item => (
                  <div key={item} className="flex items-center gap-2 text-xs text-slate-600">
                    <span className="w-1.5 h-1.5 bg-blue-400 rounded-full flex-shrink-0" /> {item}
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Parenting Plan Builder */}
      <div className="bg-white rounded-xl border border-slate-200 p-6">
        <h2 className="font-bold text-slate-800 mb-4">📅 Parenting Plan Builder</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {[
            { section: 'Regular Schedule', items: ['Weekday/weekend allocation', 'Midweek overnights', 'School pickup/dropoff', 'Transportation arrangements'] },
            { section: 'Holidays', items: ['Major holidays (alternating)', 'School breaks', 'Birthdays', 'Mother\'s/Father\'s Day'] },
            { section: 'Summer', items: ['Summer vacation weeks', 'Camp/activities', 'Travel notice requirements', 'Passport possession'] },
            { section: 'Decision-Making', items: ['Education decisions', 'Medical decisions', 'Religious upbringing', 'Extracurricular activities'] },
          ].map(({ section, items }) => (
            <div key={section} className="bg-blue-50 rounded-xl p-4">
              <h3 className="font-semibold text-blue-800 text-sm mb-2">{section}</h3>
              {items.map(item => (
                <div key={item} className="flex items-center gap-2 text-xs text-blue-700 mb-1">
                  <span className="text-blue-400">•</span> {item}
                </div>
              ))}
            </div>
          ))}
        </div>
        <div className="mt-4">
          <Link href="/dashboard/copilot?workflow=parenting_plan" className="inline-flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg text-xs font-semibold transition-colors">
            Generate Parenting Plan →
          </Link>
        </div>
      </div>

      {/* Billing & Experts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <div className="bg-white rounded-xl border border-slate-200 p-5">
          <h3 className="font-bold text-slate-800 mb-3">💰 Billing Structure</h3>
          <div className="space-y-2">
            {[
              { item: 'Initial Retainer', amount: '$3,000 - $7,500' },
              { item: 'Contested Custody', amount: '$7,500 - $25,000+' },
              { item: 'Modification', amount: '$3,000 - $10,000' },
              { item: 'Emergency/TRO', amount: '$2,500 - $5,000' },
              { item: 'Forensic Eval Response', amount: '$2,000 - $5,000' },
              { item: 'Trial (per day)', amount: '$2,500 - $5,000' },
            ].map(({ item, amount }) => (
              <div key={item} className="flex justify-between px-3 py-2 bg-slate-50 rounded-lg">
                <span className="text-sm text-slate-700">{item}</span>
                <span className="text-sm font-semibold text-emerald-700">{amount}</span>
              </div>
            ))}
          </div>
        </div>
        <div className="bg-white rounded-xl border border-slate-200 p-5">
          <h3 className="font-bold text-slate-800 mb-3">👥 Expert Witness Coordination</h3>
          <div className="space-y-3">
            {[
              { role: 'Forensic Psychologist', purpose: 'Custody evaluations, parental fitness assessments' },
              { role: 'Guardian ad Litem', purpose: 'Independent child advocate, investigation & report' },
              { role: 'Child Therapist', purpose: 'Therapeutic statements, reunification therapy' },
              { role: 'Domestic Violence Expert', purpose: 'DV dynamics, impact on children testimony' },
              { role: 'Substance Abuse Evaluator', purpose: 'Drug/alcohol assessments, treatment recommendations' },
            ].map(({ role, purpose }) => (
              <div key={role} className="bg-slate-50 rounded-lg p-3">
                <p className="text-sm font-semibold text-slate-800">{role}</p>
                <p className="text-xs text-slate-500 mt-0.5">{purpose}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

// ─── Main Page ───────────────────────────────────────────────────────────────

export default function CustodyPage() {
  const { mode, isProSe } = usePracticeMode();

  const renderContent = () => {
    if (isProSe) return <ProSeCustodyGuide />;
    if (mode === '18b') return <AssignedCustodyWorkflow />;
    if (mode === 'private') return <PrivateCustodyPractice />;
    return (
      <div className="space-y-12">
        <AssignedCustodyWorkflow />
        <div className="border-t border-slate-200 pt-8">
          <h2 className="text-lg font-bold text-slate-800 mb-4">Private Practice Tools</h2>
          <PrivateCustodyPractice />
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
