/**
 * Attorney-Client Privilege & Work Product Protection System
 * 
 * Prevents privileged communications and work product from:
 * - Entering open-source research pools
 * - Being used for AI training
 * - Inadvertent disclosure that could waive privilege
 * 
 * References:
 * - ABA Model Rule 1.6 (Confidentiality)
 * - FRCP 26(b)(3) (Work Product)
 * - Upjohn Co. v. United States, 449 U.S. 383 (1981)
 */

// ============================================
// PRIVILEGE CLASSIFICATION TYPES
// ============================================

export type PrivilegeType = 
    | 'ATTORNEY_CLIENT'      // Direct attorney-client communications
    | 'WORK_PRODUCT_FACT'    // Factual work product (lower protection)
    | 'WORK_PRODUCT_OPINION' // Mental impressions, strategies (highest protection)
    | 'JOINT_DEFENSE'        // Communications under joint defense agreement
    | 'COMMON_INTEREST'      // Shared interest privilege
    | 'NONE'                 // Not privileged
    | 'NEEDS_REVIEW';        // Requires manual attorney review

export type DocumentType = 
    | 'EMAIL'
    | 'MEMO'
    | 'LETTER'
    | 'DRAFT_MOTION'
    | 'DRAFT_BRIEF'
    | 'CASE_NOTES'
    | 'STRATEGY_MEMO'
    | 'CLIENT_INTERVIEW'
    | 'RESEARCH_MEMO'
    | 'DISCOVERY_RESPONSE'
    | 'THIRD_PARTY_COMM'
    | 'COURT_FILING'
    | 'OTHER';

export interface PrivilegeClassification {
    privilegeType: PrivilegeType;
    confidence: 'high' | 'medium' | 'low';
    reasons: string[];
    documentType: DocumentType;
    canShareExternally: boolean;
    canUseForAI: boolean;
    canAddToResearchPool: boolean;
    requiresPrivilegeLog: boolean;
    waiverRisk: 'none' | 'low' | 'medium' | 'high';
}

export interface PrivilegeLogEntry {
    id: string;
    documentId: string;
    caseId: string;
    caseName: string;
    batesNumber?: string;
    date: string;
    from: string;
    to: string[];
    cc?: string[];
    subject?: string;
    documentType: DocumentType;
    privilegeType: PrivilegeType;
    privilegeDescription: string;
    createdAt: string;
    createdBy: string;
}

// ============================================
// PRIVILEGE DETECTION PATTERNS
// ============================================

const PRIVILEGE_INDICATORS = {
    // Strong indicators of attorney-client privilege
    ATTORNEY_CLIENT_STRONG: [
        /\b(?:attorney[- ]client|privileged|confidential)\s+(?:communication|privilege|and\s+confidential)/gi,
        /\bprivileged\s+and\s+confidential\b/gi,
        /\bfor\s+(?:legal\s+)?advice\s+(?:purposes?\s+)?only\b/gi,
        /\bseeking\s+(?:legal\s+)?(?:advice|counsel|opinion)\b/gi,
        /\bproviding\s+(?:legal\s+)?(?:advice|counsel|opinion)\b/gi,
        /\bdo\s+not\s+(?:forward|share|disclose|distribute)\b/gi,
        /\bconfidential\s+(?:legal\s+)?communication\b/gi,
    ],

    // Work product indicators
    WORK_PRODUCT_STRONG: [
        /\b(?:draft|preliminary)\s+(?:motion|brief|memo|memorandum|strategy)\b/gi,
        /\bwork\s+product\b/gi,
        /\battorney\s+(?:work\s+product|notes|impressions)\b/gi,
        /\bmental\s+impressions?\b/gi,
        /\blegal\s+(?:analysis|strategy|theory|theories|assessment)\b/gi,
        /\bcase\s+(?:strategy|theory|analysis|assessment|evaluation)\b/gi,
        /\bprepared\s+in\s+anticipation\s+of\s+litigation\b/gi,
        /\btrial\s+(?:strategy|preparation|prep)\b/gi,
    ],

    // Opinion work product (highest protection)
    OPINION_WORK_PRODUCT: [
        /\b(?:my|our)\s+(?:view|opinion|assessment|analysis|thinking|thoughts?)\s+(?:is|are|on)\b/gi,
        /\bi\s+(?:think|believe|recommend|suggest|advise)\b/gi,
        /\bstrateg(?:y|ic|ically)\b/gi,
        /\bweakness(?:es)?\s+(?:in|of)\s+(?:our|the|their)\s+(?:case|position|argument)\b/gi,
        /\bstrength(?:s)?\s+(?:in|of)\s+(?:our|the|their)\s+(?:case|position|argument)\b/gi,
        /\blikelihood\s+of\s+(?:success|winning|prevailing)\b/gi,
        /\brecommend(?:ation|ed|ing)?\b/gi,
    ],

    // Client communication indicators
    CLIENT_COMMUNICATION: [
        /\bdear\s+(?:mr\.|mrs\.|ms\.|client)\b/gi,
        /\bto:\s*(?:client|.*@(?!.*(?:law|legal|attorney|counsel)))/gi,
        /\bclient\s+(?:meeting|call|interview|consultation)\b/gi,
        /\bper\s+(?:our|your)\s+(?:conversation|discussion|meeting)\b/gi,
        /\bfollowing\s+up\s+on\s+(?:our|your)\b/gi,
    ],

    // Joint defense / common interest
    JOINT_DEFENSE: [
        /\bjoint\s+defense\s+(?:agreement|privilege|communication)\b/gi,
        /\bcommon\s+interest\s+(?:agreement|privilege|doctrine)\b/gi,
        /\bco-?defendant(?:s)?\b/gi,
        /\bshared\s+(?:defense|legal)\s+interest\b/gi,
    ],

    // Waiver risk indicators
    WAIVER_RISK: [
        /\bforward(?:ed|ing)?\s+to\s+(?:third\s+party|outside|external)\b/gi,
        /\bcc(?:'d|ed)?:?\s+.*(?:@(?!.*(?:law|legal|attorney|counsel)))/gi,
        /\bshare(?:d|ing)?\s+with\s+(?:opposing|other\s+side|third)\b/gi,
        /\bpublic(?:ly)?\s+(?:disclose|file|available)\b/gi,
    ],
};

// ============================================
// PRIVILEGE DETECTION ENGINE
// ============================================

export function detectPrivilege(
    text: string, 
    metadata?: {
        from?: string;
        to?: string[];
        subject?: string;
        documentType?: DocumentType;
    }
): PrivilegeClassification {
    const reasons: string[] = [];
    let privilegeType: PrivilegeType = 'NONE';
    let confidence: 'high' | 'medium' | 'low' = 'low';
    let waiverRisk: PrivilegeClassification['waiverRisk'] = 'none';

    // Check for explicit privilege markings
    const hasExplicitMarking = PRIVILEGE_INDICATORS.ATTORNEY_CLIENT_STRONG.some(p => p.test(text));
    if (hasExplicitMarking) {
        privilegeType = 'ATTORNEY_CLIENT';
        confidence = 'high';
        reasons.push('Contains explicit privilege marking');
    }

    // Check for work product indicators
    const hasWorkProduct = PRIVILEGE_INDICATORS.WORK_PRODUCT_STRONG.some(p => p.test(text));
    const hasOpinionWorkProduct = PRIVILEGE_INDICATORS.OPINION_WORK_PRODUCT.some(p => p.test(text));
    
    if (hasOpinionWorkProduct) {
        privilegeType = 'WORK_PRODUCT_OPINION';
        confidence = 'high';
        reasons.push('Contains attorney mental impressions or strategy');
    } else if (hasWorkProduct) {
        privilegeType = privilegeType === 'NONE' ? 'WORK_PRODUCT_FACT' : privilegeType;
        if (confidence === 'low') confidence = 'medium';
        reasons.push('Contains work product indicators');
    }

    // Check for client communication
    const hasClientComm = PRIVILEGE_INDICATORS.CLIENT_COMMUNICATION.some(p => p.test(text));
    if (hasClientComm && privilegeType === 'NONE') {
        privilegeType = 'ATTORNEY_CLIENT';
        confidence = 'medium';
        reasons.push('Appears to be client communication');
    }

    // Check for joint defense
    const hasJointDefense = PRIVILEGE_INDICATORS.JOINT_DEFENSE.some(p => p.test(text));
    if (hasJointDefense) {
        if (privilegeType === 'NONE') {
            privilegeType = 'JOINT_DEFENSE';
            confidence = 'medium';
        }
        reasons.push('References joint defense or common interest');
    }

    // Check for waiver risks
    const hasWaiverRisk = PRIVILEGE_INDICATORS.WAIVER_RISK.some(p => p.test(text));
    if (hasWaiverRisk) {
        waiverRisk = privilegeType !== 'NONE' ? 'high' : 'low';
        reasons.push('⚠️ Contains potential privilege waiver indicators');
    }

    // Document type inference
    let documentType: DocumentType = metadata?.documentType || 'OTHER';
    if (!metadata?.documentType) {
        if (/\bdraft\s+motion/i.test(text)) documentType = 'DRAFT_MOTION';
        else if (/\bdraft\s+brief/i.test(text)) documentType = 'DRAFT_BRIEF';
        else if (/\bmemorandum|memo\b/i.test(text)) documentType = 'MEMO';
        else if (/\b(?:from|to|subject|cc):/i.test(text)) documentType = 'EMAIL';
        else if (/\bclient\s+(?:interview|meeting)/i.test(text)) documentType = 'CLIENT_INTERVIEW';
    }

    // If no privilege detected but sensitive document type
    if (privilegeType === 'NONE' && 
        ['DRAFT_MOTION', 'DRAFT_BRIEF', 'CASE_NOTES', 'STRATEGY_MEMO', 'CLIENT_INTERVIEW'].includes(documentType)) {
        privilegeType = 'NEEDS_REVIEW';
        confidence = 'low';
        reasons.push('Document type typically requires privilege review');
    }

    // Determine data sharing permissions
    const canShareExternally = privilegeType === 'NONE';
    const canUseForAI = privilegeType === 'NONE';
    const canAddToResearchPool = privilegeType === 'NONE';
    const requiresPrivilegeLog = privilegeType !== 'NONE' && privilegeType !== 'NEEDS_REVIEW';

    return {
        privilegeType,
        confidence,
        reasons,
        documentType,
        canShareExternally,
        canUseForAI,
        canAddToResearchPool,
        requiresPrivilegeLog,
        waiverRisk,
    };
}

// ============================================
// DATA ISOLATION CONTROLS
// ============================================

export interface DataIsolationResult {
    documentId: string;
    isPrivileged: boolean;
    isolationLevel: 'OPEN' | 'RESTRICTED' | 'CONFIDENTIAL' | 'HIGHLY_CONFIDENTIAL';
    allowedOperations: string[];
    blockedOperations: string[];
    warnings: string[];
}

export function enforceDataIsolation(
    documentId: string,
    classification: PrivilegeClassification
): DataIsolationResult {
    const warnings: string[] = [];
    let isolationLevel: DataIsolationResult['isolationLevel'] = 'OPEN';
    const allowedOperations: string[] = [];
    const blockedOperations: string[] = [];

    if (classification.privilegeType === 'NONE') {
        isolationLevel = 'OPEN';
        allowedOperations.push(
            'Add to research pool',
            'Use for AI training',
            'Share with co-counsel',
            'Export',
            'Print'
        );
    } else if (classification.privilegeType === 'WORK_PRODUCT_FACT') {
        isolationLevel = 'RESTRICTED';
        allowedOperations.push(
            'View within case',
            'Share with co-counsel on case',
            'Print with watermark'
        );
        blockedOperations.push(
            '❌ Add to research pool',
            '❌ Use for AI training',
            '❌ Share externally',
            '❌ Export without approval'
        );
        warnings.push('Work product - protected from discovery');
    } else if (classification.privilegeType === 'WORK_PRODUCT_OPINION') {
        isolationLevel = 'HIGHLY_CONFIDENTIAL';
        allowedOperations.push(
            'View within case (attorneys only)',
            'Print with watermark (attorneys only)'
        );
        blockedOperations.push(
            '❌ Add to research pool',
            '❌ Use for AI training',
            '❌ Share with anyone outside firm',
            '❌ Export',
            '❌ Forward via email'
        );
        warnings.push('Opinion work product - highest protection level');
        warnings.push('Contains attorney mental impressions');
    } else if (classification.privilegeType === 'ATTORNEY_CLIENT') {
        isolationLevel = 'CONFIDENTIAL';
        allowedOperations.push(
            'View within case',
            'Share with client',
            'Share with co-counsel on case'
        );
        blockedOperations.push(
            '❌ Add to research pool',
            '❌ Use for AI training', 
            '❌ Share with third parties',
            '❌ Forward without client consent'
        );
        warnings.push('Attorney-client privileged - do not disclose');
    } else if (classification.privilegeType === 'JOINT_DEFENSE') {
        isolationLevel = 'CONFIDENTIAL';
        allowedOperations.push(
            'View within case',
            'Share with joint defense members'
        );
        blockedOperations.push(
            '❌ Add to research pool',
            '❌ Use for AI training',
            '❌ Share outside joint defense group'
        );
        warnings.push('Joint defense privilege - verify JDA before sharing');
    }

    if (classification.waiverRisk === 'high') {
        warnings.push('⚠️ HIGH WAIVER RISK - Review before any action');
    }

    return {
        documentId,
        isPrivileged: classification.privilegeType !== 'NONE',
        isolationLevel,
        allowedOperations,
        blockedOperations,
        warnings,
    };
}

// ============================================
// AI/RESEARCH POOL SAFEGUARDS
// ============================================

export interface AIDataGate {
    allowed: boolean;
    reason: string;
    sanitizedContent?: string;
}

export function checkAIDataGate(
    content: string,
    classification: PrivilegeClassification
): AIDataGate {
    // BLOCK: Any privileged content
    if (classification.privilegeType !== 'NONE') {
        return {
            allowed: false,
            reason: `Blocked: ${classification.privilegeType.replace(/_/g, ' ')} - Cannot use privileged content for AI/research`,
        };
    }

    // BLOCK: Content with privilege markers even if classified as NONE
    const hasPrivilegeMarkers = PRIVILEGE_INDICATORS.ATTORNEY_CLIENT_STRONG.some(p => p.test(content)) ||
                                PRIVILEGE_INDICATORS.WORK_PRODUCT_STRONG.some(p => p.test(content));
    if (hasPrivilegeMarkers) {
        return {
            allowed: false,
            reason: 'Blocked: Contains privilege markers - requires manual review',
        };
    }

    // BLOCK: Specific client information
    const hasClientSpecifics = /\b(?:client|defendant|plaintiff):\s*[A-Z][a-z]+/i.test(content) ||
                               /\bcase\s+(?:no|number|#)\.?\s*:?\s*\d/i.test(content);
    if (hasClientSpecifics) {
        // Allow but sanitize
        const sanitized = content
            .replace(/\b(?:client|defendant|plaintiff):\s*[A-Z][a-z]+\s+[A-Z][a-z]+/gi, '[CLIENT NAME]')
            .replace(/\bcase\s+(?:no|number|#)\.?\s*:?\s*[\w-]+/gi, '[CASE NUMBER]');
        
        return {
            allowed: true,
            reason: 'Allowed with sanitization - client identifiers removed',
            sanitizedContent: sanitized,
        };
    }

    return {
        allowed: true,
        reason: 'Allowed: No privilege concerns detected',
    };
}

// ============================================
// PRIVILEGE LOG GENERATOR
// ============================================

const privilegeLog: PrivilegeLogEntry[] = [];

export function addToPrivilegeLog(entry: Omit<PrivilegeLogEntry, 'id' | 'createdAt'>): PrivilegeLogEntry {
    const newEntry: PrivilegeLogEntry = {
        ...entry,
        id: `priv_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
        createdAt: new Date().toISOString(),
    };
    privilegeLog.push(newEntry);
    return newEntry;
}

export function getPrivilegeLog(caseId?: string): PrivilegeLogEntry[] {
    if (caseId) {
        return privilegeLog.filter(e => e.caseId === caseId);
    }
    return [...privilegeLog];
}

export function generatePrivilegeLogExport(caseId: string): string {
    const entries = getPrivilegeLog(caseId);
    
    let csv = 'Bates Number,Date,From,To,CC,Subject,Document Type,Privilege Type,Description\n';
    
    for (const entry of entries) {
        csv += `"${entry.batesNumber || ''}","${entry.date}","${entry.from}","${entry.to.join('; ')}","${entry.cc?.join('; ') || ''}","${entry.subject || ''}","${entry.documentType}","${entry.privilegeType}","${entry.privilegeDescription}"\n`;
    }
    
    return csv;
}

// ============================================
// PRIVILEGE DESCRIPTIONS FOR LOG
// ============================================

export function getPrivilegeDescription(classification: PrivilegeClassification): string {
    switch (classification.privilegeType) {
        case 'ATTORNEY_CLIENT':
            return 'Confidential communication between attorney and client made for the purpose of seeking or providing legal advice.';
        case 'WORK_PRODUCT_FACT':
            return 'Document prepared by counsel in anticipation of litigation containing factual information.';
        case 'WORK_PRODUCT_OPINION':
            return 'Document prepared by counsel in anticipation of litigation containing mental impressions, conclusions, opinions, or legal theories of counsel.';
        case 'JOINT_DEFENSE':
            return 'Communication made pursuant to joint defense agreement among parties with common legal interest.';
        case 'COMMON_INTEREST':
            return 'Communication made pursuant to common interest doctrine among parties sharing legal interest.';
        default:
            return '';
    }
}
