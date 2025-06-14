import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { CheckCircle, XCircle, Shield, Smartphone, Tags, Heading, Map } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import type { SeoAnalysis, TechnicalCheck } from "@shared/schema";

interface MetricsTableProps {
  analysis: SeoAnalysis;
}

export function MetricsTable({ analysis }: MetricsTableProps) {
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState<"technical" | "content" | "performance">("technical");
  
  console.log('Analysis technicalChecks:', analysis.technicalChecks, 'Type:', typeof analysis.technicalChecks);
  const technicalChecks = Array.isArray(analysis.technicalChecks) 
    ? analysis.technicalChecks 
    : [];

  const handleFixNow = (check: TechnicalCheck) => {
    const fixGuides: { [key: string]: string } = {
      'meta-description': 'Add a meta description tag in your HTML head section: <meta name="description" content="Your 150-160 character description">',
      'h1-tag': 'Add an H1 tag to your page: <h1>Your Main Page Heading</h1>',
      'title-tag': 'Add a title tag in your HTML head: <title>Your Page Title (50-60 characters)</title>',
      'https-security': 'Install an SSL certificate through your hosting provider or use services like Let\'s Encrypt for free SSL.',
    };
    
    const guide = fixGuides[check.id] || 'Check our documentation for detailed implementation steps.';
    
    toast({
      title: `Fix ${check.name}`,
      description: guide,
    });
  };

  const getIconComponent = (iconName: string) => {
    const iconMap: { [key: string]: any } = {
      "fas fa-shield-alt": Shield,
      "fas fa-mobile-alt": Smartphone,
      "fas fa-tags": Tags,
      "fas fa-heading": Heading,
      "fas fa-sitemap": Map,
    };
    return iconMap[iconName] || Shield;
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "passed":
        return (
          <Badge className="bg-green-100 text-secondary hover:bg-green-100">
            <CheckCircle className="h-3 w-3 mr-1" />
            Passed
          </Badge>
        );
      case "failed":
        return (
          <Badge className="bg-red-100 text-error hover:bg-red-100">
            <XCircle className="h-3 w-3 mr-1" />
            Failed
          </Badge>
        );
      case "warning":
        return (
          <Badge className="bg-orange-100 text-warning hover:bg-orange-100">
            <XCircle className="h-3 w-3 mr-1" />
            Warning
          </Badge>
        );
      default:
        return null;
    }
  };

  const getImpactIndicator = (impact: string) => {
    const color = impact === "high" ? "bg-secondary" : impact === "medium" ? "bg-warning" : "bg-gray-400";
    return (
      <div className="flex items-center">
        <div className={`w-2 h-2 ${color} rounded-full mr-2`}></div>
        <span className="text-sm text-muted-foreground capitalize">{impact}</span>
      </div>
    );
  };

  const tabs = [
    { id: "technical", label: "Technical", active: activeTab === "technical" },
    { id: "content", label: "Content", active: activeTab === "content" },
    { id: "performance", label: "Performance", active: activeTab === "performance" },
  ];

  return (
    <Card className="mb-8">
      <CardHeader className="border-b border-gray-200">
        <div className="flex items-center justify-between">
          <CardTitle className="text-xl text-foreground">Detailed Metrics</CardTitle>
          <div className="flex space-x-2">
            {tabs.map((tab) => (
              <Button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                variant={tab.active ? "default" : "outline"}
                size="sm"
                className={tab.active ? "bg-primary text-primary-foreground" : ""}
              >
                {tab.label}
              </Button>
            ))}
          </div>
        </div>
      </CardHeader>
      <CardContent className="p-6">
        {activeTab === "technical" && (
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow className="border-b border-gray-200">
                  <TableHead className="text-left py-3 px-4 font-semibold text-foreground">Check</TableHead>
                  <TableHead className="text-left py-3 px-4 font-semibold text-foreground">Status</TableHead>
                  <TableHead className="text-left py-3 px-4 font-semibold text-foreground">Value</TableHead>
                  <TableHead className="text-left py-3 px-4 font-semibold text-foreground">Impact</TableHead>
                  <TableHead className="text-left py-3 px-4 font-semibold text-foreground">Action</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody className="divide-y divide-gray-100">
                {technicalChecks.map((check) => {
                  const IconComponent = getIconComponent(check.icon);
                  return (
                    <TableRow key={check.id} className="hover:bg-gray-50">
                      <TableCell className="py-3 px-4">
                        <div className="flex items-center space-x-3">
                          <IconComponent className="h-4 w-4 text-gray-400" />
                          <span className="font-medium">{check.name}</span>
                        </div>
                      </TableCell>
                      <TableCell className="py-3 px-4">
                        {getStatusBadge(check.status)}
                      </TableCell>
                      <TableCell className="py-3 px-4 text-muted-foreground">
                        {check.value}
                      </TableCell>
                      <TableCell className="py-3 px-4">
                        {getImpactIndicator(check.impact)}
                      </TableCell>
                      <TableCell className="py-3 px-4">
                        {check.status === "passed" ? (
                          <span className="text-secondary text-sm">✓ Complete</span>
                        ) : (
                          <Button 
                            variant="link" 
                            size="sm" 
                            className="text-primary p-0 h-auto"
                            onClick={() => handleFixNow(check)}
                          >
                            Fix Now
                          </Button>
                        )}
                      </TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          </div>
        )}
        
        {activeTab === "content" && (
          <div className="text-center py-8 text-muted-foreground">
            <p>Content analysis metrics will be displayed here.</p>
          </div>
        )}
        
        {activeTab === "performance" && (
          <div className="text-center py-8 text-muted-foreground">
            <p>Performance metrics will be displayed here.</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
