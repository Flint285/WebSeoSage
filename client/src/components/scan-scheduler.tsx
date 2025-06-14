import { useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Clock, Calendar, Zap } from "lucide-react";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import type { Website } from "@shared/schema";

interface ScanSchedulerProps {
  website: Website;
}

export function ScanScheduler({ website }: ScanSchedulerProps) {
  const [frequency, setFrequency] = useState(website.scanFrequency || "manual");
  const [isEnabled, setIsEnabled] = useState(website.scanFrequency !== "manual");
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const updateScheduleMutation = useMutation({
    mutationFn: async (data: { frequency: string; enabled: boolean }) => {
      const response = await fetch(`/api/websites/${website.id}/schedule`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          scanFrequency: data.enabled ? data.frequency : "manual",
          nextScanAt: data.enabled ? calculateNextScan(data.frequency) : null,
        }),
      });
      
      if (!response.ok) {
        throw new Error("Failed to update schedule");
      }
      
      return response.json();
    },
    onSuccess: () => {
      toast({
        title: "Schedule Updated",
        description: "Scan schedule has been updated successfully.",
      });
      queryClient.invalidateQueries({ queryKey: [`/api/websites/${website.id}`] });
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to update scan schedule.",
        variant: "destructive",
      });
    },
  });

  const calculateNextScan = (freq: string): string => {
    const now = new Date();
    switch (freq) {
      case "daily":
        now.setDate(now.getDate() + 1);
        break;
      case "weekly":
        now.setDate(now.getDate() + 7);
        break;
      case "monthly":
        now.setMonth(now.getMonth() + 1);
        break;
      default:
        return now.toISOString();
    }
    return now.toISOString();
  };

  const getFrequencyLabel = (freq: string) => {
    switch (freq) {
      case "daily": return "Every Day";
      case "weekly": return "Every Week";
      case "monthly": return "Every Month";
      default: return "Manual Only";
    }
  };

  const getFrequencyIcon = () => {
    if (!isEnabled) return <Clock className="h-4 w-4 text-gray-400" />;
    return <Zap className="h-4 w-4 text-green-600" />;
  };

  const handleSave = () => {
    updateScheduleMutation.mutate({ frequency, enabled: isEnabled });
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg text-foreground flex items-center">
          <Calendar className="h-5 w-5 mr-2" />
          Automated Scanning
        </CardTitle>
        <p className="text-sm text-muted-foreground">
          Set up regular SEO scans to track performance over time automatically.
        </p>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="flex items-center justify-between">
          <div className="space-y-0.5">
            <Label htmlFor="auto-scan" className="text-base font-medium">
              Enable Automatic Scans
            </Label>
            <p className="text-sm text-muted-foreground">
              Automatically run SEO analysis at scheduled intervals
            </p>
          </div>
          <Switch
            id="auto-scan"
            checked={isEnabled}
            onCheckedChange={setIsEnabled}
          />
        </div>

        {isEnabled && (
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="frequency">Scan Frequency</Label>
              <Select value={frequency} onValueChange={setFrequency}>
                <SelectTrigger>
                  <SelectValue placeholder="Select frequency" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="daily">Daily</SelectItem>
                  <SelectItem value="weekly">Weekly</SelectItem>
                  <SelectItem value="monthly">Monthly</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="p-4 bg-blue-50 rounded-lg border">
              <div className="flex items-center space-x-2 mb-2">
                {getFrequencyIcon()}
                <span className="font-medium text-foreground">Current Schedule</span>
              </div>
              <div className="text-sm text-muted-foreground">
                <Badge variant="outline" className="mb-2">
                  {getFrequencyLabel(frequency)}
                </Badge>
                <p>
                  {website.nextScanAt && isEnabled
                    ? `Next scan: ${new Date(website.nextScanAt).toLocaleString()}`
                    : "Next scan will be scheduled after saving"}
                </p>
              </div>
            </div>
          </div>
        )}

        <div className="flex items-center justify-between pt-4 border-t">
          <div className="text-sm text-muted-foreground">
            Last scanned: {website.lastScanned 
              ? new Date(website.lastScanned).toLocaleString()
              : "Never"}
          </div>
          <Button 
            onClick={handleSave}
            disabled={updateScheduleMutation.isPending}
            className="bg-primary text-primary-foreground hover:bg-blue-700"
          >
            {updateScheduleMutation.isPending ? "Saving..." : "Save Schedule"}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}