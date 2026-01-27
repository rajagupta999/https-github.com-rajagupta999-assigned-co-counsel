"use client";

import { useState } from 'react';

const mockTimeEntries = [
    { id: 101, date: '2025-10-10', activity: 'Court Appearance for Arraignment', duration: 3.5, type: 'In-Court' },
    { id: 102, date: '2025-10-12', activity: 'Review of discovery materials and research', duration: 4.2, type: 'Out-of-Court' },
    { id: 103, date: '2025-10-15', activity: 'Drafting Motion to Suppress', duration: 2.0, type: 'Out-of-Court' },
];

export default function VouchersPage() {
    const [isAuditing, setIsAuditing] = useState(false);
    const [auditComplete, setAuditComplete] = useState(false);

    const runAudit = () => {
        setIsAuditing(true);
        setTimeout(() => { setIsAuditing(false); setAuditComplete(true); }, 2000);
    };

    return (
        <div style={{ padding: '2rem', maxWidth: '1100px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
                <div>
                    <h1 style={{ fontSize: '24px', fontWeight: 700, color: '#0f172a' }}>Draft Voucher</h1>
                    <p style={{ fontSize: '13px', color: '#64748b', marginTop: '0.25rem' }}>CASE-2025-001 · John Doe</p>
                </div>
                {!auditComplete ? (
                    <button onClick={runAudit} disabled={isAuditing} style={{ padding: '0.5rem 1.25rem', background: '#2563eb', color: 'white', borderRadius: '8px', fontSize: '13px', fontWeight: 600, border: 'none', cursor: 'pointer', opacity: isAuditing ? 0.6 : 1 }}>
                        {isAuditing ? 'Analyzing...' : 'Run Compliance Audit'}
                    </button>
                ) : (
                    <button style={{ padding: '0.5rem 1.25rem', background: '#16a34a', color: 'white', borderRadius: '8px', fontSize: '13px', fontWeight: 600, border: 'none', cursor: 'pointer' }}>Submit Voucher</button>
                )}
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '1.5rem' }}>
                <div style={{ background: '#fff', border: '1px solid #e2e8f0', borderRadius: '12px', overflow: 'hidden' }}>
                    <div style={{ padding: '1rem 1.25rem', borderBottom: '1px solid #e2e8f0', fontSize: '14px', fontWeight: 600, color: '#0f172a' }}>Time Entries</div>
                    {mockTimeEntries.map(entry => {
                        const flagged = auditComplete && entry.id === 102;
                        return (
                            <div key={entry.id} style={{ padding: '1rem 1.25rem', borderBottom: '1px solid #f1f5f9', background: flagged ? '#fef2f2' : 'transparent' }}>
                                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                                    <div>
                                        <div style={{ fontSize: '14px', fontWeight: 500, color: '#0f172a' }}>{entry.activity}</div>
                                        <div style={{ fontSize: '12px', color: '#94a3b8', marginTop: '0.25rem' }}>{entry.date} · {entry.type}</div>
                                    </div>
                                    <div style={{ fontSize: '14px', fontWeight: 700, color: '#0f172a' }}>{entry.duration} hrs</div>
                                </div>
                                {flagged && (
                                    <div style={{ marginTop: '0.75rem', padding: '0.75rem', background: '#fff', border: '1px solid #fecaca', borderRadius: '8px', fontSize: '13px', color: '#b91c1c' }}>
                                        <strong>Block Billing Risk:</strong> Entry exceeds 4 hours without itemization. &quot;Review and research&quot; is vague per Nassau County rules.
                                        <div style={{ marginTop: '0.375rem' }}><button style={{ color: '#2563eb', fontSize: '12px', fontWeight: 600, background: 'none', border: 'none', cursor: 'pointer', padding: 0 }}>Auto-Itemize with AI</button></div>
                                    </div>
                                )}
                            </div>
                        );
                    })}
                    <div style={{ padding: '1rem 1.25rem', borderTop: '1px solid #e2e8f0', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <span style={{ fontSize: '14px', color: '#64748b' }}>Total Billable</span>
                        <span style={{ fontSize: '24px', fontWeight: 700, color: '#0f172a' }}>$1,532.60</span>
                    </div>
                </div>

                <div style={{ background: '#fff', border: '1px solid #e2e8f0', borderRadius: '12px', padding: '1.25rem' }}>
                    <div style={{ fontSize: '11px', fontWeight: 700, color: '#94a3b8', textTransform: 'uppercase', marginBottom: '1rem' }}>Submission Readiness</div>
                    {!auditComplete ? (
                        <div style={{ textAlign: 'center', padding: '2rem 0', color: '#94a3b8', fontSize: '13px' }}>Run the audit to check compliance.</div>
                    ) : (
                        <div>
                            {[{ label: 'Chronology', ok: true }, { label: 'Fee Caps', ok: true }, { label: 'Description Quality', ok: false }].map((item, i) => (
                                <div key={i} style={{ display: 'flex', justifyContent: 'space-between', padding: '0.625rem 0', borderBottom: '1px solid #f1f5f9', fontSize: '13px' }}>
                                    <span style={{ color: '#475569' }}>{item.label}</span>
                                    <span style={{ fontWeight: 600, color: item.ok ? '#16a34a' : '#dc2626' }}>{item.ok ? 'Passed' : '1 Issue'}</span>
                                </div>
                            ))}
                            <div style={{ marginTop: '1.25rem' }}>
                                <div style={{ fontSize: '11px', color: '#94a3b8', textTransform: 'uppercase' }}>Est. Payment</div>
                                <div style={{ fontSize: '20px', fontWeight: 700, color: '#0f172a', marginTop: '0.25rem' }}>Nov 28, 2025</div>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
