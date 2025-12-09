import { useUser } from '@clerk/clerk-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Progress } from '@/components/ui/progress';
import { 
  User, 
  Mail, 
  Calendar, 
  Edit, 
  Save, 
  Award, 
  Activity,
  Star,
  Heart,
  TrendingUp,
  Shield,
  Settings
} from 'lucide-react';
import { useState } from 'react';
import { useDashboardData } from '@/hooks/useDashboardData';
import { toast } from 'sonner';
import Navbar from '@/components/Navbar';

const Profile = () => {
  const { user } = useUser();
  const { userStats, isLoadingStats, isRealTimeConnected } = useDashboardData();
  const [isEditing, setIsEditing] = useState(false);
  const [editForm, setEditForm] = useState({
    full_name: '',
    email: '',
  });

  if (!user) return null;

  const handleEditToggle = () => {
    if (isEditing) {
      setIsEditing(false);
    } else {
      setEditForm({
        full_name: user.fullName || '',
        email: user.primaryEmailAddress?.emailAddress || '',
      });
      setIsEditing(true);
    }
  };

  const handleSave = async () => {
    try {
      // Here you would typically update the user profile
      setIsEditing(false);
      toast.success("Profile updated successfully!");
    } catch (error) {
      console.error('Error updating profile:', error);
      toast.error("Failed to update profile");
    }
  };

  const currentLevel = userStats?.level || 1;
  const totalPoints = userStats?.total_points || 0;
  const pointsToNextLevel = 500 - (totalPoints % 500);
  const levelProgress = ((totalPoints % 500) / 500) * 100;

  const achievements = [
    { name: "First Steps", description: "Completed your first health analysis", earned: true, points: 50 },
    { name: "Consistency King", description: "Maintained a 7-day streak", earned: (userStats?.streak_count ?? 0) >= 7, points: 100 },
    { name: "Health Explorer", description: "Tried 5 different health features", earned: (userStats?.analyses_count ?? 0) >= 5, points: 150 },
    { name: "Wellness Warrior", description: "Reached Level 5", earned: currentLevel >= 5, points: 250 },
  ];

  const healthStats = [
    { label: "Total Analyses", value: userStats?.analyses_count || 0, icon: Activity },
    { label: "Current Streak", value: `${userStats?.streak_count || 0} days`, icon: Heart },
    { label: "Total Points", value: totalPoints.toLocaleString(), icon: Star },
    { label: "Current Level", value: currentLevel, icon: Award },
  ];

  return (
    <div className="flex-1 overflow-auto">
      <Navbar isRealTimeConnected={isRealTimeConnected} />
      
      <main className="container mx-auto px-6 py-8 max-w-6xl">
        <div className="space-y-8">
          {/* Profile Header */}
          <div className="flex items-center gap-6 animate-fade-in">
            <Avatar className="w-24 h-24 border-4 border-primary/20 shadow-xl hover:shadow-2xl transition-shadow duration-300">
              <AvatarImage src={user.imageUrl} alt={user.fullName || 'User'} />
              <AvatarFallback className="bg-gradient-to-r from-primary to-purple-600 text-white text-2xl">
                {user.firstName?.[0]}{user.lastName?.[0]}
              </AvatarFallback>
            </Avatar>
            <div className="flex-1 space-y-2">
              <div className="flex items-center gap-4">
                <h1 className="text-3xl font-bold text-foreground">{user.fullName}</h1>
                <Badge className="bg-gradient-to-r from-primary to-purple-600 text-white">
                  Level {currentLevel}
                </Badge>
              </div>
              <p className="text-muted-foreground flex items-center gap-2">
                <Mail className="w-4 h-4" />
                {user.primaryEmailAddress?.emailAddress}
              </p>
              <p className="text-sm text-muted-foreground flex items-center gap-2">
                <Calendar className="w-4 h-4" />
                Member since {new Date(user.createdAt!).toLocaleDateString()}
              </p>
            </div>
            <Button onClick={handleEditToggle} variant="outline" className="hover:scale-105 transition-transform duration-200">
              {isEditing ? <Save className="w-4 h-4 mr-2" /> : <Edit className="w-4 h-4 mr-2" />}
              {isEditing ? 'Save' : 'Edit Profile'}
            </Button>
          </div>

          {/* Level Progress */}
          <Card className="animate-slide-up">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <TrendingUp className="w-5 h-5 text-primary" />
                Level Progress
              </CardTitle>
              <CardDescription>
                {pointsToNextLevel} points to reach Level {currentLevel + 1}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span>Level {currentLevel}</span>
                  <span>Level {currentLevel + 1}</span>
                </div>
                <Progress value={levelProgress} className="h-3" />
                <p className="text-center text-sm text-muted-foreground">
                  {Math.round(levelProgress)}% Complete
                </p>
              </div>
            </CardContent>
          </Card>

          <Tabs defaultValue="overview" className="space-y-6">
            <TabsList className="grid w-full grid-cols-4">
              <TabsTrigger value="overview">Overview</TabsTrigger>
              <TabsTrigger value="achievements">Achievements</TabsTrigger>
              <TabsTrigger value="statistics">Statistics</TabsTrigger>
              <TabsTrigger value="settings">Settings</TabsTrigger>
            </TabsList>

            <TabsContent value="overview" className="space-y-6">
              {/* Health Stats Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {healthStats.map((stat, index) => (
                  <Card key={stat.label} className="hover:shadow-lg transition-shadow duration-300 animate-bounce-in" style={{ animationDelay: `${index * 0.1}s` }}>
                    <CardContent className="p-6 text-center">
                      <stat.icon className="w-8 h-8 text-primary mx-auto mb-3" />
                      <div className="text-2xl font-bold text-foreground mb-1">{stat.value}</div>
                      <div className="text-sm text-muted-foreground">{stat.label}</div>
                    </CardContent>
                  </Card>
                ))}
              </div>

              {/* Recent Activity */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Activity className="w-5 h-5 text-primary" />
                    Recent Activity
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {[
                      { action: "Completed health analysis", time: "2 hours ago", points: 25 },
                      { action: "Logged daily meditation", time: "4 hours ago", points: 15 },
                      { action: "Updated water intake", time: "6 hours ago", points: 5 },
                      { action: "Checked symptoms", time: "1 day ago", points: 10 },
                    ].map((activity, index) => (
                      <div key={index} className="flex items-center justify-between p-3 rounded-lg bg-muted/30 hover:bg-muted/50 transition-colors duration-200">
                        <div>
                          <p className="font-medium">{activity.action}</p>
                          <p className="text-sm text-muted-foreground">{activity.time}</p>
                        </div>
                        <Badge variant="secondary">+{activity.points} pts</Badge>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="achievements" className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {achievements.map((achievement, index) => (
                  <Card key={achievement.name} className={`transition-all duration-300 hover:shadow-lg ${achievement.earned ? 'bg-gradient-to-r from-primary/5 to-purple-600/5 border-primary/20' : 'opacity-60'}`}>
                    <CardContent className="p-6">
                      <div className="flex items-start justify-between mb-4">
                        <div className="flex items-center gap-3">
                          <div className={`p-3 rounded-full ${achievement.earned ? 'bg-gradient-to-r from-primary to-purple-600' : 'bg-muted'}`}>
                            <Award className={`w-6 h-6 ${achievement.earned ? 'text-white' : 'text-muted-foreground'}`} />
                          </div>
                          <div>
                            <h3 className="font-semibold">{achievement.name}</h3>
                            <p className="text-sm text-muted-foreground">{achievement.description}</p>
                          </div>
                        </div>
                        <Badge variant={achievement.earned ? 'default' : 'secondary'}>
                          {achievement.points} pts
                        </Badge>
                      </div>
                      {achievement.earned && (
                        <Badge className="bg-green-100 text-green-800 border-green-200">
                          <Award className="w-3 h-3 mr-1" />
                          Earned
                        </Badge>
                      )}
                    </CardContent>
                  </Card>
                ))}
              </div>
            </TabsContent>

            <TabsContent value="statistics" className="space-y-6">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <Card>
                  <CardHeader>
                    <CardTitle>Health Metrics Overview</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    {[
                      { label: "Wellness Score", value: 85, color: "bg-emerald-500" },
                      { label: "Activity Level", value: 72, color: "bg-blue-500" },
                      { label: "Consistency", value: 68, color: "bg-purple-500" },
                      { label: "Engagement", value: 91, color: "bg-orange-500" },
                    ].map((metric) => (
                      <div key={metric.label} className="space-y-2">
                        <div className="flex justify-between">
                          <span className="text-sm font-medium">{metric.label}</span>
                          <span className="text-sm text-muted-foreground">{metric.value}%</span>
                        </div>
                        <Progress value={metric.value} className="h-2" />
                      </div>
                    ))}
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>Weekly Progress</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-center py-8">
                      <div className="text-4xl font-bold text-primary mb-2">{userStats?.streak_count || 0}</div>
                      <p className="text-muted-foreground">Current Streak</p>
                      <Separator className="my-4" />
                      <div className="text-2xl font-semibold mb-2">{userStats?.streak_count || 0}</div>
                      <p className="text-sm text-muted-foreground">Best Streak</p>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>

            <TabsContent value="settings" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Settings className="w-5 h-5" />
                    Profile Settings
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  {isEditing ? (
                    <div className="space-y-4">
                      <div>
                        <Label htmlFor="full_name">Full Name</Label>
                        <Input
                          id="full_name"
                          value={editForm.full_name}
                          onChange={(e) => setEditForm(prev => ({ ...prev, full_name: e.target.value }))}
                        />
                      </div>
                      <div>
                        <Label htmlFor="email">Email</Label>
                        <Input
                          id="email"
                          type="email"
                          value={editForm.email}
                          onChange={(e) => setEditForm(prev => ({ ...prev, email: e.target.value }))}
                        />
                      </div>
                      <Button onClick={handleSave}>Save Changes</Button>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      <div>
                        <Label>Full Name</Label>
                        <p className="text-sm text-muted-foreground">{user.fullName}</p>
                      </div>
                      <div>
                        <Label>Email</Label>
                        <p className="text-sm text-muted-foreground">{user.primaryEmailAddress?.emailAddress}</p>
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Shield className="w-5 h-5" />
                    Privacy & Security
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-medium">Two-Factor Authentication</p>
                      <p className="text-sm text-muted-foreground">Add an extra layer of security</p>
                    </div>
                    <Button variant="outline" size="sm">Configure</Button>
                  </div>
                  <Separator />
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-medium">Data Export</p>
                      <p className="text-sm text-muted-foreground">Download your health data</p>
                    </div>
                    <Button variant="outline" size="sm">Export</Button>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </main>
    </div>
  );
};

export default Profile;