import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Progress } from "@/components/ui/progress";
import { 
  ExternalLink, 
  TrendingUp, 
  Globe, 
  Link2, 
  Shield, 
  Eye,
  BarChart3,
  Filter,
  Plus
} from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { BacklinkImportDialog } from "./backlink-import-dialog";
import type { Website, Backlink } from "@shared/schema";

interface BacklinksDashboardProps {
  website: Website;
}

interface BacklinkStats {
  totalBacklinks: number;
  doFollowLinks: number;
  noFollowLinks: number;
  uniqueDomains: number;
  averageDomainAuthority: number;
}

export function BacklinksDashboard({ website }: BacklinksDashboardProps) {
  const [activeTab, setActiveTab] = useState<"overview" | "links" | "domains">("overview");

  const { data: backlinks = [], isLoading: backlinksLoading } = useQuery<Backlink[]>({
    queryKey: ['/api/websites', website.id, 'backlinks'],
    enabled: !!website.id,
  });

  const { data: stats, isLoading: statsLoading } = useQuery<BacklinkStats>({
    queryKey: ['/api/websites', website.id, 'backlinks', 'stats'],
    enabled: !!website.id,
  });

  const getLinkTypeColor = (linkType: string) => {
    switch (linkType) {
      case 'dofollow':
        return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200';
      case 'nofollow':
        return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200';
      case 'sponsored':
        return 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200';
      case 'ugc':
        return 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200';
      default:
        return 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200';
    }
  };

  const getDomainFromUrl = (url: string) => {
    try {
      return new URL(url).hostname;
    } catch {
      return url;
    }
  };

  const getAuthorityColor = (authority: number | null) => {
    if (!authority) return "text-gray-500";
    if (authority >= 70) return "text-green-600";
    if (authority >= 40) return "text-yellow-600";
    return "text-red-600";
  };

  const formatDate = (date: string | Date) => {
    return new Date(date).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    });
  };

  // Group backlinks by domain for domain analysis
  const domainGroups = backlinks.reduce((acc: Record<string, Backlink[]>, backlink: Backlink) => {
    const domain = getDomainFromUrl(backlink.sourceUrl);
    if (!acc[domain]) acc[domain] = [];
    acc[domain].push(backlink);
    return acc;
  }, {});

  const topDomains = Object.entries(domainGroups)
    .map(([domain, links]) => ({
      domain,
      count: links.length,
      averageDA: Math.round(
        links.filter((l: Backlink) => l.domainAuthority).reduce((sum: number, l: Backlink) => sum + (l.domainAuthority || 0), 0) / 
        Math.max(links.filter((l: Backlink) => l.domainAuthority).length, 1)
      ),
      doFollowCount: links.filter((l: Backlink) => l.linkType === 'dofollow').length
    }))
    .sort((a, b) => b.count - a.count)
    .slice(0, 10);

  if (backlinksLoading || statsLoading) {
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
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center">
              <Link2 className="h-5 w-5 text-primary mr-2" />
              <div>
                <p className="text-sm font-medium text-muted-foreground">Total Backlinks</p>
                <p className="text-2xl font-bold text-foreground">{stats?.totalBacklinks || 0}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center">
              <Globe className="h-5 w-5 text-secondary mr-2" />
              <div>
                <p className="text-sm font-medium text-muted-foreground">Unique Domains</p>
                <p className="text-2xl font-bold text-foreground">{stats?.uniqueDomains || 0}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center">
              <Shield className="h-5 w-5 text-green-600 mr-2" />
              <div>
                <p className="text-sm font-medium text-muted-foreground">DoFollow Links</p>
                <p className="text-2xl font-bold text-foreground">{stats?.doFollowLinks || 0}</p>
                <p className="text-xs text-muted-foreground">
                  {stats?.totalBacklinks ? Math.round((stats.doFollowLinks / stats.totalBacklinks) * 100) : 0}% of total
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center">
              <BarChart3 className="h-5 w-5 text-blue-600 mr-2" />
              <div>
                <p className="text-sm font-medium text-muted-foreground">Avg Domain Authority</p>
                <p className="text-2xl font-bold text-foreground">{stats?.averageDomainAuthority || 0}</p>
                <Progress 
                  value={stats?.averageDomainAuthority || 0} 
                  className="w-full mt-2 h-2"
                />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Backlinks Analysis */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="text-xl text-foreground flex items-center">
              <ExternalLink className="h-5 w-5 mr-2" />
              Backlinks Analysis
            </CardTitle>
            <div className="flex space-x-2">
              <Button variant="outline" size="sm">
                <Filter className="h-4 w-4 mr-2" />
                Filter
              </Button>
              <BacklinkImportDialog website={website} />
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <Tabs value={activeTab} onValueChange={(value) => setActiveTab(value as any)}>
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="overview">Overview</TabsTrigger>
              <TabsTrigger value="links">All Links ({backlinks.length})</TabsTrigger>
              <TabsTrigger value="domains">Top Domains</TabsTrigger>
            </TabsList>

            <TabsContent value="overview" className="space-y-6 mt-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Link Types Distribution */}
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">Link Types</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      <div className="flex justify-between items-center">
                        <span className="text-sm font-medium">DoFollow</span>
                        <Badge className={getLinkTypeColor('dofollow')}>
                          {stats?.doFollowLinks || 0}
                        </Badge>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-sm font-medium">NoFollow</span>
                        <Badge className={getLinkTypeColor('nofollow')}>
                          {stats?.noFollowLinks || 0}
                        </Badge>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* Recent Backlinks */}
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">Recent Links</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      {backlinks.slice(0, 5).map((backlink: Backlink) => (
                        <div key={backlink.id} className="flex items-center justify-between">
                          <div className="flex-1 min-w-0">
                            <p className="text-sm font-medium text-foreground truncate">
                              {getDomainFromUrl(backlink.sourceUrl)}
                            </p>
                            <p className="text-xs text-muted-foreground">
                              {formatDate(backlink.lastSeen)}
                            </p>
                          </div>
                          <Badge 
                            variant="outline" 
                            className={getLinkTypeColor(backlink.linkType)}
                          >
                            {backlink.linkType}
                          </Badge>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>

            <TabsContent value="links" className="mt-6">
              <div className="rounded-md border">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Source Domain</TableHead>
                      <TableHead>Target URL</TableHead>
                      <TableHead>Anchor Text</TableHead>
                      <TableHead>Link Type</TableHead>
                      <TableHead>Domain Authority</TableHead>
                      <TableHead>Last Seen</TableHead>
                      <TableHead>Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {backlinks.map((backlink: Backlink) => (
                      <TableRow key={backlink.id}>
                        <TableCell>
                          <div className="flex items-center">
                            <Globe className="h-4 w-4 mr-2 text-muted-foreground" />
                            <span className="font-medium">
                              {getDomainFromUrl(backlink.sourceUrl)}
                            </span>
                          </div>
                        </TableCell>
                        <TableCell>
                          <span className="text-sm text-muted-foreground truncate max-w-xs block">
                            {backlink.targetUrl}
                          </span>
                        </TableCell>
                        <TableCell>
                          <span className="text-sm">
                            {backlink.anchorText || 'No anchor text'}
                          </span>
                        </TableCell>
                        <TableCell>
                          <Badge className={getLinkTypeColor(backlink.linkType)}>
                            {backlink.linkType}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <span className={getAuthorityColor(backlink.domainAuthority)}>
                            {backlink.domainAuthority || 'N/A'}
                          </span>
                        </TableCell>
                        <TableCell>
                          <span className="text-sm text-muted-foreground">
                            {formatDate(backlink.lastSeen)}
                          </span>
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

            <TabsContent value="domains" className="mt-6">
              <div className="rounded-md border">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Domain</TableHead>
                      <TableHead>Total Links</TableHead>
                      <TableHead>DoFollow Links</TableHead>
                      <TableHead>Avg Domain Authority</TableHead>
                      <TableHead>Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {topDomains.map((domain) => (
                      <TableRow key={domain.domain}>
                        <TableCell>
                          <div className="flex items-center">
                            <Globe className="h-4 w-4 mr-2 text-muted-foreground" />
                            <span className="font-medium">{domain.domain}</span>
                          </div>
                        </TableCell>
                        <TableCell>
                          <Badge variant="outline">{domain.count}</Badge>
                        </TableCell>
                        <TableCell>
                          <Badge className={getLinkTypeColor('dofollow')}>
                            {domain.doFollowCount}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <span className={getAuthorityColor(domain.averageDA)}>
                            {domain.averageDA || 'N/A'}
                          </span>
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
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
}