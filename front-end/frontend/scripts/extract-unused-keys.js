#!/usr/bin/env node
/**
 * Extract complete list of unused keys from audit
 * Then generate cleanup script
 */

import fs from "fs";
import { globSync } from "glob";

const localesDir = "src/i18n/locales";
const locales = ["en", "vi"];
const srcDir = "src";

const excludePatterns = [
  /ParticleBackground\.tsx/,
  /useJobFilters\.ts/,
  /canvas/i,
  /canvas.*context/i,
];

const falsPositiveKeys = new Set([
  "-",
  "2d",
  "ALL",
  "CUSTOM",
  "NEGOTIABLE",
  "a",
  "code",
  "state",
]);

const isSuspiciousKey = (key) => {
  return key.length === 1 || falsPositiveKeys.has(key);
};

/**
 * Get all i18n keys from JSON files with flat dot notation
 */
function getAllKeysFlat() {
  const allKeys = new Map(); // key -> { locale, file, value }

  locales.forEach((lng) => {
    const files = globSync(`${localesDir}/${lng}/*.json`);
    files.forEach((file) => {
      try {
        const content = JSON.parse(fs.readFileSync(file, "utf8"));
        const fileName = file.split(/[/\\]/).pop().replace(".json", "");

        function flattenKeys(obj, prefix = "") {
          Object.entries(obj).forEach(([key, value]) => {
            const fullKey = prefix ? `${prefix}.${key}` : key;

            if (
              typeof value === "object" &&
              value !== null &&
              !Array.isArray(value)
            ) {
              flattenKeys(value, fullKey);
            } else {
              if (!allKeys.has(fullKey)) {
                allKeys.set(fullKey, []);
              }
              allKeys.get(fullKey).push({
                locale: lng,
                file: fileName,
                value:
                  typeof value === "string" ? value : JSON.stringify(value),
              });
            }
          });
        }

        flattenKeys(content);
      } catch (error) {
        console.error(`Error reading ${file}:`, error.message);
      }
    });
  });

  return allKeys;
}

/**
 * Get all keys used in code
 */
function getUsedKeysFromCode() {
  const usedKeys = new Set();
  const filePattern = `${srcDir}/**/*.{tsx,ts,jsx,js}`;
  const files = globSync(filePattern);

  // Check if file should be excluded
  const shouldExclude = (filePath) =>
    excludePatterns.some((p) => p.test(filePath));

  files.forEach((filePath) => {
    if (shouldExclude(filePath)) return;

    try {
      const content = fs.readFileSync(filePath, "utf8");

      // Match patterns like t("key"), t(`key`), tAuth("key")
      const patterns = [
        /t\(["'`]([^"'`]+)["'`]\)/g, // t("key") or t('key') or t(`key`)
        /tAuth\(["'`]([^"'`]+)["'`]\)/g, // tAuth("key")
        /t\(`([^`]+)`\)/g, // t(`key`)
      ];

      patterns.forEach((pattern) => {
        let match;
        while ((match = pattern.exec(content)) !== null) {
          let key = match[1];
          // Handle template literals with variables
          if (!key.includes("${")) {
            usedKeys.add(key);
          }
        }
      });
    } catch (error) {
      // Skip unreadable files
    }
  });

  return usedKeys;
}

/**
 * Main function
 */
function generateUnusedKeysList() {
  console.log("📊 Analyzing i18n keys...\n");

  const allKeys = getAllKeysFlat();
  const usedKeys = getUsedKeysFromCode();

  const unusedKeys = Array.from(allKeys.keys()).filter((key) => {
    if (isSuspiciousKey(key)) return false;
    return !usedKeys.has(key);
  });

  console.log(`✅ Total keys found: ${allKeys.size}`);
  console.log(`✅ Used keys found: ${usedKeys.size}`);
  console.log(`⚠️  Unused keys found: ${unusedKeys.length}\n`);

  // Group by namespace (first part before dot)
  const byNamespace = {};
  unusedKeys.forEach((key) => {
    const ns = key.split(".")[0];
    if (!byNamespace[ns]) byNamespace[ns] = [];
    byNamespace[ns].push(key);
  });

  console.log("Breakdown by namespace:");
  Object.entries(byNamespace).forEach(([ns, keys]) => {
    console.log(`  ${ns}: ${keys.length} unused keys`);
  });

  // Save to file for reference
  const report = {
    summary: {
      totalKeys: allKeys.size,
      usedKeys: usedKeys.size,
      unusedKeys: unusedKeys.length,
    },
    unusedKeys,
    byNamespace,
  };

  fs.writeFileSync(
    "unused-keys-report.json",
    JSON.stringify(report, null, 2) + "\n"
  );

  // Generate cleanup script code
  const cleanupCode = `const unusedKeys = ${JSON.stringify(unusedKeys, null, 2)};`;

  console.log("\n✨ Reports generated:");
  console.log("  - unused-keys-report.json");

  return unusedKeys;
}

generateUnusedKeysList();
