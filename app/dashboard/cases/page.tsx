"use client";

import Link from 'next/link';
import { useAppContext } from '@/context/AppContext';

export default function CasesPage() {
    const { cases } = useAppContext();

    return (
        <div className="p-4 sm:p-6 lg:p-8 max-w-[1400px] mx-auto animate-fade-in">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6 sm:mb-8">
                <div>
                    <h1 className="text-xl sm:text-2xl font-bold text-slate-900 tracking-tight">Case Directory</h1>
                    <p className="text-slate-400 text-sm mt-1">Manage your active matters and filings</p>
                </div>
                <Link href="/dashboard/cases/new" className="inline-flex items-center justify-center gap-2 bg-navy-900 hover:bg-navy-800 text-white px-4 sm:px-5 py-2.5 rounded-lg text-sm font-semibold shadow-sm transition-all hover:shadow-md w-full sm:w-auto">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" style={{ width: '16px', height: '16px' }}><line x1="12" y1="5" x2="12" y2="19"></line><line x1="5" y1="12" x2="19" y2="12"></line></svg>
                    New Case
                </Link>
            </div>

            <div className="bg-white border border-slate-200/80 rounded-xl overflow-hidden">
                {cases.length === 0 ? (
                    <div className="px-6 py-16 text-center">
                        <div className="w-12 h-12 mx-auto mb-4 rounded-full bg-slate-50 flex items-center justify-center">
                            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#94a3b8" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" style={{ width: '20px', height: '20px' }}><path d="M22 19a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5l2 3h9a2 2 0 0 1 2 2z"></path></svg>
                        </div>
                        <p className="text-slate-500 text-sm font-medium">No cases found</p>
                        <p className="text-slate-400 text-xs mt-1">Create a new one to get started.</p>
                    </div>
                ) : (
                    <>
                        {/* Mobile card view */}
                        <div className="md:hidden divide-y divide-slate-100">
                            {cases.map((c) => (
                                <div key={c.id} className="p-4 hover:bg-slate-50/80 transition-colors">
                                    <div className="flex items-start justify-between mb-2">
                                        <div>
                                            <div className="font-semibold text-sm text-slate-800">{c.client}</div>
                                            <div className="text-[11px] text-slate-400 font-mono">{c.id}</div>
                                        </div>
                                        <span className={`inline-flex items-center gap-1.5 px-2 py-1 text-[10px] font-semibold rounded-md ${c.status === 'Open' ? 'bg-emerald-50 text-emerald-700' : 'bg-slate-100 text-slate-600'}`}>
                                            <span className={`w-1.5 h-1.5 rounded-full ${c.status === 'Open' ? 'bg-emerald-500' : 'bg-slate-400'}`}></span>
                                            {c.status}
                                        </span>
                                    </div>
                                    <div className="text-sm text-slate-600 mb-2">{c.charges}</div>
                                    <div className="flex items-center justify-between">
                                        <span className="text-[11px] text-slate-400">{c.county}</span>
                                        <Link href={`/dashboard/copilot`} className="text-xs font-semibold text-navy-800 hover:text-navy-900 bg-navy-50 hover:bg-navy-100 px-3 py-1.5 rounded-lg transition-colors">
                                            Manage
                                        </Link>
                                    </div>
                                </div>
                            ))}
                        </div>
                        
                        {/* Desktop table view */}
                        <table className="hidden md:table min-w-full divide-y divide-slate-100">
                            <thead className="bg-slate-50/80">
                                <tr>
                                    <th scope="col" className="px-4 lg:px-6 py-3.5 text-left text-[11px] font-semibold text-slate-400 uppercase tracking-wider">Case ID</th>
                                    <th scope="col" className="px-4 lg:px-6 py-3.5 text-left text-[11px] font-semibold text-slate-400 uppercase tracking-wider">Client</th>
                                    <th scope="col" className="px-4 lg:px-6 py-3.5 text-left text-[11px] font-semibold text-slate-400 uppercase tracking-wider">Charges</th>
                                    <th scope="col" className="px-4 lg:px-6 py-3.5 text-left text-[11px] font-semibold text-slate-400 uppercase tracking-wider">County</th>
                                    <th scope="col" className="px-4 lg:px-6 py-3.5 text-left text-[11px] font-semibold text-slate-400 uppercase tracking-wider">Status</th>
                                    <th scope="col" className="relative px-4 lg:px-6 py-3.5"><span className="sr-only">Manage</span></th>
                                </tr>
                            </thead>
                            <tbody className="bg-white divide-y divide-slate-100">
                                {cases.map((c) => (
                                    <tr key={c.id} className="hover:bg-slate-50/80 transition-colors group">
                                        <td className="px-4 lg:px-6 py-4 whitespace-nowrap text-xs text-slate-400 font-mono">{c.id}</td>
                                        <td className="px-4 lg:px-6 py-4 whitespace-nowrap">
                                            <div className="text-sm font-semibold text-slate-800 group-hover:text-navy-800 transition-colors">{c.client}</div>
                                        </td>
                                        <td className="px-4 lg:px-6 py-4 whitespace-nowrap text-sm text-slate-500">{c.charges}</td>
                                        <td className="px-4 lg:px-6 py-4 whitespace-nowrap text-sm text-slate-500">{c.county}</td>
                                        <td className="px-4 lg:px-6 py-4 whitespace-nowrap">
                                            <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 text-[11px] font-semibold rounded-md ${c.status === 'Open' ? 'bg-emerald-50 text-emerald-700' : 'bg-slate-100 text-slate-600'
                                                }`}>
                                                <span className={`w-1.5 h-1.5 rounded-full ${c.status === 'Open' ? 'bg-emerald-500' : 'bg-slate-400'}`}></span>
                                                {c.status}
                                            </span>
                                        </td>
                                        <td className="px-4 lg:px-6 py-4 whitespace-nowrap text-right">
                                            <Link href={`/dashboard/copilot`} className="text-sm font-semibold text-navy-800 hover:text-navy-900 bg-navy-50 hover:bg-navy-100 px-4 py-1.5 rounded-lg transition-colors">
                                                Manage
                                            </Link>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </>
                )}
            </div>
        </div>
    );
}
