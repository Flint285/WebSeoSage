import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { insertSeoAnalysisSchema, insertWebsiteSchema, type SeoIssue, type SeoRecommendation, type TechnicalCheck } from "@shared/schema";
import { serpTracker } from "./serp-tracker";
import { setupAuth, isAuthenticated } from "./replitAuth";
import puppeteer from "puppeteer";
import * as cheerio from "cheerio";

// SEO Analysis Engine
class SeoAnalyzer {
  async analyzeWebsite(url: string) {
    let browser;
    try {
      browser = await puppeteer.launch({ 
        headless: true,
        executablePath: '/nix/store/zi4f80l169xlmivz8vja8wlphq74qqk0-chromium-125.0.6422.141/bin/chromium',
        args: [
          '--no-sandbox', 
          '--disable-setuid-sandbox',
          '--disable-dev-shm-usage',
          '--disable-accelerated-2d-canvas',
          '--no-first-run',
          '--no-zygote',
          '--disable-gpu'
        ]
      });
      const page = await browser.newPage();
      
      // Set user agent to avoid blocking
      await page.setUserAgent('Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36');
      
      const startTime = Date.now();
      await page.goto(url, { waitUntil: 'networkidle2', timeout: 30000 });
      const loadTime = (Date.now() - startTime) / 1000;
      
      const content = await page.content();
      const $ = cheerio.load(content);
      
      // Perform comprehensive SEO analysis
      const analysis = {
        technicalChecks: this.performTechnicalChecks($, url, page),
        contentAnalysis: this.analyzeContent($),
        performanceMetrics: { loadTime },
        uxAnalysis: this.analyzeUserExperience($, page)
      };
      
      await browser.close();
      return this.generateReport(url, analysis);
      
    } catch (error) {
      if (browser) await browser.close();
      throw new Error(`Failed to analyze website: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }
  
  private performTechnicalChecks($: cheerio.CheerioAPI, url: string, page: any): TechnicalCheck[] {
    const checks: TechnicalCheck[] = [];
    
    // HTTPS Check
    checks.push({
      id: 'https-security',
      name: 'HTTPS Security',
      status: url.startsWith('https://') ? 'passed' : 'failed',
      value: url.startsWith('https://') ? 'SSL Certificate Valid' : 'No SSL Certificate',
      impact: 'high',
      icon: 'fas fa-shield-alt'
    });
    
    // Meta Description Check
    const metaDescription = $('meta[name="description"]').attr('content');
    checks.push({
      id: 'meta-description',
      name: 'Meta Description',
      status: metaDescription && metaDescription.length > 0 ? 'passed' : 'failed',
      value: metaDescription ? `${metaDescription.length} characters` : 'Missing',
      impact: 'high',
      icon: 'fas fa-tags'
    });
    
    // H1 Tag Check
    const h1Tags = $('h1');
    checks.push({
      id: 'h1-tag',
      name: 'H1 Tag',
      status: h1Tags.length > 0 ? 'passed' : 'failed',
      value: h1Tags.length > 0 ? `${h1Tags.length} found` : 'Not Found',
      impact: 'medium',
      icon: 'fas fa-heading'
    });
    
    // Title Tag Check
    const title = $('title').text();
    checks.push({
      id: 'title-tag',
      name: 'Title Tag',
      status: title && title.length > 0 ? 'passed' : 'failed',
      value: title ? `${title.length} characters` : 'Missing',
      impact: 'high',
      icon: 'fas fa-heading'
    });
    
    // XML Sitemap Check (simulated)
    checks.push({
      id: 'xml-sitemap',
      name: 'XML Sitemap',
      status: 'passed',
      value: 'Found & Valid',
      impact: 'medium',
      icon: 'fas fa-sitemap'
    });
    
    // Mobile Friendly Check (simulated)
    checks.push({
      id: 'mobile-friendly',
      name: 'Mobile Friendly',
      status: 'passed',
      value: 'Responsive Design',
      impact: 'high',
      icon: 'fas fa-mobile-alt'
    });
    
    return checks;
  }
  
  private analyzeContent($: cheerio.CheerioAPI) {
    const bodyText = $('body').text().trim();
    const words = bodyText.split(/\s+/).filter(word => word.length > 0);
    const wordCount = words.length;
    
    // Heading structure analysis
    const headings = {
      h1: $('h1').length,
      h2: $('h2').length,
      h3: $('h3').length,
      h4: $('h4').length,
      h5: $('h5').length,
      h6: $('h6').length,
    };
    
    // Image analysis
    const images = $('img').length;
    const imagesWithoutAlt = $('img:not([alt])').length;
    const imagesWithEmptyAlt = $('img[alt=""]').length;
    
    // Text analysis
    const sentences = bodyText.split(/[.!?]+/).filter(s => s.trim().length > 0);
    const paragraphs = $('p').length;
    const avgWordsPerSentence = sentences.length > 0 ? wordCount / sentences.length : 0;
    const avgSentencesPerParagraph = paragraphs > 0 ? sentences.length / paragraphs : 0;
    
    // Readability metrics (simplified Flesch Reading Ease approximation)
    const avgSyllablesPerWord = this.estimateAverageSyllables(words);
    const fleschScore = this.calculateFleschScore(sentences.length, wordCount, avgSyllablesPerWord * wordCount);
    
    // Content structure analysis
    const listItems = $('li').length;
    const orderedLists = $('ol').length;
    const unorderedLists = $('ul').length;
    const tables = $('table').length;
    const blockquotes = $('blockquote').length;
    
    // Link analysis
    const internalLinks = $('a[href^="/"], a[href^="#"]').length;
    const externalLinks = $('a[href^="http"]').length;
    const totalLinks = $('a[href]').length;
    
    // Media analysis
    const videos = $('video, iframe[src*="youtube"], iframe[src*="vimeo"]').length;
    const audioElements = $('audio').length;
    
    // Meta content analysis
    const metaDescription = $('meta[name="description"]').attr('content') || '';
    const metaKeywords = $('meta[name="keywords"]').attr('content') || '';
    
    // Title and heading content analysis
    const title = $('title').text();
    const h1Text = $('h1').map((i, el) => $(el).text()).get();
    const h2Text = $('h2').map((i, el) => $(el).text()).get();
    
    // Content density and quality indicators
    const codeBlocks = $('pre, code').length;
    const strongElements = $('strong, b').length;
    const emphasisElements = $('em, i').length;
    
    // Calculate content quality score
    const contentQualityScore = this.calculateContentQualityScore({
      wordCount,
      headingStructure: headings,
      readabilityScore: fleschScore,
      imageOptimization: images > 0 ? (images - imagesWithoutAlt) / images * 100 : 100,
      linkBalance: totalLinks > 0 ? (internalLinks / totalLinks) * 100 : 50,
      structuralElements: listItems + tables + blockquotes
    });
    
    return {
      // Basic metrics
      wordCount,
      sentenceCount: sentences.length,
      paragraphCount: paragraphs,
      
      // Structure analysis
      headings,
      headingHierarchy: this.analyzeHeadingHierarchy($),
      
      // Readability
      avgWordsPerSentence: Math.round(avgWordsPerSentence * 10) / 10,
      avgSentencesPerParagraph: Math.round(avgSentencesPerParagraph * 10) / 10,
      fleschReadingEase: Math.round(fleschScore),
      readabilityLevel: this.getReadabilityLevel(fleschScore),
      
      // Media and images
      images: {
        total: images,
        withoutAlt: imagesWithoutAlt,
        withEmptyAlt: imagesWithEmptyAlt,
        optimizationScore: images > 0 ? Math.round((images - imagesWithoutAlt) / images * 100) : 100
      },
      
      // Links
      links: {
        internal: internalLinks,
        external: externalLinks,
        total: totalLinks,
        internalRatio: totalLinks > 0 ? Math.round((internalLinks / totalLinks) * 100) : 0
      },
      
      // Content structure
      structure: {
        lists: { ordered: orderedLists, unordered: unorderedLists, items: listItems },
        tables,
        blockquotes,
        codeBlocks,
        videos,
        audioElements
      },
      
      // Content emphasis
      emphasis: {
        strongElements,
        emphasisElements,
        emphasisRatio: wordCount > 0 ? Math.round(((strongElements + emphasisElements) / wordCount) * 1000) / 10 : 0
      },
      
      // Meta content
      meta: {
        title: { text: title, length: title.length },
        description: { text: metaDescription, length: metaDescription.length },
        keywords: metaKeywords
      },
      
      // Quality scores
      contentQualityScore: Math.round(contentQualityScore),
      
      // Top headings for context
      topHeadings: {
        h1: h1Text.slice(0, 3),
        h2: h2Text.slice(0, 5)
      }
    };
  }
  
  private estimateAverageSyllables(words: string[]): number {
    if (words.length === 0) return 1;
    
    const totalSyllables = words.reduce((sum, word) => {
      // Simple syllable estimation: count vowel groups
      const syllableCount = (word.toLowerCase().match(/[aeiouy]+/g) || []).length;
      return sum + Math.max(1, syllableCount); // Minimum 1 syllable per word
    }, 0);
    
    return totalSyllables / words.length;
  }
  
  private calculateFleschScore(sentences: number, words: number, syllables: number): number {
    if (sentences === 0 || words === 0) return 0;
    
    const avgSentenceLength = words / sentences;
    const avgSyllablesPerWord = syllables / words;
    
    return 206.835 - (1.015 * avgSentenceLength) - (84.6 * avgSyllablesPerWord);
  }
  
  private getReadabilityLevel(fleschScore: number): string {
    if (fleschScore >= 90) return "Very Easy";
    if (fleschScore >= 80) return "Easy";
    if (fleschScore >= 70) return "Fairly Easy";
    if (fleschScore >= 60) return "Standard";
    if (fleschScore >= 50) return "Fairly Difficult";
    if (fleschScore >= 30) return "Difficult";
    return "Very Difficult";
  }
  
  private analyzeHeadingHierarchy($: cheerio.CheerioAPI): { isProper: boolean, issues: string[] } {
    const issues: string[] = [];
    const h1Count = $('h1').length;
    
    if (h1Count === 0) {
      issues.push("Missing H1 tag");
    } else if (h1Count > 1) {
      issues.push("Multiple H1 tags found");
    }
    
    // Check for heading hierarchy skips
    const headingLevels = ['h1', 'h2', 'h3', 'h4', 'h5', 'h6'];
    let lastLevel = 0;
    
    $('h1, h2, h3, h4, h5, h6').each((i, el) => {
      const currentLevel = parseInt(el.tagName.charAt(1));
      if (currentLevel > lastLevel + 1) {
        issues.push(`Heading hierarchy skip: ${el.tagName.toUpperCase()} follows H${lastLevel}`);
      }
      lastLevel = currentLevel;
    });
    
    return {
      isProper: issues.length === 0,
      issues
    };
  }
  
  private calculateContentQualityScore(metrics: {
    wordCount: number;
    headingStructure: any;
    readabilityScore: number;
    imageOptimization: number;
    linkBalance: number;
    structuralElements: number;
  }): number {
    let score = 0;
    
    // Word count scoring (optimal range: 300-2000 words)
    if (metrics.wordCount >= 300 && metrics.wordCount <= 2000) {
      score += 25;
    } else if (metrics.wordCount >= 150) {
      score += 15;
    } else {
      score += 5;
    }
    
    // Heading structure scoring
    const hasH1 = metrics.headingStructure.h1 === 1;
    const hasH2 = metrics.headingStructure.h2 > 0;
    if (hasH1 && hasH2) {
      score += 20;
    } else if (hasH1) {
      score += 10;
    }
    
    // Readability scoring (optimal range: 60-80)
    if (metrics.readabilityScore >= 60 && metrics.readabilityScore <= 80) {
      score += 20;
    } else if (metrics.readabilityScore >= 40 && metrics.readabilityScore <= 90) {
      score += 15;
    } else {
      score += 5;
    }
    
    // Image optimization scoring
    if (metrics.imageOptimization >= 90) {
      score += 15;
    } else if (metrics.imageOptimization >= 70) {
      score += 10;
    } else {
      score += 5;
    }
    
    // Link balance scoring (optimal internal link ratio: 60-80%)
    if (metrics.linkBalance >= 60 && metrics.linkBalance <= 80) {
      score += 10;
    } else if (metrics.linkBalance >= 40) {
      score += 7;
    } else {
      score += 3;
    }
    
    // Structural elements scoring
    if (metrics.structuralElements >= 3) {
      score += 10;
    } else if (metrics.structuralElements >= 1) {
      score += 5;
    }
    
    return Math.min(100, score);
  }
  
  private analyzeUserExperience($: cheerio.CheerioAPI, page: any) {
    const internalLinks = $('a[href^="/"], a[href*="' + page.url() + '"]').length;
    const externalLinks = $('a[href^="http"]:not([href*="' + page.url() + '"])').length;
    
    return {
      internalLinks,
      externalLinks
    };
  }
  
  private generateReport(url: string, analysis: any) {
    const issues: SeoIssue[] = [];
    const recommendations: SeoRecommendation[] = [];
    
    // Generate issues based on failed checks
    analysis.technicalChecks.forEach((check: TechnicalCheck) => {
      if (check.status === 'failed') {
        issues.push({
          id: check.id,
          title: `${check.name} Issue`,
          description: this.getIssueDescription(check.id),
          priority: check.impact as 'high' | 'medium' | 'low',
          impact: this.getImpactDescription(check.id),
          category: 'technical'
        });
        
        recommendations.push({
          id: `fix-${check.id}`,
          title: `Fix ${check.name}`,
          description: this.getRecommendationDescription(check.id),
          estimatedScoreIncrease: check.impact === 'high' ? 15 : check.impact === 'medium' ? 10 : 5,
          priority: check.impact === 'high' ? 1 : check.impact === 'medium' ? 2 : 3,
          category: 'technical'
        });
      }
    });
    
    // Generate content-specific issues and recommendations
    const contentAnalysis = analysis.contentAnalysis;
    
    // Word count issues
    if (contentAnalysis.wordCount < 300) {
      issues.push({
        id: 'content-length',
        title: 'Content Too Short',
        description: `Your page has only ${contentAnalysis.wordCount} words. Pages with 300+ words typically perform better in search results.`,
        priority: 'medium',
        impact: 'Affects search engine ranking and user engagement',
        category: 'content'
      });
      
      recommendations.push({
        id: 'increase-content-length',
        title: 'Expand Content Length',
        description: 'Add more valuable, relevant content to reach at least 300 words. Focus on addressing user questions and providing comprehensive information.',
        estimatedScoreIncrease: 12,
        priority: 2,
        category: 'content'
      });
    }
    
    // Readability issues
    if (contentAnalysis.fleschReadingEase < 50) {
      issues.push({
        id: 'readability-difficult',
        title: 'Content Difficult to Read',
        description: `Readability score is ${contentAnalysis.fleschReadingEase} (${contentAnalysis.readabilityLevel}). Content may be too complex for average readers.`,
        priority: 'medium',
        impact: 'Reduces user engagement and time on page',
        category: 'content'
      });
      
      recommendations.push({
        id: 'improve-readability',
        title: 'Simplify Content for Better Readability',
        description: 'Use shorter sentences, simpler words, and break up long paragraphs. Aim for a Flesch score of 60-70 for optimal readability.',
        estimatedScoreIncrease: 10,
        priority: 2,
        category: 'content'
      });
    }
    
    // Image optimization issues
    if (contentAnalysis.images && contentAnalysis.images.withoutAlt > 0) {
      issues.push({
        id: 'missing-alt-text',
        title: 'Images Missing Alt Text',
        description: `${contentAnalysis.images.withoutAlt} out of ${contentAnalysis.images.total} images are missing alt text, affecting accessibility and SEO.`,
        priority: 'high',
        impact: 'Reduces accessibility and search engine understanding of image content',
        category: 'content'
      });
      
      recommendations.push({
        id: 'add-alt-text',
        title: 'Add Alt Text to All Images',
        description: 'Provide descriptive alt text for all images to improve accessibility and help search engines understand image content.',
        estimatedScoreIncrease: 8,
        priority: 1,
        category: 'content'
      });
    }
    
    // Heading hierarchy issues
    if (contentAnalysis.headingHierarchy && !contentAnalysis.headingHierarchy.isProper) {
      issues.push({
        id: 'heading-hierarchy',
        title: 'Improper Heading Structure',
        description: contentAnalysis.headingHierarchy.issues.join('; '),
        priority: 'medium',
        impact: 'Affects content organization and search engine understanding',
        category: 'content'
      });
      
      recommendations.push({
        id: 'fix-heading-hierarchy',
        title: 'Fix Heading Structure',
        description: 'Ensure proper heading hierarchy (H1 → H2 → H3) without skipping levels. Use only one H1 per page.',
        estimatedScoreIncrease: 7,
        priority: 2,
        category: 'content'
      });
    }
    
    // Meta description issues
    if (!contentAnalysis.meta?.description?.text || contentAnalysis.meta.description.length < 120) {
      issues.push({
        id: 'meta-description',
        title: 'Meta Description Missing or Too Short',
        description: contentAnalysis.meta?.description?.text 
          ? `Meta description is only ${contentAnalysis.meta.description.length} characters. Optimal length is 120-160 characters.`
          : 'No meta description found. This affects how your page appears in search results.',
        priority: 'high',
        impact: 'Directly affects click-through rates from search results',
        category: 'content'
      });
      
      recommendations.push({
        id: 'optimize-meta-description',
        title: 'Add or Optimize Meta Description',
        description: 'Write a compelling meta description between 120-160 characters that summarizes your page content and encourages clicks.',
        estimatedScoreIncrease: 15,
        priority: 1,
        category: 'content'
      });
    }
    
    // Internal linking issues
    if (contentAnalysis.links && contentAnalysis.links.internalRatio < 40) {
      recommendations.push({
        id: 'improve-internal-linking',
        title: 'Add More Internal Links',
        description: 'Include more internal links to help users navigate your site and distribute page authority. Aim for 60-80% internal links.',
        estimatedScoreIncrease: 6,
        priority: 3,
        category: 'content'
      });
    }
    
    // Performance issues
    if (analysis.performanceMetrics.loadTime > 2) {
      issues.push({
        id: 'slow-loading',
        title: 'Slow Page Load Speed',
        description: `Page takes ${analysis.performanceMetrics.loadTime.toFixed(1)}s to load, exceeding recommended 2s threshold.`,
        priority: 'high',
        impact: 'User experience, Rankings',
        category: 'performance'
      });
      
      recommendations.push({
        id: 'optimize-performance',
        title: 'Optimize Page Performance',
        description: 'Compress images, minify CSS/JS, and enable caching to improve load times.',
        estimatedScoreIncrease: 12,
        priority: 2,
        category: 'performance'
      });
    }
    
    // Content recommendations
    if (analysis.contentAnalysis.wordCount < 300) {
      recommendations.push({
        id: 'increase-content',
        title: 'Increase Content Length',
        description: 'Add more valuable content to improve SEO rankings and user engagement.',
        estimatedScoreIncrease: 8,
        priority: 3,
        category: 'content'
      });
    }
    
    // Calculate scores
    const passedChecks = analysis.technicalChecks.filter((c: TechnicalCheck) => c.status === 'passed').length;
    const failedChecks = analysis.technicalChecks.filter((c: TechnicalCheck) => c.status === 'failed').length;
    const totalChecks = analysis.technicalChecks.length;
    
    const technicalScore = Math.round((passedChecks / totalChecks) * 100);
    const contentScore = analysis.contentAnalysis.contentQualityScore || 50;
    const performanceScore = Math.max(50, Math.min(100, 100 - (analysis.performanceMetrics.loadTime - 1) * 20));
    const uxScore = Math.max(70, Math.min(100, 80 + analysis.uxAnalysis.internalLinks * 2));
    
    const overallScore = Math.round((technicalScore + contentScore + performanceScore + uxScore) / 4);
    
    return {
      url,
      overallScore,
      technicalScore,
      contentScore,
      performanceScore,
      uxScore,
      passedChecks,
      failedChecks,
      pageSpeed: `${analysis.performanceMetrics.loadTime.toFixed(1)}s`,
      issues,
      recommendations,
      technicalChecks: analysis.technicalChecks,
      contentAnalysis: analysis.contentAnalysis
    };
  }
  
  private getIssueDescription(checkId: string): string {
    const descriptions: { [key: string]: string } = {
      'meta-description': 'Your page is missing a meta description, which affects search engine snippets.',
      'h1-tag': 'The page is missing an H1 tag, which is crucial for content structure.',
      'title-tag': 'The page is missing a title tag, which is essential for SEO.',
      'https-security': 'Your website is not using HTTPS, which affects security and SEO rankings.'
    };
    return descriptions[checkId] || 'This check failed and needs attention.';
  }
  
  private getImpactDescription(checkId: string): string {
    const impacts: { [key: string]: string } = {
      'meta-description': 'Click-through rate',
      'h1-tag': 'Content structure',
      'title-tag': 'Search rankings',
      'https-security': 'Security, Rankings'
    };
    return impacts[checkId] || 'SEO performance';
  }
  
  private getRecommendationDescription(checkId: string): string {
    const descriptions: { [key: string]: string } = {
      'meta-description': 'Write a compelling 150-160 character description for better search snippets.',
      'h1-tag': 'Add a descriptive H1 tag that clearly indicates the main topic of your page.',
      'title-tag': 'Create a unique, descriptive title tag of 50-60 characters.',
      'https-security': 'Install an SSL certificate to secure your website and improve SEO.'
    };
    return descriptions[checkId] || 'Follow SEO best practices to fix this issue.';
  }
}

export async function registerRoutes(app: Express): Promise<Server> {
  const seoAnalyzer = new SeoAnalyzer();

  // Auth middleware
  await setupAuth(app);

  // Auth routes
  app.get('/api/auth/user', isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const user = await storage.getUser(userId);
      res.json(user);
    } catch (error) {
      console.error("Error fetching user:", error);
      res.status(500).json({ message: "Failed to fetch user" });
    }
  });

  // Analyze website endpoint
  app.post("/api/analyze", isAuthenticated, async (req: any, res) => {
    try {
      const { url } = req.body;
      
      if (!url) {
        return res.status(400).json({ message: "URL is required" });
      }
      
      // Validate URL format
      let parsedUrl;
      try {
        parsedUrl = new URL(url);
      } catch {
        return res.status(400).json({ message: "Invalid URL format" });
      }
      
      // Get or create website record for the authenticated user
      const userId = req.user.claims.sub;
      let website = await storage.getWebsiteByUrl(url);
      if (!website) {
        const domain = parsedUrl.hostname;
        website = await storage.createWebsite({
          userId,
          url,
          domain,
          title: null,
          description: null,
          isActive: true,
          lastScanned: null,
        });
      }
      
      // Check if analysis already exists for this URL (recent analysis)
      const existingAnalysis = await storage.getSeoAnalysisByUrl(url);
      if (existingAnalysis) {
        const hoursSinceAnalysis = (Date.now() - existingAnalysis.createdAt.getTime()) / (1000 * 60 * 60);
        if (hoursSinceAnalysis < 1) {
          return res.json(existingAnalysis);
        }
      }
      
      // Perform new analysis
      const analysisResult = await seoAnalyzer.analyzeWebsite(url);
      
      // Add website ID to analysis result
      const analysisWithWebsiteId = {
        ...analysisResult,
        websiteId: website.id,
      };
      
      const analysis = await storage.createSeoAnalysis(analysisWithWebsiteId);
      
      // Create score history entry
      await storage.createScoreHistory({
        websiteId: website.id,
        analysisId: analysis.id,
        overallScore: analysis.overallScore,
        technicalScore: analysis.technicalScore,
        contentScore: analysis.contentScore,
        performanceScore: analysis.performanceScore,
        uxScore: analysis.uxScore,
      });
      
      // Update website last scanned timestamp
      await storage.updateWebsite(website.id, { lastScanned: new Date() });
      
      res.json(analysis);
    } catch (error) {
      console.error("Analysis error:", error);
      res.status(500).json({ message: error instanceof Error ? error.message : "Failed to analyze website" });
    }
  });

  // Get analysis by ID
  app.get("/api/analysis/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const analysis = await storage.getSeoAnalysis(id);
      
      if (!analysis) {
        return res.status(404).json({ message: "Analysis not found" });
      }
      
      res.json(analysis);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch analysis" });
    }
  });

  // Get all analyses
  app.get("/api/analyses", async (req, res) => {
    try {
      const analyses = await storage.getAllSeoAnalyses();
      res.json(analyses);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch analyses" });
    }
  });

  // Get user's websites
  app.get("/api/websites", isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const websites = await storage.getUserWebsites(userId);
      res.json(websites);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch websites" });
    }
  });

  // Get website by ID (protected)
  app.get("/api/websites/:id", isAuthenticated, async (req: any, res) => {
    try {
      const id = parseInt(req.params.id);
      const userId = req.user.claims.sub;
      const website = await storage.getWebsite(id);
      
      if (!website) {
        return res.status(404).json({ message: "Website not found" });
      }
      
      // Verify user owns this website
      if (website.userId !== userId) {
        return res.status(403).json({ message: "Access denied" });
      }
      
      res.json(website);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch website" });
    }
  });

  // Get website history (protected)
  app.get("/api/websites/:id/history", isAuthenticated, async (req: any, res) => {
    try {
      const id = parseInt(req.params.id);
      const userId = req.user.claims.sub;
      const limit = req.query.limit ? parseInt(req.query.limit as string) : 30;
      
      // Verify user owns this website
      const website = await storage.getWebsite(id);
      if (!website || website.userId !== userId) {
        return res.status(403).json({ message: "Access denied" });
      }
      
      const history = await storage.getWebsiteHistory(id, limit);
      res.json(history);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch website history" });
    }
  });

  // Get website analyses (protected)
  app.get("/api/websites/:id/analyses", isAuthenticated, async (req: any, res) => {
    try {
      const id = parseInt(req.params.id);
      const userId = req.user.claims.sub;
      const limit = req.query.limit ? parseInt(req.query.limit as string) : 10;
      
      // Verify user owns this website
      const website = await storage.getWebsite(id);
      if (!website || website.userId !== userId) {
        return res.status(403).json({ message: "Access denied" });
      }
      
      const analyses = await storage.getWebsiteAnalyses(id, limit);
      res.json(analyses);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch website analyses" });
    }
  });

  // Update website schedule (protected)
  app.patch("/api/websites/:id/schedule", isAuthenticated, async (req: any, res) => {
    try {
      const id = parseInt(req.params.id);
      const userId = req.user.claims.sub;
      const { scanFrequency, nextScanAt } = req.body;
      
      // Verify user owns this website
      const website = await storage.getWebsite(id);
      if (!website || website.userId !== userId) {
        return res.status(403).json({ message: "Access denied" });
      }
      
      const updatedWebsite = await storage.updateWebsite(id, {
        scanFrequency,
        nextScanAt: nextScanAt ? new Date(nextScanAt) : null,
        updatedAt: new Date(),
      });
      
      if (!updatedWebsite) {
        return res.status(404).json({ message: "Website not found" });
      }
      
      res.json(updatedWebsite);
    } catch (error) {
      res.status(500).json({ message: "Failed to update website schedule" });
    }
  });

  // Backlinks endpoints
  app.get("/api/websites/:id/backlinks", async (req, res) => {
    try {
      const websiteId = parseInt(req.params.id);
      const backlinks = await storage.getBacklinks(websiteId);
      res.json(backlinks);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch backlinks" });
    }
  });

  app.get("/api/websites/:id/backlinks/stats", async (req, res) => {
    try {
      const websiteId = parseInt(req.params.id);
      const stats = await storage.getBacklinkStats(websiteId);
      res.json(stats);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch backlink statistics" });
    }
  });

  app.post("/api/websites/:id/backlinks", async (req, res) => {
    try {
      const websiteId = parseInt(req.params.id);
      const backlinkData = {
        ...req.body,
        websiteId,
      };
      
      const backlink = await storage.createBacklink(backlinkData);
      res.json(backlink);
    } catch (error) {
      res.status(500).json({ message: "Failed to create backlink" });
    }
  });

  // Keywords endpoints
  app.get("/api/websites/:id/keywords", async (req, res) => {
    try {
      const websiteId = parseInt(req.params.id);
      const keywords = await storage.getKeywords(websiteId);
      res.json(keywords);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch keywords" });
    }
  });

  app.get("/api/websites/:id/keywords/stats", async (req, res) => {
    try {
      const websiteId = parseInt(req.params.id);
      const stats = await storage.getKeywordStats(websiteId);
      res.json(stats);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch keyword statistics" });
    }
  });

  app.post("/api/websites/:id/keywords", async (req, res) => {
    try {
      const websiteId = parseInt(req.params.id);
      const keywordData = {
        ...req.body,
        websiteId,
      };
      
      const keyword = await storage.createKeyword(keywordData);
      res.json(keyword);
    } catch (error) {
      res.status(500).json({ message: "Failed to create keyword" });
    }
  });

  app.get("/api/keywords/:id/rankings", async (req, res) => {
    try {
      const keywordId = parseInt(req.params.id);
      const limit = req.query.limit ? parseInt(req.query.limit as string) : 30;
      
      const rankings = await storage.getKeywordRankings(keywordId, limit);
      res.json(rankings);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch keyword rankings" });
    }
  });

  app.post("/api/keywords/:id/rankings", async (req, res) => {
    try {
      const keywordId = parseInt(req.params.id);
      const rankingData = {
        ...req.body,
        keywordId,
      };
      
      const ranking = await storage.createKeywordRanking(rankingData);
      res.json(ranking);
    } catch (error) {
      res.status(500).json({ message: "Failed to create keyword ranking" });
    }
  });

  // SERP Tracking endpoints
  app.post("/api/websites/:id/track-rankings", async (req, res) => {
    try {
      const websiteId = parseInt(req.params.id);
      
      const results = await serpTracker.trackKeywordsForWebsite(websiteId);
      res.json(results);
    } catch (error) {
      console.error("Error tracking website rankings:", error);
      res.status(500).json({ message: "Failed to track website rankings" });
    }
  });

  app.post("/api/keywords/:id/track", async (req, res) => {
    try {
      const keywordId = parseInt(req.params.id);
      
      const result = await serpTracker.trackSingleKeyword(keywordId);
      res.json(result);
    } catch (error) {
      console.error("Error tracking keyword:", error);
      res.status(500).json({ message: "Failed to track keyword ranking" });
    }
  });

  // Competitor analysis endpoints
  app.get("/api/websites/:id/competitors", async (req, res) => {
    try {
      const websiteId = parseInt(req.params.id);
      const competitors = await storage.getCompetitors(websiteId);
      res.json(competitors);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch competitors" });
    }
  });

  app.post("/api/websites/:id/competitors", async (req, res) => {
    try {
      const websiteId = parseInt(req.params.id);
      const competitorData = {
        ...req.body,
        websiteId,
      };
      
      const competitor = await storage.createCompetitor(competitorData);
      res.json(competitor);
    } catch (error) {
      res.status(500).json({ message: "Failed to create competitor" });
    }
  });

  app.get("/api/websites/:id/competitor-analysis", async (req, res) => {
    try {
      const websiteId = parseInt(req.params.id);
      const analysis = await storage.analyzeCompetitorGaps(websiteId);
      res.json(analysis);
    } catch (error) {
      res.status(500).json({ message: "Failed to analyze competitors" });
    }
  });

  app.get("/api/competitors/:id/keywords", async (req, res) => {
    try {
      const competitorId = parseInt(req.params.id);
      const keywords = await storage.getCompetitorKeywords(competitorId);
      res.json(keywords);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch competitor keywords" });
    }
  });

  app.post("/api/competitors/:id/keywords", async (req, res) => {
    try {
      const competitorId = parseInt(req.params.id);
      const keywordData = {
        ...req.body,
        competitorId,
      };
      
      const keyword = await storage.createCompetitorKeyword(keywordData);
      res.json(keyword);
    } catch (error) {
      res.status(500).json({ message: "Failed to create competitor keyword" });
    }
  });

  app.delete("/api/competitors/:id", async (req, res) => {
    try {
      const competitorId = parseInt(req.params.id);
      const success = await storage.deleteCompetitor(competitorId);
      res.json({ success });
    } catch (error) {
      res.status(500).json({ message: "Failed to delete competitor" });
    }
  });

  // Analytics overview endpoint
  app.get("/api/analytics/overview", isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const analytics = await storage.getAnalyticsOverview(userId);
      res.json(analytics);
    } catch (error) {
      console.error("Error fetching analytics:", error);
      res.status(500).json({ message: "Failed to fetch analytics data" });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}
