/**
 * ESLint No-Hardcoded-Strings Rule
 * Prevents hardcoded text in JSX/TSX files
 *
 * ❌ FORBIDDEN:
 * <p>Welcome to our app</p>
 * const msg = "Hello user";
 *
 * ✅ ALLOWED:
 * <p>{t("common.welcome")}</p>
 * const msg = t("messages.greeting");
 *
 * Exceptions:
 * - Keywords, operators, component names
 * - Type/Interface definitions
 * - Comments
 */

const isTranslated = (node) => {
  // Check if it's inside t("...") or {`...key...`}
  const parent = node.parent;

  if (!parent) return false;

  // Check if it's argument to t() function
  if (parent.type === "CallExpression" && parent.callee.name === "t") {
    return true;
  }

  // Check if it's inside template literal with translation key pattern
  if (parent.type === "TemplateLiteral" && node.value.match(/[a-z]+\.[a-z]+/)) {
    return true;
  }

  return false;
};

const isWhitelisted = (value) => {
  const whitelist = [
    // HTML attributes
    "href",
    "src",
    "alt",
    "placeholder",
    "type",
    "name",
    "className",
    "id",
    // Common patterns
    ".",
    "-",
    "_",
    "/",
    "\\",
    // Patterns that are clearly not user-facing text
    "^[a-zA-Z0-9/_-]*$", // URLs, paths
    "^[A-Z][a-zA-Z0-9]*$", // Component names
  ];

  return whitelist.some((pattern) => {
    if (pattern instanceof RegExp) {
      return pattern.test(value);
    }
    return pattern === value;
  });
};

export default {
  meta: {
    type: "problem",
    docs: {
      description: "Disallow hardcoded strings in JSX/TSX files",
      category: "Best Practices",
      recommended: true,
    },
    fixable: null,
    schema: [],
  },
  create(context) {
    return {
      Literal(node) {
        // Only check string literals
        if (typeof node.value !== "string") return;

        // Skip whitespace-only strings
        if (!node.value.trim()) return;

        // Skip short strings (likely not user-facing text)
        if (node.value.length < 3) return;

        // Skip if whitelisted
        if (isWhitelisted(node.value)) return;

        // Skip if already translated
        if (isTranslated(node)) return;

        // Check if it looks like user-facing text (has space, letter)
        const hasSpace = /\s/.test(node.value);
        const hasLetter = /[a-zA-Z]/.test(node.value);

        if (hasSpace && hasLetter) {
          context.report({
            node,
            message: `Hardcoded text detected: "${node.value}". Use i18n: {t("key.path")} instead`,
            data: {
              text: node.value,
            },
          });
        }
      },

      JSXText(node) {
        const text = node.value.trim();

        // Skip if empty or only whitespace
        if (!text) return;

        // Skip if whitelisted
        if (isWhitelisted(text)) return;

        // Skip if already in translation
        if (isTranslated(node)) return;

        // Check if looks like user text
        const hasSpace = /\s/.test(text);
        const hasLetter = /[a-zA-Z]/.test(text);

        if (hasSpace && hasLetter) {
          context.report({
            node,
            message: `Hardcoded JSX text detected: "${text}". Use i18n: {t("key.path")} instead`,
            data: {
              text,
            },
          });
        }
      },
    };
  },
};
