const express = require('express');
const path = require('path');
const fs = require('fs');
const { scrape } = require('./scraper');

const app = express();
const PORT = process.env.PORT || 3000;
const DATA_FILE = path.join(__dirname, '..', 'data', 'builds.json');

app.use(express.static(path.join(__dirname, '..', 'public')));

// ── API: get cached data ─────────────────────────────────────────────────────
app.get('/api/data', (req, res) => {
  if (!fs.existsSync(DATA_FILE)) {
    return res.json({ extractedAt: null, customers: [] });
  }
  try {
    const data = JSON.parse(fs.readFileSync(DATA_FILE, 'utf8'));
    res.json(data);
  } catch {
    res.status(500).json({ error: 'Failed to read data file' });
  }
});

// ── API: trigger scrape on demand ────────────────────────────────────────────
app.post('/api/scrape', async (req, res) => {
  // Immediately acknowledge — scraping takes time (manual login may take minutes)
  res.json({ status: 'started', message: 'Scrape started. Check the browser window to log in. Data will update when complete.' });

  try {
    await scrape();
    console.log('Scrape completed successfully.');
  } catch (err) {
    console.error('Scrape error:', err.message);
  }
});

// ── API: check if data exists and its age ────────────────────────────────────
app.get('/api/status', (req, res) => {
  if (!fs.existsSync(DATA_FILE)) {
    return res.json({ hasData: false, extractedAt: null, ageMinutes: null });
  }
  const data = JSON.parse(fs.readFileSync(DATA_FILE, 'utf8'));
  const ageMs = Date.now() - new Date(data.extractedAt).getTime();
  res.json({
    hasData: true,
    extractedAt: data.extractedAt,
    ageMinutes: Math.round(ageMs / 60000),
    customerCount: data.customers?.length || 0,
  });
});

app.listen(PORT, () => {
  console.log('');
  console.log('==============================================');
  console.log(`  OVCD Dashboard running at:`);
  console.log(`  http://localhost:${PORT}`);
  console.log('==============================================');
  console.log('');
});
