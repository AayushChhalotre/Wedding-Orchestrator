import { pgTable, text, timestamp, jsonb } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";
import { weddingsTable } from "./weddings";

export const activitiesTable = pgTable("activities", {
  id: text("id").primaryKey(),
  weddingId: text("wedding_id").notNull().references(() => weddingsTable.id, { onDelete: "cascade" }),
  timestamp: text("timestamp").notNull(),
  description: text("description").notNull(),
  icon: text("icon").notNull(), // "vendor" | "couple" | "system" | "family" | "stakeholder" | "reminder"
  actor: text("actor").notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const risksTable = pgTable("risks", {
  id: text("id").primaryKey(),
  weddingId: text("wedding_id").notNull().references(() => weddingsTable.id, { onDelete: "cascade" }),
  title: text("title").notNull(),
  explanation: text("explanation").notNull(),
  impact: text("impact").notNull(),
  cta: text("cta").notNull(),
  severity: text("severity").notNull(), // "high" | "medium"
  type: text("type").notNull(), // "burnout" | "budget" | "density" | "general"
  suggestedAssistance: jsonb("suggested_assistance").$type<string[]>().default([]),
  assistanceResources: jsonb("assistance_resources").$type<any[]>().default([]),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

export const insertActivitySchema = createInsertSchema(activitiesTable);
export const insertRiskSchema = createInsertSchema(risksTable);

export type Activity = typeof activitiesTable.$inferSelect;
export type Risk = typeof risksTable.$inferSelect;
