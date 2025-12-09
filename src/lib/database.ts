import { supabase } from "@/integrations/supabase/client";
import type {
  Tables,
  TablesInsert,
  TablesUpdate,
} from "@/integrations/supabase/types";

export type HealthAnalysis = Tables<"health_analyses">;
export type HealthAlert = Tables<"health_alerts">;
export type UserProfile = Tables<"profiles">;

// Health Analyses functions
export const getUserHealthAnalyses = async (
  userId: string
): Promise<HealthAnalysis[]> => {
  const { data, error } = await supabase
    .from("health_analyses")
    .select("*")
    .eq("user_id", userId)
    .order("created_at", { ascending: false });

  if (error) {
    console.error("Error fetching health analyses:", error);
    return [];
  }

  return data || [];
};

export const saveHealthAnalysis = async (
  analysis: TablesInsert<"health_analyses">
): Promise<HealthAnalysis> => {
  const { data, error } = await supabase
    .from("health_analyses")
    .insert([analysis])
    .select()
    .single();

  if (error) {
    console.error("Error saving health analysis:", error);
    throw error;
  }

  return data;
};

// Health Alerts functions
export const getUserHealthAlerts = async (
  userId: string
): Promise<HealthAlert[]> => {
  const { data, error } = await supabase
    .from("health_alerts")
    .select("*")
    .eq("user_id", userId)
    .order("created_at", { ascending: false });

  if (error) {
    console.error("Error fetching health alerts:", error);
    return [];
  }

  return data || [];
};

export const createHealthAlert = async (
  alert: TablesInsert<"health_alerts">
): Promise<HealthAlert> => {
  const { data, error } = await supabase
    .from("health_alerts")
    .insert([alert])
    .select()
    .single();

  if (error) {
    console.error("Error creating health alert:", error);
    throw error;
  }

  return data;
};

export const markAlertAsRead = async (alertId: string): Promise<void> => {
  const { error } = await supabase
    .from("health_alerts")
    .update({ is_read: true })
    .eq("id", alertId);

  if (error) {
    console.error("Error marking alert as read:", error);
    throw error;
  }
};

// User Profile functions
export const getUserProfile = async (userId: string): Promise<UserProfile | null> => {
  const { data, error } = await supabase
    .from("profiles")
    .select("*")
    .eq("id", userId)
    .single();

  if (error) {
    console.error("Error fetching user profile:", error);
    return null;
  }

  return data;
};

export const updateUserProfile = async (
  userId: string,
  updates: TablesUpdate<"profiles">
): Promise<UserProfile> => {
  const { data, error } = await supabase
    .from("profiles")
    .update(updates)
    .eq("id", userId)
    .select()
    .single();

  if (error) {
    console.error("Error updating user profile:", error);
    throw error;
  }

  return data;
};

// Medical Image Upload functions
export const uploadMedicalImage = async (
  userId: string,
  file: File,
  fileName: string
): Promise<string> => {
  const filePath = `${userId}/${fileName}`;
  
  const { data, error } = await supabase.storage
    .from('medical-images')
    .upload(filePath, file, {
      cacheControl: '3600',
      upsert: false
    });

  if (error) {
    console.error('Error uploading medical image:', error);
    throw error;
  }

  return data.path;
};

export const getMedicalImageUrl = async (
  userId: string,
  fileName: string
): Promise<string> => {
  const filePath = `${userId}/${fileName}`;
  
  const { data } = supabase.storage
    .from('medical-images')
    .getPublicUrl(filePath);

  return data.publicUrl;
};

// Export types from Supabase tables
export type UserActivity = Tables<"user_activities">;
export type DailyClaim = Tables<"daily_claims">;
export type UserStats = Tables<"user_stats">;
export type Achievement = Tables<"achievements">;

// User Stats functions
export const getUserStats = async (userId: string): Promise<UserStats | null> => {
  const { data, error } = await supabase
    .from('user_stats')
    .select('*')
    .eq('user_id', userId)
    .single();

  if (error) {
    console.error('Error fetching user stats:', error);
    return null;
  }

  return data;
};

export const initializeUserStats = async (userId: string): Promise<UserStats> => {
  const { data, error } = await supabase
    .from('user_stats')
    .insert([{ user_id: userId }])
    .select()
    .single();

  if (error) {
    console.error('Error initializing user stats:', error);
    throw error;
  }

  return data;
};

// Daily Claims functions
export const getTodaysClaim = async (userId: string): Promise<DailyClaim | null> => {
  const start = new Date();
  start.setHours(0, 0, 0, 0);
  const end = new Date();
  end.setHours(23, 59, 59, 999);

  const { data, error } = await supabase
    .from('daily_claims')
    .select('*')
    .eq('user_id', userId)
    .gte('claimed_at', start.toISOString())
    .lt('claimed_at', end.toISOString())
    .maybeSingle();

  if (error) {
    console.error('Error fetching today\'s claim:', error);
    return null;
  }

  return data;
};

export const getLastClaim = async (userId: string): Promise<DailyClaim | null> => {
  const { data, error } = await supabase
    .from('daily_claims')
    .select('*')
    .eq('user_id', userId)
    .order('claimed_at', { ascending: false })
    .limit(1)
    .maybeSingle();

  if (error) {
    console.error('Error fetching last claim:', error);
    return null;
  }

  return data;
};

export const claimDailyReward = async (userId: string): Promise<DailyClaim> => {
  // Get user's current streak and last claim
  const stats = await getUserStats(userId);
  const lastClaim = await getLastClaim(userId);
  
  // Check if streak should continue or reset
  let newStreak = 1;
  const yesterday = new Date();
  yesterday.setDate(yesterday.getDate() - 1);
  const yesterdayStr = yesterday.toISOString().split('T')[0];
  const lastDate = lastClaim?.claimed_at ? new Date(lastClaim.claimed_at).toISOString().split('T')[0] : null;
  
  if (lastDate === yesterdayStr) {
    // Continuing streak from yesterday
    newStreak = (stats?.streak_count || 0) + 1;
  } else if (stats?.streak_count && stats.streak_count > 0) {
    // Streak was broken, reset to 1
    newStreak = 1;
  }
  
  // Calculate bonus based on streak
  const basePoints = 50;
  const bonusMultiplier = Math.min(1 + (newStreak - 1) * 0.1, 3.0); // Max 3x multiplier
  const pointsToAward = Math.floor(basePoints * bonusMultiplier);

  const { data, error } = await supabase
    .from('daily_claims')
    .insert([{ 
      user_id: userId, 
      points: pointsToAward, 
      streak_count: newStreak 
    }])
    .select()
    .single();

  if (error) {
    console.error('Error claiming daily reward:', error);
    throw error;
  }

  // Update user stats
  await supabase
    .from('user_stats')
    .update({
      streak_count: newStreak,
      total_points: (stats?.total_points || 0) + pointsToAward,
      last_claim_date: new Date().toISOString().split('T')[0],
      updated_at: new Date().toISOString()
    })
    .eq('user_id', userId);

  return data as DailyClaim;
};

// User Activities functions
export const getUserActivities = async (userId: string, limit: number = 10): Promise<UserActivity[]> => {
  const { data, error } = await supabase
    .from('user_activities')
    .select('*')
    .eq('user_id', userId)
    .order('completed_at', { ascending: false })
    .limit(limit);

  if (error) {
    console.error('Error fetching user activities:', error);
    return [];
  }

  return data || [];
};

export const logActivity = async (activity: Omit<UserActivity, 'id' | 'created_at' | 'completed_at'>): Promise<UserActivity> => {
  const { data, error } = await supabase
    .from('user_activities')
    .insert([activity])
    .select()
    .single();

  if (error) {
    console.error('Error logging activity:', error);
    throw error;
  }

  return data;
};

// Achievements functions
export const getUserAchievements = async (userId: string): Promise<Achievement[]> => {
  const { data, error } = await supabase
    .from('achievements')
    .select('*')
    .eq('user_id', userId)
    .order('unlocked_at', { ascending: false });

  if (error) {
    console.error('Error fetching achievements:', error);
    return [];
  }

  return data || [];
};

export const unlockAchievement = async (achievement: Omit<Achievement, 'id' | 'unlocked_at'>): Promise<Achievement> => {
  const { data, error } = await supabase
    .from('achievements')
    .insert([achievement])
    .select()
    .single();

  if (error) {
    console.error('Error unlocking achievement:', error);
    throw error;
  }

  return data;
};

// Prakriti Results functions
export type PrakritiResult = Tables<"prakriti_results">;

export const savePrakritiResult = async (
  userId: string,
  results: {
    dominant_dosha: string;
    vata_score: number;
    pitta_score: number;
    kapha_score: number;
    recommendations?: string | null;
  }
): Promise<PrakritiResult> => {
  const { data, error } = await supabase
    .from('prakriti_results')
    .insert([{ user_id: userId, ...results }])
    .select()
    .single();

  if (error) {
    console.error('Error saving prakriti result:', error);
    throw error;
  }

  return data as PrakritiResult;
};

export const getUserPrakritiResult = async (userId: string): Promise<PrakritiResult | null> => {
  const { data, error } = await supabase
    .from('prakriti_results')
    .select('*')
    .eq('user_id', userId)
    .order('created_at', { ascending: false })
    .limit(1)
    .maybeSingle();

  if (error) {
    console.error('Error fetching prakriti result:', error);
    return null;
  }

  return data as PrakritiResult | null;
};
