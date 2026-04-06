import js from "@eslint/js";
import globals from "globals";
import reactHooks from "eslint-plugin-react-hooks";
import reactRefresh from "eslint-plugin-react-refresh";
import tseslint from "typescript-eslint";
import boundaries from "eslint-plugin-boundaries";
import security from "eslint-plugin-security";      // New
import jsxA11y from "eslint-plugin-jsx-a11y";       // New
import customRules from "./eslint-rules/index.js";

export default [
  {
    ignores: [
      "dist", "eslint-rules", "node_modules", "**/*.d.ts",
      "src/i18n/locales/**", "src/i18n/config.ts", "public/**",
      "scripts/**", "*.config.js", "*.config.mjs", "build/**",
    ],
  },
  js.configs.recommended,
  ...tseslint.configs.recommended,
  
  // BASE CONFIG
  {
    files: ["**/*.{ts,tsx}"],
    languageOptions: {
      ecmaVersion: 2020,
      globals: { ...globals.browser, ...globals.es2020 },
      parserOptions: {
        project: ["./tsconfig.node.json", "./tsconfig.app.json"],
        tsconfigRootDir: import.meta.dirname,
      },
    },
    plugins: {
      "react-hooks": reactHooks,
      "react-refresh": reactRefresh,
      boundaries,
      custom: { rules: customRules },
      security,           // SECURITY LAYER
      "jsx-a11y": jsxA11y, // ACCESSIBILITY LAYER
    },
    rules: {
      ...reactHooks.configs.recommended.rules,
      "react-refresh/only-export-components": [
        "error", { allowConstantExport: true }
      ],
      
      // CUSTOM RULES (ERROR - Enforce best practices)
      "custom/no-hardcoded-strings": "error",        // i18n FIRST  
      "custom/no-api-urls": "error",
      "custom/no-hardcoded-html-attributes": "error",
      "custom/no-hardcoded-toast-messages": "error",
      "custom/no-hardcoded-colors": "off",          // TODO: Fix design token usage in Phase 3
      
      // SECURITY (WARN - Awareness)
      "security/detect-object-injection": "warn",
      "security/detect-non-literal-regexp": "warn",
      
      // ACCESSIBILITY (WARN - WCAG gradual)
      "jsx-a11y/alt-text": "warn",
      "jsx-a11y/label-has-associated-control": "warn", 
      "jsx-a11y/anchor-is-valid": "warn",
      "jsx-a11y/heading-has-content": "warn",
      
      // STRICT TYPING + React
      "@typescript-eslint/no-unused-vars": "error",
      "boundaries/no-unknown": "error",
    },
  },

  // STRICT i18n UI folders (NOT CHANGED)
  {
    files: [
      "src/features/**", "src/components/**", "src/pages/**",
      "src/app/**", "src/layouts/**",
      "src/shared/components/**", "src/shared/ui/**"
    ],
    rules: {
      "custom/no-hardcoded-strings": "error"
    }
  },

  // OFF logic/test (NOT CHANGED)
  {
    files: [
      "src/shared/utils/**", "src/shared/services/**", "src/hooks/**",
      "**/*.test.ts", "**/*.test.tsx", "**/*.spec.ts", "**/*.spec.tsx", "**/*.stories.tsx", "**/*.e2e.ts"
    ],
    rules: {
      "custom/no-hardcoded-strings": "off",
      "custom/no-hardcoded-html-attributes": "off",
      "custom/no-hardcoded-toast-messages": "off"
    }
  },

  // EXCLUDE API constants & services from hardcoding rules
  // These files are ALLOWED to define endpoints and strings
  {
    files: [
      // Main constants
      "src/lib/constants.ts",

      // Feature-specific API constants
      "src/features/*/api/constants.ts",

      // Shared API utilities & constants
      "src/shared/api/constants.ts",
      "src/shared/api/formDataBuilder.ts",
      "src/shared/api/responseAdapter.ts",
      "src/shared/api/errorHandler.ts",

      // API Service files (allowed to call APIs)
      "src/features/*/services/*Api.ts",
      "src/shared/utils/axios.ts",
    ],
    rules: {
      // API constants CAN have URLs and strings
      "custom/no-hardcoded-strings": "off",
      "custom/no-api-urls": "off",
      "custom/no-hardcoded-html-attributes": "off",
      "custom/no-hardcoded-toast-messages": "off",
    }
  },

  // EXCLUDE utility files from hardcoding rules
  {
    files: [
      // Shared utilities that may have hardcoded values
      "src/shared/utils/**",
      "src/shared/api/**",
      "src/shared/services/**",

      // Test & config files
      "eslint-rules/**",
      "*.config.js",
      "*.config.ts",
      "vite.config.ts",
    ],
    rules: {
      "custom/no-hardcoded-strings": "off",
      "custom/no-api-urls": "off",
      "custom/no-hardcoded-html-attributes": "off",
      "custom/no-hardcoded-toast-messages": "off",
    }
  },
];