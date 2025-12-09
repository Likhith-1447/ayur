import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  LineChart,
  Line,
  Area,
  AreaChart
} from 'recharts';
import { TrendingUp, Activity, Heart, Brain, Target } from 'lucide-react';
import { cn } from '@/lib/utils';

interface HealthMetric {
  title: string;
  value: number;
  trend: 'up' | 'down' | 'stable';
  category: 'excellent' | 'good' | 'warning' | 'danger';
  icon: React.ComponentType<any>;
}

interface HealthMetricsChartProps {
  userStats?: {
    total_points: number;
    streak_count: number;
    analyses_count: number;
    level: number;
  };
  className?: string;
}

const HealthMetricsChart = ({ userStats, className }: HealthMetricsChartProps) => {
  const totalPoints = userStats?.total_points || 0;
  const dailyStreak = userStats?.streak_count || 0;
  const totalAnalyses = userStats?.analyses_count || 0;

  const healthMetrics: HealthMetric[] = [
    {
      title: "Wellness Score",
      value: Math.min(95, 60 + (totalPoints / 50)),
      trend: totalPoints > 500 ? 'up' : 'stable',
      category: totalPoints > 1000 ? 'excellent' : totalPoints > 500 ? 'good' : 'warning',
      icon: Heart
    },
    {
      title: "Activity Level",
      value: Math.min(90, 40 + totalAnalyses * 5),
      trend: totalAnalyses > 3 ? 'up' : 'stable',
      category: totalAnalyses > 5 ? 'excellent' : totalAnalyses > 2 ? 'good' : 'warning',
      icon: Activity
    },
    {
      title: "Consistency",
      value: Math.min(100, dailyStreak * 10),
      trend: dailyStreak > 5 ? 'up' : dailyStreak > 0 ? 'stable' : 'down',
      category: dailyStreak > 7 ? 'excellent' : dailyStreak > 3 ? 'good' : 'warning',
      icon: Target
    },
    {
      title: "Engagement",
      value: Math.min(85, 50 + totalAnalyses * 3),
      trend: totalAnalyses > 2 ? 'up' : 'stable',
      category: totalAnalyses > 4 ? 'excellent' : totalAnalyses > 1 ? 'good' : 'warning',
      icon: Brain
    }
  ];

  const weeklyData = [
    { day: 'Mon', wellness: 75, activity: 80, consistency: 60 },
    { day: 'Tue', wellness: 78, activity: 85, consistency: 70 },
    { day: 'Wed', wellness: 82, activity: 78, consistency: 80 },
    { day: 'Thu', wellness: 80, activity: 90, consistency: 90 },
    { day: 'Fri', wellness: 85, activity: 88, consistency: 85 },
    { day: 'Sat', wellness: 88, activity: 92, consistency: 95 },
    { day: 'Sun', wellness: 90, activity: 85, consistency: 100 }
  ];

  const getMetricColor = (category: string) => {
    switch (category) {
      case 'excellent': return 'metric-excellent';
      case 'good': return 'metric-good';
      case 'warning': return 'metric-warning';
      case 'danger': return 'metric-danger';
      default: return 'metric-good';
    }
  };

  const getTrendIcon = (trend: string) => {
    switch (trend) {
      case 'up': return '↗️';
      case 'down': return '↘️';
      default: return '→';
    }
  };

  return (
    <div className={cn("space-y-6", className)}>
      {/* Health Metrics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {healthMetrics.map((metric, index) => (
          <Card key={metric.title} className="card-shadow hover:card-shadow-lg transition-all duration-300 animate-fade-in" style={{ animationDelay: `${index * 0.1}s` }}>
            <CardContent className="p-4">
              <div className="flex items-center justify-between mb-2">
                <metric.icon className={cn("h-5 w-5", getMetricColor(metric.category))} />
                <Badge variant="outline" className="text-xs">
                  {getTrendIcon(metric.trend)}
                </Badge>
              </div>
              <div className="space-y-2">
                <div className="flex justify-between items-center">
                  <span className="text-sm font-medium text-muted-foreground">{metric.title}</span>
                  <span className={cn("text-lg font-bold", getMetricColor(metric.category))}>
                    {Math.round(metric.value)}%
                  </span>
                </div>
                <Progress 
                  value={metric.value} 
                  className="h-2"
                />
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Weekly Trends Chart */}
      <div className="grid lg:grid-cols-2 gap-6">
        <Card className="card-shadow hover:card-shadow-lg transition-all duration-300">
          <CardHeader>
            <CardTitle className="flex items-center">
              <TrendingUp className="mr-2 h-5 w-5 text-primary" />
              Weekly Health Trends
            </CardTitle>
            <CardDescription>Your health metrics over the past week</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={250}>
              <AreaChart data={weeklyData}>
                <CartesianGrid strokeDasharray="3 3" className="opacity-30" />
                <XAxis dataKey="day" className="text-xs" />
                <YAxis className="text-xs" />
                <Tooltip 
                  contentStyle={{
                    backgroundColor: 'hsl(var(--card))',
                    border: '1px solid hsl(var(--border))',
                    borderRadius: '8px'
                  }}
                />
                <Area 
                  type="monotone" 
                  dataKey="wellness" 
                  stackId="1"
                  stroke="hsl(var(--health-excellent))" 
                  fill="hsl(var(--health-excellent))"
                  fillOpacity={0.3}
                />
                <Area 
                  type="monotone" 
                  dataKey="activity" 
                  stackId="2"
                  stroke="hsl(var(--health-good))" 
                  fill="hsl(var(--health-good))"
                  fillOpacity={0.3}
                />
                <Area 
                  type="monotone" 
                  dataKey="consistency" 
                  stackId="3"
                  stroke="hsl(var(--primary))" 
                  fill="hsl(var(--primary))"
                  fillOpacity={0.3}  
                />
              </AreaChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card className="card-shadow hover:card-shadow-lg transition-all duration-300">
          <CardHeader>
            <CardTitle className="flex items-center">
              <Activity className="mr-2 h-5 w-5 text-primary" />
              Performance Overview
            </CardTitle>
            <CardDescription>Comparison of your health metrics</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={250}>
              <BarChart data={healthMetrics.map(m => ({ name: m.title.split(' ')[0], value: m.value }))}>
                <CartesianGrid strokeDasharray="3 3" className="opacity-30" />
                <XAxis dataKey="name" className="text-xs" />
                <YAxis className="text-xs" />
                <Tooltip 
                  contentStyle={{
                    backgroundColor: 'hsl(var(--card))',
                    border: '1px solid hsl(var(--border))',
                    borderRadius: '8px'
                  }}
                />
                <Bar 
                  dataKey="value" 
                  fill="hsl(var(--primary))"
                  radius={[4, 4, 0, 0]}
                />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default HealthMetricsChart;