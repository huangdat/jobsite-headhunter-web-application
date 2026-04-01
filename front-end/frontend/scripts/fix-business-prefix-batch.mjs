#!/usr/bin/env node
/**
 * Automated fix script: Remove "business." prefix from t() calls
 * Targets files using useBusinessTranslation hook
 */

import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const FILES_TO_FIX = [
  "src/features/headhunter/business/components/ProfileStrengthCard.tsx",
  "src/features/headhunter/business/components/VerificationStatus.tsx",
  "src/features/headhunter/business/components/OptimizationTips.tsx",
  "src/features/headhunter/business/components/CompanyBestPractices.tsx",
];

const REGEX_PATTERN = /\bt\(["']business\.([\w.]+)["']\)/g;

let totalReplacements = 0;

for (const relPath of FILES_TO_FIX) {
  const filePath = path.join(__dirname, "..", relPath);

  if (!fs.existsSync(filePath)) {
    console.log(`⚠️  Skipped: ${relPath} (not found)`);
    continue;
  }

  const originalContent = fs.readFileSync(filePath, "utf-8");
  const matches = [...originalContent.matchAll(REGEX_PATTERN)];

  if (matches.length === 0) {
    console.log(`✓ ${relPath} - Already fixed (0 matches)`);
    continue;
  }

  // Replace pattern: t("business.xxx") → t("xxx")
  const newContent = originalContent.replace(REGEX_PATTERN, 't("$1")');

  // Backup
  fs.writeFileSync(filePath + ".bak", originalContent, "utf-8");

  // Write fixed content
  fs.writeFileSync(filePath, newContent, "utf-8");

  console.log(`✓ Fixed: ${relPath} (${matches.length} replacements)`);
  totalReplacements += matches.length;
}

console.log(
  `\n✅ Total: ${totalReplacements} replacements across ${FILES_TO_FIX.length} files`
);
console.log("💾 Backups saved as *.bak");
