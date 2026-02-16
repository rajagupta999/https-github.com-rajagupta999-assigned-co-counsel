/**
 * Discovery Tracker Service
 * Tracks CPL 245 automatic discovery compliance for criminal cases
 * Also supports civil discovery tracking
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
  Timestamp,
} from 'firebase/firestore';

// Discovery item types per CPL 245.20
export type CriminalDiscoveryType = 
  | 'names_addresses_dob_witnesses'
  | 'written_recorded_statements'
  | 'grand_jury_testimony'
  | 'expert_opinion_evidence'
  | 'photographs_drawings'
  | 'tapes_electronic_recordings'
  | 'reports_documents_tests'
  | 'tangible_objects'
  | 'search_warrants'
  | 'electronically_stored_info'
  | 'prior_uncharged_acts'
  | 'favorable_evidence'
  | 'impeachment_evidence'
  | 'police_reports'
  | 'body_camera_footage'
  | '911_calls'
  | 'lab_reports'
  | 'rap_sheets'
  | 'consent_certificates'
  | 'plea_agreements_witnesses'
  | 'other';

export type CivilDiscoveryType =
  | 'interrogatories'
  | 'document_requests'
  | 'depositions'
  | 'requests_admission'
  | 'expert_disclosures'
  | 'supplemental_responses'
  | 'other';

export type DiscoveryStatus = 
  | 'requested'
  | 'received_partial'
  | 'received_complete'
  | 'objected'
  | 'motion_pending'
  | 'overdue'
  | 'not_applicable';

export interface DiscoveryItem {
  id: string;
  caseId: string;
  userId: string;
  caseType: 'criminal' | 'civil' | 'family';
  
  // Item details
  itemType: CriminalDiscoveryType | CivilDiscoveryType;
  description: string;
  notes?: string;
  
  // Status tracking
  status: DiscoveryStatus;
  requestedDate?: Date;
  dueDate?: Date;
  receivedDate?: Date;
  
  // Linked documents
  linkedDocumentIds: string[];
  
  // CPL 245 specific
  cpl245Category?: string;  // The specific CPL section
  certificateOfCompliance?: boolean;  // Was this covered in COC?
  supplementRequired?: boolean;
  
  // Metadata
  createdAt: Date;
  updatedAt: Date;
}

// CPL 245.20 Discovery Categories
export const CPL_245_CATEGORIES: Array<{
  id: CriminalDiscoveryType;
  section: string;
  title: string;
  description: string;
  typical_source: string;
}> = [
  {
    id: 'names_addresses_dob_witnesses',
    section: '245.20(1)(a)',
    title: 'Witness Information',
    description: 'Names, addresses, birth dates of persons intended to be called as witnesses',
    typical_source: 'DA case file',
  },
  {
    id: 'written_recorded_statements',
    section: '245.20(1)(b)',
    title: 'Statements of Defendant',
    description: 'Written or recorded statements by defendant or co-defendant',
    typical_source: 'Police reports, interrogation records',
  },
  {
    id: 'grand_jury_testimony',
    section: '245.20(1)(c)',
    title: 'Grand Jury Testimony',
    description: 'Transcripts of testimony of defendant or co-defendant before grand jury',
    typical_source: 'Grand jury minutes',
  },
  {
    id: 'expert_opinion_evidence',
    section: '245.20(1)(d)',
    title: 'Expert Evidence',
    description: 'Expert opinion evidence including reports, tests, analyses',
    typical_source: 'Crime lab, forensic examiners',
  },
  {
    id: 'photographs_drawings',
    section: '245.20(1)(e)',
    title: 'Photos & Drawings',
    description: 'Photographs, photocopies, drawings relating to prosecution',
    typical_source: 'Crime scene photos, evidence photos',
  },
  {
    id: 'tapes_electronic_recordings',
    section: '245.20(1)(f)',
    title: 'Electronic Recordings',
    description: 'Tapes, electronic recordings relating to prosecution',
    typical_source: 'Surveillance, wiretaps, phone records',
  },
  {
    id: 'reports_documents_tests',
    section: '245.20(1)(g)',
    title: 'Reports & Documents',
    description: 'All reports, tests, documents, measurements made in connection with case',
    typical_source: 'Lab reports, breath tests, field tests',
  },
  {
    id: 'tangible_objects',
    section: '245.20(1)(h)',
    title: 'Physical Evidence',
    description: 'Tangible property seized or obtained in relation to case',
    typical_source: 'Evidence locker, property clerk',
  },
  {
    id: 'search_warrants',
    section: '245.20(1)(i)',
    title: 'Search Warrants',
    description: 'Search warrant applications and supporting affidavits',
    typical_source: 'Court records, DA file',
  },
  {
    id: 'electronically_stored_info',
    section: '245.20(1)(j)',
    title: 'Electronic Data',
    description: 'All electronically stored information obtained from defendant or others',
    typical_source: 'Cell phone extractions, computer forensics',
  },
  {
    id: 'prior_uncharged_acts',
    section: '245.20(1)(k)',
    title: 'Prior Bad Acts',
    description: 'Intent to introduce evidence of prior uncharged acts',
    typical_source: 'DA notice, prior case records',
  },
  {
    id: 'favorable_evidence',
    section: '245.20(1)(k)',
    title: 'Exculpatory Evidence (Brady)',
    description: 'All evidence favorable to defendant (exculpatory and mitigating)',
    typical_source: 'DA file, police files',
  },
  {
    id: 'impeachment_evidence',
    section: '245.20(1)(k)',
    title: 'Impeachment Material (Giglio)',
    description: 'Impeachment evidence relating to witnesses',
    typical_source: 'Witness history, prior inconsistent statements',
  },
  {
    id: 'police_reports',
    section: '245.20(1)(e)',
    title: 'Police Reports',
    description: 'All police reports including arrest report, complaint report, DD5s',
    typical_source: 'NYPD, precinct records',
  },
  {
    id: 'body_camera_footage',
    section: '245.20(1)(g)',
    title: 'Body Camera/BWC',
    description: 'Body-worn camera footage from responding officers',
    typical_source: 'NYPD BWC unit',
  },
  {
    id: '911_calls',
    section: '245.20(1)(g)',
    title: '911 Calls & CAD',
    description: '911 recordings and computer-aided dispatch records',
    typical_source: 'NYPD communications',
  },
  {
    id: 'lab_reports',
    section: '245.20(1)(d)',
    title: 'Lab Reports',
    description: 'DNA, drug analysis, fingerprint, ballistics reports',
    typical_source: 'OCME, crime lab',
  },
  {
    id: 'rap_sheets',
    section: '245.20(1)(p)',
    title: 'Criminal History',
    description: 'Criminal history records of defendant and witnesses',
    typical_source: 'DCJS, court records',
  },
  {
    id: 'consent_certificates',
    section: '245.20(1)(q)',
    title: 'Consent Forms',
    description: 'Certificates of consent for searches, lineups, etc.',
    typical_source: 'Police files',
  },
  {
    id: 'plea_agreements_witnesses',
    section: '245.20(1)(r)',
    title: 'Witness Plea Deals',
    description: 'Plea agreements or cooperation agreements with witnesses',
    typical_source: 'DA file',
  },
];

/**
 * Create initial discovery checklist for a criminal case
 */
export async function createCriminalDiscoveryChecklist(
  userId: string,
  caseId: string
): Promise<DiscoveryItem[]> {
  const items: DiscoveryItem[] = [];
  const now = new Date();
  
  for (const category of CPL_245_CATEGORIES) {
    const docRef = await addDoc(
      collection(db, 'users', userId, 'cases', caseId, 'discovery'),
      {
        caseId,
        userId,
        caseType: 'criminal',
        itemType: category.id,
        description: category.title,
        notes: category.description,
        status: 'requested',
        cpl245Category: category.section,
        linkedDocumentIds: [],
        certificateOfCompliance: false,
        supplementRequired: false,
        createdAt: Timestamp.now(),
        updatedAt: Timestamp.now(),
      }
    );
    
    items.push({
      id: docRef.id,
      caseId,
      userId,
      caseType: 'criminal',
      itemType: category.id,
      description: category.title,
      notes: category.description,
      status: 'requested',
      cpl245Category: category.section,
      linkedDocumentIds: [],
      certificateOfCompliance: false,
      supplementRequired: false,
      createdAt: now,
      updatedAt: now,
    });
  }
  
  return items;
}

/**
 * Get all discovery items for a case
 */
export async function getCaseDiscovery(
  userId: string,
  caseId: string
): Promise<DiscoveryItem[]> {
  const q = query(
    collection(db, 'users', userId, 'cases', caseId, 'discovery'),
    orderBy('createdAt', 'asc')
  );
  
  const snapshot = await getDocs(q);
  return snapshot.docs.map(d => ({
    id: d.id,
    ...d.data(),
    requestedDate: d.data().requestedDate?.toDate(),
    dueDate: d.data().dueDate?.toDate(),
    receivedDate: d.data().receivedDate?.toDate(),
    createdAt: d.data().createdAt?.toDate() || new Date(),
    updatedAt: d.data().updatedAt?.toDate() || new Date(),
  })) as DiscoveryItem[];
}

/**
 * Update discovery item status
 */
export async function updateDiscoveryItem(
  userId: string,
  caseId: string,
  itemId: string,
  updates: Partial<Omit<DiscoveryItem, 'id' | 'caseId' | 'userId' | 'createdAt'>>
): Promise<void> {
  const docRef = doc(db, 'users', userId, 'cases', caseId, 'discovery', itemId);
  
  const firestoreUpdates: Record<string, unknown> = {
    ...updates,
    updatedAt: Timestamp.now(),
  };
  
  // Convert dates to Timestamps
  if (updates.requestedDate) {
    firestoreUpdates.requestedDate = Timestamp.fromDate(updates.requestedDate);
  }
  if (updates.dueDate) {
    firestoreUpdates.dueDate = Timestamp.fromDate(updates.dueDate);
  }
  if (updates.receivedDate) {
    firestoreUpdates.receivedDate = Timestamp.fromDate(updates.receivedDate);
  }
  
  await updateDoc(docRef, firestoreUpdates);
}

/**
 * Link a document to a discovery item
 */
export async function linkDocumentToDiscovery(
  userId: string,
  caseId: string,
  itemId: string,
  documentId: string
): Promise<void> {
  const item = await getDiscoveryItem(userId, caseId, itemId);
  if (!item) return;
  
  const linkedIds = [...item.linkedDocumentIds, documentId];
  await updateDiscoveryItem(userId, caseId, itemId, {
    linkedDocumentIds: linkedIds,
    status: linkedIds.length > 0 ? 'received_partial' : item.status,
  });
}

/**
 * Get a single discovery item
 */
export async function getDiscoveryItem(
  userId: string,
  caseId: string,
  itemId: string
): Promise<DiscoveryItem | null> {
  const docRef = doc(db, 'users', userId, 'cases', caseId, 'discovery', itemId);
  const snapshot = await getDoc(docRef);
  
  if (!snapshot.exists()) return null;
  
  const data = snapshot.data();
  return {
    id: snapshot.id,
    ...data,
    requestedDate: data.requestedDate?.toDate(),
    dueDate: data.dueDate?.toDate(),
    receivedDate: data.receivedDate?.toDate(),
    createdAt: data.createdAt?.toDate() || new Date(),
    updatedAt: data.updatedAt?.toDate() || new Date(),
  } as DiscoveryItem;
}

/**
 * Get discovery compliance summary
 */
export async function getDiscoveryCompliance(
  userId: string,
  caseId: string
): Promise<{
  total: number;
  received: number;
  outstanding: number;
  overdue: number;
  percentComplete: number;
  outstandingItems: DiscoveryItem[];
}> {
  const items = await getCaseDiscovery(userId, caseId);
  
  const received = items.filter(i => 
    i.status === 'received_complete' || i.status === 'not_applicable'
  ).length;
  
  const outstanding = items.filter(i => 
    i.status === 'requested' || i.status === 'received_partial'
  );
  
  const overdue = items.filter(i => 
    i.status === 'overdue' || 
    (i.dueDate && i.dueDate < new Date() && i.status !== 'received_complete')
  ).length;
  
  return {
    total: items.length,
    received,
    outstanding: outstanding.length,
    overdue,
    percentComplete: items.length > 0 ? Math.round((received / items.length) * 100) : 0,
    outstandingItems: outstanding,
  };
}

/**
 * Generate CPL 245 demand letter content
 */
export function generateDiscoveryDemandLetter(
  outstandingItems: DiscoveryItem[],
  caseInfo: {
    defendantName: string;
    docketNumber: string;
    arraignmentDate: Date;
    adaName?: string;
  }
): string {
  const itemsList = outstandingItems
    .map((item, i) => {
      const cpl = CPL_245_CATEGORIES.find(c => c.id === item.itemType);
      return `${i + 1}. ${item.description} (${cpl?.section || 'CPL 245.20'})`;
    })
    .join('\n');
  
  const daysSinceArraignment = Math.floor(
    (Date.now() - caseInfo.arraignmentDate.getTime()) / (1000 * 60 * 60 * 24)
  );
  
  return `
RE: DEMAND FOR OUTSTANDING DISCOVERY
People v. ${caseInfo.defendantName}
Docket No.: ${caseInfo.docketNumber}

Dear ${caseInfo.adaName || 'Counsel'}:

I write regarding outstanding discovery in the above-captioned matter. Pursuant to CPL Article 245, the People were required to disclose all discoverable materials within the statutory timeframe. It has now been ${daysSinceArraignment} days since arraignment.

The following items remain outstanding:

${itemsList}

Please be advised that the failure to provide the above-enumerated materials constitutes a violation of CPL 245.20. Pursuant to CPL 245.80, I hereby demand that the People provide all outstanding discovery within [X] days of this letter.

Should the People fail to comply, I will move to preclude the use of any undisclosed evidence and/or seek dismissal pursuant to CPL 245.80(2) and the Court's supervisory powers.

Very truly yours,
[Attorney Name]
[Attorney Address]
[Bar Number]

cc: Court
`.trim();
}

/**
 * Add custom discovery item
 */
export async function addDiscoveryItem(
  userId: string,
  caseId: string,
  item: Omit<DiscoveryItem, 'id' | 'createdAt' | 'updatedAt'>
): Promise<DiscoveryItem> {
  const now = new Date();
  
  const docRef = await addDoc(
    collection(db, 'users', userId, 'cases', caseId, 'discovery'),
    {
      ...item,
      requestedDate: item.requestedDate ? Timestamp.fromDate(item.requestedDate) : null,
      dueDate: item.dueDate ? Timestamp.fromDate(item.dueDate) : null,
      receivedDate: item.receivedDate ? Timestamp.fromDate(item.receivedDate) : null,
      createdAt: Timestamp.now(),
      updatedAt: Timestamp.now(),
    }
  );
  
  return {
    id: docRef.id,
    ...item,
    createdAt: now,
    updatedAt: now,
  };
}

/**
 * Check for overdue items and update status
 */
export async function checkOverdueDiscovery(
  userId: string,
  caseId: string
): Promise<DiscoveryItem[]> {
  const items = await getCaseDiscovery(userId, caseId);
  const now = new Date();
  const overdue: DiscoveryItem[] = [];
  
  for (const item of items) {
    if (
      item.dueDate && 
      item.dueDate < now && 
      item.status !== 'received_complete' &&
      item.status !== 'not_applicable' &&
      item.status !== 'overdue'
    ) {
      await updateDiscoveryItem(userId, caseId, item.id, { status: 'overdue' });
      overdue.push({ ...item, status: 'overdue' });
    }
  }
  
  return overdue;
}
