#!/usr/bin/env node
/* global console */

/*##REMOVE##
/* global console */
/**
 * i18n Audit Script v2 - Smart with False Positive Exclusion
 * Filters out false positives from known problematic files
 */

import fs from "fs";
import { globSync } from "glob";

const localesDir = "src/i18n/locales";
const locales = ["en", "vi"];
const srcDir = "src";

// Files known to have false positives (canvas, enums, etc.)
const excludePatterns = [
  /ParticleBackground\.tsx/,
  /useJobFilters\.ts/,
  /canvas/i,
  /canvas.*context/i,
];

// Known false positive keys to filter out
const falsPositiveKeys = new Set([
  "-", // from string.split("-")
  "2d", // from canvas.getContext("2d")
  "ALL", // from enum
  "CUSTOM", // from enum
  "NEGOTIABLE", // from enum
  "a", // single letter, likely not i18n
  "code", // likely variable, not key
  "state", // URL parameter, not i18n key
]);

// Single-letter keys are suspicious - filter them
const isSuspiciousKey = (key) => {
  return key.length === 1 || falsPositiveKeys.has(key);
};

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
              // ALL namespaces should have their namespace prefix
              allKeys.add(`${fileName}.${fullKey}`);
            } else if (
              typeof value === "object" &&
              value !== null &&
              !Array.isArray(value)
            ) {
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

// Generate search patterns for a key (same logic as verify-unused-native.js)
function generateSearchPatterns(key) {
  const patterns = new Set();

  // Full key in quotes
  patterns.add(`"${key}"`);
  patterns.add(`'${key}'`);
  patterns.add(`\`${key}\``);

  // Parts of the key (for feature hook usage)
  const parts = key.split(".");

  // Last part only (e.g., "signIn" from "auth.buttons.signIn")
  if (parts.length > 0) {
    const lastPart = parts[parts.length - 1];
    patterns.add(`"${lastPart}"`);
    patterns.add(`'${lastPart}'`);
  }

  // Last 2 parts (e.g., "buttons.signIn" from "auth.buttons.signIn")
  if (parts.length > 1) {
    const last2 = parts.slice(-2).join(".");
    patterns.add(`"${last2}"`);
    patterns.add(`'${last2}'`);
  }

  // Last 3 parts (e.g., "pages.login.title" from "auth.pages.login.title")
  if (parts.length > 2) {
    const last3 = parts.slice(-3).join(".");
    patterns.add(`"${last3}"`);
    patterns.add(`'${last3}'`);
  }

  // Without first namespace (e.g., "buttons.signIn" from "auth.buttons.signIn")
  if (parts.length > 1) {
    const withoutNamespace = parts.slice(1).join(".");
    patterns.add(`"${withoutNamespace}"`);
    patterns.add(`'${withoutNamespace}'`);
  }

  return Array.from(patterns);
}

function scanCodeWithLocations(allKeys) {
  const usedKeysMap = new Map(); // Map<key, Array<{file, line}>>
  const files = globSync(`${srcDir}/**/*.{js,jsx,ts,tsx}`);

  // Skip definition files - they show imports, not actual usage
  const skipDefinitionFiles = [
    /useFeatureTranslation\.ts/,
    /useAppTranslation\.ts/,
  ];

  // Load all source code for pattern matching
  const allSourceCode = [];
  files.forEach((file) => {
    // Skip problematic files
    if (
      excludePatterns.some((pattern) => pattern.test(file)) ||
      skipDefinitionFiles.some((pattern) => pattern.test(file))
    ) {
      return;
    }

    try {
      const content = fs.readFileSync(file, "utf8");
      allSourceCode.push({ file, content });
    } catch {
      // Skip files that can't be read
    }
  });

  // Check each key against all source code using pattern matching
  for (const key of allKeys) {
    const patterns = generateSearchPatterns(key);

    // Check if any pattern exists in any file
    for (const { file, content } of allSourceCode) {
      let foundInFile = false;
      const lines = content.split("\n");

      // Check each pattern
      for (const pattern of patterns) {
        if (content.includes(pattern)) {
          // Found! Now find which lines
          lines.forEach((line, idx) => {
            if (line.includes(pattern)) {
              if (!usedKeysMap.has(key)) {
                usedKeysMap.set(key, []);
              }
              usedKeysMap.get(key).push({
                file: file.replace(/\\/g, "/"),
                line: idx + 1,
              });
              foundInFile = true;
            }
          });

          if (foundInFile) break; // Found in this file, move to next file
        }
      }

      if (foundInFile) break; // Found usage, move to next key
    }
  }

  return usedKeysMap;
}

const allKeys = getAllKeys();
const usedKeysMap = scanCodeWithLocations(allKeys);
const usedKeys = new Set(usedKeysMap.keys());
const missingKeys = [...usedKeys].filter((key) => !allKeys.has(key)).sort();
const unusedKeys = [...allKeys].filter((key) => !usedKeys.has(key)).sort();

// Generate cleaner report
let report = `
╔════════════════════════════════════════════════════════════════════════════╗
║         i18n AUDIT REPORT v2 - Smart (False Positives Filtered)            ║
║                         Generated: ${new Date().toISOString()}                       ║
╚════════════════════════════════════════════════════════════════════════════╝

📊 SUMMARY STATISTICS
═══════════════════════════════════════════════════════════════════════════
  Total i18n Keys Available: ${allKeys.size}
  Total Keys Used in Code: ${usedKeys.size}
  Missing Keys: ${missingKeys.length}
  Unused Keys: ${unusedKeys.length}

═══════════════════════════════════════════════════════════════════════════

Excluded Files (known false positives):
  - ParticleBackground.tsx
  - useJobFilters.ts

Filtered Out:
  - Single-letter keys
  - Known false positive values (2d, ALL, CUSTOM, NEGOTIABLE, etc.)

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

// Save main report to file
const filename = `audit-report.txt`;
fs.writeFileSync(filename, report, "utf8");

// Export full unused keys list to separate file for easy tracking
if (unusedKeys.length > 0) {
  const unusedKeysFilename = `unused-keys-full.txt`;
  const unusedKeysContent = `UNUSED i18n KEYS AUDIT
═════════════════════════════════════════════════════════════════════════════
Generated: ${new Date().toISOString()}
Total unused keys: ${unusedKeys.length}

FULL LIST (one key per line):
─────────────────────────────────────────────────────────────────────────────

${unusedKeys.join("\n")}

═════════════════════════════════════════════════════════════════════════════
END OF UNUSED KEYS LIST
`;
  fs.writeFileSync(unusedKeysFilename, unusedKeysContent, "utf8");
  console.log(`📄 Full unused keys list exported to: ${unusedKeysFilename}`);
}

console.log(`✅ Smart audit report saved to: ${filename}`);
console.log(`📋 Missing keys (after filtering): ${missingKeys.length}`);
console.log(`📋 Unused keys: ${unusedKeys.length}`);

if (missingKeys.length > 0) {
  console.log(`\n📌 First 15 missing keys:\n`);
  missingKeys.slice(0, 15).forEach((key) => {
    console.log(`\n   KEY: "${key}"`);
    const locations = usedKeysMap.get(key);
    locations.slice(0, 2).forEach((loc) => {
      console.log(`   → ${loc.file}:${loc.line}`);
    });
    if (locations.length > 2) {
      console.log(`   ... and ${locations.length - 2} more`);
    }
  });
}
