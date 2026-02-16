"use client";

import { useState, useEffect, useRef } from 'react';

type Channel = 'sms' | 'email' | 'whatsapp' | 'imessage';
type MessageStatus = 'sent' | 'delivered' | 'read' | 'failed';

interface Contact {
  id: string;
  name: string;
  phone: string;
  email: string;
  caseId: string;
  caseName: string;
}

interface Message {
  id: string;
  contactId: string;
  channel: Channel;
  direction: 'in' | 'out';
  text: string;
  subject?: string;
  timestamp: string;
  status: MessageStatus;
  attachments?: string[];
}

const CHANNEL_CONFIG: Record<Channel, { label: string; color: string; bg: string; icon: string; outBg: string }> = {
  sms: { label: 'SMS', color: 'text-emerald-600', bg: 'bg-emerald-100', icon: '💬', outBg: 'bg-navy-800' },
  email: { label: 'Email', color: 'text-purple-600', bg: 'bg-purple-100', icon: '✉️', outBg: 'bg-purple-600' },
  whatsapp: { label: 'WhatsApp', color: 'text-green-600', bg: 'bg-green-100', icon: '📱', outBg: 'bg-green-600' },
  imessage: { label: 'iMessage', color: 'text-blue-600', bg: 'bg-blue-100', icon: '🔵', outBg: 'bg-blue-500' },
};

const STATUS_ICONS: Record<MessageStatus, string> = {
  sent: '✓', delivered: '✓✓', read: '✓✓', failed: '✗',
};

const SAMPLE_CONTACTS: Contact[] = [
  { id: 'c1', name: 'John Doe', phone: '(917) 555-0123', email: 'john@email.com', caseId: 'CR-2025-001234', caseName: 'People v. Doe' },
  { id: 'c2', name: 'Jane Smith', phone: '(646) 555-0456', email: 'jane@email.com', caseId: 'CR-2025-004567', caseName: 'People v. Smith' },
  { id: 'c3', name: 'Maria Garcia', phone: '(718) 555-0789', email: 'maria.garcia@gmail.com', caseId: 'FAM-2025-002345', caseName: 'In re Garcia' },
  { id: 'c4', name: 'ADA Johnson', phone: '(212) 555-0321', email: 'ajohnson@da.nyc.gov', caseId: 'CR-2025-001234', caseName: 'People v. Doe' },
  { id: 'c5', name: 'Dr. Sarah Kim (Expert)', phone: '(347) 555-0654', email: 'skim@forensics.com', caseId: 'CR-2025-001234', caseName: 'People v. Doe' },
  { id: 'c6', name: 'David Park', phone: '(516) 555-0987', email: 'dpark@gmail.com', caseId: 'EST-2025-003456', caseName: 'Park Estate' },
];

const SAMPLE_MESSAGES: Message[] = [
  // John Doe — SMS + Email mix
  { id: 'm1', contactId: 'c1', channel: 'sms', direction: 'out', text: 'Hi John, this is Raja from Assigned Co-Counsel. Your next court date is Feb 20. Please arrive by 9:30 AM at 320 Jay St, Part 23.', timestamp: '2025-02-14T10:30:00', status: 'delivered' },
  { id: 'm2', contactId: 'c1', channel: 'sms', direction: 'in', text: 'Ok thank you. Do I need to bring anything?', timestamp: '2025-02-14T10:45:00', status: 'read' },
  { id: 'm3', contactId: 'c1', channel: 'sms', direction: 'out', text: 'Just your ID. We\'ll discuss the motion beforehand. I\'ll be in the hallway outside Part 23 at 9:15.', timestamp: '2025-02-14T11:00:00', status: 'read' },
  { id: 'm14', contactId: 'c1', channel: 'email', direction: 'out', subject: 'Court Date Confirmation — People v. Doe (CR-2025-001234)', text: 'Dear John,\n\nThis email confirms your upcoming court appearance:\n\n• Date: February 20, 2025\n• Time: 9:30 AM (please arrive by 9:15)\n• Location: 320 Jay Street, Brooklyn, NY — Part 23\n• Judge: Hon. Patricia Williams\n\nPlease bring a valid photo ID. We will discuss the pending suppression motion before the hearing. If you have any questions, do not hesitate to reply to this email or text me.\n\nBest regards,\nRaja Gupta\nAssigned Co-Counsel', timestamp: '2025-02-14T12:00:00', status: 'delivered' },
  { id: 'm15', contactId: 'c1', channel: 'email', direction: 'in', subject: 'Re: Court Date Confirmation — People v. Doe (CR-2025-001234)', text: 'Got it, thank you Raja. I\'ll be there at 9:15. One question — should I wear a suit? I don\'t have one but I can borrow from my brother.\n\nJohn', timestamp: '2025-02-14T14:20:00', status: 'read' },
  { id: 'm16', contactId: 'c1', channel: 'sms', direction: 'out', text: 'John — just saw your email. Dress shirt and slacks are fine, no suit required. See you Thursday!', timestamp: '2025-02-14T14:35:00', status: 'delivered' },

  // Jane Smith — SMS + Email
  { id: 'm4', contactId: 'c2', channel: 'sms', direction: 'out', text: 'Jane, good news — the DA offered an ACD. We should discuss. When are you available?', timestamp: '2025-02-13T14:00:00', status: 'read' },
  { id: 'm5', contactId: 'c2', channel: 'sms', direction: 'in', text: 'That\'s great! I\'m free tomorrow after 2pm.', timestamp: '2025-02-13T14:30:00', status: 'read' },
  { id: 'm6', contactId: 'c2', channel: 'sms', direction: 'out', text: 'Perfect. I\'ll call you at 2:30. In the meantime, the ACD means the case gets dismissed after 6 months if you stay out of trouble.', timestamp: '2025-02-13T14:35:00', status: 'delivered' },
  { id: 'm17', contactId: 'c2', channel: 'email', direction: 'out', subject: 'ACD Offer Details — People v. Smith', text: 'Dear Jane,\n\nAs discussed, the District Attorney has offered an Adjournment in Contemplation of Dismissal (ACD). Here are the key details:\n\n1. The case will be adjourned for 6 months\n2. If you have no new arrests during that period, the case is automatically dismissed and sealed\n3. There are no conditions attached (no community service, no programs)\n4. This will NOT result in a criminal record\n\nI strongly recommend accepting this offer. Please review and let me know if you have questions.\n\nBest,\nRaja Gupta', timestamp: '2025-02-13T16:00:00', status: 'read', attachments: ['ACD_Offer_Letter.pdf'] },

  // Maria Garcia — WhatsApp + Email
  { id: 'm7', contactId: 'c3', channel: 'whatsapp', direction: 'in', text: 'Abogado, cuando es la proxima fecha? My mother is asking.', timestamp: '2025-02-12T09:00:00', status: 'read' },
  { id: 'm8', contactId: 'c3', channel: 'whatsapp', direction: 'out', text: 'Maria, su próxima fecha es el 25 de febrero en Bronx Family Court. The hearing starts at 10 AM. I will be there.', timestamp: '2025-02-12T09:15:00', status: 'read' },
  { id: 'm18', contactId: 'c3', channel: 'email', direction: 'out', subject: 'Custody Hearing Preparation — In re Garcia', text: 'Dear Maria,\n\nI am writing to help you prepare for the upcoming custody hearing on February 25th.\n\nPlease gather the following documents:\n• Proof of residence (lease or utility bill)\n• Pay stubs from the last 3 months\n• Children\'s school records\n• Any character reference letters\n\nWe will meet at my office on Feb 24 at 3 PM to prepare. Please bring everything listed above.\n\nSi necesita esta información en español, por favor avíseme.\n\nBest regards,\nRaja Gupta', timestamp: '2025-02-12T10:00:00', status: 'delivered' },
  { id: 'm19', contactId: 'c3', channel: 'whatsapp', direction: 'in', text: 'Received your email. I have most of the documents. Can my mother come to the meeting on the 24th?', timestamp: '2025-02-12T12:30:00', status: 'read' },

  // ADA Johnson — SMS + Email
  { id: 'm9', contactId: 'c4', channel: 'sms', direction: 'out', text: 'Counselor, following up on the discovery request in People v. Doe. Any update on the BWC footage?', timestamp: '2025-02-14T15:00:00', status: 'delivered' },
  { id: 'm10', contactId: 'c4', channel: 'sms', direction: 'in', text: 'Should have it by end of week. Will upload to the portal.', timestamp: '2025-02-14T16:30:00', status: 'read' },
  { id: 'm20', contactId: 'c4', channel: 'email', direction: 'in', subject: 'Discovery Production — People v. Doe (CR-2025-001234)', text: 'Counselor,\n\nPlease find attached the following discovery materials for the above-referenced case:\n\n1. Body-worn camera footage (Officer Martinez, Badge #4521) — 23 minutes\n2. Arrest report and supporting deposition\n3. Lab report — controlled substance analysis\n4. Witness statement — complainant\n\nPlease confirm receipt. Additional materials will be produced on a rolling basis.\n\nRegards,\nADA Michael Johnson\nKings County District Attorney\'s Office', timestamp: '2025-02-15T09:00:00', status: 'read', attachments: ['BWC_Martinez_4521.mp4', 'Arrest_Report.pdf', 'Lab_Report.pdf', 'Witness_Statement.pdf'] },

  // Dr. Kim — SMS + Email
  { id: 'm11', contactId: 'c5', channel: 'sms', direction: 'out', text: 'Dr. Kim, can you review the toxicology report for Doe? I need to know if their findings are sound.', timestamp: '2025-02-11T11:00:00', status: 'read' },
  { id: 'm12', contactId: 'c5', channel: 'sms', direction: 'in', text: 'Send it over. I can have a preliminary opinion within 48 hours. My rate is $250/hr for case review.', timestamp: '2025-02-11T13:00:00', status: 'read' },
  { id: 'm21', contactId: 'c5', channel: 'email', direction: 'out', subject: 'Toxicology Report for Review — People v. Doe', text: 'Dr. Kim,\n\nThank you for agreeing to review this matter. Attached is the toxicology/lab report from the People\'s case.\n\nKey questions:\n1. Was the testing methodology appropriate?\n2. Are the chain-of-custody procedures adequate?\n3. Any issues with the quantitative analysis?\n\nPlease provide a preliminary written opinion. If this goes to hearing, we may need you to testify.\n\nBest,\nRaja Gupta', timestamp: '2025-02-11T14:00:00', status: 'read', attachments: ['Tox_Report_Doe.pdf'] },
  { id: 'm22', contactId: 'c5', channel: 'email', direction: 'in', subject: 'Re: Toxicology Report for Review — People v. Doe', text: 'Raja,\n\nPreliminary review complete. I have significant concerns:\n\n1. The gas chromatography-mass spectrometry (GC-MS) confirmation test was not performed — they relied solely on immunoassay screening\n2. Chain of custody has a 6-hour gap between collection and lab receipt\n3. The threshold levels used are below standard cutoffs\n\nThis report has exploitable weaknesses. I recommend filing a motion to suppress or at minimum a Frye hearing to challenge the methodology.\n\nFull written report to follow. 3.5 hours billed.\n\nDr. Sarah Kim, Ph.D.\nForensic Toxicology Consulting', timestamp: '2025-02-13T10:00:00', status: 'read' },

  // David Park — iMessage
  { id: 'm23', contactId: 'c6', channel: 'imessage', direction: 'out', text: 'David, this is Raja. I\'ve reviewed your father\'s estate documents. Can we schedule a call this week?', timestamp: '2025-02-15T09:00:00', status: 'delivered' },
  { id: 'm24', contactId: 'c6', channel: 'imessage', direction: 'in', text: 'Hi Raja. Yes, I\'m free Tuesday or Wednesday afternoon. My sister wants to join too if that\'s okay.', timestamp: '2025-02-15T10:15:00', status: 'read' },
  { id: 'm25', contactId: 'c6', channel: 'imessage', direction: 'out', text: 'Of course. Let\'s do Wednesday at 3 PM. I\'ll send a Zoom link. Bring any documents your father may have mentioned.', timestamp: '2025-02-15T10:30:00', status: 'read' },
];

function formatTime(ts: string) {
  const d = new Date(ts);
  const now = new Date();
  const diffDays = Math.floor((now.getTime() - d.getTime()) / (1000 * 60 * 60 * 24));
  if (diffDays === 0) return d.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' });
  if (diffDays === 1) return 'Yesterday';
  if (diffDays < 7) return d.toLocaleDateString('en-US', { weekday: 'short' });
  return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
}

function EmailCard({ msg, isOut }: { msg: Message; isOut: boolean }) {
  const [expanded, setExpanded] = useState(false);
  return (
    <div className={`flex ${isOut ? 'justify-end' : 'justify-start'}`}>
      <div className={`max-w-[85%] sm:max-w-[70%] rounded-xl border overflow-hidden ${isOut ? 'border-purple-200 bg-purple-50' : 'border-slate-200 bg-white'}`}>
        {/* Email header */}
        <div className={`px-4 py-2.5 border-b ${isOut ? 'border-purple-200 bg-purple-100/50' : 'border-slate-100 bg-slate-50'} cursor-pointer`} onClick={() => setExpanded(!expanded)}>
          <div className="flex items-center gap-2 mb-0.5">
            <span className="text-xs">✉️</span>
            <span className={`text-xs font-semibold ${isOut ? 'text-purple-700' : 'text-slate-700'}`}>{msg.subject || '(No subject)'}</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-[10px] text-slate-400">{new Date(msg.timestamp).toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' })}</span>
            {isOut && (
              <span className={`text-[10px] ${msg.status === 'read' ? 'text-blue-500' : msg.status === 'failed' ? 'text-red-500' : 'text-slate-400'}`}>
                {STATUS_ICONS[msg.status]}
              </span>
            )}
            <span className="text-[10px] text-slate-400 ml-auto">{expanded ? '▲' : '▼'}</span>
          </div>
        </div>
        {/* Email body */}
        <div className={`px-4 py-3 ${expanded ? '' : 'max-h-24 overflow-hidden relative'}`}>
          <p className="text-sm text-slate-700 whitespace-pre-line leading-relaxed">{msg.text}</p>
          {!expanded && (
            <div className="absolute bottom-0 left-0 right-0 h-8 bg-gradient-to-t from-white to-transparent pointer-events-none" />
          )}
        </div>
        {/* Attachments */}
        {msg.attachments && msg.attachments.length > 0 && (
          <div className={`px-4 py-2 border-t ${isOut ? 'border-purple-200' : 'border-slate-100'}`}>
            <div className="flex flex-wrap gap-1.5">
              {msg.attachments.map((file, i) => (
                <span key={i} className="inline-flex items-center gap-1 bg-slate-100 text-slate-600 text-[10px] px-2 py-1 rounded-md">
                  <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M21.44 11.05l-9.19 9.19a6 6 0 0 1-8.49-8.49l9.19-9.19a4 4 0 0 1 5.66 5.66l-9.2 9.19a2 2 0 0 1-2.83-2.83l8.49-8.48"/></svg>
                  {file}
                </span>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

function SmsBubble({ msg, isOut, channel }: { msg: Message; isOut: boolean; channel: Channel }) {
  const bubbleColor = isOut
    ? channel === 'whatsapp' ? 'bg-green-600 text-white' : 'bg-navy-800 text-white'
    : 'bg-white border border-slate-200 text-slate-800';

  return (
    <div className={`flex ${isOut ? 'justify-end' : 'justify-start'}`}>
      <div className={`max-w-[80%] sm:max-w-[65%] rounded-2xl px-4 py-2.5 ${bubbleColor}`}>
        <p className="text-sm leading-relaxed">{msg.text}</p>
        <div className={`flex items-center justify-end gap-1 mt-1 ${isOut ? 'text-white/60' : 'text-slate-400'}`}>
          <span className="text-[10px]">{CHANNEL_CONFIG[channel].icon}</span>
          <span className="text-[10px]">{new Date(msg.timestamp).toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' })}</span>
          {isOut && (
            <span className={`text-[10px] ${msg.status === 'read' ? 'text-blue-300' : msg.status === 'failed' ? 'text-red-300' : ''}`}>
              {STATUS_ICONS[msg.status]}
            </span>
          )}
        </div>
      </div>
    </div>
  );
}

export default function MessagesPage() {
  const [messages, setMessages] = useState<Message[]>(SAMPLE_MESSAGES);
  const [selectedContactId, setSelectedContactId] = useState<string | null>(null);
  const [channelFilter, setChannelFilter] = useState<Channel | 'all'>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [composing, setComposing] = useState(false);
  const [newMessage, setNewMessage] = useState('');
  const [newSubject, setNewSubject] = useState('');
  const [replyChannel, setReplyChannel] = useState<Channel>('sms');
  const [showMobileList, setShowMobileList] = useState(true);
  const [attachments, setAttachments] = useState<string[]>([]);
  const [contactTags, setContactTags] = useState<Record<string, string[]>>({
    'c1': ['People v. Doe', 'Priority'],
    'c2': ['People v. Smith'],
    'c3': ['In re Garcia', 'Spanish'],
    'c4': ['People v. Doe', 'DA Office'],
    'c5': ['People v. Doe', 'Expert'],
    'c6': ['Park Estate'],
  });
  const [showTagMenu, setShowTagMenu] = useState(false);

  const AVAILABLE_TAGS = ['People v. Doe', 'People v. Smith', 'In re Garcia', 'Mitchell Estate', 'Park Estate', 'Priority', 'Follow Up', 'Billing', 'DA Office', 'Expert', 'Spanish'];
  const TAG_COLORS: Record<string, string> = {
    'People v. Doe': 'bg-blue-100 text-blue-700',
    'People v. Smith': 'bg-purple-100 text-purple-700',
    'In re Garcia': 'bg-amber-100 text-amber-700',
    'Mitchell Estate': 'bg-emerald-100 text-emerald-700',
    'Park Estate': 'bg-teal-100 text-teal-700',
    'Priority': 'bg-red-100 text-red-700',
    'Follow Up': 'bg-orange-100 text-orange-700',
    'Billing': 'bg-green-100 text-green-700',
    'DA Office': 'bg-slate-200 text-slate-700',
    'Expert': 'bg-indigo-100 text-indigo-700',
    'Spanish': 'bg-pink-100 text-pink-700',
  };

  const toggleTag = (contactId: string, tag: string) => {
    setContactTags(prev => {
      const current = prev[contactId] || [];
      if (current.includes(tag)) {
        return { ...prev, [contactId]: current.filter(t => t !== tag) };
      }
      return { ...prev, [contactId]: [...current, tag] };
    });
  };
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const selectedContact = SAMPLE_CONTACTS.find(c => c.id === selectedContactId) || null;

  const getLastMessage = (contactId: string) => {
    const msgs = messages.filter(m => m.contactId === contactId);
    return msgs.length > 0 ? msgs.sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime())[0] : null;
  };

  const getUnreadCount = (contactId: string) => {
    return messages.filter(m => m.contactId === contactId && m.direction === 'in' && m.status !== 'read').length;
  };

  const getChannelsUsed = (contactId: string): Channel[] => {
    const channels = new Set(messages.filter(m => m.contactId === contactId).map(m => m.channel));
    return Array.from(channels) as Channel[];
  };

  const filteredContacts = SAMPLE_CONTACTS.filter(c => {
    if (channelFilter !== 'all') {
      const channels = getChannelsUsed(c.id);
      if (!channels.includes(channelFilter)) return false;
    }
    if (searchQuery && !c.name.toLowerCase().includes(searchQuery.toLowerCase()) && !c.caseName.toLowerCase().includes(searchQuery.toLowerCase())) return false;
    return true;
  }).sort((a, b) => {
    const la = getLastMessage(a.id);
    const lb = getLastMessage(b.id);
    if (!la) return 1; if (!lb) return -1;
    return new Date(lb.timestamp).getTime() - new Date(la.timestamp).getTime();
  });

  const threadMessages = messages.filter(m => m.contactId === selectedContactId).sort((a, b) => new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime());

  useEffect(() => { messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' }); }, [threadMessages.length]);

  // Set reply channel to last message's channel when selecting a contact
  useEffect(() => {
    if (selectedContactId) {
      const last = getLastMessage(selectedContactId);
      if (last) setReplyChannel(last.channel);
    }
  }, [selectedContactId]);

  const sendMessage = () => {
    if (!newMessage.trim() || !selectedContactId) return;
    const msg: Message = {
      id: Date.now().toString(36),
      contactId: selectedContactId,
      channel: replyChannel,
      direction: 'out',
      text: newMessage.trim(),
      subject: replyChannel === 'email' ? (newSubject.trim() || undefined) : undefined,
      timestamp: new Date().toISOString(),
      status: 'sent',
      attachments: replyChannel === 'email' && attachments.length > 0 ? [...attachments] : undefined,
    };
    setMessages(prev => [...prev, msg]);
    setNewMessage('');
    setNewSubject('');
    setAttachments([]);
    setTimeout(() => {
      setMessages(prev => prev.map(m => m.id === msg.id ? { ...m, status: 'delivered' as MessageStatus } : m));
    }, 1500);
  };

  const selectContact = (id: string) => {
    setSelectedContactId(id);
    setShowMobileList(false);
    setMessages(prev => prev.map(m => m.contactId === id && m.direction === 'in' ? { ...m, status: 'read' as MessageStatus } : m));
  };

  const mockAttach = () => {
    const fakeFiles = ['Document.pdf', 'Photo.jpg', 'Evidence.pdf', 'Notes.docx', 'Report.xlsx'];
    const pick = fakeFiles[Math.floor(Math.random() * fakeFiles.length)];
    setAttachments(prev => [...prev, pick]);
  };

  return (
    <div className="h-[calc(100vh-3.5rem)] sm:h-[calc(100vh-4rem)] flex flex-col">
      <div className="flex-1 flex overflow-hidden">
        {/* Contact List — Unified by Client Name */}
        <div className={`${showMobileList ? 'flex' : 'hidden'} sm:flex flex-col w-full sm:w-80 lg:w-96 border-r border-slate-200 bg-white`}>
          <div className="p-4 border-b border-slate-200">
            <div className="flex items-center justify-between mb-3">
              <h1 className="text-lg font-bold text-slate-900">Messages</h1>
              <button onClick={() => setComposing(true)} className="w-8 h-8 bg-navy-800 text-white rounded-lg flex items-center justify-center hover:bg-navy-700 transition-colors">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>
              </button>
            </div>
            <input type="text" placeholder="Search contacts or cases..." value={searchQuery} onChange={e => setSearchQuery(e.target.value)}
              className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-300 mb-3" />
            <div className="flex gap-1.5">
              {(['all', 'sms', 'imessage', 'email', 'whatsapp'] as const).map(ch => (
                <button key={ch} onClick={() => setChannelFilter(ch)}
                  className={`px-2.5 py-1 rounded-lg text-xs font-medium transition-colors ${channelFilter === ch ? 'bg-navy-800 text-white' : 'bg-slate-100 text-slate-500 hover:bg-slate-200'}`}>
                  {ch === 'all' ? 'All' : CHANNEL_CONFIG[ch].icon + ' ' + CHANNEL_CONFIG[ch].label}
                </button>
              ))}
            </div>
          </div>

          <div className="flex-1 overflow-y-auto">
            {filteredContacts.map(contact => {
              const lastMsg = getLastMessage(contact.id);
              const unread = getUnreadCount(contact.id);
              const isSelected = selectedContactId === contact.id;
              const channels = getChannelsUsed(contact.id);
              return (
                <div key={contact.id} onClick={() => selectContact(contact.id)}
                  className={`flex items-start gap-3 px-4 py-3 cursor-pointer border-b border-slate-100 transition-colors ${isSelected ? 'bg-blue-50' : 'hover:bg-slate-50'}`}>
                  <div className="w-10 h-10 rounded-full bg-gradient-to-br from-slate-300 to-slate-400 text-white flex items-center justify-center text-sm font-bold flex-shrink-0">
                    {contact.name.split(' ').map(n => n[0]).join('').slice(0, 2)}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between">
                      <span className="font-semibold text-sm text-slate-900 truncate">{contact.name}</span>
                      {lastMsg && <span className="text-[10px] text-slate-400 flex-shrink-0 ml-2">{formatTime(lastMsg.timestamp)}</span>}
                    </div>
                    <div className="flex flex-wrap gap-1 mt-0.5 mb-0.5">
                      {(contactTags[contact.id] || []).slice(0, 2).map(tag => (
                        <span key={tag} className={`text-[9px] font-bold px-1.5 py-0.5 rounded-full ${TAG_COLORS[tag] || 'bg-slate-100 text-slate-600'}`}>{tag}</span>
                      ))}
                      {(contactTags[contact.id] || []).length > 2 && (
                        <span className="text-[9px] text-slate-400">+{(contactTags[contact.id] || []).length - 2}</span>
                      )}
                    </div>
                    <div className="flex items-center gap-1.5 mt-0.5">
                      {/* Show icon for last message type */}
                      {lastMsg && <span className="text-[10px]">{CHANNEL_CONFIG[lastMsg.channel].icon}</span>}
                      {lastMsg && (
                        <p className="text-xs text-slate-500 truncate">
                          {lastMsg.direction === 'out' ? 'You: ' : ''}
                          {lastMsg.channel === 'email' && lastMsg.subject ? lastMsg.subject : lastMsg.text}
                        </p>
                      )}
                    </div>
                    {/* Channel indicators */}
                    <div className="flex gap-1 mt-1">
                      {channels.map(ch => (
                        <span key={ch} className={`text-[9px] px-1.5 py-0.5 rounded ${CHANNEL_CONFIG[ch].bg} ${CHANNEL_CONFIG[ch].color}`}>
                          {CHANNEL_CONFIG[ch].icon}
                        </span>
                      ))}
                    </div>
                  </div>
                  {unread > 0 && <span className="w-5 h-5 bg-blue-600 text-white text-[10px] font-bold rounded-full flex items-center justify-center flex-shrink-0 mt-1">{unread}</span>}
                </div>
              );
            })}
          </div>
        </div>

        {/* Thread View — Interleaved chronologically */}
        <div className={`${!showMobileList ? 'flex' : 'hidden'} sm:flex flex-col flex-1 bg-slate-50`}>
          {selectedContact ? (
            <>
              {/* Thread header */}
              <div className="h-16 px-4 flex items-center gap-3 bg-white border-b border-slate-200 flex-shrink-0">
                <button onClick={() => setShowMobileList(true)} className="sm:hidden p-1 text-slate-500">
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="15 18 9 12 15 6"/></svg>
                </button>
                <div className="w-9 h-9 rounded-full bg-gradient-to-br from-slate-300 to-slate-400 text-white flex items-center justify-center text-xs font-bold">
                  {selectedContact.name.split(' ').map(n => n[0]).join('').slice(0, 2)}
                </div>
                <div className="flex-1 min-w-0">
                  <h2 className="text-sm font-semibold text-slate-900 truncate">{selectedContact.name}</h2>
                  <div className="flex items-center gap-2 flex-wrap">
                    <p className="text-[11px] text-slate-400">{selectedContact.phone} · {selectedContact.email}</p>
                    {(contactTags[selectedContact.id] || []).map(tag => (
                      <span key={tag} className={`text-[9px] font-bold px-1.5 py-0.5 rounded-full cursor-pointer hover:opacity-70 ${TAG_COLORS[tag] || 'bg-slate-100 text-slate-600'}`}
                        onClick={() => toggleTag(selectedContact.id, tag)}>
                        {tag} ×
                      </span>
                    ))}
                    <div className="relative">
                      <button onClick={() => setShowTagMenu(!showTagMenu)} className="text-[10px] font-bold text-blue-600 hover:text-blue-800 bg-blue-50 px-2 py-0.5 rounded-full border border-blue-200">
                        + Tag
                      </button>
                      {showTagMenu && (
                        <>
                          <div className="fixed inset-0 z-40" onClick={() => setShowTagMenu(false)} />
                          <div className="absolute top-full left-0 mt-1 bg-white border border-slate-200 rounded-lg shadow-xl z-50 w-48 max-h-48 overflow-y-auto">
                            {AVAILABLE_TAGS.map(tag => {
                              const isActive = (contactTags[selectedContact.id] || []).includes(tag);
                              return (
                                <button key={tag} onClick={() => { toggleTag(selectedContact.id, tag); }}
                                  className={`w-full text-left px-3 py-1.5 text-xs hover:bg-slate-50 flex items-center justify-between ${isActive ? 'font-bold' : ''}`}>
                                  <span className={`px-1.5 py-0.5 rounded-full ${TAG_COLORS[tag] || 'bg-slate-100'}`}>{tag}</span>
                                  {isActive && <span className="text-blue-600">✓</span>}
                                </button>
                              );
                            })}
                          </div>
                        </>
                      )}
                    </div>
                  </div>
                </div>
                <div className="flex gap-1">
                  {getChannelsUsed(selectedContact.id).map(ch => (
                    <span key={ch} className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${CHANNEL_CONFIG[ch].bg} ${CHANNEL_CONFIG[ch].color}`}>
                      {CHANNEL_CONFIG[ch].icon}
                    </span>
                  ))}
                </div>
              </div>

              {/* Messages — interleaved */}
              <div className="flex-1 overflow-y-auto px-4 py-4 space-y-3">
                {threadMessages.map(msg => {
                  if (msg.channel === 'email') {
                    return <EmailCard key={msg.id} msg={msg} isOut={msg.direction === 'out'} />;
                  }
                  return <SmsBubble key={msg.id} msg={msg} isOut={msg.direction === 'out'} channel={msg.channel} />;
                })}
                <div ref={messagesEndRef} />
              </div>

              {/* Composer with channel dropdown */}
              <div className="p-3 bg-white border-t border-slate-200 flex-shrink-0">
                {/* Reply channel selector */}
                <div className="flex items-center gap-2 mb-2">
                  <span className="text-[11px] text-slate-400 font-medium">Reply via:</span>
                  {(['sms', 'imessage', 'email', 'whatsapp'] as Channel[]).map(ch => (
                    <button key={ch} onClick={() => { setReplyChannel(ch); setAttachments([]); }}
                      className={`px-2.5 py-1 rounded-lg text-[11px] font-medium transition-colors ${replyChannel === ch ? `${CHANNEL_CONFIG[ch].bg} ${CHANNEL_CONFIG[ch].color} ring-1 ring-current` : 'bg-slate-50 text-slate-400 hover:bg-slate-100'}`}>
                      {CHANNEL_CONFIG[ch].icon} {CHANNEL_CONFIG[ch].label}
                    </button>
                  ))}
                </div>
                {/* Email subject line */}
                {replyChannel === 'email' && (
                  <input type="text" value={newSubject} onChange={e => setNewSubject(e.target.value)}
                    placeholder="Subject..."
                    className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-1.5 text-sm mb-2 focus:outline-none focus:ring-2 focus:ring-purple-500/20 focus:border-purple-300" />
                )}
                <div className="flex items-end gap-2">
                  {/* Attach button for email */}
                  {replyChannel === 'email' && (
                    <button onClick={mockAttach} className="w-10 h-10 text-slate-400 hover:text-purple-500 rounded-xl flex items-center justify-center transition-colors flex-shrink-0" title="Attach file">
                      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M21.44 11.05l-9.19 9.19a6 6 0 0 1-8.49-8.49l9.19-9.19a4 4 0 0 1 5.66 5.66l-9.2 9.19a2 2 0 0 1-2.83-2.83l8.49-8.48"/></svg>
                    </button>
                  )}
                  <div className="flex-1">
                    <textarea value={newMessage} onChange={e => setNewMessage(e.target.value)}
                      onKeyDown={e => { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); sendMessage(); } }}
                      placeholder={`Message via ${CHANNEL_CONFIG[replyChannel].label}...`}
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-300 resize-none max-h-32"
                      rows={replyChannel === 'email' ? 3 : 1} />
                  </div>
                  <button onClick={sendMessage} disabled={!newMessage.trim()}
                    className={`w-10 h-10 text-white rounded-xl flex items-center justify-center transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex-shrink-0 ${CHANNEL_CONFIG[replyChannel].outBg} hover:opacity-90`}>
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="22" y1="2" x2="11" y2="13"/><polygon points="22 2 15 22 11 13 2 9 22 2"/></svg>
                  </button>
                </div>
                {/* Attachment pills */}
                {attachments.length > 0 && (
                  <div className="flex flex-wrap gap-1.5 mt-2">
                    {attachments.map((file, i) => (
                      <span key={i} className="inline-flex items-center gap-1 bg-purple-50 text-purple-600 text-[11px] px-2 py-1 rounded-md">
                        📎 {file}
                        <button onClick={() => setAttachments(prev => prev.filter((_, j) => j !== i))} className="ml-0.5 hover:text-red-500">×</button>
                      </span>
                    ))}
                  </div>
                )}
              </div>
            </>
          ) : (
            <div className="flex-1 flex items-center justify-center">
              <div className="text-center">
                <div className="w-16 h-16 bg-slate-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
                  <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#94a3b8" strokeWidth="1.5"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/></svg>
                </div>
                <h2 className="text-lg font-semibold text-slate-700">Omnichannel Messages</h2>
                <p className="text-sm text-slate-400 mt-1">SMS · Email · WhatsApp — all in one place</p>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Compose Modal */}
      {composing && (
        <div className="fixed inset-0 bg-black/40 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl w-full max-w-md p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-bold text-slate-900">New Message</h2>
              <button onClick={() => setComposing(false)} className="p-1 text-slate-400 hover:text-slate-600">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
              </button>
            </div>
            <div className="space-y-4">
              <div>
                <label className="text-xs font-medium text-slate-500 block mb-1">Recipient</label>
                <select className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20"
                  onChange={e => { if (e.target.value) { setSelectedContactId(e.target.value); setComposing(false); setShowMobileList(false); } }}>
                  <option value="">Select contact...</option>
                  {SAMPLE_CONTACTS.map(c => <option key={c.id} value={c.id}>{c.name} — {c.caseName}</option>)}
                </select>
              </div>
              <div>
                <label className="text-xs font-medium text-slate-500 block mb-1">Channel</label>
                <div className="flex gap-2">
                  {(['sms', 'imessage', 'email', 'whatsapp'] as Channel[]).map(ch => (
                    <button key={ch} onClick={() => setReplyChannel(ch)}
                      className={`flex-1 py-2 rounded-lg text-sm font-medium transition-colors ${replyChannel === ch ? `${CHANNEL_CONFIG[ch].bg} ${CHANNEL_CONFIG[ch].color}` : 'bg-slate-100 text-slate-500'}`}>
                      {CHANNEL_CONFIG[ch].icon} {CHANNEL_CONFIG[ch].label}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
