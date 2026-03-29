/**
 * ESLint No-Hardcoded-Toast-Messages Rule v2.0
 *
 * ❌ FORBIDDEN:
 *   toast.success("User created successfully!")
 *   toast.error("Failed to save")
 *
 * ✅ ALLOWED:
 *   toast.success(t("messages.userCreated"))
 *   toast.error(t("messages.saveFailed"))
 *   toast.error(errorMessage)           ← variable is OK
 *   toast.error(getErrorMessage(error)) ← function call is OK
 */

const TOAST_OBJECTS = new Set([
  "toast",
  "message",
  "notification",
  "notify",
  "enqueueSnackbar",
  "showToast",
]);
const TOAST_METHODS = new Set([
  "success",
  "error",
  "info",
  "warning",
  "warn",
  "loading",
  "promise",
]);
const TOAST_PROP_KEYS = new Set(["message", "title", "description"]);

// ─── Reliable isTranslated: walk the AST node, not string search ────────────
const isTranslated = (node) => {
  if (!node) return false;

  // t("key") or i18n.t("key")
  if (node.type === "CallExpression") {
    const callee = node.callee;
    if (callee.name === "t") return true;
    if (callee.type === "MemberExpression" && callee.property?.name === "t")
      return true;
  }

  // Plain identifier: errorMessage, msg, etc. — assume safe (variable)
  if (node.type === "Identifier") return true;

  // Template literal where at least one expression is a t() call
  if (node.type === "TemplateLiteral") {
    return node.expressions.some(
      (expr) =>
        expr.type === "CallExpression" &&
        (expr.callee?.name === "t" ||
          (expr.callee?.type === "MemberExpression" &&
            expr.callee?.property?.name === "t"))
    );
  }

  return false;
};

const isWhitelisted = (value) => {
  if (!value || value.length < 3) return true;
  if (!/[a-zA-Z]/.test(value)) return true; // numbers/symbols only
  return false;
};

const isToastCall = (node) => {
  if (node.type !== "CallExpression") return false;
  const { callee } = node;

  // toast.success(...) / message.error(...)
  if (
    callee.type === "MemberExpression" &&
    callee.object?.type === "Identifier" &&
    TOAST_OBJECTS.has(callee.object.name) &&
    TOAST_METHODS.has(callee.property?.name)
  )
    return true;

  // notify(...) / showToast(...)
  if (callee.type === "Identifier" && TOAST_OBJECTS.has(callee.name))
    return true;

  return false;
};

// ─── Rule ────────────────────────────────────────────────────────────────────

export default {
  meta: {
    type: "problem",
    docs: {
      description: "Disallow hardcoded strings in toast/notification messages",
      category: "Best Practices",
      recommended: true,
    },
    fixable: null,
    schema: [],
  },

  create(context) {
    const checkArg = (argNode) => {
      if (!argNode) return;
      if (isTranslated(argNode)) return;

      // String literal: toast.error("Hard text")
      if (argNode.type === "Literal" && typeof argNode.value === "string") {
        const msg = argNode.value.trim();
        if (isWhitelisted(msg)) return;
        context.report({
          node: argNode,
          message: `❌ Hardcoded toast message: "${msg}". Use i18n: toast.error(t("messages.key"))`,
        });
        return;
      }

      // Template literal: toast.error(`Hello ${name}`) without t()
      if (argNode.type === "TemplateLiteral" && !isTranslated(argNode)) {
        // Only flag if it has static text (not purely dynamic)
        const hasStaticText = argNode.quasis.some(
          (q) => q.value.raw.trim().length > 2
        );
        if (hasStaticText) {
          context.report({
            node: argNode,
            message: `❌ Hardcoded toast message uses template literal. Use i18n: toast.error(t("messages.key"))`,
          });
        }
      }
    };

    return {
      CallExpression(node) {
        if (!isToastCall(node)) return;

        const firstArg = node.arguments[0];
        if (!firstArg) return;

        // Direct string/template arg
        checkArg(firstArg);

        // Object shape: toast.error({ message: "Hard text", title: "..." })
        if (firstArg.type === "ObjectExpression") {
          firstArg.properties.forEach((prop) => {
            if (
              prop.type === "Property" &&
              TOAST_PROP_KEYS.has(prop.key?.name)
            ) {
              checkArg(prop.value);
            }
          });
        }
      },
    };
  },
};
