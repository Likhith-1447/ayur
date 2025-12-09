import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ShoppingCart, Star, Heart, Eye, Sparkles } from "lucide-react";
import { type Product } from "@/lib/product-database";

interface ProductCardProps {
  product: Product;
  onAddToCart: (productId: string) => void;
  animationDelay?: number;
}

const ProductCard = ({ product, onAddToCart, animationDelay = 0 }: ProductCardProps) => {
  const [isImageLoaded, setIsImageLoaded] = useState(false);
  const [isHovered, setIsHovered] = useState(false);

  const renderStars = (rating: number) => {
    return Array.from({ length: 5 }, (_, i) => (
      <Star
        key={i}
        className={`h-4 w-4 transition-colors duration-300 ${
          i < Math.floor(rating) 
            ? 'text-yellow-400 fill-current' 
            : 'text-muted-foreground/30'
        }`}
      />
    ));
  };

  const discountPercentage = 0;

  return (
    <Card 
      className={`group relative overflow-hidden card-interactive hover-lift bg-gradient-to-br from-card via-card to-secondary/20 border-0 shadow-lg hover:shadow-2xl transition-all duration-700 animate-scale-in ${
        product.stock_quantity <= 0 ? 'opacity-75' : ''
      }`}
      style={{ animationDelay: `${animationDelay}s` }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Floating Elements */}
      <div className="absolute -top-2 -right-2 z-10">
        <Sparkles className="h-6 w-6 text-primary animate-pulse opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
      </div>

      {/* Image Container */}
      <div className="relative overflow-hidden bg-gradient-to-br from-secondary to-accent rounded-t-xl">
        <div className={`w-full h-64 bg-gradient-to-br from-secondary via-accent to-secondary/50 flex items-center justify-center transition-all duration-500 ${
          isImageLoaded ? 'opacity-0' : 'opacity-100'
        }`}>
          <div className="animate-pulse">
            <Heart className="h-12 w-12 text-primary/40" />
          </div>
        </div>
        
        <img
          src={product.image_url || `https://images.unsplash.com/photo-1556909559-f3a6d1dec6e6?w=400&h=300&fit=crop&auto=format`}
          alt={product.name}
          className={`absolute inset-0 w-full h-64 object-cover transition-all duration-700 group-hover:scale-110 ${
            isImageLoaded ? 'opacity-100' : 'opacity-0'
          }`}
          onLoad={() => setIsImageLoaded(true)}
        />

        {/* Overlay Elements */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
        
        {/* Badges */}
        <div className="absolute top-3 left-3 flex flex-col gap-2">
          {discountPercentage > 0 && (
            <Badge className="bg-destructive text-destructive-foreground animate-bounce-in shadow-lg">
              {discountPercentage}% OFF
            </Badge>
          )}
          {product.stock_quantity <= 0 && (
            <Badge variant="secondary" className="bg-muted text-muted-foreground">
              Out of Stock
            </Badge>
          )}
        </div>

        {/* Quick Actions */}
        <div className={`absolute top-3 right-3 flex flex-col gap-2 transform transition-all duration-500 ${
          isHovered ? 'translate-x-0 opacity-100' : 'translate-x-full opacity-0'
        }`}>
          <Button size="sm" variant="secondary" className="h-8 w-8 p-0 rounded-full shadow-lg">
            <Heart className="h-4 w-4" />
          </Button>
          <Button size="sm" variant="secondary" className="h-8 w-8 p-0 rounded-full shadow-lg">
            <Eye className="h-4 w-4" />
          </Button>
        </div>
      </div>
      
      <CardHeader className="pb-3">
        <CardTitle className="text-lg font-bold line-clamp-2 text-card-foreground group-hover:text-primary transition-colors duration-300">
          {product.name}
        </CardTitle>
        <CardDescription className="line-clamp-2 text-muted-foreground">
          {product.description}
        </CardDescription>
      </CardHeader>
      
      <CardContent className="space-y-4">
        {/* Rating */}
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-1">
            {renderStars(product.rating)}
          </div>
          <span className="text-sm font-medium text-muted-foreground">
            {product.rating} ({product.reviews_count})
          </span>
        </div>

        {/* Benefits */}
        <div className="flex flex-wrap gap-1">
          {(() => {
            const benefitsArray: string[] = Array.isArray(product.benefits) 
              ? product.benefits 
              : (product.benefits ? (product.benefits as string).split(',').map(b=>b.trim()).filter(Boolean) : []);
            return benefitsArray.slice(0, 3).map((benefit, index) => (
              <Badge 
                key={index} 
                variant="outline" 
                className="text-xs bg-accent/50 text-accent-foreground border-accent hover:bg-accent transition-colors duration-300"
              >
                {benefit}
              </Badge>
            ));
          })()}
        </div>

        {/* Price */}
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <span className="text-2xl font-bold text-primary">
              ₹{Number(product.price).toLocaleString()}
            </span>
          </div>
        </div>

        {/* Add to Cart Button */}
        <Button
          onClick={() => onAddToCart(product.id)}
          disabled={product.stock_quantity <= 0}
          className={`w-full h-12 font-semibold transition-all duration-500 transform ${
            product.stock_quantity > 0 
              ? 'bg-primary hover:bg-primary/90 text-primary-foreground shadow-lg hover:shadow-xl hover:scale-105' 
              : 'bg-muted text-muted-foreground cursor-not-allowed'
          }`}
        >
          <ShoppingCart className="mr-2 h-5 w-5" />
          {product.stock_quantity > 0 ? "Add to Cart" : "Out of Stock"}
        </Button>
      </CardContent>
    </Card>
  );
};

export default ProductCard;