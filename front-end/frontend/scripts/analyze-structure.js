#!/usr/bin/env node
/* global console */

/*##REMOVE##
/* global console */
/**
 * Structure Analyzer - Check if code keys match locale files
 * Option 3: Organize Keys - identify mismatches
 */

import fs from "fs";
import { globSync } from "glob";

const localesDir = "src/i18n/locales";
const locales = ["en"];
const srcDir = "src";

// False positive keys filter
const falsPositiveKeys = new Set([
  "-",
  "2d",
  "ALL",
  "CUSTOM",
  "NEGOTIABLE",
  "a",
  "code",
]);

const isSuspiciousKey = (key) => key.length === 1 || falsPositiveKeys.has(key);

// Get all keys from locale files with their structure
function getAllKeysWithStructure() {
  const keysByFeature = {}; // { feature: Set<key> }
  const allKeys = new Set();

  locales.forEach((lng) => {
    const files = globSync(`${localesDir}/${lng}/*.json`);
    files.forEach((file) => {
      try {
        const content = JSON.parse(fs.readFileSync(file, "utf8"));
        const fileName = file.split(/[/\\]/).pop().replace(".json", "");

        if (!keysByFeature[fileName]) {
          keysByFeature[fileName] = new Set();
        }

        function extractKeys(obj, prefix = "") {
          for (const [key, value] of Object.entries(obj)) {
            const fullKey = prefix ? `${prefix}.${key}` : key;
            if (typeof value === "string" || typeof value === "number") {
              const finalKey =
                fileName === "common" ? fullKey : `${fileName}.${fullKey}`;
              keysByFeature[fileName].add(finalKey);
              allKeys.add(finalKey);
            } else if (typeof value === "object" && value !== null) {
              extractKeys(value, fullKey);
            }
          }
        }
        extractKeys(content);
      } catch (e) {
        console.error(`Error parsing ${file}:`, e.message);
      }
    });
  });

  return { keysByFeature, allKeys };
}

// Get code usage by feature
function getCodeKeysByFeature() {
  const keysByFeature = {};
  const excludePatterns = [/ParticleBackground\.tsx/, /useJobFilters\.ts/];
  const files = globSync(`${srcDir}/**/*.{js,jsx,ts,tsx}`);

  files.forEach((file) => {
    if (excludePatterns.some((p) => p.test(file))) return;

    try {
      const content = fs.readFileSync(file, "utf8");
      const patterns = [
        /t\s*\(\s*'([^']+)'\s*\)/g,
        /t\s*\(\s*"([^"]+)"\s*\)/g,
        /t\s*\(\s*`([^`]+)`\s*\)/g,
      ];

      patterns.forEach((pattern) => {
        const matches = [...content.matchAll(pattern)];
        matches.forEach(([, key]) => {
          const trimmedKey = key.trim();

          if (
            trimmedKey &&
            !isSuspiciousKey(trimmedKey) &&
            !trimmedKey.includes("$") &&
            trimmedKey !== "."
          ) {
            // Extract feature from key (first part before dot)
            const feature = trimmedKey.split(".")[0];

            if (!keysByFeature[feature]) {
              keysByFeature[feature] = new Set();
            }
            keysByFeature[feature].add(trimmedKey);
          }
        });
      });
    } catch {
      // Skip
    }
  });

  return keysByFeature;
}

const { keysByFeature: localeByFeature, allKeys: allLocaleKeys } =
  getAllKeysWithStructure();
const codeByFeature = getCodeKeysByFeature();

console.log(`\n╔════════════════════════════════════════════════════════╗`);
console.log(`║  STRUCTURE ANALYSIS: Code vs Locale Files (Option 3)  ║`);
console.log(`╚════════════════════════════════════════════════════════╝\n`);

console.log(`📁 LOCALE FILES STRUCTURE:\n`);
Object.entries(localeByFeature).forEach(([feature, keys]) => {
  console.log(`  ${feature}.json → ${keys.size} keys`);
});

console.log(`\n📝 CODE USAGE BY FEATURE:\n`);
Object.entries(codeByFeature).forEach(([feature, keys]) => {
  const localeKeys = localeByFeature[feature] || new Set();
  const missing = [...keys].filter((k) => !allLocaleKeys.has(k)).length;
  const status = missing === 0 ? "✅" : `❌ (${missing} missing)`;
  console.log(
    `  ${feature} → ${keys.size} keys used, ${localeKeys.size} in locale ${status}`
  );
});

console.log(`\n\n═══════════════════════════════════════════════════════\n`);
console.log(`🔍 MISMATCHES DETAILS:\n`);

const allFeatures = new Set([
  ...Object.keys(localeByFeature),
  ...Object.keys(codeByFeature),
]);

let hasIssues = false;

allFeatures.forEach((feature) => {
  const localeKeys = localeByFeature[feature] || new Set();
  const codeKeys = codeByFeature[feature] || new Set();

  const missing = [...codeKeys].filter((k) => !allLocaleKeys.has(k));

  if (missing.length > 0 || (!localeByFeature[feature] && codeKeys.size > 0)) {
    hasIssues = true;
    console.log(`\n❌ FEATURE: "${feature}"`);

    if (!localeByFeature[feature]) {
      console.log(
        `   ⚠️  NO LOCALE FILE! (${codeKeys.size} keys used in code)`
      );
      console.log(
        `   Need to create: src/i18n/locales/{en,vi}/${feature}.json`
      );
      console.log(`   Keys needed:`);
      [...codeKeys].slice(0, 10).forEach((k) => {
        const shortKey = k.replace(`${feature}.`, "");
        console.log(`      - ${shortKey}`);
      });
      if (codeKeys.size > 10) {
        console.log(`      ... and ${codeKeys.size - 10} more`);
      }
    } else {
      console.log(`   Missing keys in ${feature}.json:`);
      missing.slice(0, 5).forEach((k) => {
        const shortKey = k.replace(`${feature}.`, "");
        console.log(`      - ${shortKey}`);
      });
      if (missing.length > 5) {
        console.log(`      ... and ${missing.length - 5} more`);
      }
    }
  } else if (localeKeys.size > 0 && codeKeys.size === 0) {
    console.log(`\n⚠️  FEATURE: "${feature}"`);
    console.log(`   Not used in code (${localeKeys.size} unused keys)`);
  }
});

if (!hasIssues) {
  console.log(`\n✅ All code keys match locale structure!`);
}

console.log(`\n═══════════════════════════════════════════════════════\n`);

// Summary for auto-generation
let summary = `\nSUMMARY FOR AUTO-GENERATION:\n`;
summary += `\nFeatures that need locale files created:\n`;
Object.entries(codeByFeature).forEach(([feature, keys]) => {
  if (!localeByFeature[feature]) {
    summary += `  - ${feature} (${keys.size} keys)\n`;
  }
});

summary += `\nFeatures with missing keys (need to update):\n`;
Object.entries(codeByFeature).forEach(([feature, codeKeys]) => {
  const missing = [...codeKeys].filter((k) => !allLocaleKeys.has(k));
  if (missing.length > 0 && localeByFeature[feature]) {
    summary += `  - ${feature} (${missing.length} missing keys)\n`;
  }
});

console.log(summary);

// Save analysis
const analysisReport = `${summary}`;
fs.writeFileSync(
  `structure-analysis-${Date.now()}.txt`,
  analysisReport,
  "utf8"
);
console.log(`📄 Analysis saved to: structure-analysis-*.txt\n`);
