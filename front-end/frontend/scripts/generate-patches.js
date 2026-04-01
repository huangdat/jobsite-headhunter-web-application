#!/usr/bin/env node
/* global console */

/*##REMOVE##
/* global console */
/**
 * Auto-Generate JSON Patches - Option 1
 * Creates missing locale files + adds missing keys
 */

import fs from "fs";
import { globSync } from "glob";

const localesDir = "src/i18n/locales";
const locales = ["en", "vi"];
const srcDir = "src";

const falsPositiveKeys = new Set([
  "-",
  "2d",
  "ALL",
  "CUSTOM",
  "NEGOTIABLE",
  "a",
  "code",
]);

const isSuspiciousKey = (key) => key.length === 1 || falsPositiveKeys.has(key);

// Get all keys from locale files
function getAllLocaleKeys() {
  const keys = new Set();
  locales.forEach((lng) => {
    const files = globSync(`${localesDir}/${lng}/*.json`);
    files.forEach((file) => {
      try {
        const content = JSON.parse(fs.readFileSync(file, "utf8"));
        const fileName = file.split(/[/\\]/).pop().replace(".json", "");

        function extractKeys(obj, prefix = "") {
          for (const [key, value] of Object.entries(obj)) {
            const fullKey = prefix ? `${prefix}.${key}` : key;
            if (typeof value === "string" || typeof value === "number") {
              const finalKey =
                fileName === "common" ? fullKey : `${fileName}.${fullKey}`;
              keys.add(finalKey);
            } else if (typeof value === "object" && value !== null) {
              extractKeys(value, fullKey);
            }
          }
        }
        extractKeys(content);
      } catch {
        // skip
      }
    });
  });
  return keys;
}

// Get code usage - organized by locale file target
function getCodeKeysOrganized() {
  const keysByFile = {}; // { "users.json": { "list.pageTitle": [...files] }, ... }
  const excludePatterns = [/ParticleBackground\.tsx/, /useJobFilters\.ts/];
  const files = globSync(`${srcDir}/**/*.{js,jsx,ts,tsx}`);

  files.forEach((file) => {
    if (excludePatterns.some((p) => p.test(file))) return;

    try {
      const content = fs.readFileSync(file, "utf8");
      const patterns = [
        /t\s*\(\s*'([^']+)'\s*\)/g,
        /t\s*\(\s*"([^"]+)"\s*\)/g,
        /t\s*\(\s*`([^`]+)`\s*\)/g,
      ];

      patterns.forEach((pattern) => {
        const matches = [...content.matchAll(pattern)];
        matches.forEach(([, key]) => {
          const trimmedKey = key.trim();

          if (
            trimmedKey &&
            !isSuspiciousKey(trimmedKey) &&
            !trimmedKey.includes("$") &&
            trimmedKey !== "."
          ) {
            // Determine which locale file this belongs to
            const parts = trimmedKey.split(".");
            let localeFile = "common.json";

            if (parts.length > 0) {
              const prefix = parts[0];
              // Map feature prefix to locale file
              const featureToFile = {
                users: "users.json",
                jobs: "jobs.json",
                auth: "auth.json",
                home: "home.json",
                candidate: "candidate.json",
                business: "business.json",
                commission: "commission.json",
                navigation: "navigation.json",
                adminFeatures: "adminFeatures.json",
              };

              if (featureToFile[prefix]) {
                localeFile = featureToFile[prefix];
              } else {
                // New feature - map to appropriate file
                // For now, use a dedicated file per prefix
                localeFile = `${prefix}.json`;
              }
            }

            if (!keysByFile[localeFile]) {
              keysByFile[localeFile] = new Set();
            }
            keysByFile[localeFile].add(trimmedKey);
          }
        });
      });
    } catch {
      // skip
    }
  });

  return keysByFile;
}

const allLocaleKeys = getAllLocaleKeys();
const codeKeysOrganized = getCodeKeysOrganized();

// Get existing locale structures
function getExistingStructure(lng, featureFile) {
  const filePath = `${localesDir}/${lng}/${featureFile}`;
  if (fs.existsSync(filePath)) {
    try {
      return JSON.parse(fs.readFileSync(filePath, "utf8"));
    } catch {
      return {};
    }
  }
  return {};
}

console.log(`\n╔════════════════════════════════════════════════════════╗`);
console.log(`║     AUTO-GENERATE: JSON Patches for Missing Keys       ║`);
console.log(`╚════════════════════════════════════════════════════════╝\n`);

const patches = {};
const newFiles = {};

Object.entries(codeKeysOrganized).forEach(([localeFile, codeKeys]) => {
  const missingKeys = [...codeKeys].filter((k) => !allLocaleKeys.has(k));

  if (missingKeys.length === 0) return;

  console.log(`\n📄 ${localeFile}`);
  console.log(`   Code keys: ${codeKeys.size}, Missing: ${missingKeys.length}`);

  // Build nested structure for each locale
  locales.forEach((lng) => {
    const patchKey = `${lng}/${localeFile}`;

    if (!patches[patchKey]) {
      patches[patchKey] = getExistingStructure(lng, localeFile);
    }

    const structure = patches[patchKey];

    // Add missing keys to structure
    missingKeys.forEach((fullKey) => {
      const parts = fullKey.split(".");

      // Remove feature prefix if it matches the file name
      // Example: if file is "actions.json" and key is "actions.deleteUser"
      // We only need "deleteUser" in the JSON
      let keyParts = parts;
      if (parts[0] === localeFile.replace(".json", "")) {
        keyParts = parts.slice(1); // Remove the feature prefix
      }

      if (keyParts.length === 0) return; // Skip if no key left

      let current = structure;

      // Navigate/create nested structure (only for remaining parts)
      for (let i = 0; i < keyParts.length - 1; i++) {
        if (!current[keyParts[i]]) {
          current[keyParts[i]] = {};
        }
        current = current[keyParts[i]];
      }

      const lastKey = keyParts[keyParts.length - 1];
      if (!current[lastKey]) {
        // Generate English placeholder text from key
        const placeholder = parts
          .join(" ")
          .replace(/([A-Z])/g, " $1")
          .toLowerCase()
          .trim();

        current[lastKey] =
          lng === "en"
            ? placeholder.charAt(0).toUpperCase() + placeholder.slice(1)
            : `[${lng.toUpperCase()}] ${placeholder}`;
      }
    });

    // Check if file exists
    const filePath = `${localesDir}/${lng}/${localeFile}`;
    if (!fs.existsSync(filePath)) {
      newFiles[filePath] = structure;
      console.log(`   ✨ NEW FILE: ${filePath}`);
    } else {
      console.log(`   📝 UPDATE: ${filePath}`);
    }
  });
});

// Generate summary
console.log(`\n\n═══════════════════════════════════════════════════════`);
console.log(`\n📊 PATCH SUMMARY:\n`);
console.log(`New locale files to create: ${Object.keys(newFiles).length}`);
console.log(
  `Locale files to update: ${Object.keys(patches).length - Object.keys(newFiles).length}`
);

console.log(`\nNew files:\n`);
Object.keys(newFiles).forEach((file) => {
  const keys = Object.keys(newFiles[file]).length;
  console.log(`  ${file} (${keys} keys)`);
});

// Save patches as JSON for review
const patchesPath = "patches-for-review.json";
fs.writeFileSync(patchesPath, JSON.stringify(patches, null, 2), "utf8");

const newFilesPath = "new-files-for-review.json";
fs.writeFileSync(newFilesPath, JSON.stringify(newFiles, null, 2), "utf8");

console.log(`\n✅ Patches generated!`);
console.log(`   - patches-for-review.json (updates to existing files)`);
console.log(`   - new-files-for-review.json (new locale files)`);
console.log(`\nNext: Review them, then merge into locale files!\n`);
