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
  scanFrequency: varchar("scan_frequency", { length: 20 }).default("manual"), // manual, daily, weekly, monthly
  nextScanAt: timestamp("next_scan_at"),
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
  contentAnalysis: jsonb("content_analysis"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

// Backlinks table for tracking incoming links
export const backlinks = pgTable("backlinks", {
  id: serial("id").primaryKey(),
  websiteId: integer("website_id").references(() => websites.id).notNull(),
  sourceUrl: text("source_url").notNull(),
  targetUrl: text("target_url").notNull(),
  anchorText: text("anchor_text"),
  linkType: text("link_type").notNull(), // 'dofollow', 'nofollow', 'sponsored', 'ugc'
  domainAuthority: integer("domain_authority"),
  pageAuthority: integer("page_authority"),
  isActive: boolean("is_active").default(true).notNull(),
  firstSeen: timestamp("first_seen").defaultNow().notNull(),
  lastSeen: timestamp("last_seen").defaultNow().notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

// Keywords table for tracking keyword rankings and performance
export const keywords = pgTable("keywords", {
  id: serial("id").primaryKey(),
  websiteId: integer("website_id").references(() => websites.id).notNull(),
  keyword: text("keyword").notNull(),
  searchVolume: integer("search_volume"),
  difficulty: integer("difficulty"), // 1-100 keyword difficulty score
  cpc: real("cpc"), // Cost per click
  intent: text("intent"), // 'informational', 'commercial', 'transactional', 'navigational'
  isActive: boolean("is_active").default(true).notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

// Keyword rankings table for tracking position changes over time
export const keywordRankings = pgTable("keyword_rankings", {
  id: serial("id").primaryKey(),
  keywordId: integer("keyword_id").references(() => keywords.id).notNull(),
  position: integer("position"), // 1-100+ search result position
  url: text("url"), // Which page ranks for this keyword
  searchEngine: text("search_engine").default("google").notNull(),
  location: text("location").default("global"), // Geographic location for ranking
  device: text("device").default("desktop"), // 'desktop', 'mobile'
  checkedAt: timestamp("checked_at").defaultNow().notNull(),
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
  backlinks: many(backlinks),
  keywords: many(keywords),
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

// Backlinks relations
export const backlinksRelations = relations(backlinks, ({ one }) => ({
  website: one(websites, {
    fields: [backlinks.websiteId],
    references: [websites.id],
  }),
}));

// Keywords relations
export const keywordsRelations = relations(keywords, ({ one, many }) => ({
  website: one(websites, {
    fields: [keywords.websiteId],
    references: [websites.id],
  }),
  rankings: many(keywordRankings),
}));

// Keyword rankings relations
export const keywordRankingsRelations = relations(keywordRankings, ({ one }) => ({
  keyword: one(keywords, {
    fields: [keywordRankings.keywordId],
    references: [keywords.id],
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

export const insertBacklinkSchema = createInsertSchema(backlinks).omit({
  id: true,
  createdAt: true,
  firstSeen: true,
  lastSeen: true,
});

export const insertKeywordSchema = createInsertSchema(keywords).omit({
  id: true,
  createdAt: true,
});

export const insertKeywordRankingSchema = createInsertSchema(keywordRankings).omit({
  id: true,
  checkedAt: true,
});

// Types
export type Website = typeof websites.$inferSelect;
export type InsertWebsite = z.infer<typeof insertWebsiteSchema>;
export type InsertSeoAnalysis = z.infer<typeof insertSeoAnalysisSchema>;
export type SeoAnalysis = typeof seoAnalyses.$inferSelect;
export type ScoreHistory = typeof scoreHistory.$inferSelect;
export type InsertScoreHistory = z.infer<typeof insertScoreHistorySchema>;
export type Backlink = typeof backlinks.$inferSelect;
export type InsertBacklink = z.infer<typeof insertBacklinkSchema>;
export type Keyword = typeof keywords.$inferSelect;
export type InsertKeyword = z.infer<typeof insertKeywordSchema>;
export type KeywordRanking = typeof keywordRankings.$inferSelect;
export type InsertKeywordRanking = z.infer<typeof insertKeywordRankingSchema>;

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
