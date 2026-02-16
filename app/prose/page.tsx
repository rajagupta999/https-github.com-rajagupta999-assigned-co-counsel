"use client";

import Link from "next/link";

export default function ProSeLandingPage() {
  return (
    <div style={{ fontFamily: "'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif", color: "#1a1a1a", background: "#FFFBF5" }}>
      {/* Nav */}
      <nav style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "16px 24px", maxWidth: 1200, margin: "0 auto" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          <span style={{ fontWeight: 700, fontSize: 22, color: "#b45309" }}>⚖️ Assigned Co-Counsel</span>
          <span style={{ background: "#fbbf24", color: "#78350f", fontSize: 12, fontWeight: 600, padding: "2px 8px", borderRadius: 999 }}>Self-Help</span>
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: 20, fontSize: 15 }}>
          <Link href="/" style={{ color: "#78350f", textDecoration: "none" }}>Home</Link>
          <Link href="/privatepractice" style={{ color: "#78350f", textDecoration: "none" }}>For Attorneys</Link>
          <Link href="/login" style={{ color: "#78350f", textDecoration: "none" }}>Login</Link>
          <Link href="/login" style={{ background: "#f59e0b", color: "#fff", padding: "8px 20px", borderRadius: 999, textDecoration: "none", fontWeight: 600, fontSize: 14 }}>Get Started Free</Link>
        </div>
      </nav>

      {/* Hero */}
      <section style={{ textAlign: "center", padding: "80px 24px 40px", maxWidth: 800, margin: "0 auto" }}>
        <h1 style={{ fontSize: "clamp(36px, 6vw, 56px)", fontWeight: 800, lineHeight: 1.1, color: "#78350f", marginBottom: 20 }}>
          Your Pre-Nup. Your Will.<br />Your Terms.
        </h1>
        <p style={{ fontSize: "clamp(18px, 3vw, 24px)", color: "#92400e", marginBottom: 16, lineHeight: 1.5 }}>
          Create legally sound documents yourself with AI guidance — for free.
        </p>
        <p style={{ fontSize: 16, color: "#a16207", marginBottom: 40 }}>
          No $3,000 attorney fees. No confusing forms. Just clear, step-by-step help.
        </p>
        <div style={{ display: "flex", gap: 12, justifyContent: "center", flexWrap: "wrap" }}>
          <Link href="/login" style={{ display: "inline-block", background: "#f59e0b", color: "#fff", padding: "16px 40px", borderRadius: 999, fontSize: 18, fontWeight: 700, textDecoration: "none", boxShadow: "0 4px 14px rgba(245,158,11,0.4)" }}>
            Get Started Free
          </Link>
          <Link href="#how-it-works" style={{ display: "inline-block", background: "transparent", color: "#b45309", padding: "16px 32px", borderRadius: 999, fontSize: 16, fontWeight: 600, textDecoration: "none", border: "2px solid #f59e0b" }}>
            See How It Works
          </Link>
        </div>
      </section>

      {/* Highlight Cards — What You Can Do */}
      <section style={{ padding: "40px 24px 60px", maxWidth: 1000, margin: "0 auto" }}>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", gap: 20 }}>
          {[
            { emoji: "💍", title: "Create Your Pre-Nup", desc: "Protect your assets before marriage. Our AI walks you through every clause — property, debts, spousal support. Average attorney cost: $2,500. Here: Free.", savings: "Save $2,500", color: "#FEF3C7" },
            { emoji: "📜", title: "Draft Your Will", desc: "Make sure your wishes are honored. Name beneficiaries, assign guardians, specify bequests. Legally valid in all 50 states.", savings: "Save $1,500", color: "#FEF3C7" },
            { emoji: "🏦", title: "Set Up a Trust", desc: "Protect your family's future. Revocable living trusts, asset protection, avoid probate. Our templates cover the most common structures.", savings: "Save $3,000+", color: "#FEF3C7" },
          ].map((item, i) => (
            <div key={i} style={{ background: item.color, borderRadius: 20, padding: 32, position: "relative", overflow: "hidden" }}>
              <div style={{ position: "absolute", top: 12, right: 16, background: "#059669", color: "#fff", fontSize: 12, fontWeight: 700, padding: "4px 10px", borderRadius: 999 }}>{item.savings}</div>
              <div style={{ fontSize: 48, marginBottom: 16 }}>{item.emoji}</div>
              <h3 style={{ fontSize: 22, fontWeight: 700, color: "#78350f", marginBottom: 8 }}>{item.title}</h3>
              <p style={{ fontSize: 15, color: "#92400e", lineHeight: 1.6 }}>{item.desc}</p>
              <Link href="/login" style={{ display: "inline-block", marginTop: 16, color: "#b45309", fontWeight: 600, fontSize: 14, textDecoration: "none" }}>Start Now →</Link>
            </div>
          ))}
        </div>
      </section>

      {/* Pain Points */}
      <section style={{ padding: "60px 24px", background: "#FEF3C7" }}>
        <div style={{ maxWidth: 900, margin: "0 auto" }}>
          <h2 style={{ textAlign: "center", fontSize: 28, fontWeight: 700, color: "#78350f", marginBottom: 40 }}>Why do simple legal documents cost so much?</h2>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(250px, 1fr))", gap: 24 }}>
            {[
              { emoji: "💸", title: "$300/hour", text: "The average attorney charges $300/hr for documents you could draft yourself with guidance" },
              { emoji: "⏰", title: "Weeks of waiting", text: "Back-and-forth scheduling, revisions, approvals — when you could do it in an afternoon" },
              { emoji: "🤯", title: "Confusing jargon", text: "Legal forms shouldn't require a law degree to understand" },
            ].map((item, i) => (
              <div key={i} style={{ background: "#fff", borderRadius: 16, padding: 28, textAlign: "center" }}>
                <div style={{ fontSize: 36, marginBottom: 8 }}>{item.emoji}</div>
                <h4 style={{ fontSize: 18, fontWeight: 700, color: "#78350f", marginBottom: 6 }}>{item.title}</h4>
                <p style={{ fontSize: 14, color: "#92400e", lineHeight: 1.5 }}>{item.text}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Full Features Grid */}
      <section style={{ padding: "60px 24px", maxWidth: 1000, margin: "0 auto" }}>
        <h2 style={{ textAlign: "center", fontSize: 32, fontWeight: 700, color: "#78350f", marginBottom: 16 }}>Everything you need — all free</h2>
        <p style={{ textAlign: "center", fontSize: 16, color: "#92400e", marginBottom: 48, maxWidth: 600, margin: "0 auto 48px" }}>AI-powered tools that guide you through any legal matter, from simple to complex.</p>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", gap: 20 }}>
          {[
            { emoji: "💍", title: "Pre-Nuptial Agreements", desc: "Step-by-step builder with clauses for property, debts, and spousal support" },
            { emoji: "📜", title: "Wills & Trusts", desc: "Create legally valid wills, living trusts, and estate plans" },
            { emoji: "🤖", title: "AI Legal Helper", desc: "Ask any legal question in plain English — get real answers, not jargon" },
            { emoji: "📄", title: "Document Templates", desc: "Custody petitions, motions, financial disclosures — fill-in-the-blank ready" },
            { emoji: "📋", title: "Court Guides", desc: "Step-by-step instructions for filings, court dates, and procedures" },
            { emoji: "📅", title: "Case Calendar", desc: "Track deadlines, court dates, and filings in one place" },
            { emoji: "🔍", title: "Legal Research", desc: "Search case law, statutes, and legal databases — no subscription needed" },
            { emoji: "📚", title: "Legal Wiki", desc: "Community-curated legal info written in language you actually understand" },
          ].map((f, i) => (
            <div key={i} style={{ background: "#fff", borderRadius: 16, padding: 28, border: "1px solid #FDE68A", boxShadow: "0 1px 3px rgba(0,0,0,0.04)" }}>
              <div style={{ fontSize: 32, marginBottom: 12 }}>{f.emoji}</div>
              <h3 style={{ fontSize: 17, fontWeight: 700, marginBottom: 6, color: "#78350f" }}>{f.title}</h3>
              <p style={{ fontSize: 14, color: "#6b7280", lineHeight: 1.5 }}>{f.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* How It Works */}
      <section id="how-it-works" style={{ padding: "60px 24px", background: "#FEF3C7" }}>
        <div style={{ maxWidth: 900, margin: "0 auto", textAlign: "center" }}>
          <h2 style={{ fontSize: 32, fontWeight: 700, color: "#78350f", marginBottom: 48 }}>How It Works</h2>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: 32 }}>
            {[
              { step: "1", title: "Sign up free", desc: "No credit card. No commitment. Just an email." },
              { step: "2", title: "Tell us what you need", desc: "Pre-nup? Will? Custody filing? We'll guide you." },
              { step: "3", title: "AI walks you through it", desc: "Answer simple questions. We generate the document." },
              { step: "4", title: "Review & file", desc: "Download, sign, and file — or get an attorney review." },
            ].map((s, i) => (
              <div key={i}>
                <div style={{ width: 56, height: 56, borderRadius: "50%", background: "#f59e0b", color: "#fff", fontSize: 24, fontWeight: 800, display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 16px" }}>{s.step}</div>
                <h3 style={{ fontSize: 17, fontWeight: 700, color: "#78350f", marginBottom: 6 }}>{s.title}</h3>
                <p style={{ fontSize: 14, color: "#92400e" }}>{s.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section style={{ padding: "60px 24px", maxWidth: 1000, margin: "0 auto" }}>
        <h2 style={{ textAlign: "center", fontSize: 28, fontWeight: 700, color: "#78350f", marginBottom: 40 }}>People just like you</h2>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", gap: 20 }}>
          {[
            { quote: "I created my pre-nup in one afternoon. My fiancé and I both felt comfortable with the process — no awkward meetings with a stranger.", name: "Sarah K.", location: "Austin, TX", saved: "Saved $2,500" },
            { quote: "After my father passed, I used this to set up a living trust for my kids. The AI explained every option clearly. I would have spent thousands.", name: "Michael T.", location: "Brooklyn, NY", saved: "Saved $3,200" },
            { quote: "I filed my custody modification myself and the step-by-step guide made it feel doable. The calendar reminders made sure I never missed a deadline.", name: "Maria R.", location: "Queens, NY", saved: "Saved $2,000" },
          ].map((t, i) => (
            <div key={i} style={{ background: "#fff", borderRadius: 20, padding: 32, border: "1px solid #FDE68A" }}>
              <p style={{ fontSize: 15, fontStyle: "italic", color: "#78350f", lineHeight: 1.6, marginBottom: 20 }}>&ldquo;{t.quote}&rdquo;</p>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <div>
                  <p style={{ fontWeight: 700, color: "#92400e", fontSize: 14 }}>{t.name}</p>
                  <p style={{ fontSize: 12, color: "#a16207" }}>{t.location}</p>
                </div>
                <span style={{ background: "#D1FAE5", color: "#065F46", fontSize: 12, fontWeight: 700, padding: "4px 10px", borderRadius: 999 }}>{t.saved}</span>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Need More Help? — The Flywheel */}
      <section style={{ padding: "60px 24px", background: "linear-gradient(135deg, #FFFBEB 0%, #FEF3C7 100%)" }}>
        <div style={{ maxWidth: 900, margin: "0 auto", textAlign: "center" }}>
          <h2 style={{ fontSize: 30, fontWeight: 700, color: "#78350f", marginBottom: 16 }}>Some things are better with an attorney.</h2>
          <p style={{ fontSize: 17, color: "#92400e", lineHeight: 1.6, marginBottom: 40, maxWidth: 650, margin: "0 auto 40px" }}>
            When your case gets complex, we connect you with cost-effective local attorneys — many of them right here on our platform.
          </p>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))", gap: 20, maxWidth: 800, margin: "0 auto" }}>
            <div style={{ background: "#fff", borderRadius: 16, padding: 28, border: "1px solid #BBF7D0" }}>
              <div style={{ fontSize: 36, marginBottom: 12 }}>🟢</div>
              <h4 style={{ fontWeight: 700, color: "#065F46", fontSize: 16, marginBottom: 6 }}>Do It Yourself</h4>
              <p style={{ fontSize: 13, color: "#6b7280", lineHeight: 1.5 }}>Use our free AI tools for simple matters — pre-nups, wills, basic filings.</p>
              <p style={{ fontSize: 14, fontWeight: 700, color: "#059669", marginTop: 8 }}>Free</p>
            </div>
            <div style={{ background: "#fff", borderRadius: 16, padding: 28, border: "1px solid #BFDBFE" }}>
              <div style={{ fontSize: 36, marginBottom: 12 }}>🔵</div>
              <h4 style={{ fontWeight: 700, color: "#1E40AF", fontSize: 16, marginBottom: 6 }}>Assigned Counsel</h4>
              <p style={{ fontSize: 13, color: "#6b7280", lineHeight: 1.5 }}>Qualify for a state-funded attorney for criminal, custody, or family matters.</p>
              <p style={{ fontSize: 14, fontWeight: 700, color: "#2563EB", marginTop: 8 }}>State-Funded</p>
            </div>
            <div style={{ background: "#fff", borderRadius: 16, padding: 28, border: "1px solid #E9D5FF" }}>
              <div style={{ fontSize: 36, marginBottom: 12 }}>🟣</div>
              <h4 style={{ fontWeight: 700, color: "#7C3AED", fontSize: 16, marginBottom: 6 }}>Find a Local Attorney</h4>
              <p style={{ fontSize: 13, color: "#6b7280", lineHeight: 1.5 }}>Browse affordable private attorneys in your area — for specialized or complex work.</p>
              <p style={{ fontSize: 14, fontWeight: 700, color: "#7C3AED", marginTop: 8 }}>From $49/hr</p>
            </div>
          </div>
          <p style={{ fontSize: 15, color: "#92400e", marginTop: 32, lineHeight: 1.6, maxWidth: 600, margin: "32px auto 0" }}>
            <strong>The best part?</strong> Your attorney already uses our platform — so your case file, documents, and communications are all in one place. No starting over.
          </p>
        </div>
      </section>

      {/* Smart Cost Optimization */}
      <section style={{ padding: "60px 24px", maxWidth: 800, margin: "0 auto", textAlign: "center" }}>
        <h2 style={{ fontSize: 28, fontWeight: 700, color: "#78350f", marginBottom: 16 }}>We help you spend smarter</h2>
        <p style={{ fontSize: 16, color: "#92400e", marginBottom: 32, lineHeight: 1.6 }}>
          Our AI analyzes your situation and tells you what you can handle yourself, what qualifies for state-funded help, and what needs a private attorney.
        </p>
        <div style={{ background: "#fff", borderRadius: 20, padding: 32, border: "1px solid #FDE68A", textAlign: "left" }}>
          <p style={{ fontSize: 13, fontWeight: 700, color: "#6b7280", textTransform: "uppercase", letterSpacing: 1, marginBottom: 16 }}>Example: Divorce with Custody</p>
          {[
            { task: "File Financial Disclosure", method: "Pro Se (Free)", badge: "🟢", savings: "Save $500" },
            { task: "Custody Hearing", method: "Assigned Counsel (State-Funded)", badge: "🔵", savings: "Save $3,000" },
            { task: "Equitable Distribution", method: "Private Attorney ($)", badge: "🟣", savings: "Complex assets" },
            { task: "Draft Parenting Plan", method: "Pro Se (Free)", badge: "🟢", savings: "Save $800" },
          ].map((item, i) => (
            <div key={i} style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "14px 0", borderBottom: i < 3 ? "1px solid #F3F4F6" : "none" }}>
              <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                <span style={{ fontSize: 20 }}>{item.badge}</span>
                <div>
                  <p style={{ fontWeight: 600, fontSize: 15, color: "#1a1a1a" }}>{item.task}</p>
                  <p style={{ fontSize: 13, color: "#6b7280" }}>{item.method}</p>
                </div>
              </div>
              <span style={{ background: "#D1FAE5", color: "#065F46", fontSize: 12, fontWeight: 700, padding: "4px 10px", borderRadius: 999 }}>{item.savings}</span>
            </div>
          ))}
          <p style={{ fontSize: 14, color: "#059669", fontWeight: 700, marginTop: 16, textAlign: "center" }}>Total estimated savings: $4,300+</p>
        </div>
      </section>

      {/* CTA Footer */}
      <section style={{ padding: "80px 24px", textAlign: "center", background: "linear-gradient(135deg, #f59e0b 0%, #d97706 100%)" }}>
        <h2 style={{ fontSize: "clamp(28px, 5vw, 40px)", fontWeight: 800, color: "#fff", marginBottom: 16 }}>Your pre-nup. Your will. Your future.</h2>
        <p style={{ fontSize: 18, color: "rgba(255,255,255,0.9)", marginBottom: 32 }}>Start for free. Upgrade only when you need to.</p>
        <Link href="/login" style={{ display: "inline-block", background: "#fff", color: "#b45309", padding: "16px 40px", borderRadius: 999, fontSize: 18, fontWeight: 700, textDecoration: "none", boxShadow: "0 4px 14px rgba(0,0,0,0.15)" }}>
          Get Started Free
        </Link>
        <p style={{ fontSize: 14, color: "rgba(255,255,255,0.7)", marginTop: 12 }}>No credit card required</p>
      </section>

      {/* Footer */}
      <footer style={{ padding: "40px 24px 32px", background: "#78350f", color: "rgba(255,255,255,0.7)", fontSize: 14 }}>
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
