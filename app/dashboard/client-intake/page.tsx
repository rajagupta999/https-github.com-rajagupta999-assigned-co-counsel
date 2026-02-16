"use client";

import Link from 'next/link';

const LEADS = [
    { id: 'L-101', name: 'Robert Chen', source: 'Website', date: 'Feb 15', status: 'New', type: 'Estate Planning', notes: 'Wants to update will and create trust' },
    { id: 'L-102', name: 'Sarah Miller', source: 'Referral', date: 'Feb 14', status: 'Consultation', type: 'Divorce', notes: 'Scheduled for Tue 2pm' },
    { id: 'L-103', name: 'TechFlow LLC', source: 'LinkedIn', date: 'Feb 12', status: 'Engaged', type: 'Corporate', notes: 'Drafting engagement letter' },
];

export default function ClientIntakePage() {
    return (
        <div className="p-4 sm:p-6 lg:p-8 max-w-[1400px] mx-auto animate-fade-in">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6 sm:mb-8">
                <div>
                    <h1 className="text-xl sm:text-2xl font-bold text-slate-900 tracking-tight">Client Intake Pipeline</h1>
                    <p className="text-slate-400 text-sm mt-1">Manage new leads, conflicts checks, and engagement letters</p>
                </div>
                <button className="inline-flex items-center justify-center gap-2 bg-purple-600 hover:bg-purple-700 text-white px-4 py-2.5 rounded-lg text-sm font-semibold shadow-sm transition-all hover:shadow-md">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><line x1="12" y1="5" x2="12" y2="19"></line><line x1="5" y1="12" x2="19" y2="12"></line></svg>
                    Add Lead
                </button>
            </div>

            {/* Pipeline Stages */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
                {[
                    { label: 'New Leads', count: 5, color: 'bg-blue-50 text-blue-700 border-blue-100' },
                    { label: 'Consultation', count: 2, color: 'bg-amber-50 text-amber-700 border-amber-100' },
                    { label: 'Proposal Sent', count: 1, color: 'bg-purple-50 text-purple-700 border-purple-100' },
                    { label: 'Engaged (This Month)', count: 3, color: 'bg-emerald-50 text-emerald-700 border-emerald-100' }
                ].map((stage) => (
                    <div key={stage.label} className={`p-4 rounded-xl border ${stage.color} flex items-center justify-between shadow-sm`}>
                        <span className="font-semibold text-sm">{stage.label}</span>
                        <span className="text-2xl font-bold">{stage.count}</span>
                    </div>
                ))}
            </div>

            {/* Leads Table */}
            <div className="bg-white border border-slate-200 rounded-xl overflow-hidden shadow-sm mb-8">
                <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between">
                    <h2 className="font-semibold text-slate-800">Recent Inquiries</h2>
                    <div className="flex gap-2">
                        <input 
                            type="text" 
                            placeholder="Search leads..." 
                            className="text-xs border border-slate-200 rounded-lg px-3 py-1.5 focus:outline-none focus:border-purple-400 focus:ring-1 focus:ring-purple-400/50"
                        />
                    </div>
                </div>
                <table className="w-full text-sm text-left">
                    <thead className="bg-slate-50/50 text-slate-500 font-medium border-b border-slate-100">
                        <tr>
                            <th className="px-6 py-3">Name</th>
                            <th className="px-6 py-3">Type</th>
                            <th className="px-6 py-3">Source</th>
                            <th className="px-6 py-3">Date</th>
                            <th className="px-6 py-3">Status</th>
                            <th className="px-6 py-3">Next Step</th>
                            <th className="px-6 py-3 text-right">Action</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                        {LEADS.map((lead) => (
                            <tr key={lead.id} className="hover:bg-slate-50/50 transition-colors cursor-pointer group">
                                <td className="px-6 py-3 font-medium text-slate-900 group-hover:text-purple-700">{lead.name}</td>
                                <td className="px-6 py-3 text-slate-500">{lead.type}</td>
                                <td className="px-6 py-3 text-slate-500">{lead.source}</td>
                                <td className="px-6 py-3 text-slate-500">{lead.date}</td>
                                <td className="px-6 py-3">
                                    <span className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-medium
                                        ${lead.status === 'New' ? 'bg-blue-50 text-blue-700' : 
                                          lead.status === 'Consultation' ? 'bg-amber-50 text-amber-700' : 
                                          'bg-emerald-50 text-emerald-700'}`}>
                                        {lead.status}
                                    </span>
                                </td>
                                <td className="px-6 py-3 text-xs text-slate-400 italic truncate max-w-[150px]">{lead.notes}</td>
                                <td className="px-6 py-3 text-right">
                                    <button className="text-purple-600 hover:text-purple-800 text-xs font-semibold bg-purple-50 hover:bg-purple-100 px-3 py-1.5 rounded-lg transition-colors">
                                        View
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            {/* Quick Actions */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm hover:shadow-md transition-shadow cursor-pointer group">
                    <div className="flex items-start gap-4">
                        <div className="p-3 bg-indigo-50 text-indigo-600 rounded-lg group-hover:bg-indigo-100 transition-colors">
                            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path><polyline points="14 2 14 8 20 8"></polyline><line x1="16" y1="13" x2="8" y2="13"></line><line x1="16" y1="17" x2="8" y2="17"></line><polyline points="10 9 9 9 8 9"></polyline></svg>
                        </div>
                        <div>
                            <h3 className="font-bold text-slate-900 mb-1 group-hover:text-indigo-700 transition-colors">Engagement Letter Generator</h3>
                            <p className="text-sm text-slate-500">Create a standard fee agreement or engagement letter from template. Includes conflicts check.</p>
                        </div>
                    </div>
                </div>

                <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm hover:shadow-md transition-shadow cursor-pointer group">
                    <div className="flex items-start gap-4">
                        <div className="p-3 bg-emerald-50 text-emerald-600 rounded-lg group-hover:bg-emerald-100 transition-colors">
                            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M16 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path><circle cx="8.5" cy="7" r="4"></circle><polyline points="17 11 19 13 23 9"></polyline></svg>
                        </div>
                        <div>
                            <h3 className="font-bold text-slate-900 mb-1 group-hover:text-emerald-700 transition-colors">Conflicts Check</h3>
                            <p className="text-sm text-slate-500">Run a quick search across all active matters, closed files, and adverse parties to ensure no ethical conflicts.</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
