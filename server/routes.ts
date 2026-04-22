import type { Express } from "express";
import { z } from "zod";
import express from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { insertLeadSchema, insertCalculationSchema } from "@shared/schema";
import { getPageBySlug, getRelatedPages, getAllFAQs, getSEOStats, invalidateSEOCache } from "./services/seo-service";
import { promises as fs, existsSync, mkdirSync } from "fs";
import { resolve, join, extname } from "path";
import multer from "multer";
import seoApiRouter from "./routes/seo-api";
import geoApiRouter from "./routes/geo-api";
import aeoApiRouter from "./routes/aeo-api";
import uxApiRouter from "./routes/ux-api";
import healthApiRouter from "./routes/health-api";
import newsApiRouter from "./routes/news-api";
import sitemapApiRouter from "./routes/sitemap-api";
import knowledgeApiRouter from "./routes/knowledge-api";
import { geoContextMiddleware } from "./middleware/geo-context";
import { sendLeadNotification } from "./services/notification";

export async function registerRoutes(app: Express): Promise<Server> {
  // Serve PDF documents explicitly — NOT via express.static on "/documents" path,
  // because express.static issues 301 redirect for directory paths (e.g. /documents → /documents/),
  // which conflicts with the SPA route /documents handled by the SSR catch-all.
  const publicDocsPath = resolve(import.meta.dirname, "..", "public", "documents");
  app.get("/documents/:filename", (req, res, next) => {
    const filePath = resolve(publicDocsPath, req.params.filename);
    // Security: only serve files directly inside the documents folder (no path traversal)
    if (!filePath.startsWith(publicDocsPath)) return res.status(403).end();
    res.sendFile(filePath, (err) => {
      if (err) next(); // file not found → fall through to SPA catch-all
    });
  });

  // GEO Context Middleware (добавляет req.geoContext ко всем запросам)
  app.use(geoContextMiddleware);

  // SEO API v3.0
  app.use("/api/seo", seoApiRouter);

  // GEO API v3.0
  app.use("/api/geo", geoApiRouter);

  // AEO API v3.0
  app.use("/api/aeo", aeoApiRouter);

  // UX Personalization API v3.0
  app.use("/api/ux", uxApiRouter);

  // Health Check API v3.0
  app.use("/api/health", healthApiRouter);

  // Knowledge Base API (ручные экспертные материалы)
  app.use("/api/knowledge", knowledgeApiRouter);

  // Price Guides API v1.0
  app.get("/api/price-guides/:slug", async (req, res) => {
    try {
      const slug = req.params.slug;
      console.log(`[DEBUG] Price Guide Request. Slug: "${slug}"`);
      // Sanitize slug to prevent directory traversal
      if (!slug || slug.includes('..') || slug.includes('/')) {
        return res.status(400).json({ error: "Invalid slug format" });
      }

      const filePath = resolve(process.cwd(), "content", "price_guides", `${slug}.json`);
      console.log(`[DEBUG] File path: ${filePath}`);

      try {
        await fs.access(filePath);
      } catch {
        console.log(`[DEBUG] File not found: ${filePath}`);
        return res.status(404).json({ error: "Price Guide not found" });
      }

      const content = await fs.readFile(filePath, "utf-8");
      const json = JSON.parse(content);
      res.json(json);
    } catch (error: any) {
      console.error(`Error serving price guide ${req.params.slug}:`, error);
      res.status(500).json({ error: "Internal Server Error" });
    }
  });

  // Sitemap.xml
  app.use("/", sitemapApiRouter);

  // Robots.txt
  // Robots.txt handled by static middleware or explicit file serve if needed
  // app.get("/robots.txt", ...);


  // LLMs.txt — context for AI crawlers
  app.get("/llms.txt", async (req, res) => {
    const llmsPath = resolve(import.meta.dirname, "..", "client", "public", "llms.txt");
    try {
      await fs.access(llmsPath);
      res.type("text/plain");
      res.sendFile(llmsPath);
    } catch {
      res.status(404).type("text/plain").send("Not found");
    }
  });

  // News API v1.0
  app.use("/api/news", newsApiRouter);


  // --- File Upload Configuration ---
  const uploadDir = resolve(process.cwd(), "uploads");
  if (!existsSync(uploadDir)) {
    mkdirSync(uploadDir);
  }

  const storageConfig = multer.diskStorage({
    destination: (_req, _file, cb) => {
      cb(null, uploadDir);
    },
    filename: (_req, file, cb) => {
      const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
      cb(null, uniqueSuffix + extname(file.originalname));
    },
  });

  const fileFilter = (_req: any, file: Express.Multer.File, cb: any) => {
    const allowedExtensions = [
      // Images
      ".jpg", ".jpeg", ".png", ".webp", ".heic",
      // Documents
      ".pdf", ".doc", ".docx", ".xls", ".xlsx", ".ppt", ".pptx", ".txt", ".rtf"
    ];
    const ext = extname(file.originalname).toLowerCase();

    if (allowedExtensions.includes(ext)) {
      cb(null, true);
    } else {
      cb(new Error("File type not allowed"));
    }
  };

  const upload = multer({
    storage: storageConfig,
    fileFilter: fileFilter,
    limits: { fileSize: 10 * 1024 * 1024 } // 10MB limit per file
  });

  // Lead routes
  app.post("/api/leads", (req: any, res: any, next: any) => {
    upload.array("files", 10)(req, res, (err: any) => {
      if (err) {
        console.error("Multer upload error:", err);
        return res.status(400).json({ error: "File upload failed", details: err.message });
      }
      next();
    });
  }, async (req, res) => {
    try {
      console.log("POST /api/leads request body:", req.body);
      // Fix Cyrillic filename encoding (Multer often parses as latin1)
      if (Array.isArray(req.files)) {
        (req.files as Express.Multer.File[]).forEach(f => {
          f.originalname = Buffer.from(f.originalname, 'latin1').toString('utf8');
        });
      }

      console.log("Files:", req.files);

      // Multer processes files first. We need to manually construct the object for Zod if it was sent as FormData
      // FormData sends everything as strings, so we might need to parse.
      // But Zod schema expects strings for standard fields, which matches FormData.

      const rawData = { ...req.body };

      // If files were uploaded, add their paths/names to attachments
      if (Array.isArray(req.files) && req.files.length > 0) {
        rawData.attachments = (req.files as Express.Multer.File[]).map(f => f.filename);
      }

      const validatedData = insertLeadSchema.parse(rawData);
      console.log("Validation passed.");

      // Attach file info for notification service (it needs paths)
      const filesForNotification = (req.files as Express.Multer.File[]) || [];

      // 1. Send Notification FIRST (Critical Path)
      try {
        await sendLeadNotification(validatedData, filesForNotification);
        console.log("Notification sent successfully (pre-DB).");
      } catch (err) {
        console.error("Notification trigger failed:", err);
      }

      // 2. Clear from storage (Since we use MemStorage as a stub/log)
      const lead = await storage.createLead(validatedData);
      console.log("Lead processed:", lead.id);

      res.json(lead);
    } catch (error: any) {
      console.error("Lead Handler Execution Failed:", error);
      if (error instanceof z.ZodError) {
        console.error("Validation Details:", JSON.stringify(error.flatten(), null, 2));
        res.status(400).json({ error: "Validation Error", details: error.flatten() });
      } else {
        const msg = error instanceof Error ? error.message : String(error);
        res.status(400).json({ error: msg, raw: String(error) });
      }
    }
  });

  app.get("/api/leads", async (req, res) => {
    try {
      const leads = await storage.getAllLeads();
      res.json(leads);
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  });

  app.get("/api/leads/:id", async (req, res) => {
    try {
      const lead = await storage.getLead(req.params.id);
      if (!lead) {
        return res.status(404).json({ error: "Lead not found" });
      }
      res.json(lead);
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  });

  // Calculation routes
  app.post("/api/calculations", async (req, res) => {
    try {
      const validatedData = insertCalculationSchema.parse(req.body);

      // Автоматический расчёт стоимости, если не указана
      if (!validatedData.estimatedCost) {
        const baseRate = 5000; // Базовая ставка за м²
        const height = validatedData.height ? parseFloat(validatedData.height) : 0;
        const surfaceArea = validatedData.surfaceArea ? parseFloat(validatedData.surfaceArea) : 100;

        // Валидация numeric inputs
        if (isNaN(height) || isNaN(surfaceArea)) {
          return res.status(400).json({
            error: "Высота и площадь должны быть числовыми значениями"
          });
        }

        const heightCoef = height > 0 ? height / 10 : 1;
        const cost = Math.round(baseRate * surfaceArea * heightCoef);
        validatedData.estimatedCost = cost.toString();
      }

      const calculation = await storage.createCalculation(validatedData);
      res.json(calculation);
    } catch (error: any) {
      res.status(400).json({ error: error.message });
    }
  });

  app.get("/api/calculations/:id", async (req, res) => {
    try {
      const calculation = await storage.getCalculation(req.params.id);
      if (!calculation) {
        return res.status(404).json({ error: "Calculation not found" });
      }
      res.json(calculation);
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  });

  app.get("/api/ai_seo", async (req, res) => {
    try {
      const slug = req.query.slug as string;
      const mode = req.query.mode as string; // 'content' (default) or 'related'

      // Mode: Get All FAQs
      if (mode === 'faqs') {
        const faqs = await getAllFAQs();
        return res.json(faqs);
      }

      // Mode: Get SEO Stats
      if (mode === 'stats') {
        const stats = await getSEOStats();
        return res.json(stats);
      }

      if (!slug) {
        return res.status(400).json({ error: "slug parameter is required" });
      }

      // Mode: Get Related Pages
      if (mode === 'related') {
        const limit = req.query.limit ? parseInt(req.query.limit as string) : 6;
        const related = await getRelatedPages(slug, limit);
        return res.json(related);
      }



      // Mode: Get Page Content (Default)
      // First, try to find in existing SEO data (fast path)
      const existingEntry = await getPageBySlug(slug);
      if (existingEntry) {
        return res.json(existingEntry);
      }

      // AI-fallback deprecated (2026-04-21): automatic page generation is turned off.
      // If page not found in existing data → 404. New pages are authored manually.
      return res.status(404).json({ error: "Page not found", slug });
    } catch (error: any) {
      console.error("SEO API Error:", error);
      res.status(500).json({ error: error.message });
    }
  });

  const httpServer = createServer(app);

  return httpServer;
}
