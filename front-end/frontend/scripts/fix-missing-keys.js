#!/usr/bin/env node
/**
 * Fix missing i18n keys by adding them to locale JSON files
 */

import fs from "fs";
import path from "path";

const localesDir = "src/i18n/locales";
const locales = ["en", "vi"];

// Missing keys from audit report
const missingKeys = {
  auth: {
    checkboxLabels: { openForWork: "Open for work" },
    common: { loading: "Loading..." },
    descriptions: { candidateDetails: "Candidate Details" },
    error: "Error",
    id_token: "ID Token",
    labels: {
      avatar: "Avatar",
      bio: "Bio",
      city: "City",
      companyName: "Company Name",
      currentJobTitle: "Current Job Title",
      expectedSalaryMax: "Expected Salary (Max)",
      expectedSalaryMin: "Expected Salary (Min)",
      jobSearchStatus: "Job Search Status",
      workEmail: "Work Email",
      yearsOfExperience: "Years of Experience",
    },
    messages: { failedToSendOtp: "Failed to send OTP" },
    pages: {
      changePassword: { securitySectionLabel: "Security Settings" },
    },
    validation: {
      currentPasswordKey: "Current Password",
      incorrectPasswordKey: "Incorrect Password",
    },
  },
  jobs: {
    accountSettings: "Account Settings",
    activityLog: "Activity Log",
    applicantPageInfo: "Applicants",
    candidates: "Candidates",
    jobPostings: "Job Postings",
    list: "Job List",
    loadingApplicants: "Loading applicants...",
    manageCv: "Manage CV",
    myServices: "My Services",
    noApplicantsYet: "No applicants yet",
    orderTracking: "Order Tracking",
    postNewJob: "Post New Job",
    profileTitle: "Profile",
    promotionCodes: "Promotion Codes",
    recruitmentReport: "Recruitment Report",
    supportInbox: "Support Inbox",
  },
  list: {
    applyBefore: "Apply before",
    filters: {
      allLevels: "All Levels",
      allTypes: "All Types",
      applyCustomRange: "Apply Custom Range",
      clearAllFilters: "Clear All Filters",
      fromMillion: "From (Million VND)",
      keywordPlaceholder: "Search keywords...",
      rankLevel: "Rank Level",
      salaryVND: "Salary (VND)",
      toMillion: "To (Million VND)",
      workingType: "Working Type",
    },
    viewDetails: "View Details",
  },
  navigation: {
    featuredJobs: "Featured Jobs",
    recommended: "Recommended",
    topCompanies: "Top Companies",
  },
};

function setNestedValue(obj, path, value) {
  const keys = path.split(".");
  let current = obj;

  for (let i = 0; i < keys.length - 1; i++) {
    if (!(keys[i] in current)) {
      current[keys[i]] = {};
    }
    current = current[keys[i]];
  }

  current[keys[keys.length - 1]] = value;
}

function flattenObject(obj, prefix = "") {
  const result = {};

  function flatten(current, currentPrefix) {
    for (const [key, value] of Object.entries(current)) {
      const newKey = currentPrefix ? `${currentPrefix}.${key}` : key;

      if (
        typeof value === "object" &&
        value !== null &&
        !Array.isArray(value)
      ) {
        flatten(value, newKey);
      } else {
        result[newKey] = value;
      }
    }
  }

  flatten(obj, prefix);
  return result;
}

// Get English translations for other locales
function getVietnamesePlaceholder(enValue) {
  // For now, keep English as placeholder
  return `[VI] ${enValue}`;
}

// Update locale files
locales.forEach((locale) => {
  console.log(`\n📝 Updating ${locale} locale...`);

  for (const [module, keys] of Object.entries(missingKeys)) {
    const filePath = path.join(localesDir, locale, `${module}.json`);

    if (!fs.existsSync(filePath)) {
      console.log(`  ⚠️  File not found: ${filePath}`);
      continue;
    }

    try {
      let content = JSON.parse(fs.readFileSync(filePath, "utf8"));
      let added = 0;

      // Flatten missing keys for this module
      const flatMissing = flattenObject(keys);

      for (const [keyPath, enValue] of Object.entries(flatMissing)) {
        // Check if key already exists
        const keys = keyPath.split(".");
        let current = content;
        let exists = true;

        for (const key of keys) {
          if (!(key in current)) {
            exists = false;
            break;
          }
          current = current[key];
        }

        if (!exists) {
          const value =
            locale === "vi" ? getVietnamesePlaceholder(enValue) : enValue;
          setNestedValue(content, keyPath, value);
          added++;
          console.log(`  ✅ Added: ${module}.${keyPath}`);
        }
      }

      if (added > 0) {
        fs.writeFileSync(filePath, JSON.stringify(content, null, 2) + "\n");
        console.log(`  📊 Total added to ${module}.json: ${added}`);
      } else {
        console.log(`  ℹ️  ${module}.json: All keys already exist`);
      }
    } catch (error) {
      console.error(`  ❌ Error processing ${filePath}:`, error.message);
    }
  }
});

console.log("\n✅ Missing keys update completed!\n");
console.log("Next steps:");
console.log("1. Review and update Vietnamese translations");
console.log("2. Run: npm run lint");
console.log("3. Run: npm run audit:i18n");
console.log("");
