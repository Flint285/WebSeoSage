import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Loader2 } from "lucide-react";

export function PageLoader() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 via-white to-indigo-50 dark:from-gray-900 dark:via-gray-800 dark:to-blue-900">
      <div className="text-center">
        <Loader2 className="h-12 w-12 animate-spin text-blue-600 mx-auto mb-4" />
        <p className="text-lg font-medium text-gray-600 dark:text-gray-300">Loading your dashboard...</p>
      </div>
    </div>
  );
}

export function AnalysisLoader({ url }: { url?: string }) {
  return (
    <Card className="overflow-hidden">
      <CardHeader className="bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20">
        <div className="flex items-center space-x-3">
          <div className="relative">
            <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
            <div className="absolute inset-0 rounded-full border-2 border-blue-200 dark:border-blue-800"></div>
          </div>
          <div className="flex-1">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
              Analyzing Website
            </h3>
            <p className="text-sm text-gray-600 dark:text-gray-300">
              {url ? `Scanning ${url}...` : 'Running comprehensive SEO analysis...'}
            </p>
          </div>
        </div>
        <div className="mt-4">
          <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
            <div className="bg-gradient-to-r from-blue-500 to-indigo-600 h-2 rounded-full animate-pulse" style={{ width: '45%' }}></div>
          </div>
          <p className="text-xs text-gray-500 dark:text-gray-400 mt-2">
            This typically takes 30-60 seconds...
          </p>
        </div>
      </CardHeader>
      <CardContent className="space-y-6 p-6">
        {/* Analysis Steps */}
        <div className="space-y-4">
          <div className="flex items-center space-x-3">
            <div className="w-6 h-6 bg-green-100 dark:bg-green-900 rounded-full flex items-center justify-center">
              <div className="w-2 h-2 bg-green-600 rounded-full"></div>
            </div>
            <span className="text-sm text-gray-600 dark:text-gray-300">Loading website content</span>
          </div>
          <div className="flex items-center space-x-3">
            <div className="w-6 h-6 bg-blue-100 dark:bg-blue-900 rounded-full flex items-center justify-center">
              <Loader2 className="w-3 h-3 text-blue-600 animate-spin" />
            </div>
            <span className="text-sm text-gray-600 dark:text-gray-300">Analyzing technical SEO factors</span>
          </div>
          <div className="flex items-center space-x-3">
            <div className="w-6 h-6 bg-gray-100 dark:bg-gray-700 rounded-full"></div>
            <span className="text-sm text-gray-400">Evaluating content quality</span>
          </div>
          <div className="flex items-center space-x-3">
            <div className="w-6 h-6 bg-gray-100 dark:bg-gray-700 rounded-full"></div>
            <span className="text-sm text-gray-400">Measuring performance metrics</span>
          </div>
        </div>
        
        {/* Score Placeholders */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          {['Technical', 'Content', 'Performance', 'UX'].map((category, i) => (
            <div key={category} className="text-center p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
              <Skeleton className="h-4 w-16 mx-auto mb-3" />
              <Skeleton className="h-8 w-12 mx-auto mb-2" />
              <Skeleton className="h-3 w-20 mx-auto" />
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}

export function DashboardSkeleton() {
  return (
    <div className="space-y-6">
      {/* Header skeleton */}
      <div className="flex justify-between items-center">
        <div className="space-y-2">
          <Skeleton className="h-8 w-60" />
          <Skeleton className="h-4 w-80" />
        </div>
        <Skeleton className="h-10 w-32" />
      </div>

      {/* Quick stats skeleton */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        {Array.from({ length: 4 }).map((_, i) => (
          <Card key={i}>
            <CardContent className="p-6">
              <div className="flex items-center space-x-2">
                <Skeleton className="h-8 w-8 rounded-full" />
                <div className="space-y-2">
                  <Skeleton className="h-4 w-20" />
                  <Skeleton className="h-6 w-16" />
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Charts skeleton */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <Skeleton className="h-6 w-40" />
            <Skeleton className="h-4 w-60" />
          </CardHeader>
          <CardContent>
            <Skeleton className="h-64 w-full" />
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <Skeleton className="h-6 w-36" />
            <Skeleton className="h-4 w-48" />
          </CardHeader>
          <CardContent>
            <Skeleton className="h-64 w-full" />
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

export function TableSkeleton({ rows = 5 }: { rows?: number }) {
  return (
    <div className="space-y-3">
      <div className="flex space-x-4">
        <Skeleton className="h-4 w-32" />
        <Skeleton className="h-4 w-24" />
        <Skeleton className="h-4 w-28" />
        <Skeleton className="h-4 w-20" />
      </div>
      {Array.from({ length: rows }).map((_, i) => (
        <div key={i} className="flex space-x-4">
          <Skeleton className="h-3 w-32" />
          <Skeleton className="h-3 w-24" />
          <Skeleton className="h-3 w-28" />
          <Skeleton className="h-3 w-20" />
        </div>
      ))}
    </div>
  );
}

export function AnalyzingProgress({ currentStep }: { currentStep: string }) {
  const steps = [
    "Loading website...",
    "Analyzing technical SEO...",
    "Evaluating content quality...",
    "Checking performance metrics...",
    "Assessing user experience...",
    "Generating recommendations...",
  ];

  return (
    <Card>
      <CardContent className="p-6">
        <div className="text-center space-y-4">
          <Loader2 className="h-8 w-8 animate-spin text-blue-600 mx-auto" />
          <div>
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
              Analyzing Your Website
            </h3>
            <p className="text-sm text-gray-600 dark:text-gray-300 mt-1">
              {currentStep}
            </p>
          </div>
          <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
            <div 
              className="bg-blue-600 h-2 rounded-full transition-all duration-500"
              style={{ 
                width: `${((steps.indexOf(currentStep) + 1) / steps.length) * 100}%` 
              }}
            />
          </div>
          <p className="text-xs text-gray-500 dark:text-gray-400">
            This usually takes 30-60 seconds
          </p>
        </div>
      </CardContent>
    </Card>
  );
}