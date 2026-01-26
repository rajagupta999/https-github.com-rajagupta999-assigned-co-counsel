
"use client";

import Link from 'next/link';
import { useAppContext } from '@/context/AppContext';

export default function CasesPage() {
    const { cases } = useAppContext();

    return (
        <div className="space-y-6 animate-fade-in">
            <div className="flex items-center justify-between">
                <h1 className="text-2xl text-gray-800">Case Directory</h1>
                <Link href="/dashboard/cases/new" className="btn btn-primary">
                    + New Case
                </Link>
            </div>

            <div className="card p-0 shadow-sm overflow-hidden">
                <table className="w-full text-left">
                    <thead className="bg-[#f8f9fa] border-b border-gray-200 text-gray-600 text-xs font-semibold uppercase tracking-wider">
                        <tr>
                            <th className="p-4">Case ID</th>
                            <th className="p-4">Client</th>
                            <th className="p-4">Charges</th>
                            <th className="p-4">County</th>
                            <th className="p-4">Next Court Date</th>
                            <th className="p-4">Status</th>
                            <th className="p-4 text-right">Actions</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100">
                        {cases.length === 0 ? (
                            <tr><td colSpan={7} className="p-8 text-center text-gray-500">No cases found.</td></tr>
                        ) : (
                            cases.map((c) => (
                                <tr key={c.id} className="hover:bg-blue-50/50 transition-colors">
                                    <td className="p-4 text-sm text-gray-500 font-mono">{c.id}</td>
                                    <td className="p-4 font-medium text-gray-900">{c.client}</td>
                                    <td className="p-4 text-sm text-gray-700">{c.charges}</td>
                                    <td className="p-4 text-sm text-gray-700">{c.county}</td>
                                    <td className="p-4 text-sm text-gray-700">{c.nextCourtDate}</td>
                                    <td className="p-4">
                                        <span className={`inline-block px-2 py-0.5 rounded text-xs font-medium border ${c.status === 'Open' ? 'bg-green-50 text-green-700 border-green-200' : 'bg-gray-100 text-gray-600 border-gray-200'}`}>
                                            {c.status}
                                        </span>
                                    </td>
                                    <td className="p-4 text-right">
                                        <button className="text-blue-600 hover:text-blue-800 text-sm font-medium">Manage</button>
                                    </td>
                                </tr>
                            ))
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
}
