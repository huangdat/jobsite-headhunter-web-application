#!/usr/bin/env node
/**
 * Cleanup unused i18n keys from locale JSON files
 * Parses audit report and removes unused keys
 */

import fs from "fs";
import path from "path";
import { globSync } from "glob";

const localesDir = "src/i18n/locales";
const locales = ["en", "vi"];

// Load unused keys from report
let unusedKeys = [];
try {
  const report = JSON.parse(fs.readFileSync("unused-keys-report.json", "utf8"));
  unusedKeys = report.unusedKeys;
} catch {
  console.error("❌ Error reading unused-keys-report.json");
  console.error("   Run 'node scripts/extract-unused-keys.js' first");
  process.exit(1);
}

/**
 * Delete a nested key from an object using dot notation
 */
function deleteNestedKey(obj, keyPath) {
  const keys = keyPath.split(".");
  let current = obj;

  // Navigate to the parent of the target key
  for (let i = 0; i < keys.length - 1; i++) {
    if (
      !(keys[i] in current) ||
      typeof current[keys[i]] !== "object" ||
      current[keys[i]] === null
    ) {
      return false; // Path doesn't exist or is not an object
    }
    current = current[keys[i]];
  }

  // Delete the final key
  const lastKey = keys[keys.length - 1];
  if (typeof current === "object" && current !== null && lastKey in current) {
    delete current[lastKey];
    return true;
  }

  return false;
}

/**
 * Remove empty parent objects after key deletion
 */
function cleanEmptyObjects(obj, keyPath) {
  const keys = keyPath.split(".");
  let current = obj;
  const pathStack = [];

  // Build path to each level
  for (let i = 0; i < keys.length - 1; i++) {
    if (
      typeof current !== "object" ||
      current === null ||
      !(keys[i] in current)
    ) {
      return; // Can't proceed if path is invalid
    }
    pathStack.push({ obj: current, key: keys[i] });
    current = current[keys[i]];
  }

  // Clean up empty objects from bottom to top
  for (let i = pathStack.length - 1; i >= 0; i--) {
    const parent = pathStack[i].obj;
    const key = pathStack[i].key;
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
 * Main cleanup function
 */
function cleanupLocales() {
  let totalRemoved = 0;

  locales.forEach((locale) => {
    const files = globSync(`${localesDir}/${locale}/*.json`);

    files.forEach((file) => {
      try {
        const filePath = path.resolve(file);
        let content = JSON.parse(fs.readFileSync(filePath, "utf8"));
        let removedCount = 0;

        // For each unused key, try to delete it
        unusedKeys.forEach((keyPath) => {
          if (deleteNestedKey(content, keyPath)) {
            removedCount++;
            cleanEmptyObjects(content, keyPath);
          }
        });

        if (removedCount > 0) {
          // Write back the cleaned file
          fs.writeFileSync(filePath, JSON.stringify(content, null, 2) + "\n");
          totalRemoved += removedCount;
          console.log(
            `  ✅ ${path.relative(process.cwd(), filePath)}: ${removedCount} keys removed`
          );
        }
      } catch (error) {
        console.error(`  ❌ Error processing ${file}:`, error.message);
      }
    });
  });

  return { totalRemoved };
}

/**
 * Run the cleanup
 */
try {
  console.log("🧹 Starting i18n cleanup...\n");
  console.log(`📋 Total unused keys to remove: ${unusedKeys.length}\n`);

  const { totalRemoved } = cleanupLocales();

  console.log("\n✅ Cleanup completed!\n");
  console.log(
    `📊 Total keys removed: ${totalRemoved} out of ${unusedKeys.length}\n`
  );

  console.log("📝 Now run: npm run audit:i18n");
  console.log("✨ to verify all keys are cleaned up!\n");
} catch (error) {
  console.error("❌ Cleanup failed:", error.message);
  process.exit(1);
}
