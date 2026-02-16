"use client";

import { usePracticeMode } from '@/context/PracticeModeContext';
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

      {/* Know Your Rights */}
      <div className="bg-red-50 border border-red-200 rounded-xl p-5">
        <h2 className="font-bold text-red-800 mb-3">🛡️ Know Your Rights</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {[
            { right: 'Right to Remain Silent', desc: 'You do NOT have to answer police questions. Say: "I invoke my right to remain silent."' },
            { right: 'Right to an Attorney', desc: 'You have the right to a lawyer. If you can\'t afford one, the court must provide one for free.' },
            { right: 'Right Against Unreasonable Search', desc: 'Police generally need a warrant to search your home. You can say: "I do not consent to a search."' },
            { right: 'Right to a Speedy Trial', desc: 'The government must bring you to trial within a reasonable time (CPL § 30.30 in NY).' },
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

      {/* What Happens at Arraignment */}
      <div className="bg-white rounded-xl border border-slate-200 p-6">
        <h2 className="font-bold text-slate-800 mb-4">🏛️ What Happens Step by Step</h2>
        <div className="space-y-5">
          {[
            { step: 1, title: 'Arrest', desc: 'You\'re taken into custody. Stay calm. Don\'t resist. Don\'t answer questions without a lawyer. You\'ll be processed (fingerprinted, photographed).' },
            { step: 2, title: 'Arraignment (First Court Appearance)', desc: 'Usually within 24 hours. The judge reads the charges, you enter a plea (usually "not guilty"), bail is discussed. You get a lawyer here if you don\'t have one.' },
            { step: 3, title: 'Bail', desc: 'The judge decides: release on recognizance (ROR), set bail, or remand (jail). Factors: seriousness of charge, criminal history, flight risk, ties to community. NY reformed bail laws — many misdemeanors and nonviolent felonies are non-bailable.' },
            { step: 4, title: 'Discovery', desc: 'The prosecution must share their evidence with you (CPL 245 in NY). This includes: police reports, witness statements, body camera footage, lab results, 911 calls.' },
            { step: 5, title: 'Pre-Trial Motions', desc: 'Your lawyer (or you) can file motions to suppress evidence (if obtained illegally), dismiss charges (insufficient evidence), or get other relief.' },
            { step: 6, title: 'Plea Bargaining', desc: 'The DA may offer a deal — plead guilty to a lesser charge for a lighter sentence. You NEVER have to accept a plea. Understand all consequences before deciding.' },
            { step: 7, title: 'Trial', desc: 'If no plea deal, your case goes to trial. The prosecution presents evidence first. You can testify (but don\'t have to). The jury (or judge) decides guilty or not guilty.' },
            { step: 8, title: 'Sentencing', desc: 'If found guilty, the judge determines your sentence based on guidelines, your history, and the circumstances of the case.' },
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

      {/* Plea Options */}
      <div className="bg-white rounded-xl border border-slate-200 p-6">
        <h2 className="font-bold text-slate-800 mb-4">🤔 Plea Options Explained</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {[
            { plea: 'Not Guilty', desc: 'You deny the charges. The case proceeds to trial. The prosecution must prove guilt beyond reasonable doubt. This is the standard plea at arraignment.', color: 'bg-green-50 text-green-800 border-green-200' },
            { plea: 'Guilty', desc: 'You admit to the charges. There is no trial. You proceed directly to sentencing. Only plead guilty if you fully understand the consequences and have discussed with a lawyer.', color: 'bg-red-50 text-red-800 border-red-200' },
            { plea: 'No Contest (Nolo Contendere)', desc: 'You don\'t admit guilt but accept punishment. Similar to guilty plea but can\'t be used against you in a civil lawsuit. Not available in all states.', color: 'bg-amber-50 text-amber-800 border-amber-200' },
          ].map(({ plea, desc, color }) => (
            <div key={plea} className={`${color} border rounded-xl p-4`}>
              <h3 className="font-bold text-sm mb-2">{plea}</h3>
              <p className="text-xs">{desc}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Public Defender vs Private */}
      <div className="bg-white rounded-xl border border-slate-200 p-6">
        <h2 className="font-bold text-slate-800 mb-4">👨‍⚖️ Public Defender vs. Private Attorney</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="bg-blue-50 rounded-xl p-4">
            <h3 className="font-bold text-blue-800 mb-2">Public Defender / Assigned Counsel</h3>
            <ul className="space-y-1.5 text-sm text-blue-700">
              <li>✓ Free if you qualify financially</li>
              <li>✓ Experienced in criminal law</li>
              <li>✓ Know the local judges and DAs</li>
              <li>⚠ Often handle heavy caseloads</li>
              <li>⚠ You don&apos;t choose your lawyer</li>
            </ul>
          </div>
          <div className="bg-purple-50 rounded-xl p-4">
            <h3 className="font-bold text-purple-800 mb-2">Private Attorney</h3>
            <ul className="space-y-1.5 text-sm text-purple-700">
              <li>✓ You choose your lawyer</li>
              <li>✓ Typically smaller caseloads</li>
              <li>✓ More time for your case</li>
              <li>⚠ Can be expensive ($5K-$50K+)</li>
              <li>⚠ Quality varies — do research</li>
            </ul>
          </div>
        </div>
      </div>

      {/* Record Expungement */}
      <div className="bg-emerald-50 border border-emerald-200 rounded-xl p-5">
        <h2 className="font-bold text-emerald-800 mb-2">🧹 Record Expungement / Sealing</h2>
        <p className="text-sm text-emerald-700 mb-3">In New York, certain records can be sealed (CPL § 160.59):</p>
        <ul className="text-sm text-emerald-700 space-y-1.5">
          <li>• Cases dismissed or acquitted are automatically sealed</li>
          <li>• Up to 2 convictions may be sealed (only 1 can be a felony)</li>
          <li>• Must wait 10 years from sentence or release (whichever is later)</li>
          <li>• Sex offenses and violent felonies generally cannot be sealed</li>
          <li>• Marijuana convictions may qualify for automatic expungement (MRTA)</li>
        </ul>
      </div>

      <div className="text-center py-4">
        <Link href="/dashboard/copilot?workflow=criminal" className="inline-flex items-center gap-2 bg-red-600 hover:bg-red-700 text-white px-5 py-2.5 rounded-lg text-sm font-semibold transition-colors">
          🤖 Get AI Help With Your Case →
        </Link>
      </div>
    </div>
  );
}

// ─── Assigned Counsel Criminal Workflow ───────────────────────────────────────

function AssignedCriminalWorkflow() {
  const criminalSteps = [
    { id: 'arraignment', order: 1, title: 'Arraignment Preparation', description: 'Prepare bail application, gather client info, review charges', icon: '⚖️', tasks: ['Bail memo', 'Client interview', 'Charge analysis', 'Criminal history review'] },
    { id: 'discovery', order: 2, title: 'Discovery & CPL 245', description: 'Track automatic disclosure, file demands, review evidence', icon: '📁', tasks: ['CPL 245 checklist', 'Demand letters', 'Discovery tracking', 'Evidence review'] },
    { id: 'investigation', order: 3, title: 'Case Investigation', description: 'Investigate facts, interview witnesses, gather evidence', icon: '🔍', tasks: ['Witness interviews', 'Scene investigation', 'Expert consultation', 'Evidence gathering'] },
    { id: 'motions', order: 4, title: 'Pre-Trial Motions', description: 'Suppression motions, Huntley/Mapp/Wade hearings', icon: '📜', tasks: ['Motion to suppress', 'Huntley motion', 'Mapp motion', 'Wade motion'] },
    { id: 'plea', order: 5, title: 'Plea Negotiation', description: 'Evaluate offers, advise client, negotiate with DA', icon: '🤝', tasks: ['Offer analysis', 'Sentencing exposure', 'Immigration consequences', 'Client counseling'] },
    { id: 'trial', order: 6, title: 'Trial Preparation', description: 'Prepare witnesses, exhibits, arguments', icon: '👨‍⚖️', tasks: ['Witness prep', 'Exhibit list', 'Cross-examination', 'Jury instructions'] },
    { id: 'sentencing', order: 7, title: 'Sentencing', description: 'Prepare sentencing memo, mitigation evidence', icon: '📋', tasks: ['Sentencing memo', 'Character letters', 'Mitigation evidence', 'Alternative sentencing'] },
    { id: 'appeal', order: 8, title: 'Post-Conviction', description: 'Appeal, 440 motions, habeas corpus', icon: '📤', tasks: ['Notice of appeal', 'CPL 440 motion', 'Record review', 'Brief writing'] },
  ];

  return (
    <div className="max-w-6xl mx-auto">
      <div className="mb-6 sm:mb-10">
        <div className="flex items-start sm:items-center gap-3 mb-4">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-red-500 to-orange-600 flex items-center justify-center shadow-sm flex-shrink-0">
            <span className="text-white text-lg">⚖️</span>
          </div>
          <div>
            <h1 className="text-xl sm:text-2xl font-bold text-slate-900 tracking-tight">Criminal Defense Workflow</h1>
            <p className="text-sm text-slate-400">Step-by-step from arraignment to appeal</p>
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
          <Link key={i} href={action.href} className="flex items-center gap-3 p-4 bg-white border border-slate-200 rounded-xl hover:border-red-300 hover:shadow-sm transition-all">
            <span className="text-2xl">{action.icon}</span>
            <span className="text-sm font-semibold text-slate-700">{action.label}</span>
          </Link>
        ))}
      </div>

      {/* Discovery Tracking */}
      <div className="bg-white rounded-xl border border-slate-200 p-5 mb-6">
        <h3 className="font-semibold text-slate-800 mb-3">📁 Discovery Tracking (Brady / Rosario)</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <h4 className="text-sm font-semibold text-slate-700 mb-2">Brady Material (Exculpatory)</h4>
            <div className="space-y-1.5">
              {['Witness recantations', 'Inconsistent statements', 'Police misconduct records', 'Favorable forensic evidence', 'Plea deals with co-defendants', 'Complainant credibility issues'].map(item => (
                <label key={item} className="flex items-center gap-2 px-3 py-1.5 hover:bg-slate-50 rounded-lg cursor-pointer">
                  <input type="checkbox" className="rounded border-slate-300 text-red-600 focus:ring-red-500" />
                  <span className="text-sm text-slate-700">{item}</span>
                </label>
              ))}
            </div>
          </div>
          <div>
            <h4 className="text-sm font-semibold text-slate-700 mb-2">Rosario Material (Witness Statements)</h4>
            <div className="space-y-1.5">
              {['Police reports (DD-5s)', 'Witness written statements', 'Grand jury testimony', 'Body camera footage', '911 call recordings', 'Lab reports & analysis'].map(item => (
                <label key={item} className="flex items-center gap-2 px-3 py-1.5 hover:bg-slate-50 rounded-lg cursor-pointer">
                  <input type="checkbox" className="rounded border-slate-300 text-red-600 focus:ring-red-500" />
                  <span className="text-sm text-slate-700">{item}</span>
                </label>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Workflow Steps */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-5">
        {criminalSteps.map((step) => (
          <Link key={step.id} href={`/dashboard/copilot?workflow=criminal_${step.id}`} className="group block">
            <div className="h-full bg-white border border-slate-200/80 rounded-xl p-4 sm:p-5 hover:shadow-lg hover:border-red-200 transition-all duration-200">
              <div className="flex items-center justify-between mb-3">
                <div className="w-8 h-8 rounded-lg bg-red-50 flex items-center justify-center text-red-800 text-sm font-bold group-hover:bg-red-600 group-hover:text-white transition-colors">{step.order}</div>
                <span className="text-2xl">{step.icon}</span>
              </div>
              <h3 className="text-sm sm:text-base font-semibold text-slate-800 mb-2 group-hover:text-red-800 transition-colors">{step.title}</h3>
              <p className="text-xs sm:text-sm text-slate-400 leading-relaxed mb-4">{step.description}</p>
              <div className="space-y-1.5">
                {step.tasks.map((task, i) => (
                  <div key={i} className="flex items-center gap-2 text-xs text-slate-500"><span className="w-1 h-1 bg-slate-300 rounded-full" /> {task}</div>
                ))}
              </div>
              <div className="mt-4 pt-3 border-t border-slate-100">
                <span className="text-[10px] sm:text-[11px] font-bold text-red-700 uppercase tracking-wider">Start Workflow →</span>
              </div>
            </div>
          </Link>
        ))}
      </div>

      {/* Motion Templates */}
      <div className="mt-8 bg-white rounded-xl border border-slate-200 p-5">
        <h3 className="font-semibold text-slate-800 mb-3">📝 Motion Practice Templates</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2">
          {[
            'Motion to Suppress (Mapp)', 'Motion to Suppress Statements (Huntley)', 'Motion to Suppress ID (Wade)',
            'Motion to Dismiss (CPL 30.30)', 'Motion to Dismiss (Insufficient Evidence)', 'Motion to Sever',
            'Motion for Bill of Particulars', 'Motion to Preclude', 'Sandoval / Ventimiglia Motion',
          ].map(motion => (
            <Link key={motion} href={`/dashboard/copilot?workflow=criminal_motion&motion=${encodeURIComponent(motion)}`}
              className="flex items-center gap-2 px-3 py-2.5 bg-slate-50 rounded-lg hover:bg-red-50 hover:text-red-700 transition-colors text-sm text-slate-700">
              <span>📝</span> {motion}
            </Link>
          ))}
        </div>
      </div>

      {/* Key Resources */}
      <div className="mt-6 bg-white rounded-xl border border-slate-200 p-5">
        <h3 className="font-semibold text-slate-800 mb-4">Key Criminal Law Resources</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {[
            { statute: 'CPL Article 245', title: 'Discovery Requirements' },
            { statute: 'CPL § 710.20', title: 'Motion to Suppress' },
            { statute: 'CPL § 30.30', title: 'Speedy Trial' },
            { statute: 'People v. De Bour', title: 'Street Encounters' },
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

// ─── Private Practice Criminal Defense ───────────────────────────────────────

function PrivateCriminalPractice() {
  return (
    <div className="max-w-6xl mx-auto space-y-6">
      <div className="flex items-start gap-3 mb-6">
        <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-red-500 to-orange-600 flex items-center justify-center shadow-sm flex-shrink-0">
          <span className="text-white text-lg">💼</span>
        </div>
        <div>
          <h1 className="text-xl sm:text-2xl font-bold text-slate-900">Criminal Defense Practice</h1>
          <p className="text-sm text-slate-500">Private practice management for criminal defense matters</p>
        </div>
      </div>

      {/* Client Intake */}
      <div className="bg-white rounded-xl border border-slate-200 p-6">
        <h2 className="font-bold text-slate-800 mb-4">📋 Client Intake</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {[
            { section: 'Client Info', items: ['Full legal name & DOB', 'Contact information', 'Emergency contact', 'Employment status', 'Immigration status'] },
            { section: 'Case Details', items: ['Charges / docket number', 'Arrest date & precinct', 'Next court date & part', 'Co-defendants', 'Bail status'] },
            { section: 'Criminal History', items: ['Prior convictions', 'Pending cases', 'Probation/parole status', 'Outstanding warrants', 'Sex offender registry'] },
            { section: 'Collateral Issues', items: ['Immigration consequences', 'Professional licenses at risk', 'Family court implications', 'Civil lawsuits pending', 'Firearms possession'] },
          ].map(({ section, items }) => (
            <div key={section} className="bg-slate-50 rounded-xl p-4">
              <h3 className="font-semibold text-slate-700 mb-2 text-sm">{section}</h3>
              {items.map(item => (
                <div key={item} className="flex items-center gap-2 text-xs text-slate-600 mb-1">
                  <span className="w-1.5 h-1.5 bg-red-400 rounded-full flex-shrink-0" /> {item}
                </div>
              ))}
            </div>
          ))}
        </div>
      </div>

      {/* Fee Structure */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <div className="bg-white rounded-xl border border-slate-200 p-5">
          <h3 className="font-bold text-slate-800 mb-3">💰 Retainer & Fee Schedules</h3>
          <div className="space-y-2">
            {[
              { charge: 'Misdemeanor (non-DUI)', fee: '$2,500 - $5,000' },
              { charge: 'DUI / DWI', fee: '$5,000 - $10,000' },
              { charge: 'Felony (non-violent)', fee: '$7,500 - $25,000' },
              { charge: 'Violent Felony', fee: '$15,000 - $50,000+' },
              { charge: 'Federal Case', fee: '$25,000 - $100,000+' },
              { charge: 'Appeal', fee: '$10,000 - $25,000' },
              { charge: 'Trial (per day supplement)', fee: '$2,500 - $5,000' },
            ].map(({ charge, fee }) => (
              <div key={charge} className="flex justify-between px-3 py-2 bg-slate-50 rounded-lg">
                <span className="text-sm text-slate-700">{charge}</span>
                <span className="text-sm font-semibold text-emerald-700">{fee}</span>
              </div>
            ))}
          </div>
        </div>
        <div className="bg-white rounded-xl border border-slate-200 p-5">
          <h3 className="font-bold text-slate-800 mb-3">🔗 Bail Bond Coordination</h3>
          <div className="space-y-3 text-sm text-slate-600">
            <p>Standard bail bond process for private clients:</p>
            <div className="space-y-2">
              {[
                { step: 'Bail Amount Set', desc: 'Coordinate with bail bondsman — typically 10% premium' },
                { step: 'Collateral', desc: 'Property, cash, or assets pledged as security' },
                { step: 'Surety Bond', desc: 'Bondsman posts full bail; client pays premium' },
                { step: 'Conditions', desc: 'Track compliance — passport surrender, travel restrictions, check-ins' },
                { step: 'Bail Reduction', desc: 'Motion for reduced bail with changed circumstances' },
              ].map(({ step, desc }) => (
                <div key={step} className="bg-slate-50 rounded-lg p-3">
                  <span className="font-semibold text-slate-800">{step}</span>
                  <p className="text-xs text-slate-500 mt-0.5">{desc}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Expert Database & Communication */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <div className="bg-white rounded-xl border border-slate-200 p-5">
          <h3 className="font-bold text-slate-800 mb-3">👥 Expert Witness Database</h3>
          <div className="space-y-3">
            {[
              { role: 'Private Investigator', purpose: 'Witness location, surveillance, scene investigation' },
              { role: 'Forensic Scientist', purpose: 'DNA, ballistics, toxicology, digital forensics' },
              { role: 'Mental Health Expert', purpose: 'Competency evaluations, psychiatric defense, mitigation' },
              { role: 'Use of Force Expert', purpose: 'Police conduct analysis, self-defense cases' },
              { role: 'Accident Reconstructionist', purpose: 'DUI/vehicular cases, scene analysis' },
              { role: 'Sentencing Mitigation Specialist', purpose: 'Social history, alternatives to incarceration' },
            ].map(({ role, purpose }) => (
              <div key={role} className="bg-slate-50 rounded-lg p-3">
                <p className="text-sm font-semibold text-slate-800">{role}</p>
                <p className="text-xs text-slate-500 mt-0.5">{purpose}</p>
              </div>
            ))}
          </div>
        </div>
        <div className="bg-white rounded-xl border border-slate-200 p-5">
          <h3 className="font-bold text-slate-800 mb-3">✉️ Client Communication Protocols</h3>
          <div className="space-y-3">
            {[
              { protocol: 'Initial Contact', desc: 'Within 24 hours of retention. Confirm court dates, explain process, set expectations.' },
              { protocol: 'Court Date Updates', desc: '48-hour advance reminder. Post-appearance summary within 24 hours.' },
              { protocol: 'Discovery Updates', desc: 'Notify client of new discovery. Schedule review meeting for significant materials.' },
              { protocol: 'Plea Offer Communication', desc: 'Always in writing. Include all consequences. Give adequate time to decide.' },
              { protocol: 'Case Outcome', desc: 'Written summary of result. Next steps (appeal deadlines, probation terms, etc.).' },
            ].map(({ protocol, desc }) => (
              <div key={protocol} className="bg-slate-50 rounded-lg p-3">
                <p className="text-sm font-semibold text-slate-800">{protocol}</p>
                <p className="text-xs text-slate-500 mt-0.5">{desc}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

// ─── Main Page ───────────────────────────────────────────────────────────────

export default function CriminalPage() {
  const { mode, isProSe } = usePracticeMode();

  const renderContent = () => {
    if (isProSe) return <ProSeCriminalGuide />;
    if (mode === '18b') return <AssignedCriminalWorkflow />;
    if (mode === 'private') return <PrivateCriminalPractice />;
    return (
      <div className="space-y-12">
        <AssignedCriminalWorkflow />
        <div className="border-t border-slate-200 pt-8">
          <h2 className="text-lg font-bold text-slate-800 mb-4">Private Practice Tools</h2>
          <PrivateCriminalPractice />
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
