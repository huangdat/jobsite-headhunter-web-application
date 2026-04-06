/**
 * ESLint Rule: no-hardcoded-colors
 *
 * Prevents hardcoded Tailwind color classes in JSX.
 * Forces use of design tokens from @/lib/design-tokens.ts
 *
 * ❌ FORBIDDEN:
 * - className="bg-red-600 hover:bg-red-700"
 * - className="text-green-500 dark:text-green-400"
 *
 * ✅ ALLOWED:
 * - className={getSemanticClass('danger', 'bg', true)}
 * - className={getStatusBadgeClass('PASSED')}
 * - Neutral layout colors (slate-200, etc) for borders/dividers
 *
 * Exceptions:
 * - Comments explaining why hardcoded is needed
 * - Icon categorical colors (for visual distinction)
 * - CSS files
 */

export default {
  meta: {
    type: "problem",
    docs: {
      description:
        "Enforce use of design tokens instead of hardcoded Tailwind color classes",
      category: "Best Practices",
      recommended: "error",
    },
    messages: {
      noHardcodedColors:
        "Hardcoded color class '{{ color }}' detected. Use design-tokens instead: getSemanticClass('semantic', 'type', true) or getStatusBadgeClass(status)",
    },
  },

  create(context) {
    // Color patterns that should NOT appear in className
    const forbiddenColorPattern =
      /\b(bg|text|border|ring)-(lime|emerald|green|red|yellow|amber|blue|purple|rose|pink|orange|cyan|indigo)-\d{1,3}\b/;

    // Allowed exceptions (neutral colors used for layout)
    const allowedNeutralPattern = /\b(bg|text|border|ring)-slate-\d{1,3}\b/;

    return {
      JSXAttribute(node) {
        // Only check className attributes
        if (node.name.name !== "className") return;

        // Skip if value is not a string literal
        if (
          node.value?.type !== "Literal" ||
          typeof node.value.value !== "string"
        ) {
          return;
        }

        const classString = node.value.value;
        const classes = classString.split(/\s+/);

        classes.forEach((cls) => {
          // Check if it matches forbidden pattern
          if (forbiddenColorPattern.test(cls)) {
            // Exception: Allow neutral slate colors (layout)
            if (allowedNeutralPattern.test(cls)) {
              return; // OK - neutral colors are fine
            }

            // Exception: Allow icon categorical colors (for visual distinction)
            // These are typically used in small, non-critical contexts
            if (cls.includes("text-") && !cls.includes("dark:")) {
              // Only flag if it's a semantic color (not just a random color)
              const categoryMatch = cls.match(
                /(?:green|red|blue|purple|orange)-/
              );
              if (categoryMatch) {
                context.report({
                  node,
                  messageId: "noHardcodedColors",
                  data: { color: cls },
                });
              }
            } else {
              // Flag bg-, border-, ring-, and dark: variants
              context.report({
                node,
                messageId: "noHardcodedColors",
                data: { color: cls },
              });
            }
          }
        });
      },
    };
  },
};
