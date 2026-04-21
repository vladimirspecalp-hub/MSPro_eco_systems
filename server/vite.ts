import express, { type Express } from "express";
import fs from "fs";
import path from "path";
import { createServer as createViteServer, createLogger } from "vite";
import { type Server } from "http";
import viteConfig from "../vite.config";
import { nanoid } from "nanoid";
import { generateSSRMeta } from "./services/ssr-meta";

const viteLogger = createLogger();

export function log(message: string, source = "express") {
  const formattedTime = new Date().toLocaleTimeString("en-US", {
    hour: "numeric",
    minute: "2-digit",
    second: "2-digit",
    hour12: true,
  });

  console.log(`${formattedTime} [${source}] ${message}`);
}

export async function setupVite(app: Express, server: Server) {
  const serverOptions = {
    middlewareMode: true,
    hmr: { server },
    allowedHosts: true as const,
  };

  const vite = await createViteServer({
    ...viteConfig,
    configFile: false,
    customLogger: {
      ...viteLogger,
      error: (msg, options) => {
        viteLogger.error(msg, options);
        process.exit(1);
      },
    },
    server: serverOptions,
    appType: "custom",
  });

  app.use(vite.middlewares);
  app.use("*", async (req, res, next) => {
    const url = req.originalUrl;

    try {
      const clientTemplate = path.resolve(
        import.meta.dirname,
        "..",
        "client",
        "index.html",
      );

      // always reload the index.html file from disk incase it changes
      let template = await fs.promises.readFile(clientTemplate, "utf-8");
      template = template.replace(
        `src="/src/main.tsx"`,
        `src="/src/main.tsx?v=${nanoid()}"`,
      );

      // SSR: inject JSON-LD, <title>, <meta> tags
      // Clean up default tags from index.html to avoid duplicates
      template = template
        .replace(/<title>[\s\S]*?<\/title>/i, '')
        .replace(/<meta name="description"[\s\S]*?>/i, '')
        .replace(/<meta property="og:[\s\S]*?".*?>/gi, '');

      const { html: ssrMeta, statusCode } = await generateSSRMeta(url, req.geoContext);
      template = template.replace('</head>', `    ${ssrMeta}\n  </head>`);

      const page = await vite.transformIndexHtml(url, template);
      res.status(statusCode).set({ "Content-Type": "text/html" }).end(page);
    } catch (e) {
      vite.ssrFixStacktrace(e as Error);
      next(e);
    }
  });
}

export function serveStatic(app: Express) {
  const distPath = path.resolve(import.meta.dirname, "public");

  if (!fs.existsSync(distPath)) {
    throw new Error(
      `Could not find the build directory: ${distPath}, make sure to build the client first`,
    );
  }

  app.use(express.static(distPath, { index: false, redirect: false }));

  // Read index.html template once for production
  // We use _index.html to bypass Nginx static serving
  const indexHtmlPath = path.resolve(distPath, "_index.html");
  const indexHtmlTemplate = fs.readFileSync(indexHtmlPath, "utf-8");

  // fall through to index.html if the file doesn't exist (SPA catch-all)
  app.use("*", async (req, res) => {
    // SSR: inject JSON-LD, <title>, <meta> tags per-request
    let html = indexHtmlTemplate;

    // Clean up default tags
    html = html
      .replace(/<title>[\s\S]*?<\/title>/i, '')
      .replace(/<meta name="description"[\s\S]*?>/i, '')
      .replace(/<meta property="og:[\s\S]*?".*?>/gi, '');

    const { html: ssrMeta, statusCode } = await generateSSRMeta(req.originalUrl, req.geoContext);
    html = html.replace('</head>', `    ${ssrMeta}\n  </head>`);
    res.status(statusCode)
      .set({
        "Content-Type": "text/html",
        "Cache-Control": "no-store, no-cache, must-revalidate, proxy-revalidate",
        "Pragma": "no-cache",
        "Expires": "0"
      })
      .end(html);
  });
}
