-- Create profiles table
CREATE TABLE IF NOT EXISTS public.profiles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id TEXT NOT NULL UNIQUE,
  full_name TEXT,
  email TEXT,
  phone TEXT,
  avatar_url TEXT,
  date_of_birth DATE,
  gender TEXT,
  address TEXT,
  city TEXT,
  state TEXT,
  pincode TEXT,
  emergency_contact TEXT,
  emergency_phone TEXT,
  medical_history TEXT,
  allergies TEXT,
  current_medications TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create health_analyses table
CREATE TABLE IF NOT EXISTS public.health_analyses (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id TEXT NOT NULL,
  analysis_type TEXT NOT NULL,
  input_data JSONB,
  result JSONB,
  recommendations TEXT,
  severity TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create health_alerts table
CREATE TABLE IF NOT EXISTS public.health_alerts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id TEXT NOT NULL,
  title TEXT NOT NULL,
  message TEXT NOT NULL,
  type TEXT NOT NULL,
  severity TEXT,
  is_read BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create user_activities table
CREATE TABLE IF NOT EXISTS public.user_activities (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id TEXT NOT NULL,
  activity_type TEXT NOT NULL,
  description TEXT,
  points INT DEFAULT 0,
  metadata JSONB,
  completed_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create daily_claims table
CREATE TABLE IF NOT EXISTS public.daily_claims (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id TEXT NOT NULL,
  points INT DEFAULT 0,
  streak_count INT DEFAULT 1,
  claimed_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create user_stats table
CREATE TABLE IF NOT EXISTS public.user_stats (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id TEXT NOT NULL UNIQUE,
  total_points INT DEFAULT 0,
  level INT DEFAULT 1,
  streak_count INT DEFAULT 0,
  last_claim_date DATE,
  analyses_count INT DEFAULT 0,
  consultations_count INT DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create achievements table
CREATE TABLE IF NOT EXISTS public.achievements (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id TEXT NOT NULL,
  title TEXT NOT NULL,
  description TEXT,
  badge_icon TEXT,
  points INT DEFAULT 0,
  unlocked_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create prakriti_results table
CREATE TABLE IF NOT EXISTS public.prakriti_results (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id TEXT NOT NULL UNIQUE,
  vata_score INT DEFAULT 0,
  pitta_score INT DEFAULT 0,
  kapha_score INT DEFAULT 0,
  dominant_dosha TEXT,
  recommendations TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create products table
CREATE TABLE IF NOT EXISTS public.products (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  description TEXT,
  price DECIMAL(10,2) NOT NULL,
  image_url TEXT,
  category TEXT,
  dosha_type TEXT,
  ingredients TEXT,
  benefits TEXT,
  usage_instructions TEXT,
  stock_quantity INT DEFAULT 0,
  rating DECIMAL(2,1),
  reviews_count INT DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create cart_items table
CREATE TABLE IF NOT EXISTS public.cart_items (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id TEXT NOT NULL,
  product_id UUID REFERENCES public.products(id) ON DELETE CASCADE,
  quantity INT DEFAULT 1,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create orders table
CREATE TABLE IF NOT EXISTS public.orders (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id TEXT NOT NULL,
  total_amount DECIMAL(10,2) NOT NULL,
  status TEXT DEFAULT 'pending',
  payment_id TEXT,
  payment_method TEXT,
  shipping_address TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create order_items table
CREATE TABLE IF NOT EXISTS public.order_items (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  order_id UUID REFERENCES public.orders(id) ON DELETE CASCADE,
  product_id UUID REFERENCES public.products(id),
  quantity INT NOT NULL,
  price DECIMAL(10,2) NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create consultations table
CREATE TABLE IF NOT EXISTS public.consultations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id TEXT NOT NULL,
  doctor_id TEXT,
  doctor_name TEXT NOT NULL,
  patient_name TEXT NOT NULL,
  patient_email TEXT NOT NULL,
  patient_phone TEXT NOT NULL,
  consultation_type TEXT NOT NULL CHECK (consultation_type IN ('video', 'chat')),
  preferred_date DATE NOT NULL,
  preferred_time TEXT,
  symptoms TEXT,
  meeting_link TEXT,
  meeting_id TEXT,
  status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'confirmed', 'completed', 'cancelled')),
  total_amount DECIMAL(10,2) NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Enable RLS on all tables
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.health_analyses ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.health_alerts ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_activities ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.daily_claims ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_stats ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.achievements ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.prakriti_results ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.products ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.cart_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.order_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.consultations ENABLE ROW LEVEL SECURITY;

-- RLS Policies for profiles
CREATE POLICY "Users can view their own profile" ON public.profiles FOR SELECT USING (user_id = auth.uid()::text);
CREATE POLICY "Users can insert their own profile" ON public.profiles FOR INSERT WITH CHECK (user_id = auth.uid()::text);
CREATE POLICY "Users can update their own profile" ON public.profiles FOR UPDATE USING (user_id = auth.uid()::text);

-- RLS Policies for health_analyses
CREATE POLICY "Users can view their own analyses" ON public.health_analyses FOR SELECT USING (user_id = auth.uid()::text);
CREATE POLICY "Users can insert their own analyses" ON public.health_analyses FOR INSERT WITH CHECK (user_id = auth.uid()::text);

-- RLS Policies for health_alerts
CREATE POLICY "Users can view their own alerts" ON public.health_alerts FOR SELECT USING (user_id = auth.uid()::text);
CREATE POLICY "Users can insert their own alerts" ON public.health_alerts FOR INSERT WITH CHECK (user_id = auth.uid()::text);
CREATE POLICY "Users can update their own alerts" ON public.health_alerts FOR UPDATE USING (user_id = auth.uid()::text);

-- RLS Policies for user_activities
CREATE POLICY "Users can view their own activities" ON public.user_activities FOR SELECT USING (user_id = auth.uid()::text);
CREATE POLICY "Users can insert their own activities" ON public.user_activities FOR INSERT WITH CHECK (user_id = auth.uid()::text);

-- RLS Policies for daily_claims
CREATE POLICY "Users can view their own claims" ON public.daily_claims FOR SELECT USING (user_id = auth.uid()::text);
CREATE POLICY "Users can insert their own claims" ON public.daily_claims FOR INSERT WITH CHECK (user_id = auth.uid()::text);

-- RLS Policies for user_stats
CREATE POLICY "Users can view their own stats" ON public.user_stats FOR SELECT USING (user_id = auth.uid()::text);
CREATE POLICY "Users can insert their own stats" ON public.user_stats FOR INSERT WITH CHECK (user_id = auth.uid()::text);
CREATE POLICY "Users can update their own stats" ON public.user_stats FOR UPDATE USING (user_id = auth.uid()::text);

-- RLS Policies for achievements
CREATE POLICY "Users can view their own achievements" ON public.achievements FOR SELECT USING (user_id = auth.uid()::text);
CREATE POLICY "Users can insert their own achievements" ON public.achievements FOR INSERT WITH CHECK (user_id = auth.uid()::text);

-- RLS Policies for prakriti_results
CREATE POLICY "Users can view their own prakriti" ON public.prakriti_results FOR SELECT USING (user_id = auth.uid()::text);
CREATE POLICY "Users can insert their own prakriti" ON public.prakriti_results FOR INSERT WITH CHECK (user_id = auth.uid()::text);
CREATE POLICY "Users can update their own prakriti" ON public.prakriti_results FOR UPDATE USING (user_id = auth.uid()::text);

-- RLS Policies for products (public read)
CREATE POLICY "Anyone can view products" ON public.products FOR SELECT USING (true);

-- RLS Policies for cart_items
CREATE POLICY "Users can view their own cart" ON public.cart_items FOR SELECT USING (user_id = auth.uid()::text);
CREATE POLICY "Users can insert to their own cart" ON public.cart_items FOR INSERT WITH CHECK (user_id = auth.uid()::text);
CREATE POLICY "Users can update their own cart" ON public.cart_items FOR UPDATE USING (user_id = auth.uid()::text);
CREATE POLICY "Users can delete from their own cart" ON public.cart_items FOR DELETE USING (user_id = auth.uid()::text);

-- RLS Policies for orders
CREATE POLICY "Users can view their own orders" ON public.orders FOR SELECT USING (user_id = auth.uid()::text);
CREATE POLICY "Users can insert their own orders" ON public.orders FOR INSERT WITH CHECK (user_id = auth.uid()::text);

-- RLS Policies for order_items
CREATE POLICY "Users can view their order items" ON public.order_items FOR SELECT USING (
  EXISTS (SELECT 1 FROM public.orders WHERE orders.id = order_items.order_id AND orders.user_id = auth.uid()::text)
);

-- RLS Policies for consultations
CREATE POLICY "Users can view their own consultations" ON public.consultations FOR SELECT USING (user_id = auth.uid()::text);
CREATE POLICY "Users can insert their own consultations" ON public.consultations FOR INSERT WITH CHECK (user_id = auth.uid()::text);
CREATE POLICY "Users can update their own consultations" ON public.consultations FOR UPDATE USING (user_id = auth.uid()::text);

-- Create update timestamp function
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Add triggers for updated_at
CREATE TRIGGER update_profiles_updated_at BEFORE UPDATE ON public.profiles FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_user_stats_updated_at BEFORE UPDATE ON public.user_stats FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_orders_updated_at BEFORE UPDATE ON public.orders FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_consultations_updated_at BEFORE UPDATE ON public.consultations FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();