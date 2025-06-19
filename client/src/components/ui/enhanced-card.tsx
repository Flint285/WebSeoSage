import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { ExternalLink, MoreVertical } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

interface EnhancedCardProps {
  title: string;
  description?: string;
  url?: string;
  status?: "active" | "inactive" | "pending";
  lastAction?: string;
  score?: number;
  children?: React.ReactNode;
  actions?: Array<{
    label: string;
    onClick: () => void;
    icon?: React.ComponentType<{ className?: string }>;
  }>;
  className?: string;
  onCardClick?: () => void;
}

export function EnhancedCard({
  title,
  description,
  url,
  status = "active",
  lastAction,
  score,
  children,
  actions,
  className,
  onCardClick
}: EnhancedCardProps) {
  const getStatusColor = () => {
    switch (status) {
      case "active": return "bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400";
      case "inactive": return "bg-gray-100 text-gray-800 dark:bg-gray-900/20 dark:text-gray-400";
      case "pending": return "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-400";
      default: return "bg-gray-100 text-gray-800 dark:bg-gray-900/20 dark:text-gray-400";
    }
  };

  const getScoreColor = (score: number) => {
    if (score >= 80) return "text-green-600 dark:text-green-400";
    if (score >= 60) return "text-yellow-600 dark:text-yellow-400";
    return "text-red-600 dark:text-red-400";
  };

  return (
    <Card 
      className={cn(
        "group hover:shadow-lg transition-all duration-300 cursor-pointer relative overflow-hidden",
        "hover:scale-105 hover:border-blue-200 dark:hover:border-blue-800",
        className
      )}
      onClick={onCardClick}
    >
      {/* Animated gradient overlay on hover */}
      <div className="absolute inset-0 bg-gradient-to-r from-blue-500/5 to-purple-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
      
      <CardHeader className="relative">
        <div className="flex items-start justify-between">
          <div className="flex-1 min-w-0">
            <CardTitle className="text-lg font-semibold truncate group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
              {title}
            </CardTitle>
            {description && (
              <CardDescription className="mt-1 line-clamp-2">
                {description}
              </CardDescription>
            )}
            {url && (
              <div className="flex items-center mt-2 text-sm text-gray-500 dark:text-gray-400">
                <ExternalLink className="h-3 w-3 mr-1" />
                <span className="truncate">{new URL(url).hostname}</span>
              </div>
            )}
          </div>
          
          <div className="flex items-center space-x-2 ml-4">
            {score !== undefined && (
              <div className="text-right">
                <div className={cn("text-2xl font-bold", getScoreColor(score))}>
                  {score}
                </div>
                <div className="text-xs text-gray-500">Score</div>
              </div>
            )}
            
            <Badge className={cn("text-xs", getStatusColor())}>
              {status.charAt(0).toUpperCase() + status.slice(1)}
            </Badge>
            
            {actions && actions.length > 0 && (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="h-8 w-8 p-0 opacity-0 group-hover:opacity-100 transition-opacity"
                    onClick={(e) => e.stopPropagation()}
                  >
                    <MoreVertical className="h-4 w-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  {actions.map((action, index) => (
                    <DropdownMenuItem
                      key={index}
                      onClick={(e) => {
                        e.stopPropagation();
                        action.onClick();
                      }}
                      className="flex items-center space-x-2"
                    >
                      {action.icon && <action.icon className="h-4 w-4" />}
                      <span>{action.label}</span>
                    </DropdownMenuItem>
                  ))}
                </DropdownMenuContent>
              </DropdownMenu>
            )}
          </div>
        </div>
      </CardHeader>
      
      {(children || lastAction) && (
        <CardContent className="relative">
          {children}
          {lastAction && (
            <div className="mt-4 pt-4 border-t text-xs text-gray-500 dark:text-gray-400">
              {lastAction}
            </div>
          )}
        </CardContent>
      )}
      
      {/* Hover indicator */}
      <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-blue-500 to-purple-500 transform scale-x-0 group-hover:scale-x-100 transition-transform duration-300" />
    </Card>
  );
}