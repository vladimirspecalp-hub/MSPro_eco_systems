import { sql } from "drizzle-orm";
import { mysqlTable, text, varchar, timestamp, int, decimal, json } from "drizzle-orm/mysql-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const leads = mysqlTable("leads", {
  id: varchar("id", { length: 36 }).primaryKey().default(sql`(uuid())`),
  name: text("name").notNull(),
  phone: text("phone").notNull(),
  email: text("email").notNull(),
  serviceType: text("service_type").notNull(),
  message: text("message"),
  source: text("source"),
  attachments: json("attachments").$type<string[]>().default([]),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const calculations = mysqlTable("calculations", {
  id: varchar("id", { length: 36 }).primaryKey().default(sql`(uuid())`),
  serviceType: text("service_type").notNull(),
  height: decimal("height", { precision: 10, scale: 2 }),
  diameter: decimal("diameter", { precision: 10, scale: 2 }),
  surfaceArea: decimal("surface_area", { precision: 10, scale: 2 }),
  coatingType: text("coating_type"),
  estimatedCost: decimal("estimated_cost", { precision: 10, scale: 2 }),
  leadId: varchar("lead_id", { length: 36 }).references(() => leads.id),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const insertLeadSchema = createInsertSchema(leads).omit({
  id: true,
  createdAt: true,
}).extend({
  phone: z.string().min(10, "Телефон должен содержать минимум 10 цифр"),
  email: z.string().email("Введите корректный email").or(z.literal("")).default(""),
  name: z.string().min(2, "Имя должно содержать минимум 2 символа"),
  message: z.string().optional(),
  serviceType: z.enum([
    "chimney_painting",
    "anticorrosion",
    "rope_access",
    "fireproofing",
    "mspro_quad",
    "other",
    ""
  ]).or(z.string()),
  attachments: z.array(z.string()).optional(),
});

export const insertCalculationSchema = createInsertSchema(calculations).omit({
  id: true,
  createdAt: true,
}).extend({
  estimatedCost: z.string().optional(),
});

export type InsertLead = z.infer<typeof insertLeadSchema>;
export type Lead = typeof leads.$inferSelect;
export type InsertCalculation = z.infer<typeof insertCalculationSchema>;
export type Calculation = typeof calculations.$inferSelect;

/**
 * News Articles - основная таблица новостей
 * Поддерживает интеграцию с n8n для автоматического инжеста
 * Расширенная спецификация v2.0
 */
export const newsArticles = mysqlTable("news_articles", {
  id: varchar("id", { length: 36 }).primaryKey().default(sql`(uuid())`),
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
  tags: json("tags").$type<string[]>(),
  geoRegionCode: varchar("geo_region_code", { length: 50 }),
  geoCity: varchar("geo_city", { length: 255 }),
  status: varchar("status", { length: 50 }).default("draft").notNull(),
  publishedAt: timestamp("published_at"),
  canonicalUrl: text("canonical_url"),
  metaTitle: text("meta_title"),
  metaDescription: text("meta_description"),
  metaKeywords: json("meta_keywords").$type<string[]>(),
  ogImage: text("og_image"),
  jsonLd: text("json_ld"),
  aeoAnswerBlock: text("aeo_answer_block"),
  aeoFaq: text("aeo_faq"),
  sourceType: varchar("source_type", { length: 100 }),
  sourceRef: varchar("source_ref", { length: 255 }),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

/**
 * News Distribution Jobs - очередь кросспостинга на платформы
 * Реализует pattern "Outbox" для надёжной доставки
 * Расширенная спецификация v2.0
 */
export const newsOutbox = mysqlTable("news_outbox", {
  id: varchar("id", { length: 36 }).primaryKey().default(sql`(uuid())`),
  articleId: varchar("article_id", { length: 36 }).references(() => newsArticles.id).notNull(),
  platform: varchar("platform", { length: 100 }).notNull(),
  status: varchar("status", { length: 50 }).default("queued").notNull(),
  payload: text("payload"),
  externalId: varchar("external_id", { length: 255 }),
  externalUrl: text("external_url"),
  backlinkUrl: text("backlink_url"),
  errorMessage: text("error_message"),
  attempts: int("attempts").default(0),
  scheduledAt: timestamp("scheduled_at"),
  postedAt: timestamp("posted_at"),
  processedAt: timestamp("processed_at"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const insertNewsArticleSchema = createInsertSchema(newsArticles).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
}).extend({
  title: z.string().min(5, "Заголовок минимум 5 символов"),
  content: z.string().min(50, "Контент минимум 50 символов"),
  slug: z.string().regex(/^[a-z0-9-]+$/, "Slug только латиница, цифры и дефисы"),
});

export const insertNewsOutboxSchema = createInsertSchema(newsOutbox).omit({
  id: true,
  createdAt: true,
});

export type InsertNewsArticle = z.infer<typeof insertNewsArticleSchema>;
export type NewsArticle = typeof newsArticles.$inferSelect;
export type InsertNewsOutbox = z.infer<typeof insertNewsOutboxSchema>;
export type NewsOutbox = typeof newsOutbox.$inferSelect;
