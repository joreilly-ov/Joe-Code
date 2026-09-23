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

## Build Skill Context From Teams/Slack/Files

Use this when you want to ingest exported chat/file content and turn it into a local context pack you can feed into a skill.

1. Put source files into `test file import/` (or another folder)
2. Run:

```bash
npm run context:build
```

Or customize paths and output name:

```bash
node scripts/build-skill-context.js --input "./test file import" --name "my-channel-context"
```

Outputs are written to `data/skill-context/`:

- `<name>.md` - normalized transcript for review
- `<name>.jsonl` - chunked records for retrieval/context pipelines
- `<name>.manifest.json` - metadata and counts

Supported input types:

- Slack export JSON arrays (`text`, `ts`, `user`)
- Teams-style JSON objects with `messages` arrays
- Plain files (`.txt`, `.md`, `.csv`, `.log`)

Tip: for very large channels, use a lower chunk size to keep retrieval units smaller:

```bash
node scripts/build-skill-context.js --chunk-size 1200
```

### Aggressive Noise Cleanup

After building a context pack, run an aggressive cleanup pass to remove system chatter, duplicate lines, links, mention artifacts, and low-signal fragments.

```bash
npm run context:clean
```

This auto-selects the newest non-clean `.jsonl` file in `data/skill-context/` and writes:

- `<name>.clean.jsonl`
- `<name>.clean.manifest.json`

Run build + clean in one step:

```bash
npm run context:build:clean
```

Or target a specific input file:

```bash
node scripts/clean-skill-context.js --input ./data/skill-context/my-channel-context.jsonl --chunk-size 1200
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
