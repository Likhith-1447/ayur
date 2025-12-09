
import { useState, useEffect } from 'react';
import { useUser } from '@clerk/clerk-react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import {
  saveHealthAnalysis,
  getUserHealthAnalyses,
  createHealthAlert,
  getUserHealthAlerts,
  markAlertAsRead,
  getUserProfile,
  updateUserProfile,
  HealthAnalysis,
  HealthAlert,
  UserProfile
} from '@/lib/database';

export const useHealthData = () => {
  const { user } = useUser();
  const queryClient = useQueryClient();

  // Health Analyses
  const {
    data: healthAnalyses,
    isLoading: isLoadingAnalyses,
    error: analysesError
  } = useQuery({
    queryKey: ['health-analyses', user?.id],
    queryFn: () => getUserHealthAnalyses(user!.id),
    enabled: !!user?.id,
  });

  const saveAnalysisMutation = useMutation({
    mutationFn: (analysis: Omit<HealthAnalysis, 'user_id'>) => 
      saveHealthAnalysis({ ...analysis, user_id: user!.id }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['health-analyses', user?.id] });
    },
  });

  // Health Alerts
  const {
    data: healthAlerts,
    isLoading: isLoadingAlerts,
    error: alertsError
  } = useQuery({
    queryKey: ['health-alerts', user?.id],
    queryFn: () => getUserHealthAlerts(user!.id),
    enabled: !!user?.id,
  });

  const createAlertMutation = useMutation({
    mutationFn: (alert: Omit<HealthAlert, 'user_id'>) => 
      createHealthAlert({ ...alert, user_id: user!.id }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['health-alerts', user?.id] });
    },
  });

  const markAlertReadMutation = useMutation({
    mutationFn: markAlertAsRead,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['health-alerts', user?.id] });
    },
  });

  // User Profile
  const {
    data: userProfile,
    isLoading: isLoadingProfile,
    error: profileError
  } = useQuery({
    queryKey: ['user-profile', user?.id],
    queryFn: () => getUserProfile(user!.id),
    enabled: !!user?.id,
  });

  const updateProfileMutation = useMutation({
    mutationFn: (updates: Partial<UserProfile>) => 
      updateUserProfile(user!.id, updates),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['user-profile', user?.id] });
    },
  });

  return {
    // Health Analyses
    healthAnalyses,
    isLoadingAnalyses,
    analysesError,
    saveAnalysis: saveAnalysisMutation.mutateAsync,
    isSavingAnalysis: saveAnalysisMutation.isPending,

    // Health Alerts
    healthAlerts,
    isLoadingAlerts,
    alertsError,
    createAlert: createAlertMutation.mutateAsync,
    markAlertAsRead: markAlertReadMutation.mutateAsync,
    isCreatingAlert: createAlertMutation.isPending,

    // User Profile
    userProfile,
    isLoadingProfile,
    profileError,
    updateProfile: updateProfileMutation.mutateAsync,
    isUpdatingProfile: updateProfileMutation.isPending,
  };
};
