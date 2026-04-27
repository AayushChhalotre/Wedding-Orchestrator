import { pgTable, text, timestamp, integer, boolean, jsonb, decimal } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";
import { weddingsTable } from "./weddings";

export const budgetScenariosTable = pgTable("budget_scenarios", {
  id: text("id").primaryKey(),
  weddingId: text("wedding_id").notNull().references(() => weddingsTable.id, { onDelete: "cascade" }),
  name: text("name").notNull(),
  totalBudget: integer("total_budget").notNull(),
  categories: jsonb("categories").$type<Record<string, number>>().notNull(), // categoryId -> planned amount
  description: text("description"),
  isLocked: boolean("is_locked").default(false).notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

export const budgetCategoriesTable = pgTable("budget_categories", {
  id: text("id").primaryKey(),
  weddingId: text("wedding_id").notNull().references(() => weddingsTable.id, { onDelete: "cascade" }),
  name: text("name").notNull(),
  planned: integer("planned").notNull(),
  forecast: integer("forecast").notNull(),
  actual: integer("actual").notNull(),
  confidence: text("confidence").notNull(), // "high" | "medium" | "low"
  notes: text("notes"),
  trend: text("trend"), // "up" | "down" | "stable"
  driftAmount: integer("drift_amount"),
  priority: text("priority"), // "must_have" | "nice_to_have" | "luxury"
  customEstimate: integer("custom_estimate"),
  suggestedRange: jsonb("suggested_range").$type<{ min: number; max: number }>(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

export const budgetUpdatesTable = pgTable("budget_updates", {
  id: text("id").primaryKey(),
  weddingId: text("wedding_id").notNull().references(() => weddingsTable.id, { onDelete: "cascade" }),
  categoryName: text("category_name").notNull(),
  amount: integer("amount").notNull(),
  date: text("date").notNull(),
  description: text("description").notNull(),
  type: text("type").notNull(), // "increase" | "decrease" | "reallocation"
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const insertBudgetScenarioSchema = createInsertSchema(budgetScenariosTable);
export const insertBudgetCategorySchema = createInsertSchema(budgetCategoriesTable);
export const insertBudgetUpdateSchema = createInsertSchema(budgetUpdatesTable);

export type BudgetScenario = typeof budgetScenariosTable.$inferSelect;
export type BudgetCategory = typeof budgetCategoriesTable.$inferSelect;
export type BudgetUpdate = typeof budgetUpdatesTable.$inferSelect;
