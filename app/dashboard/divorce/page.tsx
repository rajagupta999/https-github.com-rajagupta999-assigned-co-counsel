
"use client";

import { divorceSteps } from '@/lib/divorceContent';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

export default function DivorceWorkflowPage() {
    const router = useRouter();

    return (
        <div className="min-h-[calc(100vh-64px)] bg-gray-50/50 p-12 overflow-y-auto animate-fade-in">
            <div className="max-w-6xl mx-auto">
                <div className="mb-12 text-center">
                    <h1 className="text-4xl font-light text-gray-900 tracking-tight mb-4">Divorce Guidebook</h1>
                    <p className="text-lg text-gray-500 max-w-2xl mx-auto">
                        A step-by-step workflow for Assigned Counsel. Select a stage to launch Co-Pilot with typical drafting tasks pre-loaded.
                    </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 relative">
                    {/* Visual Connector Line (Desktop) */}
                    <div className="hidden lg:block absolute top-[2.5rem] left-8 right-8 h-0.5 bg-gray-200 -z-10" />

                    {divorceSteps.map((step, index) => (
                        <div key={step.id} className="relative group">
                            <Link
                                href={`/dashboard/copilot?workflow=${step.id}`}
                                className="block h-full bg-white border border-gray-200 rounded-2xl p-8 hover:shadow-xl hover:border-blue-300 transition-all duration-300 transform hover:-translate-y-1"
                            >
                                <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
                                    <span className="text-6xl font-black text-gray-900">{step.order}</span>
                                </div>

                                <div className="mb-6 inline-flex items-center justify-center w-12 h-12 rounded-xl bg-blue-50 text-blue-600 group-hover:bg-blue-600 group-hover:text-white transition-colors">
                                    {/* Simple generic icons based on step - matching content file intent */}
                                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01"></path></svg>
                                </div>

                                <h3 className="text-xl font-medium text-gray-900 mb-3 group-hover:text-blue-600 transition-colors">
                                    {step.title}
                                </h3>

                                <p className="text-sm text-gray-500 leading-relaxed mb-6">
                                    {step.description}
                                </p>

                                <div className="flex items-center text-xs font-bold text-blue-600 uppercase tracking-widest mt-auto">
                                    Launch Task
                                    <svg className="w-4 h-4 ml-1 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 8l4 4m0 0l-4 4m4-4H3"></path></svg>
                                </div>
                            </Link>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}
