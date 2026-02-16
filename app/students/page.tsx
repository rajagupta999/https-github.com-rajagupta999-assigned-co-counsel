"use client";

import Link from "next/link";
import { useState } from "react";

const NAV_LINKS = [
  { href: "/", label: "Home" },
  { href: "/students", label: "Students" },
  { href: "/lawschools", label: "Law Schools" },
  { href: "/government", label: "Government" },
  { href: "/prose", label: "Pro Se" },
  { href: "/privatepractice", label: "Private Practice" },
  { href: "/login", label: "Login" },
];

const MOCK_PANELS: Record<string, { name: string; type: string }[]> = {
  "New York": [
    { name: "Queens County 18-B Panel", type: "Criminal & Family" },
    { name: "Kings County Assigned Counsel Plan", type: "Criminal Defense" },
    { name: "Bronx County 18-B Panel", type: "Criminal & Family" },
    { name: "Legal Aid Society — Panel Attorney Program", type: "All Practice Areas" },
    { name: "New York County Assigned Counsel Plan", type: "Criminal Defense" },
  ],
  "California": [
    { name: "Los Angeles County Alternate Public Defender Panel", type: "Criminal Defense" },
    { name: "San Francisco Conflicts Panel", type: "Criminal & Dependency" },
    { name: "San Diego County Indigent Defense Panel", type: "Criminal Defense" },
  ],
  "Texas": [
    { name: "Harris County Public Defender — Wheel Attorney Program", type: "Criminal Defense" },
    { name: "Dallas County Court-Appointed Attorney List", type: "Criminal & Family" },
    { name: "Bexar County Managed Assigned Counsel", type: "Criminal Defense" },
  ],
  "Florida": [
    { name: "Miami-Dade County Registry Attorney Program", type: "Dependency & Criminal" },
    { name: "Broward County Conflict Attorney Registry", type: "Criminal Defense" },
  ],
  "Illinois": [
    { name: "Cook County Public Defender — Conflicts Panel", type: "Criminal Defense" },
    { name: "Chicago Bar Foundation Pro Bono Panel", type: "Civil & Family" },
  ],
};

export default function StudentsPage() {
  const [selectedState, setSelectedState] = useState("");

  return (
    <div style={{ fontFamily: "'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif", color: "#e2e8f0", background: "#0f172a" }}>
      {/* Nav */}
      <nav style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "16px 24px", maxWidth: 1200, margin: "0 auto", flexWrap: "wrap", gap: 12 }}>
        <span style={{ fontWeight: 700, fontSize: 22, color: "#4ade80" }}>⚖️ Assigned Co-Counsel</span>
        <div style={{ display: "flex", alignItems: "center", gap: 20, fontSize: 15, flexWrap: "wrap" }}>
          {NAV_LINKS.map(l => (
            <Link key={l.href} href={l.href} style={{ color: "#94a3b8", textDecoration: "none" }}>{l.label}</Link>
          ))}
          <Link href="/login" style={{ background: "#22c55e", color: "#fff", padding: "8px 20px", borderRadius: 999, textDecoration: "none", fontWeight: 600, fontSize: 14 }}>Start Free</Link>
        </div>
      </nav>

      {/* Hero */}
      <section style={{ textAlign: "center", padding: "80px 24px 60px", maxWidth: 850, margin: "0 auto" }}>
        <h1 style={{ fontSize: "clamp(36px, 6vw, 60px)", fontWeight: 800, lineHeight: 1.1, color: "#fff", marginBottom: 20 }}>
          Graduate. Practice. Earn.<br /><span style={{ color: "#4ade80" }}>Day One.</span>
        </h1>
        <p style={{ fontSize: "clamp(18px, 3vw, 24px)", color: "#94a3b8", marginBottom: 40, lineHeight: 1.6 }}>
          You don&apos;t need BigLaw to start your career. The assigned counsel system needs you — and it pays.
        </p>
        <Link href="/login" style={{ display: "inline-block", background: "#22c55e", color: "#fff", padding: "16px 48px", borderRadius: 999, fontSize: 18, fontWeight: 700, textDecoration: "none", boxShadow: "0 4px 20px rgba(34,197,94,0.4)" }}>
          Start Your Practice Free
        </Link>
      </section>

      {/* The Problem */}
      <section style={{ padding: "60px 24px", maxWidth: 1000, margin: "0 auto" }}>
        <h2 style={{ fontSize: 32, fontWeight: 700, color: "#fff", textAlign: "center", marginBottom: 40 }}>The Reality for New Graduates</h2>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))", gap: 20 }}>
          {[
            { stat: "68%", desc: "of law graduates carry $150K+ in student debt" },
            { stat: "1 in 3", desc: "gets a BigLaw offer" },
            { stat: "2+ Years", desc: "before most solo practitioners turn a profit" },
          ].map((item, i) => (
            <div key={i} style={{ background: "#1e293b", borderRadius: 16, padding: 32, textAlign: "center", border: "1px solid #334155" }}>
              <div style={{ fontSize: 40, fontWeight: 800, color: "#f87171", marginBottom: 8 }}>{item.stat}</div>
              <div style={{ color: "#94a3b8", fontSize: 15 }}>{item.desc}</div>
            </div>
          ))}
        </div>
        <p style={{ textAlign: "center", color: "#4ade80", fontSize: 20, fontWeight: 600, marginTop: 32 }}>
          But there&apos;s a massive, state-funded legal market that&apos;s chronically understaffed...
        </p>
      </section>

      {/* The Opportunity */}
      <section style={{ padding: "60px 24px", background: "#1e293b" }}>
        <div style={{ maxWidth: 800, margin: "0 auto" }}>
          <h2 style={{ fontSize: 32, fontWeight: 700, color: "#fff", textAlign: "center", marginBottom: 16 }}>The Opportunity: Assigned Counsel</h2>
          <p style={{ color: "#94a3b8", textAlign: "center", fontSize: 17, lineHeight: 1.7, marginBottom: 32 }}>
            Every state funds attorneys to represent people who can&apos;t afford one. It&apos;s a constitutional right — and someone has to do it. That someone can be you, starting on day one.
          </p>
          <div style={{ display: "grid", gap: 16 }}>
            {[
              { icon: "🏛️", text: "This work is ALWAYS available — courts need attorneys NOW" },
              { icon: "💵", text: "You get paid by the state — rates range from $60–$158/hr depending on jurisdiction" },
              { icon: "📬", text: "No client acquisition costs. No marketing. Cases come to you." },
              { icon: "⚖️", text: "Every state has assigned counsel panels — criminal, family, immigration, housing" },
              { icon: "🔒", text: "Guaranteed work backed by the Sixth Amendment right to counsel" },
            ].map((item, i) => (
              <div key={i} style={{ display: "flex", alignItems: "center", gap: 16, background: "#0f172a", borderRadius: 12, padding: "16px 20px" }}>
                <span style={{ fontSize: 28 }}>{item.icon}</span>
                <span style={{ color: "#e2e8f0", fontSize: 16 }}>{item.text}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Income Calculator */}
      <section style={{ padding: "60px 24px", maxWidth: 900, margin: "0 auto" }}>
        <h2 style={{ fontSize: 32, fontWeight: 700, color: "#fff", textAlign: "center", marginBottom: 40 }}>Your First-Year Income Projection</h2>
        <div style={{ background: "#1e293b", borderRadius: 20, padding: 40, border: "1px solid #334155" }}>
          <div style={{ display: "grid", gap: 16, marginBottom: 32 }}>
            {[
              { label: "10 assigned counsel cases/month × avg $800/case", amount: "$8,000/mo", color: "#4ade80" },
              { label: "3 private clients/month × $1,500", amount: "$4,500/mo", color: "#60a5fa" },
            ].map((row, i) => (
              <div key={i} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "16px 20px", background: "#0f172a", borderRadius: 12 }}>
                <span style={{ color: "#94a3b8", fontSize: 15 }}>{row.label}</span>
                <span style={{ color: row.color, fontWeight: 700, fontSize: 20 }}>{row.amount}</span>
              </div>
            ))}
          </div>
          <div style={{ textAlign: "center", padding: "24px 0", borderTop: "2px solid #334155" }}>
            <div style={{ fontSize: 14, color: "#94a3b8", marginBottom: 8 }}>YEAR 1 PROJECTED INCOME</div>
            <div style={{ fontSize: 48, fontWeight: 800, color: "#4ade80" }}>$150,000+</div>
            <div style={{ fontSize: 14, color: "#64748b", marginTop: 8 }}>With overhead under $500/month using our platform</div>
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16, marginTop: 24 }}>
            <div style={{ background: "#0f172a", borderRadius: 12, padding: 20, textAlign: "center" }}>
              <div style={{ fontSize: 12, color: "#64748b", marginBottom: 4 }}>BIGLAW ASSOCIATE</div>
              <div style={{ fontSize: 24, fontWeight: 700, color: "#f87171" }}>$190K</div>
              <div style={{ fontSize: 13, color: "#94a3b8" }}>80+ hour weeks</div>
            </div>
            <div style={{ background: "#0f172a", borderRadius: 12, padding: 20, textAlign: "center", border: "2px solid #4ade80" }}>
              <div style={{ fontSize: 12, color: "#4ade80", marginBottom: 4 }}>ASSIGNED COUNSEL PATH</div>
              <div style={{ fontSize: 24, fontWeight: 700, color: "#4ade80" }}>$150K+</div>
              <div style={{ fontSize: 13, color: "#94a3b8" }}>Flexible hours, your own practice</div>
            </div>
          </div>
        </div>
      </section>

      {/* How to Get Started */}
      <section style={{ padding: "60px 24px", background: "#1e293b" }}>
        <div style={{ maxWidth: 800, margin: "0 auto" }}>
          <h2 style={{ fontSize: 32, fontWeight: 700, color: "#fff", textAlign: "center", marginBottom: 40 }}>How to Get Started</h2>
          <div style={{ display: "grid", gap: 24 }}>
            {[
              { step: "1", title: "Pass the Bar", desc: "Obviously. But while you're studying, you can already start planning." },
              { step: "2", title: "Apply to Assigned Counsel Panels", desc: "We help you find and apply to every panel in your area. Our AI fills out applications for you." },
              { step: "3", title: "Set Up Your Practice", desc: "Our platform gives you everything: case management, billing, AI tools — free." },
              { step: "4", title: "Start Taking Cases", desc: "Cases flow in from the court system. Use our AI to research, draft, and manage." },
              { step: "5", title: "Build Your Private Practice", desc: "As you gain experience, start taking private clients too. Same platform." },
              { step: "6", title: "Pay Off Your Loans", desc: "Public Service Loan Forgiveness (PSLF) may apply. We help you file the paperwork." },
            ].map((item, i) => (
              <div key={i} style={{ display: "flex", gap: 20, alignItems: "flex-start" }}>
                <div style={{ minWidth: 48, height: 48, background: "#22c55e", borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center", fontWeight: 800, fontSize: 20, color: "#fff" }}>{item.step}</div>
                <div>
                  <div style={{ fontWeight: 700, fontSize: 18, color: "#fff", marginBottom: 4 }}>{item.title}</div>
                  <div style={{ color: "#94a3b8", fontSize: 15, lineHeight: 1.5 }}>{item.desc}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Panel Finder */}
      <section style={{ padding: "60px 24px", maxWidth: 900, margin: "0 auto" }}>
        <h2 style={{ fontSize: 32, fontWeight: 700, color: "#fff", textAlign: "center", marginBottom: 8 }}>Find Assigned Counsel Panels Near You</h2>
        <p style={{ color: "#94a3b8", textAlign: "center", marginBottom: 32 }}>Our AI helps you complete the application paperwork</p>
        <div style={{ background: "#1e293b", borderRadius: 20, padding: 32, border: "1px solid #334155" }}>
          <select
            value={selectedState}
            onChange={(e) => setSelectedState(e.target.value)}
            style={{ width: "100%", padding: "14px 16px", borderRadius: 12, background: "#0f172a", border: "1px solid #334155", color: "#e2e8f0", fontSize: 16, marginBottom: 24, cursor: "pointer" }}
          >
            <option value="">Select your state...</option>
            {Object.keys(MOCK_PANELS).map(s => <option key={s} value={s}>{s}</option>)}
          </select>
          {selectedState && MOCK_PANELS[selectedState] && (
            <div style={{ display: "grid", gap: 12 }}>
              {MOCK_PANELS[selectedState].map((panel, i) => (
                <div key={i} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", background: "#0f172a", borderRadius: 12, padding: "16px 20px", flexWrap: "wrap", gap: 12 }}>
                  <div>
                    <div style={{ fontWeight: 600, color: "#fff", fontSize: 15 }}>{panel.name}</div>
                    <div style={{ color: "#64748b", fontSize: 13 }}>{panel.type}</div>
                  </div>
                  <button style={{ background: "#22c55e", color: "#fff", border: "none", padding: "8px 20px", borderRadius: 999, fontWeight: 600, fontSize: 13, cursor: "pointer" }}>Apply Now</button>
                </div>
              ))}
            </div>
          )}
          {!selectedState && (
            <div style={{ textAlign: "center", padding: 32, color: "#64748b" }}>
              ↑ Select a state to see available panels
            </div>
          )}
        </div>
      </section>

      {/* Student Loans */}
      <section style={{ padding: "60px 24px", background: "#1e293b" }}>
        <div style={{ maxWidth: 900, margin: "0 auto" }}>
          <h2 style={{ fontSize: 32, fontWeight: 700, color: "#fff", textAlign: "center", marginBottom: 40 }}>Crush Your Student Loans</h2>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))", gap: 20, marginBottom: 32 }}>
            <div style={{ background: "#0f172a", borderRadius: 16, padding: 28, border: "1px solid #334155" }}>
              <div style={{ fontSize: 24, marginBottom: 8 }}>🎓</div>
              <h3 style={{ color: "#fff", fontSize: 18, marginBottom: 8 }}>Public Service Loan Forgiveness (PSLF)</h3>
              <p style={{ color: "#94a3b8", fontSize: 14, lineHeight: 1.6 }}>
                Assigned counsel work may qualify as public service. After 120 qualifying payments (10 years), your remaining federal loan balance is forgiven — tax-free.
              </p>
            </div>
            <div style={{ background: "#0f172a", borderRadius: 16, padding: 28, border: "1px solid #334155" }}>
              <div style={{ fontSize: 24, marginBottom: 8 }}>📊</div>
              <h3 style={{ color: "#fff", fontSize: 18, marginBottom: 8 }}>Income-Driven Repayment (IDR)</h3>
              <p style={{ color: "#94a3b8", fontSize: 14, lineHeight: 1.6 }}>
                Cap your monthly payments at a percentage of your discretionary income. Start low while you build your practice, and increase as you earn more.
              </p>
            </div>
            <div style={{ background: "#0f172a", borderRadius: 16, padding: 28, border: "1px solid #334155" }}>
              <div style={{ fontSize: 24, marginBottom: 8 }}>🤖</div>
              <h3 style={{ color: "#fff", fontSize: 18, marginBottom: 8 }}>Our Tools Help You</h3>
              <p style={{ color: "#94a3b8", fontSize: 14, lineHeight: 1.6 }}>
                Track qualifying payments, get alerts before deadlines, and file forgiveness applications — all from the platform.
              </p>
            </div>
          </div>
          <div style={{ textAlign: "center", background: "#0f172a", borderRadius: 16, padding: 32, border: "2px solid #4ade80" }}>
            <div style={{ fontSize: 14, color: "#4ade80", fontWeight: 600, marginBottom: 8 }}>AVERAGE SAVINGS THROUGH PSLF</div>
            <div style={{ fontSize: 48, fontWeight: 800, color: "#4ade80" }}>$47,000</div>
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section style={{ padding: "60px 24px", maxWidth: 1000, margin: "0 auto" }}>
        <h2 style={{ fontSize: 32, fontWeight: 700, color: "#fff", textAlign: "center", marginBottom: 40 }}>From Students Like You</h2>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", gap: 20 }}>
          {[
            { quote: "I graduated with $180K in debt and no BigLaw offers. Within 6 months of doing assigned counsel work, I was earning $9K/month and building a client base.", name: "James L.", detail: "Class of 2025, Brooklyn Law" },
            { quote: "The panel application process was intimidating until I used this platform. Now I'm on 3 panels and never short on work.", name: "Priya S.", detail: "Class of 2024, CUNY Law" },
            { quote: "I'm on track for PSLF while building my own practice. Best decision I ever made.", name: "Marcus W.", detail: "Class of 2025, Howard Law" },
          ].map((t, i) => (
            <div key={i} style={{ background: "#1e293b", borderRadius: 16, padding: 28, border: "1px solid #334155" }}>
              <div style={{ fontSize: 32, color: "#4ade80", marginBottom: 12 }}>&ldquo;</div>
              <p style={{ color: "#e2e8f0", fontSize: 15, lineHeight: 1.6, marginBottom: 16 }}>{t.quote}</p>
              <div style={{ fontWeight: 700, color: "#fff", fontSize: 14 }}>{t.name}</div>
              <div style={{ color: "#64748b", fontSize: 13 }}>{t.detail}</div>
            </div>
          ))}
        </div>
      </section>

      {/* What You Get */}
      <section style={{ padding: "60px 24px", background: "#1e293b" }}>
        <div style={{ maxWidth: 1000, margin: "0 auto" }}>
          <h2 style={{ fontSize: 32, fontWeight: 700, color: "#fff", textAlign: "center", marginBottom: 40 }}>What You Get</h2>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))", gap: 16 }}>
            {[
              { icon: "🔍", title: "Panel Finder", desc: "Find every assigned counsel panel in your area" },
              { icon: "📋", title: "Application Helper", desc: "AI fills out panel applications for you" },
              { icon: "⚖️", title: "Case Management", desc: "Handle your caseload like a pro from day one" },
              { icon: "🤖", title: "AI Legal Team", desc: "Research, drafting, and analysis at your fingertips" },
              { icon: "💰", title: "Billing & Vouchers", desc: "Submit vouchers, track payments, manage private billing" },
              { icon: "📚", title: "Legal Wiki", desc: "Community knowledge base so you're never alone" },
              { icon: "🎓", title: "Loan Tracker", desc: "PSLF tracking and forgiveness filing" },
              { icon: "📈", title: "Practice Growth", desc: "Marketing tools to transition into private work" },
            ].map((f, i) => (
              <div key={i} style={{ background: "#0f172a", borderRadius: 16, padding: 24, textAlign: "center", border: "1px solid #334155" }}>
                <div style={{ fontSize: 32, marginBottom: 12 }}>{f.icon}</div>
                <div style={{ fontWeight: 700, color: "#fff", fontSize: 15, marginBottom: 6 }}>{f.title}</div>
                <div style={{ color: "#94a3b8", fontSize: 13, lineHeight: 1.5 }}>{f.desc}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Footer */}
      <section style={{ padding: "80px 24px", textAlign: "center" }}>
        <h2 style={{ fontSize: "clamp(28px, 5vw, 42px)", fontWeight: 800, color: "#fff", marginBottom: 16 }}>
          Your career starts now.<br /><span style={{ color: "#4ade80" }}>Not after BigLaw says yes.</span>
        </h2>
        <Link href="/login" style={{ display: "inline-block", background: "#22c55e", color: "#fff", padding: "16px 48px", borderRadius: 999, fontSize: 18, fontWeight: 700, textDecoration: "none", boxShadow: "0 4px 20px rgba(34,197,94,0.4)", marginTop: 16 }}>
          Start Free
        </Link>
      </section>

      {/* Footer */}
      <footer style={{ padding: "40px 24px 32px", background: "#0f172a", borderTop: "1px solid #1e293b", color: "rgba(255,255,255,0.7)", fontSize: 14 }}>
        <div style={{ maxWidth: 900, margin: "0 auto" }}>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(140px, 1fr))", gap: 16, marginBottom: 24, textAlign: "center" }}>
            <div>
              <p style={{ fontWeight: 700, color: "rgba(255,255,255,0.9)", fontSize: 12, textTransform: "uppercase", letterSpacing: 1, marginBottom: 8 }}>Platform</p>
              <Link href="/" style={{ display: "block", color: "rgba(255,255,255,0.7)", textDecoration: "none", fontSize: 13, marginBottom: 6 }}>Home</Link>
              <Link href="/login" style={{ display: "block", color: "rgba(255,255,255,0.7)", textDecoration: "none", fontSize: 13, marginBottom: 6 }}>Login / Sign Up</Link>
            </div>
            <div>
              <p style={{ fontWeight: 700, color: "rgba(255,255,255,0.9)", fontSize: 12, textTransform: "uppercase", letterSpacing: 1, marginBottom: 8 }}>For Individuals</p>
              <Link href="/prose" style={{ display: "block", color: "rgba(255,255,255,0.7)", textDecoration: "none", fontSize: 13, marginBottom: 6 }}>Self-Help / Pro Se</Link>
            </div>
            <div>
              <p style={{ fontWeight: 700, color: "rgba(255,255,255,0.9)", fontSize: 12, textTransform: "uppercase", letterSpacing: 1, marginBottom: 8 }}>For Attorneys</p>
              <Link href="/privatepractice" style={{ display: "block", color: "rgba(255,255,255,0.7)", textDecoration: "none", fontSize: 13, marginBottom: 6 }}>Private Practice</Link>
              <Link href="/students" style={{ display: "block", color: "rgba(255,255,255,0.7)", textDecoration: "none", fontSize: 13, marginBottom: 6 }}>Law Students</Link>
            </div>
            <div>
              <p style={{ fontWeight: 700, color: "rgba(255,255,255,0.9)", fontSize: 12, textTransform: "uppercase", letterSpacing: 1, marginBottom: 8 }}>For Organizations</p>
              <Link href="/lawschools" style={{ display: "block", color: "rgba(255,255,255,0.7)", textDecoration: "none", fontSize: 13, marginBottom: 6 }}>Law Schools</Link>
              <Link href="/government" style={{ display: "block", color: "rgba(255,255,255,0.7)", textDecoration: "none", fontSize: 13, marginBottom: 6 }}>Courts &amp; Government</Link>
            </div>
          </div>
          <div style={{ borderTop: "1px solid rgba(255,255,255,0.15)", paddingTop: 16, textAlign: "center" }}>
            <p>© 2026 Assigned Co-Counsel. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
