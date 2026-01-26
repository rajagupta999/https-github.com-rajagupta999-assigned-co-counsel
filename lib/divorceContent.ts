
export interface DivorceStep {
    id: string;
    order: number;
    title: string;
    description: string;
    copilotPrompt: string;
    icon: string; // Tailwind class or lucide icon name
}

export const divorceSteps: DivorceStep[] = [
    {
        id: "safety-planning",
        order: 1,
        title: "Safety Planning & Triage",
        description: "Assess immediate risks, DV history, and potential for emergency orders (Article 8 or 10).",
        copilotPrompt: "I need to conduct a safety planning assessment for a new divorce client. Draft a checklist of questions regarding domestic violence history, current living arrangements, and immediate safety concerns.",
        icon: "shield"
    },
    {
        id: "grounds",
        order: 2,
        title: "Determine Grounds (DRL § 170)",
        description: "Identify the legal basis for divorce. Since 2010, 'Irretrievable Breakdown' (No-Fault) is standard.",
        copilotPrompt: "Explain the requirements for a divorce based on Irretrievable Breakdown (No-Fault) under DRL § 170(7) and draft a brief explanation for the client.",
        icon: "scale"
    },
    {
        id: "jurisdiction",
        order: 3,
        title: "Jurisdiction & Venue",
        description: "Confirm residency requirements (DRL § 230) and proper venue selection.",
        copilotPrompt: "Check the residency requirements for filing a divorce in New York under DRL § 230. My client has lived in NY for 1 year but the spouse lives out of state.",
        icon: "map-pin"
    },
    {
        id: "commencement",
        order: 4,
        title: "Commencing the Action",
        description: "Filing the Summons with Notice or Summons & Complaint.",
        copilotPrompt: "Draft a Summons with Notice for a divorce action based on DRL § 170(7). The ancillary relief requested should include custody, child support, and equitable distribution.",
        icon: "file-text"
    },
    {
        id: "service",
        order: 5,
        title: "Service of Process",
        description: "Proper personal service on the defendant (CPLR 308) and filing Affidavit of Service.",
        copilotPrompt: "What are the rules for personal service in a matrimonial action in NY? Draft instructions for a process server.",
        icon: "send"
    },
    {
        id: "financials",
        order: 6,
        title: "Financial Disclosure",
        description: "Mandatory Statement of Net Worth (SNW) and exchange of 236-B financial documents.",
        copilotPrompt: "Generate a document checklist for the client to complete their Statement of Net Worth, including tax returns, pay stubs, and bank statements.",
        icon: "dollar-sign"
    },
    {
        id: "custody",
        order: 7,
        title: "Child Custody & Visitation",
        description: "Determine legal/residential custody and access schedules based on 'Best Interests'.",
        copilotPrompt: "Summarize the 'Best Interests of the Child' factors in New York and draft a proposed visitation schedule for a non-custodial parent.",
        icon: "users"
    },
    {
        id: "equitable-distribution",
        order: 8,
        title: "Equitable Distribution",
        description: "Classification of Marital vs. Separate property and fair division of assets/debts.",
        copilotPrompt: "Explain the difference between Marital Property and Separate Property in NY and how a pension acquired during marriage is treated.",
        icon: "pie-chart"
    },
    {
        id: "settlement",
        order: 9,
        title: "Settlement & Stipulation",
        description: "Drafting the Stipulation of Settlement resolving all ancillary issues.",
        copilotPrompt: "Draft a clause for a Stipulation of Settlement regarding the equal division of a marital credit card debt.",
        icon: "handshake"
    },
    {
        id: "judgment",
        order: 10,
        title: "Findings & Judgment",
        description: "Submission of the 'Matrimonial Package' to the court for signature.",
        copilotPrompt: "List the documents required for an Uncontested Divorce packet (the 'Matrimonial Package') in New York for submission to the Matrimonial Clerk.",
        icon: "gavel"
    }
];
