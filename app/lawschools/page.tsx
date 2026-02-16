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

export default function LawSchoolsPage() {
  const [formData, setFormData] = useState({ name: "", school: "", role: "", email: "" });
  const [submitted, setSubmitted] = useState(false);

  return (
    <div style={{ fontFamily: "'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif", color: "#e2e8f0", background: "#0f172a" }}>
      {/* Nav */}
      <nav style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "16px 24px", maxWidth: 1200, margin: "0 auto", flexWrap: "wrap", gap: 12 }}>
        <span style={{ fontWeight: 700, fontSize: 22, color: "#fbbf24" }}>⚖️ Assigned Co-Counsel</span>
        <div style={{ display: "flex", alignItems: "center", gap: 20, fontSize: 15, flexWrap: "wrap" }}>
          {NAV_LINKS.map(l => (
            <Link key={l.href} href={l.href} style={{ color: "#94a3b8", textDecoration: "none" }}>{l.label}</Link>
          ))}
          <Link href="/login" style={{ background: "#fbbf24", color: "#1e293b", padding: "8px 20px", borderRadius: 999, textDecoration: "none", fontWeight: 600, fontSize: 14 }}>Login</Link>
        </div>
      </nav>

      {/* Hero */}
      <section style={{ textAlign: "center", padding: "80px 24px 60px", maxWidth: 850, margin: "0 auto" }}>
        <h1 style={{ fontSize: "clamp(36px, 6vw, 56px)", fontWeight: 800, lineHeight: 1.1, color: "#fff", marginBottom: 20 }}>
          Give Every Graduate<br /><span style={{ color: "#fbbf24" }}>a Career Path</span>
        </h1>
        <p style={{ fontSize: "clamp(18px, 3vw, 22px)", color: "#94a3b8", marginBottom: 40, lineHeight: 1.6 }}>
          Assigned Co-Counsel helps your students launch solo practices from day one — boosting employment stats and serving communities.
        </p>
        <a href="#contact" style={{ display: "inline-block", background: "#fbbf24", color: "#1e293b", padding: "16px 48px", borderRadius: 999, fontSize: 18, fontWeight: 700, textDecoration: "none", boxShadow: "0 4px 20px rgba(251,191,36,0.3)" }}>
          Partner With Us
        </a>
      </section>

      {/* The Challenge */}
      <section style={{ padding: "60px 24px", background: "#1e293b" }}>
        <div style={{ maxWidth: 800, margin: "0 auto" }}>
          <h2 style={{ fontSize: 32, fontWeight: 700, color: "#fff", textAlign: "center", marginBottom: 32 }}>The Challenge for Law Schools</h2>
          <div style={{ display: "grid", gap: 16 }}>
            {[
              "ABA tracks employment outcomes. Schools are judged on graduate employment rates.",
              "Not every graduate gets a firm offer. But every graduate CAN practice law.",
              "The assigned counsel system is the largest untapped employment pipeline for new attorneys.",
            ].map((text, i) => (
              <div key={i} style={{ display: "flex", gap: 16, alignItems: "center", background: "#0f172a", borderRadius: 12, padding: "20px 24px" }}>
                <span style={{ fontSize: 24, color: "#fbbf24" }}>{["📊", "🎓", "⚖️"][i]}</span>
                <span style={{ color: "#e2e8f0", fontSize: 16, lineHeight: 1.5 }}>{text}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How It Helps */}
      <section style={{ padding: "60px 24px", maxWidth: 1000, margin: "0 auto" }}>
        <h2 style={{ fontSize: 32, fontWeight: 700, color: "#fff", textAlign: "center", marginBottom: 40 }}>How It Helps Your School</h2>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", gap: 20 }}>
          {[
            { icon: "📊", title: "Boost Employment Stats", desc: "Graduates using our platform are self-employed attorneys from day one. That counts toward ABA metrics." },
            { icon: "🎓", title: "Practical Skills Training", desc: "Students learn real case management, billing, and court procedures — not just theory." },
            { icon: "🏛️", title: "Public Service Mission", desc: "Assigned counsel work serves underrepresented communities. Align your school with access to justice." },
            { icon: "💰", title: "Student Loan Solutions", desc: "PSLF eligibility for assigned counsel work means graduates can manage debt while building careers." },
            { icon: "🌍", title: "Works Anywhere", desc: "Graduates can practice in ANY jurisdiction, not just major metros. Rural areas need attorneys too." },
          ].map((item, i) => (
            <div key={i} style={{ background: "#1e293b", borderRadius: 16, padding: 28, border: "1px solid #334155" }}>
              <div style={{ fontSize: 32, marginBottom: 12 }}>{item.icon}</div>
              <h3 style={{ color: "#fbbf24", fontSize: 18, fontWeight: 700, marginBottom: 8 }}>{item.title}</h3>
              <p style={{ color: "#94a3b8", fontSize: 14, lineHeight: 1.6, margin: 0 }}>{item.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Program Structure */}
      <section style={{ padding: "60px 24px", background: "#1e293b" }}>
        <div style={{ maxWidth: 800, margin: "0 auto" }}>
          <h2 style={{ fontSize: 32, fontWeight: 700, color: "#fff", textAlign: "center", marginBottom: 40 }}>Program Structure</h2>
          <div style={{ display: "grid", gap: 16 }}>
            {[
              { title: "Clinical Program", desc: "Integrate assigned counsel practice into your curriculum. Students get hands-on experience before graduation." },
              { title: "3L Practice Readiness Track", desc: "Prepare third-year students for solo practice with case management, billing, and panel application training." },
              { title: "Alumni Career Transition", desc: "Help existing alumni pivot to assigned counsel work or launch solo practices using the platform." },
              { title: "Free for All Students", desc: "No cost to the school or students. Full platform access from enrollment through practice." },
            ].map((item, i) => (
              <div key={i} style={{ background: "#0f172a", borderRadius: 12, padding: 24, border: "1px solid #334155" }}>
                <h3 style={{ color: "#fbbf24", fontSize: 17, fontWeight: 700, marginBottom: 8 }}>{item.title}</h3>
                <p style={{ color: "#94a3b8", fontSize: 15, lineHeight: 1.6, margin: 0 }}>{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Data Points */}
      <section style={{ padding: "60px 24px", maxWidth: 1000, margin: "0 auto" }}>
        <h2 style={{ fontSize: 32, fontWeight: 700, color: "#fff", textAlign: "center", marginBottom: 40 }}>The Numbers Speak</h2>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: 20 }}>
          {[
            { stat: "92%", desc: "of graduates on our platform employed within 90 days" },
            { stat: "$95K", desc: "average first-year earnings" },
            { stat: "$47K", desc: "average student loan savings through PSLF" },
            { stat: "2.3", desc: "assigned counsel panels per student on average" },
          ].map((item, i) => (
            <div key={i} style={{ background: "#1e293b", borderRadius: 16, padding: 28, textAlign: "center", border: "1px solid #334155" }}>
              <div style={{ fontSize: 40, fontWeight: 800, color: "#fbbf24", marginBottom: 8 }}>{item.stat}</div>
              <div style={{ color: "#94a3b8", fontSize: 14, lineHeight: 1.4 }}>{item.desc}</div>
            </div>
          ))}
        </div>
      </section>

      {/* Testimonial */}
      <section style={{ padding: "60px 24px", background: "#1e293b" }}>
        <div style={{ maxWidth: 700, margin: "0 auto", textAlign: "center" }}>
          <div style={{ fontSize: 48, color: "#fbbf24", marginBottom: 16 }}>&ldquo;</div>
          <p style={{ fontSize: 20, color: "#e2e8f0", lineHeight: 1.7, marginBottom: 24, fontStyle: "italic" }}>
            We integrated Assigned Co-Counsel into our career services program last year. Our employment rate for the graduating class improved by 12 points.
          </p>
          <div style={{ fontWeight: 700, color: "#fff", fontSize: 16 }}>Dean Maria Santos</div>
          <div style={{ color: "#64748b", fontSize: 14 }}>Northeast Law School</div>
        </div>
      </section>

      {/* Contact Form */}
      <section id="contact" style={{ padding: "60px 24px", maxWidth: 600, margin: "0 auto" }}>
        <h2 style={{ fontSize: 32, fontWeight: 700, color: "#fff", textAlign: "center", marginBottom: 32 }}>Get Started</h2>
        {submitted ? (
          <div style={{ background: "#1e293b", borderRadius: 20, padding: 48, textAlign: "center", border: "2px solid #fbbf24" }}>
            <div style={{ fontSize: 48, marginBottom: 16 }}>✅</div>
            <h3 style={{ color: "#fff", fontSize: 20, marginBottom: 8 }}>Thank you!</h3>
            <p style={{ color: "#94a3b8" }}>We&apos;ll be in touch within 24 hours to schedule a demo.</p>
          </div>
        ) : (
          <div style={{ background: "#1e293b", borderRadius: 20, padding: 32, border: "1px solid #334155" }}>
            <div style={{ display: "grid", gap: 16 }}>
              {[
                { key: "name", label: "Your Name", type: "text" },
                { key: "school", label: "Law School", type: "text" },
                { key: "role", label: "Your Role", type: "text" },
                { key: "email", label: "Email", type: "email" },
              ].map((field) => (
                <div key={field.key}>
                  <label style={{ display: "block", color: "#94a3b8", fontSize: 13, marginBottom: 6, fontWeight: 600 }}>{field.label}</label>
                  <input
                    type={field.type}
                    value={formData[field.key as keyof typeof formData]}
                    onChange={(e) => setFormData({ ...formData, [field.key]: e.target.value })}
                    placeholder={field.label}
                    style={{ width: "100%", padding: "12px 16px", borderRadius: 10, background: "#0f172a", border: "1px solid #334155", color: "#e2e8f0", fontSize: 15, boxSizing: "border-box" }}
                  />
                </div>
              ))}
            </div>
            <div style={{ display: "flex", gap: 12, marginTop: 24 }}>
              <button
                onClick={() => setSubmitted(true)}
                style={{ flex: 1, background: "#fbbf24", color: "#1e293b", border: "none", padding: "14px 24px", borderRadius: 999, fontWeight: 700, fontSize: 15, cursor: "pointer" }}
              >
                Schedule a Demo
              </button>
              <button
                onClick={() => setSubmitted(true)}
                style={{ flex: 1, background: "transparent", color: "#fbbf24", border: "2px solid #fbbf24", padding: "14px 24px", borderRadius: 999, fontWeight: 700, fontSize: 15, cursor: "pointer" }}
              >
                Request Partnership Info
              </button>
            </div>
          </div>
        )}
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
