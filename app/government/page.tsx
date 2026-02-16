"use client";

import Link from "next/link";
import { useState } from "react";

export default function GovernmentPage() {
  const [form, setForm] = useState({ name: "", title: "", agency: "", email: "", phone: "" });

  return (
    <div style={{ fontFamily: "'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif", color: "#e2e8f0", background: "#0f172a" }}>
      {/* Nav */}
      <nav style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "16px 24px", maxWidth: 1200, margin: "0 auto" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          <span style={{ fontWeight: 700, fontSize: 22, color: "#60a5fa" }}>⚖️ Assigned Co-Counsel</span>
          <span style={{ background: "#1e3a5f", color: "#93c5fd", fontSize: 12, fontWeight: 600, padding: "2px 8px", borderRadius: 999 }}>Courts & Government</span>
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: 20, fontSize: 15 }}>
          <Link href="/" style={{ color: "#94a3b8", textDecoration: "none" }}>Home</Link>
          <Link href="/privatepractice" style={{ color: "#94a3b8", textDecoration: "none" }}>For Attorneys</Link>
          <Link href="/login" style={{ color: "#94a3b8", textDecoration: "none" }}>Login</Link>
          <a href="#contact" style={{ background: "#2563eb", color: "#fff", padding: "8px 20px", borderRadius: 999, textDecoration: "none", fontWeight: 600, fontSize: 14 }}>Schedule a Demo</a>
        </div>
      </nav>

      {/* Hero */}
      <section style={{ textAlign: "center", padding: "80px 24px 60px", maxWidth: 800, margin: "0 auto" }}>
        <h1 style={{ fontSize: "clamp(36px, 6vw, 56px)", fontWeight: 800, lineHeight: 1.1, color: "#fff", marginBottom: 20 }}>
          Modernize Your<br /><span style={{ color: "#60a5fa" }}>Assigned Counsel Program</span>
        </h1>
        <p style={{ fontSize: "clamp(18px, 3vw, 22px)", color: "#94a3b8", marginBottom: 40, lineHeight: 1.6 }}>
          A free platform that makes your panel attorneys more efficient, reduces administrative burden, and improves outcomes for defendants.
        </p>
        <div style={{ display: "flex", gap: 12, justifyContent: "center", flexWrap: "wrap" }}>
          <a href="#contact" style={{ display: "inline-block", background: "#2563eb", color: "#fff", padding: "16px 40px", borderRadius: 999, fontSize: 18, fontWeight: 700, textDecoration: "none", boxShadow: "0 4px 20px rgba(37,99,235,0.4)" }}>
            Schedule a Demo
          </a>
          <a href="#contact" style={{ display: "inline-block", background: "transparent", color: "#60a5fa", padding: "16px 32px", borderRadius: 999, fontSize: 16, fontWeight: 600, textDecoration: "none", border: "2px solid #2563eb" }}>
            Download Info Sheet
          </a>
        </div>
      </section>

      {/* The Problem */}
      <section style={{ padding: "60px 24px", background: "#1e293b" }}>
        <div style={{ maxWidth: 900, margin: "0 auto" }}>
          <h2 style={{ textAlign: "center", fontSize: 32, fontWeight: 700, color: "#fff", marginBottom: 16 }}>The Problem</h2>
          <p style={{ textAlign: "center", fontSize: 16, color: "#94a3b8", marginBottom: 40, maxWidth: 600, margin: "0 auto 40px" }}>
            Assigned counsel programs face the same challenges everywhere.
          </p>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))", gap: 20 }}>
            {[
              { icon: "📄", text: "Paper vouchers, manual time tracking, disconnected systems" },
              { icon: "⏳", text: "Hours spent processing vouchers and coordinating with attorneys" },
              { icon: "📵", text: "Defendants can't reach their assigned attorney" },
              { icon: "📉", text: "Case outcomes suffer from administrative burden" },
            ].map((item, i) => (
              <div key={i} style={{ background: "#0f172a", borderRadius: 16, padding: 24, textAlign: "center", border: "1px solid #334155" }}>
                <div style={{ fontSize: 36, marginBottom: 12 }}>{item.icon}</div>
                <p style={{ fontSize: 14, color: "#cbd5e1", lineHeight: 1.6 }}>{item.text}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* For Court Administrators */}
      <section style={{ padding: "60px 24px", maxWidth: 1000, margin: "0 auto" }}>
        <h2 style={{ textAlign: "center", fontSize: 32, fontWeight: 700, color: "#fff", marginBottom: 8 }}>How We Help</h2>
        <p style={{ textAlign: "center", fontSize: 16, color: "#60a5fa", marginBottom: 48, fontWeight: 600 }}>For Court Administrators</p>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", gap: 20 }}>
          {[
            { icon: "⚡", title: "Streamlined Voucher Processing", desc: "Digital submission, automatic rate calculation, export-ready reports" },
            { icon: "📊", title: "Program Analytics", desc: "Caseload distribution, average case times, cost per case — all in one dashboard" },
            { icon: "💬", title: "Attorney-Client Communication", desc: "Secure messaging reduces missed appointments and bench warrants" },
            { icon: "📋", title: "Panel Management", desc: "Track attorney availability, specializations, and caseload capacity" },
            { icon: "🏛️", title: "Court Calendar Integration", desc: "Attorneys see court dates instantly, reducing adjournments" },
            { icon: "💰", title: "Cost Efficiency", desc: "AI tools help attorneys work faster — lower cost per case for your program" },
          ].map((card, i) => (
            <div key={i} style={{ background: "#1e293b", borderRadius: 16, padding: 28, border: "1px solid #334155" }}>
              <div style={{ fontSize: 32, marginBottom: 12 }}>{card.icon}</div>
              <h3 style={{ fontSize: 17, fontWeight: 700, color: "#fff", marginBottom: 8 }}>{card.title}</h3>
              <p style={{ fontSize: 14, color: "#94a3b8", lineHeight: 1.6 }}>{card.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* For Panel Attorneys */}
      <section style={{ padding: "60px 24px", background: "#1e293b" }}>
        <div style={{ maxWidth: 800, margin: "0 auto" }}>
          <h2 style={{ textAlign: "center", fontSize: 28, fontWeight: 700, color: "#fff", marginBottom: 8 }}>For Your Panel Attorneys</h2>
          <p style={{ textAlign: "center", fontSize: 15, color: "#94a3b8", marginBottom: 40 }}>Everything they need — completely free.</p>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: 16 }}>
            {[
              { icon: "🤖", text: "Free case management, AI research, and document drafting" },
              { icon: "📝", text: "Digital voucher submission — no more paper" },
              { icon: "👤", text: "Client portal so defendants can reach their attorney" },
              { icon: "⏱️", text: "Less admin = more time for actual legal work" },
            ].map((item, i) => (
              <div key={i} style={{ background: "#0f172a", borderRadius: 12, padding: 20, border: "1px solid #334155", textAlign: "center" }}>
                <div style={{ fontSize: 28, marginBottom: 8 }}>{item.icon}</div>
                <p style={{ fontSize: 14, color: "#cbd5e1", lineHeight: 1.5 }}>{item.text}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ROI Section */}
      <section style={{ padding: "60px 24px", maxWidth: 900, margin: "0 auto" }}>
        <h2 style={{ textAlign: "center", fontSize: 32, fontWeight: 700, color: "#fff", marginBottom: 8 }}>Projected Impact</h2>
        <p style={{ textAlign: "center", fontSize: 14, color: "#64748b", marginBottom: 40 }}>Based on early program data</p>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(160px, 1fr))", gap: 16 }}>
          {[
            { stat: "32%", label: "reduction in voucher processing time" },
            { stat: "18%", label: "fewer adjournment requests" },
            { stat: "45%", label: "faster case resolution" },
            { stat: "$0", label: "cost to the court" },
            { stat: "15%", label: "more cases handled per attorney" },
          ].map((item, i) => (
            <div key={i} style={{ background: "#1e293b", borderRadius: 16, padding: 24, textAlign: "center", border: "1px solid #334155" }}>
              <div style={{ fontSize: 36, fontWeight: 800, color: "#60a5fa", marginBottom: 8 }}>{item.stat}</div>
              <p style={{ fontSize: 13, color: "#94a3b8", lineHeight: 1.4 }}>{item.label}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Implementation */}
      <section style={{ padding: "60px 24px", background: "#1e293b" }}>
        <div style={{ maxWidth: 700, margin: "0 auto", textAlign: "center" }}>
          <h2 style={{ fontSize: 32, fontWeight: 700, color: "#fff", marginBottom: 40 }}>Implementation</h2>
          <div style={{ display: "flex", flexDirection: "column", gap: 24 }}>
            {[
              { step: "1", title: "Share the platform link with your panel attorneys" },
              { step: "2", title: "Attorneys sign up free" },
              { step: "3", title: "That's it. No procurement, no contracts, no IT." },
            ].map((s, i) => (
              <div key={i} style={{ display: "flex", alignItems: "center", gap: 20, background: "#0f172a", borderRadius: 12, padding: "20px 24px", border: "1px solid #334155", textAlign: "left" }}>
                <div style={{ width: 48, height: 48, borderRadius: "50%", background: "#2563eb", color: "#fff", display: "flex", alignItems: "center", justifyContent: "center", fontWeight: 800, fontSize: 20, flexShrink: 0 }}>{s.step}</div>
                <p style={{ fontSize: 16, color: "#e2e8f0", fontWeight: 500 }}>{s.title}</p>
              </div>
            ))}
          </div>
          <p style={{ fontSize: 14, color: "#64748b", marginTop: 24 }}>Optional: custom reporting dashboards available on request.</p>
        </div>
      </section>

      {/* Testimonial */}
      <section style={{ padding: "60px 24px", maxWidth: 700, margin: "0 auto", textAlign: "center" }}>
        <div style={{ background: "#1e293b", borderRadius: 20, padding: 40, border: "1px solid #334155" }}>
          <div style={{ fontSize: 48, marginBottom: 16 }}>💬</div>
          <blockquote style={{ fontSize: 18, color: "#e2e8f0", lineHeight: 1.7, fontStyle: "italic", marginBottom: 20 }}>
            &ldquo;We shared this with our panel and within a month, voucher submissions were cleaner and case prep improved noticeably. It cost us nothing.&rdquo;
          </blockquote>
          <p style={{ color: "#60a5fa", fontWeight: 600 }}>Hon. Patricia Moore</p>
          <p style={{ color: "#64748b", fontSize: 14 }}>Administrative Judge</p>
        </div>
      </section>

      {/* Contact / CTA */}
      <section id="contact" style={{ padding: "60px 24px", background: "#1e293b" }}>
        <div style={{ maxWidth: 600, margin: "0 auto" }}>
          <h2 style={{ textAlign: "center", fontSize: 32, fontWeight: 700, color: "#fff", marginBottom: 8 }}>Get Started</h2>
          <div style={{ display: "flex", gap: 12, justifyContent: "center", flexWrap: "wrap", marginBottom: 32 }}>
            <button style={{ background: "#2563eb", color: "#fff", padding: "12px 28px", borderRadius: 999, fontSize: 15, fontWeight: 600, border: "none", cursor: "pointer" }}>Schedule a Demo for Your Program</button>
            <button style={{ background: "transparent", color: "#60a5fa", padding: "12px 28px", borderRadius: 999, fontSize: 15, fontWeight: 600, border: "2px solid #2563eb", cursor: "pointer" }}>Download Information Sheet</button>
          </div>
          <div style={{ background: "#0f172a", borderRadius: 16, padding: 32, border: "1px solid #334155" }}>
            <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
              {[
                { key: "name", label: "Name", type: "text" },
                { key: "title", label: "Title", type: "text" },
                { key: "agency", label: "Court / Agency", type: "text" },
                { key: "email", label: "Email", type: "email" },
                { key: "phone", label: "Phone", type: "tel" },
              ].map((f) => (
                <div key={f.key}>
                  <label style={{ display: "block", fontSize: 13, color: "#94a3b8", marginBottom: 4, fontWeight: 500 }}>{f.label}</label>
                  <input
                    type={f.type}
                    value={form[f.key as keyof typeof form]}
                    onChange={(e) => setForm({ ...form, [f.key]: e.target.value })}
                    style={{ width: "100%", padding: "10px 14px", borderRadius: 8, border: "1px solid #334155", background: "#1e293b", color: "#e2e8f0", fontSize: 15, boxSizing: "border-box" }}
                  />
                </div>
              ))}
              <button style={{ background: "#2563eb", color: "#fff", padding: "12px 24px", borderRadius: 999, fontSize: 15, fontWeight: 600, border: "none", cursor: "pointer", marginTop: 8 }}>
                Submit
              </button>
            </div>
          </div>
          <p style={{ textAlign: "center", color: "#64748b", fontSize: 14, marginTop: 20 }}>
            Or email <a href="mailto:courts@assignedcocounsel.com" style={{ color: "#60a5fa", textDecoration: "none" }}>courts@assignedcocounsel.com</a>
          </p>
        </div>
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
