
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { 
  Gift,
  Flame,
  Star,
  Coins,
  Clock,
  CheckCircle,
  Sparkles
} from "lucide-react";
import { useDashboardData } from "@/hooks/useDashboardData";
import { toast } from "sonner";

const DailyClaimCard = () => {
  const { 
    userStats, 
    todaysClaim, 
    canClaimDaily, 
    isClaimingDaily, 
    claimDaily 
  } = useDashboardData();

  const handleClaimDaily = async () => {
    try {
      const claim = await claimDaily();
      toast.success(`🎉 Daily reward claimed! +${claim.points} points`, {
        description: `Streak: ${claim.streak_count} days`
      });
    } catch (error) {
      toast.error("Failed to claim daily reward. Please try again.");
    }
  };

  const currentStreak = userStats?.streak_count || 0;
  const nextMilestone = Math.ceil((currentStreak + 1) / 7) * 7;
  const progressToNextMilestone = ((currentStreak % 7) / 7) * 100;

  return (
    <Card className="relative overflow-hidden border-0 shadow-xl bg-gradient-to-br from-amber-50 via-orange-50 to-yellow-50 dark:from-amber-950/30 dark:via-orange-950/30 dark:to-yellow-950/30 backdrop-blur-sm">
      {/* Enhanced animated background elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-4 -right-4 w-24 h-24 bg-gradient-to-br from-amber-400/30 to-orange-400/30 rounded-full animate-pulse blur-sm"></div>
        <div className="absolute -bottom-6 -left-6 w-32 h-32 bg-gradient-to-br from-yellow-400/20 to-amber-400/20 rounded-full animate-pulse delay-1000 blur-sm"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-16 h-16 bg-gradient-to-br from-orange-300/10 to-amber-300/10 rounded-full animate-ping"></div>
      </div>

      <CardHeader className="relative z-10">
        <CardTitle className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="relative">
              <div className="p-3 rounded-2xl bg-gradient-to-br from-amber-500 to-orange-500 shadow-xl transform hover:scale-105 transition-transform duration-300">
                <Gift className="h-7 w-7 text-white" />
              </div>
              {currentStreak > 0 && (
                <div className="absolute -top-2 -right-2 bg-gradient-to-r from-red-500 to-pink-500 text-white text-xs font-bold rounded-full w-6 h-6 flex items-center justify-center animate-bounce">
                  {currentStreak}
                </div>
              )}
            </div>
            <div>
              <h3 className="text-2xl font-bold bg-gradient-to-r from-amber-600 via-orange-600 to-red-600 bg-clip-text text-transparent">
                Daily Rewards
              </h3>
              <CardDescription className="flex items-center gap-2 mt-1">
                <Flame className="h-5 w-5 text-orange-500 animate-pulse" />
                <span className="font-semibold text-orange-700 dark:text-orange-300">
                  {currentStreak} day streak {currentStreak > 3 && "🔥"}
                </span>
              </CardDescription>
            </div>
          </div>
          
          {todaysClaim && (
            <Badge className="bg-gradient-to-r from-green-100 to-emerald-100 text-green-800 border-green-200 shadow-md animate-pulse">
              <CheckCircle className="h-4 w-4 mr-1" />
              Claimed Today! ✨
            </Badge>
          )}
        </CardTitle>
      </CardHeader>

      <CardContent className="relative z-10 space-y-6">
        {canClaimDaily ? (
          <div className="text-center space-y-4">
            <div className="p-8 rounded-3xl bg-gradient-to-br from-amber-100 via-orange-100 to-yellow-100 dark:from-amber-900/40 dark:via-orange-900/40 dark:to-yellow-900/40 border-2 border-amber-200 dark:border-amber-700 shadow-inner relative overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-br from-white/20 to-transparent"></div>
              <div className="relative z-10">
                <div className="flex items-center justify-center gap-3 mb-4">
                  <div className="p-2 rounded-full bg-gradient-to-br from-amber-400 to-orange-400 shadow-lg">
                    <Coins className="h-10 w-10 text-white animate-spin" style={{ animationDuration: '3s' }} />
                  </div>
                  <div className="text-center">
                    <span className="text-4xl font-black bg-gradient-to-r from-amber-700 via-orange-700 to-red-700 bg-clip-text text-transparent">
                      {Math.floor(50 * (1 + Math.min(currentStreak * 0.1, 2)))}
                    </span>
                    <div className="text-lg font-semibold text-amber-600 dark:text-amber-400">points</div>
                  </div>
                </div>
                
                {currentStreak > 0 && (
                  <div className="flex items-center justify-center gap-2 p-3 bg-gradient-to-r from-amber-200/50 to-orange-200/50 dark:from-amber-800/50 dark:to-orange-800/50 rounded-xl">
                    <Sparkles className="h-5 w-5 text-amber-600 animate-pulse" />
                    <span className="font-bold text-amber-700 dark:text-amber-300">
                      +{Math.round(Math.min(currentStreak * 10, 200))}% streak bonus! 🚀
                    </span>
                  </div>
                )}
              </div>
            </div>

            <Button
              onClick={handleClaimDaily}
              disabled={isClaimingDaily}
              className="w-full h-16 text-xl font-bold bg-gradient-to-r from-amber-500 via-orange-500 to-red-500 hover:from-amber-600 hover:via-orange-600 hover:to-red-600 shadow-2xl hover:shadow-3xl transition-all duration-500 transform hover:scale-[1.05] hover:-translate-y-1 text-white border-0 rounded-2xl relative overflow-hidden"
            >
              {isClaimingDaily ? (
                <div className="flex items-center gap-2">
                  <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                  Claiming...
                </div>
              ) : (
                <div className="flex items-center gap-2">
                  <Gift className="h-5 w-5" />
                  Claim Daily Reward
                </div>
              )}
            </Button>
          </div>
        ) : todaysClaim ? (
          <div className="text-center space-y-4">
            <div className="p-6 rounded-2xl bg-gradient-to-br from-green-100 to-emerald-100 dark:from-green-900/30 dark:to-emerald-900/30 border border-green-200 dark:border-green-800">
              <div className="flex items-center justify-center gap-2 mb-2">
                <CheckCircle className="h-6 w-6 text-green-600" />
                <span className="text-lg font-semibold text-green-700">
                  Already Claimed Today!
                </span>
              </div>
              <div className="flex items-center justify-center gap-2">
                <Coins className="h-5 w-5 text-green-600" />
                <span className="text-xl font-bold text-green-700">
                  +{todaysClaim.points} points earned
                </span>
              </div>
            </div>

            <div className="flex items-center justify-center gap-2 text-sm text-muted-foreground">
              <Clock className="h-4 w-4" />
              <span>Come back tomorrow for your next reward</span>
            </div>
          </div>
        ) : null}
        
        {/* Enhanced Streak Progress */}
        <div className="space-y-4 p-4 bg-gradient-to-r from-amber-50/50 to-orange-50/50 dark:from-amber-950/20 dark:to-orange-950/20 rounded-2xl border border-amber-200/50 dark:border-amber-800/50">
          <div className="flex items-center justify-between">
            <span className="font-bold text-amber-700 dark:text-amber-300">Streak Progress</span>
            <span className="text-sm font-semibold text-amber-600 dark:text-amber-400 bg-amber-100 dark:bg-amber-900/50 px-3 py-1 rounded-full">
              {currentStreak} / {nextMilestone} days
            </span>
          </div>
          
          <div className="relative">
            <Progress 
              value={progressToNextMilestone} 
              className="h-4 bg-amber-100 dark:bg-amber-900/30 shadow-inner"
            />
            <div className="absolute inset-0 bg-gradient-to-r from-amber-400/20 to-orange-400/20 rounded-full"></div>
          </div>
          
          <div className="flex items-center justify-center gap-2 text-sm">
            <Star className="h-4 w-4 text-yellow-500 animate-pulse" />
            <span className="font-medium text-amber-700 dark:text-amber-300">
              {nextMilestone - currentStreak} days until next milestone bonus! 🎯
            </span>
          </div>
          
          {currentStreak >= 7 && (
            <div className="text-center p-2 bg-gradient-to-r from-purple-100 to-pink-100 dark:from-purple-900/30 dark:to-pink-900/30 rounded-xl">
              <span className="text-sm font-bold text-purple-700 dark:text-purple-300">
                🔥 You're on fire! Keep the streak alive! 🔥
              </span>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default DailyClaimCard;
