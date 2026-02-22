'use client';

import { useState } from 'react';
import { 
  FileText, Upload, CheckCircle2, AlertCircle, Clock, 
  MessageSquare, Calendar, CreditCard, Scale, BookOpen, 
  Shield, LogOut, Phone, Mail, ChevronRight, X 
} from 'lucide-react';
import Link from 'next/link';

// --- Mock Data ---
const MOCK_CLIENT = {
  name: 'Carlos Martinez',
  caseId: 'CASE-2024-001',
  caseName: 'Martinez v. State of NY',
  attorney: 'Raja Gupta, Esq.',
  nextCourtDate: '2026-03-15T09:00:00',
  retainerBalance: 2500.00,
  outstandingBalance: 450.00,
  status: 'Discovery Phase',
  messages: [
    { id: 1, from: 'attorney', text: 'Hi Carlos, please upload the accident photos when you can.', time: '2h ago' },
    { id: 2, from: 'client', text: 'Will do. I also found the dashcam footage.', time: '1h ago' },
  ],
  requests: [
    { id: 1, title: '2024 Tax Returns', status: 'pending', dueDate: '2026-02-20' },
    { id: 2, title: 'Accident Scene Photos', status: 'uploaded', dueDate: '2026-02-18' },
    { id: 3, title: 'Witness List', status: 'accepted', dueDate: '2026-02-15' },
  ]
};

const TABS = [
  { id: 'overview', label: 'Overview', icon: FileText },
  { id: 'documents', label: 'Documents & Evidence', icon: Upload },
  { id: 'messages', label: 'Messages', icon: MessageSquare },
  { id: 'billing', label: 'Billing & Trust', icon: CreditCard },
  { id: 'calendar', label: 'Calendar', icon: Calendar },
  { id: 'trial', label: 'Trial Prep', icon: Scale },
  { id: 'selfhelp', label: 'Self-Help Tools', icon: BookOpen },
];

export default function PortalContent({ params }: { params: { id: string } }) {
  const [activeTab, setActiveTab] = useState('overview');
  const [dragActive, setDragActive] = useState(false);

  // --- Components for Tabs ---

  const OverviewTab = () => (
    <div className="space-y-6">
      {/* Status Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm">
          <div className="flex items-center gap-3 mb-2">
            <div className="p-2 bg-blue-50 text-blue-600 rounded-lg"><Clock size={20} /></div>
            <h3 className="font-semibold text-slate-700">Next Court Date</h3>
          </div>
          <p className="text-xl font-bold text-slate-900">March 15, 2026</p>
          <p className="text-sm text-slate-500">9:00 AM • Kings County Supreme</p>
        </div>
        <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm">
          <div className="flex items-center gap-3 mb-2">
            <div className="p-2 bg-amber-50 text-amber-600 rounded-lg"><AlertCircle size={20} /></div>
            <h3 className="font-semibold text-slate-700">Action Items</h3>
          </div>
          <p className="text-xl font-bold text-slate-900">2 Pending</p>
          <p className="text-sm text-slate-500">Documents needed for discovery</p>
        </div>
        <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm">
          <div className="flex items-center gap-3 mb-2">
            <div className="p-2 bg-emerald-50 text-emerald-600 rounded-lg"><CreditCard size={20} /></div>
            <h3 className="font-semibold text-slate-700">Retainer Balance</h3>
          </div>
          <p className="text-xl font-bold text-slate-900">${MOCK_CLIENT.retainerBalance.toLocaleString()}</p>
          <p className="text-sm text-slate-500">Trust Account Secure</p>
        </div>
      </div>

      {/* Recent Activity */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-6">
        <h3 className="font-bold text-slate-800 mb-4">Recent Activity</h3>
        <div className="space-y-4">
          {[
            { icon: MessageSquare, text: 'New message from Raja Gupta', time: '2 hours ago', color: 'text-blue-600 bg-blue-50' },
            { icon: CheckCircle2, text: 'Witness List accepted by attorney', time: 'Yesterday', color: 'text-emerald-600 bg-emerald-50' },
            { icon: Upload, text: 'You uploaded "Scene Photos"', time: '2 days ago', color: 'text-purple-600 bg-purple-50' },
          ].map((item, i) => (
            <div key={i} className="flex items-center gap-3 pb-3 border-b border-slate-100 last:border-0 last:pb-0">
              <div className={`p-2 rounded-full ${item.color}`}><item.icon size={16} /></div>
              <div className="flex-1">
                <p className="text-sm font-medium text-slate-700">{item.text}</p>
                <p className="text-xs text-slate-400">{item.time}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );

  const DocumentsTab = () => (
    <div className="space-y-6">
      {/* Upload Zone */}
      <div 
        className={`border-2 border-dashed rounded-xl p-8 text-center transition-all ${dragActive ? 'border-blue-500 bg-blue-50' : 'border-slate-300 hover:border-blue-400 hover:bg-slate-50'}`}
        onDragEnter={() => setDragActive(true)}
        onDragLeave={() => setDragActive(false)}
        onDrop={(e) => { e.preventDefault(); setDragActive(false); }}
        onDragOver={(e) => e.preventDefault()}
      >
        <div className="w-16 h-16 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center mx-auto mb-4">
          <Upload size={32} />
        </div>
        <h3 className="text-lg font-semibold text-slate-800">Upload Evidence</h3>
        <p className="text-sm text-slate-500 mb-4">Drag & drop photos, videos, or documents here</p>
        <button className="px-4 py-2 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition-colors">
          Select Files
        </button>
      </div>

      {/* Requests List */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="bg-slate-50 px-6 py-4 border-b border-slate-200">
          <h3 className="font-bold text-slate-800">Requested Items</h3>
        </div>
        <div className="divide-y divide-slate-100">
          {MOCK_CLIENT.requests.map((req) => (
            <div key={req.id} className="p-4 flex items-center justify-between hover:bg-slate-50 transition-colors">
              <div className="flex items-center gap-3">
                <div className={`w-2 h-2 rounded-full ${req.status === 'accepted' ? 'bg-emerald-500' : req.status === 'uploaded' ? 'bg-amber-500' : 'bg-slate-300'}`} />
                <div>
                  <p className="text-sm font-medium text-slate-800">{req.title}</p>
                  <p className="text-xs text-slate-500">Due: {new Date(req.dueDate).toLocaleDateString()}</p>
                </div>
              </div>
              {req.status === 'pending' && (
                <button className="text-xs px-3 py-1.5 bg-blue-50 text-blue-600 font-medium rounded-lg hover:bg-blue-100">
                  Upload
                </button>
              )}
              {req.status === 'uploaded' && <span className="text-xs font-medium text-amber-600 bg-amber-50 px-2 py-1 rounded">In Review</span>}
              {req.status === 'accepted' && <span className="text-xs font-medium text-emerald-600 bg-emerald-50 px-2 py-1 rounded">Accepted</span>}
            </div>
          ))}
        </div>
      </div>
    </div>
  );

  const MessagesTab = () => (
    <div className="bg-white rounded-xl border border-slate-200 shadow-sm h-[600px] flex flex-col">
      <div className="p-4 border-b border-slate-200 flex items-center justify-between bg-slate-50 rounded-t-xl">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center text-blue-700 font-bold">RG</div>
          <div>
            <h3 className="font-bold text-slate-800">Raja Gupta, Esq.</h3>
            <p className="text-xs text-slate-500">Available • Replies typically in 2 hrs</p>
          </div>
        </div>
        <div className="flex gap-2">
           <button className="p-2 hover:bg-white rounded-lg text-slate-500" title="Call"><Phone size={18} /></button>
           <button className="p-2 hover:bg-white rounded-lg text-slate-500" title="Email"><Mail size={18} /></button>
        </div>
      </div>
      <div className="flex-1 p-4 overflow-y-auto space-y-4 bg-slate-50/50">
        {MOCK_CLIENT.messages.map((msg) => (
          <div key={msg.id} className={`flex ${msg.from === 'client' ? 'justify-end' : 'justify-start'}`}>
            <div className={`max-w-[80%] rounded-xl p-3 shadow-sm ${msg.from === 'client' ? 'bg-blue-600 text-white rounded-br-none' : 'bg-white border border-slate-200 text-slate-800 rounded-bl-none'}`}>
              <p className="text-sm">{msg.text}</p>
              <p className={`text-[10px] mt-1 ${msg.from === 'client' ? 'text-blue-100' : 'text-slate-400'}`}>{msg.time}</p>
            </div>
          </div>
        ))}
      </div>
      <div className="p-4 border-t border-slate-200 bg-white rounded-b-xl">
        <div className="flex gap-2">
          <button className="p-2 text-slate-400 hover:text-blue-600 transition-colors"><Upload size={20} /></button>
          <input 
            type="text" 
            placeholder="Type a message..." 
            className="flex-1 border border-slate-300 rounded-lg px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <button className="p-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"><ChevronRight size={20} /></button>
        </div>
        <p className="text-[10px] text-center text-slate-400 mt-2">
          Messages are secure and privileged. Copies sent to your iMessage/WhatsApp based on preference.
        </p>
      </div>
    </div>
  );

  const BillingTab = () => (
    <div className="space-y-6">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="bg-slate-900 text-white rounded-xl p-6 shadow-lg">
          <p className="text-slate-400 text-sm mb-1">Trust Account Balance</p>
          <p className="text-3xl font-bold text-emerald-400">${MOCK_CLIENT.retainerBalance.toLocaleString()}</p>
          <div className="mt-4 pt-4 border-t border-slate-700 flex justify-between items-center">
            <span className="text-xs text-slate-400">Last deposit: Feb 1, 2026</span>
            <button className="text-xs bg-emerald-600 hover:bg-emerald-700 text-white px-3 py-1.5 rounded-lg font-medium transition-colors">
              Add Funds
            </button>
          </div>
        </div>
        <div className="bg-white border border-slate-200 rounded-xl p-6 shadow-sm">
          <p className="text-slate-500 text-sm mb-1">Outstanding Invoice</p>
          <p className="text-3xl font-bold text-slate-900">${MOCK_CLIENT.outstandingBalance.toLocaleString()}</p>
          <div className="mt-4 pt-4 border-t border-slate-100 flex justify-between items-center">
             <span className="text-xs text-red-500 font-medium">Due in 5 days</span>
             <button className="text-xs bg-slate-900 hover:bg-slate-800 text-white px-3 py-1.5 rounded-lg font-medium transition-colors">
              Pay Now
            </button>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="px-6 py-4 border-b border-slate-200 bg-slate-50">
          <h3 className="font-bold text-slate-800">Transaction History</h3>
        </div>
        <table className="w-full text-sm text-left">
          <thead className="bg-slate-50 text-slate-500 font-medium">
            <tr>
              <th className="px-6 py-3">Date</th>
              <th className="px-6 py-3">Description</th>
              <th className="px-6 py-3">Amount</th>
              <th className="px-6 py-3">Status</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {[
              { date: 'Feb 1, 2026', desc: 'Retainer Deposit', amount: '+$2,500.00', status: 'Cleared' },
              { date: 'Jan 28, 2026', desc: 'Court Filing Fee', amount: '-$250.00', status: 'Processed' },
              { date: 'Jan 15, 2026', desc: 'Initial Consultation', amount: '-$150.00', status: 'Processed' },
            ].map((tx, i) => (
              <tr key={i} className="hover:bg-slate-50">
                <td className="px-6 py-4 text-slate-600">{tx.date}</td>
                <td className="px-6 py-4 font-medium text-slate-800">{tx.desc}</td>
                <td className={`px-6 py-4 font-bold ${tx.amount.startsWith('+') ? 'text-emerald-600' : 'text-slate-600'}`}>{tx.amount}</td>
                <td className="px-6 py-4"><span className="text-xs bg-slate-100 text-slate-600 px-2 py-1 rounded-full">{tx.status}</span></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );

  const CalendarTab = () => (
    <div className="space-y-6">
      <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-6">
        <div className="flex items-center justify-between mb-6">
          <h3 className="font-bold text-slate-800">Upcoming Events</h3>
          <div className="flex gap-2">
            <button className="px-3 py-1.5 text-xs font-medium bg-slate-100 text-slate-600 rounded-lg hover:bg-slate-200">Sync to Calendar</button>
            <button className="px-3 py-1.5 text-xs font-medium bg-blue-50 text-blue-600 rounded-lg hover:bg-blue-100">Request Change</button>
          </div>
        </div>
        <div className="space-y-4">
          {[
            { date: 'Mar 15, 2026', time: '9:00 AM', title: 'Preliminary Hearing', loc: 'Kings County Supreme Court, Part 12', type: 'Court', color: 'bg-red-100 text-red-700' },
            { date: 'Feb 20, 2026', time: '5:00 PM', title: 'Discovery Deadline', loc: 'Document Submission', type: 'Deadline', color: 'bg-amber-100 text-amber-700' },
            { date: 'Feb 18, 2026', time: '2:00 PM', title: 'Prep Call with Attorney', loc: 'Phone / Zoom', type: 'Meeting', color: 'bg-blue-100 text-blue-700' },
          ].map((evt, i) => (
            <div key={i} className="flex gap-4 p-4 border border-slate-100 rounded-xl hover:bg-slate-50 transition-colors">
              <div className="flex-shrink-0 w-16 text-center">
                <p className="text-xs font-bold text-slate-500 uppercase">{evt.date.split(' ')[0]}</p>
                <p className="text-xl font-bold text-slate-900">{evt.date.split(' ')[1].replace(',', '')}</p>
              </div>
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-1">
                  <span className={`text-[10px] font-bold px-2 py-0.5 rounded ${evt.color}`}>{evt.type}</span>
                  <span className="text-xs text-slate-400">{evt.time}</span>
                </div>
                <h4 className="font-bold text-slate-800">{evt.title}</h4>
                <p className="text-sm text-slate-500 flex items-center gap-1 mt-1">
                  <span className="w-1 h-1 bg-slate-400 rounded-full" /> {evt.loc}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );

  const TrialPrepTab = () => (
    <div className="space-y-6">
      <div className="bg-blue-600 text-white rounded-xl p-8 text-center">
        <h3 className="text-2xl font-bold mb-2">Prepare for Your Case</h3>
        <p className="text-blue-100 max-w-lg mx-auto mb-6">Practice answering questions, review your testimony, and get ready for court with our AI-guided tools.</p>
        <div className="flex justify-center gap-4">
          <button className="bg-white text-blue-600 px-6 py-2.5 rounded-lg font-bold hover:bg-blue-50 transition-colors">Start Mock Interview</button>
          <button className="bg-blue-700 text-white px-6 py-2.5 rounded-lg font-bold hover:bg-blue-800 transition-colors">Review My Statement</button>
        </div>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="bg-white p-5 rounded-xl border border-slate-200">
          <h4 className="font-bold text-slate-800 mb-2">Your Story</h4>
          <p className="text-sm text-slate-500 mb-4">Review the timeline of events as we have them recorded.</p>
          <div className="space-y-3">
             <div className="flex gap-3 text-sm">
               <span className="font-mono text-slate-400 text-xs w-12 pt-1">08:00 AM</span>
               <p className="text-slate-700">Left house for work.</p>
             </div>
             <div className="flex gap-3 text-sm">
               <span className="font-mono text-slate-400 text-xs w-12 pt-1">08:15 AM</span>
               <p className="text-slate-700">Stopped at intersection of Main & 4th.</p>
             </div>
             <div className="flex gap-3 text-sm">
               <span className="font-mono text-slate-400 text-xs w-12 pt-1">08:17 AM</span>
               <p className="text-slate-700">Accident occurred.</p>
             </div>
          </div>
          <button className="mt-4 text-xs text-blue-600 font-medium hover:underline">Edit Timeline →</button>
        </div>
        <div className="bg-white p-5 rounded-xl border border-slate-200">
          <h4 className="font-bold text-slate-800 mb-2">Key Documents</h4>
          <p className="text-sm text-slate-500 mb-4">Important files you should be familiar with.</p>
          <div className="space-y-2">
            {['Police Report.pdf', 'Witness Statement - Jones.pdf', 'Insurance Policy.pdf'].map((doc, i) => (
              <div key={i} className="flex items-center gap-2 p-2 bg-slate-50 rounded-lg border border-slate-100">
                <FileText size={14} className="text-slate-400" />
                <span className="text-sm text-slate-700">{doc}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );

  const SelfHelpTab = () => (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
         {[
           { icon: BookOpen, title: 'Legal Dictionary', desc: 'Common terms explained simply' },
           { icon: Shield, title: 'Your Rights', desc: 'What to do if stopped by police' },
           { icon: FileText, title: 'Document Templates', desc: 'Letters and simple forms' },
         ].map((tool, i) => (
           <div key={i} className="bg-white p-5 rounded-xl border border-slate-200 hover:border-blue-300 transition-colors cursor-pointer group">
             <div className="w-10 h-10 bg-slate-50 rounded-lg flex items-center justify-center text-slate-600 mb-3 group-hover:bg-blue-50 group-hover:text-blue-600 transition-colors">
               <tool.icon size={20} />
             </div>
             <h4 className="font-bold text-slate-800 mb-1">{tool.title}</h4>
             <p className="text-sm text-slate-500">{tool.desc}</p>
           </div>
         ))}
      </div>
      
      <div className="bg-slate-900 text-slate-300 rounded-xl p-6">
         <h4 className="text-white font-bold mb-2">Need to file something yourself?</h4>
         <p className="text-sm mb-4">Access our full Pro Se guide for step-by-step instructions on common filings.</p>
         <Link href="/dashboard/prose" className="inline-block bg-white text-slate-900 px-4 py-2 rounded-lg text-sm font-bold hover:bg-slate-100 transition-colors">
           Open Pro Se Guide
         </Link>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-slate-50 font-sans">
      {/* Top Navigation Bar */}
      <header className="bg-white border-b border-slate-200 sticky top-0 z-10">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center text-white font-bold">C</div>
            <div>
              <h1 className="text-sm font-bold text-slate-900 leading-tight">Client Portal</h1>
              <p className="text-xs text-slate-500">{MOCK_CLIENT.caseName}</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
             <span className="hidden sm:block text-xs text-slate-500 bg-slate-100 px-3 py-1.5 rounded-full">
               Case ID: {MOCK_CLIENT.caseId}
             </span>
             <Link href="/logout" className="text-slate-400 hover:text-slate-600"><LogOut size={20} /></Link>
          </div>
        </div>
        
        {/* Tabs Scroll Container */}
        <div className="max-w-5xl mx-auto px-4 sm:px-6 overflow-x-auto no-scrollbar">
          <div className="flex gap-6 border-b border-transparent">
            {TABS.map((tab) => {
              const Icon = tab.icon;
              const isActive = activeTab === tab.id;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex items-center gap-2 pb-3 pt-2 text-sm font-medium transition-colors border-b-2 whitespace-nowrap ${isActive ? 'border-blue-600 text-blue-600' : 'border-transparent text-slate-500 hover:text-slate-700 hover:border-slate-300'}`}
                >
                  <Icon size={16} />
                  {tab.label}
                </button>
              );
            })}
          </div>
        </div>
      </header>

      {/* Main Content Area */}
      <main className="max-w-5xl mx-auto px-4 sm:px-6 py-8">
        {activeTab === 'overview' && <OverviewTab />}
        {activeTab === 'documents' && <DocumentsTab />}
        {activeTab === 'messages' && <MessagesTab />}
        {activeTab === 'billing' && <BillingTab />}
        {activeTab === 'calendar' && <CalendarTab />}
        {activeTab === 'trial' && <TrialPrepTab />}
        {activeTab === 'selfhelp' && <SelfHelpTab />}
      </main>
    </div>
  );
}
