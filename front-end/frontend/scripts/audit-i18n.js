#!/usr/bin/env node
/* global console, process */

/**
 * i18n Audit Script for Frontend
 * Cross-platform compatible (Windows, macOS, Linux)
 * Scans ESLint output + i18n keys (missing/unused)
 */

import { execSync } from "child_process";
import fs from "fs";
import { globSync } from "glob";

const colors = {
  reset: "\x1b[0m",
  red: "\x1b[31m",
  green: "\x1b[32m",
  yellow: "\x1b[33m",
  blue: "\x1b[34m",
};

const colorize = (text, color) => `${colors[color]}${text}${colors.reset}`;

console.log(colorize("🔍 Scanning frontend for i18n violations...", "blue"));
console.log("");

let lintOutput = "";
try {
  lintOutput = execSync("npm run lint 2>&1", {
    encoding: "utf-8",
    shell: true,
    stdio: ["pipe", "pipe", "pipe"],
  });
} catch (error) {
  // Intentionally catch lint errors - we're just parsing the output
  lintOutput = error.stdout ? error.stdout.toString() : "";
}

// Parse ESLint counts
const patterns = {
  hardcodedStrings: /no-hardcoded-strings/g,
  htmlAttributes: /no-hardcoded-html-attributes/g,
  apiUrls: /no-api-urls/g,
  toastMessages: /no-hardcoded-toast-messages/g,
};

const counts = {
  hardcodedStrings: (lintOutput.match(patterns.hardcodedStrings) || []).length,
  htmlAttributes: (lintOutput.match(patterns.htmlAttributes) || []).length,
  apiUrls: (lintOutput.match(patterns.apiUrls) || []).length,
  toastMessages: (lintOutput.match(patterns.toastMessages) || []).length,
};

// ===== i18n KEYS AUDIT =====
console.log(colorize("🔍 Scanning i18n keys...", "blue"));

const localesDir = "src/i18n/locales";
const locales = ["en", "vi"];
const srcDir = "src";

function getAllKeys() {
  const allKeys = new Set();
  locales.forEach((lng) => {
    const files = globSync(`${localesDir}/${lng}/*.json`);
    files.forEach((file) => {
      try {
        const content = JSON.parse(fs.readFileSync(file, "utf8"));
        // Extract filename without extension - handle both Windows and Unix paths
        const fileName = file.split(/[/\\]/).pop().replace(".json", "");

        function extractKeys(obj, prefix = "") {
          for (const [key, value] of Object.entries(obj)) {
            const fullKey = prefix ? `${prefix}.${key}` : key;
            if (typeof value === "string" || typeof value === "number") {
              // common.json is spread at root level (no prefix)
              // other files are nested under their filename (add prefix)
              if (fileName === "common") {
                allKeys.add(fullKey);
              } else {
                allKeys.add(`${fileName}.${fullKey}`);
              }
            } else if (typeof value === "object" && value !== null) {
              extractKeys(value, fullKey);
            }
          }
        }
        extractKeys(content);
      } catch {
        // Skip invalid JSON files
      }
    });
  });
  return allKeys;
}

function scanCode() {
  const usedKeys = new Set();
  const files = globSync(`${srcDir}/**/*.{js,jsx,ts,tsx}`);
  files.forEach((file) => {
    try {
      const content = fs.readFileSync(file, "utf8");
      // Match t('key'), t("key"), t(`key`) - properly escaped backticks
      // Regex patterns: t('...'), t("..."), t(`...`)
      const patterns = [
        /t\s*\(\s*'([^']+)'\s*\)/g, // Single quotes
        /t\s*\(\s*"([^"]+)"\s*\)/g, // Double quotes
        /t\s*\(\s*`([^`]+)`\s*\)/g, // Backticks (template literals)
      ];

      patterns.forEach((pattern) => {
        const matches = [...content.matchAll(pattern)];
        matches.forEach(([, key]) => {
          // IMPORTANT: Skip dynamic keys (containing ${...})
          // Skip empty or invalid keys (just dots, etc.)
          // because they're generated at runtime, not static
          if (
            key &&
            key.trim() &&
            !key.includes("$") &&
            key.trim() !== "." &&
            !key.trim().startsWith(".") &&
            !key.trim().endsWith(".")
          ) {
            usedKeys.add(key.trim());
          }
        });
      });
    } catch {
      // Skip files that can't be read
    }
  });
  return usedKeys;
}

const allKeys = getAllKeys();
const usedKeys = scanCode();
const missingKeys = [...usedKeys].filter((key) => !allKeys.has(key));
const unusedKeys = [...allKeys].filter((key) => !usedKeys.has(key));

// Display report
console.log(
  colorize("═══════════════════════════════════════════════════", "blue")
);
console.log(colorize("i18n Enforcement Audit Report", "blue"));
console.log(
  colorize("═══════════════════════════════════════════════════", "blue")
);
console.log("");

console.log(colorize("📊 ESLint Violations:", "yellow"));
console.log("");

if (counts.hardcodedStrings > 0) {
  console.log(
    colorize(`❌ Hardcoded Strings: ${counts.hardcodedStrings}`, "red")
  );
} else {
  console.log(colorize("✅ Hardcoded Strings: 0", "green"));
}

if (counts.htmlAttributes > 0) {
  console.log(colorize(`❌ HTML Attributes: ${counts.htmlAttributes}`, "red"));
} else {
  console.log(colorize("✅ HTML Attributes: 0", "green"));
}

if (counts.apiUrls > 0) {
  console.log(colorize(`❌ API URLs: ${counts.apiUrls}`, "red"));
} else {
  console.log(colorize("✅ API URLs: 0", "green"));
}

if (counts.toastMessages > 0) {
  console.log(colorize(`❌ Toast Messages: ${counts.toastMessages}`, "red"));
} else {
  console.log(colorize("✅ Toast Messages: 0", "green"));
}

console.log("");
console.log(colorize("🔑 i18n Keys Audit:", "yellow"));
console.log("");

if (missingKeys.length > 0) {
  console.log(colorize(`❌ Missing i18n keys: ${missingKeys.length}`, "red"));
  missingKeys.slice(0, 5).forEach((key) => console.log(`   - ${key}`));
  if (missingKeys.length > 5)
    console.log(`   ... and ${missingKeys.length - 5} more`);
} else {
  console.log(colorize("✅ No missing i18n keys", "green"));
}

if (unusedKeys.length > 0) {
  console.log(colorize(`⚠️  Unused keys: ${unusedKeys.length}`, "yellow"));
} else {
  console.log(colorize("✅ No unused keys", "green"));
}

console.log("");
const total =
  counts.hardcodedStrings +
  counts.htmlAttributes +
  counts.apiUrls +
  counts.toastMessages +
  missingKeys.length;
console.log(colorize(`Total Violations: ${total}`, "blue"));
console.log("");

// Recommendations
console.log(
  colorize("═══════════════════════════════════════════════════", "blue")
);
console.log(colorize("💡 Recommended Actions:", "yellow"));
console.log("");

if (total === 0) {
  console.log(
    colorize(
      "🎉 Congratulations! Your frontend is fully i18n compliant!",
      "green"
    )
  );
} else {
  console.log("1. Run auto-fix for basic issues:");
  console.log(colorize("   npm run lint:fix", "blue"));
  console.log("");
  console.log("2. Add missing i18n keys to JSON files:");
  console.log(colorize("   public/locales/{en,vi}/*.json", "blue"));
  console.log("");
  console.log("3. Format code:");
  console.log(colorize("   npm run format", "blue"));
  console.log("");
  console.log("4. Fix remaining issues manually:");
  console.log(colorize("   npm run lint", "blue"));
  console.log("");
  console.log("5. Read guides for detailed fixes:");
  console.log("   - docs/HTML_TOAST_I18N_GUIDE.md");
  console.log("   - docs/EXAMPLES_BEST_PRACTICES.md");
  console.log("   - docs/APPLY_I18N_ENFORCEMENT.md");
}

console.log("");
console.log(
  colorize("═══════════════════════════════════════════════════", "blue")
);

process.exit(total > 0 ? 1 : 0);
