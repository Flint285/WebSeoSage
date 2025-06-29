import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { Search, Shield } from "lucide-react";

interface SeoAnalysisFormProps {
  onAnalyze: (url: string) => void;
  isLoading: boolean;
}

export function SeoAnalysisForm({ onAnalyze, isLoading }: SeoAnalysisFormProps) {
  const [url, setUrl] = useState("");
  const [isFocused, setIsFocused] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (url.trim()) {
      const finalUrl = url.startsWith('http') ? url : `https://${url}`;
      onAnalyze(finalUrl);
    }
  };

  const exampleSites = [
    "example.com",
    "yourwebsite.com", 
    "mybusiness.org"
  ];

  return (
    <div className="max-w-3xl mx-auto">
      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Main Input Section */}
        <div className="relative">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex-1 relative">
              <Input
                type="text"
                placeholder="Enter your website URL (e.g., example.com)"
                value={url}
                onChange={(e) => setUrl(e.target.value)}
                onFocus={() => setIsFocused(true)}
                onBlur={() => setIsFocused(false)}
                className={`px-4 py-4 text-lg transition-all duration-200 ${
                  isFocused ? 'ring-2 ring-blue-500 border-blue-500' : ''
                }`}
                disabled={isLoading}
                required
              />
              {!url && !isFocused && (
                <div className="absolute right-3 top-1/2 transform -translate-y-1/2 text-sm text-gray-400">
                  No http:// needed
                </div>
              )}
            </div>
            <Button 
              type="submit" 
              disabled={isLoading || !url.trim()}
              className="bg-gradient-to-r from-blue-600 to-blue-700 text-white px-8 py-4 text-lg font-semibold hover:from-blue-700 hover:to-blue-800 whitespace-nowrap transition-all duration-200 shadow-lg hover:shadow-xl"
            >
              {isLoading ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                  Analyzing...
                </>
              ) : (
                <>
                  <Search className="h-4 w-4 mr-2" />
                  Analyze Website
                </>
              )}
            </Button>
          </div>
        </div>
        
        {/* Quick Examples */}
        {!isLoading && (
          <div className="text-center">
            <p className="text-sm text-gray-600 dark:text-gray-400 mb-3">
              Try these examples:
            </p>
            <div className="flex flex-wrap justify-center gap-2">
              {exampleSites.map((site) => (
                <button
                  key={site}
                  type="button"
                  onClick={() => setUrl(site)}
                  className="px-3 py-1 text-sm bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 rounded-full hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
                >
                  {site}
                </button>
              ))}
            </div>
          </div>
        )}
      </form>
      
      <div className="mt-6 flex items-center justify-center text-sm text-muted-foreground">
        <Shield className="h-4 w-4 mr-2 text-secondary" />
        Analysis typically takes 30-60 seconds
      </div>
    </div>
  );
}