import tseslint from "typescript-eslint";
import eslintConfigPrettier from "eslint-config-prettier";
import importPlugin from "eslint-plugin-import";
import simpleImportSort from "eslint-plugin-simple-import-sort";

export default [
  {
    ignores: ["dist/**", "node_modules/**", "src/generated/**", "**/generated/**"],
  },

  {
    files: ["src/**/*.ts"],

    languageOptions: {
      parser: tseslint.parser,
      parserOptions: {
        project: "./tsconfig.json",
      },
    },

    plugins: {
      "@typescript-eslint": tseslint.plugin,
      import: importPlugin,
      "simple-import-sort": simpleImportSort,
    },

    rules: {
      ...tseslint.configs.recommendedTypeChecked[0].rules,

      "@typescript-eslint/no-unused-vars": [
        "error",
        {
          args: "all",
          argsIgnorePattern: "^_",
          caughtErrors: "all",
          caughtErrorsIgnorePattern: "^_",
          destructuredArrayIgnorePattern: "^_",
          varsIgnorePattern: "^_",
          ignoreRestSiblings: true,
        },
      ],

      "import/no-duplicates": "error",

      "simple-import-sort/imports": "error",
      "simple-import-sort/exports": "error",
    },
  },

  {
    files: ["**/*.config.ts", "**/*.config.mts"],
    languageOptions: {
      parser: tseslint.parser,
    },
    rules: {
      ...tseslint.configs.recommended[0].rules,
    },
  },

  eslintConfigPrettier,
];

