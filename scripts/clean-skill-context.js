#!/usr/bin/env node
const fs = require('fs');
const path = require('path');

const DEFAULT_CONTEXT_DIR = path.resolve(process.cwd(), 'data', 'skill-context');
const DEFAULT_CHUNK_SIZE = 1400;

function parseArgs(argv) {
  const args = {
    input: '',
    output: '',
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
  console.log('Aggressively strip noise from skill context JSONL chunks.');
  console.log('');
  console.log('Usage:');
  console.log('  node scripts/clean-skill-context.js [options]');
  console.log('');
  console.log('Options:');
  console.log('  --input <file>      Input .jsonl file from build-skill-context');
  console.log('  --output <file>     Output .jsonl path (default: <input>.clean.jsonl)');
  console.log('  --chunk-size <n>    Max characters per output chunk (default: 1400)');
  console.log('  --help              Show this help message');
  console.log('');
  console.log('If --input is omitted, the newest non-clean .jsonl file in data/skill-context is used.');
}

function findLatestJsonl() {
  if (!fs.existsSync(DEFAULT_CONTEXT_DIR)) {
    return '';
  }

  const files = fs
    .readdirSync(DEFAULT_CONTEXT_DIR)
    .filter(name => name.endsWith('.jsonl') && !name.endsWith('.clean.jsonl'))
    .map(name => {
      const abs = path.join(DEFAULT_CONTEXT_DIR, name);
      const stat = fs.statSync(abs);
      return { abs, mtime: stat.mtimeMs };
    })
    .sort((a, b) => b.mtime - a.mtime);

  return files[0]?.abs || '';
}

function readJsonl(inputPath) {
  const text = fs.readFileSync(inputPath, 'utf8');
  const lines = text.split(/\r?\n/).filter(Boolean);
  const records = [];

  for (const line of lines) {
    try {
      const parsed = JSON.parse(line);
      if (parsed && typeof parsed.content === 'string') {
        records.push(parsed);
      }
    } catch {
      // Skip invalid lines.
    }
  }

  return records;
}

function cleanText(content, seenLines) {
  const removableLinePatterns = [
    /^source:\s+/i,
    /^path:\s+/i,
    /^channel:\s+/i,
    /^author:\s+/i,
    /^timestamp:\s+/i,
    /^react(ed|ion)/i,
    /^system\s+message:/i,
    /^edited\s+message:/i,
  ];

  const noisyEventPatterns = [
    /joined\s+the\s+channel/i,
    /left\s+the\s+channel/i,
    /added\s+to\s+the\s+channel/i,
    /set\s+the\s+channel\s+topic/i,
    /uploaded\s+(a\s+)?file/i,
    /started\s+(a\s+)?call/i,
    /ended\s+(a\s+)?call/i,
  ];

  let text = String(content);
  text = text.replace(/\[([^\]]+)\]\((https?:\/\/[^)]+)\)/gi, '$1');
  text = text.replace(/https?:\/\/\S+/gi, ' ');
  text = text.replace(/<@[A-Z0-9]+>/gi, ' ');
  text = text.replace(/<#[A-Z0-9]+\|?[^>]*>/gi, ' ');
  text = text.replace(/<![^>]+>/g, ' ');
  text = text.replace(/:[a-z0-9_+-]+:/gi, ' ');
  text = text.replace(/[\t ]+/g, ' ');

  const outLines = [];
  const lines = text.split(/\r?\n/);

  for (const raw of lines) {
    let line = raw.trim();
    if (!line || line === '---') continue;

    if (removableLinePatterns.some(re => re.test(line))) continue;
    if (noisyEventPatterns.some(re => re.test(line))) continue;

    // Remove highly noisy punctuation-only lines.
    if (!/[a-zA-Z0-9]/.test(line)) continue;

    // Remove very short fragments unless they contain digits (ticket ids, versions).
    if (line.length < 12 && !/\d/.test(line)) continue;

    line = line
      .replace(/\s{2,}/g, ' ')
      .replace(/^[-*]\s+/, '')
      .replace(/^>\s+/, '')
      .trim();

    if (!line) continue;

    const dedupeKey = line.toLowerCase();
    if (seenLines.has(dedupeKey)) continue;

    seenLines.add(dedupeKey);
    outLines.push(line);
  }

  return outLines.join('\n');
}

function chunkText(text, chunkSize) {
  if (text.length <= chunkSize) {
    return [text];
  }

  const chunks = [];
  let remaining = text;

  while (remaining.length > chunkSize) {
    let splitAt = remaining.lastIndexOf('\n', chunkSize);
    if (splitAt < 200) splitAt = chunkSize;

    const current = remaining.slice(0, splitAt).trim();
    if (current) chunks.push(current);
    remaining = remaining.slice(splitAt).trim();
  }

  if (remaining) chunks.push(remaining);
  return chunks;
}

function buildOutputRecords(records, chunkSize, packName) {
  const seenLines = new Set();
  const cleanedTexts = [];

  for (const record of records) {
    const cleaned = cleanText(record.content, seenLines);
    if (cleaned) cleanedTexts.push(cleaned);
  }

  const fullText = cleanedTexts.join('\n\n');
  const chunks = chunkText(fullText, chunkSize);
  const generatedAt = new Date().toISOString();

  return chunks.map((content, idx) => ({
    id: `${packName}-clean-${String(idx + 1).padStart(4, '0')}`,
    pack: `${packName}-clean`,
    order: idx + 1,
    generatedAt,
    content,
  }));
}

function writeJsonl(outPath, records) {
  const jsonl = records.map(r => JSON.stringify(r)).join('\n') + '\n';
  fs.writeFileSync(outPath, jsonl, 'utf8');
}

function writeManifest(outPath, inputPath, beforeCount, afterCount) {
  const manifestPath = outPath.replace(/\.jsonl$/i, '.manifest.json');
  const payload = {
    generatedAt: new Date().toISOString(),
    input: inputPath,
    output: outPath,
    beforeChunks: beforeCount,
    afterChunks: afterCount,
    reductionPercent: beforeCount > 0
      ? Number((((beforeCount - afterCount) / beforeCount) * 100).toFixed(2))
      : 0,
  };

  fs.writeFileSync(manifestPath, JSON.stringify(payload, null, 2), 'utf8');
  return manifestPath;
}

function main() {
  const args = parseArgs(process.argv.slice(2));
  if (args.help) {
    printHelp();
    return;
  }

  const inputPath = args.input || findLatestJsonl();
  if (!inputPath) {
    console.error('No input JSONL found. Run context build first or pass --input.');
    process.exit(1);
  }

  if (!fs.existsSync(inputPath)) {
    console.error(`Input JSONL does not exist: ${inputPath}`);
    process.exit(1);
  }

  const base = path.basename(inputPath, '.jsonl');
  const outputPath = args.output || path.join(path.dirname(inputPath), `${base}.clean.jsonl`);

  const inputRecords = readJsonl(inputPath);
  if (inputRecords.length === 0) {
    console.error('Input JSONL has no valid records with content fields.');
    process.exit(1);
  }

  const outputRecords = buildOutputRecords(inputRecords, args.chunkSize, base);
  if (outputRecords.length === 0) {
    console.error('All content was removed by cleaning rules. Try less aggressive cleaning.');
    process.exit(1);
  }

  writeJsonl(outputPath, outputRecords);
  const manifestPath = writeManifest(outputPath, inputPath, inputRecords.length, outputRecords.length);

  console.log('Skill context cleaning complete.');
  console.log(`Input: ${inputPath}`);
  console.log(`Output: ${outputPath}`);
  console.log(`Manifest: ${manifestPath}`);
  console.log(`Chunks: ${inputRecords.length} -> ${outputRecords.length}`);
}

main();
