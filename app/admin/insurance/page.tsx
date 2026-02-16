"use client";

import { useState, useEffect } from 'react';
import Link from 'next/link';

// Mock data for dashboard
const mockStats = {
  totalLeads: 47,
  activeQuotes: 12,
  activePolicies: 156,
  openClaims: 8,
  totalPremium: 2450000,
  claimsPaid: 185000,
  conversionRate: 34.5,
  avgRiskScore: 72
};

const mockRecentLeads = [
  { id: 'L001', company: 'Sunset Properties LLC', type: 'multifamily', status: 'quoting', riskScore: 78, value: 45000 },
  { id: 'L002', company: 'FastTrack Logistics', type: 'fleet', status: 'qualifying', riskScore: 65, value: 120000 },
  { id: 'L003', company: 'Harbor View Apartments', type: 'multifamily', status: 'new', riskScore: null, value: 32000 },
  { id: 'L004', company: 'Metro Delivery Co', type: 'logistics', status: 'negotiating', riskScore: 82, value: 89000 },
];

const mockRecentClaims = [
  { id: 'C001', policy: 'POL-2024-0145', type: 'Water Damage', amount: 25000, status: 'investigating' },
  { id: 'C002', policy: 'POL-2024-0089', type: 'Vehicle Collision', amount: 45000, status: 'adjusting' },
  { id: 'C003', policy: 'POL-2024-0201', type: 'Liability', amount: 15000, status: 'approved' },
];

const mockAgentActivity = [
  { agent: 'Document Analyzer', tasks: 45, success: 98.2, llm: 'claude-3' },
  { agent: 'Risk Assessor', tasks: 32, success: 95.5, llm: 'gpt-4' },
  { agent: 'Claims Processor', tasks: 28, success: 97.1, llm: 'gpt-4' },
  { agent: 'Customer Service', tasks: 156, success: 99.1, llm: 'cerebras' },
];

export default function InsuranceDashboard() {
  const [currentTime, setCurrentTime] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 60000);
    return () => clearInterval(timer);
  }, []);

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', minimumFractionDigits: 0 }).format(amount);
  };

  const getStatusColor = (status: string) => {
    const colors: Record<string, string> = {
      new: 'bg-blue-500/20 text-blue-400',
      qualifying: 'bg-yellow-500/20 text-yellow-400',
      quoting: 'bg-purple-500/20 text-purple-400',
      negotiating: 'bg-orange-500/20 text-orange-400',
      won: 'bg-emerald-500/20 text-emerald-400',
      investigating: 'bg-yellow-500/20 text-yellow-400',
      adjusting: 'bg-orange-500/20 text-orange-400',
      approved: 'bg-emerald-500/20 text-emerald-400',
    };
    return colors[status] || 'bg-slate-500/20 text-slate-400';
  };

  const getRiskColor = (score: number | null) => {
    if (score === null) return 'text-slate-400';
    if (score >= 80) return 'text-emerald-400';
    if (score >= 60) return 'text-yellow-400';
    return 'text-red-400';
  };

  return (
    <div className="p-4 sm:p-6 lg:p-8 max-w-[1600px] mx-auto space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-white">Insurance Command Center</h1>
          <p className="text-slate-400 text-sm mt-1">
            {currentTime.toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
          </p>
        </div>
        <Link 
          href="/admin/insurance/leads?action=new"
          className="inline-flex items-center justify-center gap-2 bg-gradient-to-r from-blue-500 to-emerald-500 hover:from-blue-600 hover:to-emerald-600 text-white px-5 py-2.5 rounded-lg text-sm font-semibold shadow-lg shadow-blue-500/25 transition-all"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
          </svg>
          New Lead
        </Link>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <div className="bg-slate-800 border border-slate-700 rounded-xl p-4 sm:p-5 hover:border-blue-500/50 transition-colors">
          <div className="flex items-center justify-between mb-3">
            <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Total Leads</p>
            <span className="text-xl">🎯</span>
          </div>
          <p className="text-2xl sm:text-3xl font-bold text-white">{mockStats.totalLeads}</p>
          <p className="text-xs text-emerald-400 mt-1">+12 this week</p>
        </div>

        <div className="bg-slate-800 border border-slate-700 rounded-xl p-4 sm:p-5 hover:border-purple-500/50 transition-colors">
          <div className="flex items-center justify-between mb-3">
            <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Active Quotes</p>
            <span className="text-xl">💰</span>
          </div>
          <p className="text-2xl sm:text-3xl font-bold text-white">{mockStats.activeQuotes}</p>
          <p className="text-xs text-slate-400 mt-1">{formatCurrency(450000)} value</p>
        </div>

        <div className="bg-slate-800 border border-slate-700 rounded-xl p-4 sm:p-5 hover:border-emerald-500/50 transition-colors">
          <div className="flex items-center justify-between mb-3">
            <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Active Policies</p>
            <span className="text-xl">📋</span>
          </div>
          <p className="text-2xl sm:text-3xl font-bold text-white">{mockStats.activePolicies}</p>
          <p className="text-xs text-slate-400 mt-1">{formatCurrency(mockStats.totalPremium)} premium</p>
        </div>

        <div className="bg-slate-800 border border-slate-700 rounded-xl p-4 sm:p-5 hover:border-orange-500/50 transition-colors">
          <div className="flex items-center justify-between mb-3">
            <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Open Claims</p>
            <span className="text-xl">🛡️</span>
          </div>
          <p className="text-2xl sm:text-3xl font-bold text-white">{mockStats.openClaims}</p>
          <p className="text-xs text-yellow-400 mt-1">2 need attention</p>
        </div>
      </div>

      {/* Secondary Stats */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <div className="bg-slate-800/50 border border-slate-700/50 rounded-lg p-4">
          <p className="text-xs text-slate-400 mb-1">Conversion Rate</p>
          <p className="text-xl font-bold text-emerald-400">{mockStats.conversionRate}%</p>
        </div>
        <div className="bg-slate-800/50 border border-slate-700/50 rounded-lg p-4">
          <p className="text-xs text-slate-400 mb-1">Avg Risk Score</p>
          <p className="text-xl font-bold text-yellow-400">{mockStats.avgRiskScore}</p>
        </div>
        <div className="bg-slate-800/50 border border-slate-700/50 rounded-lg p-4">
          <p className="text-xs text-slate-400 mb-1">Claims Paid (MTD)</p>
          <p className="text-xl font-bold text-white">{formatCurrency(mockStats.claimsPaid)}</p>
        </div>
        <div className="bg-slate-800/50 border border-slate-700/50 rounded-lg p-4">
          <p className="text-xs text-slate-400 mb-1">Loss Ratio</p>
          <p className="text-xl font-bold text-emerald-400">7.5%</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Recent Leads */}
        <div className="lg:col-span-2 bg-slate-800 border border-slate-700 rounded-xl overflow-hidden">
          <div className="flex items-center justify-between p-4 border-b border-slate-700">
            <h2 className="font-semibold text-white">Recent Leads</h2>
            <Link href="/admin/insurance/leads" className="text-sm text-blue-400 hover:text-blue-300">
              View All →
            </Link>
          </div>
          <div className="divide-y divide-slate-700/50">
            {mockRecentLeads.map((lead) => (
              <div key={lead.id} className="p-4 hover:bg-slate-700/30 transition-colors">
                <div className="flex items-center justify-between">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <p className="font-medium text-white truncate">{lead.company}</p>
                      <span className={`px-2 py-0.5 rounded-full text-[10px] font-medium ${getStatusColor(lead.status)}`}>
                        {lead.status}
                      </span>
                    </div>
                    <div className="flex items-center gap-4 mt-1">
                      <span className="text-xs text-slate-400">{lead.type}</span>
                      <span className="text-xs text-slate-400">{formatCurrency(lead.value)}</span>
                      {lead.riskScore !== null && (
                        <span className={`text-xs font-medium ${getRiskColor(lead.riskScore)}`}>
                          Risk: {lead.riskScore}
                        </span>
                      )}
                    </div>
                  </div>
                  <button className="p-2 hover:bg-slate-600 rounded-lg transition-colors">
                    <svg className="w-4 h-4 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* AI Agents Activity */}
        <div className="bg-slate-800 border border-slate-700 rounded-xl overflow-hidden">
          <div className="flex items-center justify-between p-4 border-b border-slate-700">
            <h2 className="font-semibold text-white">AI Agents</h2>
            <Link href="/admin/insurance/agents" className="text-sm text-blue-400 hover:text-blue-300">
              Configure →
            </Link>
          </div>
          <div className="divide-y divide-slate-700/50">
            {mockAgentActivity.map((agent, idx) => (
              <div key={idx} className="p-4">
                <div className="flex items-center justify-between mb-2">
                  <p className="text-sm font-medium text-white">{agent.agent}</p>
                  <span className="text-[10px] px-2 py-0.5 rounded bg-slate-700 text-slate-300">
                    {agent.llm}
                  </span>
                </div>
                <div className="flex items-center justify-between text-xs">
                  <span className="text-slate-400">{agent.tasks} tasks</span>
                  <span className="text-emerald-400">{agent.success}% success</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Recent Claims */}
      <div className="bg-slate-800 border border-slate-700 rounded-xl overflow-hidden">
        <div className="flex items-center justify-between p-4 border-b border-slate-700">
          <h2 className="font-semibold text-white">Recent Claims</h2>
          <Link href="/admin/insurance/claims" className="text-sm text-blue-400 hover:text-blue-300">
            View All →
          </Link>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-slate-700/30">
              <tr>
                <th className="px-4 py-3 text-left text-xs font-semibold text-slate-400 uppercase">Claim ID</th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-slate-400 uppercase">Policy</th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-slate-400 uppercase">Type</th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-slate-400 uppercase">Amount</th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-slate-400 uppercase">Status</th>
                <th className="px-4 py-3 text-right text-xs font-semibold text-slate-400 uppercase">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-700/50">
              {mockRecentClaims.map((claim) => (
                <tr key={claim.id} className="hover:bg-slate-700/30 transition-colors">
                  <td className="px-4 py-3 text-sm font-mono text-white">{claim.id}</td>
                  <td className="px-4 py-3 text-sm text-slate-300">{claim.policy}</td>
                  <td className="px-4 py-3 text-sm text-slate-300">{claim.type}</td>
                  <td className="px-4 py-3 text-sm text-white font-medium">{formatCurrency(claim.amount)}</td>
                  <td className="px-4 py-3">
                    <span className={`px-2 py-0.5 rounded-full text-[10px] font-medium ${getStatusColor(claim.status)}`}>
                      {claim.status}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-right">
                    <button className="text-sm text-blue-400 hover:text-blue-300">View</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <Link href="/admin/insurance/leads?action=new" className="bg-gradient-to-br from-blue-500/10 to-blue-600/10 border border-blue-500/30 rounded-xl p-4 hover:border-blue-500/50 transition-all group">
          <span className="text-2xl mb-2 block">🎯</span>
          <p className="font-medium text-white group-hover:text-blue-400 transition-colors">Add Lead</p>
          <p className="text-xs text-slate-400 mt-1">Capture new prospect</p>
        </Link>
        <Link href="/admin/insurance/risk-manager" className="bg-gradient-to-br from-yellow-500/10 to-orange-600/10 border border-yellow-500/30 rounded-xl p-4 hover:border-yellow-500/50 transition-all group">
          <span className="text-2xl mb-2 block">⚠️</span>
          <p className="font-medium text-white group-hover:text-yellow-400 transition-colors">Risk Analysis</p>
          <p className="text-xs text-slate-400 mt-1">ERP risk assessment</p>
        </Link>
        <Link href="/admin/insurance/quotes" className="bg-gradient-to-br from-purple-500/10 to-purple-600/10 border border-purple-500/30 rounded-xl p-4 hover:border-purple-500/50 transition-all group">
          <span className="text-2xl mb-2 block">💰</span>
          <p className="font-medium text-white group-hover:text-purple-400 transition-colors">Generate Quote</p>
          <p className="text-xs text-slate-400 mt-1">Multi-carrier comparison</p>
        </Link>
        <Link href="/admin/insurance/claims?action=new" className="bg-gradient-to-br from-emerald-500/10 to-emerald-600/10 border border-emerald-500/30 rounded-xl p-4 hover:border-emerald-500/50 transition-all group">
          <span className="text-2xl mb-2 block">🛡️</span>
          <p className="font-medium text-white group-hover:text-emerald-400 transition-colors">File Claim</p>
          <p className="text-xs text-slate-400 mt-1">Start claims process</p>
        </Link>
      </div>
    </div>
  );
}
