/**
 * ESLint No-Hardcoded-HTML-Attributes Rule v2.0
 *
 * ❌ FORBIDDEN:
 *   <img alt="User avatar" />
 *   <input placeholder="Enter email" />
 *   <div aria-label={`OTP digit ${index + 1}`} />   ← template literal
 *   <button title="Click to save" />
 *
 * ✅ ALLOWED:
 *   <img alt={t("image.userAvatar")} />
 *   <input placeholder={t("form.emailPlaceholder")} />
 *   <div aria-label={t("labels.otpDigit", { n: index + 1 })} />
 *   <button title={t("buttons.save")} />
 *   <div aria-label={dynamicVariable} />   ← plain identifier OK
 */

const USER_FACING_ATTRS = new Set([
  "alt",
  "title",
  "placeholder",
  "aria-label",
  "aria-description",
  "label",
]);

// ─── Reliable isTranslated ───────────────────────────────────────────────────
const isTranslated = (node) => {
  if (!node) return false;

  // t("key") or i18n.t("key")
  if (node.type === "CallExpression") {
    const callee = node.callee;
    if (callee?.name === "t") return true;
    if (callee?.type === "MemberExpression" && callee?.property?.name === "t")
      return true;
  }

  // Plain variable — assume safe (dynamic value)
  if (node.type === "Identifier") return true;

  // Conditional/ternary whose both branches are translated
  if (node.type === "ConditionalExpression") {
    return isTranslated(node.consequent) && isTranslated(node.alternate);
  }

  // Template literal is NOT considered translated unless it wraps a t() call
  // (handled as a violation below)
  return false;
};

const isWhitelistedValue = (text) => {
  if (!text || text.length <= 2) return true;
  if (!/[a-zA-Z]/.test(text)) return true;
  // Pure lowercase-hyphen  e.g. "form-data" — technical, not UI
  if (/^[a-z][a-z0-9-]+$/.test(text)) return true;
  return false;
};

// ─── Rule ────────────────────────────────────────────────────────────────────

export default {
  meta: {
    type: "problem",
    docs: {
      description:
        "Disallow hardcoded strings in user-facing HTML/JSX attributes",
      category: "Best Practices",
      recommended: true,
    },
    fixable: null,
    schema: [],
  },

  create(context) {
    return {
      JSXAttribute(node) {
        const attrName = node.name?.name;
        if (!USER_FACING_ATTRS.has(attrName)) return;

        const val = node.value;
        if (!val) return;

        // ── Case 1: aria-label="string literal" ──────────────────────────
        if (val.type === "Literal" && typeof val.value === "string") {
          const text = val.value.trim();
          if (isWhitelistedValue(text)) return;
          context.report({
            node,
            message: `❌ Hardcoded "${attrName}": "${text}". Use i18n: ${attrName}={t("key")}`,
          });
          return;
        }

        // ── Case 2: aria-label={expression} ──────────────────────────────
        if (val.type === "JSXExpressionContainer") {
          const expr = val.expression;

          // ✅ translated or variable — OK
          if (isTranslated(expr)) return;

          // ❌ template literal: aria-label={`OTP digit ${index + 1}`}
          if (expr.type === "TemplateLiteral") {
            context.report({
              node,
              message: `❌ Hardcoded "${attrName}" uses template literal. Use i18n: ${attrName}={t("key", { n: value })}`,
            });
            return;
          }

          // ❌ plain string in expression: aria-label={"Some text"}
          if (expr.type === "Literal" && typeof expr.value === "string") {
            const text = expr.value.trim();
            if (isWhitelistedValue(text)) return;
            context.report({
              node,
              message: `❌ Hardcoded "${attrName}": "${text}". Use i18n: ${attrName}={t("key")}`,
            });
          }
        }
      },
    };
  },
};
