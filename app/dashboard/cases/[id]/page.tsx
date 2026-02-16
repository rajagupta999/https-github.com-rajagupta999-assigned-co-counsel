'use client';

import { useState } from 'react';
import { useRouter, useParams } from 'next/navigation';
import DictationButton from '@/components/DictationButton';
// DashboardShell is provided by the layout

// Mock case data - in production, this comes from Firestore
const MOCK_CASE = {
  id: '1',
  title: 'People v. Martinez',
  caseType: 'criminal' as const,
  clientName: 'Juan Martinez',
  docketNumber: 'CR-2024-12345',
  court: 'Kings County Criminal Court',
  judge: 'Hon. Sarah Johnson',
  nextCourtDate: new Date('2026-02-15'),
  status: 'active' as const,
  arraignmentDate: new Date('2024-12-01'),
  charges: [
    { statute: 'PL 160.15', description: 'Robbery 1st Degree', class: 'B Felony', count: 1 },
    { statute: 'PL 120.05', description: 'Assault 2nd Degree', class: 'D Felony', count: 1 },
  ],
  keyFacts: [
    'Incident occurred on 11/15/2024 at approximately 10:30 PM',
    'Complainant identified client from photo array',
    'No physical evidence recovered',
    'Client maintains innocence - claims mistaken identification',
  ],
  caseStrategy: 'Challenge identification procedure; investigate alibi witnesses',
  opposingCounsel: 'ADA Michael Chen',
};

type TabType = 'overview' | 'documents' | 'discovery' | 'timeline' | 'copilot';

export default function CaseDetailPage() {
  const params = useParams();
  const id = params?.id as string || '1';
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<TabType>('overview');
  const [caseData] = useState(MOCK_CASE);

  const tabs = [
    { id: 'overview', label: 'Overview', icon: '📋' },
    { id: 'documents', label: 'Documents', icon: '📁' },
    { id: 'discovery', label: 'Discovery', icon: '🔍' },
    { id: 'timeline', label: 'Timeline', icon: '📅' },
    { id: 'copilot', label: 'Case AI', icon: '🤖' },
  ];

  return (
      <div className="p-4 sm:p-6 lg:p-8 max-w-[1400px] mx-auto space-y-6 animate-fade-in pb-12">
        {/* Header */}
        <div className="flex items-start justify-between">
          <div>
            <button 
              onClick={() => router.push('/dashboard/cases')}
              className="text-sm text-gray-500 hover:text-gray-700 mb-2"
            >
              ← Back to Cases
            </button>
            <h1 className="text-2xl font-bold text-gray-900">{caseData.title}</h1>
            <div className="flex items-center gap-4 mt-2 text-sm text-gray-600">
              <span className="flex items-center gap-1">
                <span>📍</span> {caseData.court}
              </span>
              <span className="flex items-center gap-1">
                <span>⚖️</span> {caseData.judge}
              </span>
              <span className="flex items-center gap-1">
                <span>📋</span> {caseData.docketNumber}
              </span>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <span className={`px-3 py-1 rounded-full text-sm font-medium ${
              caseData.status === 'active' ? 'bg-green-100 text-green-700' :
              caseData.status === 'pending' ? 'bg-yellow-100 text-yellow-700' :
              'bg-gray-100 text-gray-700'
            }`}>
              {caseData.status.charAt(0).toUpperCase() + caseData.status.slice(1)}
            </span>
            <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">
              Edit Case
            </button>
          </div>
        </div>

        {/* Next Court Date Alert */}
        {caseData.nextCourtDate && (
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <span className="text-2xl">📅</span>
              <div>
                <p className="font-semibold text-blue-900">Next Court Date</p>
                <p className="text-blue-700">
                  {caseData.nextCourtDate.toLocaleDateString('en-US', { 
                    weekday: 'long', 
                    year: 'numeric', 
                    month: 'long', 
                    day: 'numeric' 
                  })}
                </p>
              </div>
            </div>
            <button className="text-blue-600 hover:text-blue-800 text-sm font-medium">
              Add to Calendar →
            </button>
          </div>
        )}

        {/* Tabs */}
        <div className="border-b border-gray-200">
          <nav className="flex gap-4">
            {tabs.map(tab => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as TabType)}
                className={`flex items-center gap-2 px-4 py-3 border-b-2 transition-colors ${
                  activeTab === tab.id
                    ? 'border-blue-600 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700'
                }`}
              >
                <span>{tab.icon}</span>
                {tab.label}
              </button>
            ))}
          </nav>
        </div>

        {/* Tab Content */}
        <div className="min-h-[400px]">
          {activeTab === 'overview' && <OverviewTab caseData={caseData} />}
          {activeTab === 'documents' && <DocumentsTab caseId={id} />}
          {activeTab === 'discovery' && <DiscoveryTab caseData={caseData} />}
          {activeTab === 'timeline' && <TimelineTab caseData={caseData} />}
          {activeTab === 'copilot' && <CopilotTab caseData={caseData} />}
        </div>
      </div>
  );
}

function OverviewTab({ caseData }: { caseData: typeof MOCK_CASE }) {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      {/* Client Info */}
      <div className="bg-white rounded-xl border border-gray-200 p-6">
        <h3 className="font-semibold text-gray-900 mb-4">Client Information</h3>
        <div className="space-y-3">
          <div className="flex justify-between">
            <span className="text-gray-500">Name</span>
            <span className="font-medium">{caseData.clientName}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-500">Arraignment</span>
            <span className="font-medium">{caseData.arraignmentDate?.toLocaleDateString()}</span>
          </div>
        </div>
      </div>

      {/* Charges */}
      <div className="bg-white rounded-xl border border-gray-200 p-6">
        <h3 className="font-semibold text-gray-900 mb-4">Charges</h3>
        <div className="space-y-3">
          {caseData.charges?.map((charge, i) => (
            <div key={i} className="flex items-start justify-between p-3 bg-gray-50 rounded-lg">
              <div>
                <p className="font-medium">{charge.description}</p>
                <p className="text-sm text-gray-500">{charge.statute}</p>
              </div>
              <span className="text-sm font-medium text-red-600">{charge.class}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Key Facts */}
      <div className="bg-white rounded-xl border border-gray-200 p-6">
        <h3 className="font-semibold text-gray-900 mb-4">Key Facts</h3>
        <ul className="space-y-2">
          {caseData.keyFacts.map((fact, i) => (
            <li key={i} className="flex items-start gap-2">
              <span className="text-blue-500">•</span>
              <span className="text-gray-700">{fact}</span>
            </li>
          ))}
        </ul>
      </div>

      {/* Case Strategy */}
      <div className="bg-white rounded-xl border border-gray-200 p-6">
        <h3 className="font-semibold text-gray-900 mb-4">Case Strategy</h3>
        <p className="text-gray-700">{caseData.caseStrategy}</p>
        <button className="mt-4 text-blue-600 hover:text-blue-800 text-sm font-medium">
          Edit Strategy →
        </button>
      </div>
    </div>
  );
}

function DocumentsTab({ caseId }: { caseId: string }) {
  const [documents] = useState([
    { id: '1', name: 'Arrest Report.pdf', category: 'police_report', size: 245000, status: 'indexed', uploadedAt: new Date('2024-12-05') },
    { id: '2', name: 'Photo Array.pdf', category: 'evidence', size: 1200000, status: 'indexed', uploadedAt: new Date('2024-12-10') },
    { id: '3', name: 'Complaint Report.pdf', category: 'police_report', size: 89000, status: 'processing', uploadedAt: new Date('2024-12-15') },
    { id: '4', name: 'Body Camera Footage Request.docx', category: 'correspondence', size: 45000, status: 'indexed', uploadedAt: new Date('2024-12-20') },
  ]);
  
  const [dragActive, setDragActive] = useState(false);

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setDragActive(false);
    // Handle file upload
    const files = Array.from(e.dataTransfer.files);
    console.log('Files dropped:', files);
  };

  return (
    <div className="space-y-6">
      {/* Upload Area */}
      <div 
        className={`border-2 border-dashed rounded-xl p-8 text-center transition-colors ${
          dragActive ? 'border-blue-500 bg-blue-50' : 'border-gray-300'
        }`}
        onDragOver={(e) => { e.preventDefault(); setDragActive(true); }}
        onDragLeave={() => setDragActive(false)}
        onDrop={handleDrop}
      >
        <div className="text-4xl mb-3">📤</div>
        <p className="text-gray-600 mb-2">Drag and drop files here, or</p>
        <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">
          Browse Files
        </button>
        <p className="text-sm text-gray-500 mt-2">
          Supports PDF, Word, images. Files are OCR'd and indexed for AI search.
        </p>
      </div>

      {/* Document List */}
      <div className="bg-white rounded-xl border border-gray-200">
        <div className="p-4 border-b border-gray-200 flex items-center justify-between">
          <h3 className="font-semibold">Documents ({documents.length})</h3>
          <input 
            type="text" 
            placeholder="Search documents..."
            className="px-3 py-2 border border-gray-200 rounded-lg text-sm w-64"
          />
        </div>
        <div className="divide-y divide-gray-100">
          {documents.map(doc => (
            <div key={doc.id} className="p-4 flex items-center justify-between hover:bg-gray-50">
              <div className="flex items-center gap-3">
                <span className="text-2xl">
                  {doc.category === 'police_report' ? '🚔' : 
                   doc.category === 'evidence' ? '📷' : '📄'}
                </span>
                <div>
                  <p className="font-medium text-gray-900">{doc.name}</p>
                  <p className="text-sm text-gray-500">
                    {(doc.size / 1000).toFixed(0)} KB • Uploaded {doc.uploadedAt.toLocaleDateString()}
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <span className={`px-2 py-1 rounded text-xs font-medium ${
                  doc.status === 'indexed' ? 'bg-green-100 text-green-700' :
                  'bg-yellow-100 text-yellow-700'
                }`}>
                  {doc.status === 'indexed' ? '✓ Indexed' : '⏳ Processing'}
                </span>
                <button className="text-gray-400 hover:text-gray-600">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 5v.01M12 12v.01M12 19v.01M12 6a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2z" />
                  </svg>
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function DiscoveryTab({ caseData }: { caseData: typeof MOCK_CASE }) {
  const [discoveryItems] = useState([
    { id: '1', type: 'Police Reports', status: 'received', cpl: '245.20(1)(e)', docs: 2 },
    { id: '2', type: 'Body Camera Footage', status: 'requested', cpl: '245.20(1)(g)', docs: 0 },
    { id: '3', type: 'Witness Statements', status: 'partial', cpl: '245.20(1)(a)', docs: 1 },
    { id: '4', type: '911 Calls/CAD', status: 'requested', cpl: '245.20(1)(g)', docs: 0 },
    { id: '5', type: 'Photo Array Procedure', status: 'received', cpl: '245.20(1)(e)', docs: 1 },
    { id: '6', type: 'Grand Jury Minutes', status: 'requested', cpl: '245.20(1)(c)', docs: 0 },
    { id: '7', type: 'Rap Sheets', status: 'received', cpl: '245.20(1)(p)', docs: 1 },
    { id: '8', type: 'Brady/Giglio Material', status: 'requested', cpl: '245.20(1)(k)', docs: 0 },
  ]);

  const received = discoveryItems.filter(i => i.status === 'received').length;
  const total = discoveryItems.length;
  const percentComplete = Math.round((received / total) * 100);

  return (
    <div className="space-y-6">
      {/* Summary Card */}
      <div className="bg-gradient-to-r from-blue-600 to-blue-700 rounded-xl p-6 text-white">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-lg font-semibold mb-1">CPL 245 Discovery Status</h3>
            <p className="text-blue-100">
              {received} of {total} categories received ({percentComplete}% complete)
            </p>
          </div>
          <div className="text-right">
            <div className="text-3xl font-bold">{percentComplete}%</div>
            <button className="mt-2 px-3 py-1 bg-white/20 rounded-lg text-sm hover:bg-white/30">
              Generate Demand Letter
            </button>
          </div>
        </div>
        <div className="mt-4 bg-white/20 rounded-full h-2">
          <div 
            className="bg-white rounded-full h-2 transition-all"
            style={{ width: `${percentComplete}%` }}
          />
        </div>
      </div>

      {/* Discovery Checklist */}
      <div className="bg-white rounded-xl border border-gray-200">
        <div className="p-4 border-b border-gray-200">
          <h3 className="font-semibold">Discovery Checklist</h3>
        </div>
        <div className="divide-y divide-gray-100">
          {discoveryItems.map(item => (
            <div key={item.id} className="p-4 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <span className={`w-8 h-8 rounded-full flex items-center justify-center ${
                  item.status === 'received' ? 'bg-green-100 text-green-600' :
                  item.status === 'partial' ? 'bg-yellow-100 text-yellow-600' :
                  'bg-gray-100 text-gray-400'
                }`}>
                  {item.status === 'received' ? '✓' : 
                   item.status === 'partial' ? '◐' : '○'}
                </span>
                <div>
                  <p className="font-medium text-gray-900">{item.type}</p>
                  <p className="text-sm text-gray-500">{item.cpl}</p>
                </div>
              </div>
              <div className="flex items-center gap-4">
                {item.docs > 0 && (
                  <span className="text-sm text-gray-500">{item.docs} doc(s)</span>
                )}
                <select 
                  defaultValue={item.status}
                  className="px-3 py-1 border border-gray-200 rounded-lg text-sm"
                >
                  <option value="requested">Requested</option>
                  <option value="partial">Partial</option>
                  <option value="received">Received</option>
                  <option value="objected">Objected</option>
                  <option value="n/a">N/A</option>
                </select>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function TimelineTab({ caseData }: { caseData: typeof MOCK_CASE }) {
  const events = [
    { date: '2024-11-15', type: 'incident', title: 'Alleged Incident', description: 'Incident at 123 Main St' },
    { date: '2024-11-16', type: 'arrest', title: 'Arrest', description: 'Client arrested at home' },
    { date: '2024-12-01', type: 'court', title: 'Arraignment', description: 'Bail set at $50,000' },
    { date: '2024-12-15', type: 'filing', title: 'Discovery Demand Filed', description: 'CPL 245 demand letter sent' },
    { date: '2025-01-10', type: 'court', title: 'Conference', description: 'Discovery status conference' },
    { date: '2026-02-15', type: 'court', title: 'Next Court Date', description: 'Motion hearing scheduled' },
  ];

  return (
    <div className="bg-white rounded-xl border border-gray-200 p-6">
      <div className="relative">
        <div className="absolute left-4 top-0 bottom-0 w-0.5 bg-gray-200" />
        <div className="space-y-6">
          {events.map((event, i) => (
            <div key={i} className="relative pl-10">
              <div className={`absolute left-2 w-5 h-5 rounded-full border-2 border-white ${
                event.type === 'court' ? 'bg-blue-500' :
                event.type === 'arrest' ? 'bg-red-500' :
                event.type === 'filing' ? 'bg-green-500' :
                'bg-gray-400'
              }`} />
              <div className="bg-gray-50 rounded-lg p-4">
                <div className="flex items-center justify-between mb-1">
                  <span className="font-semibold text-gray-900">{event.title}</span>
                  <span className="text-sm text-gray-500">{event.date}</span>
                </div>
                <p className="text-gray-600">{event.description}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
      <button className="mt-6 w-full py-2 border border-gray-200 rounded-lg text-gray-600 hover:bg-gray-50">
        + Add Event
      </button>
    </div>
  );
}

function CopilotTab({ caseData }: { caseData: typeof MOCK_CASE }) {
  const [messages, setMessages] = useState<Array<{ role: 'user' | 'assistant'; content: string }>>([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const suggestedQuestions = [
    'What are the elements the DA must prove for Robbery 1st?',
    'What are our best defenses given the facts?',
    'Draft a motion to suppress the photo array identification',
    'What discovery is still outstanding?',
  ];

  const sendMessage = async (text: string) => {
    const userMessage = text || input;
    if (!userMessage.trim()) return;
    
    setMessages(prev => [...prev, { role: 'user', content: userMessage }]);
    setInput('');
    setIsLoading(true);

    // Simulate AI response
    setTimeout(() => {
      setMessages(prev => [...prev, { 
        role: 'assistant', 
        content: `Based on the case file for **${caseData.title}**:

**Re: ${userMessage.slice(0, 50)}...**

Given that your client is charged with Robbery 1st (PL 160.15) and Assault 2nd (PL 120.05), and the key facts indicate the case relies heavily on photo array identification with no physical evidence, here are my thoughts:

**Key Legal Issues:**
1. **Identification Procedure** - Photo array identifications must comply with CPL 60.25 and 60.30. Challenge if lineup was suggestive. *See People v. Chipp, 75 N.Y.2d 327 (1990)*.

2. **Corroboration** - With no physical evidence, the identification alone must be scrutinized. *See People v. Whalen, 59 N.Y.2d 273 (1983)*.

**Recommended Next Steps:**
- Request body camera footage immediately
- Investigate alibi witnesses
- Review photo array procedure documents for Wade/Bigby issues

*Note: This analysis is based on the case facts provided. Please verify all citations before relying on them in court filings.*`
      }]);
      setIsLoading(false);
    }, 1500);
  };

  return (
    <div className="bg-white rounded-xl border border-gray-200 h-[600px] flex flex-col">
      {/* Header */}
      <div className="p-4 border-b border-gray-200 bg-gray-50">
        <div className="flex items-center gap-2">
          <span className="text-xl">🤖</span>
          <div>
            <h3 className="font-semibold">Case AI Assistant</h3>
            <p className="text-sm text-gray-500">Context: {caseData.title}</p>
          </div>
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.length === 0 && (
          <div className="text-center py-8">
            <p className="text-gray-500 mb-4">Ask me anything about this case</p>
            <div className="space-y-2">
              {suggestedQuestions.map((q, i) => (
                <button
                  key={i}
                  onClick={() => sendMessage(q)}
                  className="block w-full text-left px-4 py-2 bg-gray-50 rounded-lg hover:bg-gray-100 text-sm text-gray-700"
                >
                  {q}
                </button>
              ))}
            </div>
          </div>
        )}
        {messages.map((msg, i) => (
          <div key={i} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
            <div className={`max-w-[80%] p-3 rounded-lg ${
              msg.role === 'user' 
                ? 'bg-blue-600 text-white' 
                : 'bg-gray-100 text-gray-800'
            }`}>
              <div className="whitespace-pre-wrap">{msg.content}</div>
            </div>
          </div>
        ))}
        {isLoading && (
          <div className="flex justify-start">
            <div className="bg-gray-100 p-3 rounded-lg">
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" />
                <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }} />
                <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.4s' }} />
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Input */}
      <div className="p-4 border-t border-gray-200">
        <div className="flex gap-2">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && sendMessage(input)}
            placeholder="Ask about this case..."
            className="flex-1 px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
          <DictationButton
            onTranscript={(text) => setInput(prev => prev ? prev + ' ' + text : text)}
            size="md"
          />
          <button
            onClick={() => sendMessage(input)}
            disabled={isLoading || !input.trim()}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50"
          >
            Send
          </button>
        </div>
      </div>
    </div>
  );
}
