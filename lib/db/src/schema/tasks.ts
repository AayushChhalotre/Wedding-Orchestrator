import { pgTable, text, timestamp, integer, boolean, jsonb, pgEnum, index } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";
import { weddingsTable } from "./weddings";
export const taskStatusEnum = pgEnum("task_status", ["not_started", "in_progress", "done", "at_risk", "overdue", "blocked"]);
export const ownerTypeEnum = pgEnum("owner_type", ["couple", "vendor", "family"]);
export const priorityEnum = pgEnum("priority", ["high", "medium", "low"]);

export const tasksTable = pgTable("tasks", {
  id: text("id").primaryKey(),
  weddingId: text("wedding_id").notNull().references(() => weddingsTable.id, { onDelete: "cascade" }),
  title: text("title").notNull(),
  dueDate: text("due_date").notNull(),
  status: taskStatusEnum("status").notNull(),
  phase: text("phase").notNull(),
  phaseId: text("phase_id").notNull(),
  owner: text("owner").notNull(),
  ownerInitials: text("owner_initials").notNull(),
  ownerType: ownerTypeEnum("owner_type").notNull(),
  category: text("category").notNull(),
  dependencies: jsonb("dependencies").$type<string[]>().default([]).notNull(),
  blocks: jsonb("blocks").$type<string[]>().default([]).notNull(),
  whyItMatters: text("why_it_matters").notNull(),
  notes: text("notes").notNull(),
  vendorPortalLink: text("vendor_portal_link"),
  priority: priorityEnum("priority").notNull(),
  effort: integer("effort").notNull(), // 1-5
  estimatedCost: integer("estimated_cost"),
  actualCost: integer("actual_cost"),
  isMilestone: boolean("is_milestone").default(false).notNull(),
  budgetCategoryId: text("budget_category_id"),
  customActionType: text("custom_action_type"),
  customActionData: jsonb("custom_action_data"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
}, (table) => {
  return {
    weddingIdIndex: index("tasks_wedding_id_idx").on(table.weddingId),
    createdAtIndex: index("tasks_created_at_idx").on(table.createdAt),
  };
});

export const insertTaskSchema = createInsertSchema(tasksTable);
export type Task = typeof tasksTable.$inferSelect;
export type InsertTask = typeof tasksTable.$inferInsert;
