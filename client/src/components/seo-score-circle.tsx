interface SeoScoreCircleProps {
  score: number;
  size?: number;
  strokeWidth?: number;
}

export function SeoScoreCircle({ score, size = 192, strokeWidth = 12 }: SeoScoreCircleProps) {
  // Add null safety guards for score
  const safeScore = Math.max(0, Math.min(100, score ?? 0));
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (safeScore / 100) * circumference;

  const getScoreColor = (score: number) => {
    if (score >= 80) return "#00A651"; // secondary color
    if (score >= 60) return "#FF6B35"; // warning color
    return "#E74C3C"; // error color
  };

  const getScoreLabel = (score: number) => {
    if (score >= 80) return "Excellent";
    if (score >= 60) return "Good";
    if (score >= 40) return "Needs Work";
    return "Poor";
  };

  return (
    <div className="relative" style={{ width: size, height: size }}>
      <svg 
        className="transform -rotate-90" 
        width={size} 
        height={size}
      >
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          stroke="#E5E7EB"
          strokeWidth={strokeWidth}
          fill="transparent"
        />
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          stroke={getScoreColor(safeScore)}
          strokeWidth={strokeWidth}
          fill="transparent"
          strokeDasharray={circumference}
          strokeDashoffset={strokeDashoffset}
          strokeLinecap="round"
          className="transition-all duration-2000 ease-out"
          style={{
            filter: `drop-shadow(0 0 8px ${getScoreColor(safeScore)}40)`
          }}
        />
      </svg>
      <div className="absolute inset-0 flex items-center justify-center">
        <div className="text-center group">
          <div className="relative">
            <div className="text-5xl font-bold transition-all duration-500 group-hover:scale-110" style={{ color: getScoreColor(safeScore) }}>
              {safeScore}
            </div>
            <div className="absolute -inset-4 bg-gradient-to-r from-blue-100 to-indigo-100 dark:from-blue-900/20 dark:to-indigo-900/20 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300 -z-10"></div>
          </div>
          <div className="text-lg font-semibold text-muted-foreground capitalize transition-colors duration-300 group-hover:text-foreground">
            {getScoreLabel(safeScore)}
          </div>
        </div>
      </div>
    </div>
  );
}
