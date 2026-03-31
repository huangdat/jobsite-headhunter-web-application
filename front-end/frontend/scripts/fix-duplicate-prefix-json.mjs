#!/usr/bin/env node
/**
 * Migration Script: Fix Duplicate Namespace Prefix in i18n JSON Files
 *
 * Problem: JSON files have both root-level keys AND duplicate namespace wrappers
 * Example: auth.json has { "messages": {...}, "auth": { "messages": {...} } }
 *
 * Solution: Merge wrapper content into root level, delete wrapper
 */

import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const LOCALES_DIR = path.join(__dirname, "../src/i18n/locales");
const LOCALES = ["en", "vi"];

// All 21 namespaces
const NAMESPACES = [
  "auth",
  "business",
  "common",
  "messages",
  "home",
  "users",
  "candidate",
  "headhunter",
  "collaborator",
  "jobs",
  "commission",
  "referrals",
  "admin",
  "pages",
  "navigation",
  "footer",
  "ui",
  "errors",
  "notifications",
  "dashboard",
  "settings",
  "profile",
];

const results = {
  fixed: [],
  skipped: [],
  errors: [],
  duplicateWrappers: [],
};

/**
 * Deep merge two objects
 */
function deepMerge(target, source) {
  const output = { ...target };

  for (const key in source) {
    if (
      source[key] &&
      typeof source[key] === "object" &&
      !Array.isArray(source[key])
    ) {
      if (
        output[key] &&
        typeof output[key] === "object" &&
        !Array.isArray(output[key])
      ) {
        output[key] = deepMerge(output[key], source[key]);
      } else {
        output[key] = source[key];
      }
    } else {
      output[key] = source[key];
    }
  }

  return output;
}

/**
 * Process a single JSON file to remove duplicate namespace wrapper
 */
function processJsonFile(locale, namespace) {
  const filePath = path.join(LOCALES_DIR, locale, `${namespace}.json`);

  if (!fs.existsSync(filePath)) {
    results.skipped.push(`${locale}/${namespace}.json - File not found`);
    return;
  }

  try {
    // Read and parse JSON
    const content = fs.readFileSync(filePath, "utf-8");
    const data = JSON.parse(content);

    // Check if duplicate wrapper exists
    if (data[namespace] && typeof data[namespace] === "object") {
      console.log(
        `\n⚠️  Found duplicate wrapper in ${locale}/${namespace}.json`
      );
      console.log(`   Wrapper key: "${namespace}"`);

      // Backup original file
      const backupPath = filePath + ".backup";
      fs.writeFileSync(backupPath, content, "utf-8");
      console.log(`   ✓ Backup created: ${namespace}.json.backup`);

      // Extract wrapper content
      const wrapperContent = data[namespace];

      // Log what's being merged
      const wrapperKeys = Object.keys(wrapperContent);
      console.log(
        `   Merging ${wrapperKeys.length} keys from wrapper:`,
        wrapperKeys.join(", ")
      );

      // Remove wrapper from data
      const { [namespace]: removed, ...restData } = data;

      // Merge wrapper content into root level
      const mergedData = deepMerge(restData, wrapperContent);

      // Check for conflicts
      const rootKeys = Object.keys(restData);
      const conflicts = wrapperKeys.filter((k) => rootKeys.includes(k));
      if (conflicts.length > 0) {
        console.log(`   ⚠️  Conflicts found (merged):`, conflicts.join(", "));
        results.duplicateWrappers.push({
          file: `${locale}/${namespace}.json`,
          conflicts: conflicts,
        });
      }

      // Write cleaned JSON
      const cleanedContent = JSON.stringify(mergedData, null, 2);
      fs.writeFileSync(filePath, cleanedContent, "utf-8");

      console.log(
        `   ✓ Fixed: Removed "${namespace}" wrapper, merged content to root`
      );
      results.fixed.push(`${locale}/${namespace}.json`);
    } else {
      results.skipped.push(
        `${locale}/${namespace}.json - No duplicate wrapper found`
      );
    }
  } catch (error) {
    console.error(
      `❌ Error processing ${locale}/${namespace}.json:`,
      error.message
    );
    results.errors.push({
      file: `${locale}/${namespace}.json`,
      error: error.message,
    });
  }
}

/**
 * Main execution
 */
function main() {
  console.log("🔧 i18n Duplicate Namespace Prefix Fixer\n");
  console.log(
    `Scanning ${NAMESPACES.length} namespaces × ${LOCALES.length} locales = ${NAMESPACES.length * LOCALES.length} files\n`
  );

  for (const locale of LOCALES) {
    console.log(`\n📁 Processing ${locale} locale...`);

    for (const namespace of NAMESPACES) {
      processJsonFile(locale, namespace);
    }
  }

  // Print summary
  console.log("\n\n" + "=".repeat(60));
  console.log("📊 SUMMARY");
  console.log("=".repeat(60));
  console.log(`✓ Fixed: ${results.fixed.length} files`);
  console.log(`• Skipped: ${results.skipped.length} files`);
  console.log(`❌ Errors: ${results.errors.length} files`);

  if (results.fixed.length > 0) {
    console.log("\n✓ Fixed files:");
    results.fixed.forEach((f) => console.log(`  - ${f}`));
  }

  if (results.duplicateWrappers.length > 0) {
    console.log("\n⚠️  Files with merge conflicts:");
    results.duplicateWrappers.forEach(({ file, conflicts }) => {
      console.log(`  - ${file}: ${conflicts.join(", ")}`);
    });
  }

  if (results.errors.length > 0) {
    console.log("\n❌ Errors:");
    results.errors.forEach(({ file, error }) => {
      console.log(`  - ${file}: ${error}`);
    });
  }

  console.log("\n💾 Backups saved as: *.json.backup");
  console.log("   To restore: mv file.json.backup file.json");

  console.log("\n✅ Phase 1 complete!");
  console.log("⚠️  Next step: Run Phase 2 to analyze TSX files");
  console.log("   Command: node scripts/fix-tsx-translation-calls.mjs");
}

main();
