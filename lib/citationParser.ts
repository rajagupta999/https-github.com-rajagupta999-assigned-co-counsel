// Citation Parser - Extracts legal citations from pasted text
// Recognizes common citation formats for NY and federal courts

export interface ParsedCitation {
  fullCitation: string;
  caseName?: string;
  volume?: string;
  reporter?: string;
  page?: string;
  court?: string;
  year?: string;
}

export interface ResearchClip {
  id: string;
  text: string;
  citations: ParsedCitation[];
  sourceUrl?: string;
  sourceName?: string;
  caseId?: string;
  createdAt: string;
  tags: string[];
}

// Common reporter abbreviations
const REPORTERS = [
  // Federal
  'U\\.S\\.', 'S\\. ?Ct\\.', 'L\\. ?Ed\\.', 'L\\. ?Ed\\. ?2d',
  'F\\.4th', 'F\\.3d', 'F\\.2d', 'F\\.', 
  'F\\. ?Supp\\. ?3d', 'F\\. ?Supp\\. ?2d', 'F\\. ?Supp\\.',
  'Fed\\. ?Appx\\.',
  // New York
  'N\\.Y\\.3d', 'N\\.Y\\.2d', 'N\\.Y\\.', 
  'A\\.D\\.3d', 'A\\.D\\.2d', 'A\\.D\\.',
  'N\\.Y\\.S\\.3d', 'N\\.Y\\.S\\.2d', 'N\\.Y\\.S\\.',
  'Misc\\. ?3d', 'Misc\\. ?2d', 'Misc\\.',
  // Other
  'N\\.E\\.3d', 'N\\.E\\.2d', 'N\\.E\\.',
  'S\\.W\\.3d', 'S\\.W\\.2d',
  'So\\. ?3d', 'So\\. ?2d',
  'P\\.3d', 'P\\.2d',
  'A\\.3d', 'A\\.2d',
  'Wn\\. ?App\\.',
  'Cal\\. ?App\\.',
  'WL',
];

// Build regex pattern for citation detection
const reporterPattern = REPORTERS.join('|');
const citationRegex = new RegExp(
  `(\\d+)\\s+(${reporterPattern})\\s+(\\d+)(?:\\s*\\(([^)]+)\\))?`,
  'g'
);

// Case name pattern: "Name v. Name" or "In re Name" or "Matter of Name"
const caseNameRegex = /(?:([A-Z][a-zA-Z'.]+(?:\s+[A-Z][a-zA-Z'.]+)*)\s+v\.\s+([A-Z][a-zA-Z'.]+(?:\s+[a-zA-Z'.]+)*))|(?:(?:In re|Matter of|People v\.|State v\.|United States v\.)\s+([A-Z][a-zA-Z'.]+(?:\s+[a-zA-Z'.]+)*))/g;

export function parseCitations(text: string): ParsedCitation[] {
  const citations: ParsedCitation[] = [];
  
  let match;
  while ((match = citationRegex.exec(text)) !== null) {
    const citation: ParsedCitation = {
      fullCitation: match[0],
      volume: match[1],
      reporter: match[2],
      page: match[3],
    };
    
    if (match[4]) {
      // Parse the parenthetical (court and year)
      const parenContent = match[4];
      const yearMatch = parenContent.match(/(\d{4})/);
      if (yearMatch) {
        citation.year = yearMatch[1];
        citation.court = parenContent.replace(yearMatch[0], '').trim().replace(/^,\s*/, '').replace(/,\s*$/, '');
      }
    }
    
    // Try to find the case name before this citation
    const textBefore = text.substring(Math.max(0, match.index - 100), match.index);
    const nameMatch = textBefore.match(/([A-Z][a-zA-Z'.\s]+v\.\s+[A-Z][a-zA-Z'.\s]+),?\s*$/);
    if (nameMatch) {
      citation.caseName = nameMatch[1].trim();
    }
    
    citations.push(citation);
  }
  
  return citations;
}

// Format a citation for display
export function formatCitation(citation: ParsedCitation): string {
  let result = '';
  if (citation.caseName) {
    result += `${citation.caseName}, `;
  }
  result += citation.fullCitation;
  return result;
}

// Create a research clip from pasted text
export function createClip(text: string, sourceUrl?: string, sourceName?: string, caseId?: string): ResearchClip {
  const citations = parseCitations(text);
  
  // Auto-generate tags from content
  const tags: string[] = [];
  const lowerText = text.toLowerCase();
  
  if (lowerText.includes('suppress') || lowerText.includes('fourth amendment')) tags.push('Suppression');
  if (lowerText.includes('ineffective') || lowerText.includes('iac')) tags.push('IAC');
  if (lowerText.includes('sentence') || lowerText.includes('sentencing')) tags.push('Sentencing');
  if (lowerText.includes('bail') || lowerText.includes('remand')) tags.push('Bail');
  if (lowerText.includes('custody') || lowerText.includes('visitation')) tags.push('Custody');
  if (lowerText.includes('neglect') || lowerText.includes('article 10')) tags.push('Neglect');
  if (lowerText.includes('divorce') || lowerText.includes('equitable distribution')) tags.push('Divorce');
  if (lowerText.includes('plea') || lowerText.includes('guilty')) tags.push('Plea');
  if (lowerText.includes('trial') || lowerText.includes('jury')) tags.push('Trial');
  if (lowerText.includes('appeal') || lowerText.includes('affirm') || lowerText.includes('reverse')) tags.push('Appeal');
  
  return {
    id: `clip-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
    text,
    citations,
    sourceUrl,
    sourceName,
    caseId,
    createdAt: new Date().toISOString(),
    tags,
  };
}
