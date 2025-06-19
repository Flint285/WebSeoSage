import { useState, useEffect } from "react";
import { useMutation, useQuery } from "@tanstack/react-query";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { useAuth } from "@/hooks/useAuth";
import { useToast } from "@/hooks/use-toast";
import { isUnauthorizedError } from "@/lib/authUtils";
import { Navigation } from "@/components/navigation";
import { AnalyzingProgress, PageLoader } from "@/components/loading-states";
import { NoWebsitesState } from "@/components/empty-states";
import { SeoAnalysisForm } from "@/components/seo-analysis-form";
import { SeoScoreCircle } from "@/components/seo-score-circle";
import { CategoryBreakdown } from "@/components/category-breakdown";
import { IssuesRecommendations } from "@/components/issues-recommendations";
import { MetricsTable } from "@/components/metrics-table";
import { ContentMetricsPanel } from "@/components/content-metrics-panel";
import { AnalyticsDashboard } from "@/components/analytics-dashboard";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { CheckCircle, XCircle, Shield, Calendar, Download, Share, ChartLine, ArrowLeft, BarChart3, TrendingUp } from "lucide-react";
import type { SeoAnalysis, Website } from "@shared/schema";
import { PdfGenerator } from "@/lib/pdf-generator";
import { Link } from "wouter";

export default function EnhancedDashboard() {
  const [currentAnalysis, setCurrentAnalysis] = useState<SeoAnalysis | null>(null);
  const [activeTab, setActiveTab] = useState("analyze");
  const [analysisStep, setAnalysisStep] = useState("Loading website...");
  const { toast } = useToast();
  const { isAuthenticated, isLoading, user } = useAuth();

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

  const { data: websites = [] } = useQuery<Website[]>({
    queryKey: ["/api/websites"],
    enabled: isAuthenticated,
  });

  const analyzeMutation = useMutation({
    mutationFn: async (url: string) => {
      // Simulate progress steps
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
          await new Promise(resolve => setTimeout(resolve, 1000));
        }
      }
      
      const response = await apiRequest("POST", "/api/analyze", { url });
      return response.json();
    },
    onSuccess: (data: SeoAnalysis) => {
      setCurrentAnalysis(data);
      queryClient.invalidateQueries({ queryKey: ["/api/analyses"] });
      queryClient.invalidateQueries({ queryKey: ["/api/websites"] });
      queryClient.invalidateQueries({ queryKey: ["/api/analytics/overview"] });
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

  const handleAnalyze = (url: string) => {
    analyzeMutation.mutate(url);
  };

  const handleGeneratePdf = async () => {
    if (!currentAnalysis) return;
    
    try {
      await PdfGenerator.generateSeoReport(currentAnalysis);
      toast({
        title: "PDF Generated",
        description: "Your SEO report has been downloaded.",
      });
    } catch (error) {
      toast({
        title: "PDF Generation Failed",
        description: "Failed to generate PDF report. Please try again.",
        variant: "destructive",
      });
    }
  };

  const handleShare = () => {
    if (!currentAnalysis) return;
    
    const shareUrl = `${window.location.origin}/analysis/${currentAnalysis.id}`;
    navigator.clipboard.writeText(shareUrl);
    
    toast({
      title: "Link Copied",
      description: "Analysis link has been copied to your clipboard.",
    });
  };

  const handleSchedule = () => {
    toast({
      title: "Schedule Feature",
      description: "Automated scanning will be available soon.",
    });
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50 dark:from-gray-900 dark:via-gray-800 dark:to-blue-900">
      {/* Header */}
      <header className="border-b bg-white/80 dark:bg-gray-900/80 backdrop-blur-sm sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4 flex justify-between items-center">
          <div className="flex items-center space-x-4">
            <Link href="/">
              <Button variant="ghost" size="sm">
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back to Home
              </Button>
            </Link>
            <div className="flex items-center space-x-2">
              <BarChart3 className="h-8 w-8 text-blue-600 dark:text-blue-400" />
              <span className="text-2xl font-bold text-gray-900 dark:text-white">SEO Analytics</span>
            </div>
          </div>
          
          <div className="flex items-center space-x-2">
            <span className="text-sm text-gray-600 dark:text-gray-300">
              Welcome, {user?.firstName || user?.email || "User"}
            </span>
            <Button 
              variant="outline"
              size="sm"
              onClick={() => window.location.href = '/api/logout'}
            >
              Sign Out
            </Button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-8">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="analyze" className="flex items-center space-x-2">
              <Shield className="h-4 w-4" />
              <span>SEO Analysis</span>
            </TabsTrigger>
            <TabsTrigger value="analytics" className="flex items-center space-x-2">
              <TrendingUp className="h-4 w-4" />
              <span>Advanced Analytics</span>
            </TabsTrigger>
            <TabsTrigger value="history" className="flex items-center space-x-2">
              <ChartLine className="h-4 w-4" />
              <span>History & Reports</span>
            </TabsTrigger>
          </TabsList>

          <TabsContent value="analyze" className="space-y-6">
            {/* Analysis Form */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Shield className="h-6 w-6 text-blue-600 dark:text-blue-400" />
                  <span>Website SEO Analysis</span>
                </CardTitle>
                <CardDescription>
                  Enter a website URL to get a comprehensive SEO performance analysis
                </CardDescription>
              </CardHeader>
              <CardContent>
                <SeoAnalysisForm 
                  onAnalyze={handleAnalyze} 
                  isLoading={analyzeMutation.isPending}
                />
              </CardContent>
            </Card>

            {/* Analysis Results */}
            {currentAnalysis && (
              <div className="space-y-6">
                {/* Score Overview */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                  <Card>
                    <CardContent className="p-6">
                      <SeoScoreCircle 
                        score={currentAnalysis.overallScore}
                        size={120}
                      />
                    </CardContent>
                  </Card>
                  
                  <div className="lg:col-span-2">
                    <CategoryBreakdown analysis={currentAnalysis} />
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="flex flex-wrap gap-4">
                  <Button onClick={handleGeneratePdf} className="flex items-center space-x-2">
                    <Download className="h-4 w-4" />
                    <span>Download PDF</span>
                  </Button>
                  <Button variant="outline" onClick={handleShare} className="flex items-center space-x-2">
                    <Share className="h-4 w-4" />
                    <span>Share Report</span>
                  </Button>
                  <Button variant="outline" onClick={handleSchedule} className="flex items-center space-x-2">
                    <Calendar className="h-4 w-4" />
                    <span>Schedule Scan</span>
                  </Button>
                  <Link href="/history">
                    <Button variant="outline" className="flex items-center space-x-2">
                      <ChartLine className="h-4 w-4" />
                      <span>View History</span>
                    </Button>
                  </Link>
                </div>

                {/* Detailed Analysis Tabs */}
                <Tabs defaultValue="issues" className="space-y-4">
                  <TabsList>
                    <TabsTrigger value="issues">Issues & Recommendations</TabsTrigger>
                    <TabsTrigger value="technical">Technical Metrics</TabsTrigger>
                    <TabsTrigger value="content">Content Analysis</TabsTrigger>
                  </TabsList>

                  <TabsContent value="issues">
                    <IssuesRecommendations analysis={currentAnalysis} />
                  </TabsContent>

                  <TabsContent value="technical">
                    <MetricsTable analysis={currentAnalysis} />
                  </TabsContent>

                  <TabsContent value="content">
                    <ContentMetricsPanel analysis={currentAnalysis} />
                  </TabsContent>
                </Tabs>
              </div>
            )}
          </TabsContent>

          <TabsContent value="analytics" className="space-y-6">
            <div className="mb-6">
              <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
                Advanced SEO Analytics
              </h2>
              <p className="text-gray-600 dark:text-gray-300">
                Comprehensive insights into your SEO performance across all websites
              </p>
            </div>
            <AnalyticsDashboard websites={websites} />
          </TabsContent>

          <TabsContent value="history" className="space-y-6">
            <div className="mb-6">
              <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
                History & Reports
              </h2>
              <p className="text-gray-600 dark:text-gray-300">
                Access your previous analyses and detailed reporting
              </p>
            </div>
            <Card>
              <CardContent className="p-6 text-center">
                <ChartLine className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                  Detailed History Available
                </h3>
                <p className="text-gray-600 dark:text-gray-300 mb-4">
                  View comprehensive historical data, trends, and detailed reports for all your websites.
                </p>
                <Link href="/history">
                  <Button className="bg-blue-600 hover:bg-blue-700 text-white">
                    <ChartLine className="h-4 w-4 mr-2" />
                    Go to Full History Dashboard
                  </Button>
                </Link>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </main>
    </div>
  );
}