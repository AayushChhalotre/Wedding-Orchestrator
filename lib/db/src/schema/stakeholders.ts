import { pgTable, text, timestamp, integer, jsonb, pgEnum, index } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";
import { weddingsTable } from "./weddings";
export const stakeholderTypeEnum = pgEnum("stakeholder_type", ["vendor", "family"]);

export const stakeholdersTable = pgTable("stakeholders", {
  id: text("id").primaryKey(),
  weddingId: text("wedding_id").notNull().references(() => weddingsTable.id, { onDelete: "cascade" }),
  name: text("name").notNull(),
  role: text("role").notNull(),
  type: stakeholderTypeEnum("type").notNull(),
  initials: text("initials").notNull(),
  email: text("email").notNull(),
  tasks: jsonb("tasks").$type<string[]>().default([]).notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
}, (table) => {
  return {
    weddingIdIndex: index("stakeholders_wedding_id_idx").on(table.weddingId),
    updatedAtIndex: index("stakeholders_updated_at_idx").on(table.updatedAt),
  };
});

export const insertStakeholderSchema = createInsertSchema(stakeholdersTable);
export type Stakeholder = typeof stakeholdersTable.$inferSelect;
export type InsertStakeholder = typeof stakeholdersTable.$inferInsert;
