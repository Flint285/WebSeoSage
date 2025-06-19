import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { BarChart3, TrendingUp, TrendingDown, Eye, EyeOff } from "lucide-react";
import { cn } from "@/lib/utils";

interface DataPoint {
  name: string;
  value: number;
  color?: string;
  trend?: number;
}

interface InteractiveChartProps {
  title: string;
  description?: string;
  data: DataPoint[];
  type?: "bar" | "line" | "pie";
  showTrends?: boolean;
  className?: string;
}

export function InteractiveChart({ 
  title, 
  description, 
  data, 
  type = "bar",
  showTrends = false,
  className 
}: InteractiveChartProps) {
  const [hiddenItems, setHiddenItems] = useState<Set<string>>(new Set());
  const [hoveredItem, setHoveredItem] = useState<string | null>(null);

  const visibleData = data.filter(item => !hiddenItems.has(item.name));
  const maxValue = Math.max(...visibleData.map(d => d.value));

  const toggleItem = (name: string) => {
    const newHidden = new Set(hiddenItems);
    if (newHidden.has(name)) {
      newHidden.delete(name);
    } else {
      newHidden.add(name);
    }
    setHiddenItems(newHidden);
  };

  const getTrendIcon = (trend?: number) => {
    if (!trend) return null;
    return trend > 0 ? TrendingUp : TrendingDown;
  };

  const getTrendColor = (trend?: number) => {
    if (!trend) return "text-gray-500";
    return trend > 0 ? "text-green-500" : "text-red-500";
  };

  return (
    <Card className={cn("hover:shadow-lg transition-all duration-200", className)}>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="flex items-center space-x-2">
              <BarChart3 className="h-5 w-5" />
              <span>{title}</span>
            </CardTitle>
            {description && <CardDescription>{description}</CardDescription>}
          </div>
          <Badge variant="secondary" className="text-xs">
            {visibleData.length} items
          </Badge>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Interactive Chart Area */}
        <div className="space-y-3">
          {visibleData.map((item, index) => {
            const TrendIcon = getTrendIcon(item.trend);
            const percentage = (item.value / maxValue) * 100;
            const isHovered = hoveredItem === item.name;
            
            return (
              <div 
                key={item.name}
                className={cn(
                  "group relative p-3 rounded-lg border transition-all duration-200 cursor-pointer",
                  isHovered ? "bg-blue-50 dark:bg-blue-900/20 border-blue-200" : "hover:bg-gray-50 dark:hover:bg-gray-800/50"
                )}
                onMouseEnter={() => setHoveredItem(item.name)}
                onMouseLeave={() => setHoveredItem(null)}
              >
                <div className="flex items-center justify-between mb-2">
                  <span className="font-medium text-sm">{item.name}</span>
                  <div className="flex items-center space-x-2">
                    {showTrends && item.trend && TrendIcon && (
                      <div className={cn("flex items-center text-xs", getTrendColor(item.trend))}>
                        <TrendIcon className="h-3 w-3 mr-1" />
                        <span>{Math.abs(item.trend)}%</span>
                      </div>
                    )}
                    <span className="text-sm font-bold">{item.value.toLocaleString()}</span>
                  </div>
                </div>
                
                {/* Progress Bar */}
                <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2 overflow-hidden">
                  <div 
                    className={cn(
                      "h-full transition-all duration-500 ease-out rounded-full",
                      item.color || "bg-blue-500"
                    )}
                    style={{ 
                      width: `${percentage}%`,
                      transform: isHovered ? 'scaleY(1.2)' : 'scaleY(1)'
                    }}
                  />
                </div>
              </div>
            );
          })}
        </div>

        {/* Legend/Controls */}
        <div className="border-t pt-4">
          <div className="flex flex-wrap gap-2">
            {data.map((item) => (
              <Button
                key={item.name}
                variant={hiddenItems.has(item.name) ? "outline" : "secondary"}
                size="sm"
                onClick={() => toggleItem(item.name)}
                className="text-xs"
              >
                {hiddenItems.has(item.name) ? (
                  <EyeOff className="h-3 w-3 mr-1" />
                ) : (
                  <Eye className="h-3 w-3 mr-1" />
                )}
                {item.name}
              </Button>
            ))}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}