# OVCD Build Dashboard

Extracts customer build information from OVCD and displays it in a local dashboard with grouped sections.

## Quick Start

```bash
npm install
npx playwright install chromium
npm start
```

Then open http://localhost:3000 and click Refresh Data.

A browser window will open, log in to OVCD manually, then the scraper continues automatically.

## Current Dashboard Output

- USA section at top, Rest of World section below
- Customer name, Prod Current Build, Test Current Build, Delivery, Status
- Status filter toggle: hide Pre-Implementation and Terminated rows

## Current Scraping Flow

1. Login and navigate to Clients list
2. Scrape all paginated client rows
3. Visit each client detail page to enrich with:
	- Test Version Number
	- Country
4. Save merged output to data/builds.json

Note: detail-page enrichment adds time but is required for Test build and Country.

## Checks (Recommended Before Commit)

Run all checks:

```bash
npm run check
```

This validates:
- JS syntax in server and scraper files
- Inline script syntax in public/index.html
- Known bad selector patterns that can crash Playwright evaluate
- Basic shape validation for data/builds.json

Run only syntax checks:

```bash
npm run check:syntax
```

## How It Works

| Mode | How to use |
|---|---|
| **Manual (on-demand)** | Run `npm start`, open browser, click Refresh. Log in when prompted. |
| **Scheduled / automated** | Set `OVCD_USERNAME` + `OVCD_PASSWORD` env vars. Runs headless. |

## Updating Selectors

If OVCD markup changes, update selectors in src/scraper.js. Re-run npm run check after changes.

## File Structure

```
Joe-Code/
├── scripts/
│   └── checks.js    # Syntax + selector + data-shape checks
├── src/
│   ├── scraper.js   # Playwright login + data extraction
│   └── server.js    # Express API + static file server
├── public/
│   └── index.html   # Dashboard UI
├── data/
│   └── builds.json  # Cached scrape results (gitignored)
├── .env.example     # Credentials template
└── package.json
```
