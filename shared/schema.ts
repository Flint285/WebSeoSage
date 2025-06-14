import { pgTable, text, serial, integer, boolean, timestamp, jsonb, varchar, real } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";
import { relations } from "drizzle-orm";

// Websites table for tracking multiple sites
export const websites = pgTable("websites", {
  id: serial("id").primaryKey(),
  url: text("url").notNull().unique(),
  domain: varchar("domain", { length: 255 }).notNull(),
  title: text("title"),
  description: text("description"),
  isActive: boolean("is_active").default(true).notNull(),
  lastScanned: timestamp("last_scanned"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

// Enhanced SEO analyses with website relationship
export const seoAnalyses = pgTable("seo_analyses", {
  id: serial("id").primaryKey(),
  websiteId: integer("website_id").references(() => websites.id).notNull(),
  url: text("url").notNull(),
  overallScore: real("overall_score").notNull(),
  technicalScore: real("technical_score").notNull(),
  contentScore: real("content_score").notNull(),
  performanceScore: real("performance_score").notNull(),
  uxScore: real("ux_score").notNull(),
  passedChecks: integer("passed_checks").notNull(),
  failedChecks: integer("failed_checks").notNull(),
  pageSpeed: text("page_speed").notNull(),
  issues: jsonb("issues").notNull(),
  recommendations: jsonb("recommendations").notNull(),
  technicalChecks: jsonb("technical_checks").notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

// Score history for tracking changes over time
export const scoreHistory = pgTable("score_history", {
  id: serial("id").primaryKey(),
  websiteId: integer("website_id").references(() => websites.id).notNull(),
  analysisId: integer("analysis_id").references(() => seoAnalyses.id).notNull(),
  overallScore: real("overall_score").notNull(),
  technicalScore: real("technical_score").notNull(),
  contentScore: real("content_score").notNull(),
  performanceScore: real("performance_score").notNull(),
  uxScore: real("ux_score").notNull(),
  date: timestamp("date").defaultNow().notNull(),
});

// Website relations
export const websitesRelations = relations(websites, ({ many }) => ({
  analyses: many(seoAnalyses),
  scoreHistory: many(scoreHistory),
}));

// SEO Analysis relations
export const seoAnalysesRelations = relations(seoAnalyses, ({ one }) => ({
  website: one(websites, {
    fields: [seoAnalyses.websiteId],
    references: [websites.id],
  }),
  scoreEntry: one(scoreHistory, {
    fields: [seoAnalyses.id],
    references: [scoreHistory.analysisId],
  }),
}));

// Score History relations
export const scoreHistoryRelations = relations(scoreHistory, ({ one }) => ({
  website: one(websites, {
    fields: [scoreHistory.websiteId],
    references: [websites.id],
  }),
  analysis: one(seoAnalyses, {
    fields: [scoreHistory.analysisId],
    references: [seoAnalyses.id],
  }),
}));

// Website schemas
export const insertWebsiteSchema = createInsertSchema(websites).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export const insertSeoAnalysisSchema = createInsertSchema(seoAnalyses).omit({
  id: true,
  createdAt: true,
});

export const insertScoreHistorySchema = createInsertSchema(scoreHistory).omit({
  id: true,
  date: true,
});

// Types
export type Website = typeof websites.$inferSelect;
export type InsertWebsite = z.infer<typeof insertWebsiteSchema>;
export type InsertSeoAnalysis = z.infer<typeof insertSeoAnalysisSchema>;
export type SeoAnalysis = typeof seoAnalyses.$inferSelect;
export type ScoreHistory = typeof scoreHistory.$inferSelect;
export type InsertScoreHistory = z.infer<typeof insertScoreHistorySchema>;

// SEO Issue Schema
export const seoIssueSchema = z.object({
  id: z.string(),
  title: z.string(),
  description: z.string(),
  priority: z.enum(["high", "medium", "low"]),
  impact: z.string(),
  category: z.string(),
});

export type SeoIssue = z.infer<typeof seoIssueSchema>;

// SEO Recommendation Schema
export const seoRecommendationSchema = z.object({
  id: z.string(),
  title: z.string(),
  description: z.string(),
  estimatedScoreIncrease: z.number(),
  priority: z.number(),
  category: z.string(),
});

export type SeoRecommendation = z.infer<typeof seoRecommendationSchema>;

// Technical Check Schema
export const technicalCheckSchema = z.object({
  id: z.string(),
  name: z.string(),
  status: z.enum(["passed", "failed", "warning"]),
  value: z.string(),
  impact: z.enum(["high", "medium", "low"]),
  icon: z.string(),
});

export type TechnicalCheck = z.infer<typeof technicalCheckSchema>;
