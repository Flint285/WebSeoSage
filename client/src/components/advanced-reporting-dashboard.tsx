import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { DatePickerWithRange } from "@/components/ui/date-range-picker";
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  LineChart,
  Line,
  PieChart,
  Pie,
  Cell,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  Radar,
  ComposedChart,
  Area,
  AreaChart
} from "recharts";
import { 
  TrendingUp, 
  TrendingDown, 
  FileText, 
  Download, 
  Share2, 
  Calendar,
  Target,
  AlertTriangle,
  CheckCircle,
  Clock,
  Globe,
  Search,
  Users,
  Activity
} from "lucide-react";
import type { Website, SeoAnalysis } from "@shared/schema";
import { PdfGenerator } from "@/lib/pdf-generator";

interface AdvancedReportingDashboardProps {
  websites: Website[];
}

interface ReportingMetrics {
  overallPerformance: {
    averageScore: number;
    scoreChange: number;
    totalWebsites: number;
    totalAnalyses: number;
    lastUpdated: string;
  };
  performanceTrends: Array<{
    date: string;
    overallScore: number;
    technicalScore: number;
    contentScore: number;
    performanceScore: number;
    uxScore: number;
  }>;
  categoryBreakdown: Array<{
    category: string;
    currentScore: number;
    previousScore: number;
    change: number;
    color: string;
  }>;
  topPerformers: Array<{
    url: string;
    score: number;
    change: number;
    lastAnalyzed: string;
  }>;
  issueDistribution: Array<{
    severity: string;
    count: number;
    percentage: number;
    color: string;
  }>;
  competitiveAnalysis: Array<{
    metric: string;
    ourScore: number;
    industryAverage: number;
    topCompetitor: number;
  }>;
  actionItems: Array<{
    priority: 'high' | 'medium' | 'low';
    category: string;
    description: string;
    impact: string;
    effort: string;
    websites: string[];
  }>;
}

export function AdvancedReportingDashboard({ websites }: AdvancedReportingDashboardProps) {
  const [selectedPeriod, setSelectedPeriod] = useState("30d");
  const [selectedWebsites, setSelectedWebsites] = useState<string[]>([]);
  const [reportType, setReportType] = useState("executive");

  const { data: reportingData, isLoading } = useQuery<ReportingMetrics>({
    queryKey: ["/api/reporting/analytics", selectedPeriod, selectedWebsites],
  });

  const handleExportReport = async () => {
    if (!reportingData) return;
    
    const pdfGenerator = new PdfGenerator();
    await pdfGenerator.generateAdvancedReport(reportingData, {
      period: selectedPeriod,
      websites: selectedWebsites,
      type: reportType
    });
  };

  const getScoreColor = (score: number) => {
    if (score >= 80) return "#10B981";
    if (score >= 60) return "#F59E0B";
    return "#EF4444";
  };

  const getTrendIcon = (change: number) => {
    return change > 0 ? TrendingUp : TrendingDown;
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high': return 'destructive';
      case 'medium': return 'secondary';
      default: return 'outline';
    }
  };

  if (isLoading) {
    return (
      <div className="space-y-6">
        {Array.from({ length: 4 }).map((_, i) => (
          <Card key={i}>
            <CardContent className="p-6">
              <div className="animate-pulse space-y-4">
                <div className="h-4 bg-gray-200 rounded w-1/4"></div>
                <div className="h-32 bg-gray-200 rounded"></div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  if (!reportingData) return null;

  return (
    <div className="space-y-6">
      {/* Report Controls */}
      <Card>
        <CardHeader>
          <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4">
            <div>
              <CardTitle className="text-2xl font-bold">Advanced Analytics Report</CardTitle>
              <p className="text-muted-foreground">Comprehensive SEO performance insights and strategic recommendations</p>
            </div>
            <div className="flex flex-wrap gap-3">
              <Select value={selectedPeriod} onValueChange={setSelectedPeriod}>
                <SelectTrigger className="w-32">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="7d">Last 7 days</SelectItem>
                  <SelectItem value="30d">Last 30 days</SelectItem>
                  <SelectItem value="90d">Last 3 months</SelectItem>
                  <SelectItem value="1y">Last year</SelectItem>
                </SelectContent>
              </Select>
              <Select value={reportType} onValueChange={setReportType}>
                <SelectTrigger className="w-36">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="executive">Executive</SelectItem>
                  <SelectItem value="technical">Technical</SelectItem>
                  <SelectItem value="marketing">Marketing</SelectItem>
                </SelectContent>
              </Select>
              <Button onClick={handleExportReport} variant="outline">
                <Download className="h-4 w-4 mr-2" />
                Export PDF
              </Button>
              <Button>
                <Share2 className="h-4 w-4 mr-2" />
                Share Report
              </Button>
            </div>
          </div>
        </CardHeader>
      </Card>

      {/* Key Performance Indicators */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Average SEO Score</p>
                <div className="flex items-center gap-2">
                  <p className="text-3xl font-bold" style={{ color: getScoreColor(reportingData.overallPerformance.averageScore) }}>
                    {reportingData.overallPerformance.averageScore}
                  </p>
                  <div className="flex items-center text-sm">
                    {reportingData.overallPerformance.scoreChange > 0 ? (
                      <TrendingUp className="h-4 w-4 text-green-500" />
                    ) : (
                      <TrendingDown className="h-4 w-4 text-red-500" />
                    )}
                    <span className={reportingData.overallPerformance.scoreChange > 0 ? "text-green-500" : "text-red-500"}>
                      {Math.abs(reportingData.overallPerformance.scoreChange)}%
                    </span>
                  </div>
                </div>
              </div>
              <Target className="h-8 w-8 text-blue-500" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Websites Monitored</p>
                <p className="text-3xl font-bold">{reportingData.overallPerformance.totalWebsites}</p>
              </div>
              <Globe className="h-8 w-8 text-green-500" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Total Analyses</p>
                <p className="text-3xl font-bold">{reportingData.overallPerformance.totalAnalyses}</p>
              </div>
              <Activity className="h-8 w-8 text-purple-500" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Last Updated</p>
                <p className="text-sm font-medium">{reportingData.overallPerformance.lastUpdated}</p>
              </div>
              <Clock className="h-8 w-8 text-orange-500" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Detailed Analytics Tabs */}
      <Tabs defaultValue="trends" className="space-y-6">
        <TabsList className="grid w-full grid-cols-5">
          <TabsTrigger value="trends">Performance Trends</TabsTrigger>
          <TabsTrigger value="breakdown">Category Analysis</TabsTrigger>
          <TabsTrigger value="competitive">Competitive Analysis</TabsTrigger>
          <TabsTrigger value="issues">Issue Analysis</TabsTrigger>
          <TabsTrigger value="actions">Action Items</TabsTrigger>
        </TabsList>

        <TabsContent value="trends" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>SEO Performance Trends</CardTitle>
              <p className="text-muted-foreground">Track your SEO performance across different categories over time</p>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={400}>
                <LineChart data={reportingData.performanceTrends}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="date" />
                  <YAxis domain={[0, 100]} />
                  <Tooltip />
                  <Line type="monotone" dataKey="overallScore" stroke="#3B82F6" strokeWidth={3} name="Overall" />
                  <Line type="monotone" dataKey="technicalScore" stroke="#10B981" strokeWidth={2} name="Technical" />
                  <Line type="monotone" dataKey="contentScore" stroke="#F59E0B" strokeWidth={2} name="Content" />
                  <Line type="monotone" dataKey="performanceScore" stroke="#EF4444" strokeWidth={2} name="Performance" />
                  <Line type="monotone" dataKey="uxScore" stroke="#8B5CF6" strokeWidth={2} name="UX" />
                </LineChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="breakdown" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Category Performance</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {reportingData.categoryBreakdown.map((category) => (
                    <div key={category.category} className="space-y-2">
                      <div className="flex justify-between items-center">
                        <span className="font-medium">{category.category}</span>
                        <div className="flex items-center gap-2">
                          <span className="text-2xl font-bold" style={{ color: category.color }}>
                            {category.currentScore}
                          </span>
                          <div className="flex items-center text-sm">
                            {getTrendIcon(category.change)({ 
                              className: `h-4 w-4 ${category.change > 0 ? 'text-green-500' : 'text-red-500'}` 
                            })}
                            <span className={category.change > 0 ? "text-green-500" : "text-red-500"}>
                              {Math.abs(category.change)}%
                            </span>
                          </div>
                        </div>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div 
                          className="h-2 rounded-full transition-all duration-300" 
                          style={{ 
                            width: `${category.currentScore}%`, 
                            backgroundColor: category.color 
                          }}
                        ></div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Top Performing Websites</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {reportingData.topPerformers.map((website, index) => (
                    <div key={website.url} className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
                      <div className="flex items-center gap-3">
                        <Badge variant="outline" className="w-8 h-8 flex items-center justify-center">
                          #{index + 1}
                        </Badge>
                        <div>
                          <p className="font-medium">{website.url}</p>
                          <p className="text-sm text-muted-foreground">Last analyzed: {website.lastAnalyzed}</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="text-2xl font-bold" style={{ color: getScoreColor(website.score) }}>
                          {website.score}
                        </p>
                        <div className="flex items-center text-sm">
                          {getTrendIcon(website.change)({ 
                            className: `h-4 w-4 ${website.change > 0 ? 'text-green-500' : 'text-red-500'}` 
                          })}
                          <span className={website.change > 0 ? "text-green-500" : "text-red-500"}>
                            {Math.abs(website.change)}%
                          </span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="competitive" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Competitive Benchmark Analysis</CardTitle>
              <p className="text-muted-foreground">See how your SEO performance compares to industry standards</p>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={400}>
                <RadarChart data={reportingData.competitiveAnalysis}>
                  <PolarGrid />
                  <PolarAngleAxis dataKey="metric" />
                  <PolarRadiusAxis domain={[0, 100]} />
                  <Radar name="Your Score" dataKey="ourScore" stroke="#3B82F6" fill="#3B82F6" fillOpacity={0.3} strokeWidth={2} />
                  <Radar name="Industry Average" dataKey="industryAverage" stroke="#10B981" fill="#10B981" fillOpacity={0.1} strokeWidth={2} />
                  <Radar name="Top Competitor" dataKey="topCompetitor" stroke="#EF4444" fill="#EF4444" fillOpacity={0.1} strokeWidth={2} />
                  <Tooltip />
                </RadarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="issues" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Issue Distribution</CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <PieChart>
                    <Pie
                      data={reportingData.issueDistribution}
                      cx="50%"
                      cy="50%"
                      outerRadius={100}
                      fill="#8884d8"
                      dataKey="count"
                      label={({ severity, percentage }) => `${severity}: ${percentage}%`}
                    >
                      {reportingData.issueDistribution.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Issue Breakdown</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {reportingData.issueDistribution.map((issue) => (
                    <div key={issue.severity} className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div 
                          className="w-4 h-4 rounded" 
                          style={{ backgroundColor: issue.color }}
                        ></div>
                        <span className="font-medium capitalize">{issue.severity} Priority</span>
                      </div>
                      <div className="text-right">
                        <p className="text-lg font-bold">{issue.count}</p>
                        <p className="text-sm text-muted-foreground">{issue.percentage}% of total</p>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="actions" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Strategic Action Items</CardTitle>
              <p className="text-muted-foreground">Prioritized recommendations to improve your SEO performance</p>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {reportingData.actionItems.map((action, index) => (
                  <div key={index} className="border rounded-lg p-4 space-y-3">
                    <div className="flex items-start justify-between">
                      <div className="flex items-center gap-3">
                        <Badge variant={getPriorityColor(action.priority)} className="capitalize">
                          {action.priority} Priority
                        </Badge>
                        <Badge variant="outline">{action.category}</Badge>
                      </div>
                      <div className="flex gap-2">
                        <Badge variant="secondary">Impact: {action.impact}</Badge>
                        <Badge variant="outline">Effort: {action.effort}</Badge>
                      </div>
                    </div>
                    <p className="font-medium">{action.description}</p>
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <Globe className="h-4 w-4" />
                      <span>Affects {action.websites.length} website(s): {action.websites.join(', ')}</span>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}