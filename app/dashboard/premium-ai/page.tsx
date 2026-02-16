"use client";

import Link from 'next/link';

const AI_PROVIDERS = [
  {
    name: 'Anthropic Claude',
    model: 'Claude Opus 4 / Sonnet 4',
    features: ['200K context', 'Legal reasoning', 'Brief drafting'],
    color: 'from-purple-600 to-purple-800',
    icon: '🟣',
    description: 'Best for legal reasoning, document analysis, and nuanced writing.',
    comingSoon: true
  },
  {
    name: 'Google Gemini',
    model: 'Gemini 3 Pro',
    features: ['1M context', 'Multimodal', 'Research synthesis'],
    color: 'from-blue-500 to-blue-700',
    icon: '🔵',
    description: 'Excellent for research synthesis and fast turnaround on routine tasks.',
    comingSoon: true
  },
  {
    name: 'OpenAI ChatGPT',
    model: 'GPT-5.2 / o3',
    features: ['Reasoning (o3)', 'Code interpreter', 'File analysis'],
    color: 'from-emerald-600 to-emerald-800',
    icon: '🟢',
    description: 'Strong general-purpose AI for client comms and discovery review.',
    comingSoon: true
  },
];

export default function PremiumAIPage() {
  return (
    <div className="p-4 sm:p-6 lg:p-8 max-w-6xl mx-auto space-y-8 animate-fade-in pb-12">
      
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">AI Intelligence Center</h1>
          <p className="text-slate-500 mt-1">Choose your engine: Cloud Frontier Models or Local Sovereign AI.</p>
        </div>
      </div>

      {/* LOCAL SOVEREIGN CLOUD (Featured) */}
      <div className="bg-slate-900 rounded-2xl overflow-hidden shadow-xl text-white relative">
        <div className="absolute top-0 right-0 p-4 opacity-10">
            <svg width="200" height="200" viewBox="0 0 24 24" fill="white"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-1 17.93c-3.95-.49-7-3.85-7-7.93 0-.62.08-1.21.21-1.79L9 15v1c0 1.1.9 2 2 2v1.93zm6.9-2.54c-.26-.81-1-1.39-1.9-1.39h-1v-3c0-.55-.45-1-1-1H8v-2h2c.55 0 1-.45 1-1V7h2c1.1 0 2-.9 2-2v-.41c2.93 1.19 5 4.06 5 7.41 0 2.08-1.07 3.97-2.9 5.33z"/></svg>
        </div>
        
        <div className="p-6 md:p-8 relative z-10">
          <div className="flex items-center gap-3 mb-4">
            <span className="bg-emerald-500/20 text-emerald-400 text-xs font-bold px-2 py-1 rounded-full border border-emerald-500/50">RECOMMENDED</span>
            <h2 className="text-2xl font-bold text-white">Local Sovereign Cloud</h2>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-6">
            <div>
              <p className="text-slate-300 mb-4 leading-relaxed">
                Run the entire Assigned Co-Counsel platform on your own hardware (Mac Mini / PC). 
                Keep 100% of your client data physically in your office while retaining secure remote access.
              </p>
              <ul className="space-y-2 text-sm text-slate-300">
                <li className="flex items-center gap-2">
                    <span className="text-emerald-400">✓</span> <strong>Total Privacy:</strong> No data ever touches the cloud.
                </li>
                <li className="flex items-center gap-2">
                    <span className="text-emerald-400">✓</span> <strong>Zero Fees:</strong> Use your own GPU for free AI.
                </li>
                <li className="flex items-center gap-2">
                    <span className="text-emerald-400">✓</span> <strong>Secure Remote:</strong> Tailscale VPN built-in.
                </li>
              </ul>
            </div>
            
            <div className="bg-white/5 rounded-xl p-4 border border-white/10">
               <h3 className="font-bold text-emerald-400 mb-2 text-sm">Why switch to Local?</h3>
               <div className="space-y-3">
                   <div>
                       <p className="text-xs font-bold text-white">For Assigned Counsel</p>
                       <p className="text-xs text-slate-400">Strict compliance for indigent defense. Protect sensitive client files from cloud subpoenas. You own the drive.</p>
                   </div>
                   <div>
                       <p className="text-xs font-bold text-white">For Private Practice</p>
                       <p className="text-xs text-slate-400">Stop paying per-token API fees. Turn your office hardware into a competitive asset. Own your intelligence.</p>
                   </div>
               </div>
            </div>
          </div>

          <Link href="/dashboard/local" className="inline-flex items-center gap-2 bg-emerald-600 hover:bg-emerald-500 text-white px-6 py-3 rounded-xl font-bold transition-all shadow-lg shadow-emerald-900/20">
            <span>🚀</span> Download Appliance Kit
          </Link>
        </div>
      </div>

      {/* CLOUD PROVIDERS (Secondary) */}
      <div>
        <h2 className="text-lg font-bold text-slate-900 mb-4">Or Connect Cloud Models (BYOK)</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {AI_PROVIDERS.map(p => (
            <div key={p.name} className="bg-white border border-slate-200 rounded-xl p-5 hover:shadow-md transition-shadow">
                <div className="flex items-center gap-3 mb-3">
                    <span className="text-2xl">{p.icon}</span>
                    <div>
                        <h3 className="font-bold text-slate-900 text-sm">{p.name}</h3>
                        <p className="text-xs text-slate-500">{p.model}</p>
                    </div>
                </div>
                <p className="text-xs text-slate-600 mb-4 h-10">{p.description}</p>
                <button disabled={p.comingSoon} className="w-full py-2 bg-slate-50 hover:bg-slate-100 text-slate-600 text-xs font-bold rounded-lg border border-slate-200 transition-colors disabled:opacity-50">
                    {p.comingSoon ? 'Coming Soon' : 'Connect'}
                </button>
            </div>
            ))}
        </div>
      </div>

    </div>
  );
}
