/**
 * OVCD Scraper
 * Opens a visible browser for manual login, then extracts customer/build data.
 * For scheduled runs: set OVCD_USERNAME and OVCD_PASSWORD env vars to skip manual login.
 */

const { chromium } = require('playwright');
const fs = require('fs');
const path = require('path');

const OVCD_URL = 'https://ovcd.oneviewhealthcare.com/';
const DATA_FILE = path.join(__dirname, '..', 'data', 'builds.json');
const DEBUG_DIR = path.join(__dirname, '..', 'data', 'debug');

async function scrape() {
  const useEnvCredentials = process.env.OVCD_USERNAME && process.env.OVCD_PASSWORD;

  const browser = await chromium.launch({
    headless: useEnvCredentials ? true : false,
    slowMo: useEnvCredentials ? 0 : 50,
  });

  const context = await browser.newContext();
  const page = await context.newPage();

  console.log('Opening OVCD...');
  await page.goto(OVCD_URL);

  if (useEnvCredentials) {
    console.log('Using environment credentials...');
    await autoLogin(page);
  } else {
    console.log('');
    console.log('==============================================');
    console.log('  Please log in to OVCD in the browser window');
    console.log('  The scraper will continue automatically');
    console.log('  once it detects you are logged in...');
    console.log('==============================================');
    console.log('');
    await waitForLogin(page);
  }

  console.log('Logged in! Starting data extraction...');
  console.log(`Current URL: ${page.url()}`);

  const data = await extractData(page);

  if (!data.length) {
    console.warn('No customers extracted. Capturing debug artifacts...');
    await captureDebugArtifacts(page, 'empty-results');
    console.warn(`Debug files written to: ${DEBUG_DIR}`);
  }

  await browser.close();

  const dataDir = path.dirname(DATA_FILE);
  if (!fs.existsSync(dataDir)) {
    fs.mkdirSync(dataDir, { recursive: true });
  }

  const output = {
    extractedAt: new Date().toISOString(),
    customers: data,
  };

  fs.writeFileSync(DATA_FILE, JSON.stringify(output, null, 2));
  console.log(`\nData saved to ${DATA_FILE}`);
  console.log(`Found ${data.length} customers.`);

  return output;
}

/**
 * Wait until login appears complete.
 * Uses both URL hints and login form presence because some auth flows keep URL stable.
 */
async function waitForLogin(page) {
  const timeoutMs = 5 * 60 * 1000;

  try {
    await page.waitForFunction(
      () => {
        const url = window.location.href.toLowerCase();
        const looksLikeLoginUrl =
          url.includes('login') ||
          url.includes('signin') ||
          url.includes('account/login') ||
          url.includes('/auth');

        const hasPasswordField = Boolean(
          document.querySelector('input[type="password"], input[name*="password" i]')
        );

        return !looksLikeLoginUrl && !hasPasswordField;
      },
      { timeout: timeoutMs }
    );
  } catch (error) {
    console.error(`Login was not detected within ${Math.round(timeoutMs / 60000)} minutes.`);
    console.error(`Current URL at timeout: ${page.url()}`);
    await captureDebugArtifacts(page, 'login-timeout');
    throw error;
  }
}

/**
 * Automated login using environment credentials.
 * UPDATE the selectors below to match OVCD's actual login form.
 */
async function autoLogin(page) {
  await page.fill('input[type="email"], input[name="username"], input[name="email"]', process.env.OVCD_USERNAME);
  await page.fill('input[type="password"]', process.env.OVCD_PASSWORD);
  await page.click('button[type="submit"], input[type="submit"]');
  await page.waitForNavigation({ waitUntil: 'networkidle' });
}

/**
 * Extract customer and build data from the OVCD dashboard.
 * This still requires selector tuning for the real OVCD DOM.
 */
async function extractData(page) {
  await navigateToClientsPage(page);
  await page.waitForLoadState('networkidle');

  const allCustomers = [];
  const seen = new Set();
  const maxPages = 50;

  for (let i = 0; i < maxPages; i++) {
    const result = await extractCurrentClientsPage(page);

    for (const customer of result.customers) {
      const key = [
        customer.name,
        customer.prodCurrentBuild,
        customer.prodFutureBuild,
        customer.testCurrentBuild,
        customer.testFutureBuild,
      ].join('|');

      if (!seen.has(key)) {
        seen.add(key);
        allCustomers.push(customer);
      }
    }

    console.log(
      `Clients page ${result.currentPage || i + 1}: rows=${result.rowCount}, extracted=${result.customerCount}, total=${allCustomers.length}`
    );

    if (!result.hasNext) {
      break;
    }

    const signatureBefore = `${result.currentPage || i + 1}|${result.firstRow || ''}`;
    const moved = await clickNextClientsPage(page);

    if (!moved) {
      break;
    }

    try {
      await page.waitForFunction(
        previousSignature => {
          const currentPageEl = document.querySelector('.dataTables_paginate .paginate_button.current, .pagination .active');
          const currentPage = (currentPageEl?.textContent || '').trim();
          const firstRow = (document.querySelector('table tbody tr td')?.textContent || '').trim();
          return `${currentPage}|${firstRow}` !== previousSignature;
        },
        signatureBefore,
        { timeout: 10000 }
      );
    } catch {
      // Some table implementations update in-place without reliable page markers.
      await page.waitForLoadState('networkidle');
    }
  }

  return allCustomers;
}

async function extractCurrentClientsPage(page) {
  return page.evaluate(() => {
    const table =
      document.querySelector('table.table') ||
      document.querySelector('table[data-table]') ||
      document.querySelector('table');

    if (!table) {
      return {
        rowCount: 0,
        customerCount: 0,
        currentPage: null,
        firstRow: '',
        hasNext: false,
        title: document.title,
        customers: [],
      };
    }

    const headers = Array.from(table.querySelectorAll('thead th')).map(th =>
      (th.textContent || '').trim().toLowerCase()
    );

    const headerIndex = (matcher, fallbackIndex) => {
      const idx = headers.findIndex(matcher);
      return idx >= 0 ? idx : fallbackIndex;
    };

    const nameIdx = headerIndex(h => h.includes('client') || h.includes('customer') || h.includes('name'), 0);
    const statusIdx = headerIndex(h => h.includes('status') || h.includes('live'), 1);
    const prodCurrentIdx = headerIndex(h => h.includes('prod') && h.includes('current') && h.includes('build'), 2);
    const prodFutureIdx = headerIndex(h => h.includes('prod') && h.includes('future') && h.includes('build'), 3);
    const testCurrentIdx = headerIndex(h => h.includes('test') && h.includes('current') && h.includes('build'), 4);
    const testFutureIdx = headerIndex(h => h.includes('test') && h.includes('future') && h.includes('build'), 5);

    const rows = Array.from(table.querySelectorAll('tbody tr'));

    const customers = rows
      .map(row => {
        const cells = Array.from(row.querySelectorAll('td'));
        const cellText = index => cells[index]?.innerText?.trim() || '';

        const name =
          cellText(nameIdx) ||
          (row.querySelector('a[href*="/Clients/"]')?.textContent || '').trim();

        if (!name || /no data available/i.test(name)) {
          return null;
        }

        return {
          name,
          status: cellText(statusIdx),
          prodCurrentBuild: cellText(prodCurrentIdx),
          prodFutureBuild: cellText(prodFutureIdx),
          testCurrentBuild: cellText(testCurrentIdx),
          testFutureBuild: cellText(testFutureIdx),
          rawHtml: row.innerHTML,
        };
      })
      .filter(Boolean);

    const currentPageEl = document.querySelector('.dataTables_paginate .paginate_button.current, .pagination .active');
    const nextEl =
      document.querySelector('.dataTables_paginate .paginate_button.next') ||
      document.querySelector('#DataTables_Table_0_next') ||
      document.querySelector('.pagination .next') ||
      document.querySelector('[aria-label="Next"]');

    const nextClasses = (nextEl?.className || '').toLowerCase();
    const nextAriaDisabled = (nextEl?.getAttribute('aria-disabled') || '').toLowerCase();
    const hasNext =
      Boolean(nextEl) &&
      !nextClasses.includes('disabled') &&
      !nextClasses.includes('paginate_button_disabled') &&
      nextAriaDisabled !== 'true';

    return {
      rowCount: rows.length,
      customerCount: customers.length,
      currentPage: (currentPageEl?.textContent || '').trim() || null,
      firstRow: (rows[0]?.querySelector('td')?.textContent || '').trim(),
      hasNext,
      title: document.title,
      customers,
    };
  });
}

async function clickNextClientsPage(page) {
  return page.evaluate(() => {
    const nextEl =
      document.querySelector('.dataTables_paginate .paginate_button.next') ||
      document.querySelector('#DataTables_Table_0_next') ||
      document.querySelector('.pagination .next a, .pagination .next') ||
      document.querySelector('[aria-label="Next"]');

    if (!nextEl) {
      return false;
    }

    const classes = (nextEl.className || '').toLowerCase();
    const ariaDisabled = (nextEl.getAttribute('aria-disabled') || '').toLowerCase();
    if (
      classes.includes('disabled') ||
      classes.includes('paginate_button_disabled') ||
      ariaDisabled === 'true'
    ) {
      return false;
    }

    nextEl.click();
    return true;
  });
}

async function navigateToClientsPage(page) {
  const currentUrl = new URL(page.url());
  const clientsUrl = `${currentUrl.origin}/Clients`;

  if (!/\/clients/i.test(currentUrl.pathname)) {
    console.log(`Navigating to clients page: ${clientsUrl}`);
    await page.goto(clientsUrl, { waitUntil: 'domcontentloaded' });
  }

  await page.waitForLoadState('networkidle');

  try {
    await page.waitForSelector('table.table tbody tr, table tbody tr, .dataTables_wrapper', { timeout: 30000 });
  } catch {
    console.warn('Clients table was not detected within 30s; continuing with best-effort extraction.');
  }
}

async function captureDebugArtifacts(page, reason) {
  if (!fs.existsSync(DEBUG_DIR)) {
    fs.mkdirSync(DEBUG_DIR, { recursive: true });
  }

  const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
  const base = `${timestamp}-${reason}`;
  const screenshotPath = path.join(DEBUG_DIR, `${base}.png`);
  const htmlPath = path.join(DEBUG_DIR, `${base}.html`);
  const metaPath = path.join(DEBUG_DIR, `${base}.json`);

  await page.screenshot({ path: screenshotPath, fullPage: true });

  const html = await page.content();
  fs.writeFileSync(htmlPath, html, 'utf8');

  fs.writeFileSync(
    metaPath,
    JSON.stringify(
      {
        reason,
        url: page.url(),
        capturedAt: new Date().toISOString(),
      },
      null,
      2
    ),
    'utf8'
  );
}

if (require.main === module) {
  scrape()
    .then(() => process.exit(0))
    .catch(err => {
      console.error('Scrape failed:', err);
      process.exit(1);
    });
}

module.exports = { scrape };