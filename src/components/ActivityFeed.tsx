
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { 
  Activity,
  Brain,
  Heart,
  Droplets,
  Camera,
  Award,
  TrendingUp,
  Clock,
  Zap
} from "lucide-react";
import { useDashboardData } from "@/hooks/useDashboardData";
import { formatDistanceToNow } from "date-fns";

const ActivityFeed = () => {
  const { recentActivities, isLoadingActivities, isRealTimeConnected } = useDashboardData();

  const getActivityIcon = (type: string) => {
    switch (type.toLowerCase()) {
      case 'daily_claim': return Award;
      case 'health_analysis': return Camera;
      case 'medical_analysis': return Camera;
      case 'symptom_check': return Heart;
      case 'meditation': return Brain;
      case 'exercise': return Activity;
      case 'water_intake': return Droplets;
      case 'level_up': return TrendingUp;
      default: return Zap;
    }
  };

  const getActivityColor = (type: string) => {
    switch (type.toLowerCase()) {
      case 'daily_claim': return 'text-amber-600 bg-amber-100 border-amber-200';
      case 'health_analysis': return 'text-purple-600 bg-purple-100 border-purple-200';
      case 'medical_analysis': return 'text-purple-600 bg-purple-100 border-purple-200';
      case 'symptom_check': return 'text-red-600 bg-red-100 border-red-200';
      case 'meditation': return 'text-indigo-600 bg-indigo-100 border-indigo-200';
      case 'exercise': return 'text-green-600 bg-green-100 border-green-200';
      case 'water_intake': return 'text-blue-600 bg-blue-100 border-blue-200';
      case 'level_up': return 'text-yellow-600 bg-yellow-100 border-yellow-200';
      default: return 'text-gray-600 bg-gray-100 border-gray-200';
    }
  };

  const formatActivityTitle = (type: string, data: any) => {
    switch (type.toLowerCase()) {
      case 'daily_claim': return `Claimed daily reward`;
      case 'health_analysis': return `Completed health analysis`;
      case 'medical_analysis': return `Analyzed medical image`;
      case 'symptom_check': return `Checked symptoms`;
      case 'meditation': return `Completed meditation session`;
      case 'exercise': return `Logged exercise activity`;
      case 'water_intake': return `Logged water intake`;
      case 'level_up': return `Reached level ${data?.new_level || ''}`;
      default: return `Completed ${type.replace('_', ' ')}`;
    }
  };

  const formatActivityDescription = (type: string, data: any, points: number) => {
    const parts = [];
    
    if (points > 0) {
      parts.push(`+${points} points`);
    }
    
    if (data?.duration) {
      parts.push(`${data.duration} minutes`);
    }
    
    if (data?.amount) {
      parts.push(`${data.amount} ${data.unit || ''}`);
    }
    
    return parts.join(' • ');
  };

  if (isLoadingActivities) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Activity className="h-5 w-5" />
            Recent Activity
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {[...Array(5)].map((_, i) => (
              <div key={i} className="flex items-center gap-3 p-3 rounded-lg animate-pulse">
                <div className="w-10 h-10 bg-gray-200 rounded-lg"></div>
                <div className="flex-1 space-y-2">
                  <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                  <div className="h-3 bg-gray-200 rounded w-1/2"></div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Activity className="h-5 w-5" />
            Recent Activity
          </div>
          <div className="flex items-center gap-2">
            {isRealTimeConnected && (
              <Badge variant="outline" className="text-green-700 border-green-200 bg-green-50">
                <div className="w-2 h-2 bg-green-500 rounded-full mr-2 animate-pulse"></div>
                Live
              </Badge>
            )}
          </div>
        </CardTitle>
        <CardDescription>
          Your recent health and wellness activities
        </CardDescription>
      </CardHeader>
      
      <CardContent>
        {!recentActivities || recentActivities.length === 0 ? (
          <div className="text-center py-8 text-muted-foreground">
            <Activity className="h-12 w-12 mx-auto mb-4 opacity-50" />
            <p>No recent activities</p>
            <p className="text-sm mt-1">Start your wellness journey to see activities here</p>
          </div>
        ) : (
          <ScrollArea className="h-96">
            <div className="space-y-3">
              {recentActivities.map((activity) => {
                const Icon = getActivityIcon(activity.activity_type);
                const colorClasses = getActivityColor(activity.activity_type);
                
                return (
                  <div
                    key={activity.id}
                    className="flex items-start gap-3 p-3 rounded-lg hover:bg-muted/50 transition-colors border border-transparent hover:border-border"
                  >
                    <div className={`p-2 rounded-lg border ${colorClasses}`}>
                      <Icon className="h-4 w-4" />
                    </div>
                    
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between">
                        <h4 className="text-sm font-medium truncate">
                        {formatActivityTitle(activity.activity_type, activity.metadata as any)}
                      </h4>
                      <div className="flex items-center gap-1 text-xs text-muted-foreground ml-2">
                        <Clock className="h-3 w-3" />
                        {formatDistanceToNow(new Date(activity.completed_at), { addSuffix: true })}
                      </div>
                    </div>
                    
                    {((activity.points ?? 0) > 0 || activity.metadata) && (
                      <p className="text-xs text-muted-foreground mt-1">
                        {formatActivityDescription(
                          activity.activity_type, 
                          activity.metadata as any, 
                          activity.points ?? 0
                        )}
                      </p>
                    )}
                    
                    {((activity.metadata as any)?.streak_count ?? 0) > 1 && (
                      <Badge variant="outline" className="mt-2 text-xs">
                        <Zap className="h-3 w-3 mr-1" />
                        {(activity.metadata as any)?.streak_count} day streak
                      </Badge>
                    )}
                    </div>
                  </div>
                );
              })}
            </div>
          </ScrollArea>
        )}
      </CardContent>
    </Card>
  );
};

export default ActivityFeed;
