
export interface WikiArticle {
    id: string;
    slug: string;
    title: string;
    category: 'Family Law' | 'Criminal Defense' | 'Divorce & Matrimonial';
    lastUpdated: string;
    summary: string;
    content: string; // Markdown supported
    citations: string[];
}

export const wikiArticles: WikiArticle[] = [
    // --- Family Law ---
    {
        id: 'fam-1',
        slug: 'article-10-neglect-abuse',
        title: 'FCA Article 10: Child Protective Proceedings',
        category: 'Family Law',
        lastUpdated: '2025-01-15',
        summary: 'Overview of neglect and abuse proceedings under Article 10 of the Family Court Act, including definitions of imminent danger and the "safer course" doctrine.',
        content: `
# Family Court Act Article 10

## Overview
Article 10 of the Family Court Act governs child protective proceedings in New York State. The purpose of this article is to establish procedures to help protect children from injury or mistreatment and to help safeguard their physical, mental, and emotional well-being.

## Key Definitions

### Neglect (FCA § 1012(f))
A "neglected child" is defined as a child less than 18 years of age whose physical, mental or emotional condition has been impaired or is in imminent danger of becoming impaired as a result of the failure of his parent or other person legally responsible for his care to exercise a minimum degree of care.

### Abuse (FCA § 1012(e))
An "abused child" includes a child whose parent or other person legally responsible for his care inflicts or allows to be inflicted upon such child physical injury by other than accidental means which causes or creates a substantial risk of death, or serious or protracted disfigurement, or protracted impairment of physical or emotional health.

## The "Safer Course" Doctrine
In *Matter of Nicholson v. Scoppetta*, the Court of Appeals emphasized that removal should only occur when necessary to prevent imminent danger to the child's life or health.

> "The court must balance the risk to the child's life or health against the harm that removal might cause."

## Procedural Stages
1. **Filing of Petition**: usually by ACS/DSS.
2. **1027/1028 Hearing**: Immediate removal hearing (if applicable).
3. **Fact-Finding**: Determining if neglect/abuse occurred.
4. **Disposition**: Determining the remedy (Supervision, Placement, Suspended Judgment).
        `,
        citations: ['FCA § 1012', 'Nicholson v. Scoppetta, 3 N.Y.3d 357 (2004)', 'Matter of Jamie J., 30 N.Y.3d 275 (2017)']
    },
    {
        id: 'fam-2',
        slug: 'eschbach-custody-factors',
        title: 'Custody Determinations: The Eschbach Factors',
        category: 'Family Law',
        lastUpdated: '2024-11-20',
        summary: 'The seminal case Eschbach v. Eschbach established the totality of circumstances analysis for custody modifications.',
        content: `
# Eschbach v. Eschbach: Totality of Circumstances

## Principle
In New York, custody determinations are based on the "best interests of the child." There is no single factor that is determinative. Instead, the court must consider the **totality of circumstances**.

## Key Factors
As outlined in *Eschbach v. Eschbach*, courts consider:

1. **Stability**: The quality of the home environment and the parental guidance provided.
2. **Fitness**: The relative fitness of each parent and their ability to provide for the child's emotional and intellectual development.
3. **Primary Caretaker**: Which parent has historically been the primary caregiver.
4. **Child's Preference**: Depending on age and maturity.
5. **Siblings**: The general preference to keep siblings together.
6. **Domestic Violence**: The effect of any DV on the child (DRL § 240).

## Application
Modifying an existing custody order requires a showing of a "change in circumstances" such that modification is necessary to ensure the best interests of the child.
        `,
        citations: ['Eschbach v. Eschbach, 56 N.Y.2d 167 (1982)', 'Friederwitzer v. Friederwitzer, 55 N.Y.2d 89 (1982)']
    },

    // --- Criminal Defense ---
    {
        id: 'crim-1',
        slug: 'bail-reform-cpl-510',
        title: 'Bail Reform and CPL § 510',
        category: 'Criminal Defense',
        lastUpdated: '2025-01-10',
        summary: 'Guide to New York\'s bail reform laws, qualifying offenses, and the "least restrictive means" standard.',
        content: `
# NY Bail Reform (CPL § 510)

## The Presumption of Release
Detailed under CPL § 510.10, the court "shall release" a principal pending trial on the principal's own recognizance (ROR) unless the court finds that the principal poses a "risk of flight" to avoid prosecution.

## Qualifying Offenses
Cash bail is now generally prohibited for most misdemeanors and non-violent felonies. Bail may still be set for "qualifying offenses" including:
* Violent Felony Offenses (VFOs)
* Sex offenses (Article 130)
* Witness tampering / Intimidation
* Criminal Contempt (Domestic Violence cases)

## Least Restrictive Means
Even when bail is authorized, the court must select the "least restrictive alternative and condition or conditions that will reasonably assure the principal's return to court."

## Recent Amendments (2024/2025 Context)
Recent legislative tweaks have expanded judicial discretion slightly in cases involving repeat offenders and gun possession, allowing for consideration of "danger to the community" in limited, specific contexts (though historically NY did not have a dangerousness standard).
        `,
        citations: ['CPL § 510.10', 'CPL § 530.20', 'People ex rel. McManus v. Horn, 18 N.Y.3d 660']
    },
    {
        id: 'crim-2',
        slug: 'discovery-cpl-245',
        title: 'Discovery Obligations (CPL Article 245)',
        category: 'Criminal Defense',
        lastUpdated: '2024-12-05',
        summary: 'Deadlines and requirements for automatic discovery under the 2020 reforms.',
        content: `
# Automatic Discovery (CPL § 245)

## Timelines
New York's "Open File" discovery law requires the prosecution to provide discovery **automatically**, without demand.

* **Initial Discovery**: Must be disclosed within **20 calendar days** of arraignment (can be extended to 35 days if defendant is not in custody).
* **Supplemental Discovery**: Ongoing duty to disclose.

## What Must Be Disclosed? (CPL § 245.20)
1. **Statements**: All written or recorded statements of the defendant and co-defendants.
2. **Grand Jury Testimony**: Of defendant and witnesses intended to be called.
3. **Police Reports**: Results of physical/mental exams, scientific tests.
4. **Digital Evidence**: Body cam footage, 911 calls.
5. **Witness Names**: Names and contact info (unless protective order).

## Certificate of Compliance (COC)
The prosecution must file a COC stating that they have exercised "due diligence" and turned over all known material. They cannot answer "Ready for Trial" (CPL § 30.30) without a valid COC.
        `,
        citations: ['CPL § 245.10', 'CPL § 245.20', 'People v. Bay, 2023 NY Slip Op 06407']
    },

    // --- Divorce & Matrimonial ---
    {
        id: 'div-1',
        slug: 'drl-170-grounds',
        title: 'Grounds for Divorce (DRL § 170)',
        category: 'Divorce & Matrimonial',
        lastUpdated: '2023-09-01',
        summary: 'Overview of the grounds for divorce in NY, focusing on the "No-Fault" (Irretrievable Breakdown) provision.',
        content: `
# Grounds for Divorce in NY (DRL § 170)

## 1. No-Fault Divorce (DRL § 170(7))
Added in 2010, this is now the most common ground.
* **Requirement**: The relationship between husband and wife has broken down irretrievably for a period of at least six months.
* **Stipulation**: Judgment cannot be entered until all ancillary issues (equitable distribution, custody, support) are resolved.

## 2. Cruel and Inhuman Treatment (DRL § 170(1))
Conduct by the defendant that so endangers the physical or mental well-being of the plaintiff as renders it unsafe or improper for the plaintiff to cohabit with the defendant. High burden of proof in long-term marriages (*Hessen v. Hessen*).

## 3. Abandonment (DRL § 170(2))
Voluntary separation of one spouse from the other for a period of one or more years. Includes "Constructive Abandonment" (refusal of sexual relations).

## 4. Imprisonment (DRL § 170(3))
Confinement of defendant in prison for a period of three or more consecutive years after the marriage.

## 5. Adultery (DRL § 170(4))
Commission of an act of adultery. Difficult to prove due to corroboration requirements.
        `,
        citations: ['DRL § 170', 'Palermo v. Palermo', 'Hessen v. Hessen']
    },
    {
        id: 'div-2',
        slug: 'equitable-distribution',
        title: 'Equitable Distribution Basics',
        category: 'Divorce & Matrimonial',
        lastUpdated: '2024-05-15',
        summary: 'Understanding marital vs. separate property and the factors courts use to divide assets.',
        content: `
# Equitable Distribution (DRL § 236B)

## Basic Rule
New York is an "Equitable Distribution" state, not a "Community Property" state. Marital property is divided **equitably** (fairly), not necessarily **equally** (50/50).

## Marital vs. Separate Property
* **Separate Property**: Acquired before marriage, or by bequest/inheritance/gift from non-spouse during marriage. Includes compensation for personal injuries.
* **Marital Property**: All property acquired by either or both spouses during the marriage and before the execution of a separation agreement or the commencement of a matrimonial action.

## Key Factors for Distribution (The "Majauskas" Factors)
1. Income and property of each party at time of marriage and commencement of action.
2. Duration of the marriage.
3. Age and health of both parties.
4. Need of custodial parent to occupy the marital residence.
5. Loss of inheritance/pension rights upon dissolution.
6. Direct or indirect contribution made to the acquisition of marital property (including homemaker contributions).

## Professional Licenses (**O'Brien** Overruled)
As of recent amendments, professional licenses are no longer considered separate marital assets subject to valuation, but their value is considered in the distribution of other assets.
        `,
        citations: ['DRL § 236 Part B', 'Majauskas v. Majauskas', 'Fields v. Fields']
    }
];
