#!/usr/bin/env node
const fs = require('fs');
const path = require('path');

const DEFAULT_INPUT = path.resolve(process.cwd(), 'test file import');
const DEFAULT_OUTPUT = path.resolve(process.cwd(), 'data', 'skill-context');
const DEFAULT_CHUNK_SIZE = 1800;

function parseArgs(argv) {
  const args = {
    input: DEFAULT_INPUT,
    output: DEFAULT_OUTPUT,
    name: `context-${new Date().toISOString().replace(/[:.]/g, '-')}`,
    chunkSize: DEFAULT_CHUNK_SIZE,
  };

  for (let i = 0; i < argv.length; i += 1) {
    const token = argv[i];
    const next = argv[i + 1];

    if (token === '--help' || token === '-h') {
      args.help = true;
      continue;
    }

    if (token === '--input' && next) {
      args.input = path.resolve(process.cwd(), next);
      i += 1;
      continue;
    }

    if (token === '--output' && next) {
      args.output = path.resolve(process.cwd(), next);
      i += 1;
      continue;
    }

    if (token === '--name' && next) {
      args.name = sanitizeFileStem(next);
      i += 1;
      continue;
    }

    if (token === '--chunk-size' && next) {
      const parsed = Number.parseInt(next, 10);
      if (Number.isFinite(parsed) && parsed > 200) {
        args.chunkSize = parsed;
      }
      i += 1;
      continue;
    }
  }

  return args;
}

function printHelp() {
  console.log('Build a skill-ready context pack from Slack/Teams/plain files.');
  console.log('');
  console.log('Usage:');
  console.log('  node scripts/build-skill-context.js [options]');
  console.log('');
  console.log('Options:');
  console.log('  --input <dir>       Source folder containing exports/files');
  console.log('  --output <dir>      Output folder for generated context packs');
  console.log('  --name <value>      Output file stem (default: timestamped)');
  console.log('  --chunk-size <n>    Max characters per chunk (default: 1800)');
  console.log('  --help              Show this help message');
  console.log('');
  console.log('Supported inputs:');
  console.log('  - Slack export JSON: array of messages with text/ts/user');
  console.log('  - Teams-style JSON with a messages array');
  console.log('  - Plain text/markdown/csv/log files');
}

function sanitizeFileStem(value) {
  return String(value)
    .trim()
    .replace(/[^a-zA-Z0-9-_]+/g, '-')
    .replace(/^-+|-+$/g, '') || 'context-pack';
}

function collectFiles(root) {
  if (!fs.existsSync(root)) {
    return [];
  }

  const out = [];
  const stack = [root];

  while (stack.length > 0) {
    const current = stack.pop();
    const entries = fs.readdirSync(current, { withFileTypes: true });

    for (const entry of entries) {
      const abs = path.join(current, entry.name);
      if (entry.isDirectory()) {
        stack.push(abs);
      } else if (entry.isFile()) {
        out.push(abs);
      }
    }
  }

  return out;
}

function detectSourceType(absPath, text) {
  const lower = absPath.toLowerCase();
  if (lower.endsWith('.json')) {
    try {
      const parsed = JSON.parse(text);
      if (Array.isArray(parsed) && parsed.every(v => typeof v === 'object' && v !== null)) {
        const looksSlack = parsed.some(v => 'text' in v || 'ts' in v || 'user' in v);
        if (looksSlack) return 'slack-json';
      }
      if (parsed && Array.isArray(parsed.messages)) {
        return 'teams-json';
      }
      return 'json';
    } catch {
      return 'text';
    }
  }

  if (lower.endsWith('.txt') || lower.endsWith('.md') || lower.endsWith('.csv') || lower.endsWith('.log')) {
    return 'text';
  }

  return 'text';
}

function normalizeSlackMessages(parsed, sourcePath) {
  const rows = [];

  for (const item of parsed) {
    const text = normalizeLine(item.text || item.message || '');
    if (!text) continue;
    const ts = normalizeSlackTimestamp(item.ts);
    const author = item.user || item.username || item.bot_id || 'unknown';
    const channel = item.channel || path.basename(path.dirname(sourcePath));

    rows.push({
      sourceType: 'slack',
      sourcePath,
      channel,
      author,
      timestamp: ts,
      text,
    });
  }

  return rows;
}

function normalizeTeamsMessages(parsed, sourcePath) {
  const rows = [];
  const messages = Array.isArray(parsed.messages) ? parsed.messages : [];

  for (const item of messages) {
    const text = normalizeLine(
      item.content || item.body?.content || item.text || item.message || ''
    );
    if (!text) continue;

    const author =
      item.from?.user?.displayName ||
      item.from?.application?.displayName ||
      item.author ||
      'unknown';

    rows.push({
      sourceType: 'teams',
      sourcePath,
      channel: parsed.channel || parsed.topic || path.basename(path.dirname(sourcePath)),
      author,
      timestamp: normalizeIsoTimestamp(item.createdDateTime || item.timestamp || item.time),
      text,
    });
  }

  return rows;
}

function normalizeGenericText(text, sourcePath) {
  const cleaned = normalizeLine(text);
  if (!cleaned) return [];

  return [
    {
      sourceType: 'file',
      sourcePath,
      channel: path.basename(path.dirname(sourcePath)),
      author: 'n/a',
      timestamp: 'n/a',
      text: cleaned,
    },
  ];
}

function normalizeLine(value) {
  return String(value)
    .replace(/<[^>]+>/g, ' ')
    .replace(/\r/g, '\n')
    .replace(/\n{3,}/g, '\n\n')
    .replace(/[\t ]+/g, ' ')
    .trim();
}

function normalizeSlackTimestamp(ts) {
  if (!ts) return 'n/a';
  const num = Number.parseFloat(String(ts));
  if (!Number.isFinite(num)) return String(ts);
  return new Date(num * 1000).toISOString();
}

function normalizeIsoTimestamp(value) {
  if (!value) return 'n/a';
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return String(value);
  return date.toISOString();
}

function chunkText(text, chunkSize) {
  if (text.length <= chunkSize) {
    return [text];
  }

  const chunks = [];
  let remaining = text;

  while (remaining.length > chunkSize) {
    let splitAt = remaining.lastIndexOf('\n\n', chunkSize);
    if (splitAt < 200) {
      splitAt = remaining.lastIndexOf('\n', chunkSize);
    }
    if (splitAt < 200) {
      splitAt = chunkSize;
    }

    chunks.push(remaining.slice(0, splitAt).trim());
    remaining = remaining.slice(splitAt).trim();
  }

  if (remaining) {
    chunks.push(remaining);
  }

  return chunks;
}

function buildPack(entries, args) {
  const generatedAt = new Date().toISOString();
  const bySourceType = entries.reduce((acc, item) => {
    acc[item.sourceType] = (acc[item.sourceType] || 0) + 1;
    return acc;
  }, {});

  const transcript = entries
    .map(item => {
      return [
        `Source: ${item.sourceType}`,
        `Path: ${item.sourcePath}`,
        `Channel: ${item.channel}`,
        `Author: ${item.author}`,
        `Timestamp: ${item.timestamp}`,
        '',
        item.text,
      ].join('\n');
    })
    .join('\n\n---\n\n');

  const chunks = chunkText(transcript, args.chunkSize);
  const chunkRecords = chunks.map((content, idx) => ({
    id: `${args.name}-chunk-${String(idx + 1).padStart(4, '0')}`,
    pack: args.name,
    order: idx + 1,
    generatedAt,
    content,
  }));

  const markdown = [
    `# Skill Context Pack: ${args.name}`,
    '',
    `Generated: ${generatedAt}`,
    `Entries: ${entries.length}`,
    `Chunks: ${chunkRecords.length}`,
    '',
    '## Source Summary',
    ...Object.entries(bySourceType).map(([k, v]) => `- ${k}: ${v}`),
    '',
    '## Normalized Transcript',
    '',
    transcript,
    '',
  ].join('\n');

  return {
    generatedAt,
    bySourceType,
    entryCount: entries.length,
    chunkCount: chunkRecords.length,
    markdown,
    jsonl: chunkRecords.map(r => JSON.stringify(r)).join('\n') + '\n',
    manifest: {
      name: args.name,
      generatedAt,
      input: args.input,
      output: args.output,
      entryCount: entries.length,
      chunkCount: chunkRecords.length,
      sourceTypeCounts: bySourceType,
    },
  };
}

function loadEntries(inputDir) {
  const files = collectFiles(inputDir);
  const entries = [];

  for (const absPath of files) {
    const rel = path.relative(process.cwd(), absPath) || absPath;
    const ext = path.extname(absPath).toLowerCase();
    const binaryExts = new Set(['.png', '.jpg', '.jpeg', '.gif', '.webp', '.pdf', '.zip']);

    if (binaryExts.has(ext)) {
      continue;
    }

    let text;
    try {
      text = fs.readFileSync(absPath, 'utf8');
    } catch {
      continue;
    }

    const detected = detectSourceType(absPath, text);
    if (detected === 'slack-json') {
      const parsed = JSON.parse(text);
      entries.push(...normalizeSlackMessages(parsed, rel));
    } else if (detected === 'teams-json') {
      const parsed = JSON.parse(text);
      entries.push(...normalizeTeamsMessages(parsed, rel));
    } else if (detected === 'json') {
      const collapsed = normalizeLine(text);
      if (collapsed) {
        entries.push({
          sourceType: 'json-file',
          sourcePath: rel,
          channel: path.basename(path.dirname(absPath)),
          author: 'n/a',
          timestamp: 'n/a',
          text: collapsed,
        });
      }
    } else {
      entries.push(...normalizeGenericText(text, rel));
    }
  }

  return entries;
}

function ensureDir(dirPath) {
  if (!fs.existsSync(dirPath)) {
    fs.mkdirSync(dirPath, { recursive: true });
  }
}

function writeOutputs(pack, args) {
  ensureDir(args.output);

  const mdPath = path.join(args.output, `${args.name}.md`);
  const jsonlPath = path.join(args.output, `${args.name}.jsonl`);
  const manifestPath = path.join(args.output, `${args.name}.manifest.json`);

  fs.writeFileSync(mdPath, pack.markdown, 'utf8');
  fs.writeFileSync(jsonlPath, pack.jsonl, 'utf8');
  fs.writeFileSync(manifestPath, JSON.stringify(pack.manifest, null, 2), 'utf8');

  return { mdPath, jsonlPath, manifestPath };
}

function main() {
  const args = parseArgs(process.argv.slice(2));
  if (args.help) {
    printHelp();
    return;
  }

  if (!fs.existsSync(args.input)) {
    console.error(`Input folder does not exist: ${args.input}`);
    process.exit(1);
  }

  const entries = loadEntries(args.input);
  if (entries.length === 0) {
    console.error('No supported content found in input folder.');
    process.exit(1);
  }

  const pack = buildPack(entries, args);
  const out = writeOutputs(pack, args);

  console.log('Skill context pack built successfully.');
  console.log(`Input: ${args.input}`);
  console.log(`Entries: ${pack.entryCount}`);
  console.log(`Chunks: ${pack.chunkCount}`);
  console.log(`Markdown: ${out.mdPath}`);
  console.log(`JSONL: ${out.jsonlPath}`);
  console.log(`Manifest: ${out.manifestPath}`);
}

main();
