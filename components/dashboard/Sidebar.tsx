"use client";

import Link from 'next/link';
import Image from 'next/image';
import { usePathname } from 'next/navigation';

const navItems = [
    { label: 'Mission Control', href: '/dashboard', icon: 'dashboard' },
    { label: 'Virtual Paralegal', href: '/dashboard/agent', icon: 'paralegal', badge: 'NEW' },
    { label: 'Co-Pilot AI', href: '/dashboard/copilot', icon: 'smart_toy' },
    { label: 'Cases', href: '/dashboard/cases', icon: 'folder' },
    { label: 'Documents', href: '/dashboard/documents', icon: 'document' },
    { label: 'Wiki', href: '/dashboard/wiki', icon: 'Wiki' },
    { separator: true, label: 'Research' },
    { label: 'Legal Intel', href: '/dashboard/intel', icon: 'intel', badge: 'NEW' },
    { label: 'Research Desk', href: '/dashboard/research', icon: 'research', badge: 'NEW' },
    { separator: true, label: 'Workflows' },
    { label: 'Criminal', href: '/dashboard/criminal', icon: 'gavel' },
    { label: 'Custody', href: '/dashboard/custody', icon: 'family' },
    { label: 'Divorce', href: '/dashboard/divorce', icon: 'heart_broken' },
    { separator: true, label: 'Self-Help' },
    { label: 'Pro Se Guide', href: '/dashboard/prose', icon: 'person', badge: 'FREE' },
    { separator: true, label: 'Preparation' },
    { label: 'Trial & Depo Prep', href: '/dashboard/trial-prep', icon: 'trial_prep', badge: 'NEW' },
    { separator: true, label: 'Trust & Safety' },
    { label: 'AI Policy', href: '/dashboard/ai-policy', icon: 'ai_policy', badge: 'NEW' },
    { separator: true, label: 'Tools' },
    { label: 'Privilege', href: '/dashboard/privilege', icon: 'shield' },
    { label: 'Vouchers', href: '/dashboard/vouchers', icon: 'receipt_long' },
    { label: 'PSLF', href: '/dashboard/pslf', icon: 'school' },
    { label: 'Messages', href: '/dashboard/messages', icon: 'messages', badge: 3 },
    { label: 'Settings', href: '/dashboard/settings', icon: 'settings' },
];

interface SidebarProps {
    isOpen: boolean;
    onClose: () => void;
}

export default function Sidebar({ isOpen, onClose }: SidebarProps) {
    const pathname = usePathname();

    const getIcon = (name: string, isActive: boolean) => {
        const color = isActive ? "#D4AF37" : "#94a3b8";
        switch (name) {
            case 'dashboard':
                return (
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" style={{ width: '20px', height: '20px' }}>
                        <rect x="3" y="3" width="7" height="7" rx="1"></rect><rect x="14" y="3" width="7" height="7" rx="1"></rect><rect x="14" y="14" width="7" height="7" rx="1"></rect><rect x="3" y="14" width="7" height="7" rx="1"></rect>
                    </svg>
                );
            case 'folder':
                return (
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" style={{ width: '20px', height: '20px' }}>
                        <path d="M22 19a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5l2 3h9a2 2 0 0 1 2 2z"></path>
                    </svg>
                );
            case 'heart_broken':
                return (
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" style={{ width: '20px', height: '20px' }}>
                        <path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z"></path><path d="M12 5 9.04 11l6.9 1-2.28 5.43"></path>
                    </svg>
                );
            case 'receipt_long':
                return (
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" style={{ width: '20px', height: '20px' }}>
                        <path d="M4 2v20l2-1 2 1 2-1 2 1 2-1 2 1 2-1 2 1V2l-2 1-2-1-2 1-2-1-2 1-2-1-2 1-2-1z"></path><line x1="14" y1="8" x2="8" y2="8"></line><line x1="16" y1="12" x2="8" y2="12"></line><line x1="13" y1="16" x2="8" y2="16"></line>
                    </svg>
                );
            case 'smart_toy':
                return (
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" style={{ width: '20px', height: '20px' }}>
                        <path d="M12 2a2 2 0 0 1 2 2v2a2 2 0 0 1-2 2v0a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2z"></path>
                        <rect x="5" y="9" width="14" height="14" rx="2"></rect>
                        <circle cx="9" cy="13" r="1"></circle><circle cx="15" cy="13" r="1"></circle>
                    </svg>
                );
            case 'school':
                return (
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" style={{ width: '20px', height: '20px' }}>
                        <path d="M22 10v6M2 10l10-5 10 5-10 5z"></path><path d="M6 12v5c3 3 9 3 12 0v-5"></path>
                    </svg>
                );
            case 'Wiki':
                return (
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" style={{ width: '20px', height: '20px' }}>
                        <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"></path>
                        <path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z"></path>
                    </svg>
                );
            case 'messages':
                return (
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" style={{ width: '20px', height: '20px' }}>
                        <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path>
                    </svg>
                );
            case 'settings':
                return (
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" style={{ width: '20px', height: '20px' }}>
                        <circle cx="12" cy="12" r="3"></circle>
                        <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z"></path>
                    </svg>
                );
            case 'document':
                return (
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" style={{ width: '20px', height: '20px' }}>
                        <path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z"/>
                        <polyline points="14 2 14 8 20 8"/>
                        <path d="M12 18v-6M9 15l3 3 3-3"/>
                    </svg>
                );
            case 'gavel':
                return (
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" style={{ width: '20px', height: '20px' }}>
                        <path d="M14 13l-7.5 7.5c-.83.83-2.17.83-3 0 0 0 0 0 0 0a2.12 2.12 0 0 1 0-3L11 10"></path>
                        <path d="m16 16 6-6"></path>
                        <path d="m8 8 6-6"></path>
                        <path d="m9 7 8 8"></path>
                        <path d="m21 11-8-8"></path>
                    </svg>
                );
            case 'family':
                return (
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" style={{ width: '20px', height: '20px' }}>
                        <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path>
                        <circle cx="9" cy="7" r="4"></circle>
                        <path d="M23 21v-2a4 4 0 0 0-3-3.87"></path>
                        <path d="M16 3.13a4 4 0 0 1 0 7.75"></path>
                    </svg>
                );
            case 'shield':
                return (
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" style={{ width: '20px', height: '20px' }}>
                        <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>
                    </svg>
                );
            case 'person':
                return (
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" style={{ width: '20px', height: '20px' }}>
                        <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
                        <circle cx="12" cy="7" r="4"></circle>
                    </svg>
                );
            case 'intel':
                return (
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" style={{ width: '20px', height: '20px' }}>
                        <path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z"></path>
                        <path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z"></path>
                        <line x1="6" y1="8" x2="6" y2="8"></line>
                        <line x1="6" y1="12" x2="6" y2="12"></line>
                        <line x1="18" y1="8" x2="18" y2="8"></line>
                        <line x1="18" y1="12" x2="18" y2="12"></line>
                    </svg>
                );
            case 'research':
                return (
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" style={{ width: '20px', height: '20px' }}>
                        <circle cx="11" cy="11" r="8"></circle>
                        <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
                        <line x1="11" y1="8" x2="11" y2="14"></line>
                        <line x1="8" y1="11" x2="14" y2="11"></line>
                    </svg>
                );
            case 'paralegal':
                return (
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" style={{ width: '20px', height: '20px' }}>
                        <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
                        <circle cx="12" cy="7" r="4"></circle>
                        <path d="M6 7h1M17 7h1M9 4l-1-2M15 4l1-2"></path>
                    </svg>
                );
            case 'ai_policy':
                return (
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" style={{ width: '20px', height: '20px' }}>
                        <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"></path>
                        <path d="M9 12l2 2 4-4"></path>
                    </svg>
                );
            case 'trial_prep':
                return (
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" style={{ width: '20px', height: '20px' }}>
                        <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path>
                        <polyline points="14 2 14 8 20 8"></polyline>
                        <path d="M9 15l2 2 4-4"></path>
                    </svg>
                );
            default:
                return null;
        }
    };

    return (
        <>
            {/* Mobile overlay */}
            {isOpen && (
                <div 
                    className="fixed inset-0 bg-black/50 z-30 lg:hidden"
                    onClick={onClose}
                />
            )}
            
            {/* Sidebar */}
            <aside className={`
                w-64 h-full bg-navy-900 flex flex-col fixed left-0 top-0 z-40
                transform transition-transform duration-300 ease-in-out
                ${isOpen ? 'translate-x-0' : '-translate-x-full'}
                lg:translate-x-0
            `}>
                {/* Logo Area */}
                <div className="h-16 flex items-center justify-between px-4 border-b border-navy-800">
                    <Link href="/" className="flex items-center gap-3">
                        <Image src="/logo-icon.svg" alt="Logo" width={36} height={36} className="w-9 h-9" />
                        <span className="text-base font-bold text-white tracking-tight">
                            Assigned <span className="text-gold-500">Co Counsel</span>
                        </span>
                    </Link>
                    <button 
                        onClick={onClose}
                        className="lg:hidden p-2 text-gray-400 hover:text-white"
                    >
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                            <line x1="18" y1="6" x2="6" y2="18"></line>
                            <line x1="6" y1="6" x2="18" y2="18"></line>
                        </svg>
                    </button>
                </div>

                {/* CTA Button */}
                <div className="px-4 pt-5 pb-2">
                    <Link href="/dashboard/cases/new" onClick={onClose} className="group flex items-center gap-3 bg-gold-500 p-2.5 rounded-xl shadow-md hover:bg-gold-400 transition-all duration-200 cursor-pointer">
                        <div className="w-8 h-8 rounded-lg bg-navy-900/20 flex items-center justify-center">
                            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#1e3a5f" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" style={{ width: '16px', height: '16px' }}><line x1="12" y1="5" x2="12" y2="19"></line><line x1="5" y1="12" x2="19" y2="12"></line></svg>
                        </div>
                        <span className="font-semibold text-sm text-navy-900">New Case</span>
                    </Link>
                </div>

                {/* Section label */}
                <div className="px-7 pt-6 pb-2">
                    <span className="text-[10px] font-bold text-navy-600 uppercase tracking-widest">Menu</span>
                </div>

                {/* Navigation */}
                <nav className="flex-1 px-3 space-y-0.5 overflow-y-auto">
                    {navItems.map((item: any, idx) => {
                        if (item.separator) {
                            return (
                                <div key={`sep_${idx}`} className="px-4 pt-4 pb-2">
                                    <span className="text-[10px] font-bold text-navy-600 uppercase tracking-widest">{item.label}</span>
                                </div>
                            );
                        }

                        const isActive = pathname === item.href || (item.href === '/dashboard/wiki' && pathname.startsWith('/dashboard/wiki'));
                        return (
                            <Link
                                key={item.href}
                                href={item.href}
                                onClick={onClose}
                                className={`flex items-center gap-3 px-4 py-2.5 rounded-lg text-[13px] font-medium transition-all duration-150 ${isActive
                                    ? 'bg-navy-800 text-gold-500'
                                    : 'text-gray-400 hover:bg-navy-800 hover:text-white'
                                    }`}
                            >
                                {getIcon(item.icon, isActive)}
                                <span>{item.label}</span>
                                {item.icon === 'smart_toy' && (
                                    <span className="ml-auto text-[9px] font-bold bg-gold-500 text-navy-900 px-1.5 py-0.5 rounded-md uppercase tracking-wide">AI</span>
                                )}
                                {'badge' in item && item.badge && typeof item.badge === 'number' && (
                                    <span className="ml-auto w-5 h-5 text-[10px] font-bold bg-red-500 text-white rounded-full flex items-center justify-center">{item.badge}</span>
                                )}
                                {'badge' in item && item.badge && typeof item.badge === 'string' && (
                                    <span className={`ml-auto text-[9px] font-bold px-1.5 py-0.5 rounded-md uppercase tracking-wide ${item.badge === 'NEW' ? 'bg-emerald-500 text-white' : 'bg-gold-500 text-navy-900'}`}>{item.badge}</span>
                                )}
                            </Link>
                        );
                    })}
                </nav>

                {/* Footer */}
                <div className="p-4 border-t border-navy-800">
                    <div className="flex items-center gap-3 px-2">
                        <div className="w-8 h-8 rounded-full bg-gold-500 text-navy-900 flex items-center justify-center text-xs font-bold shadow-sm">
                            S
                        </div>
                        <div className="flex-1 min-w-0">
                            <p className="text-sm font-semibold text-white truncate">Raja</p>
                            <p className="text-[11px] text-gray-500 truncate">Attorney at Law</p>
                        </div>
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#64748b" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ width: '16px', height: '16px' }} className="flex-shrink-0 cursor-pointer hover:stroke-white transition-colors">
                            <circle cx="12" cy="12" r="1"></circle><circle cx="12" cy="5" r="1"></circle><circle cx="12" cy="19" r="1"></circle>
                        </svg>
                    </div>
                </div>
            </aside>
        </>
    );
}
