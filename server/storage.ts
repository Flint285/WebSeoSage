import { seoAnalyses, type SeoAnalysis, type InsertSeoAnalysis } from "@shared/schema";

export interface IStorage {
  getUser(id: number): Promise<any | undefined>;
  getUserByUsername(username: string): Promise<any | undefined>;
  createUser(user: any): Promise<any>;
  getSeoAnalysis(id: number): Promise<SeoAnalysis | undefined>;
  getSeoAnalysisByUrl(url: string): Promise<SeoAnalysis | undefined>;
  createSeoAnalysis(analysis: InsertSeoAnalysis): Promise<SeoAnalysis>;
  getAllSeoAnalyses(): Promise<SeoAnalysis[]>;
}

export class MemStorage implements IStorage {
  private users: Map<number, any>;
  private seoAnalyses: Map<number, SeoAnalysis>;
  private currentUserId: number;
  private currentAnalysisId: number;

  constructor() {
    this.users = new Map();
    this.seoAnalyses = new Map();
    this.currentUserId = 1;
    this.currentAnalysisId = 1;
  }

  async getUser(id: number): Promise<any | undefined> {
    return this.users.get(id);
  }

  async getUserByUsername(username: string): Promise<any | undefined> {
    return Array.from(this.users.values()).find(
      (user) => user.username === username,
    );
  }

  async createUser(insertUser: any): Promise<any> {
    const id = this.currentUserId++;
    const user: any = { ...insertUser, id };
    this.users.set(id, user);
    return user;
  }

  async getSeoAnalysis(id: number): Promise<SeoAnalysis | undefined> {
    return this.seoAnalyses.get(id);
  }

  async getSeoAnalysisByUrl(url: string): Promise<SeoAnalysis | undefined> {
    return Array.from(this.seoAnalyses.values()).find(
      (analysis) => analysis.url === url,
    );
  }

  async createSeoAnalysis(insertAnalysis: InsertSeoAnalysis): Promise<SeoAnalysis> {
    const id = this.currentAnalysisId++;
    const analysis: SeoAnalysis = { 
      ...insertAnalysis, 
      id,
      createdAt: new Date()
    };
    this.seoAnalyses.set(id, analysis);
    return analysis;
  }

  async getAllSeoAnalyses(): Promise<SeoAnalysis[]> {
    return Array.from(this.seoAnalyses.values());
  }
}

export const storage = new MemStorage();
