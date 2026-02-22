"use client";

import { useState } from 'react';
import { 
  FileText, Image as ImageIcon, CheckSquare, MessageSquare, 
  Stamp, Download, ChevronRight, AlertCircle, Wand2, Paperclip,
  CheckCircle2, XCircle, Search
} from 'lucide-react';

// ---------- Mock Data ----------
const MOCK_EXHIBITS = [
  { id: 'E-001', name: 'Scene Photo - Intersection.jpg', type: 'image', date: '2026-02-14', status: 'New', stamped: false, client: 'Carlos Martinez' },
  { id: 'E-002', name: '2025-Tax-Returns.pdf', type: 'pdf', date: '2026-02-15', status: 'Reviewed', stamped: false, client: 'Carlos Martinez' },
  { id: 'E-003', name: 'Witness-Statement-Audio.mp3', type: 'audio', date: '2026-02-16', status: 'New', stamped: false, client: 'Carlos Martinez' },
  { id: 'E-004', name: 'Medical-Records-ER.pdf', type: 'pdf', date: '2026-01-20', status: 'Produced', stamped: true, client: 'Carlos Martinez' },
  // AI Labeled examples
  { id: 'E-005', name: 'Tax Return (AI Labeled).pdf', type: 'pdf', date: '2026-02-16', status: 'New', stamped: false, client: 'Carlos Martinez' },
];

const MOCK_REQUESTS = [
  { 
    id: 'R-1', 
    text: 'Identify all persons who witnessed the incident described in the Complaint.', 
    answer: '', 
    status: 'Draft',
    objections: [] as string[]
  },
  { 
    id: 'R-2', 
    text: 'Produce all photographs, diagrams, or other visual representations of the scene of the incident.', 
    answer: 'See attached Exhibit A.', 
    status: 'Review',
    objections: [] as string[]
  },
  { 
    id: 'R-3', 
    text: 'State the total amount of medical expenses incurred as a result of the incident.', 
    answer: '', 
    status: 'Draft',
    objections: [] as string[]
  },
  { 
    id: 'R-4', 
    text: 'Provide copies of all tax returns filed by the Plaintiff for the years 2023 through 2025.', 
    answer: '', 
    status: 'Draft',
    objections: [] as string[]
  }
];

const STANDARD_OBJECTIONS = [
  "Objection: Overbroad and unduly burdensome.",
  "Objection: Vague and ambiguous.",
  "Objection: Calls for a legal conclusion.",
  "Objection: Attorney-Client Privilege.",
  "Objection: Work Product Doctrine.",
  "Objection: Irrelevant and not reasonably calculated to lead to the discovery of admissible evidence."
];

// ---------- Components ----------

export default function DiscoveryDashboard() {
  const [activeTab, setActiveTab] = useState<'exhibits' | 'requests' | 'production'>('exhibits');
  
  // State for Exhibits
  const [exhibits, setExhibits] = useState(MOCK_EXHIBITS);
  const [selectedExhibit, setSelectedExhibit] = useState<string | null>(null);

  // State for Requests
  const [requests, setRequests] = useState(MOCK_REQUESTS);
  const [aiThinking, setAiThinking] = useState<string | null>(null); // request ID

  // State for Production
  const [productionName, setProductionName] = useState('Plaintiff\'s First Production');
  const [generating, setGenerating] = useState(false);

  // --- Actions ---

  const stampExhibit = (id: string) => {
    setExhibits(prev => prev.map(e => e.id === id ? { ...e, stamped: true, status: 'Stamped' } : e));
  };

  const handleObjection = (reqId: string, objection: string) => {
    setRequests(prev => prev.map(r => {
      if (r.id !== reqId) return r;
      const currentAnswer = r.answer || '';
      const newAnswer = currentAnswer ? `${currentAnswer}\n\n${objection}` : objection;
      return { ...r, answer: newAnswer };
    }));
  };

  const suggestObjection = (reqId: string) => {
    setAiThinking(reqId);
    setTimeout(() => {
      setAiThinking(null);
      // Mock AI selecting a random objection relevant to the text (random for now)
      const randomObj = STANDARD_OBJECTIONS[Math.floor(Math.random() * STANDARD_OBJECTIONS.length)];
      handleObjection(reqId, randomObj);
    }, 1000);
  };

  return (
    <div className="p-6 max-w-7xl mx-auto min-h-screen bg-gray-50 text-slate-900">
      
      {/* Header */}
      <div className="mb-8 flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-navy-900">Discovery Management</h1>
          <p className="text-sm text-gray-500">Case: People v. Martinez (Index No. 2026-001)</p>
        </div>
        <div className="flex gap-2">
          <button className="px-4 py-2 bg-white border border-gray-300 rounded-lg text-sm font-medium hover:bg-gray-50 flex items-center gap-2">
            <Download size={16} /> Export All
          </button>
          <button className="px-4 py-2 bg-navy-900 text-white rounded-lg text-sm font-medium hover:bg-navy-800 flex items-center gap-2">
            <MessageSquare size={16} /> Client Portal
          </button>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex border-b border-gray-200 mb-6">
        {[
          { id: 'exhibits', label: 'Exhibit Manager', icon: <Paperclip size={18} /> },
          { id: 'requests', label: 'Interrogatories & Requests', icon: <CheckSquare size={18} /> },
          { id: 'production', label: 'Production Builder', icon: <Stamp size={18} /> },
        ].map(tab => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id as any)}
            className={`flex items-center gap-2 px-6 py-3 text-sm font-medium border-b-2 transition-colors ${
              activeTab === tab.id 
                ? 'border-gold-500 text-navy-900' 
                : 'border-transparent text-gray-500 hover:text-gray-700'
            }`}
          >
            {tab.icon} {tab.label}
          </button>
        ))}
      </div>

      {/* Content Area */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 min-h-[600px]">
        
        {/* --- TAB 1: EXHIBIT MANAGER --- */}
        {activeTab === 'exhibits' && (
          <div className="flex h-full min-h-[600px]">
            {/* Sidebar List */}
            <div className="w-1/3 border-r border-gray-200 p-4 bg-gray-50/50">
              <div className="mb-4 relative">
                <Search className="absolute left-3 top-2.5 text-gray-400" size={16} />
                <input 
                  type="text" 
                  placeholder="Search exhibits..." 
                  className="w-full pl-9 pr-4 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-navy-500 focus:border-transparent"
                />
              </div>
              <div className="space-y-2">
                {exhibits.map(ex => (
                  <div 
                    key={ex.id}
                    onClick={() => setSelectedExhibit(ex.id)}
                    className={`p-3 rounded-lg cursor-pointer transition-colors border ${
                      selectedExhibit === ex.id ? 'bg-navy-50 border-navy-200 shadow-sm' : 'bg-white border-gray-200 hover:border-navy-200'
                    }`}
                  >
                    <div className="flex items-start justify-between mb-1">
                      <div className="flex items-center gap-2">
                        {ex.type === 'image' ? <ImageIcon size={16} className="text-purple-600" /> : <FileText size={16} className="text-blue-600" />}
                        <span className="font-semibold text-sm text-gray-900 truncate max-w-[150px]">{ex.name}</span>
                      </div>
                      {ex.stamped && <span className="text-[10px] bg-gold-100 text-gold-800 px-1.5 py-0.5 rounded font-bold">STAMPED</span>}
                    </div>
                    <p className="text-xs text-gray-500 flex justify-between">
                      <span>{ex.date}</span>
                      <span className={`px-1.5 rounded-full ${ex.status === 'New' ? 'bg-blue-100 text-blue-700' : 'bg-gray-100 text-gray-600'}`}>{ex.status}</span>
                    </p>
                  </div>
                ))}
              </div>
            </div>

            {/* Preview Area */}
            <div className="flex-1 p-8 flex flex-col items-center justify-center bg-gray-100 relative">
              {selectedExhibit ? (
                <div className="w-full h-full flex flex-col">
                  <div className="bg-white rounded-lg shadow-lg flex-1 flex items-center justify-center border border-gray-200 relative overflow-hidden">
                    {/* Simulated Preview */}
                    <div className="text-center p-10">
                      {exhibits.find(e => e.id === selectedExhibit)?.type === 'image' ? (
                        <div className="relative">
                           <div className="w-64 h-80 bg-gray-200 rounded flex items-center justify-center text-gray-400">
                             [Image Preview]
                           </div>
                           {exhibits.find(e => e.id === selectedExhibit)?.stamped && (
                             <div className="absolute bottom-4 right-4 bg-red-600/90 text-white px-3 py-1 text-xs font-bold border-2 border-white shadow-lg transform -rotate-6">
                               EXHIBIT A<br/>People v. Martinez
                             </div>
                           )}
                        </div>
                      ) : (
                        <div className="w-64 h-80 bg-white border border-gray-200 shadow-sm p-8 flex flex-col items-center">
                          <FileText size={48} className="text-gray-300 mb-4" />
                          <p className="text-sm font-medium text-gray-900">{exhibits.find(e => e.id === selectedExhibit)?.name}</p>
                          <p className="text-xs text-gray-500 mt-2">PDF Document</p>
                          {exhibits.find(e => e.id === selectedExhibit)?.stamped && (
                             <div className="mt-12 bg-red-600/90 text-white px-3 py-1 text-xs font-bold border-2 border-white shadow-lg transform -rotate-6">
                               EXHIBIT B<br/>People v. Martinez
                             </div>
                           )}
                        </div>
                      )}
                    </div>
                  </div>
                  
                  {/* Action Bar */}
                  <div className="mt-4 flex justify-between items-center bg-white p-4 rounded-lg shadow-sm border border-gray-200">
                    <div>
                      <h3 className="font-bold text-sm text-gray-900">{exhibits.find(e => e.id === selectedExhibit)?.name}</h3>
                      <p className="text-xs text-gray-500">Uploaded by Client • {exhibits.find(e => e.id === selectedExhibit)?.date}</p>
                    </div>
                    <div className="flex gap-2">
                      <button className="px-3 py-1.5 text-sm font-medium text-red-600 bg-red-50 hover:bg-red-100 rounded-lg">Reject</button>
                      <button 
                        onClick={() => stampExhibit(selectedExhibit!)}
                        disabled={exhibits.find(e => e.id === selectedExhibit)?.stamped}
                        className="px-3 py-1.5 text-sm font-medium text-navy-900 bg-gold-400 hover:bg-gold-500 rounded-lg disabled:opacity-50 flex items-center gap-1"
                      >
                        <Stamp size={14} /> {exhibits.find(e => e.id === selectedExhibit)?.stamped ? 'Stamped' : 'Stamp Exhibit'}
                      </button>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="text-center text-gray-400">
                  <Paperclip size={48} className="mx-auto mb-2 opacity-50" />
                  <p>Select an exhibit to preview</p>
                </div>
              )}
            </div>
          </div>
        )}

        {/* --- TAB 2: REQUESTS & OBJECTIONS --- */}
        {activeTab === 'requests' && (
          <div className="p-6">
            <div className="grid grid-cols-2 gap-6 h-full">
              {/* Left: Requests */}
              <div>
                <h3 className="font-bold text-navy-900 mb-4 flex items-center gap-2">
                  <CheckSquare size={18} /> Opposing Counsel's Requests
                </h3>
                <div className="space-y-4">
                  {requests.map(req => (
                    <div key={req.id} className="bg-white border border-gray-200 rounded-lg p-4 shadow-sm hover:border-navy-300 transition-colors">
                      <div className="flex justify-between items-start mb-2">
                        <span className="text-xs font-bold text-gray-500">Request {req.id}</span>
                        <span className={`text-[10px] px-2 py-0.5 rounded-full ${req.status === 'Draft' ? 'bg-amber-100 text-amber-800' : 'bg-green-100 text-green-800'}`}>
                          {req.status}
                        </span>
                      </div>
                      <p className="text-sm text-gray-800 leading-relaxed">{req.text}</p>
                    </div>
                  ))}
                </div>
              </div>

              {/* Right: Answers */}
              <div>
                <h3 className="font-bold text-navy-900 mb-4 flex items-center gap-2">
                  <FileText size={18} /> Your Responses
                </h3>
                <div className="space-y-4">
                  {requests.map(req => (
                    <div key={req.id} className="bg-gray-50 border border-gray-200 rounded-lg p-4 relative group min-h-[140px]">
                      <div className="flex justify-between mb-2">
                        <span className="text-xs font-bold text-gray-400">Response to #{req.id}</span>
                        {req.answer.includes('Objection') && (
                           <span className="flex items-center gap-1 text-[10px] bg-red-50 text-red-600 px-2 py-0.5 rounded border border-red-100 font-bold">
                             <AlertCircle size={10} /> OBJECTION
                           </span>
                        )}
                      </div>
                      <textarea
                        value={req.answer}
                        onChange={(e) => setRequests(prev => prev.map(r => r.id === req.id ? { ...r, answer: e.target.value } : r))}
                        placeholder="Draft your response or objection here..."
                        className="w-full h-24 p-3 text-sm bg-white border border-gray-300 rounded-md focus:ring-2 focus:ring-navy-500 focus:border-transparent resize-none"
                      />
                      
                      {/* AI Toolbar */}
                      <div className="mt-2 flex items-center justify-between">
                        <button 
                             onClick={() => suggestObjection(req.id)}
                             disabled={!!aiThinking}
                             className="text-xs flex items-center gap-1.5 px-2 py-1 bg-purple-100 text-purple-700 rounded hover:bg-purple-200 transition-colors font-medium"
                           >
                             <Wand2 size={12} /> {aiThinking === req.id ? 'Thinking...' : 'AI Suggest Objection'}
                        </button>
                        <button className="text-xs text-gray-500 hover:text-navy-900 flex items-center gap-1">
                          <Paperclip size={10} /> Attach Exhibit
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* --- TAB 3: PRODUCTION BUILDER --- */}
        {activeTab === 'production' && (
          <div className="p-8 max-w-4xl mx-auto">
             <div className="text-center mb-8">
               <div className="w-16 h-16 bg-navy-100 text-navy-600 rounded-full flex items-center justify-center mx-auto mb-4">
                 <Stamp size={32} />
               </div>
               <h2 className="text-2xl font-bold text-navy-900">Generate Production Package</h2>
               <p className="text-gray-500">Compile your responses and stamped exhibits into a single PDF.</p>
             </div>

             <div className="bg-white border border-gray-200 rounded-xl overflow-hidden shadow-sm mb-8">
               <div className="p-6 border-b border-gray-100">
                 <label className="block text-sm font-medium text-gray-700 mb-1">Production Name</label>
                 <input 
                   type="text" 
                   value={productionName}
                   onChange={e => setProductionName(e.target.value)}
                   className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-navy-500"
                 />
               </div>
               
               <div className="p-6 bg-gray-50 space-y-4">
                 <div className="flex items-center justify-between p-3 bg-white border border-gray-200 rounded-lg">
                   <div className="flex items-center gap-3">
                     <CheckCircle2 size={18} className="text-green-500" />
                     <span className="text-sm font-medium text-gray-900">Responses to Interrogatories (3 items)</span>
                   </div>
                   <button className="text-xs text-navy-600 hover:underline">View Draft</button>
                 </div>
                 
                 <div className="flex items-center justify-between p-3 bg-white border border-gray-200 rounded-lg">
                   <div className="flex items-center gap-3">
                     <CheckCircle2 size={18} className="text-green-500" />
                     <span className="text-sm font-medium text-gray-900">Stamped Exhibits (2 selected)</span>
                   </div>
                   <button className="text-xs text-navy-600 hover:underline">Edit Selection</button>
                 </div>
                 
                 <div className="flex items-center justify-between p-3 bg-white border border-gray-200 rounded-lg opacity-50">
                    <div className="flex items-center gap-3">
                     <XCircle size={18} className="text-gray-400" />
                     <span className="text-sm font-medium text-gray-500">Privilege Log (None)</span>
                   </div>
                   <button className="text-xs text-navy-600 hover:underline">Add</button>
                 </div>
               </div>
             </div>

             <div className="flex justify-center">
               <button 
                 onClick={() => {
                   setGenerating(true);
                   setTimeout(() => setGenerating(false), 2000);
                 }}
                 disabled={generating}
                 className="px-8 py-3 bg-gold-500 text-navy-900 font-bold rounded-xl shadow-lg hover:bg-gold-400 transition-all transform hover:scale-105 disabled:opacity-70 disabled:transform-none flex items-center gap-2"
               >
                 {generating ? (
                   <>Processing...</>
                 ) : (
                   <>
                     <Download size={20} /> Generate PDF Package
                   </>
                 )}
               </button>
             </div>
             
             {generating && (
               <div className="mt-4 text-center text-sm text-gray-500 animate-pulse">
                 Compiling responses... stamping images... finalizing PDF...
               </div>
             )}
          </div>
        )}

      </div>
    </div>
  );
}
