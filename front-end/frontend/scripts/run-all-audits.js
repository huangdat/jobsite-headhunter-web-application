#!/usr/bin/env node
/* global console, process */
/**
 * Run audit and generate timestamped report files
 * Compatible with Windows/Mac/Linux
 */

import { execSync } from "child_process";

const timestamp = new Date().toISOString().replace(/[:.]/g, "-").slice(0, -5);

console.log(`\n📊 Running comprehensive i18n audit...\n`);

try {
  // Run i18n audit with file output
  console.log(`⏳ i18n audit (v2-smart)...`);
  const i18nCmd = `node scripts/audit-i18n-v2-smart.js > audit-i18n-report-${timestamp}.txt 2>&1`;
  execSync(i18nCmd, { shell: true, cwd: process.cwd() });
  console.log(`✅ i18n audit report: audit-i18n-report-${timestamp}.txt`);
} catch {
  console.log(`⚠️ i18n audit had issues (non-blocking)`);
}

try {
  // Run structure analysis with file output
  console.log(`⏳ Structure analysis...`);
  const structureCmd = `node scripts/analyze-structure.js > structure-analysis-${timestamp}.txt 2>&1`;
  execSync(structureCmd, { shell: true, cwd: process.cwd() });
  console.log(
    `✅ Structure analysis report: structure-analysis-${timestamp}.txt`
  );
} catch {
  console.log(`⚠️ Structure analysis had issues (non-blocking)`);
}

try {
  // Run ESLint and output to file
  console.log(`⏳ ESLint report...`);
  const eslintCmd = `npx eslint . > eslint-report-${timestamp}.txt 2>&1`;
  execSync(eslintCmd, { shell: true, cwd: process.cwd() });
  console.log(`✅ ESLint report: eslint-report-${timestamp}.txt`);
} catch {
  // ESLint failures are expected, just capture output
  console.log(`✅ ESLint report: eslint-report-${timestamp}.txt`);
}

console.log(`\n═══════════════════════════════════════════════════════`);
console.log(`\n📁 Reports generated with timestamp: ${timestamp}`);
console.log(`\nCheck these files for audit results:`);
console.log(`  - audit-i18n-report-${timestamp}.txt`);
console.log(`  - structure-analysis-${timestamp}.txt`);
console.log(`  - eslint-report-${timestamp}.txt`);
console.log(`\n═══════════════════════════════════════════════════════\n`);
