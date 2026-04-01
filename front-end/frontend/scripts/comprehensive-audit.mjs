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
  useCompanyTranslation: "companies",
  useDialogsTranslation: "dialogs",
  useFooterTranslation: "footer",
  useHomeTranslation: "home",
  useJobsTranslation: "jobs",
  useMessagesTranslation: "messages",
  useNavigationTranslation: "navigation",
  usePagesTranslation: "pages",
  useProfileTranslation: "profile",
  useResumeTranslation: "resume",
  useSettingsTranslation: "settings",
  useUITranslation: "ui",
  useUsersTranslation: "users",
  useValidationTranslation: "validation",
  // Aliases
  useDeleteTranslation: "dialogs", // dialogs.delete.*
  useLockTranslation: "dialogs", // dialogs.lock.*
  useUnlockTranslation: "dialogs", // dialogs.unlock.*
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
    // Find which hook this alias belongs to
    const hookInfo = hooks.find((h) => h.alias === tAlias);
    if (hookInfo) {
      calls.push({
        key,
        hook: hookInfo.hook,
        alias: tAlias,
      });
    } else if (tAlias === "t") {
      // Default 't' without hook info
      calls.push({
        key,
        hook: "unknown",
        alias: "t",
      });
    }
  }

  return { calls, hooks };
}

// Scan all TSX files
function scanAllFiles() {
  const srcDir = path.join(projectRoot, "src");
  const results = [];

  function scanDir(dir) {
    const entries = fs.readdirSync(dir, { withFileTypes: true });
    for (const entry of entries) {
      const fullPath = path.join(dir, entry.name);
      if (entry.isDirectory()) {
        scanDir(fullPath);
      } else if (entry.name.endsWith(".tsx")) {
        const { calls, hooks } = findTranslationCalls(fullPath);
        if (calls.length > 0) {
          results.push({
            file: path.relative(projectRoot, fullPath),
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

// Main audit
const allKeys = getAllKeysFromJSON();
const fileResults = scanAllFiles();

console.log("\n========== COMPREHENSIVE TRANSLATION AUDIT ==========\n");

// Group by hook usage
const filesByHook = {};
fileResults.forEach((result) => {
  result.hooks.forEach((hook) => {
    if (!filesByHook[hook.hook]) {
      filesByHook[hook.hook] = [];
    }
    filesByHook[hook.hook].push(result.file);
  });
});

console.log("FILES BY HOOK:");
Object.entries(filesByHook)
  .sort(([a], [b]) => a.localeCompare(b))
  .forEach(([hook, files]) => {
    console.log(`\n${hook} (${files.length} files):`);
    files.forEach((f) => console.log(`  - ${f}`));
  });

// Find missing keys
console.log("\n\n========== MISSING KEYS ANALYSIS ==========\n");

const missingByFile = {};
let totalMissing = 0;

fileResults.forEach((result) => {
  const missing = [];

  result.calls.forEach((call) => {
    const namespace = HOOK_TO_NAMESPACE[call.hook];
    if (!namespace) {
      if (call.hook !== "useAppTranslation") {
        missing.push({
          key: call.key,
          hook: call.hook,
          reason: "Unknown hook",
        });
      }
      return;
    }

    const namespaceKeys = allKeys.get(namespace);
    if (!namespaceKeys) {
      missing.push({
        key: call.key,
        hook: call.hook,
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

console.log(`Total missing keys: ${totalMissing}\n`);

// Group missing keys by namespace
const missingByNamespace = {};
Object.entries(missingByFile).forEach(([file, missing]) => {
  missing.forEach((m) => {
    const ns = m.namespace || "unknown";
    if (!missingByNamespace[ns]) {
      missingByNamespace[ns] = [];
    }
    missingByNamespace[ns].push({
      file,
      key: m.key,
      hook: m.hook,
    });
  });
});

console.log("MISSING KEYS BY NAMESPACE:\n");
Object.entries(missingByNamespace)
  .sort(([a], [b]) => a.localeCompare(b))
  .forEach(([namespace, items]) => {
    console.log(`${namespace} (${items.length} missing):`);
    const byFile = {};
    items.forEach((item) => {
      if (!byFile[item.file]) byFile[item.file] = [];
      byFile[item.file].push(item.key);
    });
    Object.entries(byFile).forEach(([file, keys]) => {
      console.log(`  ${file}:`);
      keys.forEach((k) => console.log(`    - ${k}`));
    });
    console.log();
  });

// Files using useAppTranslation
console.log("\n========== FILES USING useAppTranslation ==========\n");
const appTranslationFiles = filesByHook["useAppTranslation"] || [];
console.log(`Total: ${appTranslationFiles.length} files\n`);
appTranslationFiles.forEach((f) => console.log(`  - ${f}`));

// Export detailed report
const report = {
  timestamp: new Date().toISOString(),
  summary: {
    totalFiles: fileResults.length,
    totalCalls: fileResults.reduce((sum, r) => sum + r.calls.length, 0),
    totalMissing,
    useAppTranslationFiles: appTranslationFiles.length,
  },
  filesByHook,
  missingByNamespace,
  missingByFile,
  appTranslationFiles,
};

fs.writeFileSync(
  path.join(projectRoot, "translation-full-audit.json"),
  JSON.stringify(report, null, 2)
);

console.log("\n✓ Full report saved to translation-full-audit.json\n");
