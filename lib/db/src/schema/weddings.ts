import { pgTable, text, timestamp, integer } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const weddingsTable = pgTable("weddings", {
  id: text("id").primaryKey(), // Using text for UUID/string IDs from frontend
  coupleName: text("couple_name").notNull(),
  partner1Name: text("partner1_name").notNull(),
  partner2Name: text("partner2_name").notNull(),
  weddingDate: text("wedding_date").notNull(),
  city: text("city").notNull(),
  location: text("location").notNull(),
  budget: text("budget").notNull(),
  guests: text("guests").notNull(),
  planningPace: text("planning_pace").notNull(), // "marathon" | "sprint" | "blitz"
  budgetPhase: text("budget_phase").notNull(), // "dreaming" | "tracking"
  activeScenarioId: text("active_scenario_id"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

export const insertWeddingSchema = createInsertSchema(weddingsTable);
export type InsertWedding = z.infer<typeof insertWeddingSchema>;
export type Wedding = typeof weddingsTable.$inferSelect;
