import { defineConfig } from "astro/config";
import svelte from "@astrojs/svelte";
import preact from "@astrojs/preact";
import linaria from "@linaria/rollup";

// https://astro.build/config
export default defineConfig({
  site: "https://rizzzse.github.io",
  integrations: [svelte(), preact()],
  vite: {
    plugins: [linaria()],
    ssr: { noExternal: ["@linaria/*"] },
    legacy: { buildSsrCjsExternalHeuristics: true },
  },
});