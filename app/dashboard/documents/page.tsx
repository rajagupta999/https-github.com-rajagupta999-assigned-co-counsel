"use client";

import { useState, useCallback } from 'react';
import Link from 'next/link';
import { 
    scanDocument, 
    processDocumentForResearchPool, 
    ScanResult, 
    PHIMatch,
    RedactionStyle,
    redactPHI
} from '@/lib/phiDetection';

export default function DocumentsPage() {
    const [uploadedText, setUploadedText] = useState('');
    const [scanResult, setScanResult] = useState<ScanResult | null>(null);
    const [isScanning, setIsScanning] = useState(false);
    const [redactionStyle, setRedactionStyle] = useState<RedactionStyle>('placeholder');
    const [showOriginal, setShowOriginal] = useState(false);
    const [addedToPool, setAddedToPool] = useState(false);

    const handleScan = useCallback(async () => {
        if (!uploadedText.trim()) return;
        
        setIsScanning(true);
        setAddedToPool(false);
        
        // Simulate processing delay
        await new Promise(resolve => setTimeout(resolve, 800));
        
        const result = scanDocument(`doc_${Date.now()}`, uploadedText);
        setScanResult(result);
        setIsScanning(false);
    }, [uploadedText]);

    const handleAddToResearchPool = async () => {
        if (!scanResult) return;
        
        const result = await processDocumentForResearchPool(
            scanResult.documentId,
            scanResult.originalText,
            true // auto-redact
        );
        
        if (result.addedToResearchPool) {
            setAddedToPool(true);
        }
    };

    const getRiskBadge = (risk: ScanResult['riskLevel']) => {
        const styles = {
            none: 'bg-emerald-100 text-emerald-700 border-emerald-200',
            low: 'bg-blue-100 text-blue-700 border-blue-200',
            medium: 'bg-amber-100 text-amber-700 border-amber-200',
            high: 'bg-orange-100 text-orange-700 border-orange-200',
            critical: 'bg-red-100 text-red-700 border-red-200',
        };
        return styles[risk];
    };

    const getHighlightedText = (text: string, matches: PHIMatch[]) => {
        if (matches.length === 0) return text;
        
        let result = [];
        let lastIndex = 0;
        
        const sortedMatches = [...matches].sort((a, b) => a.startIndex - b.startIndex);
        
        for (const match of sortedMatches) {
            // Add text before match
            if (match.startIndex > lastIndex) {
                result.push(text.substring(lastIndex, match.startIndex));
            }
            // Add highlighted match
            result.push(
                `<mark class="bg-red-200 text-red-900 px-0.5 rounded" title="${match.type}">${text.substring(match.startIndex, match.endIndex)}</mark>`
            );
            lastIndex = match.endIndex;
        }
        // Add remaining text
        if (lastIndex < text.length) {
            result.push(text.substring(lastIndex));
        }
        
        return result.join('');
    };

    const sampleDocument = `CONFIDENTIAL LEGAL MEMORANDUM

Re: People v. John Smith
Case No: 2025-CR-001234
Date: 01/15/2025

Client Information:
Name: John Michael Smith
DOB: 03/22/1985
SSN: 123-45-6789
Address: 450 West 42nd Street, Apt 12B, New York, NY 10036
Phone: (212) 555-0147
Email: johnsmith@email.com

Medical Records Summary:
Patient was evaluated at Bellevue Hospital (MRN: BH-789456123) on 12/15/2024. 
Dr. Sarah Johnson conducted a psychiatric evaluation. Patient has a history of 
treatment at NYC Health + Hospitals with Member ID: MCD-98765432.

The defendant's mental health history is relevant to competency proceedings...`;

    return (
        <div className="p-4 sm:p-6 lg:p-8 max-w-6xl mx-auto animate-fade-in">
            {/* Header */}
            <div className="mb-6">
                <h1 className="text-xl sm:text-2xl font-bold text-slate-900 tracking-tight">Document Upload & PHI Scanner</h1>
                <p className="text-slate-400 text-sm mt-1">
                    Upload documents for the research pool. PHI is automatically detected and redacted for HIPAA compliance.
                </p>
            </div>

            {/* Info Banner */}
            <div className="bg-navy-50 border border-navy-200 rounded-xl p-4 mb-6 flex items-start gap-3">
                <div className="w-8 h-8 bg-navy-100 rounded-lg flex items-center justify-center flex-shrink-0">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#1e3a5f" strokeWidth="2">
                        <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>
                    </svg>
                </div>
                <div>
                    <h3 className="font-semibold text-sm text-navy-900">Safe Harbor De-identification</h3>
                    <p className="text-sm text-navy-700 mt-0.5">
                        Documents are scanned for all 18 HIPAA identifiers before entering the research pool. 
                        Detected PHI is automatically redacted to ensure compliance with 45 CFR § 164.514(b)(2).
                    </p>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Upload Section */}
                <div className="space-y-4">
                    <div className="bg-white rounded-xl border border-slate-200 overflow-hidden">
                        <div className="px-4 py-3 border-b border-slate-100 bg-slate-50 flex items-center justify-between">
                            <h3 className="font-semibold text-sm text-slate-800">Document Input</h3>
                            <button
                                onClick={() => setUploadedText(sampleDocument)}
                                className="text-xs text-navy-700 hover:text-navy-900 font-medium"
                            >
                                Load Sample
                            </button>
                        </div>
                        <div className="p-4">
                            <textarea
                                value={uploadedText}
                                onChange={(e) => setUploadedText(e.target.value)}
                                placeholder="Paste document text here for PHI scanning..."
                                className="w-full h-64 p-3 text-sm border border-slate-200 rounded-lg resize-none focus:outline-none focus:ring-2 focus:ring-navy-500/20 focus:border-navy-300 font-mono"
                            />
                            <div className="flex items-center justify-between mt-3">
                                <span className="text-xs text-slate-400">
                                    {uploadedText.length} characters
                                </span>
                                <button
                                    onClick={handleScan}
                                    disabled={!uploadedText.trim() || isScanning}
                                    className="px-4 py-2 bg-navy-800 hover:bg-navy-900 text-white text-sm font-semibold rounded-lg disabled:opacity-50 flex items-center gap-2"
                                >
                                    {isScanning ? (
                                        <>
                                            <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"/>
                                            Scanning...
                                        </>
                                    ) : (
                                        <>
                                            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                                <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>
                                            </svg>
                                            Scan for PHI
                                        </>
                                    )}
                                </button>
                            </div>
                        </div>
                    </div>

                    {/* Redaction Options */}
                    {scanResult && scanResult.phiCount > 0 && (
                        <div className="bg-white rounded-xl border border-slate-200 p-4">
                            <h4 className="font-semibold text-sm text-slate-800 mb-3">Redaction Style</h4>
                            <div className="flex flex-wrap gap-2">
                                {(['placeholder', 'full', 'partial', 'hash'] as RedactionStyle[]).map(style => (
                                    <button
                                        key={style}
                                        onClick={() => setRedactionStyle(style)}
                                        className={`px-3 py-1.5 text-xs font-medium rounded-lg border transition-colors ${
                                            redactionStyle === style
                                                ? 'bg-navy-800 text-white border-navy-800'
                                                : 'bg-white text-slate-600 border-slate-200 hover:border-slate-300'
                                        }`}
                                    >
                                        {style.charAt(0).toUpperCase() + style.slice(1)}
                                    </button>
                                ))}
                            </div>
                            <p className="text-xs text-slate-400 mt-2">
                                {redactionStyle === 'placeholder' && 'Replaces PHI with descriptive placeholders like [REDACTED NAME]'}
                                {redactionStyle === 'full' && 'Replaces PHI with solid blocks █████'}
                                {redactionStyle === 'partial' && 'Shows first and last character: J████n'}
                                {redactionStyle === 'hash' && 'Replaces with consistent hash for cross-reference'}
                            </p>
                        </div>
                    )}
                </div>

                {/* Results Section */}
                <div className="space-y-4">
                    {scanResult ? (
                        <>
                            {/* Risk Summary */}
                            <div className={`rounded-xl border-2 p-4 ${
                                scanResult.riskLevel === 'none' 
                                    ? 'bg-emerald-50 border-emerald-200' 
                                    : scanResult.riskLevel === 'critical'
                                    ? 'bg-red-50 border-red-200'
                                    : 'bg-amber-50 border-amber-200'
                            }`}>
                                <div className="flex items-center justify-between mb-2">
                                    <h3 className="font-semibold text-slate-900">Scan Results</h3>
                                    <span className={`text-xs font-bold px-2 py-1 rounded-full border ${getRiskBadge(scanResult.riskLevel)}`}>
                                        {scanResult.riskLevel.toUpperCase()} RISK
                                    </span>
                                </div>
                                <div className="grid grid-cols-2 gap-4 mt-3">
                                    <div>
                                        <p className="text-2xl font-bold text-slate-900">{scanResult.phiCount}</p>
                                        <p className="text-xs text-slate-500">PHI instances found</p>
                                    </div>
                                    <div>
                                        <p className="text-2xl font-bold text-slate-900">
                                            {new Set(scanResult.phiFound.map(m => m.type)).size}
                                        </p>
                                        <p className="text-xs text-slate-500">PHI categories</p>
                                    </div>
                                </div>
                                
                                {scanResult.phiCount === 0 ? (
                                    <div className="mt-3 flex items-center gap-2 text-emerald-700">
                                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                                            <polyline points="20 6 9 17 4 12"/>
                                        </svg>
                                        <span className="text-sm font-medium">Safe for research pool</span>
                                    </div>
                                ) : (
                                    <div className="mt-3">
                                        {!addedToPool ? (
                                            <button
                                                onClick={handleAddToResearchPool}
                                                className="w-full py-2 bg-white border border-slate-200 rounded-lg text-sm font-semibold text-slate-700 hover:bg-slate-50"
                                            >
                                                Add Redacted Version to Research Pool
                                            </button>
                                        ) : (
                                            <div className="flex items-center gap-2 text-emerald-700 justify-center py-2">
                                                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                                                    <polyline points="20 6 9 17 4 12"/>
                                                </svg>
                                                <span className="text-sm font-medium">Added to research pool (redacted)</span>
                                            </div>
                                        )}
                                    </div>
                                )}
                            </div>

                            {/* PHI Found List */}
                            {scanResult.phiCount > 0 && (
                                <div className="bg-white rounded-xl border border-slate-200 overflow-hidden">
                                    <div className="px-4 py-3 border-b border-slate-100 bg-slate-50">
                                        <h3 className="font-semibold text-sm text-slate-800">Detected PHI</h3>
                                    </div>
                                    <div className="max-h-48 overflow-y-auto divide-y divide-slate-100">
                                        {scanResult.phiFound.map((match, i) => (
                                            <div key={i} className="px-4 py-2 flex items-center justify-between">
                                                <div>
                                                    <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded ${
                                                        match.confidence === 'high' ? 'bg-red-100 text-red-700' :
                                                        match.confidence === 'medium' ? 'bg-amber-100 text-amber-700' :
                                                        'bg-slate-100 text-slate-600'
                                                    }`}>
                                                        {match.type}
                                                    </span>
                                                    <p className="text-xs text-slate-500 mt-0.5 font-mono truncate max-w-[200px]">
                                                        {match.value}
                                                    </p>
                                                </div>
                                                <span className="text-[10px] text-slate-400">
                                                    {match.confidence}
                                                </span>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            )}

                            {/* Preview */}
                            <div className="bg-white rounded-xl border border-slate-200 overflow-hidden">
                                <div className="px-4 py-3 border-b border-slate-100 bg-slate-50 flex items-center justify-between">
                                    <h3 className="font-semibold text-sm text-slate-800">
                                        {showOriginal ? 'Original (PHI Highlighted)' : 'Redacted Preview'}
                                    </h3>
                                    <button
                                        onClick={() => setShowOriginal(!showOriginal)}
                                        className="text-xs text-navy-700 hover:text-navy-900 font-medium"
                                    >
                                        {showOriginal ? 'Show Redacted' : 'Show Original'}
                                    </button>
                                </div>
                                <div className="p-4 max-h-64 overflow-y-auto">
                                    {showOriginal ? (
                                        <pre 
                                            className="text-xs font-mono whitespace-pre-wrap text-slate-700"
                                            dangerouslySetInnerHTML={{ 
                                                __html: getHighlightedText(scanResult.originalText, scanResult.phiFound) 
                                            }}
                                        />
                                    ) : (
                                        <pre className="text-xs font-mono whitespace-pre-wrap text-slate-700">
                                            {redactPHI(scanResult.originalText, scanResult.phiFound, redactionStyle)}
                                        </pre>
                                    )}
                                </div>
                            </div>
                        </>
                    ) : (
                        <div className="bg-white rounded-xl border border-slate-200 p-8 text-center">
                            <div className="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-4">
                                <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#94a3b8" strokeWidth="1.5">
                                    <path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z"/>
                                    <polyline points="14 2 14 8 20 8"/>
                                    <path d="M12 18v-6M9 15l3 3 3-3"/>
                                </svg>
                            </div>
                            <p className="text-slate-500 font-medium">No document scanned</p>
                            <p className="text-sm text-slate-400 mt-1">
                                Paste a document and click "Scan for PHI" to begin
                            </p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
