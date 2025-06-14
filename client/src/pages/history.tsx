import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { WebsiteHistoryPanel } from "@/components/website-history-panel";
import { ChartLine, Clock, Globe, TrendingUp } from "lucide-react";
import { Link } from "wouter";
import type { Website } from "@shared/schema";

export default function History() {
  const [selectedWebsite, setSelectedWebsite] = useState<Website | null>(null);

  const { data: websites = [] } = useQuery<Website[]>({
    queryKey: ["/api/websites"],
  });

  if (selectedWebsite) {
    return (
      <div className="min-h-screen bg-background">
        <header className="bg-white shadow-sm border-b border-gray-200">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between items-center h-16">
              <div className="flex items-center space-x-4">
                <Button 
                  variant="ghost" 
                  onClick={() => setSelectedWebsite(null)}
                  className="text-primary hover:text-primary/80"
                >
                  ← Back to Websites
                </Button>
              </div>
              <div className="text-2xl font-bold text-primary flex items-center">
                <ChartLine className="h-8 w-8 mr-2" />
                SEO History
              </div>
            </div>
          </div>
        </header>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <WebsiteHistoryPanel website={selectedWebsite} />
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <header className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="text-2xl font-bold text-primary flex items-center">
              <ChartLine className="h-8 w-8 mr-2" />
              SEO History & Tracking
            </div>
            <Button className="bg-primary text-primary-foreground hover:bg-blue-700">
              <TrendingUp className="h-4 w-4 mr-2" />
              View Analytics
            </Button>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-foreground mb-4">Website Performance Tracking</h1>
          <p className="text-muted-foreground text-lg">
            Monitor SEO score changes over time and track improvement progress for all analyzed websites.
          </p>
        </div>

        {websites.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {websites.map((website) => (
              <Card 
                key={website.id} 
                className="hover:shadow-lg transition-shadow cursor-pointer"
                onClick={() => setSelectedWebsite(website)}
              >
                <CardHeader className="pb-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <Globe className="h-5 w-5 text-primary" />
                      <CardTitle className="text-lg text-foreground truncate">
                        {website.domain}
                      </CardTitle>
                    </div>
                    {website.isActive && (
                      <Badge variant="default" className="bg-secondary">
                        Active
                      </Badge>
                    )}
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div className="text-sm text-muted-foreground truncate">
                      {website.url}
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-2 text-sm text-muted-foreground">
                        <Clock className="h-4 w-4" />
                        <span>
                          {website.lastScanned 
                            ? `Scanned ${new Date(website.lastScanned).toLocaleDateString()}`
                            : "Never scanned"
                          }
                        </span>
                      </div>
                    </div>
                    
                    <div className="pt-2">
                      <Button 
                        variant="outline" 
                        size="sm" 
                        className="w-full"
                        onClick={(e) => {
                          e.stopPropagation();
                          setSelectedWebsite(website);
                        }}
                      >
                        View History
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        ) : (
          <Card>
            <CardContent className="p-12 text-center">
              <ChartLine className="h-16 w-16 text-gray-400 mx-auto mb-6" />
              <h3 className="text-xl font-semibold text-foreground mb-4">No Websites Tracked Yet</h3>
              <p className="text-muted-foreground mb-6 max-w-md mx-auto">
                Start analyzing websites to track their SEO performance over time. Each analysis will be saved and you can monitor improvements.
              </p>
              <Link href="/">
                <Button className="bg-primary text-primary-foreground hover:bg-blue-700">
                  <Globe className="h-4 w-4 mr-2" />
                  Analyze Your First Website
                </Button>
              </Link>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}