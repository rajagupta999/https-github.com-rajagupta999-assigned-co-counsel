"use client";

import Link from "next/link";

export default function PrivatePracticeLandingPage() {
  return (
    <div style={{ fontFamily: "'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif", color: "#1e1b4b", background: "#faf9ff" }}>
      {/* Nav */}
      <nav style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "16px 24px", maxWidth: 1200, margin: "0 auto" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          <span style={{ fontWeight: 700, fontSize: 22, color: "#6d28d9" }}>⚖️ Assigned Co-Counsel</span>
          <span style={{ background: "#7c3aed", color: "#fff", fontSize: 12, fontWeight: 600, padding: "2px 8px", borderRadius: 999 }}>Private Practice</span>
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: 20, fontSize: 15 }}>
          <Link href="/" style={{ color: "#4c1d95", textDecoration: "none" }}>Home</Link>
          <Link href="/login" style={{ color: "#4c1d95", textDecoration: "none" }}>Login</Link>
          <Link href="/login" style={{ background: "#7c3aed", color: "#fff", padding: "8px 20px", borderRadius: 999, textDecoration: "none", fontWeight: 600, fontSize: 14 }}>Start Free Trial</Link>
        </div>
      </nav>

      {/* Hero */}
      <section style={{ textAlign: "center", padding: "80px 24px 40px", maxWidth: 800, margin: "0 auto" }}>
        <h1 style={{ fontSize: "clamp(36px, 6vw, 56px)", fontWeight: 800, lineHeight: 1.1, marginBottom: 20, background: "linear-gradient(135deg, #4c1d95 0%, #7c3aed 100%)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>
          Run Your Practice<br />Like a Top Firm.
        </h1>
        <p style={{ fontSize: "clamp(18px, 3vw, 22px)", color: "#6b7280", marginBottom: 40, lineHeight: 1.5 }}>
          AI-powered practice management built for solo attorneys and small firms.
        </p>
        <Link href="/login" style={{ display: "inline-block", background: "linear-gradient(135deg, #7c3aed 0%, #6d28d9 100%)", color: "#fff", padding: "16px 40px", borderRadius: 999, fontSize: 18, fontWeight: 700, textDecoration: "none", boxShadow: "0 4px 14px rgba(124,58,237,0.4)" }}>
          Start Free Trial
        </Link>
      </section>

      {/* Stats Bar */}
      <section style={{ padding: "40px 24px" }}>
        <div style={{ maxWidth: 800, margin: "0 auto", display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 24, textAlign: "center" }}>
          {[
            { value: "500+", label: "Attorneys" },
            { value: "$2M+", label: "Billed" },
            { value: "10,000+", label: "Cases Managed" },
          ].map((s, i) => (
            <div key={i}>
              <div style={{ fontSize: 36, fontWeight: 800, color: "#7c3aed" }}>{s.value}</div>
              <div style={{ fontSize: 14, color: "#6b7280", fontWeight: 500 }}>{s.label}</div>
            </div>
          ))}
        </div>
      </section>

      {/* Core Value Prop */}
      <section style={{ padding: "40px 24px 60px", textAlign: "center" }}>
        <p style={{ fontSize: "clamp(20px, 3vw, 28px)", fontWeight: 700, color: "#1e1b4b", maxWidth: 700, margin: "0 auto", lineHeight: 1.4 }}>
          Most practice management tools were built for BigLaw.<br />
          <span style={{ color: "#7c3aed" }}>This one was built for you.</span>
        </p>
      </section>

      {/* Features Grid */}
      <section style={{ padding: "60px 24px", maxWidth: 1000, margin: "0 auto" }}>
        <h2 style={{ textAlign: "center", fontSize: 32, fontWeight: 700, color: "#1e1b4b", marginBottom: 48 }}>Everything to run your firm</h2>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", gap: 20 }}>
          {[
            { emoji: "💼", title: "Client Portal", desc: "Give every client their own secure page with case updates and documents" },
            { emoji: "💳", title: "Billing & Trust Accounting", desc: "Invoices, retainers, and IOLTA compliance — all built in" },
            { emoji: "🤖", title: "AI Legal Team", desc: "Virtual Assistant + Paralegal + Research Desk at your fingertips" },
            { emoji: "📨", title: "Omnichannel Messaging", desc: "Email, SMS, iMessage, WhatsApp — one unified inbox" },
            { emoji: "📈", title: "Marketing & Client Acquisition", desc: "Google Ads scripts, reputation management, lead tracking" },
            { emoji: "🔒", title: "Local Sovereign Cloud", desc: "Keep files on YOUR server, not ours. Full data sovereignty" },
          ].map((f, i) => (
            <div key={i} style={{ background: "#fff", borderRadius: 16, padding: 28, border: "1px solid #e9e5f5", boxShadow: "0 1px 3px rgba(0,0,0,0.04)" }}>
              <div style={{ fontSize: 36, marginBottom: 12 }}>{f.emoji}</div>
              <h3 style={{ fontSize: 18, fontWeight: 700, marginBottom: 6, color: "#1e1b4b" }}>{f.title}</h3>
              <p style={{ fontSize: 15, color: "#6b7280", lineHeight: 1.5 }}>{f.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Built for the Journey */}
      <section style={{ padding: "60px 24px", background: "linear-gradient(135deg, #f5f3ff 0%, #ede9fe 100%)" }}>
        <div style={{ maxWidth: 800, margin: "0 auto", textAlign: "center" }}>
          <h2 style={{ fontSize: 32, fontWeight: 700, color: "#1e1b4b", marginBottom: 16 }}>Built for the Journey</h2>
          <p style={{ fontSize: 17, color: "#6b7280", marginBottom: 48 }}>The platform that grows with your career.</p>
          <div style={{ display: "flex", flexDirection: "column", gap: 0, alignItems: "center" }}>
            {[
              { step: "1", title: "Start with Assigned Counsel", desc: "Build experience with assigned counsel work using our tools", color: "#a78bfa" },
              { step: "2", title: "Take on Private Clients", desc: "Use the same platform to manage your own clients and billing", color: "#7c3aed" },
              { step: "3", title: "Grow Your Firm", desc: "Scale from solo to small firm — add associates, paralegals, staff", color: "#6d28d9" },
            ].map((s, i) => (
              <div key={i}>
                {i > 0 && <div style={{ width: 2, height: 32, background: "#c4b5fd", margin: "0 auto" }} />}
                <div style={{ display: "flex", alignItems: "center", gap: 20, background: "#fff", borderRadius: 16, padding: "24px 32px", maxWidth: 500, width: "100%", textAlign: "left", border: "1px solid #e9e5f5" }}>
                  <div style={{ width: 48, height: 48, borderRadius: "50%", background: s.color, color: "#fff", fontSize: 20, fontWeight: 800, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>{s.step}</div>
                  <div>
                    <h4 style={{ fontWeight: 700, color: "#1e1b4b", marginBottom: 4 }}>{s.title}</h4>
                    <p style={{ fontSize: 14, color: "#6b7280" }}>{s.desc}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing Teaser */}
      <section style={{ padding: "60px 24px", textAlign: "center" }}>
        <div style={{ maxWidth: 500, margin: "0 auto", background: "#fff", borderRadius: 20, padding: 40, border: "1px solid #e9e5f5", boxShadow: "0 2px 8px rgba(0,0,0,0.04)" }}>
          <div style={{ fontSize: 14, fontWeight: 600, color: "#7c3aed", textTransform: "uppercase", letterSpacing: 1, marginBottom: 12 }}>Pricing</div>
          <h3 style={{ fontSize: 28, fontWeight: 800, color: "#1e1b4b", marginBottom: 8 }}>Free during beta.</h3>
          <p style={{ fontSize: 17, color: "#6b7280" }}>Plans starting at <strong>$49/mo</strong> coming soon.</p>
        </div>
      </section>

      {/* CTA Footer */}
      <section style={{ padding: "80px 24px", textAlign: "center", background: "linear-gradient(135deg, #7c3aed 0%, #4c1d95 100%)" }}>
        <h2 style={{ fontSize: 36, fontWeight: 800, color: "#fff", marginBottom: 16 }}>Ready to build your practice?</h2>
        <p style={{ fontSize: 18, color: "rgba(255,255,255,0.85)", marginBottom: 32 }}>Join hundreds of attorneys already using Assigned Co-Counsel.</p>
        <Link href="/login" style={{ display: "inline-block", background: "#fff", color: "#6d28d9", padding: "16px 40px", borderRadius: 999, fontSize: 18, fontWeight: 700, textDecoration: "none", boxShadow: "0 4px 14px rgba(0,0,0,0.15)" }}>
          Start Building Your Practice
        </Link>
      </section>

      {/* Footer */}
      <footer style={{ padding: "40px 24px 32px", background: "#1e1b4b", color: "rgba(255,255,255,0.7)", fontSize: 14 }}>
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
