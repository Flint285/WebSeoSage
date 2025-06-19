import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Plus, Upload, Wand2 } from "lucide-react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";
import type { Website } from "@shared/schema";

interface KeywordImportDialogProps {
  website: Website;
}

export function KeywordImportDialog({ website }: KeywordImportDialogProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [importMethod, setImportMethod] = useState<"single" | "bulk" | "samples">("single");
  const [formData, setFormData] = useState({
    keyword: "",
    searchVolume: "",
    difficulty: "",
    cpc: "",
    intent: "",
  });
  const [bulkKeywords, setBulkKeywords] = useState("");

  const { toast } = useToast();
  const queryClient = useQueryClient();

  const createKeywordMutation = useMutation({
    mutationFn: async (keywordData: any) => {
      return await apiRequest("POST", `/api/websites/${website.id}/keywords`, keywordData);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/websites', website.id, 'keywords'] });
      queryClient.invalidateQueries({ queryKey: ['/api/websites', website.id, 'keywords', 'stats'] });
      toast({
        title: "Success",
        description: "Keywords added successfully",
      });
      setIsOpen(false);
      resetForm();
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to add keywords",
        variant: "destructive",
      });
    },
  });

  const resetForm = () => {
    setFormData({
      keyword: "",
      searchVolume: "",
      difficulty: "",
      cpc: "",
      intent: "",
    });
    setBulkKeywords("");
  };

  const handleSingleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    const keywordData = {
      keyword: formData.keyword,
      searchVolume: formData.searchVolume ? parseInt(formData.searchVolume) : null,
      difficulty: formData.difficulty ? parseInt(formData.difficulty) : null,
      cpc: formData.cpc ? parseFloat(formData.cpc) : null,
      intent: formData.intent || null,
    };

    createKeywordMutation.mutate(keywordData);
  };

  const handleBulkSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    const lines = bulkKeywords.split('\n').filter(line => line.trim());
    const keywordPromises = lines.map(line => {
      const parts = line.split(',').map(part => part.trim());
      if (parts.length === 0 || !parts[0]) return null;
      
      const keywordData = {
        keyword: parts[0],
        searchVolume: parts[1] ? parseInt(parts[1]) || null : null,
        difficulty: parts[2] ? parseInt(parts[2]) || null : null,
        cpc: parts[3] ? parseFloat(parts[3]) || null : null,
        intent: parts[4] || null,
      };
      
      return apiRequest("POST", `/api/websites/${website.id}/keywords`, keywordData);
    });

    try {
      const validPromises = keywordPromises.filter(promise => promise !== null);
      await Promise.all(validPromises);
      queryClient.invalidateQueries({ queryKey: ['/api/websites', website.id, 'keywords'] });
      queryClient.invalidateQueries({ queryKey: ['/api/websites', website.id, 'keywords', 'stats'] });
      toast({
        title: "Success",
        description: `${lines.length} keywords added successfully`,
      });
      setIsOpen(false);
      resetForm();
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to add some keywords",
        variant: "destructive",
      });
    }
  };

  const addSampleKeywords = async () => {
    const sampleKeywords = [
      { keyword: "best SEO tools", searchVolume: 8100, difficulty: 65, cpc: 4.20, intent: "commercial" },
      { keyword: "SEO analysis free", searchVolume: 2900, difficulty: 45, cpc: 2.80, intent: "commercial" },
      { keyword: "website optimization", searchVolume: 4400, difficulty: 55, cpc: 3.50, intent: "informational" },
      { keyword: "keyword research", searchVolume: 12000, difficulty: 70, cpc: 5.10, intent: "informational" },
      { keyword: "page speed optimization", searchVolume: 1800, difficulty: 42, cpc: 3.90, intent: "informational" },
      { keyword: "technical SEO audit", searchVolume: 1200, difficulty: 58, cpc: 6.20, intent: "commercial" },
      { keyword: "local SEO services", searchVolume: 3200, difficulty: 62, cpc: 8.50, intent: "transactional" },
      { keyword: "content marketing strategy", searchVolume: 2700, difficulty: 48, cpc: 4.60, intent: "informational" },
      { keyword: "backlink analysis", searchVolume: 1900, difficulty: 52, cpc: 3.80, intent: "informational" },
      { keyword: "SERP tracker", searchVolume: 1100, difficulty: 41, cpc: 4.40, intent: "commercial" },
    ];

    try {
      const promises = sampleKeywords.map(keyword => 
        apiRequest("POST", `/api/websites/${website.id}/keywords`, keyword)
      );
      
      await Promise.all(promises);
      queryClient.invalidateQueries({ queryKey: ['/api/websites', website.id, 'keywords'] });
      queryClient.invalidateQueries({ queryKey: ['/api/websites', website.id, 'keywords', 'stats'] });
      toast({
        title: "Success",
        description: `${sampleKeywords.length} sample keywords added successfully`,
      });
      setIsOpen(false);
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to add sample keywords",
        variant: "destructive",
      });
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button size="sm">
          <Plus className="h-4 w-4 mr-2" />
          Add Keywords
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>Add Keywords to {website.url}</DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          {/* Import Method Selection */}
          <div className="flex space-x-2">
            <Button
              type="button"
              variant={importMethod === "single" ? "default" : "outline"}
              size="sm"
              onClick={() => setImportMethod("single")}
            >
              Single Keyword
            </Button>
            <Button
              type="button"
              variant={importMethod === "bulk" ? "default" : "outline"}
              size="sm"
              onClick={() => setImportMethod("bulk")}
            >
              <Upload className="h-4 w-4 mr-2" />
              Bulk Import
            </Button>
            <Button
              type="button"
              variant={importMethod === "samples" ? "default" : "outline"}
              size="sm"
              onClick={() => setImportMethod("samples")}
            >
              <Wand2 className="h-4 w-4 mr-2" />
              Sample Data
            </Button>
          </div>

          {/* Single Keyword Form */}
          {importMethod === "single" && (
            <form onSubmit={handleSingleSubmit} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="keyword">Keyword*</Label>
                  <Input
                    id="keyword"
                    type="text"
                    value={formData.keyword}
                    onChange={(e) => setFormData({ ...formData, keyword: e.target.value })}
                    placeholder="e.g., best SEO tools"
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="searchVolume">Search Volume</Label>
                  <Input
                    id="searchVolume"
                    type="number"
                    value={formData.searchVolume}
                    onChange={(e) => setFormData({ ...formData, searchVolume: e.target.value })}
                    placeholder="e.g., 8100"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="difficulty">Difficulty (1-100)</Label>
                  <Input
                    id="difficulty"
                    type="number"
                    min="1"
                    max="100"
                    value={formData.difficulty}
                    onChange={(e) => setFormData({ ...formData, difficulty: e.target.value })}
                    placeholder="e.g., 65"
                  />
                </div>
                <div>
                  <Label htmlFor="cpc">CPC ($)</Label>
                  <Input
                    id="cpc"
                    type="number"
                    step="0.01"
                    value={formData.cpc}
                    onChange={(e) => setFormData({ ...formData, cpc: e.target.value })}
                    placeholder="e.g., 4.20"
                  />
                </div>
              </div>

              <div>
                <Label htmlFor="intent">Search Intent</Label>
                <Select value={formData.intent} onValueChange={(value) => setFormData({ ...formData, intent: value })}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select intent" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="informational">Informational</SelectItem>
                    <SelectItem value="commercial">Commercial</SelectItem>
                    <SelectItem value="transactional">Transactional</SelectItem>
                    <SelectItem value="navigational">Navigational</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <Button type="submit" disabled={createKeywordMutation.isPending} className="w-full">
                {createKeywordMutation.isPending ? "Adding..." : "Add Keyword"}
              </Button>
            </form>
          )}

          {/* Bulk Import */}
          {importMethod === "bulk" && (
            <form onSubmit={handleBulkSubmit} className="space-y-4">
              <div>
                <Label htmlFor="bulkKeywords">Keywords (CSV Format)</Label>
                <Textarea
                  id="bulkKeywords"
                  value={bulkKeywords}
                  onChange={(e) => setBulkKeywords(e.target.value)}
                  placeholder="keyword, search_volume, difficulty, cpc, intent&#10;best SEO tools, 8100, 65, 4.20, commercial&#10;SEO analysis free, 2900, 45, 2.80, commercial"
                  rows={8}
                />
                <p className="text-xs text-muted-foreground mt-2">
                  Format: keyword, search_volume, difficulty, cpc, intent (one per line)
                </p>
              </div>

              <Button type="submit" disabled={createKeywordMutation.isPending} className="w-full">
                {createKeywordMutation.isPending ? "Adding..." : "Import Keywords"}
              </Button>
            </form>
          )}

          {/* Sample Data */}
          {importMethod === "samples" && (
            <div className="space-y-4">
              <p className="text-sm text-muted-foreground">
                Add 10 sample keywords with realistic SEO metrics for testing and demonstration purposes.
              </p>
              
              <div className="bg-muted p-4 rounded-lg">
                <h4 className="font-medium mb-2">Sample keywords include:</h4>
                <ul className="text-sm text-muted-foreground space-y-1">
                  <li>• "best SEO tools" - High volume, commercial intent</li>
                  <li>• "keyword research" - High volume, informational</li>
                  <li>• "local SEO services" - Medium volume, transactional</li>
                  <li>• And 7 more relevant SEO-related keywords...</li>
                </ul>
              </div>

              <Button onClick={addSampleKeywords} disabled={createKeywordMutation.isPending} className="w-full">
                {createKeywordMutation.isPending ? "Adding..." : "Add Sample Keywords"}
              </Button>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}