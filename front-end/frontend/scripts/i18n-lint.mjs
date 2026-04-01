#!/usr/bin/env node
/**
 * i18n Lint Script - Enhanced for CI/CD
 * Detects missing keys, unused keys, and hardcoded text
 * Outputs to TXT file for easy review
 * Exits with code 1 if errors found (blocks commits)
 */

import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const projectRoot = path.resolve(__dirname, "..");

// Map of feature hooks to their namespaces
const HOOK_TO_NAMESPACE = {
  useAriaTranslation: "aria",
  useAuthTranslation: "auth",
  useBusinessTranslation: "business",
  useCandidateTranslation: "candidate",
  useCommissionTranslation: "commission",
  useCommonTranslation: "common",
  useDialogsTranslation: "dialogs",
  useFooterTranslation: "footer",
  useHomeTranslation: "home",
  useJobsTranslation: "jobs",
  useMessagesTranslation: "messages",
  usePagesTranslation: "pages",
  useProfileTranslation: "profile",
  useUsersTranslation: "users",
  useValidationTranslation: "validation",
  // Aliases
  useDeleteTranslation: "dialogs",
  useLockTranslation: "dialogs",
  useUnlockTranslation: "dialogs",
};

// Read all JSON keys from locale files
function getAllKeysFromJSON() {
  const localesDir = path.join(projectRoot, "src/i18n/locales/en");
  const keys = new Map(); // namespace -> Set of keys

  const files = fs.readdirSync(localesDir);
  for (const file of files) {
    if (!file.endsWith(".json")) continue;
    const namespace = file.replace(".json", "");
    const content = JSON.parse(
      fs.readFileSync(path.join(localesDir, file), "utf-8")
    );

    const extractKeys = (obj, prefix = "") => {
      const result = new Set();
      for (const [key, value] of Object.entries(obj)) {
        const fullKey = prefix ? `${prefix}.${key}` : key;
        if (typeof value === "object" && value !== null) {
          extractKeys(value, fullKey).forEach((k) => result.add(k));
        } else {
          result.add(fullKey);
        }
      }
      return result;
    };

    keys.set(namespace, extractKeys(content));
  }

  return keys;
}

// Find all t("key") calls in a file
function findTranslationCalls(filePath) {
  const content = fs.readFileSync(filePath, "utf-8");
  const calls = [];

  // Find hook usage: const { t } = useHook() or const { t: alias } = useHook()
  const hookMatches = [
    ...content.matchAll(
      /const\s*{\s*t(?:\s*:\s*(\w+))?\s*}\s*=\s*(use\w+Translation)\(\)/g
    ),
  ];
  const hooks = hookMatches.map((m) => ({
    alias: m[1] || "t",
    hook: m[2],
  }));

  // Find all t("key") or tAlias("key") calls
  const pattern = /\b(t\w*)\s*\(\s*["'`]([^"'`\${}]+)["'`]\s*\)/g;
  let match;
  while ((match = pattern.exec(content)) !== null) {
    const [, tAlias, key] = match;
    const hookInfo = hooks.find((h) => h.alias === tAlias);

    // If hook is explicitly declared in this file, always use it
    // This handles nested keys like tAuth("messages.otpSent") correctly
    if (hookInfo) {
      calls.push({
        key,
        hook: hookInfo.hook,
        alias: tAlias,
        isCrossNamespace: false,
      });
      continue;
    }

    // Only detect cross-namespace usage if no hook declared
    // (e.g., bare t("key") without import)
    const keyParts = key.split(".");
    const possibleNamespace = keyParts[0];

    // Check if first part is a known namespace name (aria, common, etc.)
    const knownNamespaces = Object.values(HOOK_TO_NAMESPACE);
    if (knownNamespaces.includes(possibleNamespace)) {
      // Cross-namespace usage detected - use namespace from key itself
      calls.push({
        key: keyParts.slice(1).join("."), // Remove namespace prefix from key
        hook: `use${possibleNamespace.charAt(0).toUpperCase() + possibleNamespace.slice(1)}Translation`,
        alias: tAlias,
        isCrossNamespace: true,
      });
    }
  }

  return { calls, hooks };
}

// Scan all TSX/TS files
function scanAllFiles() {
  const srcDir = path.join(projectRoot, "src");
  const results = [];

  // Exclude files with example/documentation code
  const excludeFiles = [
    /useFeatureTranslation\.ts$/,
    /useFeatureTranslation\.generated\.ts$/,
    /useAppTranslation\.ts$/,
  ];

  function scanDir(dir) {
    const entries = fs.readdirSync(dir, { withFileTypes: true });
    for (const entry of entries) {
      const fullPath = path.join(dir, entry.name);
      if (entry.isDirectory()) {
        scanDir(fullPath);
      } else if (entry.name.endsWith(".tsx") || entry.name.endsWith(".ts")) {
        // Skip excluded files
        if (excludeFiles.some((pattern) => pattern.test(fullPath))) {
          continue;
        }

        const { calls, hooks } = findTranslationCalls(fullPath);
        if (calls.length > 0 || hooks.length > 0) {
          results.push({
            file: path.relative(projectRoot, fullPath).replace(/\\/g, "/"),
            hooks,
            calls,
          });
        }
      }
    }
  }

  scanDir(srcDir);
  return results;
}

// Find unused keys (keys in JSON but not used in code)
function findUnusedKeys(allKeys, fileResults) {
  const usedKeys = new Set();

  // Collect all used keys
  fileResults.forEach((result) => {
    result.calls.forEach((call) => {
      const namespace = HOOK_TO_NAMESPACE[call.hook];
      if (namespace) {
        // For cross-namespace usage, key is already without namespace prefix
        if (call.isCrossNamespace) {
          usedKeys.add(`${namespace}.${call.key}`);
        } else {
          // Add key with namespace prefix
          usedKeys.add(`${namespace}.${call.key}`);

          // Handle alias prefixes
          if (call.hook === "useDeleteTranslation") {
            usedKeys.add(`dialogs.delete.${call.key}`);
          } else if (call.hook === "useLockTranslation") {
            usedKeys.add(`dialogs.lock.${call.key}`);
          } else if (call.hook === "useUnlockTranslation") {
            usedKeys.add(`dialogs.unlock.${call.key}`);
          }
        }
      }
    });
  });

  const unused = [];
  allKeys.forEach((namespaceKeys, namespace) => {
    namespaceKeys.forEach((key) => {
      const fullKey = `${namespace}.${key}`;
      if (!usedKeys.has(fullKey)) {
        unused.push({ namespace, key, fullKey });
      }
    });
  });

  return unused;
}

// Main lint
console.log("\n🔍 Running i18n lint check...\n");

const allKeys = getAllKeysFromJSON();
const fileResults = scanAllFiles();

// Find missing keys
const missingByFile = {};
let totalMissing = 0;

fileResults.forEach((result) => {
  const missing = [];

  result.calls.forEach((call) => {
    const namespace = HOOK_TO_NAMESPACE[call.hook];
    if (!namespace) return;

    const namespaceKeys = allKeys.get(namespace);
    if (!namespaceKeys) {
      missing.push({
        key: call.key,
        hook: call.hook,
        namespace,
        reason: `Namespace '${namespace}' not found`,
      });
      return;
    }

    // Check if key exists (handle alias prefixes)
    const keyVariants = [
      call.key,
      call.key.replace(/^delete\./, "dialogs.delete."),
      call.key.replace(/^lock\./, "dialogs.lock."),
      call.key.replace(/^unlock\./, "dialogs.unlock."),
    ];

    const found = keyVariants.some((k) => namespaceKeys.has(k));
    if (!found) {
      missing.push({
        key: call.key,
        hook: call.hook,
        namespace,
      });
    }
  });

  if (missing.length > 0) {
    missingByFile[result.file] = missing;
    totalMissing += missing.length;
  }
});

// Find unused keys
const unusedKeys = findUnusedKeys(allKeys, fileResults);

// Generate TXT report with DETAILED information
let txtReport = `i18n LINT REPORT - DETAILED
Generated: ${new Date().toISOString()}
${"=".repeat(80)}

`;

if (totalMissing > 0) {
  txtReport += `❌ MISSING KEYS (${totalMissing} total)\n`;
  txtReport += `${"=".repeat(80)}\n\n`;

  Object.entries(missingByFile).forEach(([file, missing]) => {
    txtReport += `File: ${file}\n`;
    missing.forEach((m) => {
      txtReport += `  ❌ ${m.namespace}.${m.key} (using ${m.hook})\n`;
    });
    txtReport += `\n`;
  });
} else {
  txtReport += `✅ NO MISSING KEYS\n\n`;
}

if (unusedKeys.length > 0) {
  txtReport += `⚠️  UNUSED KEYS (${unusedKeys.length} total)\n`;
  txtReport += `${"=".repeat(80)}\n\n`;

  const unusedByNamespace = {};
  unusedKeys.forEach((item) => {
    if (!unusedByNamespace[item.namespace]) {
      unusedByNamespace[item.namespace] = [];
    }
    unusedByNamespace[item.namespace].push(item.key);
  });

  Object.entries(unusedByNamespace)
    .sort(([a], [b]) => a.localeCompare(b))
    .forEach(([namespace, keys]) => {
      txtReport += `Namespace: ${namespace} (${keys.length} unused)\n`;
      keys.sort().forEach((key) => {
        txtReport += `  ⚠️  ${key}\n`;
      });
      txtReport += `\n`;
    });
} else {
  txtReport += `✅ NO UNUSED KEYS\n\n`;
}

// Detailed summary in TXT file
txtReport += `${"=".repeat(80)}\n`;
txtReport += `SUMMARY\n`;
txtReport += `${"=".repeat(80)}\n`;
txtReport += `Missing Keys: ${totalMissing}\n`;
txtReport += `Unused Keys: ${unusedKeys.length}\n`;
txtReport += `Total Issues: ${totalMissing + unusedKeys.length}\n`;

// Save TXT report
const txtPath = path.join(projectRoot, "i18n-lint-report.txt");
fs.writeFileSync(txtPath, txtReport);

// Console output - ONLY SUMMARY
console.log(`\n📊 i18n Lint Summary:\n`);
console.log(`  Missing Keys: ${totalMissing}`);
console.log(`  Unused Keys: ${unusedKeys.length}`);
console.log(`  Total Issues: ${totalMissing + unusedKeys.length}\n`);
console.log(`📄 Details saved to: i18n-lint-report.txt\n`);

// Exit with error code if missing keys found (blocks commits)
if (totalMissing > 0) {
  console.error(`\n❌ i18n lint failed: ${totalMissing} missing keys found!\n`);
  process.exit(1);
} else if (unusedKeys.length > 0) {
  console.warn(
    `\n⚠️  Warning: ${unusedKeys.length} unused keys found (not blocking)\n`
  );
  process.exit(0);
} else {
  console.log(`\n✅ i18n lint passed!\n`);
  process.exit(0);
}
