import { pgTable, text, serial, integer, boolean, timestamp, jsonb } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const seoAnalyses = pgTable("seo_analyses", {
  id: serial("id").primaryKey(),
  url: text("url").notNull(),
  overallScore: integer("overall_score").notNull(),
  technicalScore: integer("technical_score").notNull(),
  contentScore: integer("content_score").notNull(),
  performanceScore: integer("performance_score").notNull(),
  uxScore: integer("ux_score").notNull(),
  passedChecks: integer("passed_checks").notNull(),
  failedChecks: integer("failed_checks").notNull(),
  pageSpeed: text("page_speed").notNull(),
  issues: jsonb("issues").notNull(),
  recommendations: jsonb("recommendations").notNull(),
  technicalChecks: jsonb("technical_checks").notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const insertSeoAnalysisSchema = createInsertSchema(seoAnalyses).omit({
  id: true,
  createdAt: true,
});

export type InsertSeoAnalysis = z.infer<typeof insertSeoAnalysisSchema>;
export type SeoAnalysis = typeof seoAnalyses.$inferSelect;

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
