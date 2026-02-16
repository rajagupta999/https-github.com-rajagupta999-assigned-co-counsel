"use client";

import { useState, useCallback } from 'react';
import { 
    detectPrivilege, 
    enforceDataIsolation, 
    checkAIDataGate,
    addToPrivilegeLog,
    getPrivilegeLog,
    getPrivilegeDescription,
    PrivilegeClassification,
    DataIsolationResult,
    AIDataGate,
    PrivilegeLogEntry,
    PrivilegeType,
} from '@/lib/privilegeProtection';

export default function PrivilegePage() {
    const [inputText, setInputText] = useState('');
    const [classification, setClassification] = useState<PrivilegeClassification | null>(null);
    const [isolation, setIsolation] = useState<DataIsolationResult | null>(null);
    const [aiGate, setAiGate] = useState<AIDataGate | null>(null);
    const [isAnalyzing, setIsAnalyzing] = useState(false);
    const [privilegeLog, setPrivilegeLogState] = useState<PrivilegeLogEntry[]>([]);
    const [activeTab, setActiveTab] = useState<'analyze' | 'log'>('analyze');

    const handleAnalyze = useCallback(async () => {
        if (!inputText.trim()) return;
        
        setIsAnalyzing(true);
        await new Promise(resolve => setTimeout(resolve, 600));
        
        const result = detectPrivilege(inputText);
        const isolationResult = enforceDataIsolation(`doc_${Date.now()}`, result);
        const aiGateResult = checkAIDataGate(inputText, result);
        
        setClassification(result);
        setIsolation(isolationResult);
        setAiGate(aiGateResult);
        setIsAnalyzing(false);
        
        // Auto-add to privilege log if privileged
        if (result.requiresPrivilegeLog) {
            const entry = addToPrivilegeLog({
                documentId: isolationResult.documentId,
                caseId: 'CASE-2025-001',
                caseName: 'People v. Johnson',
                date: new Date().toLocaleDateString(),
                from: 'Attorney',
                to: ['Client'],
                documentType: result.documentType,
                privilegeType: result.privilegeType,
                privilegeDescription: getPrivilegeDescription(result),
                createdBy: 'Raja',
            });
            setPrivilegeLogState(getPrivilegeLog());
        }
    }, [inputText]);

    const getPrivilegeBadge = (type: PrivilegeType) => {
        const styles: Record<PrivilegeType, string> = {
            'NONE': 'bg-emerald-100 text-emerald-700 border-emerald-200',
            'ATTORNEY_CLIENT': 'bg-red-100 text-red-700 border-red-200',
            'WORK_PRODUCT_FACT': 'bg-amber-100 text-amber-700 border-amber-200',
            'WORK_PRODUCT_OPINION': 'bg-red-100 text-red-800 border-red-300',
            'JOINT_DEFENSE': 'bg-purple-100 text-purple-700 border-purple-200',
            'COMMON_INTEREST': 'bg-blue-100 text-blue-700 border-blue-200',
            'NEEDS_REVIEW': 'bg-slate-100 text-slate-700 border-slate-200',
        };
        return styles[type] || styles['NONE'];
    };

    const getIsolationBadge = (level: DataIsolationResult['isolationLevel']) => {
        const styles = {
            'OPEN': 'bg-emerald-100 text-emerald-700',
            'RESTRICTED': 'bg-amber-100 text-amber-700',
            'CONFIDENTIAL': 'bg-orange-100 text-orange-700',
            'HIGHLY_CONFIDENTIAL': 'bg-red-100 text-red-700',
        };
        return styles[level];
    };

    const samplePrivileged = `PRIVILEGED AND CONFIDENTIAL
ATTORNEY-CLIENT COMMUNICATION
ATTORNEY WORK PRODUCT

MEMORANDUM

To: Case File - People v. Johnson (Case No. 2025-CR-001234)
From: Raja, Esq.
Date: January 15, 2025
Re: Case Strategy and Legal Analysis

CONFIDENTIAL ASSESSMENT

After reviewing the discovery materials, my analysis is that we have several strong arguments for the motion to suppress. The weakness in the prosecution's case lies in the warrantless search of the vehicle.

RECOMMENDED STRATEGY:

1. File motion to suppress arguing Fourth Amendment violation
2. In my opinion, we have approximately 70% likelihood of success on the suppression motion
3. If suppression is granted, I believe the case will likely be dismissed

CLIENT MEETING NOTES:
Per our conversation on January 10th, client expressed concern about trial timeline. I advised him that based on my assessment of the evidence, proceeding with the suppression motion is our best strategic approach.

This document contains my mental impressions and legal theories prepared in anticipation of litigation.`;

    const sampleNonPrivileged = `LEGAL RESEARCH MEMO

Re: Fourth Amendment Search and Seizure Standards in New York

SUMMARY OF APPLICABLE LAW:

Under the Fourth Amendment, warrantless searches are presumptively unreasonable. However, several exceptions apply:

1. Search Incident to Arrest (Chimel v. California)
2. Automobile Exception (Carroll v. United States)
3. Plain View Doctrine
4. Consent Searches
5. Exigent Circumstances

NEW YORK STATE LAW:

CPL § 710.20 governs motions to suppress evidence. The defendant bears the initial burden of establishing standing, after which the burden shifts to the prosecution to demonstrate the legality of the police conduct.

RELEVANT CASE LAW:

- People v. De Bour, 40 N.Y.2d 210 (1976) - Four-tier analysis for street encounters
- People v. Hollman, 79 N.Y.2d 181 (1992) - Request for information standard

This is general legal research and does not contain case-specific strategy or client communications.`;

    return (
        <div className="p-4 sm:p-6 lg:p-8 max-w-6xl mx-auto animate-fade-in">
            {/* Header */}
            <div className="mb-6">
                <h1 className="text-xl sm:text-2xl font-bold text-slate-900 tracking-tight">Privilege Protection</h1>
                <p className="text-slate-400 text-sm mt-1">
                    Protect attorney-client privilege and work product from inadvertent disclosure
                </p>
            </div>

            {/* Warning Banner */}
            <div className="bg-red-50 border-2 border-red-200 rounded-xl p-4 mb-6 flex items-start gap-3">
                <div className="w-10 h-10 bg-red-100 rounded-lg flex items-center justify-center flex-shrink-0">
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#dc2626" strokeWidth="2">
                        <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>
                        <path d="M12 8v4M12 16h.01"/>
                    </svg>
                </div>
                <div>
                    <h3 className="font-semibold text-sm text-red-900">Privilege Protection Enabled</h3>
                    <p className="text-sm text-red-700 mt-0.5">
                        All documents are scanned before entering research pools or AI systems. 
                        Privileged content is automatically blocked to prevent inadvertent waiver.
                    </p>
                </div>
            </div>

            {/* Tabs */}
            <div className="flex gap-1 mb-6 border-b border-slate-200">
                {[
                    { id: 'analyze', label: 'Analyze Document' },
                    { id: 'log', label: `Privilege Log (${privilegeLog.length})` },
                ].map(tab => (
                    <button
                        key={tab.id}
                        onClick={() => setActiveTab(tab.id as typeof activeTab)}
                        className={`px-4 py-3 text-sm font-semibold border-b-2 transition-colors ${
                            activeTab === tab.id
                                ? 'text-navy-800 border-navy-800'
                                : 'text-slate-500 border-transparent hover:text-slate-700'
                        }`}
                    >
                        {tab.label}
                    </button>
                ))}
            </div>

            {activeTab === 'analyze' && (
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    {/* Input Section */}
                    <div className="space-y-4">
                        <div className="bg-white rounded-xl border border-slate-200 overflow-hidden">
                            <div className="px-4 py-3 border-b border-slate-100 bg-slate-50 flex items-center justify-between">
                                <h3 className="font-semibold text-sm text-slate-800">Document Input</h3>
                                <div className="flex gap-2">
                                    <button
                                        onClick={() => setInputText(samplePrivileged)}
                                        className="text-xs text-red-700 hover:text-red-900 font-medium"
                                    >
                                        Sample Privileged
                                    </button>
                                    <span className="text-slate-300">|</span>
                                    <button
                                        onClick={() => setInputText(sampleNonPrivileged)}
                                        className="text-xs text-emerald-700 hover:text-emerald-900 font-medium"
                                    >
                                        Sample Non-Privileged
                                    </button>
                                </div>
                            </div>
                            <div className="p-4">
                                <textarea
                                    value={inputText}
                                    onChange={(e) => setInputText(e.target.value)}
                                    placeholder="Paste document, email, or memo for privilege analysis..."
                                    className="w-full h-64 p-3 text-sm border border-slate-200 rounded-lg resize-none focus:outline-none focus:ring-2 focus:ring-navy-500/20 focus:border-navy-300 font-mono"
                                />
                                <div className="flex items-center justify-between mt-3">
                                    <span className="text-xs text-slate-400">
                                        {inputText.length} characters
                                    </span>
                                    <button
                                        onClick={handleAnalyze}
                                        disabled={!inputText.trim() || isAnalyzing}
                                        className="px-4 py-2 bg-navy-800 hover:bg-navy-900 text-white text-sm font-semibold rounded-lg disabled:opacity-50 flex items-center gap-2"
                                    >
                                        {isAnalyzing ? (
                                            <>
                                                <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"/>
                                                Analyzing...
                                            </>
                                        ) : (
                                            <>
                                                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                                    <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>
                                                </svg>
                                                Analyze Privilege
                                            </>
                                        )}
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Results Section */}
                    <div className="space-y-4">
                        {classification ? (
                            <>
                                {/* Classification Result */}
                                <div className={`rounded-xl border-2 p-4 ${
                                    classification.privilegeType === 'NONE' 
                                        ? 'bg-emerald-50 border-emerald-200' 
                                        : 'bg-red-50 border-red-200'
                                }`}>
                                    <div className="flex items-center justify-between mb-3">
                                        <h3 className="font-semibold text-slate-900">Classification</h3>
                                        <span className={`text-xs font-bold px-2 py-1 rounded-full border ${getPrivilegeBadge(classification.privilegeType)}`}>
                                            {classification.privilegeType.replace(/_/g, ' ')}
                                        </span>
                                    </div>
                                    
                                    <div className="space-y-2">
                                        {classification.reasons.map((reason, i) => (
                                            <div key={i} className="flex items-start gap-2 text-sm">
                                                <span className={classification.privilegeType === 'NONE' ? 'text-emerald-500' : 'text-red-500'}>
                                                    {classification.privilegeType === 'NONE' ? '✓' : '⚠'}
                                                </span>
                                                <span className="text-slate-700">{reason}</span>
                                            </div>
                                        ))}
                                    </div>

                                    {classification.waiverRisk !== 'none' && (
                                        <div className="mt-3 p-2 bg-amber-100 rounded-lg border border-amber-200">
                                            <p className="text-xs text-amber-800 font-semibold">
                                                ⚠️ Waiver Risk: {classification.waiverRisk.toUpperCase()}
                                            </p>
                                        </div>
                                    )}
                                </div>

                                {/* Data Isolation */}
                                {isolation && (
                                    <div className="bg-white rounded-xl border border-slate-200 p-4">
                                        <div className="flex items-center justify-between mb-3">
                                            <h3 className="font-semibold text-sm text-slate-800">Data Isolation</h3>
                                            <span className={`text-xs font-bold px-2 py-1 rounded-full ${getIsolationBadge(isolation.isolationLevel)}`}>
                                                {isolation.isolationLevel}
                                            </span>
                                        </div>
                                        
                                        {isolation.allowedOperations.length > 0 && (
                                            <div className="mb-3">
                                                <p className="text-xs text-slate-500 mb-1">Allowed:</p>
                                                <div className="flex flex-wrap gap-1">
                                                    {isolation.allowedOperations.map((op, i) => (
                                                        <span key={i} className="text-[10px] bg-emerald-50 text-emerald-700 px-2 py-0.5 rounded">
                                                            {op}
                                                        </span>
                                                    ))}
                                                </div>
                                            </div>
                                        )}
                                        
                                        {isolation.blockedOperations.length > 0 && (
                                            <div className="mb-3">
                                                <p className="text-xs text-slate-500 mb-1">Blocked:</p>
                                                <div className="flex flex-wrap gap-1">
                                                    {isolation.blockedOperations.map((op, i) => (
                                                        <span key={i} className="text-[10px] bg-red-50 text-red-700 px-2 py-0.5 rounded">
                                                            {op}
                                                        </span>
                                                    ))}
                                                </div>
                                            </div>
                                        )}

                                        {isolation.warnings.map((warning, i) => (
                                            <p key={i} className="text-xs text-amber-700 mt-2">
                                                {warning}
                                            </p>
                                        ))}
                                    </div>
                                )}

                                {/* AI/Research Gate */}
                                {aiGate && (
                                    <div className={`rounded-xl border p-4 ${
                                        aiGate.allowed 
                                            ? 'bg-emerald-50 border-emerald-200' 
                                            : 'bg-red-50 border-red-200'
                                    }`}>
                                        <div className="flex items-center gap-2 mb-2">
                                            {aiGate.allowed ? (
                                                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#059669" strokeWidth="2.5">
                                                    <polyline points="20 6 9 17 4 12"/>
                                                </svg>
                                            ) : (
                                                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#dc2626" strokeWidth="2.5">
                                                    <circle cx="12" cy="12" r="10"/>
                                                    <line x1="15" y1="9" x2="9" y2="15"/>
                                                    <line x1="9" y1="9" x2="15" y2="15"/>
                                                </svg>
                                            )}
                                            <h3 className={`font-semibold text-sm ${aiGate.allowed ? 'text-emerald-800' : 'text-red-800'}`}>
                                                AI/Research Pool: {aiGate.allowed ? 'ALLOWED' : 'BLOCKED'}
                                            </h3>
                                        </div>
                                        <p className={`text-sm ${aiGate.allowed ? 'text-emerald-700' : 'text-red-700'}`}>
                                            {aiGate.reason}
                                        </p>
                                        {aiGate.sanitizedContent && (
                                            <p className="text-xs text-emerald-600 mt-2">
                                                ✓ Content will be sanitized before use
                                            </p>
                                        )}
                                    </div>
                                )}
                            </>
                        ) : (
                            <div className="bg-white rounded-xl border border-slate-200 p-8 text-center">
                                <div className="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-4">
                                    <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#94a3b8" strokeWidth="1.5">
                                        <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>
                                    </svg>
                                </div>
                                <p className="text-slate-500 font-medium">No document analyzed</p>
                                <p className="text-sm text-slate-400 mt-1">
                                    Paste a document and click "Analyze Privilege"
                                </p>
                            </div>
                        )}
                    </div>
                </div>
            )}

            {activeTab === 'log' && (
                <div className="bg-white rounded-xl border border-slate-200 overflow-hidden">
                    <div className="px-4 sm:px-6 py-4 border-b border-slate-100 bg-slate-50 flex items-center justify-between">
                        <div>
                            <h3 className="font-semibold text-slate-800">Privilege Log</h3>
                            <p className="text-xs text-slate-400 mt-0.5">FRCP 26(b)(5) compliant log for discovery</p>
                        </div>
                        <button className="text-xs font-semibold text-navy-800 hover:text-navy-900 px-3 py-1.5 bg-navy-50 rounded-lg">
                            Export CSV
                        </button>
                    </div>
                    
                    {privilegeLog.length === 0 ? (
                        <div className="p-8 text-center text-slate-400">
                            <p className="text-sm">No privileged documents logged yet</p>
                            <p className="text-xs mt-1">Privileged documents are automatically added when analyzed</p>
                        </div>
                    ) : (
                        <div className="overflow-x-auto">
                            <table className="w-full text-sm">
                                <thead className="bg-slate-50 border-b border-slate-100">
                                    <tr>
                                        <th className="px-4 py-3 text-left text-[11px] font-semibold text-slate-400 uppercase">Date</th>
                                        <th className="px-4 py-3 text-left text-[11px] font-semibold text-slate-400 uppercase">From/To</th>
                                        <th className="px-4 py-3 text-left text-[11px] font-semibold text-slate-400 uppercase">Type</th>
                                        <th className="px-4 py-3 text-left text-[11px] font-semibold text-slate-400 uppercase">Privilege</th>
                                        <th className="px-4 py-3 text-left text-[11px] font-semibold text-slate-400 uppercase">Case</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-slate-100">
                                    {privilegeLog.map((entry) => (
                                        <tr key={entry.id} className="hover:bg-slate-50">
                                            <td className="px-4 py-3 text-slate-600">{entry.date}</td>
                                            <td className="px-4 py-3">
                                                <p className="font-medium text-slate-800">{entry.from}</p>
                                                <p className="text-xs text-slate-400">→ {entry.to.join(', ')}</p>
                                            </td>
                                            <td className="px-4 py-3">
                                                <span className="text-xs bg-slate-100 text-slate-600 px-2 py-0.5 rounded">
                                                    {entry.documentType}
                                                </span>
                                            </td>
                                            <td className="px-4 py-3">
                                                <span className={`text-xs px-2 py-0.5 rounded border ${getPrivilegeBadge(entry.privilegeType)}`}>
                                                    {entry.privilegeType.replace(/_/g, ' ')}
                                                </span>
                                            </td>
                                            <td className="px-4 py-3 text-slate-500">{entry.caseName}</td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    )}
                </div>
            )}
        </div>
    );
}
