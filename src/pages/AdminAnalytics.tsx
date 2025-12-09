
import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  ResponsiveContainer, 
  LineChart, 
  Line, 
  PieChart, 
  Pie, 
  Cell, 
  AreaChart, 
  Area 
} from 'recharts';
import { 
  Users, 
  Activity, 
  TrendingUp, 
  MapPin, 
  Package, 
  AlertTriangle, 
  Star, 
  Calendar,
  Zap,
  Brain,
  Heart,
  Shield,
  Download,
  Filter
} from "lucide-react";
import { Link } from "react-router-dom";

const AdminAnalytics = () => {
  const [timeRange, setTimeRange] = useState('7d');
  const [selectedMetric, setSelectedMetric] = useState('users');

  // Mock data for analytics
  const userActivityData = [
    { date: '2024-01-01', users: 1200, sessions: 2400, pageViews: 9600 },
    { date: '2024-01-02', users: 1350, sessions: 2700, pageViews: 10800 },
    { date: '2024-01-03', users: 1180, sessions: 2360, pageViews: 9440 },
    { date: '2024-01-04', users: 1520, sessions: 3040, pageViews: 12160 },
    { date: '2024-01-05', users: 1680, sessions: 3360, pageViews: 13440 },
    { date: '2024-01-06', users: 1420, sessions: 2840, pageViews: 11360 },
    { date: '2024-01-07', users: 1890, sessions: 3780, pageViews: 15120 }
  ];

  const symptomTrendsData = [
    { symptom: 'Digestive Issues', count: 2847, growth: 12.5 },
    { symptom: 'Sleep Problems', count: 2156, growth: 8.3 },
    { symptom: 'Stress & Anxiety', count: 1923, growth: 15.7 },
    { symptom: 'Joint Pain', count: 1567, growth: -2.1 },
    { symptom: 'Skin Issues', count: 1234, growth: 6.8 },
    { symptom: 'Headaches', count: 987, growth: 4.2 },
    { symptom: 'Fatigue', count: 856, growth: 9.1 }
  ];

  const popularProductsData = [
    { name: 'Ashwagandha Capsules', sales: 3247, revenue: 2896830, rating: 4.8 },
    { name: 'Triphala Churna', sales: 2156, revenue: 860440, rating: 4.6 },
    { name: 'Turmeric Complex', sales: 1923, revenue: 1248870, rating: 4.9 },
    { name: 'Brahmi Oil', sales: 1567, revenue: 1174050, rating: 4.7 },
    { name: 'Giloy Tablets', sales: 1234, revenue: 739356, rating: 4.6 }
  ];

  const regionalData = [
    { region: 'Maharashtra', users: 3245, topSymptom: 'Digestive Issues' },
    { region: 'Karnataka', users: 2876, topSymptom: 'Sleep Problems' },
    { region: 'Tamil Nadu', users: 2654, topSymptom: 'Stress & Anxiety' },
    { region: 'Delhi', users: 2341, topSymptom: 'Joint Pain' },
    { region: 'Gujarat', users: 2098, topSymptom: 'Skin Issues' },
    { region: 'West Bengal', users: 1876, topSymptom: 'Headaches' },
    { region: 'Rajasthan', users: 1654, topSymptom: 'Fatigue' }
  ];

  const doshaDistribution = [
    { name: 'Vata', value: 35, color: '#3b82f6' },
    { name: 'Pitta', value: 40, color: '#ef4444' },
    { name: 'Kapha', value: 25, color: '#22c55e' }
  ];

  const featureUsageData = [
    { feature: 'Symptom Checker', usage: 89, users: 12456 },
    { feature: 'Product Store', usage: 76, users: 10678 },
    { feature: 'AI Health Tips', usage: 72, users: 10123 },
    { feature: 'Prakriti Test', usage: 68, users: 9567 },
    { feature: 'Nutrition Advisor', usage: 54, users: 7623 },
    { feature: 'Medical Analysis', usage: 43, users: 6012 },
    { feature: 'Fitness Planner', usage: 38, users: 5344 }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      {/* Navigation */}
      <nav className="border-b bg-white/95 backdrop-blur-md sticky top-0 z-50 shadow-sm">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <Link to="/" className="flex items-center space-x-2 hover:opacity-80 transition-opacity">
              <Activity className="h-6 w-6 text-blue-600" />
              <span className="text-xl font-bold text-gray-800">AyurGen Admin - Analytics</span>
            </Link>
            <div className="flex items-center space-x-4">
              <Button variant="outline" size="sm">
                <Download className="mr-2 h-4 w-4" />
                Export Data
              </Button>
              <Button variant="outline" size="sm">
                <Filter className="mr-2 h-4 w-4" />
                Filters
              </Button>
            </div>
          </div>
        </div>
      </nav>

      <div className="container mx-auto px-4 py-8">
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <div className="mb-8 animate-fade-in">
            <h1 className="text-4xl font-bold text-gray-800 mb-2 bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              Analytics Dashboard
            </h1>
            <p className="text-lg text-gray-600">
              Real-time insights into user activity, health trends, and platform performance
            </p>
          </div>

          {/* Key Metrics */}
          <div className="grid lg:grid-cols-4 gap-6 mb-8">
            <Card className="border-0 shadow-lg hover:shadow-xl transition-all duration-300">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">Total Users</p>
                    <p className="text-3xl font-bold text-blue-600">24,847</p>
                    <p className="text-sm text-green-600 flex items-center mt-1">
                      <TrendingUp className="h-4 w-4 mr-1" />
                      +12.5% from last month
                    </p>
                  </div>
                  <Users className="h-12 w-12 text-blue-600 opacity-20" />
                </div>
              </CardContent>
            </Card>

            <Card className="border-0 shadow-lg hover:shadow-xl transition-all duration-300">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">Active Sessions</p>
                    <p className="text-3xl font-bold text-green-600">3,127</p>
                    <p className="text-sm text-green-600 flex items-center mt-1">
                      <TrendingUp className="h-4 w-4 mr-1" />
                      +8.3% from yesterday
                    </p>
                  </div>
                  <Zap className="h-12 w-12 text-green-600 opacity-20" />
                </div>
              </CardContent>
            </Card>

            <Card className="border-0 shadow-lg hover:shadow-xl transition-all duration-300">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">AI Consultations</p>
                    <p className="text-3xl font-bold text-purple-600">18,923</p>
                    <p className="text-sm text-green-600 flex items-center mt-1">
                      <TrendingUp className="h-4 w-4 mr-1" />
                      +15.7% this week
                    </p>
                  </div>
                  <Brain className="h-12 w-12 text-purple-600 opacity-20" />
                </div>
              </CardContent>
            </Card>

            <Card className="border-0 shadow-lg hover:shadow-xl transition-all duration-300">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">Product Sales</p>
                    <p className="text-3xl font-bold text-orange-600">₹12.4L</p>
                    <p className="text-sm text-green-600 flex items-center mt-1">
                      <TrendingUp className="h-4 w-4 mr-1" />
                      +22.1% this month
                    </p>
                  </div>
                  <Package className="h-12 w-12 text-orange-600 opacity-20" />
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Analytics Tabs */}
          <Tabs defaultValue="overview" className="space-y-6">
            <TabsList className="grid w-full grid-cols-5">
              <TabsTrigger value="overview">Overview</TabsTrigger>
              <TabsTrigger value="symptoms">Symptoms</TabsTrigger>
              <TabsTrigger value="products">Products</TabsTrigger>
              <TabsTrigger value="regional">Regional</TabsTrigger>
              <TabsTrigger value="features">Features</TabsTrigger>
            </TabsList>

            <TabsContent value="overview" className="space-y-6">
              <div className="grid lg:grid-cols-3 gap-6">
                <Card className="lg:col-span-2 border-0 shadow-lg">
                  <CardHeader>
                    <CardTitle>User Activity Trends</CardTitle>
                    <CardDescription>Daily user engagement over the past week</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <ResponsiveContainer width="100%" height={300}>
                      <AreaChart data={userActivityData}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="date" />
                        <YAxis />
                        <Area type="monotone" dataKey="users" stroke="#3b82f6" fill="#3b82f6" fillOpacity={0.1} />
                        <Area type="monotone" dataKey="sessions" stroke="#22c55e" fill="#22c55e" fillOpacity={0.1} />
                      </AreaChart>
                    </ResponsiveContainer>
                  </CardContent>
                </Card>

                <Card className="border-0 shadow-lg">
                  <CardHeader>
                    <CardTitle>Dosha Distribution</CardTitle>
                    <CardDescription>User constitution analysis</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <ResponsiveContainer width="100%" height={300}>
                      <PieChart>
                        <Pie
                          data={doshaDistribution}
                          cx="50%"
                          cy="50%"
                          outerRadius={80}
                          dataKey="value"
                          label={({ name, value }) => `${name}: ${value}%`}
                        >
                          {doshaDistribution.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={entry.color} />
                          ))}
                        </Pie>
                      </PieChart>
                    </ResponsiveContainer>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>

            <TabsContent value="symptoms" className="space-y-6">
              <Card className="border-0 shadow-lg">
                <CardHeader>
                  <CardTitle>Top Reported Symptoms</CardTitle>
                  <CardDescription>Most common health concerns reported by users</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {symptomTrendsData.map((symptom, index) => (
                      <div key={index} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                        <div className="flex items-center space-x-4">
                          <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                            <span className="text-sm font-bold text-blue-600">{index + 1}</span>
                          </div>
                          <div>
                            <h4 className="font-semibold text-gray-800">{symptom.symptom}</h4>
                            <p className="text-sm text-gray-600">{symptom.count} reports</p>
                          </div>
                        </div>
                        <div className="text-right">
                          <Badge className={symptom.growth > 0 ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}>
                            {symptom.growth > 0 ? '+' : ''}{symptom.growth}%
                          </Badge>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="products" className="space-y-6">
              <Card className="border-0 shadow-lg">
                <CardHeader>
                  <CardTitle>Best Selling Products</CardTitle>
                  <CardDescription>Top performing products by sales and revenue</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {popularProductsData.map((product, index) => (
                      <div key={index} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                        <div className="flex items-center space-x-4">
                          <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
                            <span className="text-sm font-bold text-green-600">{index + 1}</span>
                          </div>
                          <div>
                            <h4 className="font-semibold text-gray-800">{product.name}</h4>
                            <p className="text-sm text-gray-600">{product.sales} units sold</p>
                          </div>
                        </div>
                        <div className="text-right">
                          <p className="font-semibold text-gray-800">₹{(product.revenue / 100000).toFixed(1)}L</p>
                          <div className="flex items-center space-x-1">
                            <Star className="h-4 w-4 text-yellow-400 fill-current" />
                            <span className="text-sm text-gray-600">{product.rating}</span>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="regional" className="space-y-6">
              <Card className="border-0 shadow-lg">
                <CardHeader>
                  <CardTitle>Regional Health Trends</CardTitle>
                  <CardDescription>User distribution and top symptoms by state</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {regionalData.map((region, index) => (
                      <div key={index} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                        <div className="flex items-center space-x-4">
                          <MapPin className="h-6 w-6 text-blue-600" />
                          <div>
                            <h4 className="font-semibold text-gray-800">{region.region}</h4>
                            <p className="text-sm text-gray-600">{region.users} active users</p>
                          </div>
                        </div>
                        <div className="text-right">
                          <Badge variant="outline">{region.topSymptom}</Badge>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="features" className="space-y-6">
              <Card className="border-0 shadow-lg">
                <CardHeader>
                  <CardTitle>Feature Usage Analytics</CardTitle>
                  <CardDescription>How users interact with different platform features</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {featureUsageData.map((feature, index) => (
                      <div key={index} className="space-y-2">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center space-x-3">
                            <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                            <span className="font-medium">{feature.feature}</span>
                          </div>
                          <div className="text-sm text-gray-600">
                            {feature.users} users ({feature.usage}%)
                          </div>
                        </div>
                        <Progress value={feature.usage} className="h-2" />
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  );
};

export default AdminAnalytics;
