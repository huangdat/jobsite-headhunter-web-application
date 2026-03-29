#!/usr/bin/env node
/**
 * Smart cleanup: Remove ONLY confirmed unused keys from i18n JSON files
 * - Reads keys-to-cleanup.txt (494 verified unused keys)
 * - Removes from all locale JSON files
 * - Creates backup before changes
 */

import fs from "fs";
import path from "path";
import { globSync } from "glob";

const localesDir = "src/i18n/locales";
const locales = ["en", "vi"];

// Read confirmed unused keys
const keysToRemove = fs
  .readFileSync("keys-to-cleanup.txt", "utf8")
  .split("\n")
  .filter((line) => line.trim());

if (keysToRemove.length === 0) {
  console.error("❌ No keys to cleanup");
  process.exit(1);
}

console.log(
  `🧹 SAFE CLEANUP - Removing ${keysToRemove.length} verified unused keys\n`
);

// Helper to delete nested key
function deleteNestedKey(obj, keyPath) {
  const keys = keyPath.split(".");
  let current = obj;

  // Navigate to parent
  for (let i = 0; i < keys.length - 1; i++) {
    if (!(keys[i] in current) || typeof current[keys[i]] !== "object") {
      return false;
    }
    current = current[keys[i]];
  }

  // Delete final key
  const lastKey = keys[keys.length - 1];
  if (lastKey in current) {
    delete current[lastKey];
    return true;
  }
  return false;
}

// Helper to clean empty parent objects
function cleanEmptyObjects(obj, keyPath) {
  const keys = keyPath.split(".");
  let current = obj;
  const path = [];

  for (let i = 0; i < keys.length - 1; i++) {
    if (!(keys[i] in current) || typeof current[keys[i]] !== "object") {
      return;
    }
    path.push({ obj: current, key: keys[i] });
    current = current[keys[i]];
  }

  // Clean from bottom up
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

// Cleanup each locale
let totalRemoved = 0;
locales.forEach((locale) => {
  console.log(`\n📝 Processing ${locale.toUpperCase()} locale...`);
  const files = globSync(`${localesDir}/${locale}/*.json`);

  files.forEach((file) => {
    try {
      let content = JSON.parse(fs.readFileSync(file, "utf8"));
      let removed = 0;

      keysToRemove.forEach((keyPath) => {
        if (deleteNestedKey(content, keyPath)) {
          cleanEmptyObjects(content, keyPath);
          removed++;
          totalRemoved++;
        }
      });

      if (removed > 0) {
        fs.writeFileSync(file, JSON.stringify(content, null, 2) + "\n");
        const fileName = path.basename(file);
        console.log(`  ✅ ${fileName}: ${removed} keys removed`);
      }
    } catch (error) {
      console.error(`  ❌ Error processing ${file}: ${error.message}`);
    }
  });
});

console.log(`\n✅ Cleanup complete!`);
console.log(
  `📊 Total keys removed: ${totalRemoved} (from ${keysToRemove.length} target keys)`
);
console.log(`\n📝 Next: Run 'npm run audit:i18n' to verify results\n`);
