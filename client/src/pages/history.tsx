import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { WebsiteHistoryPanel } from "@/components/website-history-panel";
import { Navigation } from "@/components/navigation";
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
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50 dark:from-gray-900 dark:via-gray-800 dark:to-blue-900">
        <Navigation />
        
        <main className="container mx-auto px-4 py-8">
          <div className="mb-6">
            <Button 
              variant="outline" 
              onClick={() => setSelectedWebsite(null)}
              className="mb-4"
            >
              ← Back to Websites
            </Button>
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
              {selectedWebsite.url} - SEO History
            </h1>
          </div>
          
          <WebsiteHistoryPanel website={selectedWebsite} />
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50 dark:from-gray-900 dark:via-gray-800 dark:to-blue-900">
      <Navigation />

      <main className="container mx-auto px-4 py-8">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-4 flex items-center justify-center">
            <ChartLine className="h-10 w-10 mr-3 text-blue-600" />
            Scan History
          </h1>
          <p className="text-xl text-gray-600 dark:text-gray-300">
            View detailed history and trends for all your analyzed websites
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
      </main>
    </div>
  );
}