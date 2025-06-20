import { pgTable, text, serial, integer, boolean, timestamp, jsonb, varchar, real, index } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";
import { relations } from "drizzle-orm";

// Session storage table for Replit Auth
export const sessions = pgTable(
  "sessions",
  {
    sid: varchar("sid").primaryKey(),
    sess: jsonb("sess").notNull(),
    expire: timestamp("expire").notNull(),
  },
  (table) => [index("IDX_session_expire").on(table.expire)],
);

// User storage table for Replit Auth
export const users = pgTable("users", {
  id: varchar("id").primaryKey().notNull(),
  email: varchar("email").unique(),
  firstName: varchar("first_name"),
  lastName: varchar("last_name"),
  profileImageUrl: varchar("profile_image_url"),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// Websites table for tracking multiple sites
export const websites = pgTable("websites", {
  id: serial("id").primaryKey(),
  userId: varchar("user_id").references(() => users.id).notNull(),
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

// Competitors table for tracking competitor websites
export const competitors = pgTable("competitors", {
  id: serial("id").primaryKey(),
  websiteId: integer("website_id").references(() => websites.id).notNull(),
  competitorUrl: text("competitor_url").notNull(),
  competitorDomain: text("competitor_domain").notNull(),
  name: text("name"), // Optional friendly name
  isActive: boolean("is_active").default(true).notNull(),
  lastAnalyzed: timestamp("last_analyzed"),
  overallScore: integer("overall_score"),
  technicalScore: integer("technical_score"),
  contentScore: integer("content_score"),
  performanceScore: integer("performance_score"),
  estimatedTraffic: integer("estimated_traffic"),
  domainAuthority: integer("domain_authority"),
  competitiveStrength: text("competitive_strength"), // 'low', 'medium', 'high'
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

// Competitor keywords overlap table
export const competitorKeywords = pgTable("competitor_keywords", {
  id: serial("id").primaryKey(),
  competitorId: integer("competitor_id").references(() => competitors.id).notNull(),
  keyword: text("keyword").notNull(),
  ourPosition: integer("our_position"),
  competitorPosition: integer("competitor_position"),
  searchVolume: integer("search_volume"),
  difficulty: integer("difficulty"),
  gap: text("gap"), // 'opportunity', 'threat', 'equal'
  lastChecked: timestamp("last_checked").defaultNow().notNull(),
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

// User relations
export const usersRelations = relations(users, ({ many }) => ({
  websites: many(websites),
}));

// Website relations
export const websitesRelations = relations(websites, ({ one, many }) => ({
  user: one(users, {
    fields: [websites.userId],
    references: [users.id],
  }),
  analyses: many(seoAnalyses),
  scoreHistory: many(scoreHistory),
  backlinks: many(backlinks),
  keywords: many(keywords),
  competitors: many(competitors),
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

// Competitors relations
export const competitorsRelations = relations(competitors, ({ one, many }) => ({
  website: one(websites, {
    fields: [competitors.websiteId],
    references: [websites.id],
  }),
  competitorKeywords: many(competitorKeywords),
}));

// Competitor keywords relations
export const competitorKeywordsRelations = relations(competitorKeywords, ({ one }) => ({
  competitor: one(competitors, {
    fields: [competitorKeywords.competitorId],
    references: [competitors.id],
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

export const insertCompetitorSchema = createInsertSchema(competitors).omit({
  id: true,
  createdAt: true,
});

export const insertCompetitorKeywordSchema = createInsertSchema(competitorKeywords).omit({
  id: true,
  lastChecked: true,
});

// User schemas
export const upsertUserSchema = createInsertSchema(users);

// Types
export type User = typeof users.$inferSelect;
export type UpsertUser = typeof users.$inferInsert;
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
export type Competitor = typeof competitors.$inferSelect;
export type InsertCompetitor = z.infer<typeof insertCompetitorSchema>;
export type CompetitorKeyword = typeof competitorKeywords.$inferSelect;
export type InsertCompetitorKeyword = z.infer<typeof insertCompetitorKeywordSchema>;

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
