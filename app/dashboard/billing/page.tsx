"use client";

import Link from 'next/link';

const BILLING_SUMMARY = {
    revenueYTD: '$142,500.00',
    revenueMTD: '$12,800.00',
    outstanding: '$8,450.00',
    trustBalance: '$45,000.00',
    lastUpdated: 'Today at 9:00 AM'
};

const INVOICES = [
    { id: 'INV-2026-042', client: 'Estate of M. Thompson', date: 'Feb 12, 2026', amount: '$2,450.00', status: 'Sent', due: 'Feb 26' },
    { id: 'INV-2026-041', client: 'J. Rodriguez (Custody)', date: 'Feb 10, 2026', amount: '$1,800.00', status: 'Paid', due: 'Feb 24' },
    { id: 'INV-2026-040', client: 'TechStart Inc. (Incorporation)', date: 'Feb 05, 2026', amount: '$3,200.00', status: 'Overdue', due: 'Feb 19' },
    { id: 'INV-2026-039', client: 'S. Patel (Prenup)', date: 'Jan 28, 2026', amount: '$1,500.00', status: 'Paid', due: 'Feb 11' },
];

export default function BillingPage() {
    return (
        <div className="p-4 sm:p-6 lg:p-8 max-w-[1400px] mx-auto animate-fade-in">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6 sm:mb-8">
                <div>
                    <h1 className="text-xl sm:text-2xl font-bold text-slate-900 tracking-tight">Billing &amp; Trust Accounting</h1>
                    <p className="text-slate-400 text-sm mt-1">Manage invoices, payments, and IOLTA compliance</p>
                </div>
                <div className="flex gap-2">
                     <button className="inline-flex items-center justify-center gap-2 bg-white hover:bg-slate-50 text-slate-700 border border-slate-200 px-4 py-2.5 rounded-lg text-sm font-semibold transition-all">
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path><polyline points="7 10 12 15 17 10"></polyline><line x1="12" y1="15" x2="12" y2="3"></line></svg>
                        Export Report
                    </button>
                    <button className="inline-flex items-center justify-center gap-2 bg-purple-600 hover:bg-purple-700 text-white px-4 py-2.5 rounded-lg text-sm font-semibold shadow-sm transition-all hover:shadow-md">
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><line x1="12" y1="5" x2="12" y2="19"></line><line x1="5" y1="12" x2="19" y2="12"></line></svg>
                        New Invoice
                    </button>
                </div>
            </div>

            {/* Financial Overview Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
                <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm">
                    <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-1">Revenue YTD</p>
                    <p className="text-2xl font-bold text-slate-900">{BILLING_SUMMARY.revenueYTD}</p>
                    <div className="flex items-center gap-1 mt-2 text-xs font-medium text-emerald-600">
                        <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3"><polyline points="18 15 12 9 6 15"></polyline></svg>
                        <span>+12.5% vs last year</span>
                    </div>
                </div>
                <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm">
                    <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-1">Outstanding</p>
                    <p className="text-2xl font-bold text-slate-900">{BILLING_SUMMARY.outstanding}</p>
                    <div className="flex items-center gap-1 mt-2 text-xs font-medium text-amber-600">
                        <span>3 invoices overdue</span>
                    </div>
                </div>
                <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm">
                    <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-1">Trust (IOLTA)</p>
                    <p className="text-2xl font-bold text-slate-900">{BILLING_SUMMARY.trustBalance}</p>
                    <p className="text-xs text-slate-400 mt-2">Across 4 active matters</p>
                </div>
                <div className="bg-purple-50 p-5 rounded-xl border border-purple-100 shadow-sm">
                    <p className="text-xs font-semibold text-purple-600 uppercase tracking-wider mb-1">Revenue MTD</p>
                    <p className="text-2xl font-bold text-purple-900">{BILLING_SUMMARY.revenueMTD}</p>
                    <p className="text-xs text-purple-600/80 mt-2">On track for monthly goal</p>
                </div>
            </div>

            {/* Recent Invoices Table */}
            <div className="bg-white border border-slate-200 rounded-xl overflow-hidden shadow-sm">
                <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between">
                    <h2 className="font-semibold text-slate-800">Recent Invoices</h2>
                    <Link href="/dashboard/billing" className="text-xs font-medium text-purple-600 hover:text-purple-700">View All</Link>
                </div>
                <div className="overflow-x-auto">
                    <table className="w-full text-sm text-left">
                        <thead className="bg-slate-50/50 text-slate-500 font-medium border-b border-slate-100">
                            <tr>
                                <th className="px-6 py-3">Invoice #</th>
                                <th className="px-6 py-3">Client / Matter</th>
                                <th className="px-6 py-3">Date</th>
                                <th className="px-6 py-3">Due Date</th>
                                <th className="px-6 py-3">Amount</th>
                                <th className="px-6 py-3">Status</th>
                                <th className="px-6 py-3 text-right">Action</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100">
                            {INVOICES.map((inv) => (
                                <tr key={inv.id} className="hover:bg-slate-50/50 transition-colors">
                                    <td className="px-6 py-3 font-mono text-xs text-slate-500">{inv.id}</td>
                                    <td className="px-6 py-3 font-medium text-slate-900">{inv.client}</td>
                                    <td className="px-6 py-3 text-slate-500">{inv.date}</td>
                                    <td className="px-6 py-3 text-slate-500">{inv.due}</td>
                                    <td className="px-6 py-3 font-medium text-slate-900">{inv.amount}</td>
                                    <td className="px-6 py-3">
                                        <span className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-medium
                                            ${inv.status === 'Paid' ? 'bg-emerald-50 text-emerald-700' : 
                                              inv.status === 'Overdue' ? 'bg-red-50 text-red-700' : 
                                              'bg-blue-50 text-blue-700'}`}>
                                            {inv.status}
                                        </span>
                                    </td>
                                    <td className="px-6 py-3 text-right">
                                        <button className="text-slate-400 hover:text-purple-600 transition-colors">
                                            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="1"></circle><circle cx="19" cy="12" r="1"></circle><circle cx="5" cy="12" r="1"></circle></svg>
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
            
            {/* Payment Processor Promo */}
            <div className="mt-8 bg-slate-50 border border-slate-200 rounded-xl p-6 flex flex-col md:flex-row items-center justify-between gap-6">
                <div>
                    <h3 className="font-bold text-slate-900 mb-1">Accept Credit Cards &amp; eChecks</h3>
                    <p className="text-sm text-slate-500 max-w-xl">
                        Integrate with LawPay or Stripe to accept secure payments directly into your operating or trust account. 
                        Compliance-ready with automatic fee separation.
                    </p>
                </div>
                <button className="whitespace-nowrap bg-white hover:bg-slate-50 text-slate-700 border border-slate-300 font-semibold px-5 py-2.5 rounded-lg text-sm transition-all shadow-sm">
                    Connect Payment Processor
                </button>
            </div>
        </div>
    );
}
