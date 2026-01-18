import {
  type Lead, type InsertLead,
  type Calculation, type InsertCalculation,
  type NewsArticle, type InsertNewsArticle,
  type NewsOutbox, type InsertNewsOutbox,
  leads, calculations, newsArticles, newsOutbox
} from "@shared/schema";
import { db } from "./db";
import { eq, desc, and } from "drizzle-orm";
import { randomUUID } from "crypto";

export interface IStorage {
  createLead(lead: InsertLead): Promise<Lead>;
  getLead(id: string): Promise<Lead | undefined>;
  getAllLeads(): Promise<Lead[]>;
  createCalculation(calculation: InsertCalculation): Promise<Calculation>;
  getCalculation(id: string): Promise<Calculation | undefined>;
  getAllCalculations(): Promise<Calculation[]>;

  // News Articles
  createNewsArticle(article: InsertNewsArticle): Promise<NewsArticle>;
  getNewsArticle(id: string): Promise<NewsArticle | undefined>;
  getNewsArticleBySlug(slug: string): Promise<NewsArticle | undefined>;
  getAllNewsArticles(status?: string): Promise<NewsArticle[]>;
  updateNewsArticle(id: string, data: Partial<InsertNewsArticle>): Promise<NewsArticle | undefined>;
  deleteNewsArticle(id: string): Promise<boolean>;

  // News Outbox
  createOutboxEntry(entry: InsertNewsOutbox): Promise<NewsOutbox>;
  getOutboxEntry(id: string): Promise<NewsOutbox | undefined>;
  getOutboxByArticle(articleId: string): Promise<NewsOutbox[]>;
  getPendingOutbox(): Promise<NewsOutbox[]>;
  updateOutboxEntry(id: string, data: Partial<InsertNewsOutbox>): Promise<NewsOutbox | undefined>;
}

export class DatabaseStorage implements IStorage {
  async createLead(insertLead: InsertLead): Promise<Lead> {
    const id = randomUUID();
    await db.insert(leads).values({ ...insertLead, id });
    return (await this.getLead(id))!;
  }

  async getLead(id: string): Promise<Lead | undefined> {
    const [lead] = await db.select().from(leads).where(eq(leads.id, id));
    return lead;
  }

  async getAllLeads(): Promise<Lead[]> {
    return await db.select().from(leads);
  }

  async createCalculation(insertCalculation: InsertCalculation): Promise<Calculation> {
    const id = randomUUID();
    await db.insert(calculations).values({ ...insertCalculation, id });
    return (await this.getCalculation(id))!;
  }

  async getCalculation(id: string): Promise<Calculation | undefined> {
    const [calculation] = await db.select().from(calculations).where(eq(calculations.id, id));
    return calculation;
  }

  async getAllCalculations(): Promise<Calculation[]> {
    return await db.select().from(calculations);
  }

  // News Articles CRUD
  async createNewsArticle(article: InsertNewsArticle): Promise<NewsArticle> {
    const id = randomUUID();
    // Cast tags/keywords to any to satisfy Drizzle JSON type check against Zod array
    await db.insert(newsArticles).values({
      ...article,
      id,
      tags: article.tags as any,
      metaKeywords: article.metaKeywords as any
    });
    return (await this.getNewsArticle(id))!;
  }

  async getNewsArticle(id: string): Promise<NewsArticle | undefined> {
    const [article] = await db.select().from(newsArticles).where(eq(newsArticles.id, id));
    return article;
  }

  async getNewsArticleBySlug(slug: string): Promise<NewsArticle | undefined> {
    const [article] = await db.select().from(newsArticles).where(eq(newsArticles.slug, slug));
    return article;
  }

  async getAllNewsArticles(status?: string): Promise<NewsArticle[]> {
    if (status) {
      return await db.select().from(newsArticles)
        .where(eq(newsArticles.status, status))
        .orderBy(desc(newsArticles.publishedAt));
    }
    return await db.select().from(newsArticles).orderBy(desc(newsArticles.createdAt));
  }

  async updateNewsArticle(id: string, data: Partial<InsertNewsArticle>): Promise<NewsArticle | undefined> {
    const updateData: any = { ...data };
    if (data.tags) updateData.tags = data.tags;
    if (data.metaKeywords) updateData.metaKeywords = data.metaKeywords;

    await db.update(newsArticles)
      .set({ ...updateData, updatedAt: new Date() })
      .where(eq(newsArticles.id, id));
    return await this.getNewsArticle(id);
  }

  async deleteNewsArticle(id: string): Promise<boolean> {
    const [result] = await db.delete(newsArticles).where(eq(newsArticles.id, id));
    return result.affectedRows > 0;
  }

  // News Outbox CRUD
  async createOutboxEntry(entry: InsertNewsOutbox): Promise<NewsOutbox> {
    const id = randomUUID();
    await db.insert(newsOutbox).values({ ...entry, id });
    return (await this.getOutboxEntry(id))!;
  }

  async getOutboxEntry(id: string): Promise<NewsOutbox | undefined> {
    const [entry] = await db.select().from(newsOutbox).where(eq(newsOutbox.id, id));
    return entry;
  }

  async getOutboxByArticle(articleId: string): Promise<NewsOutbox[]> {
    return await db.select().from(newsOutbox).where(eq(newsOutbox.articleId, articleId));
  }

  async getPendingOutbox(): Promise<NewsOutbox[]> {
    return await db.select().from(newsOutbox)
      .where(eq(newsOutbox.status, "pending"))
      .orderBy(newsOutbox.scheduledAt);
  }

  async updateOutboxEntry(id: string, data: Partial<InsertNewsOutbox>): Promise<NewsOutbox | undefined> {
    await db.update(newsOutbox)
      .set(data)
      .where(eq(newsOutbox.id, id));
    return await this.getOutboxEntry(id);
  }
}

export class MemStorage implements IStorage {
  private leads: Map<string, Lead>;
  private calculations: Map<string, Calculation>;
  private newsArticles: Map<string, NewsArticle>;
  private newsOutbox: Map<string, NewsOutbox>;

  constructor() {
    this.leads = new Map();
    this.calculations = new Map();
    this.newsArticles = new Map();
    this.newsOutbox = new Map();
  }

  async createLead(insertLead: InsertLead): Promise<Lead> {
    const id = (this.leads.size + 1).toString();
    const lead: Lead = {
      ...insertLead,
      id,
      createdAt: new Date(),
      message: insertLead.message ?? null,
      source: insertLead.source ?? null,
    };
    this.leads.set(id, lead);
    return lead;
  }

  async getLead(id: string): Promise<Lead | undefined> {
    return this.leads.get(id);
  }

  async getAllLeads(): Promise<Lead[]> {
    return Array.from(this.leads.values());
  }

  async createCalculation(insertCalculation: InsertCalculation): Promise<Calculation> {
    const id = (this.calculations.size + 1).toString();
    const calculation: Calculation = {
      ...insertCalculation,
      id,
      createdAt: new Date(),
      height: insertCalculation.estimatedCost ?? null, // Approximate mapping
      diameter: null,
      surfaceArea: null,
      coatingType: null,
      leadId: null,
      estimatedCost: insertCalculation.estimatedCost ?? null,
    };
    this.calculations.set(id, calculation);
    return calculation;
  }

  async getCalculation(id: string): Promise<Calculation | undefined> {
    return this.calculations.get(id);
  }

  async getAllCalculations(): Promise<Calculation[]> {
    return Array.from(this.calculations.values());
  }

  // News Stubs
  async createNewsArticle(article: InsertNewsArticle): Promise<NewsArticle> { throw new Error("Method not implemented."); }
  async getNewsArticle(id: string): Promise<NewsArticle | undefined> { return undefined; }
  async getNewsArticleBySlug(slug: string): Promise<NewsArticle | undefined> { return undefined; }
  async getAllNewsArticles(status?: string): Promise<NewsArticle[]> { return []; }
  async updateNewsArticle(id: string, data: Partial<InsertNewsArticle>): Promise<NewsArticle | undefined> { return undefined; }
  async deleteNewsArticle(id: string): Promise<boolean> { return false; }

  async createOutboxEntry(entry: InsertNewsOutbox): Promise<NewsOutbox> { throw new Error("Method not implemented."); }
  async getOutboxEntry(id: string): Promise<NewsOutbox | undefined> { return undefined; }
  async getOutboxByArticle(articleId: string): Promise<NewsOutbox[]> { return []; }
  async getPendingOutbox(): Promise<NewsOutbox[]> { return []; }
  async updateOutboxEntry(id: string, data: Partial<InsertNewsOutbox>): Promise<NewsOutbox | undefined> { return undefined; }
}

export const storage = new DatabaseStorage();
