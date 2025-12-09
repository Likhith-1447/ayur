import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { Leaf, User, Brain, Heart, Zap, Wind, Flame, Mountain, Sparkles, CheckCircle } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";
import { useUser } from "@clerk/clerk-react";
import { savePrakritiResult, logActivity } from "@/lib/database";

interface Question {
  id: number;
  category: string;
  question: string;
  options: {
    text: string;
    dosha: 'vata' | 'pitta' | 'kapha';
  }[];
}

interface DoshaResult {
  vata: number;
  pitta: number;
  kapha: number;
}

const PrakritiTest = () => {
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState<Record<number, 'vata' | 'pitta' | 'kapha'>>({});
  const [showResults, setShowResults] = useState(false);
  const [results, setResults] = useState<DoshaResult>({ vata: 0, pitta: 0, kapha: 0 });
  const [saving, setSaving] = useState(false);
  const { toast } = useToast();
  const { user } = useUser();
  const navigate = useNavigate();

  const questions: Question[] = [
    {
      id: 1,
      category: "Physical Build",
      question: "How would you describe your natural body build?",
      options: [
        { text: "Thin, light frame, find it hard to gain weight", dosha: 'vata' },
        { text: "Medium build, well-proportioned, moderate weight", dosha: 'pitta' },
        { text: "Large frame, solid build, gain weight easily", dosha: 'kapha' }
      ]
    },
    {
      id: 2,
      category: "Skin & Hair",
      question: "How would you describe your skin and hair?",
      options: [
        { text: "Dry skin, thin/coarse hair, tends to be cool", dosha: 'vata' },
        { text: "Warm skin, fine hair, prone to freckles/moles", dosha: 'pitta' },
        { text: "Oily/moist skin, thick hair, cool and pale", dosha: 'kapha' }
      ]
    },
    {
      id: 3,
      category: "Energy Levels",
      question: "How would you describe your energy patterns?",
      options: [
        { text: "High energy in bursts, tire quickly, irregular", dosha: 'vata' },
        { text: "Moderate, steady energy, intense when focused", dosha: 'pitta' },
        { text: "Steady, enduring energy, slow to start but persistent", dosha: 'kapha' }
      ]
    },
    {
      id: 4,
      category: "Appetite & Digestion",
      question: "How is your appetite and digestion?",
      options: [
        { text: "Variable appetite, irregular eating, quick digestion", dosha: 'vata' },
        { text: "Strong appetite, regular meals, efficient digestion", dosha: 'pitta' },
        { text: "Steady appetite, can skip meals, slow digestion", dosha: 'kapha' }
      ]
    },
    {
      id: 5,
      category: "Sleep Patterns",
      question: "How would you describe your sleep?",
      options: [
        { text: "Light sleeper, difficulty falling asleep, active dreams", dosha: 'vata' },
        { text: "Moderate sleep, wake up refreshed, vivid dreams", dosha: 'pitta' },
        { text: "Deep sleeper, need lots of sleep, pleasant dreams", dosha: 'kapha' }
      ]
    },
    {
      id: 6,
      category: "Mental Qualities",
      question: "How would you describe your mental characteristics?",
      options: [
        { text: "Quick thinking, creative, changeable mood", dosha: 'vata' },
        { text: "Sharp intellect, focused, determined", dosha: 'pitta' },
        { text: "Calm thinking, steady emotions, good memory", dosha: 'kapha' }
      ]
    },
    {
      id: 7,
      category: "Stress Response",
      question: "How do you typically respond to stress?",
      options: [
        { text: "Worry, anxiety, scattered thoughts", dosha: 'vata' },
        { text: "Irritability, frustration, anger", dosha: 'pitta' },
        { text: "Withdrawal, lethargy, resistance to change", dosha: 'kapha' }
      ]
    },
    {
      id: 8,
      category: "Weather Preference",
      question: "What weather do you prefer?",
      options: [
        { text: "Warm, humid weather, dislike cold and wind", dosha: 'vata' },
        { text: "Cool, well-ventilated spaces, dislike heat", dosha: 'pitta' },
        { text: "Warm, dry weather, dislike cold and damp", dosha: 'kapha' }
      ]
    }
  ];

  const handleAnswer = (value: 'vata' | 'pitta' | 'kapha') => {
    setAnswers(prev => ({ ...prev, [currentQuestion]: value }));
  };

  const nextQuestion = () => {
    if (currentQuestion < questions.length - 1) {
      setCurrentQuestion(prev => prev + 1);
    } else {
      calculateResults();
    }
  };

  const prevQuestion = () => {
    if (currentQuestion > 0) {
      setCurrentQuestion(prev => prev - 1);
    }
  };

  const calculateResults = async () => {
    const doshaScores = { vata: 0, pitta: 0, kapha: 0 };
    
    Object.values(answers).forEach(answer => {
      doshaScores[answer]++;
    });

    setResults(doshaScores);
    setShowResults(true);
    
    // Save results to database if user is authenticated
    if (user) {
      try {
        setSaving(true);
        const dominantDosha = getDominantDoshaFromScores(doshaScores);
        const doshaInfo = getDoshaInfo(dominantDosha);
        
        await savePrakritiResult(user.id, {
          dominant_dosha: dominantDosha,
          vata_score: doshaScores.vata,
          pitta_score: doshaScores.pitta,
          kapha_score: doshaScores.kapha,
          recommendations: doshaInfo ? JSON.stringify({
            qualities: doshaInfo.qualities,
            recommendations: doshaInfo.recommendations,
            foods: doshaInfo.foods,
            herbs: doshaInfo.herbs
          }) : null
        });

        // Log activity for gamification
        await logActivity({
          user_id: user.id,
          activity_type: 'prakriti_test_completed',
          metadata: { dosha: dominantDosha, scores: doshaScores },
          points: 100,
          description: 'Completed Prakriti test'
        });

        toast({
          title: "Assessment Complete!",
          description: "Your Prakriti analysis has been saved to your profile.",
        });
      } catch (error) {
        console.error('Error saving prakriti result:', error);
        toast({
          title: "Results Calculated",
          description: "Your analysis is ready, but could not be saved to your profile.",
          variant: "destructive"
        });
      } finally {
        setSaving(false);
      }
    } else {
      toast({
        title: "Assessment Complete!",
        description: "Sign in to save your results to your profile.",
      });
    }
  };

  const getDominantDoshaFromScores = (scores: DoshaResult) => {
    const maxScore = Math.max(scores.vata, scores.pitta, scores.kapha);
    if (scores.vata === maxScore) return 'vata';
    if (scores.pitta === maxScore) return 'pitta';
    return 'kapha';
  };

  const getDominantDosha = () => {
    const maxScore = Math.max(results.vata, results.pitta, results.kapha);
    if (results.vata === maxScore) return 'vata';
    if (results.pitta === maxScore) return 'pitta';
    return 'kapha';
  };

  const getDoshaInfo = (dosha: string) => {
    switch (dosha) {
      case 'vata':
        return {
          name: 'Vata',
          element: 'Air & Space',
          icon: <Wind className="h-8 w-8" />,
          color: 'text-blue-600 dark:text-blue-400',
          bgColor: 'bg-blue-50 dark:bg-blue-950/20',
          borderColor: 'border-blue-200 dark:border-blue-800',
          cardBg: 'bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-blue-950/20 dark:to-indigo-950/20',
          qualities: ['Creative', 'Energetic', 'Quick-thinking', 'Flexible'],
          recommendations: [
            'Regular routine and warm, cooked foods',
            'Oil massage and warm baths',
            'Gentle yoga and meditation',
            'Adequate rest and stress management'
          ],
          foods: ['Warm soups', 'Cooked grains', 'Sweet fruits', 'Herbal teas'],
          herbs: ['Ashwagandha', 'Brahmi', 'Jatamansi', 'Shankhpushpi']
        };
      case 'pitta':
        return {
          name: 'Pitta',
          element: 'Fire & Water',
          icon: <Flame className="h-8 w-8" />,
          color: 'text-red-600 dark:text-red-400',
          bgColor: 'bg-red-50 dark:bg-red-950/20',
          borderColor: 'border-red-200 dark:border-red-800',
          cardBg: 'bg-gradient-to-br from-red-50 to-orange-50 dark:from-red-950/20 dark:to-orange-950/20',
          qualities: ['Intelligent', 'Focused', 'Organized', 'Goal-oriented'],
          recommendations: [
            'Cool, fresh foods and moderate portions',
            'Regular exercise without overheating',
            'Cool environment and relaxation',
            'Avoid excessive heat and spicy foods'
          ],
          foods: ['Fresh fruits', 'Green vegetables', 'Cooling herbs', 'Sweet grains'],
          herbs: ['Amla', 'Aloe Vera', 'Brahmi', 'Shatavari']
        };
      case 'kapha':
        return {
          name: 'Kapha',
          element: 'Earth & Water',
          icon: <Mountain className="h-8 w-8" />,
          color: 'text-primary',
          bgColor: 'bg-primary/5',
          borderColor: 'border-primary/20',
          cardBg: 'bg-gradient-to-br from-primary/5 to-emerald-50 dark:from-primary/10 dark:to-emerald-950/20',
          qualities: ['Stable', 'Compassionate', 'Patient', 'Nurturing'],
          recommendations: [
            'Light, warm, spicy foods in smaller portions',
            'Regular vigorous exercise',
            'Stimulating activities and environments',
            'Avoid heavy, oily, cold foods'
          ],
          foods: ['Spicy vegetables', 'Light grains', 'Herbal teas', 'Fresh ginger'],
          herbs: ['Trikatu', 'Guggulu', 'Punarnava', 'Forskolin']
        };
      default:
        return null;
    }
  };

  const progress = ((currentQuestion + 1) / questions.length) * 100;

  if (showResults) {
    const dominantDosha = getDominantDosha();
    const doshaInfo = getDoshaInfo(dominantDosha);

    return (
      <div className="min-h-screen bg-gradient-to-br from-green-50 via-white to-blue-50">
        <nav className="border-b bg-white/95 backdrop-blur-md sticky top-0 z-50 shadow-sm">
          <div className="container mx-auto px-4 py-4">
            <Link to="/" className="flex items-center space-x-2 hover:opacity-80 transition-opacity">
              <Leaf className="h-6 w-6 text-green-600" />
              <span className="text-xl font-bold text-gray-800">AyurGen - Prakriti Results</span>
            </Link>
          </div>
        </nav>

        <div className="container mx-auto px-4 py-8 max-w-4xl">
          <div className="text-center mb-8 animate-fade-in">
            <h1 className="text-4xl font-bold text-gray-800 mb-4 bg-gradient-to-r from-green-600 to-blue-600 bg-clip-text text-transparent">
              Your Prakriti Assessment Results
            </h1>
            <p className="text-lg text-gray-600">Discover your unique Ayurvedic constitution</p>
          </div>

          {/* Dosha Scores */}
          <Card className="mb-8 border-0 shadow-lg">
            <CardHeader>
              <CardTitle>Your Dosha Distribution</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <div className="flex justify-between items-center mb-2">
                  <span className="flex items-center space-x-2">
                    <Wind className="h-4 w-4 text-blue-600" />
                    <span>Vata</span>
                  </span>
                  <span>{results.vata}/{questions.length}</span>
                </div>
                <Progress value={(results.vata / questions.length) * 100} className="h-2" />
              </div>
              <div>
                <div className="flex justify-between items-center mb-2">
                  <span className="flex items-center space-x-2">
                    <Flame className="h-4 w-4 text-red-600" />
                    <span>Pitta</span>
                  </span>
                  <span>{results.pitta}/{questions.length}</span>
                </div>
                <Progress value={(results.pitta / questions.length) * 100} className="h-2" />
              </div>
              <div>
                <div className="flex justify-between items-center mb-2">
                  <span className="flex items-center space-x-2">
                    <Mountain className="h-4 w-4 text-green-600" />
                    <span>Kapha</span>
                  </span>
                  <span>{results.kapha}/{questions.length}</span>
                </div>
                <Progress value={(results.kapha / questions.length) * 100} className="h-2" />
              </div>
            </CardContent>
          </Card>

          {/* Dominant Dosha Details */}
          {doshaInfo && (
            <Card className={`border-0 shadow-lg ${doshaInfo.bgColor} ${doshaInfo.borderColor} border-2`}>
              <CardHeader>
                <CardTitle className={`flex items-center space-x-3 ${doshaInfo.color}`}>
                  {doshaInfo.icon}
                  <span>Your Dominant Dosha: {doshaInfo.name}</span>
                </CardTitle>
                <CardDescription>
                  <Badge variant="outline" className={doshaInfo.color}>
                    {doshaInfo.element}
                  </Badge>
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div>
                  <h4 className="font-semibold text-gray-800 mb-3">Your Natural Qualities</h4>
                  <div className="flex flex-wrap gap-2">
                    {doshaInfo.qualities.map((quality, index) => (
                      <Badge key={index} variant="outline" className="bg-white">
                        {quality}
                      </Badge>
                    ))}
                  </div>
                </div>

                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <h4 className="font-semibold text-gray-800 mb-3">Lifestyle Recommendations</h4>
                    <ul className="space-y-2">
                      {doshaInfo.recommendations.map((rec, index) => (
                        <li key={index} className="flex items-start space-x-2 text-gray-700">
                          <div className="w-2 h-2 bg-current rounded-full mt-2 opacity-60"></div>
                          <span>{rec}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  <div>
                    <h4 className="font-semibold text-gray-800 mb-3">Recommended Foods</h4>
                    <ul className="space-y-2">
                      {doshaInfo.foods.map((food, index) => (
                        <li key={index} className="flex items-start space-x-2 text-gray-700">
                          <div className="w-2 h-2 bg-current rounded-full mt-2 opacity-60"></div>
                          <span>{food}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>

                <div>
                  <h4 className="font-semibold text-gray-800 mb-3">Beneficial Ayurvedic Herbs</h4>
                  <div className="flex flex-wrap gap-2">
                    {doshaInfo.herbs.map((herb, index) => (
                      <Badge key={index} variant="outline" className="bg-white">
                        {herb}
                      </Badge>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>
          )}

          <div className="flex justify-center space-x-4 mt-8">
            <Button 
              onClick={() => { setShowResults(false); setCurrentQuestion(0); setAnswers({}); }} 
              variant="outline"
              disabled={saving}
              className="transform hover:scale-105 transition-all duration-300"
            >
              Retake Assessment
            </Button>
            <Link to="/dashboard">
              <Button 
                className="bg-gradient-to-r from-primary to-emerald-600 hover:from-primary/90 hover:to-emerald-600/90 transform hover:scale-105 transition-all duration-300"
                disabled={saving}
              >
                {saving ? (
                  <>
                    <Sparkles className="h-4 w-4 mr-2 animate-spin" />
                    Saving...
                  </>
                ) : (
                  <>
                    <CheckCircle className="h-4 w-4 mr-2" />
                    View Dashboard
                  </>
                )}
              </Button>
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-white to-blue-50">
      <nav className="border-b bg-white/95 backdrop-blur-md sticky top-0 z-50 shadow-sm">
        <div className="container mx-auto px-4 py-4">
          <Link to="/" className="flex items-center space-x-2 hover:opacity-80 transition-opacity">
            <Leaf className="h-6 w-6 text-green-600" />
            <span className="text-xl font-bold text-gray-800">AyurGen - Prakriti Assessment</span>
          </Link>
        </div>
      </nav>

      <div className="container mx-auto px-4 py-8 max-w-2xl">
        <div className="text-center mb-8 animate-fade-in">
          <h1 className="text-4xl font-bold text-gray-800 mb-4 bg-gradient-to-r from-green-600 to-blue-600 bg-clip-text text-transparent">
            Discover Your Prakriti
          </h1>
          <p className="text-lg text-gray-600">Ancient Ayurvedic body constitution assessment</p>
        </div>

        <Card className="border-0 shadow-lg">
          <CardHeader>
            <div className="flex justify-between items-center">
              <CardTitle>Question {currentQuestion + 1} of {questions.length}</CardTitle>
              <Badge variant="outline">{questions[currentQuestion].category}</Badge>
            </div>
            <Progress value={progress} className="mt-2" />
          </CardHeader>
          <CardContent className="space-y-6">
            <h3 className="text-xl font-semibold text-gray-800">
              {questions[currentQuestion].question}
            </h3>

            <RadioGroup
              value={answers[currentQuestion] || ""}
              onValueChange={(value) => handleAnswer(value as 'vata' | 'pitta' | 'kapha')}
            >
              {questions[currentQuestion].options.map((option, index) => (
                <div key={index} className="flex items-start space-x-3 p-4 rounded-lg border hover:bg-gray-50 transition-colors">
                  <RadioGroupItem value={option.dosha} id={`option-${index}`} className="mt-1" />
                  <Label htmlFor={`option-${index}`} className="flex-1 cursor-pointer leading-relaxed">
                    {option.text}
                  </Label>
                </div>
              ))}
            </RadioGroup>

            <div className="flex justify-between pt-4">
              <Button 
                onClick={prevQuestion} 
                disabled={currentQuestion === 0}
                variant="outline"
              >
                Previous
              </Button>
              <Button 
                onClick={nextQuestion}
                disabled={!answers[currentQuestion]}
                className="bg-gradient-to-r from-green-600 to-blue-600"
              >
                {currentQuestion === questions.length - 1 ? 'Get Results' : 'Next'}
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default PrakritiTest;
