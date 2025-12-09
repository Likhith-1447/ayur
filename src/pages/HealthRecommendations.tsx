
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Brain, Heart, Utensils, Activity, Moon, AlertTriangle, Loader2, Sparkles, TrendingUp } from "lucide-react";
import { Link } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";

const HealthRecommendations = () => {
  const [formData, setFormData] = useState({
    age: "",
    gender: "",
    height: "",
    weight: "",
    activityLevel: "",
    healthGoals: "",
    currentConditions: "",
    dietaryRestrictions: ""
  });
  const [recommendations, setRecommendations] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  const API_KEY = "AIzaSyBkQd_1n4AxdCssdQkMAfpdY-7Ey0r5SB0";

  const generateRecommendations = async () => {
    if (!formData.age || !formData.gender || !formData.healthGoals) {
      toast({
        title: "Missing Information",
        description: "Please fill in at least age, gender, and health goals.",
        variant: "destructive",
      });
      return;
    }

    setLoading(true);
    try {
      const prompt = `
As a health and wellness expert, provide personalized recommendations based on this user profile:

Age: ${formData.age}
Gender: ${formData.gender}
Height: ${formData.height || 'Not specified'}
Weight: ${formData.weight || 'Not specified'}
Activity Level: ${formData.activityLevel || 'Not specified'}
Health Goals: ${formData.healthGoals}
Current Health Conditions: ${formData.currentConditions || 'None specified'}
Dietary Restrictions: ${formData.dietaryRestrictions || 'None specified'}

Please provide detailed recommendations in the following categories:
1. Diet and Nutrition
2. Exercise and Physical Activity
3. Sleep and Recovery
4. Stress Management
5. Lifestyle Modifications
6. Ayurvedic Remedies (if applicable)

Format your response as a structured JSON with the following format:
{
  "diet": {
    "title": "Diet and Nutrition",
    "recommendations": ["recommendation 1", "recommendation 2", ...],
    "foods_to_include": ["food 1", "food 2", ...],
    "foods_to_avoid": ["food 1", "food 2", ...]
  },
  "exercise": {
    "title": "Exercise and Physical Activity",
    "recommendations": ["recommendation 1", "recommendation 2", ...],
    "suggested_activities": ["activity 1", "activity 2", ...]
  },
  "sleep": {
    "title": "Sleep and Recovery",
    "recommendations": ["recommendation 1", "recommendation 2", ...]
  },
  "stress": {
    "title": "Stress Management",
    "recommendations": ["recommendation 1", "recommendation 2", ...],
    "techniques": ["technique 1", "technique 2", ...]
  },
  "lifestyle": {
    "title": "Lifestyle Modifications",
    "recommendations": ["recommendation 1", "recommendation 2", ...]
  },
  "ayurveda": {
    "title": "Ayurvedic Remedies",
    "recommendations": ["recommendation 1", "recommendation 2", ...],
    "herbs": ["herb 1", "herb 2", ...]
  }
}

Always include a disclaimer about consulting healthcare professionals.
      `;

      const url = `https://generativelanguage.googleapis.com/v1/models/gemini-1.5-flash:generateContent?key=${API_KEY}`;

      const payload = {
        contents: [
          {
            parts: [{ text: prompt }]
          }
        ]
      };

      const response = await fetch(url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(payload)
      });

      if (response.ok) {
        const result = await response.json();
        let responseText = result.candidates[0].content.parts[0].text;
        
        // Try to extract JSON from the response
        try {
          const jsonMatch = responseText.match(/\{[\s\S]*\}/);
          if (jsonMatch) {
            const recommendations = JSON.parse(jsonMatch[0]);
            setRecommendations(recommendations);
          } else {
            // Fallback to plain text
            setRecommendations({ raw: responseText });
          }
        } catch {
          setRecommendations({ raw: responseText });
        }

        toast({
          title: "Recommendations Generated",
          description: "Your personalized health recommendations are ready!",
        });
      } else {
        throw new Error(`API Error: ${response.status}`);
      }
    } catch (error) {
      console.error('Recommendation error:', error);
      toast({
        title: "Generation Failed",
        description: "Failed to generate recommendations. Please try again.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const categoryIcons = {
    diet: Utensils,
    exercise: Activity,
    sleep: Moon,
    stress: Brain,
    lifestyle: Heart,
    ayurveda: Sparkles
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-pink-50">
      {/* Navigation */}
      <nav className="border-b bg-white/95 backdrop-blur-md sticky top-0 z-50 shadow-sm">
        <div className="container mx-auto px-4 py-4">
          <Link to="/" className="flex items-center space-x-2 hover:opacity-80 transition-opacity">
            <Brain className="h-6 w-6 text-purple-600" />
            <span className="text-xl font-bold text-gray-800">AI Health Recommendations</span>
          </Link>
        </div>
      </nav>

      <div className="container mx-auto px-4 py-8">
        <div className="max-w-6xl mx-auto">
          {/* Header with animations */}
          <div className="text-center mb-12 animate-fade-in">
            <div className="relative">
              <h1 className="text-5xl font-bold text-gray-800 mb-4 bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
                Personalized Health Recommendations
              </h1>
              <div className="absolute -top-4 -right-4">
                <Sparkles className="h-8 w-8 text-purple-400 animate-pulse" />
              </div>
            </div>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
              Get AI-powered, personalized health and wellness recommendations based on your unique profile
            </p>
          </div>

          <div className="grid lg:grid-cols-2 gap-8">
            {/* Input Form */}
            <div className="space-y-6">
              {/* User Profile */}
              <Card className="border-0 shadow-lg hover:shadow-xl transition-all duration-300 animate-scale-in">
                <CardHeader className="bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-t-lg">
                  <CardTitle className="flex items-center">
                    <Brain className="mr-2 h-5 w-5" />
                    Your Health Profile
                  </CardTitle>
                  <CardDescription className="text-purple-100">
                    Fill in your details for personalized recommendations
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6 p-6">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="age" className="text-sm font-medium">Age</Label>
                      <Input
                        id="age"
                        type="number"
                        placeholder="25"
                        value={formData.age}
                        onChange={(e) => setFormData({...formData, age: e.target.value})}
                        className="border-2 focus:border-purple-400 transition-colors"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="gender" className="text-sm font-medium">Gender</Label>
                      <Select onValueChange={(value) => setFormData({...formData, gender: value})}>
                        <SelectTrigger className="border-2 focus:border-purple-400">
                          <SelectValue placeholder="Select gender" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="male">Male</SelectItem>
                          <SelectItem value="female">Female</SelectItem>
                          <SelectItem value="other">Other</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="height" className="text-sm font-medium">Height (cm)</Label>
                      <Input
                        id="height"
                        type="number"
                        placeholder="170"
                        value={formData.height}
                        onChange={(e) => setFormData({...formData, height: e.target.value})}
                        className="border-2 focus:border-purple-400 transition-colors"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="weight" className="text-sm font-medium">Weight (kg)</Label>
                      <Input
                        id="weight"
                        type="number"
                        placeholder="70"
                        value={formData.weight}
                        onChange={(e) => setFormData({...formData, weight: e.target.value})}
                        className="border-2 focus:border-purple-400 transition-colors"
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label className="text-sm font-medium">Activity Level</Label>
                    <Select onValueChange={(value) => setFormData({...formData, activityLevel: value})}>
                      <SelectTrigger className="border-2 focus:border-purple-400">
                        <SelectValue placeholder="Select activity level" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="sedentary">Sedentary (little to no exercise)</SelectItem>
                        <SelectItem value="light">Light (1-3 days/week)</SelectItem>
                        <SelectItem value="moderate">Moderate (3-5 days/week)</SelectItem>
                        <SelectItem value="active">Active (6-7 days/week)</SelectItem>
                        <SelectItem value="very_active">Very Active (2x/day or intense)</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="goals" className="text-sm font-medium">Health Goals</Label>
                    <Textarea
                      id="goals"
                      placeholder="e.g., weight loss, muscle gain, stress reduction, better sleep..."
                      value={formData.healthGoals}
                      onChange={(e) => setFormData({...formData, healthGoals: e.target.value})}
                      className="border-2 focus:border-purple-400 transition-colors min-h-[100px]"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="conditions" className="text-sm font-medium">Current Health Conditions (Optional)</Label>
                    <Textarea
                      id="conditions"
                      placeholder="e.g., diabetes, hypertension, arthritis..."
                      value={formData.currentConditions}
                      onChange={(e) => setFormData({...formData, currentConditions: e.target.value})}
                      className="border-2 focus:border-purple-400 transition-colors"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="restrictions" className="text-sm font-medium">Dietary Restrictions (Optional)</Label>
                    <Textarea
                      id="restrictions"
                      placeholder="e.g., vegetarian, vegan, allergies, gluten-free..."
                      value={formData.dietaryRestrictions}
                      onChange={(e) => setFormData({...formData, dietaryRestrictions: e.target.value})}
                      className="border-2 focus:border-purple-400 transition-colors"
                    />
                  </div>

                  <Button 
                    onClick={generateRecommendations}
                    disabled={loading}
                    className="w-full bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white font-semibold py-3 rounded-lg shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105"
                  >
                    {loading ? (
                      <>
                        <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                        Generating AI Recommendations...
                      </>
                    ) : (
                      <>
                        <Brain className="mr-2 h-5 w-5" />
                        Generate AI Recommendations
                      </>
                    )}
                  </Button>
                </CardContent>
              </Card>
            </div>

            {/* Recommendations Display */}
            <div className="space-y-6">
              {recommendations ? (
                recommendations.raw ? (
                  <Card className="border-0 shadow-lg animate-fade-in">
                    <CardHeader className="bg-gradient-to-r from-green-600 to-blue-600 text-white rounded-t-lg">
                      <CardTitle className="flex items-center">
                        <TrendingUp className="mr-2 h-5 w-5" />
                        Your Personalized Recommendations
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="p-6">
                      <div className="prose prose-sm max-w-none">
                        <div className="whitespace-pre-wrap text-sm text-gray-700 bg-gray-50 p-4 rounded-lg">
                          {recommendations.raw}
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ) : (
                  <div className="space-y-6">
                    {Object.entries(recommendations).map(([key, category]: [string, any], index) => {
                      const IconComponent = categoryIcons[key as keyof typeof categoryIcons] || Heart;
                      return (
                        <Card 
                          key={key} 
                          className="border-0 shadow-lg hover:shadow-xl transition-all duration-300 animate-scale-in"
                          style={{ animationDelay: `${index * 0.1}s` }}
                        >
                          <CardHeader className="bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-t-lg">
                            <CardTitle className="flex items-center">
                              <IconComponent className="mr-2 h-5 w-5" />
                              {category.title}
                            </CardTitle>
                          </CardHeader>
                          <CardContent className="space-y-4 p-6">
                            {category.recommendations && (
                              <div>
                                <h4 className="font-semibold mb-3 text-gray-800">Recommendations:</h4>
                                <ul className="space-y-2 text-sm text-gray-700">
                                  {category.recommendations.map((rec: string, idx: number) => (
                                    <li key={idx} className="flex items-start p-3 bg-blue-50 rounded-lg hover:bg-blue-100 transition-colors">
                                      <span className="mr-3 text-blue-600 font-bold">•</span>
                                      <span>{rec}</span>
                                    </li>
                                  ))}
                                </ul>
                              </div>
                            )}
                            
                            {category.foods_to_include && (
                              <div>
                                <h4 className="font-semibold mb-3 text-gray-800">Foods to Include:</h4>
                                <div className="flex flex-wrap gap-2">
                                  {category.foods_to_include.map((food: string, idx: number) => (
                                    <Badge 
                                      key={idx} 
                                      variant="secondary" 
                                      className="text-xs bg-green-100 text-green-800 hover:bg-green-200 transition-colors"
                                    >
                                      {food}
                                    </Badge>
                                  ))}
                                </div>
                              </div>
                            )}

                            {category.foods_to_avoid && (
                              <div>
                                <h4 className="font-semibold mb-3 text-gray-800">Foods to Limit:</h4>
                                <div className="flex flex-wrap gap-2">
                                  {category.foods_to_avoid.map((food: string, idx: number) => (
                                    <Badge 
                                      key={idx} 
                                      variant="destructive" 
                                      className="text-xs hover:opacity-80 transition-opacity"
                                    >
                                      {food}
                                    </Badge>
                                  ))}
                                </div>
                              </div>
                            )}

                            {category.suggested_activities && (
                              <div>
                                <h4 className="font-semibold mb-3 text-gray-800">Suggested Activities:</h4>
                                <div className="flex flex-wrap gap-2">
                                  {category.suggested_activities.map((activity: string, idx: number) => (
                                    <Badge 
                                      key={idx} 
                                      variant="outline" 
                                      className="text-xs bg-blue-50 border-blue-200 hover:bg-blue-100 transition-colors"
                                    >
                                      {activity}
                                    </Badge>
                                  ))}
                                </div>
                              </div>
                            )}

                            {category.techniques && (
                              <div>
                                <h4 className="font-semibold mb-3 text-gray-800">Techniques:</h4>
                                <div className="flex flex-wrap gap-2">
                                  {category.techniques.map((technique: string, idx: number) => (
                                    <Badge 
                                      key={idx} 
                                      variant="outline" 
                                      className="text-xs bg-purple-50 border-purple-200 hover:bg-purple-100 transition-colors"
                                    >
                                      {technique}
                                    </Badge>
                                  ))}
                                </div>
                              </div>
                            )}

                            {category.herbs && (
                              <div>
                                <h4 className="font-semibold mb-3 text-gray-800">Recommended Herbs:</h4>
                                <div className="flex flex-wrap gap-2">
                                  {category.herbs.map((herb: string, idx: number) => (
                                    <Badge 
                                      key={idx} 
                                      variant="secondary" 
                                      className="text-xs bg-green-100 text-green-800 hover:bg-green-200 transition-colors"
                                    >
                                      {herb}
                                    </Badge>
                                  ))}
                                </div>
                              </div>
                            )}
                          </CardContent>
                        </Card>
                      );
                    })}
                  </div>
                )
              ) : (
                <Card className="border-0 shadow-lg">
                  <CardContent className="text-center py-16">
                    <div className="animate-pulse">
                      <Brain className="mx-auto h-16 w-16 text-gray-400 mb-4" />
                    </div>
                    <h3 className="text-xl font-semibold text-gray-900 mb-3">
                      Ready to Generate Your Health Plan?
                    </h3>
                    <p className="text-gray-500 max-w-md mx-auto">
                      Fill in your profile and click "Generate AI Recommendations" to get personalized health insights powered by advanced AI
                    </p>
                  </CardContent>
                </Card>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HealthRecommendations;
