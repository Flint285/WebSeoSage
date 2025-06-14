import { useState } from "react";
import { useMutation, useQuery } from "@tanstack/react-query";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { SeoAnalysisForm } from "@/components/seo-analysis-form";
import { SeoScoreCircle } from "@/components/seo-score-circle";
import { CategoryBreakdown } from "@/components/category-breakdown";
import { IssuesRecommendations } from "@/components/issues-recommendations";
import { MetricsTable } from "@/components/metrics-table";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { CheckCircle, XCircle, Shield, Calendar, Download, Share, ChartLine } from "lucide-react";
import type { SeoAnalysis } from "@shared/schema";
import { PdfGenerator } from "@/lib/pdf-generator";
import { Link } from "wouter";

export default function Dashboard() {
  const [currentAnalysis, setCurrentAnalysis] = useState<SeoAnalysis | null>(null);
  const { toast } = useToast();

  const analyzeMutation = useMutation({
    mutationFn: async (url: string) => {
      const response = await apiRequest("POST", "/api/analyze", { url });
      return response.json();
    },
    onSuccess: (data: SeoAnalysis) => {
      setCurrentAnalysis(data);
      queryClient.invalidateQueries({ queryKey: ["/api/analyses"] });
      toast({
        title: "Analysis Complete",
        description: "Your SEO analysis has been completed successfully.",
      });
    },
    onError: (error) => {
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
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-4">
              <div className="text-2xl font-bold text-primary flex items-center">
                <ChartLine className="h-8 w-8 mr-2" />
                SEO Analyzer Pro
              </div>
            </div>
            <nav className="hidden md:flex space-x-8">
              <Link href="/" className="text-foreground hover:text-primary font-medium">Dashboard</Link>
              <Link href="/history" className="text-muted-foreground hover:text-primary font-medium">History</Link>
              <a href="#" className="text-muted-foreground hover:text-primary font-medium">Keywords</a>
              <a href="#" className="text-muted-foreground hover:text-primary font-medium">Backlinks</a>
            </nav>
            <div className="flex items-center space-x-4">
              <Button className="bg-primary text-primary-foreground hover:bg-blue-700">
                Upgrade Pro
              </Button>
              <div className="w-8 h-8 bg-gray-300 rounded-full"></div>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Analysis Form */}
        <SeoAnalysisForm 
          onAnalyze={handleAnalyze} 
          isLoading={analyzeMutation.isPending}
        />

        {/* Results Section */}
        {currentAnalysis && (
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

            {/* Issues and Recommendations */}
            <div id="issues-section">
              <IssuesRecommendations analysis={currentAnalysis} />
            </div>

            {/* Metrics Table */}
            <MetricsTable analysis={currentAnalysis} />

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
      </div>

      {/* Footer */}
      <footer className="bg-white border-t border-gray-200 mt-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div className="md:col-span-2">
              <div className="text-2xl font-bold text-primary mb-4 flex items-center">
                <ChartLine className="h-8 w-8 mr-2" />
                SEO Analyzer Pro
              </div>
              <p className="text-muted-foreground mb-4">
                Professional SEO analysis tool helping businesses optimize their online presence and improve search engine rankings.
              </p>
            </div>
            <div>
              <h3 className="font-semibold text-foreground mb-4">Tools</h3>
              <ul className="space-y-2 text-muted-foreground">
                <li><a href="#" className="hover:text-primary">SEO Analyzer</a></li>
                <li><a href="#" className="hover:text-primary">Keyword Research</a></li>
                <li><a href="#" className="hover:text-primary">Backlink Checker</a></li>
                <li><a href="#" className="hover:text-primary">Site Audit</a></li>
              </ul>
            </div>
            <div>
              <h3 className="font-semibold text-foreground mb-4">Support</h3>
              <ul className="space-y-2 text-muted-foreground">
                <li><a href="#" className="hover:text-primary">Documentation</a></li>
                <li><a href="#" className="hover:text-primary">Help Center</a></li>
                <li><a href="#" className="hover:text-primary">Contact Us</a></li>
                <li><a href="#" className="hover:text-primary">API Reference</a></li>
              </ul>
            </div>
          </div>
          <div className="border-t border-gray-200 mt-8 pt-8 text-center text-muted-foreground">
            <p>&copy; 2024 SEO Analyzer Pro. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
