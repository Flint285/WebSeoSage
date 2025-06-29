import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";

import { 
  Shield, 
  Lock, 
  Globe, 
  Image, 
  Link, 
  Code, 
  Smartphone, 
  Search,
  AlertTriangle,
  CheckCircle,
  XCircle,
  TrendingUp,
  BarChart3,
  Eye
} from "lucide-react";
import { MetricCard } from "@/components/ui/metric-card";
import { StatusIndicator } from "@/components/ui/status-indicator";
import { TooltipInfo } from "@/components/ui/tooltip-info";
import { FadeIn, SlideIn } from "@/components/ui/micro-animations";
import type { SeoAnalysis, TechnicalCheck } from "@shared/schema";

interface TechnicalSeoDashboardProps {
  analysis: SeoAnalysis;
  className?: string;
}

export function TechnicalSeoDashboard({ analysis, className }: TechnicalSeoDashboardProps) {
  const technicalChecks = Array.isArray(analysis.technicalChecks) ? analysis.technicalChecks : [];
  const contentAnalysis = analysis.contentAnalysis || {};
  
  // Calculate technical scores
  const totalChecks = technicalChecks.length;
  const passedChecks = technicalChecks.filter((check: any) => check.status === 'passed').length;
  const warningChecks = technicalChecks.filter((check: any) => check.status === 'warning').length;
  const failedChecks = technicalChecks.filter((check: any) => check.status === 'failed').length;
  
  const technicalScore = totalChecks > 0 ? Math.round((passedChecks / totalChecks) * 100) : 0;
  
  // Group checks by category
  const securityChecks = technicalChecks.filter((check: any) => 
    ['https-security', 'security-headers'].includes(check.id)
  );
  
  const metaChecks = technicalChecks.filter((check: any) => 
    ['title-tag', 'meta-description', 'canonical-url', 'open-graph', 'twitter-cards'].includes(check.id)
  );
  
  const structureChecks = technicalChecks.filter((check: any) => 
    ['heading-structure', 'schema-markup', 'internal-linking'].includes(check.id)
  );
  
  const performanceChecks = technicalChecks.filter((check: any) => 
    ['page-speed', 'image-optimization', 'mobile-responsive'].includes(check.id)
  );
  
  const technicalFoundationChecks = technicalChecks.filter((check: any) => 
    ['robots-txt', 'xml-sitemap', 'language-declaration'].includes(check.id)
  );

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'passed': return CheckCircle;
      case 'warning': return AlertTriangle;
      case 'failed': return XCircle;
      default: return AlertTriangle;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'passed': return 'text-green-600 dark:text-green-400';
      case 'warning': return 'text-yellow-600 dark:text-yellow-400';
      case 'failed': return 'text-red-600 dark:text-red-400';
      default: return 'text-gray-600 dark:text-gray-400';
    }
  };

  const renderCheckGroup = (checks: TechnicalCheck[], title: string, icon: React.ComponentType<{ className?: string }>, delay: number) => {
    const Icon = icon;
    const groupPassed = checks.filter(c => c.status === 'passed').length;
    const groupTotal = checks.length;
    const groupScore = groupTotal > 0 ? Math.round((groupPassed / groupTotal) * 100) : 0;
    
    return (
      <FadeIn delay={delay}>
        <Card className="hover:shadow-lg transition-all duration-300">
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <div className="p-2 bg-blue-100 dark:bg-blue-900/20 rounded-full">
                  <Icon className="h-5 w-5 text-blue-600 dark:text-blue-400" />
                </div>
                <CardTitle className="text-lg">{title}</CardTitle>
              </div>
              <div className="flex items-center space-x-2">
                <Badge variant={groupScore >= 80 ? "default" : groupScore >= 60 ? "secondary" : "destructive"}>
                  {groupScore}%
                </Badge>
                <TooltipInfo content={`${groupPassed}/${groupTotal} checks passed`} />
              </div>
            </div>
          </CardHeader>
          <CardContent className="space-y-3">
            {checks.map((check, index) => {
              const StatusIcon = getStatusIcon(check.status);
              return (
                <div key={check.id} className="flex items-center justify-between p-3 rounded-lg bg-gray-50 dark:bg-gray-800/50 hover:bg-gray-100 dark:hover:bg-gray-700/50 transition-all duration-200 border border-transparent hover:border-gray-200 dark:hover:border-gray-600">
                  <div className="flex items-center space-x-3">
                    <div className="relative">
                      <StatusIcon className={`h-4 w-4 ${getStatusColor(check.status)}`} />
                      {check.status === 'passed' && (
                        <div className="absolute -inset-1 bg-green-100 dark:bg-green-900/20 rounded-full opacity-20"></div>
                      )}
                      {check.status === 'failed' && (
                        <div className="absolute -inset-1 bg-red-100 dark:bg-red-900/20 rounded-full opacity-20"></div>
                      )}
                    </div>
                    <div>
                      <p className="font-medium text-sm text-gray-900 dark:text-white">{check.name}</p>
                      <p className="text-xs text-gray-600 dark:text-gray-400">{check.value}</p>
                    </div>
                  </div>
                  <Badge 
                    variant={check.impact === 'high' ? 'destructive' : check.impact === 'medium' ? 'secondary' : 'outline'}
                    className="text-xs capitalize"
                  >
                    {check.impact}
                  </Badge>
                </div>
              );
            })}
          </CardContent>
        </Card>
      </FadeIn>
    );
  };

  return (
    <div className={className}>
      <SlideIn>
        <div className="mb-6">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">Technical SEO Analysis</h2>
          <p className="text-gray-600 dark:text-gray-300">
            Comprehensive technical analysis with {totalChecks} automated checks
          </p>
        </div>
      </SlideIn>

      {/* Overview Metrics */}
      <SlideIn delay={100}>
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          <MetricCard
            title="Technical Score"
            value={technicalScore}
            suffix="%"
            icon={BarChart3}
            description="Overall technical SEO health score"
            trend={technicalScore >= 80 ? "up" : technicalScore >= 60 ? "neutral" : "down"}
            trendValue={Math.abs(technicalScore - 75)}
          />
          <MetricCard
            title="Passed Checks"
            value={passedChecks}
            suffix={`/${totalChecks}`}
            icon={CheckCircle}
            description="Number of technical checks passed"
            trend="up"
            trendValue={Math.round((passedChecks / totalChecks) * 100)}
          />
          <MetricCard
            title="Warnings"
            value={warningChecks}
            icon={AlertTriangle}
            description="Issues requiring attention"
            trend={warningChecks > 3 ? "down" : "neutral"}
          />
          <MetricCard
            title="Critical Issues"
            value={failedChecks}
            icon={XCircle}
            description="Critical technical issues found"
            trend={failedChecks > 0 ? "down" : "up"}
          />
        </div>
      </SlideIn>

      {/* All Technical Checks - Continuous Display */}
      <SlideIn delay={200}>
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <CheckCircle className="h-5 w-5" />
              <span>All Technical SEO Checks ({totalChecks} total)</span>
            </CardTitle>
            <CardDescription>
              Complete analysis of all technical SEO factors
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            {technicalChecks.map((check: any, index: number) => {
              const StatusIcon = getStatusIcon(check.status);
              return (
                <div key={check.id} className="flex items-center justify-between p-4 rounded-lg bg-gray-50 dark:bg-gray-800/50 border border-gray-100 dark:border-gray-700">
                  <div className="flex items-center space-x-4">
                    <StatusIcon className={`h-5 w-5 ${getStatusColor(check.status)}`} />
                    <div className="flex-1">
                      <p className="font-medium text-sm">{check.name}</p>
                      <p className="text-xs text-gray-600 dark:text-gray-400 mt-1">{check.value}</p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Badge 
                      variant={check.impact === 'high' ? 'destructive' : check.impact === 'medium' ? 'secondary' : 'outline'}
                      className="text-xs"
                    >
                      {check.impact}
                    </Badge>
                    <Badge 
                      variant={check.status === 'passed' ? 'default' : check.status === 'warning' ? 'secondary' : 'destructive'}
                      className="text-xs"
                    >
                      {check.status}
                    </Badge>
                  </div>
                </div>
              );
            })}
          </CardContent>
        </Card>
      </SlideIn>
    </div>
  );
}