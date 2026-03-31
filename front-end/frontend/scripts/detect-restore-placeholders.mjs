#!/usr/bin/env node

import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const localesPath = path.resolve(__dirname, "../src/i18n/locales");

// Pattern to detect merge conflict placeholders (e.g., "[auth.email]")
const PLACEHOLDER_PATTERN = /\[[\w.]+\]/g;

// Vietnamese placeholder pattern (intentional, not bugs)
const VI_PATTERN = /\[VI\]/;

const results = {
  totalFiles: 0,
  filesWithPlaceholders: 0,
  totalPlaceholders: 0,
  filesProcessed: [],
  summary: {},
};

/**
 * Scan a JSON file for placeholder values
 */
function scanFile(filePath) {
  const content = fs.readFileSync(filePath, "utf-8");
  const jsonData = JSON.parse(content);
  const placeholders = [];

  function traverse(obj, currentPath = []) {
    for (const [key, value] of Object.entries(obj)) {
      const fullPath = [...currentPath, key];
      const pathString = fullPath.join(".");

      if (typeof value === "string") {
        const matches = value.match(PLACEHOLDER_PATTERN);
        if (matches) {
          // Filter out intentional Vietnamese placeholders
          const isViPlaceholder = VI_PATTERN.test(value);
          if (!isViPlaceholder) {
            placeholders.push({
              path: pathString,
              value: value,
              placeholderMatch: matches[0],
            });
          }
        }
      } else if (typeof value === "object" && value !== null) {
        traverse(value, fullPath);
      }
    }
  }

  traverse(jsonData);
  return placeholders;
}

/**
 * Get the corresponding value from backup file
 */
function getBackupValue(backupPath, keyPath) {
  if (!fs.existsSync(backupPath)) {
    return null;
  }

  try {
    const backupContent = fs.readFileSync(backupPath, "utf-8");
    const backupData = JSON.parse(backupContent);

    const keys = keyPath.split(".");
    let value = backupData;

    for (const key of keys) {
      if (value && typeof value === "object" && key in value) {
        value = value[key];
      } else {
        return null;
      }
    }

    return typeof value === "string" ? value : null;
  } catch (error) {
    return null;
  }
}

/**
 * Restore placeholders in a JSON file
 */
function restorePlaceholders(filePath, placeholders) {
  const content = fs.readFileSync(filePath, "utf-8");
  const jsonData = JSON.parse(content);
  const backupPath = `${filePath}.backup`;

  let restoredCount = 0;
  const fixes = [];

  function setNestedValue(obj, pathArray, value) {
    const lastKey = pathArray[pathArray.length - 1];
    let current = obj;

    for (let i = 0; i < pathArray.length - 1; i++) {
      if (!(pathArray[i] in current)) {
        return false;
      }
      current = current[pathArray[i]];
    }

    current[lastKey] = value;
    return true;
  }

  for (const placeholder of placeholders) {
    const backupValue = getBackupValue(backupPath, placeholder.path);

    if (backupValue && backupValue !== placeholder.value) {
      const pathArray = placeholder.path.split(".");
      const success = setNestedValue(jsonData, pathArray, backupValue);

      if (success) {
        fixes.push({
          path: placeholder.path,
          before: placeholder.value,
          after: backupValue,
        });
        restoredCount++;
      }
    }
  }

  if (restoredCount > 0) {
    // Write the fixed content back
    fs.writeFileSync(
      filePath,
      JSON.stringify(jsonData, null, 2) + "\n",
      "utf-8"
    );
  }

  return { restoredCount, fixes };
}

/**
 * Process all JSON files in a locale directory
 */
function processLocale(localePath, localeName) {
  const files = fs
    .readdirSync(localePath)
    .filter((f) => f.endsWith(".json") && !f.endsWith(".backup"));

  console.log(`\n${"=".repeat(60)}`);
  console.log(
    `Processing ${localeName.toUpperCase()} locale (${files.length} files)`
  );
  console.log("=".repeat(60));

  for (const file of files) {
    const filePath = path.join(localePath, file);
    results.totalFiles++;

    const placeholders = scanFile(filePath);

    if (placeholders.length > 0) {
      results.filesWithPlaceholders++;
      results.totalPlaceholders += placeholders.length;

      console.log(`\n📄 ${file} - Found ${placeholders.length} placeholders`);

      // Restore from backup
      const restoration = restorePlaceholders(filePath, placeholders);

      results.filesProcessed.push({
        file: `${localeName}/${file}`,
        placeholdersFound: placeholders.length,
        placeholdersRestored: restoration.restoredCount,
        fixes: restoration.fixes,
      });

      if (restoration.restoredCount > 0) {
        console.log(
          `✅ Restored ${restoration.restoredCount} values from backup`
        );
        console.log("Changes:");
        restoration.fixes.forEach((fix) => {
          console.log(`  - ${fix.path}`);
          console.log(`    Before: "${fix.before}"`);
          console.log(`    After:  "${fix.after}"`);
        });
      } else {
        console.log(`⚠️  No backup found or values already match`);
        placeholders.forEach((p) => {
          console.log(`  - ${p.path}: "${p.value}"`);
        });
      }
    }
  }
}

/**
 * Generate summary report
 */
function generateReport() {
  console.log("\n");
  console.log("=".repeat(80));
  console.log("PLACEHOLDER RESTORATION SUMMARY");
  console.log("=".repeat(80));

  console.log(`\nTotal files scanned: ${results.totalFiles}`);
  console.log(`Files with placeholders: ${results.filesWithPlaceholders}`);
  console.log(`Total placeholders found: ${results.totalPlaceholders}`);

  const totalRestored = results.filesProcessed.reduce(
    (sum, f) => sum + f.placeholdersRestored,
    0
  );
  const totalRemaining = results.totalPlaceholders - totalRestored;

  console.log(`\n✅ Placeholders restored: ${totalRestored}`);
  console.log(`⚠️  Placeholders remaining: ${totalRemaining}`);

  if (totalRemaining > 0) {
    console.log("\n⚠️  REMAINING PLACEHOLDERS (need manual fix):");
    results.filesProcessed.forEach((fileInfo) => {
      const remaining =
        fileInfo.placeholdersFound - fileInfo.placeholdersRestored;
      if (remaining > 0) {
        console.log(`\n  ${fileInfo.file}: ${remaining} remaining`);
      }
    });
  }

  // Write detailed report
  const reportPath = path.resolve(
    __dirname,
    "placeholder-restoration-report.json"
  );
  fs.writeFileSync(reportPath, JSON.stringify(results, null, 2), "utf-8");
  console.log(`\n📝 Detailed report saved to: ${reportPath}`);

  console.log("\n" + "=".repeat(80));
}

// Main execution
console.log("🔍 PLACEHOLDER DETECTION AND RESTORATION TOOL");
console.log("Scanning JSON files for merge conflict placeholders...\n");

const enPath = path.join(localesPath, "en");
const viPath = path.join(localesPath, "vi");

processLocale(enPath, "en");
processLocale(viPath, "vi");

generateReport();

console.log("\n✨ Restoration complete!");
console.log(
  '💡 Next step: Run "npm run lint:i18n" to verify missing keys are fixed\n'
);
