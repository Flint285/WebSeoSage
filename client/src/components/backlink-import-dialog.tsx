import { useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { Plus, Upload } from "lucide-react";
import { apiRequest } from "@/lib/queryClient";
import type { Website } from "@shared/schema";

interface BacklinkImportDialogProps {
  website: Website;
}

export function BacklinkImportDialog({ website }: BacklinkImportDialogProps) {
  const [open, setOpen] = useState(false);
  const [formData, setFormData] = useState({
    sourceUrl: "",
    targetUrl: "",
    anchorText: "",
    linkType: "dofollow",
    domainAuthority: "",
    pageAuthority: "",
  });

  const { toast } = useToast();
  const queryClient = useQueryClient();

  const createBacklinkMutation = useMutation({
    mutationFn: async (data: any) => {
      const response = await fetch(`/api/websites/${website.id}/backlinks`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });
      if (!response.ok) throw new Error("Failed to create backlink");
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/websites', website.id, 'backlinks'] });
      queryClient.invalidateQueries({ queryKey: ['/api/websites', website.id, 'backlinks', 'stats'] });
      toast({
        title: "Success",
        description: "Backlink added successfully",
      });
      setOpen(false);
      setFormData({
        sourceUrl: "",
        targetUrl: "",
        anchorText: "",
        linkType: "dofollow",
        domainAuthority: "",
        pageAuthority: "",
      });
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to add backlink",
        variant: "destructive",
      });
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const data = {
      sourceUrl: formData.sourceUrl,
      targetUrl: formData.targetUrl || website.url,
      anchorText: formData.anchorText || null,
      linkType: formData.linkType,
      domainAuthority: formData.domainAuthority ? parseInt(formData.domainAuthority) : null,
      pageAuthority: formData.pageAuthority ? parseInt(formData.pageAuthority) : null,
      isActive: true,
    };

    createBacklinkMutation.mutate(data);
  };

  const addSampleData = () => {
    const sampleBacklinks = [
      {
        sourceUrl: "https://techcrunch.com/article/sample",
        targetUrl: website.url,
        anchorText: "innovative technology solutions",
        linkType: "dofollow",
        domainAuthority: 94,
        pageAuthority: 76,
        isActive: true,
      },
      {
        sourceUrl: "https://mashable.com/news/tech-review",
        targetUrl: website.url,
        anchorText: "leading platform",
        linkType: "dofollow",
        domainAuthority: 92,
        pageAuthority: 68,
        isActive: true,
      },
      {
        sourceUrl: "https://blog.example.com/review",
        targetUrl: website.url,
        anchorText: "comprehensive solution",
        linkType: "nofollow",
        domainAuthority: 45,
        pageAuthority: 32,
        isActive: true,
      },
      {
        sourceUrl: "https://news.ycombinator.com/item?id=123",
        targetUrl: website.url,
        anchorText: website.domain,
        linkType: "dofollow",
        domainAuthority: 85,
        pageAuthority: 72,
        isActive: true,
      },
      {
        sourceUrl: "https://reddit.com/r/technology/post",
        targetUrl: website.url,
        anchorText: "check this out",
        linkType: "nofollow",
        domainAuthority: 91,
        pageAuthority: 55,
        isActive: true,
      },
    ];

    sampleBacklinks.forEach((backlink) => {
      createBacklinkMutation.mutate(backlink);
    });

    toast({
      title: "Sample Data Added",
      description: "5 sample backlinks have been added to demonstrate the system",
    });
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button size="sm">
          <Plus className="h-4 w-4 mr-2" />
          Add Backlink
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Add New Backlink</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="sourceUrl">Source URL *</Label>
            <Input
              id="sourceUrl"
              placeholder="https://example.com/page"
              value={formData.sourceUrl}
              onChange={(e) => setFormData(prev => ({ ...prev, sourceUrl: e.target.value }))}
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="targetUrl">Target URL</Label>
            <Input
              id="targetUrl"
              placeholder={`${website.url} (default)`}
              value={formData.targetUrl}
              onChange={(e) => setFormData(prev => ({ ...prev, targetUrl: e.target.value }))}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="anchorText">Anchor Text</Label>
            <Textarea
              id="anchorText"
              placeholder="Text used for the link"
              value={formData.anchorText}
              onChange={(e) => setFormData(prev => ({ ...prev, anchorText: e.target.value }))}
              rows={2}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="linkType">Link Type</Label>
            <Select value={formData.linkType} onValueChange={(value) => setFormData(prev => ({ ...prev, linkType: value }))}>
              <SelectTrigger>
                <SelectValue placeholder="Select link type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="dofollow">DoFollow</SelectItem>
                <SelectItem value="nofollow">NoFollow</SelectItem>
                <SelectItem value="sponsored">Sponsored</SelectItem>
                <SelectItem value="ugc">UGC (User Generated Content)</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="domainAuthority">Domain Authority</Label>
              <Input
                id="domainAuthority"
                type="number"
                min="1"
                max="100"
                placeholder="1-100"
                value={formData.domainAuthority}
                onChange={(e) => setFormData(prev => ({ ...prev, domainAuthority: e.target.value }))}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="pageAuthority">Page Authority</Label>
              <Input
                id="pageAuthority"
                type="number"
                min="1"
                max="100"
                placeholder="1-100"
                value={formData.pageAuthority}
                onChange={(e) => setFormData(prev => ({ ...prev, pageAuthority: e.target.value }))}
              />
            </div>
          </div>

          <div className="flex justify-between pt-4">
            <Button
              type="button"
              variant="outline"
              onClick={addSampleData}
              disabled={createBacklinkMutation.isPending}
            >
              <Upload className="h-4 w-4 mr-2" />
              Add Sample Data
            </Button>
            <div className="flex space-x-2">
              <Button type="button" variant="outline" onClick={() => setOpen(false)}>
                Cancel
              </Button>
              <Button type="submit" disabled={createBacklinkMutation.isPending}>
                {createBacklinkMutation.isPending ? "Adding..." : "Add Backlink"}
              </Button>
            </div>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}