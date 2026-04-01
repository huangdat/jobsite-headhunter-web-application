#!/usr/bin/env node
/**
 * Migration Script Phase 2: Analyze TSX Translation Calls
 *
 * Scans TSX files for translation calls with duplicate namespace prefix
 * Example: t("business.breadcrumb.business") when using useBusinessTranslation()
 * Should be: t("breadcrumb.business")
 *
 * This script only REPORTS issues - manual fixes required
 */

import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const SRC_DIR = path.join(__dirname, "../src");

// Hook to namespace mapping
const HOOK_TO_NAMESPACE = {
  useAuthTranslation: "auth",
  useBusinessTranslation: "business",
  useCommonTranslation: "common",
  useHomeTranslation: "home",
  useMessagesTranslation: "messages",
  useCandidateTranslation: "candidate",
  useHeadhunterTranslation: "headhunter",
  useCollaboratorTranslation: "collaborator",
  useJobsTranslation: "jobs",
  useCommissionTranslation: "commission",
  useReferralsTranslation: "referrals",
  useAdminTranslation: "admin",
  usePagesTranslation: "pages",
  useNavigationTranslation: "navigation",
  useFooterTranslation: "footer",
  useUiTranslation: "ui",
  useUsersTranslation: "users",
  useErrorsTranslation: "errors",
  useNotificationsTranslation: "notifications",
  useDashboardTranslation: "dashboard",
  useSettingsTranslation: "settings",
  useProfileTranslation: "profile",
};

const issues = [];
let totalFiles = 0;
let filesWithIssues = 0;

/**
 * Recursively find all TSX/TS files
 */
function findTsxFiles(dir, fileList = []) {
  const files = fs.readdirSync(dir);

  for (const file of files) {
    const filePath = path.join(dir, file);
    const stat = fs.statSync(filePath);

    if (stat.isDirectory()) {
      // Skip node_modules, dist, build
      if (!["node_modules", "dist", "build", ".next"].includes(file)) {
        findTsxFiles(filePath, fileList);
      }
    } else if (file.endsWith(".tsx") || file.endsWith(".ts")) {
      // Skip useFeatureTranslation.ts (documentation/examples)
      if (!file.includes("useFeatureTranslation")) {
        fileList.push(filePath);
      }
    }
  }

  return fileList;
}

/**
 * Analyze a single TSX file for duplicate prefix issues
 */
function analyzeTsxFile(filePath) {
  const content = fs.readFileSync(filePath, "utf-8");
  const relativePath = path.relative(SRC_DIR, filePath);

  // Find which translation hooks are used
  const usedHooks = [];
  for (const hook of Object.keys(HOOK_TO_NAMESPACE)) {
    const hookRegex = new RegExp(`\\b${hook}\\b`);
    if (hookRegex.test(content)) {
      usedHooks.push(hook);
    }
  }

  if (usedHooks.length === 0) return; // No translation hooks used

  // Find all t() calls
  const tCallRegex = /\bt\s*\(\s*["']([^"']+)["']/g;
  let match;
  const tCalls = [];

  while ((match = tCallRegex.exec(content)) !== null) {
    const key = match[1];
    const lineNumber = content.substring(0, match.index).split("\n").length;
    tCalls.push({ key, line: lineNumber, match: match[0] });
  }

  if (tCalls.length === 0) return; // No t() calls found

  // Check for duplicate prefix
  const fileIssues = [];

  for (const hook of usedHooks) {
    const namespace = HOOK_TO_NAMESPACE[hook];

    // Find t() calls starting with namespace prefix
    const duplicateCalls = tCalls.filter((call) =>
      call.key.startsWith(`${namespace}.`)
    );

    if (duplicateCalls.length > 0) {
      fileIssues.push({
        hook,
        namespace,
        calls: duplicateCalls,
      });
    }
  }

  if (fileIssues.length > 0) {
    filesWithIssues++;
    issues.push({
      file: relativePath,
      issues: fileIssues,
    });
  }
}

/**
 * Generate report
 */
function generateReport() {
  console.log("\n" + "=".repeat(70));
  console.log("📊 TSX TRANSLATION CALL ANALYSIS - DUPLICATE PREFIX REPORT");
  console.log("=".repeat(70));

  console.log(`\nTotal files scanned: ${totalFiles}`);
  console.log(`Files with issues: ${filesWithIssues}`);
  console.log(
    `Total issues found: ${issues.reduce((sum, f) => sum + f.issues.reduce((s, i) => s + i.calls.length, 0), 0)}\n`
  );

  if (issues.length === 0) {
    console.log("✅ No duplicate prefix issues found!\n");
    return;
  }

  // Group by severity
  const critical = issues.filter((i) =>
    i.issues.some((issue) => issue.calls.length >= 10)
  );
  const moderate = issues.filter((i) =>
    i.issues.some((issue) => issue.calls.length >= 5 && issue.calls.length < 10)
  );
  const minor = issues.filter(
    (i) => !critical.includes(i) && !moderate.includes(i)
  );

  console.log("🔴 CRITICAL (10+ duplicate calls):");
  printFileIssues(critical);

  console.log("\n🟡 MODERATE (5-9 duplicate calls):");
  printFileIssues(moderate);

  console.log("\n🟢 MINOR (1-4 duplicate calls):");
  printFileIssues(minor);

  // Write detailed report to file
  const reportPath = path.join(__dirname, "../tsx-translation-issues.txt");
  const reportContent = generateDetailedReport();
  fs.writeFileSync(reportPath, reportContent, "utf-8");
  console.log(`\n📄 Detailed report written to: tsx-translation-issues.txt`);

  // Generate suggested fixes
  console.log("\n" + "=".repeat(70));
  console.log("💡 SUGGESTED FIXES");
  console.log("=".repeat(70));
  console.log("\nFor files with duplicate prefix, update translation calls:");
  console.log("\nExample fix pattern:");
  console.log("❌ BAD:  const { t } = useBusinessTranslation();");
  console.log('         t("business.breadcrumb.business")');
  console.log("✅ GOOD: const { t } = useBusinessTranslation();");
  console.log('         t("breadcrumb.business")');
  console.log('\nThe hook already adds the "business." prefix!\n');
}

function printFileIssues(fileList) {
  if (fileList.length === 0) {
    console.log("  None");
    return;
  }

  fileList.forEach(({ file, issues: fileIssues }) => {
    const totalCalls = fileIssues.reduce((sum, i) => sum + i.calls.length, 0);
    console.log(`\n  📄 ${file} (${totalCalls} calls)`);

    fileIssues.forEach(({ hook, namespace, calls }) => {
      console.log(`     Using: ${hook} → adds "${namespace}." prefix`);
      console.log(`     ${calls.length} duplicate calls:`);

      // Show first 3 examples
      calls.slice(0, 3).forEach(({ key, line }) => {
        const suggested = key.replace(new RegExp(`^${namespace}\\.`), "");
        console.log(`       Line ${line}: t("${key}") → t("${suggested}")`);
      });

      if (calls.length > 3) {
        console.log(`       ... and ${calls.length - 3} more`);
      }
    });
  });
}

function generateDetailedReport() {
  let report = "TSX TRANSLATION DUPLICATE PREFIX - DETAILED REPORT\n";
  report += "=".repeat(70) + "\n\n";

  for (const { file, issues: fileIssues } of issues) {
    report += `FILE: ${file}\n`;
    report += "-".repeat(70) + "\n";

    for (const { hook, namespace, calls } of fileIssues) {
      report += `\nHook: ${hook} (adds "${namespace}." prefix)\n`;
      report += `Issues: ${calls.length} duplicate prefix calls\n\n`;

      calls.forEach(({ key, line, match }) => {
        const suggested = key.replace(new RegExp(`^${namespace}\\.`), "");
        report += `  Line ${line}:\n`;
        report += `    Current:   ${match}\n`;
        report += `    Suggested: t("${suggested}")\n`;
        report += `    Reason:    Hook adds prefix → "${namespace}.${suggested}"\n\n`;
      });
    }

    report += "\n" + "=".repeat(70) + "\n\n";
  }

  return report;
}

/**
 * Main execution
 */
function main() {
  console.log("🔍 Analyzing TSX files for duplicate translation prefix...\n");

  const tsxFiles = findTsxFiles(SRC_DIR);
  totalFiles = tsxFiles.length;

  console.log(`Found ${totalFiles} TypeScript files to analyze\n`);

  for (const file of tsxFiles) {
    analyzeTsxFile(file);
  }

  generateReport();

  console.log("\n✅ Phase 2 complete!");
  console.log(
    "⚠️  Review tsx-translation-issues.txt and fix reported files manually\n"
  );
}

main();
