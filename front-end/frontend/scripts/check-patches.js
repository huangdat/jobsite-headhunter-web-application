#!/usr/bin/env node
/* global console */

/*##REMOVE##
/* global console */
import fs from "fs";

const patches = JSON.parse(fs.readFileSync("patches-for-review.json", "utf8"));
const newFiles = JSON.parse(
  fs.readFileSync("new-files-for-review.json", "utf8")
);

console.log(`\n📋 PATCHES CONTENT CHECK:\n`);
console.log(`Sample: en/actions.json`);
console.log(JSON.stringify(patches["en/actions.json"], null, 2));

console.log(`\n\n📋 NEW FILES CONTENT CHECK:\n`);
console.log(`Sample: en/actions.json`);
console.log(JSON.stringify(newFiles["en/actions.json"], null, 2));

// Check if both have the same structure
const patchKeys = patches["en/actions.json"]
  ? Object.keys(patches["en/actions.json"])
  : [];
const newFileKeys = newFiles["en/actions.json"]
  ? Object.keys(newFiles["en/actions.json"])
  : [];
console.log(`\n✓ Patch keys: ${JSON.stringify(patchKeys)}`);
console.log(`✓ NewFile keys: ${JSON.stringify(newFileKeys)}`);
