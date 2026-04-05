/**
 * Custom ESLint Rules Directory
 *
 * To use custom rules in eslint.config.js:
 *
 * import customRules from "./eslint-rules/index.js";
 *
 * export default [
 *   {
 *     plugins: { custom: { rules: customRules } },
 *     rules: {
 *       "custom/no-hardcoded-strings": "warn",
 *       "custom/no-api-urls": "warn",
 *       "custom/no-hardcoded-html-attributes": "warn",
 *       "custom/no-hardcoded-toast-messages": "warn",
 *     },
 *   },
 * ];
 */

import noHardcodedStrings from "./no-hardcoded-strings.js";
import noApiUrls from "./no-api-urls.js";
import noHardcodedHtmlAttributes from "./no-hardcoded-html-attributes.js";
import noHardcodedToastMessages from "./no-hardcoded-toast-messages.js";
import noHardcodedColors from "./no-hardcoded-colors.js";

export default {
  "no-hardcoded-strings": noHardcodedStrings,
  "no-api-urls": noApiUrls,
  "no-hardcoded-html-attributes": noHardcodedHtmlAttributes,
  "no-hardcoded-toast-messages": noHardcodedToastMessages,
  "no-hardcoded-colors": noHardcodedColors,
};
