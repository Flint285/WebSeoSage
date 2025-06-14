import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import type { ScoreHistory } from "@shared/schema";

interface ScoreTrendsChartProps {
  data: ScoreHistory[];
  title?: string;
}

export function ScoreTrendsChart({ data, title = "SEO Score Trends" }: ScoreTrendsChartProps) {
  const chartData = data.map(entry => ({
    date: new Date(entry.date).toLocaleDateString(),
    Overall: entry.overallScore,
    Technical: entry.technicalScore,
    Content: entry.contentScore,
    Performance: entry.performanceScore,
    UX: entry.uxScore,
  })).reverse(); // Reverse to show oldest to newest

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-xl text-foreground">{title}</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="h-80">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis 
                dataKey="date" 
                fontSize={12}
                tickLine={false}
                axisLine={false}
              />
              <YAxis 
                domain={[0, 100]}
                fontSize={12}
                tickLine={false}
                axisLine={false}
              />
              <Tooltip 
                contentStyle={{
                  backgroundColor: 'white',
                  border: '1px solid #e2e8f0',
                  borderRadius: '8px',
                }}
              />
              <Legend />
              <Line 
                type="monotone" 
                dataKey="Overall" 
                stroke="#0066CC" 
                strokeWidth={3}
                dot={{ fill: '#0066CC', strokeWidth: 2, r: 4 }}
              />
              <Line 
                type="monotone" 
                dataKey="Technical" 
                stroke="#00A651" 
                strokeWidth={2}
                dot={{ fill: '#00A651', strokeWidth: 2, r: 3 }}
              />
              <Line 
                type="monotone" 
                dataKey="Content" 
                stroke="#FF6B35" 
                strokeWidth={2}
                dot={{ fill: '#FF6B35', strokeWidth: 2, r: 3 }}
              />
              <Line 
                type="monotone" 
                dataKey="Performance" 
                stroke="#9333EA" 
                strokeWidth={2}
                dot={{ fill: '#9333EA', strokeWidth: 2, r: 3 }}
              />
              <Line 
                type="monotone" 
                dataKey="UX" 
                stroke="#F59E0B" 
                strokeWidth={2}
                dot={{ fill: '#F59E0B', strokeWidth: 2, r: 3 }}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
}