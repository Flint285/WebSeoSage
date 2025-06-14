import puppeteer, { Browser, Page } from 'puppeteer';
import { storage } from './storage';
import type { Keyword } from '@shared/schema';

export class SerpTracker {
  private browser: Browser | null = null;

  async initBrowser() {
    if (!this.browser) {
      this.browser = await puppeteer.launch({
        headless: true,
        args: [
          '--no-sandbox',
          '--disable-setuid-sandbox',
          '--disable-dev-shm-usage',
          '--disable-accelerated-2d-canvas',
          '--no-first-run',
          '--no-zygote',
          '--single-process',
          '--disable-gpu'
        ]
      });
    }
    return this.browser;
  }

  async closeBrowser() {
    if (this.browser) {
      await this.browser.close();
      this.browser = null;
    }
  }

  async checkKeywordPosition(keyword: string, targetDomain: string, location = 'global', device = 'desktop'): Promise<{
    position: number | null;
    url: string | null;
    title: string | null;
  }> {
    const browser = await this.initBrowser();
    const page = await browser.newPage();

    try {
      // Set user agent based on device
      const userAgent = device === 'mobile' 
        ? 'Mozilla/5.0 (iPhone; CPU iPhone OS 14_7_1 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/14.1.2 Mobile/15E148 Safari/604.1'
        : 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36';

      await page.setUserAgent(userAgent);

      if (device === 'mobile') {
        await page.setViewport({ width: 375, height: 667 });
      }

      // Build search URL with location if specified
      let searchUrl = `https://www.google.com/search?q=${encodeURIComponent(keyword)}&num=100`;
      
      if (location !== 'global') {
        searchUrl += `&gl=${location}`;
      }

      await page.goto(searchUrl, { waitUntil: 'networkidle0', timeout: 30000 });

      // Wait for search results to load
      await page.waitForSelector('div[data-ved]', { timeout: 10000 });

      // Extract search results
      const results = await page.evaluate(() => {
        const resultElements = document.querySelectorAll('div[data-ved] h3');
        const linkElements = document.querySelectorAll('div[data-ved] a[href^="http"]');
        
        const searchResults = [];
        
        for (let i = 0; i < Math.min(resultElements.length, linkElements.length); i++) {
          const title = resultElements[i]?.textContent || '';
          const url = (linkElements[i] as HTMLAnchorElement)?.href || '';
          
          if (title && url && !url.includes('google.com')) {
            searchResults.push({
              position: i + 1,
              title: title.trim(),
              url: url
            });
          }
        }
        
        return searchResults;
      });

      // Find the position of our target domain
      for (const result of results) {
        try {
          const resultUrl = new URL(result.url);
          const resultDomain = resultUrl.hostname.replace('www.', '');
          const cleanTargetDomain = targetDomain.replace('www.', '').replace('https://', '').replace('http://', '');
          
          if (resultDomain.includes(cleanTargetDomain) || cleanTargetDomain.includes(resultDomain)) {
            return {
              position: result.position,
              url: result.url,
              title: result.title
            };
          }
        } catch (error) {
          // Skip invalid URLs
          continue;
        }
      }

      // Not found in top 100
      return {
        position: null,
        url: null,
        title: null
      };

    } catch (error) {
      console.error(`Error checking position for keyword "${keyword}":`, error);
      return {
        position: null,
        url: null,
        title: null
      };
    } finally {
      await page.close();
    }
  }

  async trackKeywordsForWebsite(websiteId: number): Promise<{
    tracked: number;
    errors: number;
    results: Array<{
      keywordId: number;
      keyword: string;
      position: number | null;
      url: string | null;
    }>;
  }> {
    const keywords = await storage.getKeywords(websiteId);
    const website = await storage.getWebsite(websiteId);
    
    if (!website) {
      throw new Error(`Website with ID ${websiteId} not found`);
    }

    const results = [];
    let tracked = 0;
    let errors = 0;

    // Extract domain from website URL
    const targetDomain = new URL(website.url).hostname;

    for (const keyword of keywords) {
      try {
        console.log(`Checking position for keyword: ${keyword.keyword}`);
        
        const result = await this.checkKeywordPosition(
          keyword.keyword,
          targetDomain,
          'global',
          'desktop'
        );

        // Save the ranking to database
        await storage.createKeywordRanking({
          keywordId: keyword.id,
          position: result.position,
          url: result.url,
          searchEngine: 'google',
          location: 'global',
          device: 'desktop'
        });

        results.push({
          keywordId: keyword.id,
          keyword: keyword.keyword,
          position: result.position,
          url: result.url
        });

        tracked++;

        // Add delay to avoid being blocked
        await new Promise(resolve => setTimeout(resolve, 2000 + Math.random() * 3000));

      } catch (error) {
        console.error(`Error tracking keyword ${keyword.keyword}:`, error);
        errors++;
        
        results.push({
          keywordId: keyword.id,
          keyword: keyword.keyword,
          position: null,
          url: null
        });
      }
    }

    return {
      tracked,
      errors,
      results
    };
  }

  async trackSingleKeyword(keywordId: number): Promise<{
    success: boolean;
    position: number | null;
    url: string | null;
    error?: string;
  }> {
    try {
      // Get keyword and website info
      const keyword = await storage.getKeywords(0).then(keywords => 
        keywords.find(k => k.id === keywordId)
      );
      
      if (!keyword) {
        return {
          success: false,
          position: null,
          url: null,
          error: 'Keyword not found'
        };
      }

      const website = await storage.getWebsite(keyword.websiteId);
      if (!website) {
        return {
          success: false,
          position: null,
          url: null,
          error: 'Website not found'
        };
      }

      const targetDomain = new URL(website.url).hostname;
      
      const result = await this.checkKeywordPosition(
        keyword.keyword,
        targetDomain,
        'global',
        'desktop'
      );

      // Save the ranking to database
      await storage.createKeywordRanking({
        keywordId: keyword.id,
        position: result.position,
        url: result.url,
        searchEngine: 'google',
        location: 'global',
        device: 'desktop'
      });

      return {
        success: true,
        position: result.position,
        url: result.url
      };

    } catch (error) {
      console.error(`Error tracking single keyword:`, error);
      return {
        success: false,
        position: null,
        url: null,
        error: error instanceof Error ? error.message : 'Unknown error'
      };
    }
  }

  // Clean up resources
  async cleanup() {
    await this.closeBrowser();
  }
}

// Export singleton instance
export const serpTracker = new SerpTracker();

// Cleanup on process exit
process.on('exit', () => {
  serpTracker.cleanup();
});

process.on('SIGINT', () => {
  serpTracker.cleanup();
  process.exit();
});

process.on('SIGTERM', () => {
  serpTracker.cleanup();
  process.exit();
});