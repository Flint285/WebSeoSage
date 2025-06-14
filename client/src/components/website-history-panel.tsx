import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ScoreTrendsChart } from "@/components/score-trends-chart";
import { ComparisonAnalysis } from "@/components/comparison-analysis";
import { ScanScheduler } from "@/components/scan-scheduler";
import { BacklinksDashboard } from "@/components/backlinks-dashboard";
import { KeywordsDashboard } from "@/components/keywords-dashboard";
import { CompetitorAnalysisDashboard } from "@/components/competitor-analysis-dashboard";
import { CsvExporter } from "@/lib/csv-exporter";
import { Calendar, TrendingUp, TrendingDown, Minus, RefreshCw, Download } from "lucide-react";
import type { Website, ScoreHistory, SeoAnalysis } from "@shared/schema";

interface WebsiteHistoryPanelProps {
  website: Website;
}

export function WebsiteHistoryPanel({ website }: WebsiteHistoryPanelProps) {
  const { data: history = [] } = useQuery<ScoreHistory[]>({
    queryKey: [`/api/websites/${website.id}/history`],
  });

  const { data: analyses = [] } = useQuery<SeoAnalysis[]>({
    queryKey: [`/api/websites/${website.id}/analyses`],
  });

  const getScoreChange = (current: number, previous: number) => {
    if (!previous) return null;
    const change = current - previous;
    if (Math.abs(change) < 1) return null;
    return change;
  };

  const getChangeIcon = (change: number | null) => {
    if (!change) return <Minus className="h-4 w-4 text-gray-400" />;
    if (change > 0) return <TrendingUp className="h-4 w-4 text-green-600" />;
    return <TrendingDown className="h-4 w-4 text-red-600" />;
  };

  const getChangeColor = (change: number | null) => {
    if (!change) return "text-gray-600";
    if (change > 0) return "text-green-600";
    return "text-red-600";
  };

  const latestScore = history[0];
  const previousScore = history[1];

  return (
    <div className="space-y-6">
      {/* Website Overview */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="text-xl text-foreground">{website.domain}</CardTitle>
              <p className="text-sm text-muted-foreground mt-1">{website.url}</p>
            </div>
            <div className="text-right">
              <div className="text-sm text-muted-foreground">Last Scanned</div>
              <div className="font-medium">
                {website.lastScanned 
                  ? new Date(website.lastScanned).toLocaleDateString()
                  : "Never"
                }
              </div>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
            <div className="text-center">
              <div className="text-2xl font-bold text-primary">
                {latestScore?.overallScore || 0}
              </div>
              <div className="text-sm text-muted-foreground">Overall</div>
              {latestScore && previousScore && (
                <div className={`flex items-center justify-center mt-1 text-xs ${getChangeColor(getScoreChange(latestScore.overallScore, previousScore.overallScore))}`}>
                  {getChangeIcon(getScoreChange(latestScore.overallScore, previousScore.overallScore))}
                  {getScoreChange(latestScore.overallScore, previousScore.overallScore) && (
                    <span className="ml-1">
                      {getScoreChange(latestScore.overallScore, previousScore.overallScore)! > 0 ? '+' : ''}
                      {getScoreChange(latestScore.overallScore, previousScore.overallScore)}
                    </span>
                  )}
                </div>
              )}
            </div>
            
            <div className="text-center">
              <div className="text-2xl font-bold text-secondary">
                {latestScore?.technicalScore || 0}
              </div>
              <div className="text-sm text-muted-foreground">Technical</div>
              {latestScore && previousScore && (
                <div className={`flex items-center justify-center mt-1 text-xs ${getChangeColor(getScoreChange(latestScore.technicalScore, previousScore.technicalScore))}`}>
                  {getChangeIcon(getScoreChange(latestScore.technicalScore, previousScore.technicalScore))}
                  {getScoreChange(latestScore.technicalScore, previousScore.technicalScore) && (
                    <span className="ml-1">
                      {getScoreChange(latestScore.technicalScore, previousScore.technicalScore)! > 0 ? '+' : ''}
                      {getScoreChange(latestScore.technicalScore, previousScore.technicalScore)}
                    </span>
                  )}
                </div>
              )}
            </div>
            
            <div className="text-center">
              <div className="text-2xl font-bold text-blue-600">
                {latestScore?.contentScore || 0}
              </div>
              <div className="text-sm text-muted-foreground">Content</div>
              {latestScore && previousScore && (
                <div className={`flex items-center justify-center mt-1 text-xs ${getChangeColor(getScoreChange(latestScore.contentScore, previousScore.contentScore))}`}>
                  {getChangeIcon(getScoreChange(latestScore.contentScore, previousScore.contentScore))}
                  {getScoreChange(latestScore.contentScore, previousScore.contentScore) && (
                    <span className="ml-1">
                      {getScoreChange(latestScore.contentScore, previousScore.contentScore)! > 0 ? '+' : ''}
                      {getScoreChange(latestScore.contentScore, previousScore.contentScore)}
                    </span>
                  )}
                </div>
              )}
            </div>
            
            <div className="text-center">
              <div className="text-2xl font-bold text-purple-600">
                {latestScore?.performanceScore || 0}
              </div>
              <div className="text-sm text-muted-foreground">Performance</div>
              {latestScore && previousScore && (
                <div className={`flex items-center justify-center mt-1 text-xs ${getChangeColor(getScoreChange(latestScore.performanceScore, previousScore.performanceScore))}`}>
                  {getChangeIcon(getScoreChange(latestScore.performanceScore, previousScore.performanceScore))}
                  {getScoreChange(latestScore.performanceScore, previousScore.performanceScore) && (
                    <span className="ml-1">
                      {getScoreChange(latestScore.performanceScore, previousScore.performanceScore)! > 0 ? '+' : ''}
                      {getScoreChange(latestScore.performanceScore, previousScore.performanceScore)}
                    </span>
                  )}
                </div>
              )}
            </div>
            
            <div className="text-center">
              <div className="text-2xl font-bold text-orange-600">
                {latestScore?.uxScore || 0}
              </div>
              <div className="text-sm text-muted-foreground">UX</div>
              {latestScore && previousScore && (
                <div className={`flex items-center justify-center mt-1 text-xs ${getChangeColor(getScoreChange(latestScore.uxScore, previousScore.uxScore))}`}>
                  {getChangeIcon(getScoreChange(latestScore.uxScore, previousScore.uxScore))}
                  {getScoreChange(latestScore.uxScore, previousScore.uxScore) && (
                    <span className="ml-1">
                      {getScoreChange(latestScore.uxScore, previousScore.uxScore)! > 0 ? '+' : ''}
                      {getScoreChange(latestScore.uxScore, previousScore.uxScore)}
                    </span>
                  )}
                </div>
              )}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Historical Data */}
      <Tabs defaultValue="trends" className="w-full">
        <TabsList className="grid w-full grid-cols-7">
          <TabsTrigger value="trends">Score Trends</TabsTrigger>
          <TabsTrigger value="comparison">Comparison</TabsTrigger>
          <TabsTrigger value="analyses">Analysis History</TabsTrigger>
          <TabsTrigger value="backlinks">Backlinks</TabsTrigger>
          <TabsTrigger value="keywords">Keywords</TabsTrigger>
          <TabsTrigger value="competitors">Competitors</TabsTrigger>
          <TabsTrigger value="schedule">Auto-Scan</TabsTrigger>
        </TabsList>
        
        <TabsContent value="trends" className="space-y-4">
          {history.length > 1 ? (
            <ScoreTrendsChart data={history} title={`Score Trends for ${website.domain}`} />
          ) : (
            <Card>
              <CardContent className="p-12 text-center">
                <Calendar className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-foreground mb-2">Not Enough Data</h3>
                <p className="text-muted-foreground">
                  Run at least 2 analyses to see score trends over time.
                </p>
              </CardContent>
            </Card>
          )}
        </TabsContent>
        
        <TabsContent value="comparison" className="space-y-4">
          {analyses.length >= 2 ? (
            <ComparisonAnalysis 
              currentAnalysis={analyses[0]} 
              previousAnalysis={analyses[1]} 
            />
          ) : (
            <Card>
              <CardContent className="p-12 text-center">
                <RefreshCw className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-foreground mb-2">Need More Data</h3>
                <p className="text-muted-foreground">
                  At least 2 analyses are required to show comparison data.
                </p>
              </CardContent>
            </Card>
          )}
        </TabsContent>
        
        <TabsContent value="analyses" className="space-y-4">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="text-lg text-foreground">Recent Analyses</CardTitle>
                <div className="flex space-x-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => CsvExporter.exportScoreHistory(history, website)}
                    disabled={history.length === 0}
                  >
                    <Download className="h-4 w-4 mr-2" />
                    Export Scores
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => CsvExporter.exportAnalysisData(analyses, website)}
                    disabled={analyses.length === 0}
                  >
                    <Download className="h-4 w-4 mr-2" />
                    Export Data
                  </Button>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              {analyses.length > 0 ? (
                <div className="space-y-4">
                  {analyses.map((analysis) => (
                    <div key={analysis.id} className="flex items-center justify-between p-4 border rounded-lg">
                      <div>
                        <div className="font-medium text-foreground">
                          Analysis #{analysis.id}
                        </div>
                        <div className="text-sm text-muted-foreground">
                          {new Date(analysis.createdAt).toLocaleString()}
                        </div>
                      </div>
                      <div className="flex items-center space-x-4">
                        <Badge variant={analysis.overallScore >= 70 ? "default" : "destructive"}>
                          Score: {analysis.overallScore}
                        </Badge>
                        <div className="text-sm text-muted-foreground">
                          {analysis.passedChecks} passed, {analysis.failedChecks} issues
                        </div>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => CsvExporter.exportDetailedAnalysis(analysis)}
                        >
                          <Download className="h-4 w-4 mr-1" />
                          Export
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8 text-muted-foreground">
                  No analyses found for this website.
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="backlinks" className="space-y-4">
          <BacklinksDashboard website={website} />
        </TabsContent>

        <TabsContent value="keywords" className="space-y-4">
          <KeywordsDashboard website={website} />
        </TabsContent>

        <TabsContent value="competitors" className="space-y-4">
          <CompetitorAnalysisDashboard website={website} />
        </TabsContent>
        
        <TabsContent value="schedule" className="space-y-4">
          <ScanScheduler website={website} />
        </TabsContent>
      </Tabs>
    </div>
  );
}