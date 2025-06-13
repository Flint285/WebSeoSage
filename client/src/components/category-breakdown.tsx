import { Card, CardContent } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Settings, FileText, Gauge, Users } from "lucide-react";
import type { SeoAnalysis } from "@shared/schema";

interface CategoryBreakdownProps {
  analysis: SeoAnalysis;
}

export function CategoryBreakdown({ analysis }: CategoryBreakdownProps) {
  const categories = [
    {
      name: "Technical SEO",
      score: analysis.technicalScore,
      icon: Settings,
      color: "text-secondary",
      bgColor: "bg-secondary/10",
      progressColor: "bg-secondary",
      passed: Math.floor(analysis.technicalScore / 15),
      issues: Math.floor((100 - analysis.technicalScore) / 15),
    },
    {
      name: "Content",
      score: analysis.contentScore,
      icon: FileText,
      color: "text-primary",
      bgColor: "bg-primary/10",
      progressColor: "bg-primary",
      passed: Math.floor(analysis.contentScore / 15),
      issues: Math.floor((100 - analysis.contentScore) / 15),
    },
    {
      name: "Performance",
      score: analysis.performanceScore,
      icon: Gauge,
      color: "text-warning",
      bgColor: "bg-warning/10",
      progressColor: "bg-warning",
      passed: Math.floor(analysis.performanceScore / 15),
      issues: Math.floor((100 - analysis.performanceScore) / 15),
    },
    {
      name: "User Experience",
      score: analysis.uxScore,
      icon: Users,
      color: "text-purple-600",
      bgColor: "bg-purple-100",
      progressColor: "bg-purple-600",
      passed: Math.floor(analysis.uxScore / 15),
      issues: Math.floor((100 - analysis.uxScore) / 15),
    },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6 mb-8">
      {categories.map((category) => {
        const IconComponent = category.icon;
        return (
          <Card key={category.name} className="hover:shadow-md transition-shadow">
            <CardContent className="p-6">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center space-x-3">
                  <div className={`w-10 h-10 ${category.bgColor} rounded-lg flex items-center justify-center`}>
                    <IconComponent className={`h-5 w-5 ${category.color}`} />
                  </div>
                  <h3 className="font-semibold text-foreground">{category.name}</h3>
                </div>
                <span className={`text-2xl font-bold ${category.color}`}>
                  {category.score}
                </span>
              </div>
              <div className="mb-4">
                <Progress value={category.score} className="h-2" />
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-secondary">{category.passed} passed</span>
                <span className="text-error">{category.issues} issues</span>
              </div>
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
}
