import { defineConfig, globalIgnores } from "eslint/config";
import nextVitals from "eslint-config-next/core-web-vitals";
import nextTs from "eslint-config-next/typescript";

const eslintConfig = defineConfig([
  ...nextVitals,
  ...nextTs,
  globalIgnores([
    // Default ignores of eslint-config-next:
    ".next/**",
    "out/**",
    "build/**",
    "next-env.d.ts",
    // Extras:
    "coverage/**",
    "scripts/**", // scripts Node (CJS) de build/mídia — não são código da app
    "*.config.{js,mjs,ts}",
  ]),
  {
    rules: {
      // Débito pré-existente de tipagem — vira warning para não travar o CI;
      // acompanhado numa issue.
      "@typescript-eslint/no-explicit-any": "warn",
    },
  },
]);

export default eslintConfig;
