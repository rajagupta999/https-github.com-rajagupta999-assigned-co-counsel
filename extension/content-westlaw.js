// Content script for Westlaw search/results pages
// Scrapes search results and sends them back to the ACC extension

(function() {
  'use strict';

  console.log('[ACC Agent] Westlaw page loaded:', window.location.href);

  // Check if this is a search results page
  const isResultsPage = window.location.href.includes('/Search/Results') ||
                        window.location.href.includes('/search/results');

  // Get our job info from background
  chrome.runtime.sendMessage({ type: 'GET_JOB' }, (response) => {
    if (response?.ok && response.job) {
      if (isResultsPage) {
        // Wait for results to load, then scrape
        waitForResults().then(results => {
          chrome.runtime.sendMessage({
            type: 'WESTLAW_RESULTS_READY',
            results: results,
          });
        });
      } else if (isSearchPage()) {
        // We're on the main Westlaw page — need to execute search
        chrome.runtime.sendMessage({ type: 'WESTLAW_SEARCH_READY' });
      }
    }
  });

  // Listen for search execution command
  chrome.runtime.onMessage.addListener((msg, sender, sendResponse) => {
    if (msg.type === 'EXECUTE_SEARCH') {
      executeSearch(msg.query);
      sendResponse({ ok: true });
    }
    return true;
  });

  function isSearchPage() {
    return window.location.pathname === '/' ||
           window.location.pathname.includes('/Home') ||
           window.location.pathname.includes('/home');
  }

  function executeSearch(query) {
    // Find the Westlaw search box and fill it
    const searchSelectors = [
      '#searchInputId',
      '#co_search_searchBoxInput',
      'input[name="query"]',
      'textarea[name="query"]',
      '#search-input',
      'input[aria-label*="Search" i]',
      'textarea[aria-label*="Search" i]',
      '.search-input input',
      '.search-input textarea',
    ];

    let searchBox = null;
    for (const sel of searchSelectors) {
      searchBox = document.querySelector(sel);
      if (searchBox) break;
    }

    if (searchBox) {
      // Set value using native setter for React compatibility
      const setter = Object.getOwnPropertyDescriptor(
        searchBox.tagName === 'TEXTAREA' ? window.HTMLTextAreaElement.prototype : window.HTMLInputElement.prototype,
        'value'
      ).set;
      setter.call(searchBox, query);
      searchBox.dispatchEvent(new Event('input', { bubbles: true }));
      searchBox.dispatchEvent(new Event('change', { bubbles: true }));

      // Click the search button
      setTimeout(() => {
        const submitSelectors = [
          '#searchButton',
          '#co_search_searchButton',
          'button[type="submit"]',
          'button[aria-label*="Search" i]',
          '.search-button',
          'button.search',
        ];

        for (const sel of submitSelectors) {
          const btn = document.querySelector(sel);
          if (btn) {
            btn.click();
            console.log('[ACC Agent] Search submitted via', sel);
            showAgentBanner('🔍 Searching Westlaw for: ' + query);
            return;
          }
        }

        // Fallback: press Enter
        searchBox.dispatchEvent(new KeyboardEvent('keydown', { key: 'Enter', code: 'Enter', keyCode: 13, bubbles: true }));
        console.log('[ACC Agent] Search submitted via Enter key');
      }, 500);
    } else {
      // Navigate directly to search URL
      window.location.href = `https://1.next.westlaw.com/Search/Results.html?query=${encodeURIComponent(query)}&jurisdiction=ALLCASES&contentType=CASE`;
    }
  }

  function waitForResults() {
    return new Promise((resolve) => {
      let attempts = 0;
      const maxAttempts = 30; // 30 seconds max

      showAgentBanner('⏳ Waiting for Westlaw results...');

      const check = setInterval(() => {
        attempts++;
        const results = scrapeResults();

        if (results.length > 0 || attempts >= maxAttempts) {
          clearInterval(check);
          if (results.length > 0) {
            showAgentBanner(`✅ Found ${results.length} results — sending to Research Desk`);
          } else {
            showAgentBanner('⚠️ No results found on this page');
          }
          resolve(results);
        }
      }, 1000);
    });
  }

  function scrapeResults() {
    const results = [];

    // Westlaw Next result item selectors
    const resultSelectors = [
      '#co_searchResults_citation_list .result',
      '.search-results-list .result-item',
      '[id*="searchResults"] .co_searchResult',
      '.westlaw-result__container',
      '#co_document_0, #co_document_1, #co_document_2, #co_document_3, #co_document_4, #co_document_5, #co_document_6, #co_document_7, #co_document_8, #co_document_9',
      '.result-list .result',
      '[data-testid="result-item"]',
      '.document-list .document-item',
    ];

    let resultElements = [];
    for (const sel of resultSelectors) {
      resultElements = document.querySelectorAll(sel);
      if (resultElements.length > 0) break;
    }

    // Fallback: try generic approach
    if (resultElements.length === 0) {
      // Look for any container with case name patterns
      const allLinks = document.querySelectorAll('a[href*="/Document/"]');
      const seen = new Set();
      allLinks.forEach(link => {
        const container = link.closest('li, .result, [class*="result"], [class*="document"]') || link.parentElement;
        if (container && !seen.has(container)) {
          seen.add(container);
          resultElements = [...(resultElements || []), container];
        }
      });
      if (Array.isArray(resultElements)) {
        resultElements = { length: resultElements.length, ...resultElements };
      }
    }

    // Extract data from each result
    for (let i = 0; i < Math.min(resultElements.length || 0, 20); i++) {
      const el = resultElements[i];
      if (!el) continue;

      const result = extractResultData(el, i);
      if (result.caseName && result.caseName !== 'Untitled') {
        results.push(result);
      }
    }

    console.log('[ACC Agent] Scraped', results.length, 'results from Westlaw');
    return results;
  }

  function extractResultData(el, index) {
    // Try multiple strategies to extract case data

    // Case name
    const nameSelectors = [
      '.co_searchResult_title a',
      '.result-title a',
      'a[class*="title"]',
      'h3 a', 'h2 a',
      'a[href*="/Document/"]',
    ];
    let caseName = 'Untitled';
    for (const sel of nameSelectors) {
      const nameEl = el.querySelector(sel);
      if (nameEl?.textContent?.trim()) {
        caseName = nameEl.textContent.trim();
        break;
      }
    }

    // Citation
    const citeSelectors = [
      '.co_searchResult_citation',
      '.result-citation',
      '[class*="citation"]',
      '.cite',
    ];
    let citation = '';
    for (const sel of citeSelectors) {
      const citeEl = el.querySelector(sel);
      if (citeEl?.textContent?.trim()) {
        citation = citeEl.textContent.trim();
        break;
      }
    }

    // Court
    const courtSelectors = [
      '.co_searchResult_court',
      '.result-court',
      '[class*="court"]',
    ];
    let court = '';
    for (const sel of courtSelectors) {
      const courtEl = el.querySelector(sel);
      if (courtEl?.textContent?.trim()) {
        court = courtEl.textContent.trim();
        break;
      }
    }

    // Date
    const dateSelectors = [
      '.co_searchResult_date',
      '.result-date',
      '[class*="date"]',
      'time',
    ];
    let dateFiled = '';
    for (const sel of dateSelectors) {
      const dateEl = el.querySelector(sel);
      if (dateEl?.textContent?.trim()) {
        dateFiled = dateEl.textContent.trim();
        break;
      }
    }

    // Snippet/synopsis
    const snippetSelectors = [
      '.co_snippet',
      '.result-snippet',
      '.synopsis',
      '[class*="snippet"]',
      '[class*="synopsis"]',
      'p',
    ];
    let snippet = '';
    for (const sel of snippetSelectors) {
      const snippetEl = el.querySelector(sel);
      if (snippetEl?.textContent?.trim() && snippetEl.textContent.trim().length > 20) {
        snippet = snippetEl.textContent.trim().slice(0, 500);
        break;
      }
    }

    // URL
    let url = '';
    const linkEl = el.querySelector('a[href*="/Document/"]') || el.querySelector('a[href]');
    if (linkEl) {
      url = linkEl.href;
      if (!url.startsWith('http')) {
        url = 'https://1.next.westlaw.com' + url;
      }
    }

    return {
      id: `westlaw-${index}-${Date.now()}`,
      caseName,
      citation,
      court,
      dateFiled,
      snippet,
      url,
      source: 'westlaw',
    };
  }

  function showAgentBanner(text) {
    // Remove existing banner
    const existing = document.getElementById('acc-agent-banner');
    if (existing) existing.remove();

    const banner = document.createElement('div');
    banner.id = 'acc-agent-banner';
    banner.style.cssText = `
      position: fixed; top: 0; left: 0; right: 0; z-index: 999999;
      background: linear-gradient(135deg, #1e1b4b, #312e81);
      color: white; padding: 10px 20px; font-size: 13px;
      font-family: -apple-system, BlinkMacSystemFont, sans-serif;
      display: flex; align-items: center; gap: 8px;
      box-shadow: 0 2px 10px rgba(0,0,0,0.3);
      transition: opacity 0.3s;
    `;
    banner.innerHTML = `
      <span style="font-size: 16px;">⚖️</span>
      <span style="flex:1">${text}</span>
      <span style="font-size: 10px; opacity: 0.7;">Assigned Co-Counsel Agent</span>
      <button onclick="this.parentElement.remove()" style="
        margin-left: 12px; background: rgba(255,255,255,0.2); border: none;
        color: white; padding: 4px 12px; border-radius: 6px; cursor: pointer;
        font-size: 11px;
      ">✕</button>
    `;
    document.body.prepend(banner);
  }
})();
