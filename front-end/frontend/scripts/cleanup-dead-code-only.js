#!/usr/bin/env node
/**
 * CONSERVATIVE cleanup: Remove only obvious dead code patterns
 * - auth.auth.* (double namespace - clear indication of broken structure)
 * - Keys from completely removed pages (selectRole, resetPassword - not in current flow)
 */

import fs from "fs";
import path from "path";
import { globSync } from "glob";

const localesDir = "src/i18n/locales";
const locales = ["en", "vi"];

// CONSERVATIVE list: only obviously dead code
const deadCodePatterns = [
  /^auth\.auth\./, // Double namespace - structural error
  /^pages\.selectRole/, // Removed feature - multi-role selection no longer needed
];

// Keys to specifically remove (after manual verification they're truly dead)
const safesToRemove = [
  "auth.auth.messages.authenticationFailed",
  "auth.auth.messages.registrationFailed",
  "auth.auth.messages.unableToSignInRightNow",
  "auth.auth.messages.useAuthError",
  "auth.auth.pages.login",
];

// Read unused keys from audit
const unusedKeysFile = "unused-keys-full.txt";
let allUnusedKeys = [];
try {
  const content = fs.readFileSync(unusedKeysFile, "utf8");
  allUnusedKeys = content
    .split("\n")
    .filter(
      (line) =>
        line.trim() &&
        !line.includes("═") &&
        !line.includes("UNUSED") &&
        !line.includes("Generated") &&
        !line.includes("FULL LIST") &&
        !line.includes("─")
    )
    .map((line) => line.trim());
} catch {
  console.error("❌ Could not read unused-keys-full.txt");
  process.exit(1);
}

// Filter to only conservative removals
const keysToRemove = allUnusedKeys.filter((key) => safesToRemove.includes(key));

if (keysToRemove.length === 0) {
  console.log("⚠️  No keys match conservative removal criteria");
  console.log(
    "   Recommendation: Keep current state until audit script is fixed"
  );
  process.exit(0);
}

console.log(`🧹 CONSERVATIVE CLEANUP - Only removing obvious dead code\n`);
console.log(`Keys to remove: ${keysToRemove.length}\n`);

// Helper functions
function deleteNestedKey(obj, keyPath) {
  const keys = keyPath.split(".");
  let current = obj;

  for (let i = 0; i < keys.length - 1; i++) {
    if (!(keys[i] in current) || typeof current[keys[i]] !== "object") {
      return false;
    }
    current = current[keys[i]];
  }

  const lastKey = keys[keys.length - 1];
  if (lastKey in current) {
    delete current[lastKey];
    return true;
  }
  return false;
}

// Cleanup locales
let totalRemoved = 0;
locales.forEach((locale) => {
  console.log(`📝 Processing ${locale.toUpperCase()} locale...`);
  const files = globSync(`${localesDir}/${locale}/*.json`);

  files.forEach((file) => {
    try {
      let content = JSON.parse(fs.readFileSync(file, "utf8"));
      let removed = 0;

      keysToRemove.forEach((keyPath) => {
        if (deleteNestedKey(content, keyPath)) {
          removed++;
          totalRemoved++;
        }
      });

      if (removed > 0) {
        fs.writeFileSync(file, JSON.stringify(content, null, 2) + "\n");
        console.log(`  ✅ ${path.basename(file)}: ${removed} keys removed`);
      }
    } catch (error) {
      console.error(`  ❌ Error: ${error.message}`);
    }
  });
});

console.log(`\n✅ Conservative cleanup complete!`);
console.log(`📊 Total removed: ${totalRemoved} obviously-dead keys\n`);
console.log(`Next: Run 'npm run audit:i18n' to verify no regressions\n`);
