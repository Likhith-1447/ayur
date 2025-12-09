
import { useState, useEffect } from 'react';
import { useUser } from '@clerk/clerk-react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import {
  getUserStats,
  initializeUserStats,
  getTodaysClaim,
  claimDailyReward,
  getUserActivities,
  logActivity,
  getUserAchievements,
  unlockAchievement,
  UserStats,
  DailyClaim,
  UserActivity,
  Achievement
} from '@/lib/database';

export const useDashboardData = () => {
  const { user } = useUser();
  const queryClient = useQueryClient();
  const [isRealTimeConnected, setIsRealTimeConnected] = useState(false);

  // User Stats
  const {
    data: userStats,
    isLoading: isLoadingStats,
    error: statsError
  } = useQuery({
    queryKey: ['user-stats', user?.id],
    queryFn: async () => {
      if (!user?.id) return null;
      let stats = await getUserStats(user.id);
      if (!stats) {
        stats = await initializeUserStats(user.id);
      }
      return stats;
    },
    enabled: !!user?.id,
  });

  // Daily Claim
  const {
    data: todaysClaim,
    isLoading: isLoadingClaim,
    error: claimError
  } = useQuery({
    queryKey: ['todays-claim', user?.id],
    queryFn: () => getTodaysClaim(user!.id),
    enabled: !!user?.id,
  });

  // User Activities
  const {
    data: recentActivities,
    isLoading: isLoadingActivities,
    error: activitiesError
  } = useQuery({
    queryKey: ['user-activities', user?.id],
    queryFn: () => getUserActivities(user!.id, 20),
    enabled: !!user?.id,
  });

  // User Achievements
  const {
    data: achievements,
    isLoading: isLoadingAchievements,
    error: achievementsError
  } = useQuery({
    queryKey: ['user-achievements', user?.id],
    queryFn: () => getUserAchievements(user!.id),
    enabled: !!user?.id,
  });

  // Daily Claim Mutation
  const claimDailyMutation = useMutation({
    mutationFn: () => claimDailyReward(user!.id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['user-stats', user?.id] });
      queryClient.invalidateQueries({ queryKey: ['todays-claim', user?.id] });
      queryClient.invalidateQueries({ queryKey: ['user-activities', user?.id] });
    },
  });

  // Log Activity Mutation
  const logActivityMutation = useMutation({
    mutationFn: (activity: Omit<UserActivity, 'id' | 'created_at' | 'completed_at'>) => 
      logActivity({ ...activity, user_id: user!.id }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['user-activities', user?.id] });
      queryClient.invalidateQueries({ queryKey: ['user-stats', user?.id] });
    },
  });

  // Unlock Achievement Mutation
  const unlockAchievementMutation = useMutation({
    mutationFn: (achievement: Omit<Achievement, 'id' | 'unlocked_at'>) => 
      unlockAchievement({ ...achievement, user_id: user!.id }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['user-achievements', user?.id] });
    },
  });

  // Real-time subscriptions
  useEffect(() => {
    if (!user?.id) return;

    const channels = [
      supabase
        .channel('user-stats-changes')
        .on(
          'postgres_changes',
          {
            event: '*',
            schema: 'public',
            table: 'user_stats',
            filter: `user_id=eq.${user.id}`
          },
          () => {
            queryClient.invalidateQueries({ queryKey: ['user-stats', user.id] });
          }
        )
        .subscribe(),

      supabase
        .channel('user-activities-changes')
        .on(
          'postgres_changes',
          {
            event: 'INSERT',
            schema: 'public',
            table: 'user_activities',
            filter: `user_id=eq.${user.id}`
          },
          () => {
            queryClient.invalidateQueries({ queryKey: ['user-activities', user.id] });
          }
        )
        .subscribe(),

      supabase
        .channel('achievements-changes')
        .on(
          'postgres_changes',
          {
            event: 'INSERT',
            schema: 'public',
            table: 'achievements',
            filter: `user_id=eq.${user.id}`
          },
          () => {
            queryClient.invalidateQueries({ queryKey: ['user-achievements', user.id] });
          }
        )
        .subscribe(),

      supabase
        .channel('daily-claims-changes')
        .on(
          'postgres_changes',
          {
            event: 'INSERT',
            schema: 'public',
            table: 'daily_claims',
            filter: `user_id=eq.${user.id}`
          },
          () => {
            queryClient.invalidateQueries({ queryKey: ['todays-claim', user.id] });
          }
        )
        .subscribe()
    ];

    setIsRealTimeConnected(true);

    return () => {
      channels.forEach(channel => supabase.removeChannel(channel));
      setIsRealTimeConnected(false);
    };
  }, [user?.id, queryClient]);

  const canClaimDaily = !todaysClaim && !claimDailyMutation.isPending;

  return {
    // Data
    userStats,
    todaysClaim,
    recentActivities,
    achievements,
    
    // Loading states
    isLoadingStats,
    isLoadingClaim,
    isLoadingActivities,
    isLoadingAchievements,
    
    // Errors
    statsError,
    claimError,
    activitiesError,
    achievementsError,
    
    // Actions
    claimDaily: claimDailyMutation.mutateAsync,
    logActivity: logActivityMutation.mutateAsync,
    unlockAchievement: unlockAchievementMutation.mutateAsync,
    
    // Status
    canClaimDaily,
    isClaimingDaily: claimDailyMutation.isPending,
    isLoggingActivity: logActivityMutation.isPending,
    isRealTimeConnected,
  };
};
