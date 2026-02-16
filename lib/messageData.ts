// Message types and mock data

export interface Contact {
  id: string;
  name: string;
  type: 'client' | 'co-counsel' | 'investigator' | 'expert' | 'other';
  email?: string;
  phone?: string;
  caseId?: string;
}

export interface Message {
  id: string;
  threadId: string;
  senderId: string;
  senderName: string;
  content: string;
  timestamp: string;
  read: boolean;
  isFromMe: boolean;
}

export interface Thread {
  id: string;
  caseId: string;
  caseName: string;
  contactId: string;
  contactName: string;
  contactType: Contact['type'];
  lastMessage: string;
  lastMessageTime: string;
  unreadCount: number;
  messages: Message[];
}

export const mockContacts: Contact[] = [
  { id: 'c1', name: 'Marcus Johnson', type: 'client', phone: '(347) 555-0123', caseId: 'CASE-2025-001' },
  { id: 'c2', name: 'David Chen, Esq.', type: 'co-counsel', email: 'dchen@legal.com', caseId: 'CASE-2025-001' },
  { id: 'c3', name: 'Sarah Williams', type: 'client', phone: '(718) 555-0456', caseId: 'CASE-2025-002' },
  { id: 'c4', name: 'Mike Torres', type: 'investigator', email: 'mtorres@investigations.com', caseId: 'CASE-2025-001' },
  { id: 'c5', name: 'Dr. Emily Ross', type: 'expert', email: 'eross@forensics.com', caseId: 'CASE-2025-003' },
];

export const mockThreads: Thread[] = [
  {
    id: 't1',
    caseId: 'CASE-2025-001',
    caseName: 'People v. Johnson',
    contactId: 'c1',
    contactName: 'Marcus Johnson',
    contactType: 'client',
    lastMessage: 'Thank you for the update on the court date.',
    lastMessageTime: '2:30 PM',
    unreadCount: 2,
    messages: [
      { id: 'm1', threadId: 't1', senderId: 'me', senderName: 'Raja', content: 'Hi Marcus, I wanted to update you on your case. The arraignment is scheduled for next Tuesday at 9:30 AM.', timestamp: '10:15 AM', read: true, isFromMe: true },
      { id: 'm2', threadId: 't1', senderId: 'c1', senderName: 'Marcus Johnson', content: 'Thank you for letting me know. Do I need to bring anything?', timestamp: '11:42 AM', read: true, isFromMe: false },
      { id: 'm3', threadId: 't1', senderId: 'me', senderName: 'Raja', content: 'Just bring a valid ID. Dress professionally - business casual at minimum. I\'ll meet you outside the courtroom at 9:00 AM.', timestamp: '1:20 PM', read: true, isFromMe: true },
      { id: 'm4', threadId: 't1', senderId: 'c1', senderName: 'Marcus Johnson', content: 'Got it. I\'ll be there early.', timestamp: '2:15 PM', read: false, isFromMe: false },
      { id: 'm5', threadId: 't1', senderId: 'c1', senderName: 'Marcus Johnson', content: 'Thank you for the update on the court date.', timestamp: '2:30 PM', read: false, isFromMe: false },
    ]
  },
  {
    id: 't2',
    caseId: 'CASE-2025-001',
    caseName: 'People v. Johnson',
    contactId: 'c2',
    contactName: 'David Chen, Esq.',
    contactType: 'co-counsel',
    lastMessage: 'I\'ll draft the motion to suppress and send it over by EOD.',
    lastMessageTime: '11:45 AM',
    unreadCount: 0,
    messages: [
      { id: 'm6', threadId: 't2', senderId: 'me', senderName: 'Raja', content: 'David, can you handle the motion to suppress for the Johnson case? The search seems problematic.', timestamp: '9:00 AM', read: true, isFromMe: true },
      { id: 'm7', threadId: 't2', senderId: 'c2', senderName: 'David Chen, Esq.', content: 'Absolutely. I reviewed the police report - there are clear 4th Amendment issues. The warrant was based on stale information.', timestamp: '10:30 AM', read: true, isFromMe: false },
      { id: 'm8', threadId: 't2', senderId: 'c2', senderName: 'David Chen, Esq.', content: 'I\'ll draft the motion to suppress and send it over by EOD.', timestamp: '11:45 AM', read: true, isFromMe: false },
    ]
  },
  {
    id: 't3',
    caseId: 'CASE-2025-002',
    caseName: 'People v. Williams',
    contactId: 'c3',
    contactName: 'Sarah Williams',
    contactType: 'client',
    lastMessage: 'Can we schedule a call for tomorrow?',
    lastMessageTime: 'Yesterday',
    unreadCount: 1,
    messages: [
      { id: 'm9', threadId: 't3', senderId: 'c3', senderName: 'Sarah Williams', content: 'Hi, I have some questions about my case.', timestamp: 'Yesterday', read: true, isFromMe: false },
      { id: 'm10', threadId: 't3', senderId: 'me', senderName: 'Raja', content: 'Of course, Sarah. What would you like to know?', timestamp: 'Yesterday', read: true, isFromMe: true },
      { id: 'm11', threadId: 't3', senderId: 'c3', senderName: 'Sarah Williams', content: 'Can we schedule a call for tomorrow?', timestamp: 'Yesterday', read: false, isFromMe: false },
    ]
  },
  {
    id: 't4',
    caseId: 'CASE-2025-001',
    caseName: 'People v. Johnson',
    contactId: 'c4',
    contactName: 'Mike Torres',
    contactType: 'investigator',
    lastMessage: 'Found two witnesses who saw the incident. Sending statements.',
    lastMessageTime: 'Mon',
    unreadCount: 0,
    messages: [
      { id: 'm12', threadId: 't4', senderId: 'me', senderName: 'Raja', content: 'Mike, need you to canvass the area around 145th and Broadway. Looking for any witnesses to the 10/15 incident.', timestamp: 'Mon', read: true, isFromMe: true },
      { id: 'm13', threadId: 't4', senderId: 'c4', senderName: 'Mike Torres', content: 'On it. I\'ll head over there this afternoon.', timestamp: 'Mon', read: true, isFromMe: false },
      { id: 'm14', threadId: 't4', senderId: 'c4', senderName: 'Mike Torres', content: 'Found two witnesses who saw the incident. Sending statements.', timestamp: 'Mon', read: true, isFromMe: false },
    ]
  },
];

export const contactTypeLabels: Record<Contact['type'], string> = {
  'client': 'Client',
  'co-counsel': 'Co-Counsel',
  'investigator': 'Investigator',
  'expert': 'Expert',
  'other': 'Other',
};

export const contactTypeColors: Record<Contact['type'], string> = {
  'client': 'bg-blue-50 text-blue-700 border-blue-200',
  'co-counsel': 'bg-purple-50 text-purple-700 border-purple-200',
  'investigator': 'bg-amber-50 text-amber-700 border-amber-200',
  'expert': 'bg-emerald-50 text-emerald-700 border-emerald-200',
  'other': 'bg-slate-50 text-slate-700 border-slate-200',
};
