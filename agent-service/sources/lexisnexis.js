const { newPage, closePage } = require('./browser');

const sessionCache = new Map();

async function searchLexisNexis(query, credentials, maxResults = 15) {
  const { username, password } = credentials;
  let page;

  try {
    page = await newPage();

    // Restore cookies
    const saved = sessionCache.get(username);
    if (saved) await page.setCookie(...saved);

    // Go to Lexis+ search
    const searchUrl = `https://plus.lexis.com/search/?q=${encodeURIComponent(query)}&qlang=bool&crid=&pdmfid=`;
    await page.goto(searchUrl, { waitUntil: 'networkidle2', timeout: 30000 });

    // Check for login redirect
    if (page.url().includes('signin.lexisnexis.com') || page.url().includes('auth') || page.url().includes('login')) {
      console.log('[LexisNexis] Authenticating...');
      await loginLexis(page, username, password);
      await page.goto(searchUrl, { waitUntil: 'networkidle2', timeout: 30000 });
    }

    if (page.url().includes('signin') || page.url().includes('login')) {
      throw new Error('LexisNexis login failed — check credentials');
    }

    // Save session
    const cookies = await page.cookies();
    sessionCache.set(username, cookies);

    // Wait for results
    await page.waitForSelector('[class*="result"], [class*="Result"], .SearchResult, a[href*="/document/"]', { timeout: 15000 }).catch(() => {});
    await new Promise(r => setTimeout(r, 2000));

    // Scrape
    const results = await page.evaluate((max) => {
      const items = [];
      const links = document.querySelectorAll('a[href*="/document/"], a[href*="/cases/"]');
      const seen = new Set();

      links.forEach(link => {
        if (items.length >= max) return;
        const container = link.closest('[class*="result"], [class*="Result"], li, tr, article') || link.parentElement?.parentElement;
        if (!container || seen.has(container)) return;
        seen.add(container);

        const caseName = link.textContent?.trim() || '';
        if (caseName.length < 5) return;

        let citation = '', court = '', dateFiled = '', snippet = '';
        const text = container.textContent || '';

        // Citation pattern
        const citeMatch = text.match(/\d+\s+(?:F\.\d+|S\.Ct\.|U\.S\.|N\.Y\.\d*|A\.D\.\d*|N\.E\.\d*)\s+\d+/);
        if (citeMatch) citation = citeMatch[0];

        const courtEl = container.querySelector('[class*="court"], [class*="Court"]');
        if (courtEl) court = courtEl.textContent.trim();

        const dateMatch = text.match(/(?:Jan|Feb|Mar|Apr|May|Jun|Jul|Aug|Sep|Oct|Nov|Dec)\w*\.?\s+\d{1,2},?\s+\d{4}/);
        if (dateMatch) dateFiled = dateMatch[0];

        const snippetEl = container.querySelector('[class*="snippet"], [class*="overview"], p');
        snippet = (snippetEl?.textContent || text.replace(caseName, '')).trim().slice(0, 500);

        let url = link.href;
        if (!url.startsWith('http')) url = 'https://plus.lexis.com' + url;

        items.push({ id: `lexisnexis-${items.length}-${Date.now()}`, caseName: caseName.slice(0, 200), citation, court, dateFiled, snippet: snippet.replace(/\s+/g, ' '), url, source: 'lexisnexis' });
      });
      return items;
    }, maxResults);

    console.log(`[LexisNexis] Found ${results.length} results`);
    return results;
  } finally {
    await closePage(page);
  }
}

async function loginLexis(page, username, password) {
  await page.waitForSelector('input[type="text"], input[type="email"], input[name="userid"], #userid', { timeout: 15000 });

  const userSelectors = ['#userid', 'input[name="userid"]', 'input[name="username"]', 'input[type="email"]', 'input[type="text"]'];
  for (const sel of userSelectors) {
    const el = await page.$(sel);
    if (el) { await el.click({ clickCount: 3 }); await el.type(username, { delay: 30 }); break; }
  }

  const passSelectors = ['#password', 'input[name="password"]', 'input[type="password"]'];
  for (const sel of passSelectors) {
    const el = await page.$(sel);
    if (el) { await el.click({ clickCount: 3 }); await el.type(password, { delay: 30 }); break; }
  }

  const submitSelectors = ['#SignInButton', 'button[type="submit"]', 'input[type="submit"]', '#sign-in'];
  for (const sel of submitSelectors) {
    const el = await page.$(sel);
    if (el) { await el.click(); break; }
  }

  await page.waitForNavigation({ waitUntil: 'networkidle2', timeout: 30000 }).catch(() => {});
}

module.exports = { searchLexisNexis };
