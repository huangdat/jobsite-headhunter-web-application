#!/usr/bin/env node
/* global console */
import fs from "fs";

const file =
  "src/features/collaborator/commission/components/CommissionStats.tsx";
const content = fs.readFileSync(file, "utf8");

const hookNamespaces = {
  useBusinessTranslation: "business",
  useCommissionTranslation: "commission",
  useUsersTranslation: "users",
  useCandidateTranslation: "candidate",
  useJobsTranslation: "jobs",
  useAppTranslation: null,
};

console.log("Checking file:", file);
console.log("---");

const detectedHooks = new Map();
for (const [hook, namespace] of Object.entries(hookNamespaces)) {
  if (content.includes(hook)) {
    console.log(`✅ Detected: ${hook} (namespace: ${namespace})`);
    detectedHooks.set(hook, namespace);
  } else {
    console.log(`❌ Not found: ${hook}`);
  }
}

console.log("---");
console.log("Total detected hooks:", detectedHooks.size);
console.log("Detected hooks:", Array.from(detectedHooks.entries()));

// Check if namespace logic would apply
const trimmedKey = "stats.processingDays";
console.log("\nTest key:", trimmedKey);

let finalKey = trimmedKey;

// If file uses a single feature hook, apply its namespace prefix
// UNLESS key already has the correct namespace prefix
if (detectedHooks.size === 1) {
  const [, namespace] = [...detectedHooks.entries()][0];
  if (namespace) {
    console.log("Single hook detected. Namespace:", namespace);
    // Apply namespace prefix if key doesn't already start with it
    if (!trimmedKey.startsWith(`${namespace}.`)) {
      console.log(`Key doesn't start with '${namespace}.'`);
      finalKey = `${namespace}.${trimmedKey}`;
      console.log("✅ YES - Namespace applied");
    } else {
      console.log(`Key already starts with '${namespace}.'`);
      console.log("❌ NO - Namespace NOT applied (already prefixed)");
    }
  }
} else {
  console.log(
    "❌ NO - Would NOT apply namespace (multiple hooks or none detected)"
  );
}

console.log("\nFinal key:", finalKey);
