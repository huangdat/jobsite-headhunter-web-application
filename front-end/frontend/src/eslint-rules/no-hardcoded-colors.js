/**
 * ESLint Rule: no-hardcoded-colors
 *
 * Detects hardcoded Tailwind color classes (lime-*, emerald-*, cyan-*, teal-*)
 * and suggests using design-tokens.ts or theme-classes.ts instead.
 *
 * This ensures consistent color usage and makes brand color changes easier.
 */

const HARDCODED_COLOR_PATTERNS = [
  {
    pattern: /\blime-\d+\b/g,
    suggest: "brandColors.primary or getDarkClasses()",
  },
  {
    pattern: /\bemerald-\d+\b/g,
    suggest: "brandColors.success or getDarkClasses()",
  },
  { pattern: /\bcyan-\d+\b/g, suggest: "brandColors.info or getDarkClasses()" },
  { pattern: /\bteal-\d+\b/g, suggest: "brandColors.info or getDarkClasses()" },
];

const ALLOWED_FILES = [
  "design-tokens.ts",
  "theme-classes.ts",
  "tailwind.config.js",
];

module.exports = {
  meta: {
    type: "problem",
    docs: {
      description:
        "Disallow hardcoded color classes. Use design-tokens or theme-classes utilities instead.",
      category: "Best Practices",
      recommended: true,
      url: "https://github.com/project-docs/design-system",
    },
    fixable: null,
    schema: [],
  },

  create(context) {
    const filename = context.getFilename();
    const isAllowedFile = ALLOWED_FILES.some((file) => filename.includes(file));

    if (isAllowedFile) {
      return {};
    }

    return {
      JSXAttribute(node) {
        // Check className attributes in JSX: className="lime-400"
        if (node.name?.name === "className" && node.value?.type === "Literal") {
          const classValue = node.value.value;
          if (typeof classValue !== "string") return;

          for (const { pattern, suggest } of HARDCODED_COLOR_PATTERNS) {
            const matches = classValue.match(pattern);
            if (matches) {
              context.report({
                node,
                message: `Hardcoded color class "${matches[0]}" detected. Use design tokens instead: ${suggest}`,
                data: { suggest },
              });
            }
          }
        }
      },

      TemplateElement(node) {
        // Check template literals: `className={color + ' ' + classes}`
        if (typeof node.value.raw !== "string") return;

        const classValue = node.value.raw;
        for (const { pattern, suggest } of HARDCODED_COLOR_PATTERNS) {
          const matches = classValue.match(pattern);
          if (matches) {
            context.report({
              node,
              message: `Hardcoded color class "${matches[0]}" detected in template. Use design tokens instead: ${suggest}`,
              data: { suggest },
            });
          }
        }
      },

      CallExpression(node) {
        // Check cn() utility calls: cn('lime-400', 'p-4')
        if (
          node.callee.name === "cn" ||
          node.callee.name === "clsx" ||
          node.callee.name === "classnames"
        ) {
          node.arguments.forEach((arg) => {
            if (arg.type === "Literal" && typeof arg.value === "string") {
              const classValue = arg.value;
              for (const { pattern, suggest } of HARDCODED_COLOR_PATTERNS) {
                const matches = classValue.match(pattern);
                if (matches) {
                  context.report({
                    node: arg,
                    message: `Hardcoded color class "${matches[0]}" detected in ${node.callee.name}(). Use design tokens instead: ${suggest}`,
                    data: { suggest },
                  });
                }
              }
            }
          });
        }
      },

      Property(node) {
        // Check object properties: { className: 'lime-400' }
        if (
          (node.key.name === "className" || node.key.value === "className") &&
          node.value.type === "Literal" &&
          typeof node.value.value === "string"
        ) {
          const classValue = node.value.value;
          for (const { pattern, suggest } of HARDCODED_COLOR_PATTERNS) {
            const matches = classValue.match(pattern);
            if (matches) {
              context.report({
                node: node.value,
                message: `Hardcoded color class "${matches[0]}" detected. Use design tokens instead: ${suggest}`,
                data: { suggest },
              });
            }
          }
        }
      },
    };
  },
};
