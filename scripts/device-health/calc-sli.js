#!/usr/bin/env node

const fs = require("fs");
const path = require("path");

const MONTH_MINUTES = 43800;

function parseArgs(argv) {
  const args = { input: null, out: null };
  for (let i = 2; i < argv.length; i += 1) {
    const token = argv[i];
    if (token === "--input") {
      args.input = argv[i + 1];
      i += 1;
    } else if (token === "--out") {
      args.out = argv[i + 1];
      i += 1;
    }
  }
  return args;
}

function minutesBetween(startIso, endIso) {
  const start = new Date(startIso).getTime();
  const end = new Date(endIso).getTime();
  if (Number.isNaN(start) || Number.isNaN(end) || end < start) {
    return 0;
  }
  return Math.round((end - start) / 60000);
}

function calcImpactMinutes(item) {
  if (typeof item.fixedImpactMinutes === "number") {
    return Math.max(0, item.fixedImpactMinutes);
  }

  const raw = minutesBetween(item.start, item.end);

  if (typeof item.capMinutes === "number") {
    return Math.min(raw, Math.max(0, item.capMinutes));
  }

  return Math.max(0, raw);
}

function groupByDevice(intervals) {
  const byDevice = new Map();

  for (const item of intervals) {
    const deviceId = item.deviceId || "unknown";
    const impactMinutes = calcImpactMinutes(item);
    const previous = byDevice.get(deviceId) || 0;
    byDevice.set(deviceId, previous + impactMinutes);
  }

  return byDevice;
}

function toDeviceRows(byDevice) {
  const rows = [];

  for (const [deviceId, iu] of byDevice.entries()) {
    const sli = ((MONTH_MINUTES - iu) / MONTH_MINUTES) * 100;
    rows.push({
      deviceId,
      impactUserMinutes: iu,
      sliPercent: Number(sli.toFixed(4)),
      targetMet: sli >= 99.7
    });
  }

  rows.sort((a, b) => a.sliPercent - b.sliPercent);
  return rows;
}

function buildSummary(rows) {
  if (rows.length === 0) {
    return {
      deviceCount: 0,
      belowTargetCount: 0,
      averageSliPercent: 100,
      worstDevice: null
    };
  }

  const belowTargetCount = rows.filter((r) => !r.targetMet).length;
  const averageSliPercent = rows.reduce((sum, r) => sum + r.sliPercent, 0) / rows.length;

  return {
    deviceCount: rows.length,
    belowTargetCount,
    averageSliPercent: Number(averageSliPercent.toFixed(4)),
    worstDevice: rows[0]
  };
}

function main() {
  const { input, out } = parseArgs(process.argv);

  if (!input) {
    console.error("Usage: node scripts/device-health/calc-sli.js --input <json-file> [--out <json-file>]");
    process.exit(1);
  }

  const inputPath = path.resolve(input);
  const raw = fs.readFileSync(inputPath, "utf8");
  const intervals = JSON.parse(raw);

  if (!Array.isArray(intervals)) {
    console.error("Input JSON must be an array of impact interval items.");
    process.exit(1);
  }

  const byDevice = groupByDevice(intervals);
  const rows = toDeviceRows(byDevice);
  const result = {
    generatedAt: new Date().toISOString(),
    monthMinutes: MONTH_MINUTES,
    summary: buildSummary(rows),
    devices: rows
  };

  if (out) {
    const outputPath = path.resolve(out);
    fs.writeFileSync(outputPath, JSON.stringify(result, null, 2), "utf8");
    console.log(`Wrote SLI results to ${outputPath}`);
  } else {
    console.log(JSON.stringify(result, null, 2));
  }
}

main();
