/**
 * Document Vault Service
 * Handles document upload, storage, OCR, and retrieval
 */

import { db, storage } from './firebase';
import { 
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
  DocumentData
} from 'firebase/firestore';
import { ref, uploadBytes, getDownloadURL, deleteObject } from 'firebase/storage';
import { indexDocumentForRAG, searchDocuments } from './ragService';

// Document types
export interface DocumentMetadata {
  id: string;
  caseId: string;
  userId: string;
  filename: string;
  originalName: string;
  storagePath: string;
  downloadUrl: string;
  fileSize: number;
  mimeType: string;
  category: DocumentCategory;
  tags: string[];
  uploadedAt: Date;
  updatedAt: Date;
  
  // OCR
  ocrStatus: 'pending' | 'processing' | 'complete' | 'failed';
  ocrText?: string;
  ocrError?: string;
  
  // Privilege check
  privilegeStatus: 'pending' | 'safe' | 'privileged' | 'review';
  privilegeType?: 'attorney_client' | 'work_product' | 'both';
  privilegeNotes?: string;
  
  // PHI check
  phiStatus: 'pending' | 'clean' | 'found' | 'redacted';
  phiCount?: number;
  
  // AI analysis
  summary?: string;
  keyDates?: string[];
  keyPeople?: string[];
  keyFacts?: string[];
  
  // RAG
  indexed: boolean;
  chunkCount?: number;
}

export type DocumentCategory = 
  | 'discovery'
  | 'pleading'
  | 'motion'
  | 'correspondence'
  | 'evidence'
  | 'medical'
  | 'financial'
  | 'court_order'
  | 'transcript'
  | 'police_report'
  | 'cps_report'
  | 'forensic'
  | 'client_docs'
  | 'other';

export const CATEGORY_LABELS: Record<DocumentCategory, string> = {
  discovery: 'Discovery',
  pleading: 'Pleadings',
  motion: 'Motions',
  correspondence: 'Correspondence',
  evidence: 'Evidence',
  medical: 'Medical Records',
  financial: 'Financial Documents',
  court_order: 'Court Orders',
  transcript: 'Transcripts',
  police_report: 'Police Reports',
  cps_report: 'CPS Reports',
  forensic: 'Forensic Reports',
  client_docs: 'Client Documents',
  other: 'Other',
};

/**
 * Upload a document to the vault
 */
export async function uploadDocument(
  file: File,
  caseId: string,
  userId: string,
  category: DocumentCategory = 'other',
  tags: string[] = []
): Promise<DocumentMetadata> {
  // Generate unique filename
  const timestamp = Date.now();
  const sanitizedName = file.name.replace(/[^a-zA-Z0-9.-]/g, '_');
  const filename = `${timestamp}_${sanitizedName}`;
  const storagePath = `documents/${userId}/${caseId}/${filename}`;
  
  // Upload to Firebase Storage
  const storageRef = ref(storage, storagePath);
  await uploadBytes(storageRef, file);
  const downloadUrl = await getDownloadURL(storageRef);
  
  // Create metadata document
  const docData = {
    caseId,
    userId,
    filename,
    originalName: file.name,
    storagePath,
    downloadUrl,
    fileSize: file.size,
    mimeType: file.type,
    category,
    tags,
    uploadedAt: Timestamp.now(),
    updatedAt: Timestamp.now(),
    ocrStatus: 'pending',
    privilegeStatus: 'pending',
    phiStatus: 'pending',
    indexed: false,
  };
  
  const docRef = await addDoc(
    collection(db, 'users', userId, 'cases', caseId, 'documents'),
    docData
  );
  
  const metadata: DocumentMetadata = {
    id: docRef.id,
    caseId,
    userId,
    filename,
    originalName: file.name,
    storagePath,
    downloadUrl,
    fileSize: file.size,
    mimeType: file.type,
    category,
    tags,
    uploadedAt: new Date(),
    updatedAt: new Date(),
    ocrStatus: 'pending',
    privilegeStatus: 'pending',
    phiStatus: 'pending',
    indexed: false,
  };
  
  // Trigger OCR processing (async)
  processDocumentOCR(metadata).catch(console.error);
  
  return metadata;
}

/**
 * Process OCR for a document
 */
async function processDocumentOCR(doc: DocumentMetadata): Promise<void> {
  try {
    // Update status to processing
    await updateDocumentStatus(doc.userId, doc.caseId, doc.id, {
      ocrStatus: 'processing',
    });
    
    // For PDFs and images, we'd use a real OCR service
    // For now, we'll simulate with a placeholder
    // In production: Use Google Cloud Vision, AWS Textract, or Tesseract
    
    let ocrText = '';
    
    if (doc.mimeType === 'application/pdf' || doc.mimeType.startsWith('image/')) {
      // Placeholder - in production, call OCR API
      // const ocrResult = await callOCRService(doc.downloadUrl);
      // ocrText = ocrResult.text;
      
      // For now, mark as needing real OCR
      ocrText = `[OCR pending for: ${doc.originalName}]`;
    } else if (doc.mimeType === 'text/plain') {
      // Plain text - fetch directly
      const response = await fetch(doc.downloadUrl);
      ocrText = await response.text();
    }
    
    // Run privilege and PHI checks
    const privilegeResult = await checkPrivilege(ocrText);
    const phiResult = await checkPHI(ocrText);
    
    // Update document with results
    await updateDocumentStatus(doc.userId, doc.caseId, doc.id, {
      ocrStatus: 'complete',
      ocrText,
      privilegeStatus: privilegeResult.status,
      privilegeType: privilegeResult.type,
      phiStatus: phiResult.status,
      phiCount: phiResult.count,
    });
    
    // Index for RAG if not privileged
    if (privilegeResult.status === 'safe' && ocrText.length > 50) {
      await indexDocumentInRAG(doc, ocrText);
    }
    
  } catch (error) {
    console.error('OCR processing failed:', error);
    await updateDocumentStatus(doc.userId, doc.caseId, doc.id, {
      ocrStatus: 'failed',
      ocrError: error instanceof Error ? error.message : 'Unknown error',
    });
  }
}

/**
 * Check for privileged content
 */
async function checkPrivilege(text: string): Promise<{
  status: 'safe' | 'privileged' | 'review';
  type?: 'attorney_client' | 'work_product' | 'both';
}> {
  const lowerText = text.toLowerCase();
  
  const acIndicators = [
    'attorney-client',
    'privileged and confidential',
    'legal advice',
    'confidential communication',
    'privileged communication',
  ];
  
  const wpIndicators = [
    'work product',
    'attorney work product',
    'prepared in anticipation of litigation',
    'trial preparation',
    'legal strategy',
    'case assessment',
  ];
  
  const hasAC = acIndicators.some(i => lowerText.includes(i));
  const hasWP = wpIndicators.some(i => lowerText.includes(i));
  
  if (hasAC && hasWP) {
    return { status: 'privileged', type: 'both' };
  } else if (hasAC) {
    return { status: 'privileged', type: 'attorney_client' };
  } else if (hasWP) {
    return { status: 'privileged', type: 'work_product' };
  }
  
  return { status: 'safe' };
}

/**
 * Check for PHI (Protected Health Information)
 */
async function checkPHI(text: string): Promise<{
  status: 'clean' | 'found';
  count: number;
}> {
  // Simple pattern matching for common PHI
  const patterns = [
    /\b\d{3}-\d{2}-\d{4}\b/g,  // SSN
    /\b\d{3}\s?\d{2}\s?\d{4}\b/g,  // SSN with spaces
    /DOB:?\s*\d{1,2}[\/\-]\d{1,2}[\/\-]\d{2,4}/gi,  // Date of birth
    /\bMRN:?\s*\d+\b/gi,  // Medical record number
    /\bpatient\s+id:?\s*\d+\b/gi,  // Patient ID
  ];
  
  let totalCount = 0;
  for (const pattern of patterns) {
    const matches = text.match(pattern);
    if (matches) {
      totalCount += matches.length;
    }
  }
  
  return {
    status: totalCount > 0 ? 'found' : 'clean',
    count: totalCount,
  };
}

/**
 * Index document for RAG search
 */
async function indexDocumentInRAG(
  doc: DocumentMetadata,
  text: string
): Promise<void> {
  try {
    const chunkCount = await indexDocumentForRAG({
      id: doc.id,
      caseId: doc.caseId,
      userId: doc.userId,
      content: text,
      metadata: {
        filename: doc.originalName,
        category: doc.category,
        uploadedAt: doc.uploadedAt.toISOString(),
      },
    });
    
    await updateDocumentStatus(doc.userId, doc.caseId, doc.id, {
      indexed: true,
      chunkCount,
    });
  } catch (error) {
    console.error('RAG indexing failed:', error);
  }
}

/**
 * Update document status
 */
async function updateDocumentStatus(
  userId: string,
  caseId: string,
  docId: string,
  updates: Partial<DocumentMetadata>
): Promise<void> {
  const docRef = doc(db, 'users', userId, 'cases', caseId, 'documents', docId);
  await updateDoc(docRef, {
    ...updates,
    updatedAt: Timestamp.now(),
  });
}

/**
 * Get all documents for a case
 */
export async function getCaseDocuments(
  userId: string,
  caseId: string,
  category?: DocumentCategory
): Promise<DocumentMetadata[]> {
  let q = query(
    collection(db, 'users', userId, 'cases', caseId, 'documents'),
    orderBy('uploadedAt', 'desc')
  );
  
  if (category) {
    q = query(
      collection(db, 'users', userId, 'cases', caseId, 'documents'),
      where('category', '==', category),
      orderBy('uploadedAt', 'desc')
    );
  }
  
  const snapshot = await getDocs(q);
  return snapshot.docs.map(d => ({
    id: d.id,
    ...d.data(),
    uploadedAt: d.data().uploadedAt?.toDate() || new Date(),
    updatedAt: d.data().updatedAt?.toDate() || new Date(),
  })) as DocumentMetadata[];
}

/**
 * Get a single document
 */
export async function getDocument(
  userId: string,
  caseId: string,
  docId: string
): Promise<DocumentMetadata | null> {
  const docRef = doc(db, 'users', userId, 'cases', caseId, 'documents', docId);
  const snapshot = await getDoc(docRef);
  
  if (!snapshot.exists()) {
    return null;
  }
  
  const data = snapshot.data();
  return {
    id: snapshot.id,
    ...data,
    uploadedAt: data.uploadedAt?.toDate() || new Date(),
    updatedAt: data.updatedAt?.toDate() || new Date(),
  } as DocumentMetadata;
}

/**
 * Delete a document
 */
export async function deleteDocument(
  userId: string,
  caseId: string,
  docId: string
): Promise<void> {
  const docData = await getDocument(userId, caseId, docId);
  if (!docData) return;
  
  // Delete from Storage
  try {
    const storageRef = ref(storage, docData.storagePath);
    await deleteObject(storageRef);
  } catch (error) {
    console.error('Failed to delete from storage:', error);
  }
  
  // Delete from Firestore
  await deleteDoc(doc(db, 'users', userId, 'cases', caseId, 'documents', docId));
}

/**
 * Search documents using RAG
 */
export async function searchCaseDocuments(
  userId: string,
  caseId: string,
  searchQuery: string,
  limit: number = 10
): Promise<{
  documents: DocumentMetadata[];
  relevantChunks: Array<{ text: string; score: number; documentId: string }>;
}> {
  // Search using RAG
  const ragResults = await searchDocuments(searchQuery, {
    userId,
    caseId,
    limit,
  });
  
  // Get unique document IDs
  const docIds = [...new Set(ragResults.map(r => r.documentId))];
  
  // Fetch document metadata
  const documents = await Promise.all(
    docIds.map(id => getDocument(userId, caseId, id))
  );
  
  return {
    documents: documents.filter((d): d is DocumentMetadata => d !== null),
    relevantChunks: ragResults.map(r => ({
      text: r.text,
      score: r.score,
      documentId: r.documentId,
    })),
  };
}

/**
 * Update document metadata
 */
export async function updateDocument(
  userId: string,
  caseId: string,
  docId: string,
  updates: Partial<Pick<DocumentMetadata, 'category' | 'tags' | 'summary' | 'keyDates' | 'keyPeople' | 'keyFacts'>>
): Promise<void> {
  const docRef = doc(db, 'users', userId, 'cases', caseId, 'documents', docId);
  await updateDoc(docRef, {
    ...updates,
    updatedAt: Timestamp.now(),
  });
}

/**
 * Get document statistics for a case
 */
export async function getDocumentStats(
  userId: string,
  caseId: string
): Promise<{
  total: number;
  byCategory: Record<DocumentCategory, number>;
  totalSize: number;
  indexed: number;
  privileged: number;
  phiFound: number;
}> {
  const docs = await getCaseDocuments(userId, caseId);
  
  const stats = {
    total: docs.length,
    byCategory: {} as Record<DocumentCategory, number>,
    totalSize: 0,
    indexed: 0,
    privileged: 0,
    phiFound: 0,
  };
  
  for (const d of docs) {
    stats.byCategory[d.category] = (stats.byCategory[d.category] || 0) + 1;
    stats.totalSize += d.fileSize;
    if (d.indexed) stats.indexed++;
    if (d.privilegeStatus === 'privileged') stats.privileged++;
    if (d.phiStatus === 'found') stats.phiFound++;
  }
  
  return stats;
}
