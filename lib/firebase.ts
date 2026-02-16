// Firebase configuration and utilities
// For insurance backend: leads, quotes, policies, claims

import { initializeApp, getApps, FirebaseApp } from 'firebase/app';
import { 
  getFirestore, 
  collection, 
  doc, 
  addDoc, 
  updateDoc, 
  deleteDoc, 
  getDocs, 
  getDoc, 
  query, 
  where, 
  orderBy, 
  Timestamp,
  onSnapshot,
  Firestore
} from 'firebase/firestore';
import { getAuth, Auth } from 'firebase/auth';
import { getStorage, FirebaseStorage } from 'firebase/storage';

// Firebase config for Assigned Co-Counsel
const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY || "",
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN || "assigned-co-counsel.firebaseapp.com",
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID || "assigned-co-counsel",
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET || "assigned-co-counsel.firebasestorage.app",
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID || "414328331170",
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID || "1:414328331170:web:46f2445ad0d8c57bfe70fb",
  measurementId: "G-ST95TENC5M"
};

// Initialize Firebase
let app: FirebaseApp;
let db: Firestore;
let auth: Auth;
let storage: FirebaseStorage;

if (typeof window !== 'undefined') {
  app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApps()[0];
  db = getFirestore(app);
  auth = getAuth(app);
  storage = getStorage(app);
}

// ============ TYPES ============

export interface InsuranceLead {
  id?: string;
  // Contact Info
  companyName: string;
  contactName: string;
  email: string;
  phone: string;
  
  // Business Info
  businessType: 'multifamily' | 'fleet' | 'logistics' | 'other';
  erpSystem?: 'buildium' | 'motive' | 'other';
  erpConnected: boolean;
  
  // Pipeline Status
  status: 'new' | 'contacted' | 'qualifying' | 'quoting' | 'negotiating' | 'won' | 'lost';
  priority: 'low' | 'medium' | 'high' | 'urgent';
  
  // Risk Data
  riskScore?: number;
  riskFactors?: RiskFactor[];
  
  // Metadata
  source: string;
  assignedAgent?: string;
  notes: string[];
  createdAt: Timestamp;
  updatedAt: Timestamp;
}

export interface RiskFactor {
  category: string;
  factor: string;
  severity: 'low' | 'medium' | 'high' | 'critical';
  score: number;
  details: string;
}

export interface Quote {
  id?: string;
  leadId: string;
  
  // Coverage Details
  coverageType: string;
  carriers: CarrierQuote[];
  selectedCarrier?: string;
  
  // Pricing
  premium: number;
  deductible: number;
  coverageLimit: number;
  
  // AI Analysis
  aiAnalysis?: string;
  llmUsed?: string;
  
  // Status
  status: 'draft' | 'sent' | 'accepted' | 'rejected' | 'expired';
  validUntil: Timestamp;
  
  createdAt: Timestamp;
  updatedAt: Timestamp;
}

export interface CarrierQuote {
  carrier: string;
  premium: number;
  deductible: number;
  coverageLimit: number;
  rating: number;
  aiRecommendation?: string;
}

export interface Policy {
  id?: string;
  leadId: string;
  quoteId: string;
  
  // Policy Details
  policyNumber: string;
  carrier: string;
  coverageType: string;
  premium: number;
  deductible: number;
  coverageLimit: number;
  
  // Dates
  effectiveDate: Timestamp;
  expirationDate: Timestamp;
  
  // Status
  status: 'active' | 'pending' | 'cancelled' | 'expired' | 'renewal';
  
  // Documents
  documents: PolicyDocument[];
  
  createdAt: Timestamp;
  updatedAt: Timestamp;
}

export interface PolicyDocument {
  name: string;
  url: string;
  type: 'policy' | 'endorsement' | 'certificate' | 'claim' | 'other';
  uploadedAt: Timestamp;
}

export interface Claim {
  id?: string;
  policyId: string;
  leadId: string;
  
  // Claim Details
  claimNumber: string;
  incidentDate: Timestamp;
  reportedDate: Timestamp;
  description: string;
  claimType: string;
  
  // Financials
  estimatedLoss: number;
  reserveAmount: number;
  paidAmount: number;
  
  // Status & Workflow
  status: 'reported' | 'investigating' | 'adjusting' | 'negotiating' | 'approved' | 'denied' | 'paid' | 'closed';
  assignedAdjuster?: string;
  
  // AI Analysis
  aiAnalysis?: string;
  fraudScore?: number;
  llmUsed?: string;
  
  // Documents & Evidence
  documents: ClaimDocument[];
  
  // Timeline
  timeline: ClaimEvent[];
  
  createdAt: Timestamp;
  updatedAt: Timestamp;
}

export interface ClaimDocument {
  name: string;
  url: string;
  type: 'photo' | 'video' | 'police_report' | 'medical' | 'estimate' | 'invoice' | 'correspondence' | 'other';
  aiExtractedData?: Record<string, unknown>;
  uploadedAt: Timestamp;
}

export interface ClaimEvent {
  date: Timestamp;
  event: string;
  actor: string;
  details?: string;
}

export interface Agent {
  id?: string;
  name: string;
  type: 'document_analysis' | 'risk_assessment' | 'quote_generation' | 'claims_processing' | 'customer_service' | 'underwriting';
  description: string;
  llm: 'cerebras' | 'gpt-4' | 'claude-3' | 'gemini' | 'groq';
  systemPrompt: string;
  temperature: number;
  active: boolean;
  createdAt: Timestamp;
}

// ============ LEAD OPERATIONS ============

export async function createLead(lead: Omit<InsuranceLead, 'id' | 'createdAt' | 'updatedAt'>): Promise<string> {
  const docRef = await addDoc(collection(db, 'insurance_leads'), {
    ...lead,
    createdAt: Timestamp.now(),
    updatedAt: Timestamp.now()
  });
  return docRef.id;
}

export async function updateLead(id: string, updates: Partial<InsuranceLead>): Promise<void> {
  await updateDoc(doc(db, 'insurance_leads', id), {
    ...updates,
    updatedAt: Timestamp.now()
  });
}

export async function deleteLead(id: string): Promise<void> {
  await deleteDoc(doc(db, 'insurance_leads', id));
}

export async function getLead(id: string): Promise<InsuranceLead | null> {
  const docSnap = await getDoc(doc(db, 'insurance_leads', id));
  if (docSnap.exists()) {
    return { id: docSnap.id, ...docSnap.data() } as InsuranceLead;
  }
  return null;
}

export async function getLeadsByStatus(status: InsuranceLead['status']): Promise<InsuranceLead[]> {
  const q = query(
    collection(db, 'insurance_leads'),
    where('status', '==', status),
    orderBy('updatedAt', 'desc')
  );
  const snapshot = await getDocs(q);
  return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as InsuranceLead));
}

export async function getAllLeads(): Promise<InsuranceLead[]> {
  const q = query(collection(db, 'insurance_leads'), orderBy('createdAt', 'desc'));
  const snapshot = await getDocs(q);
  return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as InsuranceLead));
}

export function subscribeToLeads(callback: (leads: InsuranceLead[]) => void) {
  const q = query(collection(db, 'insurance_leads'), orderBy('updatedAt', 'desc'));
  return onSnapshot(q, (snapshot) => {
    const leads = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as InsuranceLead));
    callback(leads);
  });
}

// ============ QUOTE OPERATIONS ============

export async function createQuote(quote: Omit<Quote, 'id' | 'createdAt' | 'updatedAt'>): Promise<string> {
  const docRef = await addDoc(collection(db, 'insurance_quotes'), {
    ...quote,
    createdAt: Timestamp.now(),
    updatedAt: Timestamp.now()
  });
  return docRef.id;
}

export async function updateQuote(id: string, updates: Partial<Quote>): Promise<void> {
  await updateDoc(doc(db, 'insurance_quotes', id), {
    ...updates,
    updatedAt: Timestamp.now()
  });
}

export async function getQuotesByLead(leadId: string): Promise<Quote[]> {
  const q = query(
    collection(db, 'insurance_quotes'),
    where('leadId', '==', leadId),
    orderBy('createdAt', 'desc')
  );
  const snapshot = await getDocs(q);
  return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Quote));
}

// ============ POLICY OPERATIONS ============

export async function createPolicy(policy: Omit<Policy, 'id' | 'createdAt' | 'updatedAt'>): Promise<string> {
  const docRef = await addDoc(collection(db, 'insurance_policies'), {
    ...policy,
    createdAt: Timestamp.now(),
    updatedAt: Timestamp.now()
  });
  return docRef.id;
}

export async function updatePolicy(id: string, updates: Partial<Policy>): Promise<void> {
  await updateDoc(doc(db, 'insurance_policies', id), {
    ...updates,
    updatedAt: Timestamp.now()
  });
}

export async function getPoliciesByLead(leadId: string): Promise<Policy[]> {
  const q = query(
    collection(db, 'insurance_policies'),
    where('leadId', '==', leadId),
    orderBy('createdAt', 'desc')
  );
  const snapshot = await getDocs(q);
  return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Policy));
}

export async function getActivePolicies(): Promise<Policy[]> {
  const q = query(
    collection(db, 'insurance_policies'),
    where('status', '==', 'active'),
    orderBy('expirationDate', 'asc')
  );
  const snapshot = await getDocs(q);
  return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Policy));
}

// ============ CLAIM OPERATIONS ============

export async function createClaim(claim: Omit<Claim, 'id' | 'createdAt' | 'updatedAt'>): Promise<string> {
  const docRef = await addDoc(collection(db, 'insurance_claims'), {
    ...claim,
    createdAt: Timestamp.now(),
    updatedAt: Timestamp.now()
  });
  return docRef.id;
}

export async function updateClaim(id: string, updates: Partial<Claim>): Promise<void> {
  await updateDoc(doc(db, 'insurance_claims', id), {
    ...updates,
    updatedAt: Timestamp.now()
  });
}

export async function addClaimEvent(claimId: string, event: Omit<ClaimEvent, 'date'>): Promise<void> {
  const claimDoc = await getDoc(doc(db, 'insurance_claims', claimId));
  if (claimDoc.exists()) {
    const claim = claimDoc.data() as Claim;
    const timeline = claim.timeline || [];
    timeline.push({ ...event, date: Timestamp.now() });
    await updateClaim(claimId, { timeline });
  }
}

export async function getClaimsByPolicy(policyId: string): Promise<Claim[]> {
  const q = query(
    collection(db, 'insurance_claims'),
    where('policyId', '==', policyId),
    orderBy('createdAt', 'desc')
  );
  const snapshot = await getDocs(q);
  return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Claim));
}

export async function getClaimsByStatus(status: Claim['status']): Promise<Claim[]> {
  const q = query(
    collection(db, 'insurance_claims'),
    where('status', '==', status),
    orderBy('updatedAt', 'desc')
  );
  const snapshot = await getDocs(q);
  return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Claim));
}

export function subscribeToClaims(callback: (claims: Claim[]) => void) {
  const q = query(collection(db, 'insurance_claims'), orderBy('updatedAt', 'desc'));
  return onSnapshot(q, (snapshot) => {
    const claims = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Claim));
    callback(claims);
  });
}

// ============ AGENT OPERATIONS ============

export async function createAgent(agent: Omit<Agent, 'id' | 'createdAt'>): Promise<string> {
  const docRef = await addDoc(collection(db, 'insurance_agents'), {
    ...agent,
    createdAt: Timestamp.now()
  });
  return docRef.id;
}

export async function updateAgent(id: string, updates: Partial<Agent>): Promise<void> {
  await updateDoc(doc(db, 'insurance_agents', id), updates);
}

export async function getAgents(): Promise<Agent[]> {
  const q = query(collection(db, 'insurance_agents'), where('active', '==', true));
  const snapshot = await getDocs(q);
  return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Agent));
}

export async function getAgentsByType(type: Agent['type']): Promise<Agent[]> {
  const q = query(
    collection(db, 'insurance_agents'),
    where('type', '==', type),
    where('active', '==', true)
  );
  const snapshot = await getDocs(q);
  return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Agent));
}

// Export instances
export { db, auth, app, storage };
