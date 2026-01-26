
"use client";

import { useAppContext } from '@/context/AppContext';
import { mockStats, mockTasks } from '@/lib/mockData';
import Link from 'next/link';

export default function DashboardPage() {
    const { cases } = useAppContext();

    // Filter for open cases
    const openCases = cases.filter(c => c.status === 'Open');
    const recentCases = openCases.slice(0, 5);

    return (
        <div className="p-8 max-w-[1600px] mx-auto space-y-10 animate-fade-in pb-12">

            {/* Stats Overview - Clean & Minimal */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                <div className="bg-white p-6 rounded-2xl border border-gray-200 shadow-sm hover:shadow-md transition-shadow">
                    <p className="text-gray-500 text-sm font-medium uppercase tracking-wide">Billable Hours</p>
                    <div className="mt-4 flex items-end justify-between">
                        <span className="text-5xl font-light text-gray-900">{mockStats.billableHoursThisMonth}</span>
                        <span className="text-sm font-medium text-green-600 bg-green-50 px-2 py-1 rounded-full">+4.5 this week</span>
                    </div>
                </div>
                <div className="bg-white p-6 rounded-2xl border border-gray-200 shadow-sm hover:shadow-md transition-shadow">
                    <p className="text-gray-500 text-sm font-medium uppercase tracking-wide">Pending Vouchers</p>
                    <div className="mt-4 flex items-end justify-between">
                        <span className="text-5xl font-light text-gray-900">{mockStats.pendingVouchers}</span>
                        <div className="h-2 w-2 rounded-full bg-orange-500 mb-2 animate-pulse"></div>
                    </div>
                </div>
                <div className="bg-white p-6 rounded-2xl border border-gray-200 shadow-sm hover:shadow-md transition-shadow">
                    <p className="text-gray-500 text-sm font-medium uppercase tracking-wide">PSLF Progress</p>
                    <div className="mt-4">
                        <div className="flex justify-between items-baseline">
                            <span className="text-5xl font-light text-gray-900">{mockStats.pslfProgress}%</span>
                            <span className="text-sm text-gray-400">98/120</span>
                        </div>
                        <div className="w-full bg-gray-100 rounded-full h-1.5 mt-2">
                            <div className="bg-blue-600 h-1.5 rounded-full" style={{ width: `${mockStats.pslfProgress}%` }}></div>
                        </div>
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
                {/* Main Column: Active Cases */}
                <div className="lg:col-span-2 space-y-6">
                    <div className="flex items-center justify-between">
                        <h2 className="text-xl font-normal text-gray-800">Recent Cases</h2>
                        <Link href="/dashboard/cases" className="text-sm font-medium text-blue-600 hover:bg-blue-50 px-3 py-1.5 rounded transition-colors">View All</Link>
                    </div>

                    <div className="bg-white rounded-2xl border border-gray-200 overflow-hidden shadow-sm">
                        {recentCases.length === 0 ? (
                            <div className="p-12 text-center text-gray-500">No active cases.</div>
                        ) : (
                            <table className="w-full text-left">
                                <thead className="bg-gray-50/50 border-b border-gray-100">
                                    <tr>
                                        <th className="px-8 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">Client</th>
                                        <th className="px-8 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">Details</th>
                                        <th className="px-8 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">Status</th>
                                        <th className="px-8 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider text-right">Date</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-gray-100">
                                    {recentCases.map((c) => (
                                        <tr key={c.id} className="hover:bg-gray-50/80 transition-colors group cursor-pointer">
                                            <td className="px-8 py-5">
                                                <div className="font-medium text-gray-900 group-hover:text-blue-600 transition-colors">{c.client}</div>
                                                <div className="text-xs text-gray-400 font-mono mt-0.5">{c.id}</div>
                                            </td>
                                            <td className="px-8 py-5">
                                                <div className="text-sm text-gray-600">{c.charges}</div>
                                                <div className="text-xs text-gray-400 mt-0.5">{c.county}</div>
                                            </td>
                                            <td className="px-8 py-5">
                                                <span className={`inline-flex px-2.5 py-0.5 text-xs font-medium rounded-full ${c.status === 'Open' ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-600'
                                                    }`}>
                                                    {c.status}
                                                </span>
                                            </td>
                                            <td className="px-8 py-5 text-right text-sm text-gray-500 tabular-nums">
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
                <div className="space-y-6">
                    <h2 className="text-xl font-normal text-gray-800">Priority Tasks</h2>
                    <div className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden">
                        {mockTasks.map((task) => (
                            <div key={task.id} className="p-5 border-b border-gray-100 last:border-0 hover:bg-gray-50 transition-colors flex gap-4 items-start group">
                                <div className="mt-1">
                                    <input type="checkbox" className="h-5 w-5 text-blue-600 rounded-full border-gray-300 focus:ring-offset-0 focus:ring-0 cursor-pointer" />
                                </div>
                                <div className="flex-1 min-w-0">
                                    <p className={`text-sm font-medium truncate ${task.urgent ? 'text-gray-900' : 'text-gray-600'}`}>
                                        {task.title}
                                    </p>
                                    <div className="flex items-center gap-2 mt-1.5">
                                        <span className="text-[10px] uppercase tracking-wide text-gray-400 bg-gray-50 px-1.5 py-0.5 rounded border border-gray-100">{task.caseId}</span>
                                        {task.urgent && (
                                            <span className="text-[10px] font-bold text-red-600 bg-red-50 px-1.5 py-0.5 rounded">Due Today</span>
                                        )}
                                    </div>
                                </div>
                            </div>
                        ))}
                        <div className="p-4 bg-gray-50 text-center">
                            <button className="text-sm font-medium text-blue-600 hover:text-blue-700">View All Tasks</button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
