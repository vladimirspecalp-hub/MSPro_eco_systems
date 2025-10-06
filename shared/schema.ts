import { sql } from "drizzle-orm";
import { pgTable, text, varchar, timestamp, integer, decimal } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const leads = pgTable("leads", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  name: text("name").notNull(),
  phone: text("phone").notNull(),
  email: text("email").notNull(),
  serviceType: text("service_type").notNull(),
  message: text("message"),
  source: text("source"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const calculations = pgTable("calculations", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  serviceType: text("service_type").notNull(),
  height: decimal("height"),
  diameter: decimal("diameter"),
  surfaceArea: decimal("surface_area"),
  coatingType: text("coating_type"),
  estimatedCost: decimal("estimated_cost"),
  leadId: varchar("lead_id").references(() => leads.id),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const insertLeadSchema = createInsertSchema(leads).omit({
  id: true,
  createdAt: true,
}).extend({
  phone: z.string().min(10, "Телефон должен содержать минимум 10 цифр"),
  email: z.string().email("Введите корректный email"),
  name: z.string().min(2, "Имя должно содержать минимум 2 символа"),
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
