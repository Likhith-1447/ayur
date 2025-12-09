
import { useState, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Leaf, Heart, Sparkles, Award, Shield, Globe } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useUser } from "@clerk/clerk-react";
import ProductHeader from "@/components/ProductHeader";
import ProductFilters from "@/components/ProductFilters";
import ProductCard from "@/components/ProductCard";
import { getProducts, addToCart, getCartItems, type Product } from "@/lib/product-database";

const AyurvedicProducts = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [products, setProducts] = useState<Product[]>([]);
  const [cartCount, setCartCount] = useState(0);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();
  const { user } = useUser();
  
  // Load cart count on component mount
  useEffect(() => {
    const loadCartCount = async () => {
      if (user) {
        try {
          const items = await getCartItems(user.id);
          setCartCount(items.reduce((sum, item) => sum + item.quantity, 0));
        } catch (error) {
          console.error("Error loading cart count:", error);
        }
      }
    };
    loadCartCount();
  }, [user]);

  useEffect(() => {
    loadProducts();
  }, [selectedCategory]);

  const loadProducts = async () => {
    setLoading(true);
    try {
      const fetchedProducts = await getProducts(selectedCategory);
      setProducts(fetchedProducts);
    } catch (error) {
      console.error("Error loading products:", error);
      toast({
        title: "Error",
        description: "Failed to load products",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const categories = [
    { id: "all", name: "All Products" },
    { id: "herbs", name: "Herbal Supplements" },
    { id: "digestive", name: "Digestive Health" },
    { id: "brain", name: "Brain & Memory" },
    { id: "inflammation", name: "Anti-inflammatory" },
    { id: "heart", name: "Heart Care" },
    { id: "skin", name: "Skin & Beauty" },
    { id: "immunity", name: "Immunity Boost" },
    { id: "superfood", name: "Superfoods" },
    { id: "respiratory", name: "Respiratory" },
    { id: "women", name: "Women's Health" }
  ];

  const filteredProducts = products.filter(product => {
    const matchesSearch = product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         product.description.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesSearch;
  });

  const handleAddToCart = async (productId: string) => {
    if (!user) {
      toast({
        title: "Please Sign In",
        description: "You need to be signed in to add items to cart",
        variant: "destructive",
      });
      return;
    }

    try {
      const result = await addToCart(user.id, productId);
      if (result) {
        // Reload cart count
        const items = await getCartItems(user.id);
        setCartCount(items.reduce((sum, item) => sum + item.quantity, 0));
        
        const product = products.find(p => p.id === productId);
        toast({
          title: "✨ Added to Cart",
          description: `${product?.name} has been added to your cart.`,
        });
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to add item to cart",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-secondary/10 to-accent/5">
      <ProductHeader cartCount={cartCount} />

      <div className="container mx-auto px-4 py-12 max-w-7xl">
        {/* Enhanced Filters */}
        <div className="mb-12">
          <ProductFilters
            searchTerm={searchTerm}
            setSearchTerm={setSearchTerm}
            selectedCategory={selectedCategory}
            setSelectedCategory={setSelectedCategory}
            categories={categories}
          />
        </div>

        {/* Products Grid */}
        {filteredProducts.length > 0 ? (
          <div className="grid sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
            {filteredProducts.map((product, index) => (
              <ProductCard
                key={product.id}
                product={product}
                onAddToCart={handleAddToCart}
                animationDelay={index * 0.1}
              />
            ))}
          </div>
        ) : (
          <div className="text-center py-20 animate-fade-in">
            <div className="relative mb-8">
              <Leaf className="mx-auto h-24 w-24 text-muted-foreground/40" />
              <Sparkles className="absolute top-0 right-1/2 transform translate-x-6 h-6 w-6 text-primary animate-pulse" />
            </div>
            <h3 className="text-2xl font-bold text-card-foreground mb-4">No products found</h3>
            <p className="text-muted-foreground text-lg max-w-md mx-auto">
              Try adjusting your search terms or browse our categories to discover amazing products
            </p>
          </div>
        )}

        {/* Enhanced Features Section */}
        <div className="mt-20 space-y-12">
          <div className="text-center animate-fade-in">
            <h2 className="text-3xl font-bold gradient-text mb-4">Why Choose AyurGen?</h2>
            <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
              Experience the perfect blend of ancient wisdom and modern quality standards
            </p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8">
            <Card className="relative overflow-hidden border-0 shadow-lg hover:shadow-2xl transition-all duration-500 card-interactive bg-gradient-to-br from-card to-secondary/20 group">
              <div className="absolute top-0 right-0 w-32 h-32 bg-primary/5 rounded-full -translate-y-16 translate-x-16 group-hover:scale-150 transition-transform duration-700"></div>
              <CardContent className="relative p-8 text-center">
                <div className="mb-6 relative">
                  <Leaf className="mx-auto h-16 w-16 text-primary animate-float" />
                  <div className="absolute inset-0 bg-primary/20 rounded-full blur-xl animate-pulse"></div>
                </div>
                <h3 className="text-xl font-bold text-card-foreground mb-3">100% Natural & Pure</h3>
                <p className="text-muted-foreground leading-relaxed">
                  Sourced directly from nature with no artificial additives, preservatives, or synthetic compounds
                </p>
              </CardContent>
            </Card>

            <Card className="relative overflow-hidden border-0 shadow-lg hover:shadow-2xl transition-all duration-500 card-interactive bg-gradient-to-br from-card to-accent/20 group">
              <div className="absolute top-0 right-0 w-32 h-32 bg-blue-500/5 rounded-full -translate-y-16 translate-x-16 group-hover:scale-150 transition-transform duration-700"></div>
              <CardContent className="relative p-8 text-center">
                <div className="mb-6 relative">
                  <Shield className="mx-auto h-16 w-16 text-blue-600 animate-float" style={{ animationDelay: '0.5s' }} />
                  <div className="absolute inset-0 bg-blue-600/20 rounded-full blur-xl animate-pulse"></div>
                </div>
                <h3 className="text-xl font-bold text-card-foreground mb-3">Certified Quality</h3>
                <p className="text-muted-foreground leading-relaxed">
                  Rigorously tested and certified by trusted authorities for purity, potency, and safety
                </p>
              </CardContent>
            </Card>

            <Card className="relative overflow-hidden border-0 shadow-lg hover:shadow-2xl transition-all duration-500 card-interactive bg-gradient-to-br from-card to-purple-50/20 group">
              <div className="absolute top-0 right-0 w-32 h-32 bg-purple-500/5 rounded-full -translate-y-16 translate-x-16 group-hover:scale-150 transition-transform duration-700"></div>
              <CardContent className="relative p-8 text-center">
                <div className="mb-6 relative">
                  <Award className="mx-auto h-16 w-16 text-purple-600 animate-float" style={{ animationDelay: '1s' }} />
                  <div className="absolute inset-0 bg-purple-600/20 rounded-full blur-xl animate-pulse"></div>
                </div>
                <h3 className="text-xl font-bold text-card-foreground mb-3">Ancient Wisdom</h3>
                <p className="text-muted-foreground leading-relaxed">
                  Formulated using time-tested Ayurvedic principles passed down through generations
                </p>
              </CardContent>
            </Card>
          </div>

          {/* Additional Trust Indicators */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 pt-8 border-t border-border">
            <div className="text-center animate-scale-in">
              <div className="text-2xl font-bold text-primary mb-1">50,000+</div>
              <div className="text-sm text-muted-foreground">Happy Customers</div>
            </div>
            <div className="text-center animate-scale-in stagger-1">
              <div className="text-2xl font-bold text-primary mb-1">4.8★</div>
              <div className="text-sm text-muted-foreground">Average Rating</div>
            </div>
            <div className="text-center animate-scale-in stagger-2">
              <div className="text-2xl font-bold text-primary mb-1">15+</div>
              <div className="text-sm text-muted-foreground">Years Experience</div>
            </div>
            <div className="text-center animate-scale-in stagger-3">
              <div className="text-2xl font-bold text-primary mb-1">100%</div>
              <div className="text-sm text-muted-foreground">Money Back</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AyurvedicProducts;
