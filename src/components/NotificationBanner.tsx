import { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { X, Info, CheckCircle, AlertTriangle, AlertCircle } from 'lucide-react';
import { cn } from '@/lib/utils';

interface NotificationBannerProps {
  type: 'info' | 'success' | 'warning' | 'error';
  title: string;
  message: string;
  persistent?: boolean;
  actionLabel?: string;
  onAction?: () => void;
  onDismiss?: () => void;
}

const NotificationBanner = ({
  type,
  title,
  message,
  persistent = false,
  actionLabel,
  onAction,
  onDismiss
}: NotificationBannerProps) => {
  const [isVisible, setIsVisible] = useState(true);

  const handleDismiss = () => {
    setIsVisible(false);
    onDismiss?.();
  };

  const getIcon = () => {
    switch (type) {
      case 'success':
        return <CheckCircle className="h-5 w-5 text-[hsl(var(--health-excellent))]" />;
      case 'warning':
        return <AlertTriangle className="h-5 w-5 text-[hsl(var(--health-warning))]" />;
      case 'error':
        return <AlertCircle className="h-5 w-5 text-[hsl(var(--health-danger))]" />;
      default:
        return <Info className="h-5 w-5 text-primary" />;
    }
  };

  const getBadgeVariant = () => {
    switch (type) {
      case 'success':
        return 'default';
      case 'warning':
        return 'secondary';
      case 'error':
        return 'destructive';
      default:
        return 'outline';
    }
  };

  const getCardClasses = () => {
    switch (type) {
      case 'success':
        return 'border-[hsl(var(--health-excellent))]/20 bg-[hsl(var(--health-excellent))]/5';
      case 'warning':
        return 'border-[hsl(var(--health-warning))]/20 bg-[hsl(var(--health-warning))]/5';
      case 'error':
        return 'border-[hsl(var(--health-danger))]/20 bg-[hsl(var(--health-danger))]/5';
      default:
        return 'border-primary/20 bg-primary/5';
    }
  };

  if (!isVisible) return null;

  return (
    <Card className={cn("card-shadow animate-fade-in mb-4", getCardClasses())}>
      <CardContent className="p-4">
        <div className="flex items-start justify-between">
          <div className="flex items-start space-x-3 flex-1">
            {getIcon()}
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 mb-1">
                <h4 className="font-semibold text-foreground">{title}</h4>
                <Badge variant={getBadgeVariant()} className="text-xs">
                  {type.toUpperCase()}
                </Badge>
              </div>
              <p className="text-sm text-muted-foreground leading-relaxed">
                {message}
              </p>
              {actionLabel && onAction && (
                <Button
                  variant="outline"
                  size="sm"
                  onClick={onAction}
                  className="mt-2"
                >
                  {actionLabel}
                </Button>
              )}
            </div>
          </div>
          {!persistent && (
            <Button
              variant="ghost"
              size="sm"
              onClick={handleDismiss}
              className="p-1 h-auto hover:bg-background/50"
            >
              <X className="h-4 w-4" />
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default NotificationBanner;