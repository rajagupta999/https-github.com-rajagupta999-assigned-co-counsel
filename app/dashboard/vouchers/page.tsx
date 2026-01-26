
"use client";

import { useState } from 'react';

const mockTimeEntries = [
    { id: 101, date: '2025-10-10', activity: 'Court Appearance for Arraignment', duration: 3.5, type: 'In-Court' },
    { id: 102, date: '2025-10-12', activity: 'Review of discovery materials and research', duration: 4.2, type: 'Out-of-Court' }, // Flag: Block Billing?
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
        <div className="space-y-6 animate-fade-in">
            <div className="flex items-center justify-between border-b border-gray-200 pb-4">
                <div>
                    <h1 className="text-2xl text-gray-800">Draft Voucher</h1>
                    <p className="text-sm text-gray-500">Case: <span className="font-mono text-gray-700">CASE-2025-001</span> • John Doe</p>
                </div>
                <div className="flex gap-3">
                    {!auditComplete && (
                        <button onClick={runAudit} disabled={isAuditing} className="btn btn-primary min-w-[160px]">
                            {isAuditing ? 'Analyzing...' : 'Run Compliance Audit'}
                        </button>
                    )}
                    {auditComplete && (
                        <button className="btn bg-green-600 text-white hover:bg-green-700 border-none">
                            Submit Voucher
                        </button>
                    )}
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                <div className="lg:col-span-2 space-y-6">
                    <div className="card">
                        <h2 className="text-lg font-medium text-gray-800 mb-4 px-1">Time Entries</h2>
                        <div className="space-y-0 divide-y divide-gray-100">
                            {mockTimeEntries.map((entry) => {
                                // Simulate "Block Billing" Flag logic on ID 102
                                const isFlagged = auditComplete && entry.id === 102;

                                return (
                                    <div key={entry.id} className={`p-4 ${isFlagged ? 'bg-red-50' : 'hover:bg-gray-50'} transition-colors`}>
                                        <div className="flex justify-between items-start">
                                            <div className="space-y-1">
                                                <p className="font-medium text-gray-900">{entry.activity}</p>
                                                <div className="flex gap-2 text-xs text-gray-500">
                                                    <span className="bg-gray-100 px-1.5 py-0.5 rounded">{entry.date}</span>
                                                    <span>•</span>
                                                    <span>{entry.type}</span>
                                                </div>
                                            </div>
                                            <div className="text-right">
                                                <p className="font-semibold text-gray-800">{entry.duration} hrs</p>
                                            </div>
                                        </div>

                                        {isFlagged && (
                                            <div className="mt-3 flex items-start gap-3 text-sm text-red-700 bg-white border border-red-200 p-3 rounded">
                                                <span className="text-lg">⚠️</span>
                                                <div>
                                                    <span className="font-bold block mb-1">Block Billing Risk Detected</span>
                                                    <p className="text-red-600 leading-snug">Entry exceeds 4 hours without itemization. "Review and research" is considered vague by Nassau County rules.</p>
                                                    <button className="text-blue-700 underline text-xs mt-2 font-medium">Auto-Itemize with AI</button>
                                                </div>
                                            </div>
                                        )}
                                    </div>
                                );
                            })}
                        </div>

                        <div className="mt-6 pt-6 border-t border-gray-200 flex justify-between items-center px-4">
                            <span className="text-gray-600 font-medium">Total Billable Amount</span>
                            <span className="text-2xl font-bold text-gray-900">$1,532.60</span>
                        </div>
                    </div>
                </div>

                {/* Audit Sidebar */}
                <div className="space-y-6">
                    <div className="card bg-gray-50 border-gray-200">
                        <h3 className="text-sm font-bold text-gray-500 uppercase tracking-wide mb-4">Submission Readiness</h3>

                        {!auditComplete ? (
                            <div className="text-center py-12">
                                <div className="text-4xl mb-3 text-gray-300">🛡️</div>
                                <p className="text-gray-500 text-sm px-4">Run the audit to check against county fee caps and billing rules.</p>
                            </div>
                        ) : (
                            <div className="space-y-4 animate-fade-in divide-y divide-gray-200">
                                <div className="pt-2 flex items-center justify-between text-sm">
                                    <span className="text-gray-600">Chronology</span>
                                    <span className="text-green-600 font-medium bg-green-50 px-2 rounded">Passed</span>
                                </div>
                                <div className="pt-4 flex items-center justify-between text-sm">
                                    <span className="text-gray-600">Fee Caps</span>
                                    <span className="text-green-600 font-medium bg-green-50 px-2 rounded">Passed</span>
                                </div>
                                <div className="pt-4 flex items-center justify-between text-sm">
                                    <span className="text-gray-600">Description Quality</span>
                                    <span className="text-red-600 font-bold bg-red-50 px-2 rounded">1 Issue</span>
                                </div>

                                <div className="pt-6">
                                    <p className="text-xs text-gray-500 uppercase tracking-wide">Est. Payment Date</p>
                                    <p className="font-bold text-xl text-gray-800 mt-1">Nov 28, 2025</p>
                                    <p className="text-xs text-green-600 mt-1">Based on historic county data</p>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}
