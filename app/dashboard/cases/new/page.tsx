
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
        if (!formData.clientName) return; // Simple validation

        // 1. Create Case Object
        const newCase = {
            id: generateCaseId(),
            client: formData.clientName || 'Unnamed Client',
            charges: formData.charges || 'Pending Charges',
            county: formData.county,
            status: 'Open',
            nextCourtDate: 'TBD'
        };

        // 2. Save via Context
        addCase(newCase);

        // 3. Redirect to Dashboard
        router.push('/dashboard/cases');
    };

    const nextStep = () => setStep(step + 1);
    const prevStep = () => setStep(step - 1);

    return (
        <div className="max-w-2xl mx-auto pt-12 px-8 animate-fade-in pb-20">
            {/* Header */}
            <div className="mb-10 text-center">
                <h1 className="text-3xl font-light text-gray-900">New Case Intake</h1>
                <p className="text-gray-500 mt-2">Enter case details to generate your digital file.</p>
            </div>

            {/* Progress Steps */}
            <div className="flex justify-center mb-12">
                <div className="flex items-center gap-4">
                    {[1, 2, 3].map((s) => (
                        <div key={s} className="flex items-center">
                            <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium transition-colors ${step >= s ? 'bg-blue-600 text-white' : 'bg-gray-100 text-gray-400'
                                }`}>
                                {s}
                            </div>
                            {s < 3 && <div className={`w-12 h-0.5 mx-2 ${step > s ? 'bg-blue-600' : 'bg-gray-200'}`} />}
                        </div>
                    ))}
                </div>
            </div>

            <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-8">
                {step === 1 && (
                    <div className="space-y-6">
                        <div className="space-y-2">
                            <label className="block text-sm font-medium text-gray-700">Client Full Name</label>
                            <input
                                name="clientName"
                                value={formData.clientName}
                                onChange={handleInputChange}
                                className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all outline-none bg-gray-50 focus:bg-white"
                                placeholder="e.g. John Doe"
                                autoFocus
                            />
                        </div>
                        <div className="space-y-2">
                            <label className="block text-sm font-medium text-gray-700">Docket / Index Number</label>
                            <input
                                name="docketNumber"
                                value={formData.docketNumber}
                                onChange={handleInputChange}
                                className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all outline-none bg-gray-50 focus:bg-white"
                                placeholder="e.g. CR-2025-XXXX"
                            />
                        </div>
                        <div className="pt-8 flex justify-end">
                            <button
                                onClick={nextStep}
                                disabled={!formData.clientName}
                                className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2.5 rounded-full font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                Continue
                            </button>
                        </div>
                    </div>
                )}

                {step === 2 && (
                    <div className="space-y-6">
                        <div className="space-y-2">
                            <label className="block text-sm font-medium text-gray-700">County / Jurisdiction</label>
                            <div className="relative">
                                <select
                                    name="county"
                                    value={formData.county}
                                    onChange={handleInputChange}
                                    className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all outline-none bg-gray-50 focus:bg-white appearance-none"
                                >
                                    <option value="New York">New York County (Manhattan)</option>
                                    <option value="Kings">Kings County (Brooklyn)</option>
                                    <option value="Bronx">Bronx County</option>
                                    <option value="Queens">Queens County</option>
                                    <option value="Nassau">Nassau County</option>
                                </select>
                                <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-gray-500">▼</div>
                            </div>
                        </div>
                        <div className="space-y-2">
                            <label className="block text-sm font-medium text-gray-700">Top Charge</label>
                            <input
                                name="charges"
                                value={formData.charges}
                                onChange={handleInputChange}
                                className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all outline-none bg-gray-50 focus:bg-white"
                                placeholder="e.g. PL 140.20 Burglary"
                            />
                        </div>
                        <div className="pt-8 flex justify-between">
                            <button onClick={prevStep} className="text-gray-500 hover:text-gray-900 font-medium px-4">Back</button>
                            <button onClick={nextStep} className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2.5 rounded-full font-medium transition-colors">Continue</button>
                        </div>
                    </div>
                )}

                {step === 3 && (
                    <div className="space-y-8">
                        <div className="bg-blue-50/50 p-6 rounded-xl border border-blue-100">
                            <h3 className="text-blue-900 font-medium mb-4">Summary Review</h3>
                            <dl className="grid grid-cols-2 gap-y-4 text-sm">
                                <div className="text-gray-500">Client</div>
                                <div className="font-medium text-gray-900 text-right">{formData.clientName}</div>

                                <div className="text-gray-500">Docket</div>
                                <div className="font-medium text-gray-900 text-right">{formData.docketNumber || '—'}</div>

                                <div className="text-gray-500">County</div>
                                <div className="font-medium text-gray-900 text-right">{formData.county}</div>

                                <div className="text-gray-500">Charge</div>
                                <div className="font-medium text-gray-900 text-right">{formData.charges}</div>
                            </dl>
                        </div>

                        <div className="pt-4 flex justify-between items-center">
                            <button onClick={prevStep} className="text-gray-500 hover:text-gray-900 font-medium px-4">Back</button>
                            <button
                                onClick={handleSave}
                                className="bg-gray-900 hover:bg-black text-white px-8 py-3 rounded-full font-medium shadow-lg hover:shadow-xl transition-all transform hover:-translate-y-0.5"
                            >
                                Create Case File
                            </button>
                        </div>
                    </div>
                )}
            </div>
            <div className="text-center mt-8">
                <Link href="/dashboard" className="text-sm text-gray-400 hover:text-gray-600 transition-colors">Cancel and return to dashboard</Link>
            </div>
        </div>
    );
}
