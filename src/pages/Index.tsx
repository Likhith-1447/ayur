
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { SidebarTrigger } from "@/components/ui/sidebar";
import { 
  Activity, 
  Heart, 
  Brain, 
  Leaf, 
  Shield, 
  Sparkles,
  Users,
  Award,
  Globe,
  Stethoscope,
  FlaskConical,
  BookOpen
} from "lucide-react";
import { Link } from "react-router-dom";
import ThemeToggle from "@/components/ThemeToggle";

const Index = () => {
  const features = [
    {
      icon: Activity,
      title: "AI Health Analysis",
      description: "Advanced symptom analysis with personalized recommendations",
      color: "from-emerald-500 to-teal-600",
      link: "/analysis"
    },
    {
      icon: Stethoscope,
      title: "Symptom Checker",
      description: "Intelligent symptom assessment and health insights",
      color: "from-rose-500 to-pink-600",
      link: "/symptom-checker"
    },
    {
      icon: Brain,
      title: "AI Assistant",
      description: "24/7 Virtual Vaidya for instant health guidance",
      color: "from-blue-500 to-indigo-600",
      link: "/assistant"
    },
    {
      icon: Leaf,
      title: "Ayurvedic Products",
      description: "Curated authentic herbs and natural remedies",
      color: "from-green-500 to-emerald-600",
      link: "/products"
    },
    {
      icon: FlaskConical,
      title: "Prakriti Test",
      description: "Discover your unique Ayurvedic constitution",
      color: "from-purple-500 to-violet-600",
      link: "/prakriti-test"
    },
    {
      icon: Shield,
      title: "Health Alerts",
      description: "Real-time disease forecasting and prevention",
      color: "from-orange-500 to-red-600",
      link: "/alerts"
    }
  ];

  const stats = [
    { number: "50K+", label: "Active Users", icon: Users },
    { number: "95%", label: "Accuracy Rate", icon: Award },
    { number: "24/7", label: "AI Support", icon: Globe },
    { number: "1000+", label: "Herbs Database", icon: BookOpen }
  ];

  return (
    <div className="flex-1 overflow-auto">
      {/* Enhanced Header */}
      <header className="sticky top-0 z-40 border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="flex h-16 items-center justify-between gap-4 px-6">
          <div className="flex items-center gap-4">
            <SidebarTrigger className="-ml-1" />
            <div className="flex items-center space-x-3 animate-fade-in">
              <div className="relative">
                <Heart className="h-7 w-7 text-primary" />
                <div className="absolute -top-1 -right-1 h-3 w-3 bg-emerald-500 rounded-full animate-pulse"></div>
              </div>
              <div>
                <h1 className="text-lg font-semibold text-foreground">
                  AyurGen Health
                </h1>
                <p className="text-sm text-muted-foreground">
                  AI-Powered Ayurvedic Wellness
                </p>
              </div>
            </div>
          </div>
          
          <div className="flex items-center gap-4">
            <ThemeToggle />
          </div>
        </div>
      </header>

      <main className="flex-1 overflow-auto">
        <div className="container mx-auto px-6 py-12 max-w-7xl">
          {/* Hero Section */}
          <div className="text-center mb-16 animate-fade-in">
            <div className="relative inline-block mb-6">
              <h1 className="text-6xl font-bold bg-gradient-to-r from-emerald-600 via-teal-600 to-cyan-600 bg-clip-text text-transparent mb-4">
                AyurGen Health
              </h1>
              <Sparkles className="absolute -top-4 -right-4 h-8 w-8 text-emerald-500 animate-pulse" />
            </div>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto leading-relaxed mb-8">
              Revolutionary AI-powered platform combining ancient Ayurvedic wisdom with modern healthcare technology 
              for personalized wellness solutions
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
              <Link to="/analysis">
                <Button size="lg" className="bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white px-8 py-3 rounded-full shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105">
                  <Activity className="mr-2 h-5 w-5" />
                  Start Health Analysis
                </Button>
              </Link>
              <Link to="/assistant">
                <Button variant="outline" size="lg" className="border-2 border-emerald-200 hover:border-emerald-300 px-8 py-3 rounded-full transition-all duration-300">
                  <Brain className="mr-2 h-5 w-5" />
                  Chat with AI Vaidya
                </Button>
              </Link>
            </div>
          </div>

          {/* Stats Section */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 mb-16 animate-scale-in">
            {stats.map((stat, index) => (
              <Card key={stat.label} className="border-0 shadow-lg hover:shadow-xl transition-all duration-300 hover-lift bg-gradient-to-br from-background to-muted/30" style={{ animationDelay: `${index * 0.1}s` }}>
                <CardContent className="p-6 text-center">
                  <stat.icon className="h-8 w-8 text-emerald-600 mx-auto mb-3" />
                  <div className="text-3xl font-bold text-foreground mb-1">{stat.number}</div>
                  <div className="text-sm text-muted-foreground">{stat.label}</div>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Features Grid */}
          <div className="mb-16">
            <div className="text-center mb-12 animate-fade-in">
              <h2 className="text-4xl font-bold text-foreground mb-4">
                Comprehensive Health Solutions
              </h2>
              <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                Experience the perfect blend of traditional Ayurveda and cutting-edge AI technology
              </p>
            </div>
            
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {features.map((feature, index) => (
                <Link key={feature.title} to={feature.link}>
                  <Card className="border-0 shadow-lg hover:shadow-2xl transition-all duration-300 hover-lift cursor-pointer group animate-scale-in h-full" style={{ animationDelay: `${index * 0.1}s` }}>
                    <CardContent className="p-8 h-full flex flex-col">
                      <div className={`mx-auto h-16 w-16 rounded-2xl bg-gradient-to-r ${feature.color} p-4 mb-6 shadow-lg transform group-hover:scale-110 transition-transform duration-300`}>
                        <feature.icon className="h-8 w-8 text-white" />
                      </div>
                      <div className="text-center flex-1">
                        <h3 className="text-xl font-semibold text-foreground mb-3 group-hover:text-emerald-600 transition-colors">
                          {feature.title}
                        </h3>
                        <p className="text-muted-foreground leading-relaxed">
                          {feature.description}
                        </p>
                      </div>
                    </CardContent>
                  </Card>
                </Link>
              ))}
            </div>
          </div>

          {/* CTA Section */}
          <div className="bg-gradient-to-r from-emerald-50 via-teal-50 to-cyan-50 dark:from-emerald-950/20 dark:via-teal-950/20 dark:to-cyan-950/20 rounded-3xl p-12 text-center animate-fade-in border border-emerald-100 dark:border-emerald-800">
            <div className="max-w-3xl mx-auto">
              <h2 className="text-3xl font-bold text-foreground mb-4">
                Ready to Transform Your Health Journey?
              </h2>
              <p className="text-lg text-muted-foreground mb-8">
                Join thousands of users who have discovered the power of AI-enhanced Ayurvedic wellness
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Link to="/prakriti-test">
                  <Button size="lg" className="bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white px-8 py-3 rounded-full shadow-lg">
                    <FlaskConical className="mr-2 h-5 w-5" />
                    Take Prakriti Test
                  </Button>
                </Link>
                <Link to="/dashboard">
                  <Button variant="outline" size="lg" className="border-2 border-emerald-200 hover:border-emerald-300 px-8 py-3 rounded-full">
                    View Dashboard
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Index;
