import nextConfig from "eslint-config-next";
import jsxA11y from "eslint-plugin-jsx-a11y";
import tseslint from "typescript-eslint";

export default tseslint.config(
  {
    ignores: [
      ".next/**",
      "node_modules/**",
      "out/**",
      "test-results/**",
      "playwright-report/**",
      "next-env.d.ts",
      "docs/**",
      ".verify/**",
      ".??*/**",
      "public/**",
    ],
  },
  ...nextConfig,
  ...tseslint.configs.strict,
  { rules: jsxA11y.flatConfigs.strict.rules },
  {
    files: ["src/**/*.{ts,tsx}"],
    rules: {
      "@typescript-eslint/no-explicit-any": "error",
      "@typescript-eslint/consistent-type-imports": "error",
      "@typescript-eslint/no-unused-vars": ["error", { argsIgnorePattern: "^_" }],
      "no-restricted-syntax": [
        "error",
        {
          selector: "JSXAttribute[name.name='href'][value.value='#']",
          message: 'href="#" taqiqlangan: oʻlik havola.',
        },
      ],
    },
  },
  {
    /* Picture tayyor AVIF/WebP ni <picture> bilan beradi; manifestda yoʻq manba uchun oddiy <img> ataylab. */
    files: ["src/components/ui/Picture.tsx"],
    rules: { "@next/next/no-img-element": "off" },
  },
  {
    files: ["scripts/**/*.{mjs,ts}", "tests/**/*.ts", "playwright.config.ts"],
    rules: { "@typescript-eslint/no-non-null-assertion": "off" },
  },
);
