#!/usr/bin/env node
/* global console */

/*##REMOVE##
/* global console */
/**
 * Merge Patches - Apply auto-generated patches to actual locale files
 */

import fs from "fs";
import path from "path";

const localesDir = "src/i18n/locales";

// Load patch files
const patchesData = JSON.parse(
  fs.readFileSync("patches-for-review.json", "utf8")
);
const newFilesData = JSON.parse(
  fs.readFileSync("new-files-for-review.json", "utf8")
);

console.log(`\n╔════════════════════════════════════════════════════════╗`);
console.log(`║      MERGING PATCHES INTO LOCALE FILES                ║`);
console.log(`╚════════════════════════════════════════════════════════╝\n`);

let filesCreated = 0;
let filesUpdated = 0;

// Apply existing file patches (merge with existing structure)
Object.entries(patchesData).forEach(([filePath, content]) => {
  const fullPath = path.join(localesDir, filePath);
  const dir = path.dirname(fullPath);

  // Ensure directory exists
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }

  // Deep merge with existing content if file exists
  let finalContent = content;
  if (fs.existsSync(fullPath)) {
    try {
      const existing = JSON.parse(fs.readFileSync(fullPath, "utf8"));
      finalContent = deepMerge(existing, content);
      filesUpdated++;
      console.log(`📝 UPDATED: ${filePath}`);
    } catch (e) {
      console.log(`⚠️  ERROR reading ${filePath}: ${e.message}`);
      return;
    }
  } else {
    filesCreated++;
    console.log(`✨ CREATED: ${filePath}`);
  }

  // Write merged content
  fs.writeFileSync(fullPath, JSON.stringify(finalContent, null, 2), "utf8");
});

// Create new files
Object.entries(newFilesData).forEach(([filePath, content]) => {
  const fullPath = path.join(localesDir, filePath);
  const dir = path.dirname(fullPath);

  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }

  if (!fs.existsSync(fullPath)) {
    fs.writeFileSync(fullPath, JSON.stringify(content, null, 2), "utf8");
    filesCreated++;
    console.log(`✨ CREATED: ${filePath}`);
  } else {
    // If file exists, merge
    try {
      const existing = JSON.parse(fs.readFileSync(fullPath, "utf8"));
      const merged = deepMerge(existing, content);
      fs.writeFileSync(fullPath, JSON.stringify(merged, null, 2), "utf8");
      filesUpdated++;
      console.log(`📝 UPDATED: ${filePath}`);
    } catch (e) {
      console.log(`⚠️  ERROR: ${e.message}`);
    }
  }
});

function deepMerge(target, source) {
  const result = { ...target };

  for (const [key, value] of Object.entries(source)) {
    if (value !== null && typeof value === "object" && !Array.isArray(value)) {
      result[key] = deepMerge(result[key] || {}, value);
    } else {
      result[key] = value;
    }
  }

  return result;
}

console.log(`\n═══════════════════════════════════════════════════════`);
console.log(`\n✅ MERGE COMPLETE!\n`);
console.log(`   Files created: ${filesCreated}`);
console.log(`   Files updated: ${filesUpdated}`);
console.log(`\n📂 Check src/i18n/locales/ for updated files!`);
console.log(`\nNext: Run audit again to verify all keys are now found!\n`);
