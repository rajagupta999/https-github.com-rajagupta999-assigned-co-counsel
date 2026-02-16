const express = require('express');
const cors = require('cors');
const { searchWestlaw } = require('./sources/westlaw');
const { searchLexisNexis } = require('./sources/lexisnexis');
const { searchBloomberg } = require('./sources/bloomberg');
const { searchFastcase } = require('./sources/fastcase');

const app = express();
app.use(cors({ origin: true }));
app.use(express.json());

// Auth middleware — simple shared secret for now
const API_SECRET = process.env.API_SECRET || 'acc-agent-dev-key';

function authMiddleware(req, res, next) {
  const auth = req.headers.authorization;
  if (!auth || auth !== `Bearer ${API_SECRET}`) {
    return res.status(401).json({ error: 'Unauthorized' });
  }
  next();
}

// Health check (no auth)
app.get('/health', (req, res) => {
  res.json({ status: 'ok', service: 'acc-agent', version: '1.0.0', sources: ['westlaw', 'lexisnexis', 'bloomberg', 'fastcase'] });
});

// Unified search endpoint
app.post('/search', authMiddleware, async (req, res) => {
  const { query, source, credentials, maxResults = 15 } = req.body;

  if (!query || !source || !credentials) {
    return res.status(400).json({ error: 'Missing query, source, or credentials' });
  }

  console.log(`[Agent] Searching ${source} for: "${query}"`);
  const startTime = Date.now();

  try {
    let results;
    switch (source) {
      case 'westlaw':
        results = await searchWestlaw(query, credentials, maxResults);
        break;
      case 'lexisnexis':
        results = await searchLexisNexis(query, credentials, maxResults);
        break;
      case 'bloomberg':
        results = await searchBloomberg(query, credentials, maxResults);
        break;
      case 'fastcase':
        results = await searchFastcase(query, credentials, maxResults);
        break;
      default:
        return res.status(400).json({ error: `Unsupported source: ${source}` });
    }

    const elapsed = Date.now() - startTime;
    console.log(`[Agent] ${source}: ${results.length} results in ${elapsed}ms`);

    res.json({
      source,
      query,
      results,
      resultCount: results.length,
      elapsedMs: elapsed,
    });
  } catch (err) {
    console.error(`[Agent] ${source} error:`, err.message);
    res.status(500).json({
      error: err.message,
      source,
      hint: err.message.includes('login') ? 'Check credentials' : 'Search failed — try again',
    });
  }
});

const PORT = process.env.PORT || 8080;
app.listen(PORT, () => {
  console.log(`[Agent] Agentic Research Service running on port ${PORT}`);
});
