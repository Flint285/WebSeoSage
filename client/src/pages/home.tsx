import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { useAuth } from "@/hooks/useAuth";
import { Navigation } from "@/components/navigation";
import { FirstTimeUserGuide, NoWebsitesState } from "@/components/empty-states";
import { PageLoader, DashboardSkeleton } from "@/components/loading-states";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { BarChart3, Search, TrendingUp, Globe, Plus, Clock, CheckCircle } from "lucide-react";
import { Link } from "wouter";
import type { Website } from "@shared/schema";

export default function Home() {
  const { user, isLoading } = useAuth();
  
  const { data: websites = [], isLoading: websitesLoading } = useQuery<Website[]>({
    queryKey: ["/api/websites"],
    enabled: !!user,
  });

  if (isLoading) {
    return <PageLoader />;
  }

  const isFirstTimeUser = websites.length === 0;
  const recentWebsites = websites.slice(0, 3);

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50 dark:from-gray-900 dark:via-gray-800 dark:to-blue-900">
      <Navigation />

      {/* Main Content */}
      <main className="container mx-auto px-4 py-8">
        {/* Welcome Section */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-2">
            Welcome back, {user?.firstName || "there"}!
          </h1>
          <p className="text-lg text-gray-600 dark:text-gray-300">
            {isFirstTimeUser 
              ? "Let's get started with your first SEO analysis" 
              : "Ready to analyze your website's SEO performance?"
            }
          </p>
        </div>

        {/* First Time User Guide */}
        {isFirstTimeUser && (
          <div className="mb-8">
            <FirstTimeUserGuide />
          </div>
        )}

        {/* Recent Websites */}
        {!isFirstTimeUser && (
          <div className="mb-8">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Recent Websites</h2>
              <Link href="/history">
                <Button variant="outline" size="sm">
                  View All
                </Button>
              </Link>
            </div>
            <div className="grid md:grid-cols-3 gap-4">
              {recentWebsites.map((website) => (
                <Card key={website.id} className="hover:shadow-lg transition-shadow">
                  <CardContent className="p-4">
                    <div className="flex items-center justify-between mb-2">
                      <h3 className="font-semibold text-gray-900 dark:text-white truncate">
                        {new URL(website.url).hostname}
                      </h3>
                      <Badge variant="secondary" className="text-xs">
                        {website.scanFrequency || "Manual"}
                      </Badge>
                    </div>
                    <p className="text-sm text-gray-600 dark:text-gray-300 mb-3">
                      Last scanned: {website.lastScanAt 
                        ? new Date(website.lastScanAt).toLocaleDateString()
                        : "Never"
                      }
                    </p>
                    <Link href="/history">
                      <Button variant="outline" size="sm" className="w-full">
                        View Details
                      </Button>
                    </Link>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        )}

        {/* Quick Actions */}
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <Link href="/dashboard">
            <Card className="hover:shadow-lg transition-all cursor-pointer group hover:scale-105">
              <CardHeader className="pb-2">
                <div className="flex items-center justify-between">
                  <Search className="h-8 w-8 text-blue-600 dark:text-blue-400 group-hover:text-blue-700" />
                  <Badge variant="secondary">Start Here</Badge>
                </div>
              </CardHeader>
              <CardContent>
                <CardTitle className="text-lg mb-1">New Analysis</CardTitle>
                <CardDescription>
                  {isFirstTimeUser ? "Start with your first SEO analysis" : "Analyze a website's SEO performance"}
                </CardDescription>
              </CardContent>
            </Card>
          </Link>

          <Link href="/analytics">
            <Card className="hover:shadow-lg transition-all cursor-pointer group hover:scale-105">
              <CardHeader className="pb-2">
                <BarChart3 className="h-8 w-8 text-green-600 dark:text-green-400 group-hover:text-green-700" />
              </CardHeader>
              <CardContent>
                <CardTitle className="text-lg mb-1">Advanced Analytics</CardTitle>
                <CardDescription>
                  Comprehensive SEO insights and data visualization
                </CardDescription>
              </CardContent>
            </Card>
          </Link>

          <Link href="/history">
            <Card className="hover:shadow-lg transition-all cursor-pointer group hover:scale-105">
              <CardHeader className="pb-2">
                <TrendingUp className="h-8 w-8 text-purple-600 dark:text-purple-400 group-hover:text-purple-700" />
              </CardHeader>
              <CardContent>
                <CardTitle className="text-lg mb-1">Track Keywords</CardTitle>
                <CardDescription>
                  Monitor keyword rankings and performance
                </CardDescription>
              </CardContent>
            </Card>
          </Link>

          <Link href="/history">
            <Card className="hover:shadow-lg transition-all cursor-pointer group hover:scale-105">
              <CardHeader className="pb-2">
                <Globe className="h-8 w-8 text-orange-600 dark:text-orange-400 group-hover:text-orange-700" />
              </CardHeader>
              <CardContent>
                <CardTitle className="text-lg mb-1">Competitors</CardTitle>
                <CardDescription>
                  Analyze competitor SEO strategies
                </CardDescription>
              </CardContent>
            </Card>
          </Link>
        </div>

        {/* Features Overview */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="text-2xl">Your SEO Dashboard</CardTitle>
            <CardDescription>
              Comprehensive tools to improve your website's search engine performance
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <h3 className="font-semibold text-lg mb-3 text-gray-900 dark:text-white">
                  SEO Analysis Features
                </h3>
                <ul className="space-y-2 text-gray-600 dark:text-gray-300">
                  <li>• Technical SEO audits and recommendations</li>
                  <li>• Content analysis and optimization tips</li>
                  <li>• Performance metrics and page speed analysis</li>
                  <li>• User experience evaluation</li>
                </ul>
              </div>
              <div>
                <h3 className="font-semibold text-lg mb-3 text-gray-900 dark:text-white">
                  Advanced Tracking
                </h3>
                <ul className="space-y-2 text-gray-600 dark:text-gray-300">
                  <li>• Real-time keyword ranking monitoring</li>
                  <li>• Backlink profile analysis</li>
                  <li>• Competitor intelligence and gap analysis</li>
                  <li>• Historical performance trends</li>
                </ul>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* CTA Section */}
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
            Ready to Get Started?
          </h2>
          <p className="text-gray-600 dark:text-gray-300 mb-6">
            Analyze your first website or explore your existing reports
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/dashboard">
              <Button size="lg" className="bg-blue-600 hover:bg-blue-700 text-white">
                <Plus className="h-5 w-5 mr-2" />
                Analyze Website
              </Button>
            </Link>
            <Link href="/history">
              <Button size="lg" variant="outline">
                <BarChart3 className="h-5 w-5 mr-2" />
                View Reports
              </Button>
            </Link>
          </div>
        </div>
      </main>
    </div>
  );
}