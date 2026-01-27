"use client";

import { divorceSteps } from '@/lib/divorceContent';
import Link from 'next/link';

export default function DivorceWorkflowPage() {
    return (
        <div style={{ padding: '2rem', maxWidth: '1100px' }}>
            <h1 style={{ fontSize: '24px', fontWeight: 700, color: '#0f172a', marginBottom: '0.25rem' }}>Divorce Guidebook</h1>
            <p style={{ fontSize: '14px', color: '#64748b', marginBottom: '2rem' }}>Select a stage to launch Co-Pilot with pre-loaded tasks.</p>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '1rem' }}>
                {divorceSteps.map(step => (
                    <Link key={step.id} href={`/dashboard/copilot?workflow=${step.id}`} style={{ display: 'block' }}>
                        <div style={{ background: '#fff', border: '1px solid #e2e8f0', borderRadius: '12px', padding: '1.25rem', cursor: 'pointer' }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '0.75rem' }}>
                                <div style={{ width: '28px', height: '28px', borderRadius: '6px', background: '#eff6ff', color: '#2563eb', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '13px', fontWeight: 700 }}>{step.order}</div>
                                <span style={{ fontSize: '15px', fontWeight: 600, color: '#0f172a' }}>{step.title}</span>
                            </div>
                            <p style={{ fontSize: '13px', color: '#64748b', lineHeight: 1.6 }}>{step.description}</p>
                            <div style={{ marginTop: '0.75rem', fontSize: '12px', fontWeight: 600, color: '#2563eb' }}>Open in Co-Pilot →</div>
                        </div>
                    </Link>
                ))}
            </div>
        </div>
    );
}
