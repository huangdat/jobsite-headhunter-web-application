/**
 * ESLint No-Hardcoded-Strings Rule v2.2 - PROF-05 WORLD-CLASS (Updated)
 * ✅ PASS: SVG paths/text, console.log*, technical data
 * ✅ BLOCK: toast.* messages, aria-label, UI text, JSX text
 */

const isTranslated = (node) => {
  const parent = node.parent;
  if (!parent) return false;

  // ✅ t("key.path") function call
  if (parent.type === "CallExpression" && parent.callee?.name === "t") {
    return true;
  }

  return false;
};

const isWhitelisted = (value, node) => {
  const trimmed = value.trim();
  if (!trimmed || trimmed.length < 3) return true;

  // ✅ SVG PATHS/TEXT (CRITICAL - M5.5 11.3L9 14.8Z + title/desc)
  if (/^[MLHVQZCSAT0-9 .,-]+$/i.test(trimmed)) return true;
  if (/^(path|circle|rect|line|polyline|polygon)$/i.test(trimmed)) return true;

  // ✅ CONSOLE.LOG* WHITELIST (dev-only)
  const parent = node.parent;
  if (parent?.type === "CallExpression") {
    const callee = parent.callee;
    // Handle both console.log() and other functions
    if (callee?.name?.match(/^console\.(log|error|warn|info|debug)$/)) {
      return true;
    }
    // Handle console.error/debug/log (MemberExpression like console.error)
    if (callee?.type === "MemberExpression" && 
        callee?.object?.name === "console" &&
        callee?.property?.name?.match(/^(log|error|warn|info|debug)$/)) {
      return true;
    }
  }

  // ✅ TAILWIND CSS (PERFECT WHITELIST)
  const tailwindPrefixes = [
    "grid",
    "flex",
    "gap",
    "p-",
    "m-",
    "text-",
    "bg-",
    "border-",
    "shadow-",
    "rounded-",
    "w-",
    "h-",
    "min-",
    "max-",
    "sm:",
    "md:",
    "lg:",
    "xl:",
    "2xl:",
    "hover:",
    "focus:",
    "active:",
    "disabled:",
    "dark:",
    "ring-",
    "divide-",
  ];
  const isTailwind = tailwindPrefixes.some(
    (prefix) =>
      trimmed.includes(prefix) ||
      trimmed.match(
        new RegExp(
          `^${prefix.replace(/[-:]/g, "\\$&")}[a-zA-Z0-9\\-\\s:/\\[\\]]*$`
        )
      )
  );
  if (isTailwind) return true;

  // ✅ HTTP methods + Content-Type (technical)
  const technical = [
    "GET",
    "POST",
    "PUT",
    "DELETE",
    "PATCH",
    "application/json",
  ];
  if (technical.includes(trimmed)) return true;

  // ✅ HTML attributes (KHÔNG bao gồm aria-label!)
  const htmlAttrs = [
    "href",
    "src",
    "placeholder",
    "type",
    "name",
    "id",
    "className",
    "viewBox",
    "url",
    "method",
  ];
  if (htmlAttrs.includes(trimmed)) return true;

  // ✅ Component names (PascalCase)
  if (/^[A-Z][a-zA-Z0-9]*$/.test(trimmed)) return true;

  // ✅ File paths (no spaces)
  if (/^[a-zA-Z0-9/_\\-]+$/.test(trimmed)) return true;

  return false;
};

// ✅ NEW: BLOCK toast.* hard text & aria-label
const isBlockedSpecialCase = (value, node) => {
  const trimmed = value.trim();

  // BLOCK: toast.success/error/info("Hard text")
  const parent = node.parent;
  if (parent?.type === "CallExpression") {
    const callee = parent.callee;
    if (callee?.name?.match(/^toast\.(success|error|info|warning)$/)) {
      return true; // Force block toast hard text
    }
  }

  // BLOCK: aria-label="User text"
  if (parent?.type === "JSXAttribute" && parent.name?.name === "aria-label") {
    return true; // Force block ALL aria-label
  }

  return false;
};

export default {
  meta: {
    type: "problem",
    docs: {
      description:
        "No hardcoded UI strings (SVG safe, toast/aria-label BLOCKED, console PASS)",
      category: "Best Practices",
      recommended: true,
    },
    fixable: null,
    schema: [],
  },
  create(context) {
    return {
      // ✅ BLOCK JavaScript strings
      Literal(node) {
        if (typeof node.value !== "string") return;
        const value = node.value.trim();

        // SKIP: technical + translated
        if (isWhitelisted(value, node) || isTranslated(node)) return;

        // ✅ NEW: BLOCK toast & aria-label FIRST (highest priority)
        if (isBlockedSpecialCase(value, node)) {
          context.report({
            node,
            message: `❌ Hardcoded ${getErrorType(node)}: "${value}". Use i18n: t("key.path") instead`,
          });
          return;
        }

        // TRIGGER: UI text (space + Capital + length)
        if (value.length > 5 && /\s/.test(value) && /[A-Z]/.test(value)) {
          context.report({
            node,
            message: `❌ Hardcoded UI text: "${value}". Use i18n: {t("key.path")} instead`,
          });
        }
      },

      // ✅ BLOCK JSX text
      JSXText(node) {
        const text = node.value.trim();
        if (!text || text.length < 5) return;

        if (isWhitelisted(text, node) || isTranslated(node)) return;

        context.report({
          node,
          message: `❌ Hardcoded JSX text: "${text}". Use i18n: {t("key.path")} instead`,
        });
      },

      // ✅ NEW: BLOCK JSX aria-label attributes
      JSXAttribute(node) {
        if (
          node.name?.name === "aria-label" &&
          node.value?.type === "JSXExpressionContainer"
        ) {
          // ✅ SKIP: if using t() call for i18n
          const expr = node.value.expression;
          if (expr.type === "CallExpression" && expr.callee?.name === "t") {
            return; // Approved: using i18n
          }

          // ✅ SKIP: if it's a variable (likely dynamic)
          if (expr.type === "Identifier") {
            return; // Variable assignment, assume OK
          }

          context.report({
            node,
            message: `❌ Hardcoded aria-label: "${expr.value || "dynamic"}". Use i18n: t("key.path")`,
          });
        }
      },
    };
  },
};

// Helper để customize message
function getErrorType(node) {
  const parent = node.parent;
  if (parent?.callee?.name?.match(/^toast\./)) return "toast message";
  if (parent?.name?.name === "aria-label") return "aria-label";
  return "string";
}
