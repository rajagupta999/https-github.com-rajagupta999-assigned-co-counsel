"use client";

import { mockStats } from '@/lib/mockData';

export default function PSLFPage() {
    const totalPayments = 120;
    const currentPayments = 98;
    const remainingPayments = totalPayments - currentPayments;
    const progressPercentage = (currentPayments / totalPayments) * 100;

    return (
        <div className="p-8 max-w-4xl mx-auto animate-fade-in space-y-8">

            {/* Header */}
            <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-violet-500 to-purple-600 flex items-center justify-center shadow-sm shadow-violet-500/20">
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" style={{ width: '20px', height: '20px' }}>
                        <path d="M22 10v6M2 10l10-5 10 5-10 5z"></path><path d="M6 12v5c3 3 9 3 12 0v-5"></path>
                    </svg>
                </div>
                <div>
                    <h1 className="text-2xl font-bold text-slate-900 tracking-tight">Public Service Loan Forgiveness</h1>
                    <p className="text-slate-400 text-sm">Track your progress towards loan forgiveness under the PSLF program.</p>
                </div>
            </div>

            {/* Main Progress Card */}
            <div className="bg-white rounded-xl border border-slate-200/80 p-8 relative overflow-hidden">
                <div className="absolute -top-4 -right-4 w-32 h-32 bg-gradient-to-br from-violet-100/40 to-purple-100/40 rounded-full blur-2xl"></div>

                <div className="relative">
                    <p className="text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-5">Forgiveness Progress</p>

                    <div className="flex items-end gap-3 mb-5">
                        <span className="text-6xl font-bold text-slate-900 tracking-tighter leading-none">{currentPayments}</span>
                        <span className="text-xl text-slate-400 mb-1 font-medium">/ {totalPayments} payments</span>
                    </div>

                    <div className="w-full bg-slate-100 rounded-full h-3 mb-8 overflow-hidden">
                        <div
                            className="bg-gradient-to-r from-violet-500 to-purple-500 h-3 rounded-full transition-all duration-1000 ease-out"
                            style={{ width: `${progressPercentage}%` }}
                        ></div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        {[
                            { label: 'Estimated Forgiveness', value: 'October 2026', accent: false },
                            { label: 'Qualifying Loans', value: '8 Accounts', accent: false },
                            { label: 'Next Certification', value: 'Due in 45 days', accent: true },
                        ].map((item, i) => (
                            <div key={i} className="bg-slate-50 rounded-lg p-4 border border-slate-100">
                                <p className="text-[11px] text-slate-400 mb-1 font-semibold uppercase tracking-wider">{item.label}</p>
                                <p className={`text-lg font-bold tracking-tight ${item.accent ? 'text-blue-600' : 'text-slate-800'}`}>{item.value}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            {/* Employment Certification History */}
            <div className="space-y-4">
                <h2 className="text-lg font-semibold text-slate-800">Employment Certification History</h2>
                <div className="bg-white border border-slate-200/80 rounded-xl overflow-hidden">
                    <table className="w-full text-left">
                        <thead className="bg-slate-50/80 border-b border-slate-100">
                            <tr>
                                <th className="px-6 py-3.5 text-[11px] font-semibold text-slate-400 uppercase tracking-wider">Period</th>
                                <th className="px-6 py-3.5 text-[11px] font-semibold text-slate-400 uppercase tracking-wider">Employer</th>
                                <th className="px-6 py-3.5 text-[11px] font-semibold text-slate-400 uppercase tracking-wider">Status</th>
                                <th className="px-6 py-3.5 text-[11px] font-semibold text-slate-400 uppercase tracking-wider text-right">Form</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100">
                            {[
                                { period: 'Jan 2024 - Dec 2024', employer: 'NYC Assigned Counsel Plan' },
                                { period: 'Jan 2023 - Dec 2023', employer: 'NYC Assigned Counsel Plan' },
                            ].map((row, i) => (
                                <tr key={i} className="hover:bg-slate-50/80 transition-colors">
                                    <td className="px-6 py-4 text-sm text-slate-600">{row.period}</td>
                                    <td className="px-6 py-4 text-sm font-semibold text-slate-800">{row.employer}</td>
                                    <td className="px-6 py-4">
                                        <span className="inline-flex items-center gap-1.5 px-2.5 py-1 text-[11px] font-semibold rounded-md bg-emerald-50 text-emerald-700">
                                            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
                                            Certified
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 text-right">
                                        <button className="text-blue-600 text-sm font-semibold hover:text-blue-700 hover:bg-blue-50 px-3 py-1 rounded-lg transition-colors">View PDF</button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Alert */}
            <div className="bg-blue-50 border border-blue-100 rounded-xl p-5 flex gap-4 items-start">
                <div className="w-8 h-8 rounded-lg bg-blue-100 flex items-center justify-center flex-shrink-0 mt-0.5">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#3b82f6" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ width: '16px', height: '16px' }}><circle cx="12" cy="12" r="10"></circle><line x1="12" y1="16" x2="12" y2="12"></line><line x1="12" y1="8" x2="12.01" y2="8"></line></svg>
                </div>
                <div>
                    <h3 className="font-semibold text-sm text-blue-900">Certify Your Employment</h3>
                    <p className="text-sm text-blue-700 mt-1 leading-relaxed">
                        You haven&apos;t certified your employment for 2025 yet.
                        Use the <a href="#" className="underline font-semibold hover:text-blue-800">PSLF Help Tool</a> to generate your form.
                    </p>
                </div>
            </div>
        </div>
    );
}
