import js from "@eslint/js";
import tseslint from "typescript-eslint";

export default tseslint.config(
  {
    ignores: [".next/**", "next-env.d.ts", "node_modules/**"]
  },
  js.configs.recommended,
  ...tseslint.configs.recommended,
  {
    languageOptions: {
      globals: {
        AbortController: "readonly",
        AbortSignal: "readonly",
        DOMException: "readonly",
        fetch: "readonly",
        React: "readonly",
        Response: "readonly",
        URL: "readonly",
        console: "readonly",
        document: "readonly",
        process: "readonly",
        window: "readonly"
      }
    }
  }
);
