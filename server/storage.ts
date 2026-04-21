import {
  type Lead, type InsertLead,
  type Calculation, type InsertCalculation,
  type NewsArticle, type InsertNewsArticle,
  type NewsOutbox, type InsertNewsOutbox,
  leads, calculations, newsArticles, newsOutbox
} from "@shared/schema";
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

  // News Stubs (News are handled by newsRepository now)
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

export const storage = new MemStorage();
