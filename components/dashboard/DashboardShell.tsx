"use client";

import { useState } from 'react';
import Link from 'next/link';
import Sidebar from './Sidebar';
import { usePracticeMode } from '@/context/PracticeModeContext';

// User Menu Dropdown Component (Moved from Sidebar)
function UserMenu() {
    const [isOpen, setIsOpen] = useState(false);
    return (
        <div className="relative">
            <button 
                onClick={() => setIsOpen(!isOpen)}
                className="flex items-center gap-3 pl-3 pr-2 py-1.5 rounded-full hover:bg-slate-100 transition-colors border border-transparent hover:border-slate-200"
            >
                <div className="text-right hidden sm:block">
                    <p className="text-sm font-semibold text-slate-700 leading-none">Raja</p>
                    <p className="text-[10px] text-slate-500 font-medium leading-none mt-1">Attorney at Law</p>
                </div>
                <div className="w-9 h-9 rounded-full bg-gold-500 text-navy-900 flex items-center justify-center text-sm font-bold shadow-sm ring-2 ring-white">R</div>
            </button>

            {isOpen && (
                <>
                    <div className="fixed inset-0 z-40" onClick={() => setIsOpen(false)} />
                    <div className="absolute top-full right-0 mt-2 w-56 bg-white border border-slate-200 rounded-xl shadow-xl overflow-hidden z-50 animate-in fade-in zoom-in-95 duration-100 origin-top-right">
                        <div className="p-1.5 space-y-0.5">
                            <div className="px-3 py-2 border-b border-slate-100 mb-1">
                                <p className="text-xs font-bold text-slate-800">Raja Gupta</p>
                                <p className="text-[10px] text-slate-500 truncate">raja@assignedcocounsel.com</p>
                            </div>
                            
                            <Link href="/dashboard/settings" onClick={() => setIsOpen(false)} className="flex items-center gap-3 px-3 py-2 text-xs font-medium text-slate-600 hover:bg-slate-50 hover:text-slate-900 rounded-lg transition-colors">
                                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z"/></svg>
                                Settings
                            </Link>
                            <Link href="/dashboard/local" onClick={() => setIsOpen(false)} className="flex items-center gap-3 px-3 py-2 text-xs font-medium text-emerald-600 bg-emerald-50 hover:bg-emerald-100 rounded-lg transition-colors border border-emerald-100">
                                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M18 10h-1.26A8 8 0 1 0 9 20h9a5 5 0 0 0 0-10z"/></svg>
                                Local Sovereign Cloud
                            </Link>
                            <Link href="/dashboard/premium-ai" onClick={() => setIsOpen(false)} className="flex items-center gap-3 px-3 py-2 text-xs font-medium text-slate-600 hover:bg-slate-50 hover:text-slate-900 rounded-lg transition-colors">
                                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M12 2a2 2 0 0 1 2 2v2a2 2 0 0 1-2 2v0a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2z"/><rect x="5" y="9" width="14" height="14" rx="2"/><circle cx="9" cy="13" r="1"/><circle cx="15" cy="13" r="1"/></svg>
                                Connect AI Models
                            </Link>
                            <Link href="/dashboard/billing" onClick={() => setIsOpen(false)} className="flex items-center gap-3 px-3 py-2 text-xs font-medium text-slate-600 hover:bg-slate-50 hover:text-slate-900 rounded-lg transition-colors">
                                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="2" y="5" width="20" height="14" rx="2"/><line x1="2" y1="10" x2="22" y2="10"/></svg>
                                Billing & Subscription
                            </Link>
                            
                            <div className="h-px bg-slate-100 my-1" />
                            
                            <Link href="/login" className="flex items-center gap-3 px-3 py-2 text-xs font-medium text-red-600 hover:bg-red-50 rounded-lg transition-colors">
                                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/><polyline points="16 17 21 12 16 7"/><line x1="21" y1="12" x2="9" y2="12"/></svg>
                                Sign Out
                            </Link>
                        </div>
                    </div>
                </>
            )}
        </div>
    );
}

export default function DashboardShell({
    children,
}: {
    children: React.ReactNode;
}) {
    const [sidebarOpen, setSidebarOpen] = useState(false);
    const { mode, isProSe } = usePracticeMode();

    // Mode-specific status dot
    const statusColor = {
        'prose': 'bg-amber-500',
        '18b': 'bg-blue-500',
        'private': 'bg-purple-500',
        'combined': 'bg-emerald-500'
    }[mode];

    return (
        <div className="flex h-screen bg-slate-50">
            {/* Sidebar */}
            <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />

            {/* Main Content */}
            <div className="flex-1 flex flex-col min-w-0 lg:pl-64 transition-all duration-300">
                {/* Header */}
                <header className="h-16 bg-white border-b border-slate-200 flex items-center justify-between px-4 sm:px-6 lg:px-8 shrink-0 z-20">
                    <div className="flex items-center gap-4">
                        <button 
                            onClick={() => setSidebarOpen(true)}
                            className="lg:hidden p-2 -ml-2 text-slate-500 hover:text-slate-700"
                        >
                            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="3" y1="12" x2="21" y2="12"/><line x1="3" y1="6" x2="21" y2="6"/><line x1="3" y1="18" x2="21" y2="18"/></svg>
                        </button>
                        
                        <div className="flex items-center gap-2">
                            <span className={`w-2 h-2 rounded-full ${statusColor} animate-pulse`}></span>
                            <span className="text-xs font-semibold text-slate-500 uppercase tracking-wide hidden sm:block">System Active</span>
                        </div>
                    </div>

                    <div className="flex items-center gap-3 sm:gap-6">
                        {/* Search Bar */}
                        <div className="hidden md:block relative group">
                            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                <svg className="h-4 w-4 text-slate-400 group-focus-within:text-navy-600 transition-colors" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                                </svg>
                            </div>
                            <input
                                type="text"
                                className="block w-64 lg:w-80 pl-10 pr-3 py-1.5 border border-slate-200 rounded-lg leading-5 bg-slate-50 text-slate-900 placeholder-slate-400 focus:outline-none focus:bg-white focus:ring-1 focus:ring-navy-500 focus:border-navy-500 sm:text-sm transition-all"
                                placeholder={isProSe ? "Search my case documents..." : "Search cases, clients, statutes..."}
                            />
                            <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
                                <span className="text-slate-400 text-xs border border-slate-200 rounded px-1.5 py-0.5">⌘K</span>
                            </div>
                        </div>

                        {/* Notifications */}
                        <button className="relative p-2 text-slate-400 hover:text-slate-600 transition-colors">
                            <span className="absolute top-2 right-2 w-2 h-2 bg-red-500 rounded-full ring-2 ring-white"></span>
                            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"/><path d="M13.73 21a2 2 0 0 1-3.46 0"/></svg>
                        </button>

                        <div className="h-6 w-px bg-slate-200 hidden sm:block"></div>

                        {/* User Menu (Replaces 'D' Avatar) */}
                        <UserMenu />
                    </div>
                </header>

                {/* Main View Area */}
                <main className="flex-1 overflow-y-auto bg-slate-50 scroll-smooth">
                    {children}
                </main>
            </div>
        </div>
    );
}
