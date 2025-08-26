import { eslintConfig } from "@gear-js/frontend-configs";

export default [
  { ignores: ["codegen.ts", "eslint.config.ts", "**/*.d.ts"] },
  ...eslintConfig,
  {
    rules: {
      "@typescript-eslint/no-base-to-string": "off",
    },
  },
];


