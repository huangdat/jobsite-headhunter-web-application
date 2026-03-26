import js from "@eslint/js";
import globals from "globals";
import reactHooks from "eslint-plugin-react-hooks";
import reactRefresh from "eslint-plugin-react-refresh";
import tseslint from "typescript-eslint";
import boundaries from "eslint-plugin-boundaries";
import security from "eslint-plugin-security";      // ✅ MỚI
import jsxA11y from "eslint-plugin-jsx-a11y";       // ✅ MỚI
import customRules from "./eslint-rules/index.js";

export default [
  {
    ignores: [
      "dist", "eslint-rules", "node_modules", "**/*.d.ts",
      "src/i18n/locales/**", "src/i18n/config.ts", "public/**",
    ],
  },
  js.configs.recommended,
  ...tseslint.configs.recommended,
  
  // ✅ BASE CONFIG
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
      security,           // 🛡️ SECURITY LAYER
      "jsx-a11y": jsxA11y, // ♿ ACCESSIBILITY LAYER
    },
    rules: {
      ...reactHooks.configs.recommended.rules,
      "react-refresh/only-export-components": [
        "error", { allowConstantExport: true }
      ],
      
      // 🔥 PROF-05 ENFORCEMENT (từ config mới)
      "custom/no-hardcoded-strings": "error",        // i18n FIRST  
      "custom/no-api-urls": "error",
      "custom/no-hardcoded-html-attributes": "error",
      "custom/no-hardcoded-toast-messages": "error",
      
      // 🛡️ SECURITY (WARN - Awareness)
      "security/detect-object-injection": "warn",
      "security/detect-non-literal-regexp": "warn",
      
      // ♿ ACCESSIBILITY (WARN - WCAG gradual)
      "jsx-a11y/alt-text": "warn",
      "jsx-a11y/label-has-associated-control": "warn", 
      "jsx-a11y/anchor-is-valid": "warn",
      "jsx-a11y/heading-has-content": "warn",
      
      // ⚙️ STRICT TYPING + React
      "@typescript-eslint/no-unused-vars": "error",
      "boundaries/no-unknown": "error",
    },
  },

  // ✅ STRICT i18n UI folders (như trước)
  {
    files: [
      "src/features/**", "src/components/**", "src/pages/**",
      "src/app/**", "src/layouts/**"
    ],
    rules: {
      "custom/no-hardcoded-strings": "error"
    }
  },

  // ✅ OFF logic/test (như trước)
  {
    files: [
      "src/shared/utils/**", "src/shared/services/**", "src/hooks/**",
      "**/*.test.ts", "**/*.spec.ts", "**/*.stories.tsx", "**/*.e2e.ts"
    ],
    rules: {
      "custom/no-hardcoded-strings": "off"
    }
  },

  // ✅ EXCLUDE lib/constants.ts from API URL rule (API endpoints definition location)
  {
    files: ["src/lib/constants.ts"],
    rules: {
      "custom/no-api-urls": "off"
    }
  },
];