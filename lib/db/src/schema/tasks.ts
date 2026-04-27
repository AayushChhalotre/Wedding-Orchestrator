import { pgTable, text, timestamp, integer, boolean, jsonb } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";
import { weddingsTable } from "./weddings";

export const tasksTable = pgTable("tasks", {
  id: text("id").primaryKey(),
  weddingId: text("wedding_id").notNull().references(() => weddingsTable.id, { onDelete: "cascade" }),
  title: text("title").notNull(),
  dueDate: text("due_date").notNull(),
  status: text("status").notNull(), // "not_started" | "in_progress" | "done" | "at_risk" | "overdue"
  phase: text("phase").notNull(),
  phaseId: text("phase_id").notNull(),
  owner: text("owner").notNull(),
  ownerInitials: text("owner_initials").notNull(),
  ownerType: text("owner_type").notNull(), // "couple" | "vendor" | "family"
  category: text("category").notNull(),
  dependencies: jsonb("dependencies").$type<string[]>().default([]).notNull(),
  blocks: jsonb("blocks").$type<string[]>().default([]).notNull(),
  whyItMatters: text("why_it_matters").notNull(),
  notes: text("notes").notNull(),
  vendorPortalLink: text("vendor_portal_link"),
  priority: text("priority").notNull(), // "high" | "medium" | "low"
  effort: integer("effort").notNull(), // 1-5
  estimatedCost: integer("estimated_cost"),
  actualCost: integer("actual_cost"),
  isMilestone: boolean("is_milestone").default(false).notNull(),
  budgetCategoryId: text("budget_category_id"),
  customActionType: text("custom_action_type"),
  customActionData: jsonb("custom_action_data"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

export const insertTaskSchema = createInsertSchema(tasksTable);
export type InsertTask = z.infer<typeof insertTaskSchema>;
export type Task = typeof tasksTable.$inferSelect;
