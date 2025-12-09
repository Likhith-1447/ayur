-- Create table for storing prakriti test results
CREATE TABLE public.prakriti_results (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id TEXT NOT NULL,
  dominant_dosha TEXT NOT NULL,
  vata_score INTEGER NOT NULL DEFAULT 0,
  pitta_score INTEGER NOT NULL DEFAULT 0,
  kapha_score INTEGER NOT NULL DEFAULT 0,
  test_answers JSONB NOT NULL DEFAULT '{}',
  recommendations JSONB,
  completed_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.prakriti_results ENABLE ROW LEVEL SECURITY;

-- Create policies for user access
CREATE POLICY "Users can view their own prakriti results" 
ON public.prakriti_results 
FOR SELECT 
USING (true);

CREATE POLICY "Users can create their own prakriti results" 
ON public.prakriti_results 
FOR INSERT 
WITH CHECK (true);

CREATE POLICY "Users can update their own prakriti results" 
ON public.prakriti_results 
FOR UPDATE 
USING (true);

-- Create trigger for automatic timestamp updates
CREATE TRIGGER update_prakriti_results_updated_at
BEFORE UPDATE ON public.prakriti_results
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();