import js from "@eslint/js";
import globals from "globals";
import prettier from "eslint-config-prettier";
import reactPlugin from "eslint-plugin-react";
import pluginQuery from "@tanstack/eslint-plugin-query";

//** @type {import('eslint').Linter.Config} */
export default [
  js.configs.recommended,
  {
    ...reactPlugin.configs.flat.recommended,
    settings: { react: { version: "detect" } },
  },
  reactPlugin.configs.flat["jsx-runtime"],
  ...pluginQuery.configs["flat/recommended"],

  {
    files: ["**/*.{js,jsx}"],
    languageOptions: {
      globals: {
        ...globals.browser,
        ...globals.node,
      },
      parserOptions: {
        ecmaFeatures: {
          jsx: true,
        },
      },
    },
    rules: {
      ...reactPlugin.configs.flat.recommended.rules,
      "react/no-unescaped-entities": "off",
      "react/prop-types": "off",
      "react/jsx-no-undef": "error",
      "react/react-in-jsx-scope": "off",
      "react/jsx-uses-react": "off",
    },
    ignores: ["**/coverage/**", "**/dist/**"],
  },
  prettier,
];
