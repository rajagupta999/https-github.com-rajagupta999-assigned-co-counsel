// Content script for the Assigned Co-Counsel web app
// Bridges between the React app and the Chrome extension background worker

(function() {
  'use strict';

  console.log('[ACC Agent] Extension connected to Research Desk');

  // Expose extension availability to the React app via window
  window.__ACC_EXTENSION__ = {
    available: true,
    version: '1.0.0',
    sources: ['westlaw'], // Will expand to lexisnexis, bloomberg, etc.
  };

  // Dispatch custom event so React app knows extension is loaded
  window.dispatchEvent(new CustomEvent('acc-extension-ready', {
    detail: { version: '1.0.0', sources: ['westlaw'] }
  }));

  // Listen for search requests from the React app (via CustomEvent)
  window.addEventListener('acc-agent-search', (event) => {
    const { jobId, query, source, credentials } = event.detail;
    console.log('[ACC Agent] Search request from app:', source, query);

    chrome.runtime.sendMessage({
      type: 'ACC_SEARCH_REQUEST',
      jobId,
      query,
      source,
      credentials,
    }, (response) => {
      if (response?.ok) {
        window.dispatchEvent(new CustomEvent('acc-agent-status', {
          detail: { jobId, status: 'started', message: `Opening ${source}...` }
        }));
      }
    });
  });

  // Listen for cancel requests
  window.addEventListener('acc-agent-cancel', (event) => {
    const { jobId } = event.detail;
    chrome.runtime.sendMessage({ type: 'CANCEL_JOB', jobId });
  });

  // Forward messages from background to the React app
  chrome.runtime.onMessage.addListener((msg, sender, sendResponse) => {
    if (msg.type === 'AGENT_STATUS') {
      window.dispatchEvent(new CustomEvent('acc-agent-status', {
        detail: { jobId: msg.jobId, status: msg.status, message: msg.message }
      }));
    } else if (msg.type === 'AGENT_RESULTS') {
      window.dispatchEvent(new CustomEvent('acc-agent-results', {
        detail: {
          jobId: msg.jobId,
          source: msg.source,
          results: msg.results,
          resultCount: msg.resultCount,
        }
      }));
    } else if (msg.type === 'AGENT_ERROR') {
      window.dispatchEvent(new CustomEvent('acc-agent-error', {
        detail: { jobId: msg.jobId, error: msg.error }
      }));
    }
    sendResponse({ ok: true });
    return true;
  });
})();
