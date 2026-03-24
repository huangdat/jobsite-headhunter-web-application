import js from "@eslint/js";
import globals from "globals";
import reactHooks from "eslint-plugin-react-hooks";
import reactRefresh from "eslint-plugin-react-refresh";
import tseslint from "typescript-eslint";
import boundaries from "eslint-plugin-boundaries";
import customRules from "./eslint-rules/index.js";

export default tseslint.config(
  { ignores: ["dist", "eslint-rules"] },
  js.configs.recommended,
  ...tseslint.configs.recommended,
  {
    files: ["**/*.{ts,tsx}"],
    languageOptions: {
      ecmaVersion: 2020,
      globals: {
        ...globals.browser,
        ...globals.es2020, // Good to include for modern JS features
      },
      // This is the key for TS checking!
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
    },
    rules: {
      ...reactHooks.configs.recommended.rules,
      "react-refresh/only-export-components": [
        "error",
        { allowConstantExport: true },
      ],
      "@typescript-eslint/no-unused-vars": "error",
      "boundaries/no-unknown": "error",
      // Custom rules for preventing hardcoded content
      // NOTE: no-hardcoded-strings has too many false positives with Tailwind CSS
      // but enabling it as a 'warn' helps surface obvious i18n misses during development.
      "custom/no-hardcoded-strings": "error",
      "custom/no-api-urls": "error",
      "custom/no-hardcoded-html-attributes": "error",
      "custom/no-hardcoded-toast-messages": "error",
    },
  }
);
