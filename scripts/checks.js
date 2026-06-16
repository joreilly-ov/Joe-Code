const fs = require('fs');
const path = require('path');
const { spawnSync } = require('child_process');

const repoRoot = path.resolve(__dirname, '..');

function fail(message) {
  console.error(`FAIL: ${message}`);
  process.exitCode = 1;
}

function pass(message) {
  console.log(`PASS: ${message}`);
}

function warn(message) {
  console.warn(`WARN: ${message}`);
}

function checkNodeSyntax(filePath) {
  const abs = path.join(repoRoot, filePath);
  const result = spawnSync(process.execPath, ['--check', abs], { encoding: 'utf8' });
  if (result.status !== 0) {
    fail(`Syntax error in ${filePath}\n${result.stderr || result.stdout}`);
    return;
  }
  pass(`Syntax valid: ${filePath}`);
}

function checkInlineScripts(htmlFile) {
  const abs = path.join(repoRoot, htmlFile);
  const html = fs.readFileSync(abs, 'utf8');
  const scripts = [...html.matchAll(/<script>([\s\S]*?)<\/script>/g)];

  if (!scripts.length) {
    fail(`No inline <script> blocks found in ${htmlFile}`);
    return;
  }

  scripts.forEach((m, idx) => {
    try {
      // Parse-only for syntax regressions.
      // eslint-disable-next-line no-new-func
      new Function(m[1]);
      pass(`Inline script ${idx + 1} syntax valid: ${htmlFile}`);
    } catch (err) {
      fail(`Inline script ${idx + 1} syntax error in ${htmlFile}: ${err.message}`);
    }
  });
}

function checkSelectorPatterns(jsFile) {
  const abs = path.join(repoRoot, jsFile);
  const content = fs.readFileSync(abs, 'utf8');

  // Common broken selector pattern that caused runtime crashes.
  const badPatterns = [
    /a\[href\*=\/Clients\//,
    /a\[href\*=\/Clients\/Details\//,
  ];

  const hit = badPatterns.find(re => re.test(content));
  if (hit) {
    fail(`Found invalid selector pattern (${hit}) in ${jsFile}. Use quoted values: a[href*="/Clients/"]`);
    return;
  }

  pass(`Selector sanity checks passed: ${jsFile}`);
}

function checkBuildsJsonShape(jsonFile) {
  const abs = path.join(repoRoot, jsonFile);
  if (!fs.existsSync(abs)) {
    pass(`${jsonFile} not found (skipped)`);
    return;
  }

  try {
    const data = JSON.parse(fs.readFileSync(abs, 'utf8'));
    if (!Array.isArray(data.customers)) {
      fail(`${jsonFile}: expected customers array`);
      return;
    }

    const requiredFields = ['name', 'status', 'prodCurrentBuild', 'testCurrentBuild', 'deliveryType'];
    const optionalFields = ['country'];
    const sample = data.customers.slice(0, 10);
    const missing = [];
    const missingOptional = [];

    sample.forEach((c, idx) => {
      requiredFields.forEach(field => {
        if (!(field in c)) {
          missing.push(`customers[${idx}].${field}`);
        }
      });
      optionalFields.forEach(field => {
        if (!(field in c)) {
          missingOptional.push(`customers[${idx}].${field}`);
        }
      });
    });

    if (missing.length) {
      fail(`${jsonFile}: missing fields in sample rows: ${missing.join(', ')}`);
      return;
    }

    if (missingOptional.length) {
      warn(`${jsonFile}: optional fields missing in sample rows: ${missingOptional.join(', ')}`);
      warn('Run a fresh scrape to backfill optional enrichment fields.');
    }

    pass(`${jsonFile} shape looks valid (${data.customers.length} customers)`);
  } catch (err) {
    fail(`${jsonFile}: invalid JSON (${err.message})`);
  }
}

function main() {
  checkNodeSyntax('src/server.js');
  checkNodeSyntax('src/scraper.js');
  checkInlineScripts('public/index.html');
  checkSelectorPatterns('src/scraper.js');
  checkBuildsJsonShape('data/builds.json');

  if (process.exitCode && process.exitCode !== 0) {
    console.error('\nOne or more checks failed.');
    process.exit(process.exitCode);
  }

  console.log('\nAll checks passed.');
}

main();
