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

async function scrape() {
  const useEnvCredentials = process.env.OVCD_USERNAME && process.env.OVCD_PASSWORD;

  const browser = await chromium.launch({
    headless: useEnvCredentials ? true : false, // visible for manual login
    slowMo: useEnvCredentials ? 0 : 50,
  });

  const context = await browser.newContext();
  const page = await context.newPage();

  console.log('Opening OVCD...');
  await page.goto(OVCD_URL);

  if (useEnvCredentials) {
    // ── Scheduled / automated login ──────────────────────────────────────────
    console.log('Using environment credentials...');
    await autoLogin(page);
  } else {
    // ── Manual login ─────────────────────────────────────────────────────────
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

  const data = await extractData(page);

  await browser.close();

  // Ensure data directory exists
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
 * Wait until the page URL changes away from login (manual login detection).
 * Adjust the URL pattern/selector below to match OVCD's actual login page.
 */
async function waitForLogin(page) {
  // Strategy: poll until the URL no longer contains 'login' or 'signin',
  // OR until a known post-login element appears.
  // Adjust the selector/URL check to match what OVCD actually shows after login.
  await page.waitForFunction(
    () => {
      const url = window.location.href.toLowerCase();
      return !url.includes('login') && !url.includes('signin') && !url.includes('account/login');
    },
    { timeout: 5 * 60 * 1000 } // 5 minute timeout for manual login
  );
}

/**
 * Automated login using environment credentials.
 * UPDATE the selectors below to match OVCD's actual login form.
 */
async function autoLogin(page) {
  // TODO: Update these selectors to match OVCD's actual login form
  await page.fill('input[type="email"], input[name="username"], input[name="email"]', process.env.OVCD_USERNAME);
  await page.fill('input[type="password"]', process.env.OVCD_PASSWORD);
  await page.click('button[type="submit"], input[type="submit"]');
  await page.waitForNavigation({ waitUntil: 'networkidle' });
}

/**
 * Extract customer and build data from the OVCD dashboard.
 *
 * ⚠️  This function contains placeholder logic.
 *     Run the scraper with a visible browser, inspect the DOM,
 *     then update the selectors below to match OVCD's actual structure.
 *
 * Expected output per customer:
 *   {
 *     name: "Customer Name",
 *     prodCurrentBuild: "1.2.3",
 *     prodFutureBuild:  "1.3.0",
 *     testCurrentBuild: "1.3.0-rc1",
 *     testFutureBuild:  "1.4.0-beta",
 *   }
 */
async function extractData(page) {
  // Navigate to the customers/deployments page if needed
  // await page.goto(OVCD_URL + 'deployments');  // adjust path as needed
  await page.waitForLoadState('networkidle');

  // TODO: Replace the selectors below once you have inspected the actual DOM.
  // The example below looks for a table with customer rows.
  const customers = await page.evaluate(() => {
    const rows = Array.from(document.querySelectorAll('table tbody tr, [data-customer], .customer-row'));
    return rows.map(row => {
      const cells = Array.from(row.querySelectorAll('td, [data-field]'));
      return {
        name:             cells[0]?.innerText?.trim() || '',
        prodCurrentBuild: cells[1]?.innerText?.trim() || '',
        prodFutureBuild:  cells[2]?.innerText?.trim() || '',
        testCurrentBuild: cells[3]?.innerText?.trim() || '',
        testFutureBuild:  cells[4]?.innerText?.trim() || '',
        rawHtml: row.innerHTML, // helpful for debugging selectors
      };
    }).filter(c => c.name);
  });

  return customers;
}

// Allow running directly: node src/scraper.js
if (require.main === module) {
  scrape()
    .then(() => process.exit(0))
    .catch(err => {
      console.error('Scrape failed:', err);
      process.exit(1);
    });
}

module.exports = { scrape };
