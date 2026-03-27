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
              if (fileName === "common") {
                allKeys.add(fullKey);
              } else {
                allKeys.add(`${fileName}.${fullKey}`);
              }
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

function scanCodeWithLocations() {
  const usedKeysMap = new Map(); // Map<key, Array<{file, line}>>
  const files = globSync(`${srcDir}/**/*.{js,jsx,ts,tsx}`);

  // Feature hook to namespace prefix mapping
  const hookNamespaces = {
    useBusinessTranslation: "business",
    useUsersTranslation: "users",
    useCommissionTranslation: "commission",
    useCandidateTranslation: "candidate",
    useJobsTranslation: "jobs",
    useAppTranslation: null, // No prefix - uses full keys like "common.dismiss"
  };

  // Skip definition files - they show imports, not actual usage
  const skipDefinitionFiles = [
    /useFeatureTranslation\.ts/,
    /useAppTranslation\.ts/,
  ];

  // Patterns that indicate false positives
  const falsePositiveContexts = [
    /\.get\s*\(\s*["']state["']\s*\)/, // URL params like searchParams.get("state")
    /\.getContext\s*\(\s*["']2d["']\s*\)/, // Canvas context
  ];

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
      const lines = content.split("\n");

      // Detect which feature hooks are imported/used in this file
      const detectedHooks = new Map(); // hook name -> namespace
      for (const [hook, namespace] of Object.entries(hookNamespaces)) {
        // Simple string matching - more reliable than regex
        if (content.includes(hook)) {
          detectedHooks.set(hook, namespace);
        }
      }

      lines.forEach((line, idx) => {
        // Skip false positive context patterns
        if (falsePositiveContexts.some((pattern) => pattern.test(line))) {
          return;
        }

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

              // Skip suspicious keys
              if (isSuspiciousKey(trimmedKey)) {
                return;
              }

              let finalKey = trimmedKey;

              // Only apply namespace if file uses a SINGLE feature hook (not including useAppTranslation)
              // This avoids ambiguity when multiple hooks are used with different variable names
              if (detectedHooks.size === 1) {
                const [, namespace] = [...detectedHooks.entries()][0];
                // Only apply if it's a feature hook (not useAppTranslation which has null namespace)
                if (namespace) {
                  // Apply namespace prefix if key doesn't already start with it
                  if (!trimmedKey.startsWith(`${namespace}.`)) {
                    finalKey = `${namespace}.${trimmedKey}`;
                  }
                }
              }

              if (!usedKeysMap.has(finalKey)) {
                usedKeysMap.set(finalKey, []);
              }
              usedKeysMap.get(finalKey).push({
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

// Save to file
const filename = `audit-report.txt`;
fs.writeFileSync(filename, report, "utf8");

console.log(`✅ Smart audit report saved to: ${filename}`);
console.log(`📋 Missing keys (after filtering): ${missingKeys.length}`);
console.log(`📋 Unused keys: ${unusedKeys.length}`);
console.log(`\n📌 First 15 real missing keys:\n`);
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
