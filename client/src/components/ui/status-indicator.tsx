import { cn } from "@/lib/utils";
import { CheckCircle, AlertCircle, XCircle, Clock } from "lucide-react";

interface StatusIndicatorProps {
  status: "success" | "warning" | "error" | "pending";
  label: string;
  className?: string;
}

export function StatusIndicator({ status, label, className }: StatusIndicatorProps) {
  const configs = {
    success: {
      icon: CheckCircle,
      color: "text-green-600 dark:text-green-400",
      bg: "bg-green-50 dark:bg-green-900/20",
      border: "border-green-200 dark:border-green-800"
    },
    warning: {
      icon: AlertCircle,
      color: "text-yellow-600 dark:text-yellow-400",
      bg: "bg-yellow-50 dark:bg-yellow-900/20",
      border: "border-yellow-200 dark:border-yellow-800"
    },
    error: {
      icon: XCircle,
      color: "text-red-600 dark:text-red-400",
      bg: "bg-red-50 dark:bg-red-900/20",
      border: "border-red-200 dark:border-red-800"
    },
    pending: {
      icon: Clock,
      color: "text-blue-600 dark:text-blue-400",
      bg: "bg-blue-50 dark:bg-blue-900/20",
      border: "border-blue-200 dark:border-blue-800"
    }
  };

  const config = configs[status];
  const Icon = config.icon;

  return (
    <div className={cn(
      "inline-flex items-center space-x-2 px-3 py-1.5 rounded-full border text-sm font-medium",
      config.bg,
      config.border,
      className
    )}>
      <Icon className={cn("h-4 w-4", config.color)} />
      <span className={config.color}>{label}</span>
    </div>
  );
}