"use client";

import { useState, ReactNode } from 'react';

// ─── Types ───────────────────────────────────────────────────────────────────

export interface WorkflowDefinition {
  id: string;
  title: string;
  description: string;
  icon: string;
  fields: FieldDef[];
  researchSources: ResearchSource[];
  documentName: string;
  mockDocumentContent: string;
}

export interface FieldDef {
  name: string;
  label: string;
  type: 'text' | 'textarea' | 'select' | 'date';
  tooltip: string;
  options?: string[];
  required?: boolean;
  proSeLabel?: string; // simpler label for pro se
}

export interface ResearchSource {
  id: string;
  title: string;
  type: 'wiki' | 'caselaw' | 'statute';
  citation: string;
  summary: string;
}

interface WorkflowWizardPageProps {
  title: string;
  subtitle: string;
  icon: string;
  iconGradient: string;
  workflows: WorkflowDefinition[];
  isProSe: boolean;
}

// ─── Mock Data ───────────────────────────────────────────────────────────────

const mockCases = [
  { id: '1', name: 'Smith v. Smith (2024-CV-1234)' },
  { id: '2', name: 'Johnson Matter (2024-CV-5678)' },
  { id: '3', name: 'Davis v. Davis (2024-CV-9012)' },
];

const mockActiveWorkflows = [
  { id: 'a1', workflowTitle: 'Petition for Divorce', caseName: 'Smith v. Smith', step: 3, startedAt: '2 hours ago' },
  { id: 'a2', workflowTitle: 'Financial Disclosure', caseName: 'Johnson Matter', step: 2, startedAt: 'Yesterday' },
];

const mockCompletedWorkflows = [
  { id: 'c1', workflowTitle: 'Settlement Agreement', caseName: 'Davis v. Davis', completedAt: 'Jan 15, 2025', documents: ['Settlement_Agreement_Davis.pdf', 'Settlement_Agreement_Davis.docx'] },
];

// ─── Step Indicator ──────────────────────────────────────────────────────────

function StepIndicator({ current, total, labels }: { current: number; total: number; labels: string[] }) {
  return (
    <div className="mb-8">
      <div className="flex items-center justify-between mb-2">
        {labels.map((label, i) => (
          <div key={i} className="flex flex-col items-center flex-1">
            <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold transition-all ${
              i < current ? 'bg-green-500 text-white' : i === current ? 'bg-blue-600 text-white ring-4 ring-blue-100' : 'bg-slate-200 text-slate-500'
            }`}>
              {i < current ? '✓' : i + 1}
            </div>
            <span className={`text-xs mt-1 text-center hidden sm:block ${i === current ? 'text-blue-700 font-semibold' : 'text-slate-400'}`}>{label}</span>
          </div>
        ))}
      </div>
      <div className="w-full bg-slate-200 rounded-full h-1.5 mt-2">
        <div className="bg-blue-600 h-1.5 rounded-full transition-all duration-500" style={{ width: `${(current / (total - 1)) * 100}%` }} />
      </div>
      <p className="text-xs text-slate-500 mt-2 text-center sm:hidden">Step {current + 1} of {total}: {labels[current]}</p>
    </div>
  );
}

// ─── Wizard Steps ────────────────────────────────────────────────────────────

function StepCaseSelection({ selectedCase, setSelectedCase, isProSe }: { selectedCase: string; setSelectedCase: (v: string) => void; isProSe: boolean }) {
  const [showNew, setShowNew] = useState(false);
  const [newCase, setNewCase] = useState('');
  return (
    <div className="space-y-6">
      <h3 className="text-lg font-bold text-slate-800">{isProSe ? '📁 Which matter is this for?' : '📁 Case Selection'}</h3>
      {isProSe && <p className="text-sm text-slate-500">Select your case or start a new one. This keeps all your documents organized together.</p>}
      <div>
        <label className="block text-sm font-medium text-slate-700 mb-2">Select Existing Case</label>
        <select value={selectedCase} onChange={e => setSelectedCase(e.target.value)} className="w-full rounded-lg border border-slate-300 px-4 py-2.5 text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500">
          <option value="">— Choose a case —</option>
          {mockCases.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
        </select>
      </div>
      <div className="text-center text-sm text-slate-400">or</div>
      {!showNew ? (
        <button onClick={() => setShowNew(true)} className="w-full border-2 border-dashed border-slate-300 rounded-lg py-3 text-sm text-slate-500 hover:border-blue-400 hover:text-blue-600 transition-colors">
          + Create New Case
        </button>
      ) : (
        <div className="flex gap-2">
          <input value={newCase} onChange={e => setNewCase(e.target.value)} placeholder="Case name (e.g., Smith v. Smith)" className="flex-1 rounded-lg border border-slate-300 px-4 py-2.5 text-sm focus:ring-2 focus:ring-blue-500" />
          <button onClick={() => { if (newCase) { setSelectedCase('new'); setShowNew(false); } }} className="px-4 py-2.5 bg-blue-600 text-white rounded-lg text-sm font-medium hover:bg-blue-700">Create</button>
        </div>
      )}
    </div>
  );
}

function StepInfoGathering({ fields, formData, setFormData, isProSe }: { fields: FieldDef[]; formData: Record<string, string>; setFormData: (d: Record<string, string>) => void; isProSe: boolean }) {
  const [showTooltip, setShowTooltip] = useState<string | null>(null);
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-bold text-slate-800">{isProSe ? '📝 Tell us about your situation' : '📝 Information Gathering'}</h3>
        <button className="text-xs px-3 py-1.5 bg-purple-50 text-purple-700 rounded-lg hover:bg-purple-100 transition-colors font-medium">
          ✨ Auto-fill from Case RAG
        </button>
      </div>
      {isProSe && <p className="text-sm text-slate-500">Fill in what you can. You can always come back and update this later.</p>}
      <div className="grid gap-4">
        {fields.map(f => (
          <div key={f.name} className="relative">
            <div className="flex items-center gap-2 mb-1.5">
              <label className="text-sm font-medium text-slate-700">{isProSe && f.proSeLabel ? f.proSeLabel : f.label}</label>
              <button
                onMouseEnter={() => setShowTooltip(f.name)}
                onMouseLeave={() => setShowTooltip(null)}
                className="w-4 h-4 rounded-full bg-slate-200 text-slate-500 text-xs flex items-center justify-center hover:bg-blue-100 hover:text-blue-600"
              >?</button>
              {showTooltip === f.name && (
                <div className="absolute top-0 left-full ml-2 z-10 bg-slate-800 text-white text-xs rounded-lg px-3 py-2 max-w-xs shadow-lg">{f.tooltip}</div>
              )}
            </div>
            {f.type === 'textarea' ? (
              <textarea value={formData[f.name] || ''} onChange={e => setFormData({ ...formData, [f.name]: e.target.value })} rows={3} className="w-full rounded-lg border border-slate-300 px-4 py-2.5 text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500" />
            ) : f.type === 'select' ? (
              <select value={formData[f.name] || ''} onChange={e => setFormData({ ...formData, [f.name]: e.target.value })} className="w-full rounded-lg border border-slate-300 px-4 py-2.5 text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500">
                <option value="">— Select —</option>
                {f.options?.map(o => <option key={o} value={o}>{o}</option>)}
              </select>
            ) : (
              <input type={f.type} value={formData[f.name] || ''} onChange={e => setFormData({ ...formData, [f.name]: e.target.value })} className="w-full rounded-lg border border-slate-300 px-4 py-2.5 text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500" />
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

function StepResearch({ sources, selectedSources, setSelectedSources, isProSe }: { sources: ResearchSource[]; selectedSources: string[]; setSelectedSources: (s: string[]) => void; isProSe: boolean }) {
  const [showPanel, setShowPanel] = useState(false);
  const toggle = (id: string) => setSelectedSources(selectedSources.includes(id) ? selectedSources.filter(s => s !== id) : [...selectedSources, id]);
  const typeIcon = (t: string) => t === 'wiki' ? '📖' : t === 'caselaw' ? '⚖️' : '📜';
  const typeBg = (t: string) => t === 'wiki' ? 'bg-blue-50 text-blue-700' : t === 'caselaw' ? 'bg-amber-50 text-amber-700' : 'bg-green-50 text-green-700';
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-bold text-slate-800">{isProSe ? '📚 Relevant Legal Information' : '📚 Legal Research'}</h3>
        <button onClick={() => setShowPanel(!showPanel)} className="text-xs px-3 py-1.5 bg-blue-50 text-blue-700 rounded-lg hover:bg-blue-100 transition-colors font-medium">
          + Add Research
        </button>
      </div>
      <div className="bg-emerald-50 border border-emerald-200 rounded-lg p-3 text-xs text-emerald-700">
        💡 {isProSe ? 'These legal sources help make sure your document is accurate and follows the law.' : 'Selected sources will ground the AI to prevent hallucinations and ensure citation accuracy.'}
      </div>
      <div className="space-y-3">
        {sources.map(s => (
          <label key={s.id} className={`flex items-start gap-3 p-3 rounded-lg border cursor-pointer transition-all ${selectedSources.includes(s.id) ? 'border-blue-300 bg-blue-50/50' : 'border-slate-200 hover:border-slate-300'}`}>
            <input type="checkbox" checked={selectedSources.includes(s.id)} onChange={() => toggle(s.id)} className="mt-1 rounded border-slate-300 text-blue-600 focus:ring-blue-500" />
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 mb-1">
                <span>{typeIcon(s.type)}</span>
                <span className="font-medium text-sm text-slate-800">{s.title}</span>
                <span className={`text-xs px-2 py-0.5 rounded-full ${typeBg(s.type)}`}>{s.type}</span>
              </div>
              <p className="text-xs text-slate-500">{s.citation}</p>
              <p className="text-xs text-slate-400 mt-1">{s.summary}</p>
            </div>
          </label>
        ))}
      </div>
      {showPanel && (
        <div className="border border-slate-200 rounded-lg p-4 bg-slate-50">
          <h4 className="text-sm font-medium text-slate-700 mb-2">Search Additional Sources</h4>
          <div className="flex gap-2">
            <input placeholder="Search case law, statutes, wiki..." className="flex-1 rounded-lg border border-slate-300 px-3 py-2 text-sm" />
            <button className="px-4 py-2 bg-blue-600 text-white rounded-lg text-sm font-medium hover:bg-blue-700">Search</button>
          </div>
          <p className="text-xs text-slate-400 mt-2">Search results will appear here (connected to RAG pipeline)</p>
        </div>
      )}
    </div>
  );
}

function StepGenerate({ documentName, mockContent, selectedSourceCount, isProSe }: { documentName: string; mockContent: string; selectedSourceCount: number; isProSe: boolean }) {
  const [generated, setGenerated] = useState(false);
  const [editing, setEditing] = useState(false);
  const [content, setContent] = useState(mockContent);
  return (
    <div className="space-y-6">
      <h3 className="text-lg font-bold text-slate-800">{isProSe ? '📄 Create Your Document' : '📄 Document Generation'}</h3>
      {!generated ? (
        <div className="text-center py-12 space-y-4">
          <div className="w-16 h-16 bg-blue-50 rounded-2xl flex items-center justify-center mx-auto text-3xl">📄</div>
          <p className="text-sm text-slate-600">{isProSe ? `Ready to create your ${documentName}?` : `Generate ${documentName} using collected information and selected research.`}</p>
          <button onClick={() => setGenerated(true)} className="px-6 py-3 bg-blue-600 text-white rounded-xl font-semibold hover:bg-blue-700 transition-colors shadow-sm">
            ✨ Generate {documentName}
          </button>
          <p className="text-xs text-slate-400">Grounded in {selectedSourceCount} verified legal source{selectedSourceCount !== 1 ? 's' : ''}</p>
        </div>
      ) : (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="text-green-600">✓</span>
              <span className="text-sm font-medium text-green-700">Document Generated</span>
            </div>
            <div className="flex gap-2">
              <button onClick={() => setEditing(!editing)} className="text-xs px-3 py-1.5 border border-slate-300 rounded-lg hover:bg-slate-50 transition-colors">
                {editing ? '👁 Preview' : '✏️ Edit'}
              </button>
              <button onClick={() => { setContent(mockContent); }} className="text-xs px-3 py-1.5 border border-slate-300 rounded-lg hover:bg-slate-50 transition-colors">🔄 Regenerate</button>
            </div>
          </div>
          {editing ? (
            <textarea value={content} onChange={e => setContent(e.target.value)} rows={16} className="w-full rounded-lg border border-slate-300 px-4 py-3 text-sm font-mono focus:ring-2 focus:ring-blue-500" />
          ) : (
            <div className="border border-slate-200 rounded-lg bg-white p-6 max-h-96 overflow-y-auto">
              <pre className="text-sm text-slate-700 whitespace-pre-wrap font-serif leading-relaxed">{content}</pre>
            </div>
          )}
          <div className="bg-slate-50 rounded-lg p-3 border border-slate-200">
            <p className="text-xs font-medium text-slate-600 mb-1">📎 Sources Used ({selectedSourceCount})</p>
            <p className="text-xs text-slate-400">This document was grounded in {selectedSourceCount} verified legal source{selectedSourceCount !== 1 ? 's' : ''} from your research selection.</p>
          </div>
        </div>
      )}
    </div>
  );
}

function StepExport({ documentName, isProSe }: { documentName: string; isProSe: boolean }) {
  return (
    <div className="space-y-6">
      <h3 className="text-lg font-bold text-slate-800">{isProSe ? '✅ Your Document is Ready!' : '✅ Review & Export'}</h3>
      <div className="border border-slate-200 rounded-lg bg-white p-6">
        <div className="flex items-center gap-3 mb-4">
          <div className="w-12 h-12 bg-green-50 rounded-xl flex items-center justify-center text-2xl">📄</div>
          <div>
            <p className="font-semibold text-slate-800">{documentName}</p>
            <p className="text-xs text-slate-400">Generated just now • Ready for review</p>
          </div>
        </div>
        <div className="border border-slate-100 rounded-lg bg-slate-50 p-4 mb-4 max-h-48 overflow-y-auto">
          <p className="text-xs text-slate-500 italic">Document preview would render here with full formatting...</p>
        </div>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        {[
          { label: '📥 Download as PDF', desc: 'Court-ready PDF format', primary: true },
          { label: '📥 Download as Word', desc: 'Editable .docx format', primary: true },
          { label: '📁 Add to Case File', desc: 'Save to case documents', primary: false },
          { label: '🏛 File with Court', desc: 'Coming Soon', primary: false, disabled: true },
          { label: '👤 Share with Client', desc: isProSe ? 'Save a copy' : 'Via Client Portal', primary: false },
        ].map((btn, i) => (
          <button key={i} disabled={btn.disabled} className={`flex items-center gap-3 p-4 rounded-xl border text-left transition-all ${
            btn.disabled ? 'border-slate-200 bg-slate-50 opacity-50 cursor-not-allowed' :
            btn.primary ? 'border-blue-200 bg-blue-50 hover:bg-blue-100 hover:border-blue-300' : 'border-slate-200 hover:bg-slate-50 hover:border-slate-300'
          }`}>
            <div>
              <p className="text-sm font-medium text-slate-800">{btn.label}</p>
              <p className="text-xs text-slate-400">{btn.desc}</p>
            </div>
          </button>
        ))}
      </div>
    </div>
  );
}

// ─── Wizard Component ────────────────────────────────────────────────────────

function WorkflowWizardModal({ workflow, onClose, isProSe }: { workflow: WorkflowDefinition; onClose: () => void; isProSe: boolean }) {
  const [step, setStep] = useState(0);
  const [selectedCase, setSelectedCase] = useState('');
  const [formData, setFormData] = useState<Record<string, string>>({});
  const [selectedSources, setSelectedSources] = useState<string[]>(workflow.researchSources.map(s => s.id));

  const totalSteps = isProSe ? 4 : 5; // Pro Se skips research step
  const labels = isProSe
    ? ['Select Case', 'Your Info', 'Generate', 'Download']
    : ['Case', 'Info', 'Research', 'Generate', 'Export'];

  const canNext = () => {
    if (step === 0) return !!selectedCase;
    return true;
  };

  const currentStep = isProSe && step >= 2 ? step + 1 : step; // map pro se steps

  return (
    <div className="fixed inset-0 z-50 bg-black/40 flex items-center justify-center p-4 animate-fade-in">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl max-h-[90vh] flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100">
          <div className="flex items-center gap-3">
            <span className="text-xl">{workflow.icon}</span>
            <div>
              <h2 className="font-bold text-slate-800">{workflow.title}</h2>
              {selectedCase && <p className="text-xs text-blue-600">Working on: {mockCases.find(c => c.id === selectedCase)?.name || 'New Case'}</p>}
            </div>
          </div>
          <button onClick={onClose} className="w-8 h-8 rounded-lg hover:bg-slate-100 flex items-center justify-center text-slate-400 hover:text-slate-600 transition-colors">✕</button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto px-6 py-6">
          <StepIndicator current={step} total={totalSteps} labels={labels} />

          {step === 0 && <StepCaseSelection selectedCase={selectedCase} setSelectedCase={setSelectedCase} isProSe={isProSe} />}
          {step === 1 && <StepInfoGathering fields={workflow.fields} formData={formData} setFormData={setFormData} isProSe={isProSe} />}
          {step === 2 && !isProSe && <StepResearch sources={workflow.researchSources} selectedSources={selectedSources} setSelectedSources={setSelectedSources} isProSe={isProSe} />}
          {((step === 2 && isProSe) || (step === 3 && !isProSe)) && <StepGenerate documentName={workflow.documentName} mockContent={workflow.mockDocumentContent} selectedSourceCount={selectedSources.length} isProSe={isProSe} />}
          {((step === 3 && isProSe) || (step === 4 && !isProSe)) && <StepExport documentName={workflow.documentName} isProSe={isProSe} />}
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between px-6 py-4 border-t border-slate-100">
          <button onClick={() => step === 0 ? onClose() : setStep(step - 1)} className="px-4 py-2 text-sm text-slate-600 hover:text-slate-800 hover:bg-slate-100 rounded-lg transition-colors">
            {step === 0 ? 'Cancel' : '← Back'}
          </button>
          {step < totalSteps - 1 ? (
            <button onClick={() => canNext() && setStep(step + 1)} disabled={!canNext()} className={`px-6 py-2 text-sm font-semibold rounded-lg transition-colors ${canNext() ? 'bg-blue-600 text-white hover:bg-blue-700' : 'bg-slate-200 text-slate-400 cursor-not-allowed'}`}>
              Next →
            </button>
          ) : (
            <button onClick={onClose} className="px-6 py-2 text-sm font-semibold bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors">
              ✓ Done
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

// ─── Main Export ──────────────────────────────────────────────────────────────

export default function WorkflowWizardPage({ title, subtitle, icon, iconGradient, workflows, isProSe }: WorkflowWizardPageProps) {
  const [tab, setTab] = useState<'workflows' | 'active' | 'completed'>('workflows');
  const [activeWorkflow, setActiveWorkflow] = useState<WorkflowDefinition | null>(null);

  const tabs = [
    { id: 'workflows' as const, label: 'Workflows', count: workflows.length },
    { id: 'active' as const, label: 'Active', count: mockActiveWorkflows.length },
    { id: 'completed' as const, label: 'Completed', count: mockCompletedWorkflows.length },
  ];

  return (
    <div className="max-w-5xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex items-start gap-3">
        <div className={`w-10 h-10 rounded-xl bg-gradient-to-br ${iconGradient} flex items-center justify-center shadow-sm flex-shrink-0`}>
          <span className="text-white text-lg">{icon}</span>
        </div>
        <div>
          <h1 className="text-xl sm:text-2xl font-bold text-slate-900">{title}</h1>
          <p className="text-sm text-slate-500">{subtitle}</p>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex gap-1 bg-slate-100 rounded-lg p-1">
        {tabs.map(t => (
          <button key={t.id} onClick={() => setTab(t.id)} className={`flex-1 px-4 py-2 rounded-md text-sm font-medium transition-all ${tab === t.id ? 'bg-white text-slate-800 shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}>
            {t.label} <span className={`ml-1 text-xs ${tab === t.id ? 'text-blue-600' : 'text-slate-400'}`}>({t.count})</span>
          </button>
        ))}
      </div>

      {/* Tab Content */}
      {tab === 'workflows' && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {workflows.map(w => (
            <button key={w.id} onClick={() => setActiveWorkflow(w)} className="text-left p-5 bg-white rounded-xl border border-slate-200 hover:border-blue-300 hover:shadow-md transition-all group">
              <div className="text-2xl mb-3">{w.icon}</div>
              <h3 className="font-semibold text-slate-800 group-hover:text-blue-700 transition-colors">{w.title}</h3>
              <p className="text-xs text-slate-500 mt-1">{w.description}</p>
              <div className="mt-3 text-xs text-blue-600 font-medium opacity-0 group-hover:opacity-100 transition-opacity">Start workflow →</div>
            </button>
          ))}
        </div>
      )}

      {tab === 'active' && (
        <div className="space-y-3">
          {mockActiveWorkflows.length === 0 ? (
            <div className="text-center py-12 text-slate-400 text-sm">No active workflows. Start one from the Workflows tab!</div>
          ) : mockActiveWorkflows.map(w => (
            <div key={w.id} className="bg-white rounded-xl border border-slate-200 p-4 flex items-center gap-4">
              <div className="flex-1">
                <p className="font-semibold text-slate-800 text-sm">{w.workflowTitle}</p>
                <p className="text-xs text-slate-400">{w.caseName} • Started {w.startedAt}</p>
                <div className="mt-2 flex items-center gap-3">
                  <div className="flex-1 bg-slate-100 rounded-full h-2">
                    <div className="bg-blue-500 h-2 rounded-full" style={{ width: `${(w.step / 5) * 100}%` }} />
                  </div>
                  <span className="text-xs text-slate-500">Step {w.step}/5</span>
                </div>
              </div>
              <button className="px-3 py-1.5 bg-blue-50 text-blue-700 rounded-lg text-xs font-medium hover:bg-blue-100 transition-colors">Resume</button>
            </div>
          ))}
        </div>
      )}

      {tab === 'completed' && (
        <div className="space-y-3">
          {mockCompletedWorkflows.length === 0 ? (
            <div className="text-center py-12 text-slate-400 text-sm">No completed workflows yet.</div>
          ) : mockCompletedWorkflows.map(w => (
            <div key={w.id} className="bg-white rounded-xl border border-slate-200 p-4">
              <div className="flex items-center justify-between mb-2">
                <div>
                  <p className="font-semibold text-slate-800 text-sm">{w.workflowTitle}</p>
                  <p className="text-xs text-slate-400">{w.caseName} • Completed {w.completedAt}</p>
                </div>
                <span className="text-xs px-2 py-1 bg-green-50 text-green-700 rounded-full font-medium">✓ Complete</span>
              </div>
              <div className="flex gap-2 mt-3">
                {w.documents.map((d, i) => (
                  <button key={i} className="text-xs px-3 py-1.5 bg-slate-50 border border-slate-200 rounded-lg hover:bg-slate-100 transition-colors text-slate-600">📄 {d}</button>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Wizard Modal */}
      {activeWorkflow && (
        <WorkflowWizardModal workflow={activeWorkflow} onClose={() => setActiveWorkflow(null)} isProSe={isProSe} />
      )}
    </div>
  );
}
