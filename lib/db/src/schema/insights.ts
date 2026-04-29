import { pgTable, text, timestamp, jsonb, pgEnum, index } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";
import { weddingsTable } from "./weddings";
export const riskSeverityEnum = pgEnum("risk_severity", ["high", "medium"]);
export const riskTypeEnum = pgEnum("risk_type", ["burnout", "budget", "density", "general"]);

export const activitiesTable = pgTable("activities", {
  id: text("id").primaryKey(),
  weddingId: text("wedding_id").notNull().references(() => weddingsTable.id, { onDelete: "cascade" }),
  timestamp: text("timestamp").notNull(),
  description: text("description").notNull(),
  icon: text("icon").notNull(), // "vendor" | "couple" | "system" | "family" | "stakeholder" | "reminder"
  actor: text("actor").notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
}, (table) => {
  return {
    weddingIdIndex: index("activities_wedding_id_idx").on(table.weddingId),
    createdAtIndex: index("activities_created_at_idx").on(table.createdAt),
  };
});

export const risksTable = pgTable("risks", {
  id: text("id").primaryKey(),
  weddingId: text("wedding_id").notNull().references(() => weddingsTable.id, { onDelete: "cascade" }),
  title: text("title").notNull(),
  explanation: text("explanation").notNull(),
  impact: text("impact").notNull(),
  cta: text("cta").notNull(),
  severity: riskSeverityEnum("severity").notNull(),
  type: riskTypeEnum("type").notNull(),
  suggestedAssistance: jsonb("suggested_assistance").$type<string[]>().default([]),
  assistanceResources: jsonb("assistance_resources").$type<any[]>().default([]),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
}, (table) => {
  return {
    weddingIdIndex: index("risks_wedding_id_idx").on(table.weddingId),
    createdAtIndex: index("risks_created_at_idx").on(table.createdAt),
  };
});

export const insertActivitySchema = createInsertSchema(activitiesTable);
export const insertRiskSchema = createInsertSchema(risksTable);

export type Activity = typeof activitiesTable.$inferSelect;
export type Risk = typeof risksTable.$inferSelect;

export type InsertActivity = typeof activitiesTable.$inferInsert;
export type InsertRisk = typeof risksTable.$inferInsert;
