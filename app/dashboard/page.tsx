
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
        <div className="space-y-8 animate-fade-in">

            {/* Stats Overview - Clean Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="card border-none bg-blue-50">
                    <p className="text-gray-600 text-sm font-medium">Billable Hours (Monthly)</p>
                    <div className="mt-2 flex items-baseline gap-2">
                        <span className="text-4xl text-blue-700">{mockStats.billableHoursThisMonth}</span>
                        <span className="text-sm text-green-600 font-medium">+4.5 this week</span>
                    </div>
                </div>
                <div className="card border-none bg-orange-50">
                    <p className="text-gray-600 text-sm font-medium">Pending Vouchers</p>
                    <div className="mt-2 flex items-baseline gap-2">
                        <span className="text-4xl text-orange-700">{mockStats.pendingVouchers}</span>
                        <span className="text-sm text-gray-500">3 pending</span>
                    </div>
                </div>
                <div className="card border-none bg-green-50">
                    <p className="text-gray-600 text-sm font-medium">PSLF Progress</p>
                    <div className="flex justify-between items-end mt-2">
                        <span className="text-4xl text-green-700">{mockStats.pslfProgress}%</span>
                        <span className="text-sm text-green-800 font-medium">98/120 Payments</span>
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Main Column: Active Cases */}
                <div className="lg:col-span-2 space-y-6">
                    <div className="flex items-center justify-between">
                        <h2 className="text-lg font-medium text-gray-800">Active Cases ({openCases.length})</h2>
                        <Link href="/dashboard/cases" className="text-sm text-blue-600 font-medium hover:underline">View All</Link>
                    </div>

                    <div className="card p-0 overflow-hidden">
                        {recentCases.length === 0 ? (
                            <div className="p-8 text-center text-gray-500">No active cases. Click "New Case" to start.</div>
                        ) : (
                            <table className="w-full text-left border-collapse">
                                <thead className="bg-gray-50 border-b border-gray-200">
                                    <tr>
                                        <th className="px-6 py-3 text-xs font-semibold text-gray-500 uppercase">Client</th>
                                        <th className="px-6 py-3 text-xs font-semibold text-gray-500 uppercase">Details</th>
                                        <th className="px-6 py-3 text-xs font-semibold text-gray-500 uppercase">Status</th>
                                        <th className="px-6 py-3 text-xs font-semibold text-gray-500 uppercase text-right">Court Date</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-gray-100">
                                    {recentCases.map((c) => (
                                        <tr key={c.id} className="hover:bg-gray-50 transition-colors cursor-pointer">
                                            <td className="px-6 py-4">
                                                <div className="font-medium text-gray-900">{c.client}</div>
                                                <div className="text-xs text-gray-400 font-mono">{c.id}</div>
                                            </td>
                                            <td className="px-6 py-4">
                                                <div className="text-sm text-gray-600">{c.charges}</div>
                                                <div className="text-xs text-gray-400">{c.county}</div>
                                            </td>
                                            <td className="px-6 py-4">
                                                <span className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${c.status === 'Open' ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'
                                                    }`}>
                                                    {c.status}
                                                </span>
                                            </td>
                                            <td className="px-6 py-4 text-right text-sm text-gray-600">
                                                {c.nextCourtDate}
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        )}
                    </div>
                </div>

                {/* Side Column: Tasks/Deadlines */}
                <div className="space-y-6">
                    <h2 className="text-lg font-medium text-gray-800">Tasks</h2>
                    <div className="card p-0">
                        {mockTasks.map((task) => (
                            <div key={task.id} className="p-4 border-b border-gray-100 last:border-0 hover:bg-gray-50 flex gap-3 items-start">
                                <input type="checkbox" className="mt-1 h-4 w-4 text-blue-600 rounded border-gray-300 focus:ring-blue-500" />
                                <div className="flex-1">
                                    <p className={`text-sm font-medium ${task.urgent ? 'text-gray-900' : 'text-gray-700'}`}>{task.title}</p>
                                    <div className="flex justify-between items-center mt-1">
                                        <span className="text-xs text-gray-500">{task.caseId}</span>
                                        {task.urgent ? (
                                            <span className="text-xs font-bold text-red-600 bg-red-50 px-2 py-0.5 rounded">Due: {task.due}</span>
                                        ) : (
                                            <span className="text-xs text-gray-400">{task.due}</span>
                                        )}
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
}
