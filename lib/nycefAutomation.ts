// NYCEF Browser Automation Module
// For pulling case data from NY Courts E-Filing system

export interface NYCEFCredentials {
  username: string;
  password: string;
}

export interface NYCEFCase {
  indexNumber: string;
  caption: string;
  court: string;
  caseType: string;
  status: string;
  filingDate: string;
  lastActivity: string;
}

export interface NYCEFDocument {
  docId: string;
  title: string;
  filedDate: string;
  filedBy: string;
  downloadUrl?: string;
}

// NYCEF URLs
export const NYCEF_URLS = {
  home: 'https://iapps.courts.state.ny.us/nyscef/HomePage',
  login: 'https://iapps.courts.state.ny.us/nyscef/Login',
  myCases: 'https://iapps.courts.state.ny.us/nyscef/MyCases',
  caseSearch: 'https://iapps.courts.state.ny.us/nyscef/CaseSearch',
  recentFilings: 'https://iapps.courts.state.ny.us/nyscef/RecentFilings',
};

// Selectors for NYCEF pages (may need updates if site changes)
export const NYCEF_SELECTORS = {
  login: {
    usernameInput: 'input[name="userId"]',
    passwordInput: 'input[name="password"]',
    submitButton: 'input[type="submit"], button[type="submit"]',
    errorMessage: '.error-message, .alert-danger',
  },
  myCases: {
    caseTable: 'table.case-list, #caseListTable',
    caseRow: 'tr.case-row, tbody tr',
    indexNumber: '.index-number, td:nth-child(1)',
    caption: '.caption, td:nth-child(2)',
    court: '.court, td:nth-child(3)',
    status: '.status, td:nth-child(4)',
  },
  caseDetails: {
    documentsTable: 'table.documents, #documentsTable',
    documentRow: 'tr.document-row, tbody tr',
    downloadLink: 'a.download, a[href*="Download"]',
  },
};

// Instructions for browser automation flow
export const NYCEF_AUTOMATION_STEPS = `
NYCEF Login & Data Pull Flow:

1. NAVIGATE to login page
   URL: ${NYCEF_URLS.login}

2. FILL credentials
   - Username field: ${NYCEF_SELECTORS.login.usernameInput}
   - Password field: ${NYCEF_SELECTORS.login.passwordInput}

3. SUBMIT login form
   - Click: ${NYCEF_SELECTORS.login.submitButton}

4. CHECK for errors
   - Look for: ${NYCEF_SELECTORS.login.errorMessage}
   - If 2FA/CAPTCHA appears, notify user

5. NAVIGATE to My Cases
   URL: ${NYCEF_URLS.myCases}

6. EXTRACT case list
   - Find table: ${NYCEF_SELECTORS.myCases.caseTable}
   - For each row, extract: index number, caption, court, status

7. For each case, optionally:
   - Click to view details
   - Extract document list
   - Download documents if requested

IMPORTANT:
- Handle session timeouts gracefully
- If CAPTCHA detected, pause and notify user
- Respect rate limits (don't hammer the server)
`;

// Helper to format case data for display
export function formatCaseList(cases: NYCEFCase[]): string {
  if (cases.length === 0) return 'No cases found.';
  
  return cases.map((c, i) => 
    `${i + 1}. **${c.indexNumber}**\n   ${c.caption}\n   Court: ${c.court} | Status: ${c.status}\n   Last Activity: ${c.lastActivity}`
  ).join('\n\n');
}

// Helper to check if we hit a login wall or CAPTCHA
export function detectBlockers(pageContent: string): {
  blocked: boolean;
  reason?: string;
} {
  const lowerContent = pageContent.toLowerCase();
  
  if (lowerContent.includes('captcha') || lowerContent.includes('recaptcha')) {
    return { blocked: true, reason: 'CAPTCHA detected' };
  }
  
  if (lowerContent.includes('two-factor') || lowerContent.includes('2fa') || lowerContent.includes('verification code')) {
    return { blocked: true, reason: 'Two-factor authentication required' };
  }
  
  if (lowerContent.includes('access denied') || lowerContent.includes('forbidden')) {
    return { blocked: true, reason: 'Access denied by server' };
  }
  
  if (lowerContent.includes('rate limit') || lowerContent.includes('too many requests')) {
    return { blocked: true, reason: 'Rate limited' };
  }
  
  return { blocked: false };
}
