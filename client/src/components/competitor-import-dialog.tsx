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

interface CompetitorImportDialogProps {
  website: Website;
}

export function CompetitorImportDialog({ website }: CompetitorImportDialogProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [importMethod, setImportMethod] = useState<"single" | "bulk" | "samples">("single");
  const [formData, setFormData] = useState({
    competitorUrl: "",
    name: "",
    competitiveStrength: "",
  });
  const [bulkCompetitors, setBulkCompetitors] = useState("");

  const { toast } = useToast();
  const queryClient = useQueryClient();

  const createCompetitorMutation = useMutation({
    mutationFn: async (competitorData: any) => {
      return await apiRequest("POST", `/api/websites/${website.id}/competitors`, competitorData);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/websites', website.id, 'competitors'] });
      queryClient.invalidateQueries({ queryKey: ['/api/websites', website.id, 'competitor-analysis'] });
      toast({
        title: "Success",
        description: "Competitors added successfully",
      });
      setIsOpen(false);
      resetForm();
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to add competitors",
        variant: "destructive",
      });
    },
  });

  const resetForm = () => {
    setFormData({
      competitorUrl: "",
      name: "",
      competitiveStrength: "",
    });
    setBulkCompetitors("");
  };

  const extractDomainFromUrl = (url: string): string => {
    try {
      const urlObj = new URL(url.startsWith('http') ? url : `https://${url}`);
      return urlObj.hostname;
    } catch {
      return url;
    }
  };

  const handleSingleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    const competitorData = {
      competitorUrl: formData.competitorUrl.startsWith('http') 
        ? formData.competitorUrl 
        : `https://${formData.competitorUrl}`,
      competitorDomain: extractDomainFromUrl(formData.competitorUrl),
      name: formData.name || null,
      competitiveStrength: formData.competitiveStrength || null,
    };

    createCompetitorMutation.mutate(competitorData);
  };

  const handleBulkSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    const lines = bulkCompetitors.split('\n').filter(line => line.trim());
    const competitorPromises = lines.map(line => {
      const parts = line.split(',').map(part => part.trim());
      const url = parts[0];
      const competitorData = {
        competitorUrl: url.startsWith('http') ? url : `https://${url}`,
        competitorDomain: extractDomainFromUrl(url),
        name: parts[1] || null,
        competitiveStrength: parts[2] || null,
      };
      
      return apiRequest("POST", `/api/websites/${website.id}/competitors`, competitorData);
    });

    try {
      await Promise.all(competitorPromises);
      queryClient.invalidateQueries({ queryKey: ['/api/websites', website.id, 'competitors'] });
      queryClient.invalidateQueries({ queryKey: ['/api/websites', website.id, 'competitor-analysis'] });
      toast({
        title: "Success",
        description: `${lines.length} competitors added successfully`,
      });
      setIsOpen(false);
      resetForm();
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to add some competitors",
        variant: "destructive",
      });
    }
  };

  const addSampleCompetitors = async () => {
    // Generate relevant sample competitors based on the website domain
    const websiteDomain = website.domain || website.url;
    const isHealthcare = websiteDomain.includes('health') || websiteDomain.includes('medical') || websiteDomain.includes('mt4h');
    
    const sampleCompetitors = isHealthcare ? [
      { competitorUrl: "https://www.mentalhealthamerica.net", name: "Mental Health America", competitiveStrength: "high" },
      { competitorUrl: "https://www.nami.org", name: "NAMI", competitiveStrength: "high" },
      { competitorUrl: "https://www.samhsa.gov", name: "SAMHSA", competitiveStrength: "medium" },
      { competitorUrl: "https://www.mentalhealth.gov", name: "MentalHealth.gov", competitiveStrength: "medium" },
      { competitorUrl: "https://www.nimh.nih.gov", name: "NIMH", competitiveStrength: "high" },
    ] : [
      { competitorUrl: "https://www.example-competitor1.com", name: "Competitor 1", competitiveStrength: "high" },
      { competitorUrl: "https://www.example-competitor2.com", name: "Competitor 2", competitiveStrength: "medium" },
      { competitorUrl: "https://www.example-competitor3.com", name: "Competitor 3", competitiveStrength: "medium" },
      { competitorUrl: "https://www.example-competitor4.com", name: "Competitor 4", competitiveStrength: "low" },
      { competitorUrl: "https://www.example-competitor5.com", name: "Competitor 5", competitiveStrength: "medium" },
    ];

    try {
      const promises = sampleCompetitors.map(competitor => {
        const competitorData = {
          ...competitor,
          competitorDomain: extractDomainFromUrl(competitor.competitorUrl),
        };
        return apiRequest("POST", `/api/websites/${website.id}/competitors`, competitorData);
      });
      
      await Promise.all(promises);
      queryClient.invalidateQueries({ queryKey: ['/api/websites', website.id, 'competitors'] });
      queryClient.invalidateQueries({ queryKey: ['/api/websites', website.id, 'competitor-analysis'] });
      toast({
        title: "Success",
        description: `${sampleCompetitors.length} sample competitors added successfully`,
      });
      setIsOpen(false);
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to add sample competitors",
        variant: "destructive",
      });
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button size="sm">
          <Plus className="h-4 w-4 mr-2" />
          Add Competitors
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>Add Competitors to {website.domain}</DialogTitle>
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
              Single Competitor
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

          {/* Single Competitor Form */}
          {importMethod === "single" && (
            <form onSubmit={handleSingleSubmit} className="space-y-4">
              <div>
                <Label htmlFor="competitorUrl">Competitor URL*</Label>
                <Input
                  id="competitorUrl"
                  type="url"
                  value={formData.competitorUrl}
                  onChange={(e) => setFormData({ ...formData, competitorUrl: e.target.value })}
                  placeholder="e.g., https://competitor.com"
                  required
                />
              </div>

              <div>
                <Label htmlFor="name">Friendly Name (Optional)</Label>
                <Input
                  id="name"
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder="e.g., Main Competitor Inc."
                />
              </div>

              <div>
                <Label htmlFor="competitiveStrength">Competitive Strength</Label>
                <Select value={formData.competitiveStrength} onValueChange={(value) => setFormData({ ...formData, competitiveStrength: value })}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select strength level" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="low">Low</SelectItem>
                    <SelectItem value="medium">Medium</SelectItem>
                    <SelectItem value="high">High</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <Button type="submit" disabled={createCompetitorMutation.isPending} className="w-full">
                {createCompetitorMutation.isPending ? "Adding..." : "Add Competitor"}
              </Button>
            </form>
          )}

          {/* Bulk Import */}
          {importMethod === "bulk" && (
            <form onSubmit={handleBulkSubmit} className="space-y-4">
              <div>
                <Label htmlFor="bulkCompetitors">Competitors (CSV Format)</Label>
                <Textarea
                  id="bulkCompetitors"
                  value={bulkCompetitors}
                  onChange={(e) => setBulkCompetitors(e.target.value)}
                  placeholder="url, name, competitive_strength&#10;https://competitor1.com, Competitor 1, high&#10;https://competitor2.com, Competitor 2, medium"
                  rows={8}
                />
                <p className="text-xs text-muted-foreground mt-2">
                  Format: url, name, competitive_strength (one per line)
                </p>
              </div>

              <Button type="submit" disabled={createCompetitorMutation.isPending} className="w-full">
                {createCompetitorMutation.isPending ? "Adding..." : "Import Competitors"}
              </Button>
            </form>
          )}

          {/* Sample Data */}
          {importMethod === "samples" && (
            <div className="space-y-4">
              <p className="text-sm text-muted-foreground">
                Add relevant sample competitors for testing and demonstration purposes.
              </p>
              
              <div className="bg-muted p-4 rounded-lg">
                <h4 className="font-medium mb-2">Sample competitors include:</h4>
                <ul className="text-sm text-muted-foreground space-y-1">
                  <li>• Industry-relevant competitor websites</li>
                  <li>• Varied competitive strengths (high, medium, low)</li>
                  <li>• Real domains for authentic analysis</li>
                  <li>• Professional naming conventions</li>
                </ul>
              </div>

              <Button onClick={addSampleCompetitors} disabled={createCompetitorMutation.isPending} className="w-full">
                {createCompetitorMutation.isPending ? "Adding..." : "Add Sample Competitors"}
              </Button>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}