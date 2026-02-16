// Domain-based branding
export interface Brand {
  name: string;
  shortName: string;
  tagline: string;
  logoText: string;
  domain: string;
  isNY: boolean; // true = NY-focused (18blawyer.xyz), false = national (assignedcocounsel.com)
  heroHeadline: string;
  heroSub: string;
  heroDetail: string;
  problemTitle: string;
  problemDesc: string;
  solutionTitle: string;
  solutionDesc: string;
  audience: string;
  panelRef: string; // "18-B panel" vs "court-appointed"
  jurisdiction: string; // "New York" vs "nationwide"
  ctaFinal: string;
  ctaSubtext: string;
  badgeText: string;
  dayTitle: string;
  dayDesc: string;
  painCards: { pain: string; desc: string; stat: string; icon: string }[];
  daySteps: { time: string; title: string; desc: string; icon: string }[];
}

const NY_BRAND: Brand = {
  name: '18B Lawyer',
  shortName: '18B',
  tagline: 'AI-Powered Legal Platform for 18-B Panel Attorneys',
  logoText: '18B',
  domain: '18blawyer.xyz',
  isNY: true,
  heroHeadline: 'The AI platform built\nfor New York\npanel attorneys.',
  heroSub: '18B Lawyer gives New York\'s court-appointed criminal defense and family law attorneys the same AI-powered tools used by Am Law 100 firms — built specifically for 18-B panel practice in every borough and county.',
  heroDetail: '19 legal databases. 3 AI models. NY Penal Law, CPL, DRL, and Family Court Act built in. Zero cost.',
  problemTitle: 'You handle the heaviest caseloads in New York — with the fewest tools.',
  problemDesc: 'Manhattan. Brooklyn. The Bronx. Queens. Nassau. Suffolk. Westchester. Every day, 18-B panel attorneys across New York walk into courtrooms with nothing but a case file and their own expertise. Meanwhile, private defense firms have AI assistants, research teams, and $2,000/month legal tech. That gap ends now.',
  solutionTitle: '18B Lawyer was built for New York courts.',
  solutionDesc: 'Not a generic legal tool adapted for NY. Purpose-built from day one for 18-B panel attorneys handling criminal defense and family law across all five boroughs and every county in the state.',
  audience: 'New York 18-B panel attorneys',
  panelRef: '18-B panel',
  jurisdiction: 'New York',
  ctaFinal: 'New York\'s court-appointed attorneys\ndeserve enterprise-grade tools.',
  ctaSubtext: '18B Lawyer brings the same AI used by the biggest firms in Manhattan to every panel attorney in every borough — at no cost. Because your client in the Bronx deserves the same quality defense as a client on Park Avenue.',
  badgeText: 'Built for New York 18-B panels',
  dayTitle: 'A Day in New York Criminal Court',
  dayDesc: 'See how 18B Lawyer fits into a real day of panel practice in New York.',
  painCards: [
    { pain: 'Stacked court calendars', desc: 'You\'re handling 4-5 appearances across multiple parts before lunch. No time to research between cases — you need answers in seconds, not hours.', stat: '30+ cases/month', icon: '⏰' },
    { pain: 'NY-specific law changes constantly', desc: 'Bail reform. Discovery reform (CPL 245). Raise the Age. NY criminal law has transformed in recent years, and keeping up while managing a full caseload is impossible.', stat: '3 major reforms since 2019', icon: '📜' },
    { pain: 'Voucher rates haven\'t kept up', desc: 'You\'re earning $158/hr for felonies — while spending unpaid hours on research, drafting, and admin. Every hour you save is money in your pocket.', stat: '$158/hr (felony)', icon: '💸' },
  ],
  daySteps: [
    { time: '8:00 AM', title: 'Check your Legal Intel feed before court', desc: 'New Second Department ruling on suppression standards. Lex flags it as relevant to your Kings County case. You read the AI summary on the subway and save it to your case file.', icon: '📰' },
    { time: '9:30 AM', title: 'Prep for a Mapp/Dunaway hearing', desc: 'Upload the arrest report to Trial Prep. Practice cross-examining the AI officer on lighting, distance, and identification. The AI responds based on your actual case file. Score: 91/100.', icon: '⚔️' },
    { time: '10:00 AM', title: 'Quick research outside Part F', desc: '"Lex, what\'s the Dunaway standard when the stop was based on an anonymous 911 call in the Second Department?" Answer with 3 NY citations in 4 seconds.', icon: '🔍' },
    { time: '1:00 PM', title: 'Draft a CPL 710.20 motion', desc: 'Co-Pilot generates a first draft motion to suppress using your case file as context. Multi-agent analysis catches a weak argument about standing before you file in Supreme Court.', icon: '📝' },
    { time: '3:30 PM', title: 'Family Court in the afternoon', desc: 'Lex pulls the relevant DRL sections and Eschbach factors for your custody case. Wiki entry on Article 10 proceedings refreshes your memory before your appearance in Family Court.', icon: '👨‍👩‍👧' },
    { time: '5:00 PM', title: 'Submit your voucher', desc: 'Time tracker shows 6.2 billable hours across Criminal and Family Court. Generate a compliant voucher. PSLF tracker updates: 99 of 120 qualifying payments.', icon: '💰' },
  ],
};

const NATIONAL_BRAND: Brand = {
  name: 'Assigned Co-Counsel',
  shortName: 'ACC',
  tagline: 'AI-Powered Legal Platform for Court-Appointed Attorneys',
  logoText: 'scales',
  domain: 'assignedcocounsel.com',
  isNY: false,
  heroHeadline: 'Major firms spend\n$2,000/month on AI.\nYou get it free.',
  heroSub: 'Assigned Co-Counsel brings the same AI-powered research, drafting, and practice management used by Am Law 100 firms to the attorneys who need it most — court-appointed criminal defense and family law practitioners nationwide.',
  heroDetail: '19 legal databases. 3 AI models. A virtual paralegal. Zero cost. Zero data retention.',
  problemTitle: 'You\'re doing the most important work in the justice system — with the fewest tools.',
  problemDesc: 'Big law firms get AI research assistants, automated billing, and entire teams of paralegals. Court-appointed attorneys get a case file, a court date, and good intentions. That ends today.',
  solutionTitle: 'Assigned Co-Counsel levels the playing field.',
  solutionDesc: 'Every tool that makes a $2,000/month enterprise legal AI platform powerful — research, drafting, analysis, case management — purpose-built for the realities of indigent defense practice nationwide.',
  audience: 'court-appointed attorneys',
  panelRef: 'court-appointed',
  jurisdiction: 'nationwide',
  ctaFinal: 'Your clients can\'t afford a big firm.\nThey shouldn\'t have to.',
  ctaSubtext: 'Assigned Co-Counsel gives court-appointed attorneys the same AI-powered tools that Am Law 100 firms use — research, drafting, analysis, practice management — at no cost. Because the quality of someone\'s defense shouldn\'t depend on their ability to pay.',
  badgeText: 'Enterprise-grade AI — built for court-appointed attorneys',
  dayTitle: 'A Day with Assigned Co-Counsel',
  dayDesc: 'See how the platform fits into a real day of court-appointed practice.',
  painCards: [
    { pain: 'Hours lost on research', desc: 'Manually searching multiple databases, one at a time, trying to find the right case law before your next appearance.', stat: '12+ hrs/week', icon: '⏰' },
    { pain: 'Drafting from scratch', desc: 'Writing motions, briefs, and memos without AI assistance while big firms auto-generate first drafts in minutes.', stat: '60% of your time', icon: '📝' },
    { pain: 'Unpaid admin work', desc: 'Tracking hours, managing deadlines, organizing case files, preparing vouchers — all the work you don\'t get paid for.', stat: '$0/hr', icon: '💸' },
  ],
  daySteps: [
    { time: '8:00 AM', title: 'Check your Legal Intel feed', desc: 'New circuit court ruling on suppression standards. Lex flags it as relevant to two of your active cases. You read the summary in-app and save it to your case file.', icon: '📰' },
    { time: '9:30 AM', title: 'Prep for a suppression hearing', desc: 'Upload the police report to Trial Prep. Practice cross-examining the AI witness on lighting conditions and identification procedures. Score: 91/100.', icon: '⚔️' },
    { time: '10:00 AM', title: 'Quick research at the courthouse', desc: '"Lex, what\'s the standard for a suppression hearing when the stop was based on an anonymous tip?" Answer with 3 citations in 4 seconds.', icon: '🔍' },
    { time: '1:00 PM', title: 'Draft a motion to suppress', desc: 'Co-Pilot generates a first draft using your case file as RAG context. Multi-agent analysis runs — the Red Team catches a weak argument about standing. You fix it before filing.', icon: '📝' },
    { time: '3:30 PM', title: 'Family court appearance', desc: 'Lex pulls the relevant statutes and custody factors for your case. Wiki entries refresh your memory on the applicable standards before your appearance.', icon: '👨‍👩‍👧' },
    { time: '5:00 PM', title: 'Close out the day', desc: 'Time tracker shows 6.2 billable hours. Generate a voucher. PSLF tracker updates: 99 of 120 qualifying payments. One step closer to forgiveness.', icon: '💰' },
  ],
};

export function getBrand(): Brand {
  if (typeof window === 'undefined') return NY_BRAND; // SSR default
  const host = window.location.hostname;
  if (host.includes('assignedcocounsel')) return NATIONAL_BRAND;
  return NY_BRAND;
}

export function isACCDomain(): boolean {
  if (typeof window === 'undefined') return false;
  return window.location.hostname.includes('assignedcocounsel');
}
