// Assigned Co-Counsel — Agentic Research Background Service Worker
// Orchestrates the search flow: ACC tab → premium source tab → scrape → return results

const WESTLAW_SEARCH_URL = 'https://1.next.westlaw.com/Search/Results.html';
const WESTLAW_LOGIN_URL = 'https://signon.thomsonreuters.com/v2';

let activeJobs = new Map(); // jobId → { query, source, accTabId, sourceTabId, status }

// Listen for messages from ACC content script and source content scripts
chrome.runtime.onMessage.addListener((msg, sender, sendResponse) => {
  console.log('[ACC Agent] Message received:', msg.type, msg);

  switch (msg.type) {
    case 'ACC_SEARCH_REQUEST':
      handleSearchRequest(msg, sender);
      sendResponse({ ok: true, jobId: msg.jobId });
      break;

    case 'WESTLAW_LOGIN_READY':
      handleWestlawLoginReady(msg, sender);
      sendResponse({ ok: true });
      break;

    case 'WESTLAW_LOGGED_IN':
      handleWestlawLoggedIn(msg, sender);
      sendResponse({ ok: true });
      break;

    case 'WESTLAW_RESULTS_READY':
      handleWestlawResults(msg, sender);
      sendResponse({ ok: true });
      break;

    case 'WESTLAW_SEARCH_READY':
      handleWestlawSearchReady(msg, sender);
      sendResponse({ ok: true });
      break;

    case 'GET_JOB':
      const job = findJobForTab(sender.tab?.id);
      sendResponse({ ok: true, job: job || null });
      break;

    case 'CANCEL_JOB':
      cancelJob(msg.jobId);
      sendResponse({ ok: true });
      break;

    default:
      sendResponse({ ok: false, error: 'Unknown message type' });
  }

  return true; // Keep message channel open for async
});

function findJobForTab(tabId) {
  for (const [jobId, job] of activeJobs) {
    if (job.sourceTabId === tabId) return { ...job, jobId };
  }
  return null;
}

async function handleSearchRequest(msg, sender) {
  const { jobId, query, source, credentials } = msg;
  const accTabId = sender.tab?.id;

  const job = {
    jobId,
    query,
    source,
    credentials,
    accTabId,
    sourceTabId: null,
    status: 'starting',
    startedAt: Date.now(),
  };

  activeJobs.set(jobId, job);

  if (source === 'westlaw') {
    await startWestlawSearch(job);
  }
  // Future: lexisnexis, bloomberg, etc.
}

async function startWestlawSearch(job) {
  try {
    // Open tab in background (not active) — user doesn't need to see it
    // Go directly to search URL — if session is active, it'll work
    // If session expired, we'll detect the redirect to login and handle it
    const searchUrl = `${WESTLAW_SEARCH_URL}?query=${encodeURIComponent(job.query)}&jurisdiction=ALLCASES&contentType=CASE`;

    const tab = await chrome.tabs.create({
      url: searchUrl,
      active: false, // Background tab — invisible to user
    });

    job.sourceTabId = tab.id;
    job.status = 'searching';
    job.autoMode = true; // Fully automatic — no user interaction needed
    activeJobs.set(job.jobId, job);

    notifyAccTab(job, { type: 'AGENT_STATUS', jobId: job.jobId, status: 'searching', message: 'Searching Westlaw in background...' });

    // Set a timeout — if no results after 20s, check if we need login
    job.loginTimeout = setTimeout(async () => {
      const currentJob = activeJobs.get(job.jobId);
      if (currentJob && currentJob.status === 'searching') {
        // Still searching — might be stuck at login
        // Check the tab URL
        try {
          const tabInfo = await chrome.tabs.get(tab.id);
          if (tabInfo.url?.includes('signon.thomsonreuters.com')) {
            // Redirected to login — need credentials
            currentJob.status = 'needs_login';
            activeJobs.set(job.jobId, currentJob);

            if (currentJob.credentials) {
              // Auto-fill and auto-submit
              notifyAccTab(currentJob, { type: 'AGENT_STATUS', jobId: job.jobId, status: 'auto_login', message: 'Session expired — logging in automatically...' });
            } else {
              // Need user to sign in — bring tab to front
              await chrome.tabs.update(tab.id, { active: true });
              notifyAccTab(currentJob, { type: 'AGENT_STATUS', jobId: job.jobId, status: 'awaiting_login', message: 'Please sign into Westlaw — first time only' });
            }
          }
        } catch (e) {
          // Tab might be closed
        }
      }
    }, 8000);
  } catch (err) {
    console.error('[ACC Agent] Error starting Westlaw search:', err);
    job.status = 'error';
    notifyAccTab(job, { type: 'AGENT_ERROR', jobId: job.jobId, error: err.message });
  }
}

async function handleWestlawLoginReady(msg, sender) {
  // Login page loaded — pre-fill credentials if we have them
  const job = findJobForTab(sender.tab?.id);
  if (!job || !job.credentials) return;

  // Send credentials to the login content script
  try {
    await chrome.tabs.sendMessage(sender.tab.id, {
      type: 'FILL_CREDENTIALS',
      username: job.credentials.username,
      password: job.credentials.password,
    });
    notifyAccTab(job, { type: 'AGENT_STATUS', jobId: job.jobId, status: 'credentials_filled', message: 'Credentials pre-filled — click Sign In to continue' });
  } catch (err) {
    console.error('[ACC Agent] Error filling credentials:', err);
  }
}

async function handleWestlawLoggedIn(msg, sender) {
  // User signed in — now navigate to search
  const job = findJobForTab(sender.tab?.id);
  if (!job) return;

  job.status = 'searching';
  activeJobs.set(job.jobId, job);

  const searchUrl = `${WESTLAW_SEARCH_URL}?query=${encodeURIComponent(job.query)}&jurisdiction=ALLCASES&contentType=CASE`;
  await chrome.tabs.update(sender.tab.id, { url: searchUrl });

  notifyAccTab(job, { type: 'AGENT_STATUS', jobId: job.jobId, status: 'searching', message: 'Searching Westlaw...' });
}

async function handleWestlawSearchReady(msg, sender) {
  // Westlaw search page loaded — if we need to type query and submit
  const job = findJobForTab(sender.tab?.id);
  if (!job) return;

  try {
    await chrome.tabs.sendMessage(sender.tab.id, {
      type: 'EXECUTE_SEARCH',
      query: job.query,
    });
  } catch (err) {
    console.error('[ACC Agent] Error executing search:', err);
  }
}

async function handleWestlawResults(msg, sender) {
  // Got results from Westlaw content script
  const job = findJobForTab(sender.tab?.id);
  if (!job) return;

  job.status = 'complete';
  activeJobs.set(job.jobId, job);

  // Send results back to ACC tab
  notifyAccTab(job, {
    type: 'AGENT_RESULTS',
    jobId: job.jobId,
    source: 'westlaw',
    results: msg.results,
    resultCount: msg.results.length,
  });

  // Auto-close the background tab immediately — user never needs to see it
  if (job.loginTimeout) clearTimeout(job.loginTimeout);
  setTimeout(() => {
    if (job.sourceTabId) {
      chrome.tabs.remove(job.sourceTabId).catch(() => {});
    }
    activeJobs.delete(job.jobId);
  }, 500);
}

function notifyAccTab(job, message) {
  if (job.accTabId) {
    chrome.tabs.sendMessage(job.accTabId, message).catch(err => {
      console.warn('[ACC Agent] Could not notify ACC tab:', err);
    });
  }
}

function cancelJob(jobId) {
  const job = activeJobs.get(jobId);
  if (job) {
    if (job.sourceTabId) {
      chrome.tabs.remove(job.sourceTabId).catch(() => {});
    }
    activeJobs.delete(jobId);
  }
}

// Clean up stale jobs every 5 minutes
setInterval(() => {
  const now = Date.now();
  for (const [jobId, job] of activeJobs) {
    if (now - job.startedAt > 5 * 60 * 1000) {
      cancelJob(jobId);
    }
  }
}, 60000);
