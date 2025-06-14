import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Progress } from "@/components/ui/progress";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";
import { 
  TrendingUp, 
  TrendingDown, 
  RefreshCw, 
  Eye,
  Target,
  Clock,
  AlertTriangle,
  CheckCircle
} from "lucide-react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";
import type { Website, Keyword, KeywordRanking } from "@shared/schema";

interface RankTrackerProps {
  website: Website;
}

interface TrackingResult {
  tracked: number;
  errors: number;
  results: Array<{
    keywordId: number;
    keyword: string;
    position: number | null;
    url: string | null;
  }>;
}

export function RankTracker({ website }: RankTrackerProps) {
  const [isTracking, setIsTracking] = useState(false);
  const [trackingProgress, setTrackingProgress] = useState(0);
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const { data: keywords = [], isLoading: keywordsLoading } = useQuery<Keyword[]>({
    queryKey: ['/api/websites', website.id, 'keywords'],
    enabled: !!website.id,
  });

  // Track all keywords mutation
  const trackAllMutation = useMutation({
    mutationFn: async (): Promise<TrackingResult> => {
      const response = await apiRequest("POST", `/api/websites/${website.id}/track-rankings`);
      return await response.json();
    },
    onSuccess: (data: TrackingResult) => {
      queryClient.invalidateQueries({ queryKey: ['/api/websites', website.id, 'keywords'] });
      queryClient.invalidateQueries({ queryKey: ['/api/keywords'] });
      
      toast({
        title: "Rank Tracking Complete",
        description: `Tracked ${data.tracked} keywords, ${data.errors} errors`,
      });
      setIsTracking(false);
      setTrackingProgress(0);
    },
    onError: () => {
      toast({
        title: "Tracking Failed",
        description: "Failed to track keyword rankings",
        variant: "destructive",
      });
      setIsTracking(false);
      setTrackingProgress(0);
    },
  });

  // Track single keyword mutation
  const trackSingleMutation = useMutation({
    mutationFn: async (keywordId: number) => {
      const response = await apiRequest("POST", `/api/keywords/${keywordId}/track`);
      return await response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/websites', website.id, 'keywords'] });
      queryClient.invalidateQueries({ queryKey: ['/api/keywords'] });
      
      toast({
        title: "Position Updated",
        description: "Keyword ranking has been updated",
      });
    },
    onError: () => {
      toast({
        title: "Tracking Failed",
        description: "Failed to track keyword ranking",
        variant: "destructive",
      });
    },
  });

  const handleTrackAll = async () => {
    if (keywords.length === 0) {
      toast({
        title: "No Keywords",
        description: "Add keywords first to track rankings",
        variant: "destructive",
      });
      return;
    }

    setIsTracking(true);
    setTrackingProgress(0);

    // Simulate progress updates
    const progressInterval = setInterval(() => {
      setTrackingProgress(prev => {
        if (prev >= 90) {
          clearInterval(progressInterval);
          return prev;
        }
        return prev + (100 / keywords.length) * 0.5;
      });
    }, 2000);

    try {
      await trackAllMutation.mutateAsync();
      clearInterval(progressInterval);
      setTrackingProgress(100);
    } catch (error) {
      clearInterval(progressInterval);
    }
  };

  const handleTrackSingle = async (keywordId: number) => {
    await trackSingleMutation.mutateAsync(keywordId);
  };

  const getPositionChangeIcon = (currentPos: number | null, previousPos: number | null) => {
    if (!currentPos || !previousPos) return null;
    
    if (currentPos < previousPos) {
      return <TrendingUp className="h-4 w-4 text-green-600" />;
    } else if (currentPos > previousPos) {
      return <TrendingDown className="h-4 w-4 text-red-600" />;
    }
    return null;
  };

  const getPositionBadgeColor = (position: number | null) => {
    if (!position) return "bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200";
    if (position <= 3) return "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200";
    if (position <= 10) return "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200";
    if (position <= 20) return "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200";
    return "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200";
  };

  // Mock ranking history data for visualization
  const getRankingHistory = (keyword: Keyword) => {
    // In a real implementation, this would fetch actual ranking history
    const history = [];
    const today = new Date();
    
    for (let i = 6; i >= 0; i--) {
      const date = new Date(today);
      date.setDate(date.getDate() - i);
      
      // Generate mock position data with some trend
      const basePosition = Math.floor(Math.random() * 50) + 1;
      const variation = Math.floor(Math.random() * 10) - 5;
      const position = Math.max(1, Math.min(100, basePosition + variation));
      
      history.push({
        date: date.toISOString().split('T')[0],
        position: position
      });
    }
    
    return history;
  };

  if (keywordsLoading) {
    return (
      <div className="space-y-6">
        <div className="animate-pulse">
          <div className="h-8 bg-gray-200 rounded w-1/4 mb-4"></div>
          <div className="h-64 bg-gray-200 rounded"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Tracking Controls */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="text-xl text-foreground flex items-center">
              <Target className="h-5 w-5 mr-2" />
              SERP Position Tracking
            </CardTitle>
            <div className="flex space-x-2">
              <Button 
                onClick={handleTrackAll}
                disabled={isTracking || keywords.length === 0}
                size="sm"
              >
                {isTracking ? (
                  <>
                    <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
                    Tracking...
                  </>
                ) : (
                  <>
                    <RefreshCw className="h-4 w-4 mr-2" />
                    Track All ({keywords.length})
                  </>
                )}
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          {isTracking && (
            <div className="space-y-2">
              <div className="flex items-center justify-between text-sm">
                <span>Checking keyword positions...</span>
                <span>{Math.round(trackingProgress)}%</span>
              </div>
              <Progress value={trackingProgress} className="w-full" />
            </div>
          )}
        </CardContent>
      </Card>

      {/* Keywords Ranking Table */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Keyword Rankings</CardTitle>
        </CardHeader>
        <CardContent>
          {keywords.length > 0 ? (
            <div className="rounded-md border">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Keyword</TableHead>
                    <TableHead>Current Position</TableHead>
                    <TableHead>Ranking Trend</TableHead>
                    <TableHead>Search Volume</TableHead>
                    <TableHead>Last Checked</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {keywords.map((keyword) => {
                    // Mock current position - in real implementation, get from latest ranking
                    const currentPosition = Math.floor(Math.random() * 50) + 1;
                    const previousPosition = currentPosition + Math.floor(Math.random() * 10) - 5;
                    
                    return (
                      <TableRow key={keyword.id}>
                        <TableCell>
                          <div className="flex flex-col">
                            <span className="font-medium">{keyword.keyword}</span>
                            <Badge className={getPositionBadgeColor(keyword.intent === 'commercial' ? 8 : 15)}>
                              {keyword.intent || 'Unknown'}
                            </Badge>
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center space-x-2">
                            <Badge className={getPositionBadgeColor(currentPosition)}>
                              {currentPosition ? `#${currentPosition}` : 'Not ranked'}
                            </Badge>
                            {currentPosition <= 10 && (
                              <CheckCircle className="h-4 w-4 text-green-600" />
                            )}
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center space-x-2">
                            {getPositionChangeIcon(currentPosition, previousPosition)}
                            <span className="text-sm text-muted-foreground">
                              {currentPosition && previousPosition ? 
                                Math.abs(currentPosition - previousPosition) : 0} positions
                            </span>
                          </div>
                        </TableCell>
                        <TableCell>
                          <span className="text-sm">
                            {keyword.searchVolume ? keyword.searchVolume.toLocaleString() : 'N/A'}
                          </span>
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center space-x-1 text-sm text-muted-foreground">
                            <Clock className="h-3 w-3" />
                            <span>Never</span>
                          </div>
                        </TableCell>
                        <TableCell>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleTrackSingle(keyword.id)}
                            disabled={trackSingleMutation.isPending}
                          >
                            {trackSingleMutation.isPending ? (
                              <RefreshCw className="h-4 w-4 animate-spin" />
                            ) : (
                              <Eye className="h-4 w-4" />
                            )}
                          </Button>
                        </TableCell>
                      </TableRow>
                    );
                  })}
                </TableBody>
              </Table>
            </div>
          ) : (
            <div className="text-center py-12">
              <AlertTriangle className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-foreground mb-2">No Keywords to Track</h3>
              <p className="text-muted-foreground mb-4">
                Add keywords to your website to start tracking their search rankings.
              </p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Ranking History Charts */}
      {keywords.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {keywords.slice(0, 4).map((keyword) => {
            const historyData = getRankingHistory(keyword);
            
            return (
              <Card key={keyword.id}>
                <CardHeader>
                  <CardTitle className="text-sm font-medium truncate">
                    {keyword.keyword}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="h-48">
                    <ResponsiveContainer width="100%" height="100%">
                      <LineChart data={historyData}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="date" fontSize={12} />
                        <YAxis 
                          domain={[1, 100]} 
                          reversed 
                          fontSize={12}
                          tickFormatter={(value) => `#${value}`}
                        />
                        <Tooltip 
                          formatter={(value: number) => [`#${value}`, 'Position']}
                          labelFormatter={(label) => `Date: ${label}`}
                        />
                        <Line 
                          type="monotone" 
                          dataKey="position" 
                          stroke="#0066CC" 
                          strokeWidth={2}
                          dot={{ fill: '#0066CC', strokeWidth: 2, r: 4 }}
                        />
                      </LineChart>
                    </ResponsiveContainer>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      )}
    </div>
  );
}