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
  const [url, setUrl] = useState("https://");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (url && url !== "https://") {
      onAnalyze(url);
    }
  };

  return (
    <div className="max-w-2xl mx-auto">
      <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-4">
        <div className="flex-1">
          <Input
            type="url"
            placeholder="Enter your website URL (e.g., https://example.com)"
            value={url}
            onChange={(e) => setUrl(e.target.value)}
            className="px-4 py-4 text-lg"
            disabled={isLoading}
            required
          />
        </div>
        <Button 
          type="submit" 
          disabled={isLoading || !url || url === "https://"}
          className="bg-primary text-primary-foreground px-8 py-4 text-lg font-semibold hover:bg-blue-700 whitespace-nowrap"
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
      </form>
      <div className="mt-4 flex items-center justify-center text-sm text-muted-foreground">
        <Shield className="h-4 w-4 mr-2 text-secondary" />
        Analysis typically takes 30-60 seconds
      </div>
    </div>
  );
}
