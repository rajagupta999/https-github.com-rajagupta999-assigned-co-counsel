/**
 * PHI Detection and Redaction System
 * 
 * Implements automated detection and filtering of the 18 HIPAA identifiers
 * before documents enter shared research pools or knowledge bases.
 * 
 * Reference: 45 CFR § 164.514(b)(2) - Safe Harbor De-identification
 */

// ============================================
// PHI IDENTIFIER TYPES (18 HIPAA Categories)
// ============================================

export type PHIType = 
    | 'NAME'
    | 'GEOGRAPHIC'           // Addresses, zip codes
    | 'DATE'                 // DOB, admission dates, etc.
    | 'PHONE'
    | 'FAX'
    | 'EMAIL'
    | 'SSN'                  // Social Security Number
    | 'MRN'                  // Medical Record Number
    | 'HEALTH_PLAN_ID'
    | 'ACCOUNT_NUMBER'
    | 'LICENSE_NUMBER'       // Driver's license, etc.
    | 'VEHICLE_ID'           // VIN, license plate
    | 'DEVICE_ID'            // Medical device identifiers
    | 'URL'
    | 'IP_ADDRESS'
    | 'BIOMETRIC'
    | 'PHOTO'
    | 'OTHER_UNIQUE_ID';

export interface PHIMatch {
    type: PHIType;
    value: string;
    startIndex: number;
    endIndex: number;
    confidence: 'high' | 'medium' | 'low';
    context?: string;
}

export interface ScanResult {
    documentId: string;
    originalText: string;
    redactedText: string;
    phiFound: PHIMatch[];
    phiCount: number;
    riskLevel: 'none' | 'low' | 'medium' | 'high' | 'critical';
    isSafeForResearchPool: boolean;
    scanTimestamp: string;
}

// ============================================
// DETECTION PATTERNS
// ============================================

const PHI_PATTERNS: Record<PHIType, RegExp[]> = {
    // Names - common name patterns (simplified - production would use NER)
    NAME: [
        /\b(?:Mr\.|Mrs\.|Ms\.|Dr\.|Prof\.)\s+[A-Z][a-z]+\s+[A-Z][a-z]+\b/g,
        /\b(?:Patient|Client|Defendant|Plaintiff):\s*[A-Z][a-z]+\s+[A-Z][a-z]+\b/gi,
        /\bRe:\s*[A-Z][a-z]+\s+[A-Z][a-z]+\b/g,
    ],

    // Geographic - addresses, zip codes
    GEOGRAPHIC: [
        /\b\d{1,5}\s+(?:[A-Z][a-z]+\s?)+(?:Street|St|Avenue|Ave|Road|Rd|Boulevard|Blvd|Drive|Dr|Lane|Ln|Way|Court|Ct|Circle|Cir)\b\.?,?\s*(?:Apt|Suite|Unit|#)?\s*\d*\b/gi,
        /\b(?:New York|Brooklyn|Queens|Bronx|Manhattan|Staten Island),?\s*(?:NY|New York)\s*\d{5}(?:-\d{4})?\b/gi,
        /\b\d{5}(?:-\d{4})?\b/g, // Zip codes
    ],

    // Dates - DOB, medical dates
    DATE: [
        /\b(?:DOB|Date of Birth|Birth Date|D\.O\.B\.?):\s*\d{1,2}[\/\-]\d{1,2}[\/\-]\d{2,4}\b/gi,
        /\b(?:born|born on)\s+(?:January|February|March|April|May|June|July|August|September|October|November|December)\s+\d{1,2},?\s+\d{4}\b/gi,
        /\b\d{1,2}[\/\-]\d{1,2}[\/\-]\d{4}\b/g, // Generic dates
    ],

    // Phone numbers
    PHONE: [
        /\b(?:\+?1[-.\s]?)?\(?\d{3}\)?[-.\s]?\d{3}[-.\s]?\d{4}\b/g,
        /\b(?:Phone|Tel|Telephone|Cell|Mobile):\s*[\d\-\(\)\s\.]+\b/gi,
    ],

    // Fax numbers
    FAX: [
        /\b(?:Fax|Facsimile):\s*[\d\-\(\)\s\.]+\b/gi,
    ],

    // Email addresses
    EMAIL: [
        /\b[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Z|a-z]{2,}\b/g,
    ],

    // Social Security Numbers
    SSN: [
        /\b\d{3}[-\s]?\d{2}[-\s]?\d{4}\b/g,
        /\b(?:SSN|Social Security|SS#?):\s*\d{3}[-\s]?\d{2}[-\s]?\d{4}\b/gi,
    ],

    // Medical Record Numbers
    MRN: [
        /\b(?:MRN|Medical Record|Med Rec|Patient ID|Chart)[\s#:]*[A-Z0-9]{6,12}\b/gi,
        /\b(?:Case|File)[\s#:]*\d{4,10}\b/gi,
    ],

    // Health Plan IDs
    HEALTH_PLAN_ID: [
        /\b(?:Member ID|Subscriber ID|Policy|Insurance ID)[\s#:]*[A-Z0-9]{8,15}\b/gi,
        /\b(?:Medicaid|Medicare)[\s#:]*[A-Z0-9]{9,12}\b/gi,
    ],

    // Account Numbers
    ACCOUNT_NUMBER: [
        /\b(?:Account|Acct)[\s#:]*\d{8,17}\b/gi,
        /\b(?:Bank|Routing)[\s#:]*\d{9,17}\b/gi,
    ],

    // License Numbers
    LICENSE_NUMBER: [
        /\b(?:License|DL|Driver'?s? License)[\s#:]*[A-Z0-9]{5,15}\b/gi,
        /\b(?:Bar|Attorney)[\s#:]*\d{6,8}\b/gi,
    ],

    // Vehicle Identifiers
    VEHICLE_ID: [
        /\b(?:VIN|Vehicle ID)[\s#:]*[A-HJ-NPR-Z0-9]{17}\b/gi,
        /\b(?:Plate|License Plate)[\s#:]*[A-Z0-9]{5,8}\b/gi,
    ],

    // Device Identifiers
    DEVICE_ID: [
        /\b(?:Device|Serial|UDI)[\s#:]*[A-Z0-9]{10,20}\b/gi,
    ],

    // URLs
    URL: [
        /\bhttps?:\/\/[^\s<>"{}|\\^`\[\]]+\b/gi,
    ],

    // IP Addresses
    IP_ADDRESS: [
        /\b(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\b/g,
    ],

    // Biometric (keywords that suggest biometric data)
    BIOMETRIC: [
        /\b(?:fingerprint|retina|iris|voiceprint|facial recognition|DNA|genetic)\b/gi,
    ],

    // Photo references
    PHOTO: [
        /\b(?:photo|photograph|image|picture)\s+(?:of|showing)\s+[A-Z][a-z]+/gi,
        /\[(?:photo|image|picture)\]/gi,
    ],

    // Other unique identifiers
    OTHER_UNIQUE_ID: [
        /\b(?:ID|Identifier|Number)[\s#:]*[A-Z0-9]{6,15}\b/gi,
    ],
};

// ============================================
// DETECTION ENGINE
// ============================================

export function detectPHI(text: string): PHIMatch[] {
    const matches: PHIMatch[] = [];
    const seenRanges = new Set<string>();

    for (const [phiType, patterns] of Object.entries(PHI_PATTERNS)) {
        for (const pattern of patterns) {
            // Reset regex state
            pattern.lastIndex = 0;
            
            let match;
            while ((match = pattern.exec(text)) !== null) {
                const rangeKey = `${match.index}-${match.index + match[0].length}`;
                
                // Avoid duplicate matches
                if (!seenRanges.has(rangeKey)) {
                    seenRanges.add(rangeKey);
                    
                    // Get surrounding context
                    const contextStart = Math.max(0, match.index - 20);
                    const contextEnd = Math.min(text.length, match.index + match[0].length + 20);
                    const context = text.substring(contextStart, contextEnd);

                    matches.push({
                        type: phiType as PHIType,
                        value: match[0],
                        startIndex: match.index,
                        endIndex: match.index + match[0].length,
                        confidence: getConfidence(phiType as PHIType, match[0]),
                        context: `...${context}...`,
                    });
                }
            }
        }
    }

    // Sort by position
    return matches.sort((a, b) => a.startIndex - b.startIndex);
}

function getConfidence(type: PHIType, value: string): 'high' | 'medium' | 'low' {
    // High confidence patterns
    if (['SSN', 'EMAIL', 'PHONE', 'IP_ADDRESS'].includes(type)) {
        return 'high';
    }
    
    // Medium confidence if contains keywords
    if (value.toLowerCase().includes(':') || value.toLowerCase().includes('#')) {
        return 'medium';
    }
    
    return 'low';
}

// ============================================
// REDACTION ENGINE
// ============================================

export type RedactionStyle = 'full' | 'partial' | 'placeholder' | 'hash';

const REDACTION_PLACEHOLDERS: Record<PHIType, string> = {
    NAME: '[REDACTED NAME]',
    GEOGRAPHIC: '[REDACTED ADDRESS]',
    DATE: '[REDACTED DATE]',
    PHONE: '[REDACTED PHONE]',
    FAX: '[REDACTED FAX]',
    EMAIL: '[REDACTED EMAIL]',
    SSN: '[REDACTED SSN]',
    MRN: '[REDACTED MRN]',
    HEALTH_PLAN_ID: '[REDACTED HEALTH PLAN ID]',
    ACCOUNT_NUMBER: '[REDACTED ACCOUNT]',
    LICENSE_NUMBER: '[REDACTED LICENSE]',
    VEHICLE_ID: '[REDACTED VEHICLE ID]',
    DEVICE_ID: '[REDACTED DEVICE ID]',
    URL: '[REDACTED URL]',
    IP_ADDRESS: '[REDACTED IP]',
    BIOMETRIC: '[REDACTED BIOMETRIC]',
    PHOTO: '[REDACTED PHOTO]',
    OTHER_UNIQUE_ID: '[REDACTED ID]',
};

export function redactPHI(
    text: string, 
    matches: PHIMatch[], 
    style: RedactionStyle = 'placeholder'
): string {
    if (matches.length === 0) return text;

    // Sort matches by position (descending) to preserve indices
    const sortedMatches = [...matches].sort((a, b) => b.startIndex - a.startIndex);
    
    let redactedText = text;
    
    for (const match of sortedMatches) {
        let replacement: string;
        
        switch (style) {
            case 'full':
                replacement = '█'.repeat(match.value.length);
                break;
            case 'partial':
                // Show first and last character
                if (match.value.length > 4) {
                    replacement = match.value[0] + '█'.repeat(match.value.length - 2) + match.value[match.value.length - 1];
                } else {
                    replacement = '█'.repeat(match.value.length);
                }
                break;
            case 'hash':
                // Consistent hash for same values
                replacement = `[HASH:${hashString(match.value).substring(0, 8)}]`;
                break;
            case 'placeholder':
            default:
                replacement = REDACTION_PLACEHOLDERS[match.type];
                break;
        }
        
        redactedText = redactedText.substring(0, match.startIndex) + 
                       replacement + 
                       redactedText.substring(match.endIndex);
    }
    
    return redactedText;
}

function hashString(str: string): string {
    let hash = 0;
    for (let i = 0; i < str.length; i++) {
        const char = str.charCodeAt(i);
        hash = ((hash << 5) - hash) + char;
        hash = hash & hash;
    }
    return Math.abs(hash).toString(16);
}

// ============================================
// DOCUMENT SCANNER
// ============================================

export function scanDocument(documentId: string, text: string): ScanResult {
    const phiMatches = detectPHI(text);
    const redactedText = redactPHI(text, phiMatches);
    
    // Calculate risk level
    let riskLevel: ScanResult['riskLevel'] = 'none';
    const highConfidenceCount = phiMatches.filter(m => m.confidence === 'high').length;
    const totalCount = phiMatches.length;
    
    if (totalCount === 0) {
        riskLevel = 'none';
    } else if (highConfidenceCount >= 5 || totalCount >= 10) {
        riskLevel = 'critical';
    } else if (highConfidenceCount >= 2 || totalCount >= 5) {
        riskLevel = 'high';
    } else if (highConfidenceCount >= 1 || totalCount >= 3) {
        riskLevel = 'medium';
    } else {
        riskLevel = 'low';
    }

    return {
        documentId,
        originalText: text,
        redactedText,
        phiFound: phiMatches,
        phiCount: totalCount,
        riskLevel,
        isSafeForResearchPool: totalCount === 0 || riskLevel === 'none',
        scanTimestamp: new Date().toISOString(),
    };
}

// ============================================
// SAFE HARBOR DE-IDENTIFICATION CHECK
// ============================================

export function checkSafeHarborCompliance(scanResult: ScanResult): {
    compliant: boolean;
    issues: string[];
    recommendation: string;
} {
    const issues: string[] = [];
    
    // Check each PHI category
    const phiTypes = new Set(scanResult.phiFound.map(m => m.type));
    
    if (phiTypes.has('NAME')) issues.push('Contains identifiable names');
    if (phiTypes.has('SSN')) issues.push('Contains Social Security Numbers');
    if (phiTypes.has('GEOGRAPHIC')) issues.push('Contains geographic identifiers');
    if (phiTypes.has('DATE')) issues.push('Contains specific dates');
    if (phiTypes.has('PHONE') || phiTypes.has('FAX')) issues.push('Contains contact numbers');
    if (phiTypes.has('EMAIL')) issues.push('Contains email addresses');
    if (phiTypes.has('MRN') || phiTypes.has('HEALTH_PLAN_ID')) issues.push('Contains medical identifiers');
    
    const compliant = issues.length === 0;
    
    let recommendation: string;
    if (compliant) {
        recommendation = 'Document meets Safe Harbor de-identification standards and can be added to the research pool.';
    } else if (issues.length <= 2) {
        recommendation = 'Apply automatic redaction and review before adding to research pool.';
    } else {
        recommendation = 'Document contains significant PHI. Manual review required before sharing.';
    }

    return { compliant, issues, recommendation };
}

// ============================================
// EXPORT TYPES FOR UI
// ============================================

export interface DocumentUploadResult {
    success: boolean;
    scanResult: ScanResult;
    safeHarborCheck: ReturnType<typeof checkSafeHarborCompliance>;
    addedToResearchPool: boolean;
    redactedVersion?: string;
}

export async function processDocumentForResearchPool(
    documentId: string,
    text: string,
    autoRedact: boolean = true
): Promise<DocumentUploadResult> {
    // Scan for PHI
    const scanResult = scanDocument(documentId, text);
    
    // Check Safe Harbor compliance
    const safeHarborCheck = checkSafeHarborCompliance(scanResult);
    
    // Determine if we can add to research pool
    let addedToResearchPool = false;
    let finalText = text;
    
    if (safeHarborCheck.compliant) {
        // No PHI found - safe to add
        addedToResearchPool = true;
    } else if (autoRedact && scanResult.riskLevel !== 'critical') {
        // Auto-redact and add redacted version
        finalText = scanResult.redactedText;
        addedToResearchPool = true;
    }
    // If critical risk, require manual review
    
    return {
        success: true,
        scanResult,
        safeHarborCheck,
        addedToResearchPool,
        redactedVersion: addedToResearchPool ? finalText : undefined,
    };
}
