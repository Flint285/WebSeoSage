import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Search, Globe, Sparkles, Clock, TrendingUp } from "lucide-react";
import { cn } from "@/lib/utils";

interface EnhancedAnalysisFormProps {
  onSubmit: (url: string) => void;
  isLoading?: boolean;
  className?: string;
}

export function EnhancedAnalysisForm({ onSubmit, isLoading, className }: EnhancedAnalysisFormProps) {
  const [url, setUrl] = useState("");
  const [urlError, setUrlError] = useState("");

  const validateUrl = (input: string) => {
    if (!input.trim()) {
      setUrlError("Please enter a website URL");
      return false;
    }
    
    try {
      const urlObj = new URL(input.startsWith('http') ? input : `https://${input}`);
      if (!urlObj.hostname.includes('.')) {
        setUrlError("Please enter a valid domain name");
        return false;
      }
      setUrlError("");
      return true;
    } catch {
      setUrlError("Please enter a valid website URL");
      return false;
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (validateUrl(url)) {
      const finalUrl = url.startsWith('http') ? url : `https://${url}`;
      onSubmit(finalUrl);
    }
  };

  const quickExamples = [
    { domain: "apple.com", category: "Tech" },
    { domain: "nike.com", category: "Retail" },
    { domain: "medium.com", category: "Media" }
  ];

  return (
    <Card className={cn("w-full max-w-2xl mx-auto", className)}>
      <CardHeader className="text-center">
        <div className="flex items-center justify-center space-x-2 mb-2">
          <div className="p-2 bg-blue-100 dark:bg-blue-900/20 rounded-full">
            <Search className="h-6 w-6 text-blue-600 dark:text-blue-400" />
          </div>
          <Badge variant="secondary" className="text-xs">
            <Sparkles className="h-3 w-3 mr-1" />
            AI-Powered
          </Badge>
        </div>
        <CardTitle className="text-2xl font-bold">SEO Analysis</CardTitle>
        <CardDescription>
          Get comprehensive SEO insights for any website in seconds
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <div className="relative">
              <Globe className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
              <Input
                type="text"
                placeholder="Enter website URL (e.g., example.com)"
                value={url}
                onChange={(e) => {
                  setUrl(e.target.value);
                  if (urlError) setUrlError("");
                }}
                className={cn(
                  "pl-10 h-12 text-lg",
                  urlError && "border-red-500 focus:border-red-500"
                )}
                disabled={isLoading}
              />
            </div>
            {urlError && (
              <p className="text-sm text-red-600 dark:text-red-400">{urlError}</p>
            )}
          </div>

          <Button 
            type="submit" 
            size="lg" 
            className="w-full h-12 text-lg font-semibold"
            disabled={isLoading || !url.trim()}
          >
            {isLoading ? (
              <>
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2" />
                Analyzing...
              </>
            ) : (
              <>
                <Search className="h-4 w-4 mr-2" />
                Analyze Website
              </>
            )}
          </Button>
        </form>

        <div className="border-t pt-4">
          <p className="text-sm text-gray-600 dark:text-gray-400 mb-3 text-center">
            Try these popular examples:
          </p>
          <div className="flex flex-wrap gap-2 justify-center">
            {quickExamples.map((example) => (
              <Button
                key={example.domain}
                variant="outline"
                size="sm"
                onClick={() => setUrl(example.domain)}
                disabled={isLoading}
                className="text-xs"
              >
                {example.domain}
                <Badge variant="secondary" className="ml-1 text-xs">
                  {example.category}
                </Badge>
              </Button>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-3 gap-4 text-center text-sm text-gray-600 dark:text-gray-400">
          <div className="flex flex-col items-center space-y-1">
            <Clock className="h-4 w-4 text-blue-500" />
            <span>30-60 seconds</span>
          </div>
          <div className="flex flex-col items-center space-y-1">
            <TrendingUp className="h-4 w-4 text-green-500" />
            <span>100+ checks</span>
          </div>
          <div className="flex flex-col items-center space-y-1">
            <Sparkles className="h-4 w-4 text-purple-500" />
            <span>AI insights</span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}