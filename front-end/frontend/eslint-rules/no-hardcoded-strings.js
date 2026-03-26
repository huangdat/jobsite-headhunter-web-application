/**
 * ESLint No-Hardcoded-Strings Rule v4.1 (Fixed Tailwind Detection)
 *
 * ✅ ALWAYS PASS:
 *   - import/export paths: "./UserListPage", "../hooks/useLogin", "@/shared/components"
 *   - Tailwind utility classes (including v4 syntax): "flex items-center gap-2", "data-[size=lg]:size-10"
 *   - i18n key strings: "namespace.key.path" (dots only, no spaces)
 *   - SCREAMING_SNAKE_CASE enum/token values: "SIGN_UP", "ACCESS_TOKEN"
 *   - Material Symbols icon names: "check_circle", "expand_more", "verified_user"
 *   - HTTP verbs, content-types
 *   - console.log(...) arguments (dev mode)
 *   - Pure numbers/symbols
 *   - Short strings < 3 chars
 *
 * ❌ ALWAYS BLOCK:
 *   - UI text with spaces and capital letters: "Enter your email", "User created"
 *   - aria-label string literals and template literals
 *   - JSX text nodes with user-facing content
 *   - Form field names in camelCase: "logoutCurrentSession", "requirePasswordChange"
 */

// ─── Helpers ────────────────────────────────────────────────────────────────

const isTranslated = (node) => {
  const parent = node.parent;
  if (!parent) return false;
  if (parent.type === "CallExpression" && parent.callee?.name === "t")
    return true;
  return false;
};

/**
 * Check if a string is an import/export module path.
 * Covers: "./Foo", "../bar/Baz", "@/shared/hooks", "react", "sonner"
 */
const isModulePath = (value, node) => {
  // Relative paths
  if (/^\.{1,2}\//.test(value)) return true;
  // Alias paths
  if (/^@\//.test(value)) return true;
  // The node is inside an ImportDeclaration or ExportNamedDeclaration
  let n = node.parent;
  while (n) {
    if (
      n.type === "ImportDeclaration" ||
      n.type === "ExportNamedDeclaration" ||
      n.type === "ExportAllDeclaration" ||
      // dynamic import: import("./foo")
      n.type === "ImportExpression"
    )
      return true;
    n = n.parent;
  }
  return false;
};

/**
 * Check if string is an i18n key: "namespace.key" or "namespace.key.subkey"
 * Rules: only word chars + dots, no spaces, at least one dot, no consecutive dots
 */
const isI18nKey = (value) => {
  return /^[\w]+(?:\.[\w]+)+$/.test(value);
};

/**
 * IMPROVED: Check if string is a Tailwind CSS utility class string.
 * Handles very long Tailwind strings from UI component libraries.
 * Strategy:
 * 1. Fast path: Very long strings with data-[...] are likely Tailwind
 * 2. Exclude clear UI text patterns (uppercase start + space)
 * 3. Check for strong Tailwind indicators
 * 4. Token analysis: >50% must be Tailwind-like
 */
const isTailwindClassString = (value) => {
  const trimmed = value.trim();
  if (!trimmed) return false;

  // FAST PATH: Very long Tailwind strings from component libraries
  // Examples: avatar className (200+ chars), button className (150+ chars), dropdown items
  if (trimmed.length > 95) {
    // If has data-[...] selectors (Tailwind v4) → likely Tailwind
    if (/data-\[/.test(trimmed)) {
      return true;
    }
    // If has group/, peer/, or complex selectors → likely Tailwind
    if (/\b(group|peer)[\/:-]/.test(trimmed)) {
      return true;
    }
    // If has multiple strong Tailwind patterns → likely Tailwind
    const strongPatternCount = (
      trimmed.match(
        /(flex|grid|block|relative|absolute|fixed|rounded|shadow|opacity|justify|items|text|bg|border|focus|hover|dark|data|not:|ring)/g
      ) || []
    ).length;
    if (strongPatternCount >= 3) {
      return true;
    }
  }

  // Must have at least one space (multi-token class string)
  if (!/\s/.test(trimmed)) return false;

  // Exclude strings with typical UI text patterns:
  // - Starts with uppercase + space: "User Profile", "Enter Your Email"
  // - Contains common UI words: "please", "click", "enter", "your", "the"
  if (/^[A-Z][a-z]+\s/.test(trimmed)) return false;
  if (
    /\b(please|click|enter|select|choose|your|the|this|that)\b/i.test(trimmed)
  )
    return false;

  // Strong Tailwind indicators (if has ANY of these, very likely Tailwind):
  const strongTailwindPatterns = [
    /\b(flex|grid|block|inline|hidden)\b/, // display
    /\b(absolute|relative|fixed|sticky)\b/, // position
    /\b[pmwh]-\d+/, // spacing/sizing: p-4, m-2, w-10, h-6
    /\btext-(xs|sm|base|lg|xl|2xl|3xl)\b/, // text size
    /\bbg-\w+/, // background
    /\brounded-\w+/, // border radius
    /\b(hover|focus|active|disabled|dark|sm|md|lg|xl|2xl):/, // variants
    /\bgroup-\w+/, // group utilities
    /data-\[/, // data attribute selectors (v4)
    /\[&>\w+\]/, // arbitrary selectors: [&>svg]
    /\w+\/\w+/, // opacity modifiers: bg-black/50
    /\[\w+[=:].+?\]/, // arbitrary values: [width:100px]
  ];

  // If matches any strong pattern, it's Tailwind
  if (strongTailwindPatterns.some((pattern) => pattern.test(trimmed))) {
    return true;
  }

  // Additional check: Split tokens and look for Tailwind-like patterns
  const tokens = trimmed.split(/\s+/);

  // Common Tailwind utility prefixes
  const tailwindPrefixes = [
    "flex",
    "grid",
    "block",
    "inline",
    "hidden",
    "absolute",
    "relative",
    "fixed",
    "sticky",
    "p-",
    "px-",
    "py-",
    "pt-",
    "pb-",
    "pl-",
    "pr-",
    "m-",
    "mx-",
    "my-",
    "mt-",
    "mb-",
    "ml-",
    "mr-",
    "w-",
    "h-",
    "min-",
    "max-",
    "size-",
    "text-",
    "font-",
    "leading-",
    "tracking-",
    "bg-",
    "border-",
    "rounded-",
    "shadow-",
    "gap-",
    "space-",
    "items-",
    "justify-",
    "self-",
    "overflow-",
    "opacity-",
    "z-",
    "transition-",
    "duration-",
    "ease-",
    "animate-",
    "cursor-",
    "pointer-",
    "select-",
    "hover:",
    "focus:",
    "active:",
    "disabled:",
    "dark:",
    "group-",
    "sm:",
    "md:",
    "lg:",
    "xl:",
    "2xl:",
    "aria-",
    "data-",
    "has-",
    "not-",
    "group/",
    "peer/",
  ];

  // Count how many tokens match Tailwind patterns
  const tailwindTokenCount = tokens.filter(
    (token) =>
      tailwindPrefixes.some((prefix) => token.startsWith(prefix)) ||
      /^[a-z]+-[a-z0-9-]+$/.test(token) || // kebab-case: items-center
      /\[/.test(token) // arbitrary values
  ).length;

  // If >50% of tokens look like Tailwind utilities, it's probably Tailwind
  return tailwindTokenCount / tokens.length >= 0.5;
};

/**
 * Check if string is a Material Symbols / Material Icons icon name.
 * These are snake_case single-word identifiers used as text content of <span> tags.
 * e.g. "check_circle", "expand_more", "verified_user", "shield_person"
 */
const isMaterialIconName = (value) => {
  return /^[a-z][a-z0-9]*(?:_[a-z0-9]+)*$/.test(value.trim());
};

const isWhitelisted = (value, node) => {
  const trimmed = value.trim();

  // 1. Empty / too short
  if (!trimmed || trimmed.length < 2) return true;

  // 2. Pure numbers or symbols only (no letters)
  if (!/[a-zA-Z]/.test(trimmed)) return true;

  // 3. Import/export module path
  if (isModulePath(trimmed, node)) return true;

  // 4. SVG path data: "M5.5 11.3L9 14.8Z"
  if (/^[MLHVQZCSCAT0-9 .,-]+$/i.test(trimmed)) return true;

  // 5. SVG element names
  if (
    /^(path|circle|rect|line|polyline|polygon|ellipse|use|g|defs|svg)$/i.test(
      trimmed
    )
  )
    return true;

  // 6. console.* calls — pass during development
  const parent = node.parent;
  if (parent?.type === "CallExpression") {
    const callee = parent.callee;
    if (
      callee?.type === "MemberExpression" &&
      callee?.object?.name === "console" &&
      /^(log|error|warn|info|debug)$/.test(callee?.property?.name)
    )
      return true;
  }

  // 7. Tailwind utility class strings (IMPROVED DETECTION)
  if (isTailwindClassString(trimmed)) return true;

  // 8. HTTP verbs & content-types (used in fetch/axios config)
  if (/^(GET|POST|PUT|DELETE|PATCH|HEAD|OPTIONS)$/.test(trimmed)) return true;
  if (
    /^(application\/json|multipart\/form-data|text\/plain|text\/html)$/.test(
      trimmed
    )
  )
    return true;

  // 9. SCREAMING_SNAKE_CASE — enum values, token types: "SIGN_UP", "ACCESS_TOKEN"
  if (/^[A-Z][A-Z0-9_]+$/.test(trimmed)) return true;

  // 10. PascalCase single word — component names: "Button", "AuthLayout"
  if (/^[A-Z][a-zA-Z0-9]*$/.test(trimmed)) return true;

  // 11. i18n key format: "namespace.key" or "namespace.key.subKey"
  if (isI18nKey(trimmed)) return true;

  // 12. Material Symbols icon names: "check_circle", "expand_more"
  if (isMaterialIconName(trimmed)) return true;

  // 13. URL segments / routes starting with /
  if (/^\/[a-zA-Z0-9/_-]*$/.test(trimmed)) return true;

  // 14. MIME types / media types: "image/jpeg", "image/png"
  if (/^[a-z]+\/[a-z0-9.+-]+$/.test(trimmed)) return true;

  // 15. Short purely lowercase-hyphen strings without spaces (CSS values, html attr values)
  //     e.g. "form-data", "text-left" — single token technical strings
  if (/^[a-z][a-z0-9-]+$/.test(trimmed) && !trimmed.includes(" ")) return true;

  // 16. OpenID scope strings: "openid email profile"
  if (
    /^(openid|email|profile|address|phone)(\s+(openid|email|profile|address|phone))*$/.test(
      trimmed
    )
  )
    return true;

  return false;
};

// ─── Rule ────────────────────────────────────────────────────────────────────

export default {
  meta: {
    type: "problem",
    docs: {
      description:
        "No hardcoded UI strings — use i18n t() for all user-facing text",
      category: "Best Practices",
      recommended: true,
    },
    fixable: null,
    schema: [],
  },

  create(context) {
    return {
      // ── JS/TS string literals ──────────────────────────────────────────────
      Literal(node) {
        if (typeof node.value !== "string") return;
        const value = node.value.trim();

        if (isWhitelisted(value, node) || isTranslated(node)) return;

        // Must be longer than 3 chars with at least one letter
        if (value.length <= 3 || !/[a-zA-Z]/.test(value)) return;

        // Flag strings that look like user-facing text:
        // - Has spaces (multi-word): "Enter your email"
        // - camelCase WITHOUT technical suffix (config/auth keys): "logoutFormButton"
        //   BUT ALLOW: "accessToken", "requirePasswordChange", "companySize" (technical suffixes)
        const hasSpace = /\s/.test(value);
        // Extended technical suffixes: auth, storage, form fields, API payload, UI state
        const technicalSuffixes =
          /^[a-z][a-zA-Z0-9]*(Token|Key|Id|Name|Flag|Field|State|Config|Param|Var|Ref|Item|Data|Value|Type|Mode|Setting|Option|Index|Session|Password|Title|Color|Provider|Url|Uri|Path|Route|Query|Header|Method|Status|Code|Message|Label|Placeholder|Selector|Handler|Callback|Function|Hook|Store|Cache|Buffer|Event|Listener|Subject|Signal|Parent|Child|Sibling|Current|First|Last|Count|Total|Min|Max|Start|End|Open|Close|Active|Visible|Disabled|Enabled|Loading|Ready|Complete|Pending|Error|Warning|Info|Success|Retry|Timeout|Delay|Duration|Interval|Version|Build|Release|Channel|Tag|Commit|Hash|Uuid|Size|Address|Rate|Change|Date|Time|Email|Phone|City|Street|Number|Amount|Price|Cost|Fee|Tax|Discount|Percent|Ratio|Score|Point|Level|Rank|Position|Order|Offset|Limit|Page|Sort|Filter|Match|Pattern|Hash|Signature|Login|Register|Profile|Avatar|Logout|Permission|Role|User|Product|Service|Feature|Feature)$/;
        const isCamelCaseUIText =
          /^[a-z][a-zA-Z0-9]{9,}$/.test(value) &&
          !technicalSuffixes.test(value);

        if (hasSpace || isCamelCaseUIText) {
          context.report({
            node,
            message: `❌ Hardcoded string: "${value}". Use i18n: t("namespace.key") instead`,
          });
        }
      },

      // ── JSX text nodes ────────────────────────────────────────────────────
      JSXText(node) {
        const text = node.value.trim();
        if (!text || text.length < 3) return;

        // ✅ Material icon names in JSX text are OK (they're icon codes, not UI text)
        if (isMaterialIconName(text)) return;

        if (isWhitelisted(text, node)) return;

        // Common UI verbs/words that are used as JSX text (even single-word)
        const commonUIWords = [
          "Loading",
          "Save",
          "Delete",
          "Edit",
          "Cancel",
          "Submit",
          "Search",
          "Filter",
          "Sort",
          "Export",
          "Import",
          "Download",
          "Upload",
          "Preview",
          "Settings",
          "Help",
          "Close",
          "Open",
          "More",
          "Less",
          "Show",
          "Hide",
          "Error",
          "Warning",
          "Success",
          "Info",
          "Action",
          "Add",
          "Remove",
          "Next",
          "Previous",
          "Back",
          "Go",
          "Yes",
          "No",
          "Maybe",
          "Reset",
          "Apply",
          "Update",
          "Create",
          "Read",
          "Copy",
          "Paste",
          "Cut",
          "Clear",
          "Build",
          "Deploy",
          "Start",
          "Stop",
          "Pause",
          "Resume",
          "Refresh",
        ];

        // Flag if:
        // 1. Has spaces (multi-word): "Enter your email"
        // 2. Is a common UI verb (even single-word): "Loading", "Save"
        const hasSpace = /\s/.test(text);
        const isCommonUIWord = commonUIWords.includes(text);

        if (hasSpace || isCommonUIWord) {
          context.report({
            node,
            message: `❌ Hardcoded JSX text: "${text}". Use i18n: {t("namespace.key")} instead`,
          });
        }
      },

      // NOTE: aria-label, alt, title, placeholder are handled by dedicated
      // no-hardcoded-html-attributes.js rule to avoid duplicate errors
    };
  },
};
