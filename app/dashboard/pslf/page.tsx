"use client";

export default function PSLFPage() {
    const totalPayments = 120;
    const currentPayments = 98;
    const progressPercentage = (currentPayments / totalPayments) * 100;

    return (
        <div className="p-4 sm:p-6 lg:p-8 max-w-4xl mx-auto animate-fade-in space-y-6 sm:space-y-8">

            {/* Header */}
            <div className="flex items-start sm:items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-violet-500 to-purple-600 flex items-center justify-center shadow-sm shadow-violet-500/20 flex-shrink-0">
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" style={{ width: '20px', height: '20px' }}>
                        <path d="M22 10v6M2 10l10-5 10 5-10 5z"></path><path d="M6 12v5c3 3 9 3 12 0v-5"></path>
                    </svg>
                </div>
                <div>
                    <h1 className="text-xl sm:text-2xl font-bold text-slate-900 tracking-tight">Public Service Loan Forgiveness</h1>
                    <p className="text-slate-400 text-sm">Track your progress towards loan forgiveness.</p>
                </div>
            </div>

            {/* Main Progress Card */}
            <div className="bg-white rounded-xl border border-slate-200/80 p-4 sm:p-6 lg:p-8 relative overflow-hidden">
                <div className="absolute -top-4 -right-4 w-32 h-32 bg-gradient-to-br from-violet-100/40 to-purple-100/40 rounded-full blur-2xl"></div>

                <div className="relative">
                    <p className="text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-4 sm:mb-5">Forgiveness Progress</p>

                    <div className="flex items-end gap-2 sm:gap-3 mb-4 sm:mb-5">
                        <span className="text-4xl sm:text-5xl lg:text-6xl font-bold text-slate-900 tracking-tighter leading-none">{currentPayments}</span>
                        <span className="text-lg sm:text-xl text-slate-400 mb-1 font-medium">/ {totalPayments} payments</span>
                    </div>

                    <div className="w-full bg-slate-100 rounded-full h-2 sm:h-3 mb-6 sm:mb-8 overflow-hidden">
                        <div
                            className="bg-gradient-to-r from-navy-800 to-gold-500 h-2 sm:h-3 rounded-full transition-all duration-1000 ease-out"
                            style={{ width: `${progressPercentage}%` }}
                        ></div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-6">
                        {[
                            { label: 'Estimated Forgiveness', value: 'October 2026', accent: false },
                            { label: 'Qualifying Loans', value: '8 Accounts', accent: false },
                            { label: 'Next Certification', value: 'Due in 45 days', accent: true },
                        ].map((item, i) => (
                            <div key={i} className="bg-slate-50 rounded-lg p-3 sm:p-4 border border-slate-100">
                                <p className="text-[10px] sm:text-[11px] text-slate-400 mb-1 font-semibold uppercase tracking-wider">{item.label}</p>
                                <p className={`text-base sm:text-lg font-bold tracking-tight ${item.accent ? 'text-navy-800' : 'text-slate-800'}`}>{item.value}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            {/* Employment Certification History */}
            <div className="space-y-4">
                <h2 className="text-base sm:text-lg font-semibold text-slate-800">Employment Certification History</h2>
                <div className="bg-white border border-slate-200/80 rounded-xl overflow-hidden">
                    {/* Mobile card view */}
                    <div className="sm:hidden divide-y divide-slate-100">
                        {[
                            { period: 'Jan 2024 - Dec 2024', employer: 'NYC Assigned Counsel Plan' },
                            { period: 'Jan 2023 - Dec 2023', employer: 'NYC Assigned Counsel Plan' },
                        ].map((row, i) => (
                            <div key={i} className="p-4">
                                <div className="flex items-start justify-between mb-2">
                                    <div>
                                        <div className="font-semibold text-sm text-slate-800">{row.employer}</div>
                                        <div className="text-xs text-slate-400 mt-0.5">{row.period}</div>
                                    </div>
                                    <span className="inline-flex items-center gap-1.5 px-2 py-1 text-[10px] font-semibold rounded-md bg-emerald-50 text-emerald-700">
                                        <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
                                        Certified
                                    </span>
                                </div>
                                <button className="text-navy-800 text-xs font-semibold hover:text-navy-900 mt-2">View PDF →</button>
                            </div>
                        ))}
                    </div>
                    
                    {/* Desktop table */}
                    <table className="hidden sm:table w-full text-left">
                        <thead className="bg-slate-50/80 border-b border-slate-100">
                            <tr>
                                <th className="px-4 lg:px-6 py-3.5 text-[11px] font-semibold text-slate-400 uppercase tracking-wider">Period</th>
                                <th className="px-4 lg:px-6 py-3.5 text-[11px] font-semibold text-slate-400 uppercase tracking-wider">Employer</th>
                                <th className="px-4 lg:px-6 py-3.5 text-[11px] font-semibold text-slate-400 uppercase tracking-wider">Status</th>
                                <th className="px-4 lg:px-6 py-3.5 text-[11px] font-semibold text-slate-400 uppercase tracking-wider text-right">Form</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100">
                            {[
                                { period: 'Jan 2024 - Dec 2024', employer: 'NYC Assigned Counsel Plan' },
                                { period: 'Jan 2023 - Dec 2023', employer: 'NYC Assigned Counsel Plan' },
                            ].map((row, i) => (
                                <tr key={i} className="hover:bg-slate-50/80 transition-colors">
                                    <td className="px-4 lg:px-6 py-4 text-sm text-slate-600">{row.period}</td>
                                    <td className="px-4 lg:px-6 py-4 text-sm font-semibold text-slate-800">{row.employer}</td>
                                    <td className="px-4 lg:px-6 py-4">
                                        <span className="inline-flex items-center gap-1.5 px-2.5 py-1 text-[11px] font-semibold rounded-md bg-emerald-50 text-emerald-700">
                                            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
                                            Certified
                                        </span>
                                    </td>
                                    <td className="px-4 lg:px-6 py-4 text-right">
                                        <button className="text-navy-800 text-sm font-semibold hover:text-navy-900 hover:bg-navy-50 px-3 py-1 rounded-lg transition-colors">View PDF</button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Alert */}
            <div className="bg-navy-50 border border-navy-100 rounded-xl p-4 sm:p-5 flex gap-3 sm:gap-4 items-start">
                <div className="w-8 h-8 rounded-lg bg-navy-100 flex items-center justify-center flex-shrink-0 mt-0.5">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#1e3a5f" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ width: '16px', height: '16px' }}><circle cx="12" cy="12" r="10"></circle><line x1="12" y1="16" x2="12" y2="12"></line><line x1="12" y1="8" x2="12.01" y2="8"></line></svg>
                </div>
                <div>
                    <h3 className="font-semibold text-sm text-navy-900">Certify Your Employment</h3>
                    <p className="text-sm text-navy-700 mt-1 leading-relaxed">
                        You haven&apos;t certified your employment for 2025 yet.
                        Use the <a href="https://studentaid.gov/pslf/" target="_blank" rel="noopener noreferrer" className="underline font-semibold hover:text-navy-900">PSLF Help Tool</a> to generate your form.
                    </p>
                </div>
            </div>
        </div>
    );
}
