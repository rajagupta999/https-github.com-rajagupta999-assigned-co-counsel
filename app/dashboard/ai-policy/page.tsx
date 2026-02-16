"use client";

import Link from 'next/link';

export default function AIPolicyPage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-[#0a1628] to-[#0d2137]">
      <div className="max-w-4xl mx-auto px-6 py-8">

        {/* Header */}
        <div className="text-center mb-12 pt-4">
          <div className="w-16 h-16 mx-auto rounded-full bg-green-500/20 border border-green-500/30 flex items-center justify-center mb-4">
            <span className="text-3xl">🔒</span>
          </div>
          <h1 className="text-3xl font-bold text-white mb-3">
            AI Trust, Safety & <span className="text-[#D4AF37]">Privilege Protection</span>
          </h1>
          <p className="text-gray-400 text-lg max-w-2xl mx-auto">
            How Assigned Co-Counsel protects attorney-client privilege, eliminates hallucinations, 
            and maintains the same enterprise-grade security architecture used by leading legal AI platforms.
          </p>
        </div>

        {/* TL;DR Box */}
        <div className="bg-gradient-to-r from-green-500/10 to-emerald-500/5 border border-green-500/20 rounded-2xl p-6 mb-12">
          <h2 className="text-white font-bold text-lg mb-3">⚡ The Bottom Line</h2>
          <ul className="space-y-2 text-gray-300 text-sm">
            <li className="flex items-start gap-2"><span className="text-green-400 mt-0.5">✓</span> Your client data <strong className="text-white">never trains</strong> any AI model — contractually guaranteed</li>
            <li className="flex items-start gap-2"><span className="text-green-400 mt-0.5">✓</span> <strong className="text-white">Zero data retention</strong> — prompts and responses are purged after each request</li>
            <li className="flex items-start gap-2"><span className="text-green-400 mt-0.5">✓</span> Enterprise API endpoints only — <strong className="text-white">not public ChatGPT</strong></li>
            <li className="flex items-start gap-2"><span className="text-green-400 mt-0.5">✓</span> <strong className="text-white">RAG-grounded responses</strong> with citation requirements to prevent hallucinations</li>
            <li className="flex items-start gap-2"><span className="text-green-400 mt-0.5">✓</span> Conversation history stored <strong className="text-white">only on your device</strong> — never on our servers</li>
            <li className="flex items-start gap-2"><span className="text-green-400 mt-0.5">✓</span> Same architectural model as <strong className="text-white">leading legal AI platforms</strong> (used by Am Law 100 firms)</li>
          </ul>
        </div>

        {/* Section 1: Architecture */}
        <Section
          number="1"
          title="Enterprise-Grade Architecture"
          subtitle="How we keep your data out of public AI systems"
        >
          <p className="text-gray-300 text-sm leading-relaxed mb-4">
            When you use the public ChatGPT at <code className="text-xs bg-white/10 px-1.5 py-0.5 rounded">chat.openai.com</code>, 
            your data is processed on shared servers and may be used to improve OpenAI&apos;s models. 
            <strong className="text-white"> Assigned Co-Counsel never touches public AI endpoints.</strong>
          </p>
          <p className="text-gray-300 text-sm leading-relaxed mb-6">
            Instead, we route all AI requests through <strong className="text-white">enterprise API endpoints</strong> from 
            Cerebras and Groq — dedicated inference providers that operate under strict data processing agreements. 
            This is the same approach leading legal AI platforms uses with Microsoft Azure OpenAI: a private, 
            isolated processing environment where your data is never shared with other customers.
          </p>

          <div className="bg-white/5 border border-white/10 rounded-xl p-5 mb-4">
            <h4 className="text-white font-semibold text-sm mb-3">Our Processing Pipeline</h4>
            <div className="flex items-center gap-2 flex-wrap text-xs">
              <Step label="Your Browser" color="blue" />
              <Arrow />
              <Step label="Firebase Function (Encrypted)" color="amber" />
              <Arrow />
              <Step label="Cerebras Enterprise API" color="green" />
              <Arrow />
              <Step label="Response Returned" color="blue" />
              <Arrow />
              <Step label="Data Purged" color="red" />
            </div>
            <p className="text-gray-500 text-xs mt-3">
              All communication is encrypted via TLS 1.3. API keys never leave the server. 
              No data is stored at any point in the pipeline.
            </p>
          </div>

          <ComparisonTable />
        </Section>

        {/* Section 2: Zero Training */}
        <Section
          number="2"
          title="Zero Training Guarantee"
          subtitle="Your client's secrets will never be learned by the AI"
        >
          <p className="text-gray-300 text-sm leading-relaxed mb-4">
            The greatest threat to privilege is the possibility that an AI could <em>learn</em> your 
            client&apos;s confidential information and reveal it to another user. We eliminate this risk entirely:
          </p>

          <div className="space-y-3 mb-6">
            <Guarantee
              icon="🧊"
              title="Frozen Models"
              desc="We use pre-trained models (Llama 3.3 70B) that are fixed in time. They cannot be modified by your inputs. The model that processes your request today is identical to the one that processed a different attorney's request yesterday — your data doesn't change it."
            />
            <Guarantee
              icon="📝"
              title="Contractual Prohibition"
              desc="Both Cerebras and Groq contractually guarantee that API inputs and outputs are never used to train, fine-tune, or improve their models. This is explicitly stated in their Terms of Service and Data Processing Agreements."
            />
            <Guarantee
              icon="🗑️"
              title="Immediate Purging"
              desc="After generating a response, the inference server purges your prompt and the response from its processing memory. No copies are retained. No logs are kept. The interaction ceases to exist on the provider's infrastructure."
            />
            <Guarantee
              icon="🔐"
              title="No Human Review"
              desc="Unlike consumer AI products where staff may review conversations for safety, enterprise API endpoints prohibit human review of customer data. No one at Cerebras or Groq sees your prompts or responses."
            />
          </div>

          <div className="bg-amber-500/10 border border-amber-500/20 rounded-xl p-4">
            <h4 className="text-amber-300 font-semibold text-sm mb-1">Provider Verification</h4>
            <ul className="text-gray-400 text-xs space-y-1">
              <li>• <strong className="text-gray-300">Cerebras</strong>: <em>&quot;Cerebras does not use Customer Data to train, improve, or develop its models.&quot;</em> — <a href="https://cerebras.ai/terms-of-service" target="_blank" rel="noopener noreferrer" className="text-[#D4AF37] hover:underline">Terms of Service</a></li>
              <li>• <strong className="text-gray-300">Groq</strong>: <em>&quot;Groq does not use input or output data from API calls to train, improve, or fine-tune models.&quot;</em> — <a href="https://groq.com/privacy-policy/" target="_blank" rel="noopener noreferrer" className="text-[#D4AF37] hover:underline">Privacy Policy</a></li>
            </ul>
          </div>
        </Section>

        {/* Section 3: Privilege */}
        <Section
          number="3"
          title="Attorney-Client Privilege: The Agent Exception"
          subtitle='Why using AI doesn&apos;t waive privilege'
        >
          <p className="text-gray-300 text-sm leading-relaxed mb-4">
            Attorney-client privilege is generally waived when confidential information is disclosed to a third party. 
            However, the law recognizes a well-established exception for <strong className="text-white">agents of the attorney</strong> — 
            individuals and entities that assist in providing legal representation.
          </p>

          <div className="bg-white/5 border border-white/10 rounded-xl p-5 mb-4">
            <h4 className="text-white font-semibold text-sm mb-3">The Legal Framework</h4>
            <div className="space-y-3 text-sm text-gray-300">
              <div>
                <span className="text-[#D4AF37] font-medium">Kovel Doctrine</span> — <em>United States v. Kovel</em>, 296 F.2d 918 (2d Cir. 1961): 
                Communications with agents necessary to the attorney&apos;s provision of legal services remain privileged, 
                provided the agent is assisting with legal (not business) functions.
              </div>
              <div>
                <span className="text-[#D4AF37] font-medium">Restatement (Third) of the Law Governing Lawyers § 70</span>: 
                Privilege extends to communications made to agents of the lawyer when the communication is made 
                for the purpose of obtaining legal assistance.
              </div>
              <div>
                <span className="text-[#D4AF37] font-medium">ABA Formal Opinion 477R (2017)</span>: 
                Attorneys must make &quot;reasonable efforts&quot; to prevent unauthorized access to client communications — 
                including when using technology. Enterprise-grade encryption and zero-retention policies satisfy this standard.
              </div>
            </div>
          </div>

          <p className="text-gray-300 text-sm leading-relaxed mb-4">
            <strong className="text-white">Assigned Co-Counsel operates as a technology vendor and agent of the attorney.</strong> This is 
            the same legal framework that permits law firms to use:
          </p>
          <ul className="text-gray-400 text-sm space-y-1 mb-4 ml-4">
            <li>• Cloud email (Gmail, Outlook 365) for client communications</li>
            <li>• Document management systems (iManage, NetDocuments) for privileged files</li>
            <li>• E-discovery platforms (Relativity, Logikcull) for document review</li>
            <li>• Cloud storage (AWS, Azure) for case files</li>
            <li>• Legal research tools (Westlaw AI, LexisNexis) with AI features</li>
          </ul>
          <p className="text-gray-400 text-sm leading-relaxed">
            In each case, the vendor is bound by confidentiality agreements and prohibited from using 
            client data for its own purposes. The privilege remains intact because the vendor functions 
            as an agent assisting in legal representation, not as an independent third party.
          </p>
        </Section>

        {/* Section 4: RAG */}
        <Section
          number="4"
          title="RAG Architecture: Eliminating Hallucinations"
          subtitle="How we ground AI responses in real legal authority"
        >
          <p className="text-gray-300 text-sm leading-relaxed mb-4">
            The biggest risk with AI in legal practice isn&apos;t privacy — it&apos;s <strong className="text-white">hallucination</strong>. 
            AI models can generate plausible-sounding but completely fabricated case citations, statutes, and legal rules. 
            We address this with a multi-layered <strong className="text-white">Retrieval-Augmented Generation (RAG)</strong> architecture 
            that grounds every response in real legal authority.
          </p>

          <div className="bg-white/5 border border-white/10 rounded-xl p-5 mb-6">
            <h4 className="text-white font-semibold text-sm mb-4">How Our RAG System Works</h4>
            <div className="space-y-4">
              <RAGStep
                num="1"
                title="Document Ingestion & Chunking"
                desc="When you upload case files, discovery, pleadings, or other documents, they are split into semantic chunks (approximately 500 tokens each with 50-token overlap) to preserve context across chunk boundaries. Each chunk is tagged with its source, document type, and associated case."
              />
              <RAGStep
                num="2"
                title="Vector Embedding"
                desc="Each chunk is converted into a high-dimensional vector (1024 dimensions) using legal-domain-optimized embedding models. These vectors capture the semantic meaning of the text — not just keywords, but legal concepts, relationships, and context. Legal-specific terms (court, motion, statute, evidence, etc.) receive enhanced weighting."
              />
              <RAGStep
                num="3"
                title="Multi-Source Knowledge Base"
                desc="Our RAG system draws from five distinct knowledge sources, each indexed and searchable:"
              />
            </div>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-2 ml-10 mt-2 mb-4">
              {[
                { icon: '📄', label: 'Your Documents', desc: 'Discovery, pleadings, evidence' },
                { icon: '⚖️', label: 'Case Law', desc: 'CourtListener, 19+ databases' },
                { icon: '📜', label: 'Statutes', desc: 'NY Penal, CPL, DRL, FCA' },
                { icon: '📚', label: 'Legal Wiki', desc: '107+ community entries' },
                { icon: '👥', label: 'Crowdsourced', desc: 'Practice tips, local rules' },
                { icon: '🔍', label: 'Live Research', desc: 'Real-time database search' },
              ].map((s, i) => (
                <div key={i} className="bg-black/20 rounded-lg p-2.5 text-center">
                  <div className="text-lg">{s.icon}</div>
                  <div className="text-white text-xs font-medium mt-1">{s.label}</div>
                  <div className="text-gray-500 text-[10px]">{s.desc}</div>
                </div>
              ))}
            </div>
            <div className="space-y-4">
              <RAGStep
                num="4"
                title="Semantic Search & Retrieval"
                desc="When you ask a question, your query is embedded into the same vector space and compared against all indexed chunks using cosine similarity. The top-K most relevant chunks (default: 5) are retrieved, filtered by a minimum relevance threshold (0.3), and can be scoped to specific cases or source types."
              />
              <RAGStep
                num="5"
                title="Context-Augmented Prompting"
                desc="Retrieved chunks are injected into the AI prompt as grounding context, with explicit instructions: cite sources, reference specific documents, and if the context doesn't contain relevant information, say so rather than fabricate an answer."
              />
              <RAGStep
                num="6"
                title="Citation Verification"
                desc="In Citation Mode, the AI is required to provide a legal citation for every legal claim. If it cannot find supporting authority, it must explicitly state: '⚠️ I cannot locate specific authority for this proposition.' Our citation parser validates the format of all generated citations against standard legal citation patterns."
              />
            </div>
          </div>

          <div className="bg-purple-500/10 border border-purple-500/20 rounded-xl p-4 mb-4">
            <h4 className="text-purple-300 font-semibold text-sm mb-2">Anti-Hallucination Safeguards</h4>
            <div className="space-y-2 text-sm text-gray-300">
              <div className="flex items-start gap-2">
                <span className="text-purple-400 mt-0.5 shrink-0">🛡️</span>
                <span><strong className="text-white">Citation Mode</strong>: Forces the AI to cite authority for every legal claim. Unsupported propositions are flagged.</span>
              </div>
              <div className="flex items-start gap-2">
                <span className="text-purple-400 mt-0.5 shrink-0">🛡️</span>
                <span><strong className="text-white">RAG Grounding</strong>: Responses are anchored to retrieved documents, not the model&apos;s training data alone.</span>
              </div>
              <div className="flex items-start gap-2">
                <span className="text-purple-400 mt-0.5 shrink-0">🛡️</span>
                <span><strong className="text-white">Multi-Agent Cross-Check</strong>: Multiple AI perspectives (prosecutor, defense, judge) analyze the same issue — inconsistencies surface immediately.</span>
              </div>
              <div className="flex items-start gap-2">
                <span className="text-purple-400 mt-0.5 shrink-0">🛡️</span>
                <span><strong className="text-white">Source Attribution</strong>: Every piece of retrieved context includes its source, citation, and document origin for verification.</span>
              </div>
              <div className="flex items-start gap-2">
                <span className="text-purple-400 mt-0.5 shrink-0">🛡️</span>
                <span><strong className="text-white">Red Team Analysis</strong>: Adversarial AI agents specifically look for weaknesses, unsupported claims, and logical gaps in generated analysis.</span>
              </div>
            </div>
          </div>
        </Section>

        {/* Section 5: Multi-Agent */}
        <Section
          number="5"
          title="Multi-Agent Analysis System"
          subtitle="Eight specialized AI perspectives for comprehensive case analysis"
        >
          <p className="text-gray-300 text-sm leading-relaxed mb-4">
            Rather than relying on a single AI response, our multi-agent system runs the same 
            case facts through <strong className="text-white">eight distinct analytical perspectives</strong> in parallel. 
            This approach surfaces blind spots, stress-tests arguments, and provides the kind of 
            comprehensive analysis that would normally require a team of attorneys.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mb-4">
            {[
              { icon: '⚔️', name: 'Prosecutor Agent', desc: 'Identifies weaknesses in your defense, anticipates the DA\'s strategy, finds holes in your arguments', color: 'red' },
              { icon: '🛡️', name: 'Defense Agent', desc: 'Strengthens your position, identifies viable defenses, builds your theory of the case', color: 'blue' },
              { icon: '👨‍⚖️', name: 'Judge Agent', desc: 'Evaluates legal merit from the bench, predicts rulings, identifies procedural issues', color: 'purple' },
              { icon: '👥', name: 'Jury Analyst', desc: 'Predicts how laypersons will react to evidence, testimony, and arguments', color: 'green' },
              { icon: '📋', name: 'Appellate Agent', desc: 'Identifies preservation issues, spots potential grounds for appeal, flags record-building opportunities', color: 'orange' },
              { icon: '📚', name: 'Legal Scholar', desc: 'Provides academic analysis, identifies relevant precedent, suggests novel legal theories', color: 'indigo' },
              { icon: '✍️', name: 'Scribe Agent', desc: 'Synthesizes all perspectives into a cohesive summary with actionable recommendations', color: 'gray' },
              { icon: '📊', name: 'Risk Analyst', desc: 'Quantifies case risks, models potential outcomes, identifies leverage points for negotiation', color: 'teal' },
            ].map((agent, i) => (
              <div key={i} className={`bg-${agent.color}-500/10 border border-${agent.color}-500/20 rounded-lg p-3`} style={{ backgroundColor: `rgb(from var(--color-${agent.color}-500) r g b / 0.1)`, borderColor: `rgb(from var(--color-${agent.color}-500) r g b / 0.2)` }}>
                <div className="flex items-center gap-2 mb-1">
                  <span className="text-lg">{agent.icon}</span>
                  <span className="text-white font-medium text-sm">{agent.name}</span>
                </div>
                <p className="text-gray-400 text-xs">{agent.desc}</p>
              </div>
            ))}
          </div>

          <p className="text-gray-400 text-sm leading-relaxed">
            Each agent operates independently with its own system prompt, analytical framework, and 
            evaluation criteria. The Scribe agent then synthesizes all analyses into a unified report 
            with a confidence score and prioritized recommendations. This ensures no single perspective 
            dominates and edge cases are surfaced.
          </p>
        </Section>

        {/* Section 6: Data Storage */}
        <Section
          number="6"
          title="Data Storage & Your Control"
          subtitle="Where your data lives and how you control it"
        >
          <div className="space-y-3 mb-4">
            <DataPoint
              label="Conversation History"
              location="Your browser's localStorage"
              server={false}
              desc="Chat conversations with Lex and Co-Pilot AI are stored only in your browser. Clear your browser data and they're gone. We never see them."
            />
            <DataPoint
              label="Case Files & Documents"
              location="Firebase (Google Cloud, US servers)"
              server={true}
              desc="Uploaded documents are stored in Firebase with encryption at rest and in transit. Only authenticated users can access their own data. We do not access your files."
            />
            <DataPoint
              label="User Preferences"
              location="Your browser's localStorage"
              server={false}
              desc="Settings, pinned databases, widget preferences — all stored locally on your device."
            />
            <DataPoint
              label="AI Prompts & Responses"
              location="Nowhere (pass-through)"
              server={false}
              desc="Prompts are sent to the AI provider, the response is returned to you, and all data is purged. No copies exist anywhere after delivery."
            />
            <DataPoint
              label="Time Tracking & Vouchers"
              location="Your browser's localStorage"
              server={false}
              desc="Billable time entries are stored locally. Future versions will offer optional cloud sync with encryption."
            />
          </div>

          <div className="bg-blue-500/10 border border-blue-500/20 rounded-xl p-4">
            <h4 className="text-blue-300 font-semibold text-sm mb-1">Your Data, Your Control</h4>
            <p className="text-gray-400 text-xs leading-relaxed">
              You can delete all locally stored data at any time by clearing your browser&apos;s localStorage. 
              You can request deletion of any cloud-stored data (case files, documents) through the Settings page. 
              We do not sell, share, or monetize your data in any way.
            </p>
          </div>
        </Section>

        {/* Section 7: Comparison */}
        <Section
          number="7"
          title="How We Compare to leading legal AI platforms"
          subtitle="Enterprise-grade security isn't just for Am Law 100 firms"
        >
          <div className="bg-white/5 border border-white/10 rounded-xl overflow-hidden mb-4">
            <table className="w-full text-xs">
              <thead>
                <tr className="border-b border-white/10 bg-white/5">
                  <th className="text-left text-gray-400 font-medium px-4 py-3">Security Feature</th>
                  <th className="text-center text-gray-400 font-medium px-3 py-3">leading legal AI platforms</th>
                  <th className="text-center text-gray-400 font-medium px-3 py-3">Assigned Co-Counsel</th>
                  <th className="text-center text-red-400 font-medium px-3 py-3">Public ChatGPT</th>
                </tr>
              </thead>
              <tbody className="text-gray-300">
                {[
                  ['Private API endpoint', '✓', '✓', '✗'],
                  ['Zero model training on data', '✓', '✓', '✗'],
                  ['Zero data retention', '✓', '✓', '✗'],
                  ['No human review of inputs', '✓', '✓', '✗'],
                  ['Encrypted in transit (TLS)', '✓', '✓', '✓'],
                  ['RAG-grounded responses', '✓', '✓', '✗'],
                  ['Citation verification', '✓', '✓', '✗'],
                  ['Multi-agent analysis', '✓', '✓', '✗'],
                  ['Local-first data storage', '—', '✓', '✗'],
                  ['Open source codebase', '✗', 'Planned', '✗'],
                  ['Free for 18-B attorneys', '✗', '✓', '—'],
                ].map((row, i) => (
                  <tr key={i} className="border-b border-white/5">
                    <td className="px-4 py-2 text-gray-300">{row[0]}</td>
                    <td className="px-3 py-2 text-center">{row[1] === '✓' ? <span className="text-green-400">✓</span> : row[1] === '✗' ? <span className="text-red-400">✗</span> : <span className="text-gray-500">{row[1]}</span>}</td>
                    <td className="px-3 py-2 text-center">{row[2] === '✓' ? <span className="text-green-400">✓</span> : row[2] === '✗' ? <span className="text-red-400">✗</span> : <span className="text-[#D4AF37]">{row[2]}</span>}</td>
                    <td className="px-3 py-2 text-center">{row[3] === '✓' ? <span className="text-green-400">✓</span> : row[3] === '✗' ? <span className="text-red-400">✗</span> : <span className="text-gray-500">{row[3]}</span>}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <p className="text-gray-400 text-xs leading-relaxed">
            leading legal AI platforms uses Azure OpenAI Service (GPT-4) within a private tenant. Assigned Co-Counsel uses Cerebras 
            and Groq enterprise APIs with equivalent privacy guarantees. The key architectural principles are identical: 
            private endpoints, zero training, zero retention, and vendor-as-agent privilege protection. 
            The primary difference is that enterprise legal AI platforms charge $2,000+/month per seat while Assigned Co-Counsel 
            is built for 18-B panel attorneys who need the same protections at no cost.
          </p>
        </Section>

        {/* Section 8: Compliance */}
        <Section
          number="8"
          title="Ethical & Regulatory Compliance"
          subtitle="Meeting your obligations under the Rules of Professional Conduct"
        >
          <div className="space-y-3 mb-4">
            <ComplianceItem
              rule="Rule 1.1 — Competence"
              desc="Attorneys must understand the technology they use. This page provides the transparency needed to satisfy that obligation. Our RAG architecture, multi-agent cross-checking, and citation verification demonstrate reasonable technological competence in AI deployment."
            />
            <ComplianceItem
              rule="Rule 1.6 — Confidentiality"
              desc="We maintain client confidentiality through zero-retention processing, enterprise API endpoints with contractual no-training guarantees, and local-first data storage. These measures meet or exceed the 'reasonable efforts' standard."
            />
            <ComplianceItem
              rule="Rule 5.3 — Supervisory Responsibility"
              desc="AI output is always presented as a draft for attorney review. The AI explicitly states it cannot replace professional judgment. Attorneys maintain full supervisory control over all AI-generated content."
            />
            <ComplianceItem
              rule="ABA Formal Opinion 477R"
              desc="We satisfy the obligation to make 'reasonable efforts to prevent inadvertent or unauthorized disclosure' through enterprise-grade encryption, zero-retention policies, and contractual data protections."
            />
            <ComplianceItem
              rule="NYSBA Ethics Opinion 1228"
              desc="Consistent with NYSBA guidance on AI use: attorneys should understand the technology, maintain supervision, and ensure confidentiality. Our transparent architecture and this policy page support all three requirements."
            />
          </div>
        </Section>

        {/* Questions */}
        <div className="text-center py-8 border-t border-white/10 mt-8">
          <h3 className="text-white font-semibold mb-2">Questions about our AI policy?</h3>
          <p className="text-gray-400 text-sm mb-4">
            We&apos;re committed to full transparency. If you have concerns about privacy, privilege, 
            or our AI architecture, we want to hear them.
          </p>
          <div className="flex items-center justify-center gap-3">
            <Link
              href="/dashboard/agent"
              className="px-4 py-2 bg-[#D4AF37]/20 border border-[#D4AF37]/30 text-[#D4AF37] rounded-lg text-sm hover:bg-[#D4AF37]/30 transition-colors"
            >
              Meet Lex →
            </Link>
            <Link
              href="/dashboard/settings"
              className="px-4 py-2 bg-white/5 border border-white/10 text-gray-300 rounded-lg text-sm hover:bg-white/10 transition-colors"
            >
              Settings
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

// ── Component Helpers ────────────────────────────────────────────

function Section({ number, title, subtitle, children }: { number: string; title: string; subtitle: string; children: React.ReactNode }) {
  return (
    <div className="mb-12">
      <div className="flex items-start gap-3 mb-4">
        <div className="w-8 h-8 rounded-full bg-[#D4AF37]/20 border border-[#D4AF37]/30 flex items-center justify-center text-[#D4AF37] font-bold text-sm shrink-0 mt-0.5">
          {number}
        </div>
        <div>
          <h2 className="text-xl font-bold text-white">{title}</h2>
          <p className="text-gray-400 text-sm">{subtitle}</p>
        </div>
      </div>
      <div className="ml-11">{children}</div>
    </div>
  );
}

function Guarantee({ icon, title, desc }: { icon: string; title: string; desc: string }) {
  return (
    <div className="flex items-start gap-3 bg-white/5 border border-white/10 rounded-lg p-3">
      <span className="text-xl mt-0.5">{icon}</span>
      <div>
        <h4 className="text-white font-medium text-sm">{title}</h4>
        <p className="text-gray-400 text-xs mt-0.5 leading-relaxed">{desc}</p>
      </div>
    </div>
  );
}

function RAGStep({ num, title, desc }: { num: string; title: string; desc: string }) {
  return (
    <div className="flex items-start gap-3">
      <div className="w-6 h-6 rounded-full bg-purple-500/20 border border-purple-500/30 flex items-center justify-center text-purple-300 font-bold text-xs shrink-0 mt-0.5">
        {num}
      </div>
      <div>
        <h4 className="text-white font-medium text-sm">{title}</h4>
        <p className="text-gray-400 text-xs mt-0.5 leading-relaxed">{desc}</p>
      </div>
    </div>
  );
}

function Step({ label, color }: { label: string; color: string }) {
  const colors: Record<string, string> = {
    blue: 'bg-blue-500/20 border-blue-500/30 text-blue-300',
    amber: 'bg-amber-500/20 border-amber-500/30 text-amber-300',
    green: 'bg-green-500/20 border-green-500/30 text-green-300',
    red: 'bg-red-500/20 border-red-500/30 text-red-300',
  };
  return <span className={`px-2 py-1 rounded border text-[10px] font-medium ${colors[color]}`}>{label}</span>;
}

function Arrow() {
  return <span className="text-gray-600 text-xs">→</span>;
}

function DataPoint({ label, location, server, desc }: { label: string; location: string; server: boolean; desc: string }) {
  return (
    <div className="flex items-start gap-3 bg-white/5 border border-white/10 rounded-lg p-3">
      <div className={`w-2 h-2 rounded-full mt-1.5 shrink-0 ${server ? 'bg-amber-400' : 'bg-green-400'}`} />
      <div>
        <div className="flex items-center gap-2">
          <span className="text-white font-medium text-sm">{label}</span>
          <span className={`text-[10px] px-1.5 py-0.5 rounded ${server ? 'bg-amber-500/20 text-amber-300' : 'bg-green-500/20 text-green-300'}`}>
            {server ? 'Cloud (encrypted)' : 'Local only'}
          </span>
        </div>
        <p className="text-gray-500 text-xs mt-0.5">{location}</p>
        <p className="text-gray-400 text-xs mt-1 leading-relaxed">{desc}</p>
      </div>
    </div>
  );
}

function ComplianceItem({ rule, desc }: { rule: string; desc: string }) {
  return (
    <div className="bg-white/5 border border-white/10 rounded-lg p-3">
      <h4 className="text-[#D4AF37] font-medium text-sm">{rule}</h4>
      <p className="text-gray-400 text-xs mt-1 leading-relaxed">{desc}</p>
    </div>
  );
}

function ComparisonTable() {
  return (
    <div className="bg-white/5 border border-white/10 rounded-xl overflow-hidden">
      <table className="w-full text-xs">
        <thead>
          <tr className="border-b border-white/10">
            <th className="text-left text-gray-400 font-medium px-4 py-2.5">Feature</th>
            <th className="text-center text-red-400 font-medium px-3 py-2.5">Public ChatGPT</th>
            <th className="text-center text-green-400 font-medium px-3 py-2.5">Assigned Co-Counsel</th>
          </tr>
        </thead>
        <tbody className="text-gray-300">
          {[
            ['Endpoint', 'Public, shared API', 'Enterprise, isolated API'],
            ['Model Training', 'Trains on your data', 'Never trains on data'],
            ['Data Retention', 'Retains 30+ days', 'Zero retention'],
            ['Staff Access', 'May be reviewed', 'No human access'],
            ['Data Storage', 'OpenAI cloud servers', 'Your device (localStorage)'],
            ['Privilege Risk', 'HIGH ⚠️', 'PROTECTED ✓'],
          ].map((row, i) => (
            <tr key={i} className="border-b border-white/5">
              <td className="px-4 py-2 text-gray-300 font-medium">{row[0]}</td>
              <td className="px-3 py-2 text-center text-red-300">{row[1]}</td>
              <td className="px-3 py-2 text-center text-green-300">{row[2]}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
