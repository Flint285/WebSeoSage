import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  Users, 
  TrendingUp, 
  TrendingDown, 
  Target, 
  Zap,
  Trophy,
  AlertTriangle,
  ExternalLink,
  Plus
} from "lucide-react";
import type { Website, Competitor } from "@shared/schema";
import { CompetitorImportDialog } from "./competitor-import-dialog";

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

  // Add early return for invalid website
  if (!website?.id) {
    return (
      <div className="text-center py-12">
        <AlertTriangle className="h-12 w-12 text-red-500 mx-auto mb-4" />
        <h3 className="text-lg font-semibold mb-2">Website Not Found</h3>
        <p className="text-muted-foreground">Unable to load competitor analysis.</p>
      </div>
    );
  }

  const { data: competitors = [], isLoading: competitorsLoading } = useQuery<Competitor[]>({
    queryKey: ['/api/websites', website.id, 'competitors'],
    enabled: !!website.id,
  });

  const { data: gapsAnalysis, isLoading: analysisLoading } = useQuery<CompetitorGapsAnalysis>({
    queryKey: ['/api/websites', website.id, 'competitor-analysis'],
    enabled: !!website.id && Array.isArray(competitors) && competitors.length > 0,
  });

  // Show loading state
  if (competitorsLoading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="text-center">
          <div className="w-8 h-8 border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading competitor analysis...</p>
        </div>
      </div>
    );
  }

  // Show empty state if no competitors
  if (!Array.isArray(competitors) || competitors.length === 0) {
    return (
      <div className="text-center py-12">
        <Users className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
        <h3 className="text-lg font-semibold mb-2">No Competitors Added</h3>
        <p className="text-muted-foreground mb-6">
          Add competitors to analyze your competitive landscape and identify opportunities.
        </p>
        <CompetitorImportDialog website={website}>
          <Button>
            <Plus className="h-4 w-4 mr-2" />
            Add First Competitor
          </Button>
        </CompetitorImportDialog>
      </div>
    );
  }

  // Create safe analysis data with proper defaults and additional safety checks
  const safeAnalysis: CompetitorGapsAnalysis = {
    keywordOpportunities: gapsAnalysis?.keywordOpportunities || [],
    backlinksGaps: gapsAnalysis?.backlinksGaps || [],
    overallAnalysis: {
      totalCompetitors: gapsAnalysis?.overallAnalysis?.totalCompetitors || competitors.length || 0,
      avgCompetitorScore: gapsAnalysis?.overallAnalysis?.avgCompetitorScore || 0,
      ourAdvantages: gapsAnalysis?.overallAnalysis?.ourAdvantages || [],
      competitorAdvantages: gapsAnalysis?.overallAnalysis?.competitorAdvantages || []
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

  return (
    <div className="space-y-6">
      {/* Header with Import Button */}
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold text-foreground">Competitor Analysis</h2>
          <p className="text-muted-foreground">
            Analyze your competitive landscape and identify opportunities
          </p>
        </div>
        <CompetitorImportDialog website={website}>
          <Button>
            <Plus className="h-4 w-4 mr-2" />
            Add Competitor
          </Button>
        </CompetitorImportDialog>
      </div>

      {/* Key Metrics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center">
              <Users className="h-5 w-5 text-blue-600 mr-2" />
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
                  {safeAnalysis.overallAnalysis.avgCompetitorScore}
                </p>
                <p className="text-xs text-muted-foreground">vs Your Score: 75</p>
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
                  {safeAnalysis.keywordOpportunities.length}
                </p>
                <p className="text-xs text-muted-foreground">opportunities found</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center">
              <Trophy className="h-5 w-5 text-green-600 mr-2" />
              <div>
                <p className="text-sm font-medium text-muted-foreground">Competitive Position</p>
                <p className="text-2xl font-bold text-foreground">Strong</p>
                <p className="text-xs text-muted-foreground">
                  {safeAnalysis.overallAnalysis.ourAdvantages.length} advantages
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Detailed Analysis Tabs */}
      <Card>
        <CardHeader>
          <CardTitle>Competitive Intelligence</CardTitle>
        </CardHeader>
        <CardContent>
          <Tabs value={activeTab} onValueChange={setActiveTab as any} className="w-full">
            <TabsList className="grid w-full grid-cols-4">
              <TabsTrigger value="overview">Overview</TabsTrigger>
              <TabsTrigger value="keywords">Keywords</TabsTrigger>
              <TabsTrigger value="backlinks">Backlinks</TabsTrigger>
              <TabsTrigger value="gaps">Gap Analysis</TabsTrigger>
            </TabsList>

            <TabsContent value="overview" className="mt-6">
              <div className="space-y-6">
                <h3 className="text-lg font-semibold">Competitor Landscape</h3>
                <div className="rounded-md border">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Competitor</TableHead>
                        <TableHead>Overall Score</TableHead>
                        <TableHead>Domain Authority</TableHead>
                        <TableHead>Est. Traffic</TableHead>
                        <TableHead>Competitive Strength</TableHead>
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
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              </div>
            </TabsContent>

            <TabsContent value="keywords" className="mt-6">
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Keyword Gap Analysis</CardTitle>
                  <p className="text-sm text-muted-foreground">
                    Keywords where competitors rank better than you
                  </p>
                </CardHeader>
                <CardContent>
                  {safeAnalysis.keywordOpportunities.length ? (
                    <div className="rounded-md border">
                      <Table>
                        <TableHeader>
                          <TableRow>
                            <TableHead>Keyword</TableHead>
                            <TableHead>Competitor Position</TableHead>
                            <TableHead>Your Position</TableHead>
                            <TableHead>Search Volume</TableHead>
                            <TableHead>Difficulty</TableHead>
                            <TableHead>Competing With</TableHead>
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          {safeAnalysis.keywordOpportunities.map((opportunity, index) => (
                            <TableRow key={index}>
                              <TableCell>
                                <span className="font-medium">{opportunity.keyword}</span>
                              </TableCell>
                              <TableCell>
                                <Badge variant="outline" className="text-green-600">
                                  #{opportunity.competitorPosition}
                                </Badge>
                              </TableCell>
                              <TableCell>
                                <Badge variant="outline" className="text-red-600">
                                  {opportunity.ourPosition ? `#${opportunity.ourPosition}` : 'Not ranking'}
                                </Badge>
                              </TableCell>
                              <TableCell>
                                <span>{opportunity.searchVolume.toLocaleString()}</span>
                              </TableCell>
                              <TableCell>
                                <span className={opportunity.difficulty > 70 ? 'text-red-600' : opportunity.difficulty > 40 ? 'text-yellow-600' : 'text-green-600'}>
                                  {opportunity.difficulty}%
                                </span>
                              </TableCell>
                              <TableCell>
                                <span className="text-sm">{opportunity.competitor}</span>
                              </TableCell>
                            </TableRow>
                          ))}
                        </TableBody>
                      </Table>
                    </div>
                  ) : (
                    <div className="text-center py-8">
                      <Target className="h-8 w-8 text-gray-400 mx-auto mb-2" />
                      <p className="text-muted-foreground">No keyword gaps identified</p>
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
                  {safeAnalysis.backlinksGaps.length ? (
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
                          {safeAnalysis.backlinksGaps.map((gap, index) => (
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
                                <span className="text-red-600">
                                  -{(gap.competitorBacklinks - gap.ourBacklinks).toLocaleString()}
                                </span>
                              </TableCell>
                            </TableRow>
                          ))}
                        </TableBody>
                      </Table>
                    </div>
                  ) : (
                    <div className="text-center py-8">
                      <Target className="h-8 w-8 text-gray-400 mx-auto mb-2" />
                      <p className="text-muted-foreground">No backlink gaps identified</p>
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
                    {safeAnalysis.overallAnalysis.ourAdvantages.length ? (
                      <div className="space-y-3">
                        {safeAnalysis.overallAnalysis.ourAdvantages.map((advantage, index) => (
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
                    {safeAnalysis.overallAnalysis.competitorAdvantages.length ? (
                      <div className="space-y-3">
                        {safeAnalysis.overallAnalysis.competitorAdvantages.map((weakness, index) => (
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