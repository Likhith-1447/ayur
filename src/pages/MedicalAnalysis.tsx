import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Loader2, Upload, Camera, AlertTriangle, CheckCircle, Sparkles, Zap } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import AIResponseDisplay from "@/components/AIResponseDisplay";
import { SidebarTrigger } from "@/components/ui/sidebar";
import { supabase } from "@/integrations/supabase/client";

const MedicalAnalysis = () => {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [analysis, setAnalysis] = useState<string>("");
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  const analyzeImage = async () => {
    if (!selectedFile) {
      toast({
        title: "Missing Image",
        description: "Please select a medical image to analyze.",
        variant: "destructive",
      });
      return;
    }

    setLoading(true);
    try {
      // Convert image to base64
      const base64Image = await new Promise<string>((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = () => {
          const result = reader.result as string;
          resolve(result.split(',')[1]); // Remove data:image/jpeg;base64, prefix
        };
        reader.onerror = reject;
        reader.readAsDataURL(selectedFile);
      });

      const samplePrompt = `
You are a medical practitioner and an expert in analyzing medical-related images working for a reputed hospital. 
You will be provided with images and you need to identify the anomalies, any disease or health issues.

Please structure your response with clear sections:

1. **Image Assessment**: Describe what you see in the image
2. **Findings**: List any abnormalities or notable features
3. **Possible Conditions**: Suggest potential diagnoses (ranked by likelihood)
4. **Recommendations**: Immediate actions and next steps
5. **Warning Signs**: Red flags to watch for
6. **Follow-up Care**: When to seek medical attention

Format your response with numbered sections and clear headings for easy reading.

You only need to respond if the image is related to a human body and health issues.

Always include: 'This is AI-generated preliminary analysis. Consult with a healthcare professional for proper diagnosis and treatment.'

If the image is unclear, say: 'Unable to determine based on the provided image.'
      `;

      const { data, error } = await supabase.functions.invoke('gemini-ai', {
        body: { 
          prompt: samplePrompt,
          image: {
            data: base64Image,
            mimeType: selectedFile.type
          },
          type: 'medical' 
        }
      });

      if (error) {
        console.error('Supabase function error:', error);
        throw new Error('Failed to analyze image');
      }

      const result = data.response;
      setAnalysis(result);
      toast({
        title: "Analysis Complete",
        description: "Medical image analysis has been generated successfully.",
      });
    } catch (error) {
      console.error('Analysis error:', error);
      toast({
        title: "Analysis Failed",
        description: "Failed to analyze the image. Please try again.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      // Check if it's an image file
      if (file.type.startsWith('image/')) {
        setSelectedFile(file);
        setAnalysis(""); // Clear previous analysis
      } else {
        toast({
          title: "Invalid File",
          description: "Please select a valid image file (JPG, PNG, etc.)",
          variant: "destructive",
        });
      }
    }
  };

  return (
    <div className="flex-1 overflow-auto">
      {/* Enhanced Header with animations */}
      <header className="sticky top-0 z-40 border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="flex h-16 items-center gap-4 px-6">
          <SidebarTrigger className="-ml-1" />
          <div className="flex items-center space-x-3 animate-fade-in">
            <div className="relative">
              <Camera className="h-7 w-7 text-primary" />
              <div className="absolute -top-1 -right-1 h-3 w-3 bg-green-500 rounded-full animate-pulse"></div>
            </div>
            <div>
              <h1 className="text-lg font-semibold text-foreground">
                AI Medical Image Analysis
              </h1>
              <p className="text-sm text-muted-foreground">
                Advanced diagnostics powered by AI
              </p>
            </div>
          </div>
        </div>
      </header>

      <main className="flex-1 overflow-auto">
        <div className="container mx-auto px-6 py-8 max-w-7xl">
          {/* Hero Section with enhanced animations */}
          <div className="text-center mb-12 space-y-6 animate-fade-in">
            <div className="relative inline-block">
              <h2 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-primary via-primary/80 to-primary/60 bg-clip-text text-transparent animate-gradient">
                Revolutionary AI Diagnostics
              </h2>
              <div className="absolute -top-2 -right-2 animate-bounce-in">
                <Sparkles className="h-8 w-8 text-primary/60 animate-pulse" />
              </div>
            </div>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto leading-relaxed animate-slide-up">
              Upload medical images for instant AI-powered analysis with professional-grade accuracy and detailed recommendations
            </p>
          </div>

          <div className="grid lg:grid-cols-2 gap-8 mb-16">
            {/* Enhanced Upload Section */}
            <Card className="group border-0 shadow-xl hover:shadow-2xl transition-all duration-500 animate-scale-in hover-lift bg-card/50 backdrop-blur-sm">
              <CardHeader className="bg-gradient-to-r from-primary to-primary/80 text-primary-foreground rounded-t-lg relative overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-r from-primary/20 to-transparent animate-gradient"></div>
                <CardTitle className="flex items-center relative z-10">
                  <Upload className="mr-3 h-6 w-6 animate-bounce" />
                  Upload Medical Image
                </CardTitle>
                <CardDescription className="text-primary-foreground/90 relative z-10">
                  Select high-quality medical images for precise AI analysis
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6 p-6">
                <div className="group/upload border-2 border-dashed border-primary/30 rounded-xl p-8 text-center hover:border-primary/60 transition-all duration-300 bg-gradient-to-br from-primary/5 to-primary/10 hover:from-primary/10 hover:to-primary/15">
                  <Input
                    type="file"
                    accept="image/*"
                    onChange={handleFileChange}
                    className="hidden"
                    id="image-upload"
                  />
                  <Label htmlFor="image-upload" className="cursor-pointer">
                    <div className="space-y-4">
                      <div className="relative">
                        <Upload className="mx-auto h-16 w-16 text-primary/60 group-hover/upload:text-primary transition-colors duration-300 group-hover/upload:scale-110 transform" />
                        <div className="absolute -top-2 -right-2 animate-pulse">
                          <Zap className="h-6 w-6 text-primary/40" />
                        </div>
                      </div>
                      <div className="text-lg font-medium text-foreground group-hover/upload:text-primary transition-colors">
                        Click to upload or drag and drop
                      </div>
                      <div className="text-sm text-muted-foreground">
                        PNG, JPG, JPEG up to 10MB • X-rays, scans, photos supported
                      </div>
                    </div>
                  </Label>
                </div>

                {selectedFile && (
                  <div className="space-y-4 animate-fade-in">
                    <div className="flex items-center text-sm text-green-600 bg-green-50 dark:bg-green-950 p-4 rounded-lg border border-green-200 dark:border-green-800">
                      <CheckCircle className="mr-3 h-5 w-5 animate-bounce" />
                      <span className="font-medium">File ready: {selectedFile.name}</span>
                    </div>
                    <div className="relative overflow-hidden rounded-xl border-2 border-primary/20 shadow-lg">
                      <img
                        src={URL.createObjectURL(selectedFile)}
                        alt="Selected medical image"
                        className="w-full h-64 object-cover transition-transform duration-500 hover:scale-105"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent"></div>
                    </div>
                  </div>
                )}

                <Button 
                  onClick={analyzeImage} 
                  disabled={!selectedFile || loading}
                  className="w-full bg-gradient-to-r from-primary to-primary/80 hover:from-primary/90 hover:to-primary/70 text-primary-foreground font-semibold py-4 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-[1.02] disabled:hover:scale-100"
                >
                  {loading ? (
                    <>
                      <Loader2 className="mr-3 h-5 w-5 animate-spin" />
                      <span className="animate-pulse">Analyzing with AI...</span>
                    </>
                  ) : (
                    <>
                      <Camera className="mr-3 h-5 w-5" />
                      Analyze with AI
                    </>
                  )}
                </Button>
              </CardContent>
            </Card>

            {/* Enhanced Results Section */}
            <div className="lg:col-span-1">
              {analysis ? (
                <div className="animate-fade-in">
                  <AIResponseDisplay response={analysis} type="medical" />
                </div>
              ) : (
                <Card className="border-0 shadow-xl hover:shadow-2xl transition-all duration-500 animate-scale-in bg-card/50 backdrop-blur-sm h-full">
                  <CardHeader className="bg-gradient-to-r from-green-600 to-emerald-600 text-white rounded-t-lg relative overflow-hidden">
                    <div className="absolute inset-0 bg-gradient-to-r from-green-600/20 to-transparent animate-gradient"></div>
                    <CardTitle className="flex items-center relative z-10">
                      <Sparkles className="mr-3 h-6 w-6 animate-pulse" />
                      Analysis Results
                    </CardTitle>
                    <CardDescription className="text-green-100 relative z-10">
                      AI-generated insights and professional recommendations
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="p-6 flex items-center justify-center h-96">
                    <div className="text-center space-y-6">
                      <div className="animate-bounce">
                        <Camera className="mx-auto h-20 w-20 text-muted-foreground/50" />
                      </div>
                      <div className="space-y-3">
                        <h3 className="text-xl font-semibold text-foreground">
                          Ready for Analysis
                        </h3>
                        <p className="text-muted-foreground max-w-md mx-auto">
                          Upload a medical image and our AI will provide detailed insights with structured formatting and actionable recommendations
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              )}
            </div>
          </div>

          {/* Enhanced Features Grid */}
          <div className="grid md:grid-cols-3 gap-6 mb-12">
            {[
              {
                icon: Zap,
                title: "Lightning Fast",
                description: "Get comprehensive results in seconds with our optimized AI models",
                color: "from-blue-500 to-cyan-500"
              },
              {
                icon: CheckCircle,
                title: "Medical Grade",
                description: "Advanced AI trained on extensive medical datasets for accuracy",
                color: "from-green-500 to-emerald-500"
              },
              {
                icon: Sparkles,
                title: "Detailed Insights",
                description: "Comprehensive analysis with actionable recommendations and next steps",
                color: "from-purple-500 to-pink-500"
              }
            ].map((feature, index) => (
              <Card key={feature.title} className={`border-0 shadow-lg hover:shadow-xl transition-all duration-500 animate-fade-in hover-lift bg-gradient-to-br ${feature.color.replace('from-', 'from-').replace('to-', 'to-')}/5 backdrop-blur-sm`} style={{ animationDelay: `${index * 0.1}s` }}>
                <CardContent className="p-6 text-center">
                  <div className={`mx-auto h-14 w-14 rounded-xl bg-gradient-to-r ${feature.color} p-3 mb-4 shadow-lg transform hover:scale-110 transition-transform duration-300`}>
                    <feature.icon className="h-8 w-8 text-white" />
                  </div>
                  <h3 className="font-semibold text-foreground mb-2 text-lg">{feature.title}</h3>
                  <p className="text-sm text-muted-foreground leading-relaxed">{feature.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Enhanced Disclaimer */}
          <Alert className="border-red-200 bg-red-50 dark:bg-red-950 dark:border-red-800 shadow-lg animate-fade-in">
            <AlertTriangle className="h-5 w-5 text-red-600" />
            <AlertDescription className="text-red-800 dark:text-red-200">
              <strong>Important Medical Disclaimer:</strong> This AI analysis is for informational purposes only and should not be used as a substitute for professional medical advice, diagnosis, or treatment. Always seek the advice of your physician or other qualified health provider with any questions you may have regarding a medical condition.
            </AlertDescription>
          </Alert>
        </div>
      </main>
    </div>
  );
};

export default MedicalAnalysis;