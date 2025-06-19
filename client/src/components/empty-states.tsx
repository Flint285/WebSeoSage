import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { 
  Search, 
  BarChart3, 
  TrendingUp, 
  Globe, 
  Plus,
  Eye,
  Users,
  Link as LinkIcon,
  Target,
  FileText
} from "lucide-react";
import { Link } from "wouter";

interface EmptyStateProps {
  title: string;
  description: string;
  action?: {
    label: string;
    href?: string;
    onClick?: () => void;
  };
  icon?: React.ComponentType<{ className?: string }>;
}

export function EmptyState({ title, description, action, icon: Icon = Eye }: EmptyStateProps) {
  return (
    <Card>
      <CardContent className="p-12 text-center">
        <Icon className="h-16 w-16 text-gray-400 dark:text-gray-600 mx-auto mb-6" />
        <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">
          {title}
        </h3>
        <p className="text-gray-600 dark:text-gray-300 mb-6 max-w-md mx-auto">
          {description}
        </p>
        {action && (
          action.href ? (
            <Link href={action.href}>
              <Button className="bg-blue-600 hover:bg-blue-700 text-white">
                <Plus className="h-4 w-4 mr-2" />
                {action.label}
              </Button>
            </Link>
          ) : (
            <Button 
              onClick={action.onClick}
              className="bg-blue-600 hover:bg-blue-700 text-white"
            >
              <Plus className="h-4 w-4 mr-2" />
              {action.label}
            </Button>
          )
        )}
      </CardContent>
    </Card>
  );
}

export function NoWebsitesState() {
  return (
    <EmptyState
      icon={Search}
      title="No Websites Added Yet"
      description="Start by analyzing your first website to get comprehensive SEO insights and track performance over time."
      action={{
        label: "Analyze First Website",
        href: "/dashboard"
      }}
    />
  );
}

export function NoAnalyticsState() {
  return (
    <EmptyState
      icon={BarChart3}
      title="No Analytics Data Available"
      description="Add websites and run analyses to see your SEO performance analytics with detailed insights and trends."
      action={{
        label: "Start Analysis",
        href: "/dashboard"
      }}
    />
  );
}

export function NoKeywordsState({ websiteId }: { websiteId: number }) {
  return (
    <EmptyState
      icon={Target}
      title="No Keywords Added"
      description="Start tracking keyword rankings by adding the keywords you want to monitor for this website."
      action={{
        label: "Add Keywords",
        onClick: () => {
          // This would trigger the keyword import dialog
          console.log('Open keyword import dialog for website', websiteId);
        }
      }}
    />
  );
}

export function NoBacklinksState({ websiteId }: { websiteId: number }) {
  return (
    <EmptyState
      icon={LinkIcon}
      title="No Backlinks Tracked"
      description="Monitor your backlink profile by adding the backlinks you want to track for domain authority and performance."
      action={{
        label: "Add Backlinks",
        onClick: () => {
          console.log('Open backlink import dialog for website', websiteId);
        }
      }}
    />
  );
}

export function NoCompetitorsState({ websiteId }: { websiteId: number }) {
  return (
    <EmptyState
      icon={Users}
      title="No Competitors Added"
      description="Analyze your competitive landscape by adding competitors to identify keyword and backlink opportunities."
      action={{
        label: "Add Competitors",
        onClick: () => {
          console.log('Open competitor import dialog for website', websiteId);
        }
      }}
    />
  );
}

export function FirstTimeUserGuide() {
  return (
    <Card className="bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20 border-blue-200 dark:border-blue-800">
      <CardHeader>
        <CardTitle className="flex items-center space-x-2 text-blue-900 dark:text-blue-100">
          <Search className="h-6 w-6" />
          <span>Welcome to SEO Analyzer!</span>
        </CardTitle>
        <CardDescription className="text-blue-700 dark:text-blue-200">
          Get started with professional SEO analysis in just a few steps
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="grid md:grid-cols-3 gap-4">
          <div className="text-center p-4">
            <div className="bg-blue-100 dark:bg-blue-900 rounded-full w-12 h-12 flex items-center justify-center mx-auto mb-3">
              <Search className="h-6 w-6 text-blue-600 dark:text-blue-400" />
            </div>
            <h4 className="font-semibold text-blue-900 dark:text-blue-100 mb-2">1. Analyze Website</h4>
            <p className="text-sm text-blue-700 dark:text-blue-200">
              Enter your website URL for comprehensive SEO analysis
            </p>
          </div>
          
          <div className="text-center p-4">
            <div className="bg-green-100 dark:bg-green-900 rounded-full w-12 h-12 flex items-center justify-center mx-auto mb-3">
              <TrendingUp className="h-6 w-6 text-green-600 dark:text-green-400" />
            </div>
            <h4 className="font-semibold text-blue-900 dark:text-blue-100 mb-2">2. Track Keywords</h4>
            <p className="text-sm text-blue-700 dark:text-blue-200">
              Monitor your keyword rankings and performance
            </p>
          </div>
          
          <div className="text-center p-4">
            <div className="bg-purple-100 dark:bg-purple-900 rounded-full w-12 h-12 flex items-center justify-center mx-auto mb-3">
              <BarChart3 className="h-6 w-6 text-purple-600 dark:text-purple-400" />
            </div>
            <h4 className="font-semibold text-blue-900 dark:text-blue-100 mb-2">3. View Analytics</h4>
            <p className="text-sm text-blue-700 dark:text-blue-200">
              Get detailed insights and performance trends
            </p>
          </div>
        </div>
        
        <div className="text-center mt-6">
          <Link href="/dashboard">
            <Button className="bg-blue-600 hover:bg-blue-700 text-white">
              <Search className="h-4 w-4 mr-2" />
              Start Your First Analysis
            </Button>
          </Link>
        </div>
      </CardContent>
    </Card>
  );
}

export function LoadingError({ 
  message = "Something went wrong", 
  onRetry 
}: { 
  message?: string; 
  onRetry?: () => void; 
}) {
  return (
    <Card className="border-red-200 dark:border-red-800">
      <CardContent className="p-8 text-center">
        <div className="text-red-500 dark:text-red-400 mb-4">
          <FileText className="h-12 w-12 mx-auto" />
        </div>
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
          Unable to Load Data
        </h3>
        <p className="text-gray-600 dark:text-gray-300 mb-4">
          {message}
        </p>
        {onRetry && (
          <Button onClick={onRetry} variant="outline">
            Try Again
          </Button>
        )}
      </CardContent>
    </Card>
  );
}