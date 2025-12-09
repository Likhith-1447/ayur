import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Loader2, Dumbbell, CheckCircle, Sparkles, Zap, Trophy } from "lucide-react";
import { Link } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import AIResponseDisplay from "@/components/AIResponseDisplay";

const FitnessPlanner = () => {
  const [age, setAge] = useState("");
  const [fitnessLevel, setFitnessLevel] = useState("");
  const [goals, setGoals] = useState("");
  const [timeAvailable, setTimeAvailable] = useState("");
  const [equipment, setEquipment] = useState("");
  const [limitations, setLimitations] = useState("");
  const [preferences, setPreferences] = useState("");
  const [workoutPlan, setWorkoutPlan] = useState("");
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  const generateFitnessPlan = async () => {
    if (!age || !fitnessLevel || !goals) {
      toast({
        title: "Missing Information",
        description: "Please fill in age, fitness level, and goals.",
        variant: "destructive",
      });
      return;
    }

    setLoading(true);
    try {
      const prompt = `
You are a certified fitness trainer and exercise physiologist. Create a comprehensive fitness plan based on:

Personal Details:
- Age: ${age} years
- Current Fitness Level: ${fitnessLevel}
- Fitness Goals: ${goals}
- Time Available: ${timeAvailable || 'Not specified'}
- Available Equipment: ${equipment || 'None specified'}
- Physical Limitations: ${limitations || 'None'}
- Exercise Preferences: ${preferences || 'None specified'}

Please provide:
1. Detailed weekly workout schedule (7 days)
2. Specific exercises with sets, reps, and duration
3. Warm-up and cool-down routines
4. Progressive difficulty plan for 4 weeks
5. Alternative exercises for different equipment
6. Recovery and rest day recommendations
7. Yoga and stretching routines (Ayurvedic approach)
8. Breathing exercises and meditation
9. Progress tracking methods
10. Safety tips and injury prevention
11. Nutrition timing around workouts
12. Hydration guidelines during exercise

Include traditional Indian exercises like Surya Namaskara, pranayama, and yoga asanas where appropriate.
Make it practical and progressive, suitable for the specified fitness level.

Format the response in clear sections with day-by-day breakdown.
      `;

      const { data, error } = await supabase.functions.invoke('gemini-ai', {
        body: { 
          prompt, 
          type: 'fitness' 
        }
      });

      if (error) {
        console.error('Supabase function error:', error);
        throw new Error('Failed to generate fitness plan');
      }

      const result = data.response;
      setWorkoutPlan(result);
      toast({
        title: "Fitness Plan Ready",
        description: "Your personalized fitness plan has been generated.",
      });
    } catch (error) {
      console.error('Generation error:', error);
      toast({
        title: "Generation Failed",
        description: "Failed to generate fitness plan. Please try again.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-teal-50 via-white to-cyan-50">
      {/* Navigation */}
      <nav className="border-b bg-white/95 backdrop-blur-md sticky top-0 z-50 shadow-sm">
        <div className="container mx-auto px-4 py-4">
          <Link to="/" className="flex items-center space-x-2 hover:opacity-80 transition-opacity">
            <Dumbbell className="h-6 w-6 text-teal-600" />
            <span className="text-xl font-bold text-gray-800">AI Fitness Planner</span>
          </Link>
        </div>
      </nav>

      <div className="container mx-auto px-4 py-8">
        <div className="max-w-6xl mx-auto">
          {/* Header */}
          <div className="text-center mb-12 animate-fade-in">
            <div className="relative">
              <h1 className="text-5xl font-bold text-gray-800 mb-4 bg-gradient-to-r from-teal-600 to-cyan-600 bg-clip-text text-transparent">
                AI Fitness Planning
              </h1>
              <div className="absolute -top-4 -right-4">
                <Trophy className="h-8 w-8 text-teal-400 animate-pulse" />
              </div>
            </div>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
              Get personalized workout plans combining modern fitness science with traditional practices
            </p>
          </div>

          <div className="grid lg:grid-cols-2 gap-8">
            {/* Input Section */}
            <Card className="border-0 shadow-lg hover:shadow-xl transition-all duration-300 animate-scale-in">
              <CardHeader className="bg-gradient-to-r from-teal-600 to-cyan-600 text-white rounded-t-lg">
                <CardTitle className="flex items-center">
                  <Dumbbell className="mr-2 h-5 w-5" />
                  Fitness Assessment
                </CardTitle>
                <CardDescription className="text-teal-100">
                  Tell us about your fitness profile and goals
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6 p-6">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="age">Age *</Label>
                    <Input
                      id="age"
                      type="number"
                      placeholder="Years"
                      value={age}
                      onChange={(e) => setAge(e.target.value)}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="time">Time Available</Label>
                    <select
                      id="time"
                      value={timeAvailable}
                      onChange={(e) => setTimeAvailable(e.target.value)}
                      className="w-full p-2 border border-gray-300 rounded-md"
                    >
                      <option value="">Select duration</option>
                      <option value="15-30 minutes">15-30 minutes</option>
                      <option value="30-45 minutes">30-45 minutes</option>
                      <option value="45-60 minutes">45-60 minutes</option>
                      <option value="60+ minutes">60+ minutes</option>
                    </select>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="fitness-level">Current Fitness Level *</Label>
                  <select
                    id="fitness-level"
                    value={fitnessLevel}
                    onChange={(e) => setFitnessLevel(e.target.value)}
                    className="w-full p-2 border border-gray-300 rounded-md"
                  >
                    <option value="">Select fitness level</option>
                    <option value="beginner">Beginner (little to no exercise)</option>
                    <option value="intermediate">Intermediate (regular exercise)</option>
                    <option value="advanced">Advanced (intensive training)</option>
                  </select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="goals">Fitness Goals *</Label>
                  <Textarea
                    id="goals"
                    placeholder="e.g., weight loss, muscle building, strength, endurance, flexibility..."
                    value={goals}
                    onChange={(e) => setGoals(e.target.value)}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="equipment">Available Equipment</Label>
                  <Textarea
                    id="equipment"
                    placeholder="e.g., dumbbells, resistance bands, yoga mat, home gym..."
                    value={equipment}
                    onChange={(e) => setEquipment(e.target.value)}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="limitations">Physical Limitations</Label>
                  <Input
                    id="limitations"
                    placeholder="e.g., knee problems, back issues, injuries..."
                    value={limitations}
                    onChange={(e) => setLimitations(e.target.value)}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="preferences">Exercise Preferences</Label>
                  <Input
                    id="preferences"
                    placeholder="e.g., yoga, cardio, strength training, dancing..."
                    value={preferences}
                    onChange={(e) => setPreferences(e.target.value)}
                  />
                </div>

                <Button 
                  onClick={generateFitnessPlan} 
                  disabled={!age || !fitnessLevel || !goals || loading}
                  className="w-full bg-gradient-to-r from-teal-600 to-cyan-600 hover:from-teal-700 hover:to-cyan-700 text-white font-semibold py-3 rounded-lg shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105"
                >
                  {loading ? (
                    <>
                      <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                      Creating Your Plan...
                    </>
                  ) : (
                    <>
                      <Trophy className="mr-2 h-5 w-5" />
                      Generate Fitness Plan
                    </>
                  )}
                </Button>
              </CardContent>
            </Card>

            {/* Results Section */}
            <div className="lg:col-span-1">
              {workoutPlan ? (
                <AIResponseDisplay response={workoutPlan} type="fitness" />
              ) : (
                <Card className="border-0 shadow-lg hover:shadow-xl transition-all duration-300 animate-scale-in">
                  <CardHeader className="bg-gradient-to-r from-green-600 to-emerald-600 text-white rounded-t-lg">
                    <CardTitle className="flex items-center">
                      <CheckCircle className="mr-2 h-5 w-5" />
                      Your Fitness Plan
                    </CardTitle>
                    <CardDescription className="text-green-100">
                      Personalized workout recommendations
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="p-6">
                    <div className="text-center py-16">
                      <div className="animate-pulse mb-6">
                        <Dumbbell className="mx-auto h-16 w-16 text-gray-400" />
                      </div>
                      <h3 className="text-xl font-semibold text-gray-900 mb-3">
                        Ready for Your Fitness Journey?
                      </h3>
                      <p className="text-gray-500 max-w-md mx-auto">
                        Complete your fitness assessment to get a personalized workout plan with traditional exercises
                      </p>
                    </div>
                  </CardContent>
                </Card>
              )}
            </div>
          </div>

          {/* Safety Alert */}
          <Alert className="mt-12 border-blue-200 bg-blue-50">
            <Zap className="h-4 w-4 text-blue-600" />
            <AlertDescription className="text-blue-800">
              <strong>Safety First:</strong> Always warm up before exercising and cool down afterward. 
              Listen to your body and rest if you feel pain or excessive fatigue.
            </AlertDescription>
          </Alert>

          {/* Features */}
          <div className="mt-16 grid md:grid-cols-3 gap-6">
            <Card className="border-0 shadow-md hover:shadow-lg transition-all duration-300 bg-gradient-to-br from-teal-50 to-cyan-50">
              <CardContent className="p-6 text-center">
                <Trophy className="mx-auto h-12 w-12 text-teal-600 mb-4" />
                <h3 className="font-semibold text-gray-800 mb-2">Goal-Oriented</h3>
                <p className="text-sm text-gray-600">Plans designed to achieve your specific fitness goals</p>
              </CardContent>
            </Card>
            <Card className="border-0 shadow-md hover:shadow-lg transition-all duration-300 bg-gradient-to-br from-purple-50 to-pink-50">
              <CardContent className="p-6 text-center">
                <Sparkles className="mx-auto h-12 w-12 text-purple-600 mb-4" />
                <h3 className="font-semibold text-gray-800 mb-2">Traditional + Modern</h3>
                <p className="text-sm text-gray-600">Combines yoga, pranayama with modern fitness</p>
              </CardContent>
            </Card>
            <Card className="border-0 shadow-md hover:shadow-lg transition-all duration-300 bg-gradient-to-br from-blue-50 to-indigo-50">
              <CardContent className="p-6 text-center">
                <CheckCircle className="mx-auto h-12 w-12 text-blue-600 mb-4" />
                <h3 className="font-semibold text-gray-800 mb-2">Progressive</h3>
                <p className="text-sm text-gray-600">Adaptive plans that grow with your fitness level</p>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FitnessPlanner;