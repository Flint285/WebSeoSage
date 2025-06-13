import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { AlertTriangle, Lightbulb } from "lucide-react";
import type { SeoAnalysis, SeoIssue, SeoRecommendation } from "@shared/schema";

interface IssuesRecommendationsProps {
  analysis: SeoAnalysis;
}

export function IssuesRecommendations({ analysis }: IssuesRecommendationsProps) {
  const issues = analysis.issues as SeoIssue[];
  const recommendations = analysis.recommendations as SeoRecommendation[];

  const getPriorityColor = (priority: string) => {
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
  };

  const getIssueBackgroundColor = (priority: string) => {
    switch (priority) {
      case "high":
        return "bg-red-50 border-red-200";
      case "medium":
        return "bg-orange-50 border-orange-200";
      case "low":
        return "bg-yellow-50 border-yellow-200";
      default:
        return "bg-gray-50 border-gray-200";
    }
  };

  const getRecommendationColor = (priority: number) => {
    switch (priority) {
      case 1:
        return "bg-secondary";
      case 2:
        return "bg-primary";
      case 3:
        return "bg-purple-600";
      default:
        return "bg-gray-600";
    }
  };

  const getRecommendationBackgroundColor = (priority: number) => {
    switch (priority) {
      case 1:
        return "bg-green-50 border-green-200";
      case 2:
        return "bg-blue-50 border-blue-200";
      case 3:
        return "bg-purple-50 border-purple-200";
      default:
        return "bg-gray-50 border-gray-200";
    }
  };

  return (
    <div className="grid grid-cols-1 xl:grid-cols-2 gap-8 mb-8">
      {/* Critical Issues */}
      <Card>
        <CardHeader className="border-b border-gray-200">
          <CardTitle className="flex items-center text-xl text-foreground">
            <AlertTriangle className="h-5 w-5 text-error mr-3" />
            Critical Issues ({issues.length})
          </CardTitle>
        </CardHeader>
        <CardContent className="p-6">
          <div className="space-y-4">
            {issues.slice(0, 3).map((issue) => (
              <div
                key={issue.id}
                className={`flex items-start space-x-4 p-4 rounded-lg border ${getIssueBackgroundColor(issue.priority)}`}
              >
                <div className={`w-2 h-2 rounded-full mt-2`} 
                     style={{ backgroundColor: issue.priority === 'high' ? '#E74C3C' : issue.priority === 'medium' ? '#FF6B35' : '#F39C12' }} />
                <div className="flex-1">
                  <h4 className="font-semibold text-foreground mb-1">{issue.title}</h4>
                  <p className="text-sm text-muted-foreground mb-2">{issue.description}</p>
                  <div className="flex items-center space-x-2">
                    <Badge className={`text-xs ${getPriorityColor(issue.priority)}`}>
                      {issue.priority.charAt(0).toUpperCase() + issue.priority.slice(1)} Priority
                    </Badge>
                    <span className="text-xs text-muted-foreground">Impact: {issue.impact}</span>
                  </div>
                </div>
              </div>
            ))}
            
            {issues.length > 3 && (
              <Button variant="ghost" className="w-full text-center text-primary hover:bg-blue-50">
                View All Issues ({issues.length})
              </Button>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Top Recommendations */}
      <Card>
        <CardHeader className="border-b border-gray-200">
          <CardTitle className="flex items-center text-xl text-foreground">
            <Lightbulb className="h-5 w-5 text-warning mr-3" />
            Top Recommendations
          </CardTitle>
        </CardHeader>
        <CardContent className="p-6">
          <div className="space-y-4">
            {recommendations
              .sort((a, b) => a.priority - b.priority)
              .slice(0, 3)
              .map((rec, index) => (
                <div
                  key={rec.id}
                  className={`flex items-start space-x-4 p-4 rounded-lg border ${getRecommendationBackgroundColor(rec.priority)}`}
                >
                  <div 
                    className={`w-8 h-8 rounded-full flex items-center justify-center text-white text-sm font-bold ${getRecommendationColor(rec.priority)}`}
                  >
                    {index + 1}
                  </div>
                  <div className="flex-1">
                    <h4 className="font-semibold text-foreground mb-1">{rec.title}</h4>
                    <p className="text-sm text-muted-foreground mb-2">{rec.description}</p>
                    <div className="flex items-center justify-between">
                      <span className={`text-xs font-semibold`}
                            style={{ color: rec.priority === 1 ? '#00A651' : rec.priority === 2 ? '#0066CC' : '#9333EA' }}>
                        Estimated +{rec.estimatedScoreIncrease} SEO score
                      </span>
                      <Button size="sm" variant="outline" className="text-xs px-3 py-1">
                        Guide
                      </Button>
                    </div>
                  </div>
                </div>
              ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
