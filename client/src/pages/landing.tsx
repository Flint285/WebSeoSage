import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Search, BarChart3, TrendingUp, Shield, Zap, Users } from "lucide-react";

export default function Landing() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50 dark:from-gray-900 dark:via-gray-800 dark:to-blue-900">
      {/* Header */}
      <header className="border-b bg-white/80 dark:bg-gray-900/80 backdrop-blur-sm sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4 flex justify-between items-center">
          <div className="flex items-center space-x-2">
            <Search className="h-8 w-8 text-blue-600 dark:text-blue-400" />
            <span className="text-2xl font-bold text-gray-900 dark:text-white">SEO Analyzer</span>
          </div>
          <Button 
            onClick={() => window.location.href = '/api/login'}
            className="bg-blue-600 hover:bg-blue-700 text-white"
          >
            Sign In
          </Button>
        </div>
      </header>

      {/* Hero Section */}
      <section className="py-20 px-4">
        <div className="container mx-auto text-center">
          <Badge variant="secondary" className="mb-4">
            Professional SEO Analysis Tool
          </Badge>
          <h1 className="text-5xl font-bold text-gray-900 dark:text-white mb-6">
            Optimize Your Website's
            <span className="text-blue-600 dark:text-blue-400"> SEO Performance</span>
          </h1>
          <p className="text-xl text-gray-600 dark:text-gray-300 mb-8 max-w-3xl mx-auto">
            Get comprehensive SEO analysis, track keyword rankings, monitor backlinks, 
            and analyze competitors. Everything you need to dominate search results.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button 
              size="lg" 
              onClick={() => window.location.href = '/api/login'}
              className="bg-blue-600 hover:bg-blue-700 text-white"
            >
              Get Started Free
            </Button>
            <Button 
              size="lg" 
              variant="outline"
              onClick={() => window.location.href = '/api/login'}
            >
              View Demo
            </Button>
          </div>
        </div>
      </section>

      {/* Features Grid */}
      <section className="py-16 px-4 bg-white/50 dark:bg-gray-800/50">
        <div className="container mx-auto">
          <h2 className="text-3xl font-bold text-center text-gray-900 dark:text-white mb-12">
            Powerful SEO Features
          </h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            <Card>
              <CardHeader>
                <BarChart3 className="h-10 w-10 text-blue-600 dark:text-blue-400 mb-4" />
                <CardTitle>Comprehensive Analysis</CardTitle>
                <CardDescription>
                  Get detailed technical, content, performance, and UX analysis with actionable insights.
                </CardDescription>
              </CardHeader>
            </Card>

            <Card>
              <CardHeader>
                <TrendingUp className="h-10 w-10 text-green-600 dark:text-green-400 mb-4" />
                <CardTitle>Keyword Tracking</CardTitle>
                <CardDescription>
                  Monitor your keyword rankings and track search position changes over time.
                </CardDescription>
              </CardHeader>
            </Card>

            <Card>
              <CardHeader>
                <Shield className="h-10 w-10 text-purple-600 dark:text-purple-400 mb-4" />
                <CardTitle>Backlink Monitoring</CardTitle>
                <CardDescription>
                  Track your backlink profile, domain authority, and link quality metrics.
                </CardDescription>
              </CardHeader>
            </Card>

            <Card>
              <CardHeader>
                <Users className="h-10 w-10 text-orange-600 dark:text-orange-400 mb-4" />
                <CardTitle>Competitor Analysis</CardTitle>
                <CardDescription>
                  Analyze competitors and discover keyword and backlink opportunities.
                </CardDescription>
              </CardHeader>
            </Card>

            <Card>
              <CardHeader>
                <Zap className="h-10 w-10 text-yellow-600 dark:text-yellow-400 mb-4" />
                <CardTitle>Real-time SERP Tracking</CardTitle>
                <CardDescription>
                  Monitor search engine ranking positions with automated tracking.
                </CardDescription>
              </CardHeader>
            </Card>

            <Card>
              <CardHeader>
                <Search className="h-10 w-10 text-indigo-600 dark:text-indigo-400 mb-4" />
                <CardTitle>Historical Data</CardTitle>
                <CardDescription>
                  Track SEO performance trends and compare historical analysis data.
                </CardDescription>
              </CardHeader>
            </Card>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-4">
        <div className="container mx-auto text-center">
          <h2 className="text-4xl font-bold text-gray-900 dark:text-white mb-6">
            Ready to Boost Your SEO?
          </h2>
          <p className="text-xl text-gray-600 dark:text-gray-300 mb-8 max-w-2xl mx-auto">
            Join thousands of marketers and website owners who trust our platform 
            to improve their search engine rankings.
          </p>
          <Button 
            size="lg" 
            onClick={() => window.location.href = '/api/login'}
            className="bg-blue-600 hover:bg-blue-700 text-white"
          >
            Start Your SEO Journey
          </Button>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t bg-white/80 dark:bg-gray-900/80 py-8 px-4">
        <div className="container mx-auto text-center text-gray-600 dark:text-gray-400">
          <p>&copy; 2025 SEO Analyzer. Built for serious SEO professionals.</p>
        </div>
      </footer>
    </div>
  );
}