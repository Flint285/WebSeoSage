import { useState } from "react";
import { useMutation, useQuery } from "@tanstack/react-query";
import { Navigation } from "@/components/navigation";
import { SeoAnalysisForm } from "@/components/seo-analysis-form";
import { SeoScoreCircle } from "@/components/seo-score-circle";
import { CategoryBreakdown } from "@/components/category-breakdown";
import { IssuesRecommendations } from "@/components/issues-recommendations";
import { MetricsTable } from "@/components/metrics-table";
import { TechnicalSeoDashboard } from "@/components/technical-seo-dashboard";
import { AdvancedContentMetrics } from "@/components/advanced-content-metrics";
import { AnalyticsDashboard } from "@/components/analytics-dashboard";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { queryClient, apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/hooks/useAuth";
import { isUnauthorizedError } from "@/lib/authUtils";
import { Search, BarChart3, FileText, Activity, Globe, TrendingUp } from "lucide-react";
import type { SeoAnalysis, Website } from "@shared/schema";
import { FadeIn, SlideIn } from "@/components/ui/micro-animations";

export default function UnifiedAnalysis() {
  const { user } = useAuth();
  const { toast } = useToast();
  const [currentAnalysis, setCurrentAnalysis] = useState<SeoAnalysis | null>(null);

  const { data: websites = [] } = useQuery<Website[]>({
    queryKey: ["/api/websites"],
    enabled: !!user,
  });

  const analyzeMutation = useMutation({
    mutationFn: async (data: { url: string }) => {
      return await apiRequest("/api/analyze", "POST", data);
    },
    onSuccess: (data) => {
      setCurrentAnalysis(data);
      queryClient.invalidateQueries({ queryKey: ["/api/websites"] });
      toast({
        title: "Analysis Complete",
        description: "Your website analysis has been completed successfully.",
      });
    },
    onError: (error) => {
      if (isUnauthorizedError(error)) {
        toast({
          title: "Unauthorized",
          description: "You are logged out. Logging in again...",
          variant: "destructive",
        });
        setTimeout(() => {
          window.location.href = "/api/login";
        }, 500);
        return;
      }
      toast({
        title: "Analysis Failed",
        description: error instanceof Error ? error.message : "Failed to analyze website",
        variant: "destructive",
      });
    },
  });

  const handleAnalyze = (url: string) => {
    analyzeMutation.mutate({ url });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50 dark:from-gray-900 dark:via-gray-800 dark:to-blue-900">
      <Navigation />
      
      <main className="container mx-auto px-4 py-8">
        {/* Header Section */}
        <FadeIn>
          <div className="text-center mb-8">
            <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">
              SEO Analysis Center
            </h1>
            <p className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
              Comprehensive SEO analysis with 16+ technical checks, content insights, and actionable recommendations
            </p>
          </div>
        </FadeIn>

        {/* Analysis Form */}
        <SlideIn delay={0.2}>
          <Card className="mb-8">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Search className="h-5 w-5" />
                Website Analysis
              </CardTitle>
              <CardDescription>
                Enter any website URL to get a comprehensive SEO analysis with technical checks, content evaluation, and optimization recommendations.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <SeoAnalysisForm 
                onAnalyze={handleAnalyze} 
                isLoading={analyzeMutation.isPending}
              />
            </CardContent>
          </Card>
        </SlideIn>

        {/* Analysis Results */}
        {currentAnalysis && (
          <FadeIn delay={0.4}>
            <div className="space-y-8">
              {/* Overall Score Section */}
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                <div className="lg:col-span-1">
                  <Card>
                    <CardHeader className="text-center">
                      <CardTitle>Overall SEO Score</CardTitle>
                      <Badge variant={currentAnalysis.overallScore >= 80 ? "default" : currentAnalysis.overallScore >= 60 ? "secondary" : "destructive"}>
                        {currentAnalysis.overallScore >= 80 ? "Excellent" : currentAnalysis.overallScore >= 60 ? "Good" : "Needs Improvement"}
                      </Badge>
                    </CardHeader>
                    <CardContent className="text-center">
                      <SeoScoreCircle score={currentAnalysis.overallScore} />
                    </CardContent>
                  </Card>
                </div>
                
                <div className="lg:col-span-2">
                  <CategoryBreakdown analysis={currentAnalysis} />
                </div>
              </div>

              {/* Detailed Analysis Tabs */}
              <Tabs defaultValue="technical" className="w-full">
                <TabsList className="grid w-full grid-cols-4">
                  <TabsTrigger value="technical" className="flex items-center gap-2">
                    <Activity className="h-4 w-4" />
                    Technical SEO
                  </TabsTrigger>
                  <TabsTrigger value="content" className="flex items-center gap-2">
                    <FileText className="h-4 w-4" />
                    Content Analysis
                  </TabsTrigger>
                  <TabsTrigger value="metrics" className="flex items-center gap-2">
                    <BarChart3 className="h-4 w-4" />
                    Detailed Metrics
                  </TabsTrigger>
                  <TabsTrigger value="recommendations" className="flex items-center gap-2">
                    <TrendingUp className="h-4 w-4" />
                    Recommendations
                  </TabsTrigger>
                </TabsList>

                <TabsContent value="technical" className="space-y-6">
                  <TechnicalSeoDashboard analysis={currentAnalysis} />
                </TabsContent>

                <TabsContent value="content" className="space-y-6">
                  <AdvancedContentMetrics analysis={currentAnalysis} />
                </TabsContent>

                <TabsContent value="metrics" className="space-y-6">
                  <MetricsTable analysis={currentAnalysis} />
                </TabsContent>

                <TabsContent value="recommendations" className="space-y-6">
                  <IssuesRecommendations analysis={currentAnalysis} />
                </TabsContent>
              </Tabs>
            </div>
          </FadeIn>
        )}

        {/* Analytics Dashboard */}
        {websites.length > 0 && (
          <SlideIn delay={0.6}>
            <div className="mt-12">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <BarChart3 className="h-5 w-5" />
                    Analytics Overview
                  </CardTitle>
                  <CardDescription>
                    Performance insights across all your analyzed websites
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <AnalyticsDashboard websites={websites} />
                </CardContent>
              </Card>
            </div>
          </SlideIn>
        )}

        {/* Getting Started */}
        {!currentAnalysis && websites.length === 0 && (
          <SlideIn delay={0.4}>
            <Card className="text-center py-12">
              <CardContent>
                <Globe className="h-16 w-16 text-blue-500 mx-auto mb-4" />
                <h3 className="text-2xl font-semibold mb-2">Ready to Analyze Your Website?</h3>
                <p className="text-gray-600 dark:text-gray-300 mb-6 max-w-md mx-auto">
                  Enter your website URL above to get started with comprehensive SEO analysis including technical checks, content evaluation, and actionable recommendations.
                </p>
                <div className="flex flex-wrap justify-center gap-2">
                  <Badge variant="outline">16+ Technical Checks</Badge>
                  <Badge variant="outline">Content Analysis</Badge>
                  <Badge variant="outline">Performance Metrics</Badge>
                  <Badge variant="outline">SEO Recommendations</Badge>
                </div>
              </CardContent>
            </Card>
          </SlideIn>
        )}
      </main>
    </div>
  );
}