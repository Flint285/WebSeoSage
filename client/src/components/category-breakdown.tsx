import { Card, CardContent } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Settings, FileText, Gauge, Users } from "lucide-react";
import type { SeoAnalysis } from "@shared/schema";

interface CategoryBreakdownProps {
  analysis: SeoAnalysis;
}

export function CategoryBreakdown({ analysis }: CategoryBreakdownProps) {
  // Add null safety guards for all score values
  const technicalScore = analysis?.technicalScore ?? 0;
  const contentScore = analysis?.contentScore ?? 0;
  const performanceScore = analysis?.performanceScore ?? 0;
  const uxScore = analysis?.uxScore ?? 0;

  const categories = [
    {
      name: "Technical SEO",
      score: technicalScore,
      icon: Settings,
      color: "text-secondary",
      bgColor: "bg-secondary/10",
      progressColor: "bg-secondary",
      passed: Math.floor(technicalScore / 15),
      issues: Math.floor((100 - technicalScore) / 15),
    },
    {
      name: "Content",
      score: contentScore,
      icon: FileText,
      color: "text-primary",
      bgColor: "bg-primary/10",
      progressColor: "bg-primary",
      passed: Math.floor(contentScore / 15),
      issues: Math.floor((100 - contentScore) / 15),
    },
    {
      name: "Performance",
      score: performanceScore,
      icon: Gauge,
      color: "text-warning",
      bgColor: "bg-warning/10",
      progressColor: "bg-warning",
      passed: Math.floor(performanceScore / 15),
      issues: Math.floor((100 - performanceScore) / 15),
    },
    {
      name: "User Experience",
      score: uxScore,
      icon: Users,
      color: "text-purple-600",
      bgColor: "bg-purple-100",
      progressColor: "bg-purple-600",
      passed: Math.floor(uxScore / 15),
      issues: Math.floor((100 - uxScore) / 15),
    },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6 mb-8">
      {categories.map((category) => {
        const IconComponent = category.icon;
        return (
          <Card key={category.name} className="hover:shadow-lg transition-all duration-300 transform hover:scale-105 hover:border-blue-200 dark:hover:border-blue-800">
            <CardContent className="p-6">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center space-x-3">
                  <div className={`w-10 h-10 ${category.bgColor} rounded-lg flex items-center justify-center transition-all duration-200 hover:scale-110`}>
                    <IconComponent className={`h-5 w-5 ${category.color}`} />
                  </div>
                  <h3 className="font-semibold text-foreground">{category.name}</h3>
                </div>
                <span className={`text-2xl font-bold ${category.color} transition-all duration-200`}>
                  {category.score}
                </span>
              </div>
              <div className="mb-4">
                <Progress value={category.score} className="h-3 transition-all duration-300" />
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-green-600 dark:text-green-400 font-medium">{category.passed} passed</span>
                <span className="text-red-600 dark:text-red-400 font-medium">{category.issues} issues</span>
              </div>
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
}
