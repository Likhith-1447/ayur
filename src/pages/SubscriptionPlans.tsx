
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { 
  Package, 
  Clock, 
  Star, 
  Check, 
  Zap, 
  Heart, 
  Brain, 
  Shield,
  Truck,
  Calendar,
  Gift,
  Crown,
  Leaf
} from "lucide-react";
import { Link } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";

interface SubscriptionPlan {
  id: string;
  name: string;
  price: number;
  originalPrice?: number;
  duration: string;
  description: string;
  features: string[];
  products: string[];
  icon: JSX.Element;
  color: string;
  bgColor: string;
  borderColor: string;
  popular?: boolean;
}

const SubscriptionPlans = () => {
  const [billingCycle, setBillingCycle] = useState<'monthly' | 'yearly'>('monthly');
  const [selectedPlan, setSelectedPlan] = useState<string | null>(null);
  const { toast } = useToast();

  const plans: SubscriptionPlan[] = [
    {
      id: 'digestive',
      name: 'Digestive Wellness',
      price: billingCycle === 'monthly' ? 1299 : 12990,
      originalPrice: billingCycle === 'monthly' ? 1599 : 15990,
      duration: billingCycle === 'monthly' ? '/month' : '/year',
      description: 'Complete digestive health support with personalized Ayurvedic formulations',
      features: [
        'Monthly Triphala Churna delivery',
        'Digestive enzyme supplements',
        'Weekly AI diet recommendations',
        'Personalized meal plans',
        'Priority doctor consultations',
        '24/7 digestive health support'
      ],
      products: ['Triphala Churna', 'Hingwashtak Churna', 'Ajwain Powder', 'Digestive Tea'],
      icon: <Heart className="h-8 w-8" />,
      color: 'text-orange-600',
      bgColor: 'bg-orange-50',
      borderColor: 'border-orange-200'
    },
    {
      id: 'sleep',
      name: 'Sleep & Stress Relief',
      price: billingCycle === 'monthly' ? 1499 : 14990,
      originalPrice: billingCycle === 'monthly' ? 1799 : 17990,
      duration: billingCycle === 'monthly' ? '/month' : '/year',
      description: 'Natural sleep enhancement and stress management solutions',
      features: [
        'Monthly Ashwagandha & Brahmi supply',
        'Sleep-inducing herbal teas',
        'Meditation guidance videos',
        'Sleep tracking insights',
        'Stress management techniques',
        'Personalized bedtime routines'
      ],
      products: ['Ashwagandha Capsules', 'Brahmi Oil', 'Chamomile Tea', 'Sleep Blend'],
      icon: <Brain className="h-8 w-8" />,
      color: 'text-purple-600',
      bgColor: 'bg-purple-50',
      borderColor: 'border-purple-200',
      popular: true
    },
    {
      id: 'immunity',
      name: 'Immunity Booster',
      price: billingCycle === 'monthly' ? 999 : 9990,
      originalPrice: billingCycle === 'monthly' ? 1299 : 12990,
      duration: billingCycle === 'monthly' ? '/month' : '/year',
      description: 'Strengthen your immune system with powerful Ayurvedic herbs',
      features: [
        'Monthly Giloy & Amla supplements',
        'Immunity-boosting kadhas',
        'Seasonal health tips',
        'Preventive care guidance',
        'Health monitoring alerts',
        'Emergency consultation access'
      ],
      products: ['Giloy Tablets', 'Amla Powder', 'Immunity Kadha', 'Tulsi Drops'],
      icon: <Shield className="h-8 w-8" />,
      color: 'text-green-600',
      bgColor: 'bg-green-50',
      borderColor: 'border-green-200'
    },
    {
      id: 'premium',
      name: 'Complete Wellness',
      price: billingCycle === 'monthly' ? 2499 : 24990,
      originalPrice: billingCycle === 'monthly' ? 2999 : 29990,
      duration: billingCycle === 'monthly' ? '/month' : '/year',
      description: 'Comprehensive health package with all premium features',
      features: [
        'All subscription benefits included',
        'Monthly doctor consultations',
        'Personalized Prakriti analysis',
        'Custom herbal formulations',
        'Priority customer support',
        'Exclusive wellness workshops',
        'Health analytics dashboard',
        'Genetic-based recommendations'
      ],
      products: ['Custom Herbal Mix', 'Premium Oils', 'Rare Ayurvedic Herbs', 'Wellness Kit'],
      icon: <Crown className="h-8 w-8" />,
      color: 'text-yellow-600',
      bgColor: 'bg-yellow-50',
      borderColor: 'border-yellow-200'
    }
  ];

  const subscribeToPlan = (planId: string) => {
    setSelectedPlan(planId);
    const plan = plans.find(p => p.id === planId);
    toast({
      title: "Subscription Initiated!",
      description: `${plan?.name} subscription started. You'll receive your first shipment within 3-5 days.`,
    });
  };

  const savings = billingCycle === 'yearly' ? 20 : 0;

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-white to-blue-50">
      <nav className="border-b bg-white/95 backdrop-blur-md sticky top-0 z-50 shadow-sm">
        <div className="container mx-auto px-4 py-4">
          <Link to="/" className="flex items-center space-x-2 hover:opacity-80 transition-opacity">
            <Leaf className="h-6 w-6 text-green-600" />
            <span className="text-xl font-bold text-gray-800">AyurGen - Subscription Plans</span>
          </Link>
        </div>
      </nav>

      <div className="container mx-auto px-4 py-8 max-w-7xl">
        <div className="text-center mb-8 animate-fade-in">
          <h1 className="text-4xl font-bold text-gray-800 mb-4 bg-gradient-to-r from-green-600 to-blue-600 bg-clip-text text-transparent">
            Wellness Subscription Plans
          </h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Get your personalized Ayurvedic products delivered monthly with AI-powered health tracking
          </p>
        </div>

        {/* Billing Toggle */}
        <div className="flex justify-center mb-8 animate-scale-in">
          <Card className="p-4 border-0 shadow-lg">
            <div className="flex items-center space-x-4">
              <Label htmlFor="billing-toggle" className="text-sm font-medium">Monthly</Label>
              <Switch
                id="billing-toggle"
                checked={billingCycle === 'yearly'}
                onCheckedChange={(checked) => setBillingCycle(checked ? 'yearly' : 'monthly')}
              />
              <Label htmlFor="billing-toggle" className="text-sm font-medium">
                Yearly 
                {savings > 0 && (
                  <Badge className="ml-2 bg-green-100 text-green-800">
                    Save {savings}%
                  </Badge>
                )}
              </Label>
            </div>
          </Card>
        </div>

        {/* Subscription Plans */}
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
          {plans.map((plan, index) => (
            <Card 
              key={plan.id}
              className={`relative border-0 shadow-lg hover:shadow-xl transition-all duration-500 hover:scale-105 ${plan.bgColor} ${plan.borderColor} border-2 animate-scale-in`}
              style={{ animationDelay: `${index * 0.1}s` }}
            >
              {plan.popular && (
                <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                  <Badge className="bg-gradient-to-r from-purple-600 to-pink-600 text-white px-4 py-1">
                    <Star className="w-3 h-3 mr-1" />
                    Most Popular
                  </Badge>
                </div>
              )}

              <CardHeader className="text-center pb-4">
                <div className={`w-16 h-16 mx-auto mb-4 rounded-full flex items-center justify-center ${plan.bgColor} ${plan.color}`}>
                  {plan.icon}
                </div>
                <CardTitle className={`text-xl ${plan.color}`}>{plan.name}</CardTitle>
                <CardDescription className="text-gray-600">
                  {plan.description}
                </CardDescription>
              </CardHeader>

              <CardContent className="space-y-4">
                <div className="text-center">
                  <div className="flex items-center justify-center space-x-2">
                    <span className={`text-3xl font-bold ${plan.color}`}>
                      ₹{plan.price}
                    </span>
                    <span className="text-sm text-gray-500">{plan.duration}</span>
                  </div>
                  {plan.originalPrice && (
                    <div className="text-sm text-gray-500 line-through">
                      ₹{plan.originalPrice}{plan.duration}
                    </div>
                  )}
                </div>

                <div className="space-y-2">
                  <h4 className="font-semibold text-gray-800 text-sm">Key Features:</h4>
                  {plan.features.slice(0, 4).map((feature, idx) => (
                    <div key={idx} className="flex items-start space-x-2 text-sm">
                      <Check className="w-4 h-4 text-green-600 mt-0.5 flex-shrink-0" />
                      <span className="text-gray-700">{feature}</span>
                    </div>
                  ))}
                  {plan.features.length > 4 && (
                    <div className="text-xs text-gray-500">
                      +{plan.features.length - 4} more features
                    </div>
                  )}
                </div>

                <div className="space-y-2">
                  <h4 className="font-semibold text-gray-800 text-sm">Monthly Products:</h4>
                  <div className="flex flex-wrap gap-1">
                    {plan.products.map((product, idx) => (
                      <Badge key={idx} variant="outline" className="text-xs">
                        {product}
                      </Badge>
                    ))}
                  </div>
                </div>

                <Button
                  onClick={() => subscribeToPlan(plan.id)}
                  disabled={selectedPlan === plan.id}
                  className={`w-full mt-4 ${plan.color === 'text-purple-600' ? 'bg-gradient-to-r from-purple-600 to-pink-600' : 'bg-gradient-to-r from-green-600 to-blue-600'} hover:shadow-lg transition-all duration-300`}
                >
                  {selectedPlan === plan.id ? (
                    <>
                      <Check className="w-4 h-4 mr-2" />
                      Subscribed
                    </>
                  ) : (
                    <>
                      <Package className="w-4 h-4 mr-2" />
                      Subscribe Now
                    </>
                  )}
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Subscription Benefits */}
        <div className="grid md:grid-cols-3 gap-6 mb-12">
          <Card className="border-0 shadow-lg hover:shadow-xl transition-all duration-300 animate-scale-in">
            <CardContent className="p-6 text-center">
              <Truck className="mx-auto h-12 w-12 text-blue-600 mb-4" />
              <h3 className="font-semibold text-gray-800 mb-2">Auto-Delivery</h3>
              <p className="text-sm text-gray-600">Get your products delivered automatically every month. Cancel or modify anytime.</p>
            </CardContent>
          </Card>

          <Card className="border-0 shadow-lg hover:shadow-xl transition-all duration-300 animate-scale-in">
            <CardContent className="p-6 text-center">
              <Calendar className="mx-auto h-12 w-12 text-green-600 mb-4" />
              <h3 className="font-semibold text-gray-800 mb-2">AI Follow-ups</h3>
              <p className="text-sm text-gray-600">Regular health check-ins and progress tracking with personalized recommendations.</p>
            </CardContent>
          </Card>

          <Card className="border-0 shadow-lg hover:shadow-xl transition-all duration-300 animate-scale-in">
            <CardContent className="p-6 text-center">
              <Gift className="mx-auto h-12 w-12 text-purple-600 mb-4" />
              <h3 className="font-semibold text-gray-800 mb-2">Exclusive Benefits</h3>
              <p className="text-sm text-gray-600">Priority support, special discounts, and access to premium wellness content.</p>
            </CardContent>
          </Card>
        </div>

        {/* FAQ Section */}
        <Card className="border-0 shadow-lg">
          <CardHeader>
            <CardTitle>Frequently Asked Questions</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <h4 className="font-semibold text-gray-800 mb-2">How does auto-delivery work?</h4>
              <p className="text-gray-600 text-sm">Your selected products are automatically shipped every month. You can modify, pause, or cancel your subscription anytime through your dashboard.</p>
            </div>
            <div>
              <h4 className="font-semibold text-gray-800 mb-2">Can I customize my monthly box?</h4>
              <p className="text-gray-600 text-sm">Yes! Our AI analyzes your health progress and symptoms to recommend personalized product combinations. You can also manually adjust your preferences.</p>
            </div>
            <div>
              <h4 className="font-semibold text-gray-800 mb-2">What if I want to change plans?</h4>
              <p className="text-gray-600 text-sm">You can upgrade, downgrade, or switch plans anytime. Changes take effect from your next billing cycle.</p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default SubscriptionPlans;
