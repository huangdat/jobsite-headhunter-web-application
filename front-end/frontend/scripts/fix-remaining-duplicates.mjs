#!/usr/bin/env node

import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const localesPath = path.resolve(__dirname, "../src/i18n/locales");

/**
 * Deep merge two objects. In case of conflict, prefer 'preferred' source.
 */
function deepMerge(target, source, preferTarget = false) {
  const result = { ...target };

  for (const [key, value] of Object.entries(source)) {
    if (key in result) {
      if (
        typeof result[key] === "object" &&
        typeof value === "object" &&
        !Array.isArray(result[key]) &&
        !Array.isArray(value)
      ) {
        result[key] = deepMerge(result[key], value, preferTarget);
      } else if (!preferTarget) {
        result[key] = value;
      }
    } else {
      result[key] = value;
    }
  }

  return result;
}

/**
 * Fix a single JSON file by removing duplicate namespace wrapper
 */
function fixDuplicateWrapper(locale, namespace) {
  const filePath = path.join(localesPath, locale, `${namespace}.json`);

  if (!fs.existsSync(filePath)) {
    console.log(`  ⚠️  ${namespace}.json not found in ${locale}`);
    return { fixed: false };
  }

  const content = fs.readFileSync(filePath, "utf-8");
  const jsonData = JSON.parse(content);

  // Check if duplicate wrapper exists
  if (!(namespace in jsonData)) {
    console.log(
      `  ✅ ${locale}/${namespace}.json - No duplicate wrapper found`
    );
    return { fixed: false };
  }

  console.log(
    `  🔧 ${locale}/${namespace}.json - Found duplicate '${namespace}' wrapper`
  );

  // Backup
  const timestamp = new Date().toISOString().replace(/[:.]/g, "-").slice(0, 19);
  const backupPath = `${filePath}.backup-${timestamp}`;
  fs.writeFileSync(backupPath, content, "utf-8");
  console.log(`     💾 Backup: ${path.basename(backupPath)}`);

  // Extract wrapper content and rest of data
  const wrapperContent = jsonData[namespace];
  const { [namespace]: _, ...restData } = jsonData;

  // Merge: Keep root-level values, add wrapper content
  const mergedData = deepMerge(wrapperContent, restData, false);

  // Detect conflicts
  const conflictKeys = Object.keys(restData).filter(
    (key) => key in wrapperContent
  );
  if (conflictKeys.length > 0) {
    console.log(
      `     ⚠️  Conflicts found: ${conflictKeys.length} keys exist in both root and wrapper`
    );
    console.log(`     🔄 Resolution: Kept wrapper values (preferred)`);
  }

  // Write fixed content
  fs.writeFileSync(
    filePath,
    JSON.stringify(mergedData, null, 2) + "\n",
    "utf-8"
  );

  console.log(
    `     ✨ Fixed! Root keys: ${Object.keys(restData).length} + Wrapper keys: ${Object.keys(wrapperContent).length} → Total: ${Object.keys(mergedData).length}`
  );

  return {
    fixed: true,
    conflicts: conflictKeys.length,
    totalKeys: Object.keys(mergedData).length,
  };
}

// Main execution
console.log("🔧 FIXING REMAINING DUPLICATE NAMESPACE WRAPPERS\n");

const namespacesToFix = ["aria", "dialogs", "form"];
const locales = ["en", "vi"];

const results = {
  fixed: 0,
  skipped: 0,
  total: 0,
};

namespacesToFix.forEach((namespace) => {
  console.log(`\n${"=".repeat(60)}`);
  console.log(`Processing: ${namespace}.json`);
  console.log("=".repeat(60));

  locales.forEach((locale) => {
    results.total++;
    const result = fixDuplicateWrapper(locale, namespace);
    if (result.fixed) {
      results.fixed++;
    } else {
      results.skipped++;
    }
  });
});

console.log("\n" + "=".repeat(60));
console.log("SUMMARY");
console.log("=".repeat(60));
console.log(`Total files processed: ${results.total}`);
console.log(`Fixed: ${results.fixed}`);
console.log(`Skipped (no issues): ${results.skipped}`);
console.log("\n✅ All duplicate wrappers have been removed!");
console.log('💡 Next: Run "npm run lint:i18n" to verify\n');
