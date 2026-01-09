import type { Express } from "express";
import { z } from "zod";
import express from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { insertLeadSchema, insertCalculationSchema } from "@shared/schema";
import { generatePageContent } from "./services/ai_seo";
import { writeFileSync, readFileSync } from "fs";
import { resolve, join } from "path";
import seoApiRouter from "./routes/seo-api";
import geoApiRouter from "./routes/geo-api";
import aeoApiRouter from "./routes/aeo-api";
import uxApiRouter from "./routes/ux-api";
import healthApiRouter from "./routes/health-api";
import newsApiRouter from "./routes/news-api";
import { geoContextMiddleware } from "./middleware/geo-context";

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

  // Lead routes
  app.post("/api/leads", async (req, res) => {
    try {
      const validatedData = insertLeadSchema.parse(req.body);
      const lead = await storage.createLead(validatedData);
      res.json(lead);
    } catch (error: any) {
      if (error instanceof z.ZodError) {
        console.error("Validation Error:", JSON.stringify(error.flatten(), null, 2));
      } else {
        console.error("Lead Error:", error);
      }
      res.status(400).json({ error: error.message });
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
