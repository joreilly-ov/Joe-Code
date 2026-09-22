# OVCD Live Client Viewer

Local-only viewer for Live clients from the OVCD Clients directory.

## Run

```powershell
cd .\ovcd-live-client-viewer
npm install
npx playwright install chromium
npm start
```

Open `http://localhost:4177` and choose **Refresh data**. A visible Chromium window opens using the local `.playwright-profile` folder. Complete SSO there if prompted, then press **Refresh data** again; the session is retained for later refreshes.

The normal Edge profile is intentionally not modified or read. The viewer keeps its own Playwright session and saves the latest successful client result to the ignored `data/last-good-state.json` file. When the app starts, that snapshot is shown until a newer refresh succeeds.

Each refresh loads the Live client list with the page size set to 100, then visits each client's detail page to collect PROD and TEST version numbers plus their last installed/upgraded dates. Refreshing is sequential and may take a few minutes for the full client list. The **Fetch diagnostics** section shows crawl counts and sample source rows when the site markup needs a selector adjustment.

If the browser is already authenticated, the refresh runs unattended. If SSO is required, complete sign-in in the visible Playwright window and press **Refresh data** again. TEST values are only available when the corresponding detail page exposes them; missing values remain blank.
