"use client";

import { useState } from 'react';

const mockTimeEntries = [
    { id: 101, date: '2025-10-10', activity: 'Court Appearance for Arraignment', duration: 3.5, type: 'In-Court' },
    { id: 102, date: '2025-10-12', activity: 'Review of discovery materials and research', duration: 4.2, type: 'Out-of-Court' },
    { id: 103, date: '2025-10-15', activity: 'Drafting Motion to Suppress', duration: 2.0, type: 'Out-of-Court' },
];

export default function VouchersPage() {
    const [isAuditing, setIsAuditing] = useState(false);
    const [auditComplete, setAuditComplete] = useState(false);

    const runAudit = () => {
        setIsAuditing(true);
        setTimeout(() => {
            setIsAuditing(false);
            setAuditComplete(true);
        }, 2000);
    };

    return (
        <div className="p-4 sm:p-6 lg:p-8 max-w-[1400px] mx-auto animate-fade-in space-y-5 sm:space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                    <h1 className="text-xl sm:text-2xl font-bold text-slate-900 tracking-tight">Draft Voucher</h1>
                    <p className="text-sm text-slate-400 mt-1">Case: <span className="font-mono text-slate-600 bg-slate-50 px-1.5 py-0.5 rounded text-xs border border-slate-100">CASE-2025-001</span> &middot; John Doe</p>
                </div>
                <div className="flex gap-2 sm:gap-3">
                    {!auditComplete && (
                        <button onClick={runAudit} disabled={isAuditing} className="flex-1 sm:flex-none inline-flex items-center justify-center gap-2 bg-navy-900 hover:bg-navy-800 text-white px-4 sm:px-5 py-2.5 rounded-lg text-sm font-semibold shadow-sm transition-all disabled:opacity-60">
                            {isAuditing ? (
                                <>
                                    <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                                    <span className="hidden sm:inline">Analyzing...</span>
                                    <span className="sm:hidden">...</span>
                                </>
                            ) : (
                                <>
                                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ width: '16px', height: '16px' }}><path d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"></path></svg>
                                    <span className="hidden sm:inline">Run Compliance Audit</span>
                                    <span className="sm:hidden">Audit</span>
                                </>
                            )}
                        </button>
                    )}
                    {auditComplete && (
                        <button className="flex-1 sm:flex-none inline-flex items-center justify-center gap-2 bg-emerald-600 hover:bg-emerald-700 text-white px-4 sm:px-5 py-2.5 rounded-lg text-sm font-semibold shadow-sm transition-all">
                            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" style={{ width: '16px', height: '16px' }}><polyline points="20 6 9 17 4 12"></polyline></svg>
                            Submit Voucher
                        </button>
                    )}
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-5 sm:gap-6">
                <div className="lg:col-span-2 space-y-5">
                    <div className="bg-white rounded-xl border border-slate-200/80 overflow-hidden">
                        <div className="px-4 sm:px-6 py-4 border-b border-slate-100 flex items-center justify-between">
                            <h2 className="text-sm font-semibold text-slate-700">Time Entries</h2>
                            <span className="text-[11px] text-slate-400 font-medium">{mockTimeEntries.length} entries</span>
                        </div>
                        <div className="divide-y divide-slate-100">
                            {mockTimeEntries.map((entry) => {
                                const isFlagged = auditComplete && entry.id === 102;
                                return (
                                    <div key={entry.id} className={`px-4 sm:px-6 py-4 ${isFlagged ? 'bg-red-50/50' : 'hover:bg-slate-50/80'} transition-colors`}>
                                        <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start gap-2 sm:gap-4">
                                            <div className="space-y-1.5 flex-1">
                                                <p className="font-medium text-sm text-slate-800">{entry.activity}</p>
                                                <div className="flex flex-wrap gap-2 text-[11px]">
                                                    <span className="text-slate-400 bg-slate-50 px-2 py-0.5 rounded-md border border-slate-100 font-medium">{entry.date}</span>
                                                    <span className={`px-2 py-0.5 rounded-md font-medium ${entry.type === 'In-Court' ? 'text-navy-800 bg-navy-50 border border-navy-100' : 'text-slate-500 bg-slate-50 border border-slate-100'}`}>{entry.type}</span>
                                                </div>
                                            </div>
                                            <div className="text-left sm:text-right">
                                                <p className="font-bold text-sm text-slate-800 tabular-nums">{entry.duration} hrs</p>
                                            </div>
                                        </div>

                                        {isFlagged && (
                                            <div className="mt-3 flex items-start gap-3 text-sm text-red-700 bg-white border border-red-200 p-3 sm:p-4 rounded-lg">
                                                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#dc2626" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ width: '18px', height: '18px', flexShrink: 0, marginTop: '2px' }}><path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"></path><line x1="12" y1="9" x2="12" y2="13"></line><line x1="12" y1="17" x2="12.01" y2="17"></line></svg>
                                                <div>
                                                    <span className="font-bold text-sm block mb-1">Block Billing Risk Detected</span>
                                                    <p className="text-red-600 text-xs leading-relaxed">&quot;Review and research&quot; exceeds 4 hours without itemization. Considered vague by Nassau County rules.</p>
                                                    <button className="text-navy-800 hover:text-navy-900 text-xs mt-2 font-bold">Auto-Itemize with AI</button>
                                                </div>
                                            </div>
                                        )}
                                    </div>
                                );
                            })}
                        </div>

                        <div className="px-4 sm:px-6 py-4 border-t border-slate-200 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2 bg-slate-50/50">
                            <span className="text-sm text-slate-500 font-medium">Total Billable Amount</span>
                            <span className="text-xl sm:text-2xl font-bold text-slate-900 tracking-tight">$1,532.60</span>
                        </div>
                    </div>
                </div>

                {/* Audit Sidebar */}
                <div className="space-y-5">
                    <div className="bg-white rounded-xl border border-slate-200/80 p-4 sm:p-6">
                        <h3 className="text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-4 sm:mb-5">Submission Readiness</h3>

                        {!auditComplete ? (
                            <div className="text-center py-6 sm:py-10">
                                <div className="w-12 sm:w-14 h-12 sm:h-14 rounded-2xl bg-slate-50 flex items-center justify-center mx-auto mb-4">
                                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#cbd5e1" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" style={{ width: '24px', height: '24px' }}><path d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"></path></svg>
                                </div>
                                <p className="text-slate-500 text-sm font-medium">Run the audit to check compliance</p>
                                <p className="text-slate-400 text-xs mt-1">Validates county fee caps and billing rules</p>
                            </div>
                        ) : (
                            <div className="space-y-0 animate-fade-in">
                                {[
                                    { label: 'Chronology', status: 'Passed', ok: true },
                                    { label: 'Fee Caps', status: 'Passed', ok: true },
                                    { label: 'Description Quality', status: '1 Issue', ok: false },
                                ].map((item, i) => (
                                    <div key={i} className="flex items-center justify-between py-3 sm:py-3.5 border-b border-slate-100 last:border-0">
                                        <span className="text-sm text-slate-600 font-medium">{item.label}</span>
                                        <span className={`text-[11px] font-bold px-2.5 py-1 rounded-md ${item.ok ? 'text-emerald-700 bg-emerald-50' : 'text-red-700 bg-red-50'}`}>
                                            {item.status}
                                        </span>
                                    </div>
                                ))}

                                <div className="pt-4 sm:pt-5 mt-2">
                                    <p className="text-[11px] text-slate-400 uppercase tracking-wider font-bold">Est. Payment Date</p>
                                    <p className="font-bold text-lg sm:text-xl text-slate-900 mt-1.5 tracking-tight">Nov 28, 2025</p>
                                    <p className="text-xs text-emerald-600 mt-1 font-medium">Based on historic county data</p>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}
