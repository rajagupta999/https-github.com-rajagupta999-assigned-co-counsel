"use client";

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useAppContext } from '@/context/AppContext';

export default function NewCasePage() {
    const router = useRouter();
    const { addCase } = useAppContext();

    const [step, setStep] = useState(1);
    const [formData, setFormData] = useState({
        clientName: '',
        docketNumber: '',
        county: 'New York',
        chargeType: 'Felony',
        charges: ''
    });

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const generateCaseId = () => {
        return `CASE-2025-${Math.floor(Math.random() * 1000).toString().padStart(3, '0')}`;
    };

    const handleSave = () => {
        if (!formData.clientName) return;

        const newCase = {
            id: generateCaseId(),
            client: formData.clientName || 'Unnamed Client',
            charges: formData.charges || 'Pending Charges',
            county: formData.county,
            status: 'Open',
            nextCourtDate: 'TBD'
        };

        addCase(newCase);
        router.push('/dashboard/cases');
    };

    const nextStep = () => setStep(step + 1);
    const prevStep = () => setStep(step - 1);

    const steps = [
        { num: 1, label: 'Client' },
        { num: 2, label: 'Details' },
        { num: 3, label: 'Review' },
    ];

    return (
        <div className="max-w-2xl mx-auto pt-6 sm:pt-12 px-4 sm:px-8 animate-fade-in pb-12 sm:pb-20">
            {/* Header */}
            <div className="mb-6 sm:mb-10 text-center">
                <h1 className="text-xl sm:text-2xl font-bold text-slate-900 tracking-tight">New Case Intake</h1>
                <p className="text-slate-400 text-sm mt-2">Enter case details to generate your digital file.</p>
            </div>

            {/* Progress Steps */}
            <div className="flex justify-center mb-8 sm:mb-12">
                <div className="flex items-center gap-0">
                    {steps.map((s, i) => (
                        <div key={s.num} className="flex items-center">
                            <div className="flex flex-col items-center">
                                <div className={`w-8 sm:w-10 h-8 sm:h-10 rounded-full flex items-center justify-center text-xs sm:text-sm font-bold transition-all duration-300 ${step >= s.num
                                    ? 'bg-navy-800 text-white shadow-md'
                                    : 'bg-slate-100 text-slate-400'
                                    }`}>
                                    {step > s.num ? (
                                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" style={{ width: '16px', height: '16px' }}><polyline points="20 6 9 17 4 12"></polyline></svg>
                                    ) : s.num}
                                </div>
                                <span className={`text-[10px] sm:text-[11px] font-medium mt-2 ${step >= s.num ? 'text-navy-800' : 'text-slate-400'}`}>{s.label}</span>
                            </div>
                            {i < 2 && <div className={`w-8 sm:w-16 h-0.5 mx-2 sm:mx-3 mb-5 transition-colors ${step > s.num ? 'bg-navy-800' : 'bg-slate-200'}`} />}
                        </div>
                    ))}
                </div>
            </div>

            <div className="bg-white rounded-xl border border-slate-200/80 shadow-sm p-4 sm:p-6 lg:p-8">
                {step === 1 && (
                    <div className="space-y-5 sm:space-y-6 animate-fade-in">
                        <div className="space-y-2">
                            <label className="block text-sm font-semibold text-slate-700">Client Full Name</label>
                            <input
                                name="clientName"
                                value={formData.clientName}
                                onChange={handleInputChange}
                                className="w-full px-4 py-3 rounded-lg border border-slate-200 focus:border-navy-500 focus:ring-2 focus:ring-navy-100 transition-all outline-none bg-slate-50 focus:bg-white text-sm"
                                placeholder="e.g. John Doe"
                                autoFocus
                            />
                        </div>
                        <div className="space-y-2">
                            <label className="block text-sm font-semibold text-slate-700">Docket / Index Number</label>
                            <input
                                name="docketNumber"
                                value={formData.docketNumber}
                                onChange={handleInputChange}
                                className="w-full px-4 py-3 rounded-lg border border-slate-200 focus:border-navy-500 focus:ring-2 focus:ring-navy-100 transition-all outline-none bg-slate-50 focus:bg-white text-sm"
                                placeholder="e.g. CR-2025-XXXX"
                            />
                        </div>
                        <div className="pt-4 sm:pt-6 flex justify-end">
                            <button
                                onClick={nextStep}
                                disabled={!formData.clientName}
                                className="w-full sm:w-auto bg-navy-800 hover:bg-navy-900 text-white px-6 py-2.5 rounded-lg font-semibold text-sm transition-all disabled:opacity-40 disabled:cursor-not-allowed shadow-sm"
                            >
                                Continue
                            </button>
                        </div>
                    </div>
                )}

                {step === 2 && (
                    <div className="space-y-5 sm:space-y-6 animate-fade-in">
                        <div className="space-y-2">
                            <label className="block text-sm font-semibold text-slate-700">County / Jurisdiction</label>
                            <div className="relative">
                                <select
                                    name="county"
                                    value={formData.county}
                                    onChange={handleInputChange}
                                    className="w-full px-4 py-3 rounded-lg border border-slate-200 focus:border-navy-500 focus:ring-2 focus:ring-navy-100 transition-all outline-none bg-slate-50 focus:bg-white appearance-none text-sm"
                                >
                                    <option value="New York">New York County (Manhattan)</option>
                                    <option value="Kings">Kings County (Brooklyn)</option>
                                    <option value="Bronx">Bronx County</option>
                                    <option value="Queens">Queens County</option>
                                    <option value="Nassau">Nassau County</option>
                                </select>
                                <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-slate-400">
                                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ width: '16px', height: '16px' }}><polyline points="6 9 12 15 18 9"></polyline></svg>
                                </div>
                            </div>
                        </div>
                        <div className="space-y-2">
                            <label className="block text-sm font-semibold text-slate-700">Top Charge</label>
                            <input
                                name="charges"
                                value={formData.charges}
                                onChange={handleInputChange}
                                className="w-full px-4 py-3 rounded-lg border border-slate-200 focus:border-navy-500 focus:ring-2 focus:ring-navy-100 transition-all outline-none bg-slate-50 focus:bg-white text-sm"
                                placeholder="e.g. PL 140.20 Burglary"
                            />
                        </div>
                        <div className="pt-4 sm:pt-6 flex flex-col-reverse sm:flex-row justify-between gap-3">
                            <button onClick={prevStep} className="text-slate-500 hover:text-slate-700 font-semibold text-sm px-4 py-2 rounded-lg hover:bg-slate-50 transition-colors">Back</button>
                            <button onClick={nextStep} className="w-full sm:w-auto bg-navy-800 hover:bg-navy-900 text-white px-6 py-2.5 rounded-lg font-semibold text-sm transition-all shadow-sm">Continue</button>
                        </div>
                    </div>
                )}

                {step === 3 && (
                    <div className="space-y-6 sm:space-y-8 animate-fade-in">
                        <div className="bg-slate-50 p-4 sm:p-6 rounded-lg border border-slate-100">
                            <h3 className="text-sm font-bold text-slate-700 uppercase tracking-wider mb-4 sm:mb-5">Summary Review</h3>
                            <dl className="space-y-3 sm:space-y-4">
                                {[
                                    { label: 'Client', value: formData.clientName },
                                    { label: 'Docket', value: formData.docketNumber || '\u2014' },
                                    { label: 'County', value: formData.county },
                                    { label: 'Charge', value: formData.charges || '\u2014' },
                                ].map(item => (
                                    <div key={item.label} className="flex items-center justify-between py-2 border-b border-slate-100 last:border-0">
                                        <dt className="text-sm text-slate-500">{item.label}</dt>
                                        <dd className="text-sm font-semibold text-slate-800 text-right">{item.value}</dd>
                                    </div>
                                ))}
                            </dl>
                        </div>

                        <div className="flex flex-col-reverse sm:flex-row justify-between items-center gap-3">
                            <button onClick={prevStep} className="text-slate-500 hover:text-slate-700 font-semibold text-sm px-4 py-2 rounded-lg hover:bg-slate-50 transition-colors">Back</button>
                            <button
                                onClick={handleSave}
                                className="w-full sm:w-auto bg-navy-900 hover:bg-navy-800 text-white px-8 py-3 rounded-lg font-semibold text-sm shadow-lg hover:shadow-xl transition-all"
                            >
                                Create Case File
                            </button>
                        </div>
                    </div>
                )}
            </div>
            <div className="text-center mt-6 sm:mt-8">
                <Link href="/dashboard" className="text-sm text-slate-400 hover:text-slate-600 transition-colors">Cancel and return to dashboard</Link>
            </div>
        </div>
    );
}
