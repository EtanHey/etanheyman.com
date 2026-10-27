import { FlatCompat } from "@eslint/eslintrc";
import tseslint from "typescript-eslint";

const compat = new FlatCompat({ baseDirectory: import.meta.dirname });

const eslintConfig = [
  {
    ignores: [
      "**/node_modules/**",
      ".next/**",
      "out/**",
      "build/**",
      "coverage/**",
      "docs.local/**",
      ".worktrees/**",
      ".cmux/**",
      "next-env.d.ts",
      "app/(golems)/golems/lib/skills-manifest.json",
      "__tests__/fixtures/**",
    ],
  },
  ...compat.extends("next/core-web-vitals", "next/typescript"),
  {
    // Existing debt surfaced by restoring lint; keep it visible without a source sweep.
    rules: {
      "react-hooks/rules-of-hooks": "warn",
      "react/no-unescaped-entities": "warn",
      "@typescript-eslint/no-explicit-any": "warn",
      "react/display-name": "warn",
      "@typescript-eslint/no-require-imports": "warn",
    },
  },
  {
    files: [
      "app/**/route.ts",
      "app/**/layout.tsx",
      "middleware.ts",
      "lib/**/*.ts",
      "lib/**/*.tsx",
      "app/lib/**/*.ts",
    ],
    languageOptions: {
      parser: tseslint.parser,
      parserOptions: {
        projectService: true,
        tsconfigRootDir: import.meta.dirname,
      },
    },
    rules: {
      "@typescript-eslint/no-misused-promises": "error",
      "@typescript-eslint/no-floating-promises": ["error", { ignoreVoid: false }],
    },
  },
];

export default eslintConfig;
