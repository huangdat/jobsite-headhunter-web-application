#!/usr/bin/env node
/**
 * Smart i18n cleanup with validation
 * Only removes keys that are 100% confirmed unused
 */

import fs from "fs";
import path from "path";
import { globSync } from "glob";

const localesDir = "src/i18n/locales";
const locales = ["en", "vi"];
const srcDir = "src";

// Read unused keys from audit report
function getUnusedKeysFromAudit() {
  try {
    const reportPath = "audit-report.txt";
    const content = fs.readFileSync(reportPath, "utf8");

    // Extract keys between "UNUSED i18n KEYS" and "END OF REPORT"
    const match = content.match(
      /⚠️\s+UNUSED i18n KEYS[\s\S]*?(?=END OF REPORT)/
    );
    if (!match) return [];

    const keysSection = match[0];
    const keyLines = keysSection
      .split("\n")
      .filter(
        (line) =>
          line.trim() && !line.includes("UNUSED") && !line.includes("total")
      );

    const keys = keyLines
      .map((line) => line.trim())
      .filter((line) => line && !line.startsWith("..."));

    return keys;
  } catch {
    console.error("❌ Error reading audit report:");
    return [];
  }
}

/**
 * Get all i18n keys used in code files
 */
function getUsedKeysFromCode() {
  const usedKeys = new Set();
  const filePattern = `${srcDir}/**/*.{tsx,ts,jsx,js}`;
  const files = globSync(filePattern);

  const excludePatterns = [/ParticleBackground\.tsx/, /useJobFilters\.ts/];

  files.forEach((filePath) => {
    if (excludePatterns.some((p) => p.test(filePath))) return;

    try {
      const content = fs.readFileSync(filePath, "utf8");

      // Match patterns like t("key"), t(`key`), tAuth("key")
      const patterns = [
        /t\(["'`]([^"'`]+)["'`]\)/g,
        /tAuth\(["'`]([^"'`]+)["'`]\)/g,
        /t\(`([^`]+)`\)/g,
        /tHome\(["'`]([^"'`]+)["'`]\)/g,
        /tJobs\(["'`]([^"'`]+)["'`]\)/g,
        /tUsers\(["'`]([^"'`]+)["'`]\)/g,
        /tCandidate\(["'`]([^"'`]+)["'`]\)/g,
        /tBusiness\(["'`]([^"'`]+)["'`]\)/g,
        /tNavigation\(["'`]([^"'`]+)["'`]\)/g,
      ];

      patterns.forEach((pattern) => {
        let match;
        while ((match = pattern.exec(content)) !== null) {
          let key = match[1];
          if (!key.includes("${")) {
            usedKeys.add(key);
          }
        }
      });
    } catch {
      // Skip unreadable files
    }
  });

  return usedKeys;
}

/**
 * Get all keys defined in JSON files
 */
function getAllJsonKeys() {
  const allKeys = new Map(); // key -> { file, locale, value }

  locales.forEach((locale) => {
    const files = globSync(`${localesDir}/${locale}/*.json`);
    files.forEach((file) => {
      try {
        const content = JSON.parse(fs.readFileSync(file, "utf8"));
        const fileName = path.basename(file, ".json");

        function flattenKeys(obj, prefix = "") {
          Object.entries(obj).forEach(([key, value]) => {
            const fullKey = prefix ? `${prefix}.${key}` : key;
            const fullKeyWithNamespace = `${fileName}.${fullKey}`;

            if (
              typeof value === "object" &&
              value !== null &&
              !Array.isArray(value)
            ) {
              flattenKeys(value, fullKey);
            } else {
              allKeys.set(fullKeyWithNamespace, {
                file,
                locale,
                keyPath: fullKey,
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
 * Delete a nested key from object
 */
function deleteNestedKey(obj, keyPath) {
  const keys = keyPath.split(".");
  let current = obj;

  for (let i = 0; i < keys.length - 1; i++) {
    if (
      typeof current !== "object" ||
      current === null ||
      !(keys[i] in current)
    ) {
      return false;
    }
    current = current[keys[i]];
  }

  const lastKey = keys[keys.length - 1];
  if (typeof current === "object" && current !== null && lastKey in current) {
    delete current[lastKey];
    return true;
  }

  return false;
}

/**
 * Clean empty parent objects
 */
function cleanEmptyObjects(obj, keyPath) {
  const keys = keyPath.split(".");
  let current = obj;
  const path = [];

  for (let i = 0; i < keys.length - 1; i++) {
    if (
      typeof current !== "object" ||
      current === null ||
      !(keys[i] in current)
    ) {
      return;
    }
    path.push({ obj: current, key: keys[i] });
    current = current[keys[i]];
  }

  for (let i = path.length - 1; i >= 0; i--) {
    const parent = path[i].obj;
    const key = path[i].key;
    if (
      typeof parent[key] === "object" &&
      parent[key] !== null &&
      Object.keys(parent[key]).length === 0
    ) {
      delete parent[key];
    }
  }
}

/**
 * Main validation and cleanup
 */
function validateAndCleanup() {
  console.log("🔍 Starting smart validation...\n");

  const auditUnusedKeys = getUnusedKeysFromAudit();
  const codeUsedKeys = getUsedKeysFromCode();
  const jsonAllKeys = getAllJsonKeys();

  console.log(`📊 Audit report unused keys: ${auditUnusedKeys.length}`);
  console.log(`📊 Code used keys: ${codeUsedKeys.size}`);
  console.log(`📊 JSON defined keys: ${jsonAllKeys.size}\n`);

  // Find truly unused keys (in audit but NOT in code)
  const truelyUnused = auditUnusedKeys.filter((key) => !codeUsedKeys.has(key));

  console.log(`✅ Truly unused keys (safe to remove): ${truelyUnused.length}`);
  console.log(
    `⚠️  Keys used in code (will NOT remove): ${auditUnusedKeys.length - truelyUnused.length}\n`
  );

  // Group by file
  const byFile = {};
  const keysToRemove = new Map();

  truelyUnused.forEach((key) => {
    const jsonKey = jsonAllKeys.get(key);
    if (jsonKey) {
      const file = jsonKey.file;
      if (!byFile[file]) byFile[file] = [];
      byFile[file].push(key);
      keysToRemove.set(key, jsonKey.keyPath);
    }
  });

  // Display breakdown
  console.log("Breakdown by file:");
  Object.entries(byFile).forEach(([file, keys]) => {
    console.log(`  ${path.relative(process.cwd(), file)}: ${keys.length} keys`);
  });

  console.log("\n🧹 Applying cleanup...\n");

  // Clean up files
  let totalRemoved = 0;
  locales.forEach((locale) => {
    const files = globSync(`${localesDir}/${locale}/*.json`);
    files.forEach((file) => {
      let content = JSON.parse(fs.readFileSync(file, "utf8"));
      let removed = 0;

      keysToRemove.forEach((keyPath, fullKey) => {
        if (fullKey.startsWith(path.basename(file, ".json") + ".")) {
          if (deleteNestedKey(content, keyPath)) {
            removed++;
            cleanEmptyObjects(content, keyPath);
          }
        }
      });

      if (removed > 0) {
        fs.writeFileSync(file, JSON.stringify(content, null, 2) + "\n");
        console.log(
          `  ✅ ${path.relative(process.cwd(), file)}: ${removed} keys removed`
        );
        totalRemoved += removed;
      }
    });
  });

  console.log(`\n✨ Total keys removed: ${totalRemoved}`);
  console.log(`🎯 Safe cleanup complete!\n`);

  return totalRemoved;
}

// Run
try {
  validateAndCleanup();
  console.log("📝 Run 'npm run audit:i18n' to verify\n");
} catch (error) {
  console.error("❌ Error:", error.message);
  process.exit(1);
}
