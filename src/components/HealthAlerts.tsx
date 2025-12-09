
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { useHealthData } from "@/hooks/useHealthData";
import { AlertTriangle, CheckCircle, Info, Calendar, Eye } from "lucide-react";
import { format } from "date-fns";

const HealthAlerts = () => {
  const { healthAlerts, isLoadingAlerts, alertsError, markAlertAsRead } = useHealthData();

  const getSeverityIcon = (severity: string) => {
    switch (severity) {
      case 'high':
        return <AlertTriangle className="h-4 w-4 text-red-500" />;
      case 'medium':
        return <Info className="h-4 w-4 text-yellow-500" />;
      case 'low':
        return <CheckCircle className="h-4 w-4 text-green-500" />;
      default:
        return <Info className="h-4 w-4" />;
    }
  };

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'high':
        return 'destructive';
      case 'medium':
        return 'default';
      case 'low':
        return 'secondary';
      default:
        return 'outline';
    }
  };

  const handleMarkAsRead = async (alertId: string) => {
    try {
      await markAlertAsRead(alertId);
    } catch (error) {
      console.error('Error marking alert as read:', error);
    }
  };

  if (isLoadingAlerts) {
    return (
      <div className="space-y-4">
        <Skeleton className="h-24 w-full" />
        <Skeleton className="h-24 w-full" />
        <Skeleton className="h-24 w-full" />
      </div>
    );
  }

  if (alertsError) {
    return (
      <Card>
        <CardContent className="p-6">
          <p className="text-destructive">Error loading health alerts</p>
        </CardContent>
      </Card>
    );
  }

  if (!healthAlerts || healthAlerts.length === 0) {
    return (
      <Card>
        <CardContent className="p-6 text-center">
          <CheckCircle className="h-12 w-12 mx-auto mb-4 text-green-500" />
          <p className="text-muted-foreground">No health alerts</p>
          <p className="text-sm text-muted-foreground mt-2">
            You're all caught up with your health notifications
          </p>
        </CardContent>
      </Card>
    );
  }

  const unreadAlerts = healthAlerts.filter(alert => !alert.is_read);
  const readAlerts = healthAlerts.filter(alert => alert.is_read);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold">Health Alerts</h2>
        {unreadAlerts.length > 0 && (
          <Badge variant="destructive">
            {unreadAlerts.length} unread
          </Badge>
        )}
      </div>

      {unreadAlerts.length > 0 && (
        <div className="space-y-3">
          <h3 className="text-lg font-semibold">Unread Alerts</h3>
          {unreadAlerts.map((alert) => (
            <Card key={alert.id} className="border-l-4 border-l-red-500">
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                  <CardTitle className="flex items-center gap-2 text-lg">
                    {getSeverityIcon(alert.severity)}
                    {alert.title}
                  </CardTitle>
                  <div className="flex items-center gap-2">
                    <Badge variant={getSeverityColor(alert.severity) as any}>
                      {alert.severity}
                    </Badge>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => handleMarkAsRead(alert.id!)}
                    >
                      <Eye className="h-3 w-3 mr-1" />
                      Mark Read
                    </Button>
                  </div>
                </div>
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <Calendar className="h-3 w-3" />
                  {format(new Date(alert.created_at!), 'MMM d, yyyy HH:mm')}
                  <Badge variant="outline" className="ml-2">
                    {alert.type}
                  </Badge>
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">{alert.message}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {readAlerts.length > 0 && (
        <div className="space-y-3">
          <h3 className="text-lg font-semibold text-muted-foreground">Read Alerts</h3>
          {readAlerts.map((alert) => (
            <Card key={alert.id} className="opacity-60">
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                  <CardTitle className="flex items-center gap-2 text-base">
                    {getSeverityIcon(alert.severity)}
                    {alert.title}
                  </CardTitle>
                  <div className="flex items-center gap-2">
                    <Badge variant="outline">
                      {alert.severity}
                    </Badge>
                    <CheckCircle className="h-4 w-4 text-green-500" />
                  </div>
                </div>
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <Calendar className="h-3 w-3" />
                  {format(new Date(alert.created_at!), 'MMM d, yyyy HH:mm')}
                  <Badge variant="outline" className="ml-2">
                    {alert.type}
                  </Badge>
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground text-sm">{alert.message}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
};

export default HealthAlerts;
