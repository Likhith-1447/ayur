import { Leaf, Sparkles, Heart, ShoppingCart } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";

interface ProductHeaderProps {
  cartCount: number;
}

const ProductHeader = ({ cartCount }: ProductHeaderProps) => {
  return (
    <>
      {/* Enhanced Navigation */}
      <nav className="sticky top-0 z-50 border-b bg-card/95 backdrop-blur-lg shadow-lg">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <Link to="/" className="group flex items-center space-x-3 animate-slide-in-right">
              <div className="relative">
                <div className="absolute inset-0 bg-primary/20 rounded-full animate-pulse"></div>
                <div className="relative p-2 bg-gradient-to-br from-primary to-primary/80 rounded-full shadow-lg group-hover:shadow-xl transition-all duration-300">
                  <Leaf className="h-6 w-6 text-primary-foreground animate-float" />
                </div>
                <Sparkles className="absolute -top-1 -right-1 h-4 w-4 text-yellow-500 animate-pulse" />
              </div>
              <div>
                <span className="text-2xl font-bold gradient-text">
                  AyurGen Store
                </span>
                <div className="text-xs text-muted-foreground font-medium">Premium Wellness</div>
              </div>
            </Link>
            
            <div className="flex items-center space-x-4">
              <Link to="/cart">
                <Button 
                  variant="outline" 
                  size="lg" 
                  className="group hover:scale-105 transition-all duration-300 hover:shadow-lg border-primary/20 hover:border-primary bg-card hover:bg-primary/5"
                >
                  <ShoppingCart className="mr-2 h-5 w-5 group-hover:animate-wiggle" />
                  <span className="font-semibold">Cart</span>
                  {cartCount > 0 && (
                    <span className="ml-2 bg-primary text-primary-foreground text-xs font-bold rounded-full h-6 w-6 flex items-center justify-center animate-bounce-in">
                      {cartCount}
                    </span>
                  )}
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <div className="relative overflow-hidden bg-gradient-to-br from-background via-secondary/30 to-accent/20 py-16">
        {/* Animated Background Elements */}
        <div className="absolute inset-0">
          <div className="absolute top-20 left-10 w-32 h-32 bg-primary/10 rounded-full animate-float blur-xl"></div>
          <div className="absolute bottom-20 right-10 w-24 h-24 bg-accent/20 rounded-full animate-float blur-lg" style={{ animationDelay: '1s' }}></div>
          <div className="absolute top-1/2 left-1/3 w-16 h-16 bg-secondary/30 rounded-full animate-float blur-md" style={{ animationDelay: '2s' }}></div>
        </div>

        <div className="relative container mx-auto px-4 text-center">
          <div className="animate-fade-in">
            <div className="flex justify-center mb-6">
              <div className="relative">
                <Heart className="h-16 w-16 text-primary animate-pulse" />
                <div className="absolute inset-0 h-16 w-16 text-primary/30 animate-ping"></div>
              </div>
            </div>
            
            <h1 className="text-5xl md:text-6xl font-bold mb-6 gradient-text">
              Authentic Ayurvedic Products
            </h1>
            
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto leading-relaxed">
              Discover traditional Ayurvedic medicines and wellness products sourced from 
              <span className="text-primary font-semibold"> trusted manufacturers </span>
              around the world
            </p>
            
            <div className="flex justify-center gap-4 mt-8">
              <div className="flex items-center gap-2 text-sm text-muted-foreground bg-card/50 backdrop-blur-sm px-4 py-2 rounded-full border border-border/50">
                <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                <span>100% Natural</span>
              </div>
              <div className="flex items-center gap-2 text-sm text-muted-foreground bg-card/50 backdrop-blur-sm px-4 py-2 rounded-full border border-border/50">
                <div className="w-2 h-2 bg-blue-500 rounded-full animate-pulse"></div>
                <span>Trusted Quality</span>
              </div>
              <div className="flex items-center gap-2 text-sm text-muted-foreground bg-card/50 backdrop-blur-sm px-4 py-2 rounded-full border border-border/50">
                <div className="w-2 h-2 bg-purple-500 rounded-full animate-pulse"></div>
                <span>Ancient Wisdom</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default ProductHeader;