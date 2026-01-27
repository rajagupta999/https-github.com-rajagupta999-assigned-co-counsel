"use client";

import Link from 'next/link';
import { useAppContext } from '@/context/AppContext';

export default function CasesPage() {
    const { cases } = useAppContext();

    return (
        <div style={{ padding: '2rem', maxWidth: '1200px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
                <div>
                    <h1 style={{ fontSize: '24px', fontWeight: 700, color: '#0f172a' }}>Cases</h1>
                    <p style={{ fontSize: '14px', color: '#64748b', marginTop: '0.25rem' }}>All your assigned matters</p>
                </div>
                <Link href="/dashboard/cases/new" style={{ padding: '0.5rem 1.25rem', background: '#2563eb', color: 'white', borderRadius: '8px', fontSize: '13px', fontWeight: 600 }}>+ New Case</Link>
            </div>

            <div style={{ background: '#fff', border: '1px solid #e2e8f0', borderRadius: '12px', overflow: 'hidden' }}>
                <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                    <thead>
                        <tr style={{ borderBottom: '1px solid #e2e8f0' }}>
                            <th style={{ padding: '0.75rem 1.25rem', textAlign: 'left', fontSize: '11px', fontWeight: 600, color: '#94a3b8', textTransform: 'uppercase' }}>Case ID</th>
                            <th style={{ padding: '0.75rem 1.25rem', textAlign: 'left', fontSize: '11px', fontWeight: 600, color: '#94a3b8', textTransform: 'uppercase' }}>Client</th>
                            <th style={{ padding: '0.75rem 1.25rem', textAlign: 'left', fontSize: '11px', fontWeight: 600, color: '#94a3b8', textTransform: 'uppercase' }}>Charges</th>
                            <th style={{ padding: '0.75rem 1.25rem', textAlign: 'left', fontSize: '11px', fontWeight: 600, color: '#94a3b8', textTransform: 'uppercase' }}>County</th>
                            <th style={{ padding: '0.75rem 1.25rem', textAlign: 'left', fontSize: '11px', fontWeight: 600, color: '#94a3b8', textTransform: 'uppercase' }}>Status</th>
                            <th style={{ padding: '0.75rem 1.25rem' }}></th>
                        </tr>
                    </thead>
                    <tbody>
                        {cases.length === 0 ? (
                            <tr><td colSpan={6} style={{ padding: '3rem', textAlign: 'center', color: '#94a3b8', fontSize: '14px' }}>No cases yet. Click &quot;New Case&quot; to add one.</td></tr>
                        ) : cases.map(c => (
                            <tr key={c.id} style={{ borderBottom: '1px solid #f1f5f9' }}>
                                <td style={{ padding: '0.75rem 1.25rem', fontSize: '12px', color: '#94a3b8', fontFamily: 'monospace' }}>{c.id}</td>
                                <td style={{ padding: '0.75rem 1.25rem', fontSize: '14px', fontWeight: 600, color: '#0f172a' }}>{c.client}</td>
                                <td style={{ padding: '0.75rem 1.25rem', fontSize: '13px', color: '#475569' }}>{c.charges}</td>
                                <td style={{ padding: '0.75rem 1.25rem', fontSize: '13px', color: '#475569' }}>{c.county}</td>
                                <td style={{ padding: '0.75rem 1.25rem' }}>
                                    <span style={{ fontSize: '12px', fontWeight: 600, color: c.status === 'Open' ? '#16a34a' : '#64748b', background: c.status === 'Open' ? '#f0fdf4' : '#f1f5f9', padding: '0.25rem 0.625rem', borderRadius: '4px' }}>{c.status}</span>
                                </td>
                                <td style={{ padding: '0.75rem 1.25rem', textAlign: 'right' }}>
                                    <Link href="/dashboard/copilot" style={{ fontSize: '13px', fontWeight: 600, color: '#2563eb' }}>Manage</Link>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
}
