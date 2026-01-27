"use client";

export default function PSLFPage() {
    const total = 120;
    const current = 98;
    const pct = Math.round((current / total) * 100);

    return (
        <div style={{ padding: '2rem', maxWidth: '800px' }}>
            <h1 style={{ fontSize: '24px', fontWeight: 700, color: '#0f172a', marginBottom: '0.25rem' }}>PSLF Tracking</h1>
            <p style={{ fontSize: '14px', color: '#64748b', marginBottom: '2rem' }}>Public Service Loan Forgiveness progress.</p>

            <div style={{ background: '#fff', border: '1px solid #e2e8f0', borderRadius: '12px', padding: '2rem', marginBottom: '1.5rem' }}>
                <div style={{ fontSize: '12px', fontWeight: 600, color: '#64748b', textTransform: 'uppercase', marginBottom: '0.75rem' }}>Forgiveness Progress</div>
                <div style={{ display: 'flex', alignItems: 'baseline', gap: '0.5rem', marginBottom: '0.75rem' }}>
                    <span style={{ fontSize: '48px', fontWeight: 700, color: '#0f172a' }}>{current}</span>
                    <span style={{ fontSize: '18px', color: '#94a3b8' }}>/ {total} payments</span>
                </div>
                <div style={{ height: '8px', background: '#e2e8f0', borderRadius: '4px', overflow: 'hidden', marginBottom: '1.5rem' }}>
                    <div style={{ height: '100%', width: `${pct}%`, background: '#2563eb', borderRadius: '4px' }} />
                </div>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '1rem' }}>
                    {[
                        { label: 'Est. Forgiveness', value: 'October 2026' },
                        { label: 'Qualifying Loans', value: '8 Accounts' },
                        { label: 'Next Certification', value: 'Due in 45 days' },
                    ].map((s, i) => (
                        <div key={i} style={{ background: '#f8fafc', padding: '1rem', borderRadius: '8px' }}>
                            <div style={{ fontSize: '11px', color: '#94a3b8', textTransform: 'uppercase', marginBottom: '0.25rem' }}>{s.label}</div>
                            <div style={{ fontSize: '16px', fontWeight: 600, color: '#0f172a' }}>{s.value}</div>
                        </div>
                    ))}
                </div>
            </div>

            <div style={{ background: '#fff', border: '1px solid #e2e8f0', borderRadius: '12px', overflow: 'hidden', marginBottom: '1.5rem' }}>
                <div style={{ padding: '1rem 1.25rem', borderBottom: '1px solid #e2e8f0', fontSize: '15px', fontWeight: 600, color: '#0f172a' }}>Employment Certifications</div>
                <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                    <thead>
                        <tr style={{ borderBottom: '1px solid #e2e8f0' }}>
                            <th style={{ padding: '0.75rem 1.25rem', textAlign: 'left', fontSize: '11px', fontWeight: 600, color: '#94a3b8', textTransform: 'uppercase' }}>Period</th>
                            <th style={{ padding: '0.75rem 1.25rem', textAlign: 'left', fontSize: '11px', fontWeight: 600, color: '#94a3b8', textTransform: 'uppercase' }}>Employer</th>
                            <th style={{ padding: '0.75rem 1.25rem', textAlign: 'left', fontSize: '11px', fontWeight: 600, color: '#94a3b8', textTransform: 'uppercase' }}>Status</th>
                        </tr>
                    </thead>
                    <tbody>
                        {[{ period: 'Jan 2024 – Dec 2024' }, { period: 'Jan 2023 – Dec 2023' }].map((r, i) => (
                            <tr key={i} style={{ borderBottom: '1px solid #f1f5f9' }}>
                                <td style={{ padding: '0.75rem 1.25rem', fontSize: '13px', color: '#475569' }}>{r.period}</td>
                                <td style={{ padding: '0.75rem 1.25rem', fontSize: '14px', fontWeight: 600, color: '#0f172a' }}>NYC Assigned Counsel Plan</td>
                                <td style={{ padding: '0.75rem 1.25rem' }}>
                                    <span style={{ fontSize: '12px', fontWeight: 600, color: '#16a34a', background: '#f0fdf4', padding: '0.25rem 0.625rem', borderRadius: '4px' }}>Certified</span>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            <div style={{ background: '#eff6ff', border: '1px solid #dbeafe', borderRadius: '12px', padding: '1.25rem', display: 'flex', gap: '0.75rem', alignItems: 'flex-start' }}>
                <span style={{ fontSize: '18px' }}>ℹ</span>
                <div>
                    <div style={{ fontSize: '14px', fontWeight: 600, color: '#1e40af' }}>Certify Your Employment</div>
                    <div style={{ fontSize: '13px', color: '#1e40af', marginTop: '0.25rem', lineHeight: 1.6 }}>You haven&apos;t certified 2025 yet. Use the PSLF Help Tool to generate your form.</div>
                </div>
            </div>
        </div>
    );
}
