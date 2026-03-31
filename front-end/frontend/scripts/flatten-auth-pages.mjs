#!/usr/bin/env node

import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const localesPath = path.resolve(__dirname, "../src/i18n/locales");

/**
 * Flatten auth.json by moving pages.* to root level
 *
 * INPUT:
 * {
 *   "pages": {
 *     "signup": "...",
 *     "login": "...",
 *     "register": { ... }
 *   },
 *   "login": "..."  // Already exists at root
 * }
 *
 * OUTPUT:
 * {
 *   "login": "..."  // Keep existing root values
 *   "signup": "...",  // Moved from pages.signup
 *   "register": { ... },  // Moved from pages.register
 *   "social": { ... }  // Moved from pages.social
 * }
 */
function flattenAuthPages(locale) {
  const authPath = path.join(localesPath, locale, "auth.json");

  if (!fs.existsSync(authPath)) {
    console.log(`⚠️  auth.json not found for locale: ${locale}`);
    return;
  }

  console.log(`\n${"=".repeat(60)}`);
  console.log(`Processing ${locale}/auth.json`);
  console.log("=".repeat(60));

  const content = fs.readFileSync(authPath, "utf-8");
  const jsonData = JSON.parse(content);

  // Check if pages wrapper exists
  if (!jsonData.pages) {
    console.log('✅ No "pages" wrapper found - already flattened');
    return;
  }

  console.log('\n📦 Found "pages" wrapper with keys:');
  Object.keys(jsonData.pages).forEach((key) => {
    console.log(`  - pages.${key}`);
  });

  // Create backup with timestamp
  const timestamp = new Date().toISOString().replace(/[:.]/g, "-").slice(0, 19);
  const backupPath = `${authPath}.flatten-backup-${timestamp}`;
  fs.writeFileSync(backupPath, content, "utf-8");
  console.log(`\n💾 Backup created: ${path.basename(backupPath)}`);

  // Move pages.* to root, but don't overwrite existing root keys
  const pagesContent = jsonData.pages;
  const conflicts = [];
  const moved = [];

  for (const [key, value] of Object.entries(pagesContent)) {
    if (key in jsonData && key !== "pages") {
      conflicts.push({
        key,
        rootValue: jsonData[key],
        pagesValue: value,
      });
      console.log(
        `⚠️  Conflict: "${key}" exists in both root and pages.${key}`
      );
    } else {
      jsonData[key] = value;
      moved.push(key);
    }
  }

  // Remove the pages wrapper
  delete jsonData.pages;

  // Handle conflicts: prefer root value (already exists)
  if (conflicts.length > 0) {
    console.log("\n🔄 Conflict resolution (keeping ROOT values):");
    conflicts.forEach(({ key, rootValue, pagesValue }) => {
      const rootPreview =
        typeof rootValue === "string"
          ? rootValue.slice(0, 50)
          : JSON.stringify(rootValue).slice(0, 50);
      console.log(`  - "${key}": Kept root value: ${rootPreview}...`);
    });
  }

  console.log("\n✅ Moved from pages.* to root:");
  moved.forEach((key) => {
    const valuePreview =
      typeof jsonData[key] === "string"
        ? jsonData[key].slice(0, 60)
        : `{...} (${Object.keys(jsonData[key]).length} keys)`;
    console.log(`  - ${key}: ${valuePreview}`);
  });

  // Write flattened structure
  fs.writeFileSync(authPath, JSON.stringify(jsonData, null, 2) + "\n", "utf-8");
  console.log(`\n✨ Successfully flattened ${locale}/auth.json`);
  console.log(`   Total root-level keys now: ${Object.keys(jsonData).length}`);
}

// Main execution
console.log("🔧 AUTH.JSON PAGES FLATTENING TOOL\n");

["en", "vi"].forEach((locale) => {
  try {
    flattenAuthPages(locale);
  } catch (error) {
    console.error(`\n❌ Error processing ${locale}/auth.json:`, error.message);
  }
});

console.log("\n" + "=".repeat(60));
console.log("✅ Flattening complete!");
console.log(
  '💡 Next step: Run "npm run lint:i18n" to verify missing keys are fixed'
);
console.log("=".repeat(60) + "\n");
