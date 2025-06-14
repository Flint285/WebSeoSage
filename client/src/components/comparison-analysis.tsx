import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { TrendingUp, TrendingDown, Minus, ArrowRight } from "lucide-react";
import type { SeoAnalysis } from "@shared/schema";

interface ComparisonAnalysisProps {
  currentAnalysis: SeoAnalysis;
  previousAnalysis: SeoAnalysis;
}

export function ComparisonAnalysis({ currentAnalysis, previousAnalysis }: ComparisonAnalysisProps) {
  const getScoreChange = (current: number, previous: number) => {
    return current - previous;
  };

  const getChangeIcon = (change: number) => {
    if (Math.abs(change) < 0.5) return <Minus className="h-4 w-4 text-gray-400" />;
    if (change > 0) return <TrendingUp className="h-4 w-4 text-green-600" />;
    return <TrendingDown className="h-4 w-4 text-red-600" />;
  };

  const getChangeColor = (change: number) => {
    if (Math.abs(change) < 0.5) return "text-gray-600";
    if (change > 0) return "text-green-600";
    return "text-red-600";
  };

  const getChangeBadgeVariant = (change: number) => {
    if (Math.abs(change) < 0.5) return "secondary";
    if (change > 0) return "default";
    return "destructive";
  };

  const formatChange = (change: number) => {
    if (Math.abs(change) < 0.1) return "No change";
    return `${change > 0 ? '+' : ''}${change.toFixed(1)}`;
  };

  const scoreMetrics = [
    {
      name: "Overall Score",
      current: currentAnalysis.overallScore,
      previous: previousAnalysis.overallScore,
      color: "text-primary"
    },
    {
      name: "Technical",
      current: currentAnalysis.technicalScore,
      previous: previousAnalysis.technicalScore,
      color: "text-secondary"
    },
    {
      name: "Content",
      current: currentAnalysis.contentScore,
      previous: previousAnalysis.contentScore,
      color: "text-blue-600"
    },
    {
      name: "Performance",
      current: currentAnalysis.performanceScore,
      previous: previousAnalysis.performanceScore,
      color: "text-purple-600"
    },
    {
      name: "UX",
      current: currentAnalysis.uxScore,
      previous: previousAnalysis.uxScore,
      color: "text-orange-600"
    }
  ];

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="text-xl text-foreground">Score Comparison</CardTitle>
          <p className="text-sm text-muted-foreground">
            Comparing analysis from {new Date(currentAnalysis.createdAt).toLocaleDateString()} 
            vs {new Date(previousAnalysis.createdAt).toLocaleDateString()}
          </p>
        </CardHeader>
        <CardContent>
          <div className="space-y-6">
            {scoreMetrics.map((metric) => {
              const change = getScoreChange(metric.current, metric.previous);
              return (
                <div key={metric.name} className="flex items-center justify-between">
                  <div className="flex-1">
                    <div className="flex items-center justify-between mb-2">
                      <span className="font-medium text-foreground">{metric.name}</span>
                      <div className="flex items-center space-x-2">
                        <span className={`text-sm font-medium ${metric.color}`}>
                          {metric.previous.toFixed(1)}
                        </span>
                        <ArrowRight className="h-4 w-4 text-gray-400" />
                        <span className={`text-sm font-medium ${metric.color}`}>
                          {metric.current.toFixed(1)}
                        </span>
                        <Badge variant={getChangeBadgeVariant(change)} className="ml-2">
                          <div className="flex items-center space-x-1">
                            {getChangeIcon(change)}
                            <span>{formatChange(change)}</span>
                          </div>
                        </Badge>
                      </div>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Progress value={metric.previous} className="flex-1 h-2" />
                      <span className="text-xs text-muted-foreground w-16">Previous</span>
                    </div>
                    <div className="flex items-center space-x-2 mt-1">
                      <Progress value={metric.current} className="flex-1 h-2" />
                      <span className="text-xs text-muted-foreground w-16">Current</span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="text-lg text-foreground">Issues Resolved</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">Failed Checks</span>
                <div className="flex items-center space-x-2">
                  <span className="text-sm font-medium">{previousAnalysis.failedChecks}</span>
                  <ArrowRight className="h-3 w-3 text-gray-400" />
                  <span className="text-sm font-medium">{currentAnalysis.failedChecks}</span>
                  <Badge variant={currentAnalysis.failedChecks < previousAnalysis.failedChecks ? "default" : "destructive"}>
                    {currentAnalysis.failedChecks - previousAnalysis.failedChecks > 0 ? '+' : ''}
                    {currentAnalysis.failedChecks - previousAnalysis.failedChecks}
                  </Badge>
                </div>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">Passed Checks</span>
                <div className="flex items-center space-x-2">
                  <span className="text-sm font-medium">{previousAnalysis.passedChecks}</span>
                  <ArrowRight className="h-3 w-3 text-gray-400" />
                  <span className="text-sm font-medium">{currentAnalysis.passedChecks}</span>
                  <Badge variant={currentAnalysis.passedChecks > previousAnalysis.passedChecks ? "default" : "destructive"}>
                    {currentAnalysis.passedChecks - previousAnalysis.passedChecks > 0 ? '+' : ''}
                    {currentAnalysis.passedChecks - previousAnalysis.passedChecks}
                  </Badge>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-lg text-foreground">Performance Impact</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">Page Speed</span>
                <div className="flex items-center space-x-2">
                  <span className="text-sm font-medium">{previousAnalysis.pageSpeed}</span>
                  <ArrowRight className="h-3 w-3 text-gray-400" />
                  <span className="text-sm font-medium">{currentAnalysis.pageSpeed}</span>
                </div>
              </div>
              <div className="mt-4">
                <div className="text-sm text-muted-foreground mb-2">Overall Progress</div>
                <div className={`text-lg font-bold ${getChangeColor(getScoreChange(currentAnalysis.overallScore, previousAnalysis.overallScore))}`}>
                  {getScoreChange(currentAnalysis.overallScore, previousAnalysis.overallScore) > 0 ? '↗ Improving' : 
                   getScoreChange(currentAnalysis.overallScore, previousAnalysis.overallScore) < -0.5 ? '↘ Declining' : 
                   '→ Stable'}
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}