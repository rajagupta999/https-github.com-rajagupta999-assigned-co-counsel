
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
        router.push('/dashboard');
    };

    const nextStep = () => setStep(step + 1);
    const prevStep = () => setStep(step - 1);

    return (
        <div className="max-w-3xl mx-auto animate-fade-in pt-8">
            <div className="mb-8 flex items-center justify-between">
                <h1 className="text-2xl text-gray-800">New Case Intake</h1>
                <Link href="/dashboard" className="text-sm text-gray-500 hover:text-gray-900">Cancel</Link>
            </div>

            {/* Simple Progress Bar */}
            <div className="flex items-center gap-2 mb-8">
                <div className={`h-1 flex-1 rounded-full ${step >= 1 ? 'bg-blue-600' : 'bg-gray-200'}`} />
                <div className={`h-1 flex-1 rounded-full ${step >= 2 ? 'bg-blue-600' : 'bg-gray-200'}`} />
                <div className={`h-1 flex-1 rounded-full ${step >= 3 ? 'bg-blue-600' : 'bg-gray-200'}`} />
            </div>

            <div className="card shadow-sm">
                {step === 1 && (
                    <div className="space-y-6">
                        <h2 className="text-lg font-medium text-gray-900 border-b pb-2 mb-4">Client Details</h2>
                        <div className="grid grid-cols-1 gap-6">
                            <div className="space-y-1">
                                <label className="text-sm font-medium text-gray-700">Client Full Name</label>
                                <input
                                    name="clientName"
                                    value={formData.clientName}
                                    onChange={handleInputChange}
                                    className="input-clean"
                                    placeholder="e.g. John Smith"
                                    autoFocus
                                />
                            </div>
                            <div className="space-y-1">
                                <label className="text-sm font-medium text-gray-700">Docket / Index Number</label>
                                <input
                                    name="docketNumber"
                                    value={formData.docketNumber}
                                    onChange={handleInputChange}
                                    className="input-clean"
                                    placeholder="e.g. CR-2025-XXXX"
                                />
                            </div>
                        </div>
                        <div className="pt-6 flex justify-end">
                            <button onClick={nextStep} className="btn btn-primary">Next</button>
                        </div>
                    </div>
                )}

                {step === 2 && (
                    <div className="space-y-6">
                        <h2 className="text-lg font-medium text-gray-900 border-b pb-2 mb-4">Jurisdiction & Charges</h2>
                        <div className="grid grid-cols-1 gap-6">
                            <div className="space-y-1">
                                <label className="text-sm font-medium text-gray-700">County</label>
                                <select
                                    name="county"
                                    value={formData.county}
                                    onChange={handleInputChange}
                                    className="input-clean"
                                >
                                    <option value="New York">New York County (Manhattan)</option>
                                    <option value="Kings">Kings County (Brooklyn)</option>
                                    <option value="Bronx">Bronx County</option>
                                    <option value="Queens">Queens County</option>
                                    <option value="Nassau">Nassau County</option>
                                </select>
                                <p className="text-xs text-blue-600 mt-1 flex items-center gap-1">
                                    <span className="material-icons-outlined text-[10px]">info</span>
                                    Billing rules for {formData.county} loaded.
                                </p>
                            </div>
                            <div className="space-y-1">
                                <label className="text-sm font-medium text-gray-700">Top Charge</label>
                                <input
                                    name="charges"
                                    value={formData.charges}
                                    onChange={handleInputChange}
                                    className="input-clean"
                                    placeholder="e.g. PL 140.20 Burglary"
                                />
                            </div>
                        </div>
                        <div className="pt-6 flex justify-between">
                            <button onClick={prevStep} className="btn btn-ghost">Back</button>
                            <button onClick={nextStep} className="btn btn-primary">Next</button>
                        </div>
                    </div>
                )}

                {step === 3 && (
                    <div className="space-y-6">
                        <h2 className="text-lg font-medium text-gray-900 border-b pb-2 mb-4">Review & Create</h2>

                        <div className="bg-gray-50 p-4 rounded border border-gray-100 space-y-3">
                            <div className="grid grid-cols-2">
                                <span className="text-sm text-gray-500">Client</span>
                                <span className="text-sm font-medium text-gray-900">{formData.clientName || 'N/A'}</span>
                            </div>
                            <div className="grid grid-cols-2">
                                <span className="text-sm text-gray-500">Docket</span>
                                <span className="text-sm font-medium text-gray-900">{formData.docketNumber || 'N/A'}</span>
                            </div>
                            <div className="grid grid-cols-2">
                                <span className="text-sm text-gray-500">Jurisdiction</span>
                                <span className="text-sm font-medium text-gray-900">{formData.county}</span>
                            </div>
                        </div>

                        <div className="pt-6 flex justify-between">
                            <button onClick={prevStep} className="btn btn-ghost">Back</button>
                            <button onClick={handleSave} className="btn btn-primary">
                                Create Case File
                            </button>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}
