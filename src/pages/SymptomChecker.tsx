import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { SidebarTrigger } from "@/components/ui/sidebar";
import { Loader2, Activity, AlertTriangle, Sparkles, User, UserCheck } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import AIResponseDisplay from "@/components/AIResponseDisplay";
import ThemeToggle from "@/components/ThemeToggle";
import { supabase } from "@/integrations/supabase/client";

const SymptomChecker = () => {
  const [symptoms, setSymptoms] = useState("");
  const [age, setAge] = useState("");
  const [gender, setGender] = useState("");
  const [duration, setDuration] = useState("");
  const [analysis, setAnalysis] = useState("");
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  const analyzeSymptoms = async () => {
    if (!symptoms.trim()) {
      toast({
        title: "Missing Information",
        description: "Please describe your symptoms.",
        variant: "destructive",
      });
      return;
    }

    setLoading(true);
    try {
      const prompt = `
You are an experienced medical professional providing preliminary symptom analysis. 
Based on the following information, provide a detailed assessment with clear structure:

**Patient Information:**
- Symptoms: ${symptoms}
- Age: ${age || 'Not specified'}
- Gender: ${gender || 'Not specified'}  
- Duration: ${duration || 'Not specified'}

Please provide a structured response with the following sections:

1. **Symptom Summary**: Brief overview of reported symptoms
2. **Possible Conditions**: List potential conditions ranked by likelihood with brief explanations
3. **Immediate Actions**: What to do right now
4. **When to Seek Medical Attention**: Specific scenarios requiring immediate care
5. **Self-Care Recommendations**: Safe home remedies and general care
6. **Warning Signs**: Red flags that require emergency care
7. **Follow-up Suggestions**: Timeline for medical consultation

Format your response with clear headings and numbered sections for easy reading.

IMPORTANT: Always emphasize that this is preliminary analysis only and professional medical consultation is required for proper diagnosis and treatment.

Include disclaimer: "This is AI-generated preliminary analysis. Consult a healthcare professional for proper diagnosis and treatment."
      `;

      const { data, error } = await supabase.functions.invoke('gemini-ai', {
        body: { 
          prompt, 
          type: 'symptom' 
        }
      });

      if (error) {
        console.error('Supabase function error:', error);
        throw new Error('Failed to analyze symptoms');
      }

      const result = data.response;
      setAnalysis(result);
      toast({
        title: "Analysis Complete",
        description: "Symptom analysis has been generated successfully.",
      });
    } catch (error) {
      console.error('Analysis error:', error);
      toast({
        title: "Analysis Failed",
        description: "Failed to analyze symptoms. Please try again.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex-1 overflow-auto">
      {/* Header */}
      <header className="sticky top-0 z-40 border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="flex h-16 items-center justify-between gap-4 px-6">
          <div className="flex items-center gap-4">
            <SidebarTrigger className="-ml-1" />
            <div className="flex items-center space-x-3 animate-fade-in">
              <div className="relative">
                <Activity className="h-7 w-7 text-primary" />
                <Sparkles className="absolute -top-1 -right-1 h-3 w-3 text-red-500 animate-pulse" />
              </div>
              <div>
                <h1 className="text-lg font-semibold text-foreground">
                  Symptom Checker
                </h1>
                <p className="text-sm text-muted-foreground">
                  AI-powered symptom analysis
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
            <div className="relative">
              <h1 className="text-5xl font-bold text-foreground mb-4 bg-gradient-to-r from-red-600 to-pink-600 bg-clip-text text-transparent">
                AI-Powered Symptom Analysis
              </h1>
              <div className="absolute -top-4 -right-4">
                <Sparkles className="h-8 w-8 text-red-400 animate-pulse" />
              </div>
            </div>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto leading-relaxed">
              Get structured preliminary analysis of your symptoms with AI-powered insights and recommendations
            </p>
          </div>

          <div className="grid lg:grid-cols-2 gap-8">
            {/* Input Section */}
            <Card className="border-0 shadow-lg hover:shadow-xl transition-all duration-300 animate-scale-in">
              <CardHeader className="bg-gradient-to-r from-red-600 to-pink-600 text-white rounded-t-lg">
                <CardTitle className="flex items-center">
                  <Activity className="mr-2 h-5 w-5" />
                  Symptom Information
                </CardTitle>
                <CardDescription className="text-red-100">
                  Please provide detailed information about your symptoms
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6 p-6">
                <div className="space-y-2">
                  <Label htmlFor="symptoms">Symptoms Description *</Label>
                  <Textarea
                    id="symptoms"
                    placeholder="Describe your symptoms in detail (e.g., headache, fever, nausea, duration, severity...)"
                    value={symptoms}
                    onChange={(e) => setSymptoms(e.target.value)}
                    className="min-h-[120px]"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="age">Age</Label>
                    <Input
                      id="age"
                      type="number"
                      placeholder="Your age"
                      value={age}
                      onChange={(e) => setAge(e.target.value)}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="gender">Gender</Label>
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
                              ? 'border-red-500 bg-red-50 dark:bg-red-950/20 text-red-600 dark:text-red-400'
                              : 'border-gray-200 dark:border-gray-700 hover:border-red-300 dark:hover:border-red-600 text-muted-foreground hover:text-red-500 dark:hover:text-red-400'
                          }`}
                        >
                          <option.icon className="h-4 w-4" />
                          <span className="text-xs font-medium">{option.label}</span>
                        </button>
                      ))}
                    </div>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="duration">Duration of Symptoms</Label>
                  <Input
                    id="duration"
                    placeholder="e.g., 2 days, 1 week, since morning"
                    value={duration}
                    onChange={(e) => setDuration(e.target.value)}
                  />
                </div>

                <Button 
                  onClick={analyzeSymptoms} 
                  disabled={!symptoms.trim() || loading}
                  className="w-full bg-gradient-to-r from-red-600 to-pink-600 hover:from-red-700 hover:to-pink-700 text-white font-semibold py-3 rounded-lg shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105"
                >
                  {loading ? (
                    <>
                      <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                      Analyzing Symptoms...
                    </>
                  ) : (
                    <>
                      <Activity className="mr-2 h-5 w-5" />
                      Analyze Symptoms
                    </>
                  )}
                </Button>
              </CardContent>
            </Card>

            {/* Results Section */}
            <div className="lg:col-span-1">
              {analysis ? (
                <AIResponseDisplay response={analysis} type="symptom" />
              ) : (
                <Card className="border-0 shadow-lg hover:shadow-xl transition-all duration-300 animate-scale-in">
                  <CardHeader className="bg-gradient-to-r from-green-600 to-emerald-600 text-white rounded-t-lg">
                    <CardTitle className="flex items-center">
                      <Activity className="mr-2 h-5 w-5" />
                      Analysis Results
                    </CardTitle>
                    <CardDescription className="text-green-100">
                      AI-generated symptom analysis and recommendations
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="p-6">
                    <div className="text-center py-16">
                      <div className="animate-pulse mb-6">
                        <Activity className="mx-auto h-16 w-16 text-muted-foreground" />
                      </div>
                      <h3 className="text-xl font-semibold text-foreground mb-3">
                        Ready to Analyze Your Symptoms?
                      </h3>
                      <p className="text-muted-foreground max-w-md mx-auto">
                        Describe your symptoms and get AI-powered preliminary analysis with structured recommendations
                      </p>
                    </div>
                  </CardContent>
                </Card>
              )}
            </div>
          </div>

          {/* Emergency Alert */}
          <Alert className="mt-12 border-red-500 bg-red-50 dark:bg-red-950/20">
            <AlertTriangle className="h-4 w-4 text-red-600" />
            <AlertDescription className="text-red-800 dark:text-red-200">
              <strong>Emergency Warning:</strong> If you're experiencing severe symptoms like chest pain, difficulty breathing, 
              severe bleeding, loss of consciousness, or other emergency situations, call emergency services immediately or go to the nearest emergency room.
            </AlertDescription>
          </Alert>
        </div>
      </main>
    </div>
  );
};

export default SymptomChecker;