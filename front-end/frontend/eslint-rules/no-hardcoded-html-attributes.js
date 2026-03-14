/**
 * ESLint No-Hardcoded-HTML-Attributes Rule
 * Prevents hardcoded text in HTML/JSX attributes that are user-facing
 *
 * ❌ FORBIDDEN:
 * <img alt="User avatar" src="..." />
 * <input placeholder="Enter email" />
 * <button title="Click to save">Save</button>
 * <div aria-label="Close menu">×</div>
 *
 * ✅ ALLOWED:
 * <img alt={t("image.userAvatar")} src="..." />
 * <input placeholder={t("form.emailPlaceholder")} />
 * <button title={t("buttons.save")}>Save</button>
 * <div aria-label={t("labels.closeMenu")}>×</div>
 */

const USER_FACING_ATTRIBUTES = [
  "alt",
  "title",
  "placeholder",
  "aria-label",
  "aria-describedby",
  "aria-labelledby",
  "content", // For meta tags
  "label", // For custom components
];

const isTranslated = (node) => {
  if (!node) return false;

  // Check if it's a t() call
  if (
    node.type === "CallExpression" &&
    (node.callee.name === "t" ||
      (node.callee.type === "MemberExpression" &&
        node.callee.property.name === "t"))
  ) {
    return true;
  }

  // Check if it's a variable/identifier that likely contains translation
  if (node.type === "Identifier" && node.name.includes("i18n")) {
    return true;
  }

  // Check template literal with translation pattern
  if (
    node.type === "TemplateLiteral" &&
    node.quasis.some((quasi) => quasi.value.raw.includes("t("))
  ) {
    return true;
  }

  return false;
};

const isWhitelisted = (value) => {
  const whitelist = [
    "", // Empty string
    "-", // Dash
    "_", // Underscore
    "/", // Forward slash
    ".", // Dot
    "^[0-9]+$", // Numbers only
    "^[a-z0-9-_/\\.]*$", // Technical strings
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
      description: "Disallow hardcoded strings in user-facing HTML attributes",
      category: "Best Practices",
      recommended: true,
    },
    fixable: null,
    schema: [],
  },
  create(context) {
    return {
      JSXAttribute(node) {
        // Check if this is a user-facing attribute
        if (!USER_FACING_ATTRIBUTES.includes(node.name.name)) {
          return;
        }

        const value = node.value;

        // Skip if no value or value is already translated
        if (!value) return;

        // If it's an expression container, check if it's translated
        if (value.type === "JSXExpressionContainer") {
          const expression = value.expression;
          if (isTranslated(expression)) {
            return;
          }
        }

        // If it's a string literal
        if (value.type === "Literal" && typeof value.value === "string") {
          const text = value.value.trim();

          // Skip if empty or whitelisted
          if (!text || isWhitelisted(text)) {
            return;
          }

          // Check if looks like user-facing text
          const hasLetter = /[a-zA-Z]/.test(text);
          const hasLength = text.length > 2;

          if (hasLetter && hasLength) {
            context.report({
              node,
              message: `Hardcoded text in "${node.name.name}" attribute: "${text}". Use i18n: {t("key.path")} instead`,
            });
          }
        }
      },
    };
  },
};
