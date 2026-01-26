
import Link from 'next/link';

export default function Home() {
  return (
    <main className="min-h-screen flex flex-col bg-white text-slate-900 font-sans">

      {/* Navbar */}
      <nav className="w-full border-b border-gray-100 bg-white/95 backdrop-blur sticky top-0 z-50">
        <div className="container h-16 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-blue-600 rounded flex items-center justify-center text-white font-serif font-bold text-lg">A</div>
            <span className="text-xl font-medium tracking-tight text-gray-900">Assigned<span className="font-bold">CoCounsel</span></span>
          </div>
          <div className="flex gap-4">
            <Link href="/login" className="text-sm font-medium text-gray-600 hover:text-gray-900 py-2">Log In</Link>
            <Link href="/dashboard" className="btn btn-primary">Get Started</Link>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="flex-1 flex flex-col items-center justify-center text-center px-4 py-24 bg-gradient-to-b from-white to-blue-50/50">
        <div className="max-w-3xl space-y-8 animate-fade-in">
          <div className="inline-block px-3 py-1 rounded-full bg-blue-100 text-blue-700 text-xs font-semibold uppercase tracking-wide mb-2">
            New: Public Service Loan Forgiveness Tracking
          </div>
          <h1 className="text-5xl md:text-6xl font-bold tracking-tight text-gray-900 leading-[1.1]">
            The Operating System for <br />
            <span className="text-blue-600">Court-Appointed Attorneys</span>
          </h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto leading-relaxed">
            Eliminate the administrative tax. Automate your vouchering, manage cases intelligently, and draft with confidence using our Grounded AI.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center mt-4">
            <Link href="/dashboard" className="btn btn-primary text-base px-8 py-3 h-12 rounded shadow-lg shadow-blue-500/20">
              Start Free Trial
            </Link>
            <button className="btn btn-ghost text-base border border-gray-300 px-8 py-3 h-12 rounded hover:bg-white hover:border-gray-400">
              Watch Demo
            </button>
          </div>
        </div>
      </section>

      {/* Features Grid */}
      <section className="py-24 bg-white">
        <div className="container">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
            <div className="space-y-4 p-6 rounded-xl hover:bg-gray-50 transition-colors">
              <div className="w-12 h-12 rounded-lg bg-blue-100 flex items-center justify-center text-blue-600 material-icons-outlined text-2xl">receipt_long</div>
              <h3 className="text-xl font-bold text-gray-900">Automated Vouchering</h3>
              <p className="text-gray-600 leading-relaxed">Convert case activity into compliant payment vouchers instantly. No more spreadsheets. Our AI Audit catches errors before you submit.</p>
            </div>
            <div className="space-y-4 p-6 rounded-xl hover:bg-gray-50 transition-colors">
              <div className="w-12 h-12 rounded-lg bg-orange-100 flex items-center justify-center text-orange-600 material-icons-outlined text-2xl">psychology</div>
              <h3 className="text-xl font-bold text-gray-900">Grounded AI Co-Pilot</h3>
              <p className="text-gray-600 leading-relaxed">Draft motions and briefs with a hallucination-free AI trained on your specific case files and controlling state law.</p>
            </div>
            <div className="space-y-4 p-6 rounded-xl hover:bg-gray-50 transition-colors">
              <div className="w-12 h-12 rounded-lg bg-green-100 flex items-center justify-center text-green-600 material-icons-outlined text-2xl">school</div>
              <h3 className="text-xl font-bold text-gray-900">PSLF Tracking</h3>
              <p className="text-gray-600 leading-relaxed">Track your progress toward student loan forgiveness with automated employment certification and hour tracking.</p>
            </div>
          </div>
        </div>
      </section>

      <footer className="py-12 bg-gray-50 border-t border-gray-200">
        <div className="container text-center text-gray-500 text-sm">
          &copy; 2025 AssignedCoCounsel.com. All rights reserved.
        </div>
      </footer>
    </main>
  );
}
