"use client";

import { useState, useEffect, useCallback } from 'react';
import ESignature, { SigningBlock, SignedBadge, type SignatureData } from '@/components/ESignature';

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
  proSeLabel?: string;
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

// ─── Saved Workflow Types ────────────────────────────────────────────────────

interface SavedWorkflow {
  instanceId: string;
  workflowId: string;
  workflowTitle: string;
  workflowIcon: string;
  caseName: string;
  caseId: string;
  step: number;
  totalSteps: number;
  formData: Record<string, string>;
  selectedSources: string[];
  generatedContent: string;
  startedAt: string; // ISO
  completedAt?: string; // ISO
  documentName: string;
}

const STORAGE_KEY = 'acc_workflows';

function loadWorkflows(): SavedWorkflow[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch { return []; }
}

function saveWorkflows(wfs: SavedWorkflow[]) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(wfs));
}

function timeAgo(iso: string): string {
  const diff = Date.now() - new Date(iso).getTime();
  const mins = Math.floor(diff / 60000);
  if (mins < 1) return 'Just now';
  if (mins < 60) return `${mins}m ago`;
  const hrs = Math.floor(mins / 60);
  if (hrs < 24) return `${hrs}h ago`;
  const days = Math.floor(hrs / 24);
  if (days < 7) return `${days}d ago`;
  return new Date(iso).toLocaleDateString();
}

// ─── Mock Data ───────────────────────────────────────────────────────────────

const mockCases = [
  { id: '1', name: 'Smith v. Smith (2024-CV-1234)' },
  { id: '2', name: 'Johnson Matter (2024-CV-5678)' },
  { id: '3', name: 'Davis v. Davis (2024-CV-9012)' },
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
  const [signatures, setSignatures] = useState<SignatureData[]>([]);
  const [showSignPad, setShowSignPad] = useState<{ name: string; role: 'attorney' | 'client' | 'witness' | 'notary' | 'other'; email?: string } | null>(null);

  const parties = isProSe
    ? [{ name: '', role: 'client' as const, email: '' }]
    : [
        { name: '', role: 'attorney' as const, email: '' },
        { name: '', role: 'client' as const, email: '' },
        { name: '', role: 'witness' as const, email: '' },
      ];

  const handleSign = (sig: SignatureData) => {
    setSignatures(prev => [...prev, sig]);
    setShowSignPad(null);
  };

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

      {/* ─── E-Signature Section ─── */}
      <div className="border border-slate-200 rounded-xl bg-white p-6">
        <h3 className="text-base font-bold text-slate-800 mb-1 flex items-center gap-2">✍️ Electronic Signatures</h3>
        <p className="text-xs text-slate-500 mb-4">Sign this document electronically. ESIGN Act &amp; UETA compliant.</p>

        {showSignPad ? (
          <div className="bg-slate-900 rounded-xl">
            <ESignature
              signerName={showSignPad.name}
              signerRole={showSignPad.role}
              signerEmail={showSignPad.email}
              onSign={handleSign}
              onCancel={() => setShowSignPad(null)}
            />
          </div>
        ) : (
          <div className="space-y-3">
            <SigningBlock
              parties={parties}
              signatures={signatures}
              onRequestSign={(party) => setShowSignPad(party)}
            />
          </div>
        )}

        {signatures.length > 0 && (
          <div className="mt-4 pt-3 border-t border-slate-200">
            <div className="flex items-center gap-2 text-xs text-slate-500">
              <span>🔒 Signatures encrypted &amp; timestamped</span>
              <span>•</span>
              <span>Audit trail: {signatures.map(s => `${s.name} (${s.role})`).join(', ')}</span>
            </div>
          </div>
        )}
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        {[
          { label: '📥 Download as PDF', desc: signatures.length > 0 ? 'With signatures embedded' : 'Court-ready PDF format', primary: true },
          { label: '📥 Download as Word', desc: 'Editable .docx format', primary: true },
          { label: '📁 Add to Case File', desc: 'Save to case documents', primary: false },
          { label: '✉️ Send for Signature', desc: isProSe ? 'Email to other party' : 'Send to client for e-sign', primary: false },
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

function WorkflowWizardModal({ workflow, onClose, isProSe, resumeInstance, onSave }: { workflow: WorkflowDefinition; onClose: () => void; isProSe: boolean; resumeInstance?: SavedWorkflow; onSave: (instance: SavedWorkflow, completed: boolean) => void }) {
  const [step, setStep] = useState(resumeInstance?.step || 0);
  const [selectedCase, setSelectedCase] = useState(resumeInstance?.caseId || '');
  const [formData, setFormData] = useState<Record<string, string>>(resumeInstance?.formData || {});
  const [selectedSources, setSelectedSources] = useState<string[]>(resumeInstance?.selectedSources || workflow.researchSources.map(s => s.id));
  const [instanceId] = useState(resumeInstance?.instanceId || `wf_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`);
  const [startedAt] = useState(resumeInstance?.startedAt || new Date().toISOString());

  const totalSteps = isProSe ? 4 : 5;
  const labels = isProSe
    ? ['Select Case', 'Your Info', 'Generate', 'Download']
    : ['Case', 'Info', 'Research', 'Generate', 'Export'];

  const canNext = () => {
    if (step === 0) return !!selectedCase;
    return true;
  };

  const buildInstance = useCallback((s: number): SavedWorkflow => ({
    instanceId,
    workflowId: workflow.id,
    workflowTitle: workflow.title,
    workflowIcon: workflow.icon,
    caseName: mockCases.find(c => c.id === selectedCase)?.name || 'New Case',
    caseId: selectedCase,
    step: s,
    totalSteps,
    formData,
    selectedSources,
    generatedContent: '',
    startedAt,
    documentName: workflow.documentName,
  }), [instanceId, workflow, selectedCase, totalSteps, formData, selectedSources, startedAt]);

  // Auto-save on step change
  useEffect(() => {
    if (selectedCase) {
      onSave(buildInstance(step), false);
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [step]);

  const handleClose = () => {
    // Save progress when closing mid-workflow
    if (selectedCase && step < totalSteps - 1) {
      onSave(buildInstance(step), false);
    }
    onClose();
  };

  const handleDone = () => {
    onSave(buildInstance(step), true);
    onClose();
  };

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
          <button onClick={handleClose} className="w-8 h-8 rounded-lg hover:bg-slate-100 flex items-center justify-center text-slate-400 hover:text-slate-600 transition-colors">✕</button>
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
          <button onClick={() => step === 0 ? handleClose() : setStep(step - 1)} className="px-4 py-2 text-sm text-slate-600 hover:text-slate-800 hover:bg-slate-100 rounded-lg transition-colors">
            {step === 0 ? 'Cancel' : '← Back'}
          </button>
          {step < totalSteps - 1 ? (
            <button onClick={() => canNext() && setStep(step + 1)} disabled={!canNext()} className={`px-6 py-2 text-sm font-semibold rounded-lg transition-colors ${canNext() ? 'bg-blue-600 text-white hover:bg-blue-700' : 'bg-slate-200 text-slate-400 cursor-not-allowed'}`}>
              Next →
            </button>
          ) : (
            <button onClick={handleDone} className="px-6 py-2 text-sm font-semibold bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors">
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
  const [resumeInstance, setResumeInstance] = useState<SavedWorkflow | undefined>(undefined);
  const [savedWorkflows, setSavedWorkflows] = useState<SavedWorkflow[]>([]);
  const [confirmDelete, setConfirmDelete] = useState<string | null>(null);

  // Load from localStorage on mount
  useEffect(() => {
    setSavedWorkflows(loadWorkflows());
  }, []);

  // Filter for this page's workflows
  const workflowIds = workflows.map(w => w.id);
  const activeInstances = savedWorkflows.filter(w => !w.completedAt && workflowIds.includes(w.workflowId));
  const completedInstances = savedWorkflows.filter(w => !!w.completedAt && workflowIds.includes(w.workflowId));

  const handleSave = (instance: SavedWorkflow, completed: boolean) => {
    if (completed) instance.completedAt = new Date().toISOString();
    const all = loadWorkflows();
    const idx = all.findIndex(w => w.instanceId === instance.instanceId);
    if (idx >= 0) all[idx] = instance; else all.push(instance);
    saveWorkflows(all);
    setSavedWorkflows(all);
  };

  const handleDelete = (instanceId: string) => {
    const all = loadWorkflows().filter(w => w.instanceId !== instanceId);
    saveWorkflows(all);
    setSavedWorkflows(all);
    setConfirmDelete(null);
  };

  const handleResume = (instance: SavedWorkflow) => {
    const wf = workflows.find(w => w.id === instance.workflowId);
    if (wf) {
      setResumeInstance(instance);
      setActiveWorkflow(wf);
    }
  };

  const tabs = [
    { id: 'workflows' as const, label: 'Workflows', count: workflows.length },
    { id: 'active' as const, label: 'Active', count: activeInstances.length },
    { id: 'completed' as const, label: 'Completed', count: completedInstances.length },
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
            <button key={w.id} onClick={() => { setResumeInstance(undefined); setActiveWorkflow(w); }} className="text-left p-5 bg-white rounded-xl border border-slate-200 hover:border-blue-300 hover:shadow-md transition-all group">
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
          {activeInstances.length === 0 ? (
            <div className="text-center py-12">
              <div className="text-4xl mb-3">📋</div>
              <p className="text-slate-500 text-sm">No active workflows</p>
              <p className="text-slate-400 text-xs mt-1">Start a workflow from the Workflows tab — your progress is saved automatically.</p>
            </div>
          ) : activeInstances.map(w => (
            <div key={w.instanceId} className="bg-white rounded-xl border border-slate-200 p-4 flex items-center gap-4">
              <div className="text-2xl flex-shrink-0">{w.workflowIcon}</div>
              <div className="flex-1 min-w-0">
                <p className="font-semibold text-slate-800 text-sm">{w.workflowTitle}</p>
                <p className="text-xs text-slate-400 truncate">{w.caseName} • Started {timeAgo(w.startedAt)}</p>
                <div className="mt-2 flex items-center gap-3">
                  <div className="flex-1 bg-slate-100 rounded-full h-2">
                    <div className="bg-blue-500 h-2 rounded-full transition-all" style={{ width: `${(w.step / (w.totalSteps - 1)) * 100}%` }} />
                  </div>
                  <span className="text-xs text-slate-500 flex-shrink-0">Step {w.step + 1}/{w.totalSteps}</span>
                </div>
              </div>
              <div className="flex gap-2 flex-shrink-0">
                <button onClick={() => handleResume(w)} className="px-3 py-1.5 bg-blue-50 text-blue-700 rounded-lg text-xs font-medium hover:bg-blue-100 transition-colors">Resume</button>
                {confirmDelete === w.instanceId ? (
                  <div className="flex gap-1">
                    <button onClick={() => handleDelete(w.instanceId)} className="px-2 py-1.5 bg-red-600 text-white rounded-lg text-xs font-medium hover:bg-red-700">Yes</button>
                    <button onClick={() => setConfirmDelete(null)} className="px-2 py-1.5 bg-slate-100 text-slate-600 rounded-lg text-xs font-medium hover:bg-slate-200">No</button>
                  </div>
                ) : (
                  <button onClick={() => setConfirmDelete(w.instanceId)} className="px-3 py-1.5 text-red-400 hover:text-red-600 hover:bg-red-50 rounded-lg text-xs transition-colors" title="Delete">🗑</button>
                )}
              </div>
            </div>
          ))}
        </div>
      )}

      {tab === 'completed' && (
        <div className="space-y-3">
          {completedInstances.length === 0 ? (
            <div className="text-center py-12">
              <div className="text-4xl mb-3">✅</div>
              <p className="text-slate-500 text-sm">No completed workflows yet</p>
              <p className="text-slate-400 text-xs mt-1">Workflows you finish will appear here with downloadable documents.</p>
            </div>
          ) : completedInstances.map(w => (
            <div key={w.instanceId} className="bg-white rounded-xl border border-slate-200 p-4">
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-3">
                  <span className="text-xl">{w.workflowIcon}</span>
                  <div>
                    <p className="font-semibold text-slate-800 text-sm">{w.workflowTitle}</p>
                    <p className="text-xs text-slate-400">{w.caseName} • Completed {timeAgo(w.completedAt!)}</p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-xs px-2 py-1 bg-green-50 text-green-700 rounded-full font-medium">✓ Complete</span>
                  {confirmDelete === w.instanceId ? (
                    <div className="flex gap-1">
                      <button onClick={() => handleDelete(w.instanceId)} className="px-2 py-1.5 bg-red-600 text-white rounded-lg text-xs font-medium hover:bg-red-700">Yes</button>
                      <button onClick={() => setConfirmDelete(null)} className="px-2 py-1.5 bg-slate-100 text-slate-600 rounded-lg text-xs font-medium hover:bg-slate-200">No</button>
                    </div>
                  ) : (
                    <button onClick={() => setConfirmDelete(w.instanceId)} className="text-red-400 hover:text-red-600 text-xs" title="Delete">🗑</button>
                  )}
                </div>
              </div>
              <div className="flex flex-wrap gap-2 mt-3">
                <button className="text-xs px-3 py-1.5 bg-blue-50 border border-blue-200 rounded-lg hover:bg-blue-100 transition-colors text-blue-700">📥 Download PDF</button>
                <button className="text-xs px-3 py-1.5 bg-slate-50 border border-slate-200 rounded-lg hover:bg-slate-100 transition-colors text-slate-600">📥 Download Word</button>
                <button className="text-xs px-3 py-1.5 bg-amber-50 border border-amber-200 rounded-lg hover:bg-amber-100 transition-colors text-amber-700">✍️ E-Sign</button>
                <button className="text-xs px-3 py-1.5 bg-slate-50 border border-slate-200 rounded-lg hover:bg-slate-100 transition-colors text-slate-600">📁 Add to Case File</button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Wizard Modal */}
      {activeWorkflow && (
        <WorkflowWizardModal
          workflow={activeWorkflow}
          onClose={() => { setActiveWorkflow(null); setResumeInstance(undefined); }}
          isProSe={isProSe}
          resumeInstance={resumeInstance}
          onSave={handleSave}
        />
      )}
    </div>
  );
}
