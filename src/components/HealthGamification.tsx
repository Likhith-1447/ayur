
import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { 
  Trophy, 
  Flame, 
  Droplets, 
  Heart, 
  Brain, 
  Star, 
  Award, 
  Target,
  Zap,
  Crown,
  Medal,
  Calendar
} from "lucide-react";

interface Achievement {
  id: string;
  name: string;
  description: string;
  icon: JSX.Element;
  unlocked: boolean;
  progress: number;
  maxProgress: number;
  category: string;
}

interface HealthMetric {
  id: string;
  name: string;
  value: number;
  target: number;
  unit: string;
  icon: JSX.Element;
  color: string;
  streak: number;
}

const HealthGamification = () => {
  const [achievements, setAchievements] = useState<Achievement[]>([]);
  const [healthMetrics, setHealthMetrics] = useState<HealthMetric[]>([]);
  const [userLevel, setUserLevel] = useState(12);
  const [totalPoints, setTotalPoints] = useState(2480);

  useEffect(() => {
    // Initialize achievements
    setAchievements([
      {
        id: '1',
        name: 'Ayurveda Beginner',
        description: 'Complete your first Prakriti assessment',
        icon: <Star className="h-6 w-6" />,
        unlocked: true,
        progress: 1,
        maxProgress: 1,
        category: 'Knowledge'
      },
      {
        id: '2',
        name: 'Dosha Master',
        description: 'Learn about all three doshas',
        icon: <Crown className="h-6 w-6" />,
        unlocked: true,
        progress: 3,
        maxProgress: 3,
        category: 'Knowledge'
      },
      {
        id: '3',
        name: 'Hydration Hero',
        description: 'Maintain 7-day water intake streak',
        icon: <Droplets className="h-6 w-6" />,
        unlocked: true,
        progress: 7,
        maxProgress: 7,
        category: 'Wellness'
      },
      {
        id: '4',
        name: 'Meditation Master',
        description: 'Complete 30 days of meditation',
        icon: <Brain className="h-6 w-6" />,
        unlocked: false,
        progress: 18,
        maxProgress: 30,
        category: 'Mindfulness'
      },
      {
        id: '5',
        name: 'Wellness Warrior',
        description: 'Complete 50 health check-ins',
        icon: <Trophy className="h-6 w-6" />,
        unlocked: false,
        progress: 32,
        maxProgress: 50,
        category: 'Health'
      },
      {
        id: '6',
        name: 'Herb Enthusiast',
        description: 'Try 10 different Ayurvedic herbs',
        icon: <Award className="h-6 w-6" />,
        unlocked: false,
        progress: 6,
        maxProgress: 10,
        category: 'Products'
      }
    ]);

    // Initialize health metrics
    setHealthMetrics([
      {
        id: 'water',
        name: 'Water Intake',
        value: 2.1,
        target: 3.0,
        unit: 'L',
        icon: <Droplets className="h-5 w-5" />,
        color: 'text-blue-600',
        streak: 7
      },
      {
        id: 'meditation',
        name: 'Meditation',
        value: 20,
        target: 30,
        unit: 'min',
        icon: <Brain className="h-5 w-5" />,
        color: 'text-purple-600',
        streak: 18
      },
      {
        id: 'exercise',
        name: 'Exercise',
        value: 0,
        target: 45,
        unit: 'min',
        icon: <Heart className="h-5 w-5" />,
        color: 'text-red-600',
        streak: 0
      },
      {
        id: 'herbs',
        name: 'Herb Intake',
        value: 2,
        target: 2,
        unit: 'doses',
        icon: <Zap className="h-5 w-5" />,
        color: 'text-green-600',
        streak: 5
      }
    ]);
  }, []);

  const getAchievementsByCategory = (category: string) => {
    return achievements.filter(achievement => achievement.category === category);
  };

  const categories = ['Knowledge', 'Wellness', 'Mindfulness', 'Health', 'Products'];

  const levelProgress = (totalPoints % 500) / 500 * 100;
  const nextLevelPoints = 500 - (totalPoints % 500);

  return (
    <div className="space-y-6">
      {/* User Level and Points */}
      <Card className="border-0 shadow-lg bg-gradient-to-r from-purple-50 to-blue-50">
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Medal className="h-6 w-6 text-yellow-600" />
            <span>Your Wellness Level</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-between mb-4">
            <div>
              <div className="text-3xl font-bold text-purple-600">Level {userLevel}</div>
              <div className="text-sm text-gray-600">{totalPoints} total points</div>
            </div>
            <div className="text-right">
              <div className="text-sm text-gray-600">Next level in</div>
              <div className="text-lg font-semibold text-purple-600">{nextLevelPoints} points</div>
            </div>
          </div>
          <Progress value={levelProgress} className="h-3 mb-2" />
          <div className="text-xs text-gray-500 text-center">
            {Math.round(levelProgress)}% to Level {userLevel + 1}
          </div>
        </CardContent>
      </Card>

      {/* Daily Health Metrics */}
      <Card className="border-0 shadow-lg">
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Target className="h-6 w-6 text-green-600" />
            <span>Today's Progress</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid md:grid-cols-2 gap-4">
            {healthMetrics.map((metric) => (
              <div key={metric.id} className="space-y-2">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <div className={metric.color}>{metric.icon}</div>
                    <span className="font-medium">{metric.name}</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    {metric.streak > 0 && (
                      <Badge variant="outline" className="text-xs">
                        <Flame className="h-3 w-3 mr-1" />
                        {metric.streak} day streak
                      </Badge>
                    )}
                  </div>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span>{metric.value} / {metric.target} {metric.unit}</span>
                  <span className={`font-medium ${metric.value >= metric.target ? 'text-green-600' : 'text-gray-600'}`}>
                    {Math.round((metric.value / metric.target) * 100)}%
                  </span>
                </div>
                <Progress value={(metric.value / metric.target) * 100} className="h-2" />
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Achievements */}
      {categories.map((category) => {
        const categoryAchievements = getAchievementsByCategory(category);
        if (categoryAchievements.length === 0) return null;

        return (
          <Card key={category} className="border-0 shadow-lg">
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Award className="h-6 w-6 text-yellow-600" />
                <span>{category} Achievements</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
                {categoryAchievements.map((achievement) => (
                  <div
                    key={achievement.id}
                    className={`p-4 rounded-lg border-2 transition-all duration-300 ${
                      achievement.unlocked
                        ? 'border-yellow-200 bg-yellow-50 shadow-md'
                        : 'border-gray-200 bg-gray-50'
                    }`}
                  >
                    <div className="flex items-center space-x-3 mb-3">
                      <div className={`${achievement.unlocked ? 'text-yellow-600' : 'text-gray-400'}`}>
                        {achievement.icon}
                      </div>
                      <div className="flex-1">
                        <h4 className={`font-semibold ${achievement.unlocked ? 'text-gray-800' : 'text-gray-600'}`}>
                          {achievement.name}
                        </h4>
                        <p className="text-xs text-gray-600">{achievement.description}</p>
                      </div>
                      {achievement.unlocked && (
                        <Badge className="bg-yellow-100 text-yellow-800">
                          <Trophy className="h-3 w-3 mr-1" />
                          Unlocked
                        </Badge>
                      )}
                    </div>
                    {!achievement.unlocked && (
                      <div className="space-y-1">
                        <div className="flex justify-between text-xs">
                          <span>Progress</span>
                          <span>{achievement.progress}/{achievement.maxProgress}</span>
                        </div>
                        <Progress 
                          value={(achievement.progress / achievement.maxProgress) * 100} 
                          className="h-2" 
                        />
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        );
      })}

      {/* Quick Actions */}
      <Card className="border-0 shadow-lg">
        <CardHeader>
          <CardTitle>Boost Your Progress</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-3">
            <Button variant="outline" className="h-auto p-4 flex flex-col items-center space-y-2">
              <Droplets className="h-6 w-6 text-blue-600" />
              <span className="text-sm">Log Water</span>
            </Button>
            <Button variant="outline" className="h-auto p-4 flex flex-col items-center space-y-2">
              <Brain className="h-6 w-6 text-purple-600" />
              <span className="text-sm">Start Meditation</span>
            </Button>
            <Button variant="outline" className="h-auto p-4 flex flex-col items-center space-y-2">
              <Heart className="h-6 w-6 text-red-600" />
              <span className="text-sm">Log Exercise</span>
            </Button>
            <Button variant="outline" className="h-auto p-4 flex flex-col items-center space-y-2">
              <Calendar className="h-6 w-6 text-green-600" />
              <span className="text-sm">Daily Check-in</span>
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default HealthGamification;
