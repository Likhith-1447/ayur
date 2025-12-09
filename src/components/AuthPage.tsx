
import { SignedIn, SignedOut, SignInButton, SignUpButton, UserButton } from '@clerk/clerk-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Shield, UserPlus, LogIn, Sparkles, Heart, Brain, Activity } from 'lucide-react';

const AuthPage = () => {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-background via-background/50 to-muted/30 p-4 relative overflow-hidden">
      {/* Animated background elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-4 -left-4 w-72 h-72 bg-primary/10 rounded-full animate-float"></div>
        <div className="absolute top-1/2 -right-8 w-96 h-96 bg-purple-500/10 rounded-full animate-float" style={{ animationDelay: '1s' }}></div>
        <div className="absolute bottom-8 left-1/3 w-64 h-64 bg-emerald-500/10 rounded-full animate-float" style={{ animationDelay: '2s' }}></div>
      </div>

      <Card className="w-full max-w-md shadow-2xl animate-bounce-in glass border-0 relative z-10 overflow-hidden">
        {/* Shimmer effect */}
        <div className="absolute inset-0 animate-shimmer"></div>
        
        <CardHeader className="text-center space-y-6 relative z-10">
          <div className="mx-auto w-16 h-16 bg-gradient-to-r from-primary to-purple-600 rounded-full flex items-center justify-center shadow-lg animate-pulse-glow">
            <Shield className="w-8 h-8 text-white animate-wiggle" />
          </div>
          
          <div className="space-y-4">
            <CardTitle className="text-3xl font-bold gradient-text animate-gradient">
              Welcome to AyurWellness
            </CardTitle>
            <CardDescription className="text-muted-foreground text-lg leading-relaxed animate-fade-in" style={{ animationDelay: '0.3s' }}>
              Unlock your personalized health journey with AI-powered insights, gamified wellness tracking, and ancient Ayurvedic wisdom.
            </CardDescription>
          </div>

          {/* Feature highlights */}
          <div className="grid grid-cols-3 gap-4 mt-6">
            {[
              { icon: Heart, label: "Health Analysis", color: "text-red-500" },
              { icon: Brain, label: "AI Insights", color: "text-purple-500" },
              { icon: Activity, label: "Live Tracking", color: "text-emerald-500" }
            ].map((feature, index) => (
              <div 
                key={feature.label} 
                className="text-center animate-scale-in hover:scale-110 transition-transform duration-300 cursor-pointer"
                style={{ animationDelay: `${0.5 + index * 0.1}s` }}
              >
                <feature.icon className={`w-6 h-6 ${feature.color} mx-auto mb-2 animate-pulse`} />
                <p className="text-xs text-muted-foreground font-medium">{feature.label}</p>
              </div>
            ))}
          </div>
        </CardHeader>

        <CardContent className="space-y-6 relative z-10">
          <SignedOut>
            <div className="space-y-4">
              <SignInButton mode="modal" fallbackRedirectUrl="/">
                <Button 
                  variant="default" 
                  className="w-full bg-gradient-to-r from-primary to-purple-600 hover:from-primary/90 hover:to-purple-600/90 text-white font-semibold py-3 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105 animate-pulse-glow magnetic" 
                  size="lg"
                >
                  <LogIn className="w-5 h-5 mr-2 animate-wiggle" />
                  Sign In to Continue
                  <Sparkles className="w-4 h-4 ml-2 animate-pulse" />
                </Button>
              </SignInButton>
              
              <SignUpButton mode="modal" fallbackRedirectUrl="/">
                <Button 
                  variant="outline" 
                  className="w-full border-2 border-primary/20 hover:border-primary/40 hover:bg-primary/5 font-semibold py-3 rounded-xl shadow-md hover:shadow-lg transition-all duration-300 transform hover:scale-105 magnetic glass" 
                  size="lg"
                >
                  <UserPlus className="w-5 h-5 mr-2 animate-wiggle" />
                  Create New Account
                </Button>
              </SignUpButton>
            </div>
            
            <div className="text-center space-y-4">
              <p className="text-xs text-muted-foreground animate-fade-in" style={{ animationDelay: '0.8s' }}>
                By continuing, you agree to our{' '}
                <span className="text-primary hover:underline cursor-pointer">Terms of Service</span>{' '}
                and{' '}
                <span className="text-primary hover:underline cursor-pointer">Privacy Policy</span>
              </p>
              
              {/* Trust indicators */}
              <div className="flex justify-center items-center space-x-4 pt-4 border-t border-border/50">
                <div className="flex items-center space-x-1 text-xs text-muted-foreground animate-fade-in" style={{ animationDelay: '1s' }}>
                  <Shield className="w-3 h-3 text-green-500" />
                  <span>Secure & Private</span>
                </div>
                <div className="flex items-center space-x-1 text-xs text-muted-foreground animate-fade-in" style={{ animationDelay: '1.1s' }}>
                  <Sparkles className="w-3 h-3 text-purple-500" />
                  <span>AI-Powered</span>
                </div>
              </div>
            </div>
          </SignedOut>

          <SignedIn>
            <div className="text-center space-y-6 animate-bounce-in">
              <div className="p-4 bg-green-50 dark:bg-green-950/20 rounded-xl border border-green-200 dark:border-green-800">
                <p className="text-sm text-green-700 dark:text-green-300 font-medium mb-3">
                  🎉 Successfully signed in!
                </p>
                <UserButton 
                  appearance={{
                    elements: {
                      avatarBox: "w-12 h-12 shadow-lg animate-pulse-glow"
                    }
                  }}
                />
              </div>
              
              <Button 
                onClick={() => window.location.href = '/'}
                className="w-full bg-gradient-to-r from-emerald-500 to-green-600 hover:from-emerald-600 hover:to-green-700 text-white font-semibold py-3 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105"
              >
                <Activity className="w-5 h-5 mr-2" />
                Go to Dashboard
              </Button>
            </div>
          </SignedIn>
        </CardContent>
      </Card>
    </div>
  );
};

export default AuthPage;
