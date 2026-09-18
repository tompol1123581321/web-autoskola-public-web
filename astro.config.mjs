import { defineConfig, passthroughImageService } from "astro/config";
import react from "@astrojs/react";
import tailwindcss from "@tailwindcss/vite";
import icon from "astro-icon";

// https://astro.build/config
export default defineConfig({
  site: "https://hlavacekautoskola.cz",
  integrations: [react(), icon()],
  vite: {
    plugins: [tailwindcss()],
  },
  // experimental: { viewTransitions: true },
  image: {
    service: passthroughImageService(),
  },
});
