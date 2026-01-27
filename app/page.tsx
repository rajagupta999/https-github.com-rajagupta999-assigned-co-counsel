import Link from 'next/link';

export default function Home() {
  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', background: '#fff' }}>
      <nav style={{ borderBottom: '1px solid #e2e8f0', padding: '0 2rem', height: '60px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
          <div style={{ width: '32px', height: '32px', background: '#2563eb', borderRadius: '8px', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white', fontWeight: 700, fontSize: '14px' }}>A</div>
          <span style={{ fontSize: '18px', fontWeight: 700, color: '#0f172a' }}>AssignedCoCounsel</span>
        </div>
        <Link href="/dashboard" style={{ padding: '0.5rem 1.25rem', fontSize: '14px', fontWeight: 600, color: '#fff', background: '#2563eb', borderRadius: '8px' }}>Go to Dashboard</Link>
      </nav>
      <main style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', textAlign: 'center', padding: '4rem 2rem', maxWidth: '720px', margin: '0 auto' }}>
        <div style={{ background: '#eff6ff', color: '#2563eb', fontSize: '12px', fontWeight: 700, padding: '0.375rem 1rem', borderRadius: '999px', marginBottom: '1.5rem', textTransform: 'uppercase', letterSpacing: '0.05em' }}>For Court-Appointed Attorneys</div>
        <h1 style={{ fontSize: '48px', fontWeight: 800, color: '#0f172a', lineHeight: 1.1, marginBottom: '1.5rem', letterSpacing: '-0.025em' }}>The operating system for your 18-b practice</h1>
        <p style={{ fontSize: '18px', color: '#64748b', lineHeight: 1.7, marginBottom: '2.5rem', maxWidth: '560px' }}>Manage cases, draft documents with AI, automate vouchering, and track your PSLF progress — all in one place.</p>
        <Link href="/dashboard" style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem', padding: '0.875rem 2rem', fontSize: '16px', fontWeight: 600, color: '#fff', background: '#2563eb', borderRadius: '10px' }}>Get Started</Link>
      </main>
      <section style={{ borderTop: '1px solid #e2e8f0', padding: '4rem 2rem', background: '#f8fafc' }}>
        <div style={{ maxWidth: '960px', margin: '0 auto' }}>
          <h2 style={{ fontSize: '24px', fontWeight: 700, color: '#0f172a', textAlign: 'center', marginBottom: '2.5rem' }}>What you can do</h2>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: '1.5rem' }}>
            {[
              { title: 'Case Management', desc: 'Track all your assigned cases, court dates, charges, and client information in one dashboard.' },
              { title: 'AI Co-Pilot', desc: 'Draft motions, briefs, and legal memos with AI grounded in your case files and NY law.' },
              { title: 'Voucher Drafting', desc: 'Auto-generate payment vouchers with built-in compliance auditing for block billing.' },
              { title: 'Divorce Guidebook', desc: '10-step workflow for divorce proceedings with pre-loaded drafting tasks for each stage.' },
              { title: 'Legal Wiki', desc: 'Searchable knowledge base of NY statutes, case law, and procedural guides.' },
              { title: 'PSLF Tracking', desc: 'Monitor progress toward Public Service Loan Forgiveness with certification tracking.' },
            ].map((f, i) => (
              <div key={i} style={{ background: '#fff', border: '1px solid #e2e8f0', borderRadius: '12px', padding: '1.5rem' }}>
                <h3 style={{ fontSize: '16px', fontWeight: 700, color: '#0f172a', marginBottom: '0.5rem' }}>{f.title}</h3>
                <p style={{ fontSize: '14px', color: '#64748b', lineHeight: 1.7 }}>{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
      <footer style={{ borderTop: '1px solid #e2e8f0', padding: '1.5rem 2rem', textAlign: 'center', fontSize: '13px', color: '#94a3b8' }}>&copy; 2025 AssignedCoCounsel.com</footer>
    </div>
  );
}
