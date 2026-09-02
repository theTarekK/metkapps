import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import { fileURLToPath } from "node:url";

const projectRoot = fileURLToPath(new URL(".", import.meta.url));

export default defineConfig({
  base: "/",
  plugins: [react()],
  build: {
    rollupOptions: {
      input: {
        main: `${projectRoot}index.html`,
        support: `${projectRoot}support/index.html`,
        wordfit: `${projectRoot}wordfit/index.html`,
        wordfitSupport: `${projectRoot}wordfit/support/index.html`,
        wordfitPrivacy: `${projectRoot}wordfit/privacy/index.html`,
      },
    },
  },
});
