import { type Lead, type InsertLead, type Calculation, type InsertCalculation, leads, calculations } from "@shared/schema";
import { db } from "./db";
import { eq } from "drizzle-orm";

export interface IStorage {
  createLead(lead: InsertLead): Promise<Lead>;
  getLead(id: string): Promise<Lead | undefined>;
  getAllLeads(): Promise<Lead[]>;
  createCalculation(calculation: InsertCalculation): Promise<Calculation>;
  getCalculation(id: string): Promise<Calculation | undefined>;
}

export class DatabaseStorage implements IStorage {
  async createLead(insertLead: InsertLead): Promise<Lead> {
    const [lead] = await db.insert(leads).values(insertLead).returning();
    return lead;
  }

  async getLead(id: string): Promise<Lead | undefined> {
    const [lead] = await db.select().from(leads).where(eq(leads.id, id));
    return lead;
  }

  async getAllLeads(): Promise<Lead[]> {
    return await db.select().from(leads);
  }

  async createCalculation(insertCalculation: InsertCalculation): Promise<Calculation> {
    const [calculation] = await db.insert(calculations).values(insertCalculation).returning();
    return calculation;
  }

  async getCalculation(id: string): Promise<Calculation | undefined> {
    const [calculation] = await db.select().from(calculations).where(eq(calculations.id, id));
    return calculation;
  }
}

export const storage = new DatabaseStorage();
