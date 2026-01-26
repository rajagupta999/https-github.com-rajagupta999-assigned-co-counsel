
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

    return (
        <aside className="w-64 h-full bg-[#f1f3f4] flex flex-col fixed left-0 top-0 border-r border-[#dadce0] z-20">
            <div className="p-4 flex items-center gap-2 mb-2">
                <div className="w-8 h-8 bg-blue-600 rounded flex items-center justify-center text-white font-serif font-bold text-lg">A</div>
                <span className="text-xl font-normal text-gray-700 tracking-tight">Assigned<span className="font-bold text-gray-900">CoCounsel</span></span>
            </div>

            <div className="px-3 mb-6">
                <Link href="/dashboard/cases/new" className="flex items-center gap-3 bg-white p-3 rounded-full shadow-sm hover:shadow-md transition-shadow border border-[#dadce0] cursor-pointer">
                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-google-blue ml-1"><line x1="12" y1="5" x2="12" y2="19"></line><line x1="5" y1="12" x2="19" y2="12"></line></svg>
                    <span className="font-medium text-gray-700">New Case</span>
                </Link>
            </div>

            <nav className="flex-1 px-3 space-y-1">
                {navItems.map((item) => {
                    const isActive = pathname === item.href;
                    return (
                        <Link
                            key={item.href}
                            href={item.href}
                            className={`flex items-center gap-4 px-4 py-2.5 rounded-r-full text-sm font-medium transition-colors ${isActive
                                    ? 'bg-blue-100 text-blue-800'
                                    : 'text-gray-600 hover:bg-gray-200'
                                }`}
                        >
                            <span className={`material-icons-outlined ${isActive ? 'text-blue-800' : 'text-gray-500'}`}>
                                {/* Placeholder Icons until Material Icons are loaded, utilizing simple text fallback if needed */}
                                {item.label[0]}
                            </span>
                            <span>{item.label}</span>
                        </Link>
                    );
                })}
            </nav>

            <div className="p-4 border-t border-[#dadce0]">
                <div className="text-xs text-gray-500 text-center">
                    &copy; 2025 AssignedCoCounsel
                </div>
            </div>
        </aside>
    );
}
