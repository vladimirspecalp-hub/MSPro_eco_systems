import type { Express } from "express";
import { z } from "zod";
import express from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { insertLeadSchema, insertCalculationSchema } from "@shared/schema";
import { generatePageContent } from "./services/ai_seo";
import { writeFileSync, readFileSync, existsSync, mkdirSync } from "fs";
import { resolve, join, extname } from "path";
import multer from "multer";
import seoApiRouter from "./routes/seo-api";
import geoApiRouter from "./routes/geo-api";
import aeoApiRouter from "./routes/aeo-api";
import uxApiRouter from "./routes/ux-api";
import healthApiRouter from "./routes/health-api";
import newsApiRouter from "./routes/news-api";
import { geoContextMiddleware } from "./middleware/geo-context";
import { notificationService } from "./services/notification";

export async function registerRoutes(app: Express): Promise<Server> {
  const publicDocsPath = resolve(import.meta.dirname, "..", "public", "documents");
  app.use("/documents", express.static(publicDocsPath));

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

  // Robots.txt
  app.get("/robots.txt", (req, res) => {
    res.type("text/plain");
    res.send(`User-agent: *\nAllow: /\nSitemap: https://mspro-ltd.ru/api/news/sitemap.xml`);
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
  app.post("/api/leads", upload.array("files", 10), async (req, res) => {
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
        await notificationService.sendLeadNotification(validatedData, filesForNotification);
        console.log("Notification sent successfully (pre-DB).");
      } catch (err) {
        console.error("Notification trigger failed:", err);
      }

      // 2. Try to save to DB (Secondary Path if DB is broken)
      let lead;
      try {
        console.log("Creating lead in storage...");
        lead = await storage.createLead(validatedData);
        console.log("Lead created in DB:", lead.id);
      } catch (dbError) {
        console.error("DB Save Failed (Ignored for Client):", dbError);
        // If DB fails, we still return success to the client because Notification was sent.
        // We return the original data with a temporary ID.
        lead = {
          ...validatedData,
          id: 'temp_' + Date.now(),
          createdAt: new Date()
        };
      }

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
      if (!slug) {
        return res.status(400).json({ error: "slug parameter is required" });
      }

      const keyword = slug.replace(/-/g, ' ');
      const content = await generatePageContent(keyword);

      const dynamicPath = resolve(process.cwd(), 'content', 'seo_dynamic.json');
      let dynamicData = [];

      try {
        const fileContent = readFileSync(dynamicPath, 'utf-8');
        dynamicData = JSON.parse(fileContent);
      } catch (e) {
        dynamicData = [];
      }

      const newEntry = {
        slug,
        title: content.title,
        description: content.description,
        h1: content.h1,
        h2: content.h2,
        keywords: content.keywords,
        cta: "Рассчитать стоимость",
        region: "Москва и область",
        faq: content.faq
      };

      const existingIndex = dynamicData.findIndex((e: any) => e.slug === slug);
      if (existingIndex >= 0) {
        dynamicData[existingIndex] = newEntry;
      } else {
        dynamicData.push(newEntry);
      }

      writeFileSync(dynamicPath, JSON.stringify(dynamicData, null, 2), 'utf-8');

      res.json(newEntry);
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  });

  const httpServer = createServer(app);

  return httpServer;
}
