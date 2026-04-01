#!/usr/bin/env node

import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const localesPath = path.resolve(__dirname, "../src/i18n/locales");

function copyAuthKeysToPages(locale) {
  const authPath = path.join(localesPath, locale, "auth.json");
  const pagesPath = path.join(localesPath, locale, "pages.json");

  console.log(`\nProcessing ${locale} locale...`);

  // Read files
  const authData = JSON.parse(fs.readFileSync(authPath, "utf-8"));
  const pagesData = JSON.parse(fs.readFileSync(pagesPath, "utf-8"));

  // Backup pages.json
  const backupPath = `${pagesPath}.copy-backup`;
  fs.writeFileSync(
    backupPath,
    JSON.stringify(pagesData, null, 2) + "\n",
    "utf-8"
  );
  console.log(`  💾 Backup created: ${path.basename(backupPath)}`);

  // Copy keys
  let copied = 0;

  if (authData.forgotPassword) {
    pagesData.forgotPassword = authData.forgotPassword;
    console.log(
      `  ✅ Copied forgotPassword (${Object.keys(authData.forgotPassword).length} keys)`
    );
    copied++;
  }

  if (authData.resetPassword) {
    pagesData.resetPassword = authData.resetPassword;
    console.log(
      `  ✅ Copied resetPassword (${Object.keys(authData.resetPassword).length} keys)`
    );
    copied++;
  }

  // Write back
  fs.writeFileSync(
    pagesPath,
    JSON.stringify(pagesData, null, 2) + "\n",
    "utf-8"
  );
  console.log(`  ✨ Updated ${locale}/pages.json with ${copied} new sections`);
}

console.log("📋 COPYING AUTH KEYS TO PAGES.JSON\n");

["en", "vi"].forEach((locale) => {
  try {
    copyAuthKeysToPages(locale);
  } catch (error) {
    console.error(`❌ Error processing ${locale}:`, error.message);
  }
});

console.log("\n✅ Copy complete!\n");
