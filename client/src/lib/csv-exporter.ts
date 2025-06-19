import type { SeoAnalysis, ScoreHistory, Website } from "@shared/schema";

export class CsvExporter {
  static exportScoreHistory(history: ScoreHistory[], website: Website): void {
    const headers = [
      "Date",
      "Overall Score",
      "Technical Score", 
      "Content Score",
      "Performance Score",
      "UX Score"
    ];

    const rows = history.map(entry => [
      new Date(entry.date).toLocaleDateString(),
      entry.overallScore.toFixed(1),
      entry.technicalScore.toFixed(1),
      entry.contentScore.toFixed(1),
      entry.performanceScore.toFixed(1),
      entry.uxScore.toFixed(1)
    ]);

    const csvContent = [
      headers.join(","),
      ...rows.map(row => row.join(","))
    ].join("\n");

    this.downloadCsv(csvContent, `${website.domain}-score-history.csv`);
  }

  static exportAnalysisData(analyses: SeoAnalysis[], website: Website): void {
    const headers = [
      "Date",
      "Analysis ID",
      "Overall Score",
      "Technical Score",
      "Content Score", 
      "Performance Score",
      "UX Score",
      "Passed Checks",
      "Failed Checks",
      "Page Speed",
      "Issues Count",
      "Recommendations Count"
    ];

    const rows = analyses.map(analysis => [
      new Date(analysis.createdAt).toLocaleDateString(),
      analysis.id.toString(),
      analysis.overallScore.toFixed(1),
      analysis.technicalScore.toFixed(1),
      analysis.contentScore.toFixed(1),
      analysis.performanceScore.toFixed(1),
      analysis.uxScore.toFixed(1),
      analysis.passedChecks.toString(),
      analysis.failedChecks.toString(),
      analysis.pageSpeed,
      Array.isArray(analysis.issues) ? analysis.issues.length.toString() : "0",
      Array.isArray(analysis.recommendations) ? analysis.recommendations.length.toString() : "0"
    ]);

    const csvContent = [
      headers.join(","),
      ...rows.map(row => row.join(","))
    ].join("\n");

    this.downloadCsv(csvContent, `${website.domain}-analysis-data.csv`);
  }

  static exportDetailedAnalysis(analysis: SeoAnalysis): void {
    // Main analysis data
    const mainHeaders = [
      "Metric",
      "Value"
    ];

    const mainRows = [
      ["Analysis Date", new Date(analysis.createdAt).toLocaleDateString()],
      ["Website URL", analysis.url],
      ["Overall Score", analysis.overallScore.toFixed(1)],
      ["Technical Score", analysis.technicalScore.toFixed(1)],
      ["Content Score", analysis.contentScore.toFixed(1)],
      ["Performance Score", analysis.performanceScore.toFixed(1)],
      ["UX Score", analysis.uxScore.toFixed(1)],
      ["Passed Checks", analysis.passedChecks.toString()],
      ["Failed Checks", analysis.failedChecks.toString()],
      ["Page Speed", analysis.pageSpeed]
    ];

    let csvContent = [
      "SEO Analysis Report",
      "",
      mainHeaders.join(","),
      ...mainRows.map(row => row.join(","))
    ].join("\n");

    // Add issues if available
    if (Array.isArray(analysis.issues) && analysis.issues.length > 0) {
      csvContent += "\n\nIssues Found\n";
      csvContent += "Title,Priority,Category,Description\n";
      analysis.issues.forEach((issue: any) => {
        csvContent += `"${issue.title}","${issue.priority}","${issue.category}","${issue.description}"\n`;
      });
    }

    // Add recommendations if available
    if (Array.isArray(analysis.recommendations) && analysis.recommendations.length > 0) {
      csvContent += "\n\nRecommendations\n";
      csvContent += "Title,Category,Score Increase,Description\n";
      analysis.recommendations.forEach((rec: any) => {
        csvContent += `"${rec.title}","${rec.category}","${rec.estimatedScoreIncrease || 0}","${rec.description}"\n`;
      });
    }

    const domain = (() => {
      try {
        return new URL(analysis.url).hostname;
      } catch {
        return 'website';
      }
    })();
    this.downloadCsv(csvContent, `${domain}-detailed-analysis-${analysis.id}.csv`);
  }

  private static downloadCsv(content: string, filename: string): void {
    const blob = new Blob([content], { type: "text/csv;charset=utf-8;" });
    const link = document.createElement("a");
    
    if (link.download !== undefined) {
      const url = URL.createObjectURL(blob);
      link.setAttribute("href", url);
      link.setAttribute("download", filename);
      link.style.visibility = "hidden";
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
    }
  }
}