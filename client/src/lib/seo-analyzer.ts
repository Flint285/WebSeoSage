// Client-side SEO utilities and helpers
export interface SeoAnalysisResult {
  url: string;
  overallScore: number;
  technicalScore: number;
  contentScore: number;
  performanceScore: number;
  uxScore: number;
  passedChecks: number;
  failedChecks: number;
  pageSpeed: string;
  issues: any[];
  recommendations: any[];
  technicalChecks: any[];
}

export class ClientSeoAnalyzer {
  static validateUrl(url: string): boolean {
    try {
      new URL(url);
      return true;
    } catch {
      return false;
    }
  }

  static formatUrl(url: string): string {
    if (!url.startsWith('http://') && !url.startsWith('https://')) {
      return `https://${url}`;
    }
    return url;
  }

  static getScoreColor(score: number): string {
    if (score >= 80) return "text-secondary";
    if (score >= 60) return "text-warning";
    return "text-error";
  }

  static getScoreLabel(score: number): string {
    if (score >= 80) return "Excellent";
    if (score >= 60) return "Good";
    if (score >= 40) return "Needs Work";
    return "Poor";
  }

  static getPriorityBadgeClass(priority: string): string {
    switch (priority) {
      case "high":
        return "bg-error text-white";
      case "medium":
        return "bg-warning text-white";
      case "low":
        return "bg-gray-500 text-white";
      default:
        return "bg-gray-500 text-white";
    }
  }
}
