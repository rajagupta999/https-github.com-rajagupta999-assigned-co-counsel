
"use client";

import { useAppContext } from '@/context/AppContext';
import { mockStats, mockTasks } from '@/lib/mockData';
import Link from 'next/link';

export default function DashboardPage() {
    const { cases } = useAppContext();

    const openCases = cases.filter(c => c.status === 'Open');
    const recentCases = openCases.slice(0, 5);

    return (
        <div className="p-8 max-w-[1400px] mx-auto space-y-8 animate-fade-in pb-12">

            {/* Welcome Header */}
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-2xl font-bold text-slate-900 tracking-tight">Mission Control</h1>
                    <p className="text-slate-400 text-sm mt-1">Welcome back, Jane. Here&apos;s your practice at a glance.</p>
                </div>
                <Link href="/dashboard/cases/new" className="inline-flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-5 py-2.5 rounded-lg text-sm font-semibold shadow-sm shadow-blue-500/20 transition-all hover:shadow-md hover:shadow-blue-500/25">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" style={{ width: '16px', height: '16px' }}><line x1="12" y1="5" x2="12" y2="19"></line><line x1="5" y1="12" x2="19" y2="12"></line></svg>
                    New Case
                </Link>
            </div>

            {/* Stats Overview */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
                <div className="bg-white p-6 rounded-xl border border-slate-200/80 hover:shadow-md transition-all duration-200 group">
                    <div className="flex items-center justify-between mb-4">
                        <p className="text-slate-500 text-xs font-semibold uppercase tracking-wider">Billable Hours</p>
                        <div className="w-8 h-8 rounded-lg bg-blue-50 flex items-center justify-center group-hover:bg-blue-100 transition-colors">
                            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#3b82f6" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ width: '16px', height: '16px' }}><circle cx="12" cy="12" r="10"></circle><polyline points="12 6 12 12 16 14"></polyline></svg>
                        </div>
                    </div>
                    <div className="flex items-end justify-between">
                        <span className="text-4xl font-bold text-slate-900 tracking-tight">{mockStats.billableHoursThisMonth}</span>
                        <span className="text-xs font-semibold text-emerald-600 bg-emerald-50 px-2 py-1 rounded-md">+4.5 this week</span>
                    </div>
                </div>

                <div className="bg-white p-6 rounded-xl border border-slate-200/80 hover:shadow-md transition-all duration-200 group">
                    <div className="flex items-center justify-between mb-4">
                        <p className="text-slate-500 text-xs font-semibold uppercase tracking-wider">Pending Vouchers</p>
                        <div className="w-8 h-8 rounded-lg bg-amber-50 flex items-center justify-center group-hover:bg-amber-100 transition-colors">
                            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#f59e0b" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ width: '16px', height: '16px' }}><path d="M4 2v20l2-1 2 1 2-1 2 1 2-1 2 1 2-1 2 1V2l-2 1-2-1-2 1-2-1-2 1-2-1-2 1-2-1z"></path></svg>
                        </div>
                    </div>
                    <div className="flex items-end justify-between">
                        <span className="text-4xl font-bold text-slate-900 tracking-tight">{mockStats.pendingVouchers}</span>
                        <span className="flex items-center gap-1.5 text-xs font-semibold text-amber-600 bg-amber-50 px-2 py-1 rounded-md">
                            <span className="w-1.5 h-1.5 rounded-full bg-amber-500 animate-pulse"></span>
                            Needs attention
                        </span>
                    </div>
                </div>

                <div className="bg-white p-6 rounded-xl border border-slate-200/80 hover:shadow-md transition-all duration-200 group">
                    <div className="flex items-center justify-between mb-4">
                        <p className="text-slate-500 text-xs font-semibold uppercase tracking-wider">PSLF Progress</p>
                        <div className="w-8 h-8 rounded-lg bg-violet-50 flex items-center justify-center group-hover:bg-violet-100 transition-colors">
                            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#8b5cf6" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ width: '16px', height: '16px' }}><path d="M22 10v6M2 10l10-5 10 5-10 5z"></path><path d="M6 12v5c3 3 9 3 12 0v-5"></path></svg>
                        </div>
                    </div>
                    <div className="space-y-3">
                        <div className="flex items-end justify-between">
                            <span className="text-4xl font-bold text-slate-900 tracking-tight">{mockStats.pslfProgress}%</span>
                            <span className="text-xs text-slate-400 font-medium">98/120</span>
                        </div>
                        <div className="w-full bg-slate-100 rounded-full h-2 overflow-hidden">
                            <div className="bg-gradient-to-r from-blue-500 to-indigo-500 h-2 rounded-full transition-all duration-1000 ease-out" style={{ width: `${mockStats.pslfProgress}%` }}></div>
                        </div>
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Main Column: Active Cases */}
                <div className="lg:col-span-2 space-y-5">
                    <div className="flex items-center justify-between">
                        <h2 className="text-lg font-semibold text-slate-800">Recent Cases</h2>
                        <Link href="/dashboard/cases" className="text-sm font-semibold text-blue-600 hover:text-blue-700 hover:bg-blue-50 px-3 py-1.5 rounded-lg transition-colors">View All</Link>
                    </div>

                    <div className="bg-white rounded-xl border border-slate-200/80 overflow-hidden">
                        {recentCases.length === 0 ? (
                            <div className="p-12 text-center">
                                <div className="w-12 h-12 mx-auto mb-4 rounded-full bg-slate-50 flex items-center justify-center">
                                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#94a3b8" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" style={{ width: '20px', height: '20px' }}><path d="M22 19a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5l2 3h9a2 2 0 0 1 2 2z"></path></svg>
                                </div>
                                <p className="text-slate-500 text-sm">No active cases. Create one to get started.</p>
                            </div>
                        ) : (
                            <table className="w-full text-left">
                                <thead className="bg-slate-50/80 border-b border-slate-100">
                                    <tr>
                                        <th className="px-6 py-3 text-[11px] font-semibold text-slate-400 uppercase tracking-wider">Client</th>
                                        <th className="px-6 py-3 text-[11px] font-semibold text-slate-400 uppercase tracking-wider">Details</th>
                                        <th className="px-6 py-3 text-[11px] font-semibold text-slate-400 uppercase tracking-wider">Status</th>
                                        <th className="px-6 py-3 text-[11px] font-semibold text-slate-400 uppercase tracking-wider text-right">Date</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-slate-100">
                                    {recentCases.map((c) => (
                                        <tr key={c.id} className="hover:bg-slate-50/80 transition-colors group cursor-pointer">
                                            <td className="px-6 py-4">
                                                <div className="font-semibold text-sm text-slate-800 group-hover:text-blue-600 transition-colors">{c.client}</div>
                                                <div className="text-[11px] text-slate-400 font-mono mt-0.5">{c.id}</div>
                                            </td>
                                            <td className="px-6 py-4">
                                                <div className="text-sm text-slate-600">{c.charges}</div>
                                                <div className="text-[11px] text-slate-400 mt-0.5">{c.county}</div>
                                            </td>
                                            <td className="px-6 py-4">
                                                <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 text-[11px] font-semibold rounded-md ${c.status === 'Open' ? 'bg-emerald-50 text-emerald-700' : 'bg-slate-100 text-slate-600'
                                                    }`}>
                                                    <span className={`w-1.5 h-1.5 rounded-full ${c.status === 'Open' ? 'bg-emerald-500' : 'bg-slate-400'}`}></span>
                                                    {c.status}
                                                </span>
                                            </td>
                                            <td className="px-6 py-4 text-right text-sm text-slate-500 tabular-nums">
                                                {c.nextCourtDate}
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        )}
                    </div>
                </div>

                {/* Side Column: Tasks */}
                <div className="space-y-5">
                    <h2 className="text-lg font-semibold text-slate-800">Priority Tasks</h2>
                    <div className="bg-white rounded-xl border border-slate-200/80 overflow-hidden">
                        {mockTasks.map((task) => (
                            <div key={task.id} className="p-4 border-b border-slate-100 last:border-0 hover:bg-slate-50/80 transition-colors flex gap-3 items-start group">
                                <div className="mt-0.5">
                                    <input type="checkbox" className="h-4 w-4 text-blue-600 rounded border-slate-300 focus:ring-blue-500/30 cursor-pointer" />
                                </div>
                                <div className="flex-1 min-w-0">
                                    <p className={`text-sm font-medium truncate ${task.urgent ? 'text-slate-900' : 'text-slate-600'}`}>
                                        {task.title}
                                    </p>
                                    <div className="flex items-center gap-2 mt-1.5">
                                        <span className="text-[10px] text-slate-400 bg-slate-50 px-1.5 py-0.5 rounded font-mono border border-slate-100">{task.caseId}</span>
                                        {task.urgent && (
                                            <span className="text-[10px] font-bold text-red-600 bg-red-50 px-1.5 py-0.5 rounded-md border border-red-100">Due Today</span>
                                        )}
                                    </div>
                                </div>
                            </div>
                        ))}
                        <div className="p-3 bg-slate-50/50 text-center border-t border-slate-100">
                            <button className="text-sm font-semibold text-blue-600 hover:text-blue-700 transition-colors">View All Tasks</button>
                        </div>
                    </div>

                    {/* Quick Actions */}
                    <div className="bg-gradient-to-br from-slate-800 to-slate-900 rounded-xl p-5 text-white">
                        <h3 className="font-semibold text-sm mb-2">Quick Actions</h3>
                        <p className="text-slate-400 text-xs mb-4">Jump to common workflows</p>
                        <div className="space-y-2">
                            <Link href="/dashboard/copilot" className="flex items-center gap-3 bg-white/10 hover:bg-white/15 px-3 py-2.5 rounded-lg transition-colors text-sm">
                                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" style={{ width: '16px', height: '16px' }}><path d="M12 2a2 2 0 0 1 2 2v2a2 2 0 0 1-2 2v0a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2z"></path><rect x="5" y="9" width="14" height="14" rx="2"></rect></svg>
                                Draft with Co-Pilot
                            </Link>
                            <Link href="/dashboard/vouchers" className="flex items-center gap-3 bg-white/10 hover:bg-white/15 px-3 py-2.5 rounded-lg transition-colors text-sm">
                                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" style={{ width: '16px', height: '16px' }}><path d="M4 2v20l2-1 2 1 2-1 2 1 2-1 2 1 2-1 2 1V2l-2 1-2-1-2 1-2-1-2 1-2-1-2 1-2-1z"></path></svg>
                                Submit Voucher
                            </Link>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
