
-- Create user profiles table to store additional user information
CREATE TABLE public.profiles (
  id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE PRIMARY KEY,
  email TEXT,
  full_name TEXT,
  avatar_url TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create health_analyses table to store medical analysis results
CREATE TABLE public.health_analyses (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  analysis_type TEXT NOT NULL, -- 'medical', 'nutrition', 'symptom', 'fitness', etc.
  input_data JSONB NOT NULL, -- Store the input parameters
  result_data JSONB NOT NULL, -- Store the AI analysis results
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create health_alerts table for storing user health alerts
CREATE TABLE public.health_alerts (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  message TEXT NOT NULL,
  severity TEXT NOT NULL CHECK (severity IN ('low', 'medium', 'high')),
  category TEXT NOT NULL,
  is_read BOOLEAN NOT NULL DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create medical_images storage bucket for user medical files
INSERT INTO storage.buckets (id, name, public) VALUES ('medical-images', 'medical-images', false);

-- Enable Row Level Security (RLS) on all tables
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.health_analyses ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.health_alerts ENABLE ROW LEVEL SECURITY;

-- RLS Policies for profiles table
CREATE POLICY "Users can view their own profile" 
  ON public.profiles FOR SELECT 
  USING (auth.uid() = id);

CREATE POLICY "Users can update their own profile" 
  ON public.profiles FOR UPDATE 
  USING (auth.uid() = id);

CREATE POLICY "Users can insert their own profile" 
  ON public.profiles FOR INSERT 
  WITH CHECK (auth.uid() = id);

-- RLS Policies for health_analyses table
CREATE POLICY "Users can view their own health analyses" 
  ON public.health_analyses FOR SELECT 
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own health analyses" 
  ON public.health_analyses FOR INSERT 
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own health analyses" 
  ON public.health_analyses FOR UPDATE 
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own health analyses" 
  ON public.health_analyses FOR DELETE 
  USING (auth.uid() = user_id);

-- RLS Policies for health_alerts table
CREATE POLICY "Users can view their own health alerts" 
  ON public.health_alerts FOR SELECT 
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own health alerts" 
  ON public.health_alerts FOR INSERT 
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own health alerts" 
  ON public.health_alerts FOR UPDATE 
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own health alerts" 
  ON public.health_alerts FOR DELETE 
  USING (auth.uid() = user_id);

-- Storage policies for medical images
CREATE POLICY "Users can upload their own medical images"
  ON storage.objects FOR INSERT
  WITH CHECK (bucket_id = 'medical-images' AND auth.uid()::text = (storage.foldername(name))[1]);

CREATE POLICY "Users can view their own medical images"
  ON storage.objects FOR SELECT
  USING (bucket_id = 'medical-images' AND auth.uid()::text = (storage.foldername(name))[1]);

CREATE POLICY "Users can update their own medical images"
  ON storage.objects FOR UPDATE
  USING (bucket_id = 'medical-images' AND auth.uid()::text = (storage.foldername(name))[1]);

CREATE POLICY "Users can delete their own medical images"
  ON storage.objects FOR DELETE
  USING (bucket_id = 'medical-images' AND auth.uid()::text = (storage.foldername(name))[1]);

-- Create trigger to automatically create user profile on signup
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, email, full_name, avatar_url)
  VALUES (
    new.id,
    new.email,
    COALESCE(new.raw_user_meta_data->>'full_name', new.raw_user_meta_data->>'name'),
    new.raw_user_meta_data->>'avatar_url'
  );
  RETURN new;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE PROCEDURE public.handle_new_user();

-- Create indexes for better performance
CREATE INDEX idx_health_analyses_user_id ON public.health_analyses(user_id);
CREATE INDEX idx_health_analyses_type ON public.health_analyses(analysis_type);
CREATE INDEX idx_health_analyses_created_at ON public.health_analyses(created_at DESC);
CREATE INDEX idx_health_alerts_user_id ON public.health_alerts(user_id);
CREATE INDEX idx_health_alerts_created_at ON public.health_alerts(created_at DESC);
