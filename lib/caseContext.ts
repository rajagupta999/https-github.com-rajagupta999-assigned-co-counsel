/**
 * Case Context Service
 * Manages case memory and context injection for AI conversations
 */

import { db } from './firebase';
import { 
  collection, 
  doc, 
  addDoc, 
  updateDoc, 
  getDocs, 
  getDoc,
  query, 
  where, 
  orderBy,
  limit,
  Timestamp,
} from 'firebase/firestore';
import { searchDocuments } from './ragService';
import { getCaseDiscovery, getDiscoveryCompliance } from './discoveryTracker';
import { getCaseDocuments } from './documentVault';

// Case types
export type CaseType = 'criminal' | 'custody' | 'divorce' | 'family' | 'civil';

export interface CaseInfo {
  id: string;
  userId: string;
  caseType: CaseType;
  
  // Basic info
  title: string;
  docketNumber?: string;
  court?: string;
  judge?: string;
  nextCourtDate?: Date;
  status: 'active' | 'closed' | 'pending' | 'archived';
  
  // Client info
  clientName: string;
  clientDOB?: Date;
  clientContact?: string;
  clientAddress?: string;
  
  // Opposing party
  opposingParty?: string;
  opposingCounsel?: string;
  opposingCounselContact?: string;
  
  // Case specific
  charges?: CriminalCharge[];     // Criminal
  children?: ChildInfo[];          // Custody/Family
  assets?: AssetInfo[];            // Divorce
  
  // Key facts
  keyFacts: string[];
  caseStrategy?: string;
  
  // Dates
  arraignmentDate?: Date;         // Criminal
  filingDate?: Date;
  createdAt: Date;
  updatedAt: Date;
}

export interface CriminalCharge {
  statute: string;
  description: string;
  class: string;  // A felony, B felony, misdemeanor, etc.
  count: number;
  disposition?: string;
}

export interface ChildInfo {
  name: string;
  dob: Date;
  age: number;
  custodyStatus?: string;
  specialNeeds?: string;
}

export interface AssetInfo {
  description: string;
  type: 'real_property' | 'bank_account' | 'retirement' | 'vehicle' | 'business' | 'other';
  value?: number;
  maritalSeparate: 'marital' | 'separate' | 'disputed';
  notes?: string;
}

export interface Conversation {
  id: string;
  caseId?: string;
  userId: string;
  title?: string;
  messages: ConversationMessage[];
  summary?: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface ConversationMessage {
  role: 'user' | 'assistant' | 'system';
  content: string;
  timestamp: Date;
}

/**
 * Get case by ID
 */
export async function getCase(
  userId: string,
  caseId: string
): Promise<CaseInfo | null> {
  const docRef = doc(db, 'users', userId, 'cases', caseId);
  const snapshot = await getDoc(docRef);
  
  if (!snapshot.exists()) return null;
  
  const data = snapshot.data();
  return {
    id: snapshot.id,
    ...data,
    nextCourtDate: data.nextCourtDate?.toDate(),
    arraignmentDate: data.arraignmentDate?.toDate(),
    filingDate: data.filingDate?.toDate(),
    clientDOB: data.clientDOB?.toDate(),
    createdAt: data.createdAt?.toDate() || new Date(),
    updatedAt: data.updatedAt?.toDate() || new Date(),
    children: data.children?.map((c: any) => ({
      ...c,
      dob: c.dob?.toDate(),
    })),
  } as CaseInfo;
}

/**
 * Get all cases for a user
 */
export async function getUserCases(
  userId: string,
  status?: 'active' | 'closed' | 'pending' | 'archived'
): Promise<CaseInfo[]> {
  let q = query(
    collection(db, 'users', userId, 'cases'),
    orderBy('updatedAt', 'desc')
  );
  
  if (status) {
    q = query(
      collection(db, 'users', userId, 'cases'),
      where('status', '==', status),
      orderBy('updatedAt', 'desc')
    );
  }
  
  const snapshot = await getDocs(q);
  return snapshot.docs.map(d => {
    const data = d.data();
    return {
      id: d.id,
      ...data,
      nextCourtDate: data.nextCourtDate?.toDate(),
      arraignmentDate: data.arraignmentDate?.toDate(),
      filingDate: data.filingDate?.toDate(),
      clientDOB: data.clientDOB?.toDate(),
      createdAt: data.createdAt?.toDate() || new Date(),
      updatedAt: data.updatedAt?.toDate() || new Date(),
    } as CaseInfo;
  });
}

/**
 * Create a new case
 */
export async function createCase(
  userId: string,
  caseData: Omit<CaseInfo, 'id' | 'userId' | 'createdAt' | 'updatedAt'>
): Promise<CaseInfo> {
  const now = new Date();
  
  const firestoreData: Record<string, unknown> = {
    ...caseData,
    userId,
    createdAt: Timestamp.now(),
    updatedAt: Timestamp.now(),
  };
  
  // Convert dates
  if (caseData.nextCourtDate) {
    firestoreData.nextCourtDate = Timestamp.fromDate(caseData.nextCourtDate);
  }
  if (caseData.arraignmentDate) {
    firestoreData.arraignmentDate = Timestamp.fromDate(caseData.arraignmentDate);
  }
  if (caseData.filingDate) {
    firestoreData.filingDate = Timestamp.fromDate(caseData.filingDate);
  }
  if (caseData.clientDOB) {
    firestoreData.clientDOB = Timestamp.fromDate(caseData.clientDOB);
  }
  
  const docRef = await addDoc(
    collection(db, 'users', userId, 'cases'),
    firestoreData
  );
  
  return {
    id: docRef.id,
    userId,
    ...caseData,
    createdAt: now,
    updatedAt: now,
  };
}

/**
 * Update a case
 */
export async function updateCase(
  userId: string,
  caseId: string,
  updates: Partial<Omit<CaseInfo, 'id' | 'userId' | 'createdAt'>>
): Promise<void> {
  const docRef = doc(db, 'users', userId, 'cases', caseId);
  
  const firestoreUpdates: Record<string, unknown> = {
    ...updates,
    updatedAt: Timestamp.now(),
  };
  
  // Convert dates
  if (updates.nextCourtDate) {
    firestoreUpdates.nextCourtDate = Timestamp.fromDate(updates.nextCourtDate);
  }
  if (updates.arraignmentDate) {
    firestoreUpdates.arraignmentDate = Timestamp.fromDate(updates.arraignmentDate);
  }
  
  await updateDoc(docRef, firestoreUpdates);
}

/**
 * Save a conversation
 */
export async function saveConversation(
  userId: string,
  conversation: Omit<Conversation, 'id' | 'createdAt' | 'updatedAt'>
): Promise<string> {
  const docRef = await addDoc(
    collection(db, 'users', userId, 'conversations'),
    {
      ...conversation,
      messages: conversation.messages.map(m => ({
        ...m,
        timestamp: Timestamp.fromDate(m.timestamp),
      })),
      createdAt: Timestamp.now(),
      updatedAt: Timestamp.now(),
    }
  );
  
  return docRef.id;
}

/**
 * Get recent conversations for a case
 */
export async function getCaseConversations(
  userId: string,
  caseId: string,
  limitCount: number = 10
): Promise<Conversation[]> {
  const q = query(
    collection(db, 'users', userId, 'conversations'),
    where('caseId', '==', caseId),
    orderBy('updatedAt', 'desc'),
    limit(limitCount)
  );
  
  const snapshot = await getDocs(q);
  return snapshot.docs.map(d => {
    const data = d.data();
    return {
      id: d.id,
      ...data,
      messages: data.messages?.map((m: any) => ({
        ...m,
        timestamp: m.timestamp?.toDate() || new Date(),
      })),
      createdAt: data.createdAt?.toDate() || new Date(),
      updatedAt: data.updatedAt?.toDate() || new Date(),
    } as Conversation;
  });
}

/**
 * Build context for AI prompt injection
 * This is the key function that provides case-aware AI responses
 */
export async function buildCaseContext(
  userId: string,
  caseId: string,
  userQuery: string
): Promise<string> {
  const caseInfo = await getCase(userId, caseId);
  if (!caseInfo) {
    return '';
  }
  
  const contextParts: string[] = [];
  
  // Basic case info
  contextParts.push(`## Active Case Context
**Case:** ${caseInfo.title}
**Type:** ${caseInfo.caseType}
**Client:** ${caseInfo.clientName}
**Court:** ${caseInfo.court || 'Not specified'}
**Judge:** ${caseInfo.judge || 'Not assigned'}
**Docket:** ${caseInfo.docketNumber || 'Pending'}
**Status:** ${caseInfo.status}
**Next Court Date:** ${caseInfo.nextCourtDate ? caseInfo.nextCourtDate.toLocaleDateString() : 'Not scheduled'}`);
  
  // Case-type specific info
  if (caseInfo.caseType === 'criminal' && caseInfo.charges) {
    contextParts.push(`
**Charges:**
${caseInfo.charges.map(c => `- ${c.description} (${c.statute}) - ${c.class}`).join('\n')}`);
    
    if (caseInfo.arraignmentDate) {
      contextParts.push(`**Arraignment Date:** ${caseInfo.arraignmentDate.toLocaleDateString()}`);
    }
  }
  
  if ((caseInfo.caseType === 'custody' || caseInfo.caseType === 'family') && caseInfo.children) {
    contextParts.push(`
**Children:**
${caseInfo.children.map(c => `- ${c.name}, age ${c.age}${c.specialNeeds ? ` (${c.specialNeeds})` : ''}`).join('\n')}`);
  }
  
  if (caseInfo.caseType === 'divorce' && caseInfo.assets) {
    const totalValue = caseInfo.assets.reduce((sum, a) => sum + (a.value || 0), 0);
    contextParts.push(`
**Assets (${caseInfo.assets.length} items, ~$${totalValue.toLocaleString()} total):**
${caseInfo.assets.slice(0, 5).map(a => `- ${a.description}: ${a.maritalSeparate}`).join('\n')}
${caseInfo.assets.length > 5 ? `... and ${caseInfo.assets.length - 5} more` : ''}`);
  }
  
  // Key facts
  if (caseInfo.keyFacts && caseInfo.keyFacts.length > 0) {
    contextParts.push(`
**Key Facts:**
${caseInfo.keyFacts.map(f => `- ${f}`).join('\n')}`);
  }
  
  // Case strategy
  if (caseInfo.caseStrategy) {
    contextParts.push(`
**Case Strategy:** ${caseInfo.caseStrategy}`);
  }
  
  // Discovery status (for criminal cases)
  if (caseInfo.caseType === 'criminal') {
    try {
      const compliance = await getDiscoveryCompliance(userId, caseId);
      contextParts.push(`
**Discovery Status:** ${compliance.percentComplete}% complete (${compliance.outstanding} items outstanding${compliance.overdue > 0 ? `, ${compliance.overdue} overdue` : ''})`);
    } catch (e) {
      // Discovery not set up yet
    }
  }
  
  // Relevant documents via RAG
  try {
    const relevantDocs = await searchDocuments(userQuery, {
      userId,
      caseId,
      limit: 3,
    });
    
    if (relevantDocs.length > 0) {
      contextParts.push(`
**Relevant Document Excerpts:**
${relevantDocs.map((d, i) => `[${i + 1}] ${d.text.substring(0, 300)}...`).join('\n\n')}`);
    }
  } catch (e) {
    // RAG not available
  }
  
  // Recent conversations summary
  try {
    const recentConvos = await getCaseConversations(userId, caseId, 3);
    if (recentConvos.length > 0 && recentConvos[0].summary) {
      contextParts.push(`
**Recent Discussion Summary:** ${recentConvos[0].summary}`);
    }
  } catch (e) {
    // No conversations yet
  }
  
  return contextParts.join('\n');
}

/**
 * Generate system prompt with case context
 */
export function generateCaseAwareSystemPrompt(
  caseContext: string,
  citationMode: boolean = true
): string {
  let prompt = `You are 18B Lawyer AI, a legal assistant for 18B panel attorneys and pro se litigants in New York.

${caseContext ? `The user is currently working on the following case:\n\n${caseContext}\n\n` : ''}

IMPORTANT GUIDELINES:
1. Always reference the case context when answering questions about this matter
2. Be specific to New York law and procedure
3. If information from the case file is relevant, cite it
4. Distinguish between general legal principles and case-specific advice`;

  if (citationMode) {
    prompt += `

CITATION REQUIREMENT:
- Cite legal authority for every legal claim: [CPL § 710.20] or [People v. De Bour, 40 N.Y.2d 210 (1976)]
- If you cannot find supporting authority, state: "I cannot locate specific authority for this proposition."
- Never fabricate citations.`;
  }

  prompt += `

DISCLAIMERS:
- Remind users this is AI-assisted research, not legal advice
- For pro se users, recommend consulting an attorney for complex matters
- Protect attorney-client privilege by not disclosing case details externally`;

  return prompt;
}

/**
 * Quick case recall - answer questions about past discussions
 */
export async function recallCaseHistory(
  userId: string,
  caseId: string,
  query: string
): Promise<string> {
  const conversations = await getCaseConversations(userId, caseId, 20);
  
  if (conversations.length === 0) {
    return 'No previous conversations found for this case.';
  }
  
  // Search through conversation history
  const relevantMessages: string[] = [];
  const queryLower = query.toLowerCase();
  
  for (const convo of conversations) {
    for (const msg of convo.messages) {
      if (msg.content.toLowerCase().includes(queryLower)) {
        relevantMessages.push(
          `[${msg.timestamp.toLocaleDateString()}] ${msg.role}: ${msg.content.substring(0, 500)}...`
        );
      }
    }
  }
  
  if (relevantMessages.length === 0) {
    return `No specific discussions found matching "${query}". There are ${conversations.length} past conversations for this case.`;
  }
  
  return `Found ${relevantMessages.length} relevant messages:\n\n${relevantMessages.slice(0, 5).join('\n\n')}`;
}
