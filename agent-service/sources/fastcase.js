const { newPage, closePage } = require('./browser');

const sessionCache = new Map();

async function searchFastcase(query, credentials, maxResults = 15) {
  const { username, password } = credentials;
  let page;

  try {
    page = await newPage();

    const saved = sessionCache.get(username);
    if (saved) await page.setCookie(...saved);

    // Fastcase / vLex merged — try Fastcase first
    const searchUrl = `https://www.fastcase.com/search/?q=${encodeURIComponent(query)}&type=case`;
    await page.goto(searchUrl, { waitUntil: 'networkidle2', timeout: 30000 });

    if (page.url().includes('login') || page.url().includes('signin') || page.url().includes('account')) {
      console.log('[Fastcase] Authenticating...');
      await loginFastcase(page, username, password);
      await page.goto(searchUrl, { waitUntil: 'networkidle2', timeout: 30000 });
    }

    if (page.url().includes('login') || page.url().includes('signin')) {
      throw new Error('Fastcase login failed — check credentials');
    }

    const cookies = await page.cookies();
    sessionCache.set(username, cookies);

    await page.waitForSelector('[class*="result"], [class*="Result"], .search-result, a[href*="/document"]', { timeout: 15000 }).catch(() => {});
    await new Promise(r => setTimeout(r, 2000));

    const results = await page.evaluate((max) => {
      const items = [];
      const links = document.querySelectorAll('a[href*="/document"], a[href*="/case/"], a[href*="/opinion"]');
      const seen = new Set();

      links.forEach(link => {
        if (items.length >= max) return;
        const container = link.closest('[class*="result"], li, tr, article') || link.parentElement?.parentElement;
        if (!container || seen.has(container)) return;
        seen.add(container);

        const caseName = link.textContent?.trim() || '';
        if (caseName.length < 5) return;

        let citation = '', court = '', dateFiled = '', snippet = '';
        const text = container.textContent || '';

        const citeMatch = text.match(/\d+\s+(?:F\.\d+|S\.Ct\.|U\.S\.|N\.Y\.\d*|A\.D\.\d*|N\.E\.\d*)\s+\d+/);
        if (citeMatch) citation = citeMatch[0];

        const dateMatch = text.match(/(?:Jan|Feb|Mar|Apr|May|Jun|Jul|Aug|Sep|Oct|Nov|Dec)\w*\.?\s+\d{1,2},?\s+\d{4}/);
        if (dateMatch) dateFiled = dateMatch[0];

        const snippetEl = container.querySelector('[class*="snippet"], [class*="preview"], p');
        snippet = (snippetEl?.textContent || text.replace(caseName, '')).trim().slice(0, 500);

        let url = link.href;
        items.push({ id: `fastcase-${items.length}-${Date.now()}`, caseName: caseName.slice(0, 200), citation, court, dateFiled, snippet: snippet.replace(/\s+/g, ' '), url, source: 'fastcase' });
      });
      return items;
    }, maxResults);

    console.log(`[Fastcase] Found ${results.length} results`);
    return results;
  } finally {
    await closePage(page);
  }
}

async function loginFastcase(page, username, password) {
  await page.waitForSelector('input[type="text"], input[type="email"], input[name="username"]', { timeout: 15000 });

  const userSelectors = ['#username', '#email', 'input[name="username"]', 'input[name="email"]', 'input[type="email"]', 'input[type="text"]'];
  for (const sel of userSelectors) {
    const el = await page.$(sel);
    if (el) { await el.click({ clickCount: 3 }); await el.type(username, { delay: 30 }); break; }
  }

  const passSelectors = ['#password', 'input[name="password"]', 'input[type="password"]'];
  for (const sel of passSelectors) {
    const el = await page.$(sel);
    if (el) { await el.click({ clickCount: 3 }); await el.type(password, { delay: 30 }); break; }
  }

  const submitSelectors = ['button[type="submit"]', 'input[type="submit"]', '#loginBtn', 'button[class*="sign"]', 'button[class*="login"]'];
  for (const sel of submitSelectors) {
    const el = await page.$(sel);
    if (el) { await el.click(); break; }
  }

  await page.waitForNavigation({ waitUntil: 'networkidle2', timeout: 30000 }).catch(() => {});
}

module.exports = { searchFastcase };
