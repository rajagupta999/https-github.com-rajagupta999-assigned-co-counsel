
"use client";

import { divorceSteps } from '@/lib/divorceContent';
import Link from 'next/link';

export default function DivorceWorkflowPage() {
    return (
        <div className="min-h-[calc(100vh-56px)] bg-slate-50/50 p-8 lg:p-12 overflow-y-auto animate-fade-in">
            <div className="max-w-6xl mx-auto">
                <div className="mb-10">
                    <div className="flex items-center gap-3 mb-4">
                        <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-rose-500 to-pink-600 flex items-center justify-center shadow-sm shadow-rose-500/20">
                            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" style={{ width: '20px', height: '20px' }}>
                                <path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z"></path>
                            </svg>
                        </div>
                        <div>
                            <h1 className="text-2xl font-bold text-slate-900 tracking-tight">Divorce Guidebook</h1>
                            <p className="text-sm text-slate-400">Select a stage to launch Co-Pilot with pre-loaded drafting tasks.</p>
                        </div>
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
                    {divorceSteps.map((step) => (
                        <Link
                            key={step.id}
                            href={`/dashboard/copilot?workflow=${step.id}`}
                            className="group block"
                        >
                            <div className="h-full bg-white border border-slate-200/80 rounded-xl p-6 hover:shadow-lg hover:border-blue-200 transition-all duration-200 relative overflow-hidden">
                                {/* Step number badge */}
                                <div className="flex items-center justify-between mb-4">
                                    <div className="w-8 h-8 rounded-lg bg-blue-50 flex items-center justify-center text-blue-600 text-sm font-bold group-hover:bg-blue-600 group-hover:text-white transition-colors">
                                        {step.order}
                                    </div>
                                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#94a3b8" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ width: '16px', height: '16px' }} className="opacity-0 group-hover:opacity-100 group-hover:translate-x-1 transition-all">
                                        <path d="M5 12h14M12 5l7 7-7 7"></path>
                                    </svg>
                                </div>

                                <h3 className="text-base font-semibold text-slate-800 mb-2 group-hover:text-blue-600 transition-colors leading-snug">
                                    {step.title}
                                </h3>

                                <p className="text-sm text-slate-400 leading-relaxed line-clamp-2">
                                    {step.description}
                                </p>

                                <div className="mt-4 pt-4 border-t border-slate-100">
                                    <span className="text-[11px] font-bold text-blue-600 uppercase tracking-wider flex items-center gap-1">
                                        Launch Task
                                        <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" style={{ width: '12px', height: '12px' }} className="group-hover:translate-x-1 transition-transform"><path d="M5 12h14M12 5l7 7-7 7"></path></svg>
                                    </span>
                                </div>
                            </div>
                        </Link>
                    ))}
                </div>
            </div>
        </div>
    );
}
