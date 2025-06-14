import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Progress } from "@/components/ui/progress";
import { 
  Search, 
  TrendingUp, 
  TrendingDown, 
  Target, 
  BarChart3, 
  Eye,
  Filter,
  Plus,
  DollarSign,
  Zap,
  Crown
} from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import type { Website, Keyword } from "@shared/schema";

interface KeywordsDashboardProps {
  website: Website;
}

interface KeywordStats {
  totalKeywords: number;
  avgPosition: number;
  topRankingKeywords: number;
  improvingKeywords: number;
  decliningKeywords: number;
}

export function KeywordsDashboard({ website }: KeywordsDashboardProps) {
  const [activeTab, setActiveTab] = useState<"overview" | "keywords" | "opportunities">("overview");

  const { data: keywords = [], isLoading: keywordsLoading } = useQuery<Keyword[]>({
    queryKey: ['/api/websites', website.id, 'keywords'],
    enabled: !!website.id,
  });

  const { data: stats, isLoading: statsLoading } = useQuery<KeywordStats>({
    queryKey: ['/api/websites', website.id, 'keywords', 'stats'],
    enabled: !!website.id,
  });

  const getIntentColor = (intent: string | null) => {
    switch (intent) {
      case 'commercial':
        return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200';
      case 'transactional':
        return 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200';
      case 'informational':
        return 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200';
      case 'navigational':
        return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200';
      default:
        return 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200';
    }
  };

  const getDifficultyColor = (difficulty: number | null) => {
    if (!difficulty) return "text-gray-500";
    if (difficulty >= 80) return "text-red-600";
    if (difficulty >= 60) return "text-orange-600";
    if (difficulty >= 40) return "text-yellow-600";
    return "text-green-600";
  };

  const getDifficultyLabel = (difficulty: number | null) => {
    if (!difficulty) return "Unknown";
    if (difficulty >= 80) return "Very Hard";
    if (difficulty >= 60) return "Hard";
    if (difficulty >= 40) return "Medium";
    if (difficulty >= 20) return "Easy";
    return "Very Easy";
  };

  const formatSearchVolume = (volume: number | null) => {
    if (!volume) return "N/A";
    if (volume >= 1000000) return `${(volume / 1000000).toFixed(1)}M`;
    if (volume >= 1000) return `${(volume / 1000).toFixed(1)}K`;
    return volume.toString();
  };

  const formatCPC = (cpc: number | null) => {
    if (!cpc) return "N/A";
    return `$${cpc.toFixed(2)}`;
  };

  // Group keywords by intent for analysis
  const keywordsByIntent = keywords.reduce((acc: Record<string, Keyword[]>, keyword: Keyword) => {
    const intent = keyword.intent || 'unknown';
    if (!acc[intent]) acc[intent] = [];
    acc[intent].push(keyword);
    return acc;
  }, {});

  // High opportunity keywords (high volume, low difficulty)
  const opportunityKeywords = keywords.filter(k => 
    (k.searchVolume || 0) > 1000 && (k.difficulty || 100) < 50
  ).slice(0, 10);

  // High value keywords (high CPC)
  const highValueKeywords = keywords.filter(k => 
    (k.cpc || 0) > 2
  ).sort((a, b) => (b.cpc || 0) - (a.cpc || 0)).slice(0, 10);

  if (keywordsLoading || statsLoading) {
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
      {/* Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center">
              <Search className="h-5 w-5 text-primary mr-2" />
              <div>
                <p className="text-sm font-medium text-muted-foreground">Total Keywords</p>
                <p className="text-2xl font-bold text-foreground">{stats?.totalKeywords || 0}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center">
              <Target className="h-5 w-5 text-secondary mr-2" />
              <div>
                <p className="text-sm font-medium text-muted-foreground">Avg Position</p>
                <p className="text-2xl font-bold text-foreground">{stats?.avgPosition || 0}</p>
                <Progress 
                  value={stats?.avgPosition ? Math.max(0, 100 - stats.avgPosition) : 0} 
                  className="w-full mt-2 h-2"
                />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center">
              <Crown className="h-5 w-5 text-yellow-600 mr-2" />
              <div>
                <p className="text-sm font-medium text-muted-foreground">Top 10 Rankings</p>
                <p className="text-2xl font-bold text-foreground">{stats?.topRankingKeywords || 0}</p>
                <p className="text-xs text-muted-foreground">
                  {stats?.totalKeywords ? Math.round((stats.topRankingKeywords / stats.totalKeywords) * 100) : 0}% of total
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center">
              <TrendingUp className="h-5 w-5 text-green-600 mr-2" />
              <div>
                <p className="text-sm font-medium text-muted-foreground">Improving</p>
                <p className="text-2xl font-bold text-foreground">{stats?.improvingKeywords || 0}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center">
              <TrendingDown className="h-5 w-5 text-red-600 mr-2" />
              <div>
                <p className="text-sm font-medium text-muted-foreground">Declining</p>
                <p className="text-2xl font-bold text-foreground">{stats?.decliningKeywords || 0}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Keywords Analysis */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="text-xl text-foreground flex items-center">
              <Search className="h-5 w-5 mr-2" />
              Keywords Analysis
            </CardTitle>
            <div className="flex space-x-2">
              <Button variant="outline" size="sm">
                <Filter className="h-4 w-4 mr-2" />
                Filter
              </Button>
              <Button size="sm">
                <Plus className="h-4 w-4 mr-2" />
                Add Keywords
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <Tabs value={activeTab} onValueChange={(value) => setActiveTab(value as any)}>
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="overview">Overview</TabsTrigger>
              <TabsTrigger value="keywords">All Keywords ({keywords.length})</TabsTrigger>
              <TabsTrigger value="opportunities">Opportunities</TabsTrigger>
            </TabsList>

            <TabsContent value="overview" className="space-y-6 mt-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Intent Distribution */}
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">Search Intent</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      {Object.entries(keywordsByIntent).map(([intent, intentKeywords]) => (
                        <div key={intent} className="flex justify-between items-center">
                          <span className="text-sm font-medium capitalize">{intent}</span>
                          <Badge className={getIntentColor(intent)}>
                            {intentKeywords.length}
                          </Badge>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>

                {/* High Value Keywords */}
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">High Value Keywords</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      {highValueKeywords.slice(0, 5).map((keyword) => (
                        <div key={keyword.id} className="flex items-center justify-between">
                          <div className="flex-1 min-w-0">
                            <p className="text-sm font-medium text-foreground truncate">
                              {keyword.keyword}
                            </p>
                            <p className="text-xs text-muted-foreground">
                              {formatSearchVolume(keyword.searchVolume)} searches
                            </p>
                          </div>
                          <div className="flex items-center space-x-2">
                            <Badge variant="outline" className="text-green-600">
                              {formatCPC(keyword.cpc)}
                            </Badge>
                            <DollarSign className="h-4 w-4 text-green-600" />
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>

            <TabsContent value="keywords" className="mt-6">
              <div className="rounded-md border">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Keyword</TableHead>
                      <TableHead>Search Volume</TableHead>
                      <TableHead>Difficulty</TableHead>
                      <TableHead>CPC</TableHead>
                      <TableHead>Intent</TableHead>
                      <TableHead>Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {keywords.map((keyword: Keyword) => (
                      <TableRow key={keyword.id}>
                        <TableCell>
                          <div className="flex flex-col">
                            <span className="font-medium">{keyword.keyword}</span>
                            <span className="text-xs text-muted-foreground">
                              Added {new Date(keyword.createdAt).toLocaleDateString()}
                            </span>
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center">
                            <BarChart3 className="h-4 w-4 mr-2 text-muted-foreground" />
                            <span>{formatSearchVolume(keyword.searchVolume)}</span>
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center space-x-2">
                            <span className={getDifficultyColor(keyword.difficulty)}>
                              {keyword.difficulty || 'N/A'}
                            </span>
                            <Badge variant="outline" className={getDifficultyColor(keyword.difficulty)}>
                              {getDifficultyLabel(keyword.difficulty)}
                            </Badge>
                          </div>
                        </TableCell>
                        <TableCell>
                          <span className="font-medium">{formatCPC(keyword.cpc)}</span>
                        </TableCell>
                        <TableCell>
                          <Badge className={getIntentColor(keyword.intent)}>
                            {keyword.intent || 'Unknown'}
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
            </TabsContent>

            <TabsContent value="opportunities" className="mt-6">
              <div className="space-y-6">
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg flex items-center">
                      <Zap className="h-5 w-5 mr-2 text-yellow-500" />
                      High Opportunity Keywords
                    </CardTitle>
                    <p className="text-sm text-muted-foreground">
                      Keywords with high search volume and low competition
                    </p>
                  </CardHeader>
                  <CardContent>
                    <div className="rounded-md border">
                      <Table>
                        <TableHeader>
                          <TableRow>
                            <TableHead>Keyword</TableHead>
                            <TableHead>Search Volume</TableHead>
                            <TableHead>Difficulty</TableHead>
                            <TableHead>Opportunity Score</TableHead>
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          {opportunityKeywords.map((keyword) => {
                            const opportunityScore = Math.round(
                              ((keyword.searchVolume || 0) / 10000) * 
                              (100 - (keyword.difficulty || 100)) / 100 * 100
                            );
                            return (
                              <TableRow key={keyword.id}>
                                <TableCell>
                                  <span className="font-medium">{keyword.keyword}</span>
                                </TableCell>
                                <TableCell>
                                  <div className="flex items-center">
                                    <BarChart3 className="h-4 w-4 mr-2 text-muted-foreground" />
                                    <span>{formatSearchVolume(keyword.searchVolume)}</span>
                                  </div>
                                </TableCell>
                                <TableCell>
                                  <Badge variant="outline" className={getDifficultyColor(keyword.difficulty)}>
                                    {getDifficultyLabel(keyword.difficulty)}
                                  </Badge>
                                </TableCell>
                                <TableCell>
                                  <div className="flex items-center space-x-2">
                                    <Progress value={opportunityScore} className="w-16 h-2" />
                                    <span className="text-sm font-medium">{opportunityScore}%</span>
                                  </div>
                                </TableCell>
                              </TableRow>
                            );
                          })}
                        </TableBody>
                      </Table>
                    </div>
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