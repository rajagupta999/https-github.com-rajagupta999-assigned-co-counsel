"use client";

import { useState, useEffect, useMemo } from 'react';

// Types
type VoucherStatus = 'Draft' | 'Submitted' | 'Under Review' | 'Approved' | 'Paid' | 'Partially Approved' | 'Rejected';
type CaseType = 'felony' | 'misdemeanor' | 'family';
type ActivityType = 'Court Appearance' | 'Legal Research' | 'Client Meeting' | 'Travel' | 'Preparation' | 'Phone Calls';
type ExpenseCategory = 'Travel' | 'Copies' | 'Postage' | 'Expert Fees' | 'Investigation' | 'Transcripts' | 'Other';

interface TimeEntry {
  id: string;
  date: string;
  activityType: ActivityType;
  hours: number;
  description: string;
}

interface Expense {
  id: string;
  date: string;
  category: ExpenseCategory;
  amount: number;
  description: string;
}

interface Voucher {
  id: string;
  attorneyName: string;
  attorneyBarNumber: string;
  caseNumber: string;
  indictmentNumber: string;
  clientName: string;
  charges: string;
  court: string;
  judge: string;
  caseType: CaseType;
  status: VoucherStatus;
  timeEntries: TimeEntry[];
  expenses: Expense[];
  excessJustification: string;
  submittedDate: string | null;
  approvedDate: string | null;
  paidDate: string | null;
  approvedAmount: number | null;
  createdAt: string;
}

const RATES: Record<CaseType, number> = { felony: 158, misdemeanor: 158, family: 158 };
const CAPS: Record<CaseType, number> = { felony: 8000, misdemeanor: 8000, family: 8000 };
const ACTIVITY_TYPES: ActivityType[] = ['Court Appearance', 'Legal Research', 'Client Meeting', 'Travel', 'Preparation', 'Phone Calls'];
const EXPENSE_CATEGORIES: ExpenseCategory[] = ['Travel', 'Copies', 'Postage', 'Expert Fees', 'Investigation', 'Transcripts', 'Other'];

const STATUS_COLORS: Record<VoucherStatus, string> = {
  'Draft': 'bg-slate-100 text-slate-700',
  'Submitted': 'bg-blue-100 text-blue-700',
  'Under Review': 'bg-amber-100 text-amber-700',
  'Approved': 'bg-emerald-100 text-emerald-700',
  'Paid': 'bg-green-100 text-green-800',
  'Partially Approved': 'bg-orange-100 text-orange-700',
  'Rejected': 'bg-red-100 text-red-700',
};

function generateId() { return Date.now().toString(36) + Math.random().toString(36).slice(2, 7); }

function calcVoucherTotals(v: Voucher) {
  const rate = RATES[v.caseType];
  const cap = CAPS[v.caseType];
  const totalHours = v.timeEntries.reduce((s, e) => s + e.hours, 0);
  const legalFees = totalHours * rate;
  const totalExpenses = v.expenses.reduce((s, e) => s + e.amount, 0);
  const totalAmount = legalFees + totalExpenses;
  const overCap = legalFees > cap;
  const excessAmount = overCap ? legalFees - cap : 0;
  return { totalHours, legalFees, totalExpenses, totalAmount, overCap, excessAmount, rate, cap };
}

// Sample data
const SAMPLE_VOUCHERS: Voucher[] = [
  {
    id: 'v1', attorneyName: 'Raja Gupta', attorneyBarNumber: '5432198', caseNumber: 'CR-2025-001234',
    indictmentNumber: 'IND-2025-5678', clientName: 'John Doe', charges: 'Criminal Possession of a Weapon 2nd',
    court: 'Supreme Court, Kings County', judge: 'Hon. Maria Santos', caseType: 'felony', status: 'Submitted',
    timeEntries: [
      { id: 't1', date: '2025-01-15', activityType: 'Court Appearance', hours: 3.5, description: 'Arraignment and bail application' },
      { id: 't2', date: '2025-01-20', activityType: 'Client Meeting', hours: 2.0, description: 'Initial client interview at Rikers' },
      { id: 't3', date: '2025-01-22', activityType: 'Legal Research', hours: 4.0, description: 'Research suppression issues re: search warrant' },
      { id: 't4', date: '2025-01-25', activityType: 'Preparation', hours: 3.0, description: 'Draft motion to suppress physical evidence' },
      { id: 't5', date: '2025-02-01', activityType: 'Court Appearance', hours: 2.5, description: 'Motion argument - suppression hearing' },
      { id: 't6', date: '2025-02-03', activityType: 'Phone Calls', hours: 0.5, description: 'Call with ADA re: discovery' },
    ],
    expenses: [
      { id: 'e1', date: '2025-01-20', category: 'Travel', amount: 45.00, description: 'Subway + bus to Rikers' },
      { id: 'e2', date: '2025-01-22', category: 'Copies', amount: 32.50, description: 'Case file copies - 130 pages' },
    ],
    excessJustification: '', submittedDate: '2025-02-05', approvedDate: null, paidDate: null, approvedAmount: null, createdAt: '2025-01-14',
  },
  {
    id: 'v2', attorneyName: 'Raja Gupta', attorneyBarNumber: '5432198', caseNumber: 'CR-2025-004567',
    indictmentNumber: '', clientName: 'Jane Smith', charges: 'Petit Larceny', court: 'Criminal Court, New York County',
    judge: 'Hon. Robert Chen', caseType: 'misdemeanor', status: 'Paid',
    timeEntries: [
      { id: 't7', date: '2024-11-10', activityType: 'Court Appearance', hours: 2.0, description: 'Arraignment' },
      { id: 't8', date: '2024-11-15', activityType: 'Client Meeting', hours: 1.5, description: 'Client interview' },
      { id: 't9', date: '2024-12-01', activityType: 'Court Appearance', hours: 1.0, description: 'Plea and disposition' },
      { id: 't10', date: '2024-11-20', activityType: 'Preparation', hours: 2.0, description: 'Review discovery, prepare for plea' },
    ],
    expenses: [],
    excessJustification: '', submittedDate: '2024-12-05', approvedDate: '2024-12-20', paidDate: '2025-01-15', approvedAmount: 1027.00, createdAt: '2024-11-09',
  },
  {
    id: 'v3', attorneyName: 'Raja Gupta', attorneyBarNumber: '5432198', caseNumber: 'FAM-2025-002345',
    indictmentNumber: '', clientName: 'Maria Garcia', charges: 'Art. 10 Neglect Proceeding', court: 'Family Court, Bronx County',
    judge: 'Hon. Lisa Park', caseType: 'family', status: 'Draft',
    timeEntries: [
      { id: 't11', date: '2025-02-10', activityType: 'Court Appearance', hours: 4.0, description: 'Fact-finding hearing Day 1' },
      { id: 't12', date: '2025-02-12', activityType: 'Client Meeting', hours: 1.5, description: 'Prep client for testimony' },
    ],
    expenses: [
      { id: 'e3', date: '2025-02-10', category: 'Travel', amount: 28.00, description: 'Round trip to Bronx Family Court' },
    ],
    excessJustification: '', submittedDate: null, approvedDate: null, paidDate: null, approvedAmount: null, createdAt: '2025-02-09',
  },
];

export default function VouchersPage() {
  const [vouchers, setVouchers] = useState<Voucher[]>([]);
  const [view, setView] = useState<'list' | 'detail' | 'edit'>('list');
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [filterStatus, setFilterStatus] = useState<VoucherStatus | 'All'>('All');

  useEffect(() => {
    const saved = localStorage.getItem('acc_vouchers');
    if (saved) { setVouchers(JSON.parse(saved)); } else { setVouchers(SAMPLE_VOUCHERS); }
  }, []);

  useEffect(() => {
    if (vouchers.length > 0) localStorage.setItem('acc_vouchers', JSON.stringify(vouchers));
  }, [vouchers]);

  const selected = vouchers.find(v => v.id === selectedId) || null;

  const stats = useMemo(() => {
    const submitted = vouchers.filter(v => v.status === 'Submitted').reduce((s, v) => s + calcVoucherTotals(v).totalAmount, 0);
    const pending = vouchers.filter(v => ['Submitted', 'Under Review'].includes(v.status)).reduce((s, v) => s + calcVoucherTotals(v).totalAmount, 0);
    const approved = vouchers.filter(v => ['Approved', 'Partially Approved'].includes(v.status)).reduce((s, v) => s + (v.approvedAmount || calcVoucherTotals(v).totalAmount), 0);
    const paid = vouchers.filter(v => v.status === 'Paid').reduce((s, v) => s + (v.approvedAmount || calcVoucherTotals(v).totalAmount), 0);
    const avgDays = (() => {
      const completed = vouchers.filter(v => v.submittedDate && (v.approvedDate || v.paidDate));
      if (completed.length === 0) return 0;
      const total = completed.reduce((s, v) => {
        const sub = new Date(v.submittedDate!).getTime();
        const end = new Date((v.paidDate || v.approvedDate)!).getTime();
        return s + (end - sub) / (1000 * 60 * 60 * 24);
      }, 0);
      return Math.round(total / completed.length);
    })();
    return { submitted, pending, approved, paid, avgDays };
  }, [vouchers]);

  const filtered = filterStatus === 'All' ? vouchers : vouchers.filter(v => v.status === filterStatus);

  const openDetail = (id: string) => { setSelectedId(id); setView('detail'); };
  const openEdit = (id: string | null) => {
    if (id) { setSelectedId(id); } else {
      const nv: Voucher = {
        id: generateId(), attorneyName: 'Raja Gupta', attorneyBarNumber: '5432198',
        caseNumber: '', indictmentNumber: '', clientName: '', charges: '', court: '', judge: '',
        caseType: 'felony', status: 'Draft', timeEntries: [], expenses: [],
        excessJustification: '', submittedDate: null, approvedDate: null, paidDate: null, approvedAmount: null,
        createdAt: new Date().toISOString().split('T')[0],
      };
      setVouchers(prev => [nv, ...prev]);
      setSelectedId(nv.id);
    }
    setView('edit');
  };

  const saveVoucher = (updated: Voucher) => {
    setVouchers(prev => prev.map(v => v.id === updated.id ? updated : v));
    setView('detail');
  };

  const deleteVoucher = (id: string) => {
    if (!confirm('Delete this voucher?')) return;
    setVouchers(prev => prev.filter(v => v.id !== id));
    setView('list');
    setSelectedId(null);
  };

  const submitVoucher = (id: string) => {
    setVouchers(prev => prev.map(v => v.id === id ? { ...v, status: 'Submitted' as VoucherStatus, submittedDate: new Date().toISOString().split('T')[0] } : v));
  };

  if (view === 'edit' && selected) return <VoucherEditor voucher={selected} onSave={saveVoucher} onCancel={() => setView(selected ? 'detail' : 'list')} />;
  if (view === 'detail' && selected) return <VoucherDetail voucher={selected} onBack={() => { setView('list'); setSelectedId(null); }} onEdit={() => setView('edit')} onDelete={() => deleteVoucher(selected.id)} onSubmit={() => submitVoucher(selected.id)} />;

  return (
    <div className="p-4 sm:p-8 max-w-7xl mx-auto">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Voucher Management</h1>
          <p className="text-sm text-slate-500 mt-1">Track and manage assigned counsel vouchers · NY County Law §722-b</p>
        </div>
        <button onClick={() => openEdit(null)} className="flex items-center gap-2 bg-navy-800 text-white px-4 py-2.5 rounded-xl text-sm font-semibold hover:bg-navy-700 transition-colors shadow-sm">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>
          New Voucher
        </button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-5 gap-4 mb-8">
        {[
          { label: 'Submitted', value: `$${stats.submitted.toLocaleString('en-US', { minimumFractionDigits: 2 })}`, color: 'text-blue-600' },
          { label: 'Pending Review', value: `$${stats.pending.toLocaleString('en-US', { minimumFractionDigits: 2 })}`, color: 'text-amber-600' },
          { label: 'Approved', value: `$${stats.approved.toLocaleString('en-US', { minimumFractionDigits: 2 })}`, color: 'text-emerald-600' },
          { label: 'Paid', value: `$${stats.paid.toLocaleString('en-US', { minimumFractionDigits: 2 })}`, color: 'text-green-700' },
          { label: 'Avg Processing', value: `${stats.avgDays} days`, color: 'text-slate-600' },
        ].map(s => (
          <div key={s.label} className="bg-white rounded-xl border border-slate-200 p-4">
            <p className="text-xs font-medium text-slate-400 uppercase tracking-wide">{s.label}</p>
            <p className={`text-xl font-bold mt-1 ${s.color}`}>{s.value}</p>
          </div>
        ))}
      </div>

      {/* Filter */}
      <div className="flex gap-2 mb-6 overflow-x-auto pb-2">
        {['All', 'Draft', 'Submitted', 'Under Review', 'Approved', 'Paid', 'Partially Approved', 'Rejected'].map(s => (
          <button key={s} onClick={() => setFilterStatus(s as any)} className={`px-3 py-1.5 rounded-lg text-xs font-medium whitespace-nowrap transition-colors ${filterStatus === s ? 'bg-navy-800 text-white' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'}`}>
            {s} {s !== 'All' && `(${vouchers.filter(v => v.status === s).length})`}
          </button>
        ))}
      </div>

      {/* Voucher list */}
      <div className="space-y-3">
        {filtered.length === 0 && (
          <div className="text-center py-16 text-slate-400">
            <p className="text-lg font-medium">No vouchers found</p>
            <p className="text-sm mt-1">Create your first voucher to get started</p>
          </div>
        )}
        {filtered.map(v => {
          const t = calcVoucherTotals(v);
          return (
            <div key={v.id} onClick={() => openDetail(v.id)} className="bg-white rounded-xl border border-slate-200 p-4 sm:p-5 hover:border-slate-300 hover:shadow-sm cursor-pointer transition-all">
              <div className="flex flex-col sm:flex-row sm:items-center gap-3 sm:gap-0 justify-between">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-3 flex-wrap">
                    <h3 className="font-semibold text-slate-900">{v.clientName || 'Untitled'}</h3>
                    <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full uppercase ${STATUS_COLORS[v.status]}`}>{v.status}</span>
                    <span className="text-[10px] font-medium px-2 py-0.5 rounded-full bg-slate-100 text-slate-500 uppercase">{v.caseType}</span>
                  </div>
                  <p className="text-sm text-slate-500 mt-1">{v.caseNumber} · {v.court || 'No court'} · {v.charges || 'No charges'}</p>
                </div>
                <div className="text-right flex-shrink-0">
                  <p className="text-lg font-bold text-slate-900">${t.totalAmount.toLocaleString('en-US', { minimumFractionDigits: 2 })}</p>
                  <p className="text-xs text-slate-400">{t.totalHours}h @ ${t.rate}/hr</p>
                  {t.overCap && <p className="text-[10px] text-red-500 font-medium mt-0.5">⚠ Over cap by ${t.excessAmount.toLocaleString()}</p>}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

// Detail View
function VoucherDetail({ voucher: v, onBack, onEdit, onDelete, onSubmit }: { voucher: Voucher; onBack: () => void; onEdit: () => void; onDelete: () => void; onSubmit: () => void }) {
  const t = calcVoucherTotals(v);
  const exportPDF = () => {
    const lines = [
      'NEW YORK STATE UNIFIED COURT SYSTEM',
      'CLAIM FOR COMPENSATION - ASSIGNED COUNSEL',
      '(County Law §722-b)',
      '',
      `Attorney: ${v.attorneyName}  |  Bar #: ${v.attorneyBarNumber}`,
      `Case: ${v.caseNumber}  |  Indictment: ${v.indictmentNumber || 'N/A'}`,
      `Client: ${v.clientName}  |  Charges: ${v.charges}`,
      `Court: ${v.court}  |  Judge: ${v.judge}`,
      `Case Type: ${v.caseType.toUpperCase()}  |  Rate: $${t.rate}/hr  |  Cap: $${t.cap.toLocaleString()}`,
      '',
      '─'.repeat(80),
      'TIME ENTRIES',
      '─'.repeat(80),
      'Date           Activity              Hours   Description',
      ...v.timeEntries.map(e => `${e.date}     ${e.activityType.padEnd(22)}${String(e.hours).padEnd(8)}${e.description}`),
      '',
      `TOTAL HOURS: ${t.totalHours}  |  LEGAL FEES: $${t.legalFees.toLocaleString('en-US', { minimumFractionDigits: 2 })}`,
      '',
      '─'.repeat(80),
      'EXPENSES',
      '─'.repeat(80),
      ...v.expenses.map(e => `${e.date}  ${e.category.padEnd(16)} $${e.amount.toFixed(2).padStart(10)}  ${e.description}`),
      `TOTAL EXPENSES: $${t.totalExpenses.toFixed(2)}`,
      '',
      '═'.repeat(80),
      `TOTAL CLAIM: $${t.totalAmount.toFixed(2)}`,
      t.overCap ? `\n⚠ EXCEEDS STATUTORY CAP by $${t.excessAmount.toFixed(2)}` : '',
      t.overCap && v.excessJustification ? `JUSTIFICATION: ${v.excessJustification}` : '',
      '',
      'I certify that the above is a true and accurate record of services rendered.',
      '',
      `Signature: ________________________     Date: ${new Date().toISOString().split('T')[0]}`,
    ].filter(Boolean);
    const blob = new Blob([lines.join('\n')], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url; a.download = `Voucher_${v.caseNumber}_${v.clientName.replace(/\s/g, '_')}.txt`;
    a.click(); URL.revokeObjectURL(url);
  };

  return (
    <div className="p-4 sm:p-8 max-w-5xl mx-auto">
      <button onClick={onBack} className="flex items-center gap-1 text-sm text-slate-500 hover:text-slate-700 mb-6">
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="15 18 9 12 15 6"/></svg>
        Back to Vouchers
      </button>

      <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4 mb-6">
        <div>
          <div className="flex items-center gap-3">
            <h1 className="text-2xl font-bold text-slate-900">{v.clientName}</h1>
            <span className={`text-xs font-bold px-2.5 py-1 rounded-full uppercase ${STATUS_COLORS[v.status]}`}>{v.status}</span>
          </div>
          <p className="text-sm text-slate-500 mt-1">{v.caseNumber} · {v.court}</p>
        </div>
        <div className="flex gap-2 flex-wrap">
          {v.status === 'Draft' && <button onClick={onSubmit} className="px-4 py-2 bg-blue-600 text-white rounded-lg text-sm font-medium hover:bg-blue-700 transition-colors">Submit Voucher</button>}
          <button onClick={onEdit} className="px-4 py-2 bg-slate-100 text-slate-700 rounded-lg text-sm font-medium hover:bg-slate-200 transition-colors">Edit</button>
          <button onClick={exportPDF} className="px-4 py-2 bg-slate-100 text-slate-700 rounded-lg text-sm font-medium hover:bg-slate-200 transition-colors">Export</button>
          <button onClick={onDelete} className="px-4 py-2 bg-red-50 text-red-600 rounded-lg text-sm font-medium hover:bg-red-100 transition-colors">Delete</button>
        </div>
      </div>

      {/* Case info grid */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-8">
        {[
          { l: 'Case Type', v: v.caseType.charAt(0).toUpperCase() + v.caseType.slice(1) },
          { l: 'Rate', v: `$${t.rate}/hr` },
          { l: 'Statutory Cap', v: `$${t.cap.toLocaleString()}` },
          { l: 'Judge', v: v.judge || 'N/A' },
          { l: 'Charges', v: v.charges || 'N/A' },
          { l: 'Indictment #', v: v.indictmentNumber || 'N/A' },
          { l: 'Submitted', v: v.submittedDate || '—' },
          { l: 'Paid', v: v.paidDate || '—' },
        ].map(item => (
          <div key={item.l} className="bg-white rounded-xl border border-slate-200 p-3">
            <p className="text-[10px] font-medium text-slate-400 uppercase tracking-wide">{item.l}</p>
            <p className="text-sm font-semibold text-slate-800 mt-0.5">{item.v}</p>
          </div>
        ))}
      </div>

      {/* Financial summary */}
      <div className="bg-white rounded-xl border border-slate-200 p-5 mb-6">
        <h2 className="text-sm font-bold text-slate-700 uppercase tracking-wide mb-4">Financial Summary</h2>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          <div><p className="text-xs text-slate-400">Legal Fees</p><p className="text-xl font-bold text-slate-900">${t.legalFees.toLocaleString('en-US', { minimumFractionDigits: 2 })}</p><p className="text-xs text-slate-400">{t.totalHours}h × ${t.rate}</p></div>
          <div><p className="text-xs text-slate-400">Expenses</p><p className="text-xl font-bold text-slate-900">${t.totalExpenses.toFixed(2)}</p></div>
          <div><p className="text-xs text-slate-400">Total Claim</p><p className="text-xl font-bold text-navy-800">${t.totalAmount.toFixed(2)}</p></div>
          <div><p className="text-xs text-slate-400">Cap Usage</p>
            <div className="mt-1">
              <div className="w-full bg-slate-100 rounded-full h-2.5">
                <div className={`h-2.5 rounded-full ${t.overCap ? 'bg-red-500' : t.legalFees / t.cap > 0.8 ? 'bg-amber-500' : 'bg-emerald-500'}`} style={{ width: `${Math.min(100, (t.legalFees / t.cap) * 100)}%` }}></div>
              </div>
              <p className="text-xs mt-1 text-slate-500">{Math.round((t.legalFees / t.cap) * 100)}% of ${t.cap.toLocaleString()}</p>
            </div>
          </div>
        </div>
        {t.overCap && (
          <div className="mt-4 p-3 bg-red-50 border border-red-200 rounded-lg">
            <p className="text-sm text-red-700 font-medium">⚠ Exceeds statutory cap by ${t.excessAmount.toFixed(2)} — justification required</p>
            {v.excessJustification && <p className="text-sm text-red-600 mt-1">{v.excessJustification}</p>}
          </div>
        )}
      </div>

      {/* Time Entries */}
      <div className="bg-white rounded-xl border border-slate-200 p-5 mb-6">
        <h2 className="text-sm font-bold text-slate-700 uppercase tracking-wide mb-4">Time Entries ({v.timeEntries.length})</h2>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead><tr className="text-left text-xs text-slate-400 uppercase tracking-wide border-b border-slate-100">
              <th className="pb-2 pr-4">Date</th><th className="pb-2 pr-4">Activity</th><th className="pb-2 pr-4 text-right">Hours</th><th className="pb-2 pr-4 text-right">Amount</th><th className="pb-2">Description</th>
            </tr></thead>
            <tbody>
              {v.timeEntries.map(e => (
                <tr key={e.id} className="border-b border-slate-50">
                  <td className="py-2.5 pr-4 text-slate-600 whitespace-nowrap">{e.date}</td>
                  <td className="py-2.5 pr-4 whitespace-nowrap"><span className="px-2 py-0.5 bg-slate-100 rounded text-xs font-medium">{e.activityType}</span></td>
                  <td className="py-2.5 pr-4 text-right font-medium">{e.hours}</td>
                  <td className="py-2.5 pr-4 text-right font-medium">${(e.hours * t.rate).toFixed(2)}</td>
                  <td className="py-2.5 text-slate-600">{e.description}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Expenses */}
      {v.expenses.length > 0 && (
        <div className="bg-white rounded-xl border border-slate-200 p-5">
          <h2 className="text-sm font-bold text-slate-700 uppercase tracking-wide mb-4">Expenses ({v.expenses.length})</h2>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead><tr className="text-left text-xs text-slate-400 uppercase tracking-wide border-b border-slate-100">
                <th className="pb-2 pr-4">Date</th><th className="pb-2 pr-4">Category</th><th className="pb-2 pr-4 text-right">Amount</th><th className="pb-2">Description</th>
              </tr></thead>
              <tbody>
                {v.expenses.map(e => (
                  <tr key={e.id} className="border-b border-slate-50">
                    <td className="py-2.5 pr-4 text-slate-600">{e.date}</td>
                    <td className="py-2.5 pr-4"><span className="px-2 py-0.5 bg-slate-100 rounded text-xs font-medium">{e.category}</span></td>
                    <td className="py-2.5 pr-4 text-right font-medium">${e.amount.toFixed(2)}</td>
                    <td className="py-2.5 text-slate-600">{e.description}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}

// Editor
function VoucherEditor({ voucher, onSave, onCancel }: { voucher: Voucher; onSave: (v: Voucher) => void; onCancel: () => void }) {
  const [v, setV] = useState<Voucher>({ ...voucher, timeEntries: [...voucher.timeEntries], expenses: [...voucher.expenses] });
  const t = calcVoucherTotals(v);

  const updateField = (field: keyof Voucher, value: any) => setV(prev => ({ ...prev, [field]: value }));

  const addTimeEntry = () => {
    setV(prev => ({ ...prev, timeEntries: [...prev.timeEntries, { id: generateId(), date: new Date().toISOString().split('T')[0], activityType: 'Court Appearance', hours: 0, description: '' }] }));
  };
  const updateTimeEntry = (id: string, field: keyof TimeEntry, value: any) => {
    setV(prev => ({ ...prev, timeEntries: prev.timeEntries.map(e => e.id === id ? { ...e, [field]: field === 'hours' ? parseFloat(value) || 0 : value } : e) }));
  };
  const removeTimeEntry = (id: string) => setV(prev => ({ ...prev, timeEntries: prev.timeEntries.filter(e => e.id !== id) }));

  const addExpense = () => {
    setV(prev => ({ ...prev, expenses: [...prev.expenses, { id: generateId(), date: new Date().toISOString().split('T')[0], category: 'Travel', amount: 0, description: '' }] }));
  };
  const updateExpense = (id: string, field: keyof Expense, value: any) => {
    setV(prev => ({ ...prev, expenses: prev.expenses.map(e => e.id === id ? { ...e, [field]: field === 'amount' ? parseFloat(value) || 0 : value } : e) }));
  };
  const removeExpense = (id: string) => setV(prev => ({ ...prev, expenses: prev.expenses.filter(e => e.id !== id) }));

  const inputClass = "w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-300";

  return (
    <div className="p-4 sm:p-8 max-w-5xl mx-auto">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-xl font-bold text-slate-900">{voucher.clientName ? `Edit Voucher — ${voucher.clientName}` : 'New Voucher'}</h1>
        <div className="flex gap-2">
          <button onClick={onCancel} className="px-4 py-2 text-sm font-medium text-slate-600 hover:text-slate-800">Cancel</button>
          <button onClick={() => onSave(v)} className="px-4 py-2 bg-navy-800 text-white rounded-lg text-sm font-semibold hover:bg-navy-700">Save Voucher</button>
        </div>
      </div>

      {/* Case Info */}
      <div className="bg-white rounded-xl border border-slate-200 p-5 mb-6">
        <h2 className="text-sm font-bold text-slate-700 uppercase tracking-wide mb-4">Case Information</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          <div><label className="text-xs font-medium text-slate-500 block mb-1">Client Name</label><input className={inputClass} value={v.clientName} onChange={e => updateField('clientName', e.target.value)} /></div>
          <div><label className="text-xs font-medium text-slate-500 block mb-1">Case / Docket Number</label><input className={inputClass} value={v.caseNumber} onChange={e => updateField('caseNumber', e.target.value)} /></div>
          <div><label className="text-xs font-medium text-slate-500 block mb-1">Indictment Number</label><input className={inputClass} value={v.indictmentNumber} onChange={e => updateField('indictmentNumber', e.target.value)} /></div>
          <div><label className="text-xs font-medium text-slate-500 block mb-1">Charges</label><input className={inputClass} value={v.charges} onChange={e => updateField('charges', e.target.value)} /></div>
          <div><label className="text-xs font-medium text-slate-500 block mb-1">Court</label><input className={inputClass} value={v.court} onChange={e => updateField('court', e.target.value)} /></div>
          <div><label className="text-xs font-medium text-slate-500 block mb-1">Judge</label><input className={inputClass} value={v.judge} onChange={e => updateField('judge', e.target.value)} /></div>
          <div>
            <label className="text-xs font-medium text-slate-500 block mb-1">Case Type</label>
            <select className={inputClass} value={v.caseType} onChange={e => updateField('caseType', e.target.value)}>
              <option value="felony">Felony ($158/hr · $8,000 cap)</option>
              <option value="misdemeanor">Misdemeanor ($158/hr · $8,000 cap)</option>
              <option value="family">Family Court ($158/hr · $8,000 cap)</option>
            </select>
          </div>
          <div><label className="text-xs font-medium text-slate-500 block mb-1">Attorney Name</label><input className={inputClass} value={v.attorneyName} onChange={e => updateField('attorneyName', e.target.value)} /></div>
          <div><label className="text-xs font-medium text-slate-500 block mb-1">Bar Number</label><input className={inputClass} value={v.attorneyBarNumber} onChange={e => updateField('attorneyBarNumber', e.target.value)} /></div>
        </div>
      </div>

      {/* Live totals */}
      <div className="bg-navy-800 text-white rounded-xl p-4 mb-6 flex flex-wrap gap-6">
        <div><p className="text-xs text-slate-300">Legal Fees</p><p className="text-lg font-bold">${t.legalFees.toFixed(2)}</p></div>
        <div><p className="text-xs text-slate-300">Expenses</p><p className="text-lg font-bold">${t.totalExpenses.toFixed(2)}</p></div>
        <div><p className="text-xs text-slate-300">Total</p><p className="text-lg font-bold text-gold-500">${t.totalAmount.toFixed(2)}</p></div>
        <div><p className="text-xs text-slate-300">Cap</p><p className={`text-lg font-bold ${t.overCap ? 'text-red-400' : 'text-emerald-400'}`}>{Math.round((t.legalFees / t.cap) * 100)}% used</p></div>
      </div>

      {/* Time Entries */}
      <div className="bg-white rounded-xl border border-slate-200 p-5 mb-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-sm font-bold text-slate-700 uppercase tracking-wide">Time Entries</h2>
          <button onClick={addTimeEntry} className="text-sm text-blue-600 font-medium hover:text-blue-700">+ Add Entry</button>
        </div>
        <div className="space-y-3">
          {v.timeEntries.map(entry => (
            <div key={entry.id} className="flex flex-col sm:flex-row gap-2 sm:items-end p-3 bg-slate-50 rounded-lg">
              <div className="sm:w-36"><label className="text-[10px] text-slate-400 block mb-1">Date</label><input type="date" className={inputClass} value={entry.date} onChange={e => updateTimeEntry(entry.id, 'date', e.target.value)} /></div>
              <div className="sm:w-44">
                <label className="text-[10px] text-slate-400 block mb-1">Activity</label>
                <select className={inputClass} value={entry.activityType} onChange={e => updateTimeEntry(entry.id, 'activityType', e.target.value)}>
                  {ACTIVITY_TYPES.map(a => <option key={a} value={a}>{a}</option>)}
                </select>
              </div>
              <div className="sm:w-20"><label className="text-[10px] text-slate-400 block mb-1">Hours</label><input type="number" step="0.25" min="0" className={inputClass} value={entry.hours || ''} onChange={e => updateTimeEntry(entry.id, 'hours', e.target.value)} /></div>
              <div className="flex-1"><label className="text-[10px] text-slate-400 block mb-1">Description</label><input className={inputClass} value={entry.description} onChange={e => updateTimeEntry(entry.id, 'description', e.target.value)} /></div>
              <button onClick={() => removeTimeEntry(entry.id)} className="p-2 text-red-400 hover:text-red-600 self-end"><svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg></button>
            </div>
          ))}
          {v.timeEntries.length === 0 && <p className="text-sm text-slate-400 text-center py-4">No time entries yet</p>}
        </div>
      </div>

      {/* Expenses */}
      <div className="bg-white rounded-xl border border-slate-200 p-5 mb-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-sm font-bold text-slate-700 uppercase tracking-wide">Expenses</h2>
          <button onClick={addExpense} className="text-sm text-blue-600 font-medium hover:text-blue-700">+ Add Expense</button>
        </div>
        <div className="space-y-3">
          {v.expenses.map(exp => (
            <div key={exp.id} className="flex flex-col sm:flex-row gap-2 sm:items-end p-3 bg-slate-50 rounded-lg">
              <div className="sm:w-36"><label className="text-[10px] text-slate-400 block mb-1">Date</label><input type="date" className={inputClass} value={exp.date} onChange={e => updateExpense(exp.id, 'date', e.target.value)} /></div>
              <div className="sm:w-40">
                <label className="text-[10px] text-slate-400 block mb-1">Category</label>
                <select className={inputClass} value={exp.category} onChange={e => updateExpense(exp.id, 'category', e.target.value)}>
                  {EXPENSE_CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
                </select>
              </div>
              <div className="sm:w-28"><label className="text-[10px] text-slate-400 block mb-1">Amount ($)</label><input type="number" step="0.01" min="0" className={inputClass} value={exp.amount || ''} onChange={e => updateExpense(exp.id, 'amount', e.target.value)} /></div>
              <div className="flex-1"><label className="text-[10px] text-slate-400 block mb-1">Description</label><input className={inputClass} value={exp.description} onChange={e => updateExpense(exp.id, 'description', e.target.value)} /></div>
              <button onClick={() => removeExpense(exp.id)} className="p-2 text-red-400 hover:text-red-600 self-end"><svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg></button>
            </div>
          ))}
          {v.expenses.length === 0 && <p className="text-sm text-slate-400 text-center py-4">No expenses yet</p>}
        </div>
      </div>

      {/* Excess justification */}
      {t.overCap && (
        <div className="bg-red-50 border border-red-200 rounded-xl p-5 mb-6">
          <h2 className="text-sm font-bold text-red-700 mb-2">⚠ Statutory Cap Exceeded — Justification Required</h2>
          <p className="text-xs text-red-600 mb-3">Legal fees (${t.legalFees.toFixed(2)}) exceed the ${t.cap.toLocaleString()} cap by ${t.excessAmount.toFixed(2)}. The court requires written justification for extraordinary circumstances.</p>
          <textarea className="w-full bg-white border border-red-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-red-300 min-h-[80px]" placeholder="Explain extraordinary circumstances justifying fees above the statutory cap..." value={v.excessJustification} onChange={e => updateField('excessJustification', e.target.value)} />
        </div>
      )}
    </div>
  );
}
