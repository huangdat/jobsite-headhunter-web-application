#!/usr/bin/env node
/* global console */

/*##REMOVE##
/* global console */
import fs from "fs";

// Fix vi/auth.json BOM issue
const patches = JSON.parse(fs.readFileSync("patches-for-review.json", "utf8"));
const authPatch = patches["vi/auth.json"];

if (authPatch) {
  fs.writeFileSync(
    "src/i18n/locales/vi/auth.json",
    JSON.stringify(authPatch, null, 2),
    "utf8"
  );
  console.log("✓ Fixed vi/auth.json BOM issue");
} else {
  console.log("✗ auth.json patch not found");
}
