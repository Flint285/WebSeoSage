import { useState } from "react";
import { useAuth } from "@/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { BarChart3, Search, TrendingUp, Globe, LogOut, Plus } from "lucide-react";
import { Link } from "wouter";

export default function Home() {
  const { user, isLoading } = useAuth();
  const [isAnalyzing, setIsAnalyzing] = useState(false);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  const handleLogout = () => {
    window.location.href = '/api/logout';
  };

  const getInitials = (firstName?: string | null, lastName?: string | null) => {
    if (!firstName && !lastName) return "U";
    return `${firstName?.[0] || ""}${lastName?.[0] || ""}`.toUpperCase();
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50 dark:from-gray-900 dark:via-gray-800 dark:to-blue-900">
      {/* Header */}
      <header className="border-b bg-white/80 dark:bg-gray-900/80 backdrop-blur-sm sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4 flex justify-between items-center">
          <div className="flex items-center space-x-2">
            <Search className="h-8 w-8 text-blue-600 dark:text-blue-400" />
            <span className="text-2xl font-bold text-gray-900 dark:text-white">SEO Analyzer</span>
          </div>
          
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-2">
              <Avatar className="h-8 w-8">
                <AvatarImage src={user?.profileImageUrl || ""} alt={user?.firstName || "User"} />
                <AvatarFallback>{getInitials(user?.firstName, user?.lastName)}</AvatarFallback>
              </Avatar>
              <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                {user?.firstName || user?.email}
              </span>
            </div>
            <Button 
              variant="outline"
              size="sm"
              onClick={handleLogout}
            >
              <LogOut className="h-4 w-4 mr-2" />
              Sign Out
            </Button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-8">
        {/* Welcome Section */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-2">
            Welcome back, {user?.firstName || "there"}!
          </h1>
          <p className="text-lg text-gray-600 dark:text-gray-300">
            Ready to analyze your website's SEO performance?
          </p>
        </div>

        {/* Quick Actions */}
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <Card className="hover:shadow-lg transition-shadow cursor-pointer">
            <Link href="/dashboard">
              <CardHeader className="pb-2">
                <div className="flex items-center justify-between">
                  <Search className="h-8 w-8 text-blue-600 dark:text-blue-400" />
                  <Badge variant="secondary">New</Badge>
                </div>
              </CardHeader>
              <CardContent>
                <CardTitle className="text-lg mb-1">New Analysis</CardTitle>
                <CardDescription>
                  Analyze a website's SEO performance
                </CardDescription>
              </CardContent>
            </Link>
          </Card>

          <Card className="hover:shadow-lg transition-shadow cursor-pointer">
            <Link href="/history">
              <CardHeader className="pb-2">
                <BarChart3 className="h-8 w-8 text-green-600 dark:text-green-400" />
              </CardHeader>
              <CardContent>
                <CardTitle className="text-lg mb-1">View Reports</CardTitle>
                <CardDescription>
                  Access your previous analyses and reports
                </CardDescription>
              </CardContent>
            </Link>
          </Card>

          <Card className="hover:shadow-lg transition-shadow cursor-pointer">
            <Link href="/history">
              <CardHeader className="pb-2">
                <TrendingUp className="h-8 w-8 text-purple-600 dark:text-purple-400" />
              </CardHeader>
              <CardContent>
                <CardTitle className="text-lg mb-1">Track Keywords</CardTitle>
                <CardDescription>
                  Monitor keyword rankings and performance
                </CardDescription>
              </CardContent>
            </Link>
          </Card>

          <Card className="hover:shadow-lg transition-shadow cursor-pointer">
            <Link href="/history">
              <CardHeader className="pb-2">
                <Globe className="h-8 w-8 text-orange-600 dark:text-orange-400" />
              </CardHeader>
              <CardContent>
                <CardTitle className="text-lg mb-1">Competitors</CardTitle>
                <CardDescription>
                  Analyze competitor SEO strategies
                </CardDescription>
              </CardContent>
            </Link>
          </Card>
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