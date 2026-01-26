
"use client";

import Link from 'next/link';
import { usePathname } from 'next/navigation';

const navItems = [
    { label: 'Mission Control', href: '/dashboard', icon: 'dashboard' },
    { label: 'Cases', href: '/dashboard/cases', icon: 'folder' },
    { label: 'Divorce Guide', href: '/dashboard/divorce', icon: 'heart_broken' },
    { label: 'Wiki', href: '/dashboard/wiki', icon: 'Wiki' },
    { label: 'Vouchers', href: '/dashboard/vouchers', icon: 'receipt_long' },
    { label: 'Co-Pilot', href: '/dashboard/copilot', icon: 'smart_toy' },
    { label: 'PSLF', href: '/dashboard/pslf', icon: 'school' },
];

export default function Sidebar() {
    const pathname = usePathname();

    const getIcon = (name: string, isActive: boolean) => {
        const color = isActive ? "#3b82f6" : "#94a3b8";
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
            default:
                return null;
        }
    };

    return (
        <aside className="w-64 h-full bg-white flex flex-col fixed left-0 top-0 border-r border-slate-200/80 z-20">
            {/* Logo Area */}
            <div className="h-14 flex items-center px-6 border-b border-slate-100">
                <div className="w-8 h-8 bg-gradient-to-br from-blue-600 to-indigo-600 rounded-lg flex items-center justify-center text-white font-bold text-sm shadow-sm shadow-blue-500/20 mr-3">
                    A
                </div>
                <span className="text-base font-bold text-slate-800 tracking-tight">Assigned<span className="text-blue-600">Co</span></span>
            </div>

            {/* CTA Button */}
            <div className="px-4 pt-5 pb-2">
                <Link href="/dashboard/cases/new" className="group flex items-center gap-3 bg-gradient-to-r from-blue-600 to-indigo-600 p-2.5 rounded-xl shadow-md shadow-blue-500/20 hover:shadow-lg hover:shadow-blue-500/30 transition-all duration-200 cursor-pointer">
                    <div className="w-8 h-8 rounded-lg bg-white/20 flex items-center justify-center">
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" style={{ width: '16px', height: '16px' }}><line x1="12" y1="5" x2="12" y2="19"></line><line x1="5" y1="12" x2="19" y2="12"></line></svg>
                    </div>
                    <span className="font-semibold text-sm text-white">New Case</span>
                </Link>
            </div>

            {/* Section label */}
            <div className="px-7 pt-6 pb-2">
                <span className="text-[10px] font-bold text-slate-300 uppercase tracking-widest">Menu</span>
            </div>

            {/* Navigation */}
            <nav className="flex-1 px-3 space-y-0.5 overflow-y-auto">
                {navItems.map((item) => {
                    const isActive = pathname === item.href || (item.href === '/dashboard/wiki' && pathname.startsWith('/dashboard/wiki'));
                    return (
                        <Link
                            key={item.href}
                            href={item.href}
                            className={`flex items-center gap-3 px-4 py-2.5 rounded-lg text-[13px] font-medium transition-all duration-150 ${isActive
                                ? 'bg-blue-50 text-blue-700'
                                : 'text-slate-500 hover:bg-slate-50 hover:text-slate-700'
                                }`}
                        >
                            {getIcon(item.icon, isActive)}
                            <span>{item.label}</span>
                            {item.icon === 'smart_toy' && (
                                <span className="ml-auto text-[9px] font-bold bg-gradient-to-r from-blue-500 to-indigo-500 text-white px-1.5 py-0.5 rounded-md uppercase tracking-wide">AI</span>
                            )}
                        </Link>
                    );
                })}
            </nav>

            {/* Footer */}
            <div className="p-4 border-t border-slate-100">
                <div className="flex items-center gap-3 px-2">
                    <div className="w-8 h-8 rounded-full bg-gradient-to-br from-violet-500 to-purple-600 text-white flex items-center justify-center text-xs font-bold shadow-sm">
                        JD
                    </div>
                    <div className="flex-1 min-w-0">
                        <p className="text-sm font-semibold text-slate-700 truncate">Jane Doe</p>
                        <p className="text-[11px] text-slate-400 truncate">Attorney at Law</p>
                    </div>
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#94a3b8" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ width: '16px', height: '16px' }} className="flex-shrink-0 cursor-pointer hover:stroke-slate-600 transition-colors">
                        <circle cx="12" cy="12" r="1"></circle><circle cx="12" cy="5" r="1"></circle><circle cx="12" cy="19" r="1"></circle>
                    </svg>
                </div>
            </div>
        </aside>
    );
}
