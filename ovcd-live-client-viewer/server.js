const express = require('express');
const fs = require('node:fs');
const path = require('node:path');
const { chromium } = require('playwright');

const app = express();
const port = Number(process.env.PORT || 4177);
const siteUrl = process.env.OVCD_URL || 'https://ovcd.oneviewhealthcare.com/Clients?liveStatus=Live&isSite=true&includedInStats=true';
const profileDir = path.join(__dirname, '.playwright-profile');
const snapshotPath = path.join(__dirname, 'data', 'last-good-state.json');

let browserContext;
let lastResult = loadLastGoodResult();
let refreshPromise = null;

app.use(express.static(path.join(__dirname, 'public')));

app.get('/api/status', (_request, response) => {
  response.json({
    siteUrl,
    refreshing: Boolean(refreshPromise),
    lastFetchedAt: lastResult?.fetchedAt || null,
    clientCount: lastResult?.clients?.length || 0,
    message: lastResult?.message || null
  });
});

app.get('/api/clients', (_request, response) => {
  response.json(lastResult || { clients: [], fetchedAt: null, message: 'No data fetched yet.' });
});

app.post('/api/refresh', async (_request, response) => {
  if (refreshPromise) {
    response.status(202).json({ message: 'A refresh is already running.' });
    return;
  }

  refreshPromise = refreshClients().finally(() => {
    refreshPromise = null;
  });

  try {
    const result = await refreshPromise;
    response.json(result);
  } catch (error) {
    response.status(500).json({
      clients: [],
      fetchedAt: new Date().toISOString(),
      message: error.message
    });
  }
});

async function getContext() {
  if (!browserContext) {
    browserContext = await chromium.launchPersistentContext(profileDir, {
      headless: false,
      viewport: { width: 1440, height: 1000 },
      acceptDownloads: false
    });
  }
  return browserContext;
}

async function refreshClients() {
  const context = await getContext();
  const page = context.pages()[0] || await context.newPage();

  await page.goto(siteUrl, { waitUntil: 'domcontentloaded' });
  await page.waitForLoadState('networkidle', { timeout: 15000 }).catch(() => {});
  await page.waitForTimeout(5000);

  const showSelectIndex = await page.locator('select').evaluateAll((selects) => selects.findIndex((select) =>
    [...select.options].some((option) => option.textContent.trim() === '100')
  ));
  if (showSelectIndex >= 0) {
    await page.locator('select').nth(showSelectIndex).selectOption({ label: '100' });
    await page.waitForTimeout(500);
  }

  const snapshot = await page.evaluate(() => {
    const clean = (value) => (value || '').replace(/\s+/g, ' ').trim();
    const tableRows = [...document.querySelectorAll('tr')];
    const rows = tableRows.map((row) => clean(row.innerText)).filter(Boolean);
    const rowDetails = tableRows
      .map((row) => [...row.querySelectorAll('th, td')].map((cell) => clean(cell.innerText)))
      .filter((cells) => cells.some((cell) => /\blive\b/i.test(cell)));
    const rowRecords = tableRows
      .map((row) => {
        const cells = [...row.querySelectorAll('th, td')].map((cell) => clean(cell.innerText));
        const detailLink = [...row.querySelectorAll('a[href*="/Clients/Details/"]')][0];
        return { cells, detailUrl: detailLink?.href || '' };
      })
      .filter((record) => /\blive\b/i.test(record.cells[4] || ''));
    const cards = [...document.querySelectorAll('[role="row"], [role="listitem"], article, .card')]
      .map((item) => clean(item.innerText))
      .filter(Boolean);
    const bodyText = clean(document.body.innerText);
    return { rows: [...new Set([...rows, ...cards])], rowDetails, rowRecords, bodyText };
  });

  const pageTitle = await page.title();
  const isMicrosoftSignIn = /login\.microsoftonline\.com/i.test(page.url()) || /sign in to your account/i.test(pageTitle);
  const candidates = snapshot.rows.filter((text) => /\blive\b/i.test(text));
  const clients = snapshot.rowDetails.length
    ? snapshot.rowDetails
        .filter((cells) => /\blive\b/i.test(cells[4] || ''))
        .map((cells) => parseClient(cells.join(' '), cells))
    : candidates.map(parseClient);

  const detailPage = await context.newPage();
  for (const record of snapshot.rowRecords) {
    const client = clients.find((item) => item.name === record.cells[0]);
    if (!client || !record.detailUrl) {
      continue;
    }

    try {
      await detailPage.goto(record.detailUrl, { waitUntil: 'domcontentloaded' });
      await detailPage.waitForLoadState('networkidle', { timeout: 15000 }).catch(() => {});
      await detailPage.waitForTimeout(500);
      const detailText = await detailPage.locator('body').innerText();
      const detail = parseEnvironmentDetails(detailText);
      for (const [field, value] of Object.entries(detail)) {
        if (value) {
          client[field] = value;
        }
      }
    } catch (_error) {
    }
  }
  await detailPage.close();

  const result = {
    clients,
    fetchedAt: new Date().toISOString(),
    message: isMicrosoftSignIn
      ? 'SSO is required. Complete sign-in in the Playwright browser window, then press Refresh data again.'
      : clients.length
        ? null
        : 'No Live client rows were detected. The site may still need SSO, or its table selectors need tuning.',
    diagnostics: {
      candidateCount: candidates.length,
      sampleRows: candidates.slice(0, 5),
      rowDetails: snapshot.rowDetails.slice(0, 5),
      detailCount: snapshot.rowRecords.filter((record) => record.detailUrl).length,
      testDataCount: clients.filter((client) => client.testVersion || client.testDate).length,
      pageTextSample: snapshot.bodyText.slice(0, 4000),
      pageTitle,
      currentUrl: page.url()
    }
  };
  if (clients.length) {
    lastResult = {
      ...result,
      snapshotSavedAt: saveLastGoodResult(result),
      fromSnapshot: false
    };
    return lastResult;
  }

  return lastResult
    ? { ...lastResult, message: `${result.message} Showing the last good snapshot.` }
    : result;
}

function loadLastGoodResult() {
  try {
    const saved = JSON.parse(fs.readFileSync(snapshotPath, 'utf8'));
    if (Array.isArray(saved.clients) && saved.clients.length) {
      return { ...saved, fromSnapshot: true };
    }
  } catch (_error) {
  }
  return null;
}

function saveLastGoodResult(result) {
  const snapshotSavedAt = new Date().toISOString();
  fs.mkdirSync(path.dirname(snapshotPath), { recursive: true });
  fs.writeFileSync(snapshotPath, JSON.stringify({ ...result, snapshotSavedAt }, null, 2));
  return snapshotSavedAt;
}

function parseClient(text, cells = []) {
  const normalized = text.replace(/\s+/g, ' ').trim();
  const versionMatches = [...normalized.matchAll(/(?:prod(?:uction)?|test)\s*(?:version|ver(?:sion)?)?\s*[:#-]?\s*([0-9][\w.-]*)/gi)];
  const dateMatches = [...normalized.matchAll(/(?:last\s+)?(?:installed|upgraded|install|upgrade)[^0-9]*(\d{1,4}[\/.-]\d{1,2}[\/.-]\d{1,4}|\d{1,2}\s+[A-Za-z]{3,9}\s+\d{2,4}|[A-Za-z]{3,9}\s+\d{1,2},?\s+\d{2,4})/gi)];
  const name = normalized.split(/\b(?:live|prod(?:uction)?|test)\b/i)[0].replace(/[|,:;-]+$/, '').trim();

  return {
    name: cells[0] || name || normalized.slice(0, 100),
    status: 'Live',
    productionVersion: cells[2] || versionMatches.find((match) => /prod/i.test(match[0]))?.[1] || '',
    productionDate: dateMatches[0]?.[1] || '',
    testVersion: versionMatches.find((match) => /test/i.test(match[0]))?.[1] || '',
    testDate: dateMatches[1]?.[1] || '',
    sourceText: normalized
  };
}

function parseEnvironmentDetails(text) {
  const normalized = text.replace(/\s+/g, ' ').trim();
  const production = normalized.match(/PROD Environment.*?Prod Version Number\s+([^\s]+).*?Last Installed\/Upgraded Date\s+([^\s]+)/i);
  const test = normalized.match(/TEST Environment.*?TEST Version Number\s+([^\s]+).*?Last Installed\/Upgraded Date\s+([^\s]+)/i);
  const count = (label) => normalized.match(new RegExp(`${label}\\s*[:#-]?\\s*(\\d+)`, 'i'))?.[1] || '';

  return {
    productionVersion: production?.[1] || '',
    productionDate: production?.[2] || '',
    testVersion: test?.[1] || '',
    testDate: test?.[2] || '',
    tabletsCount: count('Tablets Count'),
    stbCount: count('STB Count'),
    tvCount: count('TV Count'),
    aioCount: count('AIO Count'),
    ddsCount: count('DDS Count'),
    dwbDeviceCount: count('DWB Device Count')
  };
}

app.listen(port, () => {
  console.log(`OVCD Live Client Viewer running at http://localhost:${port}`);
});

process.on('SIGINT', async () => {
  await browserContext?.close();
  process.exit(0);
});