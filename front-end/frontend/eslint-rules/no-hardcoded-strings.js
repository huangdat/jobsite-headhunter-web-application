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
 * ✅ WHITELISTED:
 * Tailwind CSS, imports/exports, HTML attrs, paths
 */

const isTranslated = (node) => {
  const parent = node.parent;
  if (!parent) return false;

  // ✅ t("key.path") function
  if (parent.type === "CallExpression" && parent.callee?.name === "t") {
    return true;
  }

  // ✅ Template literal `common.key`
  if (parent.type === "TemplateLiteral" && node.value.match(/[a-z]+\.[a-z]+/)) {
    return true;
  }

  return false;
};

const isWhitelisted = (value) => {
  const trimmed = value.trim();

  // ✅ SKIP empty/whitespace
  if (!trimmed) return true;

  // ✅ SKIP short strings (keywords, attrs)
  if (trimmed.length < 3) return true;

  // ✅ TAILWIND CSS CLASSES (FULL WHITELIST)
  const tailwindPrefixes = [
    'grid', 'flex', 'gap', 'p-', 'm-', 'text-', 'bg-', 'border-', 'shadow-', 
    'rounded-', 'w-', 'h-', 'min-', 'max-', 'sm:', 'md:', 'lg:', 'xl:', '2xl:',
    'hover:', 'focus:', 'active:', 'disabled:', 'dark:', 'first:', 'last:', 
    'only:', 'group-', 'peer-', 'ring-', 'divide-', 'place-', 'inset-',
    'object-', 'top-', 'right-', 'bottom-', 'left-', 'z-', 'opacity-', 'scale-',
    'rotate-', 'skew-', 'translate-', 'animate-', 'transition-', 'delay-'
  ];

  // Tailwind pattern match
  const isTailwind = tailwindPrefixes.some(prefix => 
    trimmed.includes(prefix) || trimmed.match(new RegExp(`^${prefix.replace(/[-:]/g, '\\$&')}[a-zA-Z0-9\\-\\s:/\\[\\]]*$`))
  );

  if (isTailwind) return true;

  // ✅ HTML attributes
  const htmlAttrs = ['href', 'src', 'alt', 'placeholder', 'type', 'name', 'id', 'title', 'className', 'viewBox'];
  if (htmlAttrs.includes(trimmed)) return true;

  // ✅ Import/export keywords
  const keywords = ['import', 'export', 'from', 'as', 'default'];
  if (keywords.includes(trimmed)) return true;

  // ✅ Paths/URLs (no spaces)
  if (/^[a-zA-Z0-9/_\\-]+$/.test(trimmed)) return true;

  // ✅ Component names (PascalCase)
  if (/^[A-Z][a-zA-Z0-9]*$/.test(trimmed)) return true;

  // ✅ SVG paths/numbers
  if (/^M[0-9 .,-]+$/.test(trimmed) || /^[0-9 .,]+$/.test(trimmed)) return true;

  return false;
};

export default {
  meta: {
    type: "problem",
    docs: {
      description: "Disallow hardcoded user-facing strings (Tailwind whitelisted)",
      category: "Best Practices",
      recommended: true,
    },
    fixable: null,
    schema: [],
  },
  create(context) {
    return {
      Literal(node) {
        if (typeof node.value !== "string") return;
        
        const value = node.value.trim();
        if (!value || value.length < 3) return;
        
        // ✅ SKIP whitelisted + translated
        if (isWhitelisted(value) || isTranslated(node)) return;
        
        // ✅ TRIGGER: user-facing text (space + letters)
        const hasSpace = /\s/.test(value);
        const hasLetter = /[a-zA-Z]/.test(value);
        
        if (hasSpace && hasLetter) {
          context.report({
            node,
            message: `❌ Hardcoded text: "${value}". Use i18n: {t("key.path")} instead`,
          });
        }
      },

      JSXText(node) {
        const text = node.value.trim();
        if (!text || text.length < 3) return;
        
        if (isWhitelisted(text) || isTranslated(node)) return;
        
        const hasSpace = /\s/.test(text);
        const hasLetter = /[a-zA-Z]/.test(text);
        
        if (hasSpace && hasLetter) {
          context.report({
            node,
            message: `❌ Hardcoded JSX text: "${text}". Use i18n: {t("key.path")} instead`,
          });
        }
      },
    };
  },
};
