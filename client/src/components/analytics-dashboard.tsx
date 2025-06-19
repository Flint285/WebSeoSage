import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, BarChart, Bar, PieChart, Pie, Cell, AreaChart, Area } from "recharts";
import { TrendingUp, TrendingDown, Activity, Target, Globe, Search, BarChart3, Eye } from "lucide-react";
import type { Website } from "@shared/schema";

interface AnalyticsDashboardProps {
  websites: Website[];
}

interface AnalyticsMetrics {
  totalWebsites: number;
  averageScore: number;
  totalAnalyses: number;
  improvementRate: number;
  scoreDistribution: Array<{ range: string; count: number; color: string }>;
  performanceTrends: Array<{ date: string; technical: number; content: number; performance: number; ux: number; overall: number }>;
  topPerformingPages: Array<{ url: string; score: number; domain: string }>;
  issueBreakdown: Array<{ category: string; count: number; severity: string }>;
  monthlyProgress: Array<{ month: string; websites: number; analyses: number; avgScore: number }>;
}

export function AnalyticsDashboard({ websites }: AnalyticsDashboardProps) {
  const { data: analytics, isLoading } = useQuery<AnalyticsMetrics>({
    queryKey: ["/api/analytics/overview"],
    enabled: websites.length > 0,
  });

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {[...Array(4)].map((_, i) => (
            <Card key={i} className="animate-pulse">
              <CardHeader className="pb-2">
                <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-3/4"></div>
              </CardHeader>
              <CardContent>
                <div className="h-8 bg-gray-200 dark:bg-gray-700 rounded w-1/2 mb-2"></div>
                <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded w-full"></div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    );
  }

  if (!analytics) {
    return (
      <Card>
        <CardContent className="p-6 text-center">
          <Eye className="h-12 w-12 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
            No Analytics Data Available
          </h3>
          <p className="text-gray-600 dark:text-gray-300">
            Add some websites and run analyses to see your SEO performance analytics.
          </p>
        </CardContent>
      </Card>
    );
  }

  const getScoreColor = (score: number) => {
    if (score >= 80) return "text-green-600 dark:text-green-400";
    if (score >= 60) return "text-yellow-600 dark:text-yellow-400";
    return "text-red-600 dark:text-red-400";
  };

  const getScoreBadgeVariant = (score: number) => {
    if (score >= 80) return "default";
    if (score >= 60) return "secondary";
    return "destructive";
  };

  const getTrendIcon = (rate: number) => {
    return rate > 0 ? (
      <TrendingUp className="h-4 w-4 text-green-600 dark:text-green-400" />
    ) : rate < 0 ? (
      <TrendingDown className="h-4 w-4 text-red-600 dark:text-red-400" />
    ) : (
      <Activity className="h-4 w-4 text-gray-600 dark:text-gray-400" />
    );
  };

  return (
    <div className="space-y-6">
      {/* Key Metrics Overview */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Websites</CardTitle>
            <Globe className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{analytics.totalWebsites}</div>
            <p className="text-xs text-muted-foreground">
              Active websites being monitored
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Average SEO Score</CardTitle>
            <Target className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className={`text-2xl font-bold ${getScoreColor(analytics.averageScore)}`}>
              {analytics.averageScore.toFixed(1)}
            </div>
            <div className="flex items-center space-x-2">
              {getTrendIcon(analytics.improvementRate)}
              <p className="text-xs text-muted-foreground">
                {analytics.improvementRate > 0 ? '+' : ''}{analytics.improvementRate.toFixed(1)}% from last month
              </p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Analyses</CardTitle>
            <Search className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{analytics.totalAnalyses}</div>
            <p className="text-xs text-muted-foreground">
              SEO analyses completed
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Improvement Rate</CardTitle>
            <BarChart3 className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className={`text-2xl font-bold ${getScoreColor(analytics.improvementRate + 50)}`}>
              {analytics.improvementRate > 0 ? '+' : ''}{analytics.improvementRate.toFixed(1)}%
            </div>
            <p className="text-xs text-muted-foreground">
              Score improvement this month
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Advanced Analytics Tabs */}
      <Tabs defaultValue="trends" className="space-y-4">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="trends">Performance Trends</TabsTrigger>
          <TabsTrigger value="distribution">Score Distribution</TabsTrigger>
          <TabsTrigger value="top-pages">Top Performing</TabsTrigger>
          <TabsTrigger value="issues">Issue Analysis</TabsTrigger>
        </TabsList>

        <TabsContent value="trends" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>SEO Performance Trends</CardTitle>
              <CardDescription>
                Track your website's SEO performance across different categories over time
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={400}>
                <LineChart data={analytics.performanceTrends}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="date" />
                  <YAxis domain={[0, 100]} />
                  <Tooltip />
                  <Legend />
                  <Line type="monotone" dataKey="overall" stroke="#2563eb" strokeWidth={3} name="Overall Score" />
                  <Line type="monotone" dataKey="technical" stroke="#dc2626" strokeWidth={2} name="Technical" />
                  <Line type="monotone" dataKey="content" stroke="#16a34a" strokeWidth={2} name="Content" />
                  <Line type="monotone" dataKey="performance" stroke="#ca8a04" strokeWidth={2} name="Performance" />
                  <Line type="monotone" dataKey="ux" stroke="#9333ea" strokeWidth={2} name="User Experience" />
                </LineChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Monthly Progress</CardTitle>
              <CardDescription>
                Website additions, analyses completed, and average scores by month
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <AreaChart data={analytics.monthlyProgress}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="month" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Area type="monotone" dataKey="analyses" stackId="1" stroke="#2563eb" fill="#2563eb" fillOpacity={0.6} name="Analyses" />
                  <Area type="monotone" dataKey="websites" stackId="1" stroke="#16a34a" fill="#16a34a" fillOpacity={0.6} name="Websites" />
                </AreaChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="distribution" className="space-y-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Score Distribution</CardTitle>
                <CardDescription>
                  How your websites are performing across different score ranges
                </CardDescription>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <PieChart>
                    <Pie
                      data={analytics.scoreDistribution}
                      cx="50%"
                      cy="50%"
                      outerRadius={100}
                      fill="#8884d8"
                      dataKey="count"
                      label={({ range, count }) => `${range}: ${count}`}
                    >
                      {analytics.scoreDistribution.map((entry, index) => (
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
                <CardTitle>Performance Categories</CardTitle>
                <CardDescription>
                  Average scores across different SEO categories
                </CardDescription>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={[
                    { category: 'Technical', score: 75, target: 90 },
                    { category: 'Content', score: 82, target: 85 },
                    { category: 'Performance', score: 68, target: 80 },
                    { category: 'UX', score: 79, target: 85 },
                  ]}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="category" />
                    <YAxis domain={[0, 100]} />
                    <Tooltip />
                    <Legend />
                    <Bar dataKey="score" fill="#2563eb" name="Current Score" />
                    <Bar dataKey="target" fill="#e5e7eb" name="Target Score" />
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="top-pages" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Top Performing Pages</CardTitle>
              <CardDescription>
                Your highest scoring websites and pages
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {analytics.topPerformingPages.map((page, index) => (
                  <div key={index} className="flex items-center justify-between p-4 border rounded-lg">
                    <div className="flex-1">
                      <h3 className="font-semibold text-sm">{page.domain}</h3>
                      <p className="text-xs text-muted-foreground truncate">{page.url}</p>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Badge variant={getScoreBadgeVariant(page.score)}>
                        {page.score.toFixed(1)}
                      </Badge>
                      {index < 3 && (
                        <Badge variant="outline" className="text-yellow-600">
                          #{index + 1}
                        </Badge>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="issues" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Common Issues Analysis</CardTitle>
              <CardDescription>
                Most frequent SEO issues across your websites
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={400}>
                <BarChart data={analytics.issueBreakdown} layout="horizontal">
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis type="number" />
                  <YAxis dataKey="category" type="category" width={150} />
                  <Tooltip />
                  <Bar dataKey="count" fill="#2563eb" />
                </BarChart>
              </ResponsiveContainer>
              
              <div className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="p-4 border rounded-lg bg-red-50 dark:bg-red-900/20">
                  <h4 className="font-semibold text-red-800 dark:text-red-200">High Priority</h4>
                  <p className="text-sm text-red-600 dark:text-red-300">
                    Issues that significantly impact SEO performance
                  </p>
                </div>
                <div className="p-4 border rounded-lg bg-yellow-50 dark:bg-yellow-900/20">
                  <h4 className="font-semibold text-yellow-800 dark:text-yellow-200">Medium Priority</h4>
                  <p className="text-sm text-yellow-600 dark:text-yellow-300">
                    Issues that moderately affect rankings
                  </p>
                </div>
                <div className="p-4 border rounded-lg bg-green-50 dark:bg-green-900/20">
                  <h4 className="font-semibold text-green-800 dark:text-green-200">Low Priority</h4>
                  <p className="text-sm text-green-600 dark:text-green-300">
                    Minor optimizations for better performance
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}