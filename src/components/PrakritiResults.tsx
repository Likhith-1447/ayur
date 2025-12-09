import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Wind, Flame, Mountain, Sparkles, ArrowRight, Leaf } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useUser } from '@clerk/clerk-react';
import { getUserPrakritiResult, PrakritiResult } from '@/lib/database';
import { Skeleton } from '@/components/ui/skeleton';

const PrakritiResults = () => {
  const { user } = useUser();
  const [prakritiResult, setPrakritiResult] = useState<PrakritiResult | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user?.id) {
      fetchPrakritiResult();
    }
  }, [user?.id]);

  const fetchPrakritiResult = async () => {
    try {
      setLoading(true);
      const result = await getUserPrakritiResult(user!.id);
      setPrakritiResult(result);
    } catch (error) {
      console.error('Error fetching prakriti result:', error);
    } finally {
      setLoading(false);
    }
  };

  const getDoshaIcon = (dosha: string) => {
    switch (dosha) {
      case 'vata':
        return <Wind className="h-6 w-6" />;
      case 'pitta':
        return <Flame className="h-6 w-6" />;
      case 'kapha':
        return <Mountain className="h-6 w-6" />;
      default:
        return <Leaf className="h-6 w-6" />;
    }
  };

  const getDoshaColor = (dosha: string) => {
    switch (dosha) {
      case 'vata':
        return 'text-[hsl(var(--vata))]';
      case 'pitta':
        return 'text-[hsl(var(--pitta))]';
      case 'kapha':
        return 'text-[hsl(var(--kapha))]';
      default:
        return 'text-primary';
    }
  };

  const getDoshaBg = (dosha: string) => {
    switch (dosha) {
      case 'vata':
        return 'bg-gradient-to-br from-[hsl(var(--vata))]/5 to-[hsl(var(--vata))]/10 dark:from-[hsl(var(--vata))]/10 dark:to-[hsl(var(--vata))]/20';
      case 'pitta':
        return 'bg-gradient-to-br from-[hsl(var(--pitta))]/5 to-[hsl(var(--pitta))]/10 dark:from-[hsl(var(--pitta))]/10 dark:to-[hsl(var(--pitta))]/20';
      case 'kapha':
        return 'bg-gradient-to-br from-[hsl(var(--kapha))]/5 to-[hsl(var(--kapha))]/10 dark:from-[hsl(var(--kapha))]/10 dark:to-[hsl(var(--kapha))]/20';
      default:
        return 'bg-gradient-to-br from-primary/5 to-primary/10 dark:from-primary/10 dark:to-primary/20';
    }
  };

  if (loading) {
    return (
      <Card className="border-0 shadow-lg hover:shadow-xl transition-all duration-300 animate-fade-in">
        <CardHeader>
          <div className="flex items-center space-x-2">
            <Skeleton className="h-6 w-6 rounded-full" />
            <Skeleton className="h-6 w-32" />
          </div>
          <Skeleton className="h-4 w-48" />
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-2 w-full" />
          </div>
          <div className="space-y-2">
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-2 w-full" />
          </div>
          <div className="space-y-2">
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-2 w-full" />
          </div>
        </CardContent>
      </Card>
    );
  }

  if (!prakritiResult) {
    return (
      <Card className="border-0 shadow-lg hover:shadow-xl transition-all duration-300 animate-bounce-in overflow-hidden relative group">
        <div className="absolute inset-0 bg-gradient-to-r from-primary/5 to-emerald-50 dark:from-primary/10 dark:to-emerald-950/20 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
        <CardHeader className="relative z-10">
          <CardTitle className="flex items-center space-x-2 group-hover:text-primary transition-colors duration-300">
            <Sparkles className="h-6 w-6 text-primary animate-pulse" />
            <span>Discover Your Prakriti</span>
          </CardTitle>
          <CardDescription>
            Take our ancient Ayurvedic constitution test to unlock personalized health recommendations
          </CardDescription>
        </CardHeader>
        <CardContent className="relative z-10">
          <div className="text-center py-4">
            <div className="mb-4 animate-float">
              <Leaf className="h-16 w-16 text-primary mx-auto opacity-50" />
            </div>
            <p className="text-muted-foreground mb-6">
              Understanding your unique constitution is the foundation of Ayurvedic wellness
            </p>
            <Link to="/prakriti-test">
              <Button className="bg-gradient-to-r from-primary to-emerald-600 hover:from-primary/90 hover:to-emerald-600/90 text-white transform hover:scale-105 transition-all duration-300 hover:shadow-lg">
                <Sparkles className="h-4 w-4 mr-2" />
                Take Prakriti Test
                <ArrowRight className="h-4 w-4 ml-2" />
              </Button>
            </Link>
          </div>
        </CardContent>
      </Card>
    );
  }

  const totalQuestions = prakritiResult.vata_score + prakritiResult.pitta_score + prakritiResult.kapha_score;

  return (
    <Card className={`border-0 shadow-lg hover:shadow-xl transition-all duration-300 animate-fade-in overflow-hidden relative group ${getDoshaBg(prakritiResult.dominant_dosha)}`}>
      <div className="absolute inset-0 opacity-80"></div>
      <CardHeader className="relative z-10">
        <CardTitle className={`flex items-center space-x-2 ${getDoshaColor(prakritiResult.dominant_dosha)} group-hover:scale-105 transition-transform duration-300`}>
          {getDoshaIcon(prakritiResult.dominant_dosha)}
          <span>Your Prakriti: {prakritiResult.dominant_dosha.charAt(0).toUpperCase() + prakritiResult.dominant_dosha.slice(1)}</span>
        </CardTitle>
        <CardDescription>
          Your Ayurvedic constitution analysis from {new Date(prakritiResult.created_at).toLocaleDateString()}
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6 relative z-10">
        <div className="space-y-4">
          <div className="space-y-2 transform hover:scale-105 transition-transform duration-300">
            <div className="flex justify-between items-center">
              <span className="flex items-center space-x-2">
                <Wind className="h-4 w-4 text-[hsl(var(--vata))]" />
                <span className="text-sm font-medium">Vata</span>
              </span>
              <span className="text-sm font-semibold">{prakritiResult.vata_score}/{totalQuestions}</span>
            </div>
            <Progress 
              value={(prakritiResult.vata_score / totalQuestions) * 100} 
              className="h-2 animate-pulse" 
            />
          </div>
          
          <div className="space-y-2 transform hover:scale-105 transition-transform duration-300">
            <div className="flex justify-between items-center">
              <span className="flex items-center space-x-2">
                <Flame className="h-4 w-4 text-[hsl(var(--pitta))]" />
                <span className="text-sm font-medium">Pitta</span>
              </span>
              <span className="text-sm font-semibold">{prakritiResult.pitta_score}/{totalQuestions}</span>
            </div>
            <Progress 
              value={(prakritiResult.pitta_score / totalQuestions) * 100} 
              className="h-2 animate-pulse" 
            />
          </div>
          
          <div className="space-y-2 transform hover:scale-105 transition-transform duration-300">
            <div className="flex justify-between items-center">
              <span className="flex items-center space-x-2">
                <Mountain className="h-4 w-4 text-[hsl(var(--kapha))]" />
                <span className="text-sm font-medium">Kapha</span>
              </span>
              <span className="text-sm font-semibold">{prakritiResult.kapha_score}/{totalQuestions}</span>
            </div>
            <Progress 
              value={(prakritiResult.kapha_score / totalQuestions) * 100} 
              className="h-2 animate-pulse" 
            />
          </div>
        </div>

        {prakritiResult.recommendations && (
          <div className="space-y-3">
            <h4 className="font-semibold text-foreground">Recommendations</h4>
            <p className="text-sm text-muted-foreground">{prakritiResult.recommendations}</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default PrakritiResults;