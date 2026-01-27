"use client";

import { useAppContext } from '@/context/AppContext';
import { mockStats, mockTasks } from '@/lib/mockData';
import Link from 'next/link';

export default function DashboardPage() {
    const { cases } = useAppContext();
    const recentCases = cases.slice(0, 5);

    return (
        <div style={{ padding: '2rem', maxWidth: '1200px' }}>
            <div style={{ marginBottom: '2rem' }}>
                <h1 style={{ fontSize: '24px', fontWeight: 700, color: '#0f172a', marginBottom: '0.25rem' }}>Dashboard</h1>
                <p style={{ fontSize: '14px', color: '#64748b' }}>Welcome back, Jane. Here is your practice overview.</p>
            </div>

            {/* Stats */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '1rem', marginBottom: '2rem' }}>
                <div style={{ background: '#fff', border: '1px solid #e2e8f0', borderRadius: '12px', padding: '1.25rem' }}>
                    <div style={{ fontSize: '12px', fontWeight: 600, color: '#64748b', textTransform: 'uppercase', marginBottom: '0.5rem' }}>Billable Hours</div>
                    <div style={{ fontSize: '32px', fontWeight: 700, color: '#0f172a' }}>{mockStats.billableHoursThisMonth}</div>
                </div>
                <div style={{ background: '#fff', border: '1px solid #e2e8f0', borderRadius: '12px', padding: '1.25rem' }}>
                    <div style={{ fontSize: '12px', fontWeight: 600, color: '#64748b', textTransform: 'uppercase', marginBottom: '0.5rem' }}>Pending Vouchers</div>
                    <div style={{ fontSize: '32px', fontWeight: 700, color: '#0f172a' }}>{mockStats.pendingVouchers}</div>
                </div>
                <div style={{ background: '#fff', border: '1px solid #e2e8f0', borderRadius: '12px', padding: '1.25rem' }}>
                    <div style={{ fontSize: '12px', fontWeight: 600, color: '#64748b', textTransform: 'uppercase', marginBottom: '0.5rem' }}>PSLF Progress</div>
                    <div style={{ fontSize: '32px', fontWeight: 700, color: '#0f172a' }}>{mockStats.pslfProgress}%</div>
                    <div style={{ marginTop: '0.5rem', height: '6px', background: '#e2e8f0', borderRadius: '3px', overflow: 'hidden' }}>
                        <div style={{ height: '100%', width: `${mockStats.pslfProgress}%`, background: '#2563eb', borderRadius: '3px' }} />
                    </div>
                </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '1.5rem' }}>
                {/* Cases Table */}
                <div style={{ background: '#fff', border: '1px solid #e2e8f0', borderRadius: '12px', overflow: 'hidden' }}>
                    <div style={{ padding: '1rem 1.25rem', borderBottom: '1px solid #e2e8f0', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <span style={{ fontWeight: 600, fontSize: '15px', color: '#0f172a' }}>Recent Cases</span>
                        <Link href="/dashboard/cases" style={{ fontSize: '13px', fontWeight: 600, color: '#2563eb' }}>View All</Link>
                    </div>
                    <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                        <thead>
                            <tr style={{ borderBottom: '1px solid #e2e8f0' }}>
                                <th style={{ padding: '0.75rem 1.25rem', textAlign: 'left', fontSize: '11px', fontWeight: 600, color: '#94a3b8', textTransform: 'uppercase' }}>Client</th>
                                <th style={{ padding: '0.75rem 1.25rem', textAlign: 'left', fontSize: '11px', fontWeight: 600, color: '#94a3b8', textTransform: 'uppercase' }}>Charges</th>
                                <th style={{ padding: '0.75rem 1.25rem', textAlign: 'left', fontSize: '11px', fontWeight: 600, color: '#94a3b8', textTransform: 'uppercase' }}>Status</th>
                                <th style={{ padding: '0.75rem 1.25rem', textAlign: 'right', fontSize: '11px', fontWeight: 600, color: '#94a3b8', textTransform: 'uppercase' }}>Court Date</th>
                            </tr>
                        </thead>
                        <tbody>
                            {recentCases.map(c => (
                                <tr key={c.id} style={{ borderBottom: '1px solid #f1f5f9' }}>
                                    <td style={{ padding: '0.75rem 1.25rem' }}>
                                        <div style={{ fontSize: '14px', fontWeight: 600, color: '#0f172a' }}>{c.client}</div>
                                        <div style={{ fontSize: '11px', color: '#94a3b8' }}>{c.id}</div>
                                    </td>
                                    <td style={{ padding: '0.75rem 1.25rem', fontSize: '13px', color: '#475569' }}>{c.charges}</td>
                                    <td style={{ padding: '0.75rem 1.25rem' }}>
                                        <span style={{ fontSize: '12px', fontWeight: 600, color: c.status === 'Open' ? '#16a34a' : '#64748b', background: c.status === 'Open' ? '#f0fdf4' : '#f1f5f9', padding: '0.25rem 0.625rem', borderRadius: '4px' }}>{c.status}</span>
                                    </td>
                                    <td style={{ padding: '0.75rem 1.25rem', textAlign: 'right', fontSize: '13px', color: '#475569' }}>{c.nextCourtDate}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>

                {/* Tasks */}
                <div style={{ background: '#fff', border: '1px solid #e2e8f0', borderRadius: '12px', overflow: 'hidden' }}>
                    <div style={{ padding: '1rem 1.25rem', borderBottom: '1px solid #e2e8f0' }}>
                        <span style={{ fontWeight: 600, fontSize: '15px', color: '#0f172a' }}>Tasks</span>
                    </div>
                    {mockTasks.map(task => (
                        <div key={task.id} style={{ padding: '0.875rem 1.25rem', borderBottom: '1px solid #f1f5f9', display: 'flex', gap: '0.75rem', alignItems: 'flex-start' }}>
                            <input type="checkbox" style={{ marginTop: '3px' }} />
                            <div>
                                <div style={{ fontSize: '13px', fontWeight: 500, color: '#0f172a' }}>{task.title}</div>
                                <div style={{ fontSize: '11px', color: '#94a3b8', marginTop: '2px' }}>{task.caseId} · {task.due}{task.urgent ? ' · URGENT' : ''}</div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}
