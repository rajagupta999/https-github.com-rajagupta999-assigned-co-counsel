"use client";

import { useState } from 'react';

interface Client {
  id: string; name: string; caseName: string; portalStatus: 'Active' | 'Invited' | 'Not Set Up';
  lastActivity: string; docsUploaded: number; outstandingBalance: number; proSe: boolean;
}

const CLIENTS: Client[] = [
  { id: 'client-martinez', name: 'Carlos Martinez', caseName: 'People v. Martinez', portalStatus: 'Active', lastActivity: '2 hours ago', docsUploaded: 5, outstandingBalance: 750, proSe: true },
  { id: 'client-chen', name: 'Wei Chen', caseName: 'People v. Chen', portalStatus: 'Invited', lastActivity: '3 days ago', docsUploaded: 1, outstandingBalance: 500, proSe: true },
  { id: 'client-davis', name: 'Angela Davis', caseName: 'Matter of Davis', portalStatus: 'Active', lastActivity: '1 day ago', docsUploaded: 4, outstandingBalance: 1200, proSe: true },
  { id: 'client-park', name: 'David Park', caseName: 'Park Estate', portalStatus: 'Not Set Up', lastActivity: '1 week ago', docsUploaded: 0, outstandingBalance: 0, proSe: false },
  { id: 'client-mitchell', name: 'Sarah Mitchell', caseName: 'Mitchell Estate', portalStatus: 'Active', lastActivity: '5 hours ago', docsUploaded: 8, outstandingBalance: 0, proSe: true },
];

const STATUS_STYLE: Record<string, string> = {
  'Active': 'bg-green-100 text-green-700',
  'Invited': 'bg-blue-100 text-blue-700',
  'Not Set Up': 'bg-gray-100 text-gray-600',
};

export default function ClientsPage() {
  const [search, setSearch] = useState('');
  const [filter, setFilter] = useState<string>('All');
  const [inviteModal, setInviteModal] = useState<Client | null>(null);
  const [proSeState, setProSeState] = useState<Record<string, boolean>>(
    Object.fromEntries(CLIENTS.map(c => [c.id, c.proSe]))
  );
  const toggleProSe = (id: string) => setProSeState(prev => ({ ...prev, [id]: !prev[id] }));

  const filtered = CLIENTS.filter(c => {
    const matchSearch = !search || c.name.toLowerCase().includes(search.toLowerCase()) || c.caseName.toLowerCase().includes(search.toLowerCase());
    const matchFilter = filter === 'All' || c.portalStatus === filter;
    return matchSearch && matchFilter;
  });

  const totalOutstanding = CLIENTS.reduce((s, c) => s + c.outstandingBalance, 0);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-white">Client Directory</h1>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: 'Total Clients', value: CLIENTS.length, color: 'text-white' },
          { label: 'Active Portals', value: CLIENTS.filter(c => c.portalStatus === 'Active').length, color: 'text-green-400' },
          { label: 'Pending Invites', value: CLIENTS.filter(c => c.portalStatus === 'Invited').length, color: 'text-blue-400' },
          { label: 'Outstanding', value: `$${totalOutstanding.toLocaleString()}`, color: 'text-amber-400' },
        ].map((s, i) => (
          <div key={i} className="bg-navy-800 rounded-xl p-4 border border-navy-700">
            <p className="text-[11px] text-gray-400 font-medium uppercase tracking-wider">{s.label}</p>
            <p className={`text-2xl font-bold mt-1 ${s.color}`}>{s.value}</p>
          </div>
        ))}
      </div>

      {/* Search & Filter */}
      <div className="flex flex-col sm:flex-row gap-3">
        <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search clients or cases..."
          className="flex-1 px-4 py-2.5 bg-navy-800 border border-navy-700 rounded-xl text-sm text-white placeholder-gray-500 focus:ring-2 focus:ring-gold-500 focus:border-transparent" />
        <div className="flex gap-2">
          {['All', 'Active', 'Invited', 'Not Set Up'].map(f => (
            <button key={f} onClick={() => setFilter(f)}
              className={`px-3 py-2 rounded-lg text-xs font-medium transition-colors ${filter === f ? 'bg-gold-500 text-navy-900' : 'bg-navy-800 text-gray-400 hover:text-white border border-navy-700'}`}>
              {f}
            </button>
          ))}
        </div>
      </div>

      {/* Client List */}
      <div className="space-y-3">
        {filtered.map(client => (
          <div key={client.id} className="bg-navy-800 rounded-xl border border-navy-700 p-5 hover:border-navy-600 transition-colors">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-white font-bold text-sm">
                  {client.name.split(' ').map(n => n[0]).join('')}
                </div>
                <div>
                  <h3 className="font-semibold text-white">{client.name}</h3>
                  <p className="text-sm text-gray-400">{client.caseName}</p>
                </div>
              </div>
              
              <div className="flex items-center gap-6 text-xs">
                <span className={`px-2.5 py-1 rounded-full font-semibold ${STATUS_STYLE[client.portalStatus]}`}>{client.portalStatus}</span>
                <div className="hidden md:block text-gray-400"><span className="text-gray-500">Last:</span> {client.lastActivity}</div>
                <div className="hidden md:block text-gray-400"><span className="text-gray-500">Docs:</span> {client.docsUploaded}</div>
                {client.outstandingBalance > 0 && (
                  <span className="text-amber-400 font-semibold">${client.outstandingBalance.toLocaleString()}</span>
                )}
                <div className="flex items-center gap-2">
                  <span className="text-[10px] text-gray-500">Pro Se</span>
                  <button onClick={() => toggleProSe(client.id)}
                    className={`relative w-9 h-5 rounded-full transition-colors ${proSeState[client.id] ? 'bg-green-500' : 'bg-navy-600'}`}>
                    <span className={`absolute top-0.5 left-0.5 w-4 h-4 rounded-full bg-white transition-transform ${proSeState[client.id] ? 'translate-x-4' : ''}`} />
                  </button>
                </div>
                <div className="flex gap-2">
                  {client.portalStatus !== 'Active' && (
                    <button onClick={() => setInviteModal(client)} className="px-3 py-1.5 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition-colors">
                      {client.portalStatus === 'Invited' ? 'Resend Invite' : 'Invite to Portal'}
                    </button>
                  )}
                  <a href={`/portal/${client.id}`} target="_blank" rel="noopener noreferrer"
                    className="px-3 py-1.5 bg-navy-700 text-gray-300 rounded-lg font-medium hover:bg-navy-600 hover:text-white transition-colors">
                    View Portal
                  </a>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Invite Modal */}
      {inviteModal && (
        <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4" onClick={() => setInviteModal(null)}>
          <div className="bg-navy-800 rounded-2xl border border-navy-700 p-6 w-full max-w-md shadow-2xl" onClick={e => e.stopPropagation()}>
            <h2 className="text-lg font-bold text-white mb-4">Invite {inviteModal.name}</h2>
            <div className="mb-4">
              <label className="text-xs text-gray-400 font-medium">Portal Link</label>
              <div className="flex gap-2 mt-1">
                <input readOnly value={`https://assigned-co-counsel-clawd.web.app/portal/${inviteModal.id}`}
                  className="flex-1 px-3 py-2 bg-navy-900 border border-navy-700 rounded-lg text-sm text-gray-300 truncate" />
                <button onClick={() => navigator.clipboard?.writeText(`https://assigned-co-counsel-clawd.web.app/portal/${inviteModal.id}`)}
                  className="px-3 py-2 bg-navy-700 text-gray-300 rounded-lg text-xs font-medium hover:bg-navy-600">Copy</button>
              </div>
            </div>
            <div className="flex gap-3">
              <button onClick={() => setInviteModal(null)} className="flex-1 py-2.5 bg-blue-600 text-white rounded-xl text-sm font-semibold hover:bg-blue-700">Send Email Invite</button>
              <button onClick={() => setInviteModal(null)} className="px-4 py-2.5 bg-navy-700 text-gray-400 rounded-xl text-sm font-medium hover:text-white">Cancel</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
