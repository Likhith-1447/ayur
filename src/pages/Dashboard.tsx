
import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { SidebarTrigger } from "@/components/ui/sidebar";
import { 
  Activity, 
  Heart, 
  Brain, 
  Target, 
  TrendingUp, 
  Award,
  Calendar,
  Droplets,
  Moon,
  Flame,
  Users,
  Zap,
  Star,
  Lock
} from "lucide-react";
import Navbar from "@/components/Navbar";
import HealthGamification from "@/components/HealthGamification";
import DailyClaimCard from "@/components/DailyClaimCard";
import ActivityFeed from "@/components/ActivityFeed";
import PrakritiResults from "@/components/PrakritiResults";
import { useDashboardData } from "@/hooks/useDashboardData";
import { toast } from "sonner";
import { LoadingSkeleton, DashboardSkeleton, StatCardSkeleton } from "@/components/LoadingSkeleton";
import HealthMetricsChart from "@/components/HealthMetricsChart";
import { useUser, SignInButton } from '@clerk/clerk-react';

const Dashboard = () => {
  const { user, isSignedIn } = useUser();
  const { 
    userStats, 
    isLoadingStats, 
    logActivity, 
    isRealTimeConnected 
  } = useDashboardData();

  const handleQuickAction = async (actionType: string, actionData: any = {}) => {
    if (!isSignedIn || !user?.id) {
      toast.error("Please sign in to perform this action", {
        action: {
          label: "Sign In",
          onClick: () => {
            // Clerk's SignInButton will handle this
          }
        }
      });
      return;
    }

    try {
      const points = actionType === 'water_intake' ? 5 : 
                   actionType === 'meditation' ? 15 : 
                   actionType === 'exercise' ? 10 :
                   actionType === 'daily_checkin' ? 20 : 10;
      
      await logActivity({
        user_id: user.id,
        activity_type: actionType,
        metadata: actionData,
        points: points,
        description: ''
      });

      const actionNames = {
        water_intake: '💧 Water logged successfully',
        meditation: '🧘 Meditation session started',
        exercise: '💪 Exercise logged',
        daily_checkin: '✅ Daily check-in completed'
      };

      const actionDescriptions = {
        water_intake: `${actionData.amount || 250}ml added to your hydration goal`,
        meditation: `${actionData.duration || 10} minute session recorded`,
        exercise: `${actionData.duration || 30} minute ${actionData.type || 'workout'} logged`,
        daily_checkin: 'Your daily wellness check is complete'
      };

      toast.success(`${actionNames[actionType] || 'Activity logged'}! +${points} points`, {
        description: actionDescriptions[actionType]
      });
    } catch (error) {
      console.error('Error logging activity:', error);
      toast.error("Failed to log activity. Please try again.");
    }
  };

  const currentLevel = userStats?.level || 1;
  const totalPoints = userStats?.total_points || 0;
  const pointsToNextLevel = 500 - (totalPoints % 500);
  const levelProgress = ((totalPoints % 500) / 500) * 100;

  const healthMetrics = [
    { title: "Wellness Score", value: Math.min(95, 60 + (totalPoints / 50)), color: "bg-emerald-500" },
    { title: "Activity Level", value: Math.min(90, 40 + (userStats?.analyses_count || 0) * 5), color: "bg-blue-500" },
    { title: "Consistency", value: Math.min(100, (userStats?.streak_count || 0) * 10), color: "bg-purple-500" },
    { title: "Engagement", value: Math.min(85, 50 + (userStats?.analyses_count || 0) * 3), color: "bg-orange-500" }
  ];

  const recentActivities = [
    { icon: Heart, activity: "Health Analysis", time: "2 hours ago", status: "completed" },
    { icon: Droplets, activity: "Water Intake", time: "4 hours ago", status: "completed" },
    { icon: Brain, activity: "Meditation", time: "6 hours ago", status: "completed" },
    { icon: Moon, activity: "Sleep Tracking", time: "1 day ago", status: "pending" }
  ];

  if (isLoadingStats) {
    return <DashboardSkeleton />;
  }

  if (!isSignedIn) {
    return (
      <div className="flex-1 flex items-center justify-center min-h-screen bg-gradient-to-br from-background via-background/50 to-muted/30">
        <div className="text-center animate-fade-in">
          <div className="animate-bounce-in mb-8">
            <Lock className="mx-auto h-24 w-24 text-primary mb-6 animate-pulse" />
          </div>
          <h2 className="text-4xl font-bold mb-6 bg-gradient-to-r from-primary to-purple-600 bg-clip-text text-transparent">
            Welcome to AyurWellness
          </h2>
          <p className="text-xl text-muted-foreground mb-8 max-w-md mx-auto leading-relaxed">
            Sign in to unlock your personalized health journey with AI-powered insights and gamified wellness tracking!
          </p>
          <SignInButton mode="modal" fallbackRedirectUrl="/">
            <Button size="lg" className="bg-gradient-to-r from-primary to-purple-600 hover:from-primary/90 hover:to-purple-600/90 text-white font-semibold px-8 py-4 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105 animate-pulse">
              <Lock className="mr-2 h-5 w-5" />
              Sign In to Continue
            </Button>
          </SignInButton>
        </div>
      </div>
    );
  }

  return (
    <div className="flex-1 overflow-auto">
      <Navbar isRealTimeConnected={isRealTimeConnected} />

      <main className="flex-1 overflow-auto">
        <div className="container mx-auto px-6 py-8 max-w-7xl">
          {/* Welcome Section with Level Progress */}
          <div className="mb-8 animate-slide-up">
            <div className="bg-gradient-to-r from-primary/10 via-primary/5 to-transparent rounded-xl p-6 border border-primary/20 hover:shadow-lg transition-all duration-500 transform hover:scale-[1.02]">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <h2 className="text-2xl font-bold text-foreground mb-2 animate-fade-in">
                    Welcome back, {user.firstName || 'Health Warrior'}! 🌟
                  </h2>
                  <p className="text-muted-foreground animate-fade-in" style={{ animationDelay: '0.2s' }}>
                    Continue your journey towards optimal wellness with personalized guidance.
                  </p>
                </div>
                
                <div className="text-right min-w-[200px] animate-scale-in" style={{ animationDelay: '0.3s' }}>
                  <div className="flex items-center gap-2 mb-2">
                    <Star className="h-5 w-5 text-yellow-500 animate-spin" style={{ animationDuration: '3s' }} />
                    <span className="text-xl font-bold">Level {currentLevel}</span>
                  </div>
                  <div className="text-sm text-muted-foreground mb-2">
                    {pointsToNextLevel} points to level {currentLevel + 1}
                  </div>
                  <Progress value={levelProgress} className="h-2 w-full animate-pulse" />
                </div>
              </div>
            </div>
          </div>

          {/* Quick Stats Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            {[
              { 
                title: "Daily Streak", 
                value: `${userStats?.streak_count || 0} days`,
                icon: Flame, 
                color: "text-orange-500",
                loading: isLoadingStats,
                gradient: "from-orange-500 to-red-500"
              },
              { 
                title: "Total Points", 
                value: totalPoints.toLocaleString(), 
                icon: Star, 
                color: "text-yellow-500",
                loading: isLoadingStats,
                gradient: "from-yellow-500 to-orange-500"
              },
              { 
                title: "Health Analyses", 
                value: `${userStats?.analyses_count || 0}`,
                icon: Heart, 
                color: "text-red-500",
                loading: isLoadingStats,
                gradient: "from-red-500 to-pink-500"
              },
              { 
                title: "Current Level", 
                value: `Level ${currentLevel}`, 
                icon: Award, 
                color: "text-purple-500",
                loading: isLoadingStats,
                gradient: "from-purple-500 to-blue-500"
              }
            ].map((stat, index) => (
              <Card key={stat.title} className="animate-bounce-in border-0 shadow-lg hover:shadow-2xl transition-all duration-500 hover-lift cursor-pointer group overflow-hidden relative" style={{ animationDelay: `${index * 0.1}s` }}>
                <div className={`absolute inset-0 bg-gradient-to-r ${stat.gradient} opacity-0 group-hover:opacity-10 transition-opacity duration-500`}></div>
                <CardContent className="p-6 text-center relative z-10">
                  <div className="transform group-hover:scale-110 transition-transform duration-300">
                    <stat.icon className={`h-8 w-8 ${stat.color} mx-auto mb-3 animate-pulse group-hover:animate-bounce`} />
                  </div>
                  {stat.loading ? (
                    <div className="space-y-2">
                      <div className="h-8 bg-gray-200 rounded animate-pulse"></div>
                      <div className="h-4 bg-gray-200 rounded animate-pulse"></div>
                    </div>
                  ) : (
                    <>
                      <div className="text-2xl font-bold text-foreground mb-1 group-hover:text-primary transition-colors duration-300">{stat.value}</div>
                      <div className="text-sm text-muted-foreground group-hover:text-primary/70 transition-colors duration-300">{stat.title}</div>
                    </>
                  )}
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Prakriti Results Section */}
          <div className="mb-8 animate-fade-in" style={{ animationDelay: '0.35s' }}>
            <PrakritiResults />
          </div>

          {/* Daily Claim and Activity Feed */}
          <div className="grid lg:grid-cols-3 gap-8 mb-8 animate-fade-in" style={{ animationDelay: '0.4s' }}>
            <div className="lg:col-span-1 transform hover:scale-105 transition-transform duration-300">
              <DailyClaimCard />
            </div>
            <div className="lg:col-span-2 transform hover:scale-105 transition-transform duration-300">
              <ActivityFeed />
            </div>
          </div>

          {/* Enhanced Health Metrics with Professional Charts */}
          <div className="mb-8 animate-fade-in" style={{ animationDelay: '0.45s' }}>
            <HealthMetricsChart userStats={userStats || undefined} />
          </div>

          {/* Enhanced Gamification Section */}
          <div className="mb-8 animate-bounce-in transform hover:scale-105 transition-transform duration-500" style={{ animationDelay: "0.2s" }}>
            <HealthGamification />
          </div>

          {/* Enhanced Quick Actions with Complete Functionality */}
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 animate-slide-up" style={{ animationDelay: "0.3s" }}>
            {[
              { 
                title: "Log Water", 
                description: "Track your daily hydration",
                action: () => handleQuickAction('water_intake', { amount: 250, unit: 'ml', timestamp: new Date().toISOString() }),
                icon: Droplets,
                color: "from-blue-500 to-cyan-500",
                points: 5
              },
              { 
                title: "Start Meditation", 
                description: "Begin mindfulness practice",
                action: () => handleQuickAction('meditation', { duration: 10, type: 'mindfulness', timestamp: new Date().toISOString() }),
                icon: Brain,
                color: "from-purple-500 to-pink-500",
                points: 15
              },
              { 
                title: "Log Exercise", 
                description: "Record your workout",
                action: () => handleQuickAction('exercise', { type: 'general', duration: 30, intensity: 'moderate', timestamp: new Date().toISOString() }),
                icon: Heart,
                color: "from-red-500 to-orange-500",
                points: 10
              },
              { 
                title: "Daily Check-in", 
                description: "Complete wellness assessment",
                action: () => handleQuickAction('daily_checkin', { mood: 'good', energy: 7, sleep_quality: 'good', timestamp: new Date().toISOString() }),
                icon: Users,
                color: "from-green-500 to-emerald-500",
                points: 20
              }
            ].map((action, index) => (
              <Card key={action.title} className="border-0 shadow-lg hover:shadow-2xl transition-all duration-500 hover-lift cursor-pointer group overflow-hidden relative animate-bounce-in" style={{ animationDelay: `${index * 0.1}s` }}>
                <div className={`absolute inset-0 bg-gradient-to-r ${action.color} opacity-0 group-hover:opacity-10 transition-opacity duration-500`}></div>
                <CardContent className="p-6 text-center relative z-10">
                  <div className={`mx-auto h-12 w-12 rounded-xl bg-gradient-to-r ${action.color} p-3 mb-4 shadow-lg transform group-hover:scale-125 group-hover:rotate-12 transition-all duration-500 animate-pulse`}>
                    <action.icon className="h-6 w-6 text-white" />
                  </div>
                  <h3 className="font-semibold text-foreground mb-2 group-hover:text-primary transition-colors duration-300">{action.title}</h3>
                  <p className="text-sm text-muted-foreground mb-2 group-hover:text-primary/70 transition-colors duration-300">{action.description}</p>
                  <div className="flex items-center justify-center gap-1 mb-4">
                    <Star className="h-3 w-3 text-yellow-500" />
                    <span className="text-xs font-medium text-yellow-600">+{action.points} points</span>
                  </div>
                  <Button 
                    onClick={action.action}
                    className="w-full transform hover:scale-110 transition-all duration-300 hover:shadow-lg bg-gradient-to-r from-primary to-purple-600 hover:from-primary/90 hover:to-purple-600/90"
                    variant="outline"
                  >
                    <Zap className="h-4 w-4 mr-2" />
                    Complete Now
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </main>
    </div>
  );
};

export default Dashboard;
