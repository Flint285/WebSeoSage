import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { AnimatedCounter } from "./animated-counter";
import { TooltipInfo } from "./tooltip-info";
import { TrendingUp, TrendingDown, Minus } from "lucide-react";
import { cn } from "@/lib/utils";

interface MetricCardProps {
  title: string;
  value: number;
  previousValue?: number;
  suffix?: string;
  prefix?: string;
  description?: string;
  trend?: "up" | "down" | "neutral";
  trendValue?: number;
  className?: string;
  icon?: React.ComponentType<{ className?: string }>;
}

export function MetricCard({
  title,
  value,
  previousValue,
  suffix = "",
  prefix = "",
  description,
  trend,
  trendValue,
  className,
  icon: Icon
}: MetricCardProps) {
  const getTrendColor = () => {
    switch (trend) {
      case "up": return "text-green-600 dark:text-green-400";
      case "down": return "text-red-600 dark:text-red-400";
      default: return "text-gray-500 dark:text-gray-400";
    }
  };

  const getTrendIcon = () => {
    switch (trend) {
      case "up": return TrendingUp;
      case "down": return TrendingDown;
      default: return Minus;
    }
  };

  const TrendIcon = getTrendIcon();

  return (
    <Card className={cn("hover:shadow-lg transition-shadow", className)}>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium flex items-center space-x-2">
          <span>{title}</span>
          {description && <TooltipInfo content={description} />}
        </CardTitle>
        {Icon && <Icon className="h-4 w-4 text-muted-foreground" />}
      </CardHeader>
      <CardContent>
        <div className="flex items-baseline space-x-2">
          <div className="text-2xl font-bold">
            <AnimatedCounter 
              value={value} 
              prefix={prefix} 
              suffix={suffix}
            />
          </div>
          {trend && trendValue !== undefined && (
            <div className={cn("flex items-center text-sm", getTrendColor())}>
              <TrendIcon className="h-3 w-3 mr-1" />
              <span>{Math.abs(trendValue)}%</span>
            </div>
          )}
        </div>
        {previousValue !== undefined && (
          <p className="text-xs text-muted-foreground mt-1">
            From {prefix}{previousValue.toLocaleString()}{suffix} last period
          </p>
        )}
      </CardContent>
    </Card>
  );
}