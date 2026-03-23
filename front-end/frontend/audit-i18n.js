#!/usr/bin/env node
/* global console, process */

/**
 * i18n Audit Script for Frontend
 * Cross-platform compatible (Windows, macOS, Linux)
 * Scans ESLint output for i18n violation rules
 */

import { execSync } from "child_process";

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

// Parse counts
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

// Display report
console.log(
  colorize("═══════════════════════════════════════════════════", "blue")
);
console.log(colorize("i18n Enforcement Audit Report", "blue"));
console.log(
  colorize("═══════════════════════════════════════════════════", "blue")
);
console.log("");

console.log(colorize("📊 Violation Summary:", "yellow"));
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
const total =
  counts.hardcodedStrings +
  counts.htmlAttributes +
  counts.apiUrls +
  counts.toastMessages;
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
  console.log("2. Format code:");
  console.log(colorize("   npm run format", "blue"));
  console.log("");
  console.log("3. Fix remaining issues manually:");
  console.log(colorize("   npm run lint", "blue"));
  console.log("");
  console.log("4. Read guides for detailed fixes:");
  console.log("   - docs/HTML_TOAST_I18N_GUIDE.md");
  console.log("   - docs/EXAMPLES_BEST_PRACTICES.md");
  console.log("   - docs/APPLY_I18N_ENFORCEMENT.md");
}

console.log("");
console.log(
  colorize("═══════════════════════════════════════════════════", "blue")
);

process.exit(total > 0 ? 1 : 0);
