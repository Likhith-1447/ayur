
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { SidebarTrigger } from "@/components/ui/sidebar";
import { Apple, Target, TrendingUp, Loader2, User, UserCheck, Sparkles } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import AIResponseDisplay from "@/components/AIResponseDisplay";
import ThemeToggle from "@/components/ThemeToggle";

const NutritionAdvisor = () => {
  const [age, setAge] = useState("");
  const [gender, setGender] = useState("");
  const [weight, setWeight] = useState("");
  const [height, setHeight] = useState("");
  const [activityLevel, setActivityLevel] = useState("");
  const [dietaryRestrictions, setDietaryRestrictions] = useState("");
  const [healthGoals, setHealthGoals] = useState("");
  const [currentDiet, setCurrentDiet] = useState("");
  const [advice, setAdvice] = useState("");
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  const API_KEY = "AIzaSyBkQd_1n4AxdCssdQkMAfpdY-7Ey0r5SB0";

  const generateAdvice = async () => {
    if (!age || !gender || !weight || !height) {
      toast({
        title: "Missing Information",
        description: "Please fill in all required fields (age, gender, weight, height).",
        variant: "destructive",
      });
      return;
    }

    setLoading(true);
    try {
      const bmi = (parseFloat(weight) / ((parseFloat(height) / 100) ** 2)).toFixed(1);

      const prompt = `
You are a certified nutritionist and Ayurvedic wellness expert. Create a comprehensive nutrition plan based on:

**Personal Information:**
- Age: ${age}
- Gender: ${gender}
- Weight: ${weight} kg
- Height: ${height} cm
- BMI: ${bmi}
- Activity Level: ${activityLevel || 'Not specified'}
- Dietary Restrictions: ${dietaryRestrictions || 'None specified'}
- Health Goals: ${healthGoals || 'General wellness'}
- Current Diet: ${currentDiet || 'Not specified'}

Please provide a detailed nutrition plan with these sections:

1. **Health Assessment**: BMI interpretation and overall health status
2. **Daily Caloric Needs**: Recommended daily calorie intake based on goals
3. **Macronutrient Breakdown**: Ideal ratios of carbs, proteins, and fats
4. **Ayurvedic Constitution Analysis**: Likely dosha type and dietary recommendations
5. **Meal Plan Suggestions**: Sample daily meal structure with portion sizes
6. **Recommended Foods**: Specific foods to include regularly
7. **Foods to Limit/Avoid**: What to minimize based on health goals
8. **Hydration Guidelines**: Daily water intake recommendations
9. **Supplement Suggestions**: If needed based on profile
10. **Lifestyle Tips**: Meal timing, eating habits, and mindful eating practices

Format with clear headings and bullet points. Include both modern nutritional science and Ayurvedic principles.

Important: This is general guidance only. Consult healthcare professionals for personalized medical advice.
      `;

      const url = `https://generativelanguage.googleapis.com/v1/models/gemini-1.5-flash:generateContent?key=${API_KEY}`;

      const response = await fetch(url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          contents: [{ parts: [{ text: prompt }] }]
        })
      });

      if (response.ok) {
        const result = await response.json();
        const nutritionAdvice = result.candidates[0].content.parts[0].text;
        setAdvice(nutritionAdvice);
        toast({
          title: "Nutrition Plan Generated",
          description: "Your personalized nutrition advice is ready!",
        });
      } else {
        throw new Error('Failed to generate advice');
      }
    } catch (error) {
      console.error('Nutrition advice error:', error);
      toast({
        title: "Generation Failed",
        description: "Failed to generate nutrition advice. Please try again.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const calculateBMI = () => {
    if (weight && height) {
      const bmi = parseFloat(weight) / ((parseFloat(height) / 100) ** 2);
      return bmi.toFixed(1);
    }
    return null;
  };

  const getBMICategory = (bmi: number) => {
    if (bmi < 18.5) return { category: "Underweight", color: "bg-blue-100 text-blue-800" };
    if (bmi < 25) return { category: "Normal", color: "bg-green-100 text-green-800" };
    if (bmi < 30) return { category: "Overweight", color: "bg-yellow-100 text-yellow-800" };
    return { category: "Obese", color: "bg-red-100 text-red-800" };
  };

  const bmiValue = calculateBMI();
  const bmiInfo = bmiValue ? getBMICategory(parseFloat(bmiValue)) : null;

  return (
    <div className="flex-1 overflow-auto">
      {/* Header */}
      <header className="sticky top-0 z-40 border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="flex h-16 items-center justify-between gap-4 px-6">
          <div className="flex items-center gap-4">
            <SidebarTrigger className="-ml-1" />
            <div className="flex items-center space-x-3 animate-fade-in">
              <div className="relative">
                <Apple className="h-7 w-7 text-primary" />
                <Sparkles className="absolute -top-1 -right-1 h-3 w-3 text-green-500 animate-pulse" />
              </div>
              <div>
                <h1 className="text-lg font-semibold text-foreground">
                  Nutrition Advisor
                </h1>
                <p className="text-sm text-muted-foreground">
                  Personalized nutrition guidance
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
        <div className="container mx-auto px-6 py-8 max-w-7xl">
          {/* Header */}
          <div className="text-center mb-12 animate-fade-in">
            <h1 className="text-5xl font-bold text-foreground mb-4 bg-gradient-to-r from-green-600 to-emerald-600 bg-clip-text text-transparent">
              AI Nutrition Advisor
            </h1>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto leading-relaxed">
              Get personalized nutrition recommendations combining modern science with Ayurvedic wisdom
            </p>
          </div>

          <div className="grid lg:grid-cols-2 gap-8">
            {/* Input Section */}
            <Card className="border-0 shadow-lg hover:shadow-xl transition-all duration-300 animate-scale-in">
              <CardHeader className="bg-gradient-to-r from-green-600 to-emerald-600 text-white rounded-t-lg">
                <CardTitle className="flex items-center">
                  <Apple className="mr-2 h-5 w-5" />
                  Personal Information
                </CardTitle>
                <CardDescription className="text-green-100">
                  Tell us about yourself for personalized nutrition advice
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6 p-6">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="age">Age *</Label>
                    <Input
                      id="age"
                      type="number"
                      placeholder="Your age"
                      value={age}
                      onChange={(e) => setAge(e.target.value)}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="gender">Gender *</Label>
                    <div className="grid grid-cols-3 gap-2">
                      {[
                        { value: 'male', label: 'Male', icon: User },
                        { value: 'female', label: 'Female', icon: UserCheck },
                        { value: 'other', label: 'Other', icon: User }
                      ].map((option) => (
                        <button
                          key={option.value}
                          type="button"
                          onClick={() => setGender(option.value)}
                          className={`p-3 rounded-lg border-2 transition-all duration-300 flex flex-col items-center gap-2 ${
                            gender === option.value
                              ? 'border-green-500 bg-green-50 dark:bg-green-950/20 text-green-600 dark:text-green-400'
                              : 'border-gray-200 dark:border-gray-700 hover:border-green-300 dark:hover:border-green-600 text-muted-foreground hover:text-green-500 dark:hover:text-green-400'
                          }`}
                        >
                          <option.icon className="h-4 w-4" />
                          <span className="text-xs font-medium">{option.label}</span>
                        </button>
                      ))}
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="weight">Weight (kg) *</Label>
                    <Input
                      id="weight"
                      type="number"
                      placeholder="Weight in kg"
                      value={weight}
                      onChange={(e) => setWeight(e.target.value)}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="height">Height (cm) *</Label>
                    <Input
                      id="height"
                      type="number"
                      placeholder="Height in cm"
                      value={height}
                      onChange={(e) => setHeight(e.target.value)}
                    />
                  </div>
                </div>

                {bmiValue && (
                  <div className="p-4 bg-muted rounded-lg">
                    <div className="flex items-center justify-between">
                      <span className="font-medium">BMI: {bmiValue}</span>
                      {bmiInfo && (
                        <Badge className={bmiInfo.color}>
                          {bmiInfo.category}
                        </Badge>
                      )}
                    </div>
                  </div>
                )}

                <div className="space-y-2">
                  <Label htmlFor="activity">Activity Level</Label>
                  <select
                    id="activity"
                    value={activityLevel}
                    onChange={(e) => setActivityLevel(e.target.value)}
                    className="w-full p-2 border border-input rounded-md bg-background"
                  >
                    <option value="">Select activity level</option>
                    <option value="sedentary">Sedentary (little/no exercise)</option>
                    <option value="lightly-active">Lightly Active (light exercise 1-3 days/week)</option>
                    <option value="moderately-active">Moderately Active (moderate exercise 3-5 days/week)</option>
                    <option value="very-active">Very Active (hard exercise 6-7 days/week)</option>
                    <option value="extremely-active">Extremely Active (very hard exercise, physical job)</option>
                  </select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="restrictions">Dietary Restrictions</Label>
                  <Textarea
                    id="restrictions"
                    placeholder="e.g., vegetarian, vegan, gluten-free, allergies..."
                    value={dietaryRestrictions}
                    onChange={(e) => setDietaryRestrictions(e.target.value)}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="goals">Health Goals</Label>
                  <Textarea
                    id="goals"
                    placeholder="e.g., weight loss, muscle gain, better digestion, increased energy..."
                    value={healthGoals}
                    onChange={(e) => setHealthGoals(e.target.value)}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="current-diet">Current Diet</Label>
                  <Textarea
                    id="current-diet"
                    placeholder="Describe your typical daily meals and eating habits..."
                    value={currentDiet}
                    onChange={(e) => setCurrentDiet(e.target.value)}
                  />
                </div>

                <Button 
                  onClick={generateAdvice} 
                  disabled={!age || !gender || !weight || !height || loading}
                  className="w-full bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white font-semibold py-3 rounded-lg shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105"
                >
                  {loading ? (
                    <>
                      <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                      Generating Plan...
                    </>
                  ) : (
                    <>
                      <Target className="mr-2 h-5 w-5" />
                      Generate Nutrition Plan
                    </>
                  )}
                </Button>
              </CardContent>
            </Card>

            {/* Results Section */}
            <div className="lg:col-span-1">
              {advice ? (
                <AIResponseDisplay response={advice} type="nutrition" />
              ) : (
                <Card className="border-0 shadow-lg hover:shadow-xl transition-all duration-300 animate-scale-in">
                  <CardHeader className="bg-gradient-to-r from-blue-600 to-cyan-600 text-white rounded-t-lg">
                    <CardTitle className="flex items-center">
                      <TrendingUp className="mr-2 h-5 w-5" />
                      Nutrition Plan
                    </CardTitle>
                    <CardDescription className="text-blue-100">
                      Your personalized nutrition recommendations will appear here
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="p-6">
                    <div className="text-center py-16">
                      <div className="animate-pulse mb-6">
                        <Apple className="mx-auto h-16 w-16 text-muted-foreground" />
                      </div>
                      <h3 className="text-xl font-semibold text-foreground mb-3">
                        Ready for Your Nutrition Plan?
                      </h3>
                      <p className="text-muted-foreground max-w-md mx-auto">
                        Fill in your personal information to get customized nutrition advice combining modern science with Ayurvedic principles
                      </p>
                    </div>
                  </CardContent>
                </Card>
              )}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default NutritionAdvisor;
