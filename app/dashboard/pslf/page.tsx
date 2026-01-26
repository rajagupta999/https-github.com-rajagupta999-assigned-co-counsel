"use client";

import { mockStats } from '@/lib/mockData';

export default function PSLFPage() {
    const totalPayments = 120;
    const currentPayments = 98; // From mock data conceptually, hardcoded for visual
    const remainingPayments = totalPayments - currentPayments;
    const progressPercentage = (currentPayments / totalPayments) * 100;

    return (
        <div className="p-8 max-w-4xl mx-auto animate-fade-in space-y-12">

            {/* Header */}
            <div>
                <h1 className="text-3xl font-light text-gray-900">Public Service Loan Forgiveness</h1>
                <p className="text-gray-500 mt-2">Track your progress towards loan forgiveness under the PSLF program.</p>
            </div>

            {/* Main Progress Card */}
            <div className="bg-white rounded-3xl border border-gray-200 p-10 shadow-sm relative overflow-hidden">
                <div className="absolute top-0 right-0 p-8 opacity-10">
                    <svg className="w-32 h-32 text-blue-600" style={{ width: '128px', height: '128px', opacity: 0.1 }} width="128" height="128" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2L1 21h22L12 2zm0 3.99L19.53 19H4.47L12 5.99zM13 16h-2v2h2v-2zm0-6h-2v4h2v-4z" /></svg>
                </div>

                <h2 className="text-lg font-medium text-gray-600 uppercase tracking-wide mb-6">Forgiveness Progress</h2>

                <div className="flex items-end gap-4 mb-4">
                    <span className="text-7xl font-light text-gray-900">{currentPayments}</span>
                    <span className="text-2xl text-gray-400 mb-2">/ {totalPayments} payments</span>
                </div>

                <div className="w-full bg-gray-100 rounded-full h-4 mb-8 overflow-hidden">
                    <div
                        className="bg-gradient-to-r from-blue-500 to-green-400 h-4 rounded-full transition-all duration-1000 ease-out"
                        style={{ width: `${progressPercentage}%` }}
                    ></div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    <div>
                        <p className="text-sm text-gray-500 mb-1">Estimated Forgiveness</p>
                        <p className="text-xl font-medium text-gray-800">October 2026</p>
                    </div>
                    <div>
                        <p className="text-sm text-gray-500 mb-1">Qualifying Loans</p>
                        <p className="text-xl font-medium text-gray-800">8 Accounts</p>
                    </div>
                    <div>
                        <p className="text-sm text-gray-500 mb-1">Next Certification</p>
                        <p className="text-xl font-medium text-blue-600">Due in 45 days</p>
                    </div>
                </div>
            </div>

            {/* Employment Certification History */}
            <div className="space-y-6">
                <h2 className="text-xl font-light text-gray-800">Employment Certification History</h2>
                <div className="bg-white border border-gray-200 rounded-2xl overflow-hidden shadow-sm">
                    <table className="w-full text-left">
                        <thead className="bg-gray-50">
                            <tr>
                                <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase">Period</th>
                                <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase">Employer</th>
                                <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase">Status</th>
                                <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase text-right">Form</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100">
                            <tr className="hover:bg-gray-50 transition-colors">
                                <td className="px-6 py-4 text-sm text-gray-700">Jan 2024 - Dec 2024</td>
                                <td className="px-6 py-4 text-sm font-medium text-gray-900">NYC Assigned Counsel Plan</td>
                                <td className="px-6 py-4">
                                    <span className="inline-flex px-2 py-1 text-xs font-medium rounded-full bg-green-100 text-green-700">
                                        Certified
                                    </span>
                                </td>
                                <td className="px-6 py-4 text-right">
                                    <button className="text-blue-600 text-sm hover:underline">View PDF</button>
                                </td>
                            </tr>
                            <tr className="hover:bg-gray-50 transition-colors">
                                <td className="px-6 py-4 text-sm text-gray-700">Jan 2023 - Dec 2023</td>
                                <td className="px-6 py-4 text-sm font-medium text-gray-900">NYC Assigned Counsel Plan</td>
                                <td className="px-6 py-4">
                                    <span className="inline-flex px-2 py-1 text-xs font-medium rounded-full bg-green-100 text-green-700">
                                        Certified
                                    </span>
                                </td>
                                <td className="px-6 py-4 text-right">
                                    <button className="text-blue-600 text-sm hover:underline">View PDF</button>
                                </td>
                            </tr>
                        </tbody>
                    </table>
                </div>
            </div>

            <div className="bg-blue-50 border border-blue-100 rounded-xl p-6 flex gap-4 items-start">
                <div className="text-blue-600 mt-1">
                    <svg className="w-6 h-6" style={{ width: '24px', height: '24px' }} width="24" height="24" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
                </div>
                <div>
                    <h3 className="font-medium text-blue-900">Certify Your Employment</h3>
                    <p className="text-sm text-blue-800 mt-1 leading-relaxed">
                        It looks like you haven't certified your employment for 2025 yet.
                        Use the <a href="#" className="underline font-medium hover:text-blue-700">PSLF Help Tool</a> to generate your form.
                    </p>
                </div>
            </div>

        </div>
    );
}
