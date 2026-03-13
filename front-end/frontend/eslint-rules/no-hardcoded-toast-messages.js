/**
 * ESLint No-Hardcoded-Toast-Messages Rule
 * Prevents hardcoded text in toast/notification messages
 *
 * ❌ FORBIDDEN:
 * toast.success("User created successfully!");
 * toast.error("Failed to save data");
 * message.info("Loading...");
 *
 * ✅ ALLOWED:
 * toast.success(t("messages.userCreated"));
 * toast.error(t("messages.saveFailed"));
 * message.info(t("messages.loading"));
 *
 * Works with: sonner, antd, react-toastify, etc.
 */

const TOAST_FUNCTIONS = [
  "toast",
  "message",
  "notification",
  "notify",
  "enqueueSnackbar",
  "showToast",
];

const TOAST_METHODS = [
  "success",
  "error",
  "info",
  "warning",
  "warn",
  "loading",
  "promise",
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

  // Check if it's an identifier from i18n hook
  if (node.type === "Identifier" && node.name.includes("i18n")) {
    return true;
  }

  // Check template literal with t() call
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
    "", // Empty
    "...", // Loading indicator
    "404", // Error codes
    "500", // Error codes
  ];

  if (whitelist.includes(value)) return true;

  // Skip if only numbers or special chars
  if (!/[a-zA-Z]/.test(value)) return true;

  // Skip very short strings (likely formatting)
  if (value.length < 3) return true;

  return false;
};

const isToastCall = (node) => {
  if (node.type !== "CallExpression") {
    return false;
  }

  // Check for pattern: toast.success(...), message.error(...), etc.
  if (node.callee.type === "MemberExpression") {
    const object = node.callee.object;
    const property = node.callee.property;

    if (object.type === "Identifier") {
      return (
        TOAST_FUNCTIONS.includes(object.name) &&
        TOAST_METHODS.includes(property.name)
      );
    }
  }

  // Check for direct function calls: notify(...), showToast(...), etc.
  if (node.callee.type === "Identifier") {
    return TOAST_FUNCTIONS.some((fn) => node.callee.name === fn);
  }

  return false;
};

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
    return {
      CallExpression(node) {
        // Check if this is a toast function call
        if (!isToastCall(node)) {
          return;
        }

        // Get the first argument
        const firstArg = node.arguments[0];

        if (!firstArg) {
          return;
        }

        // If it's already translated, skip
        if (isTranslated(firstArg)) {
          return;
        }

        // Check for hardcoded string literal
        if (firstArg.type === "Literal" && typeof firstArg.value === "string") {
          const message = firstArg.value.trim();

          // Skip if empty or whitelisted
          if (!message || isWhitelisted(message)) {
            return;
          }

          context.report({
            node: firstArg,
            message: `Hardcoded toast message detected: "${message}". Use i18n: t("messages.key") instead. Example: toast.success(t("messages.saved"))`,
          });
        }

        // Check for hardcoded strings in object argument
        if (firstArg.type === "ObjectExpression") {
          firstArg.properties.forEach((prop) => {
            if (
              prop.type === "Property" &&
              (prop.key.name === "message" ||
                prop.key.name === "title" ||
                prop.key.name === "description")
            ) {
              const value = prop.value;

              if (isTranslated(value)) {
                return;
              }

              if (value.type === "Literal" && typeof value.value === "string") {
                const message = value.value.trim();

                if (!message || isWhitelisted(message)) {
                  return;
                }

                context.report({
                  node: value,
                  message: `Hardcoded toast property "${prop.key.name}": "${message}". Use i18n: t("messages.key") instead`,
                });
              }
            }
          });
        }
      },
    };
  },
};
