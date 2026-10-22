import { defineConfig, globalIgnores } from "eslint/config";
import nextCoreWebVitals from "eslint-config-next/core-web-vitals";
import jsxA11y from "eslint-plugin-jsx-a11y";

const frameworks = [
  "react",
  "react-*",
  "next",
  "next/*",
  "next-*",
  "swr",
  "axios",
  "stripe",
  "@sanity/*",
];

export default defineConfig([
  ...nextCoreWebVitals,
  { rules: jsxA11y.flatConfigs.strict.rules },
  globalIgnores([".next/**", ".next-*/**", "out/**", "build/**", "next-env.d.ts"]),
  {
    rules: {
      "jsx-a11y/no-noninteractive-tabindex": [
        "error",
        { tags: [], roles: ["tabpanel", "region"] },
      ],
    },
  },
  {
    files: ["src/domain/**/*.{ts,tsx}"],
    rules: {
      "no-restricted-imports": [
        "error",
        {
          patterns: [
            {
              group: [
                "@/application/*",
                "@/infrastructure/*",
                "@/presentation/*",
                "@/app/*",
                ...frameworks,
              ],
              message: "The domain layer must not depend on outer layers or frameworks.",
            },
          ],
        },
      ],
    },
  },
  {
    files: ["src/application/**/*.{ts,tsx}"],
    rules: {
      "no-restricted-imports": [
        "error",
        {
          patterns: [
            {
              group: [
                "@/infrastructure/*",
                "@/presentation/*",
                "@/app/*",
                ...frameworks,
              ],
              message:
                "The application layer may only depend on the domain layer and its own ports.",
            },
          ],
        },
      ],
    },
  },
  {
    files: ["src/presentation/**/*.{ts,tsx}"],
    rules: {
      "no-restricted-imports": [
        "error",
        {
          patterns: [
            {
              group: ["@/infrastructure/*", "@/app/*", "server-only", "stripe", "@sanity/client"],
              message: "The presentation layer must reach server code through the HTTP API, not directly.",
            },
          ],
        },
      ],
    },
  },
]);
