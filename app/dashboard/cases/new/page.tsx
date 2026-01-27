"use client";

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useAppContext } from '@/context/AppContext';

export default function NewCasePage() {
    const router = useRouter();
    const { addCase } = useAppContext();
    const [step, setStep] = useState(1);
    const [formData, setFormData] = useState({ clientName: '', docketNumber: '', county: 'New York', chargeType: 'Felony', charges: '' });

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSave = () => {
        if (!formData.clientName) return;
        addCase({
            id: `CASE-2025-${Math.floor(Math.random() * 1000).toString().padStart(3, '0')}`,
            client: formData.clientName || 'Unnamed Client',
            charges: formData.charges || 'Pending Charges',
            county: formData.county,
            status: 'Open',
            nextCourtDate: 'TBD',
        });
        router.push('/dashboard/cases');
    };

    const labelStyle = { display: 'block', fontSize: '13px', fontWeight: 600 as const, color: '#0f172a', marginBottom: '0.375rem' };
    const inputStyle = { width: '100%', padding: '0.625rem 0.875rem', border: '1px solid #e2e8f0', borderRadius: '8px', fontSize: '14px', outline: 'none', boxSizing: 'border-box' as const };
    const btnPrimary = { padding: '0.625rem 1.5rem', background: '#2563eb', color: 'white', borderRadius: '8px', fontSize: '14px', fontWeight: 600, border: 'none', cursor: 'pointer' };
    const btnBack = { padding: '0.625rem 1.5rem', background: 'transparent', color: '#64748b', borderRadius: '8px', fontSize: '14px', fontWeight: 600, border: 'none', cursor: 'pointer' };

    return (
        <div style={{ maxWidth: '560px', margin: '0 auto', padding: '3rem 2rem' }}>
            <h1 style={{ fontSize: '24px', fontWeight: 700, color: '#0f172a', textAlign: 'center', marginBottom: '0.5rem' }}>New Case Intake</h1>
            <p style={{ fontSize: '14px', color: '#64748b', textAlign: 'center', marginBottom: '2rem' }}>Step {step} of 3</p>

            {/* Progress */}
            <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '2rem' }}>
                {[1,2,3].map(n => (
                    <div key={n} style={{ flex: 1, height: '4px', borderRadius: '2px', background: step >= n ? '#2563eb' : '#e2e8f0' }} />
                ))}
            </div>

            <div style={{ background: '#fff', border: '1px solid #e2e8f0', borderRadius: '12px', padding: '2rem' }}>
                {step === 1 && (
                    <div>
                        <div style={{ marginBottom: '1.25rem' }}>
                            <label style={labelStyle}>Client Full Name</label>
                            <input name="clientName" value={formData.clientName} onChange={handleChange} style={inputStyle} placeholder="e.g. John Doe" autoFocus />
                        </div>
                        <div style={{ marginBottom: '1.25rem' }}>
                            <label style={labelStyle}>Docket / Index Number</label>
                            <input name="docketNumber" value={formData.docketNumber} onChange={handleChange} style={inputStyle} placeholder="e.g. CR-2025-XXXX" />
                        </div>
                        <div style={{ textAlign: 'right', marginTop: '1.5rem' }}>
                            <button onClick={() => setStep(2)} disabled={!formData.clientName} style={{ ...btnPrimary, opacity: formData.clientName ? 1 : 0.4 }}>Continue</button>
                        </div>
                    </div>
                )}
                {step === 2 && (
                    <div>
                        <div style={{ marginBottom: '1.25rem' }}>
                            <label style={labelStyle}>County / Jurisdiction</label>
                            <select name="county" value={formData.county} onChange={handleChange} style={inputStyle}>
                                <option value="New York">New York County (Manhattan)</option>
                                <option value="Kings">Kings County (Brooklyn)</option>
                                <option value="Bronx">Bronx County</option>
                                <option value="Queens">Queens County</option>
                                <option value="Nassau">Nassau County</option>
                            </select>
                        </div>
                        <div style={{ marginBottom: '1.25rem' }}>
                            <label style={labelStyle}>Top Charge</label>
                            <input name="charges" value={formData.charges} onChange={handleChange} style={inputStyle} placeholder="e.g. PL 140.20 Burglary" />
                        </div>
                        <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '1.5rem' }}>
                            <button onClick={() => setStep(1)} style={btnBack}>Back</button>
                            <button onClick={() => setStep(3)} style={btnPrimary}>Continue</button>
                        </div>
                    </div>
                )}
                {step === 3 && (
                    <div>
                        <h3 style={{ fontSize: '15px', fontWeight: 600, color: '#0f172a', marginBottom: '1rem' }}>Review</h3>
                        {[
                            ['Client', formData.clientName],
                            ['Docket', formData.docketNumber || '—'],
                            ['County', formData.county],
                            ['Charge', formData.charges || '—'],
                        ].map(([label, value]) => (
                            <div key={label} style={{ display: 'flex', justifyContent: 'space-between', padding: '0.625rem 0', borderBottom: '1px solid #f1f5f9', fontSize: '14px' }}>
                                <span style={{ color: '#64748b' }}>{label}</span>
                                <span style={{ fontWeight: 600, color: '#0f172a' }}>{value}</span>
                            </div>
                        ))}
                        <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '2rem' }}>
                            <button onClick={() => setStep(2)} style={btnBack}>Back</button>
                            <button onClick={handleSave} style={{ ...btnPrimary, background: '#0f172a' }}>Create Case</button>
                        </div>
                    </div>
                )}
            </div>
            <div style={{ textAlign: 'center', marginTop: '1.5rem' }}>
                <Link href="/dashboard" style={{ fontSize: '13px', color: '#94a3b8' }}>Cancel</Link>
            </div>
        </div>
    );
}
