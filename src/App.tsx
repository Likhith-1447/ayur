
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { SignedIn, SignedOut } from '@clerk/clerk-react';
import { ThemeProvider } from "@/contexts/ThemeContext";
import { SidebarProvider, SidebarInset } from "@/components/ui/sidebar";
import { MedicalAnalysisSidebar } from "@/components/MedicalAnalysisSidebar";
import AuthPage from "@/components/AuthPage";
import Index from "./pages/Index";
import MedicalAnalysis from "./pages/MedicalAnalysis";
import AyurvedicProducts from "./pages/AyurvedicProducts";
import Cart from "./pages/Cart";
import Checkout from "./pages/Checkout";
import Orders from "./pages/Orders";
import HealthRecommendations from "./pages/HealthRecommendations";
import SymptomChecker from "./pages/SymptomChecker";
import NutritionAdvisor from "./pages/NutritionAdvisor";
import FitnessPlanner from "./pages/FitnessPlanner";
import NotFound from "./pages/NotFound";
import Assistant from "./pages/Assistant";
import Alerts from "./pages/Alerts";
import PrakritiTest from "./pages/PrakritiTest";
import Consultation from "./pages/Consultation";
import Dashboard from "./pages/Dashboard";
import SubscriptionPlans from "./pages/SubscriptionPlans";
import AdminAnalytics from "./pages/AdminAnalytics";
import Profile from "./pages/Profile";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <ThemeProvider>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <SignedOut>
            <div className="min-h-screen bg-gradient-to-br from-background via-background/50 to-muted/30">
              <AuthPage />
            </div>
          </SignedOut>
          <SignedIn>
            <SidebarProvider>
              <div className="flex min-h-screen w-full bg-gradient-to-br from-background via-background/50 to-muted/30">
                <MedicalAnalysisSidebar />
                
                <SidebarInset className="flex-1">
                  <Routes>
                    <Route path="/" element={<Dashboard />} />
                    <Route path="/analysis" element={<MedicalAnalysis />} />
          <Route path="/products" element={<AyurvedicProducts />} />
          <Route path="/cart" element={<Cart />} />
          <Route path="/checkout" element={<Checkout />} />
          <Route path="/orders" element={<Orders />} />
                    <Route path="/recommendations" element={<HealthRecommendations />} />
                    <Route path="/symptom-checker" element={<SymptomChecker />} />
                    <Route path="/nutrition" element={<NutritionAdvisor />} />
                    <Route path="/fitness" element={<FitnessPlanner />} />
                    <Route path="/assistant" element={<Assistant />} />
                    <Route path="/alerts" element={<Alerts />} />
                    <Route path="/prakriti-test" element={<PrakritiTest />} />
                    <Route path="/consultation" element={<Consultation />} />
                    <Route path="/dashboard" element={<Dashboard />} />
                    <Route path="/profile" element={<Profile />} />
                    <Route path="/subscriptions" element={<SubscriptionPlans />} />
                    <Route path="/admin/analytics" element={<AdminAnalytics />} />
                    {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
                    <Route path="*" element={<NotFound />} />
                  </Routes>
                </SidebarInset>
              </div>
            </SidebarProvider>
          </SignedIn>
        </BrowserRouter>
      </TooltipProvider>
    </ThemeProvider>
  </QueryClientProvider>
);

export default App;
