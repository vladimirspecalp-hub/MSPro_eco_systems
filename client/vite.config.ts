import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import path from "path";
import runtimeErrorOverlay from "@replit/vite-plugin-runtime-error-modal";

export default defineConfig({
    plugins: [
        react(),
        runtimeErrorOverlay(),
    ],
    resolve: {
        alias: {
            "@": path.resolve(import.meta.dirname, "src"),
            "@shared": path.resolve(import.meta.dirname, "../shared"),
        },
    },
    root: import.meta.dirname,
    publicDir: path.resolve(import.meta.dirname, "../public"), // public is in client/public? No, root public. Wait, let's check file structure.
    // Actually, checking list_dir result in step 171:
    // "public", "client", "server". "public" is in root?
    // list_dir step 53 showed "public" has "assets", "brend".
    // list_dir step 171 shows "public".
    // so public is at root "c:\Users\1\.gemini\antigravity\scratch\public"
    // BUT client/index.html is in client.
    // Standard vite: public is usually alongside src.
    // If public is in root, we need to point to it.

    // Wait, step 3 list_dir showed "client" and "public".
    // Step 22 list_dir client/src
    // Step 53 list_dir public (root public).

    // So publicDir should be "../../public" relative to client/vite.config.ts?
    // client/vite.config.ts
    // root/public
    // .. -> root.
    // So "../public". 

    // However, the previous vite.config.ts (root) had:
    // root: path.resolve(import.meta.dirname, "client"),
    // publicDir: path.resolve(import.meta.dirname, "public"),

    // If I move config to client/:
    // import.meta.dirname is client/
    // publicDir is ../public

    build: {
        outDir: "../dist/public",
        emptyOutDir: true,
    },
    server: {
        host: "0.0.0.0",
        port: 5000, // Frontend dev port usually different? Or proxy?
        // User runs "npm run dev" -> "tsx server/index.ts".
        // Server serves static files.
        // This config is mainly for "vite build".
    },
});
