
import Link from 'next/link';

export default function Home() {
  return (
    <main className="min-h-screen flex flex-col bg-white text-slate-900 font-sans">

      {/* Navbar */}
      <nav className="w-full border-b border-slate-100 bg-white/80 backdrop-blur-lg sticky top-0 z-50">
        <div className="container h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 bg-gradient-to-br from-blue-600 to-indigo-600 rounded-lg flex items-center justify-center text-white font-serif font-bold text-lg shadow-md shadow-blue-500/20">A</div>
            <span className="text-xl font-semibold tracking-tight text-slate-900">Assigned<span className="text-blue-600">CoCounsel</span></span>
          </div>
          <div className="flex items-center gap-2">
            <Link href="/login" className="text-sm font-medium text-slate-600 hover:text-slate-900 px-4 py-2 rounded-lg hover:bg-slate-50 transition-all">Log In</Link>
            <Link href="/dashboard" className="btn btn-primary rounded-lg">Get Started</Link>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative flex-1 flex flex-col items-center justify-center text-center px-4 py-28 overflow-hidden">
        {/* Background decoration */}
        <div className="absolute inset-0 bg-gradient-to-b from-blue-50/80 via-white to-white"></div>
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[800px] bg-gradient-to-br from-blue-100/40 to-indigo-100/40 rounded-full blur-3xl -top-[400px]"></div>

        <div className="relative max-w-4xl space-y-8 animate-fade-in">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-blue-50 border border-blue-100 text-blue-700 text-xs font-semibold uppercase tracking-wide">
            <span className="w-1.5 h-1.5 rounded-full bg-blue-500 animate-pulse"></span>
            New: Public Service Loan Forgiveness Tracking
          </div>

          <h1 className="text-5xl sm:text-6xl md:text-7xl font-bold tracking-tight text-slate-900 leading-[1.08]">
            The Operating System for{' '}
            <span className="bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">Court-Appointed Attorneys</span>
          </h1>

          <p className="text-lg sm:text-xl text-slate-500 max-w-2xl mx-auto leading-relaxed">
            Eliminate the administrative tax. Automate your vouchering, manage cases intelligently, and draft with confidence using our Grounded AI.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center pt-4">
            <Link href="/dashboard" className="btn btn-primary text-base px-8 py-3.5 rounded-xl shadow-lg shadow-blue-500/25 hover:shadow-xl hover:shadow-blue-500/30 font-semibold">
              Start Free Trial
              <svg className="w-4 h-4 ml-2" style={{ width: '16px', height: '16px' }} fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 8l4 4m0 0l-4 4m4-4H3"></path></svg>
            </Link>
            <button className="btn btn-ghost text-base border border-slate-200 px-8 py-3.5 rounded-xl hover:bg-slate-50 hover:border-slate-300 font-medium">
              <svg className="w-4 h-4 mr-2 text-slate-400" style={{ width: '16px', height: '16px' }} fill="currentColor" viewBox="0 0 24 24"><path d="M8 5v14l11-7z"></path></svg>
              Watch Demo
            </button>
          </div>

          {/* Social proof */}
          <div className="pt-12 flex flex-col items-center gap-4">
            <div className="flex -space-x-2">
              {['bg-blue-500', 'bg-emerald-500', 'bg-amber-500', 'bg-purple-500', 'bg-rose-500'].map((color, i) => (
                <div key={i} className={`w-8 h-8 rounded-full ${color} border-2 border-white flex items-center justify-center text-white text-[10px] font-bold`}>
                  {['JD', 'AK', 'MR', 'SL', 'TP'][i]}
                </div>
              ))}
            </div>
            <p className="text-sm text-slate-400">Trusted by <span className="text-slate-600 font-semibold">500+</span> court-appointed attorneys across New York</p>
          </div>
        </div>
      </section>

      {/* Features Grid */}
      <section className="py-24 bg-white relative">
        <div className="container">
          <div className="text-center mb-16">
            <p className="text-sm font-semibold text-blue-600 uppercase tracking-wider mb-3">Features</p>
            <h2 className="text-3xl sm:text-4xl font-bold text-slate-900 tracking-tight">Everything you need, nothing you don&apos;t</h2>
            <p className="text-lg text-slate-500 mt-4 max-w-xl mx-auto">Purpose-built tools for 18-b attorneys that save hours every week.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                icon: (
                  <svg className="w-6 h-6" style={{ width: '24px', height: '24px' }} fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M9 14l6-6m4.5-3.5a2.121 2.121 0 010 3L14 13l-3 1 1-3 5.5-5.5a2.121 2.121 0 013 0zM19 13v6a2 2 0 01-2 2H5a2 2 0 01-2-2V7a2 2 0 012-2h6"></path></svg>
                ),
                title: 'Automated Vouchering',
                description: 'Convert case activity into compliant payment vouchers instantly. Our AI Audit catches errors before you submit.',
                color: 'blue',
              },
              {
                icon: (
                  <svg className="w-6 h-6" style={{ width: '24px', height: '24px' }} fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z"></path></svg>
                ),
                title: 'Grounded AI Co-Pilot',
                description: 'Draft motions and briefs with hallucination-free AI trained on your case files and controlling state law.',
                color: 'indigo',
              },
              {
                icon: (
                  <svg className="w-6 h-6" style={{ width: '24px', height: '24px' }} fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M4.26 10.147a60.436 60.436 0 00-.491 6.347A48.627 48.627 0 0112 20.904a48.627 48.627 0 018.232-4.41 60.46 60.46 0 00-.491-6.347m-15.482 0a50.57 50.57 0 00-2.658-.813A59.905 59.905 0 0112 3.493a59.902 59.902 0 0110.399 5.84c-.896.248-1.783.52-2.658.814m-15.482 0A50.697 50.697 0 0112 13.489a50.702 50.702 0 017.74-3.342"></path></svg>
                ),
                title: 'PSLF Tracking',
                description: 'Track progress toward student loan forgiveness with automated employment certification and hour tracking.',
                color: 'emerald',
              },
            ].map((feature, i) => (
              <div key={i} className="group relative bg-white rounded-2xl border border-slate-100 p-8 hover:border-slate-200 hover:shadow-xl hover:shadow-slate-100 transition-all duration-300">
                <div className={`w-12 h-12 rounded-xl bg-${feature.color}-50 flex items-center justify-center text-${feature.color}-600 mb-6 group-hover:scale-110 transition-transform`}>
                  {feature.icon}
                </div>
                <h3 className="text-xl font-semibold text-slate-900 mb-3">{feature.title}</h3>
                <p className="text-slate-500 leading-relaxed">{feature.description}</p>
                <div className="mt-6 flex items-center text-sm font-semibold text-blue-600 opacity-0 group-hover:opacity-100 transition-opacity">
                  Learn more
                  <svg className="w-4 h-4 ml-1 group-hover:translate-x-1 transition-transform" style={{ width: '16px', height: '16px' }} fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 8l4 4m0 0l-4 4m4-4H3"></path></svg>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-20 bg-slate-50 border-y border-slate-100">
        <div className="container">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
            {[
              { value: '500+', label: 'Active Attorneys' },
              { value: '12,000+', label: 'Cases Managed' },
              { value: '98%', label: 'Voucher Approval Rate' },
              { value: '4.2hrs', label: 'Saved Per Week' },
            ].map((stat, i) => (
              <div key={i}>
                <div className="text-3xl sm:text-4xl font-bold text-slate-900 tracking-tight">{stat.value}</div>
                <div className="text-sm text-slate-500 mt-1 font-medium">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24 bg-white">
        <div className="container">
          <div className="relative overflow-hidden bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 rounded-3xl p-12 md:p-16 text-center">
            <div className="absolute inset-0 bg-gradient-to-r from-blue-600/10 to-indigo-600/10"></div>
            <div className="absolute top-0 right-0 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl"></div>
            <div className="relative">
              <h2 className="text-3xl sm:text-4xl font-bold text-white tracking-tight mb-4">Ready to reclaim your time?</h2>
              <p className="text-lg text-slate-300 max-w-xl mx-auto mb-8">Join hundreds of court-appointed attorneys who have streamlined their practice with AssignedCoCounsel.</p>
              <Link href="/dashboard" className="inline-flex items-center gap-2 bg-white text-slate-900 px-8 py-3.5 rounded-xl text-base font-semibold hover:bg-slate-50 transition-all shadow-lg">
                Get Started Free
                <svg className="w-4 h-4" style={{ width: '16px', height: '16px' }} fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 8l4 4m0 0l-4 4m4-4H3"></path></svg>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 bg-white border-t border-slate-100">
        <div className="container">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="w-7 h-7 bg-gradient-to-br from-blue-600 to-indigo-600 rounded-md flex items-center justify-center text-white font-serif font-bold text-sm">A</div>
              <span className="text-sm font-medium text-slate-600">AssignedCoCounsel</span>
            </div>
            <p className="text-sm text-slate-400">&copy; 2025 AssignedCoCounsel.com. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </main>
  );
}
