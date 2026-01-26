
"use client";

import Link from 'next/link';
import { usePathname } from 'next/navigation';

const navItems = [
    { label: 'Mission Control', href: '/dashboard', icon: 'dashboard' },
    { label: 'Cases', href: '/dashboard/cases', icon: 'folder' },
    { label: 'Vouchers', href: '/dashboard/vouchers', icon: 'receipt_long' },
    { label: 'Co-Pilot', href: '/dashboard/copilot', icon: 'smart_toy' },
    { label: 'PSLF', href: '/dashboard/pslf', icon: 'school' },
];

export default function Sidebar() {
    const pathname = usePathname();

    const getIcon = (name: string, isActive: boolean) => {
        const colorClass = isActive ? "text-blue-600" : "text-gray-500";
        switch (name) {
            case 'dashboard':
                return (
                    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={`${colorClass} w-5 h-5`}>
                        <rect x="3" y="3" width="7" height="7"></rect><rect x="14" y="3" width="7" height="7"></rect><rect x="14" y="14" width="7" height="7"></rect><rect x="3" y="14" width="7" height="7"></rect>
                    </svg>
                );
            case 'folder':
                return (
                    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={`${colorClass} w-5 h-5`}>
                        <path d="M22 19a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5l2 3h9a2 2 0 0 1 2 2z"></path>
                    </svg>
                );
            case 'receipt_long':
                return (
                    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={`${colorClass} w-5 h-5`}>
                        <path d="M4 2v20l2-1 2 1 2-1 2 1 2-1 2 1 2-1 2 1V2l-2 1-2-1-2 1-2-1-2 1-2-1-2 1-2-1z"></path><line x1="14" y1="8" x2="8" y2="8"></line><line x1="16" y1="12" x2="8" y2="12"></line><line x1="13" y1="16" x2="8" y2="16"></line>
                    </svg>
                );
            case 'smart_toy':
                return (
                    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={`${colorClass} w-5 h-5`}>
                        <path d="M12 2a2 2 0 0 1 2 2v2a2 2 0 0 1-2 2v0a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2z"></path>
                        <rect x="5" y="9" width="14" height="14" rx="2"></rect>
                        <line x1="9" y1="13" x2="9" y2="13"></line><line x1="15" y1="13" x2="15" y2="13"></line>
                    </svg>
                );
            case 'school':
                return (
                    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={`${colorClass} w-5 h-5`}>
                        <path d="M22 10v6M2 10l10-5 10 5-10 5z"></path><path d="M6 12v5c3 3 9 3 12 0v-5"></path>
                    </svg>
                );
            default:
                return null;
        }
    };

    return (
        <aside className="w-64 h-full bg-slate-50 flex flex-col fixed left-0 top-0 border-r border-slate-200 z-20">
            {/* Logo Area */}
            <div className="h-16 flex items-center px-6 border-b border-transparent">
                <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center text-white font-bold text-lg shadow-sm mr-3">
                    A
                </div>
                <div className="flex flex-col">
                    <span className="text-lg font-bold text-slate-800 leading-tight">Assigned<span className="text-blue-600">Co</span></span>
                </div>
            </div>

            {/* CTA Button */}
            <div className="px-4 py-6">
                <Link href="/dashboard/cases/new" className="group flex items-center gap-3 bg-white p-3 rounded-xl shadow-sm hover:shadow-md transition-all border border-slate-200 cursor-pointer">
                    <div className="w-10 h-10 rounded-full bg-blue-50 flex items-center justify-center group-hover:bg-blue-100 transition-colors">
                        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-blue-600 w-5 h-5"><line x1="12" y1="5" x2="12" y2="19"></line><line x1="5" y1="12" x2="19" y2="12"></line></svg>
                    </div>
                    <span className="font-semibold text-slate-700">New Case</span>
                </Link>
            </div>

            {/* Navigation */}
            <nav className="flex-1 px-4 space-y-1">
                {navItems.map((item) => {
                    const isActive = pathname === item.href;
                    return (
                        <Link
                            key={item.href}
                            href={item.href}
                            className={`flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-all duration-200 ${isActive
                                ? 'bg-blue-50 text-blue-700 shadow-sm ring-1 ring-blue-100'
                                : 'text-slate-600 hover:bg-slate-100/80 hover:text-slate-900'
                                }`}
                        >
                            {getIcon(item.icon, isActive)}
                            <span>{item.label}</span>
                        </Link>
                    );
                })}
            </nav>

            {/* Footer */}
            <div className="p-6 border-t border-slate-200">
                <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-purple-100 text-purple-700 flex items-center justify-center text-xs font-bold ring-2 ring-white shadow-sm">
                        JD
                    </div>
                    <div>
                        <p className="text-sm font-medium text-slate-700">Jane Doe</p>
                        <p className="text-xs text-slate-500">Attorney at Law</p>
                    </div>
                </div>
            </div>
        </aside>
    );
}
