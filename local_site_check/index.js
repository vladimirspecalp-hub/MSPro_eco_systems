var __defProp = Object.defineProperty;
var __export = (target, all) => {
  for (var name in all)
    __defProp(target, name, { get: all[name], enumerable: true });
};

// server/index.ts
import "dotenv/config";
import express3 from "express";

// server/routes.ts
import { z as z7 } from "zod";
import express from "express";
import { createServer } from "http";

// shared/schema.ts
var schema_exports = {};
__export(schema_exports, {
  calculations: () => calculations,
  insertCalculationSchema: () => insertCalculationSchema,
  insertLeadSchema: () => insertLeadSchema,
  insertNewsArticleSchema: () => insertNewsArticleSchema,
  insertNewsOutboxSchema: () => insertNewsOutboxSchema,
  insertSettingsSchema: () => insertSettingsSchema,
  leads: () => leads,
  newsArticles: () => newsArticles,
  newsOutbox: () => newsOutbox,
  settings: () => settings
});
import { sql } from "drizzle-orm";
import { pgTable, text, varchar, timestamp, integer, decimal, jsonb, boolean } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";
var leads = pgTable("leads", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  name: text("name").notNull(),
  phone: text("phone").notNull(),
  email: text("email").notNull(),
  serviceType: text("service_type").notNull(),
  message: text("message"),
  source: text("source"),
  city: text("city"),
  systemType: text("system_type"),
  calculatedPrice: decimal("calculated_price"),
  details: jsonb("details"),
  status: text("status").default("new").notNull(),
  // new, in_progress, archive
  notes: text("notes"),
  tags: text("tags").array(),
  n8nSynced: boolean("n8n_synced").default(false),
  externalSupabaseSynced: boolean("external_supabase_synced").default(false),
  createdAt: timestamp("created_at").defaultNow().notNull()
});
var settings = pgTable("settings", {
  key: varchar("key").primaryKey(),
  value: text("value"),
  updatedAt: timestamp("updated_at").defaultNow().notNull()
});
var calculations = pgTable("calculations", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  serviceType: text("service_type").notNull(),
  height: decimal("height"),
  diameter: decimal("diameter"),
  surfaceArea: decimal("surface_area"),
  coatingType: text("coating_type"),
  estimatedCost: decimal("estimated_cost"),
  leadId: varchar("lead_id").references(() => leads.id),
  createdAt: timestamp("created_at").defaultNow().notNull()
});
var insertLeadSchema = createInsertSchema(leads).omit({
  id: true,
  createdAt: true,
  status: true,
  n8nSynced: true,
  externalSupabaseSynced: true
}).extend({
  phone: z.string().min(10, "\u0422\u0435\u043B\u0435\u0444\u043E\u043D \u0434\u043E\u043B\u0436\u0435\u043D \u0441\u043E\u0434\u0435\u0440\u0436\u0430\u0442\u044C \u043C\u0438\u043D\u0438\u043C\u0443\u043C 10 \u0446\u0438\u0444\u0440"),
  email: z.string().email("\u0412\u0432\u0435\u0434\u0438\u0442\u0435 \u043A\u043E\u0440\u0440\u0435\u043A\u0442\u043D\u044B\u0439 email").or(z.literal("")).default(""),
  name: z.string().min(2, "\u0418\u043C\u044F \u0434\u043E\u043B\u0436\u043D\u043E \u0441\u043E\u0434\u0435\u0440\u0436\u0430\u0442\u044C \u043C\u0438\u043D\u0438\u043C\u0443\u043C 2 \u0441\u0438\u043C\u0432\u043E\u043B\u0430"),
  message: z.string().optional(),
  city: z.string().optional(),
  systemType: z.string().optional(),
  calculatedPrice: z.number().or(z.string()).optional(),
  details: z.any().optional(),
  notes: z.string().optional(),
  tags: z.array(z.string()).optional(),
  serviceType: z.enum([
    "chimney-painting",
    "anti-corrosion",
    "high-altitude-works",
    "facade-repair",
    "mspro-quad",
    "other",
    // Fallback for legacy or unknown types
    ""
  ]).or(z.string())
});
var insertSettingsSchema = createInsertSchema(settings);
var insertCalculationSchema = createInsertSchema(calculations).omit({
  id: true,
  createdAt: true
}).extend({
  estimatedCost: z.string().optional()
});
var newsArticles = pgTable("news_articles", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  externalId: varchar("external_id", { length: 255 }).unique(),
  slug: varchar("slug", { length: 255 }).notNull().unique(),
  title: text("title").notNull(),
  excerpt: text("excerpt"),
  contentMarkdown: text("content_markdown"),
  contentHtml: text("content_html"),
  content: text("content").notNull(),
  coverImage: text("cover_image"),
  author: varchar("author", { length: 255 }).default("MSPRO"),
  category: varchar("category", { length: 100 }),
  tags: text("tags").array(),
  geoRegionCode: varchar("geo_region_code", { length: 50 }),
  geoCity: varchar("geo_city", { length: 255 }),
  status: varchar("status", { length: 50 }).default("draft").notNull(),
  publishedAt: timestamp("published_at"),
  canonicalUrl: text("canonical_url"),
  metaTitle: text("meta_title"),
  metaDescription: text("meta_description"),
  metaKeywords: text("meta_keywords").array(),
  ogImage: text("og_image"),
  jsonLd: text("json_ld"),
  aeoAnswerBlock: text("aeo_answer_block"),
  aeoFaq: text("aeo_faq"),
  sourceType: varchar("source_type", { length: 100 }),
  sourceRef: varchar("source_ref", { length: 255 }),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull()
});
var newsOutbox = pgTable("news_outbox", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  articleId: varchar("article_id").references(() => newsArticles.id).notNull(),
  platform: varchar("platform", { length: 100 }).notNull(),
  status: varchar("status", { length: 50 }).default("queued").notNull(),
  payload: text("payload"),
  externalId: varchar("external_id", { length: 255 }),
  externalUrl: text("external_url"),
  backlinkUrl: text("backlink_url"),
  errorMessage: text("error_message"),
  attempts: integer("attempts").default(0),
  scheduledAt: timestamp("scheduled_at"),
  postedAt: timestamp("posted_at"),
  processedAt: timestamp("processed_at"),
  createdAt: timestamp("created_at").defaultNow().notNull()
});
var insertNewsArticleSchema = createInsertSchema(newsArticles).omit({
  id: true,
  createdAt: true,
  updatedAt: true
}).extend({
  title: z.string().min(5, "\u0417\u0430\u0433\u043E\u043B\u043E\u0432\u043E\u043A \u043C\u0438\u043D\u0438\u043C\u0443\u043C 5 \u0441\u0438\u043C\u0432\u043E\u043B\u043E\u0432"),
  content: z.string().min(50, "\u041A\u043E\u043D\u0442\u0435\u043D\u0442 \u043C\u0438\u043D\u0438\u043C\u0443\u043C 50 \u0441\u0438\u043C\u0432\u043E\u043B\u043E\u0432"),
  slug: z.string().regex(/^[a-z0-9-]+$/, "Slug \u0442\u043E\u043B\u044C\u043A\u043E \u043B\u0430\u0442\u0438\u043D\u0438\u0446\u0430, \u0446\u0438\u0444\u0440\u044B \u0438 \u0434\u0435\u0444\u0438\u0441\u044B")
});
var insertNewsOutboxSchema = createInsertSchema(newsOutbox).omit({
  id: true,
  createdAt: true
});

// server/db.ts
import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";
var connectionString = process.env.DATABASE_URL;
if (!connectionString) {
  throw new Error("DATABASE_URL environment variable is required");
}
var client = postgres(connectionString, {
  max: 10
});
var db = drizzle(client, { schema: schema_exports });

// server/storage.ts
import { eq, desc } from "drizzle-orm";
var DatabaseStorage = class {
  async createLead(insertLead) {
    const [lead] = await db.insert(leads).values(insertLead).returning();
    return lead;
  }
  async getLead(id) {
    const [lead] = await db.select().from(leads).where(eq(leads.id, id));
    return lead;
  }
  async getAllLeads() {
    return await db.select().from(leads).orderBy(desc(leads.createdAt));
  }
  async updateLead(id, data) {
    const [updated] = await db.update(leads).set(data).where(eq(leads.id, id)).returning();
    return updated;
  }
  async deleteLead(id) {
    await db.delete(leads).where(eq(leads.id, id));
    return true;
  }
  async getSettings(key) {
    const [setting] = await db.select().from(settings).where(eq(settings.key, key));
    return setting;
  }
  async updateSetting(key, value) {
    const [setting] = await db.insert(settings).values({ key, value }).onConflictDoUpdate({ target: settings.key, set: { value, updatedAt: /* @__PURE__ */ new Date() } }).returning();
    return setting;
  }
  async createCalculation(insertCalculation) {
    const [calculation] = await db.insert(calculations).values(insertCalculation).returning();
    return calculation;
  }
  async getCalculation(id) {
    const [calculation] = await db.select().from(calculations).where(eq(calculations.id, id));
    return calculation;
  }
  async getAllCalculations() {
    return await db.select().from(calculations);
  }
  // News Articles CRUD
  async createNewsArticle(article) {
    const [created] = await db.insert(newsArticles).values(article).returning();
    return created;
  }
  async getNewsArticle(id) {
    const [article] = await db.select().from(newsArticles).where(eq(newsArticles.id, id));
    return article;
  }
  async getNewsArticleBySlug(slug) {
    const [article] = await db.select().from(newsArticles).where(eq(newsArticles.slug, slug));
    return article;
  }
  async getAllNewsArticles(status) {
    if (status) {
      return await db.select().from(newsArticles).where(eq(newsArticles.status, status)).orderBy(desc(newsArticles.publishedAt));
    }
    return await db.select().from(newsArticles).orderBy(desc(newsArticles.createdAt));
  }
  async updateNewsArticle(id, data) {
    const [updated] = await db.update(newsArticles).set({ ...data, updatedAt: /* @__PURE__ */ new Date() }).where(eq(newsArticles.id, id)).returning();
    return updated;
  }
  async deleteNewsArticle(id) {
    const result = await db.delete(newsArticles).where(eq(newsArticles.id, id));
    return true;
  }
  // News Outbox CRUD
  async createOutboxEntry(entry) {
    const [created] = await db.insert(newsOutbox).values(entry).returning();
    return created;
  }
  async getOutboxEntry(id) {
    const [entry] = await db.select().from(newsOutbox).where(eq(newsOutbox.id, id));
    return entry;
  }
  async getOutboxByArticle(articleId) {
    return await db.select().from(newsOutbox).where(eq(newsOutbox.articleId, articleId));
  }
  async getPendingOutbox() {
    return await db.select().from(newsOutbox).where(eq(newsOutbox.status, "pending")).orderBy(newsOutbox.scheduledAt);
  }
  async updateOutboxEntry(id, data) {
    const [updated] = await db.update(newsOutbox).set(data).where(eq(newsOutbox.id, id)).returning();
    return updated;
  }
};
var storage = new DatabaseStorage();

// server/services/ai_seo.ts
import OpenAI from "openai";
var openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY
});
async function generatePageContent(keyword, region = "\u041C\u043E\u0441\u043A\u0432\u0430 \u0438 \u043E\u0431\u043B\u0430\u0441\u0442\u044C") {
  try {
    const prompt = `
\u0422\u044B \u2014 \u044D\u043A\u0441\u043F\u0435\u0440\u0442 \u043F\u043E SEO-\u043A\u043E\u043D\u0442\u0435\u043D\u0442\u0443 \u0434\u043B\u044F B2B \u0443\u0441\u043B\u0443\u0433 \u043F\u0440\u043E\u043C\u044B\u0448\u043B\u0435\u043D\u043D\u043E\u0433\u043E \u0430\u043B\u044C\u043F\u0438\u043D\u0438\u0437\u043C\u0430 \u0438 \u043F\u043E\u043A\u0440\u0430\u0441\u043A\u0438 \u0442\u0440\u0443\u0431.

\u0421\u043E\u0437\u0434\u0430\u0439 SEO-\u043E\u043F\u0442\u0438\u043C\u0438\u0437\u0438\u0440\u043E\u0432\u0430\u043D\u043D\u044B\u0439 \u043A\u043E\u043D\u0442\u0435\u043D\u0442 \u0434\u043B\u044F \u0441\u0442\u0440\u0430\u043D\u0438\u0446\u044B \u0443\u0441\u043B\u0443\u0433\u0438: "${keyword}"
\u0420\u0435\u0433\u0438\u043E\u043D: ${region}

\u041A\u043E\u043C\u043F\u0430\u043D\u0438\u044F MS-PRO \u0441\u043F\u0435\u0446\u0438\u0430\u043B\u0438\u0437\u0438\u0440\u0443\u0435\u0442\u0441\u044F \u043D\u0430:
- \u041F\u0440\u043E\u043C\u044B\u0448\u043B\u0435\u043D\u043D\u043E\u043C \u0430\u043B\u044C\u043F\u0438\u043D\u0438\u0437\u043C\u0435
- \u041F\u043E\u043A\u0440\u0430\u0441\u043A\u0435 \u0438 \u0430\u043D\u0442\u0438\u043A\u043E\u0440\u0440\u043E\u0437\u0438\u0439\u043D\u043E\u0439 \u0437\u0430\u0449\u0438\u0442\u0435 \u0442\u0440\u0443\u0431
- \u041F\u043E\u043A\u0440\u044B\u0442\u0438\u0438 MSPRO Quad \u0441 \u0433\u0430\u0440\u0430\u043D\u0442\u0438\u0435\u0439 20 \u043B\u0435\u0442

\u0412\u0435\u0440\u043D\u0438 JSON-\u043E\u0431\u044A\u0435\u043A\u0442 \u0441\u043E \u0441\u043B\u0435\u0434\u0443\u044E\u0449\u0438\u043C\u0438 \u043F\u043E\u043B\u044F\u043C\u0438:
{
  "title": "SEO-\u043E\u043F\u0442\u0438\u043C\u0438\u0437\u0438\u0440\u043E\u0432\u0430\u043D\u043D\u044B\u0439 \u0437\u0430\u0433\u043E\u043B\u043E\u0432\u043E\u043A \u0441\u0442\u0440\u0430\u043D\u0438\u0446\u044B (\u0434\u043E 60 \u0441\u0438\u043C\u0432\u043E\u043B\u043E\u0432)",
  "description": "Meta description (\u0434\u043E 160 \u0441\u0438\u043C\u0432\u043E\u043B\u043E\u0432)",
  "h1": "\u0413\u043B\u0430\u0432\u043D\u044B\u0439 \u0437\u0430\u0433\u043E\u043B\u043E\u0432\u043E\u043A H1 \u0441 \u043A\u043B\u044E\u0447\u0435\u0432\u044B\u043C \u0441\u043B\u043E\u0432\u043E\u043C",
  "h2": "\u041F\u043E\u0434\u0437\u0430\u0433\u043E\u043B\u043E\u0432\u043E\u043A H2 \u0434\u043B\u044F \u0434\u043E\u043F\u043E\u043B\u043D\u0438\u0442\u0435\u043B\u044C\u043D\u043E\u0433\u043E \u043A\u043E\u043D\u0442\u0435\u043A\u0441\u0442\u0430",
  "keywords": ["\u043A\u043B\u044E\u0447\u0435\u0432\u043E\u0435 \u0441\u043B\u043E\u0432\u043E 1", "\u043A\u043B\u044E\u0447\u0435\u0432\u043E\u0435 \u0441\u043B\u043E\u0432\u043E 2", "\u043A\u043B\u044E\u0447\u0435\u0432\u043E\u0435 \u0441\u043B\u043E\u0432\u043E 3", "\u043A\u043B\u044E\u0447\u0435\u0432\u043E\u0435 \u0441\u043B\u043E\u0432\u043E 4"],
  "faq": [
    {
      "question": "\u0412\u043E\u043F\u0440\u043E\u0441 1 \u0441 \u043A\u043B\u044E\u0447\u0435\u0432\u044B\u043C \u0441\u043B\u043E\u0432\u043E\u043C",
      "answer": "\u041F\u043E\u0434\u0440\u043E\u0431\u043D\u044B\u0439 \u043E\u0442\u0432\u0435\u0442 1 (2-3 \u043F\u0440\u0435\u0434\u043B\u043E\u0436\u0435\u043D\u0438\u044F)"
    },
    {
      "question": "\u0412\u043E\u043F\u0440\u043E\u0441 2 \u043E \u0441\u0442\u043E\u0438\u043C\u043E\u0441\u0442\u0438/\u0441\u0440\u043E\u043A\u0430\u0445",
      "answer": "\u041F\u043E\u0434\u0440\u043E\u0431\u043D\u044B\u0439 \u043E\u0442\u0432\u0435\u0442 2 (2-3 \u043F\u0440\u0435\u0434\u043B\u043E\u0436\u0435\u043D\u0438\u044F)"
    },
    {
      "question": "\u0412\u043E\u043F\u0440\u043E\u0441 3 \u043E \u0433\u0430\u0440\u0430\u043D\u0442\u0438\u044F\u0445/\u0440\u0435\u0433\u0438\u043E\u043D\u0430\u0445",
      "answer": "\u041F\u043E\u0434\u0440\u043E\u0431\u043D\u044B\u0439 \u043E\u0442\u0432\u0435\u0442 3 (2-3 \u043F\u0440\u0435\u0434\u043B\u043E\u0436\u0435\u043D\u0438\u044F)"
    }
  ]
}

\u0422\u0440\u0435\u0431\u043E\u0432\u0430\u043D\u0438\u044F:
- \u0418\u0441\u043F\u043E\u043B\u044C\u0437\u0443\u0439 \u043F\u0440\u043E\u0444\u0435\u0441\u0441\u0438\u043E\u043D\u0430\u043B\u044C\u043D\u044B\u0439 B2B \u0442\u043E\u043D
- \u0423\u043F\u043E\u043C\u0438\u043D\u0430\u0439 MSPRO Quad \u0438 \u0433\u0430\u0440\u0430\u043D\u0442\u0438\u044E 20 \u043B\u0435\u0442
- \u0415\u0441\u0442\u0435\u0441\u0442\u0432\u0435\u043D\u043D\u043E \u0438\u043D\u0442\u0435\u0433\u0440\u0438\u0440\u0443\u0439 \u043A\u043B\u044E\u0447\u0435\u0432\u044B\u0435 \u0441\u043B\u043E\u0432\u0430
- FAQ \u0434\u043E\u043B\u0436\u0435\u043D \u043E\u0442\u0432\u0435\u0447\u0430\u0442\u044C \u043D\u0430 \u0440\u0435\u0430\u043B\u044C\u043D\u044B\u0435 \u0432\u043E\u043F\u0440\u043E\u0441\u044B \u043A\u043B\u0438\u0435\u043D\u0442\u043E\u0432
`;
    const response = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [
        {
          role: "system",
          content: "\u0422\u044B \u2014 \u044D\u043A\u0441\u043F\u0435\u0440\u0442 \u043F\u043E SEO-\u043A\u043E\u043D\u0442\u0435\u043D\u0442\u0443 \u0434\u043B\u044F \u043F\u0440\u043E\u043C\u044B\u0448\u043B\u0435\u043D\u043D\u044B\u0445 B2B \u0443\u0441\u043B\u0443\u0433. \u0412\u0441\u0435\u0433\u0434\u0430 \u0432\u043E\u0437\u0432\u0440\u0430\u0449\u0430\u0439 \u0432\u0430\u043B\u0438\u0434\u043D\u044B\u0439 JSON \u0431\u0435\u0437 \u0434\u043E\u043F\u043E\u043B\u043D\u0438\u0442\u0435\u043B\u044C\u043D\u043E\u0433\u043E \u0442\u0435\u043A\u0441\u0442\u0430."
        },
        {
          role: "user",
          content: prompt
        }
      ],
      temperature: 0.7,
      response_format: { type: "json_object" }
    });
    const content = response.choices[0]?.message?.content;
    if (!content) {
      throw new Error("OpenAI \u043D\u0435 \u0432\u0435\u0440\u043D\u0443\u043B \u043A\u043E\u043D\u0442\u0435\u043D\u0442");
    }
    const parsedContent = JSON.parse(content);
    return parsedContent;
  } catch (error) {
    console.error("\u041E\u0448\u0438\u0431\u043A\u0430 \u0433\u0435\u043D\u0435\u0440\u0430\u0446\u0438\u0438 AI \u043A\u043E\u043D\u0442\u0435\u043D\u0442\u0430:", error);
    return {
      title: `${keyword} \u2014 MS-PRO \u043F\u0440\u043E\u043C\u044B\u0448\u043B\u0435\u043D\u043D\u044B\u0439 \u0430\u043B\u044C\u043F\u0438\u043D\u0438\u0437\u043C`,
      description: `\u041F\u0440\u043E\u0444\u0435\u0441\u0441\u0438\u043E\u043D\u0430\u043B\u044C\u043D\u044B\u0435 \u0443\u0441\u043B\u0443\u0433\u0438 ${keyword} \u0432 \u0440\u0435\u0433\u0438\u043E\u043D\u0435 ${region}. \u0410\u043D\u0442\u0438\u043A\u043E\u0440\u0440\u043E\u0437\u0438\u0439\u043D\u043E\u0435 \u043F\u043E\u043A\u0440\u044B\u0442\u0438\u0435 MSPRO Quad \u0441 \u0433\u0430\u0440\u0430\u043D\u0442\u0438\u0435\u0439 20 \u043B\u0435\u0442.`,
      h1: keyword,
      h2: "\u041F\u0440\u043E\u0444\u0435\u0441\u0441\u0438\u043E\u043D\u0430\u043B\u044C\u043D\u044B\u0435 \u0443\u0441\u043B\u0443\u0433\u0438 \u043F\u0440\u043E\u043C\u044B\u0448\u043B\u0435\u043D\u043D\u043E\u0433\u043E \u0430\u043B\u044C\u043F\u0438\u043D\u0438\u0437\u043C\u0430",
      keywords: ["\u043F\u0440\u043E\u043C\u044B\u0448\u043B\u0435\u043D\u043D\u044B\u0439 \u0430\u043B\u044C\u043F\u0438\u043D\u0438\u0437\u043C", keyword, "\u0430\u043D\u0442\u0438\u043A\u043E\u0440\u0440\u043E\u0437\u0438\u0439\u043D\u0430\u044F \u0437\u0430\u0449\u0438\u0442\u0430", "MSPRO Quad"],
      faq: [
        {
          question: `\u041A\u0430\u043A \u0437\u0430\u043A\u0430\u0437\u0430\u0442\u044C ${keyword} \u0432 ${region}?`,
          answer: "\u041E\u0441\u0442\u0430\u0432\u044C\u0442\u0435 \u0437\u0430\u044F\u0432\u043A\u0443 \u043D\u0430 \u0441\u0430\u0439\u0442\u0435 \u0438\u043B\u0438 \u043F\u043E\u0437\u0432\u043E\u043D\u0438\u0442\u0435 \u043D\u0430\u043C. \u041C\u044B \u0440\u0430\u0441\u0441\u0447\u0438\u0442\u0430\u0435\u043C \u0441\u0442\u043E\u0438\u043C\u043E\u0441\u0442\u044C \u0438 \u0441\u043E\u0433\u043B\u0430\u0441\u0443\u0435\u043C \u0441\u0440\u043E\u043A\u0438 \u0432\u044B\u043F\u043E\u043B\u043D\u0435\u043D\u0438\u044F \u0440\u0430\u0431\u043E\u0442."
        },
        {
          question: `\u0421\u043A\u043E\u043B\u044C\u043A\u043E \u0441\u0442\u043E\u0438\u0442 ${keyword}?`,
          answer: "\u0421\u0442\u043E\u0438\u043C\u043E\u0441\u0442\u044C \u0440\u0430\u0441\u0441\u0447\u0438\u0442\u044B\u0432\u0430\u0435\u0442\u0441\u044F \u0438\u043D\u0434\u0438\u0432\u0438\u0434\u0443\u0430\u043B\u044C\u043D\u043E \u0432 \u0437\u0430\u0432\u0438\u0441\u0438\u043C\u043E\u0441\u0442\u0438 \u043E\u0442 \u043E\u0431\u044A\u0435\u043C\u0430 \u0440\u0430\u0431\u043E\u0442, \u0432\u044B\u0441\u043E\u0442\u044B \u043E\u0431\u044A\u0435\u043A\u0442\u0430 \u0438 \u0441\u043B\u043E\u0436\u043D\u043E\u0441\u0442\u0438 \u0434\u043E\u0441\u0442\u0443\u043F\u0430."
        },
        {
          question: "\u041A\u0430\u043A\u0438\u0435 \u0433\u0430\u0440\u0430\u043D\u0442\u0438\u0438 \u043F\u0440\u0435\u0434\u043E\u0441\u0442\u0430\u0432\u043B\u044F\u044E\u0442\u0441\u044F?",
          answer: "\u041C\u044B \u043F\u0440\u0435\u0434\u043E\u0441\u0442\u0430\u0432\u043B\u044F\u0435\u043C \u043E\u0444\u0438\u0446\u0438\u0430\u043B\u044C\u043D\u0443\u044E \u0433\u0430\u0440\u0430\u043D\u0442\u0438\u044E \u0434\u043E 20 \u043B\u0435\u0442 \u043D\u0430 \u0430\u043D\u0442\u0438\u043A\u043E\u0440\u0440\u043E\u0437\u0438\u0439\u043D\u043E\u0435 \u043F\u043E\u043A\u0440\u044B\u0442\u0438\u0435 MSPRO Quad \u0438 \u0434\u043E 5 \u043B\u0435\u0442 \u043D\u0430 \u0432\u044B\u043F\u043E\u043B\u043D\u0435\u043D\u043D\u044B\u0435 \u0440\u0430\u0431\u043E\u0442\u044B."
        }
      ]
    };
  }
}

// server/routes.ts
import { writeFileSync as writeFileSync3, readFileSync as readFileSync4 } from "fs";
import { resolve as resolve4 } from "path";

// server/routes/seo-api.ts
import { Router } from "express";

// server/services/seo-service.ts
import { readFileSync } from "fs";
import { resolve } from "path";
var seoCache = null;
var seoMap = null;
var cacheTimestamp = 0;
var CACHE_TTL = 5 * 60 * 1e3;
function loadAllSEOData() {
  const now = Date.now();
  if (seoCache && now - cacheTimestamp < CACHE_TTL) {
    return seoCache;
  }
  const contentDir = resolve(process.cwd(), "content");
  const files = [
    "seo_core.json",
    "seo_core_part2.json",
    "seo_core_part3.json",
    "seo_core_part4.json",
    "seo_core_part5.json",
    "seo_dynamic.json"
  ];
  const allData = [];
  for (const file of files) {
    try {
      const filePath = resolve(contentDir, file);
      const content = readFileSync(filePath, "utf-8");
      const entries = JSON.parse(content);
      allData.push(...entries);
    } catch (error) {
      console.warn(`[SEO Service] Could not load ${file}:`, error);
    }
  }
  seoCache = allData;
  seoMap = new Map(allData.map((e) => [e.slug, e]));
  cacheTimestamp = now;
  return allData;
}
function invalidateSEOCache() {
  seoCache = null;
  seoMap = null;
  cacheTimestamp = 0;
}
function getPages(page = 1, limit = 20, region) {
  let data = loadAllSEOData();
  if (region) {
    data = data.filter((e) => e.region?.toLowerCase().includes(region.toLowerCase()));
  }
  const total = data.length;
  const totalPages = Math.ceil(total / limit);
  const offset = (page - 1) * limit;
  const pageData = data.slice(offset, offset + limit);
  return {
    data: pageData,
    total,
    page,
    limit,
    totalPages
  };
}
function getPageBySlug(slug) {
  loadAllSEOData();
  return seoMap?.get(slug) || null;
}
function searchPages(query, limit = 20) {
  const data = loadAllSEOData();
  const queryLower = query.toLowerCase();
  const results = data.filter((entry) => {
    const titleMatch = entry.title.toLowerCase().includes(queryLower);
    const descMatch = entry.description.toLowerCase().includes(queryLower);
    const keywordsMatch = entry.keywords?.some((k) => k.toLowerCase().includes(queryLower));
    const h1Match = entry.h1?.toLowerCase().includes(queryLower);
    return titleMatch || descMatch || keywordsMatch || h1Match;
  });
  return results.slice(0, limit);
}
function getSEOStats() {
  const data = loadAllSEOData();
  const regions = /* @__PURE__ */ new Set();
  let pagesWithFAQ = 0;
  let pagesWithKeywords = 0;
  for (const entry of data) {
    if (entry.region) regions.add(entry.region);
    if (entry.faq && entry.faq.length > 0) pagesWithFAQ++;
    if (entry.keywords && entry.keywords.length > 0) pagesWithKeywords++;
  }
  return {
    totalPages: data.length,
    pagesWithFAQ,
    pagesWithKeywords,
    regionsCovered: Array.from(regions)
  };
}
function getRelatedPages(slug, limit = 6) {
  const data = loadAllSEOData();
  const current = getPageBySlug(slug);
  if (!current || !current.keywords || current.keywords.length === 0) {
    return [];
  }
  const currentKeywords = new Set(current.keywords);
  const related = data.filter((entry) => entry.slug !== slug && entry.keywords).map((entry) => {
    const matchCount = entry.keywords.filter((k) => currentKeywords.has(k)).length;
    return { entry, matchCount };
  }).filter((item) => item.matchCount > 0).sort((a, b) => b.matchCount - a.matchCount).slice(0, limit).map((item) => item.entry);
  return related;
}

// server/routes/seo-api.ts
var router = Router();
router.get("/pages", (req, res) => {
  try {
    const page = Math.max(1, parseInt(req.query.page) || 1);
    const limit = Math.min(100, Math.max(1, parseInt(req.query.limit) || 20));
    const region = req.query.region;
    const result = getPages(page, limit, region);
    res.json(result);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});
router.get("/page/:slug", (req, res) => {
  try {
    const { slug } = req.params;
    const entry = getPageBySlug(slug);
    if (!entry) {
      return res.status(404).json({
        error: "Page not found",
        slug
      });
    }
    res.json(entry);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});
router.get("/search", (req, res) => {
  try {
    const query = req.query.q;
    if (!query || query.trim().length === 0) {
      return res.status(400).json({
        error: 'Query parameter "q" is required'
      });
    }
    const limit = Math.min(100, Math.max(1, parseInt(req.query.limit) || 20));
    const results = searchPages(query.trim(), limit);
    res.json({
      query,
      count: results.length,
      results
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});
router.get("/stats", (req, res) => {
  try {
    const stats = getSEOStats();
    res.json(stats);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});
router.get("/related/:slug", (req, res) => {
  try {
    const { slug } = req.params;
    const limit = Math.min(20, Math.max(1, parseInt(req.query.limit) || 6));
    const related = getRelatedPages(slug, limit);
    res.json({
      slug,
      count: related.length,
      related
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});
router.post("/cache/invalidate", (req, res) => {
  try {
    invalidateSEOCache();
    res.json({ success: true, message: "SEO cache invalidated" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});
var seo_api_default = router;

// server/routes/geo-api.ts
import { Router as Router2 } from "express";

// shared/data/geo-data.ts
var PRIORITY_REGIONS = [
  { name: "\u041C\u043E\u0441\u043A\u0432\u0430", slug: "moskva", population: 126e5, industrialIndex: 95, priority: "high" },
  { name: "\u0421\u0430\u043D\u043A\u0442-\u041F\u0435\u0442\u0435\u0440\u0431\u0443\u0440\u0433", slug: "spb", population: 54e5, industrialIndex: 85, priority: "high" },
  { name: "\u0415\u043A\u0430\u0442\u0435\u0440\u0438\u043D\u0431\u0443\u0440\u0433", slug: "ekaterinburg", population: 15e5, industrialIndex: 80, priority: "high" },
  { name: "\u041D\u043E\u0432\u043E\u0441\u0438\u0431\u0438\u0440\u0441\u043A", slug: "novosibirsk", population: 16e5, industrialIndex: 75, priority: "high" },
  { name: "\u041A\u0430\u0437\u0430\u043D\u044C", slug: "kazan", population: 13e5, industrialIndex: 78, priority: "high" },
  { name: "\u0427\u0435\u043B\u044F\u0431\u0438\u043D\u0441\u043A", slug: "chelyabinsk", population: 12e5, industrialIndex: 88, priority: "high" },
  { name: "\u0421\u0430\u043C\u0430\u0440\u0430", slug: "samara", population: 115e4, industrialIndex: 72, priority: "medium" },
  { name: "\u041D\u0438\u0436\u043D\u0438\u0439 \u041D\u043E\u0432\u0433\u043E\u0440\u043E\u0434", slug: "nn", population: 125e4, industrialIndex: 70, priority: "medium" },
  { name: "\u041A\u0440\u0430\u0441\u043D\u043E\u044F\u0440\u0441\u043A", slug: "krasnoyarsk", population: 11e5, industrialIndex: 82, priority: "medium" },
  { name: "\u041E\u043C\u0441\u043A", slug: "omsk", population: 115e4, industrialIndex: 76, priority: "medium" }
];

// server/middleware/geo-context.ts
var GEO_REGIONS = {
  msk: {
    code: "msk",
    name: "\u041C\u043E\u0441\u043A\u0432\u0430",
    nameGenitive: "\u041C\u043E\u0441\u043A\u0432\u0435",
    timezone: "Europe/Moscow",
    priority: "high"
  },
  moscow: {
    code: "msk",
    name: "\u041C\u043E\u0441\u043A\u0432\u0430",
    nameGenitive: "\u041C\u043E\u0441\u043A\u0432\u0435",
    timezone: "Europe/Moscow",
    priority: "high"
  },
  spb: {
    code: "spb",
    name: "\u0421\u0430\u043D\u043A\u0442-\u041F\u0435\u0442\u0435\u0440\u0431\u0443\u0440\u0433",
    nameGenitive: "\u0421\u0430\u043D\u043A\u0442-\u041F\u0435\u0442\u0435\u0440\u0431\u0443\u0440\u0433\u0435",
    timezone: "Europe/Moscow",
    priority: "high"
  },
  ekb: {
    code: "ekb",
    name: "\u0415\u043A\u0430\u0442\u0435\u0440\u0438\u043D\u0431\u0443\u0440\u0433",
    nameGenitive: "\u0415\u043A\u0430\u0442\u0435\u0440\u0438\u043D\u0431\u0443\u0440\u0433\u0435",
    timezone: "Asia/Yekaterinburg",
    priority: "high"
  },
  nsk: {
    code: "nsk",
    name: "\u041D\u043E\u0432\u043E\u0441\u0438\u0431\u0438\u0440\u0441\u043A",
    nameGenitive: "\u041D\u043E\u0432\u043E\u0441\u0438\u0431\u0438\u0440\u0441\u043A\u0435",
    timezone: "Asia/Novosibirsk",
    priority: "high"
  },
  kazan: {
    code: "kazan",
    name: "\u041A\u0430\u0437\u0430\u043D\u044C",
    nameGenitive: "\u041A\u0430\u0437\u0430\u043D\u0438",
    timezone: "Europe/Moscow",
    priority: "high"
  },
  chelyabinsk: {
    code: "chelyabinsk",
    name: "\u0427\u0435\u043B\u044F\u0431\u0438\u043D\u0441\u043A",
    nameGenitive: "\u0427\u0435\u043B\u044F\u0431\u0438\u043D\u0441\u043A\u0435",
    timezone: "Asia/Yekaterinburg",
    priority: "high"
  },
  samara: {
    code: "samara",
    name: "\u0421\u0430\u043C\u0430\u0440\u0430",
    nameGenitive: "\u0421\u0430\u043C\u0430\u0440\u0435",
    timezone: "Europe/Samara",
    priority: "medium"
  },
  nn: {
    code: "nn",
    name: "\u041D\u0438\u0436\u043D\u0438\u0439 \u041D\u043E\u0432\u0433\u043E\u0440\u043E\u0434",
    nameGenitive: "\u041D\u0438\u0436\u043D\u0435\u043C \u041D\u043E\u0432\u0433\u043E\u0440\u043E\u0434\u0435",
    timezone: "Europe/Moscow",
    priority: "medium"
  },
  krasnodar: {
    code: "krasnodar",
    name: "\u041A\u0440\u0430\u0441\u043D\u043E\u0434\u0430\u0440",
    nameGenitive: "\u041A\u0440\u0430\u0441\u043D\u043E\u0434\u0430\u0440\u0435",
    timezone: "Europe/Moscow",
    priority: "medium"
  },
  rostov: {
    code: "rostov",
    name: "\u0420\u043E\u0441\u0442\u043E\u0432-\u043D\u0430-\u0414\u043E\u043D\u0443",
    nameGenitive: "\u0420\u043E\u0441\u0442\u043E\u0432\u0435-\u043D\u0430-\u0414\u043E\u043D\u0443",
    timezone: "Europe/Moscow",
    priority: "medium"
  },
  ufa: {
    code: "ufa",
    name: "\u0423\u0444\u0430",
    nameGenitive: "\u0423\u0444\u0435",
    timezone: "Asia/Yekaterinburg",
    priority: "medium"
  },
  perm: {
    code: "perm",
    name: "\u041F\u0435\u0440\u043C\u044C",
    nameGenitive: "\u041F\u0435\u0440\u043C\u0438",
    timezone: "Asia/Yekaterinburg",
    priority: "medium"
  },
  voronezh: {
    code: "voronezh",
    name: "\u0412\u043E\u0440\u043E\u043D\u0435\u0436",
    nameGenitive: "\u0412\u043E\u0440\u043E\u043D\u0435\u0436\u0435",
    timezone: "Europe/Moscow",
    priority: "medium"
  },
  krasnoyarsk: {
    code: "krasnoyarsk",
    name: "\u041A\u0440\u0430\u0441\u043D\u043E\u044F\u0440\u0441\u043A",
    nameGenitive: "\u041A\u0440\u0430\u0441\u043D\u043E\u044F\u0440\u0441\u043A\u0435",
    timezone: "Asia/Krasnoyarsk",
    priority: "medium"
  },
  omsk: {
    code: "omsk",
    name: "\u041E\u043C\u0441\u043A",
    nameGenitive: "\u041E\u043C\u0441\u043A\u0435",
    timezone: "Asia/Omsk",
    priority: "medium"
  },
  tyumen: {
    code: "tyumen",
    name: "\u0422\u044E\u043C\u0435\u043D\u044C",
    nameGenitive: "\u0422\u044E\u043C\u0435\u043D\u0438",
    timezone: "Asia/Yekaterinburg",
    priority: "medium"
  },
  volgograd: {
    code: "volgograd",
    name: "\u0412\u043E\u043B\u0433\u043E\u0433\u0440\u0430\u0434",
    nameGenitive: "\u0412\u043E\u043B\u0433\u043E\u0433\u0440\u0430\u0434\u0435",
    timezone: "Europe/Volgograd",
    priority: "low"
  }
};
var DEFAULT_REGION = GEO_REGIONS.msk;
function extractSubdomain(host) {
  if (!host) return null;
  const cleanHost = host.split(":")[0];
  const parts = cleanHost.split(".");
  if (parts.length >= 3 && parts[0] !== "www") {
    return parts[0].toLowerCase();
  }
  return null;
}
function resolveGeoContext(req) {
  const queryRegion = req.query.region;
  if (queryRegion) {
    const region = GEO_REGIONS[queryRegion.toLowerCase()];
    if (region) {
      return { region, source: "query", rawValue: queryRegion };
    }
    const priorityRegion = PRIORITY_REGIONS.find((r) => r.slug === queryRegion.toLowerCase());
    if (priorityRegion) {
      const serverRegion = Object.values(GEO_REGIONS).find((r) => r.name === priorityRegion.name);
      if (serverRegion) {
        return { region: serverRegion, source: "query", rawValue: queryRegion };
      }
    }
  }
  const headerRegion = req.headers["x-geo-region"];
  if (headerRegion) {
    const region = GEO_REGIONS[headerRegion.toLowerCase()];
    if (region) {
      return { region, source: "header", rawValue: headerRegion };
    }
  }
  const subdomain = extractSubdomain(req.headers.host);
  if (subdomain) {
    const region = GEO_REGIONS[subdomain];
    if (region) {
      return { region, source: "subdomain", rawValue: subdomain };
    }
  }
  return { region: DEFAULT_REGION, source: "default", rawValue: null };
}
function geoContextMiddleware(req, res, next) {
  req.geoContext = resolveGeoContext(req);
  next();
}
function getAllRegions() {
  const uniqueRegions = /* @__PURE__ */ new Map();
  for (const region of Object.values(GEO_REGIONS)) {
    if (!uniqueRegions.has(region.code)) {
      uniqueRegions.set(region.code, region);
    }
  }
  return Array.from(uniqueRegions.values());
}
function getRegionByCode(code) {
  return GEO_REGIONS[code.toLowerCase()] || DEFAULT_REGION;
}

// server/routes/geo-api.ts
var router2 = Router2();
router2.get("/context", (req, res) => {
  try {
    const context = resolveGeoContext(req);
    res.json({
      region: context.region,
      source: context.source,
      rawValue: context.rawValue,
      timestamp: (/* @__PURE__ */ new Date()).toISOString()
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});
router2.get("/regions", (req, res) => {
  try {
    let regions = getAllRegions();
    const priority = req.query.priority;
    if (priority) {
      regions = regions.filter((r) => r.priority === priority);
    }
    res.json({
      count: regions.length,
      regions
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});
router2.get("/region/:code", (req, res) => {
  try {
    const { code } = req.params;
    const region = GEO_REGIONS[code.toLowerCase()];
    if (!region) {
      return res.status(404).json({
        error: "Region not found",
        code,
        available: Object.keys(GEO_REGIONS).filter((k, i, arr) => arr.indexOf(k) === i)
      });
    }
    res.json(region);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});
router2.get("/localize", (req, res) => {
  try {
    const regionCode = req.query.region;
    const context = resolveGeoContext(req);
    const region = regionCode ? getRegionByCode(regionCode) : context.region;
    const localized = {
      region,
      cta: {
        phone: getRegionalPhone(region.code),
        text: `\u0417\u0430\u043A\u0430\u0437\u0430\u0442\u044C \u0432 ${region.nameGenitive}`,
        urgentText: `\u0421\u0440\u043E\u0447\u043D\u044B\u0439 \u0432\u044B\u0435\u0437\u0434 \u0432 ${region.nameGenitive}`
      },
      content: {
        serviceArea: `${region.name} \u0438 \u043E\u0431\u043B\u0430\u0441\u0442\u044C`,
        headline: `\u041F\u0440\u043E\u043C\u044B\u0448\u043B\u0435\u043D\u043D\u044B\u0439 \u0430\u043B\u044C\u043F\u0438\u043D\u0438\u0437\u043C \u0432 ${region.nameGenitive}`,
        subheadline: `\u041F\u043E\u043A\u0440\u0430\u0441\u043A\u0430 \u0442\u0440\u0443\u0431 \u0438 \u0430\u043D\u0442\u0438\u043A\u043E\u0440\u0440\u043E\u0437\u0438\u0439\u043D\u0430\u044F \u0437\u0430\u0449\u0438\u0442\u0430 \u0432 ${region.nameGenitive}`
      },
      meta: {
        title: `\u041F\u0440\u043E\u043C\u044B\u0448\u043B\u0435\u043D\u043D\u044B\u0439 \u0430\u043B\u044C\u043F\u0438\u043D\u0438\u0437\u043C ${region.name} | MS-PRO`,
        description: `\u041F\u043E\u043A\u0440\u0430\u0441\u043A\u0430 \u0442\u0440\u0443\u0431 \u0438 \u0430\u043D\u0442\u0438\u043A\u043E\u0440\u0440\u043E\u0437\u0438\u0439\u043D\u0430\u044F \u0437\u0430\u0449\u0438\u0442\u0430 \u0432 ${region.nameGenitive}. \u0413\u0430\u0440\u0430\u043D\u0442\u0438\u044F 20 \u043B\u0435\u0442. MSPRO Quad.`
      }
    };
    res.json(localized);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});
function getRegionalPhone(regionCode) {
  const phones = {
    msk: "+7 (495) 123-45-67",
    spb: "+7 (812) 123-45-67",
    ekb: "+7 (343) 123-45-67",
    nsk: "+7 (383) 123-45-67",
    kazan: "+7 (843) 123-45-67"
  };
  return phones[regionCode] || "+7 (800) 555-35-35";
}
var geo_api_default = router2;

// server/routes/aeo-api.ts
import { Router as Router3 } from "express";

// server/services/aeo-service.ts
import OpenAI2 from "openai";
import { z as z2 } from "zod";

// shared/data/aeo-data.ts
var DEFAULT_FAQS = [
  {
    question: "\u041A\u0430\u043A\u043E\u0439 \u0441\u0440\u043E\u043A \u0433\u0430\u0440\u0430\u043D\u0442\u0438\u0438 \u043D\u0430 \u043F\u043E\u043A\u0440\u0430\u0441\u043A\u0443 \u0434\u044B\u043C\u043E\u0432\u044B\u0445 \u0442\u0440\u0443\u0431?",
    answer: "\u041C\u044B \u043F\u0440\u0435\u0434\u043E\u0441\u0442\u0430\u0432\u043B\u044F\u0435\u043C \u0433\u0430\u0440\u0430\u043D\u0442\u0438\u044E \u0434\u043E 20 \u043B\u0435\u0442 \u043F\u0440\u0438 \u0438\u0441\u043F\u043E\u043B\u044C\u0437\u043E\u0432\u0430\u043D\u0438\u0438 \u043F\u043E\u043A\u0440\u044B\u0442\u0438\u044F MSPRO Quad. \u042D\u0442\u043E \u0441\u0435\u0440\u0442\u0438\u0444\u0438\u0446\u0438\u0440\u043E\u0432\u0430\u043D\u043D\u043E\u0435 \u043E\u0433\u043D\u0435\u0437\u0430\u0449\u0438\u0442\u043D\u043E\u0435 \u043F\u043E\u043A\u0440\u044B\u0442\u0438\u0435, \u043E\u0434\u043E\u0431\u0440\u0435\u043D\u043D\u043E\u0435 \u0420\u043E\u0441\u0442\u0435\u0445\u043D\u0430\u0434\u0437\u043E\u0440\u043E\u043C."
  },
  {
    question: "\u0412 \u043A\u0430\u043A\u0438\u0445 \u0440\u0435\u0433\u0438\u043E\u043D\u0430\u0445 \u0432\u044B \u0440\u0430\u0431\u043E\u0442\u0430\u0435\u0442\u0435?",
    answer: "\u041C\u044B \u0440\u0430\u0431\u043E\u0442\u0430\u0435\u043C \u043F\u043E \u0432\u0441\u0435\u0439 \u0420\u043E\u0441\u0441\u0438\u0438: \u043E\u0442 \u041A\u0430\u043B\u0438\u043D\u0438\u043D\u0433\u0440\u0430\u0434\u0430 \u0434\u043E \u0412\u043B\u0430\u0434\u0438\u0432\u043E\u0441\u0442\u043E\u043A\u0430. \u0412\u044B\u0435\u0437\u0434 \u0431\u0440\u0438\u0433\u0430\u0434\u044B \u0432 \u043B\u044E\u0431\u043E\u0439 \u0440\u0435\u0433\u0438\u043E\u043D \u0441 \u043F\u043E\u043B\u043D\u044B\u043C \u043A\u043E\u043C\u043F\u043B\u0435\u043A\u0442\u043E\u043C \u043E\u0431\u043E\u0440\u0443\u0434\u043E\u0432\u0430\u043D\u0438\u044F."
  },
  {
    question: "\u0421\u043A\u043E\u043B\u044C\u043A\u043E \u0441\u0442\u043E\u0438\u0442 \u043F\u043E\u043A\u0440\u0430\u0441\u043A\u0430 \u043F\u0440\u043E\u043C\u044B\u0448\u043B\u0435\u043D\u043D\u043E\u0439 \u0442\u0440\u0443\u0431\u044B?",
    answer: "\u0421\u0442\u043E\u0438\u043C\u043E\u0441\u0442\u044C \u0437\u0430\u0432\u0438\u0441\u0438\u0442 \u043E\u0442 \u0432\u044B\u0441\u043E\u0442\u044B \u0442\u0440\u0443\u0431\u044B, \u043F\u043B\u043E\u0449\u0430\u0434\u0438 \u043F\u043E\u0432\u0435\u0440\u0445\u043D\u043E\u0441\u0442\u0438 \u0438 \u0442\u0438\u043F\u0430 \u043F\u043E\u043A\u0440\u044B\u0442\u0438\u044F. \u0418\u0441\u043F\u043E\u043B\u044C\u0437\u0443\u0439\u0442\u0435 \u043D\u0430\u0448 \u043E\u043D\u043B\u0430\u0439\u043D-\u043A\u0430\u043B\u044C\u043A\u0443\u043B\u044F\u0442\u043E\u0440 \u0434\u043B\u044F \u0440\u0430\u0441\u0447\u0451\u0442\u0430 \u0438\u043B\u0438 \u043E\u0441\u0442\u0430\u0432\u044C\u0442\u0435 \u0437\u0430\u044F\u0432\u043A\u0443 \u0434\u043B\u044F \u0431\u0435\u0441\u043F\u043B\u0430\u0442\u043D\u043E\u0439 \u043E\u0446\u0435\u043D\u043A\u0438."
  },
  {
    question: "\u041A\u0430\u043A\u0438\u0435 \u043C\u0430\u0442\u0435\u0440\u0438\u0430\u043B\u044B \u0432\u044B \u0438\u0441\u043F\u043E\u043B\u044C\u0437\u0443\u0435\u0442\u0435?",
    answer: "\u041C\u044B \u0438\u0441\u043F\u043E\u043B\u044C\u0437\u0443\u0435\u043C \u0441\u0435\u0440\u0442\u0438\u0444\u0438\u0446\u0438\u0440\u043E\u0432\u0430\u043D\u043D\u043E\u0435 \u043F\u043E\u043A\u0440\u044B\u0442\u0438\u0435 MSPRO Quad \u0441 \u043E\u0433\u043D\u0435\u0437\u0430\u0449\u0438\u0442\u043D\u044B\u043C\u0438 \u0438 \u0430\u043D\u0442\u0438\u043A\u043E\u0440\u0440\u043E\u0437\u0438\u0439\u043D\u044B\u043C\u0438 \u0441\u0432\u043E\u0439\u0441\u0442\u0432\u0430\u043C\u0438. \u0412\u0441\u0435 \u043C\u0430\u0442\u0435\u0440\u0438\u0430\u043B\u044B \u0438\u043C\u0435\u044E\u0442 \u0441\u0435\u0440\u0442\u0438\u0444\u0438\u043A\u0430\u0442\u044B \u0441\u043E\u043E\u0442\u0432\u0435\u0442\u0441\u0442\u0432\u0438\u044F."
  },
  {
    question: "\u041A\u0430\u043A \u0434\u043E\u043B\u0433\u043E \u0434\u043B\u0438\u0442\u0441\u044F \u043F\u043E\u043A\u0440\u0430\u0441\u043A\u0430 \u043E\u0434\u043D\u043E\u0439 \u0442\u0440\u0443\u0431\u044B?",
    answer: "\u0421\u0440\u043E\u043A\u0438 \u0437\u0430\u0432\u0438\u0441\u044F\u0442 \u043E\u0442 \u0440\u0430\u0437\u043C\u0435\u0440\u043E\u0432 \u043E\u0431\u044A\u0435\u043A\u0442\u0430. \u0412 \u0441\u0440\u0435\u0434\u043D\u0435\u043C \u043F\u043E\u043A\u0440\u0430\u0441\u043A\u0430 \u043E\u0434\u043D\u043E\u0439 \u043F\u0440\u043E\u043C\u044B\u0448\u043B\u0435\u043D\u043D\u043E\u0439 \u0442\u0440\u0443\u0431\u044B \u0437\u0430\u043D\u0438\u043C\u0430\u0435\u0442 3-7 \u0440\u0430\u0431\u043E\u0447\u0438\u0445 \u0434\u043D\u0435\u0439 \u0441 \u0443\u0447\u0451\u0442\u043E\u043C \u043F\u043E\u0434\u0433\u043E\u0442\u043E\u0432\u043A\u0438 \u043F\u043E\u0432\u0435\u0440\u0445\u043D\u043E\u0441\u0442\u0438."
  }
];

// server/services/aeo-service.ts
var FAQItemSchema = z2.object({
  question: z2.string().min(10, "\u0412\u043E\u043F\u0440\u043E\u0441 \u0434\u043E\u043B\u0436\u0435\u043D \u0431\u044B\u0442\u044C \u043C\u0438\u043D\u0438\u043C\u0443\u043C 10 \u0441\u0438\u043C\u0432\u043E\u043B\u043E\u0432").max(200),
  answer: z2.string().min(20, "\u041E\u0442\u0432\u0435\u0442 \u0434\u043E\u043B\u0436\u0435\u043D \u0431\u044B\u0442\u044C \u043C\u0438\u043D\u0438\u043C\u0443\u043C 20 \u0441\u0438\u043C\u0432\u043E\u043B\u043E\u0432").max(1e3)
});
var FAQListSchema = z2.array(FAQItemSchema).min(1).max(10);
var GenerateRequestSchema = z2.object({
  slug: z2.string().min(1, "slug \u043E\u0431\u044F\u0437\u0430\u0442\u0435\u043B\u0435\u043D"),
  region: z2.string().optional(),
  faqCount: z2.number().min(1).max(10).optional().default(3),
  includeSchemas: z2.boolean().optional().default(true)
});
var openai2 = new OpenAI2({
  apiKey: process.env.OPENAI_API_KEY
});
var MODEL = process.env.OPENAI_MODEL || "gpt-4o-mini";
async function generateAEOContent(request) {
  const validated = GenerateRequestSchema.parse(request);
  const { slug, region, faqCount, includeSchemas } = validated;
  const seoEntry = getPageBySlug(slug);
  const geoRegion = region ? getRegionByCode(region) : null;
  const faq = await generateFAQ(slug, seoEntry, geoRegion, faqCount);
  const qualityResult = validateFAQQuality(faq);
  const schemas = {};
  if (includeSchemas) {
    schemas.service = buildServiceSchema(seoEntry, geoRegion);
    schemas.faqPage = buildFAQPageSchema(faq);
    schemas.organization = buildOrganizationSchema();
    if (geoRegion) {
      schemas.localBusiness = buildLocalBusinessSchema(geoRegion);
    }
    schemas.breadcrumb = buildBreadcrumbSchema(slug, seoEntry);
  }
  const summary = generateSummary(seoEntry, geoRegion);
  return {
    slug,
    summary,
    faq: qualityResult.cleanedFAQ,
    schemas,
    qualityScore: qualityResult.score,
    warnings: qualityResult.warnings,
    generatedAt: (/* @__PURE__ */ new Date()).toISOString()
  };
}
async function generateFAQ(slug, seoEntry, region, count) {
  if (seoEntry?.faq && seoEntry.faq.length >= count) {
    return seoEntry.faq.slice(0, count);
  }
  const keyword = slug.replace(/-/g, " ");
  const regionName = region?.name || "\u0420\u043E\u0441\u0441\u0438\u044F";
  const prompt = `
\u0421\u043E\u0437\u0434\u0430\u0439 ${count} \u0447\u0430\u0441\u0442\u043E \u0437\u0430\u0434\u0430\u0432\u0430\u0435\u043C\u044B\u0445 \u0432\u043E\u043F\u0440\u043E\u0441\u0430 (FAQ) \u0434\u043B\u044F B2B \u0443\u0441\u043B\u0443\u0433\u0438:
"${seoEntry?.title || keyword}"

\u0420\u0435\u0433\u0438\u043E\u043D: ${regionName}
\u041A\u043E\u043C\u043F\u0430\u043D\u0438\u044F: MS-PRO (\u043F\u0440\u043E\u043C\u044B\u0448\u043B\u0435\u043D\u043D\u044B\u0439 \u0430\u043B\u044C\u043F\u0438\u043D\u0438\u0437\u043C, \u043F\u043E\u043A\u0440\u0430\u0441\u043A\u0430 \u0442\u0440\u0443\u0431, MSPRO Quad)

\u041F\u0440\u0430\u0432\u0438\u043B\u0430:
1. \u0412\u043E\u043F\u0440\u043E\u0441\u044B \u0434\u043E\u043B\u0436\u043D\u044B \u0431\u044B\u0442\u044C \u0440\u0435\u0430\u043B\u044C\u043D\u044B\u043C\u0438, \u043A\u043E\u0442\u043E\u0440\u044B\u0435 \u0437\u0430\u0434\u0430\u044E\u0442 \u043A\u043B\u0438\u0435\u043D\u0442\u044B B2B
2. \u041E\u0442\u0432\u0435\u0442\u044B 2-4 \u043F\u0440\u0435\u0434\u043B\u043E\u0436\u0435\u043D\u0438\u044F, \u043A\u043E\u043D\u043A\u0440\u0435\u0442\u043D\u044B\u0435
3. \u041D\u0415 \u0432\u044B\u0434\u0443\u043C\u044B\u0432\u0430\u0439 \u0442\u043E\u0447\u043D\u044B\u0435 \u0446\u0435\u043D\u044B, \u0430\u0434\u0440\u0435\u0441\u0430, \u043D\u043E\u043C\u0435\u0440\u0430 \u0441\u0435\u0440\u0442\u0438\u0444\u0438\u043A\u0430\u0442\u043E\u0432
4. \u0423\u043F\u043E\u043C\u0438\u043D\u0430\u0439 \u0433\u0430\u0440\u0430\u043D\u0442\u0438\u044E 20 \u043B\u0435\u0442 \u0438 MSPRO Quad \u0433\u0434\u0435 \u0443\u043C\u0435\u0441\u0442\u043D\u043E
5. \u0424\u043E\u0440\u043C\u0430\u0442 JSON: [{"question": "...", "answer": "..."}]

\u0412\u0435\u0440\u043D\u0438 \u0442\u043E\u043B\u044C\u043A\u043E JSON \u043C\u0430\u0441\u0441\u0438\u0432.
`;
  try {
    const response = await openai2.chat.completions.create({
      model: MODEL,
      messages: [
        { role: "system", content: "\u0422\u044B \u2014 \u044D\u043A\u0441\u043F\u0435\u0440\u0442 \u043F\u043E B2B \u043F\u0440\u043E\u043C\u044B\u0448\u043B\u0435\u043D\u043D\u044B\u043C \u0443\u0441\u043B\u0443\u0433\u0430\u043C. \u0412\u043E\u0437\u0432\u0440\u0430\u0449\u0430\u0439 \u0442\u043E\u043B\u044C\u043A\u043E \u0432\u0430\u043B\u0438\u0434\u043D\u044B\u0439 JSON." },
        { role: "user", content: prompt }
      ],
      temperature: 0.7,
      response_format: { type: "json_object" }
    });
    const content = response.choices[0]?.message?.content;
    if (!content) throw new Error("OpenAI \u043D\u0435 \u0432\u0435\u0440\u043D\u0443\u043B \u043A\u043E\u043D\u0442\u0435\u043D\u0442");
    const parsed = JSON.parse(content);
    const faqArray = Array.isArray(parsed) ? parsed : parsed.faq || parsed.questions || [];
    return faqArray.slice(0, count);
  } catch (error) {
    console.error("[AEO] FAQ generation error:", error);
    return getDefaultFAQ(keyword, count, region);
  }
}
function getDefaultFAQ(keyword, count, region = null) {
  let faqs = [...DEFAULT_FAQS];
  if (region && region.priority !== "low") {
    faqs = faqs.map((item) => {
      let localizedAnswer = item.answer;
      if (item.question.includes("\u0440\u0435\u0433\u0438\u043E\u043D\u0430\u0445")) {
        localizedAnswer = `\u041C\u044B \u0430\u043A\u0442\u0438\u0432\u043D\u043E \u0440\u0430\u0431\u043E\u0442\u0430\u0435\u043C \u0432 \u0440\u0435\u0433\u0438\u043E\u043D\u0435 ${region.name} \u0438 \u043E\u0431\u043B\u0430\u0441\u0442\u0438. \u0412\u044B\u0435\u0437\u0434 \u0431\u0440\u0438\u0433\u0430\u0434\u044B \u043E\u0441\u0443\u0449\u0435\u0441\u0442\u0432\u043B\u044F\u0435\u0442\u0441\u044F \u0432 \u0442\u0435\u0447\u0435\u043D\u0438\u0435 24 \u0447\u0430\u0441\u043E\u0432.`;
      }
      return { ...item, answer: localizedAnswer };
    });
  }
  return faqs.slice(0, count);
}
function validateFAQQuality(faq) {
  const warnings = [];
  let score = 100;
  const cleanedFAQ = [];
  const seenQuestions = /* @__PURE__ */ new Set();
  for (const item of faq) {
    const qNorm = item.question.toLowerCase().trim();
    if (seenQuestions.has(qNorm)) {
      warnings.push(`\u0414\u0443\u0431\u043B\u0438\u043A\u0430\u0442 \u0432\u043E\u043F\u0440\u043E\u0441\u0430: "${item.question.slice(0, 50)}..."`);
      score -= 10;
      continue;
    }
    seenQuestions.add(qNorm);
    if (item.question.length < 10) {
      warnings.push(`\u0421\u043B\u0438\u0448\u043A\u043E\u043C \u043A\u043E\u0440\u043E\u0442\u043A\u0438\u0439 \u0432\u043E\u043F\u0440\u043E\u0441: "${item.question}"`);
      score -= 5;
    }
    if (item.answer.length < 20) {
      warnings.push(`\u0421\u043B\u0438\u0448\u043A\u043E\u043C \u043A\u043E\u0440\u043E\u0442\u043A\u0438\u0439 \u043E\u0442\u0432\u0435\u0442 \u0434\u043B\u044F: "${item.question.slice(0, 30)}..."`);
      score -= 5;
    }
    if (/\d{10,}|\$\d+|€\d+|₽\s*\d{5,}/.test(item.answer)) {
      warnings.push(`\u041F\u043E\u0442\u0435\u043D\u0446\u0438\u0430\u043B\u044C\u043D\u043E \u0432\u044B\u0434\u0443\u043C\u0430\u043D\u043D\u044B\u0435 \u0434\u0430\u043D\u043D\u044B\u0435 \u0432 \u043E\u0442\u0432\u0435\u0442\u0435: "${item.question.slice(0, 30)}..."`);
      score -= 15;
    }
    cleanedFAQ.push(item);
  }
  if (cleanedFAQ.length === 0) {
    warnings.push("\u041D\u0435\u0442 \u0432\u0430\u043B\u0438\u0434\u043D\u044B\u0445 FAQ \u043F\u043E\u0441\u043B\u0435 \u043F\u0440\u043E\u0432\u0435\u0440\u043A\u0438");
    score = 0;
  }
  return {
    score: Math.max(0, score),
    warnings,
    cleanedFAQ
  };
}
function generateSummary(seoEntry, region) {
  if (seoEntry?.description) {
    return seoEntry.description;
  }
  const regionText = region ? ` \u0432 ${region.nameGenitive}` : "";
  return `\u041F\u0440\u043E\u0444\u0435\u0441\u0441\u0438\u043E\u043D\u0430\u043B\u044C\u043D\u044B\u0435 \u0443\u0441\u043B\u0443\u0433\u0438 \u043F\u0440\u043E\u043C\u044B\u0448\u043B\u0435\u043D\u043D\u043E\u0433\u043E \u0430\u043B\u044C\u043F\u0438\u043D\u0438\u0437\u043C\u0430${regionText}. \u0410\u043D\u0442\u0438\u043A\u043E\u0440\u0440\u043E\u0437\u0438\u0439\u043D\u043E\u0435 \u043F\u043E\u043A\u0440\u044B\u0442\u0438\u0435 MSPRO Quad \u0441 \u0433\u0430\u0440\u0430\u043D\u0442\u0438\u0435\u0439 20 \u043B\u0435\u0442.`;
}
function buildServiceSchema(seoEntry, region) {
  return {
    "@context": "https://schema.org",
    "@type": "Service",
    name: seoEntry?.title || "\u041F\u0440\u043E\u043C\u044B\u0448\u043B\u0435\u043D\u043D\u044B\u0439 \u0430\u043B\u044C\u043F\u0438\u043D\u0438\u0437\u043C MS-PRO",
    description: seoEntry?.description || "\u041F\u0440\u043E\u0444\u0435\u0441\u0441\u0438\u043E\u043D\u0430\u043B\u044C\u043D\u044B\u0435 \u0432\u044B\u0441\u043E\u0442\u043D\u044B\u0435 \u0440\u0430\u0431\u043E\u0442\u044B",
    provider: {
      "@type": "Organization",
      name: "MS-PRO",
      url: "https://mspro.ru"
    },
    areaServed: region?.name || "\u0420\u043E\u0441\u0441\u0438\u044F",
    serviceType: "\u041F\u0440\u043E\u043C\u044B\u0448\u043B\u0435\u043D\u043D\u0430\u044F \u043F\u043E\u043A\u0440\u0430\u0441\u043A\u0430 \u0438 \u0430\u043D\u0442\u0438\u043A\u043E\u0440\u0440\u043E\u0437\u0438\u0439\u043D\u0430\u044F \u0437\u0430\u0449\u0438\u0442\u0430"
  };
}
function buildFAQPageSchema(faq) {
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: faq.map((item) => ({
      "@type": "Question",
      name: item.question,
      acceptedAnswer: {
        "@type": "Answer",
        text: item.answer
      }
    }))
  };
}
function buildOrganizationSchema() {
  return {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: "MS-PRO",
    url: "https://mspro.ru",
    logo: "https://mspro.ru/logo.png",
    contactPoint: {
      "@type": "ContactPoint",
      telephone: "+7-800-555-35-35",
      contactType: "customer service",
      areaServed: "RU",
      availableLanguage: "Russian"
    }
  };
}
function buildLocalBusinessSchema(region) {
  return {
    "@context": "https://schema.org",
    "@type": "LocalBusiness",
    name: `MS-PRO ${region.name}`,
    description: `\u041F\u0440\u043E\u043C\u044B\u0448\u043B\u0435\u043D\u043D\u044B\u0439 \u0430\u043B\u044C\u043F\u0438\u043D\u0438\u0437\u043C \u0438 \u043F\u043E\u043A\u0440\u0430\u0441\u043A\u0430 \u0442\u0440\u0443\u0431 \u0432 ${region.nameGenitive}`,
    address: {
      "@type": "PostalAddress",
      addressLocality: region.name,
      addressCountry: "RU"
    },
    areaServed: region.name,
    priceRange: "\u20BD\u20BD\u20BD"
  };
}
function buildBreadcrumbSchema(slug, seoEntry) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      {
        "@type": "ListItem",
        position: 1,
        name: "\u0413\u043B\u0430\u0432\u043D\u0430\u044F",
        item: "https://mspro.ru"
      },
      {
        "@type": "ListItem",
        position: 2,
        name: "\u0423\u0441\u043B\u0443\u0433\u0438",
        item: "https://mspro.ru/services"
      },
      {
        "@type": "ListItem",
        position: 3,
        name: seoEntry?.title || slug,
        item: `https://mspro.ru/services/${slug}`
      }
    ]
  };
}
function validateJsonLdSchema(schema) {
  const errors = [];
  if (!("@context" in schema)) {
    errors.push("\u041E\u0442\u0441\u0443\u0442\u0441\u0442\u0432\u0443\u0435\u0442 @context");
  }
  if (!("@type" in schema)) {
    errors.push("\u041E\u0442\u0441\u0443\u0442\u0441\u0442\u0432\u0443\u0435\u0442 @type");
  }
  return {
    valid: errors.length === 0,
    errors
  };
}

// server/routes/aeo-api.ts
import { z as z3 } from "zod";
var router3 = Router3();
router3.post("/generate", async (req, res) => {
  try {
    const result = await generateAEOContent(req.body);
    res.json(result);
  } catch (error) {
    if (error instanceof z3.ZodError) {
      return res.status(400).json({
        error: "Validation error",
        details: error.errors
      });
    }
    res.status(500).json({ error: error.message });
  }
});
router3.get("/schema/:type", (req, res) => {
  const { type } = req.params;
  const templates = {
    service: {
      "@context": "https://schema.org",
      "@type": "Service",
      name: "{serviceName}",
      description: "{serviceDescription}",
      provider: {
        "@type": "Organization",
        name: "MS-PRO"
      },
      areaServed: "{region}"
    },
    faq: {
      "@context": "https://schema.org",
      "@type": "FAQPage",
      mainEntity: [
        {
          "@type": "Question",
          name: "{question}",
          acceptedAnswer: {
            "@type": "Answer",
            text: "{answer}"
          }
        }
      ]
    },
    organization: {
      "@context": "https://schema.org",
      "@type": "Organization",
      name: "MS-PRO",
      url: "https://mspro.ru",
      logo: "https://mspro.ru/logo.png",
      contactPoint: {
        "@type": "ContactPoint",
        telephone: "+7-800-555-35-35",
        contactType: "customer service"
      }
    },
    localBusiness: {
      "@context": "https://schema.org",
      "@type": "LocalBusiness",
      name: "MS-PRO {region}",
      address: {
        "@type": "PostalAddress",
        addressLocality: "{region}",
        addressCountry: "RU"
      }
    },
    breadcrumb: {
      "@context": "https://schema.org",
      "@type": "BreadcrumbList",
      itemListElement: [
        { "@type": "ListItem", position: 1, name: "\u0413\u043B\u0430\u0432\u043D\u0430\u044F", item: "https://mspro.ru" },
        { "@type": "ListItem", position: 2, name: "{pageName}", item: "{pageUrl}" }
      ]
    }
  };
  const template = templates[type];
  if (!template) {
    return res.status(404).json({
      error: "Schema type not found",
      available: Object.keys(templates)
    });
  }
  res.json({
    type,
    template,
    usage: "\u0417\u0430\u043C\u0435\u043D\u0438\u0442\u0435 {placeholders} \u043D\u0430 \u0440\u0435\u0430\u043B\u044C\u043D\u044B\u0435 \u0434\u0430\u043D\u043D\u044B\u0435"
  });
});
router3.post("/validate", (req, res) => {
  try {
    const schema = req.body;
    if (!schema || typeof schema !== "object") {
      return res.status(400).json({
        error: "Body must be a JSON object"
      });
    }
    const result = validateJsonLdSchema(schema);
    res.json({
      valid: result.valid,
      errors: result.errors,
      schema: result.valid ? schema : void 0
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});
router3.get("/quality-gates", (req, res) => {
  res.json({
    description: "AEO Quality Gates \u2014 \u043F\u0440\u0430\u0432\u0438\u043B\u0430 \u0432\u0430\u043B\u0438\u0434\u0430\u0446\u0438\u0438 \u043A\u043E\u043D\u0442\u0435\u043D\u0442\u0430",
    rules: [
      {
        id: "faq-min-question-length",
        description: "\u0412\u043E\u043F\u0440\u043E\u0441 \u043C\u0438\u043D\u0438\u043C\u0443\u043C 10 \u0441\u0438\u043C\u0432\u043E\u043B\u043E\u0432",
        penalty: -5
      },
      {
        id: "faq-min-answer-length",
        description: "\u041E\u0442\u0432\u0435\u0442 \u043C\u0438\u043D\u0438\u043C\u0443\u043C 20 \u0441\u0438\u043C\u0432\u043E\u043B\u043E\u0432",
        penalty: -5
      },
      {
        id: "faq-no-duplicates",
        description: "\u041D\u0435\u0442 \u0434\u0443\u0431\u043B\u0438\u0440\u0443\u044E\u0449\u0438\u0445\u0441\u044F \u0432\u043E\u043F\u0440\u043E\u0441\u043E\u0432",
        penalty: -10
      },
      {
        id: "faq-no-fake-data",
        description: "\u041D\u0435\u0442 \u0432\u044B\u0434\u0443\u043C\u0430\u043D\u043D\u044B\u0445 \u0446\u0435\u043D/\u043D\u043E\u043C\u0435\u0440\u043E\u0432",
        penalty: -15
      },
      {
        id: "schema-has-context",
        description: "JSON-LD \u0438\u043C\u0435\u0435\u0442 @context",
        required: true
      },
      {
        id: "schema-has-type",
        description: "JSON-LD \u0438\u043C\u0435\u0435\u0442 @type",
        required: true
      }
    ],
    scoring: {
      excellent: "90-100",
      good: "70-89",
      needs_improvement: "50-69",
      poor: "0-49"
    }
  });
});
var aeo_api_default = router3;

// server/routes/ux-api.ts
import { Router as Router4 } from "express";
import { z as z5 } from "zod";

// server/services/ux-personalization.ts
import { z as z4 } from "zod";
var ExperimentSchema = z4.object({
  id: z4.string(),
  name: z4.string(),
  description: z4.string().optional(),
  variants: z4.array(z4.object({
    id: z4.string(),
    name: z4.string(),
    weight: z4.number().min(0).max(100),
    config: z4.record(z4.any()).optional()
  })),
  active: z4.boolean().default(true),
  startDate: z4.string().optional(),
  endDate: z4.string().optional()
});
var BehaviorEventSchema = z4.object({
  type: z4.enum([
    "page_view",
    "scroll_depth",
    "click",
    "form_start",
    "form_submit",
    "calculator_use",
    "cta_view",
    "cta_click",
    "time_on_page"
  ]),
  page: z4.string(),
  element: z4.string().optional(),
  value: z4.any().optional(),
  sessionId: z4.string(),
  timestamp: z4.string().optional()
});
var experiments = /* @__PURE__ */ new Map();
var userProfiles = /* @__PURE__ */ new Map();
var behaviorEvents = [];
var defaultExperiments = [
  {
    id: "cta-button-color",
    name: "CTA Button Color Test",
    description: '\u0422\u0435\u0441\u0442 \u0446\u0432\u0435\u0442\u0430 \u043A\u043D\u043E\u043F\u043A\u0438 "\u041F\u043E\u043B\u0443\u0447\u0438\u0442\u044C \u0440\u0430\u0441\u0447\u0451\u0442"',
    variants: [
      { id: "control", name: "\u0421\u0438\u043D\u0438\u0439 (\u043A\u043E\u043D\u0442\u0440\u043E\u043B\u044C)", weight: 50, config: { color: "primary" } },
      { id: "variant-a", name: "\u0417\u0435\u043B\u0451\u043D\u044B\u0439", weight: 50, config: { color: "green" } }
    ],
    active: true
  },
  {
    id: "pricing-display",
    name: "Pricing Display Format",
    description: "\u0424\u043E\u0440\u043C\u0430\u0442 \u043E\u0442\u043E\u0431\u0440\u0430\u0436\u0435\u043D\u0438\u044F \u0446\u0435\u043D\u044B \u0432 \u043A\u0430\u043B\u044C\u043A\u0443\u043B\u044F\u0442\u043E\u0440\u0435",
    variants: [
      { id: "control", name: "\u0422\u043E\u043B\u044C\u043A\u043E \u0438\u0442\u043E\u0433\u043E", weight: 33, config: { format: "total" } },
      { id: "variant-a", name: "\u0421 \u0440\u0430\u0437\u0431\u0438\u0432\u043A\u043E\u0439", weight: 33, config: { format: "breakdown" } },
      { id: "variant-b", name: "\u0421 \u044D\u043A\u043E\u043D\u043E\u043C\u0438\u0435\u0439", weight: 34, config: { format: "savings" } }
    ],
    active: true
  },
  {
    id: "form-steps",
    name: "Lead Form Steps",
    description: "\u041A\u043E\u043B\u0438\u0447\u0435\u0441\u0442\u0432\u043E \u0448\u0430\u0433\u043E\u0432 \u0432 \u0444\u043E\u0440\u043C\u0435 \u0437\u0430\u0445\u0432\u0430\u0442\u0430",
    variants: [
      { id: "control", name: "\u041E\u0434\u043D\u043E\u0448\u0430\u0433\u043E\u0432\u0430\u044F", weight: 50, config: { steps: 1 } },
      { id: "variant-a", name: "\u041C\u043D\u043E\u0433\u043E\u0448\u0430\u0433\u043E\u0432\u0430\u044F", weight: 50, config: { steps: 3 } }
    ],
    active: true
  }
];
defaultExperiments.forEach((exp) => experiments.set(exp.id, exp));
function getOrCreateProfile(sessionId, region) {
  let profile = userProfiles.get(sessionId);
  if (!profile) {
    profile = {
      sessionId,
      region: region || null,
      source: null,
      device: "desktop",
      pages_viewed: [],
      events: [],
      experiments: {},
      createdAt: (/* @__PURE__ */ new Date()).toISOString(),
      updatedAt: (/* @__PURE__ */ new Date()).toISOString()
    };
    userProfiles.set(sessionId, profile);
  }
  return profile;
}
function assignExperimentVariant(sessionId, experimentId) {
  const experiment = experiments.get(experimentId);
  if (!experiment || !experiment.active) {
    return null;
  }
  const profile = getOrCreateProfile(sessionId);
  if (profile.experiments[experimentId]) {
    const existingVariant = experiment.variants.find(
      (v) => v.id === profile.experiments[experimentId]
    );
    return existingVariant ? {
      experimentId,
      variantId: existingVariant.id,
      config: existingVariant.config || {}
    } : null;
  }
  const rand = Math.random() * 100;
  let cumulative = 0;
  let selectedVariant = experiment.variants[0];
  for (const variant of experiment.variants) {
    cumulative += variant.weight;
    if (rand <= cumulative) {
      selectedVariant = variant;
      break;
    }
  }
  profile.experiments[experimentId] = selectedVariant.id;
  profile.updatedAt = (/* @__PURE__ */ new Date()).toISOString();
  return {
    experimentId,
    variantId: selectedVariant.id,
    config: selectedVariant.config || {}
  };
}
function trackEvent(event) {
  const validated = BehaviorEventSchema.parse({
    ...event,
    timestamp: event.timestamp || (/* @__PURE__ */ new Date()).toISOString()
  });
  behaviorEvents.push(validated);
  const profile = userProfiles.get(validated.sessionId);
  if (profile) {
    profile.events.push(validated);
    if (validated.type === "page_view" && !profile.pages_viewed.includes(validated.page)) {
      profile.pages_viewed.push(validated.page);
    }
    profile.updatedAt = (/* @__PURE__ */ new Date()).toISOString();
  }
}
function getPersonalizedContent(sessionId) {
  const profile = userProfiles.get(sessionId);
  const content = {
    experiments: {},
    recommendations: [],
    cta: {
      text: "\u041F\u043E\u043B\u0443\u0447\u0438\u0442\u044C \u0431\u0435\u0441\u043F\u043B\u0430\u0442\u043D\u044B\u0439 \u0440\u0430\u0441\u0447\u0451\u0442",
      variant: "primary"
    }
  };
  for (const [expId, variantId] of Object.entries(profile?.experiments || {})) {
    const experiment = experiments.get(expId);
    const variant = experiment?.variants.find((v) => v.id === variantId);
    if (variant) {
      content.experiments[expId] = {
        variantId,
        config: variant.config
      };
    }
  }
  if (profile) {
    if (profile.pages_viewed.length > 3) {
      content.recommendations.push({
        type: "urgency",
        message: "\u041F\u043E\u043B\u0443\u0447\u0438\u0442\u0435 \u0440\u0430\u0441\u0447\u0451\u0442 \u0441\u0435\u0433\u043E\u0434\u043D\u044F \u0438 \u0437\u0430\u0444\u0438\u043A\u0441\u0438\u0440\u0443\u0439\u0442\u0435 \u0446\u0435\u043D\u0443!"
      });
    }
    const calcEvents = profile.events.filter((e) => e.type === "calculator_use");
    if (calcEvents.length > 0) {
      content.recommendations.push({
        type: "follow_up",
        message: "\u0425\u043E\u0442\u0438\u0442\u0435 \u043F\u043E\u043B\u0443\u0447\u0438\u0442\u044C \u0434\u0435\u0442\u0430\u043B\u044C\u043D\u044B\u0439 \u0440\u0430\u0441\u0447\u0451\u0442 \u043E\u0442 \u0441\u043F\u0435\u0446\u0438\u0430\u043B\u0438\u0441\u0442\u0430?"
      });
    }
    if (profile.region) {
      content.recommendations.push({
        type: "local",
        message: `\u0411\u0435\u0441\u043F\u043B\u0430\u0442\u043D\u044B\u0439 \u0432\u044B\u0435\u0437\u0434 \u0441\u043F\u0435\u0446\u0438\u0430\u043B\u0438\u0441\u0442\u0430 \u0432 ${profile.region}`
      });
    }
  }
  return content;
}
function getAllExperiments() {
  return Array.from(experiments.values());
}
function getExperimentById(id) {
  return experiments.get(id) || null;
}
function upsertExperiment(data) {
  const validated = ExperimentSchema.parse(data);
  experiments.set(validated.id, validated);
  return validated;
}
function getCROMetrics() {
  const totalSessions = userProfiles.size;
  const formStarts = behaviorEvents.filter((e) => e.type === "form_start").length;
  const formSubmits = behaviorEvents.filter((e) => e.type === "form_submit").length;
  const ctaClicks = behaviorEvents.filter((e) => e.type === "cta_click").length;
  const calcUses = behaviorEvents.filter((e) => e.type === "calculator_use").length;
  const experimentMetrics = {};
  Array.from(experiments.entries()).forEach(([expId, experiment]) => {
    const variantCounts = {};
    for (const variant of experiment.variants) {
      variantCounts[variant.id] = 0;
    }
    Array.from(userProfiles.values()).forEach((profile) => {
      const variantId = profile.experiments[expId];
      if (variantId && variantCounts[variantId] !== void 0) {
        variantCounts[variantId]++;
      }
    });
    experimentMetrics[expId] = {
      name: experiment.name,
      active: experiment.active,
      variants: variantCounts
    };
  });
  return {
    totalSessions,
    conversions: {
      formStartRate: totalSessions > 0 ? (formStarts / totalSessions * 100).toFixed(2) + "%" : "0%",
      formSubmitRate: formStarts > 0 ? (formSubmits / formStarts * 100).toFixed(2) + "%" : "0%",
      ctaClickRate: totalSessions > 0 ? (ctaClicks / totalSessions * 100).toFixed(2) + "%" : "0%",
      calculatorUsage: totalSessions > 0 ? (calcUses / totalSessions * 100).toFixed(2) + "%" : "0%"
    },
    experiments: experimentMetrics,
    totalEvents: behaviorEvents.length
  };
}
function clearOldData(daysOld = 30) {
  const cutoff = /* @__PURE__ */ new Date();
  cutoff.setDate(cutoff.getDate() - daysOld);
  const cutoffStr = cutoff.toISOString();
  let cleared = 0;
  Array.from(userProfiles.entries()).forEach(([sessionId, profile]) => {
    if (profile.updatedAt < cutoffStr) {
      userProfiles.delete(sessionId);
      cleared++;
    }
  });
  return cleared;
}

// server/routes/ux-api.ts
var router4 = Router4();
router4.get("/profile", (req, res) => {
  const { sessionId, region } = req.query;
  if (!sessionId || typeof sessionId !== "string") {
    return res.status(400).json({ error: "sessionId is required" });
  }
  const profile = getOrCreateProfile(sessionId, region);
  res.json(profile);
});
router4.post("/experiment/assign", (req, res) => {
  const { sessionId, experimentId } = req.body;
  if (!sessionId || !experimentId) {
    return res.status(400).json({ error: "sessionId and experimentId are required" });
  }
  const result = assignExperimentVariant(sessionId, experimentId);
  if (!result) {
    return res.status(404).json({ error: "Experiment not found or inactive" });
  }
  res.json(result);
});
router4.get("/experiments", (req, res) => {
  const experiments2 = getAllExperiments();
  res.json({
    count: experiments2.length,
    experiments: experiments2
  });
});
router4.get("/experiments/:id", (req, res) => {
  const experiment = getExperimentById(req.params.id);
  if (!experiment) {
    return res.status(404).json({ error: "Experiment not found" });
  }
  res.json(experiment);
});
router4.post("/experiments", (req, res) => {
  try {
    const experiment = upsertExperiment(req.body);
    res.json(experiment);
  } catch (error) {
    if (error instanceof z5.ZodError) {
      return res.status(400).json({ error: "Validation error", details: error.errors });
    }
    res.status(500).json({ error: error.message });
  }
});
router4.post("/track", (req, res) => {
  try {
    trackEvent(req.body);
    res.json({ success: true });
  } catch (error) {
    if (error instanceof z5.ZodError) {
      return res.status(400).json({ error: "Validation error", details: error.errors });
    }
    res.status(500).json({ error: error.message });
  }
});
router4.get("/personalize", (req, res) => {
  const { sessionId } = req.query;
  if (!sessionId || typeof sessionId !== "string") {
    return res.status(400).json({ error: "sessionId is required" });
  }
  const content = getPersonalizedContent(sessionId);
  res.json(content);
});
router4.get("/metrics", (req, res) => {
  const metrics = getCROMetrics();
  res.json(metrics);
});
router4.post("/cleanup", (req, res) => {
  const { daysOld = 30 } = req.body;
  const cleared = clearOldData(daysOld);
  res.json({
    message: `Cleared ${cleared} old profiles`,
    daysOld
  });
});
var ux_api_default = router4;

// server/routes/health-api.ts
import { Router as Router5 } from "express";
var router5 = Router5();
var startTime = Date.now();
router5.get("/", async (req, res) => {
  const services = {};
  services.seo = await checkSEOService();
  services.geo = checkGEOService();
  services.aeo = checkAEOService();
  services.ux = checkUXService();
  services.database = await checkDatabaseService();
  const summary = calculateSummary(services);
  const overallStatus = determineOverallStatus(summary);
  const health = {
    status: overallStatus,
    timestamp: (/* @__PURE__ */ new Date()).toISOString(),
    version: "3.0.0",
    uptime: Math.floor((Date.now() - startTime) / 1e3),
    services,
    summary
  };
  const httpStatus = overallStatus === "healthy" ? 200 : overallStatus === "degraded" ? 200 : 503;
  res.status(httpStatus).json(health);
});
router5.get("/live", (req, res) => {
  res.json({
    status: "ok",
    timestamp: (/* @__PURE__ */ new Date()).toISOString()
  });
});
router5.get("/ready", async (req, res) => {
  try {
    const stats = getSEOStats();
    const isReady = stats.totalPages > 0;
    if (isReady) {
      res.json({ status: "ready", seoPages: stats.totalPages });
    } else {
      res.status(503).json({ status: "not_ready", reason: "SEO data not loaded" });
    }
  } catch (error) {
    res.status(503).json({ status: "not_ready", error: "Service check failed" });
  }
});
router5.get("/api-status", (req, res) => {
  const apis = [
    { name: "SEO API", base: "/api/seo", endpoints: ["pages", "page/:slug", "search", "stats", "related/:slug", "cache/invalidate"] },
    { name: "GEO API", base: "/api/geo", endpoints: ["context", "regions", "region/:code", "localize"] },
    { name: "AEO API", base: "/api/aeo", endpoints: ["generate", "schema/:type", "validate", "quality-gates"] },
    { name: "UX API", base: "/api/ux", endpoints: ["profile", "experiments", "experiment/assign", "track", "personalize", "metrics"] },
    { name: "Health API", base: "/api/health", endpoints: ["/", "live", "ready", "api-status"] },
    { name: "Legacy API", base: "/api", endpoints: ["leads", "calculations", "ai_seo"] }
  ];
  const totalEndpoints = apis.reduce((sum, api) => sum + api.endpoints.length, 0);
  res.json({
    version: "3.0.0",
    totalApis: apis.length,
    totalEndpoints,
    apis: apis.map((api) => ({
      ...api,
      endpointCount: api.endpoints.length,
      fullPaths: api.endpoints.map((ep) => `${api.base}/${ep}`.replace(/\/+/g, "/"))
    }))
  });
});
async function checkSEOService() {
  try {
    const stats = getSEOStats();
    if (stats.totalPages === 0) {
      return { status: "warning", message: "No SEO pages loaded", details: stats };
    }
    return {
      status: "ok",
      message: `${stats.totalPages} pages loaded`,
      details: { pageCount: stats.totalPages, ...stats }
    };
  } catch (error) {
    return { status: "error", message: error.message };
  }
}
function checkGEOService() {
  try {
    const regions = getAllRegions();
    return {
      status: "ok",
      message: `${regions.length} regions configured`,
      details: { regionCount: regions.length }
    };
  } catch (error) {
    return { status: "error", message: error.message };
  }
}
function checkAEOService() {
  const hasOpenAI = !!process.env.OPENAI_API_KEY;
  if (!hasOpenAI) {
    return {
      status: "warning",
      message: "OpenAI API key not configured, using fallback FAQ",
      details: { aiEnabled: false }
    };
  }
  return {
    status: "ok",
    message: "AI generation enabled",
    details: { aiEnabled: true, model: process.env.OPENAI_MODEL || "gpt-4o-mini" }
  };
}
function checkUXService() {
  try {
    const experiments2 = getAllExperiments();
    const metrics = getCROMetrics();
    return {
      status: "ok",
      message: `${experiments2.length} experiments active`,
      details: {
        experimentCount: experiments2.length,
        totalSessions: metrics.totalSessions,
        totalEvents: metrics.totalEvents
      }
    };
  } catch (error) {
    return { status: "error", message: error.message };
  }
}
async function checkDatabaseService() {
  const hasDbUrl = !!process.env.DATABASE_URL;
  if (!hasDbUrl) {
    return {
      status: "warning",
      message: "DATABASE_URL not configured",
      details: { connected: false }
    };
  }
  return {
    status: "ok",
    message: "Database URL configured",
    details: { connected: true }
  };
}
function calculateSummary(services) {
  const values = Object.values(services);
  return {
    totalServices: values.length,
    healthyServices: values.filter((s) => s.status === "ok").length,
    warnings: values.filter((s) => s.status === "warning").length,
    errors: values.filter((s) => s.status === "error").length
  };
}
function determineOverallStatus(summary) {
  if (summary.errors > 0) return "unhealthy";
  if (summary.warnings > 0) return "degraded";
  return "healthy";
}
var health_api_default = router5;

// server/routes/news-api.ts
import { Router as Router6 } from "express";

// server/repositories/news-repository.ts
import { readFileSync as readFileSync2, writeFileSync, existsSync } from "fs";
import { resolve as resolve2 } from "path";
var STORE_PATH = resolve2(process.cwd(), "content/news_store.json");
function generateId() {
  return `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
}
function transliterate(text2) {
  const map = {
    "\u0430": "a",
    "\u0431": "b",
    "\u0432": "v",
    "\u0433": "g",
    "\u0434": "d",
    "\u0435": "e",
    "\u0451": "yo",
    "\u0436": "zh",
    "\u0437": "z",
    "\u0438": "i",
    "\u0439": "y",
    "\u043A": "k",
    "\u043B": "l",
    "\u043C": "m",
    "\u043D": "n",
    "\u043E": "o",
    "\u043F": "p",
    "\u0440": "r",
    "\u0441": "s",
    "\u0442": "t",
    "\u0443": "u",
    "\u0444": "f",
    "\u0445": "kh",
    "\u0446": "ts",
    "\u0447": "ch",
    "\u0448": "sh",
    "\u0449": "sch",
    "\u044A": "",
    "\u044B": "y",
    "\u044C": "",
    "\u044D": "e",
    "\u044E": "yu",
    "\u044F": "ya"
  };
  return text2.toLowerCase().split("").map((c) => map[c] || c).join("").replace(/[^a-z0-9]+/g, "-").replace(/^-+|-+$/g, "").substring(0, 100);
}
var FileNewsRepository = class {
  cache = null;
  loadStore() {
    if (this.cache) return this.cache;
    if (!existsSync(STORE_PATH)) {
      const empty = { articles: [], distributionJobs: [], lastUpdated: null };
      writeFileSync(STORE_PATH, JSON.stringify(empty, null, 2));
      this.cache = empty;
      return empty;
    }
    const data = readFileSync2(STORE_PATH, "utf-8");
    this.cache = JSON.parse(data);
    return this.cache;
  }
  saveStore(store) {
    store.lastUpdated = (/* @__PURE__ */ new Date()).toISOString();
    this.cache = store;
    writeFileSync(STORE_PATH, JSON.stringify(store, null, 2));
  }
  async upsertByExternalId(payload) {
    const store = this.loadStore();
    const existing = store.articles.find((a) => a.externalId === payload.externalId);
    if (existing) {
      const updated = { ...existing, ...payload, updatedAt: (/* @__PURE__ */ new Date()).toISOString() };
      const index = store.articles.findIndex((a) => a.id === existing.id);
      store.articles[index] = updated;
      this.saveStore(store);
      return updated;
    }
    return this.create({
      ...payload,
      slug: payload.slug || transliterate(payload.title || "untitled"),
      title: payload.title || "Untitled",
      excerpt: payload.excerpt || "",
      contentMarkdown: payload.contentMarkdown || "",
      contentHtml: payload.contentHtml || "",
      coverImageUrl: payload.coverImageUrl || null,
      tags: payload.tags || [],
      category: payload.category || null,
      geo: payload.geo || null,
      status: payload.status || "draft",
      publishedAt: payload.publishedAt || null,
      seo: payload.seo || {},
      aeo: payload.aeo || {},
      source: payload.source || { type: "n8n" }
    });
  }
  async create(payload) {
    const store = this.loadStore();
    const now = (/* @__PURE__ */ new Date()).toISOString();
    const post = {
      ...payload,
      id: generateId(),
      createdAt: now,
      updatedAt: now
    };
    store.articles.push(post);
    this.saveStore(store);
    return post;
  }
  async update(id, patch) {
    const store = this.loadStore();
    const index = store.articles.findIndex((a) => a.id === id);
    if (index === -1) return null;
    const updated = {
      ...store.articles[index],
      ...patch,
      updatedAt: (/* @__PURE__ */ new Date()).toISOString()
    };
    store.articles[index] = updated;
    this.saveStore(store);
    return updated;
  }
  async getBySlug(slug) {
    const store = this.loadStore();
    return store.articles.find((a) => a.slug === slug) || null;
  }
  async getById(id) {
    const store = this.loadStore();
    return store.articles.find((a) => a.id === id) || null;
  }
  async list(options) {
    const store = this.loadStore();
    let items = [...store.articles];
    if (options.status) {
      items = items.filter((a) => a.status === options.status);
    }
    if (options.tag) {
      items = items.filter((a) => a.tags.includes(options.tag));
    }
    items.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
    const total = items.length;
    const offset = options.offset || 0;
    const limit = options.limit || 20;
    items = items.slice(offset, offset + limit);
    return { items, total };
  }
  async publish(id) {
    return this.update(id, {
      status: "published",
      publishedAt: (/* @__PURE__ */ new Date()).toISOString()
    });
  }
  async delete(id) {
    const store = this.loadStore();
    const index = store.articles.findIndex((a) => a.id === id);
    if (index === -1) return false;
    store.articles.splice(index, 1);
    this.saveStore(store);
    return true;
  }
  async createDistributionJob(job) {
    const store = this.loadStore();
    const newJob = { ...job, id: generateId() };
    store.distributionJobs.push(newJob);
    this.saveStore(store);
    return newJob;
  }
  async updateDistributionJob(id, patch) {
    const store = this.loadStore();
    const index = store.distributionJobs.findIndex((j) => j.id === id);
    if (index === -1) return null;
    store.distributionJobs[index] = { ...store.distributionJobs[index], ...patch };
    this.saveStore(store);
    return store.distributionJobs[index];
  }
  async getDistributionJobs(postId) {
    const store = this.loadStore();
    return store.distributionJobs.filter((j) => j.postId === postId);
  }
  async getPendingJobs() {
    const store = this.loadStore();
    return store.distributionJobs.filter((j) => j.status === "queued");
  }
  /**
   * Ensure outbox jobs exist for all 15 platforms (idempotent)
   * Creates/updates jobs based on current platform settings
   */
  async ensureOutboxForPost(postId, settings2, siteUrl) {
    const store = this.loadStore();
    const post = store.articles.find((a) => a.id === postId);
    if (!post) {
      throw new Error(`Post not found: ${postId}`);
    }
    const now = (/* @__PURE__ */ new Date()).toISOString();
    const platformIds = Object.keys(settings2);
    const result = [];
    for (const platformId of platformIds) {
      const setting = settings2[platformId];
      const existingJob = store.distributionJobs.find(
        (j) => j.postId === postId && j.platform === platformId
      );
      const utmUrl = `${siteUrl}/news/${post.slug}?utm_source=${platformId}&utm_medium=social&utm_campaign=news&utm_content=${post.slug}`;
      const payload = {
        title: post.title,
        excerpt: post.excerpt,
        url: utmUrl,
        image: post.coverImageUrl,
        tags: post.tags,
        publishedAt: post.publishedAt
      };
      if (existingJob) {
        const newStatus = setting.enabled ? existingJob.status === "posted" || existingJob.status === "published" ? existingJob.status : "queued" : "disabled";
        const index = store.distributionJobs.findIndex((j) => j.id === existingJob.id);
        store.distributionJobs[index] = {
          ...existingJob,
          status: newStatus,
          payload,
          backlinkUrl: utmUrl,
          updatedAt: now
        };
        result.push(store.distributionJobs[index]);
      } else {
        const newJob = {
          id: generateId(),
          postId,
          platform: platformId,
          status: setting.enabled ? "queued" : "disabled",
          attempts: 0,
          scheduledAt: now,
          postedAt: null,
          remoteUrl: null,
          backlinkUrl: utmUrl,
          lastError: null,
          payload,
          createdAt: now,
          updatedAt: now
        };
        store.distributionJobs.push(newJob);
        result.push(newJob);
      }
    }
    this.saveStore(store);
    return result;
  }
  /**
   * Get queued jobs for n8n dispatch
   */
  async getQueuedJobs(options) {
    const store = this.loadStore();
    let jobs = store.distributionJobs.filter((j) => j.status === "queued");
    if (options?.platforms && options.platforms.length > 0) {
      jobs = jobs.filter((j) => options.platforms.includes(j.platform));
    }
    if (options?.limit) {
      jobs = jobs.slice(0, options.limit);
    }
    const now = (/* @__PURE__ */ new Date()).toISOString();
    for (const job of jobs) {
      const index = store.distributionJobs.findIndex((j) => j.id === job.id);
      if (index !== -1) {
        store.distributionJobs[index].status = "posting";
        store.distributionJobs[index].updatedAt = now;
      }
    }
    this.saveStore(store);
    return jobs;
  }
  /**
   * Mark jobs batch from n8n callback
   */
  async markJobsBatch(results) {
    const store = this.loadStore();
    const now = (/* @__PURE__ */ new Date()).toISOString();
    const updated = [];
    for (const result of results) {
      const index = store.distributionJobs.findIndex((j) => j.id === result.id);
      if (index === -1) continue;
      const job = store.distributionJobs[index];
      job.status = result.status;
      job.updatedAt = now;
      if (result.status === "published" || result.status === "posted") {
        job.postedAt = now;
        job.remoteUrl = result.remoteUrl || null;
      }
      if (result.status === "failed") {
        job.lastError = result.error || "Unknown error";
        job.attempts = (job.attempts || 0) + 1;
      }
      updated.push(job);
    }
    this.saveStore(store);
    return updated;
  }
};
var newsRepository = new FileNewsRepository();

// server/services/distribution-settings.ts
import { readFileSync as readFileSync3, writeFileSync as writeFileSync2, existsSync as existsSync2 } from "fs";
import { resolve as resolve3 } from "path";

// shared/newsPlatforms.ts
var NEWS_PLATFORMS = [
  {
    id: "telegram",
    title: "Telegram",
    iconKey: "telegram",
    requiresProfileUrl: true,
    defaultEnabled: false,
    utmSource: "telegram",
    shareUrlTemplate: "https://t.me/share/url?url={url}&text={title}"
  },
  {
    id: "vk",
    title: "\u0412\u041A\u043E\u043D\u0442\u0430\u043A\u0442\u0435",
    iconKey: "vk",
    requiresProfileUrl: true,
    defaultEnabled: false,
    utmSource: "vk",
    shareUrlTemplate: "https://vk.com/share.php?url={url}&title={title}"
  },
  {
    id: "dzen",
    title: "\u0414\u0437\u0435\u043D",
    iconKey: "dzen",
    requiresProfileUrl: true,
    defaultEnabled: false,
    utmSource: "dzen"
  },
  {
    id: "tenchat",
    title: "TenChat",
    iconKey: "tenchat",
    requiresProfileUrl: true,
    defaultEnabled: false,
    utmSource: "tenchat"
  },
  {
    id: "vc",
    title: "VC.ru",
    iconKey: "vc",
    requiresProfileUrl: true,
    defaultEnabled: false,
    utmSource: "vc"
  },
  {
    id: "habr",
    title: "\u0425\u0430\u0431\u0440",
    iconKey: "habr",
    requiresProfileUrl: true,
    defaultEnabled: false,
    utmSource: "habr"
  },
  {
    id: "youtube",
    title: "YouTube",
    iconKey: "youtube",
    requiresProfileUrl: true,
    defaultEnabled: false,
    utmSource: "youtube"
  },
  {
    id: "rutube",
    title: "Rutube",
    iconKey: "rutube",
    requiresProfileUrl: true,
    defaultEnabled: false,
    utmSource: "rutube"
  },
  {
    id: "ok",
    title: "\u041E\u0434\u043D\u043E\u043A\u043B\u0430\u0441\u0441\u043D\u0438\u043A\u0438",
    iconKey: "ok",
    requiresProfileUrl: true,
    defaultEnabled: false,
    utmSource: "ok",
    shareUrlTemplate: "https://connect.ok.ru/offer?url={url}&title={title}"
  },
  {
    id: "yandex_business",
    title: "\u042F\u043D\u0434\u0435\u043A\u0441 \u0411\u0438\u0437\u043D\u0435\u0441",
    iconKey: "yandex",
    requiresProfileUrl: true,
    defaultEnabled: false,
    utmSource: "yandex_business"
  },
  {
    id: "google_business",
    title: "Google \u041C\u043E\u0439 \u0411\u0438\u0437\u043D\u0435\u0441",
    iconKey: "google",
    requiresProfileUrl: true,
    defaultEnabled: false,
    utmSource: "google_business"
  },
  {
    id: "2gis",
    title: "2\u0413\u0418\u0421",
    iconKey: "2gis",
    requiresProfileUrl: true,
    defaultEnabled: false,
    utmSource: "2gis"
  },
  {
    id: "threads",
    title: "Threads",
    iconKey: "threads",
    requiresProfileUrl: true,
    defaultEnabled: false,
    utmSource: "threads"
  },
  {
    id: "linkedin",
    title: "LinkedIn",
    iconKey: "linkedin",
    requiresProfileUrl: true,
    defaultEnabled: false,
    utmSource: "linkedin",
    shareUrlTemplate: "https://www.linkedin.com/sharing/share-offsite/?url={url}"
  },
  {
    id: "email_digest",
    title: "Email \u0440\u0430\u0441\u0441\u044B\u043B\u043A\u0430",
    iconKey: "email",
    requiresProfileUrl: false,
    defaultEnabled: false,
    utmSource: "email"
  }
];
var PLATFORM_IDS = NEWS_PLATFORMS.map((p) => p.id);

// server/services/distribution-settings.ts
var SETTINGS_PATH = resolve3(process.cwd(), "content/news_distribution_settings.json");
var NEWS_STORE_PATH = resolve3(process.cwd(), "content/news_store.json");
function getDefaultSettings() {
  const platforms = {};
  for (const id of PLATFORM_IDS) {
    platforms[id] = {
      enabled: false,
      profileUrl: null,
      webhookTokenPlaceholder: null,
      updatedAt: null
    };
  }
  return { platforms, lastUpdated: null };
}
var DistributionSettingsService = class {
  cache = null;
  loadSettings() {
    if (this.cache) return this.cache;
    if (!existsSync2(SETTINGS_PATH)) {
      const defaults = getDefaultSettings();
      writeFileSync2(SETTINGS_PATH, JSON.stringify(defaults, null, 2));
      this.cache = defaults;
      return defaults;
    }
    const data = readFileSync3(SETTINGS_PATH, "utf-8");
    this.cache = JSON.parse(data);
    return this.cache;
  }
  saveSettings(store) {
    store.lastUpdated = (/* @__PURE__ */ new Date()).toISOString();
    this.cache = store;
    writeFileSync2(SETTINGS_PATH, JSON.stringify(store, null, 2));
  }
  /**
   * Получить настройки всех платформ
   */
  getPlatformSettings() {
    const store = this.loadSettings();
    return store.platforms;
  }
  /**
   * Получить настройку одной платформы
   */
  getPlatformSetting(platformId) {
    const store = this.loadSettings();
    return store.platforms[platformId] || null;
  }
  /**
   * Обновить настройку платформы
   */
  updatePlatformSetting(platformId, patch) {
    if (!PLATFORM_IDS.includes(platformId)) {
      return null;
    }
    const store = this.loadSettings();
    const current = store.platforms[platformId] || getDefaultSettings().platforms[platformId];
    store.platforms[platformId] = {
      ...current,
      ...patch,
      updatedAt: (/* @__PURE__ */ new Date()).toISOString()
    };
    this.saveSettings(store);
    return store.platforms[platformId];
  }
  /**
   * Обновить несколько настроек сразу
   */
  updateMultiplePlatformSettings(updates) {
    const store = this.loadSettings();
    for (const update of updates) {
      const { platformId, ...patch } = update;
      if (!PLATFORM_IDS.includes(platformId)) continue;
      const current = store.platforms[platformId] || getDefaultSettings().platforms[platformId];
      store.platforms[platformId] = {
        ...current,
        ...patch,
        updatedAt: (/* @__PURE__ */ new Date()).toISOString()
      };
    }
    this.saveSettings(store);
    return store.platforms;
  }
  /**
   * Получить агрегированный статус по каждой платформе
   * (последний статус и дата последней попытки из distributionJobs)
   */
  getAggregatedStatus() {
    const result = {};
    for (const id of PLATFORM_IDS) {
      result[id] = {
        lastStatus: null,
        lastAttemptAt: null,
        publishedCount: 0,
        failedCount: 0
      };
    }
    if (!existsSync2(NEWS_STORE_PATH)) {
      return result;
    }
    try {
      const storeData = readFileSync3(NEWS_STORE_PATH, "utf-8");
      const store = JSON.parse(storeData);
      const jobs = store.distributionJobs || [];
      for (const job of jobs) {
        if (!result[job.platform]) continue;
        const agg = result[job.platform];
        if (job.status === "posted" || job.status === "published") {
          agg.publishedCount++;
        } else if (job.status === "failed") {
          agg.failedCount++;
        }
        const attemptAt = job.postedAt || job.scheduledAt;
        if (attemptAt) {
          if (!agg.lastAttemptAt || new Date(attemptAt) > new Date(agg.lastAttemptAt)) {
            agg.lastAttemptAt = attemptAt;
            agg.lastStatus = job.status;
          }
        }
      }
    } catch (e) {
      console.error("Failed to aggregate distribution status:", e);
    }
    return result;
  }
  /**
   * Получить публичные настройки (без секретов)
   */
  getPublicSettings() {
    const settings2 = this.getPlatformSettings();
    const result = {};
    for (const [id, setting] of Object.entries(settings2)) {
      result[id] = {
        enabled: setting.enabled,
        profileUrl: setting.profileUrl
      };
    }
    return result;
  }
  /**
   * Сброс кэша (для тестов)
   */
  clearCache() {
    this.cache = null;
  }
};
var distributionSettingsService = new DistributionSettingsService();

// server/routes/news-api.ts
import { z as z6 } from "zod";
var router6 = Router6();
var NEWS_SECRET = process.env.NEWS_INGEST_SECRET || "mspro-news-secret-dev";
var SITE_URL = process.env.SITE_URL || "https://mspro-ecosystems.replit.app";
var NEWS_CANONICAL_BASE = process.env.NEWS_CANONICAL_BASE || "/news";
function transliterate2(text2) {
  const map = {
    "\u0430": "a",
    "\u0431": "b",
    "\u0432": "v",
    "\u0433": "g",
    "\u0434": "d",
    "\u0435": "e",
    "\u0451": "yo",
    "\u0436": "zh",
    "\u0437": "z",
    "\u0438": "i",
    "\u0439": "y",
    "\u043A": "k",
    "\u043B": "l",
    "\u043C": "m",
    "\u043D": "n",
    "\u043E": "o",
    "\u043F": "p",
    "\u0440": "r",
    "\u0441": "s",
    "\u0442": "t",
    "\u0443": "u",
    "\u0444": "f",
    "\u0445": "kh",
    "\u0446": "ts",
    "\u0447": "ch",
    "\u0448": "sh",
    "\u0449": "sch",
    "\u044A": "",
    "\u044B": "y",
    "\u044C": "",
    "\u044D": "e",
    "\u044E": "yu",
    "\u044F": "ya"
  };
  return text2.toLowerCase().split("").map((c) => map[c] || c).join("").replace(/[^a-z0-9]+/g, "-").replace(/^-+|-+$/g, "").substring(0, 100);
}
function authMiddleware(req, res, next) {
  const secret = req.headers["x-mspro-news-secret"];
  if (secret !== NEWS_SECRET) {
    res.status(401).json({ ok: false, error: "Unauthorized" });
    return;
  }
  next();
}
function generateShareLinks(slug) {
  const baseUrl = `${SITE_URL}${NEWS_CANONICAL_BASE}/${slug}`;
  const utmBase = `utm_medium=social&utm_campaign=news&utm_content=${slug}`;
  return {
    telegram: `${baseUrl}?utm_source=telegram&${utmBase}`,
    vk: `${baseUrl}?utm_source=vk&${utmBase}`,
    dzen: `${baseUrl}?utm_source=dzen&${utmBase}`,
    ok: `${baseUrl}?utm_source=ok&${utmBase}`,
    linkedin: `${baseUrl}?utm_source=linkedin&${utmBase}`,
    twitter: `${baseUrl}?utm_source=twitter&${utmBase}`,
    facebook: `${baseUrl}?utm_source=facebook&${utmBase}`,
    reddit: `${baseUrl}?utm_source=reddit&${utmBase}`,
    medium: `${baseUrl}?utm_source=medium&${utmBase}`
  };
}
function generateCanonicalUrl(slug) {
  return `${SITE_URL}${NEWS_CANONICAL_BASE}/${slug}`;
}
var ingestSchema = z6.object({
  externalId: z6.string().min(1),
  slug: z6.string().optional(),
  title: z6.string().min(3),
  excerpt: z6.string().optional(),
  contentMarkdown: z6.string().optional(),
  contentHtml: z6.string().optional(),
  tags: z6.array(z6.string()).optional(),
  category: z6.string().optional(),
  coverImageUrl: z6.string().url().optional().nullable(),
  geo: z6.object({
    regionCode: z6.string().optional(),
    city: z6.string().optional()
  }).optional().nullable(),
  status: z6.enum(["draft", "scheduled", "published"]).optional()
});
var USE_DATABASE = false;
router6.post("/ingest", authMiddleware, async (req, res) => {
  try {
    const payload = ingestSchema.parse(req.body);
    const slug = payload.slug || transliterate2(payload.title);
    const canonicalUrl = generateCanonicalUrl(slug);
    const shareLinks = generateShareLinks(slug);
    const now = /* @__PURE__ */ new Date();
    if (USE_DATABASE) {
      const existing = await storage.getNewsArticleBySlug(slug);
      const articleData = {
        externalId: payload.externalId,
        slug,
        title: payload.title,
        excerpt: payload.excerpt || "",
        content: payload.contentHtml || payload.contentMarkdown || "",
        contentMarkdown: payload.contentMarkdown || "",
        contentHtml: payload.contentHtml || payload.contentMarkdown || "",
        coverImage: payload.coverImageUrl || null,
        tags: payload.tags || [],
        category: payload.category || null,
        geoRegionCode: payload.geo?.regionCode || null,
        geoCity: payload.geo?.city || null,
        status: payload.status || "draft",
        publishedAt: payload.status === "published" ? now : null,
        canonicalUrl,
        metaTitle: payload.title,
        metaDescription: payload.excerpt || "",
        sourceType: "n8n",
        sourceRef: payload.externalId
      };
      let post2;
      if (existing) {
        post2 = await storage.updateNewsArticle(existing.id, articleData);
      } else {
        post2 = await storage.createNewsArticle(articleData);
      }
      return res.json({ ok: true, post: post2, canonicalUrl, shareLinks });
    }
    const postData = {
      externalId: payload.externalId,
      slug,
      title: payload.title,
      excerpt: payload.excerpt || "",
      contentMarkdown: payload.contentMarkdown || "",
      contentHtml: payload.contentHtml || payload.contentMarkdown || "",
      coverImageUrl: payload.coverImageUrl || null,
      tags: payload.tags || [],
      category: payload.category || null,
      geo: payload.geo || null,
      status: payload.status || "draft",
      publishedAt: payload.status === "published" ? now.toISOString() : null,
      seo: { title: payload.title, description: payload.excerpt || "", canonicalUrl },
      aeo: {},
      source: { type: "n8n", ref: payload.externalId }
    };
    const post = await newsRepository.upsertByExternalId(postData);
    res.json({ ok: true, post, canonicalUrl, shareLinks });
  } catch (error) {
    if (error.name === "ZodError") {
      return res.status(400).json({ ok: false, error: "Validation failed", details: error.errors });
    }
    res.status(500).json({ ok: false, error: error.message });
  }
});
router6.get("/", async (req, res) => {
  try {
    const { status = "published", limit = "20", offset = "0" } = req.query;
    if (USE_DATABASE) {
      const articles = await storage.getAllNewsArticles(status);
      const offsetNum = parseInt(offset);
      const limitNum = parseInt(limit);
      const items = articles.slice(offsetNum, offsetNum + limitNum);
      return res.json({
        ok: true,
        items: items.map((a) => ({
          id: a.id,
          slug: a.slug,
          title: a.title,
          excerpt: a.excerpt,
          coverImageUrl: a.coverImage,
          category: a.category,
          tags: a.tags,
          publishedAt: a.publishedAt,
          createdAt: a.createdAt
        })),
        total: articles.length,
        limit: limitNum,
        offset: offsetNum
      });
    }
    const result = await newsRepository.list({
      status,
      limit: parseInt(limit),
      offset: parseInt(offset)
    });
    res.json({
      ok: true,
      items: result.items,
      total: result.total,
      limit: parseInt(limit),
      offset: parseInt(offset)
    });
  } catch (error) {
    res.status(500).json({ ok: false, error: error.message });
  }
});
router6.get("/rss.xml", async (req, res) => {
  try {
    const { items } = await newsRepository.list({ status: "published", limit: 50 });
    const rssItems = items.map((post) => `
    <item>
      <title><![CDATA[${post.title}]]></title>
      <link>${generateCanonicalUrl(post.slug)}</link>
      <description><![CDATA[${post.excerpt}]]></description>
      <pubDate>${new Date(post.publishedAt || post.createdAt).toUTCString()}</pubDate>
      <guid isPermaLink="true">${generateCanonicalUrl(post.slug)}</guid>
      ${post.category ? `<category>${post.category}</category>` : ""}
      ${post.coverImageUrl ? `<enclosure url="${post.coverImageUrl}" type="image/jpeg"/>` : ""}
    </item>`).join("\n");
    const rss = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom">
  <channel>
    <title>MSPRO \u041D\u043E\u0432\u043E\u0441\u0442\u0438</title>
    <link>${SITE_URL}/news</link>
    <description>\u041D\u043E\u0432\u043E\u0441\u0442\u0438 \u043A\u043E\u043C\u043F\u0430\u043D\u0438\u0438 MSPRO - \u043F\u0440\u043E\u043C\u044B\u0448\u043B\u0435\u043D\u043D\u0430\u044F \u043F\u043E\u043A\u0440\u0430\u0441\u043A\u0430 \u0438 \u0430\u043D\u0442\u0438\u043A\u043E\u0440\u0440\u043E\u0437\u0438\u0439\u043D\u0430\u044F \u0437\u0430\u0449\u0438\u0442\u0430</description>
    <language>ru</language>
    <lastBuildDate>${(/* @__PURE__ */ new Date()).toUTCString()}</lastBuildDate>
    <atom:link href="${SITE_URL}/api/news/rss.xml" rel="self" type="application/rss+xml"/>
    ${rssItems}
  </channel>
</rss>`;
    res.type("application/rss+xml").send(rss);
  } catch (error) {
    res.status(500).json({ ok: false, error: error.message });
  }
});
router6.get("/sitemap.xml", async (req, res) => {
  try {
    const { items } = await newsRepository.list({ status: "published", limit: 1e3 });
    const urls = items.map((post) => `
  <url>
    <loc>${generateCanonicalUrl(post.slug)}</loc>
    <news:news>
      <news:publication>
        <news:name>MSPRO</news:name>
        <news:language>ru</news:language>
      </news:publication>
      <news:publication_date>${(post.publishedAt || post.createdAt).split("T")[0]}</news:publication_date>
      <news:title><![CDATA[${post.title}]]></news:title>
    </news:news>
    <lastmod>${post.updatedAt}</lastmod>
  </url>`).join("\n");
    const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"
        xmlns:news="http://www.google.com/schemas/sitemap-news/0.9">
  ${urls}
</urlset>`;
    res.type("application/xml").send(sitemap);
  } catch (error) {
    res.status(500).json({ ok: false, error: error.message });
  }
});
var platformUpdateSchema = z6.object({
  platformId: z6.string(),
  enabled: z6.boolean().optional(),
  profileUrl: z6.string().nullable().optional(),
  webhookTokenPlaceholder: z6.string().nullable().optional()
});
router6.get("/platforms", async (req, res) => {
  try {
    const secret = req.headers["x-mspro-news-secret"];
    const isAdmin = secret === NEWS_SECRET;
    const settings2 = isAdmin ? distributionSettingsService.getPlatformSettings() : distributionSettingsService.getPublicSettings();
    const aggregated = distributionSettingsService.getAggregatedStatus();
    res.json({
      ok: true,
      platforms: NEWS_PLATFORMS,
      settings: settings2,
      aggregated
    });
  } catch (error) {
    res.status(500).json({ ok: false, error: error.message });
  }
});
router6.put("/platforms", authMiddleware, async (req, res) => {
  try {
    const payload = platformUpdateSchema.parse(req.body);
    if (!PLATFORM_IDS.includes(payload.platformId)) {
      return res.status(400).json({ ok: false, error: "Unknown platform" });
    }
    const { platformId, ...patch } = payload;
    const updated = distributionSettingsService.updatePlatformSetting(platformId, patch);
    res.json({ ok: true, setting: updated });
  } catch (error) {
    if (error.name === "ZodError") {
      return res.status(400).json({ ok: false, error: "Validation failed", details: error.errors });
    }
    res.status(500).json({ ok: false, error: error.message });
  }
});
router6.get("/:slug", async (req, res) => {
  try {
    const { slug } = req.params;
    const draft = req.query.draft === "1";
    const secret = req.headers["x-mspro-news-secret"];
    if (USE_DATABASE) {
      const article = await storage.getNewsArticleBySlug(slug);
      if (!article) {
        return res.status(404).json({ ok: false, error: "Not found" });
      }
      if (article.status !== "published" && !(draft && secret === NEWS_SECRET)) {
        return res.status(404).json({ ok: false, error: "Not found" });
      }
      const canonicalUrl2 = generateCanonicalUrl(slug);
      const shareLinks2 = generateShareLinks(slug);
      return res.json({
        ok: true,
        post: {
          id: article.id,
          slug: article.slug,
          title: article.title,
          excerpt: article.excerpt,
          contentMarkdown: article.contentMarkdown,
          contentHtml: article.contentHtml || article.content,
          coverImageUrl: article.coverImage,
          category: article.category,
          tags: article.tags,
          publishedAt: article.publishedAt,
          createdAt: article.createdAt,
          updatedAt: article.updatedAt,
          seo: { title: article.metaTitle, description: article.metaDescription }
        },
        canonicalUrl: canonicalUrl2,
        shareLinks: shareLinks2,
        meta: {
          title: article.metaTitle || article.title,
          description: article.metaDescription || article.excerpt,
          image: article.ogImage || article.coverImage,
          jsonLd: {
            "@context": "https://schema.org",
            "@type": "NewsArticle",
            headline: article.title,
            description: article.excerpt,
            image: article.coverImage,
            datePublished: article.publishedAt,
            dateModified: article.updatedAt,
            author: { "@type": "Organization", name: "MSPRO" },
            publisher: { "@type": "Organization", name: "MSPRO" }
          }
        }
      });
    }
    const post = await newsRepository.getBySlug(slug);
    if (!post) {
      return res.status(404).json({ ok: false, error: "Not found" });
    }
    if (post.status !== "published" && !(draft && secret === NEWS_SECRET)) {
      return res.status(404).json({ ok: false, error: "Not found" });
    }
    const canonicalUrl = generateCanonicalUrl(slug);
    const shareLinks = generateShareLinks(slug);
    res.json({
      ok: true,
      post,
      canonicalUrl,
      shareLinks,
      meta: {
        title: post.seo?.title || post.title,
        description: post.seo?.description || post.excerpt,
        image: post.coverImageUrl,
        jsonLd: {
          "@context": "https://schema.org",
          "@type": "NewsArticle",
          headline: post.title,
          description: post.excerpt,
          image: post.coverImageUrl,
          datePublished: post.publishedAt,
          dateModified: post.updatedAt,
          author: { "@type": "Organization", name: "MSPRO" },
          publisher: { "@type": "Organization", name: "MSPRO" }
        }
      }
    });
  } catch (error) {
    res.status(500).json({ ok: false, error: error.message });
  }
});
router6.post("/:id/publish", authMiddleware, async (req, res) => {
  try {
    const { id } = req.params;
    const post = await newsRepository.publish(id);
    if (!post) {
      return res.status(404).json({ ok: false, error: "Not found" });
    }
    const settings2 = distributionSettingsService.getPlatformSettings();
    const jobs = await newsRepository.ensureOutboxForPost(id, settings2, SITE_URL);
    res.json({ ok: true, post, outboxJobs: jobs.length });
  } catch (error) {
    res.status(500).json({ ok: false, error: error.message });
  }
});
router6.post("/distribution/enqueue", authMiddleware, async (req, res) => {
  try {
    const { postId, platforms } = req.body;
    if (!postId || !platforms || !Array.isArray(platforms)) {
      return res.status(400).json({ ok: false, error: "postId and platforms[] required" });
    }
    const post = await newsRepository.getById(postId);
    if (!post) {
      return res.status(404).json({ ok: false, error: "Post not found" });
    }
    const shareLinks = generateShareLinks(post.slug);
    const jobs = [];
    for (const platform of platforms) {
      const job = await newsRepository.createDistributionJob({
        postId,
        platform,
        status: "queued",
        attempts: 0,
        scheduledAt: (/* @__PURE__ */ new Date()).toISOString(),
        postedAt: null,
        remoteUrl: null,
        backlinkUrl: shareLinks[platform] || generateCanonicalUrl(post.slug),
        lastError: null
      });
      jobs.push(job);
    }
    res.json({ ok: true, jobs });
  } catch (error) {
    res.status(500).json({ ok: false, error: error.message });
  }
});
router6.post("/distribution/callback", authMiddleware, async (req, res) => {
  try {
    const { jobId, status, remoteUrl, error: errorMsg } = req.body;
    if (!jobId) {
      return res.status(400).json({ ok: false, error: "jobId required" });
    }
    const job = await newsRepository.updateDistributionJob(jobId, {
      status: status || "posted",
      remoteUrl: remoteUrl || null,
      postedAt: status === "posted" ? (/* @__PURE__ */ new Date()).toISOString() : null,
      lastError: errorMsg || null
    });
    if (!job) {
      return res.status(404).json({ ok: false, error: "Job not found" });
    }
    res.json({ ok: true, job });
  } catch (error) {
    res.status(500).json({ ok: false, error: error.message });
  }
});
router6.get("/distribution/jobs", authMiddleware, async (req, res) => {
  try {
    const { postId } = req.query;
    if (postId) {
      const jobs = await newsRepository.getDistributionJobs(postId);
      return res.json({ ok: true, jobs });
    }
    const pending = await newsRepository.getPendingJobs();
    res.json({ ok: true, jobs: pending });
  } catch (error) {
    res.status(500).json({ ok: false, error: error.message });
  }
});
router6.post("/compile", authMiddleware, async (req, res) => {
  try {
    const { rawMaterial } = req.body;
    res.json({
      ok: true,
      status: "queued",
      message: "ConfiuiAI compilation queued (stub)",
      material: rawMaterial ? "received" : "empty"
    });
  } catch (error) {
    res.status(500).json({ ok: false, error: error.message });
  }
});
var dispatchSchema = z6.object({
  limit: z6.number().optional().default(10),
  platforms: z6.array(z6.string()).optional()
});
var markSchema = z6.object({
  results: z6.array(z6.object({
    id: z6.string(),
    status: z6.enum(["published", "posted", "failed"]),
    remoteUrl: z6.string().optional(),
    error: z6.string().optional()
  }))
});
router6.post("/outbox/dispatch", authMiddleware, async (req, res) => {
  try {
    const payload = dispatchSchema.parse(req.body || {});
    const jobs = await newsRepository.getQueuedJobs({
      limit: payload.limit,
      platforms: payload.platforms
    });
    res.json({
      ok: true,
      items: jobs,
      count: jobs.length
    });
  } catch (error) {
    if (error.name === "ZodError") {
      return res.status(400).json({ ok: false, error: "Validation failed", details: error.errors });
    }
    res.status(500).json({ ok: false, error: error.message });
  }
});
router6.post("/outbox/mark", authMiddleware, async (req, res) => {
  try {
    const payload = markSchema.parse(req.body);
    const updated = await newsRepository.markJobsBatch(payload.results);
    res.json({
      ok: true,
      updated: updated.length
    });
  } catch (error) {
    if (error.name === "ZodError") {
      return res.status(400).json({ ok: false, error: "Validation failed", details: error.errors });
    }
    res.status(500).json({ ok: false, error: error.message });
  }
});
var news_api_default = router6;

// server/routes.ts
async function registerRoutes(app2) {
  const publicDocsPath = resolve4(import.meta.dirname, "..", "public", "documents");
  app2.use("/documents", express.static(publicDocsPath));
  app2.use(geoContextMiddleware);
  app2.use("/api/seo", seo_api_default);
  app2.use("/api/geo", geo_api_default);
  app2.use("/api/aeo", aeo_api_default);
  app2.use("/api/ux", ux_api_default);
  app2.use("/api/health", health_api_default);
  app2.get("/robots.txt", (req, res) => {
    res.type("text/plain");
    res.send(`User-agent: *
Allow: /
Sitemap: https://mspro-ltd.ru/api/news/sitemap.xml`);
  });
  app2.use("/api/news", news_api_default);
  app2.post("/api/admin/login", (req, res) => {
    const { password } = req.body;
    const adminPassword = process.env.ADMIN_PASSWORD;
    if (!adminPassword || password !== adminPassword) {
      return res.status(401).json({ error: "Invalid password" });
    }
    res.json({ success: true });
  });
  const adminAuth = (req, res, next) => {
    const authHeader = req.headers.authorization;
    const adminPassword = process.env.ADMIN_PASSWORD;
    if (!adminPassword || authHeader !== `Bearer ${adminPassword}`) {
      return res.status(401).json({ error: "Unauthorized" });
    }
    next();
  };
  app2.get("/api/admin/leads", adminAuth, async (req, res) => {
    try {
      const leads2 = await storage.getAllLeads();
      res.json(leads2);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  });
  app2.patch("/api/admin/leads/:id", adminAuth, async (req, res) => {
    try {
      const { id } = req.params;
      const updated = await storage.updateLead(id, req.body);
      if (!updated) return res.status(404).json({ error: "Lead not found" });
      res.json(updated);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  });
  app2.delete("/api/admin/leads/:id", adminAuth, async (req, res) => {
    try {
      const { id } = req.params;
      await storage.deleteLead(id);
      res.json({ success: true });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  });
  app2.get("/api/admin/settings", adminAuth, async (req, res) => {
    try {
      const n8nUrl = await storage.getSettings("n8n_webhook_url");
      const supabaseUrl = await storage.getSettings("external_supabase_url");
      res.json({
        n8n_webhook_url: n8nUrl?.value || "",
        external_supabase_url: supabaseUrl?.value || ""
      });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  });
  app2.post("/api/admin/settings", adminAuth, async (req, res) => {
    try {
      const { n8n_webhook_url, external_supabase_url } = req.body;
      if (n8n_webhook_url !== void 0) await storage.updateSetting("n8n_webhook_url", n8n_webhook_url);
      if (external_supabase_url !== void 0) await storage.updateSetting("external_supabase_url", external_supabase_url);
      res.json({ success: true });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  });
  app2.post("/api/leads", async (req, res) => {
    try {
      const validatedData = insertLeadSchema.parse(req.body);
      if (!validatedData.city) {
        const forwardedFor = req.headers["x-forwarded-for"];
        let ip = forwardedFor ? forwardedFor.split(",")[0].trim() : req.socket.remoteAddress;
        if (ip && ip !== "::1" && ip !== "127.0.0.1") {
          try {
            const response = await fetch(`http://ip-api.com/json/${ip}?lang=ru`);
            const data = await response.json();
            if (data.status === "success" && data.city) {
              validatedData.city = data.city;
            }
          } catch (e) {
            console.error("Failed to resolve IP to city:", e);
          }
        }
      }
      const lead = await storage.createLead(validatedData);
      (async () => {
        try {
          const n8nSetting = await storage.getSettings("n8n_webhook_url");
          const n8nUrl = n8nSetting?.value || process.env.N8N_WEBHOOK_URL;
          if (n8nUrl) {
            const response = await fetch(n8nUrl, {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify(lead)
            });
            if (response.ok) {
              await storage.updateLead(lead.id, { n8nSynced: true });
            }
          }
          const extSupabaseUrl = await storage.getSettings("external_supabase_url");
          if (extSupabaseUrl?.value) {
          }
        } catch (err) {
          console.error("Background sync failed:", err);
        }
      })();
      res.json(lead);
    } catch (error) {
      if (error instanceof z7.ZodError) {
        console.error("Validation Error:", JSON.stringify(error.flatten(), null, 2));
      } else {
        console.error("Lead Error:", error);
      }
      res.status(400).json({ error: error.message });
    }
  });
  app2.get("/api/leads", async (req, res) => {
    try {
      const leads2 = await storage.getAllLeads();
      res.json(leads2);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  });
  app2.get("/api/leads/:id", async (req, res) => {
    try {
      const lead = await storage.getLead(req.params.id);
      if (!lead) {
        return res.status(404).json({ error: "Lead not found" });
      }
      res.json(lead);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  });
  app2.post("/api/calculations", async (req, res) => {
    try {
      const validatedData = insertCalculationSchema.parse(req.body);
      if (!validatedData.estimatedCost) {
        const baseRate = 5e3;
        const height = validatedData.height ? parseFloat(validatedData.height) : 0;
        const surfaceArea = validatedData.surfaceArea ? parseFloat(validatedData.surfaceArea) : 100;
        if (isNaN(height) || isNaN(surfaceArea)) {
          return res.status(400).json({
            error: "\u0412\u044B\u0441\u043E\u0442\u0430 \u0438 \u043F\u043B\u043E\u0449\u0430\u0434\u044C \u0434\u043E\u043B\u0436\u043D\u044B \u0431\u044B\u0442\u044C \u0447\u0438\u0441\u043B\u043E\u0432\u044B\u043C\u0438 \u0437\u043D\u0430\u0447\u0435\u043D\u0438\u044F\u043C\u0438"
          });
        }
        const heightCoef = height > 0 ? height / 10 : 1;
        const cost = Math.round(baseRate * surfaceArea * heightCoef);
        validatedData.estimatedCost = cost.toString();
      }
      const calculation = await storage.createCalculation(validatedData);
      res.json(calculation);
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  });
  app2.get("/api/calculations/:id", async (req, res) => {
    try {
      const calculation = await storage.getCalculation(req.params.id);
      if (!calculation) {
        return res.status(404).json({ error: "Calculation not found" });
      }
      res.json(calculation);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  });
  app2.get("/api/ai_seo", async (req, res) => {
    try {
      const slug = req.query.slug;
      if (!slug) {
        return res.status(400).json({ error: "slug parameter is required" });
      }
      const keyword = slug.replace(/-/g, " ");
      const content = await generatePageContent(keyword);
      const dynamicPath = resolve4(process.cwd(), "content", "seo_dynamic.json");
      let dynamicData = [];
      try {
        const fileContent = readFileSync4(dynamicPath, "utf-8");
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
        cta: "\u0420\u0430\u0441\u0441\u0447\u0438\u0442\u0430\u0442\u044C \u0441\u0442\u043E\u0438\u043C\u043E\u0441\u0442\u044C",
        region: "\u041C\u043E\u0441\u043A\u0432\u0430 \u0438 \u043E\u0431\u043B\u0430\u0441\u0442\u044C",
        faq: content.faq
      };
      const existingIndex = dynamicData.findIndex((e) => e.slug === slug);
      if (existingIndex >= 0) {
        dynamicData[existingIndex] = newEntry;
      } else {
        dynamicData.push(newEntry);
      }
      writeFileSync3(dynamicPath, JSON.stringify(dynamicData, null, 2), "utf-8");
      res.json(newEntry);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  });
  const httpServer = createServer(app2);
  return httpServer;
}

// server/vite.ts
import express2 from "express";
import fs from "fs";
import path2 from "path";
import { createServer as createViteServer, createLogger } from "vite";

// vite.config.ts
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import path from "path";
var vite_config_default = defineConfig({
  plugins: [
    react()
  ],
  resolve: {
    alias: {
      "@": path.resolve(import.meta.dirname, "client", "src"),
      "@shared": path.resolve(import.meta.dirname, "shared"),
      "@assets": path.resolve(import.meta.dirname, "attached_assets")
    }
  },
  root: path.resolve(import.meta.dirname, "client"),
  publicDir: path.resolve(import.meta.dirname, "public"),
  build: {
    outDir: path.resolve(import.meta.dirname, "dist/public"),
    emptyOutDir: true
  },
  server: {
    fs: {
      strict: true,
      deny: ["**/.*"]
    }
  }
});

// server/vite.ts
import { nanoid } from "nanoid";
var viteLogger = createLogger();
function log(message, source = "express") {
  const formattedTime = (/* @__PURE__ */ new Date()).toLocaleTimeString("en-US", {
    hour: "numeric",
    minute: "2-digit",
    second: "2-digit",
    hour12: true
  });
  console.log(`${formattedTime} [${source}] ${message}`);
}
async function setupVite(app2, server) {
  const serverOptions = {
    middlewareMode: true,
    hmr: { server },
    allowedHosts: true
  };
  const vite = await createViteServer({
    ...vite_config_default,
    configFile: false,
    customLogger: {
      ...viteLogger,
      error: (msg, options) => {
        viteLogger.error(msg, options);
        process.exit(1);
      }
    },
    server: serverOptions,
    appType: "custom"
  });
  app2.use(vite.middlewares);
  app2.use("*", async (req, res, next) => {
    const url = req.originalUrl;
    try {
      const clientTemplate = path2.resolve(
        import.meta.dirname,
        "..",
        "client",
        "index.html"
      );
      let template = await fs.promises.readFile(clientTemplate, "utf-8");
      template = template.replace(
        `src="/src/main.tsx"`,
        `src="/src/main.tsx?v=${nanoid()}"`
      );
      const page = await vite.transformIndexHtml(url, template);
      res.status(200).set({ "Content-Type": "text/html" }).end(page);
    } catch (e) {
      vite.ssrFixStacktrace(e);
      next(e);
    }
  });
}
function serveStatic(app2) {
  const distPath = path2.resolve(import.meta.dirname, "public");
  if (!fs.existsSync(distPath)) {
    throw new Error(
      `Could not find the build directory: ${distPath}, make sure to build the client first`
    );
  }
  app2.use(express2.static(distPath));
  app2.use("*", (_req, res) => {
    res.sendFile(path2.resolve(distPath, "index.html"));
  });
}

// server/index.ts
var app = express3();
app.use(express3.json());
app.use(express3.urlencoded({ extended: false }));
app.use((req, res, next) => {
  const start = Date.now();
  const path3 = req.path;
  let capturedJsonResponse = void 0;
  const originalResJson = res.json;
  res.json = function(bodyJson, ...args) {
    capturedJsonResponse = bodyJson;
    return originalResJson.apply(res, [bodyJson, ...args]);
  };
  res.on("finish", () => {
    const duration = Date.now() - start;
    if (path3.startsWith("/api")) {
      let logLine = `${req.method} ${path3} ${res.statusCode} in ${duration}ms`;
      if (capturedJsonResponse) {
        logLine += ` :: ${JSON.stringify(capturedJsonResponse)}`;
      }
      if (logLine.length > 80) {
        logLine = logLine.slice(0, 79) + "\u2026";
      }
      log(logLine);
    }
  });
  next();
});
(async () => {
  const server = await registerRoutes(app);
  app.use((err, _req, res, _next) => {
    const status = err.status || err.statusCode || 500;
    const message = err.message || "Internal Server Error";
    res.status(status).json({ message });
    throw err;
  });
  if (app.get("env") === "development") {
    await setupVite(app, server);
  } else {
    serveStatic(app);
  }
  const port = parseInt(process.env.PORT || "5000", 10);
  server.listen({
    port,
    host: "0.0.0.0"
  }, () => {
    log(`serving on port ${port}`);
  });
})();
