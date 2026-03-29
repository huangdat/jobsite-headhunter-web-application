/**
 * ESLint No-API-URLs Rule
 * Prevents hardcoded API URLs and endpoints
 *
 * ❌ FORBIDDEN:
 * fetch("http://localhost:8080/api/auth/login")
 * axios.get("https://api.example.com/users")
 *
 * ✅ ALLOWED:
 * fetch(`${API_CONFIG.BASE_URL}${API_ENDPOINTS.AUTH.LOGIN}`)
 * import { API_CONFIG, API_ENDPOINTS } from "@/lib/constants";
 */

const API_PATTERNS = [
  /https?:\/\//, // http:// or https://
  /localhost:\d+/, // localhost:port
  /\/api\//, // /api/...
];

const isWhitelisted = (value) => {
  const whitelist = [
    "http://", // Schema only
    "https://", // Schema only
  ];
  return whitelist.includes(value);
};

export default {
  meta: {
    type: "problem",
    docs: {
      description: "Disallow hardcoded API URLs and endpoints",
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

        // Skip if whitelisted
        if (isWhitelisted(node.value)) return;

        // Check if matches API URL patterns
        const isApiUrl = API_PATTERNS.some((pattern) =>
          pattern.test(node.value)
        );

        if (isApiUrl) {
          context.report({
            node,
            message: `Hardcoded API URL detected: "${node.value}". Use API_CONFIG or API_ENDPOINTS from "@/lib/constants" instead`,
            data: {
              url: node.value,
            },
          });
        }
      },

      TemplateLiteral(node) {
        // Check template literals for API URLs
        const quasis = node.quasis.map((q) => q.value.raw).join("");

        const isApiUrl = API_PATTERNS.some((pattern) => pattern.test(quasis));

        if (isApiUrl) {
          context.report({
            node,
            message: `Hardcoded API URL detected in template literal. Use API_CONFIG or API_ENDPOINTS from "@/lib/constants" instead`,
          });
        }
      },
    };
  },
};
