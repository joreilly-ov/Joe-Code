# OVCD Build Dashboard

Extracts customer build information from the OVCD portal and displays it in a local dashboard.

## Quick Start

```bash
npm install
npx playwright install chromium
npm start
```

Then open **http://localhost:3000** and click **Refresh Data**.

A browser window will open — log in to OVCD manually, then it will scrape automatically.

## How It Works

| Mode | How to use |
|---|---|
| **Manual (on-demand)** | Run `npm start`, open browser, click Refresh. Log in when prompted. |
| **Scheduled / automated** | Set `OVCD_USERNAME` + `OVCD_PASSWORD` env vars. Runs headless. |

## Updating Selectors

After first run, open `src/scraper.js` and update the `extractData()` function with the correct CSS selectors from the OVCD DOM. The `rawHtml` field in the JSON output helps identify what to target.

## File Structure

```
Joe-Code/
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
