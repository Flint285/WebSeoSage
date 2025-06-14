import { websites, seoAnalyses, scoreHistory, backlinks, type Website, type SeoAnalysis, type InsertSeoAnalysis, type InsertWebsite, type ScoreHistory, type InsertScoreHistory, type Backlink, type InsertBacklink } from "@shared/schema";
import { db } from "./db";
import { eq, desc, and } from "drizzle-orm";

export interface IStorage {
  getUser(id: number): Promise<any | undefined>;
  getUserByUsername(username: string): Promise<any | undefined>;
  createUser(user: any): Promise<any>;
  getSeoAnalysis(id: number): Promise<SeoAnalysis | undefined>;
  getSeoAnalysisByUrl(url: string): Promise<SeoAnalysis | undefined>;
  createSeoAnalysis(analysis: InsertSeoAnalysis): Promise<SeoAnalysis>;
  getAllSeoAnalyses(): Promise<SeoAnalysis[]>;
  // New methods for historical tracking
  getWebsite(id: number): Promise<Website | undefined>;
  getWebsiteByUrl(url: string): Promise<Website | undefined>;
  createWebsite(website: InsertWebsite): Promise<Website>;
  updateWebsite(id: number, website: Partial<Website>): Promise<Website | undefined>;
  getWebsiteHistory(websiteId: number, limit?: number): Promise<ScoreHistory[]>;
  getWebsiteAnalyses(websiteId: number, limit?: number): Promise<SeoAnalysis[]>;
  createScoreHistory(scoreHistory: InsertScoreHistory): Promise<ScoreHistory>;
  getAllWebsites(): Promise<Website[]>;
}

export class DatabaseStorage implements IStorage {
  async getUser(id: number): Promise<any | undefined> {
    // User management to be implemented later
    return undefined;
  }

  async getUserByUsername(username: string): Promise<any | undefined> {
    // User management to be implemented later
    return undefined;
  }

  async createUser(insertUser: any): Promise<any> {
    // User management to be implemented later
    return { id: 1, ...insertUser };
  }

  async getSeoAnalysis(id: number): Promise<SeoAnalysis | undefined> {
    const [analysis] = await db
      .select()
      .from(seoAnalyses)
      .where(eq(seoAnalyses.id, id));
    
    if (analysis) {
      // Convert technicalChecks back to array if it's an object with numeric keys
      if (analysis.technicalChecks && typeof analysis.technicalChecks === 'object' && !Array.isArray(analysis.technicalChecks)) {
        analysis.technicalChecks = Object.keys(analysis.technicalChecks)
          .filter(key => !isNaN(Number(key)))
          .map(key => (analysis.technicalChecks as any)[key])
          .filter(Boolean);
      }
    }
    
    return analysis || undefined;
  }

  async getSeoAnalysisByUrl(url: string): Promise<SeoAnalysis | undefined> {
    const [analysis] = await db
      .select()
      .from(seoAnalyses)
      .where(eq(seoAnalyses.url, url))
      .orderBy(desc(seoAnalyses.createdAt))
      .limit(1);
    
    if (analysis) {
      // Convert technicalChecks back to array if it's an object with numeric keys
      if (analysis.technicalChecks && typeof analysis.technicalChecks === 'object' && !Array.isArray(analysis.technicalChecks)) {
        analysis.technicalChecks = Object.keys(analysis.technicalChecks)
          .filter(key => !isNaN(Number(key)))
          .map(key => (analysis.technicalChecks as any)[key])
          .filter(Boolean);
      }
    }
    
    return analysis || undefined;
  }

  async createSeoAnalysis(insertAnalysis: InsertSeoAnalysis): Promise<SeoAnalysis> {
    const [analysis] = await db
      .insert(seoAnalyses)
      .values(insertAnalysis)
      .returning();
    return analysis;
  }

  async getAllSeoAnalyses(): Promise<SeoAnalysis[]> {
    const analyses = await db
      .select()
      .from(seoAnalyses)
      .orderBy(desc(seoAnalyses.createdAt));
    
    return analyses.map(analysis => {
      // Convert technicalChecks back to array if it's an object with numeric keys
      if (analysis.technicalChecks && typeof analysis.technicalChecks === 'object' && !Array.isArray(analysis.technicalChecks)) {
        analysis.technicalChecks = Object.keys(analysis.technicalChecks)
          .filter(key => !isNaN(Number(key)))
          .map(key => (analysis.technicalChecks as any)[key])
          .filter(Boolean);
      }
      return analysis;
    });
  }

  // Website management methods
  async getWebsite(id: number): Promise<Website | undefined> {
    const [website] = await db
      .select()
      .from(websites)
      .where(eq(websites.id, id));
    return website || undefined;
  }

  async getWebsiteByUrl(url: string): Promise<Website | undefined> {
    const [website] = await db
      .select()
      .from(websites)
      .where(eq(websites.url, url));
    return website || undefined;
  }

  async createWebsite(insertWebsite: InsertWebsite): Promise<Website> {
    const [website] = await db
      .insert(websites)
      .values(insertWebsite)
      .returning();
    return website;
  }

  async updateWebsite(id: number, updateData: Partial<Website>): Promise<Website | undefined> {
    const [website] = await db
      .update(websites)
      .set({ ...updateData, updatedAt: new Date() })
      .where(eq(websites.id, id))
      .returning();
    return website || undefined;
  }

  async getAllWebsites(): Promise<Website[]> {
    return await db
      .select()
      .from(websites)
      .where(eq(websites.isActive, true))
      .orderBy(desc(websites.lastScanned));
  }

  // Historical tracking methods
  async getWebsiteHistory(websiteId: number, limit = 30): Promise<ScoreHistory[]> {
    return await db
      .select()
      .from(scoreHistory)
      .where(eq(scoreHistory.websiteId, websiteId))
      .orderBy(desc(scoreHistory.date))
      .limit(limit);
  }

  async getWebsiteAnalyses(websiteId: number, limit = 10): Promise<SeoAnalysis[]> {
    const analyses = await db
      .select()
      .from(seoAnalyses)
      .where(eq(seoAnalyses.websiteId, websiteId))
      .orderBy(desc(seoAnalyses.createdAt))
      .limit(limit);
    
    return analyses.map(analysis => {
      // Convert technicalChecks back to array if it's an object with numeric keys
      if (analysis.technicalChecks && typeof analysis.technicalChecks === 'object' && !Array.isArray(analysis.technicalChecks)) {
        analysis.technicalChecks = Object.keys(analysis.technicalChecks)
          .filter(key => !isNaN(Number(key)))
          .map(key => (analysis.technicalChecks as any)[key])
          .filter(Boolean);
      }
      return analysis;
    });
  }

  async createScoreHistory(insertScoreHistory: InsertScoreHistory): Promise<ScoreHistory> {
    const [scoreEntry] = await db
      .insert(scoreHistory)
      .values(insertScoreHistory)
      .returning();
    return scoreEntry;
  }
}

export const storage = new DatabaseStorage();
