import { pgTable, text, timestamp, integer, jsonb } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";
import { weddingsTable } from "./weddings";

export const stakeholdersTable = pgTable("stakeholders", {
  id: text("id").primaryKey(),
  weddingId: text("wedding_id").notNull().references(() => weddingsTable.id, { onDelete: "cascade" }),
  name: text("name").notNull(),
  role: text("role").notNull(),
  type: text("type").notNull(), // "vendor" | "family"
  initials: text("initials").notNull(),
  email: text("email").notNull(),
  tasks: jsonb("tasks").$type<string[]>().default([]).notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

export const insertStakeholderSchema = createInsertSchema(stakeholdersTable);
export type Stakeholder = typeof stakeholdersTable.$inferSelect;
