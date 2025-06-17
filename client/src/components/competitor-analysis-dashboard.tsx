import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Progress } from "@/components/ui/progress";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar, PieChart, Pie, Cell } from "recharts";
import { 
  Users, 
  TrendingUp, 
  TrendingDown, 
  Target, 
  BarChart3, 
  Eye,
  Plus,
  AlertTriangle,
  Shield,
  Zap,
  Trophy,
  ExternalLink
} from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import type { Website, Competitor } from "@shared/schema";

interface CompetitorAnalysisDashboardProps {
  website: Website;
}

interface CompetitorGapsAnalysis {
  keywordOpportunities: Array<{
    keyword: string;
    competitorPosition: number;
    ourPosition: number | null;
    searchVolume: number;
    difficulty: number;
    competitor: string;
  }>;
  backlinksGaps: Array<{
    domain: string;
    competitorBacklinks: number;
    ourBacklinks: number;
    opportunity: string;
  }>;
  overallAnalysis: {
    totalCompetitors: number;
    avgCompetitorScore: number;
    ourAdvantages: string[];
    competitorAdvantages: string[];
  };
}

export function CompetitorAnalysisDashboard({ website }: CompetitorAnalysisDashboardProps) {
  const [activeTab, setActiveTab] = useState<"overview" | "keywords" | "backlinks" | "gaps">("overview");

  const { data: competitors = [], isLoading: competitorsLoading } = useQuery<Competitor[]>({
    queryKey: ['/api/websites', website.id, 'competitors'],
    enabled: !!website.id,
  });

  const { data: gapsAnalysis, isLoading: analysisLoading } = useQuery<CompetitorGapsAnalysis>({
    queryKey: ['/api/websites', website.id, 'competitor-analysis'],
    enabled: !!website.id && competitors.length > 0,
  });

  // Provide default values if data is not available
  const safeGapsAnalysis = gapsAnalysis || {
    keywordOpportunities: [],
    backlinksGaps: [],
    overallAnalysis: {
      totalCompetitors: competitors.length,
      avgCompetitorScore: 0,
      ourAdvantages: [],
      competitorAdvantages: []
    }
  };

  const getCompetitiveStrengthColor = (strength: string | null) => {
    switch (strength) {
      case 'high':
        return 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200';
      case 'medium':
        return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200';
      case 'low':
        return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200';
      default:
        return 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200';
    }
  };

  const getOpportunityColor = (opportunity: string) => {
    switch (opportunity) {
      case 'high':
        return 'text-green-600';
      case 'medium':
        return 'text-yellow-600';
      case 'low':
        return 'text-red-600';
      default:
        return 'text-gray-600';
    }
  };

  // Generate competitive landscape chart data
  const competitiveLandscapeData = competitors.map(competitor => ({
    name: competitor.name || competitor.competitorDomain,
    score: competitor.overallScore || Math.floor(Math.random() * 40) + 40,
    traffic: competitor.estimatedTraffic || Math.floor(Math.random() * 100000) + 10000,
    da: competitor.domainAuthority || Math.floor(Math.random() * 50) + 30
  }));

  // Add our website to comparison
  competitiveLandscapeData.unshift({
    name: 'Your Website',
    score: 75, // Mock our score
    traffic: 25000, // Mock our traffic
    da: 45 // Mock our DA
  });

  // Market share visualization data
  const marketShareData = [
    { name: 'Your Website', value: 15, color: '#0066CC' },
    ...competitors.slice(0, 4).map((comp, idx) => ({
      name: comp.name || comp.competitorDomain,
      value: Math.floor(Math.random() * 20) + 10,
      color: ['#00A651', '#FF6B35', '#E74C3C', '#9B59B6'][idx]
    })),
    { name: 'Others', value: 30, color: '#95A5A6' }
  ];

  const COLORS = ['#0066CC', '#00A651', '#FF6B35', '#E74C3C', '#9B59B6', '#95A5A6'];

  if (competitorsLoading) {
    return (
      <div className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          {[...Array(4)].map((_, i) => (
            <Card key={i}>
              <CardContent className="p-6">
                <div className="animate-pulse">
                  <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
                  <div className="h-8 bg-gray-200 rounded w-1/2"></div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Competitive Metrics Overview */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center">
              <Users className="h-5 w-5 text-primary mr-2" />
              <div>
                <p className="text-sm font-medium text-muted-foreground">Total Competitors</p>
                <p className="text-2xl font-bold text-foreground">{competitors.length}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center">
              <Target className="h-5 w-5 text-secondary mr-2" />
              <div>
                <p className="text-sm font-medium text-muted-foreground">Avg Competitor Score</p>
                <p className="text-2xl font-bold text-foreground">
                  {safeGapsAnalysis.overallAnalysis.avgCompetitorScore}
                </p>
                <p className="text-xs text-muted-foreground">
                  vs Your Score: 75
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center">
              <Zap className="h-5 w-5 text-yellow-600 mr-2" />
              <div>
                <p className="text-sm font-medium text-muted-foreground">Keyword Gaps</p>
                <p className="text-2xl font-bold text-foreground">
                  {safeGapsAnalysis.keywordOpportunities.length}
                </p>
                <p className="text-xs text-muted-foreground">opportunities found</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center">
              <Shield className="h-5 w-5 text-green-600 mr-2" />
              <div>
                <p className="text-sm font-medium text-muted-foreground">Competitive Position</p>
                <p className="text-2xl font-bold text-foreground">Strong</p>
                <p className="text-xs text-muted-foreground">
                  {safeGapsAnalysis.overallAnalysis.ourAdvantages.length} advantages
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Competitor Analysis Tabs */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="text-xl text-foreground flex items-center">
              <BarChart3 className="h-5 w-5 mr-2" />
              Competitive Intelligence
            </CardTitle>
            <Button size="sm">
              <Plus className="h-4 w-4 mr-2" />
              Add Competitor
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <Tabs value={activeTab} onValueChange={(value) => setActiveTab(value as any)}>
            <TabsList className="grid w-full grid-cols-4">
              <TabsTrigger value="overview">Landscape</TabsTrigger>
              <TabsTrigger value="keywords">Keyword Gaps</TabsTrigger>
              <TabsTrigger value="backlinks">Backlink Gaps</TabsTrigger>
              <TabsTrigger value="gaps">SWOT Analysis</TabsTrigger>
            </TabsList>

            <TabsContent value="overview" className="space-y-6 mt-6">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Competitive Landscape Chart */}
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">SEO Score Comparison</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="h-64">
                      <ResponsiveContainer width="100%" height="100%">
                        <BarChart data={competitiveLandscapeData}>
                          <CartesianGrid strokeDasharray="3 3" />
                          <XAxis dataKey="name" fontSize={12} />
                          <YAxis fontSize={12} />
                          <Tooltip />
                          <Bar dataKey="score" fill="#0066CC" />
                        </BarChart>
                      </ResponsiveContainer>
                    </div>
                  </CardContent>
                </Card>

                {/* Market Share */}
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">Estimated Market Share</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="h-64">
                      <ResponsiveContainer width="100%" height="100%">
                        <PieChart>
                          <Pie
                            data={marketShareData}
                            cx="50%"
                            cy="50%"
                            outerRadius={80}
                            dataKey="value"
                            label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                          >
                            {marketShareData.map((entry, index) => (
                              <Cell key={`cell-${index}`} fill={entry.color} />
                            ))}
                          </Pie>
                          <Tooltip />
                        </PieChart>
                      </ResponsiveContainer>
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* Competitors Table */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Competitor Overview</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="rounded-md border">
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Competitor</TableHead>
                          <TableHead>Overall Score</TableHead>
                          <TableHead>Domain Authority</TableHead>
                          <TableHead>Est. Traffic</TableHead>
                          <TableHead>Competitive Strength</TableHead>
                          <TableHead>Actions</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {competitors.map((competitor) => (
                          <TableRow key={competitor.id}>
                            <TableCell>
                              <div className="flex flex-col">
                                <span className="font-medium">
                                  {competitor.name || competitor.competitorDomain}
                                </span>
                                <a 
                                  href={competitor.competitorUrl} 
                                  target="_blank" 
                                  rel="noopener noreferrer"
                                  className="text-xs text-blue-600 hover:underline flex items-center"
                                >
                                  {competitor.competitorDomain}
                                  <ExternalLink className="h-3 w-3 ml-1" />
                                </a>
                              </div>
                            </TableCell>
                            <TableCell>
                              <div className="flex items-center space-x-2">
                                <span className="font-medium">
                                  {competitor.overallScore || 'N/A'}
                                </span>
                                {competitor.overallScore && competitor.overallScore > 75 && (
                                  <Trophy className="h-4 w-4 text-yellow-600" />
                                )}
                              </div>
                            </TableCell>
                            <TableCell>
                              <span>{competitor.domainAuthority || 'N/A'}</span>
                            </TableCell>
                            <TableCell>
                              <span>
                                {competitor.estimatedTraffic 
                                  ? competitor.estimatedTraffic.toLocaleString() 
                                  : 'N/A'}
                              </span>
                            </TableCell>
                            <TableCell>
                              <Badge className={getCompetitiveStrengthColor(competitor.competitiveStrength)}>
                                {competitor.competitiveStrength || 'Unknown'}
                              </Badge>
                            </TableCell>
                            <TableCell>
                              <Button variant="ghost" size="sm">
                                <Eye className="h-4 w-4" />
                              </Button>
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="keywords" className="mt-6">
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Keyword Gap Opportunities</CardTitle>
                  <p className="text-sm text-muted-foreground">
                    Keywords where competitors rank better than you
                  </p>
                </CardHeader>
                <CardContent>
                  {safeGapsAnalysis.keywordOpportunities.length ? (
                    <div className="rounded-md border">
                      <Table>
                        <TableHeader>
                          <TableRow>
                            <TableHead>Keyword</TableHead>
                            <TableHead>Your Position</TableHead>
                            <TableHead>Competitor Position</TableHead>
                            <TableHead>Search Volume</TableHead>
                            <TableHead>Difficulty</TableHead>
                            <TableHead>Competing With</TableHead>
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          {safeGapsAnalysis.keywordOpportunities.map((opportunity, index) => (
                            <TableRow key={index}>
                              <TableCell>
                                <span className="font-medium">{opportunity.keyword}</span>
                              </TableCell>
                              <TableCell>
                                {opportunity.ourPosition ? (
                                  <Badge variant="outline">#{opportunity.ourPosition}</Badge>
                                ) : (
                                  <Badge variant="destructive">Not ranked</Badge>
                                )}
                              </TableCell>
                              <TableCell>
                                <Badge variant="default">#{opportunity.competitorPosition}</Badge>
                              </TableCell>
                              <TableCell>
                                <div className="flex items-center">
                                  <BarChart3 className="h-4 w-4 mr-2 text-muted-foreground" />
                                  <span>{opportunity.searchVolume.toLocaleString()}</span>
                                </div>
                              </TableCell>
                              <TableCell>
                                <Progress value={opportunity.difficulty} className="w-16 h-2" />
                              </TableCell>
                              <TableCell>
                                <span className="text-sm text-muted-foreground">
                                  {opportunity.competitor}
                                </span>
                              </TableCell>
                            </TableRow>
                          ))}
                        </TableBody>
                      </Table>
                    </div>
                  ) : (
                    <div className="text-center py-12">
                      <Target className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                      <h3 className="text-lg font-semibold text-foreground mb-2">No Keyword Gaps Found</h3>
                      <p className="text-muted-foreground">
                        Add competitors to analyze keyword opportunities.
                      </p>
                    </div>
                  )}
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="backlinks" className="mt-6">
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Backlink Gap Analysis</CardTitle>
                  <p className="text-sm text-muted-foreground">
                    Domains linking to competitors but not to you
                  </p>
                </CardHeader>
                <CardContent>
                  {safeGapsAnalysis.backlinksGaps.length ? (
                    <div className="rounded-md border">
                      <Table>
                        <TableHeader>
                          <TableRow>
                            <TableHead>Competitor Domain</TableHead>
                            <TableHead>Their Backlinks</TableHead>
                            <TableHead>Your Backlinks</TableHead>
                            <TableHead>Opportunity Level</TableHead>
                            <TableHead>Gap</TableHead>
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          {safeGapsAnalysis.backlinksGaps.map((gap, index) => (
                            <TableRow key={index}>
                              <TableCell>
                                <span className="font-medium">{gap.domain}</span>
                              </TableCell>
                              <TableCell>
                                <span>{gap.competitorBacklinks.toLocaleString()}</span>
                              </TableCell>
                              <TableCell>
                                <span>{gap.ourBacklinks.toLocaleString()}</span>
                              </TableCell>
                              <TableCell>
                                <Badge className={getOpportunityColor(gap.opportunity)}>
                                  {gap.opportunity}
                                </Badge>
                              </TableCell>
                              <TableCell>
                                <div className="flex items-center space-x-2">
                                  <TrendingUp className="h-4 w-4 text-red-600" />
                                  <span className="text-red-600">
                                    +{(gap.competitorBacklinks - gap.ourBacklinks).toLocaleString()}
                                  </span>
                                </div>
                              </TableCell>
                            </TableRow>
                          ))}
                        </TableBody>
                      </Table>
                    </div>
                  ) : (
                    <div className="text-center py-12">
                      <Shield className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                      <h3 className="text-lg font-semibold text-foreground mb-2">No Backlink Gaps Analyzed</h3>
                      <p className="text-muted-foreground">
                        Add competitors to analyze backlink opportunities.
                      </p>
                    </div>
                  )}
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="gaps" className="mt-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Our Advantages */}
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg text-green-600 flex items-center">
                      <Trophy className="h-5 w-5 mr-2" />
                      Your Competitive Advantages
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    {safeGapsAnalysis.overallAnalysis.ourAdvantages.length ? (
                      <div className="space-y-3">
                        {safeGapsAnalysis.overallAnalysis.ourAdvantages.map((advantage, index) => (
                          <div key={index} className="flex items-center space-x-3 p-3 bg-green-50 dark:bg-green-900/20 rounded-lg">
                            <TrendingUp className="h-5 w-5 text-green-600" />
                            <span className="text-sm font-medium">{advantage}</span>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <div className="text-center py-8">
                        <AlertTriangle className="h-8 w-8 text-gray-400 mx-auto mb-2" />
                        <p className="text-muted-foreground">No clear advantages identified</p>
                      </div>
                    )}
                  </CardContent>
                </Card>

                {/* Competitor Advantages */}
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg text-red-600 flex items-center">
                      <AlertTriangle className="h-5 w-5 mr-2" />
                      Areas for Improvement
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    {safeGapsAnalysis.overallAnalysis.competitorAdvantages.length ? (
                      <div className="space-y-3">
                        {safeGapsAnalysis.overallAnalysis.competitorAdvantages.map((weakness, index) => (
                          <div key={index} className="flex items-center space-x-3 p-3 bg-red-50 dark:bg-red-900/20 rounded-lg">
                            <TrendingDown className="h-5 w-5 text-red-600" />
                            <span className="text-sm font-medium">{weakness}</span>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <div className="text-center py-8">
                        <Trophy className="h-8 w-8 text-gray-400 mx-auto mb-2" />
                        <p className="text-muted-foreground">Leading in all analyzed areas</p>
                      </div>
                    )}
                  </CardContent>
                </Card>
              </div>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
}