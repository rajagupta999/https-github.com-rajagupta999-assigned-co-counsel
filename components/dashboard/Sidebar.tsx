"use client";

import { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { usePathname } from 'next/navigation';
import { usePracticeMode, PracticeMode } from '@/context/PracticeModeContext';
import { useAuth } from '@/context/AuthContext';

// Collapsible Section Component
function NavSection({ label, children, defaultOpen = true }: { label: string, children: React.ReactNode, defaultOpen?: boolean }) {
    const [isOpen, setIsOpen] = useState(defaultOpen);
    return (
        <div className="mb-2">
            <button 
                onClick={() => setIsOpen(!isOpen)}
                className="w-full flex items-center justify-between px-4 py-2.5 text-[11px] font-bold text-white/70 uppercase tracking-widest hover:text-white transition-colors hover:bg-navy-800/50 rounded-lg"
            >
                {label}
                <svg 
                    width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" 
                    className={`transform transition-transform duration-200 opacity-60 ${isOpen ? 'rotate-180' : ''}`}
                >
                    <polyline points="6 9 12 15 18 9"></polyline>
                </svg>
            </button>
            <div className={`overflow-hidden transition-all duration-300 ${isOpen ? 'max-h-[500px] opacity-100' : 'max-h-0 opacity-0'}`}>
                {children}
            </div>
        </div>
    );
}

interface SidebarProps {
    isOpen: boolean;
    onClose: () => void;
}

const MODE_LABELS: Record<PracticeMode, { label: string; short: string; color: string; desc: string }> = {
    'prose': { label: 'Client / Pro Se', short: 'CP', color: 'bg-amber-500', desc: 'Personal & Client View' },
    '18b': { label: 'Assigned Counsel', short: 'AC', color: 'bg-blue-600', desc: 'Assigned Counsel' },
    'private': { label: 'Private Practice', short: 'PP', color: 'bg-purple-600', desc: 'Firm Management' },
    'combined': { label: 'Combined', short: 'ALL', color: 'bg-emerald-600', desc: 'Full Practice' },
};

const NEW_CASE_LABELS: Record<PracticeMode, string> = {
    'prose': 'Start My Case',
    '18b': 'New Assignment',
    'private': 'New Client',
    'combined': 'New Case',
};

export default function Sidebar({ isOpen, onClose }: SidebarProps) {
    const pathname = usePathname();
    const { mode, setMode, isProSe } = usePracticeMode();
    const { user } = useAuth();
    const isClient = user?.userType === 'client';
    const [showModeMenu, setShowModeMenu] = useState(false);

    const NavLink = ({ href, label, icon, badge }: { href: string, label: string, icon: any, badge?: string | number }) => {
        const isActive = pathname === href || (href !== '/dashboard' && pathname.startsWith(href));
        const color = isActive ? "#D4AF37" : "#94a3b8";
        
        return (
            <Link
                href={href}
                onClick={onClose}
                className={`flex items-center gap-3 px-4 py-2 rounded-lg text-[13px] font-medium transition-all duration-150 mx-2 mb-0.5 ${
                    isActive ? 'bg-navy-800 text-gold-500' : 'text-gray-400 hover:bg-navy-800 hover:text-white'
                }`}
            >
                <div className="w-5 h-5 flex items-center justify-center">{icon(color)}</div>
                <span className="flex-1 truncate">{label}</span>
                {badge && (
                    <span className={`text-[9px] font-bold px-1.5 py-0.5 rounded-md ${
                        typeof badge === 'number' ? 'bg-red-500 text-white rounded-full min-w-[1.25rem] text-center' : 'bg-gold-500 text-navy-900 uppercase'
                    }`}>
                        {badge}
                    </span>
                )}
            </Link>
        );
    };

    // Icons
    const icons = {
        dashboard: (c: string) => <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke={c} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="3" width="7" height="7" rx="1"/><rect x="14" y="3" width="7" height="7" rx="1"/><rect x="14" y="14" width="7" height="7" rx="1"/><rect x="3" y="14" width="7" height="7" rx="1"/></svg>,
        cases: (c: string) => <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke={c} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 19a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5l2 3h9a2 2 0 0 1 2 2z"/></svg>,
        docs: (c: string) => <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke={c} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z"/><polyline points="14 2 14 8 20 8"/><path d="M12 18v-6M9 15l3 3 3-3"/></svg>,
        smart_toy: (c: string) => <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke={c} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 2a2 2 0 0 1 2 2v2a2 2 0 0 1-2 2v0a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2z"/><rect x="5" y="9" width="14" height="14" rx="2"/><circle cx="9" cy="13" r="1"/><circle cx="15" cy="13" r="1"/></svg>,
        msg: (c: string) => <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke={c} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/></svg>,
        calendar: (c: string) => <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke={c} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="4" width="18" height="18" rx="2" ry="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></svg>,
        
        // Team
        wiki: (c: string) => <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke={c} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M4 19.5A2.5 2.5 0 016.5 17H20"/><path d="M6.5 2H20v20H6.5A2.5 2.5 0 014 19.5v-15A2.5 2.5 0 016.5 2z"/><path d="M8 7h8M8 11h6"/></svg>,
        research: (c: string) => <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke={c} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/><line x1="11" y1="8" x2="11" y2="14"/><line x1="8" y1="11" x2="14" y2="11"/></svg>,
        paralegal: (c: string) => <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke={c} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 2a2 2 0 0 1 2 2v2a2 2 0 0 1-2 2v0a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2z"/><rect x="5" y="9" width="14" height="14" rx="2"/><circle cx="9" cy="13" r="1"/><circle cx="15" cy="13" r="1"/></svg>,
        assistant: (c: string) => <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke={c} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>,

        // Workflows
        criminal: (c: string) => <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke={c} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M14 13l-7.5 7.5c-.83.83-2.17.83-3 0 0 0 0 0 0 0a2.12 2.12 0 0 1 0-3L11 10"/><path d="m16 16 6-6"/><path d="m8 8 6-6"/><path d="m9 7 8 8"/><path d="m21 11-8-8"/></svg>,
        family: (c: string) => <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke={c} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>,
        divorce: (c: string) => <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke={c} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z"/><path d="M12 5 9.04 11l6.9 1-2.28 5.43"/></svg>,
        estate: (c: string) => <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke={c} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/><circle cx="12" cy="15" r="2"/><path d="M12 17v2"/></svg>,
        shield: (c: string) => <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke={c} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg>,
        person: (c: string) => <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke={c} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>,
        
        // 18B
        voucher: (c: string) => <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke={c} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M4 2v20l2-1 2 1 2-1 2 1 2-1 2 1V2l-2 1-2-1-2 1-2-1-2 1-2-1z"/><line x1="14" y1="8" x2="8" y2="8"/><line x1="16" y1="12" x2="8" y2="12"/><line x1="13" y1="16" x2="8" y2="16"/></svg>,
        pslf: (c: string) => <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke={c} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 10v6M2 10l10-5 10 5-10 5z"/><path d="M6 12v5c3 3 9 3 12 0v-5"/></svg>,
        
        // Private
        intake: (c: string) => <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke={c} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M16 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="8.5" cy="7" r="4"/><polyline points="17 11 19 13 23 9"/></svg>,
        marketing: (c: string) => <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke={c} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><path d="M12 2a14.5 14.5 0 0 0 0 20 14.5 14.5 0 0 0 0-20"/><path d="M2 12h20"/></svg>,
        receipt_long: (c: string) => <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke={c} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M4 2v20l2-1 2 1 2-1 2 1 2-1 2 1V2l-2 1-2-1-2 1-2-1-2 1-2-1z"/><line x1="14" y1="8" x2="8" y2="8"/><line x1="16" y1="12" x2="8" y2="12"/><line x1="13" y1="16" x2="8" y2="16"/></svg>,
        cloud: (c: string) => <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke={c} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M18 10h-1.26A8 8 0 1 0 9 20h9a5 5 0 0 0 0-10z"/></svg>,
        discovery: (c: string) => <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke={c} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="3" width="18" height="18" rx="2" ry="2"/><line x1="9" y1="9" x2="15" y2="15"/><line x1="15" y1="9" x2="9" y2="15"/></svg>,
    };

    return (
        <>
            {isOpen && (
                <div className="fixed inset-0 bg-black/50 z-30 lg:hidden" onClick={onClose} />
            )}
            <aside className={`
                w-64 h-full bg-navy-900 flex flex-col fixed left-0 top-0 z-40
                transform transition-transform duration-300 ease-in-out
                ${isOpen ? 'translate-x-0' : '-translate-x-full'}
                lg:translate-x-0
                border-r border-navy-800
            `}>
                {/* Logo */}
                <div className="h-16 flex items-center justify-between px-4 border-b border-navy-800 shrink-0">
                    <Link href="/" className="flex items-center gap-3">
                        <Image src="/logo-icon.svg" alt="Logo" width={32} height={32} className="w-8 h-8" />
                        <span className="text-base font-bold text-white tracking-tight">
                            Assigned <span className="text-gold-500">Co Counsel</span>
                        </span>
                    </Link>
                    <button onClick={onClose} className="lg:hidden p-2 text-gray-400 hover:text-white">
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
                    </button>
                </div>

                {/* Practice Mode Toggle — hidden for clients */}
                {isClient ? (
                  <div className="px-4 pt-4 pb-2 shrink-0">
                    <div className="flex items-center gap-2 px-3 py-2 bg-amber-900/30 rounded-lg border border-amber-700/40">
                      <span className="w-2 h-2 rounded-full bg-amber-500"></span>
                      <span className="text-xs font-bold text-amber-200 flex-1">Welcome, {user?.name || 'Client'}</span>
                    </div>
                  </div>
                ) : (
                <div className="px-4 pt-4 pb-2 shrink-0">
                    <div className="relative">
                        <button onClick={() => setShowModeMenu(!showModeMenu)} className="w-full flex items-center gap-2 px-3 py-2 bg-navy-800 rounded-lg hover:bg-navy-700 transition-colors border border-navy-700">
                            <span className={`w-2 h-2 rounded-full ${MODE_LABELS[mode].color}`}></span>
                            <span className="text-xs font-bold text-gray-300 flex-1 text-left">{MODE_LABELS[mode].label}</span>
                            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="#94a3b8" strokeWidth="2" className={`transition-transform ${showModeMenu ? 'rotate-180' : ''}`}><polyline points="6 9 12 15 18 9"/></svg>
                        </button>
                        {showModeMenu && (
                            <>
                                <div className="fixed inset-0 z-40" onClick={() => setShowModeMenu(false)} />
                                <div className="absolute top-full left-0 w-full mt-1 bg-navy-800 border border-navy-700 rounded-lg shadow-xl z-50 overflow-hidden">
                                    {(['combined', '18b', 'private', 'prose'] as PracticeMode[]).map(m => (
                                        <button key={m} onClick={() => { setMode(m); setShowModeMenu(false); }}
                                            className={`w-full flex items-start gap-2 px-3 py-2.5 text-left transition-colors ${mode === m ? 'bg-navy-700' : 'hover:bg-navy-700'}`}>
                                            <span className={`w-2 h-2 rounded-full mt-1.5 flex-shrink-0 ${MODE_LABELS[m].color}`}></span>
                                            <div>
                                                <div className="text-xs font-bold text-gray-200">{MODE_LABELS[m].label}</div>
                                                <div className="text-[9px] text-gray-500 font-medium">{MODE_LABELS[m].desc}</div>
                                            </div>
                                        </button>
                                    ))}
                                </div>
                            </>
                        )}
                    </div>
                </div>
                )}

                {/* New Case CTA */}
                <div className="px-4 pb-2 shrink-0">
                    <Link href={isProSe ? '/dashboard/prose' : '/dashboard/cases/new'} onClick={onClose}
                        className="w-full flex items-center justify-center gap-2 px-3 py-2.5 bg-gold-500 text-navy-900 rounded-lg text-xs font-bold hover:bg-gold-400 transition-colors shadow-sm">
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>
                        {NEW_CASE_LABELS[mode]}
                    </Link>
                </div>

                {/* Main Nav Scroll Area */}
                <nav className="flex-1 px-2 py-2 overflow-y-auto space-y-1">
                    
                    {/* Always Visible Top Links */}
                    <NavLink href="/dashboard" label="Dashboard" icon={icons.dashboard} />
                    
                    {isProSe ? (
                        /* Client Portal / Pro Se Nav */
                        <>
                            {/* Client Selector (for lawyers previewing client view — hidden for actual clients) */}
                            {!isClient && <div className="px-3 mb-3">
                                <label className="text-[9px] font-bold text-navy-400 uppercase tracking-wider block mb-1.5">Viewing as Client</label>
                                <select className="w-full bg-navy-800 border border-navy-600 text-gray-200 text-xs rounded-lg px-2.5 py-2 focus:ring-2 focus:ring-amber-500/30 focus:border-amber-500/50">
                                    <option>Carlos Martinez</option>
                                    <option>Wei Chen</option>
                                    <option>Angela Davis</option>
                                    <option>David Park</option>
                                    <option>Sarah Mitchell</option>
                                </select>
                                <p className="text-[9px] text-navy-500 mt-1">Preview what your client sees</p>
                            </div>}
                            {!isClient && <div className="border-t border-navy-700 mb-2" />}
                            <NavLink href="/dashboard/cases" label="My Case" icon={icons.cases} />
                            <NavLink href="/dashboard/documents" label="Documents" icon={icons.docs} />
                            <NavLink href="/dashboard/messages" label="Messages" icon={icons.msg} />
                            <NavLink href="/dashboard/billing" label="Billing & Payments" icon={icons.receipt_long} />
                            <NavLink href="/dashboard/court-schedules" label="Calendar" icon={icons.calendar} />
                            <NavLink href="/dashboard/copilot" label="AI Legal Helper" icon={icons.smart_toy} />
                            
                            <div className="my-2" />
                            <NavSection label="Self-Help Tools">
                                <NavLink href="/dashboard/prose" label="Pro Se Guide" icon={icons.person} />
                                <NavLink href="/dashboard/divorce" label="Divorce" icon={icons.divorce} />
                                <NavLink href="/dashboard/custody" label="Custody" icon={icons.family} />
                                <NavLink href="/dashboard/criminal" label="Criminal Defense" icon={icons.criminal} />
                                <NavLink href="/dashboard/estate-planning" label="Wills & Estates" icon={icons.estate} />
                                <NavLink href="/dashboard/prenup" label="Pre-Nup Guide" icon={icons.shield} />
                            </NavSection>

                            <NavSection label="AI Tools">
                                <NavLink href="/dashboard/assistant" label="Virtual Assistant" icon={icons.smart_toy} />
                                <NavLink href="/dashboard/paralegal" label="AI Paralegal" icon={icons.docs} />
                                <NavLink href="/dashboard/research" label="Research Desk" icon={icons.research} />
                                <NavLink href="/dashboard/wiki" label="Legal Wiki" icon={icons.wiki} />
                            </NavSection>
                        </>
                    ) : (
                        /* Attorney Nav Structure */
                        <>
                            <NavSection label="My Practice">
                                <NavLink href="/dashboard/cases" label={mode === 'private' ? 'Client Matters' : 'Cases'} icon={icons.cases} />
                                <NavLink href="/dashboard/clients" label="Clients" icon={icons.family} />
                                <NavLink href="/dashboard/documents" label="Documents" icon={icons.docs} />
                                <NavLink href="/dashboard/discovery" label="Discovery" icon={icons.discovery} />
                                <NavLink href="/dashboard/messages" label="Messages" icon={icons.msg} badge={3} />
                                <NavLink href="/dashboard/court-schedules" label="Calendar" icon={icons.calendar} />
                            </NavSection>

                            <NavSection label="My Team">
                                <NavLink href="/dashboard/assistant" label="Virtual Assistant" icon={icons.assistant} badge="AI" />
                                <NavLink href="/dashboard/paralegal" label="Virtual Paralegal" icon={icons.paralegal} badge="AI" />
                                <NavLink href="/dashboard/research" label="Research Desk" icon={icons.research} badge="AI" />
                                <NavLink href="/dashboard/wiki" label="Legal Wiki" icon={icons.wiki} badge="RAG" />
                            </NavSection>

                            <NavSection label="Workflows">
                                {/* Shared Workflows */}
                                <NavLink href="/dashboard/criminal" label="Criminal Defense" icon={icons.criminal} />
                                <NavLink href="/dashboard/custody" label="Custody & Family" icon={icons.family} />
                                <NavLink href="/dashboard/divorce" label="Divorce" icon={icons.divorce} />
                                
                                <NavLink href="/dashboard/trial-prep" label="Trial Prep" icon={(c: string) => <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke={c} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M16 4h2a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h2"/><rect x="8" y="2" width="8" height="4" rx="1" ry="1"/><path d="M12 11v6"/><path d="M9 14h6"/></svg>} />

                                {/* Private Only Workflows */}
                                {(mode === 'private' || mode === 'combined') && (
                                    <>
                                        <NavLink href="/dashboard/estate-planning" label="Estate Planning" icon={icons.estate} />
                                        <NavLink href="/dashboard/prenup" label="Pre-Nuptial" icon={icons.shield} />
                                    </>
                                )}
                            </NavSection>

                            {/* Mode Specific Tools */}
                            {(mode === '18b' || mode === 'combined') && (
                                <NavSection label="Assigned Counsel">
                                    <NavLink href="/dashboard/vouchers" label="Vouchers" icon={icons.voucher} />
                                    <NavLink href="/dashboard/pslf" label="PSLF Tracker" icon={icons.pslf} />
                                </NavSection>
                            )}

                            {(mode === 'private' || mode === 'combined') && (
                                <NavSection label="Firm Management">
                                    <NavLink href="/dashboard/client-intake" label="Client Intake" icon={icons.intake} />
                                    <NavLink href="/dashboard/marketing" label="Client Acquisition" icon={icons.marketing} />
                                    <NavLink href="/dashboard/billing" label="Billing & Trust" icon={icons.receipt_long} />
                                </NavSection>
                            )}
                            
                            <NavSection label="Community">
                                <NavLink href="/dashboard/directory" label="Attorney Directory" icon={(c: string) => <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke={c} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><circle cx="19" cy="11" r="3"/><line x1="19" y1="8" x2="19" y2="14"/><line x1="16" y1="11" x2="22" y2="11"/></svg>} />
                                <NavLink href="/dashboard/profile" label="My Profile" icon={icons.person} />
                            </NavSection>

                            {/* Always Visible Local Cloud Link */}
                            <NavSection label="Infrastructure">
                                <NavLink href="/dashboard/local" label="Local Sovereign Cloud" icon={icons.cloud} badge="NEW" />
                            </NavSection>
                        </>
                    )}
                </nav>
            </aside>
        </>
    );
}
