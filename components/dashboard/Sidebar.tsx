"use client";

import Link from 'next/link';
import { usePathname } from 'next/navigation';

const navItems = [
    { label: 'Dashboard', href: '/dashboard' },
    { label: 'Cases', href: '/dashboard/cases' },
    { label: 'Divorce Guide', href: '/dashboard/divorce' },
    { label: 'Wiki', href: '/dashboard/wiki' },
    { label: 'Vouchers', href: '/dashboard/vouchers' },
    { label: 'Co-Pilot', href: '/dashboard/copilot' },
    { label: 'PSLF', href: '/dashboard/pslf' },
];

export default function Sidebar() {
    const pathname = usePathname();
    return (
        <aside style={{ width: '240px', height: '100vh', position: 'fixed', left: 0, top: 0, background: '#fff', borderRight: '1px solid #e2e8f0', display: 'flex', flexDirection: 'column', zIndex: 20 }}>
            <div style={{ padding: '1.25rem 1.5rem', borderBottom: '1px solid #e2e8f0', display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                <div style={{ width: '28px', height: '28px', background: '#2563eb', borderRadius: '6px', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white', fontWeight: 700, fontSize: '13px' }}>A</div>
                <span style={{ fontWeight: 700, fontSize: '15px', color: '#0f172a' }}>AssignedCo</span>
            </div>
            <div style={{ padding: '1rem 1rem 0.5rem' }}>
                <Link href="/dashboard/cases/new" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.375rem', padding: '0.625rem', background: '#2563eb', color: 'white', borderRadius: '8px', fontSize: '13px', fontWeight: 600 }}>+ New Case</Link>
            </div>
            <nav style={{ flex: 1, padding: '0.5rem 0.75rem', overflow: 'auto' }}>
                {navItems.map((item) => {
                    const isActive = pathname === item.href || (item.href === '/dashboard/wiki' && pathname.startsWith('/dashboard/wiki'));
                    return (
                        <Link key={item.href} href={item.href} style={{ display: 'block', padding: '0.5rem 0.75rem', borderRadius: '6px', fontSize: '13px', fontWeight: isActive ? 600 : 500, color: isActive ? '#2563eb' : '#64748b', background: isActive ? '#eff6ff' : 'transparent', marginBottom: '2px' }}>
                            {item.label}
                        </Link>
                    );
                })}
            </nav>
            <div style={{ padding: '1rem 1.25rem', borderTop: '1px solid #e2e8f0', display: 'flex', alignItems: 'center', gap: '0.625rem' }}>
                <div style={{ width: '30px', height: '30px', borderRadius: '50%', background: '#7c3aed', color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '11px', fontWeight: 700 }}>JD</div>
                <div>
                    <div style={{ fontSize: '13px', fontWeight: 600, color: '#0f172a' }}>Jane Doe</div>
                    <div style={{ fontSize: '11px', color: '#94a3b8' }}>Attorney</div>
                </div>
            </div>
        </aside>
    );
}
