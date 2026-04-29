import { pgTable, text, timestamp, integer, pgEnum, index } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";
export const planningPaceEnum = pgEnum("planning_pace", ["marathon", "sprint", "blitz"]);
export const budgetPhaseEnum = pgEnum("budget_phase", ["dreaming", "tracking"]);

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
  planningPace: planningPaceEnum("planning_pace").notNull(),
  budgetPhase: budgetPhaseEnum("budget_phase").notNull(),
  activeScenarioId: text("active_scenario_id"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
}, (table) => {
  return {
    createdAtIndex: index("weddings_created_at_idx").on(table.createdAt),
  };
});

export const insertWeddingSchema = createInsertSchema(weddingsTable);
export type Wedding = typeof weddingsTable.$inferSelect;
export type InsertWedding = typeof weddingsTable.$inferInsert;
