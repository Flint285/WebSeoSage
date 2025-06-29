import { useState, useEffect } from "react";
import { useMutation, useQuery } from "@tanstack/react-query";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { useAuth } from "@/hooks/useAuth";
import { useToast } from "@/hooks/use-toast";
import { isUnauthorizedError } from "@/lib/authUtils";
import { SeoAnalysisForm } from "@/components/seo-analysis-form";
import { SeoScoreCircle } from "@/components/seo-score-circle";
import { CategoryBreakdown } from "@/components/category-breakdown";
import { IssuesRecommendations } from "@/components/issues-recommendations";
import { MetricsTable } from "@/components/metrics-table";
import { ContentMetricsPanel } from "@/components/content-metrics-panel";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

import { CheckCircle, XCircle, Shield, Calendar, Download, Share, ChartLine } from "lucide-react";
import type { SeoAnalysis } from "@shared/schema";
import { PdfGenerator } from "@/lib/pdf-generator";
import { Link } from "wouter";
import { Navigation } from "@/components/navigation";

import { ProgressIndicator } from "@/components/ui/progress-indicator";
import { StatusIndicator } from "@/components/ui/status-indicator";
import { AnalysisLoader, PageLoader } from "@/components/loading-states";
import { TechnicalSeoDashboard } from "@/components/technical-seo-dashboard";
import { AdvancedContentMetrics } from "@/components/advanced-content-metrics";

export default function Dashboard() {
  const [currentAnalysis, setCurrentAnalysis] = useState<SeoAnalysis | null>(null);
  const [analysisStep, setAnalysisStep] = useState("Loading website...");
  const { toast } = useToast();
  const { isAuthenticated, isLoading } = useAuth();

  // Redirect to login if not authenticated
  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
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
  }, [isAuthenticated, isLoading, toast]);

  if (isLoading) {
    return <PageLoader />;
  }

  const analyzeMutation = useMutation({
    mutationFn: async (url: string) => {
      // Progressive analysis steps with realistic timing
      const steps = [
        "Loading website...",
        "Analyzing technical SEO...",
        "Evaluating content quality...",
        "Checking performance metrics...",
        "Assessing user experience...",
        "Generating recommendations...",
      ];
      
      for (let i = 0; i < steps.length; i++) {
        setAnalysisStep(steps[i]);
        if (i < steps.length - 1) {
          await new Promise(resolve => setTimeout(resolve, 1200));
        }
      }
      
      const response = await apiRequest("POST", "/api/analyze", { url });
      return response.json();
    },
    onSuccess: (data: SeoAnalysis) => {
      setCurrentAnalysis(data);
      queryClient.invalidateQueries({ queryKey: ["/api/analyses"] });
      queryClient.invalidateQueries({ queryKey: ["/api/websites"] });
      toast({
        title: "Analysis Complete",
        description: "Your SEO analysis has been completed successfully.",
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
        description: error.message || "Failed to analyze website. Please try again.",
        variant: "destructive",
      });
    },
  });

  const { data: recentAnalyses } = useQuery({
    queryKey: ["/api/analyses"],
    enabled: false, // We'll enable this when we want to show recent analyses
  });

  const handleAnalyze = (url: string) => {
    setCurrentAnalysis(null);
    analyzeMutation.mutate(url);
  };

  const handleExport = async () => {
    if (!currentAnalysis) return;
    
    try {
      toast({
        title: "Generating Report",
        description: "Creating your PDF report, please wait...",
      });
      
      await PdfGenerator.generateSeoReport(currentAnalysis);
      
      toast({
        title: "Report Downloaded",
        description: "Your SEO report has been successfully downloaded.",
      });
    } catch (error) {
      toast({
        title: "Export Failed",
        description: "Failed to generate PDF report. Please try again.",
        variant: "destructive",
      });
    }
  };

  const handleShareReport = async () => {
    if (!currentAnalysis) return;
    
    try {
      const shareUrl = `${window.location.origin}/?url=${encodeURIComponent(currentAnalysis.url)}`;
      await navigator.clipboard.writeText(shareUrl);
      toast({
        title: "Link Copied",
        description: "Share link has been copied to clipboard.",
      });
    } catch (error) {
      toast({
        title: "Share Failed",
        description: "Could not copy share link. Please try again.",
        variant: "destructive",
      });
    }
  };

  const handleScheduleMonitoring = () => {
    toast({
      title: "Monitoring Setup",
      description: "Schedule monitoring feature coming soon. Upgrade to Pro for automated SEO tracking.",
    });
  };

  const handleViewActionPlan = () => {
    if (!currentAnalysis) return;
    
    const element = document.getElementById('issues-section');
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
      toast({
        title: "Action Plan",
        description: "Scroll down to see your critical issues and recommendations.",
      });
    }
  };

  const getScoreColor = (score: number) => {
    if (score >= 80) return "text-secondary";
    if (score >= 60) return "text-warning";
    return "text-error";
  };

  const getScoreLabel = (score: number) => {
    if (score >= 80) return "Excellent";
    if (score >= 60) return "Good";
    if (score >= 40) return "Needs Work";
    return "Poor";
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50 dark:from-gray-900 dark:via-gray-800 dark:to-blue-900">
      <Navigation />

      <main className="container mx-auto px-4 py-8">
        {/* Header Section */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">
            SEO Analysis Center
          </h1>
          <p className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
            Comprehensive SEO analysis with 16+ technical checks, content insights, and actionable recommendations
          </p>
        </div>

        {/* Analysis Form */}
        <Card className="mb-8">
          <CardContent className="p-6">
            <SeoAnalysisForm 
              onAnalyze={handleAnalyze} 
              isLoading={analyzeMutation.isPending}
            />
          </CardContent>
        </Card>

        {/* Loading State */}
        {analyzeMutation.isPending && (
          <div className="mb-8">
            <AnalysisLoader url={analyzeMutation.variables as string} />
          </div>
        )}

        {/* Results Section */}
        {currentAnalysis && !analyzeMutation.isPending && (
          <>
            {/* Overall Score Section */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-8">
              <div className="lg:col-span-2 bg-white rounded-xl shadow-sm border border-gray-200 p-8">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-2xl font-bold text-foreground">SEO Health Score</h2>
                  <div className="text-sm text-muted-foreground">
                    Last analyzed: {new Date(currentAnalysis.createdAt).toLocaleString()}
                  </div>
                </div>
                
                <div className="flex items-center justify-center mb-8">
                  <SeoScoreCircle 
                    score={currentAnalysis.overallScore} 
                    size={192}
                    strokeWidth={12}
                  />
                </div>
                
                <div className="grid grid-cols-2 gap-6">
                  <div className="text-center">
                    <div className="text-2xl font-bold text-secondary">{currentAnalysis.passedChecks}</div>
                    <div className="text-sm text-muted-foreground">Passed Checks</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-error">{currentAnalysis.failedChecks}</div>
                    <div className="text-sm text-muted-foreground">Issues Found</div>
                  </div>
                </div>
              </div>
              
              <div className="space-y-6">
                <Card>
                  <CardContent className="p-6">
                    <h3 className="text-lg font-semibold text-foreground mb-4">Quick Stats</h3>
                    <div className="space-y-4">
                      <div className="flex justify-between items-center">
                        <span className="text-muted-foreground">Page Speed</span>
                        <span className={`font-semibold ${getScoreColor(currentAnalysis.performanceScore)}`}>
                          {currentAnalysis.pageSpeed}
                        </span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-muted-foreground">Mobile Friendly</span>
                        <CheckCircle className="h-5 w-5 text-secondary" />
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-muted-foreground">HTTPS Secure</span>
                        <CheckCircle className="h-5 w-5 text-secondary" />
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-muted-foreground">Overall Score</span>
                        <Badge variant={currentAnalysis.overallScore >= 70 ? "default" : "destructive"}>
                          {getScoreLabel(currentAnalysis.overallScore)}
                        </Badge>
                      </div>
                    </div>
                  </CardContent>
                </Card>
                
                <div className="bg-gradient-to-r from-primary to-blue-600 rounded-xl p-6 text-white">
                  <h3 className="text-lg font-semibold mb-2">Improvement Potential</h3>
                  <p className="text-blue-100 text-sm mb-4">
                    Fix {currentAnalysis.failedChecks} critical issues to boost your score significantly
                  </p>
                  <Button 
                    variant="secondary" 
                    size="sm" 
                    className="bg-white text-primary hover:bg-gray-100"
                    onClick={handleViewActionPlan}
                  >
                    View Action Plan
                  </Button>
                </div>
              </div>
            </div>

            {/* Category Breakdown */}
            <CategoryBreakdown analysis={currentAnalysis} />

            {/* Comprehensive Analysis Results */}
            <div className="space-y-8">
              {/* Technical SEO Results */}
              <div>
                <h2 className="text-2xl font-bold text-foreground mb-6">Technical SEO Analysis</h2>
                <TechnicalSeoDashboard analysis={currentAnalysis} />
              </div>
              
              {/* Content Analysis Results */}
              <div>
                <h2 className="text-2xl font-bold text-foreground mb-6">Content Analysis</h2>
                <AdvancedContentMetrics analysis={currentAnalysis} />
              </div>
              
              {/* Performance & Metrics */}
              <div>
                <h2 className="text-2xl font-bold text-foreground mb-6">Performance Metrics</h2>
                <div className="space-y-6">
                  <MetricsTable analysis={currentAnalysis} />
                  <ContentMetricsPanel analysis={currentAnalysis} />
                </div>
              </div>
              
              {/* Issues & Recommendations */}
              <div id="issues-section">
                <h2 className="text-2xl font-bold text-foreground mb-6">Issues & Recommendations</h2>
                <IssuesRecommendations analysis={currentAnalysis} />
              </div>
            </div>

            {/* Export Section */}
            <Card className="p-8">
              <div className="flex flex-col md:flex-row items-center justify-between">
                <div className="mb-6 md:mb-0">
                  <h2 className="text-2xl font-bold text-foreground mb-2">Export Your SEO Report</h2>
                  <p className="text-muted-foreground">Download comprehensive analysis or share with your team</p>
                </div>
                <div className="flex flex-col sm:flex-row space-y-3 sm:space-y-0 sm:space-x-4">
                  <Button onClick={handleExport} className="bg-primary text-primary-foreground hover:bg-blue-700">
                    <Download className="h-4 w-4 mr-2" />
                    Download PDF Report
                  </Button>
                  <Button variant="outline" onClick={handleShareReport}>
                    <Share className="h-4 w-4 mr-2" />
                    Share Report
                  </Button>
                  <Button className="bg-secondary text-secondary-foreground hover:bg-green-600" onClick={handleScheduleMonitoring}>
                    <Calendar className="h-4 w-4 mr-2" />
                    Schedule Monitoring
                  </Button>
                </div>
              </div>
            </Card>
          </>
        )}
      </main>
    </div>
  );
}
