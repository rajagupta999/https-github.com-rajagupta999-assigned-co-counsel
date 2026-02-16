# Assigned Co-Counsel: Product Strategy & Feature Roadmap

## Building the Essential Practice Management Tool for NYC 18B Panel Attorneys

**Prepared by:** 18B Development Team  
**Date:** February 4, 2026  
**Version:** 1.0

---

## Table of Contents

1. [Executive Summary](#executive-summary)
2. [Market Context: NYC 18B Panel](#market-context)
3. [Competitive Landscape](#competitive-landscape)
4. [Current Product Assessment](#current-assessment)
5. [Feature Recommendations by Practice Area](#feature-recommendations)
6. [Technical Architecture](#technical-architecture)
7. [Prioritized Implementation Roadmap](#roadmap)
8. [Business Model & Pricing](#business-model)
9. [Success Metrics](#success-metrics)

---

## Executive Summary

Assigned Co-Counsel has the opportunity to become the essential practice management and AI-assisted tool for the 3,000+ attorneys on NYC's 18B panel who handle Family Court (custody), Criminal Court, and Supreme Court (divorce) matters.

**The Core Problem:** 18B attorneys operate as solo practitioners handling high-volume, low-fee cases with no dedicated technology support. They struggle with:
- Voucher compliance and delayed payments
- Managing 50-150+ active cases simultaneously
- Document organization across multiple courts
- Legal research on tight time budgets
- Maintaining privilege in AI-assisted workflows

**Our Solution:** A purpose-built platform combining:
- AI-assisted drafting with legal research integration
- Practice-area-specific workflows (custody, criminal, divorce)
- Voucher compliance automation and fee optimization
- Privilege-protected document management
- HIPAA-compliant handling of sensitive records

**Target Market:**
- 3,000+ NYC 18B panel attorneys
- Expandable to 50,000+ assigned counsel nationwide
- $30-60M total addressable market

**Competitive Moat:** Enterprise legal AI tools (Harvey, CoCounsel) charge $500-2,000/user/month and ignore this market. We can deliver transformative value at $49-99/month.

---

## Market Context: NYC 18B Panel {#market-context}

### What is the 18B Panel?

Under County Law Article 18-B, New York counties must provide legal representation to indigent defendants. The NYC 18B panel consists of private attorneys who accept court assignments in:

| Panel | Court | Case Types | Hourly Rate |
|-------|-------|------------|-------------|
| **Criminal** | Criminal Court, Supreme Court | Misdemeanors, felonies, appeals | $75-158/hr |
| **Family** | Family Court | Custody, visitation, guardianship, neglect | $75-158/hr |
| **Matrimonial** | Supreme Court | Contested divorces, complex equitable distribution | $75-158/hr |

### Pain Points We Solve

#### 1. Voucher Hell
- Vouchers rejected for "block billing" (combining tasks)
- Fee caps vary by case type and county
- Delays of 60-120 days for payment
- No automated compliance checking

**Our Solution:** Real-time voucher compliance, auto-itemization, county-specific fee cap validation

#### 2. Case Overload
- Average 50-150 active matters
- Paper files or disorganized digital folders
- Missing deadlines across multiple courthouses
- No way to quickly recall case details

**Our Solution:** Unified case management with AI-powered quick recall ("What's the custody arrangement we proposed in the Martinez case?")

#### 3. Research Time Crunch
- $75-158/hr doesn't cover extensive research
- Need quick access to Family Court Act, DRL, CPL, Penal Law
- Judge-specific tendencies matter enormously

**Our Solution:** Integrated legal research with NY-specific databases, instant statute lookup, judge intelligence

#### 4. Document Chaos
- Discovery dumps (police reports, CPS records, medical records)
- No OCR or search capability
- Privilege risks when using AI tools
- HIPAA concerns with mental health/medical records

**Our Solution:** Secure document vault with OCR, privilege detection, PHI redaction, full-text search

---

## Competitive Landscape {#competitive-landscape}

### Enterprise Legal AI (Not Our Competitors)

| Product | Price | Target | Why They Don't Serve 18B |
|---------|-------|--------|--------------------------|
| Harvey AI | $500-2K/user/mo | AmLaw 100 firms | Too expensive, BigLaw focus |
| Thomson Reuters CoCounsel | $200+/user/mo | Mid-large firms | Enterprise sales only |
| Clio Duo | $99+/user/mo | Small firms | General practice, no 18B features |

### Adjacent Tools (Partial Solutions)

| Tool | What It Does | Gap |
|------|--------------|-----|
| MyCase, Clio | Practice management | No 18B voucher support, no AI |
| ChatGPT/Claude | General AI | No legal databases, privilege risks |
| Westlaw/Lexis | Legal research | $400+/mo, no practice management |
| Google Docs | Document storage | No legal intelligence |

### Our Positioning

**Assigned Co-Counsel = The only tool built specifically for assigned counsel work**

- Voucher compliance ✓
- Practice area workflows ✓  
- Privilege protection ✓
- Affordable pricing ✓
- NYC court-specific ✓

---

## Current Product Assessment {#current-assessment}

### What We Have (Strengths)

| Feature | Status | Quality |
|---------|--------|---------|
| AI Copilot | ✅ Built | Functional - GROQ-powered chat |
| Divorce Workflow | ✅ Built | Good - Step-by-step guidance |
| Voucher Drafting | ✅ Built | Good - Compliance audit, block billing detection |
| Privilege Protection | ✅ Built | Excellent - Full A/C and work product detection |
| PHI Scanner | ✅ Built | Excellent - HIPAA Safe Harbor compliant |
| Case Management | ✅ Built | Basic - List view only |
| Wiki/Knowledge Base | ✅ Built | Basic - Static content |
| PSLF Tracking | ✅ Built | Basic - UI exists |

### Critical Gaps

| Gap | Impact | Priority |
|-----|--------|----------|
| No legal research integration | Can't cite authority | 🔴 Critical |
| No document storage/search | Can't analyze discovery | 🔴 Critical |
| AI lacks case context | Generic responses | 🔴 Critical |
| No custody workflow | Missing key practice area | 🟡 High |
| No criminal workflow | Missing key practice area | 🟡 High |
| No mobile app | Can't use in court | 🟡 High |
| No calendar/deadlines | Missing case management basic | 🟡 High |

---

## Feature Recommendations by Practice Area {#feature-recommendations}

### A. Criminal Defense Features

#### A1. Criminal Workflow Modules

**Arraignment Preparation**
- Auto-generate bail application from case facts
- Criminal history impact analysis
- Checklist: ID verified, contact info, employment, ties to community
- Output: Bail memo, client interview notes template

**Discovery Tracker**
- CPL 245 automatic disclosure checklist
- Track what's been received vs. outstanding
- Flag when statutory deadlines pass
- Generate demand letters for missing items

**Suppression Motion Builder**
- Issue spotter: Miranda, search & seizure, identification
- Template selection based on facts
- Auto-populate with case-specific details
- Citation to relevant NY case law (People v. De Bour, Dunaway, etc.)

**Plea Negotiation Assistant**
- Display sentencing guidelines for charges
- Compare offer to likely trial outcome
- Immigration consequences checker (for non-citizens)
- Generate plea allocution script

#### A2. Criminal-Specific AI Prompts

```
Pre-built prompts for Copilot:
- "Analyze this police report for Fourth Amendment issues"
- "What are the elements the DA must prove for [charge]?"
- "Draft a CPL 245 demand letter for outstanding discovery"
- "What's the sentencing exposure for these charges?"
- "Identify inconsistencies between witness statements"
```

#### A3. Criminal Legal Database

Must include searchable access to:
- NY Penal Law (all sections)
- Criminal Procedure Law
- Vehicle & Traffic Law (for DWI/traffic crimes)
- Key suppression cases (De Bour, Hollman, Dunaway, etc.)
- Sentencing guidelines and ranges

---

### B. Family Court / Custody Features

#### B1. Custody Workflow Modules

**Initial Intake & Assessment**
- Custody type selector: sole, joint, visitation schedule
- Best interests factors checklist (DRL § 240)
- Domestic violence screening questionnaire
- Child support calculator integration

**Custody Petition Drafter**
- Template for modification, initial custody, visitation
- Auto-populate parties, children, relevant facts
- Generate proposed parenting schedule
- Include required statutory language

**Trial Preparation**
- Witness list generator
- Exhibit organizer
- Cross-examination question builder for opposing party
- Lincoln hearing preparation (child testimony)

**Forensic Evaluation Response**
- Analyze forensic report for weaknesses
- Generate response brief template
- Identify areas to challenge expert

#### B2. Custody-Specific AI Prompts

```
Pre-built prompts:
- "What are the best interests factors under DRL 240?"
- "Draft a proposed parenting time schedule for [scenario]"
- "Analyze this forensic report for potential challenges"
- "What's the standard for modification of custody?"
- "How do NY courts handle relocation requests?"
```

#### B3. Family Law Database

Must include:
- Domestic Relations Law
- Family Court Act
- Key custody cases (Tropea, Bliss v. Ach, etc.)
- Child support standards
- UCCJEA jurisdictional rules

---

### C. Matrimonial / Divorce Features

#### C1. Divorce Workflow Modules (Expand Existing)

**Financial Discovery Organizer**
- Statement of Net Worth builder
- Asset/liability tracker
- Income analysis from tax returns
- Hidden asset red flags identifier

**Equitable Distribution Calculator**
- Classify assets (marital vs. separate)
- Valuation tracking
- Distribution scenario modeling
- Maintenance calculator (DRL § 236)

**Settlement Agreement Drafter**
- Template-based generation
- Clause library for common provisions
- Child support/maintenance calculations included
- QDRO flagging for retirement assets

**Trial Notebook Builder**
- Organize exhibits by issue
- Witness examination outlines
- Legal memoranda by topic
- Closing argument framework

#### C2. Divorce-Specific AI Prompts

```
Pre-built prompts:
- "Calculate maintenance under the DRL formula"
- "What factors affect equitable distribution of [asset]?"
- "Draft a demand for financial discovery"
- "Analyze this Statement of Net Worth for red flags"
- "What's the law on dissipation of marital assets?"
```

---

### D. Cross-Practice Features

#### D1. Document Vault (Critical)

**Core Capabilities:**
- Unlimited document storage per case
- PDF, image, Word, Excel support
- Automatic OCR for scanned documents
- Full-text search across all documents
- Folder organization by case/document type

**AI-Powered Features:**
- "Find all references to [witness name] across discovery"
- "Extract key dates from these documents"
- "Summarize this 50-page CPS report"
- Auto-generate document index

**Security Features:**
- Privilege detection before AI processing
- PHI scanning and redaction
- Audit trail for all access
- Client-matter segregation

#### D2. Legal Research Integration

**Free Sources (Implement First):**
- CourtListener API (case law)
- NY Courts eCourts (court records)
- NY Legislature (statutes)
- Google Scholar Cases

**Premium Sources (Phase 2):**
- Fastcase (often free through bar associations)
- Casetext partnership potential
- Westlaw/Lexis API (expensive, evaluate ROI)

**Citation Features:**
- Every AI response includes citations
- One-click verification of cited cases
- "Find more cases like this" feature
- Shepardize/KeyCite equivalent alerts

#### D3. Case Intelligence & Memory

**Per-Case Context:**
- Client details (name, contact, key facts)
- Case status and next court date
- Opposing counsel and judge
- Key documents tagged
- Previous Copilot conversations about this case

**AI Memory:**
- "What did we discuss about the Johnson custody case?"
- "What was our strategy for the suppression motion?"
- Automatically reference case context in responses

#### D4. Calendar & Deadline Management

**Court Date Tracking:**
- Sync with court calendars where available
- Automatic reminders (7 days, 1 day, morning of)
- Travel time calculator to courthouse

**Statutory Deadlines:**
- CPL 245 discovery timelines
- Motion filing deadlines
- Appeal windows
- Statute of limitations tracking

**Integration:**
- Google Calendar sync
- Outlook sync
- iCal export

#### D5. Voucher Optimization Suite

**Compliance Engine:**
- Real-time block billing detection
- County-specific fee cap checking
- Activity code suggestions
- Narrative quality scoring

**Analytics:**
- Historical payment velocity by county
- Average voucher amount by case type
- Rejection rate tracking
- Cash flow forecasting

**Auto-Itemization:**
- AI breaks down combined entries
- Suggests compliant descriptions
- Maintains total time while improving descriptions

#### D6. Mobile Application

**Core Features:**
- Case lookup and quick facts
- Court date calendar
- Voice notes (transcribed to case file)
- Document camera (scan and OCR)
- Quick Copilot access

**Court-Specific:**
- Courthouse directory
- Judge information
- Courtroom locations
- WiFi passwords (crowdsourced)

---

## Technical Architecture {#technical-architecture}

### Current Stack
- **Frontend:** Next.js 16 + React + Tailwind CSS
- **Backend:** Firebase (Firestore, Auth, Hosting)
- **AI:** GROQ API (Llama 3.3 70B)
- **Deployment:** Firebase Hosting

### Recommended Additions

#### AI Layer
```
┌─────────────────────────────────────────┐
│           AI Orchestration              │
├─────────────┬─────────────┬────────────┤
│   GROQ      │   OpenAI    │  Anthropic │
│  (Fast)     │  (Quality)  │  (Complex) │
└─────────────┴─────────────┴────────────┘
         │
         ▼
┌─────────────────────────────────────────┐
│         Context Injection               │
├─────────────┬─────────────┬────────────┤
│ Case Facts  │ Legal DB    │ Documents  │
└─────────────┴─────────────┴────────────┘
```

**Multi-Model Strategy:**
- GROQ (Llama): Fast responses, simple queries
- OpenAI GPT-4: Complex reasoning, document analysis
- Anthropic Claude: Long documents, nuanced legal analysis

#### Document Processing Pipeline
```
Upload → OCR → Privilege Check → PHI Scan → Index → Store
                    │                │
                    ▼                ▼
               If flagged:      If found:
               Block AI use     Auto-redact
```

#### Legal Research Architecture
```
User Query
    │
    ▼
┌────────────────────────┐
│   Query Classifier     │
│  (statute? case? both?)│
└────────────────────────┘
    │
    ├──► Statute DB (local) ──► Return sections
    │
    ├──► Case API (CourtListener) ──► Return cases
    │
    └──► AI Synthesis ──► Formatted response with citations
```

### Data Model Extensions

```typescript
// Case with full context
interface Case {
  id: string;
  client: ClientInfo;
  caseType: 'criminal' | 'custody' | 'divorce';
  court: CourtInfo;
  judge: JudgeInfo;
  charges?: CriminalCharge[];      // Criminal
  children?: ChildInfo[];          // Custody
  assets?: AssetInfo[];            // Divorce
  documents: DocumentRef[];
  vouchers: VoucherRef[];
  conversations: ConversationRef[]; // AI chat history
  deadlines: Deadline[];
  status: CaseStatus;
  createdAt: Timestamp;
  updatedAt: Timestamp;
}

// Document with metadata
interface Document {
  id: string;
  caseId: string;
  filename: string;
  fileType: string;
  uploadedAt: Timestamp;
  ocrText?: string;
  privilegeStatus: PrivilegeClassification;
  phiStatus: PHIScanResult;
  tags: string[];
  summary?: string;  // AI-generated
}

// Conversation for memory
interface Conversation {
  id: string;
  caseId?: string;   // Optional case context
  messages: Message[];
  createdAt: Timestamp;
  summary?: string;  // AI-generated for recall
}
```

---

## Prioritized Implementation Roadmap {#roadmap}

### Phase 1: Foundation (Weeks 1-4)
**Goal:** Make the AI actually useful for legal work

| Week | Feature | Effort | Impact |
|------|---------|--------|--------|
| 1 | Citation mode toggle | 2 days | High |
| 1 | NY statute database (CPL, PL, DRL, FCA) | 3 days | High |
| 2 | CourtListener API integration | 4 days | High |
| 2 | Case context injection to Copilot | 2 days | High |
| 3 | Document vault (upload, store, organize) | 5 days | Critical |
| 4 | Document OCR + full-text search | 5 days | Critical |

**Deliverable:** Users can upload documents, search them, and get AI responses with legal citations.

### Phase 2: Practice Workflows (Weeks 5-8)
**Goal:** Guided workflows for each practice area

| Week | Feature | Effort | Impact |
|------|---------|--------|--------|
| 5 | Criminal arraignment workflow | 4 days | High |
| 5 | Criminal discovery tracker | 3 days | High |
| 6 | Custody intake workflow | 4 days | High |
| 6 | Custody petition drafter | 3 days | High |
| 7 | Expand divorce workflow | 3 days | Medium |
| 7 | Financial discovery organizer | 4 days | Medium |
| 8 | Motion template library | 5 days | High |

**Deliverable:** Complete guided workflows for criminal, custody, and divorce matters.

### Phase 3: Intelligence (Weeks 9-12)
**Goal:** Make the system smart about your cases

| Week | Feature | Effort | Impact |
|------|---------|--------|--------|
| 9 | Document analysis ("review tables") | 5 days | High |
| 9 | Chronology builder | 3 days | Medium |
| 10 | Case memory system | 5 days | High |
| 10 | Cross-case search | 2 days | Medium |
| 11 | Calendar + deadline tracking | 5 days | High |
| 12 | Judge intelligence database | 5 days | Medium |

**Deliverable:** AI remembers case context, analyzes documents at scale, tracks deadlines.

### Phase 4: Mobile & Scale (Weeks 13-16)
**Goal:** Accessible anywhere, production-ready

| Week | Feature | Effort | Impact |
|------|---------|--------|--------|
| 13-14 | Mobile app (React Native) | 10 days | High |
| 15 | Advanced voucher analytics | 5 days | Medium |
| 15 | Multi-attorney collaboration | 3 days | Medium |
| 16 | Performance optimization | 5 days | High |
| 16 | Security audit + hardening | 3 days | Critical |

**Deliverable:** Production-ready platform with mobile app.

---

## Business Model & Pricing {#business-model}

### Pricing Strategy

| Tier | Price | Features |
|------|-------|----------|
| **Basic** | $49/mo | Copilot, 1 workflow, 5GB docs, basic voucher |
| **Professional** | $79/mo | All workflows, 25GB docs, full voucher suite, calendar |
| **Unlimited** | $99/mo | Everything + priority support, unlimited docs, API access |

### Why This Pricing Works

- **Comparable to:** Netflix ($15) + Spotify ($10) + cloud storage ($10) = $35
- **Value delivered:** 10+ hours saved/month × $75/hr = $750 value
- **Competition:** Harvey at $500+/mo, even basic legal software is $100+/mo
- **Break-even:** ~500 subscribers at $79 avg = $39,500 MRR

### Revenue Projections

| Year | Subscribers | MRR | ARR |
|------|-------------|-----|-----|
| Y1 | 500 | $40K | $480K |
| Y2 | 2,000 | $160K | $1.9M |
| Y3 | 5,000 | $400K | $4.8M |

### Distribution Channels

1. **NYC Bar Association** - Partnership for member discount
2. **18B Panel Administrators** - Direct outreach
3. **Legal Aid Society** - Referral program
4. **CLE Programs** - Demo at continuing education
5. **Word of mouth** - Referral incentives

---

## Success Metrics {#success-metrics}

### Product Metrics

| Metric | Target (6 mo) | Target (12 mo) |
|--------|---------------|----------------|
| Monthly Active Users | 200 | 1,000 |
| Cases Created | 2,000 | 15,000 |
| Documents Uploaded | 10,000 | 100,000 |
| AI Queries/Day | 500 | 5,000 |
| Vouchers Processed | 1,000 | 10,000 |

### User Outcomes

| Outcome | Measurement | Target |
|---------|-------------|--------|
| Time saved per week | User survey | 5+ hours |
| Voucher acceptance rate | Track rejections | 95%+ |
| Payment velocity | Days to payment | -20% |
| User satisfaction | NPS score | 50+ |

### Technical Metrics

| Metric | Target |
|--------|--------|
| Uptime | 99.9% |
| Page load time | <2 sec |
| AI response time | <5 sec |
| Document OCR accuracy | 95%+ |

---

## Appendix: Quick Implementation Guides

### A. Adding Citation Mode

```typescript
// lib/citationPrompt.ts
export const CITATION_SYSTEM_PROMPT = `
You are Assigned Co-Counsel AI, a legal assistant for 18B panel attorneys.

CRITICAL REQUIREMENT: You MUST cite legal authority for every legal claim.

Citation formats:
- Statutes: [CPL § 710.20] or [DRL § 236(B)(5)]
- Cases: [People v. De Bour, 40 N.Y.2d 210 (1976)]
- Regulations: [22 NYCRR § 1200.0]

If you cannot find supporting authority, explicitly state:
"I cannot locate specific authority for this proposition."

Never fabricate citations. If unsure, say so.
`;
```

### B. Document Vault Schema

```typescript
// Firestore structure
/users/{userId}/cases/{caseId}/documents/{docId}
{
  filename: string,
  storagePath: string,  // Firebase Storage reference
  uploadedAt: Timestamp,
  fileSize: number,
  mimeType: string,
  ocrComplete: boolean,
  ocrText: string | null,
  privilegeCheck: {
    status: 'pending' | 'safe' | 'privileged' | 'review',
    type: PrivilegeType | null,
    checkedAt: Timestamp
  },
  phiCheck: {
    status: 'pending' | 'clean' | 'redacted',
    foundCount: number,
    checkedAt: Timestamp
  },
  tags: string[],
  summary: string | null  // AI-generated
}
```

### C. CourtListener Integration

```typescript
// lib/courtListener.ts
const COURTLISTENER_API = 'https://www.courtlistener.com/api/rest/v3';

export async function searchCases(query: string, jurisdiction: string = 'ny') {
  const response = await fetch(
    `${COURTLISTENER_API}/search/?q=${encodeURIComponent(query)}&court=${jurisdiction}`,
    {
      headers: {
        'Authorization': `Token ${process.env.COURTLISTENER_API_KEY}`
      }
    }
  );
  return response.json();
}

export async function getCaseById(id: string) {
  const response = await fetch(`${COURTLISTENER_API}/opinions/${id}/`);
  return response.json();
}
```

---

## Contact & Next Steps

**Immediate Actions:**
1. Review this document with development team
2. Prioritize Phase 1 features
3. Set up CourtListener API access
4. Begin citation mode implementation

**Questions?**
Contact the product team to discuss priorities, technical approach, or timeline adjustments.

---

*This document is confidential and intended for internal use only.*
