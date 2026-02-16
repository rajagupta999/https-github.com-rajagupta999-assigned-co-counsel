export interface WikiEntry {
  id: string;
  slug: string;
  title: string;
  content: string;
  category: 'Statutes' | 'Cases' | 'Procedures' | 'Forms' | 'Strategies' | 'Judge Intel';
  lastEditedBy: string;
  editHistory: { author: string; timestamp: string; summary: string }[];
  citations: string[];
  relatedEntries: string[]; // slugs
  isVerified: boolean;
  createdAt: string;
  updatedAt: string;
}

export const WIKI_CATEGORIES = [
  { id: 'Statutes', name: 'Statutes & Laws', icon: '📜' },
  { id: 'Cases', name: 'Case Law', icon: '⚖️' },
  { id: 'Procedures', name: 'Court Procedures', icon: '📋' },
  { id: 'Forms', name: 'Forms & Templates', icon: '📄' },
  { id: 'Strategies', name: 'Legal Strategies', icon: '🎯' },
  { id: 'Judge Intel', name: 'Judge Intelligence', icon: '👨‍⚖️' },
] as const;

function e(partial: Omit<WikiEntry, 'editHistory' | 'lastEditedBy' | 'isVerified' | 'createdAt' | 'updatedAt'> & { updatedAt?: string }): WikiEntry {
  return {
    ...partial,
    lastEditedBy: 'System',
    editHistory: [{ author: 'System', timestamp: '2025-01-15T00:00:00Z', summary: 'Initial entry' }],
    isVerified: true,
    createdAt: '2025-01-15',
    updatedAt: partial.updatedAt || '2025-01-15',
  };
}

export const DEFAULT_WIKI_ENTRIES: WikiEntry[] = [
  // ===== CRIMINAL DEFENSE - CPL STATUTES =====
  e({
    id: 'cpl-710-20', slug: 'cpl-710-20',
    title: 'CPL § 710.20 — Motion to Suppress Evidence',
    category: 'Statutes',
    content: `# CPL § 710.20 — Motion to Suppress Evidence

## Overview
Upon motion of a defendant, a court **may** suppress:

1. **Physical evidence** obtained by means of an unlawful search and seizure (CPL § 710.20(1))
2. **Statements** (oral or written) involuntarily made (CPL § 710.20(3))
3. **Identification testimony** resulting from improper procedures (CPL § 710.20(5))
4. **Eavesdropping evidence** unlawfully obtained (CPL § 710.20(2))

## Timing
- Must be filed **within 45 days** of arraignment (CPL § 255.20(1))
- Extensions for **good cause shown**
- Failure to timely move = waiver (unless court permits in interest of justice)

## Burden of Proof
- **Defendant** must establish standing (e.g., legitimate expectation of privacy)
- Once standing is shown, **People bear the burden** of establishing legality at a suppression hearing
- People must prove voluntariness of statements **beyond a reasonable doubt** (*People v. Huntley*)

## Key Hearing Types
| Hearing | Purpose | Named After |
|---------|---------|-------------|
| **Mapp** | Physical evidence / search & seizure | *Mapp v. Ohio* |
| **Huntley** | Voluntariness of statements | *People v. Huntley* |
| **Wade** | Identification procedures | *United States v. Wade* |
| **Dunaway** | Probable cause for arrest | *Dunaway v. New York* |

## Practice Tips
- Always request a **combined hearing** to preserve all suppression issues
- Attach supporting affidavits with specific factual allegations
- Challenge both the **stop** and the **search** separately under *De Bour* / *Debour* framework
- Consider filing even if facts are unclear — discovery may reveal suppression issues`,
    citations: ['CPL § 710.20', 'CPL § 255.20', 'People v. Huntley', 'Mapp v. Ohio', 'Dunaway v. New York'],
    relatedEntries: ['cpl-710-30', 'people-v-huntley', 'people-v-de-bour'],
  }),

  e({
    id: 'cpl-710-30', slug: 'cpl-710-30',
    title: 'CPL § 710.30 — Notice of Intent to Offer Evidence',
    category: 'Statutes',
    content: `# CPL § 710.30 — Prosecution Notice Requirements

## Overview
Before trial, the People must serve **written notice** of intent to offer:

1. **Statements** made by the defendant to law enforcement (710.30(1)(a))
2. **Identification testimony** — where a witness identified the defendant prior to trial (710.30(1)(b))

## Timing
- Notice must be served **within 15 days** of arraignment
- Late notice is permissible only upon showing of **good cause**

## Consequences of Non-Compliance
- **Preclusion** of the evidence at trial (*People v. O'Doherty*, 70 N.Y.2d 479)
- Preclusion is **automatic** absent good cause — court has no discretion
- This is one of the most powerful defense tools in NY criminal practice

## What Constitutes Adequate Notice
- Must identify the **substance** of the statement or the **time, place, and manner** of identification
- Mere conclusory assertions are insufficient
- Must be served on defendant or counsel

## Practice Tips
- Calendar the 15-day deadline immediately upon arraignment
- If notice is late, file a **motion to preclude** — courts routinely grant these
- Check whether CPL 245 automatic discovery has been complied with as well`,
    citations: ['CPL § 710.30', 'People v. O\'Doherty, 70 N.Y.2d 479'],
    relatedEntries: ['cpl-710-20', 'cpl-245-discovery'],
  }),

  e({
    id: 'cpl-30-30', slug: 'cpl-30-30',
    title: 'CPL § 30.30 — Speedy Trial',
    category: 'Statutes',
    content: `# CPL § 30.30 — Speedy Trial

## Time Limits
| Charge | Time Limit |
|--------|-----------|
| **A Felony** | 6 months (184 days) |
| **Other Felonies** | 6 months (184 days) |
| **A Misdemeanor (jail >3 mo)** | 90 days |
| **B Misdemeanor** | 60 days |
| **Violation** | 30 days |

## How It Works
- Clock starts at **commencement of criminal action** (filing of accusatory instrument)
- Only **chargeable time** counts (time attributable to the prosecution)
- Defense adjournments, competency proceedings, and certain other periods are **excludable**

## Key Excludable Periods (CPL § 30.30(4))
- Adjournments **requested by or consented to** by the defense
- Period during which defendant is absent or unavailable
- Pre-trial motions (from filing to decision) — but **not always** fully excludable
- Reasonable period of delay from **joinder/severance**
- **Post-readiness** delays are generally excludable (but see *People v. Sibblies*)

## The "Readiness" Requirement
- People must declare **ready for trial** — either on the record or by written statement
- Statement of readiness must be **truthful and genuine** (*People v. England*, 84 N.Y.2d 1)
- **Illusory** readiness (ready but discovery incomplete) doesn't stop the clock (*People v. Kendzia*)

## Practice Tips
- Maintain a **detailed 30.30 log** from day one
- Never consent to adjournments without putting the reason on the record
- File the motion with a **day-by-day accounting** of chargeable time
- Remember: even 1 day over = dismissal`,
    citations: ['CPL § 30.30', 'People v. England, 84 N.Y.2d 1', 'People v. Sibblies', 'People v. Kendzia'],
    relatedEntries: ['arraignment-checklist', 'cpl-245-discovery'],
  }),

  e({
    id: 'cpl-510-10', slug: 'cpl-510-10',
    title: 'CPL § 510.10 — Bail and Securing Orders',
    category: 'Statutes',
    content: `# CPL § 510.10 — Bail (Post-2020 Reform)

## Overview
New York's bail reform (effective January 2020, amended 2022) dramatically changed pretrial release. Most misdemeanors and non-violent felonies are now **non-qualifying offenses** — meaning courts **must** release on recognizance or with conditions.

## Qualifying Offenses (Bail Eligible)
Bail may only be set for **qualifying offenses**, including:
- Almost all **violent felony offenses** (PL § 70.02)
- Sex offenses (PL Article 130)
- Certain **witness intimidation / tampering** charges
- Felony domestic violence with prior DV conviction
- Charges involving **firearms**
- Certain **hate crimes**
- Specific **burglary** and **robbery** charges

## Least Restrictive Means
When bail IS permitted, the court must select the **least restrictive** conditions to ensure return:
1. Release on own recognizance (ROR)
2. Release under supervision
3. Release under non-monetary conditions
4. Bail (various forms)
5. Remand (only for qualifying offenses with specific findings)

## Factors Considered (CPL § 510.30)
- Character, reputation, habits, mental condition
- Employment and financial resources
- Family ties and community ties
- Criminal record and history of court appearances
- **Flight risk** — NOT dangerousness (NY does not have a dangerousness standard)

## Practice Tips
- Always argue for **ROR first**, then least restrictive alternative
- Prepare a **bail package**: letter of support, employment verification, ties to community
- If bail is set, immediately check if the charge is actually qualifying
- Appeal excessive bail under CPL § 510.20`,
    citations: ['CPL § 510.10', 'CPL § 510.30', 'PL § 70.02'],
    relatedEntries: ['bail-application-procedures', 'arraignment-checklist'],
  }),

  e({
    id: 'cpl-160-50', slug: 'cpl-160-50',
    title: 'CPL § 160.50 — Sealing of Records',
    category: 'Statutes',
    content: `# CPL § 160.50 — Record Sealing

## Automatic Sealing
Records are **automatically sealed** when:
- Action terminated in **favor of the accused** (dismissal, ACD completion, acquittal)
- **Violation** conviction (in most cases)

## What Gets Sealed
- All official records and papers relating to the arrest, prosecution, and conviction
- Fingerprints, photographs, palmprints
- Court records, police records, DA records

## CPL § 160.59 — Discretionary Sealing
For **eligible convictions** (enacted 2017):
- Up to **2 convictions** (only 1 can be a felony)
- Must wait **10 years** from sentence or release (whichever is later)
- Certain offenses are **excluded** (sex offenses, Class A felonies, etc.)
- Court considers factors including rehabilitation, impact on employability

## Practice Tips
- Always request sealing at disposition for favorable outcomes
- Check that sealing has actually occurred — errors are common
- For 160.59 applications, prepare a comprehensive packet showing rehabilitation
- DCJS records may not reflect sealing — verify independently`,
    citations: ['CPL § 160.50', 'CPL § 160.59'],
    relatedEntries: ['cpl-440-10'],
  }),

  e({
    id: 'cpl-440-10', slug: 'cpl-440-10',
    title: 'CPL § 440.10 — Post-Conviction Motion to Vacate',
    category: 'Statutes',
    content: `# CPL § 440.10 — Motion to Vacate Judgment

## Overview
A motion to vacate a judgment of conviction may be brought at **any time** after judgment. This is the primary vehicle for post-conviction relief in New York.

## Grounds (CPL § 440.10(1))
1. Court lacked **jurisdiction**
2. Judgment obtained by **fraud, misrepresentation, or duress**
3. **Material evidence** was false and known to be false by the prosecutor
4. **Material evidence** adduced by the People was procured in violation of defendant's rights
5. **New evidence** discovered since trial that could not have been produced at trial and creates probability of a more favorable verdict
6. **Ineffective assistance of counsel** (most common ground)
7. Improper **guilty plea** — not knowing, voluntary, and intelligent
8. Judgment obtained in violation of defendant's constitutional rights

## Procedural Requirements
- Must be in **writing** with supporting affidavits
- Must include **sworn allegations of fact**
- Court **may** deny without a hearing if allegations are conclusory or contradicted by the record
- Court **must** hold a hearing if factual issues are raised that cannot be resolved on papers

## Ineffective Assistance Claims
- NY standard: **meaningful representation** (*People v. Baldi*, 54 N.Y.2d 137)
- More favorable to defendants than federal *Strickland* standard
- Must show counsel failed to provide meaningful representation
- Common claims: failure to investigate, failure to file motions, bad advice on plea

## Practice Tips
- File before direct appeal deadline if possible (can pursue both simultaneously)
- Include detailed affidavit from defendant
- Attach any extrinsic evidence (affidavits, records, expert reports)
- Consider immigration consequences as basis for IAC claim (*Padilla v. Kentucky*)`,
    citations: ['CPL § 440.10', 'People v. Baldi, 54 N.Y.2d 137', 'Padilla v. Kentucky', 'Strickland v. Washington'],
    relatedEntries: ['strickland-v-washington', 'cpl-160-50'],
  }),

  e({
    id: 'cpl-245-discovery', slug: 'cpl-245-discovery',
    title: 'CPL Article 245 — Discovery Reform',
    category: 'Statutes',
    content: `# CPL Article 245 — Automatic Discovery (2020 Reform)

## Overview
Effective January 1, 2020, New York completely overhauled criminal discovery. The old "blindfold law" was replaced with **automatic, open-file discovery**.

## Prosecution Obligations (CPL § 245.20)
The People must disclose **automatically** (without request):
- All **witness statements** (written, recorded, summarized)
- All **police reports** and memo books
- **Grand jury testimony** transcripts
- **Expert reports** and witness lists
- All **tangible property** (photos, physical evidence, documents)
- **Electronic recordings** (surveillance, body-worn cameras, 911 calls)
- **Impeachment material** — prior bad acts, pending cases against witnesses
- **Brady/Giglio** material
- **Lab reports** and forensic evidence
- Defendant's **statements** to law enforcement

## Timing
- **Within 35 days** of arraignment (felonies) or **15 days** (misdemeanors)
- Extensions for **good cause** only
- **Certificate of Compliance (COC)** must be filed when discovery is complete
- COC must be filed **before** People can declare trial ready (CPL § 245.50)

## Sanctions for Non-Compliance
- **Preclusion** of undisclosed evidence
- **Adverse inference** instructions
- **Dismissal** in extreme cases
- Court may grant continuances, which are chargeable to the People under 30.30

## Defense Obligations (CPL § 245.30)
Defense must also disclose (within 30 days of receiving prosecution discovery):
- Alibi witness information
- Psychiatric evidence intended for trial
- Expert reports

## Practice Tips
- **Demand the COC** — many cases are won on COC challenges
- Review body-worn camera footage carefully — often contradicts police reports
- File motions to compel if discovery is incomplete
- Track every piece of outstanding discovery`,
    citations: ['CPL § 245.20', 'CPL § 245.30', 'CPL § 245.50'],
    relatedEntries: ['cpl-30-30', 'cpl-710-30', 'discovery-obligations-checklist', 'brady-v-maryland'],
  }),

  e({
    id: 'cpl-190-50', slug: 'cpl-190-50',
    title: 'CPL § 190.50 — Grand Jury Rights',
    category: 'Statutes',
    content: `# CPL § 190.50 — Right to Testify Before Grand Jury

## Overview
A defendant has the **right to testify** before the grand jury in New York (unlike federal practice).

## Key Provisions
- Defendant must be **notified** of the right to appear and testify
- Must receive **reasonable time** to exercise the right (typically 5 days)
- Defendant **waives immunity** by testifying (unlike a trial witness)
- Defendant may bring an **attorney** into the grand jury room (advisory role only)

## Waiver of Immunity
- Testifying = automatic waiver of transactional immunity
- This means grand jury testimony **can be used against** the defendant
- Must be a **knowing, voluntary** waiver — signed written waiver required

## Motion to Dismiss Indictment (CPL § 210.20)
Grounds include:
- Failure to provide adequate notice of right to testify
- **Legally insufficient evidence** before the grand jury
- Defective grand jury proceeding (improper instructions, etc.)

## Practice Tips
- Almost **never** have your client testify before the grand jury
- Exceptions: very strong alibi, self-defense with overwhelming evidence, political cases
- If notice is defective, move to dismiss under CPL § 210.20
- Review grand jury minutes carefully for instructional errors`,
    citations: ['CPL § 190.50', 'CPL § 210.20'],
    relatedEntries: ['arraignment-checklist'],
  }),

  // ===== CRIMINAL DEFENSE - PENAL LAW =====
  e({
    id: 'pl-assault', slug: 'pl-assault-degrees',
    title: 'Penal Law — Assault Degrees (NY)',
    category: 'Statutes',
    content: `# Assault Degrees — New York Penal Law

## Assault in the Third Degree (PL § 120.00) — Class A Misdemeanor
1. Intent to cause physical injury → causes physical injury
2. Recklessly causes physical injury
3. Criminal negligence with a deadly weapon → causes physical injury

## Assault in the Second Degree (PL § 120.05) — Class D Violent Felony
Key subdivisions:
- **(1)** Intent to cause serious physical injury → causes serious physical injury
- **(2)** Intent to cause physical injury with a deadly weapon or dangerous instrument
- **(3)** Recklessly causes serious physical injury with a deadly weapon
- **(7)** Causes physical injury to a person under 7 or elderly person 65+
- **(12)** Strangulation-related (see also PL § 121.12)

## Assault in the First Degree (PL § 120.10) — Class B Violent Felony
1. Intent to cause serious physical injury with a deadly weapon → causes serious physical injury
2. Intent to disfigure or amputate → causes such injury
3. Under circumstances evincing depraved indifference → recklessly causes serious physical injury

## Key Definitions
- **Physical injury**: impairment of physical condition or substantial pain (PL § 10.00(9))
- **Serious physical injury**: creates substantial risk of death, serious disfigurement, protracted health impairment (PL § 10.00(10))
- **Deadly weapon**: loaded weapon from which a shot may be discharged (PL § 10.00(12))
- **Dangerous instrument**: any article used in a manner readily capable of causing death or serious physical injury

## Defense Strategies
- Challenge the degree of injury (physical vs. serious physical)
- Justification defense (PL § 35.15)
- Argue lesser included offenses`,
    citations: ['PL § 120.00', 'PL § 120.05', 'PL § 120.10', 'PL § 10.00'],
    relatedEntries: ['pl-weapons-charges'],
  }),

  e({
    id: 'pl-burglary', slug: 'pl-burglary-degrees',
    title: 'Penal Law — Burglary Degrees (NY)',
    category: 'Statutes',
    content: `# Burglary Degrees — New York Penal Law

## Burglary Third Degree (PL § 140.20) — Class D Felony
- Knowingly enters or remains unlawfully in a **building** with intent to commit a crime therein

## Burglary Second Degree (PL § 140.25) — Class C Violent Felony
Building entry/remaining + any of:
1. Building is a **dwelling**
2. Armed with explosives or deadly weapon
3. Causes physical injury to non-participant
4. Uses or threatens use of a dangerous instrument
5. Displays a firearm

## Burglary First Degree (PL § 140.30) — Class B Violent Felony
Dwelling entry/remaining + any of:
1. Armed with explosives or deadly weapon
2. Causes physical injury to non-participant
3. Uses or threatens use of a dangerous instrument
4. Displays a firearm

## Key Definitions
- **Building**: any structure used for overnight lodging, business, or other purpose (PL § 140.00(2))
- **Dwelling**: building usually occupied at night for sleeping (PL § 140.00(3))
- **Enters or remains unlawfully**: not licensed or privileged to be present

## Defense Strategies
- Challenge the "intent to commit a crime" element
- Was the structure actually a "building" or "dwelling"?
- License or privilege to enter
- Mistaken belief of right to enter`,
    citations: ['PL § 140.20', 'PL § 140.25', 'PL § 140.30', 'PL § 140.00'],
    relatedEntries: ['pl-assault-degrees'],
  }),

  e({
    id: 'pl-dwi', slug: 'pl-dwi',
    title: 'VTL § 1192 — DWI / DWAI (NY)',
    category: 'Statutes',
    content: `# DWI / DWAI — Vehicle & Traffic Law § 1192

## Offenses
| Section | Offense | BAC | Class |
|---------|---------|-----|-------|
| **1192(1)** | DWAI (Driving While Ability Impaired) | .05-.07 | Traffic Infraction |
| **1192(2)** | DWI Per Se | ≥ .08 | Unclassified Misdemeanor |
| **1192(3)** | DWI (Common Law) | Any (impaired) | Unclassified Misdemeanor |
| **1192(2-a)** | Aggravated DWI | ≥ .18 | Unclassified Misdemeanor |
| **1192(4)** | DWAI-Drugs | N/A | Unclassified Misdemeanor |
| **1192(4-a)** | DWAI-Combined | Drugs + alcohol | Unclassified Misdemeanor |

## Enhanced Penalties
- **2nd offense within 10 years**: Class E Felony
- **3rd offense within 10 years**: Class D Felony
- **Leandra's Law** (VTL § 1192(2-a)(b)): DWI with child under 16 = Class E Felony (first offense)

## Chemical Test Refusal
- Administrative license revocation (1 year) + $500 civil penalty
- Refusal **can be used** as evidence at trial
- Refusal hearing within 15 days of arraignment

## Common Defenses
- Challenge the **stop** — was there reasonable suspicion?
- Challenge **field sobriety tests** — conditions, officer training
- Challenge **breathalyzer** — calibration, maintenance records, 20-minute observation period
- **Rising BAC** defense — BAC was below .08 at time of driving
- Challenge **blood draw** — chain of custody, warrant requirement

## Conditional / Plea Options
- DWAI reduction (common plea bargain for first offenders)
- Conditional discharge with alcohol treatment
- Ignition interlock device requirements`,
    citations: ['VTL § 1192', 'Leandra\'s Law'],
    relatedEntries: ['arraignment-checklist'],
  }),

  e({
    id: 'pl-drugs', slug: 'pl-drug-offenses',
    title: 'Penal Law — Drug Offenses (NY)',
    category: 'Statutes',
    content: `# Drug Offenses — New York Penal Law Article 220/221

## Marijuana (Post-MRTA 2021)
- **Legalized** for adults 21+ (up to 3 oz / 24g concentrate)
- Prior marijuana convictions largely **automatically expunged**
- Unlicensed sale remains criminal

## Controlled Substance Possession (PL Article 220)
| Offense | Degree | Class |
|---------|--------|-------|
| Criminal Possession 7th (§ 220.03) | Any controlled substance | A Misdemeanor |
| Criminal Possession 5th (§ 220.06) | Specific weights/types | D Felony |
| Criminal Possession 4th (§ 220.09) | Higher weights | C Felony |
| Criminal Possession 3rd (§ 220.16) | Narcotic ≥ ½ oz, stimulant ≥ 1 oz | B Felony |
| Criminal Possession 2nd (§ 220.18) | Narcotic ≥ 2 oz | A-II Felony |
| Criminal Possession 1st (§ 220.21) | Narcotic ≥ 4 oz | A-I Felony |

## Sale Offenses (PL Article 220)
- Range from B Misdemeanor (§ 220.31 — 5th degree) to A-I Felony (§ 220.43 — 1st degree)
- **School zone** enhancement: sale within 1,000 ft of school grounds

## Diversion & Treatment
- **Judicial Diversion** (CPL § 216.05): eligible defendants can be diverted to treatment
- **Drug Treatment Courts**: alternative to incarceration
- **DTAP** (Drug Treatment Alternative to Prison): DA-run programs

## Defense Strategies
- Challenge constructive possession — mere proximity is insufficient
- Suppress evidence from unlawful search
- Argue lack of knowledge (possession requires knowing possession)
- Seek judicial diversion for treatment-amenable clients`,
    citations: ['PL § 220.03', 'PL § 220.06', 'PL § 220.16', 'CPL § 216.05'],
    relatedEntries: ['cpl-710-20', 'cpl-160-50'],
  }),

  e({
    id: 'pl-weapons', slug: 'pl-weapons-charges',
    title: 'Penal Law — Weapons Charges (NY)',
    category: 'Statutes',
    content: `# Weapons Offenses — New York Penal Law Article 265

## Criminal Possession of a Weapon
| Offense | Key Element | Class |
|---------|------------|-------|
| **CPW 4th** (§ 265.01) | Firearm (no prior), dangerous weapon, gravity knife | A Misdemeanor |
| **CPW 3rd** (§ 265.02) | Previous conviction + firearm, defaced firearm, 3+ firearms | D Violent Felony |
| **CPW 2nd** (§ 265.03) | Loaded firearm outside home/business | C Violent Felony |
| **CPW 1st** (§ 265.04) | Explosive device, 10+ firearms | B Violent Felony |

## CPW 2nd (PL § 265.03) — Most Common Felony Weapons Charge
- Possession of a **loaded firearm** outside home or place of business
- **Mandatory minimum** prison sentence for violent felony offenders
- *SCOTUS Note*: *New York State Rifle & Pistol Assn v. Bruen* (2022) impacted licensing but NOT possession charges

## Defenses
- **Temporary and lawful possession** (momentary possession to dispose/turn in)
- Challenge **constructive possession** — automobile presumption (PL § 265.15(3)) is rebuttable
- **Home/business** exception for CPW 2nd
- Suppress the weapon if recovered via unlawful search
- Challenge operability of the firearm

## The Automobile Presumption (PL § 265.15(3))
- Presence of firearm in vehicle = **presumptive possession** by all occupants
- Rebuttable presumption — defendant can present evidence of lack of knowledge/access
- Does NOT apply if weapon found on a specific person`,
    citations: ['PL § 265.01', 'PL § 265.02', 'PL § 265.03', 'PL § 265.15', 'NYSRPA v. Bruen'],
    relatedEntries: ['cpl-710-20', 'people-v-de-bour'],
  }),

  // ===== LANDMARK NY CRIMINAL CASES =====
  e({
    id: 'people-v-de-bour', slug: 'people-v-de-bour',
    title: 'People v. De Bour — Street Encounter Framework',
    category: 'Cases',
    content: `# People v. De Bour, 40 N.Y.2d 210 (1976)

## Holding
Established the **four-tier framework** for analyzing police-citizen street encounters in New York.

## The Four Levels

### Level 1 — Request for Information
- **Standard**: Objective, credible reason (not necessarily indicative of criminality)
- **Scope**: Approach, ask questions, request identification
- **Example**: Officer sees someone near a closed business at 3 AM

### Level 2 — Common Law Right to Inquire
- **Standard**: Founded suspicion that criminal activity is afoot
- **Scope**: Pointed, accusatory questions; limited interference with liberty
- **Example**: Person matching description of suspect in recent crime

### Level 3 — Forcible Stop & Detention (Terry Stop)
- **Standard**: Reasonable suspicion of criminal activity
- **Scope**: Temporary detention; frisk for weapons if officer reasonably fears for safety
- **Example**: Bulge in waistband + furtive movements + high-crime area

### Level 4 — Arrest
- **Standard**: Probable cause
- **Scope**: Full custodial arrest, search incident to arrest

## Significance
- This framework governs **all suppression hearings** involving street encounters in NY
- More protective of individual rights than the federal *Terry* standard
- Each level must be justified **independently** — escalation requires additional facts

## Key Progeny
- *People v. Hollman*, 79 N.Y.2d 181 (1992) — refined Level 1 analysis
- *People v. Moore*, 6 N.Y.3d 496 (2006) — flight in high-crime area
- *People v. Garcia*, 20 N.Y.3d 317 (2012) — anonymous tips`,
    citations: ['People v. De Bour, 40 N.Y.2d 210 (1976)', 'People v. Hollman, 79 N.Y.2d 181 (1992)', 'People v. Moore, 6 N.Y.3d 496 (2006)'],
    relatedEntries: ['cpl-710-20', 'terry-v-ohio'],
  }),

  e({
    id: 'people-v-huntley', slug: 'people-v-huntley',
    title: 'People v. Huntley — Voluntariness of Statements',
    category: 'Cases',
    content: `# People v. Huntley, 15 N.Y.2d 72 (1965)

## Holding
The prosecution must prove **beyond a reasonable doubt** that a defendant's statement to law enforcement was **voluntarily made** before it can be admitted at trial.

## The Huntley Hearing
- A pre-trial evidentiary hearing to determine voluntariness
- People's burden: beyond a reasonable doubt
- Court considers the **totality of the circumstances**

## Factors Considered
- Was the defendant in custody?
- Were Miranda warnings given (if custodial interrogation)?
- Duration and conditions of interrogation
- Defendant's age, education, mental state
- Physical coercion, threats, or promises
- Whether defendant requested an attorney
- Food, water, sleep deprivation

## Relationship to Miranda
- *Huntley* predates *Miranda* (1966) but remains independently significant
- Even if Miranda warnings were given, a statement can still be involuntary
- A *Huntley* hearing encompasses both Miranda compliance AND voluntariness

## Practice Tips
- Always request a Huntley hearing when statements are at issue
- Cross-examine officers on the details of the interrogation environment
- Obtain body-cam footage of the interrogation if available
- Challenge the timing — how long was client in custody before statements?`,
    citations: ['People v. Huntley, 15 N.Y.2d 72 (1965)', 'Miranda v. Arizona'],
    relatedEntries: ['cpl-710-20', 'cpl-710-30', 'miranda-v-arizona'],
  }),

  e({
    id: 'people-v-sandoval', slug: 'people-v-sandoval',
    title: 'People v. Sandoval — Prior Bad Acts at Trial',
    category: 'Cases',
    content: `# People v. Sandoval, 34 N.Y.2d 371 (1974)

## Holding
A defendant is entitled to a **pre-trial ruling** on whether the prosecution may cross-examine them about **prior convictions and bad acts** if they choose to testify.

## The Sandoval Hearing
- Conducted before trial (or before defendant testifies)
- Court balances **probative value** on credibility vs. **prejudicial effect**
- Prosecution must specify what they seek to inquire about

## What Can Be Inquired About
- Prior **convictions** (even sealed ones, in some circumstances)
- Prior **bad acts** (even without conviction) bearing on credibility
- The **nature** of the conviction, but often NOT the underlying facts

## Court's Discretion
The court may:
1. **Preclude** all inquiry into a prior conviction
2. Allow inquiry into the **fact** of conviction but not the nature
3. Allow inquiry into the **nature** of the conviction
4. Allow full inquiry including underlying facts (rare)

## Strategic Considerations
- A favorable Sandoval ruling often determines whether client testifies
- If priors are precluded, testifying becomes much more attractive
- If priors are allowed in, weigh carefully — jury hears the priors
- Consider stipulating to "a prior felony conviction" to limit details

## Key Case Law
- *People v. Hayes*, 97 N.Y.2d 203 (2002) — abuse of discretion standard on appeal
- Similar prior convictions are generally MORE prejudicial (jury may assume propensity)`,
    citations: ['People v. Sandoval, 34 N.Y.2d 371 (1974)', 'People v. Hayes, 97 N.Y.2d 203 (2002)'],
    relatedEntries: ['people-v-molineux', 'people-v-ventimiglia'],
  }),

  e({
    id: 'people-v-molineux', slug: 'people-v-molineux',
    title: 'People v. Molineux — Prior Bad Acts Evidence',
    category: 'Cases',
    content: `# People v. Molineux, 168 N.Y. 264 (1901)

## Holding
Evidence of **prior uncharged crimes or bad acts** is inadmissible to show criminal propensity, but may be admitted for specific limited purposes.

## The Molineux Exceptions
Prior bad acts evidence is admissible to show:
1. **Motive**
2. **Intent**
3. **Absence of mistake or accident**
4. **Common scheme or plan**
5. **Identity** (modus operandi)

## Procedure
- Prosecution must provide **notice** of intent to introduce Molineux evidence
- Court conducts a **Ventimiglia hearing** (named after *People v. Ventimiglia*, 52 N.Y.2d 350 (1981))
- Court must give **limiting instruction** to the jury
- Probative value must outweigh **unfair prejudice**

## Common Applications
- DV cases: prior acts of violence against same victim (to show intent/motive)
- Drug cases: prior sales to show knowledge/intent
- Fraud cases: similar scheme to show common plan
- Identity: unique modus operandi connecting crimes

## Defense Strategies
- Move to preclude any Molineux evidence pre-trial
- Argue the evidence proves nothing beyond propensity
- Request strong limiting instructions
- If admitted, request that the specific facts be sanitized`,
    citations: ['People v. Molineux, 168 N.Y. 264 (1901)', 'People v. Ventimiglia, 52 N.Y.2d 350 (1981)'],
    relatedEntries: ['people-v-sandoval'],
  }),

  e({
    id: 'people-v-rosario', slug: 'people-v-rosario',
    title: 'People v. Rosario — Witness Statement Disclosure',
    category: 'Cases',
    content: `# People v. Rosario, 9 N.Y.2d 286 (1961)

## Holding
The defense is entitled to receive **all prior statements** of a prosecution witness that relate to the subject matter of that witness's testimony.

## Rosario Material
Includes:
- Written statements
- Notes of interviews
- Grand jury testimony
- Prior recorded statements
- Police reports authored by testifying officers

## Timing
- Must be turned over **before cross-examination** of the witness
- Under CPL 245, most Rosario material is now disclosed much earlier via automatic discovery
- Rosario obligations **survive** even after CPL 245 compliance

## Remedy for Non-Disclosure
- Continuance to review materials
- Preclusion of witness testimony
- Mistrial (in extreme cases)
- **Reversal on appeal** if material and prejudicial

## Post-CPL 245 Relevance
While CPL 245 largely supersedes Rosario timing, the Rosario rule remains important:
- Ensures **completeness** — all prior statements must be disclosed
- Provides an independent basis for sanctions beyond CPL 245
- Applies to materials that may not technically fall under CPL 245 categories`,
    citations: ['People v. Rosario, 9 N.Y.2d 286 (1961)', 'CPL § 245.20'],
    relatedEntries: ['cpl-245-discovery', 'brady-v-maryland'],
  }),

  e({
    id: 'people-v-lavalle', slug: 'people-v-lavalle',
    title: 'People v. LaValle — Death Penalty Unconstitutional in NY',
    category: 'Cases',
    content: `# People v. LaValle, 3 N.Y.3d 88 (2004)

## Holding
New York's death penalty statute (CPL § 400.27) was unconstitutional because the **deadlock instruction** — which told jurors that if they could not agree on a sentence, the court would impose a sentence of life with the possibility of parole — was coercive and violated due process.

## Significance
- Effectively **ended the death penalty** in New York
- The legislature has never re-enacted a compliant statute
- No executions have occurred in NY since 1963
- All death row inmates were resentenced

## Legal Reasoning
- The deadlock instruction created an unacceptable risk that jurors would vote for death to avoid the possibility of parole
- Violated the NY Constitution's due process protections
- Court found this coercive effect undermined the reliability of capital sentencing

## Current Status
- New York has **no operative death penalty statute**
- Governor Pataki's attempts to revive it failed
- Subsequent governors have declined to pursue reinstatement`,
    citations: ['People v. LaValle, 3 N.Y.3d 88 (2004)', 'CPL § 400.27'],
    relatedEntries: [],
  }),

  // ===== FEDERAL LANDMARK CASES =====
  e({
    id: 'strickland-v-washington', slug: 'strickland-v-washington',
    title: 'Strickland v. Washington — Ineffective Assistance Standard',
    category: 'Cases',
    content: `# Strickland v. Washington, 466 U.S. 668 (1984)

## Holding
Established the **two-prong test** for ineffective assistance of counsel claims under the Sixth Amendment.

## The Two Prongs

### Prong 1 — Deficient Performance
- Counsel's representation fell **below an objective standard of reasonableness**
- Measured against **prevailing professional norms**
- Strong presumption of competence — must overcome "strong presumption that counsel's conduct falls within the wide range of reasonable professional assistance"

### Prong 2 — Prejudice
- There is a **reasonable probability** that, but for counsel's errors, the result would have been different
- "Reasonable probability" = probability sufficient to undermine confidence in the outcome
- Must show actual effect on the proceeding — not just theoretical prejudice

## Application
- Applies to **all critical stages** of prosecution (trial, plea, sentencing, appeal)
- For **guilty pleas**: must show reasonable probability defendant would not have pleaded guilty (*Hill v. Lockhart*)
- For **capital cases**: prejudice may be easier to establish

## NY State Standard
- New York uses the more favorable **"meaningful representation"** standard (*People v. Baldi*)
- Under Baldi, defendant need only show counsel did not provide meaningful representation
- Does not require the strict prejudice prong of Strickland

## Common IAC Claims
- Failure to investigate alibi, witnesses, or defenses
- Failure to file suppression motions
- Bad advice regarding plea offers
- Failure to advise of immigration consequences (*Padilla v. Kentucky*)
- Conflict of interest`,
    citations: ['Strickland v. Washington, 466 U.S. 668 (1984)', 'Hill v. Lockhart', 'People v. Baldi, 54 N.Y.2d 137', 'Padilla v. Kentucky'],
    relatedEntries: ['cpl-440-10', 'gideon-v-wainwright'],
  }),

  e({
    id: 'brady-v-maryland', slug: 'brady-v-maryland',
    title: 'Brady v. Maryland — Prosecution Disclosure Obligation',
    category: 'Cases',
    content: `# Brady v. Maryland, 373 U.S. 83 (1963)

## Holding
The prosecution must disclose **all material evidence favorable to the defendant**. Suppression of such evidence violates due process regardless of the good or bad faith of the prosecution.

## What Must Be Disclosed
1. **Exculpatory evidence** — evidence tending to show innocence
2. **Impeachment evidence** (*Giglio v. United States*) — evidence undermining credibility of prosecution witnesses
3. Evidence affecting **punishment**

## Materiality Standard
Evidence is "material" if there is a **reasonable probability** that disclosure would have changed the outcome of the proceeding.

## Key Extensions
- *Giglio v. United States*, 405 U.S. 150 (1972) — impeachment material included
- *Kyles v. Whitley*, 514 U.S. 419 (1995) — cumulative effect of all suppressed evidence
- *Strickler v. Greene*, 527 U.S. 263 (1999) — three-part test for Brady claims

## NY Practice
- CPL § 245.20(1)(k) specifically codifies Brady obligations
- CPL 245 goes **beyond** Brady — requires disclosure of ALL impeachment material
- NY courts take Brady violations extremely seriously — can result in vacatur

## Practice Tips
- File a specific Brady demand identifying categories of material sought
- Remind the court of Brady obligations at every court appearance
- If Brady violation discovered post-trial, pursue CPL § 440.10 motion`,
    citations: ['Brady v. Maryland, 373 U.S. 83 (1963)', 'Giglio v. United States, 405 U.S. 150 (1972)', 'Kyles v. Whitley, 514 U.S. 419 (1995)', 'CPL § 245.20'],
    relatedEntries: ['cpl-245-discovery', 'people-v-rosario', 'cpl-440-10'],
  }),

  e({
    id: 'terry-v-ohio', slug: 'terry-v-ohio',
    title: 'Terry v. Ohio — Stop and Frisk',
    category: 'Cases',
    content: `# Terry v. Ohio, 392 U.S. 1 (1968)

## Holding
A police officer may conduct a brief **investigatory stop** of a person based on **reasonable suspicion** of criminal activity, and may conduct a limited **frisk** (pat-down) if the officer reasonably believes the person is armed and dangerous.

## Requirements
### For the Stop
- **Reasonable suspicion** — articulable facts suggesting criminal activity
- More than a hunch, less than probable cause
- Based on the **totality of the circumstances**

### For the Frisk
- Officer must have reasonable belief person is **armed and presently dangerous**
- Limited to a **pat-down of outer clothing**
- If officer feels object that is clearly a weapon, may retrieve it ("plain feel" doctrine)

## Scope Limitations
- Stop must be **brief** and **minimally intrusive**
- Questions must relate to the reason for the stop
- Cannot develop into a de facto arrest without probable cause

## NY Application
- NY uses the **De Bour** framework, which is more protective than Terry
- A Terry stop corresponds to De Bour **Level 3**
- NY courts require more specific articulation of reasonable suspicion

## Key Progeny
- *Illinois v. Wardlow*, 528 U.S. 119 (2000) — flight + high-crime area
- *Florida v. J.L.*, 529 U.S. 266 (2000) — anonymous tips insufficient alone
- *Navarette v. California*, 572 U.S. 393 (2014) — reliable 911 calls may suffice`,
    citations: ['Terry v. Ohio, 392 U.S. 1 (1968)', 'Illinois v. Wardlow', 'Florida v. J.L.'],
    relatedEntries: ['people-v-de-bour', 'cpl-710-20'],
  }),

  e({
    id: 'miranda-v-arizona', slug: 'miranda-v-arizona',
    title: 'Miranda v. Arizona — Right to Remain Silent',
    category: 'Cases',
    content: `# Miranda v. Arizona, 384 U.S. 436 (1966)

## Holding
Before **custodial interrogation**, law enforcement must inform suspects of their rights:
1. Right to remain silent
2. Anything said can be used against them
3. Right to an attorney
4. If unable to afford an attorney, one will be appointed

## When Miranda Applies
- **Custody** + **Interrogation** = Miranda required
- **Custody**: Would a reasonable person feel free to leave? (objective test)
- **Interrogation**: Express questioning OR its functional equivalent (words/actions reasonably likely to elicit incriminating response)

## Waiver
- Must be **knowing, voluntary, and intelligent**
- Can be express or implied (answering questions after being warned)
- Waiver can be revoked at any time

## Invocation of Rights
- **Right to silence**: police must "scrupulously honor" the invocation; may re-approach after significant time
- **Right to counsel**: ALL questioning must cease until attorney is present (*Edwards v. Arizona*)
- Invocation must be **unambiguous** (*Davis v. United States* — "maybe I should talk to a lawyer" insufficient)

## Exceptions
- **Public safety exception** (*New York v. Quarles*) — questions necessary to protect public safety
- **Routine booking questions** — name, address, DOB
- **Spontaneous statements** — volunteered, not in response to interrogation

## NY Practice
- NY provides **broader protections** than federal Miranda
- *People v. Cunningham* — indelible right to counsel attaches once attorney enters the matter
- Once represented, police cannot question without attorney present (NY's "indelible right")`,
    citations: ['Miranda v. Arizona, 384 U.S. 436 (1966)', 'Edwards v. Arizona', 'New York v. Quarles', 'People v. Cunningham'],
    relatedEntries: ['people-v-huntley', 'cpl-710-20'],
  }),

  e({
    id: 'gideon-v-wainwright', slug: 'gideon-v-wainwright',
    title: 'Gideon v. Wainwright — Right to Counsel',
    category: 'Cases',
    content: `# Gideon v. Wainwright, 372 U.S. 335 (1963)

## Holding
The Sixth Amendment right to counsel is a **fundamental right** incorporated against the states through the Fourteenth Amendment. States must provide **free counsel** to criminal defendants who cannot afford an attorney.

## Scope
- Applies to all **felony** cases
- Extended to **misdemeanors** involving potential incarceration (*Argersinger v. Hamlin*, 407 U.S. 25 (1972))
- Includes the right to **effective** assistance of counsel (*Strickland v. Washington*)

## Significance
- Created the modern public defender system
- Fundamental to the adversarial system of justice
- Recognized that lawyers in criminal courts are **necessities, not luxuries**

## NY Implementation
- 18-B assigned counsel panels
- Institutional providers (Legal Aid, public defenders)
- Right attaches at **first judicial proceeding** (arraignment)
- NY's indelible right to counsel provides even greater protection`,
    citations: ['Gideon v. Wainwright, 372 U.S. 335 (1963)', 'Argersinger v. Hamlin, 407 U.S. 25 (1972)', 'Strickland v. Washington'],
    relatedEntries: ['strickland-v-washington', 'arraignment-checklist'],
  }),

  e({
    id: 'batson-v-kentucky', slug: 'batson-v-kentucky',
    title: 'Batson v. Kentucky — Jury Selection Discrimination',
    category: 'Cases',
    content: `# Batson v. Kentucky, 476 U.S. 79 (1986)

## Holding
The use of **peremptory challenges** to exclude jurors based on **race** violates the Equal Protection Clause of the Fourteenth Amendment.

## The Three-Step Test
1. **Step 1 — Prima Facie Case**: The objecting party must show facts/circumstances raising an inference of discrimination
2. **Step 2 — Race-Neutral Explanation**: The striking party must articulate a race-neutral reason for the challenge
3. **Step 3 — Determination**: The court determines whether the explanation is pretextual and discrimination occurred

## Extensions
- Applies to **gender** (*J.E.B. v. Alabama*, 511 U.S. 127 (1994))
- Applies to **both sides** (defense and prosecution) (*Georgia v. McCollum*)
- Applies to **civil cases** (*Edmonson v. Leesville Concrete*)

## NY Practice
- NY courts actively enforce Batson
- *People v. Kern*, 75 N.Y.2d 638 (1990) — established NY Batson procedures
- Challenge must be made **at the time** of the peremptory strike
- Preserve the record — state the demographic makeup of the panel and the challenges

## Practice Tips
- Keep careful notes during voir dire on strikes and demographics
- Object immediately when a pattern emerges
- Ask for comparative juror analysis — similarly situated jurors of different races
- Note that "gut feeling" is not a valid race-neutral explanation`,
    citations: ['Batson v. Kentucky, 476 U.S. 79 (1986)', 'J.E.B. v. Alabama, 511 U.S. 127 (1994)', 'People v. Kern, 75 N.Y.2d 638 (1990)'],
    relatedEntries: [],
  }),

  // ===== FAMILY LAW =====
  e({
    id: 'drl-240', slug: 'drl-240-custody',
    title: 'DRL § 240 — Custody and Best Interests',
    category: 'Statutes',
    content: `# DRL § 240 — Custody Determination

## Best Interests Standard
New York courts determine custody based on the **best interests of the child**. There is no statutory list of factors — courts consider the **totality of circumstances**.

## Factors Courts Consider
1. Quality of the **home environment**
2. Each parent's **parenting skills** and involvement
3. Mental and physical **health** of each parent
4. **Work schedules** and childcare arrangements
5. Child's **preference** (if of sufficient age and maturity)
6. History of **domestic violence** (DRL § 240(1)(a))
7. **Substance abuse** issues
8. Willingness to foster the child's relationship with the other parent (**"friendly parent" doctrine**)
9. **Stability** and continuity of the child's current arrangements
10. **Sibling** relationships — courts prefer keeping siblings together

## Types of Custody
- **Sole custody**: One parent has decision-making authority
- **Joint custody**: Shared decision-making (requires parental cooperation — *Braiman v. Braiman*)
- **Physical custody/Residential custody**: Where the child primarily resides
- **Parenting time/Visitation**: Non-custodial parent's schedule

## Domestic Violence Presumption
DRL § 240(1)(a): Courts must consider domestic violence as a factor. While NY doesn't have a statutory presumption against custody for abusers, it is a **significant factor**.

## Key Cases
- *Eschbach v. Eschbach*, 56 N.Y.2d 167 (1982) — totality of circumstances test
- *Friederwitzer v. Friederwitzer*, 55 N.Y.2d 89 (1982) — no presumption favoring either parent
- *Tropea v. Tropea*, 87 N.Y.2d 727 (1996) — relocation standard`,
    citations: ['DRL § 240', 'Eschbach v. Eschbach, 56 N.Y.2d 167 (1982)', 'Friederwitzer v. Friederwitzer', 'Tropea v. Tropea, 87 N.Y.2d 727 (1996)'],
    relatedEntries: ['eschbach-v-eschbach', 'tropea-v-tropea', 'friederwitzer-v-friederwitzer', 'drl-236-equitable-distribution'],
  }),

  e({
    id: 'drl-236', slug: 'drl-236-equitable-distribution',
    title: 'DRL § 236(B) — Equitable Distribution',
    category: 'Statutes',
    content: `# DRL § 236(B) — Equitable Distribution

## Overview
New York is an **equitable distribution** state — marital property is divided **fairly** (not necessarily equally).

## Marital vs. Separate Property
### Marital Property (DRL § 236(B)(1)(c))
All property acquired during the marriage, regardless of title, including:
- Real estate, bank accounts, investments
- Retirement accounts and pensions
- Business interests and professional practices
- Enhanced earning capacity (degrees, licenses)

### Separate Property (DRL § 236(B)(1)(d))
- Property acquired **before** the marriage
- **Inheritances** and **gifts** from third parties
- **Personal injury** compensation
- Property described as separate in a **prenuptial agreement**

## Factors for Distribution (DRL § 236(B)(5)(d))
1. Income and property at time of marriage and at commencement
2. Duration of the marriage
3. Age and health of parties
4. Need of custodial parent to occupy marital residence
5. Loss of inheritance and pension rights
6. Loss of health insurance
7. Award of maintenance
8. Contributions as homemaker
9. Liquid or non-liquid character of property
10. Future financial circumstances
11. Difficulty of valuing business/professional practice
12. Tax consequences
13. Wasteful dissipation of assets
14. Any transfer/encumbrance without fair consideration
15. Any other factor the court finds just and proper

## Valuation Date
- Generally the **date of commencement** of the divorce action
- Active vs. passive appreciation analysis for separate property

## Practice Tips
- Get **early asset discovery** — subpoena financial records immediately
- Consider hiring forensic accountants for complex assets
- Document any separate property claims with tracing evidence
- Consider tax implications of each distribution scenario`,
    citations: ['DRL § 236(B)', 'DRL § 236(B)(5)(d)'],
    relatedEntries: ['drl-170-divorce-grounds', 'drl-240-custody'],
  }),

  e({
    id: 'drl-170', slug: 'drl-170-divorce-grounds',
    title: 'DRL § 170 — Grounds for Divorce',
    category: 'Statutes',
    content: `# DRL § 170 — Grounds for Divorce in New York

## No-Fault Ground (DRL § 170(7))
- **Irretrievable breakdown** of the relationship for at least **6 months**
- Added in 2010 — made NY the last state to adopt no-fault divorce
- Most commonly used ground today
- Sworn statement by one party is sufficient

## Fault-Based Grounds
1. **Cruel and inhuman treatment** (DRL § 170(1))
   - Conduct that endangers physical or mental well-being
   - Must make it unsafe or improper to continue cohabitation

2. **Abandonment** (DRL § 170(2))
   - For one year or more
   - Includes constructive abandonment (refusal of sexual relations)

3. **Imprisonment** (DRL § 170(3))
   - Consecutive imprisonment for 3+ years after marriage

4. **Adultery** (DRL § 170(4))
   - Difficult to prove — requires corroboration
   - Rarely used in modern practice

5. **Separation judgment** (DRL § 170(5))
   - Living apart for 1+ year pursuant to separation judgment

6. **Separation agreement** (DRL § 170(6))
   - Living apart for 1+ year pursuant to written separation agreement

## Strategic Considerations
- **No-fault** is almost always the preferred ground — simpler, less costly
- **Fault grounds** may be relevant for maintenance or equitable distribution arguments
- Cruel treatment allegations can impact custody proceedings
- Abandonment claims can affect property distribution`,
    citations: ['DRL § 170'],
    relatedEntries: ['drl-236-equitable-distribution', 'drl-240-custody'],
  }),

  e({
    id: 'fca-article-10', slug: 'fca-article-10',
    title: 'Family Court Act Article 10 — Neglect & Abuse',
    category: 'Statutes',
    content: `# Family Court Act Article 10 — Child Protective Proceedings

## Overview
Article 10 governs proceedings where ACS/DSS alleges a child has been **neglected or abused** by a parent or person legally responsible.

## Key Definitions

### Neglect (FCA § 1012(f))
A child whose physical, mental, or emotional condition has been **impaired or is in imminent danger** of becoming impaired due to a parent's failure to exercise a **minimum degree of care** in:
- Providing food, clothing, shelter, education, medical care
- Providing proper supervision or guardianship

### Abuse (FCA § 1012(e))
A child whose parent inflicts or allows to be inflicted:
- **Physical injury** by other than accidental means causing death risk, disfigurement, or protracted impairment
- Creates a **substantial risk** of such injury
- Commits a **sex offense** against the child

## The "Minimum Degree of Care" Standard
- *Nicholson v. Scoppetta*, 3 N.Y.3d 357 (2004): exposure to DV alone is insufficient for neglect
- Must show parent failed to exercise a minimum degree of care — an objective standard
- **"Safer course" doctrine**: did the parent take the safer course of action?

## Procedural Stages
1. **Investigation** by ACS/DSS (60 days)
2. **Filing of petition**
3. **1027 hearing** (emergency removal before petition) or **1028 hearing** (return of removed child)
4. **Fact-finding** — preponderance of the evidence (neglect) / clear and convincing (abuse)
5. **Disposition** — ACS supervision, placement, suspended judgment

## Respondent's Rights
- Right to assigned counsel
- Right to cross-examine witnesses
- Right to present evidence
- Privilege against self-incrimination (but adverse inference may be drawn)`,
    citations: ['FCA § 1012', 'FCA § 1027', 'FCA § 1028', 'Nicholson v. Scoppetta, 3 N.Y.3d 357 (2004)'],
    relatedEntries: ['fca-article-8', 'drl-240-custody'],
  }),

  e({
    id: 'fca-article-8', slug: 'fca-article-8',
    title: 'Family Court Act Article 8 — Family Offense Proceedings',
    category: 'Statutes',
    content: `# Family Court Act Article 8 — Family Offense / Orders of Protection

## Jurisdiction
Family Court has jurisdiction over **family offenses** committed by:
- Spouse or former spouse
- Parent of a common child
- Members of the same family or household (including intimate partners)

## Family Offenses (FCA § 812)
Include (among others): assault, menacing, harassment, stalking, strangulation, sexual offenses, coercion, identity theft, grand larceny

## Orders of Protection
### Temporary Order of Protection (TOP)
- Issued at first appearance, ex parte if necessary
- Can order: stay away, no contact, exclusive occupancy of home, temporary custody

### Final Order of Protection (after hearing)
- Duration: up to **2 years** (5 years for aggravated circumstances)
- Can include all provisions of TOP plus additional conditions

## Concurrent Jurisdiction
- Family Court AND Criminal Court have jurisdiction over family offenses
- Victims can file in **both** courts simultaneously
- Criminal court can also issue orders of protection

## Burden of Proof
- **Fair preponderance of evidence** (civil standard) in Family Court
- Lower than criminal court's beyond a reasonable doubt
- Makes Family Court often more effective for victims

## Practice Tips
- File in Family Court for faster relief (usually same-day TOP)
- Document all incidents with dates, times, witnesses
- Request specific provisions (e.g., surrender of firearms)
- Violation of OP is a criminal offense (Criminal Contempt)`,
    citations: ['FCA § 812', 'FCA Article 8'],
    relatedEntries: ['fca-article-10', 'drl-240-custody'],
  }),

  e({
    id: 'fca-article-3', slug: 'fca-article-3',
    title: 'Family Court Act Article 3 — Juvenile Delinquency',
    category: 'Statutes',
    content: `# Family Court Act Article 3 — Juvenile Delinquency

## Jurisdiction
Family Court has original jurisdiction over acts committed by youth **ages 7-17** that would constitute crimes if committed by adults.

## Raise the Age (2017-2019)
- 16-year-olds (effective 10/2018) and 17-year-olds (effective 10/2019) are now **adolescent offenders** in Youth Part of Superior Court
- Only the most serious offenses keep older teens in adult court
- Presumption of removal to Family Court for most charges

## Stages of a JD Proceeding
1. **Intake** — probation assessment, possible diversion (adjustment)
2. **Petition filing** by Presentment Agency (Corporation Counsel)
3. **Initial appearance** — appointment of Law Guardian (attorney for the child)
4. **Fact-finding** — equivalent of trial (beyond a reasonable doubt standard)
5. **Dispositional hearing** — if JD finding made
6. **Disposition** — conditional discharge, probation, placement (up to 18 months initially)

## Key Protections
- Proceedings are **confidential** (sealed courtroom)
- Records are **sealed**
- No jury trial (bench trial only)
- Miranda rights apply
- Right to assigned counsel (Law Guardian)

## Dispositional Options
- Conditional discharge
- Probation (up to 2 years)
- Placement with OCFS or authorized agency (initially up to 18 months, extensions possible)
- Restitution

## Practice Tips
- Push for **adjustment** (diversion) at intake — avoids formal proceedings entirely
- Law Guardians must advocate for the child's **expressed wishes**
- Emphasize rehabilitative purpose over punishment
- Explore community-based alternatives to placement`,
    citations: ['FCA Article 3', 'Raise the Age legislation'],
    relatedEntries: ['fca-article-10'],
  }),

  e({
    id: 'eschbach-v-eschbach', slug: 'eschbach-v-eschbach',
    title: 'Eschbach v. Eschbach — Custody Totality Test',
    category: 'Cases',
    content: `# Eschbach v. Eschbach, 56 N.Y.2d 167 (1982)

## Holding
Custody determinations must be based on the **totality of the circumstances**, with the child's **best interests** as the paramount concern. No single factor is dispositive.

## Key Principles
- There is **no presumption** favoring either parent (see also *Friederwitzer*)
- The court must evaluate the **totality** of the family's circumstances
- The child's **wishes** are one factor but not controlling
- **Stability and continuity** of the child's current arrangement is important
- The court should consider which parent will best foster the child's relationship with the other parent

## Factors Considered
The court looked at:
- Quality of each parent's home environment
- Emotional bonds between parent and child
- Each parent's ability to provide for the child's needs
- History of the child's care arrangements
- Each parent's mental and physical fitness

## Significance
- This is the **foundational** NY custody case
- Cited in virtually every custody decision in New York
- Established that custody battles require individualized analysis
- Rejected mechanical application of any single factor`,
    citations: ['Eschbach v. Eschbach, 56 N.Y.2d 167 (1982)'],
    relatedEntries: ['drl-240-custody', 'tropea-v-tropea', 'friederwitzer-v-friederwitzer'],
  }),

  e({
    id: 'tropea-v-tropea', slug: 'tropea-v-tropea',
    title: 'Tropea v. Tropea — Relocation Standard',
    category: 'Cases',
    content: `# Tropea v. Tropea, 87 N.Y.2d 727 (1996)

## Holding
When a custodial parent seeks to **relocate** with a child, the court must conduct a **comprehensive analysis** of all relevant factors to determine if the move serves the child's best interests.

## The Tropea Factors
1. Each parent's **reasons** for seeking or opposing the move
2. The **quality** of the relationships between child and each parent
3. Impact of the move on the **quantity and quality** of the child's future contact with the non-custodial parent
4. The **degree** to which the custodial parent's life may be enhanced economically, emotionally, or educationally
5. The **feasibility** of preserving the non-custodial parent's relationship through modified visitation
6. The child's **preference**
7. Whether the custodial parent's desire is motivated by a wish to **defeat** the non-custodial parent's visitation

## Key Principles
- **No presumption** for or against relocation
- The court must weigh all factors — no mechanical test
- The relocating parent bears the burden of demonstrating the move serves the child's best interests
- Economic necessity alone may not be sufficient
- A history of meaningful involvement by the non-custodial parent weighs against relocation

## Practice Tips
- Build a strong record of the reasons for the move (job, family support, etc.)
- Propose a detailed, **realistic** alternative visitation schedule
- If opposing: demonstrate active, consistent involvement in the child's life
- Expert testimony on the impact of relocation can be very persuasive`,
    citations: ['Tropea v. Tropea, 87 N.Y.2d 727 (1996)'],
    relatedEntries: ['drl-240-custody', 'eschbach-v-eschbach'],
  }),

  e({
    id: 'friederwitzer-v-friederwitzer', slug: 'friederwitzer-v-friederwitzer',
    title: 'Friederwitzer v. Friederwitzer — No Gender Presumption',
    category: 'Cases',
    content: `# Friederwitzer v. Friederwitzer, 55 N.Y.2d 89 (1982)

## Holding
There is **no presumption** that custody should be awarded to the mother (or father). Both parents stand on **equal footing** in custody proceedings.

## Significance
- Eliminated the historical "tender years" doctrine in New York
- Established that **gender is irrelevant** to custody determination
- Each case must be decided on its individual facts
- The **only** standard is the best interests of the child

## Context
- Decided the same year as *Eschbach v. Eschbach*
- Together, these cases form the foundation of modern NY custody law
- Reflected changing societal norms about parenting roles

## Application
- Fathers have equal standing to seek custody
- Courts cannot default to the mother based on gender stereotypes
- The "friendly parent" factor applies equally to both parents
- Both parents' involvement in the child's daily life is evaluated equally`,
    citations: ['Friederwitzer v. Friederwitzer, 55 N.Y.2d 89 (1982)'],
    relatedEntries: ['drl-240-custody', 'eschbach-v-eschbach'],
  }),

  e({
    id: 'uccjea', slug: 'uccjea-jurisdiction',
    title: 'UCCJEA — Interstate Custody Jurisdiction',
    category: 'Statutes',
    content: `# Uniform Child Custody Jurisdiction and Enforcement Act (UCCJEA)
## DRL Article 5-A (NY adoption)

## Purpose
Establishes rules for determining which state has **jurisdiction** to make or modify custody determinations, preventing conflicting orders across states.

## Jurisdictional Bases (Priority Order)

### 1. Home State (DRL § 76(1)(a))
The state where the child **lived for 6 consecutive months** (or since birth if under 6 months) immediately before the proceeding. This is the **preferred** basis.

### 2. Significant Connection (DRL § 76(1)(b))
If no home state exists, a state with **significant connections** to the child and at least one parent, AND **substantial evidence** concerning the child's care is available.

### 3. More Appropriate Forum (DRL § 76(1)(c))
All courts with jurisdiction under (1) or (2) decline, OR no state qualifies under (1) or (2).

### 4. Vacuum Jurisdiction (DRL § 76(1)(d))
No other state has jurisdiction — default jurisdiction.

## Key Rules
- **Exclusive continuing jurisdiction**: Once a state makes an initial determination, it retains jurisdiction until the child and all parties have left the state OR the court declines jurisdiction (DRL § 76-a)
- **Temporary emergency jurisdiction** (DRL § 76-c): State can exercise temporary jurisdiction if child is present AND has been abandoned or subjected to mistreatment/abuse
- **Inconvenient forum** (DRL § 76-f): Court may decline jurisdiction if another state is more appropriate

## Practice Tips
- Always analyze jurisdiction FIRST in any interstate custody case
- File in the **home state** whenever possible — strongest jurisdictional basis
- If client recently moved, calculate the 6-month period carefully
- Emergency jurisdiction is temporary — must establish permanent jurisdiction`,
    citations: ['DRL Article 5-A', 'DRL § 76', 'DRL § 76-a', 'DRL § 76-c'],
    relatedEntries: ['drl-240-custody'],
  }),

  // ===== COURT PROCEDURES =====
  e({
    id: 'arraignment-checklist', slug: 'arraignment-checklist',
    title: 'Arraignment Checklist — Criminal Defense',
    category: 'Procedures',
    content: `# Arraignment Checklist

## Before Arraignment
- [ ] Review the **complaint/accusatory instrument** — is it facially sufficient?
- [ ] Interview the client (if possible) — get the client's version of events
- [ ] Check for **outstanding warrants** or open cases
- [ ] Determine immigration status and potential consequences
- [ ] Prepare **bail application** materials if applicable
- [ ] Check if charge is **bail-qualifying** under reformed CPL § 510.10

## At Arraignment
- [ ] Enter **plea** (almost always Not Guilty)
- [ ] Request **ROR** or least restrictive release conditions
- [ ] If bail set, note amount and forms accepted
- [ ] Calendar the **45-day motion deadline** (CPL § 255.20)
- [ ] Calendar the **710.30 notice deadline** (15 days from arraignment)
- [ ] Calendar **CPL 245 discovery deadline** (35 days felony / 15 days misdemeanor)
- [ ] Note the **30.30 speedy trial clock** start date
- [ ] Request **discovery** — confirm CPL 245 obligations
- [ ] Request any **available documents** (rap sheet, complaint, supporting depositions)
- [ ] Obtain next **court date**

## After Arraignment
- [ ] File **notice of appearance** if retained counsel
- [ ] Send **discovery demand** letter (even though automatic under CPL 245)
- [ ] Begin **30.30 log** immediately
- [ ] Calendar all deadlines in firm system
- [ ] Send client a **confirmation letter** with next court date
- [ ] Begin investigation — witnesses, video, evidence preservation
- [ ] Assess potential **suppression issues** (search, statements, ID)
- [ ] Consider **bail review** motion if bail was set

## Red Flags to Check
- ⚠️ Is the accusatory instrument **jurisdictionally defective**?
- ⚠️ Was the arrest **warrantless**? → potential suppression issues
- ⚠️ Did client make **statements**? → Huntley/Miranda issues
- ⚠️ Was there an **identification procedure**? → Wade hearing
- ⚠️ Any **co-defendants**? → conflict check, severance issues`,
    citations: ['CPL § 510.10', 'CPL § 255.20', 'CPL § 710.30', 'CPL § 245.20', 'CPL § 30.30'],
    relatedEntries: ['cpl-510-10', 'cpl-30-30', 'cpl-710-20', 'cpl-245-discovery', 'bail-application-procedures'],
  }),

  e({
    id: 'bail-application-procedures', slug: 'bail-application-procedures',
    title: 'Bail Application Procedures (Post-Reform)',
    category: 'Procedures',
    content: `# Bail Application Procedures — Post-2020 Reform

## Step 1: Determine if Bail is Even Applicable
Under the 2020 reform (amended 2022), bail can **only** be set for **qualifying offenses**:
- Violent felony offenses (PL § 70.02)
- Class A felonies
- Sex offenses requiring registration
- Witness intimidation/tampering
- Certain DV felonies with prior DV conviction
- Terrorism-related charges
- Charges involving firearms
- **If non-qualifying → court MUST release (ROR or supervised release)**

## Step 2: Prepare the Bail Package
Include:
- [ ] **Verification of residence** (lease, utility bill, letter from household member)
- [ ] **Employment verification** (pay stubs, employer letter)
- [ ] **Family/community ties** (letters from family, community members)
- [ ] **Treatment enrollment** (if substance abuse or mental health issues)
- [ ] **Proposed bail amount** with ability-to-pay documentation
- [ ] **Prior court appearance record** — highlight reliable appearances
- [ ] **Supervision plan** (if seeking supervised release)

## Step 3: Make the Argument
1. Start with **ROR** — always request the least restrictive option first
2. If not ROR, argue for **non-monetary conditions** (supervised release, electronic monitoring)
3. If bail is set, argue for **affordable bail** — court must consider ability to pay (CPL § 510.30)
4. Propose specific conditions addressing the court's concerns

## Step 4: If Bail is Set
- Calculate which bail **forms** are most achievable (cash, bond, partially secured bond)
- Contact bail bond companies
- Consider **bail review** motion to a different judge
- File written application with supporting documentation

## Least Restrictive Means Analysis (CPL § 510.10(1))
The court must select the **least restrictive** condition that will ensure return to court:
1. ROR
2. Release under non-monetary conditions
3. Release under non-monetary conditions + supervision
4. Bail
5. Remand (only with specific findings for qualifying offenses)`,
    citations: ['CPL § 510.10', 'CPL § 510.30', 'PL § 70.02'],
    relatedEntries: ['cpl-510-10', 'arraignment-checklist'],
  }),

  e({
    id: 'discovery-obligations-checklist', slug: 'discovery-obligations-checklist',
    title: 'Discovery Obligations Checklist — CPL 245',
    category: 'Procedures',
    content: `# Discovery Obligations Checklist — CPL Article 245

## Prosecution Must Disclose (CPL § 245.20(1))
### Witness Materials
- [ ] Names and adequate contact info for all witnesses (or apply for protective order)
- [ ] All **written/recorded statements** of persons with relevant knowledge
- [ ] **Grand jury testimony** of all witnesses
- [ ] **Expert reports** and qualifications

### Physical Evidence
- [ ] All **tangible property** (photographs, physical evidence)
- [ ] All **electronic recordings** (BWC, surveillance, 911 calls, jail calls)
- [ ] **Lab reports** and underlying data
- [ ] **Search warrant** applications and returns

### Police/Investigation Materials
- [ ] All **police reports** (incident reports, DD5s, memo books)
- [ ] **Arrest paperwork** and supporting depositions
- [ ] **NYPD** disciplinary records of testifying officers (post-50-a repeal)
- [ ] Prior misconduct allegations against officers

### Exculpatory/Impeachment
- [ ] All **Brady** material (exculpatory evidence)
- [ ] All **Giglio** material (impeachment evidence)
- [ ] Prior **inconsistent statements** by witnesses
- [ ] Benefits/promises to cooperating witnesses
- [ ] Pending charges against witnesses

### Other
- [ ] Defendant's **statements** to law enforcement
- [ ] **Co-defendant** statements
- [ ] Relevant **photographs and drawings**
- [ ] **Medical records** relating to injuries

## Defense Must Disclose (CPL § 245.30)
- [ ] **Alibi** witness information (within 30 days)
- [ ] **Psychiatric** evidence intended for trial
- [ ] **Expert** reports and witness lists

## Certificate of Compliance (COC) — CPL § 245.50
- People must file COC when all discovery has been provided
- COC is a **prerequisite** to declaring trial readiness
- Must certify **good faith and due diligence**
- Challenge the COC if discovery is incomplete — powerful defense tool`,
    citations: ['CPL § 245.20', 'CPL § 245.30', 'CPL § 245.50'],
    relatedEntries: ['cpl-245-discovery', 'cpl-30-30', 'brady-v-maryland'],
  }),

  e({
    id: 'motion-practice-timeline', slug: 'motion-practice-timeline',
    title: 'Motion Practice Timeline — Criminal Defense',
    category: 'Procedures',
    content: `# Motion Practice Timeline — Criminal Cases

## Pre-Trial Motion Deadlines

### CPL § 255.20 — Omnibus Motion Deadline
- **45 days** from arraignment (or from date of order holding for action of grand jury)
- Extensions for good cause shown
- Failure to file = waiver of most pre-trial motions

### Common Pre-Trial Motions
| Motion | Statutory Basis | Deadline |
|--------|----------------|----------|
| Suppress physical evidence | CPL § 710.20(1) | 45 days |
| Suppress statements | CPL § 710.20(3) | 45 days |
| Suppress identification | CPL § 710.20(5) | 45 days |
| Dismiss — facial insufficiency | CPL § 210.20(1)(a) | Anytime |
| Dismiss — speedy trial | CPL § 30.30 | Anytime |
| Dismiss — grand jury defect | CPL § 210.20(1)(c) | 45 days |
| Sandoval ruling | Case law | Before trial/testimony |
| Molineux/Ventimiglia | Case law | Before trial |
| Severance | CPL § 200.40 | Before trial |
| Change of venue | CPL § 230.20 | Before trial |
| Discovery motion | CPL § 245.30 | Anytime |
| Preclusion (late 710.30 notice) | CPL § 710.30 | Before trial |

### Responding to Prosecution Motions
- Generally **return date** set by the court
- Opposition papers due per court's scheduling order

## Motion Writing Tips
- Use **point headings** that state your argument as a conclusion
- Include a **statement of facts** with specific references to discovery
- Cite **binding authority** from the relevant Appellate Division
- Attach **supporting affidavits** with personal knowledge
- Request oral argument when the issue is close
- Always include a **proposed order**

## Post-Trial Motions
| Motion | Statutory Basis | Deadline |
|--------|----------------|----------|
| Set aside verdict | CPL § 330.30 | Before sentencing |
| Vacate judgment (IAC, etc.) | CPL § 440.10 | No deadline |
| Resentence | CPL § 440.20 | No deadline |`,
    citations: ['CPL § 255.20', 'CPL § 210.20', 'CPL § 330.30', 'CPL § 440.10'],
    relatedEntries: ['cpl-710-20', 'cpl-30-30', 'people-v-sandoval', 'people-v-molineux', 'arraignment-checklist'],
  }),

  // ===== ADDITIONAL STRATEGY ENTRIES =====
  e({
    id: 'people-v-ventimiglia', slug: 'people-v-ventimiglia',
    title: 'People v. Ventimiglia — Molineux Hearing Procedure',
    category: 'Cases',
    content: `# People v. Ventimiglia, 52 N.Y.2d 350 (1981)

## Holding
Before introducing **Molineux evidence** (prior bad acts), the prosecution must make a **proffer** to the court outside the jury's presence, and the court must conduct a hearing to determine admissibility.

## The Ventimiglia Hearing
1. Prosecution files written notice of intent to offer prior bad acts evidence
2. Court conducts hearing **outside** the jury's presence
3. Prosecution must identify the **specific Molineux exception** relied upon
4. Court balances probative value vs. prejudicial effect
5. If admitted, court must give a **limiting instruction**

## Standard of Review
- Trial court has **broad discretion**
- Appellate review for **abuse of discretion**
- Reversal if the evidence was more prejudicial than probative

## Practice Tips
- Demand a Ventimiglia hearing whenever the People seek to introduce prior acts
- File a written opposition detailing the prejudicial effect
- Request a strong limiting instruction (and consider whether to request one at all — sometimes drawing attention to the evidence is worse)
- Preserve the objection for appeal`,
    citations: ['People v. Ventimiglia, 52 N.Y.2d 350 (1981)', 'People v. Molineux'],
    relatedEntries: ['people-v-molineux', 'people-v-sandoval'],
  }),

  e({
    id: 'plea-negotiation-strategies', slug: 'plea-negotiation-strategies',
    title: 'Plea Negotiation Strategies — Criminal Defense',
    category: 'Strategies',
    content: `# Plea Negotiation Strategies

## Pre-Negotiation Preparation
1. **Know the exposure**: Calculate maximum sentence, mandatory minimums, collateral consequences
2. **Know the case**: Review all discovery, identify weaknesses in People's case
3. **Know the client**: Immigration status, employment, family, prior record, goals
4. **Know the judge**: Sentencing tendencies, plea policies
5. **Know the DA**: Office policies, individual prosecutor tendencies

## Leverage Points
- **Weak identification** → Push for dismissal or significant reduction
- **Suppression issues** → Use pending motions as leverage
- **Complaining witness problems** → Reliability, availability, willingness to testify
- **30.30 issues** → Speedy trial pressure
- **Discovery violations** → COC challenges
- **Evidentiary gaps** → Missing elements of the offense

## Common Plea Structures
| Original Charge | Common Plea | Notes |
|-----------------|-------------|-------|
| Felony assault | Misdemeanor assault (A misd) | Avoids felony record |
| Felony drug possession | CSCS 7th (A misd) | Eligible for sealing |
| DWI | DWAI (VTL 1192(1)) | Traffic infraction |
| Petit larceny | Disorderly conduct | Violation, sealable |
| Felony weapons | Attempted CPW | May reduce mandatory minimum |

## Collateral Consequences Checklist
- [ ] Immigration consequences (deportation, inadmissibility)
- [ ] Sex offender registration
- [ ] Loss of professional license
- [ ] Firearm possession rights
- [ ] Public housing eligibility
- [ ] Employment background checks
- [ ] Student loan / financial aid eligibility
- [ ] Custody / family court implications

## Negotiation Tactics
- Present mitigating information early (before the DA's position hardens)
- Offer to expedite resolution (saves court resources)
- Propose creative dispositions (community service, treatment programs)
- Use defense investigation results strategically
- Consider going over the line ADA to their supervisor if the offer is unreasonable`,
    citations: [],
    relatedEntries: ['arraignment-checklist', 'cpl-160-50'],
  }),

  e({
    id: 'immigration-consequences', slug: 'immigration-consequences',
    title: 'Immigration Consequences of Criminal Convictions',
    category: 'Strategies',
    content: `# Immigration Consequences — Padilla Analysis

## The Padilla Obligation
Under *Padilla v. Kentucky*, 559 U.S. 356 (2010), defense counsel **must** advise clients about immigration consequences of a guilty plea. Failure to do so = ineffective assistance of counsel.

## Categories of Concern

### Deportable Offenses (INA § 237)
- **Aggravated felonies** (broadly defined — includes many offenses that aren't "aggravated" in common usage)
- Controlled substance offenses (except single offense of simple possession of 30g or less of marijuana)
- Firearms offenses
- Domestic violence offenses
- Crimes of moral turpitude (if committed within 5 years of admission)

### Inadmissibility Grounds (INA § 212)
- Controlled substance violations (any amount)
- Crimes involving moral turpitude
- Multiple criminal convictions (aggregate sentence of 5+ years)
- Prostitution-related offenses

### Aggravated Felonies (INA § 101(a)(43))
Include but not limited to:
- Murder, rape, sexual abuse of a minor
- Drug trafficking (including some state felony drug offenses)
- Theft offense with 1-year sentence imposed
- Fraud with loss exceeding $10,000
- Crimes of violence with 1-year sentence imposed

## "Safe" Plea Strategies
- Plead to offenses that are **not categorically** matching removable categories
- Avoid sentence of **365 days** (including suspended sentences) — stay at 364 days max
- Consider **violations** and **non-criminal dispositions** (ACD, etc.)
- Avoid **drug convictions** entirely if possible — even CSCS 7th can trigger removal
- Look at the **categorical approach** and **modified categorical approach** (*Descamps v. United States*)

## Practice Tips
- Screen EVERY client for immigration status at intake
- Consult with an immigration attorney before any plea
- Document your Padilla advisement in the file
- Consider post-conviction relief (440.10) for prior pleas without Padilla advice`,
    citations: ['Padilla v. Kentucky, 559 U.S. 356 (2010)', 'INA § 237', 'INA § 212', 'INA § 101(a)(43)'],
    relatedEntries: ['cpl-440-10', 'plea-negotiation-strategies'],
  }),

  // ===== EXPANDED PENAL LAW ENTRIES =====

  e({
    id: 'pl-strangulation', slug: 'pl-strangulation',
    title: 'PL § 121 — Strangulation Offenses',
    category: 'Statutes',
    content: `# Strangulation — PL Article 121

## Criminal Obstruction of Breathing (PL § 121.11) — Class A Misdemeanor
- Intentionally impedes normal breathing or blood circulation by applying pressure to the throat or neck, or blocking the nose or mouth

## Strangulation in the Second Degree (PL § 121.12) — Class D Felony
- Commits criminal obstruction of breathing AND causes **stupor, loss of consciousness**, or any other physical injury or impairment

## Strangulation in the First Degree (PL § 121.13) — Class C Felony
- Commits criminal obstruction of breathing AND causes **serious physical injury**

## Elements & Practice Notes
- These charges are extremely common in **domestic violence** cases
- Enacted in 2010 to address the lethality risk of strangulation in DV
- **No visible injury required** for obstruction of breathing charge
- Medical evidence of petechiae, hoarseness, or difficulty swallowing is powerful corroboration
- Strangulation 2nd is a **non-violent felony** (eligible for bail reform protections in some contexts, but note DV exceptions)

## Common Defenses
- Consent (limited applicability)
- Self-defense / justification (PL § 35)
- Challenge the medical evidence — no objective signs of impeded breathing
- Credibility of complainant
- Fabrication in the context of contested custody / divorce proceedings

## Sentencing
- Strangulation 2nd (D felony): 1-3 to 2⅓-7 years (probation eligible for first-time offenders)
- Strangulation 1st (C felony): 1-5 to 5-15 years
- Orders of protection routinely issued`,
    citations: ['PL § 121.11', 'PL § 121.12', 'PL § 121.13'],
    relatedEntries: ['pl-assault-degrees', 'fca-article-8'],
  }),

  e({
    id: 'pl-homicide', slug: 'pl-homicide',
    title: 'PL § 125 — Homicide Offenses',
    category: 'Statutes',
    content: `# Homicide — PL Article 125

## Murder in the Second Degree (PL § 125.25) — Class A-I Felony
1. **Intent to kill** another person and causes death
2. Under circumstances evincing a **depraved indifference** to human life, recklessly engages in conduct creating a grave risk of death, and causes death
3. **Felony murder** — during commission of enumerated felonies (robbery, burglary, kidnapping, arson, rape, etc.)
- Sentence: **15-25 years to life** (indeterminate); **25 to life** possible

## Manslaughter in the First Degree (PL § 125.20) — Class B Violent Felony
1. Intent to cause **serious physical injury** → causes death
2. Intent to kill under circumstances constituting **extreme emotional disturbance** (EED — affirmative defense reducing Murder 2nd)
3. Abortion-related (rarely charged)
- Sentence: 5-25 years (determinate for violent felony)

## Manslaughter in the Second Degree (PL § 125.15) — Class C Felony
1. **Recklessly** causes death
2. Intentionally aids or causes suicide
- Sentence: 1-5 to 5-15 years

## Criminally Negligent Homicide (PL § 125.10) — Class E Felony
- With **criminal negligence** causes death
- Standard: failure to perceive a substantial and unjustifiable risk (gross deviation from reasonable person standard)
- Sentence: probation to 1⅓-4 years

## Key Defenses
- **Extreme emotional disturbance** (reduces Murder 2 → Manslaughter 1) — requires reasonable explanation/excuse; partially subjective test
- **Justification** (PL § 35.15) — self-defense / defense of others
- Challenge causation — intervening/superseding cause
- Challenge mental state (intent vs. recklessness vs. negligence)

## Key Cases
- *People v. Patterson*, 39 N.Y.2d 288 (1976) — EED is an affirmative defense
- *People v. Register*, 60 N.Y.2d 270 (1983) — depraved indifference defined (later modified)
- *People v. Feingold*, 7 N.Y.3d 288 (2006) — depraved indifference requires subjective depravity`,
    citations: ['PL § 125.25', 'PL § 125.20', 'PL § 125.15', 'PL § 125.10', 'People v. Patterson', 'People v. Feingold'],
    relatedEntries: ['pl-assault-degrees', 'defense-justification'],
  }),

  e({
    id: 'pl-sex-offenses', slug: 'pl-sex-offenses',
    title: 'PL § 130 — Sex Offenses',
    category: 'Statutes',
    content: `# Sex Offenses — PL Article 130

## Rape in the Third Degree (PL § 130.25) — Class E Felony
1. Sexual intercourse with person **incapable of consent** by reason other than age
2. Person 21+ with person under 17
3. Sexual intercourse without consent (lack of consent other than incapacity)

## Rape in the Second Degree (PL § 130.30) — Class D Felony
1. Person 18+ engages in sexual intercourse with person under 15
2. Sexual intercourse with person incapable of consent due to mental disability/incapacity

## Rape in the First Degree (PL § 130.35) — Class B Violent Felony
1. By **forcible compulsion**
2. Victim physically helpless
3. Victim under 11
4. Victim under 13 and defendant 18+

## Criminal Sexual Act (PL § 130.40/.45/.50)
- Oral/anal sexual conduct — mirrors rape degrees (3rd, 2nd, 1st)
- Same elements as corresponding rape charges but different conduct

## Sexual Abuse (PL § 130.55/.60/.65)
- **3rd Degree** (B Misd): sexual contact without consent
- **2nd Degree** (A Misd): victim under 14
- **1st Degree** (D Felony): by forcible compulsion or victim physically helpless

## Key Definitions
- **Sexual intercourse**: vaginal penetration (however slight)
- **Oral/anal sexual conduct**: contact between mouth/anus and sexual organs
- **Sexual contact**: touching of sexual or intimate parts for gratification
- **Forcible compulsion**: physical force or threat of immediate death/physical injury
- **Lack of consent**: forcible compulsion, incapacity, or under age

## Sentencing
- Rape 1st (B violent felony): **5-25 years** determinate
- All sex felonies carry **SORA registration**
- Many carry mandatory post-release supervision (PRS)

## Defense Considerations
- Consent (for age-appropriate parties)
- Challenge forensic evidence (DNA, SANE exam)
- Prior relationship / motive to fabricate
- Statute of limitations issues
- **Prompt outcry** doctrine and delayed reporting issues`,
    citations: ['PL § 130.25', 'PL § 130.30', 'PL § 130.35', 'PL § 130.40', 'PL § 130.55'],
    relatedEntries: ['sora-registration', 'cpl-710-20'],
  }),

  e({
    id: 'pl-criminal-mischief', slug: 'pl-criminal-mischief',
    title: 'PL § 145 — Criminal Mischief',
    category: 'Statutes',
    content: `# Criminal Mischief — PL Article 145

## Criminal Mischief in the Fourth Degree (PL § 145.00) — Class A Misdemeanor
- Intentionally damages property of another person (no dollar threshold)
- Recklessly damages property in amount exceeding $250

## Criminal Mischief in the Third Degree (PL § 145.05) — Class E Felony
- Intentionally damages property, amount exceeds **$250**

## Criminal Mischief in the Second Degree (PL § 145.10) — Class D Felony
- Intentionally damages property, amount exceeds **$1,500**

## Criminal Mischief in the First Degree (PL § 145.12) — Class B Felony
- Intentionally damages property by means of **explosive**

## Common Defenses
- Ownership / right to property (can't criminally damage your own property)
- Lack of intent (accident)
- Valuation disputes — challenge the dollar amount to reduce the degree
- Justification

## Practice Tips
- Very common in **DV cases** (breaking phones, TVs, etc.)
- Damage valuation is often inflated — demand documentation
- Often charged alongside assault — negotiate to consolidate
- Property damage restitution is typically ordered even with favorable plea`,
    citations: ['PL § 145.00', 'PL § 145.05', 'PL § 145.10', 'PL § 145.12'],
    relatedEntries: ['pl-assault-degrees'],
  }),

  e({
    id: 'pl-arson', slug: 'pl-arson',
    title: 'PL § 150 — Arson',
    category: 'Statutes',
    content: `# Arson — PL Article 150

## Arson in the Fifth Degree (PL § 150.01) — Class A Misdemeanor
- Intentionally damages property by **starting a fire or causing an explosion**

## Arson in the Fourth Degree (PL § 150.05) — Class E Felony
- Recklessly damages a **building or motor vehicle** by starting fire/explosion

## Arson in the Third Degree (PL § 150.10) — Class C Felony
- Intentionally damages a **building or motor vehicle** by starting fire/explosion

## Arson in the Second Degree (PL § 150.15) — Class B Felony
- Intentionally damages a building by fire/explosion **knowing another person is present** or with knowledge of circumstances making presence reasonably possible

## Arson in the First Degree (PL § 150.20) — Class A-I Felony
- Arson 2nd PLUS use of **explosive device** or **incendiary device**, or defendant knew a non-participant was present
- Sentence: **15-25 years to life**

## Key Elements & Defenses
- "Building" includes any structure (PL § 150.00)
- Insurance fraud motive is common — but also a separate charge
- Challenge causation — was the fire accidental?
- Expert fire investigation testimony is critical
- Arson investigation methodology (origin and cause) can be challenged`,
    citations: ['PL § 150.01', 'PL § 150.05', 'PL § 150.10', 'PL § 150.15', 'PL § 150.20'],
    relatedEntries: ['pl-burglary-degrees'],
  }),

  e({
    id: 'pl-larceny', slug: 'pl-larceny',
    title: 'PL § 155 — Larceny / Grand Larceny',
    category: 'Statutes',
    content: `# Larceny — PL Article 155

## Petit Larceny (PL § 155.25) — Class A Misdemeanor
- Steals property (any value under $1,000)

## Grand Larceny in the Fourth Degree (PL § 155.30) — Class E Felony
- Value exceeds **$1,000**
- Property is a credit/debit card, firearm, motor vehicle, religious item from a place of worship, or other specified property
- Extortion

## Grand Larceny in the Third Degree (PL § 155.35) — Class D Felony
- Value exceeds **$3,000**

## Grand Larceny in the Second Degree (PL § 155.40) — Class C Felony
- Value exceeds **$50,000**
- Extortion induced by fear of physical injury

## Grand Larceny in the First Degree (PL § 155.42) — Class B Felony
- Value exceeds **$1,000,000**

## Larceny Defined (PL § 155.05)
A person "steals" property when, with **intent to deprive** another of property, the person wrongfully takes, obtains, or withholds such property by:
- Trespassory taking
- Trick
- Embezzlement
- False pretense
- False promise
- Extortion
- Acquiring lost property

## Common Defenses
- Claim of right (good faith belief in ownership)
- Lack of intent to permanently deprive
- Challenge valuation
- Consent of owner
- Return of property (mitigating, not a defense per se)

## Practice Tips
- Shoplifting (petit larceny) is the most common larceny charge
- Negotiate for **Disorderly Conduct** (violation) disposition when possible
- Grand larceny valuation disputes are common — demand appraisals
- Identity theft charges often accompany larceny charges`,
    citations: ['PL § 155.25', 'PL § 155.30', 'PL § 155.35', 'PL § 155.40', 'PL § 155.42', 'PL § 155.05'],
    relatedEntries: ['pl-robbery', 'pl-cpsp'],
  }),

  e({
    id: 'pl-robbery', slug: 'pl-robbery',
    title: 'PL § 160 — Robbery',
    category: 'Statutes',
    content: `# Robbery — PL Article 160

## Robbery in the Third Degree (PL § 160.05) — Class D Violent Felony
- **Forcibly steals** property (larceny + use or threat of immediate physical force)

## Robbery in the Second Degree (PL § 160.10) — Class C Violent Felony
1. Aided by another person actually present
2. Causes physical injury to non-participant
3. Displays a firearm (or what appears to be)

## Robbery in the First Degree (PL § 160.15) — Class B Violent Felony
1. Causes **serious physical injury** to non-participant
2. **Armed with a deadly weapon**
3. Uses or threatens immediate use of a **dangerous instrument**
4. Displays a **firearm** (actual, not imitation)

## Key Elements
- Robbery = **larceny + force or threat of force**
- Force must be used to **effect the theft** (not just flight)
- Force used to retain stolen property or prevent resistance counts (PL § 160.00)
- "Forcibly" includes physically wresting property away

## Sentencing
- Robbery 3rd (D violent felony): **2-7 years** determinate
- Robbery 2nd (C violent felony): **3½-15 years** determinate
- Robbery 1st (B violent felony): **5-25 years** determinate
- All robbery convictions are **violent felonies** with mandatory state prison for predicate felons

## Common Defenses
- Misidentification (most common — often involves strangers)
- Challenge "force" element — was there force or just a taking?
- Intoxication (negates intent for specific-intent crime)
- Duress
- Alibi`,
    citations: ['PL § 160.05', 'PL § 160.10', 'PL § 160.15', 'PL § 160.00'],
    relatedEntries: ['pl-larceny', 'pl-assault-degrees'],
  }),

  e({
    id: 'pl-cpsp', slug: 'pl-cpsp',
    title: 'PL § 165 — Criminal Possession of Stolen Property',
    category: 'Statutes',
    content: `# Criminal Possession of Stolen Property — PL Article 165

## CPSP in the Fifth Degree (PL § 165.40) — Class A Misdemeanor
- Knowingly possesses stolen property with intent to benefit self or person other than the owner

## CPSP in the Fourth Degree (PL § 165.45) — Class E Felony
- Value exceeds **$1,000**; or credit card, firearm, etc.

## CPSP in the Third Degree (PL § 165.50) — Class D Felony
- Value exceeds **$3,000**

## CPSP in the Second Degree (PL § 165.52) — Class C Felony
- Value exceeds **$50,000**

## CPSP in the First Degree (PL § 165.54) — Class B Felony
- Value exceeds **$1,000,000**

## Key Element: Knowledge
- Must **know** the property is stolen — most litigated element
- Statutory presumption: a person who possesses recently stolen property is **presumed** to know it's stolen (PL § 165.55)
- The presumption is rebuttable

## Common Defenses
- Lack of knowledge that property was stolen
- No intent to benefit
- Challenge the presumption with evidence of innocent acquisition
- Challenge valuation

## Practice Tips
- Often charged alongside larceny/robbery as an alternative count
- Pawnshop/resale records can establish knowledge
- Text messages / social media may show knowledge of stolen nature`,
    citations: ['PL § 165.40', 'PL § 165.45', 'PL § 165.50', 'PL § 165.55'],
    relatedEntries: ['pl-larceny', 'pl-robbery'],
  }),

  e({
    id: 'pl-forgery', slug: 'pl-forgery',
    title: 'PL § 170 — Forgery',
    category: 'Statutes',
    content: `# Forgery — PL Article 170

## Forgery in the Third Degree (PL § 170.05) — Class A Misdemeanor
- Falsely makes, completes, or alters a **written instrument** with intent to defraud

## Forgery in the Second Degree (PL § 170.10) — Class D Felony
- Forgery of a **deed, will, contract, public record, prescription**, or instrument affecting legal relations

## Forgery in the First Degree (PL § 170.15) — Class C Felony
- Forgery of **currency, securities, stocks, bonds**, or government-issued instruments

## Criminal Possession of a Forged Instrument
- Mirrors forgery degrees — possession with knowledge and intent to defraud (PL §§ 170.20-170.30)

## Key Elements
- "Written instrument" is broadly defined (PL § 170.00)
- Must have **intent to defraud, deceive, or injure** another
- "Falsely makes" includes creating a fictitious instrument or altering a genuine one
- Uttering (passing) a forged instrument is a separate offense

## Common Defenses
- Lack of knowledge (didn't know it was forged)
- Lack of intent to defraud
- Authorization from the purported maker
- The instrument is not a "written instrument" under the statute

## Practice Tips
- Often accompanies identity theft, larceny charges
- Check for federal jurisdiction (mail fraud, wire fraud) overlap
- Bank fraud and credit card fraud cases frequently include forgery counts`,
    citations: ['PL § 170.05', 'PL § 170.10', 'PL § 170.15', 'PL § 170.20'],
    relatedEntries: ['pl-larceny'],
  }),

  e({
    id: 'pl-official-misconduct', slug: 'pl-official-misconduct',
    title: 'PL § 195 — Official Misconduct',
    category: 'Statutes',
    content: `# Official Misconduct — PL § 195.00

## Class A Misdemeanor
A **public servant** who, with intent to obtain a benefit or deprive another person of a benefit:
1. Commits an act relating to his office constituting an **unauthorized exercise of his official functions**; OR
2. **Knowingly refrains** from performing a duty imposed upon him by law

## Key Elements
- Defendant must be a **public servant** (PL § 10.00(15))
- Must act with specific **intent** to benefit self or harm another
- The act must relate to official duties

## Practice Tips
- Rare charge but arises in corruption cases against police, officials
- Often accompanies more serious charges (bribery, theft of services)
- Can be a useful negotiated plea in public corruption cases`,
    citations: ['PL § 195.00', 'PL § 10.00(15)'],
    relatedEntries: ['pl-bribery-perjury'],
  }),

  e({
    id: 'pl-escape-bail-jumping', slug: 'pl-escape-bail-jumping',
    title: 'PL § 205 — Escape and Bail Jumping',
    category: 'Statutes',
    content: `# Escape & Bail Jumping — PL Article 205

## Escape in the Third Degree (PL § 205.05) — Class A Misdemeanor
- Having been arrested, escapes from custody

## Escape in the Second Degree (PL § 205.10) — Class E Felony
- Escapes from a **detention facility**

## Escape in the First Degree (PL § 205.15) — Class D Felony
- Escapes from detention facility using **physical force or a dangerous instrument**

## Bail Jumping in the Third Degree (PL § 215.55) — Class A Misdemeanor
- Released on bail/ROR on a **misdemeanor** charge and fails to appear on required date

## Bail Jumping in the Second Degree (PL § 215.56) — Class E Felony
- Released on bail/ROR on a **felony** charge and fails to appear on required date

## Bail Jumping in the First Degree (PL § 215.57) — Class D Felony
- Released on bail/ROR on an **A or B felony** charge and fails to appear

## Defenses to Bail Jumping
- **Uncontrollable circumstances** prevented appearance (affirmative defense — PL § 215.59)
- Voluntary return within 30 days is a mitigating factor
- Lack of notice of court date
- Hospitalization, incarceration elsewhere

## Practice Tips
- Bail jumping charges add additional leverage for the prosecution
- Voluntary surrender ASAP after missed date is critical
- Document any legitimate reason for failure to appear immediately`,
    citations: ['PL § 205.05', 'PL § 205.10', 'PL § 215.55', 'PL § 215.56', 'PL § 215.57'],
    relatedEntries: ['cpl-510-10'],
  }),

  e({
    id: 'pl-bribery-perjury', slug: 'pl-bribery-perjury',
    title: 'PL § 215 — Bribery, Perjury, Tampering, Criminal Contempt',
    category: 'Statutes',
    content: `# PL Article 215 — Offenses Relating to Judicial Proceedings

## Perjury
- **Perjury 1st** (PL § 210.15) — Class D Felony: false material statement under oath in proceeding
- **Perjury 2nd** (PL § 210.10) — Class E Felony: false material statement in a written instrument with intent to mislead
- Requires **materiality** and **willfulness**

## Bribery of/by a Witness
- **Bribing a Witness** (PL § 215.00) — Class D Felony
- Conferring or offering a benefit to induce testimony or absence from proceeding

## Tampering with a Witness
- **Tampering 4th** (PL § 215.10) — Class A Misdemeanor: inducing a witness to be absent or withhold testimony
- **Tampering 3rd** (PL § 215.11) — Class E Felony: by use of force or threat
- **Tampering 2nd** (PL § 215.12) — Class D Felony: force/threat causing physical injury
- **Tampering 1st** (PL § 215.13) — Class B Felony: force/threat causing serious physical injury

## Criminal Contempt
- **Criminal Contempt 2nd** (PL § 215.50) — Class A Misdemeanor: intentional disobedience of court order
- **Criminal Contempt 1st** (PL § 215.51) — Class E Felony (or D Felony): violation of order of protection (with aggravating factors or repeated violations)
- **Aggravated Criminal Contempt** (PL § 215.52) — Class D Felony: violation of OP causing physical injury

## Practice Tips
- Criminal contempt (OP violation) is one of the **most common charges** in DV cases
- Always advise clients about the consequences of OP violations — even accidental contact
- Perjury charges are rare but arise in grand jury contexts
- Witness tampering charges often accompany gang-related prosecutions`,
    citations: ['PL § 210.15', 'PL § 215.00', 'PL § 215.10', 'PL § 215.50', 'PL § 215.51', 'PL § 215.52'],
    relatedEntries: ['fca-article-8', 'cpl-530-orders-of-protection'],
  }),

  e({
    id: 'pl-marijuana-mrta', slug: 'pl-marijuana-mrta',
    title: 'PL § 221/222 — Marijuana Offenses (Post-MRTA)',
    category: 'Statutes',
    content: `# Marijuana — Post-MRTA (Marijuana Regulation & Taxation Act 2021)

## Legal Status
- **Adults 21+** may possess up to **3 ounces** of cannabis or **24 grams** of concentrated cannabis
- Home cultivation allowed (up to 6 plants per person, 12 per household — effective upon OCM regulations)
- Smoking permitted wherever tobacco smoking is allowed

## Remaining Criminal Offenses (PL § 222)
- **Unlawful possession** of cannabis 1st (PL § 222.15): >5 lbs — Class D Felony
- **Unlawful possession** 2nd (PL § 222.10): >16 oz to 5 lbs — Class A Misdemeanor
- **Unlawful sale** 1st (PL § 222.55): sale of >5 lbs — Class D Felony
- **Unlawful sale** 2nd (PL § 222.50): sale of >16 oz to 5 lbs — Class A Misdemeanor
- **Unlawful sale** 3rd (PL § 222.45): sale of >3 oz to 16 oz — Violation

## Automatic Expungement
- Prior convictions for offenses now legal under MRTA are **automatically expunged**
- Includes PL § 221.05 (possession of marijuana), PL § 221.10, and many others
- DCJS ordered to identify and expunge eligible records
- No application required by the individual

## Practice Tips
- Many pending cases were dismissed or reduced after MRTA
- Odor of marijuana **no longer provides probable cause** for search in most contexts
- Unlicensed sale remains prosecutable — "smoke shops" may face charges
- Federal law still classifies marijuana as Schedule I — immigration consequences persist`,
    citations: ['PL § 222', 'MRTA (Ch. 92, Laws of 2021)'],
    relatedEntries: ['pl-drug-offenses', 'cpl-710-20'],
  }),

  e({
    id: 'pl-public-order', slug: 'pl-public-order',
    title: 'PL § 240 — Disorderly Conduct, Harassment',
    category: 'Statutes',
    content: `# Public Order Offenses — PL Article 240

## Disorderly Conduct (PL § 240.20) — Violation
- With intent to cause public inconvenience, annoyance, or alarm, OR recklessly creating a risk thereof:
  1. Engages in fighting or violent, tumultuous, or threatening behavior
  2. Makes unreasonable noise
  3. Uses abusive or obscene language in public
  4. Obstructs traffic
  5. Congregates with others and refuses to comply with lawful police order to disperse
  6. Creates a hazardous condition by act without legitimate purpose

## Harassment in the Second Degree (PL § 240.26) — Violation
1. Strikes, shoves, kicks, or subjects to physical contact with intent to harass, annoy, or alarm
2. Follows person in public place(s) with intent to harass
3. Engages in alarming or seriously annoying conduct serving no legitimate purpose

## Harassment in the First Degree (PL § 240.25) — Class B Misdemeanor
- Intentionally and repeatedly harasses by following or engaging in conduct placing person in **reasonable fear of physical injury**

## Aggravated Harassment in the Second Degree (PL § 240.30) — Class A Misdemeanor
- Communicates threat to cause physical harm (by phone, mail, electronic means)
- Motivated by race, religion, gender, etc. (hate crime enhancement)

## Practice Tips
- **Disorderly Conduct** is the most common plea-bargain reduction (from assault, etc.)
- As a **violation**, it is automatically sealable
- Harassment 2nd is also a violation — sealable
- These charges are extremely common in DV cases
- First Amendment issues may arise with speech-based charges`,
    citations: ['PL § 240.20', 'PL § 240.25', 'PL § 240.26', 'PL § 240.30'],
    relatedEntries: ['plea-negotiation-strategies', 'cpl-160-50'],
  }),

  e({
    id: 'pl-loitering', slug: 'pl-loitering',
    title: 'PL § 240.35/240.36 — Loitering',
    category: 'Statutes',
    content: `# Loitering — PL § 240.35/240.36

## Loitering (PL § 240.35) — Violation
- Remaining in a public place for the purpose of engaging in or soliciting gambling, prostitution, or unlawful drug activity
- Several subsections struck down as unconstitutionally vague (e.g., former "loitering for the purpose of engaging in prostitution" repealed in 2021)

## Loitering in the First Degree (PL § 240.36) — Class B Misdemeanor
- Remaining in any place with intent to engage in or facilitate a **drug offense** and possessing or in close proximity to controlled substances

## Current Status
- Many loitering provisions have been repealed or invalidated
- The **repeal of the "walking while trans" ban** (PL § 240.37) was a significant 2021 reform
- PL § 240.36 remains enforceable but is infrequently charged standalone

## Practice Tips
- Challenge the constitutionality of loitering charges — many subsections are void for vagueness
- Often used as pretext for stops — challenge under De Bour
- Consider whether the underlying activity is still criminalized`,
    citations: ['PL § 240.35', 'PL § 240.36'],
    relatedEntries: ['pl-drug-offenses', 'people-v-de-bour'],
  }),

  e({
    id: 'pl-bigamy-incest', slug: 'pl-bigamy-incest',
    title: 'PL § 255 — Bigamy and Incest',
    category: 'Statutes',
    content: `# Bigamy & Incest — PL Article 255

## Bigamy (PL § 255.15) — Class E Felony
- Contracts or purports to contract a marriage while having a **living spouse**
- Defense: good faith belief that prior marriage was dissolved/annulled (PL § 255.20)
- Defense: absent spouse for 5+ continuous years and believed dead

## Incest in the Third Degree (PL § 255.25) — Class E Felony
- Sexual intercourse or oral/anal sexual conduct with a person known to be related within prohibited degree (ancestor, descendant, sibling, uncle, aunt, nephew, niece)

## Incest in the Second Degree (PL § 255.26) — Class D Felony
- Same as 3rd degree but victim is under 18

## Incest in the First Degree (PL § 255.27) — Class B Felony
- Same but victim is under 18 and defendant is 18+

## Practice Tips
- Bigamy rarely prosecuted in modern practice
- Incest cases often overlap with child abuse / Article 10 proceedings
- SORA registration required for incest convictions`,
    citations: ['PL § 255.15', 'PL § 255.25', 'PL § 255.26', 'PL § 255.27'],
    relatedEntries: ['pl-sex-offenses', 'sora-registration'],
  }),

  e({
    id: 'pl-ewoc', slug: 'pl-ewoc',
    title: 'PL § 260 — Endangering the Welfare of a Child',
    category: 'Statutes',
    content: `# Endangering the Welfare of a Child — PL § 260.10

## Class A Misdemeanor
A person who **knowingly acts in a manner likely to be injurious** to the physical, mental, or moral welfare of a child under 17.

## Key Elements
- **Knowingly** — must be aware of the conduct
- **Likely to be injurious** — doesn't require actual harm
- Applies to **any person**, not just parents or guardians
- Broad statute — covers wide range of conduct

## Common Scenarios
- Leaving young children unsupervised
- Exposing children to drug activity
- DV in presence of children
- Allowing children access to dangerous materials
- Excessive corporal punishment (borderline with abuse)

## Defense Considerations
- Challenge "knowingly" — was defendant aware of the risk?
- Was the conduct actually "likely to be injurious"?
- Cultural practices and parenting disagreements
- The statute is intentionally broad — vagueness challenges have generally failed

## Practice Tips
- Extremely common charge in **DV cases** and **drug cases** involving parents
- Often used as a plea reduction from more serious charges
- ACS/CPS involvement almost always accompanies this charge
- Conviction can impact **custody and visitation** proceedings
- Consider the Family Court Article 10 implications`,
    citations: ['PL § 260.10'],
    relatedEntries: ['fca-article-10', 'pl-assault-degrees'],
  }),

  // ===== CPL PROCEDURE ENTRIES =====

  e({
    id: 'cpl-1-20', slug: 'cpl-1-20',
    title: 'CPL § 1.20 — Key Definitions',
    category: 'Statutes',
    content: `# CPL § 1.20 — Definitions

## Critical Definitions for Criminal Practice

- **Offense** (1.20(1)): Conduct for which a sentence may be imposed (includes felonies, misdemeanors, violations)
- **Traffic infraction** (1.20(2)): VTL violation not designated as crime
- **Felony** (1.20(3)): Offense punishable by >1 year imprisonment
- **Misdemeanor** (1.20(4)): Offense punishable by >15 days but ≤1 year
- **Violation** (1.20(5)): Offense punishable by ≤15 days
- **Crime** (1.20(6)): Misdemeanor or felony
- **Person** (1.20(7)): Human being; also corporation when appropriate
- **Defendant** (1.20(8)): Person against whom a criminal action is pending
- **Accusatory instrument** (1.20(9)): Information, simplified information, misdemeanor complaint, felony complaint, indictment, or SCI
- **Superior Court** (1.20(21)): Supreme Court, County Court
- **Local criminal court** (1.20(22)): District Court, City Court, Criminal Court, Justice Court
- **Arraignment** (1.20(26)): Occasion when defendant first appears before court after filing of accusatory instrument
- **Plea** (1.20(27)): Guilty plea, not guilty plea, or not responsible by reason of mental disease or defect

## Practice Tips
- Understanding these definitions is essential for jurisdictional and procedural arguments
- "Offense" vs. "crime" distinction matters for statutory interpretation
- Court classification determines which court has jurisdiction`,
    citations: ['CPL § 1.20'],
    relatedEntries: ['cpl-70-jurisdiction', 'cpl-100-commencement'],
  }),

  e({
    id: 'cpl-70-jurisdiction', slug: 'cpl-70-jurisdiction',
    title: 'CPL § 70 — Jurisdiction',
    category: 'Statutes',
    content: `# CPL Article 70 — Geographical Jurisdiction

## General Rule (CPL § 20.20)
An offense must be prosecuted in the **county** where it was committed.

## Superior Courts (CPL § 70.10)
- **Supreme Court**: trial jurisdiction over all offenses committed in the county
- **County Court**: trial jurisdiction over all offenses committed in the county (outside NYC)

## Local Criminal Courts (CPL § 70.20)
- **NYC Criminal Court**: all misdemeanors and violations committed in NYC
- **District Court** (Nassau/Suffolk): misdemeanors and violations in the district
- **City Courts**: misdemeanors and violations in the city
- **Justice Courts**: misdemeanors and violations in the town/village

## Felony vs. Misdemeanor
- **Felonies**: prosecuted in Superior Court (after indictment or SCI)
- **Misdemeanors**: can be prosecuted in either local criminal court or Superior Court
- Local courts handle preliminary proceedings on felonies (arraignment, bail, preliminary hearing)

## Practice Tips
- Venue challenges must be raised pre-trial
- Improper venue is NOT jurisdictional in NY — it's waivable
- Transfer motions (CPL § 230) can move cases between courts`,
    citations: ['CPL § 70.10', 'CPL § 70.20', 'CPL § 20.20'],
    relatedEntries: ['cpl-1-20', 'cpl-100-commencement'],
  }),

  e({
    id: 'cpl-100-commencement', slug: 'cpl-100-commencement',
    title: 'CPL § 100 — Commencement of Criminal Action',
    category: 'Statutes',
    content: `# CPL Article 100 — Accusatory Instruments

## Types of Accusatory Instruments

### Information (CPL § 100.10)
- Verified written accusation by a person with **personal knowledge**
- Must contain **non-hearsay** factual allegations establishing **every element** of the offense
- Used for misdemeanors and violations in local criminal courts

### Misdemeanor Complaint (CPL § 100.10)
- Based on **information and belief** (hearsay permitted)
- **Not sufficient for trial** — must be converted to information or superseded by indictment
- Conversion deadline drives prosecution: must convert before readiness (CPL 30.30)

### Felony Complaint (CPL § 100.10)
- Commences felony prosecution in local criminal court
- Must be converted to **indictment** or **SCI** for prosecution in Superior Court
- Preliminary hearing required if no indictment within 144 hours of arrest (CPL § 180.80)

### Simplified Information (CPL § 100.10)
- Used for traffic infractions and some code violations
- Filed by officer on official form (ticket)

## Facial Sufficiency (CPL § 100.15/100.40)
- Must contain **non-hearsay factual allegations** establishing reasonable cause
- For informations: must establish **every element** of the offense (prima facie case)
- Jurisdictionally defective instrument = dismissal

## Practice Tips
- **Always** challenge facial sufficiency — many complaints are defective
- Misdemeanor complaint MUST be converted to information for trial readiness
- Track the 90/120/180-day conversion deadlines for speedy trial purposes
- A motion to dismiss for facial insufficiency can be made at any time`,
    citations: ['CPL § 100.10', 'CPL § 100.15', 'CPL § 100.40', 'CPL § 180.80'],
    relatedEntries: ['cpl-1-20', 'cpl-30-30', 'cpl-170-proceedings'],
  }),

  e({
    id: 'cpl-120-warrants', slug: 'cpl-120-warrants',
    title: 'CPL § 120 — Warrants of Arrest',
    category: 'Statutes',
    content: `# CPL Article 120 — Warrants of Arrest

## When Issued (CPL § 120.20)
A local criminal court may issue a warrant when:
1. An accusatory instrument has been filed AND
2. The court is satisfied there is **reasonable cause** to believe the defendant committed the offense

## Warrant Requirements
- Must be addressed to a **police officer** or class of officers
- Must state the **name of defendant** (or describe if unknown)
- Must contain or refer to the **charges**
- Must state the **court** that issued it

## Execution
- May be executed **anywhere in the state** by any police officer
- May be executed on **any day at any time**
- Officer must inform the defendant of the warrant's existence and charges

## Superior Court Warrants (CPL § 120.30)
- Issued upon indictment or SCI
- County Court or Supreme Court

## Bench Warrants (CPL § 530.70)
- Issued when defendant **fails to appear** in court
- Often results in bail revocation or remand upon apprehension

## Practice Tips
- Check for outstanding warrants before court appearances
- Arrange **voluntary surrender** on warrants when possible — better outcome than arrest
- Challenge stale warrants — lengthy delay in execution may implicate speedy trial rights
- Verify the underlying accusatory instrument is jurisdictionally sufficient`,
    citations: ['CPL § 120.20', 'CPL § 120.30', 'CPL § 530.70'],
    relatedEntries: ['cpl-140-warrantless-arrest', 'cpl-100-commencement'],
  }),

  e({
    id: 'cpl-140-warrantless-arrest', slug: 'cpl-140-warrantless-arrest',
    title: 'CPL § 140 — Arrest Without Warrant',
    category: 'Statutes',
    content: `# CPL Article 140 — Arrest Without Warrant

## Police Officer Arrest Authority (CPL § 140.10)
A police officer may arrest without warrant when:
1. Has **reasonable cause** to believe person committed a **felony** (whether or not in officer's presence)
2. Has **reasonable cause** to believe person committed a **misdemeanor or violation** in officer's **presence**
3. Has reasonable cause to believe person committed a **petit larceny** (not in presence — statutory exception)
4. Has reasonable cause to believe person committed a **DV-related offense** (expanded authority)

## DV Mandatory/Preferred Arrest (CPL § 140.10(4))
- Mandatory arrest for felony DV offenses
- **Preferred arrest** policy for misdemeanor DV
- Violation of order of protection: mandatory arrest when there is reasonable cause

## Private Person Arrest (CPL § 140.30)
- May arrest for **felony** when person has in fact committed the felony
- Higher standard than police: the felony must have **actually been committed**

## Post-Arrest Requirements (CPL § 140.20)
- Must bring arrested person before court **without unnecessary delay**
- Arraignment must occur within **24 hours** (practical requirement)
- If arrested without warrant, accusatory instrument must be filed promptly

## Practice Tips
- Warrantless arrests are fertile ground for **suppression motions**
- Challenge whether the offense was committed "in the officer's presence" for misdemeanors
- DV preferred arrest policies sometimes lead to dual arrests — challenge appropriateness
- Delay in arraignment may support suppression of statements`,
    citations: ['CPL § 140.10', 'CPL § 140.20', 'CPL § 140.30'],
    relatedEntries: ['cpl-120-warrants', 'cpl-710-20', 'people-v-de-bour'],
  }),

  e({
    id: 'cpl-170-proceedings', slug: 'cpl-170-proceedings',
    title: 'CPL § 170 — Proceedings on Information/Complaint',
    category: 'Procedures',
    content: `# CPL Article 170 — Proceedings Upon Information or Complaint

## Arraignment on Information/Complaint (CPL § 170.10)
- Court must inform defendant of charges
- Furnish copy of accusatory instrument
- Advise of rights (counsel, bail)
- Take plea

## Adjournment in Contemplation of Dismissal — ACD (CPL § 170.55)
- Court may, with consent of People and defendant, adjourn the case
- If defendant stays out of trouble for **6 months** (1 year for DV), case is **dismissed and sealed**
- Available for **any offense** prosecuted in local criminal court
- **Marijuana ACD** (CPL § 170.56): automatic for marijuana offenses (now largely moot post-MRTA)

## Motion to Dismiss (CPL § 170.30)
Grounds include:
1. Accusatory instrument is **jurisdictionally defective**
2. Prosecution is barred by **statute of limitations**
3. Prosecution is barred by **double jeopardy**
4. Defendant has **immunity**
5. **Speedy trial** violation (CPL § 30.30)

## Replacement of Accusatory Instrument (CPL § 170.65)
- People may file a **superseding information** at any time before trial
- Cannot file a superseding instrument that charges a higher offense without proper procedure

## Practice Tips
- **ACDs are gold** — always request one for eligible clients
- DV ACDs require complainant consent (People often require it too)
- ACD conditions can include counseling, community service, stay-away
- If ACD is denied, consider plea to violation (Disorderly Conduct) as alternative`,
    citations: ['CPL § 170.10', 'CPL § 170.30', 'CPL § 170.55', 'CPL § 170.56'],
    relatedEntries: ['cpl-30-30', 'cpl-160-50', 'arraignment-checklist'],
  }),

  e({
    id: 'cpl-180-felony-complaint', slug: 'cpl-180-felony-complaint',
    title: 'CPL § 180 — Felony Complaint Proceedings',
    category: 'Procedures',
    content: `# CPL Article 180 — Proceedings Upon Felony Complaint

## The 180.80 Rule (CPL § 180.80)
If defendant is in custody on a felony complaint, the People must take action within **144 hours** (6 days) or **120 hours** (5 days) if weekend/holiday:
- Obtain an **indictment**
- File a **prosecutor's information** reducing to misdemeanor
- Reduce to a misdemeanor complaint
- **Otherwise**: defendant must be released on own recognizance

## Preliminary Hearing (CPL § 180.60)
- If no indictment is obtained within the time frame, defendant is entitled to a preliminary hearing
- At the hearing, the People must demonstrate **reasonable cause** to believe a felony was committed
- If established → case is held for grand jury
- If not → felony charges dismissed (may still proceed on lesser charges)

## Waiver of Preliminary Hearing
- Defendant may waive the hearing (common when plea negotiations are ongoing)
- Waiver does NOT waive the right to challenge the indictment later

## Practice Tips
- Track the **144-hour clock** carefully — release is mandatory if People don't act
- Preliminary hearings are rarely held (People usually indict in time)
- If hearing occurs, it's a valuable discovery opportunity — cross-examine witnesses
- Consider strategic advantages of demanding the hearing vs. waiving`,
    citations: ['CPL § 180.80', 'CPL § 180.60'],
    relatedEntries: ['cpl-100-commencement', 'cpl-190-50', 'cpl-200-indictment'],
  }),

  e({
    id: 'cpl-200-indictment', slug: 'cpl-200-indictment',
    title: 'CPL § 200 — Indictment',
    category: 'Statutes',
    content: `# CPL Article 200 — Indictment

## What Is an Indictment (CPL § 200.10)
A written accusation by a **grand jury** charging one or more defendants with the commission of one or more offenses.

## Requirements (CPL § 200.50)
Must contain:
1. Title of the action
2. Designation of the offense charged (by statutory section)
3. Statement of facts supporting every element of the offense
4. Name of the defendant (if known)
5. County where the offense was committed

## Joinder of Offenses (CPL § 200.20)
- Two or more offenses may be joined in a single indictment if they are:
  - Based on the **same act or criminal transaction**; OR
  - Based on **two or more acts** constituting parts of a common scheme or plan

## Joinder of Defendants (CPL § 200.40)
- Two or more defendants may be jointly charged if they are alleged to have committed the offense(s) together

## Bill of Particulars (CPL § 200.95)
- Defendant may demand a bill of particulars identifying specific factual details
- Useful for narrowing the People's theory and preparing the defense

## Practice Tips
- Review indictment carefully for **facial sufficiency** — motion to dismiss (CPL § 210.20)
- Check for proper **joinder** — move to sever if prejudicial
- Demand a **bill of particulars** to pin down the People's theory
- Grand jury minutes should be reviewed for instructional errors`,
    citations: ['CPL § 200.10', 'CPL § 200.20', 'CPL § 200.40', 'CPL § 200.50', 'CPL § 200.95'],
    relatedEntries: ['cpl-190-50', 'cpl-210-dismiss-indictment'],
  }),

  e({
    id: 'cpl-210-dismiss-indictment', slug: 'cpl-210-dismiss-indictment',
    title: 'CPL § 210 — Motion to Dismiss Indictment',
    category: 'Statutes',
    content: `# CPL § 210 — Motion to Dismiss Indictment

## Grounds (CPL § 210.20)
1. **(a)** Indictment is **defective** (CPL § 210.25)
2. **(b)** Evidence before the grand jury was **legally insufficient**
3. **(c)** Grand jury proceeding was **defective** (improper instructions, unauthorized persons, etc.)
4. **(d)** Defendant has **immunity** from prosecution
5. **(e)** Prosecution is barred by **statute of limitations**
6. **(f)** Prosecution is barred by **double jeopardy**
7. **(g)** Prosecution violates defendant's **constitutional rights**

## Inspection of Grand Jury Minutes (CPL § 210.30)
- Court must examine the grand jury minutes (in camera) when motion is made
- Minutes are disclosed to defense only if the court orders it
- Court reviews legal sufficiency and integrity of the proceedings

## Legal Sufficiency Standard
- **Competent evidence** establishing reasonable cause to believe defendant committed the offense
- Lower standard than trial — but evidence must be legally admissible
- Grand jury instructions must accurately state the law

## Practice Tips
- **Always** move to inspect and dismiss — you have nothing to lose
- Common defects: incorrect legal instructions, failure to instruct on defenses (especially justification)
- Challenge the sufficiency of identification evidence before the grand jury
- CPL § 210.20(1)(c) — defective proceedings include DA's failure to present exculpatory evidence
- Even if denied, the motion preserves appellate issues`,
    citations: ['CPL § 210.20', 'CPL § 210.25', 'CPL § 210.30'],
    relatedEntries: ['cpl-190-50', 'cpl-200-indictment'],
  }),

  e({
    id: 'cpl-220-plea', slug: 'cpl-220-plea',
    title: 'CPL § 220 — Plea',
    category: 'Statutes',
    content: `# CPL Article 220 — Plea

## Types of Pleas (CPL § 220.10)
1. **Not guilty**
2. **Guilty** — to the entire indictment or a lesser included offense
3. **Not responsible by reason of mental disease or defect**

## Guilty Plea Requirements (CPL § 220.50)
- Must be made **in open court**
- Court must be satisfied the plea is **voluntary, knowing, and intelligent**
- Court must advise of rights being waived (trial, confrontation, self-incrimination)
- Defendant must allocute — statement of facts establishing guilt

## Plea to Lesser Offense (CPL § 220.10(3)-(4))
- With **consent of the People and court**, defendant may plead to a **lesser included offense**
- May plead to any offense for which the indictment provides reasonable cause
- Plea to a non-included offense requires **superior court information (SCI)**

## Conditions and Promises
- All conditions of the plea must be stated on the record
- Promised sentence must be specified
- If court cannot deliver promised sentence, defendant has right to withdraw plea

## Appellate Waiver
- Defendants often waive appellate rights as part of plea agreements
- Waiver must be **knowing, voluntary, and intelligent** — separate from the guilty plea
- Certain rights **cannot be waived**: jurisdictional defects, legality of sentence, voluntariness of plea

## Practice Tips
- Ensure allocution is complete — incomplete allocution can be basis for 440.10 motion
- Advise client of **all collateral consequences** (immigration, SORA, etc.) before plea
- Get the promised sentence on the record — protect against judicial reconsideration
- Preserve right to appeal suppression rulings (CPL § 710.70(2)) — conditional plea`,
    citations: ['CPL § 220.10', 'CPL § 220.50', 'CPL § 710.70'],
    relatedEntries: ['plea-negotiation-strategies', 'cpl-440-10'],
  }),

  e({
    id: 'cpl-230-removal', slug: 'cpl-230-removal',
    title: 'CPL § 230 — Removal of Action',
    category: 'Procedures',
    content: `# CPL Article 230 — Removal of Action

## Removal from Local Court to Superior Court
- Felony cases are removed to Superior Court upon **indictment** or **SCI**
- Automatic upon filing of indictment with Superior Court clerk

## Change of Venue (CPL § 230.20)
- Motion may be made when there is **reasonable cause to believe** defendant cannot receive a fair trial in the current county
- Grounds: pretrial publicity, community prejudice
- Court may transfer to any **appropriate county**

## Removal Between Local Courts
- Cases may be transferred between local criminal courts for convenience or other reasons

## Practice Tips
- Change of venue motions are rarely granted but should be considered in high-profile cases
- Document media coverage and community sentiment to support the motion
- Consider alternative remedies: expanded voir dire, jury questionnaires`,
    citations: ['CPL § 230.20'],
    relatedEntries: ['cpl-200-indictment', 'cpl-270-jury-selection'],
  }),

  e({
    id: 'cpl-260-jury-trial', slug: 'cpl-260-jury-trial',
    title: 'CPL § 260 — Jury Trial',
    category: 'Procedures',
    content: `# CPL Article 260 — Jury Trial

## Right to Jury Trial
- **Felonies**: absolute right to jury trial
- **Class A misdemeanors**: right to jury trial (6 jurors)
- **Class B misdemeanors**: right to jury trial (6 jurors)
- **Violations**: bench trial only (no jury right)

## Jury Size
- **Felonies**: 12 jurors + alternates
- **Misdemeanors**: 6 jurors + alternates (in most courts)

## Trial Order of Proceedings (CPL § 260.30)
1. Jury selection
2. Opening statements (People first, then defense — defense may reserve)
3. People's case-in-chief
4. Defense motion to dismiss (CPL § 290.10)
5. Defense case (optional)
6. People's rebuttal
7. Summations (defense first, People last in NY)
8. Jury charge
9. Deliberation and verdict

## Defendant's Rights During Trial
- Right to be **present** throughout (*People v. Antommarchi*)
- Right to **confront** witnesses
- Right to present a defense
- Right to testify or remain silent
- Right not to have silence commented upon

## Practice Tips
- In NY, defense sums up **first** — plan accordingly (address anticipated People's arguments)
- **Preserve objections** — failure to object waives appellate review
- Request specific jury charges in writing before the charge conference
- Consider whether to waive jury in favor of bench trial in specific cases`,
    citations: ['CPL § 260.30', 'People v. Antommarchi'],
    relatedEntries: ['cpl-270-jury-selection', 'cpl-290-trial-motions', 'cpl-300-jury-instructions'],
  }),

  e({
    id: 'cpl-270-jury-selection', slug: 'cpl-270-jury-selection',
    title: 'CPL § 270 — Jury Selection',
    category: 'Procedures',
    content: `# CPL Article 270 — Jury Selection (Voir Dire)

## Process
1. Panel of prospective jurors summoned
2. **Voir dire** — questioning by court and attorneys
3. Challenges for cause (unlimited)
4. Peremptory challenges (limited)

## Challenges for Cause (CPL § 270.20)
Grounds include:
- Relationship to party/witness
- Prior knowledge of the case creating bias
- **State of mind** — cannot be fair and impartial
- Has expressed opinion as to guilt/innocence
- Served on grand jury that indicted

## Peremptory Challenges (CPL § 270.25)
| Charge | Per Side |
|--------|----------|
| Class A felony (life) | 20 |
| Other felonies | 15 |
| All others | 3 |

## Batson Protections
- Cannot exercise peremptory challenges based on **race, gender, ethnicity**, or other protected characteristics
- Three-step Batson analysis applies (see *Batson v. Kentucky*)

## Practice Tips
- Prepare a **juror questionnaire** request for complex cases
- Use open-ended questions to reveal bias — "Tell me about your experience with police"
- Don't waste challenges for cause — exhaust them before using peremptories
- Keep detailed notes on demographics and strikes for Batson preservation
- In NY, attorneys conduct voir dire (not just the judge) — take advantage`,
    citations: ['CPL § 270.20', 'CPL § 270.25', 'Batson v. Kentucky'],
    relatedEntries: ['batson-v-kentucky', 'cpl-260-jury-trial'],
  }),

  e({
    id: 'cpl-290-trial-motions', slug: 'cpl-290-trial-motions',
    title: 'CPL § 290 — Trial Order of Dismissal',
    category: 'Procedures',
    content: `# CPL § 290.10 — Motion to Dismiss at Trial

## The Motion
At the end of the People's case (or at end of all evidence), defendant may move to dismiss on the ground that the evidence is **legally insufficient** to establish the offense.

## Standard
- Court must view evidence in the **light most favorable** to the People
- Is there **legally sufficient evidence** from which a rational jury could find each element beyond a reasonable doubt?
- Court does NOT weigh credibility — that's for the jury

## Timing
- Must be made at the close of the People's case to preserve the issue
- May be renewed at the close of all evidence
- Failure to move = waiver of sufficiency argument on appeal (in most cases)

## Practice Tips
- **Always** make a 290.10 motion — even if likely to be denied — to preserve the appellate issue
- Be specific: identify which elements lack sufficient evidence
- A reserved decision allows the court to reconsider after verdict (CPL § 290.10(1))
- If motion is granted, it's an acquittal — double jeopardy bars retrial`,
    citations: ['CPL § 290.10'],
    relatedEntries: ['cpl-260-jury-trial', 'cpl-300-jury-instructions'],
  }),

  e({
    id: 'cpl-300-jury-instructions', slug: 'cpl-300-jury-instructions',
    title: 'CPL § 300 — Jury Instructions and Deliberation',
    category: 'Procedures',
    content: `# CPL Article 300 — Jury Instructions & Deliberation

## Charge Conference (CPL § 300.10)
- Before summations, court must inform counsel of intended charges
- Parties may request specific charges and object to proposed charges
- **Preserve objections** — failure to object = waiver on appeal

## Submission of Counts (CPL § 300.30)
- Court submits counts in order from most serious to least serious
- Jury must unanimously agree on **one** count before considering lesser counts
- **Lesser included offenses** must be submitted if there is a reasonable view of the evidence supporting the lesser charge (CPL § 300.50)

## Deliberation
- Jury deliberates in private
- May request **readback** of testimony or **further instruction** (CPL § 310.30)
- Verdict must be **unanimous** on each count
- Deadlock: court may give **Allen charge** (supplemental instruction encouraging continued deliberation)

## Key Jury Instructions
- Presumption of innocence
- Burden of proof (beyond a reasonable doubt)
- Credibility of witnesses
- Circumstantial evidence
- Defendant's right not to testify
- Prior convictions (limiting instruction per Sandoval)
- Accomplice corroboration (CPL § 60.22)

## Practice Tips
- Request CJI (Criminal Jury Instructions) charges — they are the standard
- Object to **every** incorrect instruction on the record
- Request lesser included offenses when strategically beneficial
- Request circumstantial evidence charge when applicable — it provides additional protection`,
    citations: ['CPL § 300.10', 'CPL § 300.30', 'CPL § 300.50', 'CPL § 310.30'],
    relatedEntries: ['cpl-260-jury-trial', 'cpl-310-verdict'],
  }),

  e({
    id: 'cpl-310-verdict', slug: 'cpl-310-verdict',
    title: 'CPL § 310 — Verdict',
    category: 'Procedures',
    content: `# CPL Article 310 — Verdict

## Unanimous Verdict Required
- All jurors must agree on the verdict for each count
- Partial verdicts are permitted (guilty on some counts, not guilty on others, hung on others)

## Jury Communications (CPL § 310.30)
- All jury notes/requests go through the court
- Court must provide copies to counsel before responding
- **O'Rama procedure**: court must read the note to counsel on the record and propose a response; counsel must be heard (*People v. O'Rama*, 78 N.Y.2d 270 (1991))

## Types of Verdicts
- **Guilty** of any submitted count
- **Not guilty** of any submitted count
- **Not responsible by reason of mental disease or defect**

## Polling the Jury (CPL § 310.80)
- Either party may request the jury be polled
- Each juror asked individually whether the verdict announced is their verdict
- If any juror dissents, court may direct further deliberation or declare mistrial

## Practice Tips
- **Always** request jury polling — occasionally reveals non-unanimous verdicts
- Monitor all jury notes carefully — O'Rama violations are common appellate issues
- If jury appears deadlocked, resist the Allen charge — argue it's coercive
- Request that the court inquire about numerical division (without asking which way)`,
    citations: ['CPL § 310.30', 'CPL § 310.80', 'People v. O\'Rama, 78 N.Y.2d 270 (1991)'],
    relatedEntries: ['cpl-300-jury-instructions', 'cpl-330-post-verdict'],
  }),

  e({
    id: 'cpl-330-post-verdict', slug: 'cpl-330-post-verdict',
    title: 'CPL § 330 — Post-Verdict Motions',
    category: 'Procedures',
    content: `# CPL § 330.30 — Motion to Set Aside Verdict

## Grounds (CPL § 330.30(1))
1. Any ground that would warrant appellate reversal or modification
2. During the trial there occurred **improper conduct** by a juror, or conduct by another that affected the jury, likely to prejudice the defendant
3. **New evidence** discovered since trial that could not have been discovered earlier, is not merely cumulative, and is of such character as to create probability of a more favorable verdict

## Timing
- Must be filed **before sentencing**
- Usually filed within a reasonable time after verdict

## Standard for Juror Misconduct
- Must show the conduct was **prejudicial** — not just irregular
- Outside influences on jury deliberation
- Juror concealment of bias during voir dire
- Unauthorized communications or experiments

## CPL § 330.30(2) — New Evidence
- Essentially the same standard as CPL § 440.10(1)(g) but pre-sentencing
- Evidence must be genuinely new and could have changed the outcome

## Practice Tips
- File the 330.30 motion before sentencing if you have grounds
- Investigate juror misconduct promptly after verdict
- This motion preserves issues that might be more difficult to raise on appeal
- If successful, court may order a new trial`,
    citations: ['CPL § 330.30'],
    relatedEntries: ['cpl-310-verdict', 'cpl-440-10', 'cpl-380-sentencing'],
  }),

  e({
    id: 'cpl-380-sentencing', slug: 'cpl-380-sentencing',
    title: 'CPL § 380 — Sentencing',
    category: 'Procedures',
    content: `# CPL Article 380 — Sentencing

## Sentencing Procedure (CPL § 380.30)
- Sentence must be pronounced **without unnecessary delay**
- Court may order a pre-sentence investigation (PSI) — mandatory for felonies and certain misdemeanors (CPL § 390.20)
- Defendant has right to counsel at sentencing
- Defendant has right to speak (allocution)

## Sentencing Options (Overview)
- See PL § 60 (authorized sentences) for full range
- Types: imprisonment, probation, conditional discharge, unconditional discharge, fine, restitution

## Victim Impact Statement
- Victims have right to be heard at sentencing (CPL § 380.50)
- Defense may respond to victim's statement

## Time to Appeal
- **30 days** from sentencing to file notice of appeal (CPL § 460.10)
- Preserved issues only (objections made at trial)

## Practice Tips
- Prepare a comprehensive **sentencing memorandum** with mitigating factors
- Gather character letters, employment records, treatment documentation
- Review the PSR carefully and challenge inaccuracies
- Request specific sentencing conditions (treatment programs, etc.)
- File notice of appeal immediately if considering appellate options`,
    citations: ['CPL § 380.30', 'CPL § 380.50', 'CPL § 390.20'],
    relatedEntries: ['cpl-390-psr', 'pl-sentencing-authorized', 'cpl-460-appeals'],
  }),

  e({
    id: 'cpl-390-psr', slug: 'cpl-390-psr',
    title: 'CPL § 390 — Pre-Sentence Report',
    category: 'Procedures',
    content: `# CPL § 390 — Pre-Sentence Investigation & Report

## When Required (CPL § 390.20)
- **Mandatory** for: all felonies, Class A misdemeanors (if incarceration possible), youthful offender determinations
- **Discretionary** for other cases

## Contents of the Report (CPL § 390.30)
- Defendant's personal history (family, education, employment)
- Criminal history
- Circumstances of the offense
- Impact on the victim
- Defendant's statement
- Mental health and substance abuse history
- Probation department's sentencing recommendation

## Defense Access (CPL § 390.50)
- Defense counsel has right to review the report (redacted of confidential sources)
- Must be disclosed **prior to sentencing**
- Defendant may challenge inaccuracies in the report

## Practice Tips
- **Prepare your client** for the probation interview — discuss what to say and what not to say
- Client should NOT discuss the facts of the offense (especially post-trial)
- Review the report carefully for errors — incorrect criminal history is common
- Submit a **defense sentencing memorandum** with mitigating information
- Provide probation with character letters and documentation proactively`,
    citations: ['CPL § 390.20', 'CPL § 390.30', 'CPL § 390.50'],
    relatedEntries: ['cpl-380-sentencing', 'pl-sentencing-authorized'],
  }),

  e({
    id: 'cpl-400-enhancement', slug: 'cpl-400-enhancement',
    title: 'CPL § 400 — Sentence Enhancement Proceedings',
    category: 'Procedures',
    content: `# CPL Article 400 — Pre-Sentence Proceedings / Enhancements

## Predicate Felony Statement (CPL § 400.21)
- Before sentencing as a **second felony offender** or **persistent felony offender**, People must file a predicate felony statement
- Defendant has right to **challenge** the predicate (contest the conviction, constitutionality, etc.)
- Hearing if facts are disputed

## Second Felony Offender (PL § 70.06)
- Prior felony conviction within **10 years** (excluding incarceration)
- Enhanced mandatory minimums
- **Second violent felony offender**: even higher mandatory minimums

## Persistent Felony Offender (PL § 70.10)
- Two prior felony convictions
- Court may impose **A-I felony sentence** (up to life) on ANY felony — extraordinary discretion
- Constitutional challenges ongoing (*Besio* / *Rosen*)

## Persistent Violent Felony Offender (PL § 70.08)
- Two prior violent felony convictions
- Mandatory enhanced sentences

## Practice Tips
- Challenge EVERY prior conviction listed in the predicate felony statement
- Was the prior plea constitutionally valid? (right to counsel, voluntariness)
- Was the sentence actually imposed? (must have been sentenced to >1 year)
- Calculate the 10-year tolling period carefully
- Consider plea negotiations that avoid predicate felony status`,
    citations: ['CPL § 400.21', 'PL § 70.06', 'PL § 70.08', 'PL § 70.10'],
    relatedEntries: ['pl-sentencing-imprisonment', 'cpl-380-sentencing'],
  }),

  e({
    id: 'cpl-420-fines', slug: 'cpl-420-fines',
    title: 'CPL § 420 — Fines and Restitution',
    category: 'Procedures',
    content: `# CPL Article 420 — Fines and Restitution

## Fines (CPL § 420.10)
- Court may impose fines for any offense
- Must consider defendant's **ability to pay**
- Fine defaults may result in incarceration (with limitations)

## Restitution (PL § 60.27)
- Court may order restitution to the **victim** for actual out-of-pocket losses
- Maximum: the amount of actual loss
- Can be ordered as a condition of sentence (probation, conditional discharge)
- Restitution hearing if amount is disputed

## Mandatory Surcharges (PL § 60.35)
| Offense | Surcharge |
|---------|-----------|
| Felony | $300 |
| Misdemeanor | $175 |
| Violation | $95 |
- **Crime Victim Assistance Fee**: $25 (felony/misdemeanor), $10 (violation)
- **DNA databank fee**: $50

## Practice Tips
- Always argue inability to pay for indigent clients
- Request **installment payment** plans
- Restitution must be based on **actual documented losses** — demand receipts/documentation
- Surcharges are mandatory — cannot be waived (but can be paid in installments)
- Financial hardship waiver available for surcharges in limited circumstances`,
    citations: ['CPL § 420.10', 'PL § 60.27', 'PL § 60.35'],
    relatedEntries: ['cpl-380-sentencing'],
  }),

  e({
    id: 'cpl-460-appeals', slug: 'cpl-460-appeals',
    title: 'CPL § 460 — Appeals',
    category: 'Procedures',
    content: `# CPL Article 460 — Appeals

## Notice of Appeal (CPL § 460.10)
- Must be filed within **30 days** of sentencing
- Filed with the court that imposed the sentence
- Counsel should file notice of appeal immediately if considering appellate options

## As of Right Appeals
- Defendant may appeal a **judgment of conviction** as of right
- Appeals from felony convictions go to the **Appellate Division**
- Appeals from misdemeanor convictions go to the **Appellate Term** (or County Court in some jurisdictions)

## Permission Appeals (CPL § 460.15)
- Certain interlocutory orders require **leave to appeal**
- Apply to the intermediate appellate court or a justice thereof
- People may appeal suppression orders as of right (CPL § 450.20)

## Preservation Requirement
- Issues must be **preserved** by objection at trial
- Unpreserved issues may only be reviewed in the **interest of justice** — discretionary
- The Court of Appeals requires preservation (no interest-of-justice review)

## Stay of Execution (CPL § 460.50)
- Defendant may apply for a stay pending appeal
- Must show likelihood of success AND that irreparable harm would result
- Bail pending appeal is rare but available for non-violent offenses

## Practice Tips
- File the notice of appeal within 30 days — this is jurisdictional
- Order trial transcripts immediately
- Apply for **assigned appellate counsel** (if indigent)
- File for **poor person relief** and free transcripts (CPLR § 1101)
- Appellate Division has 18-B panels for assigned appellate work`,
    citations: ['CPL § 460.10', 'CPL § 460.15', 'CPL § 460.50', 'CPL § 450.20'],
    relatedEntries: ['cpl-470-appeal-determination', 'cpl-440-10'],
  }),

  e({
    id: 'cpl-470-appeal-determination', slug: 'cpl-470-appeal-determination',
    title: 'CPL § 470 — Determination of Appeals',
    category: 'Procedures',
    content: `# CPL Article 470 — Determination of Appeals

## Powers of the Appellate Court

### Intermediate Appellate Court (CPL § 470.15)
May:
1. **Reverse** — dismiss accusatory instrument
2. **Reverse** — order new trial
3. **Modify** — reduce conviction to lesser included offense
4. **Modify** — reduce sentence
5. **Affirm** the judgment

### Standards of Review
- **Legal sufficiency**: Could a rational jury have found each element beyond a reasonable doubt?
- **Weight of the evidence**: Was the verdict against the weight of the evidence? (independent factual review — unique to NY)
- **Abuse of discretion**: Sentencing, evidentiary rulings
- **Harmless error**: Was the error harmless beyond a reasonable doubt? (constitutional errors)

## Court of Appeals (CPL § 470.35)
- Highest court in New York
- May affirm, reverse, or modify
- Review is generally limited to **questions of law**
- Cannot review facts unless the Appellate Division made new findings

## Key Principles
- **Harmless error doctrine**: Not every error requires reversal — must be prejudicial
- **Weight of the evidence** review is unique to NY — provides broader appellate relief than federal courts
- **Mode of proceedings** errors (fundamental errors like absence from trial) are not subject to preservation requirement

## Practice Tips
- Always argue both **legal sufficiency** and **weight of evidence** on appeal
- Weight of evidence review is the **broadest** standard — use it
- Identify **mode of proceedings** errors — these are reviewable even without objection
- For Court of Appeals review, must obtain **leave** unless specific exceptions apply`,
    citations: ['CPL § 470.15', 'CPL § 470.35'],
    relatedEntries: ['cpl-460-appeals', 'cpl-330-post-verdict'],
  }),

  e({
    id: 'cpl-530-orders-of-protection', slug: 'cpl-530-orders-of-protection',
    title: 'CPL § 530 — Orders of Protection (Criminal)',
    category: 'Statutes',
    content: `# CPL § 530 — Orders of Protection (Criminal Court)

## Temporary Order of Protection (CPL § 530.12)
- Issued at arraignment or any time during criminal proceedings
- Conditions may include:
  - **Full stay-away** (no contact, no proximity)
  - **Limited** (refrain from harassment/intimidation only)
  - Exclusive occupancy of shared residence
  - Temporary custody
  - Surrender of firearms

## Duration
- **TOP** remains in effect during pendency of criminal action
- **Final OP** (upon conviction): up to **8 years** for felonies, **5 years** for misdemeanors, **2 years** for violations
- Upon any felony involving DV: may be permanent

## Modification (CPL § 530.12(11))
- Either party may move to modify
- Court considers the circumstances and the safety of the protected party
- The **protected party cannot consent** to a violation of the OP

## Violation
- **Criminal contempt** (PL § 215.50/215.51)
- Mandatory arrest for OP violations
- Can result in separate criminal charges

## Practice Tips
- Negotiate the type of OP at arraignment — full vs. limited makes a huge difference
- A full stay-away order can effectively evict your client from their home
- Advise clients that **ANY contact** violates a full OP — even responding to the complainant's texts
- Document if the complainant is initiating contact — relevant for contempt defense
- Request modification when circumstances change (e.g., custody arrangement needs contact)`,
    citations: ['CPL § 530.12', 'PL § 215.50', 'PL § 215.51'],
    relatedEntries: ['fca-article-8', 'pl-bribery-perjury'],
  }),

  e({
    id: 'cpl-720-youthful-offender', slug: 'cpl-720-youthful-offender',
    title: 'CPL § 720 — Youthful Offender',
    category: 'Statutes',
    content: `# CPL § 720 — Youthful Offender Treatment

## Eligibility (CPL § 720.10)
- Defendant must be **16-18** years old at the time of the offense (expanded under Raise the Age)
- Charged with a crime (not a traffic infraction or violation)
- Not previously adjudicated a YO or convicted of a felony
- **Exception**: YO is mandatory consideration for all eligible youth, even on A felonies (court must state reasons for denial)

## Effect of YO Adjudication (CPL § 720.35)
- Conviction is **vacated** and replaced with a YO finding
- Record is **sealed** — not a criminal conviction
- No **felony record** — enormous benefit for employment, housing, immigration
- Sentencing limits apply (generally capped at probation or definite sentence)

## Court's Discretion
- Court must determine whether defendant is an "eligible youth"
- Consider: gravity of the offense, defendant's background, character, potential for rehabilitation
- For **armed felonies** (loaded firearm): YO treatment is discretionary, not mandatory consideration
- Court must state reasons on the record for granting or denying YO

## Practice Tips
- **Always** request YO treatment for eligible defendants — the benefits are enormous
- Prepare a comprehensive packet: school records, employment, character letters, treatment
- If denied, ensure the court states reasons on the record for appeal
- YO adjudication avoids SORA registration in many cases
- Immigration benefit: YO is generally NOT a "conviction" for immigration purposes`,
    citations: ['CPL § 720.10', 'CPL § 720.35'],
    relatedEntries: ['cpl-160-50', 'cpl-380-sentencing'],
  }),

  // ===== SENTENCING STATUTES =====

  e({
    id: 'pl-sentencing-authorized', slug: 'pl-sentencing-authorized',
    title: 'PL § 60 — Authorized Sentences',
    category: 'Statutes',
    content: `# PL § 60 — Authorized Sentences

## Overview
PL § 60.01 establishes the authorized sentences for each class of offense.

## Felony Sentences
| Class | Examples | Prison Range |
|-------|----------|-------------|
| **A-I** | Murder 2nd, CPCS 1st | 15-25 to Life / 20 to Life |
| **A-II** | CPCS 2nd, Predatory Sexual Assault | 3-8 to Life (drug) / 10-25 to Life |
| **B Violent** | Robbery 1st, Assault 1st | 5-25 years (determinate) |
| **B Non-Violent** | Grand Larceny 1st | 1-3 to 8⅓-25 (indeterminate) |
| **C Violent** | Robbery 2nd, Burglary 2nd | 3½-15 years (determinate) |
| **C Non-Violent** | Grand Larceny 2nd | 1-5 to 5-15 (indeterminate) |
| **D Violent** | Robbery 3rd, Assault 2nd | 2-7 years (determinate) |
| **D Non-Violent** | Grand Larceny 3rd | 1⅓-4 to 2⅓-7 (indeterminate) |
| **E Violent** | Attempted Assault 2nd | 1½-4 years (determinate) |
| **E Non-Violent** | Grand Larceny 4th | 1⅓-4 (indeterminate); probation eligible |

## Non-Incarceratory Sentences
- **Probation** (PL § 65): supervision in the community
- **Conditional discharge** (PL § 65.05): conditions without supervision
- **Unconditional discharge** (PL § 65.20): no conditions
- **Fine** (PL § 80): monetary penalty

## Misdemeanor Sentences
- **Class A Misdemeanor**: up to 1 year jail, 3 years probation
- **Class B Misdemeanor**: up to 3 months jail
- **Unclassified Misdemeanor**: as specified by statute (e.g., DWI = up to 1 year)

## Practice Tips
- Know the difference between **determinate** (violent felonies) and **indeterminate** (non-violent felonies) sentencing
- Determinate sentences include mandatory **post-release supervision (PRS)**
- Negotiate to avoid violent felony classification when possible — impacts sentence structure dramatically`,
    citations: ['PL § 60.01', 'PL § 60.05'],
    relatedEntries: ['pl-sentencing-probation', 'pl-sentencing-imprisonment', 'cpl-380-sentencing'],
  }),

  e({
    id: 'pl-sentencing-probation', slug: 'pl-sentencing-probation',
    title: 'PL § 65 — Probation',
    category: 'Statutes',
    content: `# PL § 65 — Probation & Conditional Discharge

## Probation (PL § 65.00)
### Duration
- **Felony**: up to **5 years** (10 years for certain sex offenses)
- **Class A Misdemeanor**: up to **3 years**
- **Other Misdemeanor**: up to **1 year**

### Conditions
- Report to probation officer as directed
- Remain in jurisdiction
- May include: substance abuse treatment, mental health treatment, community service, curfew, electronic monitoring
- Employment requirement
- No new arrests

### Violation
- Probation officer files violation petition
- Hearing before the sentencing court
- If violated: court may continue probation (with modifications), revoke and resentence (up to the maximum originally available)

## Conditional Discharge (PL § 65.05)
- Similar to probation but **without active supervision**
- Defendant must comply with specified conditions
- Duration: up to **3 years** (felony), **1 year** (misdemeanor)
- Commonly used for violations and minor offenses

## Practice Tips
- Probation is often the best realistic outcome for non-violent felonies
- Negotiate favorable conditions — avoid overly restrictive terms
- Early termination of probation is available after satisfactory compliance (typically after half the term)
- Prepare for violation hearings — standard is preponderance of the evidence`,
    citations: ['PL § 65.00', 'PL § 65.05'],
    relatedEntries: ['pl-sentencing-authorized', 'cpl-380-sentencing'],
  }),

  e({
    id: 'pl-sentencing-imprisonment', slug: 'pl-sentencing-imprisonment',
    title: 'PL § 70 — Imprisonment',
    category: 'Statutes',
    content: `# PL § 70 — Sentences of Imprisonment

## Indeterminate Sentences (PL § 70.00) — Non-Violent Felonies
- Court sets **minimum** and **maximum**
- Minimum: must be at least **1/3 of the maximum**
- Maximum: set by statute based on felony class
- Parole eligibility at minimum; max release at maximum

| Class | Maximum Range |
|-------|--------------|
| A-I | 15-25 to Life |
| A-II | Life (drug: 3-8⅓ to Life) |
| B | 1-3 to 8⅓-25 |
| C | 1-5 to 5-15 |
| D | 1⅓-4 to 2⅓-7 |
| E | 1⅓-4 |

## Determinate Sentences (PL § 70.02) — Violent Felony Offenses
- Court sets a **single fixed term**
- Mandatory **post-release supervision (PRS)**: 1½ to 5 years (depending on class)
- Good time: up to **1/7** off

| Class | Range |
|-------|-------|
| B Violent | 5-25 years |
| C Violent | 3½-15 years |
| D Violent | 2-7 years |
| E Violent | 1½-4 years |

## Second Felony Offender (PL § 70.06)
- Enhanced minimums: minimum is **½ of the maximum** (indeterminate)
- For determinate sentences: enhanced range applies

## Second Violent Felony Offender (PL § 70.04)
- Must receive a determinate sentence
- Enhanced mandatory minimums (significantly higher)
- No probation available

## Definite Sentences (PL § 70.15 / § 85)
- For misdemeanors: fixed term of days (e.g., "90 days")
- Maximum: 1 year (Class A misd), 3 months (Class B misd)
- Good time: 1/3 off for good behavior

## Practice Tips
- Determinate vs. indeterminate distinction is critical — affects parole eligibility, PRS
- PRS violations can result in re-incarceration — advise clients
- Negotiate for concurrent rather than consecutive sentences when multiple convictions
- Merit time, good time, and earned eligibility programs can reduce actual time served`,
    citations: ['PL § 70.00', 'PL § 70.02', 'PL § 70.04', 'PL § 70.06', 'PL § 70.15'],
    relatedEntries: ['pl-sentencing-authorized', 'cpl-400-enhancement'],
  }),

  e({
    id: 'ny-sentencing-grid', slug: 'ny-sentencing-grid',
    title: 'NY Felony Sentencing Quick Reference Grid',
    category: 'Strategies',
    content: `# NY Felony Sentencing Quick Reference Grid

## First-Time Non-Violent Felony Offenders (Indeterminate)

| Class | Min Range | Max Range | Probation? |
|-------|-----------|-----------|------------|
| **A-I** | 15-25 yrs | Life | No |
| **A-II** | 3-8⅓ yrs | Life | No |
| **B** | 1-3 to 8⅓ yrs | 3-25 yrs | No |
| **C** | 1-5 yrs | 3-15 yrs | Yes |
| **D** | 1⅓-2⅓ yrs | 3-7 yrs | Yes |
| **E** | 1⅓ yrs | 3-4 yrs | Yes |

## First-Time Violent Felony Offenders (Determinate)

| Class | Sentence Range | PRS |
|-------|---------------|-----|
| **B Violent** | 5-25 yrs | 5 yrs |
| **C Violent** | 3½-15 yrs | 3-3½ yrs |
| **D Violent** | 2-7 yrs | 1½-3 yrs |
| **E Violent** | 1½-4 yrs | 1½ yrs |

## Second Felony Offender (Enhanced — PL § 70.06)

| Class | Min (Indeterminate) |
|-------|-------------------|
| **B** | 4½-12½ yrs |
| **C** | 3-8 yrs |
| **D** | 2-3½ yrs |
| **E** | 1½-2 yrs |

## Second Violent Felony Offender (PL § 70.04)

| Class | Determinate Range |
|-------|------------------|
| **B Violent** | 10-25 yrs |
| **C Violent** | 7-15 yrs |
| **D Violent** | 5-7 yrs |
| **E Violent** | 3-4 yrs |

## Common Misdemeanor Sentences
| Class | Max Jail | Probation |
|-------|----------|-----------|
| **A Misdemeanor** | 1 year | 3 years |
| **B Misdemeanor** | 3 months | 1 year |
| **Unclassified** | As specified | Varies |

## Key Notes
- **A-I/A-II**: no probation, no alternative to incarceration
- **Violent felonies**: determinate sentence + mandatory PRS
- **Non-violent C/D/E felonies**: probation-eligible for first offenders
- **Drug felonies**: special sentencing provisions (PL § 70.70) — often lower ranges
- **Youthful offender**: sentence capped regardless of underlying charge`,
    citations: ['PL § 70.00', 'PL § 70.02', 'PL § 70.04', 'PL § 70.06'],
    relatedEntries: ['pl-sentencing-authorized', 'pl-sentencing-imprisonment', 'pl-sentencing-probation'],
  }),

  // ===== KEY NY CASES =====

  e({
    id: 'people-v-payton', slug: 'people-v-payton',
    title: 'People v. Payton / Payton v. New York — Warrantless Home Entry',
    category: 'Cases',
    content: `# Payton v. New York, 445 U.S. 573 (1980)

## Holding
The Fourth Amendment **prohibits warrantless, non-consensual entry** into a suspect's home to make a routine felony arrest. An arrest warrant is required absent **exigent circumstances** or **consent**.

## Exigent Circumstances Exceptions
Police may enter without a warrant if:
1. **Hot pursuit** of a fleeing felon
2. Imminent **destruction of evidence**
3. Need to prevent suspect's **escape**
4. Risk of **danger to police or others**

## Key Points
- An arrest warrant implicitly carries authority to enter the **suspect's own home**
- To enter a **third party's home** to arrest a suspect, police need a **search warrant** (*Steagald v. United States*)
- The burden is on the People to establish exigent circumstances

## NY Application
- Routinely litigated in suppression hearings
- NY courts apply Payton strictly
- Any evidence obtained through warrantless home entry is suppressible (fruit of the poisonous tree)

## Practice Tips
- If client was arrested at home without a warrant — **strong suppression issue**
- Challenge the People's claim of exigent circumstances
- Was there truly hot pursuit, or did police simply go to the home?
- Consent must be **voluntary** — challenge if coerced`,
    citations: ['Payton v. New York, 445 U.S. 573 (1980)', 'Steagald v. United States'],
    relatedEntries: ['cpl-710-20', 'people-v-de-bour'],
  }),

  e({
    id: 'people-v-harris', slug: 'people-v-harris',
    title: 'People v. Harris — Threshold Inquiry / DeBour Levels',
    category: 'Cases',
    content: `# People v. Harris (Threshold Inquiry)

## Overview
*People v. Harris* refined the application of the *De Bour* framework, particularly regarding the **threshold between levels** of police-citizen encounters.

## Key Principles
- Each level of *De Bour* requires **independent justification**
- Officers cannot bootstrap an encounter — the facts known at each escalation point must independently support the higher level
- A request for information (Level 1) cannot automatically escalate to a stop (Level 3) without additional articulable facts

## Application
- Courts examine what facts the officer knew **at each point** of the encounter
- Subjective intentions of the officer are less relevant than objective facts
- The encounter must be analyzed **sequentially** — what justified each escalation?

## Practice Tips
- In suppression hearings, walk through the encounter **step by step**
- Challenge each escalation point independently
- If Level 1 was not justified, everything that follows is tainted
- Police testimony that telescopes the encounter should be challenged`,
    citations: ['People v. Harris', 'People v. De Bour'],
    relatedEntries: ['people-v-de-bour', 'cpl-710-20'],
  }),

  e({
    id: 'people-v-galak', slug: 'people-v-galak',
    title: 'People v. Galak — Breathalyzer/Chemical Test',
    category: 'Cases',
    content: `# People v. Galak — Breathalyzer Foundation

## Holding
The prosecution must lay a proper **foundation** for breathalyzer results, including evidence that:
1. The instrument was in **proper working order**
2. The test was administered by a **qualified operator**
3. Proper **procedures were followed** (including the 20-minute observation period)

## Requirements for Admissibility
- Machine must be on the list of **approved instruments**
- Calibration and maintenance records must be available
- Operator must hold a valid **permit** from the Department of Health
- The 20-minute **observation/deprivation period** must be observed (no eating, drinking, smoking, or vomiting)

## Common Challenges
- Failure to observe the 20-minute waiting period
- Machine not properly calibrated or maintained
- Operator's certification expired
- Radio frequency interference
- Mouth alcohol contamination (GERD, dental work, recent vomiting)

## Practice Tips
- Subpoena all maintenance and calibration records
- Check the operator's certification status
- Demand the **Datamaster/Intoxilyzer** maintenance logs
- Explore rising BAC defense — client's BAC was below .08 at time of driving
- Expert testimony on breathalyzer limitations can be powerful`,
    citations: ['People v. Galak', 'VTL § 1194'],
    relatedEntries: ['pl-dwi'],
  }),

  e({
    id: 'people-v-ramos', slug: 'people-v-ramos',
    title: 'People v. Ramos — Jury Unanimity',
    category: 'Cases',
    content: `# People v. Ramos — Jury Unanimity

## Holding
In New York, a criminal verdict must be **unanimous** — all jurors must agree on **guilt or acquittal** for each count.

## Key Principles
- The unanimity requirement extends to the **theory** of guilt when multiple acts could support a single count
- If the indictment is based on multiple acts, the court must give an **unanimity instruction** or the People must elect which act they rely upon
- Without such an instruction, there is a risk that different jurors convicted on different acts — violating unanimity

## Application
- Most commonly arises in cases with **multiple incidents** charged in a single count
- Sexual abuse cases with repeated acts
- Larceny cases with multiple takings

## Practice Tips
- Request a specific unanimity charge whenever multiple acts could support a count
- If denied, preserve the objection for appeal
- This is a fundamental constitutional protection — errors are rarely harmless`,
    citations: ['People v. Ramos'],
    relatedEntries: ['cpl-300-jury-instructions', 'cpl-310-verdict'],
  }),

  e({
    id: 'people-v-antommarchi', slug: 'people-v-antommarchi',
    title: 'People v. Antommarchi — Right to Be Present',
    category: 'Cases',
    content: `# People v. Antommarchi, 80 N.Y.2d 247 (1992)

## Holding
A defendant has the right to be **present at all material stages** of trial, including **sidebar conferences** involving the exercise of peremptory challenges during jury selection.

## Scope of the Right
The right to be present encompasses:
- Jury selection (including sidebars)
- All trial proceedings
- Communication between judge and jury
- Readback of testimony
- Supplemental jury instructions
- Sandoval and Ventimiglia hearings

## Waiver
- The right can be **waived**, but waiver must be knowing, voluntary, and intelligent
- Defense counsel **cannot waive** the client's presence without the client's consent
- Persistent disruption by defendant may justify removal (after warning)

## Practice Tips
- Ensure client is present at **all sidebars** during jury selection
- Object immediately if proceedings occur outside client's presence
- This is a **mode of proceedings** error — reviewable on appeal even without objection
- Document any instance where client was excluded from proceedings`,
    citations: ['People v. Antommarchi, 80 N.Y.2d 247 (1992)'],
    relatedEntries: ['cpl-260-jury-trial', 'cpl-270-jury-selection'],
  }),

  e({
    id: 'people-v-cahill', slug: 'people-v-cahill',
    title: 'People v. Cahill — Standard of Appellate Review',
    category: 'Cases',
    content: `# People v. Cahill, 2 N.Y.3d 14 (2003)

## Holding
Clarified the **harmless error** standard for appellate review of constitutional errors: the People must prove **beyond a reasonable doubt** that the error did not contribute to the verdict.

## Standards of Review

### Constitutional Error
- **Harmless beyond a reasonable doubt** — People's burden
- Applied to: suppression errors, confrontation clause violations, improper jury instructions on elements

### Non-Constitutional Error
- **Significant probability** that the error affected the verdict — defendant's burden
- Applied to: evidentiary rulings, Sandoval/Molineux errors

### Weight of the Evidence
- Appellate court makes an **independent assessment** of whether the verdict was against the weight of the evidence
- Unique to New York — broader than legal sufficiency

## Practice Tips
- Frame trial errors as **constitutional** rather than evidentiary whenever possible — shifts the harmless error burden
- On appeal, argue both legal sufficiency AND weight of evidence
- Weight of evidence review is the most favorable standard for defendants`,
    citations: ['People v. Cahill, 2 N.Y.3d 14 (2003)'],
    relatedEntries: ['cpl-470-appeal-determination', 'cpl-460-appeals'],
  }),

  e({
    id: 'people-v-hicks', slug: 'people-v-hicks',
    title: 'People v. Hicks — Constructive Possession',
    category: 'Cases',
    content: `# People v. Hicks — Constructive Possession

## Holding
To establish **constructive possession**, the People must prove that the defendant exercised **dominion and control** over the property in which the contraband was found. Mere presence in the vicinity is insufficient.

## Elements of Constructive Possession
1. The defendant had **knowledge** of the contraband's presence
2. The defendant exercised **dominion and control** over the area where contraband was found

## Key Principles
- **Mere proximity** to contraband is insufficient
- Presence in a room or vehicle where drugs/weapons are found does NOT automatically establish possession
- The **automobile presumption** (PL § 265.15(3) for weapons) is an exception — but is rebuttable
- Multiple occupants of a space — possession must be attributed to the specific defendant

## Common Scenarios
- Drugs found in a shared apartment — who had access/control?
- Weapon found under a car seat with multiple passengers
- Contraband in a common area

## Practice Tips
- Challenge constructive possession by showing others had equal access
- Was the defendant merely a guest? A passenger?
- DNA/fingerprint evidence on the contraband is powerful for the People — absence of same helps the defense
- Text messages, surveillance footage showing access patterns are relevant`,
    citations: ['People v. Hicks', 'PL § 265.15(3)'],
    relatedEntries: ['pl-weapons-charges', 'pl-drug-offenses'],
  }),

  // ===== DEFENSES =====

  e({
    id: 'defense-justification', slug: 'defense-justification',
    title: 'PL § 35 — Justification (Self-Defense)',
    category: 'Strategies',
    content: `# Justification — PL Article 35

## Use of Physical Force (PL § 35.15)
A person may use **physical force** upon another when they **reasonably believe** it is necessary to defend themselves or a third person from what they reasonably believe to be the use or imminent use of unlawful physical force.

## Limitations
- **Cannot use deadly physical force** unless:
  - Reasonably believes the other person is using or about to use **deadly physical force**
  - AND has a **duty to retreat** if safe to do so (except in own dwelling — "Castle Doctrine")
- Cannot use force if **initial aggressor** (unless withdrawn from encounter and communicated withdrawal)
- Cannot use deadly force in response to non-deadly force

## Duty to Retreat
- NY has a duty to retreat before using **deadly force** — if retreat is completely safe
- **Castle Doctrine exception**: no duty to retreat in your own dwelling (unless initial aggressor)
- No duty to retreat when defending against robbery, burglary, kidnapping, or sexual assault

## Defense of Others (PL § 35.15(2))
- May use force to defend a third person under same circumstances as self-defense
- Reasonable belief standard applies

## Defense of Premises (PL § 35.20)
- May use non-deadly force to prevent trespass or criminal mischief
- May use deadly force only to prevent arson, burglary (very limited)

## Jury Instruction
- If ANY reasonable view of the evidence supports justification, the court MUST charge the jury on it — even if the defendant did not request it (*People v. Padgett*)

## Practice Tips
- Justification is a **complete defense** — results in acquittal
- The prosecution bears the burden of disproving justification beyond a reasonable doubt
- Even if justification fails, it may reduce murder to manslaughter
- Investigate the complainant's history of violence — admissible to show defendant's reasonable belief`,
    citations: ['PL § 35.15', 'PL § 35.20', 'People v. Padgett'],
    relatedEntries: ['pl-assault-degrees', 'pl-homicide'],
  }),

  e({
    id: 'defense-duress', slug: 'defense-duress',
    title: 'PL § 40.00 — Duress',
    category: 'Strategies',
    content: `# Duress — PL § 40.00

## Elements (Affirmative Defense)
A person acts under duress when they engage in proscribed conduct because they are **coerced** to do so by the use or threatened imminent use of **unlawful physical force** upon them or a third person.

## Requirements
1. The coercion must involve **unlawful physical force** (or threat thereof)
2. The threat must be of **imminent** harm
3. The force threatened must be of such nature that a **person of reasonable firmness** would be unable to resist
4. The defendant must not have **intentionally or recklessly** placed themselves in the situation

## Limitations
- **NOT a defense to murder** — duress is not available for intentional homicide
- Defendant bears the burden of proving duress by a **preponderance of the evidence** (affirmative defense)
- Economic pressure or threats to property are insufficient
- Threats must be of **physical harm**, not reputational harm or blackmail

## Practice Tips
- Duress is most commonly raised in drug courier / gang cases
- Document the specific threats and the defendant's reasonable fear
- Expert testimony on coercive control may be relevant
- Even if full duress defense fails, the circumstances may be powerful mitigation at sentencing`,
    citations: ['PL § 40.00'],
    relatedEntries: ['defense-justification', 'pl-homicide'],
  }),

  e({
    id: 'defense-entrapment', slug: 'defense-entrapment',
    title: 'PL § 40.05 — Entrapment',
    category: 'Strategies',
    content: `# Entrapment — PL § 40.05

## Elements (Affirmative Defense)
The defendant engaged in proscribed conduct because they were **induced or encouraged** to do so by a **public servant** (or person acting in cooperation with a public servant) seeking to obtain evidence for prosecution, using methods that created a **substantial risk** that the offense would be committed by a person **not otherwise disposed** to commit it.

## NY Test (Objective Standard)
- NY uses an **objective** test: Would the government's conduct have induced a **reasonable, law-abiding person** to commit the crime?
- This differs from the federal **subjective** test (which focuses on the defendant's predisposition)
- The NY standard is more favorable to defendants

## What Constitutes Entrapment
- Persistent solicitation over time
- Appeals to sympathy or friendship
- Extraordinary inducements (offering far above street value)
- Targeting vulnerable individuals

## What Does NOT Constitute Entrapment
- Providing an opportunity to commit a crime the defendant was already inclined to commit
- Undercover purchases where defendant is a willing seller
- Mere solicitation without improper inducement

## Practice Tips
- Entrapment is most common in drug sale and prostitution cases
- Gather evidence of the extent and nature of government encouragement
- The more active the government agent, the stronger the defense
- Even if entrapment fails as a legal defense, the circumstances may persuade a jury on reasonable doubt`,
    citations: ['PL § 40.05'],
    relatedEntries: ['pl-drug-offenses'],
  }),

  e({
    id: 'defense-mental-disease', slug: 'defense-mental-disease',
    title: 'CPL § 250.10 — Mental Disease or Defect Defense',
    category: 'Strategies',
    content: `# Mental Disease or Defect — PL § 40.15 / CPL § 250.10

## The Defense (PL § 40.15)
A person is **not criminally responsible** if, at the time of the conduct, as a result of **mental disease or defect**, they **lacked substantial capacity to know or appreciate** either:
1. The **nature and consequences** of such conduct; OR
2. That such conduct was **wrong**

## Notice Requirement (CPL § 250.10)
- Defense must serve written notice of intent to present psychiatric evidence **within 30 days** of not guilty plea
- Failure to provide timely notice may result in preclusion

## Burden of Proof
- **Defendant** bears the burden of proving the defense by a **preponderance of the evidence** (affirmative defense)
- This is different from most defenses where the People bear the burden

## Procedure
- Court may order psychiatric examination (CPL § 250.10(3))
- Both sides may retain expert psychiatrists
- **Battle of experts** is common — jury decides credibility

## Verdict: Not Responsible by Reason of Mental Disease or Defect
- NOT an acquittal — defendant is committed to psychiatric facility
- Court holds a hearing to determine if defendant has a dangerous mental disorder
- If found to have a dangerous mental disorder → committed to a secure facility
- Commitment can last **longer than a prison sentence** would have

## Practice Tips
- This is NOT a "get out of jail free" card — commitment can be indefinite
- Carefully evaluate whether this defense is in the client's best interest
- Consider whether the psychiatric evidence is better used for **mitigation** at sentencing rather than as a trial defense
- Extreme emotional disturbance (PL § 125.25(1)(a)) is an alternative for homicide cases
- Competency to stand trial (CPL § 730) is a separate issue`,
    citations: ['PL § 40.15', 'CPL § 250.10'],
    relatedEntries: ['pl-homicide', 'defense-justification'],
  }),

  e({
    id: 'defense-infancy', slug: 'defense-infancy',
    title: 'PL § 30.00 — Infancy Defense',
    category: 'Strategies',
    content: `# Infancy — PL § 30.00

## The Rule
- A person under **16** is not criminally responsible for conduct (with exceptions)
- A person under **18** is not criminally responsible for a **misdemeanor** (processed in Family Court as JD instead)

## Exceptions (Post-Raise the Age)
- **13-year-olds**: criminally responsible for Murder 2nd only
- **14-15-year-olds**: criminally responsible for specific serious offenses (designated felony acts)
- **16-17-year-olds**: Adolescent Offender status — cases begin in Youth Part, most removed to Family Court

## Designated Felony Acts (for 14-15 year olds)
Include: Murder 2nd, Kidnapping 1st, Arson 1st, Assault 1st, Rape 1st, Robbery 1st/2nd, Burglary 1st/2nd, certain weapon offenses

## Raise the Age Impact
- Effective 2018-2019: 16 and 17-year-olds are no longer automatically prosecuted as adults
- Youth Part of Superior Court handles initial proceedings
- Removal to Family Court is presumed for most offenses

## Practice Tips
- Always verify the client's age at time of offense
- If juvenile: explore Family Court transfer
- Raise the Age provides significant protections — argue for removal to Family Court aggressively
- YO treatment (CPL § 720) is a fallback if adult prosecution continues`,
    citations: ['PL § 30.00', 'Raise the Age (2017)'],
    relatedEntries: ['fca-article-3', 'cpl-720-youthful-offender'],
  }),

  e({
    id: 'defense-intoxication', slug: 'defense-intoxication',
    title: 'Intoxication Defense',
    category: 'Strategies',
    content: `# Intoxication as a Defense

## Voluntary Intoxication (PL § 15.25)
- **NOT a defense** to reckless or negligent crimes
- CAN negate a **specific intent** element
- Example: Too intoxicated to form the intent to steal → may negate larceny intent
- Example: Too intoxicated to form intent to kill → may reduce murder to manslaughter

## Involuntary Intoxication
- IS a complete defense if it renders the defendant unable to know the nature of their conduct or that it was wrong
- Same standard as mental disease or defect
- Rare — requires showing the intoxication was **not voluntary** (e.g., drugged without knowledge)

## Application
- Commonly raised in **assault** and **homicide** cases to negate intent
- Can reduce Murder 2nd (intent) to Manslaughter 2nd (recklessness)
- Cannot negate recklessness — "a person who is voluntarily intoxicated is held to the same standard as a sober person" for recklessness

## Practice Tips
- Intoxication evidence is most useful for **reducing the degree** of the offense rather than complete acquittal
- Gather evidence: bar receipts, witness testimony, BAC results, toxicology
- Expert testimony on the effects of substances on cognitive function
- Consider whether raising intoxication helps or hurts — admits your client was heavily intoxicated`,
    citations: ['PL § 15.25'],
    relatedEntries: ['pl-homicide', 'pl-assault-degrees'],
  }),

  e({
    id: 'defense-alibi', slug: 'defense-alibi',
    title: 'CPL § 250.20 — Alibi Defense',
    category: 'Strategies',
    content: `# Alibi — CPL § 250.20

## Notice Requirement
- Defense must serve **written notice** of alibi defense upon the People
- Must specify: the **place(s)** where defendant claims to have been at the time of the offense
- Must provide the **names, addresses, and dates of birth** of alibi witnesses (to the extent known)

## Timing
- Notice must be served **within 8 days** of arraignment (or within such time as the court directs)
- People must then disclose rebuttal witnesses

## Effect of Non-Compliance
- Failure to provide timely notice may result in **preclusion** of alibi witnesses
- Court has discretion to allow late notice in the interest of justice

## Practice Tips
- Investigate the alibi **immediately** — memories fade, evidence disappears
- Corroborate with physical evidence: receipts, surveillance footage, cell phone location data, EZ-Pass records, social media check-ins
- Prepare alibi witnesses thoroughly — they will be attacked on cross
- Remember: the People bear the burden to disprove the alibi beyond a reasonable doubt
- Even a "partial alibi" (nearby but not at the scene) can raise reasonable doubt
- Cell site location information (CSLI) can be powerful alibi evidence (*Carpenter v. United States*)`,
    citations: ['CPL § 250.20', 'Carpenter v. United States'],
    relatedEntries: ['cpl-245-discovery'],
  }),

  // ===== FAMILY LAW ADDITIONS =====

  e({
    id: 'drl-10-14-marriage', slug: 'drl-10-14-marriage',
    title: 'DRL §§ 10-14 — Marriage Requirements',
    category: 'Statutes',
    content: `# Marriage Requirements — DRL §§ 10-14

## Capacity to Marry
- Both parties must be at least **18 years old** (as of 2021 — prior law allowed 17 with parental/judicial consent)
- Must not be currently married to another person (bigamy — PL § 255.15)
- Must not be related within prohibited degrees (parent/child, siblings, etc.)
- Must have mental capacity to consent

## Marriage License (DRL § 13)
- Must obtain license from any **town or city clerk** in New York
- 24-hour waiting period after issuance (waivable by court order)
- License is valid for **60 days**
- Both parties must appear in person to apply

## Solemnization (DRL § 11)
- Must be performed by an authorized officiant (judge, clergy, mayor, etc.)
- Requires at least **one witness**
- Must include exchange of vows/declarations

## Void vs. Voidable Marriages
- **Void** (DRL § 6): incestuous marriages, bigamous marriages — no legal effect from inception
- **Voidable** (DRL § 7): under-age, mental incapacity, physical incapacity, duress, fraud — valid until annulled

## Practice Tips
- Marriage validity issues arise in divorce, immigration, and inheritance cases
- Common-law marriage is NOT recognized in NY (but marriages valid where contracted are recognized)
- Same-sex marriage fully legal since 2011 (Marriage Equality Act)`,
    citations: ['DRL § 10', 'DRL § 11', 'DRL § 13', 'DRL § 6', 'DRL § 7'],
    relatedEntries: ['drl-170-divorce-grounds'],
  }),

  e({
    id: 'drl-236b-equitable-dist', slug: 'drl-236b-equitable-dist',
    title: 'DRL § 236B — Equitable Distribution (Detailed)',
    category: 'Statutes',
    content: `# DRL § 236(B) — Equitable Distribution (Detailed Practice Guide)

## Maintenance (Spousal Support) — DRL § 236(B)(6)

### Temporary Maintenance (Pendente Lite)
Calculated by formula:
- If payor's income ≤ $228,000 (2026 cap — adjusted annually):
  - Calculate: (a) 30% of payor's income minus 20% of payee's income; AND (b) 40% of combined income minus payee's income
  - Award the **lesser** of (a) or (b)
  - Result cannot leave payor below self-support reserve ($18,000 approx.)

### Post-Divorce Maintenance
Duration based on length of marriage:
| Marriage Length | Duration Range |
|---------------|---------------|
| 0-15 years | 15-30% of marriage length |
| 15-20 years | 30-40% of marriage length |
| 20+ years | 35-50% of marriage length |

### Factors for Deviation
- Age and health of parties
- Present and future earning capacity
- Need for education/training
- Wasteful dissipation of marital property
- Transfer of assets without fair consideration
- Acts of domestic violence

## Child Support Guidelines — DRL § 240(1-b)

### Combined Parental Income (up to $163,000 cap — adjusted):
| Number of Children | Percentage |
|-------------------|------------|
| 1 child | 17% |
| 2 children | 25% |
| 3 children | 29% |
| 4 children | 31% |
| 5+ children | 35%+ |

- Applied to combined parental income; each parent pays their **pro rata share**
- Add-ons: childcare, medical insurance, educational expenses

## Counsel Fees (DRL § 237)
- Court may award interim counsel fees to the less-monied spouse
- Ensures **parity of representation**
- Apply early — fees should be requested at the outset

## Practice Tips
- Run the maintenance and child support calculations early — use the DRL guidelines calculator
- Impute income to voluntarily underemployed spouses
- Document all assets at the earliest opportunity — issue restraining notices on bank accounts
- Pendente lite applications should be filed promptly`,
    citations: ['DRL § 236(B)(6)', 'DRL § 240(1-b)', 'DRL § 237'],
    relatedEntries: ['drl-236-equitable-distribution', 'drl-240-custody'],
  }),

  e({
    id: 'drl-248-counsel-fees', slug: 'drl-248-counsel-fees',
    title: 'DRL § 237/248 — Counsel Fees in Matrimonial',
    category: 'Statutes',
    content: `# Counsel Fees in Matrimonial Actions — DRL § 237

## Overview
The court shall direct the **monied spouse** to pay counsel fees to enable the **non-monied spouse** to carry on or defend the action. There is a **rebuttable presumption** that counsel fees shall be awarded to the less monied spouse (DRL § 237(a)).

## Key Principles
- Purpose: ensure both parties have adequate legal representation
- **Rebuttable presumption** in favor of the less-monied spouse
- Court considers: financial circumstances of both parties, relative merit of positions, any dilatory or obstructive conduct
- Fees must be **reasonable**

## Interim Fees
- May be awarded at any stage of the proceeding
- Apply early — the less-monied spouse should not have to deplete assets to fund litigation
- Pendente lite motion for counsel fees is common

## DRL § 248 — Expert Fees
- Court may also award fees for **experts** (forensic accountants, appraisers, custody evaluators)
- Same standard as counsel fees — less-monied spouse

## Practice Tips
- File for interim counsel fees **at the outset** of the case
- Document all time and expenses carefully
- The monied spouse's ability to pay is the primary factor
- Even if both parties have resources, disparity in access to funds matters
- Fee applications should include detailed billing records and affirmation of services`,
    citations: ['DRL § 237', 'DRL § 248'],
    relatedEntries: ['drl-236-equitable-distribution', 'drl-170-divorce-grounds'],
  }),

  e({
    id: 'fca-article-7-pins', slug: 'fca-article-7-pins',
    title: 'FCA Article 7 — PINS (Persons in Need of Supervision)',
    category: 'Statutes',
    content: `# FCA Article 7 — PINS Proceedings

## Definition (FCA § 712)
A **Person in Need of Supervision** is a person under 18 who:
- Is habitually **truant** from school
- Is **incorrigible, ungovernable, or habitually disobedient** and beyond parental control
- Violates **curfew** ordinances
- Possesses **marijuana** (limited post-MRTA)

## Who Can File
- Parent or guardian
- School district
- Police (in limited circumstances)
- Social services

## Diversion (FCA § 735)
- Before a petition is filed, the case is referred for **diversion services**
- Diversion must be attempted for at least **60 days**
- If diversion succeeds, no petition is filed
- Only if diversion fails can a petition proceed

## Dispositional Options (FCA § 756)
- Conditional discharge
- Probation (up to 1 year)
- Placement with commissioner of social services or authorized agency (up to 12 months)
- **Detention is NOT permitted** for PINS (2019 reform)

## Practice Tips
- No secure detention for PINS — a significant 2019 reform
- Push for diversion — avoid formal proceedings
- PINS proceedings are often filed by frustrated parents — explore family dynamics
- Mental health and educational assessments should be requested
- Consider whether the child's behavior stems from unmet needs (trauma, disability)`,
    citations: ['FCA § 712', 'FCA § 735', 'FCA § 756'],
    relatedEntries: ['fca-article-3', 'fca-article-10'],
  }),

  e({
    id: 'fca-1027-1028', slug: 'fca-1027-1028',
    title: 'FCA §§ 1027/1028 — Emergency Removal & Return Hearings',
    category: 'Procedures',
    content: `# FCA §§ 1027/1028 — Emergency Removal & Return Hearings

## Overview
These sections govern emergency removal of children and hearings to determine whether removal should continue or the child should be returned.

## FCA § 1027 — Temporary Removal Without Court Order
- ACS/CPS may remove a child without a court order when there is **imminent danger** to life or health
- A hearing must be held within **24 hours** (next court day) of removal
- Court must determine if removal is necessary to avoid imminent risk

## FCA § 1028 — Application for Return of Child
- Parent/respondent may apply for return of the child at any time after removal
- Hearing must be held within **3 court days** of application
- Burden on **petitioner (ACS)** to show continued removal is necessary
- Standard: return unless there is **imminent risk** to life or health

## Key Practice Points
- 1028 hearings are critical — often the first real opportunity to get a child returned
- Challenge the "imminent risk" standard — not just any risk, must be imminent
- Present a safety plan with relatives, community supports
- Request ACS provide reasonable efforts to prevent removal (preventive services, supervision)
- Consider requesting less restrictive alternatives (e.g., release to non-respondent parent, relative placement)

## Strategic Considerations
- File 1028 application immediately upon removal
- Gather evidence of safe home environment, support network
- Cross-examine caseworker on specific imminent danger allegations
- Argue that services could mitigate risk without removal`,
    citations: ['FCA § 1027', 'FCA § 1028', 'FCA § 1024'],
    relatedEntries: ['fca-article-10', 'nicholson-v-scoppetta'],
  }),
];

export default DEFAULT_WIKI_ENTRIES;
