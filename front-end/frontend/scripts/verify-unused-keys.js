#!/usr/bin/env node
/**
 * Smart verification & cleanup of unused i18n keys
 * - Verifies each key in code before removing
 * - Groups by module for easier review
 * - Creates backup report before cleanup
 */

import fs from "fs";
import path from "path";
import { globSync } from "glob";

const localesDir = "src/i18n/locales";
const locales = ["en", "vi"];
const srcDir = "src";

// Read unused keys from audit report
const unusedKeysFile = "unused-keys-full.txt";
let unusedKeys = [];
try {
  const content = fs.readFileSync(unusedKeysFile, "utf8");
  unusedKeys = content
    .split("\n")
    .filter(
      (line) =>
        line.trim() &&
        !line.includes("═") &&
        !line.includes("UNUSED") &&
        !line.includes("Generated") &&
        !line.includes("Total") &&
        !line.includes("FULL LIST") &&
        !line.includes("─") &&
        !line.includes("END OF")
    )
    .map((line) => line.trim());
} catch (error) {
  console.error(`❌ Could not read ${unusedKeysFile}`);
  process.exit(1);
}

console.log(`📋 Loaded ${unusedKeys.length} keys to verify\n`);

// Get all TS/TSX files
const srcFiles = globSync(`${srcDir}/**/*.{ts,tsx,js,jsx}`);
console.log(`📁 Scanning ${srcFiles.length} code files...\n`);

// Verify each key - check if it appears in code
const verification = {
  confirmed_unused: [],
  possibly_used: [],
  used_in_code: [],
};

unusedKeys.forEach((key, idx) => {
  if (idx % 100 === 0) {
    process.stdout.write(`  Progress: ${idx}/${unusedKeys.length}\r`);
  }

  const searchTerm = key
    .replace(/\./g, "\\.")
    .replace(/"/g, '\\"')
    .replace(/'/g, "\\'");

  // Search in all source files for ANY reference to this key
  let found = false;
  for (const file of srcFiles) {
    try {
      const content = fs.readFileSync(file, "utf8");

      // Multiple patterns to catch usage
      const patterns = [
        new RegExp(`t\\(\\s*["'\`]${searchTerm}["'\`]`), // t("key")
        new RegExp(`['"\`]${searchTerm}['"\`]\\s*[,}]`), // In object literals
        new RegExp(`key\\s*=\\s*["'\`]${searchTerm}["'\`]`), // key = "..."
        new RegExp(`["'\`]${searchTerm}["'\`]`), // Any literal string
      ];

      if (patterns.some((pattern) => pattern.test(content))) {
        verification.used_in_code.push(key);
        found = true;
        break;
      }
    } catch {
      // Skip unreadable files
    }
  }

  if (!found) {
    verification.confirmed_unused.push(key);
  } else {
    verification.possibly_used.push(key);
  }
});

console.log(`\n✅ Verification complete!\n`);

// Group by module
function groupByModule(keys) {
  const grouped = {};
  keys.forEach((key) => {
    const module = key.split(".")[0];
    if (!grouped[module]) {
      grouped[module] = [];
    }
    grouped[module].push(key);
  });
  return grouped;
}

const unusedByModule = groupByModule(verification.confirmed_unused);
const usedByModule = groupByModule(verification.used_in_code);

// Create verification report
let report = `SMART VERIFICATION REPORT
═════════════════════════════════════════════════════════════════════════════
Generated: ${new Date().toISOString()}

SUMMARY
────────────────────────────────────────────────────────────────────────────
  Keys analyzed: ${unusedKeys.length}
  ✅ Truly unused (safe to remove): ${verification.confirmed_unused.length}
  ⚠️  Possibly used (found in code): ${verification.used_in_code.length}

═════════════════════════════════════════════════════════════════════════════

SECTION 1: CONFIRMED UNUSED KEYS (${verification.confirmed_unused.length} keys)
────────────────────────────────────────────────────────────────────────────

`;

Object.entries(unusedByModule)
  .sort(([a], [b]) => a.localeCompare(b))
  .forEach(([module, keys]) => {
    report += `\n${module} module (${keys.length} keys):\n`;
    keys.sort().forEach((key) => {
      report += `  - ${key}\n`;
    });
  });

report += `\n═════════════════════════════════════════════════════════════════════════════\n`;
report += `\nSECTION 2: FALSE POSITIVES - ACTUALLY USED (${verification.used_in_code.length} keys)\n`;
report += `────────────────────────────────────────────────────────────────────────────\n`;
report += `These keys are marked "unused" by audit but ARE used in code.\n`;
report += `FIX: Improve audit script logic to detect cross-namespace keys properly.\n\n`;

Object.entries(usedByModule)
  .sort(([a], [b]) => a.localeCompare(b))
  .forEach(([module, keys]) => {
    report += `\n${module} module (${keys.length} keys - NOT TO BE REMOVED):\n`;
    keys
      .sort()
      .slice(0, 10)
      .forEach((key) => {
        report += `  - ${key}\n`;
      });
    if (keys.length > 10) {
      report += `  ... and ${keys.length - 10} more\n`;
    }
  });

report += `\n═════════════════════════════════════════════════════════════════════════════\n`;
report += `END OF REPORT\n`;

// Save report
const reportPath = `CLEANUP_VERIFICATION_REPORT.txt`;
fs.writeFileSync(reportPath, report, "utf8");

console.log(`📄 Verification report saved to: ${reportPath}`);
console.log(
  `\n✅ CONFIRMED UNUSED: ${verification.confirmed_unused.length} keys (safe to remove)`
);
console.log(
  `⚠️  FOUND IN CODE: ${verification.used_in_code.length} keys (FALSE POSITIVES)\n`
);

// Export confirmed unused keys for cleanup
if (verification.confirmed_unused.length > 0) {
  const cleanupList = verification.confirmed_unused.join("\n");
  fs.writeFileSync("keys-to-cleanup.txt", cleanupList, "utf8");
  console.log(`💾 Cleanup list saved to: keys-to-cleanup.txt\n`);
  console.log(`Next step: Review the report, then run:`);
  console.log(`  npm run cleanup:confirmed-unused\n`);
}
