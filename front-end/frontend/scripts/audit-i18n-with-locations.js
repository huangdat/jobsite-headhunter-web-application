#!/usr/bin/env node
/* global console */

/*##REMOVE##
/* global console */
/**
 * i18n Audit Script - Advanced with File Locations
 * Exports missing keys WITH file paths and line numbers
 */

import fs from "fs";
import { globSync } from "glob";

const localesDir = "src/i18n/locales";
const locales = ["en", "vi"];
const srcDir = "src";

function getAllKeys() {
  const allKeys = new Set();
  locales.forEach((lng) => {
    const files = globSync(`${localesDir}/${lng}/*.json`);
    files.forEach((file) => {
      try {
        const content = JSON.parse(fs.readFileSync(file, "utf8"));
        const fileName = file.split(/[/\\]/).pop().replace(".json", "");

        function extractKeys(obj, prefix = "") {
          for (const [key, value] of Object.entries(obj)) {
            const fullKey = prefix ? `${prefix}.${key}` : key;
            if (typeof value === "string" || typeof value === "number") {
              if (fileName === "common") {
                allKeys.add(fullKey);
              } else {
                allKeys.add(`${fileName}.${fullKey}`);
              }
            } else if (typeof value === "object" && value !== null) {
              extractKeys(value, fullKey);
            }
          }
        }
        extractKeys(content);
      } catch {
        // Skip invalid JSON files
      }
    });
  });
  return allKeys;
}

function scanCodeWithLocations() {
  const usedKeysMap = new Map(); // Map<key, Array<{file, line}>>
  const files = globSync(`${srcDir}/**/*.{js,jsx,ts,tsx}`);

  files.forEach((file) => {
    try {
      const content = fs.readFileSync(file, "utf8");
      const lines = content.split("\n");

      lines.forEach((line, idx) => {
        const patterns = [
          /t\s*\(\s*'([^']+)'\s*\)/g,
          /t\s*\(\s*"([^"]+)"\s*\)/g,
          /t\s*\(\s*`([^`]+)`\s*\)/g,
        ];

        patterns.forEach((pattern) => {
          const matches = [...line.matchAll(pattern)];
          matches.forEach(([, key]) => {
            if (
              key &&
              key.trim() &&
              !key.includes("$") &&
              key.trim() !== "." &&
              !key.trim().startsWith(".") &&
              !key.trim().endsWith(".")
            ) {
              const trimmedKey = key.trim();
              if (!usedKeysMap.has(trimmedKey)) {
                usedKeysMap.set(trimmedKey, []);
              }
              usedKeysMap.get(trimmedKey).push({
                file: file.replace(/\\/g, "/"),
                line: idx + 1,
              });
            }
          });
        });
      });
    } catch {
      // Skip files that can't be read
    }
  });
  return usedKeysMap;
}

const allKeys = getAllKeys();
const usedKeysMap = scanCodeWithLocations();
const usedKeys = new Set(usedKeysMap.keys());
const missingKeys = [...usedKeys].filter((key) => !allKeys.has(key)).sort();
const unusedKeys = [...allKeys].filter((key) => !usedKeys.has(key)).sort();

// Generate detailed report
let report = `
╔════════════════════════════════════════════════════════════════════════════╗
║              i18n AUDIT - DETAILED REPORT WITH FILE LOCATIONS              ║
║                         Generated: ${new Date().toISOString()}                       ║
╚════════════════════════════════════════════════════════════════════════════╝

📊 SUMMARY STATISTICS
═══════════════════════════════════════════════════════════════════════════
  Total i18n Keys Available: ${allKeys.size}
  Total Keys Used in Code: ${usedKeys.size}
  Missing Keys: ${missingKeys.length}
  Unused Keys: ${unusedKeys.length}

═══════════════════════════════════════════════════════════════════════════

`;

if (missingKeys.length > 0) {
  report += `❌ MISSING i18n KEYS (${missingKeys.length} total)
═══════════════════════════════════════════════════════════════════════════
`;
  missingKeys.forEach((key) => {
    report += `\n📍 KEY: "${key}"\n`;
    const locations = usedKeysMap.get(key);
    locations.forEach((loc) => {
      report += `   → ${loc.file}:${loc.line}\n`;
    });
  });
  report += `\n`;
}

if (unusedKeys.length > 0) {
  report += `⚠️  UNUSED i18n KEYS (${unusedKeys.length} total)
═══════════════════════════════════════════════════════════════════════════
`;
  unusedKeys.slice(0, 50).forEach((key) => {
    report += `  ${key}\n`;
  });
  if (unusedKeys.length > 50) {
    report += `  ... and ${unusedKeys.length - 50} more\n`;
  }
  report += `\n`;
}

report += `═══════════════════════════════════════════════════════════════════════════
END OF REPORT
`;

// Save to file
const filename = `audit-i18n-with-locations-${Date.now()}.txt`;
fs.writeFileSync(filename, report, "utf8");
console.log(`✅ Detailed report saved to: ${filename}`);
console.log(`📋 Missing keys: ${missingKeys.length}`);
console.log(`📋 Unused keys: ${unusedKeys.length}`);
console.log(`\n📌 First 10 missing keys with locations:`);
missingKeys.slice(0, 10).forEach((key) => {
  console.log(`\n   KEY: "${key}"`);
  const locations = usedKeysMap.get(key);
  locations.slice(0, 3).forEach((loc) => {
    console.log(`   → ${loc.file}:${loc.line}`);
  });
  if (locations.length > 3) {
    console.log(`   ... and ${locations.length - 3} more locations`);
  }
});
