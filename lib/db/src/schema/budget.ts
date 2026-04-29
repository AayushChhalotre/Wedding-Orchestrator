import { pgTable, text, timestamp, integer, boolean, jsonb, decimal, pgEnum, index } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";
import { weddingsTable } from "./weddings";
export const budgetConfidenceEnum = pgEnum("budget_confidence", ["high", "medium", "low"]);
export const budgetTrendEnum = pgEnum("budget_trend", ["up", "down", "stable"]);
export const budgetPriorityEnum = pgEnum("budget_priority", ["must_have", "nice_to_have", "luxury"]);
export const budgetUpdateTypeEnum = pgEnum("budget_update_type", ["increase", "decrease", "reallocation"]);

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
}, (table) => {
  return {
    weddingIdIndex: index("budget_scenarios_wedding_id_idx").on(table.weddingId),
  };
});

export const budgetCategoriesTable = pgTable("budget_categories", {
  id: text("id").primaryKey(),
  weddingId: text("wedding_id").notNull().references(() => weddingsTable.id, { onDelete: "cascade" }),
  name: text("name").notNull(),
  planned: integer("planned").notNull(),
  forecast: integer("forecast").notNull(),
  actual: integer("actual").notNull(),
  confidence: budgetConfidenceEnum("confidence").notNull(),
  notes: text("notes"),
  trend: budgetTrendEnum("trend"),
  driftAmount: integer("drift_amount"),
  priority: budgetPriorityEnum("priority"),
  customEstimate: integer("custom_estimate"),
  suggestedRange: jsonb("suggested_range").$type<{ min: number; max: number }>(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
}, (table) => {
  return {
    weddingIdIndex: index("budget_categories_wedding_id_idx").on(table.weddingId),
  };
});

export const budgetUpdatesTable = pgTable("budget_updates", {
  id: text("id").primaryKey(),
  weddingId: text("wedding_id").notNull().references(() => weddingsTable.id, { onDelete: "cascade" }),
  categoryName: text("category_name").notNull(),
  amount: integer("amount").notNull(),
  date: text("date").notNull(),
  description: text("description").notNull(),
  type: budgetUpdateTypeEnum("type").notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
}, (table) => {
  return {
    weddingIdIndex: index("budget_updates_wedding_id_idx").on(table.weddingId),
    dateIndex: index("budget_updates_date_idx").on(table.date),
  };
});

export const insertBudgetScenarioSchema = createInsertSchema(budgetScenariosTable);
export const insertBudgetCategorySchema = createInsertSchema(budgetCategoriesTable);
export const insertBudgetUpdateSchema = createInsertSchema(budgetUpdatesTable);

export type BudgetScenario = typeof budgetScenariosTable.$inferSelect;
export type BudgetCategory = typeof budgetCategoriesTable.$inferSelect;
export type BudgetUpdate = typeof budgetUpdatesTable.$inferSelect;

export type InsertBudgetScenario = typeof budgetScenariosTable.$inferInsert;
export type InsertBudgetCategory = typeof budgetCategoriesTable.$inferInsert;
export type InsertBudgetUpdate = typeof budgetUpdatesTable.$inferInsert;
