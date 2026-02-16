"use client";

import Link from 'next/link';

export default function LocalDeployPage() {
  return (
    <div className="p-4 sm:p-6 lg:p-8 max-w-4xl mx-auto animate-fade-in">
      
      {/* Hero Section */}
      <div className="text-center mb-12">
        <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-slate-900 text-white mb-6 shadow-lg">
          <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="2" y="2" width="20" height="8" rx="2" ry="2"/><rect x="2" y="14" width="20" height="8" rx="2" ry="2"/><line x1="6" y1="6" x2="6.01" y2="6"/><line x1="6" y1="18" x2="6.01" y2="18"/></svg>
        </div>
        <h1 className="text-3xl font-bold text-slate-900 mb-4">Local Sovereign Cloud</h1>
        <p className="text-lg text-slate-600 max-w-2xl mx-auto">
          Run the entire Assigned Co-Counsel platform on your own hardware. 
          Keep your client data physically in your office while retaining secure remote access.
        </p>
      </div>

      {/* The 3 Pillars */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm hover:shadow-md transition-shadow">
          <div className="w-10 h-10 bg-blue-50 text-blue-600 rounded-lg flex items-center justify-center mb-4 text-xl">🔒</div>
          <h3 className="font-bold text-slate-900 mb-2">Total Privacy</h3>
          <p className="text-sm text-slate-500">
            Your data never leaves your machine. The database and AI vector store live on your hard drive, encrypted by your OS.
          </p>
        </div>
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm hover:shadow-md transition-shadow">
          <div className="w-10 h-10 bg-purple-50 text-purple-600 rounded-lg flex items-center justify-center mb-4 text-xl">⚡</div>
          <h3 className="font-bold text-slate-900 mb-2">Local AI Power</h3>
          <p className="text-sm text-slate-500">
            Uses your Mac or PC's GPU to run local LLMs (Llama 3, Mistral). No API fees, no data sharing.
          </p>
        </div>
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm hover:shadow-md transition-shadow">
          <div className="w-10 h-10 bg-emerald-50 text-emerald-600 rounded-lg flex items-center justify-center mb-4 text-xl">🌍</div>
          <h3 className="font-bold text-slate-900 mb-2">Secure Remote</h3>
          <p className="text-sm text-slate-500">
            Built-in Tailscale mesh VPN. Access your local "appliance" securely from court, home, or mobile.
          </p>
        </div>
      </div>

      {/* Download Section */}
      <div className="bg-slate-900 rounded-2xl overflow-hidden shadow-xl text-white">
        <div className="p-8 md:p-12 text-center">
          <h2 className="text-2xl font-bold mb-4">Ready to go offline?</h2>
          <p className="text-slate-400 mb-8 max-w-xl mx-auto">
            Download the "Appliance Kit". It includes the Docker configuration to spin up the App, Database, and AI engine in one command.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a href="/dashboard/assistant?action=local-agent" className="inline-flex items-center justify-center px-6 py-3 rounded-xl bg-emerald-500 text-white font-bold hover:bg-emerald-400 transition-colors shadow-lg shadow-emerald-900/50">
              🤖 Have Virtual Assistant Set This Up
            </a>
            <a href="/docs/LOCAL_DEPLOY.md" target="_blank" className="inline-flex items-center justify-center px-6 py-3 rounded-xl bg-white text-slate-900 font-bold hover:bg-slate-100 transition-colors">
              📄 Read the Guide
            </a>
            <a href="/docker-compose.yml" download="docker-compose.yml" className="inline-flex items-center justify-center px-6 py-3 rounded-xl bg-blue-600 text-white font-bold hover:bg-blue-500 transition-colors shadow-lg shadow-blue-900/50">
              ⬇️ Download Docker Kit
            </a>
          </div>
          <p className="text-xs text-slate-500 mt-6">
            Requires Docker Desktop (Mac/Windows/Linux) • Tailscale Account • 8GB+ RAM Recommended
          </p>
        </div>
        
        {/* Terminal Preview */}
        <div className="bg-slate-950 p-4 border-t border-slate-800 font-mono text-xs text-slate-400 overflow-x-auto">
          <div className="flex gap-2 mb-2">
            <div className="w-3 h-3 rounded-full bg-red-500"></div>
            <div className="w-3 h-3 rounded-full bg-amber-500"></div>
            <div className="w-3 h-3 rounded-full bg-emerald-500"></div>
          </div>
          <p>$ mkdir my-legal-cloud && cd my-legal-cloud</p>
          <p>$ curl -O https://assigned-co-counsel.web.app/docker-compose.yml</p>
          <p>$ docker-compose up -d</p>
          <p className="text-emerald-500 mt-2">✔ System Online: https://my-firm.local</p>
        </div>
      </div>

    </div>
  );
}
