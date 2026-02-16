const { newPage, closePage } = require('./browser');

// Session cookies cache — avoids re-login on every request
const sessionCache = new Map();

async function searchWestlaw(query, credentials, maxResults = 15) {
  const { username, password } = credentials;
  const cacheKey = username;
  let page;

  try {
    page = await newPage();

    // Restore session cookies if we have them
    const savedCookies = sessionCache.get(cacheKey);
    if (savedCookies) {
      await page.setCookie(...savedCookies);
      console.log('[Westlaw] Restored session cookies for', username);
    }

    // Go directly to search results URL
    const searchUrl = `https://1.next.westlaw.com/Search/Results.html?query=${encodeURIComponent(query)}&jurisdiction=ALLCASES&contentType=CASE`;
    await page.goto(searchUrl, { waitUntil: 'networkidle2', timeout: 30000 });

    // Check if we got redirected to login
    const currentUrl = page.url();
    if (currentUrl.includes('signon.thomsonreuters.com') || currentUrl.includes('login') || currentUrl.includes('signin')) {
      console.log('[Westlaw] Session expired or first login — authenticating...');
      await login(page, username, password);

      // After login, navigate to search
      await page.goto(searchUrl, { waitUntil: 'networkidle2', timeout: 30000 });
    }

    // Check if we're on the results page
    const afterLoginUrl = page.url();
    if (afterLoginUrl.includes('signon') || afterLoginUrl.includes('login')) {
      throw new Error('Login failed — check credentials');
    }

    // Save session cookies for next time
    const cookies = await page.cookies();
    sessionCache.set(cacheKey, cookies);

    // Wait for results to load
    await waitForResults(page);

    // Scrape results
    const results = await scrapeResults(page, maxResults);
    console.log(`[Westlaw] Found ${results.length} results for "${query}"`);

    return results;
  } finally {
    await closePage(page);
  }
}

async function login(page, username, password) {
  // Wait for login form
  await page.waitForSelector('input[type="text"], input[type="email"], input[name="username"], #username', { timeout: 15000 });

  // Fill username
  const usernameSelectors = [
    '#co_clientIDTextbox',
    'input[name="username"]',
    'input[name="userid"]',
    '#username',
    'input[type="email"]',
    'input[type="text"]',
  ];

  for (const sel of usernameSelectors) {
    const el = await page.$(sel);
    if (el) {
      await el.click({ clickCount: 3 }); // Select all
      await el.type(username, { delay: 30 });
      console.log('[Westlaw] Username entered via', sel);
      break;
    }
  }

  // Fill password
  const passwordSelectors = [
    '#co_clientPasswordTextbox',
    'input[name="password"]',
    'input[type="password"]',
    '#password',
  ];

  for (const sel of passwordSelectors) {
    const el = await page.$(sel);
    if (el) {
      await el.click({ clickCount: 3 });
      await el.type(password, { delay: 30 });
      console.log('[Westlaw] Password entered via', sel);
      break;
    }
  }

  // Click sign-in button
  const submitSelectors = [
    '#co_clientSignInButton',
    'button[type="submit"]',
    'input[type="submit"]',
    '#SignIn',
    'button[name="SignIn"]',
  ];

  for (const sel of submitSelectors) {
    const el = await page.$(sel);
    if (el) {
      await el.click();
      console.log('[Westlaw] Sign-in clicked via', sel);
      break;
    }
  }

  // Wait for navigation after login
  await page.waitForNavigation({ waitUntil: 'networkidle2', timeout: 30000 }).catch(() => {});

  // Handle potential "one user at a time" or security prompts
  const postLoginUrl = page.url();
  if (postLoginUrl.includes('next.westlaw.com')) {
    console.log('[Westlaw] Login successful');
    return;
  }

  // Check for OnePass or additional verification
  const pageContent = await page.content();
  if (pageContent.includes('already signed in') || pageContent.includes('active session')) {
    // Click "Continue" or "Sign In Anyway"
    const continueBtn = await page.$('button:has-text("Continue"), button:has-text("Sign In"), a:has-text("Continue")');
    if (continueBtn) {
      await continueBtn.click();
      await page.waitForNavigation({ waitUntil: 'networkidle2', timeout: 15000 }).catch(() => {});
    }
  }

  console.log('[Westlaw] Post-login URL:', page.url());
}

async function waitForResults(page) {
  // Wait for any of these result indicators
  const resultSelectors = [
    '#co_searchResults_citation_list',
    '.search-results-list',
    '[class*="searchResult"]',
    '[class*="result-item"]',
    '#cobalt_search_results',
    '.co_searchResult',
    'a[href*="/Document/"]',
  ];

  for (const sel of resultSelectors) {
    try {
      await page.waitForSelector(sel, { timeout: 10000 });
      console.log('[Westlaw] Results detected via', sel);
      return;
    } catch (e) {
      // Try next selector
    }
  }

  // Last resort — just wait a bit
  await new Promise(r => setTimeout(r, 3000));
}

async function scrapeResults(page, maxResults) {
  return await page.evaluate((max) => {
    const results = [];

    // Strategy 1: Find all links to /Document/ (most reliable)
    const docLinks = document.querySelectorAll('a[href*="/Document/"]');
    const seen = new Set();

    docLinks.forEach(link => {
      if (results.length >= max) return;

      const container = link.closest('li, [class*="result"], [class*="Result"], [class*="document"], tr') || link.parentElement?.parentElement;
      if (!container || seen.has(container)) return;
      seen.add(container);

      // Extract case name from the link text
      let caseName = link.textContent?.trim() || '';
      if (caseName.length < 5) {
        // Try parent or sibling
        const titleEl = container.querySelector('h3, h2, [class*="title"], [class*="Title"], [class*="name"], [class*="Name"]');
        caseName = titleEl?.textContent?.trim() || caseName;
      }
      if (!caseName || caseName.length < 3) return;

      // Extract citation
      let citation = '';
      const citeEl = container.querySelector('[class*="cite"], [class*="Cite"], [class*="citation"], [class*="Citation"]');
      if (citeEl) citation = citeEl.textContent.trim();

      // Try to find citation pattern in text
      if (!citation) {
        const text = container.textContent || '';
        const citeMatch = text.match(/\d+\s+(?:F\.\d+|S\.Ct\.|U\.S\.|N\.Y\.\d*|A\.D\.\d*|N\.E\.\d*|N\.W\.\d*|So\.\d*|P\.\d*|Cal\.\w*|Ill\.\w*)\s+\d+/);
        if (citeMatch) citation = citeMatch[0];
      }

      // Extract court
      let court = '';
      const courtEl = container.querySelector('[class*="court"], [class*="Court"], [class*="jurisdiction"]');
      if (courtEl) court = courtEl.textContent.trim();

      // Extract date
      let dateFiled = '';
      const dateEl = container.querySelector('[class*="date"], [class*="Date"], time');
      if (dateEl) dateFiled = dateEl.textContent.trim();
      if (!dateFiled) {
        const text = container.textContent || '';
        const dateMatch = text.match(/(?:Jan|Feb|Mar|Apr|May|Jun|Jul|Aug|Sep|Oct|Nov|Dec)[a-z]*\.?\s+\d{1,2},?\s+\d{4}|\d{1,2}\/\d{1,2}\/\d{4}/);
        if (dateMatch) dateFiled = dateMatch[0];
      }

      // Extract snippet
      let snippet = '';
      const snippetEl = container.querySelector('[class*="snippet"], [class*="Snippet"], [class*="synopsis"], [class*="Synopsis"], p, .headnotes');
      if (snippetEl) snippet = snippetEl.textContent.trim().slice(0, 500);
      if (!snippet) {
        // Use the container text minus the case name
        const fullText = container.textContent.replace(caseName, '').trim();
        snippet = fullText.slice(0, 300);
      }

      // URL
      let url = link.href;
      if (!url.startsWith('http')) url = 'https://1.next.westlaw.com' + url;

      results.push({
        id: `westlaw-${results.length}-${Date.now()}`,
        caseName: caseName.slice(0, 200),
        citation,
        court,
        dateFiled,
        snippet: snippet.replace(/\s+/g, ' ').trim(),
        url,
        source: 'westlaw',
      });
    });

    return results;
  }, maxResults);
}

module.exports = { searchWestlaw };
