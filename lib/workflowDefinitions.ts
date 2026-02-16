import { WorkflowDefinition } from '@/components/WorkflowWizard';

// ─── Divorce Workflows ───────────────────────────────────────────────────────

export const divorceWorkflows: WorkflowDefinition[] = [
  {
    id: 'divorce-petition',
    title: 'Petition for Divorce / Complaint',
    description: 'Draft and file the initial divorce complaint with grounds and relief requested.',
    icon: '📋',
    documentName: 'Petition for Divorce',
    fields: [
      { name: 'petitioner', label: 'Petitioner Name', type: 'text', tooltip: 'Full legal name of the party filing for divorce.' },
      { name: 'respondent', label: 'Respondent Name', type: 'text', tooltip: 'Full legal name of the other spouse.' },
      { name: 'marriage_date', label: 'Date of Marriage', type: 'date', tooltip: 'Date the marriage was solemnized.' },
      { name: 'grounds', label: 'Grounds for Divorce', type: 'select', tooltip: 'Legal basis for the divorce petition.', options: ['No-Fault (Irretrievable Breakdown)', 'Cruel & Inhuman Treatment', 'Abandonment (1+ year)', 'Imprisonment (3+ years)', 'Adultery'] },
      { name: 'children', label: 'Minor Children', type: 'textarea', tooltip: 'Names and dates of birth of all minor children of the marriage.', proSeLabel: 'Do you have children under 18?' },
      { name: 'relief', label: 'Relief Requested', type: 'textarea', tooltip: 'Specific relief sought: equitable distribution, maintenance, custody, child support, etc.' },
      { name: 'jurisdiction', label: 'County / Jurisdiction', type: 'text', tooltip: 'County where the petition will be filed.' },
    ],
    researchSources: [
      { id: 'drl-170', title: 'DRL § 170 - Grounds for Divorce', type: 'statute', citation: 'N.Y. Dom. Rel. Law § 170', summary: 'Enumerates the grounds for divorce in New York.' },
      { id: 'drl-236', title: 'DRL § 236 - Equitable Distribution', type: 'statute', citation: 'N.Y. Dom. Rel. Law § 236(B)', summary: 'Governs equitable distribution of marital property.' },
      { id: 'wiki-divorce', title: 'NY Divorce Filing Procedures', type: 'wiki', citation: 'Assigned Co-Counsel Wiki', summary: 'Step-by-step guide to filing divorce in New York courts.' },
    ],
    mockDocumentContent: `SUPREME COURT OF THE STATE OF NEW YORK
COUNTY OF [COUNTY]
─────────────────────────────────────

[PETITIONER NAME],
                    Plaintiff,
        -against-                         Index No. ________

[RESPONDENT NAME],
                    Defendant.
─────────────────────────────────────

VERIFIED COMPLAINT FOR DIVORCE

The Plaintiff, by and through their attorney, respectfully alleges:

FIRST CAUSE OF ACTION

1. The parties were married on [DATE] in [LOCATION].

2. The Plaintiff has resided in the State of New York for a continuous period of at least two years prior to the commencement of this action.

3. The relationship between Plaintiff and Defendant has broken down irretrievably for a period of at least six months.

WHEREFORE, Plaintiff respectfully requests that this Court:
(a) Grant a Judgment of Divorce;
(b) Equitably distribute the marital property;
(c) Award maintenance as appropriate;
(d) Award such other relief as the Court deems just and proper.

Dated: [DATE]
       [COUNTY], New York

                                    ________________________
                                    Attorney for Plaintiff`,
  },
  {
    id: 'financial-disclosure',
    title: 'Financial Disclosure',
    description: 'Prepare a comprehensive Statement of Net Worth for court filing.',
    icon: '💰',
    documentName: 'Statement of Net Worth',
    fields: [
      { name: 'party_name', label: 'Party Name', type: 'text', tooltip: 'Name of the party filing this disclosure.' },
      { name: 'employer', label: 'Current Employer', type: 'text', tooltip: 'Name and address of current employer.' },
      { name: 'annual_income', label: 'Annual Gross Income', type: 'text', tooltip: 'Total annual gross income from all sources.' },
      { name: 'monthly_expenses', label: 'Monthly Expenses', type: 'text', tooltip: 'Estimated total monthly living expenses.' },
      { name: 'real_property', label: 'Real Property', type: 'textarea', tooltip: 'List all real estate owned, with addresses and estimated values.' },
      { name: 'bank_accounts', label: 'Bank Accounts', type: 'textarea', tooltip: 'List all bank accounts with institution names and balances.' },
      { name: 'debts', label: 'Debts & Liabilities', type: 'textarea', tooltip: 'List all debts: mortgages, loans, credit cards, etc.' },
    ],
    researchSources: [
      { id: 'rule-202.16', title: 'Uniform Rule 202.16', type: 'statute', citation: '22 NYCRR § 202.16', summary: 'Requires mandatory exchange of net worth statements in matrimonial actions.' },
      { id: 'wiki-networth', title: 'Statement of Net Worth Guide', type: 'wiki', citation: 'Assigned Co-Counsel Wiki', summary: 'How to prepare a complete and accurate statement of net worth.' },
    ],
    mockDocumentContent: `SUPREME COURT OF THE STATE OF NEW YORK
COUNTY OF [COUNTY]

STATEMENT OF NET WORTH

Party: [PARTY NAME]
Date: [DATE]

I. INCOME
   A. Annual Gross Income: $________
   B. Employer: ________
   C. Other Income Sources: ________

II. MONTHLY EXPENSES
   A. Housing: $________
   B. Utilities: $________
   C. Food: $________
   D. Transportation: $________
   E. Insurance: $________
   F. Total Monthly Expenses: $________

III. ASSETS
   A. Real Property: ________
   B. Bank Accounts: ________
   C. Retirement Accounts: ________
   D. Investments: ________

IV. LIABILITIES
   A. Mortgage(s): $________
   B. Credit Cards: $________
   C. Loans: $________
   D. Total Liabilities: $________

NET WORTH: $________

I affirm under penalty of perjury that the foregoing is true and correct.

________________________
[PARTY NAME]`,
  },
  {
    id: 'settlement-agreement',
    title: 'Settlement Agreement Draft',
    description: 'Draft a comprehensive settlement agreement covering all marital issues.',
    icon: '🤝',
    documentName: 'Settlement Agreement',
    fields: [
      { name: 'party1', label: 'Party 1 (Plaintiff)', type: 'text', tooltip: 'Full legal name.' },
      { name: 'party2', label: 'Party 2 (Defendant)', type: 'text', tooltip: 'Full legal name.' },
      { name: 'property_terms', label: 'Property Division Terms', type: 'textarea', tooltip: 'How marital property will be divided between the parties.' },
      { name: 'maintenance', label: 'Maintenance/Alimony Terms', type: 'textarea', tooltip: 'Spousal support amount, duration, and conditions.' },
      { name: 'custody_terms', label: 'Custody & Parenting Terms', type: 'textarea', tooltip: 'Custody arrangement, visitation schedule, decision-making.' },
      { name: 'child_support', label: 'Child Support Terms', type: 'textarea', tooltip: 'Amount, duration, and special provisions for child support.' },
    ],
    researchSources: [
      { id: 'drl-236-settle', title: 'DRL § 236(B)(3) - Agreements', type: 'statute', citation: 'N.Y. Dom. Rel. Law § 236(B)(3)', summary: 'Requirements for valid settlement agreements in divorce.' },
      { id: 'wiki-settle', title: 'Drafting Settlement Agreements', type: 'wiki', citation: 'Assigned Co-Counsel Wiki', summary: 'Best practices for comprehensive divorce settlement agreements.' },
    ],
    mockDocumentContent: `SETTLEMENT AGREEMENT AND STIPULATION

This Agreement is entered into on [DATE] between [PARTY 1] ("Wife/Husband") and [PARTY 2] ("Wife/Husband").

RECITALS
The parties were married on [DATE]. The parties desire to settle all matters arising from their marriage.

ARTICLE I - PROPERTY DIVISION
[Property division terms will be generated based on input]

ARTICLE II - MAINTENANCE
[Maintenance terms will be generated based on input]

ARTICLE III - CUSTODY AND PARENTING
[Custody terms will be generated based on input]

ARTICLE IV - CHILD SUPPORT
[Child support terms will be generated based on input]

ARTICLE V - GENERAL PROVISIONS
This Agreement shall be binding upon the parties and incorporated into the Judgment of Divorce.

IN WITNESS WHEREOF, the parties have executed this Agreement.

________________________     ________________________
[PARTY 1]                    [PARTY 2]`,
  },
  {
    id: 'temp-orders',
    title: 'Motion for Temporary Orders',
    description: 'File for temporary relief pending the final divorce judgment.',
    icon: '⚡',
    documentName: 'Motion for Temporary Orders',
    fields: [
      { name: 'movant', label: 'Moving Party', type: 'text', tooltip: 'Party requesting temporary relief.' },
      { name: 'relief_type', label: 'Type of Relief', type: 'select', tooltip: 'What temporary relief is being requested.', options: ['Temporary Maintenance', 'Temporary Custody', 'Exclusive Occupancy', 'Interim Counsel Fees', 'Multiple Relief'] },
      { name: 'urgency', label: 'Basis for Urgency', type: 'textarea', tooltip: 'Why temporary orders are needed before final resolution.' },
      { name: 'facts', label: 'Supporting Facts', type: 'textarea', tooltip: 'Key facts supporting the request for temporary relief.' },
    ],
    researchSources: [
      { id: 'drl-236-temp', title: 'DRL § 236(B)(5-a) - Temporary Maintenance', type: 'statute', citation: 'N.Y. Dom. Rel. Law § 236(B)(5-a)', summary: 'Formula and factors for temporary maintenance awards.' },
      { id: 'wiki-temp', title: 'Pendente Lite Motions Guide', type: 'wiki', citation: 'Assigned Co-Counsel Wiki', summary: 'How to draft effective motions for temporary relief in divorce.' },
    ],
    mockDocumentContent: `SUPREME COURT OF THE STATE OF NEW YORK
COUNTY OF [COUNTY]

NOTICE OF MOTION FOR TEMPORARY RELIEF

PLEASE TAKE NOTICE that upon the annexed affirmation and exhibits, the undersigned will move this Court for an Order:

1. Granting temporary [RELIEF TYPE] to [MOVANT];
2. [Specific relief requested];
3. Such other and further relief as this Court deems just and proper.

AFFIRMATION IN SUPPORT

I, [ATTORNEY NAME], an attorney admitted to practice in New York, affirm:

1. I am the attorney for the [Plaintiff/Defendant] in this action.
2. This motion is made on the grounds that [BASIS].
3. [Supporting facts and argument]

WHEREFORE, it is respectfully requested that this motion be granted.

Dated: [DATE]
                              ________________________
                              Attorney for [MOVANT]`,
  },
  {
    id: 'property-worksheet',
    title: 'Property Division Worksheet',
    description: 'Comprehensive worksheet to classify and value all marital and separate property.',
    icon: '🏠',
    documentName: 'Property Division Worksheet',
    fields: [
      { name: 'marital_home', label: 'Marital Home', type: 'textarea', tooltip: 'Address, current value, mortgage balance, date acquired.' },
      { name: 'other_real_property', label: 'Other Real Property', type: 'textarea', tooltip: 'Any other real estate owned by either or both parties.' },
      { name: 'vehicles', label: 'Vehicles', type: 'textarea', tooltip: 'Year, make, model, value, and loan balance for each vehicle.' },
      { name: 'retirement', label: 'Retirement Accounts', type: 'textarea', tooltip: '401(k), IRA, pension accounts with balances and marital portions.' },
      { name: 'separate_property', label: 'Claimed Separate Property', type: 'textarea', tooltip: 'Property claimed as separate (pre-marital, inherited, gift).' },
    ],
    researchSources: [
      { id: 'drl-236-ed', title: 'DRL § 236(B)(1)(c) - Marital Property', type: 'statute', citation: 'N.Y. Dom. Rel. Law § 236(B)(1)(c)', summary: 'Definition of marital property subject to equitable distribution.' },
      { id: 'obrien', title: "O'Brien v. O'Brien", type: 'caselaw', citation: '66 N.Y.2d 576 (1985)', summary: 'Enhanced earning capacity as marital property in equitable distribution.' },
    ],
    mockDocumentContent: `PROPERTY DIVISION WORKSHEET

Case: [CASE NAME]
Date: [DATE]

═══════════════════════════════════════
MARITAL PROPERTY
═══════════════════════════════════════

1. REAL PROPERTY
   Marital Home: ________
   Value: $________ | Mortgage: $________ | Equity: $________

2. VEHICLES
   [Vehicle details]

3. BANK ACCOUNTS
   [Account details]

4. RETIREMENT ACCOUNTS
   [Retirement details]
   Marital Portion: $________

═══════════════════════════════════════
SEPARATE PROPERTY CLAIMS
═══════════════════════════════════════

Party 1 Claims: ________
Party 2 Claims: ________

═══════════════════════════════════════
PROPOSED DIVISION
═══════════════════════════════════════

Party 1 Total: $________
Party 2 Total: $________
Equalization Payment: $________`,
  },
];

// ─── Custody Workflows ───────────────────────────────────────────────────────

export const custodyWorkflows: WorkflowDefinition[] = [
  {
    id: 'custody-petition',
    title: 'Petition for Custody/Modification',
    description: 'File an initial custody petition or request modification of existing custody orders.',
    icon: '📋',
    documentName: 'Petition for Custody',
    fields: [
      { name: 'petitioner', label: 'Petitioner Name', type: 'text', tooltip: 'Parent or guardian filing the petition.' },
      { name: 'respondent', label: 'Respondent Name', type: 'text', tooltip: 'The other parent/guardian.' },
      { name: 'children', label: 'Children (Names & DOBs)', type: 'textarea', tooltip: 'Full names and dates of birth of all children subject to the petition.' },
      { name: 'current_arrangement', label: 'Current Custody Arrangement', type: 'textarea', tooltip: 'Describe the current living and custody situation.' },
      { name: 'requested_custody', label: 'Requested Custody Arrangement', type: 'select', tooltip: 'Type of custody being requested.', options: ['Sole Legal & Physical', 'Joint Legal / Primary Physical', 'Joint Legal & Physical', 'Modification of Existing Order'] },
      { name: 'reasons', label: 'Reasons / Change in Circumstances', type: 'textarea', tooltip: 'Why custody should be granted/modified. For modifications, describe the substantial change.' },
    ],
    researchSources: [
      { id: 'drl-240', title: 'DRL § 240 - Custody Determinations', type: 'statute', citation: 'N.Y. Dom. Rel. Law § 240', summary: 'Best interests of the child standard for custody determinations.' },
      { id: 'eschbach', title: 'Eschbach v. Eschbach', type: 'caselaw', citation: '56 N.Y.2d 167 (1982)', summary: 'Factors for determining best interests in custody cases.' },
      { id: 'wiki-custody', title: 'NY Custody Filing Guide', type: 'wiki', citation: 'Assigned Co-Counsel Wiki', summary: 'Procedures for filing custody petitions in Family Court and Supreme Court.' },
    ],
    mockDocumentContent: `FAMILY COURT OF THE STATE OF NEW YORK
COUNTY OF [COUNTY]

In the Matter of a Custody/Visitation Proceeding

[PETITIONER],
                    Petitioner,         Docket No. ________
        -against-
[RESPONDENT],
                    Respondent.

PETITION FOR CUSTODY

The Petitioner respectfully alleges:

1. The Petitioner is the [mother/father] of the following child(ren):
   [CHILDREN NAMES AND DOBs]

2. The current custody arrangement is: [CURRENT ARRANGEMENT]

3. It is in the best interests of the child(ren) that custody be awarded to the Petitioner because:
   [REASONS]

WHEREFORE, Petitioner requests an Order of this Court awarding [CUSTODY TYPE] to the Petitioner.

Dated: [DATE]
                              ________________________
                              [PETITIONER / Attorney]`,
  },
  {
    id: 'parenting-plan',
    title: 'Parenting Plan Draft',
    description: 'Create a detailed parenting plan with schedules, holidays, and decision-making provisions.',
    icon: '📅',
    documentName: 'Parenting Plan',
    fields: [
      { name: 'parent1', label: 'Parent 1', type: 'text', tooltip: 'Name of first parent.' },
      { name: 'parent2', label: 'Parent 2', type: 'text', tooltip: 'Name of second parent.' },
      { name: 'regular_schedule', label: 'Regular Schedule', type: 'textarea', tooltip: 'Weekday and weekend schedule for regular periods.', proSeLabel: 'What schedule works best for you and the kids?' },
      { name: 'holidays', label: 'Holiday Schedule', type: 'textarea', tooltip: 'How holidays, school breaks, and special occasions will be shared.' },
      { name: 'decision_making', label: 'Decision-Making Authority', type: 'select', tooltip: 'How major decisions (education, health, religion) will be made.', options: ['Joint Decision-Making', 'Parent 1 Final Say', 'Parent 2 Final Say', 'Split by Category'] },
      { name: 'communication', label: 'Communication Rules', type: 'textarea', tooltip: 'How parents will communicate and how children will contact the other parent.' },
    ],
    researchSources: [
      { id: 'wiki-parenting', title: 'Effective Parenting Plans', type: 'wiki', citation: 'Assigned Co-Counsel Wiki', summary: 'Components of a comprehensive parenting plan.' },
      { id: 'braiman', title: 'Braiman v. Braiman', type: 'caselaw', citation: '44 N.Y.2d 584 (1978)', summary: 'Joint custody requires ability of parents to cooperate.' },
    ],
    mockDocumentContent: `PARENTING PLAN

Between [PARENT 1] and [PARENT 2]
Regarding: [CHILDREN]
Date: [DATE]

I. REGULAR SCHEDULE
[Schedule details]

II. HOLIDAY SCHEDULE
[Holiday rotation details]

III. DECISION-MAKING
[Decision-making provisions]

IV. COMMUNICATION
[Communication rules]

V. TRANSPORTATION
[Exchange logistics]

VI. MODIFICATION
This plan may be modified by written agreement of both parents or by court order.

________________________     ________________________
[PARENT 1]                   [PARENT 2]`,
  },
  {
    id: 'temp-custody',
    title: 'Motion for Temporary Custody',
    description: 'Request emergency or temporary custody pending final determination.',
    icon: '⚡',
    documentName: 'Motion for Temporary Custody',
    fields: [
      { name: 'movant', label: 'Moving Party', type: 'text', tooltip: 'Parent requesting temporary custody.' },
      { name: 'emergency', label: 'Is this an emergency?', type: 'select', tooltip: 'Emergency applications have different procedural requirements.', options: ['Yes - Immediate Risk to Child', 'No - Standard Temporary Application'] },
      { name: 'basis', label: 'Basis for Request', type: 'textarea', tooltip: 'Facts demonstrating why temporary custody is needed.' },
      { name: 'current_status', label: 'Current Status of Children', type: 'textarea', tooltip: 'Where children are currently living and with whom.' },
    ],
    researchSources: [
      { id: 'fca-1027', title: 'FCA § 1027 - Temporary Removal', type: 'statute', citation: 'N.Y. Fam. Ct. Act § 1027', summary: 'Standards for temporary removal of children.' },
      { id: 'wiki-emergency', title: 'Emergency Custody Motions', type: 'wiki', citation: 'Assigned Co-Counsel Wiki', summary: 'How to file for emergency temporary custody in New York.' },
    ],
    mockDocumentContent: `FAMILY COURT OF THE STATE OF NEW YORK
COUNTY OF [COUNTY]

ORDER TO SHOW CAUSE FOR TEMPORARY CUSTODY

Upon the annexed petition and affidavit of [MOVANT], it is hereby ORDERED that [RESPONDENT] show cause before this Court on [DATE] why an Order should not be made:

1. Granting temporary custody of the minor child(ren) to [MOVANT];
2. [Additional relief];
3. Pending hearing, the child(ren) shall remain with [MOVANT].

AFFIDAVIT IN SUPPORT
[Supporting facts]

Dated: [DATE]
                              ________________________
                              Judge, Family Court`,
  },
  {
    id: 'best-interests',
    title: 'Best Interests Analysis',
    description: 'Document comprehensive best interests analysis for custody proceedings.',
    icon: '⚖️',
    documentName: 'Best Interests Analysis',
    fields: [
      { name: 'stability', label: 'Home Stability', type: 'textarea', tooltip: 'Each parent\'s living situation, stability of home environment.' },
      { name: 'relationship', label: 'Parent-Child Relationships', type: 'textarea', tooltip: 'Quality of each parent\'s relationship with the children.' },
      { name: 'cooperation', label: 'Willingness to Cooperate', type: 'textarea', tooltip: 'Each parent\'s willingness to foster the other parent\'s relationship.' },
      { name: 'fitness', label: 'Parental Fitness', type: 'textarea', tooltip: 'Mental health, substance abuse, domestic violence, or other fitness concerns.' },
      { name: 'child_preference', label: 'Child\'s Preference', type: 'textarea', tooltip: 'If age-appropriate, the child\'s stated preference and reasoning.' },
    ],
    researchSources: [
      { id: 'eschbach-2', title: 'Eschbach v. Eschbach', type: 'caselaw', citation: '56 N.Y.2d 167 (1982)', summary: 'Comprehensive list of best interests factors.' },
      { id: 'friederwitzer', title: 'Friederwitzer v. Friederwitzer', type: 'caselaw', citation: '55 N.Y.2d 89 (1982)', summary: 'No one factor is determinative in best interests analysis.' },
    ],
    mockDocumentContent: `BEST INTERESTS ANALYSIS MEMORANDUM

Case: [CASE NAME]
Date: [DATE]
Prepared by: [ATTORNEY]

I. OVERVIEW OF FACTORS (Eschbach v. Eschbach)

A. Quality of Home Environment
[Analysis]

B. Parent-Child Relationship
[Analysis]

C. Willingness to Foster Relationship with Other Parent
[Analysis]

D. Parental Fitness
[Analysis]

E. Child's Preference (if applicable)
[Analysis]

F. Domestic Violence History
[Analysis]

II. RECOMMENDATION
Based on the foregoing analysis, it is in the best interests of the child(ren) that [RECOMMENDATION].`,
  },
  {
    id: 'gal-report',
    title: 'Guardian ad Litem Report Template',
    description: 'Template for GAL investigation reports in custody proceedings.',
    icon: '🛡️',
    documentName: 'Guardian ad Litem Report',
    fields: [
      { name: 'gal_name', label: 'GAL Name', type: 'text', tooltip: 'Name of the appointed Guardian ad Litem.' },
      { name: 'appointment_date', label: 'Date of Appointment', type: 'date', tooltip: 'Date the GAL was appointed by the court.' },
      { name: 'interviews', label: 'Interviews Conducted', type: 'textarea', tooltip: 'List all parties, children, and collateral contacts interviewed.' },
      { name: 'observations', label: 'Home Visit Observations', type: 'textarea', tooltip: 'Observations from home visits to each parent.' },
    ],
    researchSources: [
      { id: 'wiki-gal', title: 'GAL Responsibilities in NY', type: 'wiki', citation: 'Assigned Co-Counsel Wiki', summary: 'Role and reporting obligations of Guardians ad Litem.' },
    ],
    mockDocumentContent: `GUARDIAN AD LITEM REPORT

Court: Family Court, [COUNTY] County
Case: [CASE NAME]
GAL: [GAL NAME]
Date of Appointment: [DATE]
Date of Report: [DATE]

I. BACKGROUND
[Case background]

II. INVESTIGATION
A. Interviews Conducted: [LIST]
B. Documents Reviewed: [LIST]
C. Home Visits: [OBSERVATIONS]

III. FINDINGS
[Detailed findings]

IV. RECOMMENDATION
[GAL's recommendation regarding custody]

Respectfully submitted,
________________________
[GAL NAME]
Guardian ad Litem`,
  },
];

// ─── Criminal Workflows ──────────────────────────────────────────────────────

export const criminalWorkflows: WorkflowDefinition[] = [
  {
    id: 'motion-suppress',
    title: 'Motion to Suppress (4th Amendment)',
    description: 'Challenge evidence obtained through unlawful search or seizure.',
    icon: '🔒',
    documentName: 'Motion to Suppress',
    fields: [
      { name: 'defendant', label: 'Defendant Name', type: 'text', tooltip: 'Full legal name of the defendant.' },
      { name: 'charges', label: 'Charges', type: 'textarea', tooltip: 'Current charges against the defendant.' },
      { name: 'evidence', label: 'Evidence to Suppress', type: 'textarea', tooltip: 'Specific evidence sought to be suppressed.' },
      { name: 'search_details', label: 'Search/Seizure Details', type: 'textarea', tooltip: 'When, where, and how the search/seizure occurred.' },
      { name: 'warrant', label: 'Warrant Status', type: 'select', tooltip: 'Was a warrant obtained?', options: ['No Warrant', 'Defective Warrant', 'Warrant Exceeded Scope', 'Consent (Involuntary)'] },
      { name: 'basis', label: 'Constitutional Basis', type: 'textarea', tooltip: 'Why the search/seizure violated the 4th Amendment.' },
    ],
    researchSources: [
      { id: 'cpl-710', title: 'CPL § 710 - Motion to Suppress', type: 'statute', citation: 'N.Y. Crim. Proc. Law § 710.20', summary: 'Statutory basis for suppression motions in New York.' },
      { id: 'mapp', title: 'Mapp v. Ohio', type: 'caselaw', citation: '367 U.S. 643 (1961)', summary: 'Exclusionary rule applies to states through 14th Amendment.' },
      { id: 'terry', title: 'Terry v. Ohio', type: 'caselaw', citation: '392 U.S. 1 (1968)', summary: 'Stop and frisk standards; reasonable suspicion requirement.' },
    ],
    mockDocumentContent: `[COURT NAME]
COUNTY OF [COUNTY]

THE PEOPLE OF THE STATE OF NEW YORK
        -against-                         Ind. No. ________

[DEFENDANT],
                    Defendant.

NOTICE OF MOTION AND MOTION TO SUPPRESS PHYSICAL EVIDENCE

Defendant, by counsel, respectfully moves this Court for an Order suppressing the physical evidence seized on [DATE] on the grounds that said evidence was obtained in violation of Defendant's rights under the Fourth and Fourteenth Amendments.

MEMORANDUM OF LAW

I. STATEMENT OF FACTS
[Facts of the search/seizure]

II. ARGUMENT
The evidence must be suppressed because [BASIS].

Under Mapp v. Ohio, 367 U.S. 643 (1961), evidence obtained in violation of the Fourth Amendment must be excluded.

III. CONCLUSION
For the foregoing reasons, Defendant's motion to suppress should be granted.

Dated: [DATE]
                              ________________________
                              Attorney for Defendant`,
  },
  {
    id: 'motion-dismiss',
    title: 'Motion to Dismiss',
    description: 'Move to dismiss charges on legal or factual grounds.',
    icon: '❌',
    documentName: 'Motion to Dismiss',
    fields: [
      { name: 'defendant', label: 'Defendant Name', type: 'text', tooltip: 'Full legal name of the defendant.' },
      { name: 'charges', label: 'Charges', type: 'textarea', tooltip: 'Charges sought to be dismissed.' },
      { name: 'grounds', label: 'Grounds for Dismissal', type: 'select', tooltip: 'Legal basis for the motion.', options: ['Insufficient Evidence', 'Speedy Trial Violation (CPL 30.30)', 'Defective Indictment', 'Interest of Justice', 'Statute of Limitations'] },
      { name: 'argument', label: 'Supporting Argument', type: 'textarea', tooltip: 'Detailed argument supporting dismissal.' },
    ],
    researchSources: [
      { id: 'cpl-170', title: 'CPL § 170.30/210.20 - Dismissal', type: 'statute', citation: 'N.Y. Crim. Proc. Law §§ 170.30, 210.20', summary: 'Grounds for dismissal of accusatory instruments and indictments.' },
      { id: 'cpl-30', title: 'CPL § 30.30 - Speedy Trial', type: 'statute', citation: 'N.Y. Crim. Proc. Law § 30.30', summary: 'Speedy trial time limits for different offense levels.' },
    ],
    mockDocumentContent: `[COURT NAME]

MOTION TO DISMISS

Defendant moves to dismiss the charges on the grounds of [GROUNDS].

ARGUMENT
[Supporting argument]

CONCLUSION
The charges should be dismissed.`,
  },
  {
    id: 'bail-application',
    title: 'Bail Application',
    description: 'Prepare a compelling bail application with supporting documentation.',
    icon: '⚖️',
    documentName: 'Bail Application',
    fields: [
      { name: 'defendant', label: 'Defendant Name', type: 'text', tooltip: 'Full legal name.' },
      { name: 'charges', label: 'Current Charges', type: 'textarea', tooltip: 'All pending charges.' },
      { name: 'ties', label: 'Community Ties', type: 'textarea', tooltip: 'Employment, family, residence, community involvement.', proSeLabel: 'Why should you be released? (job, family, etc.)' },
      { name: 'criminal_history', label: 'Criminal History', type: 'textarea', tooltip: 'Prior record, if any. Note any prior FTAs.' },
      { name: 'proposed_conditions', label: 'Proposed Conditions', type: 'textarea', tooltip: 'Suggested release conditions: electronic monitoring, curfew, etc.' },
    ],
    researchSources: [
      { id: 'cpl-510', title: 'CPL § 510 - Bail Reform', type: 'statute', citation: 'N.Y. Crim. Proc. Law § 510.10', summary: 'New York bail reform provisions and qualifying offenses.' },
      { id: 'wiki-bail', title: 'NY Bail Reform Guide', type: 'wiki', citation: 'Assigned Co-Counsel Wiki', summary: 'Understanding bail-eligible vs. non-bail-eligible offenses after reform.' },
    ],
    mockDocumentContent: `BAIL APPLICATION

Defendant [NAME] respectfully requests release under the following conditions:

COMMUNITY TIES
[Details]

PROPOSED CONDITIONS
[Conditions]

The defendant poses no flight risk and is not a danger to the community.`,
  },
  {
    id: 'plea-memo',
    title: 'Plea Negotiation Memo',
    description: 'Internal memo analyzing plea options and negotiation strategy.',
    icon: '📝',
    documentName: 'Plea Negotiation Memorandum',
    fields: [
      { name: 'defendant', label: 'Defendant', type: 'text', tooltip: 'Defendant name.' },
      { name: 'charges', label: 'Current Charges & Exposure', type: 'textarea', tooltip: 'All charges with maximum possible sentences.' },
      { name: 'offer', label: 'Current Plea Offer', type: 'textarea', tooltip: 'The prosecution\'s current offer.' },
      { name: 'strengths', label: 'Case Strengths', type: 'textarea', tooltip: 'Strengths of the defense case.' },
      { name: 'weaknesses', label: 'Case Weaknesses', type: 'textarea', tooltip: 'Weaknesses and risks at trial.' },
      { name: 'recommendation', label: 'Recommendation', type: 'textarea', tooltip: 'Attorney\'s recommendation and reasoning.' },
    ],
    researchSources: [
      { id: 'wiki-plea', title: 'Plea Negotiation Strategies', type: 'wiki', citation: 'Assigned Co-Counsel Wiki', summary: 'Framework for evaluating and negotiating plea deals.' },
    ],
    mockDocumentContent: `CONFIDENTIAL - ATTORNEY WORK PRODUCT

PLEA NEGOTIATION MEMORANDUM

Client: [DEFENDANT]
Charges: [CHARGES]
Date: [DATE]

I. CURRENT OFFER
[Offer details]

II. EXPOSURE AT TRIAL
[Maximum sentences]

III. CASE ANALYSIS
Strengths: [Analysis]
Weaknesses: [Analysis]

IV. RECOMMENDATION
[Recommendation]`,
  },
  {
    id: 'sentencing-memo',
    title: 'Sentencing Memorandum',
    description: 'Comprehensive sentencing memorandum advocating for appropriate sentence.',
    icon: '📊',
    documentName: 'Sentencing Memorandum',
    fields: [
      { name: 'defendant', label: 'Defendant', type: 'text', tooltip: 'Defendant name.' },
      { name: 'conviction', label: 'Conviction(s)', type: 'textarea', tooltip: 'Offenses of conviction.' },
      { name: 'background', label: 'Personal Background', type: 'textarea', tooltip: 'Education, employment, family, mental health, substance abuse history.' },
      { name: 'mitigating', label: 'Mitigating Factors', type: 'textarea', tooltip: 'All mitigating circumstances.' },
      { name: 'requested_sentence', label: 'Requested Sentence', type: 'textarea', tooltip: 'The specific sentence being requested and why.' },
    ],
    researchSources: [
      { id: 'pl-70', title: 'Penal Law § 70 - Sentencing', type: 'statute', citation: 'N.Y. Penal Law § 70.00 et seq.', summary: 'Authorized sentences for different felony and misdemeanor classes.' },
      { id: 'wiki-sentencing', title: 'Effective Sentencing Advocacy', type: 'wiki', citation: 'Assigned Co-Counsel Wiki', summary: 'Best practices for sentencing memoranda and mitigation.' },
    ],
    mockDocumentContent: `SENTENCING MEMORANDUM

Defendant [NAME] respectfully submits this memorandum in advance of sentencing on [DATE].

I. PERSONAL HISTORY
[Background]

II. MITIGATING FACTORS
[Mitigating circumstances]

III. REQUESTED SENTENCE
[Requested sentence and justification]

Respectfully submitted.`,
  },
];

// ─── Estate Planning Workflows ───────────────────────────────────────────────

export const estatePlanningWorkflows: WorkflowDefinition[] = [
  {
    id: 'will',
    title: 'Last Will & Testament',
    description: 'Draft a comprehensive last will and testament.',
    icon: '📜',
    documentName: 'Last Will & Testament',
    fields: [
      { name: 'testator', label: 'Testator Name', type: 'text', tooltip: 'Full legal name of the person making the will.', proSeLabel: 'Your full legal name' },
      { name: 'domicile', label: 'County of Domicile', type: 'text', tooltip: 'County and state of legal residence.' },
      { name: 'executor', label: 'Executor', type: 'text', tooltip: 'Person appointed to carry out the will\'s instructions.' },
      { name: 'alternate_executor', label: 'Alternate Executor', type: 'text', tooltip: 'Backup executor if the primary cannot serve.' },
      { name: 'beneficiaries', label: 'Beneficiaries & Bequests', type: 'textarea', tooltip: 'List each beneficiary and what they receive.', proSeLabel: 'Who gets what? List each person and what you want them to have.' },
      { name: 'residuary', label: 'Residuary Estate', type: 'textarea', tooltip: 'Who receives everything not specifically bequeathed.' },
      { name: 'guardian', label: 'Guardian for Minor Children', type: 'text', tooltip: 'If you have minor children, who should be their guardian.' },
    ],
    researchSources: [
      { id: 'eptl-3', title: 'EPTL § 3-2.1 - Execution of Wills', type: 'statute', citation: 'N.Y. Est. Powers & Trusts Law § 3-2.1', summary: 'Requirements for valid execution of a will in New York.' },
      { id: 'wiki-will', title: 'Drafting NY Wills', type: 'wiki', citation: 'Assigned Co-Counsel Wiki', summary: 'Best practices for drafting wills compliant with New York law.' },
    ],
    mockDocumentContent: `LAST WILL AND TESTAMENT OF [TESTATOR]

I, [TESTATOR], of [COUNTY], New York, being of sound mind, declare this to be my Last Will and Testament, revoking all prior wills.

ARTICLE I - DEBTS AND EXPENSES
I direct my Executor to pay all legally enforceable debts and funeral expenses.

ARTICLE II - SPECIFIC BEQUESTS
[Bequests]

ARTICLE III - RESIDUARY ESTATE
I give the residue of my estate to [RESIDUARY BENEFICIARY].

ARTICLE IV - EXECUTOR
I appoint [EXECUTOR] as Executor. If unable to serve, I appoint [ALTERNATE].

ARTICLE V - GUARDIAN
I appoint [GUARDIAN] as guardian of my minor children.

IN WITNESS WHEREOF, I have signed this Will on [DATE].

________________________
[TESTATOR]

ATTESTATION CLAUSE
[Witness attestation]`,
  },
  {
    id: 'trust',
    title: 'Revocable Living Trust',
    description: 'Create a revocable living trust for probate avoidance and asset management.',
    icon: '🏦',
    documentName: 'Revocable Living Trust',
    fields: [
      { name: 'grantor', label: 'Grantor/Settlor', type: 'text', tooltip: 'Person creating the trust.' },
      { name: 'trustee', label: 'Trustee', type: 'text', tooltip: 'Person or institution managing the trust (often the grantor initially).' },
      { name: 'successor_trustee', label: 'Successor Trustee', type: 'text', tooltip: 'Who takes over if the trustee cannot serve.' },
      { name: 'beneficiaries', label: 'Beneficiaries', type: 'textarea', tooltip: 'Who benefits from the trust and how distributions are made.' },
      { name: 'assets', label: 'Trust Assets', type: 'textarea', tooltip: 'Assets to be transferred into the trust.' },
    ],
    researchSources: [
      { id: 'eptl-7', title: 'EPTL § 7-1.16 - Revocable Trusts', type: 'statute', citation: 'N.Y. Est. Powers & Trusts Law § 7-1.16', summary: 'Provisions governing revocable trusts in New York.' },
      { id: 'wiki-trust', title: 'Revocable Trust Planning', type: 'wiki', citation: 'Assigned Co-Counsel Wiki', summary: 'When and how to use revocable living trusts in NY estate planning.' },
    ],
    mockDocumentContent: `REVOCABLE LIVING TRUST AGREEMENT

This Trust Agreement is made on [DATE] by [GRANTOR] ("Grantor") who is also the initial Trustee.

ARTICLE I - TRUST PROPERTY
The Grantor transfers the property listed in Schedule A to the Trustee.

ARTICLE II - DURING GRANTOR'S LIFETIME
The Trustee shall manage and distribute trust income and principal for the Grantor's benefit.

ARTICLE III - UPON GRANTOR'S INCAPACITY
The Successor Trustee shall manage the trust for the Grantor's benefit.

ARTICLE IV - UPON GRANTOR'S DEATH
[Distribution provisions]

ARTICLE V - TRUSTEE PROVISIONS
[Trustee powers and compensation]

Executed on [DATE].
________________________
[GRANTOR/TRUSTEE]`,
  },
  {
    id: 'poa',
    title: 'Power of Attorney',
    description: 'Draft a statutory short form power of attorney for financial matters.',
    icon: '✍️',
    documentName: 'Power of Attorney',
    fields: [
      { name: 'principal', label: 'Principal', type: 'text', tooltip: 'Person granting the power of attorney.', proSeLabel: 'Your full name' },
      { name: 'agent', label: 'Agent', type: 'text', tooltip: 'Person being given authority to act.', proSeLabel: 'Who do you trust to handle your finances?' },
      { name: 'alternate_agent', label: 'Alternate Agent', type: 'text', tooltip: 'Backup agent if primary cannot serve.' },
      { name: 'powers', label: 'Powers Granted', type: 'textarea', tooltip: 'Specific powers or "all powers" under GOL § 5-1502.' },
      { name: 'effective', label: 'When Effective', type: 'select', tooltip: 'Immediately or only upon incapacity (springing).', options: ['Immediately', 'Upon Incapacity (Springing)'] },
    ],
    researchSources: [
      { id: 'gol-5-1501', title: 'GOL § 5-1501 - Power of Attorney', type: 'statute', citation: 'N.Y. Gen. Oblig. Law § 5-1501 et seq.', summary: 'New York statutory short form power of attorney requirements.' },
    ],
    mockDocumentContent: `STATUTORY SHORT FORM POWER OF ATTORNEY
NEW YORK GENERAL OBLIGATIONS LAW § 5-1501

CAUTION: This is an important legal document.

I, [PRINCIPAL], hereby appoint [AGENT] as my agent (attorney-in-fact).

[Powers granted]

This Power of Attorney is effective [immediately / upon incapacity].

________________________     Date: ________
[PRINCIPAL]

ACKNOWLEDGMENT
[Notarization]`,
  },
  {
    id: 'healthcare-proxy',
    title: 'Healthcare Proxy / Living Will',
    description: 'Designate a healthcare agent and document end-of-life wishes.',
    icon: '🏥',
    documentName: 'Healthcare Proxy',
    fields: [
      { name: 'principal', label: 'Principal', type: 'text', tooltip: 'Person creating the healthcare proxy.' },
      { name: 'agent', label: 'Healthcare Agent', type: 'text', tooltip: 'Person authorized to make healthcare decisions.' },
      { name: 'alternate', label: 'Alternate Agent', type: 'text', tooltip: 'Backup healthcare agent.' },
      { name: 'instructions', label: 'Special Instructions', type: 'textarea', tooltip: 'Any specific wishes regarding treatment, life-sustaining measures, etc.' },
    ],
    researchSources: [
      { id: 'phl-2981', title: 'PHL § 2981 - Healthcare Proxy', type: 'statute', citation: 'N.Y. Pub. Health Law § 2981', summary: 'Requirements for valid healthcare proxy in New York.' },
    ],
    mockDocumentContent: `NEW YORK HEALTH CARE PROXY

I, [PRINCIPAL], hereby appoint [AGENT] as my health care agent.

INSTRUCTIONS:
[Special instructions]

If my agent is unable to act, I appoint [ALTERNATE] as alternate agent.

________________________     Date: ________
[PRINCIPAL]

WITNESSES:
1. ________________________
2. ________________________`,
  },
  {
    id: 'beneficiary-review',
    title: 'Beneficiary Designation Review',
    description: 'Audit and update beneficiary designations across all accounts.',
    icon: '📋',
    documentName: 'Beneficiary Designation Review',
    fields: [
      { name: 'client', label: 'Client Name', type: 'text', tooltip: 'Name of the client.' },
      { name: 'life_insurance', label: 'Life Insurance Policies', type: 'textarea', tooltip: 'Policy numbers, companies, current beneficiaries.' },
      { name: 'retirement', label: 'Retirement Accounts', type: 'textarea', tooltip: '401(k), IRA, pension - current beneficiary designations.' },
      { name: 'bank_accounts', label: 'POD/TOD Accounts', type: 'textarea', tooltip: 'Payable-on-death or transfer-on-death designations.' },
      { name: 'recommendations', label: 'Recommended Changes', type: 'textarea', tooltip: 'Changes needed to align with estate plan.' },
    ],
    researchSources: [
      { id: 'wiki-bene', title: 'Beneficiary Designation Planning', type: 'wiki', citation: 'Assigned Co-Counsel Wiki', summary: 'Coordinating beneficiary designations with overall estate plan.' },
    ],
    mockDocumentContent: `BENEFICIARY DESIGNATION REVIEW

Client: [CLIENT]
Date: [DATE]

ACCOUNT REVIEW

1. Life Insurance
   [Policy details and current beneficiaries]

2. Retirement Accounts
   [Account details and current beneficiaries]

3. POD/TOD Accounts
   [Account details]

RECOMMENDATIONS
[Recommended changes to align with estate plan]

ACTION ITEMS
☐ Update [specific accounts]
☐ Confirm changes with [institutions]`,
  },
];

// ─── Prenup Workflows ────────────────────────────────────────────────────────

export const prenupWorkflows: WorkflowDefinition[] = [
  {
    id: 'prenup-agreement',
    title: 'Pre-Nuptial Agreement',
    description: 'Draft a comprehensive prenuptial agreement.',
    icon: '💍',
    documentName: 'Pre-Nuptial Agreement',
    fields: [
      { name: 'party1', label: 'Party 1 (Prospective Spouse)', type: 'text', tooltip: 'Full legal name.' },
      { name: 'party2', label: 'Party 2 (Prospective Spouse)', type: 'text', tooltip: 'Full legal name.' },
      { name: 'wedding_date', label: 'Anticipated Wedding Date', type: 'date', tooltip: 'Planned date of marriage.' },
      { name: 'key_provisions', label: 'Key Provisions', type: 'textarea', tooltip: 'Main items to address: separate property, income treatment, inheritance, etc.' },
      { name: 'spousal_support', label: 'Spousal Support Terms', type: 'textarea', tooltip: 'Whether maintenance/alimony is waived, limited, or follows a formula.' },
    ],
    researchSources: [
      { id: 'drl-236-prenup', title: 'DRL § 236(B)(3) - Prenuptial Agreements', type: 'statute', citation: 'N.Y. Dom. Rel. Law § 236(B)(3)', summary: 'Requirements for valid prenuptial agreements in New York.' },
      { id: 'bloomfield', title: 'Bloomfield v. Bloomfield', type: 'caselaw', citation: '97 N.Y.2d 188 (2001)', summary: 'Standards for enforceability of prenuptial agreements.' },
    ],
    mockDocumentContent: `PRE-NUPTIAL AGREEMENT

This Agreement is entered into on [DATE] between [PARTY 1] and [PARTY 2] in contemplation of their marriage.

RECITALS
The parties intend to marry on or about [WEDDING DATE] and wish to define their respective property rights.

ARTICLE I - SEPARATE PROPERTY
[Separate property provisions]

ARTICLE II - MARITAL PROPERTY
[Treatment of property acquired during marriage]

ARTICLE III - SPOUSAL SUPPORT
[Maintenance provisions]

ARTICLE IV - DISCLOSURE
Each party has made full financial disclosure as set forth in the attached schedules.

IN WITNESS WHEREOF:
________________________     ________________________
[PARTY 1]                    [PARTY 2]`,
  },
  {
    id: 'asset-disclosure',
    title: 'Asset Disclosure Schedule',
    description: 'Comprehensive asset disclosure required for a valid prenuptial agreement.',
    icon: '💰',
    documentName: 'Asset Disclosure Schedule',
    fields: [
      { name: 'party', label: 'Disclosing Party', type: 'text', tooltip: 'Name of the party making disclosure.' },
      { name: 'real_property', label: 'Real Property', type: 'textarea', tooltip: 'All real estate owned with addresses and values.' },
      { name: 'accounts', label: 'Financial Accounts', type: 'textarea', tooltip: 'Bank, investment, and retirement accounts with balances.' },
      { name: 'business', label: 'Business Interests', type: 'textarea', tooltip: 'Any ownership interests in businesses.' },
      { name: 'other_assets', label: 'Other Valuable Assets', type: 'textarea', tooltip: 'Vehicles, art, jewelry, collectibles, etc.' },
    ],
    researchSources: [
      { id: 'wiki-disclosure', title: 'Prenup Disclosure Requirements', type: 'wiki', citation: 'Assigned Co-Counsel Wiki', summary: 'What must be disclosed for a prenup to be enforceable.' },
    ],
    mockDocumentContent: `SCHEDULE A - ASSET DISCLOSURE

Party: [PARTY NAME]
Date: [DATE]

I. REAL PROPERTY
[Real property listing]

II. FINANCIAL ACCOUNTS
[Account listing]

III. BUSINESS INTERESTS
[Business details]

IV. OTHER ASSETS
[Other assets]

TOTAL ESTIMATED NET WORTH: $________

I affirm under penalty of perjury that this disclosure is complete and accurate.

________________________
[PARTY NAME]`,
  },
  {
    id: 'debt-disclosure',
    title: 'Debt Disclosure Schedule',
    description: 'Full disclosure of debts and liabilities for prenuptial agreement.',
    icon: '📊',
    documentName: 'Debt Disclosure Schedule',
    fields: [
      { name: 'party', label: 'Disclosing Party', type: 'text', tooltip: 'Name of the party making disclosure.' },
      { name: 'mortgages', label: 'Mortgages', type: 'textarea', tooltip: 'All mortgage obligations with balances.' },
      { name: 'student_loans', label: 'Student Loans', type: 'textarea', tooltip: 'Student loan balances and lenders.' },
      { name: 'credit_cards', label: 'Credit Card Debt', type: 'textarea', tooltip: 'All credit card balances.' },
      { name: 'other_debts', label: 'Other Debts', type: 'textarea', tooltip: 'Any other debts: personal loans, tax obligations, etc.' },
    ],
    researchSources: [
      { id: 'wiki-debt', title: 'Debt in Prenuptial Agreements', type: 'wiki', citation: 'Assigned Co-Counsel Wiki', summary: 'How to address pre-existing debt in prenuptial agreements.' },
    ],
    mockDocumentContent: `SCHEDULE B - DEBT DISCLOSURE

Party: [PARTY NAME]
Date: [DATE]

I. MORTGAGES: $________
II. STUDENT LOANS: $________
III. CREDIT CARDS: $________
IV. OTHER DEBTS: $________

TOTAL LIABILITIES: $________

________________________
[PARTY NAME]`,
  },
  {
    id: 'property-classification',
    title: 'Property Classification Worksheet',
    description: 'Classify assets as separate or marital property under the prenuptial agreement.',
    icon: '🏠',
    documentName: 'Property Classification Worksheet',
    fields: [
      { name: 'party1_separate', label: 'Party 1 Separate Property', type: 'textarea', tooltip: 'Assets that will remain Party 1\'s separate property during marriage.' },
      { name: 'party2_separate', label: 'Party 2 Separate Property', type: 'textarea', tooltip: 'Assets that will remain Party 2\'s separate property during marriage.' },
      { name: 'joint_property', label: 'Joint/Marital Property Rules', type: 'textarea', tooltip: 'How property acquired during marriage will be classified.' },
      { name: 'income_treatment', label: 'Income Treatment', type: 'select', tooltip: 'How each party\'s income during marriage will be treated.', options: ['All Income is Marital', 'Income Remains Separate', 'Hybrid (Contributions to Joint + Remainder Separate)'] },
    ],
    researchSources: [
      { id: 'drl-236-sp', title: 'DRL § 236(B)(1)(d) - Separate Property', type: 'statute', citation: 'N.Y. Dom. Rel. Law § 236(B)(1)(d)', summary: 'Definition of separate property in New York.' },
    ],
    mockDocumentContent: `PROPERTY CLASSIFICATION WORKSHEET

PARTY 1 SEPARATE PROPERTY:
[Listing]

PARTY 2 SEPARATE PROPERTY:
[Listing]

JOINT PROPERTY RULES:
[Rules for property acquired during marriage]

INCOME TREATMENT:
[How income is classified]`,
  },
  {
    id: 'spousal-support-terms',
    title: 'Spousal Support Waiver/Terms',
    description: 'Define spousal support terms or waivers in the prenuptial agreement.',
    icon: '📝',
    documentName: 'Spousal Support Terms',
    fields: [
      { name: 'approach', label: 'Support Approach', type: 'select', tooltip: 'General approach to spousal support.', options: ['Full Waiver', 'Limited Duration', 'Formula-Based', 'Court Discretion Preserved'] },
      { name: 'terms', label: 'Specific Terms', type: 'textarea', tooltip: 'Detailed terms of the support arrangement.' },
      { name: 'sunset', label: 'Sunset Provisions', type: 'textarea', tooltip: 'Does the prenup expire or change after a certain number of years?' },
      { name: 'triggers', label: 'Modification Triggers', type: 'textarea', tooltip: 'Events that would modify the support terms (e.g., children, disability).' },
    ],
    researchSources: [
      { id: 'bloomfield-2', title: 'Bloomfield v. Bloomfield', type: 'caselaw', citation: '97 N.Y.2d 188 (2001)', summary: 'Enforceability of maintenance waivers in prenuptial agreements.' },
      { id: 'wiki-waiver', title: 'Spousal Support Waivers', type: 'wiki', citation: 'Assigned Co-Counsel Wiki', summary: 'Drafting enforceable spousal support provisions in prenups.' },
    ],
    mockDocumentContent: `SPOUSAL SUPPORT PROVISIONS

Approach: [APPROACH]

TERMS:
[Specific terms]

SUNSET PROVISIONS:
[Sunset details]

MODIFICATION TRIGGERS:
[Trigger events]

Both parties acknowledge they have been advised of their rights regarding spousal support and enter into these provisions voluntarily.`,
  },
];
